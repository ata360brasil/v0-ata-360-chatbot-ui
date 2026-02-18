/**
 * Sentry — Client-side configuration.
 *
 * Inicializado automaticamente pelo Next.js via instrumentation.
 * Captura erros de runtime, rejeições de promise e Web Vitals.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Apenas inicializar se DSN estiver configurado
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ambiente (production, staging, development)
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,

  // Performance: amostragem de traces
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay (captura de sessões com erro)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filtrar erros irrelevantes
  ignoreErrors: [
    // Erros de rede (transientes)
    'Failed to fetch',
    'NetworkError',
    'AbortError',
    'Load failed',
    // Extensões de browser
    'ResizeObserver loop',
    'Non-Error exception captured',
    // Crawlers
    /^Script error\.?$/,
  ],

  // Sanitizar dados sensíveis antes de enviar
  beforeSend(event) {
    // Remover PII de breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((bc) => {
        if (bc.data?.url) {
          try {
            const url = new URL(bc.data.url as string, window.location.origin)
            // Remover tokens de query strings
            url.searchParams.delete('token')
            url.searchParams.delete('access_token')
            url.searchParams.delete('refresh_token')
            bc.data.url = url.toString()
          } catch {
            // URL inválida, manter como está
          }
        }
        return bc
      })
    }

    return event
  },
})
