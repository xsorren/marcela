"use client"

import { Building } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardHeader({ title, description, icon, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props}>
      <div className="flex items-center gap-2">
        {icon || <Building className="h-6 w-6 text-brand-brown" />}
        <h1 className="text-2xl font-bold text-foreground font-heading tracking-tight">{title}</h1>
      </div>
      {description && <p className="text-muted-foreground text-base font-medium">{description}</p>}
    </div>
  )
}
  
  
