# ATA360 — ESPECIFICAÇÃO TÉCNICA CONSOLIDADA
## Versão 8.0 | Fevereiro 2026
## Sistema de Inteligência em Contratações Públicas

---

# DOCUMENTO DE REFERÊNCIA TÉCNICA ("FONTE DA VERDADE")

> Este documento consolida TODAS as definições técnicas do ATA360.
> Qualquer conflito com specs anteriores (v7.x), este prevalece.
> Atualizado: 08/02/2026 (rev.2 — incorpora handoff Monostate + docs fev/2026)

---

# PARTE 1 — VISÃO DO PRODUTO

## 1.1 O que é o ATA360

Sistema de inteligência em contratações públicas que atende o servidor
de compras **ponta a ponta** — do planejamento à prestação de contas.

**Para o servidor:** duas interfaces simples — **Pesquisas** e **Documentos**.
**Por baixo:** 76+ APIs (29 POC implementadas), 560+ jurisprudencias, 112 artefatos,
LINDB (6 artigos automatizados), cruzamento de recursos federais, pre-validacao Alice,
publicacao automatica, 17 servicos SERPRO ativos (9 contratos + 4 timestamps).

## 1.2 Público-alvo

**Multi-ente federativo:**
- Municípios (prefeituras pequenas, médias e grandes)
- Estados (secretarias e autarquias)
- União (órgãos federais)
- Autarquias, fundações, empresas públicas, SEM

Interface adapta complexidade ao perfil do órgão.
Servidor de prefeitura pequena vê tela simples.
Equipe especializada de órgão federal vê mais opções.

## 1.3 Filosofia "Anti-TCU"

Anti-TCU NÃO É contra o TCU. É o servidor tão blindado que o TCU
**não tem o que questionar**. Cada decisão documentada com:

1. Dados concretos de APIs oficiais (não opinião)
2. Fonte rastreável (ID PNCP, código IBGE, etc.)
3. Jurisprudência favorável (TCU/TCE a favor do servidor)
4. LINDB aplicada (boa-fé + consequências práticas)
5. Alternativas analisadas (decisão não foi arbitrária)
6. Rastreabilidade completa (hash + QR + timestamp)

## 1.4 Princípio da Interface

```
┌─────────────────────────────────────────────────┐
│                                                  │
│  O QUE O SERVIDOR VÊ:                            │
│                                                  │
│  ┌─────────────┐    ┌─────────────┐             │
│  │  PESQUISAS  │    │ DOCUMENTOS  │              │
│  └─────────────┘    └─────────────┘             │
│                                                  │
│  Simples. Limpo. Dois caminhos.                  │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  O QUE RODA POR BAIXO (invisível):              │
│                                                  │
│  30+ APIs · 560+ jurisprudências · 112 artefatos│
│  LINDB · Radar de recursos · Roteador de fluxo  │
│  Pré-validação Alice · Publicação automática     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

# PARTE 2 — STACK TECNOLÓGICO

## 2.1 Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Deploy | **Híbrido** | Core na nuvem (Cloudflare), dados sensíveis no órgão |
| IA | **Agnóstico de modelo** | Abstração para trocar Claude/GPT/Gemini/Llama |
| Infra | **Cloudflare completo** | Edge computing, Workers, R2, D1, KV, Queues |
| Banco relacional | **Supabase** (PostgreSQL) | Auth, RLS, Realtime, Storage, Edge Functions |
| Banco analítico | **ClickHouse** | Séries temporais, analytics de compras, dashboards |
| Frontend | **Next.js 14+ App Router** + shadcn/ui + Tailwind | SSR + edge |
| Backend Framework | **Hono v4** (TypeScript) em Workers | API REST na edge |
| Dados Referencia | **Cloudflare D1** (SQLite) | CATMAT, CATSER, UASGs |
| Documentos/Storage | **Cloudflare R2** | PDFs, metadata, arquivos ATAs/Contratos |
| Indices/Cache | **Cloudflare KV** | Lookup rapido, sessoes, feature flags |
| Fila Async | **Cloudflare Queues** | Geracao PDF, scraping, publicacao |
| Assinatura Digital | **NeoSigner SERPRO** (ICP-Brasil) | 17 servicos SERPRO ativos (9 contratos) |

## 2.2 Stack Detalhado

### Cloudflare (Edge Computing)

| Serviço | Uso no ATA360 |
|---------|---------------|
| **Workers** | API backend (endpoints REST), roteador de fluxo, validações |
| **Workers AI** | Execução de modelos de IA na edge (quando suportado) |
| **Pages** | Frontend (SPA/SSR) hospedado na edge |
| **R2** | Storage de PDFs gerados, anexos, logos dos órgãos |
| **D1** | SQLite na edge para cache local, configs rápidos |
| **KV** | Key-Value para sessões, cache de lookup tables, feature flags |
| **Queues** | Filas para: geração PDF assíncrona, scraping, publicação em portais |
| **Durable Objects** | Estado persistente por processo licitatório |
| **Cron Triggers** | Agendamento de scraping, atualização de índices, alertas |
| **Images** | Processamento de logos, brasões, QR codes |
| **AI Gateway** | Proxy para múltiplos provedores de IA (Claude, GPT, etc.) |
| **Vectorize** | Busca semântica na base jurisprudencial |

### Supabase (PostgreSQL + Auth + Realtime)

| Componente | Uso no ATA360 |
|-----------|---------------|
| **PostgreSQL** | Banco principal: órgãos, usuários, processos, documentos, perfis |
| **Auth** | Autenticação (Gov.BR OAuth, e-mail, SSO institucional) |
| **RLS (Row Level Security)** | Isolamento de dados por órgão (multi-tenant) |
| **Realtime** | Notificações em tempo real (alertas, prazos, aprovações) |
| **Storage** | Backup de documentos, anexos sensíveis |
| **Edge Functions** | Lógica serverless complementar (Deno) |
| **PostgREST** | API automática para CRUD |

### ClickHouse (Analytics)

| Uso | Dados |
|-----|-------|
| **Séries temporais de preços** | Histórico PNCP (milhões de registros) |
| **Analytics de compras** | Dashboards por órgão, região, período |
| **Detecção de padrões** | Fracionamento, sobrepreço, sazonalidade |
| **Benchmarking** | Comparação entre órgãos similares |
| **Radar de oportunidades** | Cruzamento recursos × demandas |
| **Métricas de performance** | Tempo médio por fase, economia gerada |

## 2.3 Arquitetura de Deploy Híbrido

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (Global)                           │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Workers  │  │  Pages   │  │   R2     │  │ AI       │           │
│  │ (API)    │  │ (Front)  │  │ (PDFs)   │  │ Gateway  │           │
│  └────┬─────┘  └──────────┘  └──────────┘  └────┬─────┘           │
│       │                                          │                   │
│       │         ┌──────────┐  ┌──────────┐      │                   │
│       │         │   KV     │  │ Queues   │      │                   │
│       │         │ (cache)  │  │ (filas)  │      │                   │
│       │         └──────────┘  └──────────┘      │                   │
│       │                                          │                   │
│       ▼                                          ▼                   │
│  ┌────────────────────────────────────────────────────┐             │
│  │              SUPABASE (PostgreSQL)                  │             │
│  │  Auth · RLS · Realtime · Storage · Edge Functions   │             │
│  │  Dados: órgãos, usuários, processos, documentos     │             │
│  └────────────────────────────────────────────────────┘             │
│       │                                                              │
│       ▼                                                              │
│  ┌────────────────────────────────────────────────────┐             │
│  │              CLICKHOUSE (Analytics)                  │             │
│  │  Preços históricos · Benchmarking · Detecção padrões│             │
│  │  Séries temporais · Dashboards · Métricas            │             │
│  └────────────────────────────────────────────────────┘             │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  APIS EXTERNAS (30+ fontes oficiais)                                 │
│  PNCP · IBGE · SICONFI · Transfere.gov · FNS · FNDE · BCB          │
│  SINAPI · SICAF · Portal Transparência · Câmara · Planalto         │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PROVEDORES IA (via AI Gateway — agnóstico)                         │
│  Claude (Anthropic) · GPT (OpenAI) · Gemini (Google)               │
│  Llama (Meta/local) · Modelos soberanos (PBIA)                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 2.4 Multi-Tenancy (Isolamento por Órgão)

```sql
-- Supabase RLS: cada órgão só vê seus dados
CREATE POLICY orgao_isolation ON processos
  USING (orgao_id = auth.jwt() -> 'orgao_id');

-- Todos os dados sensíveis isolados por RLS
-- Dados agregados/anonimizados no ClickHouse para benchmarking
```

## 2.5 Modelo Agnóstico de IA

```typescript
// ai-gateway.ts — Abstração de provedor

interface AIProvider {
  generateSuggestion(prompt: string, context: any): Promise<string>;
  analyzecompliance(document: any, checklist: any): Promise<AuditResult>;
}

// Implementações intercambiáveis
class ClaudeProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }
class GeminiProvider implements AIProvider { ... }
class LocalLlamaProvider implements AIProvider { ... }

// Seleção por config do órgão ou fallback automático
const provider = getProvider(orgao.ai_config || 'claude');
```

Roteamento via **Cloudflare AI Gateway**:
- Rate limiting por órgão
- Fallback automático entre provedores
- Logging de custo por chamada
- Cache de respostas similares

---

# PARTE 3 — QUATRO AGENTES

## 3.1 Visão Geral dos Agentes

| Agente | Função | Usa IA? | Modifica docs? | Spec |
|--------|--------|---------|----------------|------|
| **ORQUESTRADOR (Maestro)** | Controle de fluxo, state machine | NAO | NÃO | Part 20 |
| **INSIGHT ENGINE** | Cruza 76+ APIs, recomendações | SIM (agnóstico) | NÃO | Part 3.2 + 14 |
| **ACMA v3** | Gera sugestões de justificativas | SIM (agnóstico) | NÃO (sugestão) | spec 08 + 3.3 |
| **DESIGN LAW v3** | Gera PDF determinístico | NÃO (zero LLM) | SIM (cria) | spec 09 + 3.4 |
| **AUDITOR v3** | Verifica conformidade | HIBRIDO (ver 20.13) | NÃO (read-only) | spec 07 + 3.5 |
| **LEGAL_SYNC** | Monitora DOU, atualiza lookups | NAO | NÃO | Part 20.10 |

```
FLUXO CICLICO (detalhado em Part 20.3):

  Servidor pergunta → INSIGHT ENGINE enriquece com 76+ APIs
                           ↓
  Orquestrador roteia → ACMA gera SUGESTÃO (⚠️ rotulo IA obrigatorio)
                           ↓
  Servidor revisa/aprova → DESIGN LAW gera artefato (PDF)
                           ↓
  PDF gerado → AUDITOR verifica (CONFORME / NÃO CONFORME / RESSALVAS)
                           ↓
  Servidor decide:
    [APROVAR] → Selo + Carimbo + Assinatura → Proximo documento da trilha
    [EDITAR]  → volta ao DESIGN_LAW → AUDITOR reavalia → loop
    [PROSSEGUIR COM ALERTAS] → sem selo, segue → Proximo documento
    [DESCARTAR] → fim

  Loop continua ate APROVADO. Cada iteracao gera novo hash, nova versao.
  Orquestrador gerencia estado e sugere proximo passo da trilha.
```

## 3.2 INSIGHT ENGINE (NOVO — não existia na v7)

Este é o agente que transforma dados brutos em decisões inteligentes.
É o "cérebro" do ATA360. O servidor NÃO interage diretamente com ele —
vê apenas o resultado como cards de recomendação na tela.

### O que faz:

```
ENTRADA: "Preciso comprar 50 notebooks para Secretaria de Educação"

PROCESSAMENTO (invisível, < 5 segundos):

  1. IDENTIFICA o item (CATMAT/CATSER)
  2. CONSULTA preços no PNCP (178 compras similares)
  3. BUSCA ARPs vigentes (3 encontradas)
  4. VERIFICA recursos federais no Transfere.gov/FNDE/FNS
  5. CHECA emendas parlamentares disponíveis
  6. ANALISA orçamento do órgão (SICONFI)
  7. CRUZA com PCA do órgão
  8. VERIFICA impedimentos de fornecedores (CEIS/CNEP)
  9. CALCULA melhor rota (Sicx? Carona? Dispensa? Pregão?)
  10. SELECIONA jurisprudência favorável (TCU/TCE)
  11. APLICA LINDB (Arts. 20, 22, 28)

SAÍDA para o servidor (tela limpa):

  "Recomendo adesão à ARP PE-2025/00234.
   Economia de R$ 19.500 (12% abaixo da mediana PNCP).
   Recurso FNDE/PDDE disponível: R$ 847.000.
   [Gerar documentos]  [Ver detalhes]  [Outra opção]"
```

### APIs consumidas pelo Insight Engine:

| API | Endpoint | Dado | Cache |
|-----|----------|------|-------|
| PNCP | /contratacoes, /contratos, /atas | Preços, ARPs, histórico | 1h (KV) |
| IBGE SIDRA | /t/{tabela}/n6/{municipio} | População, PIB, IDH | 24h (KV) |
| SICONFI | /finbra/... | Orçamento, execução | 24h (KV) |
| Transfere.gov | /api/... | Convênios, repasses, saldos | 6h (KV) |
| FNS | scraping + cache | Blocos SUS, programas saúde | 24h (KV) |
| FNDE | scraping + cache | PDDE, PNAE, PNATE, sal-educação | 24h (KV) |
| FNAS | scraping + cache | SUAS, CRAS, CREAS | 24h (KV) |
| Portal Transparência | /api/... | CEIS, CNEP, emendas | 1h (KV) |
| BCB | /api/... | IPCA, IGP-M, Selic | 24h (KV) |
| SINAPI | download + parse | Custos unitários obras | 30d (R2) |
| Câmara Dados Abertos | /api/... | PLs em tramitação | 24h (KV) |
| Planalto | scraping | Legislação atualizada | 7d (KV) |
| SICAF | API/scraping | Cadastro fornecedores | 1h (KV) |
| Receita Federal | API/scraping | CNPJ, situação cadastral | 24h (KV) |

### Cruzamentos inteligentes:

| Cruzamento | Fontes | Insight |
|-----------|--------|---------|
| PCA × PNCP ARPs | Itens planejados × atas vigentes | "3 itens do PCA têm ARP. Carona economiza R$ 145k" |
| PCA × Transfere.gov | Itens × recursos federais | "Item 12 elegível ao FNDE. Use recurso federal" |
| Orçamento × Execução | SICONFI dotação × % executado | "Rubrica com 66% de saldo. Há espaço" |
| Emendas × PCA | Emendas empenhadas × itens | "Emenda de R$ 200k não executada. Usar antes que cancele" |
| Preços × IPCA | PNCP histórico × inflação BCB | "Preço ARP defasado 8%. Negociar reequilíbrio" |
| Fornecedor × CEIS | CNPJ × impedidos | "Fornecedor incluído no CEIS há 15 dias. NÃO CONTRATAR" |
| Contrato × Vencimento | Vigentes × data | "Contrato TI vence em 45 dias. Iniciar renovação" |
| Compras 12m × Objeto | Histórico × item similar | "Soma = R$ 62k. Próxima = obrigatório licitar" |
| Legislação × Tramitação | Leis × PLs Câmara | "PL pode impactar TIC. Monitorar" |

## 3.3 ACMA Agent v3 (Evoluído)

Mantém as regras da v2 (⚠️ SUGESTÃO, revisão humana obrigatória),
mas agora recebe os insights do Insight Engine como contexto.

### Justificativa blindada — 8 camadas:

```
1. DADO CONCRETO (LINDB Art. 20)
   Fonte: IBGE/PNCP/SICONFI com ID rastreável

2. NECESSIDADE ESPECÍFICA (Lei 14.133 Art. 18, I)
   Dados do órgão + histórico de consumo

3. PESQUISA DE MERCADO (IN 65/2021)
   3+ fontes PNCP + Compras.gov (IN 65/2021)

4. VANTAJOSIDADE DEMONSTRADA (Lei 14.133 Art. 86, §4º)
   Cálculo matemático: economia em R$ e %

5. ALTERNATIVAS ANALISADAS (LINDB Art. 20, parágrafo único)
   Mínimo 3 alternativas com prós/contras

6. JURISPRUDÊNCIA FAVORÁVEL (lookup table auditada)
   TCU/TCE com número de acórdão

7. BLINDAGEM LINDB (Lei 13.655/2018)
   Arts. 20, 21, 22, 28, 30 aplicados conforme caso

8. CONFORMIDADE (checklist automático)
   Todos os itens verificados por regras fixas
```

## 3.4 DESIGN LAW Agent v3 (Mantido)

100% determinístico. Zero LLM. Sem alterações de arquitetura.
Migra de WeasyPrint local para **geração na edge** (Cloudflare Worker).

## 3.5 AUDITOR Agent v3 (Evoluído)

Mantém read-only, agora inclui:
- Simulação de trilhas Alice (CGU)
- Verificação LINDB
- Base jurisprudencial expandida (560+ referências do Manual TCU 2025)

---

# PARTE 4 — ROTEADOR INTELIGENTE DE FLUXO

## 4.1 Lógica de Decisão

O servidor informa O QUE quer comprar. O ATA360 decide COMO.

```
ENTRADA: {item, quantidade, valor_estimado, urgencia, orgao}

DECISÃO (regras fixas, zero LLM):

  if item_padronizado AND disponivel_no_sicx:
      → FLUXO SICX (RSX → Catálogo → Compra → Atesto)
      → Tempo: horas

  elif valor <= limite_contrata_mais AND servico_mei:
      → FLUXO CONTRATA+BRASIL
      → Tempo: dias

  elif valor <= limite_dispensa:
      → CONTRATAÇÃO DIRETA (JCD simplificado)
      → Tempo: dias

  elif existe_arp_vigente_pncp(item):
      → FLUXO CARONA (OFG → AUG → OFF → ACF → ARP)
      → Tempo: 15-30 dias

  elif inviabilidade_competicao:
      → INEXIGIBILIDADE / CREDENCIAMENTO
      → Tempo: 15-30 dias

  elif calamidade_declarada:
      → DISPENSA EMERGENCIAL (Art. 75, VIII)
      → Tempo: imediato (máx 1 ano)

  else:
      if bem_servico_comum:
          → PREGÃO ELETRÔNICO
      elif tecnica_e_preco:
          → CONCORRÊNCIA
      elif obras > limite:
          → CONCORRÊNCIA
      → Tempo: 60-180 dias
```

## 4.2 Valores de Referência 2026 (Dec. 12.807/2025)

```yaml
LIMITES_2026:
  dispensa_obras: 130984.20        # Art. 75, I
  dispensa_bens_servicos: 65492.10 # Art. 75, II
  contrata_mais_mei: 12545.11      # Art. 95
  concorrencia_obras: 3500000.00   # referência
  sicx: pendente_regulamento       # Lei 15.266/2025

  # Atualizados anualmente pelo IPCA-E (Art. 182)
```

## 4.3 Fluxos por Caminho

### Sicx (Lei 15.266/2025)
RSX → Catálogo Sicx → Seleção → Compra → Atesto → Publicação PNCP
(3 artefatos | horas)

### Contrata+Brasil (IN 52/2025)
Demanda → Plataforma → Propostas MEI → Seleção → Ordem Serviço
(3 artefatos | dias)

### Dispensa (Art. 75)
JCD → PP simplificada → Parecer Jurídico → Contrato/OCS → Publicação
(5 artefatos | dias)

### Carona ARP (Art. 86)
DFD → PP → OFG → AUG → OFF → ACF → ARP → Contrato → Publicação
(9 artefatos | 15-30 dias)

### Credenciamento (Art. 79 + Dec. 11.878/2024)
ETP → TR → Edital Credenciamento → Habilitação → Contrato
(5 artefatos | 30 dias)

### Emergência (Art. 75, VIII)
Decreto → JDE → PPE → PJE → Contrato Emergencial → Prestação Contas
(7 artefatos | imediato, máx 1 ano)

### Pregão Eletrônico (Art. 28, I)
PCA → DFD → ETP → PP → TR → MR → Edital → Sessão → Contrato → Publicação
(12+ artefatos | 60-180 dias)

---

# PARTE 5 — CATÁLOGO DE ARTEFATOS (112)

## 8 Fases do Ciclo de Compras Públicas

### FASE 1 — Planejamento da Contratação (3 artefatos)
PCA, CAL, PGC

### FASE 2 — Instrução Processual (19 artefatos)
DFD, ETP (genérico + TIC + Saúde + Obras + Defesa), PP, TR (genérico + TIC + Saúde + Obras),
PB, PE, MR, JCD, ANT, ORC, CRN, ART, DOR, CCH, PAR-T

### FASE 3 — Seleção do Fornecedor (25 artefatos)
EDT-PE, EDT-CC, EDT-CO, EDT-LE, EDT-DC, AVE, ADP, MCT, PJE, APE,
RIL, RPE, ATA-S, JLG, HAB, ADJ, HOM, REV-L,
OFG, AUG, OFF, ACF, COM, REC, ARP

### FASE 4 — Contratação (12 artefatos)
CTR-S, CTR-F, CTR-O, CTR-L, CTR-C, OCS, NE, GAR, PUB, DPO, PTG, PTF

### FASE 5 — Execução e Fiscalização (11 artefatos)
PLF, RMF, RAF, NTO, ADF, TRP, TRD, MED, DIE, GLO, LIQ

### FASE 6 — Alterações Contratuais (8 artefatos)
TAD, APT, REP, REQ, ACR, SUP, PRR, PJA

### FASE 7 — Sanções e Recursos (8 artefatos)
NIS, DAP, DSA, RAD, CRA, DRA, REV, RPC

### FASE 8 — Encerramento e Prestação de Contas (9 artefatos)
TEC, EXT, RES, LIG, QUI, RGA, PRC, ARC, RTI

### Modalidades Especiais (+17 artefatos)
Calamidade: DCE, JDE, PPE, PJE-E, CDE, RCE, PCE
Credenciamento: ECR, TCR, ACR-C, CCR, DCR
Sicx: RSX, CSX, ASX, REG-SX
PBIA: RIA

### TOTAL: ~112 artefatos

Cada artefato possui as 15 características core:
1. Checklist de conformidade
2. Fundamentação legal (lookup table)
3. QR Code
4. Rastreabilidade (ID + hash + vínculos)
5. Controle de versões
6. Carimbo do tempo
7. Assinatura digital (ICP-Brasil / GOV.BR)
8. Selo ATA360
9. Edição de campos
10. Auditor (verificação read-only)
11. Dados históricos (APIs)
12. Dados do usuário/membro
13. Capítulos e tópicos numerados
14. Auto-revisão (ACMA + Auditor)
15. Layout moderno e limpo

---

# PARTE 6 — BASE LEGAL COMPLETA

## 6.1 Legislação Primária

| Norma | Cobertura |
|-------|-----------|
| CF/88 | Arts. 37, 70, 165, 169 |
| Lei 14.133/2021 | ~200 artigos (cobertura total) |
| Lei 15.266/2025 | Sicx (Art. 79, IV) |
| Lei 13.655/2018 | LINDB (Arts. 20-30) |
| Lei 4.320/1964 | Empenho, liquidação, pagamento |
| Lei 12.527/2011 | LAI (transparência) |
| Lei 13.709/2018 | LGPD |
| Lei 12.846/2013 | Anticorrupção |
| LC 101/2000 | LRF |
| LC 123/2006 | ME/EPP |

## 6.2 Regulamentação

| Norma | Tema |
|-------|------|
| Dec. 10.947/2022 | PCA e DFD |
| Dec. 11.462/2023 | SRP/ARP |
| Dec. 11.878/2024 | Credenciamento |
| Dec. 12.807/2025 | Valores atualizados 2026 |
| Dec. 7.983/2013 | SINAPI/SICRO |
| IN SEGES/ME 58/2022 | ETP |
| IN SEGES/ME 65/2021 | Pesquisa de preços |
| IN SEGES/ME 67/2021 | Habilitação/SICAF |
| IN SGD/ME 94/2022 | TIC |
| IN SEGES 73/2022 | Gestão contratual |
| IN SEGES/MGI 52/2025 | Contrata+Brasil |

## 6.3 LINDB — Blindagem do Gestor

| Artigo | Proteção | Aplicação no ATA360 |
|--------|----------|---------------------|
| Art. 20 | Decisão não baseada em valores abstratos | Dados concretos de APIs em toda justificativa |
| Art. 21 | Regime de transição p/ nova interpretação | Alerta quando jurisprudência muda |
| Art. 22 | Consequências práticas consideradas | Seção obrigatória de impacto em todo doc |
| Art. 23 | Regime de transição quando nova orientação | Rastreamento de mudanças TCU |
| Art. 24 | Revisão só com consideração de consequências | Documentação robusta dificulta anulação |
| Art. 28 | Responsabilidade só por dolo/erro grosseiro | Decisão fundamentada ≠ erro grosseiro |
| Art. 30 | Regulação proporcional e transparente | Checklist de proporcionalidade |

## 6.4 Jurisprudência (Manual TCU 5ª Ed. Agosto/2025)

Base expandida: ~560 referências organizadas por tema.
Fonte: Manual interativo (licitacoesecontratos.tcu.gov.br)
Inclui 46 novos acórdãos (2023-2024) do Manual TCU 2025.

Estrutura no ClickHouse:
```sql
CREATE TABLE jurisprudencia (
  id UInt64,
  orgao String,           -- TCU, TCE-MG, TCE-SP, CGU, AGU, STJ
  tipo String,            -- acordao, sumula, orientacao, parecer
  numero String,          -- "2.622/2015-P"
  colegiado String,       -- Plenário, 1ª Câmara, 2ª Câmara
  relator String,
  ementa String,
  tese String,            -- tese jurídica extraída
  tags Array(String),     -- [fracionamento, planejamento, ...]
  documentos Array(String), -- [DFD, ETP, TR, ...]
  data_julgamento Date,
  fonte String,           -- Manual TCU 2025, site TCU, etc.
  ativo Bool DEFAULT true
) ENGINE = MergeTree()
ORDER BY (orgao, tipo, data_julgamento);
```

## 6.5 Pré-validação Alice

Trilhas da CGU simuladas ANTES da publicação:

| Trilha | Regra | Artigo |
|--------|-------|--------|
| Prazo mínimo | Pregão ≥ 8 dias úteis, Concorrência ≥ 35 dias | Art. 55 |
| Fontes de preço | Mínimo 3 fontes válidas | IN 65/2021 Art. 5º |
| Restrição competição | Sem exigências desproporcionais | Art. 62-70 |
| Sobrepreço | Preço ≤ 130% mediana PNCP | IN 65/2021 |
| Direcionamento | Sem marca específica sem justificativa | Súmula TCU 177 |
| Fracionamento | Soma 12 meses ≤ limite dispensa | TCU 2.622/2015-P |

---

# PARTE 7 — INTEGRAÇÕES E PUBLICAÇÃO

## 7.1 APIs de Entrada (Ingestão)

Todas as chamadas passam por Cloudflare Workers com cache em KV.

| API | Tipo | Frequência de sync |
|-----|------|-------------------|
| PNCP | REST (Swagger) | Horária |
| IBGE SIDRA | REST | Diária |
| SICONFI | REST | Diária |
| Transfere.gov | REST | 6h |
| FNS | Scraping → Cloudflare Queue | Diária |
| FNDE | Scraping → Cloudflare Queue | Diária |
| FNAS | Scraping → Cloudflare Queue | Diária |
| Portal Transparência | REST | Horária |
| BCB | REST | Diária |
| SINAPI/SICRO | Download CSV → R2 → parse | Mensal |
| Câmara Dados Abertos | REST | Diária |
| SICAF | API/Scraping | Horária |
| Receita Federal (CNPJ) | API/Scraping | Sob demanda |

## 7.2 Publicação Automática (Saída)

| Portal | Método | Dados |
|--------|--------|-------|
| PNCP | REST API (POST) | JSON + PDF anexo |
| Diário Oficial | Texto formatado (e-mail/API) | Extrato gerado automaticamente |
| Portal Transparência | REST/CSV | Dados abertos |
| Compras.gov.br | Integração SIASG | Pregões federais |
| Sicx | API (quando regulamentado) | Catálogo + demanda |
| Contrata+Brasil | Integração SIASG | Demandas MEI |

## 7.3 Importação de Dados (CSV/XLSX)

| Tipo | Campos | Destino |
|------|--------|---------|
| Planilha de itens | descrição, CATMAT, qtd, valor | PCA, DFD, TR |
| Preços coletados | fornecedor, CNPJ, preço, data | PP |
| Planilha orçamentária | dotação, programa, ação, saldo | PCA, DFD |
| Lista de servidores | nome, matrícula, cargo | Assinaturas, portarias |
| Contratos vigentes | dados contratuais | Aditivos, renovações |

---

# PARTE 8 — MODELO DE DADOS (Supabase)

## Tabelas Principais

```sql
-- Órgãos (multi-tenant)
CREATE TABLE orgaos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  uf CHAR(2),
  municipio_ibge INTEGER,
  tipo TEXT, -- municipal, estadual, federal
  cor_primaria TEXT DEFAULT '#1e3a5f',
  cor_secundaria TEXT DEFAULT '#2c5282',
  logo_url TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Usuários (vinculados a órgão)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  orgao_id UUID REFERENCES orgaos(id),
  nome TEXT NOT NULL,
  matricula TEXT,
  cargo TEXT,
  papel TEXT, -- servidor, gestor, autoridade, admin
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Processos (ciclo de vida da contratação)
CREATE TABLE processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),
  numero TEXT NOT NULL,
  objeto TEXT,
  valor_estimado NUMERIC(15,2),
  modalidade TEXT, -- pregao, concorrencia, dispensa, carona, sicx, credenciamento, emergencia
  fase TEXT, -- planejamento, instrucao, selecao, contratacao, execucao, alteracao, sancao, encerramento
  status TEXT DEFAULT 'em_andamento',
  rota_sugerida TEXT, -- fluxo recomendado pelo roteador
  contexto JSONB DEFAULT '{}', -- dados compartilhados entre documentos
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documentos (artefatos gerados)
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id UUID REFERENCES processos(id),
  orgao_id UUID REFERENCES orgaos(id),
  tipo TEXT NOT NULL, -- DFD, ETP, TR, etc.
  numero TEXT,
  versao INTEGER DEFAULT 1,
  dados JSONB NOT NULL, -- campos preenchidos
  pdf_url TEXT, -- R2 storage
  hash_sha256 TEXT,
  status TEXT DEFAULT 'rascunho', -- rascunho, revisao, aprovado, publicado
  publicado_pncp BOOLEAN DEFAULT false,
  publicado_diario BOOLEAN DEFAULT false,
  auditoria JSONB, -- resultado do Auditor Agent
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES usuarios(id)
);

-- Insights (recomendações do Insight Engine)
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),
  processo_id UUID REFERENCES processos(id),
  tipo TEXT, -- recurso_federal, arp_vigente, alerta_vencimento, oportunidade, risco
  titulo TEXT,
  descricao TEXT,
  dados JSONB, -- dados completos do insight
  fontes JSONB, -- APIs consultadas com IDs
  acao_sugerida TEXT,
  status TEXT DEFAULT 'novo', -- novo, visualizado, aceito, descartado
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sugestões ACMA (com auditoria)
CREATE TABLE sugestoes_acma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_id UUID REFERENCES documentos(id),
  secao INTEGER,
  texto_original TEXT,
  texto_final TEXT,
  hash_original TEXT,
  hash_final TEXT,
  foi_editado BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pendente', -- pendente, aprovado, rejeitado
  aprovado_por UUID REFERENCES usuarios(id),
  aprovado_em TIMESTAMPTZ,
  fontes JSONB, -- APIs usadas com IDs rastreáveis
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recursos federais rastreados
CREATE TABLE recursos_federais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),
  fonte TEXT, -- FNDE, FNS, FNAS, Transfere.gov, emenda
  programa TEXT,
  valor NUMERIC(15,2),
  valor_executado NUMERIC(15,2) DEFAULT 0,
  prazo_adesao DATE,
  prazo_execucao DATE,
  status TEXT, -- disponivel, em_execucao, subutilizado, encerrado
  elegivel_para JSONB, -- categorias de item compatíveis
  dados_raw JSONB,
  atualizado_em TIMESTAMPTZ DEFAULT now()
);
```

---

# PARTE 9 — ROADMAP DE IMPLEMENTAÇÃO

## Prioridade 1 (Fundação)
- [ ] Setup Cloudflare Workers + Supabase + Auth
- [ ] Modelo de dados (tabelas acima)
- [ ] Multi-tenancy com RLS
- [ ] Migração dos 20 templates existentes
- [ ] API de geração de PDF (Design Law na edge)

## Prioridade 2 (Inteligência)
- [ ] Integração PNCP API (consulta + publicação)
- [ ] Insight Engine (cruzamento de dados)
- [ ] Roteador inteligente de fluxo
- [ ] ACMA Agent v3 (agnóstico de modelo via AI Gateway)

## Prioridade 3 (Escala)
- [ ] Templates das fases 3-8 (editais, contratos, fiscalização, etc.)
- [ ] Base jurisprudencial expandida (560+ no ClickHouse)
- [ ] Pré-validação Alice
- [ ] Integração Transfere.gov/FNS/FNDE (radar de recursos)

## Prioridade 4 (Automação)
- [ ] Publicação automática PNCP + Diário Oficial
- [ ] Sicx (quando regulamentado)
- [ ] Contrata+Brasil
- [ ] Monitoramento pós-publicação (alertas, prazos)
- [ ] Dashboards analytics (ClickHouse)

---

# PARTE 10 — GARANTIAS DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GARANTIAS ATA360 v8                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ✅ Design Law Agent: Zero LLM, 100% determinístico                │
│  ✅ Mesmo input = Mesmo output, SEMPRE                              │
│  ✅ Fundamentação legal de lookup tables auditadas                  │
│  ✅ Justificativas com 8 camadas de blindagem                       │
│  ✅ LINDB aplicada automaticamente                                  │
│  ✅ Pré-validação Alice antes de publicar                           │
│  ✅ IA agnóstica de modelo (Claude/GPT/Gemini/Llama)               │
│  ✅ Sugestões SEMPRE com revisão humana obrigatória                 │
│  ✅ Auditor NUNCA modifica documentos                               │
│  ✅ Multi-tenant com isolamento RLS por órgão                       │
│  ✅ Hash SHA-256 + QR + rastreabilidade em todo documento           │
│  ✅ Deploy híbrido (edge + dados sensíveis no órgão)                │
│  ✅ 112 artefatos cobrindo 8 fases do ciclo de compras             │
│  ✅ 30+ APIs oficiais para dados concretos                          │
│  ✅ Custo: R$ 0,01/doc (Design Law) + ~R$ 0,08/sugestão (ACMA)    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

---

# PARTE 11 — INFRAESTRUTURA EXISTENTE (PoC + Handoff)

## 11.1 PoC Implementada (Cloudflare Workers)

URL: `pncp-ata360.monostateorg.workers.dev/ui`

| Componente | Status | Dados |
|-----------|--------|-------|
| Workers (Hono) | 29 endpoints PNCP operacionais | Consulta atas, contratos, itens, precos |
| D1 (SQLite) | 337K CATMAT + 35K CATSER + 1.2K UASGs | Catalogo completo |
| ClickHouse | 1.4M+ itens unificados (ARP + Contratos) | Series temporais |
| KV | Cache 24h TTL | Respostas PNCP |
| R2 | Armazenamento PDFs | Templates renderizados |
| Cron Triggers | Sync agendado | PNCP, CATMAT, CATSER |

## 11.2 Handoff Monostate v7.1 (31/jan/2026)

Entregue a Monostate AI Models Development Corporation:

| Entrega | Qtd | Status |
|---------|-----|--------|
| Specs agentes (AUDITOR, ACMA, DESIGN_LAW) | 3 | Identico v7.1 |
| Templates HTML (gerais, TIC, saude, obras, ARP) | 21 | Identico v7.1 |
| Templates PDF renderizados | 20 | Adicionado no handoff |
| Config YAML (lookup tables) | 1 (822 linhas) | Identico v7.1 |
| Exemplos preenchidos (Serra da Saudade/MG) | 5 | Adicionado no handoff |
| CSS Design System v1.1 | 1 (169 linhas) | Identico v7.1 |

**NOTA:** O handoff NAO incluiu `generator.py` nem esta spec v8.
Os configs (YAML, CSS, HTML base) nao foram modificados durante o empacotamento.

## 11.3 SERPRO — 9 Contratos / 13 APIs + 4 Timestamps = 17 Servicos

### APIs Principais (13)

| # | Servico | Contrato | Endpoint | Uso |
|---|---------|----------|----------|-----|
| 1 | CONSULTA NFe | 266253 | gateway.apiserpro.serpro.gov.br | Notas fiscais |
| 2 | CONSULTA CNPJ v2 | 266287 | .../consulta-cnpj/v2/{cnpj} | Dados RFB |
| 3 | CNPJ Check Timestamp | 266287 | .../consulta-cnpj/v2/{cnpj}/timestamp | Validacao temporal CNPJ |
| 4 | CONSULTA CPF v2 | 266310 | .../consulta-cpf/v2/{cpf} | Validacao pessoas |
| 5 | CPF Check Timestamp | 266310 | .../consulta-cpf/v2/{cpf}/timestamp | Validacao temporal CPF |
| 6 | DATAVALID v4 | 266318 | .../datavalid/v4 | Biometria PF/PJ |
| 7 | DATAVALID v4 Timestamp | 266318 | .../datavalid/v4/timestamp | Validacao temporal biometria |
| 8 | CONSULTA DIVIDA ATIVA | 266324 | gateway.apiserpro... | Debitos |
| 9 | CONSULTA CND | 266331 | gateway.apiserpro... | Certidoes negativas |
| 10 | CND Check Timestamp | 266331 | gateway.apiserpro.../timestamp | Validacao temporal CND |
| 11 | CONSULTA FATURAMENTO | 266334 | gateway.apiserpro... | Faturamento |
| 12 | API CARIMBO DE TEMPO | 266338 | act.serpro.gov.br/tsp | Prova temporal (~R$0,05/carimbo) |
| 13 | API CONSULTA RENDA | 266343 | gateway.apiserpro... | Dados renda |

### Timestamps Dedicados (4)

| # | Timestamp | Contrato Base | Funcao |
|---|-----------|--------------|--------|
| 1 | CNPJ Check Timestamp | 266287 | Prova temporal de consulta CNPJ |
| 2 | CPF Check Timestamp | 266310 | Prova temporal de consulta CPF |
| 3 | DATAVALID v4 Timestamp | 266318 | Prova temporal de validacao biometrica |
| 4 | CND Check Timestamp | 266331 | Prova temporal de certidao negativa |

**TOTAL: 13 APIs + 4 Timestamps = 17 servicos ativos em 9 contratos**

### Servicos Complementares

| Servico | URL | Custo |
|---------|-----|-------|
| Validador ICP-Brasil | validar.iti.gov.br/api/ | Gratuito |
| NeoSigner | loja.serpro.gov.br/neosigner | Por assinatura |
| Conecta Gov.br | sso.staging.acesso.gov.br | Gratuito |

### Aguardando Ativacao

| Servico | Status |
|---------|--------|
| VIO QR CODE | Aguardando |
| E-FROTA | Aguardando |

## 11.4 APIs Governamentais — 76+ Endpoints Mapeados

| Fonte | Endpoints | Status | Auth |
|-------|-----------|--------|------|
| PNCP | 29 | POC implementada | API Key (write), publico (read) |
| Compras.gov.br (SIASG) | 8 | Documentado | Publico |
| Portal Transparencia | 10 | Documentado | API Key, 90 req/min |
| TransfereGov | 6 | Documentado | Publico (query) |
| FNS | 5 | Documentado | Publico |
| FNDE | 5 programas | Documentado | Publico |
| IBGE | 4 | Documentado | Publico |
| Camara/Senado | 6 | Documentado | Publico |
| TCU | 2 | Documentado | Publico |
| SERPRO | 17 (13 APIs + 4 timestamps) | Contratado (9 contratos) | Cert + API Key |

**Diferencial:** `quantidadeEmpenhada` do Compras.gov.br (saldo real das ARPs).
Formula: `SALDO = quantidadeHomologada - quantidadeEmpenhada`

---

# PARTE 12 — DOCUMENTOS ESTRATEGICOS (Fev 2026)

## 12.1 Stack Definitivo (RESOLVIDO 08/fev/2026)

**DISCREPANCIA RESOLVIDA:** O Backend Instructions Monostate v1 nao mencionava Supabase.
O CEO (Roberto) confirmou: **spec original prevalece**. Supabase faz parte do stack.

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| **API/Backend** | Cloudflare Workers + Hono v4 (TypeScript) | Processamento na edge |
| **Dados Referencia** | Cloudflare D1 (SQLite) | CATMAT, CATSER, UASGs |
| **Documentos/Storage** | Cloudflare R2 | Metadata, arquivos ATAs/Contratos, PDFs |
| **Indices/Cache** | Cloudflare KV | Lookup rapido, sessoes, feature flags |
| **Analytics** | ClickHouse Cloud | Items unificados (1.4M+), series temporais, benchmarking |
| **Fila Async** | Cloudflare Queues + Cron Triggers | Geracao PDF, scraping, publicacao |
| **Relacional + Auth** | **Supabase** (PostgreSQL) | Auth Gov.br, RLS multi-tenant, Realtime, Edge Functions |
| **Frontend** | Next.js 14+ App Router + shadcn/ui + Tailwind | SSR + edge |
| **Icons** | Lucide React | - |
| **Charts** | Recharts | Dashboards |
| **Theme** | next-themes (light/dark/system) | - |
| **IA (agnóstico)** | Cloudflare AI Gateway | Haiku 80%, Sonnet 15%, Opus 5% + failover Gemini/Mistral |
| **Embeddings** | OpenAI text-embedding-3-small | Busca semantica |
| **Busca vetorial** | Cloudflare Vectorize | Embeddings CATMAT/CATSER + jurisprudencia |
| **Auth** | Gov.br OAuth2 via Supabase Auth | SSO governamental |
| **Assinatura** | NeoSigner SERPRO (ICP-Brasil) | Assinatura digital |
| **Carimbo** | SERPRO Carimbo do Tempo | Prova temporal |
| **Deploy Frontend** | Cloudflare Pages (ou Vercel) | - |

**Resumo da decisao:** Cloudflare faz a edge (Workers, D1, R2, KV, Queues, AI Gateway, Vectorize).
Supabase faz o relacional + auth + multi-tenancy (PostgreSQL, RLS, Realtime).
ClickHouse faz analytics pesado (precos, series temporais, dashboards).

## 12.2 LINDB — 6 Artigos Automatizados

O Adendo LINDB define como cada artigo da Lei 13.655/2018 e aplicado:

| Artigo | Protecao | Automacao ATA360 |
|--------|----------|-----------------|
| Art. 20 | Decisao nao baseada em valores abstratos | Dados concretos de APIs em toda justificativa |
| Art. 21 | Regime de transicao proporcional | Alerta quando jurisprudencia muda |
| Art. 22 | Considerar dificuldades reais do gestor | Secao de contexto local obrigatoria |
| Art. 23 | Regime de transicao para mudancas de lei | Rastreamento mudancas TCU |
| Art. 28 | Responsabilizacao so com dolo/erro grosseiro | Decisao fundamentada != erro grosseiro |
| Art. 30 | Compensacao por invalidade retroativa | Registro completo da cadeia de decisao |

## 12.3 Localizacao de Recursos Publicos

Monitoramento automatico de recursos via Cron Triggers:

| Fonte | Tipo | Dados Monitorados |
|-------|------|-------------------|
| TransfereGov | Convenios | Valor, status, prazo, % executado |
| FNS | Saude | Blocos PAB/MAC/VIGIL/FARM/GEST |
| FNDE | Educacao | PNAE, PDDE, PNATE, FUNDEB, PROINFANCIA |
| Portal Transparencia | Emendas | Individual, bancada, comissao |
| Camara/Senado | Emendas | Parlamentar, valor, status |
| SIGA Brasil | Orcamento | Dotacao, empenho, liquidacao, pagamento |

**Rastro do dinheiro (6 etapas):**
Emenda → Convenio → Empenho → OB → Credito → Prestacao de Contas

**Chaves de cruzamento:** Codigo IBGE (7 dig), CNPJ (14 dig), Num Convenio (6 dig),
Cod Emenda, Num Empenho, Num OB, Cod UASG, numeroControlePncp

## 12.4 Transparencia Algoritmica vs Segredo Industrial

Modelo de 3 camadas para o TCU:

| Camada | Visibilidade | Conteudo |
|--------|-------------|----------|
| **Publica** | Total | Lookup tables, fundamentacao legal, checklist, rastreabilidade |
| **Restrita** | TCU/Auditor sob demanda | Parametros de IA, prompts, pesos de decisao |
| **Protegida** | Segredo industrial | Codigo-fonte, modelos treinados, arquitetura interna |

Sala de Auditoria: ambiente read-only onde TCU pode inspecionar o fluxo sem acessar IP.

## 12.5 Pipeline de Normalizacao e Vetorizacao

Classificacao semantica de itens (185K CATMAT/CATSER):

| Etapa | Descricao |
|-------|-----------|
| Normalizacao (4 camadas) | Lowercase, correcao ortografica (Levenshtein <=2), expansao abreviacoes, stemming |
| Dicionario marcas | Bombril→esponja de aco, Xerox→fotocopia, Band-Aid→curativo adesivo |
| Regionalismos | mandioca/macaxeira/aipim, pao frances/cacetinho, biscoito/bolacha |
| Contexto entidade | MATCH_SCORE = term_relevance*0.40 + entity_activity*0.30 + history*0.20 + region*0.10 |
| Vetorizacao | BERT 768-dim embeddings + metadados estruturados |
| Busca hibrida | SCORE = 0.4*text + 0.4*semantic + 0.2*context |
| Confianca | Se < 80%: pergunta ao usuario |

## 12.6 Go-to-Market

Funil: PCA Gratis → Trial 14d → Contratacao pelo proprio sistema

| Etapa | Conversao | Volume |
|-------|-----------|--------|
| 5.570 municipios | Base total | - |
| Responderam | 10% | 557 |
| Geraram PCA | 80% | 445 |
| Iniciaram trial | 50% | 222 |
| Converteram | 60% | 133 |

**Meta ano 1:** 100-150 clientes, R$ 3.9M-5.8M receita
**Preco:** R$ 38.900/ano
**87% por dispensa** (abaixo de R$ 65.492,11 — Art. 75, II)

## 12.7 Dashboard SuperADM

7 abas: Visao Geral, Usuarios/Membros, Consumo/Custos, APIs/Infra,
Producao/Artefatos, Recursos Publicos, Rankings/Inteligencia

Tech: React + Tailwind + Recharts + Lucide React
KPIs: Orgaos ativos, membros online, pesquisas/dia, docs/mes, tokens/mes, MRR

---

# PARTE 13 — MAPA DE GAP (PoC → v8 FINAL)

## O que EXISTE e FUNCIONA

| Componente | Status | Onde |
|-----------|--------|------|
| 29 endpoints PNCP | Operacional | Cloudflare Workers |
| 337K itens CATMAT/CATSER | Populado | D1 |
| 1.4M+ itens precos | Populado | ClickHouse |
| 21 templates HTML | Pronto | v7.1 + Handoff |
| 20 PDFs renderizados | Pronto | Handoff |
| Config YAML (14 docs) | Pronto | v7.1 |
| CSS Design System v1.1 | Pronto | v7.1 |
| 3 specs agentes | Pronto | v7.1 |
| generator.py (Design Law) | Pronto (Python) | v7.1 |
| 17 servicos SERPRO (9 contratos) | Ativos | Contratos assinados |
| 76+ endpoints documentados | Mapeados | Docs fev/2026 |
| 5 exemplos preenchidos | Pronto | Handoff |
| Pipeline normalizacao | Spec completa | Doc Monostate |
| Glossarios/regionalismos | CSV + DOCX + JSON | claude pasta teste |

## O que PRECISA SER CONSTRUIDO

| Componente | Prioridade | Dependencia |
|-----------|------------|-------------|
| **Frontend Next.js** (UI completa) | P0 | Stack frontend definido |
| **Auth Gov.br OAuth2** | P0 | Frontend + Workers |
| **Multi-tenancy** (RLS ou equivalente) | P0 | DB relacional definido |
| **Orquestrador** (coordenacao agentes) | P0 | Workers |
| **ACMA Agent** (TypeScript, nao C#) | P0 | AI Gateway |
| **AUDITOR Agent** (TypeScript) | P0 | Lookup tables |
| **Design Law na edge** (Workers, nao Python) | P0 | R2 + templates |
| **Insight Engine** (cruzamento dados) | P1 | 76+ APIs |
| **LEGAL_SYNC Agent** | P1 | DOU monitoring |
| **Cloudflare Vectorize** (embeddings) | P1 | Normalizacao pipeline |
| **Roteador inteligente** (fluxo) | P1 | Regras fixas |
| **Publicacao PNCP** (POST) | P1 | Auth PNCP |
| **Templates fases 3-8** (92 restantes) | P2 | YAML + HTML |
| **Base 560+ jurisprudencias** | P2 | ClickHouse |
| **Pre-validacao Alice** | P2 | AUDITOR + regras |
| **Radar recursos federais** | P2 | TransfereGov/FNS/FNDE |
| **Dashboard SuperADM** | P2 | Recharts + dados |
| **Publicacao Diario Oficial** | P3 | API/e-mail |
| **Sicx** | P3 | Regulamentacao pendente |
| **Contrata+Brasil** | P3 | IN 52/2025 |

## DECISOES RESOLVIDAS (08/fev/2026)

| Decisao | Resolucao | Justificativa |
|---------|-----------|---------------|
| **DB relacional** | **Supabase** (Auth+RLS+Realtime) | Decisao CEO. Auth Gov.br + multi-tenant RLS |
| **DB analytics** | **ClickHouse Cloud** | 1.4M+ registros, series temporais |
| **Dados referencia** | **Cloudflare D1** | CATMAT/CATSER/UASGs (SQLite edge) |
| **Cache/indices** | **Cloudflare KV** | Lookup rapido, sessoes |
| **Storage** | **Cloudflare R2** | PDFs, arquivos, metadata |
| **Fila async** | **Cloudflare Queues** | Geracao PDF, scraping, publicacao |
| **Busca vetorial** | **Cloudflare Vectorize** | Dentro do ecossistema CF |
| **AI** | **Cloudflare AI Gateway** | Agnostico, fallback automatico |

## DECISOES AINDA PENDENTES

| Decisao | Opcoes | Impacto |
|---------|--------|---------|
| **generator.py → edge** | Worker + Puppeteer/Chromium vs Worker + HTML→PDF lib | Geracao PDF na edge |
| **Deploy frontend** | Cloudflare Pages vs Vercel | SSR, build, DX |

---

# PARTE 14 — RADAR DE RECURSOS PUBLICOS (MODULO CRITICO)

> Este modulo e o principal diferencial do ATA360. Transforma dados dispersos em
> 15+ fontes governamentais em alertas acionaveis para o servidor de compras.
> O servidor ve apenas: "Recurso disponivel de R$ 847.000 do FNDE para educacao.
> Prazo: 120 dias. [Captar agora]"

## 14.1 Categorias de Recurso Monitoradas

| Categoria | Status | Definicao | Acao ATA360 |
|-----------|--------|-----------|-------------|
| **DISPONIVEL** | Recurso creditado, nao empenhado | Dinheiro na conta, pronto para uso | Alerta + sugestao de item do PCA |
| **ELEGIVEL** | Programa aberto, municipio qualificado | Pode aderir/captar, ainda nao fez | Alerta + roteiro de adesao |
| **SUBUTILIZADO** | Empenhado mas < 60% executado | Risco de devolucao | Alerta urgente + aceleracao |
| **EM EXECUCAO** | Empenhado e em andamento normal | Acompanhamento rotineiro | Monitoramento de prazos |
| **PERDIDO/DEVOLVIDO** | Prazo expirou, recurso retornou | Historico para nao repetir | Relatorio + alerta preventivo |
| **EM RISCO** | Prazo < 90 dias, execucao < 40% | Provavel perda se nao agir | Alerta CRITICO |
| **HISTORICO** | Anos anteriores (2020-2025) | Padrao de captacao do municipio | Baseline para insights |

## 14.2 Fontes de Dados por Tipo de Recurso

### A) EMENDAS PARLAMENTARES

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **Portal Transparencia** | `GET /api-de-dados/emendas?ano={}&codigoIBGE={}` | Autor, tipo, valor, funcao | 1x/dia |
| **Portal Transparencia** | `GET /api-de-dados/emendas/documentos?codigoEmenda={}` | Empenhos, liquidacoes, pagamentos | 1x/dia |
| **Camara Deputados** | `GET /api/v2/deputados/{id}` | Deputado, partido, UF, gabinete | 1x/semana |
| **SIGA Brasil (Senado)** | Portal scraping | Execucao por emenda, favorecido | 1x/dia |
| **Painel Emendas Senado** | Portal scraping | Tipo (individual/bancada/comissao/relator), execucao | 1x/dia |

**Tipos de emenda monitorados:**
- Individual (RP6): R$ 26,2M/parlamentar/ano (2026)
- De bancada (RP7): Valor variavel por UF
- De comissao (RP8): Valor variavel
- De relator (RP9): Suspenso desde 2022, monitorar retomada
- Transferencias especiais (Emendas PIX): Execucao direta

**Campos criticos rastreados:**
```
emenda_id, autor, tipo_emenda, valor_empenhado, valor_liquidado,
valor_pago, valor_restos_a_pagar, funcao, subfuncao, programa,
acao, favorecido_cnpj, favorecido_nome, municipio_ibge, ano
```

**Insights gerados:**
- "Emenda individual de R$ 500k do Dep. [X] para saude. Nao executada. Captar!"
- "Bancada [UF] tem R$ 3.2M empenhados, R$ 800k pagos. 75% em risco."
- "Municipio perdeu R$ 1.2M em emendas em 2024 por nao prestar contas."

### B) CONVENIOS E TRANSFERENCIAS VOLUNTARIAS

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **TransfereGov** | `GET /convenios?uf={}&municipio={}` | Lista convenios com status | 2x/dia |
| **TransfereGov** | `GET /convenios/{id}` | Plano de trabalho, metas, cronograma | Sob demanda |
| **TransfereGov** | `GET /convenios/{id}/cronograma` | Parcelas previstas vs liberadas | 2x/dia |
| **TransfereGov** | `GET /convenios/{id}/empenhos` | Empenhos vinculados ao convenio | 1x/dia |
| **TransfereGov** | `GET /convenios/{id}/pagamentos` | Pagamentos realizados | 1x/dia |
| **TransfereGov** | `GET /transferencias-especiais?municipio={}` | Emendas PIX | 2x/dia |
| **Portal Transparencia** | `GET /api-de-dados/convenios?codigoIBGE={}` | Convenios por municipio | 1x/dia |

**Ciclo de vida monitorado:**
```
PROPOSTA_CADASTRADA → PROPOSTA_EM_ANALISE → PROPOSTA_APROVADA →
AGUARDANDO_ASSINATURA → EM_EXECUCAO → PRESTACAO_CONTAS → CONCLUIDO

Desvios monitorados:
→ PROPOSTA_REJEITADA (por que? corrigir e reenviar)
→ CONVENIO_RESCINDIDO (motivo? prevenir recorrencia)
→ INADIMPLENCIA (o que falta para regularizar?)
→ PRAZO_EXPIRADO (recurso devolvido? quanto?)
```

**Insights gerados:**
- "Convenio 912345 com R$ 430k em 72% executado. Prazo vence em 45 dias. Acelerar!"
- "3 convenios em PRESTACAO_CONTAS pendente ha > 90 dias. Risco de inadimplencia."
- "Municipio elegivel para 12 programas no TransfereGov, aderiu a apenas 3."

### C) FUNDO NACIONAL DE SAUDE (FNS)

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **FNS API** | `GET /repasses-dia` | OBs diarias emitidas | 1x/dia (8h) |
| **FNS API** | `GET /pagamentos?uf={}&municipio={}` | Pagamentos por bloco | 1x/dia |
| **FNS API** | `GET /pagamentos/detalhe` | NE, OB, data, valor individual | 1x/dia |
| **FNS API** | `GET /saldos?ibge={}` | Saldo por conta/bloco | 1x/dia |
| **FNS API** | `GET /convenios?ibge={}` | Instrumentos celebrados | 1x/semana |
| **ConsultaFNS** | Scraping consultafns.saude.gov.br | Repasses historicos, programas | 1x/dia |

**Blocos monitorados com detalhe:**
```
PAB (Atencao Primaria):
  - PAB Fixo: per capita (R$ 28,17/hab/ano - 2026)
  - PAB Variavel: eSF, eAB, NASF, ACS, microscopista
  - Incentivos: eSF, eAB, Saude Bucal, NASF

MAC (Media/Alta Complexidade):
  - FAEC: procedimentos alto custo
  - CEO: centros de especialidades odontologicas
  - Teto MAC: limite financeiro por municipio

VIGIL (Vigilancia):
  - Vigilancia epidemiologica
  - Vigilancia sanitaria
  - Vigilancia ambiental

FARM (Assistencia Farmaceutica):
  - Componente basico (contrapartida municipal)
  - Componente estrategico
  - Componente especializado

GEST (Gestao SUS):
  - Qualificacao da gestao
  - Implantacao acoes/servicos
```

**Insights gerados:**
- "Saldo FNS PAB Variavel: R$ 234k. Nao executado ha 4 meses. Comprar insumos!"
- "Repasse MAC de R$ 1.2M creditado ontem. Verificar se tem contrato vigente."
- "Municipio nao aderiu ao Programa Farmacia Popular. Elegivel. Captar!"

### D) FUNDO NACIONAL DE EDUCACAO (FNDE)

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **FNDE Dados Abertos** | Download CSV/JSON | PNAE, PDDE, PNATE, FUNDEB | 2x/semana |
| **FNDE Portal** | Scraping fnde.gov.br | Liberacoes, prestacao contas | 2x/semana |
| **SIMEC** | Scraping simec.mec.gov.br | Obras, PAR, acoes | 1x/semana |

**Programas monitorados:**
```
PNAE (Alimentacao Escolar):
  - Valor per capita por modalidade de ensino
  - 30% obrigatorio da agricultura familiar
  - Parcelas: 10 parcelas/ano (fev-nov)
  - Monitorar: saldo, prestacao de contas, % agricultura familiar

PDDE (Dinheiro Direto na Escola):
  - Transferencia para UEx (APM/Caixa Escolar)
  - Programas: PDDE Basico, Emergencial, Estrutura, Qualidade
  - Monitorar: saldo UEx, pendencias prestacao contas

PNATE (Transporte Escolar):
  - Per capita por tipo (rural, aquaviario, fronteiriço)
  - 10 parcelas/ano
  - Monitorar: matriculas declaradas vs repasse

FUNDEB (Fundo Educacao Basica):
  - Complementacao VAAT/VAAF/VAAR
  - Valor Aluno Ano por UF
  - Monitorar: subvinculacoes obrigatorias (70% profissionais)

PROINFANCIA:
  - Obras em andamento
  - Valores liberados vs executados
  - Monitorar: obras paralisadas, prazo conclusao
```

**Insights gerados:**
- "PDDE Emergencial liberado: R$ 45k para escola [X]. Prazo uso: 90 dias."
- "PNAE 2025: 4 parcelas pendentes de prestacao de contas. Risco de suspensao!"
- "FUNDEB VAAR: municipio elegivel a R$ 2.1M adicional se cumprir condicionalidades."

### E) FNAS (ASSISTENCIA SOCIAL)

| Fonte | Dados | Polling |
|-------|-------|---------|
| **SUAS Web** (Scraping) | Repasses por bloco (PSB, PSE, PGS) | 1x/semana |
| **Portal Transparencia** | Transferencias por municipio para funcao 08 | 1x/dia |
| **TransfereGov** | Convenios FNAS | 2x/dia |

**Blocos SUAS:**
- PSB: Protecao Social Basica (CRAS, SCFV, BPC na escola)
- PSE: Protecao Social Especial (CREAS, Centro POP, Acolhimento)
- PGS: Programa de Gestao do SUAS

### F) SICONFI — FINANCAS MUNICIPAIS/ESTADUAIS

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **SICONFI/Tesouro** | `GET /siconfi/v1/finbra/...` | Receita, despesa, dotacao | 1x/semana |
| **DataLake Tesouro** | `apidatalake.tesouro.gov.br` | Series historicas financas | 1x/semana |

**Dados criticos:**
```
- Dotacao orcamentaria por funcao/subfuncao
- Execucao orcamentaria (empenhado/liquidado/pago)
- Receitas proprias vs transferencias
- Limites LRF (pessoal, divida, educacao 25%, saude 15%)
- Restos a pagar processados e nao processados
```

### G) ORCAMENTO FEDERAL (LOA/PLOA)

| Fonte | Dados | Uso |
|-------|-------|-----|
| **SIGA Brasil** | LOA por funcao/subfuncao/programa/acao | Identificar dotacoes para municipio |
| **SOF (SIOP)** | Execucao orcamentaria federal | Quanto foi realmente gasto |
| **Painel Cidadao** | Despesas por palavra-chave | Buscar compras similares |

### H) INDICES ECONOMICOS (BCB)

| Fonte | Endpoint | Dados | Polling |
|-------|----------|-------|---------|
| **BCB API** | `GET /api/v1/series/{codigo}/dados` | Series temporais | 1x/dia |
| Serie 433 | IPCA mensal | Reajuste de contratos e limites dispensa | 1x/mes |
| Serie 189 | IGP-M mensal | Reajuste de alugueis/servicos | 1x/mes |
| Serie 4390 | Selic | Referencia financeira | 1x/dia |
| Serie 1 | Dolar | Importacoes | 1x/dia |

## 14.3 Rastreamento Completo do Dinheiro Publico

### 6 Etapas — da Emenda ao Atesto

```
ETAPA 1: ORIGEM (Camara/Senado/LOA)
  └─ Emenda parlamentar OU dotacao orcamentaria
  └─ Campos: autor, tipo, valor, funcao, acao
  └─ Chave: codigo_emenda / programa_trabalho

        │ cruzar por codigo_emenda
        ▼

ETAPA 2: INSTRUMENTO (TransfereGov)
  └─ Convenio, contrato de repasse, transferencia especial
  └─ Campos: num_convenio, valor_global, contrapartida, vigencia
  └─ Status: PROPOSTA → APROVADO → EM_EXECUCAO → CONCLUIDO
  └─ Chave: numero_convenio

        │ cruzar por numero_convenio / favorecido_cnpj
        ▼

ETAPA 3: EMPENHO (Portal Transparencia)
  └─ Nota de empenho (NE) — compromisso de pagar
  └─ Campos: numero_NE, valor, credor_cnpj, programa, acao
  └─ Chave: numero_empenho

        │ cruzar por numero_empenho
        ▼

ETAPA 4: ORDEM BANCARIA (Portal Transparencia)
  └─ OB — pagamento efetivo
  └─ Campos: numero_OB, banco, agencia, conta, valor, data
  └─ Chave: numero_OB

        │ cruzar por codigo_ibge / conta_destino
        ▼

ETAPA 5: CREDITO NO MUNICIPIO (FNS/FNDE/FNAS)
  └─ Valor creditado na conta do fundo municipal
  └─ Campos: bloco, programa, valor, conta, data_credito
  └─ Chave: codigo_ibge + bloco

        │ cruzar por codigo_ibge + processo_compra
        ▼

ETAPA 6: EXECUCAO LOCAL (ATA360/PNCP)
  └─ Processo de compra vinculado ao recurso
  └─ Campos: numero_processo, valor_contratado, fornecedor, atesto
  └─ Chave: numeroControlePncp
  └─ CICLO FECHA: recurso rastreado de ponta a ponta
```

### Rastreamento Retroativo (Anos Anteriores)

| Ano | O que buscar | Fonte | Por que importa |
|-----|-------------|-------|-----------------|
| 2020 | Convenios com saldo, restos a pagar | TransfereGov, Transparencia | Recursos parados ha 5+ anos |
| 2021 | Emendas nao executadas | Transparencia | Padrao historico do municipio |
| 2022 | Transicao Lei 14.133 | PNCP | Processos na lei antiga |
| 2023 | Primeiros PCAs publicados | PNCP | Baseline planejamento |
| 2024 | Emendas PIX, Dec. 11.462 (SRP) | TransfereGov, PNCP | Novos instrumentos |
| 2025 | Manual TCU 5a Ed, Sicx, Contrata+ | Todas | Regras vigentes |
| 2026 | Dec. 12.807 (valores), execucao corrente | Todas | Ano atual |

## 14.4 Motor de Alertas

### Regras Automaticas (Cron Triggers)

| Regra | Condicao | Severidade | Acao |
|-------|----------|------------|------|
| RECURSO_DISPONIVEL | Credito FNS/FNDE detectado, sem empenho | INFO | Card + notificacao |
| RECURSO_ELEGIVEL | Programa aberto, municipio qualificado, nao aderiu | INFO | Card + roteiro |
| RECURSO_SUBUTILIZADO | Empenhado > 6 meses, executado < 50% | ALERTA | Card + aceleracao |
| RECURSO_EM_RISCO | Prazo < 90 dias, execucao < 40% | CRITICO | Push + e-mail |
| RECURSO_PERDIDO | Prazo expirado, recurso devolvido | HISTORICO | Relatorio + prevencao |
| EMENDA_NAO_EXECUTADA | Emenda empenhada > 12 meses, valor_pago = 0 | ALERTA | Card + acao |
| CONVENIO_VENCENDO | Vigencia < 60 dias, execucao < 80% | CRITICO | Push + prorrogacao |
| PCA_SEM_RECURSO | Item no PCA sem fonte de recurso mapeada | INFO | Sugestao de fonte |
| PCA_COM_RECURSO | Recurso disponivel bate com item do PCA | OPORTUNIDADE | Card destacado |
| CONTRATO_VENCENDO | Vigencia < 90 dias, sem processo renovacao | ALERTA | Iniciar novo processo |
| PRESTACAO_PENDENTE | Convenio concluido, prestacao > 30 dias atrasada | CRITICO | Alerta inadimplencia |
| FORNECEDOR_IMPEDIDO | CNPJ incluido no CEIS/CNEP durante contrato | CRITICO | Bloquear + notificar |
| LIMITE_FRACIONAMENTO | Soma 12 meses mesmo objeto > 80% limite dispensa | ALERTA | Sugerir licitacao |
| INDICE_REAJUSTE | IPCA acumulado > 5% desde ultimo reajuste contrato | INFO | Sugerir repactuacao |

### Formato do Alerta (UI)

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔴 CRITICO                                    fev 08, 2026 14:32│
│                                                                   │
│ Convenio FNDE/PDDE Emergencial — R$ 127.000                      │
│ Prazo de execucao: 45 dias restantes                             │
│ Executado: 23% (R$ 29.210 de R$ 127.000)                        │
│                                                                   │
│ Se nao executar ate 25/mar: recurso devolvido ao FNDE            │
│                                                                   │
│ Fonte: TransfereGov, convenio 912345                             │
│ Verificado em: 08/02/2026 14:30 (automatico)                    │
│                                                                   │
│ [Iniciar processo de compra]  [Ver detalhes]  [Prorrogar prazo] │
└──────────────────────────────────────────────────────────────────┘
```

## 14.5 Cruzamento PCA × Recursos

O insight mais poderoso: cruzar os itens planejados no PCA com recursos disponiveis.

```
PCA DO MUNICIPIO (entrada)           RECURSOS MAPEADOS (76+ APIs)
┌───────────────────────┐           ┌───────────────────────────────┐
│ Item 1: 50 notebooks  │──match──→│ FNDE/PDDE: R$ 45k disponivel  │
│ Item 2: Medicamentos  │──match──→│ FNS/FARM: R$ 234k saldo       │
│ Item 3: Veiculos      │──match──→│ Emenda Dep.X: R$ 500k saude   │
│ Item 4: Obras escola  │──match──→│ FNDE/PROINFANCIA: R$ 1.2M     │
│ Item 5: Software TI   │──match──→│ Nenhum recurso federal ⚠️     │
│ Item 6: Mobiliario     │──match──→│ PDDE Basico: R$ 12k UEx       │
└───────────────────────┘           └───────────────────────────────┘

RESULTADO PARA O SERVIDOR:
"4 dos 6 itens do PCA tem recurso federal identificado.
 Economia potencial: R$ 1.991.000 em recursos ja disponiveis.
 Item 5 (Software TI): usar orcamento proprio ou buscar emenda."
```

## 14.6 Chaves de Cruzamento entre APIs

| Chave | Formato | Conecta | Exemplo |
|-------|---------|---------|---------|
| **Codigo IBGE** | 7 digitos | TODAS as bases gov por municipio | 3106200 (BH) |
| **CNPJ** | 14 digitos | Orgao, fornecedor, entidade | 18.720.938/0001-86 |
| **Num Convenio** | 6 digitos SICONV | TransfereGov ↔ Transparencia | 912345 |
| **Cod Emenda** | AAAA.XXXX.XXXX | Camara/Senado ↔ Transparencia | 2025.1234.0001 |
| **Num Empenho** | AAAANExxxxxx | Transparencia ↔ SIAFI | 2025NE001234 |
| **Num OB** | AAAAOBxxxxxx | Transparencia ↔ Banco | 2025OB005678 |
| **Cod UASG** | 6 digitos | Compras.gov ↔ PNCP | 160001 |
| **numeroControlePncp** | string unica | PNCP (chave mestra) | 00000000-1-000001/2025 |
| **Programa Trabalho** | FFFF.SSSS.PPPP.AAAA | LOA ↔ SIOP ↔ SIGA | 10.302.5011.8585 |
| **Cod Bloco FNS** | PAB/MAC/VIGIL/FARM/GEST | FNS ↔ execucao local | MAC |
| **CATMAT/CATSER** | 6 digitos | D1 ↔ PNCP ↔ Compras.gov | 150406 |

## 14.7 Schedule de Ingestao (Cloudflare Cron Triggers)

| Horario | API | Dados | Tabela Destino |
|---------|-----|-------|----------------|
| 06:00 | FNS /repasses-dia | OBs emitidas ontem | recursos_federais |
| 06:30 | FNDE portal | Liberacoes novas | recursos_federais |
| 07:00 | TransfereGov /convenios | Status atualizado | convenios |
| 07:30 | Portal Transparencia /emendas | Emendas + documentos | emendas |
| 08:00 | Portal Transparencia /ceis,cnep,cepim | Impedidos atualizados | compliance |
| 08:30 | PNCP /contratacoes | Novas contratacoes | pncp_cache |
| 12:00 | TransfereGov /transferencias-especiais | Emendas PIX | recursos_federais |
| 14:00 | Portal Transparencia /despesas | Empenhos + OBs | rastro_dinheiro |
| 18:00 | BCB /series | IPCA, IGP-M, Selic, Dolar | indices |
| 00:00 | IBGE /agregados | Populacao, PIB (se atualizado) | municipios |
| Dom 02:00 | FNDE dados abertos | CSVs completos PNAE/PDDE/FUNDEB | recursos_federais |
| Dom 03:00 | SICONFI /finbra | Financas municipais | orcamento |
| 1o/mes | SINAPI/SICRO | Tabelas de custos obras | precos_referencia |

## 14.8 Modelo de Dados — Recursos (Supabase)

```sql
-- Recursos federais rastreados (expandido)
CREATE TABLE recursos_federais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orgao_id UUID REFERENCES orgaos(id),
  municipio_ibge INTEGER NOT NULL,

  -- Identificacao
  fonte TEXT NOT NULL,        -- FNDE, FNS, FNAS, EMENDA, CONVENIO, TRANSFERENCIA
  programa TEXT,              -- PNAE, PDDE, PAB, MAC, FARM, etc.
  subprograma TEXT,           -- PDDE_BASICO, PDDE_EMERGENCIAL, PAB_FIXO, PAB_VARIAVEL
  instrumento TEXT,           -- convenio, contrato_repasse, transferencia_especial, fundo_a_fundo
  numero_instrumento TEXT,    -- numero convenio, num OB, etc.

  -- Valores
  valor_total NUMERIC(15,2),
  valor_empenhado NUMERIC(15,2) DEFAULT 0,
  valor_liquidado NUMERIC(15,2) DEFAULT 0,
  valor_pago NUMERIC(15,2) DEFAULT 0,
  valor_devolvido NUMERIC(15,2) DEFAULT 0,
  contrapartida NUMERIC(15,2) DEFAULT 0,

  -- Prazos
  data_inicio DATE,
  data_vigencia DATE,
  data_credito DATE,
  prazo_prestacao_contas DATE,

  -- Status
  status TEXT NOT NULL,       -- DISPONIVEL, ELEGIVEL, EM_EXECUCAO, SUBUTILIZADO, EM_RISCO, PERDIDO, CONCLUIDO
  percentual_executado NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN valor_total > 0 THEN (valor_pago / valor_total * 100) ELSE 0 END
  ) STORED,
  dias_restantes INTEGER GENERATED ALWAYS AS (
    CASE WHEN data_vigencia IS NOT NULL THEN (data_vigencia - CURRENT_DATE) ELSE NULL END
  ) STORED,

  -- Vinculacao
  emenda_id TEXT,             -- codigo emenda parlamentar
  parlamentar TEXT,           -- nome do autor da emenda
  partido TEXT,
  pca_item_id UUID,           -- vinculo com item do PCA (se mapeado)
  processo_id UUID REFERENCES processos(id),  -- vinculo com processo de compra

  -- Rastreabilidade
  fontes_consultadas JSONB,   -- [{api, endpoint, data_consulta, response_hash}]
  dados_raw JSONB,            -- resposta original das APIs
  ano_referencia INTEGER NOT NULL,

  -- Controle
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  proximo_check TIMESTAMPTZ   -- quando verificar novamente
);

-- Indices para performance
CREATE INDEX idx_recursos_orgao_status ON recursos_federais(orgao_id, status);
CREATE INDEX idx_recursos_ibge_ano ON recursos_federais(municipio_ibge, ano_referencia);
CREATE INDEX idx_recursos_status_prazo ON recursos_federais(status, data_vigencia);
CREATE INDEX idx_recursos_fonte ON recursos_federais(fonte, programa);

-- RLS: orgao so ve seus recursos
ALTER TABLE recursos_federais ENABLE ROW LEVEL SECURITY;
CREATE POLICY recursos_orgao_isolation ON recursos_federais
  USING (orgao_id = auth.jwt() -> 'orgao_id');

-- Historico de emendas (anos anteriores)
CREATE TABLE emendas_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipio_ibge INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  codigo_emenda TEXT,
  autor TEXT,
  tipo_emenda TEXT,   -- individual, bancada, comissao, relator
  valor_empenhado NUMERIC(15,2),
  valor_pago NUMERIC(15,2),
  funcao TEXT,        -- saude, educacao, assistencia, etc.
  subfuncao TEXT,
  status TEXT,        -- executada, parcial, nao_executada, devolvida
  dados_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_emendas_ibge_ano ON emendas_historico(municipio_ibge, ano);

-- Compliance: CEIS/CNEP/CEPIM/CEAF
CREATE TABLE compliance_impedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj TEXT NOT NULL,
  razao_social TEXT,
  cadastro TEXT NOT NULL,  -- CEIS, CNEP, CEPIM, CEAF, CNIA
  orgao_sancionador TEXT,
  tipo_sancao TEXT,
  data_inicio DATE,
  data_fim DATE,
  fundamentacao TEXT,
  fonte_url TEXT,
  ativo BOOLEAN DEFAULT true,
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_compliance_cnpj ON compliance_impedidos(cnpj);
CREATE INDEX idx_compliance_ativo ON compliance_impedidos(ativo);
```

---

# PARTE 15 — CATALOGO COMPLETO DE APIs (76+ Endpoints)

## Resumo Consolidado

| # | Fonte | Base URL | Auth | Endpoints | Status |
|---|-------|---------|------|-----------|--------|
| 1 | PNCP | pncp.gov.br/api | API Key (write) / publico (read) | 29+ | POC |
| 2 | Compras.gov.br | dadosabertos.compras.gov.br | Publico | 8 | Doc |
| 3 | Portal Transparencia | api.portaldatransparencia.gov.br/api-de-dados | API Key (90 req/min) | 10 | Doc |
| 4 | TransfereGov | api.transferegov.sistema.gov.br | Publico (query) | 6 | Doc |
| 5 | FNS | apidadosabertos.saude.gov.br | Publico | 5 | Doc |
| 6 | FNDE | fnde.gov.br/dadosabertos | Publico (CSV/JSON) | 5 prog | Doc |
| 7 | IBGE | servicodados.ibge.gov.br/api | Publico | 4 | Doc |
| 8 | Camara | dadosabertos.camara.leg.br/api/v2 | Publico | 4 | Doc |
| 9 | Senado/SIGA | legis.senado.leg.br/dadosabertos | Publico | 3 | Doc |
| 10 | TCU | dados-abertos.apps.tcu.gov.br/api | Publico | 2 | Doc |
| 11 | SICONFI/Tesouro | apidatalake.tesouro.gov.br | Publico | 4 | Doc |
| 12 | BCB | api.bcb.gov.br | Publico | 4 series | Doc |
| 13 | SERPRO | gateway.apiserpro.serpro.gov.br | Cert + API Key | 17 | Contratado |
| 14 | CEIS/CNEP/CEPIM | via Portal Transparencia | API Key | 4 | Doc |
| 15 | FNAS/SUAS | scraping | - | 3 | Scraping |
| 16 | SINAPI/SICRO | downloads.caixa.gov.br | Publico (CSV) | download | Mensal |
| | **TOTAL** | | | **106+** | |

> **NOTA:** Painel de Precos (paineldeprecos.planejamento.gov.br) foi DESCONTINUADO.
> Fontes de pesquisa de preco vigentes: PNCP + Compras.gov (IN 65/2021) + SINAPI (obras).

## Endpoints P0 (Implementar Primeiro)

| # | API | Endpoint | Dado Critico |
|---|-----|----------|-------------|
| 1 | PNCP | /consulta/v1/atas/{id}/itens | Precos ARP vigentes |
| 2 | PNCP | /consulta/v1/atas/{id}/saldo | Saldo ARP (diferencial) |
| 3 | PNCP | /consulta/v1/pca/{cnpj}/{ano}/itens | PCA do orgao |
| 4 | Compras.gov | /modulo-arp/2_consultarItensARP | quantidadeEmpenhada (saldo real) |
| 5 | Compras.gov | /modulo-pesquisa-preco/1_consultarMaterial | Precos IN 65/2021 |
| 6 | Transparencia | /ceis + /cnep + /cepim | Fornecedores impedidos |
| 7 | Transparencia | /emendas?codigoIBGE={} | Emendas por municipio |
| 8 | TransfereGov | /convenios?municipio={} | Convenios + status |
| 9 | FNS | /saldos?ibge={} | Saldo por bloco saude |
| 10 | IBGE | /v1/localidades/municipios/{id} | Dados demograficos |
| 11 | BCB | /series/433/dados | IPCA (reajustes) |
| 12 | SERPRO | /consulta-cnpj/v2/{cnpj} | Dados RFB fornecedor |
| 13 | SERPRO | CND | Certidao negativa |

---

---

# PARTE 16 — NORMALIZACAO LINGUISTICA + BASE LEGAL EXPANDIDA

> Este modulo mapeia os gaps de cobertura dos glossarios existentes,
> define a estrategia de expansao por setor, e consolida a base legal
> completa que alimenta Auditor, ACMA e Design Law.

## 16.1 Inventario Atual — Dados de Normalizacao

| Arquivo | Registros | Formato | Qualidade |
|---------|-----------|---------|-----------|
| ata360_sinonimias_tecnicas.csv | 127 termos, ~500 sinonimos | CSV | BOA — com classe_catmat |
| ata360_regionalismos.csv | 43 termos, 7 regioes | CSV | BOA — mas so alimentos |
| ata360_base_conhecimento_agente.json | 320 registros (130+40+65+60+10+15) | JSON | BOA — estrutura pronta para agente |
| ata360_sinonimias_tecnicas_v3_FINAL.docx | ~130 termos | DOCX | Referencia (nao parseavel direto) |
| ata360_regionalismos_brasileiros_v3_FINAL.docx | ~40 termos | DOCX | Referencia (nao parseavel direto) |
| ata360_dicionario_marcas_genericas_v3_FINAL.docx | ~65 marcas | DOCX | Referencia (nao parseavel direto) |

**Estrutura JSON do agente (pronta para uso):**
```json
{
  "instrucoes_agente": {
    "regras": [
      "NUNCA corrigir o usuario",
      "Mapear internamente para termo padrao CATMAT",
      "Responder usando o termo que o usuario utilizou",
      "Alertar sobre uso de marcas em editais",
      "Considerar localizacao do ente para regionalismos"
    ],
    "fluxo": ["Receber termo", "Buscar sinonimias+regionalismos+marcas", "Identificar termo_padrao", "Buscar CATMAT/CATSER", "Retornar com termo do usuario"]
  }
}
```

## 16.2 Cobertura Setorial — Mapa de Gaps

### A) SAUDE — Maior setor de compras publicas

| Subcategoria | Termos Atuais | Gap | Prioridade |
|-------------|---------------|-----|------------|
| Camas e Leitos | 13 (Fowler, PPP, UTI, bariatrica, etc.) | COMPLETO | - |
| Pediatria | 6 (berco, incubadora, fototerapia) | Falta neonatal avancado | P1 |
| Mobiliario hospitalar | 10 (mesa, poltrona, cadeira rodas, etc.) | ADEQUADO | - |
| Diagnostico | 12 (monitor, desfibrilador, ECG, etc.) | Falta TC, RM, Endoscopio | P1 |
| Consumiveis | 10 (seringa, agulha, gaze, luva, etc.) | ADEQUADO para basicos | P2 |
| **MEDICAMENTOS** | **0** | **GAP CRITICO — setor inteiro faltando** | **P0** |
| **LABORATORIO** | **0** | **GAP CRITICO — reagentes, analisadores** | **P0** |
| **ODONTOLOGIA** | **0** | **GAP CRITICO — resina, cadeira, fotopol** | **P0** |
| **CIRURGICO** | **0** | **GAP — bisturi, pinças, fios sutura** | **P1** |
| **ORTESES/PROTESES** | **0** | **GAP — colchao pneumatico, tipoia** | **P2** |

**Medicamentos criticos para adicionar (top 30 RENAME/SUS):**
- Paracetamol (Tylenol), Dipirona (Novalgina), Amoxicilina, Omeprazol
- Ibuprofeno (Advil), Losartana, Enalapril, Metformina, Glibenclamida
- Captopril, Atenolol, Hidroclorotiazida, Sinvastatina, AAS
- Salbutamol (Aerolin), Prednisona, Cefalexina, Azitromicina
- Insulina NPH, Insulina Regular, Diazepam (Valium), Clonazepam (Rivotril)
- Fluoxetina (Prozac), Amitriptilina, Dexametasona, Ranitidina
- Sulfametoxazol+Trimetoprima (Bactrim), Metronidazol, Ciprofloxacino
- Albendazol, Ivermectina

**Laboratorio critico:**
- Tubo de coleta (Vacutainer e similar), reagentes bioquimicos
- Hemograma automatizado, glicemia, urina tipo I
- Microscopio, centrifuga, autoclave laboratorial, estufa

**Odontologia critica:**
- Cadeira odontologica, compressor, fotopolimerizador
- Resina composta, amalgama, ionômero de vidro, anestesico
- Curetas, espatulas, espelhos clinicos, explorador

### B) EDUCACAO — Segundo maior setor

| Subcategoria | Termos Atuais | Gap | Prioridade |
|-------------|---------------|-----|------------|
| Mobiliario escolar | 4 (carteira, cadeira, quadro) | Falta mesa professor, estante, armario | P1 |
| Infantil | 2 (parquinho, colchonete) | Falta tatame, brinquedos, fraldas | P1 |
| Didatico | 2 (livro, lapis de cor) | Falta kit escolar completo | P1 |
| **MERENDA (PNAE)** | **0** | **GAP CRITICO — obrigatorio 30% agricultura familiar** | **P0** |
| **ESPORTES** | **0** | **GAP — bolas, redes, equipamentos** | **P1** |
| **LAB. CIENCIAS** | **0** | **GAP — microscopio escolar, vidraria** | **P2** |
| **INFORMATICA EDUCACIONAL** | **0** | **GAP — tablet, chromebook, lousa digital** | **P1** |
| **TRANSPORTE ESCOLAR** | **0** | **GAP — onibus escolar, manutenção** | **P1** |
| **UNIFORME** | **0** | **GAP — kit uniforme, tenis, mochila** | **P1** |
| **ACESSIBILIDADE** | **0** | **GAP — mesa PcD, software acessivel, braile** | **P2** |

**Merenda escolar — termos criticos (PNAE):**
- Arroz tipo 1, feijao carioca, oleo de soja, sal iodado
- Leite integral, achocolatado, iogurte natural
- Carne bovina (patinho, acém, coxão mole), frango congelado
- Frutas (banana, maça, laranja — com regionalismos!)
- Hortalicas (alface, tomate, cenoura, cebola, batata)
- Agricultura familiar: farinha de mandioca, rapadura, mel, doce de leite
- Pao frances, biscoito cream cracker, macarrao espaguete

### C) OBRAS — Gap de complexidade tecnica

| Subcategoria | Termos Atuais | Gap | Prioridade |
|-------------|---------------|-----|------------|
| Materiais basicos | 13 (cimento, areia, tijolo, etc.) | ADEQUADO para basicos | - |
| **HIDROSSANITARIO** | **0** | **GAP — tubos, conexoes, registros, caixas** | **P1** |
| **ESQUADRIAS** | **0** | **GAP — portas, janelas, vidros** | **P1** |
| **IMPERMEABILIZACAO** | **0** | **GAP — manta, emulsao, argamassa** | **P2** |
| **PAVIMENTACAO** | **0** | **GAP — asfalto, paralelepipedo, meio-fio** | **P2** |
| **MAQUINAS/EQUIPAMENTOS** | **0** | **GAP — betoneira, vibrador, andaime** | **P2** |

> **NOTA SINAPI:** Obras usam a linguagem SINAPI/SICRO (composicoes de custo).
> O glossario de normalizacao precisa mapear termos populares → codigos SINAPI.
> Ex: "reboco" → "emboço/reboco" (SINAPI 87879), "contrapiso" → "lastro" (SINAPI 87622)

### D) SETORES INTEIROS FALTANDO

| Setor | Termos | Importancia | Exemplos |
|-------|--------|-------------|----------|
| **ALIMENTOS (institucional)** | 0 | CRITICA — merenda, hospitalar, presídio | Arroz, feijão, carne, frutas, hortaliças |
| **COMBUSTIVEL** | 0 | ALTA — frota municipal | Gasolina, diesel S-10, etanol, GLP, querosene |
| **SERVICOS (CATSER)** | 0 | CRITICA — ~40% das compras | Limpeza, vigilância, TI, manutenção, consultoria |
| **FARMACIA** | 0 | CRITICA — SUS | Medicamentos genéricos/referência/similares |
| **GAS E ENERGIA** | 0 | MEDIA | GLP, energia elétrica, solar, gerador |
| **UNIFORMES/FARDAMENTO** | 0 | MEDIA | Farda, gandola, coturno, quepe |

### E) REGIONALISMOS — Expansao Necessaria

| Setor | Termos Atuais | Meta | Exemplos do que falta |
|-------|---------------|------|----------------------|
| ALIMENTOS | 30 | 80+ | Frutas regionais (açaí/N, cajá/NE, pitanga/SE) |
| UTENSILIOS | 6 | 15+ | Panela de pressão regional, cuia (RS) |
| LIMPEZA | 2 | 10+ | Produtos regionais, nomes de ferramentas |
| VESTUARIO | 4 | 10+ | Chinela (NE), japona (RS), blusa de frio |
| **SAUDE** | **0** | **20+** | UBS/posto, ACS/visitador, ambulatório/policlínica |
| **OBRAS** | **0** | **15+** | Laje/placa, reboco/emboço, piso/cerâmica |
| **TI** | **0** | **5+** | Computador/máquina (interior), internet/WiFi |

## 16.3 Marcas Genericas — Consolidacao e Expansao

### Inconsistencia atual:
O CSV menciona marcas nas `observacoes` (Chamex, Report, Limpol, Ype, BIC, Faber-Castell, Omo, Ariel, Comfort, Downy, Pinho Sol)
mas elas **NAO estao** na tabela `marcas_genericas` do JSON (que tem so 13).

### Marcas para adicionar ao JSON (P0):

| Marca | Termo Tecnico | Classe CATMAT | Setor |
|-------|--------------|---------------|-------|
| BIC | Caneta esferografica | 7510 | ESCRITORIO |
| Chamex | Papel sulfite A4 75g | 7530 | ESCRITORIO |
| Q-Boa | Hipoclorito de sodio 2% | 6840 | LIMPEZA |
| Candida | Hipoclorito de sodio 2% | 6840 | LIMPEZA |
| Pinho Sol | Desinfetante a base de pinho | 6840 | LIMPEZA |
| Omo | Detergente em po para roupas | 7930 | LIMPEZA |
| Ariel | Detergente em po para roupas | 7930 | LIMPEZA |
| Limpol | Detergente liquido neutro | 7930 | LIMPEZA |
| Ype | Detergente liquido neutro | 7930 | LIMPEZA |
| Comfort | Amaciante de roupas | 7930 | LIMPEZA |
| Faber-Castell | Lapis grafite/cor | 7510 | EDUCACAO |
| Novalgina | Dipirona sodica 500mg | 6505 | SAUDE |
| Tylenol | Paracetamol 500mg/750mg | 6505 | SAUDE |
| Advil | Ibuprofeno 200mg/400mg | 6505 | SAUDE |
| Buscopan | Escopolamina | 6505 | SAUDE |
| Aerolin | Salbutamol spray 100mcg | 6505 | SAUDE |
| Caterpillar | Retroescavadeira | 3810 | OBRAS |
| Scotch | Fita adesiva transparente | 7510 | ESCRITORIO |
| Lycra | Elastano (tecido elastico) | 8305 | MATERIAIS |
| Jacuzzi | Banheira de hidromassagem | 4510 | OBRAS |

## 16.4 Base Legal — Estado Atual vs Necessario

### A) Legislacao Primaria (OK na spec v8 Part 6)
10 leis mapeadas — ADEQUADO.

### B) Regulamentacao (OK, mas faltam 5 normas)

| Norma | Tema | Status |
|-------|------|--------|
| Dec. 10.947/2022 | PCA e DFD | ✅ |
| Dec. 11.462/2023 | SRP/ARP | ✅ |
| Dec. 11.878/2024 | Credenciamento | ✅ |
| Dec. 12.807/2025 | Valores 2026 | ✅ |
| IN SEGES/ME 58/2022 | ETP | ✅ |
| IN SEGES/ME 65/2021 | Pesquisa precos | ✅ |
| IN SGD/ME 94/2022 | TIC | ✅ |
| IN SEGES 73/2022 | Gestao contratual | ✅ |
| IN SEGES/MGI 52/2025 | Contrata+Brasil | ✅ |
| **IN SEGES/ME 67/2021** | **SICAF/habilitacao** | ✅ |
| **Dec. 7.983/2013** | **SINAPI/SICRO** | ✅ |
| **IN SEGES/ME 75/2024** | **Sustentabilidade** | ❌ FALTANDO |
| **Portaria SEGES/MGI 4/2025** | **Pesquisa precos digital** | ❌ FALTANDO |
| **Dec. 11.430/2023** | **Funcoes de confianca** | ❌ FALTANDO |
| **Resolucao CNJ 347/2020** | **IA no Judiciario (referencia)** | ❌ FALTANDO |
| **PBIA (Dec. 11.856/2023)** | **Estrategia IA Brasil** | ❌ FALTANDO |

### C) Jurisprudencia — GAP MASSIVO

| O que existe | Quantidade | Fonte |
|-------------|-----------|-------|
| documentos-config.yaml JURISPRUDENCIA | **6 acordaos** | v7.1 |
| glossario_legal no JSON | **10 termos legais** | agente |
| Spec v8 Part 6.4 menciona | **560 referencias** | Meta |
| **IMPLEMENTADO REAL** | **16 referencias** | Config + JSON |

**Gap: 560 - 16 = 544 referencias faltando**

### D) Manual TCU 5a Edicao (Agosto 2025)

Fonte: licitacoesecontratos.tcu.gov.br (manual interativo)

**Estrutura do Manual TCU 2025 (estimada com base em edicoes anteriores):**

| Capitulo | Tema | Acordaos Estimados | Relevancia ATA360 |
|----------|------|-------------------|-------------------|
| 1 | Introducao e principios | ~20 | Base conceitual |
| 2 | Agentes de contratacao | ~30 | Papeis e responsabilidades |
| 3 | Planejamento (PCA, DFD, ETP) | ~60 | **CRITICO** — alimenta DFD+ETP |
| 4 | Pesquisa de precos | ~40 | **CRITICO** — alimenta PP |
| 5 | Termo de referencia | ~50 | **CRITICO** — alimenta TR |
| 6 | Modalidades (Pregao, Concorrencia) | ~60 | Alimenta fluxo roteador |
| 7 | Criterios de julgamento | ~30 | Alimenta editais |
| 8 | Habilitacao | ~40 | SICAF/qualificacao |
| 9 | Contratacao direta (Dispensa/Inexigibilidade) | ~50 | **CRITICO** — alimenta JCD |
| 10 | SRP/ARP | ~40 | **CRITICO** — alimenta ARP |
| 11 | Contratos | ~50 | Gestao contratual |
| 12 | Fiscalizacao e execucao | ~40 | Fases 5-6 |
| 13 | Sancoes | ~30 | Fase 7 |
| 14 | Sustentabilidade | ~20 | ETP/TR |
| **TOTAL** | | **~560** | |

**46 novos acordaos (2023-2024) adicionados na 5a edicao** — prioridade de ingestao.

### E) Estrategia de Populacao da Base Jurisprudencial

```
FASE 1 (P0): Ingerir Manual TCU 2025 completo
  - Scraping licitacoesecontratos.tcu.gov.br
  - Parsing: numero, orgao, colegiado, relator, ementa, tese, tags
  - ~560 referencias → tabela jurisprudencia (ClickHouse)

FASE 2 (P1): TCEs estaduais (top 5 por volume)
  - TCE-SP, TCE-MG, TCE-RS, TCE-RJ, TCE-BA
  - ~200 referencias adicionais

FASE 3 (P2): AGU, CGU, STJ
  - Pareceres AGU relevantes
  - Orientacoes CGU
  - Precedentes STJ em licitacoes
  - ~100 referencias adicionais

FASE 4 (P3): Atualizacao continua (LEGAL_SYNC Agent)
  - DOU diario: monitorar novos acordaos/sumulas
  - Publicacoes TCU semanais
  - ~50 referencias/ano
```

## 16.5 Modelo de Dados — Normalizacao (Cloudflare Vectorize + D1)

```sql
-- D1: Tabela mestra de termos normalizados
CREATE TABLE termos_normalizados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_padrao TEXT NOT NULL,       -- "CAMA FOWLER"
  classe_catmat TEXT,               -- "6530"
  classe_catser TEXT,               -- null (ou codigo CATSER)
  categoria TEXT NOT NULL,          -- "SAUDE"
  subcategoria TEXT,                -- "Camas e Leitos"
  setor TEXT,                       -- "SAUDE", "EDUCACAO", "OBRAS", "TI", "LIMPEZA", "EPI", "ALIMENTOS", "VEICULOS", "SERVICOS", "COMBUSTIVEL"
  norma_tecnica TEXT,               -- "NR-6", "ABNT NBR 14892"
  created_at TEXT DEFAULT (datetime('now'))
);

-- D1: Sinonimos (muitos para um)
CREATE TABLE sinonimos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  termo_id INTEGER REFERENCES termos_normalizados(id),
  sinonimo TEXT NOT NULL,
  tipo TEXT DEFAULT 'sinonimo',     -- sinonimo, erro_digitacao, marca, abreviacao
  regiao TEXT,                      -- null (nacional), "SP", "RS", "NE", etc.
  confianca REAL DEFAULT 1.0,       -- 1.0 = exato, 0.8 = provavel
  UNIQUE(sinonimo, regiao)
);

-- D1: Marcas genericas
CREATE TABLE marcas_genericas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marca TEXT NOT NULL UNIQUE,
  termo_tecnico TEXT NOT NULL,
  classe_catmat TEXT,
  uso_edital TEXT,                   -- "Esponja de aco tipo Bombril ou similar"
  alerta TEXT DEFAULT 'Uso de marca em edital pode restringir competicao (Sumula TCU 177)'
);

-- Indices
CREATE INDEX idx_sinonimos_texto ON sinonimos(sinonimo);
CREATE INDEX idx_termos_catmat ON termos_normalizados(classe_catmat);
CREATE INDEX idx_termos_categoria ON termos_normalizados(categoria);
CREATE INDEX idx_termos_setor ON termos_normalizados(setor);
```

**Vectorize:** Cada `termo_padrao` + seus sinonimos geram um embedding (text-embedding-3-small).
Busca hibrida: `0.4*text_match(D1) + 0.4*semantic_match(Vectorize) + 0.2*context(orgao)`

## 16.6 Numeros Meta para v8 Completo

| Componente | Atual | Meta v8 | Expansao |
|-----------|-------|---------|----------|
| Sinonimias tecnicas | 127 | **500+** | 4x |
| Regionalismos | 43 | **150+** | 3.5x |
| Marcas genericas | 13 (JSON) / ~33 (total) | **100+** | 3x |
| Erros digitacao | 10 | **50+** | 5x |
| Unidades medida | 15 | **30+** | 2x |
| Glossario legal | 10 | **80+** | 8x |
| Jurisprudencia | 6 (YAML) | **560+** | 93x |
| Setores cobertos | 8 | **12+** | +ALIMENTOS, COMBUSTIVEL, SERVICOS, FARMACIA |
| Categorias CATMAT | ~15 classes | **50+ classes** | 3x |

## 16.7 Prioridades de Expansao dos Glossarios

| Prioridade | Setor | Termos a adicionar | Justificativa |
|-----------|-------|-------------------|---------------|
| **P0** | MEDICAMENTOS/FARMACIA | 100+ termos | Maior volume de compras SUS |
| **P0** | ALIMENTOS/MERENDA | 80+ termos | PNAE obrigatorio, regionalismos criticos |
| **P0** | SERVICOS (CATSER) | 60+ termos | ~40% das contratacoes sao servicos |
| **P0** | Jurisprudencia TCU | 560 referencias | Manual TCU 2025 inteiro |
| **P1** | OBRAS (SINAPI) | 50+ termos | Linguagem tecnica complexa |
| **P1** | SAUDE (lab, odonto, cirurgico) | 40+ termos | Complemento do setor |
| **P1** | EDUCACAO (merenda, esportes, uniforme) | 40+ termos | FNDE/PNAE |
| **P1** | COMBUSTIVEL | 15+ termos | Frota municipal |
| **P2** | Regionalismos nao-alimentos | 50+ termos | Expandir para todos setores |
| **P2** | Marcas genericas consolidacao | 70+ marcas | Corrigir inconsistencia CSV/JSON |
| **P3** | TCEs estaduais | 200+ jurisprudencias | Expansao gradual |

---

## PART 17 — DOCUMENTO MESTRE DEFINITIVO (Legal Design)

### 17.1 Visao Geral

O `documento_base_v8.html` e o template mestre que define a estrutura, ordem dos blocos,
design visual e regras de acesso para TODOS os 21 documentos do ATA360.

**Arquivo:** `templates/documento_base_v8.html`
**Referencia visual:** DFD template v7.1 (02_DFD_template_v7.html)

### 17.2 Principios de Legal Design Aplicados

| Principio | Implementacao |
|-----------|---------------|
| **Tipografia juridica** | Palatino Linotype (serif) — legibilidade em tela e impressao |
| **Hierarquia visual** | 4 niveis: titulo 17pt, secao 11.5pt, campo 9pt, nota 8pt |
| **Espacos de respiro** | Variaveis CSS: --respiro-bloco (20pt), --respiro-secao (24pt), --respiro-interno (14pt) |
| **Contraste WCAG AA** | Minimo 4.5:1 texto, 3:1 elementos UI |
| **Modo claro/escuro** | `prefers-color-scheme: dark` automatico pelo sistema |
| **Impressao P&B** | @media print com cores alto contraste, sem gradientes |
| **Leitura confortavel** | line-height 1.7, text-align justify, hyphens auto |

### 17.3 Ordem dos Blocos (Obrigatoria)

A ordem segue o DFD template v7.1 como referencia, com 3 blocos novos na v8:

```
BLOCO 1  — CABECALHO INSTITUCIONAL
             Logo dinamica do cadastro + ente + subordinacao
             CNPJ, UASG, IBGE

BLOCO 2  — IDENTIFICACAO DO DOCUMENTO
             Titulo, subtitulo, nº documento, processo, versao, data

BLOCO 3  — FUNDAMENTACAO LEGAL
             Lei 14.133/2021 + Decretos + INs + LINDB + TCU
             Manual TCU 5a Ed. (Ago/2025)

BLOCO 4  — RASTREABILIDADE + QR CODE + HASH + CARIMBO DO TEMPO
             ID, processo, versao, data/hora, PNCP, sincronia
             Hash SHA-256
             Carimbo do Tempo SERPRO (Contrato 266338, RFC 3161)
             QR Code verificacao publica

BLOCO 5  — CONTEXTO DO ENTE (v8 novo)
             Dados automaticos: municipio, populacao, IDH-M, PIB
             FPM, FNS, FNDE, emendas (APIs governamentais)
             Historico de contratacoes similares (PNCP)
             Fundamentacao: LINDB Art. 22

BLOCO 6  — RESUMO DO OBJETO (quando aplicavel)

BLOCO 7  — SUMARIO (documentos com 5+ secoes)

BLOCO 8  — SECOES DO DOCUMENTO (capitulos)
             Cada secao: numero + titulo + fundamento legal
             Conteudo com zonas de edicao
             Alertas legais (Auditor Agent)

BLOCO 9  — CHECKLIST DE CONFORMIDADE
             Itens por documento (YAML) + itens universais:
             HASH, TSA (carimbo), ICP (assinatura), PNCP (publicacao)

BLOCO 10 — NORMATIVOS APLICAVEIS (v8 novo)
             Tabela: normativo + dispositivo + aplicacao
             LINDB sempre presente

BLOCO 11 — DECLARACOES E TERMO DE ACEITE
             5 declaracoes obrigatorias + especificas por tipo
             LINDB Art. 28 integrado

BLOCO 12 — ASSINATURAS
             Papeis por tipo de documento (Lei 14.133/2021)
             Dados do cadastro do membro (cargo, matricula)
             ICP-Brasil (NeoSigner SERPRO)

BLOCO 13 — CONTROLE DE VERSOES
             Tabela com hash por versao

BLOCO 14 — TRILHA DA CONTRATACAO PUBLICA
             Barra de progresso visual (10 fases)

BLOCO 15 — SELO ATA360
```

### 17.4 Zonas de Edicao e Controle de Acesso

Cada bloco ou secao tem um atributo `data-zona` que define permissoes:

| Zona | Indicador Tela | Permissao | Exemplo |
|------|---------------|-----------|---------|
| `editavel` | Borda verde | Servidor preenche campos | Secoes de conteudo |
| `protegido` | Nenhum (padrao) | Sistema gera, servidor NAO altera | Fundamentacao, rastreabilidade |
| `revisavel` | Borda amarela | ACMA sugere, servidor revisa | Sugestoes do agente |
| `bloqueado` | Borda vermelha | So autoridade/admin | Assinaturas |

**Na impressao/PDF:** indicadores de zona ficam invisiveis.

**Mapeamento RLS (Supabase):**
- `servidor` → ve/edita zonas "editavel" do seu orgao
- `pregoeiro` → ve/edita fases 5-7 (LIC, CTR)
- `autoridade` → aprova, assina, ve tudo do orgao, zonas "bloqueado"
- `auditor` → read-only tudo, gera parecer (Auditor Agent)
- `admin` → tudo, multi-tenant

### 17.5 Logo Dinamica

```html
{% if dados.ente_logo_url %}
<img src="{{ dados.ente_logo_url }}" alt="Brasao {{ dados.ente_nome }}" class="logo">
{% else %}
<div class="logo-placeholder">LOGO<br>MUNICIPIO</div>
{% endif %}
```

- URL da logo vem do cadastro do ente (Supabase)
- Armazenamento: Cloudflare R2 (bucket `ata360-assets`)
- Fallback: placeholder dashed border

### 17.6 Carimbo do Tempo SERPRO

Integrado no BLOCO 4 (Rastreabilidade), sub-secao com:
- TSA serial (RFC 3161)
- Data/hora do carimbo
- Certificado (AC SERPRO / ICP-Brasil v5)
- Hash carimbado
- Link de verificacao

**Contrato SERPRO:** 266338
**Fluxo:** Documento finalizado → hash SHA-256 → API SERPRO TSA → carimbo armazenado

### 17.7 Dados do Cadastro (Contexto do Ente)

O BLOCO 5 e alimentado automaticamente por APIs:

| Dado | Fonte API | Endpoint |
|------|-----------|----------|
| Municipio, UF | IBGE | `/municipios/{cod}` |
| Populacao | IBGE | `/agregados/6579` |
| IDH-M | IBGE/Atlas | agregado |
| PIB per capita | IBGE | agregado |
| Receita total | SICONFI | `/finbra` |
| FPM | Tesouro Nacional | transferencias |
| FNS saldo | FNS/DataSUS | `/repasses-dia` |
| FNDE saldo | FNDE | programas |
| Emendas | Portal Transparencia | `/emendas` |
| Historico compras | PNCP | `/contratos?cnpjOrgao=` |

**Fundamentacao:** LINDB Art. 22 — considerar obstaculos e dificuldades reais do gestor.

### 17.8 Declaracoes Padrao (Todos os Documentos)

5 declaracoes obrigatorias presentes em TODOS os documentos:

1. **I** — Veracidade das informacoes (Dec. 10.947/2022)
2. **II** — Principios Art. 37 CF + Art. 5 Lei 14.133 (legalidade, impessoalidade, moralidade, publicidade, eficiencia)
3. **III** — Ausencia de conflito de interesses (Art. 9 Lei 14.133 + Lei 12.813/2013)
4. **IV** — Ciencia dos deveres funcionais + LINDB Art. 28 (responsabilizacao so por dolo/erro grosseiro)
5. **V** — Uso de ferramenta tecnologica ATA360 com validacao integral pelo signatario (Art. 11, IV)

Alem destas, cada tipo de documento pode ter declaracoes especificas via `declaracoes.itens_especificos`.

Declaracao final (aceite + PNCP + orgaos de controle) fecha o bloco.

### 17.9 Modo Claro e Escuro

O CSS usa `@media (prefers-color-scheme: dark)` para ajuste automatico:

**Modo Claro:**
- Fundo: #ffffff
- Texto primario: #2d3748
- Azul primario: #1e3a5f

**Modo Escuro:**
- Fundo: #0d1117
- Texto primario: #e2e8f0
- Azul primario: #63b3ed (tom claro para contraste)
- Alertas com fundos escuros correspondentes
- Tabelas com alternancia de linhas adaptada

**Impressao P&B:**
- @media print substitui TODAS as cores por escala cinza/preto
- doc-id-box e trilha usam `print-color-adjust: exact` para manter contraste
- Alertas ficam com fundo #f8f8f8 e borda preta
- Zonas de edicao invisiveis

### 17.10 Checklist Universal

4 itens presentes em TODOS os documentos (alem dos especificos por tipo):

| Codigo | Item | Verificacao |
|--------|------|-------------|
| HASH | Hash SHA-256 gerado | Automatica |
| TSA | Carimbo do Tempo SERPRO | Automatica |
| ICP | Assinatura digital ICP-Brasil | Manual (NeoSigner) |
| PNCP | Publicacao no PNCP | Automatica (Art. 94) |

### 17.11 Assinaturas por Tipo de Documento

Os papeis de assinatura sao definidos no YAML `config.assinaturas` por tipo:

| Documento | Assinatura 1 | Assinatura 2 | Assinatura 3 |
|-----------|-------------|-------------|-------------|
| DFD | Elaboracao (requisitante) | Validacao (autoridade) | — |
| ETP | Equipe de planejamento | Autoridade competente | — |
| PP | Pesquisador de precos | Validacao | — |
| TR | Elaboracao tecnica | Area juridica | Autoridade |
| MR | Equipe planejamento | Autoridade | — |
| JCD | Servidor responsavel | Autoridade | — |
| ARP | Gerenciador da ata | Ordenador de despesa | — |

Dados de cada assinante (nome, cargo, matricula) vem do cadastro do membro no Supabase.

### 17.12 Arquivo de Configuracao

Cada documento e configurado pelo `configs/documentos-config.yaml`:

```yaml
DFD:
  sigla: DFD
  nome: Documento de Formalizacao da Demanda
  subtitulo: Fase preparatoria...
  fundamentacao_cabecalho: [...]
  secoes: [...]
  checklist: [...]
  assinaturas: [...]
  normativos: [...]
  trilha_posicao: 2
  trilha_progresso: 20
```

O template mestre consome estes dados via Jinja2 ({{ config.xxx }}).

### 17.13 Guia de Estilo e Diagramacao — Legal Design ATA360

O design dos documentos ATA360 segue principios de **Legal Design** e **Design Law**
com o rigor de publicacao institucional. Cada regra abaixo e obrigatoria e forma
a identidade visual da marca ATA360.

#### 17.13.1 Tipografia

| Elemento | Familia | Tamanho | Peso | Espacamento |
|----------|---------|---------|------|-------------|
| Nome do ente | Palatino Linotype | 15pt | Bold | 0.3pt tracking |
| Titulo do documento | Palatino Linotype | 17pt | Bold | 0.5pt tracking |
| Titulo de secao | Palatino Linotype | 11.5pt | Bold | 0.3pt tracking |
| Corpo de texto | Palatino Linotype | 10.5pt | Regular | line-height 1.7 |
| Labels/rotulos | Palatino Linotype | 9pt | Bold | — |
| Notas e rodape | Palatino Linotype | 8pt | Regular | — |
| Dados rastreabilidade | Palatino Linotype | 8.5pt | Regular | — |
| Codigos/hash | Courier New | 7.5pt | Regular | — |

**Regras tipograficas:**
- Serif OBRIGATORIA (Palatino) — transmite autoridade, confiabilidade e tradicao juridica
- Fallbacks: Book Antiqua > Palatino > Times New Roman > serif generico
- `text-align: justify` em TODOS os blocos de texto corrido
- `hyphens: auto` para evitar rios tipograficos
- NUNCA usar menos de 8pt (legibilidade minima)
- Titulos SEMPRE em CAIXA ALTA (text-transform: uppercase)
- Subtitulos e fundamentos em italico para contraste hierarquico

#### 17.13.2 Escala Tipografica (Proporcao Harmonica)

```
17pt    Titulo do documento (ratio 1.62 — proporcao aurea)
15pt    Nome do ente (ratio 1.43)
11.5pt  Titulo de secao (ratio 1.10)
10.5pt  Corpo principal (BASE)
9.5pt   Sumario, campos inline
9pt     Labels, alertas, checklist, declaracoes
8.5pt   Rastreabilidade, fundamentos
8pt     Notas, rodape, controle versoes
7.5pt   Codigos, hash, fontes API
7pt     Fonte de dados, selos
6.5pt   QR code texto, legenda trilha
```

A escala aproxima a proporcao aurea (1.618) no topo e comprime suavemente
nos tamanhos menores — tecnica classica de diagramacao editorial.

#### 17.13.3 Espacamento e Respiro Visual

| Variavel CSS | Valor | Uso |
|-------------|-------|-----|
| `--respiro-bloco` | 20pt | Entre blocos principais |
| `--respiro-secao` | 24pt | Entre secoes de conteudo |
| `--respiro-interno` | 14pt | Padding interno de cards |
| `--raio-borda` | 4pt | Cantos suavizados |

**Regras de respiro:**
- NUNCA encavalhar texto — minimo 12pt entre blocos visuais
- Margem A4: 22mm lateral, 22mm topo, 28mm rodape (espaco para paginacao)
- Primeira pagina: margem topo reduzida 18mm (cabecalho fica proximo ao topo)
- `page-break-inside: avoid` em secoes (nunca partir uma secao no meio)
- `page-break-before: always` apos secao 5 (documentos com 8+ secoes) e secao 10 (12+ secoes)

#### 17.13.4 Sistema de Cores Institucional

**Paleta primaria (modo claro):**

| Token | Hex | Uso |
|-------|-----|-----|
| azul-primario | #1e3a5f | Titulos, cabecalhos, secoes, trilha |
| azul-secundario | #2c5282 | Labels, subtitulos, links |
| azul-claro | #e8f0f8 | Fundo alertas info, resumo objeto |
| verde | #276749 | Checklist ok, assinatura ICP, sucesso |
| amarelo | #d69e2e | Pendente, revisavel, atencao |
| vermelho | #c53030 | Erro, bloqueado, importante |
| cinza-escuro | #2d3748 | Texto primario |
| cinza-medio | #4a5568 | Texto secundario |
| cinza-claro | #f7fafc | Fundos de superficie |
| cinza-linha | #e2e8f0 | Bordas sutis, separadores |

**Contraste minimo WCAG AA:**
- Texto sobre fundo claro: 4.5:1 (texto 14pt+: 3:1)
- Elementos UI interativos: 3:1
- #2d3748 sobre #ffffff = 10.9:1 (excelente)
- #4a5568 sobre #ffffff = 7.0:1 (bom)
- #ffffff sobre #1e3a5f = 10.4:1 (excelente para doc-id-box)

**Modo escuro:** ajuste automatico via `prefers-color-scheme: dark`
- Cores invertidas para manter contraste
- Fundos: #0d1117 (pagina), #161b22 (superficie), #1c2333 (elevado)
- Azul claro: #63b3ed (contraste legivel sobre fundo escuro)
- Alertas com fundos escuros correspondentes

**Impressao P&B:** @media print
- TODAS as cores substituidas por escala de cinza
- Cabecalho doc: preto solido com texto branco (print-color-adjust: exact)
- Bordas de alerta: preto solido
- Checklist: preto (ok), cinza 66% (pendente)

#### 17.13.5 Tabelas — Diagramacao Rigorosa

**Regras de tabela (padrao ATA360):**
1. Cabecalho SEMPRE com fundo azul-primario e texto branco uppercase
2. Colunas numericas SEMPRE alinhadas a direita (.text-right)
3. Colunas de texto alinhadas a esquerda (padrao)
4. Colunas de codigo/ID centralizadas (.text-center)
5. Alternancia de cor nas linhas (odd branco, even cinza-claro)
6. Linha de totais: fundo cinza-escuro, texto branco, bold
7. Padding celulas: 9pt vertical, 11pt horizontal (tabela normal)
8. Padding compacto: 5pt x 8pt (tabela-compact para rastreabilidade)
9. Borda inferior sutil em cada linha (1pt solid cinza-linha)
10. NUNCA usar bordas laterais (estilo "open table" — elegancia minimalista)

#### 17.13.6 Hierarquia Visual

A hierarquia segue 5 niveis claros:

```
NIVEL 1 — BLOCO COLORIDO (doc-id-box, trilha)
           Fundo azul gradiente, texto branco, destaque maximo

NIVEL 2 — TITULO DE SECAO (secao-header)
           Numero em box azul + titulo uppercase + fundamento italico
           Borda inferior azul

NIVEL 3 — CARD/AREA (checklist, declaracoes, contexto-ente)
           Fundo cinza-claro, borda sutil, titulo bold azul

NIVEL 4 — CONTEUDO (secao-conteudo, campos)
           Borda esquerda cinza sutil (2pt), padding esquerdo 42pt
           Texto corpo 10.5pt regular

NIVEL 5 — METADATA (rastreabilidade, versoes, notas)
           Texto 8-8.5pt, cor cinza-medio, sem destaque
```

#### 17.13.7 Terminologia e Gramatica Juridica

**Regras OBRIGATORIAS em todo texto gerado:**
1. Usar SEMPRE a terminologia da Lei 14.133/2021 (nao misturar com Lei 8.666)
   - "fase preparatoria" (NAO "fase interna")
   - "contratacao" (NAO "aquisicao" generica)
   - "agente de contratacao" (NAO "pregoeiro" exceto em pregao)
   - "estudo tecnico preliminar" (NAO "estudo de viabilidade")
2. Artigos da lei: "Art. 18, I" (NAO "artigo 18, inciso I" por extenso)
3. Acordaos TCU: "Acordao 2.622/2015-Plenario" (formato completo)
4. Sumulas: "Sumula TCU 177" (sem ponto apos numero)
5. Decretos: "Dec. 10.947/2022" (abreviado, com ponto)
6. Leis: "Lei 14.133/2021" (sem ponto entre numero e ano)
7. LINDB: sempre com os artigos especificos aplicaveis
   - Art. 20 → "decisao com base em consequencias praticas"
   - Art. 21 → "regime de transicao proporcional"
   - Art. 22 → "considerar dificuldades reais do gestor"
   - Art. 23 → "regime de transicao para mudancas de lei"
   - Art. 28 → "responsabilizacao pessoal so com dolo ou erro grosseiro"
   - Art. 30 → "compensacao por invalidade retroativa"
8. Conjugacao verbal formal: 3a pessoa do singular/plural
9. Voz passiva preferencial em dispositivos ("foi elaborado", "sera publicado")
10. NUNCA usar linguagem coloquial, girias ou abreviacoes informais

#### 17.13.8 Identidade Visual ATA360 (Estrategia de Marca)

Todos os documentos gerados pelo ATA360 compartilham:

1. **Tipografia unificada** — Palatino Linotype em TODOS os templates
2. **Paleta cromatica consistente** — mesmas 11 variaveis CSS
3. **Estrutura modular** — 15 blocos na mesma ordem em todos os docs
4. **Cabecalho padronizado** — logo + ente + subordinacao + detalhes
5. **Rodape institucional** — selo ATA360 + copyright + ID documento
6. **Rastreabilidade universal** — QR + hash + carimbo em TODOS os docs
7. **Checklist universal** — 4 itens fixos (HASH, TSA, ICP, PNCP)
8. **Declaracoes padrao** — 5 declaracoes obrigatorias + especificas
9. **Trilha visual** — barra de progresso com 10 fases em todos os docs
10. **Selo de qualidade** — selo ATA360 no rodape com ID unico

**Reconhecimento imediato:** qualquer servidor publico, auditor ou jurista
que veja um documento ATA360 deve reconhece-lo instantaneamente pela
identidade visual coerente, robustez da fundamentacao legal e qualidade
da diagramacao.

#### 17.13.9 Margens e Proporcoes A4

```
Pagina A4: 210mm x 297mm

Margens:
  Topo:    22mm (primeira pagina: 18mm)
  Lateral: 22mm (esquerda e direita)
  Rodape:  28mm (espaco para numeracao de pagina)

Area util: 166mm x 253mm (primeira: 166mm x 257mm)

Paginacao: centralizada, Palatino 9pt, "Pagina X de Y"
```

**Proporcoes dos elementos:**
- Cabecalho: logo max 85pt x 85pt (proporcional ao A4)
- Doc-id-box: largura total, padding 16pt x 20pt
- Secao-numero: 30pt x 38pt minimo (quadrado estilizado)
- QR code: 72pt x 72pt (proporcao adequada para leitura)
- Assinatura-bloco: flex 1 (divide igualmente o espaco)

#### 17.13.10 Oficios e Documentos Auxiliares

Oficios, despachos, pareceres e demais documentos auxiliares seguem:
1. Mesma tipografia (Palatino Linotype)
2. Mesma paleta cromatica
3. Cabecalho identico (logo + ente)
4. Rastreabilidade simplificada (ID + hash, sem carimbo SERPRO)
5. Selo ATA360 no rodape
6. Numeracao sequencial padronizada (OFICIO-SIGLA-ANO-NNNN)

### 17.14 Referencial Teorico — Legal Design e Visual Law

O design dos documentos ATA360 fundamenta-se nas seguintes fontes de autoridade:

#### 17.14.1 Academico e Internacional

1. **Margaret Hagan — Legal Design Lab (Stanford)**
   Criadora do termo Legal Design. Metodologia: design thinking + UX aplicado ao direito.
   Principio: documentos juridicos devem ser projetados para o LEITOR, nao para o redator.

2. **Matthew Butterick — Typography for Lawyers (2a Ed.)**
   Referencia mundial em tipografia juridica. Regras adotadas no ATA360:
   - Serif fonts para corpo de texto (Palatino, Century, Baskerville)
   - Margens amplas (minimo 1 polegada = 25.4mm — ATA360 usa 22mm adaptado A4)
   - Espacamento entre linhas: 1.2x a 1.5x (ATA360 usa 1.7x para respiro maximo)
   - NUNCA Times New Roman (desenhada para colunas estreitas de jornal)
   - Kerning ativo para harmonia visual

3. **U.S. Supreme Court — Slip Opinions Format**
   Autoridade maxima em design de documentos juridicos:
   - Margens amplas, fonte Century Schoolbook, single spacing
   - ATA360 segue principios analogos com Palatino Linotype

4. **Penn State Law Study**
   Documentos juridicos mal formatados geram percepcao NEGATIVA
   de competencia profissional — formatacao impacta credibilidade.

#### 17.14.2 Brasil — Legal Design e Visual Law

1. **PL 3326/2021 — Linguagem Simples no Judiciario**
   Projeto de lei para simplificar sentenças judiciais.
   ATA360 aplica: linguagem clara + elementos visuais.

2. **Pacto Nacional do Judiciario pela Linguagem Simples**
   Movimento oficial do judiciario brasileiro.
   ATA360 aplica: hierarquia visual, listas, quadros-resumo.

3. **Tendencias 2025-2026 (Legal Design Movement Brasil):**
   - Integracao com IA para geracao automatica de documentos visuais
   - Adocao pelo judiciario e orgaos publicos
   - Documentos hibridos (texto + visual)
   - UX juridico (experiencia do leitor)
   - Acessibilidade e inclusao
   - Compliance e governanca visual

4. **SEGES/ME — Instrucoes Normativas**
   Os artefatos de contratacao publica (DFD, ETP, TR, MR, PP)
   tem estrutura e capitulos DEFINIDOS por normativos SEGES:
   - IN SEGES/ME 58/2022 (ETP)
   - IN SEGES/ME 65/2021 (pesquisa de precos)
   - Dec. 10.947/2022 (DFD, TR, MR)
   - Lei 14.133/2021 (todos os artefatos)

   **REGRA ABSOLUTA:** o Legal Design MELHORA a apresentacao
   mas NUNCA compromete a base legal, capitulos obrigatorios,
   topicos dentro de cada capitulo, e requisitos normativos.
   A estrutura de cada artefato e IMUTAVEL — definida por lei e INs.

#### 17.14.3 LINDB Contextual nos Documentos

A LINDB nao e citada genericamente. Cada artigo aparece NO CONTEXTO ADEQUADO:

| Artigo LINDB | Onde aparece no documento | Contexto |
|-------------|--------------------------|----------|
| Art. 20 | Fundamentacao Legal (Bloco 3) | Decisoes fundamentadas em consequencias praticas |
| Art. 20 | Secoes de justificativa | Toda decisao deve avaliar consequencias |
| Art. 22 | Contexto do Ente (Bloco 5) | Dados do ente demonstram dificuldades reais |
| Art. 22 | Alertas do Auditor | "Considere dificuldades reais do municipio" |
| Art. 28 | Declaracoes (Bloco 11, item IV) | Servidor declara ciencia: responsabilizacao so por dolo |
| Art. 28 | Assinaturas (Bloco 12) | Fundamentacao do papel do signatario |
| Art. 21/23 | Secoes de transicao | Quando normativo muda (ex: Dec. 12.807/2025) |
| Art. 30 | Alertas retroativos | Compensacao quando ato e invalidado retroativamente |

#### 17.14.4 Regras de Nao-Comprometimento da Base Legal

O Legal Design ATA360 opera em CAMADA VISUAL sobre a CAMADA NORMATIVA:

```
┌─────────────────────────────────────────┐
│ CAMADA VISUAL (Legal Design)            │ ← Tipografia, cores, respiro,
│ Palatino, hierarquia, modo claro/escuro │    modo P&B, QR, selo
├─────────────────────────────────────────┤
│ CAMADA NORMATIVA (imutavel)             │ ← Capitulos, topicos, base legal
│ Lei 14.133/2021 + INs SEGES + Decretos │    fundamentos, declaracoes
│ LINDB + TCU + Manual TCU 5a Ed.        │    assinaturas por papel
└─────────────────────────────────────────┘
```

**NUNCA:**
- Remover um capitulo obrigatorio para "simplificar"
- Alterar a ordem de secoes definida em IN
- Omitir fundamento legal para "reduzir texto"
- Substituir terminologia tecnica por linguagem "simples" que perca precisao

**SEMPRE:**
- Manter TODOS os capitulos e topicos normativos
- Fundamentacao legal em CADA secao (secao-fundamento)
- Declaracoes completas com base legal entre parenteses
- LINDB contextualizada (nao generica)
- Hierarquia visual que REFORCE a estrutura legal, nao que a esconda

---

# PARTE 18 — CATÁLOGO COMPLETO DE ARTEFATOS

> 46 tipos de documentos / 70+ templates com variantes setoriais.
> Config-driven: novos artefatos = YAML + conteudo juridico, sem codigo.
> Template mestre: documento_base_v8.html (universal, renderiza qualquer tipo).

## 18.1 Arquitetura Config-Driven — Zero Codigo Para Novos Artefatos

O ATA360 gera documentos por CONFIGURACAO, nao por codigo:

```
┌─────────────────────────────────────────────────────────────┐
│ documentos-config.yaml                                       │
│ (fundamentacao, secoes, checklist, assinaturas, trilha)     │
├──────────────────────┬──────────────────────────────────────┤
│ DESIGN_LAW Agent     │ documento_base_v8.html               │
│ (deterministico,     │ (template Jinja2 universal,          │
│  zero LLM)           │  CSS Legal Design embutido)          │
├──────────────────────┴──────────────────────────────────────┤
│ PDF Final com identidade ATA360 completa                     │
│ (QR, hash, carimbo SERPRO, checklist, declaracoes, trilha)  │
└─────────────────────────────────────────────────────────────┘
```

**Implicacao estrategica:**
- Criar 1 artefato novo = 1 entrada YAML (~30-50 linhas)
- NAO requer: novo HTML, novo CSS, novo endpoint, deploy
- O agente DESIGN_LAW injeta o YAML no template e gera o PDF
- Tempo estimado por artefato: 2-4h (redacao juridica + validacao)

## 18.2 Inventario — 14 Artefatos Existentes (v7.1)

| # | Sigla | Nome | Etapa | Fundamentacao Principal |
|---|-------|------|-------|------------------------|
| 1 | PCA | Plano de Contratacoes Anual | Planejamento | Art. 12, VII, Lei 14.133 |
| 2 | DFD | Documento de Formalizacao da Demanda | Preparatoria | Art. 18, I, Lei 14.133 |
| 3 | ETP | Estudo Tecnico Preliminar | Preparatoria | Art. 18, §1o, Lei 14.133 |
| 4 | PP | Pesquisa de Precos | Preparatoria | Art. 23, Lei 14.133 + IN 65/2021 |
| 5 | TR | Termo de Referencia | Preparatoria | Art. 6o, XXIII, Lei 14.133 |
| 6 | MR | Mapa de Riscos | Preparatoria | Art. 18, X, Lei 14.133 |
| 7 | JCD | Justificativa de Contratacao Direta | Contratacao Direta | Arts. 72, 74, 75, Lei 14.133 |
| 8 | ARP | Termo de Adesao a ARP | Registro Precos | Art. 86, Lei 14.133 |
| 9 | OFG | Oficio ao Gerenciador | Registro Precos | Art. 86, §3o, Lei 14.133 |
| 10 | AUG | Autorizacao do Gerenciador | Registro Precos | Art. 86, §3o, Lei 14.133 |
| 11 | OFF | Oficio ao Fornecedor | Registro Precos | Art. 90, Lei 14.133 |
| 12 | ACF | Aceite do Fornecedor | Registro Precos | Art. 90, Lei 14.133 |
| 13 | COM | Comunicado ao Contratante Original | Registro Precos | Art. 86, §7o, Lei 14.133 |
| 14 | REC | Termo de Recusa do Fornecedor | Registro Precos | Art. 90, §1o, Lei 14.133 |

## 18.3 Novos Artefatos — Categoria A: Fase Licitatoria (7 tipos)

| Sigla | Nome | Base Legal | Dados de API | Prioridade |
|-------|------|-----------|-------------|-----------|
| EDL | Edital de Licitacao | Arts. 25, 28, Lei 14.133; IN 58/2022 Art. 25 | PNCP, D1 CATMAT | P1 |
| MIN | Minuta de Contrato (anexo ao Edital) | Art. 89, Lei 14.133 | herda TR | P1 |
| PJU | Parecer Juridico | Art. 53, Lei 14.133 | herda processo completo | P1 |
| AHL | Ata de Habilitacao e Lances | Art. 17, §3o, Lei 14.133; Dec. 10.024/2019 | PNCP atas sessao | P2 |
| ATA | Ata do Pregao / Sessao Publica | Art. 17, §3o, Lei 14.133 | PNCP atas sessao | P2 |
| RAD | Relatorio de Adjudicacao | Art. 71, Lei 14.133 | herda sessao | P2 |
| RHM | Relatorio de Homologacao | Art. 71, IV, Lei 14.133 | herda adjudicacao | P2 |

## 18.4 Novos Artefatos — Categoria B: Fase Contratual (6 tipos)

| Sigla | Nome | Base Legal | Dados de API | Prioridade |
|-------|------|-----------|-------------|-----------|
| CTR | Contrato Administrativo | Arts. 89-114, Lei 14.133 | herda edital + adjudicacao | P1 |
| OSD | Ordem de Servico / Fornecimento | Art. 91, Lei 14.133 | herda contrato | P1 |
| DFI | Designacao de Fiscal | Art. 117, Lei 14.133 | cadastro servidor | P1 |
| TAR | Termo Aditivo de Reajuste | Art. 124, Lei 14.133; Art. 92, §3o | BCB IPCA(433), IGP-M(189) | P1 |
| TER | Termo de Encerramento | Art. 106, Lei 14.133 | herda contrato + execucao | P2 |
| GAR | Garantia Contratual | Art. 96-100, Lei 14.133 | herda contrato | P2 |

## 18.5 Novos Artefatos — Categoria C: Fase de Execucao (5 tipos)

| Sigla | Nome | Base Legal | Dados de API | Prioridade |
|-------|------|-----------|-------------|-----------|
| RFI | Relatorio de Fiscalizacao | Art. 117, §1o, Lei 14.133 | herda contrato + OSD | P1 |
| TRD | Termo de Recebimento Definitivo | Art. 140, II, Lei 14.133 | herda recebimento provisorio | P2 |
| TRP | Termo de Recebimento Provisorio | Art. 140, I, Lei 14.133 | herda OSD + fiscal | P2 |
| ALC | Atestado de Capacidade Tecnica | Art. 140, §3o, Lei 14.133 | herda recebimento definitivo | P2 |
| NMP | Notificacao de Multa/Penalidade | Art. 155-163, Lei 14.133 | CEIS, CNEP, cadastro | P2 |

## 18.6 Novos Artefatos — Categoria D: Fase de Avaliacao (5 tipos)

| Sigla | Nome | Base Legal | Dados de API | Prioridade |
|-------|------|-----------|-------------|-----------|
| RAC | Relatorio Anual de Contratacoes | Art. 174, Lei 14.133; Dec. 10.947/2022 Art. 12 | PNCP compilado + ClickHouse | P1 |
| RDG | Relatorio de Desempenho do Gestor | Art. 7o, §2o, Lei 14.133; LINDB Art. 22 | todos contratos do servidor | P2 |
| SAP | Solicitacao de Auditoria Preventiva | Regimentos TCE/CGU | herda dados do processo | P2 |
| PAU | Parecer do Auditor ATA360 | Interno ATA360 | Auditor Agent (read-only) | P0 |
| RPC | Relatorio de Prestacao de Contas | Art. 158, Lei 14.133; CF Art. 70 | TransfereGov + FNS + FNDE | P2 |

## 18.7 Novos Artefatos — Categoria E: Transversais e Inteligencia (9 tipos)

| Sigla | Nome | Base Legal | Dados de API | Prioridade |
|-------|------|-----------|-------------|-----------|
| DRC | Dashboard de Recursos do Municipio | CF Arts. 158-162; LRF LC 101/2000 | SICONFI, FNS, FNDE, TransfereGov, IBGE | P1 |
| RRE | Relatorio de Recursos Elegiveis | CF + LRF + Programas federais | FNS, FNDE, TransfereGov, emendas | P1 |
| ALF | Alerta de Fracionamento | Art. 40, §1o, Lei 14.133; TCU Ac. 2.622/2015 | PNCP + ClickHouse historico | P0 |
| ALP | Alerta de Preco Atipico | Art. 23, §1o, Lei 14.133; TCU Ac. 2.434/2018 | PNCP + BCB + SINAPI/SICRO | P0 |
| ALV | Alerta de ARP Vencendo | Art. 84, §6o, Lei 14.133; Dec. 11.462/2023 | PNCP ARPs + Compras.gov saldo | P0 |
| RPP | Relatorio de Pesquisa de Precos Inteligente | IN 65/2021; Art. 23, Lei 14.133 | PNCP + ClickHouse + fornecedores | P0 |
| MCO | Mapa Comparativo de Orcamentos | Art. 23, Lei 14.133 | PNCP + fornecedores + BCB | P2 |
| CDF | Certidao de Disponibilidade Financeira | Art. 18, III, Lei 14.133; LRF Arts. 16-17 | SICONFI + LOA municipal | P0 |
| PGC | Painel Gerencial de Contratacoes | Art. 174, Lei 14.133 | PNCP + ClickHouse analytics | P2 |

## 18.8 Resumo de Prioridades

### P0 — Imediato (ZERO codigo, apenas YAML)

| Sigla | Nome | Justificativa P0 |
|-------|------|-------------------|
| CDF | Certidao de Disponibilidade Financeira | Obrigatorio para todo processo; dados ja na LOA |
| ALF | Alerta de Fracionamento | Motor principal do Auditor; dados PNCP ja implementados |
| ALP | Alerta de Preco Atipico | Motor principal do Auditor; dados PNCP + BCB ja implementados |
| ALV | Alerta de ARP Vencendo | Evita perda de oportunidade; dados PNCP ARPs ja implementados |
| RPP | Relatorio de Pesquisa Inteligente | Essencia da pesquisa ATA360; dados PNCP ja implementados |
| PAU | Parecer do Auditor | Auditor Agent ja especificado (spec v8 Part 7) |

**Total P0: 6 artefatos = 6 entradas YAML**
**Esforco: ~12-24h redacao juridica, ZERO deploy**

### P1 — Curto prazo (YAML + endpoints minimos)

| Sigla | Nome | O que precisa alem do YAML |
|-------|------|---------------------------|
| EDL | Edital | Rota Workers: montar edital com anexos |
| MIN | Minuta Contrato | Rota Workers: clausulas por tipo contratual |
| PJU | Parecer Juridico | Template de parecer + checklist juridico |
| CTR | Contrato Administrativo | Rotas: clausulas, cronograma, garantia |
| OSD | Ordem de Servico/Fornecimento | Rota: items do contrato + cronograma |
| DFI | Designacao de Fiscal | Rota: cadastro servidores + lotacao |
| TAR | Termo Aditivo Reajuste | Rota: calculo reajuste BCB (ja temos series) |
| RFI | Relatorio Fiscalizacao | Template + campos ocorrencia |
| RAC | Relatorio Anual | Rota: compilacao ClickHouse por exercicio |
| DRC | Dashboard Recursos | Consolidacao APIs federais (varias ja POC) |
| RRE | Relatorio Recursos Elegiveis | Consolidacao emendas + convenios + programas |

**Total P1: 11 artefatos**
**Esforco YAML: ~33-44h redacao juridica**
**Esforco codigo: 3-5 Workers endpoints (rotas de dados, nao logica nova)**

### P2 — Medio prazo (roadmap natural)

15 artefatos restantes: AHL, ATA, RAD, RHM, TER, GAR, TRD, TRP, ALC, NMP, RDG, SAP, RPC, MCO, PGC

**Dependem de:** integracao SERPRO completa, modulo de execucao contratual, sessao publica

## 18.9 Variantes Setoriais

Cada artefato P0/P1 pode ter variantes para setores com regras especificas:

| Setor | Variante | Normativo Especifico | Exemplo |
|-------|----------|---------------------|---------|
| TIC | ETP-TIC, TR-TIC | IN SGD/ME 94/2022 | Vedacao homem-hora, PDTIC obrigatorio |
| Saude | DFD-SAUDE, TR-SAUDE | Portaria GM/MS | CATMAT saude, marcas genericas medicamentos |
| Educacao | DFD-EDU, PP-EDU | FNDE resol. 6/2020 | PNAE cardapio, agricultura familiar 30% |
| Obras | ETP-OBRAS, TR-OBRAS | Dec. 7.983/2013 | SINAPI/SICRO obrigatorio, BDI referencial |
| Veiculos | TR-VEICULOS | Art. 75, II + INMETRO | Critérios sustentabilidade, PROCONVE |
| Alimentos | PP-ALIMENTOS | PNAE + Anvisa | Agricultura familiar, PAA, regionalismos |

**Implementacao:** nao e template separado. E a MESMA entrada YAML base
com campo `variante_setorial` que adiciona secoes/checklist especificos:

```yaml
TR-TIC:
  herda_de: [TR]  # herda TUDO do TR base
  variante_setorial: "TIC"
  secoes_adicionais:
    - numero: 11
      titulo: "Requisitos de TIC"
      fundamento: "IN SGD/ME 94/2022, Art. 18"
    - numero: 12
      titulo: "Vedacao de Contratacao por Homem-Hora"
      fundamento: "IN SGD/ME 94/2022, Art. 3o"
  checklist_adicionais:
    - codigo: "TR-TIC-01"
      texto: "PDTIC vigente referenciado"
      fundamento: "IN SGD/ME 94/2022, Art. 4o"
```

## 18.10 Trilha Expandida da Contratacao

A trilha visual passa de 10 para 12 etapas, cobrindo ciclo completo:

```
PCA → DFD → ETP → PP → TR/MR → EDL → LIC → CTR → EXE → FIS → AVA → PCS
 1     2     3    4    5/6     7     8     9    10    11    12    13

Legenda:
PCA = Planejamento        EDL = Edital          FIS = Fiscalizacao
DFD = Demanda             LIC = Licitacao       AVA = Avaliacao
ETP = Estudo              CTR = Contrato        PCS = Prestacao Contas
PP  = Precos              EXE = Execucao
TR  = Termo Referencia
MR  = Mapa Riscos
```

Artefatos por etapa da trilha:

| Etapa | Artefatos Gerados |
|-------|-------------------|
| 1 PCA | PCA |
| 2 DFD | DFD |
| 3 ETP | ETP, CDF |
| 4 PP | PP, RPP, ALP, ALF, ALV |
| 5-6 TR/MR | TR, MR |
| 7 EDL | EDL, MIN, PJU |
| 8 LIC | AHL, ATA, RAD, RHM |
| 9 CTR | CTR, OSD, DFI, GAR |
| 10 EXE | RFI, TRP, TRD, ALC |
| 11 FIS | NMP, TAR |
| 12 AVA | RAC, RDG, PAU |
| 13 PCS | RPC |
| Transversal | DRC, RRE, MCO, PGC |

## 18.11 Regra de Ouro: Conteudo vs. Codigo

```
┌─────────────────────────────────────────────────────────────┐
│                    TRABALHO POR ARTEFATO                     │
├───────────────────────┬─────────────────────────────────────┤
│ CONTEUDO (ATA360)     │ CODIGO (Monostate)                  │
│ ~90% do esforco       │ ~10% do esforco                     │
├───────────────────────┼─────────────────────────────────────┤
│ ✓ Fundamentacao legal │ ✓ Rota API (quando dados externos)  │
│ ✓ Secoes obrigatorias │ ✓ Endpoint Worker (quando novo)     │
│ ✓ Checklist itens     │ ✓ Query D1/ClickHouse (quando novo) │
│ ✓ Declaracoes         │                                     │
│ ✓ Texto padrao secoes │   Ja pronto:                        │
│ ✓ Jurisprudencia ref  │   - Template HTML universal         │
│ ✓ LINDB contextual    │   - CSS Legal Design                │
│ ✓ Validacao advogado  │   - DESIGN_LAW Agent                │
│ ✓ Entrada YAML        │   - Jinja2 render engine            │
│ ✓ Variantes setoriais │   - PDF generator                   │
│                       │   - PNCP 29 endpoints               │
│                       │   - BCB series                       │
│                       │   - IBGE dados                       │
└───────────────────────┴─────────────────────────────────────┘
```

**Conclusao:** De 46 artefatos totais, 32 sao NOVOS e:
- **6 (P0):** ZERO codigo, ZERO pedido Monostate
- **11 (P1):** YAML + 3-5 endpoints Workers (pedido minimo)
- **15 (P2):** Roadmap natural conforme integracao avanca

A decisao de usar config-driven architecture com template universal
foi a decisao mais estrategica do projeto. Cada novo artefato e um
investimento em CONTEUDO JURIDICO, nao em codigo.

---

# PARTE 19 — SEGURANÇA, SIGILO E PROPRIEDADE INTELECTUAL

> Artefatos gerados sao documentos do ente publico.
> Arquitetura, algoritmos, regras e motor de inteligencia sao propriedade
> exclusiva da ATA360 TECNOLOGIA — nunca revelados.

## 19.1 Principio Fundamental: Separacao de Camadas de Informacao

```
┌─────────────────────────────────────────────────────────────────────┐
│ CAMADA PUBLICA (Documentos do Ente)                                 │
│ PDFs gerados, dados do processo, precos, dotacoes                   │
│ → Pertence ao ente publico contratante                              │
│ → Publicavel no PNCP, Portal Transparencia                         │
│ → Acessivel por orgaos de controle (TCU, CGU, TCE, MP)            │
├─────────────────────────────────────────────────────────────────────┤
│ CAMADA SIGILOSA (Propriedade Intelectual ATA360)                    │
│ Algoritmos, regras do Auditor, motor de inteligencia,              │
│ pesos, heuristicas, prompt engineering, YAMLs internos,            │
│ arquitetura de agentes, logica DESIGN_LAW/ACMA/AUDITOR             │
│ → Propriedade exclusiva ATA360 TECNOLOGIA                          │
│ → NUNCA exposto em artefatos, APIs, logs ou interfaces             │
│ → Protegido por segredo industrial (Lei 9.279/1996, Art. 195)     │
└─────────────────────────────────────────────────────────────────────┘
```

## 19.2 O Que NUNCA Aparece nos Artefatos Gerados

Nenhum documento PDF, relatorio, alerta ou parecer gerado pelo ATA360
pode conter, revelar, sugerir ou permitir inferencia sobre:

| Categoria | Exemplos Proibidos | Justificativa |
|-----------|--------------------|---------------|
| Algoritmos | Formulas de scoring, pesos do Auditor, thresholds de alerta | Segredo industrial |
| Regras internas | Logica de fracionamento, criterios de outlier, arvore de decisao | Segredo industrial |
| Arquitetura | Nomes de agentes, fluxo Orquestrador→DESIGN_LAW→AUDITOR, pipeline | Segredo industrial |
| Prompt engineering | Prompts do ACMA, instrucoes dos agentes, system prompts | Segredo industrial |
| Configuracao | Conteudo dos YAMLs, mapeamento de campos, heranca de templates | Segredo industrial |
| Infraestrutura | Workers, D1, ClickHouse, KV, endpoints internos, URLs internas | Seguranca operacional |
| Dados de outros entes | Dados de municipios/orgaos que nao sejam o proprio solicitante | LGPD + multi-tenant |
| Modelos IA | Qual modelo (Haiku/Sonnet/Opus), distribuicao de uso, prompts | Segredo industrial |
| APIs SERPRO | Credenciais, tokens, chaves, contratos numerados | Seguranca + contrato SERPRO |

## 19.3 O Que PODE Aparecer nos Artefatos

| Categoria | Exemplo Permitido | Motivo |
|-----------|-------------------|--------|
| Dados do processo | Numero, objeto, valor, dotacao | Documento publico |
| Dados do ente | Populacao, IDH, orcamento (IBGE publico) | Dados abertos |
| Precos PNCP | Contratacoes similares com ID e link | Dados abertos |
| Fundamentacao legal | Artigos, INs, jurisprudencia TCU | Informacao publica |
| Resultado do Auditor | CONFORME / NAO CONFORME / RESSALVAS | Resultado, nao metodo |
| Alertas | "Possivel fracionamento identificado" | Conclusao, nao algoritmo |
| Recomendacoes | "Recomenda-se ampliar pesquisa de precos" | Orientacao, nao regra |
| Selo ATA360 | "Powered by ATA360" | Marca comercial |
| Hash/QR/Timestamp | Rastreabilidade do documento | Integridade publica |

**Regra critica:** O artefato mostra O QUE foi encontrado e A CONCLUSAO,
mas NUNCA mostra COMO o sistema chegou a essa conclusao (algoritmo, peso, threshold).

## 19.4 Regras de Implementacao por Agente

### DESIGN_LAW Agent
- Gera documento deterministico a partir do YAML
- O PDF final NAO contem: nomes de variaveis Jinja2, comentarios de template,
  metadados de geracao, versao do YAML, nome do agente
- Remove TODOS os comentarios HTML antes de gerar PDF
- Metadados do PDF: apenas titulo, data, numero, ente (nunca "gerado por DESIGN_LAW")

### AUDITOR Agent
- Resultado exposto: CONFORME / NAO CONFORME / RESSALVAS + percentual
- Alertas expostos: descricao + fundamento legal + recomendacao
- NUNCA exposto: score numerico interno, peso por criterio, arvore de decisao,
  threshold de ativacao, formula de risco, logica de prioridade

### ACMA Agent
- Sugestoes expostas: texto sugerido + fonte da sugestao (API/jurisprudencia)
- NUNCA exposto: prompt utilizado, modelo IA selecionado, temperatura,
  tokens consumidos, cadeia de raciocinio (chain-of-thought)

### LEGAL_SYNC Agent
- Alertas expostos: "Nova jurisprudencia TCU sobre X" + data + referencia
- NUNCA exposto: frequencia de monitoramento, fontes de scraping,
  criterios de relevancia, logica de matching

### Orquestrador (Maestro)
- NADA do Orquestrador e exposto em artefatos
- Roteamento, state machine, filas, retries sao 100% internos

## 19.5 Protecao Multi-Tenant (LGPD + Isolamento)

```
┌─────────────────────────────────────────┐
│ Ente A (Prefeitura de Exemplo-SP)       │
│ - Ve APENAS seus processos              │
│ - Ve APENAS seus documentos             │
│ - Alertas baseados em SEUS dados        │
│ - Contexto IBGE do SEU municipio        │
├─────────────────────────────────────────┤
│ Ente B (Prefeitura de Outro-MG)         │
│ - Isolamento TOTAL via Supabase RLS     │
│ - Zero vazamento cross-tenant           │
│ - Nao ve dados, processos ou alertas    │
│   de nenhum outro ente                  │
└─────────────────────────────────────────┘
```

**Excecao controlada:** Dados PUBLICOS do PNCP (contratacoes publicadas)
podem ser usados em pesquisas de precos de qualquer ente — sao dados abertos
por forca de lei (Art. 174, Lei 14.133/2021).

## 19.6 Protecao na Camada de Dados

| Camada | Dado Protegido | Mecanismo |
|--------|---------------|-----------|
| Supabase | Dados do ente, processos, usuarios | RLS (Row Level Security) por tenant_id |
| D1 | CATMAT, CATSER, UASGs | Dados publicos, sem restricao |
| R2 | PDFs gerados, anexos | Bucket isolado por ente + signed URLs |
| KV | Sessoes, cache | TTL 24h + namespace por ente |
| ClickHouse | Historico contratacoes | Filtro obrigatorio por orgao_id |
| Vectorize | Embeddings | Namespace por ente (quando dados privados) |

## 19.7 Dados que NUNCA Trafegam para o Frontend

O frontend (Next.js) NUNCA recebe:

1. YAMLs de configuracao internos (documentos-config.yaml)
2. Regras do Auditor (thresholds, pesos, formulas)
3. Prompts do ACMA (system prompts, instrucoes)
4. Dados de outros tenants (zero cross-tenant leakage)
5. Credenciais SERPRO (tokens, chaves, certificados)
6. Logs internos dos agentes (chain-of-thought, decisoes intermediarias)
7. Metricas de uso de IA (tokens, modelo selecionado, custo)
8. URLs internas de Workers/D1/ClickHouse

O frontend recebe APENAS:
- Dados do processo do usuario autenticado
- PDFs renderizados (resultado final)
- Resultado do Auditor (triparticao + alertas descritivos)
- Sugestoes do ACMA (texto + fonte)
- Dados publicos de APIs (PNCP, IBGE, BCB)

## 19.8 Classificacao de Informacao ATA360

| Classificacao | Descricao | Quem Acessa | Exemplos |
|--------------|-----------|-------------|----------|
| **PUBLICO** | Dados abertos ou publicaveis | Qualquer pessoa | PNCP, IBGE, BCB, jurisprudencia |
| **RESTRITO** | Dados do ente, nao publicos | Usuarios autenticados do ente | Processos em andamento, rascunhos |
| **CONFIDENCIAL** | Dados sensiveis do ente | Usuarios com papel especifico | Dotacoes, valores em negociacao |
| **SECRETO** | Propriedade intelectual ATA360 | Equipe ATA360 + Monostate | Algoritmos, prompts, arquitetura |

## 19.9 Base Legal da Protecao

| Norma | Artigo | Protecao |
|-------|--------|----------|
| Lei 9.279/1996 (PI) | Art. 195, XI e XIV | Crime de concorrencia desleal: divulgar segredo industrial |
| Lei 9.609/1998 (Software) | Arts. 2o e 12 | Protecao ao programa de computador como obra intelectual |
| LGPD 13.709/2018 | Arts. 6o, 7o, 46 | Tratamento de dados pessoais, seguranca, isolamento |
| Lei 14.133/2021 | Art. 174 | Transparencia dos ATOS (contratos, atas) — nao do SOFTWARE |
| Marco Civil 12.965/2014 | Art. 7o | Inviolabilidade e sigilo de dados armazenados |
| CF/1988 | Art. 5o, XXIX | Protecao a invencoes e criacao industrial |

**Principio:** A Lei 14.133/2021 exige transparencia dos ATOS ADMINISTRATIVOS
(contratos, editais, atas). NAO exige exposicao do software, algoritmos ou
arquitetura interna da ferramenta utilizada. Analogia: o TCU audita o
documento contabil, nao o codigo-fonte do ERP.

## 19.10 Selo de Qualidade ATA360 — Governanca Ouro

### 19.10.1 Descricao Visual

O selo e um certificado holografico circular posicionado no final de cada artefato,
com fundo TRANSPARENTE (PNG com canal alpha), aplicado como etiqueta de qualidade.

```
┌─────────────────────────────────────────────┐
│           SELO HOLOGRAFICO ATA360           │
│                                             │
│   ┌───────────────────────────────────┐     │
│   │  ╭─ arco superior ────────────╮   │     │
│   │  │ CERTIFICADO DE QUALIDADE   │   │     │
│   │  │        ATA360              │   │     │
│   │  ╰────────────────────────────╯   │     │
│   │                                   │     │
│   │     ┌───────────────────┐         │     │
│   │     │   ▶ LOGO ATA360   │         │     │
│   │     │  GOVERNANCA OURO  │         │     │
│   │     │   🇧🇷 🇧🇷 🇧🇷      │         │     │
│   │     └───────────────────┘         │     │
│   │                                   │     │
│   │  ╭─ arco inferior ────────────╮   │     │
│   │  │ INFRAESTRUTURA DE DADOS    │   │     │
│   │  │   OFICIAIS DO BRASIL       │   │     │
│   │  ╰────────────────────────────╯   │     │
│   │                                   │     │
│   │  [guilhoche + efeito iridescente] │     │
│   └───────────────────────────────────┘     │
│                                             │
│   Fundo: TRANSPARENTE (PNG alpha channel)   │
│   Efeito: holografico / iridescente / ouro  │
│   Formato: selo-ata360-governanca-ouro.png  │
└─────────────────────────────────────────────┘
```

**Elementos do selo:**

| Elemento | Conteudo | Posicao |
|----------|---------|---------|
| Arco superior | CERTIFICADO DE QUALIDADE ATA360 | Topo, texto dourado |
| Centro | Triangulo ▶ (logo ATA360) + "GOVERNANCA OURO" | Nucleo central |
| Bandeiras | 🇧🇷 Bandeiras do Brasil | Abaixo do logo central |
| Arco inferior | INFRAESTRUTURA DE DADOS OFICIAIS DO BRASIL | Base, texto dourado |
| Padrao fundo | Guilhoche (padrao anti-falsificacao) | Preenchimento circular |
| Efeito | Iridescente / holografico | Gradiente em todo o selo |

### 19.10.2 Significado do Selo

O selo e a ETIQUETA DE QUALIDADE no final do artefato que certifica:

1. O documento seguiu TODAS as exigencias da Lei 14.133/2021
2. O conteudo foi validado pelo AUDITOR Agent (conformidade legal)
3. O processo agiu de BOA-FE (Art. 5o, Lei 14.133/2021; Art. 20-30, LINDB)
4. Os dados sao provenientes de infraestrutura oficial (PNCP, IBGE, SERPRO, BCB)
5. O documento foi gerado deterministicamente pelo DESIGN_LAW Agent

### 19.10.3 Logica Condicional — Presenca/Ausencia do Selo

**REGRA CRITICA:** O selo NAO e decorativo. Sua presenca ou ausencia
e uma DECISAO AUTOMATICA do sistema baseada na conformidade do documento.

```
┌──────────────────────────────────────────────────────────┐
│                 ARVORE DE DECISAO DO SELO                │
│                                                          │
│   AUDITOR Agent avalia documento                         │
│        │                                                 │
│        ├── Resultado: CONFORME                           │
│        │   └── ✅ Selo PRESENTE no artefato              │
│        │                                                 │
│        ├── Resultado: RESSALVAS                          │
│        │   ├── Usuario corrigiu → CONFORME               │
│        │   │   └── ✅ Selo PRESENTE                      │
│        │   └── Usuario NAO corrigiu mas nao e critico    │
│        │       └── ✅ Selo PRESENTE (ressalvas no texto) │
│        │                                                 │
│        └── Resultado: NAO CONFORME                       │
│            ├── Usuario corrigiu → reavalia → CONFORME    │
│            │   └── ✅ Selo PRESENTE                      │
│            └── Usuario INSISTE em manter erro(s)         │
│                apesar de avisado                         │
│                └── ❌ Selo AUSENTE                       │
│                    (SEM mencao, SEM explicacao,           │
│                     simplesmente nao aparece)             │
└──────────────────────────────────────────────────────────┘
```

**Condicoes para PRESENCA do selo:**
- AUDITOR retorna `CONFORME` (score >= threshold de conformidade)
- AUDITOR retorna `RESSALVAS` mas usuario corrigiu ou ressalvas nao sao criticas
- Todas as secoes obrigatorias preenchidas
- Fundamentacao legal presente

**Condicoes para AUSENCIA SILENCIOSA do selo:**
- AUDITOR retorna `NAO CONFORME` E usuario foi alertado E insistiu em manter erro(s)
- O documento e gerado normalmente, POREM sem o selo
- NAO ha nenhuma mensagem explicando a ausencia
- NAO ha nenhum texto substituto ("selo removido", "nao conforme", etc.)
- A area do selo simplesmente NAO e renderizada no HTML/PDF final

**Principio:** O selo ausente e uma informacao passiva. Quem conhece o padrao ATA360
sabe que a ausencia significa inconformidade. O usuario NAO e punido explicitamente
— apenas nao recebe o certificado de qualidade.

### 19.10.4 Implementacao Tecnica do Selo

**No YAML (documentos-config.yaml):**
```yaml
selo:
  imagem: "assets/selo-ata360-governanca-ouro.png"
  largura: 110pt
  fundo: transparente
  condicao: auditor_conforme   # campo calculado pelo Orquestrador
```

**No Template (documento_base_v8.html):**
```html
{% if selo_aprovado %}
<div class="selo-area" data-zona="protegido">
    <img src="{{ config.selo_img }}"
         alt="Selo de Qualidade ATA360 - Governança Ouro"
         class="selo-img">
    <div class="selo-texto">
        © {{ dados.ano | default('2026') }} Powered by ATA360 —
        Sistema de Inteligência em Contratações Públicas
    </div>
    <div class="selo-id">
        {{ config.sigla }} | {{ rastreabilidade.id }} | {{ dados.ente_nome }}
    </div>
</div>
{% endif %}
```

**Variavel `selo_aprovado`:** Calculada pelo Orquestrador (Maestro) baseada em:
```
selo_aprovado = (
    auditor.resultado IN ['CONFORME', 'RESSALVAS_CORRIGIDAS', 'RESSALVAS_NAO_CRITICAS']
    AND secoes_obrigatorias_preenchidas == true
    AND fundamentacao_legal_presente == true
    AND NOT (auditor.resultado == 'NAO_CONFORME' AND usuario_insistiu == true)
)
```

### 19.10.5 O Que o Selo NAO Revela

Mesmo quando presente, o selo NAO revela:
- Versao interna do sistema
- Agente que gerou o documento (DESIGN_LAW)
- Modelo de IA utilizado (Haiku/Sonnet/Opus)
- Score numerico do AUDITOR
- Threshold de conformidade
- Numero de alertas ou ressalvas originais

O selo revela APENAS:
- Que o ATA360 gerou o documento (marca comercial)
- Que o documento passou pelo padrao de qualidade (Governanca Ouro)
- Que a infraestrutura de dados oficiais do Brasil foi utilizada

### 19.10.6 QR Code e Verificacao

- QR Code no bloco de rastreabilidade aponta para URL publica de verificacao
- A URL valida: hash + timestamp + integridade do documento
- A URL NAO dá acesso ao sistema interno, dashboard ou painel
- Formato: `https://verificar.ata360.com.br/{hash_documento}`
- Resposta da verificacao: apenas confirmacao de autenticidade + data de geracao

### 19.10.7 Arquivo do Selo

| Propriedade | Valor |
|-------------|-------|
| Nome | `selo-ata360-governanca-ouro.png` |
| Formato | PNG com canal alpha (fundo transparente) |
| Resolucao | 300 DPI (qualidade impressao) |
| Dimensao renderizada | 110pt (CSS) |
| Armazenamento | Cloudflare R2 (`assets/` bucket publico) |
| Cache | KV com TTL longo (asset estatico) |
| Nao versionado por ente | Selo UNICO para todos — padrao universal ATA360 |

### 19.10.8 Terminologia: Templates = Artefatos

No contexto ATA360, os termos sao INTERCAMBIAVEIS:
- **Template** = arquivo HTML base (Jinja2) que renderiza o documento
- **Artefato** = documento final (PDF) gerado a partir do template + dados
- O `documento_base_v8.html` e o TEMPLATE MESTRE que gera TODOS os artefatos
- Cada tipo de artefato (DFD, ETP, TR, etc.) e uma CONFIGURACAO YAML diferente
  alimentando o mesmo template

## 19.11 Regras para Equipe de Desenvolvimento (Monostate)

1. **Logs de producao:** NUNCA logar prompts, respostas de IA,
   dados de tenant, credenciais. Apenas IDs de requisicao e status codes.
2. **Repositorio:** Codigo privado. YAMLs de config NUNCA em repo publico.
3. **Variaveis de ambiente:** Todas as credenciais em Cloudflare Secrets,
   NUNCA em codigo, config files ou commits.
4. **Debug:** Em ambiente de desenvolvimento apenas. Zero debug em producao
   que exponha dados de tenant ou logica de agentes.
5. **Documentacao publica:** Pode descrever que o ATA360 faz (features),
   NUNCA como faz (implementacao).
6. **API publica (se houver):** Endpoints retornam resultados,
   NUNCA metadados internos, versao de agente, ou metricas de IA.

---

# PARTE 20 — ORQUESTRADOR (MAESTRO) E FLUXO CICLICO DE DOCUMENTOS

## 20.1 Visao Geral do Orquestrador

O Orquestrador (codinome Maestro) e o CONTROLADOR DE FLUXO central do ATA360.
Ele NAO gera conteudo, NAO analisa documentos, NAO sugere texto.
Ele COORDENA os demais agentes, gerencia estado e decide a ordem de execucao.

```
┌──────────────────────────────────────────────────────────────────┐
│                    ORQUESTRADOR (MAESTRO)                        │
│                                                                  │
│   Funcao: Coordenacao e State Management                        │
│   LLM: NAO (100% regras fixas + state machine)                  │
│   Modifica docs: NAO                                            │
│   Exposto no frontend: NAO (zero referencia em artefatos)       │
│                                                                  │
│   PODE:                           NAO PODE:                     │
│   ✅ Rotear entre agentes          ❌ Gerar texto                │
│   ✅ Gerenciar estado do processo  ❌ Modificar documentos       │
│   ✅ Decidir ordem de execucao     ❌ Tomar decisao pelo usuario │
│   ✅ Calcular selo_aprovado        ❌ Aprovar/rejeitar docs      │
│   ✅ Controlar loop de iteracao    ❌ Expor logica em artefatos  │
│   ✅ Gerenciar filas (Queues)      ❌ Acessar dados cross-tenant │
│   ✅ Registrar audit trail         ❌ Bypassar revisao humana    │
└──────────────────────────────────────────────────────────────────┘
```

## 20.2 Separacao: Orquestrador vs. Insight Engine

| Componente | Funcao | LLM? | Exposto ao usuario? |
|-----------|--------|------|---------------------|
| **Orquestrador (Maestro)** | Controle de fluxo, state machine, routing, filas | NAO | NAO (100% interno) |
| **Insight Engine** | Cruzamento de dados, recomendacoes, consulta 76+ APIs | SIM (agnostico) | SIM (cards de recomendacao) |

O Insight Engine e o CEREBRO de dados (consulta, cruza, recomenda).
O Orquestrador e o MAESTRO de fluxo (coordena, roteia, gerencia estado).
Sao componentes DISTINTOS. O Insight Engine alimenta o pipeline com dados;
o Orquestrador decide QUANDO e EM QUE ORDEM cada agente atua.

## 20.3 Fluxo Ciclico Completo — O Loop da Contratacao

```
┌──────────────────────────────────────────────────────────────────────────┐
│              FLUXO CICLICO ATA360 — Loop de Refinamento                 │
│                                                                          │
│   ┌─────────┐                                                           │
│   │  INPUT   │  Usuario informa necessidade / dados do processo          │
│   └────┬────┘                                                           │
│        │                                                                 │
│        ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  1. ORQUESTRADOR recebe e classifica                            │   │
│   │     - Identifica tipo de documento necessario                    │   │
│   │     - Carrega YAML config do tipo                                │   │
│   │     - Consulta Insight Engine para contexto (APIs, dados)        │   │
│   │     - Define estado: RASCUNHO                                    │   │
│   └────────────────────────┬────────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  2. ACMA gera SUGESTOES (quando aplicavel)                      │   │
│   │     - Recebe contexto do Insight Engine + dados usuario          │   │
│   │     - Gera justificativas como SUGESTAO (rotulo IA obrigatorio) │   │
│   │     - Apresenta ao usuario para REVISAO HUMANA                   │   │
│   │     - Usuario: [APROVAR] [EDITAR+APROVAR] [REJEITAR] [MANUAL]   │   │
│   │     - Se rejeitado ou manual: usuario digita texto proprio       │   │
│   │     - Registro de aprovacao no audit_log                         │   │
│   └────────────────────────┬────────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  3. DESIGN_LAW gera o artefato (PDF)                            │   │
│   │     - Recebe: YAML config + dados + texto aprovado               │   │
│   │     - Renderiza template universal (documento_base_v8.html)      │   │
│   │     - 100% deterministico, zero LLM                              │   │
│   │     - Gera hash SHA-256 + metadados                              │   │
│   │     - Salva PDF em R2, estado: GERADO                           │   │
│   └────────────────────────┬────────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  4. AUDITOR analisa o artefato (read-only)                      │   │
│   │     - Recebe PDF/dados do documento gerado                       │   │
│   │     - Verifica checklists via lookup tables (deterministico)     │   │
│   │     - Interpreta conteudo dos campos (LLM, quando necessario)   │   │
│   │     - Emite: CONFORME / NAO CONFORME / RESSALVAS                │   │
│   │     - Lista achados + recomendacoes + jurisprudencia             │   │
│   │     - NUNCA modifica o documento                                 │   │
│   └────────────────────────┬────────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  5. OUTPUT — Apresentacao ao usuario                            │   │
│   │     - Documento renderizado + Parecer do Auditor                 │   │
│   │     - Checklist visual (ok/pendente/erro)                        │   │
│   │     - Alertas e recomendacoes                                    │   │
│   │     - Proximos passos sugeridos                                  │   │
│   │     - Estado: AGUARDANDO_DECISAO                                │   │
│   └────────────────────────┬────────────────────────────────────────┘   │
│                            │                                             │
│                            ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  6. DECISAO HUMANA (sempre do servidor publico)                 │   │
│   │                                                                  │   │
│   │     [✅ APROVAR]  → Estado: APROVADO → Selo calculado            │   │
│   │                    → Segue para assinatura / proximo documento   │   │
│   │                                                                  │   │
│   │     [✏️ EDITAR]   → Usuario corrige campos/secoes               │   │
│   │                    → VOLTA ao passo 3 (DESIGN_LAW regenera)     │   │
│   │                    → AUDITOR reavalia (passo 4)                  │   │
│   │                    → Novo OUTPUT (passo 5)                       │   │
│   │                    → Loop continua ate APROVAR                   │   │
│   │                                                                  │   │
│   │     [🔄 PEDIR     → ACMA gera nova sugestao com contexto        │   │
│   │      SUGESTAO]      atualizado → Loop volta ao passo 2          │   │
│   │                                                                  │   │
│   │     [⚠️ PROSSEGUIR → Usuario ciente dos alertas/ressalvas       │   │
│   │      COM ALERTAS]   → Orquestrador registra decisao             │   │
│   │                      → selo_aprovado pode ser FALSE              │   │
│   │                      → Documento segue SEM selo (silencioso)     │   │
│   │                                                                  │   │
│   │     [🗑️ DESCARTAR] → Documento descartado, estado: DESCARTADO  │   │
│   │                                                                  │   │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   APOS APROVACAO:                                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  7. FINALIZACAO                                                  │   │
│   │     - Orquestrador calcula selo_aprovado (ver 19.10.3)           │   │
│   │     - DESIGN_LAW regenera PDF FINAL (com ou sem selo)            │   │
│   │     - Carimbo SERPRO (prova temporal)                             │   │
│   │     - Assinatura ICP-Brasil / GOV.BR                             │   │
│   │     - Publicacao PNCP (quando aplicavel)                         │   │
│   │     - Estado: FINALIZADO                                         │   │
│   │     - Orquestrador sugere PROXIMO DOCUMENTO da trilha            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## 20.4 State Machine do Processo

```
┌──────────────────────────────────────────────────────────────────┐
│                  ESTADOS DO DOCUMENTO                            │
│                                                                  │
│  RASCUNHO ──────► SUGESTAO_ACMA ──────► TEXTO_APROVADO          │
│     │                   │                    │                   │
│     │                   ▼                    │                   │
│     │            SUGESTAO_REJEITADA          │                   │
│     │            (volta input manual)        │                   │
│     │                                        │                   │
│     └────────────────────────────────────────┘                   │
│                          │                                       │
│                          ▼                                       │
│                       GERADO (DESIGN_LAW criou PDF)              │
│                          │                                       │
│                          ▼                                       │
│                       AUDITADO (AUDITOR emitiu parecer)          │
│                          │                                       │
│                          ▼                                       │
│                  AGUARDANDO_DECISAO                              │
│                     │    │    │    │                              │
│         ┌──────────┘    │    │    └──────────┐                   │
│         ▼               ▼    ▼               ▼                   │
│     APROVADO      EDITANDO  REJEITADO   PROSSEGUIR_COM_ALERTAS  │
│         │            │         │              │                   │
│         │            └──► GERADO (loop)       │                   │
│         │                                     │                   │
│         └──────────────┬──────────────────────┘                   │
│                        ▼                                         │
│                   FINALIZANDO                                    │
│                   (selo + carimbo + assinatura)                  │
│                        │                                         │
│                        ▼                                         │
│                   FINALIZADO                                     │
│                   (publicacao PNCP se aplicavel)                 │
│                        │                                         │
│                        ▼                                         │
│                   PROXIMO_DOCUMENTO                              │
│                   (Orquestrador sugere)                          │
└──────────────────────────────────────────────────────────────────┘
```

## 20.5 Contagem de Iteracoes e Limites

| Parametro | Valor | Motivo |
|-----------|-------|--------|
| Max iteracoes ACMA por secao | 3 | Evitar loop infinito de sugestoes |
| Max iteracoes AUDITOR por documento | 5 | Permitir refinamento sem abuso |
| Max documentos em EDITANDO simultaneo | 3 | Performance + foco do usuario |
| Timeout de AGUARDANDO_DECISAO | 72h | Liberar fila se usuario nao decide |
| Re-auditoria apos edicao | AUTOMATICA | Sempre reavalia apos qualquer edicao |

**Regra:** Cada iteracao gera novo hash, nova versao, novo registro no audit trail.
Nenhuma iteracao sobrescreve a anterior — historico COMPLETO preservado.

## 20.6 Calculo de selo_aprovado

O Orquestrador calcula a variavel `selo_aprovado` (boolean) no passo 7 (Finalizacao):

```
selo_aprovado = (
    auditor.resultado IN ['CONFORME', 'CONFORME_COM_RESSALVAS']
    AND (
        auditor.resultado == 'CONFORME'
        OR (auditor.resultado == 'CONFORME_COM_RESSALVAS'
            AND (usuario_corrigiu_ressalvas == true
                 OR ressalvas_classificadas_como_nao_criticas == true))
    )
    AND secoes_obrigatorias_preenchidas == true
    AND fundamentacao_legal_presente == true
)

# Caso especifico: usuario PROSSEGUIU COM ALERTAS apesar de NAO_CONFORME
if auditor.resultado == 'NAO_CONFORME' AND estado == 'PROSSEGUIR_COM_ALERTAS':
    selo_aprovado = false
    # Documento gerado normalmente, SEM selo, SEM explicacao
    # Registro no audit_log: "usuario optou por prosseguir apesar de NAO_CONFORME"
```

## 20.7 Integracao entre Agentes — Contrato de Dados

### Input/Output de cada agente:

```
INSIGHT ENGINE
  Input:  necessidade_usuario + orgao_id + item
  Output: contexto_enriquecido {
    precos_pncp[], arps_vigentes[], recursos_federais[],
    emendas[], orcamento_siconfi, impedimentos_ceis[],
    jurisprudencia_relevante[], dados_ibge, historico_12m
  }

ACMA
  Input:  contexto_enriquecido + campos_do_documento + tipo_documento
  Output: sugestao {
    texto_por_secao{}, fontes_citadas[], aviso_ia: true,
    status: 'pendente_aprovacao'
  }

DESIGN_LAW
  Input:  yaml_config + dados_processo + texto_aprovado + selo_aprovado
  Output: artefato {
    pdf_bytes, hash_sha256, html_renderizado,
    metadados: {id, tipo, versao, timestamp}
  }

AUDITOR
  Input:  artefato + checklists_yaml + jurisprudencia_lookup
  Output: parecer {
    resultado: CONFORME|NAO_CONFORME|CONFORME_COM_RESSALVAS,
    verificacoes_por_orgao{}, achados[], score_geral,
    recomendacoes[], alertas[]
  }

ORQUESTRADOR
  Input:  todos os outputs acima + decisao_usuario
  Output: estado_processo {
    estado_atual, selo_aprovado, proximo_passo,
    historico_iteracoes[], audit_trail[]
  }
```

## 20.8 Proximo Documento — Sugestao Automatica

Apos FINALIZADO, o Orquestrador consulta a trilha da contratacao e sugere:

```
Trilha exemplo (Pregao Eletronico):
  PCA → DFD → ETP → PP → TR → MR → Edital → Sessao → Contrato

Se DFD acabou de ser FINALIZADO:
  Orquestrador: "Proximo passo: Estudo Tecnico Preliminar (ETP)"
  - Pre-carrega dados do DFD como contexto para o ETP
  - Heranca de campos (herda_de: [DFD] no YAML)
  - Insight Engine ja atualiza precos PNCP para pesquisa
```

| Documento finalizado | Proximo sugerido | Dados herdados |
|---------------------|-----------------|----------------|
| PCA | DFD | Itens planejados, prioridades |
| DFD | ETP | Necessidade, objeto, quantidade |
| ETP | PP | Solucao escolhida, especificacao |
| PP | TR | Preco referencia, fornecedores |
| TR | MR | Objeto detalhado, obrigacoes |
| MR | Edital | Todos os documentos anteriores |

## 20.9 Implementacao Tecnica do Orquestrador

```
Componente: Cloudflare Worker (Hono v4, TypeScript)
Estado: Supabase (tabela processo_estado, RLS por tenant)
Filas: Cloudflare Queues (geracao PDF, auditoria async)
Cache: KV (estado rapido do processo, TTL curto)
Cron: Cloudflare Cron Triggers (timeout AGUARDANDO_DECISAO)

Endpoints internos (NUNCA expostos no frontend):
  POST /internal/maestro/iniciar     → cria processo, estado RASCUNHO
  POST /internal/maestro/acma        → aciona ACMA para sugestao
  POST /internal/maestro/gerar       → aciona DESIGN_LAW
  POST /internal/maestro/auditar     → aciona AUDITOR
  POST /internal/maestro/decidir     → registra decisao usuario
  POST /internal/maestro/finalizar   → selo + carimbo + assinatura
  GET  /internal/maestro/estado/:id  → estado atual do processo
  GET  /internal/maestro/proximo/:id → proximo doc sugerido

Endpoints frontend (API publica simplificada):
  POST /api/processo/novo            → inicia novo processo
  GET  /api/processo/:id/status      → estado + parecer + proximos passos
  POST /api/processo/:id/decisao     → APROVAR/EDITAR/DESCARTAR
  GET  /api/processo/:id/documento   → PDF do artefato atual
```

## 20.10 LEGAL_SYNC Agent — Especificacao Resumida

O LEGAL_SYNC e um agente SINGLETON que opera em background:

```
┌──────────────────────────────────────────────────────────────────┐
│                    LEGAL_SYNC Agent                               │
│                                                                  │
│   Funcao: Monitorar DOU + atualizar lookup tables                │
│   LLM: NAO (scraping + regras fixas)                             │
│   Modifica docs: NAO                                             │
│   Singleton: SIM (uma unica instancia global)                    │
│                                                                  │
│   MONITORA:                                                      │
│   - Diario Oficial da Uniao (DOU): leis, decretos, INs           │
│   - Jurisprudencia TCU: novos acordaos relevantes                │
│   - Normas ABNT atualizadas                                     │
│   - Alteracoes em APIs governamentais (PNCP, Compras.gov)        │
│                                                                  │
│   ATUALIZA:                                                      │
│   - Lookup tables de fundamentacao legal (D1)                    │
│   - Tabela de jurisprudencia (Supabase)                          │
│   - Valores de referencia (Dec. 12.807 → quando novo decreto)    │
│   - Alertas para processos em andamento afetados                 │
│                                                                  │
│   FREQUENCIA:                                                    │
│   - DOU: diario (Cron 06h00 BRT)                                │
│   - Jurisprudencia TCU: semanal (Cron segunda 08h00)             │
│   - APIs governamentais: ao detectar erro em ingestao            │
│   - Valores monetarios: anual (quando novo decreto IPCA-E)       │
│                                                                  │
│   OUTPUT:                                                        │
│   - Registro de alteracao na lookup table (versionado)           │
│   - Alerta para AUDITOR: "Nova jurisprudencia sobre X"           │
│   - Alerta para ACMA: "Fundamentacao Y alterada"                 │
│   - Notificacao para processos em andamento afetados             │
│                                                                  │
│   NUNCA:                                                         │
│   - Modifica documentos ja gerados (imutabilidade)               │
│   - Altera processos finalizados                                 │
│   - Toma decisao sobre conformidade (papel do AUDITOR)           │
│   - Expoe fontes de scraping ou frequencia nos artefatos         │
└──────────────────────────────────────────────────────────────────┘
```

## 20.11 Audit Trail — Registro Completo de Cada Iteracao

Cada acao no fluxo gera um registro imutavel:

| Campo | Tipo | Exemplo |
|-------|------|---------|
| id | UUID | `audit-2026-00001` |
| processo_id | FK | `PROC-LAGOASANTA-2026-0001` |
| documento_tipo | string | `ETP` |
| iteracao | int | `3` |
| acao | enum | `USUARIO_EDITOU_SECAO_5` |
| agente | string | `DESIGN_LAW` / `AUDITOR` / `ACMA` / `MAESTRO` |
| estado_anterior | string | `AUDITADO` |
| estado_novo | string | `EDITANDO` |
| hash_anterior | SHA256 | `abc123...` |
| hash_novo | SHA256 | `def456...` |
| usuario_id | FK | `user-12345` |
| usuario_nome | string | `Maria Silva Santos` |
| timestamp | ISO8601 | `2026-02-08T14:35:00Z` |
| ip | string | `192.168.1.100` |
| detalhes | JSONB | `{"secoes_editadas": [5], "campos_alterados": ["justificativa"]}` |

**Imutabilidade:** Registros NUNCA sao editados ou deletados.
Armazenamento: Supabase (tabela `audit_trail`, append-only, RLS por tenant).

## 20.12 Resumo dos 6 Agentes — Visao Unificada

```
┌────────────────────────────────────────────────────────────────────────┐
│                    6 AGENTES ATA360 — VISAO UNIFICADA                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. ORQUESTRADOR (Maestro)                                            │
│     Funcao: Controle de fluxo, state machine, routing                 │
│     LLM: NAO | Modifica docs: NAO | Exposto: NAO                     │
│     Spec: Part 20                                                     │
│                                                                        │
│  2. INSIGHT ENGINE                                                     │
│     Funcao: Cruzamento de 76+ APIs, recomendacoes inteligentes        │
│     LLM: SIM (agnostico) | Modifica docs: NAO | Exposto: SIM (cards) │
│     Spec: Part 3.2 + Part 14 (Radar de Recursos)                     │
│                                                                        │
│  3. ACMA v3                                                            │
│     Funcao: Sugestoes de justificativas (⚠️ SEMPRE rotuladas IA)     │
│     LLM: SIM (agnostico) | Modifica docs: NAO | Exposto: SIM         │
│     Spec: 08-ACMA-AGENT + Part 3.3                                    │
│     Entrada: contexto Insight Engine + dados usuario                   │
│     Saida: sugestao (NUNCA conteudo final sem aprovacao humana)        │
│                                                                        │
│  4. DESIGN_LAW v3                                                      │
│     Funcao: Geracao deterministica de artefatos (PDF)                  │
│     LLM: NAO (zero) | Modifica docs: SIM (cria) | Exposto: NAO       │
│     Spec: 09-DESIGN-LAW-AGENT + Part 3.4                              │
│     Entrada: YAML + dados + texto aprovado + selo_aprovado             │
│     Saida: PDF + hash + metadados                                      │
│                                                                        │
│  5. AUDITOR v3                                                         │
│     Funcao: Verificacao de conformidade (SOMENTE LEITURA)              │
│     LLM: HIBRIDO (ver 20.13) | Modifica docs: NAO | Exposto: SIM     │
│     Spec: 07-AUDITOR-AGENT + Part 3.5                                  │
│     Entrada: artefato + checklists + jurisprudencia                    │
│     Saida: CONFORME / NAO CONFORME / RESSALVAS + achados              │
│                                                                        │
│  6. LEGAL_SYNC                                                         │
│     Funcao: Monitoramento DOU + atualizacao lookup tables              │
│     LLM: NAO | Modifica docs: NAO | Exposto: NAO (alertas apenas)    │
│     Spec: Part 20.10                                                   │
│     Operacao: Singleton, background, Cron                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## 20.13 AUDITOR — Definicao de LLM vs. Deterministico

O AUDITOR usa abordagem HIBRIDA:

| Etapa | Metodo | Motivo |
|-------|--------|--------|
| Carregar checklists | Deterministico (lookup table) | Regras fixas, auditadas por advogado |
| Verificar campo preenchido (sim/nao) | Deterministico (verificacao nula) | Nao precisa IA |
| Verificar coerencia de texto | LLM (interpretacao) | Precisa entender linguagem natural |
| Verificar valor numerico vs. limites | Deterministico (comparacao) | Regra fixa |
| Comparar com jurisprudencia | Deterministico (lookup match) | Catalogada, nao gerada |
| Gerar texto do achado/recomendacao | LLM (redacao) | Precisa contextualizar |
| Calcular score | Deterministico (formula fixa) | Peso por criterio, soma ponderada |
| Emitir parecer final | Deterministico (threshold) | CONFORME se score >= X |

**Custo por analise:**
- Parte deterministica: R$ 0,00
- Parte LLM (Sonnet): ~R$ 0,30 (12k input + 2k output)
- Opus para contratos > R$ 1M: ~R$ 1,25

**Principio:** LLM para INTERPRETAR linguagem natural do campo.
Lookup table para FUNDAMENTAR. Formula fixa para DECIDIR resultado.

## 20.14 Fluxo Visual Simplificado (Para Comunicacao)

```
   USUARIO                    ATA360                        RESULTADO
     │                          │                               │
     │  "Preciso comprar X"     │                               │
     │─────────────────────────►│                               │
     │                          │                               │
     │  Recomendacao + opcoes   │◄── Insight Engine (APIs)      │
     │◄─────────────────────────│                               │
     │                          │                               │
     │  "Gerar justificativa"   │                               │
     │─────────────────────────►│                               │
     │                          │                               │
     │  ⚠️ SUGESTAO IA         │◄── ACMA (LLM + dados)        │
     │◄─────────────────────────│                               │
     │                          │                               │
     │  [Aprova/Edita texto]    │                               │
     │─────────────────────────►│                               │
     │                          │                               │
     │  PDF do documento        │◄── DESIGN_LAW (zero LLM)     │
     │◄─────────────────────────│                               │
     │                          │                               │
     │  Parecer + checklist     │◄── AUDITOR (read-only)        │
     │◄─────────────────────────│                               │
     │                          │                               │
     │  [Aprovar / Editar]      │                               │
     │─────────────────────────►│                               │
     │          │               │                               │
     │     ┌────┴────┐          │                               │
     │     │ EDITAR? │──SIM────►│  ← volta ao DESIGN_LAW       │
     │     └────┬────┘          │    (loop de refinamento)      │
     │          │ NAO           │                               │
     │          ▼               │                               │
     │     APROVADO             │                               │
     │                          │──► Selo + Carimbo + Assinatura│
     │                          │                               │
     │  "Proximo: gerar ETP"    │◄── Orquestrador (trilha)     │
     │◄─────────────────────────│                               │
     │                          │                               │
     │  [Continuar]             │                               │
     │─────────────────────────►│  ← novo ciclo para ETP       │
     │         ...              │         ...                    │
```

---

*Especificacao Tecnica Consolidada ATA360 v8.0 (rev.11)*
*Sistema de Inteligencia em Contratacoes Publicas*
*Fevereiro 2026*
