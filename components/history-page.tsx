"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MoreVertical,
  LayoutGrid,
  List,
  ArrowUpDown,
  History,
  MessageSquare,
  Clock,
  Calendar,
  Star,
  StarOff,
  FileText,
  Trash2,
  Eye,
  RotateCcw,
  Download,
  Filter,
  Sparkles,
  Bot,
  User,
  ChevronRight,
  FileSignature,
  File,
  AlertCircle,
  CheckCircle2,
  Layers,
  ExternalLink,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "list" | "cards";
type SortType = "date" | "rating" | "title" | "messages";

interface Artifact {
  id: string;
  name: string;
  type: "document" | "contract" | "process" | "other";
  version: number;
  isLatest: boolean;
  modifiedAt: string;
  url?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  summary: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  userRating: number | null;
  ratingComment?: string;
  agentType: string;
  artifacts: Artifact[];
  isFavorite: boolean;
  tags: string[];
  preview: ChatMessage[];
  memoryContext?: string;
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Elaboração de Termo de Referência - Material de Escritório",
    summary: "Assistência na criação de TR para aquisição de material de escritório com especificações técnicas detalhadas e pesquisa de mercado.",
    startedAt: "04/02/2026 09:15",
    lastMessageAt: "04/02/2026 11:32",
    messageCount: 24,
    userRating: 5,
    ratingComment: "Excelente! TR completo e bem estruturado.",
    agentType: "Especialista em Termos de Referência",
    artifacts: [
      { id: "art-1", name: "TR_Material_Escritorio_2026.docx", type: "document", version: 3, isLatest: true, modifiedAt: "04/02/2026 11:30" },
      { id: "art-2", name: "Pesquisa_Precos_Mercado.xlsx", type: "document", version: 2, isLatest: true, modifiedAt: "04/02/2026 10:45" },
    ],
    isFavorite: true,
    tags: ["termo de referência", "material escritório", "licitação"],
    preview: [
      { id: "m1", role: "user", content: "Preciso elaborar um termo de referência para aquisição de material de escritório.", timestamp: "09:15" },
      { id: "m2", role: "assistant", content: "Vou ajudá-lo a elaborar um TR completo. Vamos começar definindo o objeto e as especificações técnicas...", timestamp: "09:16" },
    ],
    memoryContext: "Usuário trabalha no setor de licitações, prefere TRs detalhados com justificativas técnicas robustas.",
  },
  {
    id: "conv-2",
    title: "Análise de Proposta Comercial - Fornecedor XYZ",
    summary: "Revisão e análise de proposta comercial recebida, verificação de conformidade e comparativo de preços.",
    startedAt: "03/02/2026 14:20",
    lastMessageAt: "03/02/2026 16:45",
    messageCount: 18,
    userRating: 4,
    ratingComment: "Muito bom, mas poderia ter mais detalhes na comparação.",
    agentType: "Analista de Propostas",
    artifacts: [
      { id: "art-3", name: "Parecer_Proposta_XYZ.pdf", type: "document", version: 1, isLatest: true, modifiedAt: "03/02/2026 16:40" },
    ],
    isFavorite: false,
    tags: ["proposta", "análise", "fornecedor"],
    preview: [
      { id: "m3", role: "user", content: "Recebi uma proposta do fornecedor XYZ. Pode me ajudar a analisar?", timestamp: "14:20" },
      { id: "m4", role: "assistant", content: "Claro! Por favor, compartilhe a proposta e vou realizar uma análise detalhada...", timestamp: "14:21" },
    ],
  },
  {
    id: "conv-3",
    title: "Duvidas sobre Pregão Eletrônico",
    summary: "Esclarecimento de dúvidas sobre modalidade pregão eletrônico, prazos e procedimentos legais.",
    startedAt: "02/02/2026 10:00",
    lastMessageAt: "02/02/2026 10:45",
    messageCount: 12,
    userRating: 5,
    agentType: "Consultor Jurídico",
    artifacts: [],
    isFavorite: false,
    tags: ["pregão", "duvidas", "legislação"],
    preview: [
      { id: "m5", role: "user", content: "Qual o prazo mínimo para publicação de um pregão eletrônico?", timestamp: "10:00" },
      { id: "m6", role: "assistant", content: "O prazo mínimo para publicação de pregão eletrônico é de 8 dias úteis...", timestamp: "10:01" },
    ],
  },
  {
    id: "conv-4",
    title: "Geração de Minuta de Contrato",
    summary: "Criação de minuta contratual para serviços de TI com cláusulas específicas de SLA e penalidades.",
    startedAt: "01/02/2026 08:30",
    lastMessageAt: "01/02/2026 12:15",
    messageCount: 35,
    userRating: null,
    agentType: "Especialista em Contratos",
    artifacts: [
      { id: "art-4", name: "Minuta_Contrato_TI.docx", type: "contract", version: 4, isLatest: false, modifiedAt: "01/02/2026 11:00" },
      { id: "art-5", name: "Minuta_Contrato_TI_v5.docx", type: "contract", version: 5, isLatest: true, modifiedAt: "01/02/2026 12:10" },
      { id: "art-6", name: "Anexo_SLA.docx", type: "document", version: 2, isLatest: true, modifiedAt: "01/02/2026 12:00" },
    ],
    isFavorite: true,
    tags: ["contrato", "TI", "SLA", "minuta"],
    preview: [
      { id: "m7", role: "user", content: "Preciso gerar uma minuta de contrato para serviços de TI.", timestamp: "08:30" },
      { id: "m8", role: "assistant", content: "Vou criar uma minuta completa. Quais são os serviços específicos de TI que serão contratados?", timestamp: "08:31" },
    ],
    memoryContext: "Usuário prefere contratos com cláusulas detalhadas de SLA e mecanismos de fiscalização.",
  },
  {
    id: "conv-5",
    title: "Pesquisa de Preços - Equipamentos de Informática",
    summary: "Levantamento de preços de mercado para aquisição de computadores e periféricos.",
    startedAt: "31/01/2026 15:00",
    lastMessageAt: "31/01/2026 17:30",
    messageCount: 20,
    userRating: 4,
    agentType: "Pesquisador de Mercado",
    artifacts: [
      { id: "art-7", name: "Pesquisa_Precos_Informatica.xlsx", type: "document", version: 1, isLatest: true, modifiedAt: "31/01/2026 17:25" },
      { id: "art-8", name: "Relatorio_Fornecedores.pdf", type: "document", version: 1, isLatest: true, modifiedAt: "31/01/2026 17:20" },
    ],
    isFavorite: false,
    tags: ["pesquisa", "preços", "informática"],
    preview: [
      { id: "m9", role: "user", content: "Preciso fazer uma pesquisa de preços para computadores desktop.", timestamp: "15:00" },
      { id: "m10", role: "assistant", content: "Vou realizar a pesquisa em múltiplas fontes. Qual a quantidade estimada de equipamentos?", timestamp: "15:01" },
    ],
  },
  {
    id: "conv-6",
    title: "Revisão de Edital de Licitação",
    summary: "Revisão completa de edital de pregão eletrônico com sugestões de melhorias e correções.",
    startedAt: "30/01/2026 09:00",
    lastMessageAt: "30/01/2026 14:20",
    messageCount: 42,
    userRating: 5,
    ratingComment: "Revisão muito detalhada, todas as inconsistências foram identificadas.",
    agentType: "Revisor de Editais",
    artifacts: [
      { id: "art-9", name: "Edital_PE_001_Revisado.docx", type: "document", version: 2, isLatest: true, modifiedAt: "30/01/2026 14:15" },
      { id: "art-10", name: "Checklist_Revisao.pdf", type: "document", version: 1, isLatest: true, modifiedAt: "30/01/2026 13:00" },
    ],
    isFavorite: true,
    tags: ["edital", "revisão", "pregão"],
    preview: [
      { id: "m11", role: "user", content: "Pode revisar este edital antes da publicação?", timestamp: "09:00" },
      { id: "m12", role: "assistant", content: "Com certeza! Vou fazer uma revisão completa verificando aspectos legais, técnicos e formais...", timestamp: "09:01" },
    ],
  },
];

export function HistoryPage({ onNewConversation }: { onNewConversation?: () => void }) {
  const [viewType, setViewType] = useState<ViewType>("list");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInMessages, setSearchInMessages] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterRated, setFilterRated] = useState<"all" | "rated" | "unrated">("all");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchResultsModalOpen, setSearchResultsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ conversation: Conversation; matches: string[] }>>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

  const filteredConversations = useMemo(() => {
    let result = [...mockConversations];

    // Filter by favorites
    if (filterFavorites) {
      result = result.filter(c => c.isFavorite);
    }

    // Filter by rating status
    if (filterRated === "rated") {
      result = result.filter(c => c.userRating !== null);
    } else if (filterRated === "unrated") {
      result = result.filter(c => c.userRating === null);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.summary.toLowerCase().includes(term) ||
        c.tags.some(t => t.toLowerCase().includes(term)) ||
        (searchInMessages && c.preview.some(m => m.content.toLowerCase().includes(term)))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date((b.lastMessageAt.split(" ")[0] ?? "").split("/").reverse().join("-")).getTime() -
                 new Date((a.lastMessageAt.split(" ")[0] ?? "").split("/").reverse().join("-")).getTime();
        case "rating":
          return (b.userRating || 0) - (a.userRating || 0);
        case "title":
          return a.title.localeCompare(b.title);
        case "messages":
          return b.messageCount - a.messageCount;
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, sortBy, filterFavorites, filterRated, searchInMessages]);

  const handleGlobalSearch = () => {
    if (!searchTerm) return;
    
    const term = searchTerm.toLowerCase();
    const results: Array<{ conversation: Conversation; matches: string[] }> = [];
    
    mockConversations.forEach(conv => {
      const matches: string[] = [];
      
      if (conv.title.toLowerCase().includes(term)) {
        matches.push(`Título: "${conv.title}"`);
      }
      if (conv.summary.toLowerCase().includes(term)) {
        matches.push(`Resumo: "...${conv.summary.substring(0, 50)}..."`);
      }
      conv.preview.forEach(m => {
        if (m.content.toLowerCase().includes(term)) {
          matches.push(`Mensagem (${m.role}): "...${m.content.substring(0, 50)}..."`);
        }
      });
      conv.tags.forEach(t => {
        if (t.toLowerCase().includes(term)) {
          matches.push(`Tag: "${t}"`);
        }
      });
      
      if (matches.length > 0) {
        results.push({ conversation: conv, matches });
      }
    });
    
    setSearchResults(results);
    setSearchResultsModalOpen(true);
  };

  const getRatingStars = (rating: number | null) => {
    if (rating === null) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={12}
            className={cn(
              i <= rating ? "fill-foreground text-foreground" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    );
  };

  const getArtifactIcon = (type: Artifact["type"]) => {
    switch (type) {
      case "document":
        return FileText;
      case "contract":
        return FileSignature;
      case "process":
        return File;
      default:
        return File;
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const getMonthYearKey = (dateStr: string) => {
    const parts = (dateStr.split(" ")[0] ?? "").split("/");
    return `${parts[1]}/${parts[2]}`;
  };

  const formatMonthYear = (key: string) => {
    const [month = "1", year = ""] = key.split("/");
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const groupedConversations = useMemo(() => {
    const groups: { key: string; label: string; items: typeof filteredConversations }[] = [];
    let currentKey = "";

    for (const conv of filteredConversations) {
      const key = getMonthYearKey(conv.lastMessageAt);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ key, label: formatMonthYear(key), items: [conv] });
      } else {
        groups[groups.length - 1]!.items.push(conv);
      }
    }

    return groups;
  }, [filteredConversations]);

  const totalConversations = mockConversations.length;
  const favoritesCount = mockConversations.filter(c => c.isFavorite).length;
  const unratedCount = mockConversations.filter(c => c.userRating === null).length;
  const artifactsCount = mockConversations.reduce((acc, c) => acc + c.artifacts.length, 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/30 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <History size={20} />
            Histórico de Conversas
          </h1>
          <div className="flex items-center gap-2">
            {/* New Conversation Button */}
            <Button 
              onClick={onNewConversation}
              size="sm" 
              className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted"
              variant="outline"
            >
              <Plus size={14} />
              Nova Conversa
            </Button>

            {/* View Type Icons */}
            <div className="flex items-center border border-border rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("cards")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "cards" && "bg-foreground text-background hover:bg-foreground/90"
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
                  viewType === "list" && "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                <List size={16} />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted">
                  <ArrowUpDown size={14} />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Por data {sortBy === "date" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Por avaliação {sortBy === "rating" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Por título {sortBy === "title" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("messages")}>
                  Por mensagens {sortBy === "messages" && "•"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span>{totalConversations} conversas</span>
          <span className="flex items-center gap-1">
            <Star size={10} />
            {favoritesCount} favoritas
          </span>
          <span>{artifactsCount} artefatos</span>
          {unratedCount > 0 && (
            <span className="flex items-center gap-1 text-foreground">
              <AlertCircle size={10} />
              {unratedCount} sem avaliação
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchInMessages(!searchInMessages)}
            className={cn(
              "h-6 px-2 text-xs rounded-full ml-auto",
              searchInMessages && "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            <MessageSquare size={10} className="mr-1" />
            {searchInMessages ? "Buscando em mensagens" : "Buscar em mensagens"}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título, resumo, tags ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGlobalSearch()}
            className="pl-10 pr-20 rounded-full"
          />
          <Button
            onClick={handleGlobalSearch}
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            Buscar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === "cards" ? (
          <div className="space-y-4">
            {groupedConversations.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-3 mb-3 px-1">
                  <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider whitespace-nowrap">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {group.items.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setDetailsModalOpen(true);
                      }}
                      className="group relative bg-card border border-border/30 rounded-2xl p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      {/* Header with icon and favorite */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="size-7 shrink-0 rounded-full bg-foreground flex items-center justify-center">
                            <Bot size={12} className="text-background" />
                          </div>
                          <span className="text-[10px] text-muted-foreground truncate">{conv.agentType}</span>
                        </div>
                        {conv.isFavorite && (
                          <Star size={12} className="shrink-0 fill-foreground text-foreground" />
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
                        {conv.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {conv.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>{conv.lastMessageAt.split(" ")[0]}</span>
                          <span>•</span>
                          <span>{conv.messageCount} msg</span>
                          {conv.artifacts.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Layers size={10} />
                                {conv.artifacts.length}
                              </span>
                            </>
                          )}
                        </div>
                        {getRatingStars(conv.userRating)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedConversations.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-3 mb-2 px-1">
                  <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider whitespace-nowrap">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <div className="space-y-1">
                  {group.items.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        setDetailsModalOpen(true);
                      }}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 cursor-pointer group"
                    >
                      {/* Icon */}
                      <div className="size-10 shrink-0 rounded-full bg-foreground flex items-center justify-center">
                        <Bot size={18} className="text-background" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {conv.title}
                          </h3>
                          {conv.isFavorite && (
                            <Star size={12} className="fill-foreground text-foreground shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.summary}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                          <span>{conv.agentType}</span>
                          <span>•</span>
                          <span>{conv.messageCount} mensagens</span>
                          {conv.artifacts.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Layers size={10} />
                                {conv.artifacts.length} artefato{conv.artifacts.length > 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Date & Rating */}
                      <div className="shrink-0 text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground mb-1">{conv.lastMessageAt}</div>
                        {conv.userRating ? (
                          getRatingStars(conv.userRating)
                        ) : (
                          <Badge variant="outline" className="text-[8px] h-4 rounded-full border-foreground/20">
                            Não avaliada
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConversation(conv);
                            setDetailsModalOpen(true);
                          }}>
                            <Eye size={14} className="mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RotateCcw size={14} className="mr-2" />
                            Continuar conversa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download size={14} className="mr-2" />
                            Exportar conversa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conv);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-3xl rounded-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedConversation && (
            <div>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    <Bot size={24} className="text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                      {selectedConversation.title}
                      {selectedConversation.isFavorite && (
                        <Star size={16} className="fill-foreground text-foreground" />
                      )}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedConversation.agentType}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 mt-4">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="p-3 bg-muted/50 rounded-2xl">
                    <p className="text-xs text-muted-foreground mb-1">Resumo</p>
                    <p className="text-sm text-foreground">{selectedConversation.summary}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-muted/30 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1">Iniciada em</p>
                      <p className="font-medium">{selectedConversation.startedAt}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1">Última mensagem</p>
                      <p className="font-medium">{selectedConversation.lastMessageAt}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1">Total de mensagens</p>
                      <p className="font-medium">{selectedConversation.messageCount}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1">Avaliação</p>
                      <div className="flex items-center gap-2">
                        {selectedConversation.userRating ? (
                          <>
                            {getRatingStars(selectedConversation.userRating)}
                            <span className="font-medium">{selectedConversation.userRating}/5</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Não avaliada</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Comment */}
                  {selectedConversation.ratingComment && (
                    <div className="p-3 bg-muted/30 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1">Comentário da avaliação</p>
                      <p className="text-sm italic">"{selectedConversation.ratingComment}"</p>
                    </div>
                  )}

                  {/* Memory Context */}
                  {selectedConversation.memoryContext && (
                    <div className="p-3 bg-foreground/5 border border-foreground/10 rounded-2xl">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Sparkles size={12} />
                        Memória de contexto
                      </p>
                      <p className="text-sm text-foreground">{selectedConversation.memoryContext}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedConversation.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Artifacts */}
                  {selectedConversation.artifacts.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Artefatos gerados</p>
                      <div className="space-y-2">
                        {selectedConversation.artifacts.map(artifact => {
                          const IconComponent = getArtifactIcon(artifact.type);
                          return (
                            <div
                              key={artifact.id}
                              className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl group hover:bg-muted/50 cursor-pointer"
                            >
                              <div className={cn(
                                "size-9 rounded-xl flex items-center justify-center",
                                artifact.isLatest ? "bg-foreground" : "bg-muted"
                              )}>
                                <IconComponent size={16} className={artifact.isLatest ? "text-background" : "text-foreground"} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium truncate">{artifact.name}</p>
                                  {artifact.isLatest ? (
                                    <Badge className="text-[8px] h-4 rounded-full bg-foreground text-background border-0">
                                      v{artifact.version} - Atual
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-[8px] h-4 rounded-full text-muted-foreground">
                                      v{artifact.version}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  Modificado em {artifact.modifiedAt}
                                </p>
                              </div>
                              <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100">
                                <ExternalLink size={14} />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Preview Messages */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Preview da conversa</p>
                    <div className="space-y-2">
                      {selectedConversation.preview.map(msg => (
                        <div
                          key={msg.id}
                          className={cn(
                            "p-3 rounded-2xl",
                            msg.role === "user" ? "bg-foreground/10 ml-8" : "bg-muted/50 mr-8"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.role === "user" ? (
                              <User size={12} className="text-muted-foreground" />
                            ) : (
                              <Bot size={12} className="text-muted-foreground" />
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {msg.role === "user" ? "Você" : "Assistente"} - {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4 pt-4 border-t border-border/30">
                <Button variant="outline" className="rounded-full gap-2 bg-transparent">
                  <Download size={14} />
                  Exportar
                </Button>
                <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 gap-2">
                  <RotateCcw size={14} />
                  Continuar Conversa
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Search Results Modal */}
      <Dialog open={searchResultsModalOpen} onOpenChange={setSearchResultsModalOpen}>
        <DialogContent className="max-w-2xl rounded-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Resultados da busca</DialogTitle>
            <DialogDescription>
              {searchResults.length} conversa{searchResults.length !== 1 && "s"} encontrada{searchResults.length !== 1 && "s"} para "{searchTerm}"
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4">
            <div className="space-y-3">
              {searchResults.map(({ conversation, matches }) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setSearchResultsModalOpen(false);
                    setDetailsModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 cursor-pointer"
                >
                  <h4 className="text-sm font-semibold mb-1">{conversation.title}</h4>
                  <div className="space-y-1">
                    {matches.map((match, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground">
                        <CheckCircle2 size={10} className="inline mr-1 text-foreground" />
                        {match}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Excluir conversa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {conversationToDelete && (
            <div className="p-3 bg-muted/30 rounded-2xl mt-2">
              <p className="text-sm font-medium">{conversationToDelete.title}</p>
              <p className="text-xs text-muted-foreground">{conversationToDelete.messageCount} mensagens • {conversationToDelete.artifacts.length} artefatos</p>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="rounded-full">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement delete
                setDeleteConfirmOpen(false);
                setConversationToDelete(null);
              }}
              className="rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
