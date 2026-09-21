import React, { useState, useEffect } from 'react';
import { 
  Seller, 
  Product, 
  Order, 
  Review, 
  ChatMessage, 
  ActiveView,
  LegalTab
} from './types';
import { 
  initialSellers, 
  initialProducts, 
  initialReviews, 
  sampleOrders, 
  initialMessages 
} from './data/mockData';

// TanStack Query Hooks
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProductStock, 
  useDeleteProduct 
} from './hooks/useProductQueries';
import { 
  useStores, 
  useCreateStore, 
  useUpdateStore 
} from './hooks/useStoreQueries';
import { 
  useOrders, 
  useCreateOrder, 
  useUpdatePackageStatus 
} from './hooks/useOrderQueries';
import { 
  useReviews, 
  useAddReview 
} from './hooks/useReviewQueries';
import { 
  useMessages, 
  useSendMessage 
} from './hooks/useChatQueries';

// Zustand Stores
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';
import { useUiStore } from './store/uiStore';

// Components
import { Navbar } from './components/Navbar';
import { MarketplaceHome } from './components/MarketplaceHome';
import { ProductDetailView } from './components/ProductDetailView';
import { SellerShopView } from './components/SellerShopView';
import { CartView } from './components/CartView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrdersView } from './components/OrdersView';
import { WishlistView } from './components/WishlistView';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminConsole } from './components/AdminConsole';
import { ContactSellerModal } from './components/ContactSellerModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { AccessDeniedView } from './components/AccessDeniedView';
import { UserProfileModal } from './components/UserProfileModal';
import { LegalView } from './components/LegalView';
import { CookieBanner } from './components/CookieBanner';

export default function App() {
  // ==========================================================================
  // TANSTACK QUERY - DATA FETCHING & MUTATIONS
  // ==========================================================================
  const { data: sellers = initialSellers } = useStores();
  const { data: products = initialProducts } = useProducts();
  const { data: orders = sampleOrders } = useOrders();
  const { data: reviews = initialReviews } = useReviews();
  const { data: messages = initialMessages } = useMessages();

  const createProductMutation = useCreateProduct();
  const updateProductStockMutation = useUpdateProductStock();
  const deleteProductMutation = useDeleteProduct();

  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();

  const createOrderMutation = useCreateOrder();
  const updatePackageStatusMutation = useUpdatePackageStatus();

  const addReviewMutation = useAddReview();
  const sendMessageMutation = useSendMessage();

  // ==========================================================================
  // ZUSTAND STORES - CART, WISHLIST, UI & NAVIGATION
  // ==========================================================================
  const {
    items: cart,
    addItem: addToCart,
    removeItem: removeCartItem,
    updateQuantity: updateCartQuantity,
    clearCart,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    setIsCartDrawerOpen,
    getItemCount: getCartItemCount,
  } = useCartStore();

  const {
    wishlistIds,
    toggleWishlist,
  } = useWishlistStore();

  const {
    activeView,
    setActiveView,
    activeLegalTab,
    openLegalTab,
    isCookieModalForced,
    setIsCookieModalForced,
    selectedProductId,
    setSelectedProductId,
    selectedSellerId,
    setSelectedSellerId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    isProfileModalOpen,
    setIsProfileModalOpen,
    contactModalData,
    setContactModalData,
    pendingAuthRedirect,
    setPendingAuthRedirect,
    toasts,
    addToast,
    removeToast,
  } = useUiStore();

  // Auth Context (Bridged with Zustand useAuthStore)
  const { currentUser, updateProfile, upgradeToVendor } = useAuth();

  // Active seller profile in dashboard & seller view
  const [activeSellerProfile, setActiveSellerProfile] = useState<Seller>(sellers[0] || initialSellers[0]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Synchronize activeSellerProfile with logged-in vendor's store
  useEffect(() => {
    if (currentUser?.role === 'vendor') {
      const matchingSeller = sellers.find(
        (s) => s.id === currentUser.storeId || s.name.toLowerCase() === currentUser.storeName?.toLowerCase()
      );
      if (matchingSeller) {
        setActiveSellerProfile(matchingSeller);
      } else if (currentUser.storeName) {
        const newSellerProfile: Seller = {
          id: currentUser.storeId || `seller-${currentUser.id}`,
          name: currentUser.storeName,
          slug: currentUser.storeName.toLowerCase().replace(/\s+/g, '-'),
          logo: currentUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
          banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80',
          description: currentUser.bio || 'Atelier & Créations artisanales NovaMarket',
          story: 'Boutique certifiée NovaMarket.',
          rating: 5.0,
          reviewCount: 0,
          location: 'France',
          verified: true,
          salesCount: 0,
          joinedDate: 'Cette semaine',
          returnPolicy: 'Retours gratuits 30 jours.',
          shippingInfo: 'Expédié sous 24/48h.',
          contactEmail: currentUser.email,
          contactPhone: currentUser.phoneNumber || '',
          categories: ['Artisans Certifiés'],
          badges: ['Nouveau Vendeur']
        };
        setActiveSellerProfile(newSellerProfile);
      }
    } else if (sellers.length > 0 && !activeSellerProfile) {
      setActiveSellerProfile(sellers[0]);
    }
  }, [currentUser, sellers]);

  const handleOpenSellerPortal = () => {
    if (!currentUser) {
      setPendingAuthRedirect({
        view: 'seller_dashboard',
        requiredRole: 'vendor',
        reason: "L'accès à l'Espace Vendeur et la gestion de boutique nécessitent une authentification préalable."
      });
      setActiveView('login');
      addToast('info', 'Authentification requise pour accéder à l’Espace Vendeur');
      return;
    }

    setActiveView('seller_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Derived category list
  const allCategories = Array.from(new Set(products.map((p) => p.category)));

  // Selected Objects
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedSeller = sellers.find((s) => s.id === selectedSellerId);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));
  const cartItemCount = getCartItemCount();

  // Store Management Handlers
  const handleCreateStore = (newStoreData: Seller) => {
    createStoreMutation.mutate(newStoreData);
    setActiveSellerProfile(newStoreData);

    if (currentUser) {
      updateProfile({
        role: 'vendor',
        storeId: newStoreData.id,
        storeName: newStoreData.name,
      });
    }

    setActiveView('seller_dashboard');
    addToast('success', `Boutique "${newStoreData.name}" créée avec succès !`);
  };

  const handleUpdateStore = (updatedStore: Seller) => {
    updateStoreMutation.mutate({ id: updatedStore.id, updates: updatedStore });
    if (activeSellerProfile.id === updatedStore.id) {
      setActiveSellerProfile(updatedStore);
    }
    if (currentUser && (currentUser.storeId === updatedStore.id || currentUser.storeName === updatedStore.name)) {
      updateProfile({
        storeName: updatedStore.name,
      });
    }
    addToast('success', `Informations de la boutique "${updatedStore.name}" mises à jour.`);
  };

  // Cart Operations
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedVariants?: Record<string, string>,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    addToCart(product, quantity, selectedVariants);
    addToast('success', `${quantity}x "${product.title}" ajouté au panier`);
  };

  const handleBuyNow = (
    product: Product,
    quantity = 1,
    selectedVariants?: Record<string, string>
  ) => {
    handleAddToCart(product, quantity, selectedVariants);
    setActiveView('cart');
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    updateCartQuantity(productId, newQty);
  };

  const handleRemoveCartItem = (productId: string) => {
    removeCartItem(productId);
    addToast('info', 'Article retiré du panier');
  };

  // Wishlist Operations
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const added = toggleWishlist(productId);
    if (added) {
      addToast('success', 'Article ajouté à vos favoris');
    } else {
      addToast('info', 'Article retiré de vos favoris');
    }
  };

  // Navigation Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setActiveView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSeller = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setActiveView('seller_shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Placement Handlers
  const handleOrderCompleted = (newOrder: Order) => {
    createOrderMutation.mutate({
      orderData: {
        items: newOrder.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: `${newOrder.shippingAddress.address}, ${newOrder.shippingAddress.city}`,
        paymentMethod: newOrder.paymentMethod,
        paymentProvider: newOrder.paymentProvider || 'campay',
        mobileMoneyNumber: newOrder.mobileMoneyNumber,
      },
      orderEntity: newOrder,
    });
    clearCart();
    setLastPlacedOrder(newOrder);
    setActiveView('order_confirmation');
    addToast('success', `Commande ${newOrder.id} validée avec succès !`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seller Dashboard Operations
  const handleAddProduct = (newProdData: Omit<Product, 'id'>) => {
    createProductMutation.mutate({
      storeId: newProdData.sellerId,
      name: newProdData.title,
      price: newProdData.price,
      stock: newProdData.stock,
      description: newProdData.description,
      images: newProdData.images,
      isFeatured: newProdData.featured,
    });
    addToast('success', `L'article "${newProdData.title}" est maintenant en vente sur NovaMarket`);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate(productId);
    addToast('info', 'Article retiré du catalogue');
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    updateProductStockMutation.mutate({ productId, stock: newStock });
    addToast('success', 'Stock mis à jour');
  };

  const handleUpdatePackageStatus = (
    orderId: string,
    sellerId: string,
    newStatus: 'En attente' | 'En préparation' | 'Expédiée' | 'Livrée',
    trackingNumber?: string
  ) => {
    updatePackageStatusMutation.mutate({
      orderId,
      sellerId,
      status: newStatus,
      trackingNumber,
    });
    addToast('success', `Statut du colis mis à jour : ${newStatus}`);
  };

  const handleSendMessage = (
    sellerId: string,
    text: string,
    productId?: string,
    productTitle?: string
  ) => {
    sendMessageMutation.mutate({
      sellerId,
      sender: activeView === 'seller_dashboard' ? 'seller' : 'buyer',
      text,
      productId,
      productTitle,
    });
    addToast('success', 'Message transmis avec succès');
  };

  const handleAddReview = (newReviewData: {
    productId: string;
    userName: string;
    rating: number;
    comment: string;
  }) => {
    addReviewMutation.mutate({
      ...newReviewData,
      verifiedPurchase: true,
    });
    addToast('success', 'Votre avis vérifié a été publié');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Universal Marketplace Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartItemCount}
        wishlistCount={wishlistIds.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={allCategories}
        onOpenSellerPortal={handleOpenSellerPortal}
        onOpenCartDrawer={openCartDrawer}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Router */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {activeView === 'marketplace' && (
          <MarketplaceHome
            products={products}
            sellers={sellers}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={allCategories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onAddToCart={(product, e) => handleAddToCart(product, 1, undefined, e)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpenSellerPortal={handleOpenSellerPortal}
          />
        )}

        {activeView === 'product_detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            seller={sellers.find((s) => s.id === selectedProduct.sellerId)}
            reviews={reviews}
            onBack={() => setActiveView('marketplace')}
            onSelectSeller={handleSelectSeller}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={(id) => handleToggleWishlist(id)}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onOpenContactSeller={(seller, product) =>
              setContactModalData({ open: true, seller, product })
            }
            onAddReview={handleAddReview}
          />
        )}

        {activeView === 'seller_shop' && selectedSeller && (
          <SellerShopView
            seller={selectedSeller}
            products={products}
            onBack={() => setActiveView('marketplace')}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onAddToCart={(product, e) => handleAddToCart(product, 1, undefined, e)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpenContactSeller={(seller) =>
              setContactModalData({ open: true, seller })
            }
          />
        )}

        {activeView === 'cart' && (
          <CartView
            cart={cart}
            sellers={sellers}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => setActiveView('checkout')}
            onContinueShopping={() => setActiveView('marketplace')}
            onSelectProduct={(id) => {
              const p = products.find((prod) => prod.id === id);
              if (p) handleSelectProduct(p);
            }}
            onSelectSeller={handleSelectSeller}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cart={cart}
            onBack={() => setActiveView('cart')}
            onOrderCompleted={handleOrderCompleted}
            onOpenLegalTab={openLegalTab}
          />
        )}

        {activeView === 'order_confirmation' && lastPlacedOrder && (
          <OrderConfirmationView
            order={lastPlacedOrder}
            onViewOrders={() => setActiveView('orders')}
            onContinueShopping={() => setActiveView('marketplace')}
          />
        )}

        {activeView === 'orders' && (
          <OrdersView
            orders={orders}
            sellers={sellers}
            onBack={() => setActiveView('marketplace')}
            onSelectProduct={(id) => {
              const p = products.find((prod) => prod.id === id);
              if (p) handleSelectProduct(p);
            }}
            onSelectSeller={handleSelectSeller}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistView
            wishlistProducts={wishlistProducts}
            onBack={() => setActiveView('marketplace')}
            onSelectProduct={handleSelectProduct}
            onSelectSeller={handleSelectSeller}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onRemoveFromWishlist={(id) => handleToggleWishlist(id)}
          />
        )}

        {/* Guarded Seller Dashboard */}
        {activeView === 'seller_dashboard' && (
          (currentUser?.role === 'vendor' || currentUser?.role === 'admin') ? (
            <SellerDashboard
              sellers={sellers}
              currentSeller={activeSellerProfile}
              onSelectSellerProfile={(seller) => setActiveSellerProfile(seller)}
              products={products}
              orders={orders}
              messages={messages}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProductStock={handleUpdateProductStock}
              onUpdatePackageStatus={handleUpdatePackageStatus}
              onSendMessage={(sellerId, text) => handleSendMessage(sellerId, text)}
              onUpdateSellerProfile={handleUpdateStore}
              onCreateStore={handleCreateStore}
              onViewStorefront={(sellerId) => {
                setSelectedSellerId(sellerId);
                setActiveView('seller_shop');
              }}
              onExitDashboard={() => setActiveView('marketplace')}
            />
          ) : (
            <AccessDeniedView
              requiredRole="vendor"
              onGoToLogin={() => {
                setPendingAuthRedirect({
                  view: 'seller_dashboard',
                  requiredRole: 'vendor',
                  reason: "Authentification marchand requise pour accéder au tableau de bord vendeur."
                });
                setActiveView('login');
              }}
              onGoToRegisterVendor={async () => {
                if (currentUser) {
                  const defaultStoreName = currentUser.storeName || `${currentUser.firstName} Atelier`;
                  await upgradeToVendor(defaultStoreName, currentUser.bio || 'Atelier et créations artisanales');
                  setActiveView('seller_dashboard');
                  addToast('success', 'Bienvenue dans votre Espace Vendeur ! Vous pouvez maintenant gérer et configurer votre boutique.');
                } else {
                  setPendingAuthRedirect({
                    view: 'seller_dashboard',
                    requiredRole: 'vendor',
                    reason: "Créez votre compte vendeur pour ouvrir votre boutique et vendre vos créations."
                  });
                  setActiveView('register');
                }
              }}
              onBackToMarketplace={() => setActiveView('marketplace')}
            />
          )
        )}

        {/* Guarded Admin Console */}
        {activeView === 'admin_console' && (
          currentUser?.role === 'admin' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminConsole
                sellers={sellers}
                orders={orders}
                onSelectSeller={(sellerId) => {
                  setSelectedSellerId(sellerId);
                  setActiveView('seller_shop');
                }}
                onBackToMarketplace={() => setActiveView('marketplace')}
              />
            </div>
          ) : (
            <AccessDeniedView
              requiredRole="admin"
              onGoToLogin={() => {
                setPendingAuthRedirect({
                  view: 'admin_console',
                  requiredRole: 'admin',
                  reason: "Cette console est protégée par RLS et strictement réservée aux Super-Administrateurs de NovaMarket."
                });
                setActiveView('login');
              }}
              onBackToMarketplace={() => setActiveView('marketplace')}
            />
          )
        )}

        {/* Authentication: Login View */}
        {activeView === 'login' && (
          <AuthView
            initialMode="login"
            redirectView={pendingAuthRedirect?.view || 'marketplace'}
            requiredRoleForPendingAction={pendingAuthRedirect?.requiredRole}
            pendingActionReason={pendingAuthRedirect?.reason}
            onSuccess={(targetView) => {
              const dest = targetView || pendingAuthRedirect?.view || 'marketplace';
              setPendingAuthRedirect(null);
              setActiveView(dest);
              addToast('success', 'Connexion réussie ! Bienvenue sur NovaMarket.');
            }}
            onCancel={() => {
              setPendingAuthRedirect(null);
              setActiveView('marketplace');
            }}
          />
        )}

        {/* Authentication: Register View */}
        {activeView === 'register' && (
          <AuthView
            initialMode="register"
            redirectView={pendingAuthRedirect?.view || 'marketplace'}
            requiredRoleForPendingAction={pendingAuthRedirect?.requiredRole}
            pendingActionReason={pendingAuthRedirect?.reason}
            onSuccess={(targetView) => {
              const dest = targetView || pendingAuthRedirect?.view || 'marketplace';
              setPendingAuthRedirect(null);
              setActiveView(dest);
              addToast('success', 'Compte créé avec succès ! Bienvenue.');
            }}
            onCancel={() => {
              setPendingAuthRedirect(null);
              setActiveView('marketplace');
            }}
          />
        )}

        {/* Legal Center View */}
        {activeView === 'legal' && (
          <LegalView
            initialTab={activeLegalTab}
            onOpenCookiePreferences={() => setIsCookieModalForced(true)}
            onBackToMarketplace={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={closeCartDrawer}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          closeCartDrawer();
          setActiveView('checkout');
        }}
        onViewFullCart={() => {
          closeCartDrawer();
          setActiveView('cart');
        }}
      />

      {/* Global Contact Seller Modal */}
      {contactModalData.open && contactModalData.seller && (
        <ContactSellerModal
          seller={contactModalData.seller}
          product={contactModalData.product}
          onClose={() => setContactModalData({ open: false })}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer
        onOpenSellerPortal={handleOpenSellerPortal}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveView('marketplace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLegalTab={openLegalTab}
        onOpenCookieSettings={() => setIsCookieModalForced(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner
        onOpenLegalTab={openLegalTab}
        forceOpenModal={isCookieModalForced}
        onCloseModal={() => setIsCookieModalForced(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNavigate={(view) => {
          setIsProfileModalOpen(false);
          setActiveView(view);
        }}
      />
    </div>
  );
}
