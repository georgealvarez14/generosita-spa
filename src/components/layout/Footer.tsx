import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-brand-light/40 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-outfit text-2xl font-bold text-brand-dark mb-2">Generosita SPA</h3>
        <p className="text-brand font-medium tracking-wide text-sm uppercase mb-4">by Ena Giraldo</p>
        <p className="text-gray-600 mb-2 max-w-md mx-auto">
          El mejor estúdio de uñas para resaltar tu belleza y estilo. 
          Manicura, pedicura y diseños personalizados.
        </p>
        <p className="text-brand-dark font-bold mb-8 flex items-center justify-center gap-2">
          <span>💜</span> WhatsApp: 3172137402 <span>💜</span>
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
          <Link href="/servicios" className="hover:text-brand transition-colors">Servicios</Link>
          <Link href="/galeria" className="hover:text-brand transition-colors">Galería</Link>
          <Link href="/reservar" className="hover:text-brand transition-colors">Reservar</Link>
        </div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Generosita SPA by Ena Giraldo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
