/**
 * POST /api/audit — Recebe eventos de auditoria do frontend.
 *
 * Persiste no Supabase tabela audit_trail.
 * Batch insert para performance (max 50 events por request).
 *
 * @see Spec v8 Part 20.11 — Audit Trail
 * @see Danilo Doneda / ANPD — LGPD compliance
 */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { events } = body

  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ message: 'Events array vazio' }, { status: 400 })
  }

  // Cap at 50 events per request (DoS protection)
  const capped = events.slice(0, 50)

  try {
    const { error } = await supabase.from('audit_trail').insert(
      capped.map((event: Record<string, unknown>) => ({
        orgao_id: user.user_metadata?.orgao_id ?? '',
        processo_id: event.resourceId ?? null,
        acao: event.action,
        agente: 'frontend',
        detalhes: event.details ?? null,
        hash: '', // Hash calculado server-side
        criado_por: user.id,
      })),
    )

    if (error) {
      return NextResponse.json({ message: 'Erro ao salvar audit' }, { status: 500 })
    }

    return NextResponse.json({ received: capped.length })
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
