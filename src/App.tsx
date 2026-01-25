import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout y Páginas
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { Auth } from './pages/Auth';
import { Settings } from './pages/Settings';
import { History } from './pages/History';
import { QuickIdeas } from './pages/QuickIdeas';
import { ScriptGenerator } from './pages/ScriptGenerator';
import { ViralCalculator } from './pages/ViralCalculator';
import { AnalyzeViral } from './pages/AnalyzeViral';
import { TitanViral } from './pages/TitanViral';
import { TranscribeVideo } from './pages/TranscribeVideo';
import { AvatarProfile } from './pages/AvatarProfile';
import { ExpertProfile } from './pages/ExpertProfile';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Calendar } from './pages/Calendar';
import { AiAssistant } from './pages/AiAssistant';

// --- PROTECTOR DE RUTAS PROFESIONAL ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  // ✅ MEJORA: Solo bloqueamos si REALMENTE estamos cargando y NO hay usuario.
  // Si hay un error y el Watchdog de AuthContext libera la carga, esto permitirá pasar.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">Sincronizando Titan</p>
      </div>
    );
  }
  
  // Si no hay usuario tras terminar de cargar, enviamos a login.
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />

      {/* RUTAS PROTEGIDAS */}
      <Route element={
          <ProtectedRoute>
            <DashboardLayout /> 
          </ProtectedRoute>
      }>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/history" element={<History />} />
          <Route path="/dashboard/quick-ideas" element={<QuickIdeas />} />
          <Route path="/dashboard/script-generator" element={<ScriptGenerator />} />
          <Route path="/dashboard/viral-calculator" element={<ViralCalculator />} />
          <Route path="/dashboard/analyze-viral" element={<AnalyzeViral />} />
          <Route path="/dashboard/recreate-viral" element={<TitanViral />} />
          <Route path="/dashboard/transcriptor" element={<TranscribeVideo />} />
          <Route path="/dashboard/avatar-profile" element={<AvatarProfile />} />
          <Route path="/dashboard/expert-profile" element={<ExpertProfile />} />
          <Route path="/dashboard/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/dashboard/calendar" element={<Calendar />} />
          <Route path="/dashboard/ai-assistant" element={<AiAssistant />} />
      </Route>

      {/* Redirecciones de compatibilidad */}
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      <Route path="/quick-ideas" element={<Navigate to="/dashboard/quick-ideas" replace />} />
      <Route path="/script-generator" element={<Navigate to="/dashboard/script-generator" replace />} />
      <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
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
// UPDATE V102: FORZANDO CAMBIO REAL