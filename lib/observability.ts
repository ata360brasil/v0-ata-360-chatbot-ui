/**
 * Observability — telemetria estruturada para frontend.
 *
 * Três pilares:
 * 1. Logger — logs estruturados com níveis e contexto
 * 2. Metrics — contadores, histogramas, gauges (Web Vitals + custom)
 * 3. Traces — spans para medir duração de operações
 *
 * Tudo é armazenado em memória com limite de retenção e pode ser
 * exportado via `flush()` para qualquer backend (Vercel Analytics,
 * Datadog, Sentry, OpenTelemetry Collector, etc.).
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
  sessionId: string
}

interface MetricEntry {
  name: string
  value: number
  unit: string
  tags: Record<string, string>
  timestamp: string
}

interface SpanEntry {
  name: string
  durationMs: number
  status: 'ok' | 'error'
  attributes: Record<string, unknown>
  timestamp: string
}

// ─── SESSION ─────────────────────────────────────────────────────────────────

const SESSION_ID = typeof crypto !== 'undefined'
  ? crypto.randomUUID()
  : `session-${Date.now()}`

// ─── RING BUFFER ─────────────────────────────────────────────────────────────

const MAX_ENTRIES = 500

const logs: LogEntry[] = []
const metrics: MetricEntry[] = []
const spans: SpanEntry[] = []

function pushCapped<T>(arr: T[], entry: T) {
  if (arr.length >= MAX_ENTRIES) arr.shift()
  arr.push(entry)
}

// ─── LOGGER ──────────────────────────────────────────────────────────────────

const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }
let minLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug'

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < LOG_LEVELS[minLevel]) return

  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
  }

  pushCapped(logs, entry)

  // Dev: espelhar no console
  if (process.env.NODE_ENV !== 'production') {
    const fn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : level === 'debug' ? console.debug
      : console.info
    fn(`[${level.toUpperCase()}] ${message}`, context ?? '')
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
  setLevel: (level: LogLevel) => { minLevel = level },
}

// ─── METRICS ─────────────────────────────────────────────────────────────────

export function recordMetric(
  name: string,
  value: number,
  unit = 'count',
  tags: Record<string, string> = {}
) {
  pushCapped(metrics, {
    name,
    value,
    unit,
    tags,
    timestamp: new Date().toISOString(),
  })
}

// Convenience helpers
export const counter = (name: string, tags?: Record<string, string>) =>
  recordMetric(name, 1, 'count', tags)

export const gauge = (name: string, value: number, tags?: Record<string, string>) =>
  recordMetric(name, value, 'gauge', tags)

export const histogram = (name: string, value: number, unit = 'ms', tags?: Record<string, string>) =>
  recordMetric(name, value, unit, tags)

// ─── TRACES (SPANS) ─────────────────────────────────────────────────────────

export function startSpan(name: string, attributes: Record<string, unknown> = {}) {
  const start = performance.now()

  return {
    end(status: 'ok' | 'error' = 'ok') {
      const durationMs = performance.now() - start
      pushCapped(spans, {
        name,
        durationMs: Math.round(durationMs * 100) / 100,
        status,
        attributes,
        timestamp: new Date().toISOString(),
      })
      histogram(`span.${name}`, durationMs, 'ms', { status })
    },
  }
}

export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, unknown> = {}
): Promise<T> {
  const span = startSpan(name, attributes)
  try {
    const result = await fn()
    span.end('ok')
    return result
  } catch (error) {
    span.end('error')
    logger.error(`Span "${name}" failed`, { error: String(error) })
    throw error
  }
}

// ─── WEB VITALS ──────────────────────────────────────────────────────────────

export function reportWebVitals() {
  if (typeof window === 'undefined') return

  // Use PerformanceObserver for Core Web Vitals
  try {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        histogram('web_vital.lcp', lastEntry.startTime, 'ms', { rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor' })
        logger.info('Web Vital: LCP', { value: Math.round(lastEntry.startTime), rating: lastEntry.startTime < 2500 ? 'good' : 'poor' })
      }
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    // FID / INP (Interaction to Next Paint)
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('duration' in entry) {
          histogram('web_vital.inp', entry.duration, 'ms', { rating: entry.duration < 200 ? 'good' : entry.duration < 500 ? 'needs-improvement' : 'poor' })
        }
      }
    })
    inpObserver.observe({ type: 'event', buffered: true })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('value' in entry && !(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
          clsValue += (entry as PerformanceEntry & { value: number }).value
          gauge('web_vital.cls', clsValue, { rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor' })
        }
      }
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const nav = entry as PerformanceNavigationTiming
        histogram('navigation.ttfb', nav.responseStart - nav.requestStart, 'ms')
        histogram('navigation.dom_complete', nav.domComplete - nav.fetchStart, 'ms')
        histogram('navigation.load', nav.loadEventEnd - nav.fetchStart, 'ms')
        logger.info('Navigation timing', {
          ttfb: Math.round(nav.responseStart - nav.requestStart),
          domComplete: Math.round(nav.domComplete - nav.fetchStart),
          load: Math.round(nav.loadEventEnd - nav.fetchStart),
        })
      }
    })
    navObserver.observe({ type: 'navigation', buffered: true })
  } catch {
    // PerformanceObserver not fully supported
    logger.debug('PerformanceObserver not available for some entry types')
  }
}

// ─── ERROR TRACKING ──────────────────────────────────────────────────────────

export function setupErrorTracking() {
  if (typeof window === 'undefined') return

  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
    counter('error.uncaught', { type: 'runtime' })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: String(event.reason),
    })
    counter('error.unhandled_rejection', { type: 'promise' })
  })
}

// ─── FLUSH / EXPORT ──────────────────────────────────────────────────────────

export function getSnapshot() {
  return {
    sessionId: SESSION_ID,
    timestamp: new Date().toISOString(),
    logs: [...logs],
    metrics: [...metrics],
    spans: [...spans],
  }
}

export function flush() {
  const snapshot = getSnapshot()
  logs.length = 0
  metrics.length = 0
  spans.length = 0
  return snapshot
}

// ─── INIT ────────────────────────────────────────────────────────────────────

export function initObservability() {
  logger.info('Observability initialized', {
    sessionId: SESSION_ID,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  })
  reportWebVitals()
  setupErrorTracking()
}
