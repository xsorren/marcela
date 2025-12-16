import "./globals.css"
import { Inter } from 'next/font/google'
import { ReduxProvider } from "@/lib/redux/provider"
import AuthListener from "@/components/auth-listener"
import { SupabaseProvider } from "@/utils/supabase/provider"
import LayoutWrapper from "@/components/layout-wrapper"

// Configure Inter font for modern, minimalist design
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: "Marcela Sosa - Negocios Inmobiliarios",
  description: "Servicios inmobiliarios profesionales con experiencia y confianza"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.className} light`}>
      <body className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800 antialiased">
        <SupabaseProvider>
          <ReduxProvider>
            <AuthListener>
              <LayoutWrapper>{children}</LayoutWrapper>
            </AuthListener>
          </ReduxProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}