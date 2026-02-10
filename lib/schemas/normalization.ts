/**
 * Normalization Schemas — Zod schemas para endpoint de normalização.
 *
 * Fonte de verdade: Spec v8 Part 16 (normalização linguística).
 * Tipos TypeScript derivados via z.infer<> (Colinhacks best practice).
 *
 * @see Colinhacks (Zod) — schema-first, derive types
 */
import { z } from 'zod'

// ─── Enums ─────────────────────────────────────────────────────────────────

export const CamadaNome = z.enum([
  'tokenize',
  'abreviatura',
  'sinonimo',
  'regional',
  'marca',
  'glossario',
  'semantico',
])
export type CamadaNome = z.infer<typeof CamadaNome>

export const SetorOrgao = z.enum([
  'SAUDE', 'TI', 'EDUCACAO', 'OBRAS', 'ESCRITORIO',
  'VEICULOS', 'LIMPEZA', 'EPI', 'ALIMENTOS', 'MEDICAMENTOS',
  'SERVICOS', 'COMBUSTIVEL', 'ENERGIA', 'GERAL',
])
export type SetorOrgao = z.infer<typeof SetorOrgao>

export const UF = z.enum([
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
])
export type UF = z.infer<typeof UF>

export const AlertaTipo = z.enum([
  'marca_detectada',
  'termo_ambiguo',
  'regionalismo',
  'codigo_obsoleto',
  'medicamento_dcb',
])
export type AlertaTipo = z.infer<typeof AlertaTipo>

export const CatmatFonte = z.enum([
  'D1_FTS',
  'VECTORIZE',
  'EXACT_MATCH',
])
export type CatmatFonte = z.infer<typeof CatmatFonte>

// ─── Request ───────────────────────────────────────────────────────────────

export const normalizeRequestSchema = z.object({
  texto: z.string().min(2, 'Texto deve ter no mínimo 2 caracteres').max(5000, 'Texto excede 5000 caracteres'),
  setor_orgao: SetorOrgao.optional(),
  regiao_uf: UF.optional(),
  incluir_catmat: z.boolean().default(true),
  incluir_precos: z.boolean().default(false),
})

export type NormalizeRequest = z.infer<typeof normalizeRequestSchema>

// ─── Pipeline Step ─────────────────────────────────────────────────────────

export const pipelineStepSchema = z.object({
  camada: CamadaNome,
  texto_entrada: z.string(),
  texto_saida: z.string(),
  transformacao: z.string().nullable(),
  confianca: z.number().min(0).max(1),
  detalhes: z.record(z.unknown()).optional(),
})

export type PipelineStep = z.infer<typeof pipelineStepSchema>

// ─── CATMAT Sugestão ───────────────────────────────────────────────────────

export const catmatSugestaoSchema = z.object({
  codigo: z.string(),
  tipo: z.enum(['catmat', 'catser']),
  descricao: z.string(),
  assertividade: z.number().min(0).max(1),
  fonte: CatmatFonte,
})

export type CatmatSugestao = z.infer<typeof catmatSugestaoSchema>

// ─── Alerta ────────────────────────────────────────────────────────────────

export const normalizacaoAlertaSchema = z.object({
  tipo: AlertaTipo,
  mensagem: z.string(),
  sugestao: z.string().nullable(),
  base_legal: z.string().optional(),
})

export type NormalizacaoAlerta = z.infer<typeof normalizacaoAlertaSchema>

// ─── Response ──────────────────────────────────────────────────────────────

export const normalizeResponseSchema = z.object({
  texto_original: z.string(),
  texto_normalizado: z.string(),
  pipeline_aplicado: z.array(pipelineStepSchema),
  catmat_sugeridos: z.array(catmatSugestaoSchema),
  alertas: z.array(normalizacaoAlertaSchema),
  cache_hit: z.boolean(),
  duracao_ms: z.number(),
})

export type NormalizeResponse = z.infer<typeof normalizeResponseSchema>

// ─── Health Check ──────────────────────────────────────────────────────────

export const normalizeHealthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  d1_termos: z.number().optional(),
  vectorize: z.boolean().optional(),
  ai_gateway: z.boolean().optional(),
  message: z.string().optional(),
})

export type NormalizeHealth = z.infer<typeof normalizeHealthSchema>
