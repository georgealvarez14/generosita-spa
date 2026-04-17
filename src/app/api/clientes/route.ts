import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      where: { OR: [{ rol: 'cliente' }, { rol: null }] },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener clientas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, telefono, email } = await req.json() as {
      nombre: string; telefono: string; email?: string;
    };

    if (!nombre || !telefono) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const cliente = await prisma.cliente.create({
      data: { nombre, telefono, email: email || null, rol: 'cliente' },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una clienta con ese email.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear la clienta' }, { status: 500 });
  }
}
