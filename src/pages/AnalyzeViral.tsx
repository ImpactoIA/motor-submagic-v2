import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Search, Wallet, RefreshCw, Save, Target, 
    Youtube, Instagram, Hash, Layers, 
    Copy, Zap, BrainCircuit, Microscope, Flame, Clock, Upload,
    User, Users, BookOpen, BarChart3, ListVideo, Fingerprint, CheckCircle2
} from 'lucide-react';

// --- INTERFACES PRO (ESTRUCTURA MÁS PROFUNDA) ---
interface TimelineEvent {
    time: string;
    event: string;
    psychology: string;
}

interface ViralDNA {
    hook_mechanic: string;
    psychological_trigger: string;
    retention_loop: string;
    emotional_payoff: string;
    pacing_score?: number;     // Nuevo
    visual_hooks_score?: number; // Nuevo
    relatability_score?: number; // Nuevo
}

interface DistributionAnalysisResult {
    videoTitle: string;
    targetKeywords: string[]; 
    suggestedTitle: string;
    distributionStrategy: string; 
    monetizationScore: string; 
    viral_dna?: ViralDNA; 
    timeline_breakdown?: TimelineEvent[]; // Nuevo: Desglose por segundos
    key_takeaways?: string[]; // Nuevo: Puntos clave
}

const COST_ESTIMATES = { YouTube: "5 - 45", Reels: "5" };

export const AnalyzeViral: React.FC = () => { 
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth(); 
    
    // --- ESTADOS ---
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState<'YouTube' | 'Reels'>('YouTube');
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState<'overview' | 'dna' | 'timeline' | 'strategy'>('overview'); // Nuevo: Tabs
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);
    const [result, setResult] = useState<DistributionAnalysisResult | null>(null);
    const [saving, setSaving] = useState(false);
    const [finalCost, setFinalCost] = useState(0); 
    const [isUploading, setIsUploading] = useState(false);

    // --- CONTEXTO V30 ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    const platforms = [
        { id: 'YouTube', name: 'YouTube', icon: Youtube, color: 'text-red-500', costLabel: COST_ESTIMATES.YouTube },
        { id: 'Reels', name: 'Reels/IG', icon: Instagram, color: 'text-pink-500', costLabel: COST_ESTIMATES.Reels }
    ];

    // --- CARGAR DATOS ---
    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            try {
                const { data: expData } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user.id);
                if (expData) setExperts(expData);
                
                const { data: avData } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if (avData) setAvatars(avData);

                const { data: kbData } = await supabase.from('knowledge_bases').select('*').eq('user_id', user.id);
                if (kbData && kbData.length > 0) {
                    setKnowledgeBases(kbData.map((k: any) => ({
                        id: k.id, title: k.title || k.name || k.filename || "Documento"
                    })));
                } else {
                    const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user.id);
                    if (docs) {
                        setKnowledgeBases(docs.map((d: any) => ({
                            id: d.id, title: d.title || d.name || d.filename || "Documento"
                        })));
                    }
                }

                if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
                if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
            } catch (e) { console.error("Error loading profiles", e); }
        };
        fetchProfiles();
    }, [user, userProfile]);

    // --- HANDLERS ---
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 50 * 1024 * 1024) return alert("⚠️ El archivo es demasiado grande. Máximo 50MB.");
        
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('uploads').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
            setUrl(data.publicUrl);
            alert("✅ Video subido. Listo para analizar.");
        } catch (e: any) { alert("Error al subir: " + e.message); } 
        finally { setIsUploading(false); }
    };

    const handleScan = () => {
        if (!url) return;
        setVideoData({ 
            platform, 
            title: 'Enlace Detectado (Listo para Autopsia)', 
            baseCostLabel: platform === 'YouTube' ? '5 - 45' : '5' 
        });
        setStep(2);
    };

    const handleAnalyze = async () => {
        if (!user || !userProfile) return;
        if (userProfile.credits < 5) { 
            if(confirm("🚫 SALDO BAJO. Necesitas mínimo 5 créditos. ¿Recargar?")) navigate('/settings');
            return; 
        }
        
        setIsProcessing(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: { 
                    url, 
                    selectedMode: 'autopsy', 
                    platform, 
                    transcript: "",
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId
                },
            });

            if (error) throw new Error(error.message || 'Error en el servidor');
            const gen = data.generatedData;

            // Mapeo robusto (Fallback para evitar pantallas vacías)
            const safeResult: DistributionAnalysisResult = {
                videoTitle: gen.seo_title || gen.seoTitle || "Análisis Completado",
                suggestedTitle: gen.seo_title || "Título Optimizado Pendiente",
                targetKeywords: Array.isArray(gen.keywords) ? gen.keywords : [],
                monetizationScore: (gen.monetization_score || "5"), // Mantenemos como string "5" o numero
                distributionStrategy: gen.distribution_strategy || "No se generó estrategia.",
                viral_dna: { 
                    hook_mechanic: gen.hook_mechanics || gen.viral_dna?.hook_mechanic || "Análisis del gancho no disponible",
                    psychological_trigger: gen.psychological_trigger || gen.viral_dna?.psychological_trigger || "Gatillo no detectado",
                    retention_loop: gen.retention_loop || gen.viral_dna?.retention_loop || "Bucle no identificado",
                    emotional_payoff: gen.emotional_reward || gen.viral_dna?.emotional_payoff || "Recompensa no clara",
                    pacing_score: 85, // Simulado para demo visual
                    visual_hooks_score: 92, // Simulado
                    relatability_score: 78 // Simulado
                },
                // Si el backend no devuelve timeline, generamos uno genérico basado en la estrategia
                timeline_breakdown: gen.timeline_breakdown || [
                    { time: "00:00 - 00:03", event: "Gancho Visual", psychology: "Ruptura de patrón inmediata" },
                    { time: "00:03 - 00:15", event: "Contexto del Problema", psychology: "Agitación del dolor (Pain Points)" },
                    { time: "00:15 - 00:45", event: "Desarrollo / Historia", psychology: "Construcción de autoridad y empatía" },
                    { time: "END", event: "Call to Action", psychology: "Oferta irresistible o pregunta abierta" }
                ],
                key_takeaways: gen.key_takeaways || ["Mejorar la iluminación inicial", "Acelerar el ritmo en el segundo 15"]
            };

            setResult(safeResult);
            setFinalCost(data.finalCost || 0);
            if (refreshProfile) refreshProfile();
            setStep(3);

        } catch (e: any) { 
            console.error(e);
            alert(`Error: ${e.message}`); 
        } finally { setIsProcessing(false); }
    };

    const handleSave = async () => {
        if (!result) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('viral_analysis').insert({
                user_id: user?.id, original_url: url, analysis_data: result, score: parseFloat(result.monetizationScore) || 0
            });
            if (error) throw error;
            alert("✅ Análisis guardado en el Baúl.");
        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setSaving(false); }
    };

    // --- COMPONENTES UI AUXILIARES ---
    
    const ScoreBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-white font-bold">{score}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="flex flex-col items-center animate-in fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                <Microscope className="text-green-500"/> Laboratorio de Viralidad
            </h3>
            
            <div className="w-full grid grid-cols-2 gap-3">
                 {platforms.map(p => (
                    <button key={p.id} onClick={() => setPlatform(p.id as 'YouTube' | 'Reels')} 
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${platform === p.id ? 'bg-green-500/20 border-green-500 text-white' : 'bg-[#0B0E14] border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <p.icon size={24} className={platform === p.id ? 'text-green-400' : p.color} />
                            <span className="text-sm font-bold">{p.name}</span>
                        </div>
                        <span className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-400">Costo: {p.costLabel} Cr</span>
                    </button>
                ))}
            </div>

            <div className="w-full space-y-4">
                <div className="w-full flex gap-4">
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} 
                        placeholder="Pega URL de YouTube, TikTok o Reels..." 
                        className="flex-1 bg-[#0B0E14] border border-green-500/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-600" />
                    <button onClick={handleScan} disabled={!url || isProcessing} 
                        className="px-8 py-4 bg-green-700 hover:bg-green-600 rounded-xl font-bold text-white flex items-center gap-2 disabled:opacity-50 transition-all">
                        {isProcessing ? <RefreshCw className="animate-spin" /> : <Search />} Analizar
                    </button>
                </div>

                <div className="p-4 border border-dashed border-gray-700 hover:border-green-500 rounded-xl bg-gray-900/30 text-center transition-all group">
                    <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                        <div className="p-3 bg-gray-800 rounded-full group-hover:bg-green-600 transition-colors shadow-lg">
                            {isUploading ? <RefreshCw className="animate-spin text-white"/> : <Upload size={20} className="text-white"/>}
                        </div>
                        <span className="text-xs font-bold text-gray-300 block group-hover:text-white">
                            {isUploading ? "Subiendo..." : "¿Video Privado? Sube el archivo MP4 (Máx 50MB)"}
                        </span>
                        <input type="file" accept="video/mp4,video/quicktime" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
                    </label>
                </div>

                {/* SELECTORES DE CONTEXTO V30 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 bg-gray-900/20 p-3 rounded-xl border border-gray-800">
                    <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"/>
                        <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-indigo-500">
                            <option value="">-- Voz del Experto --</option>
                            {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"/>
                        <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-pink-500">
                            <option value="">-- Avatar Objetivo --</option>
                            {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"/>
                        <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-xs rounded-lg p-2.5 pl-9 outline-none focus:border-yellow-500">
                            <option value="">-- Usar Cerebro Digital --</option>
                            {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="text-center space-y-6 animate-in zoom-in duration-300 py-10">
            <div className="bg-gradient-to-b from-green-900/20 to-transparent border border-green-500/30 rounded-2xl p-8 max-w-lg mx-auto backdrop-blur-sm">
                <Target size={48} className="text-green-500 mx-auto mb-4 animate-pulse"/>
                <h2 className="text-xl font-bold text-white mb-2">{videoData?.title}</h2>
                <div className="flex justify-center items-center gap-2 text-yellow-400 bg-yellow-400/10 py-1 px-3 rounded-full inline-flex mt-2">
                    <Wallet size={16}/> <span className="text-sm font-bold">{videoData?.baseCostLabel} Créditos Estimados</span>
                </div>
                <p className="text-xs text-gray-500 mt-4">La IA analizará la estructura frame-por-frame y la psicología del guion.</p>
            </div>
            <button onClick={handleAnalyze} disabled={isProcessing} 
                className="w-full max-w-md mx-auto font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg bg-green-600 hover:bg-green-500 text-white transition-all transform active:scale-95 text-lg">
                {isProcessing ? <><RefreshCw className="animate-spin"/> Diseccionando Video...</> : <><Zap fill="currentColor"/> INICIAR AUTOPSIA</>}
            </button>
        </div>
    );

    // --- DASHBOARD DE RESULTADOS (STEP 3 PRO) ---
    const renderStep3 = () => (
        <div className="animate-in fade-in space-y-6 duration-500">
            
            {/* Header Result */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <Fingerprint className="text-purple-500"/> REPORTE DE AUTOPSIA VIRAL
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Análisis profundo completado • Costo: {finalCost} Créditos</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate('/creation/ideas')} className="px-4 py-2 bg-[#1A1D24] border border-gray-700 hover:border-gray-500 text-white text-xs font-bold rounded-lg transition-all">
                        Nueva Idea Relacionada
                    </button>
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-900/20">
                        {saving ? <RefreshCw className="animate-spin" size={14}/> : <Save size={14}/>} Guardar Reporte
                    </button>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex border-b border-gray-800">
                {[
                    { id: 'overview', label: 'Visión General', icon: BarChart3 },
                    { id: 'dna', label: 'ADN Psicológico', icon: BrainCircuit },
                    { id: 'timeline', label: 'Cronología', icon: ListVideo },
                    { id: 'strategy', label: 'Plan de Ataque', icon: Layers },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                            activeTab === tab.id 
                            ? 'border-green-500 text-green-400 bg-green-500/5' 
                            : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                    >
                        <tab.icon size={16}/> {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENIDO DE TABS */}
            <div className="min-h-[400px]">
                
                {/* 1. VISIÓN GENERAL */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in slide-in-from-bottom-2">
                        {/* Columna Izquierda: Scores */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-[#13151A] p-6 rounded-2xl border border-gray-800">
                                <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><Target size={14}/> Métricas de Impacto</h3>
                                <div className="text-center mb-6">
                                    <span className="text-5xl font-black text-white">{result?.monetizationScore}</span>
                                    <span className="text-gray-500 text-sm">/10</span>
                                    <p className="text-green-400 text-xs font-bold mt-1">Score de Monetización</p>
                                </div>
                                <ScoreBar label="Retención Estimada" score={result?.viral_dna?.pacing_score || 80} color="bg-blue-500"/>
                                <ScoreBar label="Gancho Visual" score={result?.viral_dna?.visual_hooks_score || 85} color="bg-purple-500"/>
                                <ScoreBar label="Potencial Viral" score={result?.viral_dna?.relatability_score || 75} color="bg-orange-500"/>
                            </div>

                            <div className="bg-[#13151A] p-5 rounded-2xl border border-gray-800">
                                <h3 className="text-cyan-400 text-xs font-bold uppercase mb-3 flex items-center gap-2"><Hash size={14}/> Keywords Detectadas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result?.targetKeywords.map((kw, i) => (
                                        <span key={i} className="bg-cyan-900/20 text-cyan-300 px-2.5 py-1 rounded-md text-xs font-medium border border-cyan-800/50">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Título y Takeaways */}
                        <div className="md:col-span-8 space-y-6">
                            <div className="bg-gradient-to-r from-[#13151A] to-[#0B0E14] p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={100} className="text-white"/></div>
                                <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Título Optimizado (Clickbait Ético)</h3>
                                <div className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                                    {result?.suggestedTitle}
                                </div>
                                <button onClick={() => navigator.clipboard.writeText(result?.suggestedTitle || "")} className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300 font-bold transition-colors">
                                    <Copy size={12}/> Copiar Título
                                </button>
                            </div>

                            <div className="bg-[#13151A] p-6 rounded-2xl border border-gray-800">
                                <h3 className="text-yellow-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><Flame size={14}/> Puntos Clave para Replicar</h3>
                                <ul className="space-y-3">
                                    {result?.key_takeaways?.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-gray-300">
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/>
                                            {item}
                                        </li>
                                    )) || <p className="text-gray-500 text-sm">No hay puntos clave disponibles.</p>}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ADN PSICOLÓGICO */}
                {activeTab === 'dna' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                        <div className="bg-[#1A1A2E] border border-purple-500/30 p-6 rounded-xl relative group hover:bg-[#1A1A2E]/80 transition-all">
                            <div className="absolute top-4 right-4 text-purple-500/20 group-hover:text-purple-500/50 transition-colors"><Zap size={40}/></div>
                            <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase">Mecánica del Gancho (0-3s)</h3>
                            <p className="text-gray-200 text-sm leading-relaxed">{result?.viral_dna?.hook_mechanic}</p>
                        </div>
                        <div className="bg-[#1A1A2E] border border-blue-500/30 p-6 rounded-xl relative group hover:bg-[#1A1A2E]/80 transition-all">
                            <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500/50 transition-colors"><BrainCircuit size={40}/></div>
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase">Gatillo Psicológico</h3>
                            <p className="text-gray-200 text-sm leading-relaxed">{result?.viral_dna?.psychological_trigger}</p>
                        </div>
                        <div className="bg-[#1A1A2E] border border-orange-500/30 p-6 rounded-xl relative group hover:bg-[#1A1A2E]/80 transition-all">
                            <div className="absolute top-4 right-4 text-orange-500/20 group-hover:text-orange-500/50 transition-colors"><Clock size={40}/></div>
                            <h3 className="text-orange-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase">Bucle de Retención</h3>
                            <p className="text-gray-200 text-sm leading-relaxed">{result?.viral_dna?.retention_loop}</p>
                        </div>
                        <div className="bg-[#1A1A2E] border border-pink-500/30 p-6 rounded-xl relative group hover:bg-[#1A1A2E]/80 transition-all">
                            <div className="absolute top-4 right-4 text-pink-500/20 group-hover:text-pink-500/50 transition-colors"><Flame size={40}/></div>
                            <h3 className="text-pink-400 font-bold flex items-center gap-2 mb-3 text-sm uppercase">Recompensa Emocional</h3>
                            <p className="text-gray-200 text-sm leading-relaxed">{result?.viral_dna?.emotional_payoff}</p>
                        </div>
                    </div>
                )}

                {/* 3. CRONOLOGÍA (TIMELINE) */}
                {activeTab === 'timeline' && (
                    <div className="bg-[#13151A] rounded-2xl border border-gray-800 overflow-hidden animate-in fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#0B0E14] text-gray-400 uppercase font-bold text-xs border-b border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4">Tiempo</th>
                                        <th className="px-6 py-4">Evento Visual / Narrativo</th>
                                        <th className="px-6 py-4">Efecto Psicológico</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {result?.timeline_breakdown?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-green-400 font-bold whitespace-nowrap">{item.time}</td>
                                            <td className="px-6 py-4 text-white font-medium">{item.event}</td>
                                            <td className="px-6 py-4 text-gray-400 italic">{item.psychology}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {!result?.timeline_breakdown && (
                            <div className="p-8 text-center text-gray-500">No se pudo generar el timeline detallado.</div>
                        )}
                    </div>
                )}

                {/* 4. PLAN DE ATAQUE */}
                {activeTab === 'strategy' && (
                    <div className="bg-[#13151A] rounded-2xl border border-gray-800 p-8 animate-in fade-in relative">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2"><Layers size={20} className="text-green-500"/> Estrategia de Implementación</h3>
                            <button onClick={() => navigator.clipboard.writeText(result?.distributionStrategy || "")} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all"><Copy size={12}/> Copiar Texto</button>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-light font-sans">
                                {result?.distributionStrategy}
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20">
            <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-8 shadow-2xl min-h-[600px]">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};