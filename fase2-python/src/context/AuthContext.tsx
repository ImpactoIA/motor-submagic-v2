import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase'; 
import type { Session, User } from '@supabase/supabase-js'; 

export interface UserProfile {
  id: string;
  email: string;
  credits: number;
  tier: 'free' | 'esencial' | 'pro' | 'agency' | 'admin';
  active_expert_id?: string;
  active_avatar_id?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  isLoading: true,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const mounted = useRef(true);

  // --- CARGA DE DATOS (EN SEGUNDO PLANO) ---
  const fetchProfile = useCallback(async (userId: string, userEmail?: string) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); 
        
      if (mounted.current) {
        if (data) {
           setUserProfile(data);
        } else {
           // Perfil temporal si no carga rápido
           setUserProfile({ id: userId, email: userEmail || '', credits: 0, tier: 'free' });
        }
      }
    } catch (error) {
      console.error("Error background profile:", error);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    
    // 1. VÁLVULA DE EMERGENCIA (2 Segundos)
    // Si por alguna razón extraña Supabase no responde, abrimos la App en 2s.
    const emergencyTimer = setTimeout(() => {
        if (isLoading && mounted.current) {
            console.warn("⚠️ Auth: Tiempo excedido. Forzando apertura.");
            setIsLoading(false);
        }
    }, 2000);

    const init = async () => {
      try {
        // 2. OBTENER SESIÓN
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted.current) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            
            // 🚀 CLAVE DEL ÉXITO:
            // Disparamos la carga del perfil PERO NO ESPERAMOS (no usamos await aquí para el loading)
            fetchProfile(initialSession.user.id, initialSession.user.email);
          }
        }
      } catch (error) {
        console.error("Error Auth Init:", error);
      } finally {
        // 3. ABRIR LA PUERTA PASE LO QUE PASE
        if (mounted.current) {
            setIsLoading(false);
            clearTimeout(emergencyTimer);
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted.current) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' && currentSession?.user) {
         fetchProfile(currentSession.user.id, currentSession.user.email);
         setIsLoading(false); // Asegurar desbloqueo al loguear
      } else if (event === 'SIGNED_OUT') {
         setUserProfile(null);
         setSession(null);
         setUser(null);
         setIsLoading(false); // Asegurar desbloqueo al salir
      }
    });

    return () => {
      mounted.current = false;
      clearTimeout(emergencyTimer);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile, 
      isLoading, 
      refreshProfile: () => fetchProfile(user?.id || '', user?.email) 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);