"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Home, MapPin, DollarSign, BedDouble, Clock, Car, Calendar, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { setFilters, selectPropertyFilters } from "@/lib/redux/slices/propertySlice"
import { useRouter, usePathname } from "next/navigation"
import { useClickAway } from "react-use"
import PropertyTypeFilter from "./filters/PropertyTypeFilter"
import LocationFilter from "./filters/LocationFilter"
import PriceFilter from "./filters/PriceFilter"
import RoomsFilter from "./filters/RoomsFilter"
import GarageFilter from "./filters/GarageFilter"
import useMapboxSuggestions from "./hooks/useMapboxSuggestions"
import MapboxSuggestions from "./MapboxSuggestions"

// Datos estáticos 
const propertyTypes = [
  { value: "house", label: "Casa" },
  { value: "apartment", label: "Departamento" },
  { value: "land", label: "Terreno" },
  { value: "office", label: "Oficina" },
  { value: "commercial", label: "Local Comercial" },
  { value: "country_house", label: "Casa de Country" }
];

const locations = [
  "Pilar", "Palermo", "Recoleta", "Belgrano", "Núñez", 
  "Villa Urquiza", "Caballito", "Villa Devoto", "San Isidro", "Vicente López"
];

const defaultRanges = { 
  price: [0, 1000000] // Rango completo por defecto - no se aplica como filtro
};

// Hook para popover simplificado
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));
  return { open, setOpen, ref };
}

// Componente principal
export default function SearchBar({ minimal = false }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const currentFilters = useSelector(selectPropertyFilters) || { listing_type: "sale" };
  
  // Estado centralizado de filtros
  const [filters, setFiltersState] = useState({
    search: "",
    listing_type: currentFilters.listing_type || "sale",
    property_type: "",
    location: [],
    price: defaultRanges.price,
    rooms: "",
    garage: "any"
  });
  
  // Estados básicos
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Sincronizar estado local con filtros de Redux
  useEffect(() => {
    if (currentFilters.listing_type && currentFilters.listing_type !== filters.listing_type) {
      setFiltersState(prev => ({
        ...prev,
        listing_type: currentFilters.listing_type
      }));
    }
  }, [currentFilters.listing_type]);
  
  // Mapbox
  const {
    suggestions,
    isLoading: isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions
  } = useMapboxSuggestions();
  
  // Referencias
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Controles de popover
  const popovers = {
    property_type: usePopover(),
    location: usePopover(),
    price: usePopover(),
    rooms: usePopover(),
    garage: usePopover()
  };
  
  // Sugerencias Mapbox click away
  useClickAway(suggestionsRef, () => setShowSuggestions(false));

  // Handlers de filtros
  const handleFilterChange = (key, value) => {
    setFiltersState(f => {
      const updated = { ...f, [key]: value };
      applyFiltersWithState(updated);
      return updated;
    });
  };

  // Aplica filtros usando un estado dado (para evitar race conditions)
  const applyFiltersWithState = (state, custom = {}) => {
    const base = {
      listing_type: state.listing_type,
      property_type: state.property_type || null,
      search: state.search,
      location: state.location.length > 0 ? state.location : null,
      // Solo aplicar filtros de precio si no están en los valores por defecto
      price_min: (state.price[0] > 0) ? state.price[0] : null,
      price_max: (state.price[1] < 1000000) ? state.price[1] : null,
      rooms: state.rooms === "6+" ? 6 : state.rooms ? parseInt(state.rooms) : null,
      has_garage: state.garage === "any" ? null : state.garage === "yes",
      ...custom
    };
    console.log("SearchBar: Applying filters to Redux:", base);
    dispatch(setFilters(base));
  };

  // Handlers de búsqueda y sugerencias
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setFiltersState(f => ({ ...f, search: value }));
    if (value.trim().length >= 3) {
      if (window.searchTimeout) clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectLocationSuggestion = (suggestion) => {
    if (!suggestion?.text) return;
    setFiltersState(f => ({ ...f, search: suggestion.text }));
    setShowSuggestions(false);
    const simplifiedAddress = suggestion.text.split(',')[0].trim();
    applyFiltersWithState({ ...filters, search: simplifiedAddress });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (showSuggestions && suggestions.length > 0) return;
    if (!filters.search.trim()) return;
    applyFiltersWithState(filters);
  };

  // Limpiar filtros
  const clearFilter = (filterType) => {
    let newState = { ...filters };
    switch (filterType) {
      case 'property_type':
        newState.property_type = "";
        break;
      case 'location':
        newState.location = [];
        break;
      case 'price':
        newState.price = defaultRanges.price;
        break;
      case 'rooms':
        newState.rooms = "";
        break;
      case 'garage':
        newState.garage = "any";
        break;
      case 'all':
        newState = {
          search: "",
          listing_type: filters.listing_type,
          property_type: "",
          location: [],
          price: defaultRanges.price,
          rooms: "",
          garage: "any"
        };
        break;
    }
    setFiltersState(newState);
    applyFiltersWithState(newState);
  };

  return (
    <div className={`relative w-full ${minimal ? 'pb-4' : isScrolled ? 'pb-6 mt-16' : 'pb-12 mt-20'} transition-all duration-300`} style={{ zIndex: minimal ? 10 : 40 }}>
      {/* Background con overlay - Solo para versión no minimal */}
      {!minimal && (
        <div className="absolute inset-0 bg-white -z-10">
          <Image
            src="/images/image6.png"
            alt="Background"
            priority
            fill
            className="object-cover opacity-40"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
        </div>
      )}
      
      {/* Content Container */}
      <div className={`relative ${minimal ? 'z-10' : 'z-30'} w-full max-w-7xl mx-auto px-4 ${minimal ? 'pt-4' : isScrolled ? 'pt-6' : 'pt-12'} transition-all duration-300`}>
        {/* Barra de búsqueda principal */}
        <div className="w-full max-w-3xl mx-auto relative group">
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-stretch rounded-xl overflow-visible transition-all duration-300 ${minimal ? 'border border-neutral-200 hover:border-neutral-300 hover:shadow-lg' : 'shadow-card hover:shadow-card-hover transform-gpu group-hover:scale-[1.01]'} ${isFocused && !minimal ? 'shadow-glow-brown scale-[1.02]' : ''}`}>
              <div className="relative flex-1">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Busca tu próximo hogar..."
                  className={`flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-xl py-3 md:h-[54px] px-6 text-base sm:text-lg cursor-pointer cursor-text w-full text-neutral-700 font-medium border border-r-0 transition-all duration-300 ${
                    minimal 
                      ? 'bg-white border-neutral-200 focus:border-brand-brown-300' 
                      : `bg-white/95 backdrop-blur-sm border-neutral-200 ${isFocused ? 'bg-white border-brand-brown-300' : ''}`
                  }`}
                  value={filters.search}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    setIsFocused(true);
                    if (filters.search.trim().length >= 3) {
                      fetchSuggestions(filters.search);
                    }
                  }}
                  onBlur={() => setIsFocused(false)}
                />
              </div>
              <Button 
                type="submit" 
                className={`rounded-r-xl bg-brand-brown-500 hover:bg-brand-brown-600 px-6 h-auto md:h-[54px] my-0 flex items-center transition-all duration-300 cursor-pointer border border-l-0 border-brand-brown-500 ${
                  minimal ? '' : 'hover:shadow-glow transform-gpu hover:scale-105 active:scale-95'
                }`}
              >
                <Search className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-200 ${minimal ? '' : 'group-hover:rotate-12'}`} />
              </Button>
            </div>
          </form>
          
          {/* Sugerencias Mapbox */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className={`absolute top-full left-0 right-0 w-full border border-neutral-200 rounded-xl max-h-[350px] overflow-y-auto mt-2 ${
                minimal 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/95 backdrop-blur-md shadow-glow animate-fade-in'
              }`}
              style={{ minWidth: '100%', zIndex: minimal ? 1000 : 999999 }}
            >
              <div className="bg-gradient-to-r from-[#8A2F4C] to-[#606648] text-white p-3 text-center font-medium rounded-t-xl">
                {suggestions.length} {suggestions.length === 1 ? 'ubicación encontrada' : 'ubicaciones encontradas'}
              </div>
              <ul className="m-0 p-0">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={suggestion.id}
                    className="p-3 border-b border-gray-200 flex items-start cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-[#F5F0E8] hover:to-[#F0F9F0] hover:scale-[1.01] transform-gpu hover:shadow-sm"
                    onClick={() => handleSelectLocationSuggestion(suggestion)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="mr-3 text-brand-green-500 flex-shrink-0 transition-transform duration-200 hover:scale-110">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="m-0 mb-1 font-medium text-gray-800">{suggestion.text}</p>
                      <p className="m-0 text-xs text-gray-600">
                        {suggestion.place_type === 'address' ? 'Dirección' : 
                         suggestion.place_type === 'place' ? 'Ciudad' : 
                         suggestion.place_type === 'neighborhood' ? 'Barrio' : 
                         suggestion.place_type}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-100 p-2 text-center">
                <button 
                  onClick={() => setShowSuggestions(false)}
                  className="bg-transparent border-0 text-neutral-600 text-sm cursor-pointer px-3 py-2 hover:text-brand-brown-500 font-medium"
                >
                  Cerrar sugerencias
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Versión condicional */}
        <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 ${minimal ? 'mt-6' : 'mt-8'}`}>
          <Button
            variant="outline"
            className={`${minimal ? 'group' : 'group'} rounded-xl px-8 font-semibold text-center min-w-[200px] md:min-w-[220px] h-[48px] md:h-[56px] text-base md:text-lg transition-all duration-300 cursor-pointer border ${
              minimal 
                ? 'border-neutral-200 hover:border-neutral-300' 
                : 'shadow-card hover:shadow-card-hover transform-gpu hover:scale-[1.02]'
            } ${
              filters.listing_type === "rent" 
                ? `bg-brand-green-500 text-white hover:bg-brand-green-600 border-brand-green-500 ${minimal ? '' : 'shadow-glow-green'}` 
                : `text-neutral-700 hover:text-brand-green-600 border-neutral-200 hover:border-brand-green-300 ${minimal ? 'bg-white hover:bg-neutral-50' : 'bg-white/90 backdrop-blur-sm hover:bg-white'}`
            }`}
            onClick={() => handleFilterChange("listing_type", "rent")}
          >
            <span className={`relative z-10 transition-transform duration-200 ${minimal ? '' : 'group-hover:scale-105'}`}>
              Alquilar
            </span>
            {!minimal && filters.listing_type !== "rent" && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#606648]/10 to-[#565A40]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </Button>
          <Button
            variant="outline"
            className={`${minimal ? 'group' : 'group'} rounded-xl px-8 font-semibold text-center min-w-[200px] md:min-w-[220px] h-[48px] md:h-[56px] text-base md:text-lg transition-all duration-300 cursor-pointer border ${
              minimal 
                ? 'border-neutral-200 hover:border-neutral-300' 
                : 'shadow-card hover:shadow-card-hover transform-gpu hover:scale-[1.02]'
            } ${
              filters.listing_type === "sale" 
                ? `bg-brand-brown-500 text-white hover:bg-brand-brown-600 border-brand-brown-500 ${minimal ? '' : 'shadow-glow-brown'}` 
                : `text-neutral-700 hover:text-brand-brown-600 border-neutral-200 hover:border-brand-brown-300 ${minimal ? 'bg-white hover:bg-neutral-50' : 'bg-white/90 backdrop-blur-sm hover:bg-white'}`
            }`}
            onClick={() => handleFilterChange("listing_type", "sale")}
          >
            <span className={`relative z-10 transition-transform duration-200 ${minimal ? '' : 'group-hover:scale-105'}`}>
              Comprar
            </span>
            {!minimal && filters.listing_type !== "sale" && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#8A2F4C]/10 to-[#7A2942]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </Button>
        </div>

        {/* Mostrar filtros activos */}
        {(filters.property_type || 
          filters.location.length > 0 || 
          filters.price[0] > 0 || filters.price[1] < 1000000 || 
          filters.rooms || 
          filters.garage !== "any") && (
          <div className={`flex flex-wrap justify-center items-center gap-2 mt-6 p-4 rounded-xl ${
            minimal 
              ? 'border border-neutral-200 bg-neutral-50' 
              : 'border border-brand-brown-200 bg-gradient-to-r from-brand-brown-50/80 to-white/80 backdrop-blur-sm shadow-card animate-fade-in'
          }`}>
            <div className="text-neutral-700 text-sm mr-2 font-semibold">
              Filtros activos:
              <span className="ml-2 text-xs text-brand-brown-500 font-medium">
                {filters.property_type ? `(Tipo: ${filters.property_type})` : ""}
              </span>
            </div>
            {filters.property_type && (
              <div className={`group text-white text-xs rounded-lg px-3 py-1.5 flex items-center transition-all duration-200 ${
                minimal 
                  ? 'bg-brand-brown-500 hover:bg-brand-brown-600' 
                  : 'bg-gradient-to-r from-[#8A2F4C] to-[#7A2942] shadow-card hover:shadow-glow-brown transform-gpu hover:scale-105'
              }`}>
                <span className={`mr-1 transition-transform duration-200 ${minimal ? '' : 'group-hover:scale-110'}`}>🏠</span>
                {filters.property_type}
                <button onClick={() => clearFilter('property_type')} className={`ml-2 rounded-full p-0.5 transition-all duration-200 ${minimal ? 'hover:bg-white/30' : 'hover:bg-white/20'}`}><X className="h-3 w-3" /></button>
              </div>
            )}
            {filters.location.length > 0 && (
              <div className={`group text-white text-xs rounded-lg px-3 py-1.5 flex items-center transition-all duration-200 ${
                minimal 
                  ? 'bg-brand-green-500 hover:bg-brand-green-600' 
                  : 'bg-gradient-to-r from-[#606648] to-[#565A40] shadow-card hover:shadow-glow-green transform-gpu hover:scale-105'
              }`}>
                <MapPin className={`w-3 h-3 mr-1 transition-transform duration-200 ${minimal ? '' : 'group-hover:scale-110'}`} />
                {filters.location.length > 1 ? `${filters.location.length} ubicaciones` : filters.location[0]}
                <button onClick={() => clearFilter('location')} className={`ml-2 rounded-full p-0.5 transition-all duration-200 ${minimal ? 'hover:bg-white/30' : 'hover:bg-white/20'}`}><X className="h-3 w-3" /></button>
              </div>
            )}
            {(filters.price[0] > 0 || filters.price[1] < 1000000) && (
              <div className="group bg-gradient-to-r from-[#8A2F4C] to-[#7A2942] text-white text-xs rounded-lg px-3 py-1.5 flex items-center shadow-card hover:shadow-glow-brown transition-all duration-200 transform-gpu hover:scale-105">
                <DollarSign className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                ${filters.price[0].toLocaleString()} - ${filters.price[1].toLocaleString()}
                <button onClick={() => clearFilter('price')} className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-all duration-200"><X className="h-3 w-3" /></button>
              </div>
            )}
            {filters.rooms && (
              <div className="group bg-gradient-to-r from-[#606648] to-[#565A40] text-white text-xs rounded-lg px-3 py-1.5 flex items-center shadow-card hover:shadow-glow-green transition-all duration-200 transform-gpu hover:scale-105">
                <Home className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                {filters.rooms} ambientes
                <button onClick={() => clearFilter('rooms')} className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-all duration-200"><X className="h-3 w-3" /></button>
              </div>
            )}
            {filters.garage !== "any" && (
              <div className="group bg-gradient-to-r from-neutral-600 to-neutral-700 text-white text-xs rounded-lg px-3 py-1.5 flex items-center shadow-card hover:shadow-glow transition-all duration-200 transform-gpu hover:scale-105">
                <Car className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                {filters.garage === "yes" ? "Con cochera" : "Sin cochera"}
                <button onClick={() => clearFilter('garage')} className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-all duration-200"><X className="h-3 w-3" /></button>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => clearFilter('all')}
              className={`group text-white border-0 text-xs rounded-lg px-4 py-2 transition-all duration-200 ${
                minimal 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-card hover:shadow-glow transform-gpu hover:scale-105'
              }`}
            >
              <X className={`w-3 h-3 mr-1 transition-transform duration-200 ${minimal ? '' : 'group-hover:rotate-90'}`} />
              Limpiar todos
            </Button>
          </div>
        )}

        {/* Botón de filtros móvil */}
        <div className="md:hidden flex justify-center mt-4">
          <Button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className={`group rounded-xl text-white border-0 px-6 py-3 transition-all duration-300 ${
              minimal 
                ? 'bg-brand-brown-500 hover:bg-brand-brown-600' 
                : 'bg-gradient-to-r from-[#8A2F4C] to-[#7A2942] hover:from-[#7A2942] hover:to-[#6A2238] shadow-card hover:shadow-glow-brown transform-gpu hover:scale-105'
            }`}
          >
            <Filter className={`h-4 w-4 mr-2 transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''} ${minimal ? '' : 'group-hover:scale-110'}`} />
            {isMobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
        </div>

        {/* Filtros avanzados */}
        <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block mt-6 ${minimal ? '' : 'animate-slide-down'}`}>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 overflow-x-auto px-4 py-2 w-full">
            {/* Tipo de propiedad */}
            <Popover open={popovers.property_type.open} onOpenChange={popovers.property_type.setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`group rounded-xl text-neutral-700 border border-neutral-200 whitespace-nowrap px-6 py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                  minimal 
                    ? 'bg-white hover:bg-neutral-50 hover:border-neutral-300' 
                    : 'bg-white/90 backdrop-blur-sm hover:bg-white hover:text-brand-brown-600 hover:border-brand-brown-300 shadow-card hover:shadow-card-hover transform-gpu hover:scale-105'
                } ${filters.property_type ? 'bg-brand-brown-500 text-white border-brand-brown-500' : ''} ${!minimal && filters.property_type ? 'shadow-glow-brown' : ''}`}>
                  <Home className={`h-4 w-4 transition-transform duration-200 ${minimal ? '' : 'group-hover:scale-110'} ${filters.property_type ? 'text-white' : ''}`} />
                  Tipo de Propiedad
                  {filters.property_type && <span className={`ml-1 w-2 h-2 rounded-full bg-white ${minimal ? '' : 'animate-pulse'}`}></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={popovers.property_type.ref} className="w-80 z-50 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-700 p-4 shadow-glow rounded-xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <PropertyTypeFilter 
                  value={filters.property_type}
                  onChange={v => { handleFilterChange('property_type', v); popovers.property_type.setOpen(false); }}
                  onClear={() => { clearFilter('property_type'); popovers.property_type.setOpen(false) }}
                />
              </PopoverContent>
            </Popover>
            {/* Ubicación */}
            <Popover open={popovers.location.open} onOpenChange={popovers.location.setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`group rounded-xl bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-brand-green-600 border border-neutral-200 hover:border-brand-green-300 whitespace-nowrap px-6 py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu hover:scale-105 ${filters.location.length > 0 ? 'bg-brand-green-500 text-white border-brand-green-500 shadow-glow-green' : ''}`}>
                  <MapPin className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${filters.location.length > 0 ? 'text-white' : ''}`} />
                  Ubicación
                  {filters.location.length > 0 && <span className="ml-1 w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={popovers.location.ref} className="w-80 z-50 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-700 p-4 shadow-glow rounded-xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <LocationFilter 
                  value={filters.location}
                  onChange={loc => { handleFilterChange('location', filters.location.includes(loc) ? filters.location.filter(l => l !== loc) : [...filters.location, loc]); }}
                  onClear={() => { clearFilter('location'); popovers.location.setOpen(false) }}
                />
              </PopoverContent>
            </Popover>
            {/* Precio */}
            <Popover open={popovers.price.open} onOpenChange={popovers.price.setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`group rounded-xl bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-brand-brown-600 border border-neutral-200 hover:border-brand-brown-300 whitespace-nowrap px-6 py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu hover:scale-105 ${(filters.price[0] > 0 || filters.price[1] < 500000) ? 'bg-brand-brown-500 text-white border-brand-brown-500 shadow-glow-brown' : ''}`}>
                  <DollarSign className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${(filters.price[0] > 0 || filters.price[1] < 500000) ? 'text-white' : ''}`} />
                  Precio
                  {(filters.price[0] > 0 || filters.price[1] < 500000) && <span className="ml-1 w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={popovers.price.ref} className="w-80 z-50 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-700 p-4 shadow-glow rounded-xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <PriceFilter 
                  value={filters.price}
                  onChange={v => { handleFilterChange('price', v); }}
                  onClear={() => { clearFilter('price'); popovers.price.setOpen(false) }}
                />
              </PopoverContent>
            </Popover>
            {/* Ambientes */}
            <Popover open={popovers.rooms.open} onOpenChange={popovers.rooms.setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`group rounded-xl bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-brand-green-600 border border-neutral-200 hover:border-brand-green-300 whitespace-nowrap px-6 py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu hover:scale-105 ${filters.rooms ? 'bg-brand-green-500 text-white border-brand-green-500 shadow-glow-green' : ''}`}>
                  <BedDouble className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${filters.rooms ? 'text-white' : ''}`} />
                  Ambientes
                  {filters.rooms && <span className="ml-1 w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={popovers.rooms.ref} className="w-80 z-50 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-700 p-4 shadow-glow rounded-xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <RoomsFilter 
                  value={filters.rooms}
                  onChange={v => { handleFilterChange('rooms', v); popovers.rooms.setOpen(false); }}
                  onClear={() => { clearFilter('rooms'); popovers.rooms.setOpen(false) }}
                />
              </PopoverContent>
            </Popover>
            {/* Cochera */}
            <Popover open={popovers.garage.open} onOpenChange={popovers.garage.setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`group rounded-xl bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-neutral-600 border border-neutral-200 hover:border-neutral-300 whitespace-nowrap px-6 py-3 text-sm md:text-base flex items-center gap-2 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300 transform-gpu hover:scale-105 ${filters.garage !== "any" ? 'bg-neutral-600 text-white border-neutral-600 shadow-glow' : ''}`}>
                  <Car className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${filters.garage !== "any" ? 'text-white' : ''}`} />
                  Cochera
                  {filters.garage !== "any" && <span className="ml-1 w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent ref={popovers.garage.ref} className="w-80 z-50 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-700 p-4 shadow-glow rounded-xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <GarageFilter 
                  value={filters.garage}
                  onChange={v => { handleFilterChange('garage', v); popovers.garage.setOpen(false); }}
                  onClear={() => { clearFilter('garage'); popovers.garage.setOpen(false) }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}