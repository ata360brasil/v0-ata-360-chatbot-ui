/**
 * ATA360 — Módulo de Compliance e Integridade
 *
 * Programa de Integridade baseado em:
 * - Portaria CGU 226/2025
 * - Diretrizes de Programa de Integridade para Empresas Privadas (CGU, out/2024)
 * - Lei 12.846/2013 (Lei Anticorrupção)
 * - Programa Empresa Pró-Ética (CGU)
 * - Programa Empresa Ética (ABES)
 * - Selo Diamante (TCU)
 * - Programa Integridade (TCE-MG)
 * - CEP — Comissão de Ética Pública
 * - ESG / ODS ONU
 *
 * 5 Pilares de Integridade (CGU):
 * 1. Comprometimento da liderança
 * 2. Instância responsável
 * 3. Análise de riscos
 * 4. Regras e instrumentos
 * 5. Monitoramento contínuo
 *
 * @see https://www.gov.br/cgu/pt-br/assuntos/integridade-privada
 * @see DOCUMENTACAO.md — Seção 9 — Segurança e Compliance
 */

import type { Env } from '../orchestrator/types'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface ProgramaIntegridade {
  id: string
  orgao_id: string
  // Pilares CGU
  pilares: {
    comprometimento_lideranca: boolean
    instancia_responsavel: boolean
    analise_riscos: boolean
    regras_instrumentos: boolean
    monitoramento_continuo: boolean
  }
  // Instrumentos
  codigo_conduta: { ativo: boolean; url?: string; data?: string }
  canal_denuncias: { ativo: boolean; tipo?: string; url?: string }
  due_diligence: boolean
  treinamento: { realizado: boolean; ultimo?: string }
  // Certificações
  certificacoes: {
    pro_etica_cgu: boolean
    abes_etica: boolean
    tcu_diamante: boolean
    tce_mg: boolean
  }
  // Políticas
  politicas: {
    anticorrupcao: boolean
    lgpd: boolean
    diversidade: boolean
    teletrabalho: boolean
    respeito_mulher: boolean
    esg: boolean
    conflito_interesse: boolean
  }
  // ESG
  esg: {
    ambiental: number      // 0-100
    social: number
    governanca: number
    compras_sustentaveis_pct: number
  }
  // ODS ONU
  ods: number[]            // [5, 9, 10, 12, 16, 17]
  // Avaliação
  nivel_maturidade: string
  score_integridade: number
}

export interface RiscoIntegridade {
  descricao: string
  categoria: string
  probabilidade: string
  impacto: string
  nivel_risco: string
  controles_existentes: string
  controles_adicionais: string
  responsavel: string
  prazo_mitigacao: string | null
  status: string
}

// ─── Avaliação de Compliance ────────────────────────────────────────────────

/**
 * Calcula score de integridade do programa.
 * Baseado nos 5 pilares CGU + instrumentos + certificações + ESG.
 */
export function calcularScoreIntegridade(programa: ProgramaIntegridade): {
  score: number
  nivel: string
  gaps: string[]
  recomendacoes: string[]
} {
  let score = 0
  const gaps: string[] = []
  const recomendacoes: string[] = []

  // ─── Pilares CGU (40 pontos) ────────────────────────────
  const pilares = programa.pilares
  const pilaresScore = [
    pilares.comprometimento_lideranca,
    pilares.instancia_responsavel,
    pilares.analise_riscos,
    pilares.regras_instrumentos,
    pilares.monitoramento_continuo,
  ].filter(Boolean).length * 8 // 8 pontos cada pilar

  score += pilaresScore

  if (!pilares.comprometimento_lideranca) {
    gaps.push('Comprometimento da liderança não formalizado')
    recomendacoes.push('Formalizar comprometimento da alta direção com programa de integridade (Portaria CGU 226/2025)')
  }
  if (!pilares.instancia_responsavel) {
    gaps.push('Instância responsável pelo programa não designada')
    recomendacoes.push('Designar área/comitê responsável pelo programa de integridade')
  }
  if (!pilares.analise_riscos) {
    gaps.push('Análise de riscos de integridade não realizada')
    recomendacoes.push('Realizar mapeamento de riscos de integridade (Lei 12.846/2013)')
  }
  if (!pilares.regras_instrumentos) {
    gaps.push('Regras e instrumentos de integridade não implementados')
    recomendacoes.push('Implementar código de conduta, canal de denúncias e due diligence')
  }
  if (!pilares.monitoramento_continuo) {
    gaps.push('Monitoramento contínuo não estabelecido')
    recomendacoes.push('Estabelecer rotina de monitoramento e auditoria do programa')
  }

  // ─── Instrumentos (25 pontos) ───────────────────────────
  if (programa.codigo_conduta.ativo) score += 8
  else {
    gaps.push('Código de Conduta Ética não publicado')
    recomendacoes.push('Elaborar e publicar Código de Conduta Ética (requisito CGU Empresa Pró-Ética)')
  }

  if (programa.canal_denuncias.ativo) {
    score += 8
    if (programa.canal_denuncias.tipo === 'terceirizado') score += 2
  } else {
    gaps.push('Canal de Denúncias não implementado')
    recomendacoes.push('Implementar canal de denúncias independente/terceirizado (requisito CGU)')
  }

  if (programa.due_diligence) score += 4
  else recomendacoes.push('Implementar procedimento de Due Diligence de terceiros')

  if (programa.treinamento.realizado) score += 3
  else recomendacoes.push('Realizar treinamento de compliance para todos os integrantes')

  // ─── Políticas (15 pontos) ──────────────────────────────
  const politicas = programa.politicas
  const politicasAtivas = Object.values(politicas).filter(Boolean).length
  score += Math.min(15, politicasAtivas * 2.14)

  if (!politicas.anticorrupcao) {
    gaps.push('Política anticorrupção não formalizada')
    recomendacoes.push('Formalizar política anticorrupção (Lei 12.846/2013)')
  }
  if (!politicas.lgpd) {
    gaps.push('Política LGPD não implementada')
    recomendacoes.push('Implementar política de proteção de dados (LGPD - Lei 13.709/2018)')
  }

  // ─── ESG (10 pontos) ───────────────────────────────────
  const esgMedio = (programa.esg.ambiental + programa.esg.social + programa.esg.governanca) / 3
  score += Math.min(10, esgMedio / 10)

  if (programa.esg.compras_sustentaveis_pct < 10) {
    recomendacoes.push('Ampliar percentual de compras com critérios sustentáveis (Dec. 7.746/2012)')
  }

  // ─── ODS ONU (5 pontos) ────────────────────────────────
  const odsAtendidos = programa.ods.length
  score += Math.min(5, odsAtendidos * 0.83)

  // ─── Certificações (5 pontos bônus) ────────────────────
  const certs = programa.certificacoes
  if (certs.pro_etica_cgu) score += 2
  if (certs.abes_etica) score += 1
  if (certs.tcu_diamante) score += 1
  if (certs.tce_mg) score += 1

  // ─── Nível de Maturidade ──────────────────────────────
  score = Math.min(100, Math.round(score))
  let nivel: string
  if (score >= 90) nivel = 'excelencia'
  else if (score >= 70) nivel = 'avancado'
  else if (score >= 50) nivel = 'intermediario'
  else if (score >= 30) nivel = 'basico'
  else nivel = 'inicial'

  return { score, nivel, gaps, recomendacoes }
}

// ─── Riscos Padrão para Contratações Públicas ──────────────────────────────

/**
 * Gera mapa de riscos padrão para o ente.
 * Baseado nas categorias de risco mais comuns em licitações.
 */
export function gerarMapaRiscosPadrao(): RiscoIntegridade[] {
  return [
    {
      descricao: 'Direcionamento de licitação por especificação restritiva',
      categoria: 'direcionamento_licitacao',
      probabilidade: 'media',
      impacto: 'muito_alto',
      nivel_risco: 'elevado',
      controles_existentes: 'Auditoria AUDITOR do ATA360 verifica restritividade',
      controles_adicionais: 'Revisão cruzada de especificações por outro setor',
      responsavel: 'Setor de Licitações + Comissão de Integridade',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
    {
      descricao: 'Fracionamento de despesa para dispensa indevida',
      categoria: 'fracionamento',
      probabilidade: 'media',
      impacto: 'alto',
      nivel_risco: 'elevado',
      controles_existentes: 'PCA inteligente detecta itens similares. AUDITOR verifica valores.',
      controles_adicionais: 'Análise automática de padrões de fracionamento no PCA',
      responsavel: 'Controle Interno + ATA360',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
    {
      descricao: 'Superfaturamento de preços em contratações',
      categoria: 'superfaturamento',
      probabilidade: 'media',
      impacto: 'muito_alto',
      nivel_risco: 'critico',
      controles_existentes: 'Pesquisa de preços obrigatória (PNCP, Compras.gov). AUDITOR verifica outliers.',
      controles_adicionais: 'Comparação automática com SINAPI/SICRO para obras',
      responsavel: 'Setor de Compras + ATA360',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
    {
      descricao: 'Conflito de interesse não declarado',
      categoria: 'conflito_interesse',
      probabilidade: 'baixa',
      impacto: 'alto',
      nivel_risco: 'moderado',
      controles_existentes: 'Declaração de impedimento obrigatória em processos',
      controles_adicionais: 'Consulta automática SERPRO (CNPJ/CPF) para verificar vínculos',
      responsavel: 'Comissão de Ética + RH',
      prazo_mitigacao: null,
      status: 'identificado',
    },
    {
      descricao: 'Vazamento de dados pessoais de fornecedores/servidores',
      categoria: 'vazamento_dados',
      probabilidade: 'baixa',
      impacto: 'alto',
      nivel_risco: 'moderado',
      controles_existentes: 'RLS multi-tenant, dados mascarados, LGPD compliance',
      controles_adicionais: 'Auditoria periódica de acessos, treinamento LGPD',
      responsavel: 'TI + DPO',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
    {
      descricao: 'Conluio entre fornecedores em certame',
      categoria: 'conluio',
      probabilidade: 'media',
      impacto: 'muito_alto',
      nivel_risco: 'elevado',
      controles_existentes: 'Análise de padrões de lances (preços muito próximos)',
      controles_adicionais: 'Análise de rede societária (SERPRO CNPJ), cruzamento de IPs',
      responsavel: 'Pregoeiro + Controle Interno',
      prazo_mitigacao: null,
      status: 'identificado',
    },
    {
      descricao: 'Assédio moral ou sexual no ambiente de trabalho',
      categoria: 'assedio',
      probabilidade: 'baixa',
      impacto: 'muito_alto',
      nivel_risco: 'elevado',
      controles_existentes: 'Canal de Denúncias, Código de Conduta',
      controles_adicionais: 'Treinamento periódico, pesquisa de clima organizacional',
      responsavel: 'CEP + RH',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
    {
      descricao: 'Irregularidade na prestação de contas de convênios',
      categoria: 'irregularidade_contratual',
      probabilidade: 'media',
      impacto: 'alto',
      nivel_risco: 'elevado',
      controles_existentes: 'Controle de prazos ATA360, alertas automáticos',
      controles_adicionais: 'Reconciliação automática com TransfereGov/FNS/FNDE',
      responsavel: 'Setor de Convênios + Contabilidade',
      prazo_mitigacao: null,
      status: 'em_mitigacao',
    },
  ]
}

// ─── ODS ONU Atendidos pelo ATA360 ─────────────────────────────────────────

export const ODS_ATA360 = [
  {
    numero: 5,
    titulo: 'Igualdade de Gênero',
    contribuicao: 'Política de respeito à mulher, diversidade, não-discriminação em contratações',
    metricas: ['% mulheres em equipe', '% fornecedoras mulheres', 'treinamentos diversidade'],
  },
  {
    numero: 9,
    titulo: 'Indústria, Inovação e Infraestrutura',
    contribuicao: 'Transformação digital das compras públicas, IA aplicada à governança',
    metricas: ['processos digitalizados', 'tempo médio de contratação', 'economia gerada'],
  },
  {
    numero: 10,
    titulo: 'Redução das Desigualdades',
    contribuicao: 'Acesso igualitário a compras públicas, WCAG AA, inclusão digital',
    metricas: ['acessibilidade WCAG', 'ME/EPP beneficiadas', 'cobertura municipal'],
  },
  {
    numero: 12,
    titulo: 'Consumo e Produção Responsáveis',
    contribuicao: 'Compras sustentáveis (Dec. 7.746/2012), redução de desperdício',
    metricas: ['% compras sustentáveis', 'economia de papel', 'rastreabilidade'],
  },
  {
    numero: 16,
    titulo: 'Paz, Justiça e Instituições Eficazes',
    contribuicao: 'Transparência, governança, anticorrupção, canal de denúncias',
    metricas: ['score integridade', 'conformidade legal', 'audit trail completo'],
  },
  {
    numero: 17,
    titulo: 'Parcerias e Meios de Implementação',
    contribuicao: 'Dados abertos, integração com 76+ APIs governamentais',
    metricas: ['APIs integradas', 'dados abertos publicados', 'parceiros ativos'],
  },
]

// ─── Métricas ESG ──────────────────────────────────────────────────────────

export function calcularESG(programa: ProgramaIntegridade): {
  ambiental: number
  social: number
  governanca: number
  geral: number
  classificacao: string
} {
  // Ambiental (E)
  let ambiental = 0
  if (programa.esg.compras_sustentaveis_pct > 0) ambiental += programa.esg.compras_sustentaveis_pct
  if (programa.politicas.esg) ambiental += 30
  ambiental = Math.min(100, ambiental)

  // Social (S)
  let social = 0
  if (programa.politicas.diversidade) social += 20
  if (programa.politicas.respeito_mulher) social += 20
  if (programa.politicas.teletrabalho) social += 10
  if (programa.canal_denuncias.ativo) social += 25
  if (programa.treinamento.realizado) social += 25
  social = Math.min(100, social)

  // Governança (G)
  let governanca = 0
  if (programa.pilares.comprometimento_lideranca) governanca += 15
  if (programa.pilares.instancia_responsavel) governanca += 15
  if (programa.pilares.analise_riscos) governanca += 15
  if (programa.pilares.monitoramento_continuo) governanca += 15
  if (programa.codigo_conduta.ativo) governanca += 15
  if (programa.politicas.anticorrupcao) governanca += 15
  if (programa.politicas.conflito_interesse) governanca += 10
  governanca = Math.min(100, governanca)

  const geral = Math.round((ambiental + social + governanca) / 3)

  let classificacao: string
  if (geral >= 80) classificacao = 'Excelente'
  else if (geral >= 60) classificacao = 'Bom'
  else if (geral >= 40) classificacao = 'Regular'
  else if (geral >= 20) classificacao = 'Em desenvolvimento'
  else classificacao = 'Inicial'

  return { ambiental, social, governanca, geral, classificacao }
}
