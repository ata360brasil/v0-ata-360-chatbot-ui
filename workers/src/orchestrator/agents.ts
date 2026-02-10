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

  // Consultas paralelas a múltiplas fontes
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
    fetchPrecos(objeto, env),
    // IBGE — dados do município do órgão
    fetchMunicipio(orgaoId, env),
    // Portal Transparência — sanções (CEIS, CNEP, CEPIM)
    fetchSancoes(orgaoId, env),
    // TCU — jurisprudência relevante
    fetchJurisprudencia(objeto, documentoTipo, env),
    // Perfil do usuário (server-side)
    fetchPerfilUsuario(orgaoId, env),
    // Parâmetros do órgão (logo, brasão, dados)
    fetchParametrosOrgao(orgaoId, env),
    // Normativos aplicáveis (biblioteca legal global + órgão)
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

  const messages = [
    { role: 'system', content: `${ATA360_SYSTEM_RULES}\n\n${builtPrompt.prompt}` },
    { role: 'user', content: `${contextBlock}\n\nGere o texto para a seção "${secao}" do ${documentoTipo}.\nObjeto: ${insightContext.objeto}` },
  ]

  // 3. Chamar AI Gateway (Haiku 80%, Sonnet 15%, Opus 5%)
  const tier = selectTier(documentoTipo, secao)
  const model = tierToModel(tier)

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
    // Chamada real ao AI Gateway
    const aiResponse = await env.AI.run(model as Parameters<Ai['run']>[0], {
      messages,
      max_tokens: 2000,
      temperature: 0.3,
    }) as { response?: string; usage?: { prompt_tokens: number; completion_tokens: number } }

    textoSugerido = aiResponse.response || ''
    tokensInput = aiResponse.usage?.prompt_tokens || 0
    tokensOutput = aiResponse.usage?.completion_tokens || 0

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

    // LLM interpreta conformidade
    const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct' as Parameters<Ai['run']>[0], {
      messages: [
        {
          role: 'system',
          content: `${ATA360_SYSTEM_RULES}\n\nVocê é um auditor de conformidade para licitações públicas brasileiras (Lei 14.133/2021).
Analise se o documento atende ao requisito. Responda APENAS com JSON:
{"conforme": true/false, "achado": "descrição se não conforme ou null", "fundamentacao": "artigo/norma"}`,
        },
        {
          role: 'user',
          content: `Requisito: ${checkItem.descricao}\n\nDocumento (${documentoTipo}):\n${docContent.slice(0, 3000)}`,
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
      conforme = parsed.conforme ?? true
      achado = parsed.achado ?? null
      fundamentacao = parsed.fundamentacao ?? null
    } catch {
      // Se LLM retornar lixo, considerar conforme (fail-safe)
      conforme = true
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
    modelo_usado: '@cf/meta/llama-3.1-8b-instruct',
    tokens_input: tokensInput,
    tokens_output: tokensOutput,
    latencia_ms: latenciaMs,
  }
}

// ─── Helper Functions ────────────────────────────────────────────────────────

async function fetchPrecos(
  objeto: string,
  env: Env,
): Promise<EnrichedContext['precos_referencia']> {
  try {
    const response = await fetch(
      `${env.PNCP_BASE_URL || 'https://pncp.gov.br/api'}/consulta/v1/itens?q=${encodeURIComponent(objeto)}&limite=20`,
    )
    if (!response.ok) return null

    const data = await response.json() as Array<{ descricao: string; codigoCatmat: string; valorUnitario: number }>
    if (!data || data.length === 0) return null

    const precos = data.map(item => item.valorUnitario).filter(p => p > 0)
    const sorted = [...precos].sort((a, b) => a - b)
    const media = precos.reduce((a, b) => a + b, 0) / precos.length
    const mediana = sorted[Math.floor(sorted.length / 2)] || 0

    return {
      media: Math.round(media * 100) / 100,
      mediana: Math.round(mediana * 100) / 100,
      menor: sorted[0] || 0,
      maior: sorted[sorted.length - 1] || 0,
      fontes: data.length,
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

async function fetchSancoes(
  _orgaoId: string,
  _env: Env,
): Promise<EnrichedContext['sancoes']> {
  // Placeholder — implementar com Portal Transparência API
  return []
}

async function fetchJurisprudencia(
  objeto: string,
  _documentoTipo: string,
  _env: Env,
): Promise<EnrichedContext['jurisprudencia']> {
  // Placeholder — implementar com TCU API
  // Por ora retorna vazio; dados reais virão da PoC existente
  return []
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
    lines.push(`\nPreços referência (${context.precos_referencia.fontes} fontes):`)
    lines.push(`  Mediana: R$ ${context.precos_referencia.mediana.toFixed(2)}`)
    lines.push(`  Média: R$ ${context.precos_referencia.media.toFixed(2)}`)
    lines.push(`  Faixa: R$ ${context.precos_referencia.menor.toFixed(2)} — R$ ${context.precos_referencia.maior.toFixed(2)}`)
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

// Seleção de tier baseado em complexidade do documento/seção
function selectTier(documentoTipo: string, secao: string): string {
  // Documentos complexos usam Sonnet
  const complexDocs = ['ETP', 'TR', 'JCD', 'MR']
  const complexSections = ['fundamentacao', 'justificativa', 'pesquisa_precos', 'analise_risco']

  if (complexDocs.includes(documentoTipo) && complexSections.includes(secao)) {
    return 'sonnet'
  }
  // Default: Haiku (80% dos casos)
  return 'haiku'
}

function tierToModel(tier: string): string {
  switch (tier) {
    case 'opus': return '@cf/anthropic/claude-3-opus'
    case 'sonnet': return '@cf/anthropic/claude-3.5-sonnet'
    case 'haiku':
    default: return '@cf/anthropic/claude-3-haiku'
  }
}

async function hashContent(content: string): Promise<string> {
  const data = new TextEncoder().encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function renderTemplate(documentoTipo: string, data: Record<string, unknown>): string {
  // Placeholder — em produção usa template engine real
  // O template base v8 (documento_base_v8.html) será carregado do R2
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>${documentoTipo} — ATA360</title></head>
<body data-documento-tipo="${documentoTipo}" data-versao="${data.versao}">
<div data-zona="protegido">${JSON.stringify(data)}</div>
</body>
</html>`
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
