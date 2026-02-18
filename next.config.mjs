import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Images (Vercel / Cloudflare best practices) ──────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
    ],
  },

  // ─── Security Headers (OWASP + Cloudflare / John Graham-Cumming) ──────────
  // CSP gerenciado dinamicamente pelo middleware.ts (nonce por request)
  // X-XSS-Protection REMOVIDO: deprecado, CSP substitui (OWASP 2024)
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        // Isolamento de contexto (protecao contra side-channel attacks)
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],

  // ─── Performance (Guillermo Rauch / Vercel) ───────────────────────────────
  reactStrictMode: true,
  compress: true,

  // ─── Experimental (Next.js 16 + React 19) ────────────────────────────────
  experimental: {
    typedRoutes: true,
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ─── Redirects (SEO) ─────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ]
  },

  // ─── Logging (dev only) ───────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry build options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Silenciar avisos se SENTRY_DSN não estiver configurado
  silent: !process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Upload sourcemaps para Sentry (melhor stack traces)
  widenClientFileUpload: true,

  // Ocultar sourcemaps do browser em produção
  hideSourceMaps: true,

  // Tree-shaking do SDK em dev se não configurado
  disableLogger: true,

  // Tunneling para evitar bloqueio por ad blockers
  tunnelRoute: '/monitoring',
})
