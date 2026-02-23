# AUDITORIA COMPLETA — ATA360 Platform

**Data:** 2026-02-23
**Branch auditada:** `claude/code-audit-review-TIAsz` (base: `master`)
**Commits analisados:** 20 commits (desde `df440b1` até `09fbe5f`)

---

## 1. VISÃO GERAL DO PROJETO

| Item | Detalhe |
|------|---------|
| **Nome** | ata360-platform |
| **Framework** | Next.js 16.0.10 + React 19.2.0 |
| **Linguagem** | TypeScript 5.x (strict mode) |
| **UI** | shadcn/ui (estilo new-york) + Radix UI + Tailwind CSS 4 |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **IA** | Anthropic Claude (Haiku/Sonnet/Opus) via Cloudflare AI Gateway |
| **Infra** | Cloudflare Workers + R2 + D1 + KV + Vectorize |
| **Auth** | Gov.br OAuth2 + Supabase Auth |
| **Analytics** | ClickHouse Cloud |
| **Domínio** | Contratações públicas brasileiras (Lei 14.133/2021) |

### Estrutura de Diretórios

```
app/
├── (institutional)/     # 10 páginas institucionais (público)
├── (legal)/             # 3 páginas legais: privacidade, termos, LGPD
├── (main)/              # 7 páginas da aplicação (autenticado)
│   ├── page.tsx         # Chat principal
│   ├── assistants/      # Assistentes IA
│   ├── contracts/       # Contratos
│   ├── dashboard/       # Dashboard SuperAdm
│   ├── files/           # Documentos
│   ├── history/         # Histórico
│   ├── processes/       # Processos
│   └── team/            # Equipe
├── api/                 # 23 route handlers
├── login/               # Autenticação
└── layout.tsx           # Root layout
clickhouse/
└── migrations/          # 3 migrações ClickHouse (ACMA, Auditor, Dashboard views)
components/
├── ui/                  # 84 componentes shadcn/ui
├── artifacts/           # Componentes de artefatos (DFD, etc.)
└── *.tsx                # 27 componentes customizados
configs/
└── documentos-config.yaml  # Configuração de tipos de documentos
contexts/
└── app-context.tsx      # Provider global
data/
└── normalizacao/        # 6 arquivos JSON para NLP (abreviaturas, sinônimos, etc.)
hooks/                   # 6 hooks customizados
lib/
├── schemas/             # 9+ schemas Zod
├── supabase/            # 5 arquivos (client, server, middleware, types, index)
├── api.ts               # Cliente API type-safe (1436 linhas)
├── audit.ts             # Audit trail
├── lgpd.ts              # Compliance LGPD
├── observability.ts     # Logs + Metrics + Traces
├── validations.ts       # Validação com Zod
└── utils.ts             # Utilitários
supabase/
└── migrations/          # 8 migrações SQL
templates/               # 22 templates HTML para geração de documentos
├── gerais/              # PCA, DFD, ETP, PP, TR, MR, JCD
├── arp/                 # Templates de Ata de Registro de Preços
├── obras/               # Templates setor Obras
├── saude/               # Templates setor Saúde
└── tic/                 # Templates setor TIC
tests/                   # 7 arquivos de teste (Vitest)
types/
└── index.ts             # Branded types (CPF, CNPJ, ProcessID, etc.)
workers/
└── src/                 # Backend Cloudflare Workers (orquestrador, normalização, etc.)
```

**Total de arquivos:** ~327 (excluindo node_modules, .next, .git)

---

## 2. AUDITORIA DE SEGURANÇA

### 2.1 Pontos Positivos (APROVADOS)

| Área | Implementação | Avaliação |
|------|--------------|-----------|
| **CSP** | Nonce dinâmico por request no middleware + `strict-dynamic` | ✅ Excelente |
| **Headers OWASP 2024** | X-Frame-Options DENY, HSTS 2 anos, COOP/CORP same-origin | ✅ Excelente |
| **Permissions-Policy** | camera, microphone, geolocation, interest-cohort bloqueados | ✅ Correto |
| **BFF Pattern** | Frontend nunca chama Workers/APIs externas diretamente | ✅ Correto |
| **Auth Middleware** | Refresh de JWT em cada request, redirect para login se não autenticado | ✅ Correto |
| **LGPD** | Módulo completo: consentimento, anonimização, retenção, direitos Art. 18 | ✅ Muito Bom |
| **Sanitização** | `lib/validations.ts` com sanitize() para XSS | ✅ Bom |
| **Validação Zod** | Runtime validation no API client (`schema.safeParse`) | ✅ Bom |
| **Senha** | Mínimo 12 chars, maiúscula, minúscula, número, especial | ✅ Forte |
| **poweredByHeader** | Desabilitado no next.config.mjs | ✅ Correto |
| **Anti-scraping** | `X-Robots-Tag: noarchive, nosnippet` em rotas internas | ✅ Bom |
| **.gitignore** | Exclui .env*, *.pem, *.key, *.cert, specs/ | ✅ Seguro |

### 2.2 Vulnerabilidades e Riscos

#### CRÍTICO

| # | Descrição | Arquivo | Linha | Recomendação |
|---|-----------|---------|-------|--------------|
| S1 | **Open Redirect no OAuth callback** — `redirect` param vem da query string sem validação de origem. Um atacante pode usar `?redirect=https://evil.com` para redirecionar pós-login. | `app/api/auth/callback/govbr/route.ts` | 14,21 | Validar que `redirect` começa com `/` e não contém `//` ou `://`. |
| S2 | **Non-null assertion em env vars** — `process.env.NEXT_PUBLIC_SUPABASE_URL!` pode causar crash em runtime se variável não estiver definida (server.ts usa `!` mas middleware já verifica). | `lib/supabase/server.ts` | 17-18 | Usar validação explícita ou lançar erro descritivo. |
| S3 | **Audit flush comentado** — O `flushAuditLog()` em produção **não envia dados para nenhum backend** (fetch está comentado como TODO). Logs de auditoria são perdidos. | `lib/audit.ts` | 86 | Implementar integração com endpoint real. |

#### ALTO

| # | Descrição | Arquivo | Recomendação |
|---|-----------|---------|--------------|
| S4 | **Rate limit declarado mas não implementado** — `/api/contato` menciona "máximo 5 envios por IP por hora" no comentário, mas não há lógica de rate limiting. | `app/api/contato/route.ts` | Implementar via Cloudflare WAF ou middleware. |
| S5 | **Upload de arquivos sem validação server-side** — `chat-area.tsx` aceita uploads mas não há validação de MIME type, tamanho ou conteúdo malicioso no backend. | `components/chat-area.tsx` | Validar tipo/tamanho no route handler antes de processar. |
| S6 | **img-src permite `https:`** — A CSP permite imagens de qualquer host HTTPS, o que enfraquece a proteção contra exfiltração de dados via imagem. | `middleware.ts` | Restringir a domínios específicos (supabase.co, r2.cloudflarestorage.com). |
| S7 | **`style-src 'unsafe-inline'`** — Necessário para Tailwind CSS-in-JS, mas reduz a eficácia da CSP contra injeção de estilos. | `middleware.ts` | Documentar como risco aceito; migrar para CSS Modules se possível. |

#### MÉDIO

| # | Descrição | Arquivo | Recomendação |
|---|-----------|---------|--------------|
| S8 | **Consentimento LGPD em localStorage** — Pode ser manipulado pelo usuário. Deveria ser armazenado server-side também. | `lib/lgpd.ts` | Sincronizar com Supabase para auditabilidade. |
| S9 | **`createAdminClient` com SERVICE_ROLE_KEY** — Bypass de RLS. Sem logging de quais operações admin são executadas. | `lib/supabase/server.ts` | Adicionar audit log para todas as chamadas admin. |
| S10 | **EventSource para streaming** — `chat.stream` passa mensagem via query string, que pode ser logada em servidores intermediários. | `lib/api.ts` | Usar POST com SSE ou WebSocket. |

---

## 3. AUDITORIA DE ARQUITETURA

### 3.1 Padrões Identificados

| Padrão | Status | Comentário |
|--------|--------|------------|
| **BFF (Backend for Frontend)** | ✅ Correto | Next.js API routes como proxy para Cloudflare Workers |
| **Route Groups** | ✅ Correto | `(institutional)`, `(legal)`, `(main)` |
| **Dynamic Import** | ✅ Correto | Todas as pages usam `dynamic()` com skeleton loading |
| **React Context** | ⚠️ Aceitável | Um único AppContext para todo o app — funciona mas pode causar re-renders desnecessários |
| **Custom Hooks** | ✅ Bom | `useAuth`, `useProcess`, `useNormalization`, `useUserProfile`, `useMobile` |
| **Zod Schemas** | ✅ Bom | 9 schemas no `lib/schemas/` para validação runtime |
| **Observability** | ✅ Bom | Logger + Metrics + Traces + Web Vitals |
| **Type Safety** | ✅ Forte | `strict: true`, `noUncheckedIndexedAccess: true` no tsconfig |

### 3.2 Problemas Arquiteturais

| # | Problema | Impacto | Recomendação |
|---|---------|---------|--------------|
| A1 | **AppContext monolítico** — Um único context gerencia auth, processo, theme, sidebar, artifacts, chat, notificações. Qualquer mudança de estado causa re-render em todos os consumers. | Performance | Dividir em contexts menores: `AuthContext`, `ProcessContext`, `UIContext`. |
| A2 | **Notificações hardcoded** — `initialNotifications` com dados mockados no `app-context.tsx`. Em produção, deveria vir de API. | Funcionalidade | Carregar notificações do Supabase via hook dedicado. |
| A3 | **Componentes monolíticos** — `chat-area.tsx` (883 linhas), `filters-modal.tsx` (945 linhas), `assistants-page.tsx` (980 linhas). | Manutenibilidade | Decompor em subcomponentes menores e especializados. |
| A4 | **Error Boundaries parciais** — `app/(main)/error.tsx` existe mas não há Error Boundaries em componentes individuais. Um erro em um componente pode derrubar toda a rota. | Resiliência | Adicionar Error Boundaries granulares em componentes críticos (chat, artifacts). |
| A5 | **Testes existem mas cobertura mínima** — 7 arquivos de teste em `tests/` (app-context, lgpd, routes, types, validations, structured-data + setup.ts), mas sem cobertura de hooks, API routes ou componentes complexos. | Qualidade | Expandir testes para hooks (`useProcess`, `useAuth`), API client e componentes críticos. |
| A6 | **`lib/api.ts` com 1436 linhas** — Todo o API client em um único arquivo. | Manutenibilidade | Dividir por domínio: `api/processo.ts`, `api/compliance.ts`, `api/serpro.ts`, etc. |

---

## 4. AUDITORIA DE PERFORMANCE

### 4.1 Pontos Positivos

| Área | Implementação |
|------|--------------|
| **Code Splitting** | `dynamic()` com lazy loading em todas as pages |
| **Image Optimization** | AVIF + WebP, cache 1 ano para estáticos |
| **Font Loading** | `display: 'swap'` para DM Sans e JetBrains Mono |
| **Compression** | `compress: true` no Next.js config |
| **Cache Strategy** | Cache-Control diferenciado por tipo de recurso |
| **optimizeCss** | Experimental flag ativo no Next.js 16 |

### 4.2 Problemas de Performance

| # | Problema | Arquivo | Impacto |
|---|---------|---------|---------|
| P1 | **Memory leak** — `processingIntervalRef` e `timeoutRef` em `chat-area.tsx` não são limpos no cleanup do useEffect. | `components/chat-area.tsx` | Vazamento de memória em navegação |
| P2 | **Sem memoização** — Componentes puros como `DecisionBar`, `ProcessStepper`, `AuditorChecklist` não usam `React.memo`. | Múltiplos componentes | Re-renders desnecessários |
| P3 | **Cálculos repetidos** — `filteredAssistants` e `sortedAssistants` recalculados em cada render sem `useMemo`. | `assistants-page.tsx` | CPU desnecessária |
| P4 | **Ring buffer com shift()** — `pushCapped` usa `arr.shift()` que é O(n) para arrays. Em alta carga, degrada performance. | `lib/observability.ts` | Degradação em alta carga |
| P5 | **Sem virtualização** — Listas de processos, contratos e histórico renderizam todos os itens sem windowing. | Múltiplas pages | Layout thrashing em listas grandes |
| P6 | **76 componentes UI** — Todo o bundle shadcn/ui carregado mesmo sem tree-shaking efetivo. | `components/ui/` | Bundle size elevado |

---

## 5. AUDITORIA DE CÓDIGO

### 5.1 Qualidade Geral

| Métrica | Avaliação | Nota |
|---------|-----------|------|
| **TypeScript Strictness** | `strict: true`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch` | ✅ A |
| **Consistência de Código** | Padrões consistentes de imports, naming, formatting | ✅ A |
| **Documentação** | JSDoc em arquivos de lib, referências a specs e autores | ✅ A |
| **Error Handling** | Try/catch em API routes e hooks, mas sem Error Boundaries | ⚠️ B |
| **Separação de Concerns** | BFF pattern correto, mas AppContext monolítico | ⚠️ B |
| **Acessibilidade (a11y)** | Componentes UI (Radix) excelentes; componentes customizados deficientes | ⚠️ C |
| **Cobertura de Testes** | 7 arquivos de teste (Vitest) — cobre utils e schemas, mas não hooks, API routes ou componentes | ⚠️ D |
| **i18n** | Apenas PT-BR hardcoded | ⚠️ C |

### 5.2 Issues Específicos

| # | Tipo | Descrição | Arquivo | Linha |
|---|------|-----------|---------|-------|
| C1 | Bug | `useAuth` — cleanup do `onAuthStateChange` subscription nunca é executado porque o import dinâmico não retorna cleanup no useEffect. | `hooks/use-auth.ts` | 54-81 |
| C2 | Bug | `anonymizePhone` — regex complexo produz resultado incorreto para números com DDD de 2 dígitos (padrão BR). | `lib/lgpd.ts` | 96-99 |
| C3 | Smell | `handleResizeEnd` — callback vazio que existe apenas para satisfazer a interface. | `contexts/app-context.tsx` | 222 |
| C4 | Smell | `ProcessStepper` — usa casting `as` para `ProcessState` sem validação runtime. | `components/process-stepper.tsx` | — |
| C5 | Debt | `flushAuditLog` — TODO de integração com backend de logs nunca implementado. | `lib/audit.ts` | 86 |
| C6 | Debt | `/api/contato` — TODO de integração com email provider e Supabase. | `app/api/contato/route.ts` | 83-85 |
| C7 | a11y | `DFDDocument` — Formulário de 643 linhas sem ARIA labels, sem `htmlFor`, sem roles semânticos. | `components/artifacts/dfd-document.tsx` | — |
| C8 | a11y | `FiltersModal` — Labels não conectados a inputs, seções colapsáveis sem ARIA states. | `components/filters-modal.tsx` | — |
| C9 | Bug | `use-toast.ts` — `TOAST_REMOVE_DELAY` definido como 1.000.000ms (~11,5 dias) em vez de ~5.000ms. Toasts nunca são removidos na prática. | `hooks/use-toast.ts` | 9 |
| C10 | Bug | `use-normalization.ts` — Usa `fetch()` direto em vez do API client (`feedback.enviarTermo()`), inconsistente com padrão do projeto. | `hooks/use-normalization.ts` | 148 |
| C11 | Smell | Duplicação de tipos — `types/index.ts` duplica definições que já existem em `lib/schemas/` (ContractStatus, ProcessPhase, etc.). Risco de dessincronização. | `types/index.ts` vs `lib/schemas/` | — |
| C12 | Smell | `lib/types.ts` — Factory functions para branded types (CPF, CNPJ) fazem apenas cast sem validação runtime. Devem integrar com schemas Zod. | `lib/types.ts` | 34-59 |
| C13 | Bug | `use-user-profile.ts` — `textBuffer` é variável global compartilhada entre todas as instâncias do hook. Em múltiplos componentes, buffers se misturam. | `hooks/use-user-profile.ts` | 50 |
| C14 | Security | `validations.ts` — Sanitização XSS faz apenas encoding de entidades HTML; não protege contra atributos maliciosos (`data-*`, `on*`, etc.). | `lib/validations.ts` | 66-73 |
| C15 | Security | CPF/CNPJ — Validação apenas de formato (regex), sem verificação de dígitos verificadores (checksum). Aceita documentos inválidos. | `lib/validations.ts` | 4-5 |
| C16 | SEO/Sec | **Rotas autenticadas no sitemap público** — `/dashboard`, `/contracts`, `/processes` com prioridade 0.9 são indexáveis por crawlers apesar de requererem autenticação. | `app/sitemap.ts` | — |
| C17 | Debt | **Formulário de contato não-funcional** — POST é aceito, validado, sanitizado e retorna sucesso ao usuário, mas não salva nem envia nada (TODO). Dados são perdidos. | `app/api/contato/route.ts` | 83-85 |
| C18 | Debt | **Error tracking não integrado** — `app/(main)/error.tsx` tem TODO para Sentry/observabilidade. Erros em produção não são rastreados. | `app/(main)/error.tsx` | — |

---

## 6. AUDITORIA DE DEPENDÊNCIAS

### 6.1 Stack Principal

| Pacote | Versão | Status | Nota |
|--------|--------|--------|------|
| next | 16.0.10 | ✅ Atual | Versão mais recente |
| react | 19.2.0 | ✅ Atual | React 19 com Server Components |
| typescript | 5.x | ✅ Atual | |
| @supabase/supabase-js | 2.95.3 | ✅ Atual | |
| @supabase/ssr | 0.5.2 | ✅ Atual | |
| tailwindcss | 4.1.9 | ✅ Atual | Tailwind CSS 4 com OKLCH |
| zod | 3.25.76 | ✅ Atual | |
| lucide-react | 0.454.0 | ✅ Atual | |

### 6.2 Observações

- **25+ pacotes Radix UI**: Todos necessários para shadcn/ui. Versões consistentes.
- **Sem pacotes deprecados** identificados.
- **Sem vulnerabilidades conhecidas** nas versões listadas.
- **`lucide-react` 0.454.0**: Versão estável, sem breaking changes pendentes.
- **Lockfile presente** — `pnpm-lock.yaml` garante builds determinísticos via pnpm.

### 6.3 Dependências Ausentes / Melhorias

| Pacote | Motivo |
|--------|--------|
| `playwright` / `cypress` | Nenhum framework de e2e (testes unitários existem via Vitest) |
| `eslint-config-*` | Configuração ESLint mínima (apenas default Next.js) |
| `prettier` | Sem formatador configurado explicitamente |

---

## 7. AUDITORIA DE GIT E BRANCHES

### 7.1 Estado do Repositório

| Item | Valor |
|------|-------|
| **Branch principal** | `main` (remoto) / `master` (local) |
| **Branch atual** | `claude/code-audit-review-TIAsz` |
| **Total de commits** | ~20 commits no histórico visível |
| **Working tree** | Limpa (nenhuma alteração pendente) |

### 7.2 Histórico de Commits

Os commits seguem uma progressão lógica de features:

1. **Fundação** — Auth resiliente, middleware, estrutura do projeto
2. **Pipeline de normalização** — 6 camadas com D1, KV, Vectorize
3. **Sistema de avaliações** — Feedback, propagação, perfis
4. **ACMA + Auditor** — Learning systems com calibração
5. **Orquestrador (Maestro)** — Pipeline integrado de agentes
6. **Dashboard + Analytics** — Métricas unificadas + ClickHouse
7. **Compliance** — PCA, CGU, prazos, ouvidoria, segurança chat
8. **PBIA/FINEP/SICX** — AIA, JCC, código de conduta
9. **Pricing + Contratação** — Motor de precificação universal
10. **Institucional** — Páginas públicas, FAQ, jurisprudência

### 7.3 Observações sobre Git

| # | Observação | Risco |
|---|-----------|-------|
| G1 | **Divergência main/master** — Branch local é `master`, remoto tem `main`. Pode causar confusão. | Baixo |
| G2 | **Commits muito grandes** — Alguns commits incluem 10+ arquivos com features distintas. | Médio — dificulta git bisect |
| G3 | **Sem tags de release** — Nenhuma tag semântica (v1.0, v8.0, etc.). | Médio — dificulta rollback |
| G4 | **CI/CD parcial** — Existe `vercel.json` (deploy config) e diretório `.github/`, mas sem workflows de CI visíveis (lint, test, build check antes de merge). | Médio — deploy existe mas sem gates de qualidade |

---

## 8. AUDITORIA DE BANCO DE DADOS (SUPABASE)

### 8.1 Migrações

| # | Migração | Conteúdo |
|---|----------|----------|
| 001 | `initial_schema` | Schema base: processos, documentos, mensagens, org |
| 002 | `feedback_and_profiles` | Feedback de normalização + perfis de usuário |
| 003 | `avaliacoes` | Sistema de avaliações (fornecedor, plataforma, IA, artefatos) |
| 004 | `acma_auditor_learning` | Learning systems para ACMA e Auditor |
| 005 | `orchestrator` | State machine do orquestrador |
| 006 | `pca_compliance_deadlines` | PCA inteligente, compliance, prazos |
| 007 | `pbia_sicx_alignment` | AIA, código de conduta, alinhamento PBIA |
| 008 | `pricing_contracting` | Motor de precificação e contratação |

### 8.2 Observações

- Esquema bem estruturado com progressão lógica de migrações.
- RLS (Row Level Security) presumido ativo via Supabase.
- `createAdminClient` bypassa RLS — uso deve ser auditado.

---

## 9. AUDITORIA DE API ROUTES

### 9.1 Inventário (23 routes)

| Route | Métodos | Auth | Validação |
|-------|---------|------|-----------|
| `/api/acma` | POST | ✅ | Zod schema |
| `/api/adesao-arp` | POST, GET, PATCH | ✅ | Manual |
| `/api/aia` | GET, POST, PATCH | ✅ | Manual |
| `/api/audit` | POST | ✅ | Básica |
| `/api/auditor` | POST, GET | ✅ | Zod schema |
| `/api/auth/callback/govbr` | GET | ❌ Público | ⚠️ Open redirect |
| `/api/avaliacoes` | GET, POST | ✅ | Zod schema |
| `/api/compliance` | GET, POST | ✅ | Manual |
| `/api/contato` | POST | ❌ Público | Manual + sanitize |
| `/api/contratacao` | POST, GET, PATCH | ✅ | Manual |
| `/api/dashboard` | GET | ✅ | N/A |
| `/api/feedback` | GET, POST | ✅ | Zod schema |
| `/api/normalize` | POST | ✅ | Manual |
| `/api/ouvidoria` | POST, GET, PATCH | ✅/Público | Manual |
| `/api/pca` | GET, POST | ✅ | Manual |
| `/api/prazos` | GET, POST, PATCH | ✅ | Manual |
| `/api/pricing` | GET, POST | Misto | Manual |
| `/api/processo` | POST | ✅ | Básica |
| `/api/processo/[id]/chat` | POST | ✅ | `typeof === 'string'` |
| `/api/processo/[id]/decisao` | POST | ✅ | Manual |
| `/api/processo/[id]/status` | GET | ✅ | N/A |
| `/api/profile` | GET, POST, PATCH | ✅ | Manual |
| `/api/publicar` | POST | ✅ | Manual |

### 9.2 Padrão Consistente nas API Routes

Todas as routes autenticadas seguem o padrão:
```typescript
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()
if (error || !user) return NextResponse.json({ message: '...' }, { status: 401 })
```

### 9.3 Problemas Identificados

- **Validação inconsistente** — Algumas routes usam Zod schemas, outras fazem validação manual.
- **Rate limiting ausente** — Nenhuma route implementa rate limiting real.
- **CORS não configurado** — Dependente do Next.js default (same-origin).

---

## 10. RESUMO EXECUTIVO

### Classificação Geral

| Área | Nota | Justificativa |
|------|------|---------------|
| **Segurança** | B+ | Headers OWASP excelentes, CSP com nonce, mas open redirect e rate limiting ausente |
| **Arquitetura** | B | BFF pattern correto, separação por route groups, mas AppContext monolítico |
| **Performance** | B- | Code splitting e lazy loading bons, mas memory leaks e falta de memoização |
| **Código** | B | TypeScript strict, padrões consistentes, mas componentes monolíticos |
| **Testes** | D | 7 arquivos de teste existem, mas cobertura mínima — sem testes de hooks, API ou componentes |
| **Infraestrutura** | C+ | Deploy via Vercel configurado, pnpm lockfile presente, mas sem CI gates (lint/test/build) e sem tags de release |
| **LGPD/Compliance** | A- | Módulo LGPD completo, mas consentimento apenas em localStorage |
| **Documentação** | B+ | JSDoc consistente, referências legais, mas sem README técnico |

### Top 10 Ações Prioritárias

| Prioridade | Ação | Tipo | Esforço |
|-----------|------|------|---------|
| 1 | Corrigir open redirect no OAuth callback (S1) | Segurança | Baixo |
| 2 | Implementar flush de audit logs para backend real (S3/C5) | Segurança | Médio |
| 3 | Adicionar Error Boundaries por route group (A4) | Resiliência | Baixo |
| 4 | Fixar memory leak no chat-area.tsx (P1) | Performance | Baixo |
| 5 | Implementar rate limiting nos endpoints públicos (S4) | Segurança | Médio |
| 6 | Corrigir cleanup do useAuth subscription (C1) | Bug | Baixo |
| 7 | Adicionar CI/CD pipeline (G4) | Infra | Médio |
| 8 | Dividir AppContext em contexts menores (A1) | Arquitetura | Médio |
| 9 | Implementar testes para hooks e API client (A5) | Qualidade | Alto |
| 10 | Restringir `img-src` na CSP (S6) | Segurança | Baixo |

---

## 11. INFRAESTRUTURA ADICIONAL

### 11.1 Cloudflare Workers Backend (`workers/src/`)

O backend real reside em Cloudflare Workers com a seguinte estrutura:

| Módulo | Descrição |
|--------|-----------|
| `orchestrator/` | Engine de orquestração multi-agente (Maestro), chat router, pipeline, guard, trail |
| `normalization/` | Pipeline NLP de 6 camadas (tokenizer, abreviaturas, sinônimos, regionalismos, marcas, semântico) |
| `acma/` | Agente ACMA — prompt builder + edit delta |
| `auditor/` | Agente Auditor — calibração de thresholds |
| `compliance/` | Código de conduta IA + integridade |
| `pca/` | PCA inteligente (análise de contratação) |
| `pricing/` | Motor de precificação universal |
| `profile/` | Learning de perfil de usuário |
| `cron/` | Tarefas agendadas: calibração auditor, melhoria de prompts, propagação de feedback |
| `routes/` | 38 route handlers HTTP |

### 11.2 Templates de Documentos (`templates/`)

22 templates HTML v7/v8 para geração automatizada de documentos de licitação:

- **Gerais (8):** PCA, DFD, ETP, PP, TR, MR, JCD
- **ARP (7):** Formulários de adesão a ata de registro de preços
- **Setoriais (7):** Templates específicos para Obras, Saúde e TIC

### 11.3 Dados de Normalização (`data/normalizacao/`)

6 arquivos JSON para o pipeline NLP:

| Arquivo | Conteúdo |
|---------|----------|
| `abreviaturas.json` | Mapeamento de abreviaturas PT-BR |
| `sinonimos.json` | Dicionário de sinônimos |
| `regionalismos.json` | Variações regionais brasileiras |
| `marcas_genericas.json` | Nomes genéricos de marcas |
| `glossario_tecnico.json` | Glossário de termos jurídicos |
| `catmat_enriquecido.json` | Catálogo de materiais enriquecido |

### 11.4 ClickHouse Analytics (`clickhouse/migrations/`)

3 migrações para métricas de IA:

| Migração | Conteúdo |
|----------|----------|
| `001_acma_metrics.sql` | Métricas do agente ACMA |
| `002_auditor_metrics.sql` | Métricas do agente Auditor |
| `003_dashboard_views.sql` | Views agregadas para dashboard |

### 11.5 Documentação Existente

| Documento | Tamanho | Conteúdo |
|-----------|---------|----------|
| `DOCUMENTACAO.md` | 53.9 KB | Documentação completa do projeto (v8.3) |
| `ESTRUTURA-PROJETO.md` | 16.2 KB | Guia de estrutura e decisões técnicas |
| `HANDOFF-DEV-08FEV2026.md` | 23.5 KB | Documento de handoff para desenvolvedores |
| `specs/` | 5 docs | Especificações técnicas dos agentes IA (Auditor v2, ACMA v2, Design Law v3, Consolidada v8) |

### 11.6 SEO e PWA

| Arquivo | Função |
|---------|--------|
| `app/manifest.ts` | PWA Web App Manifest dinâmico |
| `app/robots.ts` | robots.txt dinâmico |
| `app/sitemap.ts` | Sitemap XML dinâmico |
| `components/structured-data.tsx` | JSON-LD para Organization e FAQ |

---

---

## 12. ANÁLISE DE DOMÍNIOS — `app.ata360.com.br` × `ata360.com.br`

> **Contexto:** O sistema (`app.ata360.com.br`, Next.js) e o site institucional (`ata360.com.br`, Webflow) devem coexistir. O backend e dados serão incorporados posteriormente. Esta seção analisa as ramificações técnicas dessa separação.

### 12.1 Mapa Atual de Referências por Domínio

| Domínio | Onde é Referenciado | Arquivo | Linha |
|---------|-------------------|---------|-------|
| `app.ata360.com.br` | metadataBase (SEO raiz) | `app/layout.tsx` | 34 |
| `app.ata360.com.br` | OpenGraph URL | `app/layout.tsx` | 57 |
| `app.ata360.com.br` | canonical URL | `app/layout.tsx` | 77 |
| `app.ata360.com.br` | alternates pt-BR | `app/layout.tsx` | 79 |
| `app.ata360.com.br` | sitemap baseUrl | `app/sitemap.ts` | 4 |
| `app.ata360.com.br` | robots.txt sitemap ref | `app/robots.ts` | 38 |
| `app.ata360.com.br` | JSON-LD BASE_URL fallback | `components/structured-data.tsx` | 16 |
| `app.ata360.com.br` | JSON-LD WebApplication.url | `components/structured-data.tsx` | 47 |
| `ata360.com.br` | JSON-LD Organization.url | `components/structured-data.tsx` | 28 |
| `ata360.com.br` | JSON-LD sameAs | `components/structured-data.tsx` | 40 |
| `ata360.com.br` | Author URL (metadata) | `app/layout.tsx` | — |
| `ata360.com.br` | CORS origin (Workers) | `workers/src/index.ts` | 69 |
| `*.ata360.com.br` | CORS wildcard (Workers) | `workers/src/index.ts` | 70 |
| `contato@ata360.com.br` | E-mail de contato | `SECURITY.md`, `LICENSE`, footers | — |
| `www.ata360.com.br` | Link institucional | `SECURITY.md`, `LICENSE`, `llms.txt` | — |

### 12.2 Inventário de Páginas Afetadas

#### Páginas que MIGRAM para Webflow (`ata360.com.br`)

| Rota Atual (Next.js) | LOC | Dependência de API | Migração |
|-----------------------|-----|-------------------|----------|
| `/` (landing page) | 170 | Nenhuma | ✅ Direta |
| `/manifesto` | 237 | Nenhuma | ✅ Direta |
| `/quem-somos` | 169 | Nenhuma | ✅ Direta |
| `/missao-visao-valores` | 149 | Nenhuma | ✅ Direta |
| `/compromissos` | 231 | Nenhuma | ✅ Direta |
| `/compliance` | 229 | Nenhuma | ✅ Direta |
| `/seguranca` | 297 | Nenhuma | ✅ Direta |
| `/carta-servidor` | 106 | Nenhuma | ✅ Direta |
| `/cookies` | 178 | Nenhuma | ✅ Direta |
| `/contato` | 255 | `POST /api/contato` | ⚠️ Requer webhook |
| `/privacidade` | 327 | Nenhuma | ✅ Direta |
| `/termos` | 341 | Nenhuma | ✅ Direta |
| `/lgpd` | 297 | Nenhuma | ✅ Direta |
| **Total** | **~2.986** | **1 de 13** | |

#### Páginas que PERMANECEM no Next.js (`app.ata360.com.br`)

Todas as rotas do grupo `(main)` + `/login` + todas as `/api/*` routes.

### 12.3 Ramificações Técnicas

#### A. SEO e Indexação

| Aspecto | Situação Atual | Após Separação | Ação Necessária |
|---------|---------------|----------------|-----------------|
| **Canonical** | `app.ata360.com.br` para TUDO | Dividido entre domínios | Remover canonical das páginas institucionais no Next.js; configurar canonical correto no Webflow |
| **Sitemap** | Único em `app.ata360.com.br/sitemap.xml` (30 URLs) | Dois sitemaps independentes | `ata360.com.br/sitemap.xml` (13 URLs inst.) + `app.ata360.com.br/sitemap.xml` (17 URLs app) |
| **robots.txt** | Único, AI crawlers permitidos em tudo | Dois robots.txt | Webflow: permitir crawlers. Next.js: bloquear rotas autenticadas (corrige C16) |
| **301 Redirects** | N/A | 13 redirects necessários | `app.ata360.com.br/{rota-inst}` → `ata360.com.br/{rota-inst}` |
| **OpenGraph** | `app.ata360.com.br` | Cada domínio com seu OG | Webflow gera seus OG tags nativamente |
| **JSON-LD** | `OrganizationJsonLd` aponta para `ata360.com.br` | Correto ✅ | `WebApplicationJsonLd` fica em `app.ata360.com.br` |
| **llms.txt** | Ambos domínios listados | Correto ✅ | Criar `ata360.com.br/llms.txt` também (Webflow custom code) |
| **Risco de conteúdo duplicado** | N/A | ALTO durante transição | Implementar 301s antes de publicar Webflow; evitar período com mesmo conteúdo em 2 URLs |

#### B. Autenticação e Sessão

| Aspecto | Situação Atual | Após Separação | Ação Necessária |
|---------|---------------|----------------|-----------------|
| **Supabase cookies** | Domínio implícito (host atual) | `app.ata360.com.br` apenas | Configurar `cookieOptions.domain` explicitamente em `lib/supabase/middleware.ts` |
| **Gov.br OAuth callback** | `/api/auth/callback/govbr` | Permanece em `app.ata360.com.br` | Atualizar `GOVBR_REDIRECT_URI` no .env para `https://app.ata360.com.br/api/auth/callback/govbr` |
| **Login redirect** | `origin + redirect` sem validação | Redirect pode vir de Webflow | Validar que redirect é path relativo do mesmo domínio (corrige S1) |
| **Botão "Acessar" no Webflow** | Link no header institucional | Cross-domain navigation | `<a href="https://app.ata360.com.br/login">Acessar</a>` |
| **Logout redirect** | Volta para `/` (landing) | Decisão: volta para app ou site? | Configurar redirect pós-logout: `ata360.com.br` (site) ou `app.ata360.com.br/login` |
| **Session sharing** | N/A | Não necessária | Webflow é 100% público, não precisa de sessão |

#### C. CORS e Cross-Origin

| Aspecto | Situação Atual | Após Separação | Ação Necessária |
|---------|---------------|----------------|-----------------|
| **Workers CORS** | Permite `ata360.com.br` e `*.ata360.com.br` | Correto ✅ | Nenhuma mudança necessária |
| **CSP connect-src** | `self` + Supabase + AI Gateway | Sem impacto | Next.js middleware não muda |
| **CSP form-action** | `self` + `sso.acesso.gov.br` | Sem impacto | Formulário de contato migra para Webflow |
| **Webflow → API** | N/A | `/contato` precisa chamar API | Webhook Webflow → `app.ata360.com.br/api/contato` ou API dedicada |
| **HSTS** | `includeSubDomains` ativo | Correto ✅ | Cobre `app.ata360.com.br` automaticamente |
| **Cross-Origin-Resource-Policy** | `same-origin` | Pode bloquear Webflow embeds | Se Webflow precisar embedar recursos do app, mudar para `cross-origin` seletivamente |

#### D. Cookie Consent e LGPD

| Aspecto | Situação Atual | Após Separação | Ação Necessária |
|---------|---------------|----------------|-----------------|
| **Cookie banner** | Componente React em Next.js | Dois banners independentes | Webflow: usar solução nativa ou script. Next.js: manter componente |
| **Consentimento em localStorage** | `ata360_cookie_consent` | Escopo por domínio | Cada domínio gerencia seu próprio consentimento. Não há compartilhamento |
| **Cookies documentados** | `/cookies` page lista 9 cookies | Dividir por domínio | Webflow: cookies analíticos apenas. Next.js: cookies de sessão + funcionalidade |
| **DPO/Encarregado** | `dpo@ata360.com.br` em todas as páginas | Sem impacto | Mesmo DPO para ambos domínios |

#### E. PWA e Manifest

| Aspecto | Situação Atual | Após Separação | Ação Necessária |
|---------|---------------|----------------|-----------------|
| **manifest.ts** | Gera manifest para PWA com `start_url: /` | Permanece em `app.ata360.com.br` | `start_url` aponta para app, correto |
| **scope** | Não definido (defaults to /) | Sem impacto | PWA é exclusivo do app |
| **Service Worker** | N/A (Next.js não gera SW) | Sem impacto | — |

### 12.4 Formulário de Contato — Decisão Arquitetural

O `/contato` é a **única página institucional com dependência de API** (`POST /api/contato`). Três opções:

| Opção | Prós | Contras |
|-------|------|---------|
| **A. Webflow Form nativo** | Zero código, Webflow gerencia emails e storage | Perde validação de CNPJ, sanitização custom, rate limiting futuro |
| **B. Webflow UI + Webhook para API** | Mantém backend robusto, UI editável no Webflow | Requer CORS configurado, latência de webhook, debugging mais complexo |
| **C. Iframe do Next.js no Webflow** | Zero mudança no código existente | UX inferior, CSP pode bloquear, problemas de responsividade |

**Recomendação:** Opção **B** — O formulário visual fica no Webflow (editável por marketing), mas o `onSubmit` faz POST para `https://app.ata360.com.br/api/contato`. Requer:
1. CORS no endpoint `/api/contato` para aceitar `Origin: https://ata360.com.br`
2. Rate limiting real (atualmente só comentário — ver S4)
3. Implementar o backend que hoje é TODO (ver C17)

### 12.5 Structured Data — Ajustes Necessários

```
ANTES (tudo em app.ata360.com.br):
┌─────────────────────────────────────────┐
│ OrganizationJsonLd                      │
│   url: ata360.com.br          ← correto │
│   contactPoint: app.../contato ← errado │
│   sameAs: [ata360.com.br]     ← correto │
│                                         │
│ WebApplicationJsonLd                    │
│   url: app.ata360.com.br      ← correto │
│   applicationCategory: Gov    ← correto │
│                                         │
│ FAQJsonLd                               │
│   mainEntity: 6 perguntas     ← correto │
└─────────────────────────────────────────┘

DEPOIS (separados):
┌─ ata360.com.br (Webflow) ──────────────┐
│ OrganizationJsonLd                      │
│   url: ata360.com.br                    │
│   contactPoint: ata360.com.br/contato   │
│   sameAs: [app.ata360.com.br]           │
│                                         │
│ FAQJsonLd (duplicar ou mover)           │
│ BreadcrumbJsonLd por página             │
└─────────────────────────────────────────┘

┌─ app.ata360.com.br (Next.js) ──────────┐
│ WebApplicationJsonLd                    │
│   url: app.ata360.com.br               │
│   applicationCategory: GovernmentApp    │
│                                         │
│ BreadcrumbJsonLd por rota de app        │
└─────────────────────────────────────────┘
```

### 12.6 DNS e Infraestrutura

```
ata360.com.br
├── A / CNAME → Webflow (sites proxy)
├── MX → Provedor de e-mail (contato@ata360.com.br)
├── TXT → SPF, DKIM, DMARC para email
└── www → CNAME para ata360.com.br (redirect)

app.ata360.com.br
├── CNAME → cname.vercel-dns.com (ou Cloudflare proxy)
├── _vercel → DNS verification
└── TXT → Domain verification
```

**Nota:** Se estiver usando Cloudflare para DNS, o proxy pode ser ativado em `app.ata360.com.br` para WAF, rate limiting e cache — mas o record para `ata360.com.br` deve apontar para Webflow (DNS-only, sem proxy Cloudflare, a menos que usando Webflow Enterprise com CNAME setup).

### 12.7 Redirects (301) a Configurar no Next.js

Enquanto o Webflow não estiver ativo, manter as páginas no Next.js. Quando ativar o Webflow, adicionar em `next.config.mjs`:

```typescript
async redirects() {
  return [
    '/manifesto', '/quem-somos', '/missao-visao-valores',
    '/compromissos', '/compliance', '/seguranca',
    '/carta-servidor', '/contato', '/cookies',
    '/privacidade', '/termos', '/lgpd',
  ].map(path => ({
    source: path,
    destination: `https://ata360.com.br${path}`,
    permanent: true, // 301
  }))
}
```

**Alternativa:** Configurar redirects no Cloudflare Page Rules ou Bulk Redirects (mais performante, não exige rebuild do Next.js).

### 12.8 Middleware — Limpeza Após Migração

Após migrar as páginas institucionais para Webflow, remover do Next.js:

1. **`middleware.ts`** — Remover rotas institucionais do `PUBLIC_ROUTES`:
   ```
   - '/', '/manifesto', '/quem-somos', '/missao-visao-valores',
   - '/compromissos', '/compliance', '/seguranca',
   - '/carta-servidor', '/contato', '/cookies',
   - '/privacidade', '/termos', '/lgpd',
   ```
2. **`app/sitemap.ts`** — Remover 13 URLs institucionais/legais
3. **`app/robots.ts`** — Atualizar rules (rotas já não existem no app)
4. **`app/(institutional)/`** — Remover todo o diretório (10 páginas + layout)
5. **`app/(legal)/`** — Remover todo o diretório (3 páginas + layout)
6. **`app/layout.tsx`** — Remover `OrganizationJsonLd` e `FAQJsonLd` (movem para Webflow)

### 12.9 Riscos e Mitigações

| # | Risco | Severidade | Mitigação |
|---|-------|-----------|-----------|
| D1 | **SEO juice dilution** — Mover conteúdo de domínio com autoridade (app.) para domínio novo (ata360.) pode perder ranking temporariamente | ALTO | Implementar 301 redirects ANTES de publicar Webflow. Submeter change-of-address no Search Console |
| D2 | **Conteúdo duplicado** — Período de transição com mesmo conteúdo em 2 domínios | ALTO | Fase 1: 301 no Next.js. Fase 2: Publicar Webflow. Nunca manter ambos ativos sem redirect |
| D3 | **Links internos quebrados** — Footer do Webflow precisa apontar para `app.ata360.com.br/login`, footer do App precisa apontar para `ata360.com.br/privacidade` | MÉDIO | Audit de links cross-domain em ambos os sites pós-migração |
| D4 | **Cookie consent desalinhado** — Usuário aceita cookies no Webflow mas recusa no app (ou vice-versa) | BAIXO | Consentimentos são independentes por domínio. Documentar na política de cookies |
| D5 | **Webflow downtime** — Se Webflow sair do ar, páginas de privacidade/termos ficam inacessíveis | BAIXO | Manter `noindex` copies estáticas no Next.js como fallback (sem canonical) |
| D6 | **Formulário de contato quebrado** — Migração do `/contato` para Webflow sem backend funcional (C17 ainda não resolvido) | ALTO | Resolver C17 (implementar email + storage) ANTES de migrar o formulário |

### 12.10 Checklist de Implementação

```
PRÉ-MIGRAÇÃO (no Next.js):
□ Resolver S1 — Open redirect no OAuth callback
□ Resolver C17 — Implementar backend do /api/contato (email + Supabase)
□ Adicionar CORS para ata360.com.br no /api/contato
□ Configurar GOVBR_REDIRECT_URI para https://app.ata360.com.br/...
□ Fixar cookie domain explícito em lib/supabase/middleware.ts
□ Remover rotas autenticadas do sitemap.ts (C16)
□ Preparar 301 redirects em next.config.mjs (desativados, prontos)

DURANTE MIGRAÇÃO (Webflow):
□ Criar 13 páginas no Webflow com mesmo conteúdo e URLs
□ Configurar metadata SEO em cada página Webflow
□ Implementar OrganizationJsonLd no Webflow (custom code)
□ Configurar FAQJsonLd no Webflow
□ Configurar formulário /contato com webhook para app.ata360.com.br
□ Criar robots.txt e sitemap.xml no Webflow
□ Configurar cookie consent no Webflow
□ DNS: apontar ata360.com.br para Webflow

ATIVAÇÃO:
□ Ativar 301 redirects no Next.js (ou Cloudflare)
□ Verificar ambos domínios no Google Search Console
□ Submeter sitemaps atualizados em ambos domínios
□ Testar fluxo: Webflow → Login → App → Logout → Webflow
□ Testar formulário de contato cross-domain
□ Monitorar 404s por 30 dias

PÓS-MIGRAÇÃO (cleanup no Next.js):
□ Remover app/(institutional)/ e app/(legal)/
□ Atualizar PUBLIC_ROUTES no middleware.ts
□ Atualizar structured-data.tsx (remover OrganizationJsonLd)
□ Atualizar app/layout.tsx (remover metadata institucional)
□ Remover 301 redirects (após 6 meses de indexação)
```

### 12.11 Resumo Executivo de Domínios

```
┌────────────────────────────────────────────────────────────────┐
│                     ata360.com.br                              │
│                     (Webflow)                                  │
│                                                                │
│  Conteúdo: 13 páginas estáticas (inst. + legal)               │
│  SEO: Indexável, AI-crawlable, OrganizationJsonLd             │
│  Auth: Nenhuma (100% público)                                 │
│  Cookies: Analytics + consent apenas                          │
│  Formulário: /contato → webhook para app.ata360.com.br        │
│  CTA: "Acessar" → https://app.ata360.com.br/login            │
│                                                                │
│  ┌──────────────┐                                             │
│  │  Link: "Acessar Plataforma"  ───────────────────┐         │
│  └──────────────┘                                   │         │
└─────────────────────────────────────────────────────│─────────┘
                                                      │
                                                      ▼
┌────────────────────────────────────────────────────────────────┐
│                  app.ata360.com.br                             │
│                  (Next.js + Vercel)                            │
│                                                                │
│  Conteúdo: Dashboard, chat, contratos, processos, etc.        │
│  SEO: noindex/noarchive em rotas autenticadas                 │
│  Auth: Gov.br OAuth2 + Supabase + Demo mode                  │
│  Cookies: Supabase session + LGPD consent + funcional         │
│  API: 23 route handlers (BFF → Workers)                       │
│  PWA: Manifest com start_url: /                               │
│                                                                │
│  ┌──────────────┐                                             │
│  │  Footer: "Privacidade" ──────────────────────────┐         │
│  └──────────────┘                                   │         │
└─────────────────────────────────────────────────────│─────────┘
                                                      │
                                                      ▼
                                              ata360.com.br/privacidade
```

---

*Auditoria gerada automaticamente por análise estática do código-fonte.*
*Não substitui pentesting ou auditoria de segurança por profissional certificado.*
