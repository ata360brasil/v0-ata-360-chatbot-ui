import type { Metadata } from 'next'
import { ContatoCnpjInput } from '@/components/contato-cnpj-input'

export const metadata: Metadata = {
  title: 'Contato — Fale Conosco',
  description: 'Entre em contato com a ATA360. Solicite demonstração, tire dúvidas sobre contratações públicas ou reporte irregularidades pelo canal de ouvidoria.',
}

const TIPOS_CONTATO = [
  { value: 'demonstração', label: 'Solicitar Demonstração' },
  { value: 'dúvida', label: 'Dúvida sobre a Plataforma' },
  { value: 'contratação', label: 'Informações de Contratação' },
  { value: 'suporte', label: 'Suporte Técnico' },
  { value: 'denúncia', label: 'Denúncia / Ouvidoria' },
  { value: 'imprensa', label: 'Imprensa' },
  { value: 'parceria', label: 'Parcerias Institucionais' },
  { value: 'outro', label: 'Outro Assunto' },
] as const

/**
 * Pagina de Contato — Formulario Fale Conosco
 *
 * Formulario com validação client-side (HTML5).
 * Submissao via API route (app/api/contato/route.ts).
 * ZERO bibliotecas de formulário — HTML nativo + Tailwind.
 *
 * CNPJ do órgão e obrigatório (apenas entes públicos).
 */
export default function ContatoPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Contato
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Fale conosco
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Preencha o formulário abaixo ou envie um e-mail para{' '}
          <a href="mailto:suporte@ata360.com.br" className="text-primary hover:underline">
            suporte@ata360.com.br
          </a>. Respondemos em até 2 dias úteis.
        </p>
      </header>

      {/* 2 colunas: formulário + informações */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
        {/* Formulario */}
        <form
          action="/api/contato"
          method="POST"
          className="space-y-6"
        >
          {/* Nome */}
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail institucional <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="servidor@órgão.gov.br"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Órgão + CNPJ — 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="órgão" className="block text-sm font-medium mb-2">
                Órgão / Entidade <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="órgão"
                name="órgão"
                required
                minLength={3}
                maxLength={200}
                placeholder="Prefeitura Municipal de..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium mb-2">
                CNPJ do Órgão <span className="text-destructive">*</span>
              </label>
              <ContatoCnpjInput />
            </div>
          </div>

          {/* Cargo */}
          <div>
            <label htmlFor="cargo" className="block text-sm font-medium mb-2">
              Cargo / Funcao
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              maxLength={120}
              placeholder="Pregoeiro, Agente de Contratação, Secretário..."
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium mb-2">
              Tipo de contato <span className="text-destructive">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              required
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione o motivo
              </option>
              {TIPOS_CONTATO.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Mensagem */}
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium mb-2">
              Mensagem <span className="text-destructive">*</span>
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              minLength={20}
              maxLength={2000}
              rows={5}
              placeholder="Descreva como podemos ajudar..."
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <p className="text-xs text-muted-foreground mt-1">Máximo 2.000 caracteres.</p>
          </div>

          {/* Aceite */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="aceite"
              name="aceite"
              required
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <label htmlFor="aceite" className="text-xs text-muted-foreground leading-relaxed">
              Declaro que li e concordo com a{' '}
              <a href="/privacidade" className="text-primary hover:underline">Política de Privacidade</a>{' '}
              e os{' '}
              <a href="/termos" className="text-primary hover:underline">Termos de Uso</a>{' '}
              da ATA360. Os dados fornecidos serão utilizados exclusivamente para atender
              esta solicitação, conforme a LGPD (Lei 13.709/2018).
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Enviar Mensagem
          </button>
        </form>

        {/* Informacoes laterais */}
        <aside className="space-y-8">
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-semibold text-sm mb-4">Canais de atendimento</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Suporte</p>
                <a href="mailto:suporte@ata360.com.br" className="text-primary hover:underline">
                  suporte@ata360.com.br
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Ouvidoria</p>
                <a href="mailto:ouvidoria@ata360.com.br" className="text-primary hover:underline">
                  ouvidoria@ata360.com.br
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Financeiro / Contratos</p>
                <a href="mailto:financeiro@ata360.com.br" className="text-primary hover:underline">
                  financeiro@ata360.com.br
                </a>
                <p className="text-xs text-muted-foreground/60 mt-1">NF-e, contratos, confirmação de recebimento</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Site</p>
                <a href="https://www.ata360.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.ata360.com.br
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Prazo de resposta</p>
                <p>Até 2 dias úteis</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h3 className="font-semibold text-sm mb-4">Para quem é o ATA360</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Pregoeiros e agentes de contratação</li>
              <li>Equipes de planejamento</li>
              <li>Controle interno</li>
              <li>Secretários e gestores</li>
              <li>Assessoria jurídica de órgãos públicos</li>
            </ul>
            <p className="text-xs text-muted-foreground/60 mt-4">
              Atendemos exclusivamente entes públicos (CNPJ).
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-6">
            <h3 className="font-semibold text-sm mb-3">Ouvidoria</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para denúncias ou reportes de irregularidade, selecione
              &ldquo;Denúncia / Ouvidoria&rdquo; no formulário. O anonimato
              é garantido conforme Lei 13.608/2018.
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}
