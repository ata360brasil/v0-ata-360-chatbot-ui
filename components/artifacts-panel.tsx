"use client";

import React, { useState } from "react";
import { Copy, ExternalLink } from "lucide-react"; // Import Copy and ExternalLink

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  X,
  Download,
  FileText,
  Table,
  BarChart3,
  Pencil,
  FolderPlus,
  Maximize2,
  Minimize2,
  Save,
  XCircle,
  Printer,
} from "lucide-react";

interface ArtifactsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  artifact?: ArtifactData | null;
  width?: number;
}

export interface ArtifactData {
  id: string;
  type: "table" | "document" | "chart" | "preview";
  title: string;
  content: React.ReactNode;
  editableContent?: (isEditing: boolean) => React.ReactNode;
}

export function ArtifactsPanel({ isOpen, onClose, artifact, width = 480 }: ArtifactsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getIcon = () => {
    if (!artifact) return <FileText className="size-5" />;
    switch (artifact.type) {
      case "table":
        return <Table className="size-5" />;
      case "chart":
        return <BarChart3 className="size-5" />;
      case "document":
        return <FileText className="size-5" />;
      default:
        return <FileText className="size-5" />;
    }
  };

  return (
    <TooltipProvider>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed top-14 inset-x-0 bottom-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={cn(
          "bg-background transition-all duration-300 ease-in-out flex flex-col shrink-0 border-l border-border/40",
          // Mobile: fixed overlay below header (h-14 = top-14)
          "fixed top-14 bottom-0 right-0 z-50 md:relative md:top-auto md:z-auto",
          isOpen 
            ? "translate-x-0" 
            : "translate-x-full md:hidden"
        )}
        style={{ width: isOpen ? width : undefined }}
      >
        {isOpen && artifact && (
          <>
            {/* Panel Header */}
            <div className="p-3 sm:p-4 border-b border-border/30 shrink-0">
              {/* Title Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getIcon()}
                  <h2 className="text-base font-semibold text-foreground truncate">
                    {artifact.title}
                  </h2>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(true)}
                        className="size-7 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <Maximize2 className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ampliar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="size-7 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fechar</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Version info and action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">v1.0</span>
                  {isEditing && (
                    <span className="text-amber-600 flex items-center gap-1">
                      <span className="size-1.5 bg-amber-500 rounded-full animate-pulse" />
                      Editando - alterações serão versionadas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {isEditing ? (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(false)}
                            className="size-7 rounded-full hover:bg-green-100 text-green-600 cursor-pointer"
                          >
                            <Save className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Salvar nova versão</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(false)}
                            className="size-7 rounded-full hover:bg-red-100 text-red-500 cursor-pointer"
                          >
                            <XCircle className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancelar</TooltipContent>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="size-7 rounded-full hover:bg-muted cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full hover:bg-muted cursor-pointer"
                          >
                            <Download className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Baixar</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.print()}
                            className="size-7 rounded-full hover:bg-muted cursor-pointer"
                          >
                            <Printer className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Imprimir</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full hover:bg-muted cursor-pointer"
                          >
                            <FolderPlus className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Inserir em processo</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Panel Content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-3 sm:p-4">
                {artifact.editableContent 
                  ? artifact.editableContent(isEditing) 
                  : artifact.content}
              </div>
            </ScrollArea>
          </>
        )}

        {isOpen && !artifact && (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="text-center">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base">
                Nenhum artefato para exibir
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Resultados de pesquisas e documentos aparecerão aqui
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Expanded Dialog View */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent 
          className="max-w-4xl w-[95vw] h-[90vh] p-0 bg-background border border-border/40 rounded-2xl overflow-hidden flex flex-col"
          showCloseButton={false}
        >
          {artifact && (
            <>
              {/* Expanded Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getIcon()}
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {artifact.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(false)}
                            className="size-9 rounded-full hover:bg-green-100 text-green-600 cursor-pointer"
                          >
                            <Save className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Salvar</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(false)}
                            className="size-9 rounded-full hover:bg-red-100 text-red-500 cursor-pointer"
                          >
                            <XCircle className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancelar</TooltipContent>
                      </Tooltip>
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsEditing(true)}
                          className="size-9 rounded-full hover:bg-muted cursor-pointer"
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <Download className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Baixar</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.print()}
                        className="size-9 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <Printer className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Imprimir</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <FolderPlus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Inserir em processo</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsExpanded(false)}
                        className="size-9 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <Minimize2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reduzir</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsExpanded(false);
                          setIsEditing(false);
                          onClose();
                        }}
                        className="size-9 rounded-full hover:bg-muted cursor-pointer"
                      >
                        <X className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fechar</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Expanded Content */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  {artifact.editableContent 
                    ? artifact.editableContent(isEditing) 
                    : artifact.content}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
