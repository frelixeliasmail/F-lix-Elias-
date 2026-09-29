import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LowDataBanner } from './components/LowDataBanner';
import { FeedView } from './components/FeedView';
import { AuctionsView } from './components/AuctionsView';
import { ProfileView } from './components/ProfileView';
import { ChatModal } from './components/ChatModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { SafetyTipsModal } from './components/SafetyTipsModal';
import {
  ShoppingBag,
  Gavel,
  MessageSquare,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Download,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    openUserProfile,
    currentUser,
    unreadMessagesCount,
    setIsSafetyModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <Header />

      {/* Low Data Mode Awareness Banner */}
      <LowDataBanner />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeView === 'feed' && <FeedView />}
        {activeView === 'auctions' && <AuctionsView />}
        {activeView === 'profile' && <ProfileView />}
        {activeView === 'messages' && <ChatModal />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
              Z
            </div>
            <div>
              <span className="font-black text-white text-sm">Zunga</span>
              <span className="text-slate-500 ml-1.5">— Rede Social de Artigos Usados em Angola</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="/zunga-app.zip"
              download="zunga-app.zip"
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-400/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descarregar Código (ZIP)</span>
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Dicas de Segurança em Encontros</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Otimizado para redes móveis Unitel / Africell</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveView('feed')}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'feed' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Anúncios</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('auctions')}
          className={`flex flex-col items-center gap-0.5 relative ${
            activeView === 'auctions' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Gavel className="w-5 h-5" />
          <span className="text-[10px]">Leilões</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('messages')}
          className={`flex flex-col items-center gap-0.5 relative ${
            activeView === 'messages' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Mensagens</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => openUserProfile(currentUser.id)}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'profile' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Perfil</span>
        </button>
      </div>

      {/* Modals */}
      <ListingDetailModal />
      <CreateListingModal />
      <SafetyTipsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
