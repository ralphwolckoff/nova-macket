import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Store, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Tag, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { CartItem, Seller } from '../types';

interface CartViewProps {
  cart: CartItem[];
  sellers: Seller[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectSeller: (sellerId: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  sellers,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
  onSelectSeller,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Group cart items by seller
  const sellerGroups: Record<string, { sellerName: string; items: CartItem[]; subtotal: number; shippingFee: number }> = {};

  cart.forEach(item => {
    const sId = item.product.sellerId;
    if (!sellerGroups[sId]) {
      sellerGroups[sId] = {
        sellerName: item.product.sellerName,
        items: [],
        subtotal: 0,
        shippingFee: item.product.shippingFee
      };
    }
    sellerGroups[sId].items.push(item);
    sellerGroups[sId].subtotal += item.product.price * item.quantity;
  });

  // Calculate shipping: if seller subtotal >= 49, shipping is free for that seller!
  let totalItemsPrice = 0;
  let totalShipping = 0;

  Object.values(sellerGroups).forEach(group => {
    totalItemsPrice += group.subtotal;
    const effectiveShipping = group.subtotal >= 49 ? 0 : group.shippingFee;
    group.shippingFee = effectiveShipping;
    totalShipping += effectiveShipping;
  });

  const finalTotal = Math.max(0, totalItemsPrice + totalShipping - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'NOVATRUST' || promoCode.trim().toUpperCase() === 'BIENVENUE10') {
      setDiscountAmount(10);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'NOVA20' && totalItemsPrice >= 100) {
      setDiscountAmount(20);
      setPromoApplied(true);
    } else {
      setPromoError('Code avantage non valide (essayez NOVATRUST)');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-container flex items-center justify-center text-on-surface-variant">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display-lg text-2xl font-bold text-on-surface">Votre panier est vide</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Découvrez nos ateliers partenaires et créateurs certifiés pour remplir votre panier de pièces d&apos;artisanat d&apos;exception.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorer la marketplace</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onContinueShopping}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuer mes achats</span>
        </button>
        <span className="text-xs text-on-surface-variant font-medium">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} articles • {Object.keys(sellerGroups).length} colis atelier{Object.keys(sellerGroups).length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items Grouped by Seller (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <h1 className="font-display-lg text-2xl font-bold text-on-surface">
            Mon Panier Multi-Ateliers
          </h1>

          {Object.entries(sellerGroups).map(([sellerId, group]) => {
            const sellerDetails = sellers.find(s => s.id === sellerId);
            const remainingForFreeShipping = Math.max(0, 49 - group.subtotal);

            return (
              <div 
                key={sellerId} 
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 overflow-hidden shadow-xs"
              >
                {/* Seller Package Header */}
                <div className="bg-surface-container px-4 py-3 border-b border-surface-container flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    <button
                      onClick={() => onSelectSeller(sellerId)}
                      className="font-bold text-on-surface text-xs sm:text-sm hover:text-primary transition-colors cursor-pointer"
                    >
                      Colis expédié en direct par {group.sellerName}
                    </button>
                    {sellerDetails?.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                    )}
                  </div>

                  <div className="text-xs">
                    {group.shippingFee === 0 ? (
                      <span className="text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded-full">
                        Livraison offerte
                      </span>
                    ) : (
                      <span className="text-on-surface-variant font-medium">
                        Port : {group.shippingFee.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>

                {/* Free shipping progress indicator */}
                {remainingForFreeShipping > 0 && (
                  <div className="bg-surface-container-low px-4 py-1.5 text-[11px] text-on-surface border-b border-surface-container flex items-center justify-between">
                    <span>
                      Ajoutez <strong>{remainingForFreeShipping.toFixed(2)} €</strong> de créations de cet atelier pour bénéficier de la livraison gratuite !
                    </span>
                    <button
                      onClick={() => onSelectSeller(sellerId)}
                      className="text-primary font-bold hover:underline shrink-0 ml-2"
                    >
                      Voir boutique →
                    </button>
                  </div>
                )}

                {/* Items in this Seller Package */}
                <div className="divide-y divide-surface-container p-4 space-y-4">
                  {group.items.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex gap-4 items-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        onClick={() => onSelectProduct(item.product.id)}
                        className="w-20 h-20 object-cover rounded-xl border border-outline-variant cursor-pointer shrink-0 hover:opacity-90"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 
                          onClick={() => onSelectProduct(item.product.id)}
                          className="font-bold text-xs sm:text-sm text-on-surface truncate cursor-pointer hover:text-primary"
                        >
                          {item.product.title}
                        </h4>

                        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant mt-1">
                            {Object.entries(item.selectedVariants).map(([k, v]) => (
                              <span key={k} className="bg-surface-container px-2 py-0.5 rounded text-[11px] font-medium">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-on-surface-variant hover:bg-surface-container"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold text-on-surface">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-1.5 text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-xs sm:text-sm text-on-surface">
                              {(item.product.price * item.quantity).toFixed(2)} €
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-on-surface-variant hover:text-error p-1 transition-colors"
                              title="Supprimer du panier"
                              aria-label="Supprimer cet article du panier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-headline-sm font-bold text-base text-on-surface border-b border-surface-container pb-3">
              Récapitulatif de commande
            </h3>

            {/* Price lines */}
            <div className="space-y-2 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-semibold text-on-surface">{totalItemsPrice.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between">
                <span>Frais d&apos;expédition ateliers :</span>
                <span className="font-semibold text-secondary">
                  {totalShipping === 0 ? 'Gratuits' : `${totalShipping.toFixed(2)} €`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-secondary font-bold">
                  <span>Remise coupon NovaMarket :</span>
                  <span>-{discountAmount.toFixed(2)} €</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-container flex justify-between items-baseline">
                <span className="text-xs font-bold text-on-surface">Total TTC à régler :</span>
                <span className="font-headline-lg text-xl font-bold text-primary">{finalTotal.toFixed(2)} €</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-surface-container space-y-2">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-primary" />
                Code avantage / coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (ex: NOVATRUST)"
                  className="flex-1 text-xs px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary uppercase font-bold"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Appliquer
                </button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-secondary font-bold">
                  ✓ Remise appliquée (-{discountAmount} €) !
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-error font-medium">{promoError}</p>
              )}
            </form>

            {/* Checkout CTA */}
            <button
              id="proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Marketplace Protections */}
            <div className="pt-4 border-t border-surface-container space-y-2 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>Protection Séquestre NovaEscrow active</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Suivi indépendant NovaExpress pour chaque atelier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
