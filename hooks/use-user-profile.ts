/**
 * Hook — useUserProfile
 *
 * Carrega e cacheia perfil do usuario. Permite atualizar preferencias.
 * Trigger aprendizado automatico a partir de mensagens do chat.
 *
 * Part 19: perfil exposto ao frontend é sanitizado (sem scores internos).
 *
 * @see workers/src/profile/learner.ts — backend profile learner
 */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { logger } from '@/lib/observability'

export interface UserProfile {
  segmento_principal: string | null
  segmentos_secundarios: string[]
  termos_frequentes: Array<{ termo: string; contagem: number }>
  preferencias_terminologia: Record<string, string>
  regiao_uf: string | null
  temas_recorrentes: string[]
  documentos_mais_gerados: string[]
}

interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  carregarPerfil: () => Promise<void>
  atualizarPreferencias: (data: {
    segmento_principal?: string | null
    preferencias_terminologia?: Record<string, string>
    regiao_uf?: string | null
  }) => Promise<boolean>
  triggerAprendizado: (textos: string[]) => Promise<void>
}

const EMPTY_PROFILE: UserProfile = {
  segmento_principal: null,
  segmentos_secundarios: [],
  termos_frequentes: [],
  preferencias_terminologia: {},
  regiao_uf: null,
  temas_recorrentes: [],
  documentos_mais_gerados: [],
}

// Buffer de textos para aprendizado (batch a cada 5 mensagens)
const textBuffer: string[] = []
const BATCH_SIZE = 5

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadedRef = useRef(false)

  const carregarPerfil = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile')

      if (!response.ok) {
        if (response.status === 401) {
          setProfile(EMPTY_PROFILE)
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar perfil'
      setError(msg)
      logger.error('useUserProfile.carregarPerfil failed', { error: msg })
      // Fallback para perfil vazio
      setProfile(EMPTY_PROFILE)
    } finally {
      setLoading(false)
    }
  }, [loading])

  const atualizarPreferencias = useCallback(async (data: {
    segmento_principal?: string | null
    preferencias_terminologia?: Record<string, string>
    regiao_uf?: string | null
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, ...data } as UserProfile : null)
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      logger.error('useUserProfile.atualizarPreferencias failed', { error: msg })
      return false
    }
  }, [])

  const triggerAprendizado = useCallback(async (textos: string[]) => {
    // Adicionar ao buffer
    textBuffer.push(...textos)

    // Enviar quando buffer atingir tamanho
    if (textBuffer.length >= BATCH_SIZE) {
      const batch = textBuffer.splice(0, textBuffer.length)

      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textos: batch }),
        })
        // Recarregar perfil após aprendizado
        await carregarPerfil()
      } catch {
        // Best effort — não bloquear o chat
        logger.warn('useUserProfile.triggerAprendizado failed (best effort)')
      }
    }
  }, [carregarPerfil])

  // Carregar perfil uma vez
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      carregarPerfil()
    }
  }, [carregarPerfil])

  return {
    profile,
    loading,
    error,
    carregarPerfil,
    atualizarPreferencias,
    triggerAprendizado,
  }
}
