"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

// Variable to track if the API is already being loaded
let isLoadingAPI = false
let googleMapsLoaded = false

export default function PropertyMap({ 
  properties, 
  center, 
  zoom = 13,
  height = "100%",
  interactive = true,
  highlightedProperty = null,
  onMarkerClick = null
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const apiKey = "AIzaSyDtEpcs9xkoX2VqBfrTUhMwLKrfZSY-UsU"
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  // Convert property to map location format
  const propertiesToLocations = (props) => {
    if (!props) return []
    
    // Handle single property case
    if (!Array.isArray(props)) {
      props = [props]
    }
    
    return props.map(property => ({
      id: property.id,
      position: {
        lat: property.latitude || property.lat || -34.6037,
        lng: property.longitude || property.lng || -58.3816
      },
      title: property.title || 'Propiedad',
      price: property.price,
      listing_type: property.listing_type,
      property_type: property.property_type,
      url: property.url || `/property/${property.id}`,
      image: property.property_images?.[0]?.url || "/images/interiorcasa.png",
      highlighted: highlightedProperty === property.id,
      address: property.address
    }))
  }

  // Calculate map center if not provided
  const getMapCenter = (locations) => {
    if (center) return center
    
    // If only one location, use it as center
    if (locations.length === 1) {
      return locations[0].position
    }
    
    // Calculate the center of all locations
    if (locations.length > 1 && window.google && window.google.maps) {
      const bounds = new google.maps.LatLngBounds()
      locations.forEach(location => {
        bounds.extend(location.position)
      })
      
      return bounds.getCenter().toJSON()
    }
    
    // Default center (Buenos Aires)
    return { lat: -34.6037, lng: -58.3816 }
  }

  // Create map markers
  const createMarkers = (map, locations) => {
    if (!map || !window.google || !window.google.maps) return

    try {
      // Clear any existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      
      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location.position,
          map: map,
          title: location.title,
          animation: location.highlighted ? google.maps.Animation.BOUNCE : null,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: location.highlighted ? 12 : 10,
            fillColor: location.highlighted ? "#D4AF37" : "#9d8429",
            fillOpacity: 1,
            strokeWeight: location.highlighted ? 2 : 0,
            strokeColor: "#D4AF37"
          }
        })
        
        // Create info window if interactive
        if (interactive) {
          const contentString = `
            <div style="width: 220px; max-width: 220px; color: #333;">
              <div style="margin-bottom: 8px; overflow: hidden; height: 100px; background-color: #f0f0f0; position: relative;">
                <img src="${location.image}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; bottom: 0; left: 0; background-color: rgba(212, 175, 55, 0.9); color: black; padding: 2px 6px; font-size: 11px; font-weight: bold; border-top-right-radius: 4px;">
                  ${location.listing_type === 'sale' ? 'Venta' : 'Alquiler'}
                </div>
              </div>
              <h3 style="font-weight: bold; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${location.title}</h3>
              <p style="margin: 0 0 4px; font-size: 11px; color: #666;">${location.address || ''}</p>
              <p style="margin: 0; font-weight: bold; color: #D4AF37; font-size: 14px;">USD ${typeof location.price === 'number' ? location.price.toLocaleString() : location.price}</p>
              <div style="text-align: center; margin-top: 8px;">
                <a href="${location.url}" style="background-color: #D4AF37; color: black; text-decoration: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; display: inline-block;">Ver detalles</a>
              </div>
            </div>
          `
          
          const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 250,
            ariaLabel: location.title
          })
          
          marker.addListener("click", () => {
            // Close all info windows before opening this one
            markersRef.current.forEach(m => {
              if (m.infoWindow) m.infoWindow.close()
            })
            
            infoWindow.open({
              anchor: marker,
              map,
            })
            
            // Call the click handler if provided
            if (onMarkerClick) {
              onMarkerClick(location.id)
            }
          })
          
          // Attach info window to marker reference
          marker.infoWindow = infoWindow
        }
        
        markersRef.current.push(marker)
      })
      
      // If we have multiple markers, fit bounds
      if (markersRef.current.length > 1 && !center) {
        const bounds = new google.maps.LatLngBounds()
        locations.forEach(location => {
          bounds.extend(location.position)
        })
        map.fitBounds(bounds)
        
        // Add a bit of padding
        google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
          if (map.getZoom() > 15) {
            map.setZoom(15)
          }
        })
      }
    } catch (error) {
      console.error("Error creating markers:", error)
      setMapError(true)
    }
  }

  // Initialize the map once Google Maps is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) return

    try {
      // Convert properties to locations
      const locations = propertiesToLocations(properties)
      
      // Get map center
      const mapCenter = center || getMapCenter(locations)
      
      const map = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: zoom,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        scaleControl: interactive,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: interactive,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{"color": "#212121"}]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#212121"}]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#757575"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#2c2c2c"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#171717"}]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{"color": "#171717"}]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{"color": "#1e1e1e"}]
          }
        ]
      })
      
      // Store map instance
      mapInstanceRef.current = map
      
      // Create markers
      createMarkers(map, locations)
      
      // Set map as loaded
      setMapLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError(true)
    }
  }

  // Load Google Maps API only once
  const loadGoogleMapsAPI = () => {
    // If API is already loaded, initialize map
    if (googleMapsLoaded && window.google && window.google.maps) {
      initializeMap()
      return
    }
    
    // If API is already being loaded, wait for it
    if (isLoadingAPI) {
      // Check every 100ms if Google Maps has loaded
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps)
          googleMapsLoaded = true
          initializeMap()
        }
      }, 100)
      
      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkGoogleMaps)
        if (!googleMapsLoaded) {
          setMapError(true)
        }
      }, 10000)
      
      return
    }
    
    // Start loading the API
    isLoadingAPI = true
    
    // Create a unique callback name to avoid conflicts
    const callbackName = `initMap_${Date.now()}`
    window[callbackName] = () => {
      googleMapsLoaded = true
      initializeMap()
      
      // Clean up the callback
      delete window[callbackName]
    }
    
    // Load the script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      console.error("Error loading Google Maps API")
      setMapError(true)
      isLoadingAPI = false
    }
    
    document.head.appendChild(script)
  }

  useEffect(() => {
    // Load Google Maps if it's not already loaded
    loadGoogleMapsAPI()
    
    // Cleanup on unmount - don't remove the script!
    return () => {
      // Clean up any map related resources
      if (mapInstanceRef.current && window.google && window.google.maps) {
        // Clear markers
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [])

  useEffect(() => {
    // Update markers when properties or highlighted property changes
    if (mapLoaded && mapInstanceRef.current && window.google && window.google.maps) {
      const locations = propertiesToLocations(properties)
      createMarkers(mapInstanceRef.current, locations)
    }
  }, [properties, highlightedProperty, mapLoaded])

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <div className="animate-pulse text-[#D4AF37]">
            <MapPin className="h-8 w-8" />
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 bg-zinc-800 flex flex-col items-center justify-center p-4 text-center">
          <MapPin className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-white">Error al cargar el mapa. Por favor, recarga la página.</p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height: height }}
      ></div>
    </div>
  )
}

