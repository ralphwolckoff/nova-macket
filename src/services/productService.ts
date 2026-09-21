// ============================================================================
// NOVAMARKET - PRODUCT SERVICE
// ============================================================================

import { Product, CreateProductDto } from '../types';
import { apiClient, localRepo } from './apiClient';

export interface ProductFilterOptions {
  category?: string;
  searchQuery?: string;
  sellerId?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const ProductService = {
  // Fetch all products with optional client/server filtering
  async getAll(options?: ProductFilterOptions): Promise<Product[]> {
    let products: Product[];
    try {
      const queryParams = new URLSearchParams();
      if (options?.category && options.category !== 'all') queryParams.set('category', options.category);
      if (options?.searchQuery) queryParams.set('q', options.searchQuery);
      if (options?.sellerId) queryParams.set('sellerId', options.sellerId);

      const qs = queryParams.toString();
      products = await apiClient.request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
    } catch {
      products = localRepo.getProducts();
    }

    // Client-side filtering & sorting fallback
    if (options) {
      if (options.category && options.category !== 'all') {
        products = products.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
      }
      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.sellerName.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        );
      }
      if (options.sellerId) {
        products = products.filter((p) => p.sellerId === options.sellerId);
      }
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'price-asc':
            products = [...products].sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products = [...products].sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            products = [...products].sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            products = [...products].reverse();
            break;
        }
      }
    }

    return products;
  },

  // Fetch product by ID
  async getById(id: string): Promise<Product | undefined> {
    try {
      return await apiClient.request<Product>(`/products/${id}`);
    } catch {
      return localRepo.getProducts().find((p) => p.id === id);
    }
  },

  // Fetch products by Seller ID
  async getBySellerId(sellerId: string): Promise<Product[]> {
    return this.getAll({ sellerId });
  },

  // Create new product
  async create(productData: CreateProductDto): Promise<Product> {
    try {
      return await apiClient.request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch {
      const list = localRepo.getProducts();
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: productData.name,
        description: productData.description || '',
        price: productData.price,
        currency: 'XAF',
        category: 'Artisanat',
        tags: ['Nouveauté'],
        sellerId: productData.storeId,
        sellerName: 'Boutique Partenaire',
        rating: 5.0,
        reviewCount: 0,
        stock: productData.stock,
        images:
          productData.images.length > 0
            ? productData.images
            : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'],
        specs: {},
        featured: productData.isFeatured || false,
        shippingFee: 1500,
        estimatedDelivery: '24-48h ouvrées',
      };
      list.unshift(newProd);
      localRepo.saveProducts(list);
      return newProd;
    }
  },

  // Update existing product
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      return await apiClient.request<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      const list = localRepo.getProducts();
      const index = list.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Produit introuvable');
      }
      const updated = { ...list[index], ...updates };
      list[index] = updated;
      localRepo.saveProducts(list);
      return updated;
    }
  },

  // Update product inventory stock
  async updateStock(productId: string, stock: number): Promise<void> {
    try {
      await apiClient.request(`/products/${productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock }),
      });
    } catch {
      const list = localRepo.getProducts();
      const item = list.find((p) => p.id === productId);
      if (item) {
        item.stock = stock;
        localRepo.saveProducts(list);
      }
    }
  },

  // Delete product
  async delete(productId: string): Promise<void> {
    try {
      await apiClient.request(`/products/${productId}`, { method: 'DELETE' });
    } catch {
      const list = localRepo.getProducts().filter((p) => p.id !== productId);
      localRepo.saveProducts(list);
    }
  },
};
