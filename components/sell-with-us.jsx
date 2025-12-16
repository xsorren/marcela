'use client'

import { useRef, useEffect } from "react"
import Link from "next/link"
import ScrollReveal from "./ScrollReveal"

export default function AboutUs() {
  const titleRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const title = titleRef.current
    const items = itemsRef.current

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
    items.forEach(item => {
      if (item) observer.observe(item)
    })

    return () => {
      if (title) observer.unobserve(title)
      items.forEach(item => {
        if (item) observer.unobserve(item)
      })
    }
  }, [])

  return (
    <div
      className="mx-auto px-4 sm:px-8 md:px-12 py-20 w-full bg-white"
    >
      <ScrollReveal>
        <h2 ref={titleRef} className="text-5xl font-heading font-bold text-neutral-800 mb-6 text-center">Sobre nosotros</h2>

        <div className="w-20 h-1 bg-brand-brown-500 mx-auto mb-8 rounded-full"></div>

        <p className="text-neutral-600 mb-12 text-lg text-center max-w-3xl mx-auto leading-relaxed">
          Soy Marcela Sosa, Martillero Público y corredor inmobiliario, fundadora de Marcela Sosa Negocios Inmobiliarios.
          Una nueva opción, que nace, para llevar adelante operaciones inmobiliarias en la ciudad de Navarro y la zona.
          Mi premisa es ofrecer un servicio integral en los procesos de compra, venta, evaluación, tasación o administración de propiedades, con un vínculo personalizado y a la medida de cada cliente.
        </p>

        <h3 className="text-neutral-700 text-2xl font-medium mb-10 text-center">Servicios profesionales</h3>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
          <div
            ref={el => itemsRef.current[0] = el}
            className="reveal-section bg-neutral-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <h4 className="text-brand-brown-600 font-bold text-xl mb-4">Compra y Venta de Propiedades</h4>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Acompaño a mis clientes en todo el proceso de compra y venta, desde la búsqueda inicial hasta
              la escrituración, garantizando operaciones seguras y transparentes.
            </p>
          </div>

          <div
            ref={el => itemsRef.current[1] = el}
            className="reveal-section bg-neutral-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ transitionDelay: '100ms' }}
          >
            <h4 className="text-brand-brown-600 font-bold text-xl mb-4">Tasaciones Profesionales</h4>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Realizo tasaciones precisas y actualizadas de propiedades, considerando las condiciones del mercado
              y las características específicas de cada inmueble.
            </p>
          </div>

          <div
            ref={el => itemsRef.current[2] = el}
            className="reveal-section bg-neutral-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ transitionDelay: '200ms' }}
          >
            <h4 className="text-brand-brown-600 font-bold text-xl mb-4">Alquileres y Administración</h4>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Gestiono contratos de alquiler y administración de propiedades, ocupándome de todos los aspectos
              legales y administrativos para propietarios e inquilinos.
            </p>
          </div>

          <div
            ref={el => itemsRef.current[3] = el}
            className="reveal-section bg-neutral-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            style={{ transitionDelay: '300ms' }}
          >
            <h4 className="text-brand-brown-600 font-bold text-xl mb-4">Asesoramiento Personalizado</h4>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Brindo asesoramiento integral sobre inversiones inmobiliarias, análisis de mercado y estrategias
              para maximizar el rendimiento de las propiedades.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-neutral-600 mb-6 text-lg leading-relaxed">
            Mi compromiso es ofrecer un servicio de excelencia, basado en la confianza, profesionalismo y
            atención personalizada que cada cliente merece en sus operaciones inmobiliarias.
          </p>

          <p className="text-neutral-600 mb-10 flex items-center justify-center text-lg">
            <span className="mr-3 text-2xl">🏠</span> Contactame para una consulta personalizada y descubrí cómo puedo ayudarte.
          </p>

          <Link
            href="/contacto"
            className="inline-block px-10 py-4 bg-brand-brown-500 text-white font-medium rounded-xl hover:bg-brand-brown-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            CONTACTAR
          </Link>
        </div>
      </ScrollReveal>
    </div>
  )
}