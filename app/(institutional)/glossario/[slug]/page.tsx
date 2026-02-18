import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, getTermBySlug, getRelatedTerms } from '@/lib/glossary'
import { BreadcrumbJsonLd } from '@/components/structured-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const term = getTermBySlug(slug)
  if (!term) return {}
  return {
    title: term.seoTitle,
    description: term.seoDescription,
    openGraph: {
      title: term.seoTitle,
      description: term.seoDescription,
    },
    alternates: {
      canonical: `https://app.ata360.com.br/glossario/${slug}`,
    },
  }
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params
  const term = getTermBySlug(slug)
  if (!term) return notFound()

  const related = getRelatedTerms(term)
  const cat = GLOSSARY_CATEGORIES[term.category]

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.definition,
            url: `https://app.ata360.com.br/glossario/${term.slug}`,
            inDefinedTermSet: {
              '@type': 'DefinedTermSet',
              name: 'Glossário de Contratações Públicas',
              url: 'https://app.ata360.com.br/glossario',
            },
          }),
        }}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Início', href: '/' },
        { name: 'Glossário', href: '/glossario' },
        { name: term.term, href: `/glossario/${term.slug}` },
      ]} />

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href={'/' as Route} className="hover:text-foreground transition-colors">Início</Link>
          <span>/</span>
          <Link href={'/glossario' as Route} className="hover:text-foreground transition-colors">Glossário</Link>
          <span>/</span>
          <span className="text-foreground">{term.term}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.label}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {term.term}
            </h1>
            {term.abbreviation && (
              <span className="text-sm font-bold px-2.5 py-1 rounded bg-primary/10 text-primary">
                {term.abbreviation}
              </span>
            )}
          </div>
        </header>

        {/* Definition */}
        <div className="text-sm text-foreground leading-relaxed mb-8 p-6 rounded-lg bg-card border border-border/40">
          <p>{term.definition}</p>
        </div>

        {/* Legal basis */}
        {term.legalBasis && (
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border/40">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fundamentacao Legal</h2>
            <p className="text-sm text-foreground">{term.legalBasis}</p>
          </div>
        )}

        {/* Related terms */}
        {related.length > 0 && (
          <section className="mb-8" aria-label="Termos relacionados">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Termos Relacionados</h2>
            <div className="grid gap-2">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/glossario/${r.slug}` as Route}
                  className="group flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:border-border hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {r.term}
                      </h3>
                      {r.abbreviation && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {r.abbreviation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.definition}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <div className="pt-6 border-t border-border/40">
          <Link
            href={'/glossario' as Route}
            className="text-sm text-primary hover:underline"
          >
            Ver todos os termos
          </Link>
        </div>
      </div>
    </>
  )
}
