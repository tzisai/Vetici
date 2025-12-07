import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
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
  needsPasswordReset: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Añadimos el alias para compatibilidad
}

// Crea el contexto con un valor por defecto
export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  needsPasswordReset: false,
  signOut: async () => {},
  logout: async () => {}, // Añadimos el alias para compatibilidad
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
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  useEffect(() => {
    // onAuthStateChange se ejecuta en la carga inicial y en cada cambio de sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setProfile(null); // Limpia el perfil anterior

      if (event === 'PASSWORD_RECOVERY') {
        setNeedsPasswordReset(true);
      } else if (event === 'SIGNED_IN' && session) {
        setNeedsPasswordReset(false);
        try {
          const { data: userProfile, error } = await supabase.from('profiles').select('id, name, role').eq('id', session.user.id).single();
          if (error) throw error;
          setProfile(userProfile);
          window.location.hash = '#home'; // Redirige al home después de iniciar sesión
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        window.location.hash = '#login'; // Redirige al login después de cerrar sesión
      } else if (session) { // Para la sesión inicial
        try {
          const { data: userProfile, error } = await supabase.from('profiles').select('id, name, role').eq('id', session.user.id).single();
          if (error) throw error;
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    needsPasswordReset,
    signOut,
    logout: signOut, // Hacemos que logout llame a signOut
  };

  // Muestra un loader mientras se verifica la sesión para evitar parpadeos
  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
