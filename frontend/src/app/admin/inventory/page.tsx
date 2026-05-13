// src/app/admin/inventory/page.tsx
'use client';

import { AlertTriangle, PackageSearch } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function InventoryPage() {
  const { products, loading } = useProducts();

  // Filtramos para sacar una lista plana de "Alertas de Stock"
  // Buscamos todas las variantes de todos los productos que tengan stock <= 5
  const lowStockAlerts = products.flatMap(product => 
    product.variants
      .filter(variant => variant.stock <= 5)
      .map(variant => ({
        productId: product.id,
        productName: product.name,
        categoryName: product.category?.name || 'Sin liga',
        image: product.images?.[0] || null,
        size: variant.size,
        stock: variant.stock,
      }))
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Inventario y Alertas</h1>
        <p className="text-gray-400">Control de stock crítico y reposición de talles.</p>
      </div>

      {/* Tarjeta de Resumen */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 flex items-center gap-6">
        <div className={`p-4 rounded-full ${lowStockAlerts.length > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {loading ? '-' : lowStockAlerts.length}
          </h2>
          <p className="text-gray-400 text-sm">
            Talles con stock crítico (5 unidades o menos)
          </p>
        </div>
      </div>

      {/* Tabla de Alertas */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Detalle de Reposición Urgente</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Analizando inventario...</div>
        ) : lowStockAlerts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">¡Stock Saludable!</h3>
            <p className="text-gray-400">No hay ningún talle con 5 unidades o menos en este momento.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-xs uppercase font-semibold text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-center">Talle Crítico</th>
                <th className="px-6 py-4 text-right">Stock Actual</th>
              </tr>
            </thead>
            <tbody>
              {lowStockAlerts.map((alert, index) => (
                <tr key={`${alert.productId}-${alert.size}-${index}`} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {alert.image ? (
                        <img src={alert.image} alt={alert.productName} className="w-10 h-10 rounded object-cover bg-gray-800 border border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700" />
                      )}
                      <span className="font-medium text-white">{alert.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{alert.categoryName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700 font-bold">
                      {alert.size}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      alert.stock === 0 ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                      'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {alert.stock} un.
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}