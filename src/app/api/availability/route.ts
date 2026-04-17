import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUTCDateKey } from '@/lib/bookingUtils';
import type { CitaConServicios } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!startDateStr || !endDateStr) {
      return NextResponse.json({ error: 'Faltan parámetros startDate o endDate' }, { status: 400 });
    }

    const startDate = new Date(`${startDateStr}T00:00:00.000Z`);
    const endDate = new Date(`${endDateStr}T23:59:59.999Z`);

    const citas = await prisma.cita.findMany({
      where: {
        fecha: { gte: startDate, lte: endDate },
        estado_id: { not: 3 },
      },
      include: { servicios: true },
    }) as unknown as CitaConServicios[];

    const ocupacionesPorDia: Record<string, { startMin: number; endMin: number }[]> = {};

    for (const cita of citas) {
      const fechaClave = getUTCDateKey(cita.fecha);
      const startMin = cita.hora.getHours() * 60 + cita.hora.getMinutes();
      const endMin = startMin + (cita.servicios.reduce((acc, s) => acc + s.duracion, 0) || 60);

      if (!ocupacionesPorDia[fechaClave]) ocupacionesPorDia[fechaClave] = [];
      ocupacionesPorDia[fechaClave].push({ startMin, endMin });
    }

    return NextResponse.json({ ocupacionesPorDia });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Error al obtener disponibilidad' }, { status: 500 });
  }
}
