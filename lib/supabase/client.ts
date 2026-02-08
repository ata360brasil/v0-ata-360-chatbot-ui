/**
 * Supabase Browser Client — para uso em Client Components ("use client").
 *
 * Padrão oficial: supabase.com/docs/guides/auth/server-side/nextjs
 * Singleton per-request — createBrowserClient reutiliza a instância.
 *
 * @see Paul Copplestone / Ant Wilson — Supabase SSR Auth
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
