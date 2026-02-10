/**
 * ATA360 — AUDITOR Threshold Calibration
 *
 * Regras:
 * - taxa_override > 60% + 20+ amostras → downgrade 1 nível
 *   (alta→média, média→baixa, baixa→informativa)
 * - taxa_override < 10% + 20+ amostras → threshold correto
 * - Severidade 'critica' → NUNCA auto-downgrade (requer humano)
 * - Toda calibração → audit_trail
 *
 * @see Spec v8 Part 07 — AUDITOR Agent
 * @see Spec v8 Part 19 — thresholds nunca expostos ao frontend
 */

interface ThresholdRow {
  id: string
  check_id: string
  documento_tipo: string
  setor: string | null
  severidade: string
  peso: number
  total_avaliacoes: number
  taxa_override: number
  auto_calibrado: boolean
}

interface CalibrationResult {
  thresholds_avaliados: number
  thresholds_calibrados: number
  downgrades: Array<{
    check_id: string
    documento_tipo: string
    severidade_anterior: string
    severidade_nova: string
    taxa_override: number
    total_avaliacoes: number
  }>
  erros: string[]
}

// Mapa de downgrade (NUNCA downgrade 'critica')
const DOWNGRADE_MAP: Record<string, string> = {
  alta: 'media',
  media: 'baixa',
  baixa: 'informativa',
}

// Mapa de peso por severidade
const PESO_MAP: Record<string, number> = {
  critica: 5.0,
  alta: 3.0,
  media: 2.0,
  baixa: 1.0,
  informativa: 0.5,
}

/**
 * Executa calibração de thresholds do AUDITOR.
 * Chamado pelo cron mensal.
 */
export async function calibrateThresholds(
  supabaseUrl: string,
  supabaseKey: string,
): Promise<CalibrationResult> {
  const result: CalibrationResult = {
    thresholds_avaliados: 0,
    thresholds_calibrados: 0,
    downgrades: [],
    erros: [],
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  try {
    // 1. Carregar todos os thresholds
    const response = await fetch(
      `${supabaseUrl}/rest/v1/auditor_thresholds?select=*`,
      { headers },
    )

    if (!response.ok) {
      result.erros.push(`Falha ao carregar thresholds: ${response.status}`)
      return result
    }

    const thresholds = await response.json() as ThresholdRow[]
    result.thresholds_avaliados = thresholds.length

    // 2. Para cada threshold, verificar se precisa calibrar
    for (const th of thresholds) {
      try {
        // Regra: precisa de 20+ amostras para calibrar
        if (th.total_avaliacoes < 20) continue

        // Regra: NUNCA auto-downgrade 'critica'
        if (th.severidade === 'critica') continue

        // Regra: taxa_override > 60% → downgrade
        if (th.taxa_override > 0.60) {
          const novaSeveridade = DOWNGRADE_MAP[th.severidade]
          if (!novaSeveridade) continue

          const novoPeso = PESO_MAP[novaSeveridade] || 1.0

          // Atualizar threshold
          const updateResponse = await fetch(
            `${supabaseUrl}/rest/v1/auditor_thresholds?id=eq.${th.id}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                severidade: novaSeveridade,
                peso: novoPeso,
                auto_calibrado: true,
                calibrado_em: new Date().toISOString(),
              }),
            },
          )

          if (updateResponse.ok) {
            result.thresholds_calibrados++
            result.downgrades.push({
              check_id: th.check_id,
              documento_tipo: th.documento_tipo,
              severidade_anterior: th.severidade,
              severidade_nova: novaSeveridade,
              taxa_override: th.taxa_override,
              total_avaliacoes: th.total_avaliacoes,
            })
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro'
        result.erros.push(`Erro calibrando ${th.check_id}: ${msg}`)
      }
    }

    // 3. Registrar calibração no audit_trail
    if (result.thresholds_calibrados > 0) {
      await fetch(`${supabaseUrl}/rest/v1/audit_trail`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orgao_id: '00000000-0000-0000-0000-000000000000',
          acao: 'AUDITOR_CALIBRACAO',
          agente: 'cron_calibracao',
          hash: crypto.randomUUID(),
          detalhes: {
            thresholds_avaliados: result.thresholds_avaliados,
            thresholds_calibrados: result.thresholds_calibrados,
            downgrades: result.downgrades,
          },
          criado_por: '00000000-0000-0000-0000-000000000000',
        }),
      })
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro geral'
    result.erros.push(`Erro geral na calibração: ${msg}`)
  }

  return result
}

/**
 * Carrega thresholds calibrados para um tipo de documento e setor.
 * Retorna os pesos ajustados ao invés de pesos fixos.
 */
export async function loadCalibratedThresholds(
  documentoTipo: string,
  setor: string | undefined,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<Map<string, { severidade: string; peso: number }>> {
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
  }

  const thresholdsMap = new Map<string, { severidade: string; peso: number }>()

  try {
    // Buscar thresholds específicos do setor primeiro, depois genéricos
    const queries = [
      // Setor-specific
      setor
        ? `${supabaseUrl}/rest/v1/auditor_thresholds?documento_tipo=eq.${documentoTipo}&setor=eq.${setor}&select=check_id,severidade,peso`
        : null,
      // Genéricos (setor = null)
      `${supabaseUrl}/rest/v1/auditor_thresholds?documento_tipo=eq.${documentoTipo}&setor=is.null&select=check_id,severidade,peso`,
    ].filter(Boolean) as string[]

    for (const url of queries) {
      const response = await fetch(url, { headers })
      if (response.ok) {
        const data = await response.json() as Array<{ check_id: string; severidade: string; peso: number }>
        for (const row of data) {
          // Setor-specific tem prioridade (primeiro inserido ganha)
          if (!thresholdsMap.has(row.check_id)) {
            thresholdsMap.set(row.check_id, { severidade: row.severidade, peso: row.peso })
          }
        }
      }
    }
  } catch {
    // Falha ao carregar thresholds — usar padrões
  }

  return thresholdsMap
}
