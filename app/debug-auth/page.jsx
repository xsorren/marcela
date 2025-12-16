"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/utils/supabase/client"

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState(null)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = getSupabaseClient()
      
      // Verificar usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log("User data:", userData)
      console.log("User error:", userError)
      
      // Verificar sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log("Session data:", sessionData)
      console.log("Session error:", sessionError)
      
      setUser(userData?.user || null)
      setSession(sessionData?.session || null)
      
      if (userError) {
        setError(userError.message)
      } else if (sessionError) {
        setError(sessionError.message)
      }
      
      // Determinar estado de autenticación
      if (userData?.user && sessionData?.session) {
        setAuthState("authenticated")
      } else if (userError || sessionError) {
        setAuthState("error")
      } else {
        setAuthState("unauthenticated")
      }
      
    } catch (err) {
      console.error("Error checking auth:", err)
      setError(err.message)
      setAuthState("error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Suscribirse a cambios de autenticación
    const supabase = getSupabaseClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      checkAuth()
    })

    return () => subscription.unsubscribe()
  }, [])

  const testCreateProperty = async () => {
    try {
      const supabase = getSupabaseClient()
      
      // Datos de prueba mínimos
      const testProperty = {
        title: "Propiedad de Prueba",
        description: "Esta es una propiedad de prueba para verificar RLS",
        address: "Buenos Aires, Argentina",
        price: 100000,
        property_type: "house",
        listing_type: "sale",
        location: {
          latitude: -34.6037,
          longitude: -58.3816
        }
      }
      
      console.log("Intentando crear propiedad de prueba:", testProperty)
      
      const { data, error } = await supabase
        .from('properties')
        .insert([testProperty])
        .select()
        .single()
      
      console.log("Resultado de inserción:", { data, error })
      
      if (error) {
        setError(`Error RLS: ${error.message}`)
      } else {
        setError(null)
        console.log("Propiedad creada exitosamente:", data)
      }
      
    } catch (err) {
      console.error("Error en test:", err)
      setError(`Error de prueba: ${err.message}`)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Autenticación y RLS
        </h1>
        <p className="text-muted-foreground mt-2">
          Página para debuggear problemas de autenticación y Row Level Security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estado de autenticación */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Autenticación</CardTitle>
              <Button onClick={checkAuth} disabled={loading}>
                {loading ? "Verificando..." : "Refrescar"}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Verificando autenticación...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <strong>Estado:</strong>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      authState === 'authenticated' ? 'bg-green-100 text-green-800' :
                      authState === 'unauthenticated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {authState || 'Desconocido'}
                    </span>
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  
                  <div>
                    <strong>Usuario ID:</strong> {user?.id || 'No disponible'}
                  </div>
                  
                  <div>
                    <strong>Email:</strong> {user?.email || 'No disponible'}
                  </div>
                  
                  <div>
                    <strong>Sesión válida:</strong> {session ? 'Sí' : 'No'}
                  </div>
                  
                  <div>
                    <strong>Token presente:</strong> {session?.access_token ? 'Sí' : 'No'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prueba de RLS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Prueba insertar una propiedad directamente para verificar las políticas RLS
                </p>
                <Button 
                  onClick={testCreateProperty}
                  disabled={authState !== 'authenticated'}
                  variant={authState === 'authenticated' ? 'default' : 'outline'}
                >
                  Probar Inserción Directa
                </Button>
                {authState !== 'authenticated' && (
                  <p className="text-sm text-yellow-600">
                    Debe estar autenticado para probar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información detallada */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos de la Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soluciones Posibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="text-green-600">
                  <strong>✅ Si está autenticado:</strong> Las políticas RLS deberían permitir la inserción
                </div>
                <div className="text-red-600">
                  <strong>❌ Si no está autenticado:</strong> Debe iniciar sesión primero
                </div>
                <div className="text-blue-600">
                  <strong>🔧 Si RLS falla:</strong> Verificar políticas en Supabase Dashboard
                </div>
                <div className="text-purple-600">
                  <strong>⚙️ Política sugerida:</strong> ENABLE para usuarios autenticados
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}