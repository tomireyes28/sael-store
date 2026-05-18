// src/app/(store)/catalog/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Filter } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function CatalogPage() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // Filtramos los productos si viene una categoría por la URL
  const displayProducts = categoryFilter
    ? products.filter(p => p.category?.slug === categoryFilter)
    : products;

  // Configuraciones de animación de Framer Motion para efecto "cascada"
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-8 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Cabecera del Catálogo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
              {categoryFilter ? `Liga: ${categoryFilter.replace('-', ' ')}` : 'Todo el Catálogo'}
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

        {/* Estado de Carga */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5F00]"></div>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
            <h3 className="text-xl text-white font-bold mb-2">No hay productos en esta categoría</h3>
            <p className="text-[#888]">Pronto agregaremos más stock.</p>
          </div>
        ) : (
          /* Grilla Animada */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {displayProducts.map((product) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-[#1e1e1e] p-5 rounded-lg text-center flex flex-col group border border-transparent hover:border-[#333] transition-colors shadow-lg"
              >
                {/* Contenedor de Imagen */}
                <div className="w-full aspect-[4/5] bg-[#2a2a2a] rounded overflow-hidden mb-4 relative">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-[#555] text-sm">
                      Sin foto
                    </div>
                  )}
                  {/* Badge de "Nuevo" o "Categoría" */}
                  <div className="absolute top-2 left-2 bg-[#FF5F00] text-white text-[10px] font-black px-2 py-1 uppercase rounded">
                    {product.category?.name || 'SAEL'}
                  </div>
                </div>
                
                <h3 className="text-[15px] font-bold text-white mb-2 line-clamp-2 min-h-[44px] flex items-center justify-center leading-tight">
                  {product.name}
                </h3>
                
                <div className="text-xl font-black text-white mb-5 mt-auto">
                  ${product.price.toLocaleString('es-AR')}
                </div>
                
                <button className="w-full bg-[#333] group-hover:bg-[#FF5F00] text-white font-bold py-3 px-4 rounded uppercase transition-colors duration-300 flex justify-center items-center gap-2 text-sm">
                  <ShoppingCart size={18} />
                  Ver Detalle
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}