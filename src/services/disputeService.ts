// ============================================================================
// NOVAMARKET - DISPUTE SERVICE
// ============================================================================

import { DisputeEntity, ArbitrateDisputeDto } from '../types';
import { apiClient, localRepo } from './apiClient';

export const DisputeService = {
  async getAll(): Promise<DisputeEntity[]> {
    try {
      return await apiClient.request<DisputeEntity[]>('/disputes');
    } catch {
      return localRepo.getDisputes();
    }
  },

  async getById(id: string): Promise<DisputeEntity | undefined> {
    try {
      return await apiClient.request<DisputeEntity>(`/disputes/${id}`);
    } catch {
      return localRepo.getDisputes().find((d) => d.id === id);
    }
  },

  async arbitrate(dto: ArbitrateDisputeDto): Promise<DisputeEntity> {
    try {
      return await apiClient.request<DisputeEntity>(`/disputes/${dto.disputeId}/arbitrate`, {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      const list = localRepo.getDisputes();
      const item = list.find((d) => d.id === dto.disputeId);
      if (item) {
        item.status = dto.status;
        item.arbitrationNotes = dto.arbitrationNotes;
        item.resolvedAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        localRepo.saveDisputes(list);
        return item;
      }
      throw new Error('Litige introuvable');
    }
  },
};
