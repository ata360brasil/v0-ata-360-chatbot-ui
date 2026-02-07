"use client"

import dynamic from 'next/dynamic'
import { useApp } from "@/contexts/app-context"
import { PageSkeleton } from '@/components/page-skeleton'

const ChatArea = dynamic(
  () => import('@/components/chat-area').then(mod => ({ default: mod.ChatArea })),
  { loading: () => <PageSkeleton /> }
)

export default function ChatPage() {
  const { hasStartedChat, setHasStartedChat, openArtifact } = useApp()

  return (
    <ChatArea
      hasStartedChat={hasStartedChat}
      onStartChat={() => setHasStartedChat(true)}
      onOpenArtifact={openArtifact}
    />
  )
}
