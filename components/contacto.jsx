"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle } from "lucide-react"

export default function ContactoPage() {
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })

  // ✅ ESTO ERA LO QUE FALTABA
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulario enviado:", formState)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormState({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      })
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Imagen a la izquierda */}
        <div className="w-full md:w-1/2">
          <img
            src="https://img.freepik.com/foto-gratis/familia-completa-lista-mudarse-nuevo-hogar_23-2149662423.jpg?t=st=1744386061~exp=1744389661~hmac=2cf43231e5d73ac2f327006a43ed2c35f68f1e54842629561c1b246fd7084a3e&w=826"
            alt="Familia mudándose"
            className="rounded-3xl w-full object-cover shadow-lg"
          />
        </div>

        {/* Formulario a la derecha */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-6 text-white">Contacto</h1>

          <div className="bg-[#242424] rounded-3xl p-6 mb-8">
            {!submitted ? (
              <>
                <p className="text-gray-300 mb-6">
                  Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formState.nombre}
                      onChange={handleChange}
                      required
                      className="bg-[#1a1a1a] border-[#333] text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="bg-[#1a1a1a] border-[#333] text-white"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="telefono" className="text-sm font-medium">
                        Teléfono (opcional)
                      </label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formState.telefono}
                        onChange={handleChange}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                        placeholder="+54 9 2227 53-6988"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="asunto" className="text-sm font-medium">
                      Asunto
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formState.asunto}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                    >
                      <option value="" disabled>
                        Selecciona un asunto
                      </option>
                      <option value="consulta">Consulta general</option>
                      <option value="propiedad">Consulta sobre una propiedad</option>
                      <option value="vender">Quiero vender mi propiedad</option>
                      <option value="soporte">Soporte técnico</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mensaje" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formState.mensaje}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#C9982C] hover:bg-[#b38a27] text-white h-12"
                    >
                      <div className="flex items-center justify-center gap-2 w-full">
                        <Send className="h-4 w-4" />
                        <span>Enviar mensaje</span>
                      </div>
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-[#1a1a1a] p-6 rounded-lg mb-4 w-full max-w-md">
                  <CheckCircle className="h-16 w-16 text-[#C9982C] mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">¡Mensaje enviado!</h2>
                  <p className="text-gray-400 mb-6">
                    Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.
                  </p>
                  <Button onClick={() => setSubmitted(false)} className="bg-[#C9982C] hover:bg-[#b38a27] text-white">
                    Enviar otro mensaje
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de contacto al final */}
      <div className="max-w-6xl mx-auto bg-[#242424] rounded-3xl p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">Información de contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#C9982C]">Oficina central</h3>
            <p className="text-gray-300">Av. Corrientes 1234, Piso 5</p>
            <p className="text-gray-300">Buenos Aires, Argentina</p>
            <p className="text-gray-300 mt-2">+54 9 2227 53-6988</p>
            <p className="text-gray-300">info@homever.com</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#C9982C]">Horario de atención</h3>
            <p className="text-gray-300">Lunes a Viernes: 9:00 - 18:00</p>
            <p className="text-gray-300">Sábados: 10:00 - 14:00</p>
            <p className="text-gray-300">Domingos: Cerrado</p>
          </div>
        </div>
      </div>
    </div>
  )
}