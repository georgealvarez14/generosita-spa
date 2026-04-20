import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatHoraFromDate } from '@/lib/bookingUtils';
import type { CitaConRelaciones } from '@/types';

/**
 * GET /api/notify
 *
 * Designed to be called by a scheduled cron job. Returns all appointments in
 * the next 24 hours with pre-built WhatsApp reminder links.
 * Protected by CRON_SECRET to prevent unauthorised access.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const citasProximas = await prisma.cita.findMany({
      where: {
        fecha: { gte: now, lte: in24h },
        estado_id: 1,
      },
      include: { cliente: true, servicios: true },
      orderBy: { fecha: 'asc' },
    }) as unknown as CitaConRelaciones[];

    const recordatorios = citasProximas.map((cita) => {
      // timeZone: 'UTC' ensures we format the DATE column's stored day,
      // not the server-local day (which can drift by one in non-UTC zones).
      const fecha = cita.fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        timeZone: 'UTC',
      });
      const hora = formatHoraFromDate(cita.hora);
      const nombresServicios = cita.servicios.map((s) => s.nombre).join(', ');
      const mensaje = encodeURIComponent(
        `Hola ${cita.cliente.nombre} 💜 Te recordamos tu cita en Generosita SPA mañana ${fecha} a las ${hora} para tus servicios: ${nombresServicios}. ¡Te esperamos!`,
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
