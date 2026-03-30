import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';

export const AvatarWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeAvatar, setActiveAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // No mostrar el widget en la página de login o registro
  if (['/login', '/register', '/auth'].includes(location.pathname)) return null;

  useEffect(() => {
    if (user) {
      fetchActiveAvatar();
    }
  }, [user, location.pathname]); // Recargar si cambia la ruta por si se actualizó

  const fetchActiveAvatar = async () => {
    try {
      const { data } = await supabase
        .from('avatars')
        .select('name, experience_level, primary_goal')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();

      setActiveAvatar(data);
    } catch (error) {
      console.error("Error widget avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    // Si no hay avatar, llevar a crear uno. Si hay, llevar al perfil.
    navigate('/avatar-profile');
  };

  if (loading) return null;

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-2 pr-4 rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 group ${
        activeAvatar 
          ? 'bg-[#0f1115] border-indigo-500/50 hover:border-indigo-400' 
          : 'bg-red-900/20 border-red-500/50 hover:border-red-400 animate-pulse'
      }`}
    >
      {/* Icono Circular */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        activeAvatar 
          ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
          : 'bg-red-600'
      }`}>
        {activeAvatar ? <Bot size={20} className="text-white" /> : <AlertCircle size={20} className="text-white" />}
      </div>

      {/* Texto (Se expande o muestra info) */}
      <div className="text-left">
        {activeAvatar ? (
          <>
            <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-0.5">
              Avatar Activo
            </p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-white font-bold leading-none">
                {activeAvatar.name}
              </p>
              <Sparkles size={8} className="text-yellow-400" />
            </div>
          </>
        ) : (
          <>
            <p className="text-[10px] text-red-300 font-bold uppercase leading-none mb-0.5">
              Sistema Inactivo
            </p>
            <p className="text-xs text-white font-bold leading-none">
              Crear Avatar
            </p>
          </>
        )}
      </div>
    </button>
  );
};