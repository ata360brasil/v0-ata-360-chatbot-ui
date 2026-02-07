"use client";

import { useRouter } from "next/navigation";
import { HistoryPage } from "@/components/history-page";
import { useAppContext } from "@/contexts/app-context";

export default function HistoryRoute() {
  const router = useRouter();
  const { resetChat } = useAppContext();

  const handleNewConversation = () => {
    resetChat();
    router.push("/");
  };

  return <HistoryPage onNewConversation={handleNewConversation} />;
}
