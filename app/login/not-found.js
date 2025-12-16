import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-muted-foreground mb-6">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gold text-black font-medium rounded-md hover:bg-gold/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

// Esto se usa como fallback durante la compilación
export const config = {
  unstable_runtimeJS: false
}; 