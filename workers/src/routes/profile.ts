/**
 * ATA360 — Workers Routes: User Profile
 *
 * Endpoints:
 * - GET  /api/v1/profile          — perfil sanitizado (Part 19 safe)
 * - PATCH /api/v1/profile         — atualizar preferencias explícitas
 * - POST /api/v1/profile/learn    — trigger aprendizado a partir de textos
 *
 * Part 19: perfil completo (com scores, taxas) NUNCA exposto ao frontend.
 *
 * @see Spec v8 Part 19 — Seguranca
 */
import { Hono } from 'hono'
import { loadUserProfile, updateUserProfile } from '../profile/learner'

interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
  KV?: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

// ─── GET /api/v1/profile ────────────────────────────────────────────────────

app.get('/', async (c) => {
  const userId = c.req.header('X-User-Id')
  if (!userId) {
    return c.json({ error: 'User ID obrigatório' }, 401)
  }

  const profile = await loadUserProfile(
    userId,
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_KEY,
  )

  if (!profile) {
    return c.json({
      segmento_principal: null,
      segmentos_secundarios: [],
      termos_frequentes: [],
      preferencias_terminologia: {},
      regiao_uf: null,
      temas_recorrentes: [],
      documentos_mais_gerados: [],
    })
  }

  return c.json(profile)
})

// ─── PATCH /api/v1/profile ──────────────────────────────────────────────────

app.patch('/', async (c) => {
  const userId = c.req.header('X-User-Id')
  if (!userId) {
    return c.json({ error: 'User ID obrigatório' }, 401)
  }

  const body = await c.req.json()
  const {
    segmento_principal,
    preferencias_terminologia,
    regiao_uf,
  } = body

  // Apenas campos permitidos ao usuario
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (segmento_principal !== undefined) {
    const validSegmentos = [
      'SAUDE', 'TI', 'EDUCACAO', 'OBRAS', 'VEICULOS',
      'ALIMENTOS', 'LIMPEZA', 'ESCRITORIO', 'EPI', 'SERVICOS',
    ]
    if (segmento_principal && !validSegmentos.includes(segmento_principal)) {
      return c.json({ error: `Segmento inválido. Válidos: ${validSegmentos.join(', ')}` }, 400)
    }
    updateData.segmento_principal = segmento_principal
  }

  if (preferencias_terminologia !== undefined) {
    if (typeof preferencias_terminologia !== 'object') {
      return c.json({ error: 'preferencias_terminologia deve ser um objeto' }, 400)
    }
    updateData.preferencias_terminologia = preferencias_terminologia
  }

  if (regiao_uf !== undefined) {
    const ufs = [
      'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
      'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
      'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
    ]
    if (regiao_uf && !ufs.includes(regiao_uf)) {
      return c.json({ error: 'UF inválida' }, 400)
    }
    updateData.regiao_uf = regiao_uf
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  // Verificar se perfil existe
  const existingResponse = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/perfil_usuario?usuario_id=eq.${userId}&select=id`,
    { headers },
  )

  if (existingResponse.ok) {
    const rows = await existingResponse.json() as Array<{ id: string }>
    if (rows.length > 0) {
      // Update
      await fetch(
        `${c.env.SUPABASE_URL}/rest/v1/perfil_usuario?usuario_id=eq.${userId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updateData),
        },
      )
    } else {
      // Create com orgao_id do header
      const orgaoId = c.req.header('X-Orgao-Id') || '00000000-0000-0000-0000-000000000000'
      await fetch(
        `${c.env.SUPABASE_URL}/rest/v1/perfil_usuario`,
        {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({
            usuario_id: userId,
            orgao_id: orgaoId,
            ...updateData,
          }),
        },
      )
    }
  }

  return c.json({ sucesso: true })
})

// ─── POST /api/v1/profile/learn ─────────────────────────────────────────────

app.post('/learn', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')
  if (!userId || !orgaoId) {
    return c.json({ error: 'User ID e Orgão ID obrigatórios' }, 401)
  }

  const { textos } = await c.req.json()
  if (!textos || !Array.isArray(textos) || textos.length === 0) {
    return c.json({ error: 'textos (array de strings) obrigatório' }, 400)
  }

  const result = await updateUserProfile(
    userId,
    orgaoId,
    textos,
    {
      SUPABASE_URL: c.env.SUPABASE_URL,
      SUPABASE_SERVICE_KEY: c.env.SUPABASE_SERVICE_KEY,
      KV: c.env.KV,
    },
  )

  return c.json(result)
})

export default app
