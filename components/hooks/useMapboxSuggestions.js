import { useState } from "react";

export default function useMapboxSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
        'pk.eyJ1IjoiaG9tZXZlciIsImEiOiJjbG84ejV6b3QwMGJuMmpvM3kwNzR3ZjBqIn0.JKAFJ4ixzUPq1Jvb_Z5i4A';
      if (!mapboxToken) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
      const params = new URLSearchParams({
        access_token: mapboxToken,
        country: 'ar',
        types: 'place,locality,neighborhood,address,poi',
        proximity: '-58.3816,-34.6037',
        language: 'es',
        limit: 5
      });
      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error(`Error en Mapbox: ${response.status}`);
      const data = await response.json();
      if (data?.features?.length) {
        const mapped = data.features.map(feature => ({
          id: feature.id,
          text: feature.place_name_es || feature.place_name,
          place_type: feature.place_type[0],
          coordinates: feature.center
        }));
        setSuggestions(mapped);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    fetchSuggestions
  };
} 