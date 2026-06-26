// src/app/(store)/catalog/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { ShoppingCart, Filter, SearchX } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts, Product } from '@/hooks/useProducts';

// DICCIONARIO DE GRUPOS AMPLIADO
const categoryGroups: Record<string, string[]> = {
  'europeas': [
    'serie a', 'serie-a', 'ita',
    'liga española', 'liga-española', 'la liga', 'esp',
    'premier league', 'premier-league', 'eng',
    'bundesliga', 'ligue 1'
  ],
  'lpf': ['liga argentina', 'liga-argentina', 'lpf', 'argentina'],
  'selecciones': ['selecciones', 'nacional', 'nacionales', 'afa'],
  'retro': ['retro', 'coleccion retro', 'colección retro', 'vintage']
};

export default function CatalogPage() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  
  const categoryFilter = searchParams.get('category') || searchParams.get('cat');
  const searchQuery = searchParams.get('q'); // <-- Leemos el texto del buscador

  // LÓGICA DE FILTRADO MAESTRA (Filtra por Buscador o por Categoría)
  const displayProducts = products.filter((p: Product) => {
    // 1. Si el usuario usó la barra de búsqueda superior
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchCat = p.category?.name?.toLowerCase().includes(query);
      return matchName || matchCat;
    }

    // 2. Si el usuario hizo clic en una categoría
    if (categoryFilter) {
      const filterLower = categoryFilter.toLowerCase();
      const catSlug = p.category?.slug?.toLowerCase() || '';
      const catName = p.category?.name?.toLowerCase() || '';
      
      if (categoryGroups[filterLower]) {
        return categoryGroups[filterLower].some(
          (keyword) => catSlug.includes(keyword) || catName.includes(keyword)
        );
      }
      return catSlug === filterLower || catName === filterLower;
    }

    // 3. Si no hay filtros, muestra todo
    return true;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Título dinámico
  let pageTitle = 'Todo el Catálogo';
  if (searchQuery) {
    pageTitle = `Resultados para "${searchQuery}"`;
  } else if (categoryFilter) {
    if (categoryFilter.toLowerCase() === 'europeas') {
      pageTitle = 'Ligas Europeas';
    } else if (categoryFilter.toLowerCase() === 'lpf') {
      pageTitle = 'Liga Argentina';
    } else {
      pageTitle = `Sección: ${categoryFilter.replace('-', ' ')}`;
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-8 pb-24">
      <div className="max-w-300 mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
              {pageTitle}
            </h1>
            <p className="text-[#888]">
              {displayProducts.length} {displayProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded transition-colors uppercase text-sm font-bold border border-[#444]">
            <Filter size={16} />
            Filtrar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5F00]"></div>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] flex flex-col items-center">
            <SearchX size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl text-white font-bold mb-2">No encontramos resultados</h3>
            <p className="text-[#888]">Probá buscando con otras palabras o navegando por las categorías.</p>
            <Link href="/catalog" className="mt-6 text-[#FF5F00] font-bold hover:underline uppercase text-sm">
              Volver al catálogo completo
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {displayProducts.map((product: Product) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-[#1e1e1e] p-5 rounded-lg text-center flex flex-col group border border-transparent hover:border-[#333] transition-colors shadow-lg"
              >
                <Link href={`/product/${product.slug}`} className="block relative w-full aspect-4/5 bg-[#2a2a2a] rounded overflow-hidden mb-4">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-[#555] text-sm">
                      Sin foto
                    </div>
                  )}
                  {product.category && (
                    <div className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-1 uppercase rounded z-10">
                      {product.category.name}
                    </div>
                  )}
                </Link>
                
                <h3 className="text-[15px] font-bold text-white mb-2 line-clamp-2 min-h-11 flex items-center justify-center leading-tight">
                  {product.name}
                </h3>
                
                <div className="text-xl font-black text-white mb-5 mt-auto">
                  ${product.price.toLocaleString('es-AR')}
                </div>
                
                <Link 
                  href={`/product/${product.slug}`}
                  className="w-full bg-[#333] group-hover:bg-[#FF5F00] text-white font-bold py-3 px-4 rounded uppercase transition-colors duration-300 flex justify-center items-center gap-2 text-sm"
                >
                  <ShoppingCart size={18} />
                  Ver Detalle
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}