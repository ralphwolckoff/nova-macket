// ============================================================================
// NOVAMARKET - SUPABASE SCHEMA EXTENSIONS & MISSING TABLES SUGGESTIONS
// Ready to apply in Supabase SQL Editor or Spring Boot / Flyway migrations
// ============================================================================

export interface MissingTableRecommendation {
  name: string;
  category: string;
  reason: string;
  businessImpact: string;
  sqlMigration: string;
}

export const RECOMMENDED_MISSING_TABLES: MissingTableRecommendation[] = [
  {
    name: 'coupons',
    category: 'Marketing & Ventes',
    reason: 'La table actuelle "promotions" cible uniquement les remises flash sur un produit unitaire. Il manque une table pour gérer les codes promo réducteurs de panier (ex: WELCOME10, SPRING20, LIVRAISONOFFERTE).',
    businessImpact: 'Permet aux vendeurs et à la plateforme d\'organiser des campagnes d\'acquisition, fidélisation, remises en pourcentage ou montant fixe avec montant minimum de commande et limite d\'usage.',
    sqlMigration: `-- Table des codes promos / bons de réduction
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.stores(id) on delete cascade, -- NULL = code plateforme global
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount', 'free_shipping')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  min_order_amount numeric(12,2) not null default 0,
  max_discount_amount numeric(12,2),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index coupons_code_idx on public.coupons(code);
alter table public.coupons enable row level security;
create policy "active coupons are readable" on public.coupons for select to anon, authenticated 
  using (is_active and starts_at <= now() and expires_at > now());
create policy "store owners manage coupons" on public.coupons for all to authenticated 
  using (store_id is null and public.is_admin() or exists (select 1 from public.stores s where s.id = store_id and s.user_id = (select auth.uid())));`
  },
  {
    name: 'wishlists',
    category: 'Expérience Client & Rétention',
    reason: 'Les favoris / listes d\'envies sont actuellement stockés dans le localStorage du navigateur client. Ils sont perdus lors d\'un changement d\'appareil ou vidage de cache.',
    businessImpact: 'Synchronisation multi-écrans des articles sauvegardés et opportunité d\'envoyer des alertes "baisse de prix" ou "stock bas" aux acheteurs intéressés.',
    sqlMigration: `-- Table des favoris acheteurs
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index wishlists_user_idx on public.wishlists(user_id);
alter table public.wishlists enable row level security;
create policy "users read their own wishlist" on public.wishlists for select to authenticated using (user_id = (select auth.uid()));
create policy "users manage their own wishlist" on public.wishlists for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));`
  },
  {
    name: 'product_variants & options',
    category: 'Catalogue & Gestion de Stock',
    reason: 'La table "products" actuelle n\'a qu\'un seul prix et stock global. Or, les produits réels ont souvent des déclinaisons (taille S/M/L, pointure, couleur, matériau) avec des stocks distincts.',
    businessImpact: 'Évite les ruptures de stock non détectées sur une taille spécifique et permet de facturer un supplément pour certaines déclinaisons.',
    sqlMigration: `-- Table des variantes de produits (ex: Taille, Couleur)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  title text not null, -- ex: "Taille XL / Noir Ébène"
  attributes jsonb not null default '{}'::jsonb, -- ex: {"size": "XL", "color": "noir"}
  price_adjustment numeric(12,2) not null default 0.00,
  stock integer not null check (stock >= 0) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_prod_idx on public.product_variants(product_id);
alter table public.product_variants enable row level security;
create policy "variants public read" on public.product_variants for select to anon, authenticated using (true);
create policy "store owner writes variants" on public.product_variants for all to authenticated 
  using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and s.user_id = (select auth.uid())));`
  },
  {
    name: 'seller_payout_methods',
    category: 'Fintech & Versements Vendeurs',
    reason: 'La table "payouts" enregistre les virements financiers vers les boutiques, mais il n\'existe aucune table pour stocker les coordonnées de versement du vendeur (numéro Mobile Money MTN/Orange ou IBAN bancaire).',
    businessImpact: 'Automatisation des reversements de fonds hebdomadaires/mensuels via l\'API Campay (Mobile Money XAF) ou virement bancaire.',
    sqlMigration: `-- Coordonnées de versement vendeur (Campay / MoMo / IBAN)
create table public.seller_payout_methods (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  provider public.payment_provider not null default 'campay',
  account_type text not null check (account_type in ('mobile_money', 'bank_account')),
  phone_number text, -- Pour MTN Mobile Money ou Orange Money (Cameroun / CEMAC)
  network text check (network in ('MTN', 'Orange', 'Moov', 'Wave')),
  account_holder_name text not null,
  bank_name text,
  iban text,
  is_default boolean not null default true,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index seller_payout_methods_store_idx on public.seller_payout_methods(store_id);
alter table public.seller_payout_methods enable row level security;
create policy "vendor manages payout methods" on public.seller_payout_methods for all to authenticated 
  using (exists (select 1 from public.stores s where s.id = store_id and s.user_id = (select auth.uid())));`
  },
  {
    name: 'review_replies (ou colonne seller_reply)',
    category: 'Gestion de la Réputation',
    reason: 'Dans la table "reviews", les clients déposent un avis mais le vendeur n\'a aucun champ pour publier un droit de réponse officiel ou remercier le client.',
    businessImpact: 'Améliore la confiance client et permet aux artisans de clarifier les incidents de livraison ou remercier les avis positifs.',
    sqlMigration: `-- Option A: Ajout direct sur la table reviews existante
alter table public.reviews 
  add column if not exists seller_reply text,
  add column if not exists seller_replied_at timestamptz;

-- Policy pour permettre au vendeur de répondre à un avis de sa boutique
create policy "store owner can reply to reviews" on public.reviews for update to authenticated 
  using (exists (select 1 from public.stores s where s.id = store_id and s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.stores s where s.id = store_id and s.user_id = (select auth.uid())));`
  },
  {
    name: 'notifications',
    category: 'Engagement & Temps Réel',
    reason: 'Aucune table pour stocker les notifications utilisateur (ex: "Votre colis #ORD-882 est expédié", "Nouveau message de l\'artisan", "Litige résolu en votre faveur").',
    businessImpact: 'Permet un centre de notifications dans la navbar et l\'intégration facile avec Supabase Realtime ou Firebase Cloud Messaging (FCM).',
    sqlMigration: `-- Table des notifications in-app
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null, -- 'order_shipped', 'order_delivered', 'new_message', 'dispute_update', 'payout'
  title text not null,
  body text not null,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id, read_at);
alter table public.notifications enable row level security;
create policy "users read own notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
create policy "users update own notifications" on public.notifications for update to authenticated using (user_id = (select auth.uid()));`
  },
  {
    name: 'audit_logs',
    category: 'Sécurité, Conformité & Administration',
    reason: 'Les décisions d\'arbitrage de litiges, suspensions de boutiques ou modérations de produits n\'ont pas de journal immuable traçant l\'administrateur responsable.',
    businessImpact: 'Essentiel pour la conformité légale, l\'audit des litiges financiers et la traçabilité interne.',
    sqlMigration: `-- Table de journalisation des actions administratives
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id),
  action text not null, -- 'dispute_resolved', 'store_suspended', 'review_deleted', 'payout_forced'
  target_type text not null, -- 'dispute', 'store', 'review', 'order'
  target_id text not null,
  reason text,
  metadata jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
create policy "admins view audit logs" on public.audit_logs for select to authenticated using (public.is_admin());`
  }
];

export const SPRING_BOOT_ARCHITECTURE_GUIDE = {
  version: 'Spring Boot 3.3+ (Java 21)',
  databaseDriver: 'PostgreSQL (Supabase Pooler: port 6543 / 5432)',
  keyDependencies: [
    'spring-boot-starter-data-jpa',
    'spring-boot-starter-web',
    'spring-boot-starter-security',
    'spring-boot-starter-validation',
    'io.jsonwebtoken:jjwt-api:0.12.5 (or Supabase JWT filter)',
    'org.postgresql:postgresql'
  ],
  entities: [
    {
      name: 'Store.java',
      table: 'stores',
      codeSnippet: `@Entity
@Table(name = "stores", schema = "public")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String name;

    private String address;

    @Column(name = "logo_path")
    private String logoPath;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StoreStatus status = StoreStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}`
    },
    {
      name: 'Order.java',
      table: 'orders',
      codeSnippet: `@Entity
@Table(name = "orders", schema = "public")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "store_id", nullable = false)
    private UUID storeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "mobile_money_number")
    private String mobileMoneyNumber;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}`
    }
  ]
};
