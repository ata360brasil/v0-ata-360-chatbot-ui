/**
 * ATA360 — Camada 1: Tokenização e normalização de texto.
 *
 * Aplica: lowercase, Unicode NFC, remoção de acentos duplicados,
 * normalização de espaços, remoção de caracteres de controle.
 */

import type { PipelineStep } from './types'

/**
 * Normaliza texto para busca: lowercase, NFC, normaliza espaços.
 * NÃO remove acentos (preserva "pão" vs "pao" para match exato).
 * Remove apenas caracteres de controle e espaços extras.
 */
export function tokenize(texto: string): { resultado: string; step: PipelineStep } {
  const original = texto

  let resultado = texto
    // Unicode NFC normalization (compose diacritics)
    .normalize('NFC')
    // Lowercase (locale-aware for pt-BR)
    .toLowerCase()
    // Remove zero-width characters and control chars (keep newlines)
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    // Normalize various dash types to hyphen
    .replace(/[\u2013\u2014\u2015\u2212]/g, '-')
    // Normalize quotes
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    // Collapse multiple spaces/tabs into single space
    .replace(/[ \t]+/g, ' ')
    // Trim
    .trim()

  const changed = resultado !== original.toLowerCase().trim()

  return {
    resultado,
    step: {
      camada: 'tokenize',
      texto_entrada: original,
      texto_saida: resultado,
      transformacao: changed ? 'Normalização Unicode + lowercase + espaços' : null,
      confianca: 1.0,
    },
  }
}

/**
 * Variante que REMOVE acentos — usada apenas para busca fuzzy.
 * "pão francês" → "pao frances"
 */
export function removeAccents(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
}

/**
 * Extrai tokens significativos (remove stopwords pt-BR).
 * Usado para busca FTS e matching.
 */
export function extractTokens(texto: string): string[] {
  const STOPWORDS_PT = new Set([
    'a', 'o', 'e', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'um', 'uma', 'uns', 'umas', 'por', 'para', 'com', 'sem', 'que', 'se', 'ou',
    'ao', 'aos', 'à', 'às', 'pelo', 'pela', 'pelos', 'pelas', 'este', 'esta',
    'esse', 'essa', 'aquele', 'aquela', 'isto', 'isso', 'aquilo', 'mais', 'menos',
    'muito', 'pouco', 'todo', 'toda', 'todos', 'todas', 'ser', 'ter', 'estar',
    'ir', 'vir', 'fazer', 'poder', 'dever', 'haver', 'querer', 'saber',
    'como', 'quando', 'onde', 'porque', 'já', 'ainda', 'também', 'só',
    'não', 'sim', 'mas', 'porém', 'contudo', 'entretanto', 'todavia',
    'tipo', 'até', 'entre', 'sobre', 'sob', 'após', 'antes', 'durante',
  ])

  return texto
    .split(/[\s,;:.!?()[\]{}]+/)
    .filter(t => t.length > 1 && !STOPWORDS_PT.has(t))
}
