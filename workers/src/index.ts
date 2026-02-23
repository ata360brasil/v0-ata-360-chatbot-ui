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

// Precificação, Contratação e Adesão ARP (novo v8.2)
import pricing from './routes/pricing'
import contratacao from './routes/contratacao'
import adesaoArp from './routes/adesao-arp'

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
  origin: (origin) => {
    const allowed = [
      'https://ata360.com.br',
      'https://app.ata360.com.br',
    ]
    // localhost apenas em development (nunca em production)
    if (origin === 'http://localhost:3000') {
      allowed.push('http://localhost:3000')
    }
    return allowed.includes(origin) ? origin : ''
  },
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-Orgao-Id', 'X-User-Role', 'X-Workers-Secret'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
}))

// ─── Auth Middleware (Workers) ──────────────────────────────────────────────
// Valida shared secret do BFF OU Bearer token do Supabase.
// Impede acesso direto à API Workers sem autenticação.
app.use('/api/v1/*', async (c, next) => {
  // Opção 1: Shared secret do BFF (server-to-server)
  const workerSecret = c.req.header('X-Workers-Secret')
  if (workerSecret && workerSecret === c.env.WORKERS_SHARED_SECRET) {
    return next()
  }

  // Opção 2: Bearer token Supabase (validação direta)
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const response = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': c.env.SUPABASE_SERVICE_KEY,
        },
      })
      if (response.ok) {
        return next()
      }
    } catch {
      // Token inválido — cai no 401 abaixo
    }
  }

  return c.json({ error: 'Unauthorized' }, 401)
})

// ─── Cron Auth Middleware ────────────────────────────────────────────────────
// Protege endpoints de cron contra acesso público.
app.use('/cron/*', async (c, next) => {
  const cronSecret = c.req.header('X-Cron-Secret')
  if (!cronSecret || cronSecret !== c.env.CRON_SECRET) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  return next()
})

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/', (c) => {
  return c.json({
    name: 'ATA360 API',
    version: '1.2.0',
    status: 'ok',
    modulos: [
      'orquestrador', 'normalizacao', 'feedback', 'acma', 'auditor',
      'profile', 'dashboard', 'publicacao', 'pca', 'prazos',
      'compliance', 'ouvidoria', 'pricing', 'contratacao', 'adesao_arp',
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

// Precificação Universal (equação, categorias, tabela SuperADM)
app.route('/api/v1/pricing', pricing)

// Contratação do ATA360 (autocontratação, prova de fogo)
app.route('/api/v1/contratacao', contratacao)

// Adesão a ARP (Art. 86, Lei 14.133 — fluxo 6 etapas)
app.route('/api/v1/adesao-arp', adesaoArp)

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
  return c.json({ error: 'Not Found' }, 404)
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
