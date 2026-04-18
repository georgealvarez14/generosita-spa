import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ModalidadServicio } from '@prisma/client';

const MODALIDADES: readonly ModalidadServicio[] = ['LOCAL', 'DOMICILIO', 'AMBOS'];

function parseModalidad(value: unknown): ModalidadServicio | undefined {
  return typeof value === 'string' && (MODALIDADES as readonly string[]).includes(value)
    ? (value as ModalidadServicio)
    : undefined;
}

// GET /api/services - list all services
export async function GET() {
  try {
    const services = await prisma.servicio.findMany({ orderBy: { precio: 'asc' } });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// POST /api/services - create new service
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, precio, duracion, modalidad } = body;

    if (!nombre || precio === undefined || duracion === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y duración son obligatorios' }, { status: 400 });
    }

    const modalidadValue = parseModalidad(modalidad);
    if (modalidad !== undefined && modalidadValue === undefined) {
      return NextResponse.json({ error: 'Modalidad inválida' }, { status: 400 });
    }

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        precio: Number(precio),
        duracion: Number(duracion),
        ...(modalidadValue !== undefined && { modalidad: modalidadValue }),
      },
    });

    return NextResponse.json(servicio, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
