'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, User, Mail, Phone, ShieldCheck } from 'lucide-react';

interface ClienteData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
}

export default function MiPerfil() {
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

      setCliente(data);
      setLoading(false);
    };

    loadCliente();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-brand font-medium flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 lg:py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-100 hover:bg-zinc-50 hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-outfit text-zinc-800 tracking-tight">Mi Perfil</h1>
          <p className="text-zinc-500 mt-1">Consulta tus datos personales registrados</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-brand/10 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-light to-brand rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg shadow-brand/20 shrink-0">
              {cliente?.nombre?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-800">{cliente?.nombre}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full mt-2 uppercase tracking-wide">
                {cliente?.rol === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {cliente?.rol === 'admin' ? 'Administradora' : 'Clienta Estrella'}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-brand" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Correo Electrónico</span>
              </div>
              <p className="font-medium text-zinc-800 text-lg break-all">{cliente?.email}</p>
            </div>
            
            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-brand" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Teléfono de Contacto</span>
              </div>
              <p className="font-medium text-zinc-800 text-lg">{cliente?.telefono || 'No registrado'}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <p className="text-sm text-zinc-500 text-center">
              Para modificar tus datos personales, por favor contacta a soporte o escríbenos a nuestro WhatsApp. Se añadió la opción de foto de perfil a la lista de tareas futuras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
