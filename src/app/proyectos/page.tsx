import { db } from '@/lib/db'
import { ProyectosClient } from '@/components/proyectos-client'

export const dynamic = 'force-dynamic'

export default async function ProyectosPage() {
  const [profile, projects] = await Promise.all([
    db.profile.findFirst(),
    db.project.findMany({ orderBy: { order: 'asc' } }),
  ])

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  const serializedProjects = projects.map(p => ({
    ...p,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() ?? p.updatedAt,
  }))

  return <ProyectosClient profile={serializedProfile} projects={serializedProjects} />
}
