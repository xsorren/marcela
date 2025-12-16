"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import toast from 'react-hot-toast'
import { DashboardHeader } from "@/components/dashboard-header"
import { PropertyForm } from "@/components/property-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
// Importar las nuevas funciones de Redux y Supabase
import {
  fetchProperty,
  updateProperty,
  clearError,
  clearCurrentProperty,
  selectCurrentProperty,
  selectPropertyIsLoading,
  selectPropertyError
} from "@/lib/redux/slices/propertySlice"

export default function EditProperty() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()


  // Usar selectores de Redux en lugar de estado local
  const property = useSelector(selectCurrentProperty)
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch property data usando Redux
  useEffect(() => {
    if (id) {
      // Limpiar estado anterior
      dispatch(clearError())
      dispatch(clearCurrentProperty())

      // Cargar propiedad usando Redux thunk
      dispatch(fetchProperty(id))
    }

    // Cleanup al desmontar
    return () => {
      dispatch(clearCurrentProperty())
      dispatch(clearError())
    }
  }, [id, dispatch])

  // Save property changes usando Redux
  const handleSave = async (formData) => {
    if (!id) {
      toast.error("Error: ID de propiedad no válido")
      return
    }

    try {
      setIsSaving(true)
      const saveToastId = toast.loading("Actualizando propiedad...")

      console.log("EditProperty - Iniciando actualización:", { id, formData })

      // Usar la función updateProperty de Redux que maneja todo automáticamente
      const result = await dispatch(updateProperty({
        id,
        propertyData: formData
      }))

      console.log("EditProperty - Resultado de dispatch:", result)

      if (updateProperty.fulfilled.match(result)) {
        console.log("EditProperty - Actualización exitosa:", result.payload)
        toast.success("Propiedad actualizada correctamente", { id: saveToastId })

        // Redirigir después de un breve delay
        setTimeout(() => {
          router.push('/dashboard/properties')
        }, 1500)
      } else {
        console.error("EditProperty - Error en actualización:", result)
        const errorMessage = result.payload || result.error?.message || "No se pudo actualizar la propiedad"
        toast.error(`Error: ${errorMessage}`, { id: saveToastId })
      }
    } catch (error) {
      console.error("EditProperty - Error inesperado:", error)
      toast.error(`Error inesperado: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DashboardHeader
          title="Editar Propiedad"
          description="Actualiza la información e imágenes de la propiedad"
          className="p-0 m-0"
        />
        <Link href="/dashboard/properties">
          <Button
            variant="outline"
            className="w-full sm:w-auto btn-outline-minimal font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card className="bg-card border-border">
          <CardContent className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-brown-500" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-card border-border">
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-medium text-foreground">Error al cargar la propiedad</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button
                variant="default"
                onClick={() => router.push('/dashboard/properties')}
                className="btn-primary-minimal"
              >
                Volver a propiedades
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : property ? (
        <Card className="bg-card border-border overflow-hidden shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
          <CardContent className="p-6">
            <PropertyForm
              initialData={property}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium text-foreground">Propiedad no encontrada</h3>
              <p className="text-sm text-muted-foreground mt-1">
                La propiedad que intentas editar no existe o no tienes permisos para acceder a ella
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estilos personalizados para los checkboxes */}
      <style jsx global>{`
        .checkbox-minimalist {
          border-color: #8A2F4C !important;
        }
        .checkbox-minimalist:focus {
          box-shadow: 0 0 0 2px rgba(138, 47, 76, 0.3) !important;
        }
        .checkbox-minimalist[data-state="checked"] {
          background-color: #8A2F4C !important;
          border-color: #8A2F4C !important;
        }
      `}</style>
    </div>
  )
}

