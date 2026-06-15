'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Search,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageLayout } from '@/components/page-layout'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  coverImageUrl: string
  published: boolean
  slug: string
  createdAt: string
  updatedAt: string
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

const blogGradients = [
  'from-gold/30 via-gold-dark/20 to-gold/10',
  'from-gold-dark/30 via-gold/15 to-gold-dark/10',
  'from-gold/20 via-gold-light/20 to-gold/15',
  'from-gold-light/25 via-gold/20 to-gold-dark/15',
]

interface BlogClientProps {
  profile: Profile | null
  posts: BlogPost[]
}

export function BlogClient({ profile, posts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter(
    (p) =>
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Badge variant="outline" className="border-gold/30 text-gold mb-4 text-xs tracking-widest uppercase">Artículos</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Mi <span className="text-gold-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comparto conocimientos, experiencias y reflexiones sobre tecnología y desarrollo de software.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-gold-gradient">{posts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Artículos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar artículos..." className="pl-10 bg-card/50 border-gold/10 focus:border-gold/30" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => {
              const staggerClass = `stagger-${Math.min((index % 6) + 1, 6)}`
              return (
                <div key={post.id} className={`animate-fade-in-up ${staggerClass}`}>
                  <Link href={`/blog/${post.slug || post.id}`}>
                    <Card className="card-hover bg-card/50 border-gold/10 overflow-hidden h-full flex flex-col group cursor-pointer">
                      <div className="relative h-44 overflow-hidden">
                        {post.coverImageUrl ? (
                          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${blogGradients[index % blogGradients.length]} flex items-center justify-center`}>
                            <BookOpen className="h-10 w-10 text-gold/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <CardTitle className="text-foreground text-lg leading-snug group-hover:text-gold transition-colors">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                        <div className="flex items-center gap-1 text-sm text-gold group-hover:text-gold-light transition-colors">
                          Leer artículo
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="animate-fade-in text-center py-20 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No se encontraron artículos</p>
            <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
            <Button variant="outline" size="sm" className="mt-4 border-gold/20 text-gold hover:bg-gold/10" onClick={() => setSearchQuery('')}>Ver todos</Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
