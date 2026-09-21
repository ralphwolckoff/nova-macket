import React, { useState } from 'react';
import { Send, X, Store } from 'lucide-react';
import { Seller, Product } from '../types';

interface ContactSellerModalProps {
  seller: Seller;
  product?: Product;
  onClose: () => void;
  onSendMessage: (sellerId: string, text: string, productId?: string, productTitle?: string) => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  seller,
  product,
  onClose,
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState(
    product ? `Bonjour, j'ai une question concernant la création "${product.title}" : ` : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(seller.id, messageText, product?.id, product?.title);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-outline-variant">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="font-display-lg font-bold text-base text-on-surface">
              Écrire à {seller.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {product && (
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant text-xs">
            <img src={product.images[0]} alt={product.title} className="w-10 h-10 object-cover rounded-lg border border-outline-variant" />
            <div className="truncate">
              <span className="font-bold text-on-surface block truncate">{product.title}</span>
              <span className="text-on-surface-variant">{product.price.toFixed(2)} €</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1">Votre message à l&apos;artisan</label>
            <textarea
              required
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Posez vos questions sur les dimensions, finitions sur-mesure, délais d'expédition..."
              className="w-full text-xs p-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer le message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
