import React, { useState } from 'react';
import { 
  X, 
  Store, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Seller } from '../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onRegisterSeller: (newSeller: Omit<Seller, 'id'>) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onRegisterSeller,
}) => {
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');
  const [firstName, setFirstName] = useState('Julien');
  const [lastName, setLastName] = useState('Faure');
  const [shopName, setShopName] = useState('Atelier Faure Design');
  const [siret, setSiret] = useState('89103491200018');
  const [email, setEmail] = useState('contact@faure-design.fr');
  const [password, setPassword] = useState('NovaCraft#2025!Sec');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [escrowAccepted, setEscrowAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const getPasswordScore = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passScore = getPasswordScore(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        if (role === 'seller') {
          onRegisterSeller({
            name: shopName,
            description: `Atelier d'ébénisterie et de mobilier d'art fondé par ${firstName} ${lastName}. Créations durables numérotées.`,
            logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
            banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
            rating: 5.0,
            reviewCount: 1,
            isVerified: true,
            shippingInfo: 'Expédition sous 48h en caisse bois renforcée',
            returnPolicy: '30 jours d’essai satisfait ou remboursé sous NovaProtect',
            joinedDate: 'Inscrit aujourd\'hui'
          });
        }
        onClose();
        setSuccess(false);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-inverse-surface/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden my-auto border border-outline-variant/60 flex flex-col max-h-[92vh]">
        
        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-tertiary to-secondary" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
                  Rejoignez l&apos;Écosystème NovaMarket
                </h2>
                <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed font-bold px-2 py-0.5 rounded-full">
                  Accès Libre
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Créez votre vitrine artisanale vérifiée ou commencez vos achats sécurisés sous NovaProtect.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 bg-surface">
          
          {/* Role selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                role === 'seller'
                  ? 'bg-surface-container-lowest border-primary ring-2 ring-primary/20 shadow-xs'
                  : 'bg-surface-container-low border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-on-surface">Boutique & Vendeur Artisan</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  role === 'seller' ? 'bg-primary text-on-primary font-bold' : 'border border-outline-variant'
                }`}>
                  {role === 'seller' && '✓'}
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Commission 10% seulement, séquestre bancaire Stripe Connect, analytics en temps réel.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                role === 'buyer'
                  ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/20 shadow-xs'
                  : 'bg-surface-container-low border-outline-variant/60 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-on-surface">Acheteur & Passionné</span>
                </div>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  role === 'buyer' ? 'bg-secondary text-on-secondary font-bold' : 'border border-outline-variant'
                }`}>
                  {role === 'buyer' && '✓'}
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-snug">
                Accès direct aux collections, garantie NovaProtect 2 ans, suivi transport en direct.
              </p>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">Prénom</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">Nom de famille</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 px-3.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Seller specific fields */}
            {role === 'seller' && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                    <span>Nom commercial de l&apos;Atelier / Boutique</span>
                    <span className="text-[10px] text-primary font-mono">novamarket.fr/boutique/{slug}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ex. Atelier Faure Design"
                    className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/60 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                    <span>Numéro SIRET (14 chiffres)</span>
                    <span className="text-[10px] text-tertiary flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Vérification instantanée Insee
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      maxLength={14}
                      required
                      value={siret}
                      onChange={(e) => setSiret(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-10 px-3.5 rounded-lg bg-surface-container-lowest text-xs font-mono text-on-surface border border-outline-variant/60 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Building2 className="w-4 h-4 text-outline absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface font-semibold">Adresse email professionnelle</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface font-semibold flex justify-between items-center">
                <span>Mot de passe</span>
                <span className="text-[10px] text-tertiary font-mono">Bcrypt Salt 12</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3.5 pr-10 rounded-lg bg-surface-container-low text-xs font-mono text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-outline hover:text-on-surface cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength 4 bars */}
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="h-1 flex-1 rounded-full bg-surface-container overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${
                      passScore >= step ? (passScore <= 2 ? 'bg-primary-container w-full' : 'bg-tertiary w-full') : 'w-0'
                    }`} />
                  </div>
                ))}
                <span className="text-[10px] font-bold text-secondary min-w-[50px] text-right">
                  {passScore <= 1 ? 'Fragile' : passScore <= 2 ? 'Moyen' : passScore === 3 ? 'Fort' : 'Excellent'}
                </span>
              </div>
            </div>

            {/* Terms checkboxes */}
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-primary rounded"
                />
                <span className="text-on-surface-variant leading-snug text-[11px]">
                  J&apos;accepte les <strong className="text-on-surface">Conditions Générales de NovaMarket</strong> et la politique de confidentialité.
                </span>
              </label>

              {role === 'seller' && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={escrowAccepted}
                    onChange={(e) => setEscrowAccepted(e.target.checked)}
                    className="mt-0.5 accent-primary rounded"
                  />
                  <span className="text-on-surface-variant leading-snug text-[11px]">
                    J&apos;adhère au protocole <strong className="text-primary">NovaEscrow™</strong> et autorise l&apos;ouverture d&apos;un compte séquestre marchand nominatif Stripe Connect.
                  </span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 ${
                success
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Génération des clés marchandes & compte Stripe...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Compte créé avec succès ! Bienvenue.</span>
                </>
              ) : (
                <>
                  <span>{role === 'seller' ? 'Créer ma Boutique Marchande' : 'Finaliser mon inscription'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social proof carousel */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-2">
            <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
              Rejoignez +1 200 artisans vérifiés en France
            </span>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Artisan 1" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Artisan 2" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Artisan 3" />
              </div>
              <p className="text-[11px] text-on-surface-variant">
                « NovaMarket m&apos;a permis de tripler mes commandes directes grâce au séquestre de confiance. » — <strong>Sophie M.</strong>
              </p>
            </div>
          </div>

          {/* Already have an account */}
          <div className="text-center text-xs text-on-surface-variant">
            <span>Vous possédez déjà un compte ?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="font-bold text-primary hover:underline ml-1 cursor-pointer"
            >
              Connectez-vous
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
