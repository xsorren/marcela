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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  registerUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectLastAuthAction,
  clearError
} from '@/lib/redux/slices/authSlice';
import { AlertCircle, Mail, Lock, User, UserPlus, Info, Phone } from 'lucide-react';

// Esquema de validación
const registerSchema = z.object({
  full_name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor ingresa un email válido' }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);
  const lastAuthAction = useSelector(selectLastAuthAction);
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  
  // Formulario con validación
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  // Extraer mensajes de la URL
  useEffect(() => {
    const message = searchParams.get('message');
    
    if (message) {
      setMessage(message);
      setMessageType('info');
    }
    
    // Limpiar cualquier error previo
    dispatch(clearError());
  }, [searchParams, dispatch]);

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Verificar estado de registro
  useEffect(() => {
    if (lastAuthAction === 'register_email_confirmation') {
      setEmailConfirmationSent(true);
      setMessage('Te hemos enviado un correo para confirmar tu cuenta. Por favor revisa tu bandeja de entrada.');
      setMessageType('success');
    }
  }, [lastAuthAction]);

  // Error de autenticación
  useEffect(() => {
    if (authError) {
      let errorMessage = authError.message;
      
      // Personalizar mensajes de error comunes
      if (errorMessage.includes('already registered')) {
        errorMessage = 'Este correo ya está registrado. Por favor inicia sesión.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'El email proporcionado no es válido.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    }
  }, [authError]);

  // Enviar formulario
  const onSubmit = async (data) => {
    // Preparar datos para el registro
    const userData = {
      email: data.email,
      password: data.password,
      metadata: {
        full_name: data.full_name,
        phone: data.phone || null,
        role: 'user'
      },
      redirectTo: '/dashboard'
    };
    
    await dispatch(registerUser(userData));
  };

  // Mostrar mensaje de confirmación de correo
  if (emailConfirmationSent) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gold">Confirma tu Correo</CardTitle>
          <CardDescription className="text-gray-400">
            Hemos enviado un link de confirmación a tu correo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-900/20 border-green-800 text-green-400">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 mt-0.5" />
              <div>
                <AlertTitle className="text-sm font-medium mb-1">Revisa tu bandeja de entrada</AlertTitle>
                <AlertDescription className="text-sm">
                  {message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
          
          <div className="text-center mt-4">
            <Button 
              onClick={() => router.push('/login')}
              className="bg-gold hover:bg-gold-600 text-black font-semibold"
            >
              Ir a Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gold">Crear Cuenta</CardTitle>
        <CardDescription className="text-gray-400">
          Regístrate para acceder a todas las funciones
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold">Nombre Completo</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Juan Pérez"
                        autoComplete="name"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold">Teléfono (opcional)</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+54 9 12 3456-7890"
                        type="tel"
                        autoComplete="tel"
                        className="pl-10 border-border focus:border-gold focus:ring-gold text-gray-600 [&::placeholder]:text-gray-600"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="text-gray-400 text-xs">
                    Tu número de teléfono no será compartido.
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold">Contraseña</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          autoComplete="new-password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold">Confirmar Contraseña</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          autoComplete="new-password"
                          className="pl-10 border-border focus:border-gold focus:ring-gold text-gray-600 [&::placeholder]:text-gray-600"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-gold data-[state=checked]:border-gold mt-1"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-400">
                      Acepto los{' '}
                      <Link href="/terms" className="text-gold hover:underline">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link href="/privacy" className="text-gold hover:underline">
                        política de privacidad
                      </Link>
                    </FormLabel>
                    <FormMessage className="text-red-400" />
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold-600 text-black font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="black" className="mr-2" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Crear Cuenta
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 border-t border-border pt-5">
        <div className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            href="/login" 
            className="font-semibold text-gold hover:underline"
          >
            Inicia Sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 