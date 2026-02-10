/**
 * useNormalization — Hook para normalização de texto + feedback.
 *
 * Integra:
 * 1. Pipeline de normalização (6 camadas)
 * 2. Feedback do usuário (aprovação/correção/rejeição)
 * 3. Cache local para evitar re-requests
 *
 * @see Spec v8 Part 16 — Normalização Linguística
 */
'use client'

import { useState, useCallback, useRef } from 'react'
import { normalize, type ApiError } from '@/lib/api'

// ─── Types ─────────────────────────────────────────────────────────────────

interface NormalizeResult {
  texto_original: string
  texto_normalizado: string
  pipeline_aplicado: Array<{
    camada: string
    texto_entrada: string
    texto_saida: string
    transformacao: string | null
    confianca: number
    detalhes?: Record<string, unknown>
  }>
  catmat_sugeridos: Array<{
    codigo: string
    tipo: 'catmat' | 'catser'
    descricao: string
    assertividade: number
    fonte: string
  }>
  alertas: Array<{
    tipo: string
    mensagem: string
    sugestao: string | null
    base_legal?: string
  }>
  cache_hit: boolean
  duracao_ms: number
}

interface FeedbackPayload {
  processo_id?: string
  termo_original: string
  termo_normalizado_sistema: string
  catmat_sugerido_sistema?: string
  termo_corrigido_usuario?: string
  catmat_corrigido_usuario?: string
  tipo_feedback: 'correcao_termo' | 'correcao_catmat' | 'aprovacao' | 'rejeicao'
  setor?: string
  regiao_uf?: string
  confianca_original?: number
}

interface UseNormalizationReturn {
  /** Resultado da última normalização */
  resultado: NormalizeResult | null
  /** Loading state */
  loading: boolean
  /** Erro da última operação */
  error: string | null
  /** Feedback enviado com sucesso */
  feedbackEnviado: boolean
  /** Normalizar um texto */
  normalizar: (texto: string, opcoes?: {
    setor_orgao?: string
    regiao_uf?: string
    incluir_catmat?: boolean
  }) => Promise<NormalizeResult | null>
  /** Enviar feedback sobre normalização */
  enviarFeedback: (feedback: FeedbackPayload) => Promise<boolean>
  /** Limpar resultado */
  limpar: () => void
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useNormalization(): UseNormalizationReturn {
  const [resultado, setResultado] = useState<NormalizeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedbackEnviado, setFeedbackEnviado] = useState(false)

  // Cache local simples (evita re-requests para mesmo texto)
  const cacheRef = useRef<Map<string, NormalizeResult>>(new Map())

  const normalizar = useCallback(async (
    texto: string,
    opcoes?: {
      setor_orgao?: string
      regiao_uf?: string
      incluir_catmat?: boolean
    },
  ): Promise<NormalizeResult | null> => {
    if (!texto || texto.trim().length < 2) {
      setError('Texto deve ter no mínimo 2 caracteres')
      return null
    }

    const cacheKey = `${texto}|${opcoes?.setor_orgao || ''}|${opcoes?.regiao_uf || ''}`
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setResultado(cached)
      setError(null)
      return cached
    }

    setLoading(true)
    setError(null)
    setFeedbackEnviado(false)

    try {
      const data = await normalize.texto({
        texto: texto.trim(),
        setor_orgao: opcoes?.setor_orgao,
        regiao_uf: opcoes?.regiao_uf,
        incluir_catmat: opcoes?.incluir_catmat ?? true,
      })

      setResultado(data)
      cacheRef.current.set(cacheKey, data)

      // Limitar cache a 50 entries
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value
        if (firstKey) cacheRef.current.delete(firstKey)
      }

      return data
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Erro na normalização')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const enviarFeedback = useCallback(async (feedback: FeedbackPayload): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao enviar feedback' }))
        setError(errorData.message)
        return false
      }

      setFeedbackEnviado(true)

      // Invalidar cache local para este termo (correção muda resultado)
      if (feedback.tipo_feedback.startsWith('correcao_')) {
        for (const [key] of cacheRef.current) {
          if (key.startsWith(feedback.termo_original)) {
            cacheRef.current.delete(key)
          }
        }
      }

      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar feedback'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const limpar = useCallback(() => {
    setResultado(null)
    setError(null)
    setFeedbackEnviado(false)
  }, [])

  return {
    resultado,
    loading,
    error,
    feedbackEnviado,
    normalizar,
    enviarFeedback,
    limpar,
  }
}
