// ============================================================================
// NOVAMARKET - PAYOUT SERVICE
// ============================================================================

import { PayoutEntity } from '../types';
import { apiClient, localRepo } from './apiClient';

export const PayoutService = {
  async getAll(): Promise<PayoutEntity[]> {
    try {
      return await apiClient.request<PayoutEntity[]>('/payouts');
    } catch {
      return localRepo.getPayouts();
    }
  },

  async getByStoreId(storeId: string): Promise<PayoutEntity[]> {
    const list = await this.getAll();
    return list.filter((p) => p.storeId === storeId);
  },

  async requestPayout(
    storeId: string,
    amount: number,
    provider: 'campay' | 'stripe' = 'campay'
  ): Promise<PayoutEntity> {
    try {
      return await apiClient.request<PayoutEntity>('/payouts/request', {
        method: 'POST',
        body: JSON.stringify({ storeId, amount, provider }),
      });
    } catch {
      const list = localRepo.getPayouts();
      const newPayout: PayoutEntity = {
        id: `pay-${Date.now()}`,
        storeId,
        subscriptionId: null,
        amount,
        currency: 'XAF',
        provider,
        providerPayoutId: `CMP-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'pending',
        scheduledAt: new Date().toISOString(),
        paidAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newPayout);
      localRepo.savePayouts(list);
      return newPayout;
    }
  },
};
