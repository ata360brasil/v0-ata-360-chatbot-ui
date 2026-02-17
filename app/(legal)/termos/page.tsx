import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso da plataforma ATA360 para contratacoes publicas.',
}

/**
 * Termos de Uso — ATA360
 *
 * Conforme legislacao brasileira aplicavel.
 * NUNCA citar fornecedores, parceiros ou tecnologias internas.
 */
export default function TermosPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Termos de Uso</h1>
      <p className="text-sm text-muted-foreground">
        Ultima atualizacao: 10 de fevereiro de 2026 &bull; ATA360 versao 1.0 jan/2026
      </p>

      <hr />

      {/* 1 */}
      <h2>1. Identificacao das Partes</h2>
      <p>
        Estes Termos de Uso regulam a relacao entre a <strong>ATA360 TECNOLOGIA LTDA</strong>,
        inscrita no CNPJ sob o n. 61.291.296/0001-31, empresa de inovacao constituida nos termos
        da LC 182/2021 (Marco Legal das Startups), doravante denominada <strong>&quot;ATA360&quot;</strong>,
        e o usuario da plataforma, doravante denominado <strong>&quot;Usuario&quot;</strong>.
      </p>

      {/* 2 */}
      <h2>2. Objeto</h2>
      <p>
        O ATA360 e uma plataforma SaaS (Software as a Service) de inteligencia em contratacoes
        publicas brasileiras, especializada na Lei 14.133/2021 (Nova Lei de Licitacoes e Contratos
        Administrativos). O servico compreende:
      </p>
      <ul>
        <li>Geracao assistida de documentos licitatorios (DFD, ETP, TR, PP, JCD e outros)</li>
        <li>Pesquisa de precos em fontes oficiais do governo brasileiro</li>
        <li>Auditoria automatica de conformidade legal</li>
        <li>Acompanhamento de atas de registro de precos</li>
        <li>Inteligencia de dados para tomada de decisao em contratacoes publicas</li>
      </ul>

      {/* 3 */}
      <h2>3. Cadastro e Acesso</h2>
      <h3>3.1 Quem pode usar</h3>
      <p>
        O ATA360 e destinado <strong>exclusivamente a entes publicos</strong> (CNPJ) e seus
        servidores, empregados publicos e colaboradores (CPF vinculado ao ente). A plataforma
        <strong> nao atende fornecedores, licitantes ou particulares</strong>.
      </p>
      <h3>3.2 Autenticacao</h3>
      <p>
        O acesso e autenticado via Gov.br (Decreto 10.543/2020), garantindo identidade digital
        federada com niveis de confianca bronze, prata e ouro. O ente publico e responsavel por
        autorizar e gerenciar os membros vinculados a sua conta.
      </p>
      <h3>3.3 Responsabilidade pelo acesso</h3>
      <p>
        O Usuario e responsavel por manter a seguranca de suas credenciais Gov.br e por
        todas as atividades realizadas sob sua conta. Qualquer uso nao autorizado deve
        ser comunicado imediatamente a{' '}
        <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>.
      </p>

      {/* 3.4 */}
      <h3>3.4 Aceite obrigatorio</h3>
      <p>
        O uso da plataforma esta condicionado ao aceite integral destes Termos de Uso e
        da <Link href={'/privacidade' as Route} className="font-medium">Politica de Privacidade</Link>.
        <strong> O Usuario que nao concordar com os termos nao podera utilizar a plataforma.</strong> O
        aceite e registrado eletronicamente com data, hora, IP e identificacao do usuario
        via Gov.br.
      </p>
      <h3>3.5 Proibicao de compartilhamento</h3>
      <p>
        E <strong>expressamente proibido</strong> compartilhar credenciais de acesso, conceder
        acesso a terceiros nao autorizados ou permitir que pessoas nao vinculadas ao ente
        publico utilizem a plataforma. A violacao desta clausula enseja bloqueio imediato
        da conta e apuracao de responsabilidade nos termos da Lei 14.133/2021 (Art. 155) e
        do Codigo Penal (Art. 313-A — insercao de dados falsos em sistema de informacoes).
      </p>

      {/* 4 */}
      <h2>4. Uso Aceitavel</h2>
      <p>O Usuario compromete-se a utilizar a plataforma exclusivamente para fins licitos, sendo vedado:</p>
      <ul>
        <li>
          Tentar acessar, copiar, descompilar, desmontar ou realizar engenharia reversa de
          qualquer parte do software, algoritmo, modelo ou base de dados da plataforma.
        </li>
        <li>
          Utilizar robos, scrapers, crawlers ou qualquer meio automatizado para extrair
          dados da plataforma sem autorizacao expressa.
        </li>
        <li>
          Compartilhar credenciais de acesso, facilitar o acesso de terceiros nao autorizados
          ou utilizar a plataforma em nome de ente diverso.
        </li>
        <li>
          Inserir dados falsos, fraudulentos ou que visem direcionar, fraudar ou manipular
          processos licitatorios.
        </li>
        <li>
          Utilizar a plataforma para qualquer finalidade ilicita, incluindo mas nao se
          limitando a: conluio, fracionamento indevido, superfaturamento ou favorecimento
          de fornecedores.
        </li>
        <li>
          Reproduzir, distribuir ou sublicenciar o software ou seus resultados para fins
          comerciais sem autorizacao expressa da ATA360.
        </li>
      </ul>

      {/* 5 */}
      <h2>5. Propriedade Intelectual</h2>
      <h3>5.1 Software e Arquitetura</h3>
      <p>
        O software ATA360, incluindo sua arquitetura, algoritmos, modelos de inteligencia
        artificial, regras de negocio, interfaces, design e documentacao tecnica, e propriedade
        exclusiva da ATA360 TECNOLOGIA LTDA, protegido por:
      </p>
      <ul>
        <li><strong>Lei 9.609/1998</strong> — Protecao juridica de programas de computador</li>
        <li><strong>Lei 9.279/1996</strong> — Propriedade industrial e segredo industrial</li>
        <li><strong>Lei 9.610/1998</strong> — Direitos autorais</li>
      </ul>
      <h3>5.2 Artefatos Gerados</h3>
      <p>
        Os documentos licitatorios gerados pela plataforma (DFD, ETP, TR, PP, JCD etc.) sao
        de <strong>propriedade do ente publico</strong> que os gerou, nos termos do Art. 25
        da Lei 14.133/2021. A ATA360 nao reivindica propriedade sobre o conteudo dos artefatos.
      </p>
      <h3>5.3 Segredo Industrial</h3>
      <p>
        A arquitetura interna da plataforma, incluindo mas nao se limitando a: modelos de IA,
        regras de auditoria, mecanismos de blindagem, formulas de calculo, pesos, thresholds
        e parametros internos, constitui <strong>segredo industrial</strong> da ATA360 nos
        termos do Art. 195, XI a XIV da Lei 9.279/1996. A violacao configura ilicito civil
        e criminal.
      </p>

      {/* 6 */}
      <h2>6. Inteligencia Artificial e Limitacoes</h2>
      <h3>6.1 Natureza do Servico</h3>
      <p>
        O ATA360 e uma <strong>ferramenta de apoio a decisao</strong>. As sugestoes, analises
        e documentos gerados pela plataforma nao substituem o julgamento e a responsabilidade
        do servidor publico. <strong>A decisao humana e soberana</strong>.
      </p>
      <h3>6.2 Dados Oficiais</h3>
      <p>
        Todas as informacoes utilizadas pela inteligencia artificial sao provenientes de
        fontes oficiais do governo brasileiro, incluindo PNCP, IBGE, TCU, CGU, BCB e
        demais bases publicas. A plataforma nao inventa dados.
      </p>
      <h3>6.3 Multiplas Camadas de Seguranca</h3>
      <p>
        A IA opera com multiplas camadas de blindagem contra alucinacoes, verificacao
        cruzada de dados, auditoria automatica de conformidade e revisao humana obrigatoria
        antes da finalizacao de qualquer documento.
      </p>
      <h3>6.4 Limitacao de Responsabilidade por Conteudo IA</h3>
      <p>
        Apesar das multiplas camadas de seguranca, nenhum sistema de IA e infalivel.
        O Usuario e responsavel por revisar e validar todos os documentos antes de
        utiliza-los em processos licitatorios oficiais.
      </p>

      {/* 7 */}
      <h2>7. Selo de Qualidade ATA360</h2>
      <p>
        O Selo de Qualidade ATA360 &mdash; Governanca Ouro e uma certificacao que atesta
        a conformidade do documento com a legislacao vigente, a boa-fe processual e a
        utilizacao de dados oficiais. O selo e concedido automaticamente quando o documento
        atende aos criterios de conformidade da plataforma.
      </p>
      <p>
        Os criterios internos de concessao do selo constituem segredo industrial da ATA360
        e nao sao divulgados publicamente.
      </p>

      {/* 7.5 — Assinatura Eletronica */}
      <h2>8. Assinatura Eletronica</h2>
      <h3>8.1 Niveis de assinatura</h3>
      <p>
        O ATA360 suporta tres niveis de assinatura eletronica conforme a Lei 14.063/2020:
      </p>
      <ul>
        <li>
          <strong>Simples</strong> — Autenticacao Gov.br nivel bronze. Valida para atos
          internos e comunicacoes administrativas.
        </li>
        <li>
          <strong>Avancada</strong> — Gov.br nivel prata ou ouro. Valida para documentos
          licitatorios e atos que exijam identificacao inequivoca do signatario.
        </li>
        <li>
          <strong>Qualificada (ICP-Brasil)</strong> — Certificado digital A3 com fe publica.
          Utiliza infraestrutura de assinatura com certificacao ICP-Brasil para atos que
          exijam validade juridica plena.
        </li>
      </ul>
      <h3>8.2 Registro de assinatura</h3>
      <p>
        Cada assinatura eletronica registra: endereco IP, user-agent, geolocalizacao
        aproximada, metodo de autenticacao, timestamp UTC e hash SHA-256 do documento.
        Carimbo de tempo conforme regulamentacao da ICP-Brasil garante prova temporal
        irretratavel.
      </p>
      <h3>8.3 Clausula de aceite</h3>
      <p>
        Ao assinar eletronicamente qualquer documento via plataforma, o Usuario declara
        ciencia e concordancia com o conteudo assinado, assumindo responsabilidade pessoal
        pelo ato, nos termos do Art. 11 da Lei 14.133/2021.
      </p>

      {/* 9 */}
      <h2>9. Disponibilidade e SLA</h2>
      <p>
        A ATA360 se compromete com uma disponibilidade minima de <strong>99,9%</strong> (noventa
        e nove virgula nove por cento) ao mes, calculada conforme formula padrao do mercado.
        A infraestrutura e distribuida em multiplas regioes geograficas para garantir
        resiliencia e baixa latencia.
      </p>
      <p>
        Manutencoes programadas serao comunicadas com antecedencia minima de 48 horas.
        Janelas de manutencao preferenciais: sabados, das 02h00 as 06h00 (horario de Brasilia).
      </p>

      {/* 10 */}
      <h2>10. Limitacao de Responsabilidade</h2>
      <p>
        Na extensao maxima permitida pela legislacao brasileira (Codigo de Defesa do Consumidor,
        Codigo Civil e legislacao aplicavel):
      </p>
      <ul>
        <li>
          A ATA360 nao se responsabiliza por decisoes tomadas pelo Usuario com base nos
          documentos ou analises gerados pela plataforma.
        </li>
        <li>
          A responsabilidade total da ATA360 esta limitada ao valor pago pelo Usuario nos
          12 meses anteriores ao evento que deu origem a reclamacao.
        </li>
        <li>
          A ATA360 nao se responsabiliza por indisponibilidades decorrentes de forca maior,
          caso fortuito, acoes governamentais ou falhas de terceiros.
        </li>
      </ul>

      {/* 11 */}
      <h2>11. Bloqueio e Suspensao</h2>
      <p>
        A ATA360 reserva-se o direito de <strong>bloquear ou suspender</strong> o acesso do
        Usuario, sem aviso previo, nas seguintes hipoteses:
      </p>
      <ul>
        <li>Violacao de qualquer clausula destes Termos de Uso.</li>
        <li>Tentativa de engenharia reversa, extracao nao autorizada de dados ou acesso a areas restritas.</li>
        <li>Compartilhamento de credenciais ou acesso por terceiros nao autorizados.</li>
        <li>Insercao de dados falsos ou fraudulentos na plataforma.</li>
        <li>Suspeita fundamentada de uso para direcionamento de licitacao, conluio ou fraude.</li>
        <li>Inadimplencia apos 30 dias do vencimento da fatura.</li>
        <li>Determinacao judicial ou administrativa.</li>
      </ul>
      <p>
        O bloqueio nao exime o Usuario das obrigacoes contratuais ja assumidas. Trilhas de
        auditoria sao preservadas pelo prazo legal de 5 anos, mesmo apos bloqueio.
      </p>

      {/* 12 */}
      <h2>12. Rescisao</h2>
      <p>
        Qualquer das partes pode rescindir a relacao contratual mediante comunicacao por
        escrito com antecedencia minima de 30 dias. Em caso de rescisao:
      </p>
      <ul>
        <li>
          O Usuario tera direito a <strong>portabilidade dos dados</strong> (LGPD Art. 18, V),
          em formato estruturado, por ate 30 dias apos o termino do contrato.
        </li>
        <li>
          Trilhas de auditoria serao mantidas pelo prazo legal de 5 anos (Lei 14.133/2021),
          mesmo apos a rescisao.
        </li>
        <li>
          Dados pessoais serao eliminados ou anonimizados conforme nossa{' '}
          <Link href={'/privacidade' as Route} className="font-medium">Politica de Privacidade</Link>.
        </li>
      </ul>

      {/* 13 */}
      <h2>13. Disposicoes Gerais</h2>
      <h3>13.1 Legislacao Aplicavel</h3>
      <p>
        Estes Termos de Uso sao regidos pelas leis da Republica Federativa do Brasil,
        em especial: LGPD (Lei 13.709/2018), Lei 14.133/2021, Marco Civil da Internet
        (Lei 12.965/2014), Codigo de Defesa do Consumidor (Lei 8.078/1990) e Codigo Civil
        (Lei 10.406/2002).
      </p>
      <h3>13.2 Foro</h3>
      <p>
        Fica eleito o <strong>Foro da Comarca de Belo Horizonte/MG</strong> para dirimir
        quaisquer controversias decorrentes destes Termos, com renuncia expressa a qualquer
        outro, por mais privilegiado que seja.
      </p>
      <h3>13.3 Versionamento</h3>
      <p>
        Estes Termos sao versionados. A versao vigente esta identificada no topo desta
        pagina (ex: &quot;ATA360 versao 1.0 jan/2026&quot;). Versoes anteriores podem ser
        solicitadas via <a href="mailto:suporte@ata360.com.br">suporte@ata360.com.br</a>.
      </p>
      <h3>13.4 Alteracoes</h3>
      <p>
        A ATA360 reserva-se o direito de alterar estes Termos de Uso, comunicando o Usuario
        com antecedencia minima de 30 dias. O uso continuado da plataforma apos a notificacao
        constitui aceite tacito dos novos termos.
      </p>

      {/* 14 */}
      <h2>14. Contato</h2>
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
