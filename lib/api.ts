/**
 * API Client — fetch wrapper type-safe para Workers + AI Gateway.
 *
 * BFF Pattern: Frontend → Next.js API Route → Cloudflare Workers
 * Nunca chama Workers diretamente do browser (segurança + CORS).
 *
 * @see Guillermo Rauch — BFF pattern para Next.js
 * @see Cloudflare AI Gateway — multi-model routing
 */
import { z } from 'zod'
import { logger, withSpan } from '@/lib/observability'

// ─── Config ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''
const DEFAULT_TIMEOUT = 30_000

// ─── Error Types ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Core Fetch ─────────────────────────────────────────────────────────────

interface FetchOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  schema?: z.ZodSchema<T>
  timeout?: number
  headers?: Record<string, string>
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions<T> = {},
): Promise<T> {
  const { method = 'GET', body, schema, timeout = DEFAULT_TIMEOUT, headers = {} } = options

  return withSpan(`api.${method.toLowerCase()}.${path}`, async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new ApiError(
          errorBody.message ?? `HTTP ${response.status}`,
          response.status,
          errorBody.code,
          errorBody.details,
        )
      }

      const data = await response.json()

      // Validação runtime com Zod (Colinhacks best practice)
      if (schema) {
        const parsed = schema.safeParse(data)
        if (!parsed.success) {
          logger.error('API response validation failed', {
            path,
            errors: parsed.error.flatten(),
          })
          throw new ApiError('Response validation failed', 422, 'VALIDATION_ERROR', parsed.error.flatten())
        }
        return parsed.data
      }

      return data as T
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT')
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'NETWORK_ERROR',
      )
    }
  })
}

// ─── Process API ────────────────────────────────────────────────────────────

export const processo = {
  criar: (data: { objeto: string; tipo_documento?: string }) =>
    apiFetch<{ id: string; numero: string }>('/api/processo', {
      method: 'POST',
      body: data,
    }),

  status: (id: string) =>
    apiFetch<{
      id: string
      estado: string
      iteracao: number
      documento_atual: unknown
      parecer_auditor: unknown | null
      selo_aprovado: boolean
      proximo_sugerido: string | null
    }>(`/api/processo/${id}/status`),

  decisao: (id: string, acao: 'APROVAR' | 'EDITAR' | 'NOVA_SUGESTAO' | 'PROSSEGUIR' | 'DESCARTAR') =>
    apiFetch<{ sucesso: boolean; novo_estado: string }>(`/api/processo/${id}/decisao`, {
      method: 'POST',
      body: { acao },
    }),

  documento: (id: string) =>
    apiFetch<{ url: string; hash: string; versao: number }>(`/api/processo/${id}/documento`),

  historico: (id: string) =>
    apiFetch<{ versoes: Array<{ versao: number; hash: string; created_at: string }> }>(
      `/api/processo/${id}/historico`,
    ),
}

// ─── Chat API ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  artifact?: {
    tipo: string
    dados: Record<string, unknown>
  } | null
  insight_cards?: Array<{
    tipo: string
    titulo: string
    descricao: string
    fonte: string
    dados?: Record<string, unknown>
  }>
}

export const chat = {
  enviar: (processoId: string, mensagem: string) =>
    apiFetch<ChatMessage>(`/api/processo/${processoId}/chat`, {
      method: 'POST',
      body: { mensagem },
      timeout: 60_000, // IA pode demorar
    }),

  stream: (processoId: string, mensagem: string) => {
    // Server-Sent Events para streaming de respostas IA
    const url = `${BASE_URL}/api/processo/${processoId}/chat/stream`
    return new EventSource(`${url}?mensagem=${encodeURIComponent(mensagem)}`)
  },
}

// ─── Audit API ──────────────────────────────────────────────────────────────

export const audit = {
  flush: (events: unknown[]) =>
    apiFetch<{ received: number }>('/api/audit', {
      method: 'POST',
      body: { events },
    }),
}

// ─── Normalize API ─────────────────────────────────────────────────────────

export const normalize = {
  texto: (data: {
    texto: string
    setor_orgao?: string
    regiao_uf?: string
    incluir_catmat?: boolean
    incluir_precos?: boolean
  }) =>
    apiFetch<{
      texto_original: string
      texto_normalizado: string
      pipeline_aplicado: Array<{
        camada: string
        texto_entrada: string
        texto_saida: string
        transformacao: string | null
        confianca: number
        detalhes?: Record<string, unknown>
      }>
      catmat_sugeridos: Array<{
        codigo: string
        tipo: 'catmat' | 'catser'
        descricao: string
        assertividade: number
        fonte: string
      }>
      alertas: Array<{
        tipo: string
        mensagem: string
        sugestao: string | null
        base_legal?: string
      }>
      cache_hit: boolean
      duracao_ms: number
    }>('/api/normalize', {
      method: 'POST',
      body: data,
      timeout: 15_000, // normalização é rápida
    }),

  health: () =>
    apiFetch<{
      status: 'ok' | 'degraded'
      d1_termos?: number
      vectorize?: boolean
      ai_gateway?: boolean
      message?: string
    }>('/api/normalize/health'),
}

// ─── Feedback API ──────────────────────────────────────────────────────────

export const feedback = {
  enviarTermo: (data: {
    processo_id?: string
    termo_original: string
    termo_normalizado_sistema: string
    catmat_sugerido_sistema?: string
    termo_corrigido_usuario?: string
    catmat_corrigido_usuario?: string
    tipo_feedback: 'correcao_termo' | 'correcao_catmat' | 'aprovacao' | 'rejeicao'
    setor?: string
    regiao_uf?: string
    confianca_original?: number
  }) =>
    apiFetch<{ sucesso: boolean; feedback: unknown }>('/api/feedback', {
      method: 'POST',
      body: data,
    }),

  stats: () =>
    apiFetch<{
      total: number
      pendentes: number
      validados: number
      propagados: number
      rejeitados: number
      top_correcoes: Array<{
        termo_original: string
        termo_corrigido: string
        total_usuarios: number
      }>
    }>('/api/feedback'),
}

// ─── PNCP API (via Workers) ────────────────────────────────────────────────

export const pncp = {
  buscarItens: (termo: string, params?: { pagina?: number; limite?: number }) =>
    apiFetch<{
      itens: Array<{ descricao: string; catmat: string; preco_medio: number; fonte: string }>
      total: number
    }>(`/api/pncp/itens?termo=${encodeURIComponent(termo)}&pagina=${params?.pagina ?? 1}&limite=${params?.limite ?? 20}`),

  atasVigentes: (catmat: string) =>
    apiFetch<{
      atas: Array<{ orgao: string; preco: number; validade: string; saldo: number }>
    }>(`/api/pncp/atas?catmat=${encodeURIComponent(catmat)}`),

  precosReferencia: (catmat: string) =>
    apiFetch<{
      media: number
      mediana: number
      menor: number
      maior: number
      fontes: number
    }>(`/api/pncp/precos/${encodeURIComponent(catmat)}`),
}

// ─── Insight Engine API ─────────────────────────────────────────────────────

export const insight = {
  cards: (processoId: string) =>
    apiFetch<{
      cards: Array<{
        tipo: 'preco' | 'arp' | 'emenda' | 'jurisprudencia' | 'alerta' | 'recurso' | 'sancao' | 'indice'
        titulo: string
        descricao: string
        fonte: string
        dados?: Record<string, unknown>
        relevancia: number
      }>
    }>(`/api/processo/${processoId}/insights`),
}

// ─── SERPRO API (17 serviços via Workers) ─────────────────────────────────

export const serpro = {
  cnpj: (cnpj: string) =>
    apiFetch<{ cnpj: string; razao_social: string; situacao_cadastral: string; porte: string | null }>(`/api/serpro/cnpj/${encodeURIComponent(cnpj)}`),

  cpf: (cpf: string) =>
    apiFetch<{ cpf: string; nome: string; situacao_cadastral: string }>(`/api/serpro/cpf/${encodeURIComponent(cpf)}`),

  cnd: (cnpj: string) =>
    apiFetch<{ situacao: string; data_validade: string; numero_certidao: string | null }>(`/api/serpro/cnd/${encodeURIComponent(cnpj)}`),

  dividaAtiva: (cnpj: string) =>
    apiFetch<{ total_divida: number; inscricoes: Array<{ numero: string; valor: number; situacao: string }> }>(`/api/serpro/divida-ativa/${encodeURIComponent(cnpj)}`),

  datavalid: (cpf: string, dados: Record<string, unknown>) =>
    apiFetch<{ nome_valido: boolean; data_nascimento_valida: boolean }>('/api/serpro/datavalid', {
      method: 'POST',
      body: { cpf, ...dados },
    }),

  carimboTempo: (hash: string, documentoId: string) =>
    apiFetch<{ timestamp: string; assinatura_tempo: string; tsa_serial: string }>('/api/serpro/carimbo-tempo', {
      method: 'POST',
      body: { hash_sha256: hash, documento_id: documentoId },
    }),

  neoSigner: (documentoId: string) =>
    apiFetch<{ assinatura: string; certificado_emissor: string; valido_ate: string }>('/api/serpro/neosigner', {
      method: 'POST',
      body: { documento_id: documentoId },
    }),
}

// ─── Government APIs (via Workers proxy) ──────────────────────────────────

export const gov = {
  // Portal Transparência — sanções (CEIS, CNEP, CEPIM, CEAF)
  sancoes: (cnpj: string) =>
    apiFetch<{ sancoes: Array<{ tipo: string; razao_social: string; fundamentacao: string }> }>(`/api/gov/sancoes/${encodeURIComponent(cnpj)}`),

  // TransfereGov — convênios
  convenios: (municipioIbge: string) =>
    apiFetch<{ convenios: Array<{ numero: string; situacao: string; valor_global: number }> }>(`/api/gov/convenios/${encodeURIComponent(municipioIbge)}`),

  // IBGE — dados do município
  municipio: (codigoIbge: string) =>
    apiFetch<{ nome: string; uf: string; populacao: number | null; pib_per_capita: number | null; idh: number | null }>(`/api/gov/ibge/${encodeURIComponent(codigoIbge)}`),

  // TCU — jurisprudência
  acordaos: (termo: string, params?: { pagina?: number }) =>
    apiFetch<{ acordaos: Array<{ numero: string; ano: number; ementa: string; relevancia: number }> }>(`/api/gov/tcu/acordaos?termo=${encodeURIComponent(termo)}&pagina=${params?.pagina ?? 1}`),

  // BCB — índices econômicos (IPCA, IGP-M, Selic, Dólar)
  indice: (serie: 'IPCA' | 'IGPM' | 'SELIC' | 'DOLAR') =>
    apiFetch<{ serie: string; valor: number; data: string }>(`/api/gov/bcb/${serie.toLowerCase()}`),

  // SICONFI / Tesouro — dados fiscais do ente
  siconfi: (municipioIbge: string, exercicio: number) =>
    apiFetch<{ receita_corrente_liquida: number | null; despesa_pessoal_percentual: number | null }>(`/api/gov/siconfi/${encodeURIComponent(municipioIbge)}/${exercicio}`),

  // FNS — repasses saúde
  fnsRepasses: (municipioIbge: string) =>
    apiFetch<{ repasses: Array<{ bloco: string; valor: number; competencia: string; status: string }> }>(`/api/gov/fns/${encodeURIComponent(municipioIbge)}`),

  // FNDE — programas educação
  fndeProgramas: (municipioIbge: string) =>
    apiFetch<{ programas: Array<{ programa: string; valor_previsto: number; valor_repassado: number }> }>(`/api/gov/fnde/${encodeURIComponent(municipioIbge)}`),

  // Radar de Recursos (cruzamento de todas as fontes)
  radarRecursos: (municipioIbge: string) =>
    apiFetch<{
      recursos: Array<{
        fonte: string
        descricao: string
        valor: number
        status: string
        data_limite: string | null
        acao_sugerida: string | null
      }>
      totais: {
        disponivel: number
        em_risco: number
        subutilizado: number
      }
    }>(`/api/gov/radar/${encodeURIComponent(municipioIbge)}`),
}
