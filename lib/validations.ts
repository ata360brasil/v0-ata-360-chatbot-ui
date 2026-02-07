import { z } from 'zod'

// Validadores de documentos brasileiros
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/

export const cpfSchema = z.string().regex(cpfRegex, 'CPF inválido (formato: 000.000.000-00)')
export const cnpjSchema = z.string().regex(cnpjRegex, 'CNPJ inválido (formato: 00.000.000/0000-00)')
export const phoneSchema = z.string().regex(phoneRegex, 'Telefone inválido')
export const emailSchema = z.string().email('Email inválido').max(255)

export const teamMemberSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200),
  cpf: cpfSchema,
  rg: z.string().min(5).max(20),
  matricula: z.string().min(1, 'Matrícula obrigatória'),
  position: z.string().min(2),
  role: z.string().min(2),
  sector: z.string().min(2),
  email: emailSchema,
  email2: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  whatsapp: phoneSchema.optional().or(z.literal('')),
  birthday: z.string().min(1),
})

export const contractSchema = z.object({
  processNumber: z.string().min(1, 'Número do processo obrigatório'),
  bidNumber: z.string().min(1),
  mainObject: z.string().min(10, 'Descrição do objeto deve ter pelo menos 10 caracteres').max(2000),
  totalValue: z.number().positive('Valor deve ser positivo'),
  supplier: z.object({
    name: z.string().min(2),
    cnpj: cnpjSchema,
  }),
})

export const processSchema = z.object({
  processNumber: z.string().min(1),
  title: z.string().min(5).max(500),
  department: z.string().min(2),
  estimatedValue: z.number().positive(),
})

export const contactFormSchema = z.object({
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres').max(200),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(5000),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string()
    .min(12, 'Senha deve ter pelo menos 12 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos 1 letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos 1 letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos 1 número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos 1 caractere especial'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

// Sanitização básica de strings (previne XSS)
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
