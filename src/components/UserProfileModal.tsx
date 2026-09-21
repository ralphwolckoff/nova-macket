import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Calendar, 
  Check, 
  LayoutDashboard,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, ActiveView, Seller } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { currentUser, logout, switchDemoAccount, updateProfile, upgradeToVendor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  if (!isOpen || !currentUser) return null;

  const handleSave = async () => {
    await updateProfile({
      firstName,
      lastName,
      bio
    });
    setIsEditing(false);
  };

  const roleLabel = {
    client: 'Client Acheteur',
    vendor: 'Vendeur Professionnel',
    admin: 'Super-Administrateur'
  }[currentUser.role];

  const roleColor = {
    client: 'bg-primary/10 text-primary border-primary/20',
    vendor: 'bg-secondary-container text-on-secondary-container border-secondary/30',
    admin: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/30'
  }[currentUser.role];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-2xl p-6 space-y-6 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
              alt={currentUser.firstName || 'User'}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-on-surface">
                  {currentUser.firstName} {currentUser.lastName}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-container text-outline transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt if client */}
        {currentUser.role === 'client' && (
          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-secondary flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                Vous créez des objets ou des produits ?
              </span>
              <p className="text-[11px] text-on-surface-variant">
                L&apos;ouverture, la création et la gestion de votre boutique s&apos;effectuent exclusivement dans l&apos;Espace Vendeur sécurisé.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigate('seller_dashboard');
              }}
              className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Accéder à l&apos;Espace Vendeur</span>
            </button>
          </div>
        )}

        {/* Vendor Store Management Box if user is vendor */}
        {currentUser.role === 'vendor' && (
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-on-surface">
                  Boutique : <span className="text-primary font-bold">{currentUser.storeName || 'Mon Atelier Marchand'}</span>
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                Vendeur Actif
              </span>
            </div>

            <p className="text-[11px] text-on-surface-variant">
              La création, la modification des éléments (logo, bannière, coordonnées, politiques) et l&apos;ajout de nouvelles boutiques s&apos;effectuent exclusivement au sein de l&apos;Espace Vendeur.
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('seller_dashboard');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Gérer ma Boutique dans l&apos;Espace Vendeur</span>
            </button>
          </div>
        )}

        {/* Quick Direct Links according to permissions */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-on-surface">Accès Rapides Autorisés</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            
            {/* Vendor or Admin: Espace Vendeur */}
            {(currentUser.role === 'vendor' || currentUser.role === 'admin') && (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('seller_dashboard');
                }}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Espace Vendeur</p>
                    <p className="text-[10px] text-on-surface-variant">Catalogue & Ventes</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
              </button>
            )}

            {/* Admin only: Console Admin */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  onNavigate('admin_console');
                }}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Console Admin</p>
                    <p className="text-[10px] text-on-surface-variant">Supervision & RLS</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-outline group-hover:text-tertiary transition-colors" />
              </button>
            )}

            {/* All: Orders */}
            <button
              onClick={() => {
                onClose();
                onNavigate('orders');
              }}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Mes Commandes</p>
                  <p className="text-[10px] text-on-surface-variant">Suivi des colis</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
            </button>

            {/* All: Wishlist */}
            <button
              onClick={() => {
                onClose();
                onNavigate('wishlist');
              }}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Mes Favoris</p>
                  <p className="text-[10px] text-on-surface-variant">Articles sauvegardés</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-outline group-hover:text-error transition-colors" />
            </button>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2">
          <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Changer rapidement de rôle (Mode Démo)</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => switchDemoAccount('client')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                currentUser.role === 'client'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border-outline-variant'
              }`}
            >
              Acheteur
            </button>
            <button
              onClick={() => switchDemoAccount('vendor')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                currentUser.role === 'vendor'
                  ? 'bg-secondary text-on-secondary border-secondary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border-outline-variant'
              }`}
            >
              Vendeur Pro
            </button>
            <button
              onClick={() => switchDemoAccount('admin')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                currentUser.role === 'admin'
                  ? 'bg-tertiary text-on-tertiary border-tertiary'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border-outline-variant'
              }`}
            >
              Super-Admin
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-container">
          <button
            onClick={() => {
              logout();
              onClose();
              onNavigate('marketplace');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-error hover:bg-error/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
