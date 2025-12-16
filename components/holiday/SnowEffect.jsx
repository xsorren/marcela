"use client"

import { useEffect, useState } from "react"

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState([])

  useEffect(() => {
    // Generar copos de nieve con posiciones y duraciones aleatorias
    const flakes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      animationDelay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
      size: 2 + Math.random() * 4,
    }))
    
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="snow-container fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snow-particle absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        />
      ))}
    </div>
  )
}
