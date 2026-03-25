'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { CalendarDays, Clock, Phone, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2, Plus } from 'lucide-react';

type Cita = {
  id: string; fecha: string; hora: string; estado_id: number; notas: string | null;
  cliente: { nombre: string; telefono: string };
  servicio: { nombre: string; precio: number; duracion: number };
};

const ESTADOS = [
  { id: 1, label: 'Pendiente', cls: 'bg-amber-100 text-amber-700' },
  { id: 2, label: 'Confirmada', cls: 'bg-blue-100 text-blue-700' },
  { id: 3, label: 'Completada', cls: 'bg-green-100 text-green-700' },
  { id: 4, label: 'Cancelada', cls: 'bg-red-100 text-red-600' },
];

export default function CitasAdmin() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ estado_id: number; notas: string }>({ estado_id: 1, notas: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | 'all'>('all');

  const load = () => {
    setLoading(true);
    fetch('/api/bookings?all=true')
      .then(r => r.json())
      .then(d => setCitas(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startEdit = (cita: Cita) => {
    setEditingId(cita.id);
    setEditData({ estado_id: cita.estado_id, notas: cita.notas || '' });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setSaving(false);
    setEditingId(null);
    load();
  };

  const deleteCita = async (id: string) => {
    if (!confirm('¿Segura que quieres eliminar esta cita? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    setCitas(prev => prev.filter(c => c.id !== id));
  };

  const filtered = filter === 'all' ? citas : citas.filter(c => c.estado_id === filter);

  const formatHora = (h: string) => typeof h === 'string' && h.includes('T')
    ? new Date(h).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : h;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-zinc-800">Gestión de Citas</h1>
          <p className="text-zinc-400 text-sm">{citas.length} cita{citas.length !== 1 ? 's' : ''} en total</p>
        </div>
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Todas' }, ...ESTADOS].map(e => (
            <button
              key={e.id}
              onClick={() => setFilter(e.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filter === e.id ? 'bg-brand text-white border-brand shadow' : 'bg-white text-zinc-600 border-zinc-200 hover:border-brand-light'
              }`}
            >{e.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-zinc-200" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <CalendarDays className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No hay citas con este filtro.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Servicio</th>
                  <th className="px-5 py-3 font-semibold">Fecha / Hora</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Notas</th>
                  <th className="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map(cita => {
                  const estado = ESTADOS.find(e => e.id === cita.estado_id);
                  const isEditing = editingId === cita.id;
                  const isDeleting = deletingId === cita.id;
                  return (
                    <tr key={cita.id} className={`transition-colors ${isEditing ? 'bg-brand-bg/50' : 'hover:bg-zinc-50/70'}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-zinc-800">{cita.cliente.nombre}</p>
                        <a href={`https://wa.me/${cita.cliente.telefono}`} target="_blank"
                          className="text-xs text-zinc-400 hover:text-brand flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />{cita.cliente.telefono}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-brand-dark">{cita.servicio.nombre}</p>
                        <p className="text-xs text-zinc-400">${cita.servicio.precio.toLocaleString()} · {cita.servicio.duracion} min</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-zinc-800 flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-brand shrink-0" />
                          {format(new Date(cita.fecha), 'dd MMM yyyy', { locale: es })}
                        </p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          {formatHora(cita.hora)}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        {isEditing ? (
                          <select
                            value={editData.estado_id}
                            onChange={e => setEditData(d => ({ ...d, estado_id: Number(e.target.value) }))}
                            className="text-xs border border-zinc-200 rounded-lg px-2 py-1 text-zinc-700 bg-white"
                          >
                            {ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${estado?.cls}`}>
                            {estado?.label ?? 'Desconocido'}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px]">
                        {isEditing ? (
                          <input
                            value={editData.notas}
                            onChange={e => setEditData(d => ({ ...d, notas: e.target.value }))}
                            className="text-xs border border-zinc-200 rounded-lg px-2 py-1 w-full text-zinc-700"
                            placeholder="Notas..."
                          />
                        ) : (
                          <p className="text-xs text-zinc-500 truncate">{cita.notas || <span className="text-zinc-300 italic">—</span>}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(cita.id)} disabled={saving}
                                className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 transition" title="Guardar">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition" title="Cancelar">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(cita)} className="text-brand hover:text-brand-dark p-1.5 rounded-lg hover:bg-brand-light/30 transition" title="Editar">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteCita(cita.id)} disabled={isDeleting}
                                className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition" title="Eliminar">
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
