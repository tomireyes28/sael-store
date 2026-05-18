// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definimos estrictamente qué tiene un ítem del carrito
export interface CartItem {
  id: string; // Lo vamos a armar juntando productId + size (ej: "123-XL")
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
  isOpen: boolean; // Controla si el Drawer está visible
  
  // Acciones
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
        // El ID único del carrito es la combinación de producto y talle
        const cartItemId = `${newItem.productId}-${newItem.size}`;
        
        const existingItem = currentItems.find(item => item.id === cartItemId);

        if (existingItem) {
          // Si ya existe y no supera el stock, le sumamos 1
          if (existingItem.quantity < existingItem.maxStock) {
            set({
              items: currentItems.map(item => 
                item.id === cartItemId 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true, // Abrimos el carrito al agregar
            });
          }
        } else {
          // Si es nuevo, lo agregamos con cantidad 1
          set({
            items: [...currentItems, { ...newItem, id: cartItemId, quantity: 1 }],
            isOpen: true, // Abrimos el carrito al agregar
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'sael-cart-storage', // Nombre de la key en localStorage
      // No guardamos el estado "isOpen" en localStorage, solo los items
      partialize: (state) => ({ items: state.items }), 
    }
  )
);