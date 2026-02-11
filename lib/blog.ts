/**
 * Blog Engine — Conteudo 100% Automatizado
 *
 * Sistema de blog AI-first para programmatic SEO:
 * - Posts gerados a partir de dados oficiais (PNCP, TCU, legislacao)
 * - Taxonomia automatica (categorias, tags, glossario)
 * - Schema.org BlogPosting para rich results
 * - AI-citability: conteudo estruturado para LLMs
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
    label: 'Legislacao',
    description: 'Atualizacoes e analises sobre leis de licitacoes e contratacoes publicas',
    icon: 'Scale',
  },
  licitacao: {
    label: 'Licitacao',
    description: 'Guias praticos sobre modalidades, fases e documentos licitatorios',
    icon: 'FileText',
  },
  'gestao-publica': {
    label: 'Gestao Publica',
    description: 'Melhores praticas em administracao e gestao de contratos',
    icon: 'Building2',
  },
  tecnologia: {
    label: 'Tecnologia',
    description: 'Inovacao, GovTech e transformacao digital no setor publico',
    icon: 'Cpu',
  },
  compliance: {
    label: 'Compliance',
    description: 'Conformidade, integridade e controle interno',
    icon: 'ShieldCheck',
  },
  'ia-compras-publicas': {
    label: 'IA em Compras Publicas',
    description: 'Inteligencia artificial aplicada a contratacoes governamentais',
    icon: 'Brain',
  },
  jurisprudencia: {
    label: 'Jurisprudencia',
    description: 'Decisoes do TCU, TCEs e tribunais sobre contratacoes',
    icon: 'Gavel',
  },
  tutoriais: {
    label: 'Tutoriais',
    description: 'Passo a passo para uso do ATA360 e melhores praticas',
    icon: 'BookOpen',
  },
}

// ─── Static Blog Posts (seed content) ────────────────────────────────────────

const ATA360_AUTHOR: BlogAuthor = {
  name: 'ATA360',
  role: 'Plataforma de Inteligencia em Contratacoes Publicas',
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'lei-14133-guia-completo-nova-lei-licitacoes',
    title: 'Lei 14.133/2021: Guia Completo da Nova Lei de Licitacoes',
    excerpt: 'Entenda as principais mudancas da Nova Lei de Licitacoes, seus impactos na gestao publica e como se adaptar as novas exigencias.',
    content: `## O que mudou com a Lei 14.133/2021

A Lei 14.133, de 1 de abril de 2021, conhecida como Nova Lei de Licitacoes e Contratos Administrativos, substituiu a Lei 8.666/1993, a Lei do Pregao (10.520/2002) e a Lei do RDC (12.462/2011), unificando o arcabouco legal das contratacoes publicas brasileiras.

### Principais Mudancas

**1. Modalidades de Licitacao**
A nova lei mantem 5 modalidades: Pregao, Concorrencia, Concurso, Leilao e Dialogo Competitivo (nova). O convite foi extinto e o Dialogo Competitivo foi introduzido para contratacoes complexas.

**2. Planejamento Obrigatorio**
O planejamento ganhou protagonismo com a obrigatoriedade do Estudo Tecnico Preliminar (ETP), que antecede o Termo de Referencia. O ETP deve diagnosticar o problema e mapear alternativas — nao descrever o objeto.

**3. Portal Nacional de Contratacoes Publicas (PNCP)**
Todos os atos devem ser publicados no PNCP (Art. 174), conferindo transparencia e rastreabilidade nacional.

**4. Gestao de Riscos**
A nova lei exige mapeamento e gestao de riscos em contratacoes (Art. 18, X), incluindo a Matriz de Riscos.

**5. Agente de Contratacao**
O pregoeiro e substituido pelo Agente de Contratacao (Art. 8), com competencias mais amplas e responsabilidades definidas.

### Fundamentacao Legal

- Art. 37, XXI da Constituicao Federal
- Lei 14.133/2021 (Nova Lei de Licitacoes)
- Decreto 11.462/2023 (regulamentacao federal)
- IN SEGES/ME 65/2021 (pesquisa de precos)
- IN SEGES/ME 58/2022 (plano de contratacoes)

### Como o ATA360 Auxilia

O ATA360 foi concebido AI-first para a Lei 14.133/2021. O sistema gera documentos licitatorios (ETP, TR, DFD), realiza pesquisa de precos com dados do PNCP e audita cada documento contra os requisitos legais — tudo com rastreabilidade e fundamentacao.`,
    category: 'legislacao',
    tags: ['Lei 14.133', 'licitacao', 'contratacoes publicas', 'PNCP', 'planejamento'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 8,
    featured: true,
    seoTitle: 'Lei 14.133/2021: Guia Completo da Nova Lei de Licitacoes | ATA360',
    seoDescription: 'Guia definitivo sobre a Lei 14.133/2021. Entenda as mudancas, novas modalidades, planejamento obrigatorio e como o ATA360 auxilia na conformidade.',
    relatedSlugs: ['etp-estudo-tecnico-preliminar-passo-a-passo', 'pesquisa-de-precos-in-65-2021'],
    glossaryTerms: ['licitacao', 'pregao', 'etp', 'termo-de-referencia', 'pncp'],
    legalReferences: ['Lei 14.133/2021', 'CF Art. 37', 'IN SEGES/ME 65/2021'],
  },
  {
    slug: 'etp-estudo-tecnico-preliminar-passo-a-passo',
    title: 'ETP — Estudo Tecnico Preliminar: Passo a Passo Completo',
    excerpt: 'Como elaborar um ETP conforme a Lei 14.133/2021. O ETP diagnostica o problema e mapeia alternativas — ele nao descreve o objeto.',
    content: `## O que e o ETP (Estudo Tecnico Preliminar)

O ETP e o documento que materializa o planejamento da contratacao (Art. 18, Lei 14.133/2021). Sua funcao e diagnosticar a necessidade e mapear solucoes de mercado — **nao descrever o objeto**.

### Erro Comum: Antecipar o Objeto no ETP

Um dos erros mais frequentes e tratar o ETP como uma versao preliminar do Termo de Referencia. O ETP deve responder: "Qual e o problema?" e "Quais alternativas existem?" — nao "O que vou comprar?"

### Elementos Obrigatorios (Art. 18, §1)

1. Descricao da necessidade
2. Requisitos da contratacao
3. Levantamento de mercado
4. Descricao da solucao como um todo
5. Estimativa do valor
6. Justificativa para o parcelamento ou nao
7. Demonstracao do alinhamento ao PCA
8. Resultados pretendidos
9. Providencias para adequacao ambiental
10. Matriz de riscos

### O ATA360 e o ETP

O ATA360 garante que o ETP cumpra sua funcao original: diagnosticar o problema. O sistema utiliza dados do IBGE, PNCP e TCU para fundamentar o levantamento de mercado e estimar valores com base em precos praticados — eliminando a solidao tecnica do servidor.`,
    category: 'licitacao',
    tags: ['ETP', 'planejamento', 'Lei 14.133', 'contratacao', 'estudo tecnico'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 6,
    featured: true,
    seoTitle: 'ETP (Estudo Tecnico Preliminar): Guia Passo a Passo | ATA360',
    seoDescription: 'Aprenda a elaborar o ETP conforme a Lei 14.133/2021. Elementos obrigatorios, erros comuns e como o ATA360 automatiza o processo.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes', 'termo-de-referencia-como-elaborar'],
    glossaryTerms: ['etp', 'termo-de-referencia', 'licitacao', 'pca'],
    legalReferences: ['Art. 18, Lei 14.133/2021'],
  },
  {
    slug: 'pesquisa-de-precos-in-65-2021',
    title: 'Pesquisa de Precos: Guia Conforme IN SEGES/ME 65/2021',
    excerpt: 'Como realizar pesquisa de precos para contratacoes publicas conforme a IN 65/2021 e quais fontes oficiais consultar.',
    content: `## Pesquisa de Precos na Nova Lei de Licitacoes

A pesquisa de precos e etapa fundamental para estimar o valor da contratacao e garantir economia ao erario. A IN SEGES/ME 65/2021 regulamenta a metodologia.

### Parametros de Pesquisa (Art. 5, IN 65/2021)

1. **Painel de Precos** do Compras.gov.br (obrigatorio)
2. **PNCP** — contratacoes similares
3. **Pesquisa com fornecedores** (minimo 3 cotacoes)
4. **Tabelas oficiais** (SINAPI, SICRO, BPS)
5. **Sites de e-commerce** (pesquisa complementar)

### Tratamento Estatistico

- Calcular media, mediana e desvio-padrao
- Excluir valores inexequiveis (abaixo de 75% da mediana)
- Excluir valores excessivos (acima de 200% da mediana)
- Justificar a escolha do preco de referencia

### O ATA360 e a Pesquisa de Precos

O ATA360 consulta automaticamente o PNCP, Compras.gov.br e mais 17 fontes oficiais para fundamentar pesquisas de precos com dados reais e rastreavies.`,
    category: 'licitacao',
    tags: ['pesquisa de precos', 'IN 65/2021', 'PNCP', 'orçamento', 'estimativa'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Pesquisa de Precos IN 65/2021: Guia Completo | ATA360',
    seoDescription: 'Guia completo sobre pesquisa de precos conforme IN SEGES/ME 65/2021. Parametros, tratamento estatistico e fontes oficiais.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes'],
    glossaryTerms: ['pesquisa-de-precos', 'pncp', 'licitacao'],
    legalReferences: ['IN SEGES/ME 65/2021', 'Art. 23, Lei 14.133/2021'],
  },
  {
    slug: 'ia-contratacoes-publicas-anti-alucinacao',
    title: 'IA em Contratacoes Publicas: Automacao Responsavel e Anti-Alucinacao',
    excerpt: 'Como o ATA360 implementa IA sem alucinacoes para contratacoes publicas. Blindagem em 8 camadas, dados oficiais e decisao humana soberana.',
    content: `## IA AI-First para Compras Publicas

O ATA360 nao e um chatbot com IA anexada. E um sistema concebido AI-first, onde a inteligencia artificial e a infraestrutura — nao o complemento.

### O Problema da Alucinacao

IAs generativas podem inventar dados, leis inexistentes e jurisprudencias falsas. Em contratacoes publicas, isso pode gerar:
- Impugnacoes por fundamentacao incorreta
- Sobrepreco por dados de mercado ficticio
- Nulidade de processos por vicio formal

### Blindagem Anti-Alucinacao (8 Camadas)

1. **Fontes oficiais exclusivas** — dados provem de PNCP, IBGE, TCU, CGU
2. **Motor deterministico para documentos** — PDFs gerados por templates, nao por IA generativa
3. **Auditoria automatica** — cada documento e verificado contra checklist legal
4. **Cross-reference** — dados cruzados entre multiplas fontes
5. **Revisao humana obrigatoria** — nenhum documento e finalizado sem aprovacao do servidor
6. **Rastreabilidade total** — cada informacao tem fonte, data e hash de integridade
7. **Alertas proativos** — sistema notifica inconsistencias antes da finalizacao
8. **Codigo de conduta IA** — regras inviolaveis que limitam o escopo da IA

### Humano + IA

A decisao humana e soberana (Art. 20, LINDB). O ATA360 amadurece a decisao, fundamenta e reduz risco — mas nunca substitui o servidor publico.`,
    category: 'ia-compras-publicas',
    tags: ['inteligencia artificial', 'anti-alucinacao', 'automacao', 'GovTech', 'compras publicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 7,
    featured: true,
    seoTitle: 'IA em Contratacoes Publicas: Anti-Alucinacao e Automacao Responsavel | ATA360',
    seoDescription: 'Como o ATA360 aplica IA sem alucinacoes em compras publicas. 8 camadas de blindagem, dados oficiais e decisao humana soberana.',
    relatedSlugs: ['lei-14133-guia-completo-nova-lei-licitacoes'],
    glossaryTerms: ['ia-generativa', 'anti-alucinacao', 'govtech'],
    legalReferences: ['Art. 20, LINDB', 'PL 2.338/2023'],
  },
  {
    slug: 'termo-de-referencia-como-elaborar',
    title: 'Termo de Referencia: Como Elaborar Conforme a Lei 14.133/2021',
    excerpt: 'Guia pratico para elaboracao do Termo de Referencia (TR) conforme Art. 6, XXIII da Lei 14.133/2021.',
    content: `## Termo de Referencia na Nova Lei

O Termo de Referencia (TR) e o documento central da fase de planejamento. Elaborado a partir do ETP, contem os elementos necessarios para caracterizar a contratacao.

### Elementos do TR (Art. 6, XXIII)

1. Definicao do objeto
2. Fundamentacao da contratacao
3. Descricao da solucao
4. Requisitos da contratacao
5. Modelo de execucao
6. Modelo de gestao
7. Criterios de medicao e pagamento
8. Forma e criterios de selecao do fornecedor
9. Estimativas do valor
10. Adequacao orcamentaria

### Dicas Praticas

- O TR nasce do ETP — nunca o contrario
- Cada requisito deve ter fundamentacao legal
- Especificacoes tecnicas devem ser objetivas (evitar marcas)
- Incluir criterios de sustentabilidade (Art. 11, IV)

### O ATA360 e o TR

O ATA360 gera Termos de Referencia com fundamentacao legal automatica, pesquisa de precos integrada e auditoria de conformidade em tempo real.`,
    category: 'licitacao',
    tags: ['termo de referencia', 'TR', 'Lei 14.133', 'planejamento', 'documentos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T00:00:00Z',
    updatedAt: '2026-02-11T00:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Termo de Referencia (TR): Como Elaborar | Lei 14.133/2021 | ATA360',
    seoDescription: 'Guia completo para elaborar Termo de Referencia conforme a Lei 14.133/2021. Elementos obrigatorios, dicas praticas e automatizacao com IA.',
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
