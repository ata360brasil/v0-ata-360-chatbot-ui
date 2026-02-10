"use client"

/**
 * useProcess — hook para estado do processo atual no fluxo cíclico.
 *
 * Gerencia: estado da state machine, parecer AUDITOR, decisões,
 * iterações, selo_aprovado, trilha de documentos, insight cards.
 *
 * @see Spec v8 Part 20.3 — Fluxo Cíclico
 * @see Spec v8 Part 20.4 — State Machine
 * @see Spec v8 Part 20.8 — Trilha de Documentos
 */
import { useState, useCallback } from "react"
import { processo as processoApi } from "@/lib/api"
import { logger } from "@/lib/observability"
import { audit } from "@/lib/audit"
import type { CurrentProcess, UserDecision } from "@/lib/schemas/process"

interface TrailItem {
  tipo: string
  status: string
  versao: number | null
  selo_aprovado: boolean | null
}

interface TrailStats {
  total: number
  concluidos: number
  pendentes: number
  progresso_percentual: number
  selos_aprovados: number
}

interface InsightCard {
  tipo: string
  titulo: string
  descricao: string
  fonte: string
  dados?: Record<string, unknown>
  relevancia: number
}

interface UseProcessReturn {
  process: CurrentProcess | null
  loading: boolean
  error: string | null
  /** Trilha de documentos */
  trilha: TrailItem[]
  trilhaStats: TrailStats | null
  /** Insight cards */
  insightCards: InsightCard[]
  /** Cria novo processo */
  criar: (objeto: string, tipo?: string, modalidade?: string) => Promise<void>
  /** Carrega estado atual do processo */
  carregar: (id: string) => Promise<void>
  /** Envia decisão do usuário (APROVAR, EDITAR, etc.) */
  decidir: (acao: UserDecision, textoEditado?: string) => Promise<void>
  /** Carrega insight cards */
  carregarInsights: (id: string) => Promise<void>
  /** Carrega trilha de documentos */
  carregarTrilha: (id: string) => Promise<void>
  /** Limpa estado */
  limpar: () => void
}

export function useProcess(): UseProcessReturn {
  const [process, setProcess] = useState<CurrentProcess | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trilha, setTrilha] = useState<TrailItem[]>([])
  const [trilhaStats, setTrilhaStats] = useState<TrailStats | null>(null)
  const [insightCards, setInsightCards] = useState<InsightCard[]>([])

  const criar = useCallback(async (objeto: string, tipo_documento?: string, modalidade?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await processoApi.criar({ objeto, tipo_documento, modalidade })
      logger.info("Process: criado", { id: result.id, numero: result.numero, modalidade: result.modalidade })
      audit("process.create", { resourceId: result.id, details: { objeto, modalidade: result.modalidade } })

      // Carrega estado completo
      const status = await processoApi.status(result.id)
      setProcess({
        id: result.id,
        numero: result.numero,
        objeto,
        estado: status.estado as CurrentProcess["estado"],
        iteracao: status.iteracao,
        documento_tipo: status.documento_atual,
        parecer_auditor: status.parecer_auditor as CurrentProcess["parecer_auditor"],
        selo_aprovado: status.selo_aprovado,
        proximo_sugerido: status.proximo_sugerido,
        sugestoes_restantes: status.sugestoes_restantes,
        reauditorias_restantes: status.reauditorias_restantes,
      })

      // Carregar trilha
      setTrilha(status.trilha || [])
      setTrilhaStats(status.trilha_stats || null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar processo"
      setError(msg)
      logger.error("Process: erro ao criar", { error: msg })
    } finally {
      setLoading(false)
    }
  }, [])

  const carregar = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const status = await processoApi.status(id)
      setProcess((prev) => ({
        ...(prev ?? {
          id,
          numero: status.numero || "",
          objeto: status.objeto || "",
          sugestoes_restantes: 3,
          reauditorias_restantes: 5,
        }),
        id,
        numero: status.numero || prev?.numero || "",
        objeto: status.objeto || prev?.objeto || "",
        estado: status.estado as CurrentProcess["estado"],
        iteracao: status.iteracao,
        documento_tipo: status.documento_atual,
        parecer_auditor: status.parecer_auditor as CurrentProcess["parecer_auditor"],
        selo_aprovado: status.selo_aprovado,
        proximo_sugerido: status.proximo_sugerido,
        sugestoes_restantes: status.sugestoes_restantes,
        reauditorias_restantes: status.reauditorias_restantes,
      }))

      // Atualizar trilha e cards
      setTrilha(status.trilha || [])
      setTrilhaStats(status.trilha_stats || null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar processo"
      setError(msg)
      logger.error("Process: erro ao carregar", { error: msg, processoId: id })
    } finally {
      setLoading(false)
    }
  }, [])

  const decidir = useCallback(
    async (acao: UserDecision, textoEditado?: string) => {
      if (!process) return
      setLoading(true)
      setError(null)
      try {
        const result = await processoApi.decisao(process.id, acao, textoEditado)
        logger.info("Process: decisão tomada", { acao, novoEstado: result.novo_estado, sucesso: result.sucesso })
        audit("process.update", {
          resourceId: process.id,
          details: { acao, estado_anterior: process.estado, estado_novo: result.novo_estado },
        })

        if (result.erro) {
          setError(result.erro)
        }

        // Atualizar trilha se veio na resposta
        if (result.trilha) {
          setTrilha(result.trilha as TrailItem[])
        }

        // Recarrega estado completo
        await carregar(process.id)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao enviar decisão"
        setError(msg)
        logger.error("Process: erro na decisão", { error: msg, acao })
      } finally {
        setLoading(false)
      }
    },
    [process, carregar],
  )

  const carregarInsights = useCallback(async (id: string) => {
    try {
      const result = await processoApi.insights(id)
      setInsightCards(result.cards || [])
    } catch (err) {
      logger.error("Process: erro ao carregar insights", { error: err })
    }
  }, [])

  const carregarTrilha = useCallback(async (id: string) => {
    try {
      const result = await processoApi.trilha(id)
      setTrilha(result.trilha || [])
      setTrilhaStats(result.stats || null)
    } catch (err) {
      logger.error("Process: erro ao carregar trilha", { error: err })
    }
  }, [])

  const limpar = useCallback(() => {
    setProcess(null)
    setError(null)
    setTrilha([])
    setTrilhaStats(null)
    setInsightCards([])
  }, [])

  return {
    process,
    loading,
    error,
    trilha,
    trilhaStats,
    insightCards,
    criar,
    carregar,
    decidir,
    carregarInsights,
    carregarTrilha,
    limpar,
  }
}
