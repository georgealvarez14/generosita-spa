import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          { rol: 'cliente' },
          { rol: null }
        ]
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener clientas' }, { status: 500 });
  }
}
