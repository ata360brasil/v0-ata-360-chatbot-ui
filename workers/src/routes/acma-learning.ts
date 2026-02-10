/**
 * ATA360 — Workers Routes: ACMA Learning
 *
 * Endpoints:
 * - POST /api/v1/acma/sugestao    — registra sugestao + calcula edit delta
 * - POST /api/v1/acma/rating      — atualiza rating de sugestao existente
 * - GET  /api/v1/acma/performance  — metricas de performance ACMA
 *
 * Part 19: prompt_template nunca retornado ao frontend.
 *
 * @see Spec v8 Part 08 — ACMA Agent
 */
import { Hono } from 'hono'
import { calculateEditDelta, classifyEditQuality } from '../acma/edit-delta'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

// ─── POST /api/v1/acma/sugestao ─────────────────────────────────────────────

app.post('/sugestao', async (c) => {
  const body = await c.req.json()
  const {
    orgao_id, usuario_id,
    processo_id, documento_tipo, secao,
    texto_sugerido, texto_final, decisao,
    modelo_usado, tier, iteracao,
    prompt_hash, setor,
    tokens_input, tokens_output, latency_ms,
  } = body

  if (!processo_id || !documento_tipo || !secao || !texto_sugerido || !decisao) {
    return c.json({ error: 'Campos obrigatórios: processo_id, documento_tipo, secao, texto_sugerido, decisao' }, 400)
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  // Calcular edit delta se texto_final fornecido
  let editDelta = null
  if (texto_final && decisao === 'EDITAR') {
    editDelta = calculateEditDelta(texto_sugerido, texto_final)
  }

  // Inserir sugestao
  const insertData: Record<string, unknown> = {
    orgao_id: orgao_id || '00000000-0000-0000-0000-000000000000',
    processo_id,
    documento_tipo,
    secao,
    texto_sugerido,
    texto_final: texto_final || null,
    prompt_hash: prompt_hash || '',
    modelo_usado: modelo_usado || 'unknown',
    tier: tier || 'haiku',
    decisao,
    edit_distance: editDelta?.edit_distance ?? null,
    edit_ratio: editDelta?.edit_ratio ?? null,
    diferencas: editDelta?.diferencas ?? null,
    setor: setor || null,
    iteracao: iteracao || 1,
    tokens_input: tokens_input || null,
    tokens_output: tokens_output || null,
    latency_ms: latency_ms || null,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/acma_sugestoes`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(insertData),
    },
  )

  if (!response.ok) {
    const err = await response.text()
    return c.json({ error: 'Falha ao registrar sugestão', details: err }, 500)
  }

  const [sugestao] = await response.json() as Array<{ id: string }>

  // Incrementar total_usos da versão de prompt ativa
  if (prompt_hash) {
    await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/rpc/increment_prompt_usos`,
      {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ p_prompt_hash: prompt_hash }),
      },
    ).catch(() => { /* best effort */ })
  }

  return c.json({
    sucesso: true,
    sugestao_id: sugestao.id,
    edit_delta: editDelta ? {
      edit_distance: editDelta.edit_distance,
      edit_ratio: editDelta.edit_ratio,
      qualidade: classifyEditQuality(editDelta.edit_ratio),
    } : null,
  })
})

// ─── POST /api/v1/acma/rating ───────────────────────────────────────────────

app.post('/rating', async (c) => {
  const { sugestao_id, rating } = await c.req.json()

  if (!sugestao_id || !rating || rating < 1 || rating > 5) {
    return c.json({ error: 'sugestao_id e rating (1-5) obrigatórios' }, 400)
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/acma_sugestoes?id=eq.${sugestao_id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ rating }),
    },
  )

  if (!response.ok) {
    return c.json({ error: 'Falha ao atualizar rating' }, 500)
  }

  return c.json({ sucesso: true })
})

// ─── GET /api/v1/acma/performance ───────────────────────────────────────────

app.get('/performance', async (c) => {
  const documentoTipo = c.req.query('documento_tipo')
  const semanas = parseInt(c.req.query('semanas') || '8')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  // Buscar performance da view
  let performanceUrl = `${c.env.SUPABASE_URL}/rest/v1/v_acma_performance?order=semana.desc&limit=${semanas * 10}`
  if (documentoTipo) {
    performanceUrl += `&documento_tipo=eq.${documentoTipo}`
  }

  // Buscar padrões ativos
  let padroesUrl = `${c.env.SUPABASE_URL}/rest/v1/acma_padroes_edicao?ativo=eq.true&order=frequencia.desc&limit=20`
  if (documentoTipo) {
    padroesUrl += `&documento_tipo=eq.${documentoTipo}`
  }

  const [performanceRes, padroesRes] = await Promise.all([
    fetch(performanceUrl, { headers }),
    fetch(padroesUrl, { headers }),
  ])

  const performance = performanceRes.ok ? await performanceRes.json() : []
  const padroes = padroesRes.ok ? await padroesRes.json() : []

  // Part 19: padroes retornados SEM prompt_template
  return c.json({ performance, padroes })
})

export default app
