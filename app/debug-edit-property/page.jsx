"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  fetchProperty, 
  updateProperty,
  selectCurrentProperty,
  selectPropertyIsLoading,
  selectPropertyError
} from "@/lib/redux/slices/propertySlice"

export default function DebugEditPropertyPage() {
  const dispatch = useDispatch()
  const [propertyId, setPropertyId] = useState("")
  const [logs, setLogs] = useState([])
  
  const property = useSelector(selectCurrentProperty)
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)

  const addLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    }
    setLogs(prev => [logEntry, ...prev].slice(0, 10))
  }

  const handleFetchProperty = async () => {
    if (!propertyId.trim()) {
      addLog("Error: ID de propiedad requerido")
      return
    }

    addLog("Cargando propiedad...", { id: propertyId })
    
    try {
      const result = await dispatch(fetchProperty(propertyId))
      
      if (fetchProperty.fulfilled.match(result)) {
        addLog("Propiedad cargada exitosamente", result.payload)
      } else {
        addLog("Error al cargar propiedad", result.payload)
      }
    } catch (err) {
      addLog("Error inesperado", err.message)
    }
  }

  const handleTestUpdate = async () => {
    if (!property) {
      addLog("Error: No hay propiedad cargada para actualizar")
      return
    }

    const testData = {
      ...property,
      title: `${property.title} - EDITADO ${new Date().toLocaleTimeString()}`,
      description: `${property.description}\n\nEditado en debug: ${new Date().toISOString()}`
    }

    addLog("Actualizando propiedad...", testData)

    try {
      const result = await dispatch(updateProperty({ 
        id: property.id, 
        propertyData: testData 
      }))
      
      if (updateProperty.fulfilled.match(result)) {
        addLog("Propiedad actualizada exitosamente", result.payload)
      } else {
        addLog("Error al actualizar propiedad", result.payload)
      }
    } catch (err) {
      addLog("Error inesperado en actualización", err.message)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Edición de Propiedades
        </h1>
        <p className="text-muted-foreground mt-2">
          Página para probar el flujo completo de edición con Redux
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controles */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cargar Propiedad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ID de Propiedad:</label>
                  <Input
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Ingresa el UUID de la propiedad"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleFetchProperty}
                  disabled={isLoading || !propertyId.trim()}
                  className="w-full"
                >
                  {isLoading ? "Cargando..." : "Cargar Propiedad"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Probar Actualización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Actualiza la propiedad cargada con datos de prueba
                </p>
                <Button 
                  onClick={handleTestUpdate}
                  disabled={!property || isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Actualizar con Datos de Prueba
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado Redux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Loading:</strong> {isLoading ? "Sí" : "No"}
                </div>
                <div>
                  <strong>Error:</strong> {error || "Ninguno"}
                </div>
                <div>
                  <strong>Propiedad cargada:</strong> {property ? "Sí" : "No"}
                </div>
                {property && (
                  <div>
                    <strong>ID:</strong> {property.id}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos de la Propiedad</CardTitle>
            </CardHeader>
            <CardContent>
              {property ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Título:</strong> {property.title}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {property.property_type}
                  </div>
                  <div>
                    <strong>Precio:</strong> ${property.price}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {property.address}
                  </div>
                  <div>
                    <strong>Imágenes:</strong> {property.images?.length || 0}
                  </div>
                  <div>
                    <strong>Ubicación:</strong> 
                    {property.location ? 
                      `${property.location.latitude}, ${property.location.longitude}` : 
                      "No disponible"
                    }
                  </div>
                  <div className="mt-4">
                    <strong>Datos completos:</strong>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                      {JSON.stringify(property, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay propiedad cargada
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs de Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs border-b border-border pb-2">
                      <div className="font-medium text-foreground">
                        [{log.timestamp}] {log.message}
                      </div>
                      {log.data && (
                        <pre className="text-muted-foreground mt-1 overflow-auto">
                          {log.data}
                        </pre>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay logs aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades Probadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="text-green-600">
                  <strong>✅ Redux fetchProperty:</strong> Carga propiedad por ID
                </div>
                <div className="text-green-600">
                  <strong>✅ Redux updateProperty:</strong> Actualiza propiedad
                </div>
                <div className="text-green-600">
                  <strong>✅ Selectores:</strong> Estado reactivo
                </div>
                <div className="text-green-600">
                  <strong>✅ Manejo de errores:</strong> Errores capturados
                </div>
                <div className="text-blue-600">
                  <strong>🔧 Nuevas funciones:</strong> Ubicación manual, imágenes mejoradas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}