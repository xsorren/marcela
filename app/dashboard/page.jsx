"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  Building, 
  CheckCircle, 
  Clock, 
  Plus,
  TrendingUp,
  RefreshCw
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { 
  fetchAllProperties, 
  selectAllProperties, 
  selectPropertyIsLoading 
} from "@/lib/redux/slices/propertySlice"
import StatsCard from "@/components/dashboard/stats-card"
import ActionsCard from "@/components/dashboard/actions-card"
import SystemStatusCard from "@/components/dashboard/system-status-card"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const dispatch = useDispatch()
  const properties = useSelector(selectAllProperties)
  const isLoading = useSelector(selectPropertyIsLoading)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Function to load ALL properties (including pending ones)
  const loadAllProperties = (forceToast = false) => {
    console.log("Loading ALL properties including pending ones...", forceToast ? "(forzar toast)" : "")
    
    // Solo mostrar toast si se solicita explícitamente (botón de actualizar)
    const toastId = forceToast ? toast.loading("Actualizando datos...") : null;
    
    dispatch(fetchAllProperties())
      .unwrap()
      .then((data) => {
        console.log(`Cargadas ${data.length} propiedades en total`);
        setLastUpdated(new Date())
        
        // Mostrar toast de éxito solo si se mostró el toast de carga
        if (toastId) {
          toast.success(`Datos actualizados correctamente`, { id: toastId });
        }
      })
      .catch(error => {
        console.error("Error fetching properties:", error)
        
        // Mostrar toast de error solo si se mostró el toast de carga
        if (toastId) {
          toast.error("Error al actualizar datos", { id: toastId })
        }
      })
  }

  // Load properties on component mount
  useEffect(() => {
    loadAllProperties()
  }, [])

  // Calcular estadísticas
  const totalProperties = properties.length
  const featuredProperties = properties.filter(p => p.is_featured).length
  const forSale = properties.filter(p => p.listing_type === "sale").length
  const forRent = properties.filter(p => p.listing_type === "rent").length

  // Configurar acciones rápidas
  const quickActions = [
    {
      label: "Agregar Nueva Propiedad",
      href: "/dashboard/properties/new",
      icon: <Plus className="h-4 w-4" />,
      primary: true
    },
    {
      label: "Ver Todas las Propiedades",
      href: "/dashboard/properties",
      primary: false
    },
    {
      label: "Gestionar Destacadas",
      href: "/dashboard/destacadas",
      primary: false
    }
  ]

  return (
    <div className="space-y-8 container mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <DashboardHeader title="Dashboard" description="Vista general del sistema inmobiliario" />
        <Button
          onClick={() => loadAllProperties(true)}
          variant="outline"
          className="btn-outline-minimal font-medium shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <Clock className="h-4 w-4 animate-spin mr-2 text-brand-brown-500" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2 text-brand-green-500" />
          )}
          <span>Actualizar</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Propiedades"
          value={totalProperties}
          subtitle={`Venta: ${forSale} | Alquiler: ${forRent}`}
          icon={<Building className="text-brand-brown-500" />}
          color="text-brand-brown-500"
        />
        <StatsCard
          title="Propiedades Destacadas"
          value={featuredProperties}
          subtitle={featuredProperties > 0 ? `${Math.round((featuredProperties / totalProperties) * 100)}% del total` : 'Sin propiedades destacadas'}
          icon={<TrendingUp className="text-brand-brown-500" />}
          color="text-brand-brown-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <ActionsCard
          title="Acciones Rápidas"
          description="Gestiona tu plataforma inmobiliaria desde aquí"
          actions={quickActions}
        />
        <SystemStatusCard lastUpdated={lastUpdated} />
      </div>
    </div>
  )
}

