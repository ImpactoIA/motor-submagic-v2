import { ReactNode } from 'react';
import { Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlanGuardProps {
  children: ReactNode;
  userTier: string | undefined; // Dinámico desde userProfile
  requiredTier: 'esencial' | 'pro' | 'agency';
  featureName?: string;
}

export const PlanGuard = ({ children, userTier, requiredTier, featureName = "Esta función" }: PlanGuardProps) => {
  const navigate = useNavigate();

  // --- LÓGICA DE PODER JERÁRQUICO ---
  const tiers: Record<string, number> = { 
    'free': 0, 
    'esencial': 1, 
    'pro': 2, 
    'agency': 3,
    'admin': 99 // Nivel Dios: Acceso total
  };

  // Verificamos si el usuario tiene el rango suficiente
  const currentUserLevel = tiers[userTier || 'free'] || 0;
  const requiredLevel = tiers[requiredTier];
  
  const hasAccess = currentUserLevel >= requiredLevel;

  // Si tiene acceso, renderizamos el contenido original
  if (hasAccess) {
    return <>{children}</>;
  }

  // --- INTERFAZ DE BLOQUEO PERSUASIVA (UI PREMIUM) ---
  return (
    <div className="bg-[#0B0E14] border border-gray-800 rounded-[32px] p-12 text-center relative overflow-hidden group shadow-2xl animate-in fade-in duration-500">
      {/* Efecto de fondo sutil */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 border border-white/5 shadow-inner">
            <Lock className="text-indigo-500" size={36} />
        </div>
        
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Función Bloqueada</h3>
        
        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
          {featureName} requiere el plan <span className="text-indigo-400 font-black uppercase underline decoration-indigo-500/30 underline-offset-4">{requiredTier}</span> o superior para ser activada.
        </p>
        
        <button 
          onClick={() => navigate('/dashboard/settings', { state: { tab: 'plans' } })}
          className="bg-white text-black px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-gray-200 transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest text-xs"
        >
            <Zap size={18} fill="currentColor" className="text-indigo-600" /> Mejorar mi Plan
        </button>
        
        <p className="mt-6 text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">Titan Ecosystem Safety Protocol</p>
      </div>
    </div>
  );
};