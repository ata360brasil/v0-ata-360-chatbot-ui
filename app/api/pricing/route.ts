/**
 * Pricing — BFF Proxy Routes
 *
 * GET  /api/pricing/simular?base=X — Simular preço
 * GET  /api/pricing/tabela — Tabela de referência (SuperADM)
 * GET  /api/pricing/parametros — Parâmetros vigentes
 * POST /api/pricing/parametros — Atualizar parâmetros (SuperADM)
 * GET  /api/pricing/categorias — 5 categorias
 * GET  /api/pricing/modalidades — Modalidades de contratação
 * GET  /api/pricing/fpm — Coeficientes FPM
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see workers/src/routes/pricing.ts
 * @see workers/src/pricing/engine.ts
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function GET(request: Request) {
  const { searchParams, pathname } = new URL(request.url)

  // Rotas públicas (sem auth)
  const view = searchParams.get('view')
  if (view === 'categorias' || view === 'modalidades' || view === 'fpm') {
    try {
      const response = await fetch(`${WORKERS_URL}/api/v1/pricing/${view}`)
      const data = await response.json()
      return NextResponse.json(data)
    } catch {
      return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
    }
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  // Buscar role do banco — NUNCA confiar em user_metadata.role (editável pelo cliente)
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('role, orgao_id')
    .eq('id', user.id)
    .single()
  const role = usuario?.role || 'servidor'
  const orgaoId = usuario?.orgao_id || user.user_metadata?.orgao_id || ''

  // Determinar endpoint Workers
  let workerPath = '/api/v1/pricing'

  if (view === 'tabela') {
    workerPath = '/api/v1/pricing/tabela'
  } else if (view === 'parametros') {
    workerPath = '/api/v1/pricing/parametros'
  } else {
    // Simular
    const base = searchParams.get('base')
    const fonte = searchParams.get('fonte') || 'pncp_contratacoes'
    const arp = searchParams.get('arp_disponivel')
    const emenda = searchParams.get('emenda_disponivel')
    const inovacao = searchParams.get('inovacao')
    const qs = new URLSearchParams()
    if (base) qs.set('base', base)
    if (fonte) qs.set('fonte', fonte)
    if (arp) qs.set('arp_disponivel', arp)
    if (emenda) qs.set('emenda_disponivel', emenda)
    if (inovacao) qs.set('inovacao', inovacao)
    workerPath = `/api/v1/pricing/simular?${qs.toString()}`
  }

  try {
    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': orgaoId,
        'X-User-Role': role,
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

  // Buscar role do banco — NUNCA confiar em user_metadata.role (editável pelo cliente)
  const { data: usuarioPost } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .single()
  const role = usuarioPost?.role || 'servidor'
  const body = await request.json()

  // Determinar endpoint
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  let workerPath = '/api/v1/pricing'

  if (action === 'parametros') {
    workerPath = '/api/v1/pricing/parametros'
  } else if (action === 'vigencia') {
    workerPath = '/api/v1/pricing/vigencia'
  } else if (action === 'simular-lote') {
    workerPath = '/api/v1/pricing/simular-lote'
  }

  try {
    const response = await fetch(`${WORKERS_URL}${workerPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-User-Id': user.id,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
        'X-User-Role': role,
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
