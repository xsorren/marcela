"use client"

import { useState, useEffect } from "react"
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
import toast from 'react-hot-toast'

export default function DebugFormSubmitPage() {
  const dispatch = useDispatch()
  const [propertyId, setPropertyId] = useState("")
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const property = useSelector(selectCurrentProperty)
  const propertyLoading = useSelector(selectPropertyIsLoading)
  const propertyError = useSelector(selectPropertyError)

  const addLog = (message, data = null, type = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null,
      type
    }
    setLogs(prev => [logEntry, ...prev].slice(0, 30))
    console.log(`[${type.toUpperCase()}] ${message}`, data)
  }

  const loadProperty = async () => {
    if (!propertyId.trim()) {
      addLog("Error: ID de propiedad requerido", null, "error")
      return
    }

    addLog("Cargando propiedad...", { id: propertyId })
    
    try {
      const result = await dispatch(fetchProperty(propertyId))
      
      if (fetchProperty.fulfilled.match(result)) {
        addLog("✅ Propiedad cargada exitosamente", result.payload, "success")
      } else {
        addLog("❌ Error cargando propiedad", result.payload, "error")
      }
    } catch (error) {
      addLog("❌ Error inesperado cargando propiedad", error.message, "error")
    }
  }

  const testFormSubmit = async () => {
    if (!property) {
      addLog("Error: Primero carga una propiedad", null, "error")
      return
    }

    setIsLoading(true)
    addLog("Simulando submit del formulario...", { propertyId: property.id })

    // Simular datos del formulario
    const formData = {
      title: property.title + " - EDITADO " + new Date().toLocaleTimeString(),
      description: property.description || "Descripción editada",
      address: property.address || "Dirección editada",
      price: property.price || 100000,
      property_type: property.property_type || "house",
      listing_type: property.listing_type || "sale",
      // Simular ubicación válida
      location: {
        latitude: -34.6037,
        longitude: -58.3816
      }
    }

    try {
      // Simular validación de ubicación
      addLog("Validando ubicación...", formData.location)
      
      if (!formData.location || !formData.location.latitude || !formData.location.longitude) {
        addLog("❌ Validación de ubicación falló", null, "error")
        toast.error("Ubicación requerida")
        return
      }
      
      addLog("✅ Validación de ubicación exitosa", null, "success")

      // Simular validación de imágenes
      addLog("Validando imágenes...", null)
      addLog("✅ Validación de imágenes exitosa", null, "success")

      // Intentar actualización
      addLog("Iniciando actualización...", formData)
      const saveToastId = toast.loading("Actualizando propiedad...")

      const result = await dispatch(updateProperty({ 
        id: property.id, 
        propertyData: formData 
      }))

      addLog("Resultado de actualización:", result, result.type.includes('fulfilled') ? "success" : "error")

      if (updateProperty.fulfilled.match(result)) {
        addLog("✅ Actualización exitosa", result.payload, "success")
        toast.success("Propiedad actualizada correctamente", { id: saveToastId })
      } else {
        addLog("❌ Error en actualización", result.payload, "error")
        const errorMessage = result.payload || result.error?.message || "No se pudo actualizar la propiedad"
        toast.error(`Error: ${errorMessage}`, { id: saveToastId })
      }

    } catch (error) {
      addLog("❌ Error inesperado en submit", error.message, "error")
      toast.error(`Error inesperado: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    console.clear()
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Submit del Formulario
        </h1>
        <p className="text-muted-foreground mt-2">
          Simula el proceso completo de submit del formulario de edición
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
                    placeholder="UUID de la propiedad"
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={loadProperty}
                  disabled={propertyLoading || !propertyId.trim()}
                  className="w-full"
                >
                  {propertyLoading ? "Cargando..." : "Cargar Propiedad"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {property && (
            <Card>
              <CardHeader>
                <CardTitle>Propiedad Cargada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>ID:</strong> {property.id}</p>
                  <p><strong>Título:</strong> {property.title}</p>
                  <p><strong>Dirección:</strong> {property.address}</p>
                  <p><strong>Precio:</strong> ${property.price?.toLocaleString()}</p>
                  <p><strong>Tipo:</strong> {property.property_type}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Pruebas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={testFormSubmit}
                  disabled={isLoading || !property}
                  className="w-full"
                >
                  {isLoading ? "Probando..." : "Simular Submit Formulario"}
                </Button>
                
                <Button 
                  onClick={clearLogs}
                  variant="destructive"
                  className="w-full"
                >
                  Limpiar Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Logs de Debug</CardTitle>
              <p className="text-sm text-muted-foreground">
                Seguimiento paso a paso del proceso de submit
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className={`text-xs border-l-4 pl-3 py-2 ${
                      log.type === 'success' ? 'border-green-500 bg-green-50' :
                      log.type === 'error' ? 'border-red-500 bg-red-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="font-medium">
                        [{log.timestamp}] {log.message}
                      </div>
                      {log.data && (
                        <pre className="mt-1 text-xs overflow-auto bg-white p-2 rounded max-h-32">
                          {log.data}
                        </pre>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay logs aún. Carga una propiedad y prueba el submit.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>1.</strong> Ingresa el ID de una propiedad existente</p>
            <p><strong>2.</strong> Haz click en "Cargar Propiedad"</p>
            <p><strong>3.</strong> Una vez cargada, haz click en "Simular Submit Formulario"</p>
            <p><strong>4.</strong> Revisa los logs para ver cada paso del proceso</p>
            <p><strong>5.</strong> Identifica exactamente dónde se bloquea el submit</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}