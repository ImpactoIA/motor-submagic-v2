import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Video, Instagram, Youtube, Linkedin, Facebook, 
    Lightbulb, RefreshCw, Rocket, Copy, ArrowRight, 
    Wallet, User, Users, BookOpen, AlertCircle, Save, CheckCircle2,
    TrendingUp, Zap, Star, Crown // ← NUEVOS ÍCONOS
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURACIÓN
// ==================================================================================

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/50' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
    { id: 'Facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-900/20', border: 'border-blue-600/50' }
];

// ✅ INTERFAZ MEJORADA CON TODOS LOS CAMPOS
interface IdeaItem {
    id: number;
    titulo: string;
    concepto: string;
    disparador_principal?: string;
    gancho_sugerido?: string;
    potencial_viral?: number; // ← AHORA LO USAMOS
    razon_potencia?: string;
    formato_visual?: string;
    angulo?: string;
    cta_sugerido?: string;
    plataforma_ideal?: string;
    duracion_recomendada?: string;
    dificultad_produccion?: string;
    keywords?: string[];
}

interface ResponseData {
    ideas: IdeaItem[];
    recomendacion_top?: {
        idea_id: number;
        razon: string;
        plan_rapido?: string;
    };
    insights_estrategicos?: {
        tendencia_detectada?: string;
        brecha_mercado?: string;
        advertencia?: string;
    };
}

export const QuickIdeas = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [amount, setAmount] = useState(3); 
    
    // --- ESTADOS CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- ESTADOS PROCESO ---
    const [isGenerating, setIsGenerating] = useState(false);
    const [ideas, setIdeas] = useState<IdeaItem[]>([]);
    const [responseData, setResponseData] = useState<ResponseData | null>(null); // ← NUEVO
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null); 

    // 🔥 CÁLCULO DE COSTO EXACTO
    const currentCost = amount === 10 ? 7 : 3;

    // --- CARGAR DATOS ---
    useEffect(() => {
        if (!user) return;
        const fetchProfiles = async () => {
            const { data: exp } = await supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id);
            if (exp) setExperts(exp);
            
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
            if (av) setAvatars(av);

            const { data: kb } = await supabase.from('documents').select('id, title').eq('user_id', user.id);
            if (kb) setKnowledgeBases(kb);

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
        };
        fetchProfiles();
    }, [user, userProfile]);

    // ==================================================================================
    // 2. FUNCIÓN GENERAR (MEJORADA)
    // ==================================================================================
    const handleGenerate = async () => {
        if (!topic.trim()) return setError("Escribe un tema primero.");
        setError(null);

        // 1. Validar Saldo
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < currentCost) {
            if(confirm(`⚠️ Saldo insuficiente (${userProfile?.credits} cr). Necesitas ${currentCost}. ¿Recargar?`)) navigate('/dashboard/settings');
            return;
        }

        setIsGenerating(true);
        setIdeas([]);
        setResponseData(null); // ← LIMPIAR

        try {
            // ✅ BODY MEJORADO CON CAMPOS ESPECÍFICOS
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'ideas_rapidas',
                    topic: topic, // ← CAMPO ESPECÍFICO
                    userInput: topic, // ← FALLBACK
                    settings: {
                        quantity: amount, 
                        platform: selectedPlatform.label // ← AHORA SE USA EN EL BACKEND
                    },
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: currentCost
                },
            });

            if (apiError) throw apiError;
            if (!data?.generatedData?.ideas) throw new Error("No se recibieron ideas válidas.");

            // ✅ GUARDAR TODO EL RESPONSE
            setResponseData(data.generatedData);
            setIdeas(data.generatedData.ideas);
            
            if(refreshProfile) refreshProfile(); 

        } catch (e: any) {
            console.error("Error:", e);
            setError(e.message || "Error al generar ideas.");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- GUARDAR IDEA INDIVIDUAL ---
    const handleSaveIdea = async (idea: IdeaItem, idx: number) => {
        if (!user) return;
        setSavingId(idx);
        try {
            await supabase.from('content_items').insert({
                user_id: user.id,
                type: 'idea',
                title: idea.titulo,
                content: idea, 
                status: 'draft',
                platform: selectedPlatform.label
            });
            setTimeout(() => setSavingId(null), 1000);
        } catch (e) {
            alert("Error al guardar");
            setSavingId(null);
        }
    };

    // --- ENVIAR AL GENERADOR DE GUIONES ---
    const handleGoToEditor = (idea: IdeaItem) => {
        navigate('/dashboard/script-generator', { 
            state: { 
                topic: idea.titulo,
                hook: idea.gancho_sugerido || idea.concepto,
                platform: selectedPlatform.label,
                fromIdeas: true 
            } 
        });
    };

    // ✅ FUNCIÓN HELPER: COLOR DEL SCORE
    const getScoreColor = (score?: number) => {
        if (!score) return 'text-gray-500';
        if (score >= 9) return 'text-green-400';
        if (score >= 7) return 'text-yellow-400';
        if (score >= 5) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreLabel = (score?: number) => {
        if (!score) return 'N/A';
        if (score >= 9) return 'VIRAL';
        if (score >= 7) return 'ALTO';
        if (score >= 5) return 'MEDIO';
        return 'BAJO';
    };

    // ==================================================================================
    // 3. RENDERIZADO
    // ==================================================================================
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black flex items-center justify-center gap-3">
                    <Lightbulb className="text-yellow-400" size={32} /> Lluvia de Ideas Virales
                </h1>
                <p className="text-gray-400 font-medium">Ángulos disruptivos adaptados a tu marca y plataforma.</p>
            </div>

            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50"></div>

                {/* 1. PLATAFORMA */}
                <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-4 block tracking-widest">1. Selecciona la Plataforma</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PLATFORMS.map(p => (
                            <button key={p.id} onClick={() => setSelectedPlatform(p)} className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${selectedPlatform.id === p.id ? `${p.bg} ${p.border} text-white shadow-lg ring-1 ring-white/10 scale-105` : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'}`}>
                                <p.icon size={24} className={selectedPlatform.id === p.id ? '' : 'grayscale opacity-50'} />
                                <span className="text-xs font-bold">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. TEMA Y CANTIDAD */}
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">2. ¿Sobre qué quieres hablar?</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="Ej: Errores al invertir en cripto, Rutina para abdomen..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-medium placeholder-gray-600 focus:ring-1 focus:ring-yellow-500/20"
                        />
                    </div>
                    
                    <div className="w-full md:w-auto">
                           <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">3. Cantidad</label>
                           <select
                               value={amount}
                               onChange={(e) => setAmount(Number(e.target.value))}
                               className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white outline-none min-w-[180px] cursor-pointer font-bold focus:border-yellow-500 transition-all"
                           >
                                <option value={3}>3 Ideas (3 Créditos)</option>
                                <option value={5}>5 Ideas (3 Créditos)</option>
                                <option value={10}>10 Ideas (7 Créditos)</option>
                           </select>
                    </div>
                </div>

                {/* 4. CONTEXTO */}
                <div className="pt-6 border-t border-gray-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">4. Contexto (Opcional)</label>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20">IA Conectada</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"><User size={14}/></div>
                            <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-indigo-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800">
                                <option value="">-- Experto General --</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none"><Users size={14}/></div>
                            <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-pink-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800">
                                <option value="">-- Avatar General --</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none"><BookOpen size={14}/></div>
                            <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-yellow-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800">
                                <option value="">-- Sin Base de Conocimiento --</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* BOTÓN GENERAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-800">
                    <button
                        onClick={handleGenerate}
                        disabled={!topic.trim() || isGenerating}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-orange-900/20 transition-all active:scale-95 shadow-lg flex-1 group"
                    >
                        {isGenerating ? (
                            <><RefreshCw className="animate-spin" size={20}/> Generando Ideas...</>
                        ) : (
                            <><Rocket size={20} className="group-hover:animate-bounce" /> GENERAR IDEAS</>
                        )}
                    </button>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800">
                        <Wallet size={14} className="text-yellow-500"/>
                        <span className="text-xs font-bold text-gray-400">Costo: <span className="text-white">{currentCost} créditos</span></span>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                        <AlertCircle size={14}/> {error}
                    </div>
                )}
            </div>

            {/* ✅ NUEVA SECCIÓN: RECOMENDACIÓN TOP */}
            {responseData?.recomendacion_top && (
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/50 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <Crown size={120} className="text-yellow-500"/>
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                                <Star size={24} className="text-yellow-400"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-yellow-400 uppercase tracking-wider">Recomendación TOP</h3>
                                <p className="text-xs text-gray-400 font-medium">La idea con mayor potencial ahora mismo</p>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-2xl p-5 border border-yellow-500/20">
                            <p className="text-sm text-white font-bold mb-3 leading-relaxed">
                                💡 <span className="text-yellow-400">Idea #{responseData.recomendacion_top.idea_id}:</span> {ideas.find(i => i.id === responseData.recomendacion_top?.idea_id)?.titulo}
                            </p>
                            <p className="text-xs text-gray-300 leading-relaxed mb-4">
                                <span className="font-bold text-yellow-400">¿Por qué ahora?</span> {responseData.recomendacion_top.razon}
                            </p>

                            {responseData.recomendacion_top.plan_rapido && (
                                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                    <p className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Plan de Ejecución Rápida</p>
                                    <p className="text-xs text-gray-300 whitespace-pre-line">{responseData.recomendacion_top.plan_rapido}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                const topIdea = ideas.find(i => i.id === responseData.recomendacion_top?.idea_id);
                                if (topIdea) handleGoToEditor(topIdea);
                            }}
                            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Zap size={18}/> CREAR GUION DE ESTA IDEA
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ NUEVA SECCIÓN: INSIGHTS ESTRATÉGICOS */}
            {responseData?.insights_estrategicos && (
                <div className="bg-[#0B0E14] border border-indigo-500/30 rounded-3xl p-6 space-y-4">
                    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp size={18}/> Insights Estratégicos
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {responseData.insights_estrategicos.tendencia_detectada && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">📈 Tendencia</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.tendencia_detectada}</p>
                            </div>
                        )}
                        
                        {responseData.insights_estrategicos.brecha_mercado && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">🎯 Brecha</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.brecha_mercado}</p>
                            </div>
                        )}
                        
                        {responseData.insights_estrategicos.advertencia && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">⚠️ Evitar</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.advertencia}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- RESULTADOS (MEJORADO) --- */}
            {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
                    {ideas.map((idea, idx) => {
                        // ✅ DETECTAR SI ES LA IDEA TOP
                        const isTopIdea = idea.id === responseData?.recomendacion_top?.idea_id;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`bg-[#0B0E14] border ${isTopIdea ? 'border-yellow-500/70 ring-2 ring-yellow-500/20' : 'border-gray-800'} rounded-3xl p-6 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-yellow-900/10 shadow-lg relative overflow-hidden`}
                            >
                                {/* ✅ BADGE TOP IDEA */}
                                {isTopIdea && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-black text-[9px] font-black rounded-full uppercase flex items-center gap-1 z-10">
                                        <Crown size={10}/> TOP
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="space-y-5 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black bg-gray-800/80 text-yellow-500 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/10 backdrop-blur-sm">
                                            {idea.angulo || idea.disparador_principal || "Viral"}
                                        </span>
                                        <div className={`p-2 rounded-xl ${selectedPlatform.bg} border border-white/5`}>
                                            <selectedPlatform.icon size={18} className={selectedPlatform.color}/>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                                            "{idea.titulo}"
                                        </h3>
                                        <p className="text-xs text-gray-400 leading-relaxed font-medium mb-3">
                                            {idea.concepto}
                                        </p>

                                        {/* ✅ GANCHO SUGERIDO */}
                                        {idea.gancho_sugerido && (
                                            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 mb-3">
                                                <p className="text-[9px] font-black text-gray-500 uppercase mb-1">🎬 Gancho</p>
                                                <p className="text-[11px] text-indigo-300 font-medium italic leading-relaxed">
                                                    "{idea.gancho_sugerido}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ SCORE VIRAL MEJORADO */}
                                    {idea.potencial_viral && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-gray-500 uppercase">Potencial Viral</span>
                                                <span className={`text-xs font-black ${getScoreColor(idea.potencial_viral)}`}>
                                                    {idea.potencial_viral}/10 · {getScoreLabel(idea.potencial_viral)}
                                                </span>
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        idea.potencial_viral >= 9 ? 'bg-green-500' :
                                                        idea.potencial_viral >= 7 ? 'bg-yellow-500' :
                                                        idea.potencial_viral >= 5 ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${(idea.potencial_viral / 10) * 100}%` }}
                                                ></div>
                                            </div>
                                            
                                            {/* ✅ RAZÓN DEL SCORE */}
                                            {idea.razon_potencia && (
                                                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                                    {idea.razon_potencia}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ✅ METADATOS EXTRAS */}
                                    <div className="flex flex-wrap gap-2">
                                        {idea.formato_visual && (
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-bold rounded-full border border-purple-500/20">
                                                {idea.formato_visual}
                                            </span>
                                        )}
                                        {idea.duracion_recomendada && (
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded-full border border-blue-500/20">
                                                ⏱ {idea.duracion_recomendada}
                                            </span>
                                        )}
                                        {idea.dificultad_produccion && (
                                            <span className={`px-2 py-1 text-[9px] font-bold rounded-full border ${
                                                idea.dificultad_produccion === 'Baja' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                idea.dificultad_produccion === 'Media' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                🎬 {idea.dificultad_produccion}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-6 pt-5 border-t border-gray-800/50 relative z-10">
                                    <button
                                        onClick={() => { 
                                            const textToCopy = `${idea.titulo}\n\n${idea.concepto}${idea.gancho_sugerido ? `\n\nGancho: ${idea.gancho_sugerido}` : ''}`;
                                            navigator.clipboard.writeText(textToCopy); 
                                            alert("Copiado"); 
                                        }}
                                        className="p-3 bg-gray-900 rounded-xl hover:text-white text-gray-500 transition-all border border-gray-800 hover:border-gray-600 shadow-sm hover:bg-gray-800"
                                        title="Copiar"
                                    >
                                        <Copy size={18}/>
                                    </button>

                                    <button
                                        onClick={() => handleSaveIdea(idea, idx)}
                                        className="p-3 bg-gray-900 rounded-xl hover:text-yellow-400 text-gray-500 transition-all border border-gray-800 hover:border-yellow-500/30 shadow-sm hover:bg-gray-800"
                                        title="Guardar Idea"
                                    >
                                        {savingId === idx ? <CheckCircle2 size={18} className="text-green-500"/> : <Save size={18}/>}
                                    </button>

                                    <button
                                        onClick={() => handleGoToEditor(idea)}
                                        className="flex-1 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white text-xs font-black flex justify-center items-center gap-2 transition-all shadow-sm uppercase tracking-wider group/btn"
                                    >
                                        Crear Guion <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};