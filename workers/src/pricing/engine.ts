/**
 * ATA360 — Motor de Precificação Universal
 *
 * Equação: Preco Anual = max(PISO, PISO × (BASE / BASE_MIN) ^ alpha)
 *
 * Princípios:
 * 1. Transparência: fórmula pública, verificável, reproduzível
 * 2. Proporcionalidade: maior capacidade fiscal → maior valor absoluto, menor alíquota
 * 3. Universalidade: mesma equação para todos os tipos de ente público
 * 4. Equidade: entes da mesma cidade pagam conforme SUA capacidade
 * 5. Verificabilidade: bases de cálculo são dados públicos (PNCP, LOA, FPM, FPE)
 *
 * NÃO são planos fixos. Preço é variável, calculado individualmente.
 * 5 categorias são apenas para IDENTIFICAÇÃO de grupos no sistema.
 *
 * Tabela imprimível APENAS pelo SuperADM.
 * Reajuste automático via parâmetros globais (Decreto anual + DN TCU).
 *
 * @see Decreto 12.807/2025 — Limite de dispensa 2026
 * @see Decreto-Lei 1.881/1981 — Coeficientes FPM
 * @see DN TCU 219/2025 — Coeficientes FPM 2026
 * @see Lei 14.133/2021 — Art. 74 (inexigibilidade), Art. 75 (dispensa)
 * @see LC 198/2023 — Proteção de coeficientes FPM
 */

// ─── Parâmetros Globais (reajustáveis anualmente pelo SuperADM) ─────────────

export interface PricingParams {
  piso: number              // Valor mínimo anual (R$)
  base_min: number          // Menor base fiscal de referência (R$)
  alpha: number             // Expoente de escala (0 < alpha < 1)
  limite_dispensa: number   // Limite Art. 75, II (atualizado por Decreto anual)
  vigencia_ano: number      // Ano de vigência
  atualizado_em: string     // ISO date da última atualização
}

export const PRICING_PARAMS_2026: PricingParams = {
  piso: 38_900,
  base_min: 5_000_000,
  alpha: 0.35,
  limite_dispensa: 65_492.11,
  vigencia_ano: 2026,
  atualizado_em: '2026-01-01',
}

// ─── Tipos de Ente Público ──────────────────────────────────────────────────

export type TipoEnte =
  | 'prefeitura'
  | 'camara_municipal'
  | 'autarquia_municipal'
  | 'autarquia_estadual'
  | 'fundacao'
  | 'empresa_publica'
  | 'consorcio'
  | 'governo_estadual'
  | 'tribunal_justica'
  | 'tribunal_contas'
  | 'ministerio_publico'
  | 'defensoria'
  | 'universidade'
  | 'instituto_federal'
  | 'hospital_publico'
  | 'secretaria_saude'
  | 'seguranca_defesa'
  | 'sistema_s'
  | 'orgao_federal'
  | 'agencia_reguladora'
  | 'outro'

// ─── Hierarquia de Base de Cálculo ──────────────────────────────────────────

export type FonteBase = 'pncp_contratacoes' | 'orcamento_loa' | 'proxy_fiscal'

export interface BaseCalculo {
  valor: number
  fonte: FonteBase
  fonte_url?: string
  data_referencia: string
  verificavel: boolean
}

export const FONTE_PRIMARIA_POR_TIPO: Record<TipoEnte, { primaria: FonteBase; subsidiaria: FonteBase; fonte_verificavel: string }> = {
  prefeitura: { primaria: 'pncp_contratacoes', subsidiaria: 'proxy_fiscal', fonte_verificavel: 'pncp.gov.br / tesouro.fazenda.gov.br' },
  camara_municipal: { primaria: 'orcamento_loa', subsidiaria: 'proxy_fiscal', fonte_verificavel: 'Portal Transparência municipal' },
  autarquia_municipal: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / Portal Transparência' },
  autarquia_estadual: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'Portal Transparência estadual' },
  fundacao: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / Portal Transparência' },
  empresa_publica: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / CVM / Portal' },
  consorcio: { primaria: 'orcamento_loa', subsidiaria: 'proxy_fiscal', fonte_verificavel: 'Portal Transparência / LOA consórcio' },
  governo_estadual: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / SIOP' },
  tribunal_justica: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'Portal Transparência / CNJ' },
  tribunal_contas: { primaria: 'orcamento_loa', subsidiaria: 'pncp_contratacoes', fonte_verificavel: 'Portal do TCE / Transparência' },
  ministerio_publico: { primaria: 'orcamento_loa', subsidiaria: 'pncp_contratacoes', fonte_verificavel: 'Portal MP / CNMP' },
  defensoria: { primaria: 'orcamento_loa', subsidiaria: 'pncp_contratacoes', fonte_verificavel: 'Portal Defensoria / Transparência' },
  universidade: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / MEC' },
  instituto_federal: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / MEC' },
  hospital_publico: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / CNES' },
  secretaria_saude: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / FNS' },
  seguranca_defesa: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / Portal Transparência' },
  sistema_s: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'Portal TCU / Portal próprio' },
  orgao_federal: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / SIOP' },
  agencia_reguladora: { primaria: 'pncp_contratacoes', subsidiaria: 'orcamento_loa', fonte_verificavel: 'pncp.gov.br / SIOP' },
  outro: { primaria: 'orcamento_loa', subsidiaria: 'proxy_fiscal', fonte_verificavel: 'Portal Transparência' },
}

// ─── 5 Categorias de Identificação (NÃO são planos fixos) ──────────────────

export type CategoriaEnte = 'essencial' | 'basico' | 'intermediario' | 'avancado' | 'enterprise'

export interface CategoriaConfig {
  id: CategoriaEnte
  nome: string
  descricao: string
  faixa_preco_min: number
  faixa_preco_max: number
  cor: string
  icone: string
}

/**
 * Categorias são APENAS para identificação visual e agrupamento no sistema.
 * O preço REAL é calculado individualmente pela equação universal.
 * Faixas são atualizadas automaticamente quando parâmetros mudam.
 */
export function getCategorias(params: PricingParams): CategoriaConfig[] {
  return [
    {
      id: 'essencial',
      nome: 'Essencial',
      descricao: 'Municípios pequenos, câmaras, unidades menores',
      faixa_preco_min: params.piso,
      faixa_preco_max: params.piso,
      cor: '#10B981',
      icone: 'shield',
    },
    {
      id: 'basico',
      nome: 'Básico',
      descricao: 'Municípios até 50 mil hab, autarquias pequenas, consórcios menores',
      faixa_preco_min: params.piso + 1,
      faixa_preco_max: params.limite_dispensa,
      cor: '#3B82F6',
      icone: 'building',
    },
    {
      id: 'intermediario',
      nome: 'Intermediário',
      descricao: 'Municípios 50-200 mil hab, TJs médios, MPs, IFs',
      faixa_preco_min: params.limite_dispensa + 1,
      faixa_preco_max: 150_000,
      cor: '#8B5CF6',
      icone: 'landmark',
    },
    {
      id: 'avancado',
      nome: 'Avançado',
      descricao: 'Municípios 200 mil+ hab, TJs grandes, universidades federais',
      faixa_preco_min: 150_001,
      faixa_preco_max: 350_000,
      cor: '#F59E0B',
      icone: 'crown',
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      descricao: 'Capitais, metrópoles, órgãos federais, grandes tribunais',
      faixa_preco_min: 350_001,
      faixa_preco_max: Infinity,
      cor: '#EF4444',
      icone: 'globe',
    },
  ]
}

// ─── Motor de Cálculo ───────────────────────────────────────────────────────

export interface CalculoPreco {
  // Resultado
  preco_anual: number
  preco_mensal_equivalente: number
  aliquota_efetiva: number        // % da base
  // Categoria (identificação)
  categoria: CategoriaEnte
  categoria_nome: string
  // Modalidade recomendada
  modalidade_recomendada: 'dispensa' | 'inexigibilidade'
  modalidade_fundamento: string
  // Metadados
  base_calculo: number
  fonte_base: FonteBase
  parametros_usados: PricingParams
  calculado_em: string
}

/**
 * Calcula o preço anual de um ente público.
 * Fórmula: Preço = max(PISO, PISO × (BASE / BASE_MIN) ^ alpha)
 *
 * @param base - Base de cálculo do ente (R$)
 * @param fonte - Fonte da base de cálculo
 * @param params - Parâmetros de precificação (default: 2026)
 * @returns Cálculo completo com preço, categoria e modalidade
 */
export function calcularPreco(
  base: number,
  fonte: FonteBase = 'pncp_contratacoes',
  params: PricingParams = PRICING_PARAMS_2026,
): CalculoPreco {
  // Validação
  if (base <= 0) base = params.base_min

  // Equação universal
  const fator = Math.pow(base / params.base_min, params.alpha)
  const precoCalculado = params.piso * fator
  const precoAnual = Math.max(params.piso, Math.round(precoCalculado * 100) / 100)
  const precoMensal = Math.round((precoAnual / 12) * 100) / 100
  const aliquota = base > 0 ? precoAnual / base : 0

  // Determinar modalidade
  const isDispensa = precoAnual <= params.limite_dispensa
  const modalidade = isDispensa ? 'dispensa' as const : 'inexigibilidade' as const
  const fundamento = isDispensa
    ? `Dispensa de licitação — Art. 75, II, Lei 14.133/2021 (limite ${params.vigencia_ano}: R$ ${params.limite_dispensa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
    : 'Inexigibilidade — Art. 74, I, Lei 14.133/2021 (exclusividade técnica: monitoramento saldo ATA via PNCP quantidadeEmpenhada)'

  // Determinar categoria
  const categorias = getCategorias(params)
  let categoria: CategoriaEnte = 'essencial'
  let categoriaNome = 'Essencial'
  for (const cat of categorias) {
    if (precoAnual >= cat.faixa_preco_min && precoAnual <= cat.faixa_preco_max) {
      categoria = cat.id
      categoriaNome = cat.nome
      break
    }
  }

  return {
    preco_anual: precoAnual,
    preco_mensal_equivalente: precoMensal,
    aliquota_efetiva: Math.round(aliquota * 10000) / 10000,
    categoria,
    categoria_nome: categoriaNome,
    modalidade_recomendada: modalidade,
    modalidade_fundamento: fundamento,
    base_calculo: base,
    fonte_base: fonte,
    parametros_usados: params,
    calculado_em: new Date().toISOString(),
  }
}

// ─── Coeficientes FPM (DN TCU 219/2025) ─────────────────────────────────────

export interface FaixaFPM {
  populacao_min: number
  populacao_max: number
  coeficiente: number
  percentual_municipios: number
  quantidade_aprox: number
}

export const COEFICIENTES_FPM_2026: FaixaFPM[] = [
  { populacao_min: 0,       populacao_max: 10_188,  coeficiente: 0.6, percentual_municipios: 48.7, quantidade_aprox: 2707 },
  { populacao_min: 10_189,  populacao_max: 13_584,  coeficiente: 0.8, percentual_municipios: 9.7,  quantidade_aprox: 539 },
  { populacao_min: 13_585,  populacao_max: 16_980,  coeficiente: 1.0, percentual_municipios: 7.5,  quantidade_aprox: 416 },
  { populacao_min: 16_981,  populacao_max: 23_772,  coeficiente: 1.2, percentual_municipios: 10.5, quantidade_aprox: 583 },
  { populacao_min: 23_773,  populacao_max: 30_564,  coeficiente: 1.4, percentual_municipios: 5.9,  quantidade_aprox: 331 },
  { populacao_min: 30_565,  populacao_max: 37_356,  coeficiente: 1.6, percentual_municipios: 3.6,  quantidade_aprox: 203 },
  { populacao_min: 37_357,  populacao_max: 44_148,  coeficiente: 1.8, percentual_municipios: 2.4,  quantidade_aprox: 134 },
  { populacao_min: 44_149,  populacao_max: 50_940,  coeficiente: 2.0, percentual_municipios: 1.6,  quantidade_aprox: 91 },
  { populacao_min: 50_941,  populacao_max: 61_128,  coeficiente: 2.2, percentual_municipios: 1.5,  quantidade_aprox: 83 },
  { populacao_min: 61_129,  populacao_max: 71_316,  coeficiente: 2.4, percentual_municipios: 1.0,  quantidade_aprox: 57 },
  { populacao_min: 71_317,  populacao_max: 81_504,  coeficiente: 2.6, percentual_municipios: 0.7,  quantidade_aprox: 40 },
  { populacao_min: 81_505,  populacao_max: 91_692,  coeficiente: 2.8, percentual_municipios: 0.5,  quantidade_aprox: 30 },
  { populacao_min: 91_693,  populacao_max: 101_880, coeficiente: 3.0, percentual_municipios: 0.4,  quantidade_aprox: 24 },
  { populacao_min: 101_881, populacao_max: 115_464, coeficiente: 3.2, percentual_municipios: 0.4,  quantidade_aprox: 23 },
  { populacao_min: 115_465, populacao_max: 129_048, coeficiente: 3.4, percentual_municipios: 0.3,  quantidade_aprox: 14 },
  { populacao_min: 129_049, populacao_max: 142_632, coeficiente: 3.6, percentual_municipios: 0.2,  quantidade_aprox: 12 },
  { populacao_min: 142_633, populacao_max: 156_216, coeficiente: 3.8, percentual_municipios: 0.1,  quantidade_aprox: 8 },
  { populacao_min: 156_217, populacao_max: Infinity, coeficiente: 4.0, percentual_municipios: 4.9,  quantidade_aprox: 270 },
]

/**
 * Obtém o coeficiente FPM com base na população.
 */
export function getCoeficienteFPM(populacao: number): number {
  const faixa = COEFICIENTES_FPM_2026.find(
    f => populacao >= f.populacao_min && populacao <= f.populacao_max
  )
  return faixa?.coeficiente ?? 0.6
}

// ─── Modalidades de Contratação do ATA360 ───────────────────────────────────

export type ModalidadeContratacao =
  | 'dispensa'           // Art. 75, II — até R$65.492,11
  | 'inexigibilidade'    // Art. 74, I — exclusividade técnica
  | 'adesao_arp'         // Art. 86 — adesão a ATA existente
  | 'dialogo_competitivo'// Art. 32 — inovação
  | 'contratacao_inovacao'// Art. 81 — encomenda tecnológica
  | 'emenda_parlamentar' // RP6/RP7/RP8 — recursos vinculados

export interface ModalidadeInfo {
  id: ModalidadeContratacao
  nome: string
  fundamento: string
  limite_valor: number | null
  prazo_estimado: string
  documentos_obrigatorios: string[]
  quando_usar: string
  vigencia_contrato: string
  renovacao: string
}

export const MODALIDADES_CONTRATACAO: ModalidadeInfo[] = [
  {
    id: 'dispensa',
    nome: 'Dispensa Eletrônica',
    fundamento: 'Art. 75, II, Lei 14.133/2021 + Dec. 12.807/2025',
    limite_valor: 65_492.11,
    prazo_estimado: '15 a 30 dias',
    documentos_obrigatorios: ['DFD', 'ETP', 'TR', 'PP', 'JCD'],
    quando_usar: 'Preço calculado ≤ R$65.492,11 — contratação simplificada',
    vigencia_contrato: '1 ano, renovável até 5 anos (Art. 106)',
    renovacao: 'Automática com cláusula expressa (Art. 107)',
  },
  {
    id: 'inexigibilidade',
    nome: 'Inexigibilidade de Licitação',
    fundamento: 'Art. 74, I, Lei 14.133/2021 — inviabilidade de competição por exclusividade técnica',
    limite_valor: null,
    prazo_estimado: '30 a 45 dias',
    documentos_obrigatorios: ['DFD', 'ETP', 'TR', 'PP', 'JCD', 'declaracao_exclusividade'],
    quando_usar: 'Preço calculado > R$65.492,11 — justificativa técnica de exclusividade (monitoramento saldo ATA via PNCP)',
    vigencia_contrato: '1 ano, renovável até 5 anos (Art. 106) ou 10 anos TIC (Art. 107)',
    renovacao: 'Automática com cláusula expressa + justificativa continuidade',
  },
  {
    id: 'adesao_arp',
    nome: 'Adesão a Ata de Registro de Preços',
    fundamento: 'Art. 86, Lei 14.133/2021',
    limite_valor: null,
    prazo_estimado: '15 a 20 dias',
    documentos_obrigatorios: ['oficio_consulta', 'justificativa_adesao', 'declaracao_compatibilidade', 'autorizacao_gerenciador', 'aceite_fornecedor', 'termo_adesao'],
    quando_usar: 'Quando existir ATA vigente gerenciada por outro órgão — máximo 50% do total (Art. 86, §4º)',
    vigencia_contrato: 'Restante da vigência da ATA original',
    renovacao: 'Não renovável — vinculada à ATA mãe',
  },
  {
    id: 'dialogo_competitivo',
    nome: 'Diálogo Competitivo',
    fundamento: 'Art. 32, Lei 14.133/2021',
    limite_valor: null,
    prazo_estimado: '90 a 180 dias',
    documentos_obrigatorios: ['DFD', 'ETP', 'TR', 'PP', 'edital_dialogo'],
    quando_usar: 'Soluções inovadoras ou quando não há especificação técnica definida — diálogo com potenciais fornecedores',
    vigencia_contrato: '1 ano, renovável até 5 anos (Art. 106)',
    renovacao: 'Conforme condições do edital',
  },
  {
    id: 'contratacao_inovacao',
    nome: 'Contratação de Inovação (ETEC)',
    fundamento: 'Art. 81, Lei 14.133/2021 — Encomenda Tecnológica',
    limite_valor: null,
    prazo_estimado: '60 a 120 dias',
    documentos_obrigatorios: ['DFD', 'ETP', 'TR', 'justificativa_inovacao'],
    quando_usar: 'Desenvolvimento de solução inovadora sob encomenda — órgão com necessidade específica não atendida pelo mercado',
    vigencia_contrato: 'Conforme projeto (até 10 anos)',
    renovacao: 'Vinculada ao projeto',
  },
  {
    id: 'emenda_parlamentar',
    nome: 'Aquisição via Emenda Parlamentar',
    fundamento: 'EC 105/2019 + LDO vigente — emendas individuais (RP6), bancada (RP7), comissão (RP8)',
    limite_valor: null,
    prazo_estimado: '30 a 90 dias (depende do ciclo orçamentário)',
    documentos_obrigatorios: ['DFD', 'plano_trabalho', 'justificativa_destinacao', 'TR', 'PP', 'JCD'],
    quando_usar: 'Recurso de emenda parlamentar destinado à modernização de compras públicas ou transformação digital',
    vigencia_contrato: 'Conforme termo de convênio/transferência',
    renovacao: 'Depende de nova emenda ou inclusão no orçamento do ente',
  },
]

/**
 * Determina a melhor modalidade de contratação para um ente.
 * Considera preço, porte, urgência e disponibilidade de ARP.
 */
export function recomendarModalidade(
  precoAnual: number,
  params: PricingParams = PRICING_PARAMS_2026,
  opcoes?: {
    arp_disponivel?: boolean
    urgencia?: boolean
    inovacao?: boolean
    emenda_disponivel?: boolean
  },
): ModalidadeInfo {
  // Emenda parlamentar tem prioridade se disponível (recurso vinculado)
  if (opcoes?.emenda_disponivel) {
    return MODALIDADES_CONTRATACAO.find(m => m.id === 'emenda_parlamentar')!
  }

  // Adesão a ARP é a mais rápida e simplificada
  if (opcoes?.arp_disponivel) {
    return MODALIDADES_CONTRATACAO.find(m => m.id === 'adesao_arp')!
  }

  // Inovação / diálogo competitivo
  if (opcoes?.inovacao) {
    return MODALIDADES_CONTRATACAO.find(m => m.id === 'contratacao_inovacao')!
  }

  // Dispensa ou inexigibilidade pelo valor
  if (precoAnual <= params.limite_dispensa) {
    return MODALIDADES_CONTRATACAO.find(m => m.id === 'dispensa')!
  }

  return MODALIDADES_CONTRATACAO.find(m => m.id === 'inexigibilidade')!
}

// ─── Vigência e Renovação ───────────────────────────────────────────────────

export interface VigenciaContrato {
  duracao_anos: number
  renovavel: boolean
  renovacao_max_anos: number
  renovacao_automatica: boolean
  fundamento: string
  justificativa: string
}

/**
 * Calcula opções de vigência contratual.
 * TIC: até 10 anos (Art. 107, Lei 14.133). Demais: até 5 anos (Art. 106).
 */
export function calcularVigencia(modalidade: ModalidadeContratacao): VigenciaContrato[] {
  const opcoes: VigenciaContrato[] = []

  // Opção 1: 1 ano (padrão)
  opcoes.push({
    duracao_anos: 1,
    renovavel: true,
    renovacao_max_anos: 5,
    renovacao_automatica: true,
    fundamento: 'Art. 106, Lei 14.133/2021',
    justificativa: 'Contrato anual com renovação automática — menor comprometimento orçamentário',
  })

  // Opção 2: 2 anos
  opcoes.push({
    duracao_anos: 2,
    renovavel: true,
    renovacao_max_anos: 5,
    renovacao_automatica: true,
    fundamento: 'Art. 106, Lei 14.133/2021',
    justificativa: 'Contrato bianual — estabilidade com flexibilidade',
  })

  // Opção 3: 3 anos
  opcoes.push({
    duracao_anos: 3,
    renovavel: true,
    renovacao_max_anos: 5,
    renovacao_automatica: true,
    fundamento: 'Art. 106, Lei 14.133/2021',
    justificativa: 'Contrato trianual — economicidade comprovada por escala temporal',
  })

  // Opção TIC: até 10 anos (inexigibilidade + TIC)
  if (modalidade === 'inexigibilidade' || modalidade === 'contratacao_inovacao') {
    opcoes.push({
      duracao_anos: 5,
      renovavel: true,
      renovacao_max_anos: 10,
      renovacao_automatica: true,
      fundamento: 'Art. 106-107, Lei 14.133/2021 — Contrato de longa duração TIC',
      justificativa: 'Solução de TIC com investimento em infraestrutura de dados — economicidade máxima a longo prazo',
    })
  }

  return opcoes
}

// ─── Trilha de Autocontratação (Prova de Fogo) ─────────────────────────────

/**
 * Gera a trilha de documentos para contratação do ATA360 pelo próprio sistema.
 * Fluxo: dados do ente → cálculo preço → documentos → formalização.
 *
 * CATSER sugerido: 27502 (Serviço de desenvolvimento e manutenção de software)
 * ou 26123 (Serviço de processamento de dados) conforme enquadramento.
 */
export const AUTOCONTRATACAO = {
  catser_principal: '27502',
  catser_alternativo: '26123',
  descricao_objeto: 'Contratação de plataforma de inteligência em contratações públicas (ATA360) para suporte à gestão de compras, geração automatizada de documentos conforme Lei 14.133/2021, auditoria de conformidade, pesquisa de preços via PNCP e rastreabilidade integral de processos licitatórios.',
  natureza: 'servico_tic',

  /**
   * Gera a trilha de documentos automaticamente com base na modalidade.
   */
  getTrilha(modalidade: ModalidadeContratacao): string[] {
    switch (modalidade) {
      case 'dispensa':
        return ['DFD', 'ETP', 'TR', 'PP', 'JCD']
      case 'inexigibilidade':
        return ['DFD', 'ETP', 'TR', 'PP', 'JCD']
      case 'adesao_arp':
        return ['oficio_consulta', 'justificativa_adesao', 'declaracao_compatibilidade',
                'mapa_comparativo', 'autorizacao_gerenciador', 'aceite_fornecedor',
                'termo_adesao', 'extrato_publicacao', 'nota_empenho']
      case 'dialogo_competitivo':
        return ['DFD', 'ETP', 'TR', 'PP', 'edital_dialogo']
      case 'contratacao_inovacao':
        return ['DFD', 'ETP', 'TR', 'justificativa_inovacao']
      case 'emenda_parlamentar':
        return ['DFD', 'plano_trabalho', 'justificativa_destinacao', 'TR', 'PP', 'JCD']
      default:
        return ['DFD', 'JCD']
    }
  },
}

// ─── Tabela de Referência para SuperADM (imprimível) ────────────────────────

export interface TabelaReferenciaItem {
  orgao_descricao: string
  tipo_ente: TipoEnte
  base_referencia: number
  preco_anual: number
  preco_mensal: number
  aliquota_efetiva: number
  modalidade: string
  categoria: CategoriaEnte
}

/**
 * Gera tabela completa de referência de preços.
 * APENAS para SuperADM — NÃO expor ao frontend público.
 */
export function gerarTabelaReferencia(params: PricingParams = PRICING_PARAMS_2026): TabelaReferenciaItem[] {
  const exemplos: Array<{ descricao: string; tipo: TipoEnte; base: number }> = [
    // Municípios
    { descricao: 'Serra da Saudade/MG (854 hab)', tipo: 'prefeitura', base: 5_000_000 },
    { descricao: 'Município ~10.000 hab', tipo: 'prefeitura', base: 8_000_000 },
    { descricao: 'Município ~20.000 hab', tipo: 'prefeitura', base: 15_000_000 },
    { descricao: 'Município ~35.000 hab', tipo: 'prefeitura', base: 22_000_000 },
    { descricao: 'Município ~50.000 hab', tipo: 'prefeitura', base: 30_000_000 },
    { descricao: 'Município ~100.000 hab', tipo: 'prefeitura', base: 80_000_000 },
    { descricao: 'Município ~200.000 hab', tipo: 'prefeitura', base: 200_000_000 },
    { descricao: 'BH/MG (~2,4M hab)', tipo: 'prefeitura', base: 2_000_000_000 },
    { descricao: 'São Paulo/SP (~12M hab)', tipo: 'prefeitura', base: 40_000_000_000 },
    // Câmaras
    { descricao: 'Câmara pequena (até 13 ver.)', tipo: 'camara_municipal', base: 3_000_000 },
    { descricao: 'Câmara média (14-25 ver.)', tipo: 'camara_municipal', base: 8_000_000 },
    { descricao: 'Câmara grande (26-40 ver.)', tipo: 'camara_municipal', base: 20_000_000 },
    // Autarquias
    { descricao: 'Autarquia Municipal pequena', tipo: 'autarquia_municipal', base: 5_000_000 },
    { descricao: 'Autarquia Municipal média', tipo: 'autarquia_municipal', base: 25_000_000 },
    // Consórcios
    { descricao: 'Consórcio até 10 municípios', tipo: 'consorcio', base: 15_000_000 },
    { descricao: 'Consórcio 11-30 municípios', tipo: 'consorcio', base: 50_000_000 },
    // Judiciário
    { descricao: 'TJ Estadual grande', tipo: 'tribunal_justica', base: 3_000_000_000 },
    // TC
    { descricao: 'TCE Estadual', tipo: 'tribunal_contas', base: 500_000_000 },
    // MP
    { descricao: 'MPE Estadual', tipo: 'ministerio_publico', base: 200_000_000 },
    // Universidades
    { descricao: 'Universidade Federal', tipo: 'universidade', base: 200_000_000 },
    // Saúde
    { descricao: 'Hospital Público grande', tipo: 'hospital_publico', base: 100_000_000 },
    // Federal
    { descricao: 'Ministério (órgão central)', tipo: 'orgao_federal', base: 5_000_000_000 },
  ]

  return exemplos.map(e => {
    const calc = calcularPreco(e.base, 'pncp_contratacoes', params)
    return {
      orgao_descricao: e.descricao,
      tipo_ente: e.tipo,
      base_referencia: e.base,
      preco_anual: calc.preco_anual,
      preco_mensal: calc.preco_mensal_equivalente,
      aliquota_efetiva: calc.aliquota_efetiva,
      modalidade: calc.modalidade_recomendada,
      categoria: calc.categoria,
    }
  })
}
