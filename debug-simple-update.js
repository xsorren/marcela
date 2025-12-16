// Script simple para debuggear la actualización de propiedades
// Ejecutar en la consola del navegador

async function debugPropertyUpdate(propertyId, testData = null) {
  console.log("🔧 Iniciando debug de actualización de propiedad...");
  
  // Datos de prueba por defecto
  const defaultTestData = {
    title: "Propiedad de Prueba - Editada " + new Date().toLocaleTimeString(),
    description: "Esta es una descripción editada para pruebas",
    address: "Nueva dirección de prueba, Buenos Aires",
    price: 150000,
    property_type: "house",
    listing_type: "sale"
  };
  
  const dataToUpdate = testData || defaultTestData;
  
  console.log("📋 Datos a actualizar:", { id: propertyId, data: dataToUpdate });
  
  try {
    // Importar las funciones necesarias
    const { updateProperty } = await import('/utils/supabase/properties.js');
    
    console.log("✅ Función importada correctamente");
    
    // Probar actualización directa
    console.log("🚀 Ejecutando actualización directa...");
    const result = await updateProperty({ 
      id: propertyId, 
      propertyData: dataToUpdate 
    });
    
    console.log("✅ Actualización exitosa:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Error en actualización:", error);
    console.error("📊 Detalles del error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}

// Función para probar Redux
async function debugReduxUpdate(propertyId, testData = null) {
  console.log("🔧 Iniciando debug de Redux...");
  
  const defaultTestData = {
    title: "Propiedad Redux - Editada " + new Date().toLocaleTimeString(),
    description: "Esta es una descripción editada via Redux",
    address: "Nueva dirección Redux, Buenos Aires",
    price: 175000,
    property_type: "apartment",
    listing_type: "sale"
  };
  
  const dataToUpdate = testData || defaultTestData;
  
  try {
    // Verificar que Redux esté disponible
    if (typeof window !== 'undefined' && window.__REDUX_STORE__) {
      const store = window.__REDUX_STORE__;
      console.log("✅ Redux store encontrado");
      
      // Importar la acción
      const { updateProperty } = await import('/lib/redux/slices/propertySlice.js');
      
      console.log("🚀 Ejecutando actualización via Redux...");
      const result = await store.dispatch(updateProperty({ 
        id: propertyId, 
        propertyData: dataToUpdate 
      }));
      
      console.log("✅ Redux actualización resultado:", result);
      return result;
      
    } else {
      console.error("❌ Redux store no encontrado");
      console.log("💡 Asegúrate de estar en una página que use Redux");
    }
    
  } catch (error) {
    console.error("❌ Error en Redux:", error);
    throw error;
  }
}

// Función para obtener una propiedad existente
async function getExistingProperty() {
  try {
    const { fetchProperties } = await import('/utils/supabase/properties.js');
    const { data, error } = await fetchProperties({ listing_type: 'sale' });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const property = data[0];
      console.log("🏠 Propiedad encontrada para pruebas:", {
        id: property.id,
        title: property.title,
        address: property.address
      });
      return property;
    } else {
      console.log("❌ No se encontraron propiedades");
      return null;
    }
  } catch (error) {
    console.error("❌ Error obteniendo propiedades:", error);
    return null;
  }
}

// Función principal de debug
async function runFullDebug() {
  console.log("🎯 Iniciando debug completo...");
  
  // Obtener una propiedad existente
  const property = await getExistingProperty();
  
  if (!property) {
    console.log("❌ No se puede continuar sin una propiedad existente");
    return;
  }
  
  const propertyId = property.id;
  console.log(`🎯 Usando propiedad ID: ${propertyId}`);
  
  // Probar actualización directa
  console.log("\n=== PRUEBA 1: Actualización Directa ===");
  try {
    await debugPropertyUpdate(propertyId);
    console.log("✅ Actualización directa: EXITOSA");
  } catch (error) {
    console.log("❌ Actualización directa: FALLÓ");
  }
  
  // Esperar un poco
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Probar Redux
  console.log("\n=== PRUEBA 2: Actualización Redux ===");
  try {
    await debugReduxUpdate(propertyId);
    console.log("✅ Actualización Redux: EXITOSA");
  } catch (error) {
    console.log("❌ Actualización Redux: FALLÓ");
  }
  
  console.log("\n🎉 Debug completo terminado");
}

// Exportar funciones para uso manual
window.debugPropertyUpdate = debugPropertyUpdate;
window.debugReduxUpdate = debugReduxUpdate;
window.getExistingProperty = getExistingProperty;
window.runFullDebug = runFullDebug;

console.log(`
🔧 FUNCIONES DE DEBUG DISPONIBLES:

1. runFullDebug() - Ejecuta todas las pruebas automáticamente
2. getExistingProperty() - Obtiene una propiedad para pruebas
3. debugPropertyUpdate(propertyId, testData) - Prueba actualización directa
4. debugReduxUpdate(propertyId, testData) - Prueba actualización Redux

EJEMPLO DE USO:
1. Ejecuta: runFullDebug()
2. O manualmente:
   - const property = await getExistingProperty()
   - await debugPropertyUpdate(property.id)
   - await debugReduxUpdate(property.id)
`);