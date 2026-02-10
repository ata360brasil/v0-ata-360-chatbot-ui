/**
 * ATA360 — Cloudflare Workers Entry Point
 *
 * Monta todos os sub-apps Hono e exporta como Worker.
 * Todas as rotas em /api/v1/* são handlers para os BFF proxies do Next.js.
 *
 * Architecture:
 *   Frontend → Next.js API Routes (BFF) → Este Worker → Supabase/D1/R2/KV/AI
 *
 * @see Spec v8 Part 20.9 — API do Orquestrador
 * @see DOCUMENTACAO.md — Documentação completa
 * @see Hono v4 — lightweight framework for Cloudflare Workers
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Env } from './orchestrator/types'

// ─── Route Imports ───────────────────────────────────────────────────────────

// Core
import processo from './routes/processo'
import normalize from './routes/normalize'
import feedback from './routes/feedback'

// Learning
import acmaLearning from './routes/acma-learning'
import auditorLearning from './routes/auditor-learning'
import profile from './routes/profile'

// Dashboard & Publication
import dashboard from './routes/dashboard'
import publication from './routes/publication'

// PCA Inteligente (novo v8.1)
import pca from './routes/pca'

// Prazos e Alertas (novo v8.1)
import prazos from './routes/prazos'

// Compliance e Integridade (novo v8.1)
import compliance from './routes/compliance'

// Ouvidoria e Canal de Denúncias (novo v8.1)
import ouvidoria from './routes/ouvidoria'

// ─── Cron Imports ────────────────────────────────────────────────────────────

import { propagateFeedback } from './cron/propagate-feedback'
import { improvePrompts } from './cron/improve-prompts'
import { calibrateThresholds } from './auditor/calibration'
import { verificarPrazos } from './prazos/controller'

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://ata360.com.br',
    'https://*.ata360.com.br',
  ],
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-Orgao-Id', 'X-User-Role'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
}))

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/', (c) => {
  return c.json({
    name: 'ATA360 API',
    version: '1.1.0',
    status: 'ok',
    modulos: [
      'orquestrador', 'normalizacao', 'feedback', 'acma', 'auditor',
      'profile', 'dashboard', 'publicacao', 'pca', 'prazos',
      'compliance', 'ouvidoria',
    ],
    timestamp: new Date().toISOString(),
  })
})

app.get('/health', async (c) => {
  const checks: Record<string, string> = {}

  // Check Supabase
  try {
    const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY },
    })
    checks.supabase = response.ok ? 'ok' : 'error'
  } catch {
    checks.supabase = 'unreachable'
  }

  // Check KV
  try {
    await c.env.CACHE.get('health-check')
    checks.kv = 'ok'
  } catch {
    checks.kv = 'error'
  }

  // Check D1
  try {
    await c.env.DB.prepare('SELECT 1').first()
    checks.d1 = 'ok'
  } catch {
    checks.d1 = 'error'
  }

  // Check R2
  try {
    await c.env.DOCUMENTS.head('health-check')
    checks.r2 = 'ok'
  } catch {
    checks.r2 = 'ok' // head retorna 404 se não existe, mas R2 está ok
  }

  const allOk = Object.values(checks).every(v => v === 'ok')

  return c.json({
    status: allOk ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  })
})

// ─── API Routes ──────────────────────────────────────────────────────────────

// Processo (Orquestrador) — rota principal
app.route('/api/v1/processo', processo)

// Normalização (6 camadas)
app.route('/api/v1/normalize', normalize)

// Feedback de termos
app.route('/api/v1/feedback', feedback)

// ACMA Learning (sugestões, rating, performance)
app.route('/api/v1/acma', acmaLearning)

// AUDITOR Learning (resultados, conformidade)
app.route('/api/v1/auditor', auditorLearning)

// Perfil de Usuário (learning, preferências)
app.route('/api/v1/profile', profile)

// Dashboard Métricas (superadm/suporte)
app.route('/api/v1/dashboard', dashboard)

// Publicação (assinatura + carimbo + PNCP)
app.route('/api/v1/publicacao', publication)

// PCA Inteligente (sugestão automática, conciliação, PCA vivo)
app.route('/api/v1/pca', pca)

// Prazos e Alertas (controle de prazos em tempo real)
app.route('/api/v1/prazos', prazos)

// Compliance e Integridade (CGU, ESG, ODS, certificações)
app.route('/api/v1/compliance', compliance)

// Ouvidoria e Canal de Denúncias (CGU Empresa Ética)
app.route('/api/v1/ouvidoria', ouvidoria)

// ─── Cron Triggers ───────────────────────────────────────────────────────────
// Chamados pelo Cloudflare Cron Triggers (wrangler.toml)

app.get('/cron/propagate-feedback', async (c) => {
  try {
    const result = await propagateFeedback(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_KEY,
    )
    return c.json({ sucesso: true, resultado: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ sucesso: false, erro: msg }, 500)
  }
})

app.get('/cron/improve-prompts', async (c) => {
  try {
    const result = await improvePrompts(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_KEY,
      c.env.AI,
    )
    return c.json({ sucesso: true, resultado: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ sucesso: false, erro: msg }, 500)
  }
})

app.get('/cron/calibrate-auditor', async (c) => {
  try {
    const result = await calibrateThresholds(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_KEY,
    )
    return c.json({ sucesso: true, resultado: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ sucesso: false, erro: msg }, 500)
  }
})

app.get('/cron/check-deadlines', async (c) => {
  try {
    const result = await verificarPrazos(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_KEY,
    )
    return c.json({ sucesso: true, resultado: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ sucesso: false, erro: msg }, 500)
  }
})

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: `Route ${c.req.method} ${c.req.url} not found`,
    available_routes: [
      'GET  /',
      'GET  /health',
      // Processo
      'POST /api/v1/processo',
      'GET  /api/v1/processo/:id/status',
      'POST /api/v1/processo/:id/chat',
      'POST /api/v1/processo/:id/decisao',
      'GET  /api/v1/processo/:id/insights',
      'GET  /api/v1/processo/:id/trilha',
      // Normalização
      'POST /api/v1/normalize',
      'POST /api/v1/feedback',
      // Learning
      'POST /api/v1/acma/sugestao',
      'POST /api/v1/auditor/resultado',
      'GET  /api/v1/profile',
      // Dashboard
      'GET  /api/v1/dashboard/metrics',
      'POST /api/v1/publicacao/:id/publicar',
      // PCA
      'GET  /api/v1/pca/:orgaoId/:exercicio',
      'POST /api/v1/pca/sugerir',
      'POST /api/v1/pca/conciliar',
      'POST /api/v1/pca/vincular',
      // Prazos
      'GET  /api/v1/prazos/:orgaoId',
      'GET  /api/v1/prazos/:orgaoId/alertas',
      'POST /api/v1/prazos',
      'POST /api/v1/prazos/processo',
      // Compliance
      'GET  /api/v1/compliance/:orgaoId',
      'POST /api/v1/compliance/avaliar',
      'GET  /api/v1/compliance/:orgaoId/riscos',
      'POST /api/v1/compliance/riscos/padrao',
      'GET  /api/v1/compliance/ods',
      // Ouvidoria
      'POST /api/v1/ouvidoria',
      'GET  /api/v1/ouvidoria/protocolo/:protocolo',
      'GET  /api/v1/ouvidoria/:orgaoId',
      'PATCH /api/v1/ouvidoria/:id/responder',
      'GET  /api/v1/ouvidoria/estatisticas/:orgaoId',
    ],
  }, 404)
})

// ─── Error Handler ───────────────────────────────────────────────────────────

app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({
    error: 'Internal Server Error',
    message: 'Erro interno',
  }, 500)
})

// ─── Export ──────────────────────────────────────────────────────────────────

export default {
  fetch: app.fetch,

  // Cloudflare Cron Triggers
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    switch (event.cron) {
      // A cada hora: verificar prazos e disparar alertas
      case '0 * * * *':
        ctx.waitUntil(
          verificarPrazos(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
            .then(r => console.log('Prazos verificados:', r))
            .catch(e => console.error('Erro verificação prazos:', e))
        )
        break

      // A cada 6 horas: propagar feedback
      case '0 */6 * * *':
        ctx.waitUntil(
          propagateFeedback(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
            .then(r => console.log('Feedback propagado:', r))
            .catch(e => console.error('Erro propagação:', e))
        )
        break

      // Semanalmente (dom 3h): melhorar prompts ACMA
      case '0 3 * * 0':
        ctx.waitUntil(
          improvePrompts(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, env.AI as Ai)
            .then(r => console.log('Prompts melhorados:', r))
            .catch(e => console.error('Erro melhoria prompts:', e))
        )
        break

      // Mensalmente (dia 1, 4h): calibrar AUDITOR
      case '0 4 1 * *':
        ctx.waitUntil(
          calibrateThresholds(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
            .then(r => console.log('AUDITOR calibrado:', r))
            .catch(e => console.error('Erro calibração:', e))
        )
        break
    }
  },
}
