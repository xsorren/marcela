"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Heart, User, LogOut } from "lucide-react"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Botón para abrir el menú */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
        aria-label="Abrir menú de usuario"
      >
        <User className="h-6 w-6" />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-6 flex flex-col items-end">
            {/* Opciones de menú */}
            <nav className="w-full text-right space-y-4 mb-6">
              <Link
                href="/favoritos"
                className="block text-gray-800 hover:text-gray-600 font-medium text-lg py-1"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Favoritos</span>
                  <Heart className="h-5 w-5" />
                </div>
              </Link>

              <Link
                href="/alertas"
                className="block text-gray-800 hover:text-gray-600 font-medium text-lg py-1"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Alertas</span>
                  <Bell className="h-5 w-5" />
                </div>
              </Link>

              <Link
                href="/mi-cuenta"
                className="block text-gray-800 hover:text-gray-600 font-medium text-lg py-1"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Mi Cuenta</span>
                  <User className="h-5 w-5" />
                </div>
              </Link>
            </nav>

            {/* Botón de cerrar sesión */}
            <button
              onClick={() => {
                console.log("Cerrando sesión...")
                setIsOpen(false)
                // Aquí iría la lógica para cerrar sesión
              }}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
            >
              Cerrar Sesión
              <LogOut className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


