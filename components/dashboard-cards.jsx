"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getPropertyStats } from "@/lib/data"

export function DashboardCards() {
  const [stats, setStats] = useState({
    total: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("DashboardCards: Obteniendo estadísticas de propiedades...")
        const data = await getPropertyStats()
        console.log("DashboardCards: Estadísticas obtenidas:", data)
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="bg-[#2c2c2c] border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gold">Total Propiedades</CardTitle>
          <Home className="h-4 w-4 text-gold/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{loading ? "..." : stats.total}</div>
          <p className="text-xs text-gray-400">Propiedades en el sistema</p>
        </CardContent>
      </Card>

      <Card className="bg-[#2c2c2c] border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gold">Propiedades Destacadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-gold/70" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{loading ? "..." : "0"}</div>
          <p className="text-xs text-gray-400">Propiedades destacadas</p>
        </CardContent>
      </Card>
    </div>
  )
}

