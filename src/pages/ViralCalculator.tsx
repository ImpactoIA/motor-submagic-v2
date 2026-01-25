import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Activity, RefreshCw, AlertTriangle, CheckCircle2, 
    Wallet, Zap, ShieldCheck, Trophy, Brain, MessageCircle,
    User, Users, BookOpen, Wand2, ArrowRight, Eye, TrendingDown
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
    const [rewrittenScript, setRewrittenScript] = useState('');

    // --- CONTEXTO V30 ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    useEffect(() => {
        if (location.state?.contentToAnalyze) {
            setInputValue(location.state.contentToAnalyze);
        }
        if (user) fetchContextData();
    }, [location, user]);

    const fetchContextData = async () => {
        try {
            // 1. Cargar Expertos
            const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
            if(exp) setExperts(exp);
            
            // 2. Cargar Avatares
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            // 3. CARGAR CONOCIMIENTOS (AQUÍ ESTÁ LA CORRECCIÓN)
            // Intentamos seleccionar todo (*) para ver qué columnas tienes realmente
            const { data: kb, error } = await supabase
                .from('knowledge_bases') // <--- ASEGÚRATE QUE TU TABLA SE LLAME ASÍ
                .select('*') 
                .eq('user_id', user?.id);
            
            if (error) {
                console.error("Error buscando conocimientos:", error);
                // Si falla, intenta buscar en la tabla 'documents' por si acaso
                const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user?.id);
                if (docs) setKnowledgeBases(docs.map((d: any) => ({ id: d.id, title: d.name || d.title || d.filename })));
            } else if (kb) {
                // Mapeamos para asegurar que siempre haya un 'title' aunque la columna se llame 'name'
                setKnowledgeBases(kb.map((k: any) => ({ 
                    id: k.id, 
                    title: k.title || k.name || k.filename || "Sin Título" 
                })));
            }

            // Seleccionar defaults del perfil
            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };
    // --- ANÁLISIS POTENCIADO (V32) ---
    const handleAnalyze = async () => {
        if (!inputValue.trim()) return alert("⚠️ Ingresa el guion o idea.");
        if (!user || !userProfile) return;

        if (userProfile.credits < AUDIT_COST) {
            if(confirm(`💰 Saldo insuficiente. Costo: ${AUDIT_COST} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setRewrittenScript('');

        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'audit-tool', 
                    // PROMPT INJECTION: Pedimos métricas predictivas de comportamiento
                    transcript: `
                        [MODO: JUEZ VIRAL PRO]
                        CONTENIDO A AUDITAR:\n"${inputValue}"
                        
                        INSTRUCCIONES:
                        1. Simula el comportamiento del AVATAR seleccionado frente a este contenido.
                        2. Calcula probabilidades reales de retención.
                        3. Reescribe para maximizar.
                        
                        OUTPUT JSON OBLIGATORIO:
                        {
                            "score": (0-100),
                            "critique": "Análisis estratégico breve",
                            "stop_scroll_rate": "Alto/Medio/Bajo",
                            "drop_off_point": "Momento exacto donde se van (ej: 'segundo 5')",
                            "avatar_thoughts": [
                                { "phase": "Gancho (0-3s)", "thought": "¿Qué piensa al ver el inicio?", "emotion": "Curiosidad/Aburrimiento" },
                                { "phase": "Retención (Medio)", "thought": "¿Qué piensa durante el desarrollo?", "emotion": "Confianza/Duda" },
                                { "phase": "Cierre (CTA)", "thought": "¿Qué siente al final?", "emotion": "Deseo/Indiferencia" }
                            ],
                            "rewritten_version": "Guion optimizado..."
                        }
                    `, 
                    selectedMode: 'audit', 
                    platform: 'Viral Calculator',
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
            if (genData.rewritten_version) setRewrittenScript(genData.rewritten_version);

            if(refreshProfile) refreshProfile();

            await supabase.from('viral_analyses').insert({
                user_id: user.id,
                video_url: 'Auditoría V32',
                analysis_data: genData,
                score: genData.score || 0,
                cost_credits: AUDIT_COST
            });

        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreStyles = (score: number) => {
        if (score >= 85) return { color: 'text-green-400', border: 'border-green-500', bg: 'bg-green-950/20', label: 'VIRALIDAD ALTA' };
        if (score >= 65) return { color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-950/20', label: 'POTENCIAL MEDIO' };
        return { color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-950/20', label: 'BAJO IMPACTO' };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4">
            
            <div className="text-center space-y-3 pt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-black uppercase tracking-widest">
                    <Brain size={12} /> Titan V32 - Mind Reader Pro
                </div>
                <h1 className="text-4xl font-black text-white flex items-center justify-center gap-3 tracking-tighter">
                    <Activity className="text-pink-500" size={36} /> JUEZ VIRAL
                </h1>
                <p className="text-gray-400 font-medium max-w-md mx-auto">Predice el comportamiento de tu audiencia antes de grabar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- IZQUIERDA: INPUT Y CONTEXTO --- */}
                <div className="bg-[#0B0E14] border border-gray-800 rounded-[32px] p-6 shadow-2xl relative overflow-hidden flex flex-col h-full">
                    
                    <div className="mb-6 space-y-3 bg-gray-900/30 p-4 rounded-2xl border border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Lentes del Juez (Niche Guard)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400"><User size={12}/></div>
                                <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-[10px] rounded-lg p-2 pl-6 focus:border-pink-500 outline-none">
                                    <option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-400"><Users size={12}/></div>
                                <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-[10px] rounded-lg p-2 pl-6 focus:border-pink-500 outline-none">
                                    <option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={12}/></div>
                                <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-[10px] rounded-lg p-2 pl-6 focus:border-yellow-500 outline-none">
                                    <option value="">Criterio</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pega aquí tu guion, idea o caption..."
                        className="flex-1 w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-white focus:outline-none focus:border-pink-500/50 resize-none font-medium text-sm mb-4 placeholder:text-gray-700 shadow-inner"
                    />

                    <div className="mt-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-xl border border-gray-800">
                            <Wallet size={14} className="text-yellow-500"/>
                            <span className="text-[10px] font-bold text-gray-400">{AUDIT_COST} CR</span>
                        </div>
                        <button 
                            onClick={handleAnalyze} 
                            disabled={!inputValue.trim() || isAnalyzing}
                            className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isAnalyzing ? <><RefreshCw className="animate-spin" size={18}/> LEYENDO MENTE...</> : <><Brain size={18}/> PREDECIR IMPACTO</>}
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: RESULTADOS --- */}
                <div className="relative min-h-[500px]">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-right-10 duration-500 space-y-6 h-full flex flex-col">
                            
                            {/* Score & Prediction Metrics */}
                            <div className="flex justify-between items-center pb-6 border-b border-gray-800">
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${getScoreStyles(result.score).color}`}>{getScoreStyles(result.score).label}</p>
                                    <h2 className="text-6xl font-black text-white">{result.score}<span className="text-xl text-gray-600">/100</span></h2>
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                                        <Eye size={14} className="text-blue-400"/> Stop-Scroll: <span className="text-white font-bold">{result.stop_scroll_rate || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                                        <TrendingDown size={14} className="text-red-400"/> Fuga: <span className="text-white font-bold">{result.drop_off_point || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                
                                {/* MIND READER (EVOLUTIVO) */}
                                {result.avatar_thoughts && (
                                    <div className="space-y-3">
                                        <h4 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 opacity-70">
                                            <MessageCircle size={12} className="text-cyan-400"/> Monólogo Interno del Avatar
                                        </h4>
                                        <div className="space-y-2">
                                            {result.avatar_thoughts.map((item: any, i: number) => (
                                                <div key={i} className="flex gap-4 bg-cyan-900/10 p-4 rounded-xl border border-cyan-500/20 items-start">
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-900/40 flex items-center justify-center text-cyan-400 font-bold text-xs">{i+1}</div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[9px] font-black uppercase text-cyan-500 tracking-wider">{item.phase}</span>
                                                            <span className="text-[9px] text-gray-500 uppercase">{item.emotion}</span>
                                                        </div>
                                                        <p className="text-sm text-cyan-100 italic font-medium leading-snug">"{item.thought}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* MAKE IT VIRAL (REESCRITURA) */}
                                {rewrittenScript && (
                                    <div className="mt-4 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative group">
                                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <Zap className="text-purple-400" size={20}/>
                                        </div>
                                        <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Wand2 size={14}/> Make it Viral (Versión Optimizada)
                                        </h4>
                                        <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                                            {rewrittenScript}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-purple-500/20 flex justify-end">
                                            <button 
                                                onClick={() => { navigator.clipboard.writeText(rewrittenScript); alert("¡Copiado!"); }} 
                                                className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/50"
                                            >
                                                <ArrowRight size={14}/> Copiar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border-2 border-dashed border-gray-800 rounded-[32px] flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
                                <Brain size={32} className="text-gray-700" />
                            </div>
                            <h3 className="text-white font-black text-lg mb-2">SISTEMA EN ESPERA</h3>
                            <p className="text-gray-600 text-sm max-w-[250px] font-medium leading-relaxed">
                                Pega tu texto para leer la mente de tu audiencia y prevenir el scroll.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};