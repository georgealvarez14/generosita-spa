import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, telefono, email, fecha, hora, servicioId, notas } = body;

    if (!nombre || !telefono || !fecha || !hora || !servicioId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const timeDate = new Date(`1970-01-01T${hora}:00Z`);
    const [reqHours, reqMins] = hora.split(':').map(Number);
    const reqStartMin = reqHours * 60 + reqMins;
    
    // Obtenemos el servicio solicitado para saber su duración
    const servicioSolicitado = await prisma.servicio.findUnique({ where: { id: servicioId }});
    const duracionSolicitada = servicioSolicitado?.duracion || 60;
    const reqEndMin = reqStartMin + duracionSolicitada;

    // Use robust date boundaries to capture all appointments that land on the same calendar day
    const baseDateString = new Date(fecha).toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayStart = new Date(`${baseDateString}T00:00:00.000Z`);
    const dayEnd = new Date(`${baseDateString}T23:59:59.999Z`);

    // Check availability against all appointments that day
    const citasDelDia = await (prisma.cita as any).findMany({
      where: {
        fecha: {
          gte: dayStart,
          lte: dayEnd
        },
        estado_id: { not: 3 } // no contar canceladas
      },
      include: { servicio: true }
    });

    const isOverlapping = citasDelDia.some((cita: any) => {
      const horaStr = cita.hora.toISOString().split('T')[1].substring(0, 5); 
      const [h, m] = horaStr.split(':').map(Number);
      const startMin = h * 60 + m;
      const endMin = startMin + (cita.servicio?.duracion || 60);
      
      return reqStartMin < endMin && reqEndMin > startMin;
    });

    if (isOverlapping) {
      return NextResponse.json({ error: 'El horario seleccionado choca con otra cita existente.' }, { status: 400 });
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
