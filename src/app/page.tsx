import { db } from '@/lib/db'
import { HomeClient } from '@/components/home-client'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [profile, education, experience, projects, blogPosts, skills] = await Promise.all([
    db.profile.findFirst().then(p => p || null),
    db.education.findMany({ orderBy: { order: 'asc' } }),
    db.experience.findMany({ orderBy: { order: 'asc' } }),
    db.project.findMany({ orderBy: { order: 'asc' } }),
    db.blogPost.findMany({ orderBy: { createdAt: 'desc' } }).then(posts => posts.filter(p => p.published)),
    db.skill.findMany({ orderBy: { order: 'asc' } }),
  ])

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  const serializedEducation = education.map(e => ({
    ...e,
    createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
    updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
  }))

  const serializedExperience = experience.map(e => ({
    ...e,
    createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
    updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
  }))

  const serializedProjects = projects.map(p => ({
    ...p,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
  }))

  const serializedBlogPosts = blogPosts.map(p => ({
    ...p,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
  }))

  const serializedSkills = skills.map(s => ({
    ...s,
  }))

  return (
    <HomeClient
      profile={serializedProfile}
      education={serializedEducation}
      experience={serializedExperience}
      projects={serializedProjects}
      blogPosts={serializedBlogPosts}
      skills={serializedSkills}
    />
  )
}
