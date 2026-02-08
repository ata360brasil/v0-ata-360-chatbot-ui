# ATA360 — Estrutura do Projeto e Justificativas

**Repo:** `ata360brasil/v0-ata-360-chatbot-ui`
**URL Vercel:** https://v0-ata-360-chatbot-ui-contato-9914s-projects.vercel.app
**Branch:** `main`
**Ultimo commit:** `4df6bbb`

---

## 1. ESTRUTURA DE PASTAS

```
v0-ata-360-chatbot-ui/
├── app/                          # Next.js 16 App Router (rotas e layouts)
│   ├── (main)/                   # Grupo de rotas protegidas (com header/sidebar)
│   │   ├── page.tsx              # Chat principal (/)
│   │   ├── layout.tsx            # Shell: header + sidebar + artifacts panel
│   │   ├── error.tsx             # Error boundary (log condicional)
│   │   ├── loading.tsx           # Skeleton de carregamento
│   │   ├── not-found.tsx         # 404
│   │   ├── dashboard/            # Painel de gestao
│   │   ├── contracts/            # Contratos
│   │   ├── processes/            # Processos
│   │   ├── history/              # Historico de conversas
│   │   ├── files/                # Documentos
│   │   ├── team/                 # Equipe
│   │   └── assistants/           # Assistentes
│   ├── api/                      # API Routes (BFF pattern)
│   │   ├── processo/             # CRUD processo + chat + decisao + status
│   │   ├── audit/                # Audit trail (batch, max 50 eventos)
│   │   └── auth/callback/govbr/  # OAuth2 callback Gov.br
│   ├── login/                    # Pagina de login (Gov.br + demo)
│   ├── layout.tsx                # Root layout (fontes, metadata, SEO)
│   ├── globals.css               # Tokens Tailwind 4 (OKLCH, dark mode)
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui (57 componentes Radix)
│   ├── artifacts/                # Renderizadores de documentos
│   │   └── dfd-document.tsx      # DFD completo com next/image
│   ├── artifacts-panel.tsx       # Painel direito (stepper + auditor + decisao)
│   ├── chat-area.tsx             # Chat com API real + fallback demo
│   ├── sidebar-menu.tsx          # Menu lateral (auth real + role dinamico)
│   ├── process-stepper.tsx       # Barra de progresso 7 passos
│   ├── auditor-checklist.tsx     # Resultado auditor (triparticao)
│   ├── decision-bar.tsx          # 5 acoes do usuario (APROVAR, EDITAR...)
│   ├── insight-cards.tsx         # Cards do Insight Engine (5 tipos)
│   ├── filters-modal.tsx         # Filtros de pesquisa (acessivel)
│   ├── settings-modal.tsx        # Configuracoes + modais contato
│   ├── notifications-modal.tsx   # Central de notificacoes
│   ├── dashboard-superadm-page.tsx # Dashboard admin
│   ├── contracts-page.tsx        # Pagina de contratos
│   ├── processes-page.tsx        # Pagina de processos
│   ├── history-page.tsx          # Historico conversas
│   ├── files-page.tsx            # Gerenciador de arquivos
│   ├── team-page.tsx             # Gerenciamento de equipe
│   ├── assistants-page.tsx       # Assistentes IA
│   ├── ata360-icon.tsx           # Icone SVG do ATA360
│   ├── structured-data.tsx       # JSON-LD (SEO)
│   ├── resizable-divider.tsx     # Divisor redimensionavel
│   ├── page-header.tsx           # Cabecalho padrao de pagina
│   └── page-skeleton.tsx         # Skeleton de carregamento
│
├── contexts/
│   └── app-context.tsx           # Estado global (auth + processo + tema + paineis)
│
├── hooks/
│   ├── use-auth.ts               # Auth Supabase + mapper Gov.br
│   ├── use-process.ts            # State machine processos (12 estados)
│   ├── use-mobile.ts             # Deteccao mobile
│   └── use-toast.ts              # Notificacoes toast
│
├── lib/                          # Logica de negocio e utilitarios
│   ├── api.ts                    # Client BFF (processo, chat, SERPRO, gov, insight)
│   ├── audit.ts                  # Audit trail (18 acoes, buffer 50, flush 30s)
│   ├── lgpd.ts                   # LGPD (anonimizacao, consentimento, retencao)
│   ├── observability.ts          # Logger + metricas + spans + Web Vitals
│   ├── routes.ts                 # Rotas e metadata SEO
│   ├── types.ts                  # Branded types (CPF, CNPJ, ProcessId, BRLCents)
│   ├── utils.ts                  # cn() com clsx + tailwind-merge
│   ├── validations.ts            # Zod schemas (CPF, CNPJ, email, senha...)
│   ├── schemas/                  # Schemas Zod tipados
│   │   ├── process.ts            # State machine + trilha + LINDB + normativos
│   │   ├── serpro.ts             # 17 servicos SERPRO (9 contratos)
│   │   ├── gov-apis.ts           # 17 fontes gov, 110+ endpoints, Radar Recursos
│   │   ├── ai-gateway.ts         # Claude tiers (Haiku/Sonnet/Opus) + fallbacks
│   │   ├── selo.ts               # Selo Governanca Ouro (logica condicional)
│   │   └── index.ts              # Re-exports
│   ├── supabase/                 # Clients Supabase SSR
│   │   ├── client.ts             # Browser client (componentes "use client")
│   │   ├── server.ts             # Server client + Admin (bypassa RLS)
│   │   ├── middleware.ts         # Session refresh (token 1h)
│   │   ├── database.types.ts     # TypeScript types (5 tabelas)
│   │   └── index.ts              # Re-exports
│   └── examples/
│       └── dfd-saco-lixo.ts      # Exemplo real DFD (Prefeitura Lagoa Santa)
│
├── templates/                    # Templates HTML dos documentos (22 arquivos)
│   ├── documento_base_v8.html    # Template MESTRE universal (15 blocos)
│   ├── documento_base.html       # Template base anterior (legado)
│   ├── gerais/                   # PCA, DFD, ETP*, PP*, TR, MR, JCD* (7)
│   ├── arp/                      # OFG, AUG, OFF, ACF, COM, REC, ARP (7)
│   ├── obras/                    # ETP_OBRAS, TR_OBRAS (2)
│   ├── saude/                    # ETP_SAUDE, TR_SAUDE (2)
│   └── tic/                      # ETP_TIC, TR_TIC (2)
│
├── configs/
│   └── documentos-config.yaml    # Config YAML master (20 tipos, 1.704 linhas)
│
├── specs/                        # Especificacoes tecnicas
│   ├── 10-ESPECIFICACAO-...v8.md # FONTE DA VERDADE (20 Parts)
│   ├── 07-AUDITOR-...v2.md       # Spec AUDITOR v3 (hibrido LLM)
│   ├── 08-ACMA-...v2.md          # Spec ACMA v3 (8 camadas blindagem)
│   ├── 09-DESIGN-LAW-...v3.md    # Spec DESIGN_LAW v3.1 (edge, selo)
│   └── 21-ANALISE-MOCKUP-...md   # Guia mockup → sistema (Part 21)
│
├── supabase/migrations/
│   └── 001_initial_schema.sql    # DDL + RLS 5 tabelas + triggers
│
├── tests/                        # Testes unitarios
│   ├── setup.ts                  # Setup Vitest
│   ├── app-context.test.tsx
│   ├── lgpd.test.ts
│   ├── routes.test.ts
│   ├── structured-data.test.ts
│   ├── types.test.ts
│   └── validations.test.ts
│
├── public/                       # Assets estaticos
│   ├── images/                   # Logos, brasao, fotos
│   ├── llms.txt                  # Instrucoes para crawlers IA
│   └── *.png, *.jpg, *.svg      # Favicons, placeholders
│
├── middleware.ts                  # Auth check + CSP + session refresh
├── next.config.mjs               # Config Next.js (images, headers, experimental)
├── vercel.json                   # Config Vercel (pnpm install/build)
├── tsconfig.json                 # TypeScript 5 strict + noUncheckedIndexedAccess
├── package.json                  # Dependencias (Next 16, React 19, Tailwind 4)
├── pnpm-lock.yaml                # Lockfile pnpm (lockfileVersion 9.0)
├── HANDOFF-DEV-08FEV2026.md      # Documento tecnico para o dev
└── ESTRUTURA-PROJETO.md          # Este arquivo
```

---

## 2. HISTORICO DE COMMITS (mais recentes primeiro)

| Commit | Descricao | Arquivos |
|--------|-----------|----------|
| `4df6bbb` | Fix: acessibilidade WCAG, TypeScript strict, vercel.json | 18 arquivos |
| `4f0af02` | Docs: HANDOFF + fix Suspense login | 2 arquivos |
| `4fc0b4a` | Feat: wiring mockup → real (auth, API, schemas) | 11 arquivos |
| `0a26742` | Docs: templates HTML + YAML config + specs | 28 arquivos |
| `b296212` | Feat: infraestrutura (Supabase, BFF, hooks, SQL) | 29 arquivos |
| `2e00d49` | Update README (deploy generico) | 1 arquivo |
| `c4baeca` | Fix: sidebar + artifacts exclusao mutua | — |
| `7d567e1` | Fix: chat layout (sidebar cutoff, overflow) | — |
| `2584da6` | Fix: botao logout (icon red) | — |

---

## 3. VERCEL — CONFIGURACAO

**Projeto:** `contato-9914s-projects/v0-ata-360-chatbot-ui`
**URL prod:** https://v0-ata-360-chatbot-ui-contato-9914s-projects.vercel.app
**Auto-deploy:** Sim (push no `main` aciona deploy automatico)

### vercel.json
```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build",
  "framework": "nextjs"
}
```

**Justificativa:** Sem este arquivo, a Vercel usava npm (detectava package-lock.json antigo) e falhava. Agora usa pnpm conforme o projeto.

### Variaveis de ambiente (Vercel Dashboard)
| Variavel | Ambiente | Status |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Placeholder (substituir pela URL real) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Placeholder (substituir pela anon key real) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Placeholder (substituir pela service role key) |

**Para configurar valores reais:**
1. Abrir https://vercel.com → projeto → Settings → Environment Variables
2. Substituir os 3 placeholders pelos valores do projeto Supabase

---

## 4. GITHUB — ESTRUTURA

**Repo:** `ata360brasil/v0-ata-360-chatbot-ui` (privado)
**Branch unico:** `main`
**Protecao:** Nenhuma configurada (recomendado ativar branch protection)

### Fluxo de deploy
```
git push origin main → GitHub → Vercel (auto-deploy) → Build pnpm → Producao
```

### .gitignore (principais exclusoes)
```
node_modules/
.next/
.env
.env.local
*.tsbuildinfo
```

---

## 5. STACK TECNICO — JUSTIFICATIVAS

### Frontend
| Tecnologia | Versao | Justificativa |
|-----------|--------|--------------|
| **Next.js** | 16.0.10 | App Router, SSR, API Routes BFF, edge runtime |
| **React** | 19.2.0 | Hooks, Suspense, server components |
| **Tailwind CSS** | 4.1.9 | OKLCH nativo, config via CSS (sem tailwind.config.ts) |
| **shadcn/ui** | 57 componentes | Radix primitives, acessivel, composavel, sem vendor lock-in |
| **Zod** | 3.25.76 | Validacao runtime + derivacao de tipos TypeScript |
| **TypeScript** | 5 (strict) | noUncheckedIndexedAccess para seguranca de indices |

### Auth e Dados
| Tecnologia | Justificativa |
|-----------|--------------|
| **Supabase** (PostgreSQL) | Auth Gov.br OAuth2, RLS multi-tenant, Realtime |
| **@supabase/ssr** | 3 clients (browser/server/middleware) — padrao oficial Next.js |

### Deploy
| Tecnologia | Justificativa |
|-----------|--------------|
| **Vercel** | Deploy automatico, edge functions, preview por PR |
| **pnpm** | Mais rapido que npm, deduplicacao inteligente |

---

## 6. DECISOES TECNICAS — JUSTIFICATIVAS

### 6.1 BFF Pattern (Browser-for-Backend)
**O que:** Frontend NUNCA chama Cloudflare Workers direto. Passa por Next.js API Routes.
**Por que:** Seguranca (SERPRO keys ficam server-side), CORS simplificado, auth validation centralizada.
```
Browser → /api/processo/[id]/chat → Workers (Hono)
```

### 6.2 Claude AI Tiers (reducao de custo)
| Tier | Modelo | Uso | % Requests |
|------|--------|-----|-----------|
| TRIAGEM | Haiku 4.5 | Classificacao, routing, NER | 80% |
| GERACAO | Sonnet 4.5 | Texto juridico, sugestoes | 15% |
| CRITICO | Opus 4.6 | Jurisprudencia, decisoes criticas | 5% |

**Por que:** Haiku e 40x mais barato que Opus. 80% das requisicoes nao precisam de modelo grande.

### 6.3 Selo ATA360 — NAO e decorativo
**O que:** Atestado de qualidade baseado no resultado do AUDITOR.
**Logica:**
- CONFORME → selo presente
- RESSALVAS + usuario aprovou → selo presente
- NAO_CONFORME + usuario insistiu (PROSSEGUIR) → selo **ausente** (silencioso, sem explicacao)

**Por que:** Protege o gestor publico (LINDB Art. 28). O selo so aparece quando o documento passou por auditoria completa.

### 6.4 LINDB (Lei 13.655/2018)
6 artigos que protegem o servidor publico contra responsabilizacao indevida. Mapeados por artefato no schema `process.ts`.

### 6.5 WCAG 2.1 AA (acessibilidade)
**O que:** aria-labels em todos os botoes, htmlFor/id em formularios, roles em modais.
**Por que:** Obrigatorio para sistemas publicos (Lei 13.146/2015 — Estatuto PCD). Zero impacto visual.

### 6.6 next/image ao inves de img
**O que:** Componente `<Image>` do Next.js no lugar de `<img>` HTML.
**Por que:** Otimizacao automatica (AVIF/WebP), lazy loading, responsivo. Mesma aparencia, melhor performance.

### 6.7 noUncheckedIndexedAccess (TypeScript)
**O que:** `array[0]` retorna `T | undefined` ao inves de `T`.
**Por que:** Previne bugs de runtime quando indice nao existe. Corrigido com `??` e `!`.

### 6.8 Remocao do @vercel/analytics
**O que:** Removido em favor de observabilidade propria (`lib/observability.ts`).
**Por que:** Analytics Vercel nao funciona em deploy Cloudflare (Workers). O sistema usa logger + metricas + Web Vitals proprios.

### 6.9 OKLCH ao inves de HEX (cores)
**O que:** Todas as cores do tema usam OKLCH (Tailwind 4 nativo).
**Por que:** Uniformidade perceptual — cores parecem igualmente "vivas" ao olho humano. HEX nao garante isso.

---

## 7. SEGURANCA

### Content Security Policy (CSP)
Gerenciado no `middleware.ts`. Permite: self, Supabase URLs, AI Gateway. Bloqueia: eval, inline scripts nao autorizados.

### Headers de seguranca (next.config.mjs)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=63072000; preload`
- `Permissions-Policy: interest-cohort=()` (bloqueia FLoC)
- `X-XSS-Protection` **removido** (deprecado, CSP substitui)

### RLS Multi-tenant (Supabase)
Cada ente publico ve APENAS seus dados. Politicas RLS em todas as 5 tabelas.

### Sigilo (Part 19)
Frontend NUNCA recebe: YAMLs, regras Auditor, prompts ACMA, dados de outros tenants.

---

## 8. COMO RODAR

```bash
# Clone
git clone git@github.com:ata360brasil/v0-ata-360-chatbot-ui.git
cd v0-ata-360-chatbot-ui

# Instalar
pnpm install

# Criar .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_ATA360_API_URL=https://pncp-ata360.monostateorg.workers.dev

# Dev
pnpm dev

# Build
pnpm build

# Deploy
git push origin main    # Vercel auto-deploy
```

---

## 9. CONTAGEM FINAL

| Categoria | Quantidade |
|-----------|-----------|
| Rotas (paginas) | 11 (/, login, dashboard, contracts, processes, history, files, team, assistants, 404, error) |
| API Routes (BFF) | 6 (/api/processo, chat, decisao, status, audit, auth/callback) |
| Componentes core | 20 (chat, sidebar, artifacts, stepper, auditor, decision, insight, filtros, settings, notificacoes...) |
| Componentes UI | 57 (shadcn/ui) |
| Schemas Zod | 6 (process, serpro, gov-apis, ai-gateway, selo, index) |
| Templates HTML | 22 (mestre + 14 gerais/ARP + 6 setoriais) |
| Specs | 5 (v8 consolidada + 3 agentes + Part 21) |
| Testes | 7 |
| Total arquivos | ~180 |

---

*Gerado em 08/fev/2026. Projeto ATA360 — Plataforma Inteligente de Contratacoes Publicas.*
