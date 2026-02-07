"use client"

import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { PageSkeleton } from '@/components/page-skeleton'

const AssistantsPage = dynamic(
  () => import('@/components/assistants-page').then(mod => ({ default: mod.AssistantsPage })),
  { loading: () => <PageSkeleton /> }
)

export default function AssistantsRoute() {
  const router = useRouter()
  const { setHasStartedChat } = useApp()

  return (
    <AssistantsPage
      onSendQuestion={() => {
        setHasStartedChat(true)
        router.push("/")
      }}
      onNavigate={(section) => {
        router.push(`/${section}`)
      }}
    />
  )
}
