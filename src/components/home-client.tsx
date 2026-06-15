'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Send,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code2,
  BookOpen,
  Heart,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'
import { Navbar } from '@/components/navbar'

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
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
  createdAt?: string
  updatedAt?: string
}

interface Education { id: string; type: string; institution: string; title: string; startDate: string; endDate: string; description: string; certificateUrl: string; certificateName: string; order: number; createdAt?: string; updatedAt?: string }
interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; order: number; createdAt?: string; updatedAt?: string }
interface Project { id: string; title: string; description: string; imageUrl: string; techStack: string; liveUrl: string; repoUrl: string; featured: boolean; order: number; createdAt?: string; updatedAt?: string }
interface BlogPost { id: string; title: string; content: string; excerpt: string; coverImageUrl: string; published: boolean; slug: string; createdAt: string; updatedAt: string }
interface Skill { id: string; name: string; category: string; level: number; icon: string; order: number; createdAt?: string; updatedAt?: string }

const quickNavCards = [
  { href: '/educacion', label: 'Educación', description: 'Formación, certificaciones, diplomados y más', icon: GraduationCap, color: 'from-blue-500/10 to-gold/10' },
  { href: '/experiencia', label: 'Experiencia', description: 'Trayectoria profesional y laboral', icon: Briefcase, color: 'from-green-500/10 to-gold/10' },
  { href: '/proyectos', label: 'Proyectos', description: 'Trabajos y creaciones que he desarrollado', icon: Code2, color: 'from-purple-500/10 to-gold/10' },
  { href: '/habilidades', label: 'Habilidades', description: 'Tecnologías y competencias que domino', icon: Heart, color: 'from-pink-500/10 to-gold/10' },
  { href: '/blog', label: 'Blog', description: 'Artículos, reflexiones y conocimientos', icon: BookOpen, color: 'from-orange-500/10 to-gold/10' },
]

function ContactForm({ profile }: { profile: Profile | null }) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sendingContact, setSendingContact] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingContact(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: '¡Mensaje enviado!', description: 'Gracias por contactarme. Te responderé pronto.' })
        setContactForm({ name: '', email: '', subject: '', message: '' })
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo enviar el mensaje.', variant: 'destructive' })
    } finally {
      setSendingContact(false)
    }
  }

  return (
    <Card className="bg-card/50 border-gold/10 p-6 md:p-8">
      <form onSubmit={handleContactSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre <span className="text-gold">*</span></label>
            <Input placeholder="Tu nombre completo" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="bg-background/50 border-gold/15 focus:border-gold/40 focus:ring-gold/20 placeholder:text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email <span className="text-gold">*</span></label>
            <Input type="email" placeholder="tu@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="bg-background/50 border-gold/15 focus:border-gold/40 focus:ring-gold/20 placeholder:text-muted-foreground/50" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Asunto <span className="text-gold">*</span></label>
          <Input placeholder="¿En qué puedo ayudarte?" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} required className="bg-background/50 border-gold/15 focus:border-gold/40 focus:ring-gold/20 placeholder:text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Mensaje <span className="text-gold">*</span></label>
          <Textarea placeholder="Cuéntame sobre tu proyecto..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required rows={5} className="bg-background/50 border-gold/15 focus:border-gold/40 focus:ring-gold/20 placeholder:text-muted-foreground/50 resize-none" />
        </div>
        <Button type="submit" disabled={sendingContact} className="w-full bg-gold hover:bg-gold-light text-background font-semibold py-6 text-base">
          {sendingContact ? (
            <div className="h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            <><Send className="mr-2 h-5 w-5" />Enviar Mensaje</>
          )}
        </Button>
      </form>
    </Card>
  )
}

interface HomeClientProps {
  profile: Profile | null
  education: Education[]
  experience: Experience[]
  projects: Project[]
  blogPosts: BlogPost[]
  skills: Skill[]
}

export function HomeClient({ profile, education, experience, projects, blogPosts, skills }: HomeClientProps) {
  const stats = {
    education: education.length,
    experience: experience.length,
    projects: projects.length,
    skills: skills.length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar profileName={profile?.name} />

      <main className="flex-1">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-gold/3 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold/[0.02] blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="animate-fade-in">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div className="animate-fade-in-up stagger-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-110" />
                    <Avatar className="relative h-40 w-40 md:h-56 md:w-56 border-4 border-gold/30 gold-glow">
                      <AvatarImage src={profile?.avatarUrl || "/hero-image.png"} alt={profile?.name} />
                      <AvatarFallback className="bg-card text-gold text-4xl md:text-5xl font-bold">
                        {profile?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'OA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-background" />
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="animate-fade-in-up stagger-2">
                    <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">
                      Disponible para proyectos
                    </Badge>
                  </div>
                  <div className="animate-fade-in-up stagger-2">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                      <span className="text-foreground">Hola, soy </span>
                      <span className="text-gold-gradient">{profile?.name || 'Tu Nombre'}</span>
                    </h1>
                  </div>
                  <div className="animate-fade-in-up stagger-3">
                    <p className="text-xl md:text-2xl text-gold/80 font-light mb-6">{profile?.title || 'Desarrollador Full Stack'}</p>
                  </div>
                  <div className="animate-fade-in-up stagger-3">
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
                      {profile?.bio || 'Apasionado por la tecnología y la innovación.'}
                    </p>
                  </div>

                  <div className="animate-fade-in-up stagger-4">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                      {profile?.github && (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {profile?.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {profile?.twitter && profile.twitter.trim() && (
                        <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300">
                          <XIcon className="h-5 w-5" />
                        </a>
                      )}
                      {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300">
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                      {profile?.email && (
                        <a href={`mailto:${profile.email}`} className="h-11 w-11 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300">
                          <Mail className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="animate-fade-in-up stagger-4">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4 text-gold" />
                        <span><span className="text-gold font-semibold">{stats.education}</span> Formaciones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 text-gold" />
                        <span><span className="text-gold font-semibold">{stats.experience}</span> Experiencias</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Code2 className="h-4 w-4 text-gold" />
                        <span><span className="text-gold font-semibold">{stats.projects}</span> Proyectos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4 text-gold" />
                        <span><span className="text-gold font-semibold">{stats.skills}</span> Habilidades</span>
                      </div>
                    </div>
                  </div>

                  <div className="animate-fade-in-up stagger-5">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                      <Link href="/proyectos">
                        <Button className="bg-gold hover:bg-gold-light text-background font-semibold px-8 py-6 text-base">
                          Ver Proyectos
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <a href="#contacto">
                        <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold-light px-8 py-6 text-base">
                          Contáctame
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="animate-bounce-slow absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Descubre más</span>
              <ChevronDown className="h-5 w-5 text-gold" />
            </div>
          </div>
        </section>

        <div className="section-divider max-w-7xl mx-auto" />

        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in">
              <div className="animate-fade-in-up">
                <div className="text-center mb-16">
                  <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">
                    Explora
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    Conoce Más <span className="text-gold-gradient">Sobre Mí</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explora mi formación académica, experiencia profesional, proyectos, habilidades y artículos.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 max-w-6xl mx-auto">
                {quickNavCards.map((card, index) => {
                  const Icon = card.icon
                  const staggerClass = `stagger-${Math.min(index + 1, 6)}`
                  return (
                    <div key={card.href} className={`animate-fade-in-up ${staggerClass}`}>
                      <Link href={card.href}>
                        <Card className="card-hover bg-card/50 border-gold/10 h-full group cursor-pointer relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          <CardHeader className="relative z-10 text-center pb-2">
                            <div className="h-14 w-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
                              <Icon className="h-7 w-7 text-gold" />
                            </div>
                            <CardTitle className="text-foreground text-lg group-hover:text-gold transition-colors">
                              {card.label}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="relative z-10 text-center pt-0">
                            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                              Explorar <ArrowRight className="h-3 w-3" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider max-w-7xl mx-auto" />

        <section id="contacto" className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in">
              <div className="animate-fade-in-up">
                <div className="text-center mb-16">
                  <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">
                    Conectemos
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                    <span className="text-gold-gradient">Contacto</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    ¿Tienes un proyecto en mente? Me encantaría escucharte y colaborar juntos.
                  </p>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-5 max-w-6xl mx-auto">
                <div className="animate-fade-in-up stagger-1 lg:col-span-3">
                  <ContactForm profile={profile} />
                </div>

                <div className="animate-fade-in-up stagger-2 lg:col-span-2">
                  <div className="space-y-6 h-full flex flex-col">
                    <Card className="bg-card/50 border-gold/10 p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Información de Contacto</h3>
                      <div className="space-y-5">
                        {profile?.email && (
                          <a href={`mailto:${profile.email}`} className="flex items-center gap-4 text-muted-foreground hover:text-gold transition-colors group">
                            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors"><Mail className="h-5 w-5 text-gold" /></div>
                            <div><p className="text-xs text-muted-foreground/60 mb-0.5">Email</p><p className="text-sm">{profile.email}</p></div>
                          </a>
                        )}
                        {profile?.phone && (
                          <a href={`tel:${profile.phone}`} className="flex items-center gap-4 text-muted-foreground hover:text-gold transition-colors group">
                            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors"><Phone className="h-5 w-5 text-gold" /></div>
                            <div><p className="text-xs text-muted-foreground/60 mb-0.5">Teléfono</p><p className="text-sm">{profile.phone}</p></div>
                          </a>
                        )}
                        {profile?.location && (
                          <div className="flex items-center gap-4 text-muted-foreground group">
                            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0"><MapPin className="h-5 w-5 text-gold" /></div>
                            <div><p className="text-xs text-muted-foreground/60 mb-0.5">Ubicación</p><p className="text-sm">{profile.location}</p></div>
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="bg-card/50 border-gold/10 p-6 flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-6">Redes Sociales</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profile?.github && profile.github.trim() && (
                          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"><Github className="h-5 w-5" /><span className="text-sm">GitHub</span></a>
                        )}
                        {profile?.linkedin && profile.linkedin.trim() && (
                          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"><Linkedin className="h-5 w-5" /><span className="text-sm">LinkedIn</span></a>
                        )}
                        {profile?.twitter && profile.twitter.trim() && (
                          <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"><XIcon className="h-5 w-5" /><span className="text-sm">X</span></a>
                        )}
                        {profile?.website && profile.website.trim() && (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-lg border border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"><Globe className="h-5 w-5" /><span className="text-sm">Web</span></a>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-gold/10 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-gold-gradient text-lg font-bold mb-1">{profile?.name || 'Portafolio'}</p>
              <p className="text-sm text-muted-foreground">{profile?.title || 'Desarrollador Full Stack'}</p>
            </div>
            <div className="flex items-center gap-4">
              {profile?.github && profile.github.trim() && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors"><Github className="h-5 w-5" /></a>}
              {profile?.linkedin && profile.linkedin.trim() && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors"><Linkedin className="h-5 w-5" /></a>}
              {profile?.twitter && profile.twitter.trim() && <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors"><XIcon className="h-5 w-5" /></a>}
              {profile?.website && profile.website.trim() && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors"><Globe className="h-5 w-5" /></a>}
            </div>
            <p className="text-sm text-muted-foreground/60">© {new Date().getFullYear()} {profile?.name || 'Portafolio'}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
