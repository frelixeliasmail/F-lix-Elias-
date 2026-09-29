import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { Gavel, Clock, Sparkles, PlusCircle } from 'lucide-react';

export const AuctionsView: React.FC = () => {
  const { listings, setIsCreateModalOpen } = useApp();

  const auctionListings = listings.filter((l) => l.type === 'auction');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-slate-950/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-950">
            <Gavel className="w-4 h-4" />
            Leilões ao Vivo em Angola
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Compre Artigos Usados ao Melhor Lance
          </h1>
          <p className="text-slate-900/90 text-sm sm:text-base font-medium leading-relaxed">
            Participe nos leilões abertos por vendedores em Luanda, Benguela, Huambo e restantes províncias. Dê lances em tempo real até o relógio fechar!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              Criar o Meu Leilão
            </button>
            <span className="text-xs font-bold text-slate-900 bg-white/40 px-3 py-2 rounded-xl">
              {auctionListings.length} leilões a decorrer agora
            </span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-slate-950 pointer-events-none translate-x-10 translate-y-10">
          <Gavel className="w-80 h-80" />
        </div>
      </div>

      {/* Grid of Auctions */}
      {auctionListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {auctionListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Gavel className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-900 text-lg">Sem leilões ativos no momento</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Seja o primeiro a publicar um leilão de telemóveis, ferramentas, veículos ou artigos para o lar!
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Publicar Leilão Agora
          </button>
        </div>
      )}
    </div>
  );
};
