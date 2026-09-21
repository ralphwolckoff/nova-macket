// ============================================================================
// NOVAMARKET - CART STORE (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

export interface CartStoreState {
  items: CartItem[];
  couponCode: string | null;
  discountRate: number; // e.g. 0.10 for 10%
  isCartDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercent?: number };
  removeCoupon: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Selectors / Helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingTotal: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountRate: 0,
      isCartDrawerOpen: false,

      addItem: (product, quantity = 1, selectedVariants) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, product.stock || 99);
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
              selectedVariants: selectedVariants || currentItem.selectedVariants,
            };
            return { items: updatedItems, isCartDrawerOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock || 99),
                selectedVariants,
              },
            ],
            isCartDrawerOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stock || 99;
              return { ...item, quantity: Math.min(quantity, maxStock) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountRate: 0 });
      },

      applyCoupon: (code) => {
        const trimmed = code.trim().toUpperCase();
        if (trimmed === 'BIENVENUE10' || trimmed === 'NOVASPRING') {
          set({ couponCode: trimmed, discountRate: 0.1 });
          return { success: true, message: 'Code promo appliqué (-10%)', discountPercent: 10 };
        }
        if (trimmed === 'ARTISANAT20') {
          set({ couponCode: trimmed, discountRate: 0.2 });
          return { success: true, message: 'Remise spéciale Créateurs appliquée (-20%)', discountPercent: 20 };
        }
        return { success: false, message: 'Code promo invalide ou expiré' };
      },

      removeCoupon: () => {
        set({ couponCode: null, discountRate: 0 });
      },

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      setIsCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getShippingTotal: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        // Group by distinct seller/store
        const uniqueSellers = new Set(items.map((i) => i.product.sellerId));
        return uniqueSellers.size * 1500; // 1500 XAF par atelier
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const rate = get().discountRate;
        return Math.round(subtotal * rate);
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingTotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal + shipping - discount);
      },
    }),
    {
      name: 'novamarket_cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountRate: state.discountRate,
      }),
    }
  )
);
