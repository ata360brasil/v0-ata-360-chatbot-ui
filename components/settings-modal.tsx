"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Palette,
  Accessibility,
  Play,
  HelpCircle,
  X,
  Building2,
  UserCircle,
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  Type,
  Keyboard,
  Contrast,
  Eye,
  MessageSquare,
  Headphones,
  Shield,
  ChevronRight,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Lock,
  FileText,
  Flag,
  ArrowLeft,
  Settings,
  Camera,
  Upload,
  Bell,
  Smartphone,
  Mail,
  ShieldCheck,
  Paperclip,
  ImageIcon,
  BookMarked,
  Download,
  Trash2,
  MoreVertical,
  Search,
  Globe,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  ExternalLink,
  KeyRound,
  EyeOff,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type SettingsSection = "profile" | "legal-library" | "password" | "theme" | "accessibility" | "how-it-works";
type ProfileTab = "institutional" | "member" | "parameters";
type HelpSection = "contact" | "support" | "faq" | "ombudsman";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Sub-modal: Fale Conosco ─────────────────────────────────────────────────

function ContactModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject("");
      setMessage("");
      onClose();
    }, 2000);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-md shadow-lg">
        {sent ? (
          <div className="px-6 py-10 text-center" role="status" aria-live="polite">
            <CheckCircle2 className="size-8 text-foreground mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Mensagem enviada com sucesso!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Retornaremos em breve.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-foreground" />
                <span id="contact-dialog-title" className="text-sm font-semibold text-foreground">
                  FALE CONOSCO
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar fale conosco"
                className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div>
                <label htmlFor="contact-subject" className="text-xs text-muted-foreground mb-1.5 block">
                  Assunto
                </label>
                <input
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Descreva brevemente o assunto..."
                  className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs text-muted-foreground mb-1.5 block">
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  rows={5}
                  className="w-full bg-background border border-border/50 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none p-4 leading-relaxed"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-border/30">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-10 flex-1 max-w-[160px] rounded-full border-border/60 bg-transparent hover:bg-muted/50 text-sm font-medium cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSend}
                disabled={!subject.trim() || !message.trim()}
                className="h-10 flex-1 max-w-[160px] rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
              >
                <Send className="size-3.5 mr-1.5" />
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-modal: Suporte Técnico ──────────────────────────────────────────────

type SupportView = "list" | "new" | "detail";
type TicketStatus = "aberto" | "em_andamento" | "resolvido";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  date: string;
  messages: { role: "user" | "support"; content: string; date: string }[];
}

const supportSubjects = [
  "Erro ao gerar documento",
  "Problema com assistente",
  "Erro de pesquisa de preços",
  "Problema de acesso/login",
  "Integração com sistemas",
  "Exportação de documentos",
  "Desempenho lento",
  "Dúvida sobre funcionalidade",
  "Outro",
];

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    subject: "Erro ao gerar Termo de Referência",
    category: "Erro ao gerar documento",
    status: "em_andamento",
    date: "03/02/2026",
    messages: [
      {
        role: "user",
        content:
          "Ao tentar gerar o TR, o sistema retorna erro na página.",
        date: "03/02 09:15",
      },
      {
        role: "support",
        content:
          "Estamos verificando o problema. Pode informar qual assistente estava utilizando?",
        date: "03/02 10:30",
      },
    ],
  },
  {
    id: "TK-002",
    subject: "Dúvida sobre exportação de documentos",
    category: "Exportação de documentos",
    status: "resolvido",
    date: "28/01/2026",
    messages: [
      {
        role: "user",
        content: "Como exporto documentos em formato .docx?",
        date: "28/01 14:00",
      },
      {
        role: "support",
        content:
          "Você pode exportar clicando no botão de download no painel de artefatos.",
        date: "28/01 15:20",
      },
    ],
  },
];

const statusLabels: Record<TicketStatus, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

const statusColors: Record<TicketStatus, string> = {
  aberto: "bg-foreground/10 text-foreground",
  em_andamento: "bg-foreground/10 text-foreground",
  resolvido: "bg-muted text-muted-foreground",
};

function SupportModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<SupportView>("list");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  if (!open) return null;

  const handleCreateTicket = () => {
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setNewSubject("");
      setNewCategory("");
      setNewMessage("");
      setView("list");
    }, 2000);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="support-dialog-title" className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-lg shadow-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            {(view === "new" || view === "detail") && (
              <button
                onClick={() => {
                  setView("list");
                  setSelectedTicket(null);
                }}
                aria-label="Voltar para lista de chamados"
                className="size-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer mr-1"
              >
                <ArrowLeft className="size-3.5 text-muted-foreground" />
              </button>
            )}
            <Headphones className="size-4 text-foreground" />
            <span id="support-dialog-title" className="text-sm font-semibold text-foreground">
              {view === "list"
                ? "SUPORTE TÉCNICO"
                : view === "new"
                  ? "NOVO CHAMADO"
                  : selectedTicket?.id}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar suporte técnico"
            className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 py-4">
            {ticketSent ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="size-8 text-foreground mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Chamado aberto com sucesso!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Acompanhe o status por aqui.
                </p>
              </div>
            ) : view === "list" ? (
              <div className="space-y-3">
                <Button
                  onClick={() => setView("new")}
                  className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer"
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Abrir chamado
                </Button>
                {mockTickets.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Meus chamados
                    </p>
                    {mockTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setView("detail");
                        }}
                        className="w-full text-left p-3 border border-border/30 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">
                            {ticket.subject}
                          </span>
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              statusColors[ticket.status],
                            )}
                          >
                            {statusLabels[ticket.status]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {ticket.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {ticket.date}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : view === "new" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Tema do assunto
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {supportSubjects.map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setNewCategory(subj)}
                        className={cn(
                          "text-[11px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                          newCategory === subj
                            ? "bg-foreground text-background border-foreground"
                            : "border-border/50 text-foreground hover:bg-muted",
                        )}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="support-subject" className="text-xs text-muted-foreground mb-1.5 block">
                    Assunto
                  </label>
                  <input
                    id="support-subject"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Descreva o problema..."
                    className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5"
                  />
                </div>
                <div>
                  <label htmlFor="support-description" className="text-xs text-muted-foreground mb-1.5 block">
                    Descrição
                  </label>
                  <textarea
                    id="support-description"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Detalhe o que está acontecendo..."
                    rows={5}
                    className="w-full bg-background border border-border/50 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none p-4 leading-relaxed"
                  />
                </div>
                <Button
                  onClick={handleCreateTicket}
                  disabled={
                    !newCategory ||
                    !newSubject.trim() ||
                    !newMessage.trim()
                  }
                  className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
                >
                  Abrir chamado
                </Button>
              </div>
            ) : selectedTicket ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      statusColors[selectedTicket.status],
                    )}
                  >
                    {statusLabels[selectedTicket.status]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {selectedTicket.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {selectedTicket.date}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground">
                  {selectedTicket.subject}
                </p>
                <div className="space-y-3 border-t border-border/30 pt-3">
                  {selectedTicket.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                          msg.role === "user"
                            ? "bg-foreground text-background"
                            : "bg-muted text-foreground",
                        )}
                      >
                        <p className="text-xs leading-relaxed">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.role === "user"
                              ? "text-background/60"
                              : "text-muted-foreground",
                          )}
                        >
                          {msg.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedTicket.status !== "resolvido" && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Responder..."
                      aria-label="Responder ao chamado"
                      className="flex-1 bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5"
                    />
                    <button
                      disabled={!replyMessage.trim()}
                      aria-label="Enviar resposta"
                      className="size-9 rounded-full bg-foreground text-background flex items-center justify-center cursor-pointer disabled:opacity-40"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Sub-modal: FAQ / Perguntas Frequentes ──────────────────────────────

type FaqCategory = "all" | "plataforma" | "documentos" | "ia" | "legal" | "seguranca" | "contratacao" | "dados";

interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
  level: "basico" | "intermediario" | "avancado";
}

const FAQ_CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "plataforma", label: "Plataforma" },
  { value: "documentos", label: "Documentos" },
  { value: "ia", label: "IA" },
  { value: "legal", label: "Legal" },
  { value: "seguranca", label: "Seguranca" },
  { value: "contratacao", label: "Contratacao" },
  { value: "dados", label: "Dados" },
];

const FAQ_DATA: FaqItem[] = [
  // ── Plataforma (basico)
  {
    q: "O que e o ATA360?",
    a: "O ATA360 e uma plataforma de inteligencia em contratacoes publicas. Ele ajuda servidores a planejar, pesquisar precos, gerar documentos licitatorios e auditar conformidade — tudo fundamentado na Lei 14.133/2021 e em dados oficiais.",
    category: "plataforma",
    level: "basico",
  },
  {
    q: "Quem pode usar o ATA360?",
    a: "Exclusivamente entes publicos (CNPJ de orgao/entidade da administracao publica) e seus servidores, empregados publicos ou colaboradores vinculados (CPF). Fornecedores, licitantes e pessoas fisicas nao sao atendidos.",
    category: "plataforma",
    level: "basico",
  },
  {
    q: "Como faco login?",
    a: "O acesso e feito via Gov.br (autenticacao federada). Basta clicar em 'Acessar Plataforma' e utilizar suas credenciais Gov.br. Niveis prata ou ouro permitem assinatura avancada de documentos.",
    category: "plataforma",
    level: "basico",
  },
  {
    q: "Existe versao gratuita ou periodo de teste?",
    a: "O ATA360 oferece periodo de avaliacao de 14 dias com funcionalidades completas. Apos o periodo, a contratacao e formalizada conforme a modalidade adequada ao ente publico.",
    category: "plataforma",
    level: "basico",
  },
  {
    q: "O ATA360 funciona no celular?",
    a: "Sim. A interface e responsiva e funciona em qualquer navegador moderno (desktop, tablet ou celular). Nao e necessario instalar aplicativo.",
    category: "plataforma",
    level: "basico",
  },
  // ── Documentos (basico → intermediario)
  {
    q: "Quais documentos o ATA360 gera?",
    a: "DFD, ETP, Pesquisa de Precos, Termo de Referencia, Mapa de Riscos, Justificativa de Contratacao Direta, Ata de Registro de Precos, entre outros — mais de 20 tipos de artefatos licitatorios.",
    category: "documentos",
    level: "basico",
  },
  {
    q: "Posso editar os documentos gerados?",
    a: "Sim. Toda sugestao gerada passa por revisao humana obrigatoria. Voce pode aceitar, editar ou rejeitar cada secao antes de finalizar. O documento so e considerado oficial apos sua aprovacao.",
    category: "documentos",
    level: "basico",
  },
  {
    q: "Em qual formato os documentos sao exportados?",
    a: "PDF com identidade visual padronizada, assinatura eletronica e selo de qualidade (quando conforme). O layout segue principios de Legal Design para leitura acessivel.",
    category: "documentos",
    level: "intermediario",
  },
  {
    q: "O que e o Selo de Qualidade ATA360?",
    a: "O selo certifica que o documento foi gerado com dados oficiais, fundamentacao legal rastreavel e passou pela auditoria automatica de conformidade. Ele aparece automaticamente quando os criterios sao atendidos — e fica ausente (sem explicacao) quando nao sao.",
    category: "documentos",
    level: "intermediario",
  },
  {
    q: "Como funciona o ETP no ATA360?",
    a: "O ETP (Estudo Tecnico Preliminar) segue a logica do Art. 18 da Lei 14.133/2021: primeiro diagnostica o problema, depois mapeia alternativas de mercado. O ATA360 impede a antecipacao da definicao do objeto na fase de estudo — um erro recorrente na administracao publica.",
    category: "documentos",
    level: "intermediario",
  },
  // ── IA (intermediario → avancado)
  {
    q: "A IA do ATA360 pode inventar dados?",
    a: "Nao. A geracao de documentos utiliza motor deterministico (nao IA generativa). Todas as informacoes provem de fontes oficiais (PNCP, IBGE, TCU, BCB). Sugestoes inteligentes passam por 8 camadas de blindagem e exigem revisao humana obrigatoria.",
    category: "ia",
    level: "intermediario",
  },
  {
    q: "A IA substitui o servidor publico?",
    a: "Nao. O ATA360 amadurece a decisao antes da assinatura. A decisao humana e soberana (Art. 20 da LINDB). O sistema oferece dados oficiais e fundamentacao legal rastreavel — reduzindo o risco de erro que nasce da solidao tecnica, nao da falta de conhecimento.",
    category: "ia",
    level: "intermediario",
  },
  {
    q: "Como a IA e auditada?",
    a: "Toda sugestao gerada por IA e verificada automaticamente por um agente de auditoria independente que cruza a saida contra a legislacao, jurisprudencia e dados oficiais. Resultados sao classificados em Conforme, Ressalvas ou Nao Conforme — com fundamentacao explicita.",
    category: "ia",
    level: "avancado",
  },
  {
    q: "Qual o papel da IA na pesquisa de precos?",
    a: "A IA consulta fontes oficiais (PNCP, Compras.gov.br) conforme a IN SEGES 65/2021, calcula media, mediana, desvio padrao (Bessel) e coeficiente de variacao. Precos fora do intervalo interquartil sao sinalizados automaticamente. A decisao final sobre qual preco adotar e do servidor.",
    category: "ia",
    level: "avancado",
  },
  // ── Legal (intermediario → avancado)
  {
    q: "Qual lei fundamenta o ATA360?",
    a: "A Lei 14.133/2021 (Nova Lei de Licitacoes e Contratos Administrativos). Alem dela, o sistema incorpora LINDB (Lei 13.655/2018), LGPD (Lei 13.709/2018), Marco Civil da Internet (Lei 12.965/2014), Lei Anticorrupcao (Lei 12.846/2013) e 560+ jurisprudencias de tribunais de contas.",
    category: "legal",
    level: "intermediario",
  },
  {
    q: "O que e a LINDB e como se aplica?",
    a: "A LINDB (Lei 13.655/2018) estabelece normas de seguranca juridica para decisoes publicas. O ATA360 aplica 6 artigos: Art. 20 (consequencias praticas), Art. 21 (transicao), Art. 22 (dificuldades do gestor), Art. 23 (mudancas de lei), Art. 28 (dolo/erro grosseiro) e Art. 30 (invalidade retroativa).",
    category: "legal",
    level: "avancado",
  },
  {
    q: "O ATA360 acompanha mudancas na legislacao?",
    a: "Sim. O sistema monitora o Diario Oficial da Uniao (DOU) e atualiza automaticamente as tabelas de referencia legal. Alteracoes normativas relevantes sao refletidas nos modelos de documentos e nas regras de auditoria.",
    category: "legal",
    level: "avancado",
  },
  // ── Seguranca (intermediario → avancado)
  {
    q: "O ATA360 esta em conformidade com a LGPD?",
    a: "Sim. Implementa privacy-by-design conforme a LGPD: consentimento granular (Art. 7), anonimizacao (Art. 18, IV), politicas de retencao (Art. 15-16), direitos do titular (Art. 18) e bases legais adequadas para cada tratamento de dados.",
    category: "seguranca",
    level: "intermediario",
  },
  {
    q: "Como funciona a assinatura eletronica?",
    a: "Tres niveis conforme Lei 14.063/2020: Simples (Gov.br bronze), Avancada (Gov.br prata/ouro) e Qualificada (ICP-Brasil). Cada assinatura registra IP, user-agent, timestamp UTC, metodo de autenticacao e hash SHA-256 do documento.",
    category: "seguranca",
    level: "intermediario",
  },
  {
    q: "Meus dados estao isolados de outros orgaos?",
    a: "Sim. O ATA360 opera com isolamento multi-tenant rigoroso. Cada orgao acessa apenas seus proprios dados. A unica excecao sao dados publicos do PNCP, que sao abertos por natureza. Nao ha cruzamento de informacoes entre entes.",
    category: "seguranca",
    level: "avancado",
  },
  {
    q: "A plataforma revela como funciona internamente?",
    a: "Nao. Os documentos gerados mostram O QUE foi decidido e a CONCLUSAO fundamentada — nunca COMO (algoritmos, pesos, thresholds, modelos). A arquitetura interna e protegida como segredo industrial (Lei 9.279/1996 e Lei 9.609/1998).",
    category: "seguranca",
    level: "avancado",
  },
  // ── Contratacao (intermediario → avancado)
  {
    q: "Como contrato o ATA360 para meu orgao?",
    a: "A contratacao pode ser feita por Dispensa Eletronica (Art. 75 II), Inexigibilidade (Art. 74 I), Adesao a ARP (Art. 86), Dialogo Competitivo (Art. 32) ou via Emenda Parlamentar. A modalidade recomendada depende do porte e contexto do orgao.",
    category: "contratacao",
    level: "intermediario",
  },
  {
    q: "O preco e igual para todos os orgaos?",
    a: "Nao. O preco e calculado individualmente com base no porte do ente (populacao, orcamento via FPM). Municipios menores pagam proporcionalmente menos. Nao existem 'planos fixos' — existe uma formula transparente com piso minimo.",
    category: "contratacao",
    level: "intermediario",
  },
  {
    q: "O que e Adesao a ARP e como funciona?",
    a: "Conforme Art. 86 da Lei 14.133, orgaos podem aderir a uma Ata de Registro de Precos existente. O limite e 50% do quantitativo total e 50% por orgao. O ATA360 acompanha o saldo em tempo real via PNCP e gera os 10 documentos necessarios automaticamente.",
    category: "contratacao",
    level: "avancado",
  },
  // ── Dados (intermediario → avancado)
  {
    q: "De onde vem os dados do ATA360?",
    a: "De 17+ fontes oficiais do governo brasileiro: PNCP, Compras.gov.br, IBGE, TCU, CGU, Portal da Transparencia, BCB, TransfereGov, FNDE, FNS, SICONFI, Camara, Senado e SERPRO. Sao 110+ endpoints de APIs governamentais.",
    category: "dados",
    level: "intermediario",
  },
  {
    q: "Os dados sao atualizados em tempo real?",
    a: "Sim. APIs governamentais sao consultadas em tempo real. Indices economicos (IPCA, IGP-M, Selic, dolar) sao atualizados via BCB. Dados de licitacoes sao sincronizados com o PNCP continuamente.",
    category: "dados",
    level: "intermediario",
  },
  {
    q: "O ATA360 tem acesso a dados de CATMAT e CATSER?",
    a: "Sim. A base inclui 337 mil itens CATMAT (materiais) e 35 mil itens CATSER (servicos), alem de 1.200+ UASGs. A busca utiliza normalizacao linguistica para lidar com sinonimias e regionalismos.",
    category: "dados",
    level: "avancado",
  },
  {
    q: "O que acontece com meus dados se eu cancelar?",
    a: "Conforme LGPD Art. 18, V, voce tem direito a portabilidade dos dados em formato estruturado por ate 30 dias apos o termino. Trilhas de auditoria sao preservadas por 5 anos (obrigacao legal). Dados pessoais sao eliminados ou anonimizados conforme a Politica de Privacidade.",
    category: "dados",
    level: "avancado",
  },
];

function FaqModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!open) return null;

  const filtered = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const levelLabel = (level: FaqItem["level"]) => {
    switch (level) {
      case "basico": return "Basico";
      case "intermediario": return "Intermediario";
      case "avancado": return "Avancado";
    }
  };

  const levelColor = (level: FaqItem["level"]) => {
    switch (level) {
      case "basico": return "bg-foreground/5 text-muted-foreground";
      case "intermediario": return "bg-foreground/10 text-muted-foreground";
      case "avancado": return "bg-foreground/15 text-foreground/70";
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="faq-dialog-title" className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-lg shadow-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-foreground" />
            <span id="faq-dialog-title" className="text-sm font-semibold text-foreground">
              PERGUNTAS FREQUENTES
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar perguntas frequentes"
            className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pergunta..."
              aria-label="Buscar nas perguntas frequentes"
              className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none pl-9 pr-3 py-2.5"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setExpandedIndex(null);
                }}
                className={cn(
                  "text-[11px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                  activeCategory === cat.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border/50 text-foreground hover:bg-muted",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ list */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 pb-5 space-y-1.5">
            {filtered.length === 0 ? (
              <div className="py-8 text-center">
                <HelpCircle className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Nenhuma pergunta encontrada</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Tente outro termo ou categoria</p>
              </div>
            ) : (
              filtered.map((item, i) => {
                const isExpanded = expandedIndex === i;
                return (
                  <div
                    key={`${item.category}-${i}`}
                    className="border border-border/30 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground leading-relaxed">
                          {item.q}
                        </p>
                        {!isExpanded && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-medium", levelColor(item.level))}>
                              {levelLabel(item.level)}
                            </span>
                          </div>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-3.5 text-muted-foreground shrink-0 mt-0.5 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-3.5 border-t border-border/20">
                        <p className="text-[11px] text-muted-foreground leading-relaxed pt-3">
                          {item.a}
                        </p>
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-medium", levelColor(item.level))}>
                            {levelLabel(item.level)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {/* Counter */}
            {filtered.length > 0 && (
              <p className="text-[10px] text-muted-foreground/50 text-center pt-2">
                {filtered.length} {filtered.length === 1 ? "pergunta" : "perguntas"}
                {activeCategory !== "all" && ` em ${FAQ_CATEGORIES.find(c => c.value === activeCategory)?.label}`}
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Sub-modal: Ouvidoria ────────────────────────────────────────────────────

type OmbudsmanView = "menu" | "form" | "report" | "sent";
type OmbudsmanCategory =
  | "sugestão"
  | "reclamação"
  | "elogio"
  | "solicitação"
  | "dúvida";
type AnonymityLevel = "identificado" | "parcial" | "anônimo";
type ReportType =
  | "assédio"
  | "corrupção"
  | "fraude"
  | "conflito_interesse"
  | "uso_indevido"
  | "outro";

const ombudsmanCategories: { value: OmbudsmanCategory; label: string }[] = [
  { value: "sugestão", label: "Sugestão" },
  { value: "reclamação", label: "Reclamação" },
  { value: "elogio", label: "Elogio" },
  { value: "solicitação", label: "Solicitação" },
  { value: "dúvida", label: "Dúvida" },
];

const anonymityLevels: {
  value: AnonymityLevel;
  label: string;
  desc: string;
}[] = [
  {
    value: "identificado",
    label: "Identificado",
    desc: "Seus dados serão visíveis",
  },
  {
    value: "parcial",
    label: "Parcial",
    desc: "Apenas seu e-mail para resposta",
  },
  {
    value: "anônimo",
    label: "Anônimo",
    desc: "Nenhum dado pessoal será registrado",
  },
];

const reportTypes: { value: ReportType; label: string }[] = [
  { value: "assédio", label: "Assédio" },
  { value: "corrupção", label: "Corrupção" },
  { value: "fraude", label: "Fraude" },
  { value: "conflito_interesse", label: "Conflito de interesse" },
  { value: "uso_indevido", label: "Uso indevido de recursos" },
  { value: "outro", label: "Outro" },
];

const mockInstitutions = [
  "Prefeitura Municipal de Belo Horizonte",
  "Câmara Municipal de Belo Horizonte",
  "Tribunal de Justiça de MG",
  "Corpo de Bombeiros Militar de MG",
  "Secretaria de Estado de Saúde de MG",
];

function OmbudsmanModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<OmbudsmanView>("menu");
  const [category, setCategory] = useState<OmbudsmanCategory | "">("");
  const [anonymity, setAnonymity] = useState<AnonymityLevel>("identificado");
  const [omMessage, setOmMessage] = useState("");
  const [omEmail, setOmEmail] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [showOtherInst, setShowOtherInst] = useState(false);
  const [otherInstName, setOtherInstName] = useState("");
  // Report states
  const [reportType, setReportType] = useState<ReportType | "">("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportAnonymity, setReportAnonymity] =
    useState<AnonymityLevel>("anônimo");
  const [complianceAccepted, setComplianceAccepted] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setCategory("");
    setAnonymity("identificado");
    setOmMessage("");
    setOmEmail("");
    setSelectedInstitution("");
    setShowOtherInst(false);
    setOtherInstName("");
    setReportType("");
    setReportMessage("");
    setReportAnonymity("anônimo");
    setComplianceAccepted(false);
  };

  const handleSubmit = () => {
    setView("sent");
    setTimeout(() => {
      setView("menu");
      resetForm();
      onClose();
    }, 2500);
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="ombudsman-dialog-title" className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-lg shadow-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            {(view === "form" || view === "report") && (
              <button
                onClick={() => {
                  setView("menu");
                  resetForm();
                }}
                aria-label="Voltar ao menu da ouvidoria"
                className="size-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer mr-1"
              >
                <ArrowLeft className="size-3.5 text-muted-foreground" />
              </button>
            )}
            <Shield className="size-4 text-foreground" />
            <span id="ombudsman-dialog-title" className="text-sm font-semibold text-foreground">
              {view === "menu"
                ? "OUVIDORIA"
                : view === "form"
                  ? "MANIFESTAÇÃO"
                  : view === "report"
                    ? "DENÚNCIA"
                    : "OUVIDORIA"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar ouvidoria"
            className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 py-4">
            {view === "sent" ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="size-8 text-foreground mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">
                  Registro enviado com sucesso!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Acompanhe o status por e-mail.
                </p>
              </div>
            ) : view === "menu" ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Canal seguro para manifestações, sugestões, reclamações e
                  denúncias. Sua participação é fundamental para a melhoria
                  contínua do ATA360.
                </p>
                <button
                  onClick={() => setView("form")}
                  className="w-full text-left p-4 border border-border/30 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="size-4 text-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Manifestação
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Sugestão, reclamação, elogio ou dúvida
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </button>
                <button
                  onClick={() => setView("report")}
                  className="w-full text-left p-4 border border-border/30 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Flag className="size-4 text-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Denúncia
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Irregularidade, conduta antiética ou compliance
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                </button>
              </div>
            ) : view === "form" ? (
              <div className="space-y-4">
                {/* Institution */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Instituição
                  </label>
                  {!showOtherInst ? (
                    <div className="space-y-1.5">
                      {mockInstitutions.map((inst) => (
                        <button
                          key={inst}
                          onClick={() => setSelectedInstitution(inst)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 rounded-full border transition-colors cursor-pointer text-[11px]",
                            selectedInstitution === inst
                              ? "border-foreground bg-foreground/5 text-foreground font-medium"
                              : "border-border/30 text-foreground hover:bg-muted",
                          )}
                        >
                          {inst}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowOtherInst(true);
                          setSelectedInstitution("");
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-full border border-dashed border-border/50 text-[11px] text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        + Outra instituição
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={otherInstName}
                        onChange={(e) => {
                          setOtherInstName(e.target.value);
                          setSelectedInstitution(e.target.value);
                        }}
                        placeholder="Digite o nome da instituição..."
                        className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5"
                      />
                      <button
                        onClick={() => {
                          setShowOtherInst(false);
                          setOtherInstName("");
                        }}
                        className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Voltar para lista
                      </button>
                    </div>
                  )}
                </div>
                {/* Category */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ombudsmanCategories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "text-[11px] px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                          category === cat.value
                            ? "bg-foreground text-background border-foreground"
                            : "border-border/50 text-foreground hover:bg-muted",
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Anonymity */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Nível de identificação
                  </label>
                  <div className="space-y-1.5">
                    {anonymityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setAnonymity(level.value)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-full border transition-colors cursor-pointer flex items-center justify-between",
                          anonymity === level.value
                            ? "border-foreground bg-foreground/5"
                            : "border-border/30 hover:bg-muted",
                        )}
                      >
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {level.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {level.desc}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "size-4 rounded-full border-2 flex items-center justify-center",
                            anonymity === level.value
                              ? "border-foreground"
                              : "border-border",
                          )}
                        >
                          {anonymity === level.value && (
                            <div className="size-2 rounded-full bg-foreground" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Email */}
                {anonymity !== "anônimo" && (
                  <div>
                    <label htmlFor="ombudsman-email" className="text-xs text-muted-foreground mb-1.5 block">
                      E-mail para resposta
                    </label>
                    <input
                      id="ombudsman-email"
                      value={omEmail}
                      onChange={(e) => setOmEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5"
                    />
                  </div>
                )}
                {/* Message */}
                <div>
                  <label htmlFor="ombudsman-message" className="text-xs text-muted-foreground mb-1.5 block">
                    Mensagem
                  </label>
                  <textarea
                    id="ombudsman-message"
                    value={omMessage}
                    onChange={(e) => setOmMessage(e.target.value)}
                    placeholder="Descreva sua manifestação..."
                    rows={4}
                    className="w-full bg-background border border-border/50 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none p-4 leading-relaxed"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !category || !omMessage.trim() || !selectedInstitution
                  }
                  className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
                >
                  Enviar manifestação
                </Button>
              </div>
            ) : view === "report" ? (
              <div className="space-y-4">
                {/* Report Type */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Tipo de denúncia
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {reportTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setReportType(type.value)}
                        className={cn(
                          "text-[11px] px-3 py-2 rounded-full border transition-colors cursor-pointer text-left",
                          reportType === type.value
                            ? "bg-foreground text-background border-foreground"
                            : "border-border/30 text-foreground hover:bg-muted",
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Anonymity */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Identificação
                  </label>
                  <div className="flex gap-1.5">
                    {anonymityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setReportAnonymity(level.value)}
                        className={cn(
                          "flex-1 text-[11px] px-2 py-2 rounded-full border transition-colors cursor-pointer text-center",
                          reportAnonymity === level.value
                            ? "bg-foreground text-background border-foreground"
                            : "border-border/30 text-foreground hover:bg-muted",
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Description */}
                <div>
                  <label htmlFor="report-message" className="text-xs text-muted-foreground mb-1.5 block">
                    Relato
                  </label>
                  <textarea
                    id="report-message"
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="Descreva os fatos com o máximo de detalhes possível..."
                    rows={5}
                    className="w-full bg-background border border-border/50 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none p-4 leading-relaxed"
                  />
                </div>
                {/* Compliance Term */}
                <div className="border border-border/30 rounded-2xl p-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() =>
                        setComplianceAccepted(!complianceAccepted)
                      }
                      className={cn(
                        "size-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors",
                        complianceAccepted
                          ? "bg-foreground border-foreground"
                          : "border-border",
                      )}
                    >
                      {complianceAccepted && (
                        <CheckCircle2 className="size-3 text-background" />
                      )}
                    </button>
                    <div>
                      <p className="text-[11px] font-medium text-foreground">
                        Termo de Compliance
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                        Declaro que as informações prestadas são verdadeiras e que
                        estou ciente de que denúncias falsas podem configurar
                        crime. O ATA360 se compromete a manter o sigilo e a
                        apurar os fatos com imparcialidade.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !reportType ||
                    !reportMessage.trim() ||
                    !complianceAccepted
                  }
                  className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
                >
                  Enviar denúncia
                </Button>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Settings Modal ─────────────────────────────────────────────────────

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const [profileTab, setProfileTab] = useState<ProfileTab>("institutional");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [fontSize, setFontSize] = useState(14);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Help sub-modals
  const [contactOpen, setContactOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [ombudsmanOpen, setOmbudsmanOpen] = useState(false);
  // Legal Library
  const [legalSearch, setLegalSearch] = useState("");
  const [legalPreview, setLegalPreview] = useState<string | null>(null);
  const legalFileInputRef = useRef<HTMLInputElement>(null);

  const mockLegalDocs = [
    { id: "1", name: "Lei 14.133/2021 - Licitações e Contratos", type: "Lei Federal", size: "2.4 MB", date: "15/01/2026", ext: "pdf" },
    { id: "2", name: "Decreto Municipal 18.345/2024 - Pregão Eletrônico", type: "Decreto", size: "890 KB", date: "20/12/2025", ext: "pdf" },
    { id: "3", name: "Súmula 247 TCU - Exigência de Habilitação", type: "Súmula", size: "156 KB", date: "10/01/2026", ext: "pdf" },
    { id: "4", name: "Acórdão 1.214/2023 TCU - Sobrepreço", type: "Acórdão", size: "1.1 MB", date: "05/02/2026", ext: "doc" },
    { id: "5", name: "IN SEGES 73/2022 - Pesquisa de Preços", type: "Instrução Normativa", size: "445 KB", date: "28/01/2026", ext: "pdf" },
    { id: "6", name: "Lei Complementar 123/2006 - ME e EPP", type: "Lei Federal", size: "1.8 MB", date: "03/02/2026", ext: "pdf" },
  ];

  const filteredLegalDocs = mockLegalDocs.filter(
    (doc) =>
      doc.name.toLowerCase().includes(legalSearch.toLowerCase()) ||
      doc.type.toLowerCase().includes(legalSearch.toLowerCase()),
  );

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Parameters
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPhone, setNotifPhone] = useState(true);

  if (!open) return null;

  const sideMenuItems: {
    id: SettingsSection;
    icon: React.ElementType;
    label: string;
  }[] = [
    { id: "profile", icon: User, label: "Meu perfil" },
    { id: "legal-library", icon: BookMarked, label: "Biblioteca legal" },
    { id: "password", icon: KeyRound, label: "Minha senha" },
    { id: "theme", icon: Palette, label: "Tema" },
    { id: "accessibility", icon: Accessibility, label: "Acessibilidade" },
    { id: "how-it-works", icon: Play, label: "Como funciona" },
  ];

  const helpItems: {
    id: HelpSection;
    icon: React.ElementType;
    label: string;
    desc: string;
  }[] = [
    {
      id: "contact",
      icon: MessageSquare,
      label: "Fale conosco",
      desc: "Envie uma mensagem",
    },
    {
      id: "support",
      icon: Headphones,
      label: "Suporte técnico",
      desc: "Abra e acompanhe chamados",
    },
    {
      id: "faq",
      icon: HelpCircle,
      label: "Perguntas frequentes",
      desc: "Dúvidas e respostas",
    },
    {
      id: "ombudsman",
      icon: Shield,
      label: "Ouvidoria",
      desc: "Manifestações e denúncias",
    },
  ];

  const handleHelpClick = (id: HelpSection) => {
    if (id === "contact") setContactOpen(true);
    else if (id === "support") setSupportOpen(true);
    else if (id === "faq") setFaqOpen(true);
    else if (id === "ombudsman") setOmbudsmanOpen(true);
  };

  // ─── Legal Library Content ─────────────────────────────────────────────────

  const getExtColor = (ext: string) => {
    switch (ext) {
      case "pdf": return "bg-red-500/10 text-red-600";
      case "doc": case "docx": return "bg-blue-500/10 text-blue-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderLegalLibrary = () => (
    <div className="space-y-4">
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Documentos legais exclusivos desta instituição. Leis, decretos, súmulas e acórdãos aqui inseridos serão considerados pela IA nas respostas e artefatos gerados.
      </p>

      {/* Search + Upload */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            value={legalSearch}
            onChange={(e) => setLegalSearch(e.target.value)}
            placeholder="Buscar documento..."
            aria-label="Buscar documento na biblioteca legal"
            className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none pl-9 pr-3 py-2"
          />
        </div>
        <Button
          onClick={() => legalFileInputRef.current?.click()}
          className="h-8 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-medium cursor-pointer px-3"
        >
          <Upload className="size-3 mr-1.5" />
          Enviar
        </Button>
        <input
          ref={legalFileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          className="hidden"
        />
      </div>

      {/* Document List */}
      <div className="space-y-1">
        {filteredLegalDocs.map((doc) => (
          <div
            key={doc.id}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            {/* Ext Badge */}
            <div className={cn("text-[9px] font-bold uppercase w-9 h-7 rounded-lg flex items-center justify-center shrink-0", getExtColor(doc.ext))}>
              {doc.ext}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{doc.type}</span>
                <span className="text-[10px] text-muted-foreground/50">·</span>
                <span className="text-[10px] text-muted-foreground">{doc.size}</span>
                <span className="text-[10px] text-muted-foreground/50">·</span>
                <span className="text-[10px] text-muted-foreground">{doc.date}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => setLegalPreview(doc.id === legalPreview ? null : doc.id)}
                className="size-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                aria-label={`Visualizar ${doc.name}`}
              >
                <Eye className="size-3.5 text-muted-foreground" />
              </button>
              <button
                className="size-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                aria-label={`Baixar ${doc.name}`}
              >
                <Download className="size-3.5 text-muted-foreground" />
              </button>
              <button
                className="size-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                aria-label={`Excluir ${doc.name}`}
              >
                <Trash2 className="size-3.5 text-muted-foreground hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Area */}
      {legalPreview && (
        <div className="border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border/20">
            <span className="text-[11px] font-medium text-foreground truncate">
              {mockLegalDocs.find((d) => d.id === legalPreview)?.name}
            </span>
            <button
              onClick={() => setLegalPreview(null)}
              className="size-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-3 text-muted-foreground" />
            </button>
          </div>
          <div className="h-48 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <FileText className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-[11px] text-muted-foreground">Pré-visualização do documento</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredLegalDocs.length === 0 && (
        <div className="py-8 text-center">
          <BookMarked className="size-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Nenhum documento encontrado</p>
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/20">
        <Lock className="size-3 text-muted-foreground/50" />
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Documentos válidos exclusivamente para esta instituição. Não serão aplicados a outros usuários ou órgãos.
        </p>
      </div>
    </div>
  );

  // ─── Password Content ──────────────────────────────────────────────────────

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel = ["", "Fraca", "Regular", "Boa", "Forte"][strength] || "";
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][strength] || "";
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSave = currentPassword && newPassword.length >= 8 && passwordsMatch;

  const handlePasswordSave = () => {
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPw(false);
      setShowNewPw(false);
      setShowConfirmPw(false);
    }, 2000);
  };

  const renderPassword = () => (
    <div className="space-y-5">
      {passwordSaved ? (
        <div className="py-10 text-center">
          <CheckCircle2 className="size-8 text-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Senha alterada com sucesso!</p>
          <p className="text-xs text-muted-foreground mt-1">Sua nova senha já está ativa.</p>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Para alterar sua senha, informe a senha atual e defina uma nova senha com no mínimo 8 caracteres.
          </p>

          {/* Current Password */}
          <div>
            <label htmlFor="pw-current" className="text-xs text-muted-foreground mb-1.5 block">Senha atual</label>
            <div className="relative">
              <input
                id="pw-current"
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5 pr-10"
              />
              <button
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                aria-label={showCurrentPw ? "Ocultar senha atual" : "Mostrar senha atual"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showCurrentPw ? (
                  <EyeOff className="size-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="size-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="h-px bg-border/20" />

          {/* New Password */}
          <div>
            <label htmlFor="pw-new" className="text-xs text-muted-foreground mb-1.5 block">Nova senha</label>
            <div className="relative">
              <input
                id="pw-new"
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-background border border-border/50 rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5 pr-10"
              />
              <button
                onClick={() => setShowNewPw(!showNewPw)}
                aria-label={showNewPw ? "Ocultar nova senha" : "Mostrar nova senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showNewPw ? (
                  <EyeOff className="size-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="size-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
            {/* Strength indicator */}
            {newPassword && (
              <div className="mt-2.5">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i <= strength ? strengthColor : "bg-border/30",
                      )}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">{strengthLabel}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="pw-confirm" className="text-xs text-muted-foreground mb-1.5 block">Confirmar nova senha</label>
            <div className="relative">
              <input
                id="pw-confirm"
                type={showConfirmPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className={cn(
                  "w-full bg-background border rounded-full text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none px-4 py-2.5 pr-10",
                  confirmPassword && !passwordsMatch ? "border-red-400" : "border-border/50",
                )}
              />
              <button
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                aria-label={showConfirmPw ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPw ? (
                  <EyeOff className="size-3.5 text-muted-foreground" />
                ) : (
                  <Eye className="size-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-[10px] text-red-500 mt-1">As senhas não coincidem</p>
            )}
            {passwordsMatch && (
              <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Senhas coincidem
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="border border-border/20 rounded-2xl p-3">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-2">Requisitos da senha</p>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
              {[
                { label: "Mínimo 8 caracteres", check: newPassword.length >= 8 },
                { label: "Letra maiúscula", check: /[A-Z]/.test(newPassword) },
                { label: "Um número", check: /[0-9]/.test(newPassword) },
                { label: "Caractere especial", check: /[^A-Za-z0-9]/.test(newPassword) },
              ].map((req) => (
                <div key={req.label} className="flex items-center gap-1.5">
                  <div className={cn("size-3 rounded-full flex items-center justify-center", req.check ? "bg-emerald-500" : "bg-border/40")}>
                    {req.check && <CheckCircle2 className="size-2 text-white" />}
                  </div>
                  <span className={cn("text-[10px]", req.check ? "text-foreground" : "text-muted-foreground")}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handlePasswordSave}
            disabled={!canSave}
            className="w-full h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
          >
            Salvar nova senha
          </Button>
        </>
      )}
    </div>
  );

  // ─── Profile Content ──────────────────────────────────────────────────────

  const renderProfile = () => {
    const tabs: { id: ProfileTab; icon: React.ElementType; label: string }[] = [
      { id: "institutional", icon: Building2, label: "Institucional" },
      { id: "member", icon: UserCircle, label: "Membro" },
      { id: "parameters", icon: SlidersHorizontal, label: "Parâmetros" },
    ];

    return (
      <div className="space-y-5">
        {/* Tabs */}
  <div className="flex gap-1">
  {tabs.map((tab) => (
  <button
  key={tab.id}
  onClick={() => setProfileTab(tab.id)}
  className={cn(
  "flex-1 text-[11px] font-medium py-2 rounded-full transition-colors cursor-pointer",
  profileTab === tab.id
  ? "bg-muted text-foreground"
  : "text-muted-foreground hover:bg-muted hover:text-foreground",
  )}
  >
  {tab.label}
  </button>
  ))}
  </div>

        {/* Tab Content */}
        {profileTab === "institutional" && (
          <div className="space-y-0">
            <SectionLabel label="Dados gerais" />
            <FieldRow label="Órgão" value="Prefeitura Municipal de Belo Horizonte" />
            <FieldRow label="CNPJ" value="12.345.678/0001-90" />
            <FieldRow label="Natureza jurídica" value="Administração Pública Municipal" />
            <FieldRow label="CNAE" value="84.11-6-00 - Administração pública em geral" />
            <FieldRow label="Esfera" value="Municipal" />
            <FieldRow label="UF" value="MG" />
            <FieldRow label="Município" value="Belo Horizonte" />
            <FieldRow label="Gestor responsável" value="Alexandre Kalil" />

            <SectionLabel label="Contato institucional" className="mt-4" />
            <LinkFieldRow label="Site" value="www.pbh.gov.br" href="https://www.pbh.gov.br" />
            <LinkFieldRow label="Telefone" value="(31) 3277-4000" href="tel:+553132774000" />
            <LinkFieldRow label="Instagram" value="@prefaborizo" href="https://instagram.com/prefaborizo" />
            <LinkFieldRow label="Facebook" value="/prefeiturabh" href="https://facebook.com/prefeiturabh" />

            <SectionLabel label="Geolocalização" className="mt-4" />
            <LinkFieldRow label="Endereço" value="Av. Afonso Pena, 1212 - Centro, BH/MG" href="https://maps.google.com/?q=Av.+Afonso+Pena,+1212+-+Centro,+Belo+Horizonte" />
            <FieldRow label="Latitude" value="-19.9191" />
            <FieldRow label="Longitude" value="-43.9387" />

            <SectionLabel label="Dados IBGE" className="mt-4" />
            <FieldRow label="Código IBGE" value="3106200" />
            <FieldRow label="População estimada" value="2.521.564 hab. (2024)" />
            <FieldRow label="IDH" value="0,810 (Muito alto)" />
            <FieldRow label="PIB per capita" value="R$ 38.695,00" />
            <FieldRow label="Área territorial" value="331,401 km²" />

            <SectionLabel label="Dados financeiros" className="mt-4" />
            <FieldRow label="CAPAG" value="A" />
            <FieldRow label="Orçamento anual" value="R$ 18,2 bilhões (LOA 2026)" />
            <FieldRow label="Receita corrente líquida" value="R$ 14,8 bilhões" />
          </div>
        )}

        {profileTab === "member" && (
          <div className="space-y-0">
            <SectionLabel label="Dados pessoais" />
            <FieldRow label="Nome completo" value="Bernardo Aguiar" />
            <FieldRow label="CPF" value="***.***.***-00" />
            <FieldRow label="RG" value="MG-12.345.678" />
            <FieldRow label="Data de nascimento" value="04/02/1988" />

            <SectionLabel label="Dados profissionais" className="mt-4" />
            <FieldRow label="Cargo" value="Pregoeiro" />
            <FieldRow label="Setor" value="Diretoria de Licitações" />
            <FieldRow label="Matrícula" value="2024.001.0042" />

            <SectionLabel label="Contato" className="mt-4" />
            <FieldRow label="E-mail institucional" value="bernardo@orgao.gov.br" />
            <LinkFieldRow label="E-mail pessoal" value="bernardo.aguiar@gmail.com" href="mailto:bernardo.aguiar@gmail.com" />
            <div className="flex items-center justify-between py-2.5 border-b border-border/20">
              <span className="text-xs text-muted-foreground">E-mail pessoal</span>
              <span className="text-[10px] text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">Login rápido Google</span>
            </div>
            <LinkFieldRow label="Telefone" value="(31) 3333-0001" href="tel:+553133330001" />
            <LinkFieldRow label="WhatsApp" value="(31) 99999-0001" href="https://wa.me/5531999990001" />

            <SectionLabel label="Redes sociais" className="mt-4" />
            <LinkFieldRow label="Instagram" value="@bernardo.aguiar" href="https://instagram.com/bernardo.aguiar" />
            <LinkFieldRow label="Facebook" value="/bernardo.aguiar" href="https://facebook.com/bernardo.aguiar" />
            <LinkFieldRow label="TikTok" value="@bernardo.ag" href="https://tiktok.com/@bernardo.ag" />
            <FieldRow label="Outra" value="linkedin.com/in/bernardo-aguiar" />

            <SectionLabel label="Observação" className="mt-4" />
            <p className="text-xs text-muted-foreground leading-relaxed py-2">
              Responsável pelas compras diretas e pregões eletrônicos da Diretoria de Licitações.
            </p>

            <SectionLabel label="Acesso" className="mt-4" />
            <FieldRow label="Tipo de membro" value="Administrador Local" />
            <FieldRow label="Acesso Google" value="Habilitado" />
            <FieldRow label="Membro desde" value="01/01/2024" />
            <FieldRow label="Status" value="Ativo" />

            <SectionLabel label="Documentos pessoais" className="mt-4" />
            <p className="text-[10px] text-muted-foreground mb-2">
              Somente você pode visualizar seus documentos.
            </p>
            <div className="space-y-1.5">
              {[
                { name: "RG_Bernardo.pdf", type: "RG" },
                { name: "CPF_Bernardo.pdf", type: "CPF" },
                { name: "Comprovante_Residencia.pdf", type: "Comprovante" },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between py-2 px-3 border border-border/20 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] font-medium text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.type}
                      </p>
                    </div>
                  </div>
                  <Lock className="size-3 text-muted-foreground/50" />
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border/40 rounded-full text-[11px] text-muted-foreground hover:bg-muted transition-colors cursor-pointer mt-2">
                <Upload className="size-3.5" />
                Anexar documento
              </button>
            </div>
          </div>
        )}

        {profileTab === "parameters" && (
          <div className="space-y-5">
            {/* Profile Photo */}
            <div>
              <SectionLabel label="Foto do perfil" />
              <p className="text-[10px] text-muted-foreground mb-3">
                Obrigatória. Utilizada em sua identificação no sistema.
              </p>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-muted border-2 border-border/30 flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/images/whatsapp-20image-202025-10-15-20at-2016.jpeg"
                    alt="Foto do perfil"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <button className="flex items-center gap-1.5 text-[11px] text-foreground font-medium hover:underline cursor-pointer">
                    <Camera className="size-3.5" />
                    Alterar foto
                  </button>
                  <p className="text-[10px] text-muted-foreground">
                    JPG ou PNG. Máx. 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Institution Logo */}
            <div>
              <SectionLabel label="Logo da instituição" />
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-muted border-2 border-dashed border-border/30 flex items-center justify-center">
                  <ImageIcon className="size-5 text-muted-foreground/40" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <button className="flex items-center gap-1.5 text-[11px] text-foreground font-medium hover:underline cursor-pointer">
                    <Upload className="size-3.5" />
                    Enviar logo
                  </button>
                  <p className="text-[10px] text-muted-foreground">
                    PNG com fundo transparente. Máx. 1MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Institution Coat of Arms */}
            <div>
              <SectionLabel label="Brasão da instituição" />
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-muted border-2 border-dashed border-border/30 flex items-center justify-center">
                  <Shield className="size-5 text-muted-foreground/40" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <button className="flex items-center gap-1.5 text-[11px] text-foreground font-medium hover:underline cursor-pointer">
                    <Upload className="size-3.5" />
                    Enviar brasão
                  </button>
                  <p className="text-[10px] text-muted-foreground">
                    PNG com fundo transparente. Máx. 1MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Security & Notifications */}
            <div className="border-t border-border/20 pt-4">
              <SectionLabel label="Segurança" />
              <ToggleOption
                icon={ShieldCheck}
                label="Autenticação em 2 fatores"
                desc="Desativada por padrão. Recomendamos ativar."
                enabled={twoFactor}
                onToggle={() => setTwoFactor(!twoFactor)}
              />
            </div>

            <div className="border-t border-border/20 pt-4">
              <SectionLabel label="Notificações" />
              <div className="space-y-1">
                <ToggleOption
                  icon={Mail}
                  label="Notificações por e-mail"
                  desc="Receba alertas e atualizações por e-mail"
                  enabled={notifEmail}
                  onToggle={() => setNotifEmail(!notifEmail)}
                />
                <ToggleOption
                  icon={Smartphone}
                  label="Notificações por telefone"
                  desc="Receba alertas por SMS/WhatsApp"
                  enabled={notifPhone}
                  onToggle={() => setNotifPhone(!notifPhone)}
                />
              </div>
            </div>

            {/* General Parameters */}
            <div className="border-t border-border/20 pt-4">
              <SectionLabel label="Preferências gerais" />
              <FieldRow label="Idioma" value="Português (BR)" />
              <FieldRow label="Fuso horário" value="Brasília (GMT-3)" />
              <FieldRow label="Formato de data" value="DD/MM/AAAA" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Theme Content ────────────────────────────────────────────────────────

  const renderTheme = () => {
    const themes: {
      id: "light" | "dark" | "system";
      icon: React.ElementType;
      label: string;
      desc: string;
    }[] = [
      { id: "light", icon: Sun, label: "Claro", desc: "Tema com fundo branco" },
      {
        id: "dark",
        icon: Moon,
        label: "Escuro",
        desc: "Tema com fundo escuro",
      },
      {
        id: "system",
        icon: Monitor,
        label: "Sistema",
        desc: "Acompanha o tema do dispositivo",
      },
    ];

    return (
      <div className="space-y-2">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer flex items-center gap-4",
              theme === t.id
                ? "border-foreground bg-foreground/5"
                    : "border-border/30 hover:bg-muted/50",
            )}
          >
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center",
                theme === t.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <t.icon className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{t.label}</p>
              <p className="text-[11px] text-muted-foreground">{t.desc}</p>
            </div>
            <div
              className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center",
                theme === t.id ? "border-foreground" : "border-border",
              )}
            >
              {theme === t.id && (
                <div className="size-2.5 rounded-full bg-foreground" />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  // ─── Accessibility Content ────────────────────────────────────────────────

  const renderAccessibility = () => (
    <div className="space-y-5">
      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              Tamanho da fonte
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{fontSize}px</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 1))}
            className="size-8 rounded-full border border-border/50 flex items-center justify-center text-xs font-bold text-foreground cursor-pointer hover:bg-muted/50"
          >
            {"A-"}
          </button>
          <div className="flex-1 h-1.5 bg-muted rounded-full relative">
            <div
              className="absolute left-0 top-0 h-full bg-foreground rounded-full"
              style={{ width: `${((fontSize - 12) / 8) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setFontSize(Math.min(20, fontSize + 1))}
            className="size-8 rounded-full border border-border/50 flex items-center justify-center text-xs font-bold text-foreground cursor-pointer hover:bg-muted/50"
          >
            {"A+"}
          </button>
        </div>
      </div>

      {/* Toggle Options */}
      <ToggleOption
        icon={Keyboard}
        label="Navegação por teclado"
        desc="Atalhos e navegação com Tab"
        enabled={keyboardNav}
        onToggle={() => setKeyboardNav(!keyboardNav)}
      />
      <ToggleOption
        icon={Contrast}
        label="Modo alto contraste"
        desc="Aumenta o contraste de cores"
        enabled={highContrast}
        onToggle={() => setHighContrast(!highContrast)}
      />
      <ToggleOption
        icon={Eye}
        label="Reduzir movimento"
        desc="Desativa animações e transições"
        enabled={reducedMotion}
        onToggle={() => setReducedMotion(!reducedMotion)}
      />
    </div>
  );

  // ─── How it works Content ─────────────────────────────────────────────────

  const microVideos = [
    { title: "Pesquisa de Preços", duration: "1:45" },
    { title: "Gerar Documentos", duration: "2:10" },
    { title: "Assistentes IA", duration: "1:30" },
    { title: "Equipe e Colaboração", duration: "1:55" },
  ];

  const renderHowItWorks = () => (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Conheça o ATA360 em poucos minutos. Assista ao vídeo de apresentação e
        descubra como transformar seu setor de compras públicas.
      </p>

      {/* Main video */}
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center border border-border/30 cursor-pointer hover:bg-muted/70 transition-colors group">
        <div className="text-center">
          <div className="size-14 rounded-full bg-foreground/10 group-hover:bg-foreground/20 flex items-center justify-center mx-auto mb-3 transition-colors">
            <Play className="size-6 text-foreground ml-0.5" />
          </div>
          <p className="text-xs font-medium text-foreground">
            Apresentação ATA360
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">3 min</p>
        </div>
      </div>

      {/* Micro videos */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
          Outros vídeos
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {microVideos.map((video) => (
            <div
              key={video.title}
              className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border/30 cursor-pointer hover:bg-muted/70 transition-colors group"
            >
              <div className="text-center px-2">
                <div className="size-8 rounded-full bg-foreground/10 group-hover:bg-foreground/20 flex items-center justify-center mx-auto mb-1.5 transition-colors">
                  <Play className="size-3.5 text-foreground ml-0.5" />
                </div>
                <p className="text-[11px] font-medium text-foreground leading-tight">
                  {video.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {video.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <div role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => onOpenChange(false)}
        />
        <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-2xl shadow-lg max-h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
            <div className="flex items-center gap-2">
              <Settings className="size-4 text-foreground" />
              <span id="settings-dialog-title" className="text-sm font-semibold text-foreground">
                CONFIGURAÇÕES
              </span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Fechar configurações"
              className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Body: Side Menu + Content */}
          <div className="flex flex-1 min-h-0">
            {/* Side Menu */}
            <div className="w-48 border-r border-border/30 py-3 flex flex-col shrink-0">
              <nav className="flex flex-col gap-0.5 px-2 flex-1">
                {sideMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
  className={cn(
  "flex items-center gap-2.5 px-3 py-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer text-left",
  activeSection === item.id
  ? "bg-muted text-foreground"
  : "text-muted-foreground hover:bg-muted hover:text-foreground",
  )}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Divider + Central de ajuda */}
              <div className="border-t border-border/30 mt-2 pt-2 px-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                  Central de ajuda
                </p>
                {helpItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHelpClick(item.id)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs text-foreground hover:bg-muted transition-colors cursor-pointer w-full text-left"
                  >
                    <item.icon className="size-3.5 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-5">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                  {sideMenuItems.find((s) => s.id === activeSection)?.label}
                </h3>
                {activeSection === "profile" && renderProfile()}
                {activeSection === "legal-library" && renderLegalLibrary()}
                {activeSection === "password" && renderPassword()}
                {activeSection === "theme" && renderTheme()}
                {activeSection === "accessibility" && renderAccessibility()}
                {activeSection === "how-it-works" && renderHowItWorks()}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <SupportModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
      <FaqModal
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
      />
      <OmbudsmanModal
        open={ombudsmanOpen}
        onClose={() => setOmbudsmanOpen(false)}
      />
    </>
  );
}

// ─── Shared Helper Components ────────────────────────────────────────────────

function SectionLabel({
  label,
  className,
}: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 pb-2 pt-1", className)}>
      <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/20" />
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

function LinkFieldRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/20 last:border-0 group/link">
      <span className="text-xs text-muted-foreground">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline max-w-[60%] text-right"
      >
        <span className="truncate">{value}</span>
        <ExternalLink className="size-3 text-muted-foreground/50 group-hover/link:text-foreground shrink-0 transition-colors" />
      </a>
    </div>
  );
}

function ToggleOption({
  icon: Icon,
  label,
  desc,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <Icon className="size-3.5 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-9 h-5 rounded-full transition-colors cursor-pointer relative",
          enabled ? "bg-foreground" : "bg-border",
        )}
      >
        <div
          className={cn(
            "size-3.5 rounded-full bg-background absolute top-[3px] transition-transform",
            enabled ? "translate-x-[18px]" : "translate-x-[3px]",
          )}
        />
      </button>
    </div>
  );
}
