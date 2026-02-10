/**
 * ATA360 — Rotas de Ouvidoria e Canal de Denúncias
 *
 * Canal terceirizado e independente conforme CGU Empresa Ética.
 * Suporta denúncia anônima, acompanhamento por protocolo,
 * prazo de resposta (30 dias), proteção ao denunciante.
 *
 * Categorias: ética, assédio, corrupção, fraude, discriminação,
 * conflito de interesse, vazamento de dados, melhoria, outro.
 *
 * @see CGU — Programa Empresa Pró-Ética
 * @see DOCUMENTACAO.md — Seção 15 — Ouvidoria
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'

const app = new Hono<{ Bindings: Env }>()

// POST /ouvidoria — Criar manifestação (denúncia, reclamação, sugestão, etc.)
app.post('/', async (c) => {
  const body = await c.req.json() as {
    orgao_id?: string
    tipo: string
    categoria: string
    assunto: string
    descricao: string
    anonimo?: boolean
    denunciante_nome?: string
    denunciante_email?: string
    acusado_nome?: string
    acusado_cargo?: string
    acusado_orgao?: string
  }

  if (!body.tipo || !body.categoria || !body.assunto || !body.descricao) {
    return c.json({ erro: 'tipo, categoria, assunto e descricao são obrigatórios' }, 400)
  }

  // Gerar protocolo único
  const now = new Date()
  const dataPart = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
  const protocolo = `OUV-${dataPart}-${randomPart}`

  // Prazo de resposta: 30 dias (padrão CGU)
  const prazoResposta = new Date(now)
  prazoResposta.setDate(prazoResposta.getDate() + 30)

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  // Obter IP do request
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || '0.0.0.0'
  const userId = c.req.header('X-User-Id')

  const manifestacao = {
    orgao_id: body.orgao_id || null,
    protocolo,
    tipo: body.tipo,
    categoria: body.categoria,
    assunto: body.assunto,
    descricao: body.descricao,
    anonimo: body.anonimo ?? false,
    denunciante_id: body.anonimo ? null : userId,
    denunciante_nome: body.anonimo ? null : body.denunciante_nome,
    denunciante_email: body.anonimo ? null : body.denunciante_email,
    acusado_nome: body.acusado_nome || null,
    acusado_cargo: body.acusado_cargo || null,
    acusado_orgao: body.acusado_orgao || null,
    status: 'recebida',
    prioridade: inferirPrioridade(body.tipo, body.categoria),
    prazo_resposta: prazoResposta.toISOString(),
    protecao_identidade: body.anonimo ?? true,
    ip_origem: ip,
  }

  const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/ouvidoria_manifestacoes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(manifestacao),
  })

  if (!response.ok) {
    return c.json({ erro: 'Erro ao registrar manifestação' }, 500)
  }

  return c.json({
    sucesso: true,
    protocolo,
    prazo_resposta: prazoResposta.toISOString(),
    mensagem: `Manifestação registrada com protocolo ${protocolo}. Prazo de resposta: até ${prazoResposta.toLocaleDateString('pt-BR')}.`,
    instrucoes: body.anonimo
      ? 'Para acompanhar, utilize apenas o número do protocolo. Sua identidade está protegida.'
      : 'Você será notificado por e-mail sobre o andamento.',
  })
})

// GET /ouvidoria/protocolo/:protocolo — Consultar por protocolo
app.get('/protocolo/:protocolo', async (c) => {
  const protocolo = c.req.param('protocolo')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/ouvidoria_manifestacoes?protocolo=eq.${protocolo}&select=protocolo,tipo,categoria,assunto,status,prioridade,resposta,respondido_em,prazo_resposta,created_at`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Erro ao buscar manifestação' }, 500)
  const [manifestacao] = await response.json() as Array<Record<string, unknown>>

  if (!manifestacao) {
    return c.json({ erro: 'Protocolo não encontrado' }, 404)
  }

  return c.json(manifestacao)
})

// GET /ouvidoria/:orgaoId — Listar manifestações do órgão (para administradores)
app.get('/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')
  const status = c.req.query('status')
  const tipo = c.req.query('tipo')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  let query = `${c.env.SUPABASE_URL}/rest/v1/ouvidoria_manifestacoes?orgao_id=eq.${orgaoId}&select=id,protocolo,tipo,categoria,assunto,status,prioridade,anonimo,created_at&order=created_at.desc`
  if (status) query += `&status=eq.${status}`
  if (tipo) query += `&tipo=eq.${tipo}`

  const response = await fetch(query, { headers })
  if (!response.ok) return c.json({ erro: 'Erro ao buscar manifestações' }, 500)

  const manifestacoes = await response.json()
  return c.json({ manifestacoes })
})

// PATCH /ouvidoria/:id/responder — Responder manifestação
app.patch('/:id/responder', async (c) => {
  const manifestacaoId = c.req.param('id')
  const body = await c.req.json() as { resposta: string; status?: string }

  if (!body.resposta) {
    return c.json({ erro: 'resposta é obrigatória' }, 400)
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  const userId = c.req.header('X-User-Id')

  await fetch(`${c.env.SUPABASE_URL}/rest/v1/ouvidoria_manifestacoes?id=eq.${manifestacaoId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      resposta: body.resposta,
      respondido_em: new Date().toISOString(),
      status: body.status || 'respondida',
      responsavel_id: userId,
      updated_at: new Date().toISOString(),
    }),
  })

  return c.json({ sucesso: true, mensagem: 'Resposta registrada com sucesso.' })
})

// GET /ouvidoria/estatisticas/:orgaoId — Estatísticas da ouvidoria
app.get('/estatisticas/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/ouvidoria_manifestacoes?orgao_id=eq.${orgaoId}&select=tipo,status,prioridade`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Erro ao buscar estatísticas' }, 500)
  const manifestacoes = await response.json() as Array<{ tipo: string; status: string; prioridade: string }>

  const total = manifestacoes.length
  const por_tipo: Record<string, number> = {}
  const por_status: Record<string, number> = {}
  const por_prioridade: Record<string, number> = {}

  for (const m of manifestacoes) {
    por_tipo[m.tipo] = (por_tipo[m.tipo] || 0) + 1
    por_status[m.status] = (por_status[m.status] || 0) + 1
    por_prioridade[m.prioridade] = (por_prioridade[m.prioridade] || 0) + 1
  }

  return c.json({
    total,
    por_tipo,
    por_status,
    por_prioridade,
    taxa_resolucao: total > 0
      ? Math.round(((por_status['respondida'] || 0) + (por_status['encerrada'] || 0)) / total * 100)
      : 0,
  })
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function inferirPrioridade(tipo: string, categoria: string): string {
  // Denúncias de corrupção, assédio sexual = urgente
  if (tipo === 'denuncia') {
    if (['corrupcao', 'assedio_sexual', 'fraude_licitacao'].includes(categoria)) return 'urgente'
    if (['assedio_moral', 'discriminacao', 'direcionamento'].includes(categoria)) return 'alta'
    return 'normal'
  }
  if (tipo === 'reclamacao') return 'normal'
  return 'baixa'
}

export default app
