export type ListingType = 'fixed' | 'auction';

export type ItemCondition = 'como_novo' | 'bom_estado' | 'marcas_uso';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  province: string;
  city: string;
  neighborhood: string;
  bio: string;
  joinedYear: number;
  isVerified: boolean;
  rating: number; // e.g. 4.8
  reviewCount: number;
  lastActive: string; // 'Agora' or timestamp / relative time
  isOnline: boolean;
}

export interface Review {
  id: string;
  sellerId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  transactionItemTitle?: string;
  recommended: boolean;
}

export type ReactionType = 'like' | 'fire' | 'deal' | 'negotiate';

export interface ReactionCounts {
  like: number; // ❤️ Gosto
  fire: number; // 🔥 Top
  deal: number; // 💡 Bom Negócio
  negotiate: number; // 🤝 Quero Negociar
}

export interface UserReaction {
  userId: string;
  type: ReactionType;
}

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  bidderLocation: string;
  amount: number; // in Kz
  timestamp: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  type: ListingType;
  price: number; // Fixed price OR starting price if auction (in Kz)
  currentBid?: number; // Current highest bid if auction
  minIncrement?: number; // Minimum bid increment in Kz (e.g. 2000 Kz)
  auctionEndsAt?: string; // ISO string
  bids?: Bid[];
  isAuctionClosed?: boolean;
  images: string[];
  sellerId: string;
  province: string;
  city: string;
  neighborhood: string;
  createdAt: string;
  isNegotiable?: boolean;
  isSold?: boolean;
  reactions: ReactionCounts;
  userReactions: UserReaction[];
  viewsCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerAmount?: number;
  proposedLocation?: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export type DataSavingMode = 'auto' | 'text_only' | 'normal';
