import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  Percent, 
  DollarSign, 
  Truck, 
  Sparkles, 
  Check, 
  RotateCw, 
  TrendingUp, 
  Bot, 
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

export interface PromoCode {
  id: string;
  code: string;
  campaignName: string;
  buyerDesc: string;
  type: 'percent' | 'amount' | 'shipping' | 'flash';
  value: number;
  minOrder: number;
  scope: string;
  userLimit: boolean;
  startDate: string;
  endDate: string;
  usageCount: number;
  usageLimit: number;
  revenueGenerated: number;
  status: 'active' | 'scheduled' | 'exhausted' | 'expired';
}

interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePromo: (promo: PromoCode) => void;
}

export const CreatePromoModal: React.FC<CreatePromoModalProps> = ({
  isOpen,
  onClose,
  onSavePromo,
}) => {
  const [promoCode, setPromoCode] = useState('ATELIERETE25');
  const [campaignName, setCampaignName] = useState('Vente privée Été — Céramique & Art de la Table');
  const [buyerDesc, setBuyerDesc] = useState('Profitez de 20% de remise exclusive sur toute la collection artisanale d\'été.');
  const [discountType, setDiscountType] = useState<'percent' | 'amount' | 'shipping'>('percent');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrder, setMinOrder] = useState('50');
  const [noMin, setNoMin] = useState(false);
  const [scope, setScope] = useState('ceramique');
  const [userLimit, setUserLimit] = useState(true);
  const [startDate, setStartDate] = useState('2025-06-15T09:00');
  const [endDate, setEndDate] = useState('2025-07-15T23:59');
  const [quota, setQuota] = useState('100');
  const [activeImmediately, setActiveImmediately] = useState(true);
  const [aiApplied, setAiApplied] = useState(false);

  if (!isOpen) return null;

  const baseCart = 76.50;
  const numVal = parseFloat(discountValue) || 0;

  let calculatedDiscount = 0;
  if (discountType === 'percent') {
    calculatedDiscount = (baseCart * Math.min(numVal, 100)) / 100;
  } else if (discountType === 'amount') {
    calculatedDiscount = Math.min(numVal, baseCart);
  } else {
    calculatedDiscount = 4.90;
  }

  const newTotal = Math.max(0, baseCart - calculatedDiscount);
  const commission = newTotal * 0.10;
  const payout = newTotal - commission;
  const marginPct = Math.max(10, Math.round(((payout - (baseCart * 0.35)) / payout) * 1000) / 10);

  const handleGenerateCode = () => {
    const words = ['ETE', 'NOVA', 'FLASH', 'VIP', 'SOLDE', 'DECO', 'ART'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setPromoCode(`NOVA${randomWord}${randomNum}`);
  };

  const handleApplyAiSuggestion = () => {
    setMinOrder('60');
    setNoMin(false);
    setAiApplied(true);
  };

  const handlePublish = (asDraft = false) => {
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: promoCode.trim().toUpperCase() || 'NOVA20',
      campaignName,
      buyerDesc,
      type: discountType,
      value: numVal,
      minOrder: noMin ? 0 : (parseFloat(minOrder) || 0),
      scope,
      userLimit,
      startDate,
      endDate,
      usageCount: 0,
      usageLimit: parseInt(quota, 10) || 100,
      revenueGenerated: 0,
      status: asDraft ? 'scheduled' : (activeImmediately ? 'active' : 'scheduled')
    };

    onSavePromo(newPromo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] border border-outline-variant/60">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-lowest border-b border-surface-container flex items-start justify-between relative shadow-xs z-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
                  Créer un nouveau Code Promotionnel
                </h2>
                <span className="text-[10px] bg-surface-container text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Brouillon v1.0
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Configurez les paramètres d&apos;éligibilité, les plafonds et mesurez l&apos;impact estimé sur vos marges en direct.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-low/40">
          
          {/* Left Column (7 cols): Step-by-step form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Section 1: Code & Identification */}
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Code & Opération</h3>
                </div>
                <span className="text-[11px] text-on-surface-variant font-medium">Requis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                    <span>Code Promo Public</span>
                    <button 
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-primary text-[11px] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Générer aléatoire</span>
                    </button>
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="EX: NOVELLE20"
                    className="h-10 px-3 uppercase font-mono font-bold text-primary rounded-lg bg-surface-container-low text-xs border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold">Nom interne de campagne</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Nom pour votre suivi"
                    className="h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                  <span>Description pour l&apos;acheteur (panier)</span>
                  <span className="text-[11px] text-outline font-normal">Max 80 caractères</span>
                </label>
                <input
                  type="text"
                  value={buyerDesc}
                  onChange={(e) => setBuyerDesc(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Section 2: Discount Type & Value */}
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Type de Réduction & Valeur</h3>
                </div>
                <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Calcul instantané
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('percent');
                    setDiscountValue('20');
                  }}
                  className={`p-3 rounded-xl transition-all text-left flex flex-col justify-between gap-2 border cursor-pointer ${
                    discountType === 'percent'
                      ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-surface-container-low/40 border-outline-variant/60 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Percent className={`w-5 h-5 ${discountType === 'percent' ? 'text-primary' : 'text-outline'}`} />
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      discountType === 'percent' ? 'bg-primary text-on-primary font-bold' : 'bg-outline-variant/60'
                    }`}>
                      {discountType === 'percent' && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Pourcentage</span>
                    <span className="text-[11px] text-on-surface-variant">Remise au prorata</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('amount');
                    setDiscountValue('15');
                  }}
                  className={`p-3 rounded-xl transition-all text-left flex flex-col justify-between gap-2 border cursor-pointer ${
                    discountType === 'amount'
                      ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-surface-container-low/40 border-outline-variant/60 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <DollarSign className={`w-5 h-5 ${discountType === 'amount' ? 'text-primary' : 'text-outline'}`} />
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      discountType === 'amount' ? 'bg-primary text-on-primary font-bold' : 'bg-outline-variant/60'
                    }`}>
                      {discountType === 'amount' && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Montant fixe</span>
                    <span className="text-[11px] text-on-surface-variant">Déduction nette €</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDiscountType('shipping');
                    setDiscountValue('4.90');
                  }}
                  className={`p-3 rounded-xl transition-all text-left flex flex-col justify-between gap-2 border cursor-pointer ${
                    discountType === 'shipping'
                      ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-surface-container-low/40 border-outline-variant/60 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Truck className={`w-5 h-5 ${discountType === 'shipping' ? 'text-primary' : 'text-outline'}`} />
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      discountType === 'shipping' ? 'bg-primary text-on-primary font-bold' : 'bg-outline-variant/60'
                    }`}>
                      {discountType === 'shipping' && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Port offert</span>
                    <span className="text-[11px] text-on-surface-variant">Colissimo & Relais</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div>
                  <label className="text-xs font-bold text-on-surface block">Valeur de l&apos;avantage</label>
                  <p className="text-[11px] text-on-surface-variant">S&apos;applique sur les articles éligibles</p>
                </div>
                <div className="w-36 relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'percent' ? 100 : 500}
                    disabled={discountType === 'shipping'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-mono font-bold text-base text-right border border-outline-variant focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <span className="absolute right-3 font-bold text-primary pointer-events-none">
                    {discountType === 'percent' ? '%' : '€'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Eligibility & Conditions */}
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Conditions d&apos;Application & Cibles</h3>
                </div>
                <span className="text-[11px] text-outline font-medium">Filtres</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-on-surface font-semibold">Panier minimum d&apos;achat</label>
                    <label className="flex items-center gap-1 cursor-pointer text-[11px] text-on-surface-variant">
                      <input 
                        type="checkbox"
                        checked={noMin}
                        onChange={(e) => setNoMin(e.target.checked)}
                        className="accent-primary rounded"
                      />
                      <span>Aucun</span>
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      disabled={noMin}
                      value={noMin ? '0' : minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-xs font-mono text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <span className="absolute right-3 text-xs text-outline font-bold pointer-events-none">€</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold">Rayon / Articles concernés</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                  >
                    <option value="all">Toute la boutique</option>
                    <option value="ceramique">Collection Céramique & Art de la Table</option>
                    <option value="select">Sélection manuelle</option>
                  </select>
                </div>
              </div>

              {/* User limit toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Limite d&apos;utilisation par acheteur</span>
                  <span className="text-[11px] text-on-surface-variant">Restreint l&apos;usage à une commande unique par compte client.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userLimit}
                    onChange={(e) => setUserLimit(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-surface-container-highest peer-checked:bg-primary rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-xs"></div>
                </label>
              </div>
            </div>

            {/* Section 4: Validity & Quota */}
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-container text-primary text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Période de Validité & Plafonds</h3>
                </div>
                <span className="text-[11px] text-outline font-medium">Calendrier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold">Date & heure de début</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-surface-container-low text-xs font-mono text-on-surface border border-outline-variant/60"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold">Date & heure d&apos;expiration</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 px-3 rounded-lg bg-surface-container-low text-xs font-mono text-on-surface border border-outline-variant/60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-on-surface font-semibold">Plafond global d&apos;utilisations</label>
                  <span className="text-xs font-bold text-primary font-mono">{quota} commandes max</span>
                </div>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-surface-container-low text-xs font-mono font-semibold text-on-surface border border-outline-variant/60"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={activeImmediately}
                  onChange={(e) => setActiveImmediately(e.target.checked)}
                  className="accent-primary rounded"
                />
                <span className="text-xs text-on-surface font-medium">Activer et rendre le code immédiatement utilisable dès l&apos;enregistrement</span>
              </label>
            </div>

          </div>

          {/* Right Column (5 cols): Live Preview & NovaAdvisor simulator */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live Buyer Cart Preview */}
            <div className="p-5 bg-surface-container-lowest rounded-xl border-t-4 border-t-primary border-x border-b border-outline-variant/50 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Aperçu Panier Acheteur</h3>
                </div>
                <span className="text-[10px] bg-surface-container-high text-primary px-2 py-0.5 rounded-full font-bold">
                  En direct
                </span>
              </div>

              {/* Interactive Ticket component */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-high text-xs">
                  <span className="font-bold text-on-surface">Atelier Nova Paris</span>
                  <span className="text-[11px] text-outline">Panier test: {baseCart.toFixed(2)} €</span>
                </div>

                {/* Applied badge */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary text-on-primary shadow-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span className="font-mono font-bold tracking-wider text-xs uppercase">
                        {promoCode || 'CODEPROMO'}
                      </span>
                      <span className="text-[10px] opacity-90">
                        {buyerDesc || 'Remise appliquée'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    -{calculatedDiscount.toFixed(2)} €
                  </span>
                </div>

                {/* Summary */}
                <div className="flex flex-col gap-1.5 pt-1 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Sous-total articles :</span>
                    <span className="font-mono font-semibold text-on-surface">{baseCart.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-tertiary font-bold">
                    <span>Remise accordée :</span>
                    <span className="font-mono">-{calculatedDiscount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-on-surface pt-2 border-t border-surface-container-high text-sm">
                    <span>Nouveau total client :</span>
                    <span className="font-mono text-primary font-bold">{newTotal.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profitability Simulator NovaAdvisor */}
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-tertiary" />
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Rentabilité NovaAdvisor</h3>
                </div>
                <span className="text-[10px] text-tertiary bg-surface-container px-2.5 py-0.5 rounded-full font-bold">
                  Marge Saine
                </span>
              </div>

              {/* Circular progress SVG */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-highest"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-tertiary transition-all duration-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${Math.min(100, Math.round(marginPct * 2))}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-mono font-bold text-xs text-on-surface">{marginPct}%</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Marge nette estimée</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Basée sur votre panier moyen habituel de <span className="font-bold text-on-surface font-mono">76,50 €</span> et le coût de revient marchand.
                  </p>
                </div>
              </div>

              {/* Financial breakdown */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Commission NovaMarket (10% remisé) :</span>
                  <span className="font-mono font-semibold text-on-surface">{commission.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Part reversée au vendeur :</span>
                  <span className="font-mono font-bold text-tertiary-container">{payout.toFixed(2)} €</span>
                </div>
              </div>

              {/* AI strategic recommendation */}
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 flex items-start gap-2.5">
                <Bot className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Conseil Stratégique IA</span>
                  <p className="text-xs text-on-surface mt-0.5 leading-snug">
                    Fixer un panier minimum de <strong>60,00 €</strong> au lieu de 50 € permettrait de stimuler le panier moyen de <strong>+18%</strong> tout en compensant intégralement le coût du rabais.
                  </p>
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestion}
                    className="mt-2 text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer self-start"
                  >
                    {aiApplied ? (
                      <span className="text-tertiary flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Recommandation appliquée (60 €)
                      </span>
                    ) : (
                      <>
                        <span>Appliquer le seuil conseillé à 60 €</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-lowest border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md z-10">
          <button
            type="button"
            onClick={() => handlePublish(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors cursor-pointer"
          >
            Enregistrer comme brouillon
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => handlePublish(false)}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publier & Activer le Code Promo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
