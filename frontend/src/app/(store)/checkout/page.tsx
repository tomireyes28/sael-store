// src/app/(store)/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Truck, Landmark } from 'lucide-react';

const checkoutSchema = z.object({
  email: z.string().email('El formato del email no es válido'),
  firstName: z.string().min(2, 'El nombre es muy corto'),
  lastName: z.string().min(2, 'El apellido es muy corto'),
  dni: z.string().min(7, 'El DNI debe tener al menos 7 números').regex(/^\d+$/, 'Solo números'),
  phone: z.string().min(8, 'El teléfono no es válido'),
  address: z.string().min(5, 'Ingresá una dirección válida'),
  city: z.string().min(3, 'Ingresá tu ciudad'),
  zipCode: z.string().min(4, 'Código postal inválido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Tipo para las opciones de envío que vienen del backend
interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const finalTotal = totalAmount + (selectedShipping?.cost || 0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Espiamos el campo del código postal
  const zipCodeValue = watch('zipCode');

  // Efecto para buscar los envíos cuando cambia el CP
  useEffect(() => {
    if (zipCodeValue && zipCodeValue.length >= 4) {
      const fetchShipping = async () => {
        setIsFetchingShipping(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const res = await fetch(`${apiUrl}/shipping/calculate/${zipCodeValue}`);
          if (res.ok) {
            const data = await res.json();
            setShippingOptions(data);
            setSelectedShipping(data[0]); // Seleccionamos la primera opción por defecto
          }
        } catch (error) {
          console.error("Error al cotizar envío:", error);
        } finally {
          setIsFetchingShipping(false);
        }
      };
      // Pequeño timeout para no saturar al backend en cada tecla (Debounce simple)
      const timeoutId = setTimeout(fetchShipping, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setShippingOptions([]);
      setSelectedShipping(null);
    }
  }, [zipCodeValue]);

  // Pantalla de Éxito (Transferencia)
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

  // Redirigir si el carrito está vacío
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

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedShipping) {
      alert("Por favor, ingresá un Código Postal válido y seleccioná un método de envío.");
      return;
    }

    console.log('Facturación:', data);
    console.log('Envío Elegido:', selectedShipping);
    console.log('Carrito:', items);
    
    // Acá simulamos que guardamos la orden en el Backend
    setOrderSuccess(true);
    clearCart(); // Vaciamos el carrito porque ya compró
  };

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email e Identificación... (Se mantienen igual que antes) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                  <input {...register('email')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                  {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Nombre</label>
                  <input {...register('firstName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                  {errors.firstName && <p className="text-red-500 text-xs font-bold mt-2">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Apellido</label>
                  <input {...register('lastName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">DNI</label>
                  <input {...register('dni')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Teléfono</label>
                  <input {...register('phone')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                </div>
              </div>

              {/* Dirección */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
                <h2 className="text-lg font-bold mb-4 uppercase text-[#FF5F00]">Entrega</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Dirección Completa (Calle y Altura)</label>
                    <input {...register('address')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Ciudad / Localidad</label>
                      <input {...register('city')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Código Postal</label>
                      <input {...register('zipCode')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" placeholder="Ej: 1834" />
                    </div>
                  </div>
                </div>

                {/* --- OPCIONES DE ENVÍO DINÁMICAS --- */}
                {isFetchingShipping && <p className="text-[#FF5F00] text-sm mt-4 italic animate-pulse">Cotizando envíos...</p>}
                
                {shippingOptions.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#333]">
                    <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2"><Truck size={16}/> Opciones disponibles para CP: {zipCodeValue}</h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label 
                          key={option.id} 
                          className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${selectedShipping?.id === option.id ? 'border-[#FF5F00] bg-[#121212]' : 'border-[#333] bg-[#1a1a1a] hover:border-[#555]'}`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="shipping" 
                              value={option.id}
                              checked={selectedShipping?.id === option.id}
                              onChange={() => setSelectedShipping(option)}
                              className="accent-[#FF5F00] w-4 h-4"
                            />
                            <div>
                              <p className="font-bold text-sm">{option.name}</p>
                              <p className="text-xs text-[#888]">{option.estimatedDays}</p>
                            </div>
                          </div>
                          <span className="font-black text-[#FF5F00]">
                            {option.cost === 0 ? '¡GRATIS!' : `$${option.cost}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !selectedShipping}
                className="w-full bg-[#FF5F00] hover:bg-[#e65600] text-white font-black text-lg py-4 rounded uppercase transition-colors shadow-[0_0_15px_rgba(255,95,0,0.3)] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <Landmark size={20} />
                Pagar por Transferencia
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen de Compra Actualizado */}
          <div className="lg:col-span-5">
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
                  <span>${totalAmount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-[#888] font-bold text-sm">
                  <span>Envío {selectedShipping ? `(${selectedShipping.name})` : ''}</span>
                  <span className={selectedShipping && selectedShipping.cost === 0 ? "text-green-500" : "text-white"}>
                    {selectedShipping ? (selectedShipping.cost === 0 ? 'Gratis' : `$${selectedShipping.cost.toLocaleString('es-AR')}`) : 'Se calcula al ingresar el CP'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                  <span className="text-lg font-black uppercase">Total a pagar</span>
                  <span className="text-3xl font-black">${finalTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}