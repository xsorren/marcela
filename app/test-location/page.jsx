"use client"

import { useState } from "react"
import { PropertyForm } from "@/components/property-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLocationPage() {
  const [savedData, setSavedData] = useState(null)

  const handleSave = (data) => {
    console.log("Datos guardados:", data)
    console.log("Dirección guardada:", data.address)
    console.log("Ubicación guardada:", data.location)
    console.log("Fuente de ubicación:", data.location_source)
    setSavedData(data)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Prueba de Selección de Ubicación
        </h1>
        <p className="text-muted-foreground mt-2">
          Prueba la nueva funcionalidad de selección manual de ubicación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <PropertyForm 
            initialData={{
              title: "Propiedad de prueba",
              description: "Esta es una propiedad de prueba para verificar la funcionalidad de ubicación",
              property_type: "house",
              listing_type: "sale",
              price: 100000,
              images: []
            }}
            onSave={handleSave}
            isSaving={false}
          />
        </div>

        {/* Datos guardados */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Datos Guardados</CardTitle>
            </CardHeader>
            <CardContent>
              {savedData ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Información General:</h4>
                    <p className="text-sm text-muted-foreground">
                      Título: {savedData.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {savedData.property_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Precio: ${savedData.price}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Ubicación:</h4>
                    <p className="text-sm text-muted-foreground">
                      Dirección: {savedData.address || 'No especificada'}
                    </p>
                    {savedData.location && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Coordenadas: {savedData.location.latitude?.toFixed(6)}, {savedData.location.longitude?.toFixed(6)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Método: Manual/Automático (no se guarda en BD)
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium">Datos completos (JSON):</h4>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                      {JSON.stringify(savedData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Completa el formulario para ver los datos guardados
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}