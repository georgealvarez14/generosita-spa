import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/notify
 * 
 * This endpoint is designed to be called by a scheduled cron job (e.g., from Supabase
 * pg_cron, a Vercel Cron Job, or any external scheduler).
 * 
 * It finds all appointments in the next 24 hours and returns them with the
 * WhatsApp link to send reminders. If you configure Twilio or WhatsApp
 * Business API, you can loop through results and send programmatic notifications here.
 * 
 * For MVP: This endpoint returns the appointments to notify. The admin
 * can then use the "Enviar Recordatorio" buttons in the admin panel, or
 * Supabase Edge Functions can call this and send messages automatically.
 */
export async function GET(req: Request) {
  // Secure this endpoint with a secret token
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const citasProximas = await (prisma.cita as any).findMany({
      where: {
        fecha: {
          gte: now,
          lte: in24h,
        },
        estado_id: 1,
      },
      include: {
        cliente: true,
        servicios: true,
      },
      orderBy: { fecha: 'asc' }
    });

    // Build WhatsApp reminder links for each appointment
    const recordatorios = (citasProximas as any[]).map((cita) => {
      const fecha = cita.fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'long' });
      const hora = new Date(cita.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const nombresServicios = cita.servicios?.map((s:any)=>s.nombre).join(', ');
      const mensaje = encodeURIComponent(
        `Hola ${cita.cliente.nombre} 💜 Te recordamos tu cita en Generosita SPA mañana ${fecha} a las ${hora} para tus servicios: ${nombresServicios}. ¡Te esperamos!`
      );
      return {
        cliente: cita.cliente.nombre,
        telefono: cita.cliente.telefono,
        servicios: nombresServicios,
        fecha,
        hora,
        whatsappLink: `https://wa.me/${cita.cliente.telefono}?text=${mensaje}`,
      };
    });

    return NextResponse.json({ recordatorios, total: recordatorios.length });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
