/**
 * Government APIs Schemas — 17 fontes, 110+ endpoints.
 *
 * Monostate entregou (10 fontes, 76+ endpoints):
 *   PNCP, Compras.gov, Transparência, TransfereGov,
 *   FNS, FNDE, IBGE, Câmara/Senado, TCU, SERPRO
 *
 * Roberto adicionou (7 fontes, ~30 endpoints):
 *   SICONFI/Tesouro, BCB, FNAS/SUAS, SINAPI/SICRO,
 *   LOA/SIOP, SIMEC (Painel Preços DESCONTINUADO → PNCP)
 *
 * @see Spec v8 Part 14 — APIs Governamentais
 * @see Spec v8 Part 3.2 — Insight Engine
 */
import { z } from 'zod'

// ─── PNCP (29 endpoints POC) ───────────────────────────────────────────────

export const pncpItemSchema = z.object({
  descricao: z.string(),
  catmat: z.string(),
  catser: z.string().nullable(),
  preco_unitario: z.number(),
  quantidade: z.number(),
  unidade: z.string(),
  orgao: z.string(),
  uasg: z.string().nullable(),
  data_publicacao: z.string(),
  fonte: z.literal('PNCP'),
})

export type PncpItem = z.infer<typeof pncpItemSchema>

export const pncpAtaSchema = z.object({
  numero_ata: z.string(),
  orgao_gerenciador: z.string(),
  validade: z.string(),
  itens: z.array(z.object({
    catmat: z.string(),
    descricao: z.string(),
    preco_registrado: z.number(),
    saldo_disponivel: z.number(),
    quantidade_empenhada: z.number(),
  })),
})

export type PncpAta = z.infer<typeof pncpAtaSchema>

// ─── Compras.gov / SIASG (8 endpoints) ──────────────────────────────────────

export const comprasGovPrecoSchema = z.object({
  preco_medio: z.number(),
  preco_mediana: z.number(),
  preco_menor: z.number(),
  preco_maior: z.number(),
  total_fontes: z.number(),
  data_pesquisa: z.string(),
})

export type ComprasGovPreco = z.infer<typeof comprasGovPrecoSchema>

// ─── Portal Transparência (10 endpoints) ────────────────────────────────────

export const sancaoSchema = z.object({
  tipo: z.enum(['CEIS', 'CNEP', 'CEPIM', 'CEAF']),
  cnpj: z.string(),
  razao_social: z.string(),
  sancionante: z.string(),
  data_inicio: z.string(),
  data_fim: z.string().nullable(),
  fundamentacao: z.string(),
})

export type Sancao = z.infer<typeof sancaoSchema>

// ─── TransfereGov (6 endpoints) ─────────────────────────────────────────────

export const convenioSchema = z.object({
  numero: z.string(),
  situacao: z.enum(['PROPOSTA', 'APROVADO', 'CONTRATADO', 'EM_EXECUCAO', 'PRESTACAO_CONTAS', 'APROVADO_CONTAS', 'CONCLUIDO']),
  valor_global: z.number(),
  valor_repasse: z.number(),
  valor_contrapartida: z.number(),
  data_inicio: z.string(),
  data_fim: z.string(),
  orgao_concedente: z.string(),
  proponente: z.string(),
})

export type Convenio = z.infer<typeof convenioSchema>

// ─── IBGE (4 endpoints) ─────────────────────────────────────────────────────

export const ibgeMunicipioSchema = z.object({
  codigo_ibge: z.string(),
  nome: z.string(),
  uf: z.string(),
  populacao: z.number().nullable(),
  pib_per_capita: z.number().nullable(),
  idh: z.number().nullable(),
  area_km2: z.number().nullable(),
})

export type IbgeMunicipio = z.infer<typeof ibgeMunicipioSchema>

// ─── TCU (2 endpoints) ──────────────────────────────────────────────────────

export const tcuAcordaoSchema = z.object({
  numero: z.string(),
  ano: z.number(),
  colegiado: z.enum(['PLENARIO', 'PRIMEIRA_CAMARA', 'SEGUNDA_CAMARA']),
  relator: z.string(),
  ementa: z.string(),
  fundamentacao: z.string(),
  data_julgamento: z.string(),
  relevancia: z.number().min(0).max(100),
})

export type TcuAcordao = z.infer<typeof tcuAcordaoSchema>

// ─── BCB — Índices Econômicos (4 séries) ────────────────────────────────────

export const bcbSerieSchema = z.object({
  serie: z.enum(['IPCA', 'IGPM', 'SELIC', 'DOLAR']),
  serie_id: z.number(), // 433, 189, 4390, 1
  valor: z.number(),
  data: z.string(),
})

export type BcbSerie = z.infer<typeof bcbSerieSchema>

// ─── SICONFI / Tesouro (4 endpoints) ────────────────────────────────────────

export const siconfiSchema = z.object({
  ente: z.string(),
  exercicio: z.number(),
  receita_corrente_liquida: z.number().nullable(),
  despesa_pessoal_percentual: z.number().nullable(),
  divida_consolidada: z.number().nullable(),
  limites_lrf: z.object({
    alerta: z.boolean(),
    prudencial: z.boolean(),
    maximo: z.boolean(),
  }).nullable(),
})

export type SiconfiDados = z.infer<typeof siconfiSchema>

// ─── FNS — Fundo Nacional de Saúde (5 endpoints) ───────────────────────────

export const fnsRepasseSchema = z.object({
  bloco: z.enum(['PAB', 'MAC', 'VIGIL', 'FARM', 'GEST']),
  competencia: z.string(),
  valor: z.number(),
  municipio_ibge: z.string(),
  status: z.enum(['CREDITADO', 'PROGRAMADO', 'DEVOLVIDO']),
})

export type FnsRepasse = z.infer<typeof fnsRepasseSchema>

// ─── FNDE (5 programas) ─────────────────────────────────────────────────────

export const fndeProgramaSchema = z.object({
  programa: z.enum(['PNAE', 'PDDE', 'PNATE', 'FUNDEB', 'PROINFANCIA']),
  exercicio: z.number(),
  valor_previsto: z.number(),
  valor_repassado: z.number(),
  valor_executado: z.number(),
  municipio_ibge: z.string(),
})

export type FndePrograma = z.infer<typeof fndeProgramaSchema>

// ─── Radar de Recursos (Part 14 — 7 status) ─────────────────────────────────

export const RecursoStatus = {
  DISPONIVEL: 'DISPONIVEL',
  ELEGIVEL: 'ELEGIVEL',
  SUBUTILIZADO: 'SUBUTILIZADO',
  EM_EXECUCAO: 'EM_EXECUCAO',
  PERDIDO_DEVOLVIDO: 'PERDIDO_DEVOLVIDO',
  EM_RISCO: 'EM_RISCO',
  HISTORICO: 'HISTORICO',
} as const

export type RecursoStatus = (typeof RecursoStatus)[keyof typeof RecursoStatus]

export const recursoSchema = z.object({
  fonte: z.string(), // 'EMENDA_RP6', 'CONVENIO', 'FNS_PAB', 'FNDE_PNAE', etc.
  descricao: z.string(),
  valor: z.number(),
  status: z.nativeEnum(RecursoStatus),
  data_limite: z.string().nullable(),
  municipio_ibge: z.string(),
  acao_sugerida: z.string().nullable(),
})

export type Recurso = z.infer<typeof recursoSchema>
