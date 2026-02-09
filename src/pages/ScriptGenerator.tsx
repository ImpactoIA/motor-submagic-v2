import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, Save, Calendar as CalendarIcon, Gavel,
    Video, Instagram, Youtube, Linkedin, CheckCircle2, AlignLeft,
    User, AlertCircle, PenTool, Layout, Brain, Target, XCircle,
    X, ChevronRight, Flame, TrendingUp, MessageCircle, Award, Eye
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES Y TIPOS (ACTUALIZADAS PARA V500)
// ==================================================================================

interface ScriptResult {
    metadata_guion?: {
        tema_tratado?: string;
        plataforma?: string;
        arquitectura?: string;
        objetivo_viral?: string;
        percepcion_creador?: string;
        duracion_estimada?: string;
        tono_voz?: string;
        ritmo?: string;
    };
    ganchos_opcionales?: Array<{
        tipo: string;
        texto: string;
        retencion_predicha: number;
        mecanismo?: string;
    }>;
    guion_completo: string;
    plan_visual?: Array<{
        tiempo: string;
        accion_en_pantalla: string;
        instruccion_produccion: string;
        audio?: string;
        texto_pantalla?: string;
    }>;
    analisis_viral?: {
        loops_abiertos?: string[];
        loops_cerrados?: string[];
        loop_emocional?: string;
        frases_autoridad?: string[];
        trigger_comentarios?: string;
        score_viralidad_predicho?: number;
        advertencias?: string[];
    };
    auto_validacion?: {
        hace_sentir_inspirado: boolean;
        suena_distinto: boolean;
        podria_molestar: boolean;
        sera_recordado: boolean;
        decision: string;
        razon?: string;
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

// ==================================================================================
// 🏛️ MATRIZ TITAN: 9 ESTRUCTURAS x 50 MODOS INTERNOS (DATA MAESTRA)
// ==================================================================================

const TITAN_STRUCTURES = [
  {
    id: 'winner_rocket',
    label: '🚀 Winner Rocket (Oficial)',
    desc: 'La fórmula viral de 7 pasos. Retención máxima + Loops.',
    color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    modes: [
      { id: 'viral_rapido', label: '⚡ Viral Rápido', desc: 'Ritmo frenético, cortes cada 2s.' },
      { id: 'autoridad', label: '👑 Autoridad', desc: 'Demostración de estatus y saber.' },
      { id: 'venta', label: '💰 Venta Directa', desc: 'Conversión al final.' },
      { id: 'storytelling', label: '📖 Storytelling', desc: 'Viaje del héroe en 60s.' },
      { id: 'marca_personal', label: '🙋‍♂️ Marca Personal', desc: 'Conexión y valores.' },
      { id: 'lead_magnet', label: '🧲 Lead Magnet', desc: 'Regalo a cambio de atención.' },
      { id: 'educativo', label: '🧠 Educativo', desc: 'Valor masivo comprimido.' }
    ]
  },
  {
    id: 'aida',
    label: '📢 AIDA (Clásica)',
    desc: 'Atención - Interés - Deseo - Acción.',
    color: 'border-blue-500 bg-blue-500/10 text-blue-400',
    modes: [
      { id: 'educativo', label: '📚 Educativo', desc: 'Enseñar algo nuevo.' },
      { id: 'autoridad', label: '🧠 Autoridad', desc: 'Posicionamiento experto.' },
      { id: 'venta', label: '💸 Venta', desc: 'Push comercial.' },
      { id: 'viral', label: '🔥 Viral', desc: 'Shock inicial fuerte.' },
      { id: 'storytelling', label: '🎭 Drama', desc: 'Narrativa emocional.' },
      { id: 'leads', label: '📥 Captación', desc: 'Generación de prospectos.' }
    ]
  },
  {
    id: 'pas',
    label: '💔 PAS (Dolor Profundo)',
    desc: 'Problema - Agitación - Solución.',
    color: 'border-red-500 bg-red-500/10 text-red-400',
    modes: [
      { id: 'dolor_emocional', label: '😭 Dolor Emocional', desc: 'Ataca la inseguridad.' },
      { id: 'urgencia', label: '⏳ Urgencia', desc: 'Miedo a perderse algo.' },
      { id: 'objecion', label: '🛡️ Romper Objeción', desc: '"Es muy caro" -> No.' },
      { id: 'frustracion', label: '😤 Frustración', desc: '"¿Harto de intentar X?"' },
      { id: 'perdida_futura', label: '📉 Pérdida Futura', desc: 'Qué pasa si no actúas.' }
    ]
  },
  {
    id: 'storytelling',
    label: '🎥 Storytelling (HSO)',
    desc: 'Hook - Story - Offer. Conexión total.',
    color: 'border-pink-500 bg-pink-500/10 text-pink-400',
    modes: [
      { id: 'personal', label: '🧔 Personal', desc: 'Tu propia historia.' },
      { id: 'cliente', label: '🤝 Caso de Éxito', desc: 'Historia de un alumno.' },
      { id: 'error_aprendizaje', label: '💡 Error -> Eureka', desc: 'Cómo aprendí a la mala.' },
      { id: 'transformacion', label: '🦋 Transformación', desc: 'El viaje del punto A al B.' },
      { id: 'confesional', label: '🤫 Confesión', desc: 'Vulnerabilidad estratégica.' },
      { id: 'inspiracional', label: '✨ Inspiracional', desc: 'Motivación pura.' }
    ]
  },
  {
    id: 'viral_shock',
    label: '⚡ Viral Shock',
    desc: 'Polarización y ruptura de patrones.',
    color: 'border-purple-500 bg-purple-500/10 text-purple-400',
    modes: [
      { id: 'opinion_impopular', label: '🤬 Opinión Impopular', desc: 'Contra la corriente.' },
      { id: 'mito_verdad', label: '❌ Mito vs Verdad', desc: 'Desmintiendo la industria.' },
      { id: 'ataque_creencia', label: '👊 Ataque a Creencia', desc: '"Lo que haces no sirve".' },
      { id: 'frase_prohibida', label: '🚫 Lo Prohibido', desc: 'Secretos ocultos.' },
      { id: 'polarizacion', label: '⚖️ Polarización', desc: 'Divide a la audiencia.' }
    ]
  },
  {
    id: 'autoridad',
    label: '🧲 Thought Leader',
    desc: 'Ideas de alto nivel. Estatus.',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    modes: [
      { id: 'marco_mental', label: '🧠 Marco Mental', desc: 'Nueva forma de pensar.' },
      { id: 'insight', label: '💡 Insight Único', desc: 'Información privilegiada.' },
      { id: 'tendencia', label: '📈 Tendencia Futura', desc: 'Predicción del mercado.' },
      { id: 'error_mercado', label: '📉 Error del Mercado', desc: 'Por qué todos fallan.' },
      { id: 'nueva_regla', label: '📏 La Nueva Regla', desc: 'Cambio de paradigma.' }
    ]
  },
  {
    id: 'educativo',
    label: '📚 Educativo Avanzado',
    desc: 'Valor táctico y aplicable.',
    color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    modes: [
      { id: 'framework', label: '🏗️ Framework', desc: 'Sistema paso a paso.' },
      { id: 'checklist', label: '✅ Checklist', desc: 'Lista de verificación.' },
      { id: 'paso_a_paso', label: '👣 Tutorial', desc: 'How-to clásico.' },
      { id: 'error_comun', label: '❌ Error Común', desc: 'Corrección técnica.' },
      { id: 'comparativo', label: '🆚 Comparativo', desc: 'Opción A vs Opción B.' },
      { id: 'mini_clase', label: '🎓 Mini-Clase', desc: 'Lección profunda en 1 min.' }
    ]
  },
  {
    id: 'venta',
    label: '💰 Venta Estratégica',
    desc: 'Diseñado para facturar.',
    color: 'border-green-500 bg-green-500/10 text-green-400',
    modes: [
      { id: 'soft_sell', label: '☁️ Soft Sell', desc: 'Venta suave/indirecta.' },
      { id: 'hard_sell', label: '🔨 Hard Sell', desc: 'Venta directa/agresiva.' },
      { id: 'objeciones', label: '🛡️ Matar Objeciones', desc: 'Antes de que pregunten.' },
      { id: 'caso_real', label: '🏆 Caso Real', desc: 'Prueba social monetizable.' },
      { id: 'oferta_limitada', label: '⏳ Oferta Limitada', desc: 'Escasez y urgencia.' }
    ]
  },
  {
    id: 'comunidad',
    label: '🎯 Leads & Comunidad',
    desc: 'Crecimiento de base de datos.',
    color: 'border-orange-500 bg-orange-500/10 text-orange-400',
    modes: [
      { id: 'reto', label: '🏆 Reto', desc: 'Challenge de X días.' },
      { id: 'lead_magnet', label: '🎁 Lead Magnet', desc: 'Ebook/Plantilla gratis.' },
      { id: 'serie', label: '📺 Serie', desc: 'Parte 1 de X.' },
      { id: 'promesa_abierta', label: '🤝 Promesa', desc: 'Compromiso público.' },
      { id: 'invitacion', label: '💌 Invitación', desc: 'Webinar/Evento.' }
    ]
  }
];

// 🎲 LENTES CREATIVOS (VARIABILIDAD)
const CREATIVE_LENSES = [
    { id: 'auto', label: '🎲 Sorpréndeme (IA Auto)', icon: Zap },
    { id: 'contrarian', label: '⚡ El Disruptor', icon: Flame },
    { id: 'scientific', label: '🧪 Científico Lógico', icon: Brain },
    { id: 'confessional', label: '🙏 Vulnerable / Real', icon: User },
    { id: 'warrior', label: '⚔️ Agresivo / Directo', icon: Target },
    { id: 'comedian', label: '🤡 Sarcástico / Iónico', icon: MessageCircle },
];

const AWARENESS_LEVELS = [
    "Totalmente Inconsciente", 
    "Consciente del Problema", 
    "Consciente de la Solución", 
    "Consciente del Producto"
];

// 🎯 OBJETIVOS GLOBALES (CAPA C - BRÚJULA)
const OBJECTIVES = [
    "Viralidad (Alcance Masivo)", 
    "Autoridad (Posicionamiento)", 
    "Educativo (Valor Puro)", 
    "Venta (Conversión)", 
    "Leads (Captación)", 
    "Marca Personal (Conexión)"
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
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [durationId, setDurationId] = useState('medium');
    const [hookType, setHookType] = useState(MASTER_HOOKS[0].name);

    // ✅ NUEVO: Estados para la Matriz V500
    const [selectedStructure, setSelectedStructure] = useState(TITAN_STRUCTURES[0]); 
    const [selectedInternalMode, setSelectedInternalMode] = useState(TITAN_STRUCTURES[0].modes[0]);
    
    // 👇👇👇 AGRÉGALO AQUÍ 👇👇👇
    const [selectedLens, setSelectedLens] = useState('auto'); // Factor X (Variabilidad)

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

    // --- Estados para el POP-UP de AGENDAR ---
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);

    // ==================================================================================
    // 🔄 EFECTOS
    // ==================================================================================
    
    useEffect(() => {
        if (!user) return;
        
        const loadExperts = async () => {
            const { data } = await supabase
                .from('expert_profiles')
                .select('id, niche, name')
                .eq('user_id', user.id);
            
            if (data) setExperts(data);
        };
        loadExperts();

        if (location.state) {
            let fullText = location.state.topic || '';
            if (location.state.hook && !fullText.includes(location.state.hook)) {
                fullText += `\n\nContexto: ${location.state.hook}`;
            }
            if (fullText) setTopic(fullText);
            window.history.replaceState({}, document.title);
        }
        
        if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);

    }, [user, userProfile, location]);

    // ==================================================================================
    // 🎯 GENERACIÓN (CONEXIÓN AL CEREBRO V500)
    // ==================================================================================

    const handleGenerate = async () => {
        // 1. Validaciones básicas
        if (!topic.trim()) {
            setError("Por favor escribe un tema para el guion.");
            return;
        }
        
        // 2. Verificación de Créditos
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
            const shouldRecharge = confirm(
                `⚠️ Saldo insuficiente. Necesitas ${cost} créditos pero tienes ${userProfile?.credits || 0}.\n\n¿Deseas recargar?`
            );
            if (shouldRecharge) navigate('/dashboard/settings');
            return;
        }

        // 3. Preparar estado de carga
        setIsGenerating(true);
        setError(null);
        setResult(null);
        setAuditResult(null);
        setShowAudit(false);
        setSaveSuccess(false);

        try {
            // 4. Llamada al Backend (Process-URL)
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'generador_guiones',
                    userInput: topic.trim(),
                    topic: topic.trim(),
                    
                    // 👇 AQUÍ ESTÁ LA ACTUALIZACIÓN CLAVE PARA V500 👇
                    settings: {
                        // Plataforma
                        platform: selectedPlatform.label,
                        
                        // Matriz Titan (IDs exactos para el Cerebro)
                        structure: selectedStructure.id,        // Ej: 'winner_rocket'
                        internal_mode: selectedInternalMode.id, // Ej: 'viral_rapido'
                        
                        // 👇👇👇 AGREGA ESTA LÍNEA OBLIGATORIA 👇👇👇
                        creative_lens: selectedLens,            // Ej: 'contrarian'
                        // 👆👆👆 SIN ESTO, LA VARIABILIDAD NO FUNCIONA 👆👆👆
                        
                        // Configuración Psicológica
                        awareness: awareness,
                        objective: objective,
                        situation: situation,
                        
                        // Configuración Técnica
                        durationId: durationId,
                        duration: durationId,
                        hook_type: hookType
                    },
                    // 👆 FIN DE LA ACTUALIZACIÓN 👆

                    expertId: selectedExpertId || undefined,
                    avatarId: userProfile?.active_avatar_id || undefined,
                    estimatedCost: cost
                }
            });

            // 5. Manejo de Errores de API
            if (apiError) throw new Error(apiError.message || 'Error al conectar con el backend');
            if (!data?.success && !data?.generatedData) throw new Error(data?.error || 'El backend devolvió un error desconocido');

            // 6. Procesar Resultado
            const finalResult = data.generatedData || data;
            
            if (!finalResult.guion_completo) {
                throw new Error('El backend no devolvió un guion completo. Intenta de nuevo.');
            }

            setResult(finalResult);
            
            // 7. Actualizar créditos del usuario
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error("[ScriptGenerator] Error generando:", e);
            setError(e.message || "Error inesperado. Por favor intenta de nuevo.");
        } finally {
            setIsGenerating(false);
        }
    };

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

    const handleConfirmSchedule = async () => {
        if (!scheduleDate) return alert("Selecciona una fecha.");
        if (!result || !user) return;

        try {
            const { error } = await supabase.from('content_items').insert({
                user_id: user.id,
                type: 'calendar_event',
                title: result.metadata_guion?.tema_tratado || topic,
                scheduled_date: scheduleDate,
                platform: selectedPlatform.label, 
                status: 'planned',
                content: {
                    objetivo: objective, 
                    formato: 'Video Corto',
                    description: "Agendado desde Script Generator",
                    guion_completo: result.guion_completo, 
                    metadata: result.metadata_guion
                }
            });

            if (error) throw error;

            alert(`✅ Guion agendado exitosamente para el ${scheduleDate}`);
            setIsScheduleModalOpen(false);

        } catch (e: any) {
            alert("Error al agendar: " + e.message);
        }
    };

    const handleAuditScript = async () => {
        if (!result?.guion_completo || !user) return;
        
        setIsAuditing(true);
        setShowAudit(true);
        setAuditResult(null);
        
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'juez_viral',
                    text: result.guion_completo,
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
            
            if (refreshProfile) await refreshProfile();

        } catch (e: any) {
            console.error("[ScriptGenerator] Error auditando:", e);
            alert("Error en auditoría: " + e.message);
            setShowAudit(false);
        } finally {
            setIsAuditing(false);
        }
    };

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
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        <Flame className="text-pink-500" size={32}/> 
                        MOTOR VIRAL V500 ÉLITE
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        8 Capas Virales + Adaptación por Plataforma + Auto-Juez Interno
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
                    
                    {/* TEMA PRINCIPAL */}
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

                   {/* 🏛️ 1. SELECCIÓN DE ESTRUCTURA MAESTRA (TITAN V500) */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg flex flex-col h-[300px]">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <Layout size={14} /> 2. Arquitectura (Elige una base)
                        </label>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                            {TITAN_STRUCTURES.map((s) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => { setSelectedStructure(s); setSelectedInternalMode(s.modes[0]); }}
                                    className={`w-full p-3 rounded-xl border text-left transition-all group relative overflow-hidden ${selectedStructure.id === s.id ? s.color : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'}`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className="font-bold text-sm">{s.label}</span>
                                        {selectedStructure.id === s.id && <CheckCircle2 size={16} />}
                                    </div>
                                    <p className="text-[10px] opacity-70 relative z-10 mt-1">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🧭 2. MODO INTERNO (SE ADAPTA DINÁMICAMENTE) */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg animate-in slide-in-from-left-4 duration-500">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <Target size={14} /> 3. Modo Estratégico ({selectedStructure.modes.length} Variantes)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {selectedStructure.modes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSelectedInternalMode(mode)}
                                    className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between h-full ${
                                        selectedInternalMode.id === mode.id
                                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-900/20'
                                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                                    }`}
                                >
                                    <span className="text-xs font-bold block mb-1">{mode.label}</span>
                                    <span className="text-[9px] opacity-70 leading-tight">{mode.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONFIGURACIÓN PSICOLÓGICA */}
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

                    {/* CONFIGURACIÓN FINAL */}
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

                    {/* BOTÓN PRINCIPAL */}
                    <button 
                        onClick={handleGenerate} 
                        disabled={!topic.trim() || isGenerating} 
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="animate-spin" size={20}/>
                                MOTOR V500 PROCESANDO...
                            </>
                        ) : (
                            <>
                                <Flame size={20} className="group-hover:text-yellow-300 transition-colors"/>
                                GENERAR GUION VIRAL ({cost} CR)
                            </>
                        )}
                    </button>

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
                            
                            {/* Barra Superior */}
                            <div className="flex justify-between items-start border-b border-gray-800 pb-5 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                            <CheckCircle2 size={10}/> Completado
                                        </span>
                                        
                                        {/* 🔥 NUEVO: Mostrar plataforma */}
                                        {result.metadata_guion?.plataforma && (
                                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                📱 {result.metadata_guion.plataforma}
                                            </span>
                                        )}
                                        
                                        {/* 🔥 NUEVO: Mostrar objetivo viral */}
                                        {result.metadata_guion?.objetivo_viral && (
                                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                                🎯 {result.metadata_guion.objetivo_viral}
                                            </span>
                                        )}
                                        
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded bg-gray-900">
                                            {result.metadata_guion?.estructura_usada || result.metadata_guion?.arquitectura || selectedStructure}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-white leading-tight max-w-lg">
                                        {result.metadata_guion?.tema_tratado || topic}
                                    </h2>
                                    
                                    {/* 🔥 NUEVO: Mostrar percepción del creador */}
                                    {result.metadata_guion?.percepcion_creador && (
                                        <p className="text-xs text-indigo-400 mt-2 italic">
                                            💡 Percepción: "{result.metadata_guion.percepcion_creador}"
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex gap-2 flex-wrap justify-end">
                                    <button 
                                        onClick={() => setIsScheduleModalOpen(true)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
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

                            {saveSuccess && (
                                <div className="mb-4 bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-green-400 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 size={14}/> 
                                    Guardado en biblioteca correctamente
                                </div>
                            )}

                            {/* 🔥 NUEVO: ANÁLISIS VIRAL V500 */}
                            {result.analisis_viral && (
                                <div className="mb-6 bg-purple-900/10 border border-purple-500/20 rounded-2xl p-5">
                                    <h3 className="text-sm font-black text-purple-400 mb-3 flex items-center gap-2">
                                        <TrendingUp size={16}/> Análisis Viral V500
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        {/* Score Viral */}
                                        {result.analisis_viral.score_viralidad_predicho && (
                                            <div className="bg-black/30 p-3 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-400 uppercase tracking-wide text-[10px] font-bold">Score Viral</span>
                                                    <span className="text-2xl font-black text-purple-400">
                                                        {result.analisis_viral.score_viralidad_predicho}
                                                        <span className="text-sm text-gray-500">/100</span>
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-800 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${result.analisis_viral.score_viralidad_predicho}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Loops Detectados */}
                                        <div className="bg-black/30 p-3 rounded-xl">
                                            <span className="text-gray-400 uppercase tracking-wide text-[10px] font-bold block mb-2">Loops Detectados</span>
                                            <div className="flex gap-2 items-center">
                                                <div className="flex items-center gap-1">
                                                    <Eye size={12} className="text-green-400"/>
                                                    <span className="text-green-400 font-bold">{result.analisis_viral.loops_abiertos?.length || 0}</span>
                                                    <span className="text-gray-500 text-[10px]">Abiertos</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 size={12} className="text-blue-400"/>
                                                    <span className="text-blue-400 font-bold">{result.analisis_viral.loops_cerrados?.length || 0}</span>
                                                    <span className="text-gray-500 text-[10px]">Cerrados</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Frases de Autoridad */}
                                    {result.analisis_viral.frases_autoridad && result.analisis_viral.frases_autoridad.length > 0 && (
                                        <div className="mt-4">
                                            <span className="text-[10px] font-bold text-yellow-400 uppercase block mb-2">
                                                👑 Frases de Autoridad Detectadas
                                            </span>
                                            <ul className="space-y-1">
                                                {result.analisis_viral.frases_autoridad.slice(0, 3).map((frase, i) => (
                                                    <li key={i} className="text-[11px] text-gray-300 flex items-start gap-2">
                                                        <Award size={10} className="text-yellow-400 mt-0.5 shrink-0"/> 
                                                        {frase}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {/* Trigger de Comentarios */}
                                    {result.analisis_viral.trigger_comentarios && (
                                        <div className="mt-4 bg-pink-500/10 border border-pink-500/20 p-3 rounded-xl">
                                            <span className="text-[10px] font-bold text-pink-400 uppercase block mb-1">
                                                <MessageCircle size={10} className="inline"/> Trigger de Comentarios
                                            </span>
                                            <p className="text-xs text-gray-300 italic">
                                                "{result.analisis_viral.trigger_comentarios}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 🔥 NUEVO: AUTO-VALIDACIÓN */}
                            {result.auto_validacion && (
                                <div className={`mb-6 border rounded-2xl p-4 ${
                                    result.auto_validacion.decision === 'APROBAR' 
                                        ? 'bg-green-900/10 border-green-500/20' 
                                        : 'bg-red-900/10 border-red-500/20'
                                }`}>
                                    <h3 className={`text-sm font-black mb-3 flex items-center gap-2 ${
                                        result.auto_validacion.decision === 'APROBAR' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {result.auto_validacion.decision === 'APROBAR' ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                                        Auto-Validación: {result.auto_validacion.decision}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                                        <div className={`p-2 rounded-lg ${result.auto_validacion.hace_sentir_inspirado ? 'bg-green-500/10' : 'bg-gray-800'}`}>
                                            <span className={result.auto_validacion.hace_sentir_inspirado ? 'text-green-400' : 'text-gray-500'}>
                                                {result.auto_validacion.hace_sentir_inspirado ? '✅' : '❌'} Inspirador
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-lg ${result.auto_validacion.suena_distinto ? 'bg-green-500/10' : 'bg-gray-800'}`}>
                                            <span className={result.auto_validacion.suena_distinto ? 'text-green-400' : 'text-gray-500'}>
                                                {result.auto_validacion.suena_distinto ? '✅' : '❌'} Único
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-lg ${result.auto_validacion.podria_molestar ? 'bg-green-500/10' : 'bg-gray-800'}`}>
                                            <span className={result.auto_validacion.podria_molestar ? 'text-green-400' : 'text-gray-500'}>
                                                {result.auto_validacion.podria_molestar ? '✅' : '❌'} Polémico
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-lg ${result.auto_validacion.sera_recordado ? 'bg-green-500/10' : 'bg-gray-800'}`}>
                                            <span className={result.auto_validacion.sera_recordado ? 'text-green-400' : 'text-gray-500'}>
                                                {result.auto_validacion.sera_recordado ? '✅' : '❌'} Memorable
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {result.auto_validacion.razon && (
                                        <p className="text-xs text-gray-400 mt-3 italic">
                                            💭 {result.auto_validacion.razon}
                                        </p>
                                    )}
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
                                            <p className="text-sm text-gray-300 italic group-hover:text-white transition-colors mb-2">
                                                "{hook.texto}"
                                            </p>
                                            {/* 🔥 NUEVO: Mostrar mecanismo */}
                                            {hook.mecanismo && (
                                                <span className="text-[9px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                                                    Mecánica: {hook.mecanismo}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* GUION COMPLETO */}
                            <div className="flex-1 space-y-3 mb-8">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <AlignLeft size={14}/> Modo Teleprompter
                                </label>
                                <div className="bg-black/60 p-8 rounded-2xl border border-gray-800 text-gray-200 text-lg leading-relaxed font-medium whitespace-pre-wrap shadow-inner max-h-[600px] overflow-y-auto font-mono selection:bg-pink-500 selection:text-white">
                                    {result.guion_completo}
                                </div>
                            </div>

                            {/* AUDITORÍA */}
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

                            {/* PLAN VISUAL */}
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
                                                        {scene.texto_pantalla && (
                                                            <span className="text-[10px] text-yellow-400 uppercase tracking-wide">
                                                                📝 {scene.texto_pantalla}
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
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-gray-900/20 min-h-[600px]">
                            <div className="p-6 bg-gray-900 rounded-full mb-6 shadow-xl">
                                <Wand2 size={48} className="text-gray-600"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Lienzo Creativo Vacío
                            </h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                                Configura la psicología y estructura a la izquierda para que el Motor V500 Élite codifique tu próximo viral.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DE AGENDAR */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                        <button 
                            onClick={() => setIsScheduleModalOpen(false)} 
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={18}/>
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500 border border-indigo-500/30">
                                <CalendarIcon size={24}/>
                            </div>
                            <h3 className="text-lg font-black text-white">Agendar Publicación</h3>
                            <p className="text-xs text-gray-400 mt-1">Elige cuándo quieres publicar este guion.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Fecha de Publicación</label>
                                <input 
                                    type="date" 
                                    value={scheduleDate} 
                                    onChange={(e) => setScheduleDate(e.target.value)} 
                                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            
                            <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Resumen del Guion</span>
                                <p className="text-xs text-gray-300 line-clamp-2 italic">"{topic}"</p>
                            </div>

                            <button 
                                onClick={handleConfirmSchedule}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all shadow-lg shadow-indigo-900/20 hover:scale-[1.02]"
                            >
                                Confirmar y Agendar <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};