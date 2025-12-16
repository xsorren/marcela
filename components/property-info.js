import Image from "next/image"

export default function PropertyInfo() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full mx-auto">
      {/* Ambientes y Servicios */}
      <div className="flex-1 bg-zinc-800 rounded-xl border border-zinc-700 p-5">
        <div>
          <h3 className="text-white font-medium text-lg mb-2">Ambientes</h3>
          <p className="text-gray-300 text-sm mb-6">
            Living - Comedor - Dormitorio - Cocina - Cochera - Baño - Lavadero - Piscina
          </p>
        </div>

        <div>
          <h3 className="text-white font-medium text-lg mb-2">Servicios</h3>
          <p className="text-gray-300 text-sm">Seguridad Privada - Servicio recolección residuos</p>
        </div>
      </div>

      {/* Vendedor */}
      <div className="md:w-80 bg-zinc-800 rounded-xl border border-zinc-700 p-5">
        <div className="text-center mb-4">
          <h3 className="text-white font-medium text-2xl mb-1">Vendedor</h3>
          <p className="text-white">Carlos Perez</p>
          <p className="text-gray-400 text-sm">Matrícula CP6895</p>
        </div>

        <div>
          <h4 className="text-white font-medium text-center mb-3">Contacto</h4>
          <div className="flex items-center justify-center gap-3">
            <a href="#" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            <a href="#" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-at-sign"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
              </svg>
            </a>
            <a href="#" className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=100&width=100"
                alt="Foto del vendedor"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
