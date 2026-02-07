"use client";

import { useState } from "react";
import { X, Bell, Trash2, Mail, MailOpen, AlertCircle, Newspaper, CheckSquare, Megaphone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "alert" | "message" | "news" | "task" | "system";
  title: string;
  description: string;
  date: string;
  read: boolean;
  requiresAction?: boolean; // Alertas que requerem acao nao podem ser excluidos
  details?: string; // Detalhes adicionais quando expandido
  actionLabel?: string; // Label do botao de acao (ex: "Confirmar", "Assinar", "Concluir")
  actionType?: "confirm" | "sign" | "update" | "complete" | "chat"; // Tipo de acao
}

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onNotificationsChange: (notifications: Notification[]) => void;
}

const typeConfig = {
  alert: {
    icon: AlertCircle,
    label: "Alerta",
  },
  message: {
    icon: Mail,
    label: "Mensagem",
  },
  news: {
    icon: Newspaper,
    label: "Novidade",
  },
  task: {
    icon: CheckSquare,
    label: "Tarefa",
  },
  system: {
    icon: Megaphone,
    label: "Sistema",
  },
};

export function NotificationsModal({
  open,
  onOpenChange,
  notifications,
  onNotificationsChange,
}: NotificationsModalProps) {
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteItemDialog, setDeleteItemDialog] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAction = (notification: Notification) => {
    // Marca como lida ao executar acao
    handleMarkAsRead(notification.id);
    
    // Fecha a expansao
    setExpandedId(null);
    
    // Fecha o modal e abre o chat com o contexto da notificacao
    onOpenChange(false);
    
    // TODO: Integrar com o chat LLM
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    onNotificationsChange(updated);
  };

  const handleMarkAsUnread = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: false } : n
    );
    onNotificationsChange(updated);
  };

  const handleDeleteSingle = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    // Nao permite excluir se requer acao
    if (notification?.requiresAction) {
      setDeleteItemDialog(null);
      return;
    }
    const updated = notifications.filter((n) => n.id !== id);
    onNotificationsChange(updated);
    setDeleteItemDialog(null);
  };

  const handleDeleteAll = () => {
    // Mantem apenas as notificacoes que requerem acao
    const remaining = notifications.filter((n) => n.requiresAction);
    onNotificationsChange(remaining);
    setDeleteAllDialogOpen(false);
  };

  // Contagem de notificacoes que podem ser excluidas
  const deletableCount = notifications.filter((n) => !n.requiresAction).length;
  const actionRequiredCount = notifications.filter((n) => n.requiresAction).length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-lg w-[90vw] h-[70vh] p-0 bg-background border border-border/50 rounded-2xl overflow-hidden flex flex-col"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="px-5 py-4 border-b border-border/30 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-foreground" />
                <DialogTitle className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  Notificacoes
                </DialogTitle>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-foreground text-background rounded-full">
                    {unreadCount} nao lidas
                  </span>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="size-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          </DialogHeader>

          {/* Content */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-5 py-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Nenhuma notificacao
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Voce esta em dia com todas as notificacoes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const config = typeConfig[notification.type];
                    const IconComponent = config.icon;
                    const ReadIcon = notification.read ? MailOpen : Mail;

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative p-2 rounded-lg border transition-all duration-200",
                          notification.read
                            ? "bg-background border-border/30 hover:border-border/50"
                            : "bg-muted/30 border-border/50 hover:border-border/80"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {/* Type Icon */}
                          <div className="size-8 rounded-full flex items-center justify-center shrink-0">
                            <IconComponent className="size-4 text-foreground" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-foreground text-background">
                                {config.label}
                              </span>
                              {!notification.read && (
                                <span className="size-2 rounded-full bg-foreground" />
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs mb-0.5 line-clamp-1",
                                notification.read
                                  ? "text-foreground/80"
                                  : "text-foreground font-medium"
                              )}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mb-0.5">
                              {notification.description}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70">
                              {notification.date}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                notification.read
                                  ? handleMarkAsUnread(notification.id)
                                  : handleMarkAsRead(notification.id)
                              }
                              className="size-7 rounded flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                              title={notification.read ? "Marcar como nao lida" : "Marcar como lida"}
                            >
                              <ReadIcon className="size-3.5 text-muted-foreground" />
                            </button>
                            {!notification.requiresAction ? (
                              <button
                                onClick={() => setDeleteItemDialog(notification.id)}
                                className="size-7 rounded flex items-center justify-center hover:bg-destructive/10 transition-colors cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            ) : (
                              <span
                                className="size-7 rounded flex items-center justify-center cursor-not-allowed"
                                title="Requer acao antes de excluir"
                              >
                                <Trash2 className="size-3.5 text-muted-foreground/30" />
                              </span>
                            )}
                          </div>

                          {/* Chevron expand button */}
                          <button
                            onClick={() => toggleExpand(notification.id)}
                            className="size-7 rounded flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                            title={expandedId === notification.id ? "Recolher" : "Ver detalhes"}
                          >
                            <ChevronDown
                              className={cn(
                                "size-3.5 text-muted-foreground transition-transform duration-200",
                                expandedId === notification.id && "rotate-180"
                              )}
                            />
                          </button>
                        </div>

                        {/* Expanded content */}
                        {expandedId === notification.id && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-2">
                              {notification.details || notification.description}
                            </p>
                            {notification.requiresAction && notification.actionLabel && (
                              <Button
                                onClick={() => handleAction(notification)}
                                className="h-7 px-3 text-xs rounded-full bg-foreground text-background hover:bg-foreground/90"
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                            {!notification.requiresAction && (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  onOpenChange(false);
                                }}
                                className="h-7 px-3 text-xs rounded-full bg-transparent"
                              >
                                Abrir no chat
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border/30 flex items-center justify-center gap-4 shrink-0">
            <Button
              variant="outline"
              onClick={() => setDeleteAllDialogOpen(true)}
              disabled={deletableCount === 0}
              className="h-10 flex-1 max-w-[200px] rounded-full border-border/60 text-sm font-medium bg-transparent hover:bg-muted/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Excluir Alertas
            </Button>
            <Button
              onClick={() => {
                const updated = notifications.map((n) => ({ ...n, read: true }));
                onNotificationsChange(updated);
              }}
              disabled={unreadCount === 0}
              className="h-10 flex-1 max-w-[200px] rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Marcar como lido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="!max-w-[320px] !w-[320px] p-5 rounded-xl border-border/50 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-medium text-center">
              Excluir todas as notificacoes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center">
              {actionRequiredCount > 0 ? (
                <>
                  {deletableCount} notificacoes serao removidas. {actionRequiredCount} alerta(s) que requerem acao serao mantidos.
                </>
              ) : (
                <>Esta acao nao pode ser desfeita. Todas as {notifications.length} notificacoes serao removidas.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4 sm:justify-center">
            <AlertDialogCancel className="h-9 px-5 text-sm rounded-full">Nao</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="h-9 px-5 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Single Item Confirmation Dialog */}
      <AlertDialog
        open={deleteItemDialog !== null}
        onOpenChange={(open) => !open && setDeleteItemDialog(null)}
      >
        <AlertDialogContent className="!max-w-[320px] !w-[320px] p-5 rounded-xl border-border/50 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-medium text-center">
              Excluir esta notificacao?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground text-center">
              Tem certeza que deseja excluir? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4 sm:justify-center">
            <AlertDialogCancel className="h-9 px-5 text-sm rounded-full">Nao</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemDialog && handleDeleteSingle(deleteItemDialog)}
              className="h-9 px-5 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
