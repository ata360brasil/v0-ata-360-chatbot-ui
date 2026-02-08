"use client"

/**
 * useAuth — hook para estado de autenticação Supabase.
 *
 * Resiliente: se Supabase não estiver configurado, retorna user=null, loading=false.
 *
 * @see Paul Copplestone — Supabase Auth Helpers for Next.js
 */
import { useEffect, useState, useCallback } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { logger } from "@/lib/observability"
import { audit } from "@/lib/audit"
import type { User } from "@supabase/supabase-js"

export interface AuthUser {
  id: string
  email: string | null
  cpf: string | null
  nome: string | null
  orgao_id: string | null
  role: "superadm" | "suporte" | "localadm" | "servidor" | "demo"
  avatar_url: string | null
  govbr_level: "ouro" | "prata" | "bronze" | null
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null

  const meta = user.user_metadata ?? {}

  return {
    id: user.id,
    email: user.email ?? null,
    cpf: meta.cpf ?? null,
    nome: meta.nome ?? meta.full_name ?? meta.name ?? null,
    orgao_id: meta.orgao_id ?? null,
    role: meta.role ?? "demo",
    avatar_url: meta.avatar_url ?? null,
    govbr_level: meta.govbr_level ?? null,
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient()

      // Get initial session
      supabase.auth.getUser().then(({ data: { user: u } }) => {
        setUser(mapUser(u))
        setLoading(false)
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const mapped = mapUser(session?.user ?? null)
        setUser(mapped)
        setLoading(false)

        if (_event === "SIGNED_IN" && mapped) {
          logger.info("Auth: user signed in", { userId: mapped.id, role: mapped.role })
          audit("auth.login", { details: { role: mapped.role, orgao_id: mapped.orgao_id } })
        } else if (_event === "SIGNED_OUT") {
          logger.info("Auth: user signed out")
          audit("auth.logout")
        }
      })

      return () => subscription.unsubscribe()
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      window.location.href = "/login"
      return
    }
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }, [])

  return { user, loading, signOut }
}
