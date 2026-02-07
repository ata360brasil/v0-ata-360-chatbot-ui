"use client"

import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { PageSkeleton } from '@/components/page-skeleton'

const HistoryPage = dynamic(
  () => import('@/components/history-page').then(mod => ({ default: mod.HistoryPage })),
  { loading: () => <PageSkeleton /> }
)

export default function HistoryRoute() {
  const router = useRouter()
  const { resetChat } = useApp()

  const handleNewConversation = () => {
    resetChat()
    router.push("/")
  }

  return <HistoryPage onNewConversation={handleNewConversation} />
}
