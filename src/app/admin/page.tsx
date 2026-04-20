'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { 
  CalendarDays, Clock, Users, Scissors, DollarSign, 
  TrendingUp, Presentation, Sparkles, X, Zap, ShieldCheck, MousePointerClick 
} from 'lucide-react';
import Link from 'next/link';
import { FadeInOnLoad, StaggerContainerOnLoad, StaggerItem } from "@/components/ui/Animations";
import { motion, AnimatePresence } from 'framer-motion';

const AdminCalendar = dynamic(() => import('@/components/admin/AdminCalendar'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-purple-50 rounded-2xl" />,
});

// Definición de tipos para evitar el error de TypeScript
type Stats = {
  totalCitas: number;
  citasHoy: number;
  pendientes: number;
  totalClientes: number;
  totalServicios: number;
  ingresos: {
    hoy: number;
    semana: number;
    mes: number;
  };
};

type Cita = {
  id: string; 
  fecha: string; 
  hora: string; 
  estado_id: number; 
  notas: string | null;
  cliente: { nombre: string; telefono: string };
  servicios: { nombre: string; precio: number; duracion: number }[];
};

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

    const hasSeenUpdate = localStorage.getItem('hasSeenViperUpdatev1.1');
    if (!hasSeenUpdate) {
      setShowUpdateCard(true);
    }
  }, []);

  const dismissUpdate = () => {
    localStorage.setItem('hasSeenViperUpdatev1.1', 'true');
    setShowUpdateCard(false);
  };

  const statCards = stats ? [
    { label: 'Citas Hoy', value: stats.citasHoy ?? 0, icon: CalendarDays, color: 'bg-purple-100 text-purple-700 border border-purple-200', link: '/admin/citas' },
    { label: 'Pendientes', value: stats.pendientes ?? 0, icon: Clock, color: 'bg-amber-100 text-amber-700 border border-amber-200', link: '/admin/citas' },
    { label: 'Total Clientas', value: stats.totalClientes ?? 0, icon: Users, color: 'bg-pink-100 text-pink-700 border border-pink-200', link: '/admin/clientes' },
    { label: 'Ingresos Hoy', value: `$${(stats.ingresos?.hoy ?? 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-700 border border-green-200', link: '/admin/citas' },
    { label: 'Ingresos de la Semana', value: `$${(stats.ingresos?.semana ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700 border border-emerald-200', link: '/admin/citas' },
    { label: 'Ingresos del Mes', value: `$${(stats.ingresos?.mes ?? 0).toLocaleString()}`, icon: Presentation, color: 'bg-teal-100 text-teal-700 border border-teal-200', link: '/admin/citas' },
  ] : [];

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

      {/* Tarjeta de Actualización Estilo Viper */}
      <AnimatePresence>
        {showUpdateCard && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden bg-zinc-900 rounded-[2rem] p-1 shadow-2xl shadow-zinc-200"
          >
            <div className="bg-zinc-900 rounded-[1.8rem] p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-xl border border-zinc-700">
                      <Zap className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="text-xl font-bold text-white font-outfit">Novedades del Sistema</h2>
                  </div>
                  <button onClick={dismissUpdate} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <TrendingUp className="w-4 h-4 text-brand" /> Rendimiento Pro
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Optimización de GPU para un scroll de &ldquo;mantequilla&rdquo; en dispositivos móviles.</p>
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
                    <p className="text-zinc-400 text-xs leading-relaxed">Acceso blindado mediante control de roles (RBAC).</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-brand" /> Interfaz App
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">Nueva barra de navegación inferior táctil para móviles.</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={dismissUpdate} className="px-6 py-2.5 bg-white text-zinc-900 font-bold rounded-xl hover:bg-brand hover:text-white transition-all text-sm">
                    ¡Entendido, se ve genial!
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats grid CORREGIDO */}
      <StaggerContainerOnLoad className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? [...Array(6)].map((_, i) => (
          <StaggerItem key={i} className="h-32 bg-white rounded-3xl border border-purple-50 animate-pulse" />
        )) : statCards.map(({ label, value, icon: Icon, color, link }) => (
          <StaggerItem key={label}>
            <Link href={link} className="bg-white rounded-3xl border border-purple-50/50 p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all group block">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-brand-dark tracking-tight">{value}</p>
                <p className="text-sm text-zinc-500 font-semibold mt-1">{label}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainerOnLoad>

      {/* Quick links */}
      <FadeInOnLoad delay={0.1} className="grid sm:grid-cols-3 gap-5">
        {[
          { href: '/admin/citas', label: 'Gestionar Citas', desc: 'Ver, editar y cancelar reservas', icon: CalendarDays },
          { href: '/admin/servicios', label: 'Servicios', desc: 'Agregar, editar y eliminar servicios', icon: Scissors },
          { href: '/admin/clientes', label: 'Clientas', desc: 'Ver el historial de tus clientas', icon: Users },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="bg-white rounded-3xl border border-purple-50/50 p-6 flex items-start gap-4 hover:shadow-xl transition-all group">
            <div className="shrink-0 w-12 h-12 bg-purple-50 text-brand rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-brand-dark text-base">{label}</p>
              <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">{desc}</p>
            </div>
          </Link>
        ))}
      </FadeInOnLoad>

      <FadeInOnLoad delay={0.2} className="bg-white rounded-3xl border border-purple-50/50 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-dark font-outfit">Agenda Semanal</h2>
            <p className="text-sm text-zinc-500 font-medium mt-1">Vista general de las próximas citas</p>
          </div>
          <Link href="/admin/citas" className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-brand text-sm font-bold rounded-xl hover:bg-brand hover:text-white transition-colors">
            <TrendingUp className="w-4 h-4" /> Ver todas
          </Link>
        </div>
        <div className="rounded-2xl overflow-hidden border border-purple-50">
           <AdminCalendar citas={citas} />
        </div>
      </FadeInOnLoad>
    </div>
  );
}