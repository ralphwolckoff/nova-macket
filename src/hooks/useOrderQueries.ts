// ============================================================================
// NOVAMARKET - ORDER QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/orderService';
import { Order, CreateOrderRequestDto } from '../types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  userOrders: (userId: string) => [...orderKeys.all, 'user', userId] as const,
  storeOrders: (storeId: string) => [...orderKeys.all, 'store', storeId] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

// Hook: Fetch all orders
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => OrderService.getAll(),
  });
}

// Hook: Fetch orders for current user
export function useUserOrders(userId: string | null | undefined) {
  return useQuery({
    queryKey: orderKeys.userOrders(userId || ''),
    queryFn: () => (userId ? OrderService.getByUserId(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}

// Hook: Fetch orders for a seller store
export function useStoreOrders(storeId: string | null | undefined) {
  return useQuery({
    queryKey: orderKeys.storeOrders(storeId || ''),
    queryFn: () => (storeId ? OrderService.getByStoreId(storeId) : Promise.resolve([])),
    enabled: !!storeId,
  });
}

// Hook: Create order mutation
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderData,
      orderEntity,
    }: {
      orderData: CreateOrderRequestDto;
      orderEntity: Order;
    }) => OrderService.create(orderData, orderEntity),
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
    },
  });
}

// Hook: Update seller package tracking & fulfillment status
export function useUpdatePackageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      sellerId,
      status,
      trackingNumber,
    }: {
      orderId: string;
      sellerId: string;
      status: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée';
      trackingNumber?: string;
    }) => OrderService.updatePackageStatus(orderId, sellerId, status, trackingNumber),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
    },
  });
}
