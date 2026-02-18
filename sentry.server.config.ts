/**
 * Sentry — Server-side configuration (Node.js runtime).
 *
 * Captura erros em API routes, Server Components e Server Actions.
 *
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,

  // Performance: amostragem de traces (server)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  // Filtrar erros transientes
  ignoreErrors: [
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],
})
