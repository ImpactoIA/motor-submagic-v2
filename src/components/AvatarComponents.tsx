import React from 'react';
import { Lightbulb, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==================================================================================
// 1. MENTOR STRATEGIC: Las alertas de colores (Verde, Rojo, Amarillo)
// ==================================================================================
export const MentorStrategic = ({ alerts }: { alerts: any[] }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
      {alerts.map((alert, index) => (
        <div 
          key={index} 
          className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-sm ${
            alert.type === 'error' ? 'bg-red-900/10 border-red-500 text-red-200' :
            alert.type === 'warning' ? 'bg-orange-900/10 border-orange-500 text-orange-200' :
            alert.type === 'success' ? 'bg-green-900/10 border-green-500 text-green-200' :
            'bg-blue-900/10 border-blue-500 text-blue-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {alert.type === 'error' ? <AlertTriangle size={20} className="text-red-500"/> :
             alert.type === 'warning' ? <ShieldCheck size={20} className="text-orange-500"/> :
             alert.type === 'success' ? <Zap size={20} className="text-green-500"/> :
             <Info size={20} className="text-blue-500"/>}
          </div>
          <div>
            <h4 className={`font-black text-sm uppercase mb-1 ${
               alert.type === 'error' ? 'text-red-400' :
               alert.type === 'warning' ? 'text-orange-400' :
               alert.type === 'success' ? 'text-green-400' :
               'text-blue-400'
            }`}>
              {alert.message}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed font-medium">
              {alert.suggestion || alert.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// 2. CONTEXTUAL SUGGESTIONS: El cuadro lateral con consejos
// ==================================================================================
export const ContextualSuggestions = ({ avatar, currentMode }: { avatar: any, currentMode: string }) => {
  const navigate = useNavigate();

  if (!avatar) {
      return (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
              <Lightbulb className="mx-auto text-gray-600 mb-3" size={32}/>
              <h3 className="text-gray-400 font-bold text-sm">Sin Sugerencias</h3>
              <p className="text-gray-600 text-xs mt-2 mb-4">Configura tu avatar para recibir consejos estratégicos.</p>
              <button 
                  onClick={() => navigate('/avatar-profile')}
                  className="text-indigo-400 text-xs font-bold hover:text-indigo-300 underline"
              >
                  Ir a Configuración
              </button>
          </div>
      );
  }

  // Lógica simple de sugerencias basada en el objetivo del avatar
  let tipTitle = "Consejo Estratégico";
  let tipContent = "Usa tu avatar para alinear tu contenido.";

  if (avatar.primary_goal === 'viralidad') {
      tipTitle = "🚀 Modo Viralidad";
      tipContent = "Recuerda que para viralizar necesitas romper el patrón en los primeros 3 segundos. Usa ganchos visuales fuertes.";
  } else if (avatar.primary_goal === 'autoridad') {
      tipTitle = "👑 Modo Autoridad";
      tipContent = "Céntrate en aportar valor profundo. No busques likes, busca guardados y compartidos.";
  } else if (avatar.primary_goal === 'venta') {
      tipTitle = "💰 Modo Venta";
      tipContent = "Cada pieza de contenido debe resolver una objeción de compra. Sé sutil pero directo.";
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-5 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={64}/>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
          <div className="bg-yellow-500/20 p-1.5 rounded-lg">
              <Lightbulb size={16} className="text-yellow-500"/>
          </div>
          <span className="text-yellow-500 font-black text-xs uppercase tracking-wider">MENTOR TIPS</span>
      </div>

      <h4 className="text-white font-bold text-sm mb-2">{tipTitle}</h4>
      <p className="text-gray-400 text-xs leading-relaxed border-l-2 border-gray-700 pl-3">
          "{tipContent}"
      </p>

      {avatar.risk_level === 'agresivo' && (
          <div className="mt-4 pt-3 border-t border-gray-800">
              <p className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={10}/> RIESGO ALTO ACTIVO
              </p>
          </div>
      )}
    </div>
  );
};