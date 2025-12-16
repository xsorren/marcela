import Image from "next/image"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { getPropertyCoverImage, handleImageError } from "@/utils/image-helpers"

// Función utilitaria para formatear URLs de imágenes de Supabase
export const getPublicImageUrl = (imageUrl) => {
  if (!imageUrl) return "/images/placeholder-property.jpg";
  
  // Si ya es una URL completa (contiene http o https), retornarla
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si la URL ya es pública o firmada, retornarla con la URL base
  if (imageUrl.includes('/storage/v1/object/public/') || 
      imageUrl.includes('/storage/v1/object/sign/')) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL + imageUrl;
  }
  
  // Extraer la ruta relativa si la URL contiene la ruta del bucket
  let relativePath = imageUrl;
  if (imageUrl.includes('property-images/')) {
    relativePath = 'property-images/' + imageUrl.split('property-images/')[1];
  }
  
  // Construir la URL pública correcta
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${relativePath}`;
};

export default function PropertyCard({ property, priority = false, inFeatured = false, minimal = false }) {
  const router = useRouter()

  // Función para manejar errores de carga de imágenes
  const onImageError = useCallback((e) => {
    handleImageError(e);
  }, []);

  // Validar que property sea un objeto válido
  if (!property || typeof property !== 'object') {
    console.warn('PropertyCard: Se recibió una propiedad inválida');
    return (
      <div className={`relative flex flex-col overflow-hidden min-h-[360px] md:min-h-[420px] max-w-full w-full sm:w-[329px] ${minimal ? 'bg-white border-2 border-brand-brown-500' : 'bg-card border-2 border-brand-brown-500'}`}>
        <div className="flex items-center justify-center h-full">
          <p className={minimal ? "text-neutral-600" : "text-foreground"}>Datos no disponibles</p>
        </div>
      </div>
    );
  }

  const { 
    id, // Este será el ID original para navegación
    displayId, // ID para mostrar (puede contener -repeat- para propiedades duplicadas)
    property_images,
    title = "Propiedad",
    price = 0, 
    address = "No disponible", 
    area = 0, 
    land_area = 0,
    semi_covered_area = 0, 
    rooms = 0, 
    bathrooms = 0, 
    user_id,
    is_featured = false,
    listing_type = "sale", // Por defecto es venta
    isRepeat = false // Indica si es una propiedad repetida
  } = property;

  // Obtener URL de la imagen de portada
  const coverImage = getPropertyCoverImage(property);

  // Formatear el precio con separadores de miles
  const formattedPrice = typeof price === 'number' 
    ? price === 1
      ? "Consultar precio"
      : `${price.toLocaleString('es-AR').replace(/,/g, '.')} USD` 
    : price.toString();

  // Función para navegar al detalle de la propiedad
  const handleCardClick = () => {
    // Asegurarse de que estamos usando el ID original para la navegación
    const propertyId = id.toString().includes('-repeat-') 
      ? id.toString().split('-repeat-')[0] // Extraer el ID original si contiene -repeat-
      : id;
    
    router.push(`/property/${propertyId}`);
  };

  // Altura ajustada para que la tarjeta se vea completa sin footer
  const minHeight = inFeatured ? "min-h-[320px] md:min-h-[380px]" : "min-h-[360px] md:min-h-[420px]";

  // Estilos condicionales para versión minimalista
  if (minimal) {
    return (
      <div
        className="group relative flex flex-col overflow-hidden min-h-[320px] max-w-full w-full bg-white border-2 border-brand-brown-500 cursor-pointer transition-all duration-300 hover:border-brand-brown-600 rounded-xl"
        onClick={handleCardClick}
      >
        {/* Property Image - Minimal version */}
        <div className="relative w-full h-[200px] overflow-hidden">
          <Image
            src={coverImage}
            alt={`Propiedad en ${address}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 329px"
            priority={priority}
            onError={onImageError}
          />
          
          {/* Listing Type Badge - Minimal */}
          <div className={`absolute top-3 left-3 ${listing_type === "sale" ? "bg-brand-brown-500" : "bg-brand-green-500"} text-foreground text-xs font-medium rounded-lg px-3 py-1`}>
            {listing_type === "sale" ? "Venta" : "Alquiler"}
          </div>

          {/* Featured Badge - Minimal */}
          {is_featured && (
            <div className="absolute top-3 right-3 bg-brand-brown-500 text-white text-xs font-medium rounded-lg px-3 py-1">
              Destacada
            </div>
          )}
        </div>

        {/* Property Information - Minimal */}
        <div className="p-5 flex-grow">
          {/* Price */}
          <h3 className="text-2xl font-bold text-brand-brown-600 mb-2">
            {formattedPrice}
          </h3>

          {/* Location */}
          <div className="flex items-center mb-3 text-neutral-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-brand-brown-500 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-sm font-medium truncate">
              {address}
            </span>
          </div>

          {/* Property Title */}
          {title && (
            <p className="text-neutral-800 text-base font-medium mb-3 line-clamp-2">
              {title}
            </p>
          )}

          {/* Property Details - Minimal */}
          <div className="flex items-center text-sm text-neutral-500 space-x-4 mb-4">
            {area > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                {area}m²
              </span>
            )}
            {rooms > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {rooms} amb
              </span>
            )}
            {bathrooms > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8H18a1 1 0 011 1v2a1 1 0 01-1 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" clipRule="evenodd" />
                </svg>
                {bathrooms} baños
              </span>
            )}
          </div>

          {/* Action Button - Minimal */}
          <button className="w-full bg-brand-brown-500 hover:bg-brand-brown-600 text-foreground py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
            Ver detalles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden ${minHeight} max-w-full w-full sm:w-[329px] bg-white border-2 border-brand-brown-500 cursor-pointer transition-all duration-300 ${is_featured ? "bg-brand-brown-50" : ""}`}
      style={{ borderRadius: '16px' }}
      onClick={handleCardClick}
    >
      {/* Property Image - Clean and modern */}
      <div className={`relative w-full ${inFeatured ? "h-[180px]" : "h-[220px]"} md:h-[240px] overflow-hidden`}>
        <div className="absolute inset-0" style={{ borderRadius: '16px 16px 0 0' }}>
          <Image
            src={coverImage}
            alt={`Propiedad en ${address}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 329px"
            priority={priority}
            onError={onImageError}
          />
        </div>
        
        {/* Listing Type Badge - Clean design */}
        <div className={`absolute top-3 md:top-4 left-3 md:left-4 ${listing_type === "sale" ? "bg-brand-brown-500" : "bg-brand-green-500"} text-white text-[10px] md:text-xs uppercase font-semibold rounded-lg px-3 py-1.5`}>
          {listing_type === "sale" ? "Venta" : "Alquiler"}
        </div>

        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-brand-brown-500 text-white text-[10px] md:text-xs uppercase font-bold rounded-lg px-3 py-1.5">
            ⭐ Destacada
          </div>
        )}
      </div>

      {/* Property Information - Enhanced with gradient background */}
      <div className="p-4 md:p-5 flex-grow bg-white">
        {/* Price - Prominent and clean */}
        <h3 className={`${!inFeatured ? "text-[20px] sm:text-2xl md:text-3xl" : "text-2xl md:text-3xl"} font-bold text-brand-brown-600 mb-2 md:mb-3 group-hover:text-brand-brown-700 transition-colors duration-300`}>
          {formattedPrice}
        </h3>

        {/* Location - Clean icon and text */}
        <div className="flex items-center mb-3 md:mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 text-brand-brown-500 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className={`ml-2 text-neutral-600 ${!inFeatured ? "text-[16px] sm:text-sm md:text-base" : "text-sm md:text-base"} font-medium truncate`}>
            {address}
          </span>
        </div>

        {/* Property Title */}
        {title && (
          <p className={`text-neutral-800 ${!inFeatured ? "text-[18px] sm:text-base" : "text-base"} font-semibold mb-3 line-clamp-2`}>
            {title}
          </p>
        )}

        {/* Property Details - Clean grid layout */}
        <div className={`grid grid-cols-2 gap-x-3 gap-y-2 md:flex md:flex-wrap md:gap-4 text-neutral-600 ${!inFeatured ? "text-[14px] sm:text-xs md:text-sm" : "text-xs md:text-sm"} font-medium`}>
          {area > 0 && (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-brand-brown-500 rounded-full mr-2"></span>
              {area} m² cubiertos
            </div>
          )}
          {semi_covered_area > 0 && (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-brand-brown-500 rounded-full mr-2"></span>
              {semi_covered_area} m² semi-cub.
            </div>
          )}
          {land_area > 0 && (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-brand-brown-500 rounded-full mr-2"></span>
              {land_area} m² terreno
            </div>
          )}
          {rooms > 0 && (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-brand-brown-500 rounded-full mr-2"></span>
              {rooms} ambientes
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center">
              <span className="w-2 h-2 bg-brand-brown-500 rounded-full mr-2"></span>
              {bathrooms} baños
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

