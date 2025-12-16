"use client"

import { Suspense } from "react"
import { useDispatch } from "react-redux"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import AuthGuard from "@/components/auth/auth-guard"
import { fetchAllProperties } from "@/lib/redux/slices/propertySlice"
import { useEffect } from "react"
import { ToastProvider } from "@/components/ui/toast-provider"

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch()

  // Cargar datos necesarios para el dashboard
  useEffect(() => {
    dispatch(fetchAllProperties())
  }, [dispatch])

  return (
    <AuthGuard requireAdmin={false}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 p-6 pb-28 sm:pb-24 md:pb-6 bg-card border-l border-border shadow-minimalist transition-all duration-200">
          <Suspense fallback={<div className="p-12 flex justify-center text-brand-brown font-medium animate-pulse-soft">Cargando...</div>}>
            {children}
          </Suspense>
        </div>
        <MobileNav />
        <ToastProvider />
      </div>
    </AuthGuard>
  )
} 