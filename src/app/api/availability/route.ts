import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!startDateStr || !endDateStr) {
      return NextResponse.json({ error: 'Faltan parámetros startDate o endDate' }, { status: 400 });
    }

    // Garantizar fronteras de tiempo exactas (minuto 0 al minuto 59 del último día)
    const startDate = new Date(`${startDateStr}T00:00:00.000Z`);
    const endDate = new Date(`${endDateStr}T23:59:59.999Z`);

    const citas = await (prisma.cita as any).findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate
        },
        estado_id: { not: 3 }
      },
      include: {
        servicios: true
      }
    });

    // Agrupar ocupaciones por fecha (YYYY-MM-DD local)
    const ocupacionesPorDia: Record<string, {startMin: number, endMin: number}[]> = {};

    citas.forEach((cita: any) => {
      // cita.fecha is stored as a DATE (YYYY-MM-DD). Prisma returns it as midnight UTC.
      // Use getUTC* to get the exact calendar date stored regardless of server timezone.
      const y = cita.fecha.getUTCFullYear();
      const mo = String(cita.fecha.getUTCMonth() + 1).padStart(2, '0');
      const dy = String(cita.fecha.getUTCDate()).padStart(2, '0');
      const fechaClave = `${y}-${mo}-${dy}`;
      
      const horas = cita.hora.getHours();
      const minutos = cita.hora.getMinutes();
      
      const startMin = horas * 60 + minutos;
      const endMin = startMin + (cita.servicios?.reduce((acc: number, s: any) => acc + s.duracion, 0) || 60);

      if (!ocupacionesPorDia[fechaClave]) {
        ocupacionesPorDia[fechaClave] = [];
      }
      ocupacionesPorDia[fechaClave].push({ startMin, endMin });
    });

    return NextResponse.json({ ocupacionesPorDia });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 });
  }
}
