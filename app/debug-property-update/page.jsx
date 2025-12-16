"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateProperty } from "@/lib/redux/slices/propertySlice"
import { updateProperty as updatePropertyDirect } from "@/utils/supabase/properties"

export default function DebugPropertyUpdatePage() {
  const dispatch = useDispatch()
  const [propertyId, setPropertyId] = useState("")
  const [testData, setTestData] = useState({
    title: "Propiedad de Prueba - Editada",
    description: "Esta es una descripción editada para pruebas",
    address: "Nueva dirección de prueba, Buenos Aires",
    price: 150000,
    property_type: "house",
    listing_type: "sale"
  })
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message, data = null, type = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null,
      type
    }
    setLogs(prev => [logEntry, ...prev].slice(0, 20))
    console.log(`[${type.toUpperCase()}] ${message}`, data)
  }

  const testReduxUpdate = async () => {
    if (!propertyId.trim()) {
      addLog("Error: ID de propiedad requerido", null, "error")
      return
    }

    setIsLoading(true)
    addLog("Iniciando actualización via Redux...", { id: propertyId, data: testData })

    try {
      const result = await dispatch(updateProperty({ 
        id: propertyId, 
        propertyData: testData 
      }))
      
      addLog("Resultado de Redux:", result, result.type.includes('fulfilled') ? "success" : "error")
      
      if (updateProperty.fulfilled.match(result)) {
        addLog("✅ Actualización Redux exitosa", result.payload, "success")
      } else {
        addLog("❌ Error en Redux", result.payload, "error")
      }
    } catch (error) {
      addLog("❌ Error inesperado en Redux", error.message, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectUpdate = async () => {
    if (!propertyId.trim()) {
      addLog("Error: ID de propiedad requerido", null, "error")
      return
    }

    setIsLoading(true)
    addLog("Iniciando actualización directa...", { id: propertyId, data: testData })

    try {
      const result = await updatePropertyDirect({ 
        id: propertyId, 
        propertyData: testData 
      })
      
      addLog("✅ Actualización directa exitosa", result, "success")
    } catch (error) {
      addLog("❌ Error en actualización directa", error.message, "error")
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
          Debug: Actualización de Propiedades
        </h1>
        <p className="text-muted-foreground mt-2">
          Página para debuggear específicamente el problema de actualización
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controles */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Prueba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ID de Propiedad:</label>
                  <Input
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="UUID de la propiedad a actualizar"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Título:</label>
                  <Input
                    value={testData.title}
                    onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Dirección:</label>
                  <Input
                    value={testData.address}
                    onChange={(e) => setTestData(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Descripción:</label>
                  <Textarea
                    value={testData.description}
                    onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Precio:</label>
                  <Input
                    type="number"
                    value={testData.price}
                    onChange={(e) => setTestData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pruebas de Actualización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={testReduxUpdate}
                  disabled={isLoading || !propertyId.trim()}
                  className="w-full"
                >
                  {isLoading ? "Probando..." : "Probar Redux Update"}
                </Button>
                
                <Button 
                  onClick={testDirectUpdate}
                  disabled={isLoading || !propertyId.trim()}
                  variant="outline"
                  className="w-full"
                >
                  Probar Actualización Directa
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
                Revisa también la consola del navegador para logs adicionales
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
                        <pre className="mt-1 text-xs overflow-auto bg-white p-2 rounded">
                          {log.data}
                        </pre>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay logs aún. Ejecuta una prueba para ver los resultados.
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
            <p><strong>2.</strong> Modifica los datos de prueba si quieres</p>
            <p><strong>3.</strong> Prueba "Redux Update" primero (es lo que usa la app)</p>
            <p><strong>4.</strong> Si falla, prueba "Actualización Directa" para aislar el problema</p>
            <p><strong>5.</strong> Revisa los logs aquí y en la consola del navegador</p>
            <p><strong>6.</strong> Busca errores específicos como RLS, autenticación, etc.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}