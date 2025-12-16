"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import NextImage from "next/image"
import { ChevronLeft, ChevronRight, Star, Share2, ArrowLeft, DollarSign, MapPin, Calendar, Home, User, Phone, ExternalLink, Heart, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { fetchProperty, selectCurrentProperty, selectPropertyIsLoading } from "@/lib/redux/slices/propertySlice"
import { useRouter, useParams } from "next/navigation"
import MapboxMap from "@/components/MapboxMap"
import { getPropertyCoverImage, getPublicImageUrl, handleImageError } from "@/utils/image-helpers"
import { use } from "react"
import { parseEWKBPoint } from "@/utils/geo"

export default function PropertyDetail() {
  // All hooks must be called at the top level and in the same order on every render
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const property = useSelector(selectCurrentProperty);
  const isLoading = useSelector(selectPropertyIsLoading);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState(null); // 'next' o 'prev'
  const [nextImagePreloaded, setNextImagePreloaded] = useState(false);
  const [prevImagePreloaded, setPrevImagePreloaded] = useState(false);
  const [shareStatus, setShareStatus] = useState(""); // Para mostrar notificación de compartir
  const sliderRef = useRef(null);
  const mainImageRef = useRef(null);
  
  // Access the property ID directly from params
  const propertyId = params?.id;
  
  // Load property when ID changes
  useEffect(() => {
    if (propertyId) {
      dispatch(fetchProperty(propertyId));
    }
  }, [dispatch, propertyId]);

  // Slider scrolling effect
  useEffect(() => {
    if (sliderRef.current && property?.property_images?.length > 0) {
      const imagesLength = property.property_images.length || 1;
      sliderRef.current.scrollTo({
        left: (currentSlide * sliderRef.current.offsetWidth) / imagesLength,
        behavior: "smooth",
      });
    }
  }, [currentSlide, property]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);
  
  // Obtener las imágenes procesadas solo cuando property cambie
  const propertyImages = useMemo(() => {
    if (!property) return [{ 
      id: 'default-img', 
      url: "/images/interiorcasa.png", 
      is_cover: true,
      alt: "No hay imagen disponible" 
    }];
    
    // Si hay property_images, usarlas y ordenarlas por orden
    if (property.property_images && property.property_images.length > 0) {
      return property.property_images
        .sort((a, b) => a.order - b.order)
        .map(img => ({
          ...img,
          url: getPublicImageUrl(img.url, "/images/interiorcasa.png")
        }));
    }
    
    // Si hay un array de URLs de imágenes, usarlo
    if (property.images && property.images.length > 0) {
      return property.images.map((url, index) => ({
        id: `img-${index}`,
        url: getPublicImageUrl(url, "/images/interiorcasa.png"),
        is_cover: index === 0
      }));
    }
    
    // Si no hay imágenes, devolver un array con una imagen predeterminada
    return [{ 
      id: 'default-img', 
      url: "/images/interiorcasa.png", 
      is_cover: true,
      alt: "No hay imagen disponible" 
    }];
  }, [property]);
  
  // Precargar las imágenes
  useEffect(() => {
    if (propertyImages.length > 1) {
      // Precargar imágenes adyacentes
      const preloadAdjacentImages = () => {
        // Precargar siguiente imagen
        if (currentSlide < propertyImages.length - 1) {
          const nextImg = new Image();
          nextImg.src = propertyImages[currentSlide + 1]?.url || "/images/interiorcasa.png";
          nextImg.onload = () => setNextImagePreloaded(true);
        } else {
          // Si estamos en la última, precargar la primera
          const nextImg = new Image();
          nextImg.src = propertyImages[0]?.url || "/images/interiorcasa.png";
          nextImg.onload = () => setNextImagePreloaded(true);
        }
        
        // Precargar imagen anterior
        if (currentSlide > 0) {
          const prevImg = new Image();
          prevImg.src = propertyImages[currentSlide - 1]?.url || "/images/interiorcasa.png";
          prevImg.onload = () => setPrevImagePreloaded(true);
        } else {
          // Si estamos en la primera, precargar la última
          const prevImg = new Image();
          prevImg.src = propertyImages[propertyImages.length - 1]?.url || "/images/interiorcasa.png";
          prevImg.onload = () => setPrevImagePreloaded(true);
        }
      };
      
      preloadAdjacentImages();
    }
  }, [propertyImages, currentSlide]);

  // Funciones para cambiar slides
  const nextSlide = () => {
    // Mostrar loader siempre al cambiar slide
    setIsImageLoading(true);
    setNextImagePreloaded(false);
    setPrevImagePreloaded(false);
    
    // Guardar la dirección pero NO aplicar animación aún
    setSlideDirection(null);
    
    // Cambiar slide
    setCurrentSlide((prev) => {
      const newIndex = prev === propertyImages.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  const prevSlide = () => {
    // Mostrar loader siempre al cambiar slide
    setIsImageLoading(true);
    setPrevImagePreloaded(false);
    setNextImagePreloaded(false);
    
    // Guardar la dirección pero NO aplicar animación aún
    setSlideDirection(null);
    
    // Cambiar slide
    setCurrentSlide((prev) => {
      const newIndex = prev === 0 ? propertyImages.length - 1 : prev - 1;
      return newIndex;
    });
  };

  // Función para compartir la URL de la propiedad
  const handleShare = async () => {
    // Construir la URL para compartir
    const shareUrl = `https://homever.ar/property/${propertyId}`;
    const shareTitle = property?.title || `${propertyTypeText} en ${property?.address}`;
    const shareText = `Mira esta propiedad en Homever: ${shareTitle}`;
    
    // Verificar si la API Web Share está disponible
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus("shared");
        setTimeout(() => setShareStatus(""), 2000);
      } catch (error) {
        console.error("Error al compartir:", error);
        // Si el usuario cancela, no mostrar error
        if (error.name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback: copiar al portapapeles
      copyToClipboard(shareUrl);
    }
  };
  
  // Función auxiliar para copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareStatus("copied");
        setTimeout(() => setShareStatus(""), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        // Si falla, mostramos un input seleccionado como último recurso
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setShareStatus("copied");
        setTimeout(() => setShareStatus(""), 2000);
      });
  };

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto bg-white text-neutral-800 rounded-lg overflow-hidden p-6 md:p-8 pt-8 mt-4">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-10 bg-neutral-200 rounded w-1/4"></div>
              <div className="h-10 bg-neutral-200 rounded w-1/4"></div>
            </div>
            <div className="h-10 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-[450px] bg-neutral-200 rounded w-full"></div>
            <div className="flex gap-2 overflow-hidden">
              <div className="h-24 w-32 bg-neutral-200 rounded"></div>
              <div className="h-24 w-32 bg-neutral-200 rounded"></div>
              <div className="h-24 w-32 bg-neutral-200 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 bg-neutral-200 rounded w-24"></div>
              <div className="h-8 bg-neutral-200 rounded w-32"></div>
              <div className="h-8 bg-neutral-200 rounded w-28"></div>
            </div>
            <div className="h-32 bg-neutral-200 rounded w-full"></div>
            <div className="h-16 bg-neutral-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay propiedad o la propiedad no se encontró
  if (!property) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto bg-white text-neutral-800 rounded-lg overflow-hidden p-8 mt-4">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
          <p className="mb-6 text-neutral-600">La propiedad que buscas no existe o no está disponible.</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/listado')}
            className="bg-brand-brown-500 text-white hover:bg-brand-brown-600 border-brand-brown-500 mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  // Formatear el precio
  const formattedPrice = typeof property.price === 'number' 
    ? property.price === 1 
      ? "Consultar precio" 
      : `USD ${property.price.toLocaleString('es-AR').replace(/,/g, '.')}` 
    : property.price?.toString() || "Consultar";

  // Formatear tipo de propiedad
  const propertyTypeText = {
    house: 'Casa',
    apartment: 'Departamento',
    land: 'Terreno',
    office: 'Oficina',
    commercial: 'Local Comercial'
  }[property.property_type] || property.property_type;

  // Función para abrir la galería en pantalla completa
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Manejador de errores para imágenes
  const onImageError = (e) => {
    handleImageError(e, "/images/interiorcasa.png");
  };

  // Crear un array para las características principales
  const mainFeatures = [
    { 
      label: 'Superficie',
      value: property.area > 0 ? `${property.area} m²` : null,
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-brown-600"
      >
        <path d="M3 3h18v18H3V3z" />
        <path d="M3 9h18" />
        <path d="M3 15h18" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    },
    { 
      label: 'Terreno',
      value: property.land_area > 0 ? `${property.land_area} m²` : null,
      icon: <Home className="h-5 w-5 text-brand-brown-600" />
    },
    { 
      label: 'Ambientes',
      value: property.rooms > 0 ? property.rooms : null,
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-brown-600"
      >
        <path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
        <path d="M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" />
        <path d="M2 12h20" />
        <path d="M4 9h16v3H4z" />
      </svg>
    },
    { 
      label: 'Baños',
      value: property.bathrooms > 0 ? property.bathrooms : null,
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand-brown-600"
      >
        <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        <line x1="10" x2="8" y1="5" y2="7" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <line x1="7" x2="7" y1="19" y2="21" />
        <line x1="17" x2="17" y1="19" y2="21" />
      </svg>
    }
  ].filter(item => item.value !== null);

  return (
    <div className="min-h-screen bg-white pt-20">
    <div className="max-w-6xl mx-auto bg-white text-neutral-800 rounded-lg overflow-hidden mt-4 mb-8">
      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(8%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-8%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        
        /* Spinner animation */
        @keyframes spinner {
          to {transform: rotate(360deg);}
        }
        
        .spinner {
          animation: spinner 0.6s linear infinite;
        }
        
        /* Optimización de rendimiento para animaciones */
        .animate-slide-in-right,
        .animate-slide-in-left,
        .spinner {
          will-change: transform, opacity;
        }
        
        /* Fade in para notificaciones */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        .notification-enter {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .notification-exit {
          animation: fadeOut 0.3s ease forwards;
        }
        
        /* Ocultar scrollbar */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Estilos de scrollbar */
        /* Ocultar scrollbar en móviles */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        
        /* Mostrar scrollbar estilizada en desktop */
        @media (min-width: 769px) {
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
            background-color: rgba(30, 30, 30, 0.5);
            border-radius: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #8A2F4C 0%, #7A3F12 100%);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #7A3F12 0%, #8A2F4C 100%);
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #2c2c2c;
            border-radius: 8px;
            box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
      
      {/* Notificación de compartir */}
      {shareStatus && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg z-50 flex items-center notification-enter">
          {shareStatus === "copied" ? (
            <>
              <Check className="h-5 w-5 text-brand-brown-600 mr-2" />
              <span>Enlace copiado al portapapeles</span>
            </>
          ) : (
            <>
              <Share2 className="h-5 w-5 text-brand-brown-600 mr-2" />
              <span>¡Compartido exitosamente!</span>
            </>
          )}
        </div>
      )}
      
      {/* Fullscreen Gallery */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen}
              className="rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Salir</span>
            </Button>
          </div>
          
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="relative w-full h-full">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
                  <div className="spinner w-16 h-16 border-[6px] border-brand-brown-200 border-t-brand-brown-500 rounded-full"></div>
                </div>
              )}
              <NextImage
                src={propertyImages[currentSlide]?.url || "/images/interiorcasa.png"}
                alt={`Vista de la propiedad ${currentSlide + 1}`}
                fill
                priority
                quality={isFullscreen ? 90 : 85}
                sizes="100vw"
                className={`object-contain ${
                  isImageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
                } ${
                  !isImageLoading ? (
                    slideDirection === 'next' ? 'animate-slide-in-right' : 
                    slideDirection === 'prev' ? 'animate-slide-in-left' : ''
                  ) : ''
                }`}
                onError={onImageError}
                onLoadingComplete={() => {
                  // Solo cuando termina de cargar:
                  // 1. Asignar la dirección de la animación (si no hay una)
                  // 2. Ocultar el loader
                  setTimeout(() => {
                    if (currentSlide > 0 && !slideDirection) setSlideDirection('next');
                    if (currentSlide === 0 && !slideDirection) setSlideDirection('prev');
                    setIsImageLoading(false);
                  }, 100);
                }}
              />
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1">
              {propertyImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? "w-8 bg-brand-brown-500" : "w-2 bg-neutral-500"
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 text-white hover:bg-black/70"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 text-white hover:bg-black/70"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
              {currentSlide + 1}/{propertyImages.length}
            </div>
          </div>
        </div>
      )}
      
      {/* Header bar sticky on scroll */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-neutral-600 hover:text-brand-brown-600 hover:bg-brand-brown-500/10 transition-all duration-200 flex items-center px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm sm:text-base font-medium">Volver</span>
            </Button>
            
            <div className="text-sm sm:text-base font-semibold text-brand-brown-600 hidden sm:block truncate max-w-[50%] text-center">
              {property?.title || `${propertyTypeText} en ${property?.address}`}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="rounded-xl bg-white border-neutral-200 text-neutral-600 hover:bg-brand-brown-500/10 hover:border-brand-brown-500 hover:text-brand-brown-600 transition-all duration-200 h-10 w-10 shadow-sm hover:shadow-md hover:scale-105"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Compartir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
        {/* Left Column (Gallery + Main Info) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Image Section with Overlay Buttons */}
          <div 
            ref={mainImageRef} 
            className="rounded-xl overflow-hidden border border-neutral-200 relative cursor-pointer mb-6 group shadow-sm hover:shadow-md transition-all duration-300"
            onClick={toggleFullscreen}
          >
            <div className="relative aspect-[16/9] bg-neutral-50">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="spinner w-12 h-12 border-[3px] border-neutral-200 border-t-brand-brown-500 rounded-full"></div>
                    <span className="text-sm text-neutral-500 font-medium">Cargando imagen...</span>
                  </div>
                </div>
              )}
              <NextImage
                src={propertyImages[currentSlide]?.url || "/images/interiorcasa.png"}
                alt={`Vista de la propiedad ${currentSlide + 1}`}
                fill
                priority
                quality={isFullscreen ? 90 : 85}
                sizes="100vw"
                className={`object-contain ${
                  isImageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
                } ${
                  !isImageLoading ? (
                    slideDirection === 'next' ? 'animate-slide-in-right' : 
                    slideDirection === 'prev' ? 'animate-slide-in-left' : ''
                  ) : ''
                }`}
                onError={onImageError}
                onLoadingComplete={() => {
                  // Solo cuando termina de cargar:
                  // 1. Asignar la dirección de la animación (si no hay una)
                  // 2. Ocultar el loader
                  setTimeout(() => {
                    if (currentSlide > 0 && !slideDirection) setSlideDirection('next');
                    if (currentSlide === 0 && !slideDirection) setSlideDirection('prev');
                    setIsImageLoading(false);
                  }, 100);
                }}
              />
              
              {/* Carga oculta de las imágenes vecinas para mejorar la experiencia */}
              {propertyImages.length > 1 && (
                <>
                  <div className="hidden">
                    {/* Precargar la siguiente imagen */}
                    {currentSlide < propertyImages.length - 1 && (
                      <NextImage 
                        src={propertyImages[currentSlide + 1]?.url || "/images/interiorcasa.png"}
                        alt="Preloaded next"
                        width={1}
                        height={1}
                        quality={30}
                      />
                    )}
                    
                    {/* Precargar la imagen anterior */}
                    {currentSlide > 0 && (
                      <NextImage 
                        src={propertyImages[currentSlide - 1]?.url || "/images/interiorcasa.png"}
                        alt="Preloaded previous"
                        width={1}
                        height={1}
                        quality={30}
                      />
                    )}
                  </div>
                </>
              )}
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge className="bg-brand-brown-500 text-white hover:bg-brand-brown-600 px-3 py-1.5 font-medium shadow-sm">
                  {property.listing_type === 'sale' ? 'Venta' : 'Alquiler'}
                </Badge>
                {property.is_featured && (
                  <Badge className="bg-white/95 text-brand-brown-600 border border-brand-brown-500/30 px-3 py-1.5 font-medium shadow-sm backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Destacada
                  </Badge>
                )}
              </div>
              
              {/* Gallery controls */}
              {propertyImages.length > 1 && (
                <div className="absolute right-4 bottom-4 bg-white/95 text-neutral-700 text-sm font-medium px-3 py-1.5 rounded-full border border-neutral-200/50 shadow-sm backdrop-blur-sm">
                  {currentSlide + 1}/{propertyImages.length}
                </div>
              )}
              
              {/* Expand icon */}
              <div className="absolute top-4 right-4 bg-white/95 rounded-full p-2.5 border border-neutral-200/50 shadow-sm backdrop-blur-sm group-hover:bg-white group-hover:scale-105 transition-all duration-200">
                <ExternalLink className="h-4 w-4 text-neutral-600 group-hover:text-brand-brown-600" />
              </div>
              
              {/* Navigation buttons */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-3 text-neutral-600 hover:bg-white hover:text-brand-brown-600 border border-neutral-200/50 shadow-sm backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-3 text-neutral-600 hover:bg-white hover:text-brand-brown-600 border border-neutral-200/50 shadow-sm backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail Slider if more than 1 image */}
          {propertyImages.length > 1 && (
            <div className="relative mb-8">
              <div 
                ref={sliderRef} 
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {propertyImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative flex-shrink-0 w-20 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 snap-start hover:scale-105
                      ${currentSlide === index 
                        ? "border-brand-brown-500 shadow-md ring-2 ring-brand-brown-500/20" 
                        : "border-neutral-200 hover:border-brand-brown-500/50 shadow-sm"}`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <NextImage
                      src={img.url || "/images/interiorcasa.png"}
                      alt={`Vista ${index + 1}`}
                      fill
                      sizes="80px"
                      className={`object-cover transition-all duration-300 ${currentSlide === index ? 'filter-none' : 'filter brightness-90 hover:brightness-100'}`}
                      onError={onImageError}
                      quality={60}
                      loading={Math.abs(index - currentSlide) < 3 ? "eager" : "lazy"}
                    />
                    {currentSlide === index && (
                      <div className="absolute inset-0 bg-brand-brown-500/10"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="mb-10">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-800 leading-tight">{property.title || `${propertyTypeText} en ${property.address}`}</h1>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-brand-brown-600 flex-shrink-0" />
                <span className="text-lg">{property.address}</span>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-brown-500/10 text-brand-brown-600 text-sm font-medium">
                <Home className="h-4 w-4 mr-1" />
                {propertyTypeText}
              </div>
            </div>
            
            {/* Main Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {mainFeatures.map((feature, i) => (
                <div key={i} className="bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center border border-neutral-200 hover:border-brand-brown-500/30 hover:shadow-md transition-all duration-300 group">
                  <div className="mb-3 p-3 bg-brand-brown-500/10 rounded-full group-hover:bg-brand-brown-500/20 transition-colors">{feature.icon}</div>
                  <div className="text-sm text-neutral-500 mb-1 font-medium">{feature.label}</div>
                  <div className="text-xl font-bold text-neutral-800">{feature.value}</div>
                </div>
              ))}
            </div>
            
            {/* Additional Features Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Características adicionales</h3>
              <div className="flex flex-wrap gap-3">
                {property.has_garage && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-brand-brown-500/30 rounded-full text-sm text-neutral-700 font-medium transition-all duration-200 hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-brown-600"
                    >
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                    Cochera
                  </span>
                )}

                {property.has_pool && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-brand-brown-500/30 rounded-full text-sm text-neutral-700 font-medium transition-all duration-200 hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-brown-600"
                    >
                      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                    </svg>
                    Piscina
                  </span>
                )}

                {property.has_garden && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-brand-brown-500/30 rounded-full text-sm text-neutral-700 font-medium transition-all duration-200 hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-brown-600"
                    >
                      <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5m-4.5-4.5H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="m8 16 1.5-1.5" />
                      <path d="M14.5 9.5 16 8" />
                      <path d="m8 8 1.5 1.5" />
                      <path d="M14.5 14.5 16 16" />
                    </svg>
                    Jardín
                  </span>
                )}
                
                {property.semi_covered_area > 0 && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-brand-brown-500/30 rounded-full text-sm text-neutral-700 font-medium transition-all duration-200 hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-brown-600"
                    >
                      <path d="M8 3v4l-2 2" />
                      <path d="M16 3v4l2 2" />
                      <path d="M21 8H3" />
                      <path d="M21 12H3" />
                      <path d="M3 16h18" />
                      <path d="M4 20h16" />
                      <path d="M4 16v4" />
                      <path d="M20 16v4" />
                    </svg>
                    {property.semi_covered_area} m² semicubiertos
                  </span>
                )}
              </div>
            </div>

            {/* Description Text */}
            {property.description && (
              <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-neutral-800">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-brand-brown-500/20 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand-brown-600"
                    >
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l6 6v10a2 2 0 0 1-2 2z" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                    </svg>
                  </span>
                  Descripción
                </h3>
                <div className="text-neutral-600 whitespace-pre-line leading-relaxed text-base">
                  {property.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Price Info and Contact) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-brown-500/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-brand-brown-600" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-800">Precio</h2>
              </div>
              
              <div className="text-4xl font-bold text-brand-brown-600 mb-2">
                {formattedPrice}
              </div>
              
              {property.listing_type === 'rent' && (
                <p className="text-neutral-500 text-sm mb-4">Precio mensual</p>
              )}
              
              <Separator className="my-6 bg-neutral-200" />
              
              <div className="mb-6">
                <h3 className="font-semibold flex items-center mb-4 text-neutral-800">
                  <div className="p-1.5 bg-brand-brown-500/20 rounded-lg mr-2">
                    <User className="h-4 w-4 text-brand-brown-600" />
                  </div>
                  Contactar vendedor
                </h3>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-brand-brown-500 hover:bg-brand-brown-600 text-white font-semibold py-3.5 text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      const phoneNumber = "5492227536988";
                      const message = `Me interesa esta propiedad! http://ms-inmobiliaria.com.ar/property/${propertyId}`;
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-neutral-500 text-sm bg-neutral-50 rounded-lg p-3">
                <p className="font-medium">Código: #{propertyId.slice(0, 8)}</p>
              </div>
            </div>
            
            {/* Map with actual location */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-semibold flex items-center mb-4 text-neutral-800">
                <div className="p-2 bg-brand-brown-500/20 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-brand-brown-600" />
                </div>
                Ubicación
              </h3>
              <div className="h-64 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                {(() => {
                  // Extraer coordenadas de property.location (EWKT) o usar fallback
                  let lat = null, lng = null
                  if (property.location) {
                    const coords = parseEWKBPoint(property.location)
                    if (coords) {
                      lng = coords.longitude
                      lat = coords.latitude
                    }
                  }
                  lat = lat ?? property.latitude ?? -34.6037
                  lng = lng ?? property.longitude ?? -58.3816
                  return (
                    <MapboxMap 
                      latitude={lat}
                      longitude={lng}
                      zoom={15}
                      height="100%"
                      interactive={true}
                    />
                  )
                })()}
              </div>
              <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600 font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-brand-brown-600 flex-shrink-0" />
                  {property.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
} 