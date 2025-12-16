import { getSupabaseClient } from './client';
import { v4 as uuidv4 } from 'uuid';
import { processPropertyImages, withTimeout, formatSupabaseError } from '../propertyFilters';

/**
 * Obtiene propiedades con filtros aplicados
 * @param {Object} filters - Filtros a aplicar
 * @returns {Promise<Object>} - Objeto con data (propiedades) y error (si ocurre)
 */
export const fetchProperties = async (filters = {}) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { data: [], error: new Error("Supabase client is null") };
    }
    
    // Crear consulta base con relación a property_images
    let query = client
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          url,
          is_cover
        )
      `);
    
    // Aplicar filtros de manera más eficiente
    const filterMap = {
      // Filtros básicos que usan eq
      is_featured: (value) => {
        if (value === true) return query.eq('is_featured', true);
        if (value === false) return query.eq('is_featured', false);
        return null; // Si es null o undefined, no filtrar
      },
      property_type: (value) => value ? query.eq('property_type', value) : null,
      listing_type: (value) => value ? query.eq('listing_type', value) : null,
      has_garage: (value) => value !== undefined && value !== null ? query.eq('has_garage', value) : null
    };
    
    // Aplicar filtros básicos
    Object.entries(filters).forEach(([key, value]) => {
      // Saltar valores nulos, undefined o strings vacíos
      if (value === null || value === undefined || value === '') return;
      
      if (filterMap[key]) {
        const result = filterMap[key](value);
        // El filterMap ya maneja la lógica interna
      }
    });
    
    // Aplicar filtros especiales que requieren lógica adicional
    
    // Búsqueda de texto
    if (filters.search) {
      // Asegurar que el término de búsqueda esté limpio para evitar errores en SQL
      const safeSearchTerm = filters.search.replace(/['",;()]/g, '');
      // Construir condiciones de búsqueda seguras
      const searchConditions = [
        `title.ilike.%${safeSearchTerm}%`,
        `description.ilike.%${safeSearchTerm}%`,
        `address.ilike.%${safeSearchTerm}%`
      ].join(',');
      query = query.or(searchConditions);
    }
    
    // Filtro por ubicación(es)
    if (filters.location) {
      if (Array.isArray(filters.location)) {
        // Limpiar cada ubicación para evitar problemas en SQL
        const safeLocations = filters.location.map(location => 
          location.replace(/['",;()]/g, '')
        );
        
        const locationConditions = safeLocations.map(location => 
          `address.ilike.%${location}%`
        ).join(',');
        
        query = query.or(locationConditions);
      } else {
        // Limpiar la ubicación para evitar problemas en SQL
        const safeLocation = filters.location.replace(/['",;()]/g, '');
        query = query.ilike('address', `%${safeLocation}%`);
      }
    }
    
    // Filtro por rango de precios
    if (typeof filters.price_min === 'number' && filters.price_min > 0) {
      query = query.gte('price', filters.price_min);
    }
    if (typeof filters.price_max === 'number' && filters.price_max < 1000000) {
      query = query.lte('price', filters.price_max);
    }
    
    // Filtro por habitaciones
    if (typeof filters.rooms === 'number') {
      if (filters.rooms === 6) {
        query = query.gte('rooms', 6);
      } else {
        query = query.eq('rooms', filters.rooms);
      }
    }
    
    // Filtro por gastos/expensas (si existe el campo)
    if (typeof filters.expenses_min === 'number' && filters.expenses_min > 0) {
      query = query.gte('expenses', filters.expenses_min);
    }
    if (typeof filters.expenses_max === 'number' && filters.expenses_max < 1000) {
      query = query.lte('expenses', filters.expenses_max);
    }
    
    // Filtro por edad/antigüedad (si existe el campo year_built)
    if (filters.age === 'new') {
      // Propiedades construidas en los últimos 5 años
      const currentYear = new Date().getFullYear();
      query = query.gte('year_built', currentYear - 5);
    } else if (filters.age === 'old') {
      // Propiedades construidas hace más de 10 años
      const currentYear = new Date().getFullYear();
      query = query.lte('year_built', currentYear - 10);
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    query = query.order('created_at', { ascending: false });
    
    // Ejecutar la consulta con timeout
    try {
      const { data, error } = await withTimeout(query, 15000);
      
      if (error) {
        return { data: [], error };
      }
      
      // Procesar los datos usando la función auxiliar
      const processedData = data?.map(processPropertyImages) || [];
      
      return { data: processedData, error: null };
    } catch (timeoutError) {
      return { 
        data: [], 
        error: new Error(`Error de conexión: ${timeoutError.message || 'La solicitud tardó demasiado tiempo'}`)
      };
    }
  } catch (error) {
    return { 
      data: [], 
      error: new Error(`Error inesperado: ${error.message || 'Ocurrió un error al cargar las propiedades'}`)
    };
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const client = getSupabaseClient();
    
    // Consulta para obtener la propiedad con sus imágenes relacionadas
    const { data, error } = await client
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          url,
          is_cover
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return { data: null, error };
    }
    
    // Procesar los datos para que las imágenes estén en el formato esperado
    const processedProperty = processPropertyImages(data);
    
    return { data: processedProperty, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: new Error(`Error inesperado: ${error.message || 'Ocurrió un error al cargar la propiedad'}`)
    };
  }
};

export async function createProperty(propertyData) {
  try {
    // Obtener el cliente Supabase
    const supabaseClient = getSupabaseClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Usuario no autenticado. Debe iniciar sesión para crear propiedades.");
    }
    
    console.log("Usuario autenticado:", user.id);
    
    // Extraer images, property_images y location para manejarlos por separado
    const { property_images, images, location, ...propertyDataToInsert } = propertyData;
    
    // Procesar las imágenes de forma unificada
    const imageUrls = [];
    
    // Priorizar property_images si está presente
    if (property_images && property_images.length > 0) {
      property_images.forEach(img => {
        if (typeof img === 'string') {
          imageUrls.push(img);
        } else if (img.url) {
          imageUrls.push(img.url);
        }
      });
    } 
    // Si no hay property_images pero hay images, usar esas
    else if (images && images.length > 0) {
      imageUrls.push(...images);
    }
    
    // Generar un UUID usando la biblioteca uuid
    const id = uuidv4();
    
    // Añadir id y campo images al objeto de propiedad
    const propertyToInsert = {
      id,
      ...propertyDataToInsert,
      images: imageUrls.length > 0 ? imageUrls : null
    };
    
    // Procesar ubicación: convertir a EWKT solo si hay coordenadas válidas
    if (location && 
        typeof location === 'object' && 
        typeof location.latitude === 'number' && 
        typeof location.longitude === 'number' &&
        !isNaN(location.latitude) && 
        !isNaN(location.longitude) &&
        location.latitude >= -90 && location.latitude <= 90 &&
        location.longitude >= -180 && location.longitude <= 180) {
      const { latitude, longitude } = location;
      propertyToInsert.location = `SRID=4326;POINT(${longitude} ${latitude})`;
      console.log("createProperty - Ubicación procesada:", { latitude, longitude, ewkt: propertyToInsert.location });
    } else {
      // Si no hay ubicación válida, no incluir el campo location
      console.log("createProperty - No se encontró ubicación válida, omitiendo campo location");
    }
    
    // Insertar la propiedad en la tabla properties
    const { data: newProperty, error } = await supabaseClient
      .from('properties')
      .insert([propertyToInsert])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear la propiedad: ${error.message}`);
    }

    // Obtener el ID de la propiedad recién creada
    const propertyId = newProperty.id;

    // Insertar imágenes en la tabla property_images si hay imágenes
    if (imageUrls.length > 0) {
      const imageInserts = imageUrls.map((imageUrl, index) => ({
        id: uuidv4(),
        property_id: propertyId,
        url: imageUrl,
        // order: index, // Temporalmente comentado hasta que se ejecute el script de corrección
        is_cover: index === 0 // La primera imagen es la portada por defecto
      }));

      await supabaseClient
        .from('property_images')
        .insert(imageInserts);
    }

    // Obtener la propiedad con sus imágenes
    const { data: propertyWithImages } = await supabaseClient
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          url,
          is_cover
        )
      `)
      .eq('id', propertyId)
      .single();

    // Procesar la propiedad con la función auxiliar
    return propertyWithImages ? processPropertyImages(propertyWithImages) : newProperty;
  } catch (error) {
    throw error;
  }
}

export async function updateProperty({ id, propertyData }) {
  console.log("updateProperty - Iniciando actualización:", { id, propertyData });
  
  if (!id) {
    throw new Error("Se requiere un ID de propiedad para la actualización");
  }

  try {
    // Obtener el cliente Supabase
    const supabaseClient = getSupabaseClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Usuario no autenticado. Debe iniciar sesión para actualizar propiedades.");
    }
    
    console.log("Usuario autenticado para actualización:", user.id);
    
    // Extraer images, property_images y location para manejarlos por separado
    const { property_images, images, location, ...propertyDataToUpdate } = propertyData;
    
    // Procesar las imágenes de forma unificada
    const imageUrls = [];
    
    // Priorizar property_images si está presente
    if (property_images && property_images.length > 0) {
      property_images.forEach(img => {
        if (typeof img === 'string') {
          imageUrls.push(img);
        } else if (img.url) {
          imageUrls.push(img.url);
        }
      });
    } 
    // Si no hay property_images pero hay images, usar esas
    else if (images && images.length > 0) {
      imageUrls.push(...images);
    }
    
    // Actualizar el campo images en la propiedad
    const propertyWithImages = {
      ...propertyDataToUpdate,
      images: imageUrls.length > 0 ? imageUrls : null,
      updated_at: new Date().toISOString()
    };

    // Procesar ubicación: convertir a EWKT solo si hay coordenadas válidas
    // Si location es null o no tiene coordenadas válidas, no incluir el campo
    if (location && 
        typeof location === 'object' && 
        typeof location.latitude === 'number' && 
        typeof location.longitude === 'number' &&
        !isNaN(location.latitude) && 
        !isNaN(location.longitude) &&
        location.latitude >= -90 && location.latitude <= 90 &&
        location.longitude >= -180 && location.longitude <= 180) {
      const { latitude, longitude } = location;
      propertyWithImages.location = `SRID=4326;POINT(${longitude} ${latitude})`;
      console.log("updateProperty - Ubicación procesada:", { latitude, longitude, ewkt: propertyWithImages.location });
    } else {
      // Si no hay ubicación válida, no incluir el campo location en la actualización
      // Esto evita sobrescribir una ubicación existente con un valor inválido
      console.log("updateProperty - No se encontró ubicación válida, omitiendo campo location");
    }

    console.log("updateProperty - Datos finales a actualizar:", propertyWithImages);

    // Actualizar la propiedad en la tabla properties
    const { data: updatedProperty, error } = await supabaseClient
      .from('properties')
      .update(propertyWithImages)
      .eq('id', id)
      .select()
      .single();

    console.log("updateProperty - Resultado de actualización:", { data: updatedProperty, error });

    if (error) {
      throw new Error(`Error al actualizar la propiedad: ${error.message}`);
    }

    // Manejar las imágenes en property_images
    if (imageUrls.length > 0) {
      // Primero, eliminar las imágenes existentes
      await supabaseClient
        .from('property_images')
        .delete()
        .eq('property_id', id);

      // Insertar las nuevas imágenes
      const imageInserts = imageUrls.map((imageUrl, index) => ({
        id: uuidv4(),
        property_id: id,
        url: imageUrl,
        // order: index, // Temporalmente comentado hasta que se ejecute el script de corrección
        is_cover: index === 0 // La primera imagen es la portada por defecto
      }));

      await supabaseClient
        .from('property_images')
        .insert(imageInserts);
    } else {
      // Si no hay imágenes nuevas, eliminar las existentes
      await supabaseClient
        .from('property_images')
        .delete()
        .eq('property_id', id);
    }

    // Obtener la propiedad actualizada con sus imágenes
    const { data: propertyWithUpdatedImages } = await supabaseClient
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          url,
          is_cover
        )
      `)
      .eq('id', id)
      .single();

    // Procesar la propiedad con la función auxiliar
    return propertyWithUpdatedImages ? processPropertyImages(propertyWithUpdatedImages) : updatedProperty;
  } catch (error) {
    throw error;
  }
}

export const deleteProperty = async (id) => {
  const client = getSupabaseClient();
  const { error } = await client
    .from('properties')
    .delete()
    .eq('id', id);
  
  return { error };
};


export const togglePropertyFeatured = async (id, currentFeaturedStatus) => {
  try {
    const client = getSupabaseClient();
    
    // Update only the is_featured flag and updated_at timestamp
    const { data, error } = await client
      .from('properties')
      .update({ 
        is_featured: !currentFeaturedStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return { data: null, error };
    }
    
    // Fetch the updated property with images
    const { data: propertyWithImages, error: fetchError } = await client
      .from('properties')
      .select(`
        *,
        property_images (
          id,
          url,
          is_cover
        )
      `)
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return { data, error: null }; // Return the basic data if we can't get the full property
    }
    
    if (propertyWithImages) {
      return { data: [processPropertyImages(propertyWithImages)], error: null };
    }
    
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}; 