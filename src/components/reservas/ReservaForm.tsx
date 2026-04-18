'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Home,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import type { ModalidadServicio } from '@/types';

export type ReservaFormService = {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  modalidad: ModalidadServicio;
  recargo_domicilio: number | null;
};

type Props = {
  services: ReservaFormService[];
};

type ModalidadForm = 'LOCAL' | 'DOMICILIO';

type ReservaPayload = {
  cliente: { nombre: string; telefono: string; email: string | null };
  fecha: string;
  hora: string;
  servicio_id: string;
  modalidad: ModalidadForm;
  precio_ajustado: number;
  direccion_domicilio: string | null;
  indicaciones: string | null;
};

const clp = (value: number) => `$${value.toLocaleString('es-CO')}`;

const inputClass =
  'w-full min-h-[52px] rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mint-premium/60 focus:border-mint-premium/40 transition-colors';

const labelClass =
  'block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 mb-2';

export default function ReservaForm(props: Props) {
  // useSearchParams opts this component into dynamic rendering; wrap in Suspense
  // so consumers can drop the form into any page without extra boilerplate.
  return (
    <Suspense fallback={null}>
      <ReservaFormInner {...props} />
    </Suspense>
  );
}

function ReservaFormInner({ services }: Props) {
  const searchParams = useSearchParams();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [servicioId, setServicioId] = useState<string>(
    () => services[0]?.id ?? '',
  );
  const [modalidad, setModalidad] = useState<ModalidadForm>('LOCAL');
  const [direccion, setDireccion] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  useEffect(() => {
    const urlModalidad = searchParams.get('modalidad')?.toLowerCase();
    if (urlModalidad === 'domicilio') setModalidad('DOMICILIO');

    const urlServicio = searchParams.get('servicio');
    if (urlServicio && services.some((s) => s.id === urlServicio)) {
      setServicioId(urlServicio);
    }
  }, [searchParams, services]);

  const servicio = useMemo(
    () => services.find((s) => s.id === servicioId),
    [services, servicioId],
  );

  const isDomicilio = modalidad === 'DOMICILIO';

  const total = useMemo(() => {
    if (!servicio) return 0;
    return isDomicilio
      ? servicio.precio + (servicio.recargo_domicilio ?? 0)
      : servicio.precio;
  }, [servicio, isDomicilio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicio) return;
    const payload: ReservaPayload = {
      cliente: { nombre, telefono, email: email || null },
      fecha,
      hora,
      servicio_id: servicio.id,
      modalidad,
      precio_ajustado: total,
      direccion_domicilio: isDomicilio ? direccion : null,
      indicaciones: isDomicilio ? indicaciones || null : null,
    };
    console.log('[ReservaForm] payload listo para Prisma:', payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-pearl-gray font-sans p-6 md:p-10 rounded-3xl"
      noValidate={false}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {/* Servicio */}
        <div>
          <label htmlFor="servicio" className={labelClass}>
            <Sparkles className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
            Servicio
          </label>
          <select
            id="servicio"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            className={inputClass}
            required
          >
            {services.length === 0 ? (
              <option value="">No hay servicios disponibles</option>
            ) : (
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — {clp(s.precio)} · {s.duracion} min
                </option>
              ))
            )}
          </select>
        </div>

        {/* Fecha & Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fecha" className={labelClass}>
              <Calendar className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="hora" className={labelClass}>
              <Clock className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
              Hora
            </label>
            <input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Cliente */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nombre" className={labelClass}>
              <User className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
              Nombre completo
            </label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
              placeholder="Tu nombre"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="telefono" className={labelClass}>
              <Phone className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={inputClass}
              placeholder="317 123 4567"
              required
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              <Mail className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" aria-hidden />
              Correo{' '}
              <span className="font-normal normal-case tracking-normal text-slate-400">
                (opcional)
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Modalidad */}
        <fieldset className="m-0 border-0 p-0">
          <legend className={labelClass}>¿Dónde quieres tu cita?</legend>
          <div role="radiogroup" className="grid grid-cols-2 gap-3">
            <ModalityButton
              active={modalidad === 'LOCAL'}
              onClick={() => setModalidad('LOCAL')}
              icon={<Home className="h-5 w-5" aria-hidden />}
              label="En el Spa"
              sub="Nuestra sede"
            />
            <ModalityButton
              active={modalidad === 'DOMICILIO'}
              onClick={() => setModalidad('DOMICILIO')}
              icon={<MapPin className="h-5 w-5" aria-hidden />}
              label="A Domicilio"
              sub={
                servicio?.recargo_domicilio
                  ? `+ ${clp(servicio.recargo_domicilio)}`
                  : 'En tu casa'
              }
            />
          </div>
        </fieldset>

        {/* Campos condicionales de domicilio */}
        <AnimatePresence initial={false}>
          {isDomicilio && (
            <motion.div
              key="domicilio-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-1">
                <div>
                  <label htmlFor="direccion" className={labelClass}>
                    <MapPin
                      className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5"
                      aria-hidden
                    />
                    Dirección exacta
                  </label>
                  <input
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className={inputClass}
                    placeholder="Calle 123 # 45-67, apto 301"
                    required={isDomicilio}
                    autoComplete="street-address"
                  />
                </div>
                <div>
                  <label htmlFor="indicaciones" className={labelClass}>
                    Indicaciones para llegar{' '}
                    <span className="font-normal normal-case tracking-normal text-slate-400">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    id="indicaciones"
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                    rows={3}
                    className={`${inputClass} min-h-[96px] resize-none`}
                    placeholder="Conjunto cerrado, preguntar en portería, torre 3..."
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumen de precio */}
        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Total estimado
              </p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {servicio?.nombre ?? '—'}
                {isDomicilio && servicio?.recargo_domicilio ? (
                  <> · incluye domicilio {clp(servicio.recargo_domicilio)}</>
                ) : null}
              </p>
            </div>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 text-3xl font-bold text-brand-dark"
            >
              {clp(total)}
            </motion.span>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={!servicio}
          className="group inline-flex min-h-[52px] items-center justify-center gap-2
            rounded-full bg-gradient-to-br from-mint-premium to-mint-premium/60
            px-8 py-4 text-sm font-bold text-brand-dark
            shadow-lg shadow-mint-premium/40 transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-xl hover:shadow-mint-premium/50
            active:scale-95 active:shadow-md
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/50 focus-visible:ring-offset-2 focus-visible:ring-offset-pearl-gray"
        >
          Confirmar reserva · {clp(total)}
        </button>
      </div>
    </form>
  );
}

type ModalityButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
};

function ModalityButton({
  active,
  onClick,
  icon,
  label,
  sub,
}: ModalityButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`group relative flex min-h-20 flex-col items-start justify-center gap-1 rounded-2xl border px-5 py-4 text-left
        backdrop-blur-md transition-all duration-200
        active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-premium/60
        ${
          active
            ? 'border-mint-premium bg-mint-premium/30 shadow-md shadow-mint-premium/30'
            : 'border-white/60 bg-white/60 hover:border-white/80 hover:bg-white/80'
        }`}
    >
      <span
        className={`flex items-center gap-2 text-sm font-bold ${
          active ? 'text-brand-dark' : 'text-slate-700'
        }`}
      >
        {icon}
        {label}
      </span>
      <span
        className={`text-[11px] ${active ? 'text-brand-dark/70' : 'text-slate-500'}`}
      >
        {sub}
      </span>
    </button>
  );
}
