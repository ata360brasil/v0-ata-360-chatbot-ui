import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts, getAllCategories, type BlogPost, type BlogCategory } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — Contratacoes Publicas e IA',
  description: 'Artigos, guias e analises sobre contratacoes publicas, Lei 14.133/2021, licitacoes e inteligencia artificial aplicada ao setor publico.',
  openGraph: {
    title: 'Blog ATA360 — Contratacoes Publicas e IA',
    description: 'Conhecimento tecnico sobre licitacoes, Lei 14.133/2021 e tecnologia para gestao publica.',
  },
}

function CategoryIcon({ category }: { category: BlogCategory }) {
  const icons: Record<BlogCategory, string> = {
    legislacao: '\u2696',
    licitacao: '\uD83D\uDCC4',
    'gestao-publica': '\uD83C\uDFDB',
    tecnologia: '\u2699',
    compliance: '\u2705',
    'ia-compras-publicas': '\uD83E\uDDE0',
    jurisprudencia: '\uD83D\uDD28',
    tutoriais: '\uD83D\uDCD6',
  }
  return <span className="text-lg" aria-hidden="true">{icons[category]}</span>
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const cat = BLOG_CATEGORIES[post.category]
  return (
    <article className={`group rounded-lg border border-border/40 bg-card hover:border-border hover:shadow-sm transition-all ${featured ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
      <Link href={`/blog/${post.slug}` as Route} className="block p-6">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon category={post.category} />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{cat.label}</span>
          {post.featured && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary tracking-wide">Destaque</span>
          )}
        </div>
        <h2 className={`font-semibold text-foreground group-hover:text-primary transition-colors mb-2 ${featured ? 'text-xl' : 'text-base'}`}>
          {post.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </time>
            <span>{post.readingTimeMin} min de leitura</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
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
            name: 'Blog ATA360',
            description: 'Artigos sobre contratacoes publicas, licitacoes e IA',
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

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Artigos, guias e analises sobre contratacoes publicas, Lei 14.133/2021 e inteligencia artificial aplicada ao setor publico.
          </p>
        </div>

        {/* Categories */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="Categorias do blog">
          {categories.map(cat => {
            const meta = BLOG_CATEGORIES[cat]
            return (
              <span
                key={cat}
                className="text-xs px-3 py-1.5 rounded-full border border-border/40 bg-card text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {meta.label}
              </span>
            )
          })}
        </nav>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section className="mb-12" aria-label="Artigos em destaque">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Destaques</h2>
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
        <section aria-label="Todos os artigos">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Todos os Artigos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPosts.map(post => (
              <React.Fragment key={post.slug}>
                <PostCard post={post} />
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center border-t border-border/40 pt-10">
          <h2 className="text-lg font-semibold text-foreground mb-2">Quer saber mais?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Solicite uma demonstracao e descubra como o ATA360 pode transformar a gestao de contratacoes do seu municipio.
          </p>
          <Link
            href={'/contato' as Route}
            className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Solicitar Demonstracao
          </Link>
        </div>
      </div>
    </>
  )
}
