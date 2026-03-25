import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const { nombre, precio, duracion } = body;

    if (!nombre || precio === undefined || duracion === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y duración son obligatorios' }, { status: 400 });
    }

    const servicio = await prisma.servicio.create({
      data: { nombre, precio: Number(precio), duracion: Number(duracion) }
    });

    return NextResponse.json(servicio, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}
