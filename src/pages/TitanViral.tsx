import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Play, Search, Zap, FileText, BarChart2, 
    Layers, Activity, Eye, Mic, Brain, 
    AlertTriangle, CheckCircle2, ArrowRight, Loader2,
    Clock, ThumbsUp, MessageCircle, Share2, Copy
} from 'lucide-react';

// ==================================================================================
// 📊 INTERFACES (ESPEJO DEL BACKEND PARA ROBUSTEZ)
// ==================================================================================

interface VideoMetadata {
    platform: string;
    author?: string;
    likes?: number;
    views?: number;
    duration?: number;
    engagement_rate?: number;
}

interface AnalysisData {
    score_viral: {
        potencial_total: number;
        factores_exito: string[];
    };
    adn_extraido: {
        gancho: string;
        estructura_exacta: string;
        disparador_psicologico: string;
        idea_ganadora: string;
    };
    desglose_temporal: {
        segundo: string;
        que_pasa: string;
        porque_funciona: string;
    }[];
    titan_ultra_analysis?: {
        sentiment?: { sentiment: string; tone: string };
        visualAnalysis?: { visualStyle: string; productionQuality: number };
    };
    metadata_video?: VideoMetadata; // Legacy support
}

interface TitanResult {
    autopsia?: AnalysisData; // Si es recreate
    guion_generado?: {
        guion_completo: string;
        plan_visual: any[];
    };
    // Si es autopsia pura, los datos están en la raíz
    score_viral?: any;
    adn_extraido?: any;
    desglose_temporal?: any;
    titan_ultra_analysis?: any;
}

// ==================================================================================
// 🎨 COMPONENTE: VISUALIZADOR DE METADATA (ESTADÍSTICAS)
// ==================================================================================
const StatCard = ({ icon: Icon, label, value, color = "text-gray-400" }: any) => (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px]">
        <Icon size={16} className={`mb-1 ${color}`} />
        <span className="text-[10px] text-gray-500 font-bold uppercase">{label}</span>
        <span className="text-sm font-black text-white">{value}</span>
    </div>
);

// ==================================================================================
// 🎨 COMPONENTE: REPORTE DE AUTOPSIA VIRAL
// ==================================================================================
const ViralAutopsyReport = ({ data }: { data: TitanResult }) => {
    // Normalización de datos (Maneja estructura anidada o plana)
    const autopsy = data.autopsia || data;
    const meta = autopsy.titan_ultra_analysis || autopsy.metadata_video || {};
    const score = autopsy.score_viral || { potencial_total: 0, factores_exito: [] };
    const adn = autopsy.adn_extraido || {};
    const timeline = autopsy.desglose_temporal || [];

    // Formateadores
    const formatNumber = (num?: number) => num ? new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num) : '-';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. HEADER & METRICS */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Score Card */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 via-[#0f1115] to-black border border-gray-800 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">SCORE VIRAL</h3>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-6xl font-black tracking-tighter ${score.potencial_total >= 8.5 ? 'text-green-400' : score.potencial_total >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {score.potencial_total}
                            </span>
                            <span className="text-gray-600 text-lg font-bold">/10</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {score.factores_exito?.slice(0,3).map((tag: string, i: number) => (
                                <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-2 gap-2 md:w-1/3">
                    <StatCard icon={Eye} label="Vistas" value={formatNumber(meta.videoStats?.views || meta.views)} color="text-blue-400"/>
                    <StatCard icon={ThumbsUp} label="Likes" value={formatNumber(meta.videoStats?.likes || meta.likes)} color="text-pink-400"/>
                    <StatCard icon={MessageCircle} label="Comentarios" value={formatNumber(meta.videoStats?.comments || meta.comments)} color="text-green-400"/>
                    <StatCard icon={Clock} label="Duración" value={`${meta.videoStats?.duration || meta.duration || 0}s`} color="text-yellow-400"/>
                </div>
            </div>

            {/* 2. ADN ANALYSIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Estructura */}
                <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-purple-500"></div>
                    <h4 className="text-[10px] font-black text-purple-400 uppercase mb-3 flex items-center gap-2">
                        <Brain size={14}/> Estructura Detectada
                    </h4>
                    <p className="text-white text-lg font-bold mb-1">{adn.estructura_exacta}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{adn.idea_ganadora}</p>
                </div>

                {/* Gancho */}
                <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
                    <h4 className="text-[10px] font-black text-blue-400 uppercase mb-3 flex items-center gap-2">
                        <Zap size={14}/> Hook (Gancho)
                    </h4>
                    <p className="text-white text-sm font-medium italic mb-2">"{adn.gancho}"</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Trigger:</span>
                        <span className="text-[10px] text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/20">
                            {adn.disparador_psicologico}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. TIMELINE INTERACTIVO */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5">
                <h4 className="text-[10px] font-black text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <Layers size={14}/> Ingeniería Segundo a Segundo
                </h4>
                <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-800">
                    {timeline.map((step: any, idx: number) => (
                        <div key={idx} className="relative pl-10 group">
                            {/* Dot */}
                            <div className="absolute left-[14px] top-3 w-3 h-3 rounded-full bg-gray-800 border-2 border-[#0a0a0a] group-hover:bg-green-500 transition-colors z-10"></div>
                            
                            <div className="bg-[#0f1115] border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-black text-white bg-white/10 px-2 py-0.5 rounded">{step.segundo}s</span>
                                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                        <CheckCircle2 size={10}/> Retención
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 font-medium mb-1">{step.que_pasa}</p>
                                <p className="text-[10px] text-gray-500 italic border-l-2 border-gray-700 pl-2 mt-2">
                                    "{step.porque_funciona}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

// ==================================================================================
// 🧬 COMPONENTE PRINCIPAL: TITAN VIRAL (CONTROLADOR)
// ==================================================================================

export const TitanViral = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS ---
    const [urlInput, setUrlInput] = useState('');
    const [mode, setMode] = useState<'autopsia_viral' | 'recreate'>('autopsia_viral');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'cloning' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<TitanResult | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // --- MANEJADORES ---
    
    const handleAnalyze = async () => {
        // 1. Validaciones Frontend
        if (!urlInput.trim()) {
            setErrorMsg("La URL no puede estar vacía.");
            return;
        }
        if (!urlInput.includes('http')) {
            setErrorMsg("Ingresa una URL válida (http/https).");
            return;
        }
        
        const cost = mode === 'autopsia_viral' ? 5 : 10;
        if ((userProfile?.credits || 0) < cost) {
            setErrorMsg(`Saldo insuficiente. Necesitas ${cost} créditos.`);
            return;
        }

        // 2. Reset & Loading
        setStatus(mode === 'autopsia_viral' ? 'analyzing' : 'cloning');
        setErrorMsg(null);
        setResult(null);

        try {
            // 3. Llamada al Cerebro (Backend)
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: mode,
                    url: urlInput,
                    estimatedCost: cost,
                    // Contexto enriquecido
                    expertId: userProfile?.active_expert_id,
                    avatarId: userProfile?.active_avatar_id
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || "Error desconocido en el servidor.");

            // 4. Éxito
            setResult(data.generatedData);
            setStatus('success');
            if (refreshProfile) refreshProfile();

        } catch (err: any) {
            console.error("Titan Error:", err);
            setErrorMsg(err.message || "Error de conexión con Titan Brain.");
            setStatus('error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- RENDERIZADO ---

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
            
            {/* HEADER */}
            <div className="pt-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
                        <span className="bg-green-500 text-black px-2 rounded-lg">TV</span> TITAN VIRAL LAB
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-2 max-w-xl">
                        La herramienta de ingeniería inversa más avanzada del mercado. Extrae el ADN de cualquier video viral y clónalo para tu nicho.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-[#0a0a0a] border border-white/10 rounded-full text-[10px] font-bold text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        SYSTEM ONLINE
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 🎮 PANEL DE CONTROL (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 shadow-2xl sticky top-6">
                        
                        {/* Selector de Modo */}
                        <div className="bg-black/40 p-1.5 rounded-xl flex gap-1 mb-6 border border-white/5">
                            <button 
                                onClick={() => setMode('autopsia_viral')}
                                className={`flex-1 py-3 text-xs font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2
                                    ${mode === 'autopsia_viral' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                <Search size={14}/> Autopsia
                            </button>
                            <button 
                                onClick={() => setMode('recreate')}
                                className={`flex-1 py-3 text-xs font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2
                                    ${mode === 'recreate' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                <Zap size={14}/> Clonar ADN
                            </button>
                        </div>

                        {/* Input URL */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest pl-1">
                                    Enlace Fuente (TikTok/IG/YT)
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="Pegar URL aquí..." 
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white text-sm focus:border-green-500 outline-none transition-all shadow-inner group-hover:border-white/20 font-mono"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                        <Search size={12}/>
                                    </div>
                                </div>
                            </div>

                            {/* Botón Acción */}
                            <button 
                                onClick={handleAnalyze} 
                                disabled={status === 'analyzing' || status === 'cloning' || !urlInput}
                                className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all shadow-lg relative overflow-hidden group
                                    ${status === 'analyzing' || status === 'cloning' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-200 text-black shadow-white/5'}
                                `}
                            >
                                {status === 'analyzing' || status === 'cloning' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin text-green-500"/>
                                        <span className="text-green-500">{status === 'cloning' ? 'CLONANDO...' : 'ANALIZANDO...'}</span>
                                    </>
                                ) : (
                                    <>
                                        {mode === 'recreate' ? <Zap size={18} className="group-hover:scale-110 transition-transform"/> : <Activity size={18} className="group-hover:scale-110 transition-transform"/>}
                                        <span>{mode === 'recreate' ? 'CLONAR (10 CR)' : 'ANALIZAR (5 CR)'}</span>
                                    </>
                                )}
                            </button>

                            {/* Error Display */}
                            {errorMsg && (
                                <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16}/>
                                    <p className="text-xs text-red-200 font-medium leading-tight">{errorMsg}</p>
                                </div>
                            )}
                        </div>

                        {/* Info Footer */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">
                                <span>Capacidades Activas</span>
                                <span className="text-green-500">v2.0 Ultra</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <Eye size={12} className="text-blue-400"/>
                                    <span className="text-[9px] text-gray-400">Vision</span>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <Mic size={12} className="text-purple-400"/>
                                    <span className="text-[9px] text-gray-400">Audio</span>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-2 flex flex-col items-center gap-1">
                                    <FileText size={12} className="text-orange-400"/>
                                    <span className="text-[9px] text-gray-400">OCR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📊 RESULTADOS (8 Cols) */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="space-y-8">
                            
                            {/* A) GUION CLONADO (Solo modo Recreate) */}
                            {mode === 'recreate' && result.guion_generado && (
                                <div className="bg-[#0B0E14] border border-green-500/30 rounded-3xl p-8 shadow-xl shadow-green-900/10 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                    
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Zap size={20}/></div>
                                            Guion Clonado (Adaptado)
                                        </h3>
                                        <button 
                                            onClick={() => copyToClipboard(result.guion_generado!.guion_completo)}
                                            className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            {copied ? <CheckCircle2 size={14} className="text-green-400"/> : <Copy size={14}/>}
                                            {copied ? 'COPIADO' : 'COPIAR TEXTO'}
                                        </button>
                                    </div>

                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed p-6 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                                            {result.guion_generado.guion_completo}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button className="text-xs font-bold text-green-400 hover:text-white flex items-center gap-1 transition-colors px-4 py-2 hover:bg-green-500/10 rounded-lg">
                                            GUARDAR EN MIS GUIONES <ArrowRight size={14}/>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* B) REPORTE DE AUTOPSIA (Siempre se muestra) */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Search className="text-blue-500"/> Análisis de ADN Viral
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">Deconstrucción forense del video original</p>
                                    </div>
                                    <span className="text-[10px] bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg font-mono font-bold border border-gray-700">
                                        {result.metadata_video?.platform?.toUpperCase() || 'UNKNOWN SOURCE'}
                                    </span>
                                </div>
                                
                                <ViralAutopsyReport data={result} />
                            </div>

                        </div>
                    ) : (
                        // ESTADO VACÍO (PLACEHOLDER)
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-600 bg-[#0f1115] border border-gray-800 border-dashed rounded-3xl p-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
                            <div className="w-20 h-20 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-6 shadow-xl border border-gray-800">
                                <BarChart2 size={32} className="text-gray-700"/>
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2">Esperando URL del Video</h3>
                            <p className="text-sm text-gray-600 max-w-sm text-center leading-relaxed">
                                El sistema extraerá la estructura, guion, sentimientos y estrategias visuales del video para que puedas replicarlo.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};