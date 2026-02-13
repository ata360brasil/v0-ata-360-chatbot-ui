/**
 * ATA360 — PCA Inteligente
 *
 * Módulo de Plano de Contratações Anual com IA:
 * 1. Sugestão automática de PCA para órgãos sem PCA
 * 2. Importação e conciliação de PCA existente
 * 3. PCA vivo — atualizado continuamente com processos
 * 4. Reconciliação semanal com execução orçamentária
 *
 * Quando órgão adere ao ATA360 SEM PCA:
 *   - Consulta PNCP, Compras.gov, execução orçamentária (3 anos)
 *   - Identifica itens recorrentes, sazonalidade, padrões
 *   - Sugere PCA completo baseado em dados históricos
 *   - PCA sugerido passa pelo ciclo completo (ACMA → AUDITOR)
 *
 * @see Dec. 10.947/2022 — PCA obrigatório
 * @see DOCUMENTACAO.md — Seção 5 — PCA Inteligente
 */

import type { Env } from '../orchestrator/types'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface PCAPlano {
  id: string
  orgao_id: string
  exercicio: number
  status: string
  origem: string
  valor_total_estimado: number
  qtd_itens: number
  itens: PCAItem[]
}

export interface PCAItem {
  numero_item: number
  descricao: string
  catmat_catser: string | null
  tipo: 'material' | 'servico' | 'obra' | 'tic'
  setor_requisitante: string
  quantidade: number
  unidade: string
  valor_unitario_estimado: number | null
  valor_total_estimado: number | null
  mes_previsto: number | null
  trimestre: number | null
  prioridade: 'critica' | 'alta' | 'normal' | 'baixa'
  modalidade_sugerida: string | null
  sugerido_por: string
  confianca: number | null
  justificativa_sugestao: string | null
  // Campos de conciliação (preenchidos quando item é executado)
  processo_id?: string | null
  processo_status?: string | null
  executado?: boolean
}

export interface CompraHistorica {
  descricao: string
  catmat_catser: string | null
  tipo: string
  valor_unitario: number
  valor_total: number
  quantidade: number
  modalidade: string
  ano: number
  mes_compra: number
  recorrente: boolean
  sazonalidade: number[]
}

export interface SugestaoPCA {
  itens: PCAItem[]
  fontes_consultadas: string[]
  anos_analisados: number[]
  total_compras_analisadas: number
  confianca_geral: number
  resumo: string
}

export interface ConciliacaoResult {
  itens_executados: number
  itens_pendentes: number
  itens_nao_previstos: number
  valor_executado: number
  valor_previsto: number
  desvio_percentual: number
  desvios: Array<{
    tipo: 'nao_executado' | 'valor_divergente' | 'nao_previsto' | 'prazo_vencido'
    descricao: string
    item_pca?: string
    valor_previsto?: number
    valor_real?: number
  }>
  adaptacoes_sugeridas: Array<{
    acao: 'incluir' | 'excluir' | 'atualizar_valor' | 'alterar_prazo' | 'alterar_modalidade'
    item: string
    justificativa: string
    dados?: Record<string, unknown>
  }>
}

// ─── Sugestão Automática de PCA ────────────────────────────────────────────

/**
 * Gera sugestão de PCA baseada em dados históricos.
 * Chamado quando órgão adere ao ATA360 sem PCA ou solicita novo PCA.
 */
export async function sugerirPCA(
  orgaoId: string,
  exercicio: number,
  env: Env,
): Promise<SugestaoPCA> {
  // 1. Coletar dados históricos de múltiplas fontes em paralelo
  const [
    comprasPNCP,
    comprasComprasGov,
    execucaoOrcamentaria,
  ] = await Promise.allSettled([
    fetchHistoricoPNCP(orgaoId, exercicio, env),
    fetchHistoricoComprasGov(orgaoId, exercicio, env),
    fetchExecucaoOrcamentaria(orgaoId, exercicio, env),
  ])

  // 2. Consolidar dados históricos
  const historico: CompraHistorica[] = []
  const fontesConsultadas: string[] = []
  const anosAnalisados = [exercicio - 3, exercicio - 2, exercicio - 1]

  if (comprasPNCP.status === 'fulfilled' && comprasPNCP.value.length > 0) {
    historico.push(...comprasPNCP.value)
    fontesConsultadas.push('PNCP')
  }

  if (comprasComprasGov.status === 'fulfilled' && comprasComprasGov.value.length > 0) {
    historico.push(...comprasComprasGov.value)
    fontesConsultadas.push('Compras.gov.br')
  }

  if (execucaoOrcamentaria.status === 'fulfilled' && execucaoOrcamentaria.value.length > 0) {
    historico.push(...execucaoOrcamentaria.value)
    fontesConsultadas.push('Execução Orçamentária')
  }

  // 3. Salvar histórico no banco para referência futura
  await salvarHistorico(orgaoId, historico, env)

  // 4. Analisar padrões e gerar sugestões
  const itens = analisarEGerarSugestoes(historico, exercicio)

  // 5. Calcular confiança geral
  const confiancaGeral = calcularConfiancaGeral(historico, fontesConsultadas)

  // 6. Gerar resumo
  const resumo = gerarResumo(itens, fontesConsultadas, anosAnalisados, confiancaGeral)

  return {
    itens,
    fontes_consultadas: fontesConsultadas,
    anos_analisados: anosAnalisados,
    total_compras_analisadas: historico.length,
    confianca_geral: confiancaGeral,
    resumo,
  }
}

// ─── Conciliação com PCA Existente ─────────────────────────────────────────

/**
 * Concilia PCA existente com execução real.
 * Identifica desvios e sugere adaptações.
 */
export async function conciliarPCA(
  pcaId: string,
  orgaoId: string,
  env: Env,
): Promise<ConciliacaoResult> {
  const headers = {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // 1. Carregar itens do PCA
  const pcaResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/pca_itens?pca_id=eq.${pcaId}&select=*`,
    { headers },
  )
  const pcaItens = pcaResponse.ok ? await pcaResponse.json() as PCAItem[] : []

  // 2. Carregar processos vinculados ao órgão
  const processosResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/processos?orgao_id=eq.${orgaoId}&select=id,objeto,status,valor_estimado,modalidade,created_at`,
    { headers },
  )
  const processos = processosResponse.ok
    ? await processosResponse.json() as Array<{
        id: string; objeto: string; status: string;
        valor_estimado: number; modalidade: string; created_at: string
      }>
    : []

  // 3. Identificar desvios
  const desvios: ConciliacaoResult['desvios'] = []
  const adaptacoes: ConciliacaoResult['adaptacoes_sugeridas'] = []
  let valorExecutado = 0
  let valorPrevisto = 0
  let itensExecutados = 0
  let itensPendentes = 0

  for (const item of pcaItens) {
    valorPrevisto += item.valor_total_estimado || 0

    // Verificar se item foi executado (tem processo vinculado)
    if (item.processo_id) {
      const processo = processos.find(p => p.id === item.processo_id)
      if (processo) {
        itensExecutados++
        valorExecutado += processo.valor_estimado || 0

        // Verificar desvio de valor
        if (item.valor_total_estimado && processo.valor_estimado) {
          const desvioValor = Math.abs(processo.valor_estimado - item.valor_total_estimado) / item.valor_total_estimado
          if (desvioValor > 0.25) {
            desvios.push({
              tipo: 'valor_divergente',
              descricao: `Item "${item.descricao}" — valor previsto: R$ ${item.valor_total_estimado?.toFixed(2)}, valor real: R$ ${processo.valor_estimado.toFixed(2)} (desvio: ${(desvioValor * 100).toFixed(1)}%)`,
              item_pca: item.descricao,
              valor_previsto: item.valor_total_estimado,
              valor_real: processo.valor_estimado,
            })
            adaptacoes.push({
              acao: 'atualizar_valor',
              item: item.descricao,
              justificativa: `Valor real diverge ${(desvioValor * 100).toFixed(1)}% do previsto. Atualizar estimativa para PCA futuro.`,
              dados: { valor_real: processo.valor_estimado },
            })
          }
        }
      }
    } else {
      itensPendentes++
      // Verificar se prazo já passou
      const now = new Date()
      const mesPrevisto = item.mes_previsto || 12
      const dataLimite = new Date(now.getFullYear(), mesPrevisto - 1, 28)
      if (now > dataLimite) {
        desvios.push({
          tipo: 'prazo_vencido',
          descricao: `Item "${item.descricao}" — prazo previsto: mês ${mesPrevisto}, não executado`,
          item_pca: item.descricao,
        })
      }
    }
  }

  // 4. Processos não previstos no PCA
  const processosNaoPrevistos = processos.filter(p => {
    return !pcaItens.some(item => item.processo_id === p.id)
  })
  const itensNaoPrevistos = processosNaoPrevistos.length

  for (const p of processosNaoPrevistos) {
    desvios.push({
      tipo: 'nao_previsto',
      descricao: `Processo "${p.objeto}" não consta no PCA`,
    })
    adaptacoes.push({
      acao: 'incluir',
      item: p.objeto,
      justificativa: `Contratação realizada sem previsão no PCA. Incluir para próximo exercício.`,
      dados: { valor: p.valor_estimado, modalidade: p.modalidade },
    })
  }

  // 5. Itens não executados
  const itensNaoExecutados = pcaItens.filter(i => !i.executado && !i.processo_id)
  for (const item of itensNaoExecutados) {
    desvios.push({
      tipo: 'nao_executado',
      descricao: `Item "${item.descricao}" do PCA não foi contratado`,
      item_pca: item.descricao,
      valor_previsto: item.valor_total_estimado || undefined,
    })
  }

  const desvioPercentual = valorPrevisto > 0
    ? Math.round(((valorExecutado - valorPrevisto) / valorPrevisto) * 100)
    : 0

  return {
    itens_executados: itensExecutados,
    itens_pendentes: itensPendentes,
    itens_nao_previstos: itensNaoPrevistos,
    valor_executado: valorExecutado,
    valor_previsto: valorPrevisto,
    desvio_percentual: desvioPercentual,
    desvios,
    adaptacoes_sugeridas: adaptacoes,
  }
}

// ─── Vincular Processo ao PCA ──────────────────────────────────────────────

/**
 * Vincula um processo ATA360 a um item do PCA.
 * Chamado quando processo é criado e órgão tem PCA.
 */
export async function vincularProcessoPCA(
  processoId: string,
  objeto: string,
  orgaoId: string,
  env: Env,
): Promise<{ vinculado: boolean; pca_item_id: string | null; mensagem: string }> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // 1. Buscar PCA ativo do órgão
  const exercicio = new Date().getFullYear()
  const pcaResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/pca_plano?orgao_id=eq.${orgaoId}&exercicio=eq.${exercicio}&status=in.(aprovado,publicado)&select=id`,
    { headers },
  )

  if (!pcaResponse.ok) return { vinculado: false, pca_item_id: null, mensagem: 'PCA não encontrado' }
  const [pca] = await pcaResponse.json() as Array<{ id: string }>
  if (!pca) return { vinculado: false, pca_item_id: null, mensagem: 'Órgão sem PCA aprovado para o exercício' }

  // 2. Buscar item mais compatível do PCA
  const itensResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/pca_itens?pca_id=eq.${pca.id}&executado=eq.false&processo_id=is.null&select=id,descricao,catmat_catser`,
    { headers },
  )

  if (!itensResponse.ok) return { vinculado: false, pca_item_id: null, mensagem: 'Erro ao buscar itens PCA' }
  const itens = await itensResponse.json() as Array<{ id: string; descricao: string; catmat_catser: string }>

  if (itens.length === 0) {
    return { vinculado: false, pca_item_id: null, mensagem: 'Nenhum item PCA disponível para vinculação' }
  }

  // 3. Encontrar melhor match (fuzzy search simples)
  const objetoLower = objeto.toLowerCase()
  let melhorMatch = itens[0]
  let melhorScore = 0

  for (const item of itens) {
    const descLower = item.descricao.toLowerCase()
    // Score baseado em palavras em comum
    const palavrasObjeto = objetoLower.split(/\s+/).filter(p => p.length > 3)
    const matches = palavrasObjeto.filter(p => descLower.includes(p))
    const score = matches.length / Math.max(palavrasObjeto.length, 1)
    if (score > melhorScore) {
      melhorScore = score
      melhorMatch = item
    }
  }

  if (melhorScore < 0.3) {
    return {
      vinculado: false,
      pca_item_id: null,
      mensagem: `Contratação "${objeto}" não encontra correspondência no PCA. Considere atualizar o PCA.`,
    }
  }

  // 4. Vincular
  await fetch(
    `${env.SUPABASE_URL}/rest/v1/pca_itens?id=eq.${melhorMatch.id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        processo_id: processoId,
        processo_status: 'em_andamento',
        updated_at: new Date().toISOString(),
      }),
    },
  )

  return {
    vinculado: true,
    pca_item_id: melhorMatch.id,
    mensagem: `Vinculado ao item PCA: "${melhorMatch.descricao}"`,
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchHistoricoPNCP(
  orgaoId: string,
  exercicio: number,
  env: Env,
): Promise<CompraHistorica[]> {
  try {
    // Buscar dados UASG do órgão
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }
    const orgaoResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orgaos?id=eq.${orgaoId}&select=cnpj,uasg`,
      { headers },
    )
    if (!orgaoResponse.ok) return []
    const [orgao] = await orgaoResponse.json() as Array<{ cnpj: string; uasg: string }>
    if (!orgao?.cnpj) return []

    // Consultar PNCP (últimos 3 anos)
    const historico: CompraHistorica[] = []
    for (let ano = exercicio - 3; ano < exercicio; ano++) {
      try {
        const pncpResponse = await fetch(
          `${env.PNCP_BASE_URL || 'https://pncp.gov.br/api'}/consulta/v1/contratos?cnpjOrgao=${orgao.cnpj}&anoExercicio=${ano}&pagina=1&tamanhoPagina=50`,
        )
        if (!pncpResponse.ok) continue

        const data = await pncpResponse.json() as Array<{
          objetoContratacao: string
          codigoCatmat: string
          valorTotalHomologado: number
          quantidadeHomologada: number
          modalidade: string
          dataResultado: string
        }>

        for (const item of data) {
          const dataContrato = new Date(item.dataResultado)
          historico.push({
            descricao: item.objetoContratacao || '',
            catmat_catser: item.codigoCatmat || null,
            tipo: inferirTipo(item.objetoContratacao || ''),
            valor_unitario: item.valorTotalHomologado / Math.max(item.quantidadeHomologada || 1, 1),
            valor_total: item.valorTotalHomologado || 0,
            quantidade: item.quantidadeHomologada || 1,
            modalidade: item.modalidade || 'pregao',
            ano,
            mes_compra: dataContrato.getMonth() + 1,
            recorrente: false,
            sazonalidade: [],
          })
        }
      } catch {
        // Continuar com próximo ano
      }
    }

    // Marcar itens recorrentes
    marcarRecorrentes(historico)

    return historico
  } catch {
    return []
  }
}

async function fetchHistoricoComprasGov(
  orgaoId: string,
  exercicio: number,
  env: Env,
): Promise<CompraHistorica[]> {
  // TODO(v8.3): Implementar integração com API Compras.gov.br (SIASG/ComprasNet)
  // Endpoint: https://compras.dados.gov.br/docs/home.html
  // Retorna dados de SIASG, ARP vigentes, PGC (Plano de Gerenciamento de Contratações)
  // Por enquanto: fallback para PNCP que já cobre contratos publicados
  try {
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }
    // Tentar buscar do cache local (pca_historico_compras) onde PNCP já salvou
    const cacheResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/pca_historico_compras?orgao_id=eq.${orgaoId}&fonte=eq.comprasgov&ano=gte.${exercicio - 3}&select=*&limit=100`,
      { headers },
    )
    if (!cacheResponse.ok) return []
    const rows = await cacheResponse.json() as Array<Record<string, unknown>>
    return rows.map(r => ({
      descricao: String(r.descricao || ''),
      catmat_catser: r.catmat_catser as string | null,
      tipo: String(r.tipo || 'material'),
      valor_unitario: Number(r.valor_unitario || 0),
      valor_total: Number(r.valor_total || 0),
      quantidade: Number(r.quantidade || 1),
      modalidade: String(r.modalidade || 'pregao'),
      ano: Number(r.ano || exercicio - 1),
      mes_compra: Number(r.mes_compra || 1),
      recorrente: Boolean(r.recorrente),
      sazonalidade: (r.sazonalidade as number[]) || [],
    }))
  } catch {
    return []
  }
}

async function fetchExecucaoOrcamentaria(
  orgaoId: string,
  exercicio: number,
  env: Env,
): Promise<CompraHistorica[]> {
  // TODO(v8.3): Implementar integração com SICONFI/FINBRA (dados contábeis municipais)
  // Endpoint: https://apidatalake.tesouro.gov.br/ords/siconfi/
  // Retorna dados de empenhos e liquidações por natureza de despesa
  // Por enquanto: fallback para cache local
  try {
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }
    const cacheResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/pca_historico_compras?orgao_id=eq.${orgaoId}&fonte=eq.execucao_orcamentaria&ano=gte.${exercicio - 3}&select=*&limit=100`,
      { headers },
    )
    if (!cacheResponse.ok) return []
    const rows = await cacheResponse.json() as Array<Record<string, unknown>>
    return rows.map(r => ({
      descricao: String(r.descricao || ''),
      catmat_catser: r.catmat_catser as string | null,
      tipo: String(r.tipo || 'material'),
      valor_unitario: Number(r.valor_unitario || 0),
      valor_total: Number(r.valor_total || 0),
      quantidade: Number(r.quantidade || 1),
      modalidade: String(r.modalidade || 'pregao'),
      ano: Number(r.ano || exercicio - 1),
      mes_compra: Number(r.mes_compra || 1),
      recorrente: Boolean(r.recorrente),
      sazonalidade: (r.sazonalidade as number[]) || [],
    }))
  } catch {
    return []
  }
}

async function salvarHistorico(
  orgaoId: string,
  historico: CompraHistorica[],
  env: Env,
): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  // Salvar em lotes de 50
  for (let i = 0; i < historico.length; i += 50) {
    const lote = historico.slice(i, i + 50).map(h => ({
      orgao_id: orgaoId,
      ano: h.ano,
      fonte: 'pncp',
      descricao: h.descricao,
      catmat_catser: h.catmat_catser,
      tipo: h.tipo,
      valor_unitario: h.valor_unitario,
      valor_total: h.valor_total,
      quantidade: h.quantidade,
      modalidade: h.modalidade,
      mes_compra: h.mes_compra,
      recorrente: h.recorrente,
      sazonalidade: h.sazonalidade,
    }))

    await fetch(`${env.SUPABASE_URL}/rest/v1/pca_historico_compras`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(lote),
    })
  }
}

function analisarEGerarSugestoes(
  historico: CompraHistorica[],
  exercicio: number,
): PCAItem[] {
  const itens: PCAItem[] = []
  let numero = 1

  // Agrupar por descrição similar (normalização simples)
  const grupos = new Map<string, CompraHistorica[]>()
  for (const h of historico) {
    const chave = h.descricao.toLowerCase().trim().slice(0, 80)
    const grupo = grupos.get(chave) || []
    grupo.push(h)
    grupos.set(chave, grupo)
  }

  for (const [_chave, compras] of grupos) {
    // Estatísticas do grupo
    const valores = compras.map(c => c.valor_total).filter(v => v > 0)
    const quantidades = compras.map(c => c.quantidade).filter(q => q > 0)
    const meses = compras.map(c => c.mes_compra)

    const valorMedio = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0
    const quantidadeMedia = quantidades.length > 0 ? Math.ceil(quantidades.reduce((a, b) => a + b, 0) / quantidades.length) : 1
    const anosPresente = new Set(compras.map(c => c.ano)).size
    const recorrente = anosPresente >= 2

    // Sazonalidade: mês mais frequente
    const mesFrequencias: Record<number, number> = {}
    for (const m of meses) {
      mesFrequencias[m] = (mesFrequencias[m] || 0) + 1
    }
    const mesMaisFrequente = Object.entries(mesFrequencias)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]
    const mesPrevisto = mesMaisFrequente ? parseInt(mesMaisFrequente[0]) : null

    // Confiança baseada em quantidade de dados e recorrência
    const confianca = Math.min(0.95, (anosPresente / 3) * 0.5 + (compras.length / 10) * 0.3 + (recorrente ? 0.2 : 0))

    // Determinar prioridade
    let prioridade: PCAItem['prioridade'] = 'normal'
    if (recorrente && valorMedio > 100000) prioridade = 'alta'
    if (recorrente && anosPresente >= 3) prioridade = 'alta'
    if (valorMedio > 500000) prioridade = 'critica'

    // Determinar modalidade sugerida
    const modalidadeSugerida = sugerirModalidade(valorMedio)

    // Usar a descrição mais recente
    const compraRecente = compras.sort((a, b) => b.ano - a.ano)[0]

    itens.push({
      numero_item: numero++,
      descricao: compraRecente.descricao,
      catmat_catser: compraRecente.catmat_catser,
      tipo: compraRecente.tipo as PCAItem['tipo'],
      setor_requisitante: inferirSetor(compraRecente.descricao),
      quantidade: quantidadeMedia,
      unidade: 'unidade',
      valor_unitario_estimado: valorMedio / Math.max(quantidadeMedia, 1),
      valor_total_estimado: Math.round(valorMedio * 100) / 100,
      mes_previsto: mesPrevisto,
      trimestre: mesPrevisto ? Math.ceil(mesPrevisto / 3) : null,
      prioridade,
      modalidade_sugerida: modalidadeSugerida,
      sugerido_por: recorrente ? 'ata360_sazonalidade' : 'ata360_historico',
      confianca,
      justificativa_sugestao: recorrente
        ? `Item recorrente (presente em ${anosPresente} dos últimos 3 anos). Valor médio: R$ ${valorMedio.toFixed(2)}. Fonte: PNCP.`
        : `Identificado no histórico de compras (${compras.length} ocorrência${compras.length > 1 ? 's' : ''}). Valor médio: R$ ${valorMedio.toFixed(2)}.`,
    })
  }

  // Ordenar por prioridade e valor
  const prioridadeOrdem = { critica: 0, alta: 1, normal: 2, baixa: 3 }
  itens.sort((a, b) => {
    const pA = prioridadeOrdem[a.prioridade] ?? 2
    const pB = prioridadeOrdem[b.prioridade] ?? 2
    if (pA !== pB) return pA - pB
    return (b.valor_total_estimado || 0) - (a.valor_total_estimado || 0)
  })

  // Renumerar
  itens.forEach((item, i) => { item.numero_item = i + 1 })

  return itens
}

function calcularConfiancaGeral(
  historico: CompraHistorica[],
  fontes: string[],
): number {
  if (historico.length === 0) return 0
  const fonteScore = Math.min(fontes.length / 3, 1) * 0.3
  const volumeScore = Math.min(historico.length / 50, 1) * 0.3
  const anosScore = (new Set(historico.map(h => h.ano)).size / 3) * 0.4
  return Math.round((fonteScore + volumeScore + anosScore) * 100) / 100
}

function gerarResumo(
  itens: PCAItem[],
  fontes: string[],
  anos: number[],
  confianca: number,
): string {
  const valorTotal = itens.reduce((sum, i) => sum + (i.valor_total_estimado || 0), 0)
  return `PCA sugerido com ${itens.length} item(ns), valor total estimado: R$ ${valorTotal.toFixed(2)}. ` +
    `Baseado em dados de ${fontes.join(', ')} (${anos.join('-')}). ` +
    `Confiança geral: ${(confianca * 100).toFixed(0)}%. ` +
    `${itens.filter(i => i.prioridade === 'critica' || i.prioridade === 'alta').length} item(ns) de alta prioridade.`
}

function inferirTipo(descricao: string): string {
  const lower = descricao.toLowerCase()
  if (/servi[cç]o|manuten[cç]|loca[cç]|consultoria|assess|treinamento/i.test(lower)) return 'servico'
  if (/obra|constru[cç]|reforma|amplia[cç]|pavimenta/i.test(lower)) return 'obra'
  if (/software|hardware|licen[cç]a|computador|notebook|servidor|ti |tic /i.test(lower)) return 'tic'
  return 'material'
}

function inferirSetor(descricao: string): string {
  const lower = descricao.toLowerCase()
  if (/sa[uú]de|hospital|medicamento|farmac|ambulância/i.test(lower)) return 'Saúde'
  if (/educa[cç]|escola|ensino|livro|did[aá]tico/i.test(lower)) return 'Educação'
  if (/inform[aá]tica|ti |tic |software|hardware|computador/i.test(lower)) return 'TI'
  if (/obra|engenharia|constru[cç]|paviment/i.test(lower)) return 'Obras'
  if (/limpeza|conserva[cç]|higien/i.test(lower)) return 'Serviços Gerais'
  if (/ve[ií]culo|combust[ií]vel|frota|autom/i.test(lower)) return 'Transporte'
  if (/aliment|merenda|refei[cç]/i.test(lower)) return 'Alimentação'
  return 'Administração'
}

function sugerirModalidade(valorEstimado: number): string {
  // Limites atualizados pelo Dec. 12.807/2025 (vigência jan/2026)
  // Art. 75, II da Lei 14.133/2021 — dispensa por valor
  const LIMITE_DISPENSA = 65492.11 // Dec. 12.807/2025, Art. 75, II
  const LIMITE_CONCORRENCIA = 3774997.53 // Dec. 12.807/2025 — obras/serviços engenharia

  if (valorEstimado <= LIMITE_DISPENSA) return 'dispensa'
  if (valorEstimado <= LIMITE_CONCORRENCIA) return 'pregao'
  return 'concorrencia'
}

function marcarRecorrentes(historico: CompraHistorica[]): void {
  const porDescricao = new Map<string, Set<number>>()
  for (const h of historico) {
    const chave = h.descricao.toLowerCase().trim().slice(0, 80)
    const anos = porDescricao.get(chave) || new Set()
    anos.add(h.ano)
    porDescricao.set(chave, anos)
  }

  for (const h of historico) {
    const chave = h.descricao.toLowerCase().trim().slice(0, 80)
    const anos = porDescricao.get(chave)
    if (anos && anos.size >= 2) {
      h.recorrente = true
    }
  }
}
