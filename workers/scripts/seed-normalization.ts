/**
 * ATA360 — Seed Script: Popula tabelas D1 a partir dos JSONs de normalização.
 *
 * Uso via wrangler:
 *   npx wrangler d1 execute ATA360_NORMALIZACAO --local --file=workers/migrations/0001_normalization_tables.sql
 *   npx tsx workers/scripts/seed-normalization.ts --local
 *
 * Ou programaticamente dentro de um Worker (admin endpoint).
 *
 * Lê: data/normalizacao/*.json
 * Grava: D1 (7 tabelas)
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ─── Tipos dos JSONs ─────────────────────────────────────────────────────────

interface SinonimosJson {
  _meta: Record<string, unknown>
  setores: Record<string, Array<{
    termo_usuario: string
    termo_normalizado: string
    catmat_preferencial?: string
    variantes?: string[]
    confianca: number
    fonte?: string
    desambiguacao?: Record<string, string>
  }>>
}

interface AbreviaturasJson {
  _meta: Record<string, unknown>
  categorias: Record<string, Array<{
    abreviatura: string
    expansao: string
    contexto?: string
  }>>
}

interface RegionalismosJson {
  _meta: Record<string, unknown>
  categorias: Record<string, Array<{
    termo_regional: string
    termo_oficial: string
    nome_cientifico?: string
    regiao?: string[]
    catmat?: string
    fonte?: string
    nota?: string
  }>>
}

interface MarcasGenericasJson {
  _meta: Record<string, unknown>
  categorias: Record<string, Array<{
    marca: string
    termo_generico: string
    catmat_grupo?: string
    alerta?: string
    exemplo_descritivo?: string
    base_legal_especifica?: string
  }>>
}

interface GlossarioTecnicoJson {
  _meta: Record<string, unknown>
  setores: Record<string, Array<{
    termo_popular: string
    termo_tecnico: string
    termo_legal?: string
    termo_cientifico?: string
    termo_catmat?: string
    definicao?: string
    norma?: string
    norma_especifica?: string
    catmat_grupo?: string
    anvisa?: boolean
  }>>
}

interface CatmatEnriquecidoJson {
  _meta: Record<string, unknown>
  codigos: Record<string, Array<{
    catmat?: string
    catser?: string
    descricao_oficial: string
    descricao_enriquecida?: string
    grupo?: string
    status?: string
    assertividade_base?: number
    volume_estimado?: string
    termos_busca?: string[]
    especificacoes?: Record<string, unknown> | Record<string, string>
    desambiguacao?: Record<string, string>
    variantes?: Record<string, string>
    codigos_relacionados?: string[]
    segmentos_uso?: string[]
    alerta?: string
    dcb?: string
    forma_farmaceutica?: string
  }>>
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function loadJson<T>(filename: string): T {
  const dataDir = resolve(__dirname, '../../data/normalizacao')
  const content = readFileSync(resolve(dataDir, filename), 'utf-8')
  return JSON.parse(content) as T
}

/** Gera SQL de INSERT com prepared statement placeholders */
function batchInsert(
  table: string,
  columns: string[],
  rows: unknown[][],
): { sql: string; batches: unknown[][] } {
  const placeholders = `(${columns.map(() => '?').join(',')})`
  const BATCH_SIZE = 50 // D1 limit per batch

  const batches: unknown[][] = []
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE).flat())
  }

  return {
    sql: `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders}`,
    batches,
  }
}

// ─── Seeders ─────────────────────────────────────────────────────────────────

export function prepareSinonimos(data: SinonimosJson): {
  termos: Array<{ sql: string; params: unknown[] }>
  variantes: Array<{ sql: string; params: unknown[] }>
} {
  const termoStmts: Array<{ sql: string; params: unknown[] }> = []
  const varianteStmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [setor, termos] of Object.entries(data.setores)) {
    for (const t of termos) {
      termoStmts.push({
        sql: `INSERT INTO termos_normalizados (termo_usuario, termo_normalizado, catmat_preferencial, setor, confianca, fonte, desambiguacao, origem) VALUES (?, ?, ?, ?, ?, ?, ?, 'seed')`,
        params: [
          t.termo_usuario.toLowerCase(),
          t.termo_normalizado,
          t.catmat_preferencial || null,
          setor,
          t.confianca,
          t.fonte || null,
          t.desambiguacao ? JSON.stringify(t.desambiguacao) : null,
        ],
      })

      if (t.variantes) {
        for (const v of t.variantes) {
          varianteStmts.push({
            sql: `INSERT INTO variantes (termo_id, variante, confianca) VALUES ((SELECT id FROM termos_normalizados WHERE termo_usuario = ? AND setor = ? LIMIT 1), ?, ?)`,
            params: [t.termo_usuario.toLowerCase(), setor, v.toLowerCase(), t.confianca * 0.9],
          })
        }
      }
    }
  }

  return { termos: termoStmts, variantes: varianteStmts }
}

export function prepareAbreviaturas(data: AbreviaturasJson): Array<{ sql: string; params: unknown[] }> {
  const stmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [categoria, items] of Object.entries(data.categorias)) {
    for (const item of items) {
      stmts.push({
        sql: `INSERT INTO abreviaturas (abreviatura, expansao, contexto, categoria) VALUES (?, ?, ?, ?)`,
        params: [item.abreviatura, item.expansao, item.contexto || null, categoria],
      })
    }
  }

  return stmts
}

export function prepareRegionalismos(data: RegionalismosJson): Array<{ sql: string; params: unknown[] }> {
  const stmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [categoria, items] of Object.entries(data.categorias)) {
    for (const item of items) {
      stmts.push({
        sql: `INSERT INTO regionalismos (termo_regional, termo_oficial, nome_cientifico, regioes, catmat, categoria, fonte, nota) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          item.termo_regional.toLowerCase(),
          item.termo_oficial,
          item.nome_cientifico || null,
          JSON.stringify(item.regiao || []),
          item.catmat || null,
          categoria,
          item.fonte || null,
          item.nota || null,
        ],
      })
    }
  }

  return stmts
}

export function prepareMarcasGenericas(data: MarcasGenericasJson): Array<{ sql: string; params: unknown[] }> {
  const stmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [categoria, items] of Object.entries(data.categorias)) {
    for (const item of items) {
      stmts.push({
        sql: `INSERT INTO marcas_genericas (marca, termo_generico, catmat_grupo, categoria, alerta, exemplo_descritivo, base_legal_especifica) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params: [
          item.marca.toLowerCase(),
          item.termo_generico,
          item.catmat_grupo || null,
          categoria,
          item.alerta || null,
          item.exemplo_descritivo || null,
          item.base_legal_especifica || null,
        ],
      })
    }
  }

  return stmts
}

export function prepareGlossarioTecnico(data: GlossarioTecnicoJson): Array<{ sql: string; params: unknown[] }> {
  const stmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [setor, items] of Object.entries(data.setores)) {
    for (const item of items) {
      stmts.push({
        sql: `INSERT INTO glossario_tecnico (termo_popular, termo_tecnico, termo_legal, termo_cientifico, termo_catmat, definicao, norma, norma_especifica, setor, catmat_grupo, anvisa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          item.termo_popular.toLowerCase(),
          item.termo_tecnico,
          item.termo_legal || null,
          item.termo_cientifico || null,
          item.termo_catmat || null,
          item.definicao || null,
          item.norma || null,
          item.norma_especifica || null,
          setor,
          item.catmat_grupo || null,
          item.anvisa ? 1 : 0,
        ],
      })
    }
  }

  return stmts
}

export function prepareCatmatEnriquecido(data: CatmatEnriquecidoJson): Array<{ sql: string; params: unknown[] }> {
  const stmts: Array<{ sql: string; params: unknown[] }> = []

  for (const [categoria, items] of Object.entries(data.codigos)) {
    if (categoria.startsWith('_')) continue // skip _nota, etc.

    for (const item of items) {
      const codigo = item.catmat || item.catser || ''
      const tipo = item.catser ? 'catser' : 'catmat'
      if (!codigo) continue

      stmts.push({
        sql: `INSERT INTO catmat_enriquecido (codigo, tipo, descricao_oficial, descricao_enriquecida, grupo, status, assertividade_base, volume_estimado, termos_busca, especificacoes, desambiguacao, variantes_catmat, codigos_relacionados, segmentos_uso, alerta, categoria, dcb, forma_farmaceutica) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          codigo,
          tipo,
          item.descricao_oficial,
          item.descricao_enriquecida || null,
          item.grupo || null,
          item.status || 'ATIVO',
          item.assertividade_base || 0.5,
          item.volume_estimado || null,
          JSON.stringify(item.termos_busca || []),
          item.especificacoes ? JSON.stringify(item.especificacoes) : null,
          item.desambiguacao ? JSON.stringify(item.desambiguacao) : null,
          item.variantes ? JSON.stringify(item.variantes) : null,
          item.codigos_relacionados ? JSON.stringify(item.codigos_relacionados) : null,
          item.segmentos_uso ? JSON.stringify(item.segmentos_uso) : null,
          item.alerta || null,
          categoria,
          item.dcb || null,
          item.forma_farmaceutica || null,
        ],
      })
    }
  }

  return stmts
}

// ─── Main (para uso via D1 HTTP API ou admin endpoint) ──────────────────────

export interface SeedResult {
  termos_normalizados: number
  variantes: number
  abreviaturas: number
  regionalismos: number
  marcas_genericas: number
  glossario_tecnico: number
  catmat_enriquecido: number
  total: number
}

/**
 * Executa seed em um D1Database.
 * Chamado por admin endpoint no Worker ou por script local.
 */
export async function seedAllTables(db: D1Database): Promise<SeedResult> {
  const sinonimos = loadJson<SinonimosJson>('sinonimos.json')
  const abreviaturas = loadJson<AbreviaturasJson>('abreviaturas.json')
  const regionalismos = loadJson<RegionalismosJson>('regionalismos.json')
  const marcas = loadJson<MarcasGenericasJson>('marcas_genericas.json')
  const glossario = loadJson<GlossarioTecnicoJson>('glossario_tecnico.json')
  const catmat = loadJson<CatmatEnriquecidoJson>('catmat_enriquecido.json')

  // Limpar tabelas antes de seed
  await db.batch([
    db.prepare('DELETE FROM variantes'),
    db.prepare('DELETE FROM termos_normalizados'),
    db.prepare('DELETE FROM abreviaturas'),
    db.prepare('DELETE FROM regionalismos'),
    db.prepare('DELETE FROM marcas_genericas'),
    db.prepare('DELETE FROM glossario_tecnico'),
    db.prepare('DELETE FROM catmat_enriquecido'),
  ])

  const result: SeedResult = {
    termos_normalizados: 0,
    variantes: 0,
    abreviaturas: 0,
    regionalismos: 0,
    marcas_genericas: 0,
    glossario_tecnico: 0,
    catmat_enriquecido: 0,
    total: 0,
  }

  // 1. Sinônimos + variantes
  const sinData = prepareSinonimos(sinonimos)
  for (const stmt of sinData.termos) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.termos_normalizados++
  }
  for (const stmt of sinData.variantes) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.variantes++
  }

  // 2. Abreviaturas
  const abrevData = prepareAbreviaturas(abreviaturas)
  for (const stmt of abrevData) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.abreviaturas++
  }

  // 3. Regionalismos
  const regData = prepareRegionalismos(regionalismos)
  for (const stmt of regData) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.regionalismos++
  }

  // 4. Marcas genéricas
  const marcaData = prepareMarcasGenericas(marcas)
  for (const stmt of marcaData) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.marcas_genericas++
  }

  // 5. Glossário técnico
  const glossData = prepareGlossarioTecnico(glossario)
  for (const stmt of glossData) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.glossario_tecnico++
  }

  // 6. CATMAT enriquecido
  const catmatData = prepareCatmatEnriquecido(catmat)
  for (const stmt of catmatData) {
    await db.prepare(stmt.sql).bind(...stmt.params).run()
    result.catmat_enriquecido++
  }

  result.total =
    result.termos_normalizados +
    result.variantes +
    result.abreviaturas +
    result.regionalismos +
    result.marcas_genericas +
    result.glossario_tecnico +
    result.catmat_enriquecido

  return result
}

// ─── D1Database type stub (para compilação standalone) ──────────────────────

declare global {
  interface D1Database {
    prepare(sql: string): D1PreparedStatement
    batch(stmts: D1PreparedStatement[]): Promise<D1Result[]>
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement
    run(): Promise<D1Result>
    first<T = unknown>(column?: string): Promise<T | null>
    all<T = unknown>(): Promise<D1Result<T>>
  }
  interface D1Result<T = unknown> {
    results?: T[]
    success: boolean
    meta: Record<string, unknown>
  }
}
