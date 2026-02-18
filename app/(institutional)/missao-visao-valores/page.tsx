import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Missao, Visao e Valores',
  description: 'Missao, visao, proposito e os 7 valores que orientam o ATA360 na construcao de uma infraestrutura de inteligência para contratações públicas brasileiras.',
}

const VALORES = [
  {
    número: '01',
    nome: 'Legalidade',
    descrição: 'Cada função do sistema existe para cumprir a Lei 14.133/2021 e os princípios do Art. 37 da Constituição Federal. A conformidade não é feature — e fundamento.',
  },
  {
    número: '02',
    nome: 'Imparcialidade',
    descrição: 'A plataforma não favorece fornecedores, não sugere marcas e não direciona resultados. A imparcialidade e uma propriedade da engenharia, não uma política.',
  },
  {
    número: '03',
    nome: 'Transparência',
    descrição: 'Toda informação e rastreável até a fonte oficial. Calculos, fundamentacoes e sugestoes podem ser auditados pelo servidor, pelo controle interno e pelos tribunais.',
  },
  {
    número: '04',
    nome: 'Soberania da Decisão Humana',
    descrição: 'A IA sugere, fundamenta e audita. Quem decide e o servidor público. Revisao humana obrigatória em cada etapa, conforme Art. 20 da LINDB.',
  },
  {
    número: '05',
    nome: 'Seguranca',
    descrição: 'Criptografia de grau bancário, isolamento multi-tenant, certificacoes internacionais de segurança. Dados do ente público nunca sao acessíveis por outros usuarios.',
  },
  {
    número: '06',
    nome: 'Eficiencia',
    descrição: 'Infraestrutura distribuida globalmente. Pesquisa de preços em segundos. Documentos gerados com fundamentação automática. Tempo do servidor investido em decisão, não ém burocracia.',
  },
  {
    número: '07',
    nome: 'Evolucao Continua',
    descrição: 'Monitoramento diário do Diário Oficial da Uniao, atualização de normativos, índices econômicos e jurisprudência. O sistema evolui junto com a legislação.',
  },
] as const

export default function MissaoVisaoValoresPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Missao, Visao e Valores
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          O que nos orienta
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Princípios que guiam cada linha de código, cada integração com fonte oficial
          e cada sugestão apresentada ao servidor público.
        </p>
      </header>

      {/* Missao, Visao, Proposito — grid 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Missao</p>
          <h2 className="text-lg font-bold mb-3">Democratizar a inteligência em contratações públicas</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Garantir que todo servidor público brasileiro — de um município de 5 mil
            habitantes a uma capital de estado — tenha acesso a mesma qualidade de dados,
            fundamentação jurídica e ferramentas para comprar em nome do povo com segurança
            e conformidade.
          </p>
        </div>

        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Visao</p>
          <h2 className="text-lg font-bold mb-3">Referencia nacional em inteligência licitatoria</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ser reconhecida como a infraestrutura de dados mais confiável e completa
            do Brasil para contratações públicas — utilizada por municípios, estados e
            órgãos federais como padrão de excelencia em conformidade e eficiência.
          </p>
        </div>

        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Proposito</p>
          <h2 className="text-lg font-bold mb-3">Cada real público bem aplicado transforma vidas</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Contratações públicas não sao atos burocraticos — sao decisões que
            determinam se um hospital tera medicamentos, se uma escola tera material,
            se uma estrada sera construida. O ATA360 existe para que essas decisões
            sejam melhores.
          </p>
        </div>
      </div>

      {/* Valores — grid 2 colunas + 1 */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Nossos valores</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Sete princípios não negociaveis que orientam cada decisão de produto, engenharia e atendimento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALORES.map(({ número, nome, descrição }) => (
            <div key={número} className="rounded-lg border border-border p-6 flex gap-4">
              <span className="text-2xl font-bold text-primary/30 shrink-0">{número}</span>
              <div>
                <h3 className="font-semibold mb-2">{nome}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descrição}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Base legal */}
      <section className="mt-16 pt-8 border-t border-border/40">
        <h2 className="text-xl font-bold mb-4">Fundamentacao legal</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Os valores do ATA360 não sao aspiracionais — sao derivados diretamente da
          legislação brasileira aplicavel:
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Art. 37, CF/88</strong> — Principios da administração publica: legalidade, impessoalidade, moralidade, publicidade e eficiência.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Lei 14.133/2021</strong> — Nova Lei de Licitacoes: fase preparatória, ETP obrigatório, gestão de riscos, governança.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>LINDB, Arts. 20-23, 28, 30</strong> — Consequencias práticas, regime de transicao, dificuldades reais do gestor, responsabilização.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>LGPD (Lei 13.709/2018)</strong> — Protecao de dados pessoais, privacy-by-design, consentimento, direitos do titular.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Lei 12.846/2013</strong> — Lei Anticorrupcao: responsabilidade objetiva, programa de integridade.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>PL 2.338/2023 + PBIA</strong> — Marco regulatório da IA e Plano Brasileiro de IA 2024-2028: classificação de risco, AIA.</p>
          </div>
        </div>
      </section>
    </article>
  )
}
