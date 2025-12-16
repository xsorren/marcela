"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { parseEWKBPoint } from "@/utils/geo"
import { getPropertyCoverImage } from "@/utils/image-helpers"

export default function MapboxPropertiesMap({ properties = [], height = "100%", interactive = true, highlightedProperty, onMarkerClick }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const popupRef = useRef(null)
  const router = useRouter()

  // Extraer coordenadas de location (EWKT, EWKB) o usar lat/lng directos
  const getLatLng = (property) => {
    if (property.location && typeof property.location === "string") {
      // 1. Intentar parsear como EWKT (POINT)
      const ewkt = property.location.trim()
      const match = ewkt.match(/POINT\s*\(([-\d.]+) ([-\d.]+)\)/)
      if (match) {
        return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) }
      }
      // 2. Intentar parsear como EWKB (hexadecimal)
      const coords = parseEWKBPoint(property.location)
      if (coords) return coords
    }
    if (property.latitude && property.longitude) {
      return { latitude: property.latitude, longitude: property.longitude }
    }
    return null
  }

  useEffect(() => {
    if (!mapContainerRef.current || properties.length === 0) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    // Limpiar instancia previa
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
    if (popupRef.current) {
      popupRef.current.remove()
      popupRef.current = null
    }

    // Centrar el mapa en la primera propiedad válida o en Buenos Aires
    let firstCoords = null
    for (let i = 0; i < properties.length; i++) {
      const coords = getLatLng(properties[i])
      if (coords) {
        firstCoords = coords
        break
      }
    }
    if (!firstCoords) {
      firstCoords = { latitude: -34.6037, longitude: -58.3816 }
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [firstCoords.longitude, firstCoords.latitude],
      zoom: 12,
      interactive: interactive
    })

    // Añadir marcadores
    properties.forEach(property => {
      const coords = getLatLng(property)
      if (!coords) return
      const marker = new mapboxgl.Marker({ color: "#8A2F4C" })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(map)
        .getElement()
      marker.style.cursor = "pointer"
      marker.addEventListener("click", (e) => {
        e.stopPropagation()
        if (onMarkerClick) onMarkerClick(property.id)
        // Cerrar popup anterior si existe
        if (popupRef.current) {
          popupRef.current.remove()
          popupRef.current = null
        }
        // Crear popup
        const popupInstance = new mapboxgl.Popup({ offset: 18, closeOnClick: true })
          .setLngLat([coords.longitude, coords.latitude])
          .setDOMContent(createPopupContent(property, router))
          .addTo(map)
        popupRef.current = popupInstance
      })
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
    }
    // eslint-disable-next-line
  }, [properties, interactive])

  // Tarjeta popup con info de la propiedad
  function createPopupContent(property, router) {
    const coverUrl = getPropertyCoverImage(property, "/images/interiorcasa.png")
    
    // Formatear precio
    const formattedPrice = property.price ? 
      `USD ${property.price.toLocaleString('es-AR').replace(/,/g, '.')}` : 
      'Consultar precio'
    
    // Determinar tipo de listado
    const listingType = property.listing_type === "sale" ? "Venta" : "Alquiler"
    const listingColor = property.listing_type === "sale" ? "#8A2F4C" : "#22c55e"
    
    const div = document.createElement('div')
    div.style.maxWidth = '280px'
    div.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif'
    div.innerHTML = `
      <div style="
        border-radius: 12px;
        overflow: hidden;
        background: white;
        border: 2px solid #8A2F4C;
        box-shadow: none;
        min-height: fit-content;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <!-- Imagen de la propiedad -->
        <div style="position: relative; width: 100%; height: 160px; overflow: hidden;">
          <img 
            src="${coverUrl}" 
            alt="Propiedad en ${property.address || 'Ubicación'}" 
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: transform 0.3s ease;
            " 
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          />
          
          <!-- Badge de tipo de listado -->
          <div style="
            position: absolute;
            top: 12px;
            left: 12px;
            background: ${listingColor};
            color: white;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 8px;
            padding: 4px 12px;
          ">
            ${listingType}
          </div>
          
          ${property.is_featured ? `
          <!-- Badge de destacada -->
          <div style="
            position: absolute;
            top: 12px;
            right: 12px;
            background: #8A2F4C;
            color: white;
            font-size: 0.75rem;
            font-weight: 500;
            border-radius: 8px;
            padding: 4px 12px;
          ">
            Destacada
          </div>
          ` : ''}
        </div>

        <!-- Información de la propiedad -->
        <div style="padding: 20px;">
          <!-- Precio -->
          <h3 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: #92400e;
            margin: 0 0 12px 0;
            line-height: 1.2;
            font-family: 'Playfair Display', serif;
          ">
            ${formattedPrice}
          </h3>

          <!-- Ubicación -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            color: #6b7280;
          ">
            <svg style="
              width: 16px;
              height: 16px;
              color: #8A2F4C;
              flex-shrink: 0;
              margin-right: 8px;
            " fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <span style="
              font-size: 0.875rem;
              font-weight: 500;
              line-height: 1.4;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">
              ${property.address || 'Sin dirección'}
            </span>
          </div>

          <!-- Características básicas -->
          ${property.bedrooms || property.bathrooms || property.surface ? `
          <div style="
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            font-size: 0.875rem;
            color: #6b7280;
          ">
            ${property.bedrooms ? `
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg style="width: 14px; height: 14px; color: #8A2F4C;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 9.556V3h-2v2H6V3H4v6.556C2.81 10.24 2 11.526 2 13v4a1 1 0 0 0 1 1h1v3h2v-3h12v3h2v-3h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.76-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z"/>
              </svg>
              <span>${property.bedrooms} hab</span>
            </div>
            ` : ''}
            ${property.bathrooms ? `
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg style="width: 14px; height: 14px; color: #8A2F4C;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,2V8H7V10H9C10.11,10 11,10.9 11,12V22H4L4,12A2,2 0 0,1 6,10V8H4V6H6V2H9M12,4V22H20V4H12M16,6A1,1 0 0,1 17,7A1,1 0 0,1 16,8A1,1 0 0,1 15,7A1,1 0 0,1 16,6Z"/>
              </svg>
              <span>${property.bathrooms} baños</span>
            </div>
            ` : ''}
            ${property.surface ? `
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg style="width: 14px; height: 14px; color: #8A2F4C;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2,2V4H4V2H2M20,2V4H22V2H20M2,20V22H4V20H2M20,20V22H22V20H20M6,2V4H18V2H6M2,6V18H4V6H2M20,6V18H22V6H20M6,20V22H18V20H6Z"/>
              </svg>
              <span>${property.surface}m²</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <!-- Botón de acción -->
          <button 
            id="go-to-${property.id}" 
            style="
              background: #8A2F4C;
              color: white;
              font-weight: 600;
              padding: 12px 20px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-size: 0.875rem;
              transition: all 0.2s ease;
              font-family: inherit;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            "
            onmouseover="this.style.backgroundColor='#7A3F12'; this.style.transform='translateY(-1px)'"
            onmouseout="this.style.backgroundColor='#8A2F4C'; this.style.transform='translateY(0)'"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    `
    
    // Configurar eventos del botón
    setTimeout(() => {
      const btn = div.querySelector(`#go-to-${property.id}`)
      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          router.push(`/property/${property.id}`)
        }
      }
      
      // Hacer que toda la card sea clickeable
      const card = div.querySelector('div')
      if (card) {
        card.onclick = (e) => {
          // Solo navegar si no se hizo clic en el botón
          if (!e.target.closest('button')) {
            router.push(`/property/${property.id}`)
          }
        }
      }
    }, 10)
    
    return div
  }

  return <div ref={mapContainerRef} style={{ width: "100%", height }} />
} 