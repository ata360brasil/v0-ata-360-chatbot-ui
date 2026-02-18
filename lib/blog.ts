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
  {
    slug: 'cgu-painel-transparencia-contratacoes-emergenciais',
    title: 'CGU lanca painel de transparencia para contratacoes emergenciais',
    excerpt: 'A Controladoria-Geral da Uniao disponibilizou painel interativo para acompanhar contratacoes emergenciais em tempo real. Veja como usar para benchmarking.',
    content: `## CGU amplia transparencia em contratacoes emergenciais

A Controladoria-Geral da Uniao (CGU) lancou um painel interativo que permite acompanhar contratacoes emergenciais realizadas por orgaos federais, estaduais e municipais em tempo real.

### O que o painel oferece

- **Dados em tempo real**: contratacoes emergenciais por dispensa de licitacao (Art. 75, Lei 14.133)
- **Filtros avancados**: por UF, orgao, objeto, valor e periodo
- **Comparativos**: benchmarking de precos entre orgaos similares
- **Download**: dados abertos em CSV para analise propria

### Por que isso importa

Contratacoes emergenciais sao frequentemente alvo de questionamento por orgaos de controle. Com dados transparentes e comparaveis, gestores podem:

1. Fundamentar melhor o preco de referencia em situacoes de urgencia
2. Demonstrar razoabilidade do valor contratado
3. Identificar fornecedores com historico de entregas em emergencias

### Como o ATA360 se conecta

O ATA360 ja integra dados da CGU em suas pesquisas de precos, incluindo contratacoes emergenciais. Ao gerar um mapa de precos, o sistema cruza automaticamente dados do PNCP, Painel CGU e outras fontes para entregar a fundamentacao mais completa possivel.

**Fonte:** [Controladoria-Geral da Uniao — CGU](https://www.gov.br/cgu/)`,
    category: 'compliance',
    tags: ['CGU', 'transparencia', 'fiscalizacao', 'pesquisa de precos', 'contratacoes emergenciais'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-02-15T08:00:00Z',
    readingTimeMin: 3,
    featured: false,
    seoTitle: 'CGU lanca painel de transparencia para contratacoes emergenciais | ATA360 Noticias',
    seoDescription: 'CGU disponibiliza painel interativo para acompanhar contratacoes emergenciais em tempo real. Saiba como usar para benchmarking.',
    relatedSlugs: ['pncp-supera-2-milhoes-contratacoes-publicadas', 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026'],
    glossaryTerms: ['cgu', 'dispensa-licitacao', 'pesquisa-de-precos'],
    legalReferences: ['Lei 14.133/2021 Art. 75', 'Lei 12.527/2011 (LAI)'],
    sourceUrl: 'https://www.gov.br/cgu/',
    sourceName: 'CGU',
  },
  {
    slug: 'governo-amplia-prazo-municipios-pncp',
    title: 'Governo federal amplia prazo para municipios aderirem ao PNCP',
    excerpt: 'Municipios de pequeno porte ganham prazo adicional para publicacao obrigatoria no PNCP. Entenda o que muda e como se preparar.',
    content: `## Prazo estendido para adesao ao PNCP

O Governo Federal publicou decreto estendendo o prazo para que municipios de pequeno porte (ate 50 mil habitantes) realizem a publicacao obrigatoria de suas contratacoes no Portal Nacional de Contratacoes Publicas (PNCP).

### O que mudou

- **Novo prazo**: municipios de ate 50 mil habitantes tem ate dezembro de 2026
- **Obrigatoriedade mantida**: todos os municipios deverao publicar no PNCP
- **Capacitacao**: ENAP e MGI oferecerao treinamentos gratuitos
- **Suporte tecnico**: equipe do PNCP disponivel para integracao via API

### Impacto pratico

Dos 5.570 municipios brasileiros, cerca de 4.000 tem menos de 50 mil habitantes. Muitos ainda enfrentam dificuldades operacionais para publicar no PNCP — falta de equipe, sistemas legados e desconhecimento da plataforma.

A extensao do prazo e uma oportunidade para que esses municipios se preparem adequadamente, mas nao deve ser vista como motivo para postergar.

### Como se preparar

1. Cadastrar o orgao no PNCP (se ainda nao o fez)
2. Treinar a equipe de compras na publicacao de documentos
3. Avaliar integracao do sistema de compras com a API do PNCP
4. Planejar a migracao de processos para conformidade com a Lei 14.133/2021

O ATA360 ja realiza publicacao automatica no PNCP, eliminando o trabalho manual e garantindo conformidade desde o primeiro processo.

**Fonte:** [Portal Nacional de Contratacoes Publicas — PNCP](https://www.gov.br/pncp)`,
    category: 'legislacao',
    tags: ['PNCP', 'Lei 14.133', 'municipios', 'transparencia', 'gestao publica'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-02-14T08:00:00Z',
    readingTimeMin: 4,
    featured: false,
    seoTitle: 'Governo amplia prazo para municipios aderirem ao PNCP | ATA360 Noticias',
    seoDescription: 'Municipios de pequeno porte ganham prazo adicional para publicacao obrigatoria no PNCP. Veja como se preparar.',
    relatedSlugs: ['pncp-supera-2-milhoes-contratacoes-publicadas', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pncp', 'licitacao', 'lei-14133'],
    legalReferences: ['Lei 14.133/2021 Art. 174', 'Lei 14.133/2021 Art. 176'],
    sourceUrl: 'https://www.gov.br/pncp',
    sourceName: 'Gov.br / PNCP',
  },
  {
    slug: 'enap-curso-gratuito-lei-14133-2026',
    title: 'ENAP abre inscricoes para curso gratuito sobre Lei 14.133/2021',
    excerpt: 'A Escola Nacional de Administracao Publica abre inscricoes para turma 2026 do curso sobre a nova lei de licitacoes. Vagas limitadas.',
    content: `## Curso gratuito da ENAP sobre a nova lei de licitacoes

A Escola Nacional de Administracao Publica (ENAP) abriu inscricoes para a turma 2026 do curso online e gratuito sobre a Lei 14.133/2021 — a nova lei de licitacoes e contratos.

### Detalhes do curso

- **Formato**: 100% online, autoinstrucional
- **Carga horaria**: 40 horas
- **Custo**: gratuito
- **Certificado**: emitido pela ENAP (valido para progressao funcional)
- **Publico-alvo**: servidores publicos de todas as esferas

### Conteudo programatico

1. Visao geral da Lei 14.133/2021
2. Fase preparatoria: DFD, ETP, TR e Mapa de Riscos
3. Modalidades licitatorias e criterios de julgamento
4. Gestao e fiscalizacao de contratos
5. Portal Nacional de Contratacoes Publicas (PNCP)

### Por que fazer

Com a obrigatoriedade plena da Lei 14.133/2021 desde abril de 2024, capacitar a equipe de compras nao e opcional — e requisito para evitar responsabilizacao pessoal e garantir a legalidade dos processos.

O ATA360 complementa a formacao teorica com ferramentas praticas: IA que gera documentos conforme a Lei 14.133, pesquisa de precos automatizada e modelos atualizados de ETP, TR e DFD.

**Fonte:** [Escola Nacional de Administracao Publica — ENAP](https://www.enap.gov.br/)`,
    category: 'gestao-publica',
    tags: ['ENAP', 'Lei 14.133', 'capacitacao', 'ETP', 'DFD'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-13T08:00:00Z',
    updatedAt: '2026-02-13T08:00:00Z',
    readingTimeMin: 3,
    featured: false,
    seoTitle: 'ENAP abre inscricoes para curso gratuito sobre Lei 14.133/2021 | ATA360 Noticias',
    seoDescription: 'ENAP abre turma 2026 do curso online e gratuito sobre a nova lei de licitacoes (Lei 14.133/2021). Vagas limitadas.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'governo-amplia-prazo-municipios-pncp'],
    glossaryTerms: ['lei-14133', 'etp', 'dfd', 'termo-de-referencia'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.246/2022'],
    sourceUrl: 'https://www.enap.gov.br/',
    sourceName: 'ENAP',
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
