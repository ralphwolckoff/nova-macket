import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Plus, 
  Truck, 
  Sparkles,
  Package
} from 'lucide-react';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  sellerId: string;
  sellerName: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  sellerId,
  sellerName,
}) => {
  // Form fields
  const [name, setName] = useState('Lampe Scandinave Bois & Céramique');
  const [category, setCategory] = useState('Mobilier Minimaliste');
  const [brand, setBrand] = useState('Nordik Atelier Studio');
  const [description, setDescription] = useState(
    'Lampe de table minimaliste conçue artisanalement avec un socle en chêne massif certifié FSC et un abat-jour en céramique matte émaillée à la main. Câble textile tressé de 1,80 m avec interrupteur variateur intégré. Compatible ampoules LED E27.'
  );

  // Gallery
  const [images, setImages] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAG3aR7XCuQELrrMpdxvIthdhuiHrQ7dpuLLQBMxuHbT5D4Lw4YcDHPOvkWf062lOfalerpOHfsfXzPn692fblTOeTMMnqoBLsq5hYBp1DIxN2wiFdudL2oHW7vNsxTlTNjllu5NOSHGTqCU6fyF84cPOUELnit7JK92z9SL73CJAjOglCiBTdsT59NJZwPjfZYeMsZi9IVTHorxeJNf8j7hXAykfipguMifTIIbvQeqg05wD0-f4ypzw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbFhqayRG0PzS8OIZyT-Zjo4ylgQ-40ABfAUzUiQ54PKhWYy6gH_UY6flBpCFZleT3v2DTB3iWsyh1gvdNBIwVMH98VUp4O9bJs6HAyc9S-g6P0NVeivIL9filKRwdueJU_13VaI7GSriVjQpfU7yJ56qdjcW9hooEsqkzl8HHvbyuNAN0eb6Bfu2XDCcAP1aGHxb8MPV9Hw4inuHwaeuXmdGXpvBzQHEtY729aC_aYp-TtZfk4pZLkQ'
  ]);
  const [newImageInput, setNewImageInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Pricing & Stock
  const [priceHT, setPriceHT] = useState('65.83');
  const [priceTTC, setPriceTTC] = useState('79.00');
  const [strikePrice, setStrikePrice] = useState('');
  const [stock, setStock] = useState('25');
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [sku, setSku] = useState('NVM-LMP-042');
  const [ean, setEan] = useState('3760123450428');
  const [weight, setWeight] = useState('1.45');
  const [shippingDelay, setShippingDelay] = useState('Expédié sous 24h ouvrées');
  const [deliverHome, setDeliverHome] = useState(true);
  const [deliverRelais, setDeliverRelais] = useState(true);
  const [publishImmediately, setPublishImmediately] = useState(true);

  if (!isOpen) return null;

  const handlePriceHTChange = (val: string) => {
    setPriceHT(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPriceTTC((num * 1.2).toFixed(2));
    }
  };

  const handlePriceTTCChange = (val: string) => {
    setPriceTTC(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPriceHT((num / 1.2).toFixed(2));
    }
  };

  const netEstimated = () => {
    const ttc = parseFloat(priceTTC) || 0;
    const commission = ttc * 0.08;
    const vat = ttc - (parseFloat(priceHT) || (ttc / 1.2));
    return Math.max(0, ttc - commission - vat).toFixed(2);
  };

  const handleAddImageUrl = () => {
    if (newImageInput.trim()) {
      setImages([...images, newImageInput.trim()]);
      setNewImageInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    setImages([target, ...rest]);
  };

  const handleSubmit = (asDraft = false) => {
    const finalPrice = parseFloat(priceTTC) || 49.0;
    const finalOriginal = strikePrice ? parseFloat(strikePrice) : undefined;
    const finalStock = parseInt(stock, 10) || 10;

    onAddProduct({
      title: name,
      description,
      price: finalPrice,
      originalPrice: finalOriginal,
      currency: 'EUR',
      category,
      tags: [category, brand, 'Artisanat', sellerName],
      sellerId,
      sellerName,
      rating: 5.0,
      reviewCount: 0,
      stock: finalStock,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
      specs: {
        'Marque': brand,
        'Référence SKU': sku,
        'Code EAN': ean,
        'Poids emballé': `${weight} kg`,
        'Délai de livraison': shippingDelay,
        'Modes de livraison': [deliverHome && 'Domicile', deliverRelais && 'Point Relais'].filter(Boolean).join(' & ')
      },
      badge: asDraft ? 'Brouillon' : (finalOriginal ? 'Promotion' : 'Nouveau'),
      shippingFee: 0,
      estimatedDelivery: shippingDelay,
      isFlashSale: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] border border-outline-variant/60">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-4 bg-surface-container-low/80 border-b border-surface-container relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-5 h-5" />
              </span>
              <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
                Ajouter un nouveau produit au catalogue
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Renseignez les caractéristiques de votre création, gérez vos stocks et publiez votre annonce instantanément sur le réseau NovaMarket.
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="px-6 py-6 overflow-y-auto flex flex-col gap-6 bg-surface-bright/50">
          
          {/* STEP 1: General Information */}
          <section className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">1</span>
                <h3 className="font-title-md font-bold text-sm text-on-surface">Informations Générales</h3>
              </div>
              <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Obligatoire</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                  <span>Nom de l&apos;article <span className="text-error">*</span></span>
                  <span className="text-[11px] text-outline font-normal">{name.length} / 120 caractères</span>
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Lampe Scandinave Bois & Céramique"
                  className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">
                  Catégorie principale <span className="text-error">*</span>
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="Mobilier Minimaliste">Mobilier Minimaliste</option>
                  <option value="Électronique & Audio">Électronique & Audio</option>
                  <option value="Maroquinerie & Accessoires">Maroquinerie & Accessoires</option>
                  <option value="Mode Éthique">Mode Éthique</option>
                  <option value="Beauté Biologique">Beauté Biologique</option>
                  <option value="Artisans Certifiés">Artisans Certifiés</option>
                </select>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold flex items-center gap-1">
                  <span>Marque / Collection</span>
                  <span className="text-[11px] text-outline font-normal">(Optionnel)</span>
                </label>
                <input 
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex. Nordik Atelier Studio"
                  className="h-10 px-3.5 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">
                  Description détaillée <span className="text-error">*</span>
                </label>
                <div className="rounded-lg bg-surface-container-low border border-outline-variant/60 overflow-hidden flex flex-col">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-1.5 bg-surface-container border-b border-surface-container-high text-on-surface-variant text-xs">
                    <button type="button" className="p-1 rounded hover:bg-surface-container-highest transition-colors font-bold" title="Gras">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-surface-container-highest transition-colors" title="Italique">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-surface-container-highest transition-colors" title="Liste à puces">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-surface-container-highest transition-colors" title="Lien">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-px bg-outline-variant mx-1" />
                    <span className="text-[10px] text-outline">Formatage Markdown supporté</span>
                  </div>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 bg-transparent text-xs text-on-surface focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: Photo Gallery */}
          <section className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">2</span>
                <h3 className="font-title-md font-bold text-sm text-on-surface">Galerie Photos & Médias</h3>
              </div>
              <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-semibold">
                {images.length} cliché{images.length > 1 ? 's' : ''} ajouté{images.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Image Preview Row + Add Button */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-outline-variant/60 shadow-xs group bg-surface-container">
                    <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-between p-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="w-6 h-6 rounded-full bg-surface-container-lowest/90 hover:bg-error hover:text-on-error text-on-surface flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {idx === 0 ? (
                        <span className="text-[9px] uppercase tracking-wider bg-primary text-on-primary px-1.5 py-0.5 rounded font-bold self-start">
                          Principale
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="text-[9px] uppercase tracking-wider bg-surface-container-lowest/90 text-on-surface hover:bg-primary hover:text-on-primary px-1.5 py-0.5 rounded font-semibold self-start transition-colors cursor-pointer"
                        >
                          Définir prin.
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add slot */}
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="w-28 h-28 rounded-xl border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center text-outline hover:text-primary transition-colors gap-1 cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-[11px] font-semibold">Ajouter URL</span>
                </button>
              </div>

              {/* Dynamic URL input */}
              {showUrlInput && (
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-2 animate-fadeIn">
                  <input
                    type="url"
                    placeholder="Coller l'URL directe de l'image (HTTPS, Unsplash, Google Storage...)"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    className="flex-1 h-9 px-3 bg-surface-container-lowest rounded-lg text-xs text-on-surface border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    Valider
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* STEP 3: Pricing, Stock & Logistics */}
          <section className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center font-bold">3</span>
                <h3 className="font-title-md font-bold text-sm text-on-surface">Tarification, Stocks & Logistique</h3>
              </div>
              <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Commission marketplace 8%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Prix HT */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">Prix de Vente HT</label>
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={priceHT}
                    onChange={(e) => handlePriceHTChange(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs font-mono font-semibold text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-3 text-outline text-xs font-bold pointer-events-none">€</span>
                </div>
              </div>

              {/* Prix TTC */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold flex items-center justify-between">
                  <span>Prix TTC <span className="text-error">*</span></span>
                  <span className="text-[10px] text-tertiary bg-tertiary-fixed/30 px-1 rounded">TVA 20%</span>
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    value={priceTTC}
                    onChange={(e) => handlePriceTTCChange(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs font-mono font-bold text-primary border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-3 text-outline text-xs font-bold pointer-events-none">€</span>
                </div>
              </div>

              {/* Strike Price */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                  <span>Prix Barré</span>
                  <span className="text-[10px] text-outline font-normal">(Optionnel)</span>
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    placeholder="Ex. 99.00"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 bg-surface-container-low rounded-lg text-xs font-mono text-outline border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-3 text-outline text-xs font-bold pointer-events-none">€</span>
                </div>
              </div>

              {/* Estimated net margin */}
              <div className="flex flex-col justify-end">
                <div className="h-10 px-3 rounded-lg bg-surface-container flex items-center justify-between border border-outline-variant/40">
                  <span className="text-[11px] text-on-surface-variant font-medium">Gain net estimé :</span>
                  <span className="text-xs font-bold font-mono text-tertiary-container">{netEstimated()} €</span>
                </div>
              </div>

              {/* Initial Stock */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">
                  Quantité stock initial <span className="text-error">*</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low rounded-lg text-xs font-mono font-semibold text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Alert threshold */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">Seuil d&apos;alerte critique</label>
                <input 
                  type="number"
                  min="1"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low rounded-lg text-xs font-mono font-semibold text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* SKU */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">SKU Référence interne</label>
                <input 
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low rounded-lg text-xs font-mono uppercase text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* EAN code */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface font-semibold">Code-barres EAN-13</label>
                <input 
                  type="text"
                  value={ean}
                  onChange={(e) => setEan(e.target.value)}
                  className="h-10 px-3 bg-surface-container-low rounded-lg text-xs font-mono text-on-surface border border-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Logistics Box */}
            <div className="p-3.5 bg-surface-container-low/50 rounded-xl border border-outline-variant/40 flex flex-col gap-3">
              <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" />
                <span>Options d&apos;Expédition & Logistique</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">Poids estimé avec emballage</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-surface-container-lowest rounded-lg text-xs font-mono border border-outline-variant"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[11px]">kg</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">Délai garanti</label>
                  <select 
                    value={shippingDelay}
                    onChange={(e) => setShippingDelay(e.target.value)}
                    className="h-9 px-3 bg-surface-container-lowest rounded-lg text-xs text-on-surface border border-outline-variant"
                  >
                    <option value="Expédié sous 24h ouvrées">Expédié sous 24h ouvrées</option>
                    <option value="Expédié sous 48h ouvrées">Expédié sous 48h ouvrées</option>
                    <option value="Fabrication à la commande (3 à 5 jours)">Fabrication à la commande (3 à 5 jours)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 justify-center">
                  <label className="text-[11px] text-on-surface-variant font-medium">Modes de livraison</label>
                  <div className="flex items-center gap-3 pt-0.5">
                    <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer font-medium">
                      <input 
                        type="checkbox" 
                        checked={deliverHome}
                        onChange={(e) => setDeliverHome(e.target.checked)}
                        className="accent-primary rounded" 
                      />
                      <span>Domicile</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer font-medium">
                      <input 
                        type="checkbox" 
                        checked={deliverRelais}
                        onChange={(e) => setDeliverRelais(e.target.checked)}
                        className="accent-primary rounded" 
                      />
                      <span>Point Relais</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-surface-container-low border-t border-surface-container z-10 gap-3">
          {/* Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={publishImmediately}
              onChange={(e) => setPublishImmediately(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-10 h-5 bg-surface-container-highest peer-checked:bg-primary rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-xs"></div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface">Mettre en vente immédiatement</span>
              <span className="text-[10px] text-outline">Visible en boutique dès confirmation</span>
            </div>
          </label>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-xs font-semibold text-on-surface-variant transition-colors cursor-pointer"
            >
              Sauvegarder en brouillon
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(!publishImmediately)}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer et publier le produit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
