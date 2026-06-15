'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ArrowLeft,
  Calendar,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/page-layout'

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse space-y-3"><div className="h-4 bg-muted/20 rounded w-3/4" /><div className="h-4 bg-muted/20 rounded w-1/2" /><div className="h-4 bg-muted/20 rounded w-2/3" /></div>,
})

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

interface BlogPostClientProps {
  post: BlogPost
  profile: Profile | null
}

export function BlogPostClient({ post, profile }: BlogPostClientProps) {
  const readingTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))

  return (
    <PageLayout profileName={profile?.name}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Blog
        </Link>

        <div className="animate-fade-in-up">
          {post.coverImageUrl && (
            <div className="relative h-48 md:h-72 lg:h-80 rounded-xl overflow-hidden mb-8">
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold" />
                {new Date(post.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold" />
                {readingTime} min de lectura
              </div>
            </div>
          </header>

          <div className="blog-content prose prose-invert prose-gold max-w-none text-muted-foreground leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/blog">
              <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Más artículos
              </Button>
            </Link>
            <Badge variant="outline" className="border-gold/20 text-muted-foreground text-xs">
              Última actualización: {new Date(post.updatedAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
