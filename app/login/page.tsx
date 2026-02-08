"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ATA360Icon } from "@/components/ata360-icon"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { logger } from "@/lib/observability"

const supabaseReady = isSupabaseConfigured()

function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/"

  async function handleGovBrLogin() {
    if (!supabaseReady) return
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
    if (!supabaseReady) {
      // Sem Supabase — entra direto em modo demo
      window.location.href = redirect
      return
    }
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    logger.info("Auth: login demo mode")

    const { error } = await supabase.auth.signInAnonymously()

    if (error) {
      logger.error("Auth: falha no login demo", { error: error.message })
      // Fallback: entrar direto mesmo com erro
      window.location.href = redirect
    } else {
      window.location.href = redirect
    }
  }

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
              Plataforma Inteligente de Contratações Públicas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Gov.br Login — só aparece se Supabase configurado */}
          {supabaseReady && (
            <>
              <Button
                onClick={handleGovBrLogin}
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
            variant={supabaseReady ? "outline" : "default"}
            className={supabaseReady ? "w-full h-10" : "w-full h-12 text-base font-medium"}
            size={supabaseReady ? "default" : "lg"}
          >
            {supabaseReady ? "Acessar modo demonstração" : "Entrar na plataforma"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
            Ao entrar, você concorda com os{" "}
            <a href="/termos" className="underline hover:text-foreground">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacidade" className="underline hover:text-foreground">
              Política de Privacidade
            </a>{" "}
            conforme a LGPD (Lei 13.709/2018).
          </p>
        </CardContent>
      </Card>
    </div>
  )
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
