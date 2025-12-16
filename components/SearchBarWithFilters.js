"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import FilterPanel from "./FilterPanel"

export default function SearchBarWithFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("alquilar")
  const [activeFilters, setActiveFilters] = useState([])
  const [openFilterPanel, setOpenFilterPanel] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Buscando:", searchTerm, "Tipo:", activeTab, "Filtros:", activeFilters)
    // Aquí iría la lógica para buscar propiedades
  }

  const toggleFilter = (filter) => {
    if (openFilterPanel === filter) {
      setOpenFilterPanel(null)
    } else {
      setOpenFilterPanel(filter)
    }
  }

  const closeFilterPanel = () => {
    setOpenFilterPanel(null)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative z-10 rounded-lg shadow-lg bg-white/90 p-4 backdrop-blur-sm">
        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Busca tu próximo hogar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-r-full transition-colors"
          >
            <Search className="h-6 w-6" />
          </button>
        </form>

        {/* Botones de tipo de búsqueda */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("alquilar")}
            className={`flex-1 py-3 px-4 rounded-md font-bold transition-colors ${
              activeTab === "alquilar" ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            QUIERO ALQUILAR
          </button>
          <button
            onClick={() => setActiveTab("comprar")}
            className={`flex-1 py-3 px-4 rounded-md font-bold transition-colors ${
              activeTab === "comprar" ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            QUIERO COMPRAR
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: "tipo", label: "Tipo de Propiedad" },
            { id: "ubicacion", label: "Ubicación" },
            { id: "precio", label: "Precio" },
            { id: "ambientes", label: "Ambientes" },
            { id: "expensas", label: "Expensas" },
            { id: "cochera", label: "Cochera" },
            { id: "antiguedad", label: "Antigüedad" },
          ].map((filter) => (
            <div key={filter.id} className="relative">
              <button
                onClick={() => toggleFilter(filter.id)}
                className={`w-full py-2 px-3 rounded-md text-center text-sm transition-colors ${
                  openFilterPanel === filter.id
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {filter.label}
              </button>

              <FilterPanel filterId={filter.id} isOpen={openFilterPanel === filter.id} onClose={closeFilterPanel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
