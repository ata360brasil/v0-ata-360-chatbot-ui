/**
 * AIA — Avaliação de Impacto Algorítmico — BFF Proxy Routes
 *
 * GET  /api/aia?orgaoId=X — Listar avaliações do órgão
 * GET  /api/aia/codigo-conduta — Obter Código de Conduta IA publicável
 * POST /api/aia — Criar nova avaliação
 * PATCH /api/aia/:id/aprovar — Aprovar avaliação
 *
 * Alinhamento:
 * - PL 2.338/2023, Art. 29 (avaliação de impacto algorítmico)
 * - PBIA 2024-2028 (Resolução CCT nº 4/2024)
 * - LGPD Art. 20 (direito à revisão de decisão automatizada)
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see configs/documentos-config.yaml — AIA
 * @see workers/src/compliance/codigo-conduta-ia.ts
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CODIGO_CONDUTA_IA } from '@/workers/src/compliance/codigo-conduta-ia'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orgaoId = searchParams.get('orgaoId')
  const view = searchParams.get('view')

  // Código de conduta é público — não requer autenticação
  if (view === 'codigo-conduta') {
    return NextResponse.json(CODIGO_CONDUTA_IA)
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const resolvedOrgaoId = orgaoId || user.user_metadata?.orgao_id

  if (!resolvedOrgaoId) {
    return NextResponse.json({ message: 'orgaoId é obrigatório' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/aia?orgaoId=${resolvedOrgaoId}`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': resolvedOrgaoId,
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

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/aia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? body.orgao_id ?? '',
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

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/aia/${id}/aprovar`, {
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
