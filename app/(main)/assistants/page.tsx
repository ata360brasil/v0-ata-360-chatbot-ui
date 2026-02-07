"use client";

import { useRouter } from "next/navigation";
import { AssistantsPage } from "@/components/assistants-page";
import { useApp } from "@/contexts/app-context";

export default function AssistantsRoute() {
  const router = useRouter();
  const { setHasStartedChat } = useApp();

  return (
    <AssistantsPage
      onSendQuestion={() => {
        setHasStartedChat(true);
        router.push("/");
      }}
      onNavigate={(section) => {
        router.push(`/${section}`);
      }}
    />
  );
}
