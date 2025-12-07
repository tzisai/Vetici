import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseclient';

// Define el tipo para el perfil del usuario que viene de tu tabla 'profiles'
interface UserProfile {
  id: string;
  name: string;
  role: 'CLIENTE' | 'ADMIN';
}

// Define la forma del contexto
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Crea el contexto con un valor por defecto
export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// Crea el componente Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Intenta obtener la sesión actual al cargar la app
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        // 2. Si hay sesión, busca el perfil del usuario
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id, name, role')
          .eq('id', session.user.id)
          .single();
        setProfile(userProfile);
      }
      setLoading(false);
    });

    // 3. Escucha cambios en el estado de autenticación (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setProfile(null); // Limpia el perfil anterior
      if (session) {
        const { data: userProfile } = await supabase.from('profiles').select('id, name, role').eq('id', session.user.id).single();
        setProfile(userProfile);
      }
      if (loading) setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loading]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    isAuthenticated: !!session?.user,
    isAdmin: profile?.role === 'ADMIN',
    loading,
    signOut,
  };

  // Muestra un loader mientras se verifica la sesión para evitar parpadeos
  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};