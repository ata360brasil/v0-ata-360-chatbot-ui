/**
 * ATA360 — Orquestrador: Document Trail Progression
 *
 * Gerencia a trilha de documentos por modalidade.
 * Pregão = 7 docs, ARP = 14 docs, Dispensa = 2 docs.
 * Cada documento passa pelo ciclo completo antes de avançar.
 *
 * Ao finalizar um documento:
 * - Marca como 'concluido' com hash e versão
 * - Avança para o próximo
 * - Reseta contadores de iteração
 *
 * @see Spec v8 Part 20.8 — Trilha de Documentos
 * @see lib/schemas/process.ts — TRILHA_DOCUMENTOS
 */

import type { DocumentTrailItem, ProcessoRow, Env } from './types'
import { TRILHA_DOCUMENTOS } from './types'
import { loadProcesso, updateProcesso } from './engine'

// ─── Initialize Trail ────────────────────────────────────────────────────────

/**
 * Cria trilha de documentos com base na modalidade.
 */
export function initializeTrail(modalidade: string): DocumentTrailItem[] {
  const tipos = TRILHA_DOCUMENTOS[modalidade] || TRILHA_DOCUMENTOS['pregao']

  return tipos.map((tipo, index) => ({
    tipo,
    status: index === 0 ? 'em_andamento' : 'pendente',
    versao: null,
    hash: null,
    selo_aprovado: null,
    finalizado_em: null,
  }))
}

// ─── Advance Trail ───────────────────────────────────────────────────────────

/**
 * Finaliza documento atual e avança para o próximo.
 * Retorna o próximo tipo de documento ou null se trilha completa.
 */
export async function advanceTrail(
  processoId: string,
  env: Env,
): Promise<{ proximo: string | null; posicao: number }> {
  const processo = await loadProcesso(processoId, env)
  if (!processo) return { proximo: null, posicao: 0 }

  const trilha = [...(processo.trilha || [])]
  const posicaoAtual = processo.trilha_posicao

  // Marcar documento atual como concluído
  if (trilha[posicaoAtual]) {
    trilha[posicaoAtual] = {
      ...trilha[posicaoAtual],
      status: 'concluido',
      versao: processo.documento_versao,
      hash: processo.documento_hash,
      selo_aprovado: processo.selo_aprovado,
      finalizado_em: new Date().toISOString(),
    }
  }

  // Avançar para próximo
  const novaPosicao = posicaoAtual + 1

  if (novaPosicao < trilha.length) {
    // Marcar próximo como em_andamento
    trilha[novaPosicao] = {
      ...trilha[novaPosicao],
      status: 'em_andamento',
    }

    // Atualizar trilha no processo
    await updateProcesso(processoId, {
      trilha,
      trilha_posicao: novaPosicao,
      proximo_sugerido: trilha[novaPosicao].tipo,
    } as Partial<ProcessoRow>, env)

    return {
      proximo: trilha[novaPosicao].tipo,
      posicao: novaPosicao,
    }
  }

  // Trilha completa
  await updateProcesso(processoId, {
    trilha,
    proximo_sugerido: null,
  } as Partial<ProcessoRow>, env)

  return { proximo: null, posicao: novaPosicao }
}

// ─── Get Trail Status ────────────────────────────────────────────────────────

/**
 * Retorna status completo da trilha.
 */
export async function getTrailStatus(
  processoId: string,
  env: Env,
): Promise<DocumentTrailItem[]> {
  const processo = await loadProcesso(processoId, env)
  if (!processo) return []
  return processo.trilha || []
}

// ─── Skip Document ───────────────────────────────────────────────────────────

/**
 * Pula um documento na trilha (marca como 'pulado').
 * Usado quando documento não se aplica à modalidade.
 */
export async function skipDocument(
  processoId: string,
  tipo: string,
  env: Env,
): Promise<boolean> {
  const processo = await loadProcesso(processoId, env)
  if (!processo) return false

  const trilha = [...(processo.trilha || [])]
  const index = trilha.findIndex(d => d.tipo === tipo && d.status === 'pendente')

  if (index === -1) return false

  trilha[index] = {
    ...trilha[index],
    status: 'pulado',
    finalizado_em: new Date().toISOString(),
  }

  await updateProcesso(processoId, { trilha } as Partial<ProcessoRow>, env)
  return true
}

// ─── Trail Statistics ────────────────────────────────────────────────────────

export interface TrailStats {
  total: number
  concluidos: number
  pendentes: number
  em_andamento: number
  pulados: number
  progresso_percentual: number
  selos_aprovados: number
}

/**
 * Calcula estatísticas da trilha.
 */
export function getTrailStats(trilha: DocumentTrailItem[]): TrailStats {
  const total = trilha.length
  const concluidos = trilha.filter(d => d.status === 'concluido').length
  const pendentes = trilha.filter(d => d.status === 'pendente').length
  const em_andamento = trilha.filter(d => d.status === 'em_andamento').length
  const pulados = trilha.filter(d => d.status === 'pulado').length
  const selos_aprovados = trilha.filter(d => d.selo_aprovado === true).length

  return {
    total,
    concluidos,
    pendentes,
    em_andamento,
    pulados,
    progresso_percentual: total > 0 ? Math.round(((concluidos + pulados) / total) * 100) : 0,
    selos_aprovados,
  }
}
