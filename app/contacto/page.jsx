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
    <div className="min-h-screen bg-neutral-50 text-neutral-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <h1 className="text-5xl font-heading font-bold text-neutral-800 mb-4 text-center">Contacto</h1>
        <div className="w-20 h-1 bg-brand-brown-500 mx-auto mb-12 rounded-full"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Información de contacto a la izquierda */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200 h-fit sticky top-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-neutral-800">Información de contacto</h2>
              
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-brand-brown-600">Contacto</h3>
                  <div className="space-y-1 text-neutral-600">
                    <p>+54 11 5678-9012</p>
                    <p>info@marcelasosa.com</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-brand-brown-600">Horario de atención</h3>
                  <div className="space-y-1 text-neutral-600">
                    <p>Lunes a Viernes: 9:00 - 18:00</p>
                    <p>Sábados: 10:00 - 14:00</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-neutral-200">
              {!submitted ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4 text-neutral-800">Envíanos un mensaje</h2>
                    <p className="text-neutral-600 text-lg leading-relaxed">
                      Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="nombre" className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                          Nombre completo
                        </label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formState.nombre}
                          onChange={handleChange}
                          required
                          className="h-12 bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-brand-brown-500 focus:ring-brand-brown-500 rounded-lg text-lg"
                          placeholder="Tu nombre completo"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="h-12 bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-brand-brown-500 focus:ring-brand-brown-500 rounded-lg text-lg"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="telefono" className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                          Teléfono (opcional)
                        </label>
                        <Input
                          id="telefono"
                          name="telefono"
                          value={formState.telefono}
                          onChange={handleChange}
                          className="h-12 bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-brand-brown-500 focus:ring-brand-brown-500 rounded-lg text-lg"
                          placeholder="+54 9 2227 53-6988"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="asunto" className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                          Asunto
                        </label>
                        <select
                          id="asunto"
                          name="asunto"
                          value={formState.asunto}
                          onChange={handleChange}
                          required
                          className="h-12 w-full bg-neutral-50 border border-neutral-300 rounded-lg px-4 text-neutral-800 focus:border-brand-brown-500 focus:ring-brand-brown-500 text-lg"
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
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mensaje" className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                        Mensaje
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formState.mensaje}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-4 text-neutral-800 focus:border-brand-brown-500 focus:ring-brand-brown-500 resize-none text-lg"
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                    </div>

                    <div className="pt-6">
                      <Button type="submit" className="w-full lg:w-auto lg:px-12 h-14 bg-brand-brown-500 hover:bg-brand-brown-600 text-white text-lg font-semibold flex items-center justify-center gap-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                        <Send className="h-5 w-5" />
                        Enviar mensaje
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-12 rounded-2xl mb-4 w-full max-w-lg border border-neutral-200 shadow-inner">
                    <CheckCircle className="h-20 w-20 text-brand-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-heading font-bold mb-3 text-neutral-800">¡Mensaje enviado!</h2>
                    <p className="text-neutral-600 mb-8 text-lg">
                      Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.
                    </p>
                    <Button onClick={() => setSubmitted(false)} className="bg-brand-brown-500 hover:bg-brand-brown-600 text-white rounded-lg px-8 py-3 text-lg font-semibold">
                      Enviar otro mensaje
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}