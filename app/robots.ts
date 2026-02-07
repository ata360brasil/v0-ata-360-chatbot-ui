import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
      // AI crawlers — explicitly allowed for AI-citability (GEO strategy)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/settings/', '/login'],
      },
    ],
    sitemap: 'https://app.ata360.com.br/sitemap.xml',
  }
}
