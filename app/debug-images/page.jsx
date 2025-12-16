"use client"

import { useState } from "react"
import { PropertyImages } from "@/components/property-images"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugImagesPage() {
  const [images, setImages] = useState([])
  const [logs, setLogs] = useState([])

  const addLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    }
    setLogs(prev => [logEntry, ...prev].slice(0, 20)) // Mantener últimos 20 logs
  }

  const handleUpdateImages = (newImages) => {
    addLog("handleUpdateImages llamado", newImages)
    setImages(newImages)
  }

  const handleReset = () => {
    setImages([])
    setLogs([])
    addLog("Reset realizado")
  }

  const testInitialImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]

  const [useInitialImages, setUseInitialImages] = useState(false)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Subida de Imágenes
        </h1>
        <p className="text-muted-foreground mt-2">
          Página para debuggear problemas con la subida de imágenes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Componente de imágenes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Componente PropertyImages</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={useInitialImages ? "default" : "outline"}
                  onClick={() => setUseInitialImages(!useInitialImages)}
                >
                  {useInitialImages ? "Con imágenes iniciales" : "Sin imágenes iniciales"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PropertyImages
                key={useInitialImages ? 'with-initial' : 'without-initial'} // Forzar re-render
                propertyId="debug-property-123"
                initialImages={useInitialImages ? testInitialImages : []}
                onUpdate={handleUpdateImages}
                isSaving={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          {/* Estado actual */}
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Cantidad:</strong> {images.length}
                </div>
                <div>
                  <strong>URLs:</strong>
                  {images.length > 0 ? (
                    <ul className="list-disc list-inside mt-1">
                      {images.map((url, index) => (
                        <li key={index} className="text-xs text-muted-foreground truncate">
                          {url}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground"> Ninguna</span>
                  )}
                </div>
                <div className="mt-4">
                  <strong>Datos completos:</strong>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                    {JSON.stringify(images, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs de debugging */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Logs de Debug</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLogs([])}
                >
                  Limpiar Logs
                </Button>
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
                    No hay logs aún. Sube imágenes para generar logs.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones de Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p><strong>1.</strong> Prueba subir imágenes arrastrando archivos</p>
                <p><strong>2.</strong> Observa los logs en tiempo real</p>
                <p><strong>3.</strong> Verifica que onUpdate se llame correctamente</p>
                <p><strong>4.</strong> Prueba con y sin imágenes iniciales</p>
                <p><strong>5.</strong> Verifica que las URLs sean válidas</p>
                <p><strong>6.</strong> Abre la consola del navegador para más detalles</p>
              </div>
            </CardContent>
          </Card>

          {/* Problemas conocidos */}
          <Card>
            <CardHeader>
              <CardTitle>Problemas Posibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="text-red-600">
                  <strong>❌ onUpdate no se llama:</strong> Problema en PropertyImages
                </div>
                <div className="text-red-600">
                  <strong>❌ URLs inválidas:</strong> Problema en subida a Supabase
                </div>
                <div className="text-red-600">
                  <strong>❌ Estado no se actualiza:</strong> Problema en handleUpdateImages
                </div>
                <div className="text-green-600">
                  <strong>✅ Todo funciona:</strong> Logs muestran llamadas correctas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}