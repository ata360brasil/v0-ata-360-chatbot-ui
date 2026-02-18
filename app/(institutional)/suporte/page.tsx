import type { Metadata } from 'next'
import Link from 'next/link'
import type { Route } from 'next'

export const metadata: Metadata = {
  title: 'Suporte — Central de Ajuda',
  description: 'Central de suporte do ATA360. FAQ, canais de atendimento, SLA e como resolver problemas rapidamente.',
}

const FAQ = [
  {
    pergunta: 'Como acessar o ATA360?',
    resposta: 'Acesse app.ata360.com.br e entre com suas credenciais Gov.br ou modo demonstração.',
  },
  {
    pergunta: 'Esqueci minha senha. O que faco?',
    resposta: 'O ATA360 utiliza autenticação via Gov.br. Recupere sua senha diretamente no portal acesso.gov.br.',
  },
  {
    pergunta: 'O documento gerado pode ser editado?',
    resposta: 'Sim. Todos os documentos sao editaveis antes da finalização. A revisao humana e obrigatória.',
  },
  {
    pergunta: 'Quantos usuarios podem acessar?',
    resposta: 'Usuarios ilimitados por órgão. Toda a equipe acessa sem custo extra.',
  },
  {
    pergunta: 'Os dados do meu órgão estao seguros?',
    resposta: 'Sim. Isolamento multi-tenant, criptografia AES-256 em repouso, TLS 1.3 em transito, e trilha de auditoria imutavel.',
  },
] as const

const CANAIS = [
  {
    titulo: 'Suporte Técnico',
    email: 'suporte@ata360.com.br',
    assuntos: 'Dúvidas, erros, funcionalidades, integração',
    sla: 'Resposta em até 2 dias úteis',
  },
  {
    titulo: 'Ouvidoria',
    email: 'ouvidoria@ata360.com.br',
    assuntos: 'Denúncias, reclamacoes, sugestoes, elogios',
    sla: 'Acusacao de recebimento em 48h',
  },
  {
    titulo: 'Financeiro / Contratos',
    email: 'financeiro@ata360.com.br',
    assuntos: 'NF-e, confirmação de recebimento, envio de contrato',
    sla: 'Resposta em até 2 dias úteis',
  },
] as const

export default function SuportePage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Suporte
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Central de Suporte
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Estamos aqui para ajudar. Encontre respostas rapidas ou fale com nossa equipe.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Perguntas frequentes</h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.pergunta} className="border-b border-border/40 pb-6 last:border-0">
                <h3 className="font-semibold text-sm mb-2">{item.pergunta}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.resposta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Canais */}
        <aside className="space-y-6">
          <h2 className="text-lg font-bold">Canais de atendimento</h2>
          {CANAIS.map((canal) => (
            <div key={canal.titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-sm mb-2">{canal.titulo}</h3>
              <a
                href={`mailto:${canal.email}`}
                className="text-sm text-primary hover:underline block mb-2"
              >
                {canal.email}
              </a>
              <p className="text-xs text-muted-foreground mb-1">{canal.assuntos}</p>
              <p className="text-xs text-muted-foreground font-medium">{canal.sla}</p>
            </div>
          ))}

          <div className="rounded-lg border border-border bg-muted/20 p-6">
            <h3 className="font-semibold text-sm mb-3">Outras formas de ajuda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={'/contato' as Route} className="text-primary hover:underline">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href={'/compliance' as Route} className="text-primary hover:underline">
                  Ouvidoria / Canal de Denúncia
                </Link>
              </li>
              <li>
                <Link href={'/glossario' as Route} className="text-primary hover:underline">
                  Glossário de Licitacoes
                </Link>
              </li>
              <li>
                <Link href={'/blog' as Route} className="text-primary hover:underline">
                  Blog — Guias Praticos
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
