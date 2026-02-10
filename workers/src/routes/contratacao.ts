/**
 * ATA360 — Contratação Routes (Workers)
 *
 * Rotas para gerenciar contratações do ATA360 (autocontratação).
 * Prova de fogo: o ATA360 gera os próprios documentos de contratação.
 *
 * POST / — Iniciar contratação (simulação → proposta)
 * GET  /:id — Obter contratação
 * GET  /orgao/:orgaoId — Listar contratações do órgão
 * PATCH /:id/status — Atualizar status
 * POST /auto-pca — Gerar PCA de contratação do ATA360 em minutos
 *
 * @see workers/src/pricing/engine.ts — Motor de precificação
 * @see Lei 14.133/2021 — Arts. 74, 75, 81, 86, 106-107
 */

import { Hono } from 'hono'
import type { Env } from '../orchestrator/types'
import {
  calcularPreco,
  recomendarModalidade,
  calcularVigencia,
  AUTOCONTRATACAO,
  PRICING_PARAMS_2026,
  type FonteBase,
} from '../pricing/engine'

const app = new Hono<{ Bindings: Env }>()

// ─── POST / — Iniciar contratação ───────────────────────────────────────────

app.post('/', async (c) => {
  const userId = c.req.header('X-User-Id')
  const orgaoId = c.req.header('X-Orgao-Id')

  if (!orgaoId) {
    return c.json({ message: 'X-Orgao-Id é obrigatório' }, 400)
  }

  const body = await c.req.json() as {
    base_calculo: number
    fonte_base?: FonteBase
    modalidade_preferida?: string
    vigencia_anos?: number
    fonte_recurso?: string
    emenda_numero?: string
    arp_disponivel?: boolean
    emenda_disponivel?: boolean
  }

  if (!body.base_calculo || body.base_calculo <= 0) {
    return c.json({ message: 'base_calculo é obrigatório e deve ser > 0' }, 400)
  }

  // Calcular preço
  const calculo = calcularPreco(body.base_calculo, body.fonte_base || 'pncp_contratacoes')
  const modalidade = recomendarModalidade(calculo.preco_anual, PRICING_PARAMS_2026, {
    arp_disponivel: body.arp_disponivel,
    emenda_disponivel: body.emenda_disponivel,
  })
  const vigencia = calcularVigencia(modalidade.id)
  const vigenciaEscolhida = body.vigencia_anos
    ? vigencia.find(v => v.duracao_anos === body.vigencia_anos) || vigencia[0]
    : vigencia[0]

  // Criar simulação
  const simulacaoId = crypto.randomUUID()
  const contratacaoId = crypto.randomUUID()
  const agora = new Date().toISOString()
  const inicioDate = new Date()
  const fimDate = new Date(inicioDate)
  fimDate.setFullYear(fimDate.getFullYear() + vigenciaEscolhida.duracao_anos)

  try {
    // Inserir simulação
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/pricing_simulacoes`, {
      method: 'POST',
      headers: {
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: simulacaoId,
        orgao_id: orgaoId,
        tipo_ente: 'outro',
        base_calculo: body.base_calculo,
        fonte_base: body.fonte_base || 'pncp_contratacoes',
        preco_anual: calculo.preco_anual,
        preco_mensal: calculo.preco_mensal_equivalente,
        aliquota_efetiva: calculo.aliquota_efetiva,
        categoria: calculo.categoria,
        modalidade_recomendada: modalidade.id,
        vigencia_sugerida_anos: vigenciaEscolhida.duracao_anos,
        status: 'proposta',
        valida_ate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        simulado_por: userId,
      }),
    })

    // Inserir contratação
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/contratacoes_ata360`, {
      method: 'POST',
      headers: {
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: contratacaoId,
        orgao_id: orgaoId,
        simulacao_id: simulacaoId,
        modalidade: modalidade.id,
        fundamento_legal: modalidade.fundamento,
        valor_anual: calculo.preco_anual,
        valor_total_contrato: calculo.preco_anual * vigenciaEscolhida.duracao_anos,
        vigencia_inicio: inicioDate.toISOString().split('T')[0],
        vigencia_fim: fimDate.toISOString().split('T')[0],
        duracao_anos: vigenciaEscolhida.duracao_anos,
        renovavel: vigenciaEscolhida.renovavel,
        renovacao_automatica: vigenciaEscolhida.renovacao_automatica,
        renovacao_max_anos: vigenciaEscolhida.renovacao_max_anos,
        catser: AUTOCONTRATACAO.catser_principal,
        status: 'em_formalizacao',
        fonte_recurso: body.fonte_recurso || 'proprio',
        emenda_numero: body.emenda_numero || null,
      }),
    })

    return c.json({
      sucesso: true,
      contratacao_id: contratacaoId,
      simulacao_id: simulacaoId,
      calculo,
      modalidade: modalidade.id,
      modalidade_nome: modalidade.nome,
      fundamento_legal: modalidade.fundamento,
      vigencia: vigenciaEscolhida,
      trilha_documentos: AUTOCONTRATACAO.getTrilha(modalidade.id),
      catser: AUTOCONTRATACAO.catser_principal,
      objeto: AUTOCONTRATACAO.descricao_objeto,
      mensagem: `Contratação iniciada via ${modalidade.nome}. Trilha de ${AUTOCONTRATACAO.getTrilha(modalidade.id).length} documentos criada.`,
    }, 201)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: 'Erro ao criar contratação', detalhes: msg }, 500)
  }
})

// ─── GET /:id — Obter contratação ───────────────────────────────────────────

app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const orgaoId = c.req.header('X-Orgao-Id')

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/contratacoes_ata360?id=eq.${id}&orgao_id=eq.${orgaoId}`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    const rows = await response.json() as unknown[]
    if (!Array.isArray(rows) || rows.length === 0) {
      return c.json({ message: 'Contratação não encontrada' }, 404)
    }
    return c.json({ contratacao: rows[0] })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── GET /orgao/:orgaoId — Listar contratações do órgão ─────────────────────

app.get('/orgao/:orgaoId', async (c) => {
  const orgaoId = c.req.param('orgaoId')

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/contratacoes_ata360?orgao_id=eq.${orgaoId}&order=created_at.desc`,
      { headers: { 'apikey': c.env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}` } }
    )
    const contratacoes = await response.json()
    return c.json({ contratacoes })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── PATCH /:id/status — Atualizar status ─────────────────────────────────

app.patch('/:id/status', async (c) => {
  const id = c.req.param('id')
  const orgaoId = c.req.header('X-Orgao-Id')
  const body = await c.req.json() as { status: string; observacoes?: string }

  const statusValidos = ['em_formalizacao', 'vigente', 'renovando', 'suspenso', 'encerrado', 'cancelado']
  if (!statusValidos.includes(body.status)) {
    return c.json({ message: `Status inválido. Válidos: ${statusValidos.join(', ')}` }, 400)
  }

  try {
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/contratacoes_ata360?id=eq.${id}&orgao_id=eq.${orgaoId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': c.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: body.status,
          observacoes: body.observacoes,
          updated_at: new Date().toISOString(),
        }),
      }
    )

    if (!response.ok) {
      return c.json({ message: 'Erro ao atualizar status' }, 500)
    }

    return c.json({ sucesso: true, status: body.status })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: msg }, 500)
  }
})

// ─── POST /auto-pca — Prova de fogo: Gerar PCA de contratação do ATA360 ────

app.post('/auto-pca', async (c) => {
  const orgaoId = c.req.header('X-Orgao-Id')
  const userId = c.req.header('X-User-Id')

  if (!orgaoId) {
    return c.json({ message: 'X-Orgao-Id é obrigatório' }, 400)
  }

  const body = await c.req.json() as {
    base_calculo: number
    fonte_base?: FonteBase
    exercicio?: number
    nome_ente?: string
    cnpj?: string
    populacao?: number
    uf?: string
  }

  if (!body.base_calculo || body.base_calculo <= 0) {
    return c.json({ message: 'base_calculo é obrigatório e deve ser > 0' }, 400)
  }

  const calculo = calcularPreco(body.base_calculo, body.fonte_base || 'pncp_contratacoes')
  const modalidade = recomendarModalidade(calculo.preco_anual)
  const exercicio = body.exercicio || new Date().getFullYear()

  // Gerar conteúdo PCA automático para contratação do ATA360
  const pcaItem = {
    descricao: AUTOCONTRATACAO.descricao_objeto,
    catser: AUTOCONTRATACAO.catser_principal,
    quantidade: 1,
    unidade: 'licença anual',
    valor_estimado: calculo.preco_anual,
    valor_total: calculo.preco_anual,
    prioridade: 'alta',
    justificativa: `Modernização da gestão de contratações públicas conforme Art. 11, IV, Lei 14.133/2021. `
      + `Base de cálculo: R$ ${body.base_calculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} `
      + `(${body.fonte_base || 'pncp_contratacoes'}). `
      + `Preço calculado pela equação universal: R$ ${calculo.preco_anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ano. `
      + `Modalidade recomendada: ${modalidade.nome} (${modalidade.fundamento}).`,
    vinculacao_orcamentaria: 'Dotação de custeio — TI e modernização',
    modalidade_sugerida: modalidade.id,
    fundamento_legal: modalidade.fundamento,
    renovavel: true,
    duracao_prevista_anos: 1,
    mes_previsto: 3,
    area_requisitante: 'Setor de Compras / TI',
    area_tecnica: 'TI',
  }

  // Salvar PCA sugerido
  try {
    const pcaId = crypto.randomUUID()
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/pca_itens`, {
      method: 'POST',
      headers: {
        'apikey': c.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: pcaId,
        orgao_id: orgaoId,
        exercicio,
        descricao: pcaItem.descricao,
        catser: pcaItem.catser,
        quantidade: pcaItem.quantidade,
        unidade: pcaItem.unidade,
        valor_estimado: pcaItem.valor_estimado,
        valor_total: pcaItem.valor_total,
        prioridade: pcaItem.prioridade,
        justificativa: pcaItem.justificativa,
        area_requisitante: pcaItem.area_requisitante,
        area_tecnica: pcaItem.area_tecnica,
        status: 'aprovado',
        origem: 'sugestao_automatica',
        confianca: 0.95,
        criado_por: userId,
      }),
    })

    return c.json({
      sucesso: true,
      pca_id: pcaId,
      mensagem: `PCA de contratação do ATA360 gerado para exercício ${exercicio}`,
      item_pca: pcaItem,
      calculo,
      modalidade_recomendada: {
        id: modalidade.id,
        nome: modalidade.nome,
        fundamento: modalidade.fundamento,
        documentos: modalidade.documentos_obrigatorios,
        prazo: modalidade.prazo_estimado,
      },
      trilha_documentos: AUTOCONTRATACAO.getTrilha(modalidade.id),
      proxima_etapa: `Iniciar geração de documentos via trilha (${AUTOCONTRATACAO.getTrilha(modalidade.id).length} artefatos)`,
    }, 201)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro'
    return c.json({ message: 'Erro ao gerar PCA', detalhes: msg }, 500)
  }
})

export default app
