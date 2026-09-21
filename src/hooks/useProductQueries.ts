// ============================================================================
// NOVAMARKET - PRODUCT QUERIES & MUTATIONS (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService, ProductFilterOptions } from '../services/productService';
import { Product, CreateProductDto } from '../types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilterOptions) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook: Fetch all products with filtering & sorting
export function useProducts(filters?: ProductFilterOptions) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => ProductService.getAll(filters),
  });
}

// Hook: Fetch a single product by ID
export function useProduct(id: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => (id ? ProductService.getById(id) : Promise.resolve(undefined)),
    enabled: !!id,
  });
}

// Hook: Create new product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => ProductService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// Hook: Update product stock mutation
export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      ProductService.updateStock(productId, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// Hook: Update product details mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      ProductService.update(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

// Hook: Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => ProductService.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
