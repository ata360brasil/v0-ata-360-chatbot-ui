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
        tipo: 'preco' | 'arp' | 'emenda' | 'jurisprudencia' | 'alerta'
        titulo: string
        descricao: string
        fonte: string
        dados?: Record<string, unknown>
        relevancia: number
      }>
    }>(`/api/processo/${processoId}/insights`),
}
