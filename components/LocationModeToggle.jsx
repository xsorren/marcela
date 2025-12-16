"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Map } from "lucide-react"

export default function LocationModeToggle({ 
  mode = 'search', 
  onModeChange,
  className = "" 
}) {
  const [activeMode, setActiveMode] = useState(mode)

  const handleModeChange = (newMode) => {
    setActiveMode(newMode)
    if (onModeChange) {
      onModeChange(newMode)
    }
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-3">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={activeMode === 'search' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('search')}
            className={`flex-1 ${
              activeMode === 'search' 
                ? 'bg-brand-brown-500 hover:bg-brand-brown-600 text-white' 
                : 'hover:bg-brand-brown-50 hover:text-brand-brown-700'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Búsqueda automática
          </Button>
          
          <Button
            type="button"
            variant={activeMode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeChange('manual')}
            className={`flex-1 ${
              activeMode === 'manual' 
                ? 'bg-brand-brown-500 hover:bg-brand-brown-600 text-white' 
                : 'hover:bg-brand-brown-50 hover:text-brand-brown-700'
            }`}
          >
            <Map className="h-4 w-4 mr-2" />
            Selección manual
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {activeMode === 'search' 
            ? 'Busca la dirección usando el autocompletado'
            : 'Marca la ubicación directamente en el mapa'
          }
        </div>
      </CardContent>
    </Card>
  )
}