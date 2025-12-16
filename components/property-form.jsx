"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { PropertyImages } from "@/components/property-images"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Save } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// Importaciones para Mapbox
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
// Estilos de Mapbox
import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { useToast } from "@/hooks/use-toast"
// Nuevos componentes para selección manual de ubicación
import LocationModeToggle from "@/components/LocationModeToggle"
import MapboxLocationPicker from "@/components/MapboxLocationPicker"
import { useManualLocationPicker } from "@/hooks/useManualLocationPicker"

// Definir esquema de validación
const propertyFormSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título no puede exceder 100 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  property_type: z.string().min(1, "Selecciona un tipo de propiedad"),
  listing_type: z.string().min(1, "Selecciona un tipo de operación"),
  address: z.string().min(1, "La dirección es requerida").refine(
    (val) => val.length >= 3 || val.includes(','), 
    "La dirección debe tener al menos 3 caracteres o ser una ubicación válida"
  ),
  price: z.coerce.number().min(1, "El precio debe ser mayor que 0"),
  area: z.coerce.number().min(1, "El área debe ser mayor que 0").optional().or(z.literal("")),
  land_area: z.coerce.number().min(0, "El área de terreno debe ser positiva").optional().or(z.literal("")),
  semi_covered_area: z.coerce.number().min(0, "El área semicubierta debe ser positiva").optional().or(z.literal("")),
  rooms: z.coerce.number().min(0, "El número de habitaciones debe ser positivo").optional().or(z.literal("")),
  bathrooms: z.coerce.number().min(0, "El número de baños debe ser positivo").optional().or(z.literal("")),
  has_garage: z.boolean().default(false),
  has_pool: z.boolean().default(false),
  has_garden: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  images: z.array(z.string()).optional()
})

export function PropertyForm({ initialData, onSave, isSaving = false }) {
  const [uploadedImages, setUploadedImages] = useState([])
  const [temporaryId] = useState(`temp-${Date.now()}`)
  const { toast } = useToast()
  
  // Validar y convertir coordenadas iniciales
  const initialLatitude = initialData?.location?.latitude ? 
    parseFloat(initialData.location.latitude) : null;
  const initialLongitude = initialData?.location?.longitude ? 
    parseFloat(initialData.location.longitude) : null;
  
  // Inicializar ubicación solo con coordenadas válidas
  const initialLocationData = (!isNaN(initialLatitude) && !isNaN(initialLongitude)) ? {
    latitude: initialLatitude,
    longitude: initialLongitude,
    address: initialData?.address || '',
    source: 'existing'
  } : null;

  // Hook para manejar selección manual de ubicación
  const {
    location,
    mode,
    handleManualLocationSelect,
    handleAutomaticLocationSelect,
    setMode,
    clearLocation,
    validateLocation,
    getFormattedLocationData,
    isManualMode,
    isSearchMode
  } = useManualLocationPicker(initialLocationData)
  
  const geocoderContainerRef = useRef(null)
  
  // Initialize form with validation and default values
  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      property_type: initialData?.property_type || "",
      listing_type: initialData?.listing_type || "",
      address: initialData?.address || "",
      price: initialData?.price || "",
      area: initialData?.area || "",
      land_area: initialData?.land_area || "",
      semi_covered_area: initialData?.semi_covered_area || "",
      rooms: initialData?.rooms || "",
      bathrooms: initialData?.bathrooms || "",
      has_garage: initialData?.has_garage || false,
      has_pool: initialData?.has_pool || false,
      has_garden: initialData?.has_garden || false,
      is_featured: initialData?.is_featured || false,
      images: initialData?.images || []
    }
  })

  // Log initial data for debugging
  useEffect(() => {
    console.log("PropertyForm initialData:", {
      address: initialData?.address,
      location: initialData?.location
    });
  }, [initialData]);

  // Geocodificar dirección inicial si es necesario
  useEffect(() => {
    // Si no tenemos coordenadas pero sí dirección, intentar geocodificar
    if (!location && initialData?.address && process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      const encodedAddress = encodeURIComponent(initialData.address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&country=ar&language=es`;
      
      console.log("Intentando geocodificar dirección inicial:", initialData.address);
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            console.log("Coordenadas obtenidas por geocodificación inicial:", { latitude, longitude });
            handleAutomaticLocationSelect({
              latitude,
              longitude,
              address: initialData.address
            });
          } else {
            console.warn("No se encontraron coordenadas para la dirección:", initialData.address);
          }
        })
        .catch(error => {
          console.error("Error al geocodificar dirección inicial:", error);
        });
    }
  }, [initialData?.address, location, handleAutomaticLocationSelect]);

  // Initialize Mapbox geocoder (solo en modo búsqueda)
  useEffect(() => {
    if (!geocoderContainerRef.current || !isSearchMode) return;

    // Configure Mapbox API
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // Crear el geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: 'Buscar dirección...',
      mapboxgl: mapboxgl,
      marker: false,
      countries: 'ar', // Argentina
      language: 'es' // Español
    });

    // Montar el geocoder en el contenedor
    geocoder.addTo(geocoderContainerRef.current);

    // Manejar el evento de resultado seleccionado
    geocoder.on('result', (e) => {
      // Extraer las coordenadas del resultado
      const [longitude, latitude] = e.result.center;
      
      // Asegurar que son valores numéricos válidos
      const validLongitude = typeof longitude === 'number' ? longitude : parseFloat(longitude);
      const validLatitude = typeof latitude === 'number' ? latitude : parseFloat(latitude);
      
      // Verificar que las coordenadas son números válidos antes de actualizar el estado
      if (!isNaN(validLongitude) && !isNaN(validLatitude)) {
        // Usar el handler del hook para búsqueda automática
        handleAutomaticLocationSelect({
          latitude: validLatitude,
          longitude: validLongitude,
          address: e.result.place_name
        });
        
        // Actualizar la dirección en el formulario
        form.setValue('address', e.result.place_name, { shouldValidate: true });
        
        console.log("Nuevas coordenadas seleccionadas (automático):", { latitude: validLatitude, longitude: validLongitude });
      } else {
        console.error("Coordenadas inválidas recibidas del geocoder:", e.result.center);
      }
    });

    // Manejar la limpieza del geocoder
    geocoder.on('clear', () => {
      clearLocation();
      form.setValue('address', '', { shouldValidate: true });
    });

    // Cleanup on unmount
    return () => {
      if (geocoder) {
        geocoder.onRemove();
      }
    };
  }, [form, isSearchMode, handleAutomaticLocationSelect, clearLocation]);

  // Sincronizar dirección del hook con el formulario
  useEffect(() => {
    if (location && location.address) {
      // Actualizar el campo address del formulario cuando cambie la ubicación
      form.setValue('address', location.address, { shouldValidate: true });
    }
  }, [location, form]);

  // Inicializar mapa estático para ubicación existente (solo en modo búsqueda)
  const mapInstance = useRef(null);
  const staticMapRef = useRef(null);
  
  useEffect(() => {
    // Limpiar mapa anterior si existe
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    
    // Sólo mostrar el mapa si estamos en modo búsqueda, tenemos coordenadas y el elemento existe
    if (isSearchMode && location && location.latitude && location.longitude && staticMapRef.current) {
      try {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        
        const map = new mapboxgl.Map({
          container: staticMapRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [location.longitude, location.latitude],
          zoom: 15,
          interactive: false // Mapa no interactivo, solo visualización
        });
        
        // Guardar referencia al mapa
        mapInstance.current = map;

        // Añadir marcador
        new mapboxgl.Marker({ color: "#D4AF37" })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);
      } catch (error) {
        console.error("Error al inicializar el mapa estático:", error);
      }
    }
    
    // Limpiar al desmontar
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location, isSearchMode]);

  // Initialize uploaded images from initial data
  useEffect(() => {
    console.log("PropertyForm - initialData:", {
      id: initialData?.id,
      property_images: initialData?.property_images,
      images: initialData?.images
    });

    if (initialData?.property_images && initialData.property_images.length > 0) {
      console.log("Usando property_images para inicializar:", initialData.property_images);
      const images = initialData.property_images.map(img => img.url || img);
      setUploadedImages(images);
    } else if (initialData?.images && initialData.images.length > 0) {
      console.log("Usando images para inicializar:", initialData.images);
      setUploadedImages(initialData.images);
    } else {
      console.log("No hay imágenes iniciales, estableciendo array vacío");
      setUploadedImages([]);
    }
  }, [initialData]);

  // Handle image updates - CRITICAL for syncing images between components
  const handleUpdateImages = (images) => {
    console.log("PropertyForm - handleUpdateImages recibió:", images);
    
    // Verificar que sea un array válido
    if (!Array.isArray(images)) {
      console.warn("handleUpdateImages recibió un valor no válido:", images);
      return;
    }
    
    // Garantizar que solo contenga URLs válidas
    const validImages = images.filter(url => typeof url === 'string' && url.trim() !== '');
    
    console.log("PropertyForm - imágenes válidas a actualizar:", validImages);
    
    // Actualizar estado local y formulario de manera inmediata
    setUploadedImages(validImages);
    form.setValue('images', validImages);
    
    // Registrar actualización en consola para debugging
    console.log("PropertyForm - Estado de imágenes actualizado:", {
      'uploadedImages': validImages,
      'form.images': form.getValues('images')
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log("PropertyForm - onSubmit iniciado con datos:", data);
    
    // Validar ubicación antes de enviar
    console.log("PropertyForm - Validando ubicación...");
    console.log("PropertyForm - Estado de ubicación:", { location, address: data.address });
    
    // Para propiedades existentes, permitir usar la dirección del formulario si no hay ubicación en el hook
    const hasValidLocation = validateLocation() || (data.address && data.address.trim().length >= 5);
    
    if (!hasValidLocation) {
      console.log("PropertyForm - Validación de ubicación falló");
      toast({
        title: "Ubicación requerida",
        description: "Debe proporcionar una dirección válida para la propiedad.",
        variant: "destructive",
      });
      return;
    }
    console.log("PropertyForm - Validación de ubicación exitosa");

    // Obtener datos de ubicación y asegurar que hay dirección válida
    const locationData = getFormattedLocationData();
    console.log("PropertyForm - Datos de ubicación del hook:", locationData);
    
    if (locationData && locationData.address) {
      // Actualizar el formulario con la dirección final antes de validar
      form.setValue('address', locationData.address, { shouldValidate: false });
    }
    
    // Si no hay datos de ubicación del hook, usar los datos del formulario (para propiedades existentes)
    const finalLocationData = locationData || {
      address: data.address,
      location: initialLocationData ? {
        latitude: initialLocationData.latitude,
        longitude: initialLocationData.longitude
      } : null
    };
    
    console.log("PropertyForm - Datos de ubicación finales:", finalLocationData);

    // Verificar si hay imágenes sin subir
    console.log("PropertyForm - Verificando imágenes sin subir...");
    const uploadButton = document.querySelector('button[type="button"]');
    const hasUnuploadedImages = uploadButton && 
                               uploadButton.innerText.includes('Subir imágenes') && 
                               !uploadButton.disabled;
    
    console.log("PropertyForm - Estado de imágenes:", { 
      uploadButton: !!uploadButton, 
      hasUnuploadedImages,
      buttonText: uploadButton?.innerText,
      buttonDisabled: uploadButton?.disabled
    });
    
    if (hasUnuploadedImages) {
      console.log("PropertyForm - Hay imágenes sin subir, bloqueando submit");
      // Alertar al usuario
      toast({
        title: "Imágenes pendientes",
        description: "Hay imágenes sin subir. Por favor, sube las imágenes antes de guardar la propiedad.",
        variant: "warning",
      });
      
      // Hacer scroll hacia el componente de imágenes
      uploadButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    console.log("PropertyForm - Verificación de imágenes exitosa");
    
    // Log para depuración
    console.log("PropertyForm - Imágenes antes de guardar:", uploadedImages);
    console.log("PropertyForm - Ubicación antes de guardar:", finalLocationData);
    
    // IMPORTANTE: Sincronizar las imágenes con el form para garantizar coherencia
    form.setValue('images', uploadedImages);
    
    // Clean up empty strings for number fields
    const formattedData = {
      ...data,
      area: data.area === "" ? null : Number(data.area),
      land_area: data.land_area === "" ? null : Number(data.land_area),
      semi_covered_area: data.semi_covered_area === "" ? null : Number(data.semi_covered_area),
      rooms: data.rooms === "" ? null : Number(data.rooms),
      bathrooms: data.bathrooms === "" ? null : Number(data.bathrooms),
      price: Number(data.price),
      // CRÍTICO: Usar el estado local de imágenes para garantizar coherencia
      images: uploadedImages,
      // CRÍTICO: Generar property_images directamente de uploadedImages
      property_images: uploadedImages.map((url, index) => {
        // Validar que url sea un string no vacío
        if (!url || typeof url !== 'string') {
          console.warn("Imagen inválida detectada:", url);
          return null;
        }
        return {
          url: url,
          order: index,
          is_cover: index === 0 // La primera imagen es la portada
        };
      }).filter(Boolean), // Eliminar entradas nulas
      // Usar los datos de ubicación finales (hook o formulario)
      address: finalLocationData?.address || data.address,
      location: finalLocationData?.location || null
      // Nota: location_source no se envía a la BD ya que no existe esa columna
    };
    
    console.log("PropertyForm - onSubmit - formattedData:", {
      ...formattedData,
      totalImages: formattedData.images?.length || 0,
      totalPropertyImages: formattedData.property_images?.length || 0,
      imagesArray: formattedData.images,
      locationData: finalLocationData
    });
    
    console.log("PropertyForm - Llamando a onSave con datos formateados:", formattedData);
    
    if (onSave) {
      console.log("PropertyForm - onSave function encontrada, ejecutando...");
      onSave(formattedData);
      console.log("PropertyForm - onSave ejecutado exitosamente");
    } else {
      console.warn("PropertyForm: No onSave function provided");
    }
  }

  // Estilos comunes para inputs
  const inputStyles = "h-11 bg-background border-border rounded-md focus:border-brand-brown-500 focus:ring focus:ring-brand-brown-500/20 text-foreground placeholder:text-muted-foreground shadow-inner transition-colors"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-card border-border shadow-minimalist">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <span className="bg-brand-brown-500 w-1 h-5 mr-2 rounded-sm"></span>
                  Información General
                </h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Título</FormLabel>
                        <FormControl>
                        <Input 
                          placeholder="Título de la propiedad"
                          className={inputStyles}
                          {...field}
                        />
                        </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

              <div className="space-y-4">
                <FormLabel className="text-foreground">Ubicación</FormLabel>
                
                {/* Toggle para cambiar entre modos */}
                <LocationModeToggle 
                  mode={mode}
                  onModeChange={setMode}
                />
                
                {/* Modo de búsqueda automática */}
                {isSearchMode && (
                  <div className="space-y-2">
                    <div 
                      id="mapbox-geocoder" 
                      ref={geocoderContainerRef} 
                      className="mapboxgl-ctrl relative z-20"
                    ></div>
                  </div>
                )}
                
                {/* Modo de selección manual */}
                {isManualMode && (
                  <MapboxLocationPicker
                    onLocationSelect={handleManualLocationSelect}
                    initialLocation={location}
                    height="400px"
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage className="text-destructive" />
                      <Input 
                        type="hidden" 
                        {...field} 
                      />
                    </FormItem>
                  )}
                />
                
                {/* Mostrar ubicación actual si existe */}
                {location && location.latitude && location.longitude && (
                  <div className="mt-4 space-y-3 bg-muted p-3 rounded-md border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Ubicación seleccionada:</span>
                        {location.address && (
                          <span className="ml-2 text-muted-foreground">{location.address}</span>
                        )}
                      </p>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-brand-brown-600 capitalize">
                          {location.source === 'manual' ? 'Selección manual' : 'Búsqueda automática'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mapa estático para mostrar ubicación */}
                    {isSearchMode && (
                      <div 
                        ref={staticMapRef} 
                        className="w-full h-[150px] rounded-md overflow-hidden border border-border"
                      ></div>
                    )}
                  </div>
                )}
              </div>
              </div>
              
              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Tipo de propiedad</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary/20 text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-200 text-gray-900 shadow-lg">
                        <SelectItem value="house" className="hover:bg-primary/10 focus:bg-primary/10">Casa</SelectItem>
                        <SelectItem value="apartment" className="hover:bg-primary/10 focus:bg-primary/10">Departamento</SelectItem>
                        <SelectItem value="land" className="hover:bg-primary/10 focus:bg-primary/10">Terreno</SelectItem>
                        <SelectItem value="office" className="hover:bg-primary/10 focus:bg-primary/10">Oficina</SelectItem>
                        <SelectItem value="commercial" className="hover:bg-primary/10 focus:bg-primary/10">Local Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listing_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Tipo de operación</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary/20 text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors">
                          <SelectValue placeholder="Seleccionar operación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-200 text-gray-900 shadow-lg">
                        <SelectItem value="sale" className="hover:bg-primary/10 focus:bg-primary/10">Venta</SelectItem>
                        <SelectItem value="rent" className="hover:bg-primary/10 focus:bg-primary/10">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Precio (en USD)"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                      <FormLabel className="text-foreground">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                          placeholder="Descripción detallada de la propiedad"
                          className={`${inputStyles} min-h-32 resize-y`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-6 md:col-span-3">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <span className="bg-brand-brown-500 w-1 h-5 mr-2 rounded-sm"></span>
              Características
            </h3>
              </div>

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Área cubierta (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cubiertos (m²)"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="semi_covered_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Área semicubierta (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Semicubiertos (m²)"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="land_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Área del terreno (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Total (m²)"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Habitaciones</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cantidad de habitaciones"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Baños</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cantidad de baños"
                        className={inputStyles}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <div className="space-y-4 md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="has_garage"
                render={({ field }) => (
                      <FormItem className="flex p-3 space-x-3 space-y-0 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors shadow-inner">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="checkbox-minimalist"
                      />
                    </FormControl>
                        <FormLabel className="cursor-pointer text-foreground font-medium">Tiene garage</FormLabel>
                  </FormItem>
                )}
              />
                    
              <FormField
                control={form.control}
                name="has_pool"
                render={({ field }) => (
                      <FormItem className="flex p-3 space-x-3 space-y-0 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors shadow-inner">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="checkbox-minimalist"
                      />
                    </FormControl>
                        <FormLabel className="cursor-pointer text-foreground font-medium">Tiene piscina</FormLabel>
                  </FormItem>
                )}
              />
                    
              <FormField
                control={form.control}
                name="has_garden"
                render={({ field }) => (
                      <FormItem className="flex p-3 space-x-3 space-y-0 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors shadow-inner">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="checkbox-minimalist"
                      />
                    </FormControl>
                        <FormLabel className="cursor-pointer text-foreground font-medium">Tiene jardín</FormLabel>
                  </FormItem>
                )}
              />
            </div>

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-start p-3 space-x-3 space-y-0 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors mt-4 shadow-inner">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="checkbox-minimalist mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer text-foreground font-medium">Destacar propiedad</FormLabel>
                        <FormDescription className="text-gray-400">
                          Las propiedades destacadas aparecen en la página principal
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de imágenes */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <span className="bg-brand-brown-500 w-1 h-5 mr-2 rounded-sm"></span>
                  Imágenes
                </h3>
                <p className="text-sm text-gray-400">
                  Sube imágenes de la propiedad. La primera imagen será la principal en los listados.
                </p>
              </div>
              
              <PropertyImages 
                propertyId={initialData?.id || temporaryId}
                initialImages={uploadedImages}
                onUpdate={handleUpdateImages}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="h-12 px-8 btn-primary-minimal font-semibold shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

