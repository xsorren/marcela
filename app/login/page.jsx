'use client';

import { LoginForm } from '@/components/auth/login-form';
import { useEffect, useState } from 'react';

// Añadir metadatos de exportación para indicar a Next.js que debe usar renderizado dinámico
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function LoginPage() {
  // Usar un estado para manejar el renderizado del lado del cliente
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);

  // Este efecto se ejecutará solo en el cliente
  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (err) {
      console.error("Error en el montaje:", err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center text-red-500">
          <h2 className="text-2xl mb-4">Error al cargar la página</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gold text-black rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold tracking-tight">MARCELA SOSA</h1>
          <p className="text-muted-foreground mt-2">Negocios Inmobiliarios</p>
        </div>

        {/* Renderizar el formulario solo del lado del cliente */}
        {isMounted ? (
          <div key="login-form-container">
            <LoginForm />
          </div>
        ) : (
          <div className="animate-pulse bg-card rounded-lg p-6">
            <div className="h-10 rounded-md mb-4"></div>
            <div className="h-10 rounded-md mb-4"></div>
            <div className="h-10 bg-primary/30 rounded-md"></div>
          </div>
        )}

        <div className="text-center mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MS Inmobiliaria. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
} 