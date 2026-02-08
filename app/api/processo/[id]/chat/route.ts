/**
 * POST /api/processo/:id/chat — Envia mensagem ao Orquestrador.
 *
 * Endpoint mais importante do sistema. Servidor digita mensagem,
 * Orquestrador roteia para ACMA/Insight Engine, retorna resposta
 * com texto + artefato opcional + insight cards.
 *
 * @see Spec v8 Part 20.3 — Fluxo Cíclico
 * @see Spec v8 Part 20.9 — API do Orquestrador
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  const { mensagem } = body

  if (!mensagem || typeof mensagem !== 'string') {
    return NextResponse.json({ message: 'Mensagem é obrigatória' }, { status: 400 })
  }

  try {
    const response = await fetch(`${WORKERS_URL}/api/v1/processo/${id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        'X-Orgao-Id': user.user_metadata?.orgao_id ?? '',
      },
      body: JSON.stringify({ mensagem }),
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
