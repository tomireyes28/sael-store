// src/components/public/Navbar.tsx
'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="px-6 py-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
      <Link href="/" className="text-2xl font-black tracking-tighter">
        SAEL<span className="text-blue-500">.</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/catalog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Catálogo
        </Link>
        <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
          Ingreso Admin
        </Link>
      </div>
    </nav>
  );
}