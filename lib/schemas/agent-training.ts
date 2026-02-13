/**
 * Agent Training & Anti-Hallucination Infrastructure
 *
 * Sistema de treinamento de agentes IA para contratações públicas:
 * - Calibração de prompts por domínio legal
 * - Anti-alucinação: 8 camadas de blindagem
 * - Feedback loop: aprendizado contínuo com supervisão humana
 * - Compliance: auditoria de respostas contra legislação
 *
 * Arquitetura AI-First:
 * - O ATA360 é concebido como sistema autônomo de IA
 * - A IA é a infraestrutura, não o complemento
 * - Decisão humana é soberana (Art. 20, LINDB)
 * - Automação responsável, confiável e segura
 *
 * @see PL 2.338/2023 — Marco Regulatório da IA
 * @see Art. 20, LINDB — Decisão administrativa motivada
 * @see Spec v8, Part 9 — Anti-Hallucination Shield
 */

import { z } from 'zod'

// ─── Anti-Hallucination Shield (8 Layers) ────────────────────────────────────

export const ANTI_HALLUCINATION_LAYERS = [
  {
    layer: 1,
    name: 'Fontes Oficiais Exclusivas',
    description: 'Dados provêm exclusivamente de APIs governamentais (PNCP, IBGE, TCU, CGU, BCB, TransfereGov)',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 2,
    name: 'Motor Determinístico para Documentos',
    description: 'PDFs e documentos formais gerados por templates HTML, não por IA generativa',
    enforcement: 'architecture',
    automated: true,
  },
  {
    layer: 3,
    name: 'Auditoria Automática',
    description: 'Cada documento é verificado contra checklist legal (AUDITOR agent)',
    enforcement: 'pipeline',
    automated: true,
  },
  {
    layer: 4,
    name: 'Cross-Reference Multi-Fonte',
    description: 'Dados cruzados entre múltiplas fontes oficiais para validação',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 5,
    name: 'Revisão Humana Obrigatória',
    description: 'Nenhum documento é finalizado sem aprovação explícita do servidor público',
    enforcement: 'workflow',
    automated: false,
  },
  {
    layer: 6,
    name: 'Rastreabilidade Total',
    description: 'Cada informação tem fonte, data, hash de integridade e audit trail',
    enforcement: 'storage',
    automated: true,
  },
  {
    layer: 7,
    name: 'Alertas Proativos',
    description: 'Sistema notifica inconsistências, dados desatualizados e riscos antes da finalização',
    enforcement: 'runtime',
    automated: true,
  },
  {
    layer: 8,
    name: 'Código de Conduta IA',
    description: 'Regras invioláveis que limitam escopo da IA (ATA360_SYSTEM_RULES)',
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
    description: 'Agente principal de geração de texto para documentos licitatórios',
    role: 'Gera sugestões de texto fundamentadas na legislação e dados oficiais',
    tier: 'geracao',
    antiHallucination: {
      temperature: 0.3,
      requiredSources: ['PNCP', 'IBGE', 'legislacao'],
      forbiddenActions: [
        'Inventar preços',
        'Criar jurisprudência fictícia',
        'Omitir fundamentação legal',
        'Sugerir marcas específicas',
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
    description: 'Agente de auditoria automática de documentos',
    role: 'Verifica conformidade de documentos contra checklist legal',
    tier: 'geracao',
    antiHallucination: {
      temperature: 0.1,
      requiredSources: ['legislacao', 'jurisprudencia_tcu'],
      forbiddenActions: [
        'Aprovar documento sem verificação',
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
    description: 'Motor de normalização e padronização de texto',
    role: 'Padroniza termos, abreviaturas, regionalismos e unidades de medida',
    tier: 'triagem',
    antiHallucination: {
      temperature: 0,
      requiredSources: ['catmat', 'catser', 'abreviaturas'],
      forbiddenActions: [
        'Inventar sinônimos',
        'Alterar significado',
        'Remover termos técnicos',
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
  core: 'O ATA360 é concebido AI-first. A IA é a infraestrutura, não o complemento.',
  humanSovereignty: 'A decisão humana é soberana (Art. 20, LINDB). O servidor decide, o ATA360 fundamenta.',
  responsibleAutomation: 'Automação responsável, confiável e segura. Cada ação é rastreável e auditável.',
  antiHallucination: '8 camadas de blindagem garantem que nenhuma informação seja inventada.',
  dataIntegrity: 'Todos os dados provêm de fontes oficiais com hash de integridade.',
  continuousLearning: 'Agentes aprendem com feedback supervisionado, nunca de forma autônoma sem validação.',
  legalCompliance: [
    'Lei 14.133/2021 — Nova Lei de Licitações',
    'LGPD (Lei 13.709/2018) — Proteção de Dados',
    'LINDB (Lei 13.655/2018, Art. 20) — Decisão motivada',
    'PL 2.338/2023 — Marco Regulatório da IA',
    'Lei 12.846/2013 — Anticorrupção',
  ],
} as const

// ─── Evaluation Metrics ──────────────────────────────────────────────────────

export const EVALUATION_METRICS = {
  accuracy: {
    name: 'Precisão',
    description: 'Percentual de informações corretas vs. fontes oficiais',
    target: 0.99,
    critical: true,
  },
  hallucination_rate: {
    name: 'Taxa de Alucinação',
    description: 'Percentual de informações sem fonte verificável',
    target: 0.001,
    critical: true,
  },
  legal_compliance: {
    name: 'Conformidade Legal',
    description: 'Aderência à Lei 14.133/2021 e legislação aplicável',
    target: 1.0,
    critical: true,
  },
  response_latency: {
    name: 'Latência',
    description: 'Tempo médio de resposta (ms)',
    target: 5000,
    critical: false,
  },
  user_satisfaction: {
    name: 'Satisfação do Usuário',
    description: 'Nota média de avaliação (1-5)',
    target: 4.5,
    critical: false,
  },
  citation_rate: {
    name: 'Taxa de Citação',
    description: 'Percentual de respostas com fundamentação legal',
    target: 0.95,
    critical: true,
  },
} as const
