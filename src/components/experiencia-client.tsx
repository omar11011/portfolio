'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/page-layout'

interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
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

interface ExperienciaClientProps {
  profile: Profile | null
  experience: Experience[]
}

export function ExperienciaClient({ profile, experience }: ExperienciaClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExperience = experience.filter(
    (e) =>
      searchQuery === '' ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">Trayectoria</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Mi <span className="text-gold-gradient">Experiencia</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Mi recorrido profesional, los roles que he desempeñado y las empresas donde he crecido.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{experience.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Experiencias</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{experience.filter((e) => e.current).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Actual</p>
            </div>
            <div className="h-8 w-px bg-gold/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{new Set(experience.map((e) => e.company)).size}</p>
              <p className="text-xs text-muted-foreground mt-1">Empresas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por rol, empresa o descripción..." className="pl-10 bg-card/50 border-gold/10 focus:border-gold/30" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredExperience.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gold/20" />

            {filteredExperience.map((exp, index) => {
              const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`
              return (
                <div key={exp.id} className={`animate-fade-in-up ${staggerClass} relative pl-12 md:pl-20 pb-12 last:pb-0`}>
                  <div className="absolute left-2.5 md:left-6.5 top-2 h-3 w-3 rounded-full bg-gold border-2 border-background ring-2 ring-gold/30" />
                  {exp.current && (
                    <div className="absolute left-1 md:left-5 top-0.5 h-5 w-5 rounded-full bg-green-500/20 animate-pulse" />
                  )}

                  <Card className="card-hover bg-card/50 border-gold/10">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-gold text-lg">{exp.role}</CardTitle>
                          <p className="text-foreground/80 text-base font-medium mt-0.5">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {exp.current && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs border-0">Actual</Badge>
                          )}
                          <Badge variant="outline" className="border-gold/20 text-muted-foreground text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {exp.startDate} — {exp.endDate || 'Presente'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in text-center py-20 text-muted-foreground">
            <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No se encontraron experiencias</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
            <Button variant="outline" size="sm" className="mt-4 border-gold/20 text-gold hover:bg-gold/10" onClick={() => setSearchQuery('')}>Ver todas</Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
