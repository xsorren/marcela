'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

let supabase = null;
let supabaseClient = null;

export const getSupabaseClient = () => {
  if (supabase === null) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabase;
};

// Funciones de autenticación
export const signInWithEmail = async (email, password) => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUpWithEmail = async (email, password, metadata = {}) => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  return { data, error };
};

export const signOut = async () => {
  const client = getSupabaseClient();
  
  try {
    console.log("Iniciando proceso de cierre de sesión");
    const { error } = await client.auth.signOut();
    
    if (error) {
      console.error("Error al cerrar sesión:", error);
      return { error };
    }
    
    console.log("Sesión cerrada correctamente");
    
    // No redireccionamos aquí, lo dejamos para el manejador de la acción en Redux
    return { error: null };
  } catch (e) {
    console.error("Excepción al cerrar sesión:", e);
    return { error: e };
  }
};

export const getSession = async () => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  return { data, error };
};

export const getCurrentUser = async () => {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser();
  return { data, error };
};

// Hook para suscribirse a cambios de autenticación
export const onAuthStateChange = (callback) => {
  const client = getSupabaseClient();
  return client.auth.onAuthStateChange(callback);
}; 