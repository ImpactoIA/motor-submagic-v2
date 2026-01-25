import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Zap, FileText, Calculator, BarChart2, 
  RefreshCw, Mic, User, Briefcase, Database, Calendar, 
  Bot, Settings, Archive, Rocket, HelpCircle, LogOut // ✅ Icono LogOut añadido aquí
} from 'lucide-react';

// --- ARQUITECTURA DE NAVEGACIÓN ---
const menuItems = [
  { icon: LayoutDashboard, label: 'Torre de Control', path: '/' },
  { section: 'Creación Viral' },
  { icon: Zap, label: 'Ideas Rápidas', path: '/dashboard/quick-ideas' },
  { icon: FileText, label: 'Generador Guiones', path: '/dashboard/script-generator' },
  { section: 'Laboratorio de Análisis' },
  { icon: Calculator, label: 'Juez Viral', path: '/dashboard/viral-calculator' },
  { icon: BarChart2, label: 'Autopsia Viral', path: '/dashboard/analyze-viral' },
  { icon: RefreshCw, label: 'Ingeniería Inversa', path: '/dashboard/recreate-viral' },
  { icon: Mic, label: 'Transcriptor', path: '/dashboard/transcriptor' },
  { section: 'Estrategia & Identidad' },
  { icon: User, label: 'Avatar', path: '/dashboard/avatar-profile' },
  { icon: Briefcase, label: 'Experto', path: '/dashboard/expert-profile' },
  { icon: Database, label: 'Cerebro Digital', path: '/dashboard/knowledge-base' },
  { icon: Calendar, label: 'Calendario', path: '/dashboard/calendar' },
  { section: 'Gestión de Activos' },
  { icon: Archive, label: 'Baúl Creativo', path: '/dashboard/history' },
  { section: 'Inteligencia Artificial' },
  { icon: Bot, label: 'Mentor Estratégico', path: '/dashboard/ai-assistant' },
  { section: 'Sistema' },
  { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
        await supabase.auth.signOut();
        // Limpiamos caché local por seguridad comercial
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    } catch (error) {
        console.error('Error Logout:', error);
        navigate('/login'); 
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0E14] border-r border-gray-800 flex flex-col z-50 hidden md:flex font-sans shadow-2xl">
      
      {/* LOGO DE MARCA */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800/50">
        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <Rocket className="text-white h-6 w-6" />
        </div>
        <div>
            <span className="text-lg font-black text-white tracking-tight block leading-none">TITAN APPS</span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Version 4.2</span>
        </div>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-1">
          {menuItems.map((item, index) => (
            item.section ? (
              <div key={index} className="pt-5 pb-2 px-2 text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                {item.section} <div className="h-px bg-gray-800 flex-1"></div>
              </div>
            ) : (
              <Link
                key={index}
                to={item.path || '#'}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  item.path && isActive(item.path)
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon && <item.icon size={18} className={item.path && isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'} />}
                {item.label}
              </Link>
            )
          ))}
      </div>

      {/* FOOTER FUNCIONAL */}
      <div className="p-4 border-t border-gray-800 bg-[#080a0f]">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 mb-3 group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400"><HelpCircle size={16}/></div>
                <span className="text-xs font-bold text-white">Soporte Vital</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">¿Algún sistema fallando? Contacta a ingeniería.</p>
        </div>

        <button 
            onClick={handleLogout} 
            className="w-full py-3 rounded-xl font-bold text-red-500 flex items-center justify-center gap-2 transition-all bg-red-500/5 hover:bg-red-600/10 border border-red-500/10 hover:border-red-500/30 text-xs uppercase tracking-widest"
        >
            <LogOut size={16}/> DESCONECTAR
        </button>
      </div>
    </aside>
  );
};