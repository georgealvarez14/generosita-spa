import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function GaleriaPage() {
  const imagenes = await prisma.galeria.findMany({
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header section */}
      <section className="bg-brand-light/20 py-16">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-outfit text-brand-dark mb-4">
            Galería de Trabajos
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Explora nuestros diseños y creaciones. Cada conjunto de uñas es una pequeña obra de arte.
          </p>
        </div>
      </section>

      <section className="container px-4 mx-auto mt-12 max-w-6xl">
        {imagenes.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-400">Próximamente</h3>
            <p className="text-zinc-500 mt-2">Estamos preparando nuestras mejores fotos para ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {imagenes.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={img.imagen_url}
                  alt={img.descripcion || "Trabajo de Generosita Spa"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}
      </section>
      
      <div className="container mx-auto px-4 mt-16 text-center">
         <Link 
            href="/reservar" 
            className="inline-flex h-14 items-center justify-center rounded-full bg-brand px-10 text-lg font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-brand-dark/20"
          >
            Quiero unas uñas así
         </Link>
      </div>
    </div>
  );
}
