"use client"

import { useCallback } from "react"
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { ROUTES } from "@/lib/routes"
import { PageSkeleton } from '@/components/page-skeleton'

const HistoryPage = dynamic(
  () => import('@/components/history-page').then(mod => ({ default: mod.HistoryPage })),
  { loading: () => <PageSkeleton /> }
)

export default function HistoryRoute() {
  const router = useRouter()
  const { resetChat } = useApp()

  const handleNewConversation = useCallback(() => {
    resetChat()
    router.push(ROUTES.chat)
  }, [resetChat, router])

  return <HistoryPage onNewConversation={handleNewConversation} />
}
