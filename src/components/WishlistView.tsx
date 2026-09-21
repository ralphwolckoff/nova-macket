import React from 'react';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistViewProps {
  wishlistProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistProducts,
  onBack,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-error-container text-on-error-container flex items-center justify-center">
          <Heart className="w-8 h-8 text-error" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display-lg text-2xl font-bold text-on-surface">Votre liste de favoris est vide</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Sauvegardez vos pièces coups de cœur d&apos;artisanat pour les retrouver instantanément lors de vos prochaines visites.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorer les nouveautés</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la marketplace</span>
        </button>
        <span className="text-xs text-on-surface-variant font-medium">
          {wishlistProducts.length} pièce{wishlistProducts.length > 1 ? 's' : ''} sauvegardée{wishlistProducts.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="border-b border-surface-container pb-4">
        <h1 className="font-display-lg text-2xl font-bold text-on-surface">
          Mes Coups de Cœur
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((p) => (
          <div key={p.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 overflow-hidden shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={() => onSelectProduct(p)}>
              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromWishlist(p.id);
                }}
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-surface-container-lowest/90 text-error hover:bg-surface-container-lowest shadow-xs cursor-pointer"
                title="Retirer"
                aria-label="Retirer de la liste d'envies"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <button
                  onClick={() => onSelectSeller(p.sellerId)}
                  className="text-xs font-bold text-on-surface-variant hover:text-primary block truncate cursor-pointer"
                >
                  {p.sellerName}
                </button>
                <h3 
                  onClick={() => onSelectProduct(p)}
                  className="font-headline-sm font-bold text-xs sm:text-sm text-on-surface line-clamp-2 hover:text-primary cursor-pointer mt-1"
                >
                  {p.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="font-headline-lg font-bold text-sm text-on-surface">{p.price.toFixed(2)} €</span>
                <button
                  onClick={() => onAddToCart(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Panier</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
