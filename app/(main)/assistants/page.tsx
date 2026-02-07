"use client";

import { useRouter } from "next/navigation";
import { AssistantsPage } from "@/components/assistants-page";
import { useAppContext } from "@/contexts/app-context";

export default function AssistantsRoute() {
  const router = useRouter();
  const { setHasStartedChat } = useAppContext();

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
