/**
 * Gov.br OAuth2 Callback — Route Handler (Next.js 16 App Router).
 *
 * Recebe o code do Gov.br, troca por sessão Supabase.
 * @see supabase.com/docs/guides/auth/server-side/nextjs (Auth Callback)
 * @see manual-integracao.servicos.gov.br (Gov.br OAuth2 flow)
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Valida redirect para prevenir Open Redirect (CWE-601).
 * Aceita apenas caminhos relativos internos (ex: /dashboard, /processos).
 * Rejeita protocol-relative (//evil.com), backslash (/\evil.com), e URLs absolutas.
 */
function getSafeRedirect(raw: string): string {
  if (
    !raw.startsWith('/') ||
    raw.startsWith('//') ||
    raw.startsWith('/\\') ||
    raw.includes(':')
  ) {
    return '/'
  }
  try {
    const parsed = new URL(raw, 'http://localhost')
    if (parsed.hostname !== 'localhost') return '/'
    return parsed.pathname + parsed.search
  } catch {
    return '/'
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = getSafeRedirect(searchParams.get('redirect') ?? '/')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
