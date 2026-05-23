// src/components/public/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
  const { toggleCart, items } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sumamos la cantidad de todas las unidades en el carrito
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-[#000000] sticky top-0 z-50 border-b border-[#2a2a2a]">
      
      {/* 1. Top Bar - Utilidades (Desktop) */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 bg-[#121212] text-gray-400 text-xs font-bold uppercase tracking-wider">
        <p>Envíos gratis a todo el país desde $80.000</p>
        <div className="flex gap-5">
          <Link href="/tracking" className="hover:text-white flex items-center gap-1.5 transition-colors">
            <Package size={14} /> Seguí tu envío
          </Link>
          <Link href="/faq" className="hover:text-white transition-colors">Ayuda y Contacto</Link>
        </div>
      </div>

      {/* 2. Navbar Principal */}
      <div className="px-6 py-4 flex justify-between items-center max-w-[1400px] mx-auto gap-4">
        
        {/* Menú Hamburguesa (Mobile) */}
        <button 
          className="md:hidden text-white hover:text-[#FF5F00] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-[2px] uppercase text-white shrink-0">
          SAEL <span className="text-[#FF5F00]">SPORT</span>
        </Link>
        
        {/* Buscador Central (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative group">
          <input 
            type="text" 
            placeholder="Buscar equipos, selecciones, retro..." 
            className="w-full bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full border border-[#333] focus:outline-none focus:border-[#FF5F00] focus:bg-[#121212] transition-all text-sm font-medium"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5F00] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Iconos Derecha */}
        <div className="flex items-center gap-5 md:gap-7 shrink-0">
          {/* Mi Cuenta (Solo Desktop) */}
          <Link href="/login" className="hidden md:flex text-white hover:text-[#FF5F00] transition-colors">
            <User size={24} strokeWidth={1.5} />
          </Link>

          {/* Carrito con Burbuja de Notificación */}
          <button 
            onClick={toggleCart}
            className="flex items-center gap-2 text-white hover:text-[#FF5F00] transition-colors relative group"
          >
            <div className="relative">
              <ShoppingCart size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              {/* Burbuja naranja con el número (solo si hay items) */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF5F00] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden md:block text-sm font-bold uppercase tracking-wider">
              Mi Carrito
            </span>
          </button>
        </div>
      </div>

      {/* Buscador (Mobile) - Debajo del logo en celu */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 rounded-lg border border-[#333] focus:outline-none focus:border-[#FF5F00] text-sm"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 3. Barra de Categorías Inferior (Desktop) */}
      <nav className="hidden md:flex justify-center items-center gap-10 py-3 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <Link href="/catalog?cat=lpf" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Liga Argentina</Link>
        <Link href="/catalog?cat=europeas" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Ligas Europeas</Link>
        <Link href="/catalog?cat=selecciones" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Selecciones</Link>
        <Link href="/catalog?category=retro" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Colección Retro</Link>
        <Link href="/catalog?sale=true" className="text-sm font-black text-[#FF5F00] hover:text-[#e65600] uppercase tracking-wider transition-colors flex items-center gap-1">
          🔥 Ofertas
        </Link>
      </nav>

      {/* Menú Desplegable (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full h-screen bg-[#121212] flex flex-col p-6 z-50">
          <Link href="/catalog?cat=lpf" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Liga Argentina</Link>
          <Link href="/catalog?cat=europeas" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Ligas Europeas</Link>
          <Link href="/catalog?cat=selecciones" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Selecciones</Link>
          <Link href="/catalog?category=retro" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Colección Retro</Link>
          <Link href="/catalog?sale=true" className="py-4 font-black text-lg text-[#FF5F00] uppercase border-b border-[#2a2a2a]">🔥 Ofertas</Link>
          
          <div className="mt-8 flex flex-col gap-4">
            <Link href="/tracking" className="py-2 font-bold text-gray-400 flex items-center gap-3"><Package size={20}/> Seguí tu envío</Link>
            <Link href="/login" className="py-2 font-bold text-gray-400 flex items-center gap-3"><User size={20}/> Mi Cuenta</Link>
          </div>
        </div>
      )}
    </header>
  );
}