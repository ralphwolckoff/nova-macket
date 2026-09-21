import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingBag, 
  Store, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2, 
  Zap,
  Plus,
  Minus,
  Share2
} from 'lucide-react';
import { Product, Seller, Review } from '../types';

interface ProductDetailViewProps {
  product: Product;
  seller?: Seller;
  reviews: Review[];
  onBack: () => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onBuyNow: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onOpenContactSeller: (seller: Seller, product: Product) => void;
  onAddReview: (review: { productId: string; userName: string; rating: number; comment: string }) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  seller,
  reviews,
  onBack,
  onSelectSeller,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onOpenContactSeller,
  onAddReview,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  
  // Selected variant options
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        initial[v.name] = v.options[0];
      });
    }
    return initial;
  });

  // Review form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;
    onAddReview({
      productId: product.id,
      userName: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
    });
    setReviewerName('');
    setReviewerComment('');
    setShowReviewModal(false);
  };

  const productReviews = reviews.filter(r => r.productId === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isWishlisted 
                ? 'bg-surface text-error border-outline-variant' 
                : 'text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-error text-error' : ''}`} />
            <span>{isWishlisted ? 'Dans vos favoris' : 'Ajouter aux favoris'}</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="p-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Partager ce produit"
            aria-label="Partager ce produit"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Dynamic Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-outline-variant/60 bg-surface-container-low shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-primary text-on-primary shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-outline-variant hover:border-outline opacity-80'
                  }`}
                >
                  <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Reassurance Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-container text-xs text-on-surface-variant">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <Truck className="w-5 h-5 text-primary mb-1.5" />
              <span className="font-semibold text-on-surface">NovaExpress 24h</span>
              <span className="text-[11px] text-on-surface-variant">{product.estimatedDelivery}</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <RotateCcw className="w-5 h-5 text-secondary mb-1.5" />
              <span className="font-semibold text-on-surface">Retours 30 jours</span>
              <span className="text-[11px] text-on-surface-variant">Pris en charge</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <ShieldCheck className="w-5 h-5 text-primary mb-1.5" />
              <span className="font-semibold text-on-surface">NovaEscrow</span>
              <span className="text-[11px] text-on-surface-variant">Fonds sécurisés</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Multi-Vendor Seller Box (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-on-surface">{product.rating}</span>
                <span className="text-on-surface-variant">({product.reviewCount} avis certifiés)</span>
              </div>
            </div>

            <h1 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-headline-lg text-3xl font-bold text-on-surface">
                  {product.price.toFixed(2)} €
                </span>
                {product.originalPrice && (
                  <span className="text-base text-on-surface-variant line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                TVA incluse • {product.shippingFee === 0 ? 'Frais de port gratuits' : `Frais d'envoi : ${product.shippingFee.toFixed(2)} €`}
              </p>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  En stock ({product.stock} dispo)
                </span>
              ) : (
                <span className="text-xs font-semibold text-error bg-surface-container px-2.5 py-1 rounded-full">
                  Rupture temporaire
                </span>
              )}
            </div>
          </div>

          {/* Multi-Vendor Seller Attribution Card */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-secondary flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                Vendu & Expédié par
              </span>
              <button
                id="view-seller-shop-link"
                onClick={() => onSelectSeller(product.sellerId)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Visiter la boutique →
              </button>
            </div>

            <div className="flex items-center gap-3">
              {seller && (
                <img
                  src={seller.logo}
                  alt={seller.name}
                  className="w-12 h-12 rounded-xl object-cover border border-outline-variant shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-on-surface text-sm truncate">
                    {product.sellerName}
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                  <span className="flex items-center gap-0.5 font-bold text-on-surface">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {seller?.rating || 4.9}
                  </span>
                  <span>•</span>
                  <span>{seller?.location || 'France'}</span>
                  <span>•</span>
                  <span>{seller?.salesCount || 1200}+ ventes</span>
                </div>
              </div>

              {seller && (
                <button
                  id="contact-seller-btn"
                  onClick={() => onOpenContactSeller(seller, product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs font-semibold transition-colors shrink-0 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Contacter</span>
                </button>
              )}
            </div>

            {seller?.returnPolicy && (
              <p className="text-[11px] text-on-surface-variant pt-1 border-t border-surface-container">
                <strong>Garantie atelier :</strong> {seller.returnPolicy}
              </p>
            )}
          </div>

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              {product.variants.map((v) => (
                <div key={v.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface block">
                    {v.name} : <span className="font-bold text-primary">{selectedVariants[v.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedVariants[v.name] === opt
                            ? 'border-primary bg-primary text-on-primary shadow-xs font-bold'
                            : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-on-surface">Quantité :</span>
              <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-on-surface min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-on-surface-variant">
                Total : <strong className="text-on-surface">{(product.price * quantity).toFixed(2)} €</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="detail-add-to-cart-btn"
                onClick={() => onAddToCart(product, quantity, selectedVariants)}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>Ajouter au panier</span>
              </button>

              <button
                id="detail-buy-now-btn"
                onClick={() => onBuyNow(product, quantity, selectedVariants)}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold text-xs shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Acheter maintenant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Spécifications / Avis Clients */}
      <div className="pt-8 border-t border-surface-container">
        <div className="flex border-b border-surface-container gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'description' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Description du produit
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'specs' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Fiche technique
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reviews' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Avis vérifiés</span>
            <span className="bg-surface-container text-on-surface text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              {productReviews.length}
            </span>
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-on-surface-variant leading-relaxed space-y-4 text-xs sm:text-sm">
              <p className="text-sm sm:text-base text-on-surface">{product.description}</p>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface-variant space-y-1">
                <p><strong>Note de l&apos;atelier ({product.sellerName}) :</strong> Tous nos produits sont inspectés rigoureusement avant expédition et protégés dans des emballages certifiés.</p>
                <p><strong>Délai garanti :</strong> {product.estimatedDelivery} avec traçabilité NovaExpress.</p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  {Object.entries(product.specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}>
                      <td className="py-3 px-4 font-bold text-on-surface border-b border-surface-container w-1/3">
                        {key}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant border-b border-surface-container">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-lg text-3xl font-bold text-on-surface">{product.rating}</span>
                    <div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-on-surface-variant">{productReviews.length} avis enregistrés pour ce produit</span>
                    </div>
                  </div>
                </div>

                <button
                  id="open-review-modal-btn"
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-xs"
                >
                  Rédiger un avis client
                </button>
              </div>

              {/* Review Form Modal */}
              {showReviewModal && (
                <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-md space-y-4">
                  <h4 className="font-bold text-sm text-on-surface">Votre évaluation pour {product.title}</h4>
                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">Votre prénom / pseudonyme</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Ex: Sophie D."
                      className="w-full text-xs bg-surface-container border border-outline-variant rounded-xl p-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">Note globale (sur 5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          type="button"
                          key={score}
                          onClick={() => setReviewerRating(score)}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                            reviewerRating >= score 
                              ? 'bg-primary text-on-primary border-primary' 
                              : 'bg-surface-container text-on-surface-variant border-outline-variant'
                          }`}
                        >
                          {score} ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">Votre commentaire détaillé</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="Partagez votre expérience sur la qualité, la rapidité d'envoi de l'atelier..."
                      className="w-full text-xs bg-surface-container border border-outline-variant rounded-xl p-2.5 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container hover:text-on-primary-container"
                    >
                      Publier l&apos;avis
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis sur cet article !
                  </div>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {rev.userAvatar ? (
                            <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface font-bold flex items-center justify-center text-xs">
                              {rev.userName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-on-surface text-xs block">{rev.userName}</span>
                            <span className="text-[10px] text-on-surface-variant">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold ml-1">
                              Achat vérifié
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-on-surface leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
