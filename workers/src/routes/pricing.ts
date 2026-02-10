/**
 * ATA360 — Pricing Routes (Workers)
 *
 * Rotas para simulação de preços, tabela de referência e gestão de parâmetros.
 *
 * GET  /simular — Simular preço para um ente
 * GET  /tabela — Tabela de referência (SuperADM only)
 * GET  /parametros — Parâmetros vigentes
 * POST /parametros — Atualizar parâmetros (SuperADM only)
 * GET  /categorias — Categorias de identificação
 * GET  /modalidades — Modalidades de contratação
 * GET  /fpm — Coeficientes FPM
 * POST /vigencia — Opções de vigência contratual
 *
 * @see workers/src/pricing/engine.ts — Motor de precificação
 * @see Decreto 12.807/2025 — Limite dispensa 2026
 * @see DN TCU 219/2025 — Coeficientes FPM
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import {
  PRICING_PARAMS_2026,
  calcularPreco,
  getCategorias,
  recomendarModalidade,
  calcularVigencia,
  gerarTabelaReferencia,
  COEFICIENTES_FPM_2026,
  MODALIDADES_CONTRATACAO,
  AUTOCONTRATACAO,
  type PricingParams,
  type FonteBase,
  type ModalidadeContratacao,
} from '../pricing/engine'

const app = new Hono<{ Bindings: Env }>()

// ─── GET /simular — Simular preço para um ente ───────────────────────────────

app.get('/simular', async (c) => {
  const base = parseFloat(c.req.query('base') || '0')
  const fonte = (c.req.query('fonte') || 'pncp_contratacoes') as FonteBase
  const arpDisponivel = c.req.query('arp_disponivel') === 'true'
  const emendaDisponivel = c.req.query('emenda_disponivel') === 'true'
  const inovacao = c.req.query('inovacao') === 'true'

  if (base <= 0) {
    return c.json({ message: 'Parâmetro "base" é obrigatório e deve ser > 0' }, 400)
  }

  // Carregar parâmetros vigentes do Supabase ou usar defaults
  let params = PRICING_PARAMS_2026
  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/pricing_parametros?ativo=eq.true&order=vigencia_ano.desc&limit=1`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    if (response.ok) {
      const rows = await response.json() as Array<Record<string, unknown>>
      if (rows.length > 0) {
        const row = rows[0]
        params = {
          piso: Number(row.piso),
          base_min: Number(row.base_min),
          alpha: Number(row.alpha),
          limite_dispensa: Number(row.limite_dispensa),
          vigencia_ano: Number(row.vigencia_ano),
          atualizado_em: String(row.updated_at),
        }
      }
    }
  } catch { /* use defaults */ }

  const calculo = calcularPreco(base, fonte, params)
  const modalidade = recomendarModalidade(calculo.preco_anual, params, {
    arp_disponivel: arpDisponivel,
    emenda_disponivel: emendaDisponivel,
    inovacao,
  })
  const vigenciaOpcoes = calcularVigencia(modalidade.id)

  return c.json({
    calculo,
    modalidade_recomendada: modalidade,
    vigencia_opcoes: vigenciaOpcoes,
    autocontratacao: {
      catser: AUTOCONTRATACAO.catser_principal,
      catser_alternativo: AUTOCONTRATACAO.catser_alternativo,
      descricao_objeto: AUTOCONTRATACAO.descricao_objeto,
      trilha_documentos: AUTOCONTRATACAO.getTrilha(modalidade.id),
    },
  })
})

// ─── GET /tabela — Tabela de referência (SuperADM only) ─────────────────────

app.get('/tabela', async (c) => {
  const role = c.req.header('X-User-Role')
  if (role !== 'superadm') {
    return c.json({ message: 'Acesso restrito ao SuperADM' }, 403)
  }

  const tabela = gerarTabelaReferencia()
  return c.json({
    titulo: 'Tabela Pública de Preços — ATA360',
    vigencia_ano: PRICING_PARAMS_2026.vigencia_ano,
    parametros: PRICING_PARAMS_2026,
    equacao: 'Preço = max(PISO, PISO × (BASE / BASE_MIN) ^ α)',
    tabela,
    total_itens: tabela.length,
    gerado_em: new Date().toISOString(),
    nota: 'Tabela de REFERÊNCIA. Preço final é calculado individualmente com base nos dados reais do ente.',
  })
})

// ─── GET /parametros — Parâmetros vigentes ───────────────────────────────────

app.get('/parametros', async (c) => {
  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/pricing_parametros?ativo=eq.true&order=vigencia_ano.desc&limit=1`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    if (response.ok) {
      const rows = await response.json() as unknown[]
      if (Array.isArray(rows) && rows.length > 0) {
        return c.json({ parametros: rows[0], fonte: 'supabase' })
      }
    }
  } catch { /* fallback */ }

  return c.json({ parametros: PRICING_PARAMS_2026, fonte: 'defaults' })
})

// ─── POST /parametros — Atualizar parâmetros (SuperADM only) ────────────────

app.post('/parametros', async (c) => {
  const role = c.req.header('X-User-Role')
  if (role !== 'superadm') {
    return c.json({ message: 'Acesso restrito ao SuperADM' }, 403)
  }

  const userId = c.req.header('X-User-Id')
  const body = await c.req.json() as Partial<PricingParams>

  const { piso, base_min, alpha, limite_dispensa, vigencia_ano } = body

  if (!vigencia_ano) {
    return c.json({ message: 'vigencia_ano é obrigatório' }, 400)
  }

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/pricing_parametros`,
      {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          vigencia_ano,
          piso: piso ?? PRICING_PARAMS_2026.piso,
          base_min: base_min ?? PRICING_PARAMS_2026.base_min,
          alpha: alpha ?? PRICING_PARAMS_2026.alpha,
          limite_dispensa: limite_dispensa ?? PRICING_PARAMS_2026.limite_dispensa,
          ativo: true,
          criado_por: userId,
          updated_at: new Date().toISOString(),
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return c.json({ message: 'Erro ao salvar parâmetros', detalhes: err }, 500)
    }

    return c.json({ sucesso: true, mensagem: `Parâmetros ${vigencia_ano} atualizados com sucesso` })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── GET /categorias — 5 categorias de identificação ─────────────────────────

app.get('/categorias', (c) => {
  return c.json({
    categorias: getCategorias(PRICING_PARAMS_2026),
    nota: 'Categorias são APENAS para identificação visual e agrupamento. Preço é calculado individualmente.',
  })
})

// ─── GET /modalidades — Modalidades de contratação ───────────────────────────

app.get('/modalidades', (c) => {
  return c.json({ modalidades: MODALIDADES_CONTRATACAO })
})

// ─── GET /fpm — Coeficientes FPM ─────────────────────────────────────────────

app.get('/fpm', (c) => {
  return c.json({
    fonte: 'DN TCU 219/2025 — Coeficientes FPM 2026',
    decreto_lei: 'DL 1.881/1981',
    faixas: COEFICIENTES_FPM_2026,
    total_faixas: COEFICIENTES_FPM_2026.length,
  })
})

// ─── POST /vigencia — Opções de vigência contratual ──────────────────────────

app.post('/vigencia', async (c) => {
  const body = await c.req.json() as { modalidade: ModalidadeContratacao }
  const { modalidade } = body

  if (!modalidade) {
    return c.json({ message: 'modalidade é obrigatório' }, 400)
  }

  return c.json({
    modalidade,
    opcoes: calcularVigencia(modalidade),
  })
})

// ─── POST /simular-lote — Simular preço para múltiplos entes ─────────────────

app.post('/simular-lote', async (c) => {
  const role = c.req.header('X-User-Role')
  if (role !== 'superadm' && role !== 'suporte') {
    return c.json({ message: 'Acesso restrito' }, 403)
  }

  const body = await c.req.json() as { entes: Array<{ base: number; fonte?: FonteBase; descricao?: string }> }

  if (!body.entes || !Array.isArray(body.entes)) {
    return c.json({ message: 'entes[] é obrigatório' }, 400)
  }

  const resultados = body.entes.map((ente) => {
    const calculo = calcularPreco(ente.base, ente.fonte || 'pncp_contratacoes')
    const modalidade = recomendarModalidade(calculo.preco_anual)
    return {
      descricao: ente.descricao || '-',
      base: ente.base,
      ...calculo,
      modalidade_recomendada: modalidade.id,
      modalidade_fundamento: modalidade.fundamento,
    }
  })

  return c.json({
    total: resultados.length,
    resultados,
    gerado_em: new Date().toISOString(),
  })
})

export default app
