# ATA360 — Handoff Técnico para Desenvolvimento
**Data:** 08 de fevereiro de 2026
**Repo:** `ata360brasil/v0-ata-360-chatbot-ui` (GitHub privado)
**Local:** `C:\Users\renat\v0-ata-360-chatbot-ui`
**Branch:** `main`
**Último commit funcional:** `4fc0b4a` — "feat: wire mockup to real system"

---

## 1. RESUMO EXECUTIVO

Transformamos o mockup v0 (UI decorativa) em skeleton funcional conectado à arquitetura real do ATA360. O layout e design foram preservados integralmente — o que mudou é que agora os componentes estão wired a schemas reais, APIs governamentais, auth Supabase, fluxo cíclico com state machine, e lógica de selo/auditor.

**Números:**
- **65 arquivos** alterados nos 3 últimos commits
- **+21.029 linhas** adicionadas
- **3 commits** principais: `b296212` (infraestrutura), `0a26742` (templates/specs), `4fc0b4a` (wiring)

---

## 2. OS 3 COMMITS — O QUE CADA UM FEZ

### Commit 1: `b296212` — Infraestrutura Base
**29 arquivos | +2.081 linhas**

Criou toda a camada de infraestrutura que não existia no mockup:

| Categoria | Arquivos | O que faz |
|-----------|----------|-----------|
| **Supabase Auth** | `lib/supabase/client.ts`, `server.ts`, `middleware.ts`, `database.types.ts`, `index.ts` | Client browser + server + admin (service role), refresh de sessão no middleware, tipos TypeScript gerados do schema |
| **API Routes (BFF)** | `app/api/processo/route.ts`, `[id]/chat/route.ts`, `[id]/decisao/route.ts`, `[id]/status/route.ts`, `app/api/audit/route.ts`, `app/api/auth/callback/govbr/route.ts` | Pattern BFF: Frontend → Next.js → Workers. Nunca browser direto ao Workers |
| **Hooks** | `hooks/use-auth.ts`, `hooks/use-process.ts` | useAuth: listener Supabase onAuthStateChange, mapper Gov.br. useProcess: state machine, criar/carregar/decidir/limpar |
| **Schemas Zod** | `lib/schemas/process.ts`, `index.ts` | State machine (12 estados → 7 steps visuais), 46 tipos de artefato, decisões usuário, vereditos auditor |
| **Components** | `components/process-stepper.tsx`, `auditor-checklist.tsx`, `decision-bar.tsx`, `insight-cards.tsx` | 4 componentes do fluxo cíclico — stepper visual, checklist tripartição, barra de decisão com limites, cards insight engine |
| **Login** | `app/login/page.tsx` | Gov.br OAuth2 + modo demo (anônimo), Suspense boundary |
| **Observabilidade** | `lib/observability.ts` | 3 pilares: logger (ring buffer 500), metrics (Web Vitals LCP/FID/CLS), traces com session ID |
| **API Client** | `lib/api.ts` | Fetch wrapper com Zod validation, timeout 30s, ApiError tipado, endpoints processo/chat/audit/pncp/insight |
| **SQL** | `supabase/001_schema_inicial.sql` | Tabelas: orgaos, usuarios, processos, documentos, audit_trail — com RLS multi-tenant |

### Commit 2: `0a26742` — Templates, Config YAML e Specs
**28 arquivos | +18.077 linhas**

Centralizou no repo todos os artefatos de referência:

| Categoria | Arquivos | Detalhe |
|-----------|----------|---------|
| **Templates HTML** | 22 arquivos em `templates/` | Documento Mestre v8 + 14 existentes (v7.1) + setoriais (Saúde, Obras, TIC) + ARP (7 docs) |
| **Config YAML** | `configs/documentos-config.yaml` (1.704 linhas) | 20 tipos documento (14 + 6 P0), LINDB, Dec. 12.807, 30 jurisprudências, Manual TCU 5ª Ed. |
| **Specs** | 5 arquivos em `specs/` | Spec v8 consolidada (20 Parts), Auditor v3, ACMA v3, Design Law v3.1, Análise Mockup (Part 21) |

**Templates revisados (não são versões originais do handoff):**
- **ETP** (`03_ETP_template_v7.html`): "Painel de Preços" → PNCP/Compras.gov, IN 01/2010 → Dec. 7.746/2012
- **PP** (`04_PP_template_v7.html`): 5 ocorrências "Painel de Preços" → PNCP/Compras.gov
- **JCD** (`07_JCD_template_v7.html`): Valores 2026 (Dec. 12.807/2025), LINDB adicionada

### Commit 3: `4fc0b4a` — Wiring (Mock → Real)
**11 arquivos | +873 / -122 linhas**

Conectou os componentes existentes à lógica real:

| Arquivo | O que mudou |
|---------|-------------|
| `lib/schemas/serpro.ts` (NOVO) | 9 contratos SERPRO → 13 APIs + 4 timestamps = 17 serviços. Schemas: CNPJ v2, CPF v2, CND, DATAVALID v4, Dívida Ativa, Carimbo Tempo, NeoSigner |
| `lib/schemas/gov-apis.ts` (NOVO) | 17 fontes governamentais, 110+ endpoints. PNCP, Compras.gov, Transparência, TransfereGov, FNS, FNDE, IBGE, TCU, BCB, SICONFI. Radar de Recursos (7 status) |
| `lib/schemas/ai-gateway.ts` (NOVO) | Claude tiered: Haiku 80% (triagem), Sonnet 15% (geração), Opus 5% (crítico). Fallbacks GPT-4o/Gemini. 8 camadas blindagem ACMA |
| `lib/schemas/selo.ts` (NOVO) | Selo Governança Ouro: `calcularSeloAprovado()` → CONFORME=true, RESSALVAS+APROVAR=true, NAO_CONFORME+PROSSEGUIR=false (silencioso). Carimbo SERPRO + ICP-Brasil |
| `lib/schemas/process.ts` (EXPANDIDO) | +P1 artefatos, +TRILHA_DOCUMENTOS por modalidade, +Normativo enum (11 leis), +NORMATIVOS_POR_ARTEFATO, +LINDB_ARTIGOS (6 artigos com ementa) |
| `lib/schemas/index.ts` (ATUALIZADO) | Re-exports novos schemas |
| `lib/api.ts` (EXPANDIDO) | +`serpro.*` (7 endpoints), +`gov.*` (9 endpoints incluindo radarRecursos) |
| `contexts/app-context.tsx` (REESCRITO) | Integrou useAuth() + useProcess(). Expõe: authUser, signOut, currentProcess, criarProcesso, carregarProcesso, decidirProcesso |
| `components/sidebar-menu.tsx` (MODIFICADO) | "superadm" hardcoded → `authUser?.role`. Avatar dinâmico. signOut real |
| `components/chat-area.tsx` (MODIFICADO) | setTimeout mock → `chatApi.enviar()` real com fallback demo. Recarrega processo após resposta |
| `components/artifacts-panel.tsx` (MODIFICADO) | Integrou ProcessStepper (topo), AuditorChecklist (abaixo conteúdo), DecisionBar (footer quando AGUARDANDO_DECISAO) |

---

## 3. ARQUITETURA — VISÃO GERAL

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND — Next.js 16 + React 19 + Tailwind 4 + shadcn │
│                                                         │
│  app/login/page.tsx ──→ Supabase Auth (Gov.br OAuth2)   │
│  app/(main)/page.tsx ──→ Chat + Artifacts Panel         │
│                                                         │
│  contexts/app-context.tsx (estado global)                │
│    ├── useAuth()     → Supabase session + Gov.br        │
│    ├── useProcess()  → State machine 12 estados         │
│    ├── theme         → light/dark                       │
│    └── panels        → sidebar + artifacts              │
│                                                         │
│  components/                                            │
│    ├── chat-area.tsx        → enviar mensagem real       │
│    ├── artifacts-panel.tsx  → documento + auditor + selo │
│    ├── process-stepper.tsx  → 7 steps visuais            │
│    ├── auditor-checklist.tsx→ tripartição + score        │
│    ├── decision-bar.tsx     → 5 ações + limites          │
│    └── insight-cards.tsx    → 5 tipos card               │
│                                                         │
│  lib/schemas/ (Zod type-safe)                           │
│    ├── process.ts    → state machine + trilha + LINDB   │
│    ├── serpro.ts     → 17 serviços SERPRO               │
│    ├── gov-apis.ts   → 110+ endpoints gov               │
│    ├── ai-gateway.ts → Claude tiers + blindagem         │
│    └── selo.ts       → Governança Ouro condicional      │
└──────────────┬──────────────────────────────────────────┘
               │ BFF (Next.js API Routes)
               │ app/api/processo/      → CRUD + chat + decisão
               │ app/api/audit/         → audit trail batch
               │ app/api/auth/callback/ → Gov.br OAuth2
               ▼
┌──────────────────────────────────────────────────────────┐
│ BACKEND — Cloudflare Workers + Hono v4 (TypeScript)      │
│ (Implementar — PoC existente: pncp-ata360.monostate...)  │
│                                                          │
│  Orquestrador → Insight Engine → ACMA → DESIGN_LAW →    │
│  AUDITOR → Loop cíclico (max 3 sugestões, 5 reauditorias│
└──────────────────────────────────────────────────────────┘
```

---

## 4. FLUXO CÍCLICO — COMO FUNCIONA NA UI

```
USUARIO ENVIA MENSAGEM
  │
  ├─→ chat-area.tsx → chatApi.enviar(processoId, mensagem)
  │     (se sem processoId → fallback demo DFD local)
  │
  ├─→ API Route /api/processo/[id]/chat → Workers
  │
  ├─→ Response: { mensagem, artefato?, insight_cards? }
  │
  ├─→ Se artefato: artifacts-panel.tsx renderiza documento
  │     ├─→ process-stepper.tsx mostra step atual (7 steps)
  │     ├─→ auditor-checklist.tsx mostra parecer (se houver)
  │     └─→ decision-bar.tsx aparece em AGUARDANDO_DECISAO
  │
  └─→ DECISÃO DO USUARIO:
        ├── APROVAR    → selo_aprovado = true → próximo doc da trilha
        ├── EDITAR     → volta DESIGN_LAW → AUDITOR → loop
        ├── NOVA_SUGESTAO → volta ACMA → loop (max 3/seção)
        ├── PROSSEGUIR → selo_aprovado = false (silencioso) → próximo doc
        └── DESCARTAR  → confirmar → limpa processo
```

---

## 5. SCHEMAS — DETALHE TÉCNICO

### 5.1 State Machine (`process.ts`)
12 estados internos → 7 steps visuais:
```
RASCUNHO → COLETANDO_DADOS → GERANDO_SUGESTAO → AGUARDANDO_DECISAO →
GERANDO_DOCUMENTO → AUDITANDO → CONCLUIDO
(+ ERRO, CANCELADO, EDITANDO, RE_AUDITANDO, AGUARDANDO_CORRECAO)
```

### 5.2 Trilha de Documentos (`process.ts`)
```typescript
TRILHA_DOCUMENTOS = {
  pregao:          [PCA, DFD, ETP, PP, TR, MR, JCD],
  dispensa:        [DFD, JCD],
  arp:             [PCA, DFD, ETP, PP, TR, MR, JCD, OFG, AUG, OFF, ACF, COM, REC, ARP],
  credenciamento:  [DFD, ETP, TR, EDL],
}
```

### 5.3 Claude AI Tiers (`ai-gateway.ts`)
| Tier | Uso | Modelo Principal | Fallback |
|------|-----|-----------------|----------|
| TRIAGEM (80%) | Classificação, routing, NER | Claude Haiku 4.5 | GPT-4o-mini |
| GERACAO (15%) | Texto jurídico, sugestões | Claude Sonnet 4.5 | GPT-4o |
| CRITICO (5%) | Jurisprudência, decisões | Claude Opus 4.6 | Gemini 2.0 Pro |

### 5.4 Selo ATA360 (`selo.ts`)
```typescript
calcularSeloAprovado(veredito, decisao_usuario):
  CONFORME                    → true  (selo presente)
  RESSALVAS + APROVAR         → true  (selo presente)
  NAO_CONFORME + PROSSEGUIR   → false (selo AUSENTE, silencioso)
  NAO_CONFORME + APROVAR      → false (impossível, UI bloqueia)
```
O selo NÃO é decorativo — é atestado de qualidade (Part 19.10.3).

### 5.5 LINDB (`process.ts`)
6 artigos da Lei 13.655/2018 que protegem o gestor público:
- Art. 20: Decisões com base em consequências práticas
- Art. 21: Regime de transição proporcional
- Art. 22: Consideração de dificuldades reais do gestor
- Art. 23: Regime de transição para mudanças de lei
- Art. 28: Responsabilização pessoal só com dolo/erro grosseiro
- Art. 30: Compensação por invalidade retroativa

### 5.6 Normativos por Artefato (`process.ts`)
11 normativos mapeados por tipo de documento:
- Lei 14.133/2021, Dec. 11.246/2022, IN SEGES 58/2022, IN SEGES 73/2022
- IN SEGES 75/2024, IN SEGES/MGI 52/2025, Dec. 12.807/2025
- Dec. 11.878/2024, Dec. 7.746/2012, Lei 13.655/2018 (LINDB)
- Manual TCU Licitações 5ª Ed.

### 5.7 SERPRO — 17 Serviços (`serpro.ts`)
9 contratos → 13 APIs + 4 Timestamps:

| Contrato | API | Uso no ATA360 |
|----------|-----|---------------|
| 266287 | CNPJ v2 + Timestamp | Validar fornecedor |
| 266310 | CPF v2 + Timestamp | Validar responsável |
| 266331 | CND + Timestamp | Certidão Negativa |
| 266318 | DATAVALID v4 + Timestamp | Biometria Gov.br |
| 266324 | Dívida Ativa | Verificar inadimplência |
| 266253 | NFe | Nota fiscal eletrônica |
| 266334 | Faturamento | Porte empresa |
| 266338 | Carimbo de Tempo | Prova temporal (ICP-Brasil) |
| 266343 | Renda | Consulta renda |
| — | NeoSigner | Assinatura digital ICP-Brasil |
| — | Validador ICP-Brasil | Verificar certificados (grátis) |
| — | Conecta Gov.br | SSO governo (grátis) |

### 5.8 APIs Governamentais — 17 Fontes, 110+ Endpoints (`gov-apis.ts`)

**Monostate (10 fontes, 76+ endpoints — PoC existente):**
- PNCP (29): atas, contratos, itens, preços, PCA, órgãos
- Compras.gov/SIASG (8): ARP saldo, pesquisa preço, PGC, CATMAT
- Portal Transparência (10): CEIS, CNEP, CEPIM, CEAF, convênios, emendas
- IBGE (4): municípios, estados, agregados
- TCU (2): acórdãos, responsáveis
- BCB (4 séries): IPCA, IGP-M, Selic, Dólar
- SICONFI/Tesouro (4): finbra, receita, despesa, limites LRF
- TransfereGov (6): convênios, cronograma, empenhos, pagamentos
- FNS (5): repasses-dia, pagamentos por bloco, saldos
- FNDE (5): PNAE, PDDE, PNATE, FUNDEB, PROINFANCIA

**Roberto / adicionais (7 fontes, ~30 endpoints):**
- FNAS/SUAS (3): scraping blocos PSB, PSE, PGS
- SINAPI/SICRO: custos unitários obras (download mensal)
- LOA/SIOP: dotações orçamentárias
- SIMEC: infraestrutura educacional
- Câmara (4): deputados, proposições, votações
- Senado/SIGA (3): dados abertos, painel emendas
- SERPRO (17): ver seção acima

**Radar de Recursos — 7 Status:**
```
DISPONIVEL | ELEGIVEL | SUBUTILIZADO | EM_EXECUCAO |
PERDIDO_DEVOLVIDO | EM_RISCO | HISTORICO
```
Cruza: Emendas (RP6-9, PIX) + Convênios (7 estados) + FNS (5 blocos) + FNDE (5 programas)

---

## 6. DOCUMENTO MESTRE v8 (`templates/documento_base_v8.html`)

Template universal — renderiza QUALQUER dos 46 tipos de artefato via YAML + Jinja2.

**15 blocos na ordem:**
1. Cabeçalho (brasão + logomarca ente)
2. Identificação (protocolo, UASG, modalidade)
3. Fundamentação Legal (normativos aplicáveis)
4. Rastreabilidade (hash SHA-256, versão, audit trail)
5. Contexto do Ente **(NOVO v8)** — IBGE, FPM, FNDE, população
6. Resumo Executivo
7. Sumário (gerado automaticamente)
8. Seções (conteúdo variável por tipo via YAML)
9. Checklist Auditor (tripartição: CONFORME/RESSALVAS/NAO_CONFORME)
10. Normativos Aplicáveis **(NOVO v8)** — tabela de leis por artefato
11. Declarações (responsabilidade do ordenador)
12. Assinaturas (ICP-Brasil via NeoSigner)
13. Histórico de Versões
14. Trilha de Documentos (qual doc vem antes/depois)
15. Selo ATA360 **(NOVO v8)** — condicional via `{% if selo_aprovado %}`

**Zonas de edição:** `data-zona="editavel|protegido|revisavel|bloqueado"`
**Modo escuro:** `prefers-color-scheme: dark`
**Impressão P&B:** `@media print` com escala de cinza
**Legal Design:** Palatino Linotype, escala tipográfica áurea, WCAG AA

---

## 7. SEGURANÇA E SIGILO (Part 19)

### O que APARECE nos PDFs (público):
- Dados do processo, preços PNCP, fundamentação legal
- Resultado Auditor (tripartição: CONFORME/RESSALVAS/NAO_CONFORME)
- Selo "Powered by ATA360"

### O que NUNCA aparece nos PDFs (propriedade intelectual):
- Nomes de agentes (Orquestrador, ACMA, AUDITOR, DESIGN_LAW)
- YAMLs de configuração
- Prompts do ACMA
- Modelos de IA usados
- Scores internos, pesos, thresholds, fórmulas
- Credenciais SERPRO

### O que o Frontend NUNCA recebe:
- YAMLs de configuração
- Regras do Auditor
- Prompts do ACMA
- Dados de outros tenants (RLS Supabase)
- Credenciais SERPRO

**Base legal:** Lei 9.279/1996 (segredo industrial), LGPD, Lei 9.609/1998, Marco Civil

---

## 8. CONFIGURAÇÃO YAML (`configs/documentos-config.yaml`)

1.704 linhas — 20 tipos de documento configurados:

**14 Existentes (v7.1):** PCA, DFD, ETP, PP, TR, MR, JCD, ARP, OFG, AUG, OFF, ACF, COM, REC
**6 P0 Novos (YAML pronto, ZERO código):** CDF, ALF, ALP, ALV, RPP, PAU

Cada entrada YAML contém:
```yaml
tipo_documento:
  meta:        # nome, sigla, base_legal, modalidades
  secoes:      # lista ordenada de seções com tipo (texto/tabela/checklist)
  checklist:   # itens de auditoria com fundamentação
  variaveis:   # dados injetados pelo sistema (preços, datas, CNPJ)
  normativos:  # leis aplicáveis a este tipo
```

Novo artefato = nova entrada YAML (~30-50 linhas), ZERO código.

---

## 9. STATUS VERCEL — AÇÃO NECESSÁRIA

O projeto está vinculado à Vercel (`contato-9914s-projects/v0-ata-360-chatbot-ui`).

**Situação atual:**
- 3 últimos deploys em **Error** (falham em ~7s — erro no install, não no build)
- Último deploy **Ready** foi antes dos 3 commits de infraestrutura
- Build local passa sem erros (`pnpm build` ✓)

**Env vars configuradas na Vercel (placeholders):**
- `NEXT_PUBLIC_SUPABASE_URL` — placeholder (substituir pela URL real do projeto Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — placeholder (substituir pela anon key real)
- `SUPABASE_SERVICE_ROLE_KEY` — placeholder (substituir pela service role key real)

**Causa provável do erro:**
O lockfile `pnpm-lock.yaml` pode ter inconsistência com as novas dependências Supabase, ou a Vercel pode estar usando npm/yarn em vez de pnpm. Verificar:
1. `vercel.json` não existe — criar com `{ "installCommand": "pnpm install", "buildCommand": "pnpm build" }`
2. Ou configurar no dashboard Vercel: Settings → General → Install Command = `pnpm install`

**Para corrigir:**
```bash
# Opção 1: Criar vercel.json
echo '{ "installCommand": "pnpm install", "buildCommand": "pnpm build" }' > vercel.json

# Opção 2: Substituir env vars por valores reais
npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production
echo "https://SEU-PROJETO.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Redeploy
npx vercel --prod
```

---

## 10. O QUE FALTA IMPLEMENTAR (Próximos Passos)

### Prioridade ALTA (para funcionar end-to-end):
1. **Workers Backend (Hono v4)** — Orquestrador + 5 agentes. PoC PNCP existe, expandir
2. **Supabase projeto real** — Criar projeto, rodar `001_schema_inicial.sql`, configurar Gov.br OAuth2
3. **Fix Vercel deploy** — `vercel.json` + env vars reais + verificar pnpm
4. **Universal Renderer** — `components/artifacts/universal-renderer.tsx` (YAML → HTML no browser)

### Prioridade MÉDIA:
5. **SERPRO integração real** — 9 contratos, credenciais em Workers secrets
6. **Radar de Recursos** — Dashboard cruzando 17 fontes + 7 status
7. **P1 artefatos** — 11 novos YAMLs + 3-5 Workers endpoints cada
8. **Normalização linguística** — Expandir sinonímias (127→500+), regionalismos, marcas genéricas

### Prioridade BAIXA:
9. **LEGAL_SYNC** — Cron monitora DOU, atualiza lookup tables
10. **P2 artefatos** — 15 tipos, depende SERPRO + módulo execução
11. **NeoSigner** — Assinatura digital ICP-Brasil real
12. **Carimbo SERPRO** — Prova temporal (contrato 266338)

---

## 11. INVENTÁRIO COMPLETO DE ARQUIVOS

### Novos (criados nesta sessão) — 37 arquivos

```
# Supabase (5)
lib/supabase/client.ts              # Browser client singleton
lib/supabase/server.ts              # Server client + admin (service role)
lib/supabase/middleware.ts           # Session refresh (token 1h expiry)
lib/supabase/database.types.ts       # Generated TypeScript types
lib/supabase/index.ts                # Re-exports

# API Routes BFF (6)
app/api/auth/callback/govbr/route.ts # Gov.br OAuth2 callback
app/api/processo/route.ts            # POST criar processo
app/api/processo/[id]/chat/route.ts  # POST enviar mensagem
app/api/processo/[id]/decisao/route.ts # POST decisão usuário
app/api/processo/[id]/status/route.ts  # GET estado atual
app/api/audit/route.ts               # POST batch audit events

# Hooks (2)
hooks/use-auth.ts                    # Supabase auth + Gov.br mapper
hooks/use-process.ts                 # State machine + actions

# Schemas Zod (6)
lib/schemas/process.ts               # State machine + trilha + LINDB + normativos
lib/schemas/serpro.ts                 # 17 serviços SERPRO (9 contratos)
lib/schemas/gov-apis.ts              # 17 fontes gov, 110+ endpoints
lib/schemas/ai-gateway.ts            # Claude tiers + blindagem
lib/schemas/selo.ts                  # Governança Ouro condicional
lib/schemas/index.ts                 # Re-exports

# Componentes fluxo cíclico (4)
components/process-stepper.tsx        # 7 steps visuais + iteração
components/auditor-checklist.tsx      # Tripartição + score + fundamentação
components/decision-bar.tsx           # 5 ações + limites (3 sugestões, 5 reauditorias)
components/insight-cards.tsx          # 5 tipos card (preço, ARP, emenda, jurisp, alerta)

# Login (1)
app/login/page.tsx                   # Gov.br + demo + Suspense

# Infraestrutura (2)
lib/api.ts                           # BFF client (processo + chat + serpro + gov)
lib/observability.ts                 # Logger + metrics + traces

# SQL (1)
supabase/001_schema_inicial.sql      # DDL + RLS multi-tenant

# Templates (22)
templates/documento_base_v8.html     # Master template universal (15 blocos)
templates/gerais/01-14*.html         # 7 templates gerais
templates/setoriais/*.html           # 6 templates setoriais (Saúde, Obras, TIC)
templates/arp/*.html                 # 7 templates ARP
templates/legacy/documento_base.html # Base anterior

# Config (1)
configs/documentos-config.yaml       # Master config v3.0 (20 tipos, 1.704 linhas)

# Specs (5)
specs/07-AUDITOR-AGENT-v2-REVISADO.md
specs/08-ACMA-AGENT-v2-REVISADO.md
specs/09-DESIGN-LAW-AGENT-v3-REVISADO.md
specs/10-ESPECIFICACAO-TECNICA-CONSOLIDADA-v8.md
specs/21-ANALISE-MOCKUP-E-SKELETON-IMPLEMENTACAO.md
```

### Modificados (wiring nesta sessão) — 6 arquivos

```
contexts/app-context.tsx             # +useAuth +useProcess integrados
components/sidebar-menu.tsx          # hardcoded → auth real + signOut
components/chat-area.tsx             # setTimeout → chatApi.enviar() + fallback
components/artifacts-panel.tsx       # +ProcessStepper +AuditorChecklist +DecisionBar
middleware.ts                        # +Supabase auth + CSP headers
next.config.ts                       # +Supabase external images
```

---

## 12. REFERÊNCIA RÁPIDA — COMO RODAR

```bash
# Clone
git clone git@github.com:ata360brasil/v0-ata-360-chatbot-ui.git
cd v0-ata-360-chatbot-ui

# Install
pnpm install

# Env vars (criar .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_ATA360_API_URL=https://pncp-ata360.monostateorg.workers.dev

# Dev
pnpm dev

# Build
pnpm build

# Deploy
npx vercel --prod
```

---

## 13. SPEC DE REFERÊNCIA

A **fonte da verdade** é:
```
specs/10-ESPECIFICACAO-TECNICA-CONSOLIDADA-v8.md
```
20 Parts, 177.358 linhas. Tudo que foi implementado segue esta spec.

A **guia de implementação** usada nesta sessão:
```
specs/21-ANALISE-MOCKUP-E-SKELETON-IMPLEMENTACAO.md
```
57.289 linhas. Análise do mockup v0 + skeleton + best practices.

---

*Documento gerado em 08/fev/2026. Commit de referência: `4fc0b4a`.*
*Projeto: ATA360 — Plataforma Inteligente de Contratações Públicas.*
