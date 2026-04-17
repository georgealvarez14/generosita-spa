import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  parseTimeToMinutes,
  formatHoraFromDate,
  formatFechaFromDate,
  createNoonUTCDate,
  isTimeOverlapping,
  parsePrecioAjustado,
} from '@/lib/bookingUtils';
import type { CitaConServicios } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, fecha, hora, serviciosIds, notas, precio_ajustado } = body as {
      nombre: string;
      telefono: string;
      email?: string;
      fecha: string;
      hora: string;
      serviciosIds: string[];
      notas?: string;
      precio_ajustado?: string | number | null;
    };

    if (!nombre || !telefono || !fecha || !hora || !Array.isArray(serviciosIds) || serviciosIds.length === 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const [reqHours, reqMins] = hora.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(reqHours, reqMins, 0, 0); // exact wall-clock hours for Prisma TIME column

    const reqStartMin = parseTimeToMinutes(hora);

    const serviciosSolicitados = await prisma.servicio.findMany({ where: { id: { in: serviciosIds } } });
    const duracionSolicitada = serviciosSolicitados.reduce((acc, s) => acc + s.duracion, 0) || 60;
    const reqEndMin = reqStartMin + duracionSolicitada;

    const baseDateString = new Date(fecha).toISOString().split('T')[0];
    const dayStart = new Date(`${baseDateString}T00:00:00.000Z`);
    const dayEnd = new Date(`${baseDateString}T23:59:59.999Z`);

    const citasDelDia = await prisma.cita.findMany({
      where: {
        fecha: { gte: dayStart, lte: dayEnd },
        estado_id: { not: 3 },
      },
      include: { servicios: true },
    }) as unknown as CitaConServicios[];

    const overlapping = citasDelDia.some((cita) => {
      const horaStr = cita.hora.toISOString().split('T')[1].substring(0, 5);
      const existingStart = parseTimeToMinutes(horaStr);
      const existingEnd = existingStart + (cita.servicios.reduce((acc, s) => acc + s.duracion, 0) || 60);
      return isTimeOverlapping(reqStartMin, reqEndMin, existingStart, existingEnd);
    });

    if (overlapping) {
      return NextResponse.json({ error: 'El horario seleccionado choca con otra cita existente.' }, { status: 400 });
    }

    let cliente = await prisma.cliente.findFirst({ where: { telefono } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: { nombre, telefono, email: email || null },
      });
    }

    const cita = await prisma.cita.create({
      data: {
        fecha: createNoonUTCDate(fecha), // noon UTC prevents backward date shift
        hora: timeDate,
        servicios: { connect: serviciosIds.map((id) => ({ id })) },
        cliente_id: cliente.id,
        notas: notas || null,
        precio_ajustado: parsePrecioAjustado(precio_ajustado),
        estado_id: 1,
      },
      include: { servicios: true },
    }) as unknown as CitaConServicios;

    const safeCita = {
      ...cita,
      fecha: formatFechaFromDate(cita.fecha),
      hora: formatHoraFromDate(cita.hora),
    };

    return NextResponse.json({ success: true, cita: safeCita }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Ocurrió un error al reservar la cita' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateQuery = searchParams.get('date');
    const all = searchParams.get('all') === 'true';

    const whereClause = all
      ? {}
      : dateQuery
        ? { fecha: new Date(dateQuery) }
        : { fecha: { gte: new Date() } };

    const bookings = await prisma.cita.findMany({
      where: whereClause,
      include: { cliente: true, servicios: true },
      orderBy: [{ fecha: 'desc' }, { hora: 'desc' }],
    }) as unknown as (CitaConServicios & { cliente: { nombre: string; telefono: string; email: string | null } })[];

    const safeBookings = bookings.map((b) => ({
      ...b,
      fecha: formatFechaFromDate(b.fecha),
      hora: formatHoraFromDate(b.hora),
    }));

    return NextResponse.json(safeBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Ocurrió un error al obtener las citas' }, { status: 500 });
  }
}
