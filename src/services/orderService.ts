// ============================================================================
// NOVAMARKET - ORDER SERVICE
// ============================================================================

import { Order, CreateOrderRequestDto, OrderStatus } from '../types';
import { apiClient, localRepo } from './apiClient';

export const OrderService = {
  // Fetch all orders
  async getAll(): Promise<Order[]> {
    try {
      return await apiClient.request<Order[]>('/orders');
    } catch {
      return localRepo.getOrders();
    }
  },

  // Fetch order by ID
  async getById(id: string): Promise<Order | undefined> {
    try {
      return await apiClient.request<Order>(`/orders/${id}`);
    } catch {
      return localRepo.getOrders().find((o) => o.id === id);
    }
  },

  // Fetch orders placed by a specific user
  async getByUserId(userId: string): Promise<Order[]> {
    try {
      return await apiClient.request<Order[]>(`/users/${userId}/orders`);
    } catch {
      return localRepo.getOrders().filter((o) => o.userId === userId);
    }
  },

  // Fetch orders containing items for a specific store/seller
  async getByStoreId(storeId: string): Promise<Order[]> {
    try {
      return await apiClient.request<Order[]>(`/stores/${storeId}/orders`);
    } catch {
      return localRepo.getOrders().filter(
        (o) => o.storeId === storeId || o.packages.some((pkg) => pkg.sellerId === storeId)
      );
    }
  },

  // Create order
  async create(orderData: CreateOrderRequestDto, orderEntity: Order): Promise<Order> {
    try {
      return await apiClient.request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch {
      const list = localRepo.getOrders();
      list.unshift(orderEntity);
      localRepo.saveOrders(list);
      return orderEntity;
    }
  },

  // Update seller package fulfillment status
  async updatePackageStatus(
    orderId: string,
    sellerId: string,
    status: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée',
    trackingNumber?: string
  ): Promise<Order> {
    try {
      return await apiClient.request<Order>(`/orders/${orderId}/packages/${sellerId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, trackingNumber }),
      });
    } catch {
      const list = localRepo.getOrders();
      const ord = list.find((o) => o.id === orderId);
      if (ord) {
        const pkg = ord.packages.find((p) => p.sellerId === sellerId);
        if (pkg) {
          pkg.status = status;
          if (trackingNumber) pkg.trackingNumber = trackingNumber;
        }
        // Update overallStatus if all packages are delivered or shipped
        const allDelivered = ord.packages.every((p) => p.status === 'Livrée');
        const anyShipped = ord.packages.some((p) => p.status === 'Expédiée' || p.status === 'Livrée');
        if (allDelivered) {
          ord.overallStatus = 'Livrée';
          ord.dbStatus = 'delivered';
        } else if (anyShipped) {
          ord.overallStatus = 'Expédiée';
          ord.dbStatus = 'shipped';
        }
        localRepo.saveOrders(list);
        return ord;
      }
      throw new Error('Commande introuvable');
    }
  },

  // Cancel order
  async cancel(orderId: string): Promise<Order> {
    try {
      return await apiClient.request<Order>(`/orders/${orderId}/cancel`, { method: 'POST' });
    } catch {
      const list = localRepo.getOrders();
      const ord = list.find((o) => o.id === orderId);
      if (ord) {
        ord.dbStatus = 'cancelled';
        localRepo.saveOrders(list);
        return ord;
      }
      throw new Error('Commande introuvable');
    }
  },
};
