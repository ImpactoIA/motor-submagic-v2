import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex selection:bg-indigo-500/30">
      
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      {/* Área de contenido principal */}
      <main className="flex-1 transition-all duration-500 md:ml-64">
        {/* Contenedor interno para padding responsivo */}
        <div className="p-4 md:p-8 max-w-[1920px] mx-auto w-full">
          
          {/* Aquí se renderizan las páginas (Dashboard, Settings, etc.) */}
          <Outlet />
          
        </div>
      </main>
    </div>
  );
};