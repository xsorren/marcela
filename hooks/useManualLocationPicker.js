"use client"

import { useState, useCallback } from "react"

export function useManualLocationPicker(initialLocation = null) {
  console.log('useManualLocationPicker - initialLocation recibido:', initialLocation)
  
  const [location, setLocation] = useState(initialLocation)
  const [mode, setMode] = useState('search') // 'search' | 'manual'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  console.log('useManualLocationPicker - location state:', location)

  // Función para cambiar el modo de selección
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    setError(null)
    
    // Si cambiamos a modo manual y no hay ubicación, limpiar
    if (newMode === 'manual' && !location) {
      setLocation(null)
    }
  }, [location])

  // Función para manejar selección manual desde el mapa
  const handleManualLocationSelect = useCallback((locationData) => {
    if (!locationData) {
      setLocation(null)
      return
    }

    const { latitude, longitude, address, source } = locationData
    
    // Validar coordenadas
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      setError('Coordenadas inválidas')
      return
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setError('Coordenadas fuera de rango válido')
      return
    }

    setLocation({
      latitude,
      longitude,
      address: address || '',
      source: source || 'manual'
    })
    setError(null)
  }, [])

  // Función para manejar selección automática (geocoder)
  const handleAutomaticLocationSelect = useCallback((locationData) => {
    if (!locationData) {
      setLocation(null)
      return
    }

    const { latitude, longitude, address } = locationData
    
    setLocation({
      latitude,
      longitude,
      address: address || '',
      source: 'autocomplete'
    })
    setError(null)
  }, [])

  // Función para limpiar ubicación
  const clearLocation = useCallback(() => {
    setLocation(null)
    setError(null)
  }, [])

  // Función para validar ubicación antes de guardar
  const validateLocation = useCallback(() => {
    if (!location) {
      setError('Debe seleccionar una ubicación')
      return false
    }

    if (!location.latitude || !location.longitude) {
      setError('Ubicación incompleta')
      return false
    }

    if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      setError('Coordenadas inválidas')
      return false
    }

    // Para selección manual, si no hay dirección, generar una básica con coordenadas
    if (location.source === 'manual' && (!location.address || location.address.trim().length < 3)) {
      setLocation(prev => ({
        ...prev,
        address: `Ubicación: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
      }))
    }

    setError(null)
    return true
  }, [location])

  // Función para obtener datos formateados para el formulario
  const getFormattedLocationData = useCallback(() => {
    if (!location) return null

    // Asegurar que siempre hay una dirección válida
    let address = location.address || ''
    if (!address || address.trim().length < 3) {
      address = `Ubicación: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    }

    return {
      address,
      latitude: location.latitude,
      longitude: location.longitude,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      source: location.source || 'manual'
    }
  }, [location])

  return {
    // Estado
    location,
    mode,
    isLoading,
    error,
    
    // Acciones
    setMode: handleModeChange,
    handleManualLocationSelect,
    handleAutomaticLocationSelect,
    clearLocation,
    validateLocation,
    getFormattedLocationData,
    
    // Utilidades
    hasLocation: !!location,
    isManualMode: mode === 'manual',
    isSearchMode: mode === 'search'
  }
}