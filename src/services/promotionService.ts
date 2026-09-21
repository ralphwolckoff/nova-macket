// ============================================================================
// NOVAMARKET - PROMOTION SERVICE
// ============================================================================

import { PromotionEntity, CreatePromotionDto } from '../types';
import { apiClient, localRepo } from './apiClient';

export const PromotionService = {
  async getAll(): Promise<PromotionEntity[]> {
    try {
      return await apiClient.request<PromotionEntity[]>('/promotions');
    } catch {
      return localRepo.getPromotions();
    }
  },

  async getByStoreId(storeId: string): Promise<PromotionEntity[]> {
    const all = await this.getAll();
    return all.filter((p) => p.storeId === storeId || p.store_id === storeId);
  },

  async create(dto: CreatePromotionDto): Promise<PromotionEntity> {
    try {
      return await apiClient.request<PromotionEntity>('/promotions', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      const list = localRepo.getPromotions();
      const newPromo: PromotionEntity = {
        id: `promo-${Date.now()}`,
        ...dto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newPromo);
      localRepo.savePromotions(list);
      return newPromo;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.request(`/promotions/${id}`, { method: 'DELETE' });
    } catch {
      const list = localRepo.getPromotions().filter((p) => p.id !== id);
      localRepo.savePromotions(list);
    }
  },
};
