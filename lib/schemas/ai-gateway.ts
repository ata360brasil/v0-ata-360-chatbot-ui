/**
 * AI Gateway Schemas — Cloudflare AI Gateway multi-model routing.
 *
 * Camadas de custo (reduzir token spend):
 *   Haiku 80% — triagem, classificação, extração simples
 *   Sonnet 15% — geração de texto, análise complexa
 *   Opus 5% — jurisprudência, decisões críticas, revisão final
 *
 * @see Cloudflare AI Gateway — multi-model routing
 * @see Spec v8 Part 11 — IA Agnostic Strategy
 */
import { z } from 'zod'

// ─── Model Tiers ───────────────────────────────────────────────────────────

export const AIModel = {
  // Claude (primário)
  HAIKU: 'claude-haiku-4-5-20251001',
  SONNET: 'claude-sonnet-4-5-20250929',
  OPUS: 'claude-opus-4-6',
  // Fallback (secundário)
  GPT4O_MINI: 'gpt-4o-mini',
  GPT4O: 'gpt-4o',
  GEMINI_FLASH: 'gemini-2.0-flash',
  GEMINI_PRO: 'gemini-2.0-pro',
} as const

export type AIModel = (typeof AIModel)[keyof typeof AIModel]

export const AITier = {
  TRIAGEM: 'TRIAGEM',     // Haiku 80%: classificação, extração, lookup
  GERACAO: 'GERACAO',     // Sonnet 15%: sugestões ACMA, análise
  CRITICO: 'CRITICO',     // Opus 5%: jurisprudência, revisão final
} as const

export type AITier = (typeof AITier)[keyof typeof AITier]

// Map tier → model (primário + fallback)
export const TIER_MODELS: Record<AITier, { primary: AIModel; fallback: AIModel }> = {
  TRIAGEM: { primary: 'claude-haiku-4-5-20251001', fallback: 'gpt-4o-mini' },
  GERACAO: { primary: 'claude-sonnet-4-5-20250929', fallback: 'gpt-4o' },
  CRITICO: { primary: 'claude-opus-4-6', fallback: 'gemini-2.0-pro' },
}

// ─── AI Gateway Request/Response ────────────────────────────────────────────

export const aiRequestSchema = z.object({
  tier: z.nativeEnum(AITier),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
  max_tokens: z.number().optional(),
  temperature: z.number().min(0).max(1).optional(),
  // ACMA blindagem: 8 camadas (spec 08, Section 9.2)
  blindagem: z.object({
    camada: z.number().min(1).max(8),
    contexto_legal: z.boolean(),
    revisao_humana_obrigatoria: z.boolean(),
  }).optional(),
})

export type AIRequest = z.infer<typeof aiRequestSchema>

export const aiResponseSchema = z.object({
  content: z.string(),
  model_used: z.string(),
  tier: z.nativeEnum(AITier),
  tokens: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
  }),
  latency_ms: z.number(),
  cached: z.boolean(),
})

export type AIResponse = z.infer<typeof aiResponseSchema>

// ─── Embedding (busca semântica) ────────────────────────────────────────────

export const EMBEDDING_MODEL = 'text-embedding-3-small' as const

export const embeddingRequestSchema = z.object({
  texto: z.string().max(8192),
  tipo: z.enum(['catmat', 'jurisprudencia', 'normativo', 'processo']),
})

export type EmbeddingRequest = z.infer<typeof embeddingRequestSchema>
