'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Calendar, User, Star, LogOut, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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

      if (data.rol === 'admin') {
        router.push('/admin');
        return;
      }

      setCliente(data);
      setLoading(false);
    };

    loadCliente();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Generosita Spa"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-outfit text-lg font-bold text-purple-700">Generosita Spa</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-purple-700 hidden sm:block">Hola, {cliente?.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors bg-purple-50 px-3 py-2 rounded-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-outfit text-purple-900 mb-2">
            Mi Portal
          </h1>
          <p className="text-purple-600">Bienvenida, {cliente?.nombre}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Mis Citas */}
          <Link
            href="/portal/citas"
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all border border-purple-100 hover:border-purple-200 group"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Calendar className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Mis Citas</h2>
            <p className="text-purple-600/70 text-sm">Ver y gestionar tus citas programadas</p>
          </Link>

          {/* Mi Perfil */}
          <Link
            href="/portal/perfil"
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all border border-purple-100 hover:border-purple-200 group"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <User className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Mi Perfil</h2>
            <p className="text-purple-600/70 text-sm">Actualizar tu información personal</p>
          </Link>

          {/* Nueva Reseña */}
          <Link
            href="/portal/resena"
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-100 transition-all border border-purple-100 hover:border-purple-200 group"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Star className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Dejar Reseña</h2>
            <p className="text-purple-600/70 text-sm">Comparte tu experiencia con nosotros</p>
          </Link>
        </div>

        {/* Acción Principal */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Necesitas agendar una cita?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Reserva tu próximo servicio en minutos y deja tus manos hermosas</p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-all shadow-xl"
          >
            Reservar Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
