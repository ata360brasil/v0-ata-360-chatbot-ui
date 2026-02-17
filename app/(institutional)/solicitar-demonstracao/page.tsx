import type { Metadata } from 'next'
import { ContatoCnpjInput } from '@/components/contato-cnpj-input'

export const metadata: Metadata = {
  title: 'Solicitar Demonstracao — ATA360',
  description: 'Agende uma demonstracao gratuita do ATA360 para seu orgao publico. Veja como automatizar pesquisa de precos, TR, ETP e DFD conforme a Lei 14.133.',
}

export default function SolicitarDemonstracaoPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Demonstracao
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Veja o ATA360 funcionando com dados do seu orgao
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Agende uma demonstracao personalizada. Mostramos como o ATA360 resolve
          os problemas reais da sua equipe de compras.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
        {/* Formulario */}
        <form
          action="/api/demonstracao"
          method="POST"
          className="space-y-6"
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
              E-mail institucional <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="servidor@orgao.gov.br"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="orgao" className="block text-sm font-medium mb-2">
                Orgao / Entidade <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="orgao"
                name="orgao"
                required
                minLength={3}
                maxLength={200}
                placeholder="Prefeitura Municipal de..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium mb-2">
                CNPJ do Orgao <span className="text-destructive">*</span>
              </label>
              <ContatoCnpjInput />
            </div>
          </div>

          <div>
            <label htmlFor="cargo" className="block text-sm font-medium mb-2">
              Cargo / Funcao
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              maxLength={120}
              placeholder="Pregoeiro, Agente de Contratacao, Secretario..."
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="equipe" className="block text-sm font-medium mb-2">
                Tamanho da equipe de compras <span className="text-destructive">*</span>
              </label>
              <select
                id="equipe"
                name="equipe"
                required
                defaultValue=""
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Selecione</option>
                <option value="1-2">1-2 servidores</option>
                <option value="3-5">3-5 servidores</option>
                <option value="6-10">6-10 servidores</option>
                <option value="10+">Mais de 10 servidores</option>
              </select>
            </div>
            <div>
              <label htmlFor="horario" className="block text-sm font-medium mb-2">
                Melhor horario <span className="text-destructive">*</span>
              </label>
              <select
                id="horario"
                name="horario"
                required
                defaultValue=""
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Selecione</option>
                <option value="manha">Manha (8h-12h)</option>
                <option value="tarde">Tarde (13h-17h)</option>
                <option value="qualquer">Qualquer horario</option>
              </select>
            </div>
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
              placeholder="Tem algum processo especifico que gostaria de ver na demonstracao?"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

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
              <a href="/privacidade" className="text-primary hover:underline">Politica de Privacidade</a>{' '}
              e os{' '}
              <a href="/termos" className="text-primary hover:underline">Termos de Uso</a>{' '}
              da ATA360.
            </label>
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Solicitar Demonstracao
          </button>

          <p className="text-xs text-muted-foreground">
            Demonstracao gratuita e sem compromisso. Exclusivo para orgaos publicos.
            Retornamos em ate 1 dia util.
          </p>
        </form>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-semibold text-sm mb-4">O que voce vai ver</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                Pesquisa de precos com dados reais do PNCP
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                Geracao de TR com fundamentacao legal automatica
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                ETP que herda do DFD — sem redigitar
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                Dados do seu municipio ja carregados (IBGE, FPM, PNCP)
              </li>
              <li className="flex gap-2">
                <span className="text-primary shrink-0">&bull;</span>
                Chat com IA especialista na Lei 14.133/2021
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-6">
            <p className="text-sm font-semibold mb-2">14 dias gratis</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as funcionalidades incluidas. Sem cartao de credito.
              Sem compromisso. Seus dados ficam salvos mesmo apos o periodo de teste.
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}
