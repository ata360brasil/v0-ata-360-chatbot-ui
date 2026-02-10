/**
 * Ouvidoria e Canal de Denúncias — BFF Proxy Routes
 *
 * GET  /api/ouvidoria?protocolo=X — Consultar por protocolo
 * GET  /api/ouvidoria?orgaoId=X — Listar manifestações (admin)
 * GET  /api/ouvidoria?orgaoId=X&view=estatisticas — Estatísticas
 * POST /api/ouvidoria — Criar manifestação (denúncia, reclamação, etc.)
 * PATCH /api/ouvidoria?id=X — Responder manifestação
 *
 * Nota: POST aceita denúncia anônima (sem autenticação obrigatória).
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see CGU — Programa Empresa Pró-Ética
 * @see ABES — Empresa Ética
 * @see DOCUMENTACAO.md — Seção 16
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
  const protocolo = searchParams.get('protocolo')
  const orgaoId = searchParams.get('orgaoId') || user.user_metadata?.orgao_id
  const view = searchParams.get('view')
  const status = searchParams.get('status')
  const tipo = searchParams.get('tipo')

  try {
    let workerPath: string

    if (protocolo) {
      // Consulta por protocolo
      workerPath = `/api/v1/ouvidoria/protocolo/${encodeURIComponent(protocolo)}`
    } else if (orgaoId && view === 'estatisticas') {
      // Estatísticas
      workerPath = `/api/v1/ouvidoria/estatisticas/${orgaoId}`
    } else if (orgaoId) {
      // Listar manifestações do órgão
      workerPath = `/api/v1/ouvidoria/${orgaoId}`
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (tipo) params.set('tipo', tipo)
      const qs = params.toString()
      if (qs) workerPath += `?${qs}`
    } else {
      return NextResponse.json({ message: 'protocolo ou orgaoId é obrigatório' }, { status: 400 })
    }

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

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  // Ouvidoria aceita denúncia anônima — auth é opcional
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()

  if (!body.tipo || !body.categoria || !body.assunto || !body.descricao) {
    return NextResponse.json({
      message: 'tipo, categoria, assunto e descricao são obrigatórios',
    }, { status: 400 })
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Se autenticado, incluir headers
    if (user) {
      const session = (await supabase.auth.getSession()).data.session
      headers['Authorization'] = `Bearer ${session?.access_token}`
      headers['X-User-Id'] = user.id
      headers['X-Orgao-Id'] = user.user_metadata?.orgao_id ?? body.orgao_id ?? ''
    }

    const response = await fetch(`${WORKERS_URL}/api/v1/ouvidoria`, {
      method: 'POST',
      headers,
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

  const body = await request.json()

  if (!body.resposta) {
    return NextResponse.json({ message: 'resposta é obrigatória' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/ouvidoria/${id}/responder`, {
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

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
