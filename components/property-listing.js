"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "./property-card"
import { useDispatch, useSelector } from "react-redux"
import { 
  fetchAllProperties, 
  selectPropertyIsLoading,
  selectAllProperties,
  setFilters,
  selectPropertyFilters
} from "@/lib/redux/slices/propertySlice"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useResponsiveGrid } from './useResponsiveGrid';
import Pagination from './Pagination';
import PropertyCardSkeleton from './PropertyCardSkeleton';

/**
 * Componente que muestra un listado de propiedades con paginación
 * @param {Object} props - Propiedades del componente
 * @param {string} props.initialListingType - Tipo de listado inicial ('sale' o 'rent')
 */
export default function PropertyListing({ initialListingType }) {
  const dispatch = useDispatch()
  const filters = useSelector(selectPropertyFilters)
  const allProperties = useSelector(selectAllProperties)
  const isLoading = useSelector(selectPropertyIsLoading)
  
  // Estados locales
  const [currentPage, setCurrentPage] = useState(1)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [propertiesPerPage, setPropertiesPerPage] = useState(6)
  const [initialLoad, setInitialLoad] = useState(true)
  
  // Establecer filtro inicial para listing_type al montar el componente
  useEffect(() => {
    if (initialLoad && initialListingType) {
      console.log("PropertyListing: Setting initial listing_type to:", initialListingType);
      dispatch(setFilters({ 
        listing_type: initialListingType,
      }));
      setInitialLoad(false);
    }
  }, [initialListingType, dispatch, initialLoad]);
  
  // Cargar propiedades cuando cambian los filtros
  useEffect(() => {
    dispatch(fetchAllProperties(filters))
    setCurrentPage(1) // Resetear a la primera página cuando cambian los filtros
  }, [dispatch, filters])
  
  // Actualizar el número de propiedades por página basado en el ancho de pantalla
  const updatePropertiesPerPage = () => {
    if (window.innerWidth < 640) {
      setPropertiesPerPage(3) 
    } else if (window.innerWidth < 1024) {
      setPropertiesPerPage(4)
    } else {
      setPropertiesPerPage(6)
    }
  }

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      updatePropertiesPerPage()
    }

    // Inicializar
    handleResize()

    // Agregar event listener para resize
    window.addEventListener('resize', handleResize)
    
    // Limpiar event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calcular índices para paginación
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = allProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = allProperties.length > 0 ? Math.ceil(allProperties.length / propertiesPerPage) : 1

  // Cambiar página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({
      top: document.getElementById('propertyListing').offsetTop - 120,
      behavior: 'smooth'
    })
  }

  // Usar el hook para grid responsivo
  useResponsiveGrid(currentProperties, windowWidth);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  // Renderizar skeletons durante la carga
  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center pb-6 text-neutral-600">
            <p className="text-lg font-medium">Cargando propiedades...</p>
          </div>
          <div className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: propertiesPerPage }).map((_, index) => (
              <div key={index} className="property-card-wrapper mb-8">
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Renderizar mensaje si no hay propiedades
  if (!isLoading && allProperties.length === 0) {
    return (
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-brand-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-brand-brown-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">No hay propiedades disponibles</h3>
              <p className="text-neutral-600">No se encontraron propiedades que coincidan con los filtros actuales. Intenta ajustar tus criterios de búsqueda.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizado principal
  return (
    <div id="propertyListing" className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center pb-8">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-brand-brown-50 border border-brand-brown-200 rounded-full mb-4">
            <span className="text-sm font-medium text-brand-brown-600">
              {allProperties.length} propiedad{allProperties.length !== 1 ? 'es' : ''} encontrada{allProperties.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <motion.div 
          className="property-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {currentProperties.map((property, index) => (
            <motion.div 
              key={property.id} 
              className="property-card-wrapper mb-8 md:mb-0"
              variants={itemVariants}
            >
              <PropertyCard 
                property={property} 
                priority={index < 3} 
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Paginación extraída a componente */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
      </div>
    </div>
  )
}

