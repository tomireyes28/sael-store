// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; 
  variantId: string; // <-- ESTO ES CLAVE PARA EL BACKEND
  productId: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addItem: (newItem) => {
        const currentItems = get().items;
        const cartItemId = `${newItem.productId}-${newItem.size}`;
        const existingItem = currentItems.find(item => item.id === cartItemId);

        if (existingItem) {
          if (existingItem.quantity < existingItem.maxStock) {
            set({
              items: currentItems.map(item => 
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isOpen: true,
            });
          }
        } else {
          set({
            items: [...currentItems, { ...newItem, id: cartItemId, quantity: 1 }],
            isOpen: true,
          });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      updateQuantity: (id, quantity) => set({
        items: get().items.map(item => item.id === id ? { ...item, quantity } : item)
      }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'sael-cart-storage',
      partialize: (state) => ({ items: state.items }), 
    }
  )
);