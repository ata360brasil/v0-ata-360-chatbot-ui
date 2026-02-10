-- ATA360 — ClickHouse: Dashboard Materialized Views
--
-- Views otimizadas para o dashboard SuperADM.
-- Dados pre-agregados para consultas rapidas (<100ms).
--
-- @see Spec v8 Part 19 — Seguranca (NUNCA expor dados internos)

-- ─── Tabela de eventos de normalização ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS normalizacao_eventos (
  orgao_id UUID,
  usuario_id UUID,
  texto_hash String,
  camadas_aplicadas UInt8 DEFAULT 0,
  catmat_sugeridos UInt8 DEFAULT 0,
  alertas UInt8 DEFAULT 0,
  cache_hit UInt8 DEFAULT 0,
  duracao_ms UInt32 DEFAULT 0,
  setor LowCardinality(Nullable(String)),
  regiao_uf LowCardinality(Nullable(String)),
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (orgao_id, created_at)
TTL created_at + INTERVAL 1 YEAR;

-- View: normalização diária
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_normalizacao_diaria
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(dia)
ORDER BY (dia)
AS SELECT
  toDate(created_at) AS dia,
  countState() AS total_consultas,
  sumState(cache_hit) AS cache_hits,
  avgState(duracao_ms) AS latencia_media,
  sumState(catmat_sugeridos) AS catmat_total,
  sumState(alertas) AS alertas_total
FROM normalizacao_eventos
GROUP BY dia;

-- ─── Tabela de feedback propagado ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feedback_eventos (
  orgao_id UUID,
  tipo_feedback LowCardinality(String),
  termo_original String,
  setor LowCardinality(Nullable(String)),
  propagado UInt8 DEFAULT 0,
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at)
TTL created_at + INTERVAL 1 YEAR;

-- ─── Tabela de sessões de usuário ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessoes_usuario (
  orgao_id UUID,
  usuario_id UUID,
  duracao_minutos UInt16 DEFAULT 0,
  mensagens_enviadas UInt16 DEFAULT 0,
  documentos_gerados UInt8 DEFAULT 0,
  pesquisas_realizadas UInt8 DEFAULT 0,
  nps_score Nullable(UInt8),
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (orgao_id, created_at)
TTL created_at + INTERVAL 2 YEAR;

-- View: atividade diária
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_atividade_diaria
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(dia)
ORDER BY (dia)
AS SELECT
  toDate(created_at) AS dia,
  uniqState(usuario_id) AS usuarios_unicos,
  countState() AS total_sessoes,
  sumState(mensagens_enviadas) AS mensagens_total,
  sumState(documentos_gerados) AS documentos_total,
  sumState(pesquisas_realizadas) AS pesquisas_total,
  avgState(duracao_minutos) AS duracao_media
FROM sessoes_usuario
GROUP BY dia;

-- ─── View consolidada: qualidade mensal ────────────────────────────────────

-- Nota: esta view combina dados de ACMA e AUDITOR para visao unificada
-- O dashboard faz JOIN no app layer, não no ClickHouse

-- Index para queries frequentes
CREATE TABLE IF NOT EXISTS uso_tokens (
  orgao_id UUID,
  modelo LowCardinality(String),
  tier LowCardinality(String),
  tokens_input UInt32 DEFAULT 0,
  tokens_output UInt32 DEFAULT 0,
  custo_estimado_usd Float32 DEFAULT 0,
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (orgao_id, modelo, created_at)
TTL created_at + INTERVAL 2 YEAR;

-- View: consumo de tokens mensal
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_tokens_mensal
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(mes)
ORDER BY (modelo, mes)
AS SELECT
  modelo,
  tier,
  toStartOfMonth(created_at) AS mes,
  sumState(tokens_input) AS tokens_input_total,
  sumState(tokens_output) AS tokens_output_total,
  sumState(custo_estimado_usd) AS custo_total,
  countState() AS total_chamadas
FROM uso_tokens
GROUP BY modelo, tier, mes;
