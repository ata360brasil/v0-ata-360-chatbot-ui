import { describe, it, expect } from 'vitest'
import {
  asCPF,
  asCNPJ,
  asEmail,
  asPhone,
  asProcessId,
  asContractId,
  asBRLCents,
  formatBRL,
  toBRLCents,
} from '@/lib/types'

describe('branded type factories', () => {
  it('creates CPF branded type', () => {
    const cpf = asCPF('123.456.789-00')
    expect(cpf).toBe('123.456.789-00')
  })

  it('creates CNPJ branded type', () => {
    const cnpj = asCNPJ('12.345.678/0001-90')
    expect(cnpj).toBe('12.345.678/0001-90')
  })

  it('creates Email branded type', () => {
    const email = asEmail('test@example.com')
    expect(email).toBe('test@example.com')
  })

  it('creates Phone branded type', () => {
    const phone = asPhone('(31) 99999-1234')
    expect(phone).toBe('(31) 99999-1234')
  })

  it('creates ProcessId branded type', () => {
    const id = asProcessId('PROC-2024-001')
    expect(id).toBe('PROC-2024-001')
  })

  it('creates ContractId branded type', () => {
    const id = asContractId('CT-2024-045')
    expect(id).toBe('CT-2024-045')
  })
})

describe('BRL currency utilities', () => {
  it('converts reais to cents', () => {
    const cents = toBRLCents(150.50)
    expect(cents).toBe(15050)
  })

  it('rounds cents correctly', () => {
    const cents = asBRLCents(99.999)
    expect(cents).toBe(100)
  })

  it('formats BRL from cents', () => {
    const cents = toBRLCents(1234.56)
    const formatted = formatBRL(cents)
    // pt-BR formatting: R$ 1.234,56
    expect(formatted).toContain('1.234')
    expect(formatted).toContain('56')
  })

  it('formats zero correctly', () => {
    const formatted = formatBRL(toBRLCents(0))
    expect(formatted).toContain('0,00')
  })

  it('formats large values', () => {
    const cents = toBRLCents(1500000)
    const formatted = formatBRL(cents)
    expect(formatted).toContain('1.500.000')
  })
})
