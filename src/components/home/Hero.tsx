import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ModalidadServicio } from '@/types';

export type HeroService = {
  id: string;
  nombre: string;
  precio: number;
  modalidad: ModalidadServicio;
};

type Props = {
  services?: HeroService[];
};

export function filterHomeServices<T extends { modalidad: ModalidadServicio }>(
  services: T[],
): T[] {
  return services.filter(
    (s) => s.modalidad === 'DOMICILIO' || s.modalidad === 'AMBOS',
  );
}

export default function Hero({ services = [] }: Props) {
  const homeServices = filterHomeServices(services);
  const preview = homeServices.slice(0, 3);
  const extra = homeServices.length - preview.length;

  return (
    <section className="relative w-full min-h-[calc(100dvh-5rem)] overflow-hidden bg-pearl-gray font-sans">
      {/* Decorative glows — frame the centered composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-mint-premium/40 blur-3xl opacity-70 gpu-blur"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-lavender-soft/70 blur-3xl opacity-60 gpu-blur"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-16 md:px-8 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="flex flex-col items-center text-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-mint-premium/25 blur-2xl"
            />
            <Image
              src="/logo.png"
              alt="Generosita Spa"
              width={120}
              height={120}
              priority
              className="relative h-[120px] w-[120px] object-contain drop-shadow-lg"
            />
          </div>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full
              border border-brand-light bg-white/80 px-4 py-2
              text-[11px] font-semibold uppercase tracking-[0.2em]
              text-brand-dark backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Spa a Domicilio
          </span>

          {/* Title */}
          <h1
            className="max-w-3xl text-balance text-brand-dark
              text-[2.5rem] leading-[1.2] tracking-[-0.01em]
              sm:text-5xl sm:leading-[1.15]
              md:text-6xl md:leading-[1.08] md:tracking-tight
              lg:text-[5rem]"
          >
            El lujo del Spa,{' '}
            <span className="text-brand">en la comodidad de tu hogar</span>
          </h1>

          {/* Descriptive paragraph */}
          <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Llevamos el ritual completo hasta ti: ambiente, productos premium y
            atención personalizada, sin moverte de casa.
          </p>

          {/* Availability card — focal element */}
          {preview.length > 0 && (
            <aside
              aria-label="Servicios disponibles a domicilio"
              className="w-full max-w-md mx-auto mt-2"
            >
              <div
                className="rounded-3xl border border-white/60 bg-white/70
                  p-6 md:p-8
                  shadow-[0_20px_50px_rgba(165,_243,_232,_0.2)]
                  backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-dark/60">
                  Disponibles a domicilio
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {preview.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-2xl bg-pearl-gray/80 px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-brand-dark">
                        {s.nombre}
                      </span>
                      <span className="text-xs font-bold text-brand">
                        ${s.precio.toLocaleString('es-CO')}
                      </span>
                    </li>
                  ))}
                </ul>
                {extra > 0 && (
                  <p className="mt-4 text-[11px] text-slate-500">
                    y {extra} más al reservar
                  </p>
                )}
              </div>
            </aside>
          )}

          {/* CTA row — stacked on mobile, inline on desktop */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/reservar?modalidad=domicilio"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2
                rounded-full bg-gradient-to-br from-mint-premium to-mint-premium/60
                px-8 py-4 text-sm font-bold text-brand-dark
                shadow-lg shadow-mint-premium/40 transition-all duration-300
                hover:scale-105 hover:shadow-xl hover:shadow-mint-premium/50
                active:scale-95 active:shadow-md
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/50 focus-visible:ring-offset-2 focus-visible:ring-offset-pearl-gray"
            >
              Reservar Domicilio
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/servicios"
              className="inline-flex min-h-[52px] items-center justify-center
                rounded-full px-6 py-4
                text-sm font-semibold text-brand-dark/70
                transition-colors hover:text-brand-dark"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
