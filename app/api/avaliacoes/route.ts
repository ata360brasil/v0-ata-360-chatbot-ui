/**
 * POST /api/avaliacoes — Registra avaliações (4 tipos via query param ?tipo=).
 * GET  /api/avaliacoes — Dashboard de métricas (SuperADM).
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers.
 *
 * @see Spec v8 Part 16 — Feedback contínuo
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

  // Tipo via query param: ?tipo=fornecedor|plataforma|resposta|artefato
  const url = new URL(request.url)
  const tipo = url.searchParams.get('tipo')
  const TIPOS_VALIDOS = new Set(['fornecedor', 'plataforma', 'resposta', 'artefato'])

  if (!tipo || !TIPOS_VALIDOS.has(tipo)) {
    return NextResponse.json({
      message: `Parâmetro ?tipo= obrigatório. Válidos: ${Array.from(TIPOS_VALIDOS).join(', ')}`,
    }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Body JSON inválido' }, { status: 400 })
  }

  try {
    const session = await supabase.auth.getSession()

    const response = await fetch(`${WORKERS_URL}/api/v1/avaliacoes/${tipo}`, {
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
    return NextResponse.json({ message: 'Serviço de avaliações indisponível' }, { status: 503 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  // Dashboard apenas para superadm/suporte
  const role = user.user_metadata?.role
  if (role !== 'superadm' && role !== 'suporte') {
    return NextResponse.json({ message: 'Acesso restrito a administradores' }, { status: 403 })
  }

  try {
    const session = await supabase.auth.getSession()

    const response = await fetch(`${WORKERS_URL}/api/v1/avaliacoes/dashboard`, {
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
    return NextResponse.json({ message: 'Serviço de métricas indisponível' }, { status: 503 })
  }
}
