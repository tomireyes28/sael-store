// src/components/home/SplitBanners.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function SplitBanners() {
  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Colección Retro */}
        <Link href="/catalog?category=retro" className="relative group block h-75 md:h-100 rounded-xl overflow-hidden">
          {/* Fondo animado */}
          <motion.div 
            className="absolute inset-0 bg-[#1a1a1a]"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image 
              src="/banner-retro.jpg" 
              alt="Colección Retro" 
              fill
              className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 50vw" 
            />
          </motion.div>
          
          {/* Capa de degrade para legibilidad */}
          <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-transparent to-transparent"></div>

          {/* Contenido */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <p className="text-[#FF5F00] font-black text-xs md:text-sm uppercase tracking-widest mb-2">Clásicos Inmortales</p>
            <h3 className="text-white text-3xl md:text-4xl font-black uppercase mb-4">Colección Retro</h3>
            <div className="flex items-center gap-2 text-white font-bold uppercase text-sm group-hover:text-[#FF5F00] transition-colors">
              Explorar <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Banner 2: Zona de Ofertas */}
        <Link href="/catalog?sale=true" className="relative group block h-75 md:h-100 rounded-xl overflow-hidden">
          {/* Fondo animado */}
          <motion.div 
            className="absolute inset-0 bg-[#1a1a1a]"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image 
              src="/banner-sale.jpg" 
              alt="Zona de Ofertas" 
              fill
              className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 50vw" 
            />
          </motion.div>

          {/* Capa de degrade para legibilidad */}
          <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-transparent to-transparent"></div>

          {/* Contenido */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <p className="text-[#FF5F00] font-black text-xs md:text-sm uppercase tracking-widest mb-2">Stock Limitado</p>
            <h3 className="text-white text-3xl md:text-4xl font-black uppercase mb-4">Zona de Ofertas</h3>
            <div className="flex items-center gap-2 text-white font-bold uppercase text-sm group-hover:text-[#FF5F00] transition-colors">
              Ver descuentos <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}