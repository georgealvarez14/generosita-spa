import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, CalendarHeart, Clock, MapPin, Phone, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

async function getServiciosDestacados() {
  const servicios = await prisma.servicio.findMany({
    orderBy: { precio: "asc" },
    take: 3,
  });
  return servicios;
}

export default async function Home() {
  const servicios = await getServiciosDestacados();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        </div>

        <div className="container px-4 md:px-6 relative z-10 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 rounded-full border border-purple-200 bg-white/60 px-4 py-2 text-sm font-medium text-purple-700 backdrop-blur-sm w-fit mx-auto lg:mx-0">
                <Sparkles className="h-4 w-4" />
                Elegancia y Perfección
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-purple-900 font-outfit">
                Realza la belleza de tus manos
              </h1>
              <p className="text-lg md:text-xl text-purple-700/80 max-w-xl mx-auto lg:mx-0">
                Descubre el arte de unas uñas perfectas. Especialistas en acrílico, gel y diseños únicos creados especialmente para ti.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  href="/reservar"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-purple-600 px-8 text-base font-semibold text-white shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 hover:scale-105"
                >
                  Reservar Cita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex h-14 items-center justify-center rounded-full border-2 border-purple-300 bg-white/70 px-8 text-base font-semibold text-purple-700 transition-all hover:bg-white hover:border-purple-400"
                >
                  Ver Servicios
                </Link>
                {user ? (
                  <Link
                    href="/portal"
                    className="inline-flex h-14 items-center justify-center rounded-full border-2 border-brand/30 bg-white/70 px-8 text-base font-semibold text-brand transition-all hover:bg-brand-50 hover:border-brand-500 shadow-sm"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Ver Mi Perfil
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex h-14 items-center justify-center rounded-full border-2 border-brand/30 bg-white/70 px-8 text-base font-semibold text-brand transition-all hover:bg-brand-50 hover:border-brand-500 shadow-sm"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </Link>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 text-sm text-purple-600">
                <a 
                  href="https://wa.me/573172137402" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#25D366] transition-colors group"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.582 1.9.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.002 21.567c-1.606 0-3.181-.417-4.568-1.205l-5.111 1.341 1.365-4.98c-.868-1.425-1.326-3.064-1.326-4.756 0-5.275 4.292-9.567 9.568-9.567 5.276 0 9.568 4.293 9.568 9.569 0 5.274-4.292 9.568-9.568 9.568z"/>
                  </svg>
                  <span className="font-semibold underline underline-offset-2">WhatsApp: 317 213 7402</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Te esperamos con amor</span>
                </div>
              </div>
            </div>

            {/* Logo Grande - sin fondo */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Efecto de brillo detrás, no fondo blanco */}
                <div className="absolute inset-4 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-xl" />
                <Image
                  src="/logo.png"
                  alt="Generosita Spa - By Ena Giraldo"
                  fill
                  className="object-contain relative z-10 drop-shadow-xl"
                  priority
                  unoptimized
                  key="logo-hero-v2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              <Star className="h-4 w-4 fill-purple-700" />
              Servicios Destacados
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 font-outfit">
              Nuestros Servicios
            </h2>
            <p className="max-w-2xl text-purple-600/80 text-lg">
              Los tratamientos más populares elegidos por nuestras clientas.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {servicios.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-purple-500">No hay servicios disponibles en este momento.</p>
              </div>
            ) : (
              servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  className="group flex flex-col justify-between rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-2xl hover:shadow-purple-100 hover:border-purple-200 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{servicio.duracion} min</span>
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2 font-outfit">
                      {servicio.nombre}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-50">
                    <span className="text-2xl font-bold text-purple-600">
                      ${servicio.precio.toLocaleString()}
                    </span>
                    <Link
                      href={`/reservar?servicio=${encodeURIComponent(servicio.id)}`}
                      className="inline-flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                    >
                      Reservar
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:text-purple-900 transition-colors"
            >
              Ver todos los servicios
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-br from-purple-600 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <CalendarHeart className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit text-white mb-6">
            Date un gusto hoy mismo
          </h2>
          <p className="mx-auto max-w-2xl text-white/90 text-lg md:text-xl mb-10">
            Reserva tu cita en menos de 2 minutos. Te esperamos para dejar tus manos hermosas.
          </p>
          <Link
            href="/reservar"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-purple-600 transition-all hover:scale-105 shadow-xl"
          >
            Agenda tu cita ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
