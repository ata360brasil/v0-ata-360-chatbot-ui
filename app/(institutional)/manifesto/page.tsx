import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto — Admiramos Quem Muda o Brasil',
  description: 'O ATA360 nasceu para servir quem compra em nome do povo. Um manifesto em defesa da inteligência, da transparência e da dignidade nas contratações públicas brasileiras.',
}

/**
 * Manifesto ATA360
 *
 * Tom: confiante, respeitoso, factual. Sem exageros.
 * Inspirado no DOCX v4 mas adaptado as diretrizes do código.
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
          Todo dia, milhares de servidores públicos enfrentam prazos, normativos e
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
            O Brasil movimenta mais de R$ 1 trilhão por ano em compras públicas. Sao 5.570
            municípios, 26 estados, o Distrito Federal e centenas de autarquias, fundações e
            empresas públicas — todos obrigados a licitar conforme a Lei 14.133/2021.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Apesar do volume, a maioria dos entes opera com equipes reduzidas, sistemas
            fragmentados e acesso limitado a informação. O resultado: processos lentos,
            erros de fundamentação, preços sem referência confiável e risco pessoal para
            o servidor que assina o documento.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Lei 14.133/2021 trouxe avanços significativos — fase preparatória robusta,
            estudo técnico preliminar obrigatório, gestão de riscos, governança — mas também
            elevou o nivel de exigência técnica e jurídica. O TCU tem consolidado
            jurisprudência no sentido de que a responsabilidade do agente de contratação e
            pessoal, nos termos do Art. 11 da Lei.
          </p>
        </section>

        {/* Bloco 2 */}
        <section>
          <h2 className="text-xl font-bold mb-4">A nossa resposta</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 não e mais uma ferramenta genérica adaptada ao setor público. E uma
            infraestrutura construida desde o primeiro dia para a realidade das contratações
            públicas brasileiras — com a Lei 14.133/2021 como fundamento, não como adaptação.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Cada dado vem de fonte oficial. Cada sugestão e auditada antes de chegar ao
            servidor. Cada documento carrega fundamentação legal rastreável. E a decisão
            final é sempre humana — porque acreditamos que o papel da tecnologia é ampliar
            a capacidade do servidor, não substituí-la.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Somos uma empresa brasileira, constituída como Empresa Simples de Inovação
            nos termos da LC 182/2021, com registro no CNAE 6202-3/00. Nossa vocação e
            exclusiva: servir o setor público. Não atendemos fornecedores, licitantes ou
            particulares. Essa escolha é deliberada — ela garante que nossos incentivos
            estejam sempre alinhados com o interesse público.
          </p>
        </section>

        {/* Bloco 3 */}
        <section>
          <h2 className="text-xl font-bold mb-4">O que acreditamos</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Legalidade como fundamento</p>
              <p className="text-sm text-muted-foreground">
                Art. 37 da Constituição Federal: a administração pública obedecera aos
                princípios de legalidade, impessoalidade, moralidade, publicidade e
                eficiência. Cada função do ATA360 existe para servir esses princípios.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Dados oficiais como única fonte</p>
              <p className="text-sm text-muted-foreground">
                PNCP, IBGE, TCU, CGU, BCB, Portal da Transparência, Compras.gov.br.
                Não utilizamos dados de origem privada, não inferimos valores e nao
                extrapolamos além do que os registros oficiais demonstram.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Decisão humana soberana</p>
              <p className="text-sm text-muted-foreground">
                Conforme o Art. 20 da LINDB (Lei 13.655/2018), decisões devem considerar
                consequências práticas. A IA sugere, fundamenta e audita — mas quem decide
                é o servidor. Revisao humana obrigatória em cada etapa.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-sm mb-1">Responsabilidade com o dinheiro público</p>
              <p className="text-sm text-muted-foreground">
                Cada real economizado em uma contratação bem feita e um real disponível
                para saúde, educação e infraestrutura. Comprar bem não é burocracia — e
                administração responsável.
              </p>
            </div>
          </div>
        </section>

        {/* Bloco 4 */}
        <section>
          <h2 className="text-xl font-bold mb-4">Para quem construímos</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Para o pregoeiro de um município de 15 mil habitantes que precisa comprar
            medicamentos e não tem assessoria jurídica. Para a equipe de planejamento de
            uma capital que elabora centenas de termos de referência por ano. Para o
            controle interno que fiscaliza sem ter ferramentas a altura. Para o gestor
            que quer fazer o certo e precisa de fundamentação.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O Art. 22 da LINDB determina que a interpretação de normas considere as
            dificuldades reais do gestor e as exigências das políticas públicas a seu
            cargo. Conhecemos essas dificuldades. O ATA360 foi construído para enfrentá-las
            com dados, não com suposições.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Acreditamos que todo servidor público brasileiro que trabalha com contratações
            merece acesso a mesma qualidade de informação e ferramentas — independentemente
            do porte do município, da regiao ou do orçamento disponível.
          </p>
        </section>

        {/* Bloco 5 */}
        <section>
          <h2 className="text-xl font-bold mb-4">Imparcialidade como princípio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            O ATA360 não favorece fornecedores, não recomenda marcas, não direciona
            licitações. A plataforma opera com imparcialidade algorítmicamente garantida:
            os dados sao públicos, os cálculos sao rastráveis, e os resultados sao
            auditáveis.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esse compromisso não e apenas etico — é estrutural. A arquitetura do sistema
            foi desenhada para que nenhum parâmetro externo, interesse comercial ou
            influência indevida possa alterar os resultados apresentados ao servidor.
            A imparcialidade não é uma política: é uma propriedade da engenharia.
          </p>
        </section>

        {/* Bloco 6 — Solidao técnica */}
        <section>
          <h2 className="text-xl font-bold mb-4">O erro nasce da solidão técnica</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Na maioria das vezes, o erro na administração pública não nasce da falta de
            conhecimento. Nasce da solidão técnica — de decisões tomadas sem método, sem
            validação qualificada, sem um segundo par de olhos fundamentado. O servidor
            sabe o que precisa fazer; o que falta é o ambiente para fazer com segurança.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Um exemplo concreto: o ETP (Estudo Técnico Preliminar) não nasce para descrever
            o objeto — nasce para entender o problema e mapear alternativas no mercado. Mas
            sem orientação, muitos servidores antecipam a definição do objeto ainda na fase
            de estudo, comprometendo a logica do planejamento. O ATA360 garante a sequencia
            correta: primeiro o diagnóstico, depois a solução.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A boa governança nasce quando o dever técnico-legal supera o desconforto. O
            ATA360 é o ambiente que tranquiliza o agente público com decisões melhores,
            mais ágeis e auditáveis — antes da assinatura, não depois.
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
              <span>Manter revisao humana obrigatória em toda geração de documentos.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">03.</span>
              <span>Operar com múltiplas camadas de verificação contra alucinações de IA.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">04.</span>
              <span>Garantir imparcialidade: nenhum fornecedor e favorecido, nenhuma marca e sugerida.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">05.</span>
              <span>Proteger dados com isolamento multi-tenant e criptografia de grau bancário.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">06.</span>
              <span>Atender exclusivamente o setor público — alinhamento total com o interesse coletivo.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">07.</span>
              <span>Evoluir continuamente com base em feedback de servidores e atualizações legais.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Assinatura */}
      <div className="mt-16 pt-8 border-t border-border/40 max-w-xl">
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          &ldquo;Não construímos o ATA360 para vender tecnologia. Construimos para que o
          servidor público brasileiro tenha confiança no instrumento que usa para comprar
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
