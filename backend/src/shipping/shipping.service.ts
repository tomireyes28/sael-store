// backend/src/shipping/shipping.service.ts
import { Injectable } from '@nestjs/common';

export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
}

@Injectable()
export class ShippingService {
  
  // En el futuro, acá inyectaremos HttpService para pegarle a la API de Andreani/Envíopack
  
  calculateShipping(zipCode: string): ShippingOption[] {
    const cp = parseInt(zipCode, 10);
    
    // Si no pone un número válido, le tiramos un genérico
    if (isNaN(cp)) {
      return [
        { id: 'standard', name: 'Envío a Domicilio Estándar', cost: 7500, estimatedDays: '5-7 días hábiles' }
      ];
    }

    // Regla 1: Zona Sur (Ej: 1832 Lomas, 1834 Temperley, 1828 Banfield)
    if (cp >= 1820 && cp <= 1840) {
      return [
        { id: 'pickup', name: 'Retiro por sucursal (Temperley)', cost: 0, estimatedDays: 'Inmediato' },
        { id: 'moto', name: 'Moto Mensajería (Zona Sur)', cost: 2500, estimatedDays: 'Mismo día o 1 día hábil' },
      ];
    }

    // Regla 2: CABA (Códigos del 1000 al 1499)
    if (cp >= 1000 && cp <= 1499) {
      return [
        { id: 'caba-domicilio', name: 'Envío a Domicilio (CABA)', cost: 4000, estimatedDays: '2-3 días hábiles' },
        { id: 'caba-sucursal', name: 'Retiro en Sucursal Correo', cost: 3000, estimatedDays: '2-3 días hábiles' },
      ];
    }

    // Regla 3: Resto del país (GBA Norte/Oeste y Provincias)
    return [
      { id: 'nacional-domicilio', name: 'Envío a Domicilio (Nacional)', cost: 7500, estimatedDays: '4-7 días hábiles' },
      { id: 'nacional-sucursal', name: 'Retiro en Sucursal Correo', cost: 5500, estimatedDays: '4-6 días hábiles' },
    ];
  }
}