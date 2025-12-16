# HOMEVER - Plataforma Inmobiliaria

## Descripción General

HOMEVER es una plataforma web moderna para la gestión de propiedades inmobiliarias, desarrollada con Next.js 15, React 19, y Supabase. La aplicación está diseñada para un único usuario administrador que gestiona todas las propiedades del sistema, con una interfaz pública para que los visitantes naveguen y contacten sobre las propiedades disponibles.

## Tecnologías Principales

- **Framework**: Next.js 15 con App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend/BaaS**: Supabase (PostgreSQL + Auth + Storage)
- **Estado Global**: Redux Toolkit
- **UI Components**: Radix UI + shadcn/ui
- **Mapas**: Mapbox GL JS
- **Validación**: Zod + React Hook Form
- **Animaciones**: Framer Motion
- **Notificaciones**: React Hot Toast + Sonner

## Arquitectura del Sistema

### 1. Autenticación Simplificada

#### Sistema de Usuario Único
- **Usuario único**: Un solo administrador del sistema
- **Autenticación**: Supabase Auth con email/password
- **Gestión de sesiones**: Redux store simplificado
- **Persistencia**: Supabase maneja la persistencia automática

#### Componentes de Autenticación
- `components/auth/login-form.jsx` - Formulario de inicio de sesión
- `components/auth/register-form.jsx` - Formulario de registro (limitado)
- `components/auth/auth-guard.jsx` - Protección de rutas simplificada
- `components/auth-listener.jsx` - Monitor de estado de autenticación

#### Flujo de Autenticación Simplificado
1. **Login**: Formulario con validación Zod
2. **Auth State Management**: Redux slice simplificado solo para autenticación
3. **Session Persistence**: Supabase maneja persistencia automática
4. **Route Protection**: AuthGuard verifica solo autenticación (sin roles)
5. **User Data**: Información almacenada en `user_metadata` de Supabase Auth

### 2. Gestión de Propiedades

#### Modelo de Datos Simplificado
```sql
-- Tabla principal de propiedades (sin user_id)
properties:
- id: uuid (PK)
- title: text
- description: text
- address: text
- price: numeric
- property_type: enum (house, apartment, land, office, commercial)
- listing_type: enum (sale, rent)
- area: numeric
- land_area: numeric
- semi_covered_area: numeric
- rooms: integer
- bathrooms: integer
- has_garage: boolean
- has_pool: boolean
- has_garden: boolean
- is_featured: boolean
- location: geometry (PostGIS)
- images: text[] (URLs)
- created_at: timestamp
- updated_at: timestamp

-- Tabla de imágenes (sin cambios)
property_images:
- id: uuid (PK)
- property_id: uuid (FK)
- url: text
- order: integer
- is_cover: boolean
```

#### Componentes de Propiedades
- `components/property-form.jsx` - Formulario CRUD de propiedades
- `components/property-card.jsx` - Tarjeta individual de propiedad
- `components/property-list.jsx` - Lista/tabla de propiedades
- `components/property-listing.js` - Listado público con paginación
- `components/featured-properties.jsx` - Propiedades destacadas

#### Funcionalidades
- **CRUD completo**: Crear, leer, actualizar, eliminar propiedades
- **Sistema de aprobación**: Workflow pending → approved/rejected
- **Gestión de imágenes**: Upload, orden, imagen de portada
- **Propiedades destacadas**: Sistema de promoción en homepage
- **Geolocalización**: Integración con Mapbox para ubicaciones
- **Filtros avanzados**: Por tipo, precio, ubicación, características

### 3. Sistema de Búsqueda y Filtros

#### Componentes de Búsqueda
- `components/SearchBar.jsx` - Barra principal de búsqueda
- `components/filters/` - Filtros especializados (precio, ubicación, etc.)
- `components/MapboxSuggestions.jsx` - Autocompletado de ubicaciones

#### Filtros Disponibles
- **Texto libre**: Búsqueda en título, descripción, dirección
- **Tipo de propiedad**: Casa, departamento, terreno, oficina, local
- **Tipo de operación**: Venta, alquiler
- **Rango de precios**: Min/max con sliders
- **Ubicación**: Autocompletado con Mapbox
- **Características**: Ambientes, cochera, piscina, jardín

#### Redux State Management
```javascript
// lib/redux/slices/propertySlice.js
filters: {
  property_type: null,
  listing_type: 'sale',
  search: '',
  location: null,
  price_min: null,
  price_max: null,
  rooms: null,
  has_garage: null,
  // ... más filtros
}
```

### 4. Dashboard Administrativo

#### Estructura del Dashboard
```
/dashboard/
├── page.jsx                 # Overview con estadísticas
├── properties/              # Gestión de propiedades
│   ├── page.jsx             # Lista de propiedades
│   ├── new/page.jsx         # Crear propiedad
│   └── [id]/page.jsx        # Editar propiedad
├── destacadas/page.jsx      # Gestión propiedades destacadas
└── configuracion/page.jsx   # Configuración de cuenta
```

#### Componentes del Dashboard
- `components/dashboard-header.jsx` - Encabezado con breadcrumbs
- `components/sidebar.jsx` - Navegación lateral
- `components/mobile-nav.jsx` - Navegación móvil
- `components/dashboard-cards.jsx` - Tarjetas de estadísticas

#### Funcionalidades del Administrador
- Ver todas las propiedades del sistema
- Aprobar/rechazar propiedades pendientes
- Configurar propiedades destacadas
- Crear, editar y eliminar propiedades
- Configurar preferencias del sistema
- Acceso completo a todas las funcionalidades

### 5. Interfaz Pública

#### Páginas Principales
- `/` - Homepage con propiedades destacadas
- `/comprar` - Listado de propiedades en venta
- `/listado` - Listado de propiedades en alquiler
- `/property/[id]` - Detalle de propiedad individual
- `/contacto` - Formulario de contacto
- `/servicios` - Información de servicios

#### Componentes Públicos
- `components/hero.jsx` - Sección principal del homepage
- `components/navbar.jsx` - Navegación principal
- `components/footer.jsx` - Pie de página
- `components/about-us.jsx` - Sección "Sobre nosotros"
- `components/sell-with-us.jsx` - Call-to-action para vendedores

### 6. Integración con Mapbox

#### Funcionalidades de Mapas
- **Autocompletado de direcciones**: Sugerencias en tiempo real
- **Visualización de propiedades**: Marcadores en mapa
- **Geolocalización**: Conversión dirección ↔ coordenadas
- **Filtros geográficos**: Búsqueda por área/ubicación

#### Componentes de Mapas
- `components/MapboxMap.jsx` - Mapa base
- `components/MapboxPropertiesMap.jsx` - Mapa con propiedades
- `components/MapboxSuggestions.jsx` - Sistema de sugerencias
- `hooks/useMapboxSuggestions.js` - Hook para autocomplete

### 7. Base de Datos y Backend Simplificado

#### Esquema de Base de Datos

**Tablas Principales**:

```sql
-- Propiedades (tabla principal sin user_id)
properties:
- id: uuid (PK)
- title, description, address: text
- price: numeric
- property_type: enum (house, apartment, land, office, commercial)
- listing_type: enum (sale, rent)
- area, land_area, semi_covered_area: numeric
- rooms, bathrooms: integer
- has_garage, has_pool, has_garden: boolean
- is_featured: boolean
- location: geometry (PostGIS)
- images: text[]
- created_at, updated_at: timestamp

-- Imágenes de propiedades
property_images:
- id: uuid (PK)
- property_id: uuid (FK)
- url: text
- order: integer
- is_cover: boolean
```

**Autenticación**:
- Solo uso de `auth.users` de Supabase
- Información adicional en `user_metadata`
- Sin tabla `public.users`

#### APIs y Funciones

**API Routes**:
- `/api/auth/callback` - Callback de autenticación

**Supabase Functions**:
- `utils/supabase/client.js` - Cliente Supabase y funciones de auth
- `utils/supabase/properties.js` - Operaciones CRUD de propiedades
- `utils/supabase/provider.jsx` - Provider de contexto

**Storage Configuration**:
- **Bucket**: `property-images` - Almacenamiento de imágenes de propiedades
- **Políticas RLS**: Configuradas para acceso público de lectura
- **Formatos soportados**: JPG, PNG, WebP
- **Tamaño máximo**: Configurado en Supabase

### 8. Utilidades y Helpers

#### Gestión de Estado
- `lib/redux/store.js` - Configuración de Redux store
- `lib/redux/slices/authSlice.js` - Estado de autenticación simplificado
- `lib/redux/slices/propertySlice.js` - Estado de propiedades

#### Utilidades
- `utils/propertyFilters.js` - Helpers para filtros de propiedades
- `utils/image-helpers.js` - Manipulación de imágenes
- `utils/geo.js` - Utilidades geográficas
- `lib/utils.ts` - Utilidades generales (clsx, etc.)

#### Hooks Personalizados
- `hooks/use-mobile.tsx` - Detección de dispositivos móviles
- `hooks/use-toast.ts` - Sistema de notificaciones
- `components/hooks/useMapboxSuggestions.js` - Autocomplete de Mapbox
- `components/useResponsiveGrid.js` - Grid responsivo

### 9. UI y Experiencia de Usuario

#### Sistema de Diseño
- **Colores principales**: Dorado (#D4AF37), Negro (#1A1A1A)
- **Fuente**: Montserrat
- **Tema**: Oscuro por defecto
- **Responsive**: Mobile-first design

#### Componentes UI Base
- `components/ui/` - Componentes base de shadcn/ui
- **Buttons, Cards, Dialogs, Forms, etc.**
- **Theming**: Configurado en `tailwind.config.js`

#### Animaciones
- **Framer Motion**: Transiciones suaves entre páginas
- **Scroll animations**: Revelado progresivo de contenido
- **Loading states**: Skeletons y spinners
- **Micro-interactions**: Hover effects, click feedback

### 10. Configuración y Deployment

#### Archivos de Configuración
- `next.config.js` - Configuración de Next.js
- `tailwind.config.js` - Configuración de Tailwind CSS
- `components.json` - Configuración de shadcn/ui
- `jsconfig.json` - Configuración de JavaScript paths
- `middleware.js` - Middleware de Next.js para rutas protegidas

#### Deployment
- **Plataforma**: Netlify
- **Configuración**: `netlify.toml`
- **Build command**: `npm run build`
- **Variables de entorno**: Supabase URLs y keys

### 11. Características Destacadas

#### Responsive Design
- **Mobile-first**: Diseño optimizado para móviles
- **Adaptive UI**: Componentes que se adaptan al tamaño de pantalla
- **Touch-friendly**: Interacciones optimizadas para touch

#### Performance
- **Image optimization**: Next.js Image component
- **Code splitting**: Carga diferida de componentes
- **Caching**: Estrategias de cache para datos frecuentes
- **SEO**: Meta tags y structured data

#### Accesibilidad
- **ARIA labels**: Etiquetas descriptivas
- **Keyboard navigation**: Navegación completa por teclado
- **Screen reader support**: Soporte para lectores de pantalla
- **Color contrast**: Contraste adecuado en el tema oscuro

#### Seguridad
- **RLS (Row Level Security)**: Políticas de seguridad en Supabase
- **Input validation**: Validación con Zod en frontend y backend
- **SQL injection prevention**: Consultas parametrizadas
- **Authentication flows**: Flujos seguros de autenticación

## Flujo de Usuario Típico

### Usuario Público
1. **Visita homepage** → Ve propiedades destacadas
2. **Usa barra de búsqueda** → Aplica filtros
3. **Navega resultados** → Ve lista/mapa de propiedades
4. **Selecciona propiedad** → Ve detalles completos
5. **Contacta** → WhatsApp/formulario de contacto

### Administrador
1. **Login** → Accede al dashboard
2. **Gestiona propiedades** → Crea, edita, aprueba propiedades
3. **Configura destacadas** → Promociona propiedades en homepage
4. **Ve estadísticas** → Dashboard con métricas del sistema
5. **Configura sistema** → Ajusta preferencias y configuración

## Estructura de Archivos del Proyecto

```
homever-inmobiliaria/
├── app/                          # Next.js App Router
│   ├── globals.css               # Estilos globales
│   ├── layout.js                 # Layout principal
│   ├── page.js                   # Homepage
│   ├── api/                      # API routes
│   ├── auth/callback/            # Callback de autenticación
│   ├── comprar/                  # Página de compra
│   ├── contacto/                 # Página de contacto
│   ├── dashboard/                # Panel administrativo
│   ├── formulario/               # Formularios
│   ├── listado/                  # Listado de propiedades
│   ├── login/                    # Página de login
│   ├── property/[id]/            # Detalle de propiedad
│   ├── propiedades/crear/        # Crear propiedad
│   └── servicios/                # Página de servicios
├── components/                   # Componentes React
│   ├── auth/                     # Autenticación
│   ├── dashboard/                # Dashboard
│   ├── filters/                  # Filtros de búsqueda
│   ├── hooks/                    # Hooks personalizados
│   └── ui/                       # Componentes UI base
├── hooks/                        # Hooks globales
├── lib/                          # Librerías y utilidades
│   ├── redux/                    # Estado global Redux
│   ├── data.js                   # Datos mock
│   ├── supabase.js               # Cliente Supabase
│   └── utils.ts                  # Utilidades
├── public/                       # Archivos estáticos
│   └── images/                   # Imágenes
├── scripts/                      # Scripts de base de datos
├── utils/                        # Utilidades específicas
│   ├── geo.js                    # Utilidades geográficas
│   ├── image-helpers.js          # Helpers de imágenes
│   ├── propertyFilters.js        # Filtros de propiedades
│   └── supabase/                 # Utilidades Supabase
├── components.json               # Config shadcn/ui
├── jsconfig.json                 # Config JavaScript
├── middleware.js                 # Middleware Next.js
├── netlify.toml                  # Config Netlify
├── next.config.js                # Config Next.js
├── package.json                  # Dependencias
├── postcss.config.mjs            # Config PostCSS
└── tailwind.config.js            # Config Tailwind
```

## Esquema de Base de Datos Simplificado

### Tablas PostGIS (Sistema de geolocalización)
- **geography_columns**: Metadatos de columnas geográficas con SRID, catálogo, esquema
- **geometry_columns**: Metadatos de columnas de geometría con dimensiones y tipos
- **spatial_ref_sys**: Sistemas de referencia espacial para proyecciones cartográficas

### Tabla: properties (Propiedades principales)
- **id**: UUID único de la propiedad
- **title**: Título descriptivo de la propiedad
- **description**: Descripción detallada
- **address**: Dirección física completa
- **price**: Precio en formato numérico
- **property_type**: Tipo (casa, departamento, terreno, oficina, comercial)
- **listing_type**: Operación (venta, alquiler)
- **area**: Superficie total en m²
- **land_area**: Superficie del terreno en m²
- **semi_covered_area**: Superficie semicubierta en m²
- **rooms**: Número de habitaciones/ambientes
- **bathrooms**: Número de baños
- **has_garage**: Boolean - tiene cochera
- **has_pool**: Boolean - tiene piscina
- **has_garden**: Boolean - tiene jardín
- **is_featured**: Boolean - propiedad destacada
- **location**: Geometría PostGIS (coordenadas)
- **images**: Array de URLs de imágenes
- **created_at**: Timestamp de creación
- **updated_at**: Timestamp de última actualización

### Tabla: property_images (Imágenes de propiedades)
- **id**: UUID único de la imagen
- **property_id**: FK a properties
- **url**: URL de la imagen almacenada
- **order**: Orden de visualización
- **is_cover**: Boolean - imagen de portada

### Autenticación Supabase
- **auth.users**: Tabla nativa de Supabase para autenticación
- **user_metadata**: JSON con información adicional del usuario
- Sin tabla `public.users` personalizada

## Características Principales

### ✅ Simplicidad
- **Un solo usuario administrador**: Elimina complejidad de roles múltiples
- **Autenticación directa**: Solo Supabase Auth sin tablas adicionales
- **CRUD simplificado**: Sin filtros por usuario en propiedades

### ✅ Escalabilidad
- **Arquitectura modular**: Componentes reutilizables y bien organizados
- **Estado centralizado**: Redux para gestión eficiente del estado
- **Base de datos optimizada**: PostGIS para consultas geográficas eficientes

### ✅ Performance
- **Next.js 15**: Server-side rendering y optimización automática
- **Caching inteligente**: Estrategias de cache para datos frecuentes
- **Imágenes optimizadas**: Next.js Image para carga eficiente

### ✅ Experiencia de Usuario
- **Interfaz moderna**: Diseño clean con tema oscuro
- **Responsive design**: Optimizado para todos los dispositivos
- **Búsqueda avanzada**: Filtros potentes con mapas interactivos

Esta plataforma inmobiliaria simplificada mantiene todas las funcionalidades esenciales mientras elimina la complejidad innecesaria, resultando en un sistema más mantenible y eficiente para un único administrador.

#### Componentes de Propiedades
- `components/property-form.jsx` - Formulario CRUD de propiedades
- `components/property-card.jsx` - Tarjeta individual de propiedad
- `components/property-list.jsx` - Lista/tabla de propiedades
- `components/property-listing.js` - Listado público con paginación
- `components/featured-properties.jsx` - Propiedades destacadas

#### Funcionalidades
- **CRUD completo**: Crear, leer, actualizar, eliminar propiedades
- **Sistema de aprobación**: Workflow pending → approved/rejected
- **Gestión de imágenes**: Upload, orden, imagen de portada
- **Propiedades destacadas**: Sistema de promoción en homepage
- **Geolocalización**: Integración con Mapbox para ubicaciones
- **Filtros avanzados**: Por tipo, precio, ubicación, características

### 3. Sistema de Búsqueda y Filtros

#### Componentes de Búsqueda
- `components/SearchBar.jsx` - Barra principal de búsqueda
- `components/filters/` - Filtros especializados (precio, ubicación, etc.)
- `components/MapboxSuggestions.jsx` - Autocompletado de ubicaciones

#### Filtros Disponibles
- **Texto libre**: Búsqueda en título, descripción, dirección
- **Tipo de propiedad**: Casa, departamento, terreno, oficina, local
- **Tipo de operación**: Venta, alquiler
- **Rango de precios**: Min/max con sliders
- **Ubicación**: Autocompletado con Mapbox
- **Características**: Ambientes, cochera, piscina, jardín
- **Antigüedad**: Filtro por años de construcción

#### Redux State Management
```javascript
// lib/redux/slices/propertySlice.js
filters: {
  property_type: null,
  listing_type: 'sale',
  search: '',
  location: null,
  price_min: null,
  price_max: null,
  rooms: null,
  has_garage: null,
  // ... más filtros
}
```

### 4. Dashboard Administrativo

#### Estructura del Dashboard
```
/dashboard/
├── page.jsx                 # Overview con estadísticas
├── properties/              # Gestión de propiedades
│   ├── page.jsx             # Lista de propiedades
│   ├── new/page.jsx         # Crear propiedad
│   └── [id]/page.jsx        # Editar propiedad
├── destacadas/page.jsx      # Gestión propiedades destacadas
├── aprobaciones/page.jsx    # Aprobar/rechazar propiedades
├── usuarios/page.jsx        # Gestión de usuarios (admin)
└── configuracion/page.jsx   # Configuración de cuenta
```

#### Componentes del Dashboard
- `components/dashboard-header.jsx` - Encabezado con breadcrumbs
- `components/sidebar.jsx` - Navegación lateral
- `components/mobile-nav.jsx` - Navegación móvil
- `components/dashboard-cards.jsx` - Tarjetas de estadísticas

#### Funcionalidades por Rol

**Administrador**:
- Ver todas las propiedades del sistema
- Aprobar/rechazar propiedades pendientes
- Gestionar usuarios (crear, editar roles, eliminar)
- Configurar propiedades destacadas
- Acceso completo al sistema

**Vendedor/Agent**:
- Gestionar sus propias propiedades
- Ver estadísticas personales
- Configurar perfil y preferencias

**Usuario**:
- Acceso limitado a configuración de cuenta

### 5. Interfaz Pública

#### Páginas Principales
- `/` - Homepage con propiedades destacadas
- `/comprar` - Listado de propiedades en venta
- `/listado` - Listado de propiedades en alquiler
- `/property/[id]` - Detalle de propiedad individual
- `/contacto` - Formulario de contacto
- `/servicios` - Información de servicios

#### Componentes Públicos
- `components/hero.jsx` - Sección principal del homepage
- `components/navbar.jsx` - Navegación principal
- `components/footer.jsx` - Pie de página
- `components/about-us.jsx` - Sección "Sobre nosotros"
- `components/sell-with-us.jsx` - Call-to-action para vendedores

### 6. Integración con Mapbox

#### Funcionalidades de Mapas
- **Autocompletado de direcciones**: Sugerencias en tiempo real
- **Visualización de propiedades**: Marcadores en mapa
- **Geolocalización**: Conversión dirección ↔ coordenadas
- **Filtros geográficos**: Búsqueda por área/ubicación

#### Componentes de Mapas
- `components/MapboxMap.jsx` - Mapa base
- `components/MapboxPropertiesMap.jsx` - Mapa con propiedades
- `components/MapboxSuggestions.jsx` - Sistema de sugerencias
- `hooks/useMapboxSuggestions.js` - Hook para autocomplete

### 7. Base de Datos y Backend

#### Esquema de Base de Datos

**Tablas Principales**:

```sql
-- Usuarios del sistema
users:
- id: uuid (PK)
- auth_id: uuid (FK a auth.users)
- email: text
- full_name: text
- role: enum (admin, seller, agent, user)
- is_approved: boolean
- phone: text
- avatar_url: text

-- Propiedades
properties:
- id: uuid (PK)
- user_id: uuid (FK)
- title, description, address: text
- price: numeric
- property_type: enum
- listing_type: enum
- area, rooms, bathrooms: numeric/integer
- has_garage, has_pool, has_garden: boolean
- is_featured: boolean
- location: geometry (PostGIS)
- images: text[]

-- Imágenes de propiedades
property_images:
- id: uuid (PK)
- property_id: uuid (FK)
- url: text
- order: integer
- is_cover: boolean

-- Enlaces de autenticación
user_auth_links:
- id: uuid (PK)
- user_id: uuid (FK)
- auth_id: uuid (FK)
- is_primary: boolean

-- Documentos de vendedores
seller_documents:
- id: uuid (PK)
- user_id: uuid (FK)
- document_type: enum
- url: text
- reviewed_by: uuid
```

**Tablas PostGIS**:
- `geography_columns` - Metadatos de columnas geográficas
- `geometry_columns` - Metadatos de columnas de geometría
- `spatial_ref_sys` - Sistemas de referencia espacial

#### APIs y Funciones

**API Routes**:
- `/api/admin/create-user` - Creación de usuarios por administradores
- `/api/auth/callback` - Callback de autenticación

**Supabase Functions**:
- `utils/supabase/client.js` - Cliente Supabase y funciones de auth
- `utils/supabase/properties.js` - Operaciones CRUD de propiedades
- `utils/supabase/provider.jsx` - Provider de contexto

### 8. Utilidades y Helpers

#### Gestión de Estado
- `lib/redux/store.js` - Configuración de Redux store
- `lib/redux/slices/authSlice.js` - Estado de autenticación
- `lib/redux/slices/propertySlice.js` - Estado de propiedades

#### Utilidades
- `utils/propertyFilters.js` - Helpers para filtros de propiedades
- `utils/image-helpers.js` - Manipulación de imágenes
- `utils/geo.js` - Utilidades geográficas
- `lib/utils.ts` - Utilidades generales (clsx, etc.)

#### Hooks Personalizados
- `hooks/use-mobile.tsx` - Detección de dispositivos móviles
- `hooks/use-toast.ts` - Sistema de notificaciones
- `components/hooks/useMapboxSuggestions.js` - Autocomplete de Mapbox
- `components/useResponsiveGrid.js` - Grid responsivo

### 9. UI y Experiencia de Usuario

#### Sistema de Diseño
- **Colores principales**: Dorado (#D4AF37), Negro (#1A1A1A)
- **Fuente**: Montserrat
- **Tema**: Oscuro por defecto
- **Responsive**: Mobile-first design

#### Componentes UI Base
- `components/ui/` - Componentes base de shadcn/ui
- **Buttons, Cards, Dialogs, Forms, etc.**
- **Theming**: Configurado en `tailwind.config.js`

#### Animaciones
- **Framer Motion**: Transiciones suaves entre páginas
- **Scroll animations**: Revelado progresivo de contenido
- **Loading states**: Skeletons y spinners
- **Micro-interactions**: Hover effects, click feedback

### 10. Configuración y Deployment

#### Archivos de Configuración
- `next.config.js` - Configuración de Next.js
- `tailwind.config.js` - Configuración de Tailwind CSS
- `components.json` - Configuración de shadcn/ui
- `jsconfig.json` - Configuración de JavaScript paths
- `middleware.js` - Middleware de Next.js para rutas protegidas

#### Deployment
- **Plataforma**: Netlify
- **Configuración**: `netlify.toml`
- **Build command**: `npm run build`
- **Variables de entorno**: Supabase URLs y keys

#### Scripts
- `scripts/update-users-table.js` - Migración de base de datos

### 11. Características Destacadas

#### Responsive Design
- **Mobile-first**: Diseño optimizado para móviles
- **Adaptive UI**: Componentes que se adaptan al tamaño de pantalla
- **Touch-friendly**: Interacciones optimizadas para touch

#### Performance
- **Image optimization**: Next.js Image component
- **Code splitting**: Carga diferida de componentes
- **Caching**: Estrategias de cache para datos frecuentes
- **SEO**: Meta tags y structured data

#### Accesibilidad
- **ARIA labels**: Etiquetas descriptivas
- **Keyboard navigation**: Navegación completa por teclado
- **Screen reader support**: Soporte para lectores de pantalla
- **Color contrast**: Contraste adecuado en el tema oscuro

#### Seguridad
- **RLS (Row Level Security)**: Políticas de seguridad en Supabase
- **Input validation**: Validación con Zod en frontend y backend
- **SQL injection prevention**: Consultas parametrizadas
- **Authentication flows**: Flujos seguros de autenticación

## Flujo de Usuario Típico

### Usuario Público
1. **Visita homepage** → Ve propiedades destacadas
2. **Usa barra de búsqueda** → Aplica filtros
3. **Navega resultados** → Ve lista/mapa de propiedades
4. **Selecciona propiedad** → Ve detalles completos
5. **Contacta vendedor** → WhatsApp/formulario

### Vendedor
1. **Se registra/login** → Accede al dashboard
2. **Crea propiedades** → Completa formulario con imágenes
3. **Gestiona listings** → Edita/actualiza propiedades
4. **Ve estadísticas** → Monitorea performance

### Administrador
1. **Login admin** → Acceso completo al dashboard
2. **Revisa propiedades** → Aprueba/rechaza submissions
3. **Gestiona usuarios** → Administra roles y permisos
4. **Configura destacadas** → Promociona propiedades
5. **Ve analytics** → Dashboard con métricas globales

## Estructura de Archivos del Proyecto

```
homever-inmobiliaria/
├── app/                          # Next.js App Router
│   ├── globals.css               # Estilos globales
│   ├── layout.js                 # Layout principal
│   ├── page.js                   # Homepage
│   ├── api/                      # API routes
│   ├── auth/callback/            # Callback de autenticación
│   ├── comprar/                  # Página de compra
│   ├── contacto/                 # Página de contacto
│   ├── dashboard/                # Panel administrativo
│   ├── formulario/               # Formularios
│   ├── listado/                  # Listado de propiedades
│   ├── login/                    # Página de login
│   ├── property/[id]/            # Detalle de propiedad
│   ├── propiedades/crear/        # Crear propiedad
│   ├── servicios/                # Página de servicios
│   └── test2/                    # Página de pruebas
├── components/                   # Componentes React
│   ├── auth/                     # Autenticación
│   ├── dashboard/                # Dashboard
│   ├── filters/                  # Filtros de búsqueda
│   ├── hooks/                    # Hooks personalizados
│   └── ui/                       # Componentes UI base
├── hooks/                        # Hooks globales
├── lib/                          # Librerías y utilidades
│   ├── redux/                    # Estado global Redux
│   ├── data.js                   # Datos mock
│   ├── supabase.js               # Cliente Supabase
│   └── utils.ts                  # Utilidades
├── public/                       # Archivos estáticos
│   └── images/                   # Imágenes
├── scripts/                      # Scripts de desarrollo
├── styles/                       # Estilos adicionales
├── utils/                        # Utilidades específicas
│   ├── geo.js                    # Utilidades geográficas
│   ├── image-helpers.js          # Helpers de imágenes
│   ├── propertyFilters.js        # Filtros de propiedades
│   └── supabase/                 # Utilidades Supabase
├── components.json               # Config shadcn/ui
├── jsconfig.json                 # Config JavaScript
├── middleware.js                 # Middleware Next.js
├── netlify.toml                  # Config Netlify
├── next.config.js                # Config Next.js
├── package.json                  # Dependencias
├── postcss.config.mjs            # Config PostCSS
└── tailwind.config.js            # Config Tailwind
```

## Esquema de Base de Datos Completo

### Tablas PostGIS (Sistema de geolocalización)
- **geography_columns**: Metadatos de columnas geográficas con SRID, catálogo, esquema
- **geometry_columns**: Metadatos de columnas de geometría con dimensiones y tipos
- **spatial_ref_sys**: Sistemas de referencia espacial para proyecciones cartográficas

### Tabla: properties (Propiedades principales)
- **id**: UUID único de la propiedad
- **title**: Título descriptivo de la propiedad
- **description**: Descripción detallada
- **address**: Dirección física completa
- **price**: Precio en formato numérico
- **property_type**: Tipo (casa, departamento, terreno, oficina, comercial)
- **listing_type**: Operación (venta, alquiler)
- **area**: Superficie total en m²
- **land_area**: Superficie del terreno en m²
- **semi_covered_area**: Superficie semicubierta en m²
- **rooms**: Número de habitaciones/ambientes
- **bathrooms**: Número de baños
- **has_garage**: Boolean - tiene cochera
- **has_pool**: Boolean - tiene piscina
- **has_garden**: Boolean - tiene jardín
- **is_featured**: Boolean - propiedad destacada
- **location**: Geometría PostGIS (coordenadas)
- **user_id**: FK al usuario propietario
- **images**: Array de URLs de imágenes

### Tabla: property_images (Imágenes de propiedades)
- **id**: UUID único de la imagen
- **property_id**: FK a properties
- **url**: URL de la imagen almacenada
- **order**: Orden de visualización
- **is_cover**: Boolean - imagen de portada

### Tabla: users (Usuarios del sistema)
- **id**: UUID único del usuario
- **auth_id**: FK a auth.users de Supabase
- **email**: Correo electrónico (único)
- **full_name**: Nombre completo
- **role**: Rol (admin, seller, agent, user)
- **is_approved**: Boolean - cuenta aprobada
- **can_bypass_approval**: Boolean - puede saltear aprobación
- **phone**: Número de teléfono
- **avatar_url**: URL del avatar
- **created_at**: Timestamp de creación
- **updated_at**: Timestamp de última actualización



Este README documenta una plataforma inmobiliaria completa y moderna, con arquitectura escalable, seguridad robusta, y experiencia de usuario optimizada tanto para el frontend público como para la administración backend.
