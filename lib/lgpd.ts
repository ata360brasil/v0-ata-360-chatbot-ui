/**
 * LGPD (Lei Geral de Proteção de Dados — Lei 13.709/2018)
 *
 * Utilitários de compliance para proteção de dados pessoais.
 * Baseado nas diretrizes da ANPD e nos princípios de privacy-by-design.
 *
 * Referências:
 * - Danilo Doneda — arquiteto da LGPD
 * - Laura Schertel Mendes — pesquisadora em proteção de dados
 * - Guia Orientativo da ANPD
 */

// ─── CONSENT MANAGEMENT ──────────────────────────────────────────────────────

export type ConsentPurpose =
  | 'essential'       // Funcionamento básico da plataforma (Art. 7, V)
  | 'analytics'       // Métricas de uso e performance (Art. 7, IX)
  | 'ai_processing'   // Processamento de dados por IA/LLM (Art. 7, I)
  | 'communication'   // Notificações e comunicações (Art. 7, I)
  | 'third_party'     // Compartilhamento com terceiros (Art. 7, I)

export interface ConsentRecord {
  purpose: ConsentPurpose
  granted: boolean
  timestamp: string
  version: string
  ipHash?: string
}

const CONSENT_KEY = 'ata360_consent'
const CONSENT_VERSION = '1.0.0'

export function getConsent(): ConsentRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) as ConsentRecord[] : []
  } catch {
    return []
  }
}

export function setConsent(purpose: ConsentPurpose, granted: boolean): void {
  if (typeof window === 'undefined') return
  const records = getConsent().filter(r => r.purpose !== purpose)
  records.push({
    purpose,
    granted,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  })
  localStorage.setItem(CONSENT_KEY, JSON.stringify(records))
}

export function hasConsent(purpose: ConsentPurpose): boolean {
  if (purpose === 'essential') return true // Sempre permitido (Art. 7, V)
  return getConsent().some(r => r.purpose === purpose && r.granted)
}

export function revokeAllConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONSENT_KEY)
}

// ─── DATA ANONYMIZATION ──────────────────────────────────────────────────────

/**
 * Anonimiza CPF: 123.456.789-00 => 123.***.***-00
 */
export function anonymizeCPF(cpf: string): string {
  if (cpf.length < 14) return '***.***.***-**'
  return `${cpf.slice(0, 4)}***.***${cpf.slice(-3)}`
}

/** Anonimiza CNPJ mascarando dígitos centrais. */
export function anonymizeCNPJ(cnpj: string): string {
  if (cnpj.length < 18) return '**.***.***/**01-**'
  return `${cnpj.slice(0, 3)}***.***/${cnpj.slice(13)}`
}

/**
 * Anonimiza email: usuario@dominio.com => us***@dominio.com
 */
export function anonymizeEmail(email: string): string {
  const [local = '', domain] = email.split('@')
  if (!domain) return '***@***'
  const visible = Math.min(2, local.length)
  return `${local.slice(0, visible)}***@${domain}`
}

/**
 * Anonimiza telefone: (31) 99999-1234 => (31) *****-1234
 */
export function anonymizePhone(phone: string): string {
  const lastFour = phone.slice(-4)
  return phone.replace(/\d(?=.{4})/g, (match, offset) => {
    // Keep area code digits
    return offset < 4 ? match : '*'
  }).slice(0, -4) + lastFour
}

/**
 * Anonimiza nome: Maria da Silva => Maria d. S.
 */
export function anonymizeName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return name
  return [
    parts[0],
    ...parts.slice(1).map(p => `${p[0]}.`),
  ].join(' ')
}

// ─── DATA RETENTION ──────────────────────────────────────────────────────────

export interface RetentionPolicy {
  category: string
  retentionDays: number
  legalBasis: string
}

/**
 * Políticas de retenção de dados conforme LGPD Art. 15 e 16.
 */
export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    category: 'audit_logs',
    retentionDays: 1825, // 5 anos (obrigação legal)
    legalBasis: 'Art. 7, II — Cumprimento de obrigação legal (Lei 14.133/2021)',
  },
  {
    category: 'conversation_history',
    retentionDays: 365,
    legalBasis: 'Art. 7, V — Execução de contrato',
  },
  {
    category: 'session_data',
    retentionDays: 30,
    legalBasis: 'Art. 7, IX — Interesse legítimo',
  },
  {
    category: 'analytics',
    retentionDays: 730, // 2 anos
    legalBasis: 'Art. 7, IX — Interesse legítimo (dados agregados/anonimizados)',
  },
]

/**
 * Verifica se um dado ultrapassou o período de retenção.
 */
export function isExpired(createdAt: string, retentionDays: number): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > retentionDays
}

// ─── DATA SUBJECT RIGHTS (Art. 18) ──────────────────────────────────────────

export type DataSubjectRight =
  | 'access'           // Art. 18, II — Acesso aos dados
  | 'rectification'    // Art. 18, III — Correção
  | 'anonymization'    // Art. 18, IV — Anonimização
  | 'deletion'         // Art. 18, VI — Eliminação
  | 'portability'      // Art. 18, V — Portabilidade
  | 'information'      // Art. 18, VII — Informação sobre compartilhamento
  | 'revocation'       // Art. 18, IX — Revogação de consentimento

export interface DataSubjectRequest {
  id: string
  right: DataSubjectRight
  requestedAt: string
  status: 'pending' | 'processing' | 'completed' | 'denied'
  reason?: string
}
