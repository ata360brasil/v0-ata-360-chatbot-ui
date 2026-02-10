-- ============================================================================
-- ATA360 — Normalização Linguística (D1 SQLite)
-- Migration 0001: Tabelas de referência para pipeline de normalização
--
-- Estas tabelas são populadas pelo seed script (workers/scripts/seed-normalization.ts)
-- a partir dos JSONs em data/normalizacao/.
-- ============================================================================

-- 1. termos_normalizados: sinônimos setoriais (sinonimos.json)
CREATE TABLE IF NOT EXISTS termos_normalizados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_usuario TEXT NOT NULL,
  termo_normalizado TEXT NOT NULL,
  catmat_preferencial TEXT,
  setor TEXT NOT NULL,
  confianca REAL NOT NULL DEFAULT 0.5,
  fonte TEXT,
  desambiguacao TEXT,           -- JSON: {"SAUDE":"monitor multiparametrico","TI":"monitor LED"}
  ativo INTEGER NOT NULL DEFAULT 1,
  origem TEXT NOT NULL DEFAULT 'seed', -- 'seed','feedback','manual'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_termos_usuario ON termos_normalizados(termo_usuario);
CREATE INDEX IF NOT EXISTS idx_termos_normalizado ON termos_normalizados(termo_normalizado);
CREATE INDEX IF NOT EXISTS idx_termos_setor ON termos_normalizados(setor);
CREATE INDEX IF NOT EXISTS idx_termos_ativo ON termos_normalizados(ativo);

-- 2. variantes: cada variante mapeia para um termos_normalizados
CREATE TABLE IF NOT EXISTS variantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_id INTEGER NOT NULL REFERENCES termos_normalizados(id) ON DELETE CASCADE,
  variante TEXT NOT NULL,
  confianca REAL NOT NULL DEFAULT 0.8
);

CREATE INDEX IF NOT EXISTS idx_variantes_texto ON variantes(variante);
CREATE INDEX IF NOT EXISTS idx_variantes_termo_id ON variantes(termo_id);

-- 3. abreviaturas: expansão de abreviaturas (abreviaturas.json)
CREATE TABLE IF NOT EXISTS abreviaturas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  abreviatura TEXT NOT NULL,
  expansao TEXT NOT NULL,
  contexto TEXT,                -- 'endereco','legislacao','medida','orgao','saude','ti', etc.
  categoria TEXT NOT NULL       -- 'ENDERECOS_LOGRADOUROS','UNIDADES_MEDIDA', etc.
);

CREATE INDEX IF NOT EXISTS idx_abrev_texto ON abreviaturas(abreviatura);
CREATE INDEX IF NOT EXISTS idx_abrev_categoria ON abreviaturas(categoria);

-- 4. regionalismos: termos regionais → oficiais (regionalismos.json)
CREATE TABLE IF NOT EXISTS regionalismos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_regional TEXT NOT NULL,
  termo_oficial TEXT NOT NULL,
  nome_cientifico TEXT,
  regioes TEXT NOT NULL,        -- JSON array: ["N","NE","S"]
  catmat TEXT,
  categoria TEXT NOT NULL,      -- 'alimentos','construcao','saude','geral'
  fonte TEXT,
  nota TEXT
);

CREATE INDEX IF NOT EXISTS idx_regional_termo ON regionalismos(termo_regional);
CREATE INDEX IF NOT EXISTS idx_regional_categoria ON regionalismos(categoria);

-- 5. marcas_genericas: marca → termo genérico (marcas_genericas.json)
CREATE TABLE IF NOT EXISTS marcas_genericas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marca TEXT NOT NULL,
  termo_generico TEXT NOT NULL,
  catmat_grupo TEXT,
  categoria TEXT NOT NULL,
  alerta TEXT,
  exemplo_descritivo TEXT,
  base_legal_especifica TEXT
);

CREATE INDEX IF NOT EXISTS idx_marca_texto ON marcas_genericas(marca);
CREATE INDEX IF NOT EXISTS idx_marca_categoria ON marcas_genericas(categoria);

-- 6. glossario_tecnico: popular → técnico → legal (glossario_tecnico.json)
CREATE TABLE IF NOT EXISTS glossario_tecnico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_popular TEXT NOT NULL,
  termo_tecnico TEXT NOT NULL,
  termo_legal TEXT,
  termo_cientifico TEXT,
  termo_catmat TEXT,
  definicao TEXT,
  norma TEXT,
  norma_especifica TEXT,
  setor TEXT NOT NULL,
  catmat_grupo TEXT,
  anvisa INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_glossario_popular ON glossario_tecnico(termo_popular);
CREATE INDEX IF NOT EXISTS idx_glossario_setor ON glossario_tecnico(setor);

-- 7. catmat_enriquecido: códigos CATMAT/CATSER enriquecidos (catmat_enriquecido.json)
CREATE TABLE IF NOT EXISTS catmat_enriquecido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'catmat', -- 'catmat' ou 'catser'
  descricao_oficial TEXT NOT NULL,
  descricao_enriquecida TEXT,
  grupo TEXT,
  status TEXT NOT NULL DEFAULT 'ATIVO',
  assertividade_base REAL NOT NULL DEFAULT 0.5,
  volume_estimado TEXT,         -- 'muito_alto','alto','medio','baixo'
  termos_busca TEXT NOT NULL,   -- JSON array
  especificacoes TEXT,          -- JSON object
  desambiguacao TEXT,           -- JSON map by sector
  variantes_catmat TEXT,        -- JSON map
  codigos_relacionados TEXT,    -- JSON array
  segmentos_uso TEXT,           -- JSON array
  alerta TEXT,
  categoria TEXT NOT NULL,
  dcb TEXT,                     -- Denominação Comum Brasileira (medicamentos)
  forma_farmaceutica TEXT
);

CREATE INDEX IF NOT EXISTS idx_catmat_codigo ON catmat_enriquecido(codigo);
CREATE INDEX IF NOT EXISTS idx_catmat_categoria ON catmat_enriquecido(categoria);
CREATE INDEX IF NOT EXISTS idx_catmat_status ON catmat_enriquecido(status);

-- ============================================================================
-- FTS (Full-Text Search) virtual tables para busca textual rápida
-- ============================================================================

CREATE VIRTUAL TABLE IF NOT EXISTS fts_termos USING fts5(
  termo_usuario,
  termo_normalizado,
  setor,
  content=termos_normalizados,
  content_rowid=id
);

CREATE VIRTUAL TABLE IF NOT EXISTS fts_catmat USING fts5(
  descricao_oficial,
  descricao_enriquecida,
  termos_busca,
  content=catmat_enriquecido,
  content_rowid=id
);

-- Triggers para manter FTS atualizado
CREATE TRIGGER IF NOT EXISTS trg_termos_ai AFTER INSERT ON termos_normalizados BEGIN
  INSERT INTO fts_termos(rowid, termo_usuario, termo_normalizado, setor)
  VALUES (new.id, new.termo_usuario, new.termo_normalizado, new.setor);
END;

CREATE TRIGGER IF NOT EXISTS trg_termos_ad AFTER DELETE ON termos_normalizados BEGIN
  INSERT INTO fts_termos(fts_termos, rowid, termo_usuario, termo_normalizado, setor)
  VALUES ('delete', old.id, old.termo_usuario, old.termo_normalizado, old.setor);
END;

CREATE TRIGGER IF NOT EXISTS trg_catmat_ai AFTER INSERT ON catmat_enriquecido BEGIN
  INSERT INTO fts_catmat(rowid, descricao_oficial, descricao_enriquecida, termos_busca)
  VALUES (new.id, new.descricao_oficial, new.descricao_enriquecida, new.termos_busca);
END;

CREATE TRIGGER IF NOT EXISTS trg_catmat_ad AFTER DELETE ON catmat_enriquecido BEGIN
  INSERT INTO fts_catmat(fts_catmat, rowid, descricao_oficial, descricao_enriquecida, termos_busca)
  VALUES ('delete', old.id, old.descricao_oficial, old.descricao_enriquecida, old.termos_busca);
END;
