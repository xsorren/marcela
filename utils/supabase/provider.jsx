'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from './client';
import { useRouter } from 'next/navigation';

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }) => {
  const [supabase] = useState(() => getSupabaseClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Refresh the page for server components to update
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider');
  }
  return context;
}; 