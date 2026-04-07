'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { CalendarDays, Clock, Phone, Pencil, Trash2, CheckCircle2, XCircle, Loader2, Plus, X } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animations";

type Cita = {
  id: string; fecha: string; hora: string; estado_id: number; notas: string | null;
  cliente: { nombre: string; telefono: string };
  servicio: { id: string; nombre: string; precio: number; duracion: number };
};

type Cliente = { id: string; nombre: string; telefono: string; email: string | null };
type Servicio = { id: string; nombre: string; precio: number; duracion: number };

const ESTADOS = [
  { id: 1, label: 'Pendiente', cls: 'bg-amber-100 text-amber-700' },
  { id: 2, label: 'Confirmada', cls: 'bg-blue-100 text-blue-700' },
  { id: 3, label: 'Completada', cls: 'bg-green-100 text-green-700' },
  { id: 4, label: 'Cancelada', cls: 'bg-red-100 text-red-600' },
];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const formatTime12h = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};

export default function CitasAdmin() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ estado_id: number; notas: string }>({ estado_id: 1, notas: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | 'all'>('all');

  // Nueva cita states
  const [isCreating, setIsCreating] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [newCita, setNewCita] = useState({ nombre: '', telefono: '', fecha: '', hora: '09:00', servicioId: '', notas: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/bookings?all=true')
      .then(r => r.json())
      .then(d => setCitas(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    load();
    // Preload clients and services for the modal
    fetch('/api/clientes').then(r => r.json()).then(setClientes).catch(console.error);
    fetch('/api/services').then(r => r.json()).then(setServicios).catch(console.error);
  }, []);

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

  const submitNewCita = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCita)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear cita');
      setIsCreating(false);
      setNewCita({ nombre: '', telefono: '', fecha: '', hora: '09:00', servicioId: '', notas: '' });
      load();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cliente Autocomplete Handler
  const handleNameSelect = (nombre: string) => {
    const c = clientes.find(x => x.nombre === nombre);
    if (c) {
      setNewCita({ ...newCita, nombre: c.nombre, telefono: c.telefono });
    } else {
      setNewCita({ ...newCita, nombre });
    }
  };

  const filtered = filter === 'all' ? citas : citas.filter(c => c.estado_id === filter);

  const formatHora = (h: string) => typeof h === 'string' && h.includes('T')
    ? new Date(h).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
    : h;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <FadeIn className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-brand-dark tracking-tight">Gestión de Citas</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">{citas.length} cita{citas.length !== 1 ? 's' : ''} en total</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filter tabs */}
          <div className="flex bg-white rounded-xl border border-purple-100 p-1 mr-2 shadow-sm">
            {[{ id: 'all', label: 'Todas' }, ...ESTADOS].map(e => (
              <button
                key={e.id}
                onClick={() => setFilter(e.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === e.id ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-zinc-500 hover:bg-purple-50 hover:text-brand'
                }`}
              >{e.label}</button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Nueva Cita
            <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded-md ml-1 uppercase tracking-wider font-extrabold animate-pulse">Nuevo</span>
          </button>
        </div>
      </FadeIn>

      {loading ? (
        <div className="space-y-4 animate-pulse">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-purple-50" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-purple-50 shadow-sm">
          <CalendarDays className="w-16 h-16 text-brand-light/30 mx-auto mb-4" />
          <p className="text-zinc-500 font-semibold text-lg">No hay citas con este filtro.</p>
        </div>
      ) : (
        <StaggerContainer className="bg-transparent md:bg-white md:rounded-3xl md:border md:border-purple-100 overflow-hidden md:shadow-md md:shadow-brand/5">
          {/* Vista Móvil (Tarjetas) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filtered.map(cita => {
              const estado = ESTADOS.find(e => e.id === cita.estado_id);
              const isEditing = editingId === cita.id;
              const isDeleting = deletingId === cita.id;
              return (
                <StaggerItem key={cita.id} className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-4 hover:border-purple-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-brand-dark text-lg leading-tight">{cita.cliente.nombre}</p>
                      <a href={`https://wa.me/${cita.cliente.telefono}`} target="_blank"
                        className="text-sm text-zinc-500 hover:text-brand flex items-center gap-1.5 mt-1">
                        <Phone className="w-3.5 h-3.5" />{cita.cliente.telefono}
                      </a>
                    </div>
                    {isEditing ? (
                      <select
                        value={editData.estado_id}
                        onChange={e => setEditData(d => ({ ...d, estado_id: Number(e.target.value) }))}
                        className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 text-zinc-700 bg-white shadow-sm"
                      >
                        {ESTADOS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${estado?.cls}`}>
                        {estado?.label ?? 'Desconocido'}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <p className="font-semibold text-zinc-800 text-sm">
                        {format(new Date(cita.fecha), 'dd MMM yyyy', { locale: es })}
                      </p>
                      <span className="text-zinc-300">•</span>
                      <p className="font-medium text-zinc-600 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {formatHora(cita.hora)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                       <p className="font-semibold text-brand-dark text-sm">{cita.servicio.nombre}</p>
                       <p className="text-xs text-zinc-500 font-medium">${cita.servicio.precio.toLocaleString()} / {cita.servicio.duracion}m</p>
                    </div>
                  </div>

                  {isEditing ? (
                    <input
                      value={editData.notas}
                      onChange={e => setEditData(d => ({ ...d, notas: e.target.value }))}
                      className="text-sm border border-zinc-200 rounded-xl px-3 py-2 w-full text-zinc-700 shadow-sm"
                      placeholder="Notas especiales..."
                    />
                  ) : (
                    cita.notas && (
                      <p className="text-sm text-zinc-600 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                        <span className="font-medium text-amber-800">Nota:</span> {cita.notas}
                      </p>
                    )
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-50">
                    {isEditing ? (
                      <>
                        <button onClick={() => setEditingId(null)} className="flex-1 py-2.5 text-sm font-semibold text-zinc-500 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition">
                          Cancelar
                        </button>
                        <button onClick={() => saveEdit(cita.id)} disabled={saving}
                          className="flex-1 py-2.5 text-sm font-semibold text-white bg-brand rounded-xl hover:bg-brand-dark transition flex items-center justify-center gap-1.5 shadow-md shadow-brand/20">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Guardar
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => deleteCita(cita.id)} disabled={isDeleting}
                          className="flex-1 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-1.5">
                          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Eliminar
                        </button>
                        <button onClick={() => startEdit(cita)} className="flex-1 py-2.5 text-sm font-semibold text-brand-dark bg-brand-light/20 border border-brand/20 rounded-xl hover:bg-brand-light/40 transition flex items-center justify-center gap-1.5">
                          <Pencil className="w-4 h-4" /> Editar
                        </button>
                      </>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </div>

          {/* Vista Escritorio (Tabla) */}
          <StaggerItem className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-purple-50/50 border-b border-purple-100 text-xs text-brand-dark uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Cliente</th>
                  <th className="px-6 py-4 font-bold">Servicio</th>
                  <th className="px-6 py-4 font-bold">Fecha / Hora</th>
                  <th className="px-6 py-4 font-bold">Estado</th>
                  <th className="px-6 py-4 font-bold">Notas</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {filtered.map((cita) => {
                  const estado = ESTADOS.find(e => e.id === cita.estado_id);
                  const isEditing = editingId === cita.id;
                  const isDeleting = deletingId === cita.id;
                  return (
                    <tr key={cita.id} className={`transition-colors ${isEditing ? 'bg-brand-light/10' : 'hover:bg-purple-50/30'}`}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-brand-dark text-[15px]">{cita.cliente.nombre}</p>
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
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${estado?.cls}`}>
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
          </StaggerItem>
        </StaggerContainer>
      )}

      {/* Modal Nueva Cita */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-lg text-zinc-800">Nueva Reserva Admin</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {createError}
                </div>
              )}
              
              <form id="new-booking-form" onSubmit={submitNewCita} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    required
                    list="clientes-names-list"
                    value={newCita.nombre}
                    onChange={e => handleNameSelect(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    placeholder="Busca o escribe un nombre..."
                  />
                  <datalist id="clientes-names-list">
                    {clientes.map(c => (
                      <option key={c.id} value={c.nombre}>{c.telefono}</option>
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={newCita.telefono}
                    onChange={e => setNewCita(c => ({...c, telefono: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    placeholder="Número telefónico"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      required
                      value={newCita.fecha}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setNewCita(c => ({...c, fecha: e.target.value}))}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none appearance-none min-w-0 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-1">Hora</label>
                    <select
                      required
                      value={newCita.hora}
                      onChange={e => setNewCita(c => ({...c, hora: e.target.value}))}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none bg-white min-w-0"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{formatTime12h(t)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Servicio</label>
                  <select
                    required
                    value={newCita.servicioId}
                    onChange={e => setNewCita(c => ({...c, servicioId: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                  >
                    <option value="" disabled>Selecciona un servicio</option>
                    {servicios.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} (${s.precio.toLocaleString()} - {s.duracion} min)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Notas especiales</label>
                  <textarea
                    value={newCita.notas}
                    onChange={e => setNewCita(c => ({...c, notas: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none resize-none"
                    rows={2}
                    placeholder="Opcional..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                form="new-booking-form"
                type="submit" 
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Guardando...' : 'Crear Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
