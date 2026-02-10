/**
 * ATA360 — Route: POST /api/v1/normalize
 *
 * Endpoint Workers para normalização de texto de licitação.
 * Recebe texto bruto e retorna texto normalizado + CATMAT sugeridos + alertas.
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 * @see Hono — Cloudflare Workers framework
 */

import { Hono } from 'hono'
import { executePipeline } from '../normalization/pipeline'
import type { NormalizationEnv, NormalizeRequest } from '../normalization/types'

// ─── Types ─────────────────────────────────────────────────────────────────

interface WorkerEnv {
  D1_NORMALIZACAO: D1Database
  KV_CACHE: KVNamespace
  VECTORIZE_CATMAT?: VectorizeIndex
  AI_GATEWAY?: Fetcher
}

// ─── Route ─────────────────────────────────────────────────────────────────

const normalize = new Hono<{ Bindings: WorkerEnv }>()

/**
 * POST /api/v1/normalize
 *
 * Body: {
 *   texto: string           — texto a normalizar (obrigatório, min 2 chars)
 *   setor_orgao?: string    — setor do órgão para desambiguação (SAUDE, TI, etc.)
 *   regiao_uf?: string      — UF para resolução de regionalismos (SP, PA, etc.)
 *   incluir_catmat?: boolean — buscar códigos CATMAT/CATSER (default: true)
 *   incluir_precos?: boolean — buscar preços PNCP (futuro, default: false)
 * }
 *
 * Response: NormalizeResponse
 */
normalize.post('/', async (c) => {
  // 1. Parse e validação do body
  let body: Record<string, unknown>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ message: 'Body JSON inválido' }, 400)
  }

  const texto = typeof body.texto === 'string' ? body.texto.trim() : ''
  if (!texto || texto.length < 2) {
    return c.json({ message: 'Campo "texto" é obrigatório (mínimo 2 caracteres)' }, 400)
  }

  if (texto.length > 5000) {
    return c.json({ message: 'Campo "texto" excede 5000 caracteres' }, 400)
  }

  const setor_orgao = typeof body.setor_orgao === 'string' ? body.setor_orgao.toUpperCase() : undefined
  const regiao_uf = typeof body.regiao_uf === 'string' ? body.regiao_uf.toUpperCase() : undefined
  const incluir_catmat = body.incluir_catmat !== false // default true
  const incluir_precos = body.incluir_precos === true // default false (futuro)

  // Validar setor_orgao se fornecido
  const SETORES_VALIDOS = new Set([
    'SAUDE', 'TI', 'EDUCACAO', 'OBRAS', 'ESCRITORIO',
    'VEICULOS', 'LIMPEZA', 'EPI', 'ALIMENTOS', 'MEDICAMENTOS',
    'SERVICOS', 'COMBUSTIVEL', 'ENERGIA', 'GERAL',
  ])

  if (setor_orgao && !SETORES_VALIDOS.has(setor_orgao)) {
    return c.json({
      message: `Setor "${setor_orgao}" inválido. Válidos: ${Array.from(SETORES_VALIDOS).join(', ')}`,
    }, 400)
  }

  // Validar UF se fornecida
  const UFS_VALIDAS = new Set([
    'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
    'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
  ])

  if (regiao_uf && !UFS_VALIDAS.has(regiao_uf)) {
    return c.json({ message: `UF "${regiao_uf}" inválida` }, 400)
  }

  // 2. Montar request e env
  const request: NormalizeRequest = {
    texto,
    setor_orgao,
    regiao_uf,
    incluir_catmat,
    incluir_precos,
  }

  const env: NormalizationEnv = {
    D1_NORMALIZACAO: c.env.D1_NORMALIZACAO,
    KV_CACHE: c.env.KV_CACHE,
    VECTORIZE_CATMAT: c.env.VECTORIZE_CATMAT,
    AI_GATEWAY: c.env.AI_GATEWAY,
  }

  // 3. Executar pipeline
  try {
    const response = await executePipeline(request, env)

    // Headers de cache para CDN (Cloudflare edge)
    c.header('Cache-Control', 'public, max-age=3600') // 1h edge cache
    c.header('X-Pipeline-Duration-Ms', String(response.duracao_ms))
    c.header('X-Cache-Hit', String(response.cache_hit))

    return c.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno na normalização'
    return c.json({ message, code: 'NORMALIZATION_ERROR' }, 500)
  }
})

/**
 * GET /api/v1/normalize/health
 * Health check para o serviço de normalização.
 */
normalize.get('/health', async (c) => {
  try {
    // Verificar D1 está acessível
    const result = await c.env.D1_NORMALIZACAO
      .prepare('SELECT COUNT(*) as total FROM termos_normalizados')
      .first<{ total: number }>()

    return c.json({
      status: 'ok',
      d1_termos: result?.total ?? 0,
      vectorize: !!c.env.VECTORIZE_CATMAT,
      ai_gateway: !!c.env.AI_GATEWAY,
    })
  } catch {
    return c.json({ status: 'degraded', message: 'D1 inacessível' }, 503)
  }
})

export default normalize
