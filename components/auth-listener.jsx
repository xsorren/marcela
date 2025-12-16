'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '@/lib/redux/slices/authSlice';
import { useSupabase } from '@/utils/supabase/provider';

export default function AuthListener({ children }) {
  const dispatch = useDispatch();
  const { supabase } = useSupabase();

  useEffect(() => {
    // Verificar el estado de autenticación actual al cargar
    const checkCurrentSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          console.log('Sesión encontrada:', data.session.user.id);
          
          dispatch(
            setCredentials({
              user: data.session.user,
              session: data.session,
            })
          );
        } else {
          console.log('No se encontró sesión activa');
          dispatch(clearCredentials());
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        dispatch(clearCredentials());
      }
    };

    checkCurrentSession();

    // Configurar el oyente para cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticación:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Usuario ha iniciado sesión:', session.user.id);
        
        dispatch(
          setCredentials({
            user: session.user,
            session: session,
          })
        );
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuario ha cerrado sesión');
        dispatch(clearCredentials());
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token actualizado para:', session.user.id);
        dispatch(
          setCredentials({
            user: session.user,
            session: session,
          })
        );
      } else if (event === 'USER_UPDATED' && session) {
        console.log('Usuario actualizado:', session.user.id);
        dispatch(
          setCredentials({
            user: session.user,
            session: session,
          })
        );
      }
    });

    // Limpiar el oyente al desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch, supabase]);

  return children;
} 