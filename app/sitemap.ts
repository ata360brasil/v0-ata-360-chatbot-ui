import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { GLOSSARY_TERMS } from '@/lib/glossary'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://app.ata360.com.br'
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/dashboard`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/contracts`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/processes`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/assistants`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/files`, lastModified, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/history`, lastModified, changeFrequency: 'daily', priority: 0.5 },
    { url: `${baseUrl}/team`, lastModified, changeFrequency: 'weekly', priority: 0.5 },
    // Paginas institucionais (publicas — alta prioridade SEO)
    { url: `${baseUrl}/manifesto`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/quem-somos`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/missao-visao-valores`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compromissos`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compliance`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/seguranca`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/carta-servidor`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    // Blog e Glossario (SEO programatico — alta prioridade)
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/glossario`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    // Paginas legais
    { url: `${baseUrl}/privacidade`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/termos`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/lgpd`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Programmatic SEO: blog post pages
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: post.featured ? 0.85 : 0.7,
  }))

  // Programmatic SEO: glossary term pages
  const glossaryPages: MetadataRoute.Sitemap = GLOSSARY_TERMS.map(term => ({
    url: `${baseUrl}/glossario/${term.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [...staticPages, ...blogPages, ...glossaryPages]
}
