/**
 * ATA360 — Rotas de Prazos e Alertas
 *
 * @see workers/src/prazos/controller.ts
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import { criarPrazo, criarPrazosProcesso, verificarPrazos } from '../prazos/controller'

const app = new Hono<{ Bindings: Env }>()

// GET /prazos/:orgaoId — Listar prazos do órgão
app.get('/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')
  const status = c.req.query('status') // pendente, em_andamento, vencido, etc.
  const nivel = c.req.query('nivel')   // informativo, atencao, urgente, critico

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  let query = `${c.env.SUPABASE_URL}/rest/v1/prazos?orgao_id=eq.${orgaoId}&select=*&order=data_limite.asc`
  if (status) query += `&status=eq.${status}`
  if (nivel) query += `&nivel_alerta=eq.${nivel}`

  const response = await fetch(query, { headers })
  if (!response.ok) return c.json({ erro: 'Erro ao buscar prazos' }, 500)

  const prazos = await response.json()
  return c.json({ prazos })
})

// GET /prazos/:orgaoId/alertas — Alertas do órgão
app.get('/:orgaoId/alertas', async (c) => {
  const orgaoId = c.req.param('orgaoId')
  const userId = c.req.header('X-User-Id')
  const naoLidos = c.req.query('nao_lidos') === 'true'

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  let query = `${c.env.SUPABASE_URL}/rest/v1/alertas?orgao_id=eq.${orgaoId}&select=*&order=created_at.desc&limit=50`

  // Filtrar por destinatário (membro vê só os seus + gerais)
  if (userId) {
    query += `&or=(destinatario_id.eq.${userId},destinatario_id.is.null)`
  }
  if (naoLidos) {
    query += `&lido=eq.false`
  }

  const response = await fetch(query, { headers })
  if (!response.ok) return c.json({ erro: 'Erro ao buscar alertas' }, 500)

  const alertas = await response.json()
  return c.json({ alertas })
})

// POST /prazos — Criar prazo manual
app.post('/', async (c) => {
  const body = await c.req.json() as {
    orgao_id: string
    tipo: string
    descricao: string
    data_limite: string
    processo_id?: string
    destinatario_tipo?: 'membro' | 'setor' | 'orgao' | 'geral'
    destinatario_id?: string
    setor?: string
    base_legal?: string
    criado_por?: string
  }

  if (!body.orgao_id || !body.tipo || !body.descricao || !body.data_limite) {
    return c.json({ erro: 'orgao_id, tipo, descricao e data_limite são obrigatórios' }, 400)
  }

  const prazoId = await criarPrazo(
    body.orgao_id,
    body.tipo,
    body.descricao,
    new Date(body.data_limite),
    c.env,
    {
      processo_id: body.processo_id,
      destinatario_tipo: body.destinatario_tipo,
      destinatario_id: body.destinatario_id,
      setor: body.setor,
      base_legal: body.base_legal,
      criado_por: body.criado_por,
    },
  )

  return c.json({ sucesso: true, prazo_id: prazoId })
})

// POST /prazos/processo — Criar prazos automáticos para processo
app.post('/processo', async (c) => {
  const body = await c.req.json() as {
    processo_id: string
    orgao_id: string
    modalidade: string
    criado_por: string
  }

  if (!body.processo_id || !body.orgao_id || !body.modalidade) {
    return c.json({ erro: 'processo_id, orgao_id e modalidade são obrigatórios' }, 400)
  }

  const total = await criarPrazosProcesso(
    body.processo_id,
    body.orgao_id,
    body.modalidade,
    body.criado_por,
    c.env,
  )

  return c.json({ sucesso: true, prazos_criados: total })
})

// PATCH /prazos/:id/lido — Marcar alerta como lido
app.patch('/:id/lido', async (c) => {
  const alertaId = c.req.param('id')

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  await fetch(`${c.env.SUPABASE_URL}/rest/v1/alertas?id=eq.${alertaId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ lido: true, lido_em: new Date().toISOString() }),
  })

  return c.json({ sucesso: true })
})

export default app
