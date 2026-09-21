import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ShieldCheck, 
  Calendar, 
  Download, 
  Sparkles, 
  ArrowUpRight, 
  PieChart, 
  BarChart3, 
  Bot,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { Seller, Product } from '../types';

interface SellerAnalyticsViewProps {
  currentSeller: Seller;
  products: Product[];
}

export const SellerAnalyticsView: React.FC<SellerAnalyticsViewProps> = ({
  currentSeller,
  products,
}) => {
  const [period, setPeriod] = useState<'30j' | '90j' | '12m'>('30j');
  const [activeDataPoint, setActiveDataPoint] = useState<{ month: string; sales: number; orders: number } | null>(null);

  const topProducts = [
    { title: 'Lampe Brutaliste Kora', visits: 1420, sales: 48, revenue: 9072.00, margin: '68%', conv: '3.4%' },
    { title: 'Set 4 Assiettes Grès Émaillé', visits: 980, sales: 36, revenue: 4284.00, margin: '62%', conv: '3.7%' },
    { title: 'Vase Organique Ocre', visits: 740, sales: 29, revenue: 2581.00, margin: '74%', conv: '3.9%' },
    { title: 'Bougeoir Ciment Minimaliste', visits: 610, sales: 31, revenue: 1209.00, margin: '58%', conv: '5.1%' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Pilotage Analytique & Rentabilité</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Performances & Statistiques Marchandes
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Visualisez vos ventes en temps réel, analysez vos flux d&apos;acquisition et appliquez les conseils stratégiques de l&apos;IA NovaAdvisor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="bg-surface-container-low p-1 rounded-xl flex border border-outline-variant/50 text-xs">
            <button
              onClick={() => setPeriod('30j')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                period === '30j' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              30 Jours
            </button>
            <button
              onClick={() => setPeriod('90j')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                period === '90j' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod('12m')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                period === '12m' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Année 2025
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Chiffre d&apos;Affaires Brut</span>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-primary">24 850 €</div>
          <div className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.2% vs période précédente
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Volume de Commandes</span>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-on-surface">164</div>
          <div className="text-[11px] text-on-surface-variant">
            Panier moyen : <strong className="font-mono text-on-surface">151,52 €</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Conversion Boutique</span>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-secondary">3.8%</div>
          <div className="text-[11px] text-on-surface-variant">
            4 320 visites uniques comptabilisées
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-on-surface-variant">Taux de Retours / Litiges</span>
          <div className="font-mono font-bold text-2xl sm:text-3xl text-tertiary">0.8%</div>
          <div className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Niveau d&apos;excellence Gold
          </div>
        </div>
      </div>

      {/* Main Graph: High-Definition SVG Interactive Curve */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-title-lg font-bold text-base text-on-surface flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Évolution du Chiffre d&apos;Affaires & Commandes</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Comparatif des performances mensuelles 2025 vs 2024.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-bold text-on-surface">Année 2025 (Actuel)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-outline-variant" />
              <span className="text-on-surface-variant">Année 2024</span>
            </div>
          </div>
        </div>

        {/* Dynamic SVG Chart */}
        <div className="w-full h-72 relative pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #65558f)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary, #65558f)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#e0e0e0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#e0e0e0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#e0e0e0" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="220" x2="800" y2="220" stroke="#cccccc" strokeWidth="1" />

            {/* 2024 Dotted comparison line */}
            <path
              d="M 50 180 Q 150 160 250 150 T 450 130 T 650 110 T 750 90"
              fill="none"
              stroke="#9e9e9e"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* 2025 Area Fill */}
            <path
              d="M 50 170 Q 150 130 250 120 T 450 80 T 650 50 T 750 30 L 750 220 L 50 220 Z"
              fill="url(#curveGradient)"
            />

            {/* 2025 Solid Curve */}
            <path
              d="M 50 170 Q 150 130 250 120 T 450 80 T 650 50 T 750 30"
              fill="none"
              stroke="var(--color-primary, #65558f)"
              strokeWidth="3.5"
            />

            {/* Data Dots with tooltips */}
            {[
              { x: 50, y: 170, month: 'Janvier', sales: 12400, orders: 82 },
              { x: 190, y: 130, month: 'Février', sales: 15200, orders: 104 },
              { x: 330, y: 110, month: 'Mars', sales: 17800, orders: 118 },
              { x: 470, y: 80, month: 'Avril', sales: 21100, orders: 139 },
              { x: 610, y: 50, month: 'Mai (Pic)', sales: 24850, orders: 164 },
              { x: 750, y: 30, month: 'Juin (Proj.)', sales: 28400, orders: 190 }
            ].map((pt, i) => (
              <g 
                key={i} 
                className="cursor-pointer group"
                onMouseEnter={() => setActiveDataPoint(pt)}
                onMouseLeave={() => setActiveDataPoint(null)}
              >
                <circle cx={pt.x} cy={pt.y} r="6" fill="#ffffff" stroke="var(--color-primary, #65558f)" strokeWidth="3" className="group-hover:r-8 transition-all" />
              </g>
            ))}
          </svg>

          {/* Month labels */}
          <div className="flex justify-between text-[11px] text-on-surface-variant font-mono mt-2 px-6">
            <span>Janv.</span>
            <span>Févr.</span>
            <span>Mars</span>
            <span>Avr.</span>
            <span className="font-bold text-primary">Mai</span>
            <span>Juin</span>
          </div>

          {/* Dynamic Tooltip */}
          {activeDataPoint && (
            <div className="absolute top-2 right-6 p-3 bg-surface-container-lowest rounded-xl shadow-lg border border-primary/30 text-xs animate-fadeIn">
              <span className="font-bold text-on-surface block">{activeDataPoint.month}</span>
              <div className="flex justify-between gap-4 text-on-surface-variant mt-1">
                <span>Chiffre d&apos;Affaires :</span>
                <strong className="font-mono text-primary">{activeDataPoint.sales.toLocaleString('fr-FR')} €</strong>
              </div>
              <div className="flex justify-between gap-4 text-on-surface-variant">
                <span>Commandes livrées :</span>
                <strong className="font-mono text-secondary">{activeDataPoint.orders}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2-Columns: Category Donut & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Mix Donut (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="font-title-lg font-bold text-base text-on-surface flex items-center gap-2">
            <PieChart className="w-5 h-5 text-secondary" />
            <span>Mix Ventes par Catégorie</span>
          </h2>

          <div className="flex items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Segment 1: Maison & Déco 54% */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-primary, #65558f)" strokeWidth="4" strokeDasharray="54 46" strokeDashoffset="0" />
                {/* Segment 2: Céramique & Table 28% */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-secondary, #7d5260)" strokeWidth="4" strokeDasharray="28 72" strokeDashoffset="-54" />
                {/* Segment 3: Maroquinerie 18% */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-tertiary, #2e6c4d)" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-82" />
              </svg>
              <div className="absolute text-center flex flex-col">
                <span className="font-mono font-bold text-lg text-on-surface">24,8k €</span>
                <span className="text-[10px] text-outline font-semibold">Total ventes</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface font-semibold">Mobilier & Luminaires</span>
              </div>
              <span className="font-mono font-bold text-on-surface">54% (13 419 €)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-on-surface font-semibold">Céramique & Art de la Table</span>
              </div>
              <span className="font-mono font-bold text-on-surface">28% (6 958 €)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary" />
                <span className="text-on-surface font-semibold">Accessoires & Décoration</span>
              </div>
              <span className="font-mono font-bold text-on-surface">18% (4 473 €)</span>
            </div>
          </div>
        </div>

        {/* Top Products Profit Table (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs space-y-4">
          <h2 className="font-title-lg font-bold text-base text-on-surface">
            Rentabilité & Top Ventes de l&apos;Atelier
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant">
                  <th className="pb-3 font-semibold">Article</th>
                  <th className="pb-3 font-semibold text-center">Ventes</th>
                  <th className="pb-3 font-semibold text-right">CA Brut</th>
                  <th className="pb-3 font-semibold text-center">Marge</th>
                  <th className="pb-3 font-semibold text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <td className="py-3 font-bold text-on-surface">{p.title}</td>
                    <td className="py-3 font-mono text-center">{p.sales} ex.</td>
                    <td className="py-3 font-mono font-bold text-right text-primary">
                      {p.revenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                        {p.margin}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-semibold text-right text-on-surface">
                      {p.conv}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic AI Recommendations Banner */}
      <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/60 shadow-xs flex flex-col md:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Recommandations NovaAdvisor
            </span>
            <span className="text-[10px] bg-primary text-on-primary font-bold px-2 py-0.2 rounded-full">
              Prioritaire
            </span>
          </div>
          <h3 className="font-title-md font-bold text-sm sm:text-base text-on-surface">
            Opportunité de Croissance : Pack Assiettes & Bougeoir Minimaliste
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            34% des clients achetant le <em>Set 4 Assiettes</em> consultent également les bougeoirs sans finaliser. Créer un ensemble packagé avec -10% permettrait d&apos;augmenter votre panier moyen de +22 €.
          </p>
        </div>
      </div>
    </div>
  );
};
