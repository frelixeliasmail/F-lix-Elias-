import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Wifi, SignalLow, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

export const LowDataBanner: React.FC = () => {
  const {
    dataSavingMode,
    setDataSavingMode,
    isEffectiveLowData,
    savedDataKb,
    isConnectionSimulatedWeak,
    setIsConnectionSimulatedWeak,
  } = useApp();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatDataSaved = (kb: number) => {
    if (kb < 1000) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={`border-b transition-colors ${
        isEffectiveLowData
          ? 'bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-yellow-500/10 border-amber-300/40 text-amber-950'
          : 'bg-emerald-500/5 border-emerald-200/50 text-emerald-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isEffectiveLowData ? (
              <span className="p-1 rounded-full bg-amber-500/20 text-amber-800 shrink-0">
                <Zap className="w-4 h-4 text-amber-600" />
              </span>
            ) : (
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-800 shrink-0">
                <Wifi className="w-4 h-4 text-emerald-600" />
              </span>
            )}

            <div>
              <span className="font-bold">
                {isEffectiveLowData
                  ? '⚡ Modo Baixo Consumo (Modo Texto Ativo)'
                  : '📶 Modo Normal (Imagens Carregadas)'}
                :
              </span>{' '}
              <span className="text-slate-700">
                {isEffectiveLowData
                  ? 'A carregar apenas texto, preços e status para poupar saldo de dados em Angola.'
                  : 'Imagens e multimédia carregam automaticamente em redes rápidas.'}
              </span>
              <span className="ml-1.5 font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap">
                Poupança: ~{formatDataSaved(savedDataKb)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline flex items-center gap-0.5"
            >
              <span>{isDetailsOpen ? 'Ocultar detalhes' : 'Como funciona'}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${isDetailsOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable details panel */}
        {isDetailsOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 text-xs text-slate-700 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <SignalLow className="w-3.5 h-3.5 text-amber-600" />
                  Economia Real em Redes Móveis
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Ideal para utilizadores da Unitel, Africell e Movicel. Elimina downloads pesados e abre os anúncios instantaneamente até com rede 2G ou sinal fraco.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Carregamento Sob Demanda
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Em modo texto, você decide se quer ver a foto tocando em "Ver Foto". Só gasta dados com o que realmente lhe interessar comprar.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-600" />
                  Simulação de Conexão
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-slate-500">Qualidade de rede:</span>
                  <button
                    type="button"
                    onClick={() => setIsConnectionSimulatedWeak(!isConnectionSimulatedWeak)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      isConnectionSimulatedWeak
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    {isConnectionSimulatedWeak ? 'Sinal 2G / Fraco' : 'Sinal 4G / Forte'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
