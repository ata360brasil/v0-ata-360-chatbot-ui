/**
 * BFF Route — User Profile API
 *
 * GET  /api/profile  — perfil sanitizado
 * PATCH /api/profile — atualizar preferencias
 * POST /api/profile  — trigger aprendizado (learn)
 *
 * @see lib/api.ts — profile namespace
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.WORKERS_URL || 'https://ata360-api.monostateorg.workers.dev'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const response = await fetch(`${WORKERS_URL}/api/v1/profile`, {
    headers: {
      'X-User-Id': user.id,
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await request.json()

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('orgao_id')
    .eq('id', user.id)
    .single()

  const response = await fetch(`${WORKERS_URL}/api/v1/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user.id,
      'X-Orgao-Id': usuario?.orgao_id || '',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await request.json()

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('orgao_id')
    .eq('id', user.id)
    .single()

  const response = await fetch(`${WORKERS_URL}/api/v1/profile/learn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': user.id,
      'X-Orgao-Id': usuario?.orgao_id || '',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
