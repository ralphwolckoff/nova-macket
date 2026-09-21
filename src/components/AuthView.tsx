import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  ChevronRight,
  Sparkles,
  Phone,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, ActiveView } from '../types';
import novamarketLogo from '../assets/images/novamarket_logo_1789942059429.jpg';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  redirectView?: ActiveView;
  onSuccess: (targetView?: ActiveView) => void;
  onCancel?: () => void;
  requiredRoleForPendingAction?: UserRole;
  pendingActionReason?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  redirectView = 'marketplace',
  onSuccess,
  onCancel,
  requiredRoleForPendingAction,
  pendingActionReason
}) => {
  const { login, register, switchDemoAccount } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>(requiredRoleForPendingAction === 'vendor' ? 'vendor' : 'client');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Status & errors
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Erreur lors de la connexion');
          setIsLoading(false);
          return;
        }
      } else {
        // Validation
        if (!firstName.trim() || !lastName.trim()) {
          setError('Veuillez renseigner votre prénom et nom');
          setIsLoading(false);
          return;
        }
        if (role === 'vendor' && !storeName.trim()) {
          setError('Veuillez renseigner le nom de votre boutique / atelier');
          setIsLoading(false);
          return;
        }

        const res = await register({
          email,
          password,
          role,
          firstName,
          lastName,
          storeName: role === 'vendor' ? storeName : undefined,
          storeDescription: role === 'vendor' ? storeDescription : undefined,
          phoneNumber: phoneNumber || undefined
        });

        if (!res.success) {
          setError(res.error || "Erreur lors de l'inscription");
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      onSuccess(redirectView);
    } catch (err: unknown) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue');
    }
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    switchDemoAccount(demoRole);
    let target = redirectView;
    if (demoRole === 'admin' && redirectView === 'marketplace') {
      target = 'admin_console';
    } else if (demoRole === 'vendor' && redirectView === 'marketplace') {
      target = 'seller_dashboard';
    }
    onSuccess(target);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Pending Action Banner if user was redirected from a protected route */}
        {pendingActionReason && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-on-surface flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-200">Accès Restreint & Sécurisé</p>
              <p className="text-on-surface-variant">{pendingActionReason}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
              <img 
                src={novamarketLogo}
                alt="NovaMarket"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain rounded-xl shadow-xs"
              />
            </div>
            <h1 className="font-headline-sm text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {mode === 'login' ? 'Connexion à NovaMarket' : 'Créer un compte NovaMarket'}
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
              {mode === 'login' 
                ? 'Accédez à votre espace sécurisé, gérez vos commandes ou votre boutique en ligne.'
                : 'Rejoignez la place de marché des artisans et créateurs indépendants.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-container rounded-2xl border border-outline-variant/40">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Se connecter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>S&apos;inscrire</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Register: Choose Account Type */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface block">
                  Quel type de compte souhaitez-vous créer ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'client'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      {role === 'client' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="font-bold text-xs text-on-surface">Acheteur / Client</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Explorer, commander et suivre vos livraisons.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'vendor'
                        ? 'border-secondary bg-secondary/5 ring-2 ring-secondary/20'
                        : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      {role === 'vendor' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                    </div>
                    <p className="font-bold text-xs text-on-surface">Vendeur / Artisan Pro</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Vendre des créations, stocks & reversements.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Names if Register */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Prénom</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Sophie"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Nom</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Martin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* If Registering as Vendor: Store details */}
            {mode === 'register' && role === 'vendor' && (
              <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 space-y-3">
                <div className="flex items-center gap-2 text-secondary font-bold text-xs">
                  <Store className="w-4 h-4" />
                  <span>Détails de votre Boutique / Atelier</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Nom de la Boutique *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Atelier Lumière, Terres Vivantes..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Description Courte</label>
                  <input
                    type="text"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Ex: Céramiques artisanales faites main à Lyon"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Adresse Email</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-on-surface-variant" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Phone (if register) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">Numéro de téléphone (optionnel)</label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 absolute left-3.5 text-on-surface-variant" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface">Mot de Passe</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Dans cette maquette connectée, utilisez les comptes démo préconfigurés ci-dessous pour tester tous les rôles !')}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 8 caractères' : '••••••••'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>
                {isLoading 
                  ? 'Traitement sécurisé...' 
                  : mode === 'login' 
                    ? 'Se connecter à mon compte' 
                    : 'Créer mon compte NovaMarket'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Section */}
          <div className="pt-4 border-t border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Accès Démo Rapide (1-clic)</span>
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium">
                Testez immédiatement les rôles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Client demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client')}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                    Client
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="font-bold text-xs text-on-surface truncate">Alexandre D.</p>
                <p className="text-[10px] text-on-surface-variant truncate">Acheteur Particulier</p>
              </button>

              {/* Vendor demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('vendor')}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                    Vendeur Pro
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="font-bold text-xs text-on-surface truncate">Sophie Martin</p>
                <p className="text-[10px] text-on-surface-variant truncate">Atelier Lumière</p>
              </button>

              {/* Admin demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase">
                    Super-Admin
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="font-bold text-xs text-on-surface truncate">Sarah Benali</p>
                <p className="text-[10px] text-on-surface-variant truncate">Console Globale</p>
              </button>
            </div>
          </div>

          {/* Security & RLS notice */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center gap-2.5 text-[11px] text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-tertiary shrink-0" />
            <span>
              Authentification sécurisée alignée sur Supabase <code className="font-mono text-primary font-bold">auth.users</code> et la table <code className="font-mono text-primary font-bold">public.profiles</code>.
            </span>
          </div>

        </div>

        {/* Back to Marketplace */}
        <div className="text-center">
          <button
            type="button"
            onClick={onCancel || (() => onSuccess('marketplace'))}
            className="text-xs text-on-surface-variant hover:text-on-surface hover:underline font-semibold cursor-pointer"
          >
            ← Retourner à la boutique sans se connecter
          </button>
        </div>

      </div>
    </div>
  );
};
