// src/components/public/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, X, User, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
  const { toggleCart, items } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estados y hooks para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Función que se ejecuta al apretar Enter o el ícono de la lupa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false); // Cierra el menú en celu si estaba abierto
    }
  };

  return (
    <header className="bg-[#000000] sticky top-0 z-50 border-b border-[#2a2a2a]">
      
      {/* 1. Top Bar */}
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
      <div className="px-6 py-4 flex justify-between items-center max-w-350 mx-auto gap-4">
        
        <button 
          className="md:hidden text-white hover:text-[#FF5F00] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link href="/" className="text-2xl font-black tracking-[2px] uppercase text-white shrink-0">
          SAEL <span className="text-[#FF5F00]">SPORT</span>
        </Link>
        
        {/* Buscador Central (Desktop) - Ahora es un <form> */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4 relative group">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar equipos, selecciones, retro..." 
            className="w-full bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full border border-[#333] focus:outline-none focus:border-[#FF5F00] focus:bg-[#121212] transition-all text-sm font-medium"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5F00] transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div className="flex items-center gap-5 md:gap-7 shrink-0">
          <Link href="/login" className="hidden md:flex text-white hover:text-[#FF5F00] transition-colors">
            <User size={24} strokeWidth={1.5} />
          </Link>

          <button 
            onClick={toggleCart}
            className="flex items-center gap-2 text-white hover:text-[#FF5F00] transition-colors relative group"
          >
            <div className="relative">
              <ShoppingCart size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
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

      {/* Buscador (Mobile) - Ahora es un <form> */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative w-full">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..." 
            className="w-full bg-[#1a1a1a] text-white px-4 py-2.5 rounded-lg border border-[#333] focus:outline-none focus:border-[#FF5F00] text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5F00]">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* 3. Barra de Categorías Inferior */}
      <nav className="hidden md:flex justify-center items-center gap-10 py-3 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <Link href="/catalog?cat=lpf" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Liga Argentina</Link>
        <Link href="/catalog?cat=europeas" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Ligas Europeas</Link>
        <Link href="/catalog?cat=selecciones" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Selecciones</Link>
        <Link href="/catalog?category=retro" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors">Colección Retro</Link>
        <Link href="/catalog?sale=true" className="text-sm font-black text-[#FF5F00] hover:text-[#e65600] uppercase tracking-wider transition-colors flex items-center gap-1">
          🔥 Ofertas
        </Link>
      </nav>

      {/* Menú Mobile Desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-[#121212] flex flex-col p-6 z-50">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalog?cat=lpf" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Liga Argentina</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalog?cat=europeas" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Ligas Europeas</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalog?cat=selecciones" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Selecciones</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalog?category=retro" className="py-4 font-bold text-lg text-white uppercase border-b border-[#2a2a2a]">Colección Retro</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/catalog?sale=true" className="py-4 font-black text-lg text-[#FF5F00] uppercase border-b border-[#2a2a2a]">🔥 Ofertas</Link>
        </div>
      )}
    </header>
  );
}