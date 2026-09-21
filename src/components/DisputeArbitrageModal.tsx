import React, { useState } from 'react';
import { 
  X, 
  Gavel, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Truck, 
  MessageSquare,
  DollarSign
} from 'lucide-react';

interface DisputeArbitrageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArbitrationExecuted: (decision: string, amount: number, note: string) => void;
}

export const DisputeArbitrageModal: React.FC<DisputeArbitrageModalProps> = ({
  isOpen,
  onClose,
  onArbitrationExecuted,
}) => {
  const [arbitrageChoice, setArbitrageChoice] = useState<'refund_full' | 'refund_partial' | 'release_vendor'>('refund_full');
  const [justification, setJustification] = useState(
    'Au vu des pièces photographiques versées au dossier, la rupture nette de la céramique interne sans enfoncement du carton extérieur révèle un calage amortisseur sous-dimensionné (non-respect de la charte NovaPackaging Art. 4.2). En conséquence, les fonds sont reversés à l\'acheteur.'
  );
  const [vendorWarning, setVendorWarning] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionDone, setExecutionDone] = useState(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionDone(true);
      setTimeout(() => {
        onArbitrationExecuted(
          arbitrageChoice, 
          arbitrageChoice === 'refund_full' ? 189 : (arbitrageChoice === 'refund_partial' ? 94.5 : 189),
          justification
        );
        onClose();
        setExecutionDone(false);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-inverse-surface/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto border border-outline-variant/60">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low flex flex-col gap-1 border-b border-surface-container relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error text-on-error text-[11px] font-bold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-on-error animate-pulse" />
                Priorité Haute / Séquestre Bloqué
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-mono text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-primary" />
                Stripe Escrow ID: #ESC-99201-NX
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="Fermer la fenêtre d'arbitrage"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
            <div>
              <h2 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                Arbitrage de Litige & Séquestre <span className="font-mono text-primary font-semibold">— Dossier #LIT-2024-049</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Litige vendeur vs acheteur : <strong className="text-on-surface">Colis déclaré non conforme / Pièce céramique brisée à destination</strong>
              </p>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span>Super-Admin Opérateur : Console #SA-04</span>
            </div>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface">
          
          {/* Left Column (7 cols): Evidence & Statements */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Transaction summary */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" /> Commande #CMD-2024-8942
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                  Passée le 12 Mai 2024
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-xl text-xs">
                <div>
                  <span className="block text-on-surface-variant text-[11px]">Produit commandé</span>
                  <span className="font-bold text-on-surface truncate block">Lampe Brutaliste Kora</span>
                </div>
                <div>
                  <span className="block text-on-surface-variant text-[11px]">Montant Séquestré</span>
                  <span className="font-mono font-bold text-primary">189,00 €</span>
                </div>
                <div>
                  <span className="block text-on-surface-variant text-[11px]">Transporteur</span>
                  <span className="font-medium text-on-surface flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-tertiary" /> Colissimo Sign.
                  </span>
                </div>
              </div>
            </div>

            {/* Statements comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seller */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">
                      AL
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">Atelier Lumière Pro</h4>
                      <span className="text-[10px] text-on-surface-variant">Sophie Martin (Vendeur)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                    ★ 4.9 (312)
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low text-xs">
                  <span className="text-[10px] text-on-surface-variant font-bold block mb-1">Déclaration sous serment :</span>
                  <p className="text-on-surface italic text-[11px] leading-relaxed">
                    « Article expédié neuf avec carton double cannelure haute densité + coussins d&apos;air renforcés. Bordereau d&apos;assurance R2 souscrit. Le client n&apos;a émis aucune réserve manuscrite lors de la signature au facteur. »
                  </p>
                </div>
              </div>

              {/* Buyer */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-secondary text-xs">
                      AS
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">Alexandre de S.</h4>
                      <span className="text-[10px] text-on-surface-variant">Client certifié (2 ans)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold">
                    Vérifié
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low text-xs">
                  <span className="text-[10px] text-on-surface-variant font-bold block mb-1">Motif de réclamation :</span>
                  <p className="text-on-surface italic text-[11px] leading-relaxed">
                    « Le carton extérieur ne semblait pas enfoncé, mais dès l&apos;ouverture, la base sculptée en céramique blanche est brisée net en deux fragments. La pièce est totalement inexploitable et dangereuse. »
                  </p>
                </div>
              </div>
            </div>

            {/* Photographic Evidence */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <span className="font-bold text-xs text-on-surface">
                  Pièces justificatives et éléments de preuve (3)
                </span>
                <span className="text-[11px] text-on-surface-variant font-mono">EXIF Certifiées</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="group relative rounded-xl overflow-hidden bg-surface-container aspect-square border border-outline-variant/60">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP89Pz7NO3Yq2Y6QwoZs5MNZL_3zIuQgUi7ScYLBg5QCBbyDPBOtQVSjU1mwEWoE2PMQtGmPAkwwrSNJ6mjUtXccCt2NQgT5MxH0ndvRQqzmY2Te4MjpaTa1_n_PuyX_oqJ8Vr11xhKMEFOpIjp6Abn-KhuVUNmWy16s2D3DfkxWpwtXLTjpJYXEfDUGBxiz8FkRT-aexiQogGB7CFBZAwWtaF8YidwsM7bH9Y5xFoe_nLxV4UKygTJw"
                    alt="Fissure céramique"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-2 text-on-primary">
                    <span className="font-bold text-[10px] truncate">Preuve_Fissure.jpg</span>
                    <span className="text-[9px] opacity-80">Déposé par Acheteur</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden bg-surface-container aspect-square border border-outline-variant/60">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq6ElxG37I3Jyi4tG02wF9-ZdVnOCwhMBrMNDOz9bbMB3nsXvg_CZy90RXPAb4qz9BK9DT0QU7vc2wdhxFHunEE311cw9aMLZffxQSzhxAj7059klcacl1hqnceheiukwadD_9SIsW8gFtcImT7_O08rnOioFkPsFHg_LoSnI8n5ckfO-oV984xf-wUYBVd6xHYEjEqqgTmmIhjBEPcNTqgxtUCi_zwRzW0TWvEta4O0M3EZTSlcK2kg"
                    alt="Carton extérieur"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-2 text-on-primary">
                    <span className="font-bold text-[10px] truncate">Carton_Origine.jpg</span>
                    <span className="text-[9px] opacity-80">Vue colis</span>
                  </div>
                </div>

                <div className="group relative rounded-xl overflow-hidden bg-surface-container aspect-square border border-outline-variant/60">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQRo1mMzuesmA1ZhDapZYGmL53gtqSqlj1SdqP6BsL9oE__EqaWIOKoQs6COgGLwbcyN9sjAfejYFfIuNGzvMZaTRu_jlyvQpQDyU62fZQhnd3ZSzdzEGqcbuCW25X9BnQExpDtSiT4tQo--ck4cFB8icg8SrGj3xJC4X_IfmBubF4J2os0sHFFf8dQnUlmvr_-UM7UVnYUCg8QMQ8eHYLkLCooyxfbNuld6Ke-6ZQB4TfGM4hat1vnw"
                    alt="Bordereau postal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-2 text-on-primary">
                    <span className="font-bold text-[10px] truncate">Bordereau_Colissimo.pdf</span>
                    <span className="text-[9px] opacity-80">Fourni par Vendeur</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conciliation timeline */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-2">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-secondary" /> Fil des échanges de conciliation
              </span>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant w-20 shrink-0">14 Mai · 11:20</span>
                  <div className="p-2 bg-surface-container-low rounded-lg text-on-surface flex-1">
                    <strong>Alexandre de S.</strong> : Bonjour, colis réceptionné il y a 30min. La base céramique est cassée net. Je sollicite le retour et remboursement intégral immédiat.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant w-20 shrink-0">14 Mai · 14:05</span>
                  <div className="p-2 bg-surface-container-high rounded-lg text-on-surface flex-1">
                    <strong className="text-primary">Atelier Lumière Pro</strong> : Bonjour Alexandre. Nos pièces sont soigneusement capitonnées. Vous avez signé sans mentionner de choc transporteur. Nous pouvons au mieux vous offrir un bon d&apos;achat de 30%.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant w-20 shrink-0">15 Mai · 08:30</span>
                  <div className="p-2 bg-error-container/40 rounded-lg text-on-surface flex-1">
                    <strong className="text-error">NovaProtect Bot</strong> : Aucun compromis trouvé sous 24h. Escalade automatique vers la modération Super-Admin. Séquestre Stripe gelé à titre conservatoire.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Arbitrage Sentence & Execution */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Prononcé du Super-Admin</span>
                  <h3 className="font-title-md font-bold text-sm text-on-surface">Sélection de la Sentence</h3>
                </div>
                <Gavel className="w-5 h-5 text-primary" />
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {/* Option 1: Full Refund Buyer */}
                <label className={`flex items-start p-3 rounded-xl cursor-pointer transition-all border ${
                  arbitrageChoice === 'refund_full'
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/50 hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="sentence"
                    checked={arbitrageChoice === 'refund_full'}
                    onChange={() => setArbitrageChoice('refund_full')}
                    className="mt-1 mr-3 h-4 w-4 accent-primary"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Remboursement total acheteur</span>
                      <span className="font-mono font-bold text-xs text-primary">189,00 €</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      Déblocage du séquestre en faveur du client. Frais de port déduits du compte marchand + imputation incident.
                    </p>
                  </div>
                </label>

                {/* Option 2: 50% split */}
                <label className={`flex items-start p-3 rounded-xl cursor-pointer transition-all border ${
                  arbitrageChoice === 'refund_partial'
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/50 hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="sentence"
                    checked={arbitrageChoice === 'refund_partial'}
                    onChange={() => setArbitrageChoice('refund_partial')}
                    className="mt-1 mr-3 h-4 w-4 accent-primary"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Remboursement partiel 50%</span>
                      <span className="font-mono font-bold text-xs text-secondary">94,50 € / 94,50 €</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      Scission équitable du séquestre. L&apos;acheteur conserve l&apos;article pour réparation ou réemploi.
                    </p>
                  </div>
                </label>

                {/* Option 3: Release Vendor */}
                <label className={`flex items-start p-3 rounded-xl cursor-pointer transition-all border ${
                  arbitrageChoice === 'release_vendor'
                    ? 'bg-primary-fixed text-on-primary-fixed border-primary shadow-xs'
                    : 'bg-surface-container-low border-outline-variant/50 hover:bg-surface-container'
                }`}>
                  <input
                    type="radio"
                    name="sentence"
                    checked={arbitrageChoice === 'release_vendor'}
                    onChange={() => setArbitrageChoice('release_vendor')}
                    className="mt-1 mr-3 h-4 w-4 accent-primary"
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Déblocage au profit du vendeur</span>
                      <span className="font-mono font-bold text-xs text-tertiary">189,00 €</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      Litige jugé non imputable au vendeur (défaut d&apos;inspection à réception ou faute transporteur assurée).
                    </p>
                  </div>
                </label>
              </div>

              {/* Justification textarea */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="text-xs font-bold text-on-surface flex justify-between items-center">
                  <span>Motivation juridique de la décision (Obligatoire)</span>
                  <span className="text-[10px] text-outline">Archivage 10 ans</span>
                </label>
                <textarea
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Warning checkbox */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vendorWarning}
                    onChange={(e) => setVendorWarning(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-error"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">Notifier un avertissement qualité au vendeur</span>
                    <span className="text-[11px] text-on-surface-variant">
                      Incrémente le score de risque marchand de 1.5 pt (seuil de suspension temporaire fixé à 5 pts).
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* AI Recommendation score card */}
            <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-primary uppercase">Score de recommandation IA</span>
                  <span className="text-[10px] font-mono font-bold bg-primary text-on-primary px-1.5 py-0.2 rounded">
                    92%
                  </span>
                </div>
                <p className="text-xs text-on-surface mt-0.5 leading-snug">
                  La vision par ordinateur confirme une contrainte de cisaillement mécanique typique d&apos;une chute interne sans protection latérale adéquate.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/50"
          >
            Suspendre / Sauvegarder l&apos;état
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={isExecuting || executionDone}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              executionDone 
                ? 'bg-tertiary text-on-tertiary' 
                : 'bg-primary-container text-on-primary hover:bg-primary'
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Traitement du flux Stripe Escrow...</span>
              </>
            ) : executionDone ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sentence exécutée & Séquestre débloqué</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Exécuter l&apos;Arbitrage & Libérer les Fonds Séquestrés</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
