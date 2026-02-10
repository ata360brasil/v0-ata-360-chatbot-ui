/**
 * ATA360 — Workers Routes: Processo (Hono)
 *
 * Os handlers que os BFF routes fazem proxy para.
 * Toda lógica de negócio fica aqui — frontend é apenas BFF.
 *
 * Routes:
 *   POST /                — criar processo
 *   GET  /:id/status      — status atual
 *   POST /:id/chat        — mensagem no chat
 *   POST /:id/decisao     — decisão do usuário
 *   GET  /:id/insights    — insight cards
 *   GET  /:id/trilha      — status da trilha de documentos
 *   GET  /:id/mensagens   — histórico de mensagens
 *
 * @see Spec v8 Part 20.9 — API do Orquestrador
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import { PROCESS_STATES } from '../orchestrator/types'
import { loadProcesso, updateProcesso } from '../orchestrator/engine'
import { runPipeline } from '../orchestrator/pipeline'
import { routeMessage } from '../orchestrator/chat-router'
import { initializeTrail, getTrailStatus, getTrailStats } from '../orchestrator/trail'

const app = new Hono<{ Bindings: Env }>()

// ─── POST / — Criar Processo ─────────────────────────────────────────────────

app.post('/', async (c) => {
  const userId = c.req.header('X-User-Id') || ''
  const orgaoId = c.req.header('X-Orgao-Id') || ''

  if (!userId || !orgaoId) {
    return c.json({ error: 'Headers X-User-Id e X-Orgao-Id obrigatórios' }, 400)
  }

  const body = await c.req.json<{
    objeto: string
    tipo_documento?: string
    modalidade?: string
  }>()

  if (!body.objeto || body.objeto.length < 3) {
    return c.json({ error: 'Objeto é obrigatório (mín. 3 caracteres)' }, 400)
  }

  const modalidade = body.modalidade || 'pregao'
  const trilha = initializeTrail(modalidade)
  const numero = generateProcessNumber()

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  // Inserir processo no Supabase
  const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/processos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      orgao_id: orgaoId,
      numero,
      objeto: body.objeto,
      status: PROCESS_STATES.RASCUNHO,
      fase: 'planejamento',
      valor_estimado: 0,
      modalidade,
      trilha,
      trilha_posicao: 0,
      documento_atual: trilha[0]?.tipo || null,
      iteracao: 1,
      sugestoes_restantes: 3,
      reauditorias_restantes: 5,
      selo_aprovado: false,
      documento_versao: 0,
      proximo_sugerido: trilha[0]?.tipo || null,
      criado_por: userId,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    return c.json({ error: `Falha ao criar processo: ${error}` }, 500)
  }

  const [processo] = await response.json() as Array<{ id: string; numero: string }>

  // Registrar no audit_trail
  await fetch(`${c.env.SUPABASE_URL}/rest/v1/audit_trail`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      orgao_id: orgaoId,
      processo_id: processo.id,
      acao: 'PROCESSO_CRIADO',
      agente: 'orquestrador',
      estado_anterior: null,
      estado_novo: PROCESS_STATES.RASCUNHO,
      hash: crypto.randomUUID(),
      detalhes: {
        objeto: body.objeto,
        modalidade,
        trilha_documentos: trilha.map(d => d.tipo),
      },
      criado_por: userId,
    }),
  })

  return c.json({
    id: processo.id,
    numero: processo.numero,
    modalidade,
    trilha: trilha.map(d => d.tipo),
    documento_atual: trilha[0]?.tipo || null,
  }, 201)
})

// ─── GET /:id/status — Status Atual ──────────────────────────────────────────

app.get('/:id/status', async (c) => {
  const processoId = c.req.param('id')
  const orgaoId = c.req.header('X-Orgao-Id')

  const processo = await loadProcesso(processoId, c.env)

  if (!processo) {
    return c.json({ error: 'Processo não encontrado' }, 404)
  }

  // Segurança multi-tenant: impedir acesso cross-tenant (Part 19)
  if (orgaoId && processo.orgao_id !== orgaoId) {
    return c.json({ error: 'Processo não encontrado' }, 404)
  }

  // Sanitizar resposta (Part 19: sem dados internos)
  return c.json({
    id: processo.id,
    numero: processo.numero,
    objeto: processo.objeto,
    estado: processo.status,
    fase: processo.fase,
    modalidade: processo.modalidade,
    iteracao: processo.iteracao,
    documento_atual: processo.documento_atual,
    // Parecer sanitizado
    parecer_auditor: processo.auditor_parecer_atual ? {
      veredicto: processo.auditor_parecer_atual.veredicto,
      score: processo.auditor_parecer_atual.score,
      checklist: processo.auditor_parecer_atual.checklist_publico,
      selo_aprovado: processo.auditor_parecer_atual.selo_aprovado,
      iteracao: processo.auditor_parecer_atual.iteracao,
    } : null,
    selo_aprovado: processo.selo_aprovado,
    proximo_sugerido: processo.proximo_sugerido,
    // Sugestão sanitizada
    sugestao_acma: processo.acma_sugestao_atual ? {
      texto_sugerido: processo.acma_sugestao_atual.texto_sugerido,
      resumo: processo.acma_sugestao_atual.resumo,
      secoes_geradas: processo.acma_sugestao_atual.secoes_geradas,
      iteracao: processo.acma_sugestao_atual.iteracao,
    } : null,
    // Artefato
    documento: processo.documento_url ? {
      url: processo.documento_url,
      hash: processo.documento_hash,
      versao: processo.documento_versao,
    } : null,
    // Trilha
    trilha: (processo.trilha || []).map(d => ({
      tipo: d.tipo,
      status: d.status,
      versao: d.versao,
      selo_aprovado: d.selo_aprovado,
    })),
    trilha_stats: getTrailStats(processo.trilha || []),
    // Limites
    sugestoes_restantes: processo.sugestoes_restantes,
    reauditorias_restantes: processo.reauditorias_restantes,
  })
})

// ─── POST /:id/chat — Mensagem no Chat ──────────────────────────────────────

app.post('/:id/chat', async (c) => {
  const processoId = c.req.param('id')
  const userId = c.req.header('X-User-Id') || ''
  const orgaoId = c.req.header('X-Orgao-Id') || ''

  const body = await c.req.json<{ mensagem: string }>()

  if (!body.mensagem || typeof body.mensagem !== 'string') {
    return c.json({ error: 'Mensagem é obrigatória' }, 400)
  }

  const response = await routeMessage(
    processoId,
    body.mensagem,
    userId,
    orgaoId,
    c.env,
  )

  return c.json({
    role: response.role,
    content: response.content,
    artifact: response.artefato || null,
    insight_cards: response.insight_cards || [],
    pipeline_acionado: response.pipeline_acionado,
    pipeline_result: response.pipeline_result ? {
      sucesso: response.pipeline_result.sucesso,
      estado: response.pipeline_result.estado,
      sugestao_acma: response.pipeline_result.sugestao_acma,
      parecer_auditor: response.pipeline_result.parecer_auditor,
      artefato: response.pipeline_result.artefato,
      trilha: response.pipeline_result.trilha,
      proximo_documento: response.pipeline_result.proximo_documento,
      mensagem: response.pipeline_result.mensagem,
      erro: response.pipeline_result.erro,
    } : null,
  })
})

// ─── POST /:id/decisao — Decisão do Usuário ─────────────────────────────────

app.post('/:id/decisao', async (c) => {
  const processoId = c.req.param('id')
  const userId = c.req.header('X-User-Id') || ''
  const orgaoId = c.req.header('X-Orgao-Id') || ''

  const body = await c.req.json<{
    acao: string
    texto_editado?: string
  }>()

  const validDecisions = ['APROVAR', 'EDITAR', 'NOVA_SUGESTAO', 'PROSSEGUIR', 'DESCARTAR']
  if (!body.acao || !validDecisions.includes(body.acao)) {
    return c.json({ error: `Ação inválida. Válidas: ${validDecisions.join(', ')}` }, 400)
  }

  const result = await runPipeline(
    processoId,
    {
      tipo: 'decisao',
      decisao: body.acao as any,
      texto_editado: body.texto_editado,
    },
    userId,
    orgaoId,
    c.env,
  )

  return c.json({
    sucesso: result.sucesso,
    novo_estado: result.estado,
    sugestao_acma: result.sugestao_acma,
    parecer_auditor: result.parecer_auditor,
    artefato: result.artefato,
    trilha: result.trilha,
    proximo_documento: result.proximo_documento,
    mensagem: result.mensagem,
    erro: result.erro,
  })
})

// ─── GET /:id/insights — Insight Cards ───────────────────────────────────────

app.get('/:id/insights', async (c) => {
  const processoId = c.req.param('id')
  const processo = await loadProcesso(processoId, c.env)

  if (!processo) {
    return c.json({ error: 'Processo não encontrado' }, 404)
  }

  return c.json({
    cards: processo.insight_context?.cards || [],
  })
})

// ─── GET /:id/trilha — Trilha de Documentos ─────────────────────────────────

app.get('/:id/trilha', async (c) => {
  const processoId = c.req.param('id')
  const trilha = await getTrailStatus(processoId, c.env)
  const processo = await loadProcesso(processoId, c.env)

  return c.json({
    trilha: trilha.map(d => ({
      tipo: d.tipo,
      status: d.status,
      versao: d.versao,
      hash: d.hash,
      selo_aprovado: d.selo_aprovado,
      finalizado_em: d.finalizado_em,
    })),
    stats: getTrailStats(trilha),
    documento_atual: processo?.documento_atual || null,
    posicao: processo?.trilha_posicao || 0,
  })
})

// ─── GET /:id/mensagens — Histórico de Mensagens ────────────────────────────

app.get('/:id/mensagens', async (c) => {
  const processoId = c.req.param('id')
  const limit = parseInt(c.req.query('limit') || '50', 10)
  const offset = parseInt(c.req.query('offset') || '0', 10)

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/processo_mensagens?processo_id=eq.${processoId}&select=id,role,content,artefato,insight_cards,estado_no_momento,created_at&order=created_at.asc&limit=${limit}&offset=${offset}`,
    { headers },
  )

  if (!response.ok) {
    return c.json({ error: 'Falha ao carregar mensagens' }, 500)
  }

  const mensagens = await response.json() as Array<{
    id: string
    role: string
    content: string
    artefato: Record<string, unknown> | null
    insight_cards: unknown[] | null
    estado_no_momento: string
    created_at: string
  }>

  // Part 19: filtrar roles internos, remover metadata
  const sanitized = mensagens
    .filter(m => !['orquestrador'].includes(m.role)) // Ocultar mensagens internas
    .map(m => ({
      id: m.id,
      role: mapRoleForFrontend(m.role),
      content: m.content,
      artifact: m.artefato,
      insight_cards: m.insight_cards,
      estado: m.estado_no_momento,
      timestamp: m.created_at,
    }))

  return c.json({ mensagens: sanitized })
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateProcessNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ATA-${year}${month}-${random}`
}

function mapRoleForFrontend(role: string): string {
  switch (role) {
    case 'user': return 'user'
    case 'acma':
    case 'auditor':
    case 'design_law':
    case 'insight':
    case 'assistant': return 'assistant'
    case 'system':
    case 'orquestrador': return 'system'
    default: return 'assistant'
  }
}

export default app
