/**
 * Avaliações Schemas — Zod schemas para sistema de avaliações.
 *
 * 4 tipos: fornecedores, plataforma, respostas IA, artefatos.
 *
 * @see Colinhacks (Zod) — schema-first, derive types
 */
import { z } from 'zod'

// ─── 1. Avaliação de Fornecedor ────────────────────────────────────────────

export const avaliacaoFornecedorRequestSchema = z.object({
  contrato_numero: z.string().min(1),
  fornecedor_cnpj: z.string().min(11),
  fornecedor_nome: z.string().min(1),
  objeto_contrato: z.string().optional(),
  processo_id: z.string().uuid().optional(),
  nota_fornecedor: z.number().int().min(1).max(5),
  nota_entrega: z.number().int().min(1).max(5),
  nota_qualidade: z.number().int().min(1).max(5),
  nota_relacionamento: z.number().int().min(1).max(5),
  observacao: z.string().optional(),
  recomendaria: z.boolean().optional(),
  periodo_avaliado: z.enum(['mensal', 'trimestral', 'anual', 'encerramento']).optional(),
})

export type AvaliacaoFornecedorRequest = z.infer<typeof avaliacaoFornecedorRequestSchema>

export const avaliacaoFornecedorSchema = avaliacaoFornecedorRequestSchema.extend({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  nota_media: z.number(),
  created_at: z.string(),
})

export type AvaliacaoFornecedor = z.infer<typeof avaliacaoFornecedorSchema>

// ─── 2. Avaliação da Plataforma (saída) ────────────────────────────────────

export const avaliacaoPlataformaRequestSchema = z.object({
  nps_score: z.number().int().min(0).max(10),
  nota_geral: z.number().int().min(1).max(5),
  nota_facilidade: z.number().int().min(1).max(5).optional(),
  nota_velocidade: z.number().int().min(1).max(5).optional(),
  nota_precisao: z.number().int().min(1).max(5).optional(),
  nota_documentos: z.number().int().min(1).max(5).optional(),
  comentario: z.string().optional(),
  sugestao: z.string().optional(),
  duracao_sessao_minutos: z.number().int().optional(),
  documentos_gerados: z.number().int().optional(),
  pesquisas_realizadas: z.number().int().optional(),
  areas_melhoria: z.array(z.enum([
    'velocidade', 'precisao', 'interface', 'documentos', 'chat', 'precos',
    'busca', 'exportacao', 'navegacao', 'outro',
  ])).optional(),
})

export type AvaliacaoPlataformaRequest = z.infer<typeof avaliacaoPlataformaRequestSchema>

export const avaliacaoPlataformaSchema = avaliacaoPlataformaRequestSchema.extend({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  created_at: z.string(),
})

export type AvaliacaoPlataforma = z.infer<typeof avaliacaoPlataformaSchema>

// ─── 3. Avaliação de Resposta IA ───────────────────────────────────────────

export const avaliacaoRespostaRequestSchema = z.object({
  processo_id: z.string().uuid().optional(),
  mensagem_id: z.string().optional(),
  agente: z.enum(['acma', 'auditor', 'insight', 'orquestrador', 'chat']),
  tipo_resposta: z.enum(['sugestao', 'parecer', 'pesquisa', 'documento', 'geral']).optional(),
  nota: z.number().int().min(1).max(5),
  tipo_feedback: z.enum(['util', 'parcial', 'incorreto', 'incompleto', 'excelente']),
  comentario: z.string().optional(),
  correcao_sugerida: z.string().optional(),
})

export type AvaliacaoRespostaRequest = z.infer<typeof avaliacaoRespostaRequestSchema>

export const avaliacaoRespostaSchema = avaliacaoRespostaRequestSchema.extend({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  created_at: z.string(),
})

export type AvaliacaoResposta = z.infer<typeof avaliacaoRespostaSchema>

// ─── 4. Avaliação de Artefato ──────────────────────────────────────────────

export const avaliacaoArtefatoRequestSchema = z.object({
  processo_id: z.string().uuid().optional(),
  documento_id: z.string().uuid().optional(),
  tipo_documento: z.string().min(1),
  versao: z.number().int().default(1),
  nota_geral: z.number().int().min(1).max(5),
  nota_precisao_juridica: z.number().int().min(1).max(5).optional(),
  nota_clareza: z.number().int().min(1).max(5).optional(),
  nota_completude: z.number().int().min(1).max(5).optional(),
  nota_formatacao: z.number().int().min(1).max(5).optional(),
  decisao: z.enum(['aprovado_sem_edicao', 'aprovado_com_edicao', 'rejeitado', 'refeito']),
  percentual_edicao: z.number().min(0).max(1).optional(),
  comentario: z.string().optional(),
  secoes_editadas: z.array(z.string()).optional(),
  iteracao: z.number().int().default(1),
})

export type AvaliacaoArtefatoRequest = z.infer<typeof avaliacaoArtefatoRequestSchema>

export const avaliacaoArtefatoSchema = avaliacaoArtefatoRequestSchema.extend({
  id: z.string().uuid(),
  orgao_id: z.string().uuid(),
  usuario_id: z.string().uuid(),
  created_at: z.string(),
})

export type AvaliacaoArtefato = z.infer<typeof avaliacaoArtefatoSchema>

// ─── Dashboard Stats ───────────────────────────────────────────────────────

export const dashboardAvaliacoesSchema = z.object({
  // NPS
  nps_score: z.number(),
  nps_promotores: z.number(),
  nps_neutros: z.number(),
  nps_detratores: z.number(),
  nps_total: z.number(),
  nps_historico: z.array(z.object({ mes: z.string(), nps: z.number() })),

  // Satisfação geral
  satisfacao_media: z.number(),
  satisfacao_historico: z.array(z.object({ mes: z.string(), nota: z.number() })),

  // Respostas IA
  respostas_positivas_pct: z.number(),
  respostas_negativas_pct: z.number(),
  respostas_por_agente: z.array(z.object({
    agente: z.string(),
    nota_media: z.number(),
    total: z.number(),
    taxa_aprovacao: z.number(),
  })),

  // Fornecedores
  fornecedores_avaliados: z.number(),
  fornecedores_nota_media: z.number(),
  top_fornecedores: z.array(z.object({
    nome: z.string(),
    cnpj: z.string(),
    nota_media: z.number(),
    total_avaliacoes: z.number(),
  })),

  // Artefatos
  artefatos_aprovados_direto_pct: z.number(),
  artefatos_por_tipo: z.array(z.object({
    tipo: z.string(),
    nota_media: z.number(),
    total: z.number(),
    edicao_media: z.number(),
  })),

  // Comentários recentes
  comentarios_recentes: z.array(z.object({
    nota: z.number(),
    texto: z.string(),
    orgao: z.string(),
    tipo: z.string(), // 'plataforma', 'resposta', 'artefato'
    created_at: z.string(),
  })),

  // Sugestões
  sugestoes_total: z.number(),
  sugestoes_implementadas: z.number(),
})

export type DashboardAvaliacoes = z.infer<typeof dashboardAvaliacoesSchema>
