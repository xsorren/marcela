# 🎄 Modo de Decoración Festiva - HomeVer Inmobiliaria

Sistema de decoración navideña minimalista y reversible para el sitio web.

## 📋 Resumen

Este sistema permite activar/desactivar decoración festiva mediante una variable de entorno, manteniendo el código original intacto y permitiendo reversión instantánea.

---

## 🚀 Activar Decoración

### Opción 1: Variable de Entorno (Recomendado)

1. Crear/editar archivo `.env.local` en la raíz del proyecto:
```bash
NEXT_PUBLIC_HOLIDAY_MODE=true
```

2. Reiniciar el servidor de desarrollo:
```bash
npm run dev
```

### Opción 2: Modificar Config Directamente

Editar `config/features.js`:
```javascript
export const FEATURES = {
  holidayMode: {
    enabled: true, // Cambiar a true
    // ...
  }
}
```

---

## 🔄 Desactivar Decoración

### Método Rápido (30 segundos)

1. Editar `.env.local`:
```bash
NEXT_PUBLIC_HOLIDAY_MODE=false
```

2. Reiniciar servidor:
```bash
npm run dev
```

✅ **¡Listo!** El sitio vuelve al estado original.

### Método Automático (Script)

Ejecutar el script de limpieza:
```bash
node scripts/remove-holiday.js
npm run dev
```

### Método Manual Completo

Si deseas remover todo el código festivo:

#### 1. Eliminar carpeta de componentes:
```bash
rm -rf components/holiday/
```

#### 2. Eliminar archivo CSS:
```bash
rm styles/holiday.css
```

#### 3. Comentar import en `app/globals.css`:
```css
/* @import '../styles/holiday.css'; */
```

#### 4. Comentar colores en `tailwind.config.js`:
```javascript
/* "holiday": {
  gold: "#D4AF37",
  champagne: "#F7E7CE",
  // ...
}, */
```

#### 5. Buscar y remover código condicional (opcional):
```bash
# Ver todos los lugares con código festivo
git grep "HOLIDAY MODE"
```

Remover bloques marcados con:
```javascript
// ========================================
// 🎄 HOLIDAY MODE - ...
// ========================================
```

---

## 📁 Archivos Afectados

### Archivos Nuevos (pueden eliminarse):
- ✅ `config/features.js` - Sistema de feature flags
- ✅ `components/holiday/HolidayBanner.jsx` - Banner superior
- ✅ `components/holiday/HolidayBadge.jsx` - Badge "Felices Fiestas"
- ✅ `components/holiday/HolidayRibbon.jsx` - Ribbons para cards
- ✅ `components/holiday/SnowEffect.jsx` - Efecto de nieve
- ✅ `components/holiday/index.js` - Exports
- ✅ `styles/holiday.css` - Estilos y animaciones
- ✅ `scripts/remove-holiday.js` - Script de limpieza

### Archivos Modificados (con código condicional):
- 🔄 `components/navbar.jsx` - Badge festivo en navbar
- 🔄 `components/hero.jsx` - Banner y mensaje festivo
- 🔄 `components/featured-properties.jsx` - Decoración en título
- 🔄 `components/footer.jsx` - Mensaje de felicitación
- 🔄 `tailwind.config.js` - Colores festivos (comentables)
- 🔄 `app/globals.css` - Import de holiday.css (comentable)

---

## 🎨 Configuración de Elementos Festivos

Editar `config/features.js` para controlar elementos individuales:

```javascript
export const HOLIDAY_CONFIG = {
  showBanner: true,       // Banner superior "Felices Fiestas"
  showSnowEffect: false,  // Efecto de nieve (puede afectar performance)
  showBadges: true,       // Badges en navbar y componentes
  showRibbons: true,      // Ribbons en property cards
  bannerMessage: "✨ Felices Fiestas 2025",
  bannerDismissible: true, // Usuario puede cerrar el banner
}
```

---

## 🗓️ Fechas Automáticas

El sistema tiene control automático por fechas:

```javascript
export const FEATURES = {
  holidayMode: {
    enabled: true,
    startDate: '2024-12-15',  // Inicio: 15 de diciembre
    endDate: '2025-01-10',    // Fin: 10 de enero
    autoDisable: true,        // Se desactiva automáticamente
  }
}
```

Si `autoDisable: true`, la decoración solo aparece entre las fechas configuradas.

---

## 🔍 Verificar Estado

Para verificar si el modo festivo está activo:

```javascript
import { isHolidayModeActive } from '@/config/features'

const showHoliday = isHolidayModeActive()
console.log('Holiday mode:', showHoliday)
```

---

## 🎯 Elementos Visuales Implementados

### Navbar
- ✨ Badge "Felices Fiestas" junto al logo
- 🎨 Efecto dorado sutil en hover

### Hero
- 📢 Banner superior dismissible
- 💬 Mensaje festivo alternativo
- ❄️ Efecto de nieve opcional (desactivado por defecto)

### Featured Properties
- ⭐ Estrellas doradas en el título
- 📝 Mensaje alternativo festivo

### Footer
- 🎊 Card de felicitación navideña
- ✨ Decoración con íconos

---

## 🎨 Paleta de Colores Festiva

Colores disponibles con clase `holiday-*`:

```css
holiday-gold: #D4AF37      /* Oro elegante */
holiday-champagne: #F7E7CE /* Champagne suave */
holiday-silver: #C0C0C0    /* Plata */
holiday-emerald: #2F5233   /* Verde bosque */
holiday-cream: #FFF8E7     /* Crema cálido */
```

Uso en componentes:
```jsx
<div className="bg-holiday-gold text-white">
  Contenido festivo
</div>
```

---

## 📱 Responsive

La decoración está optimizada para todos los dispositivos:

- **Mobile**: Efectos reducidos, sin nieve (performance)
- **Tablet**: Efectos moderados
- **Desktop**: Todos los efectos activos

---

## ⚡ Performance

El sistema está optimizado para no afectar el rendimiento:

- ✅ Código condicional (tree-shaking automático cuando está desactivado)
- ✅ Animaciones CSS (aceleradas por GPU)
- ✅ Sin nieve en mobile (mejor performance)
- ✅ Componentes lazy-loaded

---

## ♻️ Reutilización para Próximo Año

### Opción Git Branch

Si usaste Git durante la implementación:

```bash
# Crear branch para las fiestas 2025
git checkout -b holiday-2025
git add .
git commit -m "🎄 Add holiday decorations 2025"
git push origin holiday-2025

# Volver al estado original
git checkout main

# Para próximo año
git checkout holiday-2025
# Actualizar fechas en config/features.js
# Activar con NEXT_PUBLIC_HOLIDAY_MODE=true
```

### Opción Archivo Backup

Mantener los archivos en carpeta separada:

```bash
# Crear backup
mkdir -p backups/holiday-2025
cp -r components/holiday backups/holiday-2025/
cp styles/holiday.css backups/holiday-2025/
cp config/features.js backups/holiday-2025/

# Para próximo año: restaurar archivos
cp -r backups/holiday-2025/* ./
```

---

## 🐛 Troubleshooting

### La decoración no aparece

1. Verificar variable de entorno:
```bash
echo $NEXT_PUBLIC_HOLIDAY_MODE
```

2. Verificar que el servidor esté reiniciado después de cambiar `.env.local`

3. Verificar fechas en `config/features.js`

4. Verificar consola del navegador para errores

### Estilos no se aplican

1. Verificar que `holiday.css` esté importado en `globals.css`
2. Reiniciar servidor: `npm run dev`
3. Limpiar caché: `rm -rf .next`

### Performance issues

1. Desactivar efecto de nieve:
```javascript
showSnowEffect: false
```

2. Verificar DevTools > Performance

---

## 📞 Soporte

Para dudas sobre la implementación:
- 📧 Contactar al equipo de desarrollo
- 📝 Revisar comentarios en el código (marcados con 🎄)
- 🔍 Buscar en el código: `git grep "HOLIDAY MODE"`

---

## ✅ Checklist de Reversión

### Reversión Rápida (Mantener código):
- [ ] Cambiar `NEXT_PUBLIC_HOLIDAY_MODE=false`
- [ ] Reiniciar servidor

### Reversión Completa (Limpiar todo):
- [ ] Ejecutar `node scripts/remove-holiday.js`
- [ ] Eliminar `components/holiday/`
- [ ] Eliminar `styles/holiday.css`
- [ ] Comentar import en `globals.css`
- [ ] Comentar colores en `tailwind.config.js`
- [ ] (Opcional) Buscar y remover código con `git grep "HOLIDAY MODE"`
- [ ] Reiniciar servidor

---

## 📊 Timeline Recomendado

| Fecha | Acción |
|-------|--------|
| **15 Dic 2024** | ✅ Activar decoración |
| **24-25 Dic** | 🎄 Navidad |
| **31 Dic - 1 Ene** | 🎊 Año Nuevo |
| **6 Ene 2025** | ⚠️ Preparar reversión |
| **10 Ene 2025** | 🔄 Desactivar decoración |
| **15 Ene 2025** | 🗑️ (Opcional) Limpieza completa |

---

**¡Felices Fiestas! ✨🎄**
