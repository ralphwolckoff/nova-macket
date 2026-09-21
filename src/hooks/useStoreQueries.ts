// ============================================================================
// NOVAMARKET - STORE QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StoreService } from '../services/storeService';
import { Seller } from '../types';

export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
};

// Hook: Fetch all stores
export function useStores() {
  return useQuery({
    queryKey: storeKeys.lists(),
    queryFn: () => StoreService.getAll(),
  });
}

// Hook: Fetch single store by ID
export function useStore(id: string | null | undefined) {
  return useQuery({
    queryKey: storeKeys.detail(id || ''),
    queryFn: () => (id ? StoreService.getById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

// Hook: Create store mutation
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeData: Seller) => StoreService.create(storeData),
    onSuccess: (newStore) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      queryClient.setQueryData(storeKeys.detail(newStore.id), newStore);
    },
  });
}

// Hook: Update store mutation
export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Seller> }) =>
      StoreService.update(id, updates),
    onSuccess: (updatedStore) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      queryClient.setQueryData(storeKeys.detail(updatedStore.id), updatedStore);
    },
  });
}

// Hook: Delete store mutation
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => StoreService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
}
