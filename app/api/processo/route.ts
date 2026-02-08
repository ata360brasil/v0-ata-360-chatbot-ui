/**
 * POST /api/processo — Cria novo processo licitatório.
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers (Orquestrador).
 * Auth obrigatório via Supabase JWT.
 *
 * @see Guillermo Rauch — Next.js Route Handlers
 * @see Spec v8 Part 20.9 — API do Orquestrador
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { objeto, tipo_documento } = body

  if (!objeto || typeof objeto !== 'string' || objeto.length < 3) {
    return NextResponse.json({ message: 'Objeto é obrigatório (mín. 3 caracteres)' }, { status: 400 })
  }

  try {
    // Forward to Workers (Orquestrador)
    const response = await fetch(`${WORKERS_URL}/api/v1/processo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
      body: JSON.stringify({ objeto, tipo_documento }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
