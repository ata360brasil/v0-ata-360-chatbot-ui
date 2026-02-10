/**
 * ATA360 — Orquestrador: Tipos Internos
 *
 * PART 19: Estes tipos são INTERNOS ao Workers.
 * NUNCA exportar para lib/schemas/ ou expor ao frontend.
 * Frontend recebe apenas dados sanitizados via BFF.
 *
 * @see Spec v8 Part 20 — Orquestrador (Maestro)
 * @see Spec v8 Part 19 — Segurança e Sigilo
 */

// ─── Process States & Decisions (mirror de lib/schemas/process.ts) ──────────
// Redefinidos aqui para Workers não depender de Next.js imports

export const PROCESS_STATES = {
  RASCUNHO: 'RASCUNHO',
  COLETANDO_DADOS: 'COLETANDO_DADOS',
  SUGESTAO_ACMA: 'SUGESTAO_ACMA',
  TEXTO_APROVADO: 'TEXTO_APROVADO',
  GERANDO_DOCUMENTO: 'GERANDO_DOCUMENTO',
  GERADO: 'GERADO',
  AUDITANDO: 'AUDITANDO',
  AUDITADO: 'AUDITADO',
  AGUARDANDO_DECISAO: 'AGUARDANDO_DECISAO',
  EDITANDO: 'EDITANDO',
  FINALIZADO: 'FINALIZADO',
  DESCARTADO: 'DESCARTADO',
} as const

export type ProcessState = (typeof PROCESS_STATES)[keyof typeof PROCESS_STATES]

export const USER_DECISIONS = {
  APROVAR: 'APROVAR',
  EDITAR: 'EDITAR',
  NOVA_SUGESTAO: 'NOVA_SUGESTAO',
  PROSSEGUIR: 'PROSSEGUIR',
  DESCARTAR: 'DESCARTAR',
} as const

export type UserDecision = (typeof USER_DECISIONS)[keyof typeof USER_DECISIONS]

export const AUDITOR_VERDICTS = {
  CONFORME: 'CONFORME',
  NAO_CONFORME: 'NAO_CONFORME',
  RESSALVAS: 'RESSALVAS',
} as const

export type AuditorVerdict = (typeof AUDITOR_VERDICTS)[keyof typeof AUDITOR_VERDICTS]

// ─── Pipeline Stages ─────────────────────────────────────────────────────────

export type PipelineStage =
  | 'INSIGHT'
  | 'ACMA'
  | 'DESIGN_LAW'
  | 'AUDITOR'
  | 'PUBLICACAO'

// ─── Document Trail (Part 20.8) ─────────────────────────────────────────────

export interface DocumentTrailItem {
  tipo: string               // ArtifactType: 'PCA', 'DFD', 'ETP', etc.
  status: 'pendente' | 'em_andamento' | 'concluido' | 'pulado'
  versao: number | null
  hash: string | null
  selo_aprovado: boolean | null
  finalizado_em: string | null
}

// Trilha de documentos por modalidade (mirror de lib/schemas/process.ts)
export const TRILHA_DOCUMENTOS: Record<string, string[]> = {
  pregao: ['PCA', 'DFD', 'ETP', 'PP', 'TR', 'MR', 'JCD'],
  dispensa: ['DFD', 'JCD'],
  arp: ['PCA', 'DFD', 'ETP', 'PP', 'TR', 'MR', 'JCD', 'OFG', 'AUG', 'OFF', 'ACF', 'COM', 'REC', 'ARP'],
  credenciamento: ['DFD', 'ETP', 'TR', 'EDL'],
  // v8.2 — Novas modalidades de contratação
  inexigibilidade: ['DFD', 'ETP', 'TR', 'PP', 'JCD'],
  adesao_arp_ata360: [
    'oficio_consulta', 'justificativa_adesao', 'declaracao_compatibilidade',
    'mapa_comparativo', 'autorizacao_gerenciador', 'aceite_fornecedor',
    'termo_adesao', 'extrato_publicacao', 'nota_empenho',
  ],
  dialogo_competitivo: ['DFD', 'ETP', 'TR', 'PP', 'edital_dialogo'],
  contratacao_inovacao: ['DFD', 'ETP', 'TR', 'justificativa_inovacao'],
  emenda_parlamentar: ['DFD', 'plano_trabalho', 'justificativa_destinacao', 'TR', 'PP', 'JCD'],
}

// ─── Enriched Context (Insight Engine output) ────────────────────────────────
// Part 19: dados de APIs governamentais, PNCP, IBGE, etc.
// Nunca expor modelo_usado, tokens, prompts ao frontend.

export interface InsightCard {
  tipo: 'preco' | 'arp' | 'emenda' | 'jurisprudencia' | 'alerta' | 'recurso' | 'sancao' | 'indice' | 'ibge' | 'legal'
  titulo: string
  descricao: string
  fonte: string
  dados?: Record<string, unknown>
  relevancia: number
}

export interface EnrichedContext {
  processo_id: string
  objeto: string
  documento_tipo: string
  // Dados coletados (públicos — podem ir ao frontend como cards)
  cards: InsightCard[]
  // Dados estruturados (internos — alimentam ACMA/AUDITOR)
  precos_referencia: {
    media: number
    mediana: number
    menor: number
    maior: number
    fontes: number
    // Estatísticas complementares (IN SEGES 65/2021 + TCU Acórdão 1.445/2015-P)
    desvio_padrao: number | null
    coeficiente_variacao: number | null    // CV = dp/media (>25% = alta dispersão)
    iqr: number | null                     // Intervalo interquartil (Q3-Q1)
    q1: number | null                      // 1º quartil
    q3: number | null                      // 3º quartil
    outliers_removidos: number             // Quantidade de outliers excluídos via IQR
    formula_media: string | null           // Fórmula transparente p/ inserção no artefato
    formula_mediana: string | null
    formula_desvio: string | null
    itens: Array<{ descricao: string; catmat: string; preco: number; fonte: string }>
  } | null
  dados_municipio: {
    nome: string
    uf: string
    populacao: number | null
    pib_per_capita: number | null
    idh: number | null
    codigo_ibge: string
  } | null
  sancoes: Array<{ tipo: string; razao_social: string; fundamentacao: string }>
  jurisprudencia: Array<{ numero: string; ano: number; ementa: string; relevancia: number }>
  recursos_disponiveis: Array<{
    fonte: string
    descricao: string
    valor: number
    status: string
    data_limite: string | null
  }>
  normativos_aplicaveis: Array<{
    id: string
    numero: string
    nome: string
    tipo: string
    relevancia: string  // 'obrigatoria' | 'recomendada' | 'informativa'
  }>
  // Dados do perfil do usuário (server-side only)
  perfil_usuario: {
    segmento_principal: string | null
    regiao_uf: string | null
    termos_frequentes: Array<{ termo: string; contagem: number }>
    preferencias_terminologia: Record<string, string>
  } | null
  // Parâmetros do órgão (para formatação)
  parametros_orgao: Record<string, unknown> | null
  // Timestamp
  coletado_em: string
}

// ─── ACMA Suggestion (ACMA output) ──────────────────────────────────────────
// Part 19: prompt_hash, modelo, tokens são INTERNOS.

export interface SugestaoACMA {
  processo_id: string
  documento_tipo: string
  secao: string
  texto_sugerido: string
  // Dados para frontend (sanitizados)
  resumo: string                         // Resumo do que foi gerado
  secoes_geradas: string[]               // Quais seções o texto cobre
  // Dados internos (Part 19 — NUNCA no frontend)
  prompt_hash: string
  prompt_versao: number
  modelo_usado: string
  tier: string
  tokens_input: number
  tokens_output: number
  latencia_ms: number
  padroes_injetados: number
  cache_hit: boolean
  iteracao: number
}

// ─── Design Law Artifact (DESIGN_LAW output) ────────────────────────────────
// Determinístico, zero LLM.

export interface ArtefatoDesignLaw {
  processo_id: string
  documento_tipo: string
  url: string                            // R2 URL
  hash_sha256: string
  versao: number
  tamanho_bytes: number
  paginas: number
  selo_placeholder: boolean              // true = slot para selo, aguardando auditoria
  gerado_em: string
}

// ─── Auditor Verdict (AUDITOR output) ────────────────────────────────────────
// Part 19: pesos, thresholds, fórmulas NUNCA expostos.

export interface AuditorCheckItem {
  id: string
  descricao: string
  conforme: boolean
  achado: string | null
  fundamentacao: string | null
  severidade: string                     // Part 19: nunca no frontend
}

export interface ParecerAuditor {
  processo_id: string
  documento_tipo: string
  veredicto: AuditorVerdict
  score: number                          // 0-100
  checklist: AuditorCheckItem[]
  selo_aprovado: boolean
  iteracao: number
  // Dados para frontend (sanitizados — sem severidade/pesos)
  checklist_publico: Array<{
    id: string
    descricao: string
    conforme: boolean
    achado: string | null
    fundamentacao: string | null
  }>
  // Dados internos (Part 19)
  thresholds_usados: Record<string, { severidade: string; peso: number }>
  modelo_usado: string | null
  tokens_input: number
  tokens_output: number
  latencia_ms: number
}

// ─── Transition Result ───────────────────────────────────────────────────────

export interface TransitionResult {
  sucesso: boolean
  estado_anterior: ProcessState
  estado_novo: ProcessState
  erro?: string
}

// ─── Pipeline Trigger ────────────────────────────────────────────────────────

export interface PipelineTrigger {
  tipo: 'criar' | 'chat' | 'decisao'
  decisao?: UserDecision
  texto_editado?: string                 // Para EDITAR
  mensagem?: string                      // Para chat
}

// ─── Pipeline Result ─────────────────────────────────────────────────────────
// O que o pipeline retorna ao BFF/frontend

export interface PipelineResult {
  sucesso: boolean
  estado: ProcessState
  // Dados públicos (vão ao frontend)
  sugestao_acma?: {
    texto_sugerido: string
    resumo: string
    secoes_geradas: string[]
    iteracao: number
  }
  parecer_auditor?: {
    veredicto: AuditorVerdict
    score: number
    checklist: Array<{
      id: string
      descricao: string
      conforme: boolean
      achado: string | null
      fundamentacao: string | null
    }>
    selo_aprovado: boolean
    iteracao: number
  }
  artefato?: {
    url: string
    hash: string
    versao: number
  }
  insight_cards?: InsightCard[]
  trilha?: DocumentTrailItem[]
  proximo_documento?: string | null
  // Mensagem ao usuário
  mensagem: string
  // Erro
  erro?: string
}

// ─── Chat Response ───────────────────────────────────────────────────────────

export interface ChatResponse {
  role: 'assistant' | 'system'
  content: string
  artefato?: {
    tipo: string
    url?: string
    hash?: string
    versao?: number
    dados?: Record<string, unknown>
  } | null
  insight_cards?: InsightCard[]
  pipeline_acionado: boolean
  pipeline_result?: PipelineResult
}

// ─── Workers Environment Bindings ────────────────────────────────────────────

export interface Env {
  // D1
  DB: D1Database
  // KV
  CACHE: KVNamespace
  // R2
  DOCUMENTS: R2Bucket
  // Vectorize
  VECTORIZE: VectorizeIndex
  // AI Gateway
  AI: Ai
  // Supabase
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  // SERPRO
  SERPRO_CONSUMER_KEY: string
  SERPRO_CONSUMER_SECRET: string
  // External APIs
  PNCP_BASE_URL: string
  IBGE_BASE_URL: string
  PORTAL_TRANSPARENCIA_KEY: string
  // Workers self-reference (para chamadas internas entre rotas)
  WORKERS_URL: string
  // Secrets
  AI_GATEWAY_TOKEN: string
}

// ─── Processo Row (Supabase) ─────────────────────────────────────────────────

export interface ProcessoRow {
  id: string
  orgao_id: string
  numero: string
  objeto: string
  status: ProcessState
  fase: string
  valor_estimado: number
  modalidade: string
  trilha: DocumentTrailItem[]
  trilha_posicao: number
  documento_atual: string | null
  iteracao: number
  sugestoes_restantes: number
  reauditorias_restantes: number
  insight_context: EnrichedContext | null
  acma_sugestao_atual: SugestaoACMA | null
  auditor_parecer_atual: ParecerAuditor | null
  selo_aprovado: boolean
  documento_url: string | null
  documento_hash: string | null
  documento_versao: number
  proximo_sugerido: string | null
  criado_por: string
  created_at: string
  updated_at: string
}
