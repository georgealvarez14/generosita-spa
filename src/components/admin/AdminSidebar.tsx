'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Scissors, Users, Bell, ImageIcon } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/citas', label: 'Citas', icon: CalendarDays, exact: false },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors, exact: false },
  { href: '/admin/clientes', label: 'Clientas', icon: Users, exact: false },
  { href: '/admin/galeria', label: 'Galería', icon: ImageIcon, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 bg-white border-r border-zinc-200 shrink-0 hidden md:flex flex-col pt-4">
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
      <div className="p-4 border-t border-zinc-100">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-brand transition-colors">
          🌐 Ver sitio web
        </Link>
      </div>
    </aside>
  );
}
