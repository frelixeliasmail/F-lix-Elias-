import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import {
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  Phone,
  MessageCircle,
  Edit3,
  Check,
  X,
  MessageSquare,
  ThumbsUp,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    users,
    selectedUserIdForProfile,
    listings,
    getSellerReviews,
    addReview,
    updateCurrentUser,
    getOrCreateConversation,
    setActiveConversationId,
    setActiveView,
  } = useApp();

  const profileUserId = selectedUserIdForProfile || currentUser.id;
  const isOwnProfile = profileUserId === currentUser.id;
  const user = users.find((u) => u.id === profileUserId) || currentUser;

  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [listingFilter, setListingFilter] = useState<'all' | 'active' | 'sold'>('all');

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editNeighborhood, setEditNeighborhood] = useState(user.neighborhood);
  const [editCity, setEditCity] = useState(user.city);
  const [editProvince, setEditProvince] = useState(user.province);

  // New review form
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const userListings = listings.filter((l) => l.sellerId === user.id);
  const filteredListings = userListings.filter((l) => {
    if (listingFilter === 'active') return !l.isSold;
    if (listingFilter === 'sold') return l.isSold;
    return true;
  });

  const reviews = getSellerReviews(user.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      bio: editBio,
      phone: editPhone,
      neighborhood: editNeighborhood,
      city: editCity,
      province: editProvince,
    });
    setIsEditing(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      sellerId: user.id,
      rating: newRating,
      comment: newComment.trim(),
      transactionItemTitle: newItemTitle.trim() || undefined,
    });

    setNewComment('');
    setNewItemTitle('');
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsReviewFormOpen(false);
    }, 2000);
  };

  const handleStartChatWithUser = () => {
    // Find any listing of this user or create a generic conversation
    const listing = userListings[0];
    const listingId = listing ? listing.id : 'general_chat';
    const convId = getOrCreateConversation(listingId, user.id);
    setActiveConversationId(convId);
    setActiveView('messages');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Banner pattern */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* User Info & Stats */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar & Presence */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                />
                <span
                  className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                    user.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-slate-300'
                  }`}
                  title={user.isOnline ? 'Ativo agora' : user.lastActive}
                />
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                  {user.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                      Verificado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      user.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span className="font-semibold text-slate-700">
                    {user.isOnline ? 'Ativo agora na Zunga' : user.lastActive}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancelar Edição' : 'Editar os Meus Dados'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartChatWithUser}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reviews');
                      setIsReviewFormOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Avaliar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Atualizar Dados de Registo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Nome Completo</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Província</label>
                  <input
                    type="text"
                    value={editProvince}
                    onChange={(e) => setEditProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Cidade / Município</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Bairro / Região</label>
                  <input
                    type="text"
                    value={editNeighborhood}
                    onChange={(e) => setEditNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Biografia / Apresentação</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg"
                >
                  Guardar Alterações
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Bio & Details */}
              <p className="text-slate-700 text-sm max-w-2xl">{user.bio}</p>

              {/* Meta information tags */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {user.neighborhood}, {user.city} ({user.province})
                </span>

                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {user.phone}
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Zungueiro desde {user.joinedYear}
                </span>

                <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {user.rating} de pontuação ({user.reviewCount} avaliações)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-slate-200 px-6 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className={`py-3.5 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'listings'
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Anúncios Publicados ({userListings.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Histórico de Avaliações ({reviews.length})</span>
            </button>
          </div>

          {activeTab === 'listings' && (
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setListingFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  listingFilter === 'all' ? 'bg-amber-100 text-amber-900' : 'text-slate-500'
                }`}
              >
                Todos ({userListings.length})
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  listingFilter === 'active' ? 'bg-amber-100 text-amber-900' : 'text-slate-500'
                }`}
              >
                Ativos ({userListings.filter((l) => !l.isSold).length})
              </button>
              <button
                type="button"
                onClick={() => setListingFilter('sold')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  listingFilter === 'sold' ? 'bg-amber-100 text-amber-900' : 'text-slate-500'
                }`}
              >
                Vendidos ({userListings.filter((l) => l.isSold).length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: User Listings */}
      {activeTab === 'listings' && (
        <div>
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <p className="text-slate-500 text-sm">Nenhum anúncio encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reviews & Trust Feedback History */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Header & Write Review Action */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Reputação e Confiança de {user.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Avaliações reais feitas por compradores e vendedores após negociações em Luanda e restantes províncias.
              </p>
            </div>

            {!isOwnProfile && (
              <button
                type="button"
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Star className="w-4 h-4 fill-slate-950" />
                <span>{isReviewFormOpen ? 'Fechar Formulário' : 'Deixar Avaliação'}</span>
              </button>
            )}
          </div>

          {/* Review form */}
          {isReviewFormOpen && !isOwnProfile && (
            <form onSubmit={handleAddReview} className="bg-white border border-amber-300 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  Como correu a sua negociação com {user.name}?
                </h4>
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Obrigado! A sua avaliação foi registada e ajuda a comunidade Zunga a negociar com segurança.
                </div>
              ) : (
                <>
                  {/* Star picker */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Classificação (Estrelas):
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-amber-700">
                        {newRating === 5
                          ? 'Excelente (Recomendadíssimo)'
                          : newRating === 4
                          ? 'Muito Bom'
                          : newRating === 3
                          ? 'Razoável'
                          : 'Fraco'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Artigo Negociado (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: iPhone 11, Gerador, Mesa de centro..."
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Comentário sobre a experiência e pontualidade: *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Descreva a pontualidade no encontro, o estado real do artigo, facilidade de pagamento por Multicaixa Express, etc."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-extrabold"
                    >
                      Publicar Avaliação
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{rev.reviewerName}</h5>
                      <span className="text-[11px] text-slate-400">{rev.reviewerLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                {rev.transactionItemTitle && (
                  <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span>Negociou: {rev.transactionItemTitle}</span>
                  </div>
                )}

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{rev.comment}</p>

                {rev.recommended && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pt-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>Recomenda este vendedor</span>
                  </div>
                )}
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-1">
                <p className="text-slate-700 font-bold text-sm">Ainda sem avaliações registadas</p>
                <p className="text-slate-400 text-xs">
                  As avaliações surgem aqui após os encontros e negócios fechados na plataforma.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
