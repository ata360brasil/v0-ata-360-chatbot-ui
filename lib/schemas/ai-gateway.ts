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

// ─── Custos por 1M Tokens (USD, fev/2026) ────────────────────────────────
// Part 19: custos internos NUNCA expostos ao frontend.
// Usados para estimativas internas e otimização de routing.

export const TOKEN_COST_TABLE: Record<string, { input: number; output: number; label: string }> = {
  // Claude (Anthropic) — primários
  [AIModel.HAIKU]:  { input: 0.80, output: 4.00, label: 'Claude Haiku 4.5' },
  [AIModel.SONNET]: { input: 3.00, output: 15.00, label: 'Claude Sonnet 4.5' },
  [AIModel.OPUS]:   { input: 15.00, output: 75.00, label: 'Claude Opus 4.6' },
  // OpenAI — fallback
  [AIModel.GPT4O_MINI]: { input: 0.15, output: 0.60, label: 'GPT-4o Mini' },
  [AIModel.GPT4O]:      { input: 2.50, output: 10.00, label: 'GPT-4o' },
  // Google — fallback
  [AIModel.GEMINI_FLASH]: { input: 0.075, output: 0.30, label: 'Gemini 2.0 Flash' },
  [AIModel.GEMINI_PRO]:   { input: 1.25, output: 5.00, label: 'Gemini 2.0 Pro' },
  // Embedding
  'text-embedding-3-small': { input: 0.02, output: 0, label: 'OpenAI Embedding' },
} as const

/**
 * Custo estimado por operação do ATA360 (USD).
 *
 * Baseado em tokens médios observados por operação:
 *   - ACMA sugestão: ~2K input + ~1K output (seção de documento)
 *   - AUDITOR checklist: ~3K input + ~200 output × N checks
 *   - Insight normalização: ~500 input + ~200 output
 *   - Chat resposta: ~1K input + ~500 output
 *
 * Part 19: NUNCA expor ao frontend.
 */
export const CUSTO_ESTIMADO_POR_OPERACAO = {
  acma_sugestao_haiku: 0.0056,    // 2K×$0.80 + 1K×$4.00 = $5.60/M → ~$0.0056
  acma_sugestao_sonnet: 0.0210,   // 2K×$3.00 + 1K×$15.00 = $21/M → ~$0.021
  acma_sugestao_opus: 0.1050,     // 2K×$15.00 + 1K×$75.00 = $105/M → ~$0.105
  auditor_check_sonnet: 0.0120,   // 3K×$3.00 + 0.2K×$15.00 per check
  auditor_checklist_5: 0.0600,    // ~5 checks × $0.012
  auditor_checklist_7: 0.0840,    // ~7 checks × $0.012
  chat_resposta_haiku: 0.0028,    // 1K×$0.80 + 0.5K×$4.00
  normalizacao_haiku: 0.0005,     // 500×$0.80 + 200×$4.00 (unitário)
  embedding_busca: 0.00002,       // ~1K tokens × $0.02/M
  // Compostos (por artefato completo)
  artefato_simples: 0.09,         // 1 ACMA + 1 AUDITOR(5) + normalizações
  artefato_complexo: 0.18,        // 1 ACMA(sonnet) + 1 AUDITOR(7) + normalizações
  artefato_critico: 0.30,         // 1 ACMA(opus) + 1 AUDITOR(7) + embeds + normalizações
  // Por trilha completa (pregão = 7 docs)
  trilha_pregao_estimada: 0.95,   // 7 artefatos mistos (~$0.14 médio)
  trilha_dispensa_estimada: 0.20, // 2 artefatos
  trilha_arp_estimada: 1.50,      // 14 artefatos
} as const
