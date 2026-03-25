import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, fecha, hora, servicioId, notas } = body;

    if (!nombre || !telefono || !fecha || !hora || !servicioId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const timeDate = new Date(`1970-01-01T${hora}:00Z`);

    // Check availability
    const existingCita = await (prisma.cita as any).findFirst({
      where: {
        fecha: new Date(fecha),
        hora: timeDate,
      }
    });

    if (existingCita) {
      return NextResponse.json({ error: 'El horario seleccionado ya no está disponible.' }, { status: 400 });
    }

    // Ensure client exists or create one
    let cliente = await prisma.cliente.findFirst({ where: { telefono } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nombre,
          telefono,
          email: email || null,
        }
      });
    }

    // Create the Cita
    const cita = await (prisma.cita as any).create({
      data: {
        fecha: new Date(fecha),
        hora: timeDate,
        servicio_id: servicioId,
        cliente_id: cliente.id,
        notas: notas || null,
        estado_id: 1, // 1 = pendiente en estado_cita
      },
      include: {
        servicio: true,
      }
    });

    return NextResponse.json({ success: true, cita }, { status: 201 });
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

    // 'all=true' → no date filter (used by admin citas page)
    // 'date=...' → specific date filter
    // default → future citas only
    const whereClause = all
      ? {}
      : dateQuery
        ? { fecha: new Date(dateQuery) }
        : { fecha: { gte: new Date() } };

    const bookings = await prisma.cita.findMany({
      where: whereClause,
      include: {
        cliente: true,
        servicio: true,
      },
      orderBy: [
        { fecha: 'asc' },
        { hora: 'asc' }
      ]
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Ocurrió un error al obtener las citas' }, { status: 500 });
  }
}
