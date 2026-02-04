import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Zap, Search, Copy, CheckCircle2, AlertTriangle, 
    Loader2, ArrowRight, Target, Brain, BarChart3, 
    Layers, Fingerprint, Film
} from 'lucide-react';

// ==================================================================================
// 🎨 COMPONENTE: VISUALIZADOR DEL GUION CLONADO (EL PRODUCTO FINAL)
// ==================================================================================
const ClonedScriptView = ({ scriptData, topic }: { scriptData: any, topic: string }) => {
    const [copied, setCopied] = useState(false);

    const copyScript = () => {
        if (!scriptData?.guion_completo) return;
        navigator.clipboard.writeText(scriptData.guion_completo);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#080808] border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(34,197,94,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header del Guion */}
            <div className="bg-green-900/10 border-b border-green-500/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            LISTO PARA GRABAR
                        </span>
                        <span className="text-gray-500 text-xs font-mono uppercase">Adaptado a: {topic}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Fingerprint className="text-green-400" size={20}/> Guion de Ingeniería Inversa
                    </h3>
                </div>
                <button 
                    onClick={copyScript}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                    {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}
                    {copied ? 'Copiado' : 'Copiar Guion'}
                </button>
            </div>

            {/* Cuerpo del Guion */}
            <div className="p-0 md:p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    {/* Columna Izquierda: Plan Visual */}
                    <div className="lg:col-span-1 border-r border-white/5 bg-white/[0.02] p-6 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Film size={12}/> Plan Visual Sugerido
                        </h4>
                        {scriptData.plan_visual?.map((scene: any, idx: number) => (
                            <div key={idx} className="relative pl-4 border-l border-gray-800 text-xs">
                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-700"></div>
                                <span className="text-green-400 font-mono font-bold block mb-1">{scene.tiempo}</span>
                                <p className="text-gray-300 leading-snug">{scene.accion_en_pantalla || scene.accion_adaptada}</p>
                            </div>
                        ))}
                    </div>

                    {/* Columna Derecha: El Texto (Teleprompter) */}
                    <div className="lg:col-span-2 p-8 bg-[#0a0a0a]">
                        <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-200">
                                {scriptData.guion_completo}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================================================================================
// 🧬 COMPONENTE: ANÁLISIS DE ADN (LA ESTRUCTURA)
// ==================================================================================
const ViralDnaAnalysis = ({ dnaData }: { dnaData: any }) => {
    const score = dnaData.score_viral || { potencial_total: 0 };
    const adn = dnaData.adn_extraido || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in duration-1000 delay-200">
            
            {/* Score Card */}
            <div className="bg-[#0f1115] border border-white/5 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Potencial Viral</span>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black ${score.potencial_total > 8 ? 'text-green-400' : 'text-blue-400'}`}>
                            {score.potencial_total}
                        </span>
                        <span className="text-gray-600 text-sm font-bold">/10</span>
                    </div>
                </div>
                <div className="h-12 w-px bg-white/10 mx-4"></div>
                <div className="flex-1">
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Gancho Detectado</span>
                    <p className="text-white text-xs font-medium italic line-clamp-2">"{adn.gancho}"</p>
                </div>
            </div>

            {/* Structure Card */}
            <div className="bg-[#0f1115] border border-white/5 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-2 flex items-center gap-1">
                    <Brain size={12}/> Estructura Lógica
                </span>
                <p className="text-white text-sm font-bold">{adn.estructura_exacta || "Estructura Viral Estándar"}</p>
                <p className="text-gray-500 text-[10px] mt-1">{adn.idea_ganadora}</p>
            </div>
        </div>
    );
};

// ==================================================================================
// 🚀 COMPONENTE PRINCIPAL: TITAN CLONING LAB
// ==================================================================================

export const TitanViral = () => {
    const { userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS ---
    const [urlInput, setUrlInput] = useState('');
    const [topicInput, setTopicInput] = useState(''); // 🔥 NUEVO: Tema para adaptar
    const [mode, setMode] = useState<'recreate' | 'autopsia_viral'>('recreate'); // Por defecto RECREATE (Lo que el usuario quiere)
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // --- LÓGICA DE NEGOCIO ---
    const handleAction = async () => {
        // 1. Validaciones
        if (!urlInput.trim()) return setErrorMsg("Necesito una URL para extraer el ADN.");
        if (mode === 'recreate' && !topicInput.trim()) return setErrorMsg("Dime sobre qué TEMA quieres adaptar el guion.");
        
        const cost = mode === 'recreate' ? 10 : 5;
        if ((userProfile?.credits || 0) < cost) return setErrorMsg(`Créditos insuficientes. Requieres ${cost}.`);

        setLoading(true);
        setErrorMsg(null);
        setResult(null);

        try {
            // 2. Llamada al Backend (Cerebro)
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: mode,
                    url: urlInput,
                    estimatedCost: cost,
                    // 🔥 CLAVE: Enviamos el tema objetivo para que la IA adapte el guion
                    text: topicInput, // El backend usa 'text' o 'processedContext' como input secundario
                    expertId: userProfile?.active_expert_id // Contexto del experto
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || "Error en el procesamiento.");

            setResult(data.generatedData);
            if (refreshProfile) refreshProfile();

        } catch (err: any) {
            setErrorMsg(err.message || "Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-24 px-4 sm:px-6 pt-8 animate-in fade-in duration-500">
            
            {/* HEADER PROFESIONAL */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-widest mb-4">
                    <Zap size={10} fill="currentColor"/> Módulo de Ingeniería Inversa v2.0
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                    CLONA EL <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">ADN VIRAL</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
                    No reinventes la rueda. Toma un video que ya funciona, extrae su estructura matemática y adáptalo a tu nicho automáticamente.
                </p>
            </div>

            {/* 🎮 PANEL DE CONTROL DE CLONACIÓN */}
            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-1 shadow-2xl max-w-3xl mx-auto relative z-10">
                
                {/* TABS SELECTOR */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 rounded-2xl mb-1">
                    <button 
                        onClick={() => setMode('recreate')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${mode === 'recreate' ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg border border-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Fingerprint size={16} className={mode === 'recreate' ? 'text-green-400' : ''}/>
                        Clonar & Adaptar
                    </button>
                    <button 
                        onClick={() => setMode('autopsia_viral')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${mode === 'autopsia_viral' ? 'bg-gray-800 text-white shadow-lg border border-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Search size={16} className={mode === 'autopsia_viral' ? 'text-blue-400' : ''}/>
                        Solo Analizar
                    </button>
                </div>

                {/* FORMULARIO */}
                <div className="p-6 space-y-5">
                    
                    {/* INPUT 1: URL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">1. Video de Referencia (Origen)</label>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="Pega aquí el link de TikTok, Reels o YouTube..." 
                                className="w-full bg-[#080808] border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all font-mono"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                                <Search size={12}/>
                            </div>
                        </div>
                    </div>

                    {/* INPUT 2: TEMA OBJETIVO (Solo aparece en modo RECREATE) */}
                    {mode === 'recreate' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                                2. Tu Nicho / Tema (Destino) <span className="text-green-500 text-[9px] bg-green-900/20 px-1.5 py-0.5 rounded">CRÍTICO</span>
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={topicInput}
                                    onChange={(e) => setTopicInput(e.target.value)}
                                    placeholder="Ej: Marketing Inmobiliario, Nutrición Keto, Finanzas..." 
                                    className="w-full bg-[#080808] border border-green-500/20 rounded-xl py-4 pl-11 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-900/30 rounded flex items-center justify-center text-green-400">
                                    <Target size={12}/>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 pl-1">
                                La IA tomará la estructura del video viral y reescribirá el guion para hablar de <b>este tema</b>.
                            </p>
                        </div>
                    )}

                    {/* BOTÓN DE ACCIÓN */}
                    <button 
                        onClick={handleAction} 
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg relative overflow-hidden mt-2
                            ${loading 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                : mode === 'recreate' 
                                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black shadow-green-500/20 hover:shadow-green-500/30' 
                                    : 'bg-white hover:bg-gray-200 text-black'
                            }
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin"/>
                                <span>{mode === 'recreate' ? 'EXTRAYENDO ADN & REESCRIBIENDO...' : 'ANALIZANDO ESTRUCTURA...'}</span>
                            </>
                        ) : (
                            <>
                                {mode === 'recreate' ? <Zap size={18} fill="currentColor"/> : <Layers size={18}/>}
                                <span>{mode === 'recreate' ? 'GENERAR CLON ADAPTADO (10 CR)' : 'DECODIFICAR VIDEO (5 CR)'}</span>
                            </>
                        )}
                    </button>

                    {/* ERROR MSG */}
                    {errorMsg && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-200 text-xs font-medium animate-in fade-in">
                            <AlertTriangle size={16}/> {errorMsg}
                        </div>
                    )}
                </div>
            </div>

            {/* 📊 RESULTADOS */}
            {result && (
                <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    
                    {/* A) EL GUION CLONADO (Lo más importante arriba) */}
                    {mode === 'recreate' && result.guion_generado && (
                        <div>
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent flex-1"></div>
                                <h2 className="text-green-400 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Target size={14}/> Resultado: Clon Adaptado
                                </h2>
                                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent flex-1"></div>
                            </div>
                            <ClonedScriptView scriptData={result.guion_generado} topic={topicInput} />
                        </div>
                    )}

                    {/* B) EL ANÁLISIS DE ADN (Contexto) */}
                    <div>
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="h-px bg-gray-800 flex-1"></div>
                            <h2 className="text-gray-500 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                                <Brain size={14}/> ADN del Video Original
                            </h2>
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </div>
                        {/* Pasamos autopsia si es recreate, o result directo si es análisis puro */}
                        <ViralDnaAnalysis dnaData={mode === 'recreate' ? result.autopsia : result} />
                    </div>

                </div>
            )}

        </div>
    );
};