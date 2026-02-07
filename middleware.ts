import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  const response = NextResponse.next()

  // Request ID para rastreabilidade (padrão Cloudflare / observability)
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-Id', requestId)

  // Timestamp para auditoria
  response.headers.set('X-Request-Timestamp', new Date().toISOString())

  // CSP nonce — gerado por request, propagado via header para o layout
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  response.headers.set('X-Nonce', nonce)

  // Content-Security-Policy — Next.js usa scripts inline para hidratação,
  // portanto 'unsafe-inline' é necessário em script-src.
  // O nonce é mantido no header para uso futuro quando Next.js tiver
  // suporte completo a CSP nonces em App Router.
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com wss:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
