import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  RotateCcw,
  Building2,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Download,
  Send,
  ExternalLink,
  ChevronRight,
  Scale,
  BadgeCheck,
  UserCheck
} from 'lucide-react';
import { LegalTab } from '../types';

interface LegalViewProps {
  initialTab?: LegalTab;
  onOpenCookiePreferences?: () => void;
  onBackToMarketplace?: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  initialTab = 'terms',
  onOpenCookiePreferences,
  onBackToMarketplace,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Withdrawal form state (Formulaire type de rétractation)
  const [withdrawalOrderNumber, setWithdrawalOrderNumber] = useState('');
  const [withdrawalDate, setWithdrawalDate] = useState(new Date().toISOString().split('T')[0]);
  const [withdrawalClientName, setWithdrawalClientName] = useState('');
  const [withdrawalClientEmail, setWithdrawalClientEmail] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalProducts, setWithdrawalProducts] = useState('');
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);

  // RGPD rights request form state
  const [dpoRequestType, setDpoRequestType] = useState<'access' | 'rectification' | 'erasure' | 'portability'>('access');
  const [dpoName, setDpoName] = useState('');
  const [dpoEmail, setDpoEmail] = useState('');
  const [dpoDetails, setDpoDetails] = useState('');
  const [dpoSubmitted, setDpoSubmitted] = useState(false);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalOrderNumber || !withdrawalClientEmail) return;
    setWithdrawalSubmitted(true);
  };

  const handleDpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpoName || !dpoEmail) return;
    setDpoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface-container-low/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-on-surface-variant">
            {onBackToMarketplace && (
              <button
                type="button"
                onClick={onBackToMarketplace}
                className="hover:text-primary transition-colors cursor-pointer font-medium"
              >
                Marketplace
              </button>
            )}
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-on-surface">Centre Juridique, RGPD & Conformité</span>
          </nav>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/40 flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>Conformité Droit Français & RGPD</span>
          </span>
        </div>

        {/* Header Title */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-headline-lg font-bold text-2xl sm:text-3xl text-on-surface">
                Centre de Conformité Légale & Données Personnelles
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Transparence totale, protection de vos droits consommateurs (Code de la consommation) et respect rigoureux du RGPD.
              </p>
            </div>
          </div>

          {/* Quick nav tabs */}
          <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CGU / CGV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Confidentialité & RGPD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cookies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cookies'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Cookie className="w-4 h-4" />
              <span>Politique de Cookies</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('refund')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'refund'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rétractation & Retours</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('legal_notices')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'legal_notices'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Mentions Légales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dpo_form')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dpo_form'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Exercer mes Droits RGPD</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Conditions Générales (CGU / CGV) */}
        {activeTab === 'terms' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4">
              <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                Conditions Générales d&apos;Utilisation et de Vente (CGU / CGV)
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Dernière mise à jour : 1er Janvier 2025 · Applicable aux utilisateurs et acheteurs de NovaMarket
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                1. Préambule et Rôle de la Marketplace NovaMarket
              </h3>
              <p>
                La plateforme <strong>NovaMarket</strong> (éditée par NovaMarket SAS) est une place de marché en ligne (marketplace) mettant en relation des vendeurs tiers indépendants (artisans, créateurs et boutiques certifiés) et des acheteurs consommateurs ou professionnels.
              </p>
              <p>
                NovaMarket agit en tant qu&apos;<strong>intermédiaire technique et tiers de confiance</strong>. Le contrat de vente pour chaque produit est conclu directement entre l&apos;Acheteur et le Vendeur concerné. NovaMarket garantit toutefois la sécurité des transactions et la médiation par son protocole de séquestre <strong>NovaTrust</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                2. Commandes et Formation du Contrat
              </h3>
              <p>
                Conformément à l&apos;article 1127-2 du Code civil français, la commande fait l&apos;objet d&apos;un processus de double-clic de validation :
              </p>
              <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-2">
                <li>Premier clic : Vérification du récapitulatif détaillé du panier (articles, prix TTC, frais de livraison, adresse de livraison).</li>
                <li>Deuxième clic : Confirmation de la commande et acceptation expresse des présentes CGU/CGV valant obligation de paiement.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                3. Prix, TVA et Transparence Tarifaire
              </h3>
              <p>
                Tous les prix sont affichés en Euros (€) Toutes Taxes Comprises (TTC), incluant la TVA française ou européenne applicable au jour de la commande, ainsi que les éco-contributions environnementales éventuelles. Les frais de livraison sont distinctement mentionnés avant toute validation définitive du panier.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                4. Paiements Sécurisés et Séquestre de Confiance (NovaTrust)
              </h3>
              <p>
                Les paiements sont traités par des prestataires de services de paiement agréés et certifiés <strong>PCI-DSS Niveau 1</strong> (Stripe pour les cartes bancaires et Campay pour le Mobile Money).
              </p>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-primary text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Séquestre NovaTrust (Escrow de Sécurité)</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Les fonds versés par l&apos;acheteur sont conservés sur un compte séquestre dédié jusqu&apos;à la confirmation de livraison par le transporteur ou à l&apos;issue du délai légal de rétractation de 14 jours, assurant une protection totale contre les fraudes et non-réceptions.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                5. Garanties Légales (Code de la Consommation & Code Civil)
              </h3>
              <p>
                L&apos;acheteur bénéficie de plein droit des garanties légales obligatoires accordées par la loi française :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1.5">
                  <h4 className="font-bold text-xs text-on-surface">
                    Garantie Légale de Conformité (Art. L. 217-3 et s. Code de la conso)
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Durée légale de <strong>2 ans</strong> à compter de la délivrance du bien. Permet la réparation ou le remplacement du bien sans aucun frais, ou à défaut le remboursement.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1.5">
                  <h4 className="font-bold text-xs text-on-surface">
                    Garantie des Vices Cachés (Art. 1641 et s. Code civil)
                  </h4>
                  <p className="text-xs text-on-surface-variant">
                    Délai d&apos;action de <strong>2 ans</strong> à compter de la découverte du vice caché rendant le bien impropre à l&apos;usage auquel on le destine.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                6. Médiation des Litiges de la Consommation
              </h3>
              <p>
                Conformément aux articles L. 612-1 et suivants du Code de la consommation, en cas de litige non résolu à l&apos;amiable avec un vendeur ou avec la plateforme, l&apos;acheteur a le droit de recourir gratuitement au service de médiation de la consommation :
              </p>
              <p className="text-xs font-semibold text-secondary">
                Médiateur du Commerce Électronique FEVAD · 60 rue la Boétie, 75008 Paris · Plateforme européenne RLL : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">ec.europa.eu/consumers/odr <ExternalLink className="w-3 h-3" /></a>
              </p>
            </section>
          </article>
        )}

        {/* Tab 2: Politique de Confidentialité & RGPD */}
        {activeTab === 'privacy' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4">
              <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                Politique de Confidentialité & Protection des Données (RGPD)
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Conforme au Règlement Général sur la Protection des Données (UE 2016/679) et à la Loi Informatique et Libertés
              </p>
            </div>

            {/* Minimization badge */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                  Engagement Fondamental de Minimisation des Données (Art. 5.1.c RGPD)
                </h4>
                <p className="text-emerald-800 dark:text-emerald-300">
                  NovaMarket ne collecte et ne traite <strong>strictement que les données indispensables</strong> à l&apos;exécution de vos commandes, à la livraison des colis et au respect de nos obligations légales comptables. Vos données personnelles ne sont <strong>jamais revendues</strong> à des tiers ou courtiers de données.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                1. Responsable de Traitement et Coordonnées DPO
              </h3>
              <p>
                Le responsable du traitement des données personnelles est la société <strong>NovaMarket SAS</strong>, immatriculée au RCS de Paris sous le numéro 891 034 912, dont le siège social est situé au 14 Rue des Céramistes, 75011 Paris, France.
              </p>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-on-surface">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@novamarket.fr" className="text-primary hover:underline">dpo@novamarket.fr</a></span>
                </div>
                <p className="text-on-surface-variant">
                  Adresse postale : NovaMarket - À l&apos;attention du DPO, 14 Rue des Céramistes, 75011 Paris.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                2. Données Collectées & Finalités du Traitement
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-outline-variant/60 rounded-xl overflow-hidden">
                  <thead className="bg-surface-container text-on-surface font-bold">
                    <tr>
                      <th className="p-3 border-b border-outline-variant/60">Finalité</th>
                      <th className="p-3 border-b border-outline-variant/60">Données strictement nécessaires</th>
                      <th className="p-3 border-b border-outline-variant/60">Base Légale</th>
                      <th className="p-3 border-b border-outline-variant/60">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 bg-surface-container-lowest">
                    <tr>
                      <td className="p-3 font-semibold">Création de compte et authentification</td>
                      <td className="p-3">Email, mot de passe chiffré (hashé), prénom/nom</td>
                      <td className="p-3">Exécution du contrat (Art. 6.1.b RGPD)</td>
                      <td className="p-3">Durée de vie du compte + 3 ans d&apos;inactivité</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Gestion de commande et livraison</td>
                      <td className="p-3">Nom, prénom, adresse postale de livraison, numéro de téléphone (uniquement pour le livreur)</td>
                      <td className="p-3">Exécution du contrat d&apos;achat</td>
                      <td className="p-3">Durée de la relation commerciale + 5 ans (prescription civile)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Facturation et obligations fiscales</td>
                      <td className="p-3">Historique des transactions, montant, coordonnées de facturation</td>
                      <td className="p-3">Obligation légale (Art. L. 123-22 Code de commerce)</td>
                      <td className="p-3 font-bold text-secondary">10 ans (obligation légale comptable)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Paiement sécurisé</td>
                      <td className="p-3">Traitées exclusivement par Stripe / Campay (PCI-DSS). NovaMarket ne conserve aucun numéro de carte.</td>
                      <td className="p-3">Exécution du contrat</td>
                      <td className="p-3">Durée du règlement + archivage antifraude</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                3. Destinataires des Données
              </h3>
              <p>
                Les données sont exclusivement transmises :
              </p>
              <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-2">
                <li>Au <strong>vendeur partenaire</strong> auprès duquel vous commandez (uniquement les données nécessaires à la préparation du colis).</li>
                <li>Aux <strong>transporteurs agréés</strong> (Colissimo, Chronopost, Mondial Relay) pour l&apos;acheminement physique.</li>
                <li>Aux <strong>prestataires de paiement sécurisé</strong> agréés (Stripe / Campay).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                4. Vos Droits et Modalités d&apos;Exercice
              </h3>
              <p>
                Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Droit d&apos;Accès</span>
                  <span className="text-on-surface-variant">Obtenir la confirmation et une copie intégrale des données traitées.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Droit de Rectification</span>
                  <span className="text-on-surface-variant">Modifier des informations inexactes ou incomplètes à tout moment.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Droit à l&apos;Effacement</span>
                  <span className="text-on-surface-variant">Demander la suppression de vos données (« Droit à l&apos;oubli »).</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Droit à la Portabilité</span>
                  <span className="text-on-surface-variant">Recevoir vos données dans un format structuré et lisible par machine.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Droit d&apos;Opposition</span>
                  <span className="text-on-surface-variant">Vous opposer aux traitements fondés sur l&apos;intérêt légitime.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs">
                  <span className="font-bold text-on-surface block mb-1">Directives Post-Mortem</span>
                  <span className="text-on-surface-variant">Définir le sort de vos données personnelles après votre décès.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <span className="text-xs text-on-surface-variant">
                  Pour exercer ces droits directement depuis votre compte ou via notre formulaire sécurisé :
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('dpo_form')}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                >
                  Accéder au Formulaire RGPD
                </button>
              </div>

              <p className="text-xs text-on-surface-variant mt-2">
                Vous disposez également du droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) sur leur site officiel : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a> ou par courrier postal au 3 Place de Fontenoy, 75007 Paris.
              </p>
            </section>
          </article>
        )}

        {/* Tab 3: Politique de Cookies & Traceurs */}
        {activeTab === 'cookies' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                  Politique de Cookies & Traceurs
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Conformité Directive ePrivacy et Délibérations CNIL n° 2020-091 et 2020-092
                </p>
              </div>

              {onOpenCookiePreferences && (
                <button
                  type="button"
                  onClick={onOpenCookiePreferences}
                  className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Cookie className="w-4 h-4" />
                  <span>Modifier mes Choix de Cookies</span>
                </button>
              )}
            </div>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                1. Qu&apos;est-ce qu&apos;un Cookie ?
              </h3>
              <p>
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la visite d&apos;un site internet. Il permet à son émetteur d&apos;identifier le terminal durant sa durée de validité.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                2. Pourquoi un Consentement est-il Obligatoire ?
              </h3>
              <p>
                En application de la directive européenne « ePrivacy » et de l&apos;article 82 de la loi Informatique et Libertés, les traceurs qui ne sont pas strictement nécessaires au service nécessitent <strong>votre consentement préalable, libre, spécifique, éclairé et univoque</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-1.5">
                <span className="font-bold text-on-surface block">Règles CNIL appliquées sur NovaMarket :</span>
                <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-1">
                  <li>Le refus est aussi simple que l&apos;acceptation (bouton « Tout refuser » au même niveau visuel).</li>
                  <li>Aucun traceur d&apos;analyse ou marketing n&apos;est déposé tant que vous n&apos;avez pas cliqué sur « Tout accepter » ou paramétré vos préférences.</li>
                  <li>La poursuite de la navigation ne vaut pas acceptation.</li>
                  <li>Votre choix est conservé pendant une durée maximale de <strong>6 mois</strong>.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                3. Tableau d&apos;Inventaire des Cookies Utilisés
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-outline-variant/60 rounded-xl overflow-hidden">
                  <thead className="bg-surface-container text-on-surface font-bold">
                    <tr>
                      <th className="p-3 border-b border-outline-variant/60">Identifiant Cookie</th>
                      <th className="p-3 border-b border-outline-variant/60">Finalité technique</th>
                      <th className="p-3 border-b border-outline-variant/60">Catégorie</th>
                      <th className="p-3 border-b border-outline-variant/60">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 bg-surface-container-lowest">
                    <tr>
                      <td className="p-3 font-mono font-bold">novamarket_session</td>
                      <td className="p-3">Maintien sécurisé de l&apos;authentification de session</td>
                      <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-300">Strictement nécessaire (Exempté)</td>
                      <td className="p-3">Session</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">novamarket_cart</td>
                      <td className="p-3">Mémorisation des articles ajoutés au panier d&apos;achat</td>
                      <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-300">Strictement nécessaire (Exempté)</td>
                      <td className="p-3">30 jours</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">novamarket_cookie_consent</td>
                      <td className="p-3">Mémorisation de vos choix de consentement CNIL</td>
                      <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-300">Strictement nécessaire (Exempté)</td>
                      <td className="p-3">6 mois</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">_nvm_analytics</td>
                      <td className="p-3">Statistiques de navigation anonymisées sans croisement tiers</td>
                      <td className="p-3 font-semibold text-secondary">Mesure d&apos;audience (Consentement requis)</td>
                      <td className="p-3">13 mois max</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </article>
        )}

        {/* Tab 4: Droit de Rétractation & Remboursements (14 jours) */}
        {activeTab === 'refund' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4">
              <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                Politique de Rétractation, Retours & Remboursements
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Conforme aux articles L. 221-18 à L. 221-28 du Code de la consommation français
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                1. Délai Légal de Rétractation de 14 Jours
              </h3>
              <p>
                Conformément à l&apos;article L. 221-18 du Code de la consommation, en tant que consommateur, vous disposez d&apos;un délai légal de <strong>14 jours calendaires</strong> à compter du lendemain du jour de la réception du bien pour exercer votre droit de rétractation, <strong>sans avoir à motiver votre décision ni à supporter de pénalités</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                2. Délais et Modalités de Remboursement
              </h3>
              <p>
                En cas d&apos;exercice du droit de rétractation :
              </p>
              <ul className="list-disc list-inside space-y-1 text-on-surface-variant pl-2">
                <li>Le remboursement porte sur la <strong>totalité des sommes versées</strong>, y compris les frais initiaux de livraison standard (au tarif standard le moins cher proposé).</li>
                <li>Le remboursement intervient au plus tard dans les <strong>14 jours</strong> à compter de la date à laquelle NovaMarket ou le vendeur est informé de votre décision, ou dès réception de la preuve de réexpédition du bien.</li>
                <li>Le remboursement est effectué via le <strong>même moyen de paiement</strong> que celui utilisé lors de la transaction initiale (sans aucuns frais pour l&apos;acheteur).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary">
                3. Exceptions Légales au Droit de Rétractation (Art. L. 221-28)
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 text-xs space-y-1 text-amber-900 dark:text-amber-200">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Cas d&apos;exclusion prévus par la loi :
                </span>
                <p>
                  Le droit de rétractation ne peut être exercé pour les biens confectionnés selon les spécifications précises du consommateur ou <strong>nettement personnalisés</strong> (gravure, sur-mesure d&apos;artisanat), ainsi que pour les biens descellés par le consommateur après la livraison et qui ne peuvent être renvoyés pour des raisons d&apos;hygiène ou de protection de la santé (cosmétiques ouverts, boucles d&apos;oreilles).
                </p>
              </div>
            </section>

            {/* Formulaire type de rétractation légal */}
            <section className="space-y-4 pt-4 border-t border-outline-variant/40">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-title-md font-bold text-base text-on-surface">
                  Formulaire Type Légal de Rétractation
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant">
                (Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat, conformément à l&apos;annexe à l&apos;article R. 221-1 du Code de la consommation).
              </p>

              {withdrawalSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-950 dark:text-emerald-100">
                    Demande de rétractation transmise avec succès !
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Un accusé de réception légal et les instructions de retour sécurisé ont été transmis à l&apos;adresse <strong>{withdrawalClientEmail}</strong>. Notre service client et le vendeur ont été notifiés.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWithdrawalSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                  >
                    Remplir un autre formulaire
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdrawalSubmit} className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">
                        Numéro de commande (ex: ORD-2025-0891) *
                      </label>
                      <input
                        type="text"
                        required
                        value={withdrawalOrderNumber}
                        onChange={(e) => setWithdrawalOrderNumber(e.target.value)}
                        placeholder="ORD-..."
                        className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">
                        Date de réception de la commande *
                      </label>
                      <input
                        type="date"
                        required
                        value={withdrawalDate}
                        onChange={(e) => setWithdrawalDate(e.target.value)}
                        className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">
                        Nom et Prénom du consommateur *
                      </label>
                      <input
                        type="text"
                        required
                        value={withdrawalClientName}
                        onChange={(e) => setWithdrawalClientName(e.target.value)}
                        placeholder="Jean Dupont"
                        className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">
                        Adresse email de contact *
                      </label>
                      <input
                        type="email"
                        required
                        value={withdrawalClientEmail}
                        onChange={(e) => setWithdrawalClientEmail(e.target.value)}
                        placeholder="jean.dupont@example.com"
                        className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">
                      Adresse postale complète du consommateur *
                    </label>
                    <input
                      type="text"
                      required
                      value={withdrawalAddress}
                      onChange={(e) => setWithdrawalAddress(e.target.value)}
                      placeholder="12 rue de la Paix, 75002 Paris"
                      className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">
                      Désignation du ou des produit(s) concerné(s) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={withdrawalProducts}
                      onChange={(e) => setWithdrawalProducts(e.target.value)}
                      placeholder="Nom et référence de l'article à retourner..."
                      className="w-full p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-on-surface-variant">
                      Conforme à l&apos;annexe de l&apos;art. R. 221-1 du Code de la consommation.
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmettre ma rétractation</span>
                    </button>
                  </div>
                </form>
              )}
            </section>
          </article>
        )}

        {/* Tab 5: Mentions Légales */}
        {activeTab === 'legal_notices' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4">
              <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                Mentions Légales Obligatoires
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                En vertu de l&apos;article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique (LCEN)
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>1. Éditeur de la Plateforme</span>
              </h3>
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-2">
                <p><strong>Dénomination sociale :</strong> NovaMarket SAS</p>
                <p><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS) au capital social de 50 000,00 €</p>
                <p><strong>Siège social :</strong> 14 Rue des Céramistes, 75011 Paris, France</p>
                <p><strong>Immatriculation :</strong> Registre du Commerce et des Sociétés (RCS) de Paris sous le numéro B 891 034 912</p>
                <p><strong>Numéro SIRET :</strong> 891 034 912 00018 · Code NAF/APE : 6312Z (Portails Internet)</p>
                <p><strong>Numéro de TVA Intracommunautaire :</strong> FR44 891 034 912</p>
                <p><strong>Téléphone :</strong> +33 (0)1 84 79 12 34 (numéro non surtaxé, prix d&apos;un appel local)</p>
                <p><strong>Email officiel :</strong> <a href="mailto:contact@novamarket.fr" className="text-primary hover:underline">contact@novamarket.fr</a></p>
                <p><strong>Directeur de la publication :</strong> Direction Générale de NovaMarket SAS</p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Hébergeur de l&apos;Application</span>
              </h3>
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 text-xs space-y-2">
                <p><strong>Nom de l&apos;hébergeur :</strong> Google Cloud France SARL (Infrastructure Cloud Run Europe-West)</p>
                <p><strong>Adresse :</strong> 8 Rue de Londres, 75009 Paris, France</p>
                <p><strong>Téléphone :</strong> +33 (0)1 42 68 53 00</p>
                <p><strong>Site web :</strong> <a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cloud.google.com</a></p>
                <p className="text-on-surface-variant text-[11px]">
                  Les données hébergées demeurent au sein de l&apos;Espace Économique Européen (UE) avec chiffrement AES-256 au repos et en transit (TLS 1.3).
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-title-md font-bold text-base text-primary flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>3. Propriété Intellectuelle</span>
              </h3>
              <p>
                L&apos;ensemble des éléments graphiques, textuels, logotypes, marques, icônes et architectures composant la marketplace NovaMarket sont la propriété exclusive de NovaMarket SAS ou font l&apos;objet d&apos;une licence légale. Toute reproduction totale ou partielle sans autorisation expresse est constitutive de contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
            </section>
          </article>
        )}

        {/* Tab 6: Formulaire d'Exercice des Droits RGPD */}
        {activeTab === 'dpo_form' && (
          <article className="p-6 sm:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-8 text-on-surface text-sm leading-relaxed">
            <div className="border-b border-outline-variant/40 pb-4">
              <h2 className="font-headline-sm font-bold text-xl sm:text-2xl text-on-surface">
                Formulaire d&apos;Exercice de vos Droits RGPD
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Conformément aux articles 15 à 22 du Règlement (UE) 2016/679. Traitement sous 30 jours maximum garanti par notre DPO.
              </p>
            </div>

            {dpoSubmitted ? (
              <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100">
                  Votre demande d&apos;exercice de droits a été transmise avec succès !
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto">
                  Un accusé de réception a été envoyé à <strong>{dpoEmail}</strong> avec le numéro de suivi de votre dossier. Conformément à l&apos;article 12.3 du RGPD, notre Délégué à la Protection des Données (DPO) vous répondra dans un délai maximal d&apos;un mois à compter de ce jour.
                </p>
                <button
                  type="button"
                  onClick={() => setDpoSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleDpoSubmit} className="space-y-6">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-on-surface-variant">
                    Pour garantir la confidentialité de vos données et éviter toute usurpation d&apos;identité, une confirmation pourra vous être demandée sur l&apos;adresse email associée à votre compte.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface">
                    Nature de votre demande de droits : *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setDpoRequestType('access')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        dpoRequestType === 'access'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="text-xs block font-bold">1. Droit d&apos;Accès</span>
                      <span className="text-[11px] text-on-surface-variant">Copie de mes données</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDpoRequestType('erasure')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        dpoRequestType === 'erasure'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="text-xs block font-bold">2. Droit à l&apos;Oubli</span>
                      <span className="text-[11px] text-on-surface-variant">Suppression de mon compte</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDpoRequestType('rectification')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        dpoRequestType === 'rectification'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="text-xs block font-bold">3. Rectification</span>
                      <span className="text-[11px] text-on-surface-variant">Correction de mes données</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDpoRequestType('portability')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        dpoRequestType === 'portability'
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="text-xs block font-bold">4. Portabilité</span>
                      <span className="text-[11px] text-on-surface-variant">Export JSON de mes commandes</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">
                      Votre Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={dpoName}
                      onChange={(e) => setDpoName(e.target.value)}
                      placeholder="Marie Curie"
                      className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">
                      Votre Adresse Email de compte NovaMarket *
                    </label>
                    <input
                      type="email"
                      required
                      value={dpoEmail}
                      onChange={(e) => setDpoEmail(e.target.value)}
                      placeholder="marie.curie@example.com"
                      className="w-full h-10 px-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    Précisions facultatives sur votre demande (ex: identifiant de commande spécifique, rectification d&apos;adresse)
                  </label>
                  <textarea
                    rows={3}
                    value={dpoDetails}
                    onChange={(e) => setDpoDetails(e.target.value)}
                    placeholder="Détaillez votre demande si nécessaire..."
                    className="w-full p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-xs text-on-surface"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <p className="text-[11px] text-on-surface-variant">
                    Contact direct du DPO : <a href="mailto:dpo@novamarket.fr" className="text-primary hover:underline font-semibold">dpo@novamarket.fr</a> · Réponse certifiée sous 30 jours calendaires.
                  </p>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmettre ma demande au DPO</span>
                  </button>
                </div>
              </form>
            )}
          </article>
        )}

      </div>
    </div>
  );
};
