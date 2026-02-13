/**
 * AI Runtime — Connects provider schemas + agent training to orchestrator
 *
 * Bridge between lib/schemas/{ai-providers,agent-training}.ts and Workers.
 * Re-exports the schema data for use by the orchestrator at runtime.
 *
 * Why inline? Workers run in Cloudflare (separate build), can't import
 * from ../../lib/schemas at runtime. This file mirrors the definitions
 * and will be kept in sync via CI checks.
 *
 * @see lib/schemas/ai-providers.ts — Source of truth for providers
 * @see lib/schemas/agent-training.ts — Source of truth for training
 * @see Spec v8, Part 11 — Multi-Model Gateway
 */

// ─── Types (mirrored from lib/schemas/ai-providers.ts) ─────────────────────

type AIProvider = 'anthropic' | 'openai' | 'google' | 'meta' | 'mistral'
type AgentTier = 'triagem' | 'geracao' | 'critico'
type AgentId = 'acma' | 'auditor' | 'insight' | 'normalizer'

interface ResolvedModel {
  providerId: AIProvider
  modelId: string
  modelName: string
  temperature: number
  maxTokens: number
}

interface AgentRuntimeConfig {
  model: ResolvedModel
  forbiddenActions: readonly string[]
  requiredSources: readonly string[]
  systemPromptPrefix: string
}

// ─── Default Routing (from lib/schemas/ai-providers.ts DEFAULT_ROUTING) ─────

const TIER_MODELS: Record<AgentTier, { id: string; name: string; maxOutput: number }> = {
  triagem: { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', maxOutput: 8192 },
  geracao: { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', maxOutput: 8192 },
  critico: { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', maxOutput: 32768 },
}

// ─── Agent Registry (from lib/schemas/agent-training.ts AGENT_REGISTRY) ─────

const AGENT_CONFIGS: Record<AgentId, {
  name: string
  role: string
  tier: AgentTier
  temperature: number
  forbiddenActions: readonly string[]
  requiredSources: readonly string[]
}> = {
  acma: {
    name: 'ACMA — Advanced Compliance & Metrics Analysis',
    role: 'Gera sugestoes de texto fundamentadas na legislacao e dados oficiais',
    tier: 'geracao',
    temperature: 0.3,
    forbiddenActions: [
      'Inventar precos',
      'Criar jurisprudencia ficticia',
      'Omitir fundamentacao legal',
      'Sugerir marcas especificas',
      'Decidir pelo servidor',
    ],
    requiredSources: ['PNCP', 'IBGE', 'legislacao'],
  },
  auditor: {
    name: 'AUDITOR — Compliance Checker',
    role: 'Verifica conformidade de documentos contra checklist legal',
    tier: 'geracao',
    temperature: 0.1,
    forbiddenActions: [
      'Aprovar documento sem verificacao',
      'Ignorar requisitos legais',
      'Inventar normas',
      'Dar parecer definitivo',
    ],
    requiredSources: ['legislacao', 'jurisprudencia_tcu'],
  },
  insight: {
    name: 'INSIGHT — Data Engine',
    role: 'Consulta APIs governamentais e enriquece contexto para demais agentes',
    tier: 'triagem',
    temperature: 0,
    forbiddenActions: [
      'Interpolar dados',
      'Estimar sem fonte',
      'Cachear dados obsoletos',
    ],
    requiredSources: ['PNCP', 'IBGE', 'TCU', 'CGU', 'BCB'],
  },
  normalizer: {
    name: 'NORMALIZER — Text Standardization',
    role: 'Padroniza termos, abreviaturas, regionalismos e unidades de medida',
    tier: 'triagem',
    temperature: 0,
    forbiddenActions: [
      'Inventar sinonimos',
      'Alterar significado',
      'Remover termos tecnicos',
    ],
    requiredSources: ['catmat', 'catser', 'abreviaturas'],
  },
}

// Anti-hallucination layer count (from agent-training.ts)
const AUTOMATED_AH_LAYERS = 7 // layers 1-4, 6-8 are automated

// ─── Model Resolution ───────────────────────────────────────────────────────

export function resolveModelForAgent(agentId: AgentId): ResolvedModel {
  const agent = AGENT_CONFIGS[agentId]
  const model = TIER_MODELS[agent.tier]

  return {
    providerId: 'anthropic',
    modelId: model.id,
    modelName: model.name,
    temperature: agent.temperature,
    maxTokens: model.maxOutput,
  }
}

// ─── Agent Runtime Config ───────────────────────────────────────────────────

export function getAgentRuntimeConfig(agentId: AgentId): AgentRuntimeConfig {
  const agent = AGENT_CONFIGS[agentId]
  const model = resolveModelForAgent(agentId)

  const systemPromptPrefix = [
    `[AGENT: ${agent.name}]`,
    `[ROLE: ${agent.role}]`,
    `[ANTI-HALLUCINATION: ${AUTOMATED_AH_LAYERS} camadas ativas]`,
    `[FORBIDDEN: ${agent.forbiddenActions.join('; ')}]`,
    `[REQUIRED SOURCES: ${agent.requiredSources.join(', ')}]`,
    `[MODEL: ${model.modelName} | temp=${model.temperature}]`,
  ].join('\n')

  return {
    model,
    forbiddenActions: agent.forbiddenActions,
    requiredSources: agent.requiredSources,
    systemPromptPrefix,
  }
}

// ─── Response Validation ────────────────────────────────────────────────────

export function validateAgentResponse(agentId: AgentId, response: string): string[] {
  const agent = AGENT_CONFIGS[agentId]
  const violations: string[] = []

  for (const forbidden of agent.forbiddenActions) {
    const keywords = forbidden.toLowerCase().split(' ')
    const hasViolation = keywords.every((kw: string) => response.toLowerCase().includes(kw))
    if (hasViolation) {
      violations.push(`Possivel violacao: "${forbidden}"`)
    }
  }

  // Verifica citacao obrigatoria para agentes geradores
  if (agentId === 'acma' || agentId === 'auditor') {
    const hasLegalRef = /(?:Art\.|Lei|Decreto|IN|Sumula|Acordao)\s/i.test(response)
    if (!hasLegalRef) {
      violations.push('Resposta sem fundamentacao legal (taxa de citacao abaixo do alvo)')
    }
  }

  return violations
}

export { AGENT_CONFIGS, TIER_MODELS }
export type { AgentId, AgentTier, AIProvider, ResolvedModel, AgentRuntimeConfig }
