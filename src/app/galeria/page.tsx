import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Placeholder images mimicking Cloudinary setup
const images = [
  "https://images.unsplash.com/photo-1620023640244-aef411cb6249?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595868628042-3e5f2cf32f17?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
];

export default function GaleriaPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
              <img
                src={src}
                alt={`Trabajo de Generosita Spa ${i + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
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
