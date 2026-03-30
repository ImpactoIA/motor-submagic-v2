import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Zap, FileText, Calculator, BarChart2, 
  RefreshCw, Mic, User, Briefcase, Database, Calendar, 
  Bot, Settings, Archive, Rocket, HelpCircle, LogOut, X,
  Wand2 // 👈 AGREGA ESTO AQUÍ
} from 'lucide-react';

// Definimos las props para el manejo móvil
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- ARQUITECTURA DE NAVEGACIÓN V300 ---
const menuItems = [
  { icon: LayoutDashboard, label: 'Torre de Control', path: '/dashboard', exact: true },
  
  { section: 'Creación Viral' },
  { icon: Zap, label: 'Ideas Rápidas', path: '/dashboard/quick-ideas' },
  { icon: FileText, label: 'Generador Guiones', path: '/dashboard/script-generator' },
  { icon: Wand2, label: 'Copy Expert', path: '/dashboard/copy-expert' },
  
  { section: 'Laboratorio de Análisis' },
  { icon: Calculator, label: 'Juez Viral', path: '/dashboard/viral-calculator' },
  { icon: BarChart2, label: 'Autopsia Viral', path: '/dashboard/analyze-viral' },
  { icon: RefreshCw, label: 'Ingeniería Inversa', path: '/dashboard/recreate-viral' },
  
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

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  // Función mejorada para detectar rutas activas
  const isActive = (path: string, exact = false) => {
      if (exact) return location.pathname === path;
      return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    } catch (error) {
        console.error('Error Logout:', error);
        navigate('/login'); 
    }
  };

  // Clases dinámicas para controlar la visibilidad en móvil
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0E14] border-r border-gray-800 flex flex-col font-sans shadow-2xl transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-0
  `;

  return (
    <>
        {/* OVERLAY MÓVIL (Fondo oscuro al abrir menú) */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                onClick={onClose}
            />
        )}

        <aside className={sidebarClasses}>
          {/* HEADER LOGO */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800/50 shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                  <Rocket className="text-white h-5 w-5" />
                </div>
                <div>
                    <span className="text-base font-black text-white tracking-tight block leading-none">TITAN APPS</span>
                    <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">V300 PRO</span>
                </div>
            </div>
            {/* Botón cerrar solo visible en móvil */}
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
          </div>

          {/* LISTA DE NAVEGACIÓN */}
          <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-0.5">
              {menuItems.map((item, index) => (
                item.section ? (
                  <div key={index} className="pt-6 pb-2 px-2 text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    {item.section} <div className="h-px bg-gray-800 flex-1"></div>
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path || '#'}
                    onClick={() => onClose()} // Cerrar menú al hacer clic en móvil
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative overflow-hidden ${
                      item.path && isActive(item.path, item.exact)
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    {/* Indicador activo lateral */}
                    {item.path && isActive(item.path, item.exact) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20"></div>
                    )}
                    
                    {item.icon && <item.icon size={18} className={item.path && isActive(item.path, item.exact) ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'} />}
                    {item.label}
                  </Link>
                )
              ))}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-gray-800 bg-[#0F1116] shrink-0">
            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 mb-3 group hover:border-indigo-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                    <HelpCircle size={14} className="text-indigo-400"/>
                    <span className="text-xs font-bold text-white">Soporte Vital</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">¿Sistemas fallando? Contacta ingeniería.</p>
            </div>

            <button 
                onClick={handleLogout} 
                className="w-full py-2.5 rounded-xl font-bold text-red-500 flex items-center justify-center gap-2 transition-all bg-red-500/5 hover:bg-red-600/10 border border-red-500/10 hover:border-red-500/30 text-xs uppercase tracking-widest"
            >
                <LogOut size={16}/> SALIR
            </button>
          </div>
        </aside>
    </>
  );
};