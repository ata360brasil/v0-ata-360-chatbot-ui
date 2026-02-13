import { z } from 'zod'
import { validateCPF, validateCNPJ, validatePhone, validateDate, validateEmail, validateURL } from './masks'

// ─── Regex Patterns ──────────────────────────────────────────────────────────

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/
const cepRegex = /^\d{5}-\d{3}$/
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
const processNumberRegex = /^\d{5}\.\d{6}\/\d{4}-\d{2}$/

// ─── Zod Schemas com validacao algoritmica ───────────────────────────────────

export const cpfSchema = z.string()
  .regex(cpfRegex, 'CPF invalido (formato: 000.000.000-00)')
  .refine(validateCPF, 'CPF invalido (digitos verificadores incorretos)')

export const cnpjSchema = z.string()
  .regex(cnpjRegex, 'CNPJ invalido (formato: 00.000.000/0000-00)')
  .refine(validateCNPJ, 'CNPJ invalido (digitos verificadores incorretos)')

export const phoneSchema = z.string()
  .regex(phoneRegex, 'Telefone invalido (formato: (00) 00000-0000)')
  .refine(validatePhone, 'DDD ou numero invalido')

export const emailSchema = z.string()
  .email('Email invalido')
  .max(255, 'Email muito longo')
  .refine(validateEmail, 'Formato de email invalido')

export const cepSchema = z.string()
  .regex(cepRegex, 'CEP invalido (formato: 00000-000)')

export const dateSchema = z.string()
  .regex(dateRegex, 'Data invalida (formato: dd/mm/aaaa)')
  .refine(validateDate, 'Data inexistente')

export const urlSchema = z.string()
  .refine(validateURL, 'URL invalida')

export const brlSchema = z.string()
  .refine(
    (v: string) => /^R\$\s?\d{1,3}(\.\d{3})*,\d{2}$/.test(v.trim()),
    'Valor invalido (formato: R$ 0,00)'
  )

export const processNumberSchema = z.string()
  .regex(processNumberRegex, 'Numero de processo invalido (formato: 00000.000000/0000-00)')

// ─── Social Media Schemas ────────────────────────────────────────────────────

export const instagramSchema = z.string()
  .regex(/^@?[a-zA-Z0-9._]{1,30}$/, 'Instagram invalido')

export const linkedinSchema = z.string()
  .refine(
    (v: string) => /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/.test(v),
    'URL do LinkedIn invalida'
  )

export const facebookSchema = z.string()
  .refine(
    (v: string) => /^(https?:\/\/)?(www\.)?facebook\.com\/[\w.-]+\/?$/.test(v),
    'URL do Facebook invalida'
  )

// ─── Form Schemas ────────────────────────────────────────────────────────────

export const teamMemberSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200),
  cpf: cpfSchema,
  rg: z.string().min(5, 'RG deve ter pelo menos 5 caracteres').max(20),
  matricula: z.string().min(1, 'Matricula obrigatoria'),
  position: z.string().min(2, 'Cargo obrigatorio'),
  role: z.string().min(2, 'Funcao obrigatoria'),
  sector: z.string().min(2, 'Setor obrigatorio'),
  email: emailSchema,
  email2: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  whatsapp: phoneSchema.optional().or(z.literal('')),
  birthday: dateSchema,
})

export const contractSchema = z.object({
  processNumber: processNumberSchema.or(z.string().min(1, 'Número do processo obrigatório')),
  bidNumber: z.string().min(1, 'Número da licitação obrigatório'),
  mainObject: z.string().min(10, 'Descrição do objeto deve ter pelo menos 10 caracteres').max(2000),
  totalValue: z.number().positive('Valor deve ser positivo'),
  supplier: z.object({
    name: z.string().min(2, 'Nome do fornecedor obrigatório'),
    cnpj: cnpjSchema,
  }),
})

export const processSchema = z.object({
  processNumber: z.string().min(1, 'Numero do processo obrigatorio'),
  title: z.string().min(5, 'Titulo deve ter pelo menos 5 caracteres').max(500),
  department: z.string().min(2, 'Setor obrigatorio'),
  estimatedValue: z.number().positive('Valor estimado deve ser positivo'),
})

export const contactFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional().or(z.literal('')),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres').max(200),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(5000),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatoria'),
  newPassword: z.string()
    .min(12, 'Senha deve ter pelo menos 12 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos 1 letra maiuscula')
    .regex(/[a-z]/, 'Deve conter pelo menos 1 letra minuscula')
    .regex(/[0-9]/, 'Deve conter pelo menos 1 numero')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos 1 caractere especial'),
  confirmPassword: z.string(),
}).refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: 'Senhas nao conferem',
  path: ['confirmPassword'],
})

// ─── Sanitizacao (previne XSS) ───────────────────────────────────────────────

export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
