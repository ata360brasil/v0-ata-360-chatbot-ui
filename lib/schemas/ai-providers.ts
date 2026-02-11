/**
 * AI Providers — Multi-Model Gateway Configuration
 *
 * Estrategia AI-agnostic (Spec v8, Part 11):
 * - Claude (Anthropic) — primario, especialista em texto legal
 * - GPT (OpenAI) — fallback, capacidades gerais
 * - Gemini (Google) — fallback, custo otimizado
 * - Llama (Meta) — open-source, on-premise futuro
 * - Mistral — europeu, alternativa open-weight
 *
 * Cada provider tem configuracao de:
 * - Endpoints e autenticacao
 * - Modelos disponiveis por tier
 * - Capacidades (tool_use, vision, streaming)
 * - Anti-alucinacao settings
 * - Custo estimado por 1M tokens
 *
 * @see Cloudflare AI Gateway — multi-model routing
 * @see PL 2.338/2023 — Marco Regulatorio IA (preparacao)
 */

import { z } from 'zod'

// ─── Provider Types ──────────────────────────────────────────────────────────

export type AIProvider = 'anthropic' | 'openai' | 'google' | 'meta' | 'mistral'

export interface ProviderConfig {
  id: AIProvider
  name: string
  status: 'active' | 'fallback' | 'planned'
  models: ProviderModel[]
  capabilities: ProviderCapabilities
  antiHallucination: AntiHallucinationConfig
  compliance: ComplianceConfig
}

export interface ProviderModel {
  id: string
  name: string
  tier: 'triagem' | 'geracao' | 'critico'
  contextWindow: number
  maxOutput: number
  costPer1MInput: number
  costPer1MOutput: number
  supportsToolUse: boolean
  supportsVision: boolean
  supportsStreaming: boolean
}

export interface ProviderCapabilities {
  toolUse: boolean
  vision: boolean
  streaming: boolean
  batchAPI: boolean
  finetuning: boolean
  embeddings: boolean
}

export interface AntiHallucinationConfig {
  temperature: number
  topP: number
  systemPromptEnforcement: boolean
  groundingRequired: boolean
  citationRequired: boolean
  maxRetries: number
}

export interface ComplianceConfig {
  lgpdCompliant: boolean
  dataResidency: string[]
  encryptionInTransit: boolean
  encryptionAtRest: boolean
  auditLogging: boolean
  sopiCompliant: boolean
}

// ─── Provider Registry ───────────────────────────────────────────────────────

export const AI_PROVIDERS: Record<AIProvider, ProviderConfig> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    status: 'active',
    models: [
      {
        id: 'claude-haiku-4-5-20251001',
        name: 'Claude Haiku 4.5',
        tier: 'triagem',
        contextWindow: 200000,
        maxOutput: 8192,
        costPer1MInput: 0.80,
        costPer1MOutput: 4.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'claude-sonnet-4-5-20250929',
        name: 'Claude Sonnet 4.5',
        tier: 'geracao',
        contextWindow: 200000,
        maxOutput: 8192,
        costPer1MInput: 3.00,
        costPer1MOutput: 15.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'claude-opus-4-6',
        name: 'Claude Opus 4.6',
        tier: 'critico',
        contextWindow: 200000,
        maxOutput: 32000,
        costPer1MInput: 15.00,
        costPer1MOutput: 75.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
    ],
    capabilities: {
      toolUse: true,
      vision: true,
      streaming: true,
      batchAPI: true,
      finetuning: false,
      embeddings: false,
    },
    antiHallucination: {
      temperature: 0.3,
      topP: 0.9,
      systemPromptEnforcement: true,
      groundingRequired: true,
      citationRequired: true,
      maxRetries: 2,
    },
    compliance: {
      lgpdCompliant: true,
      dataResidency: ['US', 'EU'],
      encryptionInTransit: true,
      encryptionAtRest: true,
      auditLogging: true,
      sopiCompliant: true,
    },
  },

  openai: {
    id: 'openai',
    name: 'OpenAI (GPT)',
    status: 'fallback',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        tier: 'triagem',
        contextWindow: 128000,
        maxOutput: 16384,
        costPer1MInput: 0.15,
        costPer1MOutput: 0.60,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        tier: 'geracao',
        contextWindow: 128000,
        maxOutput: 16384,
        costPer1MInput: 2.50,
        costPer1MOutput: 10.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
    ],
    capabilities: {
      toolUse: true,
      vision: true,
      streaming: true,
      batchAPI: true,
      finetuning: true,
      embeddings: true,
    },
    antiHallucination: {
      temperature: 0.2,
      topP: 0.85,
      systemPromptEnforcement: true,
      groundingRequired: true,
      citationRequired: true,
      maxRetries: 2,
    },
    compliance: {
      lgpdCompliant: true,
      dataResidency: ['US', 'EU'],
      encryptionInTransit: true,
      encryptionAtRest: true,
      auditLogging: true,
      sopiCompliant: true,
    },
  },

  google: {
    id: 'google',
    name: 'Google (Gemini)',
    status: 'fallback',
    models: [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        tier: 'triagem',
        contextWindow: 1000000,
        maxOutput: 8192,
        costPer1MInput: 0.075,
        costPer1MOutput: 0.30,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'gemini-2.0-pro',
        name: 'Gemini 2.0 Pro',
        tier: 'critico',
        contextWindow: 2000000,
        maxOutput: 8192,
        costPer1MInput: 1.25,
        costPer1MOutput: 5.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
    ],
    capabilities: {
      toolUse: true,
      vision: true,
      streaming: true,
      batchAPI: false,
      finetuning: true,
      embeddings: true,
    },
    antiHallucination: {
      temperature: 0.2,
      topP: 0.85,
      systemPromptEnforcement: true,
      groundingRequired: true,
      citationRequired: true,
      maxRetries: 2,
    },
    compliance: {
      lgpdCompliant: true,
      dataResidency: ['US', 'EU', 'BR'],
      encryptionInTransit: true,
      encryptionAtRest: true,
      auditLogging: true,
      sopiCompliant: true,
    },
  },

  meta: {
    id: 'meta',
    name: 'Meta (Llama)',
    status: 'planned',
    models: [
      {
        id: 'llama-3.3-70b',
        name: 'Llama 3.3 70B',
        tier: 'geracao',
        contextWindow: 128000,
        maxOutput: 8192,
        costPer1MInput: 0.40,
        costPer1MOutput: 0.40,
        supportsToolUse: true,
        supportsVision: false,
        supportsStreaming: true,
      },
      {
        id: 'llama-3.1-8b',
        name: 'Llama 3.1 8B',
        tier: 'triagem',
        contextWindow: 128000,
        maxOutput: 8192,
        costPer1MInput: 0.05,
        costPer1MOutput: 0.05,
        supportsToolUse: true,
        supportsVision: false,
        supportsStreaming: true,
      },
    ],
    capabilities: {
      toolUse: true,
      vision: false,
      streaming: true,
      batchAPI: false,
      finetuning: true,
      embeddings: false,
    },
    antiHallucination: {
      temperature: 0.3,
      topP: 0.9,
      systemPromptEnforcement: true,
      groundingRequired: true,
      citationRequired: true,
      maxRetries: 2,
    },
    compliance: {
      lgpdCompliant: true,
      dataResidency: ['self-hosted'],
      encryptionInTransit: true,
      encryptionAtRest: true,
      auditLogging: true,
      sopiCompliant: false,
    },
  },

  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    status: 'planned',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        tier: 'geracao',
        contextWindow: 128000,
        maxOutput: 8192,
        costPer1MInput: 2.00,
        costPer1MOutput: 6.00,
        supportsToolUse: true,
        supportsVision: true,
        supportsStreaming: true,
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        tier: 'triagem',
        contextWindow: 128000,
        maxOutput: 8192,
        costPer1MInput: 0.10,
        costPer1MOutput: 0.30,
        supportsToolUse: true,
        supportsVision: false,
        supportsStreaming: true,
      },
    ],
    capabilities: {
      toolUse: true,
      vision: true,
      streaming: true,
      batchAPI: false,
      finetuning: true,
      embeddings: true,
    },
    antiHallucination: {
      temperature: 0.3,
      topP: 0.9,
      systemPromptEnforcement: true,
      groundingRequired: true,
      citationRequired: true,
      maxRetries: 2,
    },
    compliance: {
      lgpdCompliant: true,
      dataResidency: ['EU'],
      encryptionInTransit: true,
      encryptionAtRest: true,
      auditLogging: true,
      sopiCompliant: false,
    },
  },
}

// ─── Routing Schema ──────────────────────────────────────────────────────────

export const routingConfigSchema = z.object({
  primaryProvider: z.enum(['anthropic', 'openai', 'google', 'meta', 'mistral']),
  fallbackChain: z.array(z.enum(['anthropic', 'openai', 'google', 'meta', 'mistral'])),
  tierRouting: z.object({
    triagem: z.string(),
    geracao: z.string(),
    critico: z.string(),
  }),
  maxLatencyMs: z.number().default(30000),
  retryOnFailure: z.boolean().default(true),
  budgetLimitUSD: z.number().optional(),
})

export type RoutingConfig = z.infer<typeof routingConfigSchema>

/** Default routing configuration for ATA360 */
export const DEFAULT_ROUTING: RoutingConfig = {
  primaryProvider: 'anthropic',
  fallbackChain: ['openai', 'google'],
  tierRouting: {
    triagem: 'claude-haiku-4-5-20251001',
    geracao: 'claude-sonnet-4-5-20250929',
    critico: 'claude-opus-4-6',
  },
  maxLatencyMs: 30000,
  retryOnFailure: true,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getActiveProviders(): ProviderConfig[] {
  return Object.values(AI_PROVIDERS).filter(p => p.status === 'active')
}

export function getFallbackProviders(): ProviderConfig[] {
  return Object.values(AI_PROVIDERS).filter(p => p.status === 'fallback')
}

export function getModelById(modelId: string): { provider: ProviderConfig; model: ProviderModel } | undefined {
  for (const provider of Object.values(AI_PROVIDERS)) {
    const model = provider.models.find(m => m.id === modelId)
    if (model) return { provider, model }
  }
  return undefined
}

export function getModelsForTier(tier: 'triagem' | 'geracao' | 'critico'): Array<{ provider: ProviderConfig; model: ProviderModel }> {
  const results: Array<{ provider: ProviderConfig; model: ProviderModel }> = []
  for (const provider of Object.values(AI_PROVIDERS)) {
    for (const model of provider.models) {
      if (model.tier === tier) results.push({ provider, model })
    }
  }
  return results.sort((a, b) => a.model.costPer1MInput - b.model.costPer1MInput)
}
