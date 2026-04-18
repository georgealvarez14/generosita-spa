'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Scissors, ImageIcon, User, type LucideIcon } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const items: NavItem[] = [
  { href: '/', label: 'Inicio', Icon: House },
  { href: '/servicios', label: 'Servicios', Icon: Scissors },
  { href: '/galeria', label: 'Galería', Icon: ImageIcon },
  { href: '/portal', label: 'Mi Portal', Icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide on admin routes entirely
  if (pathname?.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="md:hidden fixed inset-x-0 bottom-0 z-[9999]
        bg-white/80 backdrop-blur-xl
        border-t border-purple-100/60
        rounded-t-2xl
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="flex items-stretch h-[68px] px-2 gap-0.5">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className="group relative flex flex-col items-center justify-center gap-1
                  h-full w-full min-h-[44px] rounded-xl
                  transition-all duration-200 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-mint-premium/60"
              >
                <Icon
                  aria-hidden
                  strokeWidth={active ? 2.25 : 1.75}
                  className={`w-5 h-5 transition-all duration-300 ${
                    active
                      ? 'text-mint-premium drop-shadow-[0_0_8px_rgba(152,255,217,0.6)]'
                      : 'text-brand-dark/40 group-hover:text-brand-dark/70'
                  }`}
                />
                <span
                  className={`font-sans text-[10px] font-semibold tracking-wide transition-colors ${
                    active ? 'text-brand-dark' : 'text-brand-dark/40'
                  }`}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={`absolute bottom-1 h-[3px] w-[3px] rounded-full bg-mint-premium transition-all duration-300 ${
                    active
                      ? 'opacity-100 scale-100 shadow-[0_0_6px_rgba(152,255,217,0.9)]'
                      : 'opacity-0 scale-50'
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
