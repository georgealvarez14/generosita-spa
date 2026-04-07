'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CalendarHeart, User, ShieldCheck, X, Menu } from 'lucide-react';

type Props = {
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export default function MobileMenu({ isLoggedIn, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: block body scroll when open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-brand hover:bg-brand-light/20 rounded-lg transition-colors flex items-center"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && createPortal(
        <div className="md:hidden">
          {/* Overlay */}
          {open && (
            <div
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Slide-in panel */}
          <div
            className={`fixed top-0 right-0 z-[9999] h-[100dvh] w-[80vw] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col overflow-y-auto ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header of panel */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100">
              <span className="font-outfit font-bold text-brand-dark text-lg">Generosita Spa</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/galeria', label: 'Galería' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold text-purple-900/80 hover:text-brand hover:bg-brand-light/10 px-4 py-3 rounded-xl transition-all"
                >
                  {label}
                </Link>
              ))}

              <div className="my-3 border-t border-purple-100" />

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-base font-semibold text-brand hover:bg-brand-light/10 px-4 py-3 rounded-xl transition-all"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Panel Admin
                </Link>
              )}

              {isLoggedIn ? (
                <Link
                  href="/portal"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-base font-semibold text-purple-900/80 hover:text-brand hover:bg-brand-light/10 px-4 py-3 rounded-xl transition-all"
                >
                  <User className="w-5 h-5" />
                  Mi Perfil
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-base font-semibold text-purple-900/80 hover:text-brand hover:bg-brand-light/10 px-4 py-3 rounded-xl transition-all"
                >
                  <User className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
              )}
            </nav>

            {/* CTA Button */}
            <div className="px-4 pb-8 mb-4">
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-brand text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 text-base"
              >
                <CalendarHeart className="w-5 h-5" />
                Reservar Cita
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
