# 🌊 Debug: Mapa Mostrando Océano

## 🚨 Problema Reportado

**Síntoma**: "La ubicación por defecto sigue estando en el océano"
**Esperado**: Mapa centrado en Buenos Aires, Argentina
**Actual**: Mapa mostrando océano

## 🔍 Posibles Causas

### 1. **Coordenadas Incorrectas**
```javascript
// ❌ INCORRECTO (lleva al océano)
center: [58.3816, -34.6037]  // Longitud sin signo negativo

// ✅ CORRECTO (Buenos Aires, Argentina)  
center: [-58.3816, -34.6037] // Longitud con signo negativo
```

### 2. **Orden de Coordenadas Invertido**
```javascript
// ❌ INCORRECTO (lat, lng en lugar de lng, lat)
center: [-34.6037, -58.3816]

// ✅ CORRECTO (lng, lat como espera Mapbox)
center: [-58.3816, -34.6037]
```

### 3. **InitialLocation Inválido**
- `initialLocation` puede tener coordenadas corruptas
- Validación `isValidLocation()` puede estar fallando
- Estado del hook puede estar mal inicializado

## 🔧 Debugging Implementado

### 1. **Logs en MapboxLocationPicker**
```javascript
console.log('MapboxLocationPicker - initialLocation:', initialLocation)
console.log('MapboxLocationPicker - isValidLocation(initialLocation):', isValidLocation(initialLocation))
console.log('MapboxLocationPicker - mapCenter:', mapCenter)
console.log('MapboxLocationPicker - mapZoom:', mapZoom)
```

### 2. **Logs en Hook**
```javascript
console.log('useManualLocationPicker - initialLocation recibido:', initialLocation)
console.log('useManualLocationPicker - location state:', location)
```

### 3. **Página de Debug Creada**
- **URL**: `/debug-map-center`
- **Casos de prueba**: Sin inicial, válido, inválido, océano
- **Visualización**: Coordenadas esperadas vs actuales

## 🧪 Casos de Prueba

### ✅ Caso 1: Sin Ubicación Inicial
```javascript
initialLocation: null
// Esperado: Buenos Aires (-58.3816, -34.6037)
```

### ✅ Caso 2: Ubicación Válida
```javascript
initialLocation: { latitude: -35.0167, longitude: -59.0167 }
// Esperado: Navarro (-59.0167, -35.0167)
```

### ❌ Caso 3: Coordenadas Inválidas
```javascript
initialLocation: { latitude: null, longitude: null }
// Esperado: Buenos Aires por defecto
```

### 🌊 Caso 4: Bug del Océano
```javascript
initialLocation: { latitude: -34.6037, longitude: 58.3816 }
// Problema: Longitud sin signo negativo
```

## 📊 Coordenadas de Referencia

### 🇦🇷 Argentina (Correcto)
```javascript
Buenos Aires: { lat: -34.6037, lng: -58.3816 }
Navarro:      { lat: -35.0167, lng: -59.0167 }
```

### 🌊 Océano (Incorrecto)
```javascript
// Longitud positiva lleva al océano Índico
{ lat: -34.6037, lng: 58.3816 }  // ❌ Sin signo negativo

// Orden invertido también puede causar problemas
{ lat: -58.3816, lng: -34.6037 } // ❌ Orden incorrecto
```

## 🔍 Pasos de Debug

### 1. **Verificar en Consola**
1. Ir a `/debug-map-center`
2. Abrir DevTools → Console
3. Seleccionar "Sin ubicación inicial"
4. Verificar logs:
   - `initialLocation` debe ser `null`
   - `mapCenter` debe ser `[-58.3816, -34.6037]`
   - `mapZoom` debe ser `10`

### 2. **Verificar Visualmente**
1. El mapa debe mostrar Buenos Aires, Argentina
2. Debe verse tierra, no océano
3. Debe haber calles y edificios visibles

### 3. **Probar Casos Edge**
1. Probar "Coordenadas en océano" para reproducir el bug
2. Verificar que otros casos funcionen correctamente

## 🔧 Posibles Soluciones

### Si el problema persiste:

#### 1. **Hardcodear Coordenadas**
```javascript
// Forzar coordenadas específicas para debug
center: [-58.3816, -34.6037], // Buenos Aires hardcodeado
```

#### 2. **Validación Estricta**
```javascript
const mapCenter = (initialLocation && 
                  typeof initialLocation.longitude === 'number' && 
                  typeof initialLocation.latitude === 'number' &&
                  initialLocation.longitude >= -180 && 
                  initialLocation.longitude <= 180 &&
                  initialLocation.latitude >= -90 && 
                  initialLocation.latitude <= 90)
    ? [initialLocation.longitude, initialLocation.latitude]
    : [-58.3816, -34.6037] // Buenos Aires por defecto
```

#### 3. **Reset Completo del Estado**
```javascript
// Limpiar localStorage o estado corrupto
localStorage.clear()
// Recargar página
window.location.reload()
```

## 📋 Checklist de Verificación

- [ ] Logs muestran coordenadas correctas
- [ ] `mapCenter` es `[-58.3816, -34.6037]`
- [ ] Mapa muestra Buenos Aires, no océano
- [ ] Validación `isValidLocation` funciona
- [ ] Casos de prueba pasan correctamente

## 🎯 Resultado Esperado

Después del debug, el mapa debe:
- ✅ Centrarse en Buenos Aires por defecto
- ✅ Mostrar tierra argentina, no océano
- ✅ Permitir navegación fácil a zona oeste
- ✅ Funcionar con todos los casos de prueba

---

**🔍 Usar `/debug-map-center` para identificar exactamente dónde está el problema.**