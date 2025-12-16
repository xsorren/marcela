"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertyDetailSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)

  const thumbnails = [
    {
      src: "/placeholder.svg?height=300&width=500",
      alt: "Terraza con tumbonas",
    },
    {
      src: "/placeholder.svg?height=300&width=500",
      alt: "Piscina exterior",
    },
    {
      src: "/placeholder.svg?height=300&width=500",
      alt: "Comedor interior",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: (currentSlide * sliderRef.current.offsetWidth) / thumbnails.length,
        behavior: "smooth",
      })
    }
  }, [currentSlide])

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Casa MG - Barrio Puertos</h1>
        <div className="text-xl font-bold text-amber-500">190.000 USD</div>
      </div>

      {/* Main Image */}
      <div className="p-2">
        <div className="rounded-lg overflow-hidden border-2 border-blue-500">
          <div className="relative aspect-video">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-03-30%20a%20la%28s%29%2010.36.31-JUZXNi9N5TwZA31pw0mTtc9dA7sgk7.png"
              alt="Casa MG - Vista principal"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail Slider */}
      <div className="relative px-2 pb-2">
        <div className="relative overflow-hidden">
          <div ref={sliderRef} className="flex transition-transform duration-300 ease-in-out gap-2">
            {thumbnails.map((img, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-1/3 rounded-lg overflow-hidden ${
                  currentSlide === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="relative aspect-video">
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    onClick={() => setCurrentSlide(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Slider Indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {thumbnails.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? "w-4 bg-blue-500" : "w-2 bg-gray-500"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Descripción</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full bg-zinc-800 border-amber-500">
              <Star className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="icon" className="rounded-full bg-zinc-800 border-amber-500">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-square-dashed"
            >
              <path d="M3 3h18v18H3V3z" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
            </svg>
            Lote 700 m²
          </div>

          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-home"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            300 m² cubiertos
          </div>

          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-calendar"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            Año 2023
          </div>

          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-bath"
            >
              <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
              <line x1="10" x2="8" y1="5" y2="7" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <line x1="7" x2="7" y1="19" y2="21" />
              <line x1="17" x2="17" y1="19" y2="21" />
            </svg>
            3 baños
          </div>

          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-car"
            >
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
              <circle cx="6.5" cy="16.5" r="2.5" />
              <circle cx="16.5" cy="16.5" r="2.5" />
            </svg>
            2 cocheras
          </div>

          <div className="rounded-full px-4 py-1.5 flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-sm">
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
              className="lucide lucide-bed"
            >
              <path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
              <path d="M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" />
              <path d="M2 12h20" />
              <path d="M4 9h16v3H4z" />
            </svg>
            3 dormitorios
          </div>
        </div>

        {/* Description Text */}
        <p className="text-gray-300 mb-4 text-sm">
          Descubre esta impresionante villa de estilo mediterráneo, donde la arquitectura tradicional se fusiona con un
          diseño contemporáneo y materiales naturales. Ubicada en un entorno paradisíaco, esta propiedad ofrece una
          experiencia única de confort y elegancia.
        </p>

        <ul className="space-y-2 mb-4 text-gray-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-amber-500">✓</span>
            Diseño de inspiración ibicenca con muros blancos y detalles en madera rústica.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">✓</span>
            Amplia terraza y pérgola de madera ideales para disfrutar de veladas al aire libre.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">✓</span>
            Ambientes abiertos y luminosos con integración fluida entre interior y exterior.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">✓</span>
            Decoración cálida y sofisticada, con mobiliario en tonos naturales y detalles artesanales.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500">✓</span>
            Jardín exuberante con buganvillas en flor, aportando un toque vibrante y tropical.
          </li>
        </ul>

        <p className="text-gray-300 mb-4 text-sm">
          Un refugio perfecto para quienes buscan exclusividad, serenidad y un estilo de vida en armonía con la
          naturaleza.
        </p>

        <p className="text-center text-gray-300 mb-4 text-sm">
          🏠 ¡Consulta ahora para más información o agendar una visita! 🏠
        </p>
      </div>
    </div>
  )
}

