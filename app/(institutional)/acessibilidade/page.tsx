import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acessibilidade — ATA360',
  description: 'Declaracao de acessibilidade do ATA360. Compromisso com WCAG 2.1 AA, eMAG e Lei 13.146/2015.',
}

const RECURSOS = [
  {
    titulo: 'Navegacao por teclado',
    descricao: 'Todos os elementos interativos (botoes, links, formularios, modais) sao acessiveis via teclado (Tab, Enter, Escape).',
  },
  {
    titulo: 'Contraste de cores',
    descricao: 'As cores da interface atendem a relacao de contraste minima de 4.5:1 para texto normal e 3:1 para texto grande, conforme WCAG 2.1 AA.',
  },
  {
    titulo: 'Compatibilidade com leitores de tela',
    descricao: 'Utilizamos atributos ARIA e HTML semantico para garantir compatibilidade com NVDA, JAWS e VoiceOver.',
  },
  {
    titulo: 'Escala de fonte',
    descricao: 'A interface suporta aumento de ate 200% sem perda de funcionalidade ou conteudo.',
  },
  {
    titulo: 'Temas de alto contraste',
    descricao: 'O ATA360 oferece modo claro e escuro, ambos projetados com acessibilidade em mente.',
  },
  {
    titulo: 'Formularios acessiveis',
    descricao: 'Todos os campos possuem labels explicitos, mensagens de erro descritivas e indicacao visual de foco.',
  },
] as const

export default function AcessibilidadePage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Acessibilidade
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Declaracao de Acessibilidade
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O ATA360 e comprometido com a acessibilidade digital para todos os servidores
          publicos brasileiros.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Compromisso */}
        <section>
          <h2 className="text-xl font-bold mb-4">Compromisso</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A ATA360 TECNOLOGIA LTDA se compromete a tornar sua plataforma e site institucional
            acessiveis ao maior numero possivel de pessoas, independentemente de suas habilidades
            ou tecnologias assistivas utilizadas.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nosso objetivo e atingir o nivel de conformidade AA das Diretrizes de Acessibilidade
            para Conteudo Web (WCAG) 2.1, conforme recomendado pelo eMAG (Modelo de Acessibilidade
            em Governo Eletronico) e pela Lei 13.146/2015 (Estatuto da Pessoa com Deficiencia).
          </p>
        </section>

        {/* Legislacao */}
        <section>
          <h2 className="text-xl font-bold mb-4">Legislacao aplicavel</h2>
          <div className="space-y-3">
            {[
              'Lei 13.146/2015 — Estatuto da Pessoa com Deficiencia (Art. 63)',
              'Decreto 5.296/2004 — Acessibilidade em sites do governo',
              'eMAG — Modelo de Acessibilidade em Governo Eletronico (versao 3.1)',
              'WCAG 2.1 — Web Content Accessibility Guidelines (W3C)',
            ].map((lei) => (
              <div key={lei} className="rounded-lg border border-border p-3">
                <p className="text-sm text-muted-foreground">{lei}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recursos */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Recursos implementados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECURSOS.map((r) => (
            <div key={r.titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-sm mb-2">{r.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section className="mt-16 rounded-lg border border-border bg-muted/20 p-8">
        <h2 className="text-xl font-bold mb-4">Encontrou alguma barreira?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Queremos saber. Entre em contato com{' '}
          <a href="mailto:suporte@ata360.com.br" className="text-primary hover:underline">
            suporte@ata360.com.br
          </a>{' '}
          com o assunto &ldquo;Acessibilidade&rdquo;.
        </p>
        <p className="text-sm text-muted-foreground">
          Nos comprometemos a investigar e responder em ate 5 dias uteis.
        </p>
      </section>

      {/* Data */}
      <p className="mt-8 text-xs text-muted-foreground">
        Ultima atualizacao: Fevereiro de 2026
      </p>
    </article>
  )
}
