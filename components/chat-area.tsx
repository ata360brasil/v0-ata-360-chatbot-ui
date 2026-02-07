"use client";

import React from "react"
import { TrendingUp } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Paperclip, SlidersHorizontal, Brain, ChevronDown, FileText, FileSpreadsheet, FileImage, File, X, Search, FileCheck, PenTool, PiggyBank, Users, Scale, Globe, ThumbsUp, Star } from "lucide-react";
import { ATA360Icon } from "@/components/ata360-icon";
import {
  FiltersModal,
  type FilterState,
  initialFilters,
  hasActiveFilters,
} from "@/components/filters-modal";
import type { ArtifactData } from "@/components/artifacts-panel";
import { DFDDocument } from "@/components/artifacts/dfd-document";
import { dfdSacoLixoData } from "@/lib/examples/dfd-saco-lixo";


interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AttachedFile {
  id: string;
  name: string;
  type: "pdf" | "text" | "word" | "spreadsheet" | "image" | "other";
  file: File;
}

const getFileType = (file: File): AttachedFile["type"] => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mimeType = file.type.toLowerCase();
  
  if (ext === "pdf" || mimeType === "application/pdf") return "pdf";
  if (["doc", "docx"].includes(ext) || mimeType.includes("msword") || mimeType.includes("wordprocessingml")) return "word";
  if (["xls", "xlsx", "csv"].includes(ext) || mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "spreadsheet";
  if (["txt", "rtf"].includes(ext) || mimeType.startsWith("text/plain")) return "text";
  if (mimeType.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "other";
};

const getFileIcon = (type: AttachedFile["type"]) => {
  switch (type) {
    case "pdf":
      return <FileText className="size-4 text-foreground" />;
    case "word":
      return <FileText className="size-4 text-foreground" />;
    case "text":
      return <FileText className="size-4 text-foreground" />;
    case "spreadsheet":
      return <FileSpreadsheet className="size-4 text-foreground" />;
    case "image":
      return <FileImage className="size-4 text-foreground" />;
    default:
      return <File className="size-4 text-foreground" />;
  }
};

const getFileTypeLabel = (type: AttachedFile["type"]) => {
  switch (type) {
    case "pdf": return "PDF";
    case "word": return "Word";
    case "text": return "Texto";
    case "spreadsheet": return "Planilha";
    case "image": return "Imagem";
    default: return "Arquivo";
  }
};

interface ChatAreaProps {
  hasStartedChat: boolean;
  onStartChat: () => void;
  onOpenArtifact: (artifact: ArtifactData) => void;
}

const suggestionCards = [
  // Primeira linha (sempre visível)
  { title: "Pesquise rápido", description: "Fornecedores, produtos e serviços.", icon: Search },
  { title: "Artefatos em 1 clique", description: "Gere documentos automáticos.", icon: FileText },
  { title: "Contratos sempre à mão", description: "Seus processos a qualquer momento.", icon: FileCheck },
  { title: "Assine na hora", description: "Assinatura digital com validade jurídica.", icon: PenTool },
  // Segunda linha (oculta por padrão)
  { title: "Recursos disponíveis", description: "Emendas, convênios e programas.", icon: PiggyBank },
  { title: "Adesão on-line", description: "Carona simplificada, com saldo.", icon: Users },
  { title: "Leis e boas práticas", description: "Legislação atualizada por corpo jurídico.", icon: Scale },
  { title: "Publicação PNCP", description: "Integração direta com portais gov.br.", icon: Globe },
];

// DFD Processing steps for animated indicator
const dfdProcessingSteps = [
  { label: "Analisando solicitação", icon: Brain },
  { label: "Identificando demanda", icon: FileText },
  { label: "Verificando fundamentação legal", icon: Scale },
  { label: "Elaborando justificativa", icon: PenTool },
  { label: "Calculando estimativa de valor", icon: PiggyBank },
  { label: "Definindo prazos e planejamento", icon: FileCheck },
  { label: "Verificando conformidade", icon: Scale },
  { label: "Gerando documento final", icon: FileText },
];

export function ChatArea({ hasStartedChat, onStartChat, onOpenArtifact }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isDFDProcessing, setIsDFDProcessing] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ratingModal, setRatingModal] = useState<{ open: boolean; messageId: string | null }>({ open: false, messageId: null });
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingObservation, setRatingObservation] = useState("");
  const [ratedMessages, setRatedMessages] = useState<Map<string, number>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset textarea height on mount and when inputValue is empty
  useEffect(() => {
    if (textareaRef.current) {
      if (inputValue === "") {
        // Force minimum height when empty
        textareaRef.current.style.height = "40px";
      } else {
        // Allow expansion when there's text
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  }, [inputValue]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    if (!hasStartedChat) {
      onStartChat();
    }

    // Simulate AI response
    setIsTyping(true);
    
    // Check if user is asking for DFD
    const isDFDRequest = inputValue.toLowerCase().includes("dfd") || 
                         inputValue.toLowerCase().includes("documento de formalizacao") ||
                         inputValue.toLowerCase().includes("formalização da demanda") ||
                         inputValue.toLowerCase().includes("formalizacao da demanda");
    
    if (isDFDRequest) {
      // Start DFD processing with steps
      setIsDFDProcessing(true);
      setProcessingStep(0);
      
      // Cycle through processing steps
      processingIntervalRef.current = setInterval(() => {
        setProcessingStep((prev) => {
          if (prev < dfdProcessingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 800);
      
      // Complete after all steps
      setTimeout(() => {
        if (processingIntervalRef.current) {
          clearInterval(processingIntervalRef.current);
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Gerei o Documento de Formalização da Demanda (DFD) conforme solicitado. O documento foi elaborado seguindo rigorosamente a Lei 14.133/2021, Decreto 10.947/2022 e IN SEGES/ME 58/2022.\n\nO DFD está pronto para visualização no painel lateral. Você pode revisar, fazer download ou solicitar ajustes. Deseja que eu modifique algum campo específico?`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        setIsDFDProcessing(false);
        setProcessingStep(0);

        // Show DFD artifact
        onOpenArtifact({
          id: "dfd-saco-lixo",
          type: "document",
          title: "DFD - Saco de Lixo 100L",
          content: <DFDDocument data={dfdSacoLixoData} />,
          editableContent: (isEditing: boolean) => (
            <DFDDocument data={dfdSacoLixoData} isEditing={isEditing} />
          ),
        });
      }, dfdProcessingSteps.length * 800 + 500);
    } else {
      // Default response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Encontrei informações relevantes sobre "${inputValue}". Posso ajudá-lo a filtrar os resultados por região, modalidade ou período. Deseja refinar sua busca?`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        // Show example artifact
        onOpenArtifact({
          id: "1",
          type: "table",
          title: "Resultados da Pesquisa",
          content: (
            <div className="rounded-lg bg-muted p-4">
<p className="text-sm text-muted-foreground mb-4">
                                Exemplo de resultado de pesquisa - tabela de preços praticados
                              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-background p-3 rounded-lg border border-border/50"
                  >
                    <p className="font-medium text-foreground">Item {i}</p>
<p className="text-sm text-muted-foreground">
                                      Preço médio: R$ {(Math.random() * 1000).toFixed(2)}
                                    </p>
                  </div>
                ))}
              </div>
            </div>
          ),
        });
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleFavorite = (messageId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const openRatingModal = (messageId: string) => {
    const existingRating = ratedMessages.get(messageId);
    setRatingStars(existingRating || 0);
    setRatingHover(0);
    setRatingObservation("");
    setRatingModal({ open: true, messageId });
  };

  const submitRating = () => {
    if (ratingModal.messageId && ratingStars > 0) {
      setRatedMessages((prev) => new Map(prev).set(ratingModal.messageId!, ratingStars));
    }
    setRatingModal({ open: false, messageId: null });
    setRatingStars(0);
    setRatingHover(0);
    setRatingObservation("");
  };

  const filtersActive = hasActiveFilters(filters);

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {!hasStartedChat ? (
            /* Welcome Screen */
            <div className="h-full flex flex-col px-4">
              {/* Content Area - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="max-w-2xl w-full text-center">
                  {/* Logo with gradient animation */}
                  <div className="mb-6 relative">
                    <div className="relative mx-auto w-[220px] h-[73px]">
                      <img
                        src="/images/ata360-logo.png"
                        alt="ATA360"
                        width={220}
                        height={73}
                        className="mx-auto relative z-10"
                      />
                      {/* Gradient overlay animation */}
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-logo-shine" />
                      </div>
                    </div>
                  </div>

                  {/* Welcome Title */}
                  <h1 className="text-3xl font-semibold text-foreground mb-2">
                    {"Compras públicas com confiança"} 
                  </h1>
                  <p className="text-base text-muted-foreground mb-8">
                     IA sem alucinações, especialista na lei 14.133/2021. Com o ATA360 é simples. Escreva do seu jeito e pronto: pesquisas e documentos em segundos.                                                       
                  </p>

                  {/* Suggestion Cards */}
                  <div className="max-w-xl mx-auto">
                    {/* Grid 2 colunas x 4 linhas */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Primeiras 2 linhas - sempre visiveis (4 cards) */}
                      {suggestionCards.slice(0, 4).map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(card.title)}
                            className="text-left px-3 py-3 rounded-lg bg-background border border-border/50 hover:border-border/80 hover:bg-muted/30 transition-all duration-200 cursor-pointer flex items-start gap-3"
                          >
                            <div className="size-8 rounded-full bg-transparent hover:bg-muted/50 flex items-center justify-center shrink-0 transition-colors">
                              <IconComponent className="size-4 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-0.5">
                                {card.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                {card.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      
                      {/* Ultimas 2 linhas - expansiveis (4 cards) */}
                      {cardsExpanded && suggestionCards.slice(4, 8).map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                          <button
                            key={index + 4}
                            onClick={() => handleSuggestionClick(card.title)}
                            className="relative text-left px-3 py-3 rounded-lg bg-background border border-border/50 hover:border-border/80 hover:bg-muted/30 transition-all duration-200 cursor-pointer flex items-start gap-3"
                          >
                            {/* Badge "Em breve" - apenas para Publicação PNCP */}
                            {card.title === "Publicação PNCP" && (
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-medium bg-foreground text-background rounded-full">
                                Em breve
                              </span>
                            )}
                            <div className="size-8 rounded-full bg-transparent hover:bg-muted/50 flex items-center justify-center shrink-0 transition-colors">
                              <IconComponent className="size-4 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-0.5">
                                {card.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-snug">
                                {card.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Botao expandir/recolher */}
                    <button
                      onClick={() => setCardsExpanded(!cardsExpanded)}
                      className="mx-auto mt-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ChevronDown 
                        className={cn(
                          "size-5 transition-transform duration-200",
                          cardsExpanded && "rotate-180"
                        )} 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Input - Fixed at bottom */}
              <div className="pb-4 pt-6">
                <div className="max-w-2xl mx-auto">
                  <ChatInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    onKeyDown={handleKeyDown}
                    textareaRef={textareaRef}
                    filtersActive={filtersActive}
                    onOpenFilters={() => setFiltersOpen(true)}
                  />
                  {/* Disclaimer */}
                  <p className="text-xs text-muted-foreground text-center mt-3">
                         Antes do uso verifique as respostas. Transforme dados em decisões inteligentes.                                                                                                 
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="max-w-3xl mx-auto px-4 py-6 pb-32">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-5",
                    message.role === "user" ? "flex justify-end" : "flex justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex gap-3 max-w-[90%]">
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <ATA360Icon className="size-4" color="color" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] text-foreground leading-relaxed">
                          {message.content}
                        </p>
                        {/* Action icons */}
                        <div className="flex items-center gap-1 mt-2 opacity-0 hover:opacity-100 transition-opacity duration-200 group/actions" style={{ opacity: favorites.has(message.id) || ratedMessages.has(message.id) ? 1 : undefined }}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => openRatingModal(message.id)}
                                className={cn(
                                  "size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                                  ratedMessages.has(message.id)
                                    ? "text-foreground hover:bg-muted"
                                    : "text-muted-foreground/50 hover:text-foreground hover:bg-muted"
                                )}
                              >
                                <ThumbsUp className="size-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Avaliar resposta</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleFavorite(message.id)}
                                className={cn(
                                  "size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                                  favorites.has(message.id)
                                    ? "text-foreground hover:bg-muted"
                                    : "text-muted-foreground/50 hover:text-foreground hover:bg-muted"
                                )}
                              >
                                <Star className={cn("size-3.5", favorites.has(message.id) && "fill-foreground")} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{favorites.has(message.id) ? "Remover favorito" : "Favoritar resposta"}</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="max-w-[80%] bg-muted rounded-2xl px-3 py-2">
                      <p className="text-[13px] text-foreground">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator - v0.app style with gradient animation */}
              {isTyping && (
                <div className="mb-5 flex justify-start">
                  <div className="flex gap-3 items-start">
                    {/* Animated gradient icon container */}
                    <div className="size-7 rounded-full bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent flex items-center justify-center shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent animate-shimmer" />
                      {isDFDProcessing ? (
                        (() => {
                          const StepIcon = dfdProcessingSteps[processingStep]?.icon || Brain;
                          return <StepIcon className="size-4 text-foreground relative z-10" />;
                        })()
                      ) : (
                        <Brain className="size-4 text-foreground relative z-10" />
                      )}
                    </div>
                    
                    {/* Single line animated step indicator */}
                    <div className="flex items-center gap-2 min-h-[28px]">
                      <div className="relative overflow-hidden">
                        {isDFDProcessing ? (
                          <div 
                            className="flex items-center gap-2 transition-all duration-500 ease-out"
                            key={processingStep}
                          >
                            <span className="size-1.5 bg-foreground rounded-full animate-pulse" />
                            <span className="text-[13px] text-foreground font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                              {dfdProcessingSteps[processingStep]?.label}
                            </span>
                            <span className="text-[11px] text-muted-foreground/50">
                              {processingStep + 1}/{dfdProcessingSteps.length}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="size-1.5 bg-foreground rounded-full animate-pulse" />
                            <span className="text-[13px] text-muted-foreground">
                              Processando
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Animated dots */}
                      <div className="flex gap-0.5 ml-1">
                        <span className="size-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                        <span className="size-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                        <span className="size-1 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input - Fixed at bottom when chat started */}
        {hasStartedChat && (
          <div className="shrink-0 border-t border-border/30 bg-background px-4 py-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onKeyDown={handleKeyDown}
                textareaRef={textareaRef}
                filtersActive={filtersActive}
                onOpenFilters={() => setFiltersOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Filters Modal */}
        <FiltersModal
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Rating Modal */}
        {ratingModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setRatingModal({ open: false, messageId: null })}
            />
            <div className="relative bg-background border border-border/40 rounded-2xl w-[90vw] max-w-sm shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="size-4 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">AVALIAR RESPOSTA</span>
                </div>
                <button
                  onClick={() => setRatingModal({ open: false, messageId: null })}
                  className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-5 space-y-5">
                {/* Stars */}
                <div>
                  <p className="text-xs text-muted-foreground mb-3">Como você avalia esta resposta?</p>
                  <div className="flex items-center gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatingStars(star)}
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "size-7 transition-colors",
                            (ratingHover || ratingStars) >= star
                              ? "text-foreground fill-foreground"
                              : "text-border"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {ratingStars > 0 && (
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      {ratingStars === 1 && "Insatisfeito"}
                      {ratingStars === 2 && "Regular"}
                      {ratingStars === 3 && "Bom"}
                      {ratingStars === 4 && "Muito bom"}
                      {ratingStars === 5 && "Excelente"}
                    </p>
                  )}
                </div>

                {/* Observation */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Observação (opcional)</p>
                  <textarea
                    value={ratingObservation}
                    onChange={(e) => setRatingObservation(e.target.value)}
                    placeholder="Conte o que pode melhorar..."
                    rows={3}
                    className="w-full bg-background border border-border/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none p-3 leading-relaxed"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={() => setRatingModal({ open: false, messageId: null })}
                  className="h-10 flex-1 max-w-[160px] rounded-full border-border/60 bg-transparent hover:bg-muted/50 text-sm font-medium cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={submitRating}
                  disabled={ratingStars === 0}
                  className="h-10 flex-1 max-w-[160px] rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-40"
                >
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  filtersActive: boolean;
  onOpenFilters: () => void;
}

function ChatInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  textareaRef,
  filtersActive,
  onOpenFilters,
}: ChatInputProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 10;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_FILES - attachedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newAttachedFiles: AttachedFile[] = filesToAdd.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: getFileType(file),
      file,
    }));

    setAttachedFiles((prev) => [...prev, ...newAttachedFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const truncateFileName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    const ext = name.split(".").pop() || "";
    const baseName = name.slice(0, name.length - ext.length - 1);
    const truncatedBase = baseName.slice(0, maxLength - ext.length - 4) + "...";
    return `${truncatedBase}.${ext}`;
  };

  return (
    <div className="relative">
      {/* Attached Files Display */}
      {attachedFiles.length > 0 && (
        <div className="mb-4 px-2">
          <div className="flex flex-wrap justify-center gap-3 max-h-[88px] overflow-hidden">
            {attachedFiles.slice(0, 10).map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-background border border-border/40 rounded-md group flex-1 min-w-[120px] max-w-[160px]"
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-foreground truncate leading-tight">
                    {truncateFileName(file.name)}
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-tight">
                    {getFileTypeLabel(file.type)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded-sm"
                >
                  <X className="size-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.jpg,.jpeg,.png,.gif,.webp,.svg"
      />

      <div className="bg-muted rounded-full">
        <div className="flex items-center gap-2 p-3">
          {/* Attach Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAttachClick}
                disabled={attachedFiles.length >= MAX_FILES}
                className={cn(
                  "size-10 rounded-full bg-background hover:bg-background/80 cursor-pointer shrink-0 self-center",
                  attachedFiles.length >= MAX_FILES && "opacity-50 cursor-not-allowed"
                )}
              >
                <Paperclip className="size-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {attachedFiles.length >= MAX_FILES 
                ? "Limite atingido" 
                : `Anexar (${attachedFiles.length}/${MAX_FILES})`}
            </TooltipContent>
          </Tooltip>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Digite o que precisa e, se preferir, use filtros para respostas mais precisas..."
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2 px-2 min-h-[40px] max-h-[120px] cursor-text overflow-y-auto"
          />

          {/* Filters Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenFilters}
                className={cn(
                  "size-10 rounded-full bg-background hover:bg-background/80 cursor-pointer shrink-0 self-center",
                  filtersActive && "bg-foreground text-white hover:bg-foreground/90"
                )}
              >
                <SlidersHorizontal className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {filtersActive ? "Filtros ativos" : "Filtros"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
