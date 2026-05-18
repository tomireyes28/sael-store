// src/app/(store)/checkout/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Definimos las reglas de validación (Zod)
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

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#121212] flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-3xl font-black uppercase mb-4">Tu carrito está vacío</h2>
        <p className="text-[#888] mb-8">Necesitás agregar productos para procesar el pago.</p>
        <Link href="/catalog" className="bg-[#FF5F00] hover:bg-[#e65600] text-white font-bold py-3 px-8 rounded uppercase transition-colors">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    // Acá en la Fase 5 conectaremos con Mercado Pago y Envíos
    console.log('Datos validados listos para procesar:', data);
    console.log('Carrito a cobrar:', items);
    alert('Datos validados correctamente. Listo para integrar Mercado Pago.');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-[#888] hover:text-[#FF5F00] transition-colors font-bold uppercase text-sm mb-8">
          <ArrowLeft size={18} /> Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-black uppercase tracking-wider mb-8 flex items-center gap-3">
              Datos de Facturación y Envío
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
                <h2 className="text-lg font-bold mb-4 uppercase text-[#FF5F00]">Contacto</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                  <input
                    {...register('email')}
                    className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors"
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email.message}</p>}
                </div>
              </div>

              {/* Datos Personales */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
                <h2 className="text-lg font-bold mb-4 uppercase text-[#FF5F00]">Identificación</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Nombre</label>
                    <input {...register('firstName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                    {errors.firstName && <p className="text-red-500 text-xs font-bold mt-2">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Apellido</label>
                    <input {...register('lastName')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                    {errors.lastName && <p className="text-red-500 text-xs font-bold mt-2">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">DNI / CUIL</label>
                    <input {...register('dni')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                    {errors.dni && <p className="text-red-500 text-xs font-bold mt-2">{errors.dni.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Teléfono</label>
                    <input {...register('phone')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                    {errors.phone && <p className="text-red-500 text-xs font-bold mt-2">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
                <h2 className="text-lg font-bold mb-4 uppercase text-[#FF5F00]">Entrega</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Dirección Completa (Calle y Altura)</label>
                    <input {...register('address')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" placeholder="Av. Corrientes 1234, Piso 5 Depto B" />
                    {errors.address && <p className="text-red-500 text-xs font-bold mt-2">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Ciudad / Localidad</label>
                      <input {...register('city')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                      {errors.city && <p className="text-red-500 text-xs font-bold mt-2">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">Código Postal</label>
                      <input {...register('zipCode')} className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#FF5F00] transition-colors" />
                      {errors.zipCode && <p className="text-red-500 text-xs font-bold mt-2">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FF5F00] hover:bg-[#e65600] text-white font-black text-lg py-4 rounded uppercase transition-colors shadow-[0_0_15px_rgba(255,95,0,0.3)] disabled:opacity-50"
              >
                Continuar al pago
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen de Compra */}
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
                  <span>Envío</span>
                  <span className="text-xs italic">Se calcula en el próximo paso</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                  <span className="text-lg font-black uppercase">Total</span>
                  <span className="text-3xl font-black">${totalAmount.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="mt-8 bg-[#121212] p-4 rounded border border-[#333] flex items-center gap-3 text-[#888]">
                <ShieldCheck className="text-[#FF5F00]" size={24} />
                <p className="text-xs font-medium">Tus datos están protegidos. El pago se procesará de forma segura a través de Mercado Pago.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}