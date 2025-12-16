# 📍 Configuración de Coordenadas - Buenos Aires

## 🎯 Ubicación por Defecto

El sistema está configurado para usar **Buenos Aires Capital** como ubicación por defecto para facilitar la navegación en el mapa de selección manual.

### 📊 Coordenadas de Buenos Aires

```javascript
{
  latitude: -34.6037,
  longitude: -58.3816,
  zoom: 10
}
```

### 🗺️ Información Geográfica

- **Provincia**: Buenos Aires
- **Partido**: Navarro
- **País**: Argentina
- **Región**: Pampa Húmeda
- **Zona horaria**: UTC-3

## 🔧 Archivos Modificados

### 1. `components/MapboxLocationPicker.jsx`
- ✅ Centro del mapa cambiado a Navarro
- ✅ Zoom por defecto ajustado a 13 (más apropiado para ciudad pequeña)
- ✅ Importación de función de utilidad

### 2. `utils/mapbox-helpers.js`
- ✅ Nueva función `getNavarroCoordinates()`
- ✅ Actualización de `getArgentinaCenterCoordinates()` (deprecated)
- ✅ Actualización de `getDefaultMapConfig()`

### 3. `utils/test-geocoding.js`
- ✅ Navarro agregado a coordenadas de prueba
- ✅ Navarro agregado a direcciones de prueba

## 🎯 Comportamiento del Mapa

### Cuando NO hay ubicación inicial:
- **Centro**: Buenos Aires (-34.6037, -58.3816)
- **Zoom**: 10 (vista metropolitana)
- **Estilo**: Streets v11.0167, -59.0167)
- **Zoom**: 13 (vista de ciudad)
- **Estilo**: Streets v11

### Cuando SÍ hay ubicación inicial:
- **Centro**: Ubicación proporcionada
- **Zoom**: 15 (vista detallada)
- **Estilo**: Streets v11

## 🧪 Para Probar

### 1. Página de Prueba Principal
```
/test-location
```

### 2. Página de Prueba del Mapa
```
/test-map-picker
```

### 3. Verificaciones
1. **Abrir cualquier página de prueba**
2. **Cambiar a "Selección manual"**
3. **Verificar que el mapa se centre en Navarro**
4. **Confirmar que el zoom sea apropiado**
5. **Probar hacer click en diferentes ubicaciones**

## 🌍 Contexto Geográfico

### ¿Por qué Buenos Aires Capital?
- **Fácil navegación** - Centro metropolitano conocido
- **Punto de referencia** - Fácil orientarse desde aquí
- **Menos arrastre** - Navegar a zonas cercanas es más rápido
- **Experiencia de usuario** - Más intuitivo para los usuarios

### Ubicaciones Accesibles desde Buenos Aires
- **Navarro**: ~80 km al oeste
- **Las Marianas**: ~70 km al oeste
- **Villa Moll**: ~60 km al oeste  
- **Almeyra**: ~90 km al suroeste
- **Lobos**: ~100 km al suroeste

## 🔄 Funciones de Utilidad

### `getNavarroCoordinates()`
```javascript
// Función principal para obtener coordenadas de Navarro
const coords = getNavarroCoordinates()
// Retorna: { latitude: -35.0167, longitude: -59.0167, zoom: 13 }
```

### `getDefaultMapConfig()`
```javascript
// Configuración completa del mapa
const config = getDefaultMapConfig()
// Retorna configuración con centro en Navarro
```

## 📋 Coordenadas de Referencia

### Buenos Aires y Zona Oeste
```javascript
const locations = [
  { name: "Buenos Aires Centro", lat: -34.6037, lng: -58.3816 },
  { name: "Navarro", lat: -35.0167, lng: -59.0167 },
  { name: "Las Marianas", lat: -34.9000, lng: -59.0500 },
  { name: "Villa Moll", lat: -35.0000, lng: -58.8000 },
  { name: "Almeyra", lat: -35.2000, lng: -59.0000 },
  { name: "Lobos", lat: -35.2500, lng: -59.1000 }
]
```

## ✅ Beneficios del Cambio

### 🎯 UX Mejorada
- **Navegación más fácil** - Menos arrastre para llegar a destinos
- **Punto de referencia conocido** - Buenos Aires como centro
- **Zoom apropiado** para vista metropolitana

### 🏠 Inmobiliario
- **Zona típica** de propiedades del sistema
- **Mercado objetivo** bien representado
- **Ubicaciones cercanas** fáciles de encontrar

### 🗺️ Técnico
- **Coordenadas estándar** de Buenos Aires
- **Zoom metropolitano** (nivel 10) para vista amplia
- **Mejor performance** - Menos navegación requerida

---

**🎯 El mapa ahora se centra automáticamente en Buenos Aires Capital, proporcionando una navegación más fácil y rápida para seleccionar ubicaciones en la zona oeste.**