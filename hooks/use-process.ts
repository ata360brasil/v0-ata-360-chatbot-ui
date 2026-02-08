"use client"

/**
 * useProcess — hook para estado do processo atual no fluxo cíclico.
 *
 * Gerencia: estado da state machine, parecer AUDITOR, decisões,
 * iterações, selo_aprovado.
 *
 * @see Spec v8 Part 20.3 — Fluxo Cíclico
 * @see Spec v8 Part 20.4 — State Machine
 */
import { useState, useCallback } from "react"
import { processo as processoApi } from "@/lib/api"
import { logger } from "@/lib/observability"
import { audit } from "@/lib/audit"
import type { CurrentProcess, UserDecision } from "@/lib/schemas/process"

interface UseProcessReturn {
  process: CurrentProcess | null
  loading: boolean
  error: string | null
  /** Cria novo processo */
  criar: (objeto: string, tipo?: string) => Promise<void>
  /** Carrega estado atual do processo */
  carregar: (id: string) => Promise<void>
  /** Envia decisão do usuário (APROVAR, EDITAR, etc.) */
  decidir: (acao: UserDecision) => Promise<void>
  /** Limpa estado */
  limpar: () => void
}

export function useProcess(): UseProcessReturn {
  const [process, setProcess] = useState<CurrentProcess | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const criar = useCallback(async (objeto: string, tipo_documento?: string) => {
    setLoading(true)
    setError(null)
    try {
      const { id, numero } = await processoApi.criar({ objeto, tipo_documento })
      logger.info("Process: criado", { id, numero })
      audit("process.create", { resourceId: id, details: { objeto } })

      // Carrega estado completo
      const status = await processoApi.status(id)
      setProcess({
        id,
        numero,
        objeto,
        estado: status.estado as CurrentProcess["estado"],
        iteracao: status.iteracao,
        documento_tipo: null,
        parecer_auditor: null,
        selo_aprovado: status.selo_aprovado,
        proximo_sugerido: status.proximo_sugerido,
        sugestoes_restantes: 3, // Max 3 sugestoes ACMA por secao (Part 20.5)
        reauditorias_restantes: 5, // Max 5 reauditorias por documento (Part 20.5)
      })
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
          numero: "",
          objeto: "",
          sugestoes_restantes: 3,
          reauditorias_restantes: 5,
        }),
        id,
        estado: status.estado as CurrentProcess["estado"],
        iteracao: status.iteracao,
        documento_tipo: null,
        parecer_auditor: status.parecer_auditor as CurrentProcess["parecer_auditor"],
        selo_aprovado: status.selo_aprovado,
        proximo_sugerido: status.proximo_sugerido,
      }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar processo"
      setError(msg)
      logger.error("Process: erro ao carregar", { error: msg, processoId: id })
    } finally {
      setLoading(false)
    }
  }, [])

  const decidir = useCallback(
    async (acao: UserDecision) => {
      if (!process) return
      setLoading(true)
      setError(null)
      try {
        const result = await processoApi.decisao(process.id, acao)
        logger.info("Process: decisão tomada", { acao, novoEstado: result.novo_estado })
        audit("process.update", {
          resourceId: process.id,
          details: { acao, estado_anterior: process.estado, estado_novo: result.novo_estado },
        })

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

  const limpar = useCallback(() => {
    setProcess(null)
    setError(null)
  }, [])

  return { process, loading, error, criar, carregar, decidir, limpar }
}
