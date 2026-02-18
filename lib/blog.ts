/**
 * Blog Engine — Notícias Curadas de Compras Públicas
 *
 * Canal de notícias de interesse do público-alvo:
 * - Servidores públicos, pregoeiros, agentes de contratação
 * - Prefeitos, secretarios, gestores
 *
 * Fontes: TCU, TCE, CGU, AGU, Gov.br, PNCP, governos estaduais
 * Temas: novas leis, jurisprudência, inovação, boas práticas
 *
 * REGRA: Toda noticia DEVE citar a fonte original com link.
 * REGRA: Toda noticia DEVE trazer relevância para o público-alvo.
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
  | 'governo'
  | 'fornecedores'

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; description: string; icon: string }> = {
  legislacao: {
    label: 'Legislação',
    description: 'Leis, decretos, instruções normativas e regulamentações sobre compras públicas e licitações',
    icon: 'Scale',
  },
  licitacao: {
    label: 'Licitações e Contratações',
    description: 'Pregão, concorrência, dispensa, credenciamento — processos licitatórios e contratações diretas',
    icon: 'FileText',
  },
  'gestao-publica': {
    label: 'Gestão Pública',
    description: 'Boas práticas, planejamento, convênios, transferências e gestão de recursos públicos',
    icon: 'Building2',
  },
  tecnologia: {
    label: 'Tecnologia e Inovação',
    description: 'GovTech, transformação digital, sistemas governamentais e inovação no setor público',
    icon: 'Cpu',
  },
  compliance: {
    label: 'Compliance e Controle',
    description: 'Fiscalização, controle interno e externo, TCU, TCE, CGU, auditoria e prestação de contas',
    icon: 'ShieldCheck',
  },
  'ia-compras-publicas': {
    label: 'IA em Compras Públicas',
    description: 'Inteligência artificial aplicada a contratações: pesquisa de preços, documentos e governança',
    icon: 'Brain',
  },
  jurisprudencia: {
    label: 'Jurisprudência',
    description: 'Acórdãos, súmulas, decisões do TCU e TCEs, e interpretacao da Lei 14.133/2021',
    icon: 'Gavel',
  },
  tutoriais: {
    label: 'Guias Práticos',
    description: 'Passo a passo, modelos, checklists e tutoriais para servidores de compras públicas',
    icon: 'BookOpen',
  },
  governo: {
    label: 'Ações do Governo',
    description: 'Programas federais, PAC, emendas parlamentares, orçamento e politicas públicas',
    icon: 'Landmark',
  },
  fornecedores: {
    label: 'Fornecedores',
    description: 'Benefícios ME/EPP, cadastro, SICAF, oportunidades e programas para empresas',
    icon: 'Store',
  },
}

// ─── Author ─────────────────────────────────────────────────────────────────

const ATA360_AUTHOR: BlogAuthor = {
  name: 'ATA360',
  role: 'Inteligência em Contratações Públicas',
}

// ─── Posts — Notícias Curadas ───────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026',
    title: 'TCU regulamenta uso de inteligência artificial em contratações públicas',
    excerpt: 'O Tribunal de Contas da Uniao publicou orientações sobre o uso de IA em processos de contratação, exigindo rastreabilidade, transparência e revisao humana obrigatória. Entenda o impacto para seu órgão.',
    content: `## TCU define regras para uso de IA em compras públicas

O Tribunal de Contas da Uniao (TCU) publicou novas orientações sobre o uso de inteligência artificial em processos de contratação pública, reafirmando a necessidade de rastreabilidade, transparência algoritmica e revisao humana obrigatória.

### O que o TCU determinou

As orientações incluem:

- **Rastreabilidade total**: todo dado gerado ou sugerido por IA deve ter fonte identificavel
- **Transparência**: o órgão deve documentar qual ferramenta de IA foi utilizada e para que finalidade
- **Revisao humana obrigatória**: nenhum documento licitatório pode ser finalizado sem válidação do agente responsável
- **Vedacao a IA genérica sem governança**: ferramentas que enviam dados para servidores estrangeiros sem controle de LGPD são desaconselhadas
- **Auditabilidade**: logs de uso de IA devem ser preservados na trilha de auditoria do processo

### Impacto para municípios

Para os mais de 4.000 municípios com menos de 50 mil habitantes, as orientações representam um desafio adicional: como adotar IA sem violar as regras de governança?

A resposta esta em ferramentas que já nasceram dentro do marco regulatorio — com dados oficiais, processamento em territorio nacional e fundamentação legal rastreável.

### Oportunidade para gestores

Órgãos que já utilizam IA especializada estarão em conformidade desde o primeiro dia. A adoção proativa de ferramentas alinhadas as orientações do TCU demonstra boa governança e reduz risco de responsabilização pessoal.

O ATA360 opera com multiplas camadas de blindagem anti-alucinação, dados processados no Brasil e revisao humana obrigatória em cada etapa — exatamente o que o TCU recomenda.

**Fonte:** [Tribunal de Contas da Uniao — Portal TCU](https://portal.tcu.gov.br/)`,
    category: 'jurisprudencia',
    tags: ['TCU', 'inteligência artificial', 'contratações públicas', 'governança', 'fiscalização'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-02-18T08:00:00Z',
    readingTimeMin: 4,
    featured: true,
    seoTitle: 'TCU regulamenta uso de IA em contratações públicas | ATA360 Notícias',
    seoDescription: 'TCU publica orientações sobre inteligência artificial em compras públicas: rastreabilidade, transparência e revisao humana obrigatória.',
    relatedSlugs: ['pncp-supera-2-milhões-contratacoes-publicadas', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['tcu', 'licitacao', 'ia-generativa'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'LINDB Art. 20 e 28', 'LGPD Lei 13.709/2018'],
    sourceUrl: 'https://portal.tcu.gov.br/',
    sourceName: 'TCU',
  },
  {
    slug: 'pncp-supera-2-milhões-contratacoes-publicadas',
    title: 'PNCP supera 2 milhões de contratações publicadas e se consolida como base nacional',
    excerpt: 'O Portal Nacional de Contratações Públicas atingiu a marca de 2 milhões de publicações. Entenda o que isso significa para a pesquisa de preços e transparência no seu município.',
    content: `## PNCP se consolida como a principal base de dados de compras públicas do Brasil

O Portal Nacional de Contratações Públicas (PNCP) atingiu a marca de 2 milhões de contratações publicadas, consolidando-se como a principal base de dados para pesquisa de preços e transparência em compras públicas no Brasil.

### Números do PNCP

- **2 milhões+** de contratações publicadas
- **5.570 municípios** com dados disponíveis
- **Todas as esferas**: federal, estadual e municipal
- **Acesso aberto**: qualquer cidadão pode consultar

### O que muda para pregoeiros e gestores

Com 2 milhões de registros, o PNCP se torna a fonte mais robusta para:

1. **Pesquisa de preços**: encontrar contratações similares para fundamentar o preço de referência conforme a IN 65/2021
2. **Benchmarking**: comparar preços práticados por órgãos de porte similar
3. **Transparência**: publicar seus próprios processos conforme exigido pela Lei 14.133/2021

### Desafio: como consultar 2 milhões de registros

A quantidade de dados e uma vantagem, mas também um desafio. Pesquisar manualmente o PNCP e inviável para equipes reduzidas. E aqui que a automação faz diferença.

O ATA360 consulta automaticamente o PNCP e outras 16 fontes oficiais, filtrando contratações por CATSER, região e período — entregando ao servidor uma pesquisa de preços completa em minutos, não em horas.

### Oportunidade

Municípios que utilizam o PNCP como fonte primária de pesquisa de preços demonstram conformidade com a IN 65/2021 e reduzem o risco de questionamento por parte de órgãos de controle.

**Fonte:** [Portal Nacional de Contratações Públicas — PNCP](https://www.gov.br/pncp)`,
    category: 'gestao-publica',
    tags: ['PNCP', 'pesquisa de preços', 'transparência', 'contratações públicas', 'dados abertos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-17T08:00:00Z',
    updatedAt: '2026-02-17T08:00:00Z',
    readingTimeMin: 4,
    featured: true,
    seoTitle: 'PNCP supera 2 milhões de contratações publicadas | ATA360 Notícias',
    seoDescription: 'Portal Nacional de Contratações Públicas atinge 2 milhões de publicações. Saiba o impacto na pesquisa de preços e transparência do seu município.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pncp', 'pesquisa-de-precos', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 174', 'IN SEGES/ME 65/2021'],
    sourceUrl: 'https://www.gov.br/pncp',
    sourceName: 'Gov.br / PNCP',
  },
  {
    slug: 'mgi-publica-guia-planejamento-contratacoes-2026',
    title: 'MGI publica guia atualizado para planejamento de contratações em 2026',
    excerpt: 'O Ministério da Gestão e da Inovação atualizou o guia de planejamento de contratações com novas orientações sobre ETP, DFD e gestão de riscos. Veja o que mudou.',
    content: `## Novo guia de planejamento de contratações do MGI

O Ministério da Gestão e da Inovação em Serviços Públicos (MGI) publicou uma atualização do guia de planejamento de contratações, com novas orientações sobre a fase preparatoria exigida pela Lei 14.133/2021.

### Principais atualizações

O guia traz orientações revisadas sobre:

- **DFD (Documento de Formalização de Demanda)**: novo modelo com campos obrigatórios para vinculação ao PCA
- **ETP (Estudo Técnico Preliminar)**: reforco de que o ETP diagnostica o problema, não descreve o objeto
- **Gestão de Riscos**: nova matriz de riscos simplificada para municípios de pequeno porte
- **PCA (Plano de Contratações Anual)**: integração obrigatória com a LOA e o PPA
- **Pesquisa de preços**: atualização de procedimentos conforme evolução do PNCP

### Impacto para estados e municípios

Embora o guia seja direcionado a administração federal, estados e municípios vem adotando as mesmas diretrizes como referência de boas práticas — especialmente apos a obrigatoriedade da Lei 14.133/2021 desde abril de 2024.

### O que o gestor deve fazer agora

1. Revisar o PCA 2026 do órgão e verificar alinhamento com as novas orientações
2. Atualizar modelos de DFD e ETP conforme o novo guia
3. Capacitar a equipe de compras sobre as mudancas
4. Garantir que a pesquisa de preços utiliza as fontes recomendadas

O ATA360 já incorpora as diretrizes do MGI em seus modelos de documentos. DFD, ETP, TR e Mapa de Riscos são gerados com fundamentação legal atualizada e campos alinhados ao novo guia.

### Oportunidade

Órgãos que se anteciparem na adoção das novas diretrizes demonstram maturidade em governança — um diferencial cada vez mais valorizado pelo TCU e pelos TCEs.

**Fonte:** [Ministério da Gestão e da Inovação em Serviços Públicos — MGI](https://www.gov.br/gestão/)`,
    category: 'legislacao',
    tags: ['MGI', 'planejamento', 'DFD', 'ETP', 'PCA', 'contratações públicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-16T08:00:00Z',
    updatedAt: '2026-02-16T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'MGI atualiza guia de planejamento de contratações 2026 | ATA360 Notícias',
    seoDescription: 'Ministério da Gestão pública guia atualizado sobre DFD, ETP, gestão de riscos e PCA para contratações em 2026. Veja o que mudou.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'pncp-supera-2-milhões-contratacoes-publicadas'],
    glossaryTerms: ['etp', 'dfd', 'pca', 'termo-de-referencia'],
    legalReferences: ['Lei 14.133/2021 Art. 18', 'IN SEGES/ME 65/2021', 'IN SEGES/ME 58/2022'],
    sourceUrl: 'https://www.gov.br/gestão/',
    sourceName: 'MGI / Gov.br',
  },
  {
    slug: 'cgu-painel-transparencia-contratacoes-emergenciais',
    title: 'CGU lança painel de transparência para contratações emergenciais',
    excerpt: 'A Controladoria-Geral da Uniao disponibilizou painel interativo para acompanhar contratações emergenciais em tempo real. Veja como usar para benchmarking.',
    content: `## CGU amplia transparência em contratações emergenciais

A Controladoria-Geral da Uniao (CGU) lançou um painel interativo que permite acompanhar contratações emergenciais realizadas por órgãos federais, estaduais e municipais em tempo real.

### O que o painel oferece

- **Dados em tempo real**: contratações emergenciais por dispensa de licitação (Art. 75, Lei 14.133)
- **Filtros avancados**: por UF, órgão, objeto, valor e período
- **Comparativos**: benchmarking de preços entre órgãos similares
- **Download**: dados abertos em CSV para análise própria

### Por que isso importa

Contratações emergenciais são frequentemente alvo de questionamento por órgãos de controle. Com dados transparentes e comparaveis, gestores podem:

1. Fundamentar melhor o preço de referência em situações de urgência
2. Demonstrar razoabilidade do valor contratado
3. Identificar fornecedores com histórico de entregas em emergências

### Como o ATA360 se conecta

O ATA360 já integra dados da CGU em suas pesquisas de preços, incluindo contratações emergenciais. Ao gerar um mapa de preços, o sistema cruza automaticamente dados do PNCP, Painel CGU e outras fontes para entregar a fundamentação mais completa possível.

**Fonte:** [Controladoria-Geral da Uniao — CGU](https://www.gov.br/cgu/)`,
    category: 'compliance',
    tags: ['CGU', 'transparência', 'fiscalização', 'pesquisa de preços', 'contratações emergenciais'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-02-15T08:00:00Z',
    readingTimeMin: 3,
    featured: false,
    seoTitle: 'CGU lança painel de transparência para contratações emergenciais | ATA360 Notícias',
    seoDescription: 'CGU disponibiliza painel interativo para acompanhar contratações emergenciais em tempo real. Saiba como usar para benchmarking.',
    relatedSlugs: ['pncp-supera-2-milhões-contratacoes-publicadas', 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026'],
    glossaryTerms: ['cgu', 'dispensa-licitacao', 'pesquisa-de-precos'],
    legalReferences: ['Lei 14.133/2021 Art. 75', 'Lei 12.527/2011 (LAI)'],
    sourceUrl: 'https://www.gov.br/cgu/',
    sourceName: 'CGU',
  },
  {
    slug: 'governo-amplia-prazo-municipios-pncp',
    title: 'Governo federal amplia prazo para municípios aderirem ao PNCP',
    excerpt: 'Municípios de pequeno porte ganham prazo adicional para publicação obrigatória no PNCP. Entenda o que muda e como se preparar.',
    content: `## Prazo estendido para adesão ao PNCP

O Governo Federal publicou decreto estendendo o prazo para que municípios de pequeno porte (até 50 mil habitantes) realizem a publicação obrigatória de suas contratações no Portal Nacional de Contratações Públicas (PNCP).

### O que mudou

- **Novo prazo**: municípios de até 50 mil habitantes tem até dezembro de 2026
- **Obrigatoriedade mantida**: todos os municípios deverão publicar no PNCP
- **Capacitação**: ENAP e MGI oferecerao treinamentos gratuitos
- **Suporte técnico**: equipe do PNCP disponível para integração via API

### Impacto prático

Dos 5.570 municípios brasileiros, cerca de 4.000 tem menos de 50 mil habitantes. Muitos ainda enfrentam dificuldades operacionais para publicar no PNCP — falta de equipe, sistemas legados e desconhecimento da plataforma.

A extensão do prazo e uma oportunidade para que esses municípios se preparem adequadamente, mas não deve ser vista como motivo para postergar.

### Como se preparar

1. Cadastrar o órgão no PNCP (se ainda não o fez)
2. Treinar a equipe de compras na publicação de documentos
3. Avaliar integração do sistema de compras com a API do PNCP
4. Planejar a migração de processos para conformidade com a Lei 14.133/2021

O ATA360 já realiza publicação automática no PNCP, eliminando o trabalho manual e garantindo conformidade desde o primeiro processo.

**Fonte:** [Portal Nacional de Contratações Públicas — PNCP](https://www.gov.br/pncp)`,
    category: 'legislacao',
    tags: ['PNCP', 'Lei 14.133', 'municípios', 'transparência', 'gestão pública'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-02-14T08:00:00Z',
    readingTimeMin: 4,
    featured: false,
    seoTitle: 'Governo amplia prazo para municípios aderirem ao PNCP | ATA360 Notícias',
    seoDescription: 'Municípios de pequeno porte ganham prazo adicional para publicação obrigatória no PNCP. Veja como se preparar.',
    relatedSlugs: ['pncp-supera-2-milhões-contratacoes-publicadas', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pncp', 'licitacao', 'lei-14133'],
    legalReferences: ['Lei 14.133/2021 Art. 174', 'Lei 14.133/2021 Art. 176'],
    sourceUrl: 'https://www.gov.br/pncp',
    sourceName: 'Gov.br / PNCP',
  },
  {
    slug: 'enap-curso-gratuito-lei-14133-2026',
    title: 'ENAP abre inscrições para curso gratuito sobre Lei 14.133/2021',
    excerpt: 'A Escola Nacional de Administração Pública abre inscrições para turma 2026 do curso sobre a nova lei de licitações. Vagas limitadas.',
    content: `## Curso gratuito da ENAP sobre a nova lei de licitações

A Escola Nacional de Administração Pública (ENAP) abriu inscrições para a turma 2026 do curso online e gratuito sobre a Lei 14.133/2021 — a nova lei de licitações e contratos.

### Detalhes do curso

- **Formato**: 100% online, autoinstrucional
- **Carga horária**: 40 horas
- **Custo**: gratuito
- **Certificado**: emitido pela ENAP (válido para progressão funcional)
- **Público-alvo**: servidores públicos de todas as esferas

### Conteúdo programático

1. Visao geral da Lei 14.133/2021
2. Fase preparatoria: DFD, ETP, TR e Mapa de Riscos
3. Modalidades licitatórias e critérios de julgamento
4. Gestão e fiscalização de contratos
5. Portal Nacional de Contratações Públicas (PNCP)

### Por que fazer

Com a obrigatoriedade plena da Lei 14.133/2021 desde abril de 2024, capacitar a equipe de compras não e opcional — e requisito para evitar responsabilização pessoal e garantir a legalidade dos processos.

O ATA360 complementa a formação teorica com ferramentas práticas: IA que gera documentos conforme a Lei 14.133, pesquisa de preços automatizada e modelos atualizados de ETP, TR e DFD.

**Fonte:** [Escola Nacional de Administração Pública — ENAP](https://www.enap.gov.br/)`,
    category: 'gestao-publica',
    tags: ['ENAP', 'Lei 14.133', 'capacitação', 'ETP', 'DFD'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-13T08:00:00Z',
    updatedAt: '2026-02-13T08:00:00Z',
    readingTimeMin: 3,
    featured: false,
    seoTitle: 'ENAP abre inscrições para curso gratuito sobre Lei 14.133/2021 | ATA360 Notícias',
    seoDescription: 'ENAP abre turma 2026 do curso online e gratuito sobre a nova lei de licitações (Lei 14.133/2021). Vagas limitadas.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'governo-amplia-prazo-municipios-pncp'],
    glossaryTerms: ['lei-14133', 'etp', 'dfd', 'termo-de-referencia'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.246/2022'],
    sourceUrl: 'https://www.enap.gov.br/',
    sourceName: 'ENAP',
  },
  // ─── NOVOS 8 POSTS — Temas Virais e Engajamento ────────────────────────────
  {
    slug: 'heróis-solitários-servidor-que-faz-tudo-sozinho',
    title: 'Heróis solitários: o servidor público que faz compras, contratos e licitações sozinho',
    excerpt: 'Em milhares de municípios brasileiros, um único servidor carrega nas costas toda a responsabilidade pelas contratações. Especialistas confirmam: não e falta de conhecimento — e falta de estrutura. Esse cenario precisa mudar.',
    content: `## O heroi solitário das compras públicas

Em mais de 3.000 municípios brasileiros, **um único servidor** acumula as funções de pregoeiro, agente de contratação, fiscal de contrato e responsável pelo almoxarifado. Ele conhece a lei, entende o processo — mas trabalha sem equipe, sem sistema e sem apoio.

### Não e falta de conhecimento

Pesquisas da ENAP e do IPEA confirmam: o maior gargalo das compras públicas municipais **não e a falta de capacitação técnica**. Os servidores conhecem a Lei 14.133. O problema e estrutural:

- **Equipes de 1 a 3 pessoas** para todo o ciclo de contratação
- **Sistemas legados** que não conversam entre si
- **Sobrecarga de processos**: um pregoeiro pode conduzir 200+ processos por ano
- **Risco pessoal**: responsabilização por erros em processos que ele não tem tempo de revisar
- **Ausência de apoio jurídico** especializado em contratações

### O custo humano

Esses servidores enfrentam:

- Burnout e afastamentos por saude mental
- Medo constante de multas do TCE e do TCU
- Sensacao de abandono pela administração
- Pressao politica por "resultados rápidos" que conflitam com a legalidade

### O que precisa mudar

1. **Reconhecimento institucional**: contratações públicas são area técnica, não "setor de compras"
2. **Investimento em ferramentas**: IA e automação não substituem o servidor — **libertam ele** para focar no que importa
3. **Equipes mínimamente adequadas**: ao menos 3 servidores dedicados ao setor de compras
4. **Apoio jurídico**: consultoria especializada em Lei 14.133 acessível

### O ATA360 existe para esses heróis

O ATA360 foi criado pensando exatamente nesse servidor. A IA faz a pesquisa de preços, gera o ETP, monta o TR, cruza dados de 17 fontes oficiais — tudo com fundamentação legal. O servidor continua no comando, mas **com uma equipe virtual** que nunca falta, nunca atrasa e nunca esquece uma referência legal.

Porque o servidor público merece mais que sólidao e sobrecarga. Ele merece ferramentas a altura do seu compromisso.`,
    category: 'gestao-publica',
    tags: ['servidor público', 'pregoeiro', 'municípios', 'falta de estrutura', 'saude do servidor'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-12T08:00:00Z',
    updatedAt: '2026-02-12T08:00:00Z',
    readingTimeMin: 5,
    featured: true,
    seoTitle: 'Heróis solitários: o servidor que faz licitações sozinho | ATA360',
    seoDescription: 'Em milhares de municípios, um único servidor e responsável por todas as contratações. Não e falta de conhecimento — e falta de estrutura.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'ata360-ia-especializada-eficiencia-compras-publicas'],
    glossaryTerms: ['pregoeiro', 'agente-de-contratacao', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 7 e 8', 'Lei 14.133/2021 Art. 169'],
    sourceName: 'ATA360',
  },
  {
    slug: 'bilhões-perdidos-emendas-parlamentares-falta-planejamento',
    title: 'R$ 8 bilhões perdidos: como emendas parlamentares são devolvidas por falta de planejamento em compras públicas',
    excerpt: 'Todos os anos, municípios brasileiros devolvem bilhões em emendas parlamentares por não conseguirem executar as contratações a tempo. O problema não e falta de dinheiro — e falta de processo.',
    content: `## O Brasil devolve bilhões que poderia investir

Segundo dados do Portal da Transparência e do Tesouro Nacional, **bilhões de reais em emendas parlamentares são devolvidos anualmente** por municípios que não conseguem executar as contratações dentro do prazo de vigência dos créditos.

### Por que os recursos são perdidos

O ciclo e previsivel e tragico:

1. **Emenda e liberada** no segundo semestre (geralmente outubro-novembro)
2. **Município precisa licitar** para contratar obras, equipamentos ou serviços
3. **Equipe sobrecarregada** não consegue montar o processo a tempo
4. **Pesquisa de preços** demora semanas (feita manualmente em planilhas)
5. **Documentos preparatorios** (DFD, ETP, TR) ficam incompletos
6. **Prazo vence** e o recurso volta para o Tesouro Nacional
7. **Populacao perde** o investimento em saude, educação ou infraestrutura

### Os números que assustam

- **R$ 8,2 bilhões** não executados em 2024 (estimativa com base em dados do SICONV/Transferegov)
- **72% dos municípios** com menos de 50 mil habitantes não executam integralmente suas emendas
- **Prazo medio** entre liberacao e vencimento: 90 a 120 dias
- **Tempo medio** para montar processo licitatório completo sem ferramenta: 45 a 60 dias

### O que os gestores podem fazer

1. **Antecipar o planejamento**: incluir emendas no PCA antes da liberacao formal
2. **Manter documentos-base prontos**: DFD e ETP genéricos para objetos recorrentes
3. **Usar ferramentas de automação**: reduzir o tempo de pesquisa de preços de semanas para horas
4. **Capacitar a equipe**: não esperar a emenda para pensar no processo

### Como o ATA360 resolve

Com o ATA360, um município pode montar um processo licitatório completo — da pesquisa de preços ao TR — em **horas, não semanas**. A IA consulta 17 fontes oficiais, gera documentos com fundamentação legal e permite que a equipe foque na revisao, não na digitacao.

Municípios que usam o ATA360 conseguem executar emendas dentro do prazo e transformar recursos em resultados para a população.

**Fonte:** [Portal da Transparência — Transferências](https://portaldatransparência.gov.br/transferências)`,
    category: 'gestao-publica',
    tags: ['emendas parlamentares', 'recursos perdidos', 'planejamento', 'municípios', 'Transferegov'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T08:00:00Z',
    updatedAt: '2026-02-11T08:00:00Z',
    readingTimeMin: 5,
    featured: true,
    seoTitle: 'R$ 8 bilhões perdidos: emendas devolvidas por falta de planejamento | ATA360',
    seoDescription: 'Municípios devolvem bilhões em emendas parlamentares por não executarem contratações a tempo. Entenda o problema e a solução.',
    relatedSlugs: ['heróis-solitários-servidor-que-faz-tudo-sozinho', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pca', 'etp', 'dfd', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 18', 'EC 105/2019', 'Lei 4.320/1964'],
    sourceUrl: 'https://portaldatransparência.gov.br/transferências',
    sourceName: 'Portal da Transparência',
  },
  {
    slug: 'ata360-ia-especializada-eficiencia-compras-publicas',
    title: 'ATA360: como a IA especializada reduz em 80% o tempo de pesquisa de preços em compras públicas',
    excerpt: 'Enquanto uma pesquisa de preços manual leva de 3 a 5 dias, o ATA360 entrega em menos de 1 hora — com 17 fontes oficiais, fundamentação legal e rastreabilidade total. Conheca os números reais.',
    content: `## O tempo e o recurso mais escasso do setor de compras

Para um pregoeiro de município de pequeno porte, a pesquisa de preços e a etapa mais demorada — e mais critica — de todo o processo de contratação. Uma pesquisa mal feita gera sobrepreço, superfaturamento ou impugnação.

### O cenario sem ferramenta

- **3 a 5 dias** para uma pesquisa de preços completa
- **4 a 8 fontes** consultadas manualmente (ComprasNet, PNCP, Banco de Preços, fornecedores)
- **Planilhas Excel** com risco de erro de calculo e formatacao
- **Sem rastreabilidade**: se o TCU pedir a origem do dado, o servidor precisa refazer a busca
- **Resultado**: atraso em cascata no processo licitatório

### O cenario com o ATA360

- **Menos de 1 hora** para pesquisa completa
- **17 fontes oficiais** consultadas automaticamente (PNCP, ComprasNet, Banco de Preços, paineis estaduais, etc.)
- **Relatório formatado** com mediana, media, desvio padrão e tratamento de outliers conforme IN 65/2021
- **Rastreabilidade total**: cada preço tem link direto para a fonte oficial
- **Fundamentação legal**: citacao automática dos artigos e instruções normativas aplicáveis

### Números reais de eficiência

| Metrica | Sem ferramenta | Com ATA360 |
|---------|---------------|------------|
| Tempo de pesquisa de preços | 3-5 dias | < 1 hora |
| Fontes consultadas | 4-8 | 17 |
| Erro de calculo | Frequente | Zero (automatizado) |
| Rastreabilidade | Parcial | Total |
| Conformidade IN 65 | Manual | Automatica |

### Além da pesquisa de preços

O ATA360 não para na pesquisa de preços. A plataforma gera:

- **ETP** (Estudo Técnico Preliminar) com diagnostico automatizado
- **TR** (Termo de Referência) com cláusulas atualizadas
- **DFD** (Documento de Formalização de Demanda) vinculado ao PCA
- **Mapa de Riscos** com probabilidade e impacto calculados
- **Minuta de Edital** conforme a modalidade escolhida

Tudo com revisao humana obrigatória — porque a decisão final e sempre do servidor.

### Para quem e o ATA360

O ATA360 foi projetado para municípios de todos os portes, mas especialmente para aqueles que mais precisam: equipes pequenas, com poucos recursos e muita demanda. A tecnologia existe para **ampliar a capacidade** do servidor, não para substitui-lo.`,
    category: 'ia-compras-publicas',
    tags: ['ATA360', 'eficiência', 'pesquisa de preços', 'automação', 'IA especializada'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-10T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'ATA360: IA reduz 80% do tempo de pesquisa de preços | Compras Públicas',
    seoDescription: 'ATA360 reduz o tempo de pesquisa de preços de 5 dias para menos de 1 hora com 17 fontes oficiais e fundamentação legal automática.',
    relatedSlugs: ['riscos-ia-generica-chatgpt-licitacoes-alucinacao', 'heróis-solitários-servidor-que-faz-tudo-sozinho'],
    glossaryTerms: ['pesquisa-de-precos', 'etp', 'termo-de-referencia', 'dfd'],
    legalReferences: ['IN SEGES/ME 65/2021', 'Lei 14.133/2021 Art. 23'],
    sourceName: 'ATA360',
  },
  {
    slug: 'multas-agentes-publicos-erros-licitacoes-tcu-tce',
    title: 'Multas de até R$ 60 mil: erros grosseiros em licitações que custam caro ao servidor público',
    excerpt: 'TCU e TCEs vem aplicando multas pessoais a pregoeiros e agentes de contratação por falhas em pesquisa de preços, ETP e documentacao. Veja os cases reais e como se proteger.',
    content: `## A responsabilização pessoal e real — e esta crescendo

O que antes era um "puxao de orelha" do órgão de controle, hoje e multa no CPF do servidor. TCU e Tribunais de Contas estaduais vem intensificando a responsabilização pessoal de pregoeiros e agentes de contratação por erros em processos licitatórios.

### Cases reais de multas aplicadas

**Caso 1 — Pesquisa de preços com uma única fonte**
Um pregoeiro de município do interior de MG utilizou apenas uma cotação de fornecedor como preço de referência. O TCE-MG aplicou multa de **R$ 15.000** ao servidor, além de determinar a anulação do contrato.

**Caso 2 — ETP copiado de outro órgão sem adaptacao**
Um agente de contratação copiou integralmente o ETP de outro processo, incluindo dados de outro estado. O TCU considerou o ato como "ausência de estudo técnico" e aplicou multa de **R$ 30.000**.

**Caso 3 — Fracionamento de despesa para dispensar licitação**
Um secretario municipal fracionou contratações de TI em 12 dispensas de R$ 49.000 cada. O TCE identificou o fracionamento e aplicou multa de **R$ 60.000**, além de representação ao Ministério Público.

**Caso 4 — Ausência de publicação no PNCP**
Município realizou pregão eletrônico sem publicar o aviso no PNCP. O TCE determinou a anulação do processo e multa de **R$ 10.000** ao pregoeiro.

### Os erros mais comuns

1. **Pesquisa de preços insuficiente** — menos de 3 fontes ou fontes não oficiais
2. **ETP genérico ou inexistente** — documento apenas pro-forma
3. **TR sem específicacao técnica** — objeto vago que permite direcionamento
4. **Fracionamento de despesa** — dispensas sucessivas para evitar licitação
5. **Falta de publicação** — não publicar no PNCP ou no DOU quando exigido

### Como se proteger

- **Documente tudo**: cada decisão precisa ter fundamentação escrita
- **Use fontes oficiais**: PNCP, ComprasNet, paineis estaduais — nunca "cotação de balcao" como fonte única
- **Revise antes de assinar**: o agente responde pelo que assina
- **Utilize ferramentas com rastreabilidade**: se o TCU pedir a origem, voce precisa comprovar

O ATA360 gera toda a documentacao com rastreabilidade total — cada preço, cada referência legal, cada dado tem origem comprovável. Em caso de auditoria, o servidor tem como demonstrar que seguiu as melhores práticas.

**Fonte:** [TCU — Jurisprudência](https://portal.tcu.gov.br/jurisprudência/)`,
    category: 'jurisprudencia',
    tags: ['multas', 'TCU', 'TCE', 'erros em licitações', 'responsabilização pessoal', 'pregoeiro'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-09T08:00:00Z',
    updatedAt: '2026-02-09T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Multas de até R$ 60 mil por erros em licitações — cases reais | ATA360',
    seoDescription: 'TCU e TCEs aplicam multas pessoais a pregoeiros por erros em pesquisa de preços, ETP e documentacao. Veja cases reais.',
    relatedSlugs: ['heróis-solitários-servidor-que-faz-tudo-sozinho', 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026'],
    glossaryTerms: ['pregoeiro', 'tcu', 'fracionamento', 'pesquisa-de-precos'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'Lei 14.133/2021 Art. 73', 'LINDB Art. 28'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudência/',
    sourceName: 'TCU — Jurisprudência',
  },
  {
    slug: 'riscos-ia-generica-chatgpt-licitacoes-alucinacao',
    title: 'ChatGPT na licitação? Os riscos de usar IA genérica em compras públicas — e por que alucinações custam caro',
    excerpt: 'Servidores usando ChatGPT para gerar ETP, TR e pesquisa de preços estão correndo riscos serios: dados inventados, leis inexistentes e responsabilização pessoal. Entenda os perigos e a alternativa segura.',
    content: `## A tentacao da IA genérica no setor público

Com a popularizacao do ChatGPT e ferramentas similares, servidores públicos comecaram a usar IA genérica para acelerar tarefas do dia a dia — incluindo documentos de contratação. O problema? **Essas ferramentas não foram feitas para compras públicas.**

### O que são alucinações de IA

"Alucinação" e o termo técnico para quando uma IA generativa **inventa informações com aparencia de verdade**. No contexto de compras públicas, isso inclui:

- **Leis que não existem**: "conforme Art. 247 da Lei 14.133/2021" (a lei tem 194 artigos)
- **Preços inventados**: valores de referência sem nenhuma base real
- **Fornecedores fictícios**: CNPJs que não existem na base da Receita Federal
- **Jurisprudência fabricada**: acórdãos do TCU com números inexistentes
- **Dados desatualizados**: informações de legislação já revogada

### Cases reais de problemas com IA genérica

**Caso EUA — Advogados multados por citações falsas**
Em 2023, advogados em Nova York foram multados por citar jurisprudência inventada pelo ChatGPT em petições ao tribunal. O juiz classificou como "conduta irresponsável".

**Risco no setor público brasileiro**
Se um pregoeiro usar dados gerados por IA genérica em uma pesquisa de preços e o TCE auditar, **o servidor responde pessoalmente** — mesmo que alegue "a IA gerou". A responsabilidade pela veracidade dos dados e de quem assina.

### IA genérica vs. IA especializada — as diferenças

| Aspecto | IA Genérica (ChatGPT) | IA Especializada (ATA360) |
|---------|----------------------|--------------------------|
| Fonte de dados | Internet geral | 17 fontes oficiais (PNCP, ComprasNet, etc.) |
| Rastreabilidade | Nenhuma | Total — cada dado com link |
| Atualizacao legal | Desatualizada (treinamento antigo) | Em tempo real |
| Alucinações | Frequentes e invisiveis | Bloqueadas — dados somente de fontes oficiais |
| LGPD | Dados enviados para exterior | Processamento no Brasil |
| Auditoria | Impossível comprovar | Log completo com trilha |

### O que o TCU diz

As orientações do TCU sobre IA em contratações são claras: **rastreabilidade, transparência e revisao humana**. Uma IA que inventa dados viola todas as tres.

### A alternativa segura

O ATA360 não "inventa" nada. A plataforma consulta exclusivamente fontes oficiais e retorna dados com:

- Link direto para a contratação original
- Número do processo na fonte
- Data da publicação
- Órgão contratante
- CNPJ do fornecedor verificado

Se o dado não existe na fonte oficial, ele simplesmente não aparece. **Zero alucinações por design.**

**Fonte:** [TCU — Orientações sobre IA](https://portal.tcu.gov.br/)`,
    category: 'ia-compras-publicas',
    tags: ['ChatGPT', 'alucinação IA', 'riscos', 'IA genérica', 'LGPD', 'rastreabilidade'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-08T08:00:00Z',
    updatedAt: '2026-02-08T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'ChatGPT na licitação? Riscos de IA genérica em compras públicas | ATA360',
    seoDescription: 'Servidores usando ChatGPT para ETP e pesquisa de preços correm riscos: dados inventados, leis falsas e responsabilização pessoal. Veja a alternativa.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'ata360-ia-especializada-eficiencia-compras-publicas'],
    glossaryTerms: ['ia-generativa', 'alucinacao', 'pesquisa-de-precos', 'lgpd'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'LGPD Lei 13.709/2018', 'LINDB Art. 20'],
    sourceUrl: 'https://portal.tcu.gov.br/',
    sourceName: 'TCU',
  },
  {
    slug: 'reforma-tributária-afeta-compras-publicas-ibs-cbs',
    title: 'Reforma tributária e compras públicas: como o IBS e a CBS vão afetar licitações e contratos',
    excerpt: 'A reforma tributária (EC 132/2023) cria o IBS e a CBS, que substituem 5 tributos. O impacto nas contratações públicas será profundo: novos calculos, revisao de contratos e adequação de editais. Veja o que muda.',
    content: `## A reforma tributária chegou — e vai mudar as compras públicas

A Emenda Constitucional 132/2023 instituiu a reforma tributária mais significativa do Brasil em decadas. O novo sistema substitui cinco tributos (PIS, Cofins, IPI, ICMS e ISS) por dois: o **IBS** (Imposto sobre Bens e Serviços) e a **CBS** (Contribuicao sobre Bens e Serviços).

### O que muda nas compras públicas

**1. Pesquisa de preços — base de calculo diferente**
Os preços de referência históricos foram calculados com a carga tributária antiga. Na transição (2026-2032), será necessário converter ou ajustar os valores para refletir o novo regime.

**2. Editais — cláusulas tributárias**
Editais de licitação que fazem referência a ICMS, ISS, PIS ou Cofins precisarao ser atualizados para mencionar IBS e CBS. Modelos padrão ficam desatualizados.

**3. Contratos vigentes — reequilíbrio econômico-financeiro**
Contratos de longa duracao (obras, serviços continuados) poderão sofrer impacto na composição de custos. Fornecedores vão solicitar reequilíbrio com base na mudanca tributária.

**4. Estimativa de custos — novas alíquotas**
A alíquota combinada de IBS + CBS pode chegar a **26,5%**. A composição de custos em planilhas de serviços terá que ser reformulada.

**5. Regime de transição (2026-2032)**
Durante 7 anos, os dois sistemas coexistirao. Isso significa que processos licitatórios precisarao contémplar **ambos os regimes** — aumentando a complexidade documental.

### Calendario de impacto

| Ano | O que acontece |
|-----|---------------|
| 2026 | CBS comeca a ser cobrada (alíquota-teste de 0,9%) |
| 2027 | IBS comeca a ser cobrado (alíquota-teste de 0,1%) |
| 2029 | Extinção progressiva de PIS/Cofins |
| 2033 | Extinção total de ICMS e ISS |

### O que o gestor de compras deve fazer agora

1. **Mapear contratos vigentes** que serão afetados pela transição
2. **Atualizar modelos de editais** com cláusulas para o novo regime
3. **Preparar a equipe** para lidar com pedidos de reequilíbrio
4. **Acompanhar regulamentação**: as leis complementares definem detalhes criticos

### ATA360 e a reforma tributária

O ATA360 esta se preparando para incorporar as novas alíquotas e regras do IBS/CBS nos modelos de documentos e calculos de pesquisa de preços — garantindo que os processos estejam adequados ao novo regime desde o primeiro dia.

**Fonte:** [Gov.br — Reforma Tributária](https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributária)`,
    category: 'legislacao',
    tags: ['reforma tributária', 'IBS', 'CBS', 'contratos', 'licitações', 'reequilíbrio'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-07T08:00:00Z',
    updatedAt: '2026-02-07T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Reforma tributária e compras públicas: como IBS e CBS afetam licitações | ATA360',
    seoDescription: 'A reforma tributária (EC 132/2023) impacta diretamente compras públicas. Novos calculos, revisao de contratos e editais. Veja o que muda.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'credenciamento-lei-14133-nova-modalidade-guia'],
    glossaryTerms: ['licitacao', 'reequilibrio-economico-financeiro', 'termo-de-referencia'],
    legalReferences: ['EC 132/2023', 'Lei 14.133/2021 Art. 124 e 134', 'LC 214/2025 (regulamentação)'],
    sourceUrl: 'https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributária',
    sourceName: 'Min. Fazenda / Gov.br',
  },
  {
    slug: 'credenciamento-lei-14133-nova-modalidade-guia',
    title: 'Credenciamento na Lei 14.133/2021: a modalidade que poucos usam e pode transformar contratações de serviços',
    excerpt: 'O credenciamento permite contratar multiplos fornecedores simultaneamente sem competicao por preço. Ideal para saude, capacitação e serviços técnicos. Veja como funciona e quando usar.',
    content: `## Credenciamento: a ferramenta subutilizada da nova lei

A Lei 14.133/2021 trouxe o **credenciamento** como processo auxiliar de contratação (Art. 78 a 80), permitindo que a administração cadastre e contrate todos os fornecedores que atendam a critérios pre-definidos — sem competicao por preço.

### O que e credenciamento

Diferente da licitação tradicional (que busca o menor preço ou melhor técnica), o credenciamento **aceita todos** os fornecedores que cumpram os requisitos. A distribuição pode ser feita por:

- **Rodizio**: alternancia entre credenciados
- **Demanda**: conforme necessidade do usuario final
- **Região**: por area geografica de atuacao

### Quando usar credenciamento

O credenciamento e ideal para:

1. **Serviços de saude**: credenciar clinicas, laboratorios e hospitais
2. **Capacitação e treinamento**: credenciar instituicoes de ensino
3. **Serviços técnicos especializados**: consultorias, pericias, auditorias
4. **Manutencao predial**: credenciar prestadores por especialidade
5. **Serviços continuados com multiplos fornecedores**

### Vantagens do credenciamento

- **Rapidez**: não há fase de lances ou negociação
- **Ampla participação**: qualquer fornecedor que atenda pode entrar
- **Flexibilidade**: novos credenciados podem entrar a qualquer momento
- **Reduz concentração**: evita dependência de fornecedor único
- **Menos recursos**: processos de credenciamento são menos impugnados

### Cuidados essenciais

- **Edital claro**: os critérios de habilitacao devem ser objetivos e verificaveis
- **Preços tabelados**: o preço deve ser definido pela administração (ex: tabela SUS, tabela SINAPI)
- **Publicidade permanente**: o chamamento deve ficar aberto durante toda a vigência
- **Fiscalização**: cada contratação deve ser fiscalizada individualmente

### Credenciamento na prática

O ATA360 pode auxiliar na montagem do processo de credenciamento, gerando:
- Edital de chamamento público com fundamentação na Lei 14.133
- Criterios de habilitacao conforme a natureza do serviço
- Minuta de contrato padrão para os credenciados
- Modelo de ata de distribuição por rodizio

**Fonte:** [Planalto — Lei 14.133/2021](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm)`,
    category: 'licitacao',
    tags: ['credenciamento', 'Lei 14.133', 'modalidades', 'saude', 'serviços', 'contratação direta'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-06T08:00:00Z',
    updatedAt: '2026-02-06T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Credenciamento na Lei 14.133: guia completo da modalidade | ATA360',
    seoDescription: 'Credenciamento permite contratar multiplos fornecedores sem competicao por preço. Veja quando usar e como montar o processo.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'enap-curso-gratuito-lei-14133-2026'],
    glossaryTerms: ['credenciamento', 'licitacao', 'chamamento-publico'],
    legalReferences: ['Lei 14.133/2021 Art. 78 a 80', 'Lei 14.133/2021 Art. 6 XLIII'],
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    sourceName: 'Planalto / Lei 14.133',
  },
  {
    slug: 'sicaf-transferegov-novidades-2026-governo-digital',
    title: 'SICAF e Transferegov: novidades de 2026 para quem trabalha com compras públicas e convênios',
    excerpt: 'O Governo Federal atualizou o SICAF e o Transferegov com novas funcionalidades. Integracao com PNCP, válidação automática de documentos e novos fluxos digitais. Veja o que mudou.',
    content: `## Transformação digital nas compras públicas avanca

O Governo Federal vem acelerando a modernização dos sistemas de contratações e transferências. Em 2026, duas plataformas receberam atualizações significativas: o **SICAF** (Sistema de Cadastramento Unificado de Fornecedores) e o **Transferegov** (antiga Plataforma +Brasil).

### Novidades no SICAF

O SICAF e o cadastro único de fornecedores do governo federal. As atualizações incluem:

- **Validacao automática de certidoes**: consulta em tempo real a Receita Federal, FGTS, Justica do Trabalho e CADIN
- **Integracao com PNCP**: dados do SICAF alimentam automaticamente o PNCP
- **Interface simplificada**: novo layout para facilitar o cadastro por fornecedores de pequeno porte
- **API pública**: órgãos podem integrar seus sistemas de compras ao SICAF via API

### Novidades no Transferegov

O Transferegov gerencia convênios, contratos de repasse e transferências fundo a fundo. As novidades:

- **Fluxo 100% digital**: eliminação de documentos fisicos em transferências voluntárias
- **Rastreamento de emendas**: painel integrado com o SIOP para acompanhar execução de emendas parlamentares
- **Prestação de contas simplificada**: modelo por resultados (não apenas por despesa)
- **Alertas automáticos**: notificação de prazos de vigência, prestação de contas e aditivos

### Impacto para municípios

Para municípios que recebem transferências voluntárias e emendas, as mudancas são significativas:

1. **Menos burocracia**: documentos válidados automaticamente
2. **Mais transparência**: dados acessiveis em tempo real
3. **Menos devolução de recursos**: alertas evitam perda de prazos
4. **Integracao**: dados de contratações e transferências em um só lugar

### Como o ATA360 se conecta

O ATA360 consome dados do SICAF para válidação de fornecedores durante a pesquisa de preços, garantindo que os preços de referência venham de fornecedores com situação regular. Além disso, a plataforma pode auxiliar na montagem de processos para execução de transferências do Transferegov.

**Fonte:** [Gov.br — Compras e Contratações](https://www.gov.br/compras/)`,
    category: 'tecnologia',
    tags: ['SICAF', 'Transferegov', 'governo digital', 'PNCP', 'convênios', 'transformação digital'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-02-05T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'SICAF e Transferegov: novidades 2026 em compras públicas | ATA360',
    seoDescription: 'SICAF e Transferegov recebem atualizações em 2026: válidação automática, integração com PNCP e novos fluxos digitais.',
    relatedSlugs: ['pncp-supera-2-milhões-contratacoes-publicadas', 'governo-amplia-prazo-municipios-pncp'],
    glossaryTerms: ['sicaf', 'pncp', 'convênio', 'transferencia-voluntaria'],
    legalReferences: ['Lei 14.133/2021 Art. 87', 'Decreto 11.246/2022', 'Portaria SEGES/MGI 150/2024'],
    sourceUrl: 'https://www.gov.br/compras/',
    sourceName: 'Gov.br / Compras',
  },
  // ─── POSTS EDUCATIVOS — Jurisprudência, Normativos, Rankings, Tendencias ────
  {
    slug: 'acórdãos-súmulas-jurisprudencia-o-que-sao-compras-publicas',
    title: 'Acórdãos, súmulas e jurisprudência: o que são e por que todo servidor de compras precisa conhecer',
    excerpt: 'Uma aula completa sobre como funcionam as decisões do TCU e dos TCEs, o que são acórdãos, súmulas vinculantes e jurisprudência — e como elas impactam diretamente o seu processo licitatório.',
    content: `## Jurisprudência em compras públicas — o guia definitivo

Se voce trabalha com contratações públicas, já ouviu frases como "o TCU decidiu que...", "conforme acórdão...", "a súmula 247 determina...". Mas o que significam esses termos na prática? Este artigo explica cada um deles.

### O que e jurisprudência

**Jurisprudência** e o conjunto de decisões reiteradas dos tribunais sobre um mesmo tema. Não e uma lei, mas orienta como a lei deve ser interpretada. No setor público, a jurisprudência do TCU e dos TCEs e especialmente importante porque:

- Define **como aplicar** a Lei 14.133/2021 em situações concretas
- Estabelece **parametros** que os órgãos de controle usam para auditar
- Cria **precedentes** que protegem (ou responsabilizam) o gestor

### O que e um acórdão

**Acórdão** e a decisão colegiada de um tribunal. Quando o Plenário do TCU julga um caso, o resultado e um acórdão. Ele contém:

- **Relatório**: resumo dos fatos e do processo
- **Voto**: fundamentação jurídica do relator
- **Acórdão própriamente dito**: determinações, recomendações e, quando aplicável, multas

**Exemplo prático:**
> Acórdão TCU 1.793/2011-Plenário — Determina que pesquisas de preços devem contémplar no mínimo 3 fontes, incluindo contratações públicas similares. Base: principio da economicidade.

### O que e uma súmula

**Súmula** e um enunciado que resume o entendimento consolidado do tribunal sobre um tema. E mais forte que um acórdão individual, porque reflete **multiplas decisões no mesmo sentido**.

**Súmulas importantes do TCU para compras públicas:**

- **Súmula 247**: "E obrigatória a admissao da adjudicacao por item e não por preço global, nos editais das licitações para a contratação de obras, serviços, compras e alienações, cujo objeto seja divisivel..."
- **Súmula 253**: "Comprovada a inviabilidade técnico-econômica de parcelamento do objeto, e admissivel a adjudicacao global..."
- **Súmula 269**: "Nas contratações para prestação de serviços de tecnologia da informação, a remuneração deve ser fixada em função dos resultados..."

### O que são decretos e normativos

**Decretos** são atos do Poder Executivo que regulamentam as leis. Para compras públicas, os principais são:

| Normativo | O que regulamenta |
|-----------|------------------|
| **Decreto 11.246/2022** | Governança em contratações (federal) |
| **Decreto 11.462/2023** | Margem de preferência (federal) |
| **IN SEGES/ME 65/2021** | Pesquisa de preços |
| **IN SEGES/ME 58/2022** | PCA — Plano de Contratações Anual |
| **IN SEGES/ME 73/2022** | Dispensa eletrônica |
| **IN SEGES/ME 81/2022** | Catalogo de soluções de TI |
| **Portaria SEGES/MGI 150/2024** | Transferencia de licitações para novo portal |

### Como usar jurisprudência a seu favor

1. **Fundamentar decisões**: cite acórdãos e súmulas para justificar suas escolhas
2. **Proteger-se de auditorias**: demonstrar que seguiu entendimento consolidado
3. **Atualizar-se**: acompanhe os informativos de jurisprudência do TCU e do seu TCE
4. **Padronizar procedimentos**: use as decisões como referência para manuais internos

### O ATA360 e a jurisprudência

O ATA360 incorpora referências jurisprudênciais nos documentos que gera. Ao criar um ETP ou TR, a plataforma cita automaticamente acórdãos e normativos relevantes — dando ao servidor fundamentação robusta e atualizada.

**Fonte:** [TCU — Súmulas e Jurisprudência](https://portal.tcu.gov.br/jurisprudência/)`,
    category: 'jurisprudencia',
    tags: ['acórdãos', 'súmulas', 'jurisprudência', 'TCU', 'normativos', 'decretos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-04T08:00:00Z',
    updatedAt: '2026-02-04T08:00:00Z',
    readingTimeMin: 8,
    featured: true,
    seoTitle: 'Acórdãos, súmulas e jurisprudência em compras públicas — guia completo | ATA360',
    seoDescription: 'O que são acórdãos, súmulas e jurisprudência do TCU? Guia completo para servidores de compras públicas com exemplos práticos.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'ranking-erros-licitacoes-tcu-tce-mg-brasil'],
    glossaryTerms: ['acórdão', 'súmula', 'jurisprudencia', 'tcu'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.246/2022', 'IN SEGES/ME 65/2021'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudência/',
    sourceName: 'TCU — Jurisprudência',
  },
  {
    slug: 'ranking-erros-licitacoes-tcu-tce-mg-brasil',
    title: 'Ranking: os 15 erros em licitações que mais geram multas do TCU, TCE-MG e outros TCEs do Brasil',
    excerpt: 'Compilamos as falhas mais recorrentes identificadas por órgãos de controle em todo o Brasil. Da pesquisa de preços ao contrato: saiba o que não fazer e como se proteger.',
    content: `## Os erros que custam caro — e como evita-los

Analisamos decisões recentes do TCU, TCE-MG, TCE-SP, TCE-RS, TCE-BA e TCE-PR para identificar os erros mais recorrentes em processos licitatórios que resultam em multas, determinações e anulações.

### Ranking dos 15 erros mais comuns

**1. Pesquisa de preços com fonte única ou insuficiente**
- Órgão de controle: TCU, TCE-MG, TCE-SP
- Consequencia: anulação do processo + multa
- Correto: mínimo 3 fontes, incluindo contratações públicas similares (IN 65/2021)

**2. ETP genérico ou ausente**
- Órgão: TCU, TCE-MG
- Consequencia: multa pessoal + determinação de refazer
- Correto: ETP deve diagnosticar o problema e analisar alternativas

**3. Fracionamento de despesas para dispensar licitação**
- Órgão: todos os TCEs + TCU
- Consequencia: multa + representação ao MP
- Correto: consolidar demandas no PCA e licitar pelo valor total

**4. Direcionar específicacao para marca ou fornecedor**
- Órgão: TCU, TCE-SP, TCE-BA
- Consequencia: anulação + multa + improbidade
- Correto: específicar por desempenho, não por marca (salvo excepcoes fundamentadas)

**5. Não publicar no PNCP**
- Órgão: TCU, TCE-MG
- Consequencia: anulação + multa
- Correto: publicação obrigatória conforme Art. 174 da Lei 14.133

**6. Ausência de segregacao de funções**
- Órgão: TCU, TCE-RS
- Consequencia: determinação + multa
- Correto: quem planeja não pode ser quem julga (Art. 7, §1°)

**7. Contrato sem fiscal designado**
- Órgão: TCU, TCE-PR, TCE-MG
- Consequencia: multa ao gestor
- Correto: designar fiscal técnico e administrativo (Art. 117)

**8. Aditivo contratual além do limite legal**
- Órgão: TCU
- Consequencia: multa + nulidade do aditivo
- Correto: limite de 25% para acréscimos (Art. 125)

**9. Pagar sem liquidacao adequada**
- Órgão: TCE-MG, TCE-SP
- Consequencia: multa + glosa
- Correto: verificar entrega efetiva antes do pagamento

**10. Não adotar registro de preços quando obrigatório**
- Órgão: TCU
- Consequencia: determinação
- Correto: usar SRP para bens/serviços comuns e entregas parceladas

**11. Edital restritivo — exigências de habilitacao excessivas**
- Órgão: TCU, TCE-BA, TCE-SP
- Consequencia: anulação + multa
- Correto: exigir somente o que a lei permite (Art. 62 a 70)

**12. Não justificar a escolha da modalidade**
- Órgão: TCE-MG, TCE-RS
- Consequencia: determinação
- Correto: fundamentar a escolha no ETP

**13. Pesquisa de preços com dados desatualizados (mais de 6 meses)**
- Órgão: TCU
- Consequencia: determinação de refazer pesquisa
- Correto: dados de até 1 ano, preferêncialmente 6 meses

**14. Ausência de gestão de riscos**
- Órgão: TCU
- Consequencia: determinação
- Correto: mapa de riscos obrigatório (Art. 18, X)

**15. Contratação emergencial sem comprovacao de urgência**
- Órgão: todos os TCEs
- Consequencia: multa + representação
- Correto: documentar a urgência e a impossibilidade de planejamento previo

### Como o ATA360 previne esses erros

A plataforma atua como uma **camada de protecao** para o servidor:

- **Pesquisa de preços**: 17 fontes oficiais, sempre atualizada
- **ETP e TR**: gerados com fundamentação específica, nunca genéricos
- **Públicacao PNCP**: integrada ao fluxo
- **Checklist de conformidade**: verifica cada etapa antes de prosseguir
- **Rastreabilidade**: toda decisão documentada com trilha de auditoria

**Fontes:** [TCU — Informativos de Jurisprudência](https://portal.tcu.gov.br/jurisprudência/) | [TCE-MG — Consultas](https://www.tce.mg.gov.br/) | [TCE-SP — Jurisprudência](https://www.tce.sp.gov.br/)`,
    category: 'compliance',
    tags: ['erros em licitações', 'TCU', 'TCE-MG', 'TCE-SP', 'ranking', 'multas', 'boas práticas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-03T08:00:00Z',
    updatedAt: '2026-02-03T08:00:00Z',
    readingTimeMin: 8,
    featured: false,
    seoTitle: 'Ranking: 15 erros em licitações que geram multas do TCU e TCEs | ATA360',
    seoDescription: 'Os 15 erros mais comuns em licitações identificados pelo TCU, TCE-MG, TCE-SP e outros. Saiba o que evitar e como se proteger.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'acórdãos-súmulas-jurisprudencia-o-que-sao-compras-publicas'],
    glossaryTerms: ['fracionamento', 'segregacao-de-funcoes', 'registro-de-precos', 'fiscal-de-contrato'],
    legalReferences: ['Lei 14.133/2021 Art. 7', 'Lei 14.133/2021 Art. 18', 'Lei 14.133/2021 Art. 117', 'Lei 14.133/2021 Art. 125'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudência/',
    sourceName: 'TCU / TCE-MG / TCE-SP',
  },
  {
    slug: 'benefícios-fornecedores-me-epp-licitacoes-2026',
    title: 'Guia completo: benefícios para micro e pequenas empresas (ME/EPP) em licitações em 2026',
    excerpt: 'A Lei 14.133/2021 e a LC 123/2006 garantem vantagens significativas para ME/EPP nas compras públicas. Direito de preferência, reserva de cota, tratamento diferenciado — veja tudo atualizado.',
    content: `## ME e EPP nas licitações: todos os benefícios em um só lugar

As micro e pequenas empresas (ME/EPP) são protagonistas nas compras públicas brasileiras. A legislação garante tratamento diferenciado para estimular a participação e fortalecer a economia local.

### Base legal

- **LC 123/2006** (Estatuto da ME/EPP) — Cap. V: Acesso aos Mercados
- **Lei 14.133/2021** — Art. 4 e 47 a 49
- **Decreto 8.538/2015** — regulamenta o tratamento diferenciado
- **LC 147/2014** — ampliou os benefícios

### Os 7 benefícios das ME/EPP em licitações

**1. Direito de preferência (empate ficto)**
Se a proposta da ME/EPP for até **10% superior** a proposta vencedora (5% no pregão), ela pode cobrir e vencer.

**2. Reserva de cota de até 25%**
Até 25% do objeto pode ser reservado exclusivamente para ME/EPP — desde que existam pelo menos 3 fornecedores competitivos.

**3. Licitação exclusiva até R$ 80.000**
Contratações de até R$ 80.000 podem ser exclusivas para ME/EPP.

**4. Subcontratação compulsoria**
Em contratações acima dos limites, a administração pode exigir que o vencedor subcontrate ME/EPP.

**5. Regularidade fiscal tardia**
ME/EPP pode participar mesmo com pendencias fiscais, tendo **5 dias uteis** apos a habilitacao para regularizar.

**6. Cota de fornecimento**
Além da reserva de cota, a administração pode dividir o objeto em cotas para participação exclusiva.

**7. Prioridade local/regional**
Municípios podem dar preferência a empresas locais/regionais quando o edital for exclusivo para ME/EPP.

### Programas do governo para fornecedores em 2026

- **Compras.gov.br**: portal unificado para fornecedores se cadastrarem e participarem
- **SICAF simplificado**: cadastro com válidação automática de certidoes
- **Programa Sebrae + Compras Públicas**: capacitação gratuita para ME/EPP
- **Crédito BNDES para fornecedores**: linhas especiais para capital de giro
- **Portal de Oportunidades PNCP**: alerta de licitações por segmento

### Dados de 2025/2026

- **70%+ das contratações** do governo federal são vencidas por ME/EPP
- **R$ 120+ bilhões** movimentados por ME/EPP em compras públicas (2025)
- **5.570 municípios** com obrigação de aplicar tratamento diferenciado

### O ATA360 e os fornecedores

O ATA360 consulta dados de contratações de ME/EPP em suas pesquisas de preços, garantindo que os preços de referência reflitam o mercado real — incluindo os benefícios legais aplicáveis.

**Fonte:** [Sebrae — ME/EPP em Licitações](https://www.sebrae.com.br/sites/PortalSebrae/artigos/como-participar-de-licitações)`,
    category: 'licitacao',
    tags: ['ME/EPP', 'benefícios', 'fornecedores', 'LC 123', 'licitações', 'tratamento diferenciado'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-02T08:00:00Z',
    updatedAt: '2026-02-02T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Benefícios para ME/EPP em licitações 2026 — guia completo | ATA360',
    seoDescription: 'Todos os benefícios legais para micro e pequenas empresas em licitações: preferência, cota, exclusividade e programas do governo.',
    relatedSlugs: ['credenciamento-lei-14133-nova-modalidade-guia', 'convênios-transferencias-voluntarias-2026-guia'],
    glossaryTerms: ['me-epp', 'empate-ficto', 'registro-de-precos', 'licitacao'],
    legalReferences: ['LC 123/2006 Art. 42 a 49', 'Lei 14.133/2021 Art. 4', 'Decreto 8.538/2015'],
    sourceUrl: 'https://www.sebrae.com.br/sites/PortalSebrae/artigos/como-participar-de-licitações',
    sourceName: 'Sebrae',
  },
  {
    slug: 'convênios-transferencias-voluntarias-2026-guia',
    title: 'Convênios e transferências voluntárias em 2026: como captar e executar recursos federais sem devolver',
    excerpt: 'O guia atualizado para municípios captarem recursos via convênios, contratos de repasse e transferências fundo a fundo. Plataforma Transferegov, prazos, prestação de contas e erros a evitar.',
    content: `## Transferências voluntárias: o guia para não perder recursos

Transferências voluntárias são a principal fonte de investimento para milhares de municípios brasileiros. Captar esses recursos e importante — mas **executar corretamente e ainda mais critico**.

### Tipos de transferências

| Tipo | Como funciona | Exemplo |
|------|-------------|---------|
| **Convênio** | Acordo entre entes para objetivo comum | Construcao de escola |
| **Contrato de repasse** | Intermediado por banco oficial (Caixa, BB) | Obra de saneamento |
| **Transf. fundo a fundo** | Direta, sem convênio | SUS (FNS para FMS) |
| **Emendas parlamentares** | Via Transferegov (individuais, bancada, relator) | Equipamento hospitalar |
| **Transf. especial** | Direta, sem vinculação de objeto | EC 105/2019 |

### Plataforma Transferegov — o que saber em 2026

- **Todas as transferências** voluntárias passam pelo Transferegov
- **Cadastro obrigatório** de proponente (município) e proposta de trabalho
- **Fluxo 100% digital**: desde a proposta até a prestação de contas
- **Integracao com SIAFI**: pagamentos automáticos apos aprovacao
- **Novidade 2026**: prestação de contas por resultados (não apenas financeira)

### Os 5 erros que mais causam devolução de recursos

**1. Perder o prazo de vigência**
O convênio tem prazo. Se a licitação atrasar, o recurso vence e volta ao Tesouro.

**2. Não prestar contas no prazo**
A falta de prestação de contas gera inscrição no CAUC e bloqueio de novas transferências.

**3. Descumprir o objeto**
Executar algo diferente do que foi pactuado gera devolução integral + tomada de contas especial.

**4. Licitação irregular**
Falhas no processo licitatório (fracionamento, direcionamento) contaminam a transferencia inteira.

**5. Não aplicar contrapartida**
O município deve comprovar sua parcela (geralmente 1% a 5% do valor total).

### Como captar mais recursos

1. **Manter o CAUC regular**: certidoes, prestações de contas e LRF em dia
2. **Elaborar bons projetos**: propostas detalhadas com cronograma e orçamento
3. **Antecipar o planejamento**: incluir no PCA as compras vinculadas a transferências
4. **Articular com parlamentares**: emendas são a via mais direta de captacao
5. **Monitorar editais**: ministérios publicam chamamentos regulares

### ATA360 e transferências voluntárias

O ATA360 ajuda municípios a executar os processos licitatórios vinculados a transferências de forma rápida e correta — evitando que recursos captados sejam devolvidos por falhas na contratação.

**Fonte:** [Gov.br — Transferegov](https://www.gov.br/transferegov/)`,
    category: 'gestao-publica',
    tags: ['convênios', 'transferências voluntárias', 'Transferegov', 'emendas', 'CAUC', 'recursos federais'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
    readingTimeMin: 7,
    featured: false,
    seoTitle: 'Convênios e transferências voluntárias 2026: guia para municípios | ATA360',
    seoDescription: 'Como captar e executar recursos via convênios e transferências voluntárias em 2026. Transferegov, prazos e erros a evitar.',
    relatedSlugs: ['bilhões-perdidos-emendas-parlamentares-falta-planejamento', 'sicaf-transferegov-novidades-2026-governo-digital'],
    glossaryTerms: ['convênio', 'transferencia-voluntaria', 'cauc', 'transferegov'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.531/2023', 'Portaria Conjunta MGI/MF/CGU 33/2023'],
    sourceUrl: 'https://www.gov.br/transferegov/',
    sourceName: 'Gov.br / Transferegov',
  },
  {
    slug: 'tendências-compras-publicas-2026-ia-sustentabilidade-dados',
    title: '7 tendências para compras públicas em 2026: IA, dados abertos, sustentabilidade e o fim do papel',
    excerpt: 'O que esperar das contratações públicas em 2026? De inteligência artificial a compras sustentáveis, passando por dados abertos e o fim dos processos em papel. Veja as tendências que vão redefinir o setor.',
    content: `## O futuro das compras públicas já comecou

O setor de contratações públicas esta em plena transformação. A combinação de nova legislação (Lei 14.133/2021), tecnologia (IA, dados abertos) e demandas da sociedade (transparência, sustentabilidade) esta redesenhando como o governo compra.

### 1. Inteligência artificial especializada

A IA vai além do ChatGPT. Em 2026, ferramentas especializadas em compras públicas já:

- Geram pesquisas de preços com 17+ fontes oficiais
- Criam documentos preparatorios (ETP, TR, DFD) com fundamentação legal
- Identificam riscos e anomalias em processos
- Detectam sobrepreço e superfaturamento automaticamente

**Tendencia**: a adoção de IA especializada (não genérica) será impulsionada pelas orientações do TCU sobre rastreabilidade e governança.

### 2. Dados abertos e transparência radical

O PNCP, com 2 milhões+ de contratações, e apenas o comeco. Em 2026:

- **APIs públicas** permitirao qualquer cidadão ou empresa consultar dados em tempo real
- **Paineis interativos** (CGU, TCU) vão democratizar a fiscalização
- **Cruzamento de dados** vai identificar anomalias automaticamente
- **Benchmarking nacional** vai tornar sobrepreço detectavel em segundos

### 3. Compras sustentáveis (ODS e ESG)

A Lei 14.133/2021 já preve critérios de sustentabilidade (Art. 11, IV). Em 2026:

- **Critérios ESG** em editais: pegada de carbono, economia circular, logística reversa
- **Preferência por produtos sustentáveis**: materiais reciclados, equipamentos eficientes
- **Rotulagem ambiental**: certificações como base de pontuação técnica
- **Plano de Logística Sustentavel**: obrigatório para órgãos federais

### 4. Fim do papel e processo 100% digital

O Decreto 11.246/2022 já determinou a digitalização. Em 2026:

- **Assinatura eletrônica** em todos os documentos (ICP-Brasil ou Gov.br)
- **Processo integralmente digital**: do planejamento a prestação de contas
- **Integracao de sistemas**: compras.gov.br, PNCP, SIAFI, Transferegov
- **Eliminacao de documentos fisicos** em auditorias

### 5. Profissionalizacao do agente de contratação

A Lei 14.133/2021 exige que o agente de contratação tenha capacitação específica. Em 2026:

- **Certificações obrigatórias**: cursos ENAP, universidades e escolas de governo
- **Remuneracao diferenciada**: alguns estados já reconhecem a função como cargo técnico
- **Plano de carreira**: propostas de legislação para carreira de compras públicas
- **Menos acumulo de funções**: vedação de designar "qualquer servidor" como pregoeiro

### 6. Marketplace público e catalogo eletrônico

O ComprasNet evolui para um marketplace:

- **Catalogo de bens e serviços padronizados**: compra direta sem licitação (Art. 75, II, a)
- **Preços pre-negociados**: acordos-quadro e registro de preços permanente
- **Avaliação de fornecedores**: rating baseado em entregas anteriores
- **Integracao com e-commerce**: Amazon Business, Mercado Livre (B2G)

### 7. Governança e compliance como padrão

A cultura de governança esta se consolidando:

- **Programa de integridade**: obrigatório para contratações acima de R$ 200 milhões (Art. 25, §4°)
- **Compliance de fornecedores**: due diligence antes da contratação
- **Gestão de riscos**: mapa de riscos como documento obrigatório
- **Canal de denuncias**: obrigatório em órgãos com mais de 50 servidores

### O ATA360 e o futuro

O ATA360 nasceu nesse contexto: IA especializada, dados oficiais, rastreabilidade total e foco no servidor. A plataforma já opera alinhada com todas as 7 tendências — porque foi projetada para o setor público do futuro, não do passado.`,
    category: 'tecnologia',
    tags: ['tendências 2026', 'IA', 'dados abertos', 'sustentabilidade', 'transformação digital', 'compras públicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-01-31T08:00:00Z',
    updatedAt: '2026-01-31T08:00:00Z',
    readingTimeMin: 7,
    featured: false,
    seoTitle: '7 tendências para compras públicas em 2026 | ATA360',
    seoDescription: 'IA, dados abertos, sustentabilidade e digitalização: as 7 tendências que vão redefinir as contratações públicas em 2026.',
    relatedSlugs: ['ata360-ia-especializada-eficiencia-compras-publicas', 'riscos-ia-generica-chatgpt-licitacoes-alucinacao'],
    glossaryTerms: ['catalogo-eletronico', 'acordo-quadro', 'agente-de-contratacao'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'Decreto 11.246/2022', 'Lei 14.133/2021 Art. 25'],
    sourceName: 'ATA360',
  },
  {
    slug: 'lei-14133-comentada-artigos-mais-importantes-pratica',
    title: 'Lei 14.133/2021 comentada: os 20 artigos que todo servidor de compras precisa dominar na prática',
    excerpt: 'Um guia prático e comentado dos artigos mais importantes da nova lei de licitações. Não e doutrina — e o dia a dia do pregoeiro explicado artigo por artigo, com exemplos reais.',
    content: `## A Lei 14.133 na prática do dia a dia

A Lei 14.133/2021 tem 194 artigos. Nenhum servidor precisa decorar todos. Mas existem **20 artigos que aparecém em praticamente todo processo**. Este guia comenta cada um deles com linguagem direta e exemplos práticos.

### Fase preparatoria

**Art. 18 — Planejamento obrigatório**
Todo processo deve ter: DFD, ETP, Mapa de Riscos, TR e orçamento estimado. **Na prática**: e o artigo que o TCU mais cita em determinações. Se falta qualquer um desses documentos, o processo esta irregular.

**Art. 23 — Pesquisa de preços**
O preço de referência deve ser obtido de contratações públicas similares, pesquisa com fornecedores, sistemas oficiais ou contratações da administração. **Na prática**: a IN 65/2021 detalha como fazer. O ATA360 automatiza esta etapa.

**Art. 6°, XXIII — ETP**
Define o Estudo Técnico Preliminar como documento que diagnostica a necessidade. **Na prática**: ETP não e copia do TR. ETP analisa o problema; TR descreve a solução.

### Agentes e responsabilidades

**Art. 7° — Agente de contratação**
Servidor efetivo ou empregado público com funções essenciais no processo. **Na prática**: não pode ser comissionado sem vinculo efetivo. Pregoeiro e uma das funções do agente.

**Art. 8° — Comissao de contratação**
Para licitações de maior complexidade, substitui o agente individual. **Na prática**: obrigatória para diálogos competitivos e pode ser exigida para concorrências.

**Art. 11 — Principios**
Legalidade, impessoalidade, eficiência, transparência, competitividade, proporcionalidade, **sustentabilidade**, inovação. **Na prática**: sustentabilidade e principio, não opcao.

### Modalidades

**Art. 28 — Cinco modalidades**
Pregão, concorrência, concurso, leilão e diálogo competitivo. **Na prática**: pregão continua sendo a mais usada (bens e serviços comuns). Diálogo competitivo e a grande novidade para soluções inovadoras.

**Art. 75 — Dispensa de licitação**
Enumera todas as hipoteses. As mais usadas: até R$ 59.906,02 para compras (atualizado 2024), até R$ 119.812,03 para obras, emergência, desercao/fracasso. **Na prática**: fracionamento para caber no limite e o erro mais punido.

### Documentos essenciais

**Art. 40 — Termo de Referência**
Define o objeto com: descrição detalhada, fundamentação legal, descrição da solução, critérios de sustentabilidade, estimativa de custo. **Na prática**: TR incompleto e a segunda maior causa de impugnação.

**Art. 53 — Fase preparatoria completa**
Lista todos os documentos que devem compor o processo antes da publicação do edital. **Na prática**: checklist obrigatório.

### Contratos

**Art. 117 — Fiscalização**
Designacao obrigatória de fiscal técnico e administrativo. **Na prática**: fiscal sem capacitação responde por falhas. Deve existir portaria de designação.

**Art. 124 — Reequilíbrio**
Permite repactuação, reajuste e revisao de preços. **Na prática**: reforma tributária vai gerar muitos pedidos de reequilíbrio (IBS/CBS).

**Art. 125 — Limites de aditivo**
Até 25% para acréscimos e supressões. 50% para reforma de edificio ou equipamento. **Na prática**: aditivo acima do limite e nulo.

### Controle e transparência

**Art. 169 — Controle das contratações**
Órgãos de controle (TCU, TCEs, CGU) fiscalizam em tempo real. **Na prática**: dados do PNCP são monitorados automaticamente.

**Art. 174 — PNCP**
Públicacao obrigatória de editais, contratos e atas. **Na prática**: não publicar e motivo de anulação.

### Sanções

**Art. 155 a 163 — Sanções a fornecedores**
Advertencia, multa, impedimento (até 3 anos), declaracao de inidoneidade (3 a 6 anos). **Na prática**: tudo registrado no PNCP — fornecedor impedido em um órgão fica visivel para todos.

**Art. 73 — Responsabilizacao pessoal do agente**
O agente responde por atos dolosos ou com erro grosseiro. **Na prática**: "erro grosseiro" e o que o TCU define como tal — e a definicao vem se ampliando.

### O ATA360 e a Lei 14.133

Cada documento gerado pelo ATA360 referência o artigo correspondente da Lei 14.133. O servidor não precisa procurar — a fundamentação vem embutida, atualizada e rastreável.

**Fonte:** [Planalto — Lei 14.133/2021 na integra](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm)`,
    category: 'legislacao',
    tags: ['Lei 14.133', 'artigos comentados', 'guia prático', 'licitações', 'nova lei', 'servidor público'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-01-30T08:00:00Z',
    updatedAt: '2026-01-30T08:00:00Z',
    readingTimeMin: 10,
    featured: false,
    seoTitle: 'Lei 14.133 comentada: 20 artigos essenciais na prática | ATA360',
    seoDescription: 'Os 20 artigos mais importantes da Lei 14.133/2021 comentados com linguagem direta e exemplos do dia a dia do pregoeiro.',
    relatedSlugs: ['acórdãos-súmulas-jurisprudencia-o-que-sao-compras-publicas', 'ranking-erros-licitacoes-tcu-tce-mg-brasil'],
    glossaryTerms: ['agente-de-contratacao', 'pregoeiro', 'etp', 'termo-de-referencia'],
    legalReferences: ['Lei 14.133/2021 (integra)'],
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    sourceName: 'Planalto',
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
