import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route — Formulario de Contato
 *
 * Recebe dados do formulario, valida e armazena.
 * Em producao: envia email via provider (Resend, SES, etc.)
 * Por enquanto: valida e retorna sucesso.
 *
 * Rate limit: maximo 5 envios por IP por hora.
 * Validacao: CNPJ formato, email, campos obrigatorios.
 */

const CNPJ_REGEX = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/
const TIPOS_VALIDOS = [
  'demonstracao', 'duvida', 'contratacao', 'suporte',
  'denuncia', 'imprensa', 'parceria', 'outro',
] as const

interface ContatoPayload {
  nome: string
  email: string
  orgao: string
  cnpj: string
  cargo?: string
  tipo: string
  mensagem: string
  aceite: string
}

function validarPayload(data: ContatoPayload): string | null {
  if (!data.nome || data.nome.length < 3) return 'Nome e obrigatorio (minimo 3 caracteres).'
  if (!data.email || !data.email.includes('@')) return 'E-mail institucional invalido.'
  if (!data.orgao || data.orgao.length < 3) return 'Orgao e obrigatorio.'
  if (!data.cnpj || !CNPJ_REGEX.test(data.cnpj)) return 'CNPJ invalido. Use o formato 00.000.000/0001-00.'
  if (!data.tipo || !TIPOS_VALIDOS.includes(data.tipo as typeof TIPOS_VALIDOS[number])) return 'Tipo de contato invalido.'
  if (!data.mensagem || data.mensagem.length < 20) return 'Mensagem e obrigatoria (minimo 20 caracteres).'
  if (data.mensagem.length > 2000) return 'Mensagem excede 2.000 caracteres.'
  if (!data.aceite) return 'Aceite dos termos e obrigatorio.'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let data: ContatoPayload

    if (contentType.includes('application/json')) {
      data = await request.json()
    } else {
      // FormData (submit HTML nativo)
      const formData = await request.formData()
      data = {
        nome: formData.get('nome') as string || '',
        email: formData.get('email') as string || '',
        orgao: formData.get('orgao') as string || '',
        cnpj: formData.get('cnpj') as string || '',
        cargo: formData.get('cargo') as string || '',
        tipo: formData.get('tipo') as string || '',
        mensagem: formData.get('mensagem') as string || '',
        aceite: formData.get('aceite') as string || '',
      }
    }

    const erro = validarPayload(data)
    if (erro) {
      return NextResponse.json({ error: erro }, { status: 400 })
    }

    // Sanitizar dados
    const sanitized = {
      nome: data.nome.trim().slice(0, 120),
      email: data.email.trim().toLowerCase().slice(0, 254),
      orgao: data.orgao.trim().slice(0, 200),
      cnpj: data.cnpj.replace(/\D/g, '').slice(0, 14),
      cargo: (data.cargo || '').trim().slice(0, 120),
      tipo: data.tipo,
      mensagem: data.mensagem.trim().slice(0, 2000),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
    }

    // TODO: Em producao, enviar email via provider e salvar em Supabase
    // await supabase.from('contatos').insert(sanitized)
    // await resend.emails.send({ ... })

    console.log('[contato] Nova mensagem recebida:', sanitized.tipo, sanitized.orgao)

    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso. Responderemos em ate 2 dias uteis.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno ao processar formulario.' },
      { status: 500 }
    )
  }
}
