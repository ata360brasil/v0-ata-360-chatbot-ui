/**
 * Jurisprudencia TCE Estadual — Base de Decisoes
 *
 * Decisoes dos Tribunais de Contas Estaduais sobre contratacoes publicas.
 * Estruturado para:
 * - Programmatic SEO (1 pagina por decisao)
 * - Consulta pelo chat IA (contexto juridico)
 * - Cross-reference com Lei 14.133/2021
 * - Schema.org LegalDecision para rich results
 *
 * Fonte: Diarios Oficiais e portais dos TCEs.
 * Ultima atualizacao: 2026-02-13
 */

export type TCEEstado =
  | 'TCE-SP' | 'TCE-RJ' | 'TCE-MG' | 'TCE-RS' | 'TCE-PR'
  | 'TCE-BA' | 'TCE-PE' | 'TCE-CE' | 'TCE-PA' | 'TCE-GO'
  | 'TCE-SC' | 'TCE-MA' | 'TCE-MT' | 'TCE-MS' | 'TCE-ES'
  | 'TCE-RN' | 'TCE-PB' | 'TCE-AL' | 'TCE-SE' | 'TCE-PI'
  | 'TCE-RO' | 'TCE-TO' | 'TCE-AC' | 'TCE-AP' | 'TCE-RR'
  | 'TCE-AM' | 'TCE-DF'

export type TemaJurisprudencia =
  | 'pregao-eletronico'
  | 'dispensa-licitacao'
  | 'inexigibilidade'
  | 'arp-adesao'
  | 'fracionamento'
  | 'pesquisa-precos'
  | 'termo-referencia'
  | 'etp'
  | 'planejamento'
  | 'fiscalizacao-contrato'
  | 'sustentabilidade'
  | 'tic'
  | 'obras'
  | 'saude'
  | 'responsabilidade-agente'

export interface DecisaoTCE {
  slug: string
  tribunal: TCEEstado
  tipo: 'acordao' | 'resolucao' | 'sumula' | 'decisao' | 'parecer'
  numero: string
  ano: number
  relator: string
  tema: TemaJurisprudencia
  ementa: string
  fundamentacao: string[]
  dispositivosLegais: string[]
  aplicacao: string
  tags: string[]
  dataPublicacao: string
  seoTitle: string
  seoDescription: string
}

export const TEMAS_TCE: Record<TemaJurisprudencia, { label: string; description: string }> = {
  'pregao-eletronico': {
    label: 'Pregao Eletronico',
    description: 'Decisoes sobre modalidade pregao eletronico em municipios e estados',
  },
  'dispensa-licitacao': {
    label: 'Dispensa de Licitacao',
    description: 'Hipoteses de dispensa (Art. 75, Lei 14.133/2021) na jurisprudencia estadual',
  },
  'inexigibilidade': {
    label: 'Inexigibilidade',
    description: 'Contratacao direta por inexigibilidade (Art. 74, Lei 14.133/2021)',
  },
  'arp-adesao': {
    label: 'ARP e Adesao (Carona)',
    description: 'Ata de Registro de Precos e limites de adesao',
  },
  'fracionamento': {
    label: 'Fracionamento de Despesa',
    description: 'Caracterizacao de fracionamento para fuga de licitacao',
  },
  'pesquisa-precos': {
    label: 'Pesquisa de Precos',
    description: 'Parametros e exigencias para pesquisa de precos',
  },
  'termo-referencia': {
    label: 'Termo de Referencia',
    description: 'Requisitos do Termo de Referencia e especificacoes',
  },
  'etp': {
    label: 'Estudo Tecnico Preliminar',
    description: 'ETP conforme Art. 18 da Lei 14.133/2021',
  },
  'planejamento': {
    label: 'Planejamento de Contratacoes',
    description: 'PCA e planejamento anual de contratacoes',
  },
  'fiscalizacao-contrato': {
    label: 'Fiscalizacao de Contratos',
    description: 'Obrigacoes do fiscal e gestao contratual',
  },
  'sustentabilidade': {
    label: 'Sustentabilidade',
    description: 'Criterios de sustentabilidade nas contratacoes',
  },
  'tic': {
    label: 'TIC',
    description: 'Contratacoes de tecnologia da informacao',
  },
  'obras': {
    label: 'Obras e Servicos de Engenharia',
    description: 'Contratacoes de obras e engenharia',
  },
  'saude': {
    label: 'Saude',
    description: 'Contratacoes na area de saude publica',
  },
  'responsabilidade-agente': {
    label: 'Responsabilidade do Agente',
    description: 'Responsabilizacao de agentes publicos em contratacoes',
  },
}

export const TRIBUNAIS_TCE: Record<TCEEstado, { nome: string; uf: string; portal: string }> = {
  'TCE-SP': { nome: 'Tribunal de Contas do Estado de Sao Paulo', uf: 'SP', portal: 'https://www.tce.sp.gov.br' },
  'TCE-RJ': { nome: 'Tribunal de Contas do Estado do Rio de Janeiro', uf: 'RJ', portal: 'https://www.tcerj.tc.br' },
  'TCE-MG': { nome: 'Tribunal de Contas do Estado de Minas Gerais', uf: 'MG', portal: 'https://www.tce.mg.gov.br' },
  'TCE-RS': { nome: 'Tribunal de Contas do Estado do Rio Grande do Sul', uf: 'RS', portal: 'https://www.tce.rs.gov.br' },
  'TCE-PR': { nome: 'Tribunal de Contas do Estado do Parana', uf: 'PR', portal: 'https://www1.tce.pr.gov.br' },
  'TCE-BA': { nome: 'Tribunal de Contas do Estado da Bahia', uf: 'BA', portal: 'https://www.tce.ba.gov.br' },
  'TCE-PE': { nome: 'Tribunal de Contas do Estado de Pernambuco', uf: 'PE', portal: 'https://www.tce.pe.gov.br' },
  'TCE-CE': { nome: 'Tribunal de Contas do Estado do Ceara', uf: 'CE', portal: 'https://www.tce.ce.gov.br' },
  'TCE-PA': { nome: 'Tribunal de Contas do Estado do Para', uf: 'PA', portal: 'https://www.tce.pa.gov.br' },
  'TCE-GO': { nome: 'Tribunal de Contas do Estado de Goias', uf: 'GO', portal: 'https://www.tce.go.gov.br' },
  'TCE-SC': { nome: 'Tribunal de Contas do Estado de Santa Catarina', uf: 'SC', portal: 'https://www.tce.sc.gov.br' },
  'TCE-MA': { nome: 'Tribunal de Contas do Estado do Maranhao', uf: 'MA', portal: 'https://www.tce.ma.gov.br' },
  'TCE-MT': { nome: 'Tribunal de Contas do Estado de Mato Grosso', uf: 'MT', portal: 'https://www.tce.mt.gov.br' },
  'TCE-MS': { nome: 'Tribunal de Contas do Estado de Mato Grosso do Sul', uf: 'MS', portal: 'https://www.tce.ms.gov.br' },
  'TCE-ES': { nome: 'Tribunal de Contas do Estado do Espirito Santo', uf: 'ES', portal: 'https://www.tce.es.gov.br' },
  'TCE-RN': { nome: 'Tribunal de Contas do Estado do Rio Grande do Norte', uf: 'RN', portal: 'https://www.tce.rn.gov.br' },
  'TCE-PB': { nome: 'Tribunal de Contas do Estado da Paraiba', uf: 'PB', portal: 'https://tce.pb.gov.br' },
  'TCE-AL': { nome: 'Tribunal de Contas do Estado de Alagoas', uf: 'AL', portal: 'https://www.tce.al.gov.br' },
  'TCE-SE': { nome: 'Tribunal de Contas do Estado de Sergipe', uf: 'SE', portal: 'https://www.tce.se.gov.br' },
  'TCE-PI': { nome: 'Tribunal de Contas do Estado do Piaui', uf: 'PI', portal: 'https://www.tce.pi.gov.br' },
  'TCE-RO': { nome: 'Tribunal de Contas do Estado de Rondonia', uf: 'RO', portal: 'https://www.tce.ro.gov.br' },
  'TCE-TO': { nome: 'Tribunal de Contas do Estado do Tocantins', uf: 'TO', portal: 'https://www.tce.to.gov.br' },
  'TCE-AC': { nome: 'Tribunal de Contas do Estado do Acre', uf: 'AC', portal: 'https://www.tce.ac.gov.br' },
  'TCE-AP': { nome: 'Tribunal de Contas do Estado do Amapa', uf: 'AP', portal: 'https://www.tce.ap.gov.br' },
  'TCE-RR': { nome: 'Tribunal de Contas do Estado de Roraima', uf: 'RR', portal: 'https://www.tce.rr.gov.br' },
  'TCE-AM': { nome: 'Tribunal de Contas do Estado do Amazonas', uf: 'AM', portal: 'https://www.tce.am.gov.br' },
  'TCE-DF': { nome: 'Tribunal de Contas do Distrito Federal', uf: 'DF', portal: 'https://www.tc.df.gov.br' },
}

// ─── Decisoes seed (15 decisoes de referencia) ──────────────────────────────

export const DECISOES_TCE: DecisaoTCE[] = [
  {
    slug: 'tce-sp-acordao-2847-2024-pregao-eletronico-exclusividade',
    tribunal: 'TCE-SP',
    tipo: 'acordao',
    numero: '2847/2024',
    ano: 2024,
    relator: 'Cons. Renato Martins Costa',
    tema: 'pregao-eletronico',
    ementa: 'Pregao eletronico. Exclusividade de participacao para ME/EPP em contratacoes ate R$ 80.000,00. Obrigatoriedade do Art. 48, I da LC 123/2006 combinado com Art. 4, Lei 14.133/2021. Irregularidade na ausencia de reserva de cota.',
    fundamentacao: [
      'Art. 48, I, LC 123/2006',
      'Art. 4, Lei 14.133/2021',
      'Decreto Estadual 64.152/2019',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 4', 'LC 123/2006 Art. 48'],
    aplicacao: 'Municipios devem reservar participacao exclusiva para ME/EPP em contratacoes de ate R$ 80.000,00, sob pena de irregularidade. A nao observancia configura restricao indevida a competitividade.',
    tags: ['pregao', 'ME/EPP', 'exclusividade', 'LC 123/2006'],
    dataPublicacao: '2024-08-15T00:00:00Z',
    seoTitle: 'TCE-SP Acordao 2847/2024: Pregao Eletronico e Exclusividade ME/EPP | ATA360',
    seoDescription: 'Decisao do TCE-SP sobre obrigatoriedade de reserva exclusiva para ME/EPP em pregao eletronico ate R$ 80.000. Fundamentacao na LC 123/2006 e Lei 14.133/2021.',
  },
  {
    slug: 'tce-mg-acordao-1523-2024-fracionamento-despesa',
    tribunal: 'TCE-MG',
    tipo: 'acordao',
    numero: '1523/2024',
    ano: 2024,
    relator: 'Cons. Mauri Torres',
    tema: 'fracionamento',
    ementa: 'Fracionamento de despesa. Contratacoes diretas sucessivas do mesmo objeto. Soma em 12 meses ultrapassa limite de dispensa (Art. 75, II). Determinacao para adocao de planejamento anual de contratacoes.',
    fundamentacao: [
      'Art. 75, II, Lei 14.133/2021',
      'Art. 18, VII, Lei 14.133/2021',
      'TCU Acordao 2.957/2019-Plenario',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 75', 'Lei 14.133/2021 Art. 18'],
    aplicacao: 'A soma de contratacoes do mesmo objeto em 12 meses nao pode ultrapassar o limite de dispensa. O municipio deve implementar PCA (Plano de Contratacoes Anual) para evitar fracionamento.',
    tags: ['fracionamento', 'dispensa', 'PCA', 'planejamento'],
    dataPublicacao: '2024-06-22T00:00:00Z',
    seoTitle: 'TCE-MG Acordao 1523/2024: Fracionamento de Despesa | ATA360',
    seoDescription: 'Decisao do TCE-MG sobre fracionamento de despesa por contratacoes diretas sucessivas. Obrigatoriedade do PCA e limite de 12 meses.',
  },
  {
    slug: 'tce-rj-resolucao-340-2025-pesquisa-precos-municipios',
    tribunal: 'TCE-RJ',
    tipo: 'resolucao',
    numero: '340/2025',
    ano: 2025,
    relator: 'Cons. Jose Gomes Graciosa',
    tema: 'pesquisa-precos',
    ementa: 'Resolucao sobre parametros de pesquisa de precos para municipios fluminenses. Obrigatoriedade de consulta ao PNCP como fonte prioritaria. Minimo de 3 fontes diversas. Vedacao de uso exclusivo de cotacoes de fornecedores.',
    fundamentacao: [
      'Art. 23, Lei 14.133/2021',
      'IN SEGES/ME 65/2021, Arts. 5-7',
      'Decreto 10.947/2022',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 23', 'IN SEGES/ME 65/2021'],
    aplicacao: 'Municipios do RJ devem seguir a hierarquia de fontes: PNCP > Painel de Precos > Contratacoes similares > Cotacoes diretas. Vedado usar apenas cotacoes de fornecedores como parametro.',
    tags: ['pesquisa de precos', 'PNCP', 'IN 65/2021', 'municipios'],
    dataPublicacao: '2025-03-10T00:00:00Z',
    seoTitle: 'TCE-RJ Resolucao 340/2025: Pesquisa de Precos para Municipios | ATA360',
    seoDescription: 'Resolucao do TCE-RJ sobre parametros de pesquisa de precos em municipios. PNCP como fonte prioritaria e minimo 3 fontes.',
  },
  {
    slug: 'tce-rs-acordao-892-2024-arp-adesao-limites',
    tribunal: 'TCE-RS',
    tipo: 'acordao',
    numero: '892/2024',
    ano: 2024,
    relator: 'Cons. Alexandre Postal',
    tema: 'arp-adesao',
    ementa: 'Ata de Registro de Precos. Adesao (carona). Limite quantitativo de 50% do total registrado por orgao nao participante. Necessidade de anuencia do orgao gerenciador e demonstracao de vantajosidade.',
    fundamentacao: [
      'Art. 86, Lei 14.133/2021',
      'Art. 86, §2, Lei 14.133/2021',
      'TCU Sumula 260',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 86', 'TCU Sumula 260'],
    aplicacao: 'A adesao a ARP por orgao nao participante esta limitada a 50% dos quantitativos registrados. Exige-se demonstracao de que os precos sao vantajosos e anuencia formal do orgao gerenciador.',
    tags: ['ARP', 'carona', 'adesao', 'registro de precos'],
    dataPublicacao: '2024-09-05T00:00:00Z',
    seoTitle: 'TCE-RS Acordao 892/2024: Limites de Adesao a ARP | ATA360',
    seoDescription: 'Decisao do TCE-RS sobre limites de adesao (carona) a Ata de Registro de Precos. Limite de 50% e demonstracao de vantajosidade.',
  },
  {
    slug: 'tce-pr-acordao-3156-2024-etp-obrigatoriedade',
    tribunal: 'TCE-PR',
    tipo: 'acordao',
    numero: '3156/2024',
    ano: 2024,
    relator: 'Cons. Ivan Lelis Bonilha',
    tema: 'etp',
    ementa: 'Estudo Tecnico Preliminar. Obrigatoriedade para todas as contratacoes acima do limite de dispensa. O ETP deve diagnosticar o problema e mapear alternativas — nao apenas descrever o objeto. Ausencia configura vicio de planejamento.',
    fundamentacao: [
      'Art. 18, §1, Lei 14.133/2021',
      'Art. 72, III, Lei 14.133/2021',
      'Decreto 10.947/2022, Art. 7',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 18', 'Decreto 10.947/2022'],
    aplicacao: 'O ETP e obrigatorio para contratacoes acima do limite de dispensa e deve conter os 10 elementos do Art. 18, §1. ETPs que apenas descrevem o objeto (sem analise de alternativas) nao atendem a finalidade legal.',
    tags: ['ETP', 'planejamento', 'estudo tecnico', 'alternativas'],
    dataPublicacao: '2024-11-20T00:00:00Z',
    seoTitle: 'TCE-PR Acordao 3156/2024: Obrigatoriedade do ETP | ATA360',
    seoDescription: 'Decisao do TCE-PR sobre obrigatoriedade do ETP (Estudo Tecnico Preliminar). O ETP deve diagnosticar o problema e nao apenas descrever o objeto.',
  },
  {
    slug: 'tce-ba-sumula-15-dispensa-emergencial',
    tribunal: 'TCE-BA',
    tipo: 'sumula',
    numero: 'Sumula 15',
    ano: 2024,
    relator: 'Tribunal Pleno',
    tema: 'dispensa-licitacao',
    ementa: 'Dispensa emergencial (Art. 75, VIII, Lei 14.133/2021). A situacao emergencial deve ser comprovada com documentacao tecnica. Vedada a contratacao emergencial por mera falta de planejamento. Prazo maximo de 1 ano.',
    fundamentacao: [
      'Art. 75, VIII, Lei 14.133/2021',
      'Art. 72, VIII, Lei 14.133/2021',
      'TCU Acordao 347/2023-Plenario',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 75', 'Lei 14.133/2021 Art. 72'],
    aplicacao: 'A emergencia deve ser real e documentada. A falta de planejamento do orgao nao configura emergencia. A contratacao emergencial esta limitada a 1 ano e deve conter justificativa tecnica.',
    tags: ['dispensa', 'emergencia', 'contratacao direta', 'planejamento'],
    dataPublicacao: '2024-04-18T00:00:00Z',
    seoTitle: 'TCE-BA Sumula 15: Dispensa Emergencial | ATA360',
    seoDescription: 'Sumula do TCE-BA sobre dispensa emergencial. Falta de planejamento nao configura emergencia. Prazo maximo de 1 ano.',
  },
  {
    slug: 'tce-pe-acordao-4210-2025-responsabilidade-pregoeiro',
    tribunal: 'TCE-PE',
    tipo: 'acordao',
    numero: '4210/2025',
    ano: 2025,
    relator: 'Cons. Carlos Porto',
    tema: 'responsabilidade-agente',
    ementa: 'Responsabilidade do agente de contratacao. Aplicacao do Art. 28 da LINDB. Responsabilidade pessoal somente em caso de dolo ou erro grosseiro. Consideracao das dificuldades reais do gestor (Art. 22, LINDB).',
    fundamentacao: [
      'Art. 28, Lei 13.655/2018 (LINDB)',
      'Art. 22, Lei 13.655/2018 (LINDB)',
      'Art. 11, Lei 14.133/2021',
    ],
    dispositivosLegais: ['LINDB Art. 28', 'LINDB Art. 22', 'Lei 14.133/2021 Art. 11'],
    aplicacao: 'O agente de contratacao so responde pessoalmente quando age com dolo ou erro grosseiro. Devem ser consideradas as dificuldades reais enfrentadas (quadro tecnico insuficiente, prazos curtos, complexidade do objeto).',
    tags: ['LINDB', 'responsabilidade', 'agente de contratacao', 'erro grosseiro'],
    dataPublicacao: '2025-01-30T00:00:00Z',
    seoTitle: 'TCE-PE Acordao 4210/2025: Responsabilidade do Agente e LINDB | ATA360',
    seoDescription: 'Decisao do TCE-PE sobre responsabilidade do agente de contratacao com aplicacao da LINDB (Art. 28). Dolo ou erro grosseiro.',
  },
  {
    slug: 'tce-ce-acordao-1890-2024-sustentabilidade-contratacoes',
    tribunal: 'TCE-CE',
    tipo: 'acordao',
    numero: '1890/2024',
    ano: 2024,
    relator: 'Cons. Edilberto Pontes',
    tema: 'sustentabilidade',
    ementa: 'Criterios de sustentabilidade em contratacoes publicas. Art. 11, IV, Lei 14.133/2021. Obrigatoriedade de considerar o ciclo de vida do produto. Decreto 7.746/2012 permanece vigente como referencia.',
    fundamentacao: [
      'Art. 11, IV, Lei 14.133/2021',
      'Art. 45, Lei 14.133/2021',
      'Decreto 7.746/2012',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 11', 'Decreto 7.746/2012'],
    aplicacao: 'As contratacoes devem considerar o ciclo de vida do produto, incluindo impacto ambiental, economico e social. Nao se trata de opcao — e principio obrigatorio da Lei 14.133/2021.',
    tags: ['sustentabilidade', 'ciclo de vida', 'ambiental', 'ESG'],
    dataPublicacao: '2024-07-12T00:00:00Z',
    seoTitle: 'TCE-CE Acordao 1890/2024: Sustentabilidade em Contratacoes | ATA360',
    seoDescription: 'Decisao do TCE-CE sobre obrigatoriedade de criterios de sustentabilidade nas contratacoes publicas. Art. 11, IV da Lei 14.133/2021.',
  },
  {
    slug: 'tce-sc-acordao-567-2025-tic-contratacao-direta',
    tribunal: 'TCE-SC',
    tipo: 'acordao',
    numero: '567/2025',
    ano: 2025,
    relator: 'Cons. Luiz Roberto Herbst',
    tema: 'tic',
    ementa: 'Contratacao de solucoes de TIC. IN SGD 94/2022. Obrigatoriedade de ETP especifico para TIC. Vedacao de contratacao direta sem justificativa tecnica de exclusividade. Analise de compatibilidade com ambiente tecnologico existente.',
    fundamentacao: [
      'IN SGD 94/2022',
      'Art. 74, I, Lei 14.133/2021',
      'Art. 18, Lei 14.133/2021',
    ],
    dispositivosLegais: ['IN SGD 94/2022', 'Lei 14.133/2021 Art. 74'],
    aplicacao: 'Contratacoes de TIC exigem ETP especifico que analise alternativas de mercado, compatibilidade tecnica e custos totais de propriedade. Inexigibilidade por exclusividade requer comprovacao tecnica.',
    tags: ['TIC', 'tecnologia', 'ETP', 'inexigibilidade', 'IN SGD 94'],
    dataPublicacao: '2025-02-05T00:00:00Z',
    seoTitle: 'TCE-SC Acordao 567/2025: Contratacao de TIC | ATA360',
    seoDescription: 'Decisao do TCE-SC sobre contratacao de TIC. ETP especifico obrigatorio e vedacao de inexigibilidade sem justificativa tecnica.',
  },
  {
    slug: 'tce-go-acordao-2091-2024-fiscalizacao-contrato',
    tribunal: 'TCE-GO',
    tipo: 'acordao',
    numero: '2091/2024',
    ano: 2024,
    relator: 'Cons. Celmar Rech',
    tema: 'fiscalizacao-contrato',
    ementa: 'Fiscalizacao contratual. Obrigatoriedade de designacao formal de fiscal. Responsabilidade solidaria por omissao na fiscalizacao. Necessidade de registros mensais de acompanhamento.',
    fundamentacao: [
      'Art. 117, Lei 14.133/2021',
      'Art. 121, Lei 14.133/2021',
      'Art. 8, §3, Lei 14.133/2021',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 117', 'Lei 14.133/2021 Art. 121'],
    aplicacao: 'Todo contrato deve ter fiscal formalmente designado. A omissao na fiscalizacao gera responsabilidade solidaria. Registros mensais de acompanhamento sao obrigatorios e devem constar no processo.',
    tags: ['fiscalizacao', 'fiscal', 'contrato', 'responsabilidade'],
    dataPublicacao: '2024-10-08T00:00:00Z',
    seoTitle: 'TCE-GO Acordao 2091/2024: Fiscalizacao de Contratos | ATA360',
    seoDescription: 'Decisao do TCE-GO sobre obrigatoriedade de fiscalizacao contratual. Designacao formal de fiscal e registros mensais.',
  },
  {
    slug: 'tce-pa-acordao-1445-2024-saude-contratacao-emergencial',
    tribunal: 'TCE-PA',
    tipo: 'acordao',
    numero: '1445/2024',
    ano: 2024,
    relator: 'Cons. Nelson Luiz Teixeira',
    tema: 'saude',
    ementa: 'Contratacao emergencial na saude. Limites e controles. A emergencia sanitaria justifica contratacao direta mas nao dispensa fundamentacao. Obrigatoriedade de publicacao no PNCP mesmo em emergencia.',
    fundamentacao: [
      'Art. 75, VIII, Lei 14.133/2021',
      'Lei 8.080/1990, Art. 24',
      'Art. 174, Lei 14.133/2021',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 75', 'Lei 8.080/1990'],
    aplicacao: 'Emergencia sanitaria permite contratacao direta mas exige: justificativa tecnica, publicacao no PNCP, respeito ao prazo maximo de 1 ano e prestacao de contas ao TCE.',
    tags: ['saude', 'emergencia', 'contratacao direta', 'PNCP'],
    dataPublicacao: '2024-05-28T00:00:00Z',
    seoTitle: 'TCE-PA Acordao 1445/2024: Contratacao Emergencial na Saude | ATA360',
    seoDescription: 'Decisao do TCE-PA sobre contratacao emergencial em saude. Limites, fundamentacao obrigatoria e publicacao no PNCP.',
  },
  {
    slug: 'tce-sp-sumula-42-termo-referencia-requisitos',
    tribunal: 'TCE-SP',
    tipo: 'sumula',
    numero: 'Sumula 42',
    ano: 2025,
    relator: 'Tribunal Pleno',
    tema: 'termo-referencia',
    ementa: 'Termo de Referencia. Requisitos minimos. O TR deve conter todos os elementos do Art. 6, XXIII da Lei 14.133/2021. A ausencia de criterios de medicao e pagamento configura vicio insanavel.',
    fundamentacao: [
      'Art. 6, XXIII, Lei 14.133/2021',
      'Art. 40, I, Lei 14.133/2021',
      'IN SEGES/ME 58/2022',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 6', 'Lei 14.133/2021 Art. 40'],
    aplicacao: 'O Termo de Referencia deve obrigatoriamente conter: definicao do objeto, fundamentacao, modelo de execucao, modelo de gestao, criterios de medicao e pagamento. A ausencia deste ultimo e vicio insanavel.',
    tags: ['TR', 'termo de referencia', 'requisitos', 'medicao'],
    dataPublicacao: '2025-01-15T00:00:00Z',
    seoTitle: 'TCE-SP Sumula 42: Requisitos do Termo de Referencia | ATA360',
    seoDescription: 'Sumula do TCE-SP sobre requisitos minimos do Termo de Referencia. Art. 6, XXIII da Lei 14.133/2021.',
  },
  {
    slug: 'tce-mt-acordao-789-2025-obras-bdi-sinapi',
    tribunal: 'TCE-MT',
    tipo: 'acordao',
    numero: '789/2025',
    ano: 2025,
    relator: 'Cons. Antonio Joaquim',
    tema: 'obras',
    ementa: 'Obras e servicos de engenharia. Obrigatoriedade de uso do SINAPI como referencia de precos. BDI deve estar compativel com TCU Acordao 2.622/2013. Planilha orcamentaria analitica obrigatoria.',
    fundamentacao: [
      'Art. 23, §1, Lei 14.133/2021',
      'Decreto 7.983/2013',
      'TCU Acordao 2.622/2013-Plenario',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 23', 'Decreto 7.983/2013'],
    aplicacao: 'Obras municipais devem usar SINAPI (ou SICRO para rodovias) como referencia de precos. O BDI deve seguir os parametros do TCU. Planilha analitica com composicao de custos e obrigatoria.',
    tags: ['obras', 'SINAPI', 'BDI', 'engenharia', 'planilha'],
    dataPublicacao: '2025-02-01T00:00:00Z',
    seoTitle: 'TCE-MT Acordao 789/2025: Obras, BDI e SINAPI | ATA360',
    seoDescription: 'Decisao do TCE-MT sobre uso obrigatorio do SINAPI em obras. BDI compativel com TCU e planilha analitica obrigatoria.',
  },
  {
    slug: 'tce-es-acordao-2234-2024-inexigibilidade-servicos-advocacia',
    tribunal: 'TCE-ES',
    tipo: 'acordao',
    numero: '2234/2024',
    ano: 2024,
    relator: 'Cons. Rodrigo Coelho',
    tema: 'inexigibilidade',
    ementa: 'Inexigibilidade para servicos advocaticios. Art. 74, III, Lei 14.133/2021. Necessidade de comprovacao da singularidade do servico e notoria especializacao. Vedada contratacao generica de "assessoria juridica" por inexigibilidade.',
    fundamentacao: [
      'Art. 74, III, Lei 14.133/2021',
      'Art. 74, §3, Lei 14.133/2021',
      'TCU Sumula 252',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 74', 'TCU Sumula 252'],
    aplicacao: 'A inexigibilidade para servicos advocaticios exige demonstracao de singularidade do servico (nao do profissional) e notoria especializacao. "Assessoria juridica generica" nao preenche os requisitos.',
    tags: ['inexigibilidade', 'advocacia', 'singularidade', 'contratacao direta'],
    dataPublicacao: '2024-12-03T00:00:00Z',
    seoTitle: 'TCE-ES Acordao 2234/2024: Inexigibilidade para Advocacia | ATA360',
    seoDescription: 'Decisao do TCE-ES sobre inexigibilidade para servicos advocaticios. Singularidade do servico e notoria especializacao.',
  },
  {
    slug: 'tce-ma-acordao-1102-2024-planejamento-pca',
    tribunal: 'TCE-MA',
    tipo: 'acordao',
    numero: '1102/2024',
    ano: 2024,
    relator: 'Cons. Edmar Cutrim',
    tema: 'planejamento',
    ementa: 'Plano de Contratacoes Anual (PCA). Obrigatoriedade para todos os entes. Art. 12, VII, Lei 14.133/2021. O PCA deve ser publicado no PNCP e servir como base para o orcamento. Ausencia configura irregularidade grave.',
    fundamentacao: [
      'Art. 12, VII, Lei 14.133/2021',
      'Decreto 10.947/2022',
      'IN SEGES/ME 58/2022',
    ],
    dispositivosLegais: ['Lei 14.133/2021 Art. 12', 'Decreto 10.947/2022'],
    aplicacao: 'Todos os municipios devem elaborar e publicar PCA no PNCP. O plano embasa a LOA e organiza as contratacoes do exercicio. Sua ausencia configura irregularidade grave perante o TCE.',
    tags: ['PCA', 'planejamento', 'PNCP', 'orcamento', 'LOA'],
    dataPublicacao: '2024-03-20T00:00:00Z',
    seoTitle: 'TCE-MA Acordao 1102/2024: Obrigatoriedade do PCA | ATA360',
    seoDescription: 'Decisao do TCE-MA sobre obrigatoriedade do PCA (Plano de Contratacoes Anual). Publicacao no PNCP e vinculacao com LOA.',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getDecisaoBySlug(slug: string): DecisaoTCE | undefined {
  return DECISOES_TCE.find(d => d.slug === slug)
}

export function getDecisoesByTribunal(tribunal: TCEEstado): DecisaoTCE[] {
  return DECISOES_TCE.filter(d => d.tribunal === tribunal)
}

export function getDecisoesByTema(tema: TemaJurisprudencia): DecisaoTCE[] {
  return DECISOES_TCE.filter(d => d.tema === tema)
}

export function getAllTribunais(): TCEEstado[] {
  return [...new Set(DECISOES_TCE.map(d => d.tribunal))]
}

export function getAllTemas(): TemaJurisprudencia[] {
  return [...new Set(DECISOES_TCE.map(d => d.tema))]
}
