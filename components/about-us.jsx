'use client'

import { useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import ScrollReveal from "./ScrollReveal"

export default function AboutUs() {
  const titleRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  
  useEffect(() => {
    const title = titleRef.current
    const image = imageRef.current
    const text = textRef.current
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    )
    
    if (title) observer.observe(title)
    if (image) observer.observe(image)
    if (text) observer.observe(text)
    
    return () => {
      if (title) observer.unobserve(title)
      if (image) observer.unobserve(image)
      if (text) observer.unobserve(text)
    }
  }, [])

  return (
    <div className="bg-neutral-50 py-20 relative overflow-hidden">
      {/* Elegant separator */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8A2F4C] to-transparent mb-16"></div>
        <div className="flex justify-center -mt-3 mb-16">
        </div>
      </div>
      
      {/* Decorative elements - Subtle and modern */}
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-brand-brown-100 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-brand-green-100 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-heading font-bold text-neutral-800 mb-12 brand-accent-line">Sobre nosotros y nuestros servicios</h2>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image */}
          <div className="w-full lg:w-1/3">
            <ScrollReveal delay={100}>
              <div ref={imageRef} className="reveal-section">
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-minimalist-hover transform transition-all duration-300 hover:translate-y-[-2px]">
                  <Image 
                    src="/images/keys-image.png" 
                    alt="Llaves de propiedad" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105" 
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent"></div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Content */}
          <div className="w-full lg:w-2/3">
            <ScrollReveal delay={200}>
              <div ref={textRef} className="reveal-section">
                <div className="text-neutral-700 space-y-6 p-8 bg-white rounded-2xl shadow-minimalist border border-neutral-100">
                  <p className="text-lg leading-relaxed">
                    En nuestra inmobiliaria, nos especializamos en la venta, alquiler y gestión de propiedades, brindando un servicio
                    personalizado y transparente para que cada cliente encuentre la opción ideal. Nuestro equipo de expertos
                    te acompaña en cada etapa del proceso, desde la búsqueda y asesoramiento hasta la firma del contrato.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Además, ofrecemos servicios de tasación, marketing inmobiliario, home staging y gestión legal,
                    asegurando transacciones seguras y eficientes. Con un profundo conocimiento del mercado,
                    trabajamos para hacer de tu experiencia inmobiliaria algo ágil, seguro y exitoso.
                  </p>

                  <div className="flex items-center p-4 bg-brand-green-50 rounded-xl border-l-4 border-brand-green-500">
                    <span className="mr-3 text-brand-green-500 text-xl">📋</span>
                    <p className="text-lg font-medium text-brand-green-700">Contáctanos y encuentra la propiedad que buscas!</p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/contacto"
                      className="inline-block px-8 py-4 border-2 border-brand-brown-500 text-brand-brown-500 font-semibold shadow-minimalist rounded-xl hover:bg-brand-brown-500 hover:text-white transition-all duration-200 transform hover:scale-105"
                    >
                      CONTÁCTANOS
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}

