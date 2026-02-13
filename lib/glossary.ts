/**
 * Glossário de Contratações Públicas — Taxonomia SEO
 *
 * Termos indexados para:
 * - Programmatic SEO (páginas automáticas por termo)
 * - FAQ schema (rich results)
 * - AI-citability (LLMs referenciam definições)
 * - Contextualização no chat IA
 *
 * @see Lei 14.133/2021 Art. 6 — Definições
 * @see schema.org/DefinedTerm
 */

export interface GlossaryTerm {
  slug: string
  term: string
  abbreviation?: string
  definition: string
  legalBasis?: string
  relatedTerms: string[]
  category: GlossaryCategory
  seoTitle: string
  seoDescription: string
}

export type GlossaryCategory =
  | 'modalidades'
  | 'documentos'
  | 'agentes'
  | 'processos'
  | 'financeiro'
  | 'compliance'
  | 'tecnologia'
  | 'orgaos'

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, { label: string; description: string }> = {
  modalidades: { label: 'Modalidades de Licitação', description: 'Tipos de procedimentos licitatórios previstos na Lei 14.133/2021' },
  documentos: { label: 'Documentos', description: 'Documentos e artefatos do processo de contratação' },
  agentes: { label: 'Agentes e Atores', description: 'Papéis e responsabilidades na contratação pública' },
  processos: { label: 'Processos e Fases', description: 'Etapas e fluxos do processo licitatório' },
  financeiro: { label: 'Financeiro e Orçamentário', description: 'Termos financeiros e orçamentários' },
  compliance: { label: 'Compliance e Controle', description: 'Conformidade, auditoria e controle interno' },
  tecnologia: { label: 'Tecnologia', description: 'Termos tecnológicos e de inovação' },
  orgaos: { label: 'Órgãos e Instituições', description: 'Entidades governamentais relacionadas' },
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: 'licitacao',
    term: 'Licitação',
    definition: 'Procedimento administrativo pelo qual a Administração Pública seleciona a proposta mais vantajosa para contratar obras, serviços, compras e alienações. Na Lei 14.133/2021, as modalidades são: Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo.',
    legalBasis: 'Art. 6, XL, Lei 14.133/2021',
    relatedTerms: ['pregao', 'concorrencia', 'edital'],
    category: 'processos',
    seoTitle: 'O que é Licitação? | Glossário ATA360',
    seoDescription: 'Entenda o que é licitação, suas modalidades na Lei 14.133/2021 e como funciona o processo de contratação pública.',
  },
  {
    slug: 'pregao',
    term: 'Pregão',
    abbreviation: 'PE',
    definition: 'Modalidade de licitação obrigatória para aquisição de bens e serviços comuns e de engenharia comum, realizada preferencialmente na forma eletrônica. O critério de julgamento é o menor preço ou maior desconto.',
    legalBasis: 'Art. 6, XLI e Art. 29, Lei 14.133/2021',
    relatedTerms: ['licitacao', 'edital', 'agente-de-contratacao'],
    category: 'modalidades',
    seoTitle: 'Pregão Eletrônico: O que é e como funciona | ATA360',
    seoDescription: 'Entenda o Pregão Eletrônico na Lei 14.133/2021. Modalidade obrigatória para bens e serviços comuns.',
  },
  {
    slug: 'etp',
    term: 'Estudo Técnico Preliminar',
    abbreviation: 'ETP',
    definition: 'Documento constitutivo da fase preparatória que caracteriza o interesse público envolvido e a melhor solução dentre as possíveis. O ETP diagnostica o problema e mapeia alternativas — não descreve o objeto.',
    legalBasis: 'Art. 6, XX e Art. 18, Lei 14.133/2021',
    relatedTerms: ['termo-de-referencia', 'dfd', 'planejamento'],
    category: 'documentos',
    seoTitle: 'ETP (Estudo Técnico Preliminar): Definição e Importância | ATA360',
    seoDescription: 'O que é ETP na Lei 14.133/2021. Estudo Técnico Preliminar diagnostica o problema e mapeia soluções para contratação pública.',
  },
  {
    slug: 'termo-de-referencia',
    term: 'Termo de Referência',
    abbreviation: 'TR',
    definition: 'Documento elaborado a partir do ETP, que contém os elementos necessários e suficientes para caracterizar o objeto da contratação, incluindo: definição, fundamentação, descrição da solução, requisitos, modelo de execução e critérios de pagamento.',
    legalBasis: 'Art. 6, XXIII, Lei 14.133/2021',
    relatedTerms: ['etp', 'edital', 'licitacao'],
    category: 'documentos',
    seoTitle: 'Termo de Referência (TR): O que é | Lei 14.133/2021 | ATA360',
    seoDescription: 'Definição de Termo de Referência conforme Art. 6, XXIII da Lei 14.133/2021. Documento central do planejamento de contratações.',
  },
  {
    slug: 'dfd',
    term: 'Documento de Formalização da Demanda',
    abbreviation: 'DFD',
    definition: 'Documento que formaliza a necessidade de contratação, indicando o objeto, a quantidade e a justificativa. É o primeiro artefato do planejamento, antecedendo o ETP.',
    legalBasis: 'Art. 18, I, Lei 14.133/2021',
    relatedTerms: ['etp', 'pca', 'planejamento'],
    category: 'documentos',
    seoTitle: 'DFD (Documento de Formalização da Demanda) | ATA360',
    seoDescription: 'O que é DFD na Lei 14.133/2021. Primeiro documento do planejamento de contratação pública.',
  },
  {
    slug: 'pncp',
    term: 'Portal Nacional de Contratações Públicas',
    abbreviation: 'PNCP',
    definition: 'Sítio eletrônico oficial destinado à divulgação centralizada e obrigatória dos atos de contratação pública. Todos os órgãos devem publicar editais, contratos e atas no PNCP.',
    legalBasis: 'Art. 174, Lei 14.133/2021',
    relatedTerms: ['licitacao', 'edital', 'transparencia'],
    category: 'orgaos',
    seoTitle: 'PNCP — Portal Nacional de Contratações Públicas | ATA360',
    seoDescription: 'O que é o PNCP. Portal obrigatório para publicação de licitações e contratos conforme Lei 14.133/2021.',
  },
  {
    slug: 'ata-de-registro-de-precos',
    term: 'Ata de Registro de Preços',
    abbreviation: 'ARP',
    definition: 'Documento vinculativo, com característica de compromisso para futura contratação, em que se registram preços, fornecedores, órgãos participantes e condições praticadas.',
    legalBasis: 'Art. 6, XLV, Lei 14.133/2021',
    relatedTerms: ['srp', 'licitacao', 'pregao'],
    category: 'documentos',
    seoTitle: 'ARP (Ata de Registro de Preços): O que é | ATA360',
    seoDescription: 'Definição de Ata de Registro de Preços (ARP) na Lei 14.133/2021. Documento de compromisso para futuras contratações.',
  },
  {
    slug: 'agente-de-contratacao',
    term: 'Agente de Contratação',
    definition: 'Pessoa designada pela autoridade competente para tomar decisões, acompanhar o trâmite da licitação, dar impulso ao procedimento e executar atividades necessárias ao bom andamento do certame.',
    legalBasis: 'Art. 8, Lei 14.133/2021',
    relatedTerms: ['pregao', 'licitacao', 'comissao-de-contratacao'],
    category: 'agentes',
    seoTitle: 'Agente de Contratação: Papel e Responsabilidades | ATA360',
    seoDescription: 'O que faz o Agente de Contratação na Lei 14.133/2021. Funções, responsabilidades e competências.',
  },
  {
    slug: 'pca',
    term: 'Plano de Contratações Anual',
    abbreviation: 'PCA',
    definition: 'Instrumento de governança que consolida as demandas de contratação do órgão para o exercício seguinte, permitindo planejamento adequado de recursos e cronogramas.',
    legalBasis: 'Art. 12, VII, Lei 14.133/2021; IN SEGES/ME 58/2022',
    relatedTerms: ['dfd', 'etp', 'planejamento'],
    category: 'processos',
    seoTitle: 'PCA (Plano de Contratações Anual): O que é | ATA360',
    seoDescription: 'Plano de Contratações Anual (PCA) conforme Lei 14.133/2021. Governança e planejamento de contratações.',
  },
  {
    slug: 'pesquisa-de-precos',
    term: 'Pesquisa de Preços',
    definition: 'Levantamento dos preços praticados no mercado para estimativa do valor da contratação. Deve utilizar parâmetros da IN SEGES/ME 65/2021, incluindo Painel de Preços, PNCP e cotações com fornecedores.',
    legalBasis: 'Art. 23, Lei 14.133/2021; IN SEGES/ME 65/2021',
    relatedTerms: ['etp', 'pncp', 'orcamento'],
    category: 'financeiro',
    seoTitle: 'Pesquisa de Preços: Como Fazer | IN 65/2021 | ATA360',
    seoDescription: 'O que é pesquisa de preços para licitação. Parâmetros da IN SEGES/ME 65/2021 e fontes oficiais.',
  },
  {
    slug: 'srp',
    term: 'Sistema de Registro de Preços',
    abbreviation: 'SRP',
    definition: 'Conjunto de procedimentos para registro formal de preços para contratações futuras, realizado por meio de concorrência ou pregão.',
    legalBasis: 'Art. 6, XLIV e Arts. 82-86, Lei 14.133/2021',
    relatedTerms: ['ata-de-registro-de-precos', 'pregao', 'licitacao'],
    category: 'processos',
    seoTitle: 'SRP (Sistema de Registro de Preços): O que é | ATA360',
    seoDescription: 'Sistema de Registro de Preços (SRP) na Lei 14.133/2021. Como funciona e quando utilizar.',
  },
  {
    slug: 'govtech',
    term: 'GovTech',
    definition: 'Empresas e startups que desenvolvem tecnologias para modernizar e digitalizar serviços e processos do setor público. O ATA360 é uma GovTech brasileira especializada em contratações públicas.',
    relatedTerms: ['ia-generativa', 'transformacao-digital'],
    category: 'tecnologia',
    seoTitle: 'GovTech: O que é e exemplos | ATA360',
    seoDescription: 'O que é GovTech. Empresas de tecnologia para o setor público. ATA360 como exemplo de GovTech brasileira.',
  },
  {
    slug: 'anti-alucinacao',
    term: 'Anti-Alucinação',
    definition: 'Conjunto de técnicas e camadas de proteção para impedir que sistemas de IA generativa produzam informações falsas, inventadas ou sem fundamentação. No ATA360, são 8 camadas de blindagem incluindo fontes oficiais exclusivas, motor determinístico e revisão humana obrigatória.',
    relatedTerms: ['ia-generativa', 'govtech', 'compliance'],
    category: 'tecnologia',
    seoTitle: 'Anti-Alucinação em IA: Como Funciona | ATA360',
    seoDescription: 'O que é anti-alucinação em inteligência artificial. 8 camadas de blindagem do ATA360 para compras públicas.',
  },
  {
    slug: 'capag',
    term: 'Capacidade de Pagamento',
    abbreviation: 'CAPAG',
    definition: 'Indicador calculado pela Secretaria do Tesouro Nacional (STN) que avalia a capacidade de pagamento de entes subnacionais. Classificado em notas A, B, C ou D.',
    legalBasis: 'Portaria STN 501/2018',
    relatedTerms: ['fpm', 'fpe', 'fiscal'],
    category: 'financeiro',
    seoTitle: 'CAPAG: O que é e como funciona | ATA360',
    seoDescription: 'Capacidade de Pagamento (CAPAG). Indicador da STN para avaliação de entes subnacionais.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find(t => t.slug === slug)
}

export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter(t => t.category === category)
}

export function searchTerms(query: string): GlossaryTerm[] {
  const q = query.toLowerCase()
  return GLOSSARY_TERMS.filter(t =>
    t.term.toLowerCase().includes(q) ||
    t.definition.toLowerCase().includes(q) ||
    (t.abbreviation?.toLowerCase().includes(q))
  )
}

export function getRelatedTerms(term: GlossaryTerm): GlossaryTerm[] {
  return term.relatedTerms
    .map(slug => GLOSSARY_TERMS.find(t => t.slug === slug))
    .filter((t): t is GlossaryTerm => t !== undefined)
}

export function getAllCategories(): GlossaryCategory[] {
  return [...new Set(GLOSSARY_TERMS.map(t => t.category))]
}
