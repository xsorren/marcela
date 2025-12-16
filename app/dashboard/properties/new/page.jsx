"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { DashboardHeader } from "@/components/dashboard-header"
import { PropertyForm } from "@/components/property-form"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createProperty, selectPropertyIsLoading, selectPropertyError } from "@/lib/redux/slices/propertySlice"
import toast from 'react-hot-toast'

export default function NewPropertyPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)
  const [isSaving, setIsSaving] = useState(false)
  
  const handleGoBack = () => {
    router.push("/dashboard/properties")
  }
  
  const handleSaveProperty = async (formData) => {
    try {
      setIsSaving(true)
      const saveToastId = toast.loading("Creando propiedad...")
      
      // Asegurar que los datos tengan el formato correcto
      const propertyDataToCreate = {
        ...formData,
        // Si se proveen imágenes, asegurar que estén en el formato correcto
        images: formData.images || []
      }
      
      const result = await dispatch(createProperty(propertyDataToCreate))
      
      if (createProperty.fulfilled.match(result)) {
        toast.success("Propiedad creada correctamente", { id: saveToastId })
        // Redirigir a la página de propiedades
        router.push(`/dashboard/properties`)
      } else {
        toast.error(`Error: ${result.payload || "No se pudo crear la propiedad"}`, { id: saveToastId })
      }
    } catch (error) {
      toast.error(`Error inesperado: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <DashboardHeader title="Nueva Propiedad" description="Crea una nueva propiedad con todos sus detalles e imágenes" />
        </div>
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="w-full sm:w-auto btn-outline-minimal font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Volver
        </Button>
      </div>
      
      <Card className="bg-card border-border overflow-hidden shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
        <CardContent className="p-6">
          <PropertyForm 
            initialData={{ images: [] }} 
            onSave={handleSaveProperty} 
            isSaving={isSaving} 
            showDropzone={true}
          />
        </CardContent>
      </Card>
      
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

