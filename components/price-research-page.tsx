"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  BarChart3,
  SlidersHorizontal,
  ArrowUp,
  ChevronDown,
  MoreVertical,
  Check,
  X,
  MessageSquare,
  TrendingUp,
  Users,
  FileText,
  FileSignature,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PriceItem {
  id: string;
  pdm: string;
  catmat: string;
  description: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  registryCount: number;
  suppliers: number;
  contracts: number;
  atas: number;
}

interface FilterCategory {
  name: string;
  tags: Array<{ label: string; count: number }>;
}

type ViewType = "grid" | "list";

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const UF_LIST = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

const autocompleteSuggestions = [
  "Cama",
  "Cama conjugada",
  "Cama comum",
  "Cama hospitalar",
  "Cama elástica",
  "Cama metálica dobrável",
  "Camara de espuma de combate a incêndio",
  "Cadeira de rodas",
  "Cadeira giratória",
  "Cadeira fixa",
  "Monitor multiparâmetro",
  "Monitor de vídeo",
  "Desfibrilador externo automático",
  "Desfibrilador manual",
  "Mesa cirúrgica",
  "Mesa de escritório",
  "Aparelho de raio-X",
  "Aparelho de ultrassom",
  "Aparelho de pressão arterial",
  "Bisturi elétrico",
  "Bomba de infusão",
  "Ventilador pulmonar",
  "Oxímetro de pulso",
  "Autoclave hospitalar",
  "Esterilizador",
  "Maca hospitalar",
  "Maca de transporte",
  "Computador desktop",
  "Notebook",
  "Impressora multifuncional",
];

const mockFilterCategories: FilterCategory[] = [
  {
    name: "Posicionamento",
    tags: [
      { label: "Fowler", count: 42 },
      { label: "MÍNIMO 3 POSIÇÕES", count: 42 },
      { label: "Trendelenburg", count: 24 },
      { label: "DE 1 ATÉ 3 POSIÇÕES", count: 4 },
    ],
  },
  {
    name: "Tipo de acionamento",
    tags: [
      { label: "COMANDO DIGITAL", count: 30 },
      { label: "Elétrico", count: 30 },
      { label: "COMANDO MANUAL", count: 16 },
      { label: "Manivela / mecânico", count: 16 },
      { label: "Manual", count: 16 },
    ],
  },
];

const mockPriceItems: PriceItem[] = [
  {
    id: "1",
    pdm: "467637",
    catmat: "467637",
    description: "CAMA HOSPITALAR, MATERIAL AÇO INOXIDÁVEL, TIPO ELÉTRICA, RODAS RODÍZIOS C/ FREI...",
    avgPrice: 19983.71,
    minPrice: 798.0,
    maxPrice: 189000.0,
    registryCount: 27,
    suppliers: 1,
    contracts: 1,
    atas: 1,
  },
  {
    id: "2",
    pdm: "467637",
    catmat: "467637",
    description: "CAMA HOSPITALAR, MATERIAL AÇO INOXIDÁVEL, TIPO ELÉTRICA, RODAS RODÍZIOS C/ FREI...",
    avgPrice: 19983.71,
    minPrice: 798.0,
    maxPrice: 189000.0,
    registryCount: 27,
    suppliers: 1,
    contracts: 1,
    atas: 1,
  },
  {
    id: "3",
    pdm: "467637",
    catmat: "467637",
    description: "CAMA HOSPITALAR, MATERIAL AÇO INOXIDÁVEL, TIPO ELÉTRICA, RODAS RODÍZIOS C/ FREI...",
    avgPrice: 19983.71,
    minPrice: 798.0,
    maxPrice: 189000.0,
    registryCount: 27,
    suppliers: 1,
    contracts: 1,
    atas: 1,
  },
  {
    id: "4",
    pdm: "467638",
    catmat: "467638",
    description: "CAMA HOSPITALAR, MATERIAL AÇO CARBONO, TIPO MANUAL, RODAS RODÍZIOS C/ FREIO...",
    avgPrice: 8450.30,
    minPrice: 1200.0,
    maxPrice: 25000.0,
    registryCount: 15,
    suppliers: 3,
    contracts: 2,
    atas: 1,
  },
  {
    id: "5",
    pdm: "467639",
    catmat: "467639",
    description: "CAMA HOSPITALAR, MATERIAL AÇO INOXIDÁVEL, TIPO FAWLER, COMANDO DIGITAL...",
    avgPrice: 32150.0,
    minPrice: 15000.0,
    maxPrice: 55000.0,
    registryCount: 12,
    suppliers: 2,
    contracts: 1,
    atas: 2,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function PriceResearchPage() {
  const router = useRouter();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [viewType, setViewType] = useState<ViewType>("list");
  const [sortBy, setSortBy] = useState("description");
  const [selectedUF, setSelectedUF] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [detailsText, setDetailsText] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    return autocompleteSuggestions.filter((s) =>
      s.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setHighlightedIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setShowSuggestions(value.length >= 2);
    }, 300);
  }, []);

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || filteredSuggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
            selectSuggestion(filteredSuggestions[highlightedIndex]!);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [showSuggestions, filteredSuggestions, highlightedIndex]
  );

  const selectSuggestion = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Toggle filter tag
  const toggleFilter = useCallback((tag: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  // Toggle item selection
  const toggleItemSelection = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Toggle row expand
  const toggleRowExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  const totalResults = 242;

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col h-full">
        {/* ─── Header ──────────────────────────────────────────────────── */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={20} />
              Pesquisa de Preços
            </h1>
            <div className="flex items-center gap-2">
              {/* UF Filter */}
              <Select value={selectedUF} onValueChange={setSelectedUF}>
                <SelectTrigger className="h-9 rounded-full border-border/60 bg-transparent min-w-[120px]">
                  <SelectValue placeholder="Todas UFs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas UFs</SelectItem>
                  {UF_LIST.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Generate Report */}
              <Button
                className="gap-2 h-9 rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={() => router.push("/price-research/report")}
              >
                Gerar Relatório
              </Button>

              {/* View Type Toggle */}
              <div className="flex items-center gap-1 border border-border rounded-full p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewType("grid")}
                  className={cn(
                    "size-7 rounded-full hover:bg-muted",
                    viewType === "grid" && "bg-foreground text-background hover:bg-foreground/90"
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

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent h-9 rounded-full hover:bg-muted">
                    <ArrowUpDown size={14} />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("description")}>
                    Descrição {sortBy === "description" && "•"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("avgPrice")}>
                    Preço Médio {sortBy === "avgPrice" && "•"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("registryCount")}>
                    Registros {sortBy === "registryCount" && "•"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("pdm")}>
                    PDM {sortBy === "pdm" && "•"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* ─── Search with Autocomplete ──────────────────────────────── */}
          <div ref={searchRef} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Digite a descrição do produto / serviço para visualizar os preços históricos registrados no PNCP. Se necessário, use nossos filtros ou tags para uma busca mais personalizada."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchTerm.length >= 2) setShowSuggestions(true);
                }}
                className="pl-10 pr-24 rounded-full"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full hover:bg-muted"
                >
                  <SlidersHorizontal size={16} className="text-muted-foreground" />
                </Button>
                <Button
                  size="icon"
                  className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <ArrowUp size={16} />
                </Button>
              </div>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 cursor-pointer transition-colors flex items-center gap-2",
                      index === highlightedIndex && "bg-muted/80",
                      index === 0 && "rounded-t-xl",
                      index === filteredSuggestions.length - 1 && "rounded-b-xl"
                    )}
                  >
                    <span className="text-muted-foreground font-medium text-xs">M</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Content Area ────────────────────────────────────────────── */}
        <div className="flex-1 p-4 space-y-4">
          {/* Collapsible: Detalhamento */}
          <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors hover:bg-muted/30",
                detailsOpen ? "border-primary/40 bg-primary/5" : "border-border/40"
              )}>
                <span className="text-sm font-medium text-foreground">
                  Detalhamento do resultado da sua pesquisa e justificativa da seleção
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-muted-foreground transition-transform",
                    detailsOpen && "rotate-180"
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 border border-primary/40 rounded-xl bg-primary/5">
                <Textarea
                  placeholder="Descreva os detalhes da sua pesquisa e justificativa da seleção dos itens..."
                  value={detailsText}
                  onChange={(e) => setDetailsText(e.target.value)}
                  className="min-h-[100px] bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-sm"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Collapsible: Filtros de Tags */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 cursor-pointer transition-colors hover:bg-muted/30">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  FILTROS DE TAGS POR CARACTERÍSTICAS (PDM)
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "text-muted-foreground transition-transform",
                    filtersOpen && "rotate-180"
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 border border-border/40 rounded-xl space-y-4">
                {mockFilterCategories.map((category) => (
                  <div key={category.name}>
                    <p className="text-xs font-semibold text-foreground mb-2">
                      {category.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => toggleFilter(tag.label)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer",
                            activeFilters.has(tag.label)
                              ? "bg-foreground text-background border-foreground"
                              : "bg-muted/50 text-foreground border-border/40 hover:bg-muted"
                          )}
                        >
                          {tag.label} ({tag.count})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results Counter */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Registros Selecionados:</span>
            <span className="font-bold text-foreground">{selectedItems.size || 30}</span>
            <span>de</span>
            <span className="font-bold text-foreground">{totalResults}</span>
            <span>encontrados</span>
          </div>

          {/* ─── Results Table ───────────────────────────────────────── */}
          <div className="border border-border/40 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-xs font-semibold">PDM</TableHead>
                  <TableHead className="text-xs font-semibold">CATMAT / CATSERV</TableHead>
                  <TableHead className="text-xs font-semibold">Descrição do Item</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Media</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Min - Max</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Registros</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPriceItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow
                      className={cn(
                        "cursor-pointer transition-colors",
                        expandedRow === item.id && "bg-muted/30"
                      )}
                      onClick={() => toggleRowExpand(item.id)}
                    >
                      <TableCell className="text-sm text-muted-foreground">
                        {item.pdm}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.catmat}
                      </TableCell>
                      <TableCell className="text-sm text-foreground max-w-[400px] truncate">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-semibold text-destructive line-through">
                          {formatCurrency(item.avgPrice)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {formatCurrency(item.minPrice)} - {formatCurrency(item.maxPrice)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-semibold text-foreground">
                          {item.registryCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 rounded-full text-xs gap-1.5 border-border/40 bg-transparent hover:bg-muted"
                          >
                            <MessageSquare size={12} />
                            Usar no chat
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-full hover:bg-muted">
                                <MoreVertical size={14} className="text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Exportar</DropdownMenuItem>
                              <DropdownMenuItem>Comparar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleItemSelection(item.id)}
                            className={cn(
                              "size-7 rounded-full",
                              selectedItems.has(item.id)
                                ? "bg-foreground text-background hover:bg-foreground/90"
                                : "hover:bg-muted text-muted-foreground"
                            )}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full hover:bg-destructive/10 text-destructive/60 hover:text-destructive"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row Actions */}
                    {expandedRow === item.id && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={7} className="py-3">
                          <div className="flex items-center gap-2 pl-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8 rounded-full text-xs gap-1.5 bg-foreground text-background hover:bg-foreground/90"
                            >
                              <TrendingUp size={14} />
                              Historico
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full text-xs gap-1.5 border-border/40 bg-transparent hover:bg-muted relative"
                            >
                              <Users size={14} />
                              Fornecedores
                              {item.suppliers > 0 && (
                                <Badge variant="outline" className="ml-1 text-[9px] h-4 min-w-4 px-1 rounded-full border-foreground/20">
                                  {item.suppliers}
                                </Badge>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full text-xs gap-1.5 border-border/40 bg-transparent hover:bg-muted relative"
                            >
                              <FileText size={14} />
                              Atas
                              {item.atas > 0 && (
                                <Badge variant="outline" className="ml-1 text-[9px] h-4 min-w-4 px-1 rounded-full border-foreground/20">
                                  {item.atas}
                                </Badge>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full text-xs gap-1.5 border-border/40 bg-transparent hover:bg-muted relative"
                            >
                              <FileSignature size={14} />
                              Contratos
                              {item.contracts > 0 && (
                                <Badge variant="outline" className="ml-1 text-[9px] h-4 min-w-4 px-1 rounded-full border-foreground/20">
                                  {item.contracts}
                                </Badge>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
