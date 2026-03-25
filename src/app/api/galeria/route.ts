import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all gallery images
export async function GET() {
  try {
    const images = await (prisma as any).galeria.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener la galería' }, { status: 500 });
  }
}

// DELETE a gallery image
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    // Get the record to find the storage path
    const record = await (prisma as any).galeria.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    // Extract path from public URL   e.g. .../storage/v1/object/public/generosita/galeria/...
    const url = record.imagen_url;
    const pathMatch = url.match(/\/storage\/v1\/object\/public\/generosita\/(.+)/);
    if (pathMatch) {
      await supabase.storage.from('generosita').remove([pathMatch[1]]);
    }

    await (prisma as any).galeria.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
