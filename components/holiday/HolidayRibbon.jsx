"use client"

import { Gift } from "lucide-react"

export default function HolidayRibbon({ text = "Oferta Especial", variant = "gold" }) {
  const variants = {
    gold: "bg-gradient-to-r from-holiday-gold to-yellow-600 text-white",
    green: "bg-gradient-to-r from-holiday-emerald to-green-700 text-white",
    burgundy: "bg-gradient-to-r from-brand-brown-500 to-brand-brown-600 text-white",
  }

  return (
    <div className="absolute top-4 -right-2 z-10">
      <div 
        className={`
          ${variants[variant]}
          px-4 py-1.5 pr-6
          text-xs font-bold uppercase tracking-wide
          shadow-lg
          ribbon-shape
          flex items-center gap-1.5
        `}
      >
        <Gift className="h-3.5 w-3.5" />
        <span>{text}</span>
      </div>
      {/* Efecto de doblez */}
      <div 
        className={`
          absolute -bottom-2 right-0 w-0 h-0 
          border-l-[16px] border-l-transparent 
          border-t-[8px] ${
            variant === 'gold' ? 'border-t-yellow-700' :
            variant === 'green' ? 'border-t-green-800' :
            'border-t-brand-brown-700'
          }
        `}
      />
    </div>
  )
}
