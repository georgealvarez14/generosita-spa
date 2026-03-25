import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const services = [
  {
    category: "Manos",
    items: [
      { name: "Manicura Rusa", price: 25, duration: 60, desc: "Limpieza profunda de cutícula, nivelación y esmaltado en gel." },
      { name: "Baño de Acrílico", price: 35, duration: 90, desc: "Capa de acrílico sobre tu uña natural para mayor resistencia." },
      { name: "Acrílico Esculpido", price: 45, duration: 120, desc: "Extensiones construidas con moldes y acrílico." },
      { name: "Retoque de Acrílico", price: 30, duration: 90, desc: "Mantenimiento para uñas acrílicas (máx. 3 semanas)." },
    ]
  },
  {
    category: "Pies",
    items: [
      { name: "Pedicura Spa Clásica", price: 30, duration: 60, desc: "Limpieza, exfoliación, masaje ligero y esmaltado regular." },
      { name: "Pedicura Jelly Spa", price: 40, duration: 75, desc: "Experiencia relajante con gelatina térmica y esmaltado en gel." },
    ]
  },
  {
    category: "Extras y Arte",
    items: [
      { name: "Diseño simple (por uña)", price: 2, duration: 10, desc: "Líneas, puntos, efecto mármol sencillo." },
      { name: "Diseño 3D (por uña)", price: 5, duration: 15, desc: "Flores, moños, y figuras en relieve." },
      { name: "Cristales Swarovski", price: 8, duration: 10, desc: "Aplicación de cristales de diseño en 1-2 uñas." },
      { name: "Retiro de material", price: 10, duration: 30, desc: "Retiro cuidadoso de gel o acrílico sin dañar la uña natural." },
    ]
  }
];

export default function ServiciosPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header section */}
      <section className="bg-brand-light/20 py-16">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-brand-dark mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Utilizamos productos de la más alta calidad para asegurar resultados duraderos y hermosos, 
            siempre cuidando la salud de tus uñas.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="container px-4 mx-auto mt-12 max-w-4xl">
        <div className="space-y-16">
          {services.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold font-outfit text-brand border-b-2 border-brand-light/50 pb-2 mb-8">
                {section.category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {section.items.map((item, j) => (
                  <div key={j} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-brand-dark">{item.name}</h3>
                      <span className="font-bold text-lg text-brand">${item.price}</span>
                    </div>
                    <p className="text-zinc-500 text-sm mb-4 min-h-[40px]">
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
                      <div className="flex items-center text-xs text-zinc-400 font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {item.duration} min
                      </div>
                      <Link 
                        href={`/reservar?servicio=${encodeURIComponent(item.name)}`}
                        className="text-brand font-medium hover:text-brand-dark transition-colors text-sm flex items-center"
                      >
                        Reservar <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-brand-bg rounded-3xl p-8 md:p-12 text-center border border-brand-light/30">
          <h3 className="text-2xl font-bold font-outfit text-brand-dark mb-4">
            ¿No estás segura de qué servicio elegir?
          </h3>
          <p className="text-zinc-600 mb-8 max-w-xl mx-auto">
            Puedes reservar una consulta gratuita o elegir el servicio que más se acerque, 
            y lo ajustaremos el día de tu cita.
          </p>
          <Link
            href="/reservar"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Reservar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
