/**
 * ATA360 — Workers Routes: Dashboard Metrics
 *
 * Endpoint unificado para SuperADM dashboard.
 * Agrega metricas de TODOS os subsistemas:
 * - Normalização: cache hit rate, termos propagados
 * - ACMA: taxa aprovação, edit ratio, padrões detectados
 * - AUDITOR: conformidade, calibrações, scores
 * - Avaliações: NPS, fornecedores, agentes, artefatos
 * - Perfil: segmentos ativos, termos populares
 *
 * Part 19: dados internos (prompts, pesos, thresholds) NUNCA retornados.
 *
 * @see Spec v8 Part 19 — Seguranca
 */
import { Hono } from 'hono'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

const app = new Hono<{ Bindings: Env }>()

// ─── GET /api/v1/dashboard/metrics ──────────────────────────────────────────

app.get('/metrics', async (c) => {
  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const baseUrl = c.env.SUPABASE_URL

  // Buscar todas as metricas em paralelo
  const [
    npsRes,
    fornecedoresRes,
    agentesRes,
    artefatosRes,
    acmaRes,
    auditorRes,
    feedbackRes,
    perfisRes,
    comentariosRes,
  ] = await Promise.all([
    // NPS Score mensal
    fetch(`${baseUrl}/rest/v1/v_nps_score?order=mes.desc&limit=12`, { headers }),
    // Ranking fornecedores
    fetch(`${baseUrl}/rest/v1/v_ranking_fornecedores?order=nota_media.desc&limit=20`, { headers }),
    // Qualidade agentes por semana
    fetch(`${baseUrl}/rest/v1/v_qualidade_agentes?order=semana.desc&limit=50`, { headers }),
    // Qualidade artefatos por mes
    fetch(`${baseUrl}/rest/v1/v_qualidade_artefatos?order=mes.desc&limit=30`, { headers }),
    // ACMA performance
    fetch(`${baseUrl}/rest/v1/v_acma_performance?order=semana.desc&limit=40`, { headers }),
    // AUDITOR conformidade
    fetch(`${baseUrl}/rest/v1/v_auditor_conformidade?order=mes.desc&limit=30`, { headers }),
    // Feedback stats
    fetch(`${baseUrl}/rest/v1/feedback_termos?select=status&limit=1000`, { headers }),
    // Perfis ativos (contagem por segmento)
    fetch(`${baseUrl}/rest/v1/perfil_usuario?select=segmento_principal&segmento_principal=not.is.null`, { headers }),
    // Comentarios recentes da plataforma
    fetch(`${baseUrl}/rest/v1/avaliacao_plataforma?select=nps_score,nota_geral,comentario,created_at&order=created_at.desc&limit=10&comentario=not.is.null`, { headers }),
  ])

  // Parse resultados
  const nps = npsRes.ok ? await npsRes.json() : []
  const fornecedores = fornecedoresRes.ok ? await fornecedoresRes.json() : []
  const agentes = agentesRes.ok ? await agentesRes.json() : []
  const artefatos = artefatosRes.ok ? await artefatosRes.json() : []
  const acmaPerformance = acmaRes.ok ? await acmaRes.json() : []
  const auditorConformidade = auditorRes.ok ? await auditorRes.json() : []
  const feedbackRows = feedbackRes.ok ? await feedbackRes.json() as Array<{ status: string }> : []
  const perfisRows = perfisRes.ok ? await perfisRes.json() as Array<{ segmento_principal: string }> : []
  const comentarios = comentariosRes.ok ? await comentariosRes.json() : []

  // Calcular metricas de feedback
  const feedbackStats = {
    total: feedbackRows.length,
    pendentes: feedbackRows.filter(f => f.status === 'pendente').length,
    validados: feedbackRows.filter(f => f.status === 'validado').length,
    propagados: feedbackRows.filter(f => f.status === 'propagado').length,
  }

  // Calcular distribuição de segmentos
  const segmentoContagem = new Map<string, number>()
  for (const p of perfisRows) {
    const seg = p.segmento_principal
    segmentoContagem.set(seg, (segmentoContagem.get(seg) || 0) + 1)
  }
  const segmentos = [...segmentoContagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([segmento, total]) => ({ segmento, total }))

  // KPIs resumidos
  const kpis = calcularKPIs(
    nps as Array<{ nps: number; total: number }>,
    acmaPerformance as Array<{ taxa_aprovacao: number; total_sugestoes: number }>,
    auditorConformidade as Array<{ taxa_conformidade: number; total_auditorias: number }>,
    feedbackStats,
  )

  return c.json({
    kpis,
    nps,
    fornecedores,
    agentes,
    artefatos,
    acma_performance: acmaPerformance,
    auditor_conformidade: auditorConformidade,
    feedback: feedbackStats,
    segmentos,
    comentarios,
  })
})

// ─── GET /api/v1/dashboard/summary ──────────────────────────────────────────

app.get('/summary', async (c) => {
  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  // Contagens rápidas para cards overview
  const [processosRes, documentosRes, usuariosRes, orgaosRes] = await Promise.all([
    fetch(`${c.env.SUPABASE_URL}/rest/v1/processos?select=id&limit=1`, {
      headers: { ...headers, 'Prefer': 'count=exact' },
    }),
    fetch(`${c.env.SUPABASE_URL}/rest/v1/documentos?select=id&limit=1`, {
      headers: { ...headers, 'Prefer': 'count=exact' },
    }),
    fetch(`${c.env.SUPABASE_URL}/rest/v1/usuarios?select=id&limit=1`, {
      headers: { ...headers, 'Prefer': 'count=exact' },
    }),
    fetch(`${c.env.SUPABASE_URL}/rest/v1/orgaos?select=id&limit=1`, {
      headers: { ...headers, 'Prefer': 'count=exact' },
    }),
  ])

  // Extrair contagens do header content-range
  const extractCount = (res: Response): number => {
    const range = res.headers.get('content-range')
    if (!range) return 0
    const match = range.match(/\/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  return c.json({
    total_processos: extractCount(processosRes),
    total_documentos: extractCount(documentosRes),
    total_usuarios: extractCount(usuariosRes),
    total_orgaos: extractCount(orgaosRes),
  })
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function calcularKPIs(
  nps: Array<{ nps: number; total: number }>,
  acma: Array<{ taxa_aprovacao: number; total_sugestoes: number }>,
  auditor: Array<{ taxa_conformidade: number; total_auditorias: number }>,
  feedback: { total: number; propagados: number },
) {
  // NPS atual (ultimo mes)
  const npsAtual = nps[0]?.nps ?? 0

  // ACMA taxa aprovação media (ultimas 4 semanas)
  const acmaRecentes = acma.slice(0, 20) // ~4 semanas de dados
  const acmaTaxa = acmaRecentes.length > 0
    ? acmaRecentes.reduce((sum, a) => sum + a.taxa_aprovacao, 0) / acmaRecentes.length
    : 0

  const acmaTotal = acmaRecentes.reduce((sum, a) => sum + a.total_sugestoes, 0)

  // AUDITOR conformidade media (ultimos 3 meses)
  const auditorRecentes = auditor.slice(0, 15)
  const auditorTaxa = auditorRecentes.length > 0
    ? auditorRecentes.reduce((sum, a) => sum + a.taxa_conformidade, 0) / auditorRecentes.length
    : 0

  const auditorTotal = auditorRecentes.reduce((sum, a) => sum + a.total_auditorias, 0)

  return {
    nps_score: Math.round(npsAtual),
    acma_taxa_aprovacao: Math.round(acmaTaxa),
    acma_total_sugestoes: acmaTotal,
    auditor_taxa_conformidade: Math.round(auditorTaxa),
    auditor_total_auditorias: auditorTotal,
    feedback_total: feedback.total,
    feedback_propagados: feedback.propagados,
  }
}

export default app
