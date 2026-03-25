import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, CalendarHeart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-brand-light/30">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-bg via-white to-brand-light opacity-90" />
          {/* Decorative blur blobs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-brand-light/60 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-brand/20 bg-white/50 px-3 py-1 text-sm font-medium text-brand-dark backdrop-blur-sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Elegancia y Perfección
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-brand-dark sm:text-5xl xl:text-6xl/none font-outfit text-balance">
                  Realza la belleza <br className="hidden sm:block" /> de tus manos
                </h1>
                <p className="max-w-[600px] text-zinc-600 md:text-xl text-balance">
                  Descubre el arte de unas uñas perfectas. Especialistas en acrílico, gel y diseños únicos creados especialmente para ti.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link
                  href="/reservar"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-dark"
                >
                  Reservar Cita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand/20 bg-white/50 px-8 text-sm font-medium text-brand-dark transition-colors hover:bg-white hover:border-brand/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
            
            <div className="mx-auto w-full max-w-[500px] lg:max-w-none relative mt-10 lg:mt-0">
               <div className="aspect-[4/5] overflow-hidden rounded-2xl relative shadow-2xl shadow-brand/20 border-4 border-white">
                 {/* Replace with actual image later */}
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent z-10" />
                 <img
                   alt="Manos con uñas arregladas"
                   className="object-cover w-full h-full"
                   src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"
                 />
                 <div className="absolute bottom-6 left-6 right-6 z-20 glass-panel rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-brand text-white p-3 rounded-full shrink-0">
                      <Star className="h-6 w-6 fill-white" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-dark">5.0 de 5.0</p>
                      <p className="text-sm text-zinc-600">Basado en +120 reseñas de clientas</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-brand-dark font-outfit">
              Nuestros Servicios
            </h2>
            <p className="max-w-[700px] text-zinc-500 md:text-lg">
              Los tratamientos más populares elegidos por nuestras clientas.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              { title: "Manicura Rusa", price: "$25", desc: "Limpieza profunda y esmaltado perfecto." },
              { title: "Acrílico Esculpido", price: "$45", desc: "Extensiones de uñas con moldes y diseño." },
              { title: "Baño de Acrílico", price: "$35", desc: "Protección y fuerza para tus uñas naturales." },
            ].map((service, i) => (
              <div key={i} className="group flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-brand/10 hover:border-brand/30">
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 font-outfit">{service.title}</h3>
                  <p className="text-zinc-500 mb-6">{service.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-brand">{service.price}</span>
                  <Link href="/reservar" className="text-brand font-medium hover:underline text-sm flex items-center">
                    Reservar <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/servicios" className="text-brand font-medium hover:text-brand-dark transition-colors inline-flex items-center">
              Ver todos los servicios
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-brand text-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <CalendarHeart className="h-16 w-16 mx-auto mb-6 text-brand-light" />
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-outfit text-white mb-6">
            Date un gusto hoy mismo
          </h2>
          <p className="mx-auto max-w-[600px] text-brand-light md:text-xl mb-10">
            Reserva tu cita en menos de 2 minutos. Te esperamos para dejar tus manos hermosas.
          </p>
          <Link
            href="/reservar"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-brand transition-transform hover:scale-105 shadow-xl shadow-brand-dark/20"
          >
            Agenda tu cita ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
