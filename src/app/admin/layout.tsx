import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import AdminNavigationBar from '@/components/admin/AdminNavigationBar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verificar rol de manera segura usando Prisma
  const profile = await prisma.cliente.findUnique({
    where: { id: user.id }
  });

  if (!profile || profile.rol !== 'admin') {
    redirect('/portal');
  }

  return <AdminNavigationBar>{children}</AdminNavigationBar>;
}
