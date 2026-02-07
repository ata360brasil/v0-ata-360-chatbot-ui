"use client";

import { ChatArea } from "@/components/chat-area";
import { useAppContext } from "@/contexts/app-context";

export default function ChatPage() {
  const { hasStartedChat, setHasStartedChat, openArtifact } = useAppContext();

  return (
    <ChatArea
      hasStartedChat={hasStartedChat}
      onStartChat={() => setHasStartedChat(true)}
      onOpenArtifact={openArtifact}
    />
  );
}
