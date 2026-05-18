// src/app/(store)/page.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const leagues = [
  { id: 'selecciones', name: 'Selecciones', logo: 'AFA' },
  { id: 'liga-argentina', name: 'Liga Argentina', logo: 'LPF' },
  { id: 'premier-league', name: 'Premier League', logo: 'ENG' },
  { id: 'la-liga', name: 'Liga Española', logo: 'ESP' },
  { id: 'serie-a', name: 'Serie A', logo: 'ITA' },
  { id: 'brasileirao', name: 'Brasileirao', logo: 'BRA' },
  { id: 'retro', name: 'Retro', logo: '★' },
];

const featuredProducts = [
  {
    id: '1',
    name: 'Argentina Titular 2024',
    quality: 'Versión Jugador - Importada',
    price: 45000,
  },
  {
    id: '2',
    name: 'Boca Juniors Alternativa 2024',
    quality: 'Calidad Nacional',
    price: 35000,
  }
];

export default function HomePage() {
  return (
    <div className="bg-[#121212] min-h-screen text-white pb-20">
      
      {/* Banner Principal (Hero) adaptado al nuevo estilo */}
      <section className="relative w-full h-[40vh] md:h-[60vh] bg-[#0a0a0a] flex items-center justify-center border-b border-[#2a2a2a]">
        <div className="text-center z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-black tracking-widest text-white uppercase"
          >
            Vistiendo <span className="text-[#FF5F00]">Pasión</span>
          </motion.h2>
        </div>
        {/* Overlay oscuro para darle profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-80" />
      </section>

      {/* Sección: Comprar por Categoría */}
      <section className="max-w-[1200px] mx-auto mt-[-20px] relative z-20">
        <div className="bg-[#2a2a2a] px-6 md:px-10 py-3 flex justify-between items-center border-b-2 border-[#FF5F00]">
          <span className="font-bold text-sm md:text-base uppercase tracking-wider">Comprar por Categoría</span>
          <Link href="/catalog" className="text-[#ccc] hover:text-white text-sm font-semibold transition-colors uppercase flex items-center gap-2">
            Ver todas <span>➔</span>
          </Link>
        </div>

        {/* Grilla Circular de Ligas */}
        <div className="bg-[#1a1a1a] p-8 md:p-12 flex flex-wrap justify-center gap-8 md:gap-12">
          {leagues.map((league, index) => (
            <Link href={`/catalog?category=${league.id}`} key={league.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col items-center gap-3 w-[100px] md:w-[120px] cursor-pointer"
              >
                <div className="w-[80px] h-[80px] bg-[#333] rounded-full flex items-center justify-center text-[#888] font-bold text-xl group-hover:scale-110 group-hover:bg-[#444] group-hover:shadow-[0_5px_15px_rgba(255,95,0,0.3)] transition-all duration-300">
                  {/* Acá después reemplazamos el texto por la etiqueta <img src={league.logoUrl} /> real */}
                  {league.logo}
                </div>
                <span className="text-[13px] font-bold text-[#888] text-center uppercase leading-tight group-hover:text-[#FF5F00] transition-colors">
                  {league.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección: Productos Destacados */}
      <section className="max-w-[1200px] mx-auto mt-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-[#1e1e1e] p-5 rounded-lg text-center flex flex-col"
            >
              <div className="w-full aspect-[4/5] bg-[#2a2a2a] rounded overflow-hidden mb-4 flex items-center justify-center text-[#555]">
                <span className="text-sm">Foto Camiseta Acá</span>
              </div>
              
              <h3 className="text-lg font-bold mb-1 line-clamp-2 min-h-[56px] flex items-center justify-center">
                {product.name}
              </h3>
              
              <p className="text-xs text-[#888] uppercase mb-4">
                {product.quality}
              </p>
              
              <div className="text-2xl font-bold mb-5 mt-auto">
                ${product.price.toLocaleString('es-AR')}
              </div>
              
              <button className="w-full bg-[#FF5F00] hover:bg-[#e65600] text-white font-bold py-3 px-4 rounded uppercase transition-colors flex justify-center items-center gap-2">
                <ShoppingCart size={18} />
                Agregar al carrito
              </button>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}