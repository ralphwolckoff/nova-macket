// ============================================================================
// NOVAMARKET - TYPES & DTO DEFINITIONS
// Synchronized with Supabase Database Migration & Spring Boot Backend Model
// ============================================================================

// ----------------------------------------------------------------------------
// Database Enums (matching Supabase `create type public.*`)
// ----------------------------------------------------------------------------

export type UserRole = 'client' | 'vendor' | 'admin';
export type StoreStatus = 'draft' | 'active' | 'past_due' | 'suspended';
export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'cancelled' | 'expired';
export type PaymentProvider = 'stripe' | 'campay';
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type ReviewStatus = 'published' | 'hidden' | 'pending';
export type DisputeStatus = 'open' | 'under_review' | 'resolved_refund' | 'resolved_seller' | 'resolved_split';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

// ----------------------------------------------------------------------------
// Database Table Entities (Supabase public.* tables)
// ----------------------------------------------------------------------------

/** Table: public.profiles */
export interface ProfileEntity {
  id: string; // uuid primary key references auth.users(id)
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  storeId?: string | null;
  storeName?: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.subscription_plans */
export interface SubscriptionPlanEntity {
  id: string; // uuid
  code: string;
  name: string;
  description?: string | null;
  amountXaf: number; // integer check (amount_xaf > 0)
  stripePriceId?: string | null;
  intervalMonths: number;
  isActive: boolean;
  createdAt: string;
}

/** Table: public.stores */
export interface StoreEntity {
  id: string; // uuid
  userId: string; // references public.profiles(id)
  name: string;
  address?: string | null;
  logoPath?: string | null;
  description?: string | null;
  status: StoreStatus;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.store_subscriptions */
export interface StoreSubscriptionEntity {
  id: string; // uuid
  storeId: string; // references public.stores(id)
  planId: string; // references public.subscription_plans(id)
  provider: PaymentProvider;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  status: SubscriptionStatus;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.categories */
export interface CategoryEntity {
  id: string; // uuid
  storeId: string; // references public.stores(id)
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.products */
export interface ProductEntity {
  id: string; // uuid
  storeId: string; // references public.stores(id)
  categoryId?: string | null; // references public.categories(id)
  name: string;
  price: number; // numeric(12,2)
  stock: number; // integer
  description?: string | null;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.images */
export interface ImageEntity {
  id: string; // uuid
  productId: string; // references public.products(id)
  url: string;
  altText?: string | null;
  createdAt: string;
}

/** Table: public.addresses */
export interface AddressEntity {
  id: string; // uuid
  userId: string; // references public.profiles(id)
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.orders */
export interface OrderEntity {
  id: string; // uuid
  orderNumber: string; // 'ORD-...'
  userId: string; // references public.profiles(id)
  storeId: string; // references public.stores(id)
  addressId?: string | null; // references public.addresses(id)
  status: OrderStatus;
  totalAmount: number; // numeric(12,2)
  shippingAddress?: string | null;
  paymentMethod: string;
  mobileMoneyNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.order_items */
export interface OrderItemEntity {
  id: string; // uuid
  orderId: string; // references public.orders(id)
  productId: string; // references public.products(id)
  quantity: number;
  priceAtOrder: number;
}

/** Table: public.reviews */
export interface ReviewEntity {
  id: string; // uuid
  productId: string;
  storeId: string;
  authorId: string;
  orderId?: string | null;
  rating: number; // 1 to 5
  title?: string | null;
  content?: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  sellerReply?: string | null;
  sellerRepliedAt?: string | null;
}

/** Table: public.conversations */
export interface ConversationEntity {
  id: string; // uuid
  buyerId: string;
  sellerId: string;
  storeId: string;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.messages */
export interface MessageEntity {
  id: string; // uuid
  conversationId: string;
  senderId: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
}

/** Table: public.disputes */
export interface DisputeEntity {
  id: string; // uuid
  disputeNumber: string; // 'LIT-...'
  orderId: string;
  openedById: string;
  reason: string;
  evidencePaths: string[];
  status: DisputeStatus;
  arbitratedById?: string | null;
  arbitrationNotes?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.payouts */
export interface PayoutEntity {
  id: string; // uuid
  storeId: string;
  subscriptionId?: string | null;
  amount: number;
  currency: string; // default 'XAF'
  provider?: string | null;
  providerPayoutId?: string | null;
  status: PayoutStatus;
  scheduledAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Table: public.promotions */
export interface PromotionEntity {
  id: string; // uuid
  storeId?: string;
  store_id?: string;
  productName?: string;
  product_name?: string;
  messageTitle?: string;
  message_title?: string;
  messageContent?: string;
  message_content?: string;
  discountPercentage?: number;
  discount_percentage?: number;
  finalPrice?: number;
  final_price?: number;
  deadline: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

// ----------------------------------------------------------------------------
// SUGGESTED MISSING TABLES (Recommended for Schema Completeness)
// ----------------------------------------------------------------------------

/** Suggested Table: public.coupons (Promo codes usable at checkout) */
export interface CouponEntity {
  id: string;
  storeId?: string | null; // null = platform-wide coupon
  code: string; // e.g. "WELCOME10", "NOVASPRING20"
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

/** Suggested Table: public.wishlists (Saved items per authenticated user) */
export interface WishlistEntity {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

/** Suggested Table: public.product_variants (Sizes, colors, dimensions) */
export interface ProductVariantEntity {
  id: string;
  productId: string;
  sku?: string | null;
  name: string; // e.g. "Taille L - Blanc Écru"
  attributes: Record<string, string>; // { "size": "L", "color": "Écru" }
  priceAdjustment: number;
  stock: number;
  createdAt: string;
}

/** Suggested Table: public.seller_payout_methods (Momo or Bank IBAN destination) */
export interface SellerPayoutMethodEntity {
  id: string;
  storeId: string;
  provider: 'campay' | 'stripe_connect' | 'bank_transfer';
  accountNumber: string; // Mobile Money phone or IBAN
  accountHolderName: string;
  network?: string | null; // 'MTN', 'Orange'
  isDefault: boolean;
  createdAt: string;
}

/** Suggested Table: public.notifications (In-app real-time notifications) */
export interface NotificationEntity {
  id: string;
  userId: string;
  type: 'order_status' | 'new_message' | 'dispute_update' | 'review_received' | 'payout_processed';
  title: string;
  body: string;
  linkUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
}

/** Suggested Table: public.audit_logs (Admin actions & compliance tracking) */
export interface AuditLogEntity {
  id: string;
  adminId: string;
  action: 'suspend_store' | 'resolve_dispute' | 'moderate_review' | 'approve_vendor';
  targetType: string;
  targetId: string;
  reason?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Frontend UI Compatibility Interfaces
// (Keeps existing rich UI functioning with zero regressions)
// ----------------------------------------------------------------------------

export interface Seller {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  story?: string;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  salesCount: number;
  joinedDate: string;
  returnPolicy: string;
  shippingInfo: string;
  contactEmail: string;
  contactPhone: string;
  categories: string[];
  badges?: string[];
  status?: StoreStatus;
  userId?: string;
}

export type Store = Seller;

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  tags: string[];
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  featured?: boolean;
  badge?: string;
  isFlashSale?: boolean;
  discountPercent?: number;
  variants?: ProductVariant[];
  shippingFee: number;
  estimatedDelivery: string;
  categoryId?: string | null;
  storeId?: string;
  isArchived?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  status?: ReviewStatus;
  storeId?: string;
  authorId?: string;
  orderId?: string;
  sellerReply?: string;
  sellerRepliedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface SellerOrderPackage {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  status: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée';
  trackingNumber?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentProvider?: PaymentProvider;
  mobileMoneyNumber?: string;
  packages: SellerOrderPackage[];
  overallStatus: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée';
  dbStatus?: OrderStatus;
  storeId?: string;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  sellerId: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  productId?: string;
  productTitle?: string;
}

export type LegalTab = 
  | 'terms' 
  | 'privacy' 
  | 'cookies' 
  | 'refund' 
  | 'legal_notices' 
  | 'dpo_form';

export type ActiveView = 
  | 'marketplace' 
  | 'product_detail' 
  | 'seller_shop' 
  | 'cart' 
  | 'checkout' 
  | 'order_confirmation' 
  | 'orders' 
  | 'wishlist' 
  | 'seller_dashboard'
  | 'admin_console'
  | 'login'
  | 'register'
  | 'profile'
  | 'legal';

// ----------------------------------------------------------------------------
// Spring Boot DTOs (Request / Response payloads)
// ----------------------------------------------------------------------------

export interface CreateOrderRequestDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  addressId?: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentProvider: PaymentProvider;
  mobileMoneyNumber?: string;
}

export interface CreateProductDto {
  storeId: string;
  categoryId?: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  images: string[];
  isFeatured?: boolean;
}

export interface CreatePromotionDto {
  storeId: string;
  productName: string;
  messageTitle: string;
  messageContent: string;
  discountPercentage: number;
  finalPrice: number;
  deadline: string;
}

export interface ArbitrateDisputeDto {
  disputeId: string;
  status: DisputeStatus;
  arbitrationNotes: string;
}
