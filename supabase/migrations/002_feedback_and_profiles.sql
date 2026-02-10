-- ═══════════════════════════════════════════════════════════════════════════════
-- ATA360 — Migration 002: Feedback de Normalização + Perfil de Usuário
--
-- Feedback: usuários corrigem normalização → 3+ correções iguais → propaga D1.
-- Perfil: sistema aprende segmento, terminologia e itens frequentes.
--
-- @see Spec v8 Part 16 — Normalização Linguística
-- @see Spec v8 Part 19 — Segurança (prompts/pesos nunca no frontend)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Feedback de Termos Normalizados ────────────────────────────────────────
-- Registra cada correção de normalização feita pelo usuário.
-- Propagação: cron 6h verifica 3+ correções iguais → INSERT no D1.
CREATE TABLE feedback_termos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  processo_id UUID REFERENCES processos(id),

  -- Termos
  termo_original TEXT NOT NULL,
  termo_normalizado_sistema TEXT NOT NULL,
  catmat_sugerido_sistema TEXT,
  termo_corrigido_usuario TEXT,
  catmat_corrigido_usuario TEXT,

  -- Tipo e contexto
  tipo_feedback TEXT NOT NULL CHECK (tipo_feedback IN (
    'correcao_termo', 'correcao_catmat', 'aprovacao', 'rejeicao'
  )),
  setor TEXT,
  regiao_uf CHAR(2),

  -- Workflow de propagação
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'validado', 'propagado', 'rejeitado'
  )),
  validado_por UUID REFERENCES usuarios(id),
  propagado_em TIMESTAMPTZ,

  -- Métricas
  confianca_original REAL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_orgao ON feedback_termos(orgao_id);
CREATE INDEX idx_feedback_usuario ON feedback_termos(usuario_id);
CREATE INDEX idx_feedback_status ON feedback_termos(status);
CREATE INDEX idx_feedback_termo ON feedback_termos(termo_original);
CREATE INDEX idx_feedback_correcao ON feedback_termos(termo_corrigido_usuario);
CREATE INDEX idx_feedback_created ON feedback_termos(created_at);

-- ─── Perfil de Usuário (aprendizado contínuo) ──────────────────────────────
-- Construído automaticamente a partir do uso do sistema.
-- Usado para desambiguação contextual e personalização de sugestões.
CREATE TABLE perfil_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) UNIQUE,
  orgao_id UUID NOT NULL REFERENCES orgaos(id),

  -- Segmento inferido
  segmento_principal TEXT,              -- 'SAUDE', 'TI', 'EDUCACAO', etc.
  segmentos_secundarios TEXT[],

  -- Dados aprendidos (JSONB para flexibilidade)
  termos_frequentes JSONB DEFAULT '[]'::jsonb,
  catmat_frequentes JSONB DEFAULT '[]'::jsonb,
  preferencias_terminologia JSONB DEFAULT '{}'::jsonb,

  -- Contexto geográfico e organizacional
  regiao_uf CHAR(2),
  porte_orgao TEXT,                     -- 'pequeno', 'medio', 'grande'

  -- Métricas de uso
  taxa_aprovacao_acma REAL,             -- % sugestões ACMA aprovadas sem edição
  taxa_edicao_media REAL,               -- % médio de edição nas sugestões
  temas_recorrentes TEXT[],
  documentos_mais_gerados TEXT[],       -- ['ETP', 'TR', 'DFD']

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_perfil_usuario ON perfil_usuario(usuario_id);
CREATE INDEX idx_perfil_orgao ON perfil_usuario(orgao_id);
CREATE INDEX idx_perfil_segmento ON perfil_usuario(segmento_principal);

-- ─── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE feedback_termos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfil_usuario ENABLE ROW LEVEL SECURITY;

-- Feedback: usuário vê só feedbacks do seu órgão
CREATE POLICY "Feedback visível apenas do órgão"
  ON feedback_termos FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Feedback: usuário pode inserir feedback no seu órgão
CREATE POLICY "Feedback insert do órgão"
  ON feedback_termos FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Feedback: admin pode atualizar status (validar/rejeitar)
CREATE POLICY "Feedback update admin do órgão"
  ON feedback_termos FOR UPDATE
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Perfil: usuário vê apenas seu próprio perfil
CREATE POLICY "Perfil visível apenas pelo próprio usuário"
  ON perfil_usuario FOR SELECT
  USING (usuario_id = auth.uid());

-- Perfil: usuário pode inserir seu próprio perfil
CREATE POLICY "Perfil insert próprio"
  ON perfil_usuario FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

-- Perfil: usuário pode atualizar seu próprio perfil
CREATE POLICY "Perfil update próprio"
  ON perfil_usuario FOR UPDATE
  USING (usuario_id = auth.uid());

-- ─── Triggers ───────────────────────────────────────────────────────────────

CREATE TRIGGER perfil_usuario_updated_at
  BEFORE UPDATE ON perfil_usuario
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── View: Feedback agregado para propagação ────────────────────────────────
-- Usada pelo cron de propagação: encontra correções com 3+ ocorrências iguais.
CREATE OR REPLACE VIEW v_feedback_propagavel AS
SELECT
  termo_original,
  termo_corrigido_usuario,
  catmat_corrigido_usuario,
  setor,
  COUNT(DISTINCT usuario_id) AS total_usuarios,
  COUNT(*) AS total_feedbacks,
  AVG(confianca_original) AS confianca_media_original,
  MAX(created_at) AS ultimo_feedback
FROM feedback_termos
WHERE status = 'pendente'
  AND tipo_feedback IN ('correcao_termo', 'correcao_catmat')
  AND termo_corrigido_usuario IS NOT NULL
GROUP BY termo_original, termo_corrigido_usuario, catmat_corrigido_usuario, setor
HAVING COUNT(DISTINCT usuario_id) >= 3;
