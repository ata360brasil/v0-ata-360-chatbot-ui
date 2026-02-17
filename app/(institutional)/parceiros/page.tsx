import type { Metadata } from 'next'
import Link from 'next/link'
import type { Route } from 'next'

export const metadata: Metadata = {
  title: 'Programa de Parceiros — ATA360',
  description: 'Programa de parceiros da ATA360 para consultorias, contabilidades, escritorios juridicos e associacoes de municipios.',
}

const PERFIS = [
  {
    titulo: 'Consultorias em Licitacoes',
    descricao: 'Voce ja orienta orgaos em processos licitatorios. Com o ATA360, seus clientes ganham fundamentacao legal automatica, pesquisa de precos inteligente e documentos que se conversam.',
  },
  {
    titulo: 'Contabilidades Publicas',
    descricao: 'Voce ja cuida do orcamento. Com o ATA360, o planejamento de compras se conecta a execucao orcamentaria com dados reais e rastreabilidade.',
  },
  {
    titulo: 'Escritorios Juridicos',
    descricao: 'Voce ja faz parecer juridico. Com o ATA360, cada documento nasce com fundamentacao legal (Lei 14.133, LINDB, TCU) — reduzindo retrabalho e impugnacoes.',
  },
  {
    titulo: 'Associacoes de Municipios',
    descricao: 'Voce ja representa dezenas ou centenas de municipios. Com o ATA360, oferece a todos o mesmo nivel de ferramenta — independentemente do porte.',
  },
] as const

const BENEFICIOS = [
  'Acesso prioritario a novas funcionalidades',
  'Material de apoio e treinamento',
  'Comissionamento por indicacao convertida',
  'Co-marketing e visibilidade',
  'Canal direto com o time ATA360',
] as const

export default function ParceirosPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Parceiros
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Programa de Parceiros ATA360
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Leve inteligencia em contratacoes publicas para os orgaos que voce ja atende.
        </p>
      </header>

      {/* O que e */}
      <section className="mb-16 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">O que e o programa</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O Programa de Parceiros ATA360 conecta organizacoes que ja atendem o setor publico
          com a plataforma que transforma o processo de compras. Voce indica, acompanha e
          agrega valor ao seu cliente — e o ATA360 faz o trabalho pesado.
        </p>
      </section>

      {/* Perfis */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Perfis de parceiro</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PERFIS.map((perfil) => (
            <div key={perfil.titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-sm mb-3">{perfil.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{perfil.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Beneficios do programa</h2>
        <ul className="space-y-3">
          {BENEFICIOS.map((b, i) => (
            <li key={b} className="flex gap-3 text-sm text-muted-foreground">
              <span className="text-primary font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Quer ser parceiro?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Entre em contato e conte sobre sua organizacao. Responderemos em ate 2 dias uteis.
        </p>
        <Link
          href={'/contato' as Route}
          className="inline-block rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Fale conosco
        </Link>
      </div>
    </article>
  )
}
