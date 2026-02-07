import { describe, it, expect } from 'vitest'
import { FAQ_ITEMS } from '@/components/structured-data'

describe('FAQ_ITEMS', () => {
  it('has at least 5 FAQ entries', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(5)
  })

  it('each entry has question and answer', () => {
    FAQ_ITEMS.forEach(item => {
      expect(item.question).toBeTruthy()
      expect(item.answer).toBeTruthy()
      expect(item.question.endsWith('?')).toBe(true)
    })
  })

  it('covers key topics for AI-citability', () => {
    const allText = FAQ_ITEMS.map(i => `${i.question} ${i.answer}`).join(' ')
    expect(allText).toContain('Lei 14.133/2021')
    expect(allText).toContain('PNCP')
    expect(allText).toContain('LGPD')
    expect(allText).toContain('ata de registro de preços')
    expect(allText).toContain('Termo de Referência')
  })

  it('answers reference specific legal articles', () => {
    const lgpdAnswer = FAQ_ITEMS.find(i => i.question.includes('LGPD'))
    expect(lgpdAnswer?.answer).toContain('Art. 7')
    expect(lgpdAnswer?.answer).toContain('Art. 18')

    const ataAnswer = FAQ_ITEMS.find(i => i.question.includes('ata de registro'))
    expect(ataAnswer?.answer).toContain('Art. 6')
  })

  it('answers are substantive (at least 80 chars)', () => {
    FAQ_ITEMS.forEach(item => {
      expect(item.answer.length).toBeGreaterThanOrEqual(80)
    })
  })
})
