/**
 * SERPRO Schemas — 9 contratos, 13 APIs + 4 Timestamps = 17 serviços.
 *
 * @see SERPRO Datavalid v4
 * @see Spec v8 Part 15 — Integrações SERPRO
 */
import { z } from 'zod'

// ─── Contratos SERPRO ──────────────────────────────────────────────────────

export const SerproContrato = {
  NFE: '266253',
  CNPJ: '266287',
  CPF: '266310',
  DATAVALID: '266318',
  DIVIDA_ATIVA: '266324',
  CND: '266331',
  FATURAMENTO: '266334',
  CARIMBO_TEMPO: '266338',
  RENDA: '266343',
} as const

export type SerproContrato = (typeof SerproContrato)[keyof typeof SerproContrato]

// ─── CNPJ v2 ───────────────────────────────────────────────────────────────

export const cnpjResponseSchema = z.object({
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string().nullable(),
  situacao_cadastral: z.string(),
  data_situacao_cadastral: z.string(),
  natureza_juridica: z.string(),
  porte: z.string().nullable(),
  capital_social: z.number().nullable(),
  endereco: z.object({
    logradouro: z.string(),
    numero: z.string(),
    complemento: z.string().nullable(),
    bairro: z.string(),
    municipio: z.string(),
    uf: z.string(),
    cep: z.string(),
  }).nullable(),
  atividade_principal: z.object({
    codigo: z.string(),
    descricao: z.string(),
  }).nullable(),
})

export type CnpjResponse = z.infer<typeof cnpjResponseSchema>

// ─── CPF v2 ────────────────────────────────────────────────────────────────

export const cpfResponseSchema = z.object({
  cpf: z.string(),
  nome: z.string(),
  situacao_cadastral: z.string(),
  data_nascimento: z.string().nullable(),
})

export type CpfResponse = z.infer<typeof cpfResponseSchema>

// ─── CND (Certidão Negativa de Débitos) ─────────────────────────────────────

export const cndResponseSchema = z.object({
  cnpj: z.string(),
  situacao: z.enum(['REGULAR', 'IRREGULAR', 'PENDENTE']),
  data_emissao: z.string(),
  data_validade: z.string(),
  numero_certidao: z.string().nullable(),
})

export type CndResponse = z.infer<typeof cndResponseSchema>

// ─── DATAVALID v4 ──────────────────────────────────────────────────────────

export const datavalidResponseSchema = z.object({
  cpf: z.string(),
  nome_valido: z.boolean(),
  data_nascimento_valida: z.boolean(),
  foto_valida: z.boolean().nullable(),
  score_biometria: z.number().min(0).max(100).nullable(),
})

export type DatavalidResponse = z.infer<typeof datavalidResponseSchema>

// ─── Dívida Ativa ──────────────────────────────────────────────────────────

export const dividaAtivaResponseSchema = z.object({
  cnpj: z.string(),
  inscricoes: z.array(z.object({
    numero: z.string(),
    valor: z.number(),
    situacao: z.string(),
    data_inscricao: z.string(),
  })),
  total_divida: z.number(),
})

export type DividaAtivaResponse = z.infer<typeof dividaAtivaResponseSchema>

// ─── Carimbo de Tempo ──────────────────────────────────────────────────────

export const carimboTempoRequestSchema = z.object({
  hash_sha256: z.string().length(64),
  documento_id: z.string(),
})

export const carimboTempoResponseSchema = z.object({
  timestamp: z.string(),
  hash_original: z.string(),
  assinatura_tempo: z.string(),
  tsa_serial: z.string(),
})

export type CarimboTempoResponse = z.infer<typeof carimboTempoResponseSchema>

// ─── NeoSigner (Assinatura ICP-Brasil) ──────────────────────────────────────

export const neoSignerResponseSchema = z.object({
  documento_id: z.string(),
  assinatura: z.string(),
  certificado_emissor: z.string(),
  valido_ate: z.string(),
  cadeia_confianca: z.boolean(),
})

export type NeoSignerResponse = z.infer<typeof neoSignerResponseSchema>
