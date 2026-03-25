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
              <li><Link href="/servicios" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Nuestros Servicios</Link></li>
              <li><Link href="/galeria" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Galería de Trabajos</Link></li>
              <li><Link href="/reservar" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Reservar Cita</Link></li>
              <li><Link href="/login" className="text-purple-200 hover:text-brand-light transition-colors text-sm font-medium">Portal de Cliente</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-white tracking-wide">Contacto</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-lg text-brand-light">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm mb-1">Teléfono / WhatsApp</strong>
                  <a href="https://wa.me/573172137402" className="text-purple-200 hover:text-white transition-colors text-sm">317 213 7402</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-lg text-brand-light">
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
