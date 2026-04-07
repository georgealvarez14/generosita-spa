'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Scissors, Users, ImageIcon, Menu, X, ExternalLink, User as UserIcon } from 'lucide-react';
import LogoutButton from './LogoutButton';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
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
    <div className="min-h-screen bg-zinc-100 flex flex-col relative w-full h-full overflow-hidden">
      {/* Top Header */}
      <header className="bg-brand-dark text-white shadow-lg z-30 h-14 flex items-center px-4 md:px-6 shrink-0 relative">
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile hamburger button */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-1.5 -ml-1.5 shrink-0 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <Link href="/admin" className="font-outfit text-lg font-bold flex items-center gap-2">
            <span className="bg-white text-brand-dark w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm">G</span>
            <span className="hidden sm:inline">Generosita SPA</span>
          </Link>
          <span className="text-brand-light/40 text-xs hidden sm:block">· Admin</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/portal/perfil" className="text-brand-light hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5" title="Mi Perfil">
            <UserIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Mi Perfil</span>
          </Link>
          <div className="w-px h-4 bg-brand-light/20 mx-1 hidden sm:block"></div>
          <Link href="/" className="text-brand-light hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5" title="Ver sitio web">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden lg:inline">Ver sitio web</span>
          </Link>
          <div className="w-px h-4 bg-brand-light/20 mx-1 hidden sm:block"></div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="w-56 bg-white border-r border-zinc-200 shrink-0 hidden md:flex flex-col pt-4 overflow-y-auto">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-light text-brand-dark shadow-sm'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-brand-dark' : 'text-zinc-400'}`} />
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
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)}
          ></div>
          
          {/* Sidebar Menu */}
          <aside className="relative flex w-72 max-w-[80vw] flex-col overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 h-16 bg-brand-bg/50 border-b border-brand-light/20">
              <span className="font-outfit font-bold text-lg text-brand-dark flex items-center gap-2">
                 <span className="bg-brand text-white w-6 h-6 rounded-md flex items-center justify-center font-black text-xs">G</span>
                 Menú Admin
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
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all ${
                      active
                        ? 'bg-brand text-white shadow-md shadow-brand/20'
                        : 'text-zinc-600 hover:bg-brand-light/30 hover:text-brand-dark'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-400'}`} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-5 py-6 mt-auto border-t border-zinc-100">
              <Link href="/" target="_blank" className="flex items-center justify-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 text-sm font-semibold text-zinc-600 hover:text-brand hover:border-brand-light hover:bg-white transition-all shadow-sm">
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
