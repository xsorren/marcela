"use client"

import { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"
import { HOLIDAY_CONFIG } from "@/config/features"

export default function HolidayBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya cerró el banner
    const dismissed = localStorage.getItem('holiday-banner-dismissed-2025')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    if (!HOLIDAY_CONFIG.bannerDismissible) return
    
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('holiday-banner-dismissed-2025', 'true')
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`holiday-banner fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-gradient-to-r from-holiday-champagne via-holiday-cream to-holiday-champagne border-b-2 border-holiday-gold/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 md:py-3.5">
            {/* Icono decorativo */}
            <Sparkles className="hidden sm:block h-5 w-5 text-holiday-gold flex-shrink-0" />
            
            {/* Mensaje */}
            <div className="flex-1 flex items-center justify-center px-4">
              <p className="text-sm md:text-base font-medium text-gray-800 text-center">
                <span className="hidden sm:inline">{HOLIDAY_CONFIG.bannerMessage}</span>
                <span className="sm:hidden">✨ Felices Fiestas 2025 ✨</span>
              </p>
            </div>
            
            {/* Botón cerrar */}
            {HOLIDAY_CONFIG.bannerDismissible && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-holiday-gold/20 transition-colors"
                aria-label="Cerrar banner"
              >
                <X className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              </button>
            )}
            
            {!HOLIDAY_CONFIG.bannerDismissible && (
              <div className="w-5 flex-shrink-0" /> // Espaciador para centrar
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
