// src/hooks/useProduct.ts
import { useState, useEffect } from 'react';
import { Product } from './useProducts';

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fallback a localhost:3000 por si falla el .env.local
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        // Le pegamos a la ruta específica del slug
        const res = await fetch(`${apiUrl}/products/slug/${slug}`);
        
        if (!res.ok) throw new Error('Producto no encontrado');
        
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  return { product, loading, error };
}