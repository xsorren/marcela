"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertyForm() {
  const [selectedImages, setSelectedImages] = useState([])

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Form Section */}
      <div className="flex-1 bg-zinc-900 text-white p-6 md:p-10">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Quiero vender mi propiedad</h1>
          <p className="text-gray-300 mb-8">
            Completa este formulario y un vendedor se comunicará contigo a la brevedad para continuar con el proceso
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="text-sm mb-1 block">
                Nombre y Apellido (*)
              </label>
              <Input id="name" required className="bg-zinc-800 border-zinc-700 text-white" />
            </div>

            <div>
              <label htmlFor="email" className="text-sm mb-1 block">
                Tu Email (*)
              </label>
              <Input id="email" type="email" required className="bg-zinc-800 border-zinc-700 text-white" />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm mb-1 block">
                Tu número de teléfono (*)
              </label>
              <Input id="phone" type="tel" required className="bg-zinc-800 border-zinc-700 text-white" />
            </div>

            <div>
              <label htmlFor="location" className="text-sm mb-1 block">
                Localidad / Provincia
              </label>
              <Input id="location" className="bg-zinc-800 border-zinc-700 text-white" />
            </div>

            <div>
              <label htmlFor="description" className="text-sm mb-1 block">
                Describí tu propiedad
              </label>
              <Textarea
                id="description"
                placeholder="Escribe aquí datos de interés..."
                className="bg-zinc-800 border-zinc-700 text-white min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Tipo de propiedad</label>
                <Select>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="local">Local comercial</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-1 block">Imágenes de la propiedad</label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-between w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md cursor-pointer"
                  >
                    <span className="text-gray-300">JPG...</span>
                    <Upload className="h-4 w-4 text-gray-300" />
                  </label>
                </div>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="border border-zinc-700 rounded-md p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-400">Image0{index + 1}...</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Enviar formulario
            </Button>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-2/5 bg-cover bg-center relative">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-03-27%20a%20la%28s%29%2016.28.07-C4jx7UlqmHyTh2UXKt33ELn1zYmgZm.png"
          alt="Pareja con llaves de nueva propiedad"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

