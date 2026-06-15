import { db } from '@/lib/db'
import { BlogClient } from '@/components/blog-client'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const [profile, posts] = await Promise.all([
    db.profile.findFirst(),
    db.blogPost.findMany({ orderBy: { createdAt: 'desc' } }).then(p => p.filter(post => post.published)),
  ])

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  const serializedPosts = posts.map(p => ({
    ...p,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
  }))

  return <BlogClient profile={serializedProfile} posts={serializedPosts} />
}
