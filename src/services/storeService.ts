// ============================================================================
// NOVAMARKET - STORE / SELLER SERVICE
// ============================================================================

import { Seller } from '../types';
import { apiClient, localRepo } from './apiClient';

export const StoreService = {
  // Fetch all partner stores
  async getAll(): Promise<Seller[]> {
    try {
      return await apiClient.request<Seller[]>('/stores');
    } catch {
      return localRepo.getStores();
    }
  },

  // Fetch store by ID
  async getById(id: string): Promise<Seller | undefined> {
    try {
      return await apiClient.request<Seller>(`/stores/${id}`);
    } catch {
      return localRepo.getStores().find((s) => s.id === id);
    }
  },

  // Fetch store by User ID
  async getByUserId(userId: string): Promise<Seller | undefined> {
    try {
      return await apiClient.request<Seller>(`/users/${userId}/store`);
    } catch {
      return localRepo.getStores().find((s) => s.userId === userId);
    }
  },

  // Create new merchant store
  async create(storeData: Seller): Promise<Seller> {
    try {
      return await apiClient.request<Seller>('/stores', {
        method: 'POST',
        body: JSON.stringify(storeData),
      });
    } catch {
      const list = localRepo.getStores();
      const exists = list.some((s) => s.id === storeData.id);
      if (exists) {
        const updated = list.map((s) => (s.id === storeData.id ? storeData : s));
        localRepo.saveStores(updated);
        return storeData;
      }
      const updated = [storeData, ...list];
      localRepo.saveStores(updated);
      return storeData;
    }
  },

  // Update store details
  async update(id: string, updates: Partial<Seller>): Promise<Seller> {
    try {
      return await apiClient.request<Seller>(`/stores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch {
      const list = localRepo.getStores();
      const idx = list.findIndex((s) => s.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...updates };
        localRepo.saveStores(list);
        return list[idx];
      }
      throw new Error('Boutique introuvable');
    }
  },

  // Delete/Deactivate store
  async delete(id: string): Promise<void> {
    try {
      await apiClient.request(`/stores/${id}`, { method: 'DELETE' });
    } catch {
      const list = localRepo.getStores().filter((s) => s.id !== id);
      localRepo.saveStores(list);
    }
  },
};
