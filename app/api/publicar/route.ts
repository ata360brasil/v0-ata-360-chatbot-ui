/**
 * BFF Route — Publicação de Documentos
 *
 * POST /api/publicar  — publicar documento (assinatura + carimbo + PNCP)
 *
 * @see lib/api.ts — publication namespace
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.WORKERS_URL || 'https://ata360-api.monostateorg.workers.dev'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await request.json()
  const { processo_id } = body

  if (!processo_id) {
    return NextResponse.json({ error: 'processo_id obrigatório' }, { status: 400 })
  }

  // Injetar contexto
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('orgao_id, role')
    .eq('id', user.id)
    .single()

  // Verificar que user pertence ao orgao do processo
  const { data: processo } = await supabase
    .from('processos')
    .select('orgao_id')
    .eq('id', processo_id)
    .single()

  if (processo && usuario && processo.orgao_id !== usuario.orgao_id) {
    return NextResponse.json({ error: 'Acesso negado ao processo' }, { status: 403 })
  }

  const response = await fetch(`${WORKERS_URL}/api/v1/processo/${processo_id}/publicar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user.id,
      'X-Orgao-Id': usuario?.orgao_id || '',
      'X-User-Role': usuario?.role || 'servidor',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
