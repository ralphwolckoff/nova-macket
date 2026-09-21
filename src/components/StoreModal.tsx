import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Sparkles, 
  Check, 
  Image as ImageIcon, 
  MapPin, 
  Mail, 
  Phone, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Seller, StoreStatus } from '../types';

interface StoreModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Partial<Seller>;
  onClose: () => void;
  onSave: (storeData: Seller) => void;
}

// Curated artisan logo presets for immediate 1-click selection
const LOGO_PRESETS = [
  {
    label: 'Céramique & Poterie',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA97DrAx9WNGsQlUuyomZC3xccfk4m3Y_hjFUtD0I7ryOmmvezBLyNaX2lbNb4qSI9Q8-tYxYYpR-m0jiDngs75i2FSc1OiFNP5Ppi5NP2xpB9-x2y-rv0WtIhh_9w1gnbQeuZ7bBDEei99b2dgFEA_gilbODKSOBdEUTAuUB8aMrNq3AB5Q0Elr7W1jMmmS7GSvNJ7h_2uqJ4424ChiihiaLisTd06J00XwW-OQQKEYGuT9bCfwtRukw'
  },
  {
    label: 'Tech & Audio',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP4CiLC6C75oJbnCILIVh4lsTu1Z3y9_-10S1UeouKfuqlQ_cMpCkH0m7zlM-qstt-MCzkjUwSaL0jftNGpIQHNm24AJN16UJWcGYRO3vjyi6Q-5Q25OfH7p2DSn_ImJOoiJqrcscjG3f7aqf1CemaLw4BXQxLh4kMSjt07nHUcvR0EgPLUCsrjUVeucMXVL0UGnvS82o6bLwRG8bkHwA1dL1yWS3ff1M__Isv1xkfki_vFcNLBWAK6w'
  },
  {
    label: 'Maroquinerie & Soins',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkf9DXET4XKEY5zIjdbfOGm0-fLhu6AI8EY7CX4HRfTyr8a9rDw7ENSwAYG-xjPelE9aBejuQUekdfAelTdDLk_Y-4iDrQrKotQL64jEB3Y4Rz1ZHVVILbwLG4DvOhdhW2uUfPu6ddPcXxe-lE40jxrIFTB2bsgQzzuXYBdRuKovUzpjkHMeV2FDeX0yizYc_NGQKD487I1Q1bAREnojH_0oCZxJ17Liz_Aa3TSA3_LBk8bykjxGjuYQ'
  },
  {
    label: 'Atelier Bois & Minimalisme',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&h=200&q=80'
  }
];

// Curated workshop banner presets
const BANNER_PRESETS = [
  {
    label: 'Atelier Terres & Grès',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpD9fQB_dLv5Et3XnbDhbiDAjtVhtQBB6aEZKy7rw5olKS7vyoQsNlxZwbbylZR7Z5jWbeYz0ywfhwhobKDQDvBxOj6PhBctis_Nk3PCH_BPzbCliOUeOLCAv7yMI0828XrFromiWgU9pDOvYD2GqnuYfgMdv-_DWBdUyZG5zvM3NnEt8iUio2WIDuAuqgDxLoG3ejExbuvRqx46EEi4hqasoQfe6Cnj2HfL-nvfxrap-OPc3hBZIjPg'
  },
  {
    label: 'Studio Audio & Création',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80'
  },
  {
    label: 'Botanique & Végétal',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80'
  },
  {
    label: 'Ébénisterie & Design',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&h=400&q=80'
  }
];

const AVAILABLE_CATEGORIES = [
  'Mobilier Minimaliste',
  'Artisans Certifiés',
  'Maison & Bureau',
  'Électronique & Audio',
  'High-Tech',
  'Beauté Biologique',
  'Maroquinerie & Accessoires',
  'Mode Éthique'
];

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [location, setLocation] = useState('Lyon, France');
  const [logo, setLogo] = useState(LOGO_PRESETS[0].url);
  const [banner, setBanner] = useState(BANNER_PRESETS[0].url);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [shippingInfo, setShippingInfo] = useState('Expédié sous 24/48h par NovaExpress avec suivi temps réel.');
  const [returnPolicy, setReturnPolicy] = useState('Retours gratuits sous 30 jours, garantie casse transport incluse.');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Artisans Certifiés']);
  const [status, setStatus] = useState<StoreStatus>('active');
  const [verified, setVerified] = useState(true);

  const [activeTab, setActiveTab] = useState<'general' | 'visuals' | 'shipping'>('general');
  const [error, setError] = useState<string | null>(null);

  // Auto-fill or reset when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name || '');
        setSlug(initialData.slug || '');
        setDescription(initialData.description || '');
        setStory(initialData.story || '');
        setLocation(initialData.location || 'Lyon, France');
        setLogo(initialData.logo || LOGO_PRESETS[0].url);
        setBanner(initialData.banner || BANNER_PRESETS[0].url);
        setContactEmail(initialData.contactEmail || '');
        setContactPhone(initialData.contactPhone || '');
        setShippingInfo(initialData.shippingInfo || 'Expédié sous 24/48h avec suivi.');
        setReturnPolicy(initialData.returnPolicy || 'Retours gratuits sous 30 jours.');
        setSelectedCategories(initialData.categories || ['Artisans Certifiés']);
        setStatus(initialData.status || 'active');
        setVerified(initialData.verified ?? true);
      } else {
        // Create mode
        const defaultName = initialData?.name || '';
        setName(defaultName);
        setSlug(defaultName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `boutique-${Date.now().toString().slice(-4)}`);
        setDescription(initialData?.description || 'Atelier de création artisanale et fabrication locale certifiée.');
        setStory(initialData?.story || 'Façonné avec passion et respect des matières premières durables.');
        setLocation(initialData?.location || 'Lyon, France');
        setLogo(initialData?.logo || LOGO_PRESETS[0].url);
        setBanner(initialData?.banner || BANNER_PRESETS[0].url);
        setContactEmail(initialData?.contactEmail || 'contact@atelier.fr');
        setContactPhone(initialData?.contactPhone || '+33 4 78 00 00 00');
        setShippingInfo('Expédié sous 24/48h par NovaExpress avec suivi temps réel.');
        setReturnPolicy('Retours gratuits sous 30 jours, garantie casse transport incluse.');
        setSelectedCategories(initialData?.categories || ['Artisans Certifiés', 'Mobilier Minimaliste']);
        setStatus('active');
        setVerified(true);
      }
      setError(null);
      setActiveTab('general');
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  // Auto-generate slug when name changes if user hasn't manually edited slug heavily
  const handleNameChange = (val: string) => {
    setName(val);
    if (mode === 'create') {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Veuillez renseigner le nom de la boutique');
      return;
    }

    if (!slug.trim()) {
      setError("Veuillez renseigner l'identifiant URL (slug) de la boutique");
      return;
    }

    const storePayload: Seller = {
      id: initialData?.id || `seller-${slug || Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      logo: logo.trim() || LOGO_PRESETS[0].url,
      banner: banner.trim() || BANNER_PRESETS[0].url,
      description: description.trim(),
      story: story.trim() || undefined,
      rating: initialData?.rating ?? 5.0,
      reviewCount: initialData?.reviewCount ?? 0,
      location: location.trim(),
      verified,
      salesCount: initialData?.salesCount ?? 0,
      joinedDate: initialData?.joinedDate || 'Récemment rejoint',
      returnPolicy: returnPolicy.trim(),
      shippingInfo: shippingInfo.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      categories: selectedCategories.length > 0 ? selectedCategories : ['Artisans Certifiés'],
      badges: initialData?.badges || ['Boutique Vérifiée', 'NovaTrust'],
      status,
      userId: initialData?.userId
    };

    onSave(storePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleUp my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                  {mode === 'create' ? 'Ouvrir une Nouvelle Boutique' : 'Modifier les Paramètres de la Boutique'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  Table public.stores
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {mode === 'create' 
                  ? 'Configurez votre vitrine artisanale, vos politiques d\'expédition et vos visuels publics.'
                  : 'Mettez à jour vos coordonnées, vos engagements de livraison et vos bannières.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-outline hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs inside modal */}
        <div className="grid grid-cols-3 p-1 bg-surface-container rounded-2xl border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            1. Informations & Statut
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visuals')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'visuals'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            2. Visuels & Bannière
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            3. Expédition & Contact
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Nom de la Boutique / Atelier *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Atelier Lumière, Terres Vivantes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Identifiant URL (Slug public) *</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-surface-container-low border border-r-0 border-outline-variant rounded-l-xl text-xs text-on-surface-variant font-mono">
                      /seller/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="atelier-lumiere"
                      className="w-full px-3 py-2.5 rounded-r-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Statut de la Boutique (Supabase store_status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StoreStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="active">Active (En ligne & visible sur le catalogue)</option>
                    <option value="draft">Brouillon (En cours de configuration)</option>
                    <option value="past_due">En attente de paiement (Past Due)</option>
                    <option value="suspended">Suspendue temporairement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Localisation de l&apos;Atelier *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Lyon, France ou Bordeaux, France"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Description Courte de la Boutique</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre savoir-faire, vos techniques et vos produits phares..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Story */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface">Histoire d&apos;Artisan & Valeurs (Storytelling)</label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Ex: Fondé en 2022 à Lyon, chaque pièce est façonnée à la main au tour..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface block">
                  Rayons & Spécialités (Sélection multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Visuals */}
          {activeTab === 'visuals' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Logo Selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span>Logo & Image de Profil de la Boutique</span>
                  </label>
                  <span className="text-[11px] text-on-surface-variant">Presets ou URL</span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={logo}
                    alt="Aperçu logo"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20 bg-surface-container shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                    <p className="text-[10px] text-on-surface-variant">
                      Format recommandé : Carré 200x200px (PNG ou JPEG).
                    </p>
                  </div>
                </div>

                {/* Logo presets */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-on-surface-variant">Presets d&apos;artisanat en 1 clic :</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LOGO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLogo(p.url)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          logo === p.url 
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-[10px] font-bold text-on-surface truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner Selection */}
              <div className="space-y-2.5 pt-3 border-t border-surface-container">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-secondary" />
                    <span>Bannière Publique de l&apos;Atelier (Header)</span>
                  </label>
                  <span className="text-[11px] text-on-surface-variant">Format panoramique</span>
                </div>

                <div className="w-full h-28 rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/60 relative">
                  <img src={banner} alt="Aperçu bannière" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold drop-shadow-sm">{name || 'Nom de la Boutique'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="url"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary font-mono"
                  />
                </div>

                {/* Banner presets */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-on-surface-variant">Bannières d&apos;ateliers préconfigurées :</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BANNER_PRESETS.map((bp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBanner(bp.url)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer text-left overflow-hidden ${
                          banner === bp.url 
                            ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' 
                            : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container'
                        }`}
                      >
                        <div className="w-full h-12 rounded-lg overflow-hidden mb-1">
                          <img src={bp.url} alt={bp.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-semibold text-on-surface truncate block">{bp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Shipping & Contact */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>Email de Contact Professionnel *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@votre-atelier.fr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Téléphone Commercial</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+33 4 78 22 10 90"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Shipping policy */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-secondary" />
                  <span>Délai d&apos;expédition & Logistique B2C</span>
                </label>
                <input
                  type="text"
                  value={shippingInfo}
                  onChange={(e) => setShippingInfo(e.target.value)}
                  placeholder="Ex: Expédié sous 24h ouvrées par NovaExpress avec suivi temps réel."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Returns policy */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-secondary" />
                  <span>Politique de retour & Rétractation</span>
                </label>
                <input
                  type="text"
                  value={returnPolicy}
                  onChange={(e) => setReturnPolicy(e.target.value)}
                  placeholder="Ex: Retours gratuits sous 30 jours, étiquette de retour prépayée."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Trust Badge toggle */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Certification NovaTrust Vendeur</p>
                    <p className="text-[11px] text-on-surface-variant">Affiche le badge d&apos;artisan certifié sur votre vitrine.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-surface-container flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'shipping' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'general') setActiveTab('visuals');
                    else if (activeTab === 'visuals') setActiveTab('shipping');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-outline-variant/30 text-xs font-bold text-on-surface transition-colors cursor-pointer"
                >
                  Étape suivante →
                </button>
              ) : null}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{mode === 'create' ? 'Créer et activer la boutique' : 'Enregistrer les modifications'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
