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

export default function DebugLocationValidationPage() {
  const dispatch = useDispatch()
  const [propertyId, setPropertyId] = useState("")
  const [logs, setLogs] = useState([])
  const [testPrice, setTestPrice] = useState("")
  
  const property = useSelector(selectCurrentProperty)
  const propertyLoading = useSelector(selectPropertyIsLoading)

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
        setTestPrice(result.payload.price?.toString() || "")
      } else {
        addLog("❌ Error cargando propiedad", result.payload, "error")
      }
    } catch (error) {
      addLog("❌ Error inesperado cargando propiedad", error.message, "error")
    }
  }

  const testPriceUpdate = async () => {
    if (!property || !testPrice) {
      addLog("Error: Propiedad y precio requeridos", null, "error")
      return
    }

    addLog("Probando actualización solo de precio...", { 
      propertyId: property.id, 
      oldPrice: property.price,
      newPrice: testPrice
    })

    // Simular datos del formulario con SOLO cambio de precio
    const formData = {
      // Mantener todos los datos existentes
      title: property.title,
      description: property.description,
      address: property.address, // ← CLAVE: usar dirección existente
      price: Number(testPrice), // ← ÚNICO CAMBIO
      property_type: property.property_type,
      listing_type: property.listing_type,
      area: property.area,
      land_area: property.land_area,
      semi_covered_area: property.semi_covered_area,
      rooms: property.rooms,
      bathrooms: property.bathrooms,
      has_garage: property.has_garage,
      has_pool: property.has_pool,
      has_garden: property.has_garden,
      images: property.images || [],
      // NO incluir location nueva - usar la existente implícitamente
    }

    try {
      addLog("Datos a enviar:", formData)
      const saveToastId = toast.loading("Actualizando precio...")

      const result = await dispatch(updateProperty({ 
        id: property.id, 
        propertyData: formData 
      }))

      addLog("Resultado de actualización:", result, result.type.includes('fulfilled') ? "success" : "error")

      if (updateProperty.fulfilled.match(result)) {
        addLog("✅ Actualización de precio exitosa", result.payload, "success")
        toast.success("Precio actualizado correctamente", { id: saveToastId })
      } else {
        addLog("❌ Error en actualización de precio", result.payload, "error")
        const errorMessage = result.payload || result.error?.message || "No se pudo actualizar el precio"
        toast.error(`Error: ${errorMessage}`, { id: saveToastId })
      }

    } catch (error) {
      addLog("❌ Error inesperado en actualización", error.message, "error")
      toast.error(`Error inesperado: ${error.message}`)
    }
  }

  const testLocationValidation = () => {
    if (!property) {
      addLog("Error: Primero carga una propiedad", null, "error")
      return
    }

    addLog("Probando validación de ubicación...", {
      address: property.address,
      hasLocation: !!property.location,
      addressLength: property.address?.length || 0
    })

    // Simular validación
    const hasValidAddress = property.address && property.address.trim().length >= 5
    const hasValidLocation = !!property.location

    addLog("Resultado de validación:", {
      hasValidAddress,
      hasValidLocation,
      shouldPass: hasValidAddress || hasValidLocation
    }, hasValidAddress || hasValidLocation ? "success" : "error")
  }

  const clearLogs = () => {
    setLogs([])
    console.clear()
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Validación de Ubicación
        </h1>
        <p className="text-muted-foreground mt-2">
          Prueba específica para el problema de edición sin cambiar ubicación
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
                  <p><strong>Precio Actual:</strong> ${property.price?.toLocaleString()}</p>
                  <p><strong>Tiene Location:</strong> {property.location ? "Sí" : "No"}</p>
                  <p><strong>Longitud Dirección:</strong> {property.address?.length || 0} caracteres</p>
                </div>
              </CardContent>
            </Card>
          )}

          {property && (
            <Card>
              <CardHeader>
                <CardTitle>Prueba de Precio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nuevo Precio:</label>
                    <Input
                      type="number"
                      value={testPrice}
                      onChange={(e) => setTestPrice(e.target.value)}
                      placeholder="Ingresa nuevo precio"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={testPriceUpdate}
                    disabled={!testPrice}
                    className="w-full"
                  >
                    Actualizar Solo Precio
                  </Button>
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
                  onClick={testLocationValidation}
                  disabled={!property}
                  variant="outline"
                  className="w-full"
                >
                  Probar Validación de Ubicación
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
                Seguimiento del problema de validación de ubicación
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
                    No hay logs aún. Carga una propiedad y prueba cambiar solo el precio.
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
            <p><strong>Problema:</strong> Solo guarda si se modifica la ubicación</p>
            <p><strong>1.</strong> Carga una propiedad existente</p>
            <p><strong>2.</strong> Cambia solo el precio (sin tocar ubicación)</p>
            <p><strong>3.</strong> Haz click en "Actualizar Solo Precio"</p>
            <p><strong>4.</strong> Debería funcionar sin requerir cambio de ubicación</p>
            <p><strong>5.</strong> Revisa los logs para ver el proceso completo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}