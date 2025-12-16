"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthenticated, logoutUser } from "../lib/redux/slices/authSlice"
// ========================================
// 🎄 HOLIDAY MODE - Imports
// ========================================
import { isHolidayModeActive } from "@/config/features"
import { HolidayBadge } from "@/components/holiday"
// ========================================

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  // Get authentication state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  // ========================================
  // 🎄 HOLIDAY MODE - State
  // ========================================
  const showHoliday = isHolidayModeActive()
  // ========================================

  // Detectar scroll para cambiar estilos de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Function to handle logout using Redux
  const handleLogout = () => {
    dispatch(logoutUser({ redirectTo: '/' }))
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-neutral-200/80' : 'bg-white border-b border-neutral-100/50'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Enhanced with better scaling and shadow */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 transition-all duration-300 hover:scale-[1.08] hover:drop-shadow-lg">
              <Link href="/" className="block">
                {/* Logo for mobile devices */}
                <div className="md:hidden">
                  <Image
                    src="/images/logo-largo.png"
                    alt="INMOBILIARIA"
                    width={180}
                    height={50}
                    className="h-10 w-auto filter hover:saturate-110 transition-all duration-300"
                  />
                </div>
                
                {/* Full logo for desktop - Enhanced */}
                <div className="hidden md:block">
                  <Image
                    src="/images/logo-largo.png"
                    alt="INMOBILIARIA PROFESIONAL"
                    width={180}
                    height={50}
                    className="h-12 w-auto filter hover:saturate-110 transition-all duration-300"
                  />
                </div>
              </Link>
            </div>
            {/* ========================================
                🎄 HOLIDAY MODE - Badge festivo
                ======================================== */}
            {showHoliday && (
              <div className="hidden md:block">
                <HolidayBadge variant="minimal" />
              </div>
            )}
            {/* ======================================== */}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button type="button" className="text-neutral-600 hover:text-brand-brown-500 transition-colors" onClick={toggleMenu}>
              <span className="sr-only">Abrir menú</span>
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>

          {/* Desktop navigation - Enhanced modern style */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link 
              href="/" 
              className="group relative px-5 py-3 text-neutral-700 font-semibold text-[15px] tracking-wide hover:text-brand-brown-500 transition-all duration-300 rounded-lg hover:bg-neutral-50"
            >
              <span className="relative z-10">Inicio</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-brown-500 to-brand-green-500 transition-all duration-300 group-hover:w-4/5 rounded-full"></span>
            </Link>
            
            <Link 
              href="/listado" 
              className="group relative px-5 py-3 text-neutral-700 font-semibold text-[15px] tracking-wide hover:text-brand-brown-500 transition-all duration-300 rounded-lg hover:bg-neutral-50"
            >
              <span className="relative z-10">Propiedades</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-brown-500 to-brand-green-500 transition-all duration-300 group-hover:w-4/5 rounded-full"></span>
            </Link>
           
            <Link 
              href="/contacto" 
              className="group relative px-5 py-3 text-neutral-700 font-semibold text-[15px] tracking-wide hover:text-brand-brown-500 transition-all duration-300 rounded-lg hover:bg-neutral-50"
            >
              <span className="relative z-10">Contacto</span>
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-brown-500 to-brand-green-500 transition-all duration-300 group-hover:w-4/5 rounded-full"></span>
            </Link>
            
          </div>

          {/* Auth buttons - Enhanced modern design */}
          <div className="hidden md:flex md:items-center md:ml-8 md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="group relative px-6 py-2.5 text-sm font-semibold text-brand-brown-500 border-2 border-brand-brown-500 rounded-xl hover:bg-brand-brown-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-brand-brown-500 rounded-xl hover:bg-brand-brown-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                >
                  <span className="relative z-10">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-brand-green-500 rounded-xl hover:bg-brand-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                >
                  <span className="relative z-10">Iniciar sesión</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu - Clean and spacious */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-minimalist border-t border-neutral-200">
          <div className="px-6 py-6 space-y-1">
            <Link 
              href="/" 
              className="block py-3 text-neutral-700 font-medium hover:text-brand-brown-500 border-b border-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/listado" 
              className="block py-3 text-neutral-700 font-medium hover:text-brand-brown-500 border-b border-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Propiedades
            </Link>
            <Link 
              href="/contacto" 
              className="block py-3 text-neutral-700 font-medium hover:text-brand-brown-500 border-b border-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="flex flex-col space-y-3 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="mr-3 px-5 py-3 text-sm text-center text-brand-brown-500 border border-brand-brown-500 rounded-lg font-medium hover:bg-brand-brown-50 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-5 py-3 text-sm text-center text-white bg-brand-brown-500 rounded-lg font-medium hover:bg-brand-brown-600 transition-all"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-3 text-sm text-center text-white bg-brand-green-500 rounded-lg font-medium hover:bg-brand-green-600 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

