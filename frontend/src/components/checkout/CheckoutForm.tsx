// src/components/checkout/CheckoutForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Truck, Landmark } from 'lucide-react';
import { CartItem } from '@/store/useCartStore';

const checkoutSchema = z.object({
  email: z.string().email('El formato del email no es válido'),
  firstName: z.string().min(2, 'El nombre es muy corto'),
  lastName: z.string().min(2, 'El apellido es muy corto'),
  dni: z.string().min(7, 'El DNI debe tener al menos 7 números').regex(/^\d+$/, 'Solo números'),
  phone: z.string().min(8, 'El teléfono no es válido'),
  address: z.string().min(5, 'Ingresá una dirección válida (Ej: San Martín 123)'), // <-- Faltaba el error en pantalla
  city: z.string().min(3, 'Ingresá tu ciudad'),
  zipCode: z.string().min(4, 'Código postal inválido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  onShippingChange: (option: ShippingOption | null) => void;
  onSuccess: () => void;
}

export function CheckoutForm({ items, onShippingChange, onSuccess }: CheckoutFormProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const zipCodeValue = watch('zipCode');

  // Efecto para cotizar envío
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
            setSelectedShipping(data[0]);
            onShippingChange(data[0]); // Le avisamos al padre para que actualice el resumen
          }
        } catch (error) {
          console.error("Error al cotizar:", error);
        } finally {
          setIsFetchingShipping(false);
        }
      };
      const timeoutId = setTimeout(fetchShipping, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setShippingOptions([]);
      setSelectedShipping(null);
      onShippingChange(null);
    }
  }, [zipCodeValue, onShippingChange]);

  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
    onShippingChange(option);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedShipping) return;

    try {
      // JSON exacto que espera NestJS
      const orderPayload = {
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: `${data.address}, ${data.city}`,
        shippingZip: data.zipCode,
        shippingCost: selectedShipping.cost,
        items: items.map(item => ({
          variantId: item.variantId, // <-- Ahora sí existe
          quantity: item.quantity
        }))
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error del servidor: ${errorData.message}`);
        return;
      }

      onSuccess(); // Orden creada, disparamos pantalla de éxito
    } catch (error) {
      console.error("Error al procesar orden:", error);
      alert("Hubo un error de conexión con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
          <input {...register('email')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
          {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Nombre</label>
          <input {...register('firstName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
          {errors.firstName && <p className="text-red-500 text-xs font-bold mt-2">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Apellido</label>
          <input {...register('lastName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
          {errors.lastName && <p className="text-red-500 text-xs font-bold mt-2">{errors.lastName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">DNI</label>
          <input {...register('dni')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
          {errors.dni && <p className="text-red-500 text-xs font-bold mt-2">{errors.dni.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Teléfono</label>
          <input {...register('phone')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
          {errors.phone && <p className="text-red-500 text-xs font-bold mt-2">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
        <h2 className="text-lg font-bold mb-4 uppercase text-[#FF5F00]">Entrega</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Dirección Completa (Calle y Altura)</label>
            <input {...register('address')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
            {errors.address && <p className="text-red-500 text-xs font-bold mt-2">{errors.address.message}</p>} {/* <-- ARREGLADO */}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Ciudad / Localidad</label>
              <input {...register('city')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" />
              {errors.city && <p className="text-red-500 text-xs font-bold mt-2">{errors.city.message}</p>} {/* <-- ARREGLADO */}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Código Postal</label>
              <input {...register('zipCode')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#FF5F00] transition-colors" placeholder="Ej: 1834" />
              {errors.zipCode && <p className="text-red-500 text-xs font-bold mt-2">{errors.zipCode.message}</p>} {/* <-- ARREGLADO */}
            </div>
          </div>
        </div>

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
                      onChange={() => handleShippingSelect(option)}
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
        className="w-full bg-[#FF5F00] hover:bg-[#e65600] text-white font-black text-lg py-4 rounded uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <Landmark size={20} />
        {isSubmitting ? 'Procesando...' : 'Pagar por Transferencia'}
      </button>
    </form>
  );
}