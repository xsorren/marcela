"use client"

import { usePathname } from 'next/navigation'
import Navbar from './navbar'
import Footer from './footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')
  
  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && <Footer />}
    </>
  )
} 