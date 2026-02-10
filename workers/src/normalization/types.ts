/**
 * ATA360 — Tipos compartilhados do pipeline de normalização.
 */

/** Ambiente Cloudflare Workers com bindings */
export interface NormalizationEnv {
  D1_NORMALIZACAO: D1Database
  KV_CACHE: KVNamespace
  VECTORIZE_CATMAT?: VectorizeIndex
  AI_GATEWAY?: Fetcher
}

/** Request do pipeline */
export interface NormalizeRequest {
  texto: string
  setor_orgao?: string   // e.g. 'SAUDE', 'TI'
  regiao_uf?: string     // e.g. 'SP', 'PA'
  incluir_catmat: boolean
  incluir_precos: boolean
}

/** Resultado de uma camada individual */
export interface PipelineStep {
  camada: CamadaNome
  texto_entrada: string
  texto_saida: string
  transformacao: string | null  // descrição legível da mudança
  confianca: number
  detalhes?: Record<string, unknown>
}

export type CamadaNome =
  | 'tokenize'
  | 'abreviatura'
  | 'sinonimo'
  | 'regional'
  | 'marca'
  | 'glossario'
  | 'semantico'

/** Sugestão de código CATMAT */
export interface CatmatSugestao {
  codigo: string
  tipo: 'catmat' | 'catser'
  descricao: string
  assertividade: number
  fonte: string  // 'D1_FTS' | 'VECTORIZE' | 'EXACT_MATCH'
}

/** Alerta gerado pelo pipeline */
export interface NormalizacaoAlerta {
  tipo: 'marca_detectada' | 'termo_ambiguo' | 'regionalismo' | 'codigo_obsoleto' | 'medicamento_dcb'
  mensagem: string
  sugestao: string | null
  base_legal?: string
}

/** Response completa do pipeline */
export interface NormalizeResponse {
  texto_original: string
  texto_normalizado: string
  pipeline_aplicado: PipelineStep[]
  catmat_sugeridos: CatmatSugestao[]
  alertas: NormalizacaoAlerta[]
  cache_hit: boolean
  duracao_ms: number
}

/** Interface D1 types (Cloudflare Workers) */
declare global {
  interface D1Database {
    prepare(sql: string): D1PreparedStatement
    batch(stmts: D1PreparedStatement[]): Promise<D1Result[]>
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement
    run(): Promise<D1Result>
    first<T = unknown>(column?: string): Promise<T | null>
    all<T = unknown>(): Promise<D1Result<T>>
  }
  interface D1Result<T = unknown> {
    results?: T[]
    success: boolean
    meta: Record<string, unknown>
  }
  interface KVNamespace {
    get(key: string, options?: { type?: string }): Promise<string | null>
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
    delete(key: string): Promise<void>
  }
  interface VectorizeIndex {
    query(vector: number[], options?: { topK?: number; returnMetadata?: boolean }): Promise<VectorizeMatches>
  }
  interface VectorizeMatches {
    matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }>
  }
  interface Fetcher {
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
  }
}
