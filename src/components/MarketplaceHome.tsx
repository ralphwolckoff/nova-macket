import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Store, 
  CheckCircle2, 
  SlidersHorizontal, 
  RotateCcw, 
  Truck, 
  Star, 
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, Seller } from '../types';
import { ProductCard } from './ProductCard';

interface MarketplaceHomeProps {
  products: Product[];
  sellers: Seller[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlistIds: string[];
  onOpenSellerPortal: () => void;
  onOpenCartDrawer?: () => void;
  cartCount?: number;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  products,
  sellers,
  selectedCategory,
  setSelectedCategory,
  categories,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenSellerPortal,
  onOpenCartDrawer,
  cartCount = 0
}) => {
  // Local filter states
  const [maxPrice, setMaxPrice] = React.useState<number>(200);
  const [selectedSellerIds, setSelectedSellerIds] = React.useState<string[]>([]);
  const [minRating, setMinRating] = React.useState<number>(0);
  const [onlyImmediateStock, setOnlyImmediateStock] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'Toutes' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    const matchesSeller = selectedSellerIds.length === 0 || selectedSellerIds.includes(p.sellerId);
    const matchesRating = minRating === 0 || p.rating >= minRating;
    const matchesStock = !onlyImmediateStock || p.stock > 0;

    return matchesCategory && matchesSearch && matchesPrice && matchesSeller && matchesRating && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default NovaScore
  });

  const resetFilters = () => {
    setMaxPrice(200);
    setSelectedSellerIds([]);
    setMinRating(0);
    setOnlyImmediateStock(false);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const categoryPills = [
    { id: 'all', label: 'Toutes les créations' },
    { id: 'Électronique & Audio', label: 'Électronique & Audio' },
    { id: 'Mobilier Minimaliste', label: 'Mobilier Minimaliste' },
    { id: 'Mode Éthique', label: 'Mode Éthique' },
    { id: 'Beauté Biologique', label: 'Beauté Biologique' },
    { id: 'Maroquinerie & Accessoires', label: 'Maroquinerie & Accessoires' },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 animate-fadeIn">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-tight">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Écosystème Certifié NovaTrust</span>
            </div>

            <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.15]">
              La Marketplace des{' '}
              <span className="text-primary relative inline-block">
                Créateurs
                <span className="absolute bottom-1 left-0 w-full h-1.5 bg-secondary/30 rounded-full"></span>
              </span>{' '}
              & Boutiques Indépendantes.
            </h1>

            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
              Découvrez une sélection rigoureuse d&apos;objets du quotidien, pièces de design et technologies durables vendus en direct par des ateliers français et européens certifiés.
            </p>

            {/* Quick Hero Search Input */}
            <div className="relative max-w-lg">
              <div className="flex items-center bg-surface-container-low rounded-2xl border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 p-1.5 shadow-sm transition-all">
                <Search className="w-5 h-5 text-on-surface-variant ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une pièce artisanale, une marque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-stage');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs sm:text-sm rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shrink-0"
                >
                  Explorer
                </button>
              </div>
            </div>

            {/* Quick Trends Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-on-surface-variant font-medium">Tendances :</span>
              {[
                { label: 'High-Tech & Audio', cat: 'Électronique & Audio' },
                { label: 'Mode & Créateurs', cat: 'Mode Éthique' },
                { label: 'Maison & Déco', cat: 'Mobilier Minimaliste' },
                { label: 'Artisanat Français', cat: 'all' }
              ].map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => setSelectedCategory(tag.cat)}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors font-medium"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Right Card: Spotlight Artisan */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant/60 shadow-lg bg-surface-container-lowest group">
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpD9fQB_dLv5Et3XnbDhbiDAjtVhtQBB6aEZKy7rw5olKS7vyoQsNlxZwbbylZR7Z5jWbeYz0ywfhwhobKDQDvBxOj6PhBctis_Nk3PCH_BPzbCliOUeOLCAv7yMI0828XrFromiWgU9pDOvYD2GqnuYfgMdv-_DWBdUyZG5zvM3NnEt8iUio2WIDuAuqgDxLoG3ejExbuvRqx46EEi4hqasoQfe6Cnj2HfL-nvfxrap-OPc3hBZIjPg"
                  alt="Focus Atelier Lumière"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-surface/90 text-on-surface backdrop-blur-md rounded-full text-xs font-bold shadow-xs">
                    Focus Artisan du Jour
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg leading-tight">Atelier Lumière & Céramique</h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Directement depuis Lyon · 1 420 commandes satisfaites sans intermédiaire
                  </p>
                </div>
              </div>
              <div className="p-4 bg-surface-container-low flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-xs font-medium text-on-surface">100% Protection NovaEscrow</span>
                </div>
                <button
                  onClick={() => onSelectSeller('seller-atelier-lumiere')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Découvrir <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STICKY HORIZONTAL CATEGORY PILLS */}
      <section className="sticky top-[105px] z-30 bg-surface/95 backdrop-blur-xl border-y border-outline-variant/60 py-2.5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categoryPills.map((cat) => {
              const isActive = selectedCategory === cat.id || (cat.id === 'all' && (selectedCategory === 'all' || selectedCategory === 'Toutes'));
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Cart Counter Button */}
          {onOpenCartDrawer && (
            <button
              onClick={onOpenCartDrawer}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-colors shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span>Panier rapide ({cartCount})</span>
            </button>
          )}
        </div>
      </section>

      {/* CORE CONTENT GRID STAGE */}
      <div id="catalog-stage" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MULTI-DIMENSIONAL FACETED FILTERS SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <span className="font-headline-sm font-bold text-sm text-on-surface flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Affiner l&apos;index
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Réinitialiser
            </button>
          </div>

          {/* 1. Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
              <span>Gamme de Prix</span>
              <span className="text-primary font-bold">{maxPrice} € max</span>
            </div>
            <input
              type="range"
              min="15"
              max="320"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
              <span>15 €</span>
              <span>160 €</span>
              <span>320 €</span>
            </div>
          </div>

          {/* 2. Partner Sellers Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-surface-container">
            <span className="text-xs font-bold text-on-surface block">Boutiques Partenaires</span>
            <div className="space-y-2">
              {sellers.map((s) => {
                const count = products.filter(p => p.sellerId === s.id).length;
                const isChecked = selectedSellerIds.includes(s.id);
                return (
                  <label 
                    key={s.id} 
                    className="flex items-center justify-between gap-2 text-xs text-on-surface-variant hover:text-on-surface cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedSellerIds(selectedSellerIds.filter(id => id !== s.id));
                          } else {
                            setSelectedSellerIds([...selectedSellerIds, s.id]);
                          }
                        }}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-3.5 w-3.5 accent-primary"
                      />
                      <span className="truncate">{s.name}</span>
                    </div>
                    <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant/80">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Customer Satisfaction / Rating */}
          <div className="space-y-2 pt-2 border-t border-surface-container">
            <span className="text-xs font-bold text-on-surface block">Satisfaction Clients</span>
            <div className="space-y-1.5 text-xs">
              {[
                { rating: 4.8, label: 'Note 4.8 & plus' },
                { rating: 4.5, label: 'Note 4.5 & plus' },
                { rating: 5.0, label: 'Exclusivité 5.0' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setMinRating(minRating === opt.rating ? 0 : opt.rating)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    minRating === opt.rating
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {opt.label}
                  </span>
                  {minRating === opt.rating && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Stock Immédiat Toggle */}
          <div className="pt-2 border-t border-surface-container">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-on-surface block">Stock Immédiat</span>
                <span className="text-[10px] text-on-surface-variant">Expédié sous 24h</span>
              </div>
              <input
                type="checkbox"
                checked={onlyImmediateStock}
                onChange={(e) => setOnlyImmediateStock(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary relative" />
            </label>
          </div>

          {/* 5. Logistics Guarantee Banner */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Truck className="w-4 h-4" />
              <span>NovaExpress B2C</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Expéditions centralisées & neutres en carbone. Suivi direct depuis le tableau de bord acheteur.
            </p>
          </div>

        </aside>

        {/* MAIN CATALOGUE & RESULTS (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Results Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-on-surface-variant font-medium">
              <span className="font-bold text-on-surface">{sortedProducts.length} articles</span> trouvés ·{' '}
              <span className="text-secondary font-semibold">Triés par pertinence & réactivité</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-surface-container border border-outline-variant rounded-xl px-3 py-1.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="default">Pertinence NovaScore</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-12 text-center space-y-4">
              <p className="font-headline-sm font-bold text-lg text-on-surface">Aucun article ne correspond à vos filtres</p>
              <p className="text-xs text-on-surface-variant">Essayez de réinitialiser la recherche ou d&apos;élargir vos critères de prix.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onSelectSeller={onSelectSeller}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(product.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface-container text-xs text-on-surface-variant">
            <span>Affichage de 1 à {sortedProducts.length} sur {products.length} produits uniques</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                  currentPage === 1 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                  currentPage === 2 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                2
              </button>
              <button 
                onClick={() => setCurrentPage(3)}
                className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                  currentPage === 3 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                3
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(currentPage + 1, 3))}
                className="px-3 h-8 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>

        </main>

      </div>

      {/* FEATURED SELLERS OF THE WEEK */}
      <section className="space-y-6 pt-8 border-t border-outline-variant/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Artisans & Ateliers</span>
            <h2 className="font-display-lg text-2xl font-bold text-on-surface">Vendeurs Vedettes de la Semaine</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Des ateliers sélectionnés pour leur excellence de fabrication, transparence et rapidité d&apos;expédition.
            </p>
          </div>
          <button
            onClick={onOpenSellerPortal}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
          >
            Rejoindre la place de marché <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellers.slice(0, 3).map((seller) => {
            const sellerProducts = products.filter(p => p.sellerId === seller.id);
            return (
              <div 
                key={seller.id}
                className="bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/40 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Seller Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.logo}
                      alt={seller.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-outline-variant"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-on-surface truncate">{seller.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate">{seller.location}</p>
                    </div>
                  </div>

                  {/* Seller Description */}
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {seller.description}
                  </p>

                  {/* Seller Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 py-2 bg-surface-container-low rounded-xl text-center">
                    <div>
                      <span className="block text-xs font-bold text-on-surface flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {seller.rating}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Note</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-on-surface">{seller.salesCount}</span>
                      <span className="text-[10px] text-on-surface-variant">Ventes</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-secondary">24h</span>
                      <span className="text-[10px] text-on-surface-variant">Expédition</span>
                    </div>
                  </div>

                  {/* 3-item Mini Showcase */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {sellerProducts.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectProduct(item)}
                        className="aspect-square rounded-lg overflow-hidden bg-surface-container group/thumb"
                        title={item.title}
                      >
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visit Seller Storefront Button */}
                <button
                  onClick={() => onSelectSeller(seller.id)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-surface-container hover:bg-primary-container text-on-surface hover:text-on-primary-container text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Visiter la boutique</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
