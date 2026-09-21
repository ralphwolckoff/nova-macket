// ============================================================================
// NOVAMARKET - UI STORE (ZUSTAND)
// ============================================================================

import { create } from 'zustand';
import { ActiveView, LegalTab, Seller, Product } from '../types';
import { ToastMessage } from '../components/Toast';

export interface UiStoreState {
  activeView: ActiveView;
  activeLegalTab: LegalTab;
  isCookieModalForced: boolean;
  selectedProductId: string | null;
  selectedSellerId: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  isProfileModalOpen: boolean;
  contactModalData: {
    open: boolean;
    seller?: Seller;
    product?: Product;
  };
  pendingAuthRedirect: {
    view: ActiveView;
    requiredRole?: 'vendor' | 'admin';
    reason?: string;
  } | null;
  toasts: ToastMessage[];

  // Actions
  setActiveView: (view: ActiveView) => void;
  setActiveLegalTab: (tab: LegalTab) => void;
  openLegalTab: (tab: LegalTab) => void;
  setIsCookieModalForced: (forced: boolean) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedSellerId: (id: string | null) => void;
  openProductDetail: (id: string) => void;
  openSellerShop: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setContactModalData: (data: { open: boolean; seller?: Seller; product?: Product }) => void;
  openContactModal: (seller?: Seller, product?: Product) => void;
  closeContactModal: () => void;
  setPendingAuthRedirect: (redirect: { view: ActiveView; requiredRole?: 'vendor' | 'admin'; reason?: string } | null) => void;
  addToast: (type: 'success' | 'info' | 'error', message: string) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  activeView: 'marketplace',
  activeLegalTab: 'terms',
  isCookieModalForced: false,
  selectedProductId: null,
  selectedSellerId: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
  isProfileModalOpen: false,
  contactModalData: { open: false },
  pendingAuthRedirect: null,
  toasts: [],

  setActiveView: (view) => set({ activeView: view }),

  setActiveLegalTab: (tab) => set({ activeLegalTab: tab }),

  openLegalTab: (tab) => {
    set({ activeLegalTab: tab, activeView: 'legal' });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  setIsCookieModalForced: (forced) => set({ isCookieModalForced: forced }),

  setSelectedProductId: (id) => set({ selectedProductId: id }),

  setSelectedSellerId: (id) => set({ selectedSellerId: id }),

  openProductDetail: (id) => {
    set({ selectedProductId: id, activeView: 'product_detail' });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  openSellerShop: (id) => {
    set({ selectedSellerId: id, activeView: 'seller_shop' });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSortBy: (sortBy) => set({ sortBy: sortBy }),

  resetFilters: () => set({ searchQuery: '', selectedCategory: 'all', sortBy: 'featured' }),

  setIsProfileModalOpen: (open) => set({ isProfileModalOpen: open }),

  setContactModalData: (data) => set({ contactModalData: data }),

  openContactModal: (seller, product) =>
    set({ contactModalData: { open: true, seller, product } }),

  closeContactModal: () =>
    set({ contactModalData: { open: false, seller: undefined, product: undefined } }),

  setPendingAuthRedirect: (redirect) => set({ pendingAuthRedirect: redirect }),

  addToast: (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
