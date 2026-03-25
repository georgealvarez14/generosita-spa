'use client';

import { useEffect, useState } from 'react';
import { Users, Phone, CalendarDays, MessageCircle } from 'lucide-react';
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

  useEffect(() => {
    fetch('/api/clientes')
      .then(r => r.json())
      .then(d => setClientes(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

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
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="border border-zinc-200 rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand"
        />
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
    </div>
  );
}
