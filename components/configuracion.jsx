import { Header, Sidebar } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConfiguracionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Configuración</h1>

            <Tabs defaultValue="cuenta" className="mb-8">
              <TabsList className="bg-[#242424] border border-[#333]">
                <TabsTrigger value="cuenta" className="data-[state=active]:bg-[#C9982C]">
                  Cuenta
                </TabsTrigger>
                <TabsTrigger value="seguridad" className="data-[state=active]:bg-[#C9982C]">
                  Seguridad
                </TabsTrigger>
                <TabsTrigger value="notificaciones" className="data-[state=active]:bg-[#C9982C]">
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="preferencias" className="data-[state=active]:bg-[#C9982C]">
                  Preferencias
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cuenta" className="mt-4">
                <div className="bg-[#242424] rounded-3xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Información personal</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Nombre completo
                        </label>
                        <Input id="name" defaultValue="Juan Pérez" className="bg-[#1a1a1a] border-[#333] text-white" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="juan@example.com"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Teléfono
                        </label>
                        <Input
                          id="phone"
                          defaultValue="+54 9 2227 53-6988"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                          Ubicación
                        </label>
                        <Input
                          id="location"
                          defaultValue="Buenos Aires, Argentina"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-sm font-medium">
                        Biografía
                      </label>
                      <textarea
                        id="bio"
                        rows="4"
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                        defaultValue="Buscando la casa perfecta para mi familia. Interesado en propiedades con jardín y buena ubicación."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Guardar cambios</Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="seguridad" className="mt-4">
                <div className="bg-[#242424] rounded-3xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="text-sm font-medium">
                        Contraseña actual
                      </label>
                      <Input id="current-password" type="password" className="bg-[#1a1a1a] border-[#333] text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        Nueva contraseña
                      </label>
                      <Input id="new-password" type="password" className="bg-[#1a1a1a] border-[#333] text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirmar nueva contraseña
                      </label>
                      <Input id="confirm-password" type="password" className="bg-[#1a1a1a] border-[#333] text-white" />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Actualizar contraseña</Button>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-[#333]">
                    <h2 className="text-xl font-semibold mb-4">Verificación en dos pasos</h2>
                    <p className="text-gray-300 mb-4">
                      Añade una capa adicional de seguridad a tu cuenta activando la verificación en dos pasos.
                    </p>
                    <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333]">
                      Activar verificación en dos pasos
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notificaciones" className="mt-4">
                <div className="bg-[#242424] rounded-3xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Preferencias de notificaciones</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Email</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="email-messages" className="text-gray-300">
                            Mensajes nuevos
                          </label>
                          <input type="checkbox" id="email-messages" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="email-properties" className="text-gray-300">
                            Nuevas propiedades que coinciden con mis búsquedas
                          </label>
                          <input type="checkbox" id="email-properties" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="email-updates" className="text-gray-300">
                            Actualizaciones de la plataforma
                          </label>
                          <input type="checkbox" id="email-updates" className="toggle" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Push</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="push-messages" className="text-gray-300">
                            Mensajes nuevos
                          </label>
                          <input type="checkbox" id="push-messages" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="push-properties" className="text-gray-300">
                            Nuevas propiedades que coinciden con mis búsquedas
                          </label>
                          <input type="checkbox" id="push-properties" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="push-updates" className="text-gray-300">
                            Actualizaciones de la plataforma
                          </label>
                          <input type="checkbox" id="push-updates" className="toggle" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Guardar preferencias</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferencias" className="mt-4">
                <div className="bg-[#242424] rounded-3xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Preferencias de búsqueda</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="property-type" className="text-sm font-medium">
                          Tipo de propiedad preferido
                        </label>
                        <select
                          id="property-type"
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                        >
                          <option value="casa">Casa</option>
                          <option value="apartamento">Apartamento</option>
                          <option value="terreno">Terreno</option>
                          <option value="cualquiera" selected>
                            Cualquiera
                          </option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="location-pref" className="text-sm font-medium">
                          Ubicación preferida
                        </label>
                        <Input
                          id="location-pref"
                          defaultValue="Pilar, Buenos Aires"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="min-price" className="text-sm font-medium">
                          Precio mínimo (USD)
                        </label>
                        <Input
                          id="min-price"
                          type="number"
                          defaultValue="50000"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="max-price" className="text-sm font-medium">
                          Precio máximo (USD)
                        </label>
                        <Input
                          id="max-price"
                          type="number"
                          defaultValue="200000"
                          className="bg-[#1a1a1a] border-[#333] text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="features" className="text-sm font-medium">
                        Características deseadas
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="feature-garden" className="mr-2" defaultChecked />
                          <label htmlFor="feature-garden" className="text-gray-300">
                            Jardín
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="feature-pool" className="mr-2" defaultChecked />
                          <label htmlFor="feature-pool" className="text-gray-300">
                            Piscina
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="feature-garage" className="mr-2" defaultChecked />
                          <label htmlFor="feature-garage" className="text-gray-300">
                            Garaje
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="feature-security" className="mr-2" />
                          <label htmlFor="feature-security" className="text-gray-300">
                            Seguridad 24h
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Guardar preferencias</Button>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-[#333]">
                    <h2 className="text-xl font-semibold mb-4">Idioma y moneda</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="language" className="text-sm font-medium">
                          Idioma
                        </label>
                        <select
                          id="language"
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                        >
                          <option value="es" selected>
                            Español
                          </option>
                          <option value="en">English</option>
                          <option value="pt">Português</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="currency" className="text-sm font-medium">
                          Moneda
                        </label>
                        <select
                          id="currency"
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-white"
                        >
                          <option value="usd" selected>
                            USD - Dólar estadounidense
                          </option>
                          <option value="ars">ARS - Peso argentino</option>
                          <option value="eur">EUR - Euro</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button className="bg-[#C9982C] hover:bg-[#b38a27] text-white">Guardar cambios</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-[#242424] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">Eliminar cuenta</h2>
              <p className="text-gray-300 mb-4">
                Al eliminar tu cuenta, se borrarán permanentemente todos tus datos, incluyendo tus favoritos, mensajes y
                preferencias. Esta acción no se puede deshacer.
              </p>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                Eliminar mi cuenta
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
