/**
 * Compliance e Integridade — BFF Proxy Routes
 *
 * GET  /api/compliance?orgaoId=X — Programa de integridade
 * GET  /api/compliance?orgaoId=X&view=riscos — Mapa de riscos
 * GET  /api/compliance?view=ods — ODS/SDGs atendidos
 * POST /api/compliance — Avaliar ou gerar riscos padrão
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see Spec v8.1 — Compliance CGU
 * @see CGU — Programa Empresa Pró-Ética
 * @see Portaria CGU 226/2025
 * @see DOCUMENTACAO.md — Seção 9
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

  // ODS não precisa de orgaoId
  if (view === 'ods') {
    try {
      const response = await fetch(`${WORKERS_URL}/api/v1/compliance/ods`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
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
      return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
    }
  }

  if (!orgaoId) {
    return NextResponse.json({ message: 'orgaoId é obrigatório' }, { status: 400 })
  }

  try {
    const workerPath = view === 'riscos'
      ? `/api/v1/compliance/${orgaoId}/riscos`
      : `/api/v1/compliance/${orgaoId}`

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
  const { acao, ...params } = body
  const orgaoId = params.orgao_id || user.user_metadata?.orgao_id

  // Rotear por ação: avaliar ou riscos_padrao
  let workerPath: string
  switch (acao) {
    case 'avaliar':
      workerPath = '/api/v1/compliance/avaliar'
      break
    case 'riscos_padrao':
      workerPath = '/api/v1/compliance/riscos/padrao'
      break
    default:
      // Default = avaliar
      workerPath = '/api/v1/compliance/avaliar'
      break
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
      body: JSON.stringify({ ...params, orgao_id: orgaoId }),
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
