import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onViewFullCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onViewFullCart
}) => {
  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const isFreeShipping = subtotal >= 49 || subtotal === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-5 border-b border-surface-container flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-headline-sm font-bold text-base text-on-surface">Mon Panier Actif</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">
                  {totalItemsCount}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Expéditions directes depuis les ateliers créateurs
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-on-surface">Votre panier est vide</p>
                <p className="text-xs text-on-surface-variant">Explorez les créations uniques de nos artisans indépendants.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors"
                >
                  Découvrir les pièces
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.product.id}
                  className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex gap-3.5"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover bg-surface shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-on-surface truncate">{item.product.title}</h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-on-surface-variant hover:text-error p-1 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-secondary font-medium truncate">
                        {item.product.sellerName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-surface rounded-lg border border-outline-variant p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-on-surface"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1 text-on-surface">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-on-surface"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-on-surface">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delivery Incentive Banner */}
          {items.length > 0 && (
            <div className="px-5 py-2.5 bg-emerald-500/10 border-t border-b border-emerald-500/20 text-emerald-800 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isFreeShipping 
                  ? 'Frais de port offerts applicables (Montant supérieur à 49,00 €)'
                  : `Plus que ${(49 - subtotal).toFixed(2)} € pour la livraison offerte`}
              </span>
            </div>
          )}

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-surface-container-lowest border-t border-surface-container space-y-3">
              <div className="space-y-1.5 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-semibold text-on-surface">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de port estimés</span>
                  <span className="font-semibold text-secondary">
                    {isFreeShipping ? 'Offerts' : '4.90 €'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-surface-container text-sm font-bold text-on-surface">
                  <span>Total à régler</span>
                  <span className="text-primary text-base font-extrabold">
                    {(isFreeShipping ? subtotal : subtotal + 4.90).toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Commander en 1 clic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onViewFullCart();
                  }}
                  className="w-full py-2 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl transition-all"
                >
                  Voir le détail multi-vendeurs
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                <span>Paiement sécurisé · Protection NovaEscrow</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
