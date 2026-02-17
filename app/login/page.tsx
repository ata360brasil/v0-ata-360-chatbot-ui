"use client"

import { Suspense, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ATA360Icon } from "@/components/ata360-icon"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { logger } from "@/lib/observability"

const supabaseReady = isSupabaseConfigured()
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/"
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token)
    setTurnstileError(false)
  }, [])

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null)
    setTurnstileError(true)
  }, [])

  async function handleGovBrLogin() {
    if (!supabaseReady) return
    if (TURNSTILE_SITE_KEY && !turnstileToken) return

    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    logger.info("Auth: iniciando login Gov.br", { redirect })

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "keycloak" as never,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback/govbr?redirect=${encodeURIComponent(redirect)}`,
        queryParams: {
          response_type: "code",
          scope: "openid email profile govbr_confiabilidades",
        },
      },
    })

    if (error) {
      logger.error("Auth: falha no login Gov.br", { error: error.message })
    }
  }

  async function handleDemoLogin() {
    if (TURNSTILE_SITE_KEY && !turnstileToken) return

    if (!supabaseReady) {
      window.location.href = redirect
      return
    }
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    logger.info("Auth: login demo mode")

    const { error } = await supabase.auth.signInAnonymously()

    if (error) {
      logger.error("Auth: falha no login demo", { error: error.message })
      window.location.href = redirect
    } else {
      window.location.href = redirect
    }
  }

  const turnstileReady = !TURNSTILE_SITE_KEY || !!turnstileToken

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ATA360Icon className="size-10" color="adaptive" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">ATA360</CardTitle>
            <CardDescription className="mt-2">
              Plataforma Inteligente de Contratacoes Publicas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cloudflare Turnstile — protecao contra bots */}
          {TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <TurnstileWidget
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
              />
            </div>
          )}

          {turnstileError && (
            <p className="text-xs text-center text-destructive">
              Erro na verificacao de seguranca. Recarregue a pagina e tente novamente.
            </p>
          )}

          {/* Gov.br Login */}
          {supabaseReady && (
            <>
              <Button
                onClick={handleGovBrLogin}
                disabled={!turnstileReady}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <svg
                  className="size-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Entrar com Gov.br
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>
            </>
          )}

          {/* Demo Login */}
          <Button
            onClick={handleDemoLogin}
            disabled={!turnstileReady}
            variant={supabaseReady ? "outline" : "default"}
            className={supabaseReady ? "w-full h-10" : "w-full h-12 text-base font-medium"}
            size={supabaseReady ? "default" : "lg"}
          >
            {supabaseReady ? "Acessar modo demonstracao" : "Entrar na plataforma"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
            Ao entrar, voce concorda com os{" "}
            <a href="/termos" className="underline hover:text-foreground">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacidade" className="underline hover:text-foreground">
              Politica de Privacidade
            </a>{" "}
            conforme a LGPD (Lei 13.709/2018).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Cloudflare Turnstile Widget
 *
 * Carrega o script do Turnstile e renderiza o widget.
 * Sem dependencias externas — usa a API JS diretamente.
 *
 * Para ativar: definir NEXT_PUBLIC_TURNSTILE_SITE_KEY no .env
 * Obter site key em: https://dash.cloudflare.com/turnstile
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */
function TurnstileWidget({
  siteKey,
  onSuccess,
  onError,
}: {
  siteKey: string
  onSuccess: (token: string) => void
  onError: () => void
}) {
  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || node.childElementCount > 0) return

      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
      script.async = true

      ;(window as Record<string, unknown>).onTurnstileLoad = () => {
        const turnstile = (window as Record<string, { render: (el: HTMLElement, opts: Record<string, unknown>) => void }>).turnstile
        if (turnstile) {
          turnstile.render(node, {
            sitekey: siteKey,
            theme: "auto",
            callback: onSuccess,
            "error-callback": onError,
          })
        }
      }

      document.head.appendChild(script)
    },
    [siteKey, onSuccess, onError],
  )

  return <div ref={containerRef} />
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
