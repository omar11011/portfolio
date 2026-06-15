'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Shield,
  LogOut,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/auth'
import { toast } from '@/hooks/use-toast'

const AdminPanel = dynamic(() => import('@/components/admin-panel').then(m => ({ default: m.AdminPanel })), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  ),
})

interface Profile { id: string; name: string; title: string; bio: string; avatarUrl: string; email: string; phone: string; location: string; github: string; linkedin: string; twitter: string; website: string }
interface Education { id: string; type: string; institution: string; title: string; startDate: string; endDate: string; description: string; certificateUrl: string; certificateName: string; order: number }
interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; order: number }
interface Project { id: string; title: string; description: string; imageUrl: string; techStack: string; liveUrl: string; repoUrl: string; featured: boolean; order: number }
interface BlogPost { id: string; title: string; content: string; excerpt: string; coverImageUrl: string; published: boolean; slug: string; createdAt: string; updatedAt: string }
interface Skill { id: string; name: string; category: string; level: number; icon: string; order: number }
interface ContactMessage { id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string }

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAuth()
  const router = useRouter()
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [dataLoading, setDataLoading] = useState(true)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, educationRes, experienceRes, projectsRes, blogRes, skillsRes, messagesRes] = await Promise.all([
        fetch('/api/profile'), fetch('/api/education'), fetch('/api/experience'),
        fetch('/api/projects'), fetch('/api/blog'), fetch('/api/skills'), fetch('/api/contact'),
      ])
      setProfile(await profileRes.json())
      setEducation(await educationRes.json())
      setExperience(await experienceRes.json())
      setProjects(await projectsRes.json())
      setBlogPosts(await blogRes.json())
      setSkills(await skillsRes.json())
      setMessages(await messagesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => { fetchData(); const t = setTimeout(() => setDataLoading(false), 8000); return () => clearTimeout(t) }, [fetchData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const success = await login(loginPassword)
    if (success) {
      setLoginPassword('')
      toast({ title: 'Sesión iniciada', description: 'Bienvenido al panel de administración' })
    } else {
      setLoginError('Contraseña incorrecta')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm animate-fade-in-up">

          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-gold-gradient">Panel de Administración</h1>
            <p className="text-sm text-muted-foreground mt-2">Ingresa tu contraseña para acceder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Contraseña de administrador"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError('') }}
                className="bg-card/50 border-gold/20 text-center text-lg py-6"
                autoFocus
              />
              {loginError && (
                <p className="text-destructive text-xs mt-2 text-center">{loginError}</p>
              )}
            </div>
            <Button type="submit" disabled={loginLoading} className="w-full bg-gold text-background hover:bg-gold-light py-6 text-base font-semibold">
              {loginLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-5 w-5 mr-2" />}
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse-slow">
          <Sparkles className="h-10 w-10 text-gold" />
          <p className="text-gold text-lg font-light tracking-widest uppercase">Cargando datos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Inicio
            </Link>
            <div className="h-5 w-px bg-gold/10" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gold" />
              <span className="text-gold-gradient font-bold text-lg">Admin</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-gold/20 text-muted-foreground hover:text-destructive hover:border-destructive/30">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <AdminPanel
          profile={profile}
          education={education}
          experience={experience}
          projects={projects}
          blogPosts={blogPosts}
          skills={skills}
          messages={messages}
          onDataChange={fetchData}
        />
      </main>
    </div>
  )
}
