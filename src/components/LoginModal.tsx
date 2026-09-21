import React, { useState } from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Lock, 
  Key, 
  Shield
} from 'lucide-react';
import novamarketLogo from '../assets/images/novamarket_logo_1789942059429.jpg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onLoginSuccess: (role: 'merchant' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<'merchant' | 'admin'>('merchant');
  const [email, setEmail] = useState('sophie.martin@atelier-nova.fr');
  const [password, setPassword] = useState('NovaArtisan#2025!K');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getStrength = (val: string) => {
    if (!val) return 0;
    if (val.length < 6) return 1;
    if (val.length < 10) return 2;
    return 3;
  };

  const strength = getStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(role);
        onClose();
        setSuccess(false);
      }, 900);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-inverse-surface/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden my-auto border border-outline-variant/60">
        
        {/* Top Decorative Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-container to-tertiary" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-surface-container text-primary">
              <img 
                src={novamarketLogo} 
                alt="NovaMarket" 
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded object-contain" 
              />
              <span className="font-bold text-sm text-on-surface">NovaMarket</span>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-primary text-on-primary px-1.5 py-0.5 rounded-full">
                Secure
              </span>
            </div>
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
              Bon retour parmi nous
            </h1>
            <p className="text-xs text-on-surface-variant max-w-xs mt-1">
              Connectez-vous à votre espace marchand, client ou console d&apos;administration
            </p>
          </div>

          {/* Role selector */}
          <div className="mt-5 bg-surface-container-low p-1 rounded-xl flex gap-1 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setRole('merchant')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'merchant'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-primary" />
              <span>Espace Marchand & Client</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Console Admin</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface font-semibold flex justify-between items-center">
                <span>Adresse email</span>
                <span className="text-[10px] text-secondary font-medium">
                  {role === 'merchant' ? 'Acheteur / Vendeur' : 'Super-Administrateur'}
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@domaine.fr"
                  className="w-full h-10 px-3.5 pr-8 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
                {isEmailValid && (
                  <CheckCircle2 className="w-4 h-4 text-tertiary absolute right-3 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface font-semibold flex justify-between items-center">
                <span>Mot de passe</span>
                <span className="text-[10px] text-tertiary font-medium">Clé 256 bits</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 px-3.5 pr-10 rounded-lg bg-surface-container-low text-xs font-mono text-on-surface border border-outline-variant/60 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-secondary hover:text-on-surface cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength gauge */}
              <div className="flex items-center gap-1.5 mt-1 px-0.5">
                <div className="h-1 flex-1 rounded-full bg-surface-container overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strength >= 1 ? (strength === 1 ? 'bg-error w-full' : 'bg-primary-container w-full') : 'w-0'
                  }`} />
                </div>
                <div className="h-1 flex-1 rounded-full bg-surface-container overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strength >= 2 ? (strength === 2 ? 'bg-primary-container w-full' : 'bg-tertiary w-full') : 'w-0'
                  }`} />
                </div>
                <div className="h-1 flex-1 rounded-full bg-surface-container overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strength >= 3 ? 'bg-tertiary w-full' : 'w-0'
                  }`} />
                </div>
                <span className="text-[10px] font-bold text-secondary min-w-[50px] text-right">
                  {strength === 1 ? 'Faible' : strength === 2 ? 'Moyen' : 'Optimal'}
                </span>
              </div>
            </div>

            {/* Remember & reset */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-primary rounded"
                />
                <span className="text-on-surface-variant text-[11px]">30 jours mémorisés</span>
              </label>
              <button
                type="button"
                className="text-primary font-semibold text-[11px] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                success
                  ? 'bg-tertiary text-on-tertiary'
                  : 'bg-primary hover:bg-primary-container text-on-primary'
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Vérification sécurisée...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Session établie !</span>
                </>
              ) : (
                <>
                  <span>{role === 'merchant' ? 'Se connecter à NovaMarket' : 'Ouvrir la Console Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* SSO divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="flex-grow bg-surface-container h-px" />
              <span className="mx-3 text-[10px] text-outline uppercase tracking-wider font-semibold">
                ou continuer avec
              </span>
              <div className="flex-grow bg-surface-container h-px" />
            </div>

            {/* Fast login */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(role);
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40 transition-colors gap-1 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-semibold">Passkey</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(role);
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40 transition-colors gap-1 cursor-pointer"
              >
                <span className="text-xs font-bold text-primary font-mono">G</span>
                <span className="text-[10px] font-semibold">Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(role);
                  onClose();
                }}
                className="flex flex-col items-center justify-center py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/40 transition-colors gap-1 cursor-pointer"
              >
                <span className="text-xs font-bold text-on-surface font-mono"></span>
                <span className="text-[10px] font-semibold">Apple</span>
              </button>
            </div>
          </form>

          {/* Security reassurance */}
          <div className="mt-5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-tertiary font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protocole de protection NovaEscrow™</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-on-surface-variant">
              <div className="bg-surface-container-lowest p-1.5 rounded flex flex-col items-center">
                <Lock className="w-3 h-3 text-primary mb-0.5" />
                <span>TLS 1.3 Bancaire</span>
              </div>
              <div className="bg-surface-container-lowest p-1.5 rounded flex flex-col items-center">
                <Shield className="w-3 h-3 text-tertiary mb-0.5" />
                <span>Anti-Fraude IA</span>
              </div>
              <div className="bg-surface-container-lowest p-1.5 rounded flex flex-col items-center">
                <Key className="w-3 h-3 text-secondary mb-0.5" />
                <span>Support 2FA</span>
              </div>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-4 text-center text-xs text-on-surface-variant">
            <span>Nouveau sur la plateforme ?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="font-bold text-primary hover:underline ml-1 cursor-pointer"
            >
              Créer un compte vendeur ou acheteur
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
