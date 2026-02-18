import { MetadataRoute } from 'next'

const WEBFLOW_URL = process.env.NEXT_PUBLIC_WEBFLOW_URL ?? ''
const webflowEnabled = WEBFLOW_URL.length > 0 && WEBFLOW_URL.startsWith('https://')

export default function robots(): MetadataRoute.Robots {
  // ─── Webflow habilitado: app.ata360.com.br é só o app autenticado ─────
  // Conteúdo público (blog, glossário, etc.) está no Webflow (www).
  // Buscadores devem indexar apenas /login no app.
  if (webflowEnabled) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: ['/login'],
          disallow: ['/'],
        },
      ],
      sitemap: 'https://app.ata360.com.br/sitemap.xml',
    }
  }

  // ─── Fallback: tudo local (dev/staging sem Webflow) ─────────────────────
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
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
      // Bing AI (Copilot)
      {
        userAgent: 'bingbot',
        allow: ['/', '/blog/', '/glossario/', '/jurisprudencia-tce/'],
        disallow: ['/api/', '/settings/', '/login'],
      },
    ],
    sitemap: 'https://app.ata360.com.br/sitemap.xml',
  }
}
