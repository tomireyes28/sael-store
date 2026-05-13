// src/components/admin/ProductTable.tsx
import { Package, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
}

export function ProductTable({ products, loading }: ProductTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gray-400">Cargando catálogo...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No hay productos todavía</h3>
        <p className="text-gray-400">Empezá agregando tu primera camiseta al catálogo.</p>
      </div>
    );
  }

  return (
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
        {products.map((product) => {
          const totalStock = product.variants?.reduce((acc, variant) => acc + variant.stock, 0) || 0;

          return (
            <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-800 border border-gray-700" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                      <Package size={20} className="text-gray-500" />
                    </div>
                  )}
                  <span className="font-medium text-white">{product.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">{product.category?.name || 'Sin categoría'}</td>
              <td className="px-6 py-4">${product.price.toLocaleString('es-AR')}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  totalStock > 10 ? 'bg-green-500/10 text-green-500' : 
                  totalStock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 
                  'bg-red-500/10 text-red-500'
                }`}>
                  {totalStock} un.
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}