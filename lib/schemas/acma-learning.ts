/**
 * Schemas Zod — ACMA Learning + AUDITOR Calibration
 *
 * Tipagem para:
 * - acma_sugestoes (rastreamento de sugestoes + decisao usuario)
 * - acma_prompt_versoes (versionamento de prompts)
 * - acma_padroes_edicao (padroes de edicao recorrentes)
 * - auditor_resultados (resultado auditoria + decisao)
 * - auditor_thresholds (pesos calibrados por check item)
 *
 * Part 19: prompt_template, pesos, scores NUNCA expostos ao frontend.
 *
 * @see Spec v8 Part 08 — ACMA Agent
 * @see Spec v8 Part 07 — AUDITOR Agent
 */
import { z } from 'zod'

// ─── ACMA Sugestoes ─────────────────────────────────────────────────────────

export const acmaDecisaoEnum = z.enum([
  'APROVAR',
  'EDITAR',
  'NOVA_SUGESTAO',
  'DESCARTAR',
])
export type AcmaDecisao = z.infer<typeof acmaDecisaoEnum>

export const acmaTierEnum = z.enum(['haiku', 'sonnet', 'opus'])
export type AcmaTier = z.infer<typeof acmaTierEnum>

export const acmaSugestaoRequestSchema = z.object({
  processo_id: z.string().uuid(),
  documento_tipo: z.string().min(2).max(10),
  secao: z.string().min(2).max(50),
  texto_sugerido: z.string().min(1).max(50000),
  texto_final: z.string().min(1).max(50000).optional(),
  decisao: acmaDecisaoEnum,
  rating: z.number().int().min(1).max(5).optional(),
  modelo_usado: z.string().optional(),
  tier: acmaTierEnum.optional(),
  iteracao: z.number().int().min(1).max(3).default(1),
})
export type AcmaSugestaoRequest = z.infer<typeof acmaSugestaoRequestSchema>

export const editDeltaSchema = z.object({
  edit_distance: z.number().int().min(0),
  edit_ratio: z.number().min(0).max(1),
  diferencas: z.object({
    adicionadas: z.array(z.string()),
    removidas: z.array(z.string()),
    alteradas: z.array(z.object({
      original: z.string(),
      corrigido: z.string(),
    })),
    total_palavras_original: z.number().int(),
    total_palavras_final: z.number().int(),
  }),
})
export type EditDelta = z.infer<typeof editDeltaSchema>

export const acmaSugestaoSchema = z.object({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  processo_id: z.string().uuid(),
  documento_tipo: z.string(),
  secao: z.string(),
  decisao: acmaDecisaoEnum,
  edit_distance: z.number().int().nullable(),
  edit_ratio: z.number().nullable(),
  rating: z.number().int().min(1).max(5).nullable(),
  setor: z.string().nullable(),
  iteracao: z.number().int(),
  latency_ms: z.number().int().nullable(),
  created_at: z.string(),
})
export type AcmaSugestao = z.infer<typeof acmaSugestaoSchema>

// ─── ACMA Performance (view) ───────────────────────────────────────────────

export const acmaPerformanceSchema = z.object({
  documento_tipo: z.string(),
  secao: z.string(),
  semana: z.string(),
  total_sugestoes: z.number().int(),
  aprovadas: z.number().int(),
  editadas: z.number().int(),
  descartadas: z.number().int(),
  taxa_aprovacao: z.number(),
  edit_ratio_medio: z.number(),
  rating_medio: z.number().nullable(),
})
export type AcmaPerformance = z.infer<typeof acmaPerformanceSchema>

// ─── ACMA Padroes Edicao ───────────────────────────────────────────────────

export const acmaPadraoEdicaoSchema = z.object({
  id: z.string().uuid(),
  documento_tipo: z.string(),
  secao: z.string(),
  padrao_original: z.string(),
  padrao_corrigido: z.string(),
  frequencia: z.number().int(),
  confianca: z.number(),
  setores: z.array(z.string()).nullable(),
  ativo: z.boolean(),
  created_at: z.string(),
})
export type AcmaPadraoEdicao = z.infer<typeof acmaPadraoEdicaoSchema>

// ─── AUDITOR Resultados ────────────────────────────────────────────────────

export const auditorVeredictEnum = z.enum([
  'CONFORME',
  'RESSALVAS',
  'NAO_CONFORME',
])
export type AuditorVeredict = z.infer<typeof auditorVeredictEnum>

export const auditorDecisaoEnum = z.enum([
  'APROVAR',
  'EDITAR',
  'PROSSEGUIR',
  'DESCARTAR',
])
export type AuditorDecisao = z.infer<typeof auditorDecisaoEnum>

export const auditorResultadoRequestSchema = z.object({
  processo_id: z.string().uuid(),
  documento_tipo: z.string().min(2).max(10),
  veredicto: auditorVeredictEnum,
  score: z.number().int().min(0).max(100),
  checklist: z.array(z.object({
    id: z.string(),
    descricao: z.string(),
    conforme: z.boolean(),
    achado: z.string().nullable(),
    severidade: z.string().optional(),
  })),
  selo_aprovado: z.boolean(),
  decisao_usuario: auditorDecisaoEnum.optional(),
  setor: z.string().optional(),
  iteracao: z.number().int().min(1).max(5).default(1),
})
export type AuditorResultadoRequest = z.infer<typeof auditorResultadoRequestSchema>

export const auditorResultadoSchema = z.object({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  processo_id: z.string().uuid(),
  documento_tipo: z.string(),
  veredicto: auditorVeredictEnum,
  score: z.number().int(),
  selo_aprovado: z.boolean(),
  decisao_usuario: z.string().nullable(),
  setor: z.string().nullable(),
  iteracao: z.number().int(),
  created_at: z.string(),
})
export type AuditorResultado = z.infer<typeof auditorResultadoSchema>

// ─── AUDITOR Conformidade (view) ───────────────────────────────────────────

export const auditorConformidadeSchema = z.object({
  documento_tipo: z.string(),
  setor: z.string().nullable(),
  mes: z.string(),
  total_auditorias: z.number().int(),
  conformes: z.number().int(),
  ressalvas: z.number().int(),
  nao_conformes: z.number().int(),
  taxa_conformidade: z.number(),
  score_medio: z.number(),
  selos_aprovados: z.number().int(),
})
export type AuditorConformidade = z.infer<typeof auditorConformidadeSchema>

// ─── Dashboard ACMA/AUDITOR ────────────────────────────────────────────────

export const dashboardAgentesSchema = z.object({
  acma_performance: z.array(acmaPerformanceSchema),
  acma_padroes: z.array(acmaPadraoEdicaoSchema),
  auditor_conformidade: z.array(auditorConformidadeSchema),
})
export type DashboardAgentes = z.infer<typeof dashboardAgentesSchema>

// ─── Rating Request ────────────────────────────────────────────────────────

export const ratingRequestSchema = z.object({
  sugestao_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
})
export type RatingRequest = z.infer<typeof ratingRequestSchema>
