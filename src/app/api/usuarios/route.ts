import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: clientes, error } = await supabase
      .from('cliente')
      .select('id, nombre, email, telefono, rol, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Error al obtener usuarios: ' + error.message },
        { status: 500 }
      );
    }

    // Contar por rol
    const admins = clientes?.filter(c => c.rol === 'admin') || [];
    const clientesCount = clientes?.filter(c => c.rol === 'cliente' || !c.rol) || [];

    return NextResponse.json({
      total: clientes?.length || 0,
      admins: {
        count: admins.length,
        usuarios: admins
      },
      clientes: {
        count: clientesCount.length,
        usuarios: clientesCount
      },
      todos: clientes
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error inesperado: ' + error.message },
      { status: 500 }
    );
  }
}
