'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarHeart, User } from 'lucide-react';

type Props = {
  isLoggedIn?: boolean;
};

const desktopLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/galeria', label: 'Galería' },
];

export default function Navigation({ isLoggedIn }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className="hidden md:block sticky top-0 z-50 w-full
        bg-[#1c1132]/80 backdrop-blur-xl
        border-b border-white/10 shadow-lg shadow-black/10"
    >
      <div className="container mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Ir al inicio — Generosita Spa"
        >
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Generosita Spa"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-outfit font-bold text-white text-xl tracking-tight">
            Generosita Spa
          </span>
        </Link>

        {/* Main links */}
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-6 lg:gap-8">
            {desktopLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative py-2 text-sm font-semibold transition-colors ${
                      active
                        ? 'text-mint-premium'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-mint-premium transition-all duration-300 ${
                        active ? 'w-full' : 'w-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href={isLoggedIn ? '/portal' : '/login'}
            className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors min-h-[44px]"
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">
              {isLoggedIn ? 'Mi Perfil' : 'Ingresar'}
            </span>
          </Link>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 text-sm font-bold
              bg-brand text-white px-6 py-2.5 rounded-full
              hover:bg-white hover:text-brand-dark transition-all duration-300
              shadow-md shadow-brand/30 hover:-translate-y-0.5 min-h-[44px]"
          >
            <CalendarHeart className="w-4 h-4 shrink-0" />
            Reservar
          </Link>
        </div>
      </div>
    </header>
  );
}

