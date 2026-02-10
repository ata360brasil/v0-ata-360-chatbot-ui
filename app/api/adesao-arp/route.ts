/**
 * Adesão ARP — BFF Proxy Routes
 *
 * POST /api/adesao-arp — Iniciar adesão
 * GET  /api/adesao-arp?id=X — Obter adesão
 * GET  /api/adesao-arp?orgaoId=X — Listar adesões do órgão
 * PATCH /api/adesao-arp?id=X — Avançar status
 * POST /api/adesao-arp?action=resposta-externa — Resposta via link externo
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see workers/src/routes/adesao-arp.ts
 * @see Art. 86, Lei 14.133/2021
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Link externo público (não requer auth)
  const token = searchParams.get('token')
  const tipo = searchParams.get('tipo')
  if (token && tipo) {
    // Redirecionar para página de resposta externa
    return NextResponse.json({
      tipo,
      token,
      mensagem: 'Use POST /api/adesao-arp?action=resposta-externa para responder',
    })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const id = searchParams.get('id')
  const orgaoId = searchParams.get('orgaoId') || user.user_metadata?.orgao_id

  let workerPath: string
  if (id) {
    workerPath = `/api/v1/adesao-arp/${id}`
  } else if (orgaoId) {
    workerPath = `/api/v1/adesao-arp/orgao/${orgaoId}`
  } else {
    return NextResponse.json({ message: 'id ou orgaoId é obrigatório' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': orgaoId || '',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  // Resposta externa (sem auth — validação por token)
  if (action === 'resposta-externa') {
    const body = await request.json()
    const adesaoId = searchParams.get('adesaoId')

    try {
      const response = await fetch(`${WORKERS_URL}/api/v1/adesao-arp/${adesaoId}/resposta-externa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro interno' }))
        return NextResponse.json(error, { status: response.status })
      }

      return NextResponse.json(await response.json())
    } catch {
      return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
    }
  }

  // Iniciar adesão (requer auth)
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/adesao-arp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json(), { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ message: 'id é obrigatório' }, { status: 400 })
  }

  const body = await request.json()

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/adesao-arp/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
