// src/app/admin/products/new/page.tsx
'use client';

import Link from 'next/link';
import { useRef } from 'react'; 
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useProductForm } from '@/hooks/useProductForm';

export default function NewProductPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    loading, imageFile, formData, setFormData, variants,
    handleAddVariant, handleRemoveVariant, updateVariant,
    handleImageChange, submitForm
  } = useProductForm();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Producto</h1>
          <p className="text-gray-400">Completá los datos para cargar una nueva camiseta.</p>
        </div>
      </div>

      <form onSubmit={submitForm} className="space-y-8">
        {/* Bloque 1: Datos Generales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Nombre del producto" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <Input 
              label="Precio ($)" 
              type="number" 
              required 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
            />
            <Input 
              label="ID Categoría (Liga)" 
              type="text" 
              placeholder="Ej: dcf123-..." 
              required 
              value={formData.categoryId} 
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
            />
            <div className="md:col-span-2">
              <Input 
                label="Descripción" 
                multiline 
                rows={3} 
                required 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Foto */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Imagen del Producto</h2>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-sm text-gray-400">
              {imageFile ? (
                <span className="text-green-500 font-semibold">Archivo seleccionado: {imageFile.name}</span>
              ) : (
                <><span className="text-blue-500 font-semibold">Hacé clic para subir</span> o arrastrá un archivo JPG.</>
              )}
            </p>
            <input 
              type="file" ref={fileInputRef} onChange={handleImageChange} accept=".jpg, .jpeg" className="hidden" 
            />
          </div>
        </div>

        {/* Bloque 3: Talles y Stock */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Talles y Stock</h2>
            <button
              type="button" onClick={handleAddVariant}
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium"
            >
              <Plus size={16} /> Agregar Talle
            </button>
          </div>
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input 
                    label="Talle" 
                    required 
                    className="uppercase" 
                    value={variant.size} 
                    onChange={(e) => updateVariant(index, 'size', e.target.value)} 
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    label="Stock Inicial" 
                    type="number" 
                    required 
                    min="0" 
                    value={variant.stock} 
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)} 
                  />
                </div>
                <button
                  type="button" onClick={() => handleRemoveVariant(index)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg mb-0.5 transition-colors"
                  disabled={variants.length === 1}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}