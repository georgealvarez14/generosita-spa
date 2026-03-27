import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

import { ExternalLink, User } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verificar rol de manera segura usando Prisma (sin pasar por RLS del cliente)
  const profile = await prisma.cliente.findUnique({
    where: { id: user.id }
  });

  if (!profile || profile.rol !== 'admin') {
    redirect('/portal');
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-brand-dark text-white shadow-lg z-20 h-14 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/admin" className="font-outfit text-lg font-bold flex items-center gap-2">
            <span className="bg-white text-brand-dark w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm">G</span>
            <span className="hidden sm:inline">Generosita SPA</span>
          </Link>
          <span className="text-brand-light/40 text-xs hidden sm:block">· Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/portal/perfil" className="text-brand-light hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5" title="Mi Perfil">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Perfil</span>
          </Link>
          <div className="w-px h-4 bg-brand-light/20 mx-1 hidden sm:block"></div>
          <Link href="/" className="text-brand-light hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5" title="Ver sitio web">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Ver sitio web</span>
          </Link>
          <div className="w-px h-4 bg-brand-light/20 mx-1 hidden sm:block"></div>
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
