// ============================================================================
// NOVAMARKET - API SERVICE LAYER (BACKWARD COMPATIBLE & ENHANCED)
// ============================================================================

export * from './apiClient';
export * from './userService';
export * from './productService';
export * from './storeService';
export * from './orderService';
export * from './promotionService';
export * from './disputeService';
export * from './payoutService';
export * from './reviewService';
export * from './chatService';

// Aliases for backward compatibility with existing imports
import { StoreService } from './storeService';
import { ProductService } from './productService';
import { OrderService } from './orderService';
import { PromotionService } from './promotionService';
import { DisputeService } from './disputeService';
import { PayoutService } from './payoutService';

export const StoresService = StoreService;
export const ProductsService = ProductService;
export const OrdersService = OrderService;
export const PromotionsService = PromotionService;
export const DisputesService = DisputeService;
export const PayoutsService = PayoutService;
