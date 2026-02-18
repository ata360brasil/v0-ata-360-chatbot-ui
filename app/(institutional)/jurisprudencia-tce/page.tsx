import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import {
  DECISOES_TCE,
  TEMAS_TCE,
  TRIBUNAIS_TCE,
  getAllTribunais,
  getAllTemas,
  type DecisãoTCE,
  type TemaJurisprudência,
} from '@/data/jurisprudência-tce'

export const metadata: Metadata = {
  title: 'Jurisprudência TCE — Decisões dos Tribunais de Contas Estaduais',
  description: 'Base de jurisprudência dos Tribunais de Contas Estaduais (TCEs) sobre contratações públicas, licitações e Lei 14.133/2021.',
  openGraph: {
    title: 'Jurisprudência TCE Estadual | ATA360',
    description: 'Decisões, súmulas e resoluções dos TCEs sobre compras públicas.',
  },
}

function DecisãoCard({ decisão }: { decisão: DecisãoTCE }) {
  const tribunal = TRIBUNAIS_TCE[decisão.tribunal]
  const tema = TEMAS_TCE[decisão.tema]
  return (
    <article className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background hover:border-foreground transition-all">
      <Link href={`/jurisprudencia-tce/${decisao.slug}` as Route} className="block p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background tracking-wide font-mono">
            {decisão.tribunal}
          </span>
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{tema.label}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-400 font-mono">
            {decisão.tipo}
          </span>
        </div>
        <h2 className="text-base font-bold text-foreground group-hover:underline underline-offset-4 mb-3 tracking-tight">
          {decisão.tipo === 'súmula' ? decisão.número : `Acórdão ${decisão.número}`} — {tribunal.uf}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-3">
          {decisão.ementa}
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
          <time dateTime={decisão.dataPúblicacao}>
            {new Date(decisão.dataPúblicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </time>
          <span>{decisão.relator}</span>
        </div>
      </Link>
    </article>
  )
}

export default function JurisprudênciaTCEPage() {
  const tribunais = getAllTribunais()
  const temas = getAllTemas()
  const decisões = [...DECISOES_TCE].sort((a, b) =>
    new Date(b.dataPúblicacao).getTime() - new Date(a.dataPúblicacao).getTime()
  )

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Jurisprudência TCE Estadual',
            description: 'Decisões dos Tribunais de Contas Estaduais sobre contratações públicas',
            url: 'https://app.ata360.com.br/jurisprudencia-tce',
            publisher: { '@id': 'https://app.ata360.com.br/#organization' },
            inLanguage: 'pt-BR',
            hasPart: decisões.map(d => ({
              '@type': 'LegislationObject',
              name: `${d.tribunal} ${d.número}`,
              description: d.ementa,
              url: `https://app.ata360.com.br/jurisprudencia-tce/${d.slug}`,
              datePublished: d.dataPúblicacao,
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Jurisprudência TCE
          </h1>
          <p className="text-lg text-neutral-500 max-w-3xl leading-relaxed">
            Decisões, súmulas e resoluções dos Tribunais de Contas Estaduais sobre contratações públicas e Lei 14.133/2021.
            Base consultada pelo ATA360 para fundamentar documentos e auditorias.
          </p>
        </div>

        {/* Tribunais */}
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Tribunais</h2>
          <nav className="flex flex-wrap gap-2" aria-label="Tribunais">
            {tribunais.map(t => (
              <span
                key={t}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-foreground text-background font-mono"
              >
                {t}
              </span>
            ))}
          </nav>
        </div>

        {/* Temas */}
        <div className="mb-12">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Temas</h2>
          <nav className="flex flex-wrap gap-2" aria-label="Temas">
            {temas.map(tema => {
              const meta = TEMAS_TCE[tema]
              return (
                <span
                  key={tema}
                  className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 font-mono"
                >
                  {meta.label}
                </span>
              )
            })}
          </nav>
        </div>

        {/* Decisões */}
        <section aria-label="Decisões">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">
            {decisões.length} Decisões
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {decisões.map(d => (
              <DecisãoCard key={d.slug} decisão={d} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 text-center border-t border-neutral-200 dark:border-neutral-800 pt-12">
          <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
            Jurisprudência integrada ao seu workflow
          </h2>
          <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
            O ATA360 consulta automáticamente a jurisprudência do TCU e TCEs para fundamentar documentos, auditorias e alertas.
          </p>
          <Link
            href={'/contato' as Route}
            className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:bg-foreground/80 transition-colors"
          >
            Solicitar Demonstração
          </Link>
        </div>
      </div>
    </>
  )
}
