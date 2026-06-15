'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  GraduationCap,
  Award,
  BookOpen,
  Medal,
  Trophy,
  Shield,
  FileText,
  Eye,
  Download,
  Search,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/page-layout'

interface Education {
  id: string
  type: string
  institution: string
  title: string
  startDate: string
  endDate: string
  description: string
  certificateUrl: string
  certificateName: string
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

const educationCategories = [
  { key: 'all', label: 'Todo', icon: Filter },
  { key: 'university', label: 'Universidad', icon: GraduationCap },
  { key: 'certificacion', label: 'Certificaciones', icon: Award },
  { key: 'specialization', label: 'Especializaciones', icon: Medal },
  { key: 'diploma', label: 'Diplomados', icon: BookOpen },
  { key: 'course', label: 'Cursos', icon: Shield },
  { key: 'recognition', label: 'Reconocimientos', icon: Trophy },
]

interface EducacionClientProps {
  profile: Profile | null
  education: Education[]
}

export function EducacionClient({ profile, education }: EducacionClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredEducation = education
    .filter((e) => activeFilter === 'all' || e.type === activeFilter)
    .filter(
      (e) =>
        searchQuery === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const stats = {
    total: education.length,
    withCertificate: education.filter((e) => e.certificateUrl).length,
    institutions: new Set(education.map((e) => e.institution)).size,
    categories: new Set(education.map((e) => e.type)).size,
  }

  const getTypeConfig = (type: string) => {
    return educationCategories.find((c) => c.key === type) || { key: type, label: type, icon: FileText }
  }

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
            <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">Formación</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Mi <span className="text-gold-gradient">Formación</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Toda mi formación académica, certificaciones, diplomados, especializaciones, cursos y reconocimientos en un solo lugar.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{stats.withCertificate}</p>
              <p className="text-xs text-muted-foreground mt-1">Con certificado</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{stats.institutions}</p>
              <p className="text-xs text-muted-foreground mt-1">Instituciones</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{stats.categories}</p>
              <p className="text-xs text-muted-foreground mt-1">Categorías</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por título, institución o descripción..." className="pl-10 bg-card/50 border-gold/10 focus:border-gold/30" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {educationCategories.map((cat) => {
              const Icon = cat.icon
              const count = cat.key === 'all' ? education.length : education.filter((e) => e.type === cat.key).length
              return (
                <Button key={cat.key} variant={activeFilter === cat.key ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter(cat.key)} className={activeFilter === cat.key ? 'bg-gold text-background hover:bg-gold-light' : 'border-gold/20 text-muted-foreground hover:text-gold'}>
                  <Icon className="h-3.5 w-3.5 mr-1.5" />
                  {cat.label}
                  {count > 0 && <span className="ml-1.5 text-xs bg-gold/10 px-1.5 py-0.5 rounded-full">{count}</span>}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredEducation.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEducation.map((edu, index) => {
              const typeConfig = getTypeConfig(edu.type)
              const Icon = typeConfig.icon
              const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`
              return (
                <div key={edu.id} className={`animate-fade-in-up ${staggerClass}`}>
                  <Card className="card-hover bg-card/50 border-gold/10 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="border-gold/30 text-gold text-[10px] mb-1.5">{typeConfig.label}</Badge>
                          <CardTitle className="text-gold text-base leading-snug">{edu.title}</CardTitle>
                          <CardDescription className="text-foreground/70 mt-0.5 text-sm">{edu.institution}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{edu.startDate}</span>
                        <span>—</span>
                        <span>{edu.endDate}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{edu.description}</p>
                      {edu.certificateUrl && (
                        <div className="flex items-center gap-3 pt-3 border-t border-gold/10">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-gold/20 text-gold hover:bg-gold/10 hover:text-gold-light text-xs">
                                <Eye className="h-3.5 w-3.5 mr-1.5" />Previsualizar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[85vh] bg-card border-gold/10 p-0 overflow-hidden">
                              <DialogHeader className="px-6 pt-4 pb-2 border-b border-gold/10">
                                <DialogTitle className="text-gold-gradient text-lg">{edu.title}</DialogTitle>
                                <p className="text-xs text-muted-foreground">{edu.institution} · {edu.certificateName}</p>
                              </DialogHeader>
                              <div className="flex-1 h-full">
                                <iframe src={edu.certificateUrl} className="w-full h-[calc(85vh-5rem)] border-0" title={edu.certificateName || 'Certificado'} />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <a href={edu.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors">
                            <Download className="h-3.5 w-3.5" />Descargar PDF
                          </a>
                        </div>
                      )}
                      {!edu.certificateUrl && (
                        <div className="pt-3 border-t border-gold/10">
                          <span className="text-xs text-muted-foreground/50">Sin certificado adjunto</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in text-center py-20 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No se encontraron resultados</p>
            <p className="text-sm mt-2">Intenta con otro filtro o término de búsqueda</p>
            <Button variant="outline" size="sm" className="mt-4 border-gold/20 text-gold hover:bg-gold/10" onClick={() => { setActiveFilter('all'); setSearchQuery('') }}>Ver todo</Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
