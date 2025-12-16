"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/utils/supabase/provider"
import { PropertyForm } from "@/components/property-form"
import { PropertyImages } from "@/components/property-images"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Home, Plus } from "lucide-react"

export default function CrearPropiedad() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [property, setProperty] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const handleCreateProperty = async (data) => {
    try {
      setSaving(true)
      
      const { data: property, error } = await supabase
        .from('properties')
        .insert([{ ...data, images: [] }])
        .select()
        .single()
      
      if (error) throw error
      
      setProperty(property)
      
      toast({
        title: "Propiedad creada",
        description: "La propiedad se ha creado correctamente. Ahora puedes añadir imágenes.",
        variant: "success",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la propiedad",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }
  
  const handleImageUpdate = async (imageUrls) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ images: imageUrls })
        .eq('id', property.id)
      
      if (error) throw error
      
      // Update local state
      setProperty(prev => ({ ...prev, images: imageUrls }))
    } catch (error) {
      console.error('Error updating property images:', error)
      toast({
        title: "Error",
        description: "No se pudieron actualizar las imágenes",
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="w-full min-h-screen bg-[#121212] text-white">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        {/* Breadcrumb navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center text-gray-400 hover:text-[#D4AF37]">
                <Home className="h-4 w-4 mr-1" />
                <span>Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-500" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/propiedades" className="text-gray-400 hover:text-[#D4AF37]">
                Propiedades
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-500" />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[#D4AF37] font-medium flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Nueva Propiedad
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B59628] bg-clip-text text-transparent">
            Crear Nueva Propiedad
          </h1>
          <p className="text-gray-400 mt-2">
            Completa el formulario con los detalles de la propiedad
          </p>
        </div>
        
        {saving && (
          <div className="w-full flex items-center justify-center py-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-lg font-medium text-white">Guardando propiedad...</p>
              <p className="text-sm text-gray-400">Esto puede tardar unos segundos</p>
            </div>
          </div>
        )}
        
        {!saving && !property && (
          <PropertyForm onSubmit={handleCreateProperty} isLoading={saving} />
        )}
        
        {property && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-[#1E1E1E] border border-[#333333]">
              <div>
                <h2 className="text-xl font-medium text-white">{property.title}</h2>
                <p className="text-gray-400 text-sm">{property.location}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(`/propiedades/${property.id}`)}
                  className="px-4 py-2 bg-[#1E1E1E] border border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-md font-medium transition-colors"
                >
                  Ver Propiedad
                </button>
                <button
                  onClick={() => router.push('/propiedades')}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B59628] hover:from-[#B59628] hover:to-[#94791F] text-black font-medium rounded-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Volver al Listado
                </button>
              </div>
            </div>
            
            <PropertyImages 
              propertyId={property.id} 
              initialImages={property.images} 
              onUpdate={handleImageUpdate}
              isSaving={saving}
            />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
} 