import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Activity, RefreshCw, AlertTriangle, CheckCircle2, 
    Wallet, Zap, ShieldCheck, Trophy, Brain, MessageCircle,
    User, Users, BookOpen, Wand2, ArrowRight, Eye, TrendingDown, ArrowLeft, BarChart3, Clock
} from 'lucide-react';

export const ViralCalculator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    const AUDIT_COST = 2;

    // --- ESTADOS ---
    const [inputValue, setInputValue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // --- CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- CARGAR DATOS ---
    useEffect(() => {
        if (location.state?.contentToAnalyze) {
            setInputValue(location.state.contentToAnalyze);
        }
        if (user) fetchContextData();
    }, [location, user]);

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase.from('expert_profiles').select('id, niche').eq('user_id', user?.id);
            if(exp) setExperts(exp.map(e => ({ id: e.id, name: e.niche || "Experto" })));
            
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) {
                setKnowledgeBases(kb.map((k: any) => ({ 
                    id: k.id, 
                    title: k.title || k.filename || "Documento" 
                })));
            }

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    // --- ANÁLISIS POTENCIADO (V109) ---
    const handleAnalyze = async () => {
        if (!inputValue.trim()) return alert("⚠️ Ingresa el guion o idea.");
        if (!user || !userProfile) return;
        setError(null);

        if (userProfile.tier !== 'admin' && (userProfile.credits || 0) < AUDIT_COST) {
            if(confirm(`💰 Saldo insuficiente. Costo: ${AUDIT_COST} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'juez_viral', // ✅ MODO V109
                    userInput: inputValue,      // ✅ TEXTO DEL USUARIO
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: AUDIT_COST
                },
            });

            if (error) throw error;

            const genData = data?.generatedData;
            if (!genData) throw new Error("Sin respuesta de IA.");

            setResult(genData);
            if(refreshProfile) refreshProfile();

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Error al analizar.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreStyles = (score: number) => {
        if (score >= 90) return { color: 'text-purple-400', border: 'border-purple-500', bg: 'bg-purple-950/20', label: 'VIRAL NUCLEAR' };
        if (score >= 75) return { color: 'text-green-400', border: 'border-green-500', bg: 'bg-green-950/20', label: 'BUEN POTENCIAL' };
        if (score >= 50) return { color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-950/20', label: 'PROMEDIO' };
        return { color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-950/20', label: 'RUIDO BLANCO' };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4 font-sans text-white">
            
            <div className="flex items-center justify-between pt-4">
                 <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-all text-gray-400 hover:text-white">
                    <ArrowLeft size={24}/>
                </button>
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-2">
                        <Brain size={12} /> Titan V109 - Neuro-Surgeon
                    </div>
                    <h1 className="text-3xl font-black flex items-center justify-center gap-3 tracking-tighter">
                        <Activity className="text-pink-500" size={32} /> JUEZ VIRAL
                    </h1>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- IZQUIERDA: INPUT Y CONTEXTO --- */}
                <div className="bg-[#0B0E14] border border-gray-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[600px]">
                    
                    <div className="mb-6 space-y-3 bg-gray-900/30 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-green-500"/>
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Contexto del Juez</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={12}/></div>
                                <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2 pl-8 focus:border-pink-500 outline-none cursor-pointer hover:bg-gray-900 transition-colors">
                                    <option value="">Experto General</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={12}/></div>
                                <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2 pl-8 focus:border-pink-500 outline-none cursor-pointer hover:bg-gray-900 transition-colors">
                                    <option value="">Avatar General</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pega aquí tu guion, idea o caption para ser sometido a la Neuro-Cirugía..."
                        className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-white focus:outline-none focus:border-pink-500/50 resize-none font-medium text-sm mb-4 placeholder:text-gray-700 shadow-inner font-mono leading-relaxed"
                    />

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium mb-4 animate-in slide-in-from-top-2">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-xl border border-gray-800">
                            <Wallet size={14} className="text-yellow-500"/>
                            <span className="text-[10px] font-bold text-gray-400">{AUDIT_COST} CR</span>
                        </div>
                        <button 
                            onClick={handleAnalyze} 
                            disabled={!inputValue.trim() || isAnalyzing}
                            className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition-all active:scale-95 disabled:opacity-50 group"
                        >
                            {isAnalyzing ? <><RefreshCw className="animate-spin" size={18}/> HACKEANDO MENTE...</> : <><Brain size={18} className="group-hover:rotate-12 transition-transform"/> EMITIR JUICIO</>}
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: RESULTADOS --- */}
                <div className="relative min-h-[500px]">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-right-10 duration-500 space-y-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
                            
                            {/* Score & Verdict */}
                            <div className="flex justify-between items-center pb-6 border-b border-gray-800">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${getScoreStyles(result.veredicto_final?.score_total || 0).color}`}>
                                        {result.veredicto_final?.clasificacion || "ANÁLISIS COMPLETADO"}
                                    </p>
                                    <h2 className="text-6xl font-black text-white">
                                        {result.veredicto_final?.score_total || 0}<span className="text-xl text-gray-600">/100</span>
                                    </h2>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                                        <TrendingDown size={14} className="text-green-400"/>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold text-right">Viralidad</p>
                                            <p className="text-xs font-bold text-white">{result.veredicto_final?.probabilidad_viral || "?"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-2">
                                        <Eye size={14} className="text-blue-400"/>
                                        <div>
                                            <p className="text-[9px] text-gray-500 uppercase font-bold text-right">Vistas Est.</p>
                                            <p className="text-xs font-bold text-white">{result.prediccion_metricas?.vistas_estimadas || "?"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 🔥 LA JOYA: REESCRITURA VIRAL (NUEVO) */}
                            {result.rewritten_version && (
                                <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 p-6 rounded-2xl relative group overflow-hidden">
                                    {/* Brillo de fondo */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                            <Wand2 size={16}/> Masterpiece Viral (Optimizado)
                                        </h4>
                                        <button 
                                            onClick={() => { navigator.clipboard.writeText(result.rewritten_version); alert("¡Copiado!"); }} 
                                            className="text-[10px] bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1 rounded-lg transition-colors font-bold uppercase"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                    
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                        <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed font-medium font-mono">
                                            {result.rewritten_version}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Criterios Clave */}
                            <div className="grid grid-cols-1 gap-3">
                                {(result.evaluacion_criterios || []).slice(0, 3).map((c: any, i: number) => (
                                    <div key={i} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-bold text-white block">{c.criterio}</span>
                                            <span className="text-[10px] text-gray-400">{c.analisis?.substring(0, 60)}...</span>
                                        </div>
                                        <div className={`text-lg font-black ${c.score >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>{c.score}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Acciones de Mejora (Optimización Rápida) */}
                            {result.optimizaciones_rapidas && result.optimizaciones_rapidas.length > 0 && (
                                <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-2xl">
                                    <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Zap size={14}/> Cirugía Rápida
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.optimizaciones_rapidas.map((opt: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="text-indigo-500 mt-1">⚡</span> {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Decisión Final */}
                            <div className={`p-4 rounded-xl text-center border font-bold text-sm uppercase tracking-widest ${
                                (result.decision_recomendada || "").includes("PUBLICAR") 
                                ? 'bg-green-900/20 border-green-500 text-green-400' 
                                : 'bg-red-900/20 border-red-500 text-red-400'
                            }`}>
                                VEREDICTO: {result.decision_recomendada || "REVISIÓN REQUERIDA"}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border-2 border-dashed border-gray-800 rounded-[32px] flex flex-col items-center justify-center text-center p-12 bg-gray-900/10">
                            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl opacity-50">
                                <Activity size={32} className="text-gray-700" />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2 opacity-50">SALA DE JUICIO</h3>
                            <p className="text-gray-600 text-sm max-w-[250px] font-medium leading-relaxed">
                                Pega tu texto para iniciar la Neuro-Auditoría.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};