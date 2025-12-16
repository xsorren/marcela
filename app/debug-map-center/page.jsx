"use client"

import { useState } from "react"
import MapboxLocationPicker from "@/components/MapboxLocationPicker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugMapCenterPage() {
  const [testCase, setTestCase] = useState('no-initial')
  const [selectedLocation, setSelectedLocation] = useState(null)

  const testCases = {
    'no-initial': {
      name: 'Sin ubicación inicial (null)',
      initialLocation: null,
      description: 'Debería centrarse en Buenos Aires (-58.3816, -34.6037)'
    },
    'valid-initial': {
      name: 'Ubicación inicial válida',
      initialLocation: { latitude: -35.0167, longitude: -59.0167 }, // Navarro
      description: 'Debería centrarse en Navarro (-59.0167, -35.0167)'
    },
    'invalid-initial': {
      name: 'Ubicación inicial inválida',
      initialLocation: { latitude: null, longitude: null },
      description: 'Debería centrarse en Buenos Aires por defecto'
    },
    'ocean-coords': {
      name: 'Coordenadas en océano (bug test)',
      initialLocation: { latitude: -34.6037, longitude: 58.3816 }, // Sin signo negativo en longitud
      description: 'Coordenadas incorrectas que llevan al océano'
    }
  }

  const currentTest = testCases[testCase]

  const handleLocationSelect = (locationData) => {
    console.log('Ubicación seleccionada:', locationData)
    setSelectedLocation(locationData)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Debug: Centro del Mapa
        </h1>
        <p className="text-muted-foreground mt-2">
          Página para debuggear el problema del centro del mapa
        </p>
      </div>

      {/* Controles de prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testCases).map(([key, test]) => (
              <Button
                key={key}
                variant={testCase === key ? "default" : "outline"}
                onClick={() => setTestCase(key)}
                className="text-left h-auto p-4"
              >
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {test.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mapa */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Prueba</CardTitle>
              <div className="text-sm text-muted-foreground">
                <strong>Caso actual:</strong> {currentTest.name}
                <br />
                <strong>Descripción:</strong> {currentTest.description}
                <br />
                <strong>InitialLocation:</strong> {JSON.stringify(currentTest.initialLocation)}
              </div>
            </CardHeader>
            <CardContent>
              <MapboxLocationPicker
                key={testCase} // Forzar re-render cuando cambie el caso
                onLocationSelect={handleLocationSelect}
                initialLocation={currentTest.initialLocation}
                height="500px"
              />
            </CardContent>
          </Card>
        </div>

        {/* Información */}
        <div className="space-y-4">
          {/* Coordenadas esperadas */}
          <Card>
            <CardHeader>
              <CardTitle>Coordenadas Esperadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Buenos Aires (por defecto):</strong>
                  <br />
                  Lat: -34.6037, Lng: -58.3816
                </div>
                <div>
                  <strong>Navarro (ejemplo):</strong>
                  <br />
                  Lat: -35.0167, Lng: -59.0167
                </div>
                <div className="text-red-600">
                  <strong>⚠️ Océano (bug):</strong>
                  <br />
                  Lat: -34.6037, Lng: 58.3816 (sin signo negativo)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación seleccionada */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación Seleccionada</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Latitud:</strong> {selectedLocation.latitude}
                  </div>
                  <div>
                    <strong>Longitud:</strong> {selectedLocation.longitude}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {selectedLocation.address}
                  </div>
                  <div>
                    <strong>Fuente:</strong> {selectedLocation.source}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Haz click en el mapa para seleccionar una ubicación
                </p>
              )}
            </CardContent>
          </Card>

          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones de Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p><strong>1.</strong> Selecciona diferentes casos de prueba</p>
                <p><strong>2.</strong> Verifica que el mapa se centre correctamente</p>
                <p><strong>3.</strong> Abre la consola del navegador para ver logs</p>
                <p><strong>4.</strong> Si ves océano, hay un problema con las coordenadas</p>
                <p><strong>5.</strong> Buenos Aires debería estar en Argentina, no en el océano</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}