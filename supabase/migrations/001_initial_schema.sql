-- ═══════════════════════════════════════════════════════════════════════════════
-- ATA360 — Schema Inicial Supabase
-- Multi-tenant via RLS (Row Level Security) por orgao_id.
--
-- @see Paul Copplestone — Supabase RLS best practices
-- @see Spec v8 Part 8 — Data Model
-- @see Spec v8 Part 20.11 — Audit Trail
-- @see Marçal Justen Filho — Lei 14.133/2021
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Enums ─────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('superadm', 'suporte', 'localadm', 'servidor', 'demo');
CREATE TYPE esfera AS ENUM ('federal', 'estadual', 'municipal');
CREATE TYPE govbr_level AS ENUM ('ouro', 'prata', 'bronze');

-- ─── Órgãos (Tenants) ─────────────────────────────────────────────────────
CREATE TABLE orgaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  uf CHAR(2) NOT NULL,
  municipio TEXT NOT NULL,
  esfera esfera NOT NULL DEFAULT 'municipal',
  codigo_ibge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Usuários ──────────────────────────────────────────────────────────────
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  cpf TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'servidor',
  avatar_url TEXT,
  govbr_level govbr_level,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE INDEX idx_usuarios_orgao ON usuarios(orgao_id);

-- ─── Processos ─────────────────────────────────────────────────────────────
CREATE TABLE processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  numero TEXT NOT NULL,
  objeto TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'RASCUNHO',
  fase TEXT NOT NULL DEFAULT 'planejamento',
  valor_estimado BIGINT DEFAULT 0, -- centavos (BRLCents)
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_processos_orgao ON processos(orgao_id);

-- ─── Documentos (Artefatos) ───────────────────────────────────────────────
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID NOT NULL REFERENCES processos(id),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  tipo TEXT NOT NULL, -- DFD, ETP, TR, PP, etc.
  versao INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'RASCUNHO',
  conteudo JSONB NOT NULL DEFAULT '{}',
  hash_sha256 TEXT,
  selo_aprovado BOOLEAN NOT NULL DEFAULT false,
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documentos_processo ON documentos(processo_id);
CREATE INDEX idx_documentos_orgao ON documentos(orgao_id);

-- ─── Audit Trail (Part 20.11 + LGPD Art. 7, II) ──────────────────────────
-- Retenção: 5 anos (1825 dias) — obrigação legal Lei 14.133/2021
CREATE TABLE audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID NOT NULL REFERENCES orgaos(id),
  processo_id UUID REFERENCES processos(id),
  acao TEXT NOT NULL,
  agente TEXT NOT NULL, -- 'frontend', 'orquestrador', 'acma', 'auditor', etc.
  estado_anterior TEXT,
  estado_novo TEXT,
  hash TEXT NOT NULL,
  detalhes JSONB,
  criado_por UUID NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_orgao ON audit_trail(orgao_id);
CREATE INDEX idx_audit_processo ON audit_trail(processo_id);
CREATE INDEX idx_audit_created ON audit_trail(created_at);

-- ─── RLS Policies (Paul Copplestone — Multi-tenant isolation) ──────────────
-- REGRA: Usuário só vê dados do seu próprio órgão.
-- EXCEÇÃO: Dados PNCP são públicos (Part 19).

ALTER TABLE orgaos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Orgaos: leitura própria
CREATE POLICY "Usuários veem apenas seu órgão"
  ON orgaos FOR SELECT
  USING (id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Usuarios: leitura do mesmo órgão
CREATE POLICY "Usuários veem colegas do mesmo órgão"
  ON usuarios FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Processos: CRUD do mesmo órgão
CREATE POLICY "Processos visíveis apenas do órgão"
  ON processos FOR ALL
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Documentos: CRUD do mesmo órgão
CREATE POLICY "Documentos visíveis apenas do órgão"
  ON documentos FOR ALL
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- Audit: leitura do mesmo órgão (nunca delete/update)
CREATE POLICY "Audit trail do órgão"
  ON audit_trail FOR SELECT
  USING (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

CREATE POLICY "Audit trail insert do órgão"
  ON audit_trail FOR INSERT
  WITH CHECK (orgao_id = (auth.jwt() ->> 'orgao_id')::uuid);

-- ─── Updated_at Trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER processos_updated_at
  BEFORE UPDATE ON processos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER documentos_updated_at
  BEFORE UPDATE ON documentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
