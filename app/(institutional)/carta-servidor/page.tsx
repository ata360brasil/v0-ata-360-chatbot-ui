import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carta ao Servidor Público',
  description: 'Uma carta da equipe ATA360 aos servidores públicos brasileiros que trabalham com contratações. Reconhecimento, respeito e compromisso.',
}

/**
 * Carta ao Servidor Público
 *
 * Tom: respeitoso, empatico, direto. Sem marketing.
 * Centralizado, texto puro — como uma carta de verdade.
 */
export default function CartaServidorPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="mb-12">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Carta ao Servidor Público
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
          A voce que compra em nome do povo
        </h1>
      </header>

      {/* Corpo da carta */}
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>Prezado servidor,</p>

        <p>
          Sabemos que voce trabalha sob pressao de prazos legais que não ésperam.
          Que o orçamento do seu órgão não acompanha a complexidade dos normativos
          que voce e obrigado a cumprir. Que a Lei 14.133/2021 elevou o nivel de
          exigência técnica e jurídica, mas nem sempre vieram junto os recursos
          e as ferramentas.
        </p>

        <p>
          Sabemos que voce assina documentos que carregam responsabilidade pessoal.
          Que o Art. 11 da Lei 14.133/2021 e o Art. 28 da LINDB estao sempre presentes
          — e que errar, mesmo de boa-fe, pode ter consequências graves.
        </p>

        <p>
          Sabemos que voce precisa pesquisar preços em múltiplas fontes, fundamentar
          cada decisão com artigo e inciso, elaborar estudos técnicos, termos de
          referência e justificativas — muitas vezes sem equipe, sem sistema e sem
          referência confiável.
        </p>

        <p>
          O ATA360 foi construído para voce.
        </p>

        <p>
          Não para substituir seu julgamento — porque a decisão humana é soberana e
          nenhuma tecnologia deve tirar isso de voce. Mas para garantir que voce tenha
          acesso a mesma qualidade de dados, a mesma fundamentação jurídica e ao mesmo
          nivel de ferramentas que os maiores órgãos do pais utilizam.
        </p>

        <p>
          Cada dado que o ATA360 apresenta vem de fonte oficial. Cada sugestão e
          auditada antes de chegar a voce. Cada documento pode ser rastreado ate
          a norma que o fundamenta. E se algo não éstiver em conformidade, o sistema
          vai avisar — porque a nossa função e proteger voce, não acelerar processos
          a custa de segurança.
        </p>

        <p>
          Voce atende o público. Nos atendemos voce.
        </p>

        <p>
          Construimos o ATA360 com um único proposito: que o tempo que voce gasta
          em burocracia seja investido em decisão. Que voce tenha confiança no
          instrumento que usa. E que comprar em nome do povo seja reconhecido pelo
          que e — um ato de responsabilidade, não de risco.
        </p>

        <p>
          Obrigado por servir o Brasil. Nos estamos aqui para servir voce.
        </p>
      </div>

      {/* Assinatura */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <p className="font-semibold text-sm">Com respeito,</p>
        <p className="font-semibold text-sm mt-1">Equipe ATA360</p>
        <p className="text-xs text-muted-foreground mt-2">
          Belo Horizonte, MG &mdash; 2026
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          <a href="mailto:suporte@ata360.com.br" className="hover:text-foreground transition-colors">
            suporte@ata360.com.br
          </a>
          {' '}&bull;{' '}
          <a href="https://www.ata360.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            www.ata360.com.br
          </a>
        </p>
      </div>
    </article>
  )
}
