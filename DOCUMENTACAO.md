# ATA360 — Documentação Técnica Completa

> **Versão:** 8.2.1 — 10/fev/2026
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
│   └── migrations/                # PostgreSQL migrations (001-008)
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

## 19. Alinhamento PBIA / FINEP / SICX

### 19.1 PBIA 2024-2028 (Resolução CCT nº 4/2024)

ATA360 é classificado como **ALTO RISCO** conforme PL 2.338/2023 (Art. 14) — sistema de IA utilizado pela administração pública para avaliar critérios em contratações.

**Princípios atendidos:**

| Princípio | Status | Implementação |
|-----------|--------|---------------|
| Supervisão humana | ✅ CONFORME | 2 pontos de parada obrigatórios |
| Transparência | ✅ CONFORME | Audit trail SHA-256, fundamentação legal |
| Não discriminação | ✅ CONFORME | Dados oficiais PNCP/IBGE/TCU |
| Responsabilidade | ✅ CONFORME | Decisão humana soberana + LINDB |
| Segurança | ✅ CONFORME | Chat Guard + sanitizeResponse + Part 19 |
| Proteção de dados | ✅ CONFORME | RLS multi-tenant + LGPD |
| Explicabilidade | ✅ CONFORME | Canal explicação via ouvidoria |
| Governança | ⚠️ PARCIAL | AIA implementado, política formal pendente |
| Bem-estar social | ✅ CONFORME | LINDB Art. 22 + ODS ONU |
| Legalidade | ✅ CONFORME | Lei 14.133 + LINDB + LGPD + CGU/TCU |

### 19.2 Avaliação de Impacto Algorítmico (AIA)

**Arquivo YAML:** `configs/documentos-config.yaml` — tipo `AIA`
**Migration:** `supabase/migrations/007_pbia_sicx_alignment.sql`
**Tabela:** `aia_avaliacoes`

Documento obrigatório conforme PL 2.338/2023, Art. 29. Contém 10 seções:
1. Identificação do sistema
2. Classificação de risco
3. Descrição do funcionamento
4. Análise de riscos e impactos
5. Medidas de mitigação
6. Supervisão e intervenção humana
7. Transparência e explicabilidade
8. Proteção de dados pessoais
9. Auditabilidade e rastreabilidade
10. Parecer conclusivo

Periodicidade: anual (mínimo).

### 19.3 Código de Conduta de IA

**Arquivo:** `workers/src/compliance/codigo-conduta-ia.ts`
**Classificação:** PÚBLICO (pode ser publicado no site institucional)
**Endpoint:** `GET /api/aia?view=codigo-conduta`

Derivado das `ATA360_SYSTEM_RULES` (chat-guard.ts), com 10 princípios publicáveis e compromissos com o PBIA.

### 19.4 Direito à Explicação

**Endpoint:** `POST /api/v1/ouvidoria/explicacao`
**Protocolo:** `EXP-YYYYMMDD-XXXXX`
**Prazo:** 15 dias (PL 2.338/2023, Art. 7º + LGPD Art. 20)

Qualquer pessoa afetada por decisão assistida pelo ATA360 pode solicitar explicação sobre critérios e dados utilizados.

### 19.5 FINEP — Oportunidades de Financiamento 2026

| Programa | Fit ATA360 | Valor | Deadline |
|----------|-----------|-------|----------|
| IA para Poder Público (Rod. 4) | MÁXIMO | R$24M (não reembolsável) | Aguardando |
| Tecnologias Digitais | ALTO | R$300M | 31/08/2026 |
| FNDCT Subvenção Econômica | MÉDIO | R$800M | Semestral |

**Requisito Tecnologias Digitais:** Parceria com ICT obrigatória (universidade ou instituto de pesquisa).

### 19.6 SICX — Sistema de Compras Expressas (Lei 15.266/2025)

**Posicionamento:** ATA360 **NÃO** é produto no catálogo SICX. ATA360 é a ferramenta que ajuda órgãos públicos a operar no SICX.

**Contratação do ATA360:** Via pregão, inexigibilidade (Art. 74, III — notória especialização) ou diálogo competitivo (Art. 32).

**Preparação implementada:**
- Campo `via_credenciamento` em `pca_itens` (indica elegibilidade para credenciamento)
- Campo `sicx_disponivel` e `sicx_catalogo_ref` em `pca_itens`
- Artefato JCC (Justificativa de Contratação por Credenciamento, Art. 79, IV)
- YAML JCC com seção específica de enquadramento SICX

**Nota:** Gov.br é exclusivo para órgãos públicos e cidadãos acessando serviços públicos. NÃO se aplica ao ATA360 como empresa privada SaaS.

---

## 20. Migrations

| # | Arquivo | Conteúdo |
|---|---------|----------|
| 001 | `001_initial_schema.sql` | Tabelas base: orgaos, usuarios, processos, audit_trail |
| 002 | `002_feedback_and_profiles.sql` | feedback_termos, perfil_usuario |
| 003 | `003_avaliacoes.sql` | avaliacoes_acma, avaliacoes_auditor |
| 004 | `004_acma_auditor_learning.sql` | acma_prompts, auditor_thresholds |
| 005 | `005_orchestrator.sql` | Orquestrador, mensagens, biblioteca legal |
| 006 | `006_pca_compliance_deadlines.sql` | PCA inteligente, compliance, prazos, assinatura, ouvidoria |
| 007 | `007_pbia_sicx_alignment.sql` | AIA, SICX campos, ouvidoria explicação, compliance PBIA |
| 008 | `008_pricing_contracting.sql` | Precificação, simulações, contratações ATA360, adesão ARP |

---

## 21. Precificação Universal e Contratação

### 21.1 Equação Universal de Precificação

```
Preço Anual = max(PISO, PISO × (BASE / BASE_MIN) ^ α)
```

**Parâmetros 2026:**
| Parâmetro | Valor | Fonte |
|-----------|-------|-------|
| PISO | R$ 38.900,00 | Menor investimento anual |
| BASE_MIN | R$ 5.000.000 | Base fiscal mínima de referência |
| α (alpha) | 0,35 | Expoente sub-linear (maior base → menor alíquota proporcional) |
| Limite dispensa | R$ 65.492,11 | Decreto 12.807/2025 |

**Princípios:** Transparência (fórmula pública), Proporcionalidade, Universalidade, Equidade, Verificabilidade.

**NÃO** são planos fixos. Preço é calculado individualmente. 5 categorias (essencial, básico, intermediário, avançado, enterprise) são apenas para identificação de grupos no sistema.

### 21.2 Hierarquia de Base de Cálculo

1. **Primária:** Contratações PNCP (dados públicos verificáveis)
2. **Subsidiária:** Orçamento LOA (transparência fiscal)
3. **Proxy:** Fiscal (FPM/FPE, para entes sem dados PNCP)

### 21.3 Coeficientes FPM

Fonte: DN TCU 219/2025 + DL 1.881/1981. 18 faixas populacionais, coeficientes 0,6 a 4,0.

### 21.4 Modalidades de Contratação (6)

| Modalidade | Fundamento | Quando usar |
|-----------|-----------|------------|
| Dispensa Eletrônica | Art. 75, II + Dec. 12.807/2025 | Preço ≤ R$65.492,11 |
| Inexigibilidade | Art. 74, I | Preço > R$65.492,11 (exclusividade técnica) |
| Adesão a ARP | Art. 86 | ATA vigente disponível |
| Diálogo Competitivo | Art. 32 | Solução inovadora sem spec definida |
| Contratação de Inovação | Art. 81 (ETEC) | Encomenda tecnológica |
| Emenda Parlamentar | EC 105/2019 + LDO | Recurso RP6/RP7/RP8 disponível |

### 21.5 Vigência Contratual

- **Padrão:** 1 ano renovável até 5 anos (Art. 106)
- **TIC (longa duração):** até 10 anos (Art. 106-107)
- **Renovação:** Automática com cláusula expressa (Art. 107)
- **Adesão ARP:** Restante da vigência da ATA mãe

### 21.6 Autocontratação (Prova de Fogo)

O ATA360 gera os próprios documentos de contratação:
1. Calcula preço pela equação universal
2. Recomenda modalidade
3. Gera PCA automaticamente (`POST /api/contratacao?action=auto-pca`)
4. Trilha de documentos conforme modalidade
5. CATSER: 27502 (dev/manutenção software) ou 26123 (processamento dados)

### 21.7 Adesão a ARP Online (Art. 86)

Fluxo digital com 6 etapas:
1. **Busca:** Localizar ATA com saldo via PNCP (`quantidadeEmpenhada`)
2. **Análise:** Verificar saldo e vigência (Art. 86, §4º e §5º)
3. **Solicitação:** Docs + link enviados ao gerenciador
4. **Gerenciador:** Autorização (via link externo se não-usuário)
5. **Fornecedor:** Aceite (via link externo se não-usuário)
6. **Conclusão:** 10 documentos gerados automaticamente

**Limites Art. 86:** 50% do total (§4º), 50% por órgão aderente (§5º).

### 21.8 API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/pricing?view=simular&base=X` | GET | Simular preço |
| `/api/pricing?view=tabela` | GET | Tabela referência (SuperADM) |
| `/api/pricing?view=parametros` | GET | Parâmetros vigentes |
| `/api/pricing?view=categorias` | GET | 5 categorias |
| `/api/pricing?view=modalidades` | GET | 6 modalidades |
| `/api/pricing?view=fpm` | GET | Coeficientes FPM |
| `/api/contratacao` | POST | Iniciar contratação |
| `/api/contratacao?action=auto-pca` | POST | PCA automático |
| `/api/contratacao?orgaoId=X` | GET | Listar contratações |
| `/api/adesao-arp` | POST | Iniciar adesão |
| `/api/adesao-arp?orgaoId=X` | GET | Listar adesões |

---

## 22. Revisão Integral v8.2.1 — 10/fev/2026

Revisão completa do codebase com foco em conformidade, segurança, custos e rigor estatístico.

### 22.1 Roteamento de Modelos IA (agents.ts)

**Problema:** `tierToModel()` usava nomes de modelo obsoletos (`@cf/anthropic/claude-3-*`), incompatíveis com AI Gateway.

**Correção:** Modelos atualizados para nomes corretos do Cloudflare AI Gateway:
- Haiku: `@cf/anthropic/claude-haiku-4-5-20251001` (80% das chamadas — triagem, normalização)
- Sonnet: `@cf/anthropic/claude-sonnet-4-5-20250929` (15% — geração de texto, análise)
- Opus: `@cf/anthropic/claude-opus-4-6` (5% — JCD, AIA, fundamentação jurídica)

**selectTier():** Adicionada seleção de `opus` para documentos JCD/AIA e seções de fundamentação legal.

**AUDITOR:** Modelo alterado de `@cf/meta/llama-3.1-8b-instruct` (insuficiente para conformidade legal) para Claude Sonnet 4.5.

### 22.2 Tabela de Custos por Token (ai-gateway.ts)

Adicionada `TOKEN_COST_TABLE` com custos USD/1M tokens para 7 modelos + embedding:

| Modelo | Input (USD/1M) | Output (USD/1M) |
|--------|----------------|-----------------|
| Claude Opus 4.6 | $15.00 | $75.00 |
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.80 | $4.00 |
| GPT-4o | $2.50 | $10.00 |
| GPT-4o-mini | $0.15 | $0.60 |
| Gemini 2.0 Flash | $0.10 | $0.40 |
| text-embedding-3-small | $0.02 | — |

**CUSTO_ESTIMADO_POR_OPERACAO:** Custos estimados por tipo de operação (acma_sugestao, auditor_check, chat, embedding, insight_engine) e compostos por artefato/trilha.

### 22.3 Fórmulas Estatísticas — IN SEGES 65/2021

Implementada `calcularEstatisticaPrecos()` em `pricing/engine.ts` com metodologia completa:

- **Média aritmética:** `Σ(xi) / n`
- **Mediana:** Interpolação posicional (par/ímpar)
- **Desvio padrão (Bessel):** `√(Σ(xi - x̄)² / (n-1))`
- **Coeficiente de variação:** `CV = σ/x̄` (>25% indica alta dispersão — TCU Acórdão 1.445/2015-P)
- **IQR outlier removal:** Fences de Tukey `[Q1 - 1.5×IQR, Q3 + 1.5×IQR]`
- **Fórmulas transparentes:** Strings prontas para inserção no artefato PDF

`fetchPrecos()` em `agents.ts` atualizado para retornar todas as estatísticas complementares ao `EnrichedContext`.

### 22.4 Segurança e Hardening

| Fix | Arquivo | Detalhe |
|-----|---------|---------|
| Hardcoded localhost | `chat-router.ts` | 2 ocorrências de `http://localhost:8787` → `env.WORKERS_URL` |
| Cross-tenant | `processo.ts` | GET /:id/status sem validação `orgao_id` → adicionada verificação |
| CSP unsafe-inline | `middleware.ts` | `script-src 'unsafe-inline'` → `'nonce-${nonce}' 'strict-dynamic'` |
| Env type safety | `types.ts` | `PORTAL_TRANSPARENCIA_KEY` e `WORKERS_URL` adicionados ao `Env` |
| .env.example | `.env.example` | `PORTAL_TRANSPARENCIA_KEY` documentada |

### 22.5 Dados Cadastrais — lib/empresa-ata360.ts

Arquivo criado com constantes tipadas:

- **EMPRESA_ATA360:** CNPJ 61.291.296/0001-31, razão social, QSA (3 sócios), CNAE, endereço
- **IDENTIDADE_ATA360:** Regras de gênero ("o ATA360" para sistema/IA, "a ATA360" para empresa), cores, selo, tipografia
- **COMPLIANCE_ATA360:** Score CGU integridade (82/100), ESG (ambiental 75, social 88, governança 91), 6 ODS ONU

### 22.6 Arquivos Modificados

| Arquivo | Tipo de Mudança |
|---------|----------------|
| `workers/src/orchestrator/agents.ts` | selectTier (opus), tierToModel (nomes corretos), AUDITOR modelo, fetchPrecos (estatísticas), TOKEN_COSTS |
| `workers/src/orchestrator/chat-router.ts` | Removido hardcoded localhost (2x), type safety env |
| `workers/src/orchestrator/types.ts` | EnrichedContext +9 campos estatísticos, Env +2 campos |
| `workers/src/routes/processo.ts` | Cross-tenant orgao_id validation |
| `workers/src/pricing/engine.ts` | +calcularEstatisticaPrecos() (~90 linhas), +AnaliseEstatisticaPrecos interface |
| `lib/schemas/ai-gateway.ts` | +TOKEN_COST_TABLE, +CUSTO_ESTIMADO_POR_OPERACAO |
| `middleware.ts` | CSP script-src nonce + strict-dynamic |
| `.env.example` | +PORTAL_TRANSPARENCIA_KEY |
| `lib/empresa-ata360.ts` | **NOVO** — dados cadastrais, identidade, compliance |

---

> **ATA360** — Decisões baseadas em dados que transformam as compras públicas.
> Orientamos e construímos processos reais em prol da sociedade e do poder público,
> com responsabilidade e robustez de dados.
