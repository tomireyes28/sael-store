// src/hooks/useProductForm.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// 1. INTERFACES ESTRICTAS
export interface Variant {
  id?: string;
  size: string;
  stock: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  variants?: Variant[];
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images?: string[];
}

// 2. HOOK
export function useProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [variants, setVariants] = useState<Variant[]>([{ size: 'M', stock: 10 }]);

  // === FUNCIONES DE VARIANTES ===
  const handleAddVariant = () => setVariants([...variants, { size: '', stock: 0 }]);
  const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value as never };
    setVariants(newVariants);
  };

  // === MANEJO DE IMAGEN ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // === PRECARGA DE DATOS (PARA EDICIÓN) ===
  const loadProductData = (product: ProductResponse) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      categoryId: product.categoryId || '',
    });
    
    if (product.variants && product.variants.length > 0) {
      setVariants(product.variants.map((v: Variant) => ({
        id: v.id,
        size: v.size,
        stock: v.stock
      })));
    }
  };

  // === ENVÍO DEL FORMULARIO (CREAR O EDITAR) ===
  const submitForm = async (e: React.FormEvent, productId?: string) => {
    e.preventDefault();
    
    if (!productId && !imageFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }
    
    setLoading(true);
    const token = Cookies.get('sael_admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      let imageUrl: string | undefined = undefined;

      // 1. Subir imagen SOLO si hay archivo nuevo
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);

        const imageRes = await fetch(`${apiUrl}/images/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageFormData,
        });

        if (!imageRes.ok) throw new Error('Error al subir la imagen');
        const imageData = await imageRes.json();
        imageUrl = imageData.url; 
      }

      // 2. Preparar payload tipado
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const productPayload: ProductPayload = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId,
      };

      if (imageUrl) {
        productPayload.images = [imageUrl];
      }

      // 3. Crear o Actualizar Producto
      const url = productId ? `${apiUrl}/products/${productId}` : `${apiUrl}/products`;
      const method = productId ? 'PATCH' : 'POST';

      const productRes = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productPayload),
      });

      if (!productRes.ok) throw new Error(`Error al ${productId ? 'actualizar' : 'crear'} el producto`);
      
      const productData: ProductResponse = await productRes.json();
      const finalProductId = productId || productData.id;

      // 4. Guardar o Actualizar Variantes
      await Promise.all(variants.map(variant => {
        if (variant.id && productId) {
          return fetch(`${apiUrl}/variants/${variant.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              size: variant.size.toUpperCase(),
              stock: variant.stock,
            }),
          });
        } 
        else {
          return fetch(`${apiUrl}/variants`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              productId: finalProductId,
              size: variant.size.toUpperCase(),
              stock: variant.stock,
            }),
          });
        }
      }));

      alert(`¡Producto ${productId ? 'actualizado' : 'creado'} con éxito!`);
      router.push('/admin/products');
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el formulario. Revisá la consola.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    imageFile,
    formData,
    setFormData,
    variants,
    handleAddVariant,
    handleRemoveVariant,
    updateVariant,
    handleImageChange,
    submitForm,
    loadProductData,
  };
}