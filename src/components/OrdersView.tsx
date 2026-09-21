import React from 'react';
import { Package, Truck, Store, ArrowLeft, Clock } from 'lucide-react';
import { Order, Seller } from '../types';

interface OrdersViewProps {
  orders: Order[];
  sellers: Seller[];
  onBack: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectSeller: (sellerId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onBack,
  onSelectProduct,
  onSelectSeller,
}) => {
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-surface-container flex items-center justify-center text-on-surface-variant">
          <Package className="w-8 h-8 opacity-50" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display-lg text-2xl font-bold text-on-surface">Aucune commande pour le moment</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Vos achats réalisés auprès de nos différents ateliers partenaires apparaîtront ici avec leur suivi NovaExpress en temps réel.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explorer la marketplace</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>
        <span className="text-xs text-on-surface-variant font-medium">
          {orders.length} commande{orders.length > 1 ? 's' : ''} enregistrée{orders.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="border-b border-surface-container pb-4">
        <h1 className="font-display-lg text-2xl font-bold text-on-surface">
          Mes Commandes & Suivi Marketplace
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Suivez l&apos;acheminement de vos colis expédiés en direct par chaque atelier partenaire.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 overflow-hidden shadow-xs">
            {/* Order Header */}
            <div className="bg-surface-container px-6 py-4 border-b border-surface-container flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">Commande</span>
                  <span className="font-bold text-on-surface text-sm font-mono">{order.id}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">Date</span>
                  <span className="font-semibold text-on-surface">{order.date}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[10px] uppercase font-bold tracking-wider">Total</span>
                  <span className="font-bold text-primary">{order.totalAmount.toFixed(2)} €</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary">
                  <Clock className="w-3.5 h-3.5" /> {order.overallStatus}
                </span>
              </div>
            </div>

            {/* Packages within this order */}
            <div className="p-6 space-y-6 divide-y divide-surface-container">
              {order.packages.map((pkg, idx) => (
                <div key={pkg.sellerId} className="pt-4 first:pt-0 space-y-4">
                  {/* Seller package status bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      <button
                        onClick={() => onSelectSeller(pkg.sellerId)}
                        className="font-bold text-on-surface text-xs sm:text-sm hover:text-primary transition-colors cursor-pointer"
                      >
                        Colis {idx + 1} de {pkg.sellerName}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        pkg.status === 'Livrée' 
                          ? 'bg-secondary-container text-on-secondary-container' 
                          : pkg.status === 'Expédiée'
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container text-on-surface'
                      }`}>
                        {pkg.status}
                      </span>
                    </div>
                  </div>

                  {/* Tracking number banner */}
                  {pkg.trackingNumber && (
                    <div className="bg-surface-container p-2.5 rounded-xl text-xs text-on-surface-variant flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <span>Numéro de suivi transporteur : <strong className="font-mono text-on-surface">{pkg.trackingNumber}</strong></span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">NovaExpress / Colissimo</span>
                    </div>
                  )}

                  {/* Items in this package */}
                  <div className="space-y-3">
                    {pkg.items.map((it) => (
                      <div key={it.product.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.product.images[0]}
                            alt={it.product.title}
                            onClick={() => onSelectProduct(it.product.id)}
                            className="w-14 h-14 object-cover rounded-xl border border-outline-variant cursor-pointer hover:opacity-90"
                          />
                          <div>
                            <h4
                              onClick={() => onSelectProduct(it.product.id)}
                              className="font-bold text-xs sm:text-sm text-on-surface cursor-pointer hover:text-primary line-clamp-1"
                            >
                              {it.product.title}
                            </h4>
                            <span className="text-xs text-on-surface-variant">
                              Quantité : {it.quantity} • Prix : {it.product.price.toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        <span className="font-bold text-xs sm:text-sm text-on-surface">
                          {(it.product.price * it.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
