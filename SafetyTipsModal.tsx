import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, AlertTriangle, CheckCircle, MapPin, Smartphone, CreditCard } from 'lucide-react';
import { SAFE_MEETING_POINTS } from '../data/mockData';

export const SafetyTipsModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Guia de Segurança Zunga</h2>
              <p className="text-xs text-slate-500">Dicas para comprar e vender artigos usados em Angola</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSafetyModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 mb-1">
                Regra Nº 1: NUNCA pague antes de ver o produto!
              </h4>
              <p className="text-amber-900/90 leading-relaxed text-xs">
                Desconfie sempre de vendedores que pedem transferência prévia por Multicaixa Express com desculpas como "reservar o produto" ou "pagar a entrega por motoqueiro". O pagamento deve ser feito presencialmente.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-bold text-xs">
                1
              </div>
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Marque encontros apenas em locais públicos e movimentados
                </h5>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Dê sempre preferência a locais com vigilância e grande fluxo de pessoas durante a luz do dia:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SAFE_MEETING_POINTS.slice(0, 5).map((pt) => (
                    <span key={pt} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium">
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-bold text-xs">
                2
              </div>
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  Inspecione telemóveis e eletrónicos no local
                </h5>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Ligue o aparelho, coloque o seu cartão SIM da Unitel ou Africell, verifique a câmara, o ecrã táctil, estado da bateria e certifique-se de que a conta iCloud ou Google foi completamente desvinculada.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-bold text-xs">
                3
              </div>
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  Pagamento presencial imediato
                </h5>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Faça o pagamento por Multicaixa Express ou em dinheiro no exato momento da entrega, após ambos confirmarem o produto e o valor combinado no chat da Zunga.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-bold text-xs">
                4
              </div>
              <div>
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Consulte a reputação e comentários do perfil
                </h5>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  Verifique quantas estrelas e comentários positivos o vendedor já recebeu de outros compradores angolanos. No final da sua compra, deixe também a sua avaliação para fortalecer a comunidade!
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSafetyModalOpen(false)}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
        >
          Entendi as Recomendações de Segurança
        </button>
      </div>
    </div>
  );
};
