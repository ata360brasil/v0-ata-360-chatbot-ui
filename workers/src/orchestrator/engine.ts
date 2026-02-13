/**
 * ATA360 — Orquestrador: State Machine Engine
 *
 * ZERO LLM — lógica puramente determinística.
 * Gerencia transições de estado, validação, limites de iteração,
 * e registro em audit_trail.
 *
 * 12 estados, 5 decisões, mapa de transições válidas.
 *
 * @see Spec v8 Part 20.4 — State Machine
 * @see Spec v8 Part 20.5 — Limites de Iteração
 */

import type {
  ProcessState,
  UserDecision,
  AuditorVerdict,
  TransitionResult,
  ProcessoRow,
  Env,
} from './types'
import { PROCESS_STATES, USER_DECISIONS, AUDITOR_VERDICTS } from './types'

// ─── Valid Transitions Map (Part 20.4) ───────────────────────────────────────

const VALID_TRANSITIONS: Record<ProcessState, ProcessState[]> = {
  RASCUNHO: ['COLETANDO_DADOS', 'DESCARTADO'],
  COLETANDO_DADOS: ['SUGESTAO_ACMA'],
  SUGESTAO_ACMA: ['TEXTO_APROVADO', 'DESCARTADO'],
  TEXTO_APROVADO: ['GERANDO_DOCUMENTO'],
  GERANDO_DOCUMENTO: ['GERADO'],
  GERADO: ['AUDITANDO'],
  AUDITANDO: ['AUDITADO'],
  AUDITADO: ['AGUARDANDO_DECISAO'],
  AGUARDANDO_DECISAO: ['FINALIZADO', 'EDITANDO', 'SUGESTAO_ACMA', 'DESCARTADO'],
  EDITANDO: ['GERANDO_DOCUMENTO'],
  FINALIZADO: [],
  DESCARTADO: [],
}

// ─── Transition Validation ───────────────────────────────────────────────────

/**
 * Verifica se uma transição é válida.
 */
export function canTransition(from: ProcessState, to: ProcessState): boolean {
  const allowed = VALID_TRANSITIONS[from]
  return allowed ? allowed.includes(to) : false
}

/**
 * Executa transição de estado.
 * Valida, persiste no Supabase, registra audit_trail.
 */
export async function transition(
  processoId: string,
  fromState: ProcessState,
  toState: ProcessState,
  env: Env,
  userId?: string,
  detalhes?: Record<string, unknown>,
): Promise<TransitionResult> {
  // 1. Validar transição
  if (!canTransition(fromState, toState)) {
    return {
      sucesso: false,
      estado_anterior: fromState,
      estado_novo: fromState,
      erro: `Transição inválida: ${fromState} → ${toState}`,
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // 2. Atualizar status do processo
  const updateResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        status: toState,
        updated_at: new Date().toISOString(),
      }),
    },
  )

  if (!updateResponse.ok) {
    return {
      sucesso: false,
      estado_anterior: fromState,
      estado_novo: fromState,
      erro: `Falha ao atualizar processo: ${updateResponse.status}`,
    }
  }

  // 3. Registrar no audit_trail
  const auditPayload = {
    processo_id: processoId,
    acao: 'TRANSICAO_ESTADO',
    agente: 'orquestrador',
    estado_anterior: fromState,
    estado_novo: toState,
    hash: crypto.randomUUID(),
    detalhes: {
      ...detalhes,
      timestamp: new Date().toISOString(),
    },
    criado_por: userId || '00000000-0000-0000-0000-000000000000',
  }

  // Precisamos do orgao_id — buscar do processo
  const processoResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}&select=orgao_id`,
    { headers },
  )

  if (processoResponse.ok) {
    const [processo] = await processoResponse.json() as Array<{ orgao_id: string }>
    if (processo) {
      await fetch(`${env.SUPABASE_URL}/rest/v1/audit_trail`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...auditPayload,
          orgao_id: processo.orgao_id,
        }),
      })
    }
  }

  return {
    sucesso: true,
    estado_anterior: fromState,
    estado_novo: toState,
  }
}

// ─── Iteration Limits (Part 20.5) ────────────────────────────────────────────

export interface IterationLimits {
  pode_nova_sugestao: boolean
  pode_reauditar: boolean
  sugestoes_restantes: number
  reauditorias_restantes: number
}

/**
 * Verifica limites de iteração.
 * Max 3 sugestões ACMA por seção, max 5 reauditorias por documento.
 */
export function enforceIterationLimits(processo: ProcessoRow): IterationLimits {
  return {
    pode_nova_sugestao: processo.sugestoes_restantes > 0,
    pode_reauditar: processo.reauditorias_restantes > 0,
    sugestoes_restantes: processo.sugestoes_restantes,
    reauditorias_restantes: processo.reauditorias_restantes,
  }
}

/**
 * Decrementa contadores de iteração no Supabase.
 * Uses compare-and-swap (CAS) via updated_at to prevent race conditions.
 */
export async function decrementarSugestoes(
  processoId: string,
  campo: 'sugestoes_restantes' | 'reauditorias_restantes',
  env: Env,
): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
  }

  // Atomic CAS: read + conditional write with retry
  for (let attempt = 0; attempt < 3; attempt++) {
    // 1. Read current state
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}&select=${campo},iteracao,updated_at`,
      { headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}` } },
    )

    if (!response.ok) return

    const [row] = await response.json() as Array<Record<string, unknown>>
    if (!row) return

    const currentValue = (row[campo] as number) || 0
    const currentUpdatedAt = row.updated_at as string
    const novoValor = Math.max(0, currentValue - 1)

    // 2. Conditional write — only if updated_at hasn't changed (CAS)
    const writeResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}&updated_at=eq.${encodeURIComponent(currentUpdatedAt)}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          [campo]: novoValor,
          iteracao: currentValue > novoValor ? ((row.iteracao as number) || 1) + 1 : undefined,
          updated_at: new Date().toISOString(),
        }),
      },
    )

    if (!writeResponse.ok) continue

    const result = await writeResponse.json() as unknown[]
    if (result.length > 0) return // Success — row was updated

    // CAS failed (another request modified the row), retry
  }
}

// ─── Selo Calculation (mirror de lib/schemas/selo.ts) ─────────────────────────

/**
 * Calcula se selo deve ser aprovado.
 * Mesma lógica de calcularSeloAprovado() em lib/schemas/selo.ts.
 *
 * Part 19.10.3:
 *   CONFORME → selo PRESENTE
 *   RESSALVAS + APROVAR → selo PRESENTE
 *   NAO_CONFORME + PROSSEGUIR → selo AUSENTE (silencioso)
 */
export function calcularSeloAprovado(
  veredicto: AuditorVerdict,
  decisao_usuario: UserDecision | null,
): boolean {
  if (veredicto === AUDITOR_VERDICTS.CONFORME) return true
  if (veredicto === AUDITOR_VERDICTS.RESSALVAS && decisao_usuario === USER_DECISIONS.APROVAR) return true
  return false
}

// ─── Decision Mapping ────────────────────────────────────────────────────────

/**
 * Mapeia decisão do usuário → estado destino.
 * Usado quando estado = AGUARDANDO_DECISAO.
 */
export function mapDecisionToState(
  decisao: UserDecision,
  limites: IterationLimits,
): { estado: ProcessState; erro?: string } {
  switch (decisao) {
    case USER_DECISIONS.APROVAR:
      return { estado: PROCESS_STATES.FINALIZADO }

    case USER_DECISIONS.EDITAR:
      return { estado: PROCESS_STATES.EDITANDO }

    case USER_DECISIONS.NOVA_SUGESTAO:
      if (!limites.pode_nova_sugestao) {
        return {
          estado: PROCESS_STATES.AGUARDANDO_DECISAO,
          erro: `Limite de sugestões atingido (máx. 3). Restam ${limites.sugestoes_restantes}.`,
        }
      }
      return { estado: PROCESS_STATES.SUGESTAO_ACMA }

    case USER_DECISIONS.PROSSEGUIR:
      return { estado: PROCESS_STATES.FINALIZADO }

    case USER_DECISIONS.DESCARTAR:
      return { estado: PROCESS_STATES.DESCARTADO }

    default:
      return {
        estado: PROCESS_STATES.AGUARDANDO_DECISAO,
        erro: `Decisão desconhecida: ${decisao}`,
      }
  }
}

// ─── Process Loader ──────────────────────────────────────────────────────────

/**
 * Carrega processo completo do Supabase.
 */
export async function loadProcesso(
  processoId: string,
  env: Env,
): Promise<ProcessoRow | null> {
  const headers = {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}&select=*`,
    { headers },
  )

  if (!response.ok) return null

  const [processo] = await response.json() as ProcessoRow[]
  return processo || null
}

/**
 * Atualiza campos do processo no Supabase.
 */
export async function updateProcesso(
  processoId: string,
  fields: Partial<ProcessoRow>,
  env: Env,
): Promise<boolean> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/processos?id=eq.${encodeURIComponent(processoId)}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        ...fields,
        updated_at: new Date().toISOString(),
      }),
    },
  )

  return response.ok
}

// ─── Message Persistence ─────────────────────────────────────────────────────

/**
 * Salva mensagem no processo_mensagens.
 */
export async function saveMessage(
  processoId: string,
  orgaoId: string,
  role: string,
  content: string,
  estado: ProcessState,
  env: Env,
  extras?: {
    artefato?: Record<string, unknown>
    insight_cards?: unknown[]
    agente?: string
    metadata?: Record<string, unknown>
  },
): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=minimal',
  }

  await fetch(`${env.SUPABASE_URL}/rest/v1/processo_mensagens`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      processo_id: processoId,
      orgao_id: orgaoId,
      role,
      content,
      estado_no_momento: estado,
      artefato: extras?.artefato || null,
      insight_cards: extras?.insight_cards || null,
      agente: extras?.agente || null,
      metadata: extras?.metadata || {},
    }),
  })
}
