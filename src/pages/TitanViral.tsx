import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Dna, RefreshCw, Zap, Copy, Save, Link as LinkIcon,
    Target, User, Briefcase, FileCode2, CheckCircle2, AlertCircle, Sparkles,
    Layout, AlignLeft, Video, Brain, BookOpen, ArrowRight
} from 'lucide-react';

// Costos
const COST_FULL_PROCESS = 10; // Autopsia + Adaptación
const COST_ONLY_SCRIPT = 5;   // Solo Adaptación (si ya hay ADN)

export const ReverseEngineering = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();

    // --- ESTADOS DE ENTRADA ---
    const [urlInput, setUrlInput] = useState('');
    const [viralDNA, setViralDNA] = useState<any>(null);
    
    // --- ESTADOS DE ADAPTACIÓN (TUS DATOS) ---
    const [myNiche, setMyNiche] = useState('');
    const [myTopic, setMyTopic] = useState('');
    
    // --- CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [kbs, setKbs] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState('');
    const [selectedAvatarId, setSelectedAvatarId] = useState('');
    const [selectedKbId, setSelectedKbId] = useState('');

    // --- PROCESO ---
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'adapting' | 'done'>('idle');
    const [resultScript, setResultScript] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'script' | 'visual' | 'analysis'>('script');
    const [isSaving, setIsSaving] = useState(false);

    // 1. CARGA INICIAL
    useEffect(() => {
        // Si venimos de AnalyzeViral, cargamos el ADN
        if (location.state?.viralDNA) {
            setViralDNA(location.state.viralDNA);
            if(location.state.originalUrl) setUrlInput(location.state.originalUrl);
        } 
        
        // Cargar Perfiles de Supabase
        if (user) {
            const loadData = async () => {
                const { data: exp } = await supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id);
                if(exp) {
                    setExperts(exp);
                    // Auto-seleccionar si hay perfil activo
                    if(userProfile?.active_expert_id) {
                        const active = exp.find(e => e.id === userProfile.active_expert_id);
                        if (active) { setSelectedExpertId(active.id); setMyNiche(active.niche); }
                    }
                }
                const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user.id);
                if(av) { setAvatars(av); if(userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id); }
                const { data: kb } = await supabase.from('documents').select('id, title').eq('user_id', user.id);
                if(kb) setKbs(kb);
            };
            loadData();
        }
    }, [location, user, userProfile]);

    // 2. EL PROCESADOR MAESTRO
    const handleProcess = async () => {
        if (!myTopic.trim()) return alert("⚠️ Define el tema de tu video.");
        if (!myNiche.trim()) return alert("⚠️ Define tu nicho.");

        const needsAutopsy = !viralDNA && urlInput;
        const totalCost = needsAutopsy ? COST_FULL_PROCESS : COST_ONLY_SCRIPT;

        if (needsAutopsy && !urlInput.includes('http')) return alert("⚠️ URL inválida.");

        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < totalCost) {
            if(confirm(`Saldo insuficiente (${totalCost} cr). ¿Recargar?`)) navigate('/settings');
            return;
        }

        setResultScript(null);
        
        try {
            let dnaToUse = viralDNA;

            // PASO A: EXTRAER EL ADN (Si no existe)
            if (needsAutopsy) {
                setStatus('analyzing');
                const { data: autopsyData, error: autopsyError } = await supabase.functions.invoke('process-url', {
                    body: {
                        selectedMode: 'autopsia_viral',
                        userInput: urlInput,
                        platform: urlInput.includes('youtu') ? 'youtube' : 'tiktok',
                        estimatedCost: 5
                    }
                });

                if (autopsyError || !autopsyData?.generatedData) throw new Error("Fallo al analizar el video original.");
                dnaToUse = autopsyData.generatedData;
                setViralDNA(dnaToUse); 
            }

            // PASO B: ADAPTACIÓN AL NICHO (La Magia)
            setStatus('adapting');
            
            // Construimos el "Manual de Instrucciones" para la IA
            const adaptationPrompt = `
            🚨 MODO: INGENIERÍA INVERSA (ADAPTACIÓN DE NICHO) 🚨
            
            OBJETIVO: Escribir un guion viral para el NICHO: "${myNiche}"
            SOBRE EL TEMA: "${myTopic}"

            INPUT MATEMÁTICO (ESTRUCTURA A REPLICAR):
            ${JSON.stringify({
                gancho_tipo: dnaToUse.adn_extraido?.formula_gancho,
                estructura_tiempos: dnaToUse.desglose_temporal,
                patron_viral: dnaToUse.patron_replicable
            })}

            INSTRUCCIONES DE TRADUCCIÓN (CRÍTICO):
            1. NO copies el texto del video original. Solo copia la LÓGICA.
            2. Si el video original (Cocina) dice: "No laves el pollo", y el nuevo nicho es (Bienes Raíces), tú escribe: "No vendas sin agente".
            3. Mantén los mismos tiempos de corte (ej: cambio de plano al segundo 3).
            4. Usa el tono del Experto y el dolor del Avatar proporcionados.
            `;

            const { data: scriptData, error: scriptError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'generar_guion',
                    userInput: adaptationPrompt, // Enviamos el prompt diseñado
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: 5,
                    settings: { structure: 'winner_rocket', duration: 'medium' }
                }
            });

            if (scriptError || !scriptData?.generatedData) throw new Error("Fallo en la adaptación.");

            setResultScript(scriptData.generatedData);
            setStatus('done');
            if(refreshProfile) refreshProfile();

        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
            setStatus('idle');
        }
    };

    const handleSave = async () => {
        if (!resultScript || !user) return;
        setIsSaving(true);
        try {
            await supabase.from('content_items').insert({
                user_id: user.id,
                type: 'script',
                title: `CLON: ${myTopic}`,
                content: resultScript,
                status: 'draft',
                platform: 'General'
            });
            alert("✅ Guardado en Biblioteca");
        } catch (e) { alert("Error al guardar"); }
        finally { setIsSaving(false); }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 p-4 font-sans text-white animate-in fade-in duration-500">
            
            {/* HEADER */}
            <div className="flex items-center gap-4 border-b border-gray-800 pb-6 mb-8">
                <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20">
                    <Zap size={32} className="text-fuchsia-400"/>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">INGENIERÍA INVERSA</h1>
                    <p className="text-gray-400 text-sm">Convierte el éxito viral de otros en tu propio contenido.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 👈 IZQUIERDA: EL LABORATORIO */}
                <div className="space-y-6">
                    
                    {/* 1. FUENTE VIRAL */}
                    <div className={`border rounded-3xl p-6 relative overflow-hidden transition-all ${viralDNA ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-[#0B0E14] border-gray-800'}`}>
                        {viralDNA ? (
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 size={12}/> ADN Detectado
                                    </span>
                                    <button onClick={() => {setViralDNA(null); setUrlInput('');}} className="text-[10px] text-gray-500 hover:text-white underline">Cambiar</button>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 truncate">"{viralDNA.adn_extraido?.idea_ganadora || "Estructura Viral"}"</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-black/30 p-2 rounded border border-white/5">
                                        <span className="block text-[8px] text-gray-500 uppercase">Patrón</span>
                                        <span className="text-xs text-cyan-200">{viralDNA.patron_replicable?.nombre_patron}</span>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded border border-white/5">
                                        <span className="block text-[8px] text-gray-500 uppercase">Trigger</span>
                                        <span className="text-xs text-cyan-200">{viralDNA.adn_extraido?.disparador_psicologico}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-3 block tracking-widest">1. Link del Video Viral</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500"><LinkIcon size={18}/></div>
                                    <input 
                                        type="text"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="Pega URL de TikTok, Reels o YouTube..."
                                        className="w-full bg-black border border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-4 opacity-5"><FileCode2 size={100}/></div>
                    </div>

                    {/* 2. TU ADAPTACIÓN */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-600"></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles size={16} className="text-yellow-400"/> Tu Adaptación
                        </h3>

                        <div className="space-y-5">
                            {/* Contexto Inteligente */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative group">
                                    <select value={selectedExpertId} onChange={(e) => {
                                        const exp = experts.find(x => x.id === e.target.value);
                                        setSelectedExpertId(e.target.value);
                                        if(exp) setMyNiche(exp.niche);
                                    }} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"><option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                                    <User size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                                <div className="relative group">
                                    <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"><option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                                    <Target size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                                <div className="relative group">
                                    <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-[10px] rounded-lg p-2.5 outline-none focus:border-fuchsia-500 appearance-none cursor-pointer"><option value="">Base</option>{kbs.map(k => <option key={k.id} value={k.id}>{k.title}</option>)}</select>
                                    <BookOpen size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/>
                                </div>
                            </div>

                            {/* Nicho Manual */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tu Nicho</label>
                                <input 
                                    type="text" 
                                    value={myNiche} 
                                    onChange={(e) => setMyNiche(e.target.value)} 
                                    placeholder="Ej: Finanzas Personales..." 
                                    className="w-full bg-transparent border-b border-gray-800 py-2 text-sm text-white focus:border-fuchsia-500 outline-none"
                                />
                            </div>

                            {/* Nuevo Tema */}
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tu Nuevo Tema</label>
                                <textarea 
                                    value={myTopic}
                                    onChange={(e) => setMyTopic(e.target.value)}
                                    placeholder="¿De qué quieres hablar? Ej: 3 Errores al comprar casa..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm focus:border-fuchsia-500 outline-none h-24 resize-none"
                                />
                            </div>

                            <button 
                                onClick={handleProcess} 
                                disabled={status !== 'idle' || !myTopic.trim()}
                                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black rounded-xl flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-fuchsia-500/20 transition-all active:scale-95 disabled:opacity-50 group mt-2"
                            >
                                {status === 'analyzing' && <><RefreshCw className="animate-spin" size={18}/> ESCANEANDO VIDEO...</>}
                                {status === 'adapting' && <><RefreshCw className="animate-spin" size={18}/> ADAPTANDO AL NICHO...</>}
                                {status === 'idle' && <><Zap size={18} className="text-yellow-300 fill-yellow-300"/> {viralDNA ? 'GENERAR ADAPTACIÓN' : 'ANALIZAR Y ADAPTAR'}</>}
                                {status === 'done' && <><CheckCircle2 size={18} /> COMPLETADO</>}
                            </button>
                            
                            <p className="text-center text-[10px] text-gray-500">
                                Costo: <span className="text-white font-bold">{viralDNA ? COST_ONLY_SCRIPT : COST_FULL_PROCESS} Créditos</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 👉 DERECHA: RESULTADO (GUION ADAPTADO) */}
                <div className="lg:col-span-8 h-full">
                    {resultScript ? (
                        <div className="bg-[#0B0E14] border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col animate-in slide-in-from-bottom-8">
                            
                            {/* Toolbar */}
                            <div className="p-6 border-b border-gray-800 bg-gray-900/30 flex justify-between items-center">
                                <div>
                                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit mb-2">
                                        <CheckCircle2 size={12}/> Adaptación Exitosa
                                    </span>
                                    <h2 className="text-xl font-black text-white leading-tight max-w-sm">{resultScript.metadata_guion?.tema_tratado || myTopic}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {navigator.clipboard.writeText(resultScript.guion_completo); alert("Texto Copiado")}} className="p-2 bg-gray-800 rounded-lg hover:text-white text-gray-400 border border-gray-700" title="Copiar"><Copy size={18}/></button>
                                    <button onClick={handleSave} disabled={isSaving} className="p-2 bg-gray-800 rounded-lg hover:text-white text-gray-400 border border-gray-700" title="Guardar"><Save size={18}/></button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-800 bg-black/20">
                                <button onClick={() => setActiveTab('script')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'script' ? 'text-white border-b-2 border-fuchsia-500 bg-fuchsia-500/5' : 'text-gray-500 hover:text-gray-300'}`}><AlignLeft size={14}/> Teleprompter</button>
                                <button onClick={() => setActiveTab('visual')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'visual' ? 'text-white border-b-2 border-green-500 bg-green-500/5' : 'text-gray-500 hover:text-gray-300'}`}><Video size={14}/> Escenas</button>
                                <button onClick={() => setActiveTab('analysis')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 ${activeTab === 'analysis' ? 'text-white border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}><Brain size={14}/> Psicología</button>
                            </div>

                            {/* Contenido */}
                            <div className="p-6 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                
                                {activeTab === 'script' && (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="bg-black/40 p-8 rounded-2xl border border-gray-800/50 shadow-inner">
                                            <p className="text-gray-200 whitespace-pre-wrap font-medium leading-relaxed font-mono text-lg">
                                                {resultScript.guion_completo}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'visual' && (
                                    <div className="space-y-3 animate-in fade-in">
                                        {resultScript.plan_visual?.map((scene: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:bg-gray-900 transition-colors">
                                                <span className="text-xs font-mono font-bold text-gray-500 w-16 text-right pt-1">{scene.tiempo}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-bold mb-1">{scene.accion_en_pantalla}</p>
                                                    <div className="flex gap-3 mt-2">
                                                        <span className="text-[10px] bg-fuchsia-500/10 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-500/20">🎥 {scene.instruccion_produccion}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'analysis' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                                        <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Gatillo Mental</span><p className="text-white font-medium">{resultScript.analisis_psicologico?.gatillo_mental_principal}</p></div>
                                        <div className="bg-gray-900/30 p-4 rounded-xl border border-gray-800"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Emoción</span><p className="text-white font-medium">{resultScript.analisis_psicologico?.emocion_objetivo}</p></div>
                                        <div className="col-span-2 mt-4"><h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Ganchos Alternativos</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {resultScript.ganchos_opcionales?.map((hook: any, i: number) => (
                                                    <div key={i} className="p-3 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center"><span className="text-xs text-gray-300 italic">"{hook.texto}"</span><span className="text-[10px] font-bold text-green-400 ml-2">{hook.retencion_predicha}%</span></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-800 flex justify-end">
                                <button onClick={() => navigate('/tools/script-generator', { state: { prefilledScript: resultScript } })} className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors">
                                    Abrir en Editor Avanzado <ArrowRight size={14}/>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-[#0B0E14]/50 min-h-[500px]">
                            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-2xl opacity-50 relative group">
                                <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
                                <Layout size={40} className="text-gray-700 relative z-10 group-hover:text-gray-500 transition-colors" />
                            </div>
                            <h3 className="text-white font-black text-xl mb-3 opacity-50">ESPERANDO DATOS</h3>
                            <p className="text-gray-500 text-sm max-w-[280px] font-medium leading-relaxed">
                                {viralDNA ? "ADN Viral listo. Completa los datos a la izquierda para fusionar." : "Ingresa una URL o usa el Escáner para comenzar."}
                            </p>
                        </div>
                    )}
                </div>

            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};