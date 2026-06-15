import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { BlogPostClient } from '@/components/blog-post-client'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  let post = await db.blogPost.findUnique({ where: { slug } })
  if (!post) {
    post = await db.blogPost.findUnique({ where: { id: slug } })
  }

  if (!post || !post.published) {
    notFound()
  }

  const profile = await db.profile.findFirst()

  const serializedPost = {
    ...post,
    createdAt: post.createdAt?.toISOString?.() ?? post.createdAt,
    updatedAt: post.updatedAt?.toISOString?.() ?? post.updatedAt,
  }

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  return <BlogPostClient post={serializedPost} profile={serializedProfile} />
}
