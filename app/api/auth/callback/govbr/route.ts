/**
 * Gov.br OAuth2 Callback — Route Handler (Next.js 16 App Router).
 *
 * Recebe o code do Gov.br, troca por sessão Supabase.
 * @see supabase.com/docs/guides/auth/server-side/nextjs (Auth Callback)
 * @see manual-integracao.servicos.gov.br (Gov.br OAuth2 flow)
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') ?? '/'

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
