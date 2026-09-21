import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Server, 
  Key, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { RECOMMENDED_MISSING_TABLES, SPRING_BOOT_ARCHITECTURE_GUIDE } from '../data/schemaSuggestions';

interface DatabaseSchemaViewProps {
  onCopyNotice?: (msg: string) => void;
}

export const DatabaseSchemaView: React.FC<DatabaseSchemaViewProps> = ({ onCopyNotice }) => {
  const [activeSubTab, setActiveSubTab] = useState<'existing' | 'suggestions' | 'springboot' | 'connection'>('suggestions');
  const [copiedSql, setCopiedSql] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>('orders');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>('coupons');

  const existingTables = [
    {
      name: 'profiles',
      desc: 'Comptes utilisateurs avec rôles RBAC (client, vendor, admin)',
      pk: 'id (uuid, fk auth.users)',
      columns: ['id', 'email', 'role', 'first_name', 'last_name', 'photo_url', 'bio', 'phone_number', 'onboarding_completed', 'created_at', 'updated_at'],
      rls: 'profiles read own, profiles update own, admins read profiles'
    },
    {
      name: 'stores',
      desc: 'Boutiques marchandes multi-vendeurs avec statut (draft, active, past_due, suspended)',
      pk: 'id (uuid)',
      columns: ['id', 'user_id (fk profiles)', 'name', 'address', 'logo_path', 'description', 'status', 'created_at', 'updated_at'],
      rls: 'stores public active, store owner creates, store owner updates'
    },
    {
      name: 'subscription_plans',
      desc: 'Grille tarifaire des abonnements boutiques marchandes en XAF (FCFA)',
      pk: 'id (uuid)',
      columns: ['id', 'code', 'name', 'description', 'amount_xaf', 'stripe_price_id', 'interval_months', 'is_active', 'created_at'],
      rls: 'plans public'
    },
    {
      name: 'store_subscriptions',
      desc: 'Abonnements actifs par boutique (Stripe ou Campay Mobile Money)',
      pk: 'id (uuid)',
      columns: ['id', 'store_id', 'plan_id', 'provider', 'provider_customer_id', 'provider_subscription_id', 'status', 'current_period_start', 'current_period_end', 'cancel_at_period_end', 'created_at', 'updated_at'],
      rls: 'subscriptions owner reads'
    },
    {
      name: 'categories',
      desc: 'Catégories de produits rattachées aux boutiques',
      pk: 'id (uuid)',
      columns: ['id', 'store_id (fk stores)', 'name', 'created_at', 'updated_at'],
      rls: 'categories public, category owner writes'
    },
    {
      name: 'products',
      desc: 'Catalogue articles avec prix numeric(12,2), stock entier et archivage logique',
      pk: 'id (uuid)',
      columns: ['id', 'store_id (fk stores)', 'category_id', 'name', 'price', 'stock', 'description', 'is_featured', 'is_archived', 'created_at', 'updated_at'],
      rls: 'products public (si non archivé), product owner writes (si boutique active)'
    },
    {
      name: 'images',
      desc: 'Galerie visuelle des produits (liée au bucket storage product-images)',
      pk: 'id (uuid)',
      columns: ['id', 'product_id (fk products)', 'url', 'alt_text', 'created_at'],
      rls: 'images public, image owner writes'
    },
    {
      name: 'addresses',
      desc: 'Adresses postales de livraison clients',
      pk: 'id (uuid)',
      columns: ['id', 'user_id (fk profiles)', 'street', 'city', 'state', 'zip_code', 'created_at', 'updated_at'],
      rls: 'addresses own'
    },
    {
      name: 'orders',
      desc: 'Commandes générées par boutique avec numéro ORD-... et tracking Mobile Money',
      pk: 'id (uuid)',
      columns: ['id', 'order_number', 'user_id', 'store_id', 'address_id', 'status', 'total_amount', 'shipping_address', 'payment_method', 'mobile_money_number', 'created_at', 'updated_at'],
      rls: 'orders owner or store owner, admins read orders'
    },
    {
      name: 'order_items',
      desc: 'Lignes de commande avec quantité et prix fixé au moment de l\'achat',
      pk: 'id (uuid)',
      columns: ['id', 'order_id (fk orders)', 'product_id (fk products)', 'quantity', 'price_at_order'],
      rls: 'items order owner or store owner'
    },
    {
      name: 'reviews',
      desc: 'Avis vérifiés avec note (1 à 5), statut (published, hidden, pending)',
      pk: 'id (uuid)',
      columns: ['id', 'product_id', 'store_id', 'author_id', 'order_id', 'rating', 'title', 'content', 'status', 'created_at', 'updated_at'],
      rls: 'published reviews are public, buyers create reviews, review owners update'
    },
    {
      name: 'conversations & messages',
      desc: 'Messagerie directe acheteur-vendeur liée optionnellement à une commande',
      pk: 'id (uuid)',
      columns: ['buyer_id', 'seller_id', 'store_id', 'order_id', 'body', 'read_at', 'created_at'],
      rls: 'conversation participants read / send'
    },
    {
      name: 'disputes',
      desc: 'Litiges financiers et contentieux d\'arbitrage avec numéro LIT-... et séquestre',
      pk: 'id (uuid)',
      columns: ['id', 'dispute_number', 'order_id', 'opened_by_id', 'reason', 'evidence_paths', 'status', 'arbitrated_by_id', 'arbitration_notes', 'resolved_at', 'created_at'],
      rls: 'dispute participants read, buyers open disputes, admins read disputes'
    },
    {
      name: 'payouts',
      desc: 'Reversements financiers marchands (Campay XAF ou Stripe) avec statut de paiement',
      pk: 'id (uuid)',
      columns: ['id', 'store_id', 'subscription_id', 'amount', 'currency (default XAF)', 'provider', 'provider_payout_id', 'status', 'scheduled_at', 'paid_at', 'created_at'],
      rls: 'store owners read payouts'
    },
    {
      name: 'promotions',
      desc: 'Ventes flash et campagnes de réduction broadcast sur un produit donné avec deadline',
      pk: 'id (uuid)',
      columns: ['id', 'store_id', 'product_name', 'message_title', 'message_content', 'discount_percentage', 'final_price', 'deadline', 'created_at', 'updated_at'],
      rls: 'promotions public read (deadline >= now()), promotion owner writes'
    },
    {
      name: 'payment_events',
      desc: 'Webhooks de paiement Stripe & Campay avec signature et payload JSONB immuable',
      pk: 'id (uuid)',
      columns: ['id', 'provider', 'provider_event_id', 'subscription_id', 'event_type', 'payload (jsonb)', 'received_at'],
      rls: 'admins read payment events, apply_subscription_event() security definer'
    }
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(label);
    if (onCopyNotice) onCopyNotice(`${label} copié dans le presse-papier !`);
    setTimeout(() => setCopiedSql(null), 2500);
  };

  const getAllSuggestedSql = () => {
    return `-- ============================================================================
-- MIGRATIONS SUGGÉRÉES POUR COMPLÉTER LE SCHÉMA NOVAMARKET
-- À exécuter dans le SQL Editor Supabase ou via Flyway / Liquibase Spring Boot
-- ============================================================================

` + RECOMMENDED_MISSING_TABLES.map(t => `-- ${t.name.toUpperCase()} : ${t.reason}\n${t.sqlMigration}\n`).join('\n');
  };

  const handleDownloadSql = () => {
    const element = document.createElement('a');
    const file = new Blob([getAllSuggestedSql()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'V2__novamarket_suggested_extensions.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold mb-2">
            <Database className="w-4 h-4 text-secondary" />
            <span>Architecture Supabase PostgreSQL & Spring Boot 3.x</span>
          </div>
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">
            Modèle de Données & Recommandations d&apos;Évolution
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl">
            L&apos;application est alignée avec les 16 tables Supabase existantes (XAF, Campay, Stripe, Litiges, Ventes Flash). 
            Découvrez ci-dessous les extensions indispensables pour un marketplace e-commerce complet.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleCopy(getAllSuggestedSql(), 'Toutes les migrations SQL')}
            className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSql === 'Toutes les migrations SQL' ? (
              <>
                <Check className="w-4 h-4 text-tertiary" />
                <span>SQL Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-primary" />
                <span>Copier les Migrations</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSql}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger .SQL</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('suggestions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'suggestions'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>7 Tables Manquantes Suggérées</span>
          <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
            Prioritaire
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('existing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'existing'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>16 Tables Actuelles Déployées</span>
          <span className="text-[10px] opacity-75 font-mono">OK</span>
        </button>

        <button
          onClick={() => setActiveSubTab('springboot')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'springboot'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Entités & Contrôleurs Spring Boot</span>
        </button>

        <button
          onClick={() => setActiveSubTab('connection')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'connection'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Connexion API & Variables d&apos;Env</span>
        </button>
      </div>

      {/* TAB 1: SUGGESTIONS POUR TABLES MANQUANTES */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="text-xs text-on-surface-variant space-y-1">
              <span className="font-bold text-on-surface block">Pourquoi ces tables sont indispensables pour votre Marketplace :</span>
              <p>
                Votre base Supabase actuelle gère parfaitement les comptes, les commandes, les litiges et les ventes flash unitaires.
                Cependant, un marketplace en production nécessite des fonctionnalités critiques d&apos;expérience client (codes promo panier, variantes de taille/couleur, favoris multi-appareils, coordonnées de retrait Mobile Money pour les marchands).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {RECOMMENDED_MISSING_TABLES.map((table) => {
              const isExpanded = expandedSuggestion === table.name;
              return (
                <div 
                  key={table.name} 
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs overflow-hidden transition-all"
                >
                  <div 
                    onClick={() => setExpandedSuggestion(isExpanded ? null : table.name)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        <Table className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-on-surface">public.{table.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-bold">
                            {table.category}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                          {table.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(table.sqlMigration, `Migration public.${table.name}`);
                        }}
                        className="p-2 rounded-lg hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
                        title="Copier le script SQL"
                      >
                        {copiedSql === `Migration public.${table.name}` ? (
                          <Check className="w-4 h-4 text-tertiary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-outline" /> : <ChevronRight className="w-4 h-4 text-outline" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-surface-container bg-surface-container-low/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-3">
                        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
                          <span className="font-bold text-on-surface block mb-1">Raison du besoin :</span>
                          <span className="text-on-surface-variant">{table.reason}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
                          <span className="font-bold text-on-surface block mb-1">Impact Métier & ROI :</span>
                          <span className="text-on-surface-variant">{table.businessImpact}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-primary" />
                            <span>Script DDL PostgreSQL & RLS prêt à l&apos;emploi :</span>
                          </span>
                          <button
                            onClick={() => handleCopy(table.sqlMigration, `Migration public.${table.name}`)}
                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copier ce bloc</span>
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-[11px] overflow-x-auto leading-relaxed border border-outline-variant/40">
                          {table.sqlMigration}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TABLES ACTUELLES DU SCHÉMA */}
      {activeSubTab === 'existing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingTables.map((tbl) => {
              const isExp = expandedTable === tbl.name;
              return (
                <div 
                  key={tbl.name}
                  className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-primary" />
                      <span className="font-mono font-bold text-xs text-on-surface">public.{tbl.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      PK: {tbl.pk}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {tbl.desc}
                  </p>

                  <div className="pt-2 border-t border-surface-container text-[11px] space-y-1">
                    <div>
                      <span className="font-semibold text-on-surface">Colonnes : </span>
                      <span className="font-mono text-outline">{tbl.columns.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface">Sécurité RLS : </span>
                      <span className="text-tertiary font-semibold">{tbl.rls}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ARCHITECTURE SPRING BOOT */}
      {activeSubTab === 'springboot' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-6">
          <div>
            <h3 className="font-title-lg font-bold text-base text-on-surface">
              Guide d&apos;Intégration Backend Spring Boot 3.3+ (Java 21)
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Voici comment structurer vos entités JPA pour qu&apos;elles s&apos;interfacent directement sur votre base de données Supabase PostgreSQL sans aucun conflit de schéma.
            </p>
          </div>

          <div className="space-y-4">
            {SPRING_BOOT_ARCHITECTURE_GUIDE.entities.map((ent) => (
              <div key={ent.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-primary flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{ent.name} (table &quot;{ent.table}&quot;)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(ent.codeSnippet, ent.name)}
                    className="text-xs text-on-surface-variant hover:text-primary font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier l&apos;Entité Java</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {ent.codeSnippet}
                </pre>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-2">
            <span className="font-bold text-xs text-on-surface block">
              Configuration application.yml pour Spring Boot + Supabase Pooler :
            </span>
            <pre className="p-3 rounded-lg bg-surface-container-lowest font-mono text-[11px] text-on-surface overflow-x-auto border border-outline-variant/40">
{`spring:
  datasource:
    url: jdbc:postgresql://aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
    username: postgres.[VOTRE_PROJECT_REF]
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
  jpa:
    hibernate:
      ddl-auto: validate # Valide strictement le schéma Supabase existant sans altération
    properties:
      hibernate:
        default_schema: public
        dialect: org.hibernate.dialect.PostgreSQLDialect`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CONNEXION & ENV VARIABLES */}
      {activeSubTab === 'connection' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-5">
          <div>
            <h3 className="font-title-lg font-bold text-base text-on-surface">
              Variables d&apos;Environnement pour le Frontend NovaMarket
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Pour basculer du stockage de test résilient vers votre vrai backend Spring Boot ou directement Supabase, définissez ces variables :
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-3 font-mono text-xs">
            <div>
              <span className="text-primary font-bold">VITE_API_BASE_URL</span>
              <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                URL de votre API Spring Boot (ex: <code className="font-mono">http://localhost:8080/api/v1</code> ou votre serveur Cloud Run).
              </p>
            </div>

            <div>
              <span className="text-primary font-bold">VITE_SUPABASE_URL</span>
              <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                URL de votre projet Supabase (ex: <code className="font-mono">https://xyzcompany.supabase.co</code>).
              </p>
            </div>

            <div>
              <span className="text-primary font-bold">VITE_SUPABASE_ANON_KEY</span>
              <p className="text-[11px] text-on-surface-variant font-sans mt-0.5">
                Clé publique anonyme Supabase pour l&apos;authentification et l&apos;accès direct PostgREST.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-tertiary animate-pulse" />
              <div>
                <span className="font-bold text-xs text-on-surface block">État du Mode Données :</span>
                <span className="text-xs text-on-surface-variant">Prêt pour réception backend Spring Boot & Supabase (Repository Actif)</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
              Opérationnel
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
