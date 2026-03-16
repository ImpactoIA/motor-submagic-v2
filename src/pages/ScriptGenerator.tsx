import React, { useState, useEffect, useRef } from 'react';
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
// 📊 TIPOS DE STREAMING
// ==================================================================================

type StreamPhase = 'idle' | 'estratega' | 'generador' | 'complete' | 'error';

interface StreamState {
  phase: StreamPhase;
  phaseMessage: string;
  streamedText: string;    // Texto crudo que va llegando chunk a chunk
  estrategia: any | null;
  result: ScriptResult | null;
  errorMessage: string | null;
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

const STRATEGY_LOOPS = [
  { id: 'magnetic_loop', label: '🧲 Magnetic Loop', desc: 'Atrae, seduce, retiene', color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
  { id: 'engagement_loop', label: '💬 Engagement Loop', desc: 'Comentarios, debates, shares', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'authority_loop', label: '👑 Authority Loop', desc: 'Posicionamiento experto', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
  { id: 'viral_loop', label: '🔥 Viral Loop', desc: 'Explosión orgánica masiva', color: 'border-red-500 bg-red-500/10 text-red-300' },
];

const EMOTIONAL_VECTORS = [
  { id: 'dolor_profundo', label: '💔 Dolor Profundo', color: 'border-red-600 bg-red-900/20 text-red-300' },
  { id: 'deseo_ardiente', label: '🔥 Deseo Ardiente', color: 'border-orange-500 bg-orange-900/20 text-orange-300' },
  { id: 'miedo_temor', label: '😨 Miedo / Temor', color: 'border-purple-600 bg-purple-900/20 text-purple-300' },
  { id: 'objecion_oculta', label: '🛡️ Objeción Oculta', color: 'border-blue-500 bg-blue-900/20 text-blue-300' },
  { id: 'mito_industria', label: '💥 Mito de la Industria', color: 'border-cyan-500 bg-cyan-900/20 text-cyan-300' },
];

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
// 🌊 STREAMING PHASE INDICATOR
// ==================================================================================

const StreamingPhaseIndicator = ({ phase, message, streamedText }: {
  phase: StreamPhase;
  message: string;
  streamedText: string;
}) => {
  if (phase === 'idle' || phase === 'complete') return null;

  return (
    <div className="space-y-4">
      {/* Phase status */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        phase === 'estratega'
          ? 'bg-purple-900/20 border-purple-500/30'
          : phase === 'generador'
          ? 'bg-pink-900/20 border-pink-500/30'
          : phase === 'error'
          ? 'bg-red-900/20 border-red-500/30'
          : 'bg-gray-900/20 border-gray-500/30'
      }`}>
        {phase !== 'error' ? (
          <div className="relative w-8 h-8 shrink-0">
            <div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${
              phase === 'estratega' ? 'border-purple-400' : 'border-pink-400'
            }`} />
            <div className={`absolute inset-1 rounded-full ${
              phase === 'estratega' ? 'bg-purple-500/20' : 'bg-pink-500/20'
            }`} />
          </div>
        ) : (
          <AlertCircle size={32} className="text-red-400 shrink-0" />
        )}
        <div>
          <p className={`text-sm font-black ${
            phase === 'estratega' ? 'text-purple-300'
            : phase === 'generador' ? 'text-pink-300'
            : phase === 'error' ? 'text-red-300'
            : 'text-white'
          }`}>{message}</p>
          <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-widest">
            {phase === 'estratega' && 'Motor V800 · Paso 1 / 2'}
            {phase === 'generador' && 'Motor V800 · Paso 2 / 2 · Streaming'}
            {phase === 'error' && 'Error en el pipeline'}
          </p>
        </div>
      </div>

      {/* Live streaming text preview */}
      {phase === 'generador' && streamedText.length > 0 && (
        <div className="bg-black/40 border border-white/[0.04] rounded-xl p-4 max-h-64 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            Generando en vivo...
          </p>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {streamedText}
            <span className="inline-block w-1.5 h-3.5 bg-pink-400 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 🎨 COMPONENTE PRINCIPAL
// ==================================================================================

export const ScriptGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, refreshProfile } = useAuth();

  const isStateInitialized = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // --- Psychology ---
  const [strategyLoop, setStrategyLoop] = useState('magnetic_loop');
  const [vectorEmocional, setVectorEmocional] = useState('dolor_profundo');
  const [arquetipoVoz, setArquetipoVoz] = useState('autoridad_empatica');
  const [awareness, setAwareness] = useState(AWARENESS_LEVELS[1]);
  const [situation, setSituation] = useState('Dolor Agudo (Urgencia)');

  // --- Intensity ---
  const [selectedIntensity, setSelectedIntensity] = useState('equilibrado');
  const [closingObjective, setClosingObjective] = useState('seguidores');

  // --- Hooks ---
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

  // --- Stream State (replaces old isGenerating + result) ---
  const [streamState, setStreamState] = useState<StreamState>({
    phase: 'idle',
    phaseMessage: '',
    streamedText: '',
    estrategia: null,
    result: null,
    errorMessage: null,
  });

  // Derived convenience booleans
  const isGenerating = streamState.phase === 'estratega' || streamState.phase === 'generador';
  const result = streamState.result;
  const error = streamState.errorMessage;

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

    if (location.state && location.state.fromIdeas && !isStateInitialized.current) {
      isStateInitialized.current = true;
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
      navigate(location.pathname, { replace: true, state: null });
    }

    if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
  }, [user, userProfile, location]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
  // 🌊 GENERATE CON STREAMING SSE
  // ==================================================================================

  const handleGenerate = async () => {
    if (!topic.trim() && !selectedImage) {
      setStreamState(prev => ({ ...prev, errorMessage: "Por favor escribe un tema o sube una imagen.", phase: 'idle' }));
      return;
    }

    if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < cost) {
      const shouldRecharge = confirm(
        `⚠️ Saldo insuficiente. Necesitas ${cost} créditos pero tienes ${userProfile?.credits || 0}.\n\n¿Deseas recargar?`
      );
      if (shouldRecharge) navigate('/dashboard/settings');
      return;
    }

    // Abort cualquier stream previo en vuelo
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Reset completo del estado
    setStreamState({
      phase: 'estratega',
      phaseMessage: '🧠 Analizando Estrategia y TCA...',
      streamedText: '',
      estrategia: null,
      result: null,
      errorMessage: null,
    });
    setAuditResult(null);
    setShowAudit(false);
    setSaveSuccess(false);

    try {
      // ── Obtener token de sesión para auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No hay sesión activa. Por favor inicia sesión.');

      const supabaseUrl = (supabase as any).supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/process-url`;

      const requestBody = {
        selectedMode: selectedImage ? 'script_generator_vision' : 'script_generator_standard',
        text: topic,
        image: selectedImage || undefined,
        expertId: selectedExpertId || undefined,
        avatarId: userProfile?.active_avatar_id || undefined,
        knowledgeBaseId: selectedKnowledgeBaseId || undefined,
        estimatedCost: cost,
        settings: {
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
        },
      };

      // ── Llamada fetch directa para poder leer el ReadableStream
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      // ── Manejo de errores HTTP (400, 500, etc.)
      if (!response.ok) {
        let errMsg = `Error del servidor: ${response.status}`;
        try {
          const errBody = await response.json();
          errMsg = errBody?.error || errMsg;
        } catch {
          // no-op, usamos el mensaje genérico
        }
        throw new Error(errMsg);
      }

      // ── Verificar que la respuesta es SSE
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream')) {
        // Fallback: respuesta JSON normal (compatibilidad con handlers que no cambiaron)
        const data = await response.json();
        if (!data?.success && !data?.generatedData) {
          throw new Error(data?.error || 'El backend devolvió un error desconocido');
        }
        const finalResult = data.generatedData || data;
        if (!finalResult.guion_completo && !finalResult.teleprompter_script) {
          throw new Error('El backend no devolvió un guion. Intenta de nuevo.');
        }
        setStreamState({
          phase: 'complete',
          phaseMessage: '✅ Guion generado',
          streamedText: finalResult.guion_completo || '',
          estrategia: null,
          result: finalResult,
          errorMessage: null,
        });
        setGuionParaFeedback(finalResult);
        if (refreshProfile) await refreshProfile();
        return;
      }

      // ── Leer el stream SSE
      const reader = response.body!.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Procesamos líneas completas del protocolo SSE (data: {...}\n\n)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // La última línea puede estar incompleta

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          let event: any;
          try {
            event = JSON.parse(jsonStr);
          } catch {
            console.warn('[SSE] Chunk no parseable:', jsonStr.substring(0, 100));
            continue;
          }

          switch (event.type) {
            case 'status':
              setStreamState(prev => ({
                ...prev,
                phase: event.phase as StreamPhase,
                phaseMessage: event.message,
              }));
              break;

            case 'estrategia':
              setStreamState(prev => ({
                ...prev,
                estrategia: event.data,
              }));
              break;

            case 'chunk':
              // Texto llegando letra por letra
              setStreamState(prev => ({
                ...prev,
                streamedText: prev.streamedText + (event.text || ''),
              }));
              break;

            case 'complete':
              // Resultado final estructurado
              setStreamState({
                phase: 'complete',
                phaseMessage: '✅ Guion generado',
                streamedText: event.result?.guion_completo || event.result?.teleprompter_script || '',
                estrategia: null,
                result: event.result,
                errorMessage: null,
              });
              setGuionParaFeedback(event.result);
              if (refreshProfile) await refreshProfile();
              break;

            case 'error':
              throw new Error(event.message || 'Error desconocido desde el servidor');
          }
        }
      }

    } catch (e: any) {
      if (e.name === 'AbortError') {
        // El usuario canceló — no mostramos error
        setStreamState(prev => ({ ...prev, phase: 'idle', phaseMessage: '', errorMessage: null }));
        return;
      }
      console.error('[ScriptGenerator] Error en stream:', e);
      setStreamState(prev => ({
        ...prev,
        phase: 'error',
        phaseMessage: '❌ Error en la generación',
        errorMessage: e.message || 'Error inesperado. Por favor intenta de nuevo.',
      }));
    }
  };

  // ==================================================================================
  // 🛑 CANCELAR GENERACIÓN
  // ==================================================================================

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // ==================================================================================
  // 💾 SAVE, SCHEDULE, AUDIT, COPY
  // ==================================================================================

  const handleSaveLibrary = async () => {
    if (!result || !user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const { error: saveError } = await supabase.from('viral_generations').insert({
        user_id: user.id,
        type: 'generar_guion',
        content: result,
        original_url: null,
        cost_credits: cost,
        platform: selectedPlatform.label,
        tokens_used: 0,
        whisper_minutes: 0
      });
      if (saveError) throw saveError;
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
      const { error: schedError } = await supabase.from('content_items').insert({
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
      if (schedError) throw schedError;
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
      const { data, error: auditError } = await supabase.functions.invoke('process-url', {
        body: {
          selectedMode: 'juez_viral',
          text: result.guion_completo,
          expertId: selectedExpertId || undefined,
          avatarId: userProfile?.active_avatar_id || undefined,
          estimatedCost: 2
        }
      });
      if (auditError) throw auditError;
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
                          ? `${p.border} ${p.bg} ${p.color}`
                          : 'border-white/[0.04] bg-white/[0.02] text-gray-600 hover:border-white/10'
                      }`}
                    >
                      <p.icon size={14} />
                      <span className="hidden sm:block">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Topic input */}
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Tu idea, texto largo o descripción de la imagen..."
                    rows={4}
                    className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3.5 text-sm text-white placeholder-gray-700 outline-none focus:border-pink-500/40 transition-colors resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-gray-700">{topic.length}</div>
                </div>

                {/* Image upload */}
                <div className="mt-3">
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-900/80 transition-colors"
                      >
                        <X size={13} className="text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-pink-400 font-bold">
                        📸 Imagen lista
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 p-3 border border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-pink-500/30 hover:bg-pink-900/5 transition-all">
                      <UploadCloud size={16} className="text-gray-600" />
                      <span className="text-xs text-gray-600">Subir imagen (JPG/PNG, máx 4MB)</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Duration */}
                <div className="mt-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Duración</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DURATIONS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDurationId(d.id)}
                        className={`py-2 rounded-lg border text-center transition-all ${
                          durationId === d.id
                            ? 'border-pink-500 bg-pink-500/10 text-pink-300'
                            : 'border-white/[0.04] bg-white/[0.02] text-gray-600 hover:border-white/10'
                        }`}
                      >
                        <div className="text-[10px] font-black">{d.label}</div>
                        <div className="text-[9px] text-gray-600">{d.sublabel}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experts & KB */}
                {(experts.length > 0 || knowledgeBases.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {experts.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Experto</span>
                        <select
                          value={selectedExpertId}
                          onChange={e => setSelectedExpertId(e.target.value)}
                          className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2 text-xs text-white outline-none"
                        >
                          <option value="">Sin experto</option>
                          {experts.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name || ex.niche}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {knowledgeBases.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Base de Conocimiento</span>
                        <select
                          value={selectedKnowledgeBaseId}
                          onChange={e => setSelectedKnowledgeBaseId(e.target.value)}
                          className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2 text-xs text-white outline-none"
                        >
                          <option value="">Sin base</option>
                          {knowledgeBases.map(kb => (
                            <option key={kb.id} value={kb.id}>{kb.title}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ─── STEP 2: ARQUITECTURA ─── */}
            <div>
              <StepBadge number={2} label="Arquitectura Narrativa" active />
              <SectionCard>
                <div className="mb-3">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Estructura</span>
                  <div className="space-y-1.5">
                    {TITAN_STRUCTURES.map(s => (
                      <div key={s.id}>
                        <button
                          onClick={() => {
                            setSelectedStructure(s);
                            setSelectedInternalMode(s.modes[0]);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                            selectedStructure.id === s.id
                              ? s.color
                              : 'border-white/[0.04] bg-white/[0.02] text-gray-500 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold">{s.label}</span>
                          {selectedStructure.id === s.id && <ChevronDown size={12} />}
                        </button>
                        {selectedStructure.id === s.id && (
                          <div className="mt-1.5 ml-2 grid grid-cols-2 gap-1">
                            {s.modes.map(m => (
                              <button
                                key={m.id}
                                onClick={() => setSelectedInternalMode(m)}
                                className={`text-[10px] px-2 py-1.5 rounded-lg border text-left transition-all ${
                                  selectedInternalMode.id === m.id
                                    ? 'border-white/20 bg-white/[0.06] text-white'
                                    : 'border-white/[0.04] text-gray-600 hover:text-gray-400'
                                }`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Formato Narrativo</span>
                  <div className="space-y-1">
                    {NARRATIVE_FORMATS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedNarrativeFormat(f.id)}
                        className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                          selectedNarrativeFormat === f.id
                            ? 'border-pink-500/40 bg-pink-900/10 text-pink-300'
                            : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold shrink-0">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── STEP 3: PSICOLOGÍA ─── */}
            <div>
              <StepBadge number={3} label="Psicología del Guion" active />
              <SectionCard>
                <div className="space-y-4">
                  {/* Strategy Loop */}
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Strategy Loop</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STRATEGY_LOOPS.map(sl => (
                        <button
                          key={sl.id}
                          onClick={() => setStrategyLoop(sl.id)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                            strategyLoop === sl.id ? sl.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          {sl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vector Emocional */}
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Vector Emocional</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {EMOTIONAL_VECTORS.map(ev => (
                        <button
                          key={ev.id}
                          onClick={() => setVectorEmocional(ev.id)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                            vectorEmocional === ev.id ? ev.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          {ev.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Archetype */}
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Arquetipo de Voz</span>
                    <div className="space-y-1">
                      {VOICE_ARCHETYPES.map(va => (
                        <button
                          key={va.id}
                          onClick={() => setArquetipoVoz(va.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                            arquetipoVoz === va.id ? va.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          <span className="font-bold">{va.label}</span>
                          <span className="text-[10px] opacity-60">{va.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Awareness */}
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Nivel de Conciencia</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AWARENESS_LEVELS.map(al => (
                        <button
                          key={al}
                          onClick={() => setAwareness(al)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                            awareness === al
                              ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                              : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          {al}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ─── STEP 4: DETONADOR ─── */}
            <div>
              <StepBadge number={4} label="El Detonador — Activación Final" active />
              <SectionCard className="card-glow-purple">
                {/* Intensity */}
                <div className="mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Intensidad</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INTENSITY_MODES.map(im => (
                      <button
                        key={im.id}
                        onClick={() => setSelectedIntensity(im.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                          selectedIntensity === im.id ? im.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}
                      >
                        {im.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Closing Objective */}
                <div className="mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Objetivo de Cierre</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CLOSING_OBJECTIVES.map(co => (
                      <button
                        key={co.id}
                        onClick={() => setClosingObjective(co.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                          closingObjective === co.id
                            ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                            : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}
                      >
                        {co.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hook Mode */}
                <div className="mb-4">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Sistema de Gancho</span>
                  <div className="flex gap-1.5 mb-3">
                    {(['elite', 'custom', 'arsenal'] as const).map(hm => (
                      <button
                        key={hm}
                        onClick={() => setHookMode(hm)}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                          hookMode === hm
                            ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
                            : 'border-white/[0.04] text-gray-600'
                        }`}
                      >
                        {hm === 'elite' ? '⭐ Elite' : hm === 'custom' ? '✏️ Custom' : '🗃️ Arsenal'}
                      </button>
                    ))}
                  </div>

                  {hookMode === 'elite' && (
                    <div className="space-y-1">
                      {ELITE_HOOKS.map(h => (
                        <button
                          key={h.id}
                          onClick={() => setEliteHookId(h.id)}
                          className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                            eliteHookId === h.id
                              ? 'border-yellow-500/40 bg-yellow-900/10 text-yellow-300'
                              : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-bold shrink-0">{h.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {hookMode === 'custom' && (
                    <textarea
                      value={customHook}
                      onChange={e => setCustomHook(e.target.value)}
                      placeholder="Escribe tu gancho personalizado aquí..."
                      rows={3}
                      className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3 text-xs text-white placeholder-gray-700 outline-none focus:border-yellow-500/40 transition-colors resize-none"
                    />
                  )}

                  {hookMode === 'arsenal' && (
                    <div className="grid grid-cols-2 gap-1">
                      {MASTER_HOOKS.map(h => (
                        <button
                          key={h}
                          onClick={() => setArsenalHook(h)}
                          className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold text-left transition-all ${
                            arsenalHook === h
                              ? 'border-yellow-500/40 bg-yellow-900/10 text-yellow-300'
                              : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cultural context */}
                <div className="mb-5">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Contexto Cultural (opcional)</span>
                  <input
                    type="text"
                    value={culturalContext}
                    onChange={e => setCulturalContext(e.target.value)}
                    placeholder="Tendencia, meme, evento actual..."
                    className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2.5 text-xs text-white placeholder-gray-700 outline-none focus:border-pink-500/40 transition-colors"
                  />
                </div>

                {/* CTA BUTTON */}
                <button
                  onClick={isGenerating ? handleCancelGeneration : handleGenerate}
                  disabled={false}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                    isGenerating
                      ? 'bg-gray-800 border border-red-500/30 text-red-400 hover:bg-red-900/20'
                      : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500 text-white shadow-pink-900/30 shimmer-btn'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <X size={16} className="text-red-400" />
                      Cancelar Generación
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="text-yellow-300" />
                      ACTIVAR MOTOR V700 · {cost} créditos
                    </>
                  )}
                </button>

                {/* Cost preview */}
                <p className="text-center text-[10px] text-gray-700 mt-2">
                  Pipeline de 2 pasos · Streaming en tiempo real · {DURATIONS.find(d => d.id === durationId)?.words}
                </p>
              </SectionCard>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN — RESULTS & STREAMING
          ============================================================ */}
          <div className="space-y-4">
            {/* Error banner */}
            {error && streamState.phase !== 'generador' && streamState.phase !== 'estratega' && (
              <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-300">Error en la generación</p>
                  <p className="text-xs text-red-400/80 mt-1">{error}</p>
                  <button
                    onClick={handleGenerate}
                    className="mt-2 text-xs text-red-300 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {/* Streaming Phase Indicator */}
            {isGenerating && (
              <StreamingPhaseIndicator
                phase={streamState.phase}
                message={streamState.phaseMessage}
                streamedText={streamState.streamedText}
              />
            )}

            {/* Result */}
            {result ? (
              <div className="space-y-4">
                {/* Action bar */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Copy size={12} /> Copiar
                  </button>
                  <button
                    onClick={handleSaveLibrary}
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
                      saveSuccess
                        ? 'bg-green-900/30 border border-green-500/40 text-green-400'
                        : 'bg-white/[0.04] border border-white/[0.07] text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {saveSuccess ? <><CheckCircle2 size={12} /> Guardado</> : <><Save size={12} /> Guardar</>}
                  </button>
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <CalendarIcon size={12} /> Agendar
                  </button>
                  <button
                    onClick={handleAuditScript}
                    disabled={isAuditing}
                    className="flex items-center gap-1.5 px-3 py-2 bg-pink-900/20 border border-pink-500/20 rounded-xl text-xs text-pink-400 hover:border-pink-500/40 transition-all"
                  >
                    {isAuditing ? <RefreshCw size={12} className="animate-spin" /> : <Gavel size={12} />}
                    Juez Viral
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <RefreshCw size={12} /> Regenerar
                  </button>
                </div>

                {/* Score badges */}
                {result.score_predictivo && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Retención', value: result.score_predictivo.retention_score, color: 'text-cyan-400' },
                      { label: 'Share', value: result.score_predictivo.share_score, color: 'text-blue-400' },
                      { label: 'Save', value: result.score_predictivo.save_score, color: 'text-green-400' },
                      { label: 'Viral Index', value: result.score_predictivo.viral_index, color: 'text-yellow-400' },
                    ].map(metric => (
                      <div key={metric.label} className="bg-[#080B10] border border-white/[0.06] rounded-xl p-3 text-center">
                        <div className={`text-xl font-black ${metric.color}`}>{metric.value}</div>
                        <div className="text-[9px] text-gray-600 uppercase mt-0.5">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hook */}
                {result.hook && (
                  <SectionCard>
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Zap size={10} /> Gancho de Apertura
                    </p>
                    <p className="text-sm font-bold text-white leading-relaxed">{result.hook}</p>
                  </SectionCard>
                )}

                {/* Main script */}
                <SectionCard className="card-glow-pink">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <PenTool size={10} /> Guion Completo
                  </p>
                  <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed font-mono">
                    {result.guion_completo || result.teleprompter_script}
                  </div>
                </SectionCard>

                {/* Poder del guion */}
                {result.poder_del_guion && (
                  <SectionCard>
                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Star size={10} /> Poder del Guion
                    </p>
                    <div className="space-y-2">
                      {result.poder_del_guion.frase_de_oro && (
                        <div className="p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
                          <p className="text-[10px] font-black text-yellow-500 uppercase mb-1">🥇 Frase de Oro</p>
                          <p className="text-xs text-gray-300 italic">"{result.poder_del_guion.frase_de_oro}"</p>
                        </div>
                      )}
                      {result.poder_del_guion.por_que_llegara_a_millones && (
                        <div className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                          <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">🚀 Por qué llegará a millones</p>
                          <p className="text-xs text-gray-300">{result.poder_del_guion.por_que_llegara_a_millones}</p>
                        </div>
                      )}
                    </div>
                  </SectionCard>
                )}

                {/* Miniatura */}
                {result.miniatura_dominante && (
                  <SectionCard>
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ImageIcon size={10} /> Miniatura Dominante
                    </p>
                    <p className="text-base font-black text-white mb-3 leading-tight">{result.miniatura_dominante.frase_principal}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'CTR', value: result.miniatura_dominante.ctr_score },
                        { label: 'Disrupción', value: result.miniatura_dominante.nivel_disrupcion },
                        { label: 'Gap', value: result.miniatura_dominante.nivel_gap_curiosidad },
                        { label: 'Algoritmo', value: result.miniatura_dominante.compatibilidad_algoritmica },
                      ].map(m => (
                        <div key={m.label} className="text-center p-2 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                          <div className="text-sm font-black text-white">{m.value}</div>
                          <div className="text-[9px] text-gray-600">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Optional hooks */}
                {result.ganchos_opcionales && result.ganchos_opcionales.length > 0 && (
                  <SectionCard>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Hash size={10} /> Ganchos Opcionales
                    </p>
                    <div className="space-y-2">
                      {result.ganchos_opcionales.map((g, i) => (
                        <div key={i} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-pink-400 uppercase">{g.tipo}</span>
                            <span className="text-[10px] text-gray-600">Retención: {g.retencion_predicha}%</span>
                          </div>
                          <p className="text-xs text-gray-300">{g.texto}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Juez Viral Audit */}
                {showAudit && (
                  <SectionCard className="border-pink-500/20">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Gavel size={10} /> Juez Viral
                    </p>
                    {isAuditing ? (
                      <div className="flex flex-col items-center gap-3 py-8">
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
                                setStreamState(prev => ({ ...prev, result: null }));
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
                  </SectionCard>
                )}
              </div>
            ) : !isGenerating ? (
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
            ) : null}
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