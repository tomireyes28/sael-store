// src/components/checkout/OrderSummary.tsx
'use client';

import { CartItem } from '@/store/useCartStore';

interface OrderSummaryProps {
  items: CartItem[];
  shippingCost: number | null;
  shippingName: string | null;
}

export function OrderSummary({ items, shippingCost, shippingName }: OrderSummaryProps) {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = subtotal + (shippingCost || 0);

  return (
    <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a] sticky top-24">
      <h2 className="text-xl font-black uppercase mb-6">Resumen de Compra</h2>
      
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="w-16 h-20 bg-[#121212] rounded overflow-hidden flex-shrink-0 border border-[#333]">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
              <p className="text-xs text-[#888] mt-1">Talle: {item.size} | Cant: {item.quantity}</p>
            </div>
            <div className="font-bold text-[#FF5F00]">
              ${(item.price * item.quantity).toLocaleString('es-AR')}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#333] pt-6 space-y-3">
        <div className="flex justify-between text-[#888] font-bold text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex justify-between text-[#888] font-bold text-sm">
          <span>Envío {shippingName ? `(${shippingName})` : ''}</span>
          <span className={shippingCost === 0 ? "text-green-500" : "text-white"}>
            {shippingCost !== null ? (shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`) : 'Se calcula con el CP'}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-[#333]">
          <span className="text-lg font-black uppercase">Total a pagar</span>
          <span className="text-3xl font-black">${finalTotal.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );
}