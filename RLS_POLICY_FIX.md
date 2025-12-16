# 🔒 Solución: Error de Row Level Security (RLS)

## 🚨 Problema Identificado

**Error**: `"new row violates row-level security policy"`
**Código**: `403 Unauthorized`
**Causa**: Las políticas RLS en Supabase están bloqueando la inserción de propiedades

## 🔍 Análisis del Problema

### Error RLS Explicado
- **RLS (Row Level Security)**: Sistema de seguridad de PostgreSQL/Supabase
- **Política violada**: La inserción no cumple con las reglas de seguridad
- **Usuario**: Probablemente no autenticado o sin permisos

### Arquitectura del Sistema
Según el README, el sistema es **simplificado**:
- ✅ **Un solo usuario administrador**
- ✅ **Sin tabla `users` personalizada**
- ✅ **Solo `auth.users` de Supabase**
- ❌ **Sin `user_id` en tabla `properties`**

## 🔧 Soluciones Implementadas

### 1. **Verificación de Autenticación**
```javascript
// En createProperty y updateProperty
const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

if (authError || !user) {
  throw new Error("Usuario no autenticado. Debe iniciar sesión para crear propiedades.");
}
```

### 2. **Página de Debug Creada**
- **URL**: `/debug-auth`
- **Funciones**: Verificar estado de autenticación y probar RLS

### 3. **Logs de Debug**
```javascript
console.log("Usuario autenticado:", user.id);
```

## 🛠️ Configuración RLS Requerida

### Política Sugerida para Tabla `properties`

```sql
-- Habilitar RLS en la tabla properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden insertar propiedades" 
ON properties 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para permitir SELECT a todos (público)
CREATE POLICY "Todos pueden ver propiedades" 
ON properties 
FOR SELECT 
TO public 
USING (true);

-- Política para permitir UPDATE a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar propiedades" 
ON properties 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Política para permitir DELETE a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar propiedades" 
ON properties 
FOR DELETE 
TO authenticated 
USING (true);
```

### Política para Tabla `property_images`

```sql
-- Habilitar RLS en la tabla property_images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden gestionar imágenes" 
ON property_images 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Política para permitir SELECT a todos (público)
CREATE POLICY "Todos pueden ver imágenes" 
ON property_images 
FOR SELECT 
TO public 
USING (true);
```

## 🧪 Pasos de Debug

### 1. **Verificar Autenticación**
1. Ir a `/debug-auth`
2. Verificar que el estado sea "authenticated"
3. Confirmar que hay un `user.id` válido
4. Verificar que la sesión tenga `access_token`

### 2. **Probar RLS Directamente**
1. En `/debug-auth`, hacer click en "Probar Inserción Directa"
2. Verificar en consola si la inserción funciona
3. Si falla, revisar el mensaje de error específico

### 3. **Verificar en Supabase Dashboard**
1. Ir a Supabase Dashboard → Authentication
2. Verificar que el usuario esté listado
3. Ir a Database → Tables → properties
4. Verificar las políticas RLS en la pestaña "Policies"

## 📋 Checklist de Verificación

### ✅ Autenticación
- [ ] Usuario está logueado
- [ ] Sesión es válida
- [ ] Token de acceso presente
- [ ] No hay errores de auth

### ✅ Políticas RLS
- [ ] RLS habilitado en tabla `properties`
- [ ] Política INSERT para `authenticated` existe
- [ ] Política SELECT para `public` existe
- [ ] Política UPDATE para `authenticated` existe
- [ ] Política DELETE para `authenticated` existe

### ✅ Código
- [ ] Verificación de auth en `createProperty`
- [ ] Verificación de auth en `updateProperty`
- [ ] Logs de debug implementados
- [ ] Manejo de errores mejorado

## 🎯 Soluciones por Escenario

### Escenario 1: Usuario No Autenticado
**Síntoma**: Error 403 + "Usuario no autenticado"
**Solución**: 
1. Ir a `/login`
2. Iniciar sesión con credenciales válidas
3. Verificar en `/debug-auth` que esté autenticado

### Escenario 2: Políticas RLS Faltantes
**Síntoma**: Error 403 + usuario autenticado
**Solución**:
1. Ejecutar las políticas SQL sugeridas arriba
2. Verificar en Supabase Dashboard
3. Probar nuevamente la inserción

### Escenario 3: Token Expirado
**Síntoma**: Sesión inválida en `/debug-auth`
**Solución**:
1. Cerrar sesión
2. Iniciar sesión nuevamente
3. Verificar que el token sea válido

### Escenario 4: Permisos de Base de Datos
**Síntoma**: Error persiste con todo configurado
**Solución**:
1. Verificar rol del usuario en Supabase
2. Verificar que las tablas existan
3. Contactar soporte de Supabase si es necesario

## 🚀 Resultado Esperado

Después de aplicar las soluciones:

### ✅ Funcionalidad Restaurada
- **Creación de propiedades** funciona sin errores 403
- **Actualización de propiedades** funciona correctamente
- **Autenticación** se verifica antes de operaciones
- **Políticas RLS** permiten operaciones autorizadas

### ✅ Seguridad Mantenida
- **Solo usuarios autenticados** pueden crear/editar
- **Público** puede ver propiedades
- **Datos protegidos** por RLS
- **Acceso controlado** según políticas

---

**🎯 Usar `/debug-auth` para verificar el estado actual y aplicar las políticas SQL según sea necesario.**