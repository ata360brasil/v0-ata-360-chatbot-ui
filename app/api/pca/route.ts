/**
 * PCA Inteligente — BFF Proxy Routes
 *
 * GET  /api/pca?orgaoId=X&exercicio=Y — Obter PCA
 * POST /api/pca — Sugerir, Conciliar ou Vincular PCA
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see Spec v8.1 — PCA Inteligente
 * @see DOCUMENTACAO.md — Seção 6
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
  const exercicio = searchParams.get('exercicio') || new Date().getFullYear()

  if (!orgaoId) {
    return NextResponse.json({ message: 'orgaoId é obrigatório' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/pca/${orgaoId}/${exercicio}`, {
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
  const { acao, ...params } = body
  const orgaoId = params.orgao_id || user.user_metadata?.orgao_id

  // Rotear por ação: sugerir, conciliar, vincular
  let workerPath: string
  switch (acao) {
    case 'sugerir':
      workerPath = '/api/v1/pca/sugerir'
      break
    case 'conciliar':
      workerPath = '/api/v1/pca/conciliar'
      break
    case 'vincular':
      workerPath = '/api/v1/pca/vincular'
      break
    default:
      return NextResponse.json({ message: 'Ação inválida. Use: sugerir, conciliar, vincular' }, { status: 400 })
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
      body: JSON.stringify(params),
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
