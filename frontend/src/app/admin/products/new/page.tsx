// src/app/admin/products/new/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react';

export default function NewProductPage() {
  // Estado básico del producto
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '', // Después lo conectamos con las categorías reales
  });

  // Estado para los talles (Variantes)
  const [variants, setVariants] = useState([{ size: 'M', stock: 10 }]);

  const handleAddVariant = () => {
    setVariants([...variants, { size: '', stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: 'size' | 'stock', value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos a enviar:', { formData, variants });
    // En el próximo paso conectamos esto con NestJS y Cloudinary
    alert('Formulario listo. Falta conectar con el backend.');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Producto</h1>
          <p className="text-gray-400">Completá los datos para cargar una nueva camiseta.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bloque 1: Datos Generales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del producto</label>
              <input
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Camiseta Boca Juniors Titular 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Precio ($)</label>
              <input
                type="number"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="45000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoría (Liga)</label>
              <select 
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Seleccionar liga...</option>
                <option value="1">Liga Profesional (LPF)</option>
                <option value="2">Premier League</option>
                <option value="3">La Liga</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <textarea
                rows={3}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Detalles de la tela, edición, etc..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Foto (UI base) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Imagen del Producto</h2>
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/50 transition-colors cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-sm text-gray-400">
              <span className="text-blue-500 font-semibold">Hacé clic para subir</span> o arrastrá un archivo JPG.
            </p>
          </div>
        </div>

        {/* Bloque 3: Talles y Stock (Variantes) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Talles y Stock</h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium"
            >
              <Plus size={16} /> Agregar Talle
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Talle</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: S, M, L, XL"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white uppercase"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg mb-0.5 transition-colors"
                  disabled={variants.length === 1}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            <Save size={20} />
            Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
}