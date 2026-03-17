import React, { useState, useEffect, useRef } from 'react';
import { TCAFeedbackWidget } from '../components/TCAFeedbackWidget';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useScriptGenerator, GeneratorConfig, StreamPhase } from '../hooks/useScriptGenerator';
import {
  RefreshCw, Wand2, Zap, Copy, Save, Calendar as CalendarIcon, Gavel,
  Video, Instagram, Youtube, Linkedin, Globe, CheckCircle2,
  User, AlertCircle, PenTool, X, ChevronRight, Flame,
  ImageIcon, UploadCloud, Sparkles, ChevronDown, Star, Hash,
} from 'lucide-react';

// ==================================================================================
// 📚 CONSTANTES DE CONFIGURACIÓN
// ==================================================================================

const TITAN_STRUCTURES = [
  {
    id: 'winner_rocket', label: '🚀 Winner Rocket (Oficial)',
    desc: 'La fórmula viral de 7 pasos. Retención máxima + Loops.',
    color: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    modes: [
      { id: 'viral_rapido',   label: '⚡ Viral Rápido',   desc: 'Ritmo frenético, cortes cada 2s.' },
      { id: 'autoridad',      label: '👑 Autoridad',       desc: 'Demostración de estatus y saber.' },
      { id: 'venta',          label: '💰 Venta Directa',   desc: 'Conversión al final.' },
      { id: 'storytelling',   label: '📖 Storytelling',    desc: 'Viaje del héroe en 60s.' },
      { id: 'marca_personal', label: '🙋 Marca Personal',  desc: 'Conexión y valores.' },
      { id: 'lead_magnet',    label: '🧲 Lead Magnet',     desc: 'Regalo a cambio de atención.' },
      { id: 'educativo',      label: '🧠 Educativo',       desc: 'Valor masivo comprimido.' },
    ],
  },
  {
    id: 'aida', label: '📢 AIDA (Clásica)',
    desc: 'Atención - Interés - Deseo - Acción.',
    color: 'border-blue-500 bg-blue-500/10 text-blue-400',
    modes: [
      { id: 'educativo',    label: '📚 Educativo',  desc: 'Enseñar algo nuevo.' },
      { id: 'autoridad',    label: '🧠 Autoridad',  desc: 'Posicionamiento experto.' },
      { id: 'venta',        label: '💸 Venta',      desc: 'Push comercial.' },
      { id: 'viral',        label: '🔥 Viral',      desc: 'Shock inicial fuerte.' },
      { id: 'storytelling', label: '🎭 Drama',      desc: 'Narrativa emocional.' },
      { id: 'leads',        label: '📥 Captación',  desc: 'Generación de prospectos.' },
    ],
  },
  {
    id: 'pas', label: '💔 PAS (Dolor Profundo)',
    desc: 'Problema - Agitación - Solución.',
    color: 'border-red-500 bg-red-500/10 text-red-400',
    modes: [
      { id: 'dolor_emocional', label: '😭 Dolor Emocional', desc: 'Ataca la inseguridad.' },
      { id: 'urgencia',        label: '⏳ Urgencia',         desc: 'Miedo a perderse algo.' },
      { id: 'objecion',        label: '🛡️ Romper Objeción',  desc: '"Es muy caro" → No.' },
      { id: 'frustracion',     label: '😤 Frustración',      desc: '"¿Harto de intentar X?"' },
      { id: 'perdida_futura',  label: '📉 Pérdida Futura',   desc: 'Qué pasa si no actúas.' },
    ],
  },
  {
    id: 'storytelling', label: '🎥 Storytelling (HSO)',
    desc: 'Hook - Story - Offer. Conexión total.',
    color: 'border-pink-500 bg-pink-500/10 text-pink-400',
    modes: [
      { id: 'personal',          label: '🧔 Personal',           desc: 'Tu propia historia.' },
      { id: 'cliente',           label: '🤝 Caso de Éxito',      desc: 'Historia de un alumno.' },
      { id: 'error_aprendizaje', label: '💡 Error → Eureka',     desc: 'Cómo aprendí a la mala.' },
      { id: 'transformacion',    label: '🦋 Transformación',     desc: 'El viaje del punto A al B.' },
      { id: 'confesional',       label: '🤫 Confesión',          desc: 'Vulnerabilidad estratégica.' },
      { id: 'inspiracional',     label: '✨ Inspiracional',      desc: 'Motivación pura.' },
    ],
  },
  {
    id: 'viral_shock', label: '⚡ Viral Shock',
    desc: 'Polarización y ruptura de patrones.',
    color: 'border-purple-500 bg-purple-500/10 text-purple-400',
    modes: [
      { id: 'opinion_impopular', label: '🤬 Opinión Impopular',  desc: 'Contra la corriente.' },
      { id: 'mito_verdad',       label: '❌ Mito vs Verdad',     desc: 'Desmintiendo la industria.' },
      { id: 'ataque_creencia',   label: '👊 Ataque a Creencia',  desc: '"Lo que haces no sirve".' },
      { id: 'frase_prohibida',   label: '🚫 Lo Prohibido',       desc: 'Secretos ocultos.' },
      { id: 'polarizacion',      label: '⚖️ Polarización',       desc: 'Divide a la audiencia.' },
    ],
  },
  {
    id: 'autoridad', label: '🧲 Thought Leader',
    desc: 'Ideas de alto nivel. Estatus.',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    modes: [
      { id: 'marco_mental',  label: '🧠 Marco Mental',     desc: 'Nueva forma de pensar.' },
      { id: 'insight',       label: '💡 Insight Único',    desc: 'Información privilegiada.' },
      { id: 'tendencia',     label: '📈 Tendencia Futura', desc: 'Predicción del mercado.' },
      { id: 'error_mercado', label: '📉 Error del Mercado',desc: 'Por qué todos fallan.' },
      { id: 'nueva_regla',   label: '📏 La Nueva Regla',   desc: 'Cambio de paradigma.' },
    ],
  },
  {
    id: 'educativo', label: '📚 Educativo Avanzado',
    desc: 'Valor táctico y aplicable.',
    color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    modes: [
      { id: 'framework',   label: '🏗️ Framework',   desc: 'Sistema paso a paso.' },
      { id: 'checklist',   label: '✅ Checklist',   desc: 'Lista de verificación.' },
      { id: 'paso_a_paso', label: '👣 Tutorial',    desc: 'How-to clásico.' },
      { id: 'error_comun', label: '❌ Error Común', desc: 'Corrección técnica.' },
      { id: 'comparativo', label: '🆚 Comparativo', desc: 'Opción A vs Opción B.' },
      { id: 'mini_clase',  label: '🎓 Mini-Clase',  desc: 'Lección profunda en 1 min.' },
    ],
  },
  {
    id: 'venta', label: '💰 Venta Estratégica',
    desc: 'Diseñado para facturar.',
    color: 'border-green-500 bg-green-500/10 text-green-400',
    modes: [
      { id: 'soft_sell',       label: '☁️ Soft Sell',          desc: 'Venta suave/indirecta.' },
      { id: 'hard_sell',       label: '🔨 Hard Sell',          desc: 'Venta directa/agresiva.' },
      { id: 'objeciones',      label: '🛡️ Matar Objeciones',   desc: 'Antes de que pregunten.' },
      { id: 'caso_real',       label: '🏆 Caso Real',          desc: 'Prueba social monetizable.' },
      { id: 'oferta_limitada', label: '⏳ Oferta Limitada',    desc: 'Escasez y urgencia.' },
    ],
  },
  {
    id: 'comunidad', label: '🎯 Leads & Comunidad',
    desc: 'Crecimiento de base de datos.',
    color: 'border-orange-500 bg-orange-500/10 text-orange-400',
    modes: [
      { id: 'reto',           label: '🏆 Reto',        desc: 'Challenge de X días.' },
      { id: 'lead_magnet',    label: '🎁 Lead Magnet', desc: 'Ebook/Plantilla gratis.' },
      { id: 'serie',          label: '📺 Serie',        desc: 'Parte 1 de X.' },
      { id: 'promesa_abierta',label: '🤝 Promesa',     desc: 'Compromiso público.' },
      { id: 'invitacion',     label: '💌 Invitación',  desc: 'Webinar/Evento.' },
    ],
  },
];

const NARRATIVE_FORMATS = [
  { id: 'EDUCATIVO_AUTORIDAD',    label: '📚 Educativo de Autoridad' },
  { id: 'STORYTELLING_EMOCIONAL', label: '🎭 Storytelling Emocional' },
  { id: 'ANUNCIO_DIRECTO',        label: '📢 Anuncio Directo' },
  { id: 'ANUNCIO_INDIRECTO',      label: '🎣 Anuncio Indirecto' },
  { id: 'OPINION_POLARIZACION',   label: '⚡ Opinión / Polarización' },
  { id: 'CASO_ESTUDIO',           label: '📊 Caso de Estudio' },
  { id: 'TUTORIAL_PASO_A_PASO',   label: '🔧 Tutorial Paso a Paso' },
  { id: 'PODCAST_REFLEXIVO',      label: '🎙️ Podcast Reflexivo' },
  { id: 'MASTERCLASS_COMPRIMIDA', label: '🏛️ Masterclass Comprimida' },
  { id: 'FRAME_DISRUPTIVO',       label: '💥 Frame Disruptivo' },
];

const AWARENESS_LEVELS = [
  'Totalmente Inconsciente',
  'Consciente del Problema',
  'Consciente de la Solución',
  'Consciente del Producto',
];

const STRATEGY_LOOPS = [
  { id: 'magnetic_loop',   label: '🧲 Magnetic Loop',   color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
  { id: 'engagement_loop', label: '💬 Engagement Loop', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'authority_loop',  label: '👑 Authority Loop',  color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
  { id: 'viral_loop',      label: '🔥 Viral Loop',      color: 'border-red-500 bg-red-500/10 text-red-300' },
];

const EMOTIONAL_VECTORS = [
  { id: 'dolor_profundo', label: '💔 Dolor Profundo',      color: 'border-red-600 bg-red-900/20 text-red-300' },
  { id: 'deseo_ardiente', label: '🔥 Deseo Ardiente',      color: 'border-orange-500 bg-orange-900/20 text-orange-300' },
  { id: 'miedo_temor',    label: '😨 Miedo / Temor',       color: 'border-purple-600 bg-purple-900/20 text-purple-300' },
  { id: 'objecion_oculta',label: '🛡️ Objeción Oculta',    color: 'border-blue-500 bg-blue-900/20 text-blue-300' },
  { id: 'mito_industria', label: '💥 Mito de la Industria',color: 'border-cyan-500 bg-cyan-900/20 text-cyan-300' },
];

const VOICE_ARCHETYPES = [
  { id: 'dominante_agresivo',    label: '⚔️ Dominante',      desc: 'Sin filtros, directo al hueso',      color: 'border-red-500 bg-red-900/20 text-red-300' },
  { id: 'sabio_filosofico',      label: '🦉 Sabio',           desc: 'Profundo, reflexivo, eterno',         color: 'border-indigo-500 bg-indigo-900/20 text-indigo-300' },
  { id: 'autoridad_empatica',    label: '🤝 Autoridad Empática',desc: 'Experto que comprende tu dolor',   color: 'border-emerald-500 bg-emerald-900/20 text-emerald-300' },
  { id: 'analitico_frio',        label: '🧊 Analítico',       desc: 'Datos, lógica, irrefutable',          color: 'border-cyan-500 bg-cyan-900/20 text-cyan-300' },
  { id: 'revelador_confesional', label: '🤫 Revelador',       desc: 'Secretos que nadie dice',             color: 'border-yellow-500 bg-yellow-900/20 text-yellow-300' },
];

const INTENSITY_MODES = [
  { id: 'conservador', label: '🕊️ Conservador', color: 'border-gray-500 bg-gray-500/10 text-gray-300' },
  { id: 'equilibrado', label: '⚖️ Equilibrado', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'agresivo',    label: '🔥 Agresivo',    color: 'border-orange-500 bg-orange-500/10 text-orange-300' },
  { id: 'dominante',   label: '👑 Dominante',   color: 'border-red-500 bg-red-500/10 text-red-300' },
];

const CLOSING_OBJECTIVES = [
  { id: 'seguidores', label: '👥 Ganar Seguidores' },
  { id: 'leads',      label: '📥 Captar Leads' },
  { id: 'venta',      label: '💰 Vender' },
  { id: 'autoridad',  label: '👑 Construir Autoridad' },
];

const ELITE_HOOKS = [
  { id: 'enemigo_comun',         label: '😡 El Enemigo Común',          desc: 'Unifica contra una amenaza' },
  { id: 'verdad_impopular',      label: '🚫 La Verdad Impopular',        desc: 'Di lo que nadie se atreve' },
  { id: 'error_novato',          label: '❌ El Error de Novato',         desc: 'El fallo que todos cometen' },
  { id: 'secreto_industria',     label: '🤫 El Secreto de la Industria', desc: 'Lo que los expertos ocultan' },
  { id: 'promesa_contraintuitiva',label: '🔄 Promesa Contraintuitiva',   desc: 'Haz lo opuesto y gana más' },
];

const MASTER_HOOKS = [
  '👁️ Frame Break', '🔮 Objeto Mágico', '📸 Antes y Después', '🏃 En Movimiento',
  '👀 Sneak Peek', '⚡ Chasquido', '🚫 Stop Scroll', '❌ Mito vs Verdad',
  '😡 Enemigo Común', '⛔ Gancho Negativo', '🤡 El Ridículo', '🤫 El Secreto',
  '❓ Pregunta Provocadora', '💸 Comparación de Precio', '3️⃣ Regla de 3',
  '📊 Dato Impactante', '💰 Ahorro', '👑 Autoridad Prestada', '🧠 Autoridad Experta',
  '🎯 Francotirador', '📖 Historia Personal', '🤝 Promesa Intrigante',
  '🆕 Novedad', '☝️ La Única Cosa', '🛠️ Tutorial Rápido', '🎁 Regalo', '🪞 Identidad', '🏆 Reto',
];

const DURATIONS = [
  { id: 'short',      label: 'Flash',      sublabel: '30s',  cost: 5,  words: '~75 palabras' },
  { id: 'medium',     label: 'Estándar',   sublabel: '60s',  cost: 7,  words: '~150 palabras' },
  { id: 'long',       label: 'Profundo',   sublabel: '90s',  cost: 8,  words: '~210 palabras' },
  { id: 'masterclass',label: 'Masterclass',sublabel: '+5m', cost: 30, words: '~900 palabras' },
];

const PLATFORMS = [
  { id: 'TikTok',    icon: Video,    label: 'TikTok',    color: 'text-cyan-400',  border: 'border-cyan-500',  bg: 'bg-cyan-900/20' },
  { id: 'Reels',     icon: Instagram,label: 'Reels',     color: 'text-pink-500',  border: 'border-pink-500',  bg: 'bg-pink-900/20' },
  { id: 'YouTube',   icon: Youtube,  label: 'YouTube',   color: 'text-red-500',   border: 'border-red-500',   bg: 'bg-red-900/20' },
  { id: 'LinkedIn',  icon: Linkedin, label: 'LinkedIn',  color: 'text-blue-400',  border: 'border-blue-500',  bg: 'bg-blue-900/20' },
  { id: 'Facebook',  icon: Globe,    label: 'Facebook',  color: 'text-blue-500',  border: 'border-blue-400',  bg: 'bg-blue-800/20' },
];

// ==================================================================================
// 🔧 MICRO-COMPONENTES
// ==================================================================================

const StepBadge = ({ number, label, active }: { number: number; label: string; active?: boolean }) => (
  <div className={`flex items-center gap-3 mb-5 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shrink-0 ${
      active ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-lg shadow-pink-500/30'
             : 'bg-gray-900 border-gray-700 text-gray-500'
    }`}>{number}</div>
    <span className={`text-xs font-black uppercase tracking-[0.15em] ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
    <div className={`flex-1 h-px ${active ? 'bg-gradient-to-r from-pink-500/40 to-transparent' : 'bg-gray-800'}`} />
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#080B10] border border-white/[0.06] rounded-2xl p-5 shadow-xl relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">{children}</span>
);

// ── Indicador de fase del stream (sin gráficas, solo texto + cursor) ─────────────
const StreamPhaseBar = ({ phase, message, streamedText }: {
  phase: StreamPhase; message: string; streamedText: string;
}) => {
  if (phase === 'idle' || phase === 'complete') return null;
  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        phase === 'error' ? 'bg-red-900/20 border-red-500/30'
        : phase === 'estratega' ? 'bg-purple-900/20 border-purple-500/30'
        : 'bg-pink-900/20 border-pink-500/30'
      }`}>
        {phase !== 'error' ? (
          <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin shrink-0 ${
            phase === 'estratega' ? 'border-purple-400' : 'border-pink-400'
          }`} />
        ) : <AlertCircle size={22} className="text-red-400 shrink-0" />}
        <div>
          <p className={`text-sm font-black ${
            phase === 'estratega' ? 'text-purple-300'
            : phase === 'generador' ? 'text-pink-300'
            : 'text-red-300'
          }`}>{message}</p>
          <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-widest">
            {phase === 'estratega' && 'Motor V800 · Paso 1 / 2 · Análisis estratégico'}
            {phase === 'generador' && 'Motor V800 · Paso 2 / 2 · Generando guion'}
            {phase === 'error'     && 'Error en el pipeline — revisa los logs'}
          </p>
        </div>
      </div>
      {phase === 'generador' && streamedText.length > 0 && (
        <div className="bg-black/50 border border-white/[0.04] rounded-xl p-4 max-h-72 overflow-y-auto">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            Generando en tiempo real...
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

// ── Renderizador de los 3 bloques de salida ───────────────────────────────────────
const ResultBlocks = ({ result }: { result: any }) => {
  // Parsear bloques desde Markdown estructurado
  const rawText: string = result?.teleprompter_script || result?.guion_completo || '';

  const extractSection = (text: string, sectionName: string): string => {
    const re = new RegExp(`\\[SECCIÓN \\d+: ${sectionName}\\]([\\s\\S]*?)(?=\\[SECCIÓN|$)`, 'i');
    const match = text.match(re);
    return match ? match[1].trim() : '';
  };

  const fraseMiniatura   = result?.frase_miniatura
    || extractSection(rawText, 'FRASE MINIATURA')
    || result?.miniatura_dominante?.frase_principal
    || '';

  const teleprompter     = result?.teleprompter_script && !rawText.includes('[SECCIÓN')
    ? result.teleprompter_script
    : extractSection(rawText, 'TELEPROMPTER PROFESIONAL') || rawText;

  const planAudiovisual  = result?.plan_audiovisual_director
    || extractSection(rawText, 'PLAN AUDIOVISUAL')
    || '';

  return (
    <div className="space-y-4">

      {/* BLOQUE 1 — FRASE MINIATURA */}
      {fraseMiniatura && (
        <Card className="border-yellow-500/20">
          <Label>📌 Frase Miniatura</Label>
          <p className="text-xl font-black text-white leading-tight tracking-tight">
            {fraseMiniatura}
          </p>
        </Card>
      )}

      {/* BLOQUE 2 — TELEPROMPTER */}
      {teleprompter && (
        <Card className="border-pink-500/20">
          <Label>🎤 Teleprompter Profesional</Label>
          <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed font-mono">
            {teleprompter}
          </div>
        </Card>
      )}

      {/* BLOQUE 3 — PLAN AUDIOVISUAL */}
      {planAudiovisual && (
        <Card className="border-purple-500/20">
          <Label>🎬 Plan Audiovisual — Director's Cut</Label>
          <div className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-mono">
            {planAudiovisual}
          </div>
        </Card>
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
  const { user, userProfile } = useAuth();
  const isStateInitialized = useRef(false);

  // ── Estado de configuración (formulario) ────────────────────────────────────
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [durationId, setDurationId] = useState('medium');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedStructure, setSelectedStructure]       = useState(TITAN_STRUCTURES[0]);
  const [selectedInternalMode, setSelectedInternalMode] = useState(TITAN_STRUCTURES[0].modes[0]);
  const [selectedNarrativeFormat, setSelectedNarrativeFormat] = useState('EDUCATIVO_AUTORIDAD');

  const [strategyLoop, setStrategyLoop]     = useState('magnetic_loop');
  const [vectorEmocional, setVectorEmocional] = useState('dolor_profundo');
  const [arquetipoVoz, setArquetipoVoz]     = useState('autoridad_empatica');
  const [awareness, setAwareness]           = useState(AWARENESS_LEVELS[1]);
  const [situation, setSituation]           = useState('Dolor Agudo (Urgencia)');

  const [selectedIntensity, setSelectedIntensity] = useState('equilibrado');
  const [closingObjective, setClosingObjective]   = useState('seguidores');
  const [hookMode, setHookMode]   = useState<'elite' | 'custom' | 'arsenal'>('elite');
  const [eliteHookId, setEliteHookId]   = useState('enemigo_comun');
  const [customHook, setCustomHook]     = useState('');
  const [arsenalHook, setArsenalHook]   = useState(MASTER_HOOKS[0]);
  const [culturalContext, setCulturalContext] = useState('');

  const [experts, setExperts]             = useState<any[]>([]);
  const [selectedExpertId, setSelectedExpertId]     = useState('');
  const [knowledgeBases, setKnowledgeBases]         = useState<any[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState('');

  const [cost, setCost] = useState(7);
  useEffect(() => {
    const d = DURATIONS.find(d => d.id === durationId);
    if (d) setCost(d.cost);
  }, [durationId]);

  // ── Config para el hook ──────────────────────────────────────────────────────
  const generatorConfig: GeneratorConfig = {
    topic, selectedPlatform, durationId, selectedImage,
    selectedStructure, selectedInternalMode, selectedNarrativeFormat,
    strategyLoop, vectorEmocional, arquetipoVoz, awareness, situation,
    selectedIntensity, closingObjective,
    hookMode, eliteHookId, customHook, arsenalHook, culturalContext,
    selectedExpertId, selectedKnowledgeBaseId, cost,
  };

  const {
    streamState, isGenerating, result, error,
    handleGenerate, handleCancel, handleSave, handleCopy,
    handleConfirmSchedule, handleAudit,
    isSaving, saveSuccess,
    isAuditing, auditResult, showAudit, setShowAudit,
    isScheduleModalOpen, setIsScheduleModalOpen,
    scheduleDate, setScheduleDate,
    mostrarFeedback, setMostrarFeedback, guionParaFeedback,
  } = useScriptGenerator(generatorConfig);

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    supabase.from('expert_profiles').select('id, niche, name').eq('user_id', user.id)
      .then(({ data }) => { if (data) setExperts(data); });
    supabase.from('documents').select('id, title').eq('user_id', user.id)
      .then(({ data }) => { if (data) setKnowledgeBases(data); });

    if (location.state?.fromIdeas && !isStateInitialized.current) {
      isStateInitialized.current = true;
      if (location.state.topic)         setTopic(location.state.topic);
      if (location.state.customHook)    { setCustomHook(location.state.customHook); setHookMode('custom'); }
      if (location.state.strategyLoop)  setStrategyLoop(location.state.strategyLoop);
      if (location.state.vectorEmocional) setVectorEmocional(location.state.vectorEmocional);
      if (location.state.platform) {
        const p = PLATFORMS.find(p => p.id === location.state.platform);
        if (p) setSelectedPlatform(p);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
    if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
  }, [user, userProfile, location]);

  // ── Image handlers ───────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert('Imagen demasiado grande. Máximo 4MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setSelectedImage(b64); setImagePreview(b64);
    };
    reader.readAsDataURL(file);
  };
  const clearImage = () => { setSelectedImage(null); setImagePreview(null); };

  // ==================================================================================
  // 🎨 RENDER
  // ==================================================================================

  return (
    <>
      <style>{`
        .shimmer-btn{background-size:200% auto;animation:shimmer 3s linear infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .scrollbar-thin::-webkit-scrollbar{width:4px}
        .scrollbar-thin::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div className="max-w-7xl mx-auto pb-24 text-white" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

        {/* ── HEADER ── */}
        <div className="relative px-4 pt-8 pb-6 mb-2">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20">
                <Flame size={22} className="text-pink-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">
                  MOTOR VIRAL V800 ÉLITE
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">Prompt Stacking · TCA · Víctor Heras Method</p>
              </div>
            </div>
            <div className="bg-[#080B10] border border-white/[0.07] px-4 py-2.5 rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500">Créditos</span>
              <span className="text-lg font-black">{userProfile?.credits || 0}</span>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 px-4">

          {/* ══════════════════════════════════════════════════
              COLUMNA IZQUIERDA — CONFIGURACIÓN
          ══════════════════════════════════════════════════ */}
          <div className="space-y-3">

            {/* PASO 1 — ORIGEN */}
            <StepBadge number={1} label="El Origen — Materia Prima" active />
            <Card>
              {/* Plataforma */}
              <div className="flex gap-1.5 mb-4">
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setSelectedPlatform(p)} title={p.label}
                    className={`flex-1 py-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-[10px] font-bold ${
                      selectedPlatform.id === p.id
                        ? `${p.border} ${p.bg} ${p.color}`
                        : 'border-white/[0.04] bg-white/[0.02] text-gray-600 hover:border-white/10'
                    }`}>
                    <p.icon size={14} />
                    <span className="hidden sm:block">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="Tu idea, texto largo o descripción de la imagen..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3.5 text-sm text-white placeholder-gray-700 outline-none focus:border-pink-500/40 transition-colors resize-none" />
                <div className="absolute bottom-3 right-3 text-[10px] text-gray-700">{topic.length}</div>
              </div>

              {/* Imagen */}
              <div className="mt-3">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                    <button onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-900/80 transition-colors">
                      <X size={13} className="text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-pink-400 font-bold">📸 Imagen lista</div>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 p-3 border border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-pink-500/30 hover:bg-pink-900/5 transition-all">
                    <UploadCloud size={16} className="text-gray-600" />
                    <span className="text-xs text-gray-600">Subir imagen (JPG/PNG, máx 4MB)</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Duración */}
              <div className="mt-4">
                <Label>Duración</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATIONS.map(d => (
                    <button key={d.id} onClick={() => setDurationId(d.id)}
                      className={`py-2 rounded-lg border text-center transition-all ${
                        durationId === d.id
                          ? 'border-pink-500 bg-pink-500/10 text-pink-300'
                          : 'border-white/[0.04] bg-white/[0.02] text-gray-600 hover:border-white/10'
                      }`}>
                      <div className="text-[10px] font-black">{d.label}</div>
                      <div className="text-[9px] text-gray-600">{d.sublabel}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experto + KB */}
              {(experts.length > 0 || knowledgeBases.length > 0) && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {experts.length > 0 && (
                    <div>
                      <Label>Experto</Label>
                      <select value={selectedExpertId} onChange={e => setSelectedExpertId(e.target.value)}
                        className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2 text-xs text-white outline-none">
                        <option value="">Sin experto</option>
                        {experts.map(ex => <option key={ex.id} value={ex.id}>{ex.name || ex.niche}</option>)}
                      </select>
                    </div>
                  )}
                  {knowledgeBases.length > 0 && (
                    <div>
                      <Label>Base de Conocimiento</Label>
                      <select value={selectedKnowledgeBaseId} onChange={e => setSelectedKnowledgeBaseId(e.target.value)}
                        className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2 text-xs text-white outline-none">
                        <option value="">Sin base</option>
                        {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* PASO 2 — ARQUITECTURA */}
            <StepBadge number={2} label="Arquitectura Narrativa" active />
            <Card>
              <Label>Estructura</Label>
              <div className="space-y-1.5 mb-4">
                {TITAN_STRUCTURES.map(s => (
                  <div key={s.id}>
                    <button onClick={() => { setSelectedStructure(s); setSelectedInternalMode(s.modes[0]); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                        selectedStructure.id === s.id ? s.color : 'border-white/[0.04] bg-white/[0.02] text-gray-500 hover:border-white/10'
                      }`}>
                      <span className="text-xs font-bold">{s.label}</span>
                      {selectedStructure.id === s.id && <ChevronDown size={12} />}
                    </button>
                    {selectedStructure.id === s.id && (
                      <div className="mt-1.5 ml-2 grid grid-cols-2 gap-1">
                        {s.modes.map(m => (
                          <button key={m.id} onClick={() => setSelectedInternalMode(m)}
                            className={`text-[10px] px-2 py-1.5 rounded-lg border text-left transition-all ${
                              selectedInternalMode.id === m.id
                                ? 'border-white/20 bg-white/[0.06] text-white'
                                : 'border-white/[0.04] text-gray-600 hover:text-gray-400'
                            }`}>
                            {m.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Label>Formato Narrativo</Label>
              <div className="space-y-1">
                {NARRATIVE_FORMATS.map(f => (
                  <button key={f.id} onClick={() => setSelectedNarrativeFormat(f.id)}
                    className={`w-full px-3 py-2 rounded-lg border text-left text-xs font-bold transition-all ${
                      selectedNarrativeFormat === f.id
                        ? 'border-pink-500/40 bg-pink-900/10 text-pink-300'
                        : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* PASO 3 — PSICOLOGÍA */}
            <StepBadge number={3} label="Psicología del Guion" active />
            <Card>
              <div className="space-y-4">
                {/* Strategy Loop */}
                <div>
                  <Label>Strategy Loop ♾️</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {STRATEGY_LOOPS.map(sl => (
                      <button key={sl.id} onClick={() => setStrategyLoop(sl.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                          strategyLoop === sl.id ? sl.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        {sl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vector Emocional */}
                <div>
                  <Label>Vector Emocional</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {EMOTIONAL_VECTORS.map(ev => (
                      <button key={ev.id} onClick={() => setVectorEmocional(ev.id)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                          vectorEmocional === ev.id ? ev.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        {ev.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Arquetipo de Voz */}
                <div>
                  <Label>Arquetipo de Voz</Label>
                  <div className="space-y-1">
                    {VOICE_ARCHETYPES.map(va => (
                      <button key={va.id} onClick={() => setArquetipoVoz(va.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ${
                          arquetipoVoz === va.id ? va.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        <span className="font-bold">{va.label}</span>
                        <span className="text-[10px] opacity-60 hidden sm:block">{va.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nivel de Conciencia */}
                <div>
                  <Label>Nivel de Conciencia del Avatar</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {AWARENESS_LEVELS.map(al => (
                      <button key={al} onClick={() => setAwareness(al)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                          awareness === al
                            ? 'border-emerald-500 bg-emerald-900/20 text-emerald-300'
                            : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        {al}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* PASO 4 — DETONADOR */}
            <StepBadge number={4} label="El Detonador — Activación Final" active />
            <Card>
              {/* Intensidad */}
              <div className="mb-4">
                <Label>Intensidad</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {INTENSITY_MODES.map(im => (
                    <button key={im.id} onClick={() => setSelectedIntensity(im.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedIntensity === im.id ? im.color : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                      }`}>
                      {im.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Objetivo de Cierre */}
              <div className="mb-4">
                <Label>Objetivo de Cierre</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CLOSING_OBJECTIVES.map(co => (
                    <button key={co.id} onClick={() => setClosingObjective(co.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold text-left transition-all ${
                        closingObjective === co.id
                          ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                          : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                      }`}>
                      {co.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sistema de Gancho */}
              <div className="mb-4">
                <Label>Sistema de Gancho</Label>
                <div className="flex gap-1.5 mb-3">
                  {(['elite', 'custom', 'arsenal'] as const).map(hm => (
                    <button key={hm} onClick={() => setHookMode(hm)}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                        hookMode === hm
                          ? 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
                          : 'border-white/[0.04] text-gray-600'
                      }`}>
                      {hm === 'elite' ? '⭐ Elite' : hm === 'custom' ? '✏️ Custom' : '🗃️ Arsenal'}
                    </button>
                  ))}
                </div>

                {hookMode === 'elite' && (
                  <div className="space-y-1">
                    {ELITE_HOOKS.map(h => (
                      <button key={h.id} onClick={() => setEliteHookId(h.id)}
                        className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                          eliteHookId === h.id
                            ? 'border-yellow-500/40 bg-yellow-900/10 text-yellow-300'
                            : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        <span className="text-xs font-bold shrink-0">{h.label}</span>
                        <span className="text-[10px] text-gray-600 hidden sm:block">{h.desc}</span>
                      </button>
                    ))}
                  </div>
                )}

                {hookMode === 'custom' && (
                  <textarea value={customHook} onChange={e => setCustomHook(e.target.value)}
                    placeholder="Escribe tu gancho personalizado aquí..." rows={3}
                    className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3 text-xs text-white placeholder-gray-700 outline-none focus:border-yellow-500/40 transition-colors resize-none" />
                )}

                {hookMode === 'arsenal' && (
                  <div className="grid grid-cols-2 gap-1">
                    {MASTER_HOOKS.map(h => (
                      <button key={h} onClick={() => setArsenalHook(h)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold text-left transition-all ${
                          arsenalHook === h
                            ? 'border-yellow-500/40 bg-yellow-900/10 text-yellow-300'
                            : 'border-white/[0.04] text-gray-600 hover:border-white/10'
                        }`}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Contexto Cultural */}
              <div className="mb-5">
                <Label>Contexto Cultural (opcional)</Label>
                <input type="text" value={culturalContext} onChange={e => setCulturalContext(e.target.value)}
                  placeholder="Tendencia, meme, evento actual..."
                  className="w-full bg-black/50 border border-white/[0.07] rounded-lg p-2.5 text-xs text-white placeholder-gray-700 outline-none focus:border-pink-500/40 transition-colors" />
              </div>

              {/* CTA */}
              <button
                onClick={isGenerating ? handleCancel : handleGenerate}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isGenerating
                    ? 'bg-gray-800 border border-red-500/30 text-red-400 hover:bg-red-900/20'
                    : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500 text-white shadow-pink-900/30 shimmer-btn'
                }`}>
                {isGenerating
                  ? <><X size={16} className="text-red-400" />Cancelar Generación</>
                  : <><Zap size={16} className="text-yellow-300" />ACTIVAR MOTOR V800 · {cost} créditos</>
                }
              </button>
              <p className="text-center text-[10px] text-gray-700 mt-2">
                Prompt Stacking · TCA Víctor Heras · {DURATIONS.find(d => d.id === durationId)?.words}
              </p>
            </Card>
          </div>

          {/* ══════════════════════════════════════════════════
              COLUMNA DERECHA — RESULTADOS
          ══════════════════════════════════════════════════ */}
          <div className="space-y-4">

            {/* Banner de error */}
            {error && !isGenerating && (
              <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-300">Error en la generación</p>
                  <p className="text-xs text-red-400/80 mt-1">{error}</p>
                  <button onClick={handleGenerate} className="mt-2 text-xs text-red-300 underline underline-offset-2 hover:text-white transition-colors">
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {/* Indicador de fase del stream */}
            {isGenerating && (
              <StreamPhaseBar
                phase={streamState.phase}
                message={streamState.phaseMessage}
                streamedText={streamState.streamedText}
              />
            )}

            {/* Resultado */}
            {result ? (
              <div className="space-y-4">
                {/* Barra de acciones */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <Copy size={12} /> Copiar Teleprompter
                  </button>
                  <button onClick={handleSave} disabled={isSaving}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
                      saveSuccess
                        ? 'bg-green-900/30 border border-green-500/40 text-green-400'
                        : 'bg-white/[0.04] border border-white/[0.07] text-gray-400 hover:text-white hover:border-white/20'
                    }`}>
                    {saveSuccess ? <><CheckCircle2 size={12} /> Guardado</> : <><Save size={12} /> Guardar</>}
                  </button>
                  <button onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <CalendarIcon size={12} /> Agendar
                  </button>
                  <button onClick={handleAudit} disabled={isAuditing}
                    className="flex items-center gap-1.5 px-3 py-2 bg-pink-900/20 border border-pink-500/20 rounded-xl text-xs text-pink-400 hover:border-pink-500/40 transition-all">
                    {isAuditing ? <RefreshCw size={12} className="animate-spin" /> : <Gavel size={12} />}
                    Juez Viral
                  </button>
                  <button onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <RefreshCw size={12} /> Regenerar
                  </button>
                </div>

                {/* Los 3 bloques puros de salida */}
                <ResultBlocks result={result} />

                {/* Juez Viral */}
                {showAudit && (
                  <Card className="border-pink-500/20">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Gavel size={10} /> Juez Viral
                    </p>
                    {isAuditing ? (
                      <div className="flex flex-col items-center gap-3 py-8">
                        <Gavel className="animate-pulse text-pink-500" size={40} />
                        <p className="text-sm font-bold text-pink-400 animate-pulse">Analizando con 10 criterios virales...</p>
                      </div>
                    ) : auditResult ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-5xl font-black text-white">
                            {auditResult.veredicto_final?.score_total}
                            <span className="text-base text-gray-600">/100</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-pink-400 uppercase tracking-widest">{auditResult.veredicto_final?.clasificacion}</div>
                            <div className="text-xs text-gray-600">P. viral: {auditResult.veredicto_final?.probabilidad_viral}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-black text-green-400 uppercase block mb-2">✅ Fortalezas</span>
                            <ul className="space-y-1">
                              {auditResult.fortalezas_clave?.map((f: string, i: number) => (
                                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                  <CheckCircle2 size={11} className="text-green-500 mt-0.5 shrink-0" /> {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="text-xs font-black text-red-400 uppercase block mb-2">⚠️ Críticos</span>
                            <ul className="space-y-1">
                              {auditResult.debilidades_criticas?.map((d: any, i: number) => (
                                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                  <AlertCircle size={11} className="text-red-500 mt-0.5 shrink-0" /> {d.problema}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {auditResult.veredicto_final?.score_total < 75 && (
                          <button
                            onClick={async () => {
                              const sug = auditResult.optimizaciones_rapidas?.join('. ') || '';
                              const deb = auditResult.debilidades_criticas?.map((d: any) => d.solucion).join('. ') || '';
                              const mejoras = [sug, deb].filter(Boolean).join('. ');
                              setTopic(topic + (mejoras ? `\n\n[MEJORAS DEL JUEZ]:\n${mejoras}` : ''));
                              setShowAudit(false);
                              setTimeout(() => handleGenerate(), 100);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all">
                            <RefreshCw size={14} /> Regenerar con Mejoras
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-600">
                        <AlertCircle size={24} className="mx-auto mb-2" />
                        <p className="text-xs">No se pudo obtener la auditoría</p>
                      </div>
                    )}
                  </Card>
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
                  Configura los 4 pasos y activa el Motor V800 para generar tu próximo viral.
                </p>
                <div className="mt-6 flex flex-col gap-2 text-left w-full max-w-xs">
                  {['1 → Tema o imagen', '2 → Arquitectura narrativa', '3 → Psicología del guion', '4 → Detonador final'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-800 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modal de agendado */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#080B10] border border-white/[0.07] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
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
                <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/[0.07] rounded-xl p-3 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <span className="text-[9px] font-black text-gray-600 uppercase block mb-1">Tema</span>
                <p className="text-xs text-gray-400 italic line-clamp-2">"{topic}"</p>
              </div>
              <button onClick={handleConfirmSchedule}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-sm flex justify-center items-center gap-2 transition-all">
                Confirmar <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarFeedback && guionParaFeedback && (
        <TCAFeedbackWidget guionData={guionParaFeedback} onClose={() => setMostrarFeedback(false)} />
      )}
    </>
  );
};