import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileQuestion className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-6">
        A página que você procura não existe ou foi movida.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  )
}
