'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { 
  CalendarDays, Clock, Users, Scissors, DollarSign, 
  TrendingUp, Presentation, Sparkles, X, Zap, ShieldCheck, MousePointerClick 
} from 'lucide-react';
import Link from 'next/link';
import { FadeInOnLoad, StaggerContainerOnLoad, StaggerItem } from "@/components/ui/Animations";
import { motion, AnimatePresence } from 'framer-motion'; // Asegúrate de tener framer-motion instalado

const AdminCalendar = dynamic(() => import('@/components/admin/AdminCalendar'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-purple-50 rounded-2xl" />,
});

// ... (Tus tipos Stats y Cita se mantienen igual)

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateCard, setShowUpdateCard] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setCitas(Array.isArray(c) ? c : []);
    }).finally(() => setLoading(false));

    // Verificación de versión para mostrar la tarjeta
    const hasSeenUpdate = localStorage.getItem('hasSeenViperUpdatev1.1');
    if (!hasSeenUpdate) {
      setShowUpdateCard(true);
    }
  }, []);

  const dismissUpdate = () => {
    localStorage.setItem('hasSeenViperUpdatev1.1', 'true');
    setShowUpdateCard(false);
  };

  // ... (Tus statCards se mantienen igual)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <FadeInOnLoad className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-brand-dark tracking-tight">Inicio</h1>
          <p className="text-brand-light font-medium text-sm mt-1">Resumen general de Generosita SPA</p>
        </div>
        <div className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200">
          v1.1 Stable Build
        </div>
      </FadeInOnLoad>

      {/* Tarjeta de Actualización Estilo Viper (Zinc/Negro) */}
      <AnimatePresence>
        {showUpdateCard && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden bg-zinc-900 rounded-[2rem] p-1 shadow-2xl shadow-zinc-200"
          >
            <div className="bg-zinc-900 rounded-[1.8rem] p-6 sm:p-8 relative">
              {/* Decoración de fondo sutil */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-xl border border-zinc-700">
                      <Zap className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="text-xl font-bold text-white font-outfit">Novedades del Sistema</h2>
                  </div>
                  <button 
                    onClick={dismissUpdate}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <TrendingUp className="w-4 h-4 text-brand" /> Rendimiento Pro
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Optimización de GPU para un scroll de "mantequilla" en dispositivos móviles.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <MousePointerClick className="w-4 h-4 text-brand" /> Deep Linking
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Reservas directas: el cliente ya no tiene que buscar el servicio dos veces.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-brand" /> Seguridad Viper
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Acceso blindado al panel administrativo mediante control de roles (RBAC).</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-brand" /> Interfaz App
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Nueva barra de navegación inferior táctil para una experiencia de app nativa.</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={dismissUpdate}
                    className="px-6 py-2.5 bg-white text-zinc-900 font-bold rounded-xl hover:bg-brand hover:text-white transition-all text-sm shadow-lg shadow-white/5"
                  >
                    ¡Entendido, se ve genial!
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats grid */}
      <StaggerContainerOnLoad className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ... El resto de tus stats se mantienen igual */}
      </StaggerContainerOnLoad>

      {/* ... El resto del componente se mantiene igual */}
    </div>
  );
}