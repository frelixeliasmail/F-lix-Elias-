import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Compass,
  Building2,
  Home,
  X,
  Search,
  Check,
  Navigation,
} from 'lucide-react';
import {
  ANGOLAN_PROVINCES,
  ANGOLA_MUNICIPALITIES_AND_NEIGHBORHOODS,
  POPULAR_NEIGHBORHOODS,
} from '../data/mockData';

export const LocationFilterBar: React.FC = () => {
  const {
    currentUser,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedNeighborhood,
    setSelectedNeighborhood,
    filterByMyLocation,
    clearLocationFilters,
    listings,
  } = useApp();

  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Available cities/municipalities based on selected province
  const availableCities = useMemo(() => {
    if (selectedProvince === 'Todas') {
      // Gather all known cities from data and listings
      const citiesSet = new Set<string>();
      Object.values(ANGOLA_MUNICIPALITIES_AND_NEIGHBORHOODS).forEach((citiesMap) => {
        Object.keys(citiesMap).forEach((c) => citiesSet.add(c));
      });
      listings.forEach((l) => {
        if (l.city) citiesSet.add(l.city);
      });
      return Array.from(citiesSet).sort();
    }

    const provinceData = ANGOLA_MUNICIPALITIES_AND_NEIGHBORHOODS[selectedProvince];
    if (provinceData) {
      return Object.keys(provinceData).sort();
    }

    // Fallback: extract from listings
    const citiesFromListings = listings
      .filter((l) => l.province.toLowerCase() === selectedProvince.toLowerCase())
      .map((l) => l.city);
    return Array.from(new Set(citiesFromListings)).sort();
  }, [selectedProvince, listings]);

  // Available neighborhoods based on selected province and city
  const availableNeighborhoods = useMemo(() => {
    const list: string[] = [];

    if (selectedProvince !== 'Todas' && selectedCity !== 'Todas') {
      const provinceData = ANGOLA_MUNICIPALITIES_AND_NEIGHBORHOODS[selectedProvince];
      if (provinceData && provinceData[selectedCity]) {
        list.push(...provinceData[selectedCity]);
      }
    } else if (selectedProvince !== 'Todas') {
      const provinceData = ANGOLA_MUNICIPALITIES_AND_NEIGHBORHOODS[selectedProvince];
      if (provinceData) {
        Object.values(provinceData).forEach((neighs) => list.push(...neighs));
      } else if (POPULAR_NEIGHBORHOODS[selectedProvince]) {
        list.push(...POPULAR_NEIGHBORHOODS[selectedProvince]);
      }
    } else {
      // All popular neighborhoods
      Object.values(POPULAR_NEIGHBORHOODS).forEach((neighs) => list.push(...neighs));
    }

    // Add any neighborhoods present in current listings
    listings.forEach((l) => {
      if (
        (selectedProvince === 'Todas' || l.province.toLowerCase() === selectedProvince.toLowerCase()) &&
        (selectedCity === 'Todas' || l.city.toLowerCase() === selectedCity.toLowerCase())
      ) {
        if (l.neighborhood && !list.includes(l.neighborhood)) {
          list.push(l.neighborhood);
        }
      }
    });

    return Array.from(new Set(list)).sort();
  }, [selectedProvince, selectedCity, listings]);

  // Filtered neighborhoods based on quick search
  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoodSearch.trim()) return availableNeighborhoods;
    const q = neighborhoodSearch.toLowerCase();
    return availableNeighborhoods.filter((n) => n.toLowerCase().includes(q));
  }, [availableNeighborhoods, neighborhoodSearch]);

  // Check if current filter matches user's location
  const isMyLocationActive =
    selectedProvince === currentUser.province &&
    selectedCity === currentUser.city &&
    selectedNeighborhood === currentUser.neighborhood;

  // Has any location filter applied
  const hasActiveLocationFilter =
    selectedProvince !== 'Todas' || selectedCity !== 'Todas' || selectedNeighborhood !== 'Todos';

  // Count items matching location
  const locationMatchesCount = useMemo(() => {
    return listings.filter((l) => {
      if (selectedProvince !== 'Todas' && l.province.toLowerCase() !== selectedProvince.toLowerCase()) return false;
      if (selectedCity !== 'Todas' && l.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedNeighborhood !== 'Todos' && !l.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())) return false;
      return true;
    }).length;
  }, [listings, selectedProvince, selectedCity, selectedNeighborhood]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
      {/* Header bar of Location Filter */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Filtrar por Localização em Angola</span>
              {hasActiveLocationFilter && (
                <span className="text-[10px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  {locationMatchesCount} {locationMatchesCount === 1 ? 'artigo' : 'artigos'}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              Encontre vendedores perto de si para negociar e combinar entrega em mão
            </p>
          </div>
        </div>

        {/* Action shortcuts */}
        <div className="flex items-center gap-2">
          {/* Quick "Perto de Mim" button */}
          <button
            type="button"
            onClick={filterByMyLocation}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
              isMyLocationActive
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
            title={`Filtrar para ${currentUser.neighborhood}, ${currentUser.city}`}
          >
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span>Perto de Mim ({currentUser.neighborhood})</span>
            {isMyLocationActive && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
          </button>

          {hasActiveLocationFilter && (
            <button
              type="button"
              onClick={clearLocationFilters}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Limpar localização"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 underline ml-1"
          >
            {isExpanded ? 'Menos opções' : 'Mais bairros'}
          </button>
        </div>
      </div>

      {/* Main Selectors Row */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
        {/* 1. Província */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-600" />
            1. Província
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
          >
            <option value="Todas">Todas as Províncias de Angola</option>
            {ANGOLAN_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Cidade / Município */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-600" />
            2. Cidade / Município
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
          >
            <option value="Todas">
              {selectedProvince !== 'Todas' ? `Todos os Municípios de ${selectedProvince}` : 'Todos os Municípios / Cidades'}
            </option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Bairro / Região */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
            <Home className="w-3 h-3 text-amber-600" />
            3. Bairro / Região
          </label>
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
          >
            <option value="Todos">
              {selectedCity !== 'Todas' ? `Todos os Bairros de ${selectedCity}` : 'Todos os Bairros'}
            </option>
            {availableNeighborhoods.map((bairro) => (
              <option key={bairro} value={bairro}>
                {bairro}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Popular Neighborhoods Chips */}
      <div className="px-3 sm:px-4 pb-3 pt-0 border-t border-slate-100 bg-white">
        <div className="pt-2.5 flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-600" />
            Bairros Populares {selectedCity !== 'Todas' ? `em ${selectedCity}` : selectedProvince !== 'Todas' ? `em ${selectedProvince}` : 'em Luanda e resto do país'}:
          </span>

          {isExpanded && (
            <div className="relative w-40 sm:w-56">
              <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar bairro..."
                value={neighborhoodSearch}
                onChange={(e) => setNeighborhoodSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedNeighborhood('Todos')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedNeighborhood === 'Todos'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todos os Bairros
          </button>

          {(isExpanded ? filteredNeighborhoods : availableNeighborhoods.slice(0, 10)).map((bairro) => {
            const isSelected = selectedNeighborhood.toLowerCase() === bairro.toLowerCase();
            // Count matching items
            const count = listings.filter((l) =>
              l.neighborhood.toLowerCase().includes(bairro.toLowerCase())
            ).length;

            return (
              <button
                key={bairro}
                type="button"
                onClick={() => setSelectedNeighborhood(bairro)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-2xs'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-200/80 hover:border-amber-300'
                }`}
              >
                <span>{bairro}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
