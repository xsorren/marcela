/**
 * Utilidades para el manejo de imágenes en la aplicación
 */

/**
 * Formatea una URL de imagen para asegurar que sea accesible públicamente
 * @param {string} imageUrl - La URL o ruta de la imagen a formatear
 * @param {string} defaultImage - Imagen por defecto a usar si imageUrl es null o undefined
 * @returns {string} - La URL formateada correctamente
 */
export const getPublicImageUrl = (imageUrl, defaultImage = "/images/placeholder-property.jpg") => {
  if (!imageUrl) return defaultImage;
  
  // Si ya es una URL completa (contiene http o https), retornarla
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si la URL ya es pública o firmada, retornarla con la URL base
  if (imageUrl.includes('/storage/v1/object/public/') || 
      imageUrl.includes('/storage/v1/object/sign/')) {
    // Si ya incluye el dominio completo, retornarla tal cual
    if (imageUrl.includes(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
      return imageUrl;
    }
    // Si no incluye el dominio, añadirlo
    return process.env.NEXT_PUBLIC_SUPABASE_URL + imageUrl;
  }
  
  // Extraer la ruta relativa si la URL contiene la ruta del bucket
  let relativePath = imageUrl;
  if (imageUrl.includes('property-images/')) {
    relativePath = 'property-images/' + imageUrl.split('property-images/')[1];
  }
  
  // Construir la URL pública correcta
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${relativePath}`;
};

/**
 * Obtiene la imagen de portada de una propiedad, siguiendo un orden de prioridad
 * @param {Object} property - Objeto de propiedad
 * @param {string} defaultImage - Imagen por defecto a usar si no se encuentra ninguna
 * @returns {string} - URL de la imagen de portada formateada
 */
export const getPropertyCoverImage = (property, defaultImage = "/images/interiorcasa.png") => {
  if (!property) return defaultImage;
  
  let rawCoverImage = null;
  
  // 1. Intentar obtener de property_images (prioridad a is_cover)
  if (property.property_images && property.property_images.length > 0) {
    const coverImageData = property.property_images.find(img => img.is_cover) || property.property_images[0];
    rawCoverImage = coverImageData?.url;
  }
  
  // 2. Fallback a property.images array
  if (!rawCoverImage && property.images && property.images.length > 0) {
    rawCoverImage = property.images[0];
  }
  
  // 3. Fallback a property.image (campo simple)
  if (!rawCoverImage && property.image) {
    rawCoverImage = property.image;
  }
  
  // 4. Fallback final a la imagen predeterminada
  if (!rawCoverImage) {
    return defaultImage;
  }
  
  // Formatear la URL para asegurar que sea pública y accesible
  return getPublicImageUrl(rawCoverImage, defaultImage);
};

/**
 * Manejador de errores para imágenes que no se pueden cargar
 * @param {Event} event - Evento de error
 * @param {string} fallbackImage - Imagen de respaldo a mostrar
 */
export const handleImageError = (event, fallbackImage = "/images/placeholder-property.jpg") => {
  console.error(`Error cargando imagen: ${event.target.src}`);
  event.target.src = fallbackImage;
  event.target.onerror = null; // Evita bucles infinitos
}; 