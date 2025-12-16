// Helpers centralizados para filtros de propiedades
import { parseEWKBPoint } from './geo';

export const defaultPropertyFilters = {
  property_type: null,
  is_featured: null, // Cambiado de false a null para no filtrar
  listing_type: null, // Cambiado de '' a null para no filtrar
  search: '',
  location: null,
  price_min: null,
  price_max: null,
  rooms: null,
  has_garage: null
};

/**
 * Limpia y normaliza los filtros para queries y Redux
 * - Elimina claves vacías o nulas (excepto property_type)
 * - Convierte strings vacíos a null
 * - Permite sobreescribir defaults
 */
export function buildPropertyFilters(payload = {}) {
  const filters = { ...defaultPropertyFilters, ...payload };

  // Limpieza general
  Object.keys(filters).forEach(key => {
    if (key === 'property_type') return; // property_type puede ser null
    const value = filters[key];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      filters[key] = null;
    }
  });

  return filters;
}

/**
 * Devuelve solo los filtros activos (para queries)
 */
export function getActiveFilters(filters) {
  const active = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      active[key] = value;
    }
  });
  return active;
}

// Procesa las imágenes de una propiedad para asegurar formato consistente
// También parsea el campo location de EWKB a objeto {latitude, longitude}
export function processPropertyImages(property) {
  if (!property) return property;
  
  let processed = { ...property };
  
  // Procesar imágenes
  if (property.property_images && property.property_images.length > 0) {
    const sortedImages = [...property.property_images].sort((a, b) => a.order - b.order);
    processed.images = sortedImages.map(img => img.url);
  } else if (!property.images) {
    processed.images = [];
  }
  
  // Parsear location de EWKB (hexadecimal) a objeto {latitude, longitude}
  if (property.location && typeof property.location === 'string') {
    const parsedLocation = parseEWKBPoint(property.location);
    if (parsedLocation && parsedLocation.latitude && parsedLocation.longitude) {
      processed.location = {
        latitude: parsedLocation.latitude,
        longitude: parsedLocation.longitude
      };
    } else {
      // Si no se pudo parsear, establecer como null para evitar errores
      processed.location = null;
    }
  } else if (property.location && typeof property.location === 'object') {
    // Si ya es un objeto, validar que tenga las coordenadas correctas
    if (property.location.latitude && property.location.longitude) {
      processed.location = {
        latitude: property.location.latitude,
        longitude: property.location.longitude
      };
    } else {
      processed.location = null;
    }
  }
  
  return processed;
}

// Helper para timeout en promesas
export function withTimeout(promise, timeout = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('La solicitud tardó demasiado tiempo')), timeout))
  ]);
}

// Formatea errores de Supabase para mostrar mensajes uniformes
export function formatSupabaseError(error) {
  if (!error) return 'Error desconocido';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  return JSON.stringify(error);
} 