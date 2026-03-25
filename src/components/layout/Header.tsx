import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-light/30 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start gap-0">
          <span className="font-outfit text-2xl font-bold text-brand-dark">Generosita SPA</span>
          <span className="text-[10px] font-medium text-brand uppercase tracking-wider -mt-1">by Ena Giraldo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/servicios" className="text-sm font-medium text-gray-600 hover:text-brand transition-colors">
            Servicios
          </Link>
          <Link href="/galeria" className="text-sm font-medium text-gray-600 hover:text-brand transition-colors">
            Galería
          </Link>
          <Link 
            href="/reservar" 
            className="text-sm font-medium bg-brand text-white px-5 py-2.5 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
          >
            Reservar Cita
          </Link>
        </nav>
      </div>
    </header>
  );
}
