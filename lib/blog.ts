/**
 * Blog Engine — Noticias Curadas de Compras Publicas
 *
 * Canal de noticias de interesse do publico-alvo:
 * - Servidores publicos, pregoeiros, agentes de contratacao
 * - Prefeitos, secretarios, gestores
 *
 * Fontes: TCU, TCE, CGU, AGU, Gov.br, PNCP, governos estaduais
 * Temas: novas leis, jurisprudencia, inovacao, boas praticas
 *
 * REGRA: Toda noticia DEVE citar a fonte original com link.
 * REGRA: Toda noticia DEVE trazer relevancia para o publico-alvo.
 * REGRA: Toda noticia DEVE mencionar como o ATA360 se relaciona (quando pertinente).
 *
 * @see schema.org/NewsArticle
 */

// ─── Types ──────────────────────────────────────────────────────────────────

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
  /** URL da fonte original da noticia */
  sourceUrl?: string
  /** Nome da fonte (ex: TCU, Gov.br, CGU) */
  sourceName?: string
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
    description: 'Novas leis, decretos e regulamentacoes sobre compras publicas',
    icon: 'Scale',
  },
  licitacao: {
    label: 'Licitacao',
    description: 'Noticias sobre processos licitatorios, editais e contratacoes',
    icon: 'FileText',
  },
  'gestao-publica': {
    label: 'Gestao Publica',
    description: 'Boas praticas, inovacao e tendencias em administracao publica',
    icon: 'Building2',
  },
  tecnologia: {
    label: 'Tecnologia',
    description: 'Inovacao, GovTech e transformacao digital no setor publico',
    icon: 'Cpu',
  },
  compliance: {
    label: 'Compliance',
    description: 'Fiscalizacao, controle interno, TCU, TCE e CGU',
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
    description: 'Guias praticos sobre compras publicas e Lei 14.133',
    icon: 'BookOpen',
  },
}

// ─── Author ─────────────────────────────────────────────────────────────────

const ATA360_AUTHOR: BlogAuthor = {
  name: 'ATA360',
  role: 'Inteligencia em Contratacoes Publicas',
}

// ─── Posts — Noticias Curadas ───────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026',
    title: 'TCU regulamenta uso de inteligencia artificial em contratacoes publicas',
    excerpt: 'O Tribunal de Contas da Uniao publicou orientacoes sobre o uso de IA em processos de contratacao, exigindo rastreabilidade, transparencia e revisao humana obrigatoria. Entenda o impacto para seu orgao.',
    content: `## TCU define regras para uso de IA em compras publicas

O Tribunal de Contas da Uniao (TCU) publicou novas orientacoes sobre o uso de inteligencia artificial em processos de contratacao publica, reafirmando a necessidade de rastreabilidade, transparencia algoritmica e revisao humana obrigatoria.

### O que o TCU determinou

As orientacoes incluem:

- **Rastreabilidade total**: todo dado gerado ou sugerido por IA deve ter fonte identificavel
- **Transparencia**: o orgao deve documentar qual ferramenta de IA foi utilizada e para que finalidade
- **Revisao humana obrigatoria**: nenhum documento licitatorio pode ser finalizado sem validacao do agente responsavel
- **Vedacao a IA generica sem governanca**: ferramentas que enviam dados para servidores estrangeiros sem controle de LGPD sao desaconselhadas
- **Auditabilidade**: logs de uso de IA devem ser preservados na trilha de auditoria do processo

### Impacto para municipios

Para os mais de 4.000 municipios com menos de 50 mil habitantes, as orientacoes representam um desafio adicional: como adotar IA sem violar as regras de governanca?

A resposta esta em ferramentas que ja nasceram dentro do marco regulatorio — com dados oficiais, processamento em territorio nacional e fundamentacao legal rastreavel.

### Oportunidade para gestores

Orgaos que ja utilizam IA especializada estarao em conformidade desde o primeiro dia. A adocao proativa de ferramentas alinhadas as orientacoes do TCU demonstra boa governanca e reduz risco de responsabilizacao pessoal.

O ATA360 opera com multiplas camadas de blindagem anti-alucinacao, dados processados no Brasil e revisao humana obrigatoria em cada etapa — exatamente o que o TCU recomenda.

**Fonte:** [Tribunal de Contas da Uniao — Portal TCU](https://portal.tcu.gov.br/)`,
    category: 'jurisprudencia',
    tags: ['TCU', 'inteligencia artificial', 'contratacoes publicas', 'governanca', 'fiscalizacao'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-02-18T08:00:00Z',
    readingTimeMin: 4,
    featured: true,
    seoTitle: 'TCU regulamenta uso de IA em contratacoes publicas | ATA360 Noticias',
    seoDescription: 'TCU publica orientacoes sobre inteligencia artificial em compras publicas: rastreabilidade, transparencia e revisao humana obrigatoria.',
    relatedSlugs: ['pncp-supera-2-milhoes-contratacoes-publicadas', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['tcu', 'licitacao', 'ia-generativa'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'LINDB Art. 20 e 28', 'LGPD Lei 13.709/2018'],
    sourceUrl: 'https://portal.tcu.gov.br/',
    sourceName: 'TCU',
  },
  {
    slug: 'pncp-supera-2-milhoes-contratacoes-publicadas',
    title: 'PNCP supera 2 milhoes de contratacoes publicadas e se consolida como base nacional',
    excerpt: 'O Portal Nacional de Contratacoes Publicas atingiu a marca de 2 milhoes de publicacoes. Entenda o que isso significa para a pesquisa de precos e transparencia no seu municipio.',
    content: `## PNCP se consolida como a principal base de dados de compras publicas do Brasil

O Portal Nacional de Contratacoes Publicas (PNCP) atingiu a marca de 2 milhoes de contratacoes publicadas, consolidando-se como a principal base de dados para pesquisa de precos e transparencia em compras publicas no Brasil.

### Numeros do PNCP

- **2 milhoes+** de contratacoes publicadas
- **5.570 municipios** com dados disponiveis
- **Todas as esferas**: federal, estadual e municipal
- **Acesso aberto**: qualquer cidadao pode consultar

### O que muda para pregoeiros e gestores

Com 2 milhoes de registros, o PNCP se torna a fonte mais robusta para:

1. **Pesquisa de precos**: encontrar contratacoes similares para fundamentar o preco de referencia conforme a IN 65/2021
2. **Benchmarking**: comparar precos praticados por orgaos de porte similar
3. **Transparencia**: publicar seus proprios processos conforme exigido pela Lei 14.133/2021

### Desafio: como consultar 2 milhoes de registros

A quantidade de dados e uma vantagem, mas tambem um desafio. Pesquisar manualmente o PNCP e inviavel para equipes reduzidas. E aqui que a automacao faz diferenca.

O ATA360 consulta automaticamente o PNCP e outras 16 fontes oficiais, filtrando contratacoes por CATSER, regiao e periodo — entregando ao servidor uma pesquisa de precos completa em minutos, nao em horas.

### Oportunidade

Municipios que utilizam o PNCP como fonte primaria de pesquisa de precos demonstram conformidade com a IN 65/2021 e reduzem o risco de questionamento por parte de orgaos de controle.

**Fonte:** [Portal Nacional de Contratacoes Publicas — PNCP](https://www.gov.br/pncp)`,
    category: 'gestao-publica',
    tags: ['PNCP', 'pesquisa de precos', 'transparencia', 'contratacoes publicas', 'dados abertos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-17T08:00:00Z',
    updatedAt: '2026-02-17T08:00:00Z',
    readingTimeMin: 4,
    featured: true,
    seoTitle: 'PNCP supera 2 milhoes de contratacoes publicadas | ATA360 Noticias',
    seoDescription: 'Portal Nacional de Contratacoes Publicas atinge 2 milhoes de publicacoes. Saiba o impacto na pesquisa de precos e transparencia do seu municipio.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pncp', 'pesquisa-de-precos', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 174', 'IN SEGES/ME 65/2021'],
    sourceUrl: 'https://www.gov.br/pncp',
    sourceName: 'Gov.br / PNCP',
  },
  {
    slug: 'mgi-publica-guia-planejamento-contratacoes-2026',
    title: 'MGI publica guia atualizado para planejamento de contratacoes em 2026',
    excerpt: 'O Ministerio da Gestao e da Inovacao atualizou o guia de planejamento de contratacoes com novas orientacoes sobre ETP, DFD e gestao de riscos. Veja o que mudou.',
    content: `## Novo guia de planejamento de contratacoes do MGI

O Ministerio da Gestao e da Inovacao em Servicos Publicos (MGI) publicou uma atualizacao do guia de planejamento de contratacoes, com novas orientacoes sobre a fase preparatoria exigida pela Lei 14.133/2021.

### Principais atualizacoes

O guia traz orientacoes revisadas sobre:

- **DFD (Documento de Formalizacao de Demanda)**: novo modelo com campos obrigatorios para vinculacao ao PCA
- **ETP (Estudo Tecnico Preliminar)**: reforco de que o ETP diagnostica o problema, nao descreve o objeto
- **Gestao de Riscos**: nova matriz de riscos simplificada para municipios de pequeno porte
- **PCA (Plano de Contratacoes Anual)**: integracao obrigatoria com a LOA e o PPA
- **Pesquisa de precos**: atualizacao de procedimentos conforme evolucao do PNCP

### Impacto para estados e municipios

Embora o guia seja direcionado a administracao federal, estados e municipios vem adotando as mesmas diretrizes como referencia de boas praticas — especialmente apos a obrigatoriedade da Lei 14.133/2021 desde abril de 2024.

### O que o gestor deve fazer agora

1. Revisar o PCA 2026 do orgao e verificar alinhamento com as novas orientacoes
2. Atualizar modelos de DFD e ETP conforme o novo guia
3. Capacitar a equipe de compras sobre as mudancas
4. Garantir que a pesquisa de precos utiliza as fontes recomendadas

O ATA360 ja incorpora as diretrizes do MGI em seus modelos de documentos. DFD, ETP, TR e Mapa de Riscos sao gerados com fundamentacao legal atualizada e campos alinhados ao novo guia.

### Oportunidade

Orgaos que se anteciparem na adocao das novas diretrizes demonstram maturidade em governanca — um diferencial cada vez mais valorizado pelo TCU e pelos TCEs.

**Fonte:** [Ministerio da Gestao e da Inovacao em Servicos Publicos — MGI](https://www.gov.br/gestao/)`,
    category: 'legislacao',
    tags: ['MGI', 'planejamento', 'DFD', 'ETP', 'PCA', 'contratacoes publicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-16T08:00:00Z',
    updatedAt: '2026-02-16T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'MGI atualiza guia de planejamento de contratacoes 2026 | ATA360 Noticias',
    seoDescription: 'Ministerio da Gestao publica guia atualizado sobre DFD, ETP, gestao de riscos e PCA para contratacoes em 2026. Veja o que mudou.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'pncp-supera-2-milhoes-contratacoes-publicadas'],
    glossaryTerms: ['etp', 'dfd', 'pca', 'termo-de-referencia'],
    legalReferences: ['Lei 14.133/2021 Art. 18', 'IN SEGES/ME 65/2021', 'IN SEGES/ME 58/2022'],
    sourceUrl: 'https://www.gov.br/gestao/',
    sourceName: 'MGI / Gov.br',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

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
