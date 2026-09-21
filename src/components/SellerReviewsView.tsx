import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Bot, 
  TrendingUp, 
  ShieldCheck, 
  ThumbsUp,
  Filter
} from 'lucide-react';
import { Seller } from '../types';

interface ReviewItem {
  id: string;
  author: string;
  date: string;
  rating: number;
  productName: string;
  comment: string;
  photoUrl?: string;
  tags: string[];
  sellerReply?: {
    date: string;
    text: string;
  };
}

interface SellerReviewsViewProps {
  currentSeller: Seller;
}

export const SellerReviewsView: React.FC<SellerReviewsViewProps> = ({ currentSeller }) => {
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | 'critical'>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>('rev-1');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({
    'rev-1': ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      author: 'Marc T.',
      date: 'Hier, 16:40',
      rating: 3,
      productName: 'Lampe Brutaliste Kora',
      comment: 'La lampe est conforme à la description et la céramique est superbe. En revanche, le livreur a laissé le carton sous la pluie sur le pas de porte sans sonner. Carton trempé, heureusement le calage étanche a protégé la pièce.',
      tags: ['Délai transport', 'Livraison perfectible'],
    },
    {
      id: 'rev-2',
      author: 'Sophie L.',
      date: 'Il y a 3 jours',
      rating: 5,
      productName: 'Set 4 Assiettes Grès Émaillé',
      comment: 'Un travail d\'une finesse et d\'une délicatesse rares. L\'emballage personnalisé avec le mot manuscrit de l\'atelier fait toute la différence. On sent l\'amour du métier.',
      tags: ['Emballage parfait', 'Qualité exceptionnelle'],
      sellerReply: {
        date: 'Il y a 2 jours',
        text: 'Mille mercis pour vos mots bienveillants Sophie ! C’est un immense honneur pour l’atelier d’accompagner vos tablées.'
      }
    },
    {
      id: 'rev-3',
      author: 'Camille V.',
      date: 'Il y a 6 jours',
      rating: 5,
      productName: 'Vase Organique Ocre',
      comment: 'Arrivé intact, pièce maîtresse de mon salon. Couleurs encore plus subtiles qu’en photo.',
      photoUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
      tags: ['Conforme', 'Coup de cœur'],
      sellerReply: {
        date: 'Il y a 5 jours',
        text: 'Ravis que les nuances de terres naturelles subliment votre intérieur Camille !'
      }
    }
  ]);

  const handleApplyAiTemplate = (revId: string) => {
    const suggestion = "Bonjour Marc, nous regrettons sincèrement cette négligence inadmissible du livreur local. Nous avons immédiatement ouvert un ticket de non-conformité auprès du transporteur. Votre satisfaction étant primordiale, nous vous offrons les frais de port sur votre prochaine création.";
    setReplyInputs({ ...replyInputs, [revId]: suggestion });
  };

  const handlePublishReply = (revId: string) => {
    const text = replyInputs[revId];
    if (!text || !text.trim()) return;

    setReviewsList(prev => prev.map(r => {
      if (r.id === revId) {
        return {
          ...r,
          sellerReply: {
            date: "À l'instant",
            text: text.trim()
          }
        };
      }
      return r;
    }));

    setToastMessage("Réponse publique publiée avec succès ! Votre badge réactivité est mis à jour.");
    setTimeout(() => setToastMessage(null), 3500);
    setActiveReplyId(null);
  };

  const filteredReviews = reviewsList.filter(r => {
    if (filterRating === '5') return r.rating === 5;
    if (filterRating === '4') return r.rating === 4;
    if (filterRating === 'critical') return r.rating <= 3;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-surface-container-lowest border border-tertiary rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-tertiary shrink-0" />
          <span className="text-xs font-bold text-on-surface">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>Réputation & Voix Client</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Avis Clients & Réputation Marchande
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Supervisez les retours d&apos;expérience acheteurs, répondez aux avis certifiés et maximisez votre visibilité algorithmique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Vendeur d&apos;Élite Certifié
          </span>
        </div>
      </div>

      {/* 4 KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Note Globale Vendeur</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-3xl text-on-surface">4.92</span>
            <span className="text-xs text-outline font-semibold">/ 5</span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
            <span className="text-[11px] text-tertiary font-bold ml-1">98% positifs</span>
          </div>
        </div>

        {/* Reply rate */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Taux de Réponse Marchand</span>
          <div className="font-mono font-bold text-3xl text-primary">96.5%</div>
          <span className="text-[11px] text-tertiary font-semibold block">
            Délai moyen de réponse : 3h15
          </span>
        </div>

        {/* Quality breakdown */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-1.5 text-[11px]">
          <span className="text-xs font-semibold text-on-surface-variant block mb-1">Critères Détaillés</span>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Qualité créations :</span>
            <span className="font-bold text-primary">4.95 / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Soin emballage :</span>
            <span className="font-bold text-primary">4.98 / 5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Respect délais :</span>
            <span className="font-bold text-secondary">4.85 / 5</span>
          </div>
        </div>

        {/* Critical action needed */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Actions Requises</span>
          <div className="font-mono font-bold text-2xl text-secondary">1 avis en attente</div>
          <span className="text-[11px] text-on-surface-variant block">
            Un avis ≤ 3★ sans réponse affecte le référencement naturel.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-surface-container">
        <button
          onClick={() => setFilterRating('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filterRating === 'all'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Tous les avis ({reviewsList.length})
        </button>

        <button
          onClick={() => setFilterRating('5')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
            filterRating === '5'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" /> 5 Étoiles (2)
        </button>

        <button
          onClick={() => setFilterRating('critical')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
            filterRating === 'critical'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" /> À traiter (≤ 3★) (1)
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id}
            className={`p-6 rounded-2xl bg-surface-container-lowest border transition-all shadow-xs space-y-4 ${
              rev.rating <= 3 ? 'border-secondary/40 ring-1 ring-secondary/20' : 'border-outline-variant/60'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-sm">
                  {rev.author.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-on-surface">{rev.author}</span>
                    <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                      Achat Certifié
                    </span>
                  </div>
                  <span className="text-[11px] text-outline">{rev.date} · Sur &quot;{rev.productName}&quot;</span>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${
                      s <= rev.rating ? 'fill-primary text-primary' : 'text-surface-container-highest'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
              « {rev.comment} »
            </p>

            {/* Optional Photo */}
            {rev.photoUrl && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-outline-variant/60">
                <img src={rev.photoUrl} alt="Photo client" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {rev.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                  #{t}
                </span>
              ))}
            </div>

            {/* Existing seller reply */}
            {rev.sellerReply && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Réponse de {currentSeller.name}
                  </span>
                  <span className="text-outline">{rev.sellerReply.date}</span>
                </div>
                <p className="text-xs text-on-surface-variant italic leading-relaxed">
                  « {rev.sellerReply.text} »
                </p>
              </div>
            )}

            {/* Action to reply if not replied */}
            {!rev.sellerReply && (
              <div className="pt-2 border-t border-surface-container">
                {activeReplyId === rev.id ? (
                  <div className="space-y-3 p-4 rounded-xl bg-surface-container-low border border-primary/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-primary" /> Rédiger une réponse publique
                      </span>
                      <button
                        onClick={() => handleApplyAiTemplate(rev.id)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Insérer suggestion IA bienveillante
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                      placeholder="Votre message sera affiché sous l'avis du client..."
                      className="w-full p-3 bg-surface-container-lowest rounded-lg text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handlePublishReply(rev.id)}
                        className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Publier la réponse
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyId(rev.id)}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Répondre à cet acheteur</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
