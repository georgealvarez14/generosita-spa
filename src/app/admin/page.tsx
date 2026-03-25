'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Users, Scissors, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const AdminCalendar = dynamic(() => import('@/components/admin/AdminCalendar'), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse bg-zinc-100 rounded-2xl" />,
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

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setCitas(Array.isArray(c) ? c : []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Citas hoy', value: stats.citasHoy ?? 0, icon: CalendarDays, color: 'bg-brand-light/40 text-brand-dark', link: '/admin/citas' },
    { label: 'Pendientes', value: stats.pendientes ?? 0, icon: Clock, color: 'bg-amber-100 text-amber-700', link: '/admin/citas' },
    { label: 'Total clientas', value: stats.totalClientes ?? 0, icon: Users, color: 'bg-pink-100 text-pink-700', link: '/admin/clientes' },
    { label: 'Ingreso estimado', value: `$${(stats.ingresoEstimado ?? 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-700', link: '/admin/citas' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-zinc-800">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Resumen general de Generosita SPA</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-zinc-200 animate-pulse" />
        )) : statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link} className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col gap-3 hover:shadow-md hover:border-brand-light transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-800 group-hover:text-brand-dark transition-colors">{value}</p>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{label}</p>
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
          <Link key={href} href={href} className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-start gap-4 hover:shadow-md hover:border-brand-light transition-all group">
            <div className="shrink-0 w-10 h-10 bg-brand-light/30 text-brand-dark rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-zinc-800 text-sm group-hover:text-brand-dark">{label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Calendar preview */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-zinc-800 font-outfit">Agenda</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Vista general de las citas</p>
          </div>
          <Link href="/admin/citas" className="text-xs text-brand font-semibold hover:underline flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Ver todas →
          </Link>
        </div>
        <AdminCalendar citas={citas} />
      </div>
    </div>
  );
}
