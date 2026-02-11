/**
 * Agent Training & Anti-Hallucination Infrastructure
 *
 * Sistema de treinamento de agentes IA para contratacoes publicas:
 * - Calibracao de prompts por dominio legal
 * - Anti-alucinacao: 8 camadas de blindagem
 * - Feedback loop: aprendizado continuo com supervisao humana
 * - Compliance: auditoria de respostas contra legislacao
 *
 * Arquitetura AI-First:
 * - O ATA360 e concebido como sistema autonomo de IA
 * - A IA e a infraestrutura, nao o complemento
 * - Decisao humana e soberana (Art. 20, LINDB)
 * - Automacao responsavel, confiavel e segura
 *
 * @see PL 2.338/2023 — Marco Regulatorio da IA
 * @see Art. 20, LINDB — Decisao administrativa motivada
 * @see Spec v8, Part 9 — Anti-Hallucination Shield
 */

import { z } from 'zod'

// ─── Anti-Hallucination Shield (8 Layers) ────────────────────────────────────

export const ANTI_HALLUCINATION_LAYERS = [
  {
    layer: 1,
    name: 'Fontes Oficiais Exclusivas',
    description: 'Dados provem exclusivamente de APIs governamentais (PNCP, IBGE, TCU, CGU, BCB, TransfereGov)',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 2,
    name: 'Motor Deterministico para Documentos',
    description: 'PDFs e documentos formais gerados por templates HTML, nao por IA generativa',
    enforcement: 'architecture',
    automated: true,
  },
  {
    layer: 3,
    name: 'Auditoria Automatica',
    description: 'Cada documento e verificado contra checklist legal (AUDITOR agent)',
    enforcement: 'pipeline',
    automated: true,
  },
  {
    layer: 4,
    name: 'Cross-Reference Multi-Fonte',
    description: 'Dados cruzados entre multiplas fontes oficiais para validacao',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 5,
    name: 'Revisao Humana Obrigatoria',
    description: 'Nenhum documento e finalizado sem aprovacao explicita do servidor publico',
    enforcement: 'workflow',
    automated: false,
  },
  {
    layer: 6,
    name: 'Rastreabilidade Total',
    description: 'Cada informacao tem fonte, data, hash de integridade e audit trail',
    enforcement: 'storage',
    automated: true,
  },
  {
    layer: 7,
    name: 'Alertas Proativos',
    description: 'Sistema notifica inconsistencias, dados desatualizados e riscos antes da finalizacao',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 8,
    name: 'Codigo de Conduta IA',
    description: 'Regras inviolaveis que limitam escopo da IA (ATA360_SYSTEM_RULES)',
    enforcement: 'prompt',
    automated: true,
  },
] as const

// ─── Agent Training Configuration ───────────────────────────────────────────

export const agentTrainingConfigSchema = z.object({
  agentId: z.string(),
  agentType: z.enum(['acma', 'auditor', 'insight', 'normalizer']),
  trainingDomain: z.enum([
    'legislacao_federal',
    'jurisprudencia_tcu',
    'normativas_seges',
    'compliance_lgpd',
    'pesquisa_precos',
    'documentos_licitatorios',
    'gestao_contratos',
    'fiscalizacao',
  ]),
  calibrationRules: z.object({
    temperature: z.number().min(0).max(1),
    maxTokens: z.number(),
    systemPrompt: z.string(),
    groundingContext: z.string(),
    forbiddenPatterns: z.array(z.string()),
    requiredCitations: z.boolean(),
    confidenceThreshold: z.number().min(0).max(1),
  }),
  evaluationCriteria: z.object({
    accuracy: z.number().min(0).max(1),
    completeness: z.number().min(0).max(1),
    legalCompliance: z.number().min(0).max(1),
    hallucination: z.number().min(0).max(1),
  }),
})

export type AgentTrainingConfig = z.infer<typeof agentTrainingConfigSchema>

// ─── Agent Definitions ───────────────────────────────────────────────────────

export const AGENT_REGISTRY = {
  acma: {
    id: 'acma',
    name: 'ACMA — Advanced Compliance & Metrics Analysis',
    description: 'Agente principal de geracao de texto para documentos licitatorios',
    role: 'Gera sugestoes de texto fundamentadas na legislacao e dados oficiais',
    tier: 'geracao',
    antiHallucination: {
      temperature: 0.3,
      requiredSources: ['PNCP', 'IBGE', 'legislacao'],
      forbiddenActions: [
        'Inventar precos',
        'Criar jurisprudencia ficticia',
        'Omitir fundamentacao legal',
        'Sugerir marcas especificas',
        'Decidir pelo servidor',
      ],
    },
    trainingDomains: ['legislacao_federal', 'documentos_licitatorios', 'pesquisa_precos'],
    feedbackLoop: {
      source: 'aprovacao_servidor',
      learningRate: 'conservative',
      humanReviewRequired: true,
    },
  },
  auditor: {
    id: 'auditor',
    name: 'AUDITOR — Compliance Checker',
    description: 'Agente de auditoria automatica de documentos',
    role: 'Verifica conformidade de documentos contra checklist legal',
    tier: 'geracao',
    antiHallucination: {
      temperature: 0.1,
      requiredSources: ['legislacao', 'jurisprudencia_tcu'],
      forbiddenActions: [
        'Aprovar documento sem verificacao',
        'Ignorar requisitos legais',
        'Inventar normas',
        'Dar parecer definitivo',
      ],
    },
    trainingDomains: ['legislacao_federal', 'jurisprudencia_tcu', 'compliance_lgpd'],
    feedbackLoop: {
      source: 'calibration_cron',
      learningRate: 'moderate',
      humanReviewRequired: false,
    },
  },
  insight: {
    id: 'insight',
    name: 'INSIGHT — Data Engine',
    description: 'Motor de coleta e enriquecimento de dados oficiais',
    role: 'Consulta APIs governamentais e enriquece contexto para demais agentes',
    tier: 'triagem',
    antiHallucination: {
      temperature: 0,
      requiredSources: ['PNCP', 'IBGE', 'TCU', 'CGU', 'BCB'],
      forbiddenActions: [
        'Interpolar dados',
        'Estimar sem fonte',
        'Cachear dados obsoletos',
      ],
    },
    trainingDomains: ['pesquisa_precos'],
    feedbackLoop: {
      source: 'data_quality_check',
      learningRate: 'aggressive',
      humanReviewRequired: false,
    },
  },
  normalizer: {
    id: 'normalizer',
    name: 'NORMALIZER — Text Standardization',
    description: 'Motor de normalizacao e padronizacao de texto',
    role: 'Padroniza termos, abreviaturas, regionalismos e unidades de medida',
    tier: 'triagem',
    antiHallucination: {
      temperature: 0,
      requiredSources: ['catmat', 'catser', 'abreviaturas'],
      forbiddenActions: [
        'Inventar sinonimos',
        'Alterar significado',
        'Remover termos tecnicos',
      ],
    },
    trainingDomains: ['documentos_licitatorios'],
    feedbackLoop: {
      source: 'normalization_accuracy',
      learningRate: 'moderate',
      humanReviewRequired: false,
    },
  },
} as const

// ─── AI-First Principles ─────────────────────────────────────────────────────

export const AI_FIRST_PRINCIPLES = {
  core: 'O ATA360 e concebido AI-first. A IA e a infraestrutura, nao o complemento.',
  humanSovereignty: 'A decisao humana e soberana (Art. 20, LINDB). O servidor decide, o ATA360 fundamenta.',
  responsibleAutomation: 'Automacao responsavel, confiavel e segura. Cada acao e rastreavel e auditavel.',
  antiHallucination: '8 camadas de blindagem garantem que nenhuma informacao seja inventada.',
  dataIntegrity: 'Todos os dados provem de fontes oficiais com hash de integridade.',
  continuousLearning: 'Agentes aprendem com feedback supervisionado, nunca de forma autonoma sem validacao.',
  legalCompliance: [
    'Lei 14.133/2021 — Nova Lei de Licitacoes',
    'LGPD (Lei 13.709/2018) — Protecao de Dados',
    'LINDB (Lei 13.655/2018, Art. 20) — Decisao motivada',
    'PL 2.338/2023 — Marco Regulatorio da IA',
    'Lei 12.846/2013 — Anticorrupcao',
  ],
} as const

// ─── Evaluation Metrics ──────────────────────────────────────────────────────

export const EVALUATION_METRICS = {
  accuracy: {
    name: 'Precisao',
    description: 'Percentual de informacoes corretas vs. fontes oficiais',
    target: 0.99,
    critical: true,
  },
  hallucination_rate: {
    name: 'Taxa de Alucinacao',
    description: 'Percentual de informacoes sem fonte verificavel',
    target: 0.001,
    critical: true,
  },
  legal_compliance: {
    name: 'Conformidade Legal',
    description: 'Aderencia a Lei 14.133/2021 e legislacao aplicavel',
    target: 1.0,
    critical: true,
  },
  response_latency: {
    name: 'Latencia',
    description: 'Tempo medio de resposta (ms)',
    target: 5000,
    critical: false,
  },
  user_satisfaction: {
    name: 'Satisfacao do Usuario',
    description: 'Nota media de avaliacao (1-5)',
    target: 4.5,
    critical: false,
  },
  citation_rate: {
    name: 'Taxa de Citacao',
    description: 'Percentual de respostas com fundamentacao legal',
    target: 0.95,
    critical: true,
  },
} as const
