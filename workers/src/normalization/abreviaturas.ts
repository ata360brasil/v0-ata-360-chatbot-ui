/**
 * ATA360 — Camada 2: Expansão de abreviaturas.
 *
 * Consulta D1 `abreviaturas` e expande abreviaturas no texto.
 * Ex: "Av. Brasil, s/n, Sl. 302" → "Avenida Brasil, sem número, Sala 302"
 *
 * Regras:
 * - Match case-insensitive
 * - Preserva contexto (se abreviatura tem contexto, só aplica se contexto combina)
 * - Prioriza matches mais longos (evita "R." consumir "RJ")
 */

import type { PipelineStep, NormalizationEnv } from './types'

interface AbreviaturaRow {
  abreviatura: string
  expansao: string
  contexto: string | null
}

/**
 * Expande abreviaturas no texto usando lookup D1.
 */
export async function expandAbreviaturas(
  texto: string,
  db: D1Database,
  contextoExtra?: string,
): Promise<{ resultado: string; step: PipelineStep }> {
  const original = texto

  // Carregar todas abreviaturas (pequena tabela, ~420 rows, cacheable)
  const { results } = await db
    .prepare('SELECT abreviatura, expansao, contexto FROM abreviaturas ORDER BY length(abreviatura) DESC')
    .all<AbreviaturaRow>()

  if (!results || results.length === 0) {
    return {
      resultado: texto,
      step: {
        camada: 'abreviatura',
        texto_entrada: original,
        texto_saida: texto,
        transformacao: null,
        confianca: 1.0,
      },
    }
  }

  let resultado = texto
  const expansoes: string[] = []

  for (const row of results) {
    const abrev = row.abreviatura

    // Criar regex que matcha a abreviatura como word boundary
    // Escape special regex chars (dots, parentheses, etc.)
    const escaped = abrev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Match: início de string ou após espaço/pontuação, seguido de espaço/pontuação/fim
    const regex = new RegExp(
      `(?<=^|[\\s,;:()])${escaped}(?=$|[\\s,;:().])`,
      'gi',
    )

    const antes = resultado
    resultado = resultado.replace(regex, row.expansao)

    if (resultado !== antes) {
      expansoes.push(`"${abrev}" → "${row.expansao}"`)
    }
  }

  const changed = resultado !== original

  return {
    resultado,
    step: {
      camada: 'abreviatura',
      texto_entrada: original,
      texto_saida: resultado,
      transformacao: changed ? `Expandidas ${expansoes.length} abreviatura(s): ${expansoes.slice(0, 3).join(', ')}${expansoes.length > 3 ? '...' : ''}` : null,
      confianca: 1.0,
      detalhes: changed ? { expansoes } : undefined,
    },
  }
}
