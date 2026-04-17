import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { status: 'error', message: 'Faltan variables de entorno' },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('cliente')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { status: 'error', message: 'Error de base de datos: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Conexión a Supabase exitosa'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ status: 'error', message: 'Error: ' + message }, { status: 500 });
  }
}
