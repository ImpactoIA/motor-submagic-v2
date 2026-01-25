import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Video, Instagram, Youtube, Linkedin, Facebook, 
    Lightbulb, RefreshCw, Rocket, Copy, ArrowRight, 
    Activity, Wallet, User, Users, BookOpen 
} from 'lucide-react';

// CONFIGURACIÓN DE PLATAFORMAS
const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/50' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
    { id: 'Facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-900/20', border: 'border-blue-600/50' }
];

export const QuickIdeas = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [amount, setAmount] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);
    const [ideas, setIdeas] = useState<any[]>([]);
    
    // --- ESTADOS CONTEXTO V30 ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    const COSTO_IDEAS = 2;

    // --- CARGAR PERFILES (AQUÍ ESTÁ LA CORRECCIÓN) ---
    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            try {
                // 1. Expertos
                const { data: expData } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user.id);
                if (expData) setExperts(expData);
                
                // 2. Avatares
                const { data: avData } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if (avData) setAvatars(avData);

                // 3. Base de Conocimiento (CORRECCIÓN: Busca nombre o titulo)
                // Intentamos buscar en 'knowledge_bases' primero
                const { data: kbData, error } = await supabase.from('knowledge_bases').select('*').eq('user_id', user.id);
                
                if (kbData && kbData.length > 0) {
                    // Mapeo seguro: Si no hay 'title', usa 'name' o 'filename'
                    setKnowledgeBases(kbData.map((k: any) => ({
                        id: k.id,
                        title: k.title || k.name || k.filename || "Documento sin nombre"
                    })));
                } else {
                    // Fallback: Si la tabla se llama 'documents', intenta buscar ahí
                    const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user.id);
                    if (docs) {
                        setKnowledgeBases(docs.map((d: any) => ({
                            id: d.id,
                            title: d.title || d.name || d.filename || "Documento"
                        })));
                    }
                }

                // Defaults
                if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
                if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
            } catch (e) { console.error("Error loading profiles", e); }
        };
        fetchProfiles();
    }, [user, userProfile]);

    // --- 🤖 FUNCIÓN DE GENERACIÓN CONECTADA A TITAN V30 ---
    const handleGenerate = async () => {
        if (!topic || !user || !userProfile) return;

        // Validación de Créditos
        if (userProfile.tier !== 'admin' && userProfile.credits < COSTO_IDEAS) {
            if(confirm(`⚠️ Saldo insuficiente. Esta herramienta cuesta ${COSTO_IDEAS} créditos. ¿Deseas recargar?`)) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setIdeas([]);

        try {
            // LLAMADA AL MOTOR TITAN V30 (Con Contexto)
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'idea-generator', 
                    transcript: `Tema: ${topic}\nCantidad: ${amount}`, 
                    selectedMode: 'idea_generator', 
                    platform: selectedPlatform.label,
                    expertId: selectedExpertId,     // <--- V30
                    avatarId: selectedAvatarId,     // <--- V30
                    knowledgeBaseId: selectedKbId   // <--- V30
                },
            });

            if (error) {
                if (error.status === 402) {
                    alert(`🚫 Saldo insuficiente en el motor.`);
                    navigate('/settings');
                    return;
                }
                throw error;
            }
            
            const responseData = data.generatedData;
            
            let cleanIdeas = [];
            if (responseData && responseData.ideas && Array.isArray(responseData.ideas)) {
                cleanIdeas = responseData.ideas;
            } else if (Array.isArray(responseData)) {
                cleanIdeas = responseData;
            } else {
                // Fallback si la IA devuelve solo texto
                cleanIdeas = [{ title: "Idea Generada", angle: "Ver detalles", hook: JSON.stringify(responseData) }];
            }

            if (cleanIdeas.length === 0) {
                alert("⚠️ No pudimos extraer ideas válidas. Intenta con un tema más descriptivo.");
            } else {
                setIdeas(cleanIdeas);
                if(refreshProfile) refreshProfile(); 
            }

        } catch (e: any) {
            console.error("Error Ideas:", e);
            alert(`Error: ${e.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20 p-4">
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3">
                    <Lightbulb className="text-yellow-400" size={32} /> Lluvia de Ideas Virales
                </h1>
                <p className="text-gray-400">Ángulos disruptivos adaptados a tu marca y plataforma.</p>
            </div>

            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-8">
                
                {/* 1. PLATAFORMA */}
                <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-4 block tracking-widest">1. Selecciona la Plataforma</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PLATFORMS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPlatform(p)}
                                className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                                    selectedPlatform.id === p.id
                                    ? `${p.bg} ${p.border} text-white shadow-lg ring-1 ring-white/10`
                                    : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                                }`}
                            >
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
                            placeholder="Ej: Errores al invertir en cripto, Rutina para abdomen..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-yellow-500 transition-all font-medium placeholder-gray-600"
                        />
                    </div>
                    
                    <div className="w-full md:w-auto">
                           <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">3. Cantidad</label>
                           <select
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white outline-none min-w-[140px] cursor-pointer font-bold"
                           >
                                <option value={3}>3 Ideas</option>
                                <option value={5}>5 Ideas</option>
                                <option value={10}>10 Ideas</option>
                           </select>
                    </div>
                </div>

                {/* 4. CONTEXTO V30 (INTEGRADO) */}
                <div className="pt-4 border-t border-gray-800">
                    <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">4. Contexto (Niche Guard)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={14}/></div>
                            <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 pl-9 focus:border-indigo-500 outline-none appearance-none font-bold cursor-pointer">
                                <option value="">-- Experto --</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={14}/></div>
                            <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 pl-9 focus:border-pink-500 outline-none appearance-none font-bold cursor-pointer">
                                <option value="">-- Avatar --</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={14}/></div>
                            <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-xl p-3 pl-9 focus:border-yellow-500 outline-none appearance-none font-bold cursor-pointer">
                                <option value="">-- Conocimiento --</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={!topic || isGenerating}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl hover:shadow-yellow-900/20 transition-all active:scale-95 shadow-lg flex-1"
                    >
                        {isGenerating ? (
                            <><RefreshCw className="animate-spin" size={20}/> Generando...</>
                        ) : (
                            <><Rocket size={20} className="animate-bounce" /> GENERAR ({COSTO_IDEAS} Cr)</>
                        )}
                    </button>
                    
                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
                        <Wallet size={12} className="text-yellow-500"/> Costo de operación: {COSTO_IDEAS} créditos
                    </p>
                </div>
            </div>

            {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500">
                    {ideas.map((idea, idx) => (
                        <div key={idx} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 hover:border-yellow-500/50 transition-all group flex flex-col justify-between h-full hover:shadow-2xl shadow-xl">
                            
                            <div className="space-y-5">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black bg-gray-800 text-yellow-500 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/10">{idea.format || "Viral"}</span>
                                    <div className={`p-2 rounded-xl ${selectedPlatform.bg} border border-white/5`}>
                                        <selectedPlatform.icon size={18} className={selectedPlatform.color}/>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors">"{idea.title}"</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{idea.angle}</p>
                                </div>

                                <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 shadow-inner">
                                    <span className="text-[10px] text-gray-500 uppercase font-black block mb-2 tracking-tighter">Gancho Estratégico:</span>
                                    <p className="text-sm text-yellow-100 italic font-medium leading-snug">"{idea.hook}"</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8 pt-5 border-t border-gray-800/50">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${idea.title}\n${idea.hook}`);
                                        alert("Copiado al portapapeles");
                                    }}
                                    className="p-3 bg-gray-900 rounded-xl hover:text-white text-gray-500 transition-all border border-gray-800 hover:border-gray-600 shadow-sm"
                                    title="Copiar"
                                >
                                    <Copy size={18}/>
                                </button>

                                <button
                                    onClick={() => navigate('/dashboard/script-generator', { state: { topic: idea.title, hook: idea.hook } })}
                                    className="flex-1 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white text-xs font-black flex justify-center items-center gap-2 transition-all shadow-sm uppercase tracking-wider"
                                >
                                    Crear Guion <ArrowRight size={16}/>
                                </button>

                                <button
                                    onClick={() => navigate('/dashboard/analyze-viral', { state: { contentToAnalyze: idea.hook } })}
                                    className="p-3 bg-pink-600/10 text-pink-400 border border-pink-500/20 rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                                    title="Auditar ADN"
                                >
                                    <Activity size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};