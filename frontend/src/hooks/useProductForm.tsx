// src/hooks/useProductForm.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface Variant {
  size: string;
  stock: number;
}

export function useProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [variants, setVariants] = useState<Variant[]>([{ size: 'M', stock: 10 }]);

  const handleAddVariant = () => setVariants([...variants, { size: '', stock: 0 }]);
  const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }
    
    setLoading(true);
    const token = Cookies.get('sael_admin_token');

    try {
      // 1. Subir Imagen
      const imageFormData = new FormData();
      imageFormData.append('file', imageFile);

      const imageRes = await fetch('http://localhost:3000/images/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: imageFormData,
      });

      if (!imageRes.ok) throw new Error('Error al subir la imagen');
      const imageData = await imageRes.json();
      const imageUrl = imageData.url; 

      // 2. Crear Producto
      // Generamos un slug simple a partir del nombre
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const productRes = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          slug: slug,
          description: formData.description,
          price: Number(formData.price),
          categoryId: formData.categoryId, // Asumimos que categoryId es un String (UUID)
          images: [imageUrl],
        }),
      });

      if (!productRes.ok) throw new Error('Error al crear el producto');
      const productData = await productRes.json();

      // 3. Crear Variantes
      await Promise.all(variants.map(variant => 
        fetch('http://localhost:3000/variants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: productData.id,
            size: variant.size.toUpperCase(),
            stock: variant.stock,
          }),
        })
      ));

      alert('¡Producto creado con éxito!');
      router.push('/admin/products');
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el formulario.');
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
  };
}