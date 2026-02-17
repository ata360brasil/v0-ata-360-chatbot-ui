import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ─── Public Routes (no auth required) ───────────────────────────────────────
const PUBLIC_ROUTES = new Set([
  '/login', '/api/auth/callback/govbr',
  // Legal
  '/privacidade', '/termos', '/lgpd',
  // Institutional
  '/', '/manifesto', '/quem-somos', '/missao-visao-valores',
  '/compromissos', '/compliance', '/seguranca',
  '/carta-servidor', '/contato', '/cookies',
])
const STATIC_PREFIXES = ['/images/', '/favicon', '/_next/', '/api/auth/']

function isStaticOrPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true
  return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ─── Supabase Session Refresh ───────────────────────────────────────────
  // Resiliente: se Supabase não configurado, prossegue sem auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseConfigured = supabaseUrl.length > 0 && supabaseUrl.startsWith('https://')

  let response: NextResponse
  let user: { id: string } | null = null

  if (supabaseConfigured) {
    try {
      const result = await updateSession(request)
      response = result.supabaseResponse
      user = result.user
    } catch {
      // Supabase indisponível — prosseguir sem auth
      response = NextResponse.next({ request })
    }
  } else {
    // Sem Supabase configurado — modo demo (sem redirect para login)
    response = NextResponse.next({ request })
  }

  // ─── Auth Check ─────────────────────────────────────────────────────────
  // Só redireciona para login se Supabase estiver configurado
  if (supabaseConfigured && !isStaticOrPublic(pathname) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ─── Request ID (rastreabilidade Cloudflare) ────────────────────────────
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-Id', requestId)
  response.headers.set('X-Request-Timestamp', new Date().toISOString())

  // ─── CSP Nonce ──────────────────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  response.headers.set('X-Nonce', nonce)

  // ─── Content-Security-Policy ────────────────────────────────────────────
  const supabaseHost = supabaseConfigured ? new URL(supabaseUrl).hostname : '*.supabase.co'
  const connectSrc = supabaseConfigured
    ? `${supabaseUrl} wss://${supabaseHost}`
    : 'https://*.supabase.co wss://*.supabase.co'
  // CSP: usar nonce para scripts sempre que possível.
  // 'unsafe-inline' mantido para styles (Tailwind CSS-in-JS requer).
  // script-src: nonce + 'strict-dynamic' para Next.js SSR inline scripts.
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' ${connectSrc} https://gateway.ai.cloudflare.com https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self' https://sso.acesso.gov.br`,
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // ─── Anti-Scraping: impedir cache de paginas internas (app) por buscadores ───
  // Paginas publicas (legal + institucional) sao indexaveis — nao aplicar noarchive
  if (!isStaticOrPublic(pathname)) {
    response.headers.set('X-Robots-Tag', 'noarchive, nosnippet')
  }

  // ─── Cache-Control ──────────────────────────────────────────────────────
  if (pathname.startsWith('/images/') || pathname.startsWith('/favicon') || pathname === '/icon.png') {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  } else if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/manifest.webmanifest') {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  } else {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
