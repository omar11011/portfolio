'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Shield,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/educacion', label: 'Educación' },
  { href: '/experiencia', label: 'Experiencia' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/habilidades', label: 'Habilidades' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contacto', label: 'Contacto' },
]

interface NavbarProps {
  profileName?: string
}

export function Navbar({ profileName }: NavbarProps) {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname.startsWith(href)
  }

  if (pathname === '/admin') return null

  return (
    <nav
      className={`animate-slide-down fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-gold/10 shadow-lg shadow-black/20'
          : 'bg-background/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-gold-gradient text-xl md:text-2xl font-bold tracking-tight"
          >
            {profileName || 'Portafolio'}
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-gold bg-gold/10'
                    : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="animate-slide-down lg:hidden bg-background/95 backdrop-blur-xl border-b border-gold/10"
        >
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-gold bg-gold/10'
                    : 'text-muted-foreground hover:text-gold hover:bg-gold/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Separator className="bg-gold/10 my-2" />
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gold hover:bg-gold/5 rounded-lg transition-colors"
            >
              <Shield className="h-4 w-4" />
              Panel Admin
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false) }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
