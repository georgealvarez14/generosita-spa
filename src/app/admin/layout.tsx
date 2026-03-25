import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <LogoutButton />
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
