-- ATA360 — Migration 007: Alinhamento PBIA + SICX + PL 2.338/2023
--
-- Módulos:
--   1. Campo via_credenciamento em pca_itens (preparação SICX)
--   2. Novos tipos/categorias na ouvidoria (pedido de explicação)
--   3. Tabela aia_avaliacoes (Avaliação de Impacto Algorítmico)
--   4. Classificação de risco PBIA no compliance
--
-- @see PBIA 2024-2028 (Resolução CCT nº 4/2024)
-- @see PL 2.338/2023 (Marco Legal da IA)
-- @see Lei 15.266/2025 (SICX)
-- @see LGPD Art. 20 (direito à explicação)

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. PCA ITENS — CAMPO VIA_CREDENCIAMENTO (SICX)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Indica se o item pode/deve ser adquirido via credenciamento (SICX/Art. 79, IV)
ALTER TABLE pca_itens
  ADD COLUMN IF NOT EXISTS via_credenciamento BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE pca_itens
  ADD COLUMN IF NOT EXISTS sicx_disponivel BOOLEAN DEFAULT false;

ALTER TABLE pca_itens
  ADD COLUMN IF NOT EXISTS sicx_catalogo_ref TEXT;

COMMENT ON COLUMN pca_itens.via_credenciamento IS 'Item elegível para credenciamento (Art. 79, IV, Lei 14.133/2021)';
COMMENT ON COLUMN pca_itens.sicx_disponivel IS 'Item disponível no catálogo SICX (Lei 15.266/2025)';
COMMENT ON COLUMN pca_itens.sicx_catalogo_ref IS 'Referência do item no catálogo SICX (quando disponível)';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. OUVIDORIA — NOVOS TIPOS E CATEGORIAS PARA EXPLICAÇÃO IA
-- ═══════════════════════════════════════════════════════════════════════════════

-- Expandir CHECK constraint para incluir 'pedido_explicacao'
-- PostgreSQL: recriar constraint
ALTER TABLE ouvidoria_manifestacoes
  DROP CONSTRAINT IF EXISTS ouvidoria_manifestacoes_tipo_check;

ALTER TABLE ouvidoria_manifestacoes
  ADD CONSTRAINT ouvidoria_manifestacoes_tipo_check CHECK (tipo IN (
    'denuncia', 'reclamacao', 'sugestao', 'elogio',
    'solicitacao', 'consulta', 'pedido_explicacao'
  ));

-- Expandir categorias para incluir 'explicacao_ia'
ALTER TABLE ouvidoria_manifestacoes
  DROP CONSTRAINT IF EXISTS ouvidoria_manifestacoes_categoria_check;

ALTER TABLE ouvidoria_manifestacoes
  ADD CONSTRAINT ouvidoria_manifestacoes_categoria_check CHECK (categoria IN (
    'etica', 'assedio_moral', 'assedio_sexual',
    'corrupcao', 'fraude_licitacao', 'direcionamento',
    'conflito_interesse', 'vazamento_dados',
    'discriminacao', 'irregularidade',
    'melhoria_sistema', 'atendimento',
    'explicacao_ia', 'contestacao_ia',
    'outro'
  ));

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. AVALIAÇÃO DE IMPACTO ALGORÍTMICO (AIA)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS aia_avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  -- Identificação
  versao INTEGER NOT NULL DEFAULT 1,
  data_avaliacao DATE NOT NULL DEFAULT CURRENT_DATE,
  periodicidade TEXT NOT NULL DEFAULT 'anual' CHECK (periodicidade IN (
    'semestral', 'anual', 'bianual', 'sob_demanda'
  )),
  -- Classificação de Risco (PL 2.338/2023, Art. 14)
  nivel_risco TEXT NOT NULL DEFAULT 'alto' CHECK (nivel_risco IN (
    'baixo', 'medio', 'alto', 'inaceitavel'
  )),
  justificativa_risco TEXT NOT NULL DEFAULT 'IA aplicada em decisões da administração pública (Art. 14, PL 2.338/2023)',
  -- Descrição do sistema avaliado
  sistema_nome TEXT NOT NULL DEFAULT 'ATA360',
  sistema_versao TEXT,
  proposito TEXT NOT NULL DEFAULT 'Sistema de inteligência em contratações públicas brasileiras',
  publico_afetado TEXT NOT NULL DEFAULT 'Servidores públicos, gestores de compras, fornecedores (indireto)',
  volume_decisoes_estimado TEXT,
  -- Análise de riscos
  riscos_identificados JSONB NOT NULL DEFAULT '[]',
  medidas_mitigacao JSONB NOT NULL DEFAULT '[]',
  -- Supervisão humana
  pontos_intervencao_humana JSONB NOT NULL DEFAULT '["SUGESTAO_ACMA (revisão de texto)", "AGUARDANDO_DECISAO (aprovação/edição/descarte)"]',
  taxa_intervencao_humana DECIMAL(5,2) DEFAULT 100.00,
  -- Transparência
  nivel_explicabilidade TEXT DEFAULT 'alto' CHECK (nivel_explicabilidade IN (
    'baixo', 'medio', 'alto', 'total'
  )),
  canal_explicacao_disponivel BOOLEAN NOT NULL DEFAULT true,
  -- LGPD
  dados_pessoais_tratados JSONB DEFAULT '["nome", "cpf (mascarado)", "email", "cargo", "orgao"]',
  base_legal_lgpd TEXT DEFAULT 'Art. 7º, II e III — execução de políticas públicas e cumprimento de obrigação legal',
  dpo_designado BOOLEAN DEFAULT false,
  -- Parecer
  parecer_global TEXT CHECK (parecer_global IN (
    'conforme', 'conforme_com_ressalvas', 'nao_conforme'
  )),
  recomendacoes JSONB DEFAULT '[]',
  -- Vigência
  proxima_avaliacao DATE,
  responsavel_nome TEXT,
  responsavel_cargo TEXT,
  -- Metadados
  aprovado_por UUID REFERENCES usuarios(id),
  aprovado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aia_orgao ON aia_avaliacoes(orgao_id, data_avaliacao DESC);

-- RLS
ALTER TABLE aia_avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AIA: orgao pode ver proprias avaliacoes"
  ON aia_avaliacoes FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "AIA: localadm pode gerenciar avaliacoes"
  ON aia_avaliacoes FOR ALL
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. COMPLIANCE — CAMPO CLASSIFICAÇÃO PBIA
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS classificacao_risco_ia TEXT DEFAULT 'alto'
    CHECK (classificacao_risco_ia IN ('baixo', 'medio', 'alto', 'inaceitavel'));

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS codigo_conduta_ia BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS codigo_conduta_ia_url TEXT;

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS aia_realizada BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS aia_ultima_data DATE;

ALTER TABLE compliance_programa
  ADD COLUMN IF NOT EXISTS pbia_alinhado BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN compliance_programa.classificacao_risco_ia IS 'Classificação de risco IA conforme PL 2.338/2023';
COMMENT ON COLUMN compliance_programa.codigo_conduta_ia IS 'Código de Conduta de IA publicado';
COMMENT ON COLUMN compliance_programa.aia_realizada IS 'Avaliação de Impacto Algorítmico realizada (PL 2.338 Art. 29)';
COMMENT ON COLUMN compliance_programa.pbia_alinhado IS 'Alinhamento com PBIA 2024-2028 verificado';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE aia_avaliacoes IS 'Avaliação de Impacto Algorítmico — PL 2.338/2023, Art. 29 + PBIA 2024-2028';
