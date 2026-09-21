import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Store, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AccessDeniedViewProps {
  requiredRole: 'vendor' | 'admin';
  onGoToLogin: () => void;
  onGoToRegisterVendor?: () => void;
  onBackToMarketplace: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  onGoToLogin,
  onGoToRegisterVendor,
  onBackToMarketplace
}) => {
  const { currentUser, switchDemoAccount } = useAuth();

  const isUnauthenticated = !currentUser;
  const isClientAccessingAdmin = currentUser && currentUser.role === 'client' && requiredRole === 'admin';
  const isClientAccessingVendor = currentUser && currentUser.role === 'client' && requiredRole === 'vendor';
  const isVendorAccessingAdmin = currentUser && currentUser.role === 'vendor' && requiredRole === 'admin';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 text-center space-y-6 animate-scaleUp">
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-error/10 text-error flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 text-error text-xs font-bold uppercase tracking-wider">
            <span>
              {isUnauthenticated ? 'Authentification Requise' : 'Accès Restreint (403 Forbidden)'}
            </span>
          </div>

          <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
            {requiredRole === 'admin' ? 'Console Super-Admin Réservée' : 'Espace Vendeur Protégé'}
          </h2>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
            {isUnauthenticated && (
              <>
                Cette page est strictement sécurisée. Vous devez être connecté avec un compte{' '}
                <strong className="text-on-surface">
                  {requiredRole === 'admin' ? 'Super-Administrateur (rôle admin)' : 'Vendeur Professionnel'}
                </strong>{' '}
                pour y accéder.
              </>
            )}

            {isClientAccessingAdmin && (
              <>
                Vous êtes actuellement connecté en tant que{' '}
                <strong className="text-primary">{currentUser.firstName} {currentUser.lastName}</strong> (Rôle Acheteur <code className="font-mono font-bold">client</code>). 
                La console d&apos;administration est réservée au personnel de supervision NovaMarket.
              </>
            )}

            {isClientAccessingVendor && (
              <>
                Vous êtes connecté avec un compte Acheteur. Pour vendre vos propres créations et gérer vos stocks, vous devez activer votre profil Vendeur.
              </>
            )}

            {isVendorAccessingAdmin && (
              <>
                Vous êtes connecté en tant que Vendeur (<strong className="text-primary">{currentUser.storeName || currentUser.firstName}</strong>). 
                La console d&apos;administration globale nécessite des privilèges <code className="font-mono font-bold">admin</code>.
              </>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {isUnauthenticated ? (
            <button
              onClick={onGoToLogin}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Se connecter pour continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isClientAccessingVendor && onGoToRegisterVendor ? (
            <button
              onClick={onGoToRegisterVendor}
              className="w-full py-3 px-4 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Activer mon profil Vendeur maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}

          {/* Quick Demo Role Switcher to unblock evaluation */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2.5 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-on-surface">Basculer avec un compte démo autorisé :</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {requiredRole === 'admin' ? (
                <button
                  onClick={() => switchDemoAccount('admin')}
                  className="px-3.5 py-2 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Se connecter en tant qu&apos;Admin (Sarah B.)</span>
                </button>
              ) : (
                <button
                  onClick={() => switchDemoAccount('vendor')}
                  className="px-3.5 py-2 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-bold hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Se connecter en tant que Vendeur (Sophie M.)</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={onBackToMarketplace}
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:underline font-semibold cursor-pointer pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner à la boutique</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
