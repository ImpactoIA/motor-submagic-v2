import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// 👇 CORRECCIÓN AQUÍ: Quita un "../" en ambas líneas
import { supabase } from '../lib/supabase'; 
import { useAuth } from '../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, Save,
    Video, Instagram, Youtube, Linkedin, CheckCircle2, Clock, AlignLeft,
    User, Users, BookOpen, AlertCircle, PenTool, Layout, Brain, Target
} from 'lucide-react';
// ==================================================================================
// 1. CONFIGURACIÓN Y LISTAS ESTÁTICAS
// ==================================================================================

// --- 🏗️ ARQUITECTURAS VIRALES ---
const STRUCTURES = [
    { 
        id: 'winner_rocket', 
        label: 'Winner Rocket 🚀', 
        desc: 'La fórmula viral de 7 pasos. Retención máxima + Loops.', 
        color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
        recommended: true
    },
    { 
        id: 'pas', 
        label: 'Dolor Profundo (PAS)', 
        desc: 'Problema → Agitación → Solución. Venta directa.', 
        color: 'border-red-500/50 bg-red-500/5 text-red-400',
        recommended: false
    },
    { 
        id: 'aida', 
        label: 'Clásica (AIDA)', 
        desc: 'Atención → Interés → Deseo → Acción.', 
        color: 'border-blue-500/50 bg-blue-500/5 text-blue-400',
        recommended: false
    },
    { 
        id: 'hso', 
        label: 'Storytelling (HSO)', 
        desc: 'Gancho → Historia → Oferta/Lección.', 
        color: 'border-purple-500/50 bg-purple-500/5 text-purple-400',
        recommended: false
    }
];

// --- 🧠 MATRIZ PSICOLÓGICA ---
const AWARENESS_LEVELS = [
    "Totalmente Inconsciente (No sabe que tiene problema)",
    "Consciente del Problema (Siente dolor, busca nombre)",
    "Consciente de la Solución (Conoce métodos)",
    "Consciente del Producto (Te conoce, duda compra)"
];

const OBJECTIVES = [
    "Educar / Valor",
    "Inspirar / Motivar",
    "Persuadir / Vender",
    "Entretener / Viralidad",
    "Romper Objeciones"
];

const SITUATIONS = [
    "Dolor Agudo (Urgencia)",
    "Miedo / Incertidumbre",
    "Deseo / Ambición",
    "Curiosidad Pura",
    "Escepticismo"
];

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

// --- ⏱️ DURACIONES & COSTOS ---
const DURATIONS = [
    { id: 'short', label: 'Flash (30s)', cost: 5, desc: 'Viralidad Rápida' },
    { id: 'medium', label: 'Estándar (60s)', cost: 5, desc: 'Retención' },
    { id: 'long', label: 'Profundo (90s)', cost: 5, desc: 'Autoridad' },
    { id: 'masterclass', label: 'Masterclass (+5m)', cost: 32, desc: 'Curso Completo' },
];

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20' }
];

// ==================================================================================
// 2. COMPONENTE PRINCIPAL
// ==================================================================================

export const ScriptGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [selectedStructure, setSelectedStructure] = useState('winner_rocket');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [durationId, setDurationId] = useState('medium');
    const [hookType, setHookType] = useState(MASTER_HOOKS[0].name);

    // --- ESTADOS PSICOLÓGICOS ---
    const [awareness, setAwareness] = useState(AWARENESS_LEVELS[1]);
    const [objective, setObjective] = useState(OBJECTIVES[0]);
    const [situation, setSituation] = useState(SITUATIONS[0]);
    
    // --- ESTADOS DE CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState('');
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedKbId, setSelectedKbId] = useState('');
    
    // --- ESTADOS DE PROCESO ---
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [cost, setCost] = useState(5);

    // --- CARGA INICIAL DE DATOS ---
    useEffect(() => {
        if (!user) return;
        
        // Cargar Expertos
        supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id)
            .then(({ data }) => { if (data) setExperts(data); });

        // Cargar Bases de Conocimiento
        supabase.from('documents').select('id, title').eq('user_id', user.id)
            .then(({ data }) => { if (data) setKnowledgeBases(data); });
        
        // Si viene de otra página (Navegación)
        if (location.state?.topic) setTopic(location.state.topic);
        
        // Defaults del perfil
        if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);

    }, [user, userProfile, location]);

    // --- CALCULAR COSTO EN TIEMPO REAL ---
    useEffect(() => {
        const d = DURATIONS.find(x => x.id === durationId);
        if (d) setCost(d.cost);
    }, [durationId]);

    // ==================================================================================
    // 3. FUNCIÓN GENERAR (CONECTADA AL BACKEND V300)
    // ==================================================================================
    const handleGenerate = async () => {
        if (!topic) return alert("Por favor escribe un tema.");
        
        // Validación de Saldo
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
            if(confirm(`⚠️ Saldo insuficiente (${cost} créditos). ¿Deseas recargar?`)) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setResult(null);

        try {
            // Llamada al Backend (Titan Engine)
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'generar_guion',
                    userInput: topic,
                    
                    // 👇 PAQUETE DE DATOS COMPLETO PARA EL CEREBRO
                    settings: {
                        structure: selectedStructure, // 'winner_rocket'
                        awareness: awareness,
                        objective: objective,
                        situation: situation,
                        duration: durationId, // 'masterclass' = 32 créditos
                        hook_type: hookType,
                        platform: selectedPlatform.label
                    },
                    
                    // Contexto
                    expertId: selectedExpertId,
                    knowledgeBaseId: selectedKbId,
                    
                    // Validación de Costo
                    estimatedCost: cost
                }
            });

            if (apiError) throw apiError;
            
            // Éxito
            setResult(data.generatedData);
            if(refreshProfile) refreshProfile(); // Actualizar créditos en UI

        } catch (e: any) {
            console.error("Error Generando:", e);
            setError(e.message || "Error al conectar con el cerebro IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- GUARDAR EN BASE DE DATOS ---
    const handleSave = async () => {
        if (!result) return;
        try {
            await supabase.from('scripts').insert({
                user_id: user?.id,
                topic: topic,
                content: result, // Guardamos el JSON completo
                format: selectedPlatform.label,
                status: 'saved',
                created_at: new Date()
            });
            alert("✅ Guion guardado en tu Biblioteca.");
        } catch (e) { 
            console.error(e);
            alert("Error al guardar."); 
        }
    };

    // ==================================================================================
    // 4. RENDERIZADO (UI)
    // ==================================================================================
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        <PenTool className="text-pink-500"/> SCRIPT WRITER V300
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Arquitectura Winner Rocket + Psicología de Masas.</p>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Tus Créditos:</span>
                    <span className="text-sm font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 👈 IZQUIERDA: CONTROLES (5 Columnas) */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 1. TEMA Y PLATAFORMA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg group hover:border-gray-700 transition-colors">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 block tracking-widest">1. Tema Principal</label>
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ej: Cómo invertir en bienes raíces sin dinero..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none h-24 resize-none transition-all focus:ring-1 focus:ring-indigo-500/50"
                        />
                        
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {PLATFORMS.map(p => (
                                <button key={p.id} onClick={() => setSelectedPlatform(p)} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedPlatform.id === p.id ? `${p.bg} ${p.color} border-current ring-1 ring-current` : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                                    <p.icon size={16} />
                                    <span className="text-[9px] font-bold">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. ARQUITECTURA VIRAL */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <Layout size={14} /> 2. Estructura Narrativa
                        </label>
                        <div className="space-y-2">
                            {STRUCTURES.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStructure(s.id)}
                                    className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                                        selectedStructure === s.id ? s.color : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className="font-bold text-sm">{s.label}</span>
                                        {selectedStructure === s.id && <CheckCircle2 size={16} />}
                                    </div>
                                    <p className="text-[10px] opacity-70 relative z-10 mt-1">{s.desc}</p>
                                    
                                    {/* Efecto Brillo para Winner Rocket */}
                                    {s.recommended && selectedStructure === s.id && (
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/20 blur-2xl -translate-y-8 translate-x-8"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. MATRIZ PSICOLÓGICA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                            <Brain size={14} /> 3. Configuración Psicológica
                        </label>
                        
                        <div>
                            <span className="text-[10px] text-indigo-400 font-bold block mb-1">NIVEL DE CONCIENCIA</span>
                            <select value={awareness} onChange={(e) => setAwareness(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500 transition-colors">
                                {AWARENESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <span className="text-[10px] text-pink-400 font-bold block mb-1">OBJETIVO DEL VIDEO</span>
                            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-pink-500 transition-colors">
                                {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <span className="text-[10px] text-orange-400 font-bold block mb-1">SITUACIÓN DEL AVATAR</span>
                            <select value={situation} onChange={(e) => setSituation(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-orange-500 transition-colors">
                                {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 4. CONFIGURACIÓN FINAL (GANCHO, DURACIÓN, EXPERTO) */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
                        
                        {/* Selector de Ganchos (LISTA MAESTRA DE 40) */}
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Estilo de Gancho</label>
                            <select value={hookType} onChange={(e) => setHookType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500 transition-colors">
                                {MASTER_HOOKS.map((h, i) => <option key={i} value={h.name}>{h.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Duración & Costo</label>
                            <div className="grid grid-cols-2 gap-2">
                                {DURATIONS.map(d => (
                                    <button key={d.id} onClick={() => setDurationId(d.id)} className={`p-2.5 rounded-xl border flex justify-between items-center transition-all ${durationId === d.id ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-900/20' : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800'}`}>
                                        <span className="text-[10px] font-bold text-white">{d.label}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${durationId === d.id ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500'}`}>{d.cost}Cr</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Selector de Experto */}
                        <div className="relative">
                            <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none"><option value="">-- Usar Experto (Opcional) --</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                            <User size={14} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none"/>
                        </div>
                    </div>

                    {/* BOTÓN MAGISTRAL */}
                    <button onClick={handleGenerate} disabled={!topic || isGenerating} className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Zap size={20} className="group-hover:text-yellow-300 transition-colors"/>}
                        {isGenerating ? 'ANALIZANDO PSICOLOGÍA...' : `GENERAR GUION (${cost} CR)`}
                    </button>
                    {error && <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2"><AlertCircle size={14}/> {error}</div>}
                </div>

                {/* 👉 DERECHA: RESULTADOS (7 Columnas) */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col animate-in slide-in-from-bottom-8 duration-700">
                            
                            {/* Barra Superior */}
                            <div className="flex justify-between items-start border-b border-gray-800 pb-5 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1"><CheckCircle2 size={10}/> Completado</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded bg-gray-900">{result.metadata_guion?.arquitectura || selectedStructure}</span>
                                    </div>
                                    <h2 className="text-xl font-black text-white leading-tight max-w-lg">{topic}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => {navigator.clipboard.writeText(result.guion_completo); alert("✅ Copiado al portapapeles")}} className="p-2.5 bg-gray-900 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all border border-gray-800 shadow-sm" title="Copiar Texto"><Copy size={18}/></button>
                                    <button onClick={handleSave} className="px-5 py-2.5 bg-white text-black rounded-xl hover:bg-gray-200 font-bold text-xs uppercase shadow-lg flex items-center gap-2 transition-colors"><Save size={16}/> Guardar</button>
                                </div>
                            </div>

                            {/* Ganchos Alternativos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {result.ganchos_opcionales?.map((hook: any, idx: number) => (
                                    <div key={idx} className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-colors group">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">{hook.tipo}</span>
                                            <span className="text-[10px] font-bold text-green-400 flex items-center gap-1"><Target size={10}/> {hook.retencion_predicha}% Retención</span>
                                        </div>
                                        <p className="text-sm text-gray-300 italic group-hover:text-white transition-colors">"{hook.texto}"</p>
                                    </div>
                                ))}
                            </div>

                            {/* GUION TELEPROMPTER */}
                            <div className="flex-1 space-y-3 mb-8">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><AlignLeft size={14}/> Teleprompter Mode</label>
                                <div className="bg-black/60 p-8 rounded-2xl border border-gray-800 text-gray-200 text-lg leading-relaxed font-medium whitespace-pre-wrap shadow-inner max-h-[600px] overflow-y-auto font-mono selection:bg-pink-500 selection:text-white">
                                    {result.guion_completo}
                                </div>
                            </div>

                            {/* Plan Visual (Tabla) */}
                            <div className="border-t border-gray-800 pt-6">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Video size={14}/> Plan de Rodaje</label>
                                <div className="space-y-3">
                                    {result.plan_visual?.map((scene: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 items-center hover:bg-gray-900 transition-colors">
                                            <span className="text-xs font-black text-gray-500 w-16 text-right font-mono">{scene.tiempo}</span>
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-medium mb-1">{scene.accion_en_pantalla}</p>
                                                <div className="flex gap-3">
                                                    <span className="text-[10px] text-indigo-400 uppercase tracking-wide">🎥 {scene.instruccion_produccion}</span>
                                                    {scene.audio && <span className="text-[10px] text-pink-400 uppercase tracking-wide">🎵 {scene.audio}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        // ESTADO VACÍO
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/20 min-h-[600px]">
                            <div className="p-6 bg-gray-900 rounded-full mb-6 shadow-xl">
                                <Wand2 size={48} className="text-gray-600"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lienzo Creativo Vacío</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                                Configura la psicología y estructura a la izquierda para que la IA diseñe tu próximo viral.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};