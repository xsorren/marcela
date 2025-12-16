/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita errores durante la compilación para páginas que usan autenticación
  output: 'standalone',
  
  // Configurar páginas que deben ser renderizadas solo en el cliente
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', '127.0.0.1:3001']
    }
  },
  
  // Tratar rutas específicas con manejo especial
  async redirects() {
    return []
  },
  
  // Ignorar errores en tiempo de compilación para ciertas páginas
  onDemandEntries: {
    // Páginas con problemas de compilación estática
    pagesIgnorePattern: ['/login'],
  },
  
  images: {
    domains: ['localhost', 'mhlklppixwlpmytfjnhm.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }
};

module.exports = nextConfig; 