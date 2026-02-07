import { describe, it, expect, beforeEach } from 'vitest'
import {
  anonymizeCPF,
  anonymizeCNPJ,
  anonymizeEmail,
  anonymizeName,
  isExpired,
  RETENTION_POLICIES,
  getConsent,
  setConsent,
  hasConsent,
  revokeAllConsent,
} from '@/lib/lgpd'

describe('anonymizeCPF', () => {
  it('masks middle digits of CPF', () => {
    expect(anonymizeCPF('123.456.789-00')).toBe('123.***.***-00')
  })

  it('returns fully masked for short input', () => {
    expect(anonymizeCPF('123')).toBe('***.***.***-**')
  })
})

describe('anonymizeCNPJ', () => {
  it('masks middle digits of CNPJ', () => {
    const result = anonymizeCNPJ('12.345.678/0001-90')
    expect(result).toContain('***')
    expect(result).toContain('-90')
  })

  it('returns fully masked for short input', () => {
    expect(anonymizeCNPJ('12.345')).toBe('**.***.***/**01-**')
  })
})

describe('anonymizeEmail', () => {
  it('keeps first 2 chars of local part', () => {
    expect(anonymizeEmail('usuario@dominio.com')).toBe('us***@dominio.com')
  })

  it('handles single char local part', () => {
    expect(anonymizeEmail('u@d.com')).toBe('u***@d.com')
  })

  it('handles missing domain', () => {
    expect(anonymizeEmail('nodomain')).toBe('***@***')
  })
})

describe('anonymizeName', () => {
  it('keeps first name, abbreviates rest', () => {
    expect(anonymizeName('Maria da Silva')).toBe('Maria d. S.')
  })

  it('returns single name unchanged', () => {
    expect(anonymizeName('Maria')).toBe('Maria')
  })

  it('handles compound names', () => {
    expect(anonymizeName('João Carlos de Oliveira Filho')).toBe('João C. d. O. F.')
  })
})

describe('isExpired', () => {
  it('returns false for recent data', () => {
    const now = new Date().toISOString()
    expect(isExpired(now, 30)).toBe(false)
  })

  it('returns true for data beyond retention', () => {
    const old = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString()
    expect(isExpired(old, 30)).toBe(true)
  })

  it('returns false for data at boundary', () => {
    const boundary = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
    expect(isExpired(boundary, 30)).toBe(false)
  })
})

describe('RETENTION_POLICIES', () => {
  it('has all required categories', () => {
    const categories = RETENTION_POLICIES.map(p => p.category)
    expect(categories).toContain('audit_logs')
    expect(categories).toContain('conversation_history')
    expect(categories).toContain('session_data')
    expect(categories).toContain('analytics')
  })

  it('audit logs have 5-year retention (legal requirement)', () => {
    const audit = RETENTION_POLICIES.find(p => p.category === 'audit_logs')
    expect(audit?.retentionDays).toBe(1825)
  })

  it('all policies reference LGPD articles', () => {
    RETENTION_POLICIES.forEach(policy => {
      expect(policy.legalBasis).toMatch(/Art\. 7/)
    })
  })
})

describe('consent management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no consent set', () => {
    expect(getConsent()).toEqual([])
  })

  it('essential consent is always granted', () => {
    expect(hasConsent('essential')).toBe(true)
  })

  it('analytics consent is false by default', () => {
    expect(hasConsent('analytics')).toBe(false)
  })

  it('sets and retrieves consent', () => {
    setConsent('analytics', true)
    expect(hasConsent('analytics')).toBe(true)
  })

  it('revokes specific consent', () => {
    setConsent('analytics', true)
    setConsent('analytics', false)
    expect(hasConsent('analytics')).toBe(false)
  })

  it('revokes all consent', () => {
    setConsent('analytics', true)
    setConsent('communication', true)
    revokeAllConsent()
    expect(hasConsent('analytics')).toBe(false)
    expect(hasConsent('communication')).toBe(false)
  })
})
