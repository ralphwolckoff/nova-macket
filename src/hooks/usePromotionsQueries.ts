// ============================================================================
// NOVAMARKET - PROMOTION QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PromotionService } from '../services/promotionService';
import { CreatePromotionDto } from '../types';

export const promotionKeys = {
  all: ['promotions'] as const,
  byStore: (storeId: string) => [...promotionKeys.all, 'store', storeId] as const,
};

export function usePromotions(storeId?: string) {
  return useQuery({
    queryKey: storeId ? promotionKeys.byStore(storeId) : promotionKeys.all,
    queryFn: () => (storeId ? PromotionService.getByStoreId(storeId) : PromotionService.getAll()),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePromotionDto) => PromotionService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PromotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
}
