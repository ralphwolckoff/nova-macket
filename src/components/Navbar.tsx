import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Truck, 
  ShieldCheck, 
  Package, 
  Zap, 
  Bell, 
  Store, 
  LayoutDashboard,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ActiveView } from '../types';
import { useAuth } from '../context/AuthContext';
import novamarketLogo from '../assets/images/novamarket_logo_1789942059429.jpg';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  onOpenSellerPortal: () => void;
  onOpenCartDrawer?: () => void;
  onOpenProfileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenSellerPortal,
  onOpenCartDrawer,
  onOpenProfileModal
}) => {
  const { currentUser, isAuthenticated, logout, switchDemoAccount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setActiveView('marketplace');
  };

  const roleBadge = currentUser ? {
    client: { label: 'Client', color: 'bg-primary/10 text-primary' },
    vendor: { label: 'Vendeur Pro', color: 'bg-secondary-container text-on-secondary-container font-bold' },
    admin: { label: 'Super-Admin', color: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold' }
  }[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('marketplace')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <img 
                src={novamarketLogo} 
                alt="NovaMarket Logo" 
                referrerPolicy="no-referrer"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-xl shadow-xs border border-outline-variant/40 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm font-bold tracking-tight text-on-surface flex items-center gap-1.5">
                  Nova<span className="text-primary">Market</span>
                </span>
                <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:inline">
                  Place de Marché Indépendante
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links - STRICTLY PROTECTED ACCORDING TO AUTH ROLE */}
            <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-outline-variant">
              {/* Boutique: Public */}
              <button
                onClick={() => setActiveView('marketplace')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeView === 'marketplace'
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Boutique
              </button>

              {/* Unauthenticated: Show 'Devenir Vendeur' */}
              {!isAuthenticated && (
                <button
                  onClick={() => setActiveView('register')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-primary" />
                  <span>Devenir Vendeur</span>
                </button>
              )}

              {/* Client authenticated: Show 'Devenir Vendeur' Onboarding */}
              {isAuthenticated && currentUser?.role === 'client' && (
                <button
                  onClick={() => onOpenProfileModal ? onOpenProfileModal() : setActiveView('profile')}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Ouvrir ma boutique</span>
                </button>
              )}

              {/* Vendor or Admin: Show Espace Vendeur */}
              {isAuthenticated && (currentUser?.role === 'vendor' || currentUser?.role === 'admin') && (
                <button
                  onClick={onOpenSellerPortal}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeView === 'seller_dashboard'
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-primary" />
                  Espace Vendeur
                </button>
              )}

              {/* Admin ONLY: Show Console Admin */}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveView('admin_console')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeView === 'admin_console'
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-secondary" />
                  Console Admin
                </button>
              )}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center bg-surface-container-low rounded-full border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-transparent border-r border-outline-variant pl-4 pr-3 py-2 text-on-surface font-medium focus:outline-none cursor-pointer hidden sm:block max-w-[130px] truncate"
              >
                <option value="all">Rayons</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Rechercher des créations, marques ou boutiques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-4 pr-10 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (activeView !== 'marketplace') setActiveView('marketplace');
                  }}
                  className="absolute right-1.5 p-1.5 bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
                  aria-label="Lancer la recherche"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Orders tracking */}
            <button
              onClick={() => setActiveView('orders')}
              className={`p-2 rounded-full transition-colors relative text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer ${
                activeView === 'orders' ? 'bg-surface-container text-primary font-bold' : ''
              }`}
              title="Suivre mes commandes"
            >
              <Truck className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView('wishlist')}
              className={`p-2 rounded-full transition-colors relative text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer ${
                activeView === 'wishlist' ? 'bg-surface-container text-error font-bold' : ''
              }`}
              title="Favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <span className="text-xs font-bold text-on-surface">Notifications</span>
                    <span className="text-[10px] text-primary font-semibold cursor-pointer">Tout marquer lu</span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div className="p-2 bg-surface-container rounded-xl">
                      <p className="font-semibold text-on-surface">Colis expédié !</p>
                      <p className="text-[11px] text-on-surface-variant">Atelier Lumière a remis votre commande au transporteur.</p>
                      <span className="text-[9px] text-on-surface-variant/70">Il y a 10 min</span>
                    </div>
                    <div className="p-2 bg-surface-container rounded-xl">
                      <p className="font-semibold text-on-surface">Offre Flash Céramique</p>
                      <p className="text-[11px] text-on-surface-variant">-30% immédiat sur le Vase en Grès Émaillé.</p>
                      <span className="text-[9px] text-on-surface-variant/70">Il y a 1h</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => {
                if (onOpenCartDrawer) {
                  onOpenCartDrawer();
                } else {
                  setActiveView('cart');
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Panier d'achats"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>

            {/* USER AUTHENTICATION CONTROLS */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-outline-variant">
                <button
                  onClick={() => setActiveView('login')}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface hover:text-primary hover:bg-surface-container rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => setActiveView('register')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-primary hover:bg-primary-container text-on-primary rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Inscription</span>
                </button>
              </div>
            ) : (
              /* Authenticated User Menu Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="hidden sm:flex items-center gap-2 pl-2 border-l border-outline-variant text-left hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
                >
                  <img
                    src={currentUser?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                    alt={currentUser?.firstName || 'Utilisateur'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="hidden xl:block">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-on-surface leading-none truncate max-w-[110px]">
                        {currentUser?.firstName} {currentUser?.lastName?.charAt(0)}.
                      </p>
                      <ChevronDown className="w-3 h-3 text-on-surface-variant" />
                    </div>
                    {roleBadge && (
                      <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded-full mt-0.5 ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/60 p-2 z-50 animate-fadeIn space-y-1 text-xs">
                    
                    {/* User Header */}
                    <div className="p-2.5 bg-surface-container-low rounded-xl mb-1">
                      <p className="font-bold text-on-surface text-xs">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate">{currentUser?.email}</p>
                      {roleBadge && (
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1.5 ${roleBadge.color}`}>
                          Rôle : {roleBadge.label}
                        </span>
                      )}
                    </div>

                    {/* Navigation Items */}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfileModal) {
                          onOpenProfileModal();
                        } else {
                          setActiveView('profile');
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span>Mon Profil & Paramètres</span>
                    </button>

                    {/* Vendor Dashboard link */}
                    {(currentUser?.role === 'vendor' || currentUser?.role === 'admin') && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveView('seller_dashboard');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Store className="w-4 h-4 text-secondary" />
                        <span>Espace Vendeur</span>
                      </button>
                    )}

                    {/* Admin Console link */}
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveView('admin_console');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-tertiary" />
                        <span>Console Administrateur</span>
                      </button>
                    )}

                    {/* If client: Become vendor button */}
                    {currentUser?.role === 'client' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenProfileModal) onOpenProfileModal();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-secondary hover:bg-secondary/10 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <Store className="w-4 h-4" />
                        <span>Devenir Vendeur</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveView('orders');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Truck className="w-4 h-4 text-on-surface-variant" />
                      <span>Mes Commandes</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveView('wishlist');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Heart className="w-4 h-4 text-error" />
                      <span>Mes Favoris ({wishlistCount})</span>
                    </button>

                    {/* Quick Demo Role Switcher inside dropdown */}
                    <div className="pt-2 mt-1 border-t border-surface-container px-2">
                      <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1 mb-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Changer de rôle (Démo) :</span>
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            switchDemoAccount('client');
                            setUserDropdownOpen(false);
                          }}
                          className={`px-2 py-1 text-[10px] rounded-lg font-bold ${currentUser?.role === 'client' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}
                        >
                          Client
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('vendor');
                            setUserDropdownOpen(false);
                          }}
                          className={`px-2 py-1 text-[10px] rounded-lg font-bold ${currentUser?.role === 'vendor' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'}`}
                        >
                          Vendeur
                        </button>
                        <button
                          onClick={() => {
                            switchDemoAccount('admin');
                            setUserDropdownOpen(false);
                          }}
                          className={`px-2 py-1 text-[10px] rounded-lg font-bold ${currentUser?.role === 'admin' ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-on-surface'}`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="pt-2 mt-1 border-t border-surface-container">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-error hover:bg-error/10 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-on-surface lg:hidden rounded-lg hover:bg-surface-container cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative flex items-center bg-surface-container-low rounded-full border border-outline-variant focus-within:border-primary">
            <input
              type="text"
              placeholder="Rechercher créations, marques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-4 pr-10 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
            />
            <button 
              onClick={() => {
                if (activeView !== 'marketplace') setActiveView('marketplace');
              }}
              className="absolute right-1.5 p-1.5 bg-primary text-on-primary rounded-full cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Top Strip (Confidence Indicators) */}
      <div className="bg-surface-container-low border-t border-b border-surface-container text-on-surface-variant text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-on-surface font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Vendeurs indépendants vérifiés
            </span>
            <span className="hidden sm:inline text-outline-variant">·</span>
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-secondary" /> Stock garanti et traçabilité B2B
            </span>
            <span className="hidden sm:inline text-outline-variant">·</span>
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <Zap className="w-3.5 h-3.5" /> Livraison offerte dès 49€ d&apos;achats
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px]">
            <span className="text-secondary font-semibold">100% Protection NovaEscrow</span>
            <span className="text-on-surface-variant">Paiement sécurisé Stripe & SSL</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - STRICTLY PROTECTED */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container px-4 py-4 space-y-3 animate-fadeIn">
          
          {/* Mobile User Profile Section */}
          {isAuthenticated ? (
            <div className="p-3 bg-surface-container-low rounded-2xl border border-outline-variant/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt={currentUser?.firstName || 'User'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <p className="font-bold text-xs text-on-surface">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  {roleBadge && (
                    <span className={`inline-block text-[9px] px-2 py-0.2 rounded-full font-bold ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-error hover:bg-error/10 rounded-xl"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-surface-container">
              <button
                onClick={() => {
                  setActiveView('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>S&apos;inscrire</span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <button
            onClick={() => {
              setActiveView('marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container"
          >
            Boutique & Catalogue
          </button>

          {/* If vendor or admin: Espace Vendeur */}
          {isAuthenticated && (currentUser?.role === 'vendor' || currentUser?.role === 'admin') && (
            <button
              onClick={() => {
                onOpenSellerPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-primary" /> Espace Vendeur
            </button>
          )}

          {/* If client or unauthenticated: Devenir Vendeur */}
          {(!isAuthenticated || currentUser?.role === 'client') && (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setActiveView('register');
                } else if (onOpenProfileModal) {
                  onOpenProfileModal();
                }
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-secondary hover:bg-secondary/10 flex items-center gap-2"
            >
              <Store className="w-4 h-4" /> Devenir Vendeur sur NovaMarket
            </button>
          )}

          {/* Admin only: Console Admin */}
          {isAuthenticated && currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveView('admin_console');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-secondary" /> Console Admin
            </button>
          )}

          <button
            onClick={() => {
              setActiveView('orders');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-primary" /> Suivre mes commandes
          </button>

          <button
            onClick={() => {
              setActiveView('wishlist');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-error" /> Mes favoris ({wishlistCount})
          </button>
        </div>
      )}
    </header>
  );
};
