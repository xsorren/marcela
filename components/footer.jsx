"use client"

import Link from "next/link"
import { Facebook, Instagram, Send, Twitter } from "lucide-react"
// ========================================
// 🎄 HOLIDAY MODE - Imports
// ========================================
import { isHolidayModeActive } from "@/config/features"
import { Sparkles } from "lucide-react"
// ========================================

export default function Footer() {
  // ========================================
  // 🎄 HOLIDAY MODE - State
  // ========================================
  const showHoliday = isHolidayModeActive()
  // ========================================
  return (
    <footer className="bg-gradient-to-b from-neutral-50 to-white border-t border-neutral-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8A2F4C] via-[#606648] to-[#8A2F4C]"></div>
      <div className="absolute top-[20%] right-[-10%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-brand-brown-100 to-brand-brown-200 blur-3xl opacity-30"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[150px] h-[150px] rounded-full bg-gradient-to-br from-brand-green-100 to-brand-green-200 blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
        {/* Enhanced separator line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#8A2F4C] to-transparent mb-12 rounded-full shadow-glow-brown"></div>

        {/* Grid container with enhanced spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 - About with hover effects */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4 transition-colors group-hover:text-brand-brown-600">
              Acerca de
            </h3>
            <div className="flex flex-col space-y-3">
              <Link href="/servicios" className="text-neutral-600 hover:text-brand-brown-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Nuestros Servicios
              </Link>
              <Link href="/sobre-nosotros" className="text-neutral-600 hover:text-brand-brown-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Sobre nosotros
              </Link>
            </div>
          </div>

          {/* Column 2 - Services with hover effects */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4 transition-colors group-hover:text-brand-green-600">
              Propiedades
            </h3>
            <div className="flex flex-col space-y-3">
              <Link href="/listado" className="text-neutral-600 hover:text-brand-green-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Comprar
              </Link>
              <Link href="/listado" className="text-neutral-600 hover:text-brand-green-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Alquilar
              </Link>
            </div>
          </div>

          {/* Column 3 - Legal with hover effects */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4 transition-colors group-hover:text-brand-brown-600">
              Legal
            </h3>
            <div className="flex flex-col space-y-3">
              <Link href="/contacto" className="text-neutral-600 hover:text-brand-brown-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Contacto
              </Link>
              <Link href="/terminos-y-condiciones" className="text-neutral-600 hover:text-brand-brown-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Términos y Condiciones
              </Link>
              <Link href="/politicas-de-privacidad" className="text-neutral-600 hover:text-brand-brown-500 transition-all duration-300 font-medium hover:translate-x-1 hover:shadow-sm">
                Políticas de Privacidad
              </Link>
            </div>
          </div>

          {/* Column 4 - Enhanced Social Media */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-semibold text-neutral-800 mb-4">
              Síguenos
            </h3>
            <div className="flex space-x-4">
              <Link 
                href="https://www.instagram.com/negocios.inmobiliarios.ms/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="group p-4 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl hover:border-brand-green-500 hover:bg-white shadow-card hover:shadow-glow-green transition-all duration-300 transform-gpu hover:scale-110 hover:rotate-3"
              >
                <Instagram className="w-6 h-6 text-neutral-600 group-hover:text-brand-green-500 transition-all duration-300 group-hover:scale-110" />
              </Link>
              {/* Future social media links */}
              <div className="group p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-200 rounded-xl opacity-50 cursor-not-allowed">
                <Facebook className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="group p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-200 rounded-xl opacity-50 cursor-not-allowed">
                <Twitter className="w-6 h-6 text-neutral-400" />
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Próximamente en más redes sociales
            </p>
          </div>
        </div>

        {/* ========================================
            🎄 HOLIDAY MODE - Mensaje festivo
            ======================================== */}
        {showHoliday && (
          <div className="mt-12 mb-8">
            <div className="bg-gradient-to-r from-holiday-champagne via-holiday-cream to-holiday-champagne border border-holiday-gold/30 rounded-2xl p-6 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-holiday-gold" />
                <h4 className="text-xl font-heading font-semibold text-gray-800">
                  ¡Felices Fiestas!
                </h4>
                <Sparkles className="h-5 w-5 text-holiday-gold" />
              </div>
              <p className="text-gray-600 font-medium">
                De parte de todo el equipo de HomeVer, te deseamos unas felices fiestas y un próspero año nuevo.
              </p>
            </div>
          </div>
        )}
        {/* ======================================== */}

        {/* Enhanced bottom section */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-neutral-300 to-transparent flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-neutral-500 text-sm font-medium flex items-center space-x-2">
            <span>© 2024 Inmobiliaria Profesional.</span>
            <span className="hidden md:inline">Todos los derechos reservados.</span>
          </div>
          <div className="text-neutral-400 text-sm flex items-center space-x-1">
            <span>Lautaro Sorrentino</span>
          </div>
        </div>
        
        {/* Final decorative line */}
        <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-[#8A2F4C] to-transparent"></div>
      </div>
    </footer>
  )
}

