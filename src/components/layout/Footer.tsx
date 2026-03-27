import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1c1132] to-[#2c1b4d] text-purple-50 pt-16 pb-8 border-t-[6px] border-brand mt-auto">
      
      {/* Banner de Llamado a la Acción Integrado */}
      <div className="container mx-auto px-4 lg:px-8 mb-16 border-b border-white/10 pb-12">
        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 md:p-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold font-outfit text-white mb-3">Reserva tu momento de relax</h3>
            <p className="text-purple-200/90 max-w-xl text-lg">Déjate consentir por expertas en un ambiente diseñado exclusivamente para ti y la belleza de tus uñas.</p>
          </div>
          <Link href="/reservar" className="flex-shrink-0 bg-brand text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Agendar Ahora
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 bg-white rounded-2xl p-2 shadow-lg">
                <Image src="/logo.png" alt="Generosita Spa Logo" fill className="object-contain p-1" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-2xl text-white leading-tight">Generosita</h4>
                <p className="text-brand-light text-xs tracking-widest uppercase font-bold">Spa by Ena Giraldo</p>
              </div>
            </div>
            <p className="text-purple-200/80 leading-relaxed text-sm pr-4">
              Tu destino ideal para el cuidado profesional de uñas. Diseños exclusivos, técnicas premium y un amor incondicional por los detalles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-white tracking-wide">Enlaces</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Inicio</Link></li>
              <li><Link href="/servicios" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Servicios</Link></li>
              <li><Link href="/galeria" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Galería</Link></li>
              <li><Link href="/reservar" className="text-brand hover:text-brand-light transition-colors text-sm font-bold">Reservar Cita</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-white tracking-wide">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-[#25D366]/20 p-2.5 rounded-lg text-[#25D366] shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.183-.573c.978.582 1.9.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.765-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.002 21.567c-1.606 0-3.181-.417-4.568-1.205l-5.111 1.341 1.365-4.98c-.868-1.425-1.326-3.064-1.326-4.756 0-5.275 4.292-9.567 9.568-9.567 5.276 0 9.568 4.293 9.568 9.569 0 5.274-4.292 9.568-9.568 9.568z"/>
                  </svg>
                </div>
                <div>
                  <strong className="block text-white text-sm mb-1">Citas y Asesoría</strong>
                  <a href="https://wa.me/573172137402" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#25D366] font-bold hover:text-white transition-colors text-sm group">
                    Escríbenos al WhatsApp
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <p className="text-purple-200/60 text-xs mt-1">317 213 7402</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-lg text-brand-light shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm mb-1">Ubicación</strong>
                  <span className="text-purple-200 text-sm">Te esperamos con amor</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-white tracking-wide">Síguenos</h4>
            <p className="text-purple-200/80 text-sm mb-6">Descubre nuestros últimos diseños y promociones en redes sociales.</p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand hover:border-brand transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand hover:border-brand transition-all hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-purple-300/60 font-medium">
          <p>© {new Date().getFullYear()} Generosita Spa by Ena Giraldo. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Políticas de Privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">Términos del Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
