import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building, 
  Lock, 
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { Order, Seller } from '../types';

interface SellerFinancesViewProps {
  currentSeller: Seller;
  orders: Order[];
}

export const SellerFinancesView: React.FC<SellerFinancesViewProps> = ({
  currentSeller,
  orders,
}) => {
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [showInvoiceToast, setShowInvoiceToast] = useState(false);

  // Financial calculations
  const sellerOrders = orders.filter(o => o.packages.some(pkg => pkg.sellerId === currentSeller.id));
  const rawRevenue = sellerOrders.reduce((sum, ord) => {
    const pkg = ord.packages.find(p => p.sellerId === currentSeller.id);
    return sum + (pkg ? pkg.subtotal : 0);
  }, 0);

  const availableBalance = Math.max(3420.50, rawRevenue * 0.7);
  const escrowLocked = 1890.00;
  const monthlyRevenue = 8450.00;
  const commissionPaid = monthlyRevenue * 0.10;

  const handleInstantPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
    }, 4000);
  };

  const handleDownloadReport = () => {
    setShowInvoiceToast(true);
    setTimeout(() => setShowInvoiceToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {showInvoiceToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-surface-container-lowest border border-tertiary rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-tertiary shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-on-surface block">Relevé fiscal généré avec succès</span>
            <span className="text-on-surface-variant">Téléchargement du fichier Releve_Fiscal_Q2_2025.pdf en cours...</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>NovaEscrow™ Protection des Paiements Marchands</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Revenus & Versements
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Gérez vos fonds, suivez le cycle de libération du séquestre et planifiez vos virements bancaires automatisés.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Relevé fiscal & Factures</span>
          </button>
          <button
            onClick={handleInstantPayout}
            disabled={payoutRequested}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{payoutRequested ? 'Demande envoyée...' : 'Demander un virement anticipé'}</span>
          </button>
        </div>
      </div>

      {payoutRequested && (
        <div className="p-4 rounded-xl bg-surface-container-high border border-primary text-xs text-on-surface flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <div>
            <strong className="block font-bold">Ordre de virement SEPA instantané initié !</strong>
            <span>La somme de 3 420,50 € a été transmise au réseau bancaire européen. Crédit effectif sous 10 à 30 secondes sur votre compte BNP Paribas.</span>
          </div>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Solde Disponible</span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-primary">
              {availableBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
            <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Prêt à être viré
            </span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[11px] text-on-surface-variant">
            Automatiquement versé chaque lundi vers FR76 •••• 8942
          </div>
        </div>

        {/* Card 2: Escrow Locked */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Séquestre Garanti (NovaEscrow)</span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-secondary">
              {escrowLocked.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-secondary" /> 5 commandes en transit
            </span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[11px] text-on-surface-variant">
            Libéré dès livraison certifiée par le transporteur
          </div>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">CA Brut Mensuel</span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-on-surface">
              {monthlyRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
            <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs mois précédent
            </span>
          </div>
          <div className="pt-2 border-t border-surface-container">
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
              <span>Objectif 10 000 €</span>
              <span className="font-bold font-mono">84.5%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-tertiary rounded-full w-[84.5%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Platform Fees */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">Commissions Plateforme (10%)</span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-outline">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-bold text-2xl sm:text-3xl text-outline">
              -{commissionPaid.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium block mt-1">
              Taux fixe sans frais cachés
            </span>
          </div>
          <div className="pt-2 border-t border-surface-container text-[11px] text-tertiary font-semibold">
            Frais bancaires Stripe inclus à 100%
          </div>
        </div>
      </div>

      {/* 4-Step NovaEscrow Cycle */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title-lg font-bold text-base text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Cycle de Séquestre & Déblocage des Fonds NovaEscrow™</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Vos paiements sont garantis à 100% dès la commande du client et protégés contre les impayés.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Compte Vérifié Tier 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 relative flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-[10px] font-mono text-outline font-semibold">J+0</span>
            </div>
            <h3 className="font-bold text-xs text-on-surface">Achat Client</h3>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              L&apos;acheteur règle son panier par Carte, Apple Pay ou Virement. Les fonds sont validés par 3D Secure.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 relative flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-[10px] font-mono text-secondary font-semibold">Immédiat</span>
            </div>
            <h3 className="font-bold text-xs text-on-surface">Séquestre Stripe</h3>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              100% de la somme est isolée sur votre compte séquestre nominatif. Ni la marketplace ni la banque ne peuvent y toucher.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 relative flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-[10px] font-mono text-outline font-semibold">Transit</span>
            </div>
            <h3 className="font-bold text-xs text-on-surface">Livraison Confirmée</h3>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              Le colis est scanné livré par Colissimo/Chronopost ou l&apos;acheteur valide manuellement la conformité.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-surface-container-high border border-tertiary/40 relative flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary text-xs font-bold flex items-center justify-center">4</span>
              <span className="text-[10px] font-mono text-tertiary font-bold">J+1</span>
            </div>
            <h3 className="font-bold text-xs text-on-surface">Déblocage Automatique</h3>
            <p className="text-[11px] text-on-surface-variant leading-snug">
              Les fonds passent instantanément en « Solde Disponible » et sont versés sur votre compte IBAN au prochain cycle.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column: SEPA Transfers & Stripe Connect KYC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Transfers history */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Historique des Virements & Versements SEPA
            </h2>
            <span className="text-xs text-on-surface-variant">Derniers 30 jours</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant">
                  <th className="pb-3 font-semibold">Réf. Virement (Table payouts)</th>
                  <th className="pb-3 font-semibold">Fournisseur</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Destination</th>
                  <th className="pb-3 font-semibold text-right">Montant Net</th>
                  <th className="pb-3 font-semibold text-center">Statut (payout_status)</th>
                  <th className="pb-3 font-semibold text-right">Justificatif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-primary">#VIR-2024-1108</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      Stripe
                    </span>
                  </td>
                  <td className="py-3.5 text-on-surface-variant">13 Mai 2024</td>
                  <td className="py-3.5 font-mono">BNP Paribas •••• 4412</td>
                  <td className="py-3.5 font-mono font-bold text-right text-on-surface">2 140,80 €</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={handleDownloadReport}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reçu PDF
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-primary">#VIR-2024-1099</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                      Campay
                    </span>
                  </td>
                  <td className="py-3.5 text-on-surface-variant">10 Mai 2024</td>
                  <td className="py-3.5 font-mono">MTN MoMo +237 6•• •• •• 88</td>
                  <td className="py-3.5 font-mono font-bold text-right text-secondary">850 000 XAF</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={handleDownloadReport}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reçu PDF
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-primary">#VIR-2024-1072</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      Stripe
                    </span>
                  </td>
                  <td className="py-3.5 text-on-surface-variant">06 Mai 2024</td>
                  <td className="py-3.5 font-mono">BNP Paribas •••• 4412</td>
                  <td className="py-3.5 font-mono font-bold text-right text-on-surface">1 850,20 €</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={handleDownloadReport}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reçu PDF
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-primary">#VIR-2024-1014</td>
                  <td className="py-3.5 text-on-surface-variant">29 Avril 2024</td>
                  <td className="py-3.5 font-mono">BNP Paribas •••• 4412</td>
                  <td className="py-3.5 font-mono font-bold text-right text-on-surface">3 120,00 €</td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Exécuté
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button 
                      onClick={handleDownloadReport}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Reçu PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Stripe Connect KYC */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Compte & Conformité
            </h2>
            <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold">
              Certifié
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <Building className="w-4 h-4 text-primary" />
              <span>Stripe Connect Custom Marchand</span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Titulaire :</span>
                <span className="font-semibold text-on-surface">{currentSeller.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">IBAN associé :</span>
                <span className="font-mono text-on-surface">FR76 •••• 8942</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">BIC :</span>
                <span className="font-mono text-on-surface">BNPAFR22XXX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Périodicité :</span>
                <span className="font-semibold text-on-surface">Chaque lundi (06h00)</span>
              </div>
            </div>

            <button
              onClick={() => alert("Portail Stripe Connect sécurisé : redirection vers la modification des coordonnées bancaires.")}
              className="w-full py-2 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer"
            >
              Modifier les coordonnées bancaires
            </button>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              Vos informations d&apos;identité et fiscales sont vérifiées conformément à la directive européenne DAC7.
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders & Escrow breakdown table */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title-lg font-bold text-base text-on-surface">
              Détail des Transactions Récentes & Statut du Séquestre
            </h2>
            <p className="text-xs text-on-surface-variant">
              Ventilation exacte de chaque commande, déduction de commission et état de libération.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-container text-on-surface-variant">
                <th className="pb-3 font-semibold">N° Commande</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Montant Brut</th>
                <th className="pb-3 font-semibold text-right">Commission (10%)</th>
                <th className="pb-3 font-semibold text-right">NovaProtect</th>
                <th className="pb-3 font-semibold text-right">Net Marchand</th>
                <th className="pb-3 font-semibold text-center">Statut Séquestre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              <tr className="hover:bg-surface-container-low/50">
                <td className="py-3 font-mono font-bold text-primary">#CMD-2024-8942</td>
                <td className="py-3 text-on-surface-variant">Aujourd&apos;hui, 14:15</td>
                <td className="py-3 font-mono font-semibold text-right">189,00 €</td>
                <td className="py-3 font-mono text-outline text-right">-18,90 €</td>
                <td className="py-3 font-mono text-tertiary text-right">0,00 € (Offert)</td>
                <td className="py-3 font-mono font-bold text-right text-primary">170,10 €</td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    <Clock className="w-3 h-3" /> En attente de livraison
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50">
                <td className="py-3 font-mono font-bold text-primary">#CMD-2024-8890</td>
                <td className="py-3 text-on-surface-variant">Hier, 19:40</td>
                <td className="py-3 font-mono font-semibold text-right">340,00 €</td>
                <td className="py-3 font-mono text-outline text-right">-34,00 €</td>
                <td className="py-3 font-mono text-tertiary text-right">0,00 € (Offert)</td>
                <td className="py-3 font-mono font-bold text-right text-tertiary">306,00 €</td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Fonds libérés
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low/50">
                <td className="py-3 font-mono font-bold text-primary">#CMD-2024-8812</td>
                <td className="py-3 text-on-surface-variant">12 Mai, 11:22</td>
                <td className="py-3 font-mono font-semibold text-right">149,00 €</td>
                <td className="py-3 font-mono text-outline text-right">-14,90 €</td>
                <td className="py-3 font-mono text-tertiary text-right">0,00 € (Offert)</td>
                <td className="py-3 font-mono font-bold text-right text-tertiary">134,10 €</td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Fonds libérés
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
