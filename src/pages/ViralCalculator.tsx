import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Activity, RefreshCw, AlertTriangle, CheckCircle2, 
    Wallet, Zap, ShieldCheck, Trophy, Brain, MessageCircle,
    User, Users, BookOpen, Wand2, ArrowRight, Eye, TrendingDown, 
    ArrowLeft, BarChart3, Clock, Target, Flame, Award, Heart,
    Volume2, ThumbsUp, Share2, Sparkles, AlertCircleIcon, Copy,
    ChevronRight, Info, TrendingUp, Layers, Settings
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES Y TIPOS
// ==================================================================================

interface ViralJudgeResult {
    veredicto_final: {
        score_total: number;
        clasificacion: string;
        probabilidad_viral: string;
        confianza_prediccion: string;
    };
    scores_por_eje: {
        retencion: EjeScore;
        identificacion: EjeScore;
        autoridad: EjeScore;
        plataforma: EjeScore;
        viralidad: EjeScore;
    };
    diagnostico_maestro: {
        diagnostico_principal: string;
        error_principal: string;
        mejora_concreta: string;
    };
    optimizaciones_automaticas: {
        hook_reescrito: {
            original: string;
            optimizado: string;
            por_que_funciona: string;
        };
        ajuste_tono: {
            opcion_1: string;
            opcion_2: string;
            opcion_3: string;
        };
        adaptacion_plataforma: {
            cambio_1: string;
            cambio_2: string;
            version_optimizada: string;
        };
    };
    evaluacion_criterios: Array<{
        criterio: string;
        score: number;
        analisis: string;
        sugerencia: string;
        ejemplo_mejorado: string;
    }>;
    fortalezas_clave: string[];
    debilidades_criticas: Array<{
        problema: string;
        impacto: string;
        solucion: string;
    }>;
    optimizaciones_rapidas: string[];
    prediccion_metricas: {
        vistas_estimadas: string;
        engagement_rate: string;
        tiempo_viralizacion: string;
        probabilidad_guardado: string;
        probabilidad_share: string;
    };
    decision_recomendada: string;
    razonamiento_decision: string;
    siguiente_paso_sugerido: string;
}

interface EjeScore {
    score: number;
    clasificacion: string;
    explicacion: string;
    [key: string]: any;
}

// ==================================================================================
// 🎨 CONSTANTES
// ==================================================================================

const MODOS_JUEZ = [
    { 
        id: 'viral', 
        label: 'Viral', 
        icon: Flame, 
        desc: 'Prioriza alcance masivo. Acepta riesgo.',
        color: 'text-orange-400',
        bg: 'bg-orange-900/20',
        border: 'border-orange-500/30'
    },
    { 
        id: 'autoridad', 
        label: 'Autoridad', 
        icon: Award, 
        desc: 'Prioriza posicionamiento y credibilidad.',
        color: 'text-blue-400',
        bg: 'bg-blue-900/20',
        border: 'border-blue-500/30'
    },
    { 
        id: 'estricto', 
        label: 'Estricto', 
        icon: ShieldCheck, 
        desc: 'Evalúa como estratega senior. Marca top.',
        color: 'text-purple-400',
        bg: 'bg-purple-900/20',
        border: 'border-purple-500/30'
    }
];

const PLATAFORMAS = [
    { id: 'TikTok', label: 'TikTok', icon: '🎵' },
    { id: 'Instagram', label: 'Instagram', icon: '📸' },
    { id: 'YouTube', label: 'YouTube', icon: '▶️' },
    { id: 'LinkedIn', label: 'LinkedIn', icon: '💼' }
];

const AUDIT_COST = 2;

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const ViralCalculator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();

    // --- Estados Principales ---
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ViralJudgeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- Configuración del Juez ---
    const [selectedMode, setSelectedMode] = useState('viral');
    const [selectedPlatform, setSelectedPlatform] = useState('TikTok');

    // --- Contexto ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');

    // --- Vista de Optimización ---
    const [showOptimizations, setShowOptimizations] = useState(false);
    const [selectedOptimization, setSelectedOptimization] = useState<'hook' | 'tono' | 'plataforma'>('hook');

    // ==================================================================================
    // 🔄 EFECTOS
    // ==================================================================================

    useEffect(() => {
        if (location.state?.contentToAnalyze) {
            setInputValue(location.state.contentToAnalyze);
        }
        if (user) fetchContextData();
    }, [location, user]);

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase
                .from('expert_profiles')
                .select('id, niche, name')
                .eq('user_id', user?.id);
            if (exp) setExperts(exp.map(e => ({ id: e.id, name: e.name || e.niche || "Experto" })));

            const { data: av } = await supabase
                .from('avatars')
                .select('id, name')
                .eq('user_id', user?.id);
            if (av) setAvatars(av);

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) {
            console.error('[ViralCalculator] Error cargando contexto:', e);
        }
    };

    // ==================================================================================
    // 🎯 FUNCIÓN PRINCIPAL DE ANÁLISIS
    // ==================================================================================

    const handleAnalyze = async () => {
        if (!inputValue.trim()) {
            setError("⚠️ Ingresa el guion o idea a evaluar.");
            return;
        }

        if (!user || !userProfile) return;

        // Verificar créditos
        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < AUDIT_COST) {
            const shouldRecharge = confirm(
                `💰 Saldo insuficiente. Costo: ${AUDIT_COST} créditos. ¿Recargar?`
            );
            if (shouldRecharge) navigate('/dashboard/settings');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setShowOptimizations(false);

        try {
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'juez_viral',
                    userInput: inputValue.trim(),
                    text: inputValue.trim(), // Respaldo
                    expertId: selectedExpertId || undefined,
                    avatarId: selectedAvatarId || undefined,
                    settings: {
                        mode: selectedMode,
                        platform: selectedPlatform
                    },
                    estimatedCost: AUDIT_COST
                }
            });

            if (apiError) throw new Error(apiError.message || 'Error al conectar con el backend');
            if (!data?.success && !data?.generatedData) {
                throw new Error(data?.error || 'El backend devolvió un error desconocido');
            }

            const finalResult = data.generatedData || data;
            setResult(finalResult);

            // Refrescar créditos
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error('[ViralCalculator] Error:', e);
            setError(e.message || "Error inesperado al analizar.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ==================================================================================
    // 🎨 FUNCIONES DE ESTILO
    // ==================================================================================

    const getScoreStyles = (score: number) => {
        if (score >= 90) return { 
            color: 'text-purple-400', 
            border: 'border-purple-500', 
            bg: 'bg-purple-950/20', 
            label: 'VIRAL NUCLEAR',
            glow: 'shadow-purple-500/20'
        };
        if (score >= 75) return { 
            color: 'text-green-400', 
            border: 'border-green-500', 
            bg: 'bg-green-950/20', 
            label: 'BUEN POTENCIAL',
            glow: 'shadow-green-500/20'
        };
        if (score >= 50) return { 
            color: 'text-yellow-400', 
            border: 'border-yellow-500', 
            bg: 'bg-yellow-950/20', 
            label: 'PROMEDIO',
            glow: 'shadow-yellow-500/20'
        };
        return { 
            color: 'text-red-400', 
            border: 'border-red-500', 
            bg: 'bg-red-950/20', 
            label: 'BAJO RENDIMIENTO',
            glow: 'shadow-red-500/20'
        };
    };

    const getEjeIcon = (eje: string) => {
        const icons: any = {
            'retencion': Eye,
            'identificacion': Heart,
            'autoridad': Award,
            'plataforma': Layers,
            'viralidad': Flame
        };
        return icons[eje] || Target;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("✅ Copiado al portapapeles"))
            .catch(() => alert("❌ Error al copiar"));
    };

    // ==================================================================================
    // 🎨 RENDERIZADO
    // ==================================================================================

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* ==================== HEADER ==================== */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-gray-800 rounded-full transition-all text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={24}/>
                </button>
                
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Brain size={12} /> Juez Viral V400
                    </div>
                    <h1 className="text-3xl font-black flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        <Activity size={32} className="text-pink-500" /> 
                        MENTOR ESTRATÉGICO
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Sistema de Evaluación Multi-Eje | Diagnóstico Inteligente | Optimización Automática
                    </p>
                </div>

                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Créditos:</span>
                    <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ==================== PANEL IZQUIERDO: CONFIGURACIÓN ==================== */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 1️⃣ MODO DEL JUEZ */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <Settings size={14} /> 1. Modo de Evaluación
                        </label>
                        <div className="space-y-2">
                            {MODOS_JUEZ.map((modo) => (
                                <button
                                    key={modo.id}
                                    onClick={() => setSelectedMode(modo.id)}
                                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                                        selectedMode === modo.id
                                            ? `${modo.bg} ${modo.border} ${modo.color}`
                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <modo.icon size={18} />
                                        <div className="flex-1">
                                            <span className="font-bold text-sm block">{modo.label}</span>
                                            <p className="text-[10px] opacity-70 mt-0.5">{modo.desc}</p>
                                        </div>
                                        {selectedMode === modo.id && <CheckCircle2 size={16} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2️⃣ PLATAFORMA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            2. Plataforma Objetivo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PLATAFORMAS.map((plat) => (
                                <button
                                    key={plat.id}
                                    onClick={() => setSelectedPlatform(plat.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                                        selectedPlatform === plat.id
                                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                                            : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="text-lg">{plat.icon}</span>
                                    {plat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3️⃣ CONTEXTO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                            <ShieldCheck size={14} /> 3. Contexto del Análisis
                        </label>
                        
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                                <User size={14}/>
                            </div>
                            <select 
                                value={selectedExpertId} 
                                onChange={(e) => setSelectedExpertId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="">-- Sin experto --</option>
                                {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400">
                                <Users size={14}/>
                            </div>
                            <select 
                                value={selectedAvatarId} 
                                onChange={(e) => setSelectedAvatarId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-pink-500 appearance-none"
                            >
                                <option value="">-- Sin avatar --</option>
                                {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 4️⃣ CONTENIDO A EVALUAR */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col" style={{ minHeight: '400px' }}>
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            4. Contenido a Evaluar
                        </label>
                        <textarea 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pega aquí tu guion, idea o caption para someterlo al Juez Viral..."
                            className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-pink-500/50 resize-none font-medium placeholder:text-gray-700 shadow-inner leading-relaxed"
                        />
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs animate-in slide-in-from-top-2">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 🚀 BOTÓN DE ANÁLISIS */}
                    <button 
                        onClick={handleAnalyze} 
                        disabled={!inputValue.trim() || isAnalyzing}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isAnalyzing ? (
                            <>
                                <RefreshCw className="animate-spin" size={20}/>
                                ANALIZANDO COMPORTAMIENTO...
                            </>
                        ) : (
                            <>
                                <Brain size={20} className="group-hover:rotate-12 transition-transform"/>
                                EMITIR JUICIO ({AUDIT_COST} CR)
                            </>
                        )}
                    </button>
                </div>

                {/* ==================== PANEL DERECHO: RESULTADOS ==================== */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in slide-in-from-right-10 max-h-[1000px] overflow-y-auto custom-scrollbar">
                            
                            {/* HEADER DEL VEREDICTO */}
                            <div className="flex justify-between items-start pb-6 border-b border-gray-800">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${getScoreStyles(result.veredicto_final?.score_total || 0).color}`}>
                                        {result.veredicto_final?.clasificacion || "EVALUACIÓN COMPLETADA"}
                                    </p>
                                    <h2 className="text-6xl font-black text-white">
                                        {result.veredicto_final?.score_total || 0}
                                        <span className="text-xl text-gray-600">/100</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Confianza: {result.veredicto_final?.confianza_prediccion || "Media"}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                                        <Flame size={14} className="text-orange-400"/>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 uppercase font-bold">Viralidad</p>
                                            <p className="text-xs font-bold text-white">{result.veredicto_final?.probabilidad_viral || "?"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                                        <Eye size={14} className="text-blue-400"/>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 uppercase font-bold">Vistas Est.</p>
                                            <p className="text-xs font-bold text-white">{result.prediccion_metricas?.vistas_estimadas || "?"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                                        <ThumbsUp size={14} className="text-green-400"/>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 uppercase font-bold">Engagement</p>
                                            <p className="text-xs font-bold text-white">{result.prediccion_metricas?.engagement_rate || "?"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DIAGNÓSTICO MAESTRO */}
                            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                
                                <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Brain size={16}/> Diagnóstico del Mentor
                                </h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">📊 Diagnóstico Principal:</span>
                                        <p className="text-white font-bold text-sm">{result.diagnostico_maestro?.diagnostico_principal}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">⚠️ Error Principal:</span>
                                        <p className="text-red-400 font-medium text-sm">{result.diagnostico_maestro?.error_principal}</p>
                                    </div>
                                    
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">💡 Mejora Concreta:</span>
                                        <p className="text-gray-300 text-sm whitespace-pre-line">{result.diagnostico_maestro?.mejora_concreta}</p>
                                    </div>
                                </div>
                            </div>

                            {/* SCORES POR EJE */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <BarChart3 size={14}/> Evaluación Multi-Eje
                                </h3>
                                
                                {result.scores_por_eje && Object.entries(result.scores_por_eje).map(([eje, data]: [string, any]) => {
                                    const Icon = getEjeIcon(eje);
                                    const styles = getScoreStyles(data.score);
                                    
                                    return (
                                        <div key={eje} className={`${styles.bg} border ${styles.border} p-4 rounded-xl`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={16} className={styles.color}/>
                                                    <span className="font-bold text-sm text-white capitalize">{eje}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded ${styles.bg} ${styles.color} border ${styles.border} font-bold`}>
                                                        {data.clasificacion}
                                                    </span>
                                                    <span className={`text-lg font-black ${styles.color}`}>{data.score}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400">{data.explicacion}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* OPTIMIZACIONES AUTOMÁTICAS */}
                            {result.optimizaciones_automaticas && (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Wand2 size={14}/> Optimizaciones Automáticas
                                        </h3>
                                        <button
                                            onClick={() => setShowOptimizations(!showOptimizations)}
                                            className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-3 py-1 rounded-lg transition-colors font-bold uppercase flex items-center gap-1"
                                        >
                                            {showOptimizations ? 'Ocultar' : 'Ver Opciones'}
                                            <ChevronRight size={12} className={`transition-transform ${showOptimizations ? 'rotate-90' : ''}`}/>
                                        </button>
                                    </div>

                                    {showOptimizations && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2">
                                            {/* Tabs */}
                                            <div className="flex gap-2 border-b border-gray-800 pb-2">
                                                {(['hook', 'tono', 'plataforma'] as const).map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setSelectedOptimization(opt)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                                            selectedOptimization === opt
                                                                ? 'bg-indigo-500 text-white'
                                                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {opt === 'hook' ? '🎣 Hook' : opt === 'tono' ? '🎭 Tono' : '📱 Plataforma'}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Contenido según tab seleccionado */}
                                            {selectedOptimization === 'hook' && result.optimizaciones_automaticas.hook_reescrito && (
                                                <div className="space-y-3">
                                                    <div className="bg-black/40 rounded-xl p-4 border border-red-500/20">
                                                        <span className="text-[10px] text-red-400 uppercase font-bold block mb-2">❌ Original:</span>
                                                        <p className="text-gray-400 text-sm">{result.optimizaciones_automaticas.hook_reescrito.original}</p>
                                                    </div>
                                                    <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] text-green-400 uppercase font-bold">✅ Optimizado:</span>
                                                            <button
                                                                onClick={() => copyToClipboard(result.optimizaciones_automaticas.hook_reescrito.optimizado)}
                                                                className="text-[10px] bg-green-500/20 hover:bg-green-500/40 text-green-300 px-2 py-1 rounded transition-colors font-bold"
                                                            >
                                                                <Copy size={10} className="inline mr-1"/> Copiar
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-200 text-sm font-medium">{result.optimizaciones_automaticas.hook_reescrito.optimizado}</p>
                                                        <p className="text-xs text-gray-500 mt-2 italic">💡 {result.optimizaciones_automaticas.hook_reescrito.por_que_funciona}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedOptimization === 'tono' && result.optimizaciones_automaticas.ajuste_tono && (
                                                <div className="space-y-2">
                                                    {Object.entries(result.optimizaciones_automaticas.ajuste_tono).map(([key, value]) => (
                                                        <div key={key} className="bg-black/40 rounded-xl p-4 border border-gray-700 hover:border-indigo-500/30 transition-colors group">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] text-indigo-400 uppercase font-bold">
                                                                    {key === 'opcion_1' ? '🔥 Agresivo' : key === 'opcion_2' ? '💙 Empático' : '🧠 Técnico'}
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboard(value as string)}
                                                                    className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-2 py-1 rounded transition-all font-bold"
                                                                >
                                                                    <Copy size={10} className="inline mr-1"/> Copiar
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedOptimization === 'plataforma' && result.optimizaciones_automaticas.adaptacion_plataforma && (
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <Sparkles size={12} className="text-yellow-500"/>
                                                            <span>{result.optimizaciones_automaticas.adaptacion_plataforma.cambio_1}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <Sparkles size={12} className="text-yellow-500"/>
                                                            <span>{result.optimizaciones_automaticas.adaptacion_plataforma.cambio_2}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-black/40 rounded-xl p-4 border border-gray-700">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] text-green-400 uppercase font-bold">✨ Versión Optimizada:</span>
                                                            <button
                                                                onClick={() => copyToClipboard(result.optimizaciones_automaticas.adaptacion_plataforma.version_optimizada)}
                                                                className="text-[10px] bg-green-500/20 hover:bg-green-500/40 text-green-300 px-2 py-1 rounded transition-colors font-bold"
                                                            >
                                                                <Copy size={10} className="inline mr-1"/> Copiar
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{result.optimizaciones_automaticas.adaptacion_plataforma.version_optimizada}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORTALEZAS Y DEBILIDADES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fortalezas */}
                                {result.fortalezas_clave && result.fortalezas_clave.length > 0 && (
                                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                                        <h4 className="text-green-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={14}/> Fortalezas
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {result.fortalezas_clave.map((f, i) => (
                                                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0"/>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Debilidades */}
                                {result.debilidades_criticas && result.debilidades_criticas.length > 0 && (
                                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                                        <h4 className="text-red-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <AlertCircleIcon size={14}/> Puntos Críticos
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.debilidades_criticas.map((d, i) => (
                                                <li key={i} className="text-xs">
                                                    <p className="text-red-400 font-bold mb-0.5">⚠️ {d.problema}</p>
                                                    <p className="text-gray-400 text-[10px]">💡 {d.solucion}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* OPTIMIZACIONES RÁPIDAS */}
                            {result.optimizaciones_rapidas && result.optimizaciones_rapidas.length > 0 && (
                                <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl">
                                    <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Zap size={14}/> Cirugía Rápida (+Impacto Inmediato)
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optimizaciones_rapidas.map((opt, i) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-yellow-500 mt-0.5">⚡</span>
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* DECISIÓN FINAL */}
                            <div className="space-y-3">
                                <div className={`p-4 rounded-xl text-center border font-bold text-sm uppercase tracking-widest ${
                                    (result.decision_recomendada || "").includes("PUBLICAR") 
                                        ? 'bg-green-900/20 border-green-500 text-green-400' 
                                        : (result.decision_recomendada || "").includes("OPTIMIZAR")
                                        ? 'bg-yellow-900/20 border-yellow-500 text-yellow-400'
                                        : 'bg-red-900/20 border-red-500 text-red-400'
                                }`}>
                                    DECISIÓN: {result.decision_recomendada || "REVISIÓN REQUERIDA"}
                                </div>
                                
                                {result.razonamiento_decision && (
                                    <p className="text-xs text-gray-400 text-center italic">
                                        {result.razonamiento_decision}
                                    </p>
                                )}
                                
                                {result.siguiente_paso_sugerido && (
                                    <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl">
                                        <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-2 flex items-center gap-1">
                                            <ArrowRight size={12}/> Siguiente Paso:
                                        </span>
                                        <p className="text-sm text-white font-medium">{result.siguiente_paso_sugerido}</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        // ESTADO VACÍO
                        <div className="h-full min-h-[700px] border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/10">
                            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                <Activity size={32} className="text-gray-700" />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2">Sala de Juicio Vacía</h3>
                            <p className="text-gray-600 text-sm max-w-[280px] leading-relaxed">
                                Pega tu contenido a la izquierda y configura el modo de evaluación para recibir tu veredicto viral.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* SCROLLBAR CUSTOM */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
            `}</style>
        </div>
    );
};