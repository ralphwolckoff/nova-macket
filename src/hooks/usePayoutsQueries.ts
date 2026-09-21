// ============================================================================
// NOVAMARKET - PAYOUT QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PayoutService } from '../services/payoutService';

export const payoutKeys = {
  all: ['payouts'] as const,
  byStore: (storeId: string) => [...payoutKeys.all, 'store', storeId] as const,
};

export function usePayouts(storeId?: string) {
  return useQuery({
    queryKey: storeId ? payoutKeys.byStore(storeId) : payoutKeys.all,
    queryFn: () => (storeId ? PayoutService.getByStoreId(storeId) : PayoutService.getAll()),
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storeId,
      amount,
      provider = 'campay',
    }: {
      storeId: string;
      amount: number;
      provider?: 'campay' | 'stripe';
    }) => PayoutService.requestPayout(storeId, amount, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutKeys.all });
    },
  });
}
