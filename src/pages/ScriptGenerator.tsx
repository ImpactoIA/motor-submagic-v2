import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, 
    Video, Instagram, Youtube, Linkedin, CheckCircle2, Activity, Clock, AlignLeft, Wallet,
    User, Users, BookOpen
} from 'lucide-react';

// --- 🪝 LISTA COMPLETA DE 40 GANCHOS (WINNER ROCKET) ---
const MASTER_HOOKS = [
    { name: '👁️ Frame Break (Ruptura Visual)' },
    { name: '🔮 Objeto Mágico' },
    { name: '📸 Antes y Después' },
    { name: '🏃‍♂️ En Movimiento' },
    { name: '👀 Sneak Peek (Vistazo)' },
    { name: '⚡ Chasquido' },
    { name: '📲 Pantalla Verde' },
    { name: '🚫 Stop Scroll' },
    { name: '❌ Mito vs Verdad' },
    { name: '😡 Enemigo Común' },
    { name: '⛔ Gancho Negativo' },
    { name: '🤡 El Ridículo' },
    { name: '😭 El Arrepentimiento' },
    { name: '⚠️ La Advertencia' },
    { name: '🔥 Verdad Dura' },
    { name: '😰 Miedo / Pánico' },
    { name: '🤯 La Paradoja' },
    { name: '🤫 El Secreto' },
    { name: '🧩 Pieza Faltante' },
    { name: '❓ Pregunta Provocadora' },
    { name: '🕵️ Detective' },
    { name: '🔐 Acceso Denegado' },
    { name: '🧬 ADN / Ciencia' },
    { name: '🤔 What If (¿Y si...?)' },
    { name: '🌀 Loop Infinito' },
    { name: '💸 Comparación de Precio' },
    { name: '3️⃣ Regla de 3' },
    { name: '📊 Dato Impactante' },
    { name: '💰 Ahorro' },
    { name: '👑 Autoridad Prestada' },
    { name: '🧠 Autoridad Experta' },
    { name: '🎯 Francotirador' },
    { name: '📖 Historia Personal' },
    { name: '🤝 Promesa Intrigante' },
    { name: '🆕 Novedad / Update' },
    { name: '☝️ La Única Cosa' },
    { name: '🛠️ Tutorial Rápido' },
    { name: '🎁 Regalo / Recurso' },
    { name: '🪞 Identidad (Solo para...)' },
    { name: '🏆 Reto' }
];

// --- 📹 LISTA DE 12 FORMATOS VISUALES ---
const VIDEO_FORMATS = [
    '1. Hablando a cámara (Frontal)',
    '2. Entrevista / Podcast',
    '3. POV (Punto de Vista)',
    '4. Storytelling Cinemático',
    '5. Demo / Tutorial Paso a Paso',
    '6. Testimonio en Video',
    '7. Gancho + Corte + Solución',
    '8. Texto + Música (Sin hablar)',
    '9. Vlog educativo / Detrás de cámara',
    '10. Sketch / Dramatización',
    '11. Micro-Clase (60s)',
    '12. Mito vs Realidad'
];

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/50' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' }
];

const DURATIONS = [
    { id: 'short', label: 'Flash (60s)', cost: 5, desc: 'Viralidad Rápida' },
    { id: 'medium', label: 'Estándar (3m)', cost: 5, desc: 'Retención' },
    { id: 'long', label: 'Profundo (10m)', cost: 10, desc: 'Autoridad' },
    { id: 'masterclass', label: 'Masterclass', cost: 10, desc: 'Curso Completo' },
];

export const ScriptGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [hookType, setHookType] = useState(MASTER_HOOKS[0].name); 
    const [formatType, setFormatType] = useState(VIDEO_FORMATS[0]);
    const [durationId, setDurationId] = useState('short'); 
    const [isGenerating, setIsGenerating] = useState(false);
    const [cost, setCost] = useState(5); 
    const [result, setResult] = useState<any>(null);

    // --- ESTADOS CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- CARGAR PERFILES ---
    useEffect(() => {
        const fetchProfiles = async () => {
            if (!user) return;
            const { data: expData } = await supabase.from('expert_profiles').select('id, name, niche').eq('user_id', user.id);
            if (expData) setExperts(expData);
            const { data: avData } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
            if (avData) setAvatars(avData);
            
            // Carga inteligente de Conocimiento
            const { data: kbData } = await supabase.from('knowledge_bases').select('id, title').eq('user_id', user.id);
            if (kbData && kbData.length > 0) {
                setKnowledgeBases(kbData);
            } else {
                const { data: docs } = await supabase.from('documents').select('id, title').eq('user_id', user.id);
                if (docs) setKnowledgeBases(docs);
            }

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        };
        fetchProfiles();
    }, [user, userProfile]);

    useEffect(() => {
        if (location.state?.topic) setTopic(location.state.topic);
        if (location.state?.hook) setHookType(location.state.hook);
    }, [location]);

    useEffect(() => {
        const sel = DURATIONS.find(d => d.id === durationId);
        if (sel) setCost(sel.cost);
    }, [durationId]);

    // 🛡️ PARSEADOR DE BLOQUES
    const parseScriptToBlocks = (data: any) => {
        if (data.scriptBlocks && Array.isArray(data.scriptBlocks)) return data.scriptBlocks;
        let rawContent = data.script_body || data.content || "";
        const lines = String(rawContent).split('\n').filter((l: string) => l.trim().length > 0);
        
        return lines.map((line: string, index: number) => {
            let section = "Cuerpo";
            if (index === 0) section = "Gancho";
            else if (index === lines.length - 1) section = "CTA";
            
            const timeMatch = line.match(/\[(\d{1,2}:\d{2})\]/);
            const time = timeMatch ? timeMatch[1] : `00:${index < 10 ? '0'+index : index}s`;

            return {
                section: section,
                time: time,
                content: line.replace(/\[.*?\]/g, '').trim()
            };
        });
    };

    const getCleanTextForAudit = (data: any) => {
        if (!data) return "";
        return `TÍTULO: ${data.title}\nGANCHO: ${data.hookText}\n\nGUION:\n${data.script_body}`;
    };

    // --- FUNCIÓN DE AUDITORÍA CORREGIDA (LINK CONECTADO A APP.TSX) ---
    const handleAuditRedirection = () => {
        if (!result) return;
        
        // Redirección al Juez Viral usando la ruta correcta de tu App.tsx
        // Y pasando 'contentToAnalyze' que es lo que espera ViralCalculator.tsx
        navigate('/dashboard/viral-calculator', { 
            state: { 
                contentToAnalyze: getCleanTextForAudit(result), 
                source: 'generator' 
            } 
        });
    };

    // --- 🤖 GENERACIÓN CONECTADA A TITAN ---
    const handleGenerate = async () => {
        if (!topic || !user || !userProfile) return;

        if (userProfile.tier !== 'admin' && userProfile.credits < cost) {
            if(confirm(`⚠️ Saldo insuficiente. Costo: ${cost} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'script-generator',
                    // Enviar todos los parámetros al prompt engineer
                    transcript: JSON.stringify({ 
                        topic, 
                        platform: selectedPlatform.label, 
                        hookType, 
                        formatType, 
                        durationId 
                    }), 
                    selectedMode: 'script_generator', 
                    estimatedCost: cost,
                    platform: selectedPlatform.label,
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId
                },
            });

            if (error) throw error;
            
            const gen = data.generatedData;

            setResult({
                title: gen.title || topic,
                hookText: gen.hookText || gen.hook_type || hookType,
                scriptBlocks: parseScriptToBlocks(gen), 
                script_body: gen.script_body || gen.content 
            });

            if(refreshProfile) refreshProfile(); 

        } catch (e: any) { 
            alert(`Error: ${e.message}`); 
        } finally { 
            setIsGenerating(false); 
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4">
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white">Arquitecto de Guiones</h1>
                <p className="text-gray-400">Diseña contenido estratégico con la metodología Winner Rocket.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* PANEL DE CONFIGURACIÓN */}
                <div className="lg:col-span-5 bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-6 h-fit sticky top-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-4 block tracking-widest">1. Plataforma</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {PLATFORMS.map(p => (
                                <button key={p.id} onClick={() => setSelectedPlatform(p)} className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${selectedPlatform.id === p.id ? `${p.bg} ${p.border} text-white` : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'}`}>
                                    <p.icon size={20} className={selectedPlatform.id === p.id ? '' : 'grayscale opacity-30'} />
                                    <span className="text-[10px] font-bold">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">2. Concepto Central</label>
                        <textarea 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder="Ej: Cómo perder el miedo a la cámara siendo introvertido..." 
                            className="w-full h-28 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none font-medium placeholder-gray-600 shadow-inner" 
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Formato Visual (Winner Rocket)</label>
                            <select value={formatType} onChange={(e) => setFormatType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-xs outline-none font-bold">
                                {VIDEO_FORMATS.map(f => <option key={f} value={f}>{f}</option>)} 
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Gancho Maestro (0-3s)</label>
                            <select value={hookType} onChange={(e) => setHookType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-xs outline-none font-bold">
                                {MASTER_HOOKS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)} 
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block tracking-widest">3. Profundidad</label>
                        <div className="grid grid-cols-2 gap-2">
                            {DURATIONS.map(d => (
                                <button key={d.id} onClick={() => setDurationId(d.id)} className={`p-3 rounded-2xl border text-left transition-all flex justify-between items-center ${durationId === d.id ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-gray-900/50 border-gray-800'}`}>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white">{d.label}</span>
                                        <span className="text-[8px] text-gray-500 uppercase font-bold">{d.desc}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${durationId === d.id ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500'}`}>{d.cost}C</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- SELECTORES V30 --- */}
                    <div className="pt-4 border-t border-gray-800">
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block tracking-widest">4. Contexto (Niche Guard)</label>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={14}/></div>
                                    <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white text-xs rounded-xl p-3 pl-9 focus:border-indigo-500 outline-none font-bold appearance-none cursor-pointer">
                                        <option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={14}/></div>
                                    <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white text-xs rounded-xl p-3 pl-9 focus:border-pink-500 outline-none font-bold appearance-none cursor-pointer">
                                        <option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={14}/></div>
                                <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white text-xs rounded-xl p-3 pl-9 focus:border-yellow-500 outline-none font-bold appearance-none cursor-pointer">
                                    <option value="">Base de Conocimiento (Cerebro)</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleGenerate} disabled={!topic || isGenerating} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 disabled:opacity-50 hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95 shadow-lg">
                        {isGenerating ? <><RefreshCw className="animate-spin" size={20}/> Escribiendo...</> : <><Zap size={20}/> GENERAR GUION ({cost} Cr)</>}
                    </button>
                </div>

                {/* VISUALIZADOR DE RESULTADO */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                                <div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-1"><AlignLeft size={12}/> Master Script</span>
                                    <h2 className="text-2xl font-black text-white">{result.title}</h2>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(getCleanTextForAudit(result)); alert("Copiado 🚀"); }} className="p-3 bg-gray-900 rounded-2xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all border border-gray-800 shadow-sm" title="Copiar"><Copy size={20}/></button>
                                    
                                    {/* --- BOTÓN AUDITAR CORREGIDO --- */}
                                    <button onClick={handleAuditRedirection} className="flex items-center gap-2 px-6 py-3 bg-pink-600/10 text-pink-400 border border-pink-500/20 rounded-2xl hover:bg-pink-600 hover:text-white font-black transition-all text-xs uppercase tracking-widest shadow-lg">
                                        <Activity size={16}/> Auditar ADN
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-8 rounded-3xl border border-indigo-500/20 mb-8 relative overflow-hidden group shadow-inner">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={100}/></div>
                                <span className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2 mb-3 tracking-widest"><Zap size={14}/> Gancho Seleccionado</span>
                                <p className="text-xl md:text-2xl text-white font-black leading-tight italic">"{result.hookText}"</p>
                            </div>

                            <div className="space-y-4">
                                {result.scriptBlocks.map((block: any, idx: number) => (
                                    <div key={idx} className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50 hover:border-indigo-500/30 transition-all shadow-md group">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[9px] font-black text-gray-500 uppercase bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">{block.section}</span>
                                            <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1.5 bg-indigo-900/20 px-2.5 py-1 rounded-lg border border-indigo-500/10"><Clock size={12}/> {block.time}</span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-base font-medium whitespace-pre-wrap">{block.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-800 flex justify-center items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                                <CheckCircle2 size={16}/> Sincronizado con el Baúl
                            </div>
                        </div>
                    ) : (
                        <div className="h-[600px] border-2 border-dashed border-gray-800 rounded-[40px] flex flex-col items-center justify-center text-center p-12 text-gray-700 shadow-inner">
                            <div className="p-6 bg-gray-900/20 rounded-full mb-6 opacity-10"><Wand2 size={80}/></div>
                            <p className="text-sm font-bold uppercase tracking-widest">Define el concepto a la izquierda<br/>para forjar tu narrativa.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};