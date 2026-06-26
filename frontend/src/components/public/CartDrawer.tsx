// src/components/public/CartDrawer.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCartStore();

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Problema de hidratación de Next.js: Necesitamos asegurarnos de que estamos en el cliente
  // antes de renderizar los items que vienen de localStorage.
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />

          {/* Panel Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-100 bg-[#121212] border-l border-[#2a2a2a] z-70 flex flex-col shadow-2xl"
          >
            {/* Cabecera del Carrito */}
            <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#FF5F00]" /> Mi Carrito
              </h2>
              <button onClick={toggleCart} className="text-[#888] hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[#888]">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">Tu carrito está vacío.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-[#1e1e1e] rounded overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">{item.name}</h3>
                            <button onClick={() => removeItem(item.id)} className="text-[#555] hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-[#FF5F00] font-bold mt-1">Talle: {item.size}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="text-[#888] hover:text-white"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, Math.min(item.maxStock, item.quantity + 1))}
                              className="text-[#888] hover:text-white"
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-black text-white">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pie del Carrito (Total y Checkout) */}
            {items.length > 0 && (
              <div className="p-6 bg-[#0a0a0a] border-t border-[#2a2a2a]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#888] uppercase text-sm font-bold">Total a pagar</span>
                  <span className="text-2xl font-black text-white">${totalAmount.toLocaleString('es-AR')}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="block w-full bg-[#FF5F00] hover:bg-[#e65600] text-white text-center font-black py-4 rounded uppercase transition-colors">
                  Iniciar Pago Seguro
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}