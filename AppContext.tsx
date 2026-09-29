import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Listing,
  Review,
  Conversation,
  Message,
  ReactionType,
  DataSavingMode,
  ListingType,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  updateCurrentUser: (updated: Partial<User>) => void;

  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'sellerId' | 'reactions' | 'userReactions' | 'viewsCount'>) => void;
  toggleReaction: (listingId: string, type: ReactionType) => void;
  placeBid: (listingId: string, amount: number) => { success: boolean; message: string };
  markAsSold: (listingId: string) => void;

  reviews: Review[];
  addReview: (reviewData: { sellerId: string; rating: number; comment: string; transactionItemTitle?: string }) => void;
  getSellerReviews: (sellerId: string) => Review[];

  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, options?: { isOffer?: boolean; offerAmount?: number; proposedLocation?: string }) => void;
  getOrCreateConversation: (listingId: string, sellerId: string) => string;
  markConversationAsRead: (conversationId: string) => void;
  unreadMessagesCount: number;

  // Data saving mode (Low Data / Modo Económico / Modo Texto)
  dataSavingMode: DataSavingMode;
  setDataSavingMode: (mode: DataSavingMode) => void;
  isEffectiveLowData: boolean;
  savedDataKb: number;
  revealedImages: Record<string, boolean>;
  revealImageForListing: (listingId: string) => void;
  isConnectionSimulatedWeak: boolean;
  setIsConnectionSimulatedWeak: (weak: boolean) => void;

  // Navigation and Modals
  activeView: 'feed' | 'auctions' | 'profile' | 'messages';
  setActiveView: (view: 'feed' | 'auctions' | 'profile' | 'messages') => void;
  selectedUserIdForProfile: string | null;
  openUserProfile: (userId: string) => void;
  selectedListingId: string | null;
  openListingDetail: (listingId: string) => void;
  closeListingDetail: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (neighborhood: string) => void;
  filterByMyLocation: () => void;
  clearLocationFilters: () => void;
  selectedListingType: 'all' | ListingType;
  setSelectedListingType: (type: 'all' | ListingType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`zunga_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [users, setUsers] = useState<User[]>(() => loadStored('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>('user_current');
  const [listings, setListings] = useState<Listing[]>(() => loadStored('listings', INITIAL_LISTINGS));
  const [reviews, setReviews] = useState<Review[]>(() => loadStored('reviews', INITIAL_REVIEWS));
  const [conversations, setConversations] = useState<Conversation[]>(() => loadStored('conversations', INITIAL_CONVERSATIONS));
  const [messages, setMessages] = useState<Message[]>(() => loadStored('messages', INITIAL_MESSAGES));

  // Low data modes
  const [dataSavingMode, setDataSavingModeState] = useState<DataSavingMode>(() => {
    return (localStorage.getItem('zunga_dataSavingMode') as DataSavingMode) || 'text_only'; // Default to text_only to prominently highlight low-data mode capability!
  });
  const [isConnectionSimulatedWeak, setIsConnectionSimulatedWeak] = useState<boolean>(true);
  const [savedDataKb, setSavedDataKb] = useState<number>(() => {
    const saved = localStorage.getItem('zunga_savedDataKb');
    return saved ? parseInt(saved, 10) : 3480; // ~3.4 MB
  });
  const [revealedImages, setRevealedImages] = useState<Record<string, boolean>>({});

  // View state
  const [activeView, setActiveView] = useState<'feed' | 'auctions' | 'profile' | 'messages'>('feed');
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProvince, setSelectedProvinceState] = useState('Todas');
  const [selectedCity, setSelectedCityState] = useState('Todas');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [selectedListingType, setSelectedListingType] = useState<'all' | ListingType>('all');

  const setSelectedProvince = (prov: string) => {
    setSelectedProvinceState(prov);
    if (prov === 'Todas') {
      setSelectedCityState('Todas');
      setSelectedNeighborhood('Todos');
    } else {
      setSelectedCityState('Todas');
      setSelectedNeighborhood('Todos');
    }
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    setSelectedNeighborhood('Todos');
  };

  const filterByMyLocation = () => {
    if (currentUser.province) setSelectedProvinceState(currentUser.province);
    if (currentUser.city) setSelectedCityState(currentUser.city);
    if (currentUser.neighborhood) setSelectedNeighborhood(currentUser.neighborhood);
  };

  const clearLocationFilters = () => {
    setSelectedProvinceState('Todas');
    setSelectedCityState('Todas');
    setSelectedNeighborhood('Todos');
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zunga_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zunga_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('zunga_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('zunga_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('zunga_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('zunga_dataSavingMode', dataSavingMode);
  }, [dataSavingMode]);

  useEffect(() => {
    localStorage.setItem('zunga_savedDataKb', savedDataKb.toString());
  }, [savedDataKb]);

  const setDataSavingMode = (mode: DataSavingMode) => {
    setDataSavingModeState(mode);
  };

  // Determine if Low Data Mode is effectively active
  // If set to 'text_only', it's active.
  // If 'normal', it's inactive.
  // If 'auto', active if simulated weak or navigator.connection.saveData is on
  const isEffectiveLowData: boolean =
    dataSavingMode === 'text_only' ||
    (dataSavingMode === 'auto' && Boolean(isConnectionSimulatedWeak || (typeof navigator !== 'undefined' && Boolean((navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData))));

  const revealImageForListing = (listingId: string) => {
    setRevealedImages(prev => ({ ...prev, [listingId]: true }));
    // When revealed, it consumed ~150kb, so subtract from saved or keep track
  };

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateCurrentUser = (updated: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => (u.id === currentUserId ? { ...u, ...updated } : u))
    );
  };

  // Add listing
  const addListing = (
    newListingData: Omit<Listing, 'id' | 'createdAt' | 'sellerId' | 'reactions' | 'userReactions' | 'viewsCount'>
  ) => {
    const id = `listing_${Date.now()}`;
    const newListing: Listing = {
      ...newListingData,
      id,
      sellerId: currentUser.id,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      reactions: { like: 0, fire: 0, deal: 0, negotiate: 0 },
      userReactions: [],
      currentBid: newListingData.type === 'auction' ? newListingData.price : undefined,
      bids: [],
    };

    setListings(prev => [newListing, ...prev]);
    // Increase saved data counter slightly as new listings exist in text
    setSavedDataKb(prev => prev + 120);
  };

  // Toggle reaction on listing
  const toggleReaction = (listingId: string, type: ReactionType) => {
    setListings(prev =>
      prev.map(listing => {
        if (listing.id !== listingId) return listing;

        const existingReactionIndex = listing.userReactions.findIndex(
          r => r.userId === currentUser.id
        );

        const newReactions = { ...listing.reactions };
        let newUserReactions = [...listing.userReactions];

        if (existingReactionIndex > -1) {
          const currentType = newUserReactions[existingReactionIndex].type;
          // Decrement previous
          newReactions[currentType] = Math.max(0, newReactions[currentType] - 1);

          if (currentType === type) {
            // Remove completely
            newUserReactions.splice(existingReactionIndex, 1);
          } else {
            // Change type
            newReactions[type] = (newReactions[type] || 0) + 1;
            newUserReactions[existingReactionIndex] = { userId: currentUser.id, type };
          }
        } else {
          // Add new
          newReactions[type] = (newReactions[type] || 0) + 1;
          newUserReactions.push({ userId: currentUser.id, type });
        }

        return {
          ...listing,
          reactions: newReactions,
          userReactions: newUserReactions,
        };
      })
    );
  };

  // Place bid in auction
  const placeBid = (listingId: string, amount: number): { success: boolean; message: string } => {
    const targetListing = listings.find(l => l.id === listingId);
    if (!targetListing) return { success: false, message: 'Anúncio não encontrado.' };
    if (targetListing.type !== 'auction') return { success: false, message: 'Este anúncio não é um leilão.' };
    if (targetListing.isAuctionClosed) return { success: false, message: 'Este leilão já se encontra encerrado.' };

    const highestBid = targetListing.currentBid || targetListing.price;
    const minInc = targetListing.minIncrement || 2000;

    if (amount < highestBid + minInc) {
      return {
        success: false,
        message: `O lance mínimo deve ser de ${(highestBid + minInc).toLocaleString()} Kz (lance atual + incremento de ${minInc.toLocaleString()} Kz).`,
      };
    }

    const newBid = {
      id: `bid_${Date.now()}`,
      listingId,
      bidderId: currentUser.id,
      bidderName: currentUser.name,
      bidderLocation: currentUser.neighborhood || currentUser.city,
      amount,
      timestamp: new Date().toISOString(),
    };

    setListings(prev =>
      prev.map(l => {
        if (l.id !== listingId) return l;
        return {
          ...l,
          currentBid: amount,
          bids: [newBid, ...(l.bids || [])],
        };
      })
    );

    return { success: true, message: `Lance de ${amount.toLocaleString()} Kz registado com sucesso!` };
  };

  const markAsSold = (listingId: string) => {
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, isSold: true, isAuctionClosed: true } : l))
    );
  };

  // Add review to seller
  const addReview = (reviewData: {
    sellerId: string;
    rating: number;
    comment: string;
    transactionItemTitle?: string;
  }) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      sellerId: reviewData.sellerId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerLocation: `${currentUser.neighborhood}, ${currentUser.city}`,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      transactionItemTitle: reviewData.transactionItemTitle,
      recommended: reviewData.rating >= 4,
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate seller rating
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id !== reviewData.sellerId) return u;
        const allSellerReviews = [newRev, ...reviews.filter(r => r.sellerId === u.id)];
        const avg = allSellerReviews.reduce((sum, r) => sum + r.rating, 0) / allSellerReviews.length;
        return {
          ...u,
          rating: Number(avg.toFixed(1)),
          reviewCount: allSellerReviews.length,
        };
      })
    );
  };

  const getSellerReviews = (sellerId: string) => {
    return reviews.filter(r => r.sellerId === sellerId);
  };

  // Direct chat messaging
  const getOrCreateConversation = (listingId: string, sellerId: string): string => {
    const existing = conversations.find(
      c => c.listingId === listingId && ((c.buyerId === currentUser.id && c.sellerId === sellerId) || (c.buyerId === sellerId && c.sellerId === currentUser.id))
    );

    if (existing) {
      return existing.id;
    }

    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      listingId,
      buyerId: currentUser.id,
      sellerId,
      lastMessageText: 'Conversa iniciada',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations(prev => [newConv, ...prev]);
    return newId;
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    options?: { isOffer?: boolean; offerAmount?: number; proposedLocation?: string }
  ) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      isOffer: options?.isOffer,
      offerAmount: options?.offerAmount,
      proposedLocation: options?.proposedLocation,
      read: true,
    };

    setMessages(prev => [...prev, newMsg]);

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageText: text,
              lastMessageTimestamp: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    setMessages(prev =>
      prev.map(m => (m.conversationId === conversationId ? { ...m, read: true } : m))
    );
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const unreadMessagesCount = messages.filter(
    m => !m.read && m.senderId !== currentUser.id
  ).length;

  const openUserProfile = (userId: string) => {
    setSelectedUserIdForProfile(userId);
    setActiveView('profile');
  };

  const openListingDetail = (listingId: string) => {
    setSelectedListingId(listingId);
    // increment views count
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, viewsCount: l.viewsCount + 1 } : l))
    );
  };

  const closeListingDetail = () => {
    setSelectedListingId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        updateCurrentUser,
        listings,
        addListing,
        toggleReaction,
        placeBid,
        markAsSold,
        reviews,
        addReview,
        getSellerReviews,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        getOrCreateConversation,
        markConversationAsRead,
        unreadMessagesCount,
        dataSavingMode,
        setDataSavingMode,
        isEffectiveLowData,
        savedDataKb,
        revealedImages,
        revealImageForListing,
        isConnectionSimulatedWeak,
        setIsConnectionSimulatedWeak,
        activeView,
        setActiveView,
        selectedUserIdForProfile,
        openUserProfile,
        selectedListingId,
        openListingDetail,
        closeListingDetail,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProvince,
        setSelectedProvince,
        selectedCity,
        setSelectedCity,
        selectedNeighborhood,
        setSelectedNeighborhood,
        filterByMyLocation,
        clearLocationFilters,
        selectedListingType,
        setSelectedListingType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
