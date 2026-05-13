import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
  variants: { stock: number }[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return { products, loading };
}