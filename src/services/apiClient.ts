// ============================================================================
// NOVAMARKET - CORE API CLIENT & LOCAL DATA REPOSITORY
// ============================================================================

import {
  Seller,
  Product,
  Order,
  Review,
  ChatMessage,
  PromotionEntity,
  DisputeEntity,
  PayoutEntity,
} from '../types';

import {
  initialSellers,
  initialProducts,
  initialReviews,
  sampleOrders,
  initialMessages,
} from '../data/mockData';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('novamarket_auth_token') : null;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('novamarket_auth_token', token);
      } else {
        localStorage.removeItem('novamarket_auth_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    if (SUPABASE_ANON_KEY) {
      headers['apikey'] = SUPABASE_ANON_KEY;
    }
    return headers;
  }

  // Safe fetch helper with timeout and fallback
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }
}

export const apiClient = new ApiClient();

// ============================================================================
// RESILIENT LOCAL REPOSITORY
// Mirrors Supabase/PostgreSQL tables in localStorage for offline preview
// ============================================================================

export class LocalRepository {
  public get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }

  public set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Stores
  getStores(): Seller[] {
    return this.get<Seller[]>('novamarket_sellers', initialSellers);
  }

  saveStores(stores: Seller[]): void {
    this.set('novamarket_sellers', stores);
  }

  // Products
  getProducts(): Product[] {
    return this.get<Product[]>('novamarket_products', initialProducts);
  }

  saveProducts(products: Product[]): void {
    this.set('novamarket_products', products);
  }

  // Orders
  getOrders(): Order[] {
    return this.get<Order[]>('novamarket_orders', sampleOrders);
  }

  saveOrders(orders: Order[]): void {
    this.set('novamarket_orders', orders);
  }

  // Reviews
  getReviews(): Review[] {
    return this.get<Review[]>('novamarket_reviews', initialReviews);
  }

  saveReviews(reviews: Review[]): void {
    this.set('novamarket_reviews', reviews);
  }

  // Messages
  getMessages(): ChatMessage[] {
    return this.get<ChatMessage[]>('novamarket_messages', initialMessages);
  }

  saveMessages(messages: ChatMessage[]): void {
    this.set('novamarket_messages', messages);
  }

  // Promotions
  getPromotions(): PromotionEntity[] {
    const defaultPromos: PromotionEntity[] = [
      {
        id: 'promo-1',
        storeId: 'seller-atelier-lumiere',
        productName: 'Lampe Sculpturale Grès Alba',
        messageTitle: "Offre Éclair Céramique d'Art",
        messageContent: "-20% sur les 10 premières pièces façonnées au tour avec certificat d'authenticité.",
        discountPercentage: 20,
        finalPrice: 68.0,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'promo-2',
        storeId: 'seller-techzone-pro',
        productName: 'Casque Audio Studio Pro Wireless',
        messageTitle: 'Vente Privée Ingénieur du Son',
        messageContent: 'Réduction de lancement pour les commandes avant minuit avec étui rigide offert.',
        discountPercentage: 15,
        finalPrice: 195.5,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    return this.get<PromotionEntity[]>('novamarket_promotions', defaultPromos);
  }

  savePromotions(promos: PromotionEntity[]): void {
    this.set('novamarket_promotions', promos);
  }

  // Disputes
  getDisputes(): DisputeEntity[] {
    const defaultDisputes: DisputeEntity[] = [
      {
        id: 'disp-1',
        disputeNumber: 'LIT-8841-A',
        orderId: 'ORD-2024-8841',
        openedById: 'usr-buyer-sophie',
        reason: 'Colis endommagé lors de la livraison, fêlure nette constatée au déballage sur la lampe céramique.',
        evidencePaths: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80',
        ],
        status: 'under_review',
        arbitratedById: null,
        arbitrationNotes: 'Dossier transmis au service contentieux et arbitrage logistique NovaMarket.',
        resolvedAt: null,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    return this.get<DisputeEntity[]>('novamarket_disputes', defaultDisputes);
  }

  saveDisputes(disputes: DisputeEntity[]): void {
    this.set('novamarket_disputes', disputes);
  }

  // Payouts
  getPayouts(): PayoutEntity[] {
    const defaultPayouts: PayoutEntity[] = [
      {
        id: 'pay-1',
        storeId: 'seller-atelier-lumiere',
        subscriptionId: null,
        amount: 850000,
        currency: 'XAF',
        provider: 'campay',
        providerPayoutId: 'CMP-PO-882194',
        status: 'paid',
        scheduledAt: '2024-02-10T10:00:00Z',
        paidAt: '2024-02-10T11:30:00Z',
        createdAt: '2024-02-09T08:00:00Z',
        updatedAt: '2024-02-10T11:30:00Z',
      },
      {
        id: 'pay-2',
        storeId: 'seller-atelier-lumiere',
        subscriptionId: null,
        amount: 425000,
        currency: 'XAF',
        provider: 'campay',
        providerPayoutId: 'CMP-PO-991024',
        status: 'processing',
        scheduledAt: new Date().toISOString(),
        paidAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    return this.get<PayoutEntity[]>('novamarket_payouts', defaultPayouts);
  }

  savePayouts(payouts: PayoutEntity[]): void {
    this.set('novamarket_payouts', payouts);
  }
}

export const localRepo = new LocalRepository();
