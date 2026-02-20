# ATA360 — Auditoria Técnica Completa & Contexto de Transferência

> **Data:** 2026-02-20
> **Autor:** Auditoria automatizada Claude Code (Opus 4.6)
> **Repositório:** `ata360brasil/v0-ata-360-chatbot-ui`
> **Branch auditado:** `claude/setup-ata360-webflow-v17Vf` (= `master` = commit `09fbe5f`)
> **Propósito:** Fornecer contexto completo ao Claude Chat (com MCP Webflow) para continuar o trabalho

---

## SUMÁRIO EXECUTIVO

O projeto ATA360 opera em **duas frentes tecnológicas independentes** que se complementam:

| Frente | Tecnologia | Domínio | Função | Status |
|--------|-----------|---------|--------|--------|
| **APP** (Chatbot UI) | Next.js 16 + React 19 + Vercel | `app.ata360.com.br` | Plataforma SaaS de IA para compras públicas | Em desenvolvimento ativo |
| **SITE** (Institucional) | Webflow (Template Neurex) | `www.ata360.com.br` | Site institucional, blog, landing pages | Em tradução/configuração |

**Ambas compartilham:** marca ATA360, CNPJ 61.291.296/0001-31, domínio ata360.com.br (subdomínios diferentes).

---

## PARTE 1 — APP (NEXT.JS / VERCEL / GITHUB)

### 1.1 Visão Geral do Repositório

```
ata360brasil/v0-ata-360-chatbot-ui (GitHub privado)
├── 60+ commits no branch master
├── ~180 arquivos
├── Stack: Next.js 16.0.10 + React 19.2.0 + Tailwind 4.1.9 + shadcn/ui
├── Deploy: Vercel (pnpm install → pnpm build)
├── Backend: Cloudflare Workers + Hono v4 (em /workers/)
├── DB: Supabase PostgreSQL + D1 (SQLite) + KV + R2
├── IA: Cloudflare AI Gateway (Claude Haiku 80% / Sonnet 15% / Opus 5%)
└── Auth: Supabase + Gov.br OAuth2
```

### 1.2 Estrutura de Rotas (App Router)

#### Páginas Públicas — Grupo `(institutional)` (10 páginas)
| Rota | Conteúdo |
|------|----------|
| `/` | Landing page institucional (números, capacidades, compliance) |
| `/quem-somos` | Sobre a empresa, equipe, história |
| `/manifesto` | Manifesto fundacional |
| `/missao-visao-valores` | Missão, visão, valores |
| `/compromissos` | Compromissos ESG, ODS, éticos |
| `/compliance` | Programa de compliance |
| `/seguranca` | Segurança e IA (Humanos + IA) |
| `/carta-servidor` | Carta ao servidor público |
| `/contato` | Formulário de contato |
| `/cookies` | Política de cookies |

#### Páginas Legais — Grupo `(legal)` (3 páginas)
| Rota | Conteúdo |
|------|----------|
| `/lgpd` | Política LGPD |
| `/privacidade` | Política de privacidade |
| `/termos` | Termos de uso |

#### App Protegido — Grupo `(main)` (8 páginas, requer auth)
| Rota | Conteúdo |
|------|----------|
| `/` (main) | Chat principal com IA |
| `/dashboard` | Painel de gestão e métricas |
| `/contracts` | Gestão de contratos |
| `/processes` | Processos licitatórios |
| `/history` | Histórico de conversas |
| `/files` | Gerenciador de documentos |
| `/team` | Gestão de equipe |
| `/assistants` | Assistentes IA especializados |

#### Autenticação
| Rota | Conteúdo |
|------|----------|
| `/login` | Login Gov.br OAuth2 + modo demo |

### 1.3 API Routes (BFF Pattern — 23 endpoints)

**TODAS as chamadas do frontend passam por Next.js API Routes (BFF). Browser NUNCA chama Workers diretamente.**

| Endpoint | Método(s) | Função |
|----------|----------|--------|
| `/api/processo` | POST | Criar processo |
| `/api/processo/[id]/chat` | POST | Enviar mensagem ao chat IA |
| `/api/processo/[id]/decisao` | POST | Decisão do usuário (APROVAR/EDITAR/etc.) |
| `/api/processo/[id]/status` | GET | Estado atual do processo |
| `/api/audit` | POST | Batch de eventos de auditoria |
| `/api/auth/callback/govbr` | GET | Callback OAuth2 Gov.br |
| `/api/acma` | POST | ACMA agent feedback |
| `/api/auditor` | POST | Auditor agent feedback |
| `/api/avaliacoes` | POST | Avaliações (fornecedor, plataforma, IA) |
| `/api/compliance` | POST | Programa de compliance |
| `/api/contato` | POST | Formulário de contato |
| `/api/contratacao` | POST | Fluxo de contratação |
| `/api/dashboard` | GET | Métricas dashboard |
| `/api/feedback` | POST | Feedback do usuário |
| `/api/normalize` | POST | Normalização linguística |
| `/api/ouvidoria` | POST | Ouvidoria/canal de denúncia |
| `/api/pca` | POST | PCA inteligente |
| `/api/prazos` | POST | Gestão de prazos e alertas |
| `/api/pricing` | POST | Motor de precificação |
| `/api/profile` | GET/POST | Perfil do usuário |
| `/api/publicar` | POST | Publicação de documentos |
| `/api/adesao-arp` | POST | Adesão a ARP |
| `/api/aia` | POST | Avaliação de Impacto Algorítmico |

### 1.4 Middleware de Segurança (`middleware.ts`)

```
Funcionalidades:
├── Supabase Session Refresh (token 1h)
├── Auth Check → redireciona para /login se não autenticado
├── CSP Nonce dinâmico por request
├── Content-Security-Policy completo (Supabase + AI Gateway)
├── X-Request-Id (UUID) para rastreabilidade
├── X-Robots-Tag: noarchive, nosnippet (rotas protegidas)
├── Cache-Control inteligente por tipo de recurso
└── Rotas públicas isentas de auth:
    /login, /privacidade, /termos, /lgpd, /, /manifesto,
    /quem-somos, /missao-visao-valores, /compromissos,
    /compliance, /seguranca, /carta-servidor, /contato, /cookies
```

### 1.5 Componentes Principais (86 arquivos)

| Componente | Função |
|-----------|--------|
| `chat-area.tsx` | Chat com IA (API real + fallback demo) |
| `artifacts-panel.tsx` | Painel de documentos com stepper/auditor/decisão |
| `sidebar-menu.tsx` | Menu lateral (auth real, roles dinâmicos) |
| `process-stepper.tsx` | Barra 7 steps (12 estados → 7 visuais) |
| `auditor-checklist.tsx` | Tripartição: CONFORME/RESSALVAS/NÃO_CONFORME |
| `decision-bar.tsx` | 5 ações: APROVAR, EDITAR, NOVA_SUGESTÃO, PROSSEGUIR, DESCARTAR |
| `insight-cards.tsx` | Cards inteligentes (preço, ARP, emendas, jurisprudência, alertas) |
| `filters-modal.tsx` | 28 filtros avançados (CATMAT, CATSER, modalidade, etc.) |
| `settings-modal.tsx` | Configurações + FAQ (28 perguntas, 7 categorias) |
| `structured-data.tsx` | JSON-LD para SEO (Organization, FAQ) |
| `components/ui/` | 44 componentes shadcn/ui (Radix UI) |

### 1.6 Workers Backend (Cloudflare Workers + Hono v4)

```
workers/
├── src/index.ts                  — Entry point, rotas Hono, CORS, cron
├── src/orchestrator/             — State machine (12 estados, 5 decisões)
│   ├── engine.ts                 — Motor determinístico (ZERO LLM)
│   ├── chat-guard.ts             — Validação de input
│   ├── chat-router.ts            — Roteamento para agentes
│   └── pipeline.ts               — Pipeline de processamento
├── src/normalization/            — Pipeline 6 camadas
│   ├── pipeline.ts → tokenizer → abreviaturas → sinônimos →
│   │   regionalismos → marcas → semântico
├── src/acma/                     — Agente gerador de documentos
├── src/auditor/                  — Agente auditor (calibração)
├── src/profile/                  — Sistema de aprendizado por perfil
├── src/compliance/               — Código de conduta IA + integridade
├── src/cron/                     — Jobs: feedback, prompts, calibração
└── src/routes/                   — 16 rotas Hono (processo, normalize,
                                    pricing, compliance, ouvidoria, etc.)
```

### 1.7 Schemas Zod (Type-Safe)

| Schema | Conteúdo |
|--------|----------|
| `process.ts` | State machine 12 estados, trilha por modalidade, LINDB 6 artigos, 11 normativos |
| `serpro.ts` | 9 contratos SERPRO → 17 serviços (CNPJ, CPF, CND, DATAVALID, NeoSigner) |
| `gov-apis.ts` | 17 fontes gov, 110+ endpoints (PNCP, IBGE, TCU, BCB, SICONFI, etc.) |
| `ai-gateway.ts` | Claude tiers (Haiku/Sonnet/Opus) + fallbacks GPT-4o/Gemini |
| `selo.ts` | Selo Governança Ouro — condicional: CONFORME=true, NAO_CONFORME+PROSSEGUIR=false |
| `normalization.ts` | Normalização linguística |
| `dashboard.ts` | Métricas dashboard |
| `avaliacoes.ts` | Avaliações |
| `acma-learning.ts` | Aprendizado ACMA |
| `feedback.ts` | Feedback do usuário |

### 1.8 Templates HTML (23 arquivos)

```
templates/
├── documento_base_v8.html        — Template MESTRE universal (15 blocos)
├── gerais/                       — PCA, DFD, ETP, PP, TR, MR, JCD (7)
├── arp/                          — OFG, AUG, OFF, ACF, COM, REC, ARP (7)
├── obras/                        — ETP_OBRAS, TR_OBRAS (2)
├── saude/                        — ETP_SAUDE, TR_SAUDE (2)
└── tic/                          — ETP_TIC, TR_TIC (2)
```

### 1.9 Variáveis de Ambiente (.env.example)

| Variável | Serviço | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Placeholder na Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Placeholder na Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Placeholder na Vercel |
| `NEXT_PUBLIC_WORKERS_URL` | Cloudflare Workers | PoC existente |
| `ANTHROPIC_API_KEY` | Claude AI | Não configurado |
| `OPENAI_API_KEY` | Embeddings | Não configurado |
| `SERPRO_CONSUMER_KEY/SECRET` | SERPRO | Não configurado |
| `GOVBR_CLIENT_ID/SECRET` | Gov.br OAuth2 | Não configurado |
| `CLICKHOUSE_*` | ClickHouse Cloud | Não configurado |
| `PORTAL_TRANSPARENCIA_KEY` | Portal Transparência | Não configurado |

### 1.10 Deploy Vercel

| Item | Estado |
|------|--------|
| **Projeto** | `contato-9914s-projects/v0-ata-360-chatbot-ui` |
| **URL prod** | `https://v0-ata-360-chatbot-ui-contato-9914s-projects.vercel.app` |
| **Framework** | Next.js (via `vercel.json`) |
| **Install** | `pnpm install` |
| **Build** | `pnpm build` |
| **Auto-deploy** | Push no `main` aciona deploy automático |
| **Status último deploy** | ⚠️ Pode estar com erro (env vars placeholder) |
| **Branch protection** | Nenhuma configurada |

### 1.11 Git — Histórico Relevante (60+ commits)

Últimos commits significativos:
```
09fbe5f — docs: DOCUMENTACAO.md v8.3 (institucional, FAQ, assessment)
747bcd2 — feat: FAQ (28 perguntas, 7 categorias)
df02358 — feat: jurisprudência, ETP, solidão técnica
98c59b9 — feat: 10 páginas institucionais + API contato + ODS/ESG
a6b3fa5 — feat: páginas legais (LGPD, termos) + anti-spy
cbb54b2 — fix: codebase review v8.2.1 (modelos, segurança, custos)
6cb5a87 — feat: motor de precificação + ARP adesão (v8.2)
f369084 — feat: AIA, JCC, código de conduta (v8.1.1)
dcbbdf4 — feat: PCA inteligente, compliance CGU, ouvidoria (v8.1)
125a325 — feat: Orquestrador (Maestro) — pipeline com auto-loop
f09ab2d — feat: dashboard, publicação, ClickHouse
```

### 1.12 Banco de Dados (Supabase PostgreSQL)

**Migrations:**
| # | Arquivo | Tabelas |
|---|---------|---------|
| 001 | `initial_schema.sql` | orgaos, usuarios, processos, documentos, audit_trail |
| 002 | `feedback_and_profiles.sql` | feedback_termos, perfil_usuario |
| 003 | `avaliacoes.sql` | avaliacoes_acma, avaliacoes_auditor |
| 004 | `acma_auditor_learning.sql` | acma_prompts, auditor_thresholds |
| 005 | `orchestrator.sql` | orquestrador, mensagens, biblioteca_legal |
| 006 | `pca_compliance_deadlines.sql` | PCA, compliance, prazos, alertas |
| D1 | `normalization_tables.sql` | Cache normalização linguística |

**RLS:** Multi-tenant por `orgao_id` em todas as tabelas. Cada ente público vê APENAS seus dados.

---

## PARTE 2 — SITE INSTITUCIONAL (WEBFLOW)

### 2.1 Identificadores do Site

| Item | Valor |
|------|-------|
| **Site ID** | `698fe0c8f6daa74f9f18a777` |
| **Locale PT-BR** | `698fe0c9f6daa74f9f18a7c2` |
| **Locale padrão** | `698fe0c9f6daa74f9f18a7c1` |
| **Template** | Neurex (Webflow) |
| **Designer MCP Link** | `https://ata360-d1a9ce.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99` |
| **URL atual** | `ata360-d1a9ce.webflow.io` |
| **URL final** | `www.ata360.com.br` |

### 2.2 CMS Collections

#### Collections do template (traduzidas PT-BR):
| Collection | Slug | Items | Status |
|-----------|------|-------|--------|
| Blog Posts | `post` | 20 posts PT-BR | ✅ Criados (precisa publicar) |
| Blog Tags | `blog-tags` | 33 tags PT-BR | ✅ Criadas |
| Career Tags | `career-tags` | 11 tags PT-BR | ✅ Criadas |
| Careers | `careers` | 6 vagas PT-BR | ✅ Criadas |

#### Collections novas (criadas via API):
| Collection | ID | Items | Status |
|-----------|-----|-------|--------|
| Glossário | `6997b2dabb6e46e3e84b6f11` | 14 termos | ✅ Criados |
| Jurisprudência TCE | `6997b4f4c3ee3e1dfce73b47` | 15 decisões | ✅ Criados |

#### Blog Posts — IDs dos 20 artigos:
```
Batch 1 (1-5):  6997ae3c5fe92c86ece548fa, ...548fd, ...54900, ...54903, ...54906
Batch 2 (6-10): 6997aefd8523ccc66df74b80, ...74b83, ...74b86, ...74b89, ...74b8c
Batch 3 (11-15):6997af875fe92c86ece55b57, ...55b5a, ...55b5d, ...55b60, ...55b63
Batch 4 (16-20):6997aff78523ccc66df76987, ...7698a, ...7698d, ...76990, ...76993
```

#### ⚠️ CMS Slugs pendentes (só no Designer):
- `post` → `noticias` (URLs: `/post/[slug]` → `/noticias/[slug]`)
- `careers` → `carreiras` (URLs: `/careers/[slug]` → `/carreiras/[slug]`)

### 2.3 Páginas do Site Webflow

#### Páginas ativas (slugs já em PT-BR):
| Página | Slug | Page ID | Status |
|--------|------|---------|--------|
| Home | `/` | `698fe0c9f6daa74f9f18a7de` | ✅ Ativa, schemas aplicados |
| Sobre | `/quemsomos` | — | ✅ |
| Blog Listing | `/noticias` | `698fe0c9f6daa74f9f18a8b6` | ⚠️ Textos em inglês |
| Blog Post Template | `/post/[slug]` | `698fe0c9f6daa74f9f18a86d` | ⚠️ Verificar body text |
| Cadastro | `/cadastro` | — | ✅ |
| Ouvidoria | `/ouvidoria` | — | ✅ |
| Carreiras Listing | `/carreiras` | — | ✅ |
| Carreiras Template | `/careers/[slug]` | — | ⚠️ Slug desalinhado |
| Changelog | `/reference/changelog` | `698fe0c9f6daa74f9f18a907` | ✅ SEO atualizado |

#### 7 Páginas novas (criadas, SEO configurado, estrutura vazia):
| Página | Slug | Page ID | H1 |
|--------|------|---------|-----|
| LGPD | `/lgpd` | `6997bf1eeb968e15af003532` | Política de Privacidade (LGPD) |
| Compliance | `/compliance` | `6997bf21a7975c8cc85ab4a8` | Programa de Compliance |
| Termos | `/termos` | `6997bf2fcb4630dcb231b5a7` | Termos de Uso |
| Investidores | `/investidores` | `6997bf3329f2667d89103568` | Investidores |
| Humanos + I.A. | `/humanos-e-ia` | `6997bf36673fd370573c773e` | Humanos + Inteligência Artificial |
| Mapa do Site | `/mapa-do-site` | `6997bf39308b754b427fd51b` | Mapa do Site |
| Calculadora | `/calculadora` | `6997bf1bfa45433441aaac94` | Calcule o Preço |

**Status:** LGPD tem estrutura do changelog copiada. Compliance tem duplicatas (2 navbars, 2 hero). As outras 5 estão vazias.

#### 7 Páginas duplicadas para DELETAR no Designer:
- `/calculadora-de-precos`, `/untitled-9` até `/untitled-14`

#### 13 Páginas inativas (noindex aplicado):
- Páginas do template Neurex não usadas — já com `<meta name="robots" content="noindex, nofollow">`

### 2.4 SEO — Scripts Registrados

| Script | Escopo | Status |
|--------|--------|--------|
| Organization Schema (JSON-LD) | Site-wide | ✅ |
| WebSite Schema (JSON-LD) | Site-wide | ✅ |
| SEO Head Tags (hreflang, geo, preconnect) | Site-wide | ✅ |
| FAQ Schema (JSON-LD) | Home only | ✅ |
| SoftwareApplication Schema (JSON-LD) | Home only | ✅ |

### 2.5 Blog — Estrutura Neurex Original

```
Página /noticias:
Body → Page Wrapper
  ├── Hero Section
  │   ├── Navbar (component)
  │   └── Container 01 → H1 "Notícias e Artigos"
  ├── Expend Blogs (component) ← Grid expandido
  ├── Section 02
  │   └── Container 02
  │       └── Blogs 01
  │           ├── H2 "Mais artigos"
  │           ├── Tag "Compras Públicas e Lei 14.133"
  │           └── DynamoWrapper → DynamoList → Blog Card 01
  └── CTA & Footer (component)
```

**Textos para traduzir na listing:**
| Element ID | De (inglês) | Para (PT-BR) |
|-----------|-------------|--------------|
| `59105119-...478b` | Stay informed with our latest articles | Notícias e Artigos |
| `c953b992-...0c17` | More blogs & articles | Mais artigos |
| `e397b7a8-...a65e` | Optimizing digital experiences | Compras Públicas e Lei 14.133 |

### 2.6 Limitações Técnicas Descobertas

1. **Designer API (element_builder)** cria duplicatas em estruturas complexas → usar copy-paste manual
2. **CMS Collection slugs** não podem ser alterados via API → só no Designer
3. **Archive/draft de páginas** não funciona via API → fazer manualmente
4. **Scripts duplicados** retornam erro 400 se já registrados → verificar antes de criar

---

## PARTE 3 — APP vs SITE — MAPA ARQUITETURAL

### 3.1 Separação Clara

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOMÍNIO: ata360.com.br                       │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐ │
│  │  www.ata360.com.br       │  │  app.ata360.com.br           │ │
│  │  ─────────────────       │  │  ─────────────────           │ │
│  │  WEBFLOW (Site)          │  │  VERCEL/NEXT.JS (App)        │ │
│  │                          │  │                              │ │
│  │  Função:                 │  │  Função:                     │ │
│  │  • Marketing/institucional│  │  • Plataforma SaaS           │ │
│  │  • Blog/notícias         │  │  • Chat com IA               │ │
│  │  • Landing pages         │  │  • Gestão de processos       │ │
│  │  • SEO/indexação         │  │  • Geração de documentos     │ │
│  │  • Captação de leads     │  │  • Auditoria automática      │ │
│  │  • Calculadora de preço  │  │  • APIs governamentais       │ │
│  │                          │  │  • SERPRO, PNCP, TCU, etc.   │ │
│  │  Público:                │  │                              │ │
│  │  • Visitantes            │  │  Público:                    │ │
│  │  • Imprensa              │  │  • Servidores públicos       │ │
│  │  • Investidores          │  │  • Gestores municipais       │ │
│  │  • Candidatos (vagas)    │  │  • Pregoeiros                │ │
│  │                          │  │  • Equipes de licitação      │ │
│  │  Auth: Nenhuma           │  │                              │ │
│  │  CMS: Webflow nativo     │  │  Auth: Supabase + Gov.br     │ │
│  │                          │  │  Backend: CF Workers + Hono  │ │
│  └──────────┬───────────────┘  └──────────┬───────────────────┘ │
│             │                             │                     │
│             │  CTA "Acessar" ─────────────┘                     │
│             │  (link www → app)                                 │
│             │                                                   │
│             └──── CTA "Cadastro" → /cadastro (Webflow)          │
│                   (futuramente redirecionar para app)            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Sobreposição de Conteúdo (ATENÇÃO)

**Páginas que existem em AMBOS os sistemas:**

| Conteúdo | Webflow (www) | Next.js (app) | Resolução |
|----------|--------------|---------------|-----------|
| Home / Landing | ✅ `/` | ✅ `/` (institutional) | www = marketing, app = chat |
| Quem Somos | ✅ `/quemsomos` | ✅ `/quem-somos` | Slugs diferentes, conteúdo similar |
| LGPD | ✅ `/lgpd` | ✅ `/lgpd` | Duplicado! Sincronizar conteúdo |
| Compliance | ✅ `/compliance` | ✅ `/compliance` | Duplicado! Sincronizar conteúdo |
| Termos | ✅ `/termos` | ✅ `/termos` | Duplicado! Sincronizar conteúdo |
| Contato/Ouvidoria | ✅ `/ouvidoria` | ✅ `/contato` | Funções diferentes OK |
| Segurança/IA | ✅ `/humanos-e-ia` | ✅ `/seguranca` | Conteúdo complementar |

**Recomendação:** Definir qual é a fonte de verdade (source of truth) para cada página duplicada. O site Webflow deve ser a versão pública/indexável e o app Next.js deve ter versões simplificadas ou redirecionar para o Webflow.

### 3.3 Pontos de Integração

| Ponto | Webflow → App | Status |
|-------|--------------|--------|
| CTA "Acessar" | Link para `app.ata360.com.br/login` | Pendente (domínio não conectado) |
| CTA "Cadastro" | `/cadastro` no Webflow (futuro: redirecionar para app) | ✅ Página existe |
| Calculadora | `/calculadora` no Webflow (futuro: usar API pricing do app) | Estrutura vazia |
| Blog | Webflow CMS gerencia conteúdo | ✅ 20 posts criados |
| SEO | Webflow = indexável, App = `noarchive, nosnippet` nas rotas protegidas | ✅ Configurado |

---

## PARTE 4 — AUDITORIA TÉCNICA CRÍTICA

### 4.1 PONTOS FORTES ✅

1. **Arquitetura limpa** — Separação clara BFF (Next.js) → Workers (Hono) → Supabase
2. **Segurança robusta** — CSP com nonce, HSTS, X-Frame-Options DENY, RLS multi-tenant
3. **Type-safety** — Zod schemas em toda a stack, TypeScript strict com `noUncheckedIndexedAccess`
4. **SEO profissional** — JSON-LD, Open Graph, alternates, hreflang, robots configurado
5. **Acessibilidade** — aria-labels, htmlFor/id, roles (WCAG 2.1 AA — obrigatório gov)
6. **Sigilo (Part 19)** — Frontend nunca recebe configs internos, prompts, ou dados de outros tenants
7. **State machine determinística** — Orquestrador ZERO LLM, lógica pura
8. **Templates profissionais** — 23 templates HTML cobrindo toda a Lei 14.133/2021
9. **Normalização linguística** — Pipeline 6 camadas com CATMAT 337K itens
10. **Multi-model IA** — Haiku 80% (custo), Sonnet 15% (qualidade), Opus 5% (crítico)

### 4.2 PROBLEMAS IDENTIFICADOS 🔴

#### Críticos (bloqueiam produção):

| # | Problema | Impacto | Ação |
|---|---------|---------|------|
| C1 | **Vercel deploy com erro** — env vars são placeholders, builds podem falhar | App inacessível | Configurar env vars reais ou criar projeto Supabase |
| C2 | **Supabase não configurado** — nenhum projeto real criado | Auth e dados inoperantes | Criar projeto Supabase, rodar migrations |
| C3 | **Workers backend não deployado** — código existe mas não está em produção | Chat IA não funciona | Deploy workers no Cloudflare |
| C4 | **Blog Webflow não publicado** — 20 posts criados mas não publicados | Blog vazio para visitantes | Publicar via API ou Dashboard |
| C5 | **Domínio não conectado** — nem `www` (Webflow) nem `app` (Vercel) | Acessível apenas por URLs temporárias | Configurar DNS ata360.com.br |

#### Importantes (afetam qualidade):

| # | Problema | Impacto | Ação |
|---|---------|---------|------|
| I1 | **7 páginas duplicadas no Webflow** | Confusão, SEO negativo | Deletar no Designer |
| I2 | **13 páginas inativas do template Neurex** | Indexação indevida (noindex já aplicado) | Draft/deletar no Designer |
| I3 | **Textos em inglês na listing /noticias** | UX ruim para visitantes BR | Traduzir 3 textos via Designer/API |
| I4 | **CMS slugs desalinhados** (`post` vs `noticias`) | URLs inconsistentes | Alterar no Designer |
| I5 | **Compliance page com duplicatas** (2 navbars, 2 hero) | Layout quebrado | Limpar no Designer |
| I6 | **5 páginas novas vazias** (Investidores, Humanos+IA, Mapa, Calculadora, Termos) | Páginas sem conteúdo | Copiar estrutura + preencher |
| I7 | **Conteúdo duplicado App ↔ Site** (LGPD, Compliance, Termos) | SEO penalizado (duplicate content) | Definir canonical/source of truth |
| I8 | **Falta OG images 1200×630** em todas as páginas | Compartilhamento sem preview | Criar e configurar |
| I9 | **Falta alt text nas imagens** | Acessibilidade / SEO | Adicionar |
| I10 | **Sem GA4 / Google Tag** | Sem analytics | Configurar após go-live |

#### Observações (melhorias futuras):

| # | Observação |
|---|-----------|
| O1 | Branch protection não configurada no GitHub |
| O2 | Testes existem mas são poucos (7 arquivos) para a complexidade do projeto |
| O3 | `og-image.png` referenciada no metadata mas pode não existir no `/public/` |
| O4 | ClickHouse Cloud configurado nos schemas mas sem instância real |
| O5 | SERPRO e Gov.br OAuth2 dependem de contratos/credenciais do governo |
| O6 | Workers usam D1/KV/R2/Vectorize — requer conta Cloudflare paga |

### 4.3 DEPENDÊNCIAS EXTERNAS (MAPA)

```
┌── PARA O APP FUNCIONAR ──────────────────────────────────────────┐
│                                                                   │
│  OBRIGATÓRIOS:                                                    │
│  ├── Supabase (projeto + migrations + Gov.br OAuth2)              │
│  ├── Cloudflare (Workers + D1 + KV + R2)                         │
│  ├── Vercel (deploy Next.js + env vars reais)                     │
│  └── Domínio ata360.com.br (DNS configurado)                     │
│                                                                   │
│  NECESSÁRIOS PARA IA:                                             │
│  ├── Anthropic API Key (Claude Haiku/Sonnet/Opus)                 │
│  ├── OpenAI API Key (embeddings text-embedding-3-small)           │
│  └── Cloudflare AI Gateway + Vectorize                            │
│                                                                   │
│  NECESSÁRIOS PARA DADOS GOV:                                      │
│  ├── SERPRO (9 contratos — CNPJ, CPF, CND, DATAVALID, etc.)      │
│  ├── Portal Transparência API Key                                 │
│  └── Gov.br OAuth2 (client_id/secret)                             │
│                                                                   │
│  OPCIONAIS:                                                       │
│  ├── ClickHouse Cloud (analytics)                                 │
│  ├── Google Gemini API (fallback)                                  │
│  └── Observability endpoint (Axiom/Datadog)                       │
│                                                                   │
├── PARA O SITE FUNCIONAR ─────────────────────────────────────────┤
│                                                                   │
│  OBRIGATÓRIOS:                                                    │
│  ├── Webflow (plano pago para CMS + domínio custom)               │
│  ├── Domínio www.ata360.com.br (CNAME para Webflow)               │
│  └── Publicar CMS items + páginas                                 │
│                                                                   │
│  NECESSÁRIOS PARA SEO:                                            │
│  ├── Google Search Console                                        │
│  ├── GA4 / Google Tag                                             │
│  └── OG Images 1200×630                                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## PARTE 5 — CHECKLIST CONSOLIDADO (PARA O CLAUDE CHAT COM MCP)

### 🔴 PRIORIDADE 1 — Blog Webflow
- [ ] Traduzir 3 textos inglês → PT-BR na página `/noticias` (IDs: `59105119-...478b`, `c953b992-...0c17`, `e397b7a8-...a65e`)
- [ ] Verificar template de post individual — body text aparecendo?
- [ ] Validar binding CMS nos Blog Card 01 (imagem, título, summary, tag, data)
- [ ] Publicar os 20 blog posts no CMS
- [ ] Imagens placeholder mantidas ✅ (usar as do template)

### 🔴 PRIORIDADE 2 — 7 Páginas Novas Webflow
- [ ] Deletar 7 páginas duplicadas no Designer
- [ ] Copiar estrutura do Changelog para as 6 páginas vazias (manual copy-paste)
- [ ] Limpar duplicatas na página Compliance (2 navbars, 2 hero)
- [ ] Preencher conteúdo (H1 + subtítulo + body) em cada página

### 🔴 PRIORIDADE 3 — CMS Slugs (Designer Manual)
- [ ] Collection slug `post` → `noticias`
- [ ] Collection slug `careers` → `carreiras`

### 🟡 PRIORIDADE 4 — Housekeeping Webflow
- [ ] Draft/deletar 13 páginas inativas do template
- [ ] Adicionar OG images 1200×630 em todas as páginas
- [ ] Alt text nas imagens
- [ ] Verificar hierarquia H1 em todas as páginas
- [ ] Traduzir textos inglês remanescentes em outras páginas

### 🟢 PRIORIDADE 5 — Go-Live
- [ ] Conectar domínio `www.ata360.com.br` ao Webflow
- [ ] Conectar domínio `app.ata360.com.br` à Vercel
- [ ] Configurar GA4 / Google Tag
- [ ] Google Search Console + sitemap.xml
- [ ] Atualizar URLs nos schemas de `ata360-d1a9ce.webflow.io` para `www.ata360.com.br`
- [ ] Publicar site final

### 🔵 PRIORIDADE 6 — App (Backend)
- [ ] Criar projeto Supabase real + rodar 6 migrations
- [ ] Configurar Gov.br OAuth2 (client_id/secret)
- [ ] Deploy Cloudflare Workers (Hono) — endpoint produção
- [ ] Configurar env vars reais na Vercel (3 Supabase + Workers URL)
- [ ] Resolver erro de deploy Vercel
- [ ] Configurar Anthropic + OpenAI API keys
- [ ] Configurar Cloudflare AI Gateway
- [ ] Testar fluxo end-to-end (chat → documento → auditoria → selo)

---

## PARTE 6 — FERRAMENTAS WEBFLOW DISPONÍVEIS (MCP)

O Claude Chat tem acesso às seguintes ferramentas via MCP:

### Data API:
- **CMS:** Collections (list, get, create), Items (list, get, create, update, delete, publish)
- **Pages:** List, get metadata, update SEO settings
- **Scripts:** Register, list, delete (site-wide ou page-specific)
- **Sites:** Get, publish
- **Components:** List

### Designer API (requer Designer aberto no browser):
- **Pages:** List, get DOM
- **Elements:** Get, update, create (element_builder)
- **Styles:** Get, update, create
- **Variables:** Get, update
- **Components:** List, instances

### Regras Importantes:
1. **SEMPRE chamar `webflow_guide_tool` antes** de usar qualquer ferramenta Webflow
2. **Designer precisa estar aberto** e em foco no browser do Roberto para Designer API
3. **element_builder cria duplicatas** em estruturas complexas — preferir copy-paste manual
4. **Scripts duplicados** retornam erro 400 — verificar antes de criar

---

## PARTE 7 — RESUMO DE NÚMEROS

| Métrica | App (Next.js) | Site (Webflow) |
|---------|--------------|----------------|
| Arquivos | ~180 | N/A (Webflow gerencia) |
| Páginas/Rotas | 22 (10 institutional + 3 legal + 8 app + login) | ~25 (9 ativas + 7 novas + 7 duplicadas + 13 inativas) |
| API Endpoints | 23 BFF routes | 0 |
| Componentes UI | 86 (44 shadcn + 42 custom) | Neurex template components |
| Templates HTML | 23 documentos licitatórios | N/A |
| CMS Items | 0 (dados no Supabase) | 99 (20 posts + 33 tags + 11 career tags + 6 vagas + 14 glossário + 15 jurisprudência) |
| Schemas Zod | 10 | N/A |
| Testes | 7 | N/A |
| Workers Routes | 16 (Hono) | N/A |
| SEO Scripts | JSON-LD no código | 5 scripts registrados |
| Commits | 60+ | N/A |
| Migrations SQL | 7 (6 Supabase + 1 D1) | N/A |

---

*Documento gerado em 2026-02-20 por auditoria automatizada Claude Code.*
*Commit de referência: `09fbe5f` (branch `claude/setup-ata360-webflow-v17Vf`).*
*Projeto: ATA360 — Plataforma Inteligente de Contratações Públicas.*
