/**
 * Schemas Zod — Dashboard Metrics + Publication
 *
 * Tipagem para o dashboard SuperADM e fluxo de publicação.
 *
 * @see workers/src/routes/dashboard.ts
 * @see workers/src/routes/publication.ts
 */
import { z } from 'zod'

// ─── Dashboard KPIs ─────────────────────────────────────────────────────────

export const dashboardKpisSchema = z.object({
  nps_score: z.number(),
  acma_taxa_aprovacao: z.number(),
  acma_total_sugestoes: z.number(),
  auditor_taxa_conformidade: z.number(),
  auditor_total_auditorias: z.number(),
  feedback_total: z.number(),
  feedback_propagados: z.number(),
})
export type DashboardKpis = z.infer<typeof dashboardKpisSchema>

// ─── Dashboard Summary ──────────────────────────────────────────────────────

export const dashboardSummarySchema = z.object({
  total_processos: z.number(),
  total_documentos: z.number(),
  total_usuarios: z.number(),
  total_orgaos: z.number(),
})
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>

// ─── Dashboard Completo ─────────────────────────────────────────────────────

export const dashboardMetricsSchema = z.object({
  kpis: dashboardKpisSchema,
  nps: z.array(z.object({
    mes: z.string(),
    promotores: z.number(),
    neutros: z.number(),
    detratores: z.number(),
    total: z.number(),
    nps: z.number(),
  })),
  fornecedores: z.array(z.object({
    fornecedor_cnpj: z.string(),
    fornecedor_nome: z.string(),
    total_avaliacoes: z.number(),
    nota_media: z.number(),
  })),
  agentes: z.array(z.object({
    agente: z.string(),
    tipo_resposta: z.string().nullable(),
    semana: z.string(),
    total: z.number(),
    nota_media: z.number(),
    taxa_aprovacao: z.number(),
  })),
  artefatos: z.array(z.object({
    tipo_documento: z.string(),
    mes: z.string(),
    total: z.number(),
    nota_media: z.number(),
    aprovados_direto: z.number(),
    aprovados_editados: z.number(),
    rejeitados: z.number(),
  })),
  acma_performance: z.array(z.unknown()),
  auditor_conformidade: z.array(z.unknown()),
  feedback: z.object({
    total: z.number(),
    pendentes: z.number(),
    validados: z.number(),
    propagados: z.number(),
  }),
  segmentos: z.array(z.object({
    segmento: z.string(),
    total: z.number(),
  })),
  comentarios: z.array(z.object({
    nps_score: z.number(),
    nota_geral: z.number(),
    comentario: z.string(),
    created_at: z.string(),
  })),
})
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>

// ─── Publication ────────────────────────────────────────────────────────────

export const publicacaoRequestSchema = z.object({
  processo_id: z.string().uuid(),
  documento_id: z.string().uuid(),
  assinar: z.boolean().default(true),
  carimbar: z.boolean().default(true),
  publicar_pncp: z.boolean().default(false),
})
export type PublicacaoRequest = z.infer<typeof publicacaoRequestSchema>

export const publicacaoEtapaSchema = z.object({
  status: z.enum(['ok', 'erro', 'indisponivel', 'pendente']),
  detalhes: z.unknown().optional(),
})

export const publicacaoResultadoSchema = z.object({
  sucesso: z.boolean(),
  etapas: z.record(z.string(), publicacaoEtapaSchema),
  erros: z.array(z.string()),
})
export type PublicacaoResultado = z.infer<typeof publicacaoResultadoSchema>

export const publicacaoStatusSchema = z.object({
  publicado: z.boolean(),
  data_publicacao: z.string().optional(),
  detalhes: z.unknown().optional(),
})
export type PublicacaoStatus = z.infer<typeof publicacaoStatusSchema>
