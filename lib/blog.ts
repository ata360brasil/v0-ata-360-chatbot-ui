/**
 * Blog Engine — Conteúdo 100% Automatizado
 *
 * Sistema de blog AI-first para programmatic SEO:
 * - Posts gerados a partir de dados oficiais (PNCP, TCU, legislação)
 * - Taxonomia automática (categorias, tags, glossário)
 * - Schema.org BlogPosting para rich results
 * - AI-citability: conteúdo estruturado para LLMs
 *
 * @see schema.org/BlogPosting
 * @see Google Search Central — Blog structured data
 */

// ─── Blog Post Types ─────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: BlogCategory
  tags: string[]
  author: BlogAuthor
  publishedAt: string
  updatedAt: string
  readingTimeMin: number
  featured: boolean
  seoTitle: string
  seoDescription: string
  relatedSlugs: string[]
  glossaryTerms: string[]
  legalReferences: string[]
}

export interface BlogAuthor {
  name: string
  role: string
  avatar?: string
}

export type BlogCategory =
  | 'legislacao'
  | 'licitacao'
  | 'gestao-publica'
  | 'tecnologia'
  | 'compliance'
  | 'ia-compras-publicas'
  | 'jurisprudencia'
  | 'tutoriais'

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; description: string; icon: string }> = {
  legislacao: {
    label: 'Legislação',
    description: 'Atualizações e análises sobre leis de licitações e contratações públicas',
    icon: 'Scale',
  },
  licitacao: {
    label: 'Licitação',
    description: 'Guias práticos sobre modalidades, fases e documentos licitatórios',
    icon: 'FileText',
  },
  'gestao-publica': {
    label: 'Gestão Pública',
    description: 'Melhores práticas em administração e gestão de contratos',
    icon: 'Building2',
  },
  tecnologia: {
    label: 'Tecnologia',
    description: 'Inovação, GovTech e transformação digital no setor público',
    icon: 'Cpu',
  },
  compliance: {
    label: 'Compliance',
    description: 'Conformidade, integridade e controle interno',
    icon: 'ShieldCheck',
  },
  'ia-compras-publicas': {
    label: 'IA em Compras Públicas',
    description: 'Inteligência artificial aplicada a contratações governamentais',
    icon: 'Brain',
  },
  jurisprudencia: {
    label: 'Jurisprudência',
    description: 'Decisões do TCU, TCEs e tribunais sobre contratações',
    icon: 'Gavel',
  },
  tutoriais: {
    label: 'Tutoriais',
    description: 'Passo a passo para uso do ATA360 e melhores práticas',
    icon: 'BookOpen',
  },
}

// ─── Static Blog Posts (seed content) ────────────────────────────────────────

const ATA360_AUTHOR: BlogAuthor = {
  name: 'ATA360',
  role: 'Plataforma de Inteligência em Contratações Públicas',
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'lei-14133-guia-completo-nova-lei-licitacoes',
    title: 'Lei 14.133/2021: Guia Completo da Nova Lei de Licitações',
    excerpt: 'Entenda as principais mudanças da Nova Lei de Licitações, seus impactos na gestão pública e como se adaptar às novas exigências.',
    content: `## O que mudou com a Lei 14.133/2021

A Lei 14.133, de 1 de abril de 2021, conhecida como Nova Lei de Licitações e Contratos Administrativos, substituiu a Lei 8.666/1993, a Lei do Pregão (10.520/2002) e a Lei do RDC (12.462/2011), unificando o arcabouço legal das contratações públicas brasileiras.

### Principais Mudanças

**1. Modalidades de Licitação**
A nova lei mantém 5 modalidades: Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo (nova). O convite foi extinto e o Diálogo Competitivo foi introduzido para contratações complexas.

**2. Planejamento Obrigatório**
O planejamento ganhou protagonismo com a obrigatoriedade do Estudo Técnico Preliminar (ETP), que antecede o Termo de Referência. O ETP deve diagnosticar o problema e mapear alternativas — não descrever o objeto.

**3. Portal Nacional de Contratações Públicas (PNCP)**
Todos os atos devem ser publicados no PNCP (Art. 174), conferindo transparência e rastreabilidade nacional.

**4. Gestão de Riscos**
A nova lei exige mapeamento e gestão de riscos em contratações (Art. 18, X), incluindo a Matriz de Riscos.

**5. Agente de Contratação**
O pregoeiro é substituído pelo Agente de Contratação (Art. 8), com competências mais amplas e responsabilidades definidas.

### Fundamentação Legal

- Art. 37, XXI da Constituição Federal
- Lei 14.133/2021 (Nova Lei de Licitações)
- Decreto 11.462/2023 (regulamentação federal)
- IN SEGES/ME 65/2021 (pesquisa de preços)
- IN SEGES/ME 58/2022 (plano de contratações)

### Como o ATA360 Auxilia

O ATA360 foi concebido AI-first para a Lei 14.133/2021. O sistema gera documentos licitatórios (ETP, TR, DFD), realiza pesquisa de preços com dados do PNCP e audita cada documento contra os requisitos legais — tudo com rastreabilidade e fundamentação.`,
    category: 'legislacao',
    tags: ['Lei 14.133', 'licitação', 'contratações públicas', 'PNCP', 'planejamento'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 8,
    featured: true,
    seoTitle: 'Lei 14.133/2021: Guia Completo da Nova Lei de Licitações | ATA360',
    seoDescription: 'Guia definitivo sobre a Lei 14.133/2021. Entenda as mudanças, novas modalidades, planejamento obrigatório e como o ATA360 auxilia na conformidade.',
    relatedSlugs: ['etp-estudo-tecnico-preliminar-passo-a-passo', 'pesquisa-de-precos-in-65-2021'],
    glossaryTerms: ['licitacao', 'pregao', 'etp', 'termo-de-referencia', 'pncp'],
    legalReferences: ['Lei 14.133/2021', 'CF Art. 37', 'IN SEGES/ME 65/2021'],
  },
  {
    slug: 'etp-estudo-tecnico-preliminar-passo-a-passo',
    title: 'ETP — Estudo Técnico Preliminar: Passo a Passo Completo',
    excerpt: 'Como elaborar um ETP conforme a Lei 14.133/2021. O ETP diagnostica o problema e mapeia alternativas — ele não descreve o objeto.',
    content: `## O que é o ETP (Estudo Técnico Preliminar)

O ETP é o documento que materializa o planejamento da contratação (Art. 18, Lei 14.133/2021). Sua função é diagnosticar a necessidade e mapear soluções de mercado — **não descrever o objeto**.

### Erro Comum: Antecipar o Objeto no ETP

Um dos erros mais frequentes é tratar o ETP como uma versão preliminar do Termo de Referência. O ETP deve responder: "Qual é o problema?" e "Quais alternativas existem?" — não "O que vou comprar?"

### Elementos Obrigatórios (Art. 18, §1)

1. Descrição da necessidade
2. Requisitos da contratação
3. Levantamento de mercado
4. Descrição da solução como um todo
5. Estimativa do valor
6. Justificativa para o parcelamento ou não
7. Demonstração do alinhamento ao PCA
8. Resultados pretendidos
9. Providências para adequação ambiental
10. Matriz de riscos

### O ATA360 e o ETP

O ATA360 garante que o ETP cumpra sua função original: diagnosticar o problema. O sistema utiliza dados do IBGE, PNCP e TCU para fundamentar o levantamento de mercado e estimar valores com base em preços praticados — eliminando a solidão técnica do servidor.`,
    category: 'licitacao',
    tags: ['ETP', 'planejamento', 'Lei 14.133', 'contratação', 'estudo técnico'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 6,
    featured: true,
    seoTitle: 'ETP (Estudo Técnico Preliminar): Guia Passo a Passo | ATA360',
    seoDescription: 'Aprenda a elaborar o ETP conforme a Lei 14.133/2021. Elementos obrigatórios, erros comuns e como o ATA360 automatiza o processo.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes', 'termo-de-referencia-como-elaborar'],
    glossaryTerms: ['etp', 'termo-de-referencia', 'licitacao', 'pca'],
    legalReferences: ['Art. 18, Lei 14.133/2021'],
  },
  {
    slug: 'pesquisa-de-precos-in-65-2021',
    title: 'Pesquisa de Preços: Guia Conforme IN SEGES/ME 65/2021',
    excerpt: 'Como realizar pesquisa de preços para contratações públicas conforme a IN 65/2021 e quais fontes oficiais consultar.',
    content: `## Pesquisa de Preços na Nova Lei de Licitações

A pesquisa de preços é etapa fundamental para estimar o valor da contratação e garantir economia ao erário. A IN SEGES/ME 65/2021 regulamenta a metodologia.

### Parâmetros de Pesquisa (Art. 5, IN 65/2021)

1. **Painel de Preços** do Compras.gov.br (obrigatório)
2. **PNCP** — contratações similares
3. **Pesquisa com fornecedores** (mínimo 3 cotações)
4. **Tabelas oficiais** (SINAPI, SICRO, BPS)
5. **Sites de e-commerce** (pesquisa complementar)

### Tratamento Estatístico

- Calcular média, mediana e desvio-padrão
- Excluir valores inexequíveis (abaixo de 75% da mediana)
- Excluir valores excessivos (acima de 200% da mediana)
- Justificar a escolha do preço de referência

### O ATA360 e a Pesquisa de Preços

O ATA360 consulta automaticamente o PNCP, Compras.gov.br e mais 17 fontes oficiais para fundamentar pesquisas de preços com dados reais e rastreáveis.`,
    category: 'licitacao',
    tags: ['pesquisa de preços', 'IN 65/2021', 'PNCP', 'orçamento', 'estimativa'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Pesquisa de Preços IN 65/2021: Guia Completo | ATA360',
    seoDescription: 'Guia completo sobre pesquisa de preços conforme IN SEGES/ME 65/2021. Parâmetros, tratamento estatístico e fontes oficiais.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes'],
    glossaryTerms: ['pesquisa-de-precos', 'pncp', 'licitacao'],
    legalReferences: ['IN SEGES/ME 65/2021', 'Art. 23, Lei 14.133/2021'],
  },
  {
    slug: 'ia-contratacoes-publicas-anti-alucinacao',
    title: 'IA em Contratações Públicas: Automação Responsável e Anti-Alucinação',
    excerpt: 'Como o ATA360 implementa IA sem alucinações para contratações públicas. Blindagem em 8 camadas, dados oficiais e decisão humana soberana.',
    content: `## IA AI-First para Compras Públicas

O ATA360 não é um chatbot com IA anexada. É um sistema concebido AI-first, onde a inteligência artificial é a infraestrutura — não o complemento.

### O Problema da Alucinação

IAs generativas podem inventar dados, leis inexistentes e jurisprudências falsas. Em contratações públicas, isso pode gerar:
- Impugnações por fundamentação incorreta
- Sobrepreço por dados de mercado fictício
- Nulidade de processos por vício formal

### Blindagem Anti-Alucinação (8 Camadas)

1. **Fontes oficiais exclusivas** — dados provêm de PNCP, IBGE, TCU, CGU
2. **Motor determinístico para documentos** — PDFs gerados por templates, não por IA generativa
3. **Auditoria automática** — cada documento é verificado contra checklist legal
4. **Cross-reference** — dados cruzados entre múltiplas fontes
5. **Revisão humana obrigatória** — nenhum documento é finalizado sem aprovação do servidor
6. **Rastreabilidade total** — cada informação tem fonte, data e hash de integridade
7. **Alertas proativos** — sistema notifica inconsistências antes da finalização
8. **Código de conduta IA** — regras invioláveis que limitam o escopo da IA

### Humano + IA

A decisão humana é soberana (Art. 20, LINDB). O ATA360 amadurece a decisão, fundamenta e reduz risco — mas nunca substitui o servidor público.`,
    category: 'ia-compras-publicas',
    tags: ['inteligência artificial', 'anti-alucinação', 'automação', 'GovTech', 'compras públicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 7,
    featured: true,
    seoTitle: 'IA em Contratações Públicas: Anti-Alucinação e Automação Responsável | ATA360',
    seoDescription: 'Como o ATA360 aplica IA sem alucinações em compras públicas. 8 camadas de blindagem, dados oficiais e decisão humana soberana.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes'],
    glossaryTerms: ['ia-generativa', 'anti-alucinacao', 'govtech'],
    legalReferences: ['Art. 20, LINDB', 'PL 2.338/2023'],
  },
  {
    slug: 'termo-de-referencia-como-elaborar',
    title: 'Termo de Referência: Como Elaborar Conforme a Lei 14.133/2021',
    excerpt: 'Guia prático para elaboração do Termo de Referência (TR) conforme Art. 6, XXIII da Lei 14.133/2021.',
    content: `## Termo de Referência na Nova Lei

O Termo de Referência (TR) é o documento central da fase de planejamento. Elaborado a partir do ETP, contém os elementos necessários para caracterizar a contratação.

### Elementos do TR (Art. 6, XXIII)

1. Definição do objeto
2. Fundamentação da contratação
3. Descrição da solução
4. Requisitos da contratação
5. Modelo de execução
6. Modelo de gestão
7. Critérios de medição e pagamento
8. Forma e critérios de seleção do fornecedor
9. Estimativas do valor
10. Adequação orçamentária

### Dicas Práticas

- O TR nasce do ETP — nunca o contrário
- Cada requisito deve ter fundamentação legal
- Especificações técnicas devem ser objetivas (evitar marcas)
- Incluir critérios de sustentabilidade (Art. 11, IV)

### O ATA360 e o TR

O ATA360 gera Termos de Referência com fundamentação legal automática, pesquisa de preços integrada e auditoria de conformidade em tempo real.`,
    category: 'licitacao',
    tags: ['termo de referência', 'TR', 'Lei 14.133', 'planejamento', 'documentos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Termo de Referência (TR): Como Elaborar | Lei 14.133/2021 | ATA360',
    seoDescription: 'Guia completo para elaborar Termo de Referência conforme a Lei 14.133/2021. Elementos obrigatórios, dicas práticas e automatização com IA.',
    relatedSlugs: ['etp-estudo-tecnico-preliminar-passo-a-passo', 'lei-14133-guia-completo-nova-lei-licitacoes'],
    glossaryTerms: ['termo-de-referencia', 'etp', 'licitacao'],
    legalReferences: ['Art. 6, XXIII, Lei 14.133/2021'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter(p => p.category === category)
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(p => p.featured)
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map(slug => BLOG_POSTS.find(p => p.slug === slug))
    .filter((p): p is BlogPost => p !== undefined)
}

export function getAllCategories(): BlogCategory[] {
  return [...new Set(BLOG_POSTS.map(p => p.category))]
}

export function getAllTags(): string[] {
  return [...new Set(BLOG_POSTS.flatMap(p => p.tags))].sort()
}
