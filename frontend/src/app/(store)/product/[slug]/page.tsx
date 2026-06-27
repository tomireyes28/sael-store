// src/app/(store)/product/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { SizeSelector } from '@/components/public/SizeSelector';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

// 1. Definimos interfaces estrictas para este componente
interface ProductVariant {
  id: string;
  size: string;
  stock: number;
}

interface DetailProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: { name: string };
  images?: string[];
  variants?: ProductVariant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { product, loading, error } = useProduct(slug);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const addItem = useCartStore((state) => state.addItem);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5F00]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center text-white">
        <h2 className="text-xl font-bold">Producto no encontrado</h2>
      </div>
    );
  }

  // 2. Casteamos el producto genérico a nuestra interfaz estricta
  const detailProduct = product as unknown as DetailProduct;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('¡Por favor seleccioná un talle primero!');
      return;
    }

    // 3. Optional Chaining (?.) para prevenir el error de undefined
    const variant = detailProduct.variants?.find(v => v.size === selectedSize);

    if (!variant) {
      alert('Error: No se encontró el stock para este talle.');
      return;
    }

    addItem({
      variantId: variant.id,
      productId: detailProduct.id,
      name: detailProduct.name,
      price: detailProduct.price,
      size: selectedSize,
      image: detailProduct.images?.[0] || '',
      maxStock: variant.stock
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-12 px-6">
      {/* 4. Corregimos el warning de Tailwind (max-w-[1200px] -> max-w-300) */}
      <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Columna Izquierda: Imagen */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          // 5. Corregimos aspect-[4/5] -> aspect-4/5 y agregamos relative/overflow-hidden para el Image de Next.js
          className="bg-[#1e1e1e] rounded-xl flex items-center justify-center border border-[#2a2a2a] aspect-4/5 relative overflow-hidden shadow-2xl"
        >
          {detailProduct.images && detailProduct.images.length > 0 ? (
            // 6. Implementamos next/image optimizado con fill
            <Image 
              src={detailProduct.images[0]} 
              alt={detailProduct.name} 
              fill
              priority // Le dice a Next.js que cargue esta imagen rápido porque es principal (LCP)
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <span className="text-[#555]">Sin imagen</span>
          )}
        </motion.div>

        {/* Columna Derecha: Detalles */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-2 text-[#FF5F00] font-black text-sm uppercase tracking-widest">
            {detailProduct.category?.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {detailProduct.name}
          </h1>
          <div className="text-3xl font-black mb-8 text-[#ccc]">
            ${detailProduct.price.toLocaleString('es-AR')}
          </div>

          <p className="text-[#888] mb-8 leading-relaxed">
            {detailProduct.description || 'Versión importada de alta calidad. Tela premium con tecnología de ventilación avanzada.'}
          </p>

          <SizeSelector 
            // 7. Usamos el Nullish Coalescing (?? []) para asegurar que siempre pasamos un array
            variants={detailProduct.variants ?? []} 
            selectedSize={selectedSize} 
            onSelectSize={setSelectedSize} 
          />

          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#FF5F00] hover:bg-[#e65600] text-white font-black text-lg py-4 px-6 rounded uppercase transition-colors shadow-[0_0_20px_rgba(255,95,0,0.3)] hover:shadow-[0_0_30px_rgba(255,95,0,0.5)] flex justify-center items-center gap-3 mb-8"
          >
            <ShoppingCart size={24} />
            Agregar al carrito
          </button>

          <div className="grid grid-cols-2 gap-4 border-t border-[#2a2a2a] pt-8">
            <div className="flex items-center gap-3 text-[#888]">
              <Truck className="text-[#FF5F00]" size={24} />
              <span className="text-sm font-bold uppercase">Envíos a todo el país</span>
            </div>
            <div className="flex items-center gap-3 text-[#888]">
              <ShieldCheck className="text-[#FF5F00]" size={24} />
              <span className="text-sm font-bold uppercase">Compra Segura</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}