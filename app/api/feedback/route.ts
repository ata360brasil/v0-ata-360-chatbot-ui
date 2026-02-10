/**
 * POST /api/feedback — Registra feedback de normalização.
 * GET  /api/feedback — Estatísticas de feedback do órgão.
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see Spec v8 Part 16 — Normalização Linguística
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

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Body JSON inválido' }, { status: 400 })
  }

  try {
    const session = await supabase.auth.getSession()

    const response = await fetch(`${WORKERS_URL}/api/v1/feedback/termo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
        'X-User-Id': user.id,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Serviço de feedback indisponível' }, { status: 503 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  try {
    const session = await supabase.auth.getSession()

    const response = await fetch(`${WORKERS_URL}/api/v1/feedback/stats`, {
      headers: {
        'Authorization': `Bearer ${session.data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
        'X-User-Id': user.id,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Serviço de feedback indisponível' }, { status: 503 })
  }
}
