// src/components/public/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
  const { toggleCart, items } = useCartStore();

  // Sumamos la cantidad de todas las unidades en el carrito
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="px-6 py-5 flex justify-between items-center bg-[#000000] sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black tracking-[2px] uppercase text-white">
        SAEL <span className="text-[#FF5F00]">SPORT</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link href="/catalog" className="text-sm font-bold text-gray-300 hover:text-white uppercase transition-colors">
          Catálogo
        </Link>
        <Link href="/admin" className="text-sm font-bold text-gray-500 hover:text-white uppercase transition-colors">
          Admin
        </Link>
        <button 
          onClick={toggleCart}
          className="flex items-center gap-2 text-white hover:text-[#FF5F00] transition-colors relative group"
        >
          <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">
            Carrito ({totalItems})
          </span>
        </button>
      </div>
    </header>
  );
}