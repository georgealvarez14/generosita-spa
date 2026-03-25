import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getServicios() {
  const servicios = await prisma.servicio.findMany({
    orderBy: { precio: "asc" },
  });
  return servicios;
}

export default async function ServiciosPage() {
  const servicios = await getServicios();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-white/60 px-4 py-2 text-sm font-medium text-purple-700 backdrop-blur-sm mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            Experiencia Única
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-purple-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-purple-700/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Utilizamos productos de la más alta calidad para asegurar resultados duraderos y hermosos,
            siempre cuidando la salud de tus uñas.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container px-4 mx-auto py-12 max-w-6xl">
        {servicios.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-purple-500">No hay servicios disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100 hover:border-purple-200 hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-purple-900">{servicio.nombre}</h3>
                  <span className="font-bold text-xl text-purple-600">${servicio.precio.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-purple-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{servicio.duracion} minutos</span>
                </div>

                <div className="mt-auto pt-4 border-t border-purple-50">
                  <Link
                    href={`/reservar?servicio=${encodeURIComponent(servicio.id)}`}
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-600 hover:text-white transition-all"
                  >
                    Reservar <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-br from-purple-100 to-pink-50 rounded-3xl p-8 md:p-12 text-center border border-purple-200">
          <h3 className="text-2xl font-bold font-outfit text-purple-900 mb-4">
            ¿No estás segura de qué servicio elegir?
          </h3>
          <p className="text-purple-700/70 mb-8 max-w-xl mx-auto">
            Puedes reservar una consulta gratuita o elegir el servicio que más se acerque,
            y lo ajustaremos el día de tu cita.
          </p>
          <Link
            href="/reservar"
            className="inline-flex h-12 items-center justify-center rounded-full bg-purple-600 px-8 font-semibold text-white transition-all hover:bg-purple-700 shadow-lg shadow-purple-200 hover:scale-105"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
