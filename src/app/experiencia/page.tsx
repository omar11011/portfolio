import { db } from '@/lib/db'
import { ExperienciaClient } from '@/components/experiencia-client'

export const dynamic = 'force-dynamic'

export default async function ExperienciaPage() {
  const [profile, experience] = await Promise.all([
    db.profile.findFirst(),
    db.experience.findMany({ orderBy: { order: 'asc' } }),
  ])

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  const serializedExperience = experience.map(e => ({
    ...e,
    createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
    updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
  }))

  return <ExperienciaClient profile={serializedProfile} experience={serializedExperience} />
}
