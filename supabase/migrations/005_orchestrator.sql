-- ATA360 — Migration 005: Orquestrador (Maestro)
--
-- Extensão da tabela processos com colunas para state machine,
-- trilha de documentos, e estado dos agentes.
-- Tabela processo_mensagens para histórico de chat.
--
-- @see Spec v8 Part 20 — Orquestrador
-- @see Spec v8 Part 20.4 — State Machine (12 estados)
-- @see Spec v8 Part 20.8 — Trilha de Documentos

-- ─── Colunas do Orquestrador na tabela processos ─────────────────────────────

ALTER TABLE processos ADD COLUMN IF NOT EXISTS modalidade TEXT NOT NULL DEFAULT 'pregao';
ALTER TABLE processos ADD COLUMN IF NOT EXISTS trilha JSONB DEFAULT '[]';
ALTER TABLE processos ADD COLUMN IF NOT EXISTS trilha_posicao INTEGER NOT NULL DEFAULT 0;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS documento_atual TEXT;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS iteracao INTEGER NOT NULL DEFAULT 1;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS sugestoes_restantes INTEGER NOT NULL DEFAULT 3;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS reauditorias_restantes INTEGER NOT NULL DEFAULT 5;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS insight_context JSONB;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS acma_sugestao_atual JSONB;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS auditor_parecer_atual JSONB;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS selo_aprovado BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS documento_url TEXT;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS documento_hash TEXT;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS documento_versao INTEGER NOT NULL DEFAULT 0;
ALTER TABLE processos ADD COLUMN IF NOT EXISTS proximo_sugerido TEXT;

-- ─── Tabela: processo_mensagens ──────────────────────────────────────────────
-- Histórico completo de chat + mensagens de agentes (audit trail textual).
-- role distingue humano de agente. Part 19: metadata nunca exposto ao frontend.

CREATE TABLE IF NOT EXISTS processo_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  role TEXT NOT NULL CHECK (role IN (
    'user', 'assistant', 'system',
    'insight', 'acma', 'auditor', 'design_law', 'orquestrador'
  )),
  content TEXT NOT NULL,
  artefato JSONB,                        -- { tipo, url, hash, versao } se gerou doc
  insight_cards JSONB,                   -- Array de cards do Insight Engine
  agente TEXT,                           -- Nome interno do agente (Part 19: nunca no frontend)
  estado_no_momento TEXT NOT NULL,       -- ProcessState no momento da mensagem
  metadata JSONB DEFAULT '{}',           -- Dados internos: prompt_hash, modelo, tokens, latencia
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_processo_mensagens_processo
  ON processo_mensagens(processo_id, created_at);
CREATE INDEX IF NOT EXISTS idx_processo_mensagens_orgao
  ON processo_mensagens(orgao_id);
CREATE INDEX IF NOT EXISTS idx_processo_mensagens_role
  ON processo_mensagens(processo_id, role);

-- ─── Tabela: biblioteca_legal_global ─────────────────────────────────────────
-- Base legal centralizada (SuperADM Dashboard).
-- Leis, decretos, portarias, acórdãos, súmulas, manuais, normativos.
-- Atualizada pela equipe + agente LEGAL_SYNC.

CREATE TABLE IF NOT EXISTS biblioteca_legal_global (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN (
    'lei', 'decreto', 'portaria', 'in', 'resolucao',
    'acordao', 'sumula', 'manual', 'norma_tecnica',
    'regulamento', 'codigo', 'politica', 'diretriz'
  )),
  numero TEXT NOT NULL,                  -- Ex: '14.133/2021', 'IN SEGES 75/2024'
  nome TEXT NOT NULL,                    -- Nome completo
  ementa TEXT,                           -- Ementa/resumo
  orgao_emissor TEXT NOT NULL,           -- Planalto, TCU, AGU, CGU, ANVISA, etc.
  esfera TEXT NOT NULL DEFAULT 'federal' CHECK (esfera IN ('federal', 'estadual', 'municipal')),
  uf CHAR(2),                            -- Null = federal, 'MG'/'SP' = estadual
  data_publicacao DATE,
  data_vigencia DATE,
  revogada BOOLEAN NOT NULL DEFAULT false,
  revogada_por UUID REFERENCES biblioteca_legal_global(id),
  url_oficial TEXT,                      -- Link para fonte original (DOU, Planalto, etc.)
  texto_integral TEXT,                   -- Texto completo (opcional, para busca full-text)
  categorias TEXT[] DEFAULT '{}',        -- Tags: ['licitacao','contrato','sustentabilidade']
  setores_aplicaveis TEXT[] DEFAULT '{}', -- ['SAUDE','TI','OBRAS','GERAL']
  aplicavel_lei_14133 BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',           -- Dados extras (artigos relevantes, etc.)
  atualizado_por TEXT NOT NULL DEFAULT 'sistema', -- 'sistema', 'legal_sync', 'superadm'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biblioteca_legal_tipo ON biblioteca_legal_global(tipo);
CREATE INDEX IF NOT EXISTS idx_biblioteca_legal_orgao ON biblioteca_legal_global(orgao_emissor);
CREATE INDEX IF NOT EXISTS idx_biblioteca_legal_categorias ON biblioteca_legal_global USING GIN(categorias);
CREATE INDEX IF NOT EXISTS idx_biblioteca_legal_setores ON biblioteca_legal_global USING GIN(setores_aplicaveis);

-- ─── Tabela: biblioteca_legal_orgao ──────────────────────────────────────────
-- Base legal exclusiva do órgão (Configurações do Usuário).
-- Portarias, decretos complementares próprios do ente.
-- Sem interferência entre órgãos (RLS por orgao_id).

CREATE TABLE IF NOT EXISTS biblioteca_legal_orgao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  tipo TEXT NOT NULL CHECK (tipo IN (
    'lei', 'decreto', 'portaria', 'in', 'resolucao',
    'acordao', 'sumula', 'manual', 'norma_tecnica',
    'regulamento', 'codigo', 'politica', 'diretriz',
    'regimento_interno', 'instrucao_normativa_local'
  )),
  numero TEXT NOT NULL,
  nome TEXT NOT NULL,
  ementa TEXT,
  orgao_emissor TEXT NOT NULL,           -- Nome do ente emissor
  data_publicacao DATE,
  data_vigencia DATE,
  revogada BOOLEAN NOT NULL DEFAULT false,
  url_oficial TEXT,
  texto_integral TEXT,
  categorias TEXT[] DEFAULT '{}',
  setores_aplicaveis TEXT[] DEFAULT '{}',
  complementa_federal UUID REFERENCES biblioteca_legal_global(id), -- Qual norma federal complementa
  metadata JSONB DEFAULT '{}',
  criado_por UUID REFERENCES usuarios(id),
  atualizado_por TEXT NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_biblioteca_orgao_orgao ON biblioteca_legal_orgao(orgao_id);
CREATE INDEX IF NOT EXISTS idx_biblioteca_orgao_tipo ON biblioteca_legal_orgao(orgao_id, tipo);
CREATE INDEX IF NOT EXISTS idx_biblioteca_orgao_categorias ON biblioteca_legal_orgao USING GIN(categorias);

-- ─── Tabela: parametros_globais ──────────────────────────────────────────────
-- Parâmetros do sistema gerenciados pelo SuperADM.
-- Valores de referência, limites, configurações de agentes.

CREATE TABLE IF NOT EXISTS parametros_globais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,            -- Ex: 'limite_dispensa_valor', 'acma_max_sugestoes'
  valor JSONB NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'sistema' CHECK (tipo IN ('sistema', 'agente', 'legal', 'financeiro')),
  descricao TEXT,
  editavel_por TEXT NOT NULL DEFAULT 'superadm', -- 'superadm', 'suporte', 'sistema'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Tabela: parametros_orgao ────────────────────────────────────────────────
-- Parâmetros exclusivos do órgão: logo, brasão, fotos, dados institucionais.
-- Alimentam formatação de artefatos, pesquisas, cabeçalhos de documentos.

CREATE TABLE IF NOT EXISTS parametros_orgao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  chave TEXT NOT NULL,                   -- Ex: 'logo_url', 'brasao_url', 'prefeito_nome'
  valor JSONB NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'geral' CHECK (categoria IN (
    'geral', 'identidade_visual', 'autoridades',
    'endereco', 'contato', 'documentacao', 'financeiro'
  )),
  descricao TEXT,
  criado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(orgao_id, chave)
);

CREATE INDEX IF NOT EXISTS idx_parametros_orgao_orgao ON parametros_orgao(orgao_id);
CREATE INDEX IF NOT EXISTS idx_parametros_orgao_categoria ON parametros_orgao(orgao_id, categoria);

-- ─── Tabela: parametros_membro ───────────────────────────────────────────────
-- Parâmetros pessoais do membro: foto, assinatura, dados para artefatos.
-- PCA vivo, preferências de interface, memória de conversas.

CREATE TABLE IF NOT EXISTS parametros_membro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  chave TEXT NOT NULL,                   -- Ex: 'foto_url', 'cargo', 'matricula', 'assinatura_digital'
  valor JSONB NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'geral' CHECK (categoria IN (
    'geral', 'identidade', 'cargo', 'assinatura',
    'preferencias', 'pca_vivo', 'memoria'
  )),
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, chave)
);

CREATE INDEX IF NOT EXISTS idx_parametros_membro_usuario ON parametros_membro(usuario_id);
CREATE INDEX IF NOT EXISTS idx_parametros_membro_orgao ON parametros_membro(orgao_id);

-- ─── RLS Policies ────────────────────────────────────────────────────────────

-- processo_mensagens: same org only
ALTER TABLE processo_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mensagens: orgao pode ver proprias mensagens"
  ON processo_mensagens FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Mensagens: orgao pode inserir proprias mensagens"
  ON processo_mensagens FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- biblioteca_legal_global: read-only para todos os autenticados
ALTER TABLE biblioteca_legal_global ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Biblioteca global: todos autenticados podem ler"
  ON biblioteca_legal_global FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Biblioteca global: superadm/suporte podem inserir"
  ON biblioteca_legal_global FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'suporte')
  );

CREATE POLICY "Biblioteca global: superadm/suporte podem atualizar"
  ON biblioteca_legal_global FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'suporte')
  );

-- biblioteca_legal_orgao: orgao-scoped
ALTER TABLE biblioteca_legal_orgao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Biblioteca orgao: orgao pode ver propria biblioteca"
  ON biblioteca_legal_orgao FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Biblioteca orgao: localadm pode inserir"
  ON biblioteca_legal_orgao FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Biblioteca orgao: localadm pode atualizar"
  ON biblioteca_legal_orgao FOR UPDATE
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- parametros_globais: read all, write superadm only
ALTER TABLE parametros_globais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parametros globais: todos autenticados podem ler"
  ON parametros_globais FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Parametros globais: superadm pode inserir"
  ON parametros_globais FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'suporte')
  );

CREATE POLICY "Parametros globais: superadm pode atualizar"
  ON parametros_globais FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('superadm', 'suporte')
  );

-- parametros_orgao: orgao-scoped
ALTER TABLE parametros_orgao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parametros orgao: orgao pode ver proprios parametros"
  ON parametros_orgao FOR SELECT
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Parametros orgao: localadm pode inserir"
  ON parametros_orgao FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

CREATE POLICY "Parametros orgao: localadm pode atualizar"
  ON parametros_orgao FOR UPDATE
  USING (orgao_id = (auth.jwt() -> 'user_metadata' ->> 'orgao_id')::UUID);

-- parametros_membro: usuario own + orgao admin read
ALTER TABLE parametros_membro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parametros membro: usuario pode ver proprios dados"
  ON parametros_membro FOR SELECT
  USING (usuario_id = auth.uid());

CREATE POLICY "Parametros membro: usuario pode inserir proprios dados"
  ON parametros_membro FOR INSERT
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Parametros membro: usuario pode atualizar proprios dados"
  ON parametros_membro FOR UPDATE
  USING (usuario_id = auth.uid());

-- ─── Comentários ─────────────────────────────────────────────────────────────

COMMENT ON TABLE processo_mensagens IS 'Histórico de chat do processo — mensagens de usuários e agentes';
COMMENT ON TABLE biblioteca_legal_global IS 'Base legal centralizada — leis, decretos, normativos (SuperADM)';
COMMENT ON TABLE biblioteca_legal_orgao IS 'Base legal exclusiva do órgão — normativos locais (Configurações)';
COMMENT ON TABLE parametros_globais IS 'Parâmetros do sistema — configurações globais (SuperADM)';
COMMENT ON TABLE parametros_orgao IS 'Parâmetros do órgão — logo, brasão, dados institucionais';
COMMENT ON TABLE parametros_membro IS 'Parâmetros pessoais — foto, cargo, PCA vivo, memória';
