import React, { useState, useEffect } from 'react';
import { Listing, ReactionType } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Gavel,
  Tag,
  MessageCircle,
  Eye,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  Flame,
  Heart,
  Lightbulb,
  Handshake,
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const {
    currentUser,
    users,
    toggleReaction,
    isEffectiveLowData,
    revealedImages,
    revealImageForListing,
    openListingDetail,
    getOrCreateConversation,
    setActiveConversationId,
    setActiveView,
    openUserProfile,
  } = useApp();

  const seller = users.find(u => u.id === listing.sellerId);
  const isImageRevealed = revealedImages[listing.id];
  const shouldShowImage = !isEffectiveLowData || isImageRevealed;

  // Auction countdown calculator
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    if (listing.type !== 'auction' || !listing.auctionEndsAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(listing.auctionEndsAt!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Leilão Encerrado');
        setIsEnded(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [listing.type, listing.auctionEndsAt]);

  const conditionLabels: Record<string, { label: string; color: string }> = {
    como_novo: { label: 'Como Novo', color: 'bg-emerald-100 text-emerald-800' },
    bom_estado: { label: 'Bom Estado', color: 'bg-blue-100 text-blue-800' },
    marcas_uso: { label: 'Marcas de Uso', color: 'bg-slate-100 text-slate-800' },
  };

  const handleStartChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (seller) {
      const convId = getOrCreateConversation(listing.id, seller.id);
      setActiveConversationId(convId);
      setActiveView('messages');
    }
  };

  const userReaction = listing.userReactions?.find(r => r.userId === currentUser.id)?.type;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-AO').format(val) + ' Kz';
  };

  return (
    <div
      onClick={() => openListingDetail(listing.id)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
    >
      {/* Visual / Low-data Image Header */}
      {shouldShowImage && listing.images.length > 0 ? (
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-100 overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {listing.type === 'auction' ? (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Gavel className="w-3.5 h-3.5" />
                Leilão
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Preço Fixo
              </span>
            )}

            {listing.isSold && (
              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Vendido
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-400" />
              {listing.images.length}
            </span>
          </div>

          {listing.type === 'auction' && (
            <div className="absolute bottom-2 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                {timeLeft || 'A decorrer'}
              </span>
              <span className="text-[11px] text-slate-300">
                {listing.bids?.length || 0} lances
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Low Data Mode Placeholder */
        <div className="bg-slate-50 border-b border-slate-100 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {listing.type === 'auction' ? (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-md">
                  <Gavel className="w-3 h-3" />
                  Leilão
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-800 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                  <Tag className="w-3 h-3 text-amber-400" />
                  Preço Fixo
                </span>
              )}
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${conditionLabels[listing.condition]?.color}`}>
                {conditionLabels[listing.condition]?.label}
              </span>
            </div>

            {listing.type === 'auction' && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeLeft || 'A decorrer'}
              </span>
            )}
          </div>

          {/* On-demand image reveal button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              revealImageForListing(listing.id);
            }}
            className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>Ver fotos ({listing.images.length}) • gasta ~120 KB</span>
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition tags (if normal mode) */}
          {shouldShowImage && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {listing.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[11px] font-medium px-1.5 py-0.2 rounded ${conditionLabels[listing.condition]?.color}`}>
                {conditionLabels[listing.condition]?.label}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
            {listing.title}
          </h3>

          {/* Price / Auction Bid */}
          <div className="mt-2.5 flex items-baseline justify-between">
            <div>
              {listing.type === 'auction' ? (
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Lance Atual:</span>
                  <div className="text-xl font-extrabold text-amber-600">
                    {formatPrice(listing.currentBid || listing.price)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {formatPrice(listing.price)}
                  </div>
                  {listing.isNegotiable && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      Preço negociável
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                <Eye className="w-3 h-3" />
                {listing.viewsCount} visitas
              </span>
            </div>
          </div>

          {/* Seller Location & Presence */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-medium truncate">
                {listing.neighborhood}, {listing.city}
              </span>
            </div>

            {seller && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  openUserProfile(seller.id);
                }}
                className="flex items-center gap-1 hover:underline text-slate-500 shrink-0 text-[11px]"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    seller.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                  }`}
                />
                <span className="font-semibold text-slate-700">{seller.name.split(' ')[0]}</span>
                {seller.isVerified && <CheckCircle className="w-3 h-3 text-sky-500" />}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Social Reactions & Chat Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
          {/* Reaction Bar */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => toggleReaction(listing.id, 'like')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                userReaction === 'like'
                  ? 'bg-rose-100 text-rose-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Gosto"
            >
              <Heart className={`w-3.5 h-3.5 ${userReaction === 'like' ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{listing.reactions?.like || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleReaction(listing.id, 'fire')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                userReaction === 'fire'
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Top"
            >
              <Flame className={`w-3.5 h-3.5 ${userReaction === 'fire' ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{listing.reactions?.fire || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleReaction(listing.id, 'deal')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                userReaction === 'deal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Bom Negócio"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${userReaction === 'deal' ? 'fill-emerald-500 text-emerald-500' : ''}`} />
              <span>{listing.reactions?.deal || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleReaction(listing.id, 'negotiate')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                userReaction === 'negotiate'
                  ? 'bg-sky-100 text-sky-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Quero Negociar"
            >
              <Handshake className={`w-3.5 h-3.5 ${userReaction === 'negotiate' ? 'text-sky-600' : ''}`} />
              <span>{listing.reactions?.negotiate || 0}</span>
            </button>
          </div>

          {/* Quick Chat Button */}
          <button
            type="button"
            onClick={handleStartChat}
            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            title="Abrir chat direto com o vendedor"
          >
            <MessageCircle className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
