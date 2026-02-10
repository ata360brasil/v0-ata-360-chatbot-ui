/**
 * BFF Route — Dashboard Metrics API
 *
 * GET /api/dashboard          — metricas completas (superadm/suporte)
 * GET /api/dashboard?view=summary — contagens resumidas
 *
 * @see lib/api.ts — dashboard namespace
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const WORKERS_URL = process.env.WORKERS_URL || 'https://ata360-api.monostateorg.workers.dev'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verificar role
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('role')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['superadm', 'suporte']
  if (!usuario?.role || !allowedRoles.includes(usuario.role)) {
    return NextResponse.json({ error: 'Acesso restrito a SuperADM/Suporte' }, { status: 403 })
  }

  const url = new URL(request.url)
  const view = url.searchParams.get('view')

  const workersPath = view === 'summary'
    ? '/api/v1/dashboard/summary'
    : '/api/v1/dashboard/metrics'

  const response = await fetch(`${WORKERS_URL}${workersPath}`, {
    headers: {
      'X-User-Id': user.id,
      'X-User-Role': usuario.role,
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
