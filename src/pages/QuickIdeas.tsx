import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Video, Instagram, Youtube, Linkedin, Facebook, 
    Lightbulb, RefreshCw, Rocket, Copy, ArrowRight, 
    Wallet, User, Users, BookOpen, AlertCircle, Save, CheckCircle2,
    TrendingUp, Zap, Star, Crown, Target, Brain, Flame, Award,
    Clock, Calendar, Shield, MessageSquare,
    Wand2 // 👈 ESTE ES EL NUEVO QUE NECESITAS
} from 'lucide-react';

// ==================================================================================
// 🎯 CONFIGURACIÓN ESTRATÉGICA
// ==================================================================================

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20', border: 'border-cyan-500/50' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
    { id: 'Facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-900/20', border: 'border-blue-600/50' }
];

// ✅ OBJETIVOS DE CONTENIDO (LA VARIABLE MÁS IMPORTANTE)
const CONTENT_OBJECTIVES = [
    { 
        id: 'viralidad', 
        label: 'Viralidad', 
        icon: Flame,
        color: 'text-orange-400',
        description: 'Maximizar alcance y shares',
        strategy: 'Ideas diseñadas para explotar algoritmos y generar engagement masivo'
    },
    { 
        id: 'autoridad', 
        label: 'Autoridad', 
        icon: Award,
        color: 'text-purple-400',
        description: 'Posicionarte como experto referente',
        strategy: 'Contenido profundo que demuestra expertise y genera credibilidad'
    },
    { 
        id: 'venta', 
        label: 'Venta Directa', 
        icon: Target,
        color: 'text-green-400',
        description: 'Convertir a compradores inmediatos',
        strategy: 'Ideas que despiertan deseo y urgencia de compra'
    },
    { 
        id: 'comunidad', 
        label: 'Comunidad', 
        icon: Users,
        color: 'text-blue-400',
        description: 'Crear tribu leal y engagement',
        strategy: 'Contenido que genera conversación y sentido de pertenencia'
    },
    { 
        id: 'posicionamiento', 
        label: 'Marca Personal', 
        icon: Crown,
        color: 'text-yellow-400',
        description: 'Construir marca única y memorable',
        strategy: 'Ideas que refuerzan tu diferenciación y valores únicos'
    },
    { 
        id: 'educacion', 
        label: 'Educación', 
        icon: BookOpen,
        color: 'text-indigo-400',
        description: 'Enseñar y transformar',
        strategy: 'Contenido tutorial que genera valor tangible'
    },
    { 
        id: 'opinion', 
        label: 'Opinión / Polarización', 
        icon: MessageSquare,
        color: 'text-red-400',
        description: 'Generar debate y posición clara',
        strategy: 'Ideas controversiales que te diferencian y atraen seguidores ideológicos'
    }
];

// ✅ CONTEXTO TEMPORAL (ACELERADOR DE VIRALIDAD)
const TIMING_CONTEXTS = [
    { id: 'evergreen', label: '🌲 Evergreen', description: 'Funciona siempre, sin fecha de caducidad' },
    { id: 'tendencia', label: '🔥 Tendencia Actual', description: 'Aprovecha momentum de tendencias populares' },
    { id: 'reaccion', label: '⚡ Reacción Rápida', description: 'Responde a eventos/noticias recientes' },
    { id: 'estacional', label: '📅 Estacional', description: 'Aprovecha temporadas/fechas específicas' },
    { id: 'momentum', label: '🚀 Momentum Personal', description: 'Capitaliza tu momento actual de crecimiento' }
];

// 2. PEGAR ESTA CONSTANTE NUEVA (CON EL NOMBRE CAMBIADO)
const CREATIVE_LENSES = [
    { id: 'auto', label: '🎲 IA Automática', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/50' },
    { id: 'contrarian', label: '⚡ El Disruptor', icon: Flame, color: 'text-red-500', bg: 'bg-red-900/20', border: 'border-red-500/50' }, // <--- NOMBRE CAMBIADO
    { id: 'scientific', label: '🧪 Científico', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/50' },
    { id: 'confessional', label: '🙏 Vulnerable', icon: User, color: 'text-pink-400', bg: 'bg-pink-900/20', border: 'border-pink-500/50' },
    { id: 'warrior', label: '⚔️ Comandante', icon: Target, color: 'text-orange-500', bg: 'bg-orange-900/20', border: 'border-orange-500/50' },
];

// ✅ INTERFAZ MEJORADA CON TODOS LOS CAMPOS
interface IdeaItem {
    id: number;
    titulo: string;
    concepto: string;
    idea_expandida_tca?: string;

    // TCA Imperio
    tca?: {
        nivel_tca?: string;
        sector_utilizado?: string;
        interseccion_detectada?: string;
        mass_appeal_score?: number;
        breakdown_score?: {
            interes_universal?: number;
            tension_activada?: number;
            sin_requisito_tecnico?: number;
            potencial_debate?: number;
            senal_afinidad?: number;
        };
        potencial_millonario?: boolean;
        nivel_polarizacion?: number;
        razonamiento_estrategico?: string;
    };

    // Estrategia
    formato_ganador?: string;
    tensiones_activadas?: string[];
    objetivo_principal: string;
    objetivo_secundario?: string;
    contexto_temporal: string;
    estructura_sugerida: string;

    // Psicología
    disparador_principal: string;
    emocion_objetivo: string;
    sesgo_cognitivo?: string;

    // Ejecución
    gancho_sugerido: string;
    potencial_viral: number;
    razon_potencia: string;
    formato_visual: string;
    angulo: string;
    cta_sugerido: string;

    // Metadata
    plataforma_ideal: string;
    duracion_recomendada: string;
    dificultad_produccion: string;
    keywords: string[];

    // Timing
    mejor_momento?: string;
    urgencia_publicacion?: 'baja' | 'media' | 'alta';

    // Dominación Global
    frame_usado?: string;
    angulo_estrategico?: string;
    postura_dominante?: {
        creencia_atacada?: string;
        enemigo_implicito?: string;
        nuevo_marco_mental?: string;
        solo_este_experto_puede_decirlo?: boolean;
    };
    riesgo_emocional_activado?: string;
    originalidad_score?: number;
    diferenciacion_score?: number;
    validacion_guru?: {
        eleva_autoridad?: boolean;
        posiciona_como_lider?: boolean;
        rompe_consenso?: boolean;
        potencial_viral_real?: boolean;
        suena_diferente_al_mercado?: boolean;
    };
}

interface ResponseData {
    ideas: IdeaItem[];
    analisis_estrategico: {
        objetivo_dominante: string;
        lente_aplicado?: string;
        sector_detectado?: string;
        nivel_tca_original?: string;
        expansion_realizada?: string;
        razonamiento: string;
        advertencias: string[];
        oportunidades: string[];
    };
    mejor_idea_recomendada?: {
        idea_id: number;
        razon: string;
        por_que_ahora: string;
        plan_rapido: string;
        conexion_con_generador?: string;
    };
    recomendacion_top: {
        idea_id: number;
        razon: string;
        plan_rapido: string;
        por_que_ahora: string;
    };
    estrategia_embudo?: string;
    insights_estrategicos: {
        tendencia_detectada?: string;
        brecha_mercado?: string;
        advertencia?: string;
        siguiente_paso_logico?: string;
    };
}

export const QuickIdeas = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS UI ---
    const [topic, setTopic] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
    const [amount, setAmount] = useState(3);

    // ✅ AÑADE ESTA LÍNEA AQUÍ:
    const [nicho, setNicho] = useState('');
    
    // ✅ NUEVOS ESTADOS ESTRATÉGICOS
    const [selectedObjective, setSelectedObjective] = useState(CONTENT_OBJECTIVES[0]);
    const [selectedTiming, setSelectedTiming] = useState(TIMING_CONTEXTS[0]);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    
    // 👇👇👇 AGREGAR ESTA LÍNEA 👇👇👇
    const [selectedLens, setSelectedLens] = useState(CREATIVE_LENSES[0]);
    const [isMultiplatform, setIsMultiplatform] = useState(false);

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
    const [responseData, setResponseData] = useState<ResponseData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [multiProgress, setMultiProgress] = useState<{current: number; total: number} | null>(null);

    // 🔥 CÁLCULO DE COSTO — Multiplataforma tiene precio mayor
    const currentCost = isMultiplatform
        ? (amount === 15 ? 25 : amount === 10 ? 18 : 10)  // Multi: 3=10cr, 10=18cr, 15=25cr
        : (amount === 10 ? 7 : 3);                          // Individual: 3/5=3cr, 10=7cr
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

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        };
        fetchProfiles();
    }, [user, userProfile]);

    // ==================================================================================
    // 🧠 FUNCIÓN GENERAR MEJORADA (CEREBRO ESTRATÉGICO)
    // ==================================================================================
    const handleGenerate = async () => {
        if (!topic.trim()) return setError("Escribe un tema primero.");
        setError(null);

        // 1. Validar Saldo
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < currentCost) {
            if(confirm(`⚠️ Saldo insuficiente (${userProfile?.credits} cr). Necesitas ${currentCost}. ¿Recargar?`)) navigate('/dashboard/settings');
            return;
        }

        setIsGenerating(true);
        setIdeas([]);
        setResponseData(null);
        if (isMultiplatform) {
            setMultiProgress({ current: 0, total: amount });
        }

        try {
            // ✅ BODY ESTRATÉGICO MEJORADO
            const { data, error: apiError } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'ideas_rapidas',
                    topic: topic,
                    userInput: topic,
                    
                    // 🎯 NUEVOS PARÁMETROS ESTRATÉGICOS
                    settings: {
                        quantity: amount,
                        platform: isMultiplatform ? 'Multiplataforma' : selectedPlatform.label,
                        objective: selectedObjective.id,
                        multiplatform: isMultiplatform,
                        
                        // 👇👇👇 AGREGAR ESTA LÍNEA 👇👇👇
                        creative_lens: selectedLens.id, 
                        // 👆👆👆 ESTO CONECTA CON EL BACKEND V500

                        // 🔥 AÑADE ESTO AQUÍ:
                    nicho: nicho,
                        
                        timing_context: selectedTiming.id,
                        objective_strategy: selectedObjective.strategy,
                        objective_description: selectedObjective.description
                    },
                    
                    // Contexto del sistema
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: currentCost
                },
            });

            if (apiError) throw apiError;
            if (!data?.generatedData?.ideas) throw new Error("No se recibieron ideas válidas.");

            setResponseData(data.generatedData);
            setIdeas(data.generatedData.ideas);
            setMultiProgress(null);
            
            if(refreshProfile) refreshProfile();

        } catch (e: any) {
            console.error("Error:", e);
            setError(e.message || "Error al generar ideas.");
        } finally {
            setIsGenerating(false);
            setMultiProgress(null);
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
                content: idea,
                status: 'draft',
                platform: selectedPlatform.label
            });
            setTimeout(() => setSavingId(null), 1000);
        } catch (e) {
            alert("Error al guardar");
            setSavingId(null);
        }
    };

    // --- ENVIAR AL GENERADOR DE GUIONES ---
   const handleGoToEditor = (idea: IdeaItem) => {
        navigate('/dashboard/script-generator', {
            state: {
                // Usar idea_expandida_tca si existe — V600 no reexpande TCA
                topic: idea.idea_expandida_tca || idea.titulo,
                hook: idea.gancho_sugerido || idea.concepto,
                platform: selectedPlatform.label,
                objective: idea.objetivo_principal,
                structure: idea.estructura_sugerida,
                fromIdeas: true,
                tca_preexpandido: !!idea.idea_expandida_tca,
                mass_appeal_score: idea.tca?.mass_appeal_score || 0
            }
        });
    };

    // ✅ FUNCIÓN HELPER: COLOR DEL SCORE
    const getScoreColor = (score?: number) => {
        if (!score) return 'text-gray-500';
        if (score >= 9) return 'text-green-400';
        if (score >= 7) return 'text-yellow-400';
        if (score >= 5) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreLabel = (score?: number) => {
        if (!score) return 'N/A';
        if (score >= 9) return 'VIRAL';
        if (score >= 7) return 'ALTO';
        if (score >= 5) return 'MEDIO';
        return 'BAJO';
    };

    const getUrgencyColor = (urgency?: string) => {
        if (urgency === 'alta') return 'text-red-400 bg-red-900/20 border-red-500/30';
        if (urgency === 'media') return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
        return 'text-green-400 bg-green-900/20 border-green-500/30';
    };

    const getUrgencyLabel = (urgency?: string) => {
        if (urgency === 'alta') return '🔥 Publicar HOY';
        if (urgency === 'media') return '⏰ Esta Semana';
        return '🌲 Sin Prisa';
    };

    // ==================================================================================
    // 🎨 RENDERIZADO
    // ==================================================================================
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* HEADER */}
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                    <Brain className="text-indigo-400" size={36} />
                    <h1 className="text-4xl font-black">Cerebro Estratégico de Contenido</h1>
                </div>
                <p className="text-gray-400 font-medium text-lg">
                    No genero ideas bonitas. Decido qué publicar <span className="text-indigo-400 font-bold">AHORA</span> según tu objetivo.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield size={14}/>
                    <span>Basado en Perfil de Experto + Avatar + Base de Conocimientos</span>
                </div>
            </div>

            {/* FORMULARIO PRINCIPAL */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                {/* 1. PLATAFORMA */}
                <div>
                    <label className="text-xs font-black text-gray-500 uppercase mb-4 block tracking-widest flex items-center gap-2">
                        <Video size={14}/> 1. Selecciona la Plataforma
                    </label>

                    {/* BOTÓN MULTIPLATAFORMA */}
                    <button
                        onClick={() => setIsMultiplatform(!isMultiplatform)}
                        className={`w-full mb-3 p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                            isMultiplatform
                                ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border-purple-500/60 text-white shadow-lg ring-1 ring-purple-500/30 scale-[1.01]'
                                : 'bg-gray-900/30 border-gray-700 text-gray-400 hover:border-purple-500/40 hover:text-gray-200'
                        }`}
                    >
                        <span className="text-lg">🌐</span>
                        <div className="text-left">
                            <p className="text-sm font-black">
                                {isMultiplatform ? '✅ MODO MULTIPLATAFORMA ACTIVO' : 'MODO MULTIPLATAFORMA'}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                1 idea central → 5 hooks distintos → domina TikTok + Reels + YouTube + LinkedIn + Facebook
                            </p>
                        </div>
                        {isMultiplatform && (
                            <span className="ml-auto text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                                ACTIVO
                            </span>
                        )}
                    </button>

                    {/* PLATAFORMAS INDIVIDUALES */}
                    <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 transition-all ${isMultiplatform ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                        {PLATFORMS.map(p => (
                            <button 
                                key={p.id} 
                                onClick={() => setSelectedPlatform(p)} 
                                className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                                    selectedPlatform.id === p.id 
                                        ? `${p.bg} ${p.border} text-white shadow-lg ring-1 ring-white/10 scale-105` 
                                        : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            >
                                <p.icon size={24} className={selectedPlatform.id === p.id ? '' : 'grayscale opacity-50'} />
                                <span className="text-xs font-bold">{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

               {/* 2. OBJETIVO (ESTRATEGIA) */}
                <div>
                    <label className="text-xs font-black text-indigo-400 uppercase mb-4 block tracking-widest flex items-center gap-2">
                        <Target size={14}/> 2. ¿Cuál es tu OBJETIVO? (Esto define TODO)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CONTENT_OBJECTIVES.map(obj => (
                            <button
                                key={obj.id}
                                onClick={() => setSelectedObjective(obj)}
                                className={`p-4 rounded-xl border transition-all group ${
                                    selectedObjective.id === obj.id
                                        ? 'bg-indigo-900/20 border-indigo-500/50 text-white shadow-lg ring-1 ring-indigo-500/20'
                                        : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <obj.icon size={20} className={selectedObjective.id === obj.id ? obj.color : 'grayscale opacity-50'}/>
                                    <span className="text-xs font-bold">{obj.label}</span>
                                    {selectedObjective.id === obj.id && (
                                        <p className="text-[10px] text-gray-400 leading-tight mt-1">
                                            {obj.description}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    {/* Explicación del Objetivo */}
                    <div className="mt-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
                        <p className="text-xs text-indigo-300 leading-relaxed">
                            <span className="font-bold">Estrategia:</span> {selectedObjective.strategy}
                        </p>
                    </div>
                </div>

                {/* 🎲 2.5 FACTOR X (LENTE CREATIVO) */}
                <div>
                    <label className="text-xs font-black text-pink-500 uppercase mb-4 block tracking-widest flex items-center gap-2">
                        <Wand2 size={14}/> 2.5 Factor X (El Tono de la Idea)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {CREATIVE_LENSES.map(lens => (
                            <button
                                key={lens.id}
                                onClick={() => setSelectedLens(lens)}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                    selectedLens.id === lens.id
                                        ? `${lens.bg} ${lens.border} text-white shadow-lg ring-1 ring-white/10 scale-105`
                                        : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                                }`}
                            >
                                <lens.icon size={20} className={selectedLens.id === lens.id ? lens.color : 'opacity-50'} />
                                <span className="text-[10px] font-bold uppercase text-center">{lens.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🎯 2.8 NICHO / MERCADO (NUEVO PASO) */}
                <div>
                    <label className="text-xs font-black text-amber-500 uppercase mb-4 block tracking-widest flex items-center gap-2">
                        <Users size={14}/> 2.8 Define tu Nicho / Mercado
                    </label>
                    <input
                        type="text"
                        value={nicho} 
                        onChange={(e) => setNicho(e.target.value)}
                        placeholder="Ej: Fitness para mamás, Real Estate, Trading, Dueños de agencias..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500 transition-all font-medium placeholder-gray-600 focus:ring-1 focus:ring-amber-500/20"
                    />
                    <p className="text-[10px] text-gray-500 mt-2 ml-1">
                        Especificar el nicho ayuda a la IA a generar ángulos mucho más precisos.
                    </p>
                </div>

                 {/* 3. TEMA Y CANTIDAD */}
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">
                            3. ¿Sobre qué tema?
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="Ej: Errores al invertir en cripto, Rutina para abdomen..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium placeholder-gray-600 focus:ring-1 focus:ring-indigo-500/20"
                        />
                    </div>
                    
                    <div className="w-full md:w-auto">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest">Cantidad</label>
                        <select
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white outline-none min-w-[180px] cursor-pointer font-bold focus:border-indigo-500 transition-all"
                        >
                            {isMultiplatform ? (
                                <>
                                    <option value={3}>3 Ideas × 5 plataformas (10 Créditos)</option>
                                    <option value={10}>10 Ideas × 5 plataformas (18 Créditos)</option>
                                    <option value={15}>15 Ideas × 5 plataformas (25 Créditos)</option>
                                </>
                            ) : (
                                <>
                                    <option value={3}>3 Ideas (3 Créditos)</option>
                                    <option value={5}>5 Ideas (3 Créditos)</option>
                                    <option value={10}>10 Ideas (7 Créditos)</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* 4. OPCIONES AVANZADAS (COLAPSABLE) */}
                <div className="pt-6 border-t border-gray-800/50">
                    <button
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors mb-4"
                    >
                        <Zap size={14}/>
                        Opciones Avanzadas (Contexto + Timing)
                        <span className="text-indigo-400">{showAdvancedOptions ? '▼' : '▶'}</span>
                    </button>
                    
                    {showAdvancedOptions && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            {/* Contexto Temporal */}
                            <div>
                                <label className="text-xs font-black text-gray-500 uppercase mb-3 block tracking-widest flex items-center gap-2">
                                    <Clock size={12}/> Contexto Temporal
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {TIMING_CONTEXTS.map(timing => (
                                        <button
                                            key={timing.id}
                                            onClick={() => setSelectedTiming(timing)}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                selectedTiming.id === timing.id
                                                    ? 'bg-yellow-900/20 border-yellow-500/50 text-white'
                                                    : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                                            }`}
                                        >
                                            <div className="text-xs font-bold mb-1">{timing.label}</div>
                                            {selectedTiming.id === timing.id && (
                                                <div className="text-[10px] text-gray-400">{timing.description}</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contexto del Sistema */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Contexto del Sistema</label>
                                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/20">
                                        IA Conectada
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                                            <User size={14}/>
                                        </div>
                                        <select 
                                            value={selectedExpertId} 
                                            onChange={(e) => setSelectedExpertId(e.target.value)} 
                                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-indigo-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800"
                                        >
                                            <option value="">-- Experto General --</option>
                                            {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </select>
                                    </div>
                                    
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none">
                                            <Users size={14}/>
                                        </div>
                                        <select 
                                            value={selectedAvatarId} 
                                            onChange={(e) => setSelectedAvatarId(e.target.value)} 
                                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-pink-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800"
                                        >
                                            <option value="">-- Avatar General --</option>
                                            {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none">
                                            <BookOpen size={14}/>
                                        </div>
                                        <select 
                                            value={selectedKbId} 
                                            onChange={(e) => setSelectedKbId(e.target.value)} 
                                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 pl-9 focus:border-yellow-500 outline-none appearance-none font-bold cursor-pointer transition-all hover:bg-gray-800"
                                        >
                                            <option value="">-- Sin Base de Conocimiento --</option>
                                            {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTÓN GENERAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-800">
                    <button
                        onClick={handleGenerate}
                        disabled={!topic.trim() || isGenerating}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-indigo-900/20 transition-all active:scale-95 shadow-lg flex-1 group"
                    >
                        {isGenerating ? (
                            isMultiplatform && multiProgress ? (
                                <div className="flex flex-col items-center gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="animate-spin" size={16}/>
                                        <span>Generando idea {multiProgress.current + 1} de {multiProgress.total}...</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                                        <div 
                                            className="bg-white rounded-full h-1.5 transition-all duration-500"
                                            style={{ width: `${((multiProgress.current) / multiProgress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <><RefreshCw className="animate-spin" size={20}/> Analizando Estrategia...</>
                            )
                        ) : (
                            <><Brain size={20} className="group-hover:animate-pulse" /> GENERAR IDEAS ESTRATÉGICAS</>
                        )}
                    </button>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800">
                        <Wallet size={14} className="text-indigo-500"/>
                        <span className="text-xs font-bold text-gray-400">Costo: <span className="text-white">{currentCost} créditos</span></span>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                        <AlertCircle size={14}/> {error}
                    </div>
                )}
            </div>

            {/* ✅ ANÁLISIS ESTRATÉGICO */}
            {responseData?.analisis_estrategico && (
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Brain size={24} className="text-indigo-400"/>
                        <div>
                            <h3 className="text-lg font-black text-indigo-400 uppercase tracking-wider">Análisis Estratégico</h3>
                            <p className="text-xs text-gray-400">Por qué estas ideas para este objetivo</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-indigo-500/20">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Objetivo Dominante</p>
                            <p className="text-sm text-white font-bold">{responseData.analisis_estrategico.objetivo_dominante}</p>
                        </div>

                        {/* TCA — Expansión realizada */}
                        {responseData.analisis_estrategico.sector_detectado && (
                            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
                                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                                    🌍 Expansión TCA Aplicada
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500">
                                        Nivel original: <span className="text-red-400 font-bold">{responseData.analisis_estrategico.nivel_tca_original}</span>
                                    </span>
                                    <span className="text-yellow-500">→</span>
                                    <span className="text-xs text-gray-500">
                                        Sector: <span className="text-yellow-400 font-bold">{responseData.analisis_estrategico.sector_detectado}</span>
                                    </span>
                                </div>
                                {responseData.analisis_estrategico.expansion_realizada && (
                                    <p className="text-xs text-yellow-200/70 italic leading-relaxed">
                                        "{responseData.analisis_estrategico.expansion_realizada}"
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="bg-black/30 rounded-xl p-4 border border-indigo-500/20">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Razonamiento</p>
                            <p className="text-xs text-gray-300 leading-relaxed">{responseData.analisis_estrategico.razonamiento}</p>
                        </div>

                        {responseData.analisis_estrategico.oportunidades && responseData.analisis_estrategico.oportunidades.length > 0 && (
                            <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                                <p className="text-[10px] font-black text-green-400 uppercase mb-2">🎯 Oportunidades</p>
                                <ul className="space-y-1">
                                    {responseData.analisis_estrategico.oportunidades.map((opp, i) => (
                                        <li key={i} className="text-xs text-green-200 flex items-start gap-2">
                                            <span className="text-green-500">•</span>
                                            <span>{opp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {responseData.analisis_estrategico.advertencias && responseData.analisis_estrategico.advertencias.length > 0 && (
                            <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
                                <p className="text-[10px] font-black text-yellow-400 uppercase mb-2">⚠️ Advertencias</p>
                                <ul className="space-y-1">
                                    {responseData.analisis_estrategico.advertencias.map((adv, i) => (
                                        <li key={i} className="text-xs text-yellow-200 flex items-start gap-2">
                                            <span className="text-yellow-500">•</span>
                                            <span>{adv}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ RECOMENDACIÓN TOP */}
            {responseData?.recomendacion_top && (
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/50 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <Crown size={120} className="text-yellow-500"/>
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                                <Star size={24} className="text-yellow-400"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-yellow-400 uppercase tracking-wider">Recomendación TOP</h3>
                                <p className="text-xs text-gray-400 font-medium">La idea con mayor potencial estratégico AHORA</p>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-2xl p-5 border border-yellow-500/20">
                            <p className="text-sm text-white font-bold mb-3 leading-relaxed">
                                💡 <span className="text-yellow-400">Idea #{responseData.recomendacion_top.idea_id}:</span> {ideas.find(i => i.id === responseData.recomendacion_top?.idea_id)?.titulo}
                            </p>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                        <span className="font-bold text-yellow-400">¿Por qué esta?</span> {responseData.recomendacion_top.razon}
                                    </p>
                                </div>

                                <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl p-3">
                                    <p className="text-[10px] font-black text-orange-400 uppercase mb-2">⏰ ¿Por qué AHORA?</p>
                                    <p className="text-xs text-orange-200">{responseData.recomendacion_top.por_que_ahora}</p>
                                </div>

                                {responseData.recomendacion_top.plan_rapido && (
                                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                        <p className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Plan de Ejecución Rápida</p>
                                        <p className="text-xs text-gray-300 whitespace-pre-line">{responseData.recomendacion_top.plan_rapido}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const topIdea = ideas.find(i => i.id === responseData.recomendacion_top?.idea_id);
                                if (topIdea) handleGoToEditor(topIdea);
                            }}
                            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Zap size={18}/> CREAR GUION DE ESTA IDEA
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ INSIGHTS ESTRATÉGICOS */}
            {responseData?.insights_estrategicos && (
                <div className="bg-[#0B0E14] border border-purple-500/30 rounded-3xl p-6 space-y-4">
                    <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp size={18}/> Insights del Mercado
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {responseData.insights_estrategicos.tendencia_detectada && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">📈 Tendencia Detectada</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.tendencia_detectada}</p>
                            </div>
                        )}
                        
                        {responseData.insights_estrategicos.brecha_mercado && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">🎯 Brecha de Mercado</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.brecha_mercado}</p>
                            </div>
                        )}
                        
                        {responseData.insights_estrategicos.advertencia && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">⚠️ Evitar</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.advertencia}</p>
                            </div>
                        )}

                        {responseData.insights_estrategicos.siguiente_paso_logico && (
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                                <p className="text-[10px] font-black text-gray-500 uppercase mb-2">➡️ Siguiente Paso</p>
                                <p className="text-xs text-gray-300">{responseData.insights_estrategicos.siguiente_paso_logico}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- RESULTADOS (MEJORADO CON NUEVOS CAMPOS) --- */}
            {ideas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
                    {ideas.map((idea, idx) => {
                        const isTopIdea = idea.id === responseData?.recomendacion_top?.idea_id;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`bg-[#0B0E14] border ${isTopIdea ? 'border-yellow-500/70 ring-2 ring-yellow-500/20' : 'border-gray-800'} rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-300 group flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-indigo-900/10 shadow-lg relative overflow-hidden`}
                            >
                                {isTopIdea && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-black text-[9px] font-black rounded-full uppercase flex items-center gap-1 z-10">
                                        <Crown size={10}/> TOP
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="space-y-5 relative z-10">
                                    {/* Header con Objetivo y Timing */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-black bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
                                                {idea.objetivo_principal}
                                            </span>
                                            {idea.contexto_temporal && (
                                                <span className="text-[9px] font-bold bg-gray-800/80 text-gray-400 px-2 py-0.5 rounded-full">
                                                    {TIMING_CONTEXTS.find(t => t.id === idea.contexto_temporal)?.label || idea.contexto_temporal}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`p-2 rounded-xl ${selectedPlatform.bg} border border-white/5`}>
                                            <selectedPlatform.icon size={18} className={selectedPlatform.color}/>
                                        </div>
                                    </div>
                                    
                                    {/* Título y Concepto */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                            "{idea.titulo}"
                                        </h3>
                                        <p className="text-xs text-gray-400 leading-relaxed font-medium mb-3">
                                            {idea.concepto}
                                        </p>

                                        {/* Gancho Sugerido */}
                                        {idea.gancho_sugerido && (
                                            <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 mb-3">
                                                <p className="text-[9px] font-black text-gray-500 uppercase mb-1">🎬 Gancho</p>
                                                <p className="text-[11px] text-indigo-300 font-medium italic leading-relaxed">
                                                    "{idea.gancho_sugerido}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* TCA IMPERIO — Score de Alcance */}
                                    {idea.tca && (
                                        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/10 border border-yellow-500/30 rounded-xl p-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                                                    🌍 Alcance Imperio
                                                </span>
                                                {idea.tca.potencial_millonario && (
                                                    <span className="text-[9px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                                                        🚀 +1M POTENCIAL
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400">Mass Appeal Score</span>
                                                <span className={`text-sm font-black ${
                                                    (idea.tca.mass_appeal_score || 0) >= 85 ? 'text-green-400' :
                                                    (idea.tca.mass_appeal_score || 0) >= 70 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {idea.tca.mass_appeal_score}/100
                                                </span>
                                            </div>

                                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        (idea.tca.mass_appeal_score || 0) >= 85 ? 'bg-green-500' :
                                                        (idea.tca.mass_appeal_score || 0) >= 70 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}
                                                    style={{ width: `${idea.tca.mass_appeal_score || 0}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] text-gray-500">
                                                    {idea.tca.nivel_tca} · {idea.tca.sector_utilizado}
                                                </span>
                                                {idea.tca.nivel_polarizacion && (
                                                    <span className="text-[9px] text-orange-400 font-bold">
                                                        ⚡ Polarización: {idea.tca.nivel_polarizacion}/100
                                                    </span>
                                                )}
                                            </div>

                                            {idea.tca.interseccion_detectada && (
                                                <p className="text-[9px] text-yellow-200/70 italic leading-relaxed">
                                                    "{idea.tca.interseccion_detectada}"
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Formato Ganador */}
                                    {idea.formato_ganador && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-gray-600 uppercase">Formato:</span>
                                            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                                {idea.formato_ganador.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Score Viral + Emoción + Estructura */}
                                    <div className="space-y-3">
                                        {/* Score Viral */}
                                        {idea.potencial_viral && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black text-gray-500 uppercase">Potencial Viral</span>
                                                    <span className={`text-xs font-black ${getScoreColor(idea.potencial_viral)}`}>
                                                        {idea.potencial_viral}/10 · {getScoreLabel(idea.potencial_viral)}
                                                    </span>
                                                </div>
                                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            idea.potencial_viral >= 9 ? 'bg-green-500' :
                                                            idea.potencial_viral >= 7 ? 'bg-yellow-500' :
                                                            idea.potencial_viral >= 5 ? 'bg-orange-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${(idea.potencial_viral / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                                
                                                {idea.razon_potencia && (
                                                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                                        {idea.razon_potencia}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Emoción Objetivo */}
                                        {idea.emocion_objetivo && (
                                            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-2">
                                                <p className="text-[9px] font-black text-purple-400 uppercase mb-1">🎭 Emoción Objetivo</p>
                                                <p className="text-xs text-purple-200">{idea.emocion_objetivo}</p>
                                            </div>
                                        )}

                                        {/* Estructura Sugerida */}
                                        {idea.estructura_sugerida && (
                                            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-lg p-2">
                                                <p className="text-[9px] font-black text-cyan-400 uppercase mb-1">📐 Estructura</p>
                                                <p className="text-xs text-cyan-200">{idea.estructura_sugerida}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Urgencia de Publicación */}
                                    {idea.urgencia_publicacion && (
                                        <div className={`px-3 py-2 rounded-lg border ${getUrgencyColor(idea.urgencia_publicacion)}`}>
                                            <p className="text-[10px] font-black uppercase">
                                                {getUrgencyLabel(idea.urgencia_publicacion)}
                                            </p>
                                            {idea.mejor_momento && (
                                                <p className="text-[9px] mt-1 opacity-70">{idea.mejor_momento}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* 🏛️ Postura Dominante */}
                                    {idea.postura_dominante && (
                                        <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 space-y-2">
                                            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">⚔️ Postura Dominante</p>
                                            {idea.postura_dominante.creencia_atacada && (
                                                <div>
                                                    <span className="text-[8px] text-gray-600 uppercase">Creencia atacada:</span>
                                                    <p className="text-[10px] text-gray-300">{idea.postura_dominante.creencia_atacada}</p>
                                                </div>
                                            )}
                                            {idea.postura_dominante.nuevo_marco_mental && (
                                                <div>
                                                    <span className="text-[8px] text-gray-600 uppercase">Nuevo marco:</span>
                                                    <p className="text-[10px] text-green-300">{idea.postura_dominante.nuevo_marco_mental}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 📊 Scoring Dominación */}
                                    {(idea.originalidad_score || idea.diferenciacion_score) && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {idea.originalidad_score && (
                                                <div className="bg-black/40 rounded-lg p-2 text-center border border-white/5">
                                                    <p className="text-[8px] text-gray-600 uppercase mb-1">Originalidad</p>
                                                    <p className={`text-sm font-black ${idea.originalidad_score >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {idea.originalidad_score}
                                                    </p>
                                                </div>
                                            )}
                                            {idea.diferenciacion_score && (
                                                <div className="bg-black/40 rounded-lg p-2 text-center border border-white/5">
                                                    <p className="text-[8px] text-gray-600 uppercase mb-1">Diferenciación</p>
                                                    <p className={`text-sm font-black ${idea.diferenciacion_score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {idea.diferenciacion_score}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 🧠 Frame + Ángulo */}
                                    {(idea.frame_usado || idea.angulo_estrategico) && (
                                        <div className="flex flex-wrap gap-2">
                                            {idea.frame_usado && (
                                                <span className="text-[9px] bg-violet-500/10 text-violet-400 px-2 py-1 rounded-full border border-violet-500/20 font-bold">
                                                    🖼️ {idea.frame_usado.replace(/_/g, ' ')}
                                                </span>
                                            )}
                                            {idea.angulo_estrategico && (
                                                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20 font-bold">
                                                    🎯 {idea.angulo_estrategico}
                                                </span>
                                            )}
                                            {idea.riesgo_emocional_activado && (
                                                <span className="text-[9px] bg-orange-500/10 text-orange-400 px-2 py-1 rounded-full border border-orange-500/20 font-bold">
                                                    ⚡ {idea.riesgo_emocional_activado}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* 🌐 ADAPTACIONES MULTIPLATAFORMA */}
                                    {(idea as any).adaptaciones && (
                                        <div className="bg-gray-900/40 border border-purple-500/20 rounded-xl p-3 space-y-3">
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">🌐 Adaptaciones por Plataforma</p>
                                            {Object.entries((idea as any).adaptaciones).map(([plat, data]: [string, any]) => (
                                                <div key={plat} className="bg-black/40 rounded-lg p-3 border border-white/5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-white uppercase">{plat}</span>
                                                        <div className="flex gap-2">
                                                            {data.ctr_score && (
                                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${data.ctr_score >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                                    CTR {data.ctr_score}
                                                                </span>
                                                            )}
                                                            {data.nivel_polarizacion && (
                                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                                                                    ⚡{data.nivel_polarizacion}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {data.hook && (
                                                        <p className="text-xs text-white font-bold mb-1">"{data.hook}"</p>
                                                    )}
                                                    {data.gancho_completo && data.gancho_completo !== data.hook && (
                                                        <p className="text-[10px] text-gray-400 italic mb-1">{data.gancho_completo}</p>
                                                    )}
                                                    {data.miniatura_frase && (
                                                        <span className="text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">
                                                            🖼️ {data.miniatura_frase}
                                                        </span>
                                                    )}
                                                    {data.mejor_horario && (
                                                        <p className="text-[9px] text-gray-600 mt-1">⏰ {data.mejor_horario}</p>
                                                    )}
                                                </div>
                                            ))}
                                            {(idea as any).plan_produccion && (
                                                <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-500/20">
                                                    <p className="text-[9px] font-black text-indigo-400 uppercase mb-2">🎬 Plan de Producción</p>
                                                    <p className="text-[10px] text-gray-300">{(idea as any).plan_produccion.video_base}</p>
                                                    {(idea as any).plan_produccion.orden_publicacion && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {(idea as any).plan_produccion.orden_publicacion.map((p: string, i: number) => (
                                                                <span key={i} className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full">
                                                                    {i+1}. {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Metadatos Extras */}
                                    <div className="flex flex-wrap gap-2">
                                        {idea.formato_visual && (
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-bold rounded-full border border-purple-500/20">
                                                {idea.formato_visual}
                                            </span>
                                        )}
                                        {idea.duracion_recomendada && (
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-bold rounded-full border border-blue-500/20">
                                                ⏱ {idea.duracion_recomendada}
                                            </span>
                                        )}
                                        {idea.dificultad_produccion && (
                                            <span className={`px-2 py-1 text-[9px] font-bold rounded-full border ${
                                                idea.dificultad_produccion === 'Baja' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                idea.dificultad_produccion === 'Media' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                🎬 {idea.dificultad_produccion}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 mt-6 pt-5 border-t border-gray-800/50 relative z-10">
                                    <button
                                        onClick={() => { 
                                            const textToCopy = `${idea.titulo}\n\n${idea.concepto}${idea.gancho_sugerido ? `\n\nGancho: ${idea.gancho_sugerido}` : ''}`;
                                            navigator.clipboard.writeText(textToCopy); 
                                            alert("Copiado"); 
                                        }}
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
                                        onClick={() => handleGoToEditor(idea)}
                                        className="flex-1 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white text-xs font-black flex justify-center items-center gap-2 transition-all shadow-sm uppercase tracking-wider group/btn"
                                    >
                                        {idea.idea_expandida_tca ? '⚡ Crear Guion TCA' : 'Crear Guion'}
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};