import { db } from '@/lib/db'
import { EducacionClient } from '@/components/educacion-client'

export const dynamic = 'force-dynamic'

export default async function EducacionPage() {
  const [profile, education] = await Promise.all([
    db.profile.findFirst(),
    db.education.findMany({ orderBy: { order: 'asc' } }),
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

  return <EducacionClient profile={serializedProfile} education={serializedEducation} />
}
