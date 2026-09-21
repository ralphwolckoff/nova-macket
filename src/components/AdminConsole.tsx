import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  TrendingUp, 
  Users, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Filter, 
  DollarSign, 
  Gavel, 
  Download, 
  Search, 
  Lock, 
  Server, 
  Database, 
  Activity,
  Trash2,
  Eye,
  MoreVertical,
  Key
} from 'lucide-react';
import { Seller, Order, Product, UserRole } from '../types';
import { DisputeArbitrageModal } from './DisputeArbitrageModal';
import { DatabaseSchemaView } from './DatabaseSchemaView';

interface AdminConsoleProps {
  sellers: Seller[];
  orders: Order[];
  products: Product[];
  onSelectSeller: (sellerId: string) => void;
  onBackToMarketplace: () => void;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  kycVerified: boolean;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  sellers,
  orders,
  products,
  onSelectSeller,
  onBackToMarketplace,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'catalog' | 'disputes' | 'database_schema' | 'infrastructure'>('database_schema');
  const [showArbitrageModal, setShowArbitrageModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: 'usr-1',
      name: 'Sophie Martin',
      email: 'sophie.martin@atelier-nova.fr',
      role: 'vendor',
      status: 'active',
      joinedDate: '12 Janv. 2024',
      kycVerified: true
    },
    {
      id: 'usr-2',
      name: 'Alexandre de S.',
      email: 'alexandre.des@gmail.com',
      role: 'client',
      status: 'active',
      joinedDate: '04 Mars 2024',
      kycVerified: true
    },
    {
      id: 'usr-3',
      name: 'Julien Faure',
      email: 'contact@faure-design.fr',
      role: 'vendor',
      status: 'active',
      joinedDate: '18 Avr. 2024',
      kycVerified: true
    },
    {
      id: 'usr-4',
      name: 'Marc T.',
      email: 'm.thierry@wanadoo.fr',
      role: 'client',
      status: 'active',
      joinedDate: '02 Mai 2024',
      kycVerified: false
    },
    {
      id: 'usr-5',
      name: 'Thomas Root',
      email: 'admin.root@novamarket.fr',
      role: 'admin',
      status: 'active',
      joinedDate: '01 Janv. 2023',
      kycVerified: true
    }
  ]);

  const handlePromoteAdmin = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
    setToastMessage("Utilisateur promu Super-Administrateur avec privilèges d'audit.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSuspend = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    setToastMessage("Statut de compte utilisateur mis à jour avec journalisation d'audit.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-surface-container-lowest border border-tertiary rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-tertiary shrink-0" />
          <span className="text-xs font-bold text-on-surface">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error text-on-error text-xs font-bold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              <span>Privilège ROOT · Super-Admin</span>
            </span>
            <span className="font-mono text-xs text-outline">
              Session ID: #SA-SESSION-99201
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
            Console de Gouvernance & Modération Super-Admin
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Supervision globale du catalogue, arbitrage souverain des litiges sous séquestre et contrôle d&apos;accès RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setToastMessage("Rapport d'audit global exporté au format JSON certifié.");
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export Audit Logs</span>
          </button>
          <button
            onClick={onBackToMarketplace}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer"
          >
            ← Retour à la Boutique
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">GMV Marketplace</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-on-surface">142 890 €</div>
          <div className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% ce mois
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Membres Actifs</span>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-on-surface">1 420</div>
          <div className="text-[11px] text-on-surface-variant">
            1 290 acheteurs · 130 vendeurs certifiés
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Catalogue Actif</span>
            <Package className="w-4 h-4 text-tertiary" />
          </div>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-on-surface">3 840</div>
          <div className="text-[11px] text-tertiary font-semibold">
            98.2% de produits conformes
          </div>
        </div>

        <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Alertes Opérationnelles</span>
            <AlertTriangle className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-secondary">2 litiges</div>
          <div className="text-[11px] text-secondary font-semibold">
            Séquestre conservatoire engagé
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('database_schema')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'database_schema'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Database className="w-4 h-4 text-secondary" />
          <span>Modèle Supabase & Spring Boot</span>
          <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
            16 Tables + 7 Suggérées
          </span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'disputes'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>Arbitrage Litiges & Séquestre</span>
          <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error text-[10px] font-mono font-bold">
            1
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestion des Utilisateurs & Rôles</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Modération du Catalogue</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'infrastructure'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/40'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Infrastructure & Journal d&apos;Audit</span>
        </button>
      </div>

      {/* TAB: DISPUTES & ESCROW ARBITRATION */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-title-lg font-bold text-base text-on-surface flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-primary" />
                  <span>Dossiers de Litiges en Attente de Jugement Souverain</span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Les fonds sont actuellement séquestrés sur Stripe Connect en attente de la sentence administrative.
                </p>
              </div>
            </div>

            {/* Dispute Card #LIT-2024-049 */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold uppercase">
                    Priorité Haute
                  </span>
                  <span className="font-mono font-bold text-xs text-primary">#LIT-2024-049</span>
                  <span className="text-xs text-on-surface-variant">· Commande #CMD-2024-8942</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface">
                  Article non conforme / Pièce céramique brisée à destination
                </h3>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span>Acheteur : <strong>Alexandre de S.</strong></span>
                  <span>Vendeur : <strong>Atelier Lumière Pro</strong></span>
                  <span>Montant séquestré : <strong className="font-mono text-primary font-bold">189,00 €</strong></span>
                </div>
              </div>

              <button
                onClick={() => setShowArbitrageModal(true)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
              >
                <Gavel className="w-4 h-4" />
                <span>Ouvrir l&apos;Arbitrage & Sentence</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS & RBAC */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher utilisateur par nom, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/60 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="h-10 px-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/60 cursor-pointer"
              >
                <option value="all">Tous les rôles Supabase</option>
                <option value="vendor">Vendeurs Artisans (vendor)</option>
                <option value="client">Acheteurs (client)</option>
                <option value="admin">Administrateurs (admin)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant">
                  <th className="pb-3 font-semibold">Utilisateur</th>
                  <th className="pb-3 font-semibold">Rôle (enum user_role)</th>
                  <th className="pb-3 font-semibold">Inscrit le</th>
                  <th className="pb-3 font-semibold text-center">KYC / Insee</th>
                  <th className="pb-3 font-semibold text-center">Statut</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50">
                    <td className="py-3.5">
                      <span className="font-bold text-on-surface block">{u.name}</span>
                      <span className="text-[11px] text-outline font-mono">{u.email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-error text-on-error'
                          : u.role === 'vendor'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {u.role === 'admin' ? 'Super-Admin' : u.role === 'vendor' ? 'Vendeur (vendor)' : 'Client (client)'}
                      </span>
                    </td>
                    <td className="py-3.5 text-on-surface-variant">{u.joinedDate}</td>
                    <td className="py-3.5 text-center">
                      {u.kycVerified ? (
                        <span className="inline-flex items-center gap-1 text-tertiary font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                        </span>
                      ) : (
                        <span className="text-outline text-[11px]">En attente</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'
                      }`}>
                        {u.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handlePromoteAdmin(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                          >
                            Promouvoir Admin
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleSuspend(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-on-tertiary'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CATALOG MODERATION */}
      {activeTab === 'catalog' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="font-title-lg font-bold text-base text-on-surface">
            Articles & Contrôle de Conformité des Boutiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-on-surface block truncate max-w-[200px]">{p.title}</span>
                    <span className="text-[11px] text-outline">{p.sellerName} · {p.price.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    Approuvé
                  </span>
                  <button
                    onClick={() => {
                      setToastMessage(`Article "${p.title}" retiré du catalogue public.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="p-1.5 rounded-lg text-outline hover:text-error cursor-pointer"
                    title="Désactiver"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: INFRASTRUCTURE & AUDIT LOGS */}
      {activeTab === 'infrastructure' && (
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] text-on-surface-variant font-semibold">Core API Backend</span>
              <div className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
                <span>Express / Node.js 100% UP</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] text-on-surface-variant font-semibold">Cluster Base de Données</span>
              <div className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span>PostgreSQL Replication OK</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1">
              <span className="text-[11px] text-on-surface-variant font-semibold">Sessions JWT Actives</span>
              <div className="text-sm font-bold font-mono text-on-surface">412 sessions en cours</div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-xs text-on-surface">Journal d&apos;Audit de Sécurité Live</h3>
            <div className="space-y-1.5 font-mono text-[11px] p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
              <div className="flex gap-3 text-tertiary">
                <span className="text-outline">14:32:10</span>
                <span>[PAYOUT_ESCROW_RELEASE] Libération séquestre #ESC-99201 exécutée avec succès (189.00 €)</span>
              </div>
              <div className="flex gap-3 text-primary">
                <span className="text-outline">14:15:02</span>
                <span>[ROLE_UPDATE_TRIGGER] Utilisateur #usr-1 vérifié KYC niveau 3 par Insee Direct</span>
              </div>
              <div className="flex gap-3 text-outline">
                <span className="text-outline">13:58:44</span>
                <span>[PRODUCT_APPROVED] Publication immédiate #prod-102 dans Mobilier Minimaliste</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SUPABASE SCHEMA & SPRING BOOT ARCHITECTURE */}
      {activeTab === 'database_schema' && (
        <DatabaseSchemaView 
          onCopyNotice={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }} 
        />
      )}

      {/* Dispute Arbitrage Modal */}
      <DisputeArbitrageModal
        isOpen={showArbitrageModal}
        onClose={() => setShowArbitrageModal(false)}
        onArbitrationExecuted={(decision, amount, note) => {
          setToastMessage(`Arbitrage exécuté : ${amount} € débloqués conformément à la décision.`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
};
