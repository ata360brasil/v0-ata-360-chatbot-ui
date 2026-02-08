/**
 * GET /api/processo/:id/status — Estado atual do processo.
 *
 * Retorna: estado, iteração, parecer, selo_aprovado, próximo sugerido.
 *
 * @see Spec v8 Part 20.4 — State Machine
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.NEXT_PUBLIC_WORKERS_URL ?? ''

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/processo/${id}/status`, {
      headers: {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
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
