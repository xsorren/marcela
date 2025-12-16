"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Search, ChevronDown, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { setFilters, selectPropertyFilters } from "@/lib/redux/slices/propertySlice"
import { useClickAway } from "react-use"
// ========================================
// 🎄 HOLIDAY MODE - Imports
// ========================================
import { isHolidayModeActive, HOLIDAY_CONFIG } from "@/config/features"
import { HolidayBanner, SnowEffect } from "@/components/holiday"
// ========================================

export default function Hero() {
  const router = useRouter()
  const dispatch = useDispatch()
  const currentFilters = useSelector(selectPropertyFilters) || {}
  
  // Estados principales
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("sale")
  const [selectedPropertyType, setSelectedPropertyType] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false)
  
  // ========================================
  // 🎄 HOLIDAY MODE - State
  // ========================================
  const showHoliday = isHolidayModeActive()
  // ========================================
  
  // Estados para sugerencias
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  
  // Referencias
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)
  
  // Lista de tipos de propiedades
  const propertyTypes = [
    { value: "house", label: "Casa" },
    { value: "apartment", label: "Departamento" },
    { value: "land", label: "Terreno" },
    { value: "office", label: "Oficina" },
    { value: "commercial", label: "Local Comercial" },
    { value: "country_house", label: "Casa de Country" }
  ]

  // Cerrar sugerencias al hacer clic fuera
  useClickAway(suggestionsRef, () => setShowSuggestions(false))

  useEffect(() => {
    // Inicializar desde Redux
    if (currentFilters) {
      if (currentFilters.listing_type) setSearchType(currentFilters.listing_type)
      if (currentFilters.search) setSearchQuery(currentFilters.search)
      if (currentFilters.property_type) setSelectedPropertyType(currentFilters.property_type)
    }
    
    // Activar animación
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (propertyTypeOpen && !event.target.closest('.property-type-dropdown')) {
        setPropertyTypeOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [propertyTypeOpen, currentFilters])

  // Obtener sugerencias de ubicación
  const fetchLocationSuggestions = async (query) => {
    if (!query || query.trim().length < 3) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiaG9tZXZlciIsImEiOiJjbG84ejV6b3QwMGJuMmpvM3kwNzR3ZjBqIn0.JKAFJ4ixzUPq1Jvb_Z5i4A'
      
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`
      const params = new URLSearchParams({
        access_token: mapboxToken,
        country: 'ar',
        types: 'place,locality,neighborhood,address,poi',
        proximity: '-58.3816,-34.6037',
        language: 'es',
        limit: 5
      })

      const response = await fetch(`${endpoint}?${params.toString()}`)
      
      if (!response.ok) throw new Error(`Error en Mapbox: ${response.status}`)
      
      const data = await response.json()
      
      if (data && data.features) {
        const suggestions = data.features.map(feature => ({
          id: feature.id,
          text: feature.place_name_es || feature.place_name,
          place_type: feature.place_type[0],
          coordinates: feature.center
        }))
        
        setLocationSuggestions(suggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error al buscar ubicaciones:", error)
      setLocationSuggestions([])
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Manejar cambios en el input con debounce
  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim().length >= 3) {
      if (window.searchTimeout) clearTimeout(window.searchTimeout)
      window.searchTimeout = setTimeout(() => fetchLocationSuggestions(value), 300)
    } else {
      setLocationSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Seleccionar ubicación de sugerencias
  const handleSelectLocation = (suggestion) => {
    if (!suggestion || !suggestion.text) return
    
    setSearchQuery(suggestion.text)
    setShowSuggestions(false)
    
    // Simplificar la dirección
    const simplifiedAddress = suggestion.text.split(',')[0].trim()
    
    // Aplicar filtros
    const filters = {
      listing_type: searchType,
      search: simplifiedAddress,
    }
    
    if (selectedPropertyType) filters.property_type = selectedPropertyType
    if (suggestion.coordinates?.length === 2) filters.coordinates = suggestion.coordinates
    
    dispatch(setFilters(filters))
  }

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Ahora siempre redirigimos a /listado con el listing_type correcto
    const targetPage = "/listado"
    
    // Si hay sugerencias visibles, seleccionar la primera
    if (showSuggestions && locationSuggestions.length > 0) {
      handleSelectLocation(locationSuggestions[0])
      router.push(targetPage)
      return
    }
    
    if (searchQuery.trim() === '') return
    
    // Simplificar término de búsqueda
    let searchTerm = searchQuery.includes(',') ? searchQuery.split(',')[0].trim() : searchQuery
    
    const filters = {
      listing_type: searchType,
      search: searchTerm,
    }
    
    if (selectedPropertyType) filters.property_type = selectedPropertyType
    
    dispatch(setFilters(filters))
    router.push(targetPage)
  }

  // Cambiar tipo de búsqueda
  const handleSearchTypeChange = (type) => {
    setSearchType(type)
    
    const filters = {
      listing_type: type,
    }
    
    if (searchQuery.trim() !== "") filters.search = searchQuery
    if (selectedPropertyType) filters.property_type = selectedPropertyType
    
    dispatch(setFilters(filters))
  }

  // Seleccionar tipo de propiedad
  const handlePropertyTypeSelect = (value) => {
    const newType = selectedPropertyType === value ? "" : value
    setSelectedPropertyType(newType)
    
    const filters = {
      listing_type: searchType,
      property_type: newType
    }
    
    if (searchQuery.trim() !== "") filters.search = searchQuery
    if (newType) filters.property_type = newType
    
    dispatch(setFilters(filters))
    setPropertyTypeOpen(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-50">
      {/* ========================================
          🎄 HOLIDAY MODE - Banner y efectos
          ======================================== */}
      {showHoliday && HOLIDAY_CONFIG.showBanner && <HolidayBanner />}
      {showHoliday && HOLIDAY_CONFIG.showSnowEffect && <SnowEffect />}
      {/* ======================================== */}
      {/* Background Image - More subtle overlay for minimalist look */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-background.jpg"
          alt="Encuentra tu hogar ideal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[50%_40%] transition-transform duration-700 hover:scale-[1.02]"
        />
        {/* Overlay más leve para oscurecer la imagen de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-neutral-900/50"></div>
      </div>

      {/* Content - Clean and spacious */}
      <div className={`relative z-40 flex flex-col items-center justify-center h-full px-6 md:px-8 pt-20 md:pt-0 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Title - Elegant typography */}
        <div className="text-center mb-8 md:mb-12 max-w-5xl mx-auto">
          <h1 className="font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] leading-[1.2] sm:leading-[1.15] md:leading-[1.1] text-[clamp(2rem,6vw,4rem)] md:text-[clamp(2.5rem,5vw,4.75rem)] lg:text-[clamp(3rem,4.5vw,5.5rem)]">
            <span className="font-heading drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] block">Porque construir un mejor mañana...</span>
              <span style={{color: '#8A2F4C'}} className="font-heading block mt-1 text-[1.05em] sm:text-[1.1em]">Empieza{"\u00A0"}Hoy</span>
          </h1>
          {/* ========================================
              🎄 HOLIDAY MODE - Mensaje festivo
              ======================================== */}
          {showHoliday ? (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.40)]">
              <span className="inline-block mr-2">✨</span>
              Celebra las fiestas encontrando tu hogar ideal
              <span className="inline-block ml-2">✨</span>
            </p>
          ) : (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.40)]">
              Experiencia inmobiliaria profesional y personalizada
            </p>
          )}
          {/* ======================================== */}
        </div>

        {/* Search Bar - Clean and modern */}
        <div className="relative w-full max-w-4xl mx-auto mb-8 md:mb-10">
          <form onSubmit={handleSearch} className="shadow-minimalist">
            <div className="flex items-center bg-white rounded-xl overflow-hidden">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="¿Dónde quieres vivir?"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full px-6 sm:px-8 py-4 md:py-5 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-brand-brown-500 transition-all duration-200 text-neutral-700 font-medium placeholder:text-neutral-400"
                onFocus={() => {
                  if (searchQuery.trim().length >= 3) fetchLocationSuggestions(searchQuery)
                }}
              />
              <button
                type="submit"
                className="flex items-center justify-center px-6 sm:px-8 py-4 md:py-5 bg-brand-brown-500 hover:bg-brand-brown-600 transition-all duration-200 group"
              >
                <Search className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </form>

          {/* Location Suggestions - Clean design */}
          {showSuggestions && locationSuggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 w-full bg-white border border-neutral-200 rounded-xl shadow-minimalist-hover z-[70] max-h-[350px] overflow-y-auto mt-2"
            >
              <div className="bg-gradient-to-r from-[#8A2F4C] to-[#606648] text-white p-3 text-center font-medium">
                {locationSuggestions.length} {locationSuggestions.length === 1 ? 'ubicación encontrada' : 'ubicaciones encontradas'}
              </div>
              <ul className="m-0 p-0">
                {locationSuggestions.map((suggestion) => (
                  <li 
                    key={suggestion.id}
                    className="p-4 border-b border-neutral-100 flex items-start cursor-pointer transition-colors hover:bg-neutral-50 last:border-b-0"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    <span className="mr-3 text-brand-green-500 flex-shrink-0 mt-0.5">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="m-0 mb-1 font-medium text-neutral-800">{suggestion.text}</p>
                      <p className="m-0 text-sm text-neutral-500">
                        {suggestion.place_type === 'address' ? 'Dirección' : 
                         suggestion.place_type === 'place' ? 'Ciudad' : 
                         suggestion.place_type === 'neighborhood' ? 'Barrio' : 
                         suggestion.place_type}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-neutral-50 p-3 text-center border-t border-neutral-100">
                <button 
                  onClick={() => setShowSuggestions(false)}
                  className="text-neutral-600 text-sm font-medium hover:text-brand-brown-500 transition-colors"
                >
                  Cerrar sugerencias
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Clean and minimal */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 w-full max-w-4xl mx-auto">
          <button
            className={`rounded-xl px-8 md:px-10 py-4 md:py-5 font-semibold text-center min-w-[200px] md:min-w-[240px] text-lg md:text-xl transition-all duration-200 shadow-minimalist hover:shadow-minimalist-hover transform hover:scale-[1.02] ${
              searchType === "rent" 
                ? "bg-brand-green-500 text-white hover:bg-brand-green-600" 
                : "bg-white text-brand-green-500 border-2 border-brand-green-500 hover:bg-brand-green-500 hover:text-white"
            }`}
            onClick={() => handleSearchTypeChange("rent")}
          >
            Alquilar
          </button>
          <button
            className={`rounded-xl px-8 md:px-10 py-4 md:py-5 font-semibold text-center min-w-[200px] md:min-w-[240px] text-lg md:text-xl transition-all duration-300 shadow-soft hover:shadow-card transform hover:scale-[1.02] active:scale-[0.98] ${
              searchType === "sale" 
                ? "bg-brand-brown-500 text-white hover:bg-brand-brown-600 shadow-glow" 
                : "bg-white text-brand-brown-500 border-2 border-brand-brown-500 hover:bg-brand-brown-500 hover:text-white hover:shadow-glow"
            }`}
            onClick={() => handleSearchTypeChange("sale")}
          >
            Comprar
          </button>
          
          {/* Property Type Dropdown - Clean design */}
          <div className="relative property-type-dropdown hidden md:block z-[60]">
            <button
              className={`rounded-xl px-8 md:px-10 py-4 md:py-5 font-semibold text-center min-w-[200px] md:min-w-[240px] text-lg md:text-xl transition-all duration-200 shadow-minimalist hover:shadow-minimalist-hover bg-white text-neutral-700 border-2 border-neutral-300 hover:border-brand-brown-500 flex items-center justify-between ${selectedPropertyType ? 'border-brand-brown-500 text-brand-brown-500' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setPropertyTypeOpen(!propertyTypeOpen)
              }}
            >
              <span>
                {selectedPropertyType 
                  ? propertyTypes.find(t => t.value === selectedPropertyType)?.label || "Tipo de propiedad"
                  : "Tipo de propiedad"}
              </span>
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-200 ${propertyTypeOpen ? 'rotate-180' : ''}`} />
            </button>

            {propertyTypeOpen && (
              <div className="absolute left-0 right-0 z-[70] mt-2 bg-white rounded-xl shadow-minimalist-hover border border-neutral-200 overflow-hidden">
                <div className="py-2">
                  {propertyTypes.map((type) => (
                    <button 
                      key={type.value}
                      onClick={() => handlePropertyTypeSelect(type.value)}
                      className={`block w-full text-left px-6 py-3 text-base text-neutral-700 hover:bg-neutral-50 hover:text-brand-brown-500 transition-colors font-medium ${selectedPropertyType === type.value ? 'bg-brand-brown-50 text-brand-brown-600' : ''}`}
                    >
                      {type.label}
                    </button>
                  ))}
                  
                  {selectedPropertyType && (
                    <button 
                      onClick={() => handlePropertyTypeSelect(selectedPropertyType)}
                      className="block w-full text-left px-6 py-3 text-base text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors border-t border-neutral-100 font-medium"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

