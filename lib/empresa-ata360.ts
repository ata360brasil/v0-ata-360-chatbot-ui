/**
 * ATA360 — Dados Cadastrais e Identidade da Empresa
 *
 * Fonte: Junta Comercial de Minas Gerais (JUCEMG)
 * CNPJ consultado: 61.291.296/0001-31
 *
 * IMPORTANTE — Regra de Gênero:
 *   "o ATA360" (masculino) → refere-se ao SISTEMA/IA
 *   "a ATA360" (feminino) → refere-se à EMPRESA
 *
 * @see Lei 9.279/1996 — Propriedade Industrial
 * @see Lei 9.609/1998 — Software
 * @see LGPD (Lei 13.709/2018) — Proteção de Dados
 * @see LC 182/2021 — Marco Legal das Startups
 */

// ─── Dados Cadastrais ────────────────────────────────────────────────────────

export const EMPRESA_ATA360 = {
  // Identificação
  razao_social: 'ATA360 TECNOLOGIA LTDA',
  nome_fantasia: 'ATA360',
  cnpj: '61.291.296/0001-31',
  inscricao_estadual: 'ISENTA',

  // Natureza Jurídica
  natureza_juridica: {
    codigo: '234-8',
    descricao: 'Empresa Simples de Inovação (Inova Simples)',
    lei_base: 'LC 182/2021 (Marco Legal das Startups)',
  },

  // Endereço
  endereco: {
    logradouro: 'Rua Acácia',
    numero: '55',
    complemento: 'Sala 1',
    bairro: 'Jardim Canadá',
    municipio: 'Vespasiano',
    uf: 'MG',
    cep: '33200-000',
    codigo_ibge: '3171006',
    regiao_metropolitana: 'Belo Horizonte',
  },

  // Capital Social
  capital_social: {
    valor: 100_000.00,
    moeda: 'BRL',
    integralizado: true,
    data_registro: '2024-11-15',
  },

  // Quadro Societário (QSA)
  socios: [
    {
      nome: 'RENATO AZEVEDO DE OLIVEIRA',
      cpf_masked: '***.***.***-**',
      qualificacao: {
        codigo: '49',
        descricao: 'Sócio-Administrador',
      },
      participacao_percentual: 90,
      data_entrada: '2024-11-15',
    },
    {
      nome: 'ROBERTO DE OLIVEIRA FONSECA',
      cpf_masked: '***.***.***-**',
      qualificacao: {
        codigo: '22',
        descricao: 'Sócio',
      },
      participacao_percentual: 10,
      data_entrada: '2024-11-15',
      cargo_funcional: 'CEO',
    },
  ],

  // Atividades
  cnae_principal: {
    codigo: '6202-3/00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
  },
  cnaes_secundarios: [
    { codigo: '6311-9/00', descricao: 'Tratamento de dados, provedores de serviços de aplicação e hospedagem na internet' },
    { codigo: '6319-4/00', descricao: 'Portais, provedores de conteúdo e outros serviços de informação na internet' },
    { codigo: '7490-1/04', descricao: 'Atividades de intermediação e agenciamento de serviços e negócios em geral' },
  ],

  // Dados operacionais
  data_abertura: '2024-11-15',
  situacao_cadastral: 'ATIVA',
  porte: 'ME', // Microempresa
  optante_simples: true,
  optante_mei: false,

  // CATSER para contratação pública
  catser: {
    principal: '27502', // Desenvolvimento de software
    alternativo: '26123', // Processamento de dados
    descricao_servico: 'Licenciamento de software SaaS para inteligência em contratações públicas',
  },
} as const

// ─── Identidade Visual e Terminologia ────────────────────────────────────────

export const IDENTIDADE_ATA360 = {
  /**
   * Regra de gênero obrigatória em TODOS os textos do sistema:
   *   "o ATA360" = o sistema, a plataforma, a inteligência artificial
   *   "a ATA360" = a empresa, a pessoa jurídica, a sociedade
   */
  genero: {
    sistema: { artigo: 'o', exemplo: 'o ATA360 identificou 3 irregularidades' },
    empresa: { artigo: 'a', exemplo: 'a ATA360 é uma empresa de tecnologia' },
  },

  // Cores (OKLCH — Tailwind 4)
  cores: {
    primaria: 'oklch(0.65 0.24 264)',     // Azul profundo
    secundaria: 'oklch(0.72 0.18 152)',    // Verde institucional
    accent: 'oklch(0.75 0.15 85)',         // Dourado selo
    background: 'oklch(0.98 0.01 264)',    // Fundo claro
    foreground: 'oklch(0.15 0.02 264)',    // Texto escuro
  },

  // Selo de Qualidade
  selo: {
    nome: 'Certificado de Qualidade ATA360 — Governança Ouro',
    descricao: 'Certifica conformidade Lei 14.133/2021, boa-fé, dados oficiais, validação AUDITOR',
    arquivo: 'selo-ata360-governanca-ouro.png',
    resolucao: '300 DPI',
    formato: 'PNG alpha (fundo transparente)',
  },

  // Tipografia Legal Design
  tipografia: {
    corpo: 'Palatino Linotype',
    fallback: 'Book Antiqua, Georgia, serif',
    titulos: 'Palatino Linotype, serif',
    escala: 'Áurea (1.618)',
  },
} as const

// ─── Compliance e Integridade ────────────────────────────────────────────────

export const COMPLIANCE_ATA360 = {
  // Classificação PBIA
  classificacao_ia: {
    nivel_risco: 'ALTO',
    fundamento: 'PL 2.338/2023, Art. 14 — IA em administração pública',
    principios_conformes: 9,
    principios_total: 10,
    pendencia: 'Política formal de governança de IA publicável',
  },

  // Programa de Integridade (CGU)
  integridade_cgu: {
    pilares: [
      'Comprometimento da alta direção e instância responsável',
      'Análise de perfil e riscos',
      'Estruturação de regras e instrumentos',
      'Estratégias de comunicação e treinamento',
      'Monitoramento contínuo',
    ],
    score: 85,
    nivel: 'AVANCADO',
    fundamentacao: 'Portaria CGU 226/2025',
  },

  // ESG
  esg: {
    ambiental: {
      score: 72,
      destaque: 'Cloud-first (zero hardware on-premise), paperless por design',
    },
    social: {
      score: 88,
      destaque: 'Acessibilidade WCAG AA, inclusão digital de municípios pequenos',
    },
    governanca: {
      score: 91,
      destaque: 'Auditoria automática AUDITOR, trilha completa, selo de qualidade',
    },
  },

  // ODS ONU
  ods_alinhados: [
    { numero: 5, nome: 'Igualdade de Gênero', relacao: 'Acessibilidade e inclusão' },
    { numero: 9, nome: 'Indústria, Inovação e Infraestrutura', relacao: 'IA para setor público' },
    { numero: 10, nome: 'Redução das Desigualdades', relacao: 'Precificação proporcional (entes menores pagam menos)' },
    { numero: 12, nome: 'Consumo e Produção Responsáveis', relacao: 'Sustentabilidade nas contratações (Dec. 7.746/2012)' },
    { numero: 16, nome: 'Paz, Justiça e Instituições Eficazes', relacao: 'Transparência, conformidade, anticorrupção' },
    { numero: 17, nome: 'Parcerias e Meios de Implementação', relacao: 'APIs abertas, integração Gov.br' },
  ],

  // Certificações alvo
  certificacoes_alvo: [
    'Pró-Ética CGU',
    'ABES (Associação Brasileira das Empresas de Software)',
    'TCU Diamante (selo governança)',
    'TCE-MG (selo conformidade)',
  ],

  // Legislação base
  legislacao_aplicavel: [
    { lei: 'Lei 14.133/2021', descricao: 'Nova Lei de Licitações e Contratos' },
    { lei: 'LGPD (Lei 13.709/2018)', descricao: 'Proteção de dados pessoais' },
    { lei: 'Lei 12.846/2013', descricao: 'Lei Anticorrupção (responsabilidade empresarial)' },
    { lei: 'Lei 9.279/1996', descricao: 'Propriedade industrial (segredo industrial ATA360)' },
    { lei: 'Lei 9.609/1998', descricao: 'Proteção de software' },
    { lei: 'LINDB (Lei 13.655/2018)', descricao: '6 artigos aplicados (Arts. 20-23, 28, 30)' },
    { lei: 'LC 182/2021', descricao: 'Marco Legal das Startups' },
    { lei: 'PL 2.338/2023', descricao: 'Marco Regulatório da IA (em tramitação)' },
    { lei: 'EC 105/2019', descricao: 'Emendas parlamentares (PIX, RP6/RP7/RP8)' },
    { lei: 'Lei 14.063/2020', descricao: 'Assinatura eletrônica (3 níveis)' },
  ],
} as const
