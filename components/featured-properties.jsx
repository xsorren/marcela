"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import PropertyCard from "./property-card"
import ScrollReveal from "./ScrollReveal"
import { fetchProperties } from "../utils/supabase/properties"
import { getPropertyCoverImage } from "@/utils/image-helpers"
// ========================================
// 🎄 HOLIDAY MODE - Imports
// ========================================
import { isHolidayModeActive } from "@/config/features"
import { Sparkles } from "lucide-react"
// ========================================

export default function FeaturedProperties() {
  const sliderRef = useRef(null)
  const titleRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(6)
  const [isSliding, setIsSliding] = useState(false)
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [regularProperties, setRegularProperties] = useState([]) // Propiedades regulares (no destacadas)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const [cardDimensions, setCardDimensions] = useState({
    width: 329,
    gap: 24
  })
  
  // ========================================
  // 🎄 HOLIDAY MODE - State
  // ========================================
  const showHoliday = isHolidayModeActive()
  // ========================================
  
  // Obtener propiedades de la base de datos
  useEffect(() => {
    const getProperties = async () => {
      setIsLoading(true);
      
      // Crear un timeout para evitar que se quede cargando indefinidamente
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError("Se agotó el tiempo de espera al cargar las propiedades. Por favor, recarga la página.");
      }, 10000); // 10 segundos de timeout
      
      try {
        // 1. Obtener propiedades destacadas
        const { data: featuredData, error: featuredError } = await fetchProperties({ is_featured: true });
        
        if (featuredError) throw featuredError;
        
        // 2. Si no hay suficientes propiedades destacadas, obtener propiedades regulares para completar
        let regularData = [];
        const minPropertiesNeeded = 6;
        
        if (!featuredData || featuredData.length < minPropertiesNeeded) {
          console.log("No hay suficientes propiedades destacadas, obteniendo propiedades regulares");
          
          // Obtener propiedades no destacadas
          const { data: nonFeaturedData, error: regularError } = await fetchProperties({ 
            is_featured: false, 
          });
          
          if (!regularError && nonFeaturedData) {
            regularData = nonFeaturedData;
          } else if (regularError) {
            console.error("Error al obtener propiedades regulares:", regularError);
          }
        }
        
        // Limpiar el timeout ya que la solicitud completó
        clearTimeout(timeoutId);
        
        // Actualizar el estado con los resultados
        setFeaturedProperties(featuredData || []);
        setRegularProperties(regularData || []);
      } catch (err) {
        console.error("Error al obtener propiedades:", err);
        setError(err.message || "Error al cargar propiedades");
      } finally {
        // Limpiar el timeout por si acaso
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };
    
    getProperties();
    
    // Si el componente se desmonta, asegurarse de que isLoading sea false
    return () => {
      setIsLoading(false);
    };
  }, []);
  
  useEffect(() => {
    const title = titleRef.current
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    )
    
    if (title) observer.observe(title)
    
    return () => {
      if (title) observer.unobserve(title)
    }
  }, [])

  // Mezclar propiedades destacadas y regulares para mostrar un mínimo de propiedades
  const getMixedProperties = (featured, regular, minCount = 6) => {
    // Validar que los parámetros sean arrays
    const validFeatured = Array.isArray(featured) ? featured : [];
    const validRegular = Array.isArray(regular) ? regular : [];
    
    // Si ya tenemos suficientes propiedades destacadas, no necesitamos mezclar
    if (validFeatured.length >= minCount) return ensureMinimumProperties(validFeatured, minCount);
    
    // Número de propiedades regulares necesarias para completar
    const neededRegular = Math.min(minCount - validFeatured.length, validRegular.length);
    
    // Obtener propiedades regulares para completar (sin duplicar las que ya están en destacadas)
    const regularToUse = validRegular
      .filter(regProp => !validFeatured.some(featProp => featProp.id === regProp.id))
      .slice(0, neededRegular);
    
    // Combinar propiedades destacadas y regulares
    const combinedProperties = [...validFeatured, ...regularToUse];
    
    // Si todavía no tenemos suficientes, aplicar la duplicación
    return ensureMinimumProperties(combinedProperties, minCount);
  };

  // Asegurar un mínimo de propiedades para el carrusel
  const ensureMinimumProperties = (properties, minCount = 6) => {
    // Validar que properties sea un array válido
    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return [];
    }
    
    if (properties.length >= minCount) return properties;
    
    // Cuántas veces debemos repetir las propiedades para llegar al mínimo
    const repeatCount = Math.ceil(minCount / properties.length);
    const result = [];
    
    for (let i = 0; i < repeatCount; i++) {
      properties.forEach((property, index) => {
        if (property && typeof property === 'object') {
          // Crear una copia con un ID único para evitar advertencias de key en React
          // pero preservando el ID original para poder acceder a la propiedad real
          result.push({
            ...property,
            originalId: property.id, // Guardar el ID original en un nuevo campo
            id: `${property.id || index}-repeat-${i}`, // ID único para React
            isRepeat: i > 0 // Marcar si es una repetición
          });
        }
      });
    }
    
    // Devolver solo la cantidad necesaria
    return result.slice(0, minCount);
  };
  
  // Propiedades a mostrar (combinando destacadas y regulares si es necesario)
  const displayProperties = getMixedProperties(featuredProperties, regularProperties);

  // Calcular el ancho de las tarjetas en función del ancho de la pantalla
  const calculateCardDimensions = () => {
    if (!sliderRef.current) return { width: 329, gap: 24 };
    
    const containerWidth = sliderRef.current.offsetWidth;
    const isMobile = window.innerWidth < 768;
    
    // Cálculo de dimensiones para móvil
    if (isMobile) {
      // En móvil, queremos que la tarjeta ocupe casi todo el ancho con espacio para márgenes
      // Restamos el padding del slider (8px * 2) y un espacio adicional para margen
      const mobileCardWidth = Math.min(320, containerWidth - 32);
      const mobileGap = 16;
      return { width: mobileCardWidth, gap: mobileGap };
    }
    
    // Dimensiones para escritorio
    return { width: 329, gap: 24 };
  };

  // Ajustar la cantidad de elementos visibles según el ancho de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (!sliderRef.current) return;
      
      // Obtener el ancho real del contenedor del slider
      const sliderContainer = sliderRef.current;
      const containerWidth = sliderContainer.offsetWidth;
      setSliderWidth(containerWidth);
      
      // Calcular dimensiones de tarjetas para diferentes dispositivos
      const dimensions = calculateCardDimensions();
      setCardDimensions(dimensions);
      
      // Calcular cuántos elementos caben completamente visibles
      const itemsPerView = Math.max(1, Math.floor((containerWidth + dimensions.gap) / (dimensions.width + dimensions.gap)));
      
      setVisibleItems(itemsPerView);
      
      // Asegurarse de que el índice actual no excede el límite permitido
      const totalSlides = displayProperties.length;
      const newMaxIndex = Math.max(0, totalSlides - itemsPerView);
      
      if (currentIndex > newMaxIndex) {
        setCurrentIndex(newMaxIndex);
      }
    }

    handleResize();
    
    window.addEventListener("resize", handleResize);
    
    // Observer para detectar cambios en el tamaño del contenedor
    if (typeof ResizeObserver !== "undefined" && sliderRef.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(sliderRef.current);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        resizeObserver.disconnect();
      };
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, displayProperties.length]);

  const totalSlides = Array.isArray(displayProperties) ? displayProperties.length : 0;
  // Calcular el índice máximo, asegurando que no se pueda deslizar más allá del último elemento visible
  const maxIndex = Math.max(0, totalSlides - visibleItems);
  
  const nextSlide = () => {
    if (isSliding || currentIndex >= maxIndex) return;
    
    setIsSliding(true);
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
    
    setTimeout(() => setIsSliding(false), 500);
  }

  const prevSlide = () => {
    if (isSliding || currentIndex <= 0) return;
    
    setIsSliding(true);
    setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    
    setTimeout(() => setIsSliding(false), 500);
  }
  
  // Enhanced pagination indicators with modern styling
  const renderPaginationDots = () => {
    if (totalSlides <= visibleItems) return null;
    
    const totalPages = maxIndex + 1;
    return (
      <div className="flex justify-center mt-12 space-x-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => {
              if (!isSliding) {
                setIsSliding(true);
                setCurrentIndex(index);
                setTimeout(() => setIsSliding(false), 500);
              }
            }}
            className={`h-3 rounded-full transition-all duration-300 transform-gpu hover:scale-125 ${
              currentIndex === index 
                ? 'w-8 bg-gradient-to-r from-[#8A2F4C] to-[#606648] shadow-glow-brown' 
                : 'w-3 bg-neutral-300 hover:bg-brand-brown-300 hover:shadow-card'
            }`}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  // Mostrar un mensaje si no hay propiedades, pero no bloquear el renderizado
  const displayNoProperties = () => {
    if ((featuredProperties.length === 0 && regularProperties.length === 0) && !isLoading && !error) {
      return (
        <div className="py-16 md:py-24 bg-white w-full text-center">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-brand-brown-300 mb-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 5L21 9M3 9V17L12 21M3 9L7 11M21 9V17L12 21M21 9L17 11M12 21V13M12 13L7 11M12 13L17 11M7 11V15L12 17M17 11V15L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">No hay propiedades disponibles</h2>
              <p className="text-neutral-600 mb-8 text-lg max-w-2xl mx-auto">Estamos trabajando para agregar nuevas propiedades. Vuelve a visitar esta sección pronto.</p>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8A2F4C] to-transparent mt-4"></div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Mostrar el contenido de error sin bloquear el renderizado de otros componentes
  const displayError = () => {
    if (error) {
      return (
        <div className="py-16 bg-[#242424] w-full text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-4">No se pudieron cargar las propiedades</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-brand-green-500 text-white font-semibold rounded-xl hover:bg-brand-green-600 transition-all duration-200 shadow-minimalist hover:shadow-minimalist-hover transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // Enhanced loader with modern animations
  const displayLoader = () => {
    if (isLoading) {
      return (
        <div className="py-16 w-full text-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center flex-col animate-fade-in">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-brand-brown-500 animate-spin" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-brand-green-200 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2 mt-6 animate-pulse-soft">
                Cargando propiedades destacadas
              </h2>
              <p className="text-neutral-600 text-base md:text-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
                Buscando las mejores opciones para ti...
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#8A2F4C] to-[#606648] mx-auto rounded-full mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Renderizar el carrusel de propiedades
  const renderPropertyCarousel = () => {
    if (isLoading || error || displayProperties.length === 0) {
      return null;
    }

    // Función para manejar el inicio del toque
    const handleTouchStart = (e) => {
      setTouchStartX(e.touches[0].clientX);
      setTouchEndX(e.touches[0].clientX);
    };

    // Función para seguir el movimiento del toque
    const handleTouchMove = (e) => {
      setTouchEndX(e.touches[0].clientX);
    };

    // Función para manejar el final del toque
    const handleTouchEnd = () => {
      if (isSliding) return;

      // Calcular la distancia del swipe
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 50; // Distancia mínima para considerar un swipe válido
      
      // Detectar dirección del swipe
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swipe a la derecha - ir a slide anterior
          if (currentIndex > 0) {
            prevSlide();
          }
        } else {
          // Swipe a la izquierda - ir a slide siguiente
          if (currentIndex < maxIndex) {
            nextSlide();
          }
        }
      }
    };

    // Determinar si se muestran los botones de navegación
    const showNavButtons = totalSlides > visibleItems;

    return (
      <ScrollReveal delay={100}>
        <div className="relative w-full px-4 md:px-6">
          {/* Enhanced navigation buttons with modern design */}
          {showNavButtons && (
            <>
              <button
                onClick={prevSlide}
                className={`group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 shadow-card hover:shadow-glow transition-all duration-300 transform-gpu hover:scale-110 ${
                  currentIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:border-brand-brown-300'
                }`}
                aria-label="Anterior"
                disabled={isSliding || currentIndex <= 0}
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-brand-brown-500 mx-auto transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
              </button>

              <button
                onClick={nextSlide}
                className={`group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200 shadow-card hover:shadow-glow transition-all duration-300 transform-gpu hover:scale-110 ${
                  currentIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:border-brand-brown-300'
                }`}
                aria-label="Siguiente"
                disabled={isSliding || currentIndex >= maxIndex}
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-brand-brown-500 mx-auto transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
              </button>
            </>
          )}

          <div 
            className="overflow-hidden w-full" 
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-all duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (cardDimensions.width + cardDimensions.gap)}px)`,
                gap: `${cardDimensions.gap}px`
              }}
            >
              {displayProperties.map((property, index) => (
                <div 
                  key={property?.id || `property-${Math.random()}`} 
                  className="flex-none"
                  style={{ 
                    width: `${cardDimensions.width}px`,
                    opacity: isSliding ? 0.7 : 1,
                    transform: `scale(${isSliding ? 0.95 : 1})`,
                    transition: 'all 0.5s ease-out',
                    transitionDelay: `${index * 0.05}s`
                  }}
                >
                  <div className="hover-card w-full h-full">
                    <PropertyCard 
                      property={property}
                      inFeatured={true}
                      className="featured-card h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      
        {/* Indicadores de paginación */}
        {renderPaginationDots()}
      </ScrollReveal>
    );
  };

  // En lugar de renderizar condicionalmente todo el componente, siempre renderizamos su estructura
  // pero cambiamos su contenido según el estado
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-white via-brand-brown-25 to-white w-full relative overflow-hidden">
      {/* Enhanced decorative elements with modern depth */}
      <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-brand-brown-100 to-brand-brown-200 blur-3xl opacity-40 animate-float"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-brand-green-100 to-brand-green-200 blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 blur-2xl opacity-30 animate-pulse-soft"></div>
      
      <div className="w-full relative z-10">
        <ScrollReveal>
          <div className="px-6 md:px-8 mb-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 ref={titleRef} className="text-4xl md:text-6xl font-heading font-bold text-neutral-800 mb-6 animate-slide-up">
                {/* ========================================
                    🎄 HOLIDAY MODE - Título con decoración
                    ======================================== */}
                {showHoliday ? (
                  <span className="bg-gradient-to-r from-[#8A2F4C] via-[#8A2F4C] to-[#606648] bg-clip-text text-transparent flex items-center justify-center gap-3">
                    <Sparkles className="text-holiday-gold h-8 w-8 md:h-10 md:w-10" style={{ color: '#D4AF37' }} />
                    Propiedades destacadas
                    <Sparkles className="text-holiday-gold h-8 w-8 md:h-10 md:w-10" style={{ color: '#D4AF37' }} />
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-[#8A2F4C] via-[#8A2F4C] to-[#606648] bg-clip-text text-transparent">
                    Propiedades destacadas
                  </span>
                )}
                {/* ======================================== */}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-[#8A2F4C] to-[#606648] mx-auto rounded-full shadow-glow-brown animate-pulse-soft"></div>
              <p className="text-neutral-600 text-lg md:text-xl mt-6 font-medium">
                {showHoliday ? (
                  "Encuentra tu hogar ideal para comenzar el nuevo año"
                ) : (
                  "Descubre las mejores opciones cuidadosamente seleccionadas para ti"
                )}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Mostrar el componente adecuado según el estado, pero manteniendo la estructura del componente */}
        {displayLoader()}
        {displayError()}
        {displayNoProperties()}
        {renderPropertyCarousel()}
      </div>
      
      {/* Elegant separator - Always shown to maintain structure */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2F4C] to-transparent mt-16"></div>
        <div className="flex justify-center -mt-3">
        </div>
      </div>
      
      {/* Agregar estilos específicos para mejorar la apariencia en dispositivos móviles */}
      <style jsx global>{`
        .featured-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        @media (max-width: 767px) {
          .featured-card {
            /* Asegurar que la imagen tenga una altura proporcional en móvil */
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .featured-card img {
            height: 180px;
            object-fit: cover;
            width: 100%;
          }
          
          /* Ajustar estilos de precio y ubicación para móvil */
          .featured-card h3 {
            font-size: 1.1rem;
            line-height: 1.4;
          }
          
          .featured-card p {
            font-size: 0.875rem;
          }
          
          /* Mejorar el espaciado en la card para móvil */
          .featured-card > div {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}

