import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Zap, Search, Copy, CheckCircle2, AlertTriangle, 
    Loader2, Target, Brain, 
    Film, Flame, Clapperboard, Sparkles, MoveRight
} from 'lucide-react';

// ==================================================================================
// 🧠 COMPONENTE: ESTRATEGIA OMEGA (VISUALIZACIÓN DE INTELIGENCIA)
// ==================================================================================
const OmegaStrategy = ({ analysis }: { analysis: any }) => {
    if (!analysis) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {/* Tarjeta 1: Sesgo Cognitivo */}
            <div className="bg-[#0f1115] border border-purple-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Brain size={60} /></div>
                <h4 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Brain size={12}/> Psicología Aplicada
                </h4>
                <p className="text-white text-sm font-bold leading-relaxed">{analysis.sesgo_cognitivo_detectado}</p>
                <div className="mt-3 px-2 py-1 bg-purple-500/10 rounded text-purple-300 text-[10px] font-mono inline-block border border-purple-500/20">
                    TRIGGER ACTIVO
                </div>
            </div>

            {/* Tarjeta 2: Estrategia de Adaptación */}
            <div className="col-span-2 bg-[#0f1115] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Target size={60} /></div>
                <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Target size={12}/> Estrategia de Adaptación
                </h4>
                <p className="text-white text-sm font-medium leading-relaxed">"{analysis.estrategia_adaptacion}"</p>
                
                <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-400" 
                            style={{ width: analysis.nivel_fidelidad || '98%' }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-green-400 font-black tracking-wider">
                        {analysis.nivel_fidelidad || '99%'} FIDELIDAD ESTRUCTURAL
                    </span>
                </div>
            </div>
        </div>
    );
};

// ==================================================================================
// 🎬 COMPONENTE: GUION TÉCNICO (RESULTADO FINAL)
// ==================================================================================
const OmegaScriptView = ({ scriptData }: { scriptData: any }) => {
    const [copied, setCopied] = useState(false);

    // Detectar qué campo viene del backend (Compatibilidad con versiones anteriores)
    const scriptText = scriptData.guion_tecnico_completo || scriptData.guion_completo;
    const visualPlan = scriptData.plan_visual_director || scriptData.plan_visual;

    const copyScript = () => {
        if (!scriptText) return;
        navigator.clipboard.writeText(scriptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#080808] border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_-20px_rgba(34,197,94,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header del Guion */}
            <div className="bg-green-900/10 border-b border-green-500/20 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            READY TO SHOOT
                        </span>
                    </div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                        <Clapperboard className="text-green-400" size={20}/> GUION DE PRODUCCIÓN
                    </h3>
                </div>
                <button 
                    onClick={copyScript}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-green-900/20 active:scale-95 w-full sm:w-auto justify-center"
                >
                    {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}
                    {copied ? 'COPIADO' : 'COPIAR TELEPROMPTER'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                
                {/* COLUMNA IZQUIERDA: Dirección de Director (4 cols) */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0c0c0c] flex flex-col">
                    <div className="p-4 border-b border-white/5 bg-[#0f1115] sticky top-0 z-10">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Film size={12}/> Dirección de Cámara & Audio
                        </h4>
                    </div>
                    
                    <div className="p-6 space-y-8 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800">
                        {visualPlan?.map((scene: any, idx: number) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-gray-800 text-xs group hover:border-green-500/50 transition-colors">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-800 border border-gray-700 group-hover:bg-green-500 group-hover:border-green-400 transition-colors"></div>
                                
                                <span className="text-green-400 font-mono font-bold block mb-2 text-[10px] bg-green-900/10 inline-block px-1 rounded">
                                    {scene.tiempo}
                                </span>
                                
                                {/* Acción de Cámara (Nuevo Omega) */}
                                {scene.accion_camara && (
                                    <div className="mb-2 text-blue-300 font-bold flex items-start gap-1.5 leading-tight">
                                        <span className="opacity-50 mt-0.5">🎥</span> 
                                        {scene.accion_camara}
                                    </div>
                                )}
                                
                                {/* Descripción Visual */}
                                <p className="text-gray-300 font-medium leading-relaxed mb-2">
                                    {scene.descripcion_visual || scene.accion_adaptada}
                                </p>
                                
                                {/* Efectos de Sonido (Nuevo Omega) */}
                                {scene.audio_sfx && (
                                    <div className="mt-2 pt-2 border-t border-white/5 text-orange-400/90 text-[10px] font-mono flex items-center gap-1.5">
                                        <span className="opacity-70">🔊</span> {scene.audio_sfx}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: Teleprompter (8 cols) */}
                <div className="lg:col-span-8 bg-[#080808] p-8 flex flex-col">
                    <div className="prose prose-invert max-w-none flex-1">
                        <div className="whitespace-pre-wrap font-mono text-base md:text-lg leading-loose text-gray-200 selection:bg-green-500/30">
                            {scriptText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================================================================================
// 🚀 COMPONENTE PRINCIPAL: TITAN ENGINE
// ==================================================================================

export const TitanViral = () => {
    const { userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS ---
    const [urlInput, setUrlInput] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // --- MANEJADOR DE CLONACIÓN ---
    const handleClone = async () => {
        // 1. Validaciones
        if (!urlInput.trim()) return setErrorMsg("Necesito una URL para extraer el ADN.");
        if (!topicInput.trim()) return setErrorMsg("Dime sobre qué TEMA quieres adaptar el guion.");
        
        // Costo fijo para Clonación Omega
        const cost = 10; 
        if ((userProfile?.credits || 0) < cost) return setErrorMsg(`Créditos insuficientes. Requieres ${cost} créditos.`);

        setLoading(true);
        setErrorMsg(null);
        setResult(null);

        try {
            // 2. Llamada al Backend Omega
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'recreate', // Forzamos modo "recreate" (Clonación)
                    url: urlInput,
                    estimatedCost: cost,
                    text: topicInput, // Pasamos el tema para el Prompt Omega
                    expertId: userProfile?.active_expert_id // Contexto del experto si existe
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || "Error desconocido en el procesamiento.");

            // 3. Éxito
            setResult(data.generatedData);
            
            // Refrescar créditos en la UI
            if (refreshProfile) refreshProfile();

        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Error de conexión con Titan Brain.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 pt-12 animate-in fade-in duration-700">
            
            {/* 1. HEADER HERO */}
            <div className="text-center mb-16 relative">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 blur-[100px] pointer-events-none rounded-full"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1115] border border-green-500/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest mb-6 shadow-lg shadow-green-900/10 hover:shadow-green-500/20 transition-shadow cursor-default">
                        <Flame size={12} fill="currentColor"/> Titan Engine Omega v3.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        CLONACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">VIRAL</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        No adivines. Extrae la ingeniería matemática de un video viral y 
                        replícala en tu nicho con precisión quirúrgica.
                    </p>
                </div>
            </div>

            {/* 2. PANEL DE CONTROL (INPUTS) */}
            <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 shadow-2xl relative z-20">
                <div className="bg-[#0f1115] rounded-[1.5rem] p-6 md:p-8 space-y-6 border border-white/5">
                    
                    {/* Input URL */}
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 flex justify-between">
                            <span>1. Video Origen (Viral)</span>
                            <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity text-[9px]">TIKTOK / REELS / YOUTUBE</span>
                        </label>
                        <div className="relative transition-transform group-focus-within:scale-[1.01] duration-200">
                            <input 
                                type="text" 
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="Pega aquí el enlace del video..." 
                                className="w-full bg-[#080808] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all font-mono shadow-inner"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><Search size={18}/></div>
                        </div>
                    </div>

                    {/* Input Tema (Con flecha visual) */}
                    <div className="flex justify-center -my-2 opacity-30">
                        <MoveRight className="rotate-90 md:rotate-0" size={24}/>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">2. Tu Nicho / Tema (Destino)</label>
                        <div className="relative transition-transform group-focus-within:scale-[1.01] duration-200">
                            <input 
                                type="text" 
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                placeholder="Ej: Marketing para Dentistas, Recetas Keto..." 
                                className="w-full bg-[#080808] border border-green-500/20 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all shadow-inner"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"><Target size={18}/></div>
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <button 
                        onClick={handleClone} 
                        disabled={loading}
                        className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg mt-4 relative overflow-hidden group
                            ${loading 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                : 'bg-white hover:bg-gray-100 text-black shadow-white/5 hover:shadow-white/20 transform hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin text-green-600"/>
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                                    EXTRAYENDO ADN VIRAL...
                                </span>
                            </>
                        ) : (
                            <>
                                <Zap size={20} className="group-hover:scale-110 transition-transform"/>
                                <span>EJECUTAR CLONACIÓN (10 CR)</span>
                            </>
                        )}
                    </button>

                    {/* Mensajes de Error */}
                    {errorMsg && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 text-xs font-medium animate-in slide-in-from-top-2">
                            <AlertTriangle size={16} className="shrink-0 text-red-500"/> 
                            {errorMsg}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. ZONA DE RESULTADOS */}
            {result && result.guion_generado && (
                <div className="mt-20 space-y-10 animate-in slide-in-from-bottom-10 duration-1000">
                    
                    {/* Divisor Visual */}
                    <div className="flex items-center justify-center gap-6 opacity-60">
                        <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40"></div>
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Sparkles size={12} /> PROCESO FINALIZADO
                        </span>
                        <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40"></div>
                    </div>

                    {/* Componentes de Resultado */}
                    <div className="space-y-8">
                        {/* Estrategia (Arriba) */}
                        <OmegaStrategy analysis={result.guion_generado.analisis_estrategico} />
                        
                        {/* Guion (Abajo - La Estrella) */}
                        <OmegaScriptView scriptData={result.guion_generado} />
                    </div>

                </div>
            )}
        </div>
    );
};