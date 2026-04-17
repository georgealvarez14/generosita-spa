'use client';

import { useEffect, useState } from 'react';
import { Scissors, Pencil, Trash2, CheckCircle2, XCircle, Loader2, Plus, DollarSign, Clock } from 'lucide-react';
import type { InputFieldProps } from '@/types';

type Servicio = {
  id: string; nombre: string; precio: number; duracion: number;
};

const EMPTY = { nombre: '', precio: '', duracion: '' };

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: InputFieldProps) => (
  <div>
    <label className="text-xs text-zinc-500 font-medium mb-1 block">{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand" />
  </div>
);

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<typeof EMPTY>(EMPTY);
  const [newData, setNewData] = useState<typeof EMPTY>(EMPTY);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/services').then(r => r.json()).then(d => setServicios(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startEdit = (s: Servicio) => {
    setEditingId(s.id);
    setEditData({ nombre: s.nombre, precio: String(s.precio), duracion: String(s.duracion) });
    setShowNew(false);
  };

  const saveEdit = async (id: string) => {
    setSaving(true); setError('');
    const res = await fetch(`/api/services/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editData.nombre, precio: Number(editData.precio), duracion: Number(editData.duracion) }),
    });
    if (!res.ok) { setError('Error al guardar'); }
    setSaving(false); setEditingId(null); load();
  };

  const createServicio = async () => {
    if (!newData.nombre || !newData.precio || !newData.duracion) { setError('Completa todos los campos'); return; }
    setSaving(true); setError('');
    const res = await fetch('/api/services', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: newData.nombre, precio: Number(newData.precio), duracion: Number(newData.duracion) }),
    });
    if (!res.ok) { setError('Error al crear servicio'); }
    setSaving(false); setNewData(EMPTY); setShowNew(false); load();
  };

  const deleteServicio = async (id: string) => {
    if (!confirm('¿Eliminar este servicio? Las citas existentes mantienen sus datos.')) return;
    setDeletingId(id);
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    setServicios(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-zinc-800">Servicios</h1>
          <p className="text-zinc-400 text-sm">{servicios.length} servicio{servicios.length !== 1 ? 's' : ''} disponible{servicios.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditingId(null); }}
          className="flex items-center gap-2 bg-brand text-white font-semibold px-4 py-2 rounded-xl hover:bg-brand-dark transition shadow-md shadow-brand/20 text-sm">
          <Plus className="w-4 h-4" /> Nuevo servicio
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* New service form */}
      {showNew && (
        <div className="bg-white rounded-2xl border-2 border-brand/20 shadow-sm p-6">
          <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand" /> Agregar nuevo servicio
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <InputField label="Nombre del servicio" value={newData.nombre} onChange={(e) => setNewData(d => ({...d, nombre: e.target.value}))} placeholder="Ej. Manicura Rusa" />
            <InputField label="Precio ($)" value={newData.precio} onChange={(e) => setNewData(d => ({...d, precio: e.target.value}))} type="number" placeholder="0" />
            <InputField label="Duración (min)" value={newData.duracion} onChange={(e) => setNewData(d => ({...d, duracion: e.target.value}))} type="number" placeholder="60" />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setShowNew(false); setError(''); }} className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-lg transition">Cancelar</button>
            <button onClick={createServicio} disabled={saving}
              className="flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-brand-dark transition shadow-md shadow-brand/20">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Crear servicio
            </button>
          </div>
        </div>
      )}

      {/* Services list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-zinc-200" />)}</div>
      ) : servicios.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <Scissors className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No hay servicios. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {servicios.map(s => {
            const isEditing = editingId === s.id;
            return (
              <div key={s.id} className={`bg-white rounded-2xl border p-5 transition-all ${isEditing ? 'border-brand/30 shadow-md' : 'border-zinc-200 hover:border-zinc-300'}`}>
                {isEditing ? (
                  <>
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <InputField label="Nombre" value={editData.nombre} onChange={(e) => setEditData(d => ({...d, nombre: e.target.value}))} />
                      <InputField label="Precio ($)" value={editData.precio} onChange={(e) => setEditData(d => ({...d, precio: e.target.value}))} type="number" />
                      <InputField label="Duración (min)" value={editData.duracion} onChange={(e) => setEditData(d => ({...d, duracion: e.target.value}))} type="number" />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-lg transition">
                        <XCircle className="w-4 h-4" /> Cancelar
                      </button>
                      <button onClick={() => saveEdit(s.id)} disabled={saving}
                        className="flex items-center gap-1.5 bg-brand text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-brand-dark transition shadow-md shadow-brand/20">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Guardar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-light/40 text-brand-dark rounded-xl flex items-center justify-center shrink-0">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-800">{s.nombre}</p>
                      <div className="flex items-center gap-4 mt-0.5">
                        <span className="text-sm text-brand font-bold flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" />{s.precio.toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{s.duracion} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(s)} className="p-2 text-brand hover:bg-brand-light/30 rounded-lg transition" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteServicio(s.id)} disabled={deletingId === s.id}
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Eliminar">
                        {deletingId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
