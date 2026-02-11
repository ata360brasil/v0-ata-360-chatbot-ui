/**
 * Glossario de Contratacoes Publicas — Taxonomia SEO
 *
 * Termos indexados para:
 * - Programmatic SEO (paginas automaticas por termo)
 * - FAQ schema (rich results)
 * - AI-citability (LLMs referenciam definicoes)
 * - Contextualizacao no chat IA
 *
 * @see Lei 14.133/2021 Art. 6 — Definicoes
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
  modalidades: { label: 'Modalidades de Licitacao', description: 'Tipos de procedimentos licitatorios previstos na Lei 14.133/2021' },
  documentos: { label: 'Documentos', description: 'Documentos e artefatos do processo de contratacao' },
  agentes: { label: 'Agentes e Atores', description: 'Papeis e responsabilidades na contratacao publica' },
  processos: { label: 'Processos e Fases', description: 'Etapas e fluxos do processo licitatorio' },
  financeiro: { label: 'Financeiro e Orcamentario', description: 'Termos financeiros e orcamentarios' },
  compliance: { label: 'Compliance e Controle', description: 'Conformidade, auditoria e controle interno' },
  tecnologia: { label: 'Tecnologia', description: 'Termos tecnologicos e de inovacao' },
  orgaos: { label: 'Orgaos e Instituicoes', description: 'Entidades governamentais relacionadas' },
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: 'licitacao',
    term: 'Licitacao',
    definition: 'Procedimento administrativo pelo qual a Administracao Publica seleciona a proposta mais vantajosa para contratar obras, servicos, compras e alienacoes. Na Lei 14.133/2021, as modalidades sao: Pregao, Concorrencia, Concurso, Leilao e Dialogo Competitivo.',
    legalBasis: 'Art. 6, XL, Lei 14.133/2021',
    relatedTerms: ['pregao', 'concorrencia', 'edital'],
    category: 'processos',
    seoTitle: 'O que e Licitacao? | Glossario ATA360',
    seoDescription: 'Entenda o que e licitacao, suas modalidades na Lei 14.133/2021 e como funciona o processo de contratacao publica.',
  },
  {
    slug: 'pregao',
    term: 'Pregao',
    abbreviation: 'PE',
    definition: 'Modalidade de licitacao obrigatoria para aquisicao de bens e servicos comuns e de engenharia comum, realizada preferencialmente na forma eletronica. O criterio de julgamento e o menor preco ou maior desconto.',
    legalBasis: 'Art. 6, XLI e Art. 29, Lei 14.133/2021',
    relatedTerms: ['licitacao', 'edital', 'agente-de-contratacao'],
    category: 'modalidades',
    seoTitle: 'Pregao Eletronico: O que e e como funciona | ATA360',
    seoDescription: 'Entenda o Pregao Eletronico na Lei 14.133/2021. Modalidade obrigatoria para bens e servicos comuns.',
  },
  {
    slug: 'etp',
    term: 'Estudo Tecnico Preliminar',
    abbreviation: 'ETP',
    definition: 'Documento constitutivo da fase preparatoria que caracteriza o interesse publico envolvido e a melhor solucao dentre as possiveis. O ETP diagnostica o problema e mapeia alternativas — nao descreve o objeto.',
    legalBasis: 'Art. 6, XX e Art. 18, Lei 14.133/2021',
    relatedTerms: ['termo-de-referencia', 'dfd', 'planejamento'],
    category: 'documentos',
    seoTitle: 'ETP (Estudo Tecnico Preliminar): Definicao e Importancia | ATA360',
    seoDescription: 'O que e ETP na Lei 14.133/2021. Estudo Tecnico Preliminar diagnostica o problema e mapeia solucoes para contratacao publica.',
  },
  {
    slug: 'termo-de-referencia',
    term: 'Termo de Referencia',
    abbreviation: 'TR',
    definition: 'Documento elaborado a partir do ETP, que contem os elementos necessarios e suficientes para caracterizar o objeto da contratacao, incluindo: definicao, fundamentacao, descricao da solucao, requisitos, modelo de execucao e criterios de pagamento.',
    legalBasis: 'Art. 6, XXIII, Lei 14.133/2021',
    relatedTerms: ['etp', 'edital', 'licitacao'],
    category: 'documentos',
    seoTitle: 'Termo de Referencia (TR): O que e | Lei 14.133/2021 | ATA360',
    seoDescription: 'Definicao de Termo de Referencia conforme Art. 6, XXIII da Lei 14.133/2021. Documento central do planejamento de contratacoes.',
  },
  {
    slug: 'dfd',
    term: 'Documento de Formalizacao da Demanda',
    abbreviation: 'DFD',
    definition: 'Documento que formaliza a necessidade de contratacao, indicando o objeto, a quantidade e a justificativa. E o primeiro artefato do planejamento, antecedendo o ETP.',
    legalBasis: 'Art. 18, I, Lei 14.133/2021',
    relatedTerms: ['etp', 'pca', 'planejamento'],
    category: 'documentos',
    seoTitle: 'DFD (Documento de Formalizacao da Demanda) | ATA360',
    seoDescription: 'O que e DFD na Lei 14.133/2021. Primeiro documento do planejamento de contratacao publica.',
  },
  {
    slug: 'pncp',
    term: 'Portal Nacional de Contratacoes Publicas',
    abbreviation: 'PNCP',
    definition: 'Sitio eletronico oficial destinado a divulgacao centralizada e obrigatoria dos atos de contratacao publica. Todos os orgaos devem publicar editais, contratos e atas no PNCP.',
    legalBasis: 'Art. 174, Lei 14.133/2021',
    relatedTerms: ['licitacao', 'edital', 'transparencia'],
    category: 'orgaos',
    seoTitle: 'PNCP — Portal Nacional de Contratacoes Publicas | ATA360',
    seoDescription: 'O que e o PNCP. Portal obrigatorio para publicacao de licitacoes e contratos conforme Lei 14.133/2021.',
  },
  {
    slug: 'ata-de-registro-de-precos',
    term: 'Ata de Registro de Precos',
    abbreviation: 'ARP',
    definition: 'Documento vinculativo, com caracteristica de compromisso para futura contratacao, em que se registram precos, fornecedores, orgaos participantes e condicoes praticadas.',
    legalBasis: 'Art. 6, XLV, Lei 14.133/2021',
    relatedTerms: ['srp', 'licitacao', 'pregao'],
    category: 'documentos',
    seoTitle: 'ARP (Ata de Registro de Precos): O que e | ATA360',
    seoDescription: 'Definicao de Ata de Registro de Precos (ARP) na Lei 14.133/2021. Documento de compromisso para futuras contratacoes.',
  },
  {
    slug: 'agente-de-contratacao',
    term: 'Agente de Contratacao',
    definition: 'Pessoa designada pela autoridade competente para tomar decisoes, acompanhar o tramite da licitacao, dar impulso ao procedimento e executar atividades necessarias ao bom andamento do certame.',
    legalBasis: 'Art. 8, Lei 14.133/2021',
    relatedTerms: ['pregao', 'licitacao', 'comissao-de-contratacao'],
    category: 'agentes',
    seoTitle: 'Agente de Contratacao: Papel e Responsabilidades | ATA360',
    seoDescription: 'O que faz o Agente de Contratacao na Lei 14.133/2021. Funcoes, responsabilidades e competencias.',
  },
  {
    slug: 'pca',
    term: 'Plano de Contratacoes Anual',
    abbreviation: 'PCA',
    definition: 'Instrumento de governanca que consolida as demandas de contratacao do orgao para o exercicio seguinte, permitindo planejamento adequado de recursos e cronogramas.',
    legalBasis: 'Art. 12, VII, Lei 14.133/2021; IN SEGES/ME 58/2022',
    relatedTerms: ['dfd', 'etp', 'planejamento'],
    category: 'processos',
    seoTitle: 'PCA (Plano de Contratacoes Anual): O que e | ATA360',
    seoDescription: 'Plano de Contratacoes Anual (PCA) conforme Lei 14.133/2021. Governanca e planejamento de contratacoes.',
  },
  {
    slug: 'pesquisa-de-precos',
    term: 'Pesquisa de Precos',
    definition: 'Levantamento dos precos praticados no mercado para estimativa do valor da contratacao. Deve utilizar parametros da IN SEGES/ME 65/2021, incluindo Painel de Precos, PNCP e cotacoes com fornecedores.',
    legalBasis: 'Art. 23, Lei 14.133/2021; IN SEGES/ME 65/2021',
    relatedTerms: ['etp', 'pncp', 'orcamento'],
    category: 'financeiro',
    seoTitle: 'Pesquisa de Precos: Como Fazer | IN 65/2021 | ATA360',
    seoDescription: 'O que e pesquisa de precos para licitacao. Parametros da IN SEGES/ME 65/2021 e fontes oficiais.',
  },
  {
    slug: 'srp',
    term: 'Sistema de Registro de Precos',
    abbreviation: 'SRP',
    definition: 'Conjunto de procedimentos para registro formal de precos para contratacoes futuras, realizado por meio de concorrencia ou pregao.',
    legalBasis: 'Art. 6, XLIV e Arts. 82-86, Lei 14.133/2021',
    relatedTerms: ['ata-de-registro-de-precos', 'pregao', 'licitacao'],
    category: 'processos',
    seoTitle: 'SRP (Sistema de Registro de Precos): O que e | ATA360',
    seoDescription: 'Sistema de Registro de Precos (SRP) na Lei 14.133/2021. Como funciona e quando utilizar.',
  },
  {
    slug: 'govtech',
    term: 'GovTech',
    definition: 'Empresas e startups que desenvolvem tecnologias para modernizar e digitalizar servicos e processos do setor publico. O ATA360 e uma GovTech brasileira especializada em contratacoes publicas.',
    relatedTerms: ['ia-generativa', 'transformacao-digital'],
    category: 'tecnologia',
    seoTitle: 'GovTech: O que e e exemplos | ATA360',
    seoDescription: 'O que e GovTech. Empresas de tecnologia para o setor publico. ATA360 como exemplo de GovTech brasileira.',
  },
  {
    slug: 'anti-alucinacao',
    term: 'Anti-Alucinacao',
    definition: 'Conjunto de tecnicas e camadas de protecao para impedir que sistemas de IA generativa produzam informacoes falsas, inventadas ou sem fundamentacao. No ATA360, sao 8 camadas de blindagem incluindo fontes oficiais exclusivas, motor deterministico e revisao humana obrigatoria.',
    relatedTerms: ['ia-generativa', 'govtech', 'compliance'],
    category: 'tecnologia',
    seoTitle: 'Anti-Alucinacao em IA: Como Funciona | ATA360',
    seoDescription: 'O que e anti-alucinacao em inteligencia artificial. 8 camadas de blindagem do ATA360 para compras publicas.',
  },
  {
    slug: 'capag',
    term: 'Capacidade de Pagamento',
    abbreviation: 'CAPAG',
    definition: 'Indicador calculado pela Secretaria do Tesouro Nacional (STN) que avalia a capacidade de pagamento de entes subnacionais. Classificado em notas A, B, C ou D.',
    legalBasis: 'Portaria STN 501/2018',
    relatedTerms: ['fpm', 'fpe', 'fiscal'],
    category: 'financeiro',
    seoTitle: 'CAPAG: O que e e como funciona | ATA360',
    seoDescription: 'Capacidade de Pagamento (CAPAG). Indicador da STN para avaliacao de entes subnacionais.',
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
