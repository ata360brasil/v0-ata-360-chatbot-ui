import React from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

/**
 * Layout público para páginas legais.
 * Sem autenticação, sem sidebar. Minimalista e institucional.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="text-primary">▶</span>
            <span>ATA360</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href={'/privacidade' as Route} className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href={'/termos' as Route} className="hover:text-foreground transition-colors">
              Termos
            </Link>
            <Link href={'/lgpd' as Route} className="hover:text-foreground transition-colors">
              LGPD
            </Link>
            <Link href={'/cookies' as Route} className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-6 flex-wrap">
              <Link href={'/quem-somos' as Route} className="hover:text-foreground transition-colors">
                Quem Somos
              </Link>
              <Link href={'/privacidade' as Route} className="hover:text-foreground transition-colors">
                Privacidade
              </Link>
              <Link href={'/termos' as Route} className="hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href={'/lgpd' as Route} className="hover:text-foreground transition-colors">
                LGPD
              </Link>
              <Link href={'/cookies' as Route} className="hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <a
                href="mailto:contato@ata360.com.br"
                className="hover:text-foreground transition-colors"
              >
                contato@ata360.com.br
              </a>
              <a
                href="https://www.ata360.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                www.ata360.com.br
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} ATA360 TECNOLOGIA LTDA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
