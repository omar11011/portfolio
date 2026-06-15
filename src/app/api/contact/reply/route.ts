import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, replyToId } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    let fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    try {
      const setting = await db.setting.findUnique({ where: { key: 'email_from' } });
      if (setting?.value) fromEmail = setting.value;
    } catch { /* fallback to env */ }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `Portafolio <${fromEmail}>`,
      to,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, oklch(0.75 0.14 200), oklch(0.58 0.14 205)); padding: 24px 32px;">
            <h1 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Respuesta a tu mensaje</h1>
          </div>
          <div style="padding: 32px; color: #e2e8f0; font-size: 15px; line-height: 1.7;">
            <p style="margin: 0 0 16px;">Hola,</p>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 16px;">
              ${message.split('\n').map((line: string) => `<p style="margin: 0 0 8px;">${line || '&nbsp;'}</p>`).join('')}
            </div>
            <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px;">
              — Enviado desde el portafolio web
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 16px 32px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              Este correo fue enviado como respuesta a tu mensaje de contacto.
            </p>
          </div>
        </div>
      `,
      replyTo: fromEmail,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message || 'Error al enviar email' }, { status: 500 });
    }

    if (replyToId) {
      try {
        await db.contactMessage.update({
          where: { id: replyToId },
          data: { read: true },
        });
      } catch (dbError) {
        console.error('Error marking message as read:', dbError);
      }
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error: any) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
