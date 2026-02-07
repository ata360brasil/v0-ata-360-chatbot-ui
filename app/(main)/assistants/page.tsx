"use client"

import { useCallback } from "react"
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { ROUTES } from "@/lib/routes"
import { PageSkeleton } from '@/components/page-skeleton'

const AssistantsPage = dynamic(
  () => import('@/components/assistants-page').then(mod => ({ default: mod.AssistantsPage })),
  { loading: () => <PageSkeleton /> }
)

export default function AssistantsRoute() {
  const router = useRouter()
  const { setHasStartedChat } = useApp()

  const handleSendQuestion = useCallback(() => {
    setHasStartedChat(true)
    router.push(ROUTES.chat)
  }, [setHasStartedChat, router])

  const handleNavigate = useCallback((section: string) => {
    router.push(`/${section}`)
  }, [router])

  return (
    <AssistantsPage
      onSendQuestion={handleSendQuestion}
      onNavigate={handleNavigate}
    />
  )
}
