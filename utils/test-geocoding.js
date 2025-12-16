/**
 * Script de prueba para verificar el funcionamiento del reverse geocoding
 */

import { reverseGeocode, geocodeAddress, validateCoordinates } from './mapbox-helpers.js'

// Coordenadas de prueba (Buenos Aires y alrededores)
const testCoordinates = [
  { lat: -35.0167, lng: -59.0167, name: "Navarro, Buenos Aires" },
  { lat: -34.6037, lng: -58.3816, name: "Buenos Aires Centro" },
  { lat: -34.5755, lng: -58.3960, name: "Palermo" },
  { lat: -34.6118, lng: -58.3960, name: "San Telmo" },
  { lat: -34.5889, lng: -58.3974, name: "Recoleta" }
]

// Direcciones de prueba
const testAddresses = [
  "Navarro, Buenos Aires",
  "Av. Corrientes 1000, Buenos Aires",
  "Palermo, Buenos Aires",
  "Puerto Madero, Buenos Aires",
  "Belgrano, Buenos Aires"
]

export async function testReverseGeocoding() {
  console.log("🧪 Probando Reverse Geocoding...")
  
  for (const coord of testCoordinates) {
    try {
      console.log(`\n📍 Probando ${coord.name} (${coord.lat}, ${coord.lng})`)
      
      // Validar coordenadas
      const isValid = validateCoordinates(coord.lat, coord.lng)
      console.log(`✅ Coordenadas válidas: ${isValid}`)
      
      if (isValid) {
        // Hacer reverse geocoding
        const address = await reverseGeocode(coord.lng, coord.lat)
        console.log(`🏠 Dirección obtenida: "${address}"`)
        console.log(`📏 Longitud de dirección: ${address.length} caracteres`)
      }
    } catch (error) {
      console.error(`❌ Error con ${coord.name}:`, error)
    }
  }
}

export async function testGeocoding() {
  console.log("\n🧪 Probando Geocoding...")
  
  for (const address of testAddresses) {
    try {
      console.log(`\n🏠 Probando dirección: "${address}"`)
      
      const result = await geocodeAddress(address)
      if (result) {
        console.log(`📍 Coordenadas obtenidas: ${result.latitude}, ${result.longitude}`)
        console.log(`🏠 Dirección formateada: "${result.address}"`)
        console.log(`📏 Longitud: ${result.address.length} caracteres`)
      } else {
        console.log(`❌ No se encontraron coordenadas para: "${address}"`)
      }
    } catch (error) {
      console.error(`❌ Error con "${address}":`, error)
    }
  }
}

export async function runAllTests() {
  console.log("🚀 Iniciando pruebas de geocoding...")
  
  await testReverseGeocoding()
  await testGeocoding()
  
  console.log("\n✅ Pruebas completadas")
}

// Para usar en consola del navegador:
// import { runAllTests } from './utils/test-geocoding.js'
// runAllTests()