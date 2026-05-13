// src/app/admin/orders/page.tsx
'use client';

import { ShoppingBag, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  // Función auxiliar para renderizar el badge del estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock size={14} /> Pendiente</span>;
      case 'PAID':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><CheckCircle size={14} /> Pagado</span>;
      case 'SHIPPED':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><Truck size={14} /> Enviado</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><XCircle size={14} /> Cancelado</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pedidos</h1>
        <p className="text-gray-400">Gestioná las ventas, pagos y envíos de SAEL.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Aún no hay pedidos</h3>
            <p className="text-gray-400">Las compras de tus clientes aparecerán acá.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-xs uppercase font-semibold text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">ID / Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-1">#{order.id.split('-')[0].toUpperCase()}</div>
                    <div className="text-xs">{new Date(order.createdAt).toLocaleDateString('es-AR')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{order.customerName}</div>
                    <div className="text-xs">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    ${order.totalAmount.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors inline-flex items-center gap-2 font-medium">
                      <Eye size={18} /> Ver Detalle
                    </button>
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