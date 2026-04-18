import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ModalidadServicio } from '@prisma/client';

const MODALIDADES: readonly ModalidadServicio[] = ['LOCAL', 'DOMICILIO', 'AMBOS'];

function parseModalidad(value: unknown): ModalidadServicio | undefined {
  return typeof value === 'string' && (MODALIDADES as readonly string[]).includes(value)
    ? (value as ModalidadServicio)
    : undefined;
}

// PATCH /api/services/[id] - update a service
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nombre, precio, duracion, modalidad } = body;

    const modalidadValue = parseModalidad(modalidad);
    if (modalidad !== undefined && modalidadValue === undefined) {
      return NextResponse.json({ error: 'Modalidad inválida' }, { status: 400 });
    }

    const updated = await prisma.servicio.update({
      where: { id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(duracion !== undefined && { duracion: Number(duracion) }),
        ...(modalidadValue !== undefined && { modalidad: modalidadValue }),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.servicio.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 });
  }
}
