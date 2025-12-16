/**
 * Utilidades para trabajar con Mapbox API
 */

/**
 * Realiza reverse geocoding para obtener dirección desde coordenadas
 * @param {number} longitude - Longitud
 * @param {number} latitude - Latitud
 * @returns {Promise<string>} - Dirección formateada
 */
export async function reverseGeocode(longitude, latitude) {
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    console.warn('Token de Mapbox no configurado')
    return ''
  }

  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    console.error('Coordenadas inválidas para reverse geocoding:', { longitude, latitude })
    return ''
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
      `access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&` +
      `country=ar&` +
      `language=es&` +
      `types=address,poi`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name
    }
    
    return ''
  } catch (error) {
    console.error('Error en reverse geocoding:', error)
    return ''
  }
}

/**
 * Realiza geocoding para obtener coordenadas desde dirección
 * @param {string} address - Dirección a geocodificar
 * @returns {Promise<Object|null>} - Objeto con coordenadas y dirección formateada
 */
export async function geocodeAddress(address) {
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    console.warn('Token de Mapbox no configurado')
    return null
  }

  if (!address || typeof address !== 'string') {
    console.error('Dirección inválida para geocoding:', address)
    return null
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim())
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?` +
      `access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&` +
      `country=ar&` +
      `language=es&` +
      `limit=1`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      const [longitude, latitude] = feature.center
      
      return {
        latitude,
        longitude,
        address: feature.place_name,
        source: 'geocoding'
      }
    }
    
    return null
  } catch (error) {
    console.error('Error en geocoding:', error)
    return null
  }
}

/**
 * Valida si las coordenadas están dentro de rangos válidos
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {boolean} - True si las coordenadas son válidas
 */
export function validateCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return false
  }

  if (latitude < -90 || latitude > 90) {
    return false
  }

  if (longitude < -180 || longitude > 180) {
    return false
  }

  return true
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @returns {number} - Distancia en kilómetros
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Formatea coordenadas para mostrar
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @param {number} precision - Número de decimales (default: 6)
 * @returns {string} - Coordenadas formateadas
 */
export function formatCoordinates(latitude, longitude, precision = 6) {
  if (!validateCoordinates(latitude, longitude)) {
    return 'Coordenadas inválidas'
  }

  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`
}

/**
 * Obtiene las coordenadas de Navarro, Buenos Aires para usar como ubicación por defecto
 * @returns {Object} - Coordenadas de Navarro, Buenos Aires
 */
export function getNavarroCoordinates() {
  return {
    latitude: -35.0167,
    longitude: -59.0167,
    zoom: 13
  }
}

/**
 * Obtiene las coordenadas de Navarro, Buenos Aires para usar como ubicación por defecto
 * @returns {Object} - Coordenadas de Navarro, Buenos Aires
 * @deprecated Use getNavarroCoordinates() instead
 */
export function getArgentinaCenterCoordinates() {
  return getNavarroCoordinates()
}

/**
 * Obtiene configuración de mapa por defecto para Navarro, Buenos Aires
 * @returns {Object} - Configuración de mapa
 */
export function getDefaultMapConfig() {
  return {
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-59.0167, -35.0167], // Navarro, Buenos Aires
    zoom: 13,
    country: 'ar',
    language: 'es'
  }
}