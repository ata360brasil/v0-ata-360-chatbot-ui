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

export default nextConfig
