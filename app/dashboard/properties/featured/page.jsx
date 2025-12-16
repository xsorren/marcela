"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Star, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { 
  fetchAllProperties, 
  updateProperty,
  selectAllProperties, 
  selectPropertyIsLoading,
  selectFeaturedProperties,
  selectPropertyError 
} from "@/lib/redux/slices/propertySlice"
import { PropertyList } from "@/components/property-list"
import { useToast } from "@/hooks/use-toast"

export default function FeaturedPropertiesPage() {
  const dispatch = useDispatch()
  const allProperties = useSelector(selectAllProperties)
  const featuredProperties = useSelector(selectFeaturedProperties)
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchAllProperties())
  }, [dispatch])

  const handleToggleFeatured = async (property) => {
    try {
      await dispatch(updateProperty({
        id: property.id,
        propertyData: { ...property, is_featured: !property.is_featured }
      })).unwrap()

      toast({
        title: property.is_featured ? "Propiedad removida de destacadas" : "Propiedad marcada como destacada",
        description: `"${property.title}" ha sido ${property.is_featured ? "removida de destacadas" : "marcada como destacada"} correctamente.`,
        variant: property.is_featured ? "default" : "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado destacado de la propiedad.",
        variant: "destructive"
      })
    }
  }

  // Filtrar todas las propiedades para mostrar
  const availableProperties = allProperties

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Propiedades Destacadas" 
        description="Gestiona qué propiedades aparecen como destacadas en el sitio"
        icon={<Star className="h-6 w-6 text-brand-brown-500" />}
      />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-md text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Error al cargar propiedades: {error}
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-brown-500 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2" /> 
            Propiedades Destacadas ({featuredProperties.length})
          </h2>
          <PropertyList 
            properties={featuredProperties} 
            isLoading={isLoading} 
            showStatus={false}
            onFeaturedToggle={handleToggleFeatured}
            emptyMessage="No hay propiedades destacadas. Marca algunas propiedades como destacadas para que aparezcan aquí."
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Todas las Propiedades ({availableProperties.length})
          </h2>
          <PropertyList 
            properties={availableProperties.filter(p => !p.is_featured)} 
            isLoading={isLoading} 
            showStatus={false}
            onFeaturedToggle={handleToggleFeatured}
          />
        </div>
      </div>
    </div>
  )
} 