"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { 
  LayoutDashboard, 
  Home, 
  Building, 
  Check, 
  Users, 
  Settings, 
  LogOut,
  Star
} from "lucide-react"
import { selectCurrentUser } from "@/lib/redux/slices/authSlice"
import { logoutUser } from "@/lib/redux/slices/authSlice"

export default function Sidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const menuItems = [
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
    {
      title: "Sitio Web",
      href: "/",
      icon: <Home size={20} />,
      divider: true,
    },
  ]

  return (
    <aside className="hidden md:block w-64 bg-sidebar-background min-h-screen p-4 flex flex-col text-sidebar-foreground border-r border-sidebar-border shadow-minimalist">
      <div className="py-4 mb-6">
        <h1 className="text-2xl font-bold text-center text-sidebar-primary tracking-tight">MARCELA SOSA</h1>
        <p className="text-center text-sidebar-accent-foreground text-sm">Panel de Administración</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 smooth-transition ${
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-minimalist-hover"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
            {item.divider && <hr className="border-sidebar-border my-3" />}
          </div>
        ))}
      </nav>

      <div className="mt-auto">
        {currentUser && (
          <div className="border-t border-sidebar-border pt-4 mt-4">
            <div className="flex items-center px-4 py-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center mr-2">
                <span className="text-sidebar-primary-foreground font-bold">
                  {currentUser.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-sidebar-foreground">{currentUser.email}</p>
                <p className="text-xs text-sidebar-accent-foreground">Administrador</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

