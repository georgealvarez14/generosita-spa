import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/services/[id] - update a service
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { nombre, precio, duracion } = body;

    const updated = await prisma.servicio.update({
      where: { id: params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(duracion !== undefined && { duracion: Number(duracion) }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 });
  }
}

// DELETE /api/services/[id] - delete a service
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.servicio.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}
