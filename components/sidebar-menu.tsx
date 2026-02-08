"use client";

import React, { useState } from "react";
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
  LayoutDashboard,
  Brain,
  Rocket,
  FileSignature,
  Users,
  FolderOpen,
  History,
  Settings,
  ChevronRight,
  Power,
  X,
  Star,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsModal } from "@/components/settings-modal";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick?: (itemId: string) => void;
}

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { 
    id: "assistants", 
    icon: Brain, 
    label: "Meus Assistentes", 
    description: "Assistentes inteligentes personalizados" 
  },
  { 
    id: "processes", 
    icon: Rocket, 
    label: "Processos em andamento", 
    description: "Processos de compras e licitações",
    badge: "12"
  },
  { 
    id: "contracts", 
    icon: FileSignature, 
    label: "Contratos vigentes", 
    description: "Contratos ativos do PNCP",
    badge: "5"
  },
  { 
    id: "team", 
    icon: Users, 
    label: "Equipe Interna", 
    description: "Gerenciar equipe e permissões" 
  },
  { 
    id: "files", 
    icon: FolderOpen, 
    label: "Arquivo pessoal", 
    description: "Documentos pessoais" 
  },
  { 
    id: "history", 
    icon: History, 
    label: "Histórico de conversas", 
    description: "Histórico de conversas" 
  },
];

export function SidebarMenu({ isOpen, onClose, onMenuItemClick }: SidebarMenuProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [satisfactionStars, setSatisfactionStars] = useState(0);
  const [satisfactionHover, setSatisfactionHover] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const userName = "Bernardo";

  // Dashboard roles: "superadm" | "suporte" | "localadm" | "demo"
  const userRole = "superadm" as const;

  const dashboardConfig = {
    superadm: { label: "Dashboard", badge: "SuperADM", badgeColor: "bg-primary text-white" },
    suporte: { label: "Dashboard", badge: "Suporte", badgeColor: "bg-emerald-600 text-white" },
    localadm: { label: "Dashboard", badge: "LocalADM", badgeColor: "bg-foreground/10 text-foreground" },
    demo: { label: "Dashboard", badge: "DEMO", badgeColor: "bg-amber-500 text-white" },
  };

  const currentDashboard = dashboardConfig[userRole];

  const handleLogoutClick = () => {
    setLogoutModal(true);
    setSatisfactionStars(0);
    setSatisfactionHover(0);
    setShowThankYou(false);
    setLinkCopied(false);
  };

  const handleConfirmLogout = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setLogoutModal(false);
    }, 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://ata360.com.br");
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "h-full bg-background border-r border-border/40 transition-panel flex flex-col",
          isOpen ? "w-72 sm:w-80" : "w-0 overflow-hidden"
        )}
      >
        {isOpen && (
          <>
            {/* Menu Header - Dashboard */}
            <div className="p-3 border-b border-border/40">
              <Button
                variant="ghost"
                onClick={() => onMenuItemClick?.("dashboard")}
                className="justify-between h-10 px-3 rounded-full hover:bg-muted cursor-pointer w-full group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <LayoutDashboard className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    {currentDashboard.label}
                  </span>
                  <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide", currentDashboard.badgeColor)}>
                    {currentDashboard.badge}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            {/* Main Menu Items */}
            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-2">
                <nav className="flex flex-col gap-0.5">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => onMenuItemClick?.(item.id)}
                        className="justify-between h-10 px-3 rounded-full hover:bg-muted cursor-pointer w-full group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComponent className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.badge && (
                            <span className="size-5 text-[10px] font-medium text-background bg-foreground rounded-full flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </ScrollArea>

            {/* Footer - User Profile */}
            <div className="p-3 border-t border-border/40">
              {/* User Info */}
              <div className="flex items-center gap-3 p-2 rounded-full hover:bg-muted cursor-pointer transition-colors group">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src="/images/bernardo-aguiar.jpg" alt="Foto do usuário" />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    BA
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Bernardo Aguiar
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    ATA360
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettingsOpen(true);
                        }}
                        className="size-8 rounded-full hover:bg-accent cursor-pointer"
                      >
                        <Settings className="size-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>Configurações</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogoutClick();
                        }}
                        className="size-8 rounded-full bg-red-600 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-muted cursor-pointer"
                      >
                        <Power className="size-4 text-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>Sair do ATA360</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !showThankYou && setLogoutModal(false)}
          />
          <div className="relative bg-background border border-border/50 rounded-2xl w-[90vw] max-w-sm shadow-lg">
            {showThankYou ? (
              /* Thank you screen */
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-semibold text-foreground">
                  Agradecemos você, {userName}, por confiar e fazer parte do ATA360.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Obrigado!
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Power className="size-4 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">SAIR DO ATA360</span>
                  </div>
                  <button
                    onClick={() => setLogoutModal(false)}
                    className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 py-5 space-y-5">
                  {/* Satisfaction */}
                  <div>
                    <p className="text-xs text-foreground font-medium mb-3">
                      Qual seu nível de satisfação com o ATA360, hoje?
                    </p>
                    <div className="flex items-center gap-1.5 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSatisfactionStars(star)}
                          onMouseEnter={() => setSatisfactionHover(star)}
                          onMouseLeave={() => setSatisfactionHover(0)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "size-6 transition-colors",
                              (satisfactionHover || satisfactionStars) >= star
                                ? "text-foreground fill-foreground"
                                : "text-border"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    {satisfactionStars > 0 && (
                      <p className="text-[11px] text-muted-foreground text-center mt-1.5">
                        {satisfactionStars === 1 && "Insatisfeito"}
                        {satisfactionStars === 2 && "Regular"}
                        {satisfactionStars === 3 && "Bom"}
                        {satisfactionStars === 4 && "Muito bom"}
                        {satisfactionStars === 5 && "Excelente"}
                      </p>
                    )}
                  </div>

                  {/* Share */}
                  <div className="border-t border-border/30 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium">
                          Compartilhe o ATA360
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Juntos estamos transformando as compras públicas.
                        </p>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="size-9 rounded-full border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer shrink-0 ml-3"
                      >
                        {linkCopied ? (
                          <Check className="size-3.5 text-foreground" />
                        ) : (
                          <Share2 className="size-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {linkCopied && (
                      <p className="text-[10px] text-muted-foreground text-right mt-1">Link copiado</p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 px-5 py-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    onClick={() => setLogoutModal(false)}
                    className="h-10 flex-1 max-w-[160px] rounded-full border-border/60 bg-transparent hover:bg-muted/50 text-sm font-medium cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmLogout}
                    className="h-10 flex-1 max-w-[160px] rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer"
                  >
                    Sair
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
