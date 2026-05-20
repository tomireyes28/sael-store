// src/components/home/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = "VISTIENDO PASIÓN",
  subtitle = "Importaciones Premium. Calidad Jugador garantizada.",
  backgroundImage = "https://images.unsplash.com/photo-1579952395544-3715f124c151?q=80&w=2000&auto=format&fit=crop", // Imagen de stock de fútbol oscura
  ctaText = "Ver Catálogo",
  ctaLink = "/catalog",
}: HeroSectionProps) {
  return (
    // relative y h-screen para que ocupe todo el alto inicial del celu/compu
    <section className="relative h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* 1. Imagen de Fondo con Zoom sutil (motion) */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={backgroundImage} 
          alt="SAEL Sport Hero" 
          className="w-full h-full object-cover" 
        />
        {/* 2. Filtro oscuro (Overlay) para que el texto resalte */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/40"></div>
      </motion.div>

      {/* 3. Contenido de Texto (SRP: Solo se encarga de la UI) */}
      <div className="relative z-10 max-w-[800px] mx-auto text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#FF5F00] font-black text-xs md:text-sm uppercase tracking-widest mb-3"
        >
          SAEL SPORT - TIENDA OFICIAL
        </motion.p>
        
        {/* Título responsivo: más grande en PC */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white text-5xl md:text-7xl font-black leading-[0.95] uppercase mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Botón CTA (Call To Action) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href={ctaLink} 
            className="inline-block bg-[#FF5F00] hover:bg-[#e65600] text-white font-black text-lg py-4 px-10 rounded uppercase transition-all shadow-[0_0_20px_rgba(255,95,0,0.3)] hover:scale-105"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}