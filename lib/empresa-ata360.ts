/**
 * ATA360 — Dados Cadastrais e Identidade da Empresa
 *
 * CNPJ: 61.291.296/0001-31
 *
 * IMPORTANTE — Regra de Genero:
 *   "o ATA360" (masculino) → refere-se ao SISTEMA/IA
 *   "a ATA360" (feminino) → refere-se a EMPRESA
 *
 * SEGURANCA: Dados sensiveis (QSA, endereco, capital social) removidos.
 * Consultar via Receita Federal se necessario. NUNCA expor no repositorio.
 *
 * @see Lei 9.279/1996 — Propriedade Industrial
 * @see Lei 9.609/1998 — Software
 * @see LGPD (Lei 13.709/2018) — Protecao de Dados
 * @see LC 182/2021 — Marco Legal das Startups
 */

// ─── Dados Cadastrais (Publicos) ─────────────────────────────────────────────

export const EMPRESA_ATA360 = {
  // Identificacao publica
  razao_social: 'ATA360 TECNOLOGIA LTDA',
  nome_fantasia: 'ATA360',
  cnpj: '61.291.296/0001-31',

  // Natureza Juridica
  natureza_juridica: {
    codigo: '234-8',
    descricao: 'Empresa Simples de Inovacao (Inova Simples)',
    lei_base: 'LC 182/2021 (Marco Legal das Startups)',
  },

  // Localizacao (apenas UF — sem endereco completo)
  uf: 'MG',
  regiao_metropolitana: 'Belo Horizonte',

  // Atividade principal
  cnae_principal: {
    codigo: '6202-3/00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador customizaveis',
  },

  // CATSER para contratacao publica
  catser: {
    principal: '27502', // Desenvolvimento de software
    alternativo: '26123', // Processamento de dados
    descricao_servico: 'Licenciamento de software SaaS para inteligencia em contratacoes publicas',
  },

  // Canais oficiais
  contato: {
    suporte: 'suporte@ata360.com.br',
    ouvidoria: 'ouvidoria@ata360.com.br',
    financeiro: 'financeiro@ata360.com.br',
    site: 'https://www.ata360.com.br',
  },
} as const

// ─── Identidade Visual e Terminologia ────────────────────────────────────────

export const IDENTIDADE_ATA360 = {
  /**
   * Regra de genero obrigatoria em TODOS os textos do sistema:
   *   "o ATA360" = o sistema, a plataforma, a inteligencia artificial
   *   "a ATA360" = a empresa, a pessoa juridica, a sociedade
   */
  genero: {
    sistema: { artigo: 'o', exemplo: 'o ATA360 identificou 3 irregularidades' },
    empresa: { artigo: 'a', exemplo: 'a ATA360 e uma empresa de tecnologia' },
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
    nome: 'Certificado de Qualidade ATA360 — Governanca Ouro',
    descricao: 'Certifica conformidade Lei 14.133/2021, boa-fe, dados oficiais',
    arquivo: 'selo-ata360-governanca-ouro.png',
    resolucao: '300 DPI',
    formato: 'PNG alpha (fundo transparente)',
  },

  // Tipografia Legal Design
  tipografia: {
    corpo: 'Palatino Linotype',
    fallback: 'Book Antiqua, Georgia, serif',
    titulos: 'Palatino Linotype, serif',
    escala: 'Aurea (1.618)',
  },
} as const

// ─── Compliance e Integridade ────────────────────────────────────────────────

export const COMPLIANCE_ATA360 = {
  // Legislacao aplicavel
  legislacao_aplicavel: [
    { lei: 'Lei 14.133/2021', descricao: 'Nova Lei de Licitacoes e Contratos' },
    { lei: 'LGPD (Lei 13.709/2018)', descricao: 'Protecao de dados pessoais' },
    { lei: 'Lei 12.846/2013', descricao: 'Lei Anticorrupcao' },
    { lei: 'Lei 9.279/1996', descricao: 'Propriedade industrial' },
    { lei: 'Lei 9.609/1998', descricao: 'Protecao de software' },
    { lei: 'LINDB (Lei 13.655/2018)', descricao: '6 artigos aplicados (Arts. 20-23, 28, 30)' },
    { lei: 'LC 182/2021', descricao: 'Marco Legal das Startups' },
    { lei: 'PL 2.338/2023', descricao: 'Marco Regulatorio da IA (em tramitacao)' },
    { lei: 'Lei 14.063/2020', descricao: 'Assinatura eletronica (3 niveis)' },
  ],

  // ODS ONU alinhados
  ods_alinhados: [5, 9, 10, 12, 16, 17],

  // Certificacoes alvo
  certificacoes_alvo: [
    'Pro-Etica CGU',
    'ABES',
    'TCU Diamante',
    'TCE-MG',
  ],
} as const
