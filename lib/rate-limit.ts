/**
 * Rate Limiter — sliding window em memória para API routes.
 *
 * Implementação leve usando Map com cleanup automático.
 * Para produção multi-instância, substituir por Redis (Upstash).
 *
 * Uso no middleware:
 *   const { limited, headers } = rateLimit(ip, { max: 60, windowMs: 60_000 })
 *   if (limited) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
 *
 * @see OWASP Rate Limiting Cheat Sheet
 * @see Cloudflare Rate Limiting best practices
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface RateLimitOptions {
  /** Máximo de requests na janela (padrão: 60) */
  max?: number
  /** Tamanho da janela em ms (padrão: 60s) */
  windowMs?: number
}

interface RateLimitResult {
  limited: boolean
  remaining: number
  reset: number
  headers: Record<string, string>
}

interface WindowEntry {
  timestamps: number[]
  blockedUntil: number
}

// ─── STORE ───────────────────────────────────────────────────────────────────

const store = new Map<string, WindowEntry>()

// Cleanup a cada 5 minutos para evitar memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      // Remover entradas sem atividade recente (janela expirada)
      const newest = entry.timestamps[entry.timestamps.length - 1] ?? 0
      if (now - newest > 10 * 60 * 1000) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)

  // Não bloquear shutdown do processo
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref()
  }
}

// ─── RATE LIMIT ──────────────────────────────────────────────────────────────

/**
 * Verifica rate limit para um identificador (IP, userId, etc.).
 * Retorna headers padrão (RateLimit-*) para incluir na response.
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const { max = 60, windowMs = 60_000 } = options
  const now = Date.now()

  ensureCleanup()

  let entry = store.get(identifier)
  if (!entry) {
    entry = { timestamps: [], blockedUntil: 0 }
    store.set(identifier, entry)
  }

  // Limpar timestamps fora da janela
  const windowStart = now - windowMs
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

  const count = entry.timestamps.length
  const remaining = Math.max(0, max - count - 1)
  const firstTimestamp = entry.timestamps[0]
  const resetAt = firstTimestamp !== undefined
    ? firstTimestamp + windowMs
    : now + windowMs

  // Rate limit headers (IETF draft-ietf-httpapi-ratelimit-headers)
  const headers: Record<string, string> = {
    'RateLimit-Limit': String(max),
    'RateLimit-Remaining': String(Math.max(0, max - count - 1)),
    'RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
  }

  if (count >= max) {
    const retryAfter = Math.ceil((resetAt - now) / 1000)
    headers['Retry-After'] = String(retryAfter)
    return { limited: true, remaining: 0, reset: resetAt, headers }
  }

  // Registrar request
  entry.timestamps.push(now)

  return { limited: false, remaining, reset: resetAt, headers }
}

// ─── PRESETS ─────────────────────────────────────────────────────────────────

/** Limites por tipo de rota */
export const RATE_LIMITS = {
  /** API geral — 60 req/min */
  api: { max: 60, windowMs: 60_000 },
  /** Auth — 10 req/min (brute-force protection) */
  auth: { max: 10, windowMs: 60_000 },
  /** Formulários públicos (contato, demo) — 5 req/hora */
  publicForm: { max: 5, windowMs: 60 * 60 * 1000 },
  /** Chat/IA — 20 req/min */
  chat: { max: 20, windowMs: 60_000 },
  /** Dashboard — 30 req/min */
  dashboard: { max: 30, windowMs: 60_000 },
} as const

/**
 * Determina preset de rate limit com base no pathname.
 */
export function getRateLimitPreset(pathname: string): RateLimitOptions {
  if (pathname.startsWith('/api/auth/')) return RATE_LIMITS.auth
  if (pathname === '/api/contato' || pathname === '/api/demonstracao') return RATE_LIMITS.publicForm
  if (pathname.includes('/chat')) return RATE_LIMITS.chat
  if (pathname === '/api/dashboard') return RATE_LIMITS.dashboard
  return RATE_LIMITS.api
}
