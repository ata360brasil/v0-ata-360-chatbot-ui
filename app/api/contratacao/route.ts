/**
 * Contratação — BFF Proxy Routes
 *
 * POST /api/contratacao — Iniciar contratação
 * GET  /api/contratacao?id=X — Obter contratação
 * GET  /api/contratacao?orgaoId=X — Listar contratações do órgão
 * PATCH /api/contratacao?id=X — Atualizar status
 * POST /api/contratacao?action=auto-pca — Prova de fogo: PCA em minutos
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see workers/src/routes/contratacao.ts
 * @see Lei 14.133/2021 — Arts. 74, 75, 81, 86, 106-107
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const orgaoId = searchParams.get('orgaoId') || user.user_metadata?.orgao_id

  let workerPath: string
  if (id) {
    workerPath = `/api/v1/contratacao/${id}`
  } else if (orgaoId) {
    workerPath = `/api/v1/contratacao/orgao/${orgaoId}`
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
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const orgaoId = user.user_metadata?.orgao_id || ''
  const body = await request.json()

  let workerPath = '/api/v1/contratacao'
  if (action === 'auto-pca') {
    workerPath = '/api/v1/contratacao/auto-pca'
  }

  try {
    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': orgaoId,
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
    const response = await fetch(`${WORKERS_URL}/api/v1/contratacao/${id}/status`, {
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
