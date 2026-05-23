// src/components/public/Footer.tsx
import Link from 'next/link';
import { Mail, CreditCard, ShieldCheck, Truck } from 'lucide-react';

// Reutilizamos el SVG seguro para no tener problemas con lucide-react
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] pt-16 pb-8 px-6 text-gray-400 text-sm">
      <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Columna 1: Marca */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-2xl font-black tracking-[2px] uppercase text-white">
            SAEL <span className="text-[#FF5F00]">SPORT</span>
          </Link>
          <p className="leading-relaxed">
            Importaciones Premium y Calidad Jugador. Vistiendo la pasión de los hinchas con la mejor indumentaria del mercado.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com/sael.sport" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5F00] transition-colors">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="mailto:contacto@saelsport.com" className="hover:text-[#FF5F00] transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Columna 2: Categorías */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold uppercase tracking-wider mb-2">Categorías</h3>
          <Link href="/catalog?cat=lpf" className="hover:text-[#FF5F00] transition-colors w-fit">Liga Argentina</Link>
          <Link href="/catalog?cat=europeas" className="hover:text-[#FF5F00] transition-colors w-fit">Ligas Europeas</Link>
          <Link href="/catalog?cat=selecciones" className="hover:text-[#FF5F00] transition-colors w-fit">Selecciones</Link>
          <Link href="/catalog?category=retro" className="hover:text-[#FF5F00] transition-colors w-fit">Colección Retro</Link>
          <Link href="/catalog?sale=true" className="text-[#FF5F00] hover:text-white transition-colors w-fit font-bold">ZONA DE OFERTAS</Link>
        </div>

        {/* Columna 3: Soporte y Ayuda */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold uppercase tracking-wider mb-2">Ayuda al Cliente</h3>
          <Link href="/faq" className="hover:text-[#FF5F00] transition-colors w-fit">Preguntas Frecuentes</Link>
          <Link href="/envios" className="hover:text-[#FF5F00] transition-colors w-fit">Política de Envíos</Link>
          <Link href="/devoluciones" className="hover:text-[#FF5F00] transition-colors w-fit">Cambios y Devoluciones</Link>
          <Link href="/talles" className="hover:text-[#FF5F00] transition-colors w-fit">Guía de Talles</Link>
        </div>

        {/* Columna 4: Confianza */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold uppercase tracking-wider mb-2">Compra Segura</h3>
          <div className="flex items-center gap-3">
            <Truck className="text-[#FF5F00] w-5 h-5" />
            <span>Envíos por Correo Argentino y Andreani</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="text-[#FF5F00] w-5 h-5" />
            <span>Mercado Pago y Transferencia (10% OFF)</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#FF5F00] w-5 h-5" />
            <span>Sitio 100% protegido</span>
          </div>
        </div>

      </div>

      {/* Franja inferior: Copyright y Defensa del Consumidor */}
      <div className="max-w-300 mx-auto pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} SAEL SPORT. Todos los derechos reservados.</p>
        
        <div className="flex items-center gap-6">
          <Link href="/arrepentimiento" className="font-bold underline hover:text-gray-300 transition-colors">
            Botón de Arrepentimiento
          </Link>
          <p>Hecho por Tomás Reyes</p>
        </div>
      </div>
    </footer>
  );
}