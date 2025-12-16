import { getSupabaseClient } from '@/utils/supabase/client';
import * as authClient from '@/utils/supabase/client';
import * as propertiesClient from '@/utils/supabase/properties';

// Exportar cliente Supabase para compatibilidad
export const supabase = getSupabaseClient();

// Re-exportar funciones de autenticación
export const {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession,
  getCurrentUser,
  onAuthStateChange
} = authClient;

// Re-exportar funciones de propiedades
export const {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyFeatured
} = propertiesClient;

/**
 * Normaliza nombres de propiedades de snake_case a camelCase
 * @param {Object|Array} data - Datos a normalizar
 * @returns {Object|Array} - Datos normalizados
 */
export const normalizeToCamelCase = (data) => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizeToCamelCase(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = normalizeToCamelCase(value);
    }
    return result;
  }
  
  return data;
};

/**
 * Normaliza nombres de propiedades de camelCase a snake_case
 * @param {Object|Array} data - Datos a normalizar
 * @returns {Object|Array} - Datos normalizados
 */
export const normalizeToSnakeCase = (data) => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizeToSnakeCase(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const snakeKey = key.replace(/([A-Z])/g, match => `_${match.toLowerCase()}`);
      result[snakeKey] = normalizeToSnakeCase(value);
    }
    return result;
  }
  
  return data;
}; 