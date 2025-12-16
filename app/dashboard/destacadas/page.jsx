"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Star, Search, Filter, Loader2, ImageIcon, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  fetchAllProperties, 
  updateProperty,
  togglePropertyFeatured,
  selectAllProperties, 
  selectPropertyIsLoading,
  selectFeaturedProperties,
  selectPropertyError 
} from "@/lib/redux/slices/propertySlice"
import toast from 'react-hot-toast'

export default function FeaturedPropertiesPage() {
  const dispatch = useDispatch()
  const allProperties = useSelector(selectAllProperties)
  const featuredProperties = useSelector(selectFeaturedProperties)
  const isLoading = useSelector(selectPropertyIsLoading)
  const error = useSelector(selectPropertyError)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [listingType, setListingType] = useState("all")
  
  const [filteredFeatured, setFilteredFeatured] = useState([])
  const [filteredNotFeatured, setFilteredNotFeatured] = useState([])

  // Add error state and enhance useEffect for fetching data
  const [fetchError, setFetchError] = useState(null);

  // Cargar propiedades al montar el componente con better error handling
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const resultAction = await dispatch(fetchAllProperties());
        
        if (fetchAllProperties.fulfilled.match(resultAction)) {
          const count = resultAction.payload?.length || 0;
          console.log(`Successfully loaded ${count} properties`);
          
          // Check if we have any featured properties
          const featuredCount = resultAction.payload?.filter(p => p.is_featured)?.length || 0;
          console.log(`Found ${featuredCount} featured properties`);
          
          setFetchError(null);
        } else {
          const errorMsg = resultAction.payload || "Error desconocido";
          console.error("Failed to fetch properties:", errorMsg);
          setFetchError(errorMsg);
        }
      } catch (error) {
        console.error("Exception while fetching properties:", error);
        setFetchError(error.message || "Error inesperado");
      }
    };
    
    loadProperties();
  }, [dispatch]);

  // Filtrar propiedades cuando cambien los filtros o términos de búsqueda
  useEffect(() => {
    const applyFilters = (properties) => {
      return properties.filter(property => {
        // Filtro de búsqueda
        const matchesSearch = searchTerm === "" || 
          (property.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (property.address?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        
        // Filtro por tipo de propiedad
        const matchesPropertyType = propertyType === "all" || 
          property.property_type === propertyType;
        
        // Filtro por tipo de operación
        const matchesListingType = listingType === "all" || 
          property.listing_type === listingType;
        
        return matchesSearch && matchesPropertyType && matchesListingType;
      });
    };
    
    // Aplicar filtros a propiedades destacadas
    setFilteredFeatured(applyFilters(featuredProperties));
    
    // Aplicar filtros a propiedades no destacadas
    const nonFeatured = allProperties.filter(p => !p.is_featured);
    setFilteredNotFeatured(applyFilters(nonFeatured));
    
  }, [allProperties, featuredProperties, searchTerm, propertyType, listingType]);

  const handleToggleFeatured = async (property) => {
    const newFeaturedStatus = !property.is_featured;
    const actionText = newFeaturedStatus ? "destacar" : "quitar de destacadas";
    
    // Show loading toast
    const toastId = toast.loading(`${newFeaturedStatus ? 'Destacando' : 'Quitando de destacadas'} la propiedad...`);
    
    try {
      // Use the dedicated toggle action with the current featured status
      const resultAction = await dispatch(togglePropertyFeatured({
        id: property.id,
        currentFeaturedStatus: property.is_featured
      }));
      
      // Check if the action was successful
      if (togglePropertyFeatured.fulfilled.match(resultAction)) {
        // Show success toast
        toast.success(
          `"${property.title || 'Propiedad'}" ha sido ${newFeaturedStatus ? "marcada como destacada" : "removida de destacadas"} correctamente.`, 
          { id: toastId }
        );
      } else {
        // Show error toast with detailed message
        const errorMessage = resultAction.payload || "Error desconocido";
        toast.error(`No se pudo ${actionText} la propiedad: ${errorMessage}`, { id: toastId });
      }
    } catch (error) {
      console.error("Error al actualizar propiedad destacada:", error);
      toast.error(`Error: ${error.message || "Error desconocido"}`, { id: toastId });
    }
  }

  // Obtener la imagen principal de una propiedad
  const getPropertyImage = (property) => {
    // Handle null or undefined property
    if (!property) return null;
    
    // Check for property_images array first (new format)
    if (property.property_images && Array.isArray(property.property_images) && property.property_images.length > 0) {
      console.log("Property has property_images array:", property.property_images);
      
      // Try to find cover image first
      const coverImage = property.property_images.find(img => img.is_cover);
      if (coverImage && coverImage.url) {
        return coverImage.url;
      }
      
      // If no cover image found, sort by order and take the first
      const sortedImages = [...property.property_images].sort((a, b) => (a.order || 0) - (b.order || 0));
      if (sortedImages[0] && sortedImages[0].url) {
        return sortedImages[0].url;
      }
    }
    
    // Fall back to legacy images array
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      console.log("Property has legacy images array:", property.images);
      return property.images[0];
    }
    
    // Last resort - check for single image property
    if (property.image) {
      return property.image;
    }
    
    console.log("No images found for property:", property.id);
    return null;
  }

  // Renderizar una tarjeta de propiedad
  const renderPropertyCard = (property) => (
    <div 
      key={property.id} 
      className="bg-card border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
      onClick={() => window.open(`/property/${property.id}/`, '_blank')}
    >
      <div className="relative aspect-video bg-muted">
        {getPropertyImage(property) ? (
          <img 
            src={getPropertyImage(property)} 
            alt={property.title || 'Propiedad sin título'} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error(`Failed to load image for property: ${property.id}`);
              e.target.src = "/images/placeholder-property.jpg";
              e.target.onerror = null;
            }} 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-12 w-12 text-brand-brown-500/30" />
          </div>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFeatured(property);
          }}
          className={`absolute top-3 right-3 p-3 rounded-full transition-all duration-200 
            ${property.is_featured ? 
              'bg-brand-brown-500 text-white hover:bg-brand-brown-500/80' : 
              'bg-background/80 text-foreground hover:bg-brand-brown-500/20 hover:text-brand-brown-500 border border-border'}`}
          aria-label={property.is_featured ? "Quitar de destacadas" : "Marcar como destacada"}
          title={property.is_featured ? "Quitar de destacadas" : "Marcar como destacada"}
        >
          <Star className={`h-5 w-5 ${property.is_featured ? 'fill-white' : ''}`} />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-bold text-white text-lg line-clamp-1">{property.title || 'Propiedad sin título'}</h3>
          <p className="text-gray-300 text-sm line-clamp-1">{property.address || 'Sin dirección'}</p>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-brand-brown-500 font-bold text-lg">${property.price ? property.price.toLocaleString('es') : '0'}</p>
        <Badge className={`
          ${property.listing_type === 'sale' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}
          px-2 py-1 text-xs font-medium
        `}>
          {property.listing_type === 'sale' ? 'Venta' : 'Alquiler'}
        </Badge>
      </div>
    </div>
  );

  // Add a refresh function to the component
  const handleRefreshProperties = () => {
    const toastId = toast.loading("Actualizando propiedades...");
    
    dispatch(fetchAllProperties())
      .then(resultAction => {
        if (fetchAllProperties.fulfilled.match(resultAction)) {
          const count = resultAction.payload?.length || 0;
          const featuredCount = resultAction.payload?.filter(p => p.is_featured)?.length || 0;
          toast.success(`Cargadas ${count} propiedades (${featuredCount} destacadas)`, { id: toastId });
        } else {
          toast.error(`Error al actualizar: ${resultAction.payload || "Error desconocido"}`, { id: toastId });
        }
      })
      .catch(error => {
        toast.error(`Error inesperado: ${error.message}`, { id: toastId });
      });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DashboardHeader 
          title="Propiedades Destacadas" 
          description="Gestiona qué propiedades aparecen como destacadas en el sitio"
          icon={<Star className="h-6 w-6 text-brand-brown-500" />}
          className="p-0 m-0"
        />
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefreshProperties}
            variant="outline" 
            className="btn-outline-minimal font-medium shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-brand-brown-500" />
                Actualizando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2 text-brand-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Actualizar
              </>
            )}
          </Button>
          <Badge variant="outline" className="bg-brand-brown-500/10 border-brand-brown-500 text-brand-brown-500 px-4 py-2 text-sm font-medium">
            <Star className="h-4 w-4 mr-2 fill-brand-brown-500" />
            {filteredFeatured.length} destacadas
          </Badge>
        </div>
      </div>

      {/* Display fetch error if exists */}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-foreground font-medium mb-1">Error al cargar propiedades</h3>
            <p className="text-red-600">{fetchError}</p>
          </div>
        </div>
      )}

      <Card className="bg-card border-border shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium text-foreground">Filtros de búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propiedades..."
                className="pl-8 h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select defaultValue={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20 bg-card text-foreground">
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Todos los tipos</SelectItem>
                <SelectItem value="house" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Casa</SelectItem>
                <SelectItem value="apartment" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Departamento</SelectItem>
                <SelectItem value="land" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Terreno</SelectItem>
                <SelectItem value="office" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Oficina</SelectItem>
                <SelectItem value="commercial" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Local Comercial</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue={listingType} onValueChange={setListingType}>
              <SelectTrigger className="h-12 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20 bg-card text-foreground">
                <SelectValue placeholder="Operación" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Todas</SelectItem>
                <SelectItem value="sale" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Venta</SelectItem>
                <SelectItem value="rent" className="bg-card text-foreground hover:bg-accent hover:text-accent-foreground">Alquiler</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-md text-red-400">
          Error al cargar propiedades: {error}
        </div>
      )}

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-brown-500 fill-brand-brown-500" />
              <CardTitle className="text-lg font-medium text-foreground">Propiedades Destacadas ({filteredFeatured.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-brand-brown-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Cargando propiedades destacadas...</p>
              </div>
            ) : filteredFeatured.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <Star className="h-12 w-12 text-brand-brown-500/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay propiedades destacadas</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || propertyType !== "all" || listingType !== "all" ? 
                    "No se encontraron propiedades destacadas con los filtros actuales." : 
                    "Marca propiedades como destacadas para que aparezcan en la página principal."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFeatured.map(property => renderPropertyCard(property))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-medium text-foreground">Propiedades Disponibles ({filteredNotFeatured.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-gray-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Cargando propiedades...</p>
              </div>
            ) : filteredNotFeatured.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay propiedades disponibles</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || propertyType !== "all" || listingType !== "all" ? 
                    "No se encontraron propiedades con los filtros actuales." : 
                    "Todas las propiedades aprobadas ya están marcadas como destacadas."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotFeatured.map(property => renderPropertyCard(property))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
