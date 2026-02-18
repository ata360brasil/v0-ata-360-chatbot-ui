import type { Metadata } from 'next'
import { ContatoCnpjInput } from '@/components/contato-cnpj-input'

export const metadata: Metadata = {
  title: 'Carreiras — Trabalhe Conosco',
  description: 'Vagas abertas na ATA360 em Vespasiano/MG. Desenvolvedor, Designer, Comercial GovTech e Marketing Digital. Faca parte da GovTech que transforma compras públicas.',
}

const VAGAS = [
  {
    titulo: 'Desenvolvedor(a) Full-Stack',
    modalidade: 'CLT ou PJ + Estágio',
    regime: 'Hibrido ou Remoto',
    descrição: 'Desenvolvimento de features da plataforma, APIs e integração com fontes governamentais.',
    requisitos: [
      'Next.js / React (TypeScript)',
      'Supabase (PostgreSQL, Auth, RLS)',
      'Tailwind CSS',
      'Git + CI/CD',
    ],
    diferenciais: 'Cloudflare Workers, LLM APIs, conhecimento em setor público',
  },
  {
    titulo: 'UX/UI Designer',
    modalidade: 'CLT ou PJ + Estágio',
    regime: 'Hibrido ou Remoto',
    descrição: 'Interface da plataforma, site institucional e materiais visuais.',
    requisitos: [
      'Figma (design system, componentes, prototipacao)',
      'Design responsivo e acessível (WCAG 2.1 AA)',
      'Experiencia com produtos SaaS ou B2G',
    ],
    diferenciais: 'Webflow, motion design, pesquisa com usuarios do setor público',
  },
  {
    titulo: 'Comercial GovTech (SDR / AE)',
    modalidade: 'CLT',
    regime: 'Presencial ou Hibrido',
    descrição: 'Prospeccao de órgãos públicos, demonstracoes e relacionamento com gestores.',
    requisitos: [
      'Experiencia com vendas B2B ou B2G',
      'Conhecimento do setor público (licitação, pregão, contratos)',
      'Habilidade com CRM e outbound',
    ],
    diferenciais: 'Rede de contatos em prefeituras, associacoes de municípios, TCEs',
  },
  {
    titulo: 'Marketing Digital',
    modalidade: 'CLT ou PJ + Estágio',
    regime: 'Remoto',
    descrição: 'Blog, redes sociais, campanhas, SEO e materiais para conversao.',
    requisitos: [
      'SEO, conteúdo, redes sociais',
      'Copywriting para setor público (tom institucional)',
      'Google Analytics, ferramentas de automação',
    ],
    diferenciais: 'Experiencia com GovTech, licitações, inbound marketing B2G',
  },
] as const

export default function CarreirasPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Carreiras
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Faca parte do time que transforma compras públicas no Brasil
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A ATA360 esta contratando em Vespasiano/MG. Se voce quer trabalhar com
          tecnologia que impacta a administração pública, esse e o lugar.
        </p>
      </header>

      {/* Cultura */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Por que trabalhar na ATA360</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Startup GovTech com missao clara: melhorar a gestão pública brasileira',
            'Produto real com impacto direto em milhares de municípios',
            'Time enxuto, autonomia alta, burocracia zero',
            'Stack moderna: Next.js, Supabase, Cloudflare, IA',
            'Ambiente de aprendizado constante',
            'Crescimento rapido, impacto direto',
          ].map((item) => (
            <div key={item} className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vagas */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Vagas abertas</h2>
        <div className="space-y-6">
          {VAGAS.map((vaga) => (
            <div key={vaga.titulo} className="rounded-lg border border-border p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-lg font-bold">{vaga.titulo}</h3>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {vaga.modalidade}
                </span>
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded">
                  {vaga.regime}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{vaga.descrição}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Requisitos</p>
                  <ul className="space-y-1">
                    {vaga.requisitos.map((req) => (
                      <li key={req} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary shrink-0">&bull;</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Diferenciais</p>
                  <p className="text-sm text-muted-foreground">{vaga.diferenciais}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario */}
      <section id="candidatura" className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Envie sua candidatura</h2>
        <form
          action="/api/carreiras"
          method="POST"
          encType="multipart/form-data"
          className="max-w-2xl space-y-6"
        >
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-2">
              Nome completo <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              minLength={3}
              maxLength={120}
              placeholder="Seu nome completo"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="seu@email.com"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="vaga" className="block text-sm font-medium mb-2">
              Vaga de interesse <span className="text-destructive">*</span>
            </label>
            <select
              id="vaga"
              name="vaga"
              required
              defaultValue=""
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Selecione a vaga</option>
              {VAGAS.map((v) => (
                <option key={v.titulo} value={v.titulo}>{v.titulo}</option>
              ))}
              <option value="banco-talentos">Outra / Banco de Talentos</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium mb-2">
                Portfolio / GitHub
              </label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                placeholder="https://github.com/..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label htmlFor="curriculo" className="block text-sm font-medium mb-2">
              Curriculo (PDF, max 5MB) <span className="text-destructive">*</span>
            </label>
            <input
              type="file"
              id="curriculo"
              name="curriculo"
              required
              accept=".pdf"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary"
            />
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium mb-2">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              maxLength={2000}
              placeholder="Conte um pouco sobre voce e por que quer trabalhar na ATA360..."
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Enviar candidatura
          </button>

          <p className="text-xs text-muted-foreground">
            Analisamos todas as candidaturas. Retornaremos em até 5 dias úteis.
          </p>
        </form>
      </section>

      {/* Rodape */}
      <div className="mt-8 pt-8 border-t border-border/40 max-w-xl">
        <p className="text-xs text-muted-foreground">
          ATA360 TECNOLOGIA LTDA &mdash; Vespasiano/MG
        </p>
      </div>
    </article>
  )
}
