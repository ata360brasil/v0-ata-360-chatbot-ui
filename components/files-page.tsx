"use client";

import React, { useState, useCallback } from "react";
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
import {
  Search,
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  FolderOpen,
  Folder,
  FolderPlus,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Upload,
  Eye,
  Download,
  Trash2,
  Edit3,
  Share2,
  Users,
  Lock,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "grid" | "list";
type SortType = "name" | "date" | "size" | "type";
type FileType = "folder" | "document" | "image" | "spreadsheet" | "archive" | "other";

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  owner: string;
  shared: boolean;
  sharedWith?: string[];
  parentFolder?: string;
  itemCount?: number;
}

const mockFiles: FileItem[] = [
  {
    id: "folder-team",
    name: "Equipe Interna",
    type: "folder",
    description: "Arquivos compartilhados com toda a equipe",
    createdAt: "01/01/2024",
    modifiedAt: "04/02/2026",
    owner: "Sistema ATA360",
    shared: true,
    sharedWith: ["Toda Equipe Interna"],
    itemCount: 32,
  },
  {
    id: "folder-1",
    name: "Documentos Pessoais",
    type: "folder",
    description: "Documentos pessoais e identificação",
    createdAt: "15/01/2024",
    modifiedAt: "02/02/2026",
    owner: "Bernardo Aguiar",
    shared: false,
    itemCount: 8,
  },
  {
    id: "folder-2",
    name: "Contratos Anteriores",
    type: "folder",
    description: "Contratos finalizados e arquivados",
    createdAt: "10/03/2024",
    modifiedAt: "28/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Maria Clara Santos", "Joao Pedro Oliveira"],
    itemCount: 15,
  },
  {
    id: "folder-3",
    name: "Modelos e Templates",
    type: "folder",
    description: "Modelos de documentos e templates padrao",
    createdAt: "05/02/2024",
    modifiedAt: "30/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Equipe Licitacoes"],
    itemCount: 12,
  },
  {
    id: "file-1",
    name: "Certidao_Negativa_Federal.pdf",
    type: "document",
    size: "245 KB",
    description: "Certidao negativa de debitos federais - validade 03/2026",
    createdAt: "20/01/2026",
    modifiedAt: "20/01/2026",
    owner: "Bernardo Aguiar",
    shared: false,
  },
  {
    id: "file-2",
    name: "Planilha_Orçamento_2026.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    description: "Planilha de orcamento anual para licitacoes 2026",
    createdAt: "05/01/2026",
    modifiedAt: "01/02/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Fernanda Costa Silva"],
  },
  {
    id: "file-3",
    name: "Logo_Orgao_Oficial.png",
    type: "image",
    size: "856 KB",
    description: "Logo oficial do orgao para uso em documentos",
    createdAt: "10/06/2024",
    modifiedAt: "10/06/2024",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Todos"],
  },
  {
    id: "file-4",
    name: "Backup_Processos_Jan2026.zip",
    type: "archive",
    size: "45.8 MB",
    description: "Backup mensal dos processos de janeiro 2026",
    createdAt: "01/02/2026",
    modifiedAt: "01/02/2026",
    owner: "Bernardo Aguiar",
    shared: false,
  },
  {
    id: "file-5",
    name: "Manual_ATA360_Usuario.pdf",
    type: "document",
    size: "3.4 MB",
    description: "Manual completo de uso do sistema ATA360",
    createdAt: "15/12/2025",
    modifiedAt: "20/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Equipe Interna"],
  },
  {
    id: "file-6",
    name: "Relatorio_Trimestral_Q4.pdf",
    type: "document",
    size: "2.1 MB",
    description: "Relatório trimestral de compras Q4 2025",
    createdAt: "10/01/2026",
    modifiedAt: "15/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Maria Clara Santos"],
  },
  {
    id: "folder-4",
    name: "Anexos Licitacoes",
    type: "folder",
    description: "Anexos e documentos complementares de licitacoes",
    createdAt: "01/01/2026",
    modifiedAt: "03/02/2026",
    owner: "Bernardo Aguiar",
    shared: false,
    itemCount: 24,
  },
  {
    id: "file-7",
    name: "Ata_Reuniao_Comissao.docx",
    type: "document",
    size: "156 KB",
    description: "Ata da reuniao da comissao de licitacao - 28/01/2026",
    createdAt: "28/01/2026",
    modifiedAt: "28/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Comissao Licitacao"],
  },
  {
    id: "file-8",
    name: "Checklist_Pregao.xlsx",
    type: "spreadsheet",
    size: "89 KB",
    description: "Checklist padrao para pregoes eletronicos",
    createdAt: "05/11/2025",
    modifiedAt: "20/01/2026",
    owner: "Bernardo Aguiar",
    shared: true,
    sharedWith: ["Pregoeiros"],
  },
];

export function FilesPage() {
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "folder":
        return Folder;
      case "document":
        return FileText;
      case "image":
        return FileImage;
      case "spreadsheet":
        return FileSpreadsheet;
      case "archive":
        return FileArchive;
      default:
        return File;
    }
  };

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Folders first
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;

    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.modifiedAt.split('/').reverse().join('-')).getTime() - 
               new Date(a.modifiedAt.split('/').reverse().join('-')).getTime();
      case "size":
        if (!a.size) return 1;
        if (!b.size) return -1;
        return parseFloat(b.size) - parseFloat(a.size);
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const folderCount = mockFiles.filter(f => f.type === "folder").length;
  const fileCount = mockFiles.filter(f => f.type !== "folder").length;
  const sharedCount = mockFiles.filter(f => f.shared).length;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDroppedFiles(files);
      setUploadModalOpen(true);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setDroppedFiles(files);
      setUploadModalOpen(true);
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-background"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="border-2 border-dashed border-foreground rounded-3xl p-16 text-center bg-muted/30 animate-in zoom-in-95 duration-200">
            <div className="size-20 mx-auto mb-4 rounded-full bg-foreground flex items-center justify-center animate-bounce">
              <Upload size={32} className="text-white" />
            </div>
            <p className="text-xl font-bold text-foreground">Solte os arquivos aqui</p>
            <p className="text-sm text-muted-foreground mt-2">Os arquivos serao enviados para sua pasta pessoal</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded-full">PDF</span>
              <span className="px-2 py-1 bg-muted rounded-full">DOC</span>
              <span className="px-2 py-1 bg-muted rounded-full">XLS</span>
              <span className="px-2 py-1 bg-muted rounded-full">IMG</span>
              <span className="px-2 py-1 bg-muted rounded-full">ZIP</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen size={20} />
            Arquivo Pessoal
          </h1>
          <div className="flex items-center gap-2">
            {/* New Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 rounded-full bg-foreground text-white hover:bg-foreground/90 h-9">
                  <Plus size={14} />
                  Novo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setNewFolderModalOpen(true)}>
                  <FolderPlus size={14} className="mr-2" />
                  Nova Pasta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload size={14} className="mr-2" />
                  Enviar Arquivo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

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
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Por nome {sortBy === "name" && "•"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Por data {sortBy === "date" && "•"}
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
        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-muted-foreground">
          <span>{folderCount} pastas</span>
          <span>{fileCount} arquivos</span>
          <span className="flex items-center gap-1">
            <Share2 size={10} />
            {sharedCount} compartilhados
          </span>
          <span className="hidden sm:flex items-center gap-3 ml-auto text-[10px]">
            <span className="flex items-center gap-1">
              <span className="size-3 rounded bg-foreground" />
              Compartilhado
            </span>
            <span className="flex items-center gap-1">
              <span className="size-3 rounded bg-muted border border-border/50" />
              Pessoal
            </span>
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por arquivo, pasta ou descricao..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {sortedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    setSelectedFile(file);
                    setDetailsModalOpen(true);
                  }}
                  className={cn(
                    "group relative border rounded-2xl p-3 transition-colors cursor-pointer",
                    file.type === "folder" && file.shared 
                      ? "bg-foreground/5 border-foreground/20 hover:bg-foreground/10" 
                      : file.type === "folder" && !file.shared
                      ? "bg-card border-border/30 hover:bg-muted/50"
                      : file.shared
                      ? "bg-muted/80 border-foreground/20 hover:bg-muted"
                      : "bg-card border-border/30 hover:bg-muted/50"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "size-12 mx-auto mb-2 rounded-2xl flex items-center justify-center",
                    file.type === "folder" && file.shared 
                      ? "bg-foreground" 
                      : file.type === "folder" && !file.shared
                      ? "bg-muted"
                      : file.shared
                      ? "bg-foreground/80"
                      : "bg-muted"
                  )}>
                    <IconComponent size={24} className={cn(
                      file.type === "folder" && file.shared ? "text-white" :
                      file.type === "folder" && !file.shared ? "text-foreground" :
                      file.shared ? "text-white" : "text-foreground"
                    )} />
                  </div>

                  {/* Name */}
                  <p className="text-xs font-medium text-foreground text-center truncate" title={file.name}>
                    {file.name}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {file.type === "folder" ? (
                      <span className="text-[10px] text-muted-foreground">{file.itemCount} itens</span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{file.size}</span>
                    )}
                    {file.shared && (
                      <Share2 size={10} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 size-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye size={12} className="mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download size={12} className="mr-2" />
                        Baixar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 size={12} className="mr-2" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 size={12} className="mr-2" />
                        Renomear
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 size={12} className="mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] text-muted-foreground font-medium">
              <div className="col-span-5">Nome</div>
              <div className="col-span-2 hidden md:block">Modificado</div>
              <div className="col-span-2 hidden lg:block">Tamanho</div>
              <div className="col-span-2 hidden sm:block">Compartilhado</div>
              <div className="col-span-1" />
            </div>

            {sortedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  onClick={() => {
                    setSelectedFile(file);
                    setDetailsModalOpen(true);
                  }}
                  className={cn(
                    "grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-2xl cursor-pointer group",
                    file.type === "folder" && file.shared 
                      ? "bg-foreground/5 hover:bg-foreground/10" 
                      : file.shared
                      ? "bg-muted/50 hover:bg-muted/80"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "size-9 shrink-0 rounded-xl flex items-center justify-center",
                      file.type === "folder" && file.shared 
                        ? "bg-foreground" 
                        : file.type === "folder" && !file.shared
                        ? "bg-muted"
                        : file.shared
                        ? "bg-foreground/80"
                        : "bg-muted"
                    )}>
                      <IconComponent size={18} className={cn(
                        file.type === "folder" && file.shared ? "text-white" :
                        file.type === "folder" && !file.shared ? "text-foreground" :
                        file.shared ? "text-white" : "text-foreground"
                      )} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{file.description}</p>
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <p className="text-xs text-muted-foreground">{file.modifiedAt}</p>
                  </div>
                  <div className="col-span-2 hidden lg:block">
                    <p className="text-xs text-muted-foreground">
                      {file.type === "folder" ? `${file.itemCount} itens` : file.size}
                    </p>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    {file.shared ? (
                      <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20 gap-1">
                        <Users size={10} />
                        {file.sharedWith?.length || 0}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20 gap-1">
                        <Lock size={10} />
                        Privado
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-full hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye size={12} className="mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download size={12} className="mr-2" />
                          Baixar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 size={12} className="mr-2" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit3 size={12} className="mr-2" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          <Trash2 size={12} className="mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* File Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {selectedFile && (
                <>
                  {React.createElement(getFileIcon(selectedFile.type), { size: 18 })}
                  Detalhes
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              {/* File Icon & Name */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-2xl">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center shrink-0",
                  selectedFile.type === "folder" ? "bg-foreground" : "bg-muted"
                )}>
                  {React.createElement(getFileIcon(selectedFile.type), {
                    size: 24,
                    className: selectedFile.type === "folder" ? "text-white" : "text-foreground"
                  })}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.type === "folder" ? `${selectedFile.itemCount} itens` : selectedFile.size}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Descricao / Uso</p>
                <p className="text-sm text-foreground">{selectedFile.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-0.5">Criado em</p>
                  <p className="font-medium text-foreground">{selectedFile.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Modificado em</p>
                  <p className="font-medium text-foreground">{selectedFile.modifiedAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Proprietario</p>
                  <p className="font-medium text-foreground">{selectedFile.owner}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Acesso</p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    {selectedFile.shared ? (
                      <>
                        <Globe size={12} />
                        Compartilhado
                      </>
                    ) : (
                      <>
                        <Lock size={12} />
                        Privado
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Shared With */}
              {selectedFile.shared && selectedFile.sharedWith && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Compartilhado com</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFile.sharedWith.map((person, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] h-5 rounded-full border-foreground/20">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button variant="outline" onClick={() => setDetailsModalOpen(false)} className="rounded-full text-xs h-9 px-6">
              Fechar
            </Button>
            {selectedFile?.type !== "folder" && (
              <Button className="rounded-full bg-foreground text-white hover:bg-foreground/90 text-xs h-9 px-6">
                <Download size={12} className="mr-1.5" />
                Baixar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Modal */}
      <Dialog open={newFolderModalOpen} onOpenChange={setNewFolderModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FolderPlus size={18} />
              Nova Pasta
            </DialogTitle>
            <DialogDescription>
              Crie uma nova pasta para organizar seus arquivos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome da pasta</label>
              <Input
                placeholder="Ex: Documentos 2026"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="h-9 rounded-2xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Descricao (opcional)</label>
              <Textarea
                placeholder="Descreva o conteudo ou uso desta pasta..."
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
                className="min-h-[60px] rounded-2xl text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button variant="outline" onClick={() => setNewFolderModalOpen(false)} className="rounded-full text-xs h-9 px-6">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setNewFolderName("");
                setNewFolderDescription("");
                setNewFolderModalOpen(false);
              }}
              disabled={!newFolderName.trim()}
              className="rounded-full bg-foreground text-white hover:bg-foreground/90 text-xs h-9 px-6"
            >
              Criar Pasta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Upload size={18} />
              Enviar Arquivo
            </DialogTitle>
            <DialogDescription>
              Adicione uma descricao para identificar o arquivo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Files List */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Arquivos selecionados</p>
              <div className="space-y-1.5 max-h-32 overflow-auto">
                {droppedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded-xl">
                    <File size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-xs text-foreground truncate flex-1">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Descricao / Uso do arquivo <span className="text-muted-foreground">(obrigatorio)</span>
              </label>
              <Textarea
                placeholder="Ex: Certidao atualizada para uso em licitacoes..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="min-h-[80px] rounded-2xl text-xs"
              />
            </div>

            {/* Folder Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Salvar em</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 h-9 rounded-2xl bg-transparent">
                    <FolderOpen size={14} />
                    Raiz (Meus Arquivos)
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <FolderOpen size={14} className="mr-2" />
                    Raiz (Meus Arquivos)
                  </DropdownMenuItem>
                  {mockFiles.filter(f => f.type === "folder").map((folder) => (
                    <DropdownMenuItem key={folder.id}>
                      <Folder size={14} className="mr-2" />
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter className="gap-3 mt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setDroppedFiles([]);
                setUploadDescription("");
                setUploadModalOpen(false);
              }}
              className="rounded-full text-xs h-9 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setDroppedFiles([]);
                setUploadDescription("");
                setUploadModalOpen(false);
              }}
              disabled={!uploadDescription.trim()}
              className="rounded-full bg-foreground text-white hover:bg-foreground/90 text-xs h-9 px-6"
            >
              Enviar {droppedFiles.length} arquivo{droppedFiles.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
