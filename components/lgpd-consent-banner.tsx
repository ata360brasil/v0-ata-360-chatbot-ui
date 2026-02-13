'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { updateConsent } from '@/lib/analytics'

const STORAGE_KEY = 'ata360_lgpd_consent'

type ConsentValue = 'granted' | 'denied'

function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'granted' || value === 'denied') return value
    return null
  } catch {
    return null
  }
}

function persistConsent(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // localStorage indisponível (ex.: navegação privada restrita)
  }
}

/**
 * Banner de consentimento LGPD para cookies de analytics.
 *
 * - Exibe uma barra fixa no rodapé até o usuário aceitar ou recusar.
 * - Persiste a escolha em localStorage (`ata360_lgpd_consent`).
 * - Atualiza o GA4 Consent Mode via `gtag('consent', 'update', ...)` quando o usuário aceita.
 * - Não reaparece após a escolha ser feita.
 */
export function LgpdConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    if (stored === null) {
      // Nenhuma escolha feita — exibir banner
      setVisible(true)
    } else if (stored === 'granted') {
      // Já aceitou anteriormente — garantir que GA4 consent esteja atualizado
      updateConsent(true)
    }
    // Se 'denied', não faz nada — AnalyticsProvider já nega por padrão
  }, [])

  function handleAccept() {
    persistConsent('granted')
    updateConsent(true)
    setVisible(false)
  }

  function handleDecline() {
    persistConsent('denied')
    updateConsent(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50',
        'border-t border-border bg-background/95 backdrop-blur-sm',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:gap-6 sm:px-6">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          Este site utiliza cookies estritamente para fins de analytics,
          permitindo-nos compreender como você interage com a plataforma e
          melhorar sua experiência. Nenhum dado pessoal é compartilhado com
          terceiros. Ao clicar em &ldquo;Aceitar&rdquo;, você consente com o
          uso desses cookies conforme a{' '}
          <span className="font-medium text-foreground">
            Lei Geral de Proteção de Dados (LGPD)
          </span>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
          >
            Recusar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  )
}
