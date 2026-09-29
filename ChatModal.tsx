import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowLeft,
  DollarSign,
  Building,
  CheckCheck,
} from 'lucide-react';
import { SAFE_MEETING_POINTS } from '../data/mockData';

export const ChatModal: React.FC = () => {
  const {
    currentUser,
    users,
    listings,
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    markConversationAsRead,
    openListingDetail,
    setIsSafetyModalOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isOfferPickerOpen, setIsOfferPickerOpen] = useState(false);
  const [offerValue, setOfferValue] = useState<number | ''>('');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set default conversation if none selected
  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.id);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  if (!activeConversation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <h3 className="font-extrabold text-slate-900 text-lg">Sem conversas ativas</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Quando encontrar um artigo do seu interesse, clique em "Conversar com o Vendedor" para negociar valores e combinar a entrega em segurança.
          </p>
        </div>
      </div>
    );
  }

  // Identify interlocutor
  const otherUserId =
    activeConversation.buyerId === currentUser.id
      ? activeConversation.sellerId
      : activeConversation.buyerId;
  const otherUser = users.find((u) => u.id === otherUserId) || users[0];

  // Associated listing
  const listing = listings.find((l) => l.id === activeConversation.listingId);

  // Conversation messages
  const conversationMessages = messages.filter((m) => m.conversationId === activeConversation.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendOffer = () => {
    if (!offerValue || Number(offerValue) <= 0) return;

    const offerNum = Number(offerValue);
    const offerText = `Proponho fechar este negócio por ${new Intl.NumberFormat('pt-AO').format(offerNum)} Kz. Aceita negociar?`;

    sendMessage(activeConversation.id, offerText, {
      isOffer: true,
      offerAmount: offerNum,
    });

    setOfferValue('');
    setIsOfferPickerOpen(false);
  };

  const handleSelectLocation = (loc: string) => {
    const locText = `Sugiro encontrarmo-nos em local público e seguro: ${loc}. Que horário é mais conveniente para si?`;

    sendMessage(activeConversation.id, locText, {
      proposedLocation: loc,
    });

    setIsLocationPickerOpen(false);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-AO').format(val) + ' Kz';
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[75vh]">
        {/* Left Side: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-extrabold text-slate-900 text-base">Conversas & Negociações</h2>
            <p className="text-xs text-slate-500">Compradores e vendedores na Zunga</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const partnerId = conv.buyerId === currentUser.id ? conv.sellerId : conv.buyerId;
              const partner = users.find((u) => u.id === partnerId);
              const convListing = listings.find((l) => l.id === conv.listingId);
              const isSelected = conv.id === activeConversation.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt=""
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        partner?.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {partner?.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {convListing && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 truncate mb-1">
                        <Tag className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{convListing.title}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 truncate leading-snug">
                      {conv.lastMessageText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat View */}
        <div className="md:col-span-8 flex flex-col h-[75vh] bg-white">
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={otherUser.avatar}
                  alt={otherUser.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    otherUser.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-sm">{otherUser.name}</h3>
                  {otherUser.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-sky-500" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      otherUser.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {otherUser.isOnline ? 'Ativo agora' : otherUser.lastActive}
                  </span>
                  <span>•</span>
                  <span>{otherUser.neighborhood}, {otherUser.city}</span>
                </div>
              </div>
            </div>

            {/* Safety tips button */}
            <button
              type="button"
              onClick={() => setIsSafetyModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Locais Seguros</span>
            </button>
          </div>

          {/* Linked Listing Banner (Context) */}
          {listing && (
            <div
              onClick={() => openListingDetail(listing.id)}
              className="bg-slate-50 hover:bg-amber-50/50 transition-colors px-4 py-2 border-b border-slate-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  {listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                      Z
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{listing.title}</p>
                  <p className="text-xs font-black text-amber-600">
                    {formatPrice(listing.type === 'auction' ? (listing.currentBid || listing.price) : listing.price)}
                    {listing.type === 'auction' && ' (Lance Atual)'}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-amber-700 bg-white border border-amber-200 px-2 py-1 rounded-md shrink-0">
                Ver Artigo
              </span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {/* Safety Reminder Banner in Chat */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center max-w-md mx-auto space-y-1">
              <p className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Negociação Segura na Zunga
              </p>
              <p className="text-[11px] text-amber-800 leading-tight">
                Combinem a entrega num local público (Shoprite, Kero ou shopping). Pague por Multicaixa Express apenas depois de inspecionar o produto em mãos.
              </p>
            </div>

            {conversationMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 space-y-1.5 ${
                      isMine
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {/* Special Offer Badge */}
                    {msg.isOffer && (
                      <div className="bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-amber-300 text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        <span>Proposta de Preço: {formatPrice(msg.offerAmount || 0)}</span>
                      </div>
                    )}

                    {/* Special Proposed Location Badge */}
                    {msg.proposedLocation && (
                      <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ponto Sugerido: {msg.proposedLocation}</span>
                      </div>
                    )}

                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] ${
                        isMine ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Negotiation Actions Bar */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Atalhos:</span>

            <button
              type="button"
              onClick={() => setIsOfferPickerOpen(!isOfferPickerOpen)}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-slate-200 rounded-lg font-bold text-slate-800 flex items-center gap-1 transition-colors"
            >
              <DollarSign className="w-3 h-3 text-amber-600" />
              <span>Fazer Proposta de Preço</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-slate-200 rounded-lg font-bold text-slate-800 flex items-center gap-1 transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>Sugerir Local Seguro</span>
            </button>

            <button
              type="button"
              onClick={() => sendMessage(activeConversation.id, 'O artigo ainda está disponível para entrega?')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 transition-colors hidden sm:inline-block"
            >
              "Está disponível?"
            </button>

            <button
              type="button"
              onClick={() => sendMessage(activeConversation.id, 'Qual é o seu último preço para fecharmos hoje?')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 transition-colors hidden sm:inline-block"
            >
              "Qual o último preço?"
            </button>
          </div>

          {/* Proposta de Preço Picker Overlay */}
          {isOfferPickerOpen && (
            <div className="p-3 bg-amber-50 border-t border-amber-200 flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 shrink-0">Valor da Proposta:</span>
              <input
                type="number"
                placeholder="Ex: 280000"
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value ? Number(e.target.value) : '')}
                className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 w-36"
              />
              <span className="text-xs font-bold text-slate-500">Kz</span>
              <button
                type="button"
                onClick={handleSendOffer}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold"
              >
                Enviar Proposta
              </button>
              <button
                type="button"
                onClick={() => setIsOfferPickerOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 ml-auto"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Local de Encontro Picker Overlay */}
          {isLocationPickerOpen && (
            <div className="p-3 bg-emerald-50 border-t border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Selecione um ponto público e movimentado:
                </span>
                <button
                  type="button"
                  onClick={() => setIsLocationPickerOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAFE_MEETING_POINTS.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => handleSelectLocation(pt)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 transition-colors"
                  >
                    📍 {pt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Escreva a sua mensagem para o vendedor..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 rounded-2xl font-bold transition-all shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
