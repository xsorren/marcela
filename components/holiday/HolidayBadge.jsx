"use client"

import { Sparkles } from "lucide-react"

export default function HolidayBadge({ variant = "default", className = "" }) {
  const variants = {
    default: "bg-gradient-to-r from-holiday-gold to-holiday-champagne text-gray-800",
    outlined: "border-2 border-holiday-gold bg-white text-holiday-gold",
    minimal: "bg-holiday-cream text-holiday-gold border border-holiday-gold/30",
  }

  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        shadow-sm animate-pulse-subtle
        ${variants[variant]}
        ${className}
      `}
    >
      <Sparkles className="h-3 w-3" />
      <span>Felices Fiestas</span>
    </div>
  )
}
