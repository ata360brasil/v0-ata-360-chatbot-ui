/**
 * ATA360 — Camada 4: Normalização de termos regionais.
 *
 * Consulta D1 `regionalismos` e mapeia termos regionais para oficiais.
 * Usa UF do usuário para priorizar matches da região correta.
 *
 * Ex: "macaxeira" (N/NE) → "mandioca"
 * Ex: "bergamota" (S) → "tangerina"
 * Ex: "cacetinho" (RS) → "pão francês"
 */

import type { PipelineStep, NormalizacaoAlerta } from './types'

interface RegionalismoRow {
  termo_regional: string
  termo_oficial: string
  nome_cientifico: string | null
  regioes: string  // JSON array
  catmat: string | null
  categoria: string
}

/** Mapa UF → região geográfica */
const UF_REGIAO: Record<string, string> = {
  AC: 'N', AM: 'N', AP: 'N', PA: 'N', RO: 'N', RR: 'N', TO: 'N',
  AL: 'NE', BA: 'NE', CE: 'NE', MA: 'NE', PB: 'NE', PE: 'NE', PI: 'NE', RN: 'NE', SE: 'NE',
  DF: 'CO', GO: 'CO', MS: 'CO', MT: 'CO',
  ES: 'SE', MG: 'SE', RJ: 'SE', SP: 'SE',
  PR: 'S', RS: 'S', SC: 'S',
}

export interface RegionalismoResult {
  resultado: string
  step: PipelineStep
  alertas: NormalizacaoAlerta[]
}

/**
 * Resolve termos regionais no texto usando D1 lookup + UF context.
 */
export async function resolveRegionalismos(
  texto: string,
  regiaoUf: string | undefined,
  db: D1Database,
): Promise<RegionalismoResult> {
  const original = texto
  const alertas: NormalizacaoAlerta[] = []
  const substituicoes: string[] = []

  // Carregar regionalismos (tabela pequena, ~60-150 rows)
  const { results } = await db
    .prepare(
      `SELECT termo_regional, termo_oficial, nome_cientifico, regioes, catmat, categoria
       FROM regionalismos
       ORDER BY length(termo_regional) DESC`
    )
    .all<RegionalismoRow>()

  if (!results || results.length === 0) {
    return {
      resultado: texto,
      step: {
        camada: 'regional',
        texto_entrada: original,
        texto_saida: texto,
        transformacao: null,
        confianca: 1.0,
      },
      alertas: [],
    }
  }

  let resultado = texto
  const regiao = regiaoUf ? UF_REGIAO[regiaoUf.toUpperCase()] : undefined

  for (const row of results) {
    const escaped = row.termo_regional.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')

    if (!regex.test(resultado)) continue

    // Parse regiões onde o termo é usado
    let regioes: string[] = []
    try {
      regioes = JSON.parse(row.regioes)
    } catch { /* ignore */ }

    // Substituir termo regional pelo oficial
    const antes = resultado
    resultado = resultado.replace(regex, row.termo_oficial)

    if (resultado !== antes) {
      const regiaoLabel = regioes.length > 0 ? ` (${regioes.join('/')})` : ''
      substituicoes.push(`"${row.termo_regional}"${regiaoLabel} → "${row.termo_oficial}"`)

      alertas.push({
        tipo: 'regionalismo',
        mensagem: `Termo regional "${row.termo_regional}" normalizado para "${row.termo_oficial}"${row.nome_cientifico ? ` (${row.nome_cientifico})` : ''}.`,
        sugestao: row.termo_oficial,
      })
    }
  }

  return {
    resultado,
    step: {
      camada: 'regional',
      texto_entrada: original,
      texto_saida: resultado,
      transformacao: substituicoes.length > 0
        ? `Normalizados ${substituicoes.length} regionalismo(s): ${substituicoes.slice(0, 3).join(', ')}${substituicoes.length > 3 ? '...' : ''}`
        : null,
      confianca: substituicoes.length > 0 ? 0.90 : 1.0,
      detalhes: substituicoes.length > 0 ? { substituicoes } : undefined,
    },
    alertas,
  }
}
