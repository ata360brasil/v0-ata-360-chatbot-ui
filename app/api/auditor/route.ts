/**
 * BFF Route — AUDITOR Learning API
 *
 * Proxies para Workers: /api/v1/auditor/*
 * Auth obrigatório via Supabase.
 *
 * @see lib/api.ts — auditor namespace
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

  // Injetar contexto do usuário
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('orgao_id, role')
    .eq('id', user.id)
    .single()

  const enrichedBody = {
    ...body,
    orgao_id: usuario?.orgao_id,
  }

  const response = await fetch(`${WORKERS_URL}/api/v1/auditor/resultado`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user.id,
      'X-Orgao-Id': usuario?.orgao_id || '',
      'X-User-Role': usuario?.role || 'servidor',
    },
    body: JSON.stringify(enrichedBody),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verificar role para dados de conformidade
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['superadm', 'suporte', 'localadm']
  if (!usuario?.role || !allowedRoles.includes(usuario.role)) {
    return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 })
  }

  const response = await fetch(`${WORKERS_URL}/api/v1/auditor/conformidade`, {
    headers: {
      'X-User-Id': user.id,
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
