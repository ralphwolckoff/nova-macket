import React from 'react';
import { Store, ShieldCheck, Mail, ArrowRight, Heart, Cookie, Scale, Lock, RotateCcw } from 'lucide-react';
import { LegalTab } from '../types';
import novamarketLogo from '../assets/images/novamarket_logo_1789942059429.jpg';

interface FooterProps {
  onOpenSellerPortal: () => void;
  onSelectCategory: (category: string) => void;
  onOpenLegalTab?: (tab: LegalTab) => void;
  onOpenCookieSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSellerPortal,
  onSelectCategory,
  onOpenLegalTab,
  onOpenCookieSettings,
}) => {
  return (
    <footer className="bg-surface-container-lowest text-on-surface-variant text-xs border-t border-outline-variant/60" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={novamarketLogo}
                alt="Logo NovaMarket"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-contain shadow-2xs border border-outline-variant/30"
              />
              <span className="font-headline-sm font-bold text-base text-on-surface">
                Nova<span className="text-primary">Market</span>
              </span>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-xs">
              La plateforme de référence pour acheter directement auprès d’artisans et boutiques indépendantes vérifiées.
            </p>
            <div className="flex items-center gap-2 text-secondary font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tiers de confiance & transactions garanties NovaTrust</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
              Rayons Marketplace
            </h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <button onClick={() => onSelectCategory('Électronique & Audio')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Électronique & Audio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Mobilier Minimaliste')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Mobilier Minimaliste & Céramique
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Mode Éthique')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Mode Éthique & Tissages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Beauté Biologique')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Beauté Biologique & Soins
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Maroquinerie & Accessoires')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Maroquinerie & Cuir Végétal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Espace Vendeurs & Confiance */}
          <div className="space-y-3">
            <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
              Espace Vendeurs & Garanties
            </h4>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <button onClick={onOpenSellerPortal} className="text-primary hover:underline font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Store className="w-3.5 h-3.5" />
                  <span>Tableau de Bord Vendeur</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalTab && onOpenLegalTab('refund')}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                  <span>Droit de Rétractation 14 jours</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalTab && onOpenLegalTab('terms')}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-secondary" />
                  <span>Garanties Légales & Conformité</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalTab && onOpenLegalTab('dpo_form')}
                  className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5 text-secondary font-medium"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Exercer mes Droits RGPD</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
              Lettre d&apos;Atelier Hebdomadaire
            </h4>
            <p className="text-on-surface-variant text-xs">
              Recevez les portraits d&apos;artisans émergents et l&apos;accès exclusif aux séries limitées.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <label htmlFor="newsletter-email-input" className="sr-only">Votre adresse email</label>
              <input
                id="newsletter-email-input"
                type="email"
                placeholder="Votre adresse email"
                className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary flex-1"
              />
              <button
                type="submit"
                className="p-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold rounded-xl transition-colors cursor-pointer"
                title="S'abonner"
                aria-label="S'abonner à la lettre hebdomadaire"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-on-surface-variant/80">
              Désabonnement en 1 clic. Données strictement protégées (RGPD).
            </p>
          </div>

        </div>

        {/* Bottom Bar with Mandatory Legal and Cookie Links */}
        <div className="pt-8 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-on-surface-variant">
          <div>
            © 2025 NovaMarket SAS. RCS Paris B 891 034 912 · Conforme Code de la consommation & RGPD.
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onOpenLegalTab && onOpenLegalTab('terms')}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Conditions Générales (CGU/CGV)
            </button>
            <span aria-hidden="true">·</span>
            
            <button
              type="button"
              onClick={() => onOpenLegalTab && onOpenLegalTab('privacy')}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Politique de Confidentialité (RGPD)
            </button>
            <span aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => onOpenLegalTab && onOpenLegalTab('refund')}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Rétractation & Retours
            </button>
            <span aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => onOpenLegalTab && onOpenLegalTab('legal_notices')}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Mentions Légales
            </button>
            <span aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => {
                if (onOpenCookieSettings) {
                  onOpenCookieSettings();
                } else if (onOpenLegalTab) {
                  onOpenLegalTab('cookies');
                }
              }}
              className="hover:text-primary transition-colors cursor-pointer font-bold text-secondary flex items-center gap-1"
            >
              <Cookie className="w-3 h-3 text-primary" />
              <span>Gestion des Cookies (CNIL)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

