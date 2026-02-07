"use client";

import { useRouter } from "next/navigation";
import { HistoryPage } from "@/components/history-page";
import { useApp } from "@/contexts/app-context";

export default function HistoryRoute() {
  const router = useRouter();
  const { resetChat } = useApp();

  const handleNewConversation = () => {
    resetChat();
    router.push("/");
  };

  return <HistoryPage onNewConversation={handleNewConversation} />;
}
