import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePrecioAjustado } from '@/lib/bookingUtils';

// PATCH /api/bookings/[id] - update status, notes or adjusted price
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json() as {
      estado_id?: number;
      notas?: string;
      precio_ajustado?: string | number | null;
    };
    const { estado_id, notas, precio_ajustado } = body;

    const updated = await prisma.cita.update({
      where: { id },
      data: {
        ...(estado_id !== undefined && { estado_id }),
        ...(notas !== undefined && { notas }),
        ...(precio_ajustado !== undefined && { precio_ajustado: parsePrecioAjustado(precio_ajustado) }),
      },
      include: { cliente: true, servicios: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar la cita' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - remove a booking
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.cita.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la cita' }, { status: 500 });
  }
}
