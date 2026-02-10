-- ATA360 — ClickHouse: AUDITOR Metrics
--
-- Tabela para analytics de conformidade do AUDITOR.
-- Dados inseridos pelo cron mensal calibrate-auditor.
--
-- @see Spec v8 Part 07 — AUDITOR Agent

CREATE TABLE IF NOT EXISTS auditor_metrics (
  orgao_id UUID,
  processo_id UUID,
  documento_tipo LowCardinality(String),
  veredicto LowCardinality(String),
  score UInt8,
  selo_aprovado UInt8 DEFAULT 0,
  total_checks UInt16 DEFAULT 0,
  checks_conformes UInt16 DEFAULT 0,
  checks_nao_conformes UInt16 DEFAULT 0,
  decisao_usuario LowCardinality(Nullable(String)),
  iteracao UInt8 DEFAULT 1,
  setor LowCardinality(Nullable(String)),
  created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (orgao_id, documento_tipo, created_at)
TTL created_at + INTERVAL 2 YEAR;

-- Materialized view: conformidade mensal por documento
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_auditor_mensal
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(mes)
ORDER BY (documento_tipo, mes)
AS SELECT
  documento_tipo,
  toStartOfMonth(created_at) AS mes,
  countState() AS total,
  countIfState(veredicto = 'CONFORME') AS conformes,
  countIfState(veredicto = 'RESSALVAS') AS ressalvas,
  countIfState(veredicto = 'NAO_CONFORME') AS nao_conformes,
  avgState(score) AS score_medio,
  sumState(selo_aprovado) AS selos_total,
  avgState(checks_nao_conformes) AS achados_medio
FROM auditor_metrics
GROUP BY documento_tipo, mes;
