-- ═══════════════════════════════════════════════════════════════════════════════
-- ATA360 — Migration 003: Sistema de Avaliações
--
-- 4 tipos de avaliação:
-- 1. Fornecedores (contratos vigentes)
-- 2. ATA360 plataforma (obrigatória ao sair)
-- 3. Respostas IA (qualidade do chat)
-- 4. Artefatos (qualidade dos documentos gerados)
--
-- @see Spec v8 Part 16 — Feedback contínuo
-- @see Spec v8 Part 19 — Scores internos nunca no frontend
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Avaliação de Fornecedores ──────────────────────────────────────────
CREATE TABLE avaliacao_fornecedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  processo_id UUID REFERENCES processos(id),

  -- Dados do contrato / fornecedor
  contrato_numero TEXT NOT NULL,
  fornecedor_cnpj TEXT NOT NULL,
  fornecedor_nome TEXT NOT NULL,
  objeto_contrato TEXT,

  -- Ratings 1-5 estrelas (4 categorias)
  nota_fornecedor INTEGER NOT NULL CHECK (nota_fornecedor BETWEEN 1 AND 5),
  nota_entrega INTEGER NOT NULL CHECK (nota_entrega BETWEEN 1 AND 5),
  nota_qualidade INTEGER NOT NULL CHECK (nota_qualidade BETWEEN 1 AND 5),
  nota_relacionamento INTEGER NOT NULL CHECK (nota_relacionamento BETWEEN 1 AND 5),
  nota_media REAL GENERATED ALWAYS AS (
    (nota_fornecedor + nota_entrega + nota_qualidade + nota_relacionamento) / 4.0
  ) STORED,

  -- Campos adicionais
  observacao TEXT,
  recomendaria BOOLEAN,
  periodo_avaliado TEXT,              -- 'mensal', 'trimestral', 'anual', 'encerramento'

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aval_forn_orgao ON avaliacao_fornecedor(orgao_id);
CREATE INDEX idx_aval_forn_cnpj ON avaliacao_fornecedor(fornecedor_cnpj);
CREATE INDEX idx_aval_forn_created ON avaliacao_fornecedor(created_at);

-- ─── 2. Avaliação da Plataforma ATA360 (saída obrigatória) ────────────────
CREATE TABLE avaliacao_plataforma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),

  -- NPS: "De 0 a 10, recomendaria o ATA360?"
  nps_score INTEGER NOT NULL CHECK (nps_score BETWEEN 0 AND 10),

  -- Satisfação geral 1-5 estrelas
  nota_geral INTEGER NOT NULL CHECK (nota_geral BETWEEN 1 AND 5),

  -- Categorias específicas 1-5 (opcionais — rápida ao sair)
  nota_facilidade INTEGER CHECK (nota_facilidade BETWEEN 1 AND 5),
  nota_velocidade INTEGER CHECK (nota_velocidade BETWEEN 1 AND 5),
  nota_precisao INTEGER CHECK (nota_precisao BETWEEN 1 AND 5),
  nota_documentos INTEGER CHECK (nota_documentos BETWEEN 1 AND 5),

  -- Texto livre
  comentario TEXT,
  sugestao TEXT,

  -- Contexto da sessão
  duracao_sessao_minutos INTEGER,     -- tempo logado nesta sessão
  documentos_gerados INTEGER,         -- docs gerados nesta sessão
  pesquisas_realizadas INTEGER,       -- pesquisas nesta sessão

  -- Categorias de melhoria (multi-select)
  areas_melhoria TEXT[],              -- ['velocidade', 'precisao', 'interface', 'documentos', 'chat', 'precos']

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aval_plat_orgao ON avaliacao_plataforma(orgao_id);
CREATE INDEX idx_aval_plat_usuario ON avaliacao_plataforma(usuario_id);
CREATE INDEX idx_aval_plat_created ON avaliacao_plataforma(created_at);
CREATE INDEX idx_aval_plat_nps ON avaliacao_plataforma(nps_score);

-- ─── 3. Avaliação de Respostas IA (chat) ──────────────────────────────────
CREATE TABLE avaliacao_resposta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  processo_id UUID REFERENCES processos(id),

  -- Contexto da resposta
  mensagem_id TEXT,                   -- ID da mensagem avaliada
  agente TEXT NOT NULL,               -- 'acma', 'auditor', 'insight', 'orquestrador', 'chat'
  tipo_resposta TEXT,                 -- 'sugestao', 'parecer', 'pesquisa', 'documento', 'geral'

  -- Rating
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  tipo_feedback TEXT NOT NULL CHECK (tipo_feedback IN (
    'util', 'parcial', 'incorreto', 'incompleto', 'excelente'
  )),

  -- Detalhes
  comentario TEXT,
  correcao_sugerida TEXT,             -- se o usuário indicou o que estava errado

  -- Métricas internas (Part 19: nunca expostas)
  modelo_usado TEXT,                  -- 'haiku', 'sonnet', 'opus'
  tokens_input INTEGER,
  tokens_output INTEGER,
  latencia_ms INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aval_resp_orgao ON avaliacao_resposta(orgao_id);
CREATE INDEX idx_aval_resp_agente ON avaliacao_resposta(agente);
CREATE INDEX idx_aval_resp_nota ON avaliacao_resposta(nota);
CREATE INDEX idx_aval_resp_created ON avaliacao_resposta(created_at);

-- ─── 4. Avaliação de Artefatos (documentos gerados) ──────────────────────
CREATE TABLE avaliacao_artefato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  processo_id UUID REFERENCES processos(id),
  documento_id UUID REFERENCES documentos(id),

  -- Documento
  tipo_documento TEXT NOT NULL,       -- 'DFD', 'ETP', 'TR', 'PP', etc.
  versao INTEGER NOT NULL DEFAULT 1,

  -- Ratings 1-5
  nota_geral INTEGER NOT NULL CHECK (nota_geral BETWEEN 1 AND 5),
  nota_precisao_juridica INTEGER CHECK (nota_precisao_juridica BETWEEN 1 AND 5),
  nota_clareza INTEGER CHECK (nota_clareza BETWEEN 1 AND 5),
  nota_completude INTEGER CHECK (nota_completude BETWEEN 1 AND 5),
  nota_formatacao INTEGER CHECK (nota_formatacao BETWEEN 1 AND 5),

  -- Decisão
  decisao TEXT NOT NULL CHECK (decisao IN (
    'aprovado_sem_edicao', 'aprovado_com_edicao', 'rejeitado', 'refeito'
  )),
  percentual_edicao REAL,             -- 0.0 a 1.0 (quanto editou)

  -- Texto
  comentario TEXT,
  secoes_editadas TEXT[],             -- ['contexto', 'fundamentacao', 'conclusao']

  -- Iteração (loop cíclico Part 20.3)
  iteracao INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aval_art_orgao ON avaliacao_artefato(orgao_id);
CREATE INDEX idx_aval_art_tipo ON avaliacao_artefato(tipo_documento);
CREATE INDEX idx_aval_art_decisao ON avaliacao_artefato(decisao);
CREATE INDEX idx_aval_art_created ON avaliacao_artefato(created_at);

-- ─── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE avaliacao_fornecedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_plataforma ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_resposta ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_artefato ENABLE ROW LEVEL SECURITY;

-- Avaliações: leitura do órgão, insert próprio
CREATE POLICY "Avaliação fornecedor visível do órgão"
  ON avaliacao_fornecedor FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação fornecedor insert"
  ON avaliacao_fornecedor FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação plataforma visível do órgão"
  ON avaliacao_plataforma FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação plataforma insert"
  ON avaliacao_plataforma FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação resposta visível do órgão"
  ON avaliacao_resposta FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação resposta insert"
  ON avaliacao_resposta FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação artefato visível do órgão"
  ON avaliacao_artefato FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Avaliação artefato insert"
  ON avaliacao_artefato FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- ─── Views agregadas para Dashboard SuperADM ────────────────────────────────

-- NPS calculado
CREATE OR REPLACE VIEW v_nps_score AS
SELECT
  DATE_TRUNC('month', created_at) AS mes,
  COUNT(*) FILTER (WHERE nps_score >= 9) AS promotores,
  COUNT(*) FILTER (WHERE nps_score BETWEEN 7 AND 8) AS neutros,
  COUNT(*) FILTER (WHERE nps_score <= 6) AS detratores,
  COUNT(*) AS total,
  ROUND(
    (COUNT(*) FILTER (WHERE nps_score >= 9)::numeric / NULLIF(COUNT(*), 0) * 100) -
    (COUNT(*) FILTER (WHERE nps_score <= 6)::numeric / NULLIF(COUNT(*), 0) * 100)
  ) AS nps
FROM avaliacao_plataforma
GROUP BY DATE_TRUNC('month', created_at);

-- Ranking de fornecedores por nota média
CREATE OR REPLACE VIEW v_ranking_fornecedores AS
SELECT
  fornecedor_cnpj,
  fornecedor_nome,
  COUNT(*) AS total_avaliacoes,
  ROUND(AVG(nota_media)::numeric, 2) AS nota_media,
  ROUND(AVG(nota_fornecedor)::numeric, 2) AS media_fornecedor,
  ROUND(AVG(nota_entrega)::numeric, 2) AS media_entrega,
  ROUND(AVG(nota_qualidade)::numeric, 2) AS media_qualidade,
  ROUND(AVG(nota_relacionamento)::numeric, 2) AS media_relacionamento,
  COUNT(*) FILTER (WHERE recomendaria = true) AS recomendacoes
FROM avaliacao_fornecedor
GROUP BY fornecedor_cnpj, fornecedor_nome
HAVING COUNT(*) >= 1;

-- Qualidade por agente IA
CREATE OR REPLACE VIEW v_qualidade_agentes AS
SELECT
  agente,
  tipo_resposta,
  DATE_TRUNC('week', created_at) AS semana,
  COUNT(*) AS total,
  ROUND(AVG(nota)::numeric, 2) AS nota_media,
  COUNT(*) FILTER (WHERE nota >= 4) AS positivas,
  COUNT(*) FILTER (WHERE nota <= 2) AS negativas,
  ROUND(COUNT(*) FILTER (WHERE nota >= 4)::numeric / NULLIF(COUNT(*), 0) * 100) AS taxa_aprovacao
FROM avaliacao_resposta
GROUP BY agente, tipo_resposta, DATE_TRUNC('week', created_at);

-- Qualidade por tipo de documento
CREATE OR REPLACE VIEW v_qualidade_artefatos AS
SELECT
  tipo_documento,
  DATE_TRUNC('month', created_at) AS mes,
  COUNT(*) AS total,
  ROUND(AVG(nota_geral)::numeric, 2) AS nota_media,
  COUNT(*) FILTER (WHERE decisao = 'aprovado_sem_edicao') AS aprovados_direto,
  COUNT(*) FILTER (WHERE decisao = 'aprovado_com_edicao') AS aprovados_editados,
  COUNT(*) FILTER (WHERE decisao = 'rejeitado') AS rejeitados,
  ROUND(AVG(percentual_edicao)::numeric, 3) AS edicao_media
FROM avaliacao_artefato
GROUP BY tipo_documento, DATE_TRUNC('month', created_at);
