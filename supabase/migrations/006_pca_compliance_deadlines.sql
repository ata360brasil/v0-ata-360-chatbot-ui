-- ATA360 — Migration 006: PCA Inteligente + Compliance + Prazos + Assinatura + Ouvidoria
--
-- Módulos novos:
--   1. PCA Inteligente (sugestão automática, conciliação, PCA vivo)
--   2. Compliance CGU (programa integridade, canal denúncias, ESG)
--   3. Controle de Prazos (alertas tempo real, monitoramento)
--   4. Assinatura Eletrônica (cláusula aceitação, registro IP/auth)
--   5. Ouvidoria e Canal de Denúncias
--
-- @see DOCUMENTACAO.md — Seções 5, 9, 10, 11, 15
-- @see Portaria CGU 226/2025 — Programa de Integridade
-- @see Lei 14.063/2020 — Assinatura Eletrônica
-- @see Lei 12.846/2013 — Lei Anticorrupção

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. PCA INTELIGENTE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela: pca_plano — PCA principal do órgão (um ativo por exercício)
CREATE TABLE IF NOT EXISTS pca_plano (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  exercicio INTEGER NOT NULL,              -- Ano do PCA (ex: 2026)
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'em_elaboracao', 'aprovado', 'publicado', 'revisando', 'encerrado'
  )),
  origem TEXT NOT NULL DEFAULT 'manual' CHECK (origem IN (
    'manual',           -- Órgão criou do zero
    'importado',        -- Importado de Excel/PDF existente
    'sugerido_ata360',  -- ATA360 sugeriu com base em dados históricos
    'migrado'           -- Migrado de sistema anterior
  )),
  -- Dados do PCA
  objeto_resumo TEXT,
  valor_total_estimado DECIMAL(15,2) DEFAULT 0,
  qtd_itens INTEGER DEFAULT 0,
  -- Dados de sugestão (quando origem = 'sugerido_ata360')
  dados_historicos_usados JSONB DEFAULT '{}',    -- Fontes: PNCP, Compras.gov, execução
  anos_analisados INTEGER[] DEFAULT '{}',        -- Ex: {2023, 2024, 2025}
  confianca_sugestao DECIMAL(3,2),               -- 0.00 a 1.00
  -- Conciliação
  ultima_conciliacao TIMESTAMPTZ,
  desvios_identificados JSONB DEFAULT '[]',       -- Array de desvios
  adaptacoes_sugeridas JSONB DEFAULT '[]',        -- Array de sugestões de atualização
  -- Metadados
  publicado_pncp BOOLEAN NOT NULL DEFAULT false,
  url_pncp TEXT,
  aprovado_por UUID REFERENCES usuarios(id),
  aprovado_em TIMESTAMPTZ,
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(orgao_id, exercicio)
);

CREATE INDEX IF NOT EXISTS idx_pca_plano_orgao ON pca_plano(orgao_id, exercicio);

-- Tabela: pca_itens — Itens do PCA (granular)
CREATE TABLE IF NOT EXISTS pca_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pca_id UUID NOT NULL REFERENCES pca_plano(id) ON DELETE CASCADE,
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  -- Identificação
  numero_item INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  catmat_catser TEXT,                         -- Código CATMAT/CATSER
  tipo TEXT NOT NULL CHECK (tipo IN ('material', 'servico', 'obra', 'tic')),
  -- Classificação
  classe TEXT,                                -- Classe de material/serviço
  subclasse TEXT,
  setor_requisitante TEXT NOT NULL,           -- Setor que demanda
  -- Valores
  quantidade INTEGER NOT NULL DEFAULT 1,
  unidade TEXT NOT NULL DEFAULT 'unidade',
  valor_unitario_estimado DECIMAL(15,2),
  valor_total_estimado DECIMAL(15,2),
  -- Planejamento
  mes_previsto INTEGER CHECK (mes_previsto BETWEEN 1 AND 12),
  trimestre INTEGER CHECK (trimestre BETWEEN 1 AND 4),
  prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN (
    'critica', 'alta', 'normal', 'baixa'
  )),
  modalidade_sugerida TEXT,                   -- pregao, dispensa, etc.
  -- Vinculação com processos ATA360
  processo_id UUID REFERENCES processos(id),
  processo_status TEXT,                       -- Status do processo vinculado
  -- Execução / Conciliação
  executado BOOLEAN NOT NULL DEFAULT false,
  valor_executado DECIMAL(15,2),
  data_execucao DATE,
  -- Origem da sugestão
  sugerido_por TEXT DEFAULT 'usuario' CHECK (sugerido_por IN (
    'usuario', 'ata360_historico', 'ata360_sazonalidade', 'ata360_orcamento', 'importado'
  )),
  confianca DECIMAL(3,2),                     -- 0.00 a 1.00 (quando sugerido)
  justificativa_sugestao TEXT,                -- Por que o ATA360 sugeriu
  -- Metadados
  observacoes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pca_itens_pca ON pca_itens(pca_id);
CREATE INDEX IF NOT EXISTS idx_pca_itens_orgao ON pca_itens(orgao_id);
CREATE INDEX IF NOT EXISTS idx_pca_itens_catmat ON pca_itens(catmat_catser);
CREATE INDEX IF NOT EXISTS idx_pca_itens_setor ON pca_itens(pca_id, setor_requisitante);
CREATE INDEX IF NOT EXISTS idx_pca_itens_processo ON pca_itens(processo_id);

-- Tabela: pca_historico_compras — Dados históricos para sugestão automática
CREATE TABLE IF NOT EXISTS pca_historico_compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  -- Dados da compra histórica
  ano INTEGER NOT NULL,
  fonte TEXT NOT NULL CHECK (fonte IN ('pncp', 'compras_gov', 'execucao_propria', 'transparencia')),
  descricao TEXT NOT NULL,
  catmat_catser TEXT,
  tipo TEXT CHECK (tipo IN ('material', 'servico', 'obra', 'tic')),
  valor_unitario DECIMAL(15,2),
  valor_total DECIMAL(15,2),
  quantidade INTEGER,
  modalidade TEXT,
  mes_compra INTEGER,
  -- Análise
  recorrente BOOLEAN DEFAULT false,           -- Compra se repete anualmente?
  sazonalidade INTEGER[],                     -- Meses em que costuma ocorrer
  -- Metadados
  id_externo TEXT,                            -- ID na fonte original (PNCP, etc.)
  metadata JSONB DEFAULT '{}',
  importado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pca_historico_orgao ON pca_historico_compras(orgao_id, ano);
CREATE INDEX IF NOT EXISTS idx_pca_historico_catmat ON pca_historico_compras(catmat_catser);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. COMPLIANCE E INTEGRIDADE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela: compliance_programa — Programa de integridade do ente
CREATE TABLE IF NOT EXISTS compliance_programa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  -- Pilares CGU (Portaria 226/2025)
  comprometimento_lideranca BOOLEAN NOT NULL DEFAULT false,
  instancia_responsavel BOOLEAN NOT NULL DEFAULT false,
  analise_riscos BOOLEAN NOT NULL DEFAULT false,
  regras_instrumentos BOOLEAN NOT NULL DEFAULT false,
  monitoramento_continuo BOOLEAN NOT NULL DEFAULT false,
  -- Instrumentos
  codigo_conduta BOOLEAN NOT NULL DEFAULT false,
  codigo_conduta_url TEXT,
  codigo_conduta_data DATE,
  canal_denuncias BOOLEAN NOT NULL DEFAULT false,
  canal_denuncias_tipo TEXT CHECK (canal_denuncias_tipo IN (
    'interno', 'terceirizado', 'hibrido'
  )),
  canal_denuncias_url TEXT,
  due_diligence BOOLEAN NOT NULL DEFAULT false,
  treinamento_compliance BOOLEAN NOT NULL DEFAULT false,
  treinamento_ultimo DATE,
  -- Certificações
  certificacao_pro_etica_cgu BOOLEAN NOT NULL DEFAULT false,
  certificacao_pro_etica_ano INTEGER,
  certificacao_abes BOOLEAN NOT NULL DEFAULT false,
  certificacao_tcu_diamante BOOLEAN NOT NULL DEFAULT false,
  certificacao_tce_mg BOOLEAN NOT NULL DEFAULT false,
  -- Políticas
  politica_anticorrupcao BOOLEAN NOT NULL DEFAULT false,
  politica_lgpd BOOLEAN NOT NULL DEFAULT false,
  politica_diversidade BOOLEAN NOT NULL DEFAULT false,
  politica_teletrabalho BOOLEAN NOT NULL DEFAULT false,
  politica_respeito_mulher BOOLEAN NOT NULL DEFAULT false,
  politica_esg BOOLEAN NOT NULL DEFAULT false,
  politica_conflito_interesse BOOLEAN NOT NULL DEFAULT false,
  -- CEP (Comissão de Ética Pública)
  cep_instituida BOOLEAN NOT NULL DEFAULT false,
  cep_membros JSONB DEFAULT '[]',
  -- ESG
  esg_ambiental_score DECIMAL(5,2),
  esg_social_score DECIMAL(5,2),
  esg_governanca_score DECIMAL(5,2),
  esg_compras_sustentaveis_pct DECIMAL(5,2),   -- % compras com critério sustentável
  -- ODS ONU
  ods_atendidos INTEGER[] DEFAULT '{}',         -- {5,9,10,12,16,17}
  ods_metricas JSONB DEFAULT '{}',
  -- Avaliação geral
  nivel_maturidade TEXT DEFAULT 'inicial' CHECK (nivel_maturidade IN (
    'inicial', 'basico', 'intermediario', 'avancado', 'excelencia'
  )),
  score_integridade DECIMAL(5,2),               -- 0-100
  -- Parceiros (FNS, FNDE, Municípios, Estados, Federal)
  parceiros_avaliados JSONB DEFAULT '[]',
  -- Metadados
  responsavel_id UUID REFERENCES usuarios(id),
  ultima_avaliacao TIMESTAMPTZ,
  proxima_avaliacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(orgao_id)
);

-- Tabela: compliance_riscos — Mapa de riscos de integridade
CREATE TABLE IF NOT EXISTS compliance_riscos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  programa_id UUID NOT NULL REFERENCES compliance_programa(id) ON DELETE CASCADE,
  -- Risco
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN (
    'corrupcao', 'fraude', 'conflito_interesse', 'assedio',
    'discriminacao', 'vazamento_dados', 'desvio_recurso',
    'direcionamento_licitacao', 'conluio', 'superfaturamento',
    'fracionamento', 'irregularidade_contratual', 'outro'
  )),
  probabilidade TEXT NOT NULL CHECK (probabilidade IN ('muito_baixa', 'baixa', 'media', 'alta', 'muito_alta')),
  impacto TEXT NOT NULL CHECK (impacto IN ('muito_baixo', 'baixo', 'medio', 'alto', 'muito_alto')),
  nivel_risco TEXT NOT NULL CHECK (nivel_risco IN ('aceitavel', 'moderado', 'elevado', 'critico')),
  -- Mitigação
  controles_existentes TEXT,
  controles_adicionais TEXT,
  responsavel TEXT,
  prazo_mitigacao DATE,
  status TEXT NOT NULL DEFAULT 'identificado' CHECK (status IN (
    'identificado', 'em_mitigacao', 'mitigado', 'aceito', 'materializado'
  )),
  -- Metadados
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_riscos_orgao ON compliance_riscos(orgao_id);
CREATE INDEX IF NOT EXISTS idx_compliance_riscos_categoria ON compliance_riscos(categoria);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. CONTROLE DE PRAZOS E ALERTAS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela: prazos — Prazos monitorados de processos, atos, contratos
CREATE TABLE IF NOT EXISTS prazos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  -- Vinculação
  processo_id UUID REFERENCES processos(id),
  pca_item_id UUID REFERENCES pca_itens(id),
  documento_tipo TEXT,                        -- PCA, DFD, ETP, TR, etc.
  contrato_id TEXT,                           -- ID do contrato (quando aplicável)
  -- Prazo
  tipo TEXT NOT NULL CHECK (tipo IN (
    'publicacao_pca', 'elaboracao_dfd', 'pesquisa_precos',
    'publicacao_edital', 'impugnacao', 'abertura_sessao',
    'adjudicacao', 'homologacao', 'assinatura_contrato',
    'publicacao_pncp', 'vigencia_contrato', 'aditivo',
    'prestacao_contas', 'pca_revisao', 'custom'
  )),
  descricao TEXT NOT NULL,
  -- Datas
  data_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_limite TIMESTAMPTZ NOT NULL,
  data_alerta TIMESTAMPTZ,                    -- Quando começar a alertar
  data_concluido TIMESTAMPTZ,
  -- Status
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'em_andamento', 'proximo_vencimento',
    'vencendo_hoje', 'vencido', 'concluido', 'cancelado'
  )),
  -- Destinatários
  destinatario_tipo TEXT NOT NULL DEFAULT 'membro' CHECK (destinatario_tipo IN (
    'membro', 'setor', 'orgao', 'geral'
  )),
  destinatario_id UUID,                       -- usuario_id ou null (setor/orgao/geral)
  setor TEXT,                                 -- Nome do setor (quando tipo = 'setor')
  -- Alerta
  nivel_alerta TEXT NOT NULL DEFAULT 'informativo' CHECK (nivel_alerta IN (
    'informativo', 'atencao', 'urgente', 'critico'
  )),
  alertas_enviados INTEGER NOT NULL DEFAULT 0,
  ultimo_alerta_em TIMESTAMPTZ,
  -- Base legal
  base_legal TEXT,                            -- Art. 55, Dec. 10.947, etc.
  dias_legais INTEGER,                        -- Prazo em dias (úteis ou corridos)
  dias_uteis BOOLEAN NOT NULL DEFAULT true,
  -- Recorrência
  recorrente BOOLEAN NOT NULL DEFAULT false,
  frequencia TEXT CHECK (frequencia IN ('diario', 'semanal', 'mensal', 'trimestral', 'anual')),
  -- Metadados
  criado_por UUID REFERENCES usuarios(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prazos_orgao ON prazos(orgao_id);
CREATE INDEX IF NOT EXISTS idx_prazos_processo ON prazos(processo_id);
CREATE INDEX IF NOT EXISTS idx_prazos_status ON prazos(status, data_limite);
CREATE INDEX IF NOT EXISTS idx_prazos_alerta ON prazos(nivel_alerta, status);
CREATE INDEX IF NOT EXISTS idx_prazos_destinatario ON prazos(destinatario_tipo, destinatario_id);

-- Tabela: alertas — Alertas enviados (histórico)
CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  prazo_id UUID REFERENCES prazos(id) ON DELETE SET NULL,
  -- Alerta
  tipo TEXT NOT NULL CHECK (tipo IN (
    'prazo', 'compliance', 'legal_sync', 'pca', 'contrato',
    'auditoria', 'sistema', 'seguranca', 'custom'
  )),
  nivel TEXT NOT NULL CHECK (nivel IN ('informativo', 'atencao', 'urgente', 'critico')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  -- Destinatários
  destinatario_tipo TEXT NOT NULL CHECK (destinatario_tipo IN (
    'membro', 'setor', 'orgao', 'geral'
  )),
  destinatario_id UUID REFERENCES usuarios(id),
  -- Status
  lido BOOLEAN NOT NULL DEFAULT false,
  lido_em TIMESTAMPTZ,
  acao_tomada TEXT,                            -- Descrição da ação do usuário
  -- Canal
  canal TEXT NOT NULL DEFAULT 'sistema' CHECK (canal IN (
    'sistema', 'email', 'push', 'sms', 'whatsapp'
  )),
  -- Metadados
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alertas_orgao ON alertas(orgao_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_destinatario ON alertas(destinatario_id, lido);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas(tipo, nivel);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. ASSINATURA ELETRÔNICA
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela: assinaturas — Registro de todas as assinaturas eletrônicas
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  processo_id UUID REFERENCES processos(id),
  documento_tipo TEXT NOT NULL,
  documento_url TEXT NOT NULL,                 -- URL do documento no R2
  documento_hash TEXT NOT NULL,                -- Hash SHA-256 no momento da assinatura
  documento_versao INTEGER NOT NULL,
  -- Signatário
  signatario_id UUID NOT NULL REFERENCES usuarios(id),
  signatario_nome TEXT NOT NULL,
  signatario_cargo TEXT,
  signatario_cpf TEXT,                         -- Mascarado: ***.***.***-XX
  -- Método de autenticação
  metodo_autenticacao TEXT NOT NULL CHECK (metodo_autenticacao IN (
    'gov_br_simples',       -- Gov.br conta verificada
    'gov_br_prata',         -- Gov.br nível prata
    'gov_br_ouro',          -- Gov.br nível ouro
    'icp_brasil',           -- Certificado digital ICP-Brasil
    'certificado_nuvem',    -- Certificado em nuvem
    'biometria'             -- Biometria facial (Gov.br)
  )),
  nivel_assinatura TEXT NOT NULL CHECK (nivel_assinatura IN (
    'simples',    -- Lei 14.063/2020, Art. 4°
    'avancada',   -- Lei 14.063/2020, Art. 5°
    'qualificada' -- Lei 14.063/2020, Art. 6° (ICP-Brasil)
  )),
  -- Registro de autenticação
  ip_signatario INET NOT NULL,
  user_agent TEXT,
  geolocalizacao JSONB,                        -- {lat, lng, cidade, uf} (opcional)
  -- Carimbo do Tempo SERPRO
  carimbo_serpro JSONB,                        -- {tsa_serial, timestamp, certificado}
  carimbo_verificado BOOLEAN DEFAULT false,
  -- ICP-Brasil (quando qualificada)
  certificado_emissor TEXT,
  certificado_valido_ate TIMESTAMPTZ,
  certificado_serial TEXT,
  -- Cláusula de aceitação
  clausula_aceita BOOLEAN NOT NULL DEFAULT true,
  clausula_texto TEXT NOT NULL DEFAULT 'Os signatários deste documento declaram aceitar a assinatura eletrônica como forma válida de manifestação de vontade, nos termos da Lei 14.063/2020, do Decreto 10.543/2020 e da Medida Provisória 2.200-2/2001 (ICP-Brasil).',
  -- Validade
  valida BOOLEAN NOT NULL DEFAULT true,
  motivo_invalidacao TEXT,
  -- Metadados
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assinaturas_orgao ON assinaturas(orgao_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_processo ON assinaturas(processo_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_signatario ON assinaturas(signatario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_documento ON assinaturas(documento_hash);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. OUVIDORIA E CANAL DE DENÚNCIAS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabela: ouvidoria_manifestacoes — Canal de denúncias e ouvidoria
CREATE TABLE IF NOT EXISTS ouvidoria_manifestacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),       -- NULL = manifestação geral (sobre ATA360)
  -- Protocolo
  protocolo TEXT NOT NULL UNIQUE,              -- Formato: OUV-YYYYMMDD-XXXXX
  -- Tipo
  tipo TEXT NOT NULL CHECK (tipo IN (
    'denuncia', 'reclamacao', 'sugestao', 'elogio',
    'solicitacao', 'consulta'
  )),
  categoria TEXT NOT NULL CHECK (categoria IN (
    'etica', 'assedio_moral', 'assedio_sexual',
    'corrupcao', 'fraude_licitacao', 'direcionamento',
    'conflito_interesse', 'vazamento_dados',
    'discriminacao', 'irregularidade',
    'melhoria_sistema', 'atendimento',
    'outro'
  )),
  -- Conteúdo
  assunto TEXT NOT NULL,
  descricao TEXT NOT NULL,
  evidencias JSONB DEFAULT '[]',               -- [{url, tipo, nome}] arquivos anexados
  -- Denunciante (pode ser anônimo)
  anonimo BOOLEAN NOT NULL DEFAULT false,
  denunciante_id UUID REFERENCES usuarios(id),
  denunciante_nome TEXT,
  denunciante_email TEXT,
  denunciante_telefone TEXT,
  -- Acusado (quando denúncia)
  acusado_nome TEXT,
  acusado_cargo TEXT,
  acusado_orgao TEXT,
  -- Tramitação
  status TEXT NOT NULL DEFAULT 'recebida' CHECK (status IN (
    'recebida', 'em_analise', 'em_apuracao',
    'respondida', 'encerrada', 'arquivada',
    'encaminhada_externa'
  )),
  prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN (
    'baixa', 'normal', 'alta', 'urgente'
  )),
  responsavel_id UUID REFERENCES usuarios(id),
  -- Resposta
  resposta TEXT,
  respondido_em TIMESTAMPTZ,
  prazo_resposta TIMESTAMPTZ,                  -- 30 dias (padrão CGU)
  -- Encaminhamento externo
  encaminhado_para TEXT,                       -- CGU, MP, TCU, etc.
  encaminhado_em TIMESTAMPTZ,
  -- Proteção ao denunciante
  protecao_identidade BOOLEAN NOT NULL DEFAULT true,
  medidas_protecao TEXT,
  -- Metadados
  ip_origem INET,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ouvidoria_orgao ON ouvidoria_manifestacoes(orgao_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_protocolo ON ouvidoria_manifestacoes(protocolo);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_status ON ouvidoria_manifestacoes(status);
CREATE INDEX IF NOT EXISTS idx_ouvidoria_tipo ON ouvidoria_manifestacoes(tipo, categoria);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- PCA
ALTER TABLE pca_plano ENABLE ROW LEVEL SECURITY;
ALTER TABLE pca_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE pca_historico_compras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PCA plano: orgao pode ver proprio PCA"
  ON pca_plano FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA plano: orgao pode inserir proprio PCA"
  ON pca_plano FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA plano: orgao pode atualizar proprio PCA"
  ON pca_plano FOR UPDATE
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA itens: orgao pode ver proprios itens"
  ON pca_itens FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA itens: orgao pode inserir proprios itens"
  ON pca_itens FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA itens: orgao pode atualizar proprios itens"
  ON pca_itens FOR UPDATE
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA historico: orgao pode ver proprio historico"
  ON pca_historico_compras FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "PCA historico: orgao pode inserir proprio historico"
  ON pca_historico_compras FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- Compliance
ALTER TABLE compliance_programa ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_riscos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Compliance: orgao pode ver proprio programa"
  ON compliance_programa FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Compliance: localadm pode gerenciar programa"
  ON compliance_programa FOR ALL
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Compliance riscos: orgao pode ver proprios riscos"
  ON compliance_riscos FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Compliance riscos: orgao pode gerenciar riscos"
  ON compliance_riscos FOR ALL
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- Prazos e Alertas
ALTER TABLE prazos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prazos: orgao pode ver proprios prazos"
  ON prazos FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Prazos: orgao pode gerenciar prazos"
  ON prazos FOR ALL
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Alertas: orgao pode ver proprios alertas"
  ON alertas FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Alertas: sistema pode inserir alertas"
  ON alertas FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Alertas: usuario pode marcar como lido"
  ON alertas FOR UPDATE
  USING (
    orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID
    AND (destinatario_id = auth.uid() OR destinatario_id IS NULL)
  );

-- Assinaturas
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assinaturas: orgao pode ver proprias assinaturas"
  ON assinaturas FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Assinaturas: orgao pode registrar assinaturas"
  ON assinaturas FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- Ouvidoria
ALTER TABLE ouvidoria_manifestacoes ENABLE ROW LEVEL SECURITY;

-- Denúncias anônimas: ninguém vê (exceto sistema e responsável)
CREATE POLICY "Ouvidoria: denunciante pode ver proprias manifestacoes"
  ON ouvidoria_manifestacoes FOR SELECT
  USING (
    (denunciante_id = auth.uid())
    OR (
      orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID
      AND (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'localadm', 'ouvidor')
    )
  );

CREATE POLICY "Ouvidoria: qualquer autenticado pode criar manifestacao"
  ON ouvidoria_manifestacoes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Ouvidoria: responsavel pode atualizar"
  ON ouvidoria_manifestacoes FOR UPDATE
  USING (
    responsavel_id = auth.uid()
    OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'ouvidor')
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. COMENTÁRIOS
-- ═══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE pca_plano IS 'PCA Inteligente — Plano de Contratações Anual do órgão';
COMMENT ON TABLE pca_itens IS 'Itens do PCA — granular, vinculado a processos ATA360';
COMMENT ON TABLE pca_historico_compras IS 'Histórico de compras para sugestão automática de PCA';
COMMENT ON TABLE compliance_programa IS 'Programa de Integridade — pilares CGU, certificações, ESG';
COMMENT ON TABLE compliance_riscos IS 'Mapa de riscos de integridade — identificação e mitigação';
COMMENT ON TABLE prazos IS 'Prazos legais e processuais com alertas em tempo real';
COMMENT ON TABLE alertas IS 'Histórico de alertas enviados a membros/setores/órgãos';
COMMENT ON TABLE assinaturas IS 'Assinaturas eletrônicas com registro de IP, auth e carimbo';
COMMENT ON TABLE ouvidoria_manifestacoes IS 'Canal de denúncias e ouvidoria — anônimo ou identificado';
