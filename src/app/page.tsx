import Link from "next/link";
import { ArrowRight, Star, CalendarHeart, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animations";
import Hero, { type HeroService } from "@/components/home/Hero";

export const dynamic = "force-dynamic";

async function getServiciosDomicilio() {
  return prisma.servicio.findMany({
    where: { modalidad: { in: ["DOMICILIO", "AMBOS"] } },
    orderBy: { precio: "asc" },
  });
}

export default async function Home() {
  const servicios = await getServiciosDomicilio();

  const heroServices: HeroService[] = servicios.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    precio: s.precio,
    modalidad: s.modalidad,
  }));

  const featured = servicios.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <Hero services={heroServices} />

      {/* Featured Services */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
              <Star className="h-4 w-4 fill-purple-700" />
              Servicios Destacados
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 font-outfit">
              Nuestros Servicios a Domicilio
            </h2>
            <p className="max-w-2xl text-purple-600/80 text-lg">
              Los tratamientos más solicitados, ahora en la comodidad de tu hogar.
            </p>
          </div>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {featured.length === 0 ? (
              <StaggerItem className="col-span-full text-center py-12">
                <p className="text-purple-500">
                  No hay servicios disponibles a domicilio en este momento.
                </p>
              </StaggerItem>
            ) : (
              featured.map((servicio) => (
                <StaggerItem
                  key={servicio.id}
                  className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100 hover:border-purple-200 hover:-translate-y-1 transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-purple-900">
                      {servicio.nombre}
                    </h3>
                    <span className="font-bold text-xl text-purple-600">
                      ${servicio.precio.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{servicio.duracion} minutos</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-purple-50">
                    <Link
                      href={`/reservar?servicioId=${encodeURIComponent(servicio.id)}`}
                      className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all"
                    >
                      Reservar <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>

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
      <section className="w-full pt-20 pb-28 md:pb-24 bg-gradient-to-br from-purple-600 to-pink-500 text-white relative overflow-hidden -mb-px">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <FadeIn className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <CalendarHeart className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit text-white mb-6">
            Date un gusto hoy mismo
          </h2>
          <p className="mx-auto max-w-2xl text-white/90 text-lg md:text-xl mb-10">
            Reserva tu cita en menos de 2 minutos. Te esperamos con el ritual completo en tu casa.
          </p>
          <Link
            href="/reservar?modalidad=domicilio"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-purple-600 transition-all hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-white/20"
          >
            Agenda tu cita ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
