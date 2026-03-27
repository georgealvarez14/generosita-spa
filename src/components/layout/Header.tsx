import Image from 'next/image';
import Link from 'next/link';
import { CalendarHeart, User, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import MobileMenu from './MobileMenu';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const dbUser = await prisma.cliente.findUnique({
      where: { id: user.id },
      select: { rol: true }
    });
    if (dbUser?.rol === 'admin') {
      isAdmin = true;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-purple-100/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/" className="text-sm font-semibold text-purple-900/70 hover:text-brand transition-colors relative group py-2">
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/servicios" className="text-sm font-semibold text-purple-900/70 hover:text-brand transition-colors relative group py-2">
            Servicios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/galeria" className="text-sm font-semibold text-purple-900/70 hover:text-brand transition-colors relative group py-2">
            Galería
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {user && isAdmin && (
            <Link href="/admin" className="text-sm font-bold text-brand hover:text-brand-dark transition-colors flex items-center gap-2 group hidden xl:flex">
              <div className="bg-brand-light/10 p-2 rounded-full group-hover:bg-brand-light/30 transition-colors">
                <ShieldCheck className="w-4 h-4 text-brand" />
              </div>
              <span>Admin</span>
            </Link>
          )}
          {user ? (
            <Link href="/portal" className="text-sm font-bold text-purple-900/70 hover:text-brand transition-colors flex items-center gap-2 group">
              <div className="bg-brand-light/10 p-2 rounded-full group-hover:bg-brand-light/30 transition-colors">
                <User className="w-4 h-4 text-brand" />
              </div>
              <span className="hidden lg:block">Mi Perfil</span>
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-purple-900/70 hover:text-brand transition-colors flex items-center gap-2 group">
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

        {/* Mobile Menu (interactive client component) */}
        <MobileMenu isLoggedIn={!!user} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
