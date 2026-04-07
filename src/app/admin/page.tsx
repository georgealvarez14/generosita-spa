'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Users, Scissors, DollarSign, TrendingUp, Presentation, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { FadeInOnLoad, StaggerContainerOnLoad, StaggerItem } from "@/components/ui/Animations";

const AdminCalendar = dynamic(() => import('@/components/admin/AdminCalendar'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-purple-50 rounded-2xl" />,
});

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
  id: string; fecha: string; hora: string; estado_id: number; notas: string | null;
  cliente: { nombre: string; telefono: string };
  servicio: { nombre: string; precio: number; duracion: number };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setCitas(Array.isArray(c) ? c : []);
    }).finally(() => setLoading(false));

    // Check for update modal
    const hasSeenUpdate = localStorage.getItem('hasSeenUpdatev1.4');
    if (!hasSeenUpdate) {
      setShowUpdateModal(true);
    }
  }, []);

  const dismissUpdateModal = () => {
    localStorage.setItem('hasSeenUpdatev1.4', 'true');
    setShowUpdateModal(false);
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
      <FadeInOnLoad>
        <h1 className="text-3xl font-extrabold font-outfit text-brand-dark tracking-tight">Dashboard</h1>
        <p className="text-brand-light font-medium text-sm mt-1">Resumen general de Generosita SPA</p>
      </FadeInOnLoad>

      {/* Stats grid */}
      <StaggerContainerOnLoad className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? [...Array(6)].map((_, i) => (
          <StaggerItem key={i} className="h-32 bg-white rounded-3xl border border-purple-50 animate-pulse" />
        )) : statCards.map(({ label, value, icon: Icon, color, link }) => (
          <StaggerItem key={label}>
            <Link href={link} className="bg-white rounded-3xl border border-purple-50/50 p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-brand/5 hover:border-brand-light/30 transition-all group block">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-brand-dark tracking-tight group-hover:text-brand transition-colors">{value}</p>
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
          <Link key={href} href={href} className="bg-white rounded-3xl border border-purple-50/50 p-6 flex items-start gap-4 hover:shadow-xl hover:shadow-brand/5 hover:border-brand-light/30 transition-all group">
            <div className="shrink-0 w-12 h-12 bg-purple-50 text-brand rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-brand-dark text-base group-hover:text-brand transition-colors">{label}</p>
              <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">{desc}</p>
            </div>
          </Link>
        ))}
      </FadeInOnLoad>

      {/* Calendar preview */}
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

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all scale-100">
            <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-start bg-brand-bg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-light/30 rounded-full blur-3xl shadow-inner"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-brand mb-1">
                  <Sparkles className="w-5 h-5 text-brand drop-shadow-md" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">Versión 1.4</span>
                </div>
                <h3 className="font-bold text-2xl text-brand-dark font-outfit mt-1">¡Nuevas Novedades!</h3>
                <p className="text-zinc-600 text-sm mt-1 mb-2">Acabamos de implementar funcionalidades de finanzas y caja.</p>
              </div>
              <button onClick={dismissUpdateModal} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-full hover:bg-zinc-100 bg-white shadow-sm relative z-10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-zinc-50 space-y-4 max-h-[60vh]">
              <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md hover:border-brand/30">
                <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-brand bg-purple-50 rounded-lg p-0.5" /> Nuevo Resumen Financiero
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Expandimos la tarjeta original de ingresos. Ahora tu administrador cuenta con una cuadrícula superior que te informa de tus ganancias de <b>Hoy</b>, la semana actual y de <b>todo el Mes</b>, respetando cualquier ajuste de precio manual que realices.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:shadow-md hover:border-purple-200">
                <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-brand" /> Precio Ajustable por Cita
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Ahora en la pestaña de <b>Gestión de Citas</b>, puedes ingresar un <i>"Precio Ajustado"</i> en caso de que alguna clienta requiera algún servicio extra menor o se le aplique un descuento. Si lo dejas en blanco, el sistema seguirá cobrando el precio original del servicio por defecto.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm transition-all">
                <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-brand" /> Recordatorio: Estilo Ultra-Premium
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Recuerda que renovamos por completo la estética del administrador. Colores pastel, sombras sofisticadas y <b>animaciones suaves</b> en todos los menús para una experiencia de primer nivel.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-white flex justify-end">
              <button 
                onClick={dismissUpdateModal}
                className="px-6 py-3 w-full rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
              >
                 ¡Entendido, gracias!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
