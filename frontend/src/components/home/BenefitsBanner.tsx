// src/components/home/BenefitsBanner.tsx
import { Truck, Landmark, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: "Envíos a todo el país",
    description: "Recibí en tu puerta con Correo Argentino / Andreani.",
  },
  {
    icon: Landmark,
    title: "Pagá como quieras",
    description: "Aceptamos Transferencia (CBU) y Mercado Pago.",
  },
  {
    icon: ShieldCheck,
    title: "Compra 100% Segura",
    description: "Tus datos y tu pedido protegidos de principio a fin.",
  },
];

export function BenefitsBanner() {
  return (
    // Responsivo: grid de 1 columna en celu, 3 en compu
    <section className="bg-[#1a1a1a] border-y border-[#2a2a2a] py-8 px-6">
      <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div 
              key={index} 
              className="flex items-start md:items-center gap-4 text-white p-4"
            >
              <div className="bg-[#121212] p-3 rounded-lg border border-[#333]">
                <Icon className="text-[#FF5F00] w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-bold text-base uppercase tracking-wider">{benefit.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}