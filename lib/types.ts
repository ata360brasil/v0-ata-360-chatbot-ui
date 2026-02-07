/**
 * Branded Types — Domain primitives com type safety em compile-time.
 *
 * Padrão recomendado pelo TypeScript team para evitar mistura acidental
 * de strings com significados diferentes (ex: CPF onde esperava CNPJ).
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
 */

declare const __brand: unique symbol

type Brand<T, B extends string> = T & { readonly [__brand]: B }

// Documentos brasileiros
export type CPF = Brand<string, 'CPF'>
export type CNPJ = Brand<string, 'CNPJ'>
export type Phone = Brand<string, 'Phone'>
export type Email = Brand<string, 'Email'>

// IDs de domínio
export type ProcessId = Brand<string, 'ProcessId'>
export type ContractId = Brand<string, 'ContractId'>
export type TeamMemberId = Brand<string, 'TeamMemberId'>
export type DocumentId = Brand<string, 'DocumentId'>
export type ConversationId = Brand<string, 'ConversationId'>

// Valores monetários (em centavos para evitar floating point)
export type BRLCents = Brand<number, 'BRLCents'>

/**
 * Funções factory para criar branded types após validação.
 * Usar em conjunto com os schemas Zod de lib/validations.ts.
 */
export function asCPF(value: string): CPF {
  return value as CPF
}

export function asCNPJ(value: string): CNPJ {
  return value as CNPJ
}

export function asPhone(value: string): Phone {
  return value as Phone
}

export function asEmail(value: string): Email {
  return value as Email
}

export function asProcessId(value: string): ProcessId {
  return value as ProcessId
}

export function asContractId(value: string): ContractId {
  return value as ContractId
}

export function asBRLCents(value: number): BRLCents {
  return Math.round(value) as BRLCents
}

/**
 * Helpers para formatação de valores monetários BR.
 */
export function formatBRL(cents: BRLCents): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export function toBRLCents(reais: number): BRLCents {
  return Math.round(reais * 100) as BRLCents
}
