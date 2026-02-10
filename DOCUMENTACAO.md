# ATA360 — Documentação Técnica Completa

> **Versão:** 8.1 — 10/fev/2026
> **Repositório:** `ata360brasil/v0-ata-360-chatbot-ui`
> **Stack:** Next.js 16 + Cloudflare Workers (Hono v4) + Supabase + D1 + R2 + KV + ClickHouse + AI Gateway

---

## 1. Visão Geral

ATA360 é um sistema de inteligência em contratações públicas brasileiras sob a Lei 14.133/2021. Transforma o processo de compras públicas em um fluxo assistido por IA, com dados oficiais, conformidade automática e rastreabilidade integral.

### 1.1 Princípios Fundamentais

- **Decisão humana é soberana** — IA orienta, humano decide
- **Dados oficiais, nunca inventados** — PNCP, IBGE, SERPRO, TCU, BCB
- **Transparência ética indiscutível** — posicionamento baseado em fatos e leis vigentes
- **Imparcialidade** — intermediador neutro com justificativas fundamentadas
- **Rastreabilidade total** — cada ação gera audit trail com hash SHA-256
- **Prevenção proativa** — alertas antecipados, controle de prazos, orientação preventiva
- **Legalidade ampla** — LINDB, LGPD, Lei 14.133, Lei Anticorrupção, normativos CGU/TCU/AGU
- **Segurança (Part 19)** — arquitetura interna nunca exposta; artefatos mostram O QUE, nunca COMO

### 1.2 Modelo de Negócio

- **Usuários = Entes Públicos (CNPJ)** — Prefeituras, consórcios, terceiro setor, PPPs, todos os sujeitos da Lei 14.133
- **NUNCA fornecedores** — ATA360 atende o lado comprador
- **Membros = CPF vinculado ao ente** — aprovados por SuperADM/LocalADM
- **Multi-tenant isolado** — RLS por `orgao_id` em todas as tabelas

---

## 2. Arquitetura

### 2.1 Stack de Tecnologia

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Frontend | Next.js 16 + React 19 + Tailwind 4 OKLCH + shadcn/ui | SSR + edge |
| BFF (Backend-for-Frontend) | Next.js API Routes | Proxy autenticado para Workers |
| API/Backend | Cloudflare Workers + Hono v4 (TypeScript) | Edge computing, lógica de negócio |
| Banco Relacional + Auth | Supabase (PostgreSQL) | Auth Gov.br, RLS multi-tenant, Realtime |
| Dados de Referência | Cloudflare D1 (SQLite) | CATMAT (337K), CATSER (35K), UASGs (1.2K) |
| Documentos/Storage | Cloudflare R2 | PDFs, HTML gerados, metadados |
| Cache/Sessões | Cloudflare KV | Lookup rápido, cache ACMA, debounce |
| Analytics | ClickHouse Cloud | 1.4M+ itens, séries temporais, métricas |
| Fila Assíncrona | Cloudflare Queues + Cron | Geração PDF, scraping, learning loops |
| IA | Cloudflare AI Gateway | Agnóstico (Haiku 80%, Sonnet 15%, Opus 5%) |
| Embeddings | OpenAI text-embedding-3-small | Busca semântica |
| Busca Vetorial | Cloudflare Vectorize | CATMAT + jurisprudência |
| Assinatura | NeoSigner SERPRO (ICP-Brasil) | Assinatura digital gov |
| Carimbo | SERPRO Carimbo do Tempo | Prova temporal |

### 2.2 Fluxo de Dados

```
Browser → Next.js (SSR/BFF) → Cloudflare Workers → Supabase/D1/R2/KV/AI
                                    ↕
                              APIs Governamentais (76+)
                              PNCP, IBGE, SERPRO, TCU, BCB, etc.
```

**Regra crítica:** Frontend NUNCA chama Workers diretamente. Sempre via BFF (Next.js API Routes).

### 2.3 Migrations (Banco de Dados)

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 001 | `supabase/migrations/001_initial_schema.sql` | Tabelas base: orgaos, usuarios, processos, audit_trail |
| 002 | `supabase/migrations/002_feedback_and_profiles.sql` | feedback_termos, perfil_usuario |
| 003 | `supabase/migrations/003_avaliacoes.sql` | avaliacoes_acma, avaliacoes_auditor |
| 004 | `supabase/migrations/004_acma_auditor_learning.sql` | acma_prompts, auditor_thresholds |
| 005 | `supabase/migrations/005_orchestrator.sql` | Orquestrador, mensagens, biblioteca legal, parâmetros |
| 006 | `supabase/migrations/006_pca_compliance_deadlines.sql` | PCA inteligente, compliance, prazos, alertas |
| D1 | `workers/migrations/0001_normalization_tables.sql` | Normalização linguística (D1/SQLite) |
| CH | `clickhouse/migrations/001-003` | Métricas ACMA, AUDITOR, Dashboard |

---

## 3. Agentes (6 Componentes)

### 3.1 Orquestrador (Maestro) — ZERO LLM

**Arquivo:** `workers/src/orchestrator/engine.ts`

State machine determinística com 12 estados e 5 decisões de usuário. Não usa LLM — toda lógica é pura.

**12 Estados:**
```
RASCUNHO → COLETANDO_DADOS → SUGESTAO_ACMA → TEXTO_APROVADO →
GERANDO_DOCUMENTO → GERADO → AUDITANDO → AUDITADO →
AGUARDANDO_DECISAO → EDITANDO → FINALIZADO / DESCARTADO
```

**5 Decisões do Usuário:**
1. `APROVAR` — aceita documento, calcula selo, avança trilha
2. `EDITAR` — modo edição, regenera + reaudita
3. `NOVA_SUGESTAO` — novo texto ACMA (máx. 3 por seção)
4. `PROSSEGUIR` — avança sem selo (silencioso, Part 19)
5. `DESCARTAR` — cancela documento

**2 Pontos de Parada Humana:**
1. `SUGESTAO_ACMA` — humano revisa texto sugerido
2. `AGUARDANDO_DECISAO` — humano decide após auditoria

**Tudo entre paradas = 100% automático.**

### 3.2 Insight Engine — LLM

**Arquivo:** `workers/src/orchestrator/agents.ts` (função `callInsightEngine`)

Consulta paralela a 7+ fontes:
- PNCP — preços de referência
- IBGE — dados do município
- Portal Transparência — sanções (CEIS, CNEP, CEPIM)
- TCU — jurisprudência relevante
- Perfil do usuário — preferências aprendidas
- Parâmetros do órgão — logo, brasão, autoridades
- Biblioteca Legal — normativos globais + locais

Retorna `EnrichedContext` com cards para o frontend.

### 3.3 ACMA v3 — LLM

**Arquivo:** `workers/src/orchestrator/agents.ts` (função `callACMA`)
**Prompt Builder:** `workers/src/acma/prompt-builder.ts`

Gerador de texto com 8 camadas de blindagem:
1. Padrões aprendidos de aprovações anteriores
2. Perfil do usuário (terminologia, região)
3. Contexto do Insight Engine (dados oficiais)
4. Normativos aplicáveis por tipo de documento
5. LINDB (proteção do gestor)
6. Cache KV (1h TTL) para reuso
7. Seleção automática de tier (Haiku 80%, Sonnet 15%, Opus 5%)
8. Revisão humana obrigatória (ponto de parada 1)

### 3.4 DESIGN_LAW v3.1 — ZERO LLM

**Arquivo:** `workers/src/orchestrator/agents.ts` (função `callDesignLaw`)

Geração determinística de documentos:
- Carrega YAML config → aplica template HTML → hash SHA-256 → upload R2
- Template base: `documento_base_v8.html` (15 blocos Legal Design)
- Identidade visual: Palatino Linotype, escala áurea, WCAG AA
- Zonas de edição: editável / protegido / revisável / bloqueado
- Modo claro/escuro + impressão P&B

### 3.5 AUDITOR v3 — Híbrido

**Arquivo:** `workers/src/orchestrator/agents.ts` (função `callAuditor`)
**Calibração:** `workers/src/auditor/calibration.ts`

Auditoria em 3 camadas (LLM + Lookup + Fórmula):
1. **LLM interpreta** — para cada item do checklist, LLM analisa conformidade
2. **Lookup fundamenta** — thresholds calibrados por tipo de documento + setor
3. **Fórmula decide** — score ponderado + tripartição

**Tripartição (veredicto):**
- `CONFORME` — 0 não-conformidades críticas, score ≥ 80
- `RESSALVAS` — não-conformidades altas ou >2 itens ou score < 80
- `NAO_CONFORME` — não-conformidade crítica ou score < 50

**Checklists por documento:** ETP (7 itens), TR (6), DFD (4), PP (5), JCD (5), genérico (4).

### 3.6 LEGAL_SYNC — ZERO LLM

Singleton que monitora DOU, atualiza lookup tables via Cron. Mantém `biblioteca_legal_global` sincronizada com legislação vigente.

---

## 4. Fluxo Cíclico Completo

### 4.1 Pipeline Automático

**Arquivo:** `workers/src/orchestrator/pipeline.ts`

```
RASCUNHO
  ↓ (automático)
COLETANDO_DADOS ← Insight Engine consulta 7+ APIs em paralelo
  ↓ (automático)
SUGESTAO_ACMA ← ACMA gera texto com dados oficiais
  ↓ ★ PARADA 1: humano revisa texto
  ↓ [APROVAR] [EDITAR] [NOVA_SUGESTAO] [DESCARTAR]
TEXTO_APROVADO
  ↓ (automático)
GERANDO_DOCUMENTO ← DESIGN_LAW gera PDF (zero LLM)
  ↓ (automático)
GERADO
  ↓ (automático)
AUDITANDO ← AUDITOR verifica conformidade (híbrido)
  ↓ (automático)
AUDITADO
  ↓ (automático)
AGUARDANDO_DECISAO ← Frontend mostra parecer + checklist
  ↓ ★ PARADA 2: humano decide
  ↓ [APROVAR → selo + avança trilha]
  ↓ [EDITAR → volta DESIGN_LAW → AUDITOR → loop]
  ↓ [NOVA_SUGESTAO → volta ACMA → loop]
  ↓ [PROSSEGUIR → sem selo + avança trilha]
  ↓ [DESCARTAR → fim]
FINALIZADO → próximo documento da trilha (auto-loop)
```

### 4.2 Trilha de Documentos por Modalidade

**Arquivo:** `workers/src/orchestrator/trail.ts`

| Modalidade | Documentos (em ordem) | Total |
|------------|----------------------|-------|
| Pregão | PCA → DFD → ETP → PP → TR → MR → JCD | 7 |
| Dispensa | DFD → JCD | 2 |
| ARP (Ata de Registro de Preços) | PCA → DFD → ETP → PP → TR → MR → JCD → OFG → AUG → OFF → ACF → COM → REC → ARP | 14 |
| Credenciamento | DFD → ETP → TR → EDL | 4 |

### 4.3 Limites de Iteração

- Máx. 3 sugestões ACMA por seção (`sugestoes_restantes`)
- Máx. 5 reauditorias por documento (`reauditorias_restantes`)
- Contadores resetam ao avançar para próximo documento da trilha

### 4.4 Selo de Qualidade ATA360

**Arquivo:** `lib/schemas/selo.ts`

Regra de cálculo:
```
CONFORME → selo PRESENTE
RESSALVAS + APROVAR → selo PRESENTE
NAO_CONFORME + PROSSEGUIR → selo AUSENTE (silencioso, Part 19)
```

Visual: selo holográfico circular, fundo transparente, efeito ouro/iridescente.
Textos: "CERTIFICADO DE QUALIDADE ATA360" / "GOVERNANÇA OURO" / "INFRAESTRUTURA DE DADOS OFICIAIS DO BRASIL"

---

## 5. PCA Inteligente

### 5.1 Conceito

O PCA (Plano de Contratações Anual) é o PRIMEIRO documento de qualquer trilha em Pregão e ARP. O ATA360 trata o PCA como um documento VIVO que é atualizado continuamente.

### 5.2 Sugestão Automática de PCA

Quando um órgão adere ao ATA360 sem PCA:
1. Sistema consulta dados históricos do ente (PNCP, Compras.gov, execução orçamentária)
2. Analisa padrões de compras dos últimos 3 anos
3. Sugere PCA com base em:
   - Itens recorrentes (material de escritório, TI, limpeza, etc.)
   - Sazonalidade de compras
   - Dotação orçamentária disponível
   - Demandas setoriais identificadas
4. PCA sugerido passa pelo ciclo completo (ACMA → revisão → DESIGN_LAW → AUDITOR)

### 5.3 Conciliação com PCA Existente

Se órgão já possui PCA:
1. Importa PCA existente (Excel/PDF/HTML)
2. Compara com execução real
3. Identifica desvios (itens não contratados, prazos vencidos, orçamento divergente)
4. Sugere adaptações e atualizações
5. Todos os processos são conciliados com o PCA vigente

### 5.4 PCA Vivo

Armazenado em `parametros_membro` (categoria `pca_vivo`):
- Atualizado a cada novo processo
- Memória de conversas contínuas por usuário
- Histórico de decisões e preferências

---

## 6. Normalização Linguística

### 6.1 Pipeline de 6 Camadas

**Arquivos:** `workers/src/normalization/*.ts`

```
Texto Original
  ↓ tokenizer.ts      — quebra em tokens, limpa acentos
  ↓ abreviaturas.ts   — expande abreviações (un. → unidade)
  ↓ sinonimos.ts      — mapeia sinônimos (papel A4 → papel sulfite A4)
  ↓ regionalismos.ts  — normaliza regionalismos (cheiro-verde → coentro+cebolinha)
  ↓ marcas.ts         — remove marcas genéricas (Bombril → esponja de aço)
  ↓ semantico.ts      — busca vetorial CATMAT/CATSER via Vectorize
Texto Normalizado + CATMAT/CATSER sugeridos
```

### 6.2 Dados de Referência (D1)

- 337K códigos CATMAT (material)
- 35K códigos CATSER (serviço)
- 1.2K UASGs (unidades gestoras)
- 127 sinônimos, 43 regionalismos, 13 marcas genéricas (expandindo)

---

## 7. Machine Learning & Learning Loops

### 7.1 ACMA Learning

**Arquivos:** `workers/src/acma/edit-delta.ts`, `workers/src/acma/prompt-builder.ts`

- Registra edições do usuário (delta entre sugerido e aprovado)
- Extrai padrões de escrita preferidos
- Injeta padrões em prompts futuros
- Cron semanal: `improve-prompts` (dom 3h) — melhora prompts com dados acumulados

### 7.2 AUDITOR Calibration

**Arquivo:** `workers/src/auditor/calibration.ts`

- Registra resultados de auditoria por tipo + setor
- Ajusta pesos e severidades com base em aprovações/rejeições
- Cron mensal: `calibrate-auditor` (dia 1, 4h)
- Thresholds são INTERNOS (Part 19) — nunca expostos

### 7.3 Profile Learning

**Arquivo:** `workers/src/profile/learner.ts`

- Aprende terminologia preferida do usuário
- Identifica segmento principal (saúde, TI, obras, etc.)
- Extrai termos frequentes e padrões de escrita
- Debounce: aprende a cada 5 mensagens
- Memória ampla de conversas contínuas por usuário

### 7.4 Feedback de Termos

**Arquivo:** `workers/src/routes/feedback.ts`

- Usuário valida/corrige normalizações
- Feedback propaga para melhorar pipeline
- Cron 6h: `propagate-feedback`

---

## 8. Glossário Legal

### 8.1 Lei 14.133/2021 — Nova Lei de Licitações

Lei principal que rege contratações públicas no Brasil. Substituiu as Leis 8.666/1993 e 10.520/2002.

### 8.2 LINDB (Lei 13.655/2018)

Proteção do gestor público. 6 artigos aplicados no ATA360:

| Artigo | Ementa | Aplicação no ATA360 |
|--------|--------|---------------------|
| Art. 20 | Decisões com base em consequências práticas | AUDITOR considera impacto real |
| Art. 21 | Regime de transição proporcional | Transições suaves entre versões de lei |
| Art. 22 | Consideração de dificuldades reais do gestor | ACMA adapta complexidade ao ente |
| Art. 23 | Regime de transição para mudanças de lei | LEGAL_SYNC monitora transições |
| Art. 28 | Responsabilização pessoal só com dolo/erro grosseiro | AUDITOR distingue graus de culpa |
| Art. 30 | Compensação por invalidade retroativa | Proteção contra anulações |

### 8.3 Normativos Aplicados

- **Dec. 12.807/2025** — Valores atualizados de dispensa/inexigibilidade
- **Dec. 11.878/2024** — Regulamentação da Lei 14.133
- **IN SEGES 75/2024** — Instrução normativa de planejamento
- **IN SEGES/MGI 52/2025** — Pesquisa de preços
- **IN SGD 94/2022** — Contratação de TIC
- **Manual TCU 5ª Ed. (2025)** — Orientações de contratação
- **LGPD (Lei 13.709/2018)** — Proteção de dados pessoais
- **Dec. 7.746/2012** — Sustentabilidade nas contratações
- **Dec. 10.947/2022** — PCA obrigatório

### 8.4 Modalidades de Contratação

| Modalidade | Valor Limite (Dec. 12.807) | Trilha ATA360 |
|-----------|---------------------------|---------------|
| Pregão | Bens e serviços comuns (sem limite) | 7 documentos |
| Dispensa por valor | Até R$ 59.906,02 (bens) / R$ 119.812,08 (obras) | 2 documentos |
| ARP (Ata Registro Preços) | Sem limite específico | 14 documentos |
| Credenciamento | Sem limite | 4 documentos |

---

## 9. Segurança e Compliance

### 9.1 Regras de Sigilo (Part 19)

**Dados que VÃO nos artefatos/PDFs:**
- Dados do processo, preços PNCP, fundamentação legal
- Resultado do AUDITOR (veredicto: CONFORME/RESSALVAS/NAO_CONFORME)
- Checklist público (sem pesos/severidades)
- Selo "Powered by ATA360"

**Dados que NUNCA vão nos artefatos/PDFs/frontend:**
- Nomes de agentes internos
- Configurações YAML
- Prompts LLM
- Modelos de IA utilizados
- Scores internos, fórmulas, pesos, thresholds
- Credenciais SERPRO
- Dados de outros tenants

### 9.2 Regras do Chat

O chat do ATA360 segue regras rígidas:

1. **NUNCA informa dados internos** — stack, modelos, plataformas, estratégias
2. **NUNCA revela arquitetura** — nomes de agentes, fluxos internos, YAMLs
3. **Anti-manipulação** — detecta tentativas de extrair informações privilegiadas
4. **Anti-fraude** — detecta tentativas de fraudar procedimentos licitatórios
5. **Imparcialidade** — não favorece fornecedores, não cria direcionamentos
6. **Base legal** — toda orientação fundamentada em legislação vigente
7. **Dados reais** — NUNCA inventa dados, fontes ou leis
8. **Transparência** — posicionamento ético indiscutível

### 9.3 Posicionamento ATA360

- **NÃO bloqueia procedimentos** — entende que a decisão administrativa é autossuficiente e ampla
- **Respeita autonomia** — desde que respeitados todos os poderes e leis
- **NÃO se prende a tecnicidades excessivas** — considera realidade do ente público
- **Intermediador imparcial** — justificativas fundamentadas, éticas e documentadas
- **Considera contexto** — orçamento, urgência, momento da compra, razoabilidade
- **Legalidade total** — amplo conjunto de leis, todos os prazos legais
- **Prevenção proativa** — alerta e instrui antes que problemas aconteçam
- **Liberdade de decisão** — ampla liberdade de decisão crítica e interferência do servidor

### 9.4 Compliance CGU — Programa de Integridade

Baseado nos materiais da Controladoria-Geral da União (Portaria CGU 226/2025):

**5 Pilares de Integridade:**
1. Comprometimento da liderança
2. Instância responsável
3. Análise de riscos
4. Regras e instrumentos
5. Monitoramento contínuo

**Dimensões do Programa:**
- Código de Conduta Ética
- Canal de Denúncias (terceirizado/independente)
- Due Diligence de terceiros
- Treinamento de compliance
- Avaliação de integridade
- Gestão de riscos de integridade
- Transparência e prestação de contas

### 9.5 Certificações e Selos Buscados

| Programa | Órgão | Requisitos-chave |
|----------|-------|------------------|
| Empresa Pró-Ética | CGU | Programa de integridade, canal de denúncias, due diligence |
| Empresa Ética | ABES | Governança de software, ética em dados |
| Selo Diamante | TCU | Transparência, conformidade, accountability |
| Programa Integridade | TCE-MG | Controles internos, prevenção |
| Selo ESG | Diversos | Ambiental, Social, Governança |

### 9.6 Lei Anticorrupção (Lei 12.846/2013)

ATA360 implementa:
- Prevenção de irregularidades administrativas
- Detecção de condutas ilícitas
- Canais de reporte
- Treinamento e conscientização
- Medidas corretivas

### 9.7 ESG e ODS/ONU

**Objetivos de Desenvolvimento Sustentável atendidos:**
- ODS 16: Paz, Justiça e Instituições Eficazes (governança, transparência)
- ODS 9: Indústria, Inovação e Infraestrutura (transformação digital)
- ODS 12: Consumo e Produção Responsáveis (compras sustentáveis)
- ODS 5: Igualdade de Gênero (diversidade, respeito)
- ODS 10: Redução das Desigualdades (acesso igualitário)
- ODS 17: Parcerias e Meios de Implementação (dados abertos)

**Métricas ESG:**
- **E (Ambiental):** % de compras com critérios sustentáveis (Dec. 7.746), redução de papel
- **S (Social):** Diversidade de fornecedores, acessibilidade WCAG AA, inclusão digital
- **G (Governança):** Conformidade legal, transparência, audit trail, canal de denúncias

---

## 10. Controle de Prazos

### 10.1 Sistema de Alertas

Prazos controlados em todas as fases, procedimentos, atos, artefatos e contratos:

**Níveis de alerta:**
- `INFORMATIVO` (azul) — prazo distante, apenas informação
- `ATENCAO` (amarelo) — prazo se aproximando (50% do tempo restante)
- `URGENTE` (laranja) — menos de 25% do tempo restante
- `CRITICO` (vermelho) — prazo vencido ou vencendo em 24h

**Destinatários:**
- `MEMBRO` — alerta individual para o servidor responsável
- `SETOR` — alerta para todo o setor/departamento
- `ORGAO` — alerta para o ente público inteiro
- `GERAL` — alertas sistêmicos (mudanças de lei, etc.)

### 10.2 Prazos Legais Monitorados

| Ato | Prazo | Base Legal |
|-----|-------|-----------|
| Publicação do PCA | Até 31/dez do ano anterior | Dec. 10.947/2022 |
| Publicação do DFD | Com o PCA | Art. 12, VII |
| Fase preparatória | Sem prazo fixo (razoabilidade) | Art. 18 |
| Pesquisa de preços | 12 meses de validade | IN 65/2021 |
| Publicação do edital | Mín. 8 dias úteis (pregão) | Art. 55 |
| Impugnação do edital | Até 3 dias úteis antes abertura | Art. 164 |
| Vigência contrato | Até 5 anos (regra geral) | Art. 105 |
| Publicação PNCP | Até 20 dias úteis | Art. 174 |

---

## 11. Assinatura Eletrônica

### 11.1 Cláusula de Aceitação

Todos os documentos gerados pelo ATA360 incluem cláusula expressa:

> "Os signatários deste documento declaram aceitar a assinatura eletrônica como forma válida de manifestação de vontade, nos termos da Lei 14.063/2020 (Lei de Assinatura Eletrônica), do Decreto 10.543/2020 e da Medida Provisória 2.200-2/2001 (ICP-Brasil)."

### 11.2 Registro de Autenticação

Cada assinatura registra:
- IP do signatário
- Método de autenticação (Gov.br, ICP-Brasil, certificado digital)
- Timestamp com carimbo SERPRO
- User-Agent do navegador
- Geolocalização (opcional, com consentimento)
- Hash SHA-256 do documento no momento da assinatura

### 11.3 Níveis de Assinatura (Lei 14.063/2020)

- **Simples** — Gov.br conta verificada
- **Avançada** — Gov.br nível prata/ouro
- **Qualificada** — ICP-Brasil (certificado digital)

---

## 12. Biblioteca Legal (Dual)

### 12.1 Global (SuperADM Dashboard)

Tabela `biblioteca_legal_global` — base legal centralizada:
- Leis, decretos, portarias, INs, resoluções
- Acórdãos TCU, súmulas, manuais
- Normas técnicas (ABNT, ANVISA)
- Legislação setorial (saúde, TI, obras, educação)
- Normativos CGU, AGU, TCE-MG/SP/RJ/ES/DF, MP
- Atualizada por SuperADM + agente LEGAL_SYNC

### 12.2 Órgão (Configurações do Usuário)

Tabela `biblioteca_legal_orgao` — base legal exclusiva do ente:
- Portarias e decretos complementares próprios
- Regimento interno
- Instruções normativas locais
- SEM interferência com demais órgãos (RLS por `orgao_id`)

---

## 13. Parâmetros (3 Níveis)

### 13.1 Globais (Sistema)

Tabela `parametros_globais`:
- Limites de dispensa, configurações de agentes
- Valores de referência financeiros
- Gerenciados pelo SuperADM

### 13.2 Órgão (Institucionais)

Tabela `parametros_orgao`:
- Logo, brasão, dados do ente
- Autoridades (prefeito, secretários)
- Endereço, contato, documentação
- Dados financeiros (orçamento, FPM)

### 13.3 Membro (Pessoais)

Tabela `parametros_membro`:
- Foto, cargo, matrícula
- Assinatura digital
- Preferências de interface
- PCA vivo (atualizado continuamente)
- Memória ampla de conversas por usuário

---

## 14. APIs Governamentais (76+ endpoints)

| Fonte | Endpoints | Dados |
|-------|-----------|-------|
| PNCP | 29 (PoC) | Atas, contratos, itens, preços, PCA, órgãos |
| Compras.gov/SIASG | 8 | ARP saldo, pesquisa preço, PGC, CATMAT |
| Portal Transparência | 10 | CEIS, CNEP, CEPIM, CEAF, convênios |
| TransfereGov | 6 | Convênios, cronograma, empenhos |
| FNS | 5 | Repasses-dia, pagamentos por bloco |
| FNDE | 5 | PNAE, PDDE, PNATE, FUNDEB, PROINFANCIA |
| IBGE | 4 | Municípios, PIB, IDH, população |
| Câmara | 4 | Deputados, proposições, votações |
| Senado/SIGA | 3 | Dados abertos, SIGA Brasil |
| TCU | 2 | Acórdãos, responsáveis |
| SICONFI/Tesouro | 4 | FINBRA, receita, despesa, LRF |
| BCB | 4 | IPCA, IGP-M, Selic, Dólar |
| SERPRO | 17 | NFe, CNPJ, CPF, DataValid, CND, Faturamento |

---

## 15. Ouvidoria e Canal de Denúncias

### 15.1 Requisitos (CGU Empresa Ética + ABES)

- Canal terceirizado e independente
- Anonimato garantido
- Prazo de resposta: até 30 dias
- Proteção ao denunciante
- Rastreabilidade de denúncias
- Relatórios periódicos

### 15.2 Funcionalidades (Frontend)

- Modal completo de ouvidoria
- Formulário de denúncia anônima
- Acompanhamento por protocolo
- Categorias: ética, assédio, corrupção, irregularidade, sugestão, elogio
- Integração com Comissão de Ética Pública (CEP)

---

## 16. Catálogo de Artefatos (46 tipos)

### 16.1 Arquitetura Config-Driven

Template universal `documento_base_v8.html` renderiza QUALQUER tipo via YAML + Jinja2.
Novo artefato = nova entrada YAML (~30-50 linhas), ZERO código.

### 16.2 Inventário

- **14 existentes** (v7.1): PCA, DFD, ETP, PP, TR, MR, JCD, ARP, OFG, AUG, OFF, ACF, COM, REC
- **6 P0 novos** (YAML pronto): CDF, ALF, ALP, ALV, RPP, PAU
- **11 P1** (pendente): EDL, MIN, PJU, CTR, OSD, DFI, TAR, RFI, RAC, DRC, RRE
- **15 P2** (roadmap): AHL, ATA, RAD, RHM, TER, GAR, TRD, TRP, ALC, NMP, RDG, SAP, RPC, MCO, PGC

---

## 17. Estrutura de Arquivos

```
v0-ata-360-chatbot-ui/
├── app/                           # Next.js App Router
│   ├── api/                       # BFF Routes (proxy → Workers)
│   │   ├── processo/              # Processo CRUD + chat + decisão
│   │   ├── dashboard/             # Métricas SuperADM
│   │   └── publicar/              # Assinatura + PNCP
│   ├── (auth)/                    # Páginas de autenticação
│   └── (main)/                    # Páginas principais
├── components/                    # React Components (shadcn/ui)
├── hooks/                         # React Hooks
│   └── use-process.ts             # Estado do processo + trilha
├── lib/                           # Lógica compartilhada
│   ├── api.ts                     # Cliente API (BFF → Workers)
│   ├── schemas/                   # Zod schemas
│   │   ├── process.ts             # Estados, decisões, trilha
│   │   └── selo.ts                # Selo ATA360
│   └── supabase/                  # Tipos Supabase
├── workers/                       # Cloudflare Workers
│   ├── src/
│   │   ├── index.ts               # Entry point (Hono)
│   │   ├── orchestrator/          # Orquestrador (Maestro)
│   │   │   ├── types.ts           # Tipos internos (Part 19)
│   │   │   ├── engine.ts          # State machine
│   │   │   ├── agents.ts          # Delegação aos 4 agentes
│   │   │   ├── pipeline.ts        # Pipeline automático
│   │   │   ├── trail.ts           # Trilha de documentos
│   │   │   └── chat-router.ts     # Roteamento de mensagens
│   │   ├── normalization/         # Pipeline de normalização (6 camadas)
│   │   ├── acma/                  # ACMA learning + prompts
│   │   ├── auditor/               # AUDITOR calibração
│   │   ├── profile/               # Profile learning
│   │   ├── routes/                # Rotas Hono
│   │   └── cron/                  # Cron triggers
│   └── migrations/                # D1 migrations
├── supabase/                      # Supabase config
│   └── migrations/                # PostgreSQL migrations (001-006)
├── clickhouse/                    # ClickHouse config
│   └── migrations/                # Métricas (001-003)
├── configs/                       # YAML configs
├── templates/                     # HTML templates (Legal Design)
├── specs/                         # Especificações técnicas
└── memory/                        # Memória do projeto
```

---

## 18. Cron Jobs

| Trigger | Frequência | Função |
|---------|-----------|--------|
| `propagate-feedback` | A cada 6h | Propaga feedback de termos para pipeline |
| `improve-prompts` | Semanal (dom 3h) | Melhora prompts ACMA com dados acumulados |
| `calibrate-auditor` | Mensal (dia 1, 4h) | Calibra thresholds do AUDITOR |
| `check-deadlines` | A cada 1h | Verifica prazos e dispara alertas |
| `legal-sync` | Diário (2h) | Sincroniza legislação via DOU |
| `pca-reconciliation` | Semanal (seg 6h) | Concilia PCA vivo com execução |

---

> **ATA360** — Decisões baseadas em dados que transformam as compras públicas.
> Orientamos e construímos processos reais em prol da sociedade e do poder público,
> com responsabilidade e robustez de dados.
