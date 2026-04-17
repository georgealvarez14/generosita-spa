'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Calendar, User, Star, LogOut, ArrowRight } from 'lucide-react';
interface ClienteData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
}

export default function PortalCliente() {
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadCliente = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('cliente')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error || !data) {
        router.push('/login');
        return;
      }

      // Removimos la redirección de admin para que puedan ver su perfil

      setCliente(data);
      setLoading(false);
    };

    loadCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-purple-600 font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-purple-950 mb-3 tracking-tight">
              Mi Portal
            </h1>
            <p className="text-purple-900/60 text-lg">Bienvenida de nuevo, <span className="font-semibold text-purple-900 tracking-wide capitalize">{cliente?.nombre?.split(' ')[0]}</span> 💜</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold rounded-full transition-colors self-start sm:self-auto border border-red-100/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Mis Citas */}
          <Link
            href="/portal/citas"
            className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(20,0,50,0.03)] hover:shadow-[0_8px_30px_rgb(20,0,50,0.08)] transition-all duration-300 border border-purple-100/50 group flex flex-col items-start hover:-translate-y-1"
          >
            <div className="bg-purple-50 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
              <Calendar className="w-8 h-8 text-brand group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-purple-950 mb-2 tracking-tight">Mis Citas</h2>
            <p className="text-purple-900/60 font-medium">Ver y gestionar tus citas programadas.</p>
          </Link>

          {/* Mi Perfil */}
          <Link
            href="/portal/perfil"
            className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(20,0,50,0.03)] hover:shadow-[0_8px_30px_rgb(20,0,50,0.08)] transition-all duration-300 border border-purple-100/50 group flex flex-col items-start hover:-translate-y-1"
          >
            <div className="bg-purple-50 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
              <User className="w-8 h-8 text-brand group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-purple-950 mb-2 tracking-tight">Mi Perfil</h2>
            <p className="text-purple-900/60 font-medium">Actualizar tu información personal y cuenta.</p>
          </Link>

          {/* Nueva Reseña */}
          <Link
            href="/portal/resena"
            className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(20,0,50,0.03)] hover:shadow-[0_8px_30px_rgb(20,0,50,0.08)] transition-all duration-300 border border-purple-100/50 group flex flex-col items-start hover:-translate-y-1"
          >
            <div className="bg-purple-50 group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
              <Star className="w-8 h-8 text-brand group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-purple-950 mb-2 tracking-tight">Dejar Reseña</h2>
            <p className="text-purple-900/60 font-medium">Comparte tu experiencia con nosotros.</p>
          </Link>
        </div>

        {/* Acción Principal */}
        <div className="mt-12 bg-gradient-to-br from-purple-700 via-[#9333ea] to-pink-500 rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/20 border-dashed animate-spin-slow" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-5 tracking-tight text-balance">¿Necesitas agendar una cita?</h2>
            <p className="text-purple-100 text-lg mb-10 max-w-2xl mx-auto font-medium text-balance">
              Reserva tu próximo servicio en minutos, disfruta de nuestras promociones exclusivas y deja tus uñas hermosas hoy mismo.
            </p>
            <Link
              href="/reservar"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-purple-950 font-bold rounded-full hover:bg-purple-50 hover:scale-105 transition-all shadow-xl hover:shadow-white/20 text-lg group"
            >
              Reservar Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
