import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politica de Privacidade',
  description: 'Politica de Privacidade da ATA360 — como protegemos seus dados pessoais conforme a LGPD.',
}

/**
 * Politica de Privacidade — ATA360
 *
 * Conforme LGPD (Lei 13.709/2018) e diretrizes da ANPD.
 * NUNCA citar fornecedores, parceiros ou tecnologias internas.
 */
export default function PrivacidadePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Politica de Privacidade</h1>
      <p className="text-sm text-muted-foreground">
        Ultima atualizacao: 10 de fevereiro de 2026 &bull; Versao 1.0
      </p>

      <hr />

      {/* 1 */}
      <h2>1. Controlador de Dados</h2>
      <p>
        A <strong>ATA360 TECNOLOGIA LTDA</strong>, inscrita no CNPJ sob o n.
        61.291.296/0001-31, e a controladora dos dados pessoais tratados por meio da
        plataforma ATA360, nos termos do Art. 5, VI da LGPD (Lei 13.709/2018).
      </p>
      <p>
        <strong>Encarregado de Dados (DPO):</strong>{' '}
        <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>
      </p>

      {/* 2 */}
      <h2>2. Dados Pessoais Coletados</h2>
      <p>Coletamos as seguintes categorias de dados:</p>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Dados</th>
            <th>Finalidade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cadastrais</strong></td>
            <td>Nome completo, CPF, cargo, orgao de vinculacao</td>
            <td>Identificacao e autenticacao via Gov.br</td>
          </tr>
          <tr>
            <td><strong>De uso</strong></td>
            <td>Registros de navegacao, sessoes, acoes na plataforma</td>
            <td>Melhoria do servico e auditoria</td>
          </tr>
          <tr>
            <td><strong>De contratacao</strong></td>
            <td>Documentos licitatorios, processos, termos de referencia</td>
            <td>Prestacao do servico (geracao e auditoria de documentos)</td>
          </tr>
          <tr>
            <td><strong>De comunicacao</strong></td>
            <td>Mensagens no chat da plataforma</td>
            <td>Atendimento e melhoria continua</td>
          </tr>
        </tbody>
      </table>

      {/* 3 */}
      <h2>3. Bases Legais para o Tratamento</h2>
      <p>O tratamento dos seus dados pessoais esta fundamentado nas seguintes bases legais da LGPD (Art. 7):</p>
      <ul>
        <li>
          <strong>Consentimento (Art. 7, I)</strong> — para processamento por inteligencia artificial,
          analytics e comunicacoes opcionais.
        </li>
        <li>
          <strong>Execucao de contrato (Art. 7, V)</strong> — para prestacao do servico contratado
          (geracao de documentos, pesquisa de precos, acompanhamento de processos).
        </li>
        <li>
          <strong>Obrigacao legal (Art. 7, II)</strong> — para cumprimento da Lei 14.133/2021
          (Nova Lei de Licitacoes), Lei 12.527/2011 (LAI) e normativos do TCU, CGU e PNCP.
        </li>
        <li>
          <strong>Interesse legitimo (Art. 7, IX)</strong> — para seguranca da plataforma,
          prevencao a fraudes e melhoria continua dos algoritmos, sempre respeitando os
          direitos e liberdades fundamentais do titular.
        </li>
      </ul>

      {/* 4 */}
      <h2>4. Finalidades do Tratamento</h2>
      <ul>
        <li>Prestacao do servico de inteligencia em contratacoes publicas</li>
        <li>Geracao assistida de documentos licitatorios conforme a Lei 14.133/2021</li>
        <li>Auditoria automatica de conformidade legal</li>
        <li>Pesquisa de precos em fontes oficiais do governo brasileiro</li>
        <li>Melhoria continua da plataforma e dos modelos de inteligencia artificial</li>
        <li>Cumprimento de obrigacoes legais e regulatorias</li>
        <li>Prevencao a fraudes e irregularidades em contratacoes publicas</li>
      </ul>

      {/* 5 */}
      <h2>5. Inteligencia Artificial e Protecao de Dados</h2>
      <p>
        O ATA360 utiliza modelos de inteligencia artificial de ultima geracao com
        <strong> multiplas camadas de protecao</strong>:
      </p>
      <ul>
        <li>
          <strong>Blindagem anti-alucinacao:</strong> todos os dados utilizados pela IA sao
          verificados em fontes oficiais do governo brasileiro (PNCP, IBGE, SERPRO, TCU, BCB).
          A plataforma jamais inventa informacoes.
        </li>
        <li>
          <strong>Revisao humana obrigatoria:</strong> nenhum documento e finalizado sem
          aprovacao expressa do servidor publico responsavel. A decisao humana e soberana.
        </li>
        <li>
          <strong>Auditoria automatica de conformidade:</strong> cada documento gerado passa
          por auditoria sistematica que verifica aderencia a legislacao vigente, com fundamentacao
          legal transparente.
        </li>
        <li>
          <strong>Isolamento de dados:</strong> os dados de cada ente publico sao completamente
          isolados. Nenhum dado de um orgao e utilizado para treinar modelos ou enriquecer
          resultados de outro orgao.
        </li>
        <li>
          <strong>Processamento mediante consentimento:</strong> o processamento de dados por IA
          requer consentimento especifico (LGPD Art. 7, I), que pode ser revogado a qualquer momento.
        </li>
      </ul>

      {/* 6 */}
      <h2>6. Seguranca dos Dados</h2>
      <p>
        Empregamos medidas tecnicas e administrativas de nivel empresarial para proteger
        seus dados pessoais:
      </p>
      <ul>
        <li>
          <strong>Infraestrutura distribuida globalmente</strong> com provedores certificados
          SOC 2 Type II, ISO 27001, ISO 27018 e PCI DSS Level 1.
        </li>
        <li>
          <strong>Criptografia em transito</strong> (TLS 1.3) e <strong>em repouso</strong> (AES-256)
          para todos os dados armazenados.
        </li>
        <li>
          <strong>Isolamento multi-tenant rigoroso:</strong> cada orgao opera em ambiente logicamente
          isolado com controles de acesso por linha (Row-Level Security).
        </li>
        <li>
          <strong>Autenticacao federada</strong> via Gov.br com niveis de confianca (bronze, prata, ouro),
          conforme Decreto 10.543/2020.
        </li>
        <li>
          <strong>Trilha de auditoria imutavel</strong> com hash criptografico (SHA-256) para cada
          acao relevante, garantindo rastreabilidade integral.
        </li>
        <li>
          <strong>Monitoramento continuo</strong> com deteccao de anomalias, prevencao a intrusoes
          e resposta automatizada a incidentes.
        </li>
      </ul>

      {/* 7 */}
      <h2>7. Retencao de Dados</h2>
      <p>
        Os dados pessoais sao retidos pelo tempo necessario para cumprir as finalidades para
        as quais foram coletados, respeitando os seguintes prazos:
      </p>
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Prazo</th>
            <th>Base Legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Trilhas de auditoria</td>
            <td>5 anos</td>
            <td>Obrigacao legal (Lei 14.133/2021)</td>
          </tr>
          <tr>
            <td>Historico de conversas</td>
            <td>1 ano</td>
            <td>Execucao de contrato</td>
          </tr>
          <tr>
            <td>Dados de sessao</td>
            <td>30 dias</td>
            <td>Interesse legitimo</td>
          </tr>
          <tr>
            <td>Analytics agregados</td>
            <td>2 anos</td>
            <td>Interesse legitimo (dados anonimizados)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Apos o termino do periodo de retencao, os dados sao eliminados ou anonimizados
        de forma irreversivel, conforme Arts. 15 e 16 da LGPD.
      </p>

      {/* 8 */}
      <h2>8. Compartilhamento de Dados</h2>
      <p>Seus dados pessoais podem ser compartilhados exclusivamente nas seguintes hipoteses:</p>
      <ul>
        <li>
          <strong>Cumprimento de obrigacao legal:</strong> publicacao no PNCP, prestacao de contas
          ao TCU, CGU e orgaos de controle, conforme exigido pela Lei 14.133/2021.
        </li>
        <li>
          <strong>Consentimento explicito:</strong> quando voce autorizar expressamente o
          compartilhamento para finalidade especifica.
        </li>
        <li>
          <strong>Operadores de dados:</strong> provedores de infraestrutura que processam dados
          em nosso nome, vinculados por clausulas contratuais de protecao de dados (Art. 39, LGPD).
        </li>
      </ul>
      <p>
        <strong>A ATA360 jamais comercializa, aluga ou compartilha seus dados pessoais com
        terceiros para fins de marketing ou publicidade.</strong>
      </p>

      {/* 9 */}
      <h2>9. Transferencia Internacional de Dados</h2>
      <p>
        Para garantir alta disponibilidade e desempenho, parte do processamento pode ocorrer
        em infraestrutura distribuida globalmente. Nessas situacoes:
      </p>
      <ul>
        <li>
          Os provedores de infraestrutura sao vinculados por clausulas contratuais padrao (SCCs)
          que garantem nivel de protecao equivalente a LGPD.
        </li>
        <li>
          Todos os provedores possuem certificacoes internacionais de seguranca (SOC 2, ISO 27001).
        </li>
        <li>
          Os dados sao criptografados em transito e em repouso, independentemente da localizacao
          geografica do processamento.
        </li>
      </ul>

      {/* 10 */}
      <h2>10. Seus Direitos como Titular</h2>
      <p>
        Conforme o Art. 18 da LGPD, voce possui os seguintes direitos sobre seus dados pessoais:
        acesso, correcao, anonimizacao, eliminacao, portabilidade, informacao sobre compartilhamento
        e revogacao do consentimento.
      </p>
      <p>
        Para exercer qualquer desses direitos, consulte nossa{' '}
        <Link href={'/lgpd' as Route} className="font-medium">pagina dedicada a LGPD</Link> ou entre em
        contato pelo e-mail{' '}
        <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>.
      </p>

      {/* 11 */}
      <h2>11. Cookies e Tecnologias Similares</h2>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Finalidade</th>
            <th>Consentimento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Essenciais</strong></td>
            <td>Sessao, autenticacao, seguranca (CSRF)</td>
            <td>Dispensado (Art. 7, V)</td>
          </tr>
          <tr>
            <td><strong>Analytics</strong></td>
            <td>Metricas de uso e desempenho</td>
            <td>Requer consentimento</td>
          </tr>
          <tr>
            <td><strong>IA</strong></td>
            <td>Personalizacao e melhoria dos modelos</td>
            <td>Requer consentimento</td>
          </tr>
        </tbody>
      </table>
      <p>
        Voce pode gerenciar suas preferencias de cookies a qualquer momento nas configuracoes
        da plataforma.
      </p>

      {/* 12 */}
      <h2>12. Alteracoes nesta Politica</h2>
      <p>
        Reservamo-nos o direito de atualizar esta Politica de Privacidade periodicamente.
        Alteracoes substanciais serao comunicadas por e-mail ou notificacao na plataforma
        com antecedencia minima de 30 dias. A versao vigente estara sempre disponivel nesta pagina.
      </p>

      {/* 13 */}
      <h2>13. Contato</h2>
      <div className="rounded-lg border border-border p-6 bg-muted/20">
        <p className="font-semibold">ATA360 TECNOLOGIA LTDA</p>
        <p>CNPJ: 61.291.296/0001-31</p>
        <p>
          E-mail: <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>
        </p>
        <p>
          Site: <a href="https://www.ata360.com.br" target="_blank" rel="noopener noreferrer">www.ata360.com.br</a>
        </p>
      </div>
    </article>
  )
}
