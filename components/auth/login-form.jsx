'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  loginUser, 
  selectIsAuthenticated, 
  selectIsLoading, 
  selectAuthError,
  clearError
} from '@/lib/redux/slices/authSlice';
import { AlertCircle, Mail, Lock, ArrowRight, Info } from 'lucide-react';

// Esquema de validación
const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  // Usamos este enfoque para evitar errores durante SSR/Static Generation
  const [mounted, setMounted] = useState(false);
  
  // Estado para mensajes de UI
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Acceso a Redux siempre debe ser incondicional
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);
  
  // Formulario con validación
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Este efecto se ejecuta solo del lado del cliente - Para inicialización
  useEffect(() => {
    setMounted(true);
    
    // Limpiar cualquier error previo
    if (dispatch) {
      dispatch(clearError());
    }
  }, [dispatch]);
  
  // Efecto separado para los parámetros de búsqueda
  useEffect(() => {
    if (!mounted || !searchParams) return;
    
    // Extraer mensajes de la URL
    const message = searchParams.get('message');
    if (message) {
      switch (message) {
        case 'login_required':
          setMessage('Debes iniciar sesión para acceder a esa página');
          setMessageType('warning');
          break;
        case 'session_expired':
          setMessage('Tu sesión ha expirado, por favor inicia sesión nuevamente');
          setMessageType('warning');
          break;
        default:
          setMessage(message);
          setMessageType('info');
      }
    }
  }, [searchParams, mounted]);
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (!mounted || !isAuthenticated || !router || !searchParams) return;
    
    const redirectTo = searchParams.get('from') || '/dashboard';
    console.log('Redireccionando a:', redirectTo);
    // Usar setTimeout para asegurarnos de que la redirección ocurra después de la actualización del estado
    setTimeout(() => {
      router.push(redirectTo);
    }, 100);
  }, [isAuthenticated, router, searchParams, mounted]);

  // Error de autenticación
  useEffect(() => {
    if (!mounted || !authError) return;
    
    let errorMessage = authError.message;
    
    // Personalizar mensajes de error comunes
    if (errorMessage.includes('Invalid login')) {
      errorMessage = 'Email o contraseña incorrectos';
    } else if (errorMessage.includes('rate limit')) {
      errorMessage = 'Demasiados intentos. Por favor, espera unos minutos';
    }
    
    setMessage(errorMessage);
    setMessageType('error');
  }, [authError, mounted]);

  // Enviar formulario
  const onSubmit = async (data) => {
    if (!mounted || !dispatch) return;
    
    const redirectTo = searchParams?.get('from') || '/dashboard';
    try {
      // Limpiar cualquier mensaje anterior
      setMessage('');
      
      // Dispatch de la acción de login
      const resultAction = await dispatch(loginUser({ ...data, redirectTo }));
      
      // Verificar si la acción fue exitosa
      if (loginUser.fulfilled.match(resultAction)) {
        console.log('Login exitoso, redireccionando a:', redirectTo);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  };

  // Renderizado del componente
  const renderContent = () => {
    if (!mounted) {
      return (
        <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
          <CardHeader className="space-y-1">
            <div className="h-8 w-48 rounded-md animate-pulse"></div>
            <div className="h-4 w-full rounded-md animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-16 rounded-md animate-pulse"></div>
              <div className="h-10 w-full rounded-md animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded-md animate-pulse"></div>
              <div className="h-10 w-full rounded-md animate-pulse"></div>
            </div>
            <div className="h-10 w-full rounded-md animate-pulse"></div>
          </CardContent>
          <CardFooter className="border-t border-border pt-5">
            <div className="h-4 w-full rounded-md animate-pulse"></div>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gold">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-400">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {message && (
            <Alert className={`mb-5 ${
              messageType === 'error' ? 'bg-red-900/20 border-red-800 text-red-400' :
              messageType === 'warning' ? 'bg-amber-900/20 border-amber-800 text-amber-400' :
              messageType === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' :
              'bg-blue-900/20 border-blue-800 text-blue-400'
            }`}>
              <div className="flex items-start gap-3">
                {messageType === 'error' ? <AlertCircle className="h-5 w-5 mt-0.5" /> : 
                 messageType === 'success' ? <Info className="h-5 w-5 mt-0.5" /> :
                 <Info className="h-5 w-5 mt-0.5" />}
                <div>
                  <AlertTitle className="text-sm font-medium mb-1">
                    {messageType === 'error' ? 'Error' : 
                     messageType === 'warning' ? 'Atención' : 
                     messageType === 'success' ? 'Éxito' : 'Información'}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {message}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="tu@email.com"
                          type="email"
                          autoComplete="email"
                          className="pl-10 border-border focus:border-gold focus:ring-gold text-gray-600 [&::placeholder]:text-gray-600"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gold">Contraseña</FormLabel>
                      <Link 
                        href="/reset-password" 
                        className="text-sm text-gray-400 hover:text-gold"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          autoComplete="current-password"
                          className="pl-10 border-border focus:border-gold focus:ring-gold text-gray-600 [&::placeholder]:text-gray-600"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-600 text-black font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="black" className="mr-2" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Iniciar Sesión
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t border-border pt-5">
          <div className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/servicios" 
              className="font-semibold text-gold hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return renderContent();
} 