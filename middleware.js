import { NextResponse } from 'next/server';

export function middleware(request) {
  // No realizar pre-renderizado de rutas de autenticación
  const path = request.nextUrl.pathname;
  
  // Durante la compilación estática, redireccionar rutas de autenticación
  // a páginas estáticas para evitar errores
  if (process.env.NODE_ENV === 'production' && 
      (path === '/login' || path === '/reset-password')) {
    // Solo durante la compilación, no en ejecución
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.rewrite(new URL('/api/auth/placeholder', request.url));
    }
  }
  
  return NextResponse.next();
}

// Solo aplicar a rutas específicas para optimizar
export const config = {
  matcher: [
    '/login',
    '/reset-password',
    '/dashboard/:path*',
  ],
}; 