import Image from 'next/image';
import Link from 'next/link';
import { CalendarHeart, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-purple-100/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Lado Izquierdo: Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Generosita Spa"
              fill
              className="object-contain"
              priority
              key="logo-header-v4"
            />
          </div>
          <div className="ml-3 hidden sm:block">
            <span className="font-outfit font-bold text-brand-dark text-xl tracking-tight">Generosita Spa</span>
          </div>
        </Link>

        {/* Centro: Nav Links Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/servicios" className="text-sm font-semibold text-zinc-600 hover:text-brand transition-colors relative group py-2">
            Servicios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/galeria" className="text-sm font-semibold text-zinc-600 hover:text-brand transition-colors relative group py-2">
            Galería
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Lado Derecho: Acciones Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <Link href="/portal" className="text-sm font-bold text-zinc-600 hover:text-brand transition-colors flex items-center gap-2 group">
              <div className="bg-brand-light/10 p-2 rounded-full group-hover:bg-brand-light/30 transition-colors">
                <User className="w-4 h-4 text-brand" />
              </div>
              <span className="hidden lg:block">Mi Perfil</span>
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-zinc-600 hover:text-brand transition-colors flex items-center gap-2 group">
              <div className="bg-brand-light/10 p-2 rounded-full group-hover:bg-brand-light/30 transition-colors">
                <User className="w-4 h-4 text-brand" />
              </div>
              <span className="hidden lg:block">Ingresar</span>
            </Link>
          )}
          <Link 
            href="/reservar" 
            className="inline-flex items-center gap-2 text-sm font-bold bg-brand text-white px-7 py-3 rounded-full hover:bg-brand-dark transition-all duration-300 shadow-md hover:shadow-xl shadow-brand/20 hover:-translate-y-0.5"
          >
            <CalendarHeart className="w-4 h-4" />
            Reservar
          </Link>
        </div>

        {/* Botón Menu Mobile */}
        <button className="md:hidden p-2 text-brand hover:bg-brand-light/20 rounded-lg transition-colors flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
