// ============================================================================
// NOVAMARKET - DISPUTE QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DisputeService } from '../services/disputeService';
import { ArbitrateDisputeDto } from '../types';

export const disputeKeys = {
  all: ['disputes'] as const,
  detail: (id: string) => [...disputeKeys.all, 'detail', id] as const,
};

export function useDisputes() {
  return useQuery({
    queryKey: disputeKeys.all,
    queryFn: () => DisputeService.getAll(),
  });
}

export function useArbitrateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ArbitrateDisputeDto) => DisputeService.arbitrate(dto),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
      queryClient.setQueryData(disputeKeys.detail(updated.id), updated);
    },
  });
}
