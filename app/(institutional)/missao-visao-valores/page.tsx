import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Missao, Visao e Valores',
  description: 'Missao, visao, proposito e os 7 valores que orientam o ATA360 na construcao de uma infraestrutura de inteligencia para contratacoes publicas brasileiras.',
}

const VALORES = [
  {
    numero: '01',
    nome: 'Legalidade',
    descricao: 'Cada funcao do sistema existe para cumprir a Lei 14.133/2021 e os principios do Art. 37 da Constituicao Federal. A conformidade nao e feature — e fundamento.',
  },
  {
    numero: '02',
    nome: 'Imparcialidade',
    descricao: 'A plataforma nao favorece fornecedores, nao sugere marcas e nao direciona resultados. A imparcialidade e uma propriedade da engenharia, nao uma politica.',
  },
  {
    numero: '03',
    nome: 'Transparencia',
    descricao: 'Toda informacao e rastreavel ate a fonte oficial. Calculos, fundamentacoes e sugestoes podem ser auditados pelo servidor, pelo controle interno e pelos tribunais.',
  },
  {
    numero: '04',
    nome: 'Soberania da Decisao Humana',
    descricao: 'A IA sugere, fundamenta e audita. Quem decide e o servidor publico. Revisao humana obrigatoria em cada etapa, conforme Art. 20 da LINDB.',
  },
  {
    numero: '05',
    nome: 'Seguranca',
    descricao: 'Criptografia de grau bancario, isolamento multi-tenant, certificacoes internacionais de seguranca. Dados do ente publico nunca sao acessiveis por outros usuarios.',
  },
  {
    numero: '06',
    nome: 'Eficiencia',
    descricao: 'Infraestrutura distribuida globalmente. Pesquisa de precos em segundos. Documentos gerados com fundamentacao automatica. Tempo do servidor investido em decisao, nao em burocracia.',
  },
  {
    numero: '07',
    nome: 'Evolucao Continua',
    descricao: 'Monitoramento diario do Diario Oficial da Uniao, atualizacao de normativos, indices economicos e jurisprudencia. O sistema evolui junto com a legislacao.',
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
          Princípios que guiam cada linha de codigo, cada integracao com fonte oficial
          e cada sugestao apresentada ao servidor publico.
        </p>
      </header>

      {/* Missao, Visao, Proposito — grid 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Missao</p>
          <h2 className="text-lg font-bold mb-3">Democratizar a inteligencia em contratacoes publicas</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Garantir que todo servidor publico brasileiro — de um municipio de 5 mil
            habitantes a uma capital de estado — tenha acesso a mesma qualidade de dados,
            fundamentacao juridica e ferramentas para comprar em nome do povo com seguranca
            e conformidade.
          </p>
        </div>

        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Visao</p>
          <h2 className="text-lg font-bold mb-3">Referencia nacional em inteligencia licitatoria</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ser reconhecida como a infraestrutura de dados mais confiavel e completa
            do Brasil para contratacoes publicas — utilizada por municipios, estados e
            orgaos federais como padrao de excelencia em conformidade e eficiencia.
          </p>
        </div>

        <div className="rounded-lg border border-border p-8">
          <p className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">Proposito</p>
          <h2 className="text-lg font-bold mb-3">Cada real publico bem aplicado transforma vidas</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Contratacoes publicas nao sao atos burocraticos — sao decisoes que
            determinam se um hospital tera medicamentos, se uma escola tera material,
            se uma estrada sera construida. O ATA360 existe para que essas decisoes
            sejam melhores.
          </p>
        </div>
      </div>

      {/* Valores — grid 2 colunas + 1 */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Nossos valores</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Sete principios nao negociaveis que orientam cada decisao de produto, engenharia e atendimento.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALORES.map(({ numero, nome, descricao }) => (
            <div key={numero} className="rounded-lg border border-border p-6 flex gap-4">
              <span className="text-2xl font-bold text-primary/30 shrink-0">{numero}</span>
              <div>
                <h3 className="font-semibold mb-2">{nome}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Base legal */}
      <section className="mt-16 pt-8 border-t border-border/40">
        <h2 className="text-xl font-bold mb-4">Fundamentacao legal</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Os valores do ATA360 nao sao aspiracionais — sao derivados diretamente da
          legislacao brasileira aplicavel:
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Art. 37, CF/88</strong> — Principios da administracao publica: legalidade, impessoalidade, moralidade, publicidade e eficiencia.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Lei 14.133/2021</strong> — Nova Lei de Licitacoes: fase preparatoria, ETP obrigatorio, gestao de riscos, governanca.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>LINDB, Arts. 20-23, 28, 30</strong> — Consequencias praticas, regime de transicao, dificuldades reais do gestor, responsabilizacao.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>LGPD (Lei 13.709/2018)</strong> — Protecao de dados pessoais, privacy-by-design, consentimento, direitos do titular.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>Lei 12.846/2013</strong> — Lei Anticorrupcao: responsabilidade objetiva, programa de integridade.</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm"><strong>PL 2.338/2023 + PBIA</strong> — Marco regulatorio da IA e Plano Brasileiro de IA 2024-2028: classificacao de risco, AIA.</p>
          </div>
        </div>
      </section>
    </article>
  )
}
