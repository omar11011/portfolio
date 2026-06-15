import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    let profile = await db.profile.findFirst();
    if (!profile) {
      profile = await db.profile.create({ data: {} });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    let profile = await db.profile.findFirst();
    if (!profile) {
      profile = await db.profile.create({ data });
    } else {
      profile = await db.profile.update({
        where: { id: profile.id },
        data,
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
