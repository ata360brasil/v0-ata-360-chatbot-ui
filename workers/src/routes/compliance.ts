/**
 * ATA360 — Rotas de Compliance e Integridade
 *
 * @see workers/src/compliance/integridade.ts
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import {
  calcularScoreIntegridade,
  calcularESG,
  gerarMapaRiscosPadrao,
  ODS_ATA360,
} from '../compliance/integridade'
import type { ProgramaIntegridade } from '../compliance/integridade'

const app = new Hono<{ Bindings: Env }>()

// GET /compliance/:orgaoId — Programa de integridade do órgão
app.get('/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/compliance_programa?orgao_id=eq.${orgaoId}&select=*`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Erro ao buscar programa' }, 500)
  const [programa] = await response.json() as Array<Record<string, unknown>>

  if (!programa) {
    return c.json({
      encontrado: false,
      mensagem: 'Programa de integridade não cadastrado. O ATA360 pode gerar um programa inicial baseado nas diretrizes CGU.',
      ods_ata360: ODS_ATA360,
    })
  }

  return c.json({ ...programa, ods_ata360: ODS_ATA360 })
})

// POST /compliance/avaliar — Avaliar programa de integridade
app.post('/avaliar', async (c) => {
  const body = await c.req.json() as { orgao_id: string }
  const { orgao_id } = body

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  // Buscar programa
  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/compliance_programa?orgao_id=eq.${orgao_id}&select=*`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Programa não encontrado' }, 404)
  const [row] = await response.json() as Array<Record<string, unknown>>
  if (!row) return c.json({ erro: 'Programa não encontrado' }, 404)

  // Montar estrutura para avaliação
  const programa: ProgramaIntegridade = {
    id: row.id as string,
    orgao_id: row.orgao_id as string,
    pilares: {
      comprometimento_lideranca: row.comprometimento_lideranca as boolean,
      instancia_responsavel: row.instancia_responsavel as boolean,
      analise_riscos: row.analise_riscos as boolean,
      regras_instrumentos: row.regras_instrumentos as boolean,
      monitoramento_continuo: row.monitoramento_continuo as boolean,
    },
    codigo_conduta: {
      ativo: row.codigo_conduta as boolean,
      url: row.codigo_conduta_url as string | undefined,
      data: row.codigo_conduta_data as string | undefined,
    },
    canal_denuncias: {
      ativo: row.canal_denuncias as boolean,
      tipo: row.canal_denuncias_tipo as string | undefined,
      url: row.canal_denuncias_url as string | undefined,
    },
    due_diligence: row.due_diligence as boolean,
    treinamento: {
      realizado: row.treinamento_compliance as boolean,
      ultimo: row.treinamento_ultimo as string | undefined,
    },
    certificacoes: {
      pro_etica_cgu: row.certificacao_pro_etica_cgu as boolean,
      abes_etica: row.certificacao_abes as boolean,
      tcu_diamante: row.certificacao_tcu_diamante as boolean,
      tce_mg: row.certificacao_tce_mg as boolean,
    },
    politicas: {
      anticorrupcao: row.politica_anticorrupcao as boolean,
      lgpd: row.politica_lgpd as boolean,
      diversidade: row.politica_diversidade as boolean,
      teletrabalho: row.politica_teletrabalho as boolean,
      respeito_mulher: row.politica_respeito_mulher as boolean,
      esg: row.politica_esg as boolean,
      conflito_interesse: row.politica_conflito_interesse as boolean,
    },
    esg: {
      ambiental: (row.esg_ambiental_score as number) || 0,
      social: (row.esg_social_score as number) || 0,
      governanca: (row.esg_governanca_score as number) || 0,
      compras_sustentaveis_pct: (row.esg_compras_sustentaveis_pct as number) || 0,
    },
    ods: (row.ods_atendidos as number[]) || [],
    nivel_maturidade: (row.nivel_maturidade as string) || 'inicial',
    score_integridade: (row.score_integridade as number) || 0,
  }

  const avaliacao = calcularScoreIntegridade(programa)
  const esg = calcularESG(programa)

  // Salvar resultado
  await fetch(`${c.env.SUPABASE_URL}/rest/v1/compliance_programa?orgao_id=eq.${orgao_id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      score_integridade: avaliacao.score,
      nivel_maturidade: avaliacao.nivel,
      esg_ambiental_score: esg.ambiental,
      esg_social_score: esg.social,
      esg_governanca_score: esg.governanca,
      ultima_avaliacao: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  })

  return c.json({
    sucesso: true,
    avaliacao,
    esg,
    ods_ata360: ODS_ATA360,
  })
})

// GET /compliance/:orgaoId/riscos — Mapa de riscos
app.get('/:orgaoId/riscos', async (c) => {
  const orgaoId = c.req.param('orgaoId')

  const headers = {
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${c.env.SUPABASE_URL}/rest/v1/compliance_riscos?orgao_id=eq.${orgaoId}&select=*&order=nivel_risco.desc`,
    { headers },
  )

  if (!response.ok) return c.json({ erro: 'Erro ao buscar riscos' }, 500)
  const riscos = await response.json()

  return c.json({ riscos })
})

// POST /compliance/riscos/padrao — Gerar mapa de riscos padrão
app.post('/riscos/padrao', async (c) => {
  const body = await c.req.json() as { orgao_id: string; programa_id: string }

  if (!body.orgao_id || !body.programa_id) {
    return c.json({ erro: 'orgao_id e programa_id são obrigatórios' }, 400)
  }

  const riscosPadrao = gerarMapaRiscosPadrao()

  const headers = {
    'Content-Type': 'application/json',
    'apikey': c.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  // Inserir riscos no banco
  const rows = riscosPadrao.map(r => ({
    orgao_id: body.orgao_id,
    programa_id: body.programa_id,
    ...r,
  }))

  await fetch(`${c.env.SUPABASE_URL}/rest/v1/compliance_riscos`, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
  })

  return c.json({
    sucesso: true,
    riscos_criados: riscosPadrao.length,
    mensagem: `${riscosPadrao.length} riscos padrão gerados com base nas categorias mais comuns em contratações públicas.`,
  })
})

// GET /compliance/ods — ODS ONU atendidos pelo ATA360
app.get('/ods', async (c) => {
  return c.json({ ods: ODS_ATA360 })
})

export default app
