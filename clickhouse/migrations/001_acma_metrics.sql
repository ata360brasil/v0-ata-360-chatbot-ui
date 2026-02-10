-- ATA360 — ClickHouse: ACMA Metrics
--
-- Tabela para analytics de performance do ACMA.
-- Dados inseridos pelo cron semanal improve-prompts.
--
-- @see Spec v8 Part 08 — ACMA Agent

CREATE TABLE IF NOT EXISTS acma_metrics (
  orgao_id UUID,
  processo_id UUID,
  documento_tipo LowCardinality(String),
  secao LowCardinality(String),
  modelo_usado LowCardinality(String),
  tier LowCardinality(String),
  decisao LowCardinality(String),
  edit_distance UInt32 DEFAULT 0,
  edit_ratio Float32 DEFAULT 0,
  rating Nullable(UInt8),
  tokens_input UInt32 DEFAULT 0,
  tokens_output UInt32 DEFAULT 0,
  latency_ms UInt32 DEFAULT 0,
  prompt_versao UInt16 DEFAULT 0,
  prompt_hash String DEFAULT '',
  iteracao UInt8 DEFAULT 1,
  setor LowCardinality(Nullable(String)),
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (orgao_id, documento_tipo, created_at)
TTL created_at + INTERVAL 2 YEAR;

-- Materialized view: performance semanal por documento+secao
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_acma_semanal
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(semana)
ORDER BY (documento_tipo, secao, semana)
AS SELECT
  documento_tipo,
  secao,
  toMonday(created_at) AS semana,
  countState() AS total,
  countIfState(decisao = 'APROVAR') AS aprovadas,
  countIfState(decisao = 'EDITAR') AS editadas,
  countIfState(decisao = 'DESCARTAR') AS descartadas,
  avgState(edit_ratio) AS edit_ratio_medio,
  avgState(rating) AS rating_medio,
  avgState(latency_ms) AS latency_medio,
  sumState(tokens_input) AS tokens_input_total,
  sumState(tokens_output) AS tokens_output_total
FROM acma_metrics
GROUP BY documento_tipo, secao, semana;
