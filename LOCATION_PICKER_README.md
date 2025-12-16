# Selector Manual de Ubicación - Documentación

## Descripción General

Se ha implementado una nueva funcionalidad que permite a los usuarios seleccionar ubicaciones de propiedades de dos maneras:

1. **Búsqueda automática**: Usando el autocompletado de Mapbox (funcionalidad existente)
2. **Selección manual**: Marcando directamente en un mapa interactivo (nueva funcionalidad)

## Componentes Implementados

### 1. `MapboxLocationPicker.jsx`
Componente principal para la selección manual de ubicación en el mapa.

**Props:**
- `onLocationSelect`: Callback que se ejecuta cuando se selecciona una ubicación
- `initialLocation`: Ubicación inicial (opcional)
- `height`: Altura del mapa (default: "400px")
- `className`: Clases CSS adicionales

**Funcionalidades:**
- Mapa interactivo con click para marcar ubicación
- Marcador arrastrable
- Reverse geocoding automático para obtener dirección aproximada
- Controles de navegación
- Botón para limpiar selección

### 2. `LocationModeToggle.jsx`
Toggle para cambiar entre modo de búsqueda automática y selección manual.

**Props:**
- `mode`: Modo actual ('search' | 'manual')
- `onModeChange`: Callback para cambio de modo
- `className`: Clases CSS adicionales

### 3. `useManualLocationPicker.js`
Hook personalizado para manejar la lógica de selección de ubicación.

**Funciones principales:**
- `handleManualLocationSelect`: Maneja selección desde el mapa
- `handleAutomaticLocationSelect`: Maneja selección desde geocoder
- `validateLocation`: Valida ubicación antes de guardar
- `getFormattedLocationData`: Obtiene datos formateados para el formulario

### 4. `utils/mapbox-helpers.js`
Utilidades para trabajar con la API de Mapbox.

**Funciones:**
- `reverseGeocode`: Convierte coordenadas a dirección
- `geocodeAddress`: Convierte dirección a coordenadas
- `validateCoordinates`: Valida coordenadas
- `calculateDistance`: Calcula distancia entre puntos
- `formatCoordinates`: Formatea coordenadas para mostrar

## Integración con PropertyForm

El formulario de propiedades (`components/property-form.jsx`) ha sido modificado para:

1. **Incluir el toggle de modo** en la sección de ubicación
2. **Mostrar el componente apropiado** según el modo seleccionado
3. **Manejar ambos flujos de datos** (automático y manual)
4. **Validar ubicación** antes de guardar
5. **Incluir información de fuente** en los datos guardados

## Estructura de Datos

### Objeto de Ubicación
```javascript
{
  latitude: number,        // Latitud
  longitude: number,       // Longitud
  address: string,         // Dirección (automática o reverse geocoding)
  source: string          // 'autocomplete' | 'manual' | 'existing'
}
```

### Datos del Formulario
```javascript
{
  // ... otros campos del formulario
  address: string,           // Dirección de la propiedad
  location: {               // Coordenadas
    latitude: number,
    longitude: number
  },
  location_source: string   // Fuente de la ubicación
}
```

## Flujo de Usuario

### Modo Búsqueda Automática (Default)
1. Usuario escribe en el campo de búsqueda
2. Mapbox sugiere direcciones
3. Usuario selecciona una opción
4. Se obtienen coordenadas automáticamente
5. Se muestra mapa estático de confirmación

### Modo Selección Manual
1. Usuario cambia al modo manual
2. Se muestra mapa interactivo
3. Usuario hace click en el mapa
4. Se coloca marcador arrastrable
5. Se obtiene dirección aproximada via reverse geocoding
6. Se muestran coordenadas y dirección

## Configuración Requerida

### Variables de Entorno
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### Dependencias
- `mapbox-gl`: Para mapas interactivos
- `@mapbox/mapbox-gl-geocoder`: Para autocompletado
- Componentes UI existentes (Button, Card, etc.)

## Página de Prueba

Se ha creado una página de prueba en `/test-location` para verificar la funcionalidad:

```bash
# Navegar a la página de prueba
http://localhost:3000/test-location
```

La página permite:
- Probar ambos modos de selección
- Ver los datos guardados en tiempo real
- Verificar el formato JSON de salida

## Validaciones Implementadas

1. **Coordenadas válidas**: Rango de latitud (-90, 90) y longitud (-180, 180)
2. **Ubicación requerida**: No se puede guardar sin seleccionar ubicación
3. **Formato de datos**: Validación de tipos de datos
4. **Manejo de errores**: Feedback visual para errores de geocoding

## Características Adicionales

### UX/UI
- Indicadores visuales del modo activo
- Feedback inmediato al seleccionar ubicación
- Marcador arrastrable para ajustes finos
- Información de coordenadas y dirección
- Botón para limpiar selección

### Performance
- Lazy loading del mapa (solo se carga en modo manual)
- Debounce en reverse geocoding
- Cleanup automático de instancias de mapa

### Accesibilidad
- Controles de teclado
- ARIA labels apropiados
- Feedback visual claro

## Próximos Pasos Sugeridos

1. **Testing**: Pruebas unitarias para los componentes
2. **Optimización**: Caching de resultados de geocoding
3. **Funcionalidades adicionales**:
   - Búsqueda por coordenadas directas
   - Importar ubicación desde GPS
   - Historial de ubicaciones recientes
   - Validación de ubicaciones dentro de Argentina

## Troubleshooting

### Problemas Comunes

1. **Mapa no se carga**:
   - Verificar token de Mapbox
   - Verificar conexión a internet
   - Revisar consola para errores

2. **Reverse geocoding no funciona**:
   - Verificar token de Mapbox
   - Verificar límites de API
   - Coordenadas fuera de Argentina

3. **Marcador no aparece**:
   - Verificar coordenadas válidas
   - Verificar inicialización del mapa
   - Revisar estilos CSS

### Debug
```javascript
// Habilitar logs detallados
console.log("Location data:", locationData);
console.log("Map instance:", mapInstance);
console.log("Coordinates:", { lat, lng });
```