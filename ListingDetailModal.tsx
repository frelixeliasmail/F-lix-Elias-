import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  Gavel,
  Tag,
  ShieldCheck,
  MessageCircle,
  Heart,
  Flame,
  Lightbulb,
  Handshake,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  AlertCircle,
  Share2,
} from 'lucide-react';

export const ListingDetailModal: React.FC = () => {
  const {
    selectedListingId,
    closeListingDetail,
    listings,
    users,
    currentUser,
    toggleReaction,
    placeBid,
    isEffectiveLowData,
    revealedImages,
    revealImageForListing,
    getOrCreateConversation,
    setActiveConversationId,
    setActiveView,
    openUserProfile,
    setIsSafetyModalOpen,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customBidAmount, setCustomBidAmount] = useState<number>(0);
  const [bidStatusMessage, setBidStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const listing = listings.find(l => l.id === selectedListingId);

  // Auction countdown
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    if (!listing || listing.type !== 'auction' || !listing.auctionEndsAt) return;

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
  }, [listing]);

  // Set default bid amount
  useEffect(() => {
    if (listing?.type === 'auction') {
      const currentHighest = listing.currentBid || listing.price;
      const minInc = listing.minIncrement || 5000;
      setCustomBidAmount(currentHighest + minInc);
    }
  }, [listing?.id, listing?.currentBid]);

  if (!listing) return null;

  const seller = users.find(u => u.id === listing.sellerId);
  const isImageRevealed = revealedImages[listing.id];
  const shouldShowImages = !isEffectiveLowData || isImageRevealed;
  const userReaction = listing.userReactions?.find(r => r.userId === currentUser.id)?.type;

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidStatusMessage(null);
    const result = placeBid(listing.id, customBidAmount);
    setBidStatusMessage({
      text: result.message,
      isError: !result.success,
    });
  };

  const handleStartChat = () => {
    if (seller) {
      closeListingDetail();
      const convId = getOrCreateConversation(listing.id, seller.id);
      setActiveConversationId(convId);
      setActiveView('messages');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-AO').format(val) + ' Kz';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        {/* Top sticky header bar inside modal */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              {listing.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Ref: #{listing.id.slice(-6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Copiar ligação do anúncio"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeListingDetail}
              className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center">
            Ligação do anúncio copiada para a área de transferência!
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-6">
          {/* Images or Low-Data Mode block */}
          {shouldShowImages && listing.images.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-16/10 sm:aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={listing.images[activeImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />

                {listing.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex(prev => (prev === 0 ? listing.images.length - 1 : prev - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageIndex(prev => (prev === listing.images.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {activeImageIndex + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-amber-500 scale-102' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Modo de Baixo Consumo de Dados Ativo
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Este anúncio possui {listing.images.length} fotos disponíveis. Foram ocultadas para carregar o anúncio sem gastar os seus dados móveis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => revealImageForListing(listing.id)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                Carregar fotos deste anúncio (~150 KB)
              </button>
            </div>
          )}

          {/* Title and Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {listing.type === 'auction' ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full">
                  <Gavel className="w-3.5 h-3.5" />
                  LEILÃO PÚBLICO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  PREÇO FIXO
                </span>
              )}

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Estado: {listing.condition === 'como_novo' ? 'Como Novo' : listing.condition === 'bom_estado' ? 'Bom Estado' : 'Marcas de Uso'}
              </span>

              <span className="text-xs font-medium text-slate-500 flex items-center gap-1 ml-auto">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {listing.neighborhood}, {listing.city} ({listing.province})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
              {listing.title}
            </h1>
          </div>

          {/* Price / Auction Interaction Panel */}
          {listing.type === 'auction' ? (
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-slate-50 border border-amber-300 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                <div>
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Lance Atual Mais Alto:
                  </span>
                  <div className="text-3xl font-black text-amber-600">
                    {formatPrice(listing.currentBid || listing.price)}
                  </div>
                  <span className="text-xs text-slate-500">
                    Preço base inicial: {formatPrice(listing.price)}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs font-bold text-slate-700 flex sm:justify-end items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Tempo Restante:
                  </span>
                  <div className={`text-xl font-black ${isEnded ? 'text-red-600' : 'text-slate-900'}`}>
                    {timeLeft || 'A decorrer'}
                  </div>
                  <span className="text-xs text-slate-500">
                    Incremento mín.: +{formatPrice(listing.minIncrement || 2000)}
                  </span>
                </div>
              </div>

              {/* Bidding Form */}
              {!isEnded && !listing.isSold ? (
                <form onSubmit={handlePlaceBid} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                        step={listing.minIncrement || 2000}
                        className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Valor do seu lance em Kz"
                        min={(listing.currentBid || listing.price) + (listing.minIncrement || 2000)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        Kz
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Gavel className="w-4 h-4" />
                      Confirmar Lance
                    </button>
                  </div>

                  {/* Quick increment buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-medium">Lances rápidos:</span>
                    {[5000, 10000, 20000, 50000].map(inc => {
                      const candidate = (listing.currentBid || listing.price) + inc;
                      return (
                        <button
                          key={inc}
                          type="button"
                          onClick={() => setCustomBidAmount(candidate)}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg font-semibold text-amber-900 transition-colors"
                        >
                          +{inc.toLocaleString()} Kz
                        </button>
                      );
                    })}
                  </div>

                  {bidStatusMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        bidStatusMessage.isError
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {bidStatusMessage.isError ? (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                      )}
                      <span>{bidStatusMessage.text}</span>
                    </div>
                  )}
                </form>
              ) : (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-bold text-center">
                  Este leilão já se encontra encerrado.
                </div>
              )}

              {/* Live Bids History */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Histórico de Lances ({listing.bids?.length || 0})</span>
                  <span className="text-[11px] text-slate-400 font-normal">Atualizado ao vivo</span>
                </h4>

                {listing.bids && listing.bids.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {listing.bids.map((b, idx) => (
                      <div
                        key={b.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                          idx === 0 ? 'bg-amber-100/80 font-bold border border-amber-300 text-amber-950' : 'bg-white border border-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                              1
                            </span>
                          )}
                          <span>{b.bidderName}</span>
                          <span className="text-[10px] text-slate-400">({b.bidderLocation})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{formatPrice(b.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Nenhum lance efetuado ainda. Seja o primeiro!</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Preço Solicitado:
                </span>
                <div className="text-3xl font-black text-slate-950">
                  {formatPrice(listing.price)}
                </div>
                {listing.isNegotiable && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    O vendedor aceita propostas e contra-ofertas
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartChat}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Negociar por Chat Privado
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Descrição do Artigo</h3>
            <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {listing.description}
            </p>
          </div>

          {/* Social Reactions Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Reações ao Anúncio
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleReaction(listing.id, 'like')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userReaction === 'like'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 ring-2 ring-rose-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${userReaction === 'like' ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Gosto ({listing.reactions?.like || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => toggleReaction(listing.id, 'fire')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userReaction === 'fire'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 ring-2 ring-amber-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Flame className={`w-4 h-4 ${userReaction === 'fire' ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>Top ({listing.reactions?.fire || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => toggleReaction(listing.id, 'deal')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userReaction === 'deal'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Lightbulb className={`w-4 h-4 ${userReaction === 'deal' ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                <span>Bom Negócio ({listing.reactions?.deal || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => toggleReaction(listing.id, 'negotiate')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  userReaction === 'negotiate'
                    ? 'bg-sky-100 text-sky-800 border border-sky-300 ring-2 ring-sky-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Handshake className={`w-4 h-4 ${userReaction === 'negotiate' ? 'text-sky-600' : ''}`} />
                <span>Quero Negociar ({listing.reactions?.negotiate || 0})</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              As reações ajudam a dar destaque aos melhores negócios. Para negociar com o vendedor, utilize o chat privado.
            </p>
          </div>

          {/* Seller Profile Card & Reputation */}
          {seller && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        seller.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-slate-900 text-base">{seller.name}</h4>
                      {seller.isVerified && (
                        <span title="Vendedor Verificado">
                          <CheckCircle className="w-4 h-4 text-sky-500" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {seller.rating}
                      </span>
                      <span>({seller.reviewCount} avaliações)</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        {seller.lastActive}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {seller.neighborhood}, {seller.city} ({seller.province})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeListingDetail();
                      openUserProfile(seller.id);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                  >
                    Ver Perfil & Reputação
                  </button>

                  <button
                    type="button"
                    onClick={handleStartChat}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Enviar Mensagem
                  </button>
                </div>
              </div>

              {/* Safety notice in Angola */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <strong>Dica Zunga:</strong> Encontros seguros recomendados em supermercados ou shoppings da zona.
                </span>
                <button
                  type="button"
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="text-amber-700 underline font-semibold text-[11px]"
                >
                  Ver dicas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
