import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalCitas, citasHoy, pendientes, totalClientes, totalServicios, servicios] = await Promise.all([
      (prisma.cita as any).count(),
      (prisma.cita as any).count({ where: { fecha: { gte: today, lt: tomorrow } } }),
      (prisma.cita as any).count({ where: { estado_id: 1 } }),
      prisma.cliente.count({
        where: {
          OR: [
            { rol: 'cliente' },
            { rol: null }
          ]
        }
      }),
      prisma.servicio.count(),
      prisma.servicio.findMany({ select: { precio: true } }),
    ]);

    // Estimated revenue: sum of prices for non-cancelled bookings (estado_id !== 3)
    const citasParaIngresos = await (prisma.cita as any).findMany({
      where: { estado_id: { not: 3 } },
      include: { servicio: { select: { precio: true } } },
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1); // Monday
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const ingresos = { hoy: 0, semana: 0, mes: 0 };

    citasParaIngresos.forEach((c: any) => {
      const d = new Date(c.fecha);
      d.setHours(0,0,0,0);
      const precioFinal = c.precio_ajustado !== null && c.precio_ajustado !== undefined 
        ? c.precio_ajustado 
        : (c.servicio?.precio ?? 0);

      if (d.getTime() === todayStart.getTime()) ingresos.hoy += precioFinal;
      if (d >= weekStart) ingresos.semana += precioFinal;
      if (d >= monthStart) ingresos.mes += precioFinal;
    });

    return NextResponse.json({
      totalCitas,
      citasHoy,
      pendientes,
      totalClientes,
      totalServicios,
      ingresos,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
