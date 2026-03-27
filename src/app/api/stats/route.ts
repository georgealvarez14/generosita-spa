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

    // Estimated revenue: sum of service prices ONLY for confirmed bookings (estado_id = 2)
    const citasConfirmadasConPrecio = await (prisma.cita as any).findMany({
      where: { estado_id: 2 },
      include: { servicio: { select: { precio: true } } },
    });
    const ingresoEstimado = citasConfirmadasConPrecio.reduce((sum: number, c: any) => sum + (c.servicio?.precio ?? 0), 0);

    return NextResponse.json({
      totalCitas,
      citasHoy,
      pendientes,
      totalClientes,
      totalServicios,
      ingresoEstimado,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
