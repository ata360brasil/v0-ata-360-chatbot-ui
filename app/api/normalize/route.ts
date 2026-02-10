/**
 * POST /api/normalize — Normaliza texto de licitação.
 *
 * BFF Pattern: Next.js Route Handler → Cloudflare Workers (normalização).
 * Auth obrigatório via Supabase JWT.
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 * @see Guillermo Rauch — Next.js Route Handlers
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

  const { texto, setor_orgao, regiao_uf, incluir_catmat, incluir_precos } = body

  if (!texto || typeof texto !== 'string' || texto.trim().length < 2) {
    return NextResponse.json({ message: 'Campo "texto" é obrigatório (mínimo 2 caracteres)' }, { status: 400 })
  }

  try {
    const session = await supabase.auth.getSession()

    // Forward to Workers (Normalization Pipeline)
    const response = await fetch(`${WORKERS_URL}/api/v1/normalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
        'X-User-Id': user.id,
      },
      body: JSON.stringify({
        texto: (texto as string).trim(),
        setor_orgao,
        regiao_uf,
        incluir_catmat: incluir_catmat ?? true,
        incluir_precos: incluir_precos ?? false,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro interno' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()

    // Forward cache headers from Workers
    const res = NextResponse.json(data)
    const pipelineDuration = response.headers.get('X-Pipeline-Duration-Ms')
    const cacheHit = response.headers.get('X-Cache-Hit')
    if (pipelineDuration) res.headers.set('X-Pipeline-Duration-Ms', pipelineDuration)
    if (cacheHit) res.headers.set('X-Cache-Hit', cacheHit)

    return res
  } catch {
    return NextResponse.json({ message: 'Serviço de normalização indisponível' }, { status: 503 })
  }
}
