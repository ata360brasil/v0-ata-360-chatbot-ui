/**
 * ATA360 — Route: Sistema de Avaliações
 *
 * POST /api/v1/avaliacoes/fornecedor  — Registra avaliação de fornecedor
 * POST /api/v1/avaliacoes/plataforma  — Registra avaliação ATA360 (saída)
 * POST /api/v1/avaliacoes/resposta    — Registra avaliação de resposta IA
 * POST /api/v1/avaliacoes/artefato    — Registra avaliação de artefato
 * GET  /api/v1/avaliacoes/dashboard   — Métricas agregadas para SuperADM
 *
 * @see Spec v8 Part 19 — métricas internas nunca expostas no frontend
 */

import { Hono } from 'hono'

interface WorkerEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

const avaliacoes = new Hono<{ Bindings: WorkerEnv }>()

// ─── Helper: Insere avaliação no Supabase ──────────────────────────────────

async function insertAvaliacao(
  env: WorkerEnv,
  table: string,
  data: Record<string, unknown>,
): Promise<Response> {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  })
  return response
}

// ─── POST /api/v1/avaliacoes/fornecedor ────────────────────────────────────

avaliacoes.post('/fornecedor', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!userId || !orgaoId) return c.json({ message: 'Não autorizado' }, 401)

  const body = await c.req.json<Record<string, unknown>>()

  // Validação básica
  if (!body.contrato_numero || !body.fornecedor_cnpj || !body.fornecedor_nome) {
    return c.json({ message: 'contrato_numero, fornecedor_cnpj e fornecedor_nome são obrigatórios' }, 400)
  }
  for (const campo of ['nota_fornecedor', 'nota_entrega', 'nota_qualidade', 'nota_relacionamento']) {
    const val = body[campo]
    if (typeof val !== 'number' || val < 1 || val > 5) {
      return c.json({ message: `${campo} deve ser um número entre 1 e 5` }, 400)
    }
  }

  const response = await insertAvaliacao(c.env, 'avaliacao_fornecedor', {
    orgao_id: orgaoId,
    usuario_id: userId,
    ...body,
  })

  if (!response.ok) {
    return c.json({ message: 'Erro ao salvar avaliação' }, 500)
  }

  const data = await response.json()
  return c.json({ sucesso: true, avaliacao: data }, 201)
})

// ─── POST /api/v1/avaliacoes/plataforma ────────────────────────────────────

avaliacoes.post('/plataforma', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!userId || !orgaoId) return c.json({ message: 'Não autorizado' }, 401)

  const body = await c.req.json<Record<string, unknown>>()

  if (typeof body.nps_score !== 'number' || body.nps_score < 0 || body.nps_score > 10) {
    return c.json({ message: 'nps_score deve ser um número entre 0 e 10' }, 400)
  }
  if (typeof body.nota_geral !== 'number' || body.nota_geral < 1 || body.nota_geral > 5) {
    return c.json({ message: 'nota_geral deve ser um número entre 1 e 5' }, 400)
  }

  const response = await insertAvaliacao(c.env, 'avaliacao_plataforma', {
    orgao_id: orgaoId,
    usuario_id: userId,
    ...body,
  })

  if (!response.ok) {
    return c.json({ message: 'Erro ao salvar avaliação' }, 500)
  }

  const data = await response.json()
  return c.json({ sucesso: true, avaliacao: data }, 201)
})

// ─── POST /api/v1/avaliacoes/resposta ──────────────────────────────────────

avaliacoes.post('/resposta', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!userId || !orgaoId) return c.json({ message: 'Não autorizado' }, 401)

  const body = await c.req.json<Record<string, unknown>>()

  if (!body.agente || typeof body.nota !== 'number' || body.nota < 1 || body.nota > 5) {
    return c.json({ message: 'agente e nota (1-5) são obrigatórios' }, 400)
  }
  if (!body.tipo_feedback) {
    return c.json({ message: 'tipo_feedback é obrigatório' }, 400)
  }

  const response = await insertAvaliacao(c.env, 'avaliacao_resposta', {
    orgao_id: orgaoId,
    usuario_id: userId,
    ...body,
  })

  if (!response.ok) {
    return c.json({ message: 'Erro ao salvar avaliação' }, 500)
  }

  const data = await response.json()
  return c.json({ sucesso: true, avaliacao: data }, 201)
})

// ─── POST /api/v1/avaliacoes/artefato ──────────────────────────────────────

avaliacoes.post('/artefato', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!userId || !orgaoId) return c.json({ message: 'Não autorizado' }, 401)

  const body = await c.req.json<Record<string, unknown>>()

  if (!body.tipo_documento || typeof body.nota_geral !== 'number' || body.nota_geral < 1 || body.nota_geral > 5) {
    return c.json({ message: 'tipo_documento e nota_geral (1-5) são obrigatórios' }, 400)
  }
  if (!body.decisao) {
    return c.json({ message: 'decisao é obrigatório' }, 400)
  }

  const response = await insertAvaliacao(c.env, 'avaliacao_artefato', {
    orgao_id: orgaoId,
    usuario_id: userId,
    ...body,
  })

  if (!response.ok) {
    return c.json({ message: 'Erro ao salvar avaliação' }, 500)
  }

  const data = await response.json()
  return c.json({ sucesso: true, avaliacao: data }, 201)
})

// ─── GET /api/v1/avaliacoes/dashboard ──────────────────────────────────────

avaliacoes.get('/dashboard', async (c) => {
  // Dashboard é acessível para superadm (verificação de role no BFF)
  try {
    const headers = {
      'apikey': c.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    }
    const base = c.env.SUPABASE_URL

    // Buscar dados em paralelo
    const [npsRes, fornecedoresRes, respostasRes, artefatosRes, comentariosRes] = await Promise.all([
      fetch(`${base}/rest/v1/v_nps_score?select=*&order=mes.desc&limit=12`, { headers }),
      fetch(`${base}/rest/v1/v_ranking_fornecedores?select=*&order=nota_media.desc&limit=10`, { headers }),
      fetch(`${base}/rest/v1/v_qualidade_agentes?select=*&order=semana.desc&limit=20`, { headers }),
      fetch(`${base}/rest/v1/v_qualidade_artefatos?select=*&order=mes.desc&limit=20`, { headers }),
      fetch(`${base}/rest/v1/avaliacao_plataforma?select=nota_geral,comentario,created_at&order=created_at.desc&limit=10&comentario=not.is.null`, { headers }),
    ])

    const [npsData, fornecedoresData, respostasData, artefatosData, comentariosData] = await Promise.all([
      npsRes.ok ? npsRes.json() : [],
      fornecedoresRes.ok ? fornecedoresRes.json() : [],
      respostasRes.ok ? respostasRes.json() : [],
      artefatosRes.ok ? artefatosRes.json() : [],
      comentariosRes.ok ? comentariosRes.json() : [],
    ])

    return c.json({
      nps: npsData,
      fornecedores: fornecedoresData,
      respostas: respostasData,
      artefatos: artefatosData,
      comentarios: comentariosData,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar métricas'
    return c.json({ message }, 500)
  }
})

export default avaliacoes
