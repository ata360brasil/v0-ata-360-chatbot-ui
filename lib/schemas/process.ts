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
  // 14 existentes (v7.1 Monostate)
  PCA: 'PCA', DFD: 'DFD', ETP: 'ETP', PP: 'PP', TR: 'TR',
  MR: 'MR', JCD: 'JCD', ARP: 'ARP', OFG: 'OFG', AUG: 'AUG',
  OFF: 'OFF', ACF: 'ACF', COM: 'COM', REC: 'REC',
  // 6 P0 novos (YAML pronto, zero codigo)
  CDF: 'CDF', ALF: 'ALF', ALP: 'ALP', ALV: 'ALV', RPP: 'RPP', PAU: 'PAU',
  // 11 P1 (YAML pendente, 3-5 endpoints)
  EDL: 'EDL', MIN: 'MIN', PJU: 'PJU', CTR: 'CTR', OSD: 'OSD',
  DFI: 'DFI', TAR: 'TAR', RFI: 'RFI', RAC: 'RAC', DRC: 'DRC', RRE: 'RRE',
} as const

export type ArtifactType = (typeof ArtifactType)[keyof typeof ArtifactType]

// Trilha de documentos por modalidade (Part 20.8)
export const TRILHA_DOCUMENTOS: Record<string, ArtifactType[]> = {
  pregao: ['PCA', 'DFD', 'ETP', 'PP', 'TR', 'MR', 'JCD'],
  dispensa: ['DFD', 'JCD'],
  arp: ['PCA', 'DFD', 'ETP', 'PP', 'TR', 'MR', 'JCD', 'OFG', 'AUG', 'OFF', 'ACF', 'COM', 'REC', 'ARP'],
  credenciamento: ['DFD', 'ETP', 'TR', 'EDL'],
}

// ─── Normativos Aplicáveis ─────────────────────────────────────────────────

export const Normativo = {
  LEI_14133: 'Lei 14.133/2021',
  DEC_12807: 'Dec. 12.807/2025',
  DEC_11878: 'Dec. 11.878/2024',
  IN_SEGES_75: 'IN SEGES 75/2024',
  IN_SEGES_52: 'IN SEGES/MGI 52/2025',
  IN_SGD_94: 'IN SGD 94/2022',
  MANUAL_TCU_5: 'Manual TCU 5ª Ed. (2025)',
  LINDB: 'Lei 13.655/2018 (LINDB)',
  LGPD: 'Lei 13.709/2018 (LGPD)',
  DEC_7746: 'Dec. 7.746/2012',
  DEC_10947: 'Dec. 10.947/2022',
} as const

export type Normativo = (typeof Normativo)[keyof typeof Normativo]

// Quais normativos se aplicam a cada artefato
export const NORMATIVOS_POR_ARTEFATO: Partial<Record<ArtifactType, Normativo[]>> = {
  DFD: ['Lei 14.133/2021', 'Dec. 10.947/2022'],
  ETP: ['Lei 14.133/2021', 'Dec. 12.807/2025', 'Lei 13.655/2018 (LINDB)', 'IN SEGES 75/2024', 'Dec. 7.746/2012'],
  PP: ['Lei 14.133/2021', 'Dec. 12.807/2025', 'IN SEGES/MGI 52/2025'],
  TR: ['Lei 14.133/2021', 'IN SEGES/MGI 52/2025'],
  JCD: ['Lei 14.133/2021', 'Dec. 12.807/2025', 'Lei 13.655/2018 (LINDB)', 'Dec. 11.878/2024'],
  MR: ['Lei 14.133/2021', 'Lei 13.655/2018 (LINDB)'],
}

// ─── LINDB (Lei 13.655/2018) — Proteção do Gestor ──────────────────────────

export const LINDB_ARTIGOS = {
  ART_20: { artigo: 'Art. 20', ementa: 'Decisões com base em consequências práticas' },
  ART_21: { artigo: 'Art. 21', ementa: 'Regime de transição proporcional' },
  ART_22: { artigo: 'Art. 22', ementa: 'Consideração de dificuldades reais do gestor' },
  ART_23: { artigo: 'Art. 23', ementa: 'Regime de transição para mudanças de lei' },
  ART_28: { artigo: 'Art. 28', ementa: 'Responsabilização pessoal só com dolo/erro grosseiro' },
  ART_30: { artigo: 'Art. 30', ementa: 'Compensação por invalidade retroativa' },
} as const

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
