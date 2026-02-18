import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, getAllCategories, type GlossaryCategory } from '@/lib/glossary'
import { BreadcrumbJsonLd } from '@/components/structured-data'

export const metadata: Metadata = {
  title: 'Glossário de Contratações Públicas',
  description: 'Glossário completo de termos de licitações e contratações públicas. Definições conforme a Lei 14.133/2021 e legislação vigente.',
  openGraph: {
    title: 'Glossário de Contratações Públicas | ATA360',
    description: 'Todos os termos de licitação e contratação pública definidos conforme a Lei 14.133/2021.',
  },
}

export default function GlossaryPage() {
  const categories = getAllCategories()

  // Agrupar termos por letra inicial
  const termsByLetter = GLOSSARY_TERMS.reduce<Record<string, typeof GLOSSARY_TERMS>>((acc, term) => {
    const letter = (term.term.charAt(0) ?? 'A').toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter]!.push(term)
    return acc
  }, {})
  const sortedLetters = Object.keys(termsByLetter).sort()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            name: 'Glossário de Contratações Públicas',
            description: 'Termos e definições de licitações e contratações públicas conforme Lei 14.133/2021',
            url: 'https://app.ata360.com.br/glossario',
            inLanguage: 'pt-BR',
            hasDefinedTerm: GLOSSARY_TERMS.map(t => ({
              '@type': 'DefinedTerm',
              name: t.term,
              description: t.definition,
              url: `https://app.ata360.com.br/glossario/${t.slug}`,
            })),
          }),
        }}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Início', href: '/' },
        { name: 'Glossário', href: '/glossario' },
      ]} />

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">Glossário</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Termos e definições de contratações públicas conforme a Lei 14.133/2021 e legislação vigente.
          </p>
        </div>

        {/* Category filter */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="Categorias do glossário">
          {categories.map(cat => {
            const meta = GLOSSARY_CATEGORIES[cat]
            const count = GLOSSARY_TERMS.filter(t => t.category === cat).length
            return (
              <span
                key={cat}
                className="text-xs px-3 py-1.5 rounded-full border border-border/40 bg-card text-muted-foreground"
              >
                {meta.label} ({count})
              </span>
            )
          })}
        </nav>

        {/* Alphabet nav */}
        <nav className="flex flex-wrap gap-1 mb-8" aria-label="Indice alfabetico">
          {sortedLetters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* Terms by letter */}
        <div className="space-y-10">
          {sortedLetters.map(letter => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border/40">{letter}</h2>
              <div className="grid gap-3">
                {(termsByLetter[letter] ?? [])
                  .sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'))
                  .map(term => (
                    <Link
                      key={term.slug}
                      href={`/glossario/${term.slug}` as Route}
                      className="group block p-4 rounded-lg border border-border/40 hover:border-border hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {term.term}
                            </h3>
                            {term.abbreviation && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                {term.abbreviation}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {term.definition}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground/60 whitespace-nowrap">
                          {GLOSSARY_CATEGORIES[term.category].label}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground/60">
          <p>{GLOSSARY_TERMS.length} termos em {categories.length} categorias</p>
        </div>
      </div>
    </>
  )
}
