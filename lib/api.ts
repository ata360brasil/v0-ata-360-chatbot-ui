/**
 * API Client — fetch wrapper type-safe para Workers + AI Gateway.
 *
 * BFF Pattern: Frontend → Next.js API Route → Cloudflare Workers
 * Nunca chama Workers diretamente do browser (segurança + CORS).
 *
 * @see Guillermo Rauch — BFF pattern para Next.js
 * @see Cloudflare AI Gateway — multi-model routing
 */
import { z } from 'zod'
import { logger, withSpan } from '@/lib/observability'

// ─── Config ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''
const DEFAULT_TIMEOUT = 30_000

// ─── Error Types ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Core Fetch ─────────────────────────────────────────────────────────────

interface FetchOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  schema?: z.ZodSchema<T>
  timeout?: number
  headers?: Record<string, string>
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions<T> = {},
): Promise<T> {
  const { method = 'GET', body, schema, timeout = DEFAULT_TIMEOUT, headers = {} } = options

  return withSpan(`api.${method.toLowerCase()}.${path}`, async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new ApiError(
          errorBody.message ?? `HTTP ${response.status}`,
          response.status,
          errorBody.code,
          errorBody.details,
        )
      }

      const data = await response.json()

      // Validação runtime com Zod (Colinhacks best practice)
      if (schema) {
        const parsed = schema.safeParse(data)
        if (!parsed.success) {
          logger.error('API response validation failed', {
            path,
            errors: parsed.error.flatten(),
          })
          throw new ApiError('Response validation failed', 422, 'VALIDATION_ERROR', parsed.error.flatten())
        }
        return parsed.data
      }

      return data as T
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT')
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'NETWORK_ERROR',
      )
    }
  })
}

// ─── Process API ────────────────────────────────────────────────────────────

export const processo = {
  criar: (data: { objeto: string; tipo_documento?: string; modalidade?: string }) =>
    apiFetch<{ id: string; numero: string; modalidade: string; trilha: string[]; documento_atual: string | null }>('/api/processo', {
      method: 'POST',
      body: data,
    }),

  status: (id: string) =>
    apiFetch<{
      id: string
      numero: string
      objeto: string
      estado: string
      fase: string
      modalidade: string
      iteracao: number
      documento_atual: string | null
      parecer_auditor: {
        veredicto: string
        score: number
        checklist: Array<{ id: string; descricao: string; conforme: boolean; achado: string | null; fundamentacao: string | null }>
        selo_aprovado: boolean
        iteracao: number
      } | null
      selo_aprovado: boolean
      proximo_sugerido: string | null
      sugestao_acma: {
        texto_sugerido: string
        resumo: string
        secoes_geradas: string[]
        iteracao: number
      } | null
      documento: { url: string; hash: string | null; versao: number } | null
      trilha: Array<{ tipo: string; status: string; versao: number | null; selo_aprovado: boolean | null }>
      trilha_stats: { total: number; concluidos: number; pendentes: number; progresso_percentual: number; selos_aprovados: number }
      sugestoes_restantes: number
      reauditorias_restantes: number
    }>(`/api/processo/${id}/status`),

  decisao: (id: string, acao: 'APROVAR' | 'EDITAR' | 'NOVA_SUGESTAO' | 'PROSSEGUIR' | 'DESCARTAR', textoEditado?: string) =>
    apiFetch<{
      sucesso: boolean
      novo_estado: string
      sugestao_acma?: { texto_sugerido: string; resumo: string; secoes_geradas: string[]; iteracao: number }
      parecer_auditor?: { veredicto: string; score: number; checklist: unknown[]; selo_aprovado: boolean; iteracao: number }
      artefato?: { url: string; hash: string; versao: number }
      trilha?: Array<{ tipo: string; status: string }>
      proximo_documento?: string | null
      mensagem: string
      erro?: string
    }>(`/api/processo/${id}/decisao`, {
      method: 'POST',
      body: { acao, texto_editado: textoEditado },
    }),

  documento: (id: string) =>
    apiFetch<{ url: string; hash: string; versao: number }>(`/api/processo/${id}/documento`),

  historico: (id: string) =>
    apiFetch<{ versoes: Array<{ versao: number; hash: string; created_at: string }> }>(
      `/api/processo/${id}/historico`,
    ),

  insights: (id: string) =>
    apiFetch<{
      cards: Array<{
        tipo: string
        titulo: string
        descricao: string
        fonte: string
        dados?: Record<string, unknown>
        relevancia: number
      }>
    }>(`/api/processo/${id}/insights`),

  trilha: (id: string) =>
    apiFetch<{
      trilha: Array<{
        tipo: string
        status: string
        versao: number | null
        hash: string | null
        selo_aprovado: boolean | null
        finalizado_em: string | null
      }>
      stats: { total: number; concluidos: number; pendentes: number; progresso_percentual: number; selos_aprovados: number }
      documento_atual: string | null
      posicao: number
    }>(`/api/processo/${id}/trilha`),

  mensagens: (id: string, params?: { limit?: number; offset?: number }) =>
    apiFetch<{
      mensagens: Array<{
        id: string
        role: string
        content: string
        artifact: Record<string, unknown> | null
        insight_cards: unknown[] | null
        estado: string
        timestamp: string
      }>
    }>(`/api/processo/${id}/mensagens?limit=${params?.limit || 50}&offset=${params?.offset || 0}`),
}

// ─── Chat API ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  artifact?: {
    tipo: string
    dados: Record<string, unknown>
  } | null
  insight_cards?: Array<{
    tipo: string
    titulo: string
    descricao: string
    fonte: string
    dados?: Record<string, unknown>
  }>
}

export const chat = {
  enviar: (processoId: string, mensagem: string) =>
    apiFetch<ChatMessage>(`/api/processo/${processoId}/chat`, {
      method: 'POST',
      body: { mensagem },
      timeout: 60_000, // IA pode demorar
    }),

  stream: (processoId: string, mensagem: string) => {
    // Server-Sent Events para streaming de respostas IA
    const url = `${BASE_URL}/api/processo/${processoId}/chat/stream`
    return new EventSource(`${url}?mensagem=${encodeURIComponent(mensagem)}`)
  },
}

// ─── Audit API ──────────────────────────────────────────────────────────────

export const audit = {
  flush: (events: unknown[]) =>
    apiFetch<{ received: number }>('/api/audit', {
      method: 'POST',
      body: { events },
    }),
}

// ─── Normalize API ─────────────────────────────────────────────────────────

export const normalize = {
  texto: (data: {
    texto: string
    setor_orgao?: string
    regiao_uf?: string
    incluir_catmat?: boolean
    incluir_precos?: boolean
  }) =>
    apiFetch<{
      texto_original: string
      texto_normalizado: string
      pipeline_aplicado: Array<{
        camada: string
        texto_entrada: string
        texto_saida: string
        transformacao: string | null
        confianca: number
        detalhes?: Record<string, unknown>
      }>
      catmat_sugeridos: Array<{
        codigo: string
        tipo: 'catmat' | 'catser'
        descricao: string
        assertividade: number
        fonte: string
      }>
      alertas: Array<{
        tipo: string
        mensagem: string
        sugestao: string | null
        base_legal?: string
      }>
      cache_hit: boolean
      duracao_ms: number
    }>('/api/normalize', {
      method: 'POST',
      body: data,
      timeout: 15_000, // normalização é rápida
    }),

  health: () =>
    apiFetch<{
      status: 'ok' | 'degraded'
      d1_termos?: number
      vectorize?: boolean
      ai_gateway?: boolean
      message?: string
    }>('/api/normalize/health'),
}

// ─── Feedback API ──────────────────────────────────────────────────────────

export const feedback = {
  enviarTermo: (data: {
    processo_id?: string
    termo_original: string
    termo_normalizado_sistema: string
    catmat_sugerido_sistema?: string
    termo_corrigido_usuario?: string
    catmat_corrigido_usuario?: string
    tipo_feedback: 'correcao_termo' | 'correcao_catmat' | 'aprovacao' | 'rejeicao'
    setor?: string
    regiao_uf?: string
    confianca_original?: number
  }) =>
    apiFetch<{ sucesso: boolean; feedback: unknown }>('/api/feedback', {
      method: 'POST',
      body: data,
    }),

  stats: () =>
    apiFetch<{
      total: number
      pendentes: number
      validados: number
      propagados: number
      rejeitados: number
      top_correcoes: Array<{
        termo_original: string
        termo_corrigido: string
        total_usuarios: number
      }>
    }>('/api/feedback'),
}

// ─── Avaliações API ────────────────────────────────────────────────────────

export const avaliacoes = {
  fornecedor: (data: {
    contrato_numero: string
    fornecedor_cnpj: string
    fornecedor_nome: string
    objeto_contrato?: string
    processo_id?: string
    nota_fornecedor: number
    nota_entrega: number
    nota_qualidade: number
    nota_relacionamento: number
    observacao?: string
    recomendaria?: boolean
    periodo_avaliado?: string
  }) =>
    apiFetch<{ sucesso: boolean; avaliacao: unknown }>('/api/avaliacoes?tipo=fornecedor', {
      method: 'POST',
      body: data,
    }),

  plataforma: (data: {
    nps_score: number
    nota_geral: number
    nota_facilidade?: number
    nota_velocidade?: number
    nota_precisao?: number
    nota_documentos?: number
    comentario?: string
    sugestao?: string
    areas_melhoria?: string[]
    duracao_sessao_minutos?: number
    documentos_gerados?: number
    pesquisas_realizadas?: number
  }) =>
    apiFetch<{ sucesso: boolean; avaliacao: unknown }>('/api/avaliacoes?tipo=plataforma', {
      method: 'POST',
      body: data,
    }),

  resposta: (data: {
    processo_id?: string
    mensagem_id?: string
    agente: string
    tipo_resposta?: string
    nota: number
    tipo_feedback: string
    comentario?: string
    correcao_sugerida?: string
  }) =>
    apiFetch<{ sucesso: boolean; avaliacao: unknown }>('/api/avaliacoes?tipo=resposta', {
      method: 'POST',
      body: data,
    }),

  artefato: (data: {
    processo_id?: string
    documento_id?: string
    tipo_documento: string
    versao?: number
    nota_geral: number
    nota_precisao_juridica?: number
    nota_clareza?: number
    nota_completude?: number
    nota_formatacao?: number
    decisao: string
    percentual_edicao?: number
    comentario?: string
    secoes_editadas?: string[]
    iteracao?: number
  }) =>
    apiFetch<{ sucesso: boolean; avaliacao: unknown }>('/api/avaliacoes?tipo=artefato', {
      method: 'POST',
      body: data,
    }),

  dashboard: () =>
    apiFetch<{
      nps: unknown[]
      fornecedores: unknown[]
      respostas: unknown[]
      artefatos: unknown[]
      comentarios: unknown[]
    }>('/api/avaliacoes'),
}

// ─── ACMA Learning API ────────────────────────────────────────────────────

export const acma = {
  registrarSugestao: (data: {
    processo_id: string
    documento_tipo: string
    secao: string
    texto_sugerido: string
    texto_final?: string
    decisao: 'APROVAR' | 'EDITAR' | 'NOVA_SUGESTAO' | 'DESCARTAR'
    rating?: number
    modelo_usado?: string
    tier?: string
    iteracao?: number
  }) =>
    apiFetch<{ sucesso: boolean; sugestao_id: string; edit_delta?: unknown }>('/api/acma/sugestao', {
      method: 'POST',
      body: data,
    }),

  rating: (data: { sugestao_id: string; rating: number }) =>
    apiFetch<{ sucesso: boolean }>('/api/acma/rating', {
      method: 'POST',
      body: data,
    }),

  performance: (params?: { documento_tipo?: string; semanas?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.documento_tipo) searchParams.set('documento_tipo', params.documento_tipo)
    if (params?.semanas) searchParams.set('semanas', String(params.semanas))
    const qs = searchParams.toString()
    return apiFetch<{
      performance: Array<{
        documento_tipo: string
        secao: string
        semana: string
        total_sugestoes: number
        aprovadas: number
        editadas: number
        descartadas: number
        taxa_aprovacao: number
        edit_ratio_medio: number
        rating_medio: number | null
      }>
      padroes: Array<{
        documento_tipo: string
        secao: string
        padrao_original: string
        padrao_corrigido: string
        frequencia: number
        confianca: number
      }>
    }>(`/api/acma/performance${qs ? `?${qs}` : ''}`)
  },
}

// ─── AUDITOR Learning API ─────────────────────────────────────────────────

export const auditor = {
  registrarResultado: (data: {
    processo_id: string
    documento_tipo: string
    veredicto: 'CONFORME' | 'RESSALVAS' | 'NAO_CONFORME'
    score: number
    checklist: Array<{ id: string; descricao: string; conforme: boolean; achado: string | null }>
    selo_aprovado: boolean
    decisao_usuario?: string
    setor?: string
    iteracao?: number
  }) =>
    apiFetch<{ sucesso: boolean; resultado_id: string }>('/api/auditor/resultado', {
      method: 'POST',
      body: data,
    }),

  conformidade: (params?: { documento_tipo?: string; meses?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.documento_tipo) searchParams.set('documento_tipo', params.documento_tipo)
    if (params?.meses) searchParams.set('meses', String(params.meses))
    const qs = searchParams.toString()
    return apiFetch<{
      conformidade: Array<{
        documento_tipo: string
        setor: string | null
        mes: string
        total_auditorias: number
        conformes: number
        ressalvas: number
        nao_conformes: number
        taxa_conformidade: number
        score_medio: number
        selos_aprovados: number
      }>
    }>(`/api/auditor/conformidade${qs ? `?${qs}` : ''}`)
  },
}

// ─── Profile API ──────────────────────────────────────────────────────────

export const profile = {
  carregar: () =>
    apiFetch<{
      segmento_principal: string | null
      segmentos_secundarios: string[]
      termos_frequentes: Array<{ termo: string; contagem: number }>
      preferencias_terminologia: Record<string, string>
      regiao_uf: string | null
      temas_recorrentes: string[]
      documentos_mais_gerados: string[]
    }>('/api/profile'),

  atualizar: (data: {
    segmento_principal?: string | null
    preferencias_terminologia?: Record<string, string>
    regiao_uf?: string | null
  }) =>
    apiFetch<{ sucesso: boolean }>('/api/profile', {
      method: 'PATCH',
      body: data,
    }),

  learn: (textos: string[]) =>
    apiFetch<{ atualizado: boolean; segmento_detectado?: string }>('/api/profile', {
      method: 'POST',
      body: { textos },
    }),
}

// ─── PNCP API (via Workers) ────────────────────────────────────────────────

export const pncp = {
  buscarItens: (termo: string, params?: { pagina?: number; limite?: number }) =>
    apiFetch<{
      itens: Array<{ descricao: string; catmat: string; preco_medio: number; fonte: string }>
      total: number
    }>(`/api/pncp/itens?termo=${encodeURIComponent(termo)}&pagina=${params?.pagina ?? 1}&limite=${params?.limite ?? 20}`),

  atasVigentes: (catmat: string) =>
    apiFetch<{
      atas: Array<{ orgao: string; preco: number; validade: string; saldo: number }>
    }>(`/api/pncp/atas?catmat=${encodeURIComponent(catmat)}`),

  precosReferencia: (catmat: string) =>
    apiFetch<{
      media: number
      mediana: number
      menor: number
      maior: number
      fontes: number
    }>(`/api/pncp/precos/${encodeURIComponent(catmat)}`),
}

// ─── Insight Engine API ─────────────────────────────────────────────────────

export const insight = {
  cards: (processoId: string) =>
    apiFetch<{
      cards: Array<{
        tipo: 'preco' | 'arp' | 'emenda' | 'jurisprudencia' | 'alerta' | 'recurso' | 'sancao' | 'indice'
        titulo: string
        descricao: string
        fonte: string
        dados?: Record<string, unknown>
        relevancia: number
      }>
    }>(`/api/processo/${processoId}/insights`),
}

// ─── SERPRO API (17 serviços via Workers) ─────────────────────────────────

export const serpro = {
  cnpj: (cnpj: string) =>
    apiFetch<{ cnpj: string; razao_social: string; situacao_cadastral: string; porte: string | null }>(`/api/serpro/cnpj/${encodeURIComponent(cnpj)}`),

  cpf: (cpf: string) =>
    apiFetch<{ cpf: string; nome: string; situacao_cadastral: string }>(`/api/serpro/cpf/${encodeURIComponent(cpf)}`),

  cnd: (cnpj: string) =>
    apiFetch<{ situacao: string; data_validade: string; numero_certidao: string | null }>(`/api/serpro/cnd/${encodeURIComponent(cnpj)}`),

  dividaAtiva: (cnpj: string) =>
    apiFetch<{ total_divida: number; inscricoes: Array<{ numero: string; valor: number; situacao: string }> }>(`/api/serpro/divida-ativa/${encodeURIComponent(cnpj)}`),

  datavalid: (cpf: string, dados: Record<string, unknown>) =>
    apiFetch<{ nome_valido: boolean; data_nascimento_valida: boolean }>('/api/serpro/datavalid', {
      method: 'POST',
      body: { cpf, ...dados },
    }),

  carimboTempo: (hash: string, documentoId: string) =>
    apiFetch<{ timestamp: string; assinatura_tempo: string; tsa_serial: string }>('/api/serpro/carimbo-tempo', {
      method: 'POST',
      body: { hash_sha256: hash, documento_id: documentoId },
    }),

  neoSigner: (documentoId: string) =>
    apiFetch<{ assinatura: string; certificado_emissor: string; valido_ate: string }>('/api/serpro/neosigner', {
      method: 'POST',
      body: { documento_id: documentoId },
    }),
}

// ─── Government APIs (via Workers proxy) ──────────────────────────────────

export const gov = {
  // Portal Transparência — sanções (CEIS, CNEP, CEPIM, CEAF)
  sancoes: (cnpj: string) =>
    apiFetch<{ sancoes: Array<{ tipo: string; razao_social: string; fundamentacao: string }> }>(`/api/gov/sancoes/${encodeURIComponent(cnpj)}`),

  // TransfereGov — convênios
  convenios: (municipioIbge: string) =>
    apiFetch<{ convenios: Array<{ numero: string; situacao: string; valor_global: number }> }>(`/api/gov/convenios/${encodeURIComponent(municipioIbge)}`),

  // IBGE — dados do município
  municipio: (codigoIbge: string) =>
    apiFetch<{ nome: string; uf: string; populacao: number | null; pib_per_capita: number | null; idh: number | null }>(`/api/gov/ibge/${encodeURIComponent(codigoIbge)}`),

  // TCU — jurisprudência
  acordaos: (termo: string, params?: { pagina?: number }) =>
    apiFetch<{ acordaos: Array<{ numero: string; ano: number; ementa: string; relevancia: number }> }>(`/api/gov/tcu/acordaos?termo=${encodeURIComponent(termo)}&pagina=${params?.pagina ?? 1}`),

  // BCB — índices econômicos (IPCA, IGP-M, Selic, Dólar)
  indice: (serie: 'IPCA' | 'IGPM' | 'SELIC' | 'DOLAR') =>
    apiFetch<{ serie: string; valor: number; data: string }>(`/api/gov/bcb/${serie.toLowerCase()}`),

  // SICONFI / Tesouro — dados fiscais do ente
  siconfi: (municipioIbge: string, exercicio: number) =>
    apiFetch<{ receita_corrente_liquida: number | null; despesa_pessoal_percentual: number | null }>(`/api/gov/siconfi/${encodeURIComponent(municipioIbge)}/${exercicio}`),

  // FNS — repasses saúde
  fnsRepasses: (municipioIbge: string) =>
    apiFetch<{ repasses: Array<{ bloco: string; valor: number; competencia: string; status: string }> }>(`/api/gov/fns/${encodeURIComponent(municipioIbge)}`),

  // FNDE — programas educação
  fndeProgramas: (municipioIbge: string) =>
    apiFetch<{ programas: Array<{ programa: string; valor_previsto: number; valor_repassado: number }> }>(`/api/gov/fnde/${encodeURIComponent(municipioIbge)}`),

  // Radar de Recursos (cruzamento de todas as fontes)
  radarRecursos: (municipioIbge: string) =>
    apiFetch<{
      recursos: Array<{
        fonte: string
        descricao: string
        valor: number
        status: string
        data_limite: string | null
        acao_sugerida: string | null
      }>
      totais: {
        disponivel: number
        em_risco: number
        subutilizado: number
      }
    }>(`/api/gov/radar/${encodeURIComponent(municipioIbge)}`),
}

// ─── Dashboard Metrics API ────────────────────────────────────────────────

export const dashboard = {
  metrics: () =>
    apiFetch<{
      kpis: {
        nps_score: number
        acma_taxa_aprovacao: number
        acma_total_sugestoes: number
        auditor_taxa_conformidade: number
        auditor_total_auditorias: number
        feedback_total: number
        feedback_propagados: number
      }
      nps: Array<{ mes: string; promotores: number; neutros: number; detratores: number; total: number; nps: number }>
      fornecedores: Array<{ fornecedor_cnpj: string; fornecedor_nome: string; total_avaliacoes: number; nota_media: number }>
      agentes: Array<{ agente: string; tipo_resposta: string; semana: string; total: number; nota_media: number; taxa_aprovacao: number }>
      artefatos: Array<{ tipo_documento: string; mes: string; total: number; nota_media: number; aprovados_direto: number; aprovados_editados: number; rejeitados: number }>
      acma_performance: unknown[]
      auditor_conformidade: unknown[]
      feedback: { total: number; pendentes: number; validados: number; propagados: number }
      segmentos: Array<{ segmento: string; total: number }>
      comentarios: Array<{ nps_score: number; nota_geral: number; comentario: string; created_at: string }>
    }>('/api/dashboard'),

  summary: () =>
    apiFetch<{
      total_processos: number
      total_documentos: number
      total_usuarios: number
      total_orgaos: number
    }>('/api/dashboard?view=summary'),
}

// ─── Publication API ──────────────────────────────────────────────────────

export const publication = {
  publicar: (data: {
    processo_id: string
    documento_id: string
    assinar?: boolean
    carimbar?: boolean
    publicar_pncp?: boolean
  }) =>
    apiFetch<{
      sucesso: boolean
      etapas: Record<string, { status: string; detalhes?: unknown }>
      erros: string[]
    }>('/api/publicar', {
      method: 'POST',
      body: {
        ...data,
        assinar: data.assinar ?? true,
        carimbar: data.carimbar ?? true,
        publicar_pncp: data.publicar_pncp ?? false,
      },
    }),
}

// ─── PCA Inteligente API ─────────────────────────────────────────────────

export const pca = {
  obter: (orgaoId: string, exercicio: number) =>
    apiFetch<{
      plano: {
        id: string
        exercicio: number
        status: string
        origem: string
        total_itens: number
        valor_total_estimado: number
        confianca_sugestao: number | null
      }
      itens: Array<{
        id: string
        numero_item: number
        descricao: string
        catmat_catser: string | null
        tipo: string
        setor_requisitante: string | null
        valor_total_estimado: number | null
        mes_previsto: number | null
        prioridade: string
        modalidade_sugerida: string | null
        status: string
        recorrente: boolean
        confianca: number | null
      }>
    }>(`/api/pca/${orgaoId}/${exercicio}`),

  sugerir: (orgaoId: string, exercicio: number) =>
    apiFetch<{
      sucesso: boolean
      plano_id: string
      total_itens: number
      valor_total: number
      fontes_consultadas: string[]
      confianca_geral: number
      mensagem: string
    }>('/api/pca/sugerir', {
      method: 'POST',
      body: { orgao_id: orgaoId, exercicio },
    }),

  conciliar: (pcaId: string, orgaoId: string) =>
    apiFetch<{
      sucesso: boolean
      itens_vinculados: number
      itens_sem_processo: number
      processos_sem_pca: number
      sugestoes_atualizacao: Array<{
        item_id: string
        tipo: string
        descricao: string
      }>
    }>('/api/pca/conciliar', {
      method: 'POST',
      body: { pca_id: pcaId, orgao_id: orgaoId },
    }),

  vincular: (processoId: string, objeto: string) =>
    apiFetch<{
      sucesso: boolean
      item_vinculado: string | null
      mensagem: string
    }>('/api/pca/vincular', {
      method: 'POST',
      body: { processo_id: processoId, objeto },
    }),
}

// ─── Prazos e Alertas API ────────────────────────────────────────────────

export const prazos = {
  listar: (orgaoId: string, params?: { status?: string; processo_id?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.processo_id) searchParams.set('processo_id', params.processo_id)
    const qs = searchParams.toString()
    return apiFetch<{
      prazos: Array<{
        id: string
        tipo: string
        descricao: string
        data_limite: string
        nivel_alerta: string
        destinatario_tipo: string
        base_legal: string | null
        status: string
        processo_id: string | null
      }>
    }>(`/api/prazos/${orgaoId}${qs ? `?${qs}` : ''}`)
  },

  alertas: (orgaoId: string, params?: { nao_lidos?: boolean }) =>
    apiFetch<{
      alertas: Array<{
        id: string
        tipo: string
        nivel: string
        titulo: string
        mensagem: string
        destinatario_tipo: string
        lido: boolean
        created_at: string
      }>
    }>(`/api/prazos/${orgaoId}/alertas${params?.nao_lidos ? '?lido=false' : ''}`),

  criar: (data: {
    orgao_id: string
    tipo: string
    descricao: string
    data_limite: string
    processo_id?: string
    destinatario_tipo?: string
    base_legal?: string
    dias_legais?: number
  }) =>
    apiFetch<{ sucesso: boolean; prazo_id: string }>('/api/prazos', {
      method: 'POST',
      body: data,
    }),

  criarProcesso: (data: {
    processo_id: string
    orgao_id: string
    modalidade: string
    criado_por?: string
  }) =>
    apiFetch<{ sucesso: boolean; prazos_criados: number }>('/api/prazos/processo', {
      method: 'POST',
      body: data,
    }),

  marcarLido: (alertaId: string) =>
    apiFetch<{ sucesso: boolean }>(`/api/prazos/${alertaId}/lido`, {
      method: 'PATCH',
    }),
}

// ─── Compliance e Integridade API ────────────────────────────────────────

export const compliance = {
  programa: (orgaoId: string) =>
    apiFetch<{
      programa: {
        id: string
        comprometimento_lideranca: boolean
        instancia_responsavel: boolean
        analise_riscos: boolean
        regras_instrumentos: boolean
        monitoramento_continuo: boolean
        codigo_conduta: boolean
        canal_denuncias: boolean
        due_diligence: boolean
        certificacao_pro_etica_cgu: boolean
        certificacao_abes: boolean
        certificacao_tcu_diamante: boolean
        certificacao_tce_mg: boolean
        politica_anticorrupcao: boolean
        politica_diversidade: boolean
        politica_teletrabalho: boolean
        politica_lgpd: boolean
        politica_esg: boolean
        esg_ambiental_score: number | null
        esg_social_score: number | null
        esg_governanca_score: number | null
        ods_atendidos: number[] | null
        nivel_maturidade: string
        score_integridade: number | null
      } | null
    }>(`/api/compliance/${orgaoId}`),

  avaliar: (orgaoId: string) =>
    apiFetch<{
      score: number
      nivel: string
      gaps: string[]
      recomendacoes: string[]
      esg: {
        ambiental: number
        social: number
        governanca: number
        geral: number
        classificacao: string
      }
    }>('/api/compliance/avaliar', {
      method: 'POST',
      body: { orgao_id: orgaoId },
    }),

  riscos: (orgaoId: string) =>
    apiFetch<{
      riscos: Array<{
        id: string
        descricao: string
        categoria: string
        probabilidade: string
        impacto: string
        nivel_risco: string
        controles_existentes: string | null
        controles_recomendados: string | null
        status: string
      }>
    }>(`/api/compliance/${orgaoId}/riscos`),

  gerarRiscosPadrao: (orgaoId: string) =>
    apiFetch<{ sucesso: boolean; riscos_criados: number }>('/api/compliance/riscos/padrao', {
      method: 'POST',
      body: { orgao_id: orgaoId },
    }),

  ods: () =>
    apiFetch<{
      ods: Array<{
        numero: number
        titulo: string
        descricao: string
        contribuicao: string
        metricas: string[]
      }>
    }>('/api/compliance/ods'),
}

// ─── Ouvidoria e Canal de Denúncias API ─────────────────────────────────

export const ouvidoria = {
  criar: (data: {
    orgao_id?: string
    tipo: string
    categoria: string
    assunto: string
    descricao: string
    anonimo?: boolean
    denunciante_nome?: string
    denunciante_email?: string
    acusado_nome?: string
    acusado_cargo?: string
    acusado_orgao?: string
  }) =>
    apiFetch<{
      sucesso: boolean
      protocolo: string
      prazo_resposta: string
      mensagem: string
      instrucoes: string
    }>('/api/ouvidoria', {
      method: 'POST',
      body: data,
    }),

  consultar: (protocolo: string) =>
    apiFetch<{
      protocolo: string
      tipo: string
      categoria: string
      assunto: string
      status: string
      prioridade: string
      resposta: string | null
      respondido_em: string | null
      prazo_resposta: string
      created_at: string
    }>(`/api/ouvidoria/protocolo/${encodeURIComponent(protocolo)}`),

  listar: (orgaoId: string, params?: { status?: string; tipo?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.tipo) searchParams.set('tipo', params.tipo)
    const qs = searchParams.toString()
    return apiFetch<{
      manifestacoes: Array<{
        id: string
        protocolo: string
        tipo: string
        categoria: string
        assunto: string
        status: string
        prioridade: string
        anonimo: boolean
        created_at: string
      }>
    }>(`/api/ouvidoria/${orgaoId}${qs ? `?${qs}` : ''}`)
  },

  responder: (id: string, data: { resposta: string; status?: string }) =>
    apiFetch<{ sucesso: boolean; mensagem: string }>(`/api/ouvidoria/${id}/responder`, {
      method: 'PATCH',
      body: data,
    }),

  estatisticas: (orgaoId: string) =>
    apiFetch<{
      total: number
      por_tipo: Record<string, number>
      por_status: Record<string, number>
      por_prioridade: Record<string, number>
      taxa_resolucao: number
    }>(`/api/ouvidoria/estatisticas/${orgaoId}`),

  pedirExplicacao: (data: {
    orgao_id?: string
    processo_id?: string
    documento_tipo?: string
    pergunta: string
    contexto?: string
    solicitante_nome?: string
    solicitante_email?: string
    anonimo?: boolean
  }) =>
    apiFetch<{
      sucesso: boolean
      protocolo: string
      prazo_resposta: string
      mensagem: string
      base_legal: { pl_2338: string; lgpd: string }
    }>('/api/ouvidoria', {
      method: 'POST',
      body: {
        ...data,
        tipo: 'pedido_explicacao',
        categoria: 'explicacao_ia',
        assunto: `Pedido de explicação: ${data.documento_tipo || 'geral'}`,
        descricao: data.pergunta,
      },
    }),
}

// ─── AIA — Avaliação de Impacto Algorítmico API ────────────────────────

export const aia = {
  obter: (orgaoId: string) =>
    apiFetch<{
      avaliacoes: Array<{
        id: string
        versao: number
        data_avaliacao: string
        nivel_risco: string
        parecer_global: string | null
        sistema_nome: string
        proxima_avaliacao: string | null
        created_at: string
      }>
    }>(`/api/aia?orgaoId=${orgaoId}`),

  criar: (data: {
    orgao_id: string
    nivel_risco?: string
    sistema_versao?: string
    riscos_identificados?: Record<string, unknown>[]
    medidas_mitigacao?: Record<string, unknown>[]
    recomendacoes?: string[]
    responsavel_nome?: string
    responsavel_cargo?: string
  }) =>
    apiFetch<{
      sucesso: boolean
      avaliacao_id: string
      mensagem: string
    }>('/api/aia', {
      method: 'POST',
      body: data,
    }),

  aprovar: (avaliacaoId: string) =>
    apiFetch<{ sucesso: boolean }>(`/api/aia/${avaliacaoId}/aprovar`, {
      method: 'PATCH',
    }),

  codigoConduta: () =>
    apiFetch<{
      titulo: string
      versao: string
      data: string
      principios: Array<{
        numero: number
        titulo: string
        descricao: string
        base_legal: string
      }>
      compromissos_pbia: { itens: string[] }
      canal_explicacao: {
        prazo_dias: number
        base_legal: string
      }
    }>('/api/aia/codigo-conduta'),
}

// ─── Precificação Universal API ──────────────────────────────────────────

export const pricing = {
  simular: (params: {
    base: number
    fonte?: string
    arp_disponivel?: boolean
    emenda_disponivel?: boolean
    inovacao?: boolean
  }) => {
    const qs = new URLSearchParams()
    qs.set('base', String(params.base))
    if (params.fonte) qs.set('fonte', params.fonte)
    if (params.arp_disponivel) qs.set('arp_disponivel', 'true')
    if (params.emenda_disponivel) qs.set('emenda_disponivel', 'true')
    if (params.inovacao) qs.set('inovacao', 'true')
    return apiFetch<{
      calculo: {
        preco_anual: number
        preco_mensal_equivalente: number
        aliquota_efetiva: number
        categoria: string
        categoria_nome: string
        modalidade_recomendada: string
        modalidade_fundamento: string
        base_calculo: number
        fonte_base: string
      }
      modalidade_recomendada: {
        id: string
        nome: string
        fundamento: string
        limite_valor: number | null
        prazo_estimado: string
        documentos_obrigatorios: string[]
        quando_usar: string
        vigencia_contrato: string
        renovacao: string
      }
      vigencia_opcoes: Array<{
        duracao_anos: number
        renovavel: boolean
        renovacao_max_anos: number
        renovacao_automatica: boolean
        fundamento: string
        justificativa: string
      }>
      autocontratacao: {
        catser: string
        catser_alternativo: string
        descricao_objeto: string
        trilha_documentos: string[]
      }
    }>(`/api/pricing?view=simular&${qs.toString()}`)
  },

  tabela: () =>
    apiFetch<{
      titulo: string
      vigencia_ano: number
      parametros: Record<string, unknown>
      equacao: string
      tabela: Array<{
        orgao_descricao: string
        tipo_ente: string
        base_referencia: number
        preco_anual: number
        preco_mensal: number
        aliquota_efetiva: number
        modalidade: string
        categoria: string
      }>
      total_itens: number
      nota: string
    }>('/api/pricing?view=tabela'),

  parametros: () =>
    apiFetch<{ parametros: Record<string, unknown>; fonte: string }>('/api/pricing?view=parametros'),

  atualizarParametros: (data: {
    vigencia_ano: number
    piso?: number
    base_min?: number
    alpha?: number
    limite_dispensa?: number
  }) =>
    apiFetch<{ sucesso: boolean; mensagem: string }>('/api/pricing?action=parametros', {
      method: 'POST',
      body: data,
    }),

  categorias: () =>
    apiFetch<{
      categorias: Array<{
        id: string
        nome: string
        descricao: string
        faixa_preco_min: number
        faixa_preco_max: number
        cor: string
        icone: string
      }>
      nota: string
    }>('/api/pricing?view=categorias'),

  modalidades: () =>
    apiFetch<{
      modalidades: Array<{
        id: string
        nome: string
        fundamento: string
        limite_valor: number | null
        prazo_estimado: string
        documentos_obrigatorios: string[]
        quando_usar: string
        vigencia_contrato: string
        renovacao: string
      }>
    }>('/api/pricing?view=modalidades'),

  fpm: () =>
    apiFetch<{
      fonte: string
      faixas: Array<{
        populacao_min: number
        populacao_max: number
        coeficiente: number
        percentual_municipios: number
        quantidade_aprox: number
      }>
    }>('/api/pricing?view=fpm'),

  simularLote: (entes: Array<{ base: number; fonte?: string; descricao?: string }>) =>
    apiFetch<{
      total: number
      resultados: Array<{
        descricao: string
        base: number
        preco_anual: number
        preco_mensal_equivalente: number
        categoria: string
        modalidade_recomendada: string
      }>
    }>('/api/pricing?action=simular-lote', {
      method: 'POST',
      body: { entes },
    }),
}

// ─── Contratação do ATA360 API ───────────────────────────────────────────

export const contratacao = {
  iniciar: (data: {
    base_calculo: number
    fonte_base?: string
    modalidade_preferida?: string
    vigencia_anos?: number
    fonte_recurso?: string
    emenda_numero?: string
    arp_disponivel?: boolean
    emenda_disponivel?: boolean
  }) =>
    apiFetch<{
      sucesso: boolean
      contratacao_id: string
      simulacao_id: string
      calculo: Record<string, unknown>
      modalidade: string
      modalidade_nome: string
      fundamento_legal: string
      trilha_documentos: string[]
      catser: string
      objeto: string
      mensagem: string
    }>('/api/contratacao', {
      method: 'POST',
      body: data,
    }),

  obter: (id: string) =>
    apiFetch<{ contratacao: Record<string, unknown> }>(`/api/contratacao?id=${id}`),

  listar: (orgaoId: string) =>
    apiFetch<{
      contratacoes: Array<{
        id: string
        numero_contrato: string | null
        modalidade: string
        valor_anual: number
        status: string
        vigencia_inicio: string
        vigencia_fim: string
        created_at: string
      }>
    }>(`/api/contratacao?orgaoId=${orgaoId}`),

  atualizarStatus: (id: string, data: { status: string; observacoes?: string }) =>
    apiFetch<{ sucesso: boolean; status: string }>(`/api/contratacao?id=${id}`, {
      method: 'PATCH',
      body: data,
    }),

  autoPca: (data: {
    base_calculo: number
    fonte_base?: string
    exercicio?: number
    nome_ente?: string
    cnpj?: string
    populacao?: number
    uf?: string
  }) =>
    apiFetch<{
      sucesso: boolean
      pca_id: string
      mensagem: string
      item_pca: Record<string, unknown>
      calculo: Record<string, unknown>
      modalidade_recomendada: {
        id: string
        nome: string
        fundamento: string
        documentos: string[]
        prazo: string
      }
      trilha_documentos: string[]
      proxima_etapa: string
    }>('/api/contratacao?action=auto-pca', {
      method: 'POST',
      body: data,
    }),
}

// ─── Adesão a ARP API ─────────────────────────────────────────────────

export const adesaoArp = {
  iniciar: (data: {
    ata_numero: string
    ata_pncp_id?: string
    ata_vigencia_inicio?: string
    ata_vigencia_fim?: string
    gerenciador_nome: string
    gerenciador_cnpj?: string
    gerenciador_uasg?: string
    fornecedor_nome?: string
    fornecedor_cnpj?: string
    itens: Array<{ descricao: string; catmat?: string; catser?: string; quantidade: number; valor_unitario: number }>
    email_gerenciador?: string
    email_fornecedor?: string
  }) =>
    apiFetch<{
      sucesso: boolean
      adesao_id: string
      status: string
      valor_total: number
      link_gerenciador: string
      link_fornecedor: string
      links_expiram_em: string
      etapas: Array<{ num: number; nome: string; descricao: string; status: string }>
      documentos_a_gerar: string[]
      mensagem: string
    }>('/api/adesao-arp', {
      method: 'POST',
      body: data,
    }),

  obter: (id: string) =>
    apiFetch<{ adesao: Record<string, unknown> }>(`/api/adesao-arp?id=${id}`),

  listar: (orgaoId: string) =>
    apiFetch<{
      adesoes: Array<{
        id: string
        ata_numero: string
        gerenciador_nome: string
        status: string
        valor_total: number | null
        created_at: string
      }>
    }>(`/api/adesao-arp?orgaoId=${orgaoId}`),

  atualizarStatus: (id: string, data: { status: string; percentual_utilizado?: number; saldo_disponivel?: number }) =>
    apiFetch<{ sucesso: boolean; status: string }>(`/api/adesao-arp?id=${id}`, {
      method: 'PATCH',
      body: data,
    }),

  respostaExterna: (adesaoId: string, data: {
    token: string
    tipo: 'gerenciador' | 'fornecedor'
    aprovado: boolean
    observacoes?: string
    nome_responsavel?: string
    cargo_responsavel?: string
  }) =>
    apiFetch<{
      sucesso: boolean
      status: string
      mensagem: string
    }>(`/api/adesao-arp?action=resposta-externa&adesaoId=${adesaoId}`, {
      method: 'POST',
      body: data,
    }),
}
