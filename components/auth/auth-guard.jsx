'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsSessionChecked,
  fetchCurrentUser
} from '@/lib/redux/slices/authSlice';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthGuard({ 
  children, 
  redirectTo = '/login',
  loadingComponent = null,
  fallback = null
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSessionChecked = useSelector(selectIsSessionChecked);
  const currentUser = useSelector(selectCurrentUser);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Si no se ha verificado la sesión, hacerlo
    if (!isSessionChecked) {
      dispatch(fetchCurrentUser());
      return;
    }

    setIsCheckingAuth(false);

    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
      // Si hay un mensaje para mostrar, agregarlo a la URL
      const redirectUrl = new URL(redirectTo, window.location.origin);
      redirectUrl.searchParams.set('from', window.location.pathname);
      router.push(redirectUrl.toString());
      return;
    }

    // Si pasa todas las verificaciones, está autorizado
    setIsAuthorized(true);
  }, [isAuthenticated, isSessionChecked, currentUser, router, dispatch, redirectTo]);

  // Mostrar componente de carga durante la verificación inicial
  if (isCheckingAuth) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Mostrar fallback si está verificando después de la carga inicial
  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-secondary rounded-md shadow-md">
          <h2 className="text-xl font-bold text-primary mb-2">Verificando acceso...</h2>
          <p className="text-muted-foreground">Por favor espere mientras verificamos sus credenciales.</p>
        </div>
      </div>
    );
  }

  // Renderizar los children si está autorizado
  return children;
} 