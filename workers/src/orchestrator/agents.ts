/**
 * ATA360 — Orquestrador: Agent Delegation
 *
 * 4 funções que delegam trabalho para os sub-agentes:
 * 1. Insight Engine — consulta APIs governamentais em paralelo
 * 2. ACMA — gera texto com LLM + padrões aprendidos + perfil
 * 3. DESIGN_LAW — gera PDF deterministicamente (zero LLM)
 * 4. AUDITOR — auditoria híbrida (LLM + lookup + fórmula)
 *
 * Part 19: dados internos (prompts, modelos, tokens) NUNCA saem daqui.
 * Part 20: Orquestrador é ZERO LLM — delega tudo.
 *
 * @see Spec v8 Part 20 — Orquestrador
 * @see Spec v8 Part 08 — ACMA Agent
 * @see Spec v8 Part 07 — AUDITOR Agent
 * @see Spec v8 Part 09 — DESIGN_LAW Agent
 */

import type {
  EnrichedContext,
  SugestaoACMA,
  ArtefatoDesignLaw,
  ParecerAuditor,
  InsightCard,
  AuditorCheckItem,
  Env,
} from './types'
import { AUDITOR_VERDICTS } from './types'
import { buildPrompt } from '../acma/prompt-builder'
import { loadCalibratedThresholds } from '../auditor/calibration'
import { calcularSeloAprovado } from './engine'
import { ATA360_SYSTEM_RULES, sanitizeResponse } from './chat-guard'

// ─── 1. Insight Engine ───────────────────────────────────────────────────────
// Consulta paralela: PNCP + IBGE + SERPRO + TCU + BCB + TransfereGov
// Retorna dados estruturados + cards para o frontend.

export async function callInsightEngine(
  processoId: string,
  objeto: string,
  documentoTipo: string,
  orgaoId: string,
  env: Env,
): Promise<EnrichedContext> {
  const supabaseHeaders = {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // Consultas paralelas protegidas por circuit breaker
  // Se uma API governamental está fora, fail fast sem bloquear as demais
  const [
    precosResult,
    municipioResult,
    sancoesResult,
    jurisprudenciaResult,
    perfilResult,
    parametrosResult,
    normativosResult,
  ] = await Promise.allSettled([
    // PNCP — preços de referência
    withCircuitBreaker('pncp', () => fetchPrecos(objeto, env)),
    // IBGE — dados do município do órgão
    withCircuitBreaker('ibge', () => fetchMunicipio(orgaoId, env)),
    // Portal Transparência — sanções (CEIS, CNEP, CEPIM)
    withCircuitBreaker('transparencia', () => fetchSancoes(orgaoId, env)),
    // TCU — jurisprudência relevante
    withCircuitBreaker('tcu', () => fetchJurisprudencia(objeto, documentoTipo, env)),
    // Perfil do usuário (Supabase — interno)
    fetchPerfilUsuario(orgaoId, env),
    // Parâmetros do órgão (Supabase — interno)
    fetchParametrosOrgao(orgaoId, env),
    // Normativos aplicáveis (Supabase — interno)
    fetchNormativosAplicaveis(documentoTipo, orgaoId, env),
  ])

  // Montar cards a partir dos resultados
  const cards: InsightCard[] = []
  let precos_referencia: EnrichedContext['precos_referencia'] = null
  let dados_municipio: EnrichedContext['dados_municipio'] = null
  const sancoes: EnrichedContext['sancoes'] = []
  const jurisprudencia: EnrichedContext['jurisprudencia'] = []
  const normativos_aplicaveis: EnrichedContext['normativos_aplicaveis'] = []

  // Processar preços
  if (precosResult.status === 'fulfilled' && precosResult.value) {
    precos_referencia = precosResult.value
    cards.push({
      tipo: 'preco',
      titulo: 'Preços de Referência (PNCP)',
      descricao: `Mediana: R$ ${precosResult.value.mediana.toFixed(2)} — ${precosResult.value.fontes} fontes`,
      fonte: 'PNCP / Compras.gov.br',
      dados: precosResult.value as unknown as Record<string, unknown>,
      relevancia: 0.95,
    })
  }

  // Processar município
  if (municipioResult.status === 'fulfilled' && municipioResult.value) {
    dados_municipio = municipioResult.value
    cards.push({
      tipo: 'ibge',
      titulo: `Dados do Município — ${municipioResult.value.nome}/${municipioResult.value.uf}`,
      descricao: `Pop: ${municipioResult.value.populacao?.toLocaleString('pt-BR') || 'N/D'} | IDH: ${municipioResult.value.idh || 'N/D'}`,
      fonte: 'IBGE',
      dados: municipioResult.value as unknown as Record<string, unknown>,
      relevancia: 0.8,
    })
  }

  // Processar sanções
  if (sancoesResult.status === 'fulfilled' && sancoesResult.value.length > 0) {
    sancoes.push(...sancoesResult.value)
    cards.push({
      tipo: 'sancao',
      titulo: `${sancoesResult.value.length} sanção(ões) encontrada(s)`,
      descricao: sancoesResult.value.map(s => s.tipo).join(', '),
      fonte: 'Portal da Transparência',
      relevancia: 1.0,
    })
  }

  // Processar jurisprudência
  if (jurisprudenciaResult.status === 'fulfilled' && jurisprudenciaResult.value.length > 0) {
    jurisprudencia.push(...jurisprudenciaResult.value)
    cards.push({
      tipo: 'jurisprudencia',
      titulo: `${jurisprudenciaResult.value.length} acórdão(s) relevante(s)`,
      descricao: jurisprudenciaResult.value[0]?.ementa?.slice(0, 100) + '...' || '',
      fonte: 'TCU',
      relevancia: 0.85,
    })
  }

  // Processar normativos
  if (normativosResult.status === 'fulfilled' && normativosResult.value.length > 0) {
    normativos_aplicaveis.push(...normativosResult.value)
    const obrigatorios = normativosResult.value.filter(n => n.relevancia === 'obrigatoria')
    if (obrigatorios.length > 0) {
      cards.push({
        tipo: 'legal',
        titulo: `${obrigatorios.length} normativo(s) obrigatório(s)`,
        descricao: obrigatorios.map(n => n.numero).join(', '),
        fonte: 'Biblioteca Legal ATA360',
        relevancia: 0.9,
      })
    }
  }

  return {
    processo_id: processoId,
    objeto,
    documento_tipo: documentoTipo,
    cards,
    precos_referencia,
    dados_municipio,
    sancoes,
    jurisprudencia,
    recursos_disponiveis: [],
    normativos_aplicaveis,
    perfil_usuario: perfilResult.status === 'fulfilled' ? perfilResult.value : null,
    parametros_orgao: parametrosResult.status === 'fulfilled' ? parametrosResult.value : null,
    coletado_em: new Date().toISOString(),
  }
}

// ─── 2. ACMA — Geração de Texto ─────────────────────────────────────────────
// Usa buildPrompt() existente + AI Gateway.

export async function callACMA(
  processoId: string,
  documentoTipo: string,
  secao: string,
  insightContext: EnrichedContext,
  iteracao: number,
  env: Env,
  contextoDocumentoAnterior?: string | null,
): Promise<SugestaoACMA> {
  const startTime = Date.now()

  // 1. Montar prompt com padrões aprendidos + perfil do usuário
  const userContext = insightContext.perfil_usuario
    ? {
        segmento_principal: insightContext.perfil_usuario.segmento_principal || undefined,
        regiao_uf: insightContext.perfil_usuario.regiao_uf || undefined,
        termos_frequentes: insightContext.perfil_usuario.termos_frequentes,
        preferencias_terminologia: insightContext.perfil_usuario.preferencias_terminologia,
      }
    : undefined

  const builtPrompt = await buildPrompt(
    documentoTipo,
    secao,
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    userContext,
  )

  // 2. Montar mensagem com contexto do Insight Engine
  const contextBlock = buildInsightContextBlock(insightContext)

  // Bloco de contexto do documento anterior aprovado na trilha (continuidade entre documentos)
  const blocoDocAnterior = contextoDocumentoAnterior
    ? `\n\n[DOCUMENTO ANTERIOR APROVADO:]\n${contextoDocumentoAnterior}\n\nUse o documento anterior como referência para manter consistência de terminologia, dados e fundamentação legal.`
    : ''

  const messages = [
    { role: 'system', content: `${ATA360_SYSTEM_RULES}\n\n${builtPrompt.prompt}` },
    { role: 'user', content: `${contextBlock}${blocoDocAnterior}\n\nGere o texto para a seção "${secao}" do ${documentoTipo}.\nObjeto: ${insightContext.objeto}` },
  ]

  // 3. Chamar AI Gateway (Haiku 80%, Sonnet 15%, Opus 5%)
  const tier = selectTier(documentoTipo, secao)
  let model = tierToModel(tier)

  // Verificar cache KV
  const cacheKey = `acma:${processoId}:${documentoTipo}:${secao}:${iteracao}`
  const cached = await env.CACHE.get(cacheKey)
  let cacheHit = false

  let textoSugerido: string
  let tokensInput = 0
  let tokensOutput = 0

  if (cached) {
    textoSugerido = cached
    cacheHit = true
  } else {
    // Cadeia de fallback: modelo primário → modelos alternativos
    // Se o modelo selecionado falhar, tenta o próximo na cadeia
    const fallbackChain = buildFallbackChain(model)
    let modeloUsado = model
    let lastError: unknown = null

    for (const candidateModel of fallbackChain) {
      try {
        const aiResponse = await env.AI.run(candidateModel as Parameters<Ai['run']>[0], {
          messages,
          max_tokens: 2000,
          temperature: 0.3,
        }) as { response?: string; usage?: { prompt_tokens: number; completion_tokens: number } }

        textoSugerido = aiResponse.response || ''
        tokensInput = aiResponse.usage?.prompt_tokens || 0
        tokensOutput = aiResponse.usage?.completion_tokens || 0
        modeloUsado = candidateModel
        lastError = null
        break
      } catch (err) {
        lastError = err
        console.warn(`Fallback LLM: ${candidateModel} falhou, tentando próximo`)
        continue
      }
    }

    if (lastError) {
      throw new Error(`Todos os modelos falharam na cadeia de fallback: ${fallbackChain.join(' → ')}`)
    }

    model = modeloUsado

    // Cachear resultado (1h TTL)
    await env.CACHE.put(cacheKey, textoSugerido, { expirationTtl: 3600 })
  }

  const latenciaMs = Date.now() - startTime

  // Sanitizar resposta — Part 19: nunca vazar dados internos
  textoSugerido = sanitizeResponse(textoSugerido)

  return {
    processo_id: processoId,
    documento_tipo: documentoTipo,
    secao,
    texto_sugerido: textoSugerido,
    resumo: `Texto gerado para ${secao} do ${documentoTipo} (iteração ${iteracao})`,
    secoes_geradas: [secao],
    prompt_hash: builtPrompt.prompt_hash,
    prompt_versao: builtPrompt.versao,
    modelo_usado: model,
    tier,
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    latencia_ms: latenciaMs,
    padroes_injetados: builtPrompt.padroes_injetados,
    cache_hit: cacheHit,
    iteracao,
  }
}

// ─── 3. DESIGN_LAW — Geração de PDF ─────────────────────────────────────────
// Determinístico, ZERO LLM. Carrega YAML → template → PDF.

export async function callDesignLaw(
  processoId: string,
  documentoTipo: string,
  textoAprovado: string,
  insightContext: EnrichedContext,
  versao: number,
  env: Env,
): Promise<ArtefatoDesignLaw> {
  // 1. Carregar parâmetros do órgão (logo, brasão, dados)
  const parametros = insightContext.parametros_orgao || {}

  // 2. Montar dados para template
  const templateData: Record<string, unknown> = {
    processo_id: processoId,
    documento_tipo: documentoTipo,
    texto: textoAprovado,
    versao,
    // Dados do Insight Engine
    precos_referencia: insightContext.precos_referencia,
    dados_municipio: insightContext.dados_municipio,
    normativos_aplicaveis: insightContext.normativos_aplicaveis,
    // Parâmetros do órgão (identidade visual)
    ...parametros,
    // Selo: placeholder até auditoria
    selo_aprovado: false,
    selo_placeholder: true,
    // Metadados
    data_geracao: new Date().toISOString(),
    versao_template: 'v8',
    hash_conteudo: await hashContent(textoAprovado),
  }

  // 3. Gerar HTML a partir de template + dados
  // Em produção: usa Jinja2-like ou Handlebars no Workers
  const html = renderTemplate(documentoTipo, templateData)

  // 4. Gerar hash SHA-256 do documento
  const hashSha256 = await hashContent(html)

  // 5. Upload para R2
  const r2Key = `processos/${processoId}/documentos/${documentoTipo}_v${versao}_${hashSha256.slice(0, 8)}.html`
  await env.DOCUMENTS.put(r2Key, html, {
    customMetadata: {
      processo_id: processoId,
      documento_tipo: documentoTipo,
      versao: String(versao),
      hash: hashSha256,
      gerado_em: new Date().toISOString(),
    },
  })

  return {
    processo_id: processoId,
    documento_tipo: documentoTipo,
    url: r2Key,
    hash_sha256: hashSha256,
    versao,
    tamanho_bytes: new TextEncoder().encode(html).length,
    paginas: estimatePages(html),
    selo_placeholder: true,
    gerado_em: new Date().toISOString(),
  }
}

// ─── 4. AUDITOR — Auditoria de Conformidade ────────────────────────────────
// Híbrido: LLM interpreta + lookup fundamenta + fórmula decide.

export async function callAuditor(
  processoId: string,
  documentoTipo: string,
  documentoUrl: string,
  documentoHash: string,
  insightContext: EnrichedContext,
  env: Env,
): Promise<ParecerAuditor> {
  const startTime = Date.now()
  const setor = insightContext.perfil_usuario?.segmento_principal || undefined

  // 1. Carregar thresholds calibrados
  const thresholds = await loadCalibratedThresholds(
    documentoTipo,
    setor,
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
  )

  // 2. Carregar documento do R2
  const docObject = await env.DOCUMENTS.get(documentoUrl)
  const docContent = docObject ? await docObject.text() : ''

  // 3. Definir checklist items por tipo de documento
  const checklistTemplate = getChecklistTemplate(documentoTipo)

  // 4. Para cada check: LLM interpreta → lookup fundamenta → fórmula decide
  const checklist: AuditorCheckItem[] = []
  let totalPeso = 0
  let pesoConformes = 0
  let tokensInput = 0
  let tokensOutput = 0

  for (const checkItem of checklistTemplate) {
    const threshold = thresholds.get(checkItem.id)
    const severidade = threshold?.severidade || checkItem.defaultSeveridade
    const peso = threshold?.peso || checkItem.defaultPeso

    // LLM interpreta conformidade — Claude Sonnet (tier GERACAO)
    // NOTA: AUDITOR é crítico para conformidade legal.
    // Llama 3.1 8B substituído por Claude Sonnet 4.5 (maior acurácia jurídica).
    const auditorModel = tierToModel('sonnet')
    // Documento: até 8000 chars (seções relevantes cabem em ~6k tokens)
    const docSlice = docContent.slice(0, 8000)
    const aiResult = await env.AI.run(auditorModel as Parameters<Ai['run']>[0], {
      messages: [
        {
          role: 'system',
          content: `${ATA360_SYSTEM_RULES}\n\nVocê é um auditor de conformidade para licitações públicas brasileiras (Lei 14.133/2021).
Analise se o documento atende ao requisito. Responda APENAS com JSON:
{"conforme": true/false, "achado": "descrição se não conforme ou null", "fundamentacao": "artigo/norma"}`,
        },
        {
          role: 'user',
          content: `Requisito: ${checkItem.descricao}\n\nDocumento (${documentoTipo}):\n${docSlice}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.1,
    }) as { response?: string; usage?: { prompt_tokens: number; completion_tokens: number } }

    tokensInput += aiResult.usage?.prompt_tokens || 0
    tokensOutput += aiResult.usage?.completion_tokens || 0

    let conforme = true
    let achado: string | null = null
    let fundamentacao: string | null = null

    try {
      const parsed = JSON.parse(aiResult.response || '{}')
      conforme = parsed.conforme ?? false
      achado = parsed.achado ?? null
      fundamentacao = parsed.fundamentacao ?? null
    } catch {
      // Se LLM retornar lixo, considerar NÃO conforme (fail-safe conservador)
      // Melhor exigir revisão humana do que aprovar documento irregular
      conforme = false
      achado = 'Falha na análise automatizada — revisão manual necessária'
    }

    totalPeso += peso
    if (conforme) pesoConformes += peso

    checklist.push({
      id: checkItem.id,
      descricao: checkItem.descricao,
      conforme,
      achado,
      fundamentacao,
      severidade,
    })
  }

  // 5. Calcular score (0-100) via fórmula determinística
  const score = totalPeso > 0 ? Math.round((pesoConformes / totalPeso) * 100) : 100

  // 6. Determinar veredicto via tripartição
  const naoConformeCriticos = checklist.filter(c => !c.conforme && c.severidade === 'critica')
  const naoConformeAltos = checklist.filter(c => !c.conforme && c.severidade === 'alta')
  const naoConformes = checklist.filter(c => !c.conforme)

  let veredicto: ParecerAuditor['veredicto']
  if (naoConformeCriticos.length > 0 || score < 50) {
    veredicto = AUDITOR_VERDICTS.NAO_CONFORME
  } else if (naoConformeAltos.length > 0 || naoConformes.length > 2 || score < 80) {
    veredicto = AUDITOR_VERDICTS.RESSALVAS
  } else {
    veredicto = AUDITOR_VERDICTS.CONFORME
  }

  // 7. Selo preliminar (será recalculado após decisão do usuário)
  const seloAprovado = calcularSeloAprovado(veredicto, null)

  const latenciaMs = Date.now() - startTime

  // 8. Checklist público (Part 19: sem severidade/pesos)
  const checklistPublico = checklist.map(c => ({
    id: c.id,
    descricao: c.descricao,
    conforme: c.conforme,
    achado: c.achado,
    fundamentacao: c.fundamentacao,
  }))

  // 9. Thresholds usados (Part 19: interno)
  const thresholdsUsados: Record<string, { severidade: string; peso: number }> = {}
  for (const [checkId, th] of thresholds) {
    thresholdsUsados[checkId] = th
  }

  return {
    processo_id: processoId,
    documento_tipo: documentoTipo,
    veredicto,
    score,
    checklist,
    selo_aprovado: seloAprovado,
    iteracao: 1,
    checklist_publico: checklistPublico,
    thresholds_usados: thresholdsUsados,
    modelo_usado: tierToModel('sonnet'),
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    latencia_ms: latenciaMs,
  }
}

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Consulta preços de referência no PNCP e calcula estatísticas completas.
 *
 * Metodologia conforme IN SEGES 65/2021 (Art. 5º-8º) + TCU Acórdão 1.445/2015-P:
 *   - Média aritmética, mediana, desvio padrão de Bessel (n-1)
 *   - Coeficiente de variação (CV) — >25% = alta dispersão
 *   - IQR para detecção e remoção de outliers (Tukey's fences)
 *   - Fórmulas transparentes para inserção no artefato (PDF)
 *
 * @see IN SEGES 65/2021 — Pesquisa de preços
 * @see TCU Acórdão 1.445/2015-Plenário — Metodologia de preços
 */
async function fetchPrecos(
  objeto: string,
  env: Env,
): Promise<EnrichedContext['precos_referencia']> {
  try {
    const response = await fetch(
      `${env.PNCP_BASE_URL || 'https://pncp.gov.br/api'}/consulta/v1/itens?q=${encodeURIComponent(objeto)}&limite=30`,
    )
    if (!response.ok) return null

    const data = await response.json() as Array<{ descricao: string; codigoCatmat: string; valorUnitario: number }>
    if (!data || data.length === 0) return null

    const precos = data.map(item => item.valorUnitario).filter(p => p > 0)
    if (precos.length === 0) return null

    const sorted = [...precos].sort((a, b) => a - b)
    const n = sorted.length

    // Quartis (interpolação linear)
    const quartil = (arr: number[], q: number): number => {
      const pos = (arr.length - 1) * q
      const base = Math.floor(pos)
      const rest = pos - base
      return base + 1 < arr.length ? (arr[base] ?? 0) + rest * ((arr[base + 1] ?? 0) - (arr[base] ?? 0)) : (arr[base] ?? 0)
    }

    const q1 = quartil(sorted, 0.25)
    const q3 = quartil(sorted, 0.75)
    const iqr = q3 - q1

    // Remover outliers via IQR (Tukey's fences)
    const limInf = q1 - 1.5 * iqr
    const limSup = q3 + 1.5 * iqr
    const semOutliers = sorted.filter(p => p >= limInf && p <= limSup)
    const outliersRemovidos = n - semOutliers.length

    const dados = semOutliers.length >= 2 ? semOutliers : sorted
    const nFinal = dados.length

    // Média aritmética
    const soma = dados.reduce((a, b) => a + b, 0)
    const media = soma / nFinal

    // Mediana
    const mediana: number = nFinal % 2 === 0
      ? ((dados[nFinal / 2 - 1] ?? 0) + (dados[nFinal / 2] ?? 0)) / 2
      : (dados[Math.floor(nFinal / 2)] ?? 0)

    // Desvio padrão amostral (Bessel: n-1)
    const somaQ = dados.reduce((acc, v) => acc + Math.pow(v - media, 2), 0)
    const dp = nFinal > 1 ? Math.sqrt(somaQ / (nFinal - 1)) : 0

    // Coeficiente de variação (%)
    const cv = media > 0 ? (dp / media) * 100 : 0

    const r = (v: number) => Math.round(v * 100) / 100

    return {
      media: r(media),
      mediana: r(mediana),
      menor: r(dados[0] ?? 0),
      maior: r(dados[nFinal - 1] ?? 0),
      fontes: data.length,
      desvio_padrao: r(dp),
      coeficiente_variacao: r(cv),
      iqr: r(iqr),
      q1: r(q1),
      q3: r(q3),
      outliers_removidos: outliersRemovidos,
      formula_media: `Média = Σ(preços) / ${nFinal} = R$ ${r(media).toFixed(2)}`,
      formula_mediana: nFinal % 2 === 0
        ? `Mediana = (V${nFinal / 2} + V${nFinal / 2 + 1}) / 2 = R$ ${r(mediana).toFixed(2)}`
        : `Mediana = V${Math.ceil(nFinal / 2)} = R$ ${r(mediana).toFixed(2)}`,
      formula_desvio: `σ = √[Σ(xi-x̄)²/(n-1)] = R$ ${r(dp).toFixed(2)} | CV = ${r(cv).toFixed(1)}%${cv > 25 ? ' ⚠ ALTA DISPERSÃO' : ''}`,
      itens: data.slice(0, 10).map(item => ({
        descricao: item.descricao || '',
        catmat: item.codigoCatmat || '',
        preco: item.valorUnitario || 0,
        fonte: 'PNCP',
      })),
    }
  } catch {
    return null
  }
}

async function fetchMunicipio(
  orgaoId: string,
  env: Env,
): Promise<EnrichedContext['dados_municipio']> {
  try {
    // Buscar dados do órgão no Supabase (tem UF e município)
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }

    const orgaoResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orgaos?id=eq.${orgaoId}&select=nome,uf,municipio`,
      { headers },
    )

    if (!orgaoResponse.ok) return null
    const [orgao] = await orgaoResponse.json() as Array<{ nome: string; uf: string; municipio: string }>
    if (!orgao) return null

    // Buscar dados IBGE
    const ibgeResponse = await fetch(
      `${env.IBGE_BASE_URL || 'https://servicodados.ibge.gov.br'}/api/v1/localidades/municipios/${encodeURIComponent(orgao.municipio)}`,
    )

    if (!ibgeResponse.ok) {
      return {
        nome: orgao.municipio,
        uf: orgao.uf,
        populacao: null,
        pib_per_capita: null,
        idh: null,
        codigo_ibge: '',
      }
    }

    const ibgeData = await ibgeResponse.json() as { id: number; nome: string }
    return {
      nome: ibgeData.nome || orgao.municipio,
      uf: orgao.uf,
      populacao: null,
      pib_per_capita: null,
      idh: null,
      codigo_ibge: String(ibgeData.id || ''),
    }
  } catch {
    return null
  }
}

/**
 * Consulta sanções ativas contra o órgão nos cadastros federais.
 *
 * Fontes consultadas (Portal da Transparência):
 * - CEIS: Cadastro de Empresas Inidôneas e Suspensas
 * - CNEP: Cadastro Nacional de Empresas Punidas (Lei 12.846/2013)
 *
 * @see https://portaldatransparencia.gov.br/api-de-dados
 * @see Spec v8 Part 3.2 — Insight Engine (APIs governamentais)
 */
async function fetchSancoes(
  orgaoId: string,
  env: Env,
): Promise<EnrichedContext['sancoes']> {
  try {
    // 1. Buscar CNPJ do órgão no Supabase
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }
    const orgaoResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orgaos?id=eq.${orgaoId}&select=cnpj`,
      { headers },
    )
    if (!orgaoResponse.ok) return []
    const [orgao] = await orgaoResponse.json() as Array<{ cnpj: string }>
    if (!orgao?.cnpj) return []

    const cnpjLimpo = orgao.cnpj.replace(/[^\d]/g, '')
    const sancoes: EnrichedContext['sancoes'] = []

    const portalHeaders = {
      'Accept': 'application/json',
      'chave-api-dados': env.PORTAL_TRANSPARENCIA_KEY || '',
    }

    // 2. Consultar CEIS (Cadastro de Empresas Inidôneas e Suspensas)
    const ceisResponse = await fetch(
      `https://api.portaldatransparencia.gov.br/api-de-dados/ceis?cnpjSancionado=${cnpjLimpo}&pagina=1&tamanhoPagina=5`,
      { headers: portalHeaders },
    )
    if (ceisResponse.ok) {
      const ceisData = await ceisResponse.json() as Array<{
        dataInicioSancao: string
        dataFimSancao: string
        tipoSancao: { descricaoTipoSancao: string }
        fonteSancao: { nomeExibicaoFonteSancao: string }
      }>
      for (const item of ceisData || []) {
        sancoes.push({
          tipo: `CEIS — ${item.tipoSancao?.descricaoTipoSancao || 'Impedimento'}`,
          razao_social: cnpjLimpo,
          fundamentacao: `Fonte: ${item.fonteSancao?.nomeExibicaoFonteSancao || 'Portal Transparência'} | Vigência: ${item.dataInicioSancao || 'N/D'} a ${item.dataFimSancao || 'N/D'}`,
        })
      }
    }

    // 3. Consultar CNEP (Cadastro Nacional de Empresas Punidas)
    const cnepResponse = await fetch(
      `https://api.portaldatransparencia.gov.br/api-de-dados/cnep?cnpjSancionado=${cnpjLimpo}&pagina=1&tamanhoPagina=5`,
      { headers: portalHeaders },
    )
    if (cnepResponse.ok) {
      const cnepData = await cnepResponse.json() as Array<{
        dataInicioSancao: string
        dataFimSancao: string
        tipoSancao: { descricaoTipoSancao: string }
      }>
      for (const item of cnepData || []) {
        sancoes.push({
          tipo: `CNEP — ${item.tipoSancao?.descricaoTipoSancao || 'Punição Lei 12.846'}`,
          razao_social: cnpjLimpo,
          fundamentacao: `Lei 12.846/2013 (Lei Anticorrupção) | Vigência: ${item.dataInicioSancao || 'N/D'} a ${item.dataFimSancao || 'N/D'}`,
        })
      }
    }

    return sancoes
  } catch {
    // Falha na consulta — retornar vazio (não bloquear pipeline)
    return []
  }
}

/**
 * Consulta jurisprudência relevante do TCU para o objeto e tipo de documento.
 *
 * Busca contextualizada: combina o objeto da contratação com termos
 * específicos do tipo de documento para maximizar relevância.
 *
 * @see https://pesquisa.apps.tcu.gov.br
 * @see Spec v8 Part 3.2 — Insight Engine (jurisprudência)
 */
async function fetchJurisprudencia(
  objeto: string,
  documentoTipo: string,
  _env: Env,
): Promise<EnrichedContext['jurisprudencia']> {
  try {
    // Construir query de busca contextualizada por tipo de documento
    // Cada tipo de documento tem termos TCU relevantes
    const termosContexto: Record<string, string> = {
      ETP: 'estudo técnico preliminar planejamento contratação',
      TR: 'termo de referência especificação técnica',
      DFD: 'documento de formalização de demanda justificativa',
      PP: 'pesquisa de preços referência mercado IN 65',
      JCD: 'justificativa contratação direta dispensa inexigibilidade',
      MR: 'mapa de riscos gestão contratual',
      PCA: 'plano de contratações anual planejamento',
      ARP: 'ata registro de preços adesão carona',
    }
    const contexto = termosContexto[documentoTipo] || 'contratação pública Lei 14.133'
    const query = `${objeto} ${contexto}`.trim().slice(0, 200)

    // Consultar API de Jurisprudência TCU
    const response = await fetch(
      `https://pesquisa.apps.tcu.gov.br/rest/jurisprudencia?termo=${encodeURIComponent(query)}&ordenacao=RELEVANCIA&limit=5`,
      { headers: { 'Accept': 'application/json' } },
    )

    if (!response.ok) return []

    const data = await response.json() as {
      items?: Array<{
        numAcordao?: string
        anoAcordao?: number
        ementa?: string
        relator?: string
        colegiado?: string
      }>
    }

    if (!data.items || !Array.isArray(data.items)) return []

    return data.items.slice(0, 5).map((item, index) => ({
      numero: item.numAcordao || `${index + 1}`,
      ano: item.anoAcordao || new Date().getFullYear(),
      ementa: item.ementa?.slice(0, 500) || 'Ementa não disponível',
      relevancia: Math.max(0.5, 1.0 - (index * 0.1)),
    }))
  } catch {
    // Falha na consulta TCU — retornar vazio (não bloquear pipeline)
    return []
  }
}

async function fetchPerfilUsuario(
  orgaoId: string,
  env: Env,
): Promise<EnrichedContext['perfil_usuario']> {
  try {
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/perfil_usuario?orgao_id=eq.${orgaoId}&select=segmento_principal,regiao_uf,termos_frequentes,preferencias_terminologia&limit=1`,
      { headers },
    )

    if (!response.ok) return null
    const [perfil] = await response.json() as Array<{
      segmento_principal: string | null
      regiao_uf: string | null
      termos_frequentes: Array<{ termo: string; contagem: number }>
      preferencias_terminologia: Record<string, string>
    }>

    return perfil || null
  } catch {
    return null
  }
}

async function fetchParametrosOrgao(
  orgaoId: string,
  env: Env,
): Promise<Record<string, unknown> | null> {
  try {
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/parametros_orgao?orgao_id=eq.${orgaoId}&select=chave,valor`,
      { headers },
    )

    if (!response.ok) return null
    const rows = await response.json() as Array<{ chave: string; valor: unknown }>

    const params: Record<string, unknown> = {}
    for (const row of rows) {
      params[row.chave] = row.valor
    }
    return params
  } catch {
    return null
  }
}

async function fetchNormativosAplicaveis(
  documentoTipo: string,
  orgaoId: string,
  env: Env,
): Promise<EnrichedContext['normativos_aplicaveis']> {
  try {
    const headers = {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    }

    // Buscar normativos globais por categoria/setor
    const globalResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/biblioteca_legal_global?revogada=eq.false&aplicavel_lei_14133=eq.true&select=id,numero,nome,tipo&limit=20`,
      { headers },
    )

    const normativos: EnrichedContext['normativos_aplicaveis'] = []

    if (globalResponse.ok) {
      const globais = await globalResponse.json() as Array<{ id: string; numero: string; nome: string; tipo: string }>
      for (const n of globais) {
        normativos.push({
          id: n.id,
          numero: n.numero,
          nome: n.nome,
          tipo: n.tipo,
          relevancia: 'obrigatoria',
        })
      }
    }

    // Buscar normativos do órgão
    const orgaoResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/biblioteca_legal_orgao?orgao_id=eq.${orgaoId}&revogada=eq.false&select=id,numero,nome,tipo&limit=10`,
      { headers },
    )

    if (orgaoResponse.ok) {
      const locais = await orgaoResponse.json() as Array<{ id: string; numero: string; nome: string; tipo: string }>
      for (const n of locais) {
        normativos.push({
          id: n.id,
          numero: n.numero,
          nome: n.nome,
          tipo: n.tipo,
          relevancia: 'obrigatoria',
        })
      }
    }

    return normativos
  } catch {
    return []
  }
}

function buildInsightContextBlock(context: EnrichedContext): string {
  const lines: string[] = ['[DADOS OFICIAIS COLETADOS — usar como fundamentação]']

  if (context.dados_municipio) {
    lines.push(`\nMunicípio: ${context.dados_municipio.nome}/${context.dados_municipio.uf}`)
    if (context.dados_municipio.populacao) {
      lines.push(`População: ${context.dados_municipio.populacao.toLocaleString('pt-BR')}`)
    }
  }

  if (context.precos_referencia) {
    const pr = context.precos_referencia
    lines.push(`\nPreços referência (${pr.fontes} fontes, ${pr.outliers_removidos || 0} outlier(s) excluído(s)):`)
    lines.push(`  Mediana: R$ ${pr.mediana.toFixed(2)} (IN SEGES 65/2021 recomenda mediana)`)
    lines.push(`  Média: R$ ${pr.media.toFixed(2)}`)
    lines.push(`  Faixa: R$ ${pr.menor.toFixed(2)} — R$ ${pr.maior.toFixed(2)}`)
    if (pr.desvio_padrao != null) {
      lines.push(`  Desvio padrão: R$ ${pr.desvio_padrao.toFixed(2)}`)
    }
    if (pr.coeficiente_variacao != null) {
      lines.push(`  CV: ${pr.coeficiente_variacao.toFixed(1)}%${pr.coeficiente_variacao > 25 ? ' ⚠ ALTA DISPERSÃO — justificativa técnica necessária' : ''}`)
    }
    if (pr.formula_media) {
      lines.push(`  [Fórmulas] ${pr.formula_media}`)
    }
  }

  if (context.jurisprudencia.length > 0) {
    lines.push(`\nJurisprudência TCU (${context.jurisprudencia.length} acórdãos):`)
    for (const j of context.jurisprudencia.slice(0, 3)) {
      lines.push(`  Ac. ${j.numero}/${j.ano}: ${j.ementa.slice(0, 80)}...`)
    }
  }

  if (context.normativos_aplicaveis.length > 0) {
    lines.push(`\nNormativos aplicáveis:`)
    for (const n of context.normativos_aplicaveis.slice(0, 5)) {
      lines.push(`  ${n.numero} — ${n.nome}`)
    }
  }

  if (context.sancoes.length > 0) {
    lines.push(`\n⚠ ATENÇÃO: ${context.sancoes.length} sanção(ões) identificada(s)`)
  }

  return lines.join('\n')
}

/**
 * Seleção de tier baseado em complexidade do documento/seção.
 *
 * Distribuição alvo (Spec v8 Part 11):
 *   Haiku ~80%  — triagem, classificação, extração simples
 *   Sonnet ~15% — geração de texto, análise complexa
 *   Opus ~5%    — jurisprudência, decisões críticas, revisão final
 *
 * @see Spec v8 Part 11 — IA Agnostic Strategy
 */
function selectTier(documentoTipo: string, secao: string): string {
  // Opus 5%: documentos críticos que exigem análise jurídica profunda
  const opusDocs = ['JCD', 'AIA']
  const opusSections = ['fundamentacao_legal', 'enquadramento_modalidade', 'analise_juridica']
  if (opusDocs.includes(documentoTipo) || opusSections.includes(secao)) {
    return 'opus'
  }

  // Sonnet 15%: documentos complexos com seções analíticas
  const sonnetDocs = ['ETP', 'TR', 'MR', 'PP']
  const sonnetSections = ['fundamentacao', 'justificativa', 'pesquisa_precos', 'analise_risco', 'especificacao']
  if (sonnetDocs.includes(documentoTipo) && sonnetSections.includes(secao)) {
    return 'sonnet'
  }

  // Haiku 80%: default para triagem, extração, classificação
  return 'haiku'
}

/**
 * Mapeia tier lógico → modelo Cloudflare AI Gateway.
 *
 * Nomes dos modelos conforme Cloudflare AI Gateway (fev/2026):
 *   - claude-haiku-4-5-20251001 (Haiku 4.5)
 *   - claude-sonnet-4-5-20250929 (Sonnet 4.5)
 *   - claude-opus-4-6 (Opus 4.6)
 *
 * @see lib/schemas/ai-gateway.ts — AIModel, TIER_MODELS
 */
function tierToModel(tier: string): string {
  switch (tier) {
    case 'opus': return '@cf/anthropic/claude-opus-4-6'
    case 'sonnet': return '@cf/anthropic/claude-sonnet-4-5-20250929'
    case 'haiku':
    default: return '@cf/anthropic/claude-haiku-4-5-20251001'
  }
}

/**
 * Tabela de custos por 1M tokens (USD, fev/2026).
 *
 * Usada para calcular custo estimado por operação e por artefato.
 * Part 19: custos internos NUNCA expostos ao frontend.
 *
 * @see Spec v8 Part 11 — IA Agnostic Strategy
 */
const TOKEN_COSTS_PER_1M: Record<string, { input: number; output: number }> = {
  // Claude (primário)
  '@cf/anthropic/claude-haiku-4-5-20251001': { input: 0.80, output: 4.00 },
  '@cf/anthropic/claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00 },
  '@cf/anthropic/claude-opus-4-6': { input: 15.00, output: 75.00 },
  // Fallback
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gemini-2.0-flash': { input: 0.075, output: 0.30 },
  'gemini-2.0-pro': { input: 1.25, output: 5.00 },
}

/**
 * Cadeia de fallback por modelo primário.
 * Se o primário falhar (rate limit, timeout, erro), tenta o próximo.
 * Sempre inclui o modelo primário como primeiro elemento.
 *
 * @see Spec v8 Part 11 — IA Agnostic Strategy (fallback chain)
 */
function buildFallbackChain(primaryModel: string): string[] {
  const chain = [primaryModel]

  // Opus → Sonnet → Haiku (degradação graceful de capacidade)
  if (primaryModel.includes('opus')) {
    chain.push('@cf/anthropic/claude-sonnet-4-5-20250929')
    chain.push('@cf/anthropic/claude-haiku-4-5-20251001')
  }
  // Sonnet → Haiku (manter custo baixo)
  else if (primaryModel.includes('sonnet')) {
    chain.push('@cf/anthropic/claude-haiku-4-5-20251001')
  }
  // Haiku já é o mais barato — não há fallback abaixo

  return chain
}

// ─── Circuit Breaker para APIs Externas ─────────────────────────────────────
// Previne cascata de falhas quando APIs governamentais ficam indisponíveis.
// Estado em memória (reset entre deployments — aceitável para Workers).

interface CircuitState {
  failures: number
  lastFailure: number
  state: 'closed' | 'open' | 'half-open'
}

const circuitBreakers = new Map<string, CircuitState>()

const CIRCUIT_FAILURE_THRESHOLD = 5
const CIRCUIT_RESET_TIMEOUT_MS = 60_000 // 1 minuto para tentar novamente

/**
 * Executa uma chamada protegida por circuit breaker.
 * Se o circuito está aberto, rejeita imediatamente (fail fast).
 * Se está half-open, permite uma tentativa de teste.
 *
 * @param name - Identificador da API (ex: 'pncp', 'ibge', 'tcu')
 * @param fn - Função assíncrona que faz a chamada real
 * @returns Resultado da chamada ou null se o circuito está aberto
 */
export async function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  let circuit = circuitBreakers.get(name)
  if (!circuit) {
    circuit = { failures: 0, lastFailure: 0, state: 'closed' }
    circuitBreakers.set(name, circuit)
  }

  // Se o circuito está aberto, verificar se já passou o tempo de reset
  if (circuit.state === 'open') {
    if (Date.now() - circuit.lastFailure > CIRCUIT_RESET_TIMEOUT_MS) {
      circuit.state = 'half-open'
    } else {
      // Fail fast — não chamar a API
      return null
    }
  }

  try {
    const result = await fn()
    // Sucesso — resetar o circuito
    circuit.failures = 0
    circuit.state = 'closed'
    return result
  } catch (err) {
    circuit.failures++
    circuit.lastFailure = Date.now()

    if (circuit.failures >= CIRCUIT_FAILURE_THRESHOLD) {
      circuit.state = 'open'
      console.warn(`Circuit breaker ABERTO para "${name}" após ${circuit.failures} falhas consecutivas`)
    }

    throw err
  }
}

/**
 * Calcula custo estimado de uma chamada LLM em USD.
 *
 * @param modelo - Nome do modelo Cloudflare AI Gateway
 * @param tokensInput - Quantidade de tokens de entrada
 * @param tokensOutput - Quantidade de tokens de saída
 * @returns Custo em USD
 */
function calcularCustoTokens(modelo: string, tokensInput: number, tokensOutput: number): number {
  const costs = TOKEN_COSTS_PER_1M[modelo]
  if (!costs) return 0
  return (tokensInput / 1_000_000) * costs.input + (tokensOutput / 1_000_000) * costs.output
}

async function hashContent(content: string): Promise<string> {
  const data = new TextEncoder().encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function renderTemplate(documentoTipo: string, data: Record<string, unknown>): string {
  const titulo = DOCUMENT_TITLES[documentoTipo] || documentoTipo
  const texto = String(data.texto || '')
  const processoId = String(data.processo_id || '')
  const versao = String(data.versao || '1')
  const dataGeracao = String(data.data_geracao || new Date().toISOString())
  const dataFormatada = new Date(dataGeracao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Preços de referência (se disponíveis)
  const precos = data.precos_referencia as Record<string, unknown> | null
  let precosHtml = ''
  if (precos) {
    precosHtml = `
    <section class="precos">
      <h2>Pesquisa de Preços de Referência</h2>
      <table>
        <tr><th>Mediana</th><td>R$ ${Number(precos.mediana || 0).toFixed(2)}</td></tr>
        <tr><th>Média</th><td>R$ ${Number(precos.media || 0).toFixed(2)}</td></tr>
        <tr><th>Menor</th><td>R$ ${Number(precos.menor || 0).toFixed(2)}</td></tr>
        <tr><th>Maior</th><td>R$ ${Number(precos.maior || 0).toFixed(2)}</td></tr>
        <tr><th>Fontes</th><td>${precos.fontes || 'N/D'}</td></tr>
      </table>
      ${precos.formula_media ? `<p class="formula">${escapeHtml(String(precos.formula_media))}</p>` : ''}
      ${precos.formula_desvio ? `<p class="formula">${escapeHtml(String(precos.formula_desvio))}</p>` : ''}
    </section>`
  }

  // Normativos aplicáveis
  const normativos = data.normativos_aplicaveis as Array<Record<string, unknown>> | undefined
  let normativosHtml = ''
  if (normativos && normativos.length > 0) {
    const listaItems = normativos.map(n => `<li>${escapeHtml(String(n.numero || ''))} — ${escapeHtml(String(n.nome || ''))}</li>`).join('\n        ')
    normativosHtml = `
    <section class="normativos">
      <h2>Fundamentação Legal</h2>
      <ul>${listaItems}</ul>
    </section>`
  }

  // Município
  const municipio = data.dados_municipio as Record<string, unknown> | null
  let municipioHtml = ''
  if (municipio) {
    municipioHtml = `
    <section class="municipio">
      <h2>Dados do Município</h2>
      <p><strong>${escapeHtml(String(municipio.nome || ''))}</strong> — ${escapeHtml(String(municipio.uf || ''))}</p>
      ${municipio.populacao ? `<p>População: ${Number(municipio.populacao).toLocaleString('pt-BR')}</p>` : ''}
    </section>`
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(titulo)} — Processo ${escapeHtml(processoId)}</title>
  <style>
    @page { size: A4; margin: 2.5cm 2cm; }
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; max-width: 21cm; margin: 0 auto; padding: 2cm; }
    .header { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 1em; margin-bottom: 2em; }
    .header h1 { font-size: 16pt; text-transform: uppercase; letter-spacing: 0.1em; margin: 0.5em 0 0.2em; }
    .header .processo { font-size: 10pt; color: #666; }
    h2 { font-size: 13pt; margin-top: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; }
    .conteudo { text-align: justify; }
    .conteudo p { margin: 0.8em 0; text-indent: 2em; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 11pt; }
    th { background: #f5f5f5; font-weight: bold; }
    .formula { font-family: monospace; font-size: 10pt; color: #444; background: #f9f9f9; padding: 4px 8px; border-left: 3px solid #ccc; }
    .normativos ul { list-style: none; padding: 0; }
    .normativos li { padding: 4px 0; border-bottom: 1px dotted #eee; font-size: 11pt; }
    .footer { margin-top: 3em; padding-top: 1em; border-top: 1px solid #ccc; font-size: 9pt; color: #888; text-align: center; }
    .selo { display: inline-block; padding: 4px 12px; border: 2px solid #ccc; border-radius: 4px; font-size: 9pt; color: #888; margin-top: 0.5em; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body data-documento-tipo="${escapeHtml(documentoTipo)}" data-versao="${escapeHtml(versao)}">
  <div class="header">
    <h1>${escapeHtml(titulo)}</h1>
    <p class="processo">Processo: ${escapeHtml(processoId)} | Versão: ${escapeHtml(versao)} | ${escapeHtml(dataFormatada)}</p>
  </div>

  <div class="conteudo">
    ${texto.split('\n').map(p => p.trim() ? `<p>${escapeHtml(p)}</p>` : '').join('\n    ')}
  </div>

  ${precosHtml}
  ${normativosHtml}
  ${municipioHtml}

  <div class="footer">
    <p>Documento gerado eletronicamente pelo ATA360 — ${escapeHtml(dataFormatada)}</p>
    <div class="selo">${data.selo_placeholder ? 'SELO PENDENTE — Aguardando auditoria' : 'SELO APROVADO'}</div>
    <p>Lei 14.133/2021 | Template v8 | Hash: ${escapeHtml(String(data.hash_conteudo || '').slice(0, 16))}</p>
  </div>
</body>
</html>`
}

const DOCUMENT_TITLES: Record<string, string> = {
  ETP: 'Estudo Técnico Preliminar',
  TR: 'Termo de Referência',
  DFD: 'Documento de Formalização de Demanda',
  PP: 'Pesquisa de Preços',
  JCD: 'Justificativa de Contratação Direta',
  MR: 'Mapa de Riscos',
  ARP: 'Ata de Registro de Preços',
  CDF: 'Cadastro de Fornecedores',
  ALF: 'Análise de Licitação Fracassada',
  PCA: 'Plano de Contratações Anual',
  AIA: 'Análise de Impacto Ambiental',
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function estimatePages(html: string): number {
  // Estimativa: ~3000 chars por página A4
  return Math.max(1, Math.ceil(html.length / 3000))
}

// ─── Checklist Templates por Tipo de Documento ──────────────────────────────

interface ChecklistTemplateItem {
  id: string
  descricao: string
  defaultSeveridade: string
  defaultPeso: number
}

function getChecklistTemplate(documentoTipo: string): ChecklistTemplateItem[] {
  const templates: Record<string, ChecklistTemplateItem[]> = {
    ETP: [
      { id: 'etp_001', descricao: 'Descrição da necessidade (Art. 18, I)', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'etp_002', descricao: 'Alinhamento ao PCA/PGC', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'etp_003', descricao: 'Análise de soluções disponíveis', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'etp_004', descricao: 'Estimativa de custos', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'etp_005', descricao: 'Análise de riscos', defaultSeveridade: 'media', defaultPeso: 2.0 },
      { id: 'etp_006', descricao: 'Declaração de viabilidade', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'etp_007', descricao: 'Sustentabilidade (Dec. 7.746/2012)', defaultSeveridade: 'media', defaultPeso: 2.0 },
    ],
    TR: [
      { id: 'tr_001', descricao: 'Especificação técnica (Art. 40, I)', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'tr_002', descricao: 'Fundamentação legal', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'tr_003', descricao: 'Critérios de aceitação', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'tr_004', descricao: 'Obrigações das partes', defaultSeveridade: 'media', defaultPeso: 2.0 },
      { id: 'tr_005', descricao: 'Penalidades e sanções', defaultSeveridade: 'media', defaultPeso: 2.0 },
      { id: 'tr_006', descricao: 'Prazo e condições de pagamento', defaultSeveridade: 'alta', defaultPeso: 3.0 },
    ],
    DFD: [
      { id: 'dfd_001', descricao: 'Justificativa da necessidade', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'dfd_002', descricao: 'Referência ao PCA', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'dfd_003', descricao: 'Quantitativos estimados', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'dfd_004', descricao: 'Responsável pela demanda', defaultSeveridade: 'media', defaultPeso: 2.0 },
    ],
    PP: [
      { id: 'pp_001', descricao: 'Metodologia de pesquisa (IN 65/2021)', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'pp_002', descricao: 'Mínimo 3 fontes de preço', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'pp_003', descricao: 'Prioridade: PNCP/Compras.gov', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'pp_004', descricao: 'Análise de outliers', defaultSeveridade: 'media', defaultPeso: 2.0 },
      { id: 'pp_005', descricao: 'Valor estimado calculado', defaultSeveridade: 'critica', defaultPeso: 5.0 },
    ],
    JCD: [
      { id: 'jcd_001', descricao: 'Fundamentação legal (Art. 72)', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'jcd_002', descricao: 'Enquadramento correto da modalidade', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'jcd_003', descricao: 'Valores dentro dos limites (Dec. 12.807)', defaultSeveridade: 'critica', defaultPeso: 5.0 },
      { id: 'jcd_004', descricao: 'Referência ao ETP', defaultSeveridade: 'alta', defaultPeso: 3.0 },
      { id: 'jcd_005', descricao: 'LINDB considerada', defaultSeveridade: 'media', defaultPeso: 2.0 },
    ],
  }

  // Default genérico para tipos sem template específico
  return templates[documentoTipo] || [
    { id: 'gen_001', descricao: 'Fundamentação legal', defaultSeveridade: 'critica', defaultPeso: 5.0 },
    { id: 'gen_002', descricao: 'Dados oficiais referenciados', defaultSeveridade: 'alta', defaultPeso: 3.0 },
    { id: 'gen_003', descricao: 'Conformidade Lei 14.133/2021', defaultSeveridade: 'critica', defaultPeso: 5.0 },
    { id: 'gen_004', descricao: 'Completude do documento', defaultSeveridade: 'media', defaultPeso: 2.0 },
  ]
}
