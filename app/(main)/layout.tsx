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
import { Plus, Bell, PanelRight } from "lucide-react";
import { ATA360Icon } from "@/components/ata360-icon";
import { SidebarMenu } from "@/components/sidebar-menu";
import { ArtifactsPanel } from "@/components/artifacts-panel";
import { ResizableDivider } from "@/components/resizable-divider";
import { NotificationsModal } from "@/components/notifications-modal";
import { AppProvider, useApp } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

function MainShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
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

  const handleNewConversation = () => {
    resetChat();
    router.push("/");
  };

  const routeMap: Record<string, string> = {
    dashboard: "/dashboard",
    contracts: "/contracts",
    processes: "/processes",
    team: "/team",
    files: "/files",
    history: "/history",
    assistants: "/assistants",
  };

  const handleMenuItemClick = useCallback((itemId: string) => {
    router.push(routeMap[itemId] || "/");
  }, [router]);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/30 flex items-center justify-between px-4 shrink-0">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Menu Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
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
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer"
                >
                  <Plus className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nova conversa</TooltipContent>
            </Tooltip>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsModalOpen(true)}
                  className="size-10 rounded-full bg-background hover:bg-muted cursor-pointer relative"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alertas</TooltipContent>
            </Tooltip>

            {/* Artifacts Panel Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setArtifactsPanelOpen(!artifactsPanelOpen)}
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
          <SidebarMenu
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onMenuItemClick={handleMenuItemClick}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {children}
          </div>

          {/* Resizable Divider */}
          <ResizableDivider
            isVisible={artifactsPanelOpen}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />

          {/* Right Artifacts Panel */}
          <ArtifactsPanel
            isOpen={artifactsPanelOpen}
            onClose={closeArtifactsPanel}
            artifact={currentArtifact}
            width={artifactsWidth}
          />
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
