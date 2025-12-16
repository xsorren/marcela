"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSupabase } from "@/utils/supabase/provider"

export default function ConfiguracionPage() {
  const { toast } = useToast()
  const { supabase } = useSupabase()
  
  // Usuario actual
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  })
  
  // Estados para carga y guardado
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Estados para las contraseñas
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  
  // Estados para configuraciones adicionales
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    email: {
      messages: true,
      properties: true,
      updates: false
    },
    push: {
      messages: true,
      properties: true,
      updates: false
    }
  })
  
  const [preferences, setPreferences] = useState({
    propertyType: "cualquiera",
    location: "Pilar, Buenos Aires",
    minPrice: "50000",
    maxPrice: "200000",
    features: {
      garden: true,
      pool: true,
      garage: true,
      security: false
    },
    language: "es",
    currency: "usd"
  })

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Obtener sesión actual
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          setUser(authUser)
          
          // Configurar perfil usando solo datos de auth.user_metadata
          setUserProfile({
            name: authUser.user_metadata?.full_name || "",
            email: authUser.email || "",
            phone: authUser.user_metadata?.phone || "",
            location: authUser.user_metadata?.location || "",
            bio: authUser.user_metadata?.bio || ""
          })
          
          // Configurar preferencias desde user_metadata si existen
          if (authUser.user_metadata?.preferences) {
            setPreferences(prevPrefs => ({
              ...prevPrefs,
              ...authUser.user_metadata.preferences
            }))
          }
          
          if (authUser.user_metadata?.notifications) {
            setNotifications(authUser.user_metadata.notifications)
          }
          
          setTwoFactorEnabled(authUser.user_metadata?.two_factor_enabled || false)
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar tus datos. Por favor, intenta más tarde.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, toast])

  // Manejar cambios en campos del perfil
  const handleProfileChange = (e) => {
    const { id, value } = e.target
    setUserProfile(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Manejar cambios en contraseñas
  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    const field = id.replace('password-', '')
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manejar cambios en notificaciones
  const handleNotificationChange = (type, category, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: value
      }
    }))
  }

  // Manejar cambios en preferencias
  const handlePreferenceChange = (category, value) => {
    if (category === 'feature') {
      const [_, feature] = value.split('-')
      setPreferences(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [feature]: !prev.features[feature]
        }
      }))
    } else {
      setPreferences(prev => ({
        ...prev,
        [category]: value
      }))
    }
  }

  // Guardar perfil del usuario
  const saveProfile = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: userProfile.name,
          phone: userProfile.phone,
          location: userProfile.location,
          bio: userProfile.bio
        }
      })
      
      if (error) throw error
      
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente"
      })
    } catch (error) {
      console.error('Error al guardar perfil:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil. Por favor, intenta más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Cambiar contraseña
  const changePassword = async () => {
    // Validaciones
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive"
      })
      return
    }
    
    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      })
      return
    }
    
    setIsChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })
      
      if (error) throw error
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada correctamente"
      })
      
      // Limpiar campos de contraseña
      setPasswords({
        current: "",
        new: "",
        confirm: ""
      })
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      toast({
        title: "Error",
        description: "No se pudo cambiar tu contraseña. Verifica tus datos e intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Guardar preferencias de notificaciones
  const saveNotificationPreferences = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications,
          two_factor_enabled: twoFactorEnabled
        }
      })
      
      if (error) throw error
      
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación se han guardado correctamente"
      })
    } catch (error) {
      console.error('Error al guardar preferencias:', error)
      toast({
        title: "Error",
        description: "No se pudieron guardar tus preferencias. Por favor, intenta más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Guardar preferencias de usuario
  const saveUserPreferences = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          preferences
        }
      })
      
      if (error) throw error
      
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias se han guardado correctamente"
      })
    } catch (error) {
      console.error('Error al guardar preferencias:', error)
      toast({
        title: "Error",
        description: "No se pudieron guardar tus preferencias. Por favor, intenta más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle 2FA
  const toggleTwoFactor = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      // Aquí iría la lógica real para habilitar/deshabilitar 2FA
      // Por ahora solo actualizamos el estado
      const newValue = !twoFactorEnabled
      setTwoFactorEnabled(newValue)
      
      // Actualizar en user_metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          two_factor_enabled: newValue
        }
      })
      
      if (error) throw error
      
      toast({
        title: newValue ? "Autenticación de dos factores activada" : "Autenticación de dos factores desactivada",
        description: "Tu configuración ha sido actualizada correctamente"
      })
    } catch (error) {
      console.error('Error al cambiar configuración 2FA:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración. Por favor, intenta más tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Eliminar cuenta
  const deleteAccount = async () => {
    if (!user) return
    
    setIsDeleting(true)
    try {
      // Eliminar la cuenta de autenticación (esto también eliminará los datos del usuario)
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) throw error
      
      // Redireccionar a la página principal
      window.location.href = '/'
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar tu cuenta. Por favor, contacta a soporte.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-brown-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:gap-8">
        <div className="md:w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brand-brown-500 mb-2">Configuración</h1>
            <p className="text-gray-300 max-w-3xl">
              Gestiona tu cuenta, preferencias y configuración de seguridad
            </p>
          </div>

          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 bg-zinc-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-brand-brown-500">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-brand-brown-500">
                Seguridad
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-brand-brown-500">
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-brand-brown-500">
                Preferencias
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Información personal</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input 
                      id="name" 
                      value={userProfile.name}
                      onChange={handleProfileChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input 
                      id="email" 
                      value={userProfile.email} 
                      disabled 
                      className="bg-zinc-700 border-zinc-600 text-white opacity-60"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      El correo electrónico no se puede cambiar
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      value={userProfile.phone}
                      onChange={handleProfileChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                      placeholder="+54 9 2227 53-6988"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input 
                      id="location" 
                      value={userProfile.location}
                      onChange={handleProfileChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                      placeholder="Ciudad, Provincia"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="bio">Biografía</Label>
                  <textarea 
                    id="bio"
                    value={userProfile.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
                  />
                </div>
                
                <Button 
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="mt-4 bg-brand-brown-500 text-black hover:bg-[#C9982C]"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar cambios
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Cambiar contraseña</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-current">Contraseña actual</Label>
                    <Input 
                      id="password-current" 
                      type="password"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-new">Nueva contraseña</Label>
                    <Input 
                      id="password-new" 
                      type="password"
                      value={passwords.new}
                      onChange={handlePasswordChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirmar nueva contraseña</Label>
                    <Input 
                      id="password-confirm" 
                      type="password"
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                  
                  <Button 
                    onClick={changePassword}
                    disabled={isChangingPassword}
                    className="mt-2 bg-brand-brown-500 text-black hover:bg-[#C9982C]"
                  >
                    {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Actualizar contraseña
                  </Button>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Autenticación de dos factores</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Aumenta la seguridad de tu cuenta con la autenticación de dos factores</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Recibirás un código por correo electrónico cada vez que inicies sesión
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled} 
                    onCheckedChange={toggleTwoFactor}
                    disabled={isSaving}
                    className="data-[state=checked]:bg-brand-brown-500"
                  />
                </div>
              </div>
              
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white text-red-600">Zona de peligro</h3>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Eliminar cuenta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-800 border-zinc-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">¿Estás absolutamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos los datos asociados a ella.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                      <AlertDialogCancel className="bg-zinc-700 text-white hover:bg-zinc-600">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={deleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? "Eliminando..." : "Eliminar cuenta"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Notificaciones por correo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <div>
                      <p className="text-white">Mensajes</p>
                      <p className="text-sm text-gray-400">Notificaciones de mensajes nuevos</p>
                    </div>
                    <Switch 
                      checked={notifications.email.messages} 
                      onCheckedChange={(checked) => handleNotificationChange('email', 'messages', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <div>
                      <p className="text-white">Propiedades</p>
                      <p className="text-sm text-gray-400">Actualizaciones sobre propiedades favoritas</p>
                    </div>
                    <Switch 
                      checked={notifications.email.properties} 
                      onCheckedChange={(checked) => handleNotificationChange('email', 'properties', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Novedades</p>
                      <p className="text-sm text-gray-400">Información sobre nuevas características y ofertas</p>
                    </div>
                    <Switch 
                      checked={notifications.email.updates} 
                      onCheckedChange={(checked) => handleNotificationChange('email', 'updates', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Notificaciones push</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <div>
                      <p className="text-white">Mensajes</p>
                      <p className="text-sm text-gray-400">Notificaciones push de mensajes nuevos</p>
                    </div>
                    <Switch 
                      checked={notifications.push.messages} 
                      onCheckedChange={(checked) => handleNotificationChange('push', 'messages', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-700">
                    <div>
                      <p className="text-white">Propiedades</p>
                      <p className="text-sm text-gray-400">Alertas sobre propiedades favoritas</p>
                    </div>
                    <Switch 
                      checked={notifications.push.properties} 
                      onCheckedChange={(checked) => handleNotificationChange('push', 'properties', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Novedades</p>
                      <p className="text-sm text-gray-400">Actualizaciones de la plataforma</p>
                    </div>
                    <Switch 
                      checked={notifications.push.updates} 
                      onCheckedChange={(checked) => handleNotificationChange('push', 'updates', checked)}
                      className="data-[state=checked]:bg-brand-brown-500"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={saveNotificationPreferences}
                  disabled={isSaving}
                  className="mt-4 bg-brand-brown-500 text-black hover:bg-[#C9982C]"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar preferencias
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Preferencias de propiedades</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Tipo de propiedad</Label>
                    <Select 
                      value={preferences.propertyType}
                      onValueChange={(value) => handlePreferenceChange('propertyType', value)}
                    >
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="cualquiera">Cualquiera</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="departamento">Departamento</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="local">Local comercial</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location-pref">Ubicación preferida</Label>
                    <Input 
                      id="location-pref"
                      value={preferences.location}
                      onChange={(e) => handlePreferenceChange('location', e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white"
                      placeholder="Ciudad, Provincia"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="min-price">Precio mínimo (USD)</Label>
                    <Input 
                      id="min-price"
                      type="number"
                      value={preferences.minPrice}
                      onChange={(e) => handlePreferenceChange('minPrice', e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-price">Precio máximo (USD)</Label>
                    <Input 
                      id="max-price"
                      type="number"
                      value={preferences.maxPrice}
                      onChange={(e) => handlePreferenceChange('maxPrice', e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label className="mb-2 block">Características deseadas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="feature-garden"
                        checked={preferences.features.garden}
                        onCheckedChange={() => handlePreferenceChange('feature', 'feature-garden')}
                        className="data-[state=checked]:bg-brand-brown-500"
                      />
                      <Label htmlFor="feature-garden" className="text-gray-300">Jardín</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="feature-pool"
                        checked={preferences.features.pool}
                        onCheckedChange={() => handlePreferenceChange('feature', 'feature-pool')}
                        className="data-[state=checked]:bg-brand-brown-500"
                      />
                      <Label htmlFor="feature-pool" className="text-gray-300">Piscina</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="feature-garage"
                        checked={preferences.features.garage}
                        onCheckedChange={() => handlePreferenceChange('feature', 'feature-garage')}
                        className="data-[state=checked]:bg-brand-brown-500"
                      />
                      <Label htmlFor="feature-garage" className="text-gray-300">Garage</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="feature-security"
                        checked={preferences.features.security}
                        onCheckedChange={() => handlePreferenceChange('feature', 'feature-security')}
                        className="data-[state=checked]:bg-brand-brown-500"
                      />
                      <Label htmlFor="feature-security" className="text-gray-300">Seguridad</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">Configuración general</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select 
                      value={preferences.language}
                      onValueChange={(value) => handlePreferenceChange('language', value)}
                    >
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                        <SelectValue placeholder="Seleccionar idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select 
                      value={preferences.currency}
                      onValueChange={(value) => handlePreferenceChange('currency', value)}
                    >
                      <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="usd">Dólar (USD)</SelectItem>
                        <SelectItem value="ars">Peso argentino (ARS)</SelectItem>
                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={saveUserPreferences}
                  disabled={isSaving}
                  className="mt-4 bg-brand-brown-500 text-black hover:bg-[#C9982C]"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar preferencias
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 
