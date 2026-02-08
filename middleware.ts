import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ─── Public Routes (no auth required) ───────────────────────────────────────
const PUBLIC_ROUTES = new Set(['/login', '/api/auth/callback/govbr'])
const STATIC_PREFIXES = ['/images/', '/favicon', '/_next/', '/api/auth/']

function isStaticOrPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true
  return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ─── Supabase Session Refresh ───────────────────────────────────────────
  // OBRIGATORIO: sem isso tokens expiram silenciosamente (Paul Copplestone)
  const { supabaseResponse, user } = await updateSession(request)

  // ─── Auth Check ─────────────────────────────────────────────────────────
  // Rotas protegidas exigem sessão válida
  if (!isStaticOrPublic(pathname) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ─── Request ID (rastreabilidade Cloudflare) ────────────────────────────
  const requestId = crypto.randomUUID()
  supabaseResponse.headers.set('X-Request-Id', requestId)
  supabaseResponse.headers.set('X-Request-Timestamp', new Date().toISOString())

  // ─── CSP Nonce ──────────────────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  supabaseResponse.headers.set('X-Nonce', nonce)

  // ─── Content-Security-Policy ────────────────────────────────────────────
  // Next.js App Router requer 'unsafe-inline' para hidratação.
  // Vercel removido, Supabase adicionado (Anderson Ramos / Cláudio Dodt)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://*.supabase.co'
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' ${supabaseUrl} wss://${new URL(supabaseUrl).hostname} https://gateway.ai.cloudflare.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self' https://sso.acesso.gov.br`,
  ].join('; ')

  supabaseResponse.headers.set('Content-Security-Policy', csp)

  // ─── Cache-Control ──────────────────────────────────────────────────────
  if (pathname.startsWith('/images/') || pathname.startsWith('/favicon') || pathname === '/icon.png') {
    supabaseResponse.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  } else if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/manifest.webmanifest') {
    supabaseResponse.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  } else {
    supabaseResponse.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
