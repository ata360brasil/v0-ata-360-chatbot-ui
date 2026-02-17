import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route — Formulario de Candidatura (Carreiras)
 *
 * Recebe candidaturas, valida e armazena.
 * Em producao: envia email para suporte@ata360.com.br + salva em Supabase.
 * Por enquanto: valida e retorna sucesso.
 */

const VAGAS_VALIDAS = [
  'Desenvolvedor(a) Full-Stack',
  'UX/UI Designer',
  'Comercial GovTech (SDR / AE)',
  'Marketing Digital',
  'banco-talentos',
] as const

interface CandidaturaPayload {
  nome: string
  email: string
  vaga: string
  linkedin?: string
  portfolio?: string
  mensagem?: string
}

function validarPayload(data: CandidaturaPayload): string | null {
  if (!data.nome || data.nome.length < 3) return 'Nome e obrigatorio (minimo 3 caracteres).'
  if (!data.email || !data.email.includes('@')) return 'E-mail invalido.'
  if (!data.vaga || !VAGAS_VALIDAS.includes(data.vaga as typeof VAGAS_VALIDAS[number])) return 'Vaga invalida.'
  return null
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let data: CandidaturaPayload

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      data = {
        nome: formData.get('nome') as string || '',
        email: formData.get('email') as string || '',
        vaga: formData.get('vaga') as string || '',
        linkedin: formData.get('linkedin') as string || '',
        portfolio: formData.get('portfolio') as string || '',
        mensagem: formData.get('mensagem') as string || '',
      }

      // Validar curriculo PDF
      const curriculo = formData.get('curriculo') as File | null
      if (!curriculo || curriculo.size === 0) {
        return NextResponse.json({ error: 'Curriculo (PDF) e obrigatorio.' }, { status: 400 })
      }
      if (curriculo.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Curriculo excede 5MB.' }, { status: 400 })
      }
      if (!curriculo.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json({ error: 'Curriculo deve ser em formato PDF.' }, { status: 400 })
      }
    } else {
      data = await request.json()
    }

    const erro = validarPayload(data)
    if (erro) {
      return NextResponse.json({ error: erro }, { status: 400 })
    }

    const sanitized = {
      nome: data.nome.trim().slice(0, 120),
      email: data.email.trim().toLowerCase().slice(0, 254),
      vaga: data.vaga,
      linkedin: (data.linkedin || '').trim().slice(0, 500),
      portfolio: (data.portfolio || '').trim().slice(0, 500),
      mensagem: (data.mensagem || '').trim().slice(0, 2000),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown',
    }

    // TODO: Em producao, enviar email para suporte@ata360.com.br + salvar curriculo em storage
    console.log('[carreiras] Nova candidatura:', sanitized.vaga, sanitized.nome)

    return NextResponse.json({
      success: true,
      message: 'Candidatura recebida com sucesso. Analisaremos e retornaremos em ate 5 dias uteis.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno ao processar candidatura.' },
      { status: 500 }
    )
  }
}
