/**
 * ATA360 — Rotas PCA Inteligente
 *
 * CRUD + sugestão automática + conciliação + vinculação.
 *
 * @see workers/src/pca/inteligente.ts
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import { sugerirPCA, conciliarPCA, vincularProcessoPCA } from '../pca/inteligente'

const app = new Hono<{ Bindings: Env }>()

// GET /pca/:orgaoId/:exercicio — Buscar PCA do órgão
app.get('/:orgaoId/:exercicio', async (c) => {
  const orgaoId = c.req.param('orgaoId')
  const exercicio = parseInt(c.req.param('exercicio'))

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/pca_plano?orgao_id=eq.${orgaoId}&exercicio=eq.${exercicio}&select=*`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Erro ao buscar PCA' }, 500)
  const [pca] = await response.json() as Array<Record<string, unknown>>

  if (!pca) {
    return c.json({
      encontrado: false,
      mensagem: 'Órgão não possui PCA para este exercício. O ATA360 pode sugerir um PCA com base em dados históricos.',
      pode_sugerir: true,
    })
  }

  // Buscar itens
  const itensResponse = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/pca_itens?pca_id=eq.${pca.id}&select=*&order=numero_item.asc`,
    { headers },
  )
  const itens = itensResponse.ok ? await itensResponse.json() : []

  return c.json({ ...pca, itens })
})

// POST /pca/sugerir — Sugestão automática de PCA
app.post('/sugerir', async (c) => {
  const body = await c.req.json() as { orgao_id: string; exercicio: number }
  const { orgao_id, exercicio } = body

  if (!orgao_id || !exercicio) {
    return c.json({ erro: 'orgao_id e exercicio são obrigatórios' }, 400)
  }

  const sugestao = await sugerirPCA(orgao_id, exercicio, c.env)

  return c.json({
    sucesso: true,
    sugestao,
    mensagem: sugestao.itens.length > 0
      ? `PCA sugerido com ${sugestao.itens.length} itens (confiança: ${(sugestao.confianca_geral * 100).toFixed(0)}%)`
      : 'Não foram encontrados dados históricos suficientes para sugerir PCA.',
  })
})

// POST /pca/conciliar — Conciliação PCA vs execução real
app.post('/conciliar', async (c) => {
  const body = await c.req.json() as { pca_id: string; orgao_id: string }
  const { pca_id, orgao_id } = body

  if (!pca_id || !orgao_id) {
    return c.json({ erro: 'pca_id e orgao_id são obrigatórios' }, 400)
  }

  const resultado = await conciliarPCA(pca_id, orgao_id, c.env)

  return c.json({
    sucesso: true,
    conciliacao: resultado,
    mensagem: `Conciliação: ${resultado.itens_executados} executados, ${resultado.itens_pendentes} pendentes, ${resultado.itens_nao_previstos} não previstos. Desvio: ${resultado.desvio_percentual}%.`,
  })
})

// POST /pca/vincular — Vincular processo a item do PCA
app.post('/vincular', async (c) => {
  const body = await c.req.json() as { processo_id: string; objeto: string; orgao_id: string }
  const { processo_id, objeto, orgao_id } = body

  if (!processo_id || !objeto || !orgao_id) {
    return c.json({ erro: 'processo_id, objeto e orgao_id são obrigatórios' }, 400)
  }

  const resultado = await vincularProcessoPCA(processo_id, objeto, orgao_id, c.env)

  return c.json(resultado)
})

export default app
