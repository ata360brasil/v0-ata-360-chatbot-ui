import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, BLOG_CATEGORIES, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { BreadcrumbJsonLd } from '@/components/structured-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    alternates: {
      canonical: `https://app.ata360.com.br/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  const related = getRelatedPosts(post)
  const cat = BLOG_CATEGORIES[post.category]

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Organization', name: post.author.name },
            publisher: { '@id': 'https://app.ata360.com.br/#organization' },
            url: `https://app.ata360.com.br/blog/${post.slug}`,
            inLanguage: 'pt-BR',
            timeRequired: `PT${post.readingTimeMin}M`,
            keywords: post.tags.join(', '),
            about: post.glossaryTerms.map(t => ({
              '@type': 'DefinedTerm',
              name: t,
              url: `https://app.ata360.com.br/glossario/${t}`,
            })),
            citation: post.legalReferences.map(ref => ({
              '@type': 'CreativeWork',
              name: ref,
            })),
          }),
        }}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Inicio', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: post.title, href: `/blog/${post.slug}` },
      ]} />

      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
          <Link href={'/' as Route} className="hover:text-foreground transition-colors">Inicio</Link>
          <span>/</span>
          <Link href={'/blog' as Route} className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{cat.label}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.label}</span>
            {post.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">Destaque</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60 border-b border-border/40 pb-6">
            <span>{post.author.name}</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>
            <span>{post.readingTimeMin} min de leitura</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:text-foreground">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>
            if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>
            if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>
            if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>
            if (line.match(/^\d+\. /)) return <li key={i}>{line.replace(/^\d+\. /, '')}</li>
            if (line.trim() === '') return null
            return <p key={i}>{line}</p>
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/40">
          {post.tags.map(tag => (
            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Legal references */}
        {post.legalReferences.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/40">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fundamentacao Legal</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              {post.legalReferences.map(ref => (
                <li key={ref}>{ref}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Glossary links */}
        {post.glossaryTerms.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Termos Relacionados</h3>
            <div className="flex flex-wrap gap-1.5">
              {post.glossaryTerms.map(term => (
                <Link
                  key={term}
                  href={`/glossario/${term}` as Route}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
                >
                  {term.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border/40" aria-label="Artigos relacionados">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Artigos Relacionados</h2>
            <div className="grid gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}` as Route}
                  className="block p-4 rounded-lg border border-border/40 hover:border-border hover:shadow-sm transition-all"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-1">{r.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
