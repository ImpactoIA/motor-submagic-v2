import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, Save, Calendar as CalendarIcon, Gavel,
    Video, Instagram, Youtube, Linkedin, CheckCircle2, AlignLeft,
    User, AlertCircle, PenTool, Layout, Brain, Target, XCircle
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES Y TIPOS
// ==================================================================================

interface ScriptResult {
    metadata_guion?: {
        tema_tratado?: string;
        arquitectura?: string;
        duracion_estimada?: string;
        tono_voz?: string;
    };
    ganchos_opcionales?: Array<{
        tipo: string;
        texto: string;
        retencion_predicha: number;
    }>;
    guion_completo: string;
    plan_visual?: Array<{
        tiempo: string;
        accion_en_pantalla: string;
        instruccion_produccion: string;
        audio?: string;
    }>;
    analisis_psicologico?: {
        gatillo_mental_principal: string;
        emocion_objetivo: string;
    };
}

interface AuditResult {
    veredicto_final?: {
        score_total: number;
        clasificacion: string;
        probabilidad_viral: string;
        confianza_prediccion?: string;
    };
    evaluacion_criterios?: Array<{
        criterio: string;
        score: number;
        analisis: string;
        sugerencia: string;
    }>;
    fortalezas_clave?: string[];
    debilidades_criticas?: Array<{
        problema: string;
        impacto: string;
        solucion: string;
    }>;
    optimizaciones_rapidas?: string[];
    prediccion_metricas?: {
        vistas_estimadas: string;
        engagement_rate: string;
        tiempo_viralizacion: string;
    };
    decision_recomendada?: string;
}

// ==================================================================================
// 📚 CONFIGURACIÓN Y CONSTANTES
// ==================================================================================

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

const AWARENESS_LEVELS = [
    "Totalmente Inconsciente", 
    "Consciente del Problema", 
    "Consciente de la Solución", 
    "Consciente del Producto"
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

const MASTER_HOOKS = [
    { name: '👁️ Frame Break (Ruptura Visual)' }, 
    { name: '🔮 Objeto Mágico' }, 
    { name: '📸 Antes y Después' },
    { name: '🏃‍♂️ En Movimiento' }, 
    { name: '👀 Sneak Peek (Vistazo)' }, 
    { name: '⚡ Chasquido' },
    { name: '🚫 Stop Scroll' }, 
    { name: '❌ Mito vs Verdad' }, 
    { name: '😡 Enemigo Común' },
    { name: '⛔ Gancho Negativo' }, 
    { name: '🤡 El Ridículo' }, 
    { name: '🤫 El Secreto' },
    { name: '❓ Pregunta Provocadora' }, 
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
    { name: '🪞 Identidad' }, 
    { name: '🏆 Reto' }
];

const DURATIONS = [
    { id: 'short', label: 'Flash (30s)', cost: 5 },
    { id: 'medium', label: 'Estándar (60s)', cost: 5 },
    { id: 'long', label: 'Profundo (90s)', cost: 5 },
    { id: 'masterclass', label: 'Masterclass (+5m)', cost: 30 },
];

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20' }
];

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const ScriptGenerator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- Estados de UI ---
    const [topic, setTopic] = useState('');
    const [selectedStructure, setSelectedStructure] = useState('winner_rocket');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [durationId, setDurationId] = useState('medium');
    const [hookType, setHookType] = useState(MASTER_HOOKS[0].name);

    // --- Estados Psicológicos ---
    const [awareness, setAwareness] = useState(AWARENESS_LEVELS[1]);
    const [objective, setObjective] = useState(OBJECTIVES[0]);
    const [situation, setSituation] = useState(SITUATIONS[0]);
    
    // --- Estados de Contexto ---
    const [experts, setExperts] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState('');
    
    // --- Estados de Proceso ---
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<ScriptResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cost, setCost] = useState(5);

    // --- Estados de Auditoría ---
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [showAudit, setShowAudit] = useState(false);

    // --- Estados de Guardado ---
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // ==================================================================================
    // 🔄 EFECTOS
    // ==================================================================================

    // Carga inicial de expertos
    useEffect(() => {
        if (!user) return;
        
        const loadExperts = async () => {
            const { data, error } = await supabase
                .from('expert_profiles')
                .select('id, niche, name')
                .eq('user_id', user.id);
            
            if (data && !error) setExperts(data);
        };
        
        loadExperts();
        
        // Cargar tema desde navegación
        if (location.state?.topic) setTopic(location.state.topic);
        
        // Seleccionar experto activo
        if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
    }, [user, userProfile, location]);

    // Calcular costo dinámicamente
    useEffect(() => {
        const duration = DURATIONS.find(d => d.id === durationId);
        if (duration) setCost(duration.cost);
    }, [durationId]);

    // ==================================================================================
    // 🎯 FUNCIONES PRINCIPALES
    // ==================================================================================

    /**
     * Generar guion usando el backend V105
     */
    const handleGenerate = async () => {
        // Validaciones
        if (!topic.trim()) {
            setError("Por favor escribe un tema para el guion.");
            return;
        }
        
        // Verificar créditos
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
            const shouldRecharge = confirm(
                `⚠️ Saldo insuficiente. Necesitas ${cost} créditos pero tienes ${userProfile?.credits || 0}.\n\n¿Deseas recargar?`
            );
            if (shouldRecharge) navigate('/settings');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setResult(null);
        setAuditResult(null);
        setShowAudit(false);
        setSaveSuccess(false);

        try {
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'generar_guion',
                    topic: topic.trim(), // ✅ CORREGIDO: Enviamos como 'topic'
                    text: topic.trim(),  // ✅ ALTERNATIVA: Por si el backend usa 'text'
                    settings: {
                        structure: selectedStructure,
                        awareness,
                        objective,
                        situation,
                        durationId: durationId, // ✅ AÑADIDO
                        duration: durationId,
                        hook_type: hookType,
                        platform: selectedPlatform.label
                    },
                    expertId: selectedExpertId || undefined,
                    avatarId: userProfile?.active_avatar_id || undefined,
                    estimatedCost: cost
                }
            });

            // Validación robusta de respuesta
            if (apiError) {
                throw new Error(apiError.message || 'Error al conectar con el backend');
            }

            if (!data?.success) {
                throw new Error(data?.error || 'El backend devolvió un error desconocido');
            }

            if (!data?.generatedData) {
                throw new Error('No se generaron datos. Intenta de nuevo.');
            }

            // Validar que tenga el guion completo
            if (!data.generatedData.guion_completo) {
                throw new Error('El backend no devolvió un guion completo. Intenta de nuevo.');
            }

            setResult(data.generatedData);
            
            // Refrescar perfil para actualizar créditos
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error("[ScriptGenerator] Error generando:", e);
            setError(e.message || "Error inesperado. Por favor intenta de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * Guardar guion en la biblioteca (viral_generations)
     */
    const handleSaveLibrary = async () => {
        if (!result || !user) return;
        
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            const { error } = await supabase.from('viral_generations').insert({
                user_id: user.id,
                type: 'generar_guion',
                content: result,
                original_url: null,
                cost_credits: cost,
                platform: selectedPlatform.label,
                tokens_used: 0,
                whisper_minutes: 0
            });

            if (error) throw error;
            
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (e: any) {
            console.error("[ScriptGenerator] Error guardando:", e);
            alert("Error al guardar en biblioteca: " + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Agendar guion para una fecha específica
     */
    const handleAddToCalendar = async () => {
        if (!result || !user) return;
        
        const dateStr = prompt(
            "¿Para qué fecha quieres agendar este guion? (formato: YYYY-MM-DD)", 
            new Date().toISOString().split('T')[0]
        );
        
        if (!dateStr) return;

        // Validar formato de fecha
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            alert("❌ Formato de fecha inválido. Usa: YYYY-MM-DD (ej: 2026-02-15)");
            return;
        }

        try {
            const { error } = await supabase.from('viral_generations').insert({
                user_id: user.id,
                type: 'scheduled_script',
                content: { 
                    ...result, 
                    scheduled_date: dateStr, 
                    topic: topic,
                    platform: selectedPlatform.label
                },
                platform: selectedPlatform.label,
                cost_credits: 0 // Ya se cobró al generar
            });

            if (error) throw error;
            
            alert(`✅ ¡Guion agendado para el ${dateStr}!`);

        } catch (e: any) {
            console.error("[ScriptGenerator] Error agendando:", e);
            alert("Error al agendar: " + e.message);
        }
    };

    /**
     * Auditar el guion con Juez Viral
     */
    const handleAuditScript = async () => {
        if (!result?.guion_completo || !user) return;
        
        setIsAuditing(true);
        setShowAudit(true);
        setAuditResult(null);
        
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'juez_viral',
                    text: result.guion_completo, // ✅ CORREGIDO: Usa 'text' en vez de 'userInput'
                    expertId: selectedExpertId || undefined,
                    avatarId: userProfile?.active_avatar_id || undefined,
                    estimatedCost: 2
                }
            });

            if (error) throw error;
            
            if (!data?.success || !data?.generatedData) {
                throw new Error(data?.error || 'Error en la auditoría');
            }

            setAuditResult(data.generatedData);
            
            // Refrescar créditos
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error("[ScriptGenerator] Error auditando:", e);
            alert("Error en auditoría: " + e.message);
            setShowAudit(false);
        } finally {
            setIsAuditing(false);
        }
    };

    /**
     * Copiar guion al portapapeles
     */
    const handleCopyScript = () => {
        if (!result?.guion_completo) return;
        
        navigator.clipboard.writeText(result.guion_completo)
            .then(() => {
                alert("✅ Guion copiado al portapapeles");
            })
            .catch(() => {
                alert("❌ Error al copiar. Intenta seleccionar y copiar manualmente.");
            });
    };

    // ==================================================================================
    // 🎨 RENDERIZADO
    // ==================================================================================

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* ==================== HEADER ==================== */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        <PenTool className="text-pink-500" size={32}/> 
                        SCRIPT WRITER V300
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Arquitectura Winner Rocket + Psicología de Masas + IA Nivel Dios
                    </p>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Tus Créditos:</span>
                    <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* ==================== CONTROLES (IZQUIERDA) ==================== */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* 1️⃣ TEMA PRINCIPAL */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 block tracking-widest">
                            1. Tema Principal
                        </label>
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ej: Cómo crear contenido viral en TikTok sin mostrar la cara..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none h-24 resize-none transition-all focus:ring-1 focus:ring-indigo-500/50"
                        />
                        
                        {/* Selector de Plataforma */}
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {PLATFORMS.map(p => (
                                <button 
                                    key={p.id} 
                                    onClick={() => setSelectedPlatform(p)} 
                                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                        selectedPlatform.id === p.id 
                                            ? `${p.bg} ${p.color} border-current ring-1 ring-current` 
                                            : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                                    }`}
                                >
                                    <p.icon size={16} />
                                    <span className="text-[9px] font-bold">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2️⃣ ESTRUCTURA NARRATIVA */}
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
                                        selectedStructure === s.id 
                                            ? s.color 
                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                                    }`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className="font-bold text-sm">{s.label}</span>
                                        {selectedStructure === s.id && <CheckCircle2 size={16} />}
                                    </div>
                                    <p className="text-[10px] opacity-70 relative z-10 mt-1">{s.desc}</p>
                                    {s.recommended && selectedStructure === s.id && (
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/20 blur-2xl -translate-y-8 translate-x-8"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3️⃣ CONFIGURACIÓN PSICOLÓGICA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                            <Brain size={14} /> 3. Configuración Psicológica
                        </label>
                        
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Nivel de Consciencia</label>
                            <select 
                                value={awareness} 
                                onChange={(e) => setAwareness(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500"
                            >
                                {AWARENESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Objetivo del Contenido</label>
                            <select 
                                value={objective} 
                                onChange={(e) => setObjective(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-pink-500"
                            >
                                {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Situación del Avatar</label>
                            <select 
                                value={situation} 
                                onChange={(e) => setSituation(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-orange-500"
                            >
                                {SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 4️⃣ CONFIGURACIÓN FINAL */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">
                                Estilo de Gancho
                            </label>
                            <select 
                                value={hookType} 
                                onChange={(e) => setHookType(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
                            >
                                {MASTER_HOOKS.map((h, i) => <option key={i} value={h.name}>{h.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">
                                Duración del Video
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {DURATIONS.map(d => (
                                    <button 
                                        key={d.id} 
                                        onClick={() => setDurationId(d.id)} 
                                        className={`p-2.5 rounded-xl border flex justify-between items-center transition-all ${
                                            durationId === d.id 
                                                ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-900/20' 
                                                : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold text-white">{d.label}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                            durationId === d.id 
                                                ? 'bg-indigo-500 text-white' 
                                                : 'bg-gray-800 text-gray-500'
                                        }`}>
                                            {d.cost}CR
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">
                                Perfil de Experto (Opcional)
                            </label>
                            <select 
                                value={selectedExpertId} 
                                onChange={(e) => setSelectedExpertId(e.target.value)} 
                                className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="">-- Sin experto --</option>
                                {experts.map(e => (
                                    <option key={e.id} value={e.id}>
                                        {e.name} ({e.niche})
                                    </option>
                                ))}
                            </select>
                            <User size={14} className="absolute right-3 top-10 text-gray-500 pointer-events-none"/>
                        </div>
                    </div>

                    {/* 🚀 BOTÓN PRINCIPAL DE GENERACIÓN */}
                    <button 
                        onClick={handleGenerate} 
                        disabled={!topic.trim() || isGenerating} 
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="animate-spin" size={20}/>
                                ANALIZANDO PSICOLOGÍA...
                            </>
                        ) : (
                            <>
                                <Zap size={20} className="group-hover:text-yellow-300 transition-colors"/>
                                GENERAR GUION ({cost} CR)
                            </>
                        )}
                    </button>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2">
                            <AlertCircle size={14}/> 
                            {error}
                        </div>
                    )}
                </div>

                {/* ==================== RESULTADOS (DERECHA) ==================== */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col animate-in slide-in-from-bottom-8 duration-700">
                            
                            {/* Barra Superior de Acciones */}
                            <div className="flex justify-between items-start border-b border-gray-800 pb-5 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                            <CheckCircle2 size={10}/> Completado
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded bg-gray-900">
                                            {result.metadata_guion?.arquitectura || selectedStructure}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-white leading-tight max-w-lg">
                                        {result.metadata_guion?.tema_tratado || topic}
                                    </h2>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    <button 
                                        onClick={handleAddToCalendar} 
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
                                    >
                                        <CalendarIcon size={16}/> Agendar
                                    </button>
                                    <button 
                                        onClick={handleAuditScript}
                                        disabled={isAuditing}
                                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-pink-500/20"
                                    >
                                        {isAuditing ? <RefreshCw className="animate-spin" size={16}/> : <Gavel size={16}/>}
                                        {isAuditing ? 'Auditando...' : 'Auditar'}
                                    </button>
                                    <button 
                                        onClick={handleCopyScript} 
                                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
                                        title="Copiar guion"
                                    >
                                        <Copy size={18}/>
                                    </button>
                                    <button 
                                        onClick={handleSaveLibrary}
                                        disabled={isSaving}
                                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors disabled:opacity-50"
                                        title="Guardar en biblioteca"
                                    >
                                        {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                                    </button>
                                </div>
                            </div>

                            {/* Mensaje de éxito al guardar */}
                            {saveSuccess && (
                                <div className="mb-4 bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-green-400 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 size={14}/> 
                                    Guardado en biblioteca correctamente
                                </div>
                            )}

                            {/* Ganchos Alternativos */}
                            {result.ganchos_opcionales && result.ganchos_opcionales.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {result.ganchos_opcionales.map((hook, idx) => (
                                        <div 
                                            key={idx} 
                                            className="bg-gray-900/40 p-4 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-colors group"
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">
                                                    {hook.tipo}
                                                </span>
                                                <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                                                    <Target size={10}/> {hook.retencion_predicha}% Ret.
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-300 italic group-hover:text-white transition-colors">
                                                "{hook.texto}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* GUION COMPLETO - MODO TELEPROMPTER */}
                            <div className="flex-1 space-y-3 mb-8">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <AlignLeft size={14}/> Modo Teleprompter
                                </label>
                                <div className="bg-black/60 p-8 rounded-2xl border border-gray-800 text-gray-200 text-lg leading-relaxed font-medium whitespace-pre-wrap shadow-inner max-h-[600px] overflow-y-auto font-mono selection:bg-pink-500 selection:text-white">
                                    {result.guion_completo}
                                </div>
                            </div>

                            {/* AUDITORÍA DEL JUEZ VIRAL */}
                            {showAudit && (
                                <div className="mt-8 pt-6 border-t border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="text-lg font-black text-pink-500 mb-4 flex items-center gap-2">
                                        <Gavel size={18}/> Veredicto del Juez Viral
                                    </h3>
                                    
                                    {isAuditing ? (
                                        <div className="flex flex-col items-center gap-4 py-12">
                                            <div className="relative">
                                                <Gavel className="animate-pulse text-pink-500" size={48}/>
                                                <div className="absolute inset-0 animate-ping">
                                                    <Gavel className="text-pink-500 opacity-20" size={48}/>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-pink-400 animate-pulse">
                                                Analizando con 10 criterios virales...
                                            </p>
                                        </div>
                                    ) : auditResult ? (
                                        <div className="bg-pink-900/10 border border-pink-500/20 rounded-2xl p-6">
                                            {/* Score Principal */}
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="text-5xl font-black text-white">
                                                    {auditResult.veredicto_final?.score_total}
                                                    <span className="text-lg text-gray-500">/100</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-pink-400 uppercase tracking-widest">
                                                        {auditResult.veredicto_final?.clasificacion}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Probabilidad: {auditResult.veredicto_final?.probabilidad_viral}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Fortalezas y Debilidades */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-xs font-black text-green-400 uppercase block mb-2">
                                                        ✅ Fortalezas
                                                    </span>
                                                    <ul className="space-y-1">
                                                        {auditResult.fortalezas_clave?.map((f, i) => (
                                                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                                <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0"/> 
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black text-red-400 uppercase block mb-2">
                                                        ⚠️ Puntos Críticos
                                                    </span>
                                                    <ul className="space-y-1">
                                                        {auditResult.debilidades_criticas?.map((d, i) => (
                                                            <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                                <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0"/> 
                                                                {d.problema}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Optimizaciones Rápidas */}
                                            {auditResult.optimizaciones_rapidas && auditResult.optimizaciones_rapidas.length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-pink-500/20">
                                                    <span className="text-xs font-black text-yellow-400 uppercase block mb-2">
                                                        💡 Optimizaciones Rápidas
                                                    </span>
                                                    <ul className="space-y-1">
                                                        {auditResult.optimizaciones_rapidas.map((opt, i) => (
                                                            <li key={i} className="text-xs text-gray-300">
                                                                • {opt}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <AlertCircle size={24} className="mx-auto mb-2"/>
                                            <p className="text-xs">No se pudo obtener la auditoría</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PLAN VISUAL (RODAJE) */}
                            {result.plan_visual && result.plan_visual.length > 0 && (
                                <div className="border-t border-gray-800 pt-6 mt-6">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Video size={14}/> Plan de Rodaje
                                    </label>
                                    <div className="space-y-3">
                                        {result.plan_visual.map((scene, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 items-center hover:bg-gray-900 transition-colors"
                                            >
                                                <span className="text-xs font-black text-gray-500 w-16 text-right font-mono">
                                                    {scene.tiempo}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-medium mb-1">
                                                        {scene.accion_en_pantalla}
                                                    </p>
                                                    <div className="flex gap-3 flex-wrap">
                                                        <span className="text-[10px] text-indigo-400 uppercase tracking-wide">
                                                            🎥 {scene.instruccion_produccion}
                                                        </span>
                                                        {scene.audio && (
                                                            <span className="text-[10px] text-pink-400 uppercase tracking-wide">
                                                                🎵 {scene.audio}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        // ESTADO VACÍO
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/20 min-h-[600px]">
                            <div className="p-6 bg-gray-900 rounded-full mb-6 shadow-xl">
                                <Wand2 size={48} className="text-gray-600"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Lienzo Creativo Vacío
                            </h3>
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