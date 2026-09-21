import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Package, 
  ShieldCheck, 
  MessageSquare, 
  Truck, 
  RotateCcw, 
  Search,
  Store
} from 'lucide-react';
import { Seller, Product } from '../types';
import { ProductCard } from './ProductCard';

interface SellerShopViewProps {
  seller: Seller;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlistIds: string[];
  onOpenContactSeller: (seller: Seller) => void;
}

export const SellerShopView: React.FC<SellerShopViewProps> = ({
  seller,
  products,
  onBack,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenContactSeller,
}) => {
  const [shopSearch, setShopSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'policies'>('products');
  const [selectedCat, setSelectedCat] = useState<string>('Toutes');

  const sellerProducts = products.filter(p => p.sellerId === seller.id);
  
  // Unique categories in this shop
  const shopCategories = Array.from(new Set(sellerProducts.map(p => p.category)));

  const filteredProducts = sellerProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(shopSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesCat = selectedCat === 'Toutes' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        id="seller-shop-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la marketplace</span>
      </button>

      {/* Seller Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-outline-variant/60 bg-surface-container-lowest shadow-xs">
        {/* Banner Cover */}
        <div className="h-48 sm:h-64 w-full relative bg-surface-container-highest overflow-hidden">
          <img
            src={seller.banner}
            alt={seller.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Profile Card Overlay */}
        <div className="relative px-6 pb-6 pt-0 sm:flex items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={seller.logo}
                alt={seller.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-surface shadow-md bg-surface"
              />
              {seller.verified && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary p-1 rounded-full shadow-xs" 
                  title="Atelier Certifié NovaTrust"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-2 sm:pt-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display-lg text-2xl font-bold text-on-surface">
                  {seller.name}
                </h1>
                {seller.verified && (
                  <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full border border-secondary/30 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Atelier Agréé NovaTrust
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl line-clamp-2">
                {seller.description}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-on-surface-variant pt-1">
                <span className="flex items-center gap-1 font-bold text-on-surface">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {seller.rating} ({seller.reviewCount} avis)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                  {seller.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-on-surface-variant" />
                  {seller.salesCount}+ créations expédiées
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                  Depuis {seller.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end gap-2">
            <button
              id="shop-contact-btn"
              onClick={() => onOpenContactSeller(seller)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter l&apos;atelier</span>
            </button>
          </div>
        </div>

        {/* Badges strip */}
        {seller.badges && seller.badges.length > 0 && (
          <div className="px-6 py-2.5 bg-surface-container border-t border-outline-variant/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Engagements NovaTrust :
            </span>
            {seller.badges.map((b) => (
              <span key={b} className="text-xs font-semibold text-on-surface bg-surface-container-lowest border border-outline-variant px-2.5 py-0.5 rounded-md">
                ✓ {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-surface-container gap-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Articles en vente ({sellerProducts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'about'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          À propos de l&apos;atelier
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'policies'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Livraison & Conditions de retour
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Internal Shop Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                placeholder={`Rechercher chez ${seller.name}...`}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <button
                onClick={() => setSelectedCat('Toutes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === 'Toutes'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Tous les rayons
              </button>
              {shopCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/60">
              <Store className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium text-on-surface-variant">Aucun article ne correspond à votre recherche dans cette boutique.</p>
              <button
                onClick={() => { setShopSearch(''); setSelectedCat('Toutes'); }}
                className="mt-2 text-xs text-primary font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelectProduct={onSelectProduct}
                  onSelectSeller={onSelectSeller}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About */}
      {activeTab === 'about' && (
        <div className="max-w-3xl space-y-6 text-on-surface-variant">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-3 shadow-xs">
            <h3 className="font-headline-sm font-bold text-base text-on-surface">Notre histoire</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-on-surface-variant">
              {seller.story || seller.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
              <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-2">Coordonnées</h4>
              <p className="text-xs text-on-surface-variant"><strong>Email :</strong> {seller.contactEmail}</p>
              <p className="text-xs text-on-surface-variant mt-1"><strong>Téléphone :</strong> {seller.contactPhone}</p>
              <p className="text-xs text-on-surface-variant mt-1"><strong>Localisation :</strong> {seller.location}</p>
            </div>
            <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
              <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider mb-2">Statut légal</h4>
              <p className="text-xs text-on-surface-variant">Atelier vérifié sur la marketplace NovaMarket.</p>
              <p className="text-xs text-on-surface-variant mt-1">Garantie légale de conformité de 24 mois applicable.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Policies */}
      {activeTab === 'policies' && (
        <div className="max-w-3xl space-y-4">
          <div className="p-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest flex items-start gap-4 shadow-xs">
            <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Modalités d&apos;expédition</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{seller.shippingInfo}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest flex items-start gap-4 shadow-xs">
            <div className="p-2.5 rounded-xl bg-secondary-container text-on-secondary-container">
              <RotateCcw className="w-5 h-5 text-secondary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Politique de retour et de remboursement</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">{seller.returnPolicy}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
