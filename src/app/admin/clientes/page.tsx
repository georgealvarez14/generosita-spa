'use client';

import { useEffect, useState } from 'react';
import { Users, Phone, CalendarDays, MessageCircle, Plus, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

type Cliente = {
  id: string; nombre: string; telefono: string; email: string | null; created_at: string;
  citas?: { id: string }[];
};

export default function ClientasAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [newClient, setNewClient] = useState({ nombre: '', telefono: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/clientes')
      .then(r => r.json())
      .then(d => setClientes(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submitNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear clienta');
      setIsCreating(false);
      setNewClient({ nombre: '', telefono: '', email: '' });
      load();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono.includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-zinc-800">Clientas</h1>
          <p className="text-zinc-400 text-sm">{clientes.length} clienta{clientes.length !== 1 ? 's' : ''} registrada{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="border border-zinc-200 rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" /> Nueva
            <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded-md ml-1 uppercase tracking-wider font-extrabold animate-pulse hidden sm:inline-block">Nuevo</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-zinc-200" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <Users className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">{search ? 'No se encontraron resultados.' : 'Aún no hay clientas registradas.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">Clienta</th>
                  <th className="px-5 py-3 font-semibold">Teléfono</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Registrada</th>
                  <th className="px-5 py-3 font-semibold text-right">Contactar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-brand-light/50 text-brand-dark font-bold flex items-center justify-center text-sm shrink-0">
                          {c.nombre.charAt(0).toUpperCase()}
                        </span>
                        <p className="font-semibold text-zinc-800">{c.nombre}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-zinc-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />{c.telefono}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-zinc-400 text-xs">{c.email || <span className="italic">—</span>}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-zinc-400 text-xs flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {c.created_at ? format(new Date(c.created_at), "dd MMM yyyy", { locale: es }) : '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a href={`https://wa.me/${c.telefono}`} target="_blank"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#20b958] transition">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nueva Clienta */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-lg text-zinc-800">Nueva Clienta</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {createError}
                </div>
              )}
              
              <form id="new-client-form" onSubmit={submitNewClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={newClient.nombre}
                    onChange={e => setNewClient(c => ({...c, nombre: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    placeholder="Ej. Camila Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Teléfono (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={newClient.telefono}
                    onChange={e => setNewClient(c => ({...c, telefono: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    placeholder="Ej. 3001234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">Correo electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient(c => ({...c, email: e.target.value}))}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                form="new-client-form"
                type="submit" 
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Guardando...' : 'Crear Clienta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
