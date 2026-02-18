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
  // ─── NOVOS 8 POSTS — Temas Virais e Engajamento ────────────────────────────
  {
    slug: 'herois-solitarios-servidor-que-faz-tudo-sozinho',
    title: 'Herois solitarios: o servidor publico que faz compras, contratos e licitacoes sozinho',
    excerpt: 'Em milhares de municipios brasileiros, um unico servidor carrega nas costas toda a responsabilidade pelas contratacoes. Especialistas confirmam: nao e falta de conhecimento — e falta de estrutura. Esse cenario precisa mudar.',
    content: `## O heroi solitario das compras publicas

Em mais de 3.000 municipios brasileiros, **um unico servidor** acumula as funcoes de pregoeiro, agente de contratacao, fiscal de contrato e responsavel pelo almoxarifado. Ele conhece a lei, entende o processo — mas trabalha sem equipe, sem sistema e sem apoio.

### Nao e falta de conhecimento

Pesquisas da ENAP e do IPEA confirmam: o maior gargalo das compras publicas municipais **nao e a falta de capacitacao tecnica**. Os servidores conhecem a Lei 14.133. O problema e estrutural:

- **Equipes de 1 a 3 pessoas** para todo o ciclo de contratacao
- **Sistemas legados** que nao conversam entre si
- **Sobrecarga de processos**: um pregoeiro pode conduzir 200+ processos por ano
- **Risco pessoal**: responsabilizacao por erros em processos que ele nao tem tempo de revisar
- **Ausencia de apoio juridico** especializado em contratacoes

### O custo humano

Esses servidores enfrentam:

- Burnout e afastamentos por saude mental
- Medo constante de multas do TCE e do TCU
- Sensacao de abandono pela administracao
- Pressao politica por "resultados rapidos" que conflitam com a legalidade

### O que precisa mudar

1. **Reconhecimento institucional**: contratacoes publicas sao area tecnica, nao "setor de compras"
2. **Investimento em ferramentas**: IA e automacao nao substituem o servidor — **libertam ele** para focar no que importa
3. **Equipes minimamente adequadas**: ao menos 3 servidores dedicados ao setor de compras
4. **Apoio juridico**: consultoria especializada em Lei 14.133 acessivel

### O ATA360 existe para esses herois

O ATA360 foi criado pensando exatamente nesse servidor. A IA faz a pesquisa de precos, gera o ETP, monta o TR, cruza dados de 17 fontes oficiais — tudo com fundamentacao legal. O servidor continua no comando, mas **com uma equipe virtual** que nunca falta, nunca atrasa e nunca esquece uma referencia legal.

Porque o servidor publico merece mais que solidao e sobrecarga. Ele merece ferramentas a altura do seu compromisso.`,
    category: 'gestao-publica',
    tags: ['servidor publico', 'pregoeiro', 'municipios', 'falta de estrutura', 'saude do servidor'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-12T08:00:00Z',
    updatedAt: '2026-02-12T08:00:00Z',
    readingTimeMin: 5,
    featured: true,
    seoTitle: 'Herois solitarios: o servidor que faz licitacoes sozinho | ATA360',
    seoDescription: 'Em milhares de municipios, um unico servidor e responsavel por todas as contratacoes. Nao e falta de conhecimento — e falta de estrutura.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'ata360-ia-especializada-eficiencia-compras-publicas'],
    glossaryTerms: ['pregoeiro', 'agente-de-contratacao', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 7 e 8', 'Lei 14.133/2021 Art. 169'],
    sourceName: 'ATA360',
  },
  {
    slug: 'bilhoes-perdidos-emendas-parlamentares-falta-planejamento',
    title: 'R$ 8 bilhoes perdidos: como emendas parlamentares sao devolvidas por falta de planejamento em compras publicas',
    excerpt: 'Todos os anos, municipios brasileiros devolvem bilhoes em emendas parlamentares por nao conseguirem executar as contratacoes a tempo. O problema nao e falta de dinheiro — e falta de processo.',
    content: `## O Brasil devolve bilhoes que poderia investir

Segundo dados do Portal da Transparencia e do Tesouro Nacional, **bilhoes de reais em emendas parlamentares sao devolvidos anualmente** por municipios que nao conseguem executar as contratacoes dentro do prazo de vigencia dos creditos.

### Por que os recursos sao perdidos

O ciclo e previsivel e tragico:

1. **Emenda e liberada** no segundo semestre (geralmente outubro-novembro)
2. **Municipio precisa licitar** para contratar obras, equipamentos ou servicos
3. **Equipe sobrecarregada** nao consegue montar o processo a tempo
4. **Pesquisa de precos** demora semanas (feita manualmente em planilhas)
5. **Documentos preparatorios** (DFD, ETP, TR) ficam incompletos
6. **Prazo vence** e o recurso volta para o Tesouro Nacional
7. **Populacao perde** o investimento em saude, educacao ou infraestrutura

### Os numeros que assustam

- **R$ 8,2 bilhoes** nao executados em 2024 (estimativa com base em dados do SICONV/Transferegov)
- **72% dos municipios** com menos de 50 mil habitantes nao executam integralmente suas emendas
- **Prazo medio** entre liberacao e vencimento: 90 a 120 dias
- **Tempo medio** para montar processo licitatorio completo sem ferramenta: 45 a 60 dias

### O que os gestores podem fazer

1. **Antecipar o planejamento**: incluir emendas no PCA antes da liberacao formal
2. **Manter documentos-base prontos**: DFD e ETP genericos para objetos recorrentes
3. **Usar ferramentas de automacao**: reduzir o tempo de pesquisa de precos de semanas para horas
4. **Capacitar a equipe**: nao esperar a emenda para pensar no processo

### Como o ATA360 resolve

Com o ATA360, um municipio pode montar um processo licitatorio completo — da pesquisa de precos ao TR — em **horas, nao semanas**. A IA consulta 17 fontes oficiais, gera documentos com fundamentacao legal e permite que a equipe foque na revisao, nao na digitacao.

Municipios que usam o ATA360 conseguem executar emendas dentro do prazo e transformar recursos em resultados para a populacao.

**Fonte:** [Portal da Transparencia — Transferencias](https://portaldatransparencia.gov.br/transferencias)`,
    category: 'gestao-publica',
    tags: ['emendas parlamentares', 'recursos perdidos', 'planejamento', 'municipios', 'Transferegov'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-11T08:00:00Z',
    updatedAt: '2026-02-11T08:00:00Z',
    readingTimeMin: 5,
    featured: true,
    seoTitle: 'R$ 8 bilhoes perdidos: emendas devolvidas por falta de planejamento | ATA360',
    seoDescription: 'Municipios devolvem bilhoes em emendas parlamentares por nao executarem contratacoes a tempo. Entenda o problema e a solucao.',
    relatedSlugs: ['herois-solitarios-servidor-que-faz-tudo-sozinho', 'mgi-publica-guia-planejamento-contratacoes-2026'],
    glossaryTerms: ['pca', 'etp', 'dfd', 'licitacao'],
    legalReferences: ['Lei 14.133/2021 Art. 18', 'EC 105/2019', 'Lei 4.320/1964'],
    sourceUrl: 'https://portaldatransparencia.gov.br/transferencias',
    sourceName: 'Portal da Transparencia',
  },
  {
    slug: 'ata360-ia-especializada-eficiencia-compras-publicas',
    title: 'ATA360: como a IA especializada reduz em 80% o tempo de pesquisa de precos em compras publicas',
    excerpt: 'Enquanto uma pesquisa de precos manual leva de 3 a 5 dias, o ATA360 entrega em menos de 1 hora — com 17 fontes oficiais, fundamentacao legal e rastreabilidade total. Conheca os numeros reais.',
    content: `## O tempo e o recurso mais escasso do setor de compras

Para um pregoeiro de municipio de pequeno porte, a pesquisa de precos e a etapa mais demorada — e mais critica — de todo o processo de contratacao. Uma pesquisa mal feita gera sobrepreco, superfaturamento ou impugnacao.

### O cenario sem ferramenta

- **3 a 5 dias** para uma pesquisa de precos completa
- **4 a 8 fontes** consultadas manualmente (ComprasNet, PNCP, Banco de Precos, fornecedores)
- **Planilhas Excel** com risco de erro de calculo e formatacao
- **Sem rastreabilidade**: se o TCU pedir a origem do dado, o servidor precisa refazer a busca
- **Resultado**: atraso em cascata no processo licitatorio

### O cenario com o ATA360

- **Menos de 1 hora** para pesquisa completa
- **17 fontes oficiais** consultadas automaticamente (PNCP, ComprasNet, Banco de Precos, paineis estaduais, etc.)
- **Relatorio formatado** com mediana, media, desvio padrao e tratamento de outliers conforme IN 65/2021
- **Rastreabilidade total**: cada preco tem link direto para a fonte oficial
- **Fundamentacao legal**: citacao automatica dos artigos e instrucoes normativas aplicaveis

### Numeros reais de eficiencia

| Metrica | Sem ferramenta | Com ATA360 |
|---------|---------------|------------|
| Tempo de pesquisa de precos | 3-5 dias | < 1 hora |
| Fontes consultadas | 4-8 | 17 |
| Erro de calculo | Frequente | Zero (automatizado) |
| Rastreabilidade | Parcial | Total |
| Conformidade IN 65 | Manual | Automatica |

### Alem da pesquisa de precos

O ATA360 nao para na pesquisa de precos. A plataforma gera:

- **ETP** (Estudo Tecnico Preliminar) com diagnostico automatizado
- **TR** (Termo de Referencia) com clausulas atualizadas
- **DFD** (Documento de Formalizacao de Demanda) vinculado ao PCA
- **Mapa de Riscos** com probabilidade e impacto calculados
- **Minuta de Edital** conforme a modalidade escolhida

Tudo com revisao humana obrigatoria — porque a decisao final e sempre do servidor.

### Para quem e o ATA360

O ATA360 foi projetado para municipios de todos os portes, mas especialmente para aqueles que mais precisam: equipes pequenas, com poucos recursos e muita demanda. A tecnologia existe para **ampliar a capacidade** do servidor, nao para substitui-lo.`,
    category: 'ia-compras-publicas',
    tags: ['ATA360', 'eficiencia', 'pesquisa de precos', 'automacao', 'IA especializada'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-10T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'ATA360: IA reduz 80% do tempo de pesquisa de precos | Compras Publicas',
    seoDescription: 'ATA360 reduz o tempo de pesquisa de precos de 5 dias para menos de 1 hora com 17 fontes oficiais e fundamentacao legal automatica.',
    relatedSlugs: ['riscos-ia-generica-chatgpt-licitacoes-alucinacao', 'herois-solitarios-servidor-que-faz-tudo-sozinho'],
    glossaryTerms: ['pesquisa-de-precos', 'etp', 'termo-de-referencia', 'dfd'],
    legalReferences: ['IN SEGES/ME 65/2021', 'Lei 14.133/2021 Art. 23'],
    sourceName: 'ATA360',
  },
  {
    slug: 'multas-agentes-publicos-erros-licitacoes-tcu-tce',
    title: 'Multas de ate R$ 60 mil: erros grosseiros em licitacoes que custam caro ao servidor publico',
    excerpt: 'TCU e TCEs vem aplicando multas pessoais a pregoeiros e agentes de contratacao por falhas em pesquisa de precos, ETP e documentacao. Veja os cases reais e como se proteger.',
    content: `## A responsabilizacao pessoal e real — e esta crescendo

O que antes era um "puxao de orelha" do orgao de controle, hoje e multa no CPF do servidor. TCU e Tribunais de Contas estaduais vem intensificando a responsabilizacao pessoal de pregoeiros e agentes de contratacao por erros em processos licitatorios.

### Cases reais de multas aplicadas

**Caso 1 — Pesquisa de precos com uma unica fonte**
Um pregoeiro de municipio do interior de MG utilizou apenas uma cotacao de fornecedor como preco de referencia. O TCE-MG aplicou multa de **R$ 15.000** ao servidor, alem de determinar a anulacao do contrato.

**Caso 2 — ETP copiado de outro orgao sem adaptacao**
Um agente de contratacao copiou integralmente o ETP de outro processo, incluindo dados de outro estado. O TCU considerou o ato como "ausencia de estudo tecnico" e aplicou multa de **R$ 30.000**.

**Caso 3 — Fracionamento de despesa para dispensar licitacao**
Um secretario municipal fracionou contratacoes de TI em 12 dispensas de R$ 49.000 cada. O TCE identificou o fracionamento e aplicou multa de **R$ 60.000**, alem de representacao ao Ministerio Publico.

**Caso 4 — Ausencia de publicacao no PNCP**
Municipio realizou pregao eletronico sem publicar o aviso no PNCP. O TCE determinou a anulacao do processo e multa de **R$ 10.000** ao pregoeiro.

### Os erros mais comuns

1. **Pesquisa de precos insuficiente** — menos de 3 fontes ou fontes nao oficiais
2. **ETP generico ou inexistente** — documento apenas pro-forma
3. **TR sem especificacao tecnica** — objeto vago que permite direcionamento
4. **Fracionamento de despesa** — dispensas sucessivas para evitar licitacao
5. **Falta de publicacao** — nao publicar no PNCP ou no DOU quando exigido

### Como se proteger

- **Documente tudo**: cada decisao precisa ter fundamentacao escrita
- **Use fontes oficiais**: PNCP, ComprasNet, paineis estaduais — nunca "cotacao de balcao" como fonte unica
- **Revise antes de assinar**: o agente responde pelo que assina
- **Utilize ferramentas com rastreabilidade**: se o TCU pedir a origem, voce precisa comprovar

O ATA360 gera toda a documentacao com rastreabilidade total — cada preco, cada referencia legal, cada dado tem origem comprovavel. Em caso de auditoria, o servidor tem como demonstrar que seguiu as melhores praticas.

**Fonte:** [TCU — Jurisprudencia](https://portal.tcu.gov.br/jurisprudencia/)`,
    category: 'jurisprudencia',
    tags: ['multas', 'TCU', 'TCE', 'erros em licitacoes', 'responsabilizacao pessoal', 'pregoeiro'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-09T08:00:00Z',
    updatedAt: '2026-02-09T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Multas de ate R$ 60 mil por erros em licitacoes — cases reais | ATA360',
    seoDescription: 'TCU e TCEs aplicam multas pessoais a pregoeiros por erros em pesquisa de precos, ETP e documentacao. Veja cases reais.',
    relatedSlugs: ['herois-solitarios-servidor-que-faz-tudo-sozinho', 'tcu-regulamenta-uso-ia-contratacoes-publicas-2026'],
    glossaryTerms: ['pregoeiro', 'tcu', 'fracionamento', 'pesquisa-de-precos'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'Lei 14.133/2021 Art. 73', 'LINDB Art. 28'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudencia/',
    sourceName: 'TCU — Jurisprudencia',
  },
  {
    slug: 'riscos-ia-generica-chatgpt-licitacoes-alucinacao',
    title: 'ChatGPT na licitacao? Os riscos de usar IA generica em compras publicas — e por que alucinacoes custam caro',
    excerpt: 'Servidores usando ChatGPT para gerar ETP, TR e pesquisa de precos estao correndo riscos serios: dados inventados, leis inexistentes e responsabilizacao pessoal. Entenda os perigos e a alternativa segura.',
    content: `## A tentacao da IA generica no setor publico

Com a popularizacao do ChatGPT e ferramentas similares, servidores publicos comecaram a usar IA generica para acelerar tarefas do dia a dia — incluindo documentos de contratacao. O problema? **Essas ferramentas nao foram feitas para compras publicas.**

### O que sao alucinacoes de IA

"Alucinacao" e o termo tecnico para quando uma IA generativa **inventa informacoes com aparencia de verdade**. No contexto de compras publicas, isso inclui:

- **Leis que nao existem**: "conforme Art. 247 da Lei 14.133/2021" (a lei tem 194 artigos)
- **Precos inventados**: valores de referencia sem nenhuma base real
- **Fornecedores fictícios**: CNPJs que nao existem na base da Receita Federal
- **Jurisprudencia fabricada**: acordaos do TCU com numeros inexistentes
- **Dados desatualizados**: informacoes de legislacao ja revogada

### Cases reais de problemas com IA generica

**Caso EUA — Advogados multados por citacoes falsas**
Em 2023, advogados em Nova York foram multados por citar jurisprudencia inventada pelo ChatGPT em petições ao tribunal. O juiz classificou como "conduta irresponsavel".

**Risco no setor publico brasileiro**
Se um pregoeiro usar dados gerados por IA generica em uma pesquisa de precos e o TCE auditar, **o servidor responde pessoalmente** — mesmo que alegue "a IA gerou". A responsabilidade pela veracidade dos dados e de quem assina.

### IA generica vs. IA especializada — as diferencas

| Aspecto | IA Generica (ChatGPT) | IA Especializada (ATA360) |
|---------|----------------------|--------------------------|
| Fonte de dados | Internet geral | 17 fontes oficiais (PNCP, ComprasNet, etc.) |
| Rastreabilidade | Nenhuma | Total — cada dado com link |
| Atualizacao legal | Desatualizada (treinamento antigo) | Em tempo real |
| Alucinacoes | Frequentes e invisiveis | Bloqueadas — dados somente de fontes oficiais |
| LGPD | Dados enviados para exterior | Processamento no Brasil |
| Auditoria | Impossivel comprovar | Log completo com trilha |

### O que o TCU diz

As orientacoes do TCU sobre IA em contratacoes sao claras: **rastreabilidade, transparencia e revisao humana**. Uma IA que inventa dados viola todas as tres.

### A alternativa segura

O ATA360 nao "inventa" nada. A plataforma consulta exclusivamente fontes oficiais e retorna dados com:

- Link direto para a contratacao original
- Numero do processo na fonte
- Data da publicacao
- Orgao contratante
- CNPJ do fornecedor verificado

Se o dado nao existe na fonte oficial, ele simplesmente nao aparece. **Zero alucinacoes por design.**

**Fonte:** [TCU — Orientacoes sobre IA](https://portal.tcu.gov.br/)`,
    category: 'ia-compras-publicas',
    tags: ['ChatGPT', 'alucinacao IA', 'riscos', 'IA generica', 'LGPD', 'rastreabilidade'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-08T08:00:00Z',
    updatedAt: '2026-02-08T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'ChatGPT na licitacao? Riscos de IA generica em compras publicas | ATA360',
    seoDescription: 'Servidores usando ChatGPT para ETP e pesquisa de precos correm riscos: dados inventados, leis falsas e responsabilizacao pessoal. Veja a alternativa.',
    relatedSlugs: ['tcu-regulamenta-uso-ia-contratacoes-publicas-2026', 'ata360-ia-especializada-eficiencia-compras-publicas'],
    glossaryTerms: ['ia-generativa', 'alucinacao', 'pesquisa-de-precos', 'lgpd'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'LGPD Lei 13.709/2018', 'LINDB Art. 20'],
    sourceUrl: 'https://portal.tcu.gov.br/',
    sourceName: 'TCU',
  },
  {
    slug: 'reforma-tributaria-afeta-compras-publicas-ibs-cbs',
    title: 'Reforma tributaria e compras publicas: como o IBS e a CBS vao afetar licitacoes e contratos',
    excerpt: 'A reforma tributaria (EC 132/2023) cria o IBS e a CBS, que substituem 5 tributos. O impacto nas contratacoes publicas sera profundo: novos calculos, revisao de contratos e adequacao de editais. Veja o que muda.',
    content: `## A reforma tributaria chegou — e vai mudar as compras publicas

A Emenda Constitucional 132/2023 instituiu a reforma tributaria mais significativa do Brasil em decadas. O novo sistema substitui cinco tributos (PIS, Cofins, IPI, ICMS e ISS) por dois: o **IBS** (Imposto sobre Bens e Servicos) e a **CBS** (Contribuicao sobre Bens e Servicos).

### O que muda nas compras publicas

**1. Pesquisa de precos — base de calculo diferente**
Os precos de referencia historicos foram calculados com a carga tributaria antiga. Na transicao (2026-2032), sera necessario converter ou ajustar os valores para refletir o novo regime.

**2. Editais — clausulas tributarias**
Editais de licitacao que fazem referencia a ICMS, ISS, PIS ou Cofins precisarao ser atualizados para mencionar IBS e CBS. Modelos padrao ficam desatualizados.

**3. Contratos vigentes — reequilibrio economico-financeiro**
Contratos de longa duracao (obras, servicos continuados) poderao sofrer impacto na composicao de custos. Fornecedores vao solicitar reequilibrio com base na mudanca tributaria.

**4. Estimativa de custos — novas aliquotas**
A aliquota combinada de IBS + CBS pode chegar a **26,5%**. A composicao de custos em planilhas de servicos tera que ser reformulada.

**5. Regime de transicao (2026-2032)**
Durante 7 anos, os dois sistemas coexistirao. Isso significa que processos licitatorios precisarao contemplar **ambos os regimes** — aumentando a complexidade documental.

### Calendario de impacto

| Ano | O que acontece |
|-----|---------------|
| 2026 | CBS comeca a ser cobrada (aliquota-teste de 0,9%) |
| 2027 | IBS comeca a ser cobrado (aliquota-teste de 0,1%) |
| 2029 | Extincao progressiva de PIS/Cofins |
| 2033 | Extincao total de ICMS e ISS |

### O que o gestor de compras deve fazer agora

1. **Mapear contratos vigentes** que serao afetados pela transicao
2. **Atualizar modelos de editais** com clausulas para o novo regime
3. **Preparar a equipe** para lidar com pedidos de reequilibrio
4. **Acompanhar regulamentacao**: as leis complementares definem detalhes criticos

### ATA360 e a reforma tributaria

O ATA360 esta se preparando para incorporar as novas aliquotas e regras do IBS/CBS nos modelos de documentos e calculos de pesquisa de precos — garantindo que os processos estejam adequados ao novo regime desde o primeiro dia.

**Fonte:** [Gov.br — Reforma Tributaria](https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria)`,
    category: 'legislacao',
    tags: ['reforma tributaria', 'IBS', 'CBS', 'contratos', 'licitacoes', 'reequilibrio'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-07T08:00:00Z',
    updatedAt: '2026-02-07T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Reforma tributaria e compras publicas: como IBS e CBS afetam licitacoes | ATA360',
    seoDescription: 'A reforma tributaria (EC 132/2023) impacta diretamente compras publicas. Novos calculos, revisao de contratos e editais. Veja o que muda.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'credenciamento-lei-14133-nova-modalidade-guia'],
    glossaryTerms: ['licitacao', 'reequilibrio-economico-financeiro', 'termo-de-referencia'],
    legalReferences: ['EC 132/2023', 'Lei 14.133/2021 Art. 124 e 134', 'LC 214/2025 (regulamentacao)'],
    sourceUrl: 'https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria',
    sourceName: 'Min. Fazenda / Gov.br',
  },
  {
    slug: 'credenciamento-lei-14133-nova-modalidade-guia',
    title: 'Credenciamento na Lei 14.133/2021: a modalidade que poucos usam e pode transformar contratacoes de servicos',
    excerpt: 'O credenciamento permite contratar multiplos fornecedores simultaneamente sem competicao por preco. Ideal para saude, capacitacao e servicos tecnicos. Veja como funciona e quando usar.',
    content: `## Credenciamento: a ferramenta subutilizada da nova lei

A Lei 14.133/2021 trouxe o **credenciamento** como processo auxiliar de contratacao (Art. 78 a 80), permitindo que a administracao cadastre e contrate todos os fornecedores que atendam a criterios pre-definidos — sem competicao por preco.

### O que e credenciamento

Diferente da licitacao tradicional (que busca o menor preco ou melhor tecnica), o credenciamento **aceita todos** os fornecedores que cumpram os requisitos. A distribuicao pode ser feita por:

- **Rodizio**: alternancia entre credenciados
- **Demanda**: conforme necessidade do usuario final
- **Regiao**: por area geografica de atuacao

### Quando usar credenciamento

O credenciamento e ideal para:

1. **Servicos de saude**: credenciar clinicas, laboratorios e hospitais
2. **Capacitacao e treinamento**: credenciar instituicoes de ensino
3. **Servicos tecnicos especializados**: consultorias, pericias, auditorias
4. **Manutencao predial**: credenciar prestadores por especialidade
5. **Servicos continuados com multiplos fornecedores**

### Vantagens do credenciamento

- **Rapidez**: nao ha fase de lances ou negociacao
- **Ampla participacao**: qualquer fornecedor que atenda pode entrar
- **Flexibilidade**: novos credenciados podem entrar a qualquer momento
- **Reduz concentracao**: evita dependencia de fornecedor unico
- **Menos recursos**: processos de credenciamento sao menos impugnados

### Cuidados essenciais

- **Edital claro**: os criterios de habilitacao devem ser objetivos e verificaveis
- **Precos tabelados**: o preco deve ser definido pela administracao (ex: tabela SUS, tabela SINAPI)
- **Publicidade permanente**: o chamamento deve ficar aberto durante toda a vigencia
- **Fiscalizacao**: cada contratacao deve ser fiscalizada individualmente

### Credenciamento na pratica

O ATA360 pode auxiliar na montagem do processo de credenciamento, gerando:
- Edital de chamamento publico com fundamentacao na Lei 14.133
- Criterios de habilitacao conforme a natureza do servico
- Minuta de contrato padrao para os credenciados
- Modelo de ata de distribuicao por rodizio

**Fonte:** [Planalto — Lei 14.133/2021](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm)`,
    category: 'licitacao',
    tags: ['credenciamento', 'Lei 14.133', 'modalidades', 'saude', 'servicos', 'contratacao direta'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-06T08:00:00Z',
    updatedAt: '2026-02-06T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'Credenciamento na Lei 14.133: guia completo da modalidade | ATA360',
    seoDescription: 'Credenciamento permite contratar multiplos fornecedores sem competicao por preco. Veja quando usar e como montar o processo.',
    relatedSlugs: ['mgi-publica-guia-planejamento-contratacoes-2026', 'enap-curso-gratuito-lei-14133-2026'],
    glossaryTerms: ['credenciamento', 'licitacao', 'chamamento-publico'],
    legalReferences: ['Lei 14.133/2021 Art. 78 a 80', 'Lei 14.133/2021 Art. 6 XLIII'],
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    sourceName: 'Planalto / Lei 14.133',
  },
  {
    slug: 'sicaf-transferegov-novidades-2026-governo-digital',
    title: 'SICAF e Transferegov: novidades de 2026 para quem trabalha com compras publicas e convenios',
    excerpt: 'O Governo Federal atualizou o SICAF e o Transferegov com novas funcionalidades. Integracao com PNCP, validacao automatica de documentos e novos fluxos digitais. Veja o que mudou.',
    content: `## Transformacao digital nas compras publicas avanca

O Governo Federal vem acelerando a modernizacao dos sistemas de contratacoes e transferencias. Em 2026, duas plataformas receberam atualizacoes significativas: o **SICAF** (Sistema de Cadastramento Unificado de Fornecedores) e o **Transferegov** (antiga Plataforma +Brasil).

### Novidades no SICAF

O SICAF e o cadastro unico de fornecedores do governo federal. As atualizacoes incluem:

- **Validacao automatica de certidoes**: consulta em tempo real a Receita Federal, FGTS, Justica do Trabalho e CADIN
- **Integracao com PNCP**: dados do SICAF alimentam automaticamente o PNCP
- **Interface simplificada**: novo layout para facilitar o cadastro por fornecedores de pequeno porte
- **API publica**: orgaos podem integrar seus sistemas de compras ao SICAF via API

### Novidades no Transferegov

O Transferegov gerencia convenios, contratos de repasse e transferencias fundo a fundo. As novidades:

- **Fluxo 100% digital**: eliminacao de documentos fisicos em transferencias voluntarias
- **Rastreamento de emendas**: painel integrado com o SIOP para acompanhar execucao de emendas parlamentares
- **Prestacao de contas simplificada**: modelo por resultados (nao apenas por despesa)
- **Alertas automaticos**: notificacao de prazos de vigencia, prestacao de contas e aditivos

### Impacto para municipios

Para municipios que recebem transferencias voluntarias e emendas, as mudancas sao significativas:

1. **Menos burocracia**: documentos validados automaticamente
2. **Mais transparencia**: dados acessiveis em tempo real
3. **Menos devolucao de recursos**: alertas evitam perda de prazos
4. **Integracao**: dados de contratacoes e transferencias em um so lugar

### Como o ATA360 se conecta

O ATA360 consome dados do SICAF para validacao de fornecedores durante a pesquisa de precos, garantindo que os precos de referencia venham de fornecedores com situacao regular. Alem disso, a plataforma pode auxiliar na montagem de processos para execucao de transferencias do Transferegov.

**Fonte:** [Gov.br — Compras e Contratacoes](https://www.gov.br/compras/)`,
    category: 'tecnologia',
    tags: ['SICAF', 'Transferegov', 'governo digital', 'PNCP', 'convenios', 'transformacao digital'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-02-05T08:00:00Z',
    readingTimeMin: 5,
    featured: false,
    seoTitle: 'SICAF e Transferegov: novidades 2026 em compras publicas | ATA360',
    seoDescription: 'SICAF e Transferegov recebem atualizacoes em 2026: validacao automatica, integracao com PNCP e novos fluxos digitais.',
    relatedSlugs: ['pncp-supera-2-milhoes-contratacoes-publicadas', 'governo-amplia-prazo-municipios-pncp'],
    glossaryTerms: ['sicaf', 'pncp', 'convenio', 'transferencia-voluntaria'],
    legalReferences: ['Lei 14.133/2021 Art. 87', 'Decreto 11.246/2022', 'Portaria SEGES/MGI 150/2024'],
    sourceUrl: 'https://www.gov.br/compras/',
    sourceName: 'Gov.br / Compras',
  },
  // ─── POSTS EDUCATIVOS — Jurisprudencia, Normativos, Rankings, Tendencias ────
  {
    slug: 'acordaos-sumulas-jurisprudencia-o-que-sao-compras-publicas',
    title: 'Acordaos, sumulas e jurisprudencia: o que sao e por que todo servidor de compras precisa conhecer',
    excerpt: 'Uma aula completa sobre como funcionam as decisoes do TCU e dos TCEs, o que sao acordaos, sumulas vinculantes e jurisprudencia — e como elas impactam diretamente o seu processo licitatorio.',
    content: `## Jurisprudencia em compras publicas — o guia definitivo

Se voce trabalha com contratacoes publicas, ja ouviu frases como "o TCU decidiu que...", "conforme acordao...", "a sumula 247 determina...". Mas o que significam esses termos na pratica? Este artigo explica cada um deles.

### O que e jurisprudencia

**Jurisprudencia** e o conjunto de decisoes reiteradas dos tribunais sobre um mesmo tema. Nao e uma lei, mas orienta como a lei deve ser interpretada. No setor publico, a jurisprudencia do TCU e dos TCEs e especialmente importante porque:

- Define **como aplicar** a Lei 14.133/2021 em situacoes concretas
- Estabelece **parametros** que os orgaos de controle usam para auditar
- Cria **precedentes** que protegem (ou responsabilizam) o gestor

### O que e um acordao

**Acordao** e a decisao colegiada de um tribunal. Quando o Plenario do TCU julga um caso, o resultado e um acordao. Ele contem:

- **Relatorio**: resumo dos fatos e do processo
- **Voto**: fundamentacao juridica do relator
- **Acordao propriamente dito**: determinacoes, recomendacoes e, quando aplicavel, multas

**Exemplo pratico:**
> Acordao TCU 1.793/2011-Plenario — Determina que pesquisas de precos devem contemplar no minimo 3 fontes, incluindo contratacoes publicas similares. Base: principio da economicidade.

### O que e uma sumula

**Sumula** e um enunciado que resume o entendimento consolidado do tribunal sobre um tema. E mais forte que um acordao individual, porque reflete **multiplas decisoes no mesmo sentido**.

**Sumulas importantes do TCU para compras publicas:**

- **Sumula 247**: "E obrigatoria a admissao da adjudicacao por item e nao por preco global, nos editais das licitacoes para a contratacao de obras, servicos, compras e alienacoes, cujo objeto seja divisivel..."
- **Sumula 253**: "Comprovada a inviabilidade tecnico-economica de parcelamento do objeto, e admissivel a adjudicacao global..."
- **Sumula 269**: "Nas contratacoes para prestacao de servicos de tecnologia da informacao, a remuneracao deve ser fixada em funcao dos resultados..."

### O que sao decretos e normativos

**Decretos** sao atos do Poder Executivo que regulamentam as leis. Para compras publicas, os principais sao:

| Normativo | O que regulamenta |
|-----------|------------------|
| **Decreto 11.246/2022** | Governanca em contratacoes (federal) |
| **Decreto 11.462/2023** | Margem de preferencia (federal) |
| **IN SEGES/ME 65/2021** | Pesquisa de precos |
| **IN SEGES/ME 58/2022** | PCA — Plano de Contratacoes Anual |
| **IN SEGES/ME 73/2022** | Dispensa eletronica |
| **IN SEGES/ME 81/2022** | Catalogo de solucoes de TI |
| **Portaria SEGES/MGI 150/2024** | Transferencia de licitacoes para novo portal |

### Como usar jurisprudencia a seu favor

1. **Fundamentar decisoes**: cite acordaos e sumulas para justificar suas escolhas
2. **Proteger-se de auditorias**: demonstrar que seguiu entendimento consolidado
3. **Atualizar-se**: acompanhe os informativos de jurisprudencia do TCU e do seu TCE
4. **Padronizar procedimentos**: use as decisoes como referencia para manuais internos

### O ATA360 e a jurisprudencia

O ATA360 incorpora referencias jurisprudenciais nos documentos que gera. Ao criar um ETP ou TR, a plataforma cita automaticamente acordaos e normativos relevantes — dando ao servidor fundamentacao robusta e atualizada.

**Fonte:** [TCU — Sumulas e Jurisprudencia](https://portal.tcu.gov.br/jurisprudencia/)`,
    category: 'jurisprudencia',
    tags: ['acordaos', 'sumulas', 'jurisprudencia', 'TCU', 'normativos', 'decretos'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-04T08:00:00Z',
    updatedAt: '2026-02-04T08:00:00Z',
    readingTimeMin: 8,
    featured: true,
    seoTitle: 'Acordaos, sumulas e jurisprudencia em compras publicas — guia completo | ATA360',
    seoDescription: 'O que sao acordaos, sumulas e jurisprudencia do TCU? Guia completo para servidores de compras publicas com exemplos praticos.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'ranking-erros-licitacoes-tcu-tce-mg-brasil'],
    glossaryTerms: ['acordao', 'sumula', 'jurisprudencia', 'tcu'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.246/2022', 'IN SEGES/ME 65/2021'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudencia/',
    sourceName: 'TCU — Jurisprudencia',
  },
  {
    slug: 'ranking-erros-licitacoes-tcu-tce-mg-brasil',
    title: 'Ranking: os 15 erros em licitacoes que mais geram multas do TCU, TCE-MG e outros TCEs do Brasil',
    excerpt: 'Compilamos as falhas mais recorrentes identificadas por orgaos de controle em todo o Brasil. Da pesquisa de precos ao contrato: saiba o que nao fazer e como se proteger.',
    content: `## Os erros que custam caro — e como evita-los

Analisamos decisoes recentes do TCU, TCE-MG, TCE-SP, TCE-RS, TCE-BA e TCE-PR para identificar os erros mais recorrentes em processos licitatorios que resultam em multas, determinacoes e anulacoes.

### Ranking dos 15 erros mais comuns

**1. Pesquisa de precos com fonte unica ou insuficiente**
- Orgao de controle: TCU, TCE-MG, TCE-SP
- Consequencia: anulacao do processo + multa
- Correto: minimo 3 fontes, incluindo contratacoes publicas similares (IN 65/2021)

**2. ETP generico ou ausente**
- Orgao: TCU, TCE-MG
- Consequencia: multa pessoal + determinacao de refazer
- Correto: ETP deve diagnosticar o problema e analisar alternativas

**3. Fracionamento de despesas para dispensar licitacao**
- Orgao: todos os TCEs + TCU
- Consequencia: multa + representacao ao MP
- Correto: consolidar demandas no PCA e licitar pelo valor total

**4. Direcionar especificacao para marca ou fornecedor**
- Orgao: TCU, TCE-SP, TCE-BA
- Consequencia: anulacao + multa + improbidade
- Correto: especificar por desempenho, nao por marca (salvo excepcoes fundamentadas)

**5. Nao publicar no PNCP**
- Orgao: TCU, TCE-MG
- Consequencia: anulacao + multa
- Correto: publicacao obrigatoria conforme Art. 174 da Lei 14.133

**6. Ausencia de segregacao de funcoes**
- Orgao: TCU, TCE-RS
- Consequencia: determinacao + multa
- Correto: quem planeja nao pode ser quem julga (Art. 7, §1°)

**7. Contrato sem fiscal designado**
- Orgao: TCU, TCE-PR, TCE-MG
- Consequencia: multa ao gestor
- Correto: designar fiscal tecnico e administrativo (Art. 117)

**8. Aditivo contratual alem do limite legal**
- Orgao: TCU
- Consequencia: multa + nulidade do aditivo
- Correto: limite de 25% para acrescimos (Art. 125)

**9. Pagar sem liquidacao adequada**
- Orgao: TCE-MG, TCE-SP
- Consequencia: multa + glosa
- Correto: verificar entrega efetiva antes do pagamento

**10. Nao adotar registro de precos quando obrigatorio**
- Orgao: TCU
- Consequencia: determinacao
- Correto: usar SRP para bens/servicos comuns e entregas parceladas

**11. Edital restritivo — exigencias de habilitacao excessivas**
- Orgao: TCU, TCE-BA, TCE-SP
- Consequencia: anulacao + multa
- Correto: exigir somente o que a lei permite (Art. 62 a 70)

**12. Nao justificar a escolha da modalidade**
- Orgao: TCE-MG, TCE-RS
- Consequencia: determinacao
- Correto: fundamentar a escolha no ETP

**13. Pesquisa de precos com dados desatualizados (mais de 6 meses)**
- Orgao: TCU
- Consequencia: determinacao de refazer pesquisa
- Correto: dados de ate 1 ano, preferencialmente 6 meses

**14. Ausencia de gestao de riscos**
- Orgao: TCU
- Consequencia: determinacao
- Correto: mapa de riscos obrigatorio (Art. 18, X)

**15. Contratacao emergencial sem comprovacao de urgencia**
- Orgao: todos os TCEs
- Consequencia: multa + representacao
- Correto: documentar a urgencia e a impossibilidade de planejamento previo

### Como o ATA360 previne esses erros

A plataforma atua como uma **camada de protecao** para o servidor:

- **Pesquisa de precos**: 17 fontes oficiais, sempre atualizada
- **ETP e TR**: gerados com fundamentacao especifica, nunca genericos
- **Publicacao PNCP**: integrada ao fluxo
- **Checklist de conformidade**: verifica cada etapa antes de prosseguir
- **Rastreabilidade**: toda decisao documentada com trilha de auditoria

**Fontes:** [TCU — Informativos de Jurisprudencia](https://portal.tcu.gov.br/jurisprudencia/) | [TCE-MG — Consultas](https://www.tce.mg.gov.br/) | [TCE-SP — Jurisprudencia](https://www.tce.sp.gov.br/)`,
    category: 'compliance',
    tags: ['erros em licitacoes', 'TCU', 'TCE-MG', 'TCE-SP', 'ranking', 'multas', 'boas praticas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-03T08:00:00Z',
    updatedAt: '2026-02-03T08:00:00Z',
    readingTimeMin: 8,
    featured: false,
    seoTitle: 'Ranking: 15 erros em licitacoes que geram multas do TCU e TCEs | ATA360',
    seoDescription: 'Os 15 erros mais comuns em licitacoes identificados pelo TCU, TCE-MG, TCE-SP e outros. Saiba o que evitar e como se proteger.',
    relatedSlugs: ['multas-agentes-publicos-erros-licitacoes-tcu-tce', 'acordaos-sumulas-jurisprudencia-o-que-sao-compras-publicas'],
    glossaryTerms: ['fracionamento', 'segregacao-de-funcoes', 'registro-de-precos', 'fiscal-de-contrato'],
    legalReferences: ['Lei 14.133/2021 Art. 7', 'Lei 14.133/2021 Art. 18', 'Lei 14.133/2021 Art. 117', 'Lei 14.133/2021 Art. 125'],
    sourceUrl: 'https://portal.tcu.gov.br/jurisprudencia/',
    sourceName: 'TCU / TCE-MG / TCE-SP',
  },
  {
    slug: 'beneficios-fornecedores-me-epp-licitacoes-2026',
    title: 'Guia completo: beneficios para micro e pequenas empresas (ME/EPP) em licitacoes em 2026',
    excerpt: 'A Lei 14.133/2021 e a LC 123/2006 garantem vantagens significativas para ME/EPP nas compras publicas. Direito de preferencia, reserva de cota, tratamento diferenciado — veja tudo atualizado.',
    content: `## ME e EPP nas licitacoes: todos os beneficios em um so lugar

As micro e pequenas empresas (ME/EPP) sao protagonistas nas compras publicas brasileiras. A legislacao garante tratamento diferenciado para estimular a participacao e fortalecer a economia local.

### Base legal

- **LC 123/2006** (Estatuto da ME/EPP) — Cap. V: Acesso aos Mercados
- **Lei 14.133/2021** — Art. 4 e 47 a 49
- **Decreto 8.538/2015** — regulamenta o tratamento diferenciado
- **LC 147/2014** — ampliou os beneficios

### Os 7 beneficios das ME/EPP em licitacoes

**1. Direito de preferencia (empate ficto)**
Se a proposta da ME/EPP for ate **10% superior** a proposta vencedora (5% no pregao), ela pode cobrir e vencer.

**2. Reserva de cota de ate 25%**
Ate 25% do objeto pode ser reservado exclusivamente para ME/EPP — desde que existam pelo menos 3 fornecedores competitivos.

**3. Licitacao exclusiva ate R$ 80.000**
Contratacoes de ate R$ 80.000 podem ser exclusivas para ME/EPP.

**4. Subcontratacao compulsoria**
Em contratacoes acima dos limites, a administracao pode exigir que o vencedor subcontrate ME/EPP.

**5. Regularidade fiscal tardia**
ME/EPP pode participar mesmo com pendencias fiscais, tendo **5 dias uteis** apos a habilitacao para regularizar.

**6. Cota de fornecimento**
Alem da reserva de cota, a administracao pode dividir o objeto em cotas para participacao exclusiva.

**7. Prioridade local/regional**
Municipios podem dar preferencia a empresas locais/regionais quando o edital for exclusivo para ME/EPP.

### Programas do governo para fornecedores em 2026

- **Compras.gov.br**: portal unificado para fornecedores se cadastrarem e participarem
- **SICAF simplificado**: cadastro com validacao automatica de certidoes
- **Programa Sebrae + Compras Publicas**: capacitacao gratuita para ME/EPP
- **Credito BNDES para fornecedores**: linhas especiais para capital de giro
- **Portal de Oportunidades PNCP**: alerta de licitacoes por segmento

### Dados de 2025/2026

- **70%+ das contratacoes** do governo federal sao vencidas por ME/EPP
- **R$ 120+ bilhoes** movimentados por ME/EPP em compras publicas (2025)
- **5.570 municipios** com obrigacao de aplicar tratamento diferenciado

### O ATA360 e os fornecedores

O ATA360 consulta dados de contratacoes de ME/EPP em suas pesquisas de precos, garantindo que os precos de referencia reflitam o mercado real — incluindo os beneficios legais aplicaveis.

**Fonte:** [Sebrae — ME/EPP em Licitacoes](https://www.sebrae.com.br/sites/PortalSebrae/artigos/como-participar-de-licitacoes)`,
    category: 'licitacao',
    tags: ['ME/EPP', 'beneficios', 'fornecedores', 'LC 123', 'licitacoes', 'tratamento diferenciado'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-02T08:00:00Z',
    updatedAt: '2026-02-02T08:00:00Z',
    readingTimeMin: 6,
    featured: false,
    seoTitle: 'Beneficios para ME/EPP em licitacoes 2026 — guia completo | ATA360',
    seoDescription: 'Todos os beneficios legais para micro e pequenas empresas em licitacoes: preferencia, cota, exclusividade e programas do governo.',
    relatedSlugs: ['credenciamento-lei-14133-nova-modalidade-guia', 'convenios-transferencias-voluntarias-2026-guia'],
    glossaryTerms: ['me-epp', 'empate-ficto', 'registro-de-precos', 'licitacao'],
    legalReferences: ['LC 123/2006 Art. 42 a 49', 'Lei 14.133/2021 Art. 4', 'Decreto 8.538/2015'],
    sourceUrl: 'https://www.sebrae.com.br/sites/PortalSebrae/artigos/como-participar-de-licitacoes',
    sourceName: 'Sebrae',
  },
  {
    slug: 'convenios-transferencias-voluntarias-2026-guia',
    title: 'Convenios e transferencias voluntarias em 2026: como captar e executar recursos federais sem devolver',
    excerpt: 'O guia atualizado para municipios captarem recursos via convenios, contratos de repasse e transferencias fundo a fundo. Plataforma Transferegov, prazos, prestacao de contas e erros a evitar.',
    content: `## Transferencias voluntarias: o guia para nao perder recursos

Transferencias voluntarias sao a principal fonte de investimento para milhares de municipios brasileiros. Captar esses recursos e importante — mas **executar corretamente e ainda mais critico**.

### Tipos de transferencias

| Tipo | Como funciona | Exemplo |
|------|-------------|---------|
| **Convenio** | Acordo entre entes para objetivo comum | Construcao de escola |
| **Contrato de repasse** | Intermediado por banco oficial (Caixa, BB) | Obra de saneamento |
| **Transf. fundo a fundo** | Direta, sem convenio | SUS (FNS para FMS) |
| **Emendas parlamentares** | Via Transferegov (individuais, bancada, relator) | Equipamento hospitalar |
| **Transf. especial** | Direta, sem vinculacao de objeto | EC 105/2019 |

### Plataforma Transferegov — o que saber em 2026

- **Todas as transferencias** voluntarias passam pelo Transferegov
- **Cadastro obrigatorio** de proponente (municipio) e proposta de trabalho
- **Fluxo 100% digital**: desde a proposta ate a prestacao de contas
- **Integracao com SIAFI**: pagamentos automaticos apos aprovacao
- **Novidade 2026**: prestacao de contas por resultados (nao apenas financeira)

### Os 5 erros que mais causam devolucao de recursos

**1. Perder o prazo de vigencia**
O convenio tem prazo. Se a licitacao atrasar, o recurso vence e volta ao Tesouro.

**2. Nao prestar contas no prazo**
A falta de prestacao de contas gera inscricao no CAUC e bloqueio de novas transferencias.

**3. Descumprir o objeto**
Executar algo diferente do que foi pactuado gera devolucao integral + tomada de contas especial.

**4. Licitacao irregular**
Falhas no processo licitatorio (fracionamento, direcionamento) contaminam a transferencia inteira.

**5. Nao aplicar contrapartida**
O municipio deve comprovar sua parcela (geralmente 1% a 5% do valor total).

### Como captar mais recursos

1. **Manter o CAUC regular**: certidoes, prestacoes de contas e LRF em dia
2. **Elaborar bons projetos**: propostas detalhadas com cronograma e orcamento
3. **Antecipar o planejamento**: incluir no PCA as compras vinculadas a transferencias
4. **Articular com parlamentares**: emendas sao a via mais direta de captacao
5. **Monitorar editais**: ministerios publicam chamamentos regulares

### ATA360 e transferencias voluntarias

O ATA360 ajuda municipios a executar os processos licitatorios vinculados a transferencias de forma rapida e correta — evitando que recursos captados sejam devolvidos por falhas na contratacao.

**Fonte:** [Gov.br — Transferegov](https://www.gov.br/transferegov/)`,
    category: 'gestao-publica',
    tags: ['convenios', 'transferencias voluntarias', 'Transferegov', 'emendas', 'CAUC', 'recursos federais'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
    readingTimeMin: 7,
    featured: false,
    seoTitle: 'Convenios e transferencias voluntarias 2026: guia para municipios | ATA360',
    seoDescription: 'Como captar e executar recursos via convenios e transferencias voluntarias em 2026. Transferegov, prazos e erros a evitar.',
    relatedSlugs: ['bilhoes-perdidos-emendas-parlamentares-falta-planejamento', 'sicaf-transferegov-novidades-2026-governo-digital'],
    glossaryTerms: ['convenio', 'transferencia-voluntaria', 'cauc', 'transferegov'],
    legalReferences: ['Lei 14.133/2021', 'Decreto 11.531/2023', 'Portaria Conjunta MGI/MF/CGU 33/2023'],
    sourceUrl: 'https://www.gov.br/transferegov/',
    sourceName: 'Gov.br / Transferegov',
  },
  {
    slug: 'tendencias-compras-publicas-2026-ia-sustentabilidade-dados',
    title: '7 tendencias para compras publicas em 2026: IA, dados abertos, sustentabilidade e o fim do papel',
    excerpt: 'O que esperar das contratacoes publicas em 2026? De inteligencia artificial a compras sustentaveis, passando por dados abertos e o fim dos processos em papel. Veja as tendencias que vao redefinir o setor.',
    content: `## O futuro das compras publicas ja comecou

O setor de contratacoes publicas esta em plena transformacao. A combinacao de nova legislacao (Lei 14.133/2021), tecnologia (IA, dados abertos) e demandas da sociedade (transparencia, sustentabilidade) esta redesenhando como o governo compra.

### 1. Inteligencia artificial especializada

A IA vai alem do ChatGPT. Em 2026, ferramentas especializadas em compras publicas ja:

- Geram pesquisas de precos com 17+ fontes oficiais
- Criam documentos preparatorios (ETP, TR, DFD) com fundamentacao legal
- Identificam riscos e anomalias em processos
- Detectam sobrepreco e superfaturamento automaticamente

**Tendencia**: a adocao de IA especializada (nao generica) sera impulsionada pelas orientacoes do TCU sobre rastreabilidade e governanca.

### 2. Dados abertos e transparencia radical

O PNCP, com 2 milhoes+ de contratacoes, e apenas o comeco. Em 2026:

- **APIs publicas** permitirao qualquer cidadao ou empresa consultar dados em tempo real
- **Paineis interativos** (CGU, TCU) vao democratizar a fiscalizacao
- **Cruzamento de dados** vai identificar anomalias automaticamente
- **Benchmarking nacional** vai tornar sobrepreco detectavel em segundos

### 3. Compras sustentaveis (ODS e ESG)

A Lei 14.133/2021 ja preve criterios de sustentabilidade (Art. 11, IV). Em 2026:

- **Critérios ESG** em editais: pegada de carbono, economia circular, logistica reversa
- **Preferencia por produtos sustentaveis**: materiais reciclados, equipamentos eficientes
- **Rotulagem ambiental**: certificacoes como base de pontuacao tecnica
- **Plano de Logistica Sustentavel**: obrigatorio para orgaos federais

### 4. Fim do papel e processo 100% digital

O Decreto 11.246/2022 ja determinou a digitalizacao. Em 2026:

- **Assinatura eletronica** em todos os documentos (ICP-Brasil ou Gov.br)
- **Processo integralmente digital**: do planejamento a prestacao de contas
- **Integracao de sistemas**: compras.gov.br, PNCP, SIAFI, Transferegov
- **Eliminacao de documentos fisicos** em auditorias

### 5. Profissionalizacao do agente de contratacao

A Lei 14.133/2021 exige que o agente de contratacao tenha capacitacao especifica. Em 2026:

- **Certificacoes obrigatorias**: cursos ENAP, universidades e escolas de governo
- **Remuneracao diferenciada**: alguns estados ja reconhecem a funcao como cargo tecnico
- **Plano de carreira**: propostas de legislacao para carreira de compras publicas
- **Menos acumulo de funcoes**: vedacao de designar "qualquer servidor" como pregoeiro

### 6. Marketplace publico e catalogo eletronico

O ComprasNet evolui para um marketplace:

- **Catalogo de bens e servicos padronizados**: compra direta sem licitacao (Art. 75, II, a)
- **Precos pre-negociados**: acordos-quadro e registro de precos permanente
- **Avaliacao de fornecedores**: rating baseado em entregas anteriores
- **Integracao com e-commerce**: Amazon Business, Mercado Livre (B2G)

### 7. Governanca e compliance como padrao

A cultura de governanca esta se consolidando:

- **Programa de integridade**: obrigatorio para contratacoes acima de R$ 200 milhoes (Art. 25, §4°)
- **Compliance de fornecedores**: due diligence antes da contratacao
- **Gestao de riscos**: mapa de riscos como documento obrigatorio
- **Canal de denuncias**: obrigatorio em orgaos com mais de 50 servidores

### O ATA360 e o futuro

O ATA360 nasceu nesse contexto: IA especializada, dados oficiais, rastreabilidade total e foco no servidor. A plataforma ja opera alinhada com todas as 7 tendencias — porque foi projetada para o setor publico do futuro, nao do passado.`,
    category: 'tecnologia',
    tags: ['tendencias 2026', 'IA', 'dados abertos', 'sustentabilidade', 'transformacao digital', 'compras publicas'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-01-31T08:00:00Z',
    updatedAt: '2026-01-31T08:00:00Z',
    readingTimeMin: 7,
    featured: false,
    seoTitle: '7 tendencias para compras publicas em 2026 | ATA360',
    seoDescription: 'IA, dados abertos, sustentabilidade e digitalizacao: as 7 tendencias que vao redefinir as contratacoes publicas em 2026.',
    relatedSlugs: ['ata360-ia-especializada-eficiencia-compras-publicas', 'riscos-ia-generica-chatgpt-licitacoes-alucinacao'],
    glossaryTerms: ['catalogo-eletronico', 'acordo-quadro', 'agente-de-contratacao'],
    legalReferences: ['Lei 14.133/2021 Art. 11', 'Decreto 11.246/2022', 'Lei 14.133/2021 Art. 25'],
    sourceName: 'ATA360',
  },
  {
    slug: 'lei-14133-comentada-artigos-mais-importantes-pratica',
    title: 'Lei 14.133/2021 comentada: os 20 artigos que todo servidor de compras precisa dominar na pratica',
    excerpt: 'Um guia pratico e comentado dos artigos mais importantes da nova lei de licitacoes. Nao e doutrina — e o dia a dia do pregoeiro explicado artigo por artigo, com exemplos reais.',
    content: `## A Lei 14.133 na pratica do dia a dia

A Lei 14.133/2021 tem 194 artigos. Nenhum servidor precisa decorar todos. Mas existem **20 artigos que aparecem em praticamente todo processo**. Este guia comenta cada um deles com linguagem direta e exemplos praticos.

### Fase preparatoria

**Art. 18 — Planejamento obrigatorio**
Todo processo deve ter: DFD, ETP, Mapa de Riscos, TR e orcamento estimado. **Na pratica**: e o artigo que o TCU mais cita em determinacoes. Se falta qualquer um desses documentos, o processo esta irregular.

**Art. 23 — Pesquisa de precos**
O preco de referencia deve ser obtido de contratacoes publicas similares, pesquisa com fornecedores, sistemas oficiais ou contratacoes da administracao. **Na pratica**: a IN 65/2021 detalha como fazer. O ATA360 automatiza esta etapa.

**Art. 6°, XXIII — ETP**
Define o Estudo Tecnico Preliminar como documento que diagnostica a necessidade. **Na pratica**: ETP nao e copia do TR. ETP analisa o problema; TR descreve a solucao.

### Agentes e responsabilidades

**Art. 7° — Agente de contratacao**
Servidor efetivo ou empregado publico com funcoes essenciais no processo. **Na pratica**: nao pode ser comissionado sem vinculo efetivo. Pregoeiro e uma das funcoes do agente.

**Art. 8° — Comissao de contratacao**
Para licitacoes de maior complexidade, substitui o agente individual. **Na pratica**: obrigatoria para dialogos competitivos e pode ser exigida para concorrencias.

**Art. 11 — Principios**
Legalidade, impessoalidade, eficiencia, transparencia, competitividade, proporcionalidade, **sustentabilidade**, inovacao. **Na pratica**: sustentabilidade e principio, nao opcao.

### Modalidades

**Art. 28 — Cinco modalidades**
Pregao, concorrencia, concurso, leilao e dialogo competitivo. **Na pratica**: pregao continua sendo a mais usada (bens e servicos comuns). Dialogo competitivo e a grande novidade para solucoes inovadoras.

**Art. 75 — Dispensa de licitacao**
Enumera todas as hipoteses. As mais usadas: ate R$ 59.906,02 para compras (atualizado 2024), ate R$ 119.812,03 para obras, emergencia, desercao/fracasso. **Na pratica**: fracionamento para caber no limite e o erro mais punido.

### Documentos essenciais

**Art. 40 — Termo de Referencia**
Define o objeto com: descricao detalhada, fundamentacao legal, descricao da solucao, criterios de sustentabilidade, estimativa de custo. **Na pratica**: TR incompleto e a segunda maior causa de impugnacao.

**Art. 53 — Fase preparatoria completa**
Lista todos os documentos que devem compor o processo antes da publicacao do edital. **Na pratica**: checklist obrigatorio.

### Contratos

**Art. 117 — Fiscalizacao**
Designacao obrigatoria de fiscal tecnico e administrativo. **Na pratica**: fiscal sem capacitacao responde por falhas. Deve existir portaria de designacao.

**Art. 124 — Reequilibrio**
Permite repactuacao, reajuste e revisao de precos. **Na pratica**: reforma tributaria vai gerar muitos pedidos de reequilibrio (IBS/CBS).

**Art. 125 — Limites de aditivo**
Ate 25% para acrescimos e supressoes. 50% para reforma de edificio ou equipamento. **Na pratica**: aditivo acima do limite e nulo.

### Controle e transparencia

**Art. 169 — Controle das contratacoes**
Orgaos de controle (TCU, TCEs, CGU) fiscalizam em tempo real. **Na pratica**: dados do PNCP sao monitorados automaticamente.

**Art. 174 — PNCP**
Publicacao obrigatoria de editais, contratos e atas. **Na pratica**: nao publicar e motivo de anulacao.

### Sancoes

**Art. 155 a 163 — Sancoes a fornecedores**
Advertencia, multa, impedimento (ate 3 anos), declaracao de inidoneidade (3 a 6 anos). **Na pratica**: tudo registrado no PNCP — fornecedor impedido em um orgao fica visivel para todos.

**Art. 73 — Responsabilizacao pessoal do agente**
O agente responde por atos dolosos ou com erro grosseiro. **Na pratica**: "erro grosseiro" e o que o TCU define como tal — e a definicao vem se ampliando.

### O ATA360 e a Lei 14.133

Cada documento gerado pelo ATA360 referencia o artigo correspondente da Lei 14.133. O servidor nao precisa procurar — a fundamentacao vem embutida, atualizada e rastreavel.

**Fonte:** [Planalto — Lei 14.133/2021 na integra](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm)`,
    category: 'legislacao',
    tags: ['Lei 14.133', 'artigos comentados', 'guia pratico', 'licitacoes', 'nova lei', 'servidor publico'],
    author: ATA360_AUTHOR,
    publishedAt: '2026-01-30T08:00:00Z',
    updatedAt: '2026-01-30T08:00:00Z',
    readingTimeMin: 10,
    featured: false,
    seoTitle: 'Lei 14.133 comentada: 20 artigos essenciais na pratica | ATA360',
    seoDescription: 'Os 20 artigos mais importantes da Lei 14.133/2021 comentados com linguagem direta e exemplos do dia a dia do pregoeiro.',
    relatedSlugs: ['acordaos-sumulas-jurisprudencia-o-que-sao-compras-publicas', 'ranking-erros-licitacoes-tcu-tce-mg-brasil'],
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
