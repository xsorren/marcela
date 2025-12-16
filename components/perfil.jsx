import { Header, Sidebar } from "@/components/layout"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PerfilPage() {
  const user = {
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+54 11 1234-5678",
    location: "Buenos Aires, Argentina",
    bio: "Buscando la casa perfecta para mi familia. Interesado en propiedades con jardín y buena ubicación.",
    avatar: "/placeholder.svg?height=120&width=120",
    memberSince: "Marzo 2023",
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#242424] rounded-3xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#C9982C] text-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                  <p className="text-gray-400 mb-4">Miembro desde {user.memberSince}</p>
                  <p className="text-gray-300 mb-4">{user.bio}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p>{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ubicación</p>
                      <p>{user.location}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Editar perfil</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
