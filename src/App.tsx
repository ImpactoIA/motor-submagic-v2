import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Páginas Principales
import { Auth } from './pages/Auth';
import { DashboardHome } from './pages/DashboardHome';

// El Cerebro & Identidad (V300)
import { KnowledgeBase } from './pages/KnowledgeBase';
import { ExpertProfile } from './pages/ExpertProfile';
import { AvatarProfile } from './pages/AvatarProfile';

// Herramientas de Creación
import { ScriptGenerator } from './pages/ScriptGenerator';
import { AnalyzeViral } from './pages/AnalyzeViral';
// import { ReverseEngineering } from './pages/ReverseEngineering'; // 🗑️ ELIMINADO: No existe
import { ViralCalculator } from './pages/ViralCalculator';
import { TitanViral } from './pages/TitanViral'; // ✅ ESTA ES LA INGENIERÍA INVERSA
import { QuickIdeas } from './pages/QuickIdeas';
import { CopyExpert } from './pages/CopyExpert';

// Gestión y Estrategia
import { Calendar } from './pages/Calendar';
import { AiAssistant } from './pages/AiAssistant';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

// --- PROTECTOR DE RUTAS V300 ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin direction-reverse"></div>
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 animate-pulse">
            Sincronizando Ecosistema V300
        </p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      {/* 1. AUTENTICACIÓN */}
      <Route path="/login" element={<Auth />} />

      {/* 2. RUTAS PROTEGIDAS (ECOSISTEMA TITAN) */}
      <Route path="/dashboard" element={
          <ProtectedRoute>
            {/* DashboardLayout ya incluye el <AvatarWidget /> inyectado */}
            <DashboardLayout /> 
          </ProtectedRoute>
      }>
          {/* Torre de Control (Index) */}
          <Route index element={<DashboardHome />} />

          {/* El Cerebro (Configuración Estratégica) */}
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="expert-profile" element={<ExpertProfile />} />
          <Route path="avatar-profile" element={<AvatarProfile />} />

          {/* Herramientas de Producción */}
          <Route path="script-generator" element={<ScriptGenerator />} />
          <Route path="analyze-viral" element={<AnalyzeViral />} />
          
          {/* 🛠️ CORRECCIÓN: La ruta apunta a TitanViral porque ese es el archivo real */}
          <Route path="reverse-engineering" element={<TitanViral />} /> 
          
          <Route path="viral-calculator" element={<ViralCalculator />} />
          <Route path="recreate-viral" element={<TitanViral />} />
          <Route path="quick-ideas" element={<QuickIdeas />} />
          <Route path="/copy-expert" element={<CopyExpert />} />
          {/* Gestión */}
          <Route path="calendar" element={<Calendar />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
      </Route>

      {/* 3. REDIRECCIONES DE COMPATIBILIDAD */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* ✅ Redirección crítica para el Widget del Avatar */}
      <Route path="/avatar" element={<Navigate to="/dashboard/avatar-profile" replace />} />
      
      {/* Redirecciones automáticas para evitar errores 404 en navegación directa */}
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      <Route path="/script-generator" element={<Navigate to="/dashboard/script-generator" replace />} />
      
      {/* Catch-all: Si algo falla, volver al centro de mando */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

console.log("🚀 TITAN V300 SYSTEM: ONLINE - AVATAR CORE ENABLED");