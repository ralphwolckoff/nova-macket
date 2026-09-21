// ============================================================================
// NOVAMARKET - REVIEW SERVICE
// ============================================================================

import { Review } from '../types';
import { apiClient, localRepo } from './apiClient';

export const ReviewService = {
  async getAll(): Promise<Review[]> {
    try {
      return await apiClient.request<Review[]>('/reviews');
    } catch {
      return localRepo.getReviews();
    }
  },

  async getByProductId(productId: string): Promise<Review[]> {
    const list = await this.getAll();
    return list.filter((r) => r.productId === productId);
  },

  async getByStoreId(storeId: string): Promise<Review[]> {
    const list = await this.getAll();
    return list.filter((r) => r.storeId === storeId);
  },

  async create(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
    try {
      return await apiClient.request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    } catch {
      const list = localRepo.getReviews();
      const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      list.unshift(newReview);
      localRepo.saveReviews(list);
      return newReview;
    }
  },

  async reply(reviewId: string, reply: string): Promise<Review> {
    try {
      return await apiClient.request<Review>(`/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply }),
      });
    } catch {
      const list = localRepo.getReviews();
      const item = list.find((r) => r.id === reviewId);
      if (item) {
        item.sellerReply = reply;
        item.sellerRepliedAt = new Date().toISOString();
        localRepo.saveReviews(list);
        return item;
      }
      throw new Error('Avis introuvable');
    }
  },
};
