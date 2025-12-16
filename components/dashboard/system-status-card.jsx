'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, ServerIcon, CheckCircle2, XCircle } from "lucide-react";

export default function SystemStatusCard({
  title = "Estado del Sistema",
  description = "Resumen de estado de la plataforma",
  statuses = [
    { name: "Base de datos", status: "operational" },
    { name: "Almacenamiento", status: "operational" },
    { name: "API", status: "operational" },
    { name: "Sistema de autenticación", status: "operational" }
  ],
  lastUpdated
}) {
  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "No disponible";
    
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(lastUpdated);
  };

  return (
    <Card className="bg-card border border-border shadow-minimalist hover:shadow-minimalist-hover transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statuses.map((item, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center gap-2">
              {item.status === "operational" ? (
                <CheckCircle className="text-brand-green-500 h-4 w-4" />
              ) : (
                <AlertCircle className="text-destructive h-4 w-4" />
              )}
              <span className="text-sm text-foreground">{item.name}</span>
            </div>
            <div className={`text-sm font-medium ${
              item.status === "operational" ? "text-brand-green-500" : "text-destructive"
            }`}>
              {item.status === "operational" ? "Operativo" : "Problemas"}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-3 items-center">
          <div className="col-span-2 text-foreground font-medium">Última Actualización</div>
          <div className="flex justify-end">
            <div className="text-muted-foreground text-sm">
              {formatLastUpdated()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 