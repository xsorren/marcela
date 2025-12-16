"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { Plus, Search, Filter, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import { 
  fetchAllProperties, 
  selectAllProperties, 
  selectPropertyIsLoading,
  selectPropertyError,
  setFilters,
  selectPropertyFilters
} from "@/lib/redux/slices/propertySlice"
import { PropertyList } from "@/components/property-list"
import { useSupabase } from "@/utils/supabase/provider"
import toast from 'react-hot-toast';

export default function PropertiesPage() {
  const dispatch = useDispatch()
  const { supabase } = useSupabase() // Get Supabase client from context
  const properties = useSelector(selectAllProperties)
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)
  const filters = useSelector(selectPropertyFilters)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProperties, setFilteredProperties] = useState([])
  const [debugInfo, setDebugInfo] = useState(null)

  // Verify Supabase connection on mount
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Simple ping to verify Supabase connection
        const { data, error } = await supabase.from('properties').select('count').limit(1)
        if (error) {
          setDebugInfo(`Supabase connection error: ${error.message}`)
          console.error("Supabase connection error:", error)
        } else {
          console.log("Supabase connection successful, count data:", data)
          
          // TEST: Direct query to check if properties exist
          const { data: testData, error: testError } = await supabase
            .from('properties')
            .select('*')
            .limit(5)
            
          if (testError) {
            console.error("Test query error:", testError)
          } else {
            console.log("Test query results:", testData)
            if (testData.length === 0) {
              setDebugInfo("No properties found in database. The table might be empty.")
            }
          }
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err)
        setDebugInfo(`Error checking Supabase: ${err.message}`)
      }
    }

    checkSupabase()
  }, [supabase])

  // Make sure we fetch properties when component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reset any previous error state
        setDebugInfo(null)
        
        // Crear una copia de filtros
        const queryFilters = { ...filters }
        
        
        // Log current filters before fetching
        console.log("Fetching properties with filters:", queryFilters)
        console.log("Default property filters:", JSON.stringify(queryFilters, null, 2))
        
        // Dispatch the fetch action with the adjusted filters
        console.log("About to dispatch fetchAllProperties with filters:", queryFilters)
        const resultAction = await dispatch(fetchAllProperties(queryFilters))
        console.log("fetchAllProperties action result:", resultAction)
        
        // Check for errors in the resultAction
        if (fetchAllProperties.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload || resultAction.error?.message
          console.error("Redux action rejected:", errorMessage)
          setDebugInfo(`Error fetching properties: ${errorMessage}`)
        } else {
          console.log("Properties fetched successfully:", resultAction.payload?.length || 0)
          if (resultAction.payload?.length === 0) {
            console.log("No properties found with current filters:", queryFilters)
          }
        }
      } catch (error) {
        console.error("Exception during fetchAllProperties:", error)
        setDebugInfo(`Error fetching properties: ${error.message}`)
      }
    }
    
    // Cargar propiedades cuando cambien los filtros
    fetchData()
  }, [dispatch, filters])

  // Update filtered properties when properties or search query changes
  useEffect(() => {
    if (properties) {
      console.log("Properties received from Redux:", properties);
      console.log("Properties type:", typeof properties);
      console.log("Is properties an array?", Array.isArray(properties));
      
      if (searchQuery.trim() === "") {
        setFilteredProperties(properties)
      } else {
        const query = searchQuery.toLowerCase()
        setFilteredProperties(
          properties.filter(
            prop => 
              (prop.title?.toLowerCase() || "").includes(query) || 
              (prop.address?.toLowerCase() || "").includes(query) ||
              (prop.description?.toLowerCase() || "").includes(query)
          )
        )
      }
      
      // Log for debugging
      console.log("Properties loaded:", properties.length);
      console.log("Filtered properties:", filteredProperties.length);
    } else {
      setFilteredProperties([])
      console.log("No properties in state")
    }
  }, [properties, searchQuery])

  const handleTypeChange = (type) => {
    dispatch(setFilters({ ...filters, property_type: type === "all" ? null : type }))
  }

  const handleListingTypeChange = (listing_type) => {
    dispatch(setFilters({ ...filters, listing_type: listing_type === "all" ? null : listing_type }))
  }

  // Handle refresh button click
  const handleRefresh = () => {
    // Create appropriate filters for refresh
    const refreshFilters = { ...filters }
    
    dispatch(fetchAllProperties(refreshFilters)).then((resultAction) => {
      if (fetchAllProperties.fulfilled.match(resultAction)) {
        toast.success('Propiedades actualizadas correctamente');
      } else {
        toast.error('Error al actualizar propiedades');
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DashboardHeader 
          title="Propiedades" 
          description="Gestiona tus propiedades inmobiliarias"
          className="p-0 m-0"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="h-12 w-full sm:w-40 md:w-48 btn-outline-minimal font-medium shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-brand-brown-500" />
              ) : (
                <svg className="h-4 w-4 mr-2 text-brand-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <span>Actualizar</span>
            </div>
          </Button>
          <Link href="/dashboard/properties/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-48 md:w-56 h-12 btn-primary-minimal font-medium shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
              <div className="flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                <span>Nueva Propiedad</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative md:col-span-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar propiedades..."
            className="pl-8 h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select defaultValue={filters.property_type || "all"} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20 bg-card text-foreground">
            <SelectValue placeholder="Tipo de propiedad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="bg-card text-foreground">Todos los tipos</SelectItem>
            <SelectItem value="house" className="bg-card text-foreground">Casa</SelectItem>
            <SelectItem value="apartment" className="bg-card text-foreground">Departamento</SelectItem>
            <SelectItem value="land" className="bg-card text-foreground">Terreno</SelectItem>
            <SelectItem value="office" className="bg-card text-foreground">Oficina</SelectItem>
            <SelectItem value="commercial" className="bg-card text-foreground">Local Comercial</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={filters.listing_type || "all"} onValueChange={handleListingTypeChange}>
          <SelectTrigger className="h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20 bg-card text-foreground">
            <SelectValue placeholder="Operación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="bg-card text-foreground">Todas</SelectItem>
            <SelectItem value="sale" className="bg-card text-foreground">Venta</SelectItem>
            <SelectItem value="rent" className="bg-card text-foreground">Alquiler</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-md text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Error al cargar propiedades: {error}
        </div>
      )}

      {debugInfo && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-md text-amber-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {debugInfo}
        </div>
      )}

      {!isLoading && (!properties || properties.length === 0) && !error && !debugInfo && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/40 rounded-md text-blue-400 text-center">
          No se encontraron propiedades con los filtros actuales. Intenta cambiar los filtros o agregar una nueva propiedad.
        </div>
      )}

      <PropertyList 
        properties={filteredProperties} 
        isLoading={isLoading} 
        showStatus={false}
        showFilters={true}
      />
    </div>
  )
} 