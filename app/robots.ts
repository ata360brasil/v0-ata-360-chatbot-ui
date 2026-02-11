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
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      // Bing AI (Copilot)
      {
        userAgent: 'bingbot',
        allow: ['/', '/blog/', '/glossario/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
    ],
    sitemap: 'https://app.ata360.com.br/sitemap.xml',
  }
}
