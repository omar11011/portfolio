import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    let currentAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    try {
      const setting = await db.setting.findUnique({ where: { key: 'admin_password' } });
      if (setting?.value) currentAdminPassword = setting.value;
    } catch { /* use env fallback */ }

    if (currentPassword !== currentAdminPassword) {
      return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 });
    }

    await db.setting.upsert({
      where: { key: 'admin_password' },
      update: { value: newPassword },
      create: { key: 'admin_password', value: newPassword },
    });

    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Error al cambiar la contraseña' }, { status: 500 });
  }
}
