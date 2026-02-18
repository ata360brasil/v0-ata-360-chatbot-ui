'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h2>Algo deu errado</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #ccc',
              cursor: 'pointer',
              background: '#fff',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
