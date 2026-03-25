'use client';

import { useState } from 'react';
import { format, parse, startOfWeek, getDay, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { Calendar as CalendarIcon, Clock, AlertCircle, Phone, User, DollarSign, X, Send } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/app/admin/calendar-theme.css';

const locales = { 'es': es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

type Cita = {
  id: string;
  fecha: string;
  hora: string;
  estado_id: number;
  notas: string | null;
  cliente: { nombre: string; telefono: string };
  servicio: { nombre: string; precio: number; duracion: number };
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Cita;
};

type Props = { citas: Cita[] };

// Custom event card shown inside Week/Day views
function EventCard({ event }: { event: CalendarEvent }) {
  const dur = Math.round((event.end.getTime() - event.start.getTime()) / 60000);
  return (
    <div className="h-full overflow-hidden leading-tight">
      <p className="font-bold truncate text-white text-[11px]">{event.resource.cliente.nombre}</p>
      <p className="truncate text-white/90 text-[10px]">{event.resource.servicio.nombre}</p>
      {dur >= 45 && (
        <p className="text-white/75 text-[10px]">{format(event.start, 'HH:mm')} · ${event.resource.servicio.precio.toLocaleString()}</p>
      )}
    </div>
  );
}

export default function AdminCalendar({ citas }: Props) {
  // Default to 'week' so you can see times per day; 'agenda' shows a clean list
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const calendarEvents: CalendarEvent[] = citas.map((cita) => {
    const baseDate = new Date(cita.fecha);
    const timeDate = new Date(cita.hora);
    const hours = timeDate.getUTCHours();
    const minutes = timeDate.getUTCMinutes();
    const startDate = new Date(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      hours,
      minutes
    );
    return {
      id: cita.id,
      title: `${cita.cliente.nombre} — ${cita.servicio.nombre}`,
      start: startDate,
      end: addMinutes(startDate, cita.servicio.duracion),
      resource: cita,
    };
  });

  if (citas.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <CalendarIcon className="w-16 h-16 text-zinc-200 mb-4" />
        <p className="text-zinc-500 font-semibold text-lg">No hay citas registradas aún</p>
        <p className="text-zinc-400 text-sm mt-1">Cuando tus clientas reserven, aparecerán aquí automáticamente.</p>
      </div>
    );
  }

  return (
    <>
      {/* Quick stats bar */}
      <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2 bg-brand-light/30 rounded-lg px-3 py-1.5 text-sm text-brand-dark font-medium">
          <CalendarIcon className="w-4 h-4" />
          {citas.length} cita{citas.length !== 1 ? 's' : ''} en total
        </div>
        <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-1.5 text-sm text-amber-700 font-medium">
          <Clock className="w-4 h-4" />
          {citas.filter(c => c.estado_id === 1).length} pendiente{citas.filter(c => c.estado_id === 1).length !== 1 ? 's' : ''}
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
          💡 Haz clic en una cita para ver todos los detalles
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        style={{ height: 620 }}
        culture="es"
        views={['month', 'week', 'day', 'agenda']}
        messages={{
          next: 'Siguiente →',
          previous: '← Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          noEventsInRange: 'No hay citas en este periodo.',
          showMore: (total) => `+${total} más`,
          allDay: 'Todo el día',
          date: 'Fecha',
          time: 'Hora',
          event: 'Cita',
        }}
        onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
        // Custom component for week/day view events
        components={{
          event: ({ event }) => <EventCard event={event as CalendarEvent} />,
        }}
        // Scroll week/day view to working hours
        scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
      />

      {/* ── Detail Modal ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="bg-brand-bg px-6 py-4 flex justify-between items-center border-b border-brand-light/30">
              <div>
                <h3 className="text-xl font-bold text-brand-dark font-outfit">Detalle de Cita</h3>
                <p className="text-brand text-xs font-medium mt-0.5">
                  {format(selectedEvent.start, "eeee dd 'de' MMMM yyyy", { locale: es })}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Client info */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-light/40 flex items-center justify-center text-brand-dark font-bold text-lg shrink-0">
                  {selectedEvent.resource.cliente.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Cliente</p>
                  <p className="text-lg font-bold text-zinc-800">{selectedEvent.resource.cliente.nombre}</p>
                  <a href={`https://wa.me/${selectedEvent.resource.cliente.telefono}`} target="_blank"
                    className="text-brand hover:underline flex items-center mt-0.5 font-medium text-sm gap-1">
                    <Phone className="w-3.5 h-3.5" />{selectedEvent.resource.cliente.telefono}
                  </a>
                </div>
              </div>

              {/* Service + Time grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase font-semibold mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> Servicio
                  </p>
                  <p className="font-bold text-zinc-800">{selectedEvent.resource.servicio.nombre}</p>
                  <p className="text-brand font-bold mt-1 flex items-center text-sm gap-0.5">
                    <DollarSign className="w-3.5 h-3.5" />{selectedEvent.resource.servicio.precio.toLocaleString()}
                  </p>
                  <p className="text-zinc-400 text-xs mt-0.5">{selectedEvent.resource.servicio.duracion} minutos</p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase font-semibold mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Horario
                  </p>
                  <p className="font-bold text-zinc-800 capitalize">{format(selectedEvent.start, "EEEE d", { locale: es })}</p>
                  <p className="text-brand-dark font-bold mt-1">{format(selectedEvent.start, "HH:mm")} — {format(selectedEvent.end, "HH:mm")}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {selectedEvent.resource.estado_id === 1 ? '🟡 Pendiente' : '🟢 Confirmada'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedEvent.resource.notas && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs text-amber-700 font-bold uppercase mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Notas especiales
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">{selectedEvent.resource.notas}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-lg text-zinc-600 hover:bg-zinc-200 transition-colors font-medium text-sm">
                Cerrar
              </button>
              <a
                href={`https://wa.me/${selectedEvent.resource.cliente.telefono}?text=${encodeURIComponent(
                  `Hola ${selectedEvent.resource.cliente.nombre} 💜 Te recordamos tu cita en Generosita SPA el ${format(selectedEvent.start, "dd 'de' MMMM", { locale: es })} a las ${format(selectedEvent.start, "HH:mm")} para tu ${selectedEvent.resource.servicio.nombre}. ¡Te esperamos!`
                )}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2 rounded-xl hover:bg-[#20b958] transition shadow-md shadow-[#25D366]/20 text-sm"
              >
                <Send className="w-4 h-4" /> Recordatorio WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
