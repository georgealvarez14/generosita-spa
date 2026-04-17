import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const descripcion = formData.get('descripcion') as string | null;

    if (!file) return NextResponse.json({ error: 'No se envió un archivo' }, { status: 400 });
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `galeria/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { data: storageData, error: storageError } = await supabase.storage
      .from('generosita')
      .upload(filename, bytes, { contentType: file.type, upsert: false });

    if (storageError) {
      console.error('Storage error:', storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('generosita').getPublicUrl(storageData.path);

    const entry = await prisma.galeria.create({
      data: { imagen_url: publicUrl, descripcion: descripcion || null },
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
