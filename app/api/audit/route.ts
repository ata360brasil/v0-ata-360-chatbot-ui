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
import type { Database } from '@/lib/supabase/database.types'

type AuditInsert = Database['public']['Tables']['audit_trail']['Insert']

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
    const rows: AuditInsert[] = capped.map((event: Record<string, unknown>) => ({
      orgao_id: (user.user_metadata?.orgao_id as string) ?? '',
      processo_id: (event.resourceId as string) ?? null,
      acao: event.action as string,
      agente: 'frontend',
      detalhes: (event.details as Record<string, unknown>) ?? null,
      hash: '',
      estado_anterior: null,
      estado_novo: null,
      criado_por: user.id,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase generated types resolve Insert to never for append-only tables
    const { error } = await supabase.from('audit_trail').insert(rows as any)

    if (error) {
      return NextResponse.json({ message: 'Erro ao salvar audit' }, { status: 500 })
    }

    return NextResponse.json({ received: capped.length })
  } catch {
    return NextResponse.json({ message: 'Serviço indisponível' }, { status: 503 })
  }
}
