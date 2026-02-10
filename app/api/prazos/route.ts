/**
 * Prazos e Alertas — BFF Proxy Routes
 *
 * GET  /api/prazos?orgaoId=X — Listar prazos
 * GET  /api/prazos?orgaoId=X&view=alertas — Listar alertas
 * POST /api/prazos — Criar prazo ou prazos de processo
 * PATCH /api/prazos?id=X&action=lido — Marcar alerta como lido
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see Spec v8.1 — Prazos e Alertas
 * @see DOCUMENTACAO.md — Seção 11
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
  const orgaoId = searchParams.get('orgaoId') || user.user_metadata?.orgao_id
  const view = searchParams.get('view')
  const status = searchParams.get('status')
  const processoId = searchParams.get('processo_id')

  if (!orgaoId) {
    return NextResponse.json({ message: 'orgaoId é obrigatório' }, { status: 400 })
  }

  try {
    let workerPath: string
    if (view === 'alertas') {
      workerPath = `/api/v1/prazos/${orgaoId}/alertas`
    } else {
      workerPath = `/api/v1/prazos/${orgaoId}`
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (processoId) params.set('processo_id', processoId)
      const qs = params.toString()
      if (qs) workerPath += `?${qs}`
    }

    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': orgaoId,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
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

  const body = await request.json()
  const orgaoId = body.orgao_id || user.user_metadata?.orgao_id

  // Se tem processo_id e modalidade, criar prazos de processo; senão, prazo manual
  const isProcesso = body.processo_id && body.modalidade
  const workerPath = isProcesso ? '/api/v1/prazos/processo' : '/api/v1/prazos'

  try {
    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': orgaoId,
      },
      body: JSON.stringify({ ...body, orgao_id: orgaoId }),
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

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')

  if (!id || action !== 'lido') {
    return NextResponse.json({ message: 'id e action=lido são obrigatórios' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/prazos/${id}/lido`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
