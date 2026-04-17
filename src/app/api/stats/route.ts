import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CitaConServicios } from '@/types';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalCitas, citasHoy, pendientes, totalClientes, totalServicios] = await Promise.all([
      prisma.cita.count(),
      prisma.cita.count({ where: { fecha: { gte: today, lt: tomorrow } } }),
      prisma.cita.count({ where: { estado_id: 1 } }),
      prisma.cliente.count({ where: { OR: [{ rol: 'cliente' }, { rol: null }] } }),
      prisma.servicio.count(),
    ]);

    const citasParaIngresos = await prisma.cita.findMany({
      where: { estado_id: { not: 3 } },
      include: { servicios: { select: { precio: true } } },
    }) as unknown as CitaConServicios[];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1); // Monday
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const ingresos = { hoy: 0, semana: 0, mes: 0 };

    for (const c of citasParaIngresos) {
      const d = new Date(c.fecha);
      d.setHours(0, 0, 0, 0);
      const basePrice = c.servicios.reduce((acc, s) => acc + Number(s.precio), 0);
      const precioFinal = basePrice - (c.precio_ajustado ?? 0);

      if (d.getTime() === todayStart.getTime()) ingresos.hoy += precioFinal;
      if (d >= weekStart) ingresos.semana += precioFinal;
      if (d >= monthStart) ingresos.mes += precioFinal;
    }

    return NextResponse.json({ totalCitas, citasHoy, pendientes, totalClientes, totalServicios, ingresos });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
