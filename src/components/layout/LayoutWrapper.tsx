'use client';

import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

export default function LayoutWrapper({
  header,
  footer,
  children
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Ocultar Header y Footer en las rutas de administración y portal de cliente
  const isHidden = pathname?.startsWith('/admin') || pathname?.startsWith('/portal');

  return (
    <>
      {!isHidden && header}
      <main className={`flex-1 flex flex-col relative overflow-x-hidden min-h-screen pb-20 md:pb-0`}>
        {children}
      </main>
      {!isHidden && footer}
      {/* Mobile bottom nav — always rendered, self-hides on /admin */}
      <MobileNav />
    </>
  );
}
