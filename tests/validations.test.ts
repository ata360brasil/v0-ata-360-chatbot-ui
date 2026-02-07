import { describe, it, expect } from 'vitest'
import {
  cpfSchema,
  cnpjSchema,
  phoneSchema,
  emailSchema,
  teamMemberSchema,
  contractSchema,
  processSchema,
  passwordSchema,
  sanitize,
} from '@/lib/validations'

describe('cpfSchema', () => {
  it('accepts valid CPF format', () => {
    expect(cpfSchema.safeParse('123.456.789-00').success).toBe(true)
  })

  it('rejects CPF without dots', () => {
    expect(cpfSchema.safeParse('12345678900').success).toBe(false)
  })

  it('rejects CPF with wrong separator', () => {
    expect(cpfSchema.safeParse('123-456-789.00').success).toBe(false)
  })

  it('rejects empty string', () => {
    expect(cpfSchema.safeParse('').success).toBe(false)
  })
})

describe('cnpjSchema', () => {
  it('accepts valid CNPJ format', () => {
    expect(cnpjSchema.safeParse('12.345.678/0001-90').success).toBe(true)
  })

  it('rejects CNPJ without formatting', () => {
    expect(cnpjSchema.safeParse('12345678000190').success).toBe(false)
  })

  it('rejects partial CNPJ', () => {
    expect(cnpjSchema.safeParse('12.345.678').success).toBe(false)
  })
})

describe('phoneSchema', () => {
  it('accepts valid mobile phone with 9 digits', () => {
    expect(phoneSchema.safeParse('(31) 99999-1234').success).toBe(true)
  })

  it('accepts valid landline with 8 digits', () => {
    expect(phoneSchema.safeParse('(31) 3333-1234').success).toBe(true)
  })

  it('accepts phone without space after area code', () => {
    expect(phoneSchema.safeParse('(31)99999-1234').success).toBe(true)
  })

  it('rejects phone without area code', () => {
    expect(phoneSchema.safeParse('99999-1234').success).toBe(false)
  })
})

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true)
  })

  it('rejects email without @', () => {
    expect(emailSchema.safeParse('userexample.com').success).toBe(false)
  })

  it('rejects email exceeding 255 chars', () => {
    const longEmail = 'a'.repeat(250) + '@b.com'
    expect(emailSchema.safeParse(longEmail).success).toBe(false)
  })
})

describe('teamMemberSchema', () => {
  const validMember = {
    fullName: 'Maria da Silva',
    cpf: '123.456.789-00',
    rg: '12345678',
    matricula: 'MAT001',
    position: 'Analista',
    role: 'Pregoeiro',
    sector: 'Licitações',
    email: 'maria@gov.br',
    phone: '(31) 99999-1234',
    birthday: '1990-01-15',
  }

  it('accepts valid team member', () => {
    expect(teamMemberSchema.safeParse(validMember).success).toBe(true)
  })

  it('rejects member with short name', () => {
    const result = teamMemberSchema.safeParse({ ...validMember, fullName: 'ab' })
    expect(result.success).toBe(false)
  })

  it('accepts optional email2 as empty string', () => {
    const result = teamMemberSchema.safeParse({ ...validMember, email2: '' })
    expect(result.success).toBe(true)
  })

  it('accepts optional whatsapp as empty string', () => {
    const result = teamMemberSchema.safeParse({ ...validMember, whatsapp: '' })
    expect(result.success).toBe(true)
  })
})

describe('contractSchema', () => {
  const validContract = {
    processNumber: '2024/0001',
    bidNumber: 'PE-001/2024',
    mainObject: 'Aquisição de material de escritório para o departamento administrativo',
    totalValue: 50000,
    supplier: {
      name: 'ABC Ltda',
      cnpj: '12.345.678/0001-90',
    },
  }

  it('accepts valid contract', () => {
    expect(contractSchema.safeParse(validContract).success).toBe(true)
  })

  it('rejects contract with zero value', () => {
    const result = contractSchema.safeParse({ ...validContract, totalValue: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects contract with negative value', () => {
    const result = contractSchema.safeParse({ ...validContract, totalValue: -100 })
    expect(result.success).toBe(false)
  })

  it('rejects short object description', () => {
    const result = contractSchema.safeParse({ ...validContract, mainObject: 'curto' })
    expect(result.success).toBe(false)
  })
})

describe('processSchema', () => {
  it('accepts valid process', () => {
    const result = processSchema.safeParse({
      processNumber: '2024/0001',
      title: 'Pregão Eletrônico para aquisição de equipamentos',
      department: 'TI',
      estimatedValue: 150000,
    })
    expect(result.success).toBe(true)
  })

  it('rejects process with empty number', () => {
    const result = processSchema.safeParse({
      processNumber: '',
      title: 'Valid Title',
      department: 'TI',
      estimatedValue: 1000,
    })
    expect(result.success).toBe(false)
  })
})

describe('passwordSchema', () => {
  it('accepts strong password with matching confirmation', () => {
    const result = passwordSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: 'MyStr0ng!Pass',
      confirmPassword: 'MyStr0ng!Pass',
    })
    expect(result.success).toBe(true)
  })

  it('rejects password shorter than 12 chars', () => {
    const result = passwordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'Short1!',
      confirmPassword: 'Short1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without uppercase', () => {
    const result = passwordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'alllowercase1!',
      confirmPassword: 'alllowercase1!',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without special char', () => {
    const result = passwordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'NoSpecialChar1',
      confirmPassword: 'NoSpecialChar1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched confirmation', () => {
    const result = passwordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'MyStr0ng!Pass',
      confirmPassword: 'Different!Pass1',
    })
    expect(result.success).toBe(false)
  })
})

describe('sanitize', () => {
  it('escapes HTML angle brackets', () => {
    expect(sanitize('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes ampersands', () => {
    expect(sanitize('foo & bar')).toBe('foo &amp; bar')
  })

  it('escapes quotes', () => {
    expect(sanitize('He said "hello"')).toBe('He said &quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(sanitize("it's")).toBe('it&#x27;s')
  })

  it('preserves safe strings', () => {
    expect(sanitize('Compras públicas 2024')).toBe('Compras públicas 2024')
  })

  it('handles empty string', () => {
    expect(sanitize('')).toBe('')
  })
})
