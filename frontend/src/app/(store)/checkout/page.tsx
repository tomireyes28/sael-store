// src/app/(store)/checkout/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { CheckoutForm, ShippingOption } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = totalAmount + (selectedShipping?.cost || 0);

  const handleSuccess = () => {
    setOrderSuccess(true);
    clearCart();
  };

  // Pantalla de Éxito
  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] bg-[#121212] flex flex-col items-center justify-center text-white px-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
          <ShieldCheck size={40} className="text-[#121212]" />
        </div>
        <h2 className="text-3xl font-black uppercase mb-4">¡Pedido Reservado!</h2>
        <p className="text-[#888] mb-8 max-w-md">
          Para procesar el envío, por favor realizá una transferencia de <strong className="text-white">${finalTotal.toLocaleString('es-AR')}</strong> al siguiente CBU:
        </p>
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] p-6 rounded-lg mb-8 w-full max-w-md">
          <p className="text-sm text-gray-400 mb-1">CBU / CVU</p>
          <p className="font-mono text-xl font-bold mb-4 text-[#FF5F00]">000000310001234567890</p>
          <p className="text-sm text-gray-400 mb-1">Alias</p>
          <p className="font-mono text-xl font-bold text-[#FF5F00]">SAEL.SPORT.MP</p>
        </div>
        <Link href="/" className="bg-[#333] hover:bg-[#444] text-white font-bold py-3 px-8 rounded uppercase transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Pantalla de Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#121212] flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-3xl font-black uppercase mb-4">Tu carrito está vacío</h2>
        <Link href="/catalog" className="bg-[#FF5F00] hover:bg-[#e65600] text-white font-bold py-3 px-8 rounded uppercase transition-colors">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  // Layout Principal
  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-[#888] hover:text-[#FF5F00] transition-colors font-bold uppercase text-sm mb-8">
          <ArrowLeft size={18} /> Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-black uppercase tracking-wider mb-8 flex items-center gap-3">
              Datos de Envío y Facturación
            </h1>
            <CheckoutForm 
              items={items} 
              onShippingChange={setSelectedShipping} 
              onSuccess={handleSuccess} 
            />
          </div>

          <div className="lg:col-span-5">
            <OrderSummary 
              items={items} 
              shippingCost={selectedShipping?.cost ?? null} 
              shippingName={selectedShipping?.name ?? null} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}