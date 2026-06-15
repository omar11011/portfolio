'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Github,
  Search,
  Star,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/page-layout'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  techStack: string
  liveUrl: string
  repoUrl: string
  featured: boolean
  order: number
}

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatarUrl: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  twitter: string
  website: string
}

const projectGradients = [
  'from-gold/30 via-gold-dark/20 to-gold/10',
  'from-gold-dark/30 via-gold/15 to-gold-dark/10',
  'from-gold/20 via-gold-light/20 to-gold/15',
  'from-gold-light/25 via-gold/20 to-gold-dark/15',
]

interface ProyectosClientProps {
  profile: Profile | null
  projects: Project[]
}

export function ProyectosClient({ profile, projects }: ProyectosClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('all')

  const filteredProjects = projects
    .filter((p) => activeFilter === 'all' || (activeFilter === 'featured' && p.featured))
    .filter(
      (p) =>
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const allTechs = [...new Set(projects.flatMap((p) => p.techStack.split(',').map((t) => t.trim()).filter(Boolean)))]

  return (
    <PageLayout profileName={profile?.name}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <div className="animate-fade-in-up text-center">
            <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">Portafolio</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Mis <span className="text-gold-gradient">Proyectos</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Una colección de mis trabajos y creaciones. Cada proyecto refleja mi pasión por construir soluciones innovadoras.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{projects.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{projects.filter((p) => p.featured).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Destacados</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{allTechs.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Tecnologías</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por título, descripción o tecnología..." className="pl-10 bg-card/50 border-gold/10 focus:border-gold/30" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('all')} className={activeFilter === 'all' ? 'bg-gold text-background hover:bg-gold-light' : 'border-gold/20 text-muted-foreground hover:text-gold'}>
              <Filter className="h-3.5 w-3.5 mr-1.5" />Todos
              <span className="ml-1.5 text-xs bg-gold/10 px-1.5 py-0.5 rounded-full">{projects.length}</span>
            </Button>
            <Button variant={activeFilter === 'featured' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('featured')} className={activeFilter === 'featured' ? 'bg-gold text-background hover:bg-gold-light' : 'border-gold/20 text-muted-foreground hover:text-gold'}>
              <Star className="h-3.5 w-3.5 mr-1.5" />Destacados
              <span className="ml-1.5 text-xs bg-gold/10 px-1.5 py-0.5 rounded-full">{projects.filter((p) => p.featured).length}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`
              return (
                <div key={project.id} className={`animate-fade-in-up ${staggerClass}`}>
                  <Card className="card-hover bg-card/50 border-gold/10 overflow-hidden h-full flex flex-col group">
                    <div className="relative h-48 overflow-hidden">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${projectGradients[projects.indexOf(project) % projectGradients.length]} flex items-center justify-center`}>
                          <Code2 className="h-12 w-12 text-gold/30" />
                        </div>
                      )}
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gold/90 text-background text-xs font-semibold"><Star className="h-3 w-3 mr-1" />Destacado</Badge>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-foreground text-lg group-hover:text-gold transition-colors duration-300">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.split(',').map((tech) => (
                          <Badge key={tech.trim()} variant="outline" className="border-gold/15 text-gold/70 text-xs px-2 py-0.5">{tech.trim()}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-gold/10">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
                            <ExternalLink className="h-4 w-4" />Demo
                          </a>
                        )}
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
                            <Github className="h-4 w-4" />Código
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in text-center py-20 text-muted-foreground">
            <Code2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No se encontraron proyectos</p>
            <p className="text-sm mt-2">Intenta con otro filtro o término de búsqueda</p>
            <Button variant="outline" size="sm" className="mt-4 border-gold/20 text-gold hover:bg-gold/10" onClick={() => { setActiveFilter('all'); setSearchQuery('') }}>Ver todos</Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
