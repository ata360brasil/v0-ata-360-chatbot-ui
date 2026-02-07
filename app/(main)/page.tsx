"use client";

import { ChatArea } from "@/components/chat-area";
import { useApp } from "@/contexts/app-context";

export default function ChatPage() {
  const { hasStartedChat, setHasStartedChat, openArtifact } = useApp();

  return (
    <ChatArea
      hasStartedChat={hasStartedChat}
      onStartChat={() => setHasStartedChat(true)}
      onOpenArtifact={openArtifact}
    />
  );
}
