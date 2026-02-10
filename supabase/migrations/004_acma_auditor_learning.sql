-- ═══════════════════════════════════════════════════════════════════════════════
-- ATA360 — Migration 004: ACMA Learning + AUDITOR Calibração
--
-- ACMA: rastreia sugestões + edições → melhora prompts automaticamente.
-- AUDITOR: rastreia achados + decisões → calibra thresholds automaticamente.
--
-- @see Spec v8 Part 08 — ACMA Agent
-- @see Spec v8 Part 07 — AUDITOR Agent
-- @see Spec v8 Part 19 — prompts/pesos nunca expostos
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── ACMA: Sugestões + Rastreamento de Edições ─────────────────────────────
CREATE TABLE acma_sugestoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  processo_id UUID NOT NULL REFERENCES processos(id),

  -- Contexto do documento
  documento_tipo TEXT NOT NULL,       -- 'ETP', 'TR', 'DFD', etc.
  secao TEXT NOT NULL,                -- 'contexto', 'fundamentacao', 'conclusao', etc.

  -- Sugestão gerada
  texto_sugerido TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,          -- SHA-256 do prompt usado (Part 19: sem expor prompt)
  modelo_usado TEXT NOT NULL,         -- 'haiku', 'sonnet', 'opus'
  tier TEXT NOT NULL,                 -- 'tier1', 'tier2', 'tier3'

  -- Decisão do usuário
  decisao TEXT NOT NULL CHECK (decisao IN (
    'APROVAR', 'EDITAR', 'NOVA_SUGESTAO', 'DESCARTAR'
  )),
  texto_final TEXT,                   -- texto após edição (null se APROVAR direto)

  -- Métricas de edição (calculadas pelo edit-delta)
  edit_distance INTEGER,              -- Levenshtein word-level
  edit_ratio REAL,                    -- 0.0 a 1.0 (percentual alterado)
  diferencas JSONB,                   -- diff detalhado por seção

  -- Rating do usuário (1-5 estrelas, opcional)
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  -- Contexto
  setor TEXT,
  iteracao INTEGER NOT NULL DEFAULT 1,

  -- Métricas de performance (Part 19: internas)
  tokens_input INTEGER,
  tokens_output INTEGER,
  latencia_ms INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_acma_sug_orgao ON acma_sugestoes(orgao_id);
CREATE INDEX idx_acma_sug_processo ON acma_sugestoes(processo_id);
CREATE INDEX idx_acma_sug_tipo ON acma_sugestoes(documento_tipo, secao);
CREATE INDEX idx_acma_sug_decisao ON acma_sugestoes(decisao);
CREATE INDEX idx_acma_sug_prompt ON acma_sugestoes(prompt_hash);
CREATE INDEX idx_acma_sug_created ON acma_sugestoes(created_at);

-- ─── ACMA: Versionamento de Prompts ────────────────────────────────────────
CREATE TABLE acma_prompt_versoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificador do prompt
  documento_tipo TEXT NOT NULL,
  secao TEXT NOT NULL,
  versao INTEGER NOT NULL,

  -- Template (Part 19: NUNCA expor ao frontend)
  prompt_template TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,          -- SHA-256 para rastreabilidade

  -- Métricas de performance
  taxa_aprovacao REAL,                -- % de APROVARs diretos
  edit_distance_media REAL,           -- distância de edição média
  total_usos INTEGER NOT NULL DEFAULT 0,

  -- Estado
  ativo BOOLEAN NOT NULL DEFAULT false, -- apenas 1 ativo por (tipo, seção)
  criado_por TEXT NOT NULL DEFAULT 'sistema', -- 'sistema', 'cron_melhoria', 'manual'

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(documento_tipo, secao, versao)
);

CREATE INDEX idx_acma_pv_tipo ON acma_prompt_versoes(documento_tipo, secao);
CREATE INDEX idx_acma_pv_ativo ON acma_prompt_versoes(ativo);

-- ─── ACMA: Padrões de edição recorrentes ───────────────────────────────────
-- Populated pelo cron de melhoria: analisa top-N edições recorrentes.
CREATE TABLE acma_padroes_edicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_tipo TEXT NOT NULL,
  secao TEXT NOT NULL,

  -- Padrão detectado
  padrao_original TEXT NOT NULL,      -- o que o ACMA gerou frequentemente
  padrao_corrigido TEXT NOT NULL,     -- como os usuários corrigiram
  frequencia INTEGER NOT NULL DEFAULT 1,
  confianca REAL NOT NULL DEFAULT 0.5,

  -- Contexto
  setores TEXT[],                     -- em quais setores o padrão ocorre
  exemplo_antes TEXT,
  exemplo_depois TEXT,

  -- Status
  ativo BOOLEAN NOT NULL DEFAULT true,
  injetado_no_prompt BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_acma_pad_tipo ON acma_padroes_edicao(documento_tipo, secao);
CREATE INDEX idx_acma_pad_ativo ON acma_padroes_edicao(ativo);

-- ─── AUDITOR: Resultados de Auditoria ──────────────────────────────────────
CREATE TABLE auditor_resultados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  processo_id UUID NOT NULL REFERENCES processos(id),

  -- Resultado
  documento_tipo TEXT NOT NULL,
  veredicto TEXT NOT NULL CHECK (veredicto IN ('CONFORME', 'NAO_CONFORME', 'RESSALVAS')),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  checklist JSONB NOT NULL,           -- Array de check items
  selo_aprovado BOOLEAN NOT NULL,

  -- Decisão do usuário
  decisao_usuario TEXT CHECK (decisao_usuario IN (
    'APROVAR', 'EDITAR', 'PROSSEGUIR', 'DESCARTAR', NULL
  )),

  -- Contexto
  setor TEXT,
  iteracao INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aud_res_orgao ON auditor_resultados(orgao_id);
CREATE INDEX idx_aud_res_processo ON auditor_resultados(processo_id);
CREATE INDEX idx_aud_res_tipo ON auditor_resultados(documento_tipo);
CREATE INDEX idx_aud_res_veredicto ON auditor_resultados(veredicto);
CREATE INDEX idx_aud_res_created ON auditor_resultados(created_at);

-- ─── AUDITOR: Thresholds Calibrados ────────────────────────────────────────
-- Pesos de cada check item, ajustáveis com base em decisões reais.
CREATE TABLE auditor_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id TEXT NOT NULL,             -- ID do item de checklist
  documento_tipo TEXT NOT NULL,
  setor TEXT,                         -- null = todos os setores

  -- Configuração
  severidade TEXT NOT NULL DEFAULT 'media' CHECK (severidade IN (
    'critica', 'alta', 'media', 'baixa', 'informativa'
  )),
  peso REAL NOT NULL DEFAULT 1.0,

  -- Estatísticas de calibração
  total_avaliacoes INTEGER NOT NULL DEFAULT 0,
  taxa_override REAL NOT NULL DEFAULT 0.0, -- % vezes que usuário ignorou este finding

  -- Calibração automática
  auto_calibrado BOOLEAN NOT NULL DEFAULT false,
  calibrado_em TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(check_id, documento_tipo, setor)
);

CREATE INDEX idx_aud_th_check ON auditor_thresholds(check_id);
CREATE INDEX idx_aud_th_tipo ON auditor_thresholds(documento_tipo);

-- ─── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE acma_sugestoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acma_prompt_versoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acma_padroes_edicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditor_resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditor_thresholds ENABLE ROW LEVEL SECURITY;

-- ACMA sugestões: leitura do órgão
CREATE POLICY "ACMA sugestões do órgão"
  ON acma_sugestoes FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "ACMA sugestões insert do órgão"
  ON acma_sugestoes FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Prompt versões: leitura global (Part 19: template NUNCA retornado ao frontend)
CREATE POLICY "Prompt versões read-only global"
  ON acma_prompt_versoes FOR SELECT
  USING (true);

-- Padrões de edição: leitura global
CREATE POLICY "Padrões de edição read-only"
  ON acma_padroes_edicao FOR SELECT
  USING (true);

-- Auditor resultados: leitura do órgão
CREATE POLICY "Auditor resultados do órgão"
  ON auditor_resultados FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Auditor resultados insert do órgão"
  ON auditor_resultados FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Auditor thresholds: leitura global
CREATE POLICY "Auditor thresholds read-only"
  ON auditor_thresholds FOR SELECT
  USING (true);

-- ─── Triggers ───────────────────────────────────────────────────────────────

CREATE TRIGGER acma_padroes_updated_at
  BEFORE UPDATE ON acma_padroes_edicao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER auditor_thresholds_updated_at
  BEFORE UPDATE ON auditor_thresholds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Views para Dashboard ──────────────────────────────────────────────────

-- ACMA: Taxa de aprovação por tipo de documento
CREATE OR REPLACE VIEW v_acma_performance AS
SELECT
  documento_tipo,
  secao,
  DATE_TRUNC('week', created_at) AS semana,
  COUNT(*) AS total_sugestoes,
  COUNT(*) FILTER (WHERE decisao = 'APROVAR') AS aprovadas_direto,
  COUNT(*) FILTER (WHERE decisao = 'EDITAR') AS editadas,
  COUNT(*) FILTER (WHERE decisao = 'NOVA_SUGESTAO') AS novas_sugestoes,
  COUNT(*) FILTER (WHERE decisao = 'DESCARTAR') AS descartadas,
  ROUND(AVG(edit_ratio)::numeric, 3) AS edit_ratio_medio,
  ROUND(AVG(rating)::numeric, 2) AS rating_medio,
  ROUND(
    COUNT(*) FILTER (WHERE decisao = 'APROVAR')::numeric /
    NULLIF(COUNT(*), 0) * 100
  ) AS taxa_aprovacao
FROM acma_sugestoes
GROUP BY documento_tipo, secao, DATE_TRUNC('week', created_at);

-- AUDITOR: Conformidade por tipo de documento
CREATE OR REPLACE VIEW v_auditor_conformidade AS
SELECT
  documento_tipo,
  DATE_TRUNC('month', created_at) AS mes,
  COUNT(*) AS total_auditorias,
  COUNT(*) FILTER (WHERE veredicto = 'CONFORME') AS conformes,
  COUNT(*) FILTER (WHERE veredicto = 'RESSALVAS') AS ressalvas,
  COUNT(*) FILTER (WHERE veredicto = 'NAO_CONFORME') AS nao_conformes,
  ROUND(AVG(score)::numeric) AS score_medio,
  COUNT(*) FILTER (WHERE selo_aprovado) AS selos_aprovados,
  ROUND(
    COUNT(*) FILTER (WHERE veredicto = 'CONFORME')::numeric /
    NULLIF(COUNT(*), 0) * 100
  ) AS taxa_conformidade
FROM auditor_resultados
GROUP BY documento_tipo, DATE_TRUNC('month', created_at);
