import React from 'react';
import { Star, Heart, ShoppingBag, Store, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const displayImage = imgError
    ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
    : product.images[0];

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const stockText = isLowStock 
    ? `Plus que ${product.stock} exemplaires !` 
    : 'En stock · Expédié sous 24h';

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 w-full bg-surface-container-low overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary text-on-primary shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-xs z-10 ${
            isWishlisted
              ? 'bg-surface text-error'
              : 'bg-surface/85 text-on-surface-variant hover:text-error hover:bg-surface'
          }`}
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-error text-error' : ''}`} />
        </button>

        {/* Stock / Shipping status pill */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md shadow-xs ${
            isLowStock 
              ? 'bg-amber-950/80 text-amber-200 border border-amber-500/30' 
              : 'bg-surface/90 text-on-surface border border-outline-variant/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            {stockText}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Multi-Vendor Seller Attribution */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <button
              id={`seller-link-${product.sellerId}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSeller(product.sellerId);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors truncate max-w-[70%]"
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{product.sellerName}</span>
              <CheckCircle2 className="w-3 h-3 text-secondary shrink-0" />
            </button>
            <span className="text-[10px] text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded-full shrink-0">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-on-surface text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-on-surface">{product.rating}</span>
            <span className="text-xs text-on-surface-variant">({product.reviewCount} avis)</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-on-surface">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-xs text-on-surface-variant line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <span className="text-[10px] text-secondary font-medium block">
              Expédition offerte
            </span>
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            onClick={(e) => onAddToCart(product, e)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
