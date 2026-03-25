'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-brand-light hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
    >
      <LogOut className="w-4 h-4" />
      Salir
    </button>
  );
}
