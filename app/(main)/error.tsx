'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: Enviar para serviço de monitoramento (Sentry)
    if (process.env.NODE_ENV === 'development') {
      console.error('[ATA360:Error]', error)
    }
  }, [error])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ocorreu um erro inesperado. Nossa equipe já foi notificada.
        {error.digest && (
          <span className="block text-xs mt-2 font-mono text-muted-foreground/60">
            Ref: {error.digest}
          </span>
        )}
      </p>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
