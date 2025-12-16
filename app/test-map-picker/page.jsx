"use client"

import { useState } from "react"
import MapboxLocationPicker from "@/components/MapboxLocationPicker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMapPickerPage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [logs, setLogs] = useState([])

  const addLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    }
    setLogs(prev => [logEntry, ...prev].slice(0, 10)) // Mantener solo los últimos 10 logs
  }

  const handleLocationSelect = (locationData) => {
    addLog("Ubicación seleccionada", locationData)
    setSelectedLocation(locationData)
  }

  const handleReset = () => {
    setSelectedLocation(null)
    setLogs([])
    addLog("Reset realizado")
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Test MapboxLocationPicker
        </h1>
        <p className="text-muted-foreground mt-2">
          Página de prueba para debuggear el componente de selección de ubicación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Componente de mapa */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Selector de Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <MapboxLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={null}
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          {/* Ubicación actual */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación Seleccionada</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-2">
                  <div>
                    <strong>Latitud:</strong> {selectedLocation.latitude || 'N/A'}
                  </div>
                  <div>
                    <strong>Longitud:</strong> {selectedLocation.longitude || 'N/A'}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {selectedLocation.address || 'N/A'}
                  </div>
                  <div>
                    <strong>Fuente:</strong> {selectedLocation.source || 'N/A'}
                  </div>
                  <div className="mt-4">
                    <strong>Datos completos:</strong>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(selectedLocation, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay ubicación seleccionada
                </p>
              )}
            </CardContent>
          </Card>

          {/* Logs de debugging */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Logs de Debug</CardTitle>
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Limpiar
                </button>
              </div>
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
                    No hay logs aún. Haz click en el mapa para generar logs.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>1. Haz click en cualquier parte del mapa</p>
                <p>2. Observa los logs en tiempo real</p>
                <p>3. Verifica que las coordenadas sean válidas</p>
                <p>4. Prueba arrastrar el marcador</p>
                <p>5. Verifica que el reverse geocoding funcione</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}