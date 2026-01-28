import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, Save,
    Video, Instagram, Youtube, Linkedin, CheckCircle2, Activity, Clock, AlignLeft,
    User, Users, BookOpen, AlertCircle, PenTool
} from 'lucide-react';

// --- 🪝 LISTA MAESTRA DE 40 GANCHOS (COMPLETA) ---
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

// --- 📹 LISTA DE 12 FORMATOS VISUALES (COMPLETA) ---
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
    { id: 'short', label: 'Flash (30s)', cost: 1, desc: 'Viralidad Rápida' },
    { id: 'medium', label: 'Estándar (60s)', cost: 1, desc: 'Retención' },
    { id: 'long', label: 'Profundo (90s+)', cost: 2, desc: 'Autoridad' },
    { id: 'masterclass', label: 'Masterclass', cost: 3, desc: 'Curso Completo' },
];

export const ScriptGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [angle, setAngle] = useState(''); 
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [hookType, setHookType] = useState(MASTER_HOOKS[0].name); 
    const [formatType, setFormatType] = useState(VIDEO_FORMATS[0]);
    const [durationId, setDurationId] = useState('medium'); 
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [cost, setCost] = useState(1); 
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // --- CONTEXTO V300 (Backend Connection) ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- CARGA INICIAL ---
    useEffect(() => {
        if (!user) return;
        fetchContextData();

        // Datos desde navegación (ej: Calendario)
        if (location.state) {
            if (location.state.topic) setTopic(location.state.topic);
            if (location.state.angle) setAngle(location.state.angle);
            if (location.state.format) {
                const fmt = VIDEO_FORMATS.find(f => f.toLowerCase().includes(location.state.format.toLowerCase()));
                if(fmt) setFormatType(fmt);
            }
        }
    }, [user, location]);

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
            if(exp) setExperts(exp);
            
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    // Actualizar costo según duración
    useEffect(() => {
        const sel = DURATIONS.find(d => d.id === durationId);
        if (sel) setCost(sel.cost);
    }, [durationId]);

    // --- GENERACIÓN CONECTADA A BACKEND V300 CON ESTRUCTURA NARRATIVA ---
    const handleGenerate = async () => {
        if (!topic) return alert("Escribe un tema.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
            if(confirm(`Saldo insuficiente (${cost} créditos). ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setResult(null);
        setError(null);

        try {
            // AQUÍ INYECTAMOS LA ESTRUCTURA NARRATIVA OBLIGATORIA
            const structuralPrompt = `
                TEMA: ${topic}. 
                ÁNGULO: ${angle}. 
                GANCHO PREFERIDO: ${hookType}. 
                FORMATO VISUAL: ${formatType}. 
                DURACIÓN: ${DURATIONS.find(d => d.id === durationId)?.label}.

                ⚠️ ESTRUCTURA NARRATIVA OBLIGATORIA (NO LA CAMBIES):
                
                1. HOOK PODEROSO (0-3 seg): Usa el gancho "${hookType}". Frase que dispare curiosidad o afirmación disruptiva. Maximiza impacto.
                
                2. CONTEXTO (4-10 seg): Conecta con el espectador conectando con su realidad (su punto de vista).
                
                3. CONFLICTO (11-20 seg): Revela un error, mito, bloqueo o dolor oculto que el avatar no ve o está cometiendo.
                
                4. CURIOSITY LOOP (21-23 seg): Abre una incógnita antes de dar el tip (“Y cuando descubrí esto…” o “Pero lo curioso es que…”).
                
                5. INSIGHT / VALOR (24-35 seg): Revela la enseñanza potente, tip concreto, método o cambio de mentalidad.
                
                6. RESOLUCIÓN (36-50 seg): Muestra cómo ese conocimiento cambia la situación. Comparte una pequeña victoria, inspira y cierra con moraleja desde el corazón.
                
                7. CIERRE + CTA (51-60 seg): Frase emocional que invite a seguir para aprender más o acompañarte. Llamado a la acción natural.

                REGLAS DE ORO:
                - Incluye al menos 2 puntos de curiosidad.
                - Cierra el loop narrativo antes del final.
                - Usa lenguaje 100% humano, emocional y NO técnico.
            `;

            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'recreate', 
                    platform: selectedPlatform.label,
                    
                    // Enviamos el prompt estructurado como transcript
                    transcript: structuralPrompt,
                    
                    // Contexto V300 (IDs para que el backend lea los perfiles)
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    
                    estimatedCost: cost,
                    // Refuerzo en customPrompt
                    customPrompt: `Escribe un guion viral sobre "${topic}" siguiendo estrictamente la ESTRUCTURA NARRATIVA de 7 pasos provista.`
                },
            });

            if (error) throw error;
            
            setResult(data.generatedData);
            if(refreshProfile) refreshProfile();

        } catch (e: any) { 
            console.error(e);
            setError(e.message || "Error generando guion.");
        } finally { 
            setIsGenerating(false); 
        }
    };

    // --- GUARDAR EN BAÚL ---
    const handleSave = async () => {
        if (!result) return;
        try {
            await supabase.from('scripts').insert({
                user_id: user?.id,
                topic: topic,
                content: result,
                format: selectedPlatform.label,
                hook_type: hookType,
                status: 'saved'
            });
            alert("✅ Guion guardado en el Baúl.");
        } catch (e) { console.error(e); alert("Error al guardar."); }
    };

    // --- COPY TEXTO PLANO ---
    const getCleanText = () => {
        if (!result) return "";
        let text = `TEMA: ${topic}\n\n`;
        text += `GANCHO: ${result.script_structure?.hook || result.hook_variations?.[0]}\n\n`;
        text += `CUERPO:\n${result.script_structure?.body || result.script_body}\n\n`;
        text += `CTA: ${result.script_structure?.cta || "Sígueme para más."}`;
        return text;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2">
                        <PenTool className="text-pink-500"/> SCRIPT WRITER V300
                    </h1>
                    <p className="text-gray-400 text-sm">El arquitecto de guiones con estructura narrativa comprobada.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- IZQUIERDA: CONFIGURACIÓN (5 Cols) --- */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 1. CONTEXTO DE MARCA (V300) */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400">
                            <User size={14}/> Contexto Inteligente
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500 appearance-none"><option value="">Experto...</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><User size={12}/></div>
                                </div>
                                <div className="relative">
                                    <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-2.5 outline-none focus:border-pink-500 appearance-none"><option value="">Avatar...</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><Users size={12}/></div>
                                </div>
                            </div>
                            <div className="relative">
                                <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-2.5 outline-none focus:border-yellow-500 appearance-none"><option value="">Base de Conocimiento (Cerebro)</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}</select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><BookOpen size={12}/></div>
                            </div>
                        </div>
                    </div>

                    {/* 2. CONFIGURACIÓN DEL GUION */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
                        
                        {/* Plataforma */}
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Plataforma</label>
                            <div className="grid grid-cols-4 gap-2">
                                {PLATFORMS.map(p => (
                                    <button key={p.id} onClick={() => setSelectedPlatform(p)} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedPlatform.id === p.id ? `${p.bg} ${p.border} text-white` : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'}`}>
                                        <p.icon size={16} />
                                        <span className="text-[9px] font-bold">{p.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tema y Ángulo */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Tema Principal</label>
                                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Invertir con poco dinero..." className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none font-medium" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Ángulo / Enfoque</label>
                                <textarea value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="Ej: Contrarian, historia personal, mito..." className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none h-20 resize-none" />
                            </div>
                        </div>

                        {/* Selectores Técnicos (FULL LISTS) */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Gancho (0-3s)</label>
                                <select value={hookType} onChange={(e) => setHookType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-xs outline-none cursor-pointer hover:border-gray-600 focus:border-pink-500 transition-colors">
                                    {MASTER_HOOKS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Formato Visual</label>
                                <select value={formatType} onChange={(e) => setFormatType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-xs outline-none cursor-pointer hover:border-gray-600 focus:border-indigo-500 transition-colors">
                                    {VIDEO_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Duración */}
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Duración</label>
                            <div className="grid grid-cols-2 gap-2">
                                {DURATIONS.map(d => (
                                    <button key={d.id} onClick={() => setDurationId(d.id)} className={`p-2 rounded-xl border flex justify-between items-center transition-all ${durationId === d.id ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-900/50 border-gray-800'}`}>
                                        <span className="text-[10px] font-bold text-white">{d.label}</span>
                                        <span className="text-[9px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{d.cost}Cr</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botón Acción */}
                        <button onClick={handleGenerate} disabled={!topic || isGenerating} className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg mt-2 group disabled:opacity-50">
                            {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Zap size={20} className="group-hover:animate-pulse"/>}
                            {isGenerating ? 'ESTRUCTURANDO...' : `GENERAR GUION (${cost} CR)`}
                        </button>
                        
                        {error && <p className="text-red-400 text-xs text-center flex items-center justify-center gap-1"><AlertCircle size={12}/> {error}</p>}
                    </div>
                </div>

                {/* --- DERECHA: RESULTADO (7 Cols) --- */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 relative min-h-[600px] flex flex-col">
                            
                            {/* Header Resultado */}
                            <div className="flex justify-between items-start border-b border-gray-800 pb-6 mb-6">
                                <div>
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2 mb-1"><CheckCircle2 size={12}/> Script Finalizado</span>
                                    <h2 className="text-2xl font-black text-white leading-tight max-w-md line-clamp-2">{topic}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { navigator.clipboard.writeText(getCleanText()); alert("Copiado 🚀"); }} className="p-2.5 bg-gray-900 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all border border-gray-800" title="Copiar"><Copy size={18}/></button>
                                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl hover:bg-gray-200 font-bold transition-all text-xs uppercase tracking-wide shadow-lg"><Save size={16}/> Guardar</button>
                                </div>
                            </div>

                            {/* Score y Métricas */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-2xl flex flex-col">
                                    <span className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Viral Score</span>
                                    <span className="text-2xl font-black text-white">{result.viral_score || 85}/100</span>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Duración Est.</span>
                                    <span className="text-xl font-bold text-gray-300 flex items-center gap-2"><Clock size={16}/> {durationId === 'short' ? '30-45s' : durationId === 'medium' ? '60s' : '90s+'}</span>
                                </div>
                            </div>

                            {/* Script Blocks */}
                            <div className="space-y-6 flex-1">
                                {/* Gancho */}
                                <div className="relative pl-6 border-l-2 border-pink-500">
                                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest absolute -top-3 left-0 bg-[#0B0E14] pr-2">00:00 - GANCHO</span>
                                    <p className="text-white text-lg font-bold italic leading-relaxed">
                                        "{result.script_structure?.hook || result.hook_variations?.[0]}"
                                    </p>
                                    <p className="text-gray-500 text-xs mt-2 font-mono flex items-center gap-1"><Video size={10}/> Visual: {result.translation_engine?.[0]?.your_action || "Hablar a cámara con energía."}</p>
                                </div>

                                {/* Cuerpo */}
                                <div className="relative pl-6 border-l-2 border-gray-700">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest absolute -top-3 left-0 bg-[#0B0E14] pr-2">DESARROLLO (7 FASES)</span>
                                    <div className="text-gray-300 whitespace-pre-wrap leading-7 text-sm font-medium">
                                        {result.script_structure?.body || result.script_body}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="relative pl-6 border-l-2 border-green-500">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest absolute -top-3 left-0 bg-[#0B0E14] pr-2">CIERRE (CTA)</span>
                                    <p className="text-white font-bold leading-relaxed">
                                        "{result.script_structure?.cta || "Sígueme para más."}"
                                    </p>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-gray-700 bg-gray-900/10 min-h-[500px]">
                            <div className="p-5 bg-gray-900/50 rounded-full mb-4"><Wand2 size={40} className="text-gray-600"/></div>
                            <p className="text-sm font-bold uppercase tracking-widest mb-1">Lienzo Vacío</p>
                            <p className="text-xs text-gray-600 max-w-xs">Configura los parámetros a la izquierda para que la IA redacte tu guion maestro.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};