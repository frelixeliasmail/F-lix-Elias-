import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Gavel,
  MessageSquare,
  User as UserIcon,
  PlusCircle,
  Zap,
  Wifi,
  ShieldCheck,
  Search,
  ChevronDown,
  MapPin,
  Download,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    activeView,
    setActiveView,
    setIsCreateModalOpen,
    setIsSafetyModalOpen,
    unreadMessagesCount,
    dataSavingMode,
    setDataSavingMode,
    isEffectiveLowData,
    openUserProfile,
    searchQuery,
    setSearchQuery,
    selectedProvince,
    selectedCity,
    selectedNeighborhood,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar: Data mode indicator & user switcher */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Low Data Mode controls */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              {isEffectiveLowData ? (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  Modo Texto (Poupança Ativa)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  <Wifi className="w-3.5 h-3.5" />
                  Modo Normal (Imagens)
                </span>
              )}
            </span>

            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setDataSavingMode('text_only')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  dataSavingMode === 'text_only'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Consumo quase zero: apenas texto sem carregar fotos"
              >
                Texto / 2G
              </button>
              <button
                type="button"
                onClick={() => setDataSavingMode('normal')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  dataSavingMode === 'normal'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Carrega todas as imagens normalmente"
              >
                Normal / 4G
              </button>
              <button
                type="button"
                onClick={() => setDataSavingMode('auto')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  dataSavingMode === 'auto'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Detecta ligação fraca automaticamente"
              >
                Auto
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher & Download Zip */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/zunga-app.zip"
              download="zunga-app.zip"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded text-[11px] shadow-xs transition-colors"
              title="Descarregar o código completo do projeto em arquivo ZIP"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar ZIP do App</span>
            </a>

            <button
              type="button"
              onClick={() => setIsSafetyModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Dicas de Segurança em Angola</span>
            </button>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <span className="text-slate-400 hidden sm:inline">Utilizador:</span>
              <div className="relative inline-block">
                <select
                  value={currentUser.id}
                  onChange={(e) => switchUser(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.neighborhood})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo brand */}
          <div
            onClick={() => setActiveView('feed')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  Zunga
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Angola
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-1 hidden sm:block">
                Mercado Social de Usados & Leilões
              </p>
            </div>
          </div>

          {/* Search input in desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar telemóveis, geradores, sofás, peças..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Location Badge in Header */}
            <button
              type="button"
              onClick={() => setActiveView('feed')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-amber-100/70 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-950 transition-colors shrink-0 shadow-2xs"
              title="Filtrar por cidade ou bairro"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="max-w-[140px] truncate">
                {selectedNeighborhood !== 'Todos'
                  ? selectedNeighborhood
                  : selectedCity !== 'Todas'
                  ? selectedCity
                  : selectedProvince !== 'Todas'
                  ? selectedProvince
                  : 'Angola'}
              </span>
            </button>
          </div>

          {/* Action buttons & Nav links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveView('feed')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeView === 'feed'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Anúncios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('auctions')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  activeView === 'auctions'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Gavel className="w-4 h-4" />
                <span>Leilões</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('messages')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  activeView === 'messages'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Mensagens</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => openUserProfile(currentUser.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  activeView === 'profile' && currentUser.id === currentUser.id
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Perfil</span>
              </button>
            </nav>

            {/* Publish listing CTA */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Publicar</span>
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar artigos usados em Angola..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
