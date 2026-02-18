import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts, getAllCategories, type BlogPost, type BlogCategory } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Notícias — Compras Públicas e Contratações | ATA360',
  description: 'Notícias curadas sobre compras públicas, licitações, Lei 14.133/2021, jurisprudência do TCU e inovação em gestão pública.',
  openGraph: {
    title: 'Notícias ATA360 — Compras Públicas e Contratações',
    description: 'Notícias curadas de fontes oficiais: TCU, CGU, PNCP, Gov.br. Relevância para pregoeiros, gestores e servidores públicos.',
  },
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const cat = BLOG_CATEGORIES[post.category]
  return (
    <article className={`group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background hover:border-foreground transition-all ${featured ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
      <Link href={`/blog/${post.slug}` as Route} className="block p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{cat.label}</span>
          {post.featured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background tracking-wide">Destaque</span>
          )}
        </div>
        <h2 className={`font-bold text-foreground group-hover:underline underline-offset-4 mb-3 tracking-tight ${featured ? 'text-xl' : 'text-base'}`}>
          {post.title}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-5 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </time>
            <span>{post.readingTimeMin} min</span>
            {post.sourceName && (
              <span className="text-neutral-400">Fonte: {post.sourceName}</span>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-400 font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function BlogPage() {
  const featured = getFeaturedPosts()
  const categories = getAllCategories()
  const allPosts = BLOG_POSTS.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <>
      {/* JSON-LD Blog schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Notícias ATA360',
            description: 'Notícias curadas sobre compras públicas, licitações e contratações governamentais',
            url: 'https://app.ata360.com.br/blog',
            publisher: { '@id': 'https://app.ata360.com.br/#organization' },
            inLanguage: 'pt-BR',
            blogPost: allPosts.map(p => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.excerpt,
              url: `https://app.ata360.com.br/blog/${p.slug}`,
              datePublished: p.publishedAt,
              dateModified: p.updatedAt,
              author: { '@type': 'Organization', name: p.author.name },
              timeRequired: `PT${p.readingTimeMin}M`,
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        {/* Header — bold, monochrome */}
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">Notícias</h1>
          <p className="text-lg text-neutral-500 max-w-2xl leading-relaxed">
            Notícias curadas sobre compras públicas, licitações e contratações governamentais — direto de fontes oficiais como TCU, CGU, PNCP e Gov.br.
          </p>
        </div>

        {/* Categories — monochrome pills */}
        <nav className="flex flex-wrap gap-2 mb-12" aria-label="Categorias do blog">
          {categories.map(cat => {
            const meta = BLOG_CATEGORIES[cat]
            return (
              <span
                key={cat}
                className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-foreground hover:text-foreground transition-colors cursor-default font-mono"
              >
                {meta.label}
              </span>
            )
          })}
        </nav>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-16" aria-label="Notícias em destaque">
            <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Destaques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(post => (
                <React.Fragment key={post.slug}>
                  <PostCard post={post} featured />
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {/* All posts */}
        <section aria-label="Todas as notícias">
          <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Todas as Notícias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPosts.map(post => (
              <React.Fragment key={post.slug}>
                <PostCard post={post} />
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* CTA — minimal, high contrast */}
        <div className="mt-20 text-center border-t border-neutral-200 dark:border-neutral-800 pt-12">
          <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">Quer saber mais?</h2>
          <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
            Solicite uma demonstração e descubra como o ATA360 pode transformar a gestão de contratações do seu município.
          </p>
          <Link
            href={'/solicitar-demonstracao' as Route}
            className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:bg-foreground/80 transition-colors"
          >
            Solicitar Demonstração
          </Link>
        </div>
      </div>
    </>
  )
}
