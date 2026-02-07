import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Request ID para rastreabilidade
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-Id', requestId)

  // Timestamp para auditoria
  response.headers.set('X-Request-Timestamp', new Date().toISOString())

  // Nonce para CSP (futuro)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  response.headers.set('X-Nonce', nonce)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
