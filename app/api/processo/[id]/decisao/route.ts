/**
 * POST /api/processo/:id/decisao — Decisão do usuário no fluxo cíclico.
 *
 * Ações: APROVAR, EDITAR, NOVA_SUGESTAO, PROSSEGUIR, DESCARTAR.
 *
 * @see Spec v8 Part 20.3 passo 6 — Decisão Humana
 * @see Spec v8 Part 20.5 — Limites de iteração
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { userDecisionSchema } from '@/lib/schemas/process'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()

  // Validação Zod no BFF (Colinhacks best practice)
  const parsed = userDecisionSchema.safeParse(body.acao)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Ação inválida', errors: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/processo/${id}/decisao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
      body: JSON.stringify({ acao: parsed.data }),
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
