// src/hooks/useProductForm.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface Variant {
  id?: string;
  size: string;
  stock: number;
}

// 1. NUEVA INTERFAZ PARA LAS CATEGORÍAS
export interface Category {
  id: string;
  name: string;
  slug: string;
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

export function useProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // 2. ESTADO PARA GUARDAR LAS CATEGORÍAS
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [variants, setVariants] = useState<Variant[]>([{ size: 'M', stock: 10 }]);

  // 3. BUSCAR LAS CATEGORÍAS AL CARGAR EL HOOK
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // La ruta pública de categorías no suele requerir token, pero podés agregarlo si tu API lo pide
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddVariant = () => setVariants([...variants, { size: '', stock: 0 }]);
  const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value as never };
    setVariants(newVariants);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

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

  const submitForm = async (e: React.FormEvent, productId?: string) => {
    e.preventDefault();
    
    if (!productId && !imageFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }

    if (!formData.categoryId) {
      alert('Por favor, seleccioná una categoría (Liga).');
      return;
    }
    
    setLoading(true);
    const token = Cookies.get('sael_admin_token');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      let imageUrl: string | undefined = undefined;

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
    categories, // 4. EXPORTAMOS LAS CATEGORÍAS AL FRONTEND
    handleAddVariant,
    handleRemoveVariant,
    updateVariant,
    handleImageChange,
    submitForm,
    loadProductData,
  };
}