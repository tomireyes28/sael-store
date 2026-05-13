// src/app/admin/products/page.tsx
'use client';

import { Plus, Search, Package } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  // Después conectaremos esto al backend real
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos que carga rápido para ver la interfaz
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Productos</h1>
          <p className="text-gray-400">Gestioná el catálogo de camisetas y conjuntos.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Buscador */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, liga o equipo..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tabla / Estado Vacío */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No hay productos todavía</h3>
            <p className="text-gray-400 mb-6">Empezá agregando tu primera camiseta al catálogo.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-xs uppercase font-semibold text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Acá irán las filas cuando traigamos los datos de la DB */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}