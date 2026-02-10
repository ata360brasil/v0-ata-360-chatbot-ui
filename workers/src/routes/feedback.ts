/**
 * ATA360 — Route: Feedback de Normalização
 *
 * POST /api/v1/feedback/termo — Registra feedback de normalização
 * GET  /api/v1/feedback/stats — Estatísticas de feedback do órgão
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 */

import { Hono } from 'hono'

// ─── Types ─────────────────────────────────────────────────────────────────

interface WorkerEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

interface FeedbackBody {
  processo_id?: string
  termo_original: string
  termo_normalizado_sistema: string
  catmat_sugerido_sistema?: string
  termo_corrigido_usuario?: string
  catmat_corrigido_usuario?: string
  tipo_feedback: string
  setor?: string
  regiao_uf?: string
  confianca_original?: number
}

// ─── Route ─────────────────────────────────────────────────────────────────

const feedback = new Hono<{ Bindings: WorkerEnv }>()

/**
 * POST /api/v1/feedback/termo
 * Registra correção/aprovação/rejeição de normalização.
 */
feedback.post('/termo', async (c) => {
  // Auth headers (forwarded pelo BFF)
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')

  if (!userId || !orgaoId) {
    return c.json({ message: 'Headers de autenticação ausentes' }, 401)
  }

  // Parse body
  let body: FeedbackBody
  try {
    body = await c.req.json()
  } catch {
    return c.json({ message: 'Body JSON inválido' }, 400)
  }

  // Validação
  const TIPOS_VALIDOS = new Set(['correcao_termo', 'correcao_catmat', 'aprovacao', 'rejeicao'])
  if (!body.termo_original || !body.termo_normalizado_sistema) {
    return c.json({ message: 'termo_original e termo_normalizado_sistema são obrigatórios' }, 400)
  }
  if (!body.tipo_feedback || !TIPOS_VALIDOS.has(body.tipo_feedback)) {
    return c.json({ message: `tipo_feedback inválido. Válidos: ${Array.from(TIPOS_VALIDOS).join(', ')}` }, 400)
  }

  // Correção precisa de pelo menos um campo corrigido
  if (body.tipo_feedback.startsWith('correcao_') && !body.termo_corrigido_usuario && !body.catmat_corrigido_usuario) {
    return c.json({ message: 'Correção requer termo_corrigido_usuario ou catmat_corrigido_usuario' }, 400)
  }

  // Inserir no Supabase via REST API
  try {
    const supabaseResponse = await fetch(`${c.env.SUPABASE_URL}/rest/v1/feedback_termos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        orgao_id: orgaoId,
        usuario_id: userId,
        processo_id: body.processo_id || null,
        termo_original: body.termo_original.toLowerCase().trim(),
        termo_normalizado_sistema: body.termo_normalizado_sistema,
        catmat_sugerido_sistema: body.catmat_sugerido_sistema || null,
        termo_corrigido_usuario: body.termo_corrigido_usuario?.trim() || null,
        catmat_corrigido_usuario: body.catmat_corrigido_usuario?.trim() || null,
        tipo_feedback: body.tipo_feedback,
        setor: body.setor || null,
        regiao_uf: body.regiao_uf || null,
        status: 'pendente',
        confianca_original: body.confianca_original || null,
      }),
    })

    if (!supabaseResponse.ok) {
      const error = await supabaseResponse.text()
      return c.json({ message: 'Erro ao salvar feedback', details: error }, 500)
    }

    const data = await supabaseResponse.json()
    return c.json({ sucesso: true, feedback: data }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return c.json({ message, code: 'FEEDBACK_ERROR' }, 500)
  }
})

/**
 * GET /api/v1/feedback/stats
 * Estatísticas de feedback do órgão.
 */
feedback.get('/stats', async (c) => {
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!orgaoId) {
    return c.json({ message: 'X-Orgao-Id ausente' }, 401)
  }

  try {
    // Buscar contagens por status
    const statsResponse = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/rpc/feedback_stats`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': c.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ p_orgao_id: orgaoId }),
      },
    )

    if (!statsResponse.ok) {
      // Fallback: consulta direta se RPC não existe
      const countResponse = await fetch(
        `${c.env.SUPABASE_URL}/rest/v1/feedback_termos?orgao_id=eq.${orgaoId}&select=status`,
        {
          headers: {
            'apikey': c.env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
          },
        },
      )

      if (!countResponse.ok) {
        return c.json({ message: 'Erro ao buscar estatísticas' }, 500)
      }

      const feedbacks = await countResponse.json() as Array<{ status: string }>
      const counts = {
        total: feedbacks.length,
        pendentes: feedbacks.filter(f => f.status === 'pendente').length,
        validados: feedbacks.filter(f => f.status === 'validado').length,
        propagados: feedbacks.filter(f => f.status === 'propagado').length,
        rejeitados: feedbacks.filter(f => f.status === 'rejeitado').length,
        top_correcoes: [],
      }

      return c.json(counts)
    }

    const stats = await statsResponse.json()
    return c.json(stats)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return c.json({ message, code: 'STATS_ERROR' }, 500)
  }
})

export default feedback
