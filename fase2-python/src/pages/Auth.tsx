import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Rocket, Mail, Lock, Loader2, ArrowRight, Chrome, LogIn, AlertCircle } from 'lucide-react';

export const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- AUTENTICACIÓN POR EMAIL ---
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // REGISTRO
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('¡Cuenta creada! Por favor, revisa tu email para confirmar o inicia sesión.');
        setIsSignUp(false);
      } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/'); // Éxito: Ir al Dashboard
      }
    } catch (err: any) {
      // Mensajes de error amigables
      let msg = err.message;
      if (msg.includes('Invalid login credentials')) msg = 'Email o contraseña incorrectos.';
      if (msg.includes('User already registered')) msg = 'Este email ya está registrado.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- AUTENTICACIÓN GOOGLE (OAUTH) ---
  const handleOAuthLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Detecta automáticamente si está en local o producción
                redirectTo: `${window.location.origin}/` 
            }
        });
        if (error) throw error;
    } catch (err: any) {
        setError(err.message);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
      
      {/* FONDO AMBIENTAL */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse delay-1000" />

      <div className="w-full max-w-md p-8 bg-[#0B0E14] border border-gray-800 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-5 shadow-lg shadow-indigo-500/30">
            <Rocket className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Titan Apps</h1>
          <p className="text-gray-400 text-sm font-medium">
            {isSignUp ? 'Únete a la élite de creadores virales.' : 'Accede a tu Centro de Comando.'}
          </p>
        </div>

        {/* BOTÓN GOOGLE */}
        <button 
            onClick={handleOAuthLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 shadow-md mb-6 group"
        >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <Chrome size={20} className="text-indigo-400 group-hover:text-white transition-colors"/>} 
            {loading ? 'Conectando...' : (isSignUp ? 'Registrarse con Google' : 'Acceder con Google')}
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0B0E14] px-2 text-gray-500 font-bold">O continúa con Email</span></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-500 transition-colors h-5 w-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all placeholder-gray-600 font-medium"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1.5 uppercase tracking-wider">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-500 transition-colors h-5 w-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all placeholder-gray-600 font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={14}/> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-wider text-xs"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? 'Crear Cuenta Gratis' : 'Iniciar Sesión')}
            {!loading && (isSignUp ? <Rocket size={16} /> : <LogIn size={16} />)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-bold"
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate Gratis'}
          </button>
        </div>
      </div>
    </div>
  );
};