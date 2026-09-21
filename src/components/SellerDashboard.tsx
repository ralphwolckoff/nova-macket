import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Plus, 
  Star, 
  Truck, 
  MessageSquare, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  Send,
  Eye,
  ArrowLeft,
  DollarSign,
  Tag,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Seller, Product, Order, ChatMessage } from '../types';
import { AddProductModal } from './AddProductModal';
import { SellerFinancesView } from './SellerFinancesView';
import { SellerPromotionsView } from './SellerPromotionsView';
import { SellerReviewsView } from './SellerReviewsView';
import { SellerAnalyticsView } from './SellerAnalyticsView';
import { SellerSettingsView } from './SellerSettingsView';
import { StoreModal } from './StoreModal';

interface SellerDashboardProps {
  sellers: Seller[];
  currentSeller: Seller;
  onSelectSellerProfile: (seller: Seller) => void;
  products: Product[];
  orders: Order[];
  messages: ChatMessage[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdatePackageStatus: (orderId: string, sellerId: string, newStatus: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée', trackingNumber?: string) => void;
  onSendMessage: (sellerId: string, text: string) => void;
  onUpdateSellerProfile: (updatedSeller: Seller) => void;
  onCreateStore?: (newStore: Seller) => void;
  onViewStorefront: (sellerId: string) => void;
  onExitDashboard: () => void;
  onOpenAdminConsole?: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  sellers,
  currentSeller,
  onSelectSellerProfile,
  products,
  orders,
  messages,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdatePackageStatus,
  onSendMessage,
  onUpdateSellerProfile,
  onCreateStore,
  onViewStorefront,
  onExitDashboard,
  onOpenAdminConsole,
}) => {
  const [activeTab, setActiveTab] = useState<
    'catalog' | 'orders' | 'finances' | 'promotions' | 'reviews' | 'analytics' | 'settings'
  >('catalog');
  
  // Add product modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Store management modal states
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);

  // Catalog search & filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');

  // Filter items for current seller
  const sellerProducts = products.filter(p => p.sellerId === currentSeller.id);
  const relevantOrders = orders.filter(o => o.packages.some(pkg => pkg.sellerId === currentSeller.id));

  // Compute stats
  const totalRevenue = relevantOrders.reduce((sum, ord) => {
    const pkg = ord.packages.find(p => p.sellerId === currentSeller.id);
    return sum + (pkg ? pkg.subtotal : 0);
  }, 0);

  const lowStockCount = sellerProducts.filter(p => p.stock < 10).length;

  const filteredSellerProducts = sellerProducts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchCat = catalogCategory === 'all' || p.category === catalogCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-outline-variant/60 shrink-0 bg-surface-container">
            <img src={currentSeller.logo} alt={currentSeller.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Espace Marchand Pro
              </span>
              {currentSeller.isVerified && (
                <span className="text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Atelier Certifié
                </span>
              )}
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-1">
              {currentSeller.name}
            </h1>
            <p className="text-xs text-on-surface-variant max-w-lg mt-0.5">
              {currentSeller.description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {/* Change Seller Profile Dropdown */}
          <div className="relative">
            <select
              value={currentSeller.id}
              onChange={(e) => {
                const s = sellers.find(sel => sel.id === e.target.value);
                if (s) onSelectSellerProfile(s);
              }}
              className="px-3 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/50 focus:outline-none cursor-pointer"
            >
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  Boutique : {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowEditStoreModal(true)}
            className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Modifier les visuels, bannières et politiques de la boutique"
          >
            <Settings className="w-3.5 h-3.5 text-secondary" />
            <span>Modifier Boutique</span>
          </button>

          <button
            onClick={() => setShowCreateStoreModal(true)}
            className="px-3.5 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ouvrir une nouvelle boutique marchande"
          >
            <Store className="w-3.5 h-3.5" />
            <span>+ Nouvelle Boutique</span>
          </button>

          <button
            onClick={() => onViewStorefront(currentSeller.id)}
            className="px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            <span>Vitrine Publique</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Produit</span>
          </button>

          <button
            onClick={onExitDashboard}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Retour à la boutique"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Draft or Incomplete Store Alert */}
      {currentSeller.status === 'draft' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-on-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">Boutique en statut Brouillon (Draft)</span>
              <span className="text-on-surface-variant">Cette boutique n&apos;est pas encore publiée sur la marketplace. Complétez vos politiques et activez-la.</span>
            </div>
          </div>
          <button
            onClick={() => setShowEditStoreModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Finaliser & Mettre en ligne
          </button>
        </div>
      )}

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalogue & Stocks</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'catalog' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
          }`}>
            {sellerProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Commandes & Expéditions</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'orders' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container'
          }`}>
            {relevantOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'finances'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenus & Versements</span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'promotions'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promotions & Coupons</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Avis & Réputation</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Performances & Statistiques</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Paramètres & Profil</span>
        </button>
      </div>

      {/* VIEW: CATALOG & STOCKS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* 4 KPIs for Catalog */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Références en Ligne</span>
              <div className="font-mono font-bold text-3xl text-on-surface">{sellerProducts.length}</div>
              <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% actives et indexées
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Valeur du Stock Vendeur</span>
              <div className="font-mono font-bold text-3xl text-primary">
                {sellerProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
              <span className="text-[11px] text-on-surface-variant">Basé sur le prix catalogue TTC</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Alerte Réassort</span>
              <div className="font-mono font-bold text-3xl text-secondary">{lowStockCount}</div>
              <span className="text-[11px] text-secondary font-semibold">
                Articles sous le seuil critique (10 ex.)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Note Moyenne Articles</span>
              <div className="font-mono font-bold text-3xl text-on-surface">4.9 / 5</div>
              <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" /> Badge Qualité NovaGold
              </span>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher par titre, catégorie ou référence..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="h-10 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/60 focus:outline-none cursor-pointer"
              >
                <option value="all">Toutes les catégories</option>
                <option value="Mobilier Minimaliste">Mobilier Minimaliste</option>
                <option value="Électronique & Audio">Électronique & Audio</option>
                <option value="Maroquinerie & Accessoires">Maroquinerie & Accessoires</option>
                <option value="Artisans Certifiés">Artisans Certifiés</option>
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            </div>
          </div>

          {/* Products Inventory Table */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant">
                    <th className="pb-3 font-semibold">Article & Création</th>
                    <th className="pb-3 font-semibold">Catégorie</th>
                    <th className="pb-3 font-semibold text-right">Prix TTC</th>
                    <th className="pb-3 font-semibold text-center">Niveau de Stock</th>
                    <th className="pb-3 font-semibold text-center">Statut</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredSellerProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/40">
                            <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-on-surface block">{prod.title}</span>
                            <span className="text-[11px] text-outline font-mono">
                              SKU: {prod.specs?.['Référence SKU'] || `NVM-${prod.id.slice(0, 6)}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 text-right font-mono font-bold text-xs text-primary">
                        {prod.price.toFixed(2)} €
                      </td>

                      {/* Stock Stepper */}
                      <td className="py-3.5 text-center">
                        <div className="inline-flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-xl border border-outline-variant/40">
                          <button
                            onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                            className="w-5 h-5 rounded bg-surface-container-lowest text-on-surface font-bold hover:bg-surface-container flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-xs w-8 text-center">{prod.stock}</span>
                          <button
                            onClick={() => onUpdateProductStock(prod.id, prod.stock + 1)}
                            className="w-5 h-5 rounded bg-surface-container-lowest text-on-surface font-bold hover:bg-surface-container flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 text-center">
                        {prod.stock === 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                            Rupture
                          </span>
                        ) : prod.stock < 10 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                            Stock Faible
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                            En Ligne
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                          title="Supprimer du catalogue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ORDERS & SHIPMENTS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Orders SLA KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Commandes Totales</span>
              <div className="font-mono font-bold text-3xl text-on-surface">{relevantOrders.length}</div>
              <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% traitées sous 24h
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">À Expédier Aujourd&apos;hui</span>
              <div className="font-mono font-bold text-3xl text-secondary">
                {relevantOrders.filter(o => o.packages.some(p => p.sellerId === currentSeller.id && p.status !== 'Livrée')).length}
              </div>
              <span className="text-[11px] text-secondary font-semibold">Bordereaux prêts pour le ramassage</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Chiffre Réalisé Commandes</span>
              <div className="font-mono font-bold text-3xl text-primary">
                {totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
              <span className="text-[11px] text-on-surface-variant">Net déduction commissions</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-on-surface-variant">Délai Moyen Expédition</span>
              <div className="font-mono font-bold text-3xl text-on-surface">18h</div>
              <span className="text-[11px] text-tertiary font-semibold">Objectif contrat &lt; 24h</span>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Suivi et Gestion des Colis Marchands
            </h2>

            <div className="space-y-4">
              {relevantOrders.map((ord) => {
                const pkg = ord.packages.find(p => p.sellerId === currentSeller.id);
                if (!pkg) return null;

                return (
                  <div key={ord.id} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/50 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-surface-container">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary">#{ord.id}</span>
                        <span className="text-xs text-on-surface-variant">· Passée le {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-on-surface-variant">Statut colis :</span>
                        <select
                          value={pkg.status}
                          onChange={(e) => onUpdatePackageStatus(
                            ord.id, 
                            currentSeller.id, 
                            e.target.value as 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée',
                            pkg.trackingNumber || `FR${Math.floor(10000000 + Math.random() * 90000000)}`
                          )}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-outline-variant/50 focus:outline-none cursor-pointer ${
                            pkg.status === 'Livrée' 
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed' 
                              : pkg.status === 'Expédiée'
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-lowest text-on-surface'
                          }`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="En préparation">En préparation</option>
                          <option value="Expédiée">Expédiée (En transit)</option>
                          <option value="Livrée">Livrée (Déblocage séquestre)</option>
                        </select>
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="space-y-2">
                      {pkg.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">{item.quantity}x</span>
                            <span className="font-semibold text-on-surface">{item.product.title}</span>
                          </div>
                          <span className="font-mono font-bold text-on-surface">
                            {(item.product.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <span className="font-mono text-outline">
                          N° Suivi : {pkg.trackingNumber || 'En attente d\'attribution'}
                        </span>
                      </div>
                      <div className="font-bold text-on-surface">
                        Sous-total : <span className="font-mono text-primary font-bold">{pkg.subtotal.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: FINANCES & PAYOUTS */}
      {activeTab === 'finances' && (
        <SellerFinancesView currentSeller={currentSeller} orders={orders} />
      )}

      {/* VIEW: PROMOTIONS & COUPONS */}
      {activeTab === 'promotions' && (
        <SellerPromotionsView />
      )}

      {/* VIEW: REVIEWS & REPUTATION */}
      {activeTab === 'reviews' && (
        <SellerReviewsView currentSeller={currentSeller} />
      )}

      {/* VIEW: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <SellerAnalyticsView currentSeller={currentSeller} products={products} />
      )}

      {/* VIEW: SETTINGS & PROFILE */}
      {activeTab === 'settings' && (
        <SellerSettingsView
          currentSeller={currentSeller}
          onUpdateSellerProfile={onUpdateSellerProfile}
          onOpenStoreModal={() => setShowEditStoreModal(true)}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProduct={onAddProduct}
        sellerId={currentSeller.id}
        sellerName={currentSeller.name}
      />

      {/* Store Update Modal (Edit Mode) */}
      <StoreModal
        isOpen={showEditStoreModal}
        mode="edit"
        initialData={currentSeller}
        onClose={() => setShowEditStoreModal(false)}
        onSave={(updated) => {
          onUpdateSellerProfile(updated);
          setShowEditStoreModal(false);
        }}
      />

      {/* Store Creation Modal (Create Mode) */}
      <StoreModal
        isOpen={showCreateStoreModal}
        mode="create"
        onClose={() => setShowCreateStoreModal(false)}
        onSave={(newStore) => {
          if (onCreateStore) {
            onCreateStore(newStore);
          } else {
            onUpdateSellerProfile(newStore);
          }
          onSelectSellerProfile(newStore);
          setShowCreateStoreModal(false);
        }}
      />
    </div>
  );
};
