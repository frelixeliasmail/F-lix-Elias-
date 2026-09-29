import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  Gavel,
  Tag,
  Camera,
  Trash2,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ItemCondition, ListingType } from '../types';
import { ANGOLAN_PROVINCES, POPULAR_NEIGHBORHOODS, CATEGORIES } from '../data/mockData';

const SAMPLE_IMAGE_PRESETS: { label: string; images: string[] }[] = [
  {
    label: '📱 Telemóvel / iPhone',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    label: '⚡ Gerador Elétrico',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    label: '🎮 Consola / Jogos',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    label: '🛋️ Mobília / Casa',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    label: '👟 Sapatilhas / Roupa',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    ],
  },
];

export const CreateListingModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addListing, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Telemóveis & Tablets');
  const [condition, setCondition] = useState<ItemCondition>('bom_estado');
  const [listingType, setListingType] = useState<ListingType>('fixed');
  const [price, setPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Auction specific
  const [minIncrement, setMinIncrement] = useState<number>(5000);
  const [auctionDurationHours, setAuctionDurationHours] = useState<number>(24);

  // Location
  const [province, setProvince] = useState(currentUser.province || 'Luanda');
  const [city, setCity] = useState(currentUser.city || 'Luanda');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || 'Maianga');

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCreateModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleApplyPreset = (presetImages: string[]) => {
    setImages(presetImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do artigo.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Por favor, indique um preço válido em Kwanzas (Kz).');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Por favor, escreva uma breve descrição do produto.');
      return;
    }

    const finalImages =
      images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
          ];

    const auctionEndsAt =
      listingType === 'auction'
        ? new Date(Date.now() + auctionDurationHours * 3600 * 1000).toISOString()
        : undefined;

    addListing({
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      type: listingType,
      price: Number(price),
      minIncrement: listingType === 'auction' ? minIncrement : undefined,
      auctionEndsAt,
      isAuctionClosed: false,
      images: finalImages,
      province,
      city,
      neighborhood,
      isNegotiable: listingType === 'fixed' ? isNegotiable : false,
      isSold: false,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Publicar Novo Anúncio</h2>
              <p className="text-xs text-slate-500">
                Venda produtos usados para pessoas no seu bairro e província
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Type of Listing Selector: Fixed vs Auction */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Modalidade de Venda
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType('fixed')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  listingType === 'fixed'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Preço Fixo</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Defina um valor exato. Pode marcar como negociável para receber contra-propostas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setListingType('auction')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  listingType === 'auction'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Gavel className="w-4 h-4 text-amber-600" />
                  <span>Leilão Público</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Defina um lance inicial e deixe os compradores disputarem com lances até o fecho.
                </p>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título do Anúncio *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: iPhone 11 128GB Preto com bateria 85% e carregador"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Estado de Conservação *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="como_novo">Como Novo (Sem marcas visíveis)</option>
                <option value="bom_estado">Bom Estado (Funcionamento 100%)</option>
                <option value="marcas_uso">Marcas de Uso (Sinais ligeiros)</option>
              </select>
            </div>
          </div>

          {/* Pricing Section (Fixed vs Auction) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            {listingType === 'fixed' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preço de Venda (Kz) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={500}
                      step={500}
                      placeholder="Ex: 85000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                      Kwanza (Kz)
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Aceito propostas e negociação de preço no chat</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Lance Inicial / Preço Base (Kz) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1000}
                        step={1000}
                        placeholder="Ex: 50000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Kz
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Incremento Mínimo por Lance *
                    </label>
                    <select
                      value={minIncrement}
                      onChange={(e) => setMinIncrement(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                    >
                      <option value={2000}>+ 2.000 Kz</option>
                      <option value={5000}>+ 5.000 Kz</option>
                      <option value={10000}>+ 10.000 Kz</option>
                      <option value={20000}>+ 20.000 Kz</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duração do Leilão
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { hours: 12, label: '12 Horas' },
                      { hours: 24, label: '24 Horas' },
                      { hours: 48, label: '2 Dias' },
                      { hours: 72, label: '3 Dias' },
                    ].map((dur) => (
                      <button
                        key={dur.hours}
                        type="button"
                        onClick={() => setAuctionDurationHours(dur.hours)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          auctionDurationHours === dur.hours
                            ? 'bg-amber-500 border-amber-600 text-slate-950'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Photos (Multiple) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Fotografias do Produto ({images.length})
              </label>
              <span className="text-xs text-slate-400">Pode adicionar várias fotos</span>
            </div>

            {/* Quick Sample Presets */}
            <div className="mb-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Dica Rápida: Usar fotos de amostra para teste imediato:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleApplyPreset(p.images)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-xs font-semibold text-slate-800 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Pré-visualização" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition-colors"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-slate-50 hover:bg-amber-50/30 transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Carregar Foto</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG ou PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Descrição Detalhada *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explique o motivo da venda, o que acompanha o produto, tempo de uso, pontos de encontro preferidos em Angola, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Location in Angola */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Localização do Artigo em Angola *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold mb-1 block">Província:</span>
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    const neighs = POPULAR_NEIGHBORHOODS[e.target.value];
                    if (neighs && neighs.length > 0) {
                      setNeighborhood(neighs[0]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                >
                  {ANGOLAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold mb-1 block">Município / Cidade:</span>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luanda, Talatona, Viana"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold mb-1 block">Bairro / Região:</span>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maianga, Kilamba, Cazenga"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl shadow-md transition-all text-base flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Publicar Artigo na Zunga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
