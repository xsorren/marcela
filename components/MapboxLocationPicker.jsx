"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, RotateCcw } from "lucide-react"

import "mapbox-gl/dist/mapbox-gl.css"

export default function MapboxLocationPicker({
    onLocationSelect,
    initialLocation = null,
    height = "400px",
    className = ""
}) {
    const mapContainerRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markerRef = useRef(null)

    const [selectedLocation, setSelectedLocation] = useState(() => {
        // Validar ubicación inicial
        if (initialLocation &&
            typeof initialLocation.latitude === 'number' &&
            typeof initialLocation.longitude === 'number' &&
            !isNaN(initialLocation.latitude) &&
            !isNaN(initialLocation.longitude)) {
            return initialLocation
        }
        return null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState("")

    // Función para validar ubicación
    const isValidLocation = (location) => {
        return location &&
            typeof location.latitude === 'number' &&
            typeof location.longitude === 'number' &&
            !isNaN(location.latitude) &&
            !isNaN(location.longitude) &&
            location.latitude >= -90 && location.latitude <= 90 &&
            location.longitude >= -180 && location.longitude <= 180
    }

    // Función para obtener dirección desde coordenadas (reverse geocoding)
    const reverseGeocode = async (longitude, latitude) => {
        if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) return ""

        try {
            setIsLoading(true)
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&country=ar&language=es`
            )
            const data = await response.json()

            if (data.features && data.features.length > 0) {
                return data.features[0].place_name
            }
            return ""
        } catch (error) {
            console.error("Error en reverse geocoding:", error)
            return ""
        } finally {
            setIsLoading(false)
        }
    }

    // Función para manejar click en el mapa
    const handleMapClick = async (e) => {
        if (!e.lngLat) {
            console.error('No se pudieron obtener las coordenadas del click')
            return
        }

        const { lng, lat } = e.lngLat

        // Validar coordenadas antes de proceder
        if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
            console.error('Coordenadas inválidas del click:', { lng, lat })
            return
        }

        // Actualizar marcador
        if (markerRef.current) {
            markerRef.current.remove()
        }

        markerRef.current = new mapboxgl.Marker({
            color: "#D4AF37",
            draggable: true
        })
            .setLngLat([lng, lat])
            .addTo(mapInstanceRef.current)

        // Manejar arrastre del marcador
        markerRef.current.on('dragend', async () => {
            const lngLat = markerRef.current.getLngLat()
            if (lngLat && typeof lngLat.lng === 'number' && typeof lngLat.lat === 'number') {
                await updateLocation(lngLat.lng, lngLat.lat)
            }
        })

        await updateLocation(lng, lat)
    }

    // Función para actualizar ubicación
    const updateLocation = async (longitude, latitude) => {
        // Validar que las coordenadas sean números válidos
        if (typeof longitude !== 'number' || typeof latitude !== 'number' ||
            isNaN(longitude) || isNaN(latitude)) {
            console.error('Coordenadas inválidas:', { longitude, latitude })
            return
        }

        const location = { latitude, longitude }
        console.log('MapboxLocationPicker - Actualizando ubicación:', location)
        setSelectedLocation(location)

        // Obtener dirección aproximada
        const address = await reverseGeocode(longitude, latitude)
        setReverseGeocodedAddress(address)

        // Si no se pudo obtener dirección, usar coordenadas como fallback
        const finalAddress = address || `Ubicación: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

        // Notificar al componente padre
        if (onLocationSelect) {
            onLocationSelect({
                ...location,
                address: finalAddress,
                source: 'manual'
            })
        }
    }

    // Función para resetear ubicación
    const handleReset = () => {
        if (markerRef.current) {
            markerRef.current.remove()
            markerRef.current = null
        }

        setSelectedLocation(null)
        setReverseGeocodedAddress("")

        if (onLocationSelect) {
            onLocationSelect(null)
        }
    }

    // Inicializar mapa
    useEffect(() => {
        if (!mapContainerRef.current) return

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

        // Limpiar instancia previa
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
            mapInstanceRef.current = null
        }

        // Debug: verificar initialLocation
        console.log('MapboxLocationPicker - initialLocation:', initialLocation)
        console.log('MapboxLocationPicker - isValidLocation(initialLocation):', isValidLocation(initialLocation))
        
        // Determinar centro del mapa
        const mapCenter = isValidLocation(initialLocation) 
            ? [initialLocation.longitude, initialLocation.latitude]
            : [-58.3816, -34.6037] // Buenos Aires por defecto
            
        const mapZoom = isValidLocation(initialLocation) ? 15 : 10
        
        console.log('MapboxLocationPicker - mapCenter:', mapCenter)
        console.log('MapboxLocationPicker - mapZoom:', mapZoom)
        
        // Crear mapa centrado en Buenos Aires por defecto (más fácil para navegar)
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: mapCenter,
            zoom: mapZoom,
            interactive: true
        })

        mapInstanceRef.current = map

        // Agregar controles de navegación
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')

        // Manejar clicks en el mapa
        map.on('click', handleMapClick)

        // Si hay ubicación inicial válida, agregar marcador
        if (isValidLocation(initialLocation)) {
            markerRef.current = new mapboxgl.Marker({
                color: "#D4AF37",
                draggable: true
            })
                .setLngLat([initialLocation.longitude, initialLocation.latitude])
                .addTo(map)

            // Manejar arrastre del marcador inicial
            markerRef.current.on('dragend', async () => {
                const lngLat = markerRef.current.getLngLat()
                if (lngLat && typeof lngLat.lng === 'number' && typeof lngLat.lat === 'number') {
                    await updateLocation(lngLat.lng, lngLat.lat)
                }
            })

            setSelectedLocation(initialLocation)
            // Obtener dirección para ubicación inicial
            reverseGeocode(initialLocation.longitude, initialLocation.latitude)
                .then(setReverseGeocodedAddress)
                .catch(error => {
                    console.error('Error obteniendo dirección inicial:', error)
                    setReverseGeocodedAddress('')
                })
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
            if (markerRef.current) {
                markerRef.current.remove()
                markerRef.current = null
            }
        }
    }, []) // Solo ejecutar una vez al montar

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Instrucciones */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Haz click en el mapa para marcar la ubicación</span>
                </div>

                {isValidLocation(selectedLocation) && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs"
                    >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Mapa */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div
                        ref={mapContainerRef}
                        style={{ height }}
                        className="w-full cursor-crosshair"
                    />
                </CardContent>
            </Card>

            {/* Información de ubicación seleccionada */}
            {selectedLocation && selectedLocation.latitude != null && selectedLocation.longitude != null && (
                <Card className="bg-muted/50">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    Ubicación seleccionada
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {selectedLocation?.latitude?.toFixed(6) || '0.000000'}, {selectedLocation?.longitude?.toFixed(6) || '0.000000'}
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="text-sm text-muted-foreground">
                                    Obteniendo dirección...
                                </div>
                            ) : reverseGeocodedAddress ? (
                                <div className="text-sm text-foreground">
                                    <span className="font-medium">Dirección aproximada:</span>
                                    <br />
                                    {reverseGeocodedAddress}
                                </div>
                            ) : selectedLocation ? (
                                <div className="text-sm text-foreground">
                                    <span className="font-medium">Ubicación seleccionada:</span>
                                    <br />
                                    <span className="text-muted-foreground">
                                        Coordenadas: {selectedLocation?.latitude?.toFixed(4) || '0.0000'}, {selectedLocation?.longitude?.toFixed(4) || '0.0000'}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Haz click en el mapa para seleccionar ubicación
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}