'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="h-10 w-10 text-gold" />
        </div>
        <h2 className="text-6xl font-bold text-gold-gradient mb-4">404</h2>
        <h3 className="text-xl font-semibold text-foreground mb-3">Página no encontrada</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          La página que buscas no existe o fue movida a otra ubicación.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-gold hover:bg-gold-light text-background font-semibold">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
          <Button variant="outline" onClick={() => router.back()} className="border-gold/30 text-gold hover:bg-gold/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  )
}
