-- ATA360 — Migration 008: Precificação Universal + Contratação + Adesão ARP
--
-- Módulos:
--   1. Tabela de preços (parâmetros reajustáveis pelo SuperADM)
--   2. Simulações de preço por ente
--   3. Contratações do ATA360 (autocontratação)
--   4. Adesão a ARP (Art. 86 Lei 14.133)
--
-- @see Decreto 12.807/2025 — Limite dispensa 2026
-- @see DN TCU 219/2025 — Coeficientes FPM 2026
-- @see Lei 14.133/2021 — Arts. 74, 75, 81, 86, 106-107

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. PARÂMETROS DE PRECIFICAÇÃO (reajustáveis pelo SuperADM)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pricing_parametros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vigencia_ano INTEGER NOT NULL UNIQUE,
  -- Equação: Preço = max(PISO, PISO × (BASE / BASE_MIN) ^ alpha)
  piso DECIMAL(12,2) NOT NULL DEFAULT 38900.00,
  base_min DECIMAL(15,2) NOT NULL DEFAULT 5000000.00,
  alpha DECIMAL(4,2) NOT NULL DEFAULT 0.35,
  -- Limite legal
  limite_dispensa DECIMAL(12,2) NOT NULL DEFAULT 65492.11,
  decreto_limite TEXT NOT NULL DEFAULT 'Decreto 12.807/2025',
  -- Fonte dos coeficientes
  dn_tcu TEXT DEFAULT 'DN TCU 219/2025',
  -- Controle
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_por UUID REFERENCES usuarios(id),
  aprovado_por UUID REFERENCES usuarios(id),
  aprovado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inserir parâmetros 2026
INSERT INTO pricing_parametros (vigencia_ano, piso, base_min, alpha, limite_dispensa)
VALUES (2026, 38900.00, 5000000.00, 0.35, 65492.11)
ON CONFLICT (vigencia_ano) DO NOTHING;

COMMENT ON TABLE pricing_parametros IS 'Parâmetros da equação universal de precificação — reajustáveis anualmente pelo SuperADM';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. SIMULAÇÕES / CÁLCULOS DE PREÇO
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS pricing_simulacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),
  -- Dados do ente
  tipo_ente TEXT NOT NULL,
  nome_ente TEXT,
  cnpj TEXT,
  populacao INTEGER,
  uf TEXT,
  -- Base de cálculo
  base_calculo DECIMAL(15,2) NOT NULL,
  fonte_base TEXT NOT NULL CHECK (fonte_base IN (
    'pncp_contratacoes', 'orcamento_loa', 'proxy_fiscal'
  )),
  fonte_url TEXT,
  data_referencia_base DATE,
  -- Resultado
  preco_anual DECIMAL(12,2) NOT NULL,
  preco_mensal DECIMAL(12,2) NOT NULL,
  aliquota_efetiva DECIMAL(8,6),
  -- Categoria (identificação, não plano)
  categoria TEXT NOT NULL CHECK (categoria IN (
    'essencial', 'basico', 'intermediario', 'avancado', 'enterprise'
  )),
  -- Modalidade
  modalidade_recomendada TEXT NOT NULL CHECK (modalidade_recomendada IN (
    'dispensa', 'inexigibilidade', 'adesao_arp',
    'dialogo_competitivo', 'contratacao_inovacao', 'emenda_parlamentar'
  )),
  -- Vigência sugerida
  vigencia_sugerida_anos INTEGER DEFAULT 1,
  -- Parâmetros usados
  parametros_id UUID REFERENCES pricing_parametros(id),
  -- Status
  status TEXT NOT NULL DEFAULT 'simulacao' CHECK (status IN (
    'simulacao', 'proposta', 'aceita', 'contratada', 'expirada'
  )),
  valida_ate DATE,
  -- Metadados
  simulado_por UUID REFERENCES usuarios(id),
  ip_origem INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pricing_sim_orgao ON pricing_simulacoes(orgao_id);
CREATE INDEX IF NOT EXISTS idx_pricing_sim_status ON pricing_simulacoes(status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. CONTRATAÇÕES DO ATA360 (autocontratação)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS contratacoes_ata360 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  simulacao_id UUID REFERENCES pricing_simulacoes(id),
  -- Contrato
  numero_contrato TEXT,
  modalidade TEXT NOT NULL,
  fundamento_legal TEXT NOT NULL,
  -- Valores
  valor_anual DECIMAL(12,2) NOT NULL,
  valor_total_contrato DECIMAL(15,2) NOT NULL,
  -- Vigência
  vigencia_inicio DATE NOT NULL,
  vigencia_fim DATE NOT NULL,
  duracao_anos INTEGER NOT NULL DEFAULT 1,
  renovavel BOOLEAN NOT NULL DEFAULT true,
  renovacao_automatica BOOLEAN NOT NULL DEFAULT true,
  renovacao_max_anos INTEGER NOT NULL DEFAULT 5,
  -- Renovações
  renovacoes_realizadas INTEGER NOT NULL DEFAULT 0,
  ultima_renovacao DATE,
  proxima_renovacao DATE,
  -- CATSER
  catser TEXT DEFAULT '27502',
  -- Documentos gerados (IDs dos processos ATA360)
  processo_id UUID REFERENCES processos(id),
  documentos_gerados JSONB DEFAULT '[]',
  -- Status
  status TEXT NOT NULL DEFAULT 'vigente' CHECK (status IN (
    'em_formalizacao', 'vigente', 'renovando',
    'suspenso', 'encerrado', 'cancelado'
  )),
  -- Origem do recurso
  fonte_recurso TEXT DEFAULT 'proprio' CHECK (fonte_recurso IN (
    'proprio', 'emenda_individual', 'emenda_bancada',
    'emenda_comissao', 'convenio', 'transferencia'
  )),
  emenda_numero TEXT,
  -- Metadados
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contratacoes_orgao ON contratacoes_ata360(orgao_id);
CREATE INDEX IF NOT EXISTS idx_contratacoes_status ON contratacoes_ata360(status, vigencia_fim);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. ADESÃO A ARP (Art. 86, Lei 14.133)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS adesao_arp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Órgão aderente
  orgao_aderente_id UUID NOT NULL REFERENCES orgaos(id),
  -- ATA de origem
  ata_numero TEXT NOT NULL,
  ata_pncp_id TEXT,
  ata_vigencia_inicio DATE,
  ata_vigencia_fim DATE,
  -- Órgão gerenciador
  gerenciador_nome TEXT NOT NULL,
  gerenciador_cnpj TEXT,
  gerenciador_uasg TEXT,
  gerenciador_usuario_ata360 BOOLEAN DEFAULT false,
  -- Fornecedor
  fornecedor_nome TEXT,
  fornecedor_cnpj TEXT,
  -- Itens
  itens JSONB NOT NULL DEFAULT '[]',
  valor_total DECIMAL(15,2),
  -- Limites Art. 86
  percentual_utilizado DECIMAL(5,2),
  saldo_disponivel DECIMAL(15,2),
  quantidade_empenhada INTEGER,
  -- Status fluxo
  status TEXT NOT NULL DEFAULT 'busca' CHECK (status IN (
    'busca',                  -- Etapa 1: buscando ATA
    'analise',                -- Etapa 2: verificando saldo/vigência
    'solicitacao_enviada',    -- Etapa 3: docs + link enviados ao gerenciador
    'aguardando_gerenciador', -- Etapa 4: aguardando autorização
    'aguardando_fornecedor',  -- Etapa 5: aguardando aceite
    'autorizada',             -- Ambos aprovaram
    'contratada',             -- Documentos finais gerados
    'recusada_gerenciador',
    'recusada_fornecedor',
    'expirada',
    'cancelada'
  )),
  -- Links externos (para não-usuários)
  link_gerenciador TEXT,
  link_gerenciador_expira TIMESTAMPTZ,
  link_fornecedor TEXT,
  link_fornecedor_expira TIMESTAMPTZ,
  -- Comunicações
  email_gerenciador TEXT,
  email_fornecedor TEXT,
  lembretes_enviados INTEGER DEFAULT 0,
  -- Documentos gerados (10 documentos automáticos)
  documentos JSONB DEFAULT '[]',
  -- Metadados
  processo_id UUID REFERENCES processos(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_adesao_orgao ON adesao_arp(orgao_aderente_id);
CREATE INDEX IF NOT EXISTS idx_adesao_ata ON adesao_arp(ata_numero);
CREATE INDEX IF NOT EXISTS idx_adesao_status ON adesao_arp(status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. RLS
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE pricing_parametros ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratacoes_ata360 ENABLE ROW LEVEL SECURITY;
ALTER TABLE adesao_arp ENABLE ROW LEVEL SECURITY;

-- Pricing params: SuperADM pode gerenciar, todos podem ler
CREATE POLICY "Pricing params: todos podem ler parametros ativos"
  ON pricing_parametros FOR SELECT USING (ativo = true);

CREATE POLICY "Pricing params: superadm gerencia"
  ON pricing_parametros FOR ALL
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'superadm');

-- Simulações: órgão vê as suas
CREATE POLICY "Pricing sim: orgao ve proprias simulacoes"
  ON pricing_simulacoes FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID OR orgao_id IS NULL);

CREATE POLICY "Pricing sim: qualquer autenticado pode simular"
  ON pricing_simulacoes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Contratações: órgão vê as suas
CREATE POLICY "Contratacoes: orgao ve proprias contratacoes"
  ON contratacoes_ata360 FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Contratacoes: localadm gerencia"
  ON contratacoes_ata360 FOR ALL
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- Adesão ARP: órgão vê as suas
CREATE POLICY "Adesao ARP: orgao ve proprias adesoes"
  ON adesao_arp FOR SELECT
  USING (orgao_aderente_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Adesao ARP: orgao gerencia adesoes"
  ON adesao_arp FOR ALL
  USING (orgao_aderente_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE pricing_parametros IS 'Equação universal: max(PISO, PISO × (BASE/BASE_MIN)^alpha) — reajuste anual';
COMMENT ON TABLE pricing_simulacoes IS 'Simulações de preço por ente — base para proposta e contratação';
COMMENT ON TABLE contratacoes_ata360 IS 'Contratos do ATA360 com entes públicos — autocontratação';
COMMENT ON TABLE adesao_arp IS 'Adesão online a ATAs de Registro de Preços — Art. 86 Lei 14.133';
