/**
 * Feedback Schemas — Zod schemas para feedback de normalização + perfil.
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 * @see Colinhacks (Zod) — schema-first, derive types
 */
import { z } from 'zod'

// ─── Feedback de Termos ────────────────────────────────────────────────────

export const feedbackTipoSchema = z.enum([
  'correcao_termo',
  'correcao_catmat',
  'aprovacao',
  'rejeicao',
])

export type FeedbackTipo = z.infer<typeof feedbackTipoSchema>

export const feedbackStatusSchema = z.enum([
  'pendente',
  'validado',
  'propagado',
  'rejeitado',
])

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>

export const feedbackTermoRequestSchema = z.object({
  processo_id: z.string().uuid().optional(),
  termo_original: z.string().min(1, 'Termo original é obrigatório'),
  termo_normalizado_sistema: z.string().min(1, 'Termo normalizado é obrigatório'),
  catmat_sugerido_sistema: z.string().optional(),
  termo_corrigido_usuario: z.string().optional(),
  catmat_corrigido_usuario: z.string().optional(),
  tipo_feedback: feedbackTipoSchema,
  setor: z.string().optional(),
  regiao_uf: z.string().length(2).optional(),
  confianca_original: z.number().min(0).max(1).optional(),
})

export type FeedbackTermoRequest = z.infer<typeof feedbackTermoRequestSchema>

export const feedbackTermoSchema = z.object({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  processo_id: z.string().uuid().nullable(),
  termo_original: z.string(),
  termo_normalizado_sistema: z.string(),
  catmat_sugerido_sistema: z.string().nullable(),
  termo_corrigido_usuario: z.string().nullable(),
  catmat_corrigido_usuario: z.string().nullable(),
  tipo_feedback: feedbackTipoSchema,
  setor: z.string().nullable(),
  regiao_uf: z.string().nullable(),
  status: feedbackStatusSchema,
  confianca_original: z.number().nullable(),
  created_at: z.string(),
})

export type FeedbackTermo = z.infer<typeof feedbackTermoSchema>

// ─── Feedback Stats ────────────────────────────────────────────────────────

export const feedbackStatsSchema = z.object({
  total: z.number(),
  pendentes: z.number(),
  validados: z.number(),
  propagados: z.number(),
  rejeitados: z.number(),
  top_correcoes: z.array(z.object({
    termo_original: z.string(),
    termo_corrigido: z.string(),
    total_usuarios: z.number(),
  })),
})

export type FeedbackStats = z.infer<typeof feedbackStatsSchema>

// ─── Perfil de Usuário ─────────────────────────────────────────────────────

export const perfilUsuarioSchema = z.object({
  id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  segmento_principal: z.string().nullable(),
  segmentos_secundarios: z.array(z.string()).nullable(),
  termos_frequentes: z.array(z.object({
    termo: z.string(),
    contagem: z.number(),
  })).default([]),
  catmat_frequentes: z.array(z.object({
    codigo: z.string(),
    descricao: z.string(),
    contagem: z.number(),
  })).default([]),
  preferencias_terminologia: z.record(z.string()).default({}),
  regiao_uf: z.string().nullable(),
  porte_orgao: z.string().nullable(),
  taxa_aprovacao_acma: z.number().nullable(),
  taxa_edicao_media: z.number().nullable(),
  temas_recorrentes: z.array(z.string()).nullable(),
  documentos_mais_gerados: z.array(z.string()).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type PerfilUsuario = z.infer<typeof perfilUsuarioSchema>

// Perfil editável pelo usuário (preferências explícitas)
export const perfilUpdateSchema = z.object({
  segmento_principal: z.string().optional(),
  regiao_uf: z.string().length(2).optional(),
  preferencias_terminologia: z.record(z.string()).optional(),
})

export type PerfilUpdate = z.infer<typeof perfilUpdateSchema>
