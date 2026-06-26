// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category?: { 
    name: string;
    slug: string;
  };
  variants?: { stock: number }[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al definir y ejecutar la función ACÁ ADENTRO, 
    // el linter no chilla y se asegura de que sea un efecto 100% asíncrono.
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('sael_admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const res = await fetch(`${apiUrl}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // <-- Array vacío: carga solo 1 vez al montar el componente.

  const deleteProduct = async (id: string) => {
    try {
      const token = Cookies.get('sael_admin_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProducts(currentProducts => currentProducts.filter(p => p.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  return { products, loading, deleteProduct };
}