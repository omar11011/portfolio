'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error de aplicación:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-gold" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Algo salió mal</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Ocurrió un error inesperado. Esto puede deberse a una conexión inestable o un problema temporal del servidor.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} className="bg-gold hover:bg-gold-light text-background font-semibold">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
