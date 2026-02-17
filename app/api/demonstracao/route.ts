import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route — Formulario de Demonstracao
 *
 * Recebe solicitacoes de demonstracao, valida e armazena.
 * Em producao: envia email para suporte@ata360.com.br + salva em Supabase.
 * Por enquanto: valida e retorna sucesso.
 */

const CNPJ_REGEX = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/
const EQUIPES_VALIDAS = ['1-2', '3-5', '6-10', '10+'] as const
const HORARIOS_VALIDOS = ['manha', 'tarde', 'qualquer'] as const

interface DemonstracaoPayload {
  nome: string
  email: string
  orgao: string
  cnpj: string
  cargo?: string
  equipe: string
  horario: string
  mensagem?: string
  aceite: string
}

function validarPayload(data: DemonstracaoPayload): string | null {
  if (!data.nome || data.nome.length < 3) return 'Nome e obrigatorio (minimo 3 caracteres).'
  if (!data.email || !data.email.includes('@')) return 'E-mail institucional invalido.'
  if (!data.orgao || data.orgao.length < 3) return 'Orgao e obrigatorio.'
  if (!data.cnpj || !CNPJ_REGEX.test(data.cnpj)) return 'CNPJ invalido. Use o formato 00.000.000/0001-00.'
  if (!data.equipe || !EQUIPES_VALIDAS.includes(data.equipe as typeof EQUIPES_VALIDAS[number])) return 'Tamanho da equipe invalido.'
  if (!data.horario || !HORARIOS_VALIDOS.includes(data.horario as typeof HORARIOS_VALIDOS[number])) return 'Horario invalido.'
  if (!data.aceite) return 'Aceite dos termos e obrigatorio.'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let data: DemonstracaoPayload

    if (contentType.includes('application/json')) {
      data = await request.json()
    } else {
      const formData = await request.formData()
      data = {
        nome: formData.get('nome') as string || '',
        email: formData.get('email') as string || '',
        orgao: formData.get('orgao') as string || '',
        cnpj: formData.get('cnpj') as string || '',
        cargo: formData.get('cargo') as string || '',
        equipe: formData.get('equipe') as string || '',
        horario: formData.get('horario') as string || '',
        mensagem: formData.get('mensagem') as string || '',
        aceite: formData.get('aceite') as string || '',
      }
    }

    const erro = validarPayload(data)
    if (erro) {
      return NextResponse.json({ error: erro }, { status: 400 })
    }

    const sanitized = {
      nome: data.nome.trim().slice(0, 120),
      email: data.email.trim().toLowerCase().slice(0, 254),
      orgao: data.orgao.trim().slice(0, 200),
      cnpj: data.cnpj.replace(/\D/g, '').slice(0, 14),
      cargo: (data.cargo || '').trim().slice(0, 120),
      equipe: data.equipe,
      horario: data.horario,
      mensagem: (data.mensagem || '').trim().slice(0, 2000),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
    }

    // TODO: Em producao, enviar email para suporte@ata360.com.br + salvar em Supabase
    console.log('[demonstracao] Nova solicitacao:', sanitized.orgao, sanitized.equipe)

    return NextResponse.json({
      success: true,
      message: 'Solicitacao recebida com sucesso. Retornaremos em ate 1 dia util.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno ao processar solicitacao.' },
      { status: 500 }
    )
  }
}
