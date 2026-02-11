/**
 * Input Masks & Auto-Formatting — Brazilian Standard Fields
 *
 * Reconhecimento automatico e formatacao de:
 * - CPF: 000.000.000-00
 * - CNPJ: 00.000.000/0000-00
 * - Telefone: (00) 00000-0000 (celular) / (00) 0000-0000 (fixo)
 * - CEP: 00000-000
 * - Data: dd/mm/aaaa
 * - Moeda: R$ 0,00
 * - Email: validacao @
 * - URL/Site: https://
 * - Processo: 00000.000000/0000-00
 *
 * @see ABNT NBR 14724 — formatacao de documentos
 * @see Receita Federal — padroes CPF/CNPJ
 */

// ─── MASK FUNCTIONS ─────────────────────────────────────────────────────────

/** Remove tudo que nao e digito */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** Mascara CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/** Mascara CNPJ: 00.000.000/0000-00 */
export function maskCNPJ(value: string): string {
  const d = digitsOnly(value).slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

/** Mascara Telefone: (00) 00000-0000 ou (00) 0000-0000 */
export function maskPhone(value: string): string {
  const d = digitsOnly(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Mascara CEP: 00000-000 */
export function maskCEP(value: string): string {
  const d = digitsOnly(value).slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

/** Mascara Data: dd/mm/aaaa */
export function maskDate(value: string): string {
  const d = digitsOnly(value).slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/** Mascara Moeda BRL: R$ 0,00 */
export function maskBRL(value: string): string {
  const d = digitsOnly(value)
  if (!d) return ''
  const num = parseInt(d, 10)
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(num / 100)
  return formatted
}

/** Mascara Processo Licitatorio: 00000.000000/0000-00 */
export function maskProcessNumber(value: string): string {
  const d = digitsOnly(value).slice(0, 17)
  if (d.length <= 5) return d
  if (d.length <= 11) return `${d.slice(0, 5)}.${d.slice(5)}`
  if (d.length <= 15) return `${d.slice(0, 5)}.${d.slice(5, 11)}/${d.slice(11)}`
  return `${d.slice(0, 5)}.${d.slice(5, 11)}/${d.slice(11, 15)}-${d.slice(15)}`
}

// ─── VALIDATORS (algorithmic) ───────────────────────────────────────────────

/** Valida CPF com digitos verificadores */
export function validateCPF(cpf: string): boolean {
  const d = digitsOnly(cpf)
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false // todos iguais

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(d.charAt(i), 10) * (10 - i)
  let check = 11 - (sum % 11)
  if (check >= 10) check = 0
  if (parseInt(d.charAt(9), 10) !== check) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(d.charAt(i), 10) * (11 - i)
  check = 11 - (sum % 11)
  if (check >= 10) check = 0
  return parseInt(d.charAt(10), 10) === check
}

/** Valida CNPJ com digitos verificadores */
export function validateCNPJ(cnpj: string): boolean {
  const d = digitsOnly(cnpj)
  if (d.length !== 14) return false
  if (/^(\d)\1{13}$/.test(d)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(d.charAt(i), 10) * (weights1[i] ?? 0)
  let check = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (parseInt(d.charAt(12), 10) !== check) return false

  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(d.charAt(i), 10) * (weights2[i] ?? 0)
  check = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return parseInt(d.charAt(13), 10) === check
}

/** Valida data dd/mm/aaaa */
export function validateDate(dateStr: string): boolean {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false
  const dd = match[1] ?? '00'
  const mm = match[2] ?? '00'
  const yyyy = match[3] ?? '0000'
  const day = parseInt(dd, 10)
  const month = parseInt(mm, 10)
  const year = parseInt(yyyy, 10)
  if (month < 1 || month > 12) return false
  if (year < 1900 || year > 2100) return false
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

/** Valida email */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/** Valida URL/site */
export function validateURL(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/** Valida telefone brasileiro (fixo ou celular) */
export function validatePhone(phone: string): boolean {
  const d = digitsOnly(phone)
  // Celular: 11 digitos (DDD + 9 + 8 digitos)
  // Fixo: 10 digitos (DDD + 8 digitos)
  if (d.length !== 10 && d.length !== 11) return false
  const ddd = parseInt(d.slice(0, 2), 10)
  if (ddd < 11 || ddd > 99) return false
  // Celular comeca com 9
  if (d.length === 11 && d.charAt(2) !== '9') return false
  return true
}

/** Valida CEP */
export function validateCEP(cep: string): boolean {
  return digitsOnly(cep).length === 8
}

// ─── AUTO-DETECT FIELD TYPE ──────────────────────────────────────────────────

export type FieldType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date' | 'brl' | 'email' | 'url' | 'process' | 'text'

/** Detecta automaticamente o tipo de campo baseado no valor digitado */
export function detectFieldType(value: string): FieldType {
  const trimmed = value.trim()

  // Email (contem @)
  if (trimmed.includes('@') && /\S+@\S+/.test(trimmed)) return 'email'

  // URL (contem . e parece dominio)
  if (/^(https?:\/\/|www\.)/.test(trimmed)) return 'url'

  // Moeda (comeca com R$ ou contem ,XX no final)
  if (/^R\$/.test(trimmed) || /^\d{1,3}(\.\d{3})*,\d{2}$/.test(trimmed)) return 'brl'

  const digits = digitsOnly(trimmed)

  // CPF (11 digitos ou formato XXX.XXX.XXX-XX)
  if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(trimmed) || (digits.length === 11 && !trimmed.includes('/'))) return 'cpf'

  // CNPJ (14 digitos ou formato XX.XXX.XXX/XXXX-XX)
  if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(trimmed) || digits.length === 14) return 'cnpj'

  // Telefone (10-11 digitos com DDD)
  if (/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(trimmed)) return 'phone'

  // CEP (8 digitos ou XXXXX-XXX)
  if (/^\d{5}-\d{3}$/.test(trimmed) || (digits.length === 8 && trimmed.length <= 9)) return 'cep'

  // Data (dd/mm/aaaa)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return 'date'

  // Processo (00000.000000/0000-00)
  if (/^\d{5}\.\d{6}\/\d{4}-\d{2}$/.test(trimmed)) return 'process'

  return 'text'
}

/** Aplica mascara automatica baseada no tipo detectado ou especificado */
export function autoMask(value: string, fieldType?: FieldType): string {
  const type = fieldType ?? detectFieldType(value)
  switch (type) {
    case 'cpf': return maskCPF(value)
    case 'cnpj': return maskCNPJ(value)
    case 'phone': return maskPhone(value)
    case 'cep': return maskCEP(value)
    case 'date': return maskDate(value)
    case 'brl': return maskBRL(value)
    case 'process': return maskProcessNumber(value)
    default: return value
  }
}

/** Valida campo baseado no tipo */
export function autoValidate(value: string, fieldType: FieldType): { valid: boolean; message?: string } {
  switch (fieldType) {
    case 'cpf':
      return validateCPF(value) ? { valid: true } : { valid: false, message: 'CPF invalido (digitos verificadores)' }
    case 'cnpj':
      return validateCNPJ(value) ? { valid: true } : { valid: false, message: 'CNPJ invalido (digitos verificadores)' }
    case 'phone':
      return validatePhone(value) ? { valid: true } : { valid: false, message: 'Telefone invalido (use DDD + numero)' }
    case 'cep':
      return validateCEP(value) ? { valid: true } : { valid: false, message: 'CEP invalido (8 digitos)' }
    case 'date':
      return validateDate(value) ? { valid: true } : { valid: false, message: 'Data invalida (dd/mm/aaaa)' }
    case 'email':
      return validateEmail(value) ? { valid: true } : { valid: false, message: 'Email invalido' }
    case 'url':
      return validateURL(value) ? { valid: true } : { valid: false, message: 'URL invalida' }
    default:
      return { valid: true }
  }
}

// ─── SOCIAL MEDIA VALIDATORS ────────────────────────────────────────────────

export function validateInstagram(handle: string): boolean {
  return /^@?[a-zA-Z0-9._]{1,30}$/.test(handle.trim())
}

export function validateLinkedIn(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/.test(url.trim())
}

export function validateFacebook(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.-]+\/?$/.test(url.trim())
}

// ─── PARSE BRL TO NUMBER ─────────────────────────────────────────────────────

/** Converte "R$ 1.234,56" para 123456 (centavos) */
export function parseBRL(formatted: string): number {
  const clean = formatted.replace(/[R$\s.]/g, '').replace(',', '.')
  return Math.round(parseFloat(clean || '0') * 100)
}

/** Converte centavos para display "R$ 1.234,56" */
export function formatBRLDisplay(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}
