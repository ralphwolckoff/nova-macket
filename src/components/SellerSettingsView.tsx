import React, { useState } from 'react';
import { 
  Store, 
  Building2, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  Upload, 
  Save, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Laptop, 
  Power,
  Globe,
  Lock,
  Calendar
} from 'lucide-react';
import { Seller } from '../types';

interface SellerSettingsViewProps {
  currentSeller: Seller;
  onUpdateSellerProfile: (updated: Seller) => void;
  onOpenStoreModal?: () => void;
}

export const SellerSettingsView: React.FC<SellerSettingsViewProps> = ({
  currentSeller,
  onUpdateSellerProfile,
  onOpenStoreModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'legal' | 'security' | 'api'>('profile');

  // Profile fields
  const [shopName, setShopName] = useState(currentSeller.name);
  const [description, setDescription] = useState(currentSeller.description);
  const [logo, setLogo] = useState(currentSeller.logo);
  const [banner, setBanner] = useState(currentSeller.banner);
  const [shippingInfo, setShippingInfo] = useState(currentSeller.shippingInfo);
  const [returnPolicy, setReturnPolicy] = useState(currentSeller.returnPolicy);
  const [isOpen, setIsOpen] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);
  const [reopenDate, setReopenDate] = useState('2025-08-01');

  // Legal fields
  const [siret, setSiret] = useState('891 034 912 00018');
  const [legalForm, setLegalForm] = useState('SASU (Société par actions simplifiée unipersonnelle)');
  const [vatNumber, setVatNumber] = useState('FR44 891 034 912');
  const [registeredAddress, setRegisteredAddress] = useState('14 Rue des Céramistes, 75011 Paris, France');

  // API fields
  const [apiKey, setApiKey] = useState('nvm_live_sec_9942a8b94101e4fc889021');
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.atelier-nova.fr/webhooks/orders');
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSellerProfile({
      ...currentSeller,
      name: shopName,
      description,
      logo,
      banner,
      shippingInfo,
      returnPolicy
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-surface-container-lowest border border-tertiary rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp">
          <ShieldCheck className="w-5 h-5 text-tertiary shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-on-surface block">Modifications enregistrées !</span>
            <span className="text-on-surface-variant">Les informations de votre boutique sont synchronisées en direct.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Store className="w-4 h-4" />
            <span>Gestion de la Boutique Marchande</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Profil Marchand & Paramètres du Compte
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Personnalisez votre identité visuelle, mettez à jour vos données légales certifiées et sécurisez vos accès.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les Modifications</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2 flex-wrap">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Store className="w-4 h-4" /> Identité & Boutique
        </button>

        <button
          onClick={() => setActiveSubTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'legal'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Building2 className="w-4 h-4" /> Informations Légales & KYC
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'security'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Lock className="w-4 h-4" /> Sécurité & Sessions
        </button>

        <button
          onClick={() => setActiveSubTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'api'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Key className="w-4 h-4" /> Clés API & Webhooks
        </button>
      </div>

      {/* Tab 1: Profile & Branding */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Banner & Logo preview */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-title-lg font-bold text-base text-on-surface">
                  Identité Visuelle & Bannière
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Configurez le logo, la bannière d&apos;accueil, les politiques et la biographie de votre boutique.
                </p>
              </div>

              {onOpenStoreModal && (
                <button
                  type="button"
                  onClick={onOpenStoreModal}
                  className="px-3.5 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Ouvrir l&apos;Assistant Modale</span>
                </button>
              )}
            </div>

            {/* Banner preview */}
            <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface-container">
              <img src={banner} alt="Bannière boutique" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent flex items-end justify-between p-4">
                <span className="text-xs font-bold text-on-primary">Aperçu en direct de votre vitrine</span>
              </div>
            </div>

            {/* Logo and inputs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-surface-container-lowest shadow-md shrink-0 bg-surface-container">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">URL du Logo (carré 1:1)</label>
                  <input
                    type="url"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-xs border border-outline-variant/60"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">URL de la Bannière (format 16:9)</label>
                  <input
                    type="url"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="h-10 px-3 bg-surface-container-low rounded-lg text-xs border border-outline-variant/60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Coordonnées & Présentation Publique
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Nom de la Boutique</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface border border-outline-variant/60"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
                  <span>Adresse URL publique</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`https://novamarket.fr/boutique/${slug}`)}
                    className="text-primary text-[11px] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copier le lien
                  </button>
                </label>
                <div className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs font-mono flex items-center text-outline border border-outline-variant/60">
                  novamarket.fr/boutique/{slug}
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Bio & Description de l&apos;Atelier</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60 resize-y"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Politique de Livraison</label>
                <input
                  type="text"
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">Politique de Retours (NovaProtect)</label>
                <input
                  type="text"
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60"
                />
              </div>
            </div>

            {/* Store availability switch */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                  <Power className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-on-surface">Statut de la Boutique en Ligne</h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {isOpen ? 'Votre vitrine est actuellement ouverte et reçoit des commandes 24h/24.' : 'Boutique suspendue temporairement.'}
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-checked:bg-tertiary rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-xs"></div>
              </label>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Legal & KYC */}
      {activeSubTab === 'legal' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Données Légales & Statut Fiscal DAC7
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Identité Insee Validée
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Numéro SIRET (14 chiffres)</label>
              <input
                type="text"
                readOnly
                value={siret}
                className="h-10 px-3 bg-surface-container-low rounded-lg font-mono text-on-surface border border-outline-variant/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Numéro de TVA Intracommunautaire</label>
              <input
                type="text"
                readOnly
                value={vatNumber}
                className="h-10 px-3 bg-surface-container-low rounded-lg font-mono text-on-surface border border-outline-variant/40"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Forme Juridique</label>
              <input
                type="text"
                readOnly
                value={legalForm}
                className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/40"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Adresse du Siège Social</label>
              <input
                type="text"
                readOnly
                value={registeredAddress}
                className="h-10 px-3 bg-surface-container-low rounded-lg text-on-surface border border-outline-variant/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Sessions */}
      {activeSubTab === 'security' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="font-title-lg font-bold text-base text-on-surface">
            Sécurité & Sessions Actives
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-on-surface">MacBook Pro (Chrome 124)</span>
                    <span className="px-2 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      Session Actuelle
                    </span>
                  </div>
                  <span className="text-[11px] text-outline">Paris, France · IP 194.250.12.88</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-secondary" />
                <div>
                  <span className="font-bold text-xs text-on-surface block">iPhone 15 Pro (Safari Mobile)</span>
                  <span className="text-[11px] text-outline">Lyon, France · Dernière activité il y a 2h</span>
                </div>
              </div>
              <button
                onClick={() => alert("Session iPhone déconnectée.")}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-error-container hover:text-on-error-container text-xs font-semibold text-on-surface transition-colors cursor-pointer"
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: API & Webhooks */}
      {activeSubTab === 'api' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="font-title-lg font-bold text-base text-on-surface">
            Intégration API & Webhooks
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">Clé d&apos;API Marchande (Environnement Production)</label>
              <div className="relative flex items-center">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  readOnly
                  value={apiKey}
                  className="w-full h-10 px-3.5 pr-20 bg-surface-container-low rounded-lg text-xs font-mono text-on-surface border border-outline-variant/60"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 text-outline hover:text-on-surface cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(apiKey)}
                    className="p-1.5 text-outline hover:text-primary cursor-pointer"
                    title="Copier"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">URL de Webhook (Notifications Commandes & Livraisons)</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs font-mono text-on-surface border border-outline-variant/60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
