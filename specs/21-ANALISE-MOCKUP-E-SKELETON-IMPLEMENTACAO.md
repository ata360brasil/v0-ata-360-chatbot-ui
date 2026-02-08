# PARTE 21 — ANÁLISE DO MOCKUP v0 E SKELETON DE IMPLEMENTAÇÃO

**Revisão:** 2.0 | **Data:** 08/fev/2026
**Fonte:** Repositório `ata360brasil/v0-ata-360-chatbot-ui` (privado)

---

## 21.1 Inventário do Mockup — O Que Existe

### Stack do Mockup
| Tecnologia | Versão | Status |
|---|---|---|
| Next.js | 16.0.10 | ✅ Acima do spec (spec pede 14+) |
| React | 19.2.0 | ✅ Última estável |
| TypeScript | 5.x | ✅ Alinhado |
| Tailwind CSS | 4.1.9 | ✅ Último |
| shadcn/ui (Radix) | Completo | ✅ 40+ componentes |
| Recharts | 2.15.4 | ✅ Gráficos dashboard |
| Zod | 3.25.76 | ✅ Validação |
| Vercel Analytics | 1.3.1 | ⚠️ Spec prevê Cloudflare |
| Supabase Client | Ausente | ❌ Não instalado |
| Hono / Workers SDK | Ausente | ❌ Não instalado (backend separado) |

> **NOTA EXPLICATIVA — Stack:**
> A spec v8 (Part 12.1) define Next.js 14+ como frontend. O mockup usa Next.js 16, que é compatível e mais recente. Não há downgrade necessário — Next.js mantém retrocompatibilidade do App Router. A única dependência a REMOVER é `@vercel/analytics` porque o deploy final é Cloudflare Pages, não Vercel. O Vercel Analytics só funciona em deploy Vercel e adicionaria vendor lock-in desnecessário. Substituir por Cloudflare Web Analytics (script gratuito, privacy-first) ou pelo próprio `lib/observability.ts` que já existe no mockup e é superior.

### Estrutura de Páginas (App Router)
```
app/
├── layout.tsx              → Root layout (SEO completo, pt-BR, OpenGraph)
├── globals.css             → Design tokens + animações
├── (main)/
│   ├── layout.tsx          → Shell principal (header + sidebar + artifacts panel)
│   ├── page.tsx            → Chat IA (tela principal)
│   ├── dashboard/page.tsx  → Dashboard SuperADM
│   ├── contracts/page.tsx  → Contratos vigentes
│   ├── processes/page.tsx  → Processos em andamento
│   ├── team/page.tsx       → Equipe interna
│   ├── files/page.tsx      → Arquivo pessoal
│   ├── history/page.tsx    → Histórico de conversas
│   └── assistants/page.tsx → Meus assistentes
```

> **NOTA EXPLICATIVA — Route Groups:**
> O `(main)` é um Route Group do Next.js — não aparece na URL. Tudo dentro dele compartilha o mesmo layout (header + sidebar + artifacts panel). Isso significa que o usuário navega entre Chat, Dashboard, Processos etc. sem perder o shell. O `(main)/layout.tsx` é o MainShell que carrega o `AppProvider` (context global). Decisão correta: quando auth for adicionada, basta criar um `(auth)/` route group separado com layout próprio (tela de login sem sidebar).

### Componentes Implementados (17 core)
| Componente | Função | Linhas | Observação |
|---|---|---|---|
| `chat-area.tsx` | Chat principal + suggestion cards + DFD processing | ~860 | Core do produto |
| `artifacts-panel.tsx` | Painel lateral de artefatos (view/edit/expand) | ~400 | Com versionamento v1.0 |
| `sidebar-menu.tsx` | Menu lateral com roles (superadm/suporte/local/demo) | ~380 | 4 roles implementados |
| `dashboard-superadm-page.tsx` | Dashboard completo 16 abas | ~3200+ | Extremamente detalhado |
| `processes-page.tsx` | Gestão de processos (7 fases) | ~500+ | Kanban + grid + list |
| `contracts-page.tsx` | Contratos vigentes do PNCP | ~500+ | Rating fornecedores |
| `team-page.tsx` | Equipe com DATAVALID | ~500+ | Verificação SERPRO |
| `files-page.tsx` | Documentos pessoais | ~400+ | Upload + folders |
| `history-page.tsx` | Histórico de conversas | ~300+ | Busca + favoritos |
| `assistants-page.tsx` | Assistentes personalizados | ~300+ | Templates predefinidos |
| `notifications-modal.tsx` | Alertas (5 tipos) | ~200 | Ações contextuais |
| `filters-modal.tsx` | Filtros de pesquisa | ~200 | Região, modalidade, período |
| `settings-modal.tsx` | Configurações | ~200 | LGPD, tema, preferências |
| `dfd-document.tsx` | Renderização DFD | ~400+ | Editável inline |
| `structured-data.tsx` | JSON-LD SEO | ~100 | Organization + FAQ |
| `page-header.tsx` | Header reutilizável | ~100 | Sort, search, views |
| `resizable-divider.tsx` | Divisor redimensionável | ~50 | Chat ↔ Artifacts |

> **NOTA EXPLICATIVA — chat-area.tsx (860 linhas):**
> Este é o componente mais importante do mockup. Ele implementa:
> - Tela de boas-vindas com 8 suggestion cards (4 visíveis + 4 expandíveis)
> - Input de chat com attach de arquivos (até 10, tipados: PDF/Word/Planilha/Imagem)
> - Filtros de pesquisa (modal)
> - Simulação de processamento DFD com 8 etapas animadas ("Analisando solicitação" → "Gerando documento final")
> - Rating de respostas IA (⭐ 1-5 + observação textual)
> - Favoritar respostas
>
> O que ele NÃO faz: chamar API real. A função `handleSendMessage()` usa `setTimeout` para simular resposta. Quando o backend existir, esta função será o ponto exato de integração — substitui-se o `setTimeout` por `fetch('/api/processo/:id/chat')`.
>
> O processamento DFD em 8 etapas é inteligente porque espelha as 8 camadas de blindagem do ACMA v3 (spec 08, Section 9.2). Isso não é coincidência — mostra que o mockup foi pensado com a spec em mente.

> **NOTA EXPLICATIVA — artifacts-panel.tsx (400 linhas):**
> O painel lateral direito é onde documentos aparecem. Funcionalidades atuais:
> - View mode: renderiza o artefato (DFD, tabela, gráfico)
> - Edit mode: campos ficam editáveis inline (com indicador "Editando — alterações serão versionadas")
> - Expand mode: dialog fullscreen (95vw × 90vh)
> - Botões: Editar, Baixar, Imprimir, Inserir em processo, Maximizar
> - Versionamento: badge "v1.0" visível
>
> O que FALTA aqui é o coração do fluxo cíclico: após o AUDITOR emitir parecer, este painel precisa mostrar o resultado da auditoria (checklist visual) e os 5 botões de decisão humana (APROVAR, EDITAR, NOVA SUGESTÃO, PROSSEGUIR COM ALERTAS, DESCARTAR). Hoje esses botões não existem. Isso é o GAP mais visível entre mockup e spec.

> **NOTA EXPLICATIVA — dashboard-superadm-page.tsx (3200+ linhas):**
> O maior componente do mockup. Implementa 16 abas: overview, revenue, users, database, tokens, integrations, rankings, support, priorities, opportunities, resources, alerts, legal, agents, reviews, models. Cada aba tem gráficos Recharts com mock data realista (nomes de órgãos reais de MG: Prefeitura Lagoa Santa, MP Estadual MG, Câmara Sete Lagoas, etc.). Isso corresponde diretamente ao Part 12.7 da spec (Dashboard SuperADM, 7 abas). O mockup vai além da spec com 16 abas — as 9 extras são úteis (tokens, models, agents, reviews, etc.) e devem ser mantidas.

> **NOTA EXPLICATIVA — sidebar-menu.tsx com 4 roles:**
> O mockup implementa sistema de roles:
> - `superadm`: Dashboard completo, badge "SuperADM" (roxo)
> - `suporte`: Badge "Suporte" (verde)
> - `localadm`: Badge "LocalADM" (neutro)
> - `demo`: Badge "DEMO" (âmbar)
>
> Hoje é hardcoded: `const userRole = "superadm" as const`. Quando Supabase Auth for integrado, o role virá da sessão e cada orgão terá seu admin local. A spec Part 8 prevê multi-tenancy via RLS — o role determina quais dados o sidebar carrega.
>
> Detalhe notável: o logout modal inclui NPS inline (satisfação 1-5 estrelas + botão "Compartilhe o ATA360" com copy-link). Isso é coleta de feedback no momento natural de saída — dado valioso para product management.

### Libs Utilitárias (7 arquivos)
| Arquivo | Função | Qualidade |
|---|---|---|
| `lib/types.ts` | Branded types (CPF, CNPJ, ProcessId, BRLCents) | ✅ Excelente — type safety compile-time |
| `lib/validations.ts` | Schemas Zod (CPF, CNPJ, contract, process, team) | ✅ Sólido |
| `lib/routes.ts` | Rotas type-safe + SEO metadata por rota | ✅ Padrão correto |
| `lib/audit.ts` | Audit trail (18 actions, buffer 50, flush 30s) | ✅ Boa base |
| `lib/lgpd.ts` | LGPD compliance (consent, anonymize, retention, Art.18) | ✅ Excelente — raro ver em mockup |
| `lib/observability.ts` | Logger + Metrics + Traces + Web Vitals | ✅ Production-grade |
| `lib/utils.ts` | cn() Tailwind merge | ✅ Padrão |

> **NOTA EXPLICATIVA — lib/types.ts (Branded Types):**
> Este arquivo usa um padrão avançado do TypeScript chamado "Branded Types". Em vez de `string` para tudo, define:
> ```typescript
> type CPF = string & { readonly [__brand]: 'CPF' }
> type CNPJ = string & { readonly [__brand]: 'CNPJ' }
> type BRLCents = number & { readonly [__brand]: 'BRLCents' }
> ```
> Isso significa que o compilador IMPEDE passar um CPF onde se espera CNPJ, mesmo ambos sendo strings. É o mesmo padrão usado em codebases grandes (Stripe, Linear, etc.). Também define `BRLCents` para valores monetários em centavos (evita floating point: R$ 1.234,56 = 123456 centavos). O `formatBRL()` converte para exibição.
>
> **Por que importa para o ATA360:** Processos licitatórios envolvem CPF de responsáveis, CNPJ de fornecedores, e valores em R$. Misturar tipos é bug jurídico, não só técnico. Um CPF no campo de CNPJ invalida o documento.

> **NOTA EXPLICATIVA — lib/audit.ts (Audit Trail):**
> Implementa 18 actions tipadas:
> ```
> document.create | document.edit | document.delete | document.download | document.view
> process.create | process.update | contract.view | contract.evaluate
> team.invite | team.update | team.remove | settings.update
> auth.login | auth.logout | search.execute | chat.send | navigation.page
> ```
> Cada evento inclui: UUID, action, resource, timestamp, sessionId (persistido no sessionStorage), userAgent, pathname.
>
> Buffer de 50 eventos com flush a cada 30s ou no `beforeunload`. Hoje o flush faz `console.info` em dev. O TODO no código já diz: "Integrar com Axiom, Datadog, ou API própria". Quando o backend existir, o flush envia para `/api/audit` que persiste na tabela `audit_trail` do Supabase (Part 20.11).
>
> **Alinhamento com spec:** Part 20.11 define o schema do audit trail com campos quase idênticos (id, processo_id, acao, agente, estado_anterior, estado_novo, hash, timestamp, detalhes). A lib do mockup já tem a base — falta adicionar `estado_anterior/novo` e `hash` quando o fluxo cíclico for implementado.

> **NOTA EXPLICATIVA — lib/lgpd.ts (LGPD Compliance):**
> Este é o arquivo mais impressionante do mockup do ponto de vista regulatório. Implementa:
>
> 1. **Consent Management** (Art. 7): 5 propósitos tipados (essential, analytics, ai_processing, communication, third_party). Cada consentimento é registrado com timestamp e versão. O propósito `essential` retorna sempre `true` (Art. 7, V — execução de contrato).
>
> 2. **Anonymization** (Art. 18, IV): Funções para CPF (`123.***.***-00`), CNPJ, email (`us***@dominio.com`), telefone, nome (`Maria d. S.`). Usadas quando dados aparecem em logs ou telas de terceiros.
>
> 3. **Data Retention** (Art. 15-16): Políticas definidas:
>    - `audit_logs`: 1825 dias (5 anos — obrigação legal Lei 14.133)
>    - `conversation_history`: 365 dias
>    - `session_data`: 30 dias
>    - `analytics`: 730 dias (2 anos, dados agregados)
>
> 4. **Data Subject Rights** (Art. 18): Types para access, rectification, anonymization, deletion, portability, information, revocation. Estrutura para workflow de solicitação (pending → processing → completed → denied).
>
> **Por que importa:** LGPD compliance é obrigação legal. Nenhum concorrente de GovTech no Brasil implementa isso no frontend desde o mockup. É diferencial de venda para controladores internos que precisam demonstrar privacy-by-design.

> **NOTA EXPLICATIVA — lib/observability.ts (Observability):**
> Implementa os 3 pilares de observability:
>
> 1. **Logger estruturado**: 4 níveis (debug/info/warn/error), contexto JSON, sessão, espelhamento no console em dev, silenciamento em prod (só warn+).
>
> 2. **Metrics**: Counter, gauge, histogram. Ring buffer de 500 entradas máximas (evita memory leak). Usado para Web Vitals e métricas custom.
>
> 3. **Traces (Spans)**: `startSpan(name)` retorna `{ end(status) }`. Mede duração de operações. `withSpan(name, fn)` é wrapper async que auto-captura erros. Cada span vira um histogram métrico automaticamente.
>
> 4. **Web Vitals**: Usa PerformanceObserver para LCP, INP (substituiu FID), CLS, TTFB, DOM Complete, Load. Cada vital é classificado (good/needs-improvement/poor) conforme thresholds do Core Web Vitals.
>
> 5. **Error Tracking**: Captura `window.onerror` e `unhandledrejection`, logga com contexto (filename, lineno, colno).
>
> 6. **Flush/Export**: `getSnapshot()` retorna tudo (logs + metrics + spans). `flush()` retorna e limpa. Pronto para enviar a qualquer backend (Axiom, Datadog, OpenTelemetry Collector, Sentry, ou API própria).
>
> **Por que isso existe num mockup:** O autor pensou em produção desde o início. Quando o backend for conectado, basta apontar o flush para o endpoint certo. Não é retrabalho — é fundação.

> **NOTA EXPLICATIVA — middleware.ts (Security):**
> O middleware Next.js roda em TODA request (exceto estáticos). Faz 3 coisas:
>
> 1. **Request ID**: UUID por request para rastreabilidade (padrão Cloudflare). Permite correlacionar logs frontend ↔ backend.
>
> 2. **CSP (Content Security Policy)**: Bloqueia XSS, injection de scripts, framing. Permite scripts do Vercel Analytics (trocar por CF quando migrar). `frame-ancestors 'none'` impede que o ATA360 seja embutido em iframe de terceiro (clickjacking defense).
>
> 3. **Nonce**: Gera nonce por request para uso futuro quando Next.js suportar CSP nonces completos no App Router. Hoje está no header `X-Nonce` — preparado para evolução.
>
> **O que adicionar:** Auth check. O middleware é o lugar correto para verificar se o usuário tem sessão válida antes de acessar qualquer rota `(main)/`. Redireciona para `/login` se não autenticado.

### Testes (5 arquivos)
| Arquivo | Cobre |
|---|---|
| `tests/app-context.test.tsx` | Context provider |
| `tests/lgpd.test.ts` | LGPD utilities |
| `tests/routes.test.ts` | Route definitions |
| `tests/types.test.ts` | Branded types |
| `tests/validations.test.ts` | Zod schemas |

> **NOTA EXPLICATIVA — Testes:**
> 5 arquivos de teste para as libs utilitárias. O setup (`tests/setup.ts`) configura o ambiente. Testam as fundações (tipos, validações, rotas, LGPD, context) mas NÃO testam componentes visuais. Quando o backend for conectado, adicionar:
> - Testes de integração (chat → API → resposta)
> - Testes do fluxo cíclico (APROVAR → selo calculado → próximo doc)
> - Testes de RLS (usuário A não vê dados de B)
> - Testes E2E com Playwright (fluxo completo: login → DFD → aprovar → ETP)

### Exemplo Real Implementado
- `lib/examples/dfd-saco-lixo.ts`: DFD completo (Prefeitura Lagoa Santa, saco de lixo 100L)
- Dados reais: CATMAT 234567, dotação orçamentária completa, PNCP como fonte
- Renderizado via `components/artifacts/dfd-document.tsx` no painel lateral

> **NOTA EXPLICATIVA — DFD Saco de Lixo:**
> Este exemplo é estratégico. Mostra um caso real e simples que qualquer servidor municipal entende: "preciso comprar sacos de lixo". O DFD inclui:
> - Identificação: DFD-PMLS-2026-0002, PAD 002/2026
> - Ente: Prefeitura Municipal de Lagoa Santa (cliente-alvo real)
> - Demandante: Carlos Alberto Ferreira, Coordenador de Serviços Gerais
> - Justificativa: estoque em nível crítico, 15 dias para esgotamento
> - Item: Saco de lixo 100L PEAD, CATMAT 234567, 1 PCT, R$ 89,90
> - Dotação: 04.122.0001.2001.0000 | Fonte: 1.500.0000 | Natureza: 3.3.90.30
> - Valor total: R$ 89,90 (dispensa de licitação, Dec. 12.807)
>
> **Por que importa para demo:** É o cenário perfeito para primeira demonstração. Simples o suficiente para explicar em 2 minutos. Real o suficiente para servidor reconhecer como genuíno. O valor de R$ 89,90 está abaixo do limite de dispensa (R$ 65.492,11 — Dec. 12.807/2025), então o fluxo é direto: DFD → dispensa → compra. Ideal para onboarding.
>
> O componente `dfd-document.tsx` renderiza esse DFD com:
> - 10 seções (Identificação, Ente, Demandante, Objeto, Justificativa, Itens, Prazo, Assinaturas, etc.)
> - Campos editáveis inline quando `isEditing=true`
> - Recálculo automático de valor total ao editar quantidade ou preço unitário
> - Formatação BRL (`Intl.NumberFormat pt-BR`)
> - Classificação visual de natureza e enquadramento

---

## 21.2 Alinhamento Mockup ↔ Spec v8

### ✅ O QUE ESTÁ ALINHADO

| Spec v8 | Mockup | Status |
|---|---|---|
| **Part 1**: Next.js + shadcn/ui + Tailwind | Next 16 + Radix completo + Tailwind 4 | ✅ Supera spec |
| **Part 3.3**: ACMA rotulado como IA | `⚠️ SUGESTÃO IA` no chat | ✅ Correto |
| **Part 3.4**: DESIGN_LAW gera artefato | DFD renderizado no artifacts panel | ✅ Correto (visual) |
| **Part 5**: Interface "Pesquisas + Documentos" | Chat (pesquisas) + Artifacts Panel (documentos) | ✅ Alinhado |
| **Part 8**: Tipos de dados (processos, contratos, equipe) | `types/index.ts` espelha schema Supabase | ✅ Alinhado |
| **Part 10**: Revisão humana obrigatória | Chat mostra sugestão, usuário decide | ✅ Correto |
| **Part 12.7**: Dashboard SuperADM | 16 abas implementadas com mock data | ✅ Detalhado |
| **Part 17**: Legal Design (identidade visual) | DM Sans + modo escuro + impressão | ✅ Base presente |
| **Part 19**: Sigilo (arquitetura não exposta) | Zero referência a agentes internos no UI | ✅ Correto |
| **LGPD**: Privacy-by-design | `lib/lgpd.ts` completo (consent, anonymize, retention) | ✅ Excepcional |
| **Audit Trail**: Part 20.11 | `lib/audit.ts` (18 actions, buffer, flush) | ✅ Base sólida |
| **Observability**: Production readiness | `lib/observability.ts` (logs, metrics, traces, Web Vitals) | ✅ Production-grade |
| **Security**: CSP + nonce | `middleware.ts` com CSP completo | ✅ Raro em mockup |
| **SEO**: Indexação Brasil | JSON-LD, OpenGraph pt-BR, llms.txt | ✅ Completo |

> **NOTA EXPLICATIVA — Alinhamento Part 19 (Sigilo):**
> A spec Part 19 é enfática: "artefato mostra O QUE + CONCLUSÃO, nunca COMO". O mockup respeita isso perfeitamente. Em nenhum lugar da interface aparece: nomes de agentes (ACMA, AUDITOR, DESIGN_LAW, Maestro), YAMLs de configuração, prompts, modelos de IA, scores internos ou fórmulas. O chat diz "Gerei o DFD" — não "O ACMA sugeriu e o DESIGN_LAW renderizou". Para o servidor, o ATA360 é uma caixa preta que entrega documentos conformes. Isso é exatamente o que a spec manda.

> **NOTA EXPLICATIVA — Alinhamento SEO (llms.txt):**
> O mockup inclui um arquivo `public/llms.txt` que é um padrão emergente para SEO de LLMs (similar ao robots.txt mas para IA). Contém descrição do ATA360 em linguagem natural para que crawlers de IA (ChatGPT, Claude, Perplexity) entendam o que o produto faz. Isso é visionário — poucos produtos no Brasil fazem isso. Alinhado com a estratégia go-to-market da spec Part 12.6.

### ⚠️ O QUE DIVERGE (sem conflito — complementar)

| Spec v8 | Mockup | Gap | Solução |
|---|---|---|---|
| Vercel não mencionado | `@vercel/analytics` instalado | Deploy spec = Cloudflare Pages | Remover Vercel Analytics, usar CF Analytics |
| Processo com 8 fases (Part 8) | Processo com 7 fases | Falta "alteração" | Adicionar fase no mockup |
| DFDData local no componente | Spec prevê YAML config-driven | Tipo hardcoded | Migrar para schema dinâmico via YAML |
| Chat simula resposta | Spec prevê API real (Workers) | Backend inexistente | Conectar a `/api/processo/` quando backend existir |
| Dashboard roles hardcoded | Spec prevê RLS Supabase | Auth inexistente | Substituir `const userRole` por sessão Supabase |

> **NOTA EXPLICATIVA — 7 fases vs 8 fases:**
> O mockup define as fases de um processo como: planejamento, execução, licitação, contrato, empenho, recebimento, avaliação. A spec Part 8 prevê 8 fases: planejamento → instrução → seleção → contratação → execução → alteração → sanção → encerramento. São modelagens diferentes do mesmo ciclo de vida. A spec segue a nomenclatura da Lei 14.133 (Art. 12 ao 164). O mockup simplificou para algo mais próximo do dia a dia do servidor.
>
> **Recomendação:** Manter ambas. O mockup mostra a visão "operacional" (que o servidor entende). A spec tem a visão "legal" (que o AUDITOR verifica). Implementar mapeamento entre as duas: `planejamento` = fase legal "planejamento + instrução". O servidor vê 7 fases simples; o sistema rastreia 8 fases legais internamente.

> **NOTA EXPLICATIVA — DFD hardcoded vs config-driven:**
> Hoje `dfd-document.tsx` é um componente React que renderiza HTML diretamente com os dados do `DFDData`. A spec prevê que o `documento_base_v8.html` (template universal) renderize QUALQUER tipo de artefato via YAML config + Nunjucks.
>
> São duas estratégias válidas:
> - **Componentes React** (mockup): Melhor para interatividade (edição inline, recálculo de valores, validação Zod em tempo real)
> - **Template engine** (spec): Melhor para escala (46 tipos sem código novo) e geração PDF server-side
>
> **Recomendação:** Usar ambos. Componente React no frontend para preview interativo + edição. Template engine no backend (DESIGN_LAW) para geração do PDF final. O dados fluem: React component (preview) → dados aprovados → DESIGN_LAW (PDF via template). Os dois consomem o mesmo schema Zod.

### ❌ O QUE FALTA NO MOCKUP (precisa ser construído)

| Necessário | Descrição | Prioridade |
|---|---|---|
| Auth Gov.br | Login OAuth2 via Supabase | P0 |
| API real (Hono/Workers) | Endpoints `/api/processo/*` | P0 |
| Supabase client | Conexão, queries, RLS | P0 |
| Fluxo cíclico visual | Botões APROVAR/EDITAR/NOVA SUGESTÃO no artifacts panel | P0 |
| Estado do processo visual | Stepper/progress bar (state machine Part 20.4) | P0 |
| Insight Engine cards | Recomendações no chat antes de gerar doc | P1 |
| Segundo artefato (ETP) | Só DFD existe como componente artifact | P1 |
| Checklist AUDITOR visual | Resultado tripartido (conforme/não conforme/ressalvas) | P1 |
| Selo ATA360 | Renderização condicional no artefato | P1 |
| Template universal v8 | Substituir DFD hardcoded por renderização config-driven | P1 |
| Notificações reais | WebSocket/Realtime Supabase (hoje é mock) | P2 |

> **NOTA EXPLICATIVA — Por que Auth é P0:**
> Sem autenticação, não existe multi-tenancy. Sem multi-tenancy, não há como ter mais de um cliente. Sem mais de um cliente, não há receita. Auth Gov.br é o gating factor — tudo depende dela. O Supabase já tem provider OAuth2 customizável. O fluxo é: botão "Entrar com Gov.br" → redirect OAuth2 → callback → sessão JWT → RLS ativado. O middleware.ts já existe e é o lugar certo para interceptar requests sem sessão.
>
> **Detalhe Gov.br:** O login Gov.br usa OAuth2 padrão. Supabase suporta custom OAuth providers. O fluxo é documentado em: https://manual-integracao.servicos.gov.br. Precisa cadastrar o ATA360 como "serviço consumidor" no portal de serviços do Gov.br. Nível de confiança: ouro (com validação de CPF) ou prata (sem validação biométrica). Para ATA360, prata é suficiente inicialmente.

> **NOTA EXPLICATIVA — Por que Fluxo Cíclico Visual é P0:**
> O fluxo cíclico é o DIFERENCIAL do produto. Sem ele, o ATA360 é só um gerador de PDF (commodity). Com ele, é um sistema de governança que guia o servidor do início ao fim com auditoria automática e loop de refinamento. O mockup tem o chat + artifacts panel — falta conectar os dois com o loop de decisão humana. Visualmente são 3 componentes novos: stepper (onde estou no processo), checklist AUDITOR (o que foi verificado), decision-bar (o que posso fazer agora).

---

## 21.3 Diagnóstico: O Mockup Faz Sentido?

### Veredicto: SIM — é uma base forte

O mockup NÃO é um protótipo descartável. É código de produção com:

1. **Arquitetura limpa**: App Router, context providers, dynamic imports, route type-safety
2. **Compliance real**: LGPD com consent management, anonymization, retention policies
3. **Observability real**: Logger estruturado, Web Vitals, error tracking, spans
4. **Security real**: CSP com nonce, middleware, sanitize XSS
5. **Audit trail real**: 18 actions tipadas, buffer com flush periódico
6. **Design system completo**: 40+ componentes Radix/shadcn, dark mode, responsivo
7. **Branded types**: CPF como tipo distinto de CNPJ em compile-time
8. **Zod validations**: Schemas prontos para contract, process, team, password

### O que NÃO é:
- Não é uma aplicação funcional (zero backend, zero auth, zero dados reais)
- Não renderiza documentos via YAML config (DFD é hardcoded)
- Não implementa o fluxo cíclico (spec Part 20.3)
- Não conecta com nenhuma API governamental

### Analogia:
É como ter um carro com carroceria, painel, bancos e sistema elétrico completos — mas sem motor e sem rodas. O chassis é sólido. Precisa do powertrain.

> **NOTA EXPLICATIVA — Por que o mockup é bom apesar de não ter backend:**
> Muitos projetos começam pelo backend e deixam o frontend por último. O resultado: APIs perfeitas com UI horrível que servidor público não sabe usar. O ATA360 fez o oposto — começou pela experiência do usuário. Isso é correto para GovTech porque:
> 1. Servidor público tem pouca tolerância para interfaces complexas
> 2. O primeiro contato é visual — se a tela assusta, não importa quão boa é a API
> 3. O mockup permite validar UX com usuários reais ANTES de investir em backend
> 4. Os tipos (Zod + branded) servem como contrato entre front e back — o backend sabe exatamente o que o front espera

---

## 21.4 Skeleton de Implementação — O Que Fazer

### CAMADA 1: Conectar Backend ao Frontend

O mockup é frontend puro. O backend é a PoC em Cloudflare Workers. Precisam se conectar.

#### 1.1 Tipos Compartilhados (shared/types)

Os tipos já existem em dois lugares — `types/index.ts` no mockup e nas specs. Unificar:

```
shared/
├── types/
│   ├── process.ts      → ProcessId, ProcessStatus, ProcessPhase (branded)
│   ├── contract.ts     → ContractId, ContractStatus (branded)
│   ├── document.ts     → DocumentId, ArtifactType, DFDData, ETPData...
│   ├── agent.ts        → AgentInput/Output contracts (Part 20.7)
│   ├── audit.ts        → AuditAction, AuditEvent
│   └── user.ts         → TeamMemberId, Permissions, Role
├── schemas/
│   ├── process.schema.ts    → Zod (já existe em lib/validations.ts)
│   ├── contract.schema.ts   → Zod (já existe)
│   ├── dfd.schema.ts        → Zod para DFDData (novo — derivar de dfd-document.tsx)
│   └── agent-io.schema.ts   → Zod para inter-agent contracts (Part 20.7)
└── constants/
    ├── routes.ts        → Já existe em lib/routes.ts
    ├── phases.ts        → 8 fases do processo (Part 8)
    └── states.ts        → State machine estados (Part 20.4)
```

> **NOTA EXPLICATIVA — Por que `shared/` e não duplicar:**
> Hoje os tipos vivem em `types/index.ts` (frontend) e na spec em markdown (backend). Quando o backend for implementado, o dev vai recriar os mesmos tipos. Daí surgem duas fontes de verdade que inevitavelmente divergem. Colocar em `shared/` (monorepo) ou num pacote npm interno (`@ata360/types`) garante: mudo o tipo num lugar, front e back quebram juntos em compile-time. Zod tem `.infer<>` que extrai o tipo TypeScript do schema — então o schema Zod É a fonte de verdade e o tipo TypeScript é derivado automaticamente.

#### 1.2 API Routes (Next.js → Workers)

O mockup não tem API routes. Precisa de proxy ou chamada direta:

```
Opção A (recomendada): Next.js como BFF
  app/api/processo/route.ts → proxy para Workers
  app/api/chat/route.ts → proxy para Workers + AI Gateway

Opção B: Chamada direta
  Frontend → Cloudflare Workers diretamente
  CORS configurado no Worker
```

> **NOTA EXPLICATIVA — BFF vs Chamada Direta:**
> BFF (Backend for Frontend) é um padrão onde o Next.js age como intermediário entre o browser e os Workers. Vantagens:
> - **Segurança**: O token Supabase e URLs internas dos Workers NUNCA chegam ao browser
> - **Simplificação**: Frontend chama `/api/processo/novo`, o BFF adiciona auth headers e roteia para o Worker correto
> - **Cache**: Next.js pode cachear respostas no edge (ISR)
> - **CORS**: Não precisa configurar CORS nos Workers porque o browser só fala com o mesmo domínio
>
> Chamada direta é mais simples mas expõe URLs dos Workers e exige CORS. Para MVP pode começar direto e migrar para BFF depois. Para produção com multi-tenant, BFF é a escolha correta.

**Endpoints que o mockup precisa consumir** (derivados de Part 20.9):

```
Frontend chama:
  POST /api/processo/novo       → Cria processo (retorna ProcessId)
  GET  /api/processo/:id/status → Estado + parecer + próximos passos
  POST /api/processo/:id/chat   → Envia mensagem ao Orquestrador
  POST /api/processo/:id/decisao → APROVAR/EDITAR/DESCARTAR
  GET  /api/processo/:id/documento → PDF do artefato atual
  GET  /api/processo/:id/historico → Versões anteriores

Workers recebe e roteia internamente:
  → Orquestrador → ACMA / DESIGN_LAW / AUDITOR (Part 20.3)
```

> **NOTA EXPLICATIVA — Endpoint `/api/processo/:id/chat`:**
> Este é o endpoint mais importante. Quando o servidor digita "Gere DFD compra saco de lixo 100l, 100 unidades" no chat, o frontend chama `POST /api/processo/:id/chat` com o texto. O Orquestrador (Worker) recebe, classifica que é pedido de DFD, aciona o Insight Engine (busca preços PNCP, ARPs vigentes), passa contexto para o ACMA (gera sugestão), apresenta ao usuário. O frontend não sabe que existem múltiplos agentes — recebe uma resposta estruturada com texto + artefato.
>
> A resposta deve incluir: `{ message: string, artifact?: ArtifactData, estado: EstadoDocumento, parecer?: Parecer, sugestoes?: Sugestao[] }`. O frontend consome e renderiza. O `chat-area.tsx` já tem a estrutura para receber `Message` e abrir `ArtifactData` — só precisa trocar o setTimeout pelo fetch.

#### 1.3 Auth (Supabase + Gov.br)

O mockup tem `const userRole = "superadm"` hardcoded. Substituir por:

```
Fluxo:
  1. Supabase Auth com provider Gov.br (OAuth2)
  2. Sessão JWT no cookie (httpOnly, secure, SameSite)
  3. middleware.ts valida sessão (já existe middleware, adicionar check)
  4. app-context.tsx recebe user real do Supabase
  5. RLS no Supabase isola dados por tenant (orgao_id)

Arquivos a alterar:
  - middleware.ts         → Adicionar auth check
  - contexts/app-context  → Substituir mock user por Supabase session
  - sidebar-menu.tsx      → Role vem do user real
  - dashboard page        → Dados filtrados por orgao_id
```

> **NOTA EXPLICATIVA — RLS (Row Level Security):**
> RLS é a funcionalidade do PostgreSQL/Supabase que garante isolamento de dados por tenant. Funciona assim: cada tabela tem uma policy que filtra linhas baseado no `orgao_id` do JWT do usuário. Exemplo:
> ```sql
> CREATE POLICY "Usuarios veem apenas dados do seu orgao"
>   ON processos FOR SELECT
>   USING (orgao_id = auth.jwt() ->> 'orgao_id');
> ```
> O servidor de Lagoa Santa nunca vê processos de Sete Lagoas, mesmo que ambos usem a mesma API. Isso é obrigatório para multi-tenancy em licitações — dados de uma prefeitura são sigilosos até publicação no PNCP.
>
> O mockup já tem `orgao_id` implícito nos dados mock (Prefeitura Lagoa Santa em todos os exemplos). Quando Supabase for integrado, o orgao_id vem do JWT automaticamente.

### CAMADA 2: Fluxo Cíclico no Frontend

O mockup tem chat → artefato (linear). Precisa do loop (Part 20.3).

#### 2.1 Estado do Processo no Context

O `app-context.tsx` gerencia theme, sidebar, chat. Adicionar estado do processo:

```
Novo estado no AppContext:
  currentProcess: {
    id: ProcessId
    estado: EstadoDocumento    → Part 20.4
    iteracao: number
    documento_atual: ArtifactData
    parecer_auditor: ParecerAuditor | null
    sugestoes_acma: SugestaoACMA[]
    selo_aprovado: boolean
    proximo_sugerido: string | null
  }
```

> **NOTA EXPLICATIVA — Por que no Context e não em estado local:**
> O estado do processo precisa ser acessível por múltiplos componentes simultâneos:
> - `chat-area.tsx` precisa saber o estado para mostrar mensagens contextuais ("Seu DFD está aguardando decisão")
> - `artifacts-panel.tsx` precisa saber o estado para mostrar os botões de decisão corretos
> - `process-stepper.tsx` precisa saber o estado para colorir o passo correto
> - `sidebar-menu.tsx` pode mostrar badge com docs pendentes
>
> Se ficasse em estado local do chat, o artifacts panel não saberia que o AUDITOR terminou. O Context resolve isso: qualquer componente chama `useApp()` e tem acesso ao estado atual do processo.
>
> **Alternativa futura:** Quando a complexidade crescer (múltiplos processos abertos simultâneos, offline support), considerar migrar para Zustand ou Jotai. Mas para MVP, Context é suficiente e o mockup já usa esse padrão corretamente.

#### 2.2 Botões de Decisão no Artifacts Panel

O `artifacts-panel.tsx` tem: Editar, Baixar, Imprimir, Inserir em processo.
Falta (Part 20.3 passo 6):

```
Após AUDITOR emitir parecer, adicionar:
  [✅ APROVAR]            → selo + assinatura + próximo doc
  [✏️ EDITAR]             → volta para edição, reavalia
  [🔄 NOVA SUGESTÃO]      → ACMA gera nova versão
  [⚠️ PROSSEGUIR]         → aceita sem selo
  [🗑️ DESCARTAR]          → cancela documento

Visual: barra de ações na base do artifacts panel
Condição: só aparece quando estado == AGUARDANDO_DECISAO
```

> **NOTA EXPLICATIVA — A barra de decisão é componente separado:**
> Criar `decision-bar.tsx` em vez de embutir no `artifacts-panel.tsx`. Motivos:
> 1. Separação de responsabilidade: artifacts panel renderiza o documento, decision bar captura a decisão
> 2. Reutilização: a mesma decision bar funciona no panel lateral e no dialog expandido
> 3. Testabilidade: testar decisões isoladamente dos artefatos
>
> **Comportamento de cada botão:**
> - **APROVAR**: Chama `POST /api/processo/:id/decisao { acao: 'APROVAR' }`. Backend calcula selo_aprovado, aciona DESIGN_LAW para PDF final, carimbo SERPRO, sugere próximo documento. Frontend mostra animação de sucesso e pergunta "Gerar ETP?".
> - **EDITAR**: Frontend habilita modo edição no artefato (isEditing=true). Usuário edita campos. Ao salvar, chama API que regenera o documento (DESIGN_LAW) e reavalia (AUDITOR). Nova iteração, novo hash. Loop continua.
> - **NOVA SUGESTÃO**: Chama API que aciona ACMA novamente com contexto atualizado. ACMA gera nova sugestão respeitando limite de 3 por seção (Part 20.5). Se limite atingido, botão fica desabilitado com tooltip "Limite de sugestões atingido".
> - **PROSSEGUIR COM ALERTAS**: Registra no audit trail que o usuário escolheu prosseguir apesar de NÃO CONFORME. selo_aprovado = false. Documento é gerado SEM selo. O frontend NÃO mostra mensagem de erro — ausência do selo é silenciosa (Part 19.10.3).
> - **DESCARTAR**: Confirma com modal ("Tem certeza? Esta ação não pode ser desfeita"). Se confirmado, estado = DESCARTADO. Documento removido do painel.

#### 2.3 Checklist Visual do AUDITOR

Após auditoria, mostrar no artifacts panel (acima dos botões de decisão):

```
Resultado: CONFORME ✅ / NÃO CONFORME ❌ / RESSALVAS ⚠️

Checklist:
  ☑ Fundamentação legal presente
  ☑ Valores dentro dos limites (Dec. 12.807)
  ☑ Fonte de preços válida (PNCP)
  ☐ Justificativa de quantidade insuficiente → Achado: "Art. 18, §1º..."
  ☑ Vinculação ao PCA

Score: 87/100
Selo: ✅ Aprovado
```

> **NOTA EXPLICATIVA — O checklist NÃO mostra como o score foi calculado:**
> Part 19 (Sigilo) proíbe: pesos, thresholds, fórmulas. O frontend mostra:
> - Lista de verificações (ok/pendente)
> - Achados textuais ("Justificativa de quantidade insuficiente")
> - Resultado tripartido (CONFORME / NÃO CONFORME / RESSALVAS)
> - Score numérico (87/100)
> - Se selo será aplicado
>
> O frontend NÃO mostra: peso de cada critério, fórmula do score, quais etapas usaram LLM vs determinístico, nome do modelo de IA usado. Tudo isso é informação interna do AUDITOR (Part 20.13) que fica no backend.
>
> **Visual sugerido:** Collapsible no topo do artifacts panel. Colapsado mostra: "CONFORME ✅ — 87/100 — 5 de 6 verificações ok". Expandido mostra a lista completa de verificações com achados. Usa o componente `Collapsible` do shadcn/ui que já está instalado.

#### 2.4 Stepper de Progresso

Adicionar barra de progresso visual do estado (Part 20.4):

```
RASCUNHO → SUGESTÃO → TEXTO_APROVADO → GERADO → AUDITADO → DECISÃO → FINALIZADO
    ●─────────●─────────────●────────────●────────●──────────○──────────○
                                                    ▲ você está aqui
```

> **NOTA EXPLICATIVA — Simplificação visual:**
> A state machine completa (Part 20.4) tem 12+ estados. O stepper no frontend deve simplificar para 7 estados que o servidor entende:
> 1. **Rascunho** (RASCUNHO) — "Você está escrevendo"
> 2. **Sugestão** (SUGESTAO_ACMA) — "IA analisando"
> 3. **Texto aprovado** (TEXTO_APROVADO) — "Você confirmou o conteúdo"
> 4. **Documento gerado** (GERADO) — "PDF pronto"
> 5. **Auditado** (AUDITADO) — "Verificação concluída"
> 6. **Sua decisão** (AGUARDANDO_DECISAO) — "Falta sua aprovação"
> 7. **Finalizado** (FINALIZADO) — "Assinado e publicado"
>
> Estados intermediários (EDITANDO, PROSSEGUIR_COM_ALERTAS, REJEITADO) são tratados como sub-estados do passo atual, não como passos separados no stepper. Quando o usuário clica EDITAR, o stepper volta para o passo 3 com indicação visual de iteração ("Iteração 2/5").
>
> O stepper fica no topo do artifacts panel, abaixo do header. Ocupa pouco espaço vertical (~40px). Usa dots com cores: verde (completo), azul (atual), cinza (pendente), âmbar (com ressalva).

### CAMADA 3: Renderização Config-Driven

O mockup tem DFD hardcoded em `dfd-document.tsx`. A spec prevê renderização universal via YAML.

#### 3.1 Migração Necessária

```
Estado atual:
  dfd-document.tsx → DFDData (interface local) → HTML hardcoded

Estado desejado (spec Part 17 + 18):
  yaml_config → documento_base_v8.html → Nunjucks/template engine → HTML renderizado

Caminho de migração:
  1. Manter dfd-document.tsx como referência visual
  2. Criar renderizador universal que recebe YAML + dados
  3. Template engine client-side (Nunjucks-slim ou similar)
  4. Cada tipo de artefato = entrada no YAML, ZERO componente novo
```

> **NOTA EXPLICATIVA — Estratégia dupla de renderização:**
> A migração NÃO é "deletar dfd-document.tsx e usar templates". É mais sutil:
>
> **Frontend (preview interativo)**: Usa componentes React. Permite edição inline, validação em tempo real, recálculo de valores, UX rica. O `dfd-document.tsx` é o modelo. Para cada novo tipo, pode-se criar um componente similar OU um renderizador universal que interpreta o YAML e gera React dinamicamente.
>
> **Backend (PDF final)**: Usa documento_base_v8.html + Nunjucks. Gera PDF determinístico (DESIGN_LAW). Zero LLM. Mesmo input = mesmo output. Hash SHA-256 para garantir integridade.
>
> **Fluxo completo:**
> 1. Servidor preenche/edita via componente React no artifacts panel (interativo)
> 2. Dados validados pelo Zod schema
> 3. Dados enviados ao Worker via API
> 4. DESIGN_LAW renderiza HTML via template + dados + YAML → gera PDF
> 5. PDF salvo no R2, hash calculado
> 6. Frontend recebe URL do PDF para download/impressão
>
> O componente React e o template HTML podem ter visual diferente (React é preview interativo, PDF é documento formal com Legal Design), e isso é OK. O que importa é que os DADOS são idênticos.

#### 3.2 Próximos Artefatos a Implementar

O mockup só tem DFD. Pela trilha (Part 20.8):

```
Prioridade por uso:
  1. DFD  → ✅ Já existe no mockup
  2. ETP  → Próximo (herda dados do DFD)
  3. TR   → Após ETP
  4. PP   → Pesquisa de preços (integra PNCP)
  5. MR   → Mapa de riscos
```

> **NOTA EXPLICATIVA — Herança DFD → ETP:**
> O ETP (Estudo Técnico Preliminar) herda dados do DFD: objeto, justificativa, quantidade, valor estimado. No YAML config, isso é definido como `herda_de: [DFD]`. Na prática, quando o Orquestrador sugere "Próximo: gerar ETP" (Part 20.8), ele pré-carrega os campos do DFD no formulário do ETP. O servidor não precisa redigitar. Só complementa com: análise de mercado, solução técnica, riscos, viabilidade.
>
> No mockup, o ETP seria um novo componente em `components/artifacts/etp-document.tsx` com interface `ETPData extends DFDData { analise_mercado, solucao_tecnica, riscos, viabilidade }`. Ou, se o renderizador universal estiver pronto, seria só uma nova entrada YAML + schema Zod.

### CAMADA 4: Insight Engine no Chat

O mockup mostra suggestion cards estáticos. Substituir por dados reais:

```
Estado atual (chat-area.tsx):
  const suggestionCards = [
    { title: "Pesquise rápido", ... },
    { title: "Artefatos em 1 clique", ... },
  ]

Estado desejado:
  Cards dinâmicos baseados no contexto do processo:
  - "ARP vigente encontrada: R$ 42,50/unid (economia de 23%)"
  - "Emenda parlamentar RP6 disponível: R$ 150.000"
  - "3 processos similares no PNCP (últimos 90 dias)"
  - "TCU Acórdão 1234/2025: atenção ao fracionamento"
```

> **NOTA EXPLICATIVA — Cards estáticos vs dinâmicos — transição gradual:**
> Os 8 suggestion cards atuais (Pesquise rápido, Artefatos em 1 clique, etc.) são genéricos e servem como onboarding — mostram ao servidor o que o ATA360 pode fazer. Eles NÃO devem ser removidos.
>
> A evolução é: cards genéricos na tela inicial (sem processo aberto) → cards dinâmicos quando há processo em andamento. Implementação:
>
> ```
> Se !currentProcess → mostra 8 cards genéricos (atual)
> Se currentProcess → mostra cards do Insight Engine:
>    - Dados PNCP relevantes ao objeto
>    - ARPs vigentes com saldo
>    - Emendas/convênios elegíveis (Radar de Recursos)
>    - Jurisprudência TCU aplicável
>    - Alertas de conformidade
> ```
>
> O Insight Engine (Part 3.2 + 14) é o que gera esses cards. Ele cruza 76+ APIs e retorna `contexto_enriquecido` (Part 20.7). O frontend consome e renderiza como cards visuais. O ACMA também consome para gerar sugestões fundamentadas.
>
> **Componente sugerido:** `insight-cards.tsx` que recebe `InsightData[]` e renderiza cards no mesmo estilo visual dos atuais (ícone + título + descrição), mas com dados reais e badge indicando a fonte ("PNCP", "TCU", "TransfereGov").

---

## 21.5 Mapa de Arquivos: O Que Alterar vs Criar

### Arquivos EXISTENTES a ALTERAR

| Arquivo | Alteração | Motivo |
|---|---|---|
| `contexts/app-context.tsx` | Adicionar estado do processo + Supabase session | Auth real + fluxo cíclico |
| `components/chat-area.tsx` | Substituir simulação por API real | Backend connection |
| `components/artifacts-panel.tsx` | Adicionar botões de decisão + checklist AUDITOR | Fluxo cíclico Part 20.3 |
| `components/sidebar-menu.tsx` | Role do user real (Supabase) | Auth real |
| `components/dashboard-superadm-page.tsx` | Dados reais via API | Backend connection |
| `components/processes-page.tsx` | Adicionar fase "alteração" (8ª) | Alinhamento Part 8 |
| `middleware.ts` | Adicionar auth check | Proteger rotas |
| `package.json` | Adicionar `@supabase/supabase-js` | Auth + dados |
| `lib/audit.ts` | Conectar flush com API real | Persistência |

> **NOTA EXPLICATIVA — Alterações são incrementais, não reescritas:**
> Nenhum arquivo existente precisa ser reescrito do zero. As alterações são:
> - `app-context.tsx`: adicionar ~50 linhas (novo estado currentProcess + Supabase hooks)
> - `chat-area.tsx`: substituir `handleSendMessage()` (~30 linhas simuladas → ~30 linhas de fetch real)
> - `artifacts-panel.tsx`: adicionar import de `DecisionBar` e `AuditorChecklist` + renderização condicional (~20 linhas)
> - `middleware.ts`: adicionar bloco de auth check (~15 linhas)
>
> O investimento total em alterações é ~150 linhas em arquivos existentes. O grosso do trabalho é nos arquivos novos.

### Arquivos NOVOS a CRIAR

| Arquivo | Função | Linhas estimadas |
|---|---|---|
| `lib/supabase.ts` | Client Supabase (createBrowserClient) | ~30 |
| `lib/api.ts` | Fetch wrapper para Workers endpoints | ~80 |
| `shared/types/agent.ts` | Inter-agent contracts (Part 20.7) | ~60 |
| `shared/schemas/agent-io.schema.ts` | Zod para I/O dos agentes | ~100 |
| `shared/constants/states.ts` | State machine (Part 20.4) | ~40 |
| `components/decision-bar.tsx` | Barra APROVAR/EDITAR/NOVA SUGESTÃO | ~150 |
| `components/auditor-checklist.tsx` | Resultado visual do AUDITOR | ~120 |
| `components/process-stepper.tsx` | Stepper de estados do processo | ~100 |
| `components/insight-cards.tsx` | Cards dinâmicos do Insight Engine | ~100 |
| `components/artifacts/universal-renderer.tsx` | Renderizador config-driven | ~200 |
| `app/api/processo/route.ts` | BFF proxy para Workers | ~60 |
| `app/api/chat/route.ts` | BFF proxy para chat/Orquestrador | ~60 |
| `app/(auth)/login/page.tsx` | Tela de login Gov.br | ~100 |
| **TOTAL** | | **~1200** |

> **NOTA EXPLICATIVA — 1200 linhas novas:**
> Para contexto, o mockup existente tem ~10.000+ linhas de código. Adicionar ~1200 é um incremento de ~12%. Não é reescrever — é completar. As 1200 linhas são majoritariamente:
> - 3 novos componentes visuais (decision-bar, auditor-checklist, process-stepper): ~370 linhas
> - 2 API routes (processo, chat): ~120 linhas
> - Tipos/schemas compartilhados: ~200 linhas
> - Infraestrutura (supabase client, api wrapper, auth page): ~270 linhas
> - Renderizador universal: ~200 linhas
>
> O dev que implementar vai gastar mais tempo entendendo o mockup existente do que escrevendo código novo. Por isso este documento existe — para que ele NÃO precise ler 3200 linhas de dashboard para entender onde alterar.

---

## 21.6 O Que NÃO Mudar

O mockup tem decisões de design que estão corretas e devem ser preservadas:

| Decisão | Por quê manter |
|---|---|
| DM Sans como fonte | Limpa, profissional, bom para gov |
| Layout Chat + Artifacts Panel lateral | Paradigma ChatGPT/Claude que servidor já conhece |
| Dark mode via `prefers-color-scheme` + toggle | Alinhado com spec Part 17 |
| Suggestion cards expansíveis | UX boa para servidor que não sabe o que pedir |
| Rating de respostas (⭐ 1-5 + observação) | Dados para melhorar ACMA |
| Logout com NPS inline | Inteligente — captura satisfação no momento natural |
| Badge "Em breve" nos cards | Gerencia expectativa sem mentir |
| `llms.txt` público | SEO para LLMs — visionário |
| CSP no middleware | Security baseline correta |
| Branded types (CPF ≠ CNPJ em compile-time) | Type safety que previne bugs |
| LGPD compliance (`lib/lgpd.ts`) | Diferencial — concorrentes não têm |
| Animação shine no logo | Polimento visual que transmite profissionalismo |
| Skip navigation link | Acessibilidade WCAG — raro em GovTech BR |
| `aria-label` em todos os botões | Screen reader ready |
| `role="banner"` no header | Semantic HTML correto |
| Dynamic import do ChatArea | Performance — não carrega ~860 linhas até necessário |

> **NOTA EXPLICATIVA — Preservar a identidade visual:**
> O mockup estabeleceu uma identidade visual que funciona: cores neutras (foreground/background/muted), bordas sutis (border/40), arredondamentos consistentes (rounded-full nos botões, rounded-2xl nos modais), transições suaves (transition-panel no sidebar). Isso NÃO é coincidência — é design system aplicado.
>
> A spec Part 17 define: Palatino Linotype para documentos oficiais (PDF), escala tipográfica áurea, respiro visual. O mockup usa DM Sans para a interface web (não para o PDF). Ambas coexistem: DM Sans na tela, Palatino no documento. Não misturar.
>
> **ATENÇÃO ao dev:** Se você mexer no globals.css, respeite os design tokens (--font-sans, --font-mono, as variáveis de cor). O dashboard usa variáveis customizadas (--dashboard-blue, --dashboard-green, etc.) que são dark-mode aware. Alterar cores em um componente pode quebrar visual em 15 outros.

---

## 21.7 Sequência de Implementação

Ordenado por dependência técnica (não por preferência):

```
FASE 1: Fundação
├── 1. shared/types + shared/schemas (extrair do mockup)
├── 2. lib/supabase.ts (client)
├── 3. Auth Gov.br (middleware + login page)
└── 4. app-context.tsx com user real

FASE 2: Conexão Backend
├── 5. lib/api.ts (fetch wrapper para Workers)
├── 6. app/api/ routes (BFF proxy)
├── 7. chat-area.tsx → API real (POST /api/processo/:id/chat)
└── 8. processes-page.tsx → dados reais

FASE 3: Fluxo Cíclico
├── 9. process-stepper.tsx (estado visual)
├── 10. decision-bar.tsx (APROVAR/EDITAR/NOVA SUGESTÃO)
├── 11. auditor-checklist.tsx (resultado tripartido)
└── 12. artifacts-panel.tsx integrado com decisões

FASE 4: Artefatos Config-Driven
├── 13. universal-renderer.tsx (YAML → HTML)
├── 14. ETP como segundo artefato
├── 15. TR como terceiro
└── 16. PP com dados PNCP reais

FASE 5: Inteligência
├── 17. insight-cards.tsx (dados reais APIs gov)
├── 18. Notificações via Supabase Realtime
├── 19. Dashboard com dados reais
└── 20. Selo ATA360 condicional
```

> **NOTA EXPLICATIVA — Por que esta ordem e não outra:**
>
> **FASE 1 antes de tudo** porque sem auth não existe multi-tenancy, e sem tipos compartilhados o backend e frontend vão divergir. É fundação literal.
>
> **FASE 2 antes de FASE 3** porque o fluxo cíclico precisa de backend funcionando para responder às decisões do usuário. Sem API, os botões APROVAR/EDITAR não fazem nada.
>
> **FASE 3 antes de FASE 4** porque o fluxo cíclico é o diferencial do produto. Melhor ter 1 artefato (DFD) com fluxo completo funcionando do que 5 artefatos sem fluxo.
>
> **FASE 4 antes de FASE 5** porque artefatos são o produto entregue (o servidor precisa do DFD, ETP, TR). Insight Engine é otimização — enriquece a experiência mas não é bloqueante.
>
> **FASE 5 por último** porque inteligência depende de dados reais fluindo pelo sistema. Dashboard precisa de processos reais sendo criados. Insight cards precisam de APIs governamentais retornando dados. Selo precisa de AUDITOR funcionando.
>
> **Exceção possível:** Se o primeiro cliente quiser ver o Dashboard (demo de vendas), pode-se antecipar FASE 5 item 19 com dados mock melhorados. O dashboard já funciona com mock — basta manter e gradualmente substituir por dados reais.

---

## 21.8 Métricas de Validação

Como saber se cada fase foi implementada corretamente:

| Fase | Métrica de Sucesso | Como Testar |
|---|---|---|
| 1 | Login Gov.br funciona, sessão persiste, RLS bloqueia cross-tenant | Criar 2 orgs teste, logar em cada, verificar que org A não vê dados de org B |
| 2 | Chat envia mensagem e recebe resposta do Worker real | Digitar "Gere DFD" e receber artefato do backend (não simulado) |
| 3 | Usuário vê botões de decisão após AUDITOR, loop funciona | Gerar DFD → AUDITOR emite parecer → clicar EDITAR → editar campo → salvar → AUDITOR reavalia → APROVAR |
| 4 | ETP gerado via YAML idêntico ao template v7 | Comparar PDF gerado pelo sistema com PDF do template 03_ETP_template_v7.html preenchido manualmente |
| 5 | Cards de insight mostram dados reais do PNCP | Digitar "saco de lixo 100L" e ver preços reais do PNCP nos cards |

> **NOTA EXPLICATIVA — Teste end-to-end para validação final:**
> O teste mais importante é o "teste saco de lixo". O servidor faz:
> 1. Login com Gov.br
> 2. Digita "preciso comprar sacos de lixo 100L, 100 unidades"
> 3. ATA360 mostra cards de insight (preços PNCP, ARPs vigentes)
> 4. ATA360 sugere DFD com justificativa (ACMA, rotulado como IA)
> 5. Servidor revisa e aprova texto
> 6. DFD é gerado (DESIGN_LAW → PDF)
> 7. AUDITOR verifica → CONFORME
> 8. Servidor aprova → selo aplicado → PDF final com hash e carimbo
> 9. ATA360 sugere: "Próximo: Dispensa de licitação (valor abaixo de R$ 65.492,11)"
>
> Se esse fluxo funciona de ponta a ponta, o produto está pronto para primeiro cliente.

---

## 21.9 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Gov.br OAuth2 demora para aprovar cadastro | Alta | Bloqueante | Usar login email/senha temporário para dev/demo; Gov.br para produção |
| Next.js 16 tem breaking changes com Workers | Baixa | Média | BFF absorve diferenças; Workers não dependem do Next.js diretamente |
| Dashboard 3200+ linhas fica pesado | Média | Baixa | Já usa dynamic imports; cada aba é lazy loaded |
| Renderizador universal não reproduz visual v7 | Média | Alta | Manter componentes React como fallback; renderizador é para PDF server-side |
| PNCP muda API sem aviso | Alta | Média | PoC já tem 29 endpoints testados; LEGAL_SYNC monitora; fallback com cache KV |
| Dev não entende o mockup | Média | Alta | Este documento existe para isso — mapa de arquivos com notas explicativas |

> **NOTA EXPLICATIVA — Risco "Dev não entende o mockup":**
> O mockup tem 10.000+ linhas distribuídas em 40+ arquivos. O componente mais complexo (dashboard) tem 3200+ linhas. Sem orientação, um dev novo pode gastar dias lendo código para entender onde alterar o quê.
>
> Este documento serve como guia de navegação. A Seção 21.5 (Mapa de Arquivos) é a referência: diz exatamente quais arquivos alterar, o que adicionar, e quais criar do zero. As notas explicativas em cada componente explicam POR QUE aquele código existe e COMO ele se conecta com a spec.
>
> **Recomendação:** O primeiro onboarding de qualquer dev no projeto deve incluir:
> 1. Ler MEMORY.md (visão geral, 5 min)
> 2. Ler este documento (Part 21, 20 min)
> 3. Rodar o mockup local (`npm run dev`)
> 4. Navegar todas as 8 páginas
> 5. Testar o fluxo DFD (digitar "gere DFD saco de lixo")
> 6. Abrir `app-context.tsx` e entender o estado global
>
> Depois disso, o dev sabe onde está e o que fazer.

---

## 21.10 Glossário de Decisões Técnicas

| Decisão no Mockup | Alternativa | Por que esta |
|---|---|---|
| `"use client"` em todos os components | Server Components | Interatividade pesada (chat, edição inline, drag resize) exige client-side. Server Components seriam corretos para páginas estáticas (about, pricing), que não existem no mockup. |
| `AppProvider` como Context global | Zustand, Jotai, Redux | Context é suficiente para estado atual (~15 variáveis). Quando crescer para dezenas de processos simultâneos, migrar para Zustand (zero boilerplate, compatível com React 19). |
| `dynamic()` para ChatArea | Import direto | ChatArea tem 860 linhas. Dynamic import evita que todo esse JS carregue se o usuário navega direto para /dashboard. Economia de ~50KB no first load. |
| shadcn/ui (copy-paste) | Component library NPM | shadcn é o padrão da indústria para Next.js/Tailwind. Componentes vivem no repo (não em node_modules) — total controle sobre customização. Cada componente Radix é acessível por padrão (ARIA). |
| `BRLCents` (centavos) | `number` (reais) | Floating point em JavaScript: `0.1 + 0.2 = 0.30000000000000004`. Em centavos: `10 + 20 = 30`. Para licitação onde R$ 0,01 importa, centavos é obrigatório. |
| `localStorage` para theme/consent | Cookie | Theme é preferência visual, sem dados sensíveis. Consent precisa persistir mesmo sem sessão server-side. Cookies seriam corretos para auth (httpOnly, secure). |
| Ring buffer 500 para observability | Array infinito | Memory leak prevention. Um usuário que fica 8h logado geraria milhares de métricas. Com cap de 500, memória é bounded. Flush exporta e limpa. |
| Session ID no `sessionStorage` | Cookie | Session storage é limpo quando a aba fecha — exatamente o comportamento desejado para audit trail. Cookie persistiria entre sessões, gerando falso positivo de "mesma sessão". |

> **NOTA EXPLICATIVA — Estas decisões são defensáveis:**
> Cada escolha técnica no mockup tem razão. Não foram feitas por conveniência — foram feitas por correção. O dev que herdar este código não precisa questionar "por que usaram Context em vez de Redux?" — a resposta está aqui. Se no futuro a complexidade justificar mudança, a migração é documentada (Context → Zustand, Ring buffer → streaming export, etc.).

---

*Documento gerado com base na leitura completa do repositório v0-ata-360-chatbot-ui (155 arquivos, 40+ componentes, 7 libs utilitárias, 5 testes) e cruzamento com a spec consolidada v8 (20 Parts). Todas as notas explicativas derivam de análise direta do código-fonte, não de suposições.*
