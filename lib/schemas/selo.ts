/**
 * Selo ATA360 — Governança Ouro.
 *
 * NÃO é decorativo — é atestado de qualidade que certifica:
 * - Conformidade Lei 14.133/2021
 * - Boa-fé + dados oficiais
 * - Validação AUDITOR aprovada
 *
 * Lógica condicional (spec 19.10.3):
 *   CONFORME → selo PRESENTE
 *   RESSALVAS corrigidas ou não críticas → selo PRESENTE
 *   NÃO CONFORME + usuário insistiu → selo AUSENTE (silencioso)
 *
 * @see Spec v8 Part 19.10 — Selo de Qualidade
 * @see Spec v8 Part 17 — Documento Mestre Bloco 15
 */
import { z } from 'zod'

// ─── Selo Metadata ─────────────────────────────────────────────────────────

export const seloMetadataSchema = z.object({
  selo_aprovado: z.boolean(),
  // Dados que ficam NO selo (público)
  selo_visual: z.object({
    texto_arco_superior: z.literal('CERTIFICADO DE QUALIDADE ATA360'),
    texto_centro: z.literal('GOVERNANÇA OURO'),
    texto_arco_inferior: z.literal('INFRAESTRUTURA DE DADOS OFICIAIS DO BRASIL'),
    arquivo: z.literal('selo-ata360-governanca-ouro.png'),
  }).optional(),
  // Dados que NÃO ficam no PDF (Part 19 — sigilo)
  motivo_ausencia: z.enum([
    'NAO_CONFORME_USUARIO_INSISTIU',
    'PENDENTE_AUDITORIA',
    'PROCESSO_DESCARTADO',
  ]).nullable(),
  // Rastreabilidade
  auditor_versao: z.string(), // ex: 'AUDITOR_v3'
  hash_documento: z.string(),
  timestamp_decisao: z.string(),
  carimbo_serpro: z.object({
    tsa_serial: z.string(),
    timestamp: z.string(),
  }).nullable(),
  assinatura_icp: z.object({
    certificado_emissor: z.string(),
    valido_ate: z.string(),
  }).nullable(),
})

export type SeloMetadata = z.infer<typeof seloMetadataSchema>

// ─── Regra de cálculo selo_aprovado (Orquestrador Part 20.6) ─────────────

export function calcularSeloAprovado(
  veredicto: 'CONFORME' | 'NAO_CONFORME' | 'RESSALVAS',
  decisao_usuario: 'APROVAR' | 'PROSSEGUIR' | null,
): boolean {
  if (veredicto === 'CONFORME') return true
  if (veredicto === 'RESSALVAS' && decisao_usuario === 'APROVAR') return true
  // NAO_CONFORME + PROSSEGUIR → sem selo (silencioso, Part 19.10.3)
  return false
}
