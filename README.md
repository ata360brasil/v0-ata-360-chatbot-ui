# ATA360 — Plataforma Inteligente de Contratacoes Publicas

> Sistema AI-first para gestao de contratacoes publicas brasileiras. Especialista na Lei 14.133/2021, com dados oficiais, anti-alucinacao e decisao humana soberana.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)]()
[![React 19](https://img.shields.io/badge/React-19-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]()
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## Arquitetura AI-First

O ATA360 e concebido como sistema autonomo de IA — a inteligencia artificial e a infraestrutura, nao o complemento. O sistema opera vinculado a lei e a decisao do servidor publico (Art. 20, LINDB).

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui |
| BFF | Next.js API Routes |
| Backend | Cloudflare Workers (TypeScript) |
| Banco de Dados | Supabase (PostgreSQL) + Cloudflare D1 |
| Storage | Cloudflare R2 |
| Cache | Cloudflare KV |
| IA | Cloudflare AI Gateway (multi-model) |
| Auth | Supabase + Gov.br SSO |

### Multi-Provider AI Gateway

| Provider | Status | Modelos |
|----------|--------|---------|
| Anthropic (Claude) | Ativo (primario) | Haiku 4.5, Sonnet 4.5, Opus 4.6 |
| OpenAI (GPT) | Ativo (fallback) | GPT-4o Mini, GPT-4o |
| Google (Gemini) | Ativo (fallback) | Gemini 2.0 Flash, Gemini 2.0 Pro |
| Meta (Llama) | Planejado | Llama 3.3 70B, Llama 3.1 8B |
| Mistral | Planejado | Mistral Large, Mistral Small |

### Tiers de Processamento

- **Triagem (80%)** — Haiku: classificacao, extracao, lookup
- **Geracao (15%)** — Sonnet: sugestoes ACMA, analise complexa
- **Critico (5%)** — Opus: jurisprudencia, revisao final

---

## Funcionalidades

- **Chat IA** — Assistente especialista na Lei 14.133/2021
- **Geracao de Documentos** — 40+ tipos (ETP, TR, DFD, editais, minutas)
- **Pesquisa de Precos** — IN SEGES/ME 65/2021, 17+ fontes oficiais
- **Auditoria Automatica** — Checklist de conformidade legal
- **Normalizacao de Texto** — Pipeline de 7 estagios
- **Dashboard** — SuperADM (16 abas) e LocalADM (6 abas) por role
- **Blog Automatizado** — Conteudo programatico sobre licitacoes e IA
- **Glossario** — Taxonomia de termos de contratacoes publicas
- **Indicadores Fiscais** — CAPAG, FPM, FPE integrados

### Anti-Alucinacao (8 Camadas)

1. Fontes oficiais exclusivas (PNCP, IBGE, TCU, CGU)
2. Motor deterministico para documentos (templates HTML)
3. Auditoria automatica (AUDITOR agent)
4. Cross-reference multi-fonte
5. Revisao humana obrigatoria
6. Rastreabilidade total (hash SHA-256)
7. Alertas proativos
8. Codigo de conduta IA (regras inviolaveis)

---

## Estrutura do Projeto

```
app/
  (institutional)/     # Paginas publicas (landing, blog, glossario, contato...)
  (legal)/             # Paginas legais (privacidade, termos, LGPD)
  (main)/              # App autenticado (chat, dashboard, contratos, processos...)
  api/                 # BFF API routes
  layout.tsx           # Root layout (metadata, fonts, GA4, structured data)
  sitemap.ts           # Sitemap dinamico (paginas + blog + glossario)
  robots.ts            # Robots.txt (AI crawlers permitidos)

components/
  ui/                  # shadcn/ui (70+ componentes)
  *.tsx                # Componentes de pagina e features

lib/
  masks.ts             # Input masks (CPF, CNPJ, telefone, BRL, datas)
  validations.ts       # Zod schemas com validacao algoritmica
  analytics.ts         # Google Analytics 4 + eventos AI-native
  blog.ts              # Engine de blog automatizado
  glossary.ts          # Taxonomia de glossario
  routes.ts            # Rotas type-safe
  types.ts             # Branded types (CPF, CNPJ, BRLCents)
  observability.ts     # Telemetria (logs, metrics, traces, Web Vitals)
  schemas/
    ai-gateway.ts      # Modelos e custos por tier
    ai-providers.ts    # Multi-provider registry (5 providers)
    agent-training.ts  # Anti-alucinacao e treinamento de agentes

workers/
  src/
    orchestrator/      # Engine, pipeline, chat-router, agents, chat-guard
    normalization/     # Pipeline de normalizacao (7 estagios)
    compliance/        # Integridade e codigo de conduta IA
    cron/              # Calibracao, otimizacao de prompts, feedback
```

---

## SEO & AI-Citability

- **Programmatic SEO** — Blog e glossario geram paginas automaticamente
- **Structured Data** — Organization, WebApplication, FAQPage, BlogPosting, DefinedTermSet (JSON-LD)
- **AI Crawlers** — GPTBot, ClaudeBot, PerplexityBot, bingbot permitidos
- **llms.txt** — Metadados otimizados para LLMs
- **Google Analytics 4** — Eventos customizados para funnel de contratacoes
- **Consent Mode** — LGPD compliance (analytics negado ate consentimento)

---

## Validacao de Campos

Reconhecimento automatico e formatacao padronizada:

| Campo | Formato | Validacao |
|-------|---------|-----------|
| CPF | 000.000.000-00 | Digitos verificadores |
| CNPJ | 00.000.000/0000-00 | Digitos verificadores |
| Telefone | (00) 00000-0000 | DDD + celular/fixo |
| CEP | 00000-000 | 8 digitos |
| Data | dd/mm/aaaa | Validacao de data real |
| Moeda | R$ 0,00 | BRL formatado |
| Email | usuario@dominio.com | RFC 5322 |
| URL | https://... | Protocolo valido |
| Processo | 00000.000000/0000-00 | Formato federal |
| Instagram | @usuario | 1-30 caracteres |
| LinkedIn | linkedin.com/in/... | URL valida |

---

## Conformidade Legal

- Lei 14.133/2021 — Nova Lei de Licitacoes
- LGPD (Lei 13.709/2018) — Protecao de dados
- LINDB (Lei 13.655/2018) — Decisao motivada (Art. 20)
- PL 2.338/2023 — Marco Regulatorio da IA
- Lei 12.846/2013 — Anticorrupcao
- LC 182/2021 — Marco Legal das Startups
- ODS ONU — Alinhado a 6 dos 17 objetivos (5, 9, 10, 12, 16, 17)

---

## Executando Localmente

```bash
npm install
npm run dev
```

Variaveis de ambiente necessarias:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional)

---

## Contato

- **Site:** https://ata360.com.br
- **Plataforma:** https://app.ata360.com.br
- **Email:** contato@ata360.com.br
- **CNPJ:** 61.291.296/0001-31
- **Natureza Juridica:** Empresa Simples de Inovacao (LC 182/2021)

---

*ATA360 TECNOLOGIA LTDA. Todos os direitos reservados.*
