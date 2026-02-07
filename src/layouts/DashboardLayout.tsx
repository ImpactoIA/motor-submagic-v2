import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';

// ✅ 1. IMPORTAMOS EL WIDGET DEL AVATAR
import { AvatarWidget } from '../components/AvatarWidget';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none z-0"></div>

      {/* Sidebar (Controlada por estado en móvil) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Área de contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 h-screen overflow-hidden">
        
        {/* Header Móvil (Solo visible en pantallas pequeñas) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center font-black italic text-xs">T</div>
                <span className="font-black text-sm tracking-tighter">TITAN <span className="text-indigo-500">V300</span></span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
            >
                <Menu size={20} />
            </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Contenedor interno para padding responsivo */}
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full pb-20">
                <Outlet />
            </div>
        </div>
      </main>

      {/* ✅ 2. WIDGET FLOTANTE (Siempre visible encima de todo) */}
      <AvatarWidget />

      {/* Estilos globales inyectados para este layout */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .bg-grid-pattern {
            background-image: linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px);
            background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};