"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, LayoutGrid, List, ArrowUpDown, Brain, ShoppingCart, FileText, Coins, ShieldCheck, Landmark, GraduationCap, Building2, BarChart3, ChevronDown, ArrowRight, Zap, BookOpen, X, Type as type, LucideIcon, Sparkles, ScanSearch, UserCheck, FileCheck2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Assistant {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
  group: "essenciais" | "recursos" | "avancados";
  badge?: string;
  questions: string[];
}

const assistants: Assistant[] = [
  {
    id: "comprar",
    title: "Preciso comprar alguma coisa",
    icon: ShoppingCart,
    description:
      "Me diz o que é e eu encontro o melhor preço, fornecedor e caminho pra comprar",
    tags: [
      "Pesquisa de preços",
      "Fornecedores",
      "Comparativos",
      "ATAs vigentes",
    ],
    group: "essenciais",
    questions: [
      "Quanto custa papel A4 nas compras do governo?",
      "Preciso comprar 5 computadores pro CRAS",
      "Qual o preço de diesel S10 em Minas Gerais?",
      "Quanto municípios do meu tamanho gastam com material de limpeza?",
      "Quais órgãos em MG compraram equipamento odontológico nos últimos 6 meses?",
      "Compara preço de ambulância entre pregão e ATA",
      "Contratos de TI acima de R$ 100 mil na minha região",
      "Variação de preço de computador desktop nos últimos 2 anos por trimestre",
    ],
  },
  {
    id: "juridico",
    title: "O jurídico devolveu meu processo",
    icon: FileText,
    description:
      "Me mostra o que tá faltando e monto o processo completo pra você",
    tags: [
      "ETP",
      "Termo de Referência",
      "Pesquisa de Preços",
      "DFD",
      "Justificativas",
    ],
    group: "essenciais",
    questions: [
      "Preciso comprar 200 cadeiras pro auditório da prefeitura",
      "Gera a pesquisa de preços pra locação de 3 veículos",
      "Quero contratar internet pro prédio. O que preciso?",
      "O que falta no meu processo antes de mandar pro jurídico?",
      "Cria o Termo de Referência pra serviço de vigilância",
      "Faz o ETP pra compra de medicamentos da farmácia básica",
      "Monta a justificativa de dispensa pra conserto do telhado",
      "Manutenção emergencial do elevador \u2014 monta tudo pra mim",
    ],
  },
  {
    id: "economizar",
    title: "Quero economizar nessa compra",
    icon: Coins,
    description:
      "Vejo se tem ATA com saldo disponível agora ou preço melhor",
    tags: [
      "Saldo em tempo real",
      "Adesão a ATAs",
      "Carona",
      "Ofício automático",
    ],
    group: "essenciais",
    badge: "Exclusivo",
    questions: [
      "Tem ATA de medicamentos que eu possa pegar carona?",
      "Essa ATA ainda tem saldo pra 500 unidades?",
      "Qual ATA tem melhor preço pra ar-condicionado?",
      "Quanto vou economizar aderindo a ATAs ao invés de licitar tudo?",
      "ATAs de mobiliário escolar com saldo disponível",
      "Melhor custo-benefício considerando frete pra minha cidade",
      "Gera o ofício de adesão pra ATA de medicamentos do Estado de MG",
      "Quais ATAs federais eu posso aderir sendo município?",
    ],
  },
  {
    id: "assinar",
    title: "Preciso assinar mas tô com medo",
    icon: ShieldCheck,
    description:
      "Confiro tudo antes pra você assinar tranquilo \u2014 fornecedor, preço e documentação",
    tags: [
      "Verificação CNPJ",
      "Impedimentos",
      "Preço justo",
      "Checklist",
      "Dossiê",
    ],
    group: "essenciais",
    questions: [
      "Esse fornecedor tá regular? CNPJ 12.345.678/0001-90",
      "Confere se meu processo de dispensa tá completo",
      "Esse preço tá dentro da média do governo?",
      "Me mostra tudo sobre esse CNPJ antes de contratar",
      "O sócio desse fornecedor tem vínculo com servidor daqui?",
      "Esse fornecedor dá conta de entregar 10.000 unidades?",
      "Empresas impedidas de contratar com meu município",
      "O TCU já barrou contratação parecida com essa?",
    ],
  },
  {
    id: "dinheiro",
    title: "Tem dinheiro que eu posso usar?",
    icon: Landmark,
    description:
      "Descubro emendas, convênios e programas federais disponíveis pro seu órgão",
    tags: [
      "Emendas parlamentares",
      "Convênios",
      "FNS",
      "FNDE",
      "TransfereGov",
    ],
    group: "recursos",
    questions: [
      "Minha cidade tem dinheiro federal parado que eu não sei?",
      "Quais programas federais tão com inscrição aberta pro meu município?",
      "Tem emenda parlamentar indicada pra saúde na minha cidade?",
      "Quanto de Fundeb meu município recebeu esse ano?",
      "Convênios do meu município que estão perto de vencer",
      "Tem recurso de transporte escolar que não foi usado?",
      "Quais emendas de bancada foram destinadas pra MG esse ano?",
      "Meu hospital pode acessar recurso do FNS pra comprar equipamento?",
    ],
  },
  {
    id: "novo",
    title: "Sou novo aqui, me ajuda a entender",
    icon: GraduationCap,
    description:
      "Te explico como funciona compra pública e o que você precisa saber pra não errar",
    tags: [
      "Lei 14.133",
      "Modalidades",
      "Prazos",
      "Passo a passo",
      "Glossário",
    ],
    group: "recursos",
    questions: [
      "Qual a diferença entre pregão, dispensa e inexigibilidade?",
      "Até quanto posso comprar por dispensa sem licitar?",
      "Quais documentos são obrigatórios em qualquer compra?",
      "O que é uma ATA de registro de preços e como funciona?",
      "Qual o passo a passo completo pra fazer uma compra do zero?",
      "O que mudou da lei antiga (8.666) pra nova (14.133)?",
      "Quem é responsabilizado se der problema numa compra?",
      "O que é carona em ATA e quando posso usar?",
    ],
  },
  {
    id: "setorial",
    title: "Preciso de EPI pro batalhão / remédio pro hospital / material pra escola",
    icon: Building2,
    description:
      "Compras específicas pra saúde, educação, segurança e outros setores",
    tags: [
      "Saúde",
      "Educação",
      "Segurança",
      "Bombeiros",
      "Câmaras",
      "MP",
      "Consórcios",
    ],
    group: "avancados",
    questions: [
      "Preciso comprar desfibrilador pro SAMU \u2014 tem ATA?",
      "Quero ar-condicionado pra 8 salas de aula. Como faço?",
      "Tem ATA de colete balístico com saldo disponível?",
      "Compra de medicamentos controlados \u2014 o processo é diferente?",
      "Material de combate a incêndio \u2014 onde outros bombeiros compraram?",
      "A câmara de vereadores pode aderir a ATA da prefeitura?",
      "Como o MP compra mobiliário \u2014 dispensa ou pregão?",
      "Nosso consórcio de saúde pode pegar carona em ATA federal?",
    ],
  },
  {
    id: "relatorio",
    title: "Quero mostrar pros superiores o que economizamos",
    icon: BarChart3,
    description:
      "Gero relatórios de economia, comparativos e números pra apresentar",
    tags: [
      "Relatórios",
      "Economia",
      "Comparativos",
      "Indicadores",
      "Apresentação",
    ],
    group: "avancados",
    questions: [
      "Quanto meu órgão economizou usando ATAs nos últimos 12 meses?",
      "Compara nossos preços com a média nacional",
      "Quantos processos fizemos esse ano vs ano passado?",
      "Gera um resumo das compras do meu órgão pra apresentar pros superiores",
      "Ranking dos itens que mais compramos e quanto gastamos",
      "Quanto tempo médio nossos processos levam do início à contratação?",
      "Quais fornecedores mais contratamos e qual o desempenho deles?",
      "Gera relatório de compliance \u2014 tá tudo dentro da lei?",
    ],
  },
];

type ViewType = "cards" | "list";
type SortType = "name" | "group" | "questions";

const groupLabels: Record<string, string> = {
  essenciais: "Exemplos ilustrativos",
  recursos: "Recursos e Aprendizado",
  avancados: "Avançados",
};

export function AssistantsPage({
  onSendQuestion,
  onNavigate,
}: {
  onSendQuestion?: (question: string) => void;
  onNavigate?: (section: string) => void;
}) {
  const [viewType, setViewType] = useState<ViewType>("cards");
  const [sortBy, setSortBy] = useState<SortType>("group");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  const filteredAssistants = assistants.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      a.tags.some((t) => t.toLowerCase().includes(term)) ||
      a.questions.some((q) => q.toLowerCase().includes(term))
    );
  });

  const sortedAssistants = [...filteredAssistants].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "questions":
        return b.questions.length - a.questions.length;
      case "group":
      default: {
        const order = ["essenciais", "recursos", "avancados"];
        return order.indexOf(a.group) - order.indexOf(b.group);
      }
    }
  });

  const totalQuestions = assistants.reduce(
    (acc, a) => acc + a.questions.length,
    0
  );

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setShowAllQuestions(null);
    } else {
      setExpandedId(id);
      setShowAllQuestions(null);
    }
  };

  const renderQuestions = (assistant: Assistant) => {
    const showAll = showAllQuestions === assistant.id;
    const visible = showAll
      ? assistant.questions
      : assistant.questions.slice(0, 4);

    return (
      <div className="flex flex-col mt-2">
        {visible.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSendQuestion?.(q)}
            className="group/q flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg text-left transition-colors hover:bg-muted/50 cursor-pointer"
          >
            <span className="text-xs text-foreground flex-1">{q}</span>
            <ArrowRight className="size-3.5 text-muted-foreground/0 group-hover/q:text-muted-foreground transition-colors shrink-0" />
          </button>
        ))}
        {assistant.questions.length > 4 && (
          <button
            onClick={() =>
              setShowAllQuestions(showAll ? null : assistant.id)
            }
            className="flex items-center gap-1 mt-1 px-2 -mx-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronDown
              className={cn(
                "size-3 transition-transform duration-200",
                showAll && "rotate-180"
              )}
            />
            {showAll
              ? "Mostrar menos"
              : `Mais ${assistant.questions.length - 4} perguntas`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Introduction Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowIntro(false)}
          />
          <div className="relative bg-background border border-border/40 rounded-2xl max-w-3xl w-[90vw] h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-foreground" />
                <span className="text-sm font-semibold text-foreground uppercase">
                  Sobre o ATA360
                </span>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto">
              <div className="max-w-2xl mx-auto px-6 py-5">
                {/* Hero intro */}
                <div className="mb-6">
                  <h2 className="text-base font-bold text-foreground mb-2 text-balance">
                    O ATA360 trabalha com você.
                  </h2>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Se você compra, contrata ou assina em nome de um órgão
                    público, o ATA360 foi feito pra você.
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed mt-1.5">
                    Não importa se você é da prefeitura, da câmara de
                    vereadores, de uma secretaria estadual, do corpo de
                    bombeiros, de um hospital público, de uma escola, do
                    Ministério Público, de um tribunal, de um instituto
                    federal, de uma autarquia, de um consórcio intermunicipal
                    ou de uma organização que recebe recurso público.
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed mt-1.5">
                    Se você usa a Lei 14.133/2021 pra comprar, a gente te
                    ajuda.
                  </p>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* O que faz */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
                    O que o ATA360 faz por você
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Encontra o melhor preço com base em milhares de compras reais de outros órgãos.",
                      "Identifica ATAs vigentes e oportunidades de adesão pra você economizar.",
                      "Monta os documentos do seu processo: ETP, Termo de Referência, Pesquisa de Preços, DFD, justificativas.",
                      "Verifica se o fornecedor tá regular antes de você assinar.",
                      "Avisa quando tem prazo vencendo, contrato acabando ou dinheiro federal parado.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground/80 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* Quem usa */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
                    Quem usa o ATA360
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      "O pregoeiro da prefeitura que precisa de preço de referência em 5 minutos.",
                      "A servidora da câmara que faz compras sozinha sem apoio jurídico.",
                      "O gestor do hospital que compra medicamentos em escala e não pode errar.",
                      "O bombeiro que precisa de EPI e não encontra fornecedor na região.",
                      "A diretora da escola que quer ar-condicionado e não sabe por onde começar.",
                      "O assessor do MP que precisa de mobiliário e o processo voltou do jurídico.",
                      "O servidor do SAMU que precisa de desfibrilador pra ontem.",
                      "A contadora do consórcio de saúde que controla 12 municípios.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground/80 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* Por que e diferente */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
                    Por que o ATA360 é diferente
                  </h3>
                  <div className="space-y-2 text-xs text-foreground/80 leading-relaxed">
                    <p>
                      O mercado está cheio de ferramentas de inteligência
                      artificial que prometem resolver tudo. A maioria pega uma
                      resposta genérica e entrega pra você sem validação nenhuma.
                      Se inventa um artigo de lei, o problema é seu. Se a
                      fundamentação é fraca, quem responde é você. Se o valor tá
                      errado, o processo é anulado e a responsabilidade é sua.
                    </p>
                    <p>
                      Em contratação pública, errar não é opção. O documento foi
                      publicado. O dinheiro foi gasto. A responsabilidade tá
                      assinada.
                    </p>
                    <p>
                      O ATA360 foi construído com essa premissa. Quem trabalha
                      com compras públicas sabe o que faz — o que falta é
                      ferramenta à altura. Você não precisa de um sistema que
                      pense por você. Precisa de um que trabalhe junto, com a
                      mesma seriedade e o mesmo rigor que o seu trabalho exige.
                    </p>
                    <p>
                      É isso que o ATA360 entrega. Inteligência artificial onde
                      ela ajuda — com base legal verificável, dados de fontes
                      oficiais e precisão inegociável. Sem invenções, sem
                      atalhos, sem promessas que não se sustentam.
                    </p>
                    <p>
                      O ATA360 não é mais um software que você contrata e usa
                      sozinho. É infraestrutura do seu setor de compras.
                      Multiusuário — toda a equipe usa ao mesmo tempo, sem limite
                      de membros, sem criar gargalo. Quanto mais gente usando,
                      melhor o resultado. O estagiário pesquisa, o pregoeiro
                      monta o processo, o gestor assina, o jurídico confere —
                      todos no mesmo lugar, cada um no seu papel.
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-border/30 p-4">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-2.5">
                      O que nos diferencia
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "Cruzamento automático de 76+ fontes oficiais de dados — PNCP, Compras.gov, Portal da Transparência, IBGE e dezenas de outras.",
                        "Especialista na Lei 14.133/2021, sem invenções.",
                        "Pesquisas e documentos em segundos, não em dias.",
                        "Identificação de recursos federais subutilizados no seu município.",
                        "Multiusuário sem limites — toda a equipe dentro, sem gargalos.",
                        "Integrado ao fluxo real do seu órgão, não um sistema a mais pra aprender.",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                          <p className="text-xs text-foreground/80 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* Como tirar o maximo */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
                    Como tirar o máximo do ATA360
                  </h3>
                  <div className="space-y-2 text-xs text-foreground/80 leading-relaxed">
                    <p>
                      Você já ouviu falar que "dado ruim gera resultado ruim".
                      Com o ATA360 isso não acontece — nossos dados vêm direto
                      das fontes oficiais do governo: PNCP, Compras.gov, Portal
                      da Transparência, IBGE, e dezenas de outras bases
                      verificadas. O que entra é limpo. O que sai é confiável.
                    </p>
                    <p>
                      Mas a qualidade da sua pergunta faz diferença no nível de
                      detalhe da resposta. Quanto mais contexto você der, mais
                      preciso o resultado.
                    </p>
                  </div>

                  {/* Examples as elegant cards */}
                  <div className="mt-4 space-y-2.5">
                    {[
                      {
                        level: "Pergunta simples",
                        tag: "funciona",
                        question: "Quanto custa papel A4?",
                        result: "O ATA360 já traz preços reais de milhares de compras.",
                      },
                      {
                        level: "Pergunta com contexto",
                        tag: "funciona melhor",
                        question: "Quanto custa papel A4 em Minas Gerais nos últimos 6 meses?",
                        result: "Preços filtrados por região e período. Mais relevante pra você.",
                      },
                      {
                        level: "Pergunta específica",
                        tag: "resultado exato",
                        question: "Preciso comprar 500 resmas de papel A4 75g pra Secretaria de Educação. Tem ATA vigente? Qual o melhor preço na minha região?",
                        result: "Preços, ATAs vigentes, fornecedor verificado, comparativo e sugestão de modalidade. Tudo de uma vez.",
                      },
                    ].map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/30 p-3.5"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-semibold text-foreground">{ex.level}</span>
                          <span className="text-[10px] text-muted-foreground">— {ex.tag}</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          "{ex.question}"
                        </p>
                        <p className="text-[11px] text-foreground/60 mt-1.5 leading-relaxed">
                          {ex.result}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="mt-5">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wide mb-2.5">
                      Dicas pra perguntar melhor
                    </p>
                    <div className="space-y-1.5">
                      {[
                        'Diga o que você precisa comprar ou contratar. Quanto mais específico, melhor: "notebook i5 16GB" é melhor que só "computador".',
                        'Diga pra que ou pra quem: "pro CRAS", "pra escola municipal", "pro batalhão". Isso ajuda o sistema a entender o contexto.',
                        "Diga quanto: a quantidade muda tudo — define modalidade, preço unitário e se cabe em dispensa ou precisa de pregão.",
                        "Se puder, diga onde: sua cidade, seu estado, sua região. O ATA360 cruza dados geográficos pra trazer resultados mais relevantes.",
                        'Se souber, diga quando: "nos últimos 12 meses", "pra esse semestre", "antes de junho". Período refina a pesquisa de preços.',
                        "Use os filtros junto com o chat. Eles existem pra isso. Combinar uma pergunta boa com filtros de região, período e modalidade faz o resultado ficar cirúrgico.",
                        "Não tenha medo de perguntar errado. Não existe pergunta errada aqui. Se o ATA360 precisar de mais informação, ele vai te perguntar. Pode escrever do seu jeito, com as suas palavras. O sistema entende linguagem natural — você não precisa falar como um manual.",
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="size-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                          <p className="text-xs text-foreground/80 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* Evolui com voce */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
                    O ATA360 evolui com você
                  </h3>
                  <div className="space-y-2 text-xs text-foreground/80 leading-relaxed">
                    <p>
                      O sistema aprende com sua comunidade de milhares de
                      servidores. A cada interação, a cada pergunta, o ATA360
                      entende melhor o que vocês precisam e melhora suas
                      respostas.
                    </p>
                    <p>
                      Além disso, nossa equipe atualiza periodicamente o ATA360,
                      trazendo novidades, novas fontes de dados e melhorias —
                      sem custo extra e sem limitações. Você recebe sempre a
                      versão mais atual sem precisar fazer nada.
                    </p>
                    <p>
                      Você pode fazer parte dessa evolução. Tem sugestão, crítica
                      ou ideia? Fale com a gente pelo{" "}
                      <button
                        onClick={() => {
                          // Fale Conosco - a ser construído
                        }}
                        className="text-foreground font-medium underline underline-offset-2 hover:text-foreground/70 transition-colors cursor-pointer"
                      >
                        Fale Conosco
                      </button>
                      . Sua experiência no dia a dia da compra pública é o que
                      torna o ATA360 melhor pra todo mundo.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/30 my-5" />

                {/* Explore section */}
                <div className="pb-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">
                    Explore esta página
                  </h3>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    Cada pergunta que você vê aqui é um exemplo real do que o
                    sistema faz. Clique em qualquer uma e veja o resultado.
                    Explore, teste, descubra. O ATA360 tá aqui pra você
                    trabalhar com confiança.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-border/30 flex justify-center">
              <Button
                onClick={() => setShowIntro(false)}
                className="h-10 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain size={20} />
            Meus Assistentes
          </h1>
          <div className="flex items-center gap-2">
            {/* Introduction Button */}
            <Button
              onClick={() => setShowIntro(true)}
              className="h-9 px-4 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium gap-2"
            >
              <BookOpen size={14} />
              Introdução
            </Button>

            {/* View Type */}
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("cards")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "cards" &&
                    "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("list")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "list" &&
                    "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                <List size={16} />
              </Button>
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted"
                >
                  <ArrowUpDown size={14} />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("group")}>
                  Por Grupo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Por Nome
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("questions")}>
                  Por Perguntas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span>{assistants.length} assistentes</span>
          <span>{totalQuestions} perguntas</span>
          <span>3 grupos</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome, descrição, tag ou pergunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Super Cards - Soluções Avançadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-0">
          {[
            {
              icon: ScanSearch,
              title: "Análise de Edital",
              desc: "Leitura completa, identificação de riscos, exigências e oportunidades em segundos.",
  tags: ["Riscos", "Exigências", "Conformidade", "Habilitação", "Prazos", "Impugnação", "Critérios"],
  },
  {
  icon: UserCheck,
  title: "Análise de Fornecedor",
  desc: "Histórico, regularidade, capacidade técnica e reputação cruzados em 76+ fontes.",
  tags: ["CNPJ", "Histórico", "Regularidade", "Sanções", "Capacidade técnica", "Sócios", "Certidões"],
  },
  {
  icon: FileCheck2,
  title: "Análise de Contratos",
  desc: "Revisão de cláusulas, prazos, aditivos e alertas de inconformidade automáticos.",
  tags: ["Cláusulas", "Aditivos", "Alertas", "Vigência", "Reajuste", "Garantias", "Rescisão"],
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="relative group border border-foreground/10 rounded-2xl p-4 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-foreground/[0.04] to-transparent rounded-bl-[40px] pointer-events-none" />

                <div className="flex items-start gap-3.5 relative">
                  <div className="size-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
                    <Icon className="size-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-[13px] font-semibold text-foreground tracking-tight">{card.title}</p>
                      <Sparkles className="size-3 text-foreground/40" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{card.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-medium text-foreground/50 bg-foreground/[0.05] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {viewType === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-fr">
            {sortedAssistants.map((assistant) => {
              const IconComponent = assistant.icon;
              const isExpanded = expandedId === assistant.id;

              return (
                <div
                  key={assistant.id}
                  className={cn(
                    "border border-border rounded-3xl p-3 transition-colors bg-background flex flex-col cursor-pointer",
                    isExpanded ? "col-span-1 md:col-span-2 border-foreground" : ""
                  )}
                  onClick={() => toggleExpand(assistant.id)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <IconComponent className="size-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-tight truncate">
                          {assistant.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {assistant.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {assistant.badge && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 rounded-full border-foreground/20 gap-1"
                        >
                          <Zap size={10} />
                          {assistant.badge}
                        </Badge>
                      )}
                      <ChevronDown
                        className={cn(
                          "size-4 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-border/30">
                    {assistant.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-[8px] h-4 rounded-full border-foreground/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Group label + question count */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{groupLabels[assistant.group]}</span>
                    <span>{assistant.questions.length} perguntas</span>
                  </div>

                  {/* Expanded questions */}
                  {isExpanded && (
                    <div
                      className="mt-2 pt-2 border-t border-border/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-[10px] text-muted-foreground italic mb-2">
                        {'"'}
                        {assistant.description}
                        {'"'}
                      </p>
                      {renderQuestions(assistant)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* List view */
          <div className="space-y-2">
            {sortedAssistants.map((assistant) => {
              const IconComponent = assistant.icon;
              const isExpanded = expandedId === assistant.id;

              return (
                <div key={assistant.id}>
                  <div
                    className={cn(
                      "border border-border p-3 px-4 transition-colors bg-background flex items-center justify-between gap-4 cursor-pointer",
                      isExpanded
                        ? "rounded-t-3xl rounded-b-none border-b-0 border-foreground"
                        : "rounded-full"
                    )}
                    onClick={() => toggleExpand(assistant.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <IconComponent className="size-4 text-foreground" />
                      </div>
                      <div className="min-w-[180px] flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {assistant.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {assistant.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 hidden md:flex">
                        {assistant.badge && (
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 rounded-full border-foreground/20 gap-1"
                          >
                            <Zap size={10} />
                            {assistant.badge}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 rounded-full border-foreground/20"
                        >
                          {groupLabels[assistant.group]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {assistant.questions.length} perguntas
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200 shrink-0",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="border border-foreground border-t-0 rounded-b-3xl p-4 bg-background">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {assistant.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[8px] h-4 rounded-full border-foreground/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {renderQuestions(assistant)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
