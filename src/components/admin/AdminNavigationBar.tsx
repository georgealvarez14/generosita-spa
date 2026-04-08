'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Scissors, Users, ImageIcon, Menu, X, ExternalLink, User as UserIcon } from 'lucide-react';
import LogoutButton from './LogoutButton';

const navItems = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/admin/citas', label: 'Citas', icon: CalendarDays, exact: false },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors, exact: false },
  { href: '/admin/clientes', label: 'Clientas', icon: Users, exact: false },
  { href: '/admin/galeria', label: 'Galería', icon: ImageIcon, exact: false },
];

export default function AdminNavigationBar({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col relative w-full h-full overflow-hidden">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm z-30 h-16 flex items-center px-4 md:px-6 shrink-0 relative transition-all">
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile hamburger button */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-1.5 -ml-1.5 shrink-0 rounded-lg text-brand-dark hover:bg-brand-light/30 transition-colors focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/admin" className="font-outfit text-xl font-bold flex items-center gap-3 text-brand-dark group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform flex-shrink-0">
              <Image src="/logo.png" alt="Generosita SPA Logo" fill className="object-contain" />
            </div>
            <span className="hidden sm:inline">Generosita SPA</span>
          </Link>
          <span className="bg-purple-100 text-brand-dark font-bold px-2 py-1 rounded-md text-[10px] hidden sm:block uppercase tracking-widest ml-1">Admin</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/portal" className="text-brand-dark hover:text-white bg-brand-light/20 hover:bg-brand text-[13px] font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent hover:border-brand-dark hover:shadow-md" title="Mi Perfil">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mi Perfil</span>
          </Link>
          <Link href="/" target="_blank" className="text-zinc-600 hover:text-brand-dark bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-[13px] font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:shadow-sm" title="Ver sitio web">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Ver sitio web</span>
          </Link>
          <div className="w-px h-5 bg-zinc-200 mx-1 hidden sm:block"></div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-purple-100/50 shrink-0 hidden md:flex flex-col pt-6 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-brand-light/80 to-brand-light/20 text-brand-dark shadow-sm ring-1 ring-brand-light/50'
                      : 'text-zinc-500 hover:bg-purple-50 hover:text-brand'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${active ? 'text-brand' : 'text-zinc-400 group-hover:text-brand-light'}`} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full max-w-full p-4 sm:p-5 md:p-8 shrink-0">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)}
          ></div>
          
          {/* Sidebar Menu */}
          <aside className="relative flex w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 h-20 bg-gradient-to-br from-brand-light/30 to-brand-bg border-b border-purple-100">
              <span className="font-outfit font-bold text-xl text-brand-dark flex items-center gap-2.5">
                 <div className="relative w-8 h-8">
                   <Image src="/logo.png" alt="Generosita SPA Logo" fill className="object-contain" />
                 </div>
                 Admin
              </span>
              <button 
                type="button" 
                className="flex items-center justify-center p-2 -mr-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[16px] font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-brand to-pink-500 text-white shadow-lg shadow-brand/20'
                        : 'text-zinc-600 hover:bg-brand-light/30 hover:text-brand-dark'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-400'}`} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-6 py-8 mt-auto bg-purple-50/50 border-t border-purple-100">
              <Link href="/" target="_blank" className="flex items-center justify-center gap-2 bg-white border border-purple-200 rounded-2xl py-4 text-[15px] font-bold text-brand hover:text-brand-dark hover:border-brand-light hover:shadow-md transition-all">
                <ExternalLink className="w-4 h-4" />
                Ver la página web
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
