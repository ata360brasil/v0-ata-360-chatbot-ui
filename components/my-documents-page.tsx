"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import {
  Search,
  Download,
  Trash2,
  Eye,
  Share2,
  MoreVertical,
  LayoutGrid,
  List,
  ArrowUpDown,
  FileText,
  File,
  Calendar,
  Clock,
  User,
  Lock,
  Globe,
  Archive,
  Copy,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "grid" | "list";
type SortType = "date" | "name" | "size" | "type";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xlsx" | "txt" | "other";
  size: string;
  createdAt: string;
  modifiedAt: string;
  shared: boolean;
  tags: string[];
  favorite: boolean;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Relatório Mensal - Janeiro 2026",
    type: "pdf",
    size: "2.4 MB",
    createdAt: "15/01/2026",
    modifiedAt: "04/02/2026",
    shared: false,
    tags: ["relatorio", "janeiro"],
    favorite: true,
  },
  {
    id: "2",
    name: "Proposta Comercial - Cliente XYZ",
    type: "doc",
    size: "1.2 MB",
    createdAt: "20/01/2026",
    modifiedAt: "28/01/2026",
    shared: true,
    tags: ["proposta", "cliente"],
    favorite: false,
  },
  {
    id: "3",
    name: "Planilha Orcamentaria Q1",
    type: "xlsx",
    size: "856 KB",
    createdAt: "10/01/2026",
    modifiedAt: "02/02/2026",
    shared: false,
    tags: ["orcamento", "q1"],
    favorite: true,
  },
  {
    id: "4",
    name: "Notas Reuniao - Diretoria",
    type: "txt",
    size: "145 KB",
    createdAt: "03/02/2026",
    modifiedAt: "03/02/2026",
    shared: true,
    tags: ["reuniao", "diretoria"],
    favorite: false,
  },
  {
    id: "5",
    name: "Contrato Fornecedor ABC",
    type: "pdf",
    size: "3.1 MB",
    createdAt: "25/01/2026",
    modifiedAt: "01/02/2026",
    shared: false,
    tags: ["contrato", "fornecedor"],
    favorite: true,
  },
  {
    id: "6",
    name: "Analise Competitiva 2026",
    type: "pdf",
    size: "5.8 MB",
    createdAt: "18/01/2026",
    modifiedAt: "30/01/2026",
    shared: true,
    tags: ["analise", "competitiva"],
    favorite: false,
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="size-4 text-red-500" />;
    case "doc":
      return <FileText className="size-4 text-blue-500" />;
    case "xlsx":
      return <FileText className="size-4 text-green-500" />;
    default:
      return <File className="size-4 text-muted-foreground" />;
  }
}

export function MyDocumentsPage() {
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    let filtered = mockDocuments.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFavorite = showFavoritesOnly ? doc.favorite : true;
      return matchesSearch && matchesFavorite;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return parseInt(a.size) - parseInt(b.size);
        case "type":
          return a.type.localeCompare(b.type);
        default: // date
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      }
    });

    return filtered;
  }, [searchTerm, sortBy, showFavoritesOnly]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/30 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText size={20} />
            Meus Documentos
          </h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-2 bg-foreground text-white hover:bg-foreground/90 h-9 rounded-full"
            >
              <Plus size={14} />
              Novo Documento
            </Button>

            {/* View Type Icons */}
            <div className="flex items-center border border-border rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewType("grid")}
                className={cn(
                  "size-7 rounded-full hover:bg-muted",
                  viewType === "grid" && "bg-foreground text-white hover:bg-foreground/90"
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
                  viewType === "list" && "bg-foreground text-white hover:bg-foreground/90"
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
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Por nome {sortBy === "name" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>
                  Por tamanho {sortBy === "size" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("type")}>
                  Por tipo {sortBy === "type" && "•"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <span>{filteredDocuments.length} documentos</span>
          {showFavoritesOnly && (
            <span className="flex items-center gap-1 text-foreground">
              Favoritos apenas
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "h-6 px-2 text-xs rounded-full ml-auto",
              showFavoritesOnly && "bg-foreground text-white hover:bg-foreground/90"
            )}
          >
            ⭐ Favoritos
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-card border border-border/30 rounded-2xl p-4 hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer group"
              >
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {getFileIcon(doc.type)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedDocument(doc);
                        setPreviewOpen(true);
                      }}>
                        <Eye size={14} className="mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedDocument(doc);
                        setShareOpen(true);
                      }}>
                        <Share2 size={14} className="mr-2" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download size={14} className="mr-2" />
                        Baixar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy size={14} className="mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 size={14} className="mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Name */}
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
                  {doc.name}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] h-5 rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px] text-muted-foreground">
                  <span>{doc.size}</span>
                  <div className="flex items-center gap-1">
                    {doc.shared && <Globe size={10} />}
                    {doc.favorite && <span>⭐</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 cursor-pointer group border border-transparent hover:border-border/30"
              >
                <div className="p-2 rounded-lg bg-muted shrink-0">
                  {getFileIcon(doc.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {doc.name}
                    </h3>
                    {doc.favorite && <span className="text-xs">⭐</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="uppercase text-[10px] font-medium">
                      {doc.type}
                    </span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {doc.modifiedAt}
                    </span>
                    {doc.shared && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe size={10} />
                          Compartilhado
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full shrink-0"
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedDocument(doc);
                      setPreviewOpen(true);
                    }}>
                      <Eye size={14} className="mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedDocument(doc);
                      setShareOpen(true);
                    }}>
                      <Share2 size={14} className="mr-2" />
                      Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download size={14} className="mr-2" />
                      Baixar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy size={14} className="mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 size={14} className="mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">Nenhum documento encontrado</p>
            <p className="text-xs text-muted-foreground">Comece a adicionar documentos clicando em "Novo Documento"</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar: {selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-8 min-h-96 flex items-center justify-center">
            <div className="text-center">
              <File size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Visualizacao indisponivel</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(false)}
              className="rounded-full"
            >
              Fechar
            </Button>
            <Button className="rounded-full bg-foreground text-white hover:bg-foreground/90">
              <Download size={14} className="mr-2" />
              Baixar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar documento</DialogTitle>
            <DialogDescription>
              {selectedDocument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
              <p>Link de compartilhamento:</p>
              <p className="mt-2 font-mono text-foreground">
                https://ata360.com/docs/{selectedDocument?.id}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permissoes</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>Visualizar apenas</option>
                <option>Editar</option>
                <option>Commentar</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShareOpen(false)}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button className="rounded-full bg-foreground text-white hover:bg-foreground/90">
              Compartilhar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
