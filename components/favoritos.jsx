import { Heart, Home, List, LogOut, Menu, MessageSquare, Settings, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function FavoritesDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-[#333] bg-[#1a1a1a] px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-sm bg-[#1a1a1a] text-white border-[#333]">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Home className="h-6 w-6" />
                <span className="font-bold">Homever</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
              >
                <Home className="h-5 w-5" />
                Inicio
              </Link>
              <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#d4af37] transition-all">
                <Heart className="h-5 w-5" />
                Favoritos
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
              >
                <MessageSquare className="h-5 w-5" />
                Mensajes
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
              >
                <User className="h-5 w-5" />
                Perfil
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
              >
                <Settings className="h-5 w-5" />
                Configuración
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-xl">
          <Home className="h-6 w-6" />
          <span className="font-bold">Homever</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden text-white hover:bg-[#333]">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  width={32}
                  height={32}
                  alt="Avatar"
                  className="rounded-full"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] text-white border-[#333]">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#333]" />
              <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333]" />
              <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-[#333] bg-[#1a1a1a] md:block">
          <nav className="grid gap-6 p-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
            >
              <Home className="h-5 w-5" />
              Inicio
            </Link>
            <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#d4af37] transition-all">
              <Heart className="h-5 w-5" />
              Favoritos
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
            >
              <MessageSquare className="h-5 w-5" />
              Mensajes
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
            >
              <User className="h-5 w-5" />
              Perfil
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-[#d4af37]"
            >
              <Settings className="h-5 w-5" />
              Configuración
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Mis Propiedades Favoritas</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
              >
                <List className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
                  >
                    Ordenar por
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] text-white border-[#333]">
                  <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">Precio: Menor a Mayor</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">Precio: Mayor a Menor</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">Más recientes</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#333] focus:bg-[#333]">Más antiguos</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={{
                  ...property,
                  featured: index === 1 || index === 7,
                  highlighted: index === 0,
                }}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#333] bg-[#333] text-white hover:bg-[#444] hover:text-white"
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              4
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

function PropertyCard({ property }) {
  // Validar que property sea un objeto válido
  if (!property || typeof property !== "object") {
    console.warn("PropertyCard: Se recibió una propiedad inválida")
    return (
      <div className="relative flex flex-col overflow-hidden min-h-[450px] w-[411px] bg-[#242424]">
        <div className="flex items-center justify-center h-full">
          <p className="text-white">Datos no disponibles</p>
        </div>
      </div>
    )
  }

  const {
    id,
    image,
    price = "0",
    location = "No disponible",
    coveredArea = property.area || "0",
    semi_covered_area = property.semi_covered_area || "0",
    rooms = property.rooms || "0",
    bathrooms = property.bathrooms || "0",
    agent = { name: property.seller || "No disponible", avatar: "/placeholder.svg?height=40&width=40" },
    destacado = property.featured || false,
  } = property

  return (
    <div
      className={`relative flex flex-col overflow-hidden min-h-[450px] w-full ${destacado ? "bg-[#C9982C]" : "bg-[#242424]"}`}
      style={{
        borderTopLeftRadius: "65px",
        borderTopRightRadius: "65px",
        borderBottomLeftRadius: "65px",
        borderBottomRightRadius: "0",
      }}
    >
      {/* Imagen de la propiedad */}
      <div className="relative w-full h-56">
        <Image
          src={image || "/placeholder.svg?height=200&width=300"}
          alt={`Propiedad en ${location}`}
          fill
          className="object-cover"
        />
        {/* Botón de favorito */}
        <button className="absolute top-3 right-3 p-1 rounded-full bg-black/50 text-white hover:bg-black/70">
          <Star className="w-5 h-5" />
        </button>
      </div>

      {/* Información de la propiedad */}
      <div className="p-4 flex-grow">
        {/* Precio */}
        <h3 className={`text-2xl font-bold ${destacado ? "text-[#ffff]" : "text-[#C9982C]"} mb-2`}>{price} USD</h3>

        {/* Ubicación */}
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1 text-white text-lg font-medium">{location}</span>
        </div>

        {/* Detalles de la propiedad */}
        <div className="space-y-0.5 text-white text-sm">
          <p>{coveredArea} m2 cubiertos</p>
          <p>{semi_covered_area} m2 semi-cubiertos</p>
          <p>{rooms} ambientes</p>
          <p>{bathrooms} baños</p>
        </div>
      </div>

      {/* Información del vendedor y etiqueta destacada */}
      <div className={`p-4 flex items-center ${destacado ? "justify-between" : "justify-end"}`}>
        {destacado && (
          <div>
            <span className="font-bold text-white text-lg">DESTACADA</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="text-right mr-2">
            <p className="text-white text-sm">{agent.name}</p>
            <p className="text-white text-xs font-bold">VENDEDOR</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={agent.avatar || "/placeholder.svg?height=40&width=40"}
              alt={agent.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const properties = [
  {
    id: 1,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 2,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 3,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 4,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 5,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 6,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 7,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 8,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
  {
    id: 9,
    title: "Casa moderna con cocina integrada",
    location: "Pilar",
    price: "90.000 USD",
    rooms: 5,
    bathrooms: 2,
    area: 190,
    semi_covered_area: 40,
    image: "/placeholder.svg?height=200&width=300",
    seller: "Carlos Perez",
  },
]
