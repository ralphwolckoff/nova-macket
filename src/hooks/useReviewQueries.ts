// ============================================================================
// NOVAMARKET - REVIEW QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from '../services/reviewService';
import { Review } from '../types';

export const reviewKeys = {
  all: ['reviews'] as const,
  byProduct: (productId: string) => [...reviewKeys.all, 'product', productId] as const,
  byStore: (storeId: string) => [...reviewKeys.all, 'store', storeId] as const,
};

// Hook: Fetch all reviews
export function useReviews(productId?: string, storeId?: string) {
  return useQuery({
    queryKey: productId
      ? reviewKeys.byProduct(productId)
      : storeId
      ? reviewKeys.byStore(storeId)
      : reviewKeys.all,
    queryFn: () => {
      if (productId) return ReviewService.getByProductId(productId);
      if (storeId) return ReviewService.getByStoreId(storeId);
      return ReviewService.getAll();
    },
  });
}

// Hook: Add new review mutation
export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: Omit<Review, 'id' | 'date'>) => ReviewService.create(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

// Hook: Reply to review mutation
export function useReplyReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      ReviewService.reply(reviewId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
