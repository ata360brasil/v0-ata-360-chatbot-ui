"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Plus, Bell, PanelRight, Sun, Moon } from "lucide-react";
import { ATA360Icon } from "@/components/ata360-icon";
import { SidebarMenu } from "@/components/sidebar-menu";
import { ArtifactsPanel } from "@/components/artifacts-panel";
import { ResizableDivider } from "@/components/resizable-divider";
import { NotificationsModal } from "@/components/notifications-modal";
import { AppProvider, useApp } from "@/contexts/app-context";
import { ROUTES, SIDEBAR_ROUTE_MAP } from "@/lib/routes";
import { cn } from "@/lib/utils";

function MainShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    artifactsPanelOpen,
    setArtifactsPanelOpen,
    currentArtifact,
    closeArtifactsPanel,
    artifactsWidth,
    handleResize,
    handleResizeEnd,
    resetChat,
    notifications,
    setNotifications,
    notificationsModalOpen,
    setNotificationsModalOpen,
    unreadCount,
  } = useApp();

  const handleNewConversation = useCallback(() => {
    resetChat();
    router.push(ROUTES.chat);
  }, [resetChat, router]);

  const handleMenuItemClick = useCallback((itemId: string) => {
    router.push(SIDEBAR_ROUTE_MAP[itemId] || ROUTES.chat);
  }, [router]);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:top-0 focus:left-0"
        >
          Pular para conteúdo principal
        </a>

        {/* Header */}
        <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 shrink-0" role="banner">
          {/* Left side */}
          <nav className="flex items-center gap-2" aria-label="Ações principais">
            {/* Menu Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
                  aria-expanded={sidebarOpen}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  <ATA360Icon className="size-6" color="black" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sidebarOpen ? "Fechar menu" : "Abrir menu"}</TooltipContent>
            </Tooltip>

            {/* New Conversation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNewConversation}
                  aria-label="Nova conversa"
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  <Plus className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nova conversa</TooltipContent>
            </Tooltip>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsModalOpen(true)}
                  aria-label={`Alertas${unreadCount > 0 ? ` (${unreadCount} não lidos)` : ''}`}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer relative"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center"
                      aria-live="polite"
                    >
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alertas</TooltipContent>
            </Tooltip>

            {/* Dark Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</TooltipContent>
            </Tooltip>

            {/* Artifacts Panel Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setArtifactsPanelOpen(!artifactsPanelOpen)}
                  aria-label={artifactsPanelOpen ? "Fechar artefatos" : "Abrir artefatos"}
                  aria-expanded={artifactsPanelOpen}
                  className={cn(
                    "size-10 rounded-full bg-background hover:bg-muted cursor-pointer",
                    artifactsPanelOpen && "bg-muted"
                  )}
                >
                  <PanelRight className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {artifactsPanelOpen ? "Fechar artefatos" : "Abrir artefatos"}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside aria-label="Menu de navegação">
            <SidebarMenu
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onMenuItemClick={handleMenuItemClick}
            />
          </aside>

          {/* Main Content Area */}
          <main id="main-content" className="flex-1 min-w-0 flex flex-col">
            {children}
          </main>

          {/* Resizable Divider */}
          <ResizableDivider
            isVisible={artifactsPanelOpen}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />

          {/* Right Artifacts Panel */}
          <aside aria-label="Painel de artefatos">
            <ArtifactsPanel
              isOpen={artifactsPanelOpen}
              onClose={closeArtifactsPanel}
              artifact={currentArtifact}
              width={artifactsWidth}
            />
          </aside>
        </div>

        {/* Notifications Modal */}
        <NotificationsModal
          open={notificationsModalOpen}
          onOpenChange={setNotificationsModalOpen}
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />
      </div>
    </TooltipProvider>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <MainShell>{children}</MainShell>
    </AppProvider>
  );
}
