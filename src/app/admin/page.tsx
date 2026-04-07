'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Users, Scissors, DollarSign, TrendingUp, Presentation, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

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
  ingresoEstimado: number;
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
    const hasSeenUpdate = localStorage.getItem('hasSeenUpdatev1.1');
    if (!hasSeenUpdate) {
      setShowUpdateModal(true);
    }
  }, []);

  const dismissUpdateModal = () => {
    localStorage.setItem('hasSeenUpdatev1.1', 'true');
    setShowUpdateModal(false);
  };

  const statCards = stats ? [
    { label: 'Citas hoy', value: stats.citasHoy ?? 0, icon: CalendarDays, color: 'bg-purple-100 text-purple-700', link: '/admin/citas' },
    { label: 'Pendientes', value: stats.pendientes ?? 0, icon: Clock, color: 'bg-amber-100 text-amber-700', link: '/admin/citas' },
    { label: 'Total clientas', value: stats.totalClientes ?? 0, icon: Users, color: 'bg-pink-100 text-pink-700', link: '/admin/clientes' },
    { label: 'Ingreso estimado', value: `$${(stats.ingresoEstimado ?? 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-700', link: '/admin/citas' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Resumen general de Generosita SPA</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-gray-200 animate-pulse" />
        )) : statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md hover:border-purple-200 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/citas', label: 'Gestionar Citas', desc: 'Ver, editar y cancelar reservas', icon: CalendarDays },
          { href: '/admin/servicios', label: 'Servicios', desc: 'Agregar, editar y eliminar servicios', icon: Scissors },
          { href: '/admin/clientes', label: 'Clientas', desc: 'Ver el historial de tus clientas', icon: Users },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="shrink-0 w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-purple-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Calendar preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-800 font-outfit">Agenda</h2>
            <p className="text-xs text-gray-400 mt-0.5">Vista general de las citas</p>
          </div>
          <Link href="/admin/citas" className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Ver todas →
          </Link>
        </div>
        <AdminCalendar citas={citas} />
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all scale-100">
            <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-start bg-brand-bg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-light/30 rounded-full blur-3xl shadow-inner"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-brand mb-1">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">Versión 1.1</span>
                </div>
                <h3 className="font-bold text-2xl text-brand-dark font-outfit mt-1">¡Nuevas Funciones!</h3>
                <p className="text-zinc-600 text-sm mt-1">Acabamos de implementar algunas mejoras que solicitaste.</p>
              </div>
              <button onClick={dismissUpdateModal} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-full hover:bg-zinc-100 bg-white shadow-sm relative z-10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-zinc-50 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-brand" /> Formato de Fecha AM/PM
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Todo el sistema, tanto para las clientas como en el panel de administrador, ahora muestra la hora en formato de 12 horas (AM / PM) facilitando su lectura al agendar.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                <h4 className="font-bold text-zinc-800 flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-brand" /> Creación de Citas desde Admin
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                  Añadimos el botón <span className="font-semibold bg-zinc-100 px-1 rounded text-zinc-700">+ Nueva Cita</span> en la página de Configuración de Citas.
                </p>
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs font-medium border border-amber-100 flex items-start gap-2">
                  <Users className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Si la persona ya había reservado antes, solo debes escribir su número de <b>WhatsApp</b> y el sistema la reconocerá y vinculará los datos automáticamente.</p>
                </div>
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
