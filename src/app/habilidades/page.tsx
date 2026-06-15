import { db } from '@/lib/db'
import { HabilidadesClient } from '@/components/habilidades-client'

export const dynamic = 'force-dynamic'

export default async function HabilidadesPage() {
  const [profile, skills] = await Promise.all([
    db.profile.findFirst(),
    db.skill.findMany({ orderBy: { order: 'asc' } }),
  ])

  const serializedProfile = profile ? {
    ...profile,
    updatedAt: profile.updatedAt?.toISOString?.() ?? profile.updatedAt,
  } : null

  const serializedSkills = skills.map(s => ({
    ...s,
  }))

  return <HabilidadesClient profile={serializedProfile} skills={serializedSkills} />
}
