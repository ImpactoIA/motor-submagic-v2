import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // ✅ Ruta corregida
import { useAuth } from '../../context/AuthContext';
import { 
    Video, Instagram, Youtube, Linkedin, Facebook, 
    Lightbulb, RefreshCw, Rocket, Copy, ArrowRight, 
    Wallet, User, Users, BookOpen, AlertCircle, Save, CheckCircle2
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

interface IdeaItem {
    titulo: string;
    concepto: string;
    viral_score?: number;
    angulo?: string;
    disparador_principal?: string;
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
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null); // Para indicar cuál se está guardando

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

            // Defaults
            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
        };
        fetchProfiles();
    }, [user, userProfile]);

    // ==================================================================================
    // 2. FUNCIÓN GENERAR (MODIFICADA PARA V105)
    // ==================================================================================
    const handleGenerate = async () => {
        if (!topic.trim()) return setError("Escribe un tema primero.");
        setError(null);

        // 1. Validar Saldo
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < currentCost) {
            if(confirm(`⚠️ Saldo insuficiente (${userProfile?.credits} cr). Necesitas ${currentCost}. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setIdeas([]);

        try {
            // 2. Llamada al Backend Blindado V105
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'ideas_rapidas',
                    userInput: topic, // ✅ Contexto principal
                    
                    // ✅ ESTO ES LO QUE ARREGLA EL COBRO Y LA CANTIDAD
                    settings: {
                        quantity: amount, // El backend lee settings.quantity
                        platform: selectedPlatform.label
                    },
                    
                    // Contexto Auxiliar
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    
                    estimatedCost: currentCost
                },
            });

            if (apiError) throw apiError;
            if (!data?.generatedData?.ideas) throw new Error("No se recibieron ideas válidas.");

            setIdeas(data.generatedData.ideas);
            if(refreshProfile) refreshProfile(); // Actualizar créditos en UI

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
                content: idea, // Guardamos todo el objeto idea
                status: 'draft',
                platform: selectedPlatform.label
            });
            // Simular feedback visual rápido
            setTimeout(() => setSavingId(null), 1000);
        } catch (e) {
            alert("Error al guardar");
            setSavingId(null);
        }
    };

    // --- ENVIAR AL GENERADOR DE GUIONES ---
    const handleToScript = (idea: IdeaItem) => {
        navigate('/tools/script-generator', { 
            state: { 
                topic: idea.titulo, // Pasamos el título como tema
                context: idea.concepto // Pasamos el concepto (aunque V105 prioriza topic)
            } 
        });
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

            {/* --- RESULTADOS --- */}
            {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
                    {ideas.map((idea, idx) => (
                        <div key={idx} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 hover:border-yellow-500/50 transition-all duration-300 group flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-yellow-900/10 shadow-lg relative overflow-hidden">
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
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                        {idea.concepto}
                                    </p>
                                </div>

                                {idea.viral_score && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(idea.viral_score / 10) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-green-400">{idea.viral_score}/10</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 mt-6 pt-5 border-t border-gray-800/50 relative z-10">
                                <button
                                    onClick={() => { navigator.clipboard.writeText(`${idea.titulo}\n${idea.concepto}`); alert("Copiado"); }}
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
                                    onClick={() => handleToScript(idea)}
                                    className="flex-1 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white text-xs font-black flex justify-center items-center gap-2 transition-all shadow-sm uppercase tracking-wider group/btn"
                                >
                                    Crear Guion <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};