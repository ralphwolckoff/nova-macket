import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Store, 
  Smartphone,
  Lock
} from 'lucide-react';
import { CartItem, ShippingAddress, Order, SellerOrderPackage, LegalTab } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  onBack: () => void;
  onOrderCompleted: (order: Order) => void;
  onOpenLegalTab?: (tab: LegalTab) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  onBack,
  onOrderCompleted,
  onOpenLegalTab,
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Éléonore de Montmirail',
    email: 'eleonore.montmirail@atelier.fr',
    phone: '+33 6 82 45 91 30',
    address: '24 Rue des Francs-Bourgeois',
    city: 'Paris',
    postalCode: '75004',
    country: 'France',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'paypal' | 'mobile_money'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('834');
  const [mobileProvider, setMobileProvider] = useState('Orange Money');
  const [mobilePhone, setMobilePhone] = useState('+33 6 82 45 91 30');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Group items by seller for multi-vendor packages
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

  let totalItems = 0;
  let totalShipping = 0;
  const packages: SellerOrderPackage[] = [];

  Object.entries(sellerGroups).forEach(([sellerId, group]) => {
    totalItems += group.subtotal;
    const effShipping = group.subtotal >= 49 ? 0 : group.shippingFee;
    totalShipping += effShipping;

    packages.push({
      sellerId,
      sellerName: group.sellerName,
      items: group.items,
      subtotal: group.subtotal,
      shippingFee: effShipping,
      status: 'En attente',
      trackingNumber: `NV-${Math.floor(100000 + Math.random() * 900000)}FR`
    });
  });

  const totalAmount = totalItems + totalShipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderNum,
        orderNumber: orderNum,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        items: [...cart],
        totalAmount,
        shippingAddress: address,
        paymentMethod: paymentMethod === 'card' 
          ? `Carte Bancaire (**** ${cardNumber.slice(-4)})` 
          : paymentMethod === 'paypal' ? 'PayPal Express'
          : paymentMethod === 'apple_pay' ? 'Apple Pay' 
          : `Mobile Money Campay (${mobileProvider} ${mobilePhone})`,
        paymentProvider: paymentMethod === 'mobile_money' ? 'campay' : 'stripe',
        mobileMoneyNumber: paymentMethod === 'mobile_money' ? mobilePhone : undefined,
        dbStatus: 'pending',
        packages,
        overallStatus: 'En attente',
      };

      setIsProcessing(false);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au panier</span>
      </button>

      <div className="border-b border-surface-container pb-4">
        <h1 className="font-display-lg text-2xl font-bold text-on-surface">
          Règlement et Expédition Sécurisée
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Chaque création est expédiée directement par l&apos;atelier partenaire respectif sous garantie NovaEscrow.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Address & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-on-surface font-bold text-base border-b border-surface-container pb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span className="font-headline-sm">Adresse de livraison</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-on-surface block mb-1">Nom complet & prénom</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Adresse email</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Numéro de téléphone</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-on-surface block mb-1">Adresse postale</label>
                <input
                  type="text"
                  required
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Code postal</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Ville</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-on-surface font-bold text-base border-b border-surface-container pb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span className="font-headline-sm">Mode de règlement sécurisé</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container text-on-surface hover:border-outline'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span>Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container text-on-surface hover:border-outline'
                }`}
              >
                <Lock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <span>Apple / Google</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'paypal'
                    ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container text-on-surface hover:border-outline'
                }`}
              >
                <span className="text-sm font-bold block mb-1 text-primary">P</span>
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'mobile_money'
                    ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                    : 'border-outline-variant bg-surface-container text-on-surface hover:border-outline'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <span>Mobile Money</span>
              </button>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="pt-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Numéro de carte</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">Date d&apos;expiration</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">Cryptogramme CVC</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div className="pt-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Opérateur</label>
                  <select
                    value={mobileProvider}
                    onChange={(e) => setMobileProvider(e.target.value)}
                    className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Wave">Wave</option>
                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                    <option value="Moov Money">Moov Money</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Numéro Mobile Money</label>
                  <input
                    type="tel"
                    required
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            )}

            {(paymentMethod === 'paypal' || paymentMethod === 'apple_pay') && (
              <div className="p-4 bg-surface-container rounded-xl text-center text-xs text-on-surface-variant">
                Vous validerez le paiement directement via votre authentification biométrique ou compte tiers sécurisé.
              </div>
            )}
          </div>
        </div>

        {/* Right: Multi-Vendor Packages Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 shadow-xs space-y-4">
            <h3 className="font-headline-sm font-bold text-base text-on-surface border-b border-surface-container pb-3">
              Expédition & Colis Ateliers
            </h3>

            {/* Packages */}
            <div className="space-y-3">
              {packages.map((pkg, idx) => (
                <div key={pkg.sellerId} className="p-3 rounded-xl border border-outline-variant bg-surface-container space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-primary" />
                      Colis {idx + 1} : {pkg.sellerName}
                    </span>
                    <span className="text-secondary font-bold">
                      {pkg.shippingFee === 0 ? 'Offert' : `+${pkg.shippingFee.toFixed(2)} €`}
                    </span>
                  </div>

                  <div className="text-[11px] text-on-surface-variant space-y-1">
                    {pkg.items.map(it => (
                      <div key={it.product.id} className="flex justify-between truncate">
                        <span className="truncate">{it.quantity}x {it.product.title}</span>
                        <span className="font-semibold text-on-surface">{(it.product.price * it.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-on-surface-variant pt-3 border-t border-surface-container">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-semibold text-on-surface">{totalItems.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais d&apos;expédition totaux :</span>
                <span className="font-semibold text-secondary">
                  {totalShipping === 0 ? 'Offerts' : `${totalShipping.toFixed(2)} €`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-surface-container">
                <span>Total à régler :</span>
                <span className="font-headline-lg text-primary">{totalAmount.toFixed(2)} €</span>
              </div>
            </div>

            {/* Legal Consent & Terms (Code de la consommation art. L. 221-14 & RGPD) */}
            <div className="p-3.5 bg-surface-container rounded-xl border border-outline-variant space-y-2 text-[11px]">
              <label className="flex items-start gap-2.5 cursor-pointer text-on-surface">
                <input
                  id="checkout-accept-terms-checkbox"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="leading-snug">
                  Je reconnais que la passation de cette commande m&apos;engage à son paiement et j&apos;accepte expressément les{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegalTab && onOpenLegalTab('terms')}
                    className="text-primary underline font-semibold hover:text-primary-container inline"
                  >
                    Conditions Générales de Vente (CGV)
                  </button>{' '}
                  ainsi que la{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegalTab && onOpenLegalTab('privacy')}
                    className="text-primary underline font-semibold hover:text-primary-container inline"
                  >
                    Politique de Confidentialité
                  </button>.
                </span>
              </label>

              <div className="text-[10px] text-on-surface-variant/80 border-t border-outline-variant/60 pt-2 flex flex-col gap-1">
                <span>• <strong>Droit de rétractation :</strong> Vous disposez d&apos;un délai légal de 14 jours dès réception pour vous rétracter sans motif.</span>
                <span>• <strong>Minimisation des données :</strong> Coordonnées strictement nécessaires au traitement du colis et à l&apos;émission de la facture (Art. 6.1.b RGPD).</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="confirm-payment-btn"
              type="submit"
              disabled={isProcessing || !acceptTerms}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  <span>Traitement sécurisé NovaTrust...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirmer et Payer ({totalAmount.toFixed(2)} €)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Paiement crypté sous séquestre NovaTrust · Satisfait ou remboursé</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
