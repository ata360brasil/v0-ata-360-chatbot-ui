import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, BLOG_CATEGORIES, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { BreadcrumbJsonLd } from '@/components/structured-data'
import { BlogPostTracker } from '@/components/analytics-tracker'
import { renderMarkdown } from '@/lib/markdown'

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
  const contentHtml = await renderMarkdown(post.content)

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

      <BlogPostTracker slug={post.slug} category={post.category} />
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        {/* Breadcrumb — minimal, monochrome */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-12 font-mono" aria-label="Breadcrumb">
          <Link href={'/' as Route} className="hover:text-foreground transition-colors">inicio</Link>
          <span className="text-neutral-300">/</span>
          <Link href={'/blog' as Route} className="hover:text-foreground transition-colors">blog</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-500">{cat.label.toLowerCase()}</span>
        </nav>

        {/* Header — bold, clean, black/white */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest">{cat.label}</span>
            {post.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background tracking-wide">Destaque</span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-6 font-mono">
            <span>{post.author.name}</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </time>
            <span>{post.readingTimeMin} min</span>
          </div>
        </header>

        {/* Content — remark/rehype rendered, clean typography */}
        <div
          className="max-w-none text-[15px] leading-[1.8] text-neutral-700 dark:text-neutral-300 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:mb-5 [&_ol]:pl-5 [&_ol]:list-decimal [&_li]:mb-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-neutral-300 [&_a:hover]:decoration-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500 [&_code]:bg-neutral-100 [&_code]:dark:bg-neutral-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags — monochrome pills */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          {post.tags.map(tag => (
            <span key={tag} className="text-[11px] px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 font-mono">
              {tag}
            </span>
          ))}
        </div>

        {/* Legal references — subtle card */}
        {post.legalReferences.length > 0 && (
          <div className="mt-8 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Fundamentacao Legal</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5">
              {post.legalReferences.map(ref => (
                <li key={ref} className="font-mono text-xs">{ref}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Glossary links — monochrome */}
        {post.glossaryTerms.length > 0 && (
          <div className="mt-6">
            <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Termos Relacionados</h3>
            <div className="flex flex-wrap gap-1.5">
              {post.glossaryTerms.map(term => (
                <Link
                  key={term}
                  href={`/glossario/${term}` as Route}
                  className="text-[11px] px-3 py-1 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
                >
                  {term.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related posts — minimal cards */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800" aria-label="Artigos relacionados">
            <h2 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">Artigos Relacionados</h2>
            <div className="grid gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}` as Route}
                  className="group block p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-foreground transition-all"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:underline underline-offset-4">{r.title}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
