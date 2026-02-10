/**
 * ATA360 — Workers Routes: AUDITOR Learning
 *
 * Endpoints:
 * - POST /api/v1/auditor/resultado     — registra resultado de auditoria
 * - GET  /api/v1/auditor/conformidade   — metricas de conformidade
 *
 * Part 19: thresholds, pesos, scores nunca expostos ao frontend.
 *
 * @see Spec v8 Part 07 — AUDITOR Agent
 */
import { Hono } from 'hono'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

// ─── POST /api/v1/auditor/resultado ─────────────────────────────────────────

app.post('/resultado', async (c) => {
  const body = await c.req.json()
  const {
    orgao_id, processo_id, documento_tipo,
    veredicto, score, checklist, selo_aprovado,
    decisao_usuario, setor, iteracao,
  } = body

  if (!processo_id || !documento_tipo || !veredicto || score == null || !checklist) {
    return c.json({
      error: 'Campos obrigatórios: processo_id, documento_tipo, veredicto, score, checklist',
    }, 400)
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  const insertData = {
    orgao_id: orgao_id || '00000000-0000-0000-0000-000000000000',
    processo_id,
    documento_tipo,
    veredicto,
    score,
    checklist,
    selo_aprovado: selo_aprovado ?? false,
    decisao_usuario: decisao_usuario || null,
    setor: setor || null,
    iteracao: iteracao || 1,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/auditor_resultados`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(insertData),
    },
  )

  if (!response.ok) {
    const err = await response.text()
    return c.json({ error: 'Falha ao registrar resultado', details: err }, 500)
  }

  const [resultado] = await response.json() as Array<{ id: string }>

  // Registrar no audit_trail
  await fetch(`${c.env.SUPABASE_URL}/rest/v1/audit_trail`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      orgao_id: insertData.orgao_id,
      processo_id,
      acao: 'AUDITOR_RESULTADO',
      agente: 'auditor',
      hash: crypto.randomUUID(),
      detalhes: {
        resultado_id: resultado.id,
        veredicto,
        score,
        selo_aprovado: insertData.selo_aprovado,
        decisao_usuario: insertData.decisao_usuario,
        total_checks: checklist.length,
        nao_conformes: checklist.filter((c: { conforme: boolean }) => !c.conforme).length,
      },
      criado_por: '00000000-0000-0000-0000-000000000000',
    }),
  }).catch(() => { /* best effort audit trail */ })

  return c.json({
    sucesso: true,
    resultado_id: resultado.id,
  })
})

// ─── GET /api/v1/auditor/conformidade ───────────────────────────────────────

app.get('/conformidade', async (c) => {
  const documentoTipo = c.req.query('documento_tipo')
  const meses = parseInt(c.req.query('meses') || '6')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  let url = `${c.env.SUPABASE_URL}/rest/v1/v_auditor_conformidade?order=mes.desc&limit=${meses * 10}`
  if (documentoTipo) {
    url += `&documento_tipo=eq.${documentoTipo}`
  }

  const response = await fetch(url, { headers })
  const conformidade = response.ok ? await response.json() : []

  // Part 19: NUNCA retornar thresholds, pesos ou detalhes de calibração ao frontend
  return c.json({ conformidade })
})

export default app
