/**
 * Supabase Middleware Client — para refresh de sessão no middleware.
 *
 * O middleware é o ÚNICO lugar onde tokens JWT são refreshed automaticamente.
 * Sem isso, sessões expiram silenciosamente após 1h (default Supabase).
 *
 * @see supabase.com/docs/guides/auth/server-side/nextjs (seção middleware)
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh da sessão — OBRIGATÓRIO para manter token válido
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
