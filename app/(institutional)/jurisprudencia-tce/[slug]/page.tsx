import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  DECISOES_TCE,
  TEMAS_TCE,
  TRIBUNAIS_TCE,
  getDecisãoBySlug,
  getDecisõesByTema,
} from '@/data/jurisprudência-tce'
import { BreadcrumbJsonLd } from '@/components/structured-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return DECISOES_TCE.map(d => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const decisão = getDecisãoBySlug(slug)
  if (!decisão) return {}
  return {
    title: decisão.seoTitle,
    description: decisão.seoDescription,
    openGraph: {
      title: decisão.seoTitle,
      description: decisão.seoDescription,
      type: 'article',
      publishedTime: decisão.dataPúblicacao,
    },
    alternates: {
      canonical: `https://app.ata360.com.br/jurisprudencia-tce/${slug}`,
    },
  }
}

export default async function DecisãoTCEPage({ params }: PageProps) {
  const { slug } = await params
  const decisão = getDecisãoBySlug(slug)
  if (!decisão) return notFound()

  const tribunal = TRIBUNAIS_TCE[decisão.tribunal]
  const tema = TEMAS_TCE[decisão.tema]
  const related = getDecisõesByTema(decisão.tema).filter(d => d.slug !== slug).slice(0, 3)

  return (
    <>
      {/* Structured Data — LegislationObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LegislationObject',
            name: `${decisão.tribunal} ${decisão.tipo === 'súmula' ? decisão.número : `Acórdão ${decisão.número}`}`,
            description: decisão.ementa,
            datePublished: decisão.dataPúblicacao,
            legislationType: decisão.tipo,
            legislationJurisdiction: {
              '@type': 'AdministrativeArea',
              name: tribunal.nome,
            },
            url: `https://app.ata360.com.br/jurisprudencia-tce/${decisao.slug}`,
            inLanguage: 'pt-BR',
            about: decisão.tags.map(t => ({ '@type': 'DefinedTerm', name: t })),
            citation: decisão.dispositivosLegais.map(ref => ({
              '@type': 'Legislation',
              name: ref,
            })),
          }),
        }}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Início', href: '/' },
        { name: 'Jurisprudência TCE', href: '/jurisprudencia-tce' },
        { name: `${decisão.tribunal} ${decisão.número}`, href: `/jurisprudencia-tce/${decisão.slug}` },
      ]} />

      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-12 font-mono" aria-label="Breadcrumb">
          <Link href={'/' as Route} className="hover:text-foreground transition-colors">início</Link>
          <span className="text-neutral-300">/</span>
          <Link href={'/jurisprudencia-tce' as Route} className="hover:text-foreground transition-colors">jurisprudência-tce</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-500">{decisão.tribunal.toLowerCase()}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-foreground text-background tracking-wide font-mono">
              {decisão.tribunal}
            </span>
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{tema.label}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-400 font-mono uppercase">
              {decisão.tipo}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            {decisão.tipo === 'súmula' ? decisão.número : `Acórdão ${decisão.número}`}
          </h1>
          <p className="text-sm text-neutral-400 font-mono mb-2">
            {tribunal.nome}
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-6 font-mono">
            <span>Rel. {decisão.relator}</span>
            <time dateTime={decisão.dataPúblicacao}>
              {new Date(decisão.dataPúblicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>
          </div>
        </header>

        {/* Ementa */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Ementa</h2>
          <div className="border-l-2 border-foreground pl-5">
            <p className="text-[15px] leading-[1.8] text-foreground font-medium">
              {decisão.ementa}
            </p>
          </div>
        </section>

        {/* Fundamentacao */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Fundamentacao</h2>
          <ul className="space-y-2">
            {decisão.fundamentação.map(ref => (
              <li key={ref} className="text-sm text-neutral-600 dark:text-neutral-400 font-mono flex items-start gap-2">
                <span className="text-neutral-300 mt-1.5 shrink-0">&mdash;</span>
                {ref}
              </li>
            ))}
          </ul>
        </section>

        {/* Aplicacao prática */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Aplicacao Pratica</h2>
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <p className="text-[15px] leading-[1.8] text-neutral-700 dark:text-neutral-300">
              {decisão.aplicacao}
            </p>
          </div>
        </section>

        {/* Dispositivos legais */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">Dispositivos Legais</h2>
          <div className="flex flex-wrap gap-2">
            {decisão.dispositivosLegais.map(ref => (
              <span key={ref} className="text-xs px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 font-mono">
                {ref}
              </span>
            ))}
          </div>
        </section>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          {decisão.tags.map(tag => (
            <span key={tag} className="text-[11px] px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* Portal do tribunal */}
        <div className="mt-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground">{tribunal.nome}</p>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">Fonte oficial da decisão</p>
          </div>
          <a
            href={tribunal.portal}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
          >
            Portal {decisão.tribunal}
          </a>
        </div>

        {/* Related decisions */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800" aria-label="Decisões relacionadas">
            <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Decisões Relacionadas</h2>
            <div className="grid gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/jurisprudencia-tce/${r.slug}` as Route}
                  className="group block p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-foreground transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background font-mono">{r.tribunal}</span>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">{r.tipo}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline underline-offset-4">
                    {r.tipo === 'súmula' ? r.número : `Acórdão ${r.número}`}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2">{r.ementa}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
