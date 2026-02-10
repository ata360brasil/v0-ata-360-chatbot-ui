/**
 * ATA360 — Cron: Calibração Mensal do AUDITOR
 *
 * Executado mensalmente via Cloudflare Cron Triggers.
 *
 * 1. Recalcula taxa_override de cada threshold
 * 2. Aplica regras de auto-downgrade
 * 3. Registra mudanças no audit_trail
 *
 * @see Spec v8 Part 07 — AUDITOR Agent
 */

import { calibrateThresholds } from '../auditor/calibration'

interface CronEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_KEY: string
}

/**
 * Handler do cron mensal de calibração.
 *
 * Passo 1: Recalcula taxa_override para cada threshold
 * Passo 2: Delega calibração para calibrateThresholds()
 */
export async function runAuditorCalibration(env: CronEnv) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  }

  // Passo 1: Recalcular taxa_override baseado em decisões reais

  // Buscar todos os resultados de auditoria dos últimos 90 dias
  const noventaDias = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

  const resultadosResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/auditor_resultados?created_at=gte.${noventaDias}&select=documento_tipo,checklist,decisao_usuario`,
    { headers },
  )

  if (resultadosResponse.ok) {
    const resultados = await resultadosResponse.json() as Array<{
      documento_tipo: string
      checklist: Array<{ id: string; conforme: boolean; achado: string | null }>
      decisao_usuario: string | null
    }>

    // Contar overrides por check_id: quando achado foi identificado mas usuário prosseguiu
    const overrideCounts = new Map<string, { total: number; overrides: number }>()

    for (const r of resultados) {
      if (!r.checklist) continue

      for (const check of r.checklist) {
        if (!check.achado) continue // Sem achado = sem override possível

        const key = `${check.id}|${r.documento_tipo}`
        if (!overrideCounts.has(key)) {
          overrideCounts.set(key, { total: 0, overrides: 0 })
        }

        const counts = overrideCounts.get(key)!
        counts.total++

        // Se tinha achado E usuário prosseguiu → override
        if (r.decisao_usuario === 'PROSSEGUIR' || r.decisao_usuario === 'APROVAR') {
          counts.overrides++
        }
      }
    }

    // Atualizar taxa_override para cada threshold
    for (const [key, counts] of overrideCounts) {
      const [checkId, documentoTipo] = key.split('|')
      const taxaOverride = counts.total > 0 ? counts.overrides / counts.total : 0

      await fetch(
        `${env.SUPABASE_URL}/rest/v1/auditor_thresholds?check_id=eq.${checkId}&documento_tipo=eq.${documentoTipo}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            total_avaliacoes: counts.total,
            taxa_override: Math.round(taxaOverride * 100) / 100,
          }),
        },
      )
    }
  }

  // Passo 2: Calibrar thresholds com as regras de auto-downgrade
  const calibrationResult = await calibrateThresholds(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)

  return calibrationResult
}
