import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Copy, 
  Check, 
  Clock, 
  Percent, 
  Trash2,
  Calendar,
  Layers,
  Database,
  Timer,
  Info,
  X
} from 'lucide-react';
import { PromoCode, CreatePromoModal } from './CreatePromoModal';
import { PromotionEntity } from '../types';

export const SellerPromotionsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'flash' | 'coupons'>('flash');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreatePromoModal, setShowCreatePromoModal] = useState(false);
  const [showCreateFlashModal, setShowCreateFlashModal] = useState(false);

  // Table public.promotions state (Supabase schema direct mapping)
  const [flashPromotions, setFlashPromotions] = useState<PromotionEntity[]>([
    {
      id: 'f1',
      store_id: 'str-1',
      product_name: 'Vase en Grès Cérame Émaillé',
      message_title: 'Weekend Artisanal Céramique',
      message_content: 'Profitez de -30% immédiat sur nos vases façonnés main au tour de potier.',
      discount_percentage: 30,
      final_price: 66.50,
      deadline: new Date(Date.now() + 14 * 3600 * 1000 + 32 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'f2',
      store_id: 'str-1',
      product_name: 'Lampe Art Déco en Chêne & Laiton',
      message_title: 'Offre Éclair Édition Limitée',
      message_content: 'Remise exclusive de 20% pour les 15 premiers exemplaires numérotés.',
      discount_percentage: 20,
      final_price: 139.20,
      deadline: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  // Flash Modal Form State
  const [flashForm, setFlashForm] = useState({
    product_name: '',
    message_title: '',
    message_content: '',
    discount_percentage: '25',
    final_price: '75.00',
    deadlineHours: '24'
  });

  // Table public.coupons (recommended extension for basket vouchers)
  const [promos, setPromos] = useState<PromoCode[]>([
    {
      id: 'p1',
      code: 'NOVASPRING20',
      campaignName: 'Opération Printemps Céramique',
      buyerDesc: '-20% sur la vaisselle d\'artisanat',
      type: 'percent',
      value: 20,
      minOrder: 50,
      scope: 'Céramique',
      userLimit: true,
      startDate: '01/05/2025',
      endDate: '31/05/2025',
      usageCount: 68,
      usageLimit: 100,
      revenueGenerated: 2140.00,
      status: 'active'
    },
    {
      id: 'p2',
      code: 'BIENVENUE10',
      campaignName: 'Coupon Nouveau Client Atelier',
      buyerDesc: '10€ offerts dès 60€ d\'achat',
      type: 'amount',
      value: 10,
      minOrder: 60,
      scope: 'Toute la boutique',
      userLimit: true,
      startDate: '01/01/2025',
      endDate: '31/12/2025',
      usageCount: 142,
      usageLimit: 500,
      revenueGenerated: 1420.00,
      status: 'active'
    },
    {
      id: 'p3',
      code: 'LIVRAISONFREE',
      campaignName: 'Offre Frais de Port Colissimo',
      buyerDesc: 'Livraison offerte à domicile',
      type: 'shipping',
      value: 4.90,
      minOrder: 80,
      scope: 'Toute la boutique',
      userLimit: false,
      startDate: '10/05/2025',
      endDate: '25/05/2025',
      usageCount: 34,
      usageLimit: 50,
      revenueGenerated: 280.00,
      status: 'active'
    }
  ]);

  // Countdown timer for primary flash sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(flashForm.deadlineHours, 10) || 24;
    const deadline = new Date(Date.now() + hours * 3600 * 1000).toISOString();

    const newPromotion: PromotionEntity = {
      id: `f-${Math.random().toString(36).substring(2, 9)}`,
      store_id: 'str-1',
      product_name: flashForm.product_name,
      message_title: flashForm.message_title,
      message_content: flashForm.message_content,
      discount_percentage: parseFloat(flashForm.discount_percentage) || 20,
      final_price: parseFloat(flashForm.final_price) || 50,
      deadline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setFlashPromotions([newPromotion, ...flashPromotions]);
    setShowCreateFlashModal(false);
    setFlashForm({
      product_name: '',
      message_title: '',
      message_content: '',
      discount_percentage: '25',
      final_price: '75.00',
      deadlineHours: '24'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Tag className="w-4 h-4" />
            <span>Stratégie Commerciale & Fidélisation</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Promotions & Campagnes Marchandes
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Gérez vos offres éclair broadcastées (table <code className="font-mono font-bold text-primary">public.promotions</code>) et vos coupons de panier d&apos;achat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowCreateFlashModal(true)}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nouvelle Vente Flash (Table promotions)</span>
          </button>

          <button
            onClick={() => setShowCreatePromoModal(true)}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/60 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Code Promo (Table coupons)</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">CA Ventes Flash & Promos</span>
          <div className="font-mono font-bold text-2xl text-on-surface">4 680,00 €</div>
          <div className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +21.5% de volume additionnel
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Offres Flash Actives</span>
          <div className="font-mono font-bold text-2xl text-primary">{flashPromotions.length} en cours</div>
          <div className="text-[11px] text-on-surface-variant">
            Diffusion ciblée aux acheteurs abonnés
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Taux d&apos;Utilisation Coupons</span>
          <div className="font-mono font-bold text-2xl text-secondary">68.2%</div>
          <div className="text-[11px] text-secondary font-semibold">
            244 coupons consommés
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Marge Préservée</span>
          <div className="font-mono font-bold text-2xl text-outline">64.5%</div>
          <div className="text-[11px] text-tertiary font-semibold">
            Retour sur investissement : 5.8x
          </div>
        </div>
      </div>

      {/* Flash Sale Hero Countdown */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-primary/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Vente Flash Spéciale en Direct (public.promotions)
            </div>
            <h2 className="font-title-lg font-bold text-base sm:text-lg text-on-surface">
              {flashPromotions[0]?.product_name || 'Vase Artisanal Grès'} — {flashPromotions[0]?.discount_percentage}% de réduction
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {flashPromotions[0]?.message_content || 'Offre limitée dans le temps avec notification push aux acheteurs.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/50">
          <Clock className="w-4 h-4 text-primary mr-1" />
          <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base text-on-surface">
            <div className="bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/60">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span>:</span>
            <div className="bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/60">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span>:</span>
            <div className="bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/60 text-primary">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Flash (public.promotions) vs Coupons (public.coupons) */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2">
        <button
          onClick={() => setActiveSubTab('flash')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'flash'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ventes Flash & Notifications (Table public.promotions)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
            {flashPromotions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'coupons'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Bons de Réduction Panier (Table public.coupons)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant text-[10px]">
            {promos.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: FLASH SALES (public.promotions) */}
      {activeSubTab === 'flash' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-lg font-bold text-base text-on-surface">
                  Ventes Flash Actives — Table Supabase &quot;public.promotions&quot;
                </h2>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                  Schéma Supabase Natif
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Chaque enregistrement possède une deadline stricte, un prix remisé <code className="font-mono">final_price</code> et un titre de message pour notification push.
              </p>
            </div>
            <button
              onClick={() => setShowCreateFlashModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lancer une Vente Flash</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashPromotions.map((promo) => {
              const deadlineDate = new Date(promo.deadline);
              const isExpired = deadlineDate.getTime() < Date.now();
              return (
                <div 
                  key={promo.id} 
                  className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold uppercase">
                          -{promo.discount_percentage}%
                        </span>
                        <span className="font-mono text-[10px] text-outline">
                          UUID: {promo.id}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-on-surface">{promo.product_name}</h3>
                      <p className="text-xs text-primary font-semibold mt-0.5">{promo.message_title}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-outline block">Prix Flash :</span>
                      <span className="font-mono font-bold text-base text-tertiary">
                        {promo.final_price.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/40">
                    &quot;{promo.message_content}&quot;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px]">
                      <Timer className="w-3.5 h-3.5 text-secondary" />
                      <span>Fin : {deadlineDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        !isExpired ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-outline'
                      }`}>
                        {!isExpired ? 'Active' : 'Expirée'}
                      </span>
                      <button
                        onClick={() => setFlashPromotions(flashPromotions.filter(p => p.id !== promo.id))}
                        className="p-1 rounded text-outline hover:text-error transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COUPONS (public.coupons) */}
      {activeSubTab === 'coupons' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-lg font-bold text-base text-on-surface">
                  Codes Promo Panier & Coupons
                </h2>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  Extension Recommandée (Table public.coupons)
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Permet d&apos;appliquer des réductions au panier lors du checkout (<code className="font-mono">NOVASPRING20</code>, <code className="font-mono">BIENVENUE10</code>).
              </p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              {promos.length} codes configurés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant">
                  <th className="pb-3 font-semibold">Code Promo</th>
                  <th className="pb-3 font-semibold">Campagne & Avantage</th>
                  <th className="pb-3 font-semibold">Conditions</th>
                  <th className="pb-3 font-semibold">Validité</th>
                  <th className="pb-3 font-semibold text-center">Utilisations</th>
                  <th className="pb-3 font-semibold text-right">CA Généré</th>
                  <th className="pb-3 font-semibold text-center">Statut</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/60 font-mono font-bold text-primary text-xs">
                        <span>{promo.code}</span>
                        <button
                          onClick={() => handleCopy(promo.code)}
                          className="hover:text-on-surface transition-colors cursor-pointer"
                          title="Copier le code"
                        >
                          {copiedCode === promo.code ? (
                            <Check className="w-3.5 h-3.5 text-tertiary" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-on-surface block">{promo.campaignName}</span>
                      <span className="text-[11px] text-tertiary font-medium">{promo.buyerDesc}</span>
                    </td>

                    <td className="py-3.5">
                      <span className="block text-on-surface font-medium">
                        {promo.minOrder > 0 ? `Dès ${promo.minOrder} € d'achat` : 'Sans minimum'}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">{promo.scope}</span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{promo.endDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono font-bold text-xs text-on-surface">
                          {promo.usageCount} / {promo.usageLimit}
                        </span>
                        <div className="h-1.5 w-24 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (promo.usageCount / promo.usageLimit) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-mono font-bold text-right text-on-surface">
                      {promo.revenueGenerated.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </td>

                    <td className="py-3.5 text-center">
                      {promo.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
                          Épuisé
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setPromos(promos.filter(p => p.id !== promo.id))}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE FLASH SALE MODAL (public.promotions schema) */}
      {showCreateFlashModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">
                    Créer une Offre Flash (Table public.promotions)
                  </h3>
                  <span className="text-[11px] text-outline">Notification broadcast avec compte à rebours</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateFlashModal(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container text-outline cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFlashSale} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Nom du Produit Cible</label>
                <input
                  type="text"
                  required
                  value={flashForm.product_name}
                  onChange={(e) => setFlashForm({ ...flashForm, product_name: e.target.value })}
                  placeholder="Ex: Vase en Grès Émaillé"
                  className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Titre du Message Notification</label>
                <input
                  type="text"
                  required
                  value={flashForm.message_title}
                  onChange={(e) => setFlashForm({ ...flashForm, message_title: e.target.value })}
                  placeholder="Ex: Vente Flash Weekend Céramique"
                  className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-on-surface block mb-1">Contenu Détaillé du Message</label>
                <textarea
                  required
                  rows={2}
                  value={flashForm.message_content}
                  onChange={(e) => setFlashForm({ ...flashForm, message_content: e.target.value })}
                  placeholder="Ex: -30% exceptionnel sur toute commande passée dans les prochaines 24h."
                  className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Remise (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={flashForm.discount_percentage}
                    onChange={(e) => setFlashForm({ ...flashForm, discount_percentage: e.target.value })}
                    className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Prix Final (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={flashForm.final_price}
                    onChange={(e) => setFlashForm({ ...flashForm, final_price: e.target.value })}
                    className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Durée (Heures)</label>
                  <select
                    value={flashForm.deadlineHours}
                    onChange={(e) => setFlashForm({ ...flashForm, deadlineHours: e.target.value })}
                    className="w-full p-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface cursor-pointer"
                  >
                    <option value="12">12 heures</option>
                    <option value="24">24 heures</option>
                    <option value="48">48 heures</option>
                    <option value="72">72 heures</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowCreateFlashModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enregistrer dans Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROMO COUPON MODAL (public.coupons) */}
      <CreatePromoModal
        isOpen={showCreatePromoModal}
        onClose={() => setShowCreatePromoModal(false)}
        onSavePromo={(newPromo) => {
          setPromos([newPromo, ...promos]);
          setShowCreatePromoModal(false);
        }}
      />
    </div>
  );
};
