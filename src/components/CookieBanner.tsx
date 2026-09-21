import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings2, Check, X, ChevronRight, Lock, BarChart3, Sliders } from 'lucide-react';
import { LegalTab } from '../types';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  timestamp: string;
  version: string;
}

const STORAGE_KEY = 'novamarket_cookie_consent';

interface CookieBannerProps {
  onOpenLegalTab?: (tab: LegalTab) => void;
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onOpenLegalTab,
  forceOpenModal = false,
  onCloseModal
}) => {
  const [hasConsented, setHasConsented] = useState<boolean>(true);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [functional, setFunctional] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalytics(parsed.analytics ?? false);
        setFunctional(parsed.functional ?? false);
        setHasConsented(true);
      } else {
        setHasConsented(false);
      }
    } catch {
      setHasConsented(false);
    }
  }, []);

  useEffect(() => {
    if (forceOpenModal) {
      setShowPreferencesModal(true);
    }
  }, [forceOpenModal]);

  const saveConsent = (prefs: { analytics: boolean; functional: boolean }) => {
    const data: CookiePreferences = {
      necessary: true,
      analytics: prefs.analytics,
      functional: prefs.functional,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage error
    }
    setAnalytics(prefs.analytics);
    setFunctional(prefs.functional);
    setHasConsented(true);
    setShowPreferencesModal(false);
    if (onCloseModal) onCloseModal();

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, functional: true });
  };

  const handleRejectAll = () => {
    saveConsent({ analytics: false, functional: false });
  };

  const handleSaveCustom = () => {
    saveConsent({ analytics, functional });
  };

  return (
    <>
      {/* Toast confirmation */}
      {saveToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-xl border border-outline-variant/30 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Vos préférences de cookies (CNIL) ont été enregistrées avec succès.</span>
        </div>
      )}

      {/* Floating Bottom Banner (If not yet consented and modal not open) */}
      {!hasConsented && !showPreferencesModal && (
        <aside
          role="dialog"
          aria-label="Consentement aux cookies et traceurs"
          aria-modal="false"
          className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-surface-container-lowest/98 backdrop-blur-md border-t border-outline-variant/80 shadow-2xl transition-all"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5" aria-hidden="true">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-on-surface">
                    Respect de votre vie privée & Cookies
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                    Conforme CNIL & RGPD
                  </span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  NovaMarket utilise des cookies strictement nécessaires au bon fonctionnement de la plateforme (authentification, sécurisation du panier, transactions NovaTrust). Avec votre accord préalable, nous pouvons également déposer des cookies d&apos;analyse statistique anonymisée pour améliorer votre expérience d&apos;achat.{' '}
                  {onOpenLegalTab && (
                    <button
                      type="button"
                      onClick={() => onOpenLegalTab('cookies')}
                      className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Consulter notre Politique de Cookies</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* CNIL compliant buttons: Accept all & Refuse all on the same visual tier */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(true)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/80 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                aria-label="Personnaliser les cookies"
              >
                <Sliders className="w-3.5 h-3.5 text-on-surface-variant" />
                <span>Personnaliser</span>
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                aria-label="Tout refuser ou continuer sans accepter"
              >
                <X className="w-3.5 h-3.5 text-on-surface-variant" />
                <span>Tout refuser</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                aria-label="Tout accepter"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tout accepter</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Modal: Granular Preferences (CNIL compliant with toggles) */}
      {showPreferencesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/50 flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="cookie-modal-title" className="font-headline-sm font-bold text-base text-on-surface">
                    Gestion de vos Préférences de Confidentialité
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Choisissez en toute liberté les finalités que vous acceptez sur NovaMarket.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPreferencesModal(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Fermer la fenêtre de configuration"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-on-surface-variant flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p>
                  Conformément aux délibérations de la <strong>CNIL</strong> et au <strong>RGPD</strong>, vous pouvez modifier votre consentement à tout moment. Les cookies strictement nécessaires à l&apos;exécution du service d&apos;achat ne requièrent pas de consentement préalable.
                </p>
              </div>

              <div className="space-y-4">
                {/* Category 1: Strictement nécessaires */}
                <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <h4 className="font-bold text-sm text-on-surface">
                        Cookies Strictement Nécessaires
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Toujours actif
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Indispensables au fonctionnement technique : maintien sécurisé de votre session, gestion de votre panier d&apos;achat, prévention des fraudes CSRF et conservation de votre choix de consentement.
                    </p>
                    <p className="text-[11px] text-secondary font-mono">
                      Cookies concernés : novamarket_session, novamarket_cart, novamarket_cookie_consent
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      className="w-5 h-5 rounded accent-primary opacity-80 cursor-not-allowed"
                      aria-label="Cookies strictement nécessaires (obligatoires)"
                    />
                  </div>
                </div>

                {/* Category 2: Statistiques & Mesures d'audience */}
                <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low/40 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-secondary" />
                      <h4 className="font-bold text-sm text-on-surface">
                        Mesures d&apos;Audience & Performance
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Ces traceurs anonymisés nous permettent de mesurer le volume de visites, les pages les plus consultées et d&apos;identifier les éventuels ralentissements techniques pour optimiser la plateforme. Aucune donnée n&apos;est transmise à des régies publicitaires tierces.
                    </p>
                    <p className="text-[11px] text-secondary font-mono">
                      Traceur interne anonyme : _nvm_analytics (durée de conservation : 13 mois max)
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(e) => setAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="sr-only">Activer la mesure d&apos;audience</span>
                    </label>
                  </div>
                </div>

                {/* Category 3: Fonctionnalités & Préférences */}
                <div className="p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low/40 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-secondary" />
                      <h4 className="font-bold text-sm text-on-surface">
                        Préférences & Personnalisation
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Permet de mémoriser vos choix ergonomiques : devise d&apos;affichage préférée (EUR / XAF), filtres de tri marketplace récurrents et affichage compact.
                    </p>
                    <p className="text-[11px] text-secondary font-mono">
                      Stockage local : novamarket_ui_prefs (durée : 6 mois)
                    </p>
                  </div>
                  <div className="shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={functional}
                        onChange={(e) => setFunctional(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="sr-only">Activer les préférences de personnalisation</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 sm:p-6 border-t border-outline-variant/50 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Tout refuser
              </button>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Enregistrer mes choix
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs transition-colors cursor-pointer text-center"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
