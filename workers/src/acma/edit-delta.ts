/**
 * ATA360 — ACMA Edit Delta Calculator
 *
 * Calcula a distância de edição entre o texto sugerido pelo ACMA
 * e o texto final do usuário, word-level (não char-level).
 *
 * Métricas:
 * - edit_distance: número de palavras alteradas (Levenshtein word-level)
 * - edit_ratio: % do texto que foi alterado (0.0 = aprovação total, 1.0 = reescrita)
 * - diferencas: diff detalhado por tipo (adicionadas, removidas, alteradas)
 *
 * @see Spec v8 Part 08 — ACMA Agent Learning
 */

export interface EditDelta {
  edit_distance: number
  edit_ratio: number
  diferencas: {
    adicionadas: string[]
    removidas: string[]
    alteradas: Array<{ original: string; corrigido: string }>
    total_palavras_original: number
    total_palavras_final: number
  }
}

/**
 * Calcula edit delta entre texto sugerido e texto final (word-level).
 */
export function calculateEditDelta(sugerido: string, final: string): EditDelta {
  const wordsA = tokenize(sugerido)
  const wordsB = tokenize(final)

  // Levenshtein word-level
  const distance = wordLevelLevenshtein(wordsA, wordsB)

  // Ratio: distância / max(len(A), len(B))
  const maxLen = Math.max(wordsA.length, wordsB.length)
  const ratio = maxLen > 0 ? distance / maxLen : 0

  // Diff detalhado
  const setA = new Set(wordsA)
  const setB = new Set(wordsB)

  const removidas = wordsA.filter(w => !setB.has(w))
  const adicionadas = wordsB.filter(w => !setA.has(w))

  // Palavras alteradas (heurística: palavras na mesma posição que mudaram)
  const alteradas: Array<{ original: string; corrigido: string }> = []
  const minLen = Math.min(wordsA.length, wordsB.length)
  for (let i = 0; i < minLen; i++) {
    if (wordsA[i] !== wordsB[i] && !removidas.includes(wordsA[i]) && !adicionadas.includes(wordsB[i])) {
      alteradas.push({ original: wordsA[i], corrigido: wordsB[i] })
    }
  }

  return {
    edit_distance: distance,
    edit_ratio: Math.round(ratio * 1000) / 1000, // 3 casas decimais
    diferencas: {
      adicionadas: [...new Set(adicionadas)].slice(0, 20),
      removidas: [...new Set(removidas)].slice(0, 20),
      alteradas: alteradas.slice(0, 20),
      total_palavras_original: wordsA.length,
      total_palavras_final: wordsB.length,
    },
  }
}

/**
 * Classifica a qualidade da sugestão com base no edit ratio.
 */
export function classifyEditQuality(editRatio: number): 'excelente' | 'bom' | 'regular' | 'ruim' {
  if (editRatio <= 0.05) return 'excelente' // <5% edição — quase perfeito
  if (editRatio <= 0.20) return 'bom'       // 5-20% edição — ajustes menores
  if (editRatio <= 0.50) return 'regular'   // 20-50% edição — edição significativa
  return 'ruim'                              // >50% edição — reescrita substancial
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sáàâãéèêíïóôõúùûçñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)
}

/**
 * Levenshtein distance at word level.
 * O(n*m) — aceitável para textos de documentos (tipicamente <2000 palavras).
 */
function wordLevelLevenshtein(a: string[], b: string[]): number {
  const n = a.length
  const m = b.length

  // Otimização: se um é vazio, distância = tamanho do outro
  if (n === 0) return m
  if (m === 0) return n

  // Usar 2 linhas ao invés de matriz completa (O(m) memória)
  let prev = new Array(m + 1)
  let curr = new Array(m + 1)

  for (let j = 0; j <= m; j++) prev[j] = j

  for (let i = 1; i <= n; i++) {
    curr[0] = i
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1]
      } else {
        curr[j] = 1 + Math.min(
          prev[j],      // delete
          curr[j - 1],  // insert
          prev[j - 1],  // replace
        )
      }
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[m]
}
