// src/app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo 👋</h1>
      <p className="text-gray-400 mb-8">Acá vas a poder gestionar toda tu tienda deportiva.</p>
      
      {/* Tarjetas de estadísticas de prueba (después las conectamos al backend) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 font-medium mb-1">Ventas del mes</h3>
          <p className="text-3xl font-bold text-white">$0,00</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 font-medium mb-1">Pedidos Pendientes</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 font-medium mb-1">Productos Activos</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}