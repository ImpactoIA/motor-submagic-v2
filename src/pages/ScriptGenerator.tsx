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
  Image as ImageIcon, UploadCloud, Sparkles, Shield, Mic2, BookOpen,
  Layers, Crosshair, ChevronDown, ChevronUp, Lock,
  Star, Hash
} from 'lucide-react';

// ==================================================================================
// 🎯 INTERFACES
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
    variantes_ab?: string[];
    plataforma_optimizada?: string;
    coherencia_con_hook?: boolean;
    razon_estrategica?: string;
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
    [key: string]: any;
  };
  estrategia_tca?: any;
  guion_completo_data?: any;
  [key: string]: any;
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

const TITAN_STRUCTURES = [
  {
    id: 'winner_rocket', label: '🚀 Winner Rocket (Oficial)', desc: 'La fórmula viral de 7 pasos. Retención máxima + Loops.',
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
    id: 'aida', label: '📢 AIDA (Clásica)', desc: 'Atención - Interés - Deseo - Acción.',
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
    id: 'pas', label: '💔 PAS (Dolor Profundo)', desc: 'Problema - Agitación - Solución.',
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
    id: 'storytelling', label: '🎥 Storytelling (HSO)', desc: 'Hook - Story - Offer. Conexión total.',
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
    id: 'viral_shock', label: '⚡ Viral Shock', desc: 'Polarización y ruptura de patrones.',
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
    id: 'autoridad', label: '🧲 Thought Leader', desc: 'Ideas de alto nivel. Estatus.',
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
    id: 'educativo', label: '📚 Educativo Avanzado', desc: 'Valor táctico y aplicable.',
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
    id: 'venta', label: '💰 Venta Estratégica', desc: 'Diseñado para facturar.',
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
    id: 'comunidad', label: '🎯 Leads & Comunidad', desc: 'Crecimiento de base de datos.',
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

const NARRATIVE_FORMATS = [
  { id: 'EDUCATIVO_AUTORIDAD', label: '📚 Educativo de Autoridad', desc: 'Tesis provocadora → Sistema nombrado → CTA de posicionamiento' },
  { id: 'STORYTELLING_EMOCIONAL', label: '🎭 Storytelling Emocional', desc: 'In media res → Giro narrativo → Aprendizaje encarnado' },
  { id: 'ANUNCIO_DIRECTO', label: '📢 Anuncio Directo', desc: 'Filtro de avatar → Dolor afilado → CTA único y claro' },
  { id: 'ANUNCIO_INDIRECTO', label: '🎣 Anuncio Indirecto', desc: 'Valor puro → Problema implícito → CTA suave' },
  { id: 'OPINION_POLARIZACION', label: '⚡ Opinión / Polarización', desc: 'Declaración divisiva → Argumento irrefutable → Posición inamovible' },
  { id: 'CASO_ESTUDIO', label: '📊 Caso de Estudio', desc: 'Resultado primero → Sistema aplicado → Principio replicable' },
  { id: 'TUTORIAL_PASO_A_PASO', label: '🔧 Tutorial Paso a Paso', desc: 'Promesa hiper-específica → 3 pasos con micro-aplicación' },
  { id: 'PODCAST_REFLEXIVO', label: '🎙️ Podcast Corto Reflexivo', desc: 'Pregunta íntima → Exploración honesta → Cierre abierto' },
  { id: 'MASTERCLASS_COMPRIMIDA', label: '🏛️ Masterclass Comprimida', desc: 'Mapa de 3 conceptos → Síntesis guardable → CTA de profundización' },
  { id: 'FRAME_DISRUPTIVO', label: '💥 Frame Disruptivo / Shock', desc: 'Afirmación imposible → Evidencia sólida → Reencuadre total' },
];

const AWARENESS_LEVELS = [
  "Totalmente Inconsciente",
  "Consciente del Problema",
  "Consciente de la Solución",
  "Consciente del Producto"
];

// NEW: Strategy loops replacing old objectives
const STRATEGY_LOOPS = [
  { id: 'magnetic_loop', label: '🧲 Magnetic Loop', desc: 'Atrae, seduce, retiene', color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
  { id: 'engagement_loop', label: '💬 Engagement Loop', desc: 'Comentarios, debates, shares', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'authority_loop', label: '👑 Authority Loop', desc: 'Posicionamiento experto', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
  { id: 'viral_loop', label: '🔥 Viral Loop', desc: 'Explosión orgánica masiva', color: 'border-red-500 bg-red-500/10 text-red-300' },
];

// NEW: Emotional vectors
const EMOTIONAL_VECTORS = [
  { id: 'dolor_profundo', label: '💔 Dolor Profundo', color: 'border-red-600 bg-red-900/20 text-red-300' },
  { id: 'deseo_ardiente', label: '🔥 Deseo Ardiente', color: 'border-orange-500 bg-orange-900/20 text-orange-300' },
  { id: 'miedo_temor', label: '😨 Miedo / Temor', color: 'border-purple-600 bg-purple-900/20 text-purple-300' },
  { id: 'objecion_oculta', label: '🛡️ Objeción Oculta', color: 'border-blue-500 bg-blue-900/20 text-blue-300' },
  { id: 'mito_industria', label: '💥 Mito de la Industria', color: 'border-cyan-500 bg-cyan-900/20 text-cyan-300' },
];

// NEW: Voice archetypes
const VOICE_ARCHETYPES = [
  { id: 'dominante_agresivo', label: '⚔️ Dominante / Agresivo', desc: 'Sin filtros, directo al hueso', color: 'border-red-500 bg-red-900/20 text-red-300' },
  { id: 'sabio_filosofico', label: '🦉 Sabio / Filosófico', desc: 'Profundo, reflexivo, eterno', color: 'border-indigo-500 bg-indigo-900/20 text-indigo-300' },
  { id: 'autoridad_empatica', label: '🤝 Autoridad Empática', desc: 'Experto que comprende tu dolor', color: 'border-emerald-500 bg-emerald-900/20 text-emerald-300' },
  { id: 'analitico_frio', label: '🧊 Analítico / Frío', desc: 'Datos, lógica, irrefutable', color: 'border-cyan-500 bg-cyan-900/20 text-cyan-300' },
  { id: 'revelador_confesional', label: '🤫 Revelador / Confesional', desc: 'Secretos que nadie dice', color: 'border-yellow-500 bg-yellow-900/20 text-yellow-300' },
];

const INTENSITY_MODES = [
  { id: 'conservador', label: '🕊️ Conservador', desc: 'Tono suave, sin polarizar', color: 'border-gray-500 bg-gray-500/10 text-gray-300' },
  { id: 'equilibrado', label: '⚖️ Equilibrado', desc: 'Balance impacto/accesibilidad', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'agresivo', label: '🔥 Agresivo', desc: 'Alta confrontación, máximo impacto', color: 'border-orange-500 bg-orange-500/10 text-orange-300' },
  { id: 'dominante', label: '👑 Dominante', desc: 'Autoridad absoluta, sin concesiones', color: 'border-red-500 bg-red-500/10 text-red-300' },
];

const CLOSING_OBJECTIVES = [
  { id: 'seguidores', label: '👥 Ganar Seguidores' },
  { id: 'leads', label: '📥 Captar Leads' },
  { id: 'venta', label: '💰 Vender' },
  { id: 'autoridad', label: '👑 Construir Autoridad' },
];

// ELITE TOP 5 HOOKS
const ELITE_HOOKS = [
  { id: 'enemigo_comun', label: '😡 El Enemigo Común', desc: 'Unifica a tu audiencia contra una amenaza' },
  { id: 'verdad_impopular', label: '🚫 La Verdad Impopular', desc: 'Di lo que nadie se atreve a decir' },
  { id: 'error_novato', label: '❌ El Error de Novato', desc: 'El fallo que todos cometen y tú solucionas' },
  { id: 'secreto_industria', label: '🤫 El Secreto de la Industria', desc: 'Lo que los expertos no quieren que sepas' },
  { id: 'promesa_contraintuitiva', label: '🔄 Promesa Contraintuitiva', desc: 'Haz lo opuesto y gana más' },
];

const MASTER_HOOKS = [
  '👁️ Frame Break (Ruptura Visual)', '🔮 Objeto Mágico', '📸 Antes y Después',
  '🏃‍♂️ En Movimiento', '👀 Sneak Peek (Vistazo)', '⚡ Chasquido',
  '🚫 Stop Scroll', '❌ Mito vs Verdad', '😡 Enemigo Común',
  '⛔ Gancho Negativo', '🤡 El Ridículo', '🤫 El Secreto',
  '❓ Pregunta Provocadora', '💸 Comparación de Precio', '3️⃣ Regla de 3',
  '📊 Dato Impactante', '💰 Ahorro', '👑 Autoridad Prestada',
  '🧠 Autoridad Experta', '🎯 Francotirador', '📖 Historia Personal',
  '🤝 Promesa Intrigante', '🆕 Novedad / Update', '☝️ La Única Cosa',
  '🛠️ Tutorial Rápido', '🎁 Regalo / Recurso', '🪞 Identidad', '🏆 Reto'
];

const DURATIONS = [
  { id: 'short', label: 'Flash', sublabel: '30s', cost: 5, words: '~75 palabras' },
  { id: 'medium', label: 'Estándar', sublabel: '60s', cost: 7, words: '~150 palabras' },
  { id: 'long', label: 'Profundo', sublabel: '90s', cost: 8, words: '~210 palabras' },
  { id: 'masterclass', label: 'Masterclass', sublabel: '+5m', cost: 30, words: '~900 palabras' },
];

const PLATFORMS = [
  { id: 'TikTok', icon: Video, label: 'TikTok', color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-900/20' },
  { id: 'Reels', icon: Instagram, label: 'Reels', color: 'text-pink-500', border: 'border-pink-500', bg: 'bg-pink-900/20' },
  { id: 'YouTube', icon: Youtube, label: 'YouTube', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-900/20' },
  { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-900/20' },
  { id: 'Facebook', icon: Globe, label: 'Facebook', color: 'text-blue-500', border: 'border-blue-400', bg: 'bg-blue-800/20' }
];

// ==================================================================================
// 🔧 HELPER COMPONENTS
// ==================================================================================

const StepBadge = ({ number, label, active }: { number: number; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-3 mb-5 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shrink-0 transition-all ${
      active
        ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-lg shadow-pink-500/30'
        : 'bg-gray-900 border-gray-700 text-gray-500'
    }`}>
      {number}
    </div>
    <span className={`text-xs font-black uppercase tracking-[0.15em] ${active ? 'text-white' : 'text-gray-600'}`}>
      {label}
    </span>
    <div className={`flex-1 h-px ${active ? 'bg-gradient-to-r from-pink-500/40 to-transparent' : 'bg-gray-800'}`} />
  </div>
);

const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#080B10] border border-white/[0.06] rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const ScriptGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, refreshProfile } = useAuth();

  // --- UI States ---
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [durationId, setDurationId] = useState('medium');

  // --- Image ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- Architecture ---
  const [selectedStructure, setSelectedStructure] = useState(TITAN_STRUCTURES[0]);
  const [selectedInternalMode, setSelectedInternalMode] = useState(TITAN_STRUCTURES[0].modes[0]);
  const [selectedNarrativeFormat, setSelectedNarrativeFormat] = useState('EDUCATIVO_AUTORIDAD');
  const [showStructureExpanded, setShowStructureExpanded] = useState(false);

  // --- Psychology (new) ---
  const [strategyLoop, setStrategyLoop] = useState('magnetic_loop');
  const [vectorEmocional, setVectorEmocional] = useState('dolor_profundo');
  const [arquetipoVoz, setArquetipoVoz] = useState('autoridad_empatica');
  const [awareness, setAwareness] = useState(AWARENESS_LEVELS[1]);
  const [situation, setSituation] = useState('Dolor Agudo (Urgencia)');

  // --- Intensity ---
  const [selectedIntensity, setSelectedIntensity] = useState('equilibrado');
  const [closingObjective, setClosingObjective] = useState('seguidores');

  // --- Hooks (new 3-tier system) ---
  const [hookMode, setHookMode] = useState<'elite' | 'custom' | 'arsenal'>('elite');
  const [eliteHookId, setEliteHookId] = useState('enemigo_comun');
  const [customHook, setCustomHook] = useState('');
  const [arsenalHook, setArsenalHook] = useState(MASTER_HOOKS[0]);

  // --- Cultural context ---
  const [culturalContext, setCulturalContext] = useState('');

  // --- Experts ---
  const [experts, setExperts] = useState<any[]>([]);
  const [selectedExpertId, setSelectedExpertId] = useState('');

  // --- Knowledge Base ---
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState('');

  // --- Cost ---
  const [cost, setCost] = useState(7);
  useEffect(() => {
    const selected = DURATIONS.find(d => d.id === durationId);
    if (selected) setCost(selected.cost);
  }, [durationId]);

  // --- Process ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Feedback ---
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [guionParaFeedback, setGuionParaFeedback] = useState<any>(null);

  // --- Audit ---
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showAudit, setShowAudit] = useState(false);

  // --- Save ---
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- Schedule Modal ---
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);

  // ==================================================================================
  // 🔄 EFFECTS
  // ==================================================================================

  useEffect(() => {
    if (!user) return;
    const loadExperts = async () => {
      const { data } = await supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id);
      if (data) setExperts(data);
    };
    const loadKnowledgeBases = async () => {
      const { data: kbData } = await supabase.from('documents').select('id, title').eq('user_id', user.id);
      if (kbData) setKnowledgeBases(kbData);
    };
    loadExperts();
    loadKnowledgeBases();

    if (location.state && location.state.fromIdeas) {
      if (location.state.topic) setTopic(location.state.topic);
      
      if (location.state.customHook) {
        setCustomHook(location.state.customHook);
        setHookMode('custom'); 
      }
      if (location.state.strategyLoop) setStrategyLoop(location.state.strategyLoop);
      if (location.state.vectorEmocional) setVectorEmocional(location.state.vectorEmocional);
      if (location.state.platform) {
        const plat = PLATFORMS.find(p => p.id === location.state.platform);
        if (plat) setSelectedPlatform(plat);
      }
      
      // ESTA ES LA MAGIA: Limpiamos el estado con 'null' para romper el bucle infinito
      navigate(location.pathname, { replace: true, state: null });
    }
  // ==================================================================================
  // 📷 IMAGE
  // ==================================================================================

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert("Imagen demasiado grande. Máximo 4MB."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => { setSelectedImage(null); setImagePreview(null); };

  // ==================================================================================
  // 🎯 HOOK RESOLVER
  // ==================================================================================

  const getActiveHookText = (): string => {
    if (hookMode === 'elite') {
      return ELITE_HOOKS.find(h => h.id === eliteHookId)?.label || eliteHookId;
    }
    if (hookMode === 'custom') return customHook || '';
    return arsenalHook;
  };

  // ==================================================================================
  // 🚀 GENERATE
  // ==================================================================================

  const handleGenerate = async () => {
    if (!topic.trim() && !selectedImage) {
      setError("Por favor escribe un tema o sube una imagen.");
      return;
    }

    if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
      const shouldRecharge = confirm(
        `⚠️ Saldo insuficiente. Necesitas ${cost} créditos pero tienes ${userProfile?.credits || 0}.\n\n¿Deseas recargar?`
      );
      if (shouldRecharge) navigate('/dashboard/settings');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setAuditResult(null);
    setShowAudit(false);
    setSaveSuccess(false);

    try {
      const settings = {
        structure: selectedStructure.id,
        internalMode: selectedInternalMode.id,
        narrativeFormat: selectedNarrativeFormat,
        platform: selectedPlatform.id,
        duration: durationId,
        hookType: getActiveHookText(),
        customHook: hookMode === 'custom' ? customHook : undefined,
        strategyLoop,
        vector_emocional: vectorEmocional,
        arquetipo_voz: arquetipoVoz,
        awareness,
        situation,
        intensity: selectedIntensity,
        closingObjective,
        culturalContext: culturalContext || undefined,
        expertId: selectedExpertId || undefined,
        avatarId: userProfile?.active_avatar_id || undefined,
        knowledgeBaseId: selectedKnowledgeBaseId || undefined,
        estimatedCost: cost,
      };

      const selectedMode = selectedImage ? 'script_generator_vision' : 'script_generator_standard';

      const { data, error: apiError } = await supabase.functions.invoke('process-url', {
        body: {
          selectedMode,
          text: topic,
          image: selectedImage || undefined,
          settings,
        }
      });

      if (apiError) throw new Error(apiError.message || 'Error al conectar con el backend');
      if (!data?.success && !data?.generatedData) throw new Error(data?.error || 'El backend devolvió un error desconocido');

      const finalResult = data.generatedData || data;
      if (!finalResult.guion_completo && !finalResult.teleprompter_script) {
        throw new Error('El backend no devolvió un guion. Intenta de nuevo.');
      }

      setResult(finalResult);
      setGuionParaFeedback(finalResult);
      setTimeout(() => setMostrarFeedback(true), 48 * 60 * 60 * 1000);

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
      alert("Error al guardar: " + e.message);
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
          objetivo: strategyLoop,
          formato: 'Video Corto',
          description: "Agendado desde Script Generator",
          guion_completo: result.guion_completo,
          metadata: result.metadata_guion
        }
      });
      if (error) throw error;
      alert(`✅ Guion agendado para el ${scheduleDate}`);
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
      if (!data?.success || !data?.generatedData) throw new Error(data?.error || 'Error en la auditoría');
      setAuditResult(data.generatedData);
      if (refreshProfile) await refreshProfile();
    } catch (e: any) {
      alert("Error en auditoría: " + e.message);
      setShowAudit(false);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyScript = () => {
    if (!result?.guion_completo) return;
    navigator.clipboard.writeText(result.guion_completo)
      .then(() => alert("✅ Guion copiado"))
      .catch(() => alert("❌ Error al copiar"));
  };

  // ==================================================================================
  // 🎨 RENDER
  // ==================================================================================

  return (
    <>
      {/* Global styles */}
      <style>{`
        .step-connector { background: linear-gradient(180deg, rgba(236,72,153,0.3) 0%, rgba(124,58,237,0.1) 100%); }
        .card-glow-pink { box-shadow: 0 0 40px -10px rgba(236,72,153,0.15); }
        .card-glow-purple { box-shadow: 0 0 40px -10px rgba(124,58,237,0.15); }
        .pill-active { background: linear-gradient(135deg, rgba(236,72,153,0.2), rgba(124,58,237,0.2)); }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .shimmer-btn { background-size: 200% auto; animation: shimmer 3s linear infinite; }
        .noise-bg::before { content:''; position:absolute; inset:0; opacity:0.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); pointer-events:none; border-radius:inherit; }
      `}</style>

      <div className="max-w-7xl mx-auto pb-24 font-sans text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ===== HEADER ===== */}
        <div className="relative px-4 pt-8 pb-6 mb-2">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20">
                  <Flame size={22} className="text-pink-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                    MOTOR VIRAL V700 ÉLITE
                  </h1>
                  <p className="text-gray-500 text-xs mt-0.5">Secuencia de Poder · 4 Pasos · Enterprise Grade</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#080B10] border border-white/[0.07] px-4 py-2.5 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500 font-medium">Créditos</span>
                <span className="text-lg font-black text-white">{userProfile?.credits || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 px-4">

          {/* ============================================================
              LEFT COLUMN — 4-STEP CONFIGURATION
          ============================================================ */}
          <div className="space-y-3">

            {/* ─── STEP 1: EL ORIGEN ─── */}
            <div>
              <StepBadge number={1} label="El Origen — Materia Prima" active />

              <SectionCard className="card-glow-pink noise-bg">
                {/* Platform selector */}
                <div className="flex gap-1.5 mb-4">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p)}
                      title={p.label}
                      className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-[10px] font-bold ${
                        selectedPlatform.id === p.id
                          ? `${p.bg} ${p.color} ${p.border} border shadow-md`
                          : 'bg-white/[0.03] border-white/[0.06] text-gray-600 hover:border-white/10 hover:text-gray-400'
                      }`}
                    >
                      <p.icon size={14} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Two-column: text + image */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Text input */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">
                      Tema / Idea
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={selectedImage
                        ? "Opcional: ¿Qué aspecto de la imagen te interesa?"
                        : "Ej: Por qué el 90% de emprendedores fracasan en su primer año..."}
                      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 text-white text-sm placeholder-gray-700 focus:border-pink-500/50 outline-none h-[120px] resize-none transition-all focus:bg-white/[0.05] focus:shadow-lg focus:shadow-pink-500/5"
                    />
                  </div>

                  {/* Image upload */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <ImageIcon size={10} /> Inspiración Visual
                      <span className="text-gray-700 normal-case tracking-normal font-normal">(opcional)</span>
                    </label>
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-white/[0.06] rounded-xl h-[120px] flex flex-col items-center justify-center hover:border-pink-500/30 transition-all cursor-pointer relative group bg-white/[0.01]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud size={20} className="text-gray-700 group-hover:text-pink-400 transition-colors mb-1.5" />
                        <span className="text-[10px] font-bold text-gray-700 group-hover:text-gray-400 transition-colors text-center px-3">
                          Sube una imagen<br />
                          <span className="text-gray-700 font-normal">La IA la analizará</span>
                        </span>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-pink-500/20 h-[120px] group">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                          <span className="text-[10px] font-black text-green-400 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Imagen cargada
                          </span>
                        </div>
                        <button
                          onClick={clearImage}
                          className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-500/80 text-white rounded-md transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cultural context */}
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <label className="text-[10px] font-black text-yellow-600/80 uppercase tracking-widest mb-1.5 block">
                    🔥 Tensión Cultural del Sector
                    <span className="text-gray-700 font-normal normal-case tracking-normal ml-1">— opcional</span>
                  </label>
                  <textarea
                    value={culturalContext}
                    onChange={e => setCulturalContext(e.target.value.slice(0, 300))}
                    placeholder="¿Qué está pasando esta semana en tu sector? Ej: Salió un reporte que dice..."
                    rows={2}
                    className="w-full bg-white/[0.03] border border-yellow-900/30 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-yellow-600/50 resize-none placeholder-gray-700"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[9px] ${culturalContext.length > 250 ? 'text-yellow-500' : 'text-gray-700'}`}>
                      {culturalContext.length}/300
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── STEP 2: ARQUITECTURA Y AUTORIDAD ─── */}
            <div>
              <StepBadge number={2} label="Arquitectura y Autoridad" active />

              <SectionCard>
                {/* Narrative Format */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Layers size={11} /> Formato Narrativo</span>
                    <span className="text-[8px] font-black bg-violet-500 text-white px-1.5 py-0.5 rounded-full">V700</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {NARRATIVE_FORMATS.map(fmt => (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedNarrativeFormat(fmt.id)}
                        className={`p-2 rounded-xl border text-left transition-all group ${
                          selectedNarrativeFormat === fmt.id
                            ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:border-white/10 hover:text-gray-400'
                        }`}
                      >
                        <span className="text-[10px] font-black block leading-tight">{fmt.label}</span>
                        <span className="text-[8px] opacity-60 leading-tight block mt-0.5">{fmt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arquitectura */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Layout size={11} /> Arquitectura Base
                    </label>
                    <button
                      onClick={() => setShowStructureExpanded(!showStructureExpanded)}
                      className="text-[9px] text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors"
                    >
                      {showStructureExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {showStructureExpanded ? 'Colapsar' : 'Ver todas'}
                    </button>
                  </div>

                  {/* Selected structure display */}
                  <div
                    className={`p-3 rounded-xl border mb-2 cursor-pointer transition-all ${selectedStructure.color}`}
                    onClick={() => setShowStructureExpanded(!showStructureExpanded)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{selectedStructure.label}</span>
                      <CheckCircle2 size={14} />
                    </div>
                    <p className="text-[10px] opacity-70 mt-0.5">{selectedStructure.desc}</p>
                  </div>

                  {showStructureExpanded && (
                    <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin pr-1">
                      {TITAN_STRUCTURES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedStructure(s); setSelectedInternalMode(s.modes[0]); setShowStructureExpanded(false); }}
                          className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                            selectedStructure.id === s.id ? s.color : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs">{s.label}</span>
                            {selectedStructure.id === s.id && <CheckCircle2 size={12} />}
                          </div>
                          <p className="text-[9px] opacity-60 mt-0.5">{s.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Internal mode */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Target size={11} /> Modo Estratégico
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedStructure.modes.map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedInternalMode(mode)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          selectedInternalMode.id === mode.id
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:border-white/10 hover:text-gray-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold block">{mode.label}</span>
                        <span className="text-[8px] opacity-60 mt-0.5 block leading-tight">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategic assets */}
                <div className="pt-3 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <User size={9} /> Experto
                    </label>
                    <select
                      value={selectedExpertId}
                      onChange={(e) => setSelectedExpertId(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs rounded-lg p-2 outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      <option value="">Sin experto</option>
                      {experts.map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.niche})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <BookOpen size={9} /> Duración
                    </label>
                    <select
                      value={durationId}
                      onChange={e => setDurationId(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs rounded-lg p-2 outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      {DURATIONS.map(d => (
                        <option key={d.id} value={d.id}>{d.label} ({d.sublabel}) — {d.cost}CR</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <BookOpen size={9} /> Base de Conocimiento
                    </label>
                    <select
                      value={selectedKnowledgeBaseId}
                      onChange={(e) => setSelectedKnowledgeBaseId(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs rounded-lg p-2 outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      <option value="">Sin base de conocimiento</option>
                      {knowledgeBases.map(kb => (
                        <option key={kb.id} value={kb.id}>{kb.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Closing objective */}
                <div className="mt-3">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 block">Objetivo del Cierre (CTA)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {CLOSING_OBJECTIVES.map(obj => (
                      <button
                        key={obj.id}
                        onClick={() => setClosingObjective(obj.id)}
                        className={`p-2 rounded-lg border text-center text-[10px] font-bold transition-all leading-tight ${
                          closingObjective === obj.id
                            ? 'bg-pink-600/20 border-pink-500/50 text-pink-300'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        {obj.label}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── STEP 3: INGENIERÍA PSICOLÓGICA ─── */}
            <div>
              <StepBadge number={3} label="Ingeniería Psicológica" active />

              <SectionCard className="card-glow-purple">
                {/* Strategy Loop */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Crosshair size={11} /> Estrategia Dominante
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {STRATEGY_LOOPS.map(loop => (
                      <button
                        key={loop.id}
                        onClick={() => setStrategyLoop(loop.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          strategyLoop === loop.id
                            ? loop.color + ' ring-1 ring-current/50'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:border-white/10 hover:text-gray-400'
                        }`}
                      >
                        <span className="text-xs font-black block">{loop.label}</span>
                        <span className="text-[9px] opacity-70 block mt-0.5">{loop.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vector Emocional */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap size={11} /> Vector Emocional
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONAL_VECTORS.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setVectorEmocional(v.id)}
                        className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                          vectorEmocional === v.id
                            ? v.color + ' ring-1 ring-current/40'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:border-white/10'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arquetipo de Voz */}
                <div className="mb-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Mic2 size={11} /> Arquetipo de Voz
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {VOICE_ARCHETYPES.map(arch => (
                      <button
                        key={arch.id}
                        onClick={() => setArquetipoVoz(arch.id)}
                        className={`px-3 py-2 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          arquetipoVoz === arch.id
                            ? arch.color + ' ring-1 ring-current/40'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-600 hover:border-white/10 hover:text-gray-400'
                        }`}
                      >
                        <span className="text-xs font-black whitespace-nowrap">{arch.label}</span>
                        <span className="text-[9px] opacity-60 leading-tight">{arch.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Awareness + Intensity */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.04]">
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 block">Nivel de Consciencia</label>
                    <select
                      value={awareness}
                      onChange={(e) => setAwareness(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs rounded-lg p-2 outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      {AWARENESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Flame size={9} /> Intensidad
                    </label>
                    <select
                      value={selectedIntensity}
                      onChange={e => setSelectedIntensity(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-gray-400 text-xs rounded-lg p-2 outline-none focus:border-orange-500/50 appearance-none"
                    >
                      {INTENSITY_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── STEP 4: EL DETONADOR ─── */}
            <div>
              <StepBadge number={4} label="El Detonador — Ganchos Virales" active />

              <SectionCard className="card-glow-pink">
                {/* Hook mode tabs */}
                <div className="flex gap-1 mb-4 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                  {[
                    { id: 'elite', label: '⭐ Top 5 Élite' },
                    { id: 'custom', label: '🔬 Gancho Clonado' },
                    { id: 'arsenal', label: '🗡️ Arsenal Completo' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setHookMode(tab.id as any)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${
                        hookMode === tab.id
                          ? 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 text-white border border-pink-500/30 shadow-md'
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Elite hooks */}
                {hookMode === 'elite' && (
                  <div className="space-y-1.5">
                    {ELITE_HOOKS.map(hook => (
                      <button
                        key={hook.id}
                        onClick={() => setEliteHookId(hook.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all group ${
                          eliteHookId === hook.id
                            ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500/40 text-white shadow-lg shadow-pink-500/10'
                            : 'bg-white/[0.02] border-white/[0.05] text-gray-500 hover:border-white/10 hover:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black">{hook.label}</span>
                          {eliteHookId === hook.id && (
                            <span className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
                              <CheckCircle2 size={10} className="text-white" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] opacity-60 mt-0.5">{hook.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom hook clone */}
                {hookMode === 'custom' && (
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-1.5">
                      <Hash size={10} /> Gancho a Clonar
                    </label>
                    <textarea
                      value={customHook}
                      onChange={e => setCustomHook(e.target.value)}
                      placeholder="¿Viste un gancho viral que funcionó? Pégalo aquí y la IA modelará su estructura para tu contenido..."
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/[0.07] text-white text-sm placeholder-gray-700 rounded-xl p-3 outline-none focus:border-pink-500/50 resize-none transition-all"
                    />
                    <p className="text-[9px] text-gray-700 mt-1.5 italic">
                      💡 El Motor V700 analizará la estructura psicológica y la replicará adaptada a tu tema
                    </p>
                  </div>
                )}

                {/* Full arsenal dropdown */}
                {hookMode === 'arsenal' && (
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                      Arsenal Completo (28 Ganchos)
                    </label>
                    <select
                      value={arsenalHook}
                      onChange={e => setArsenalHook(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.07] text-gray-300 text-sm rounded-xl p-3 outline-none focus:border-pink-500/50 appearance-none"
                      size={6}
                    >
                      {MASTER_HOOKS.map((h, i) => (
                        <option key={i} value={h}>{h}</option>
                      ))}
                    </select>
                    {arsenalHook && (
                      <div className="mt-2 px-3 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                        <span className="text-[10px] text-pink-400 font-bold">Seleccionado: </span>
                        <span className="text-[10px] text-gray-300">{arsenalHook}</span>
                      </div>
                    )}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ─── GENERATE BUTTON ─── */}
            <div className="sticky bottom-4 z-20">
              <button
                onClick={handleGenerate}
                disabled={(!topic.trim() && !selectedImage) || isGenerating}
                className={`w-full py-4 rounded-2xl font-black text-base flex justify-center items-center gap-3 transition-all shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group ${
                  isGenerating
                    ? 'bg-gray-900 border border-gray-700 text-gray-400'
                    : 'text-white'
                }`}
                style={!isGenerating ? {
                  background: 'linear-gradient(135deg, #e91e8c 0%, #7c3aed 50%, #e91e8c 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                  boxShadow: '0 8px 32px -4px rgba(233,30,140,0.4)'
                } : {}}
              >
                {!isGenerating && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10" />
                )}
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    <span>MOTOR V700 PROCESANDO...</span>
                  </>
                ) : (
                  <>
                    <Flame size={20} className="group-hover:scale-110 transition-transform" />
                    <span>GENERAR GUION VIRAL</span>
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-sm font-black">
                      {cost} CR
                    </span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN — RESULTS
          ============================================================ */}
          <div>
            {result ? (
              <div
                className="bg-[#060810] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl"
                style={{ boxShadow: '0 0 80px -20px rgba(124,58,237,0.2)' }}
              >
                {/* Result header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.05] bg-gradient-to-r from-pink-900/10 to-purple-900/10">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                          <CheckCircle2 size={9} /> Completado
                        </span>
                        {result.metadata_guion?.plataforma && (
                          <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            📱 {result.metadata_guion.plataforma}
                          </span>
                        )}
                        {result.metadata_guion?.objetivo_viral && (
                          <span className="text-[9px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                            🎯 {result.metadata_guion.objetivo_viral}
                          </span>
                        )}
                        {result.metadata_guion?.formato_narrativo_activo && (
                          <span className="text-[9px] font-black text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                            🎭 {result.metadata_guion.formato_narrativo_activo}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-black text-white leading-snug">
                        {result.metadata_guion?.tema_tratado || topic}
                      </h2>
                      {result.metadata_guion?.percepcion_creador && (
                        <p className="text-xs text-indigo-400 mt-1 italic">
                          💡 "{result.metadata_guion.percepcion_creador}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20"
                      >
                        <CalendarIcon size={14} /> Agendar
                      </button>
                      <button
                        onClick={handleAuditScript}
                        disabled={isAuditing}
                        className="px-3 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-pink-500/20"
                      >
                        {isAuditing ? <RefreshCw className="animate-spin" size={14} /> : <Gavel size={14} />}
                        {isAuditing ? 'Auditando...' : 'Auditar'}
                      </button>
                      <button onClick={handleCopyScript} className="p-2 bg-white/[0.05] rounded-lg hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all" title="Copiar">
                        <Copy size={16} />
                      </button>
                      <button onClick={handleSaveLibrary} disabled={isSaving} className="p-2 bg-white/[0.05] rounded-lg hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all disabled:opacity-40" title="Guardar">
                        {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                      </button>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="mt-3 bg-green-500/10 border border-green-500/20 p-2.5 rounded-xl text-green-400 text-xs flex items-center gap-2">
                      <CheckCircle2 size={12} /> Guardado en biblioteca
                    </div>
                  )}
                </div>

                {/* Result body - scrollable */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">

                  {/* Umbral Dominancia */}
                  {result.score_predictivo?.umbral_dominancia_superado !== undefined && (
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${
                      result.score_predictivo.umbral_dominancia_superado
                        ? 'bg-green-900/10 border-green-500/20'
                        : 'bg-red-900/10 border-red-500/20'
                    }`}>
                      <span className="text-2xl">{result.score_predictivo.umbral_dominancia_superado ? '✅' : '🔴'}</span>
                      <div className="flex-1">
                        <p className={`font-black text-sm ${result.score_predictivo.umbral_dominancia_superado ? 'text-green-400' : 'text-red-400'}`}>
                          {result.score_predictivo.umbral_dominancia_superado ? 'UMBRAL DE DOMINANCIA SUPERADO' : 'UMBRAL NO ALCANZADO'}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          viral_index: <strong className="text-white">{result.score_predictivo.viral_index}</strong> / mínimo: 85
                        </p>
                      </div>
                      <span className={`text-3xl font-black ${result.score_predictivo.viral_index >= 85 ? 'text-green-400' : 'text-red-400'}`}>
                        {result.score_predictivo.viral_index}
                      </span>
                    </div>
                  )}

                  {/* Score predictivo cualitativo */}
                  {result.score_predictivo?.metricas_cualitativas && (
                    <div className="bg-purple-900/10 border border-purple-500/15 rounded-2xl p-5">
                      <h3 className="text-xs font-black text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                        <Brain size={14} /> Impacto Estratégico
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'nivel_de_disrupcion', label: '⚡ Disrupción', color: '#f59e0b' },
                          { key: 'nivel_de_memorabilidad', label: '🧠 Memorabilidad', color: '#06b6d4' },
                          { key: 'nivel_de_polarizacion', label: '🔥 Polarización', color: '#ef4444' },
                          { key: 'nivel_de_control_de_frame', label: '🎯 Control de Frame', color: '#8b5cf6' },
                          { key: 'nivel_de_diferenciacion_competitiva', label: '⚔️ Diferenciación', color: '#22c55e' },
                        ].map(({ key, label, color }) => {
                          const value = (result.score_predictivo!.metricas_cualitativas as any)[key] as number;
                          return (
                            <div key={key}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-400">{label}</span>
                                <span className="text-xs font-bold" style={{ color: value < 70 ? '#ef4444' : color }}>
                                  {value}/100{value < 70 ? ' ⚠️' : ''}
                                </span>
                              </div>
                              <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full transition-all duration-700"
                                  style={{ width: `${value}%`, backgroundColor: value < 70 ? '#ef4444' : color }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Auto validación */}
                  {result.auto_validacion && (
                    <div className={`border rounded-2xl p-4 ${
                      result.auto_validacion.decision === 'APROBAR'
                        ? 'bg-green-900/8 border-green-500/20'
                        : 'bg-red-900/8 border-red-500/20'
                    }`}>
                      <h3 className={`text-xs font-black mb-3 flex items-center gap-2 uppercase tracking-widest ${
                        result.auto_validacion.decision === 'APROBAR' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.auto_validacion.decision === 'APROBAR' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        Auto-Validación: {result.auto_validacion.decision}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-[10px]">
                        {[
                          { key: 'hace_sentir_inspirado', label: 'Inspirador' },
                          { key: 'suena_distinto', label: 'Único' },
                          { key: 'podria_molestar', label: 'Polémico' },
                          { key: 'sera_recordado', label: 'Memorable' },
                        ].map(({ key, label }) => {
                          const val = (result.auto_validacion as any)[key];
                          return (
                            <div key={key} className={`p-2 rounded-lg ${val ? 'bg-green-500/10' : 'bg-gray-800/50'}`}>
                              <span className={val ? 'text-green-400' : 'text-gray-600'}>
                                {val ? '✅' : '❌'} {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {result.auto_validacion.razon && (
                        <p className="text-xs text-gray-500 mt-3 italic">💭 {result.auto_validacion.razon}</p>
                      )}
                    </div>
                  )}

                  {/* Análisis viral */}
                  {result.analisis_viral && (
                    <div className="bg-purple-900/8 border border-purple-500/15 rounded-2xl p-5">
                      <h3 className="text-xs font-black text-purple-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <TrendingUp size={14} /> Análisis Viral
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {result.analisis_viral.score_viralidad_predicho && (
                          <div className="bg-black/30 p-3 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-gray-500 uppercase font-bold">Score Viral</span>
                              <span className="text-xl font-black text-purple-400">{result.analisis_viral.score_viralidad_predicho}<span className="text-sm text-gray-600">/100</span></span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style={{ width: `${result.analisis_viral.score_viralidad_predicho}%` }} />
                            </div>
                          </div>
                        )}
                        <div className="bg-black/30 p-3 rounded-xl">
                          <span className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Loops</span>
                          <div className="flex gap-3">
                            <div className="text-center">
                              <p className="text-lg font-black text-green-400">{result.analisis_viral.loops_abiertos?.length || 0}</p>
                              <p className="text-[9px] text-gray-600">Abiertos</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-black text-blue-400">{result.analisis_viral.loops_cerrados?.length || 0}</p>
                              <p className="text-[9px] text-gray-600">Cerrados</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {result.analisis_viral.trigger_comentarios && (
                        <div className="bg-pink-500/8 border border-pink-500/15 p-3 rounded-xl">
                          <span className="text-[9px] font-black text-pink-400 uppercase block mb-1">💬 Trigger de Comentarios</span>
                          <p className="text-xs text-gray-300 italic">"{result.analisis_viral.trigger_comentarios}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dominio narrativo */}
                  {result.dominio_narrativo && (
                    <div className="bg-indigo-950/20 border border-indigo-500/15 rounded-2xl p-5">
                      <h3 className="text-xs font-black text-indigo-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                        🏛️ Arquitectura Estratégica
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'marco_impuesto', label: '🖼️ Marco', color: 'border-indigo-500/15' },
                          { key: 'enemigo_identificado', label: '⚔️ Enemigo', color: 'border-red-500/15' },
                          { key: 'creencia_atacada', label: '💥 Creencia Atacada', color: 'border-orange-500/15' },
                          { key: 'nuevo_frame_propuesto', label: '✨ Nuevo Frame', color: 'border-green-500/15' },
                        ].map(({ key, label, color }) => {
                          const val = (result.dominio_narrativo as any)[key];
                          if (!val) return null;
                          return (
                            <div key={key} className={`bg-black/30 rounded-xl p-3 border ${color}`}>
                              <span className="text-[9px] font-black text-gray-500 uppercase block mb-1">{label}</span>
                              <p className="text-xs text-gray-200">{val}</p>
                            </div>
                          );
                        })}
                      </div>
                      {result.dominio_narrativo.postura_dominante && (
                        <div className="mt-2 bg-black/30 rounded-xl p-3 border border-purple-500/15">
                          <span className="text-[9px] font-black text-purple-400 uppercase block mb-1">🎯 Postura Dominante</span>
                          <p className="text-xs text-gray-200">{result.dominio_narrativo.postura_dominante}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Frase de oro */}
                  {result.poder_del_guion?.frase_de_oro && (
                    <div className="bg-gradient-to-r from-yellow-500/8 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Star size={10} /> Frase de Oro
                        </span>
                        <button
                          onClick={(e) => {
                            navigator.clipboard.writeText(result.poder_del_guion!.frase_de_oro!);
                            const btn = e.currentTarget;
                            btn.textContent = '✅ Copiada';
                            setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000);
                          }}
                          className="text-[9px] font-black text-yellow-500/60 hover:text-yellow-400 bg-yellow-500/8 border border-yellow-500/15 px-2 py-1 rounded-lg transition-colors"
                        >
                          📋 Copiar
                        </button>
                      </div>
                      <p className="text-white font-black text-xl leading-tight">"{result.poder_del_guion.frase_de_oro}"</p>
                    </div>
                  )}

                  {/* Micro-loops */}
                  {result.micro_loops_detectados && result.micro_loops_detectados.length > 0 && (
                    <div className="bg-blue-900/8 border border-blue-500/15 rounded-2xl p-4">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 block">
                        🔁 Micro-loops ({result.micro_loops_detectados.length})
                      </span>
                      <div className="space-y-2">
                        {result.micro_loops_detectados.map((loop: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 bg-black/20 rounded-lg p-2.5">
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

                  {/* Activadores psicológicos */}
                  {result.activadores_psicologicos && result.activadores_psicologicos.length > 0 && (
                    <div className="bg-purple-900/8 border border-purple-500/15 rounded-2xl p-4">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 block">🧠 Activadores Psicológicos</span>
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

                  {/* 5 Hooks TCA */}
                  {result.ganchos_opcionales && result.ganchos_opcionales.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Zap size={12} /> 5 Hooks TCA
                        </label>
                        <span className="text-[9px] font-black bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-0.5 rounded-full">V700</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {result.ganchos_opcionales.map((hook: any, idx: number) => {
                          const hookMeta: Record<string, any> = {
                            CONTROVERSIAL: { border: 'border-red-500/30', bg: 'bg-red-950/20', label: 'text-red-400', badge: 'bg-red-500/15 text-red-400', emoji: '🔥' },
                            EMOCIONAL: { border: 'border-pink-500/30', bg: 'bg-pink-950/20', label: 'text-pink-400', badge: 'bg-pink-500/15 text-pink-400', emoji: '💔' },
                            CURIOSIDAD: { border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', label: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-400', emoji: '🧠' },
                            AUTORIDAD: { border: 'border-yellow-500/30', bg: 'bg-yellow-950/20', label: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-400', emoji: '👑' },
                            POLARIZACION: { border: 'border-purple-500/30', bg: 'bg-purple-950/20', label: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-400', emoji: '⚡' },
                          };
                          const meta = hookMeta[hook.tipo] || { border: 'border-gray-700', bg: 'bg-gray-900/20', label: 'text-indigo-400', badge: 'bg-indigo-500/10 text-indigo-400', emoji: '🎯' };
                          return (
                            <div key={idx} className={`${meta.bg} ${meta.border} border rounded-2xl p-3 flex flex-col gap-2`}>
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${meta.badge}`}>{meta.emoji} {hook.tipo}</span>
                                <span className="text-[9px] font-black text-green-400">{hook.retencion_predicha}%</span>
                              </div>
                              <p className={`text-xs font-bold leading-snug ${meta.label}`}>"{hook.texto}"</p>
                              {hook.mecanismo && (
                                <span className="text-[9px] text-gray-500 bg-black/30 px-2 py-1 rounded-lg leading-tight block">⚙️ {hook.mecanismo}</span>
                              )}
                              <button
                                onClick={(e) => {
                                  navigator.clipboard.writeText(hook.texto || '');
                                  const btn = e.currentTarget;
                                  btn.textContent = '✅ Copiado';
                                  setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000);
                                }}
                                className={`text-[9px] font-black uppercase ${meta.label} opacity-50 hover:opacity-100 transition-opacity mt-auto`}
                              >
                                📋 Copiar
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Miniatura dominante */}
                  {(result.miniatura_dominante || result.guion_completo_data?.miniatura_dominante) && (() => {
                    const min = result.miniatura_dominante || result.guion_completo_data?.miniatura_dominante;
                    return (
                      <div className="rounded-2xl overflow-hidden border border-yellow-500/20" style={{ background: 'linear-gradient(135deg, rgba(15,10,0,0.98) 0%, rgba(25,18,0,0.98) 100%)' }}>
                        <div className="px-5 py-3 border-b border-yellow-500/15 flex items-center justify-between">
                          <span className="text-xs font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">🖼️ Frase Miniatura</span>
                          {min?.plataforma_optimizada && <span className="text-[9px] font-bold text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded-full">{min.plataforma_optimizada}</span>}
                        </div>
                        <div className="p-5 space-y-4">
                          <div className="text-center py-4 px-6 bg-black/50 rounded-xl border border-yellow-400/15">
                            <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest mb-2">Frase Principal</p>
                            <p className="text-2xl font-black text-white leading-tight">"{min?.frase_principal}"</p>
                          </div>
                          {(min?.variante_agresiva || min?.variante_aspiracional) ? (
                            <div className="grid grid-cols-2 gap-2">
                              {min?.variante_agresiva && (
                                <div className="bg-black/40 rounded-xl p-3 border border-red-500/15 text-center">
                                  <span className="text-[9px] font-black text-red-400 uppercase block mb-1">⚡ Agresiva</span>
                                  <p className="text-sm font-black text-gray-200">"{min.variante_agresiva}"</p>
                                </div>
                              )}
                              {min?.variante_aspiracional && (
                                <div className="bg-black/40 rounded-xl p-3 border border-emerald-500/15 text-center">
                                  <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">✨ Aspiracional</span>
                                  <p className="text-sm font-black text-gray-200">"{min.variante_aspiracional}"</p>
                                </div>
                              )}
                            </div>
                          ) : min?.variantes_ab && min.variantes_ab.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {min.variantes_ab.map((v: string, i: number) => (
                                <div key={i} className="bg-black/40 rounded-xl p-3 border border-yellow-500/10 text-center">
                                  <span className="text-[9px] font-black text-yellow-600 uppercase block mb-1">{i === 0 ? '⚡ Agresiva' : '✨ Aspiracional'}</span>
                                  <p className="text-sm font-black text-gray-200">"{v}"</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="grid grid-cols-5 gap-1.5">
                            {[
                              { label: 'CTR', value: min?.ctr_score, color: '#facc15' },
                              { label: 'Disrupción', value: min?.nivel_disrupcion, color: '#f87171' },
                              { label: 'Gap Curiosidad', value: min?.nivel_gap_curiosidad, color: '#60a5fa' },
                              { label: 'Polarización', value: min?.nivel_polarizacion, color: '#f472b6' },
                              { label: 'Algoritmo', value: min?.compatibilidad_algoritmica, color: '#34d399' },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="bg-black/40 rounded-xl p-2 text-center border border-white/[0.04]">
                                <p className="text-[8px] text-gray-600 uppercase mb-1">{label}</p>
                                <p className="text-base font-black" style={{ color }}>{value}</p>
                              </div>
                            ))}
                          </div>
                          {(min?.razon_estrategica || min?.justificacion_estrategica) && (
                            <p className="text-xs text-gray-600 italic border-t border-yellow-500/10 pt-3">
                              💭 {min?.justificacion_estrategica || min?.razon_estrategica}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Teleprompter */}
                  {result.teleprompter_script && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                          <AlignLeft size={12} /> 🎤 Teleprompter TCA
                        </label>
                        <button
                          onClick={() => {
                            const clean = (result.teleprompter_script || '')
                              .split('\n')
                              .filter((l: string) => !l.startsWith('[CAPA') && !l.startsWith('⚠️') && !l.startsWith('━') && !l.startsWith('REGLA') && !l.startsWith('✓') && !l.startsWith('TCA =') && !l.startsWith('CAPA ') && !l.startsWith('→') && l.trim() !== '')
                              .join('\n');
                            navigator.clipboard.writeText(clean).then(() => {
                              const btn = document.getElementById('btn-copy-tp');
                              if (btn) { btn.textContent = '✅ Copiado'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000); }
                            });
                          }}
                          id="btn-copy-tp"
                          className="text-[10px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors flex items-center gap-1"
                        >
                          <Copy size={10} /> Copiar
                        </button>
                      </div>
                      <div className="bg-black/80 p-8 rounded-2xl border border-green-500/15 text-green-100 text-xl leading-relaxed font-medium whitespace-pre-wrap shadow-inner max-h-[500px] overflow-y-auto scrollbar-thin font-mono">
                        {(result.teleprompter_script || '')
                          .split('\n')
                          .filter((l: string) => !l.startsWith('[CAPA') && !l.startsWith('⚠️') && !l.startsWith('━') && !l.startsWith('REGLA') && !l.startsWith('✓') && !l.startsWith('TCA =') && !l.startsWith('CAPA ') && !l.startsWith('→') && l.trim() !== '')
                          .join('\n')
                        }
                      </div>
                    </div>
                  )}

                  {/* Anti-saturation report */}
                  {(result as any)._anti_saturation_report?.guion_fue_reescrito && (
                    <div className="bg-yellow-900/10 border border-yellow-500/15 rounded-xl p-4">
                      <h3 className="text-xs font-black text-yellow-400 mb-2 flex items-center gap-2">🧹 Anti-Saturación — Clichés Eliminados</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(result as any)._anti_saturation_report.cliches_detectados.map((c: string, i: number) => (
                          <span key={i} className="text-[10px] bg-yellow-500/10 text-yellow-300 px-2 py-0.5 rounded line-through">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plan audiovisual V700 */}
                  {(() => {
                    if (!result.plan_audiovisual_profesional && result.guion_completo_data?.plan_audiovisual_profesional) {
                      result.plan_audiovisual_profesional = result.guion_completo_data.plan_audiovisual_profesional;
                    }
                    return null;
                  })()}

                  {result?.plan_audiovisual_profesional ? (
                    <div className="border-t border-white/[0.04] pt-5">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Video size={12} /> Plan Audiovisual Profesional
                        <span className="text-[9px] font-black bg-violet-500 text-white px-1.5 py-0.5 rounded-full">V700</span>
                      </label>
                      {result.plan_audiovisual_profesional?.secuencia_temporal?.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">🎬 Secuencia</p>
                          {result.plan_audiovisual_profesional.secuencia_temporal.map((seg: any, idx: number) => (
                            <div key={idx} className="flex gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                              <span className="text-xs font-black text-violet-400 w-14 text-right font-mono shrink-0">{seg.tiempo}</span>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm text-white font-medium">{seg.descripcion_visual}</p>
                                <div className="flex gap-2 flex-wrap">
                                  {seg.tipo_plano && <span className="text-[9px] text-indigo-400">🎥 {seg.tipo_plano}</span>}
                                  {seg.efecto_retencion && <span className="text-[9px] text-orange-400">⚡ {seg.efecto_retencion}</span>}
                                  {seg.emocion_objetivo && <span className="text-[9px] text-pink-400">💥 {seg.emocion_objetivo}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-3">
                        {result.plan_audiovisual_profesional?.ritmo_de_cortes && (
                          <div className="bg-indigo-950/20 border border-indigo-500/15 rounded-xl p-3">
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">✂️ Ritmo</p>
                            <p className="text-sm font-black text-white">{result.plan_audiovisual_profesional.ritmo_de_cortes.patron_general}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{result.plan_audiovisual_profesional.ritmo_de_cortes.descripcion}</p>
                          </div>
                        )}
                        {result.plan_audiovisual_profesional?.musica && (
                          <div className="bg-pink-950/20 border border-pink-500/15 rounded-xl p-3">
                            <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-2">🎵 Música</p>
                            <p className="text-sm font-black text-white">{result.plan_audiovisual_profesional.musica.tipo}</p>
                            {result.plan_audiovisual_profesional.musica.bpm_aproximado && (
                              <p className="text-[10px] text-pink-300 font-bold mt-1">{result.plan_audiovisual_profesional.musica.bpm_aproximado} BPM</p>
                            )}
                          </div>
                        )}
                        {result.plan_audiovisual_profesional?.efectos_de_retencion && (
                          <div className="bg-orange-950/20 border border-orange-500/15 rounded-xl p-3">
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">⚡ Retención</p>
                            {result.plan_audiovisual_profesional.efectos_de_retencion.sonido_transicion && (
                              <p className="text-[10px] text-gray-400 mb-1">🔊 {result.plan_audiovisual_profesional.efectos_de_retencion.sonido_transicion}</p>
                            )}
                            {result.plan_audiovisual_profesional.efectos_de_retencion.micro_silencios && (
                              <p className="text-[10px] text-gray-400">🤫 {result.plan_audiovisual_profesional.efectos_de_retencion.micro_silencios}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : ((result.plan_produccion_visual || result.plan_visual) || []).length > 0 ? (
                    <div className="border-t border-white/[0.04] pt-5">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Video size={12} /> Plan de Producción Visual
                      </label>
                      <div className="space-y-2">
                        {((result.plan_produccion_visual || result.plan_visual) ?? []).map((scene: any, idx: number) => (
                          <div key={idx} className="flex gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                            <span className="text-xs font-black text-gray-600 w-14 text-right font-mono shrink-0">{scene.tiempo}</span>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm text-white">{scene.descripcion_visual || scene.accion_en_pantalla}</p>
                              <div className="flex gap-2 flex-wrap">
                                {scene.tipo_plano && <span className="text-[9px] text-indigo-400">🎥 {scene.tipo_plano}</span>}
                                {scene.movimiento_camara && <span className="text-[9px] text-cyan-400">📷 {scene.movimiento_camara}</span>}
                                {scene.efecto_retencion && <span className="text-[9px] text-orange-400">⚡ {scene.efecto_retencion}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Audit section */}
                  {showAudit && (
                    <div className="border-t border-white/[0.04] pt-5">
                      <h3 className="text-sm font-black text-pink-400 mb-4 flex items-center gap-2">
                        <Gavel size={16} /> Veredicto del Juez Viral
                      </h3>
                      {isAuditing ? (
                        <div className="flex flex-col items-center gap-4 py-10">
                          <Gavel className="animate-pulse text-pink-500" size={40} />
                          <p className="text-sm font-bold text-pink-400 animate-pulse">Analizando con 10 criterios virales...</p>
                        </div>
                      ) : auditResult ? (
                        <div className="bg-pink-900/8 border border-pink-500/15 rounded-2xl p-5">
                          <div className="flex justify-between items-center mb-5">
                            <div className="text-5xl font-black text-white">
                              {auditResult.veredicto_final?.score_total}
                              <span className="text-base text-gray-600">/100</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-pink-400 uppercase tracking-widest">{auditResult.veredicto_final?.clasificacion}</div>
                              <div className="text-xs text-gray-600">Probabilidad: {auditResult.veredicto_final?.probabilidad_viral}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <span className="text-xs font-black text-green-400 uppercase block mb-2">✅ Fortalezas</span>
                              <ul className="space-y-1">
                                {auditResult.fortalezas_clave?.map((f, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                    <CheckCircle2 size={11} className="text-green-500 mt-0.5 shrink-0" /> {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-xs font-black text-red-400 uppercase block mb-2">⚠️ Críticos</span>
                              <ul className="space-y-1">
                                {auditResult.debilidades_criticas?.map((d, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                    <AlertCircle size={11} className="text-red-500 mt-0.5 shrink-0" /> {d.problema}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {auditResult.optimizaciones_rapidas && auditResult.optimizaciones_rapidas.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-pink-500/15">
                              <span className="text-xs font-black text-yellow-400 uppercase block mb-2">💡 Optimizaciones Rápidas</span>
                              <ul className="space-y-1">
                                {auditResult.optimizaciones_rapidas.map((opt, i) => (
                                  <li key={i} className="text-xs text-gray-300">• {opt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {auditResult?.veredicto_final?.score_total !== undefined && auditResult.veredicto_final.score_total < 75 && (
                            <div className="mt-4 pt-4 border-t border-pink-500/15">
                              <div className="bg-yellow-900/15 border border-yellow-500/20 rounded-xl p-3 mb-3">
                                <p className="text-xs text-yellow-400 font-bold flex items-center gap-2 mb-1">
                                  <AlertCircle size={12} /> Score bajo ({auditResult.veredicto_final.score_total}/100)
                                </p>
                                <p className="text-xs text-gray-500">¿Regenerar aplicando el análisis del Juez?</p>
                              </div>
                              <button
                                onClick={async () => {
                                  if (!auditResult || !topic) return;
                                  const sugerencias = auditResult.optimizaciones_rapidas?.join('. ') || '';
                                  const debilidades = auditResult.debilidades_criticas?.map(d => d.solucion).join('. ') || '';
                                  const mejoras = [sugerencias, debilidades].filter(Boolean).join('. ');
                                  const topicEnriquecido = topic + (mejoras ? `\n\n[MEJORAS DEL JUEZ]:\n${mejoras}` : '');
                                  setTopic(topicEnriquecido);
                                  setAuditResult(null);
                                  setShowAudit(false);
                                  setResult(null);
                                  setTimeout(() => handleGenerate(), 100);
                                }}
                                disabled={isGenerating}
                                className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all"
                              >
                                {isGenerating ? <><RefreshCw className="animate-spin" size={14} /> Regenerando...</> : <><RefreshCw size={14} /> Regenerar con Mejoras</>}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-600">
                          <AlertCircle size={24} className="mx-auto mb-2" />
                          <p className="text-xs">No se pudo obtener la auditoría</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="h-full min-h-[600px] border-2 border-dashed border-white/[0.04] rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-white/[0.01]">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-white/[0.06] flex items-center justify-center shadow-xl">
                    <Wand2 size={36} className="text-gray-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-pink-400" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">Lienzo Creativo Vacío</h3>
                <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                  Sigue la Secuencia de 4 Pasos a la izquierda para que el Motor V700 codifique tu próximo viral.
                </p>
                <div className="mt-6 flex flex-col gap-2 text-left w-full max-w-xs">
                  {[
                    '1 → Define tu tema o sube una imagen',
                    '2 → Elige arquitectura narrativa',
                    '3 → Calibra la psicología',
                    '4 → Selecciona el detonador',
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-800 shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== SCHEDULE MODAL ===== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#080B10] border border-white/[0.07] rounded-2xl w-full max-w-md shadow-2xl p-6 relative" style={{ boxShadow: '0 0 60px -10px rgba(99,102,241,0.3)' }}>
            <button onClick={() => setIsScheduleModalOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
              <X size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
                <CalendarIcon size={22} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-black text-white">Agendar Publicación</h3>
              <p className="text-xs text-gray-600 mt-1">Elige cuándo publicar este guion.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Fecha</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <span className="text-[9px] font-black text-gray-600 uppercase block mb-1">Tema</span>
                <p className="text-xs text-gray-400 italic line-clamp-2">"{topic}"</p>
              </div>
              <button
                onClick={handleConfirmSchedule}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                Confirmar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarFeedback && guionParaFeedback && (
        <TCAFeedbackWidget
          guionData={guionParaFeedback}
          onClose={() => setMostrarFeedback(false)}
        />
      )}
    </>
  );
};