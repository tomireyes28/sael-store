// src/app/admin/products/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react'; 
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useProductForm } from '@/hooks/useProductForm';
import Cookies from 'js-cookie';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  const {
    loading, imageFile, formData, setFormData, variants, categories,
    handleAddVariant, handleRemoveVariant, updateVariant,
    handleImageChange, submitForm, loadProductData
  } = useProductForm();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const token = Cookies.get('sael_admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const res = await fetch(`${apiUrl}/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const productData = await res.json();
          loadProductData(productData);
        } else {
          alert('No se pudo cargar el producto');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsFetchingInitialData(false);
      }
    };

    if (productId) {
      fetchProductInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    await submitForm(e, productId);
  };

  if (isFetchingInitialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>Cargando información del producto...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Producto</h1>
          <p className="text-gray-400">Modificá los datos o el stock de esta camiseta.</p>
        </div>
      </div>

      <form onSubmit={handleEditSubmit} className="space-y-8">
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
           {/* SELECTOR DE CATEGORÍA MODERNO */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Categoría (Liga) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  required 
                  value={formData.categoryId} 
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="" disabled>Seleccioná una liga...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {/* Flechita personalizada para el select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <Input 
                label="Descripción" 
                multiline
                required 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Foto */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Actualizar Imagen</h2>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-sm text-gray-400">
              {imageFile ? (
                <span className="text-green-500 font-semibold">Archivo seleccionado: {imageFile.name}</span>
              ) : (
                <><span className="text-blue-500 font-semibold">Hacé clic</span> para reemplazar la foto (Opcional).</>
              )}
            </p>
            <input 
              type="file" ref={fileInputRef} onChange={handleImageChange} accept=".jpg, .jpeg, .png" className="hidden" 
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
                    label="Stock" 
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
            {loading ? 'Guardando...' : 'Actualizar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}