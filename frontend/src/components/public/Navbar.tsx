// src/components/public/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export function Navbar() {
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
        <button className="flex items-center gap-2 text-white hover:text-[#FF5F00] transition-colors">
          <ShoppingCart size={20} />
          <span className="text-sm font-bold">Carrito (0)</span>
        </button>
      </div>
    </header>
  );
}