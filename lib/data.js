import { store } from './redux/store';
import { 
  createProperty as createPropertyAction, 
  updateProperty as updatePropertyAction, 
  fetchProperty, 
  fetchAllProperties,
  deleteProperty as deletePropertyAction
} from './redux/slices/propertySlice';

// Función para obtener todas las propiedades
export async function getProperties(filters = {}) {
  return store.dispatch(fetchAllProperties(filters));
}

// Función para obtener una propiedad por ID
export async function getPropertyById(id) {
  return store.dispatch(fetchProperty(id));
}

// Función para crear una nueva propiedad
export async function createProperty(propertyData) {
  return store.dispatch(createPropertyAction(propertyData));
}

// Función para actualizar una propiedad
export async function updateProperty(id, propertyData) {
  return store.dispatch(updatePropertyAction({ id, propertyData }));
}

// Función para eliminar una propiedad
export async function deleteProperty(id) {
  return store.dispatch(deletePropertyAction(id));
}

// Función para obtener propiedades destacadas
export async function getFeaturedProperties() {
  return store.dispatch(fetchAllProperties({ is_featured: true }));
}

// Variable para almacenar la última carga de propiedades
let lastPropertiesCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 10000; // 10 segundos de caché

export async function getPropertyStats() {
  try {
    console.log("getPropertyStats: Solicitando estadísticas de propiedades");
    
    const now = Date.now();
    
    // Usar caché si está disponible y no ha expirado
    if (lastPropertiesCache && (now - lastCacheTime < CACHE_DURATION)) {
      console.log("getPropertyStats: Usando caché de propiedades");
      const properties = lastPropertiesCache;
      
      // Calculate statistics
      const stats = {
        total: properties.length
      };
      
      console.log("getPropertyStats: Estadísticas calculadas", stats);
      return stats;
    }
    
    // Si no hay caché o expiró, hacer nueva petición
    console.log("getPropertyStats: Obteniendo nuevas propiedades");
    const result = await store.dispatch(fetchAllProperties({}));
    
    // Access the properties from the result
    const properties = result.payload;
    
    // Actualizar caché
    lastPropertiesCache = properties;
    lastCacheTime = now;
    
    // Calculate statistics
    const stats = {
      total: properties.length,
    };
    
    console.log("getPropertyStats: Estadísticas calculadas", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching property stats:", error);
    return {
      total: 0
    };
  }
} 