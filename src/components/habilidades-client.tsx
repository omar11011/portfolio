'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Code2,
  Wrench,
  Briefcase,
  Heart,
  Award,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/page-layout'

interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon: string
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

const skillCategories = [
  { key: 'all', label: 'Todas', icon: Award },
  { key: 'frontend', label: 'Frontend', icon: Code2 },
  { key: 'backend', label: 'Backend', icon: Wrench },
  { key: 'tools', label: 'Herramientas', icon: Briefcase },
  { key: 'soft', label: 'Habilidades Blandas', icon: Heart },
]

const BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const nameToDevicon: Record<string, string> = {
  'react': 'react', 'reactjs': 'react', 'next.js': 'nextjs', 'nextjs': 'nextjs',
  'typescript': 'typescript', 'javascript': 'javascript', 'tailwind css': 'tailwindcss',
  'tailwindcss': 'tailwindcss', 'html': 'html5', 'html5': 'html5', 'html/css': 'html5',
  'css': 'css3', 'css3': 'css3', 'node.js': 'nodejs', 'nodejs': 'nodejs',
  'python': 'python', 'postgresql': 'postgresql', 'mysql': 'mysql', 'mongodb': 'mongodb',
  'graphql': 'graphql', 'docker': 'docker', 'git': 'git', 'aws': 'amazonwebservices',
  'azure': 'azure', 'google cloud': 'googlecloud', 'figma': 'figma', 'angular': 'angular',
  'vue': 'vuejs', 'vue.js': 'vuejs', 'vuejs': 'vuejs', 'svelte': 'svelte', 'java': 'java',
  'c#': 'csharp', 'csharp': 'csharp', '.net': 'dotnet', 'dotnet': 'dotnet', 'rust': 'rust',
  'go': 'go', 'golang': 'go', 'php': 'php', 'ruby': 'ruby', 'swift': 'swift', 'kotlin': 'kotlin',
  'flutter': 'flutter', 'dart': 'dart', 'redux': 'redux', 'webpack': 'webpack', 'vite': 'vite',
  'jest': 'jest', 'nginx': 'nginx', 'redis': 'redis', 'firebase': 'firebase', 'supabase': 'supabase',
  'vercel': 'vercel', 'linux': 'linux', 'ubuntu': 'ubuntu', 'debian': 'debian', 'windows': 'windows8',
  'macos': 'apple', 'android': 'android', 'ios': 'apple', 'spring': 'spring', 'django': 'django',
  'flask': 'flask', 'fastapi': 'fastapi', 'express': 'express', 'nestjs': 'nestjs', 'laravel': 'laravel',
  'rails': 'rails', 'sass': 'sass', 'less': 'less', 'bootstrap': 'bootstrap', 'materialui': 'materialui',
  'three.js': 'threejs', 'threejs': 'threejs', 'unity': 'unity', 'unreal': 'unrealengine',
  'github actions': 'githubactions', 'githubactions': 'githubactions', 'jira': 'jira',
  'confluence': 'confluence', 'slack': 'slack', 'discord': 'discordjs', 'vscode': 'vscode',
  'vim': 'vim', 'intellij': 'intellij', 'terraform': 'terraform', 'kubernetes': 'kubernetes',
  'jenkins': 'jenkins', 'elasticsearch': 'elasticsearch', 'storybook': 'storybook', 'yarn': 'yarn',
  'npm': 'npm', 'pnpm': 'pnpm', 'bun': 'bun', 'deno': 'deno', 'prisma': 'prisma', 'stripe': 'stripe',
  'woocommerce': 'woocommerce', 'wordpress': 'wordpress', 'shopify': 'shopify', 'blender': 'blender',
  'gimp': 'gimp', 'photoshop': 'photoshop', 'illustrator': 'illustrator', 'aftereffects': 'aftereffects',
  'premierepro': 'premierepro',
}

function resolveDeviconName(skill: { icon: string; name: string }): string | null {
  if (skill.icon && skill.icon.trim()) {
    const normalized = skill.icon.toLowerCase().trim()
    if (nameToDevicon[normalized]) return nameToDevicon[normalized]
    return normalized
  }
  const nameKey = skill.name.toLowerCase().trim()
  if (nameToDevicon[nameKey]) return nameToDevicon[nameKey]
  for (const [key, value] of Object.entries(nameToDevicon)) {
    if (nameKey.includes(key) || key.includes(nameKey)) return value
  }
  return null
}

function getDeviconUrls(deviconName: string): string[] {
  if (!deviconName) return []
  return [
    `${BASE}/${deviconName}/${deviconName}-plain.svg`,
    `${BASE}/${deviconName}/${deviconName}-original.svg`,
    `${BASE}/${deviconName}/${deviconName}-plain-wordmark.svg`,
    `${BASE}/${deviconName}/${deviconName}-original-wordmark.svg`,
  ]
}

function getInitials(name: string): string {
  return name.split(/[\s\-_.]/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const categoryColors: Record<string, string> = {
  frontend: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
  backend: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
  tools: 'from-orange-500/10 to-amber-500/10 border-orange-500/20',
  soft: 'from-pink-500/10 to-rose-500/10 border-pink-500/20',
}

function SkillIcon({ skill, className }: { skill: Skill; className?: string }) {
  const [urlIndex, setUrlIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const deviconName = resolveDeviconName({ icon: skill.icon, name: skill.name })
  const urls = deviconName ? getDeviconUrls(deviconName) : []

  if (!deviconName || urls.length === 0 || failed) {
    return (
      <div className={`${className || 'w-full h-full'} rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-sm`}>
        {getInitials(skill.name)}
      </div>
    )
  }

  return (
    <img
      src={urls[urlIndex]}
      alt={skill.name}
      className={`${className || 'w-full h-full'} object-contain p-1`}
      onError={() => {
        if (urlIndex < urls.length - 1) {
          setUrlIndex(urlIndex + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

interface HabilidadesClientProps {
  profile: Profile | null
  skills: Skill[]
}

export function HabilidadesClient({ profile, skills }: HabilidadesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredSkills = skills
    .filter((s) => activeFilter === 'all' || s.category === activeFilter)
    .filter(
      (s) =>
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const categoryStats = skillCategories.slice(1).map((cat) => ({
    ...cat,
    count: skills.filter((s) => s.category === cat.key).length,
  }))

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
            <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">Competencias</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Mis <span className="text-gold-gradient">Habilidades</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Tecnologías, herramientas y competencias que domino para crear soluciones completas.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-6 mt-10">
            {categoryStats.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.key} className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <Icon className="h-4 w-4 text-gold" />
                    <p className="text-2xl font-bold text-gold-gradient">{cat.count}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{cat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar habilidades..." className="pl-10 bg-card/50 border-gold/10 focus:border-gold/30" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {skillCategories.map((cat) => {
              const Icon = cat.icon
              const count = cat.key === 'all' ? skills.length : skills.filter((s) => s.category === cat.key).length
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
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {filteredSkills.map((skill, index) => {
              const catColor = categoryColors[skill.category] || 'from-gold/10 to-gold/5 border-gold/20'
              const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`

              return (
                <div key={skill.id} className={`animate-fade-in-up ${staggerClass}`}>
                  <div className={`skill-icon-card flex flex-col items-center justify-center w-24 md:w-28 h-28 md:h-32 rounded-xl bg-gradient-to-br ${catColor} border backdrop-blur-sm p-3 group cursor-default`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-2">
                      <SkillIcon skill={skill} />
                    </div>
                    <span className="text-xs md:text-sm text-foreground text-center font-medium leading-tight line-clamp-2">
                      {skill.name}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in text-center py-20 text-muted-foreground">
            <Award className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No se encontraron habilidades</p>
            <Button variant="outline" size="sm" className="mt-4 border-gold/20 text-gold hover:bg-gold/10" onClick={() => { setActiveFilter('all'); setSearchQuery('') }}>Ver todas</Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
