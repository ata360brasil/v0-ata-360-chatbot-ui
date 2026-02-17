import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Seguranca e IA Responsavel',
  description: 'Seguranca da informacao, IA responsavel, certificacoes, criptografia, isolamento multi-tenant e politica de uso responsavel de inteligencia artificial na ATA360.',
}

const IA_FAZ = [
  'Consulta exclusivamente fontes oficiais do governo brasileiro (PNCP, IBGE, TCU, CGU, BCB).',
  'Opera com multiplas camadas de verificacao cruzada contra alucinacao.',
  'Gera documentos por motor deterministico — nao por IA generativa.',
  'Audita automaticamente cada sugestao contra Lei 14.133/2021, LINDB e jurisprudencia.',
  'Exige revisao humana obrigatoria antes da finalizacao de qualquer artefato.',
  'Fundamenta cada sugestao com artigo, inciso e fonte rastreavel.',
  'Classifica todas as operacoes em 3 niveis de risco: baixo, medio, alto.',
  'Registra trilha de auditoria imutavel para cada interacao.',
] as const

const IA_NAO_FAZ = [
  'Nao inventa dados ou extrapola alem do que fontes oficiais demonstram.',
  'Nao sugere marcas, fornecedores ou direciona resultados de licitacao.',
  'Nao toma decisoes autonomas — a decisao e sempre do servidor.',
  'Nao armazena ou transmite dados de um ente publico para outro.',
  'Nao utiliza dados de usuarios para treinamento de modelos.',
  'Nao expoe parametros internos, formulas, pesos ou thresholds ao usuario.',
  'Nao processa dados de menores de idade ou dados sensiveis desnecessarios.',
  'Nao opera sem supervisao humana em etapas criticas do processo.',
] as const

const SEGURANCA_INFRA = [
  {
    titulo: 'Criptografia',
    itens: [
      'AES-256 para dados em repouso.',
      'TLS 1.3 para dados em transito.',
      'Chaves de criptografia rotacionadas automaticamente.',
      'Hashing de senhas com bcrypt (fator 12+).',
    ],
  },
  {
    titulo: 'Isolamento Multi-Tenant',
    itens: [
      'Row-Level Security (RLS) por orgao_id em todas as tabelas.',
      'Zero cross-tenant: dados de um ente nunca sao acessiveis por outro.',
      'Excecao unica: dados publicos do PNCP (publicados por forca de lei).',
      'Cada operacao validada no nivel de banco de dados, nao apenas na aplicacao.',
    ],
  },
  {
    titulo: 'Autenticacao e Autorizacao',
    itens: [
      'Autenticacao via Gov.br (Decreto 10.543/2020) com niveis bronze, prata e ouro.',
      'Tokens JWT com expiracao curta e refresh seguro.',
      'Controle de acesso baseado em perfis (SuperADM, LocalADM, membro).',
      'Auditoria de login: IP, user-agent, geolocalizacao, metodo de autenticacao.',
    ],
  },
  {
    titulo: 'Infraestrutura',
    itens: [
      'Edge computing distribuido globalmente com latencia < 50ms no Brasil.',
      'Replicacao geografica automatica para alta disponibilidade.',
      'SLA 99.9% com monitoramento 24/7.',
      'Backups automaticos com retencao conforme politica (5 anos para auditoria).',
    ],
  },
] as const

const CERTIFICACOES = [
  { nome: 'SOC 2 Type II', descricao: 'Controles de seguranca, disponibilidade, integridade e confidencialidade auditados por terceiro independente.', status: 'Infraestrutura parceira certificada' },
  { nome: 'ISO 27001', descricao: 'Sistema de gestao de seguranca da informacao conforme norma internacional.', status: 'Infraestrutura parceira certificada' },
  { nome: 'PCI DSS Level 1', descricao: 'Conformidade com padrao de seguranca de dados da industria de cartoes de pagamento.', status: 'Infraestrutura parceira certificada' },
  { nome: 'ISO 50001', descricao: 'Gestao de energia com eficiencia verificada. PUE < 1.1 nos datacenters.', status: 'Infraestrutura parceira certificada' },
  { nome: 'Pro-Etica CGU', descricao: 'Programa de integridade reconhecido pela Controladoria-Geral da Uniao.', status: 'Em processo de obtencao' },
  { nome: 'ABES', descricao: 'Certificacao da Associacao Brasileira das Empresas de Software.', status: 'Em processo de obtencao' },
] as const

export default function SegurancaPage() {
  return (
    <article className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* Header */}
      <header className="max-w-3xl mb-16">
        <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
          Seguranca e IA Responsavel
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
          Seguranca como arquitetura, nao como politica
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A seguranca do ATA360 nao e uma camada adicional — e uma propriedade
          fundamental da engenharia. Cada dado e isolado, cada operacao e auditada,
          cada sugestao e verificada.
        </p>
      </header>

      {/* IA Responsavel — FAZ / NAO FAZ */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">IA Responsavel</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Classificacao de risco: <strong>ALTO</strong> (conforme PL 2.338/2023, Art. 14 — IA em administracao publica).
          Avaliacao de Impacto Algoritmico (AIA) documentada conforme PBIA 2024-2028.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          Codigo de Conduta em IA publicavel com 10 principios alinhados aos 9 principios da PBIA.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FAZ */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-bold mb-4 text-success">O que a IA faz</h3>
            <ul className="space-y-3">
              {IA_FAZ.map((item) => (
                <li key={item} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-success shrink-0 mt-0.5">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NAO FAZ */}
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-bold mb-4 text-destructive">O que a IA nao faz</h3>
            <ul className="space-y-3">
              {IA_NAO_FAZ.map((item) => (
                <li key={item} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                  <span className="text-destructive shrink-0 mt-0.5">&times;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Seguranca de Infraestrutura */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Seguranca de infraestrutura</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Quatro pilares de seguranca aplicados em todas as camadas do sistema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEGURANCA_INFRA.map(({ titulo, itens }) => (
            <div key={titulo} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">{titulo}</h3>
              <ul className="space-y-2">
                {itens.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                    <span className="text-primary shrink-0 mt-0.5">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certificacoes */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Certificacoes</h2>
        <p className="text-sm text-muted-foreground mb-10">
          Certificacoes de seguranca verificadas na infraestrutura e em processo de obtencao pela ATA360.
        </p>

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold">Certificacao</th>
                  <th className="text-left p-4 font-semibold">Descricao</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {CERTIFICACOES.map(({ nome, descricao, status }) => (
                  <tr key={nome} className="border-b border-border/50 last:border-0">
                    <td className="p-4 font-medium whitespace-nowrap">{nome}</td>
                    <td className="p-4 text-muted-foreground">{descricao}</td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Filosofia de Decisao */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-2">Ambiente tecnico, nao substituto</h2>
        <p className="text-sm text-muted-foreground mb-10">
          O ATA360 nao substitui o gestor. Ele amadurece a decisao antes da assinatura.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h3 className="font-semibold mb-3">O problema da solidao tecnica</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              O erro na administracao publica, na maioria das vezes, nao nasce da
              falta de conhecimento. Nasce da solidao tecnica — decisoes publicas
              exigem metodo, entendimento e validacao qualificada. Um servidor que
              decide sozinho, sem ferramentas e sem segunda opiniao fundamentada,
              esta exposto a riscos que poderiam ser evitados.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Art. 28 da LINDB (Lei 13.655/2018) estabelece que a responsabilizacao
              pessoal do agente exige dolo ou erro grosseiro. Mas a melhor protecao
              nao e juridica — e preventiva. O ATA360 atua como ambiente de validacao
              que reduz riscos antes que eles se materializem.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Decisao preventiva, nao reativa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Ambientes tecnicos como o ATA360 nao substituem o gestor — amadurecem
              a decisao antes da assinatura de forma preventiva. A boa governanca
              nasce quando o dever tecnico-legal supera o desconforto e tranquiliza
              o agente publico com decisoes melhores e mais ageis.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              O TCE-MG alerta para o excesso de documentacao na habilitacao (Art. 67,
              Lei 14.133/2021) — exigencias desproporcionais restringem competicao.
              O ATA360 calibra checklists conforme o tipo e porte da contratacao,
              respeitando razoabilidade e proporcionalidade.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Um erro recorrente e antecipar a definicao do objeto na fase de ETP.
              O ETP nao nasce para descrever — nasce para entender o problema e
              mapear alternativas. O ATA360 garante essa sequencia logica: primeiro
              o diagnostico (ETP), depois a solucao (TR).
            </p>
          </div>
        </div>
      </section>

      {/* Assinatura Eletronica */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Assinatura eletronica</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Conforme Lei 14.063/2020, o ATA360 suporta tres niveis de assinatura eletronica:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">1.</span>
                <span><strong>Simples</strong> — Autenticacao Gov.br nivel bronze. Para atos internos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">2.</span>
                <span><strong>Avancada</strong> — Gov.br nivel prata ou ouro. Para documentos licitatorios.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">3.</span>
                <span><strong>Qualificada (ICP-Brasil)</strong> — Certificado digital A3. Para atos com fe publica.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Cada assinatura registra: IP, user-agent, geolocalizacao, metodo de
              autenticacao, timestamp e hash SHA-256 do documento. Carimbo de tempo
              conforme regulamentacao da ICP-Brasil para prova temporal irretratavel.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Divulgacao responsavel</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A ATA360 mantem programa de divulgacao responsavel de vulnerabilidades.
              Pesquisadores de seguranca podem reportar falhas de forma segura e
              confidencial.
            </p>
            <div className="rounded-lg border border-border bg-muted/20 p-6">
              <p className="text-sm font-semibold mb-2">Reportar vulnerabilidade</p>
              <p className="text-sm text-muted-foreground mb-3">
                Envie para <a href="mailto:suporte@ata360.com.br" className="text-primary hover:underline">suporte@ata360.com.br</a> com
                assunto &ldquo;Security Disclosure&rdquo;.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>SLA:</strong> Acusacao de recebimento em 48h. Primeira avaliacao em 5 dias uteis.
              </p>
              <p className="text-sm text-muted-foreground">
                Consulte nosso <Link href={'/termos' as Route} className="text-primary hover:underline">SECURITY.md</Link> para
                o escopo completo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
