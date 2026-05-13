// src/hooks/useOrders.ts
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variant: {
    size: string;
    product: {
      name: string;
      images: string[];
    };
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  status: string; // PENDING, PAID, SHIPPED, CANCELLED
  createdAt: string;
  items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get('sael_admin_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const res = await fetch(`${apiUrl}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading };
}