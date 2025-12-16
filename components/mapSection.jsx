"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import MapboxPropertiesMap from "@/components/MapboxPropertiesMap"
import ScrollReveal from "./ScrollReveal"
import { Loader2 } from "lucide-react"
import { fetchPropertiesWithTextLocation } from "@/utils/supabase/properties"
import { parseEWKBPoint } from "@/utils/geo"
import { fetchProperties } from "@/lib/supabase"

export default function MapSection() {
  const [mapProperties, setMapProperties] = useState([])
  const [loadingMap, setLoadingMap] = useState(true)
  const [highlightedProperty, setHighlightedProperty] = useState(null)

  // Extraer lat/lng de cualquier formato válido
  const getLatLng = (property) => {
    if (property.location && typeof property.location === "string") {
      // EWKT
      const match = property.location.trim().match(/POINT\s*\(([-\d.]+) ([-\d.]+)\)/)
      if (match) {
        return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) }
      }
      // EWKB
      const coords = parseEWKBPoint(property.location)
      if (coords) return coords
    }
    if (property.latitude && property.longitude) {
      return { latitude: property.latitude, longitude: property.longitude }
    }
    return null
  }

  useEffect(() => {
    setLoadingMap(true)
    fetchProperties()
      .then(({ data }) => {
        // Filtrar solo las que tengan coordenadas válidas
        const withCoords = data.filter(p => !!getLatLng(p))
        setMapProperties(withCoords)
        setLoadingMap(false)
      })
      .catch(() => setLoadingMap(false))
  }, [])

  // Si no hay propiedades con coordenadas, mostrar la sede central
  const mapPropsToShow = mapProperties.length > 0
    ? mapProperties
    : [{
        id: 'default',
        title: 'Sede central',
        address: 'Buenos Aires, Argentina',
        latitude: -34.6037,
        longitude: -58.3816
      }]

  return (
    <div className="bg-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-3">Mapa de propiedades</h2>
              <p className="text-lg text-neutral-600">Encuentra tu propiedad ideal en el mapa</p>
            </div>
            <div className="hidden md:block">
              <Image 
                src="/images/icon3d.png" 
                alt="Marcela logo" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="w-full h-[600px] bg-white rounded-2xl border-2 border-brand-brown-500 shadow-minimalist overflow-hidden relative hover:shadow-minimalist-hover transition-shadow duration-300">
            {loadingMap && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="h-12 w-12 text-brand-brown-500 animate-spin mb-4" />
                <p className="text-neutral-600 font-medium">Cargando propiedades...</p>
              </div>
            )}
            <MapboxPropertiesMap 
              properties={mapPropsToShow}
              height="600px"
              interactive={true}
              highlightedProperty={highlightedProperty}
              onMarkerClick={setHighlightedProperty}
            />
          </div>
        </ScrollReveal>
        {mapProperties.length > 0 && (
          <ScrollReveal delay={300}>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-brand-brown-50 border border-brand-brown-200 rounded-full">
                <div className="w-2 h-2 bg-brand-brown-500 rounded-full mr-3"></div>
                <p className="text-brand-brown-600 font-medium">
                  {mapProperties.length} {mapProperties.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute top-[15%] right-[5%] w-[150px] h-[150px] rounded-full bg-brand-brown-500/5 blur-2xl"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[120px] h-[120px] rounded-full bg-brand-brown-500/5 blur-2xl"></div>
      
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-brown-100 to-transparent"></div>
      </div>
    </div>
  )
}
