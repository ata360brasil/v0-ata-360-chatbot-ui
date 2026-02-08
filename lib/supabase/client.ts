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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase não configurado. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  return createBrowserClient<Database>(url, key)
}

/** Verifica se Supabase está configurado sem lançar erro */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
