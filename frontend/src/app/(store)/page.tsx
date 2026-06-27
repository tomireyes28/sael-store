// src/app/(store)/page.tsx
'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsBanner } from '@/components/home/BenefitsBanner';
import { SplitBanners } from '@/components/home/SplitBanners';
import Link from 'next/link';
import Image from 'next/image';
import { SocialGrid } from '@/components/home/SocialGrid';
import { Newsletter } from '@/components/home/Newsletter';

// Importamos el hook real de nuestra base de datos
import { useProducts, Product } from '@/hooks/useProducts';

// Las categorías las dejamos hardcodeadas porque apuntan a tus logos locales que armaste a medida
const categories = [
  { name: 'AFA', detail: 'SELECCIONES', logo: '/logos/afa.png', slug: 'selecciones' },
  { name: 'LPF', detail: 'LIGA ARGENTINA', logo: '/logos/lpf.png', slug: 'lpf' },
  { name: 'ENG', detail: 'PREMIER LEAGUE', logo: '/logos/premier.png', slug: 'europeas' },
  { name: 'ESP', detail: 'LIGA ESPAÑOLA', logo: '/logos/laliga.png', slug: 'europeas' },
  { name: 'ITA', detail: 'SERIE A', logo: '/logos/seriea.png', slug: 'europeas' },
  { name: 'BRA', detail: 'BRASILEIRAO', logo: '/logos/brasileirao.png', slug: 'brasileirao' },
];

export default function HomePage() {
  // Traemos los productos reales de Supabase
  const { products, loading } = useProducts();
  
  // Agarramos solo los primeros 4 para mostrar en destacados
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#121212]">
      
      {/* PUNTO 1: Hero Gigante */}
      <HeroSection />

      {/* PUNTO 2: Tira de Beneficios */}
      <BenefitsBanner />

      <main className="max-w-300 mx-auto py-16 px-6">
        
        {/* PUNTO 3: Comprar por Categoría */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Comprar por categoría</h2>
            <Link href="/catalog" className="text-[#FF5F00] text-sm font-bold uppercase hover:underline">Ver todas →</Link>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-10 items-start justify-center">
            {categories.map((cat, index) => (
              <Link href={`/catalog?cat=${cat.slug}`} key={index} className="flex flex-col items-center justify-center w-30 group cursor-pointer">
                <div className="relative w-25 h-25 rounded-full border-2 border-[#333] flex items-center justify-center bg-[#1e1e1e] mb-4 group-hover:border-[#FF5F00] group-hover:scale-105 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(255,95,0,0.2)] overflow-hidden">
                  <Image 
                    src={cat.logo} 
                    alt={cat.name} 
                    fill
                    className="object-contain p-5 group-hover:scale-110 transition-transform duration-300"
                    sizes="100px"
                  />
                </div>
                <span className="text-gray-400 text-xs font-bold text-center uppercase tracking-tight line-clamp-1">{cat.detail}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* PUNTO 4: Productos Destacados (Conectado a la Base de Datos) */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-10 border-b border-[#2a2a2a] pb-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Ingresos más buscados</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF5F00]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product: Product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(255,95,0,0.15)] transition-all flex flex-col"
                >
                  <Link href={`/product/${product.slug}`} className="block relative aspect-4/5 bg-black p-4 items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill
                        className="object-cover p-4 group-hover:scale-105 transition-transform duration-500" 
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="text-gray-500 text-xs">Sin imagen</div>
                    )}
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1">
                    {/* Usamos el nombre de la categoría real, o "Nuevo Ingreso" por defecto */}
                    <p className="text-[#FF5F00] text-[10px] font-black uppercase tracking-widest mb-1">
                      {product.category?.name || 'NUEVO INGRESO'}
                    </p>
                    <h3 className="text-white text-base font-bold mb-1 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex justify-between items-end">
                      <p className="text-white text-2xl font-black">${product.price.toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* PUNTO 5: Banners Intermedios */}
        <SplitBanners />

      </main>
      
      {/* PUNTO 6: Grilla Social */}
      <SocialGrid />
      
      {/* PUNTO 7: Newsletter */}
      <Newsletter />
      
    </div>
  );
}