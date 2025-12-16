"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
// Importar solo los iconos necesarios individualmente para reducir el tamaño del chunk
import { MoreHorizontal, Search, Star, ChevronRight, Pencil, Trash, ChevronDown, Eye } from "lucide-react"
import Link from "next/link"
import { deleteProperty } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import toast from 'react-hot-toast'

export function PropertyList({ 
  properties = [], 
  isLoading = false, 
  showFilters = false,
  onFeaturedToggle,
  emptyMessage = "No se encontraron propiedades"
}) {
  console.log("PropertyList received properties:", properties);
  console.log("Properties is array?", Array.isArray(properties));
  console.log("Properties length:", properties?.length);

  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(5)
  const { toast: uiToast } = useToast()

  // Incrementar el número de propiedades visibles
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 5)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta propiedad?')) {
      const toastNotification = toast.loading('Eliminando propiedad...');
      try {
        const resultAction = await deleteProperty(id);
        
        if (resultAction.error) {
          toast.error(`Error: ${resultAction.error.message || 'No se pudo eliminar la propiedad'}`, { id: toastNotification });
        } else {
          toast.success('Propiedad eliminada correctamente', { id: toastNotification });
        }
      } catch (error) {
        console.error('Error al eliminar propiedad:', error);
        toast.error(`Error inesperado: ${error.message}`, { id: toastNotification });
      }
    }
  }


  const handleToggleFeatured = (property) => {
    if (onFeaturedToggle) {
      const newFeaturedStatus = !property.is_featured;
      const action = newFeaturedStatus ? 'destacar' : 'quitar destacado';
      
      const toastNotification = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} propiedad...`);
      
      try {
        const result = onFeaturedToggle(property);
        
        if (result instanceof Promise) {
          result.then(() => {
            toast.success(`Propiedad ${newFeaturedStatus ? 'destacada' : 'quitada de destacados'}`, { id: toastNotification });
          }).catch((error) => {
            toast.error(`Error al ${action} propiedad: ${error.message}`, { id: toastNotification });
          });
        } else {
          toast.success(`Propiedad ${newFeaturedStatus ? 'destacada' : 'quitada de destacados'}`, { id: toastNotification });
        }
      } catch (error) {
        console.error(`Error al ${action} propiedad:`, error);
        toast.error(`Error inesperado: ${error.message}`, { id: toastNotification });
      }
    }
  }

  const filteredProperties = Array.isArray(properties) 
    ? properties.filter((property) => {
        if (!property) return false;
        
        const matchesSearch =
          searchTerm === "" || 
          (property.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (property.address?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        
        return matchesSearch;
      })
    : [];
    
  // Propiedades visibles para móvil (limitadas con paginación)
  const visibleProperties = filteredProperties.slice(0, visibleCount);
  const hasMoreToLoad = visibleProperties.length < filteredProperties.length;

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Listado de Propiedades</CardTitle>
        <CardDescription>
          {Array.isArray(properties) && `Total: ${properties.length} propiedades`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar propiedades..."
                className="pl-8 border-border focus:border-brand-brown-500 focus:ring-brand-brown-500/20 text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            {/* Mobile view results count */}
            <div className="md:hidden mb-4 flex justify-between items-center">
              <p className="text-muted-foreground text-sm">
                {Array.isArray(filteredProperties) && filteredProperties.length > 0 ? 
                  `Mostrando ${Math.min(visibleCount, filteredProperties.length)} de ${filteredProperties.length} propiedades` : 
                  "No hay propiedades que coincidan con tu búsqueda"
                }
              </p>
              
              {filteredProperties.length > 0 && (
                <Badge className="bg-brand-brown-500 text-black font-medium">
                  {filteredProperties.length}
                </Badge>
              )}
            </div>
          
            {/* Mobile view - card layout */}
            <div className="md:hidden space-y-4">
              {!Array.isArray(filteredProperties) || filteredProperties.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                <>
                  {visibleProperties.map((property, index) => 
                    property ? (
                      <div 
                        key={property.id || `property-${index}`} 
                        className="bg-muted rounded-lg border border-border p-4 shadow-md transition-all hover:border-brand-brown-500/50 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                            <h3 className="font-medium text-foreground text-base truncate">{property.title || 'Sin título'}</h3>
                            <p className="text-sm text-muted-foreground truncate">{property.address || 'Sin dirección'}</p>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`w-8 h-8 rounded-full ${property.is_featured ? "text-brand-brown-500 bg-brand-brown-500/10" : "text-muted-foreground"}`}
                              onClick={() => handleToggleFeatured(property)}
                            >
                              <Star className={`h-4 w-4 ${property.is_featured ? "fill-brand-brown-500" : ""}`} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm bg-accent p-3 rounded-md">
                          <div>
                            <span className="block text-muted-foreground text-xs mb-1">Precio</span>
                            <span className="font-medium text-foreground text-base">{formatCurrency(property.price || 0)}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-xs mb-1">Tipo</span>
                            <span className="font-medium text-foreground capitalize">{property.property_type || 'No especificado'}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-xs mb-1">Operación</span>
                            <span className="font-medium text-foreground capitalize">{property.listing_type === 'sale' ? 'Venta' : property.listing_type === 'rent' ? 'Alquiler' : 'No especificado'}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-xs mb-1">Superficie</span>
                            <span className="font-medium text-foreground">{property.area ? `${property.area} m²` : 'No especificado'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-border flex gap-2">
                          <Link 
                            href={`/property/${property.id}`}
                            className="flex-1 inline-flex items-center justify-center text-foreground bg-card hover:bg-card/80 font-medium transition-colors rounded-md px-3 py-2 text-sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Link>
                          <Link 
                            href={`/dashboard/properties/${property.id}`} 
                            className="flex-1 inline-flex items-center justify-center text-foreground bg-card hover:bg-brand-brown-500 hover:text-black font-medium transition-colors rounded-md px-3 py-2 text-sm"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-none text-destructive hover:text-foreground hover:bg-red-500 rounded-md border border-red-500/30 h-9 px-3"
                            onClick={() => handleDelete(property.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : null
                  )}
                  
                  {/* Load more button */}
                  {hasMoreToLoad && (
                    <div className="pt-2 pb-4">
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        className="w-full h-12 border-brand-brown-500 text-brand-brown-500 bg-accent hover:bg-brand-brown-500/10"
                      >
                        Cargar más propiedades
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desktop view - table layout */}
            <div className="hidden md:block rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted">
                  <TableHead className="text-muted-foreground">Título</TableHead>
                  <TableHead className="text-muted-foreground">Dirección</TableHead>
                  <TableHead className="text-muted-foreground">Precio</TableHead>
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Destacada</TableHead>
                  <TableHead className="text-muted-foreground text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(filteredProperties) || filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property, index) => (
                    property ? (
                      <TableRow key={property.id || `property-${index}`} className="bg-card hover:bg-muted transition-all duration-200">
                        <TableCell className="font-medium text-foreground">{property.title || 'Sin título'}</TableCell>
                        <TableCell className="text-foreground">{property.address || 'Sin dirección'}</TableCell>
                        <TableCell className="text-brand-brown-500 font-semibold">{formatCurrency(property.price || 0)}</TableCell>
                        <TableCell className="text-muted-foreground">{property.property_type || 'No especificado'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={property.is_featured ? "text-brand-brown-500" : "text-muted-foreground"}
                            onClick={() => handleToggleFeatured(property)}
                          >
                            <Star className={`h-4 w-4 ${property.is_featured ? "fill-brand-brown-500" : ""}`} />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/property/${property.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 btn-outline-minimal"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Ver
                              </Button>
                            </Link>
                            <Link href={`/dashboard/properties/${property.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 btn-outline-minimal text-brand-brown-500"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Editar
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 btn-outline-minimal text-destructive"
                              onClick={() => handleDelete(property.id)}
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

