import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/bookings/[id] - update status or notes
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { estado_id, notas, precio_ajustado } = body;

    const precioParsed = precio_ajustado === '' || precio_ajustado === null || isNaN(Number(precio_ajustado)) 
      ? null 
      : Number(precio_ajustado);

    const updated = await (prisma.cita as any).update({
      where: { id },
      data: {
        ...(estado_id !== undefined && { estado_id }),
        ...(notas !== undefined && { notas }),
        ...(precio_ajustado !== undefined && { precio_ajustado: precioParsed }),
      },
      include: { cliente: true, servicio: true },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await (prisma.cita as any).delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la cita' }, { status: 500 });
  }
}
