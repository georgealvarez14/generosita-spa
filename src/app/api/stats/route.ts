import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUTCDateKey } from '@/lib/bookingUtils';
import type { CitaConServicios, StatsResponse } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    // All boundaries computed in UTC to match how Prisma stores DATE columns
    // (midnight UTC). Mixing local-time math here caused off-by-one errors
    // on non-UTC servers — see CLAUDE.md "Date/Time Handling".
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);
    const dayOfWeek = todayStart.getUTCDay() || 7; // Sun=0 → 7 so Monday is week start
    const weekStart = new Date(todayStart.getTime() - (dayOfWeek - 1) * DAY_MS);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const todayKey = getUTCDateKey(todayStart);

    const [totalCitas, citasHoy, pendientes, totalClientes, totalServicios] = await Promise.all([
      prisma.cita.count(),
      prisma.cita.count({ where: { fecha: { gte: todayStart, lt: tomorrowStart } } }),
      prisma.cita.count({ where: { estado_id: 1 } }),
      prisma.cliente.count({ where: { OR: [{ rol: 'cliente' }, { rol: null }] } }),
      prisma.servicio.count(),
    ]);

    const citasParaIngresos = await prisma.cita.findMany({
      where: { estado_id: { not: 3 } },
      include: { servicios: { select: { precio: true } } },
    }) as unknown as CitaConServicios[];

    const ingresos = { hoy: 0, semana: 0, mes: 0 };

    for (const c of citasParaIngresos) {
      const basePrice = c.servicios.reduce((acc, s) => acc + Number(s.precio), 0);
      const precioFinal = basePrice - (c.precio_ajustado ?? 0);

      if (getUTCDateKey(c.fecha) === todayKey) ingresos.hoy += precioFinal;
      if (c.fecha >= weekStart) ingresos.semana += precioFinal;
      if (c.fecha >= monthStart) ingresos.mes += precioFinal;
    }

    const response: StatsResponse = {
      totalCitas,
      citasHoy,
      pendientes,
      totalClientes,
      totalServicios,
      ingresos,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
