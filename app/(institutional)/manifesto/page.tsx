import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto — Admiramos Quem Muda o Brasil',
  description: 'O ATA360 nasceu para servir quem compra em nome do povo. Um manifesto em defesa da inteligencia, da transparencia e da dignidade nas contratacoes publicas brasileiras.',
}

/**
 * Manifesto ATA360
 *
 * Tom: confiante, respeitoso, factual. Sem exageros.
 * Inspirado no DOCX v4 mas adaptado as diretrizes do codigo.
 * ZERO nomes internos (agentes, modelos, parceiros).
 */
export default function ManifestoPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Titulo */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Manifesto
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Admiramos quem muda o Brasil
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Todo dia, milhares de servidores publicos enfrentam prazos, normativos e
          responsabilidades para comprar em nome do povo. O ATA360 existe para que
          esse trabalho seja mais inteligente, mais seguro e mais digno.
        </p>
      </header>

      {/* Corpo — 2 colunas em telas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Bloco 1 */}
        <section>
          <h2 className="text-xl font-bold mb-4">O problema que nos move</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O Brasil movimenta mais de R$ 1 trilhao por ano em compras publicas. Sao 5.570
            municipios, 26 estados, o Distrito Federal e centenas de autarquias, fundacoes e
            empresas publicas — todos obrigados a licitar conforme a Lei 14.133/2021.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Apesar do volume, a maioria dos entes opera com equipes reduzidas, sistemas
            fragmentados e acesso limitado a informacao. O resultado: processos lentos,
            erros de fundamentacao, precos sem referencia confiavel e risco pessoal para
            o servidor que assina o documento.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Lei 14.133/2021 trouxe avancos significativos — fase preparatoria robusta,
            estudo tecnico preliminar obrigatorio, gestao de riscos, governanca — mas tambem
            elevou o nivel de exigencia tecnica e juridica. O TCU tem consolidado
            jurisprudencia no sentido de que a responsabilidade do agente de contratacao e
            pessoal, nos termos do Art. 11 da Lei.
          </p>
        </section>

        {/* Bloco 2 */}
        <section>
          <h2 className="text-xl font-bold mb-4">A nossa resposta</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 nao e mais uma ferramenta generica adaptada ao setor publico. E uma
            infraestrutura construida desde o primeiro dia para a realidade das contratacoes
            publicas brasileiras — com a Lei 14.133/2021 como fundamento, nao como adaptacao.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Cada dado vem de fonte oficial. Cada sugestao e auditada antes de chegar ao
            servidor. Cada documento carrega fundamentacao legal rastreavel. E a decisao
            final e sempre humana — porque acreditamos que o papel da tecnologia e ampliar
            a capacidade do servidor, nao substitui-la.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos uma empresa brasileira, constituida como Empresa Simples de Inovacao
            nos termos da LC 182/2021, com registro no CNAE 6202-3/00. Nossa vocacao e
            exclusiva: servir o setor publico. Nao atendemos fornecedores, licitantes ou
            particulares. Essa escolha e deliberada — ela garante que nossos incentivos
            estejam sempre alinhados com o interesse publico.
          </p>
        </section>

        {/* Bloco 3 */}
        <section>
          <h2 className="text-xl font-bold mb-4">O que acreditamos</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Legalidade como fundamento</p>
              <p className="text-sm text-muted-foreground">
                Art. 37 da Constituicao Federal: a administracao publica obedecera aos
                principios de legalidade, impessoalidade, moralidade, publicidade e
                eficiencia. Cada funcao do ATA360 existe para servir esses principios.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Dados oficiais como unica fonte</p>
              <p className="text-sm text-muted-foreground">
                PNCP, IBGE, TCU, CGU, BCB, Portal da Transparencia, Compras.gov.br.
                Nao utilizamos dados de origem privada, nao inferimos valores e nao
                extrapolamos alem do que os registros oficiais demonstram.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Decisao humana soberana</p>
              <p className="text-sm text-muted-foreground">
                Conforme o Art. 20 da LINDB (Lei 13.655/2018), decisoes devem considerar
                consequencias praticas. A IA sugere, fundamenta e audita — mas quem decide
                e o servidor. Revisao humana obrigatoria em cada etapa.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Responsabilidade com o dinheiro publico</p>
              <p className="text-sm text-muted-foreground">
                Cada real economizado em uma contratacao bem feita e um real disponivel
                para saude, educacao e infraestrutura. Comprar bem nao e burocracia — e
                administracao responsavel.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 4 */}
        <section>
          <h2 className="text-xl font-bold mb-4">Para quem construimos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Para o pregoeiro de um municipio de 15 mil habitantes que precisa comprar
            medicamentos e nao tem assessoria juridica. Para a equipe de planejamento de
            uma capital que elabora centenas de termos de referencia por ano. Para o
            controle interno que fiscaliza sem ter ferramentas a altura. Para o gestor
            que quer fazer o certo e precisa de fundamentacao.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O Art. 22 da LINDB determina que a interpretacao de normas considere as
            dificuldades reais do gestor e as exigencias das politicas publicas a seu
            cargo. Conhecemos essas dificuldades. O ATA360 foi construido para enfrenta-las
            com dados, nao com suposicoes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acreditamos que todo servidor publico brasileiro que trabalha com contratacoes
            merece acesso a mesma qualidade de informacao e ferramentas — independentemente
            do porte do municipio, da regiao ou do orcamento disponivel.
          </p>
        </section>

        {/* Bloco 5 */}
        <section>
          <h2 className="text-xl font-bold mb-4">Imparcialidade como principio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 nao favorece fornecedores, nao recomenda marcas, nao direciona
            licitacoes. A plataforma opera com imparcialidade algoritmicamente garantida:
            os dados sao publicos, os calculos sao rastreaveis, e os resultados sao
            auditaveis.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esse compromisso nao e apenas etico — e estrutural. A arquitetura do sistema
            foi desenhada para que nenhum parametro externo, interesse comercial ou
            influencia indevida possa alterar os resultados apresentados ao servidor.
            A imparcialidade nao e uma politica: e uma propriedade da engenharia.
          </p>
        </section>

        {/* Bloco 6 — Solidao tecnica */}
        <section>
          <h2 className="text-xl font-bold mb-4">O erro nasce da solidao tecnica</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Na maioria das vezes, o erro na administracao publica nao nasce da falta de
            conhecimento. Nasce da solidao tecnica — de decisoes tomadas sem metodo, sem
            validacao qualificada, sem um segundo par de olhos fundamentado. O servidor
            sabe o que precisa fazer; o que falta e o ambiente para fazer com seguranca.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Um exemplo concreto: o ETP (Estudo Tecnico Preliminar) nao nasce para descrever
            o objeto — nasce para entender o problema e mapear alternativas no mercado. Mas
            sem orientacao, muitos servidores antecipam a definicao do objeto ainda na fase
            de estudo, comprometendo a logica do planejamento. O ATA360 garante a sequencia
            correta: primeiro o diagnostico, depois a solucao.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A boa governanca nasce quando o dever tecnico-legal supera o desconforto. O
            ATA360 e o ambiente que tranquiliza o agente publico com decisoes melhores,
            mais ageis e auditaveis — antes da assinatura, nao depois.
          </p>
        </section>

        {/* Bloco 7 */}
        <section>
          <h2 className="text-xl font-bold mb-4">O compromisso que assumimos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Nos comprometemos publicamente com:
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">01.</span>
              <span>Utilizar exclusivamente dados de fontes oficiais do governo brasileiro.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">02.</span>
              <span>Manter revisao humana obrigatoria em toda geracao de documentos.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">03.</span>
              <span>Operar com multiplas camadas de verificacao contra alucinacoes de IA.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">04.</span>
              <span>Garantir imparcialidade: nenhum fornecedor e favorecido, nenhuma marca e sugerida.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">05.</span>
              <span>Proteger dados com isolamento multi-tenant e criptografia de grau bancario.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">06.</span>
              <span>Atender exclusivamente o setor publico — alinhamento total com o interesse coletivo.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">07.</span>
              <span>Evoluir continuamente com base em feedback de servidores e atualizacoes legais.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Assinatura */}
      <div className="mt-16 pt-8 border-t border-border/40 max-w-xl">
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          &ldquo;Nao construimos o ATA360 para vender tecnologia. Construimos para que o
          servidor publico brasileiro tenha confianca no instrumento que usa para comprar
          em nome do povo.&rdquo;
        </p>
        <p className="mt-4 font-semibold text-sm">Equipe ATA360</p>
        <p className="text-xs text-muted-foreground">
          Belo Horizonte, MG &mdash; 2026
        </p>
      </div>
    </article>
  )
}
