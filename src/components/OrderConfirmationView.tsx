import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, Store } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationViewProps {
  order: Order;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onViewOrders,
  onContinueShopping,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="font-display-lg text-3xl font-bold text-on-surface">
          Merci pour votre commande !
        </h1>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Votre commande n° <strong className="text-on-surface font-mono">{order.id}</strong> a été transmise aux ateliers partenaires pour confection et préparation sous protection NovaEscrow.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container text-xs">
          <div>
            <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Date de commande</span>
            <span className="font-semibold text-on-surface">{order.date}</span>
          </div>
          <div>
            <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Règlement</span>
            <span className="font-semibold text-on-surface">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Montant total</span>
            <span className="font-headline-lg font-bold text-primary text-base">{order.totalAmount.toFixed(2)} €</span>
          </div>
        </div>

        {/* Packages breakdown */}
        <div className="space-y-4">
          <h3 className="font-headline-sm font-bold text-sm text-on-surface flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Colis préparés par vos ateliers ({order.packages.length})</span>
          </h3>

          <div className="space-y-3">
            {order.packages.map((pkg, i) => (
              <div key={pkg.sellerId} className="p-4 rounded-xl border border-outline-variant bg-surface-container space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-on-surface">
                    <Store className="w-3.5 h-3.5 text-primary" />
                    <span>Colis {i + 1} : {pkg.sellerName}</span>
                  </div>
                  <span className="text-xs bg-primary-container text-on-primary-container font-bold px-2.5 py-0.5 rounded-full">
                    {pkg.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-on-surface-variant border-t border-surface-container-high pt-2">
                  {pkg.items.map((it) => (
                    <div key={it.product.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={it.product.images[0]} alt={it.product.title} className="w-10 h-10 object-cover rounded-xl border border-outline-variant" />
                        <span className="font-medium text-on-surface">{it.quantity}x {it.product.title}</span>
                      </div>
                      <span className="font-bold text-on-surface">{(it.product.price * it.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                {pkg.trackingNumber && (
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant pt-1">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    <span>Numéro de suivi NovaExpress : <strong className="font-mono text-on-surface">{pkg.trackingNumber}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address */}
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface-variant space-y-1">
          <span className="font-bold text-on-surface block mb-1">Adresse de livraison :</span>
          <p className="font-medium text-on-surface">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.country}</p>
          <p>Tél : {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onViewOrders}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Suivre mes commandes</span>
        </button>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continuer mes achats</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
