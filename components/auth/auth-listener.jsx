'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCredentials, 
  clearCredentials, 
  selectIsSessionChecked,
  fetchCurrentUser
} from '@/lib/redux/slices/authSlice';
import { onAuthStateChange } from '@/utils/supabase/client';

export function AuthListener({ children }) {
  const dispatch = useDispatch();
  const isSessionChecked = useSelector(selectIsSessionChecked);

  useEffect(() => {
    // Verificar la sesión inicial solo si no se ha verificado
    if (!isSessionChecked) {
      dispatch(fetchCurrentUser());
    }

    // Configurar el listener para cambios en el estado de autenticación
    const { data: authListener } = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'session exists' : 'no session');

      switch (event) {
        case 'SIGNED_IN':
          // Usuario ha iniciado sesión
          if (session) {
            dispatch(setCredentials({
              user: session.user,
              session: session
            }));
          }
          break;
        case 'SIGNED_OUT':
          // Usuario ha cerrado sesión
          dispatch(clearCredentials());
          break;
        case 'TOKEN_REFRESHED':
          // Token de sesión actualizado
          if (session) {
            dispatch(setCredentials({
              user: session.user,
              session: session
            }));
          }
          break;
        case 'USER_UPDATED':
          // Datos del usuario actualizados
          if (session) {
            dispatch(setCredentials({
              user: session.user,
              session: session
            }));
          }
          break;
        default:
          break;
      }
    });

    // Limpieza al desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, isSessionChecked]);

  // Siempre renderizar los children, ya que este componente solo escucha cambios
  return children;
} 