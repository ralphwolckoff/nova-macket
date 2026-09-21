// ============================================================================
// NOVAMARKET - WISHLIST STORE (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistStoreState {
  wishlistIds: string[];

  // Actions
  toggleWishlist: (productId: string) => boolean; // returns true if added, false if removed
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],

      toggleWishlist: (productId) => {
        const isPresent = get().wishlistIds.includes(productId);
        if (isPresent) {
          set((state) => ({
            wishlistIds: state.wishlistIds.filter((id) => id !== productId),
          }));
          return false;
        } else {
          set((state) => ({
            wishlistIds: [...state.wishlistIds, productId],
          }));
          return true;
        }
      },

      addToWishlist: (productId) => {
        if (!get().wishlistIds.includes(productId)) {
          set((state) => ({ wishlistIds: [...state.wishlistIds, productId] }));
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlistIds: state.wishlistIds.filter((id) => id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().wishlistIds.includes(productId);
      },

      clearWishlist: () => set({ wishlistIds: [] }),

      getCount: () => get().wishlistIds.length,
    }),
    {
      name: 'novamarket_wishlist',
    }
  )
);
