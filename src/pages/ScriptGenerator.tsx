import React, { useState, useEffect } from 'react';
import { TCAFeedbackWidget } from '../components/TCAFeedbackWidget';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    RefreshCw, Wand2, Zap, Copy, Save, Calendar as CalendarIcon, Gavel,
    Video, Instagram, Youtube, Linkedin, Globe, CheckCircle2, AlignLeft,
    User, AlertCircle, PenTool, Layout, Brain, Target, XCircle,
    X, ChevronRight, Flame, TrendingUp, MessageCircle, Award, Eye,
    Image as ImageIcon, UploadCloud // ✅ Nuevos iconos agregados
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES Y TIPOS (ACTUALIZADAS PARA V500)
// ==================================================================================

interface ScriptResult {
  hook?: string;
  estructura_desglosada?: any;
  guion_completo: string;
  micro_loops_detectados?: any[];
  curva_emocional?: any;
  activadores_psicologicos?: any[];
  nivel_intensidad?: string;
  identidad_verbal?: any;
  tipo_de_cierre?: string;
  ganchos_opcionales?: Array<{
    tipo: string;
    texto: string;
    retencion_predicha: number;
    mecanismo?: string;
  }>;
  plan_visual?: Array<{
    tiempo: string;
    accion_en_pantalla: string;
    instruccion_produccion: string;
    audio?: string;
    texto_pantalla?: string;
  }>;
  score_predictivo?: {
    retention_score: number;
    share_score: number;
    save_score: number;
    authority_score: number;
    impact_score?: number;
    viral_index: number;
    metricas_cualitativas?: {
      nivel_de_disrupcion: number;
      nivel_de_memorabilidad: number;
      nivel_de_polarizacion: number;
      nivel_de_control_de_frame: number;
      nivel_de_diferenciacion_competitiva: number;
    };
    umbral_dominancia_superado?: boolean;
    razonamiento?: string;
  };
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
    arquitectura_completa?: boolean;
    tension_progresiva?: boolean;
    identidad_presente?: boolean;
    sin_cliches?: boolean;
    activadores_insertados?: boolean;
    cierre_coherente?: boolean;
    nativo_plataforma?: boolean;
    curva_emocional_dinamica?: boolean;
    hace_sentir_inspirado?: boolean;
    suena_distinto?: boolean;
    podria_molestar?: boolean;
    sera_recordado?: boolean;
    nivel_de_disrupcion_alto?: boolean;
    diferenciacion_real?: boolean;
    control_de_frame_logrado?: boolean;
    supera_contenido_promedio?: boolean;
    cumple_umbral_dominancia?: boolean;
    decision?: string;
    razon?: string;
  };
teleprompter_script?: string;
  plan_produccion_visual?: Array<{
    tiempo: string;
    tipo_plano: string;
    descripcion_visual: string;
    movimiento_camara: string;
    b_roll_sugerido: string;
    efecto_retencion: string;
    texto_en_pantalla: string;
    musica_recomendada: string;
    efecto_sonido: string;
  }>;
  // ✅ V700: Plan audiovisual profesional
  plan_audiovisual_profesional?: {
    secuencia_temporal: Array<{
      tiempo: string;
      descripcion_visual: string;
      emocion_objetivo: string;
      tipo_plano: string;
      movimiento_camara: string;
      texto_en_pantalla: string;
      efecto_retencion: string;
    }>;
    b_rolls_estrategicos: Array<{
      momento: string;
      que_mostrar: string;
      por_que_refuerza: string;
      emocion_generada: string;
    }>;
    ritmo_de_cortes: {
      patron_general: string;
      descripcion: string;
      aceleraciones: string;
      desaceleraciones: string;
    };
    musica: {
      tipo: string;
      bpm_aproximado: number;
      emocion_dominante: string;
      entrada_musica: string;
      cambio_musical: string;
    };
    efectos_de_retencion: {
      sonido_transicion: string;
      micro_silencios: string;
      cambios_de_plano: string;
      micro_interrupciones: string;
    };
  };
  miniatura_dominante?: {
    frase_principal: string;
    // Legado (compatibilidad)
    variantes_ab?: string[];
    plataforma_optimizada?: string;
    coherencia_con_hook?: boolean;
    razon_estrategica?: string;
    // ✅ V700: nuevos campos
    variante_agresiva?: string;
    variante_aspiracional?: string;
    justificacion_estrategica?: string;
    emocion_dominante_activada?: string;
    gap_curiosidad?: string;
    compatibilidad_plataformas?: {
      tiktok?: string;
      reels?: string;
      youtube?: string;
      facebook?: string;
    };
    sector_tca_activado: string;
    mecanismo_psicologico: string;
    ctr_score: number;
    nivel_disrupcion: number;
    nivel_gap_curiosidad: number;
    nivel_polarizacion: number;
    compatibilidad_algoritmica: number;
  };
  dominio_narrativo?: {
    marco_impuesto?: string;
    enemigo_identificado?: string;
    creencia_atacada?: string;
    nuevo_frame_propuesto?: string;
    postura_dominante?: string;
  };
  poder_del_guion?: {
    hook_primeros_3_segundos?: string;
    frase_de_oro?: string;
    punto_de_no_retorno?: string;
    por_que_llegara_a_millones?: string;
    momento_mas_compartible?: string;
    prediccion_comentarios?: string;
  };
  metadata_guion?: {
    tema_tratado?: string;
    plataforma?: string;
    arquitectura?: string;
    objetivo_viral?: string;
    percepcion_creador?: string;
    tono_voz?: string;
    ritmo?: string;
    nivel_intensidad?: string;
    objetivo_cierre?: string;
    estructura_usada?: string;
  };
  estrategia_tca?: {
    nivel_posicionamiento?: string;
    sector_utilizado?: string;
    mass_appeal_score?: number;
    tipo_contenido_embudo?: string;
    equilibrio_masividad_calificacion?: boolean;
    hook_sectorial?: string;
    capa_visible?: string;
    capa_estrategica?: string;
    angulo_activo?: string;
    plataforma_calibrada?: string;
    cultural_tension_index?: {
      score_total?: number;
      descripcion_tension?: string;
    };
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

const INTENSITY_MODES = [
    { 
        id: 'conservador', 
        label: '🕊️ Conservador', 
        desc: 'Tono suave, sin polarizar',
        color: 'border-gray-500 bg-gray-500/10 text-gray-300'
    },
    { 
        id: 'equilibrado', 
        label: '⚖️ Equilibrado', 
        desc: 'Balance impacto/accesibilidad',
        color: 'border-blue-500 bg-blue-500/10 text-blue-300'
    },
    { 
        id: 'agresivo', 
        label: '🔥 Agresivo', 
        desc: 'Alta confrontación, máximo impacto',
        color: 'border-orange-500 bg-orange-500/10 text-orange-300'
    },
    { 
        id: 'dominante', 
        label: '👑 Dominante', 
        desc: 'Autoridad absoluta, sin concesiones',
        color: 'border-red-500 bg-red-500/10 text-red-300'
    },
];

// ✅ V700: Formatos narrativos
const NARRATIVE_FORMATS = [
    { id: 'EDUCATIVO_AUTORIDAD',   label: '📚 Educativo de Autoridad',      desc: 'Tesis provocadora → Sistema nombrado → CTA de posicionamiento' },
    { id: 'STORYTELLING_EMOCIONAL',label: '🎭 Storytelling Emocional',       desc: 'In media res → Giro narrativo → Aprendizaje encarnado' },
    { id: 'ANUNCIO_DIRECTO',       label: '📢 Anuncio Directo',              desc: 'Filtro de avatar → Dolor afilado → CTA único y claro' },
    { id: 'ANUNCIO_INDIRECTO',     label: '🎣 Anuncio Indirecto',            desc: 'Valor puro → Problema implícito → CTA suave' },
    { id: 'OPINION_POLARIZACION',  label: '⚡ Opinión / Polarización',       desc: 'Declaración divisiva → Argumento irrefutable → Posición inamovible' },
    { id: 'CASO_ESTUDIO',          label: '📊 Caso de Estudio',              desc: 'Resultado primero → Sistema aplicado → Principio replicable' },
    { id: 'TUTORIAL_PASO_A_PASO',  label: '🔧 Tutorial Paso a Paso',        desc: 'Promesa hiper-específica → 3 pasos con micro-aplicación' },
    { id: 'PODCAST_REFLEXIVO',     label: '🎙️ Podcast Corto Reflexivo',     desc: 'Pregunta íntima → Exploración honesta → Cierre abierto' },
    { id: 'MASTERCLASS_COMPRIMIDA',label: '🏛️ Masterclass Comprimida',      desc: 'Mapa de 3 conceptos → Síntesis guardable → CTA de profundización' },
    { id: 'FRAME_DISRUPTIVO',      label: '💥 Frame Disruptivo / Shock',     desc: 'Afirmación imposible → Evidencia sólida → Reencuadre total' },
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
    { id: 'short', label: 'Flash (30s)', cost: 5, words: '~75 palabras', color: 'text-gray-400' },
    { id: 'medium', label: 'Estándar (60s)', cost: 7, words: '~150 palabras', color: 'text-indigo-400' },
    { id: 'long', label: 'Profundo (90s)', cost: 8, words: '~210 palabras', color: 'text-purple-400' },
    { id: 'masterclass', label: 'Masterclass (+5m)', cost: 30, words: '~900 palabras', color: 'text-yellow-400' },
];

const PLATFORMS = [
    { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', bg: 'bg-pink-900/20' },
    { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', bg: 'bg-red-900/20' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { id: 'Facebook', icon: Globe, label: 'Facebook', color: 'text-blue-500', bg: 'bg-blue-800/20' }
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

    // ... otros estados ...
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64
    const [imagePreview, setImagePreview] = useState<string | null>(null);   // Para mostrarla

    // ✅ NUEVO: Estados para la Matriz V500
    const [selectedStructure, setSelectedStructure] = useState(TITAN_STRUCTURES[0]); 
    const [selectedInternalMode, setSelectedInternalMode] = useState(TITAN_STRUCTURES[0].modes[0]);
    
    // 👇👇👇 AGRÉGALO AQUÍ 👇👇👇
    const [selectedLens, setSelectedLens] = useState('auto'); // Factor X (Variabilidad) 
    const [selectedIntensity, setSelectedIntensity] = useState('equilibrado');
    
    const CLOSING_OBJECTIVES = [
    { id: 'seguidores', label: '👥 Ganar Seguidores' },
    { id: 'leads', label: '📥 Captar Leads' },
    { id: 'venta', label: '💰 Vender' },
    { id: 'autoridad', label: '👑 Construir Autoridad' },
];

    const [closingObjective, setClosingObjective] = useState('seguidores');

    // ✅ V700: Formato narrativo activo
    const [selectedNarrativeFormat, setSelectedNarrativeFormat] = useState('EDUCATIVO_AUTORIDAD');

    // --- Estados Psicológicos ---
    const [mostrarFeedback, setMostrarFeedback]     = useState(false);
    const [guionParaFeedback, setGuionParaFeedback] = useState<any>(null);
    const [culturalContext, setCulturalContext]     = useState('');
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
    useEffect(() => {
    const selected = DURATIONS.find(d => d.id === durationId);
    if (selected) setCost(selected.cost);
}, [durationId]);


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

            // Si viene de Ideas Rápidas con TCA pre-expandido
            // marcar el settings para que CAPA 0 no reexpanda
            if (location.state.tca_preexpandido) {
                console.log('[SCRIPT GENERATOR] ⚡ Tema pre-expandido por TCA Imperio — bypass de reexpansión');
            }

            window.history.replaceState({}, document.title);
        }
        
        if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);

    }, [user, userProfile, location]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño (ej: max 4MB)
        if (file.size > 4 * 1024 * 1024) {
            alert("La imagen es muy pesada. Máximo 4MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSelectedImage(base64String); // Esto va al backend
            setImagePreview(base64String);  // Esto se muestra al usuario
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    // ==================================================================================
    // 🎯 GENERACIÓN (CONEXIÓN AL CEREBRO V500)
    // ==================================================================================

    const handleGenerate = async () => {
        // 1. Validaciones básicas
        if (!topic.trim() && !selectedImage) {
            setError("Por favor escribe un tema o sube una imagen.");
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
                    userInput: topic.trim() || '',
                    topic: topic.trim() || '',
                    image: selectedImage,   // ← COMA CORREGIDA
                    settings: {
                        platform: selectedPlatform.label,
                        structure: selectedStructure.id,
                        internal_mode: selectedInternalMode.id,
                        creative_lens: selectedLens,
                        intensity: selectedIntensity,
                        closing_objective: closingObjective,
                        awareness: awareness,
                        objective: objective,
                        situation: situation,
                        durationId: durationId,
                        duration: durationId,
                        hook_style: hookType,
                        hookStyle: hookType,
                        cultural_context_usuario: culturalContext || null,
                        formato_narrativo: selectedNarrativeFormat, // ✅ V700
                    },
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
            
            if (!finalResult.guion_completo && !finalResult.teleprompter_script) {
                throw new Error('El backend no devolvió un guion. Intenta de nuevo.');
            }

            setResult(finalResult);
            setGuionParaFeedback(finalResult);
            setTimeout(() => setMostrarFeedback(true), 48 * 60 * 60 * 1000);
            
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
        <>
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in pb-20 p-4 font-sans text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                        <Flame className="text-pink-500" size={32}/> 
                        MOTOR VIRAL V700 ÉLITE
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        10 Formatos Narrativos · Plan Audiovisual · TCA Imperio · Duración Dinámica
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
                    {/* INPUT DE IMAGEN (NUEVO) */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg mb-6">
                        <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
                            <ImageIcon size={14} /> Inspiración Visual (Opcional)
                        </label>
                        
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-800 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-colors cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-indigo-400 transition-colors">
                                    <UploadCloud size={24} />
                                    <span className="text-xs font-bold">Haz clic o arrastra una imagen aquí</span>
                                    <span className="text-[10px] opacity-60">El Motor V600 analizará su concepto viral</span>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-indigo-500/30 group">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                    <p className="text-xs font-bold text-white flex items-center gap-2">
                                        <CheckCircle2 size={12} className="text-green-400"/> Imagen Cargada
                                    </p>
                                </div>
                                <button 
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
                        <label className="text-xs font-black text-gray-500 uppercase mb-2 block tracking-widest">
                            1. Tema Principal
                        </label>
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={selectedImage ? "Opcional: ¿Qué aspecto de la imagen te interesa? (ej: el punto 3, la parte del cierre...)" : "Ej: Por qué el 90% de emprendedores fracasan en su primer año..."}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white text-sm focus:border-indigo-500 outline-none h-24 resize-none transition-all focus:ring-1 focus:ring-indigo-500/50"
                        />
                        
                        {/* Selector de Plataforma */}
                        <div className="grid grid-cols-5 gap-2 mt-4">
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
                     
                    {/* 🔥 MÓDULO 6: INTENSIDAD ESTRATÉGICA */}
<div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg">
    <label className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2 tracking-widest">
        <Flame size={14} /> Intensidad Estratégica
    </label>
    <div className="grid grid-cols-2 gap-2">
        {INTENSITY_MODES.map(mode => (
            <button
                key={mode.id}
                onClick={() => setSelectedIntensity(mode.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                    selectedIntensity === mode.id
                        ? mode.color + ' ring-1 ring-current'
                        : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800'
                }`}
            >
                <span className="text-xs font-bold block">{mode.label}</span>
                <span className="text-[9px] opacity-70 mt-0.5 block">{mode.desc}</span>
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

                    {/* ── CONTEXTO CULTURAL TCA ── */}
                    <div className="bg-[#0B0E14] border border-yellow-900/40 rounded-2xl p-4 space-y-2">
                        <label className="text-[10px] font-black text-yellow-600 uppercase tracking-widest block">
                            🔥 Contexto actual del sector
                            <span className="text-gray-600 font-normal normal-case tracking-normal ml-2">
                                opcional — potencia el alcance masivo
                            </span>
                        </label>
                        <textarea
                            value={culturalContext}
                            onChange={e => setCulturalContext(e.target.value.slice(0, 300))}
                            placeholder="¿Qué está pasando esta semana en tu sector que conecte con tu tema? Ej: Salió un reporte que dice que el 70% de negocios necesitará IA, mis clientes me preguntan mucho sobre esto..."
                            rows={3}
                            className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-yellow-600 resize-none"
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-600">
                                💡 Calibra la tensión cultural del sistema TCA en tiempo real
                            </span>
                            <span className={`text-[10px] ${culturalContext.length > 250 ? 'text-yellow-500' : 'text-gray-600'}`}>
                                {culturalContext.length}/300
                            </span>
                        </div>
                    </div>

                    {/* CONFIGURACIÓN FINAL */}
<div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
    
    {/* Estilo de Gancho */}
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

    {/* Duración del Video */}
    <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">
            Duración del Video
        </label>
        <div className="grid grid-cols-2 gap-2">
            {DURATIONS.map(d => (
                <button 
                    key={d.id} 
                    onClick={() => setDurationId(d.id)} 
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                        durationId === d.id 
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-900/20' 
                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800'
                    }`}
                >
                    <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-white">{d.label}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            durationId === d.id 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-gray-800 text-gray-500'
                        }`}>
                            {d.cost}CR
                        </span>
                    </div>
                    <span className={`text-[9px] ${durationId === d.id ? 'text-indigo-300' : 'text-gray-600'}`}>
                        {d.id === 'short' ? '~75 palabras' : d.id === 'medium' ? '~150 palabras' : d.id === 'long' ? '~210 palabras' : '~900 palabras'}
                    </span>
                </button>
            ))}
        </div>
    </div>

    {/* ✅ CAMBIO 7 — Objetivo del Cierre (CTA) */}
    <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">
            Objetivo del Cierre (CTA)
        </label>
        <div className="grid grid-cols-2 gap-2">
            {CLOSING_OBJECTIVES.map(obj => (
                <button
                    key={obj.id}
                    onClick={() => setClosingObjective(obj.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        closingObjective === obj.id
                            ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-md shadow-pink-900/20'
                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800'
                    }`}
                >
                    {obj.label}
                </button>
            ))}
        </div>
    </div>

    {/* Perfil de Experto */}
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

                {/* ✅ V700 — SELECTOR DE FORMATO NARRATIVO */}
                    <div className="bg-[#0B0E14] border border-violet-500/30 rounded-2xl p-5 shadow-lg space-y-3">
                        <label className="text-xs font-black text-violet-400 uppercase mb-1 flex items-center justify-between tracking-widest">
                            <span className="flex items-center gap-2"><Brain size={14}/> Formato Narrativo</span>
                            <span className="text-[9px] font-black bg-violet-500 text-white px-2 py-0.5 rounded-full tracking-widest">V700</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {NARRATIVE_FORMATS.map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setSelectedNarrativeFormat(fmt.id)}
                                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                                        selectedNarrativeFormat === fmt.id
                                            ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-lg shadow-violet-900/20'
                                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                                    }`}
                                >
                                    <span className="text-[11px] font-black leading-tight">{fmt.label}</span>
                                    <span className="text-[9px] opacity-70 leading-tight">{fmt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* BOTÓN PRINCIPAL */}
                    <button 
                        onClick={handleGenerate} 
                        disabled={(!topic.trim() && !selectedImage) || isGenerating} 
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl flex justify-center items-center gap-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all active:scale-95 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="animate-spin" size={20}/>
                                MOTOR V700 PROCESANDO...
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
                                            {result.metadata_guion?.estructura_usada || result.metadata_guion?.arquitectura || selectedStructure.label}
                                        </span>
                                        {/* ✅ V700: Formato Narrativo Activo */}
                                        {(result.metadata_guion as any)?.formato_narrativo_activo && (
                                            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                                🎭 {(result.metadata_guion as any).formato_narrativo_activo}
                                            </span>
                                        )}
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

                            {/* 🧹 REPORTE ANTI-CLICHÉS P4 */}
{(result as any)._anti_saturation_report?.guion_fue_reescrito && (
    <div className="mb-4 bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
        <h3 className="text-xs font-black text-yellow-400 mb-2 flex items-center gap-2">
            🧹 Anti-Saturación Activo — Clichés Eliminados
        </h3>
        <div className="flex flex-wrap gap-2">
            {(result as any)._anti_saturation_report.cliches_detectados.map((c: string, i: number) => (
                <span key={i} className="text-[10px] bg-yellow-500/10 text-yellow-300 px-2 py-0.5 rounded line-through">
                    {c}
                </span>
            ))}
        </div>
    </div>
)}

{/* ⚖️ REPORTE SCORE VERIFICADO P5 */}
{(result as any)._score_verification_report && (
    <div className="mb-4 bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-xs font-black text-blue-400 mb-2">
            ⚖️ Score Verificado Programáticamente (P5)
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
            {Object.entries((result as any)._score_verification_report).map(([k, v]: any) => (
                <div key={k} className="flex justify-between bg-black/20 px-2 py-1 rounded">
                    <span className="text-gray-400">{k.replace('_real','').replace('_',' ')}</span>
                    <span className="text-blue-300 font-bold">{v}</span>
                </div>
            ))}
        </div>
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

                            {/* 🔴 UMBRAL DE DOMINANCIA V600 */}
                            {result.score_predictivo?.umbral_dominancia_superado !== undefined && (
                                <div style={{
                                    marginBottom: '24px',
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    backgroundColor: result.score_predictivo.umbral_dominancia_superado 
                                        ? 'rgba(13,45,26,0.8)' 
                                        : 'rgba(45,13,13,0.8)',
                                    border: `1px solid ${result.score_predictivo.umbral_dominancia_superado 
                                        ? '#22c55e' 
                                        : '#ef4444'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>
                                        {result.score_predictivo.umbral_dominancia_superado ? '✅' : '🔴'}
                                    </span>
                                    <div className="flex-1">
                                        <p style={{ 
                                            margin: 0, 
                                            fontWeight: 800, 
                                            fontSize: '13px',
                                            color: result.score_predictivo.umbral_dominancia_superado 
                                                ? '#22c55e' 
                                                : '#ef4444' 
                                        }}>
                                            {result.score_predictivo.umbral_dominancia_superado
                                                ? 'UMBRAL DE DOMINANCIA SUPERADO'
                                                : 'UMBRAL DE DOMINANCIA NO ALCANZADO'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                            viral_index: <strong style={{ color: '#fff' }}>{result.score_predictivo.viral_index}</strong> / mínimo requerido: 85
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span style={{ 
                                            fontSize: '28px', 
                                            fontWeight: 900, 
                                            color: result.score_predictivo.viral_index >= 85 ? '#22c55e' : '#ef4444' 
                                        }}>
                                            {result.score_predictivo.viral_index}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* 🧠 MÉTRICAS CUALITATIVAS V600 */}
                            {result.score_predictivo?.metricas_cualitativas && (
                                <div className="mb-6 bg-purple-900/10 border border-purple-500/20 rounded-2xl p-5">
                                    <h3 className="text-sm font-black text-purple-400 mb-4 flex items-center gap-2">
                                        <Brain size={16}/> Impacto Estratégico Real
                                    </h3>
                                    
                                    {/* 5 barras de métricas */}
                                    {[
                                        { key: 'nivel_de_disrupcion',               label: '⚡ Disrupción',        color: '#f59e0b' },
                                        { key: 'nivel_de_memorabilidad',             label: '🧠 Memorabilidad',     color: '#06b6d4' },
                                        { key: 'nivel_de_polarizacion',              label: '🔥 Polarización',      color: '#ef4444' },
                                        { key: 'nivel_de_control_de_frame',          label: '🎯 Control de Frame',  color: '#8b5cf6' },
                                        { key: 'nivel_de_diferenciacion_competitiva',label: '⚔️ Diferenciación',   color: '#22c55e' },
                                    ].map(({ key, label, color }) => {
                                        const value = (result.score_predictivo!.metricas_cualitativas as any)[key] as number;
                                        const isLow = value < 70;
                                        return (
                                            <div key={key} className="mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-gray-300">{label}</span>
                                                    <span className="text-xs font-bold" style={{ color: isLow ? '#ef4444' : color }}>
                                                        {value}/100 {isLow ? '⚠️' : ''}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-800 rounded-full h-2">
                                                    <div 
                                                        className="h-2 rounded-full transition-all duration-700"
                                                        style={{ 
                                                            width: `${value}%`,
                                                            backgroundColor: isLow ? '#ef4444' : color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* impact_score total */}
                                    {result.score_predictivo?.impact_score !== undefined && (
                                        <div className="mt-4 flex justify-between items-center bg-black/40 p-3 rounded-xl border border-gray-700">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Impact Score Total
                                            </span>
                                            <span className="text-2xl font-black" style={{ 
                                                color: result.score_predictivo.impact_score >= 70 ? '#a78bfa' : '#ef4444' 
                                            }}>
                                                {typeof result.score_predictivo.impact_score === 'number' 
                                                    ? result.score_predictivo.impact_score.toFixed(1) 
                                                    : result.score_predictivo.impact_score}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 🛡️ VALIDACIÓN V600 — 5 checks nuevos */}
                            {result.auto_validacion && (
                                result.auto_validacion.nivel_de_disrupcion_alto !== undefined ||
                                result.auto_validacion.diferenciacion_real !== undefined
                            ) && (
                                <div className="mb-6 bg-gray-900/30 border border-gray-700 rounded-2xl p-5">
                                    <h3 className="text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">
                                        🛡️ Validación V600
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {[
                                            { key: 'nivel_de_disrupcion_alto',  label: 'Disrupción Alta' },
                                            { key: 'diferenciacion_real',       label: 'Diferenciación Real' },
                                            { key: 'control_de_frame_logrado',  label: 'Frame Controlado' },
                                            { key: 'supera_contenido_promedio', label: 'Sobre el Promedio' },
                                            { key: 'cumple_umbral_dominancia',  label: 'Umbral ≥75 ✓' },
                                        ].map(({ key, label }) => {
                                            const val = (result.auto_validacion as any)[key];
                                            return (
                                                <div 
                                                    key={key}
                                                    className={`p-2 rounded-lg border flex items-center gap-2 text-[11px] font-bold ${
                                                        val 
                                                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                                                    }`}
                                                >
                                                    <span>{val ? '✅' : '❌'}</span>
                                                    <span>{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 🧠 DOMINIO NARRATIVO */}
                            {result.dominio_narrativo && (
                                <div className="mb-6 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-5">
                                    <h3 className="text-sm font-black text-indigo-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                        🏛️ Arquitectura Estratégica del Guion
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {result.dominio_narrativo.marco_impuesto && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-indigo-500/10">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">🖼️ Marco Impuesto</span>
                                                <p className="text-sm text-gray-200">{result.dominio_narrativo.marco_impuesto}</p>
                                            </div>
                                        )}
                                        {result.dominio_narrativo.enemigo_identificado && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-red-500/10">
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">⚔️ Enemigo Identificado</span>
                                                <p className="text-sm text-gray-200">{result.dominio_narrativo.enemigo_identificado}</p>
                                            </div>
                                        )}
                                        {result.dominio_narrativo.creencia_atacada && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-orange-500/10">
                                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-1">💥 Creencia Atacada</span>
                                                <p className="text-sm text-gray-200">{result.dominio_narrativo.creencia_atacada}</p>
                                            </div>
                                        )}
                                        {result.dominio_narrativo.nuevo_frame_propuesto && (
                                            <div className="bg-black/40 rounded-xl p-3 border border-green-500/10">
                                                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block mb-1">✨ Nuevo Frame Propuesto</span>
                                                <p className="text-sm text-gray-200">{result.dominio_narrativo.nuevo_frame_propuesto}</p>
                                            </div>
                                        )}
                                    </div>
                                    {result.dominio_narrativo.postura_dominante && (
                                        <div className="mt-3 bg-black/40 rounded-xl p-3 border border-purple-500/20">
                                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">🎯 Postura Dominante</span>
                                            <p className="text-sm text-gray-200">{result.dominio_narrativo.postura_dominante}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                         {/* ⭐ FRASE DE ORO */}
                            {result.poder_del_guion?.frase_de_oro && (
                                <div className="mb-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/8 border border-yellow-500/25 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                                            ⭐ Frase de Oro
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                navigator.clipboard.writeText(result.poder_del_guion!.frase_de_oro!);
                                                const btn = e.currentTarget;
                                                btn.textContent = '✅ Copiada';
                                                setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000);
                                            }}
                                            className="text-[9px] font-black text-yellow-400/60 hover:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg transition-colors"
                                        >
                                            📋 Copiar
                                        </button>
                                    </div>
                                    <p className="text-white font-black text-lg leading-tight mb-1">
                                        "{result.poder_del_guion.frase_de_oro}"
                                    </p>
                                    <p className="text-yellow-500/50 text-[9px]">Screenshoteable · el insight central del guion</p>
                                </div>
                            )}

                            {/* 🔁 MICRO-LOOPS */}
                            {result.micro_loops_detectados && result.micro_loops_detectados.length > 0 && (
                                <div className="mb-4 bg-blue-900/8 border border-blue-500/15 rounded-2xl p-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 block">
                                        🔁 Micro-loops de Retención ({result.micro_loops_detectados.length})
                                    </span>
                                    <div className="space-y-2">
                                        {result.micro_loops_detectados.map((loop: any, i: number) => (
                                            <div key={i} className="flex items-start gap-2 bg-black/20 rounded-xl p-2.5">
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${loop.tipo === 'apertura' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {loop.tipo === 'apertura' ? '⬆ ABRE' : '⬇ CIERRA'}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-gray-300 italic">"{loop.frase}"</p>
                                                    <p className="text-[9px] text-gray-600 mt-0.5">⏱ {loop.tiempo_aproximado}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 🧠 ACTIVADORES PSICOLÓGICOS */}
                            {result.activadores_psicologicos && result.activadores_psicologicos.length > 0 && (
                                <div className="mb-4 bg-purple-900/8 border border-purple-500/15 rounded-2xl p-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-3 block">
                                        🧠 Activadores Psicológicos
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {result.activadores_psicologicos.map((act: any, i: number) => (
                                            <div key={i} className="bg-black/20 rounded-xl p-2.5 border border-purple-500/10">
                                                <span className="text-[8px] font-black text-purple-400 uppercase block mb-1">
                                                    {act.tipo === 'guardado' ? '💾 Guardado' : act.tipo === 'compartido' ? '🔁 Compartido' : act.tipo === 'comentario' ? '💬 Comentario' : '👁 Follow'}
                                                </span>
                                                <p className="text-[10px] text-gray-300 italic leading-tight">"{act.frase || act.contenido}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                         {/* 🖼️ MINIATURA DOMINANTE */}
                            {(result.miniatura_dominante || result.guion_completo_data?.miniatura_dominante) && (() => {
                                const min = result.miniatura_dominante || result.guion_completo_data?.miniatura_dominante;
                                return (
                                <div className="mb-6 rounded-2xl overflow-hidden border border-yellow-500/30"
                                    style={{ background: 'linear-gradient(135deg, rgba(20,15,0,0.95) 0%, rgba(30,20,0,0.95) 100%)' }}>
                                    {/* Header */}
                                    <div className="px-5 py-3 border-b border-yellow-500/20 flex items-center justify-between">
                                        <span className="text-xs font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                                            🖼️ Frase para Miniatura
                                        </span>
                                        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                            {min?.plataforma_optimizada}
                                        </span>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {/* Frase Principal */}
                                        <div className="text-center py-4 px-6 bg-black/60 rounded-xl border border-yellow-400/20">
                                            <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2">Frase Principal</p>
                                            <p className="text-2xl font-black text-white leading-tight tracking-tight">
                                                "{min?.frase_principal}"
                                            </p>
                                        </div>
                        {/* Variantes A/B legado / V700 */}
                                        {/* V700: variante_agresiva + variante_aspiracional */}
                                        {(min?.variante_agresiva || min?.variante_aspiracional) ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {min?.variante_agresiva && (
                                                    <div className="bg-black/40 rounded-xl p-3 border border-red-500/20 text-center">
                                                        <span className="text-[9px] font-black text-red-400 uppercase block mb-1">⚡ Versión Agresiva</span>
                                                        <p className="text-sm font-black text-gray-200">"{min?.variante_agresiva}"</p>
                                                    </div>
                                                )}
                                                {min?.variante_aspiracional && (
                                                    <div className="bg-black/40 rounded-xl p-3 border border-emerald-500/20 text-center">
                                                        <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">✨ Versión Aspiracional</span>
                                                        <p className="text-sm font-black text-gray-200">"{min?.variante_aspiracional}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : min?.variantes_ab && min?.variantes_ab.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {min?.variantes_ab.map((v: string, i: number) => (
                                                    <div key={i} className="bg-black/40 rounded-xl p-3 border border-yellow-500/10 text-center">
                                                        <span className="text-[9px] font-black text-yellow-600 uppercase block mb-1">
                                                            {i === 0 ? '⚡ Más Agresiva' : '✨ Más Aspiracional'}
                                                        </span>
                                                        <p className="text-sm font-black text-gray-200">"{v}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Scores CTR */}
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {[
                                                { label: 'CTR Score', value: min?.ctr_score, color: '#facc15' },
                                                { label: 'Disrupción', value: min?.nivel_disrupcion, color: '#f87171' },
                                                { label: 'Gap Curiosidad', value: min?.nivel_gap_curiosidad, color: '#60a5fa' },
                                                { label: 'Polarización', value: min?.nivel_polarizacion, color: '#f472b6' },
                                                { label: 'Algoritmo', value: min?.compatibilidad_algoritmica, color: '#34d399' },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} className="bg-black/40 rounded-xl p-2 text-center border border-white/5">
                                                    <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                                                    <p className="text-lg font-black" style={{ color }}>{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Meta info */}
                                        <div className="flex flex-wrap gap-2">
                                            {min?.sector_tca_activado && (
                                                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full font-bold">
                                                    🎯 {min?.sector_tca_activado}
                                                </span>
                                            )}
                                            {min?.mecanismo_psicologico && (
                                                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full font-bold">
                                                    🧠 {min?.mecanismo_psicologico}
                                                </span>
                                            )}
                                            {min?.coherencia_con_hook && (
                                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full font-bold">
                                                    ✅ Coherente con Hook
                                                </span>
                                            )}
                                            {min?.emocion_dominante_activada && (
                                                <span className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-1 rounded-full font-bold">
                                                    💥 {min?.emocion_dominante_activada}
                                                </span>
                                            )}
                                        </div>
                                        {/* ✅ V700: Gap de Curiosidad */}
                                        {min?.gap_curiosidad && (
                                            <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-3">
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">🕳️ Gap de Curiosidad</span>
                                                <p className="text-xs text-gray-300">{min?.gap_curiosidad}</p>
                                            </div>
                                        )}
                                        {/* ✅ V700: Compatibilidad por Plataforma */}
                                        {min?.compatibilidad_plataformas && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {Object.entries(min?.compatibilidad_plataformas).map(([plat, desc]) => (
                                                    <div key={plat} className="bg-black/40 rounded-xl p-2 border border-white/5 text-center">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">{plat}</span>
                                                        <p className="text-[10px] text-gray-300 leading-tight">{desc as string}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {(min?.razon_estrategica || min?.justificacion_estrategica) && (
                                            <p className="text-xs text-gray-500 italic border-t border-yellow-500/10 pt-3">
                                                💭 {min?.justificacion_estrategica || min?.razon_estrategica}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                );
                            })()}

                            {/* 🔥 5 HOOKS TCA V700 — TEORÍA CIRCULAR DE ALCANCE */}
                            {result.ganchos_opcionales && result.ganchos_opcionales.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Zap size={14}/> 5 Hooks TCA — Teoría Circular de Alcance
                                        </label>
                                        <span className="text-[9px] font-black bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-0.5 rounded-full">V700</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                        {result.ganchos_opcionales.map((hook: any, idx: number) => {
                                            const hookMeta: Record<string, any> = {
                                                CONTROVERSIAL: { border: 'border-red-500/40', bg: 'bg-red-950/30', label: 'text-red-400', badge: 'bg-red-500/15 text-red-400', emoji: '🔥' },
                                                EMOCIONAL:     { border: 'border-pink-500/40', bg: 'bg-pink-950/30', label: 'text-pink-400', badge: 'bg-pink-500/15 text-pink-400', emoji: '💔' },
                                                CURIOSIDAD:    { border: 'border-cyan-500/40', bg: 'bg-cyan-950/30', label: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-400', emoji: '🧠' },
                                                AUTORIDAD:     { border: 'border-yellow-500/40', bg: 'bg-yellow-950/30', label: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-400', emoji: '👑' },
                                                POLARIZACION:  { border: 'border-purple-500/40', bg: 'bg-purple-950/30', label: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400', emoji: '⚡' },
                                            };
                                            const meta = hookMeta[hook.tipo] || { border: 'border-gray-700', bg: 'bg-gray-900/30', label: 'text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-400', emoji: '🎯' };
                                            return (
                                                <div key={idx} className={`${meta.bg} ${meta.border} border rounded-2xl p-3 flex flex-col gap-2 hover:scale-[1.02] transition-transform`}>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badge}`}>
                                                            {meta.emoji} {hook.tipo}
                                                        </span>
                                                        <span className="text-[9px] font-black text-green-400">{hook.retencion_predicha}%</span>
                                                    </div>
                                                    <p className={`text-xs font-bold leading-snug ${meta.label}`}>
                                                        "{hook.texto}"
                                                    </p>
                                                    {hook.tca_sector && (
                                                        <span className="text-[9px] text-gray-500 leading-tight">
                                                            🌀 TCA: {hook.tca_sector}
                                                        </span>
                                                    )}
                                                    {hook.mecanismo && (
                                                        <span className="text-[9px] text-gray-400 bg-black/40 px-2 py-1 rounded-lg leading-tight block">
                                                            ⚙️ {hook.mecanismo}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            navigator.clipboard.writeText(hook.texto || '');
                                                            const btn = e.currentTarget;
                                                            btn.textContent = '✅ Copiado';
                                                            setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000);
                                                        }}
                                                        className={`text-[9px] font-black uppercase tracking-widest ${meta.label} opacity-60 hover:opacity-100 transition-opacity text-left mt-auto`}
                                                    >
                                                        📋 Copiar
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[9px] text-gray-600 mt-2 italic">
                                        🌀 Cada hook está calibrado para un nivel distinto del embudo TCA — usa el que corresponda a tu objetivo de alcance
                                    </p>
                                </div>
                            )}
                            {/* 🎤 TELEPROMPTER TCA LIMPIO — SOLO TEXTO HABLADO */}
                            {result.teleprompter_script && (
                                <div className="flex-1 space-y-3 mb-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                            <AlignLeft size={14}/> 🎤 Teleprompter TCA
                                            <span className="text-[9px] font-black bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                                                {(() => {
                                                    const words = (result.teleprompter_script || '').replace(/\[.*?\]/g,'').trim().split(/\s+/).filter(Boolean).length;
                                                    const min = durationId === 'short' ? 70 : durationId === 'long' ? 200 : durationId === 'masterclass' ? 700 : 140;
                                                    return `${words} palabras ${words < min ? '⚠️ corto' : '✅'} · Solo texto hablado`;
                                                })()}
                                            </span>
                                        </label>
                                        <button
                                            onClick={() => {
                                                const clean = (result.teleprompter_script || '')
                                                    .split('\n')
                                                    .filter((l: string) => !l.startsWith('[CAPA') && !l.startsWith('⚠️') && !l.startsWith('━') && !l.startsWith('REGLA') && !l.startsWith('✓') && !l.startsWith('TCA =') && !l.startsWith('CAPA ') && !l.startsWith('→') && l.trim() !== '')
                                                    .join('\n');
                                                navigator.clipboard.writeText(clean).then(() => {
                                                    const btn = document.getElementById('btn-copy-teleprompter');
                                                    if (btn) { btn.textContent = '✅ Copiado'; setTimeout(() => { btn.textContent = '📋 Copiar Teleprompter'; }, 2000); }
                                                });
                                            }}
                                            id="btn-copy-teleprompter"
                                            className="text-[10px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors flex items-center gap-1"
                                        >
                                            <Copy size={10}/> Copiar Teleprompter
                                        </button>
                                    </div>
                                    <div className="bg-black/80 p-8 rounded-2xl border border-green-500/20 text-green-100 text-xl leading-relaxed font-medium whitespace-pre-wrap shadow-inner max-h-[500px] overflow-y-auto font-mono selection:bg-green-500 selection:text-black">
                                        {(result.teleprompter_script || '')
                                            .split('\n')
                                            .filter((l: string) => !l.startsWith('[CAPA') && !l.startsWith('⚠️') && !l.startsWith('━') && !l.startsWith('REGLA') && !l.startsWith('✓') && !l.startsWith('TCA =') && !l.startsWith('CAPA ') && !l.startsWith('→') && l.trim() !== '')
                                            .join('\n')
                                        }
                                    </div>
                                </div>
                            )}

                            {/* GUION COMPLETO ELIMINADO — el teleprompter es el guion definitivo */}

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

                {/* ✅ CAMBIO 8 — BOTÓN REGENERAR CON JUEZ */}
                {auditResult?.veredicto_final?.score_total !== undefined && 
                 auditResult.veredicto_final.score_total < 75 && (
                    <div className="mt-6 pt-6 border-t border-pink-500/20 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                            <p className="text-xs text-yellow-400 mb-1 flex items-center gap-2 font-bold">
                                <AlertCircle size={14}/>
                                Score Bajo Detectado ({auditResult.veredicto_final.score_total}/100)
                            </p>
                            <p className="text-xs text-gray-400">
                                El Juez Viral detectó áreas de mejora críticas. ¿Deseas regenerar el guion aplicando automáticamente su análisis?
                            </p>
                        </div>
                        <button
                            onClick={async () => {
                                if (!auditResult || !topic) return;
                                
                                // Construir instrucciones de mejora desde el análisis del juez
                                const sugerencias = auditResult.optimizaciones_rapidas?.join('. ') || '';
                                const debilidades = auditResult.debilidades_criticas?.map(d => d.solucion).join('. ') || '';
                                const mejoras = [sugerencias, debilidades].filter(Boolean).join('. ');
                                
                                // Enriquecer el topic con las sugerencias
                                const topicEnriquecido = topic + (mejoras 
                                    ? `\n\n[INSTRUCCIONES DE MEJORA DEL JUEZ VIRAL]:\n${mejoras}` 
                                    : '');
                                
                                // Resetear estados
                                setTopic(topicEnriquecido);
                                setAuditResult(null);
                                setShowAudit(false);
                                setResult(null);
                                
                                // Regenerar después de que el estado se actualice
                                setTimeout(() => handleGenerate(), 100);
                            }}
                            disabled={isGenerating}
                            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="animate-spin" size={16}/>
                                    Regenerando con mejoras...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={16}/> 
                                    Regenerar Guion con Mejoras del Juez
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-500 text-center mt-2">
                            Esto consumirá {cost} créditos adicionales
                        </p>
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
                            
                                {result && (() => { if (!result.plan_audiovisual_profesional && result.guion_completo_data?.plan_audiovisual_profesional) { result.plan_audiovisual_profesional = result.guion_completo_data.plan_audiovisual_profesional; } return null; })()}
                                {result?.plan_audiovisual_profesional ? (
                                <div className="border-t border-gray-800 pt-6 mt-6">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                        <Video size={14}/> Plan Audiovisual Profesional
                                        <span className="text-[9px] font-black bg-violet-500 text-white px-2 py-0.5 rounded-full ml-1">V700</span>
                                    </label>

                                    {/* Secuencia Temporal */}
                                    {result.plan_audiovisual_profesional?.secuencia_temporal?.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">🎬 Secuencia Temporal</p>
                                            {result.plan_audiovisual_profesional?.secuencia_temporal.map((seg: any, idx: number) => (
                                                <div key={idx} className="flex gap-3 p-3 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:bg-gray-900 transition-colors">
                                                    <span className="text-xs font-black text-violet-400 w-14 text-right font-mono shrink-0">{seg.tiempo}</span>
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm text-white font-medium">{seg.descripcion_visual}</p>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {seg.tipo_plano && <span className="text-[10px] text-indigo-400 uppercase">🎥 {seg.tipo_plano}</span>}
                                                            {seg.movimiento_camara && <span className="text-[10px] text-cyan-400 uppercase">📷 {seg.movimiento_camara}</span>}
                                                            {seg.efecto_retencion && <span className="text-[10px] text-orange-400 uppercase">⚡ {seg.efecto_retencion}</span>}
                                                            {seg.texto_en_pantalla && <span className="text-[10px] text-yellow-400 uppercase">📝 {seg.texto_en_pantalla}</span>}
                                                            {seg.emocion_objetivo && <span className="text-[10px] text-pink-400 uppercase">💥 {seg.emocion_objetivo}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* B-Rolls Estratégicos */}
                                    {result.plan_audiovisual_profesional?.b_rolls_estrategicos?.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">🎞️ B-Rolls Estratégicos</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {result.plan_audiovisual_profesional?.b_rolls_estrategicos.map((br: any, idx: number) => (
                                                    <div key={idx} className="bg-green-950/20 border border-green-500/15 rounded-xl p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[9px] font-black text-green-400 uppercase">{br.momento}</span>
                                                            <span className="text-[9px] text-pink-400 font-bold">{br.emocion_generada}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-200 font-medium">{br.que_mostrar}</p>
                                                        <p className="text-[10px] text-gray-500 mt-1 italic">{br.por_que_refuerza}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ritmo + Música + Efectos en grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {/* Ritmo de Cortes */}
                                        {result.plan_audiovisual_profesional?.ritmo_de_cortes && (
                                            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3">
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">✂️ Ritmo de Cortes</p>
                                                <p className="text-sm font-black text-white">{result.plan_audiovisual_profesional.ritmo_de_cortes.patron_general}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{result.plan_audiovisual_profesional.ritmo_de_cortes.descripcion}</p>
                                                {result.plan_audiovisual_profesional.ritmo_de_cortes.aceleraciones && (
                                                    <p className="text-[10px] text-green-400 mt-1">↑ {result.plan_audiovisual_profesional.ritmo_de_cortes.aceleraciones}</p>
                                                )}
                                                {result.plan_audiovisual_profesional.ritmo_de_cortes.desaceleraciones && (
                                                    <p className="text-[10px] text-blue-400 mt-1">↓ {result.plan_audiovisual_profesional.ritmo_de_cortes.desaceleraciones}</p>
                                                )}
                                            </div>
                                        )}
                                        {/* Música */}
                                        {result.plan_audiovisual_profesional?.musica && (
                                            <div className="bg-pink-950/20 border border-pink-500/20 rounded-xl p-3">
                                                <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-2">🎵 Música</p>
                                                <p className="text-sm font-black text-white">{result.plan_audiovisual_profesional.musica.tipo}</p>
                                                {result.plan_audiovisual_profesional.musica.bpm_aproximado && (
                                                    <p className="text-[10px] text-pink-300 font-bold mt-1">{result.plan_audiovisual_profesional.musica.bpm_aproximado} BPM</p>
                                                )}
                                                <p className="text-[10px] text-gray-400 mt-1">{result.plan_audiovisual_profesional.musica.emocion_dominante}</p>
                                                {result.plan_audiovisual_profesional.musica.cambio_musical && (
                                                    <p className="text-[10px] text-yellow-400 mt-1">🔄 {result.plan_audiovisual_profesional.musica.cambio_musical}</p>
                                                )}
                                            </div>
                                        )}
                                        {/* Efectos de Retención */}
                                        {result.plan_audiovisual_profesional?.efectos_de_retencion && (
                                            <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-3">
                                                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">⚡ Retención</p>
                                                {result.plan_audiovisual_profesional.efectos_de_retencion.sonido_transicion && (
                                                    <p className="text-[10px] text-gray-300 mb-1">🔊 {result.plan_audiovisual_profesional.efectos_de_retencion.sonido_transicion}</p>
                                                )}
                                                {result.plan_audiovisual_profesional.efectos_de_retencion.micro_silencios && (
                                                    <p className="text-[10px] text-gray-300 mb-1">🤫 {result.plan_audiovisual_profesional.efectos_de_retencion.micro_silencios}</p>
                                                )}
                                                {result.plan_audiovisual_profesional.efectos_de_retencion.cambios_de_plano && (
                                                    <p className="text-[10px] text-gray-300 mb-1">🎬 {result.plan_audiovisual_profesional.efectos_de_retencion.cambios_de_plano}</p>
                                                )}
                                                {result.plan_audiovisual_profesional.efectos_de_retencion.micro_interrupciones && (
                                                    <p className="text-[10px] text-gray-300">✂️ {result.plan_audiovisual_profesional.efectos_de_retencion.micro_interrupciones}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : ((result.plan_produccion_visual || result.plan_visual) || []).length > 0 ? (
                                <div className="border-t border-gray-800 pt-6 mt-6">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Video size={14}/> Plan de Producción Visual
                                    </label>
                                    <div className="space-y-3">
                                        {((result.plan_produccion_visual || result.plan_visual) ?? []).map((scene: any, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 hover:bg-gray-900 transition-colors"
                                            >
                                                <span className="text-xs font-black text-gray-500 w-16 text-right font-mono shrink-0">
                                                    {scene.tiempo}
                                                </span>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm text-white font-medium">
                                                        {scene.descripcion_visual || scene.accion_en_pantalla}
                                                    </p>
                                                    <div className="flex gap-3 flex-wrap">
                                                        {(scene.tipo_plano || scene.instruccion_produccion) && (
                                                            <span className="text-[10px] text-indigo-400 uppercase tracking-wide">
                                                                🎥 {scene.tipo_plano || scene.instruccion_produccion}
                                                            </span>
                                                        )}
                                                        {scene.movimiento_camara && (
                                                            <span className="text-[10px] text-cyan-400 uppercase tracking-wide">
                                                                📷 {scene.movimiento_camara}
                                                            </span>
                                                        )}
                                                        {scene.b_roll_sugerido && (
                                                            <span className="text-[10px] text-green-400 uppercase tracking-wide">
                                                                🎬 {scene.b_roll_sugerido}
                                                            </span>
                                                        )}
                                                        {scene.efecto_retencion && (
                                                            <span className="text-[10px] text-orange-400 uppercase tracking-wide">
                                                                ⚡ {scene.efecto_retencion}
                                                            </span>
                                                        )}
                                                        {(scene.musica_recomendada || scene.audio) && (
                                                            <span className="text-[10px] text-pink-400 uppercase tracking-wide">
                                                                🎵 {scene.musica_recomendada || scene.audio}
                                                            </span>
                                                        )}
                                                        {(scene.texto_en_pantalla || scene.texto_pantalla) && (
                                                            <span className="text-[10px] text-yellow-400 uppercase tracking-wide">
                                                                📝 {scene.texto_en_pantalla || scene.texto_pantalla}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
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

        {mostrarFeedback && guionParaFeedback && (
            <TCAFeedbackWidget
                guionData={guionParaFeedback}
                onClose={() => setMostrarFeedback(false)}
            />
        )}
        </>
    );
};