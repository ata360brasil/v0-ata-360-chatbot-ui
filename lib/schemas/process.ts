/**
 * Process Schemas — Zod schemas para processos licitatorios.
 *
 * Fonte de verdade: spec v8 Part 8 (data model) + Part 20.4 (state machine).
 * Tipos TypeScript derivados via z.infer<> (Colinhacks best practice).
 *
 * @see Colinhacks (Zod) — schema-first, derive types
 * @see Bill Luo (React Hook Form) — resolver pattern
 */
import { z } from 'zod'

// ─── Process States (Part 20.4 — State Machine) ────────────────────────────

export const ProcessState = {
  RASCUNHO: 'RASCUNHO',
  COLETANDO_DADOS: 'COLETANDO_DADOS',
  SUGESTAO_ACMA: 'SUGESTAO_ACMA',
  TEXTO_APROVADO: 'TEXTO_APROVADO',
  GERANDO_DOCUMENTO: 'GERANDO_DOCUMENTO',
  GERADO: 'GERADO',
  AUDITANDO: 'AUDITANDO',
  AUDITADO: 'AUDITADO',
  AGUARDANDO_DECISAO: 'AGUARDANDO_DECISAO',
  EDITANDO: 'EDITANDO',
  FINALIZADO: 'FINALIZADO',
  DESCARTADO: 'DESCARTADO',
} as const

export type ProcessState = (typeof ProcessState)[keyof typeof ProcessState]

export const processStateSchema = z.nativeEnum(ProcessState)

// ─── Process Phases (Part 8 — Fases Legais Lei 14.133) ─────────────────────

export const ProcessPhase = {
  PLANEJAMENTO: 'planejamento',
  INSTRUCAO: 'instrucao',
  SELECAO: 'selecao',
  CONTRATACAO: 'contratacao',
  EXECUCAO: 'execucao',
  ALTERACAO: 'alteracao',
  SANCAO: 'sancao',
  ENCERRAMENTO: 'encerramento',
} as const

export type ProcessPhase = (typeof ProcessPhase)[keyof typeof ProcessPhase]

// ─── Simplified Visual Phases (Frontend Stepper) ────────────────────────────

export const VisualStep = {
  RASCUNHO: { label: 'Rascunho', description: 'Você está escrevendo' },
  SUGESTAO: { label: 'Sugestão IA', description: 'IA analisando' },
  TEXTO_APROVADO: { label: 'Texto aprovado', description: 'Você confirmou o conteúdo' },
  GERADO: { label: 'Documento gerado', description: 'PDF pronto' },
  AUDITADO: { label: 'Auditado', description: 'Verificação concluída' },
  DECISAO: { label: 'Sua decisão', description: 'Falta sua aprovação' },
  FINALIZADO: { label: 'Finalizado', description: 'Assinado e publicado' },
} as const

// Map full states → visual steps
export function stateToVisualStep(state: ProcessState): keyof typeof VisualStep {
  switch (state) {
    case 'RASCUNHO':
    case 'COLETANDO_DADOS':
      return 'RASCUNHO'
    case 'SUGESTAO_ACMA':
      return 'SUGESTAO'
    case 'TEXTO_APROVADO':
    case 'EDITANDO':
      return 'TEXTO_APROVADO'
    case 'GERANDO_DOCUMENTO':
    case 'GERADO':
      return 'GERADO'
    case 'AUDITANDO':
    case 'AUDITADO':
      return 'AUDITADO'
    case 'AGUARDANDO_DECISAO':
      return 'DECISAO'
    case 'FINALIZADO':
    case 'DESCARTADO':
      return 'FINALIZADO'
  }
}

// ─── User Decisions (Part 20.3 passo 6) ─────────────────────────────────────

export const UserDecision = {
  APROVAR: 'APROVAR',
  EDITAR: 'EDITAR',
  NOVA_SUGESTAO: 'NOVA_SUGESTAO',
  PROSSEGUIR: 'PROSSEGUIR',
  DESCARTAR: 'DESCARTAR',
} as const

export type UserDecision = (typeof UserDecision)[keyof typeof UserDecision]

export const userDecisionSchema = z.nativeEnum(UserDecision)

// ─── Auditor Result (Part 20.13 — tripartição) ──────────────────────────────

export const AuditorVerdict = {
  CONFORME: 'CONFORME',
  NAO_CONFORME: 'NAO_CONFORME',
  RESSALVAS: 'RESSALVAS',
} as const

export type AuditorVerdict = (typeof AuditorVerdict)[keyof typeof AuditorVerdict]

export const auditorCheckItemSchema = z.object({
  id: z.string(),
  descricao: z.string(),
  conforme: z.boolean(),
  achado: z.string().nullable(),
  fundamentacao: z.string().nullable(),
})

export const auditorResultSchema = z.object({
  veredicto: z.nativeEnum(AuditorVerdict),
  score: z.number().min(0).max(100),
  checklist: z.array(auditorCheckItemSchema),
  selo_aprovado: z.boolean(),
  iteracao: z.number(),
  timestamp: z.string(),
})

export type AuditorCheckItem = z.infer<typeof auditorCheckItemSchema>
export type AuditorResult = z.infer<typeof auditorResultSchema>

// ─── Document Types (Part 18 — Catálogo de Artefatos) ───────────────────────

export const ArtifactType = {
  PCA: 'PCA', DFD: 'DFD', ETP: 'ETP', PP: 'PP', TR: 'TR',
  MR: 'MR', JCD: 'JCD', ARP: 'ARP', OFG: 'OFG', AUG: 'AUG',
  OFF: 'OFF', ACF: 'ACF', COM: 'COM', REC: 'REC',
  // P0 novos
  CDF: 'CDF', ALF: 'ALF', ALP: 'ALP', ALV: 'ALV', RPP: 'RPP', PAU: 'PAU',
} as const

export type ArtifactType = (typeof ArtifactType)[keyof typeof ArtifactType]

// ─── Process Current State (for AppContext) ─────────────────────────────────

export const currentProcessSchema = z.object({
  id: z.string(),
  numero: z.string(),
  objeto: z.string(),
  estado: processStateSchema,
  iteracao: z.number(),
  documento_tipo: z.string().nullable(),
  parecer_auditor: auditorResultSchema.nullable(),
  selo_aprovado: z.boolean(),
  proximo_sugerido: z.string().nullable(),
  sugestoes_restantes: z.number(),
  reauditorias_restantes: z.number(),
})

export type CurrentProcess = z.infer<typeof currentProcessSchema>

// ─── Process Document Trail (Part 20.8) ─────────────────────────────────────

export const documentTrailSchema = z.object({
  tipo: z.string(),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'pulado']),
  versao: z.number().nullable(),
  hash: z.string().nullable(),
})

export type DocumentTrail = z.infer<typeof documentTrailSchema>
