"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

export default function MapboxMap({ latitude, longitude, zoom = 15, interactive = true, height = "100%" }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current || latitude === null || longitude === null) return

    // Establecer el token de Mapbox
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    // Limpiar instancia previa si existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Crear el mapa
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: zoom,
      interactive: interactive
    })

    // Añadir un marcador en la ubicación
    new mapboxgl.Marker({ color: "#D4AF37" })
      .setLngLat([longitude, latitude])
      .addTo(map)

    // Guardar referencia
    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, zoom, interactive])

  return <div ref={mapContainerRef} style={{ width: "100%", height }} />
} 