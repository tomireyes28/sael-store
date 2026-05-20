// src/app/(store)/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsBanner } from '@/components/home/BenefitsBanner';
import { SplitBanners } from '@/components/home/SplitBanners';
import Link from 'next/link';
import { SocialGrid } from '@/components/home/SocialGrid';
import { Newsletter } from '@/components/home/Newsletter';

// Mock de categorías (para los circulitos)
const categories = [
  { name: 'AFA', detail: 'SELECCIONES' },
  { name: 'LPF', detail: 'LIGA ARGENTINA' },
  { name: 'ENG', detail: 'PREMIER LEAGUE' },
  { name: 'ESP', detail: 'LIGA ESPAÑOLA' },
  { name: 'ITA', detail: 'SERIE A' },
  { name: 'BRA', detail: 'BRASILEIRAO' },
];

// Mock de productos (para las camisetas de abajo)
const products = [
  { id: '1', name: 'Argentina Titular 2024', detail: 'VERSIÓN JUGADOR - IMPORTADA', price: 45000, img: '/camiseta_placeholder.png' },
  { id: '2', name: 'Boca Juniors Alternativa 2024', detail: 'CALIDAD NACIONAL', price: 35000, img: '/camiseta_placeholder.png' },
];

export default function HomePage() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="min-h-screen bg-[#121212]">
      
      {/* PUNTO 1: Hero Gigante (MODULAR) */}
      <HeroSection />

      {/* PUNTO 2: Tira de Beneficios (MODULAR) */}
      <BenefitsBanner />

      <main className="max-w-[1200px] mx-auto py-16 px-6">
        
        {/* PUNTO 3: Comprar por Categoría */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Comprar por categoría</h2>
            <Link href="/catalog" className="text-[#FF5F00] text-sm font-bold uppercase hover:underline">Ver todas →</Link>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-10 items-start justify-center">
            {categories.map((cat, index) => (
              <div key={index} className="flex flex-col items-center justify-center w-[120px] group cursor-pointer">
                <div className="w-[100px] h-[100px] rounded-full border-2 border-[#333] flex items-center justify-center bg-[#1e1e1e] mb-4 text-white font-bold group-hover:border-[#FF5F00] group-hover:scale-105 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(255,95,0,0.2)]">
                  {cat.name}
                </div>
                <span className="text-gray-400 text-xs font-bold text-center uppercase tracking-tight line-clamp-1">{cat.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PUNTO 4: Productos Destacados */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Ingresos más buscados</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,95,0,0.15)] transition-all"
              >
                <Link href={`/product/temp`}>
                  <div className="aspect-[4/5] bg-black p-4 flex items-center justify-center">
                    <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </Link>
                
                <div className="p-5 flex flex-col h-[180px]">
                  <p className="text-[#FF5F00] text-[10px] font-black uppercase tracking-widest mb-1">{product.detail}</p>
                  <h3 className="text-white text-base font-bold mb-1 leading-snug line-clamp-2">{product.name}</h3>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <p className="text-white text-2xl font-black">${product.price.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PUNTO 5: Banners Intermedios (Split Banners) */}
        <SplitBanners />

      </main>
      {/* PUNTO 6: Grilla Social (MODULAR) */}
      <SocialGrid />
      {/* PUNTO 7: Newsletter (MODULAR) */}
      <Newsletter />
    </div>
  );
}