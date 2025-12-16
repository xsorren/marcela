"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { 
  LayoutDashboard, 
  Building, 
  Check, 
  Star,
  MoreVertical,
  Users,
  Home,
  X,
  LogOut
} from "lucide-react"
import { selectCurrentUser, logoutUser } from "@/lib/redux/slices/authSlice"

export default function MobileNav() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [windowWidth, setWindowWidth] = useState(0)

  // Track window width for responsive adjustments
  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth)
    
    // Update window width on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    setSidebarOpen(false)
  }

  const mainMenuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Propiedades",
      href: "/dashboard/properties",
      icon: <Building size={20} />,
    },
    {
      title: "Destacadas",
      href: "/dashboard/destacadas",
      icon: <Star size={20} />,
    },
  ]

  const moreMenuItems = [
    {
      title: "Sitio Web",
      href: "/",
      icon: <Home size={20} />,
      divider: true,
    },
  ]

  // Calculate sidebar width based on screen size
  const getSidebarWidth = () => {
    if (windowWidth <= 360) return 'w-[80%]' // Very small screens
    if (windowWidth <= 480) return 'w-72' // Small screens
    return 'w-80' // Default for larger screens
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed top-0 right-0 bottom-0 ${getSidebarWidth()} bg-[#121212] z-30 p-4 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#D4AF37]">MARCELA SOSA</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-1">
          {moreMenuItems.map((item, index) => (
            <div key={index}>
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-[#D4AF37] text-black font-medium"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
              {item.divider && <hr className="border-gray-800 my-3" />}
            </div>
          ))}
        </nav>

        <div>
          {currentUser && (
            <div className="pt-4 mt-4">
              <div className="flex items-center px-4 py-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center mr-2">
                  <span className="text-black font-bold">
                    {currentUser.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-300">{currentUser.email}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-red-900/20"
              >
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 z-10 px-1 py-1 sm:py-0">
        <div className="grid grid-cols-4 w-full">
          {mainMenuItems.map((item, index) => (
            <Link 
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg ${
                pathname === item.href
                  ? "text-[#D4AF37]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
              }`}
            >
              <div className="mb-1">
                {item.icon}
              </div>
              <span className="text-[10px] xs:text-xs truncate max-w-[60px] text-center">{item.title}</span>
            </Link>
          ))}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 rounded-lg"
          >
            <div className="mb-1">
              <MoreVertical size={20} />
            </div>
            <span className="text-[10px] xs:text-xs truncate">Más</span>
          </button>
        </div>
      </div>
    </>
  )
} 