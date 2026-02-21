import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Search, Copy, CheckCircle2, AlertTriangle,
  Loader2, Target, Brain, Film, Flame,
  Clapperboard, Sparkles, MoveRight, Upload,
  Trash2, Link as LinkIcon, Plus, X,
  ChevronDown, Clock, Layers,
  // 👇 Nuevos iconos para el Juez Viral 👇
  Gavel, AlertCircle, RefreshCw
} from 'lucide-react';

// --- PEGAR AQUÍ (PASO 1) ---
interface IRProState {
  etapa: "idle" | "analizando" | "refinando" | "generando" | "auditando" | "completo";
  iteracion: number;
  scoreActual: number;
  output: any | null; 
  guionGenerado: string | null;
  veredictoJuez: any | null;
  error: string | null;
}

// ==================================================================================
// 🧠 TIPOS INTERNOS
// ==================================================================================

type ContentType = 'reel' | 'long' | 'masterclass';
type UploadMode  = 'url' | 'file';

interface CreditConfig {
  label: string;
  icon: string;
  costs: { single: number; multi23: number; multi45: number };
}

const CONTENT_CONFIGS: Record<ContentType, CreditConfig> = {
  reel: {
    label: 'Reel / Short',
    icon: '🎥',
    costs: { single: 15, multi23: 25, multi45: 35 },
  },
  long: {
    label: 'Video Largo',
    icon: '🎬',
    costs: { single: 45, multi23: 65, multi45: 85 },
  },
  masterclass: {
    label: 'Masterclass',
    icon: '🎓',
    costs: { single: 60, multi23: 85, multi45: 110 },
  },
};

function computeCost(type: ContentType, urlCount: number): number {
  const cfg = CONTENT_CONFIGS[type].costs;
  if (urlCount <= 1) return cfg.single;
  if (urlCount <= 3) return cfg.multi23;
  return cfg.multi45;
}

// ============================================================
// INGENIERÍA INVERSA PRO DOMINANTE — TIPOS COMPLETOS
// 15 Motores · Compatible con Generador + Juez Viral V2
// ============================================================

// ─── MOTOR 1: Descomposición Estructural ───────────────────
export interface BloqueProfundo {
  tipo: "hook" | "setup" | "escalada" | "giro" | "climax" | "resolucion" | "cierre_estrategico";
  inicio_segundos: number;
  fin_segundos: number;
  duracion_segundos: number;
  descripcion: string;
  funcion_narrativa: string;
  intensidad: number; // 0-100
}

export interface AdnEstructura {
  bloques: BloqueProfundo[];
  tipo_apertura: string;
  tipo_cierre: string;
  proporcion_hook_porcentaje: number;
  velocidad_escalada: "lenta" | "media" | "rapida" | "explosiva";
  patron_narrativo_detectado: string;
  complejidad_estructural: number; // 0-100
}

// ─── MOTOR 2: Curva Emocional ───────────────────────────────
export interface PicoEmocional {
  segundo: number;
  emocion: string;
  intensidad: number; // 0-100
  detonante: string;
}

export interface CurvaEmocional {
  emocion_dominante: string;
  emocion_secundaria: string;
  emocion_final: string;
  picos_emocionales: PicoEmocional[];
  intensidad_promedio: number; // 0-100
  variabilidad_emocional: number; // 0-100 (qué tanto varía)
  arco_emocional: string; // descripción del recorrido emocional completo
  segmentos: Array<{
    bloque: string;
    emocion: string;
    intensidad: number;
  }>;
}

// ─── MOTOR 3: Micro-Loops y Tensión ────────────────────────
export interface MicroLoop {
  tipo: "promesa_abierta" | "cliffhanger" | "pregunta_pendiente" | "anticipacion" | "gancho_diferido";
  descripcion: string;
  segundo_apertura: number;
  segundo_cierre: number | null; // null = nunca se cierra
  intensidad: number; // 0-100
}

export interface MicroLoops {
  loops: MicroLoop[];
  total_loops: number;
  intervalo_promedio_segundos: number;
  densidad_anticipacion: number; // 0-100
  loops_sin_resolver: number;
  estrategia_tension: string;
}

// ─── MOTOR 4: Polarización ──────────────────────────────────
export interface Polarizacion {
  nivel_confrontacion: number; // 0-100
  ruptura_creencia_detectada: string;
  enemigo_implicito: string | null;
  nivel_friccion_narrativa: number; // 0-100
  mecanismo_polarizacion: string;
  afirmaciones_divisivas: string[];
  posicionamiento_vs: string; // "vs qué se posiciona el contenido"
}

// ─── MOTOR 5: Identidad Verbal ──────────────────────────────
export interface IdentidadVerbal {
  longitud_promedio_frases: number; // palabras
  ritmo_sintactico: "staccato" | "fluido" | "mixto" | "explosivo";
  proporcion_frases_cortas_pct: number;
  proporcion_frases_largas_pct: number;
  uso_metaforas: number; // 0-100
  uso_imperativos: number; // 0-100
  sofisticacion_lexica: number; // 0-100
  nivel_agresividad_verbal: number; // 0-100
  firma_linguistica: string; // descripción única del estilo
  palabras_poder_detectadas: string[];
}

// ─── MOTOR 6: Status y Posicionamiento ─────────────────────
export interface StatusYPosicionamiento {
  tipo_autoridad: "mentor" | "rebelde" | "experto_tecnico" | "disruptor" | "insider" | "testigo" | "transformado";
  experiencia_proyectada: "implicita" | "explicita" | "mixta";
  rol_narrativo: string;
  nivel_confianza_percibida: number; // 0-100
  distancia_con_audiencia: "cercana" | "media" | "distante";
  prueba_social_detectada: boolean;
  mecanismos_autoridad: string[];
}

// ─── MOTOR 7: Densidad de Valor ────────────────────────────
export interface DensidadValor {
  valor_por_minuto: number; // 0-100
  porcentaje_contenido_abierto: number; // % de contenido que genera más preguntas
  porcentaje_contenido_cerrado: number; // % de contenido que entrega respuestas
  profundidad_insight: number; // 0-100
  micro_aprendizajes: string[]; // lista de aprendizajes concretos detectados
  ratio_promesa_entrega: number; // cuánto promete vs cuánto entrega
  tipo_valor_dominante: "educativo" | "inspiracional" | "entretenimiento" | "provocacion" | "solucion";
}

// ─── MOTOR 8: Manipulación de Atención ─────────────────────
export interface ManipulacionAtencion {
  cambios_ritmo: Array<{ segundo: number; tipo: string; descripcion: string }>;
  interrupciones_patron: number; // conteo
  reencuadres_mentales: string[];
  golpes_narrativos: Array<{ segundo: number; descripcion: string; impacto: number }>;
  reactivaciones_atencion: number; // conteo
  tecnicas_detalladas: string[];
  frecuencia_estimulacion: number; // 0-100 (qué tan seguido activa la atención)
}

// ─── MOTOR 9: Activadores de Guardado ──────────────────────
export interface ActivadorGuardado {
  tipo: "frase_memorable" | "reencuadre" | "dato_contraintuitivo" | "formula_repetible" | "revelacion";
  contenido: string;
  segundo_aproximado: number;
  potencia_guardado: number; // 0-100
}

// ─── MOTOR 10: Adaptabilidad al Nicho ──────────────────────
export interface AdaptabilidadNicho {
  contexto_usuario: string;
  sofisticacion_audiencia_target: "basica" | "intermedia" | "avanzada" | "experta";
  nivel_conciencia_mercado: number; // 0-100
  intensidad_psicologica_tolerable: number; // 0-100
  ajustes_necesarios: string[];
  riesgos_adaptacion: string[];
}

// ─── MOTOR 11: Anti-Saturación ─────────────────────────────
export interface ElementoCliché {
  tipo: "frase_cliche" | "hook_generico" | "formula_repetida" | "plantilla_obvia";
  contenido: string;
  nivel_saturacion: number; // 0-100
  alternativa_sugerida: string;
}

// ─── MOTOR 12: Ritmo Narrativo ──────────────────────────────
export interface RitmoNarrativo {
  velocidad_progresion: "lenta" | "media" | "rapida" | "variable";
  intervalo_promedio_entre_estimulos_seg: number;
  variacion_intensidad: number; // 0-100 (qué tan variable es)
  fluidez_estructural: number; // 0-100
  momentos_pausa: number; // conteo de pausas narrativas intencionales
  aceleraciones: Array<{ segundo: number; causa: string }>;
}

// ─── MOTOR 13: Score Viral Estructural ──────────────────────
export interface ScoreViralEstructural {
  retencion_estructural: number; // 0-100
  intensidad_emocional: number; // 0-100
  polarizacion: number; // 0-100
  manipulacion_atencion: number; // 0-100
  densidad_valor: number; // 0-100
  viralidad_estructural_global: number; // 0-100
  // Breakdown por motor
  breakdown_motores: Record<string, number>;
}

// ─── MOTOR 14: Adaptación Estratégica ───────────────────────
// El guion_adaptado_al_nicho es string directo en el output principal

// ─── MOTOR 15: Blueprint para Conexión Directa ──────────────
export interface BlueprintReplicable {
  nombre_patron: string;
  formula_base: string;
  pasos_estructurales: string[];
  equivalencias_estructurales: {
    hook_type: string;
    escalation_pattern: string;
    giro_type: string;
    closure_type: string;
  };
  equivalencias_psicologicas: {
    emocion_entrada: string;
    emocion_escalada: string;
    emocion_salida: string;
    tension_type: string;
    activation_mechanism: string;
  };
  equivalencias_verbales: {
    ritmo: string;
    agresividad: string;
    sofisticacion: string;
  };
  instrucciones_para_generador: string;
  instrucciones_para_juez_viral: string;
}

// ─── MOTOR 16: Análisis TCA ─────────────────────────────────
export type NivelTCA = "N0" | "N1" | "N2" | "N3" | "N4";

export interface AnalisisTCA {
  nivel_tca_detectado: NivelTCA;
  sector_detectado: string;
  tipo_alcance: string;
  mass_appeal_score: number;
  equilibrio_masividad_calificacion: boolean;
  diagnostico_tca: string;
  capa_visible: string;
  capa_estrategica: string;
  filtro_audiencia_implicito: string;
  tipo_trafico_que_atrae: string;
  nivel_conversion_probable: "bajo" | "medio" | "alto" | "muy_alto";
  esta_muy_tecnico: boolean;
  esta_muy_mainstream: boolean;
}

export interface MapaAdaptacionTCA {
  nivel_tca_recomendado: string;
  sector_recomendado: string;
  nuevo_hook_sectorial: string;
  nueva_capa_visible: string;
  capa_estrategica_conservada: string;
  estructura_espejo: boolean;
  version_tecnica: string;
  version_equilibrio_ideal: string;
  version_sector_masivo: string;
  advertencia_micronicho: string | null;
}

// ─── OUTPUT COMPLETO ────────────────────────────────────────
export interface IngenieriaInversaProOutput {
  // Metadata
  url_analizada: string;
  nicho_origen: string;
  nicho_usuario: string;
  timestamp: string;
  iteracion_loop: number;

  // 15 Motores
  adn_estructura: AdnEstructura;
  curva_emocional: CurvaEmocional;
  micro_loops: MicroLoops;
  polarizacion: Polarizacion;
  identidad_verbal: IdentidadVerbal;
  status_y_posicionamiento: StatusYPosicionamiento;
  densidad_valor: DensidadValor;
  manipulacion_atencion: ManipulacionAtencion;
  activadores_guardado: ActivadorGuardado[];
  adaptabilidad_nicho: AdaptabilidadNicho;
  elementos_cliche_detectados: ElementoCliché[];
  ritmo_narrativo: RitmoNarrativo;
  score_viral_estructural: ScoreViralEstructural;

  // Motor 14 Output
  guion_adaptado_al_nicho: string;
  guion_adaptado_espejo: string;
  analisis_tca: AnalisisTCA;
  mapa_de_adaptacion: MapaAdaptacionTCA;
  validacion_olimpo?: {
    arquitectura_completa: boolean;
    loops_reales_detectados: boolean;
    nivel_tca_identificado: boolean;
    equilibrio_ideal_detectado: boolean;
    filtro_implicito_extraido: boolean;
    adaptacion_sin_micronicho: boolean;
    adn_estructural_conservado: boolean;
    score_validacion: number;
  };;

  // Motor 15 Output — Blueprint para Generador + Juez
  blueprint_replicable: BlueprintReplicable;

  // Extras
  recomendaciones_estrategicas: string[];
  alertas_criticas: string[];

  // Loop info
  loop_alcanzado_minimo: boolean;
  score_final_obtenido: number;
}

// ─── PARÁMETROS DE ENTRADA ──────────────────────────────────
export interface IngenieriaInversaProParams {
  transcripcion: string;
  url: string;
  nicho_origen: string;       // nicho del video analizado
  nicho_usuario: string;      // nicho del usuario (para adaptación)
  objetivo_usuario: string;   // qué quiere lograr el usuario
  umbral_score_minimo?: number; // default: 75
  max_iteraciones?: number;     // default: 3
}

// ==================================================================================
// 🎬 SUB-COMPONENTE: ANÁLISIS ESTRATÉGICO
// ==================================================================================

const OmegaStrategy = ({ analysis }: { analysis: any }) => {
  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      {/* Tarjeta 1: Psicología */}
      <div className="bg-[#0f1115] border border-purple-500/20 rounded-xl p-5 relative overflow-hidden hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10"><Brain size={60} /></div>
        <h4 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
          <Brain size={12} /> Psicología Replicada
        </h4>
        <p className="text-white text-sm font-bold leading-relaxed">
          {analysis.sesgo_cognitivo_detectado || 'Análisis psicológico aplicado'}
        </p>
        <div className="mt-3 px-2 py-1 bg-purple-500/10 rounded text-purple-300 text-[10px] font-mono inline-block border border-purple-500/20">
          TRIGGER ACTIVO
        </div>
      </div>

      {/* Tarjeta 2: Estrategia */}
      <div className="col-span-2 bg-[#0f1115] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10"><Target size={60} /></div>
        <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
          <Target size={12} /> Estrategia de Adaptación
        </h4>
        <p className="text-white text-sm font-medium leading-relaxed">
          {analysis.estrategia_adaptacion || 'Estructura viral adaptada a tu nicho'}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-400"
              style={{ width: analysis.nivel_fidelidad || '98%' }}
            />
          </div>
          <span className="text-[10px] text-green-400 font-black tracking-wider">
            {analysis.nivel_fidelidad || '98%'} FIDELIDAD
          </span>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 📜 SUB-COMPONENTE: GUION FINAL
// ==================================================================================

const OmegaScriptView = ({ scriptData }: { scriptData: any }) => {
  const [copied, setCopied] = useState(false);

  const scriptText =
    scriptData.guion_adaptado_al_nicho ||
    scriptData.guion_tecnico_completo ||
    scriptData.guion_completo;
  const visualPlan =
    scriptData.plan_visual_director ||
    scriptData.plan_visual_adaptado ||
    scriptData.plan_visual;

  const copyScript = () => {
    if (!scriptText) return;
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#080808] border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_-20px_rgba(34,197,94,0.15)] animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="bg-green-900/10 border-b border-green-500/20 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
              READY TO SHOOT
            </span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
            <Clapperboard className="text-green-400" size={20} /> GUION DE PRODUCCIÓN
          </h3>
        </div>
        <button
          onClick={copyScript}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-green-900/20 active:scale-95 w-full sm:w-auto justify-center"
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? 'COPIADO' : 'COPIAR TELEPROMPTER'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Dirección de cámara */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0c0c0c] flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[#0f1115] sticky top-0 z-10">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Film size={12} /> Dirección de Cámara & Audio
            </h4>
          </div>
          <div className="p-6 space-y-8 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-800">
            {visualPlan?.map((scene: any, idx: number) => (
              <div key={idx} className="relative pl-4 border-l-2 border-gray-800 text-xs group hover:border-green-500/50 transition-colors">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-gray-800 border border-gray-700 group-hover:bg-green-500 group-hover:border-green-400 transition-colors" />
                <span className="text-green-400 font-mono font-bold block mb-2 text-[10px] bg-green-900/10 inline-block px-1 rounded">
                  {scene.tiempo}
                </span>
                {(scene.accion_camara || scene.instruccion_produccion) && (
                  <div className="mb-2 text-blue-300 font-bold flex items-start gap-1.5 leading-tight">
                    <span className="opacity-50 mt-0.5">🎥</span>
                    {scene.accion_camara || scene.instruccion_produccion}
                  </div>
                )}
                <p className="text-gray-300 font-medium leading-relaxed mb-2">
                  {scene.descripcion_visual || scene.accion_adaptada || scene.accion_en_pantalla}
                </p>
                {(scene.audio_sfx || scene.audio) && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-orange-400/90 text-[10px] font-mono flex items-center gap-1.5">
                    <span className="opacity-70">🔊</span> {scene.audio_sfx || scene.audio}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Teleprompter */}
        <div className="lg:col-span-8 bg-[#080808] p-8 flex flex-col">
          <div className="prose prose-invert max-w-none flex-1">
            <div className="whitespace-pre-wrap font-mono text-base md:text-lg leading-loose text-gray-200 selection:bg-green-500/30">
              {scriptText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 🏷️ SUB-COMPONENTE: BADGE DE COSTO DINÁMICO
// ==================================================================================

const CreditBadge = ({
  contentType,
  urlCount,
}: {
  contentType: ContentType;
  urlCount: number;
}) => {
  const cost = computeCost(contentType, urlCount);
  const cfg = CONTENT_CONFIGS[contentType];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f1115] border border-green-500/20 rounded-lg text-xs">
      <span>{cfg.icon}</span>
      <span className="text-gray-400">{cfg.label}</span>
      {urlCount > 1 && (
        <>
          <span className="text-gray-600">·</span>
          <span className="text-blue-400 font-bold">{urlCount} URLs</span>
        </>
      )}
      <span className="text-gray-600">·</span>
      <span className="text-green-400 font-black">{cost} CR</span>
    </div>
  );
};



// ==================================================================================
// ⚖️ SUB-COMPONENTE: TARJETA DE AUDITORÍA (JUEZ VIRAL)
// ==================================================================================

// ─── TARJETA: ACTIVADORES DE GUARDADO ───
const ActivadoresCard = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const colorTipo: Record<string, string> = {
    frase_memorable: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    reencuadre: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    dato_contraintuitivo: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    formula_repetible: "text-green-400 bg-green-500/10 border-green-500/20",
    revelacion: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  };

  return (
    <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={12} /> Activadores de Guardado
      </h4>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-5xl font-black text-purple-400">{data.length}</span>
        <span className="text-gray-500 font-bold">detectados</span>
      </div>
      <div className="space-y-3">
        {data.slice(0, 5).map((activador: any, i: number) => {
          const badge = colorTipo[activador.tipo] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
          const potencia = activador.potencia_guardado || 0;
          return (
            <div key={i} className="bg-[#080808] rounded-xl p-3 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badge}`}>
                  {(activador.tipo || "").replace(/_/g, " ")}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${potencia}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-400"
                    />
                  </div>
                  <span className="text-[10px] text-purple-400 font-black">{potencia}</span>
                </div>
              </div>
              {activador.contenido && (
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {activador.contenido}
                </p>
              )}
              {activador.segundo_aproximado && (
                <p className="text-[9px] text-gray-600">
                  ≈ segundo {activador.segundo_aproximado}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── TARJETA: DENSIDAD DE VALOR ───
const DensidadValorCard = ({ data }: { data: any }) => {
  if (!data) return null;

  const tipoValor = data.tipo_valor_dominante || "educativo";
  const colorTipo: Record<string, string> = {
    educativo: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    inspiracional: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    entretenimiento: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    provocacion: "text-red-400 bg-red-500/10 border-red-500/20",
    solucion: "text-green-400 bg-green-500/10 border-green-500/20",
  };
  const badgeColor = colorTipo[tipoValor] || "text-gray-400 bg-gray-500/10 border-gray-500/20";

  return (
    <div className="bg-[#0f1115] border border-green-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Sparkles size={12} /> Densidad de Valor
      </h4>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${badgeColor}`}>
          {tipoValor}
        </span>
      </div>
      <div className="space-y-3 mb-4">
        {[
          { label: "Valor por minuto", val: data.valor_por_minuto || 0 },
          { label: "Profundidad insight", val: data.profundidad_insight || 0 },
          { label: "Contenido abierto", val: data.porcentaje_contenido_abierto || 0 },
          { label: "Contenido cerrado", val: data.porcentaje_contenido_cerrado || 0 },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.val}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
              />
            </div>
          </div>
        ))}
      </div>
      {data.ratio_promesa_entrega && (
        <div className="flex justify-between text-xs mb-4">
          <span className="text-gray-400">Ratio promesa/entrega</span>
          <span className={`font-black ${data.ratio_promesa_entrega > 1 ? "text-red-400" : "text-green-400"}`}>
            {data.ratio_promesa_entrega}x
          </span>
        </div>
      )}
      {data.micro_aprendizajes?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">Micro-aprendizajes</p>
          {data.micro_aprendizajes.slice(0, 4).map((m: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-gray-400">
              <span className="text-green-500 mt-0.5">▪</span> {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TARJETA: STATUS Y POSICIONAMIENTO ───
const StatusCard = ({ data }: { data: any }) => {
  if (!data) return null;

  const tipoAutoridad = data.tipo_autoridad || "No detectado";
  const colorMap: Record<string, string> = {
    mentor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    rebelde: "text-red-400 bg-red-500/10 border-red-500/20",
    experto_tecnico: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    disruptor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    insider: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    testigo: "text-green-400 bg-green-500/10 border-green-500/20",
    transformado: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  };
  const badgeColor = colorMap[tipoAutoridad] || "text-gray-400 bg-gray-500/10 border-gray-500/20";

  return (
    <div className="bg-[#0f1115] border border-yellow-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap size={12} /> Status y Posicionamiento
      </h4>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-full border ${badgeColor}`}>
          {tipoAutoridad.replace(/_/g, " ")}
        </span>
        {data.prueba_social_detectada && (
          <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full border text-green-400 bg-green-500/10 border-green-500/20">
            ✓ Prueba social
          </span>
        )}
      </div>
      <div className="space-y-3 mb-4">
        {[
          { label: "Confianza percibida", val: data.nivel_confianza_percibida || 0 },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.val}%` }}
                className="h-full bg-gradient-to-r from-yellow-600 to-amber-400"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        {data.experiencia_proyectada && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Experiencia proyectada</span>
            <span className="text-yellow-400 font-black uppercase">{data.experiencia_proyectada}</span>
          </div>
        )}
        {data.distancia_con_audiencia && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Distancia con audiencia</span>
            <span className="text-yellow-400 font-black uppercase">{data.distancia_con_audiencia}</span>
          </div>
        )}
      </div>
      {data.rol_narrativo && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Rol narrativo</p>
          <p className="text-xs text-yellow-300">{data.rol_narrativo}</p>
        </div>
      )}
      {data.mecanismos_autoridad?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">Mecanismos de autoridad</p>
          {data.mecanismos_autoridad.slice(0, 4).map((m: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-gray-400">
              <span className="text-yellow-500 mt-0.5">▪</span> {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TARJETA: IDENTIDAD VERBAL ───
const IdentidadVerbalCard = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-[#0f1115] border border-cyan-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Brain size={12} /> Identidad Verbal
      </h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Agresividad", val: data.nivel_agresividad_verbal || 0, color: "text-red-400" },
          { label: "Sofisticación", val: data.sofisticacion_lexica || 0, color: "text-blue-400" },
          { label: "Metáforas", val: data.uso_metaforas || 0, color: "text-purple-400" },
          { label: "Imperativos", val: data.uso_imperativos || 0, color: "text-orange-400" },
        ].map(item => (
          <div key={item.label} className="bg-[#080808] rounded-xl p-3 border border-white/5 text-center">
            <span className={`text-2xl font-black ${item.color}`}>{item.val}</span>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        {[
          { label: "Frases cortas", val: data.proporcion_frases_cortas_pct || 0 },
          { label: "Frases largas", val: data.proporcion_frases_largas_pct || 0 },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.val}%` }}
                className="h-full bg-gradient-to-r from-cyan-600 to-teal-400"
              />
            </div>
          </div>
        ))}
      </div>
      {data.ritmo_sintactico && (
        <div className="flex justify-between text-xs mb-3">
          <span className="text-gray-400">Ritmo sintáctico</span>
          <span className="text-cyan-400 font-black uppercase">{data.ritmo_sintactico}</span>
        </div>
      )}
      {data.firma_linguistica && (
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Firma lingüística</p>
          <p className="text-xs text-cyan-300">{data.firma_linguistica}</p>
        </div>
      )}
      {data.palabras_poder_detectadas?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.palabras_poder_detectadas.slice(0, 8).map((p: string, i: number) => (
            <span key={i} className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TARJETA: POLARIZACIÓN ───
const PolarizacionCard = ({ data }: { data: any }) => {
  if (!data) return null;
  const nivel = data.nivel_confrontacion || 0;
  const color = nivel >= 70 ? "text-red-400" : nivel >= 40 ? "text-orange-400" : "text-yellow-400";
  const borderColor = nivel >= 70 ? "border-red-500/30" : nivel >= 40 ? "border-orange-500/30" : "border-yellow-500/30";

  return (
    <div className={`bg-[#0f1115] border ${borderColor} rounded-2xl p-6`}>
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Flame size={12} /> Polarización
      </h4>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-black ${color}`}>{nivel}</span>
        <span className="text-gray-500 font-bold">/100</span>
      </div>
      <div className="space-y-3 mb-4">
        {[
          { label: "Confrontación", val: data.nivel_confrontacion || 0, max: 100 },
          { label: "Fricción narrativa", val: data.nivel_friccion_narrativa || 0, max: 100 },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${item.val}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-orange-400"
              />
            </div>
          </div>
        ))}
      </div>
      {data.ruptura_creencia_detectada && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Creencia que rompe</p>
          <p className="text-xs text-orange-300">{data.ruptura_creencia_detectada}</p>
        </div>
      )}
      {data.enemigo_implicito && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Enemigo implícito</p>
          <p className="text-xs text-red-300">{data.enemigo_implicito}</p>
        </div>
      )}
      {data.afirmaciones_divisivas?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">Afirmaciones divisivas</p>
          {data.afirmaciones_divisivas.slice(0, 3).map((a: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[10px] text-gray-400">
              <span className="text-orange-500 mt-0.5">▪</span> {a}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TARJETA: ÍNDICE DE FIDELIDAD ───
const FidelidadCard = ({ data }: { data: any }) => {
  if (!data) return null;
  const color = data.indice_fidelidad >= 80
    ? "text-green-400" : data.indice_fidelidad >= 60
    ? "text-yellow-400" : "text-red-400";
  const borderColor = data.indice_fidelidad >= 80
    ? "border-green-500/30" : data.indice_fidelidad >= 60
    ? "border-yellow-500/30" : "border-red-500/30";

  return (
    <div className={`bg-[#0f1115] border ${borderColor} rounded-2xl p-6`}>
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Layers size={12} /> Índice de Fidelidad Arquitectónica
      </h4>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-black ${color}`}>
          {data.indice_fidelidad || 0}
        </span>
        <span className="text-gray-500 font-bold">/100</span>
      </div>
      <div className="space-y-3 mb-4">
        {[
          { label: "Bloques detectados", val: data.bloques_detectados, max: 7 },
          { label: "Bloques en orden", val: data.bloques_replicados, max: data.bloques_detectados || 7 },
          { label: "Intensidad equivalente", val: data.intensidad_equivalente, max: 100 },
          { label: "Curva conservada", val: data.curva_conservada, max: 100 },
        ].map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-white">{item.val}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, (item.val / item.max) * 100)}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400"
              />
            </div>
          </div>
        ))}
      </div>
      <div className={`text-xs font-medium px-3 py-2 rounded-lg ${
        data.indice_fidelidad >= 80
          ? "bg-green-500/10 text-green-300"
          : data.indice_fidelidad >= 60
          ? "bg-yellow-500/10 text-yellow-300"
          : "bg-red-500/10 text-red-300"
      }`}>
        {data.diagnostico}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
        <span>Secuencia respetada:</span>
        <span className={data.secuencia_respetada ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
          {data.secuencia_respetada ? "✓ SÍ" : "✗ NO"}
        </span>
      </div>
    </div>
  );
};

// ─── TARJETA: MICRO-LOOPS ───
const MicroLoopsCard = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-[#0f1115] border border-blue-500/30 rounded-2xl p-6">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <RefreshCw size={12} /> Sistema de Micro-Loops
      </h4>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", val: data.total_loops, color: "text-blue-400" },
          { label: "Resueltos", val: data.loops_resueltos, color: "text-green-400" },
          { label: "Sin resolver", val: data.loops_sin_resolver, color: "text-orange-400" },
        ].map(item => (
          <div key={item.label} className="text-center bg-[#080808] rounded-xl p-3 border border-white/5">
            <span className={`text-2xl font-black ${item.color}`}>{item.val}</span>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Frecuencia promedio</span>
          <span className="text-white font-bold">
            {data.frecuencia_promedio_segundos > 0
              ? `cada ${data.frecuencia_promedio_segundos}s`
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Efectividad potencial</span>
          <span className="text-white font-bold">{data.efectividad_potencial}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            style={{ width: `${data.efectividad_potencial}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
          />
        </div>
      </div>
      {data.distribucion?.length > 0 && (
        <div className="space-y-1.5 mb-4">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest">Tipos detectados</p>
          {data.distribucion.map((d: any) => (
            <div key={d.tipo} className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400 capitalize">{d.tipo.replace(/_/g, " ")}</span>
              <span className="text-blue-400 font-bold">{d.cantidad} ({d.porcentaje}%)</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-xs font-medium px-3 py-2 rounded-lg bg-blue-500/10 text-blue-300">
        {data.diagnostico_loops}
      </div>
    </div>
  );
};

// ─── TARJETA: PAQUETE JUEZ VIRAL ───
const PaqueteJuezCard = ({ data, onAudit, isAuditing }: {
  data: any;
  onAudit: () => void;
  isAuditing: boolean;
}) => {
  if (!data) return null;

  return (
    <div className={`bg-[#0f1115] border rounded-2xl p-6 ${
      data.listo_para_juez ? "border-purple-500/30" : "border-gray-700/30"
    }`}>
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Gavel size={12} /> Preparación para Auditoría
      </h4>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={data.score_preparacion >= 60 ? "#a855f7" : "#6b7280"}
              strokeWidth="3"
              strokeDasharray={`${data.score_preparacion} 100`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
            {data.score_preparacion}%
          </span>
        </div>
        <div>
          <p className={`text-sm font-black ${data.listo_para_juez ? "text-purple-400" : "text-gray-400"}`}>
            {data.listo_para_juez ? "LISTO PARA AUDITAR" : "PREPARACIÓN INCOMPLETA"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {data.criterios_cumplidos}/{data.total_criterios} criterios cumplidos
          </p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {data.criterios_validacion?.map((c: any) => (
          <div key={c.criterio} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={c.cumple ? "text-green-400" : "text-red-400"}>
                {c.cumple ? "✓" : "✗"}
              </span>
              <span className="text-gray-400">{c.criterio}</span>
            </div>
            <span className={`font-bold ${c.cumple ? "text-green-400" : "text-red-400"}`}>
              {c.valor_esperado}
            </span>
          </div>
        ))}
      </div>
      {data.alertas_criticas?.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {data.alertas_criticas.map((alerta: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 text-[10px] text-orange-300 bg-orange-500/5 border border-orange-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={10} className="mt-0.5 shrink-0" />
              {alerta}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onAudit}
        disabled={isAuditing}
        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all ${
          data.listo_para_juez
            ? "bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:scale-105"
            : "bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed"
        } disabled:opacity-50 disabled:scale-100`}
      >
        {isAuditing ? <RefreshCw className="animate-spin" size={16} /> : <Gavel size={16} />}
        {isAuditing ? "AUDITANDO..." : "AUDITAR CON JUEZ VIRAL (2 CR)"}
      </button>
    </div>
  );
};

const OmegaAuditCard = ({ auditData, onAudit, isAuditing }: { auditData: any, onAudit: () => void, isAuditing: boolean }) => {
  if (!auditData) {
    return (
      <div className="mt-8 flex justify-center">
        <button
          onClick={onAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-xl text-purple-300 font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
        >
          {isAuditing ? <RefreshCw className="animate-spin" size={18} /> : <Gavel size={18} />}
          {isAuditing ? 'JUZGANDO...' : 'AUDITAR CALIDAD (2 CR)'}
        </button>
      </div>
    );
  }

  const score = auditData.veredicto_final?.score_total || 0;
  const color = score >= 90 ? 'text-purple-400' : score >= 70 ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="mt-8 bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Gavel size={80} /></div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-white/5 pb-6 mb-6">
        <div className="flex-1">
          <h4 className="text-purple-400 text-xs font-black uppercase tracking-widest mb-1">Veredicto del Juez</h4>
          <p className="text-white text-lg font-bold">{auditData.veredicto_final?.clasificacion}</p>
        </div>
        <div className="text-center bg-purple-900/10 px-6 py-3 rounded-xl border border-purple-500/20">
          <span className={`text-4xl font-black ${color}`}>{score}</span>
          <span className="text-xs text-gray-500 block font-bold uppercase mt-1">Viral Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 size={12} /> Fortalezas
          </h5>
          <ul className="space-y-2">
            {auditData.fortalezas_clave?.slice(0, 3).map((f: string, i: number) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">▪</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertTriangle size={12} /> Puntos Críticos
          </h5>
          <ul className="space-y-2">
            {auditData.debilidades_criticas?.slice(0, 3).map((d: any, i: number) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">▪</span> {d.problema || d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ─── TARJETA TCA — ANÁLISIS DE MASIVIDAD ───
const TcaCard = ({ tca, mapa, nicho }: { tca: any; mapa: any; nicho?: string }) => {
  if (!tca) return null;

  const nivelColors: Record<string, string> = {
    N0: "text-gray-400 border-gray-700",
    N1: "text-blue-400 border-blue-500/30",
    N2: "text-cyan-400 border-cyan-500/30",
    N3: "text-green-400 border-green-500/30",
    N4: "text-red-400 border-red-500/30",
  };
  const nivelLabels: Record<string, string> = {
    N0: "Micronicho técnico",
    N1: "Nicho general",
    N2: "Temática amplia",
    N3: "Sector masivo",
    N4: "Mainstream sin filtro",
  };
  const conversionColors: Record<string, string> = {
    bajo: "text-red-400",
    medio: "text-yellow-400",
    alto: "text-green-400",
    muy_alto: "text-emerald-400",
  };

  const nivel = tca.nivel_tca_detectado || "N1";
  const colorClass = nivelColors[nivel] || nivelColors.N1;

  return (
    <div className={`bg-[#0f1115] border rounded-2xl p-6 ${colorClass.split(' ')[1]}`}>
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
        <Target size={12} /> Análisis TCA — Nivel de Masividad
      </h4>

      {/* Nivel TCA + Mass Appeal */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`text-5xl font-black ${colorClass.split(' ')[0]}`}>{nivel}</div>
        <div className="flex-1">
          <p className={`text-sm font-black ${colorClass.split(' ')[0]}`}>{nivelLabels[nivel]}</p>
          <p className="text-[10px] text-gray-500 mt-1">{tca.sector_detectado} — {tca.tipo_alcance}</p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${tca.mass_appeal_score}%` }}
              className="h-full bg-gradient-to-r from-cyan-600 to-green-400 transition-all duration-1000"
            />
          </div>
          <p className="text-[9px] text-gray-600 mt-1">Mass Appeal: {tca.mass_appeal_score}/100</p>
        </div>
      </div>

      {/* Equilibrio */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs font-bold ${
        tca.equilibrio_masividad_calificacion
          ? "bg-green-500/10 text-green-300 border border-green-500/20"
          : "bg-orange-500/10 text-orange-300 border border-orange-500/20"
      }`}>
        <span>{tca.equilibrio_masividad_calificacion ? "✓" : "⚠"}</span>
        {tca.diagnostico_tca}
      </div>

      {/* Capas */}
      <div className="space-y-2 mb-4">
        {[
          { label: "Capa visible", val: tca.capa_visible, color: "text-cyan-400" },
          { label: "Capa estratégica", val: tca.capa_estrategica, color: "text-purple-400" },
          { label: "Filtro implícito", val: tca.filtro_audiencia_implicito, color: "text-yellow-400" },
          { label: "Tráfico que atrae", val: tca.tipo_trafico_que_atrae, color: "text-gray-300" },
        ].map(item => (
          <div key={item.label} className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest">{item.label}</p>
            <p className={`text-xs font-bold mt-0.5 ${item.color}`}>{item.val || '—'}</p>
          </div>
        ))}
      </div>

      {/* Conversión */}
      <div className="flex justify-between items-center text-xs mb-4">
        <span className="text-gray-500">Conversión probable:</span>
        <span className={`font-black uppercase ${conversionColors[tca.nivel_conversion_probable] || 'text-gray-400'}`}>
          {tca.nivel_conversion_probable?.replace('_', ' ') || '—'}
        </span>
      </div>

      {/* Alertas */}
      {(tca.esta_muy_tecnico || tca.esta_muy_mainstream) && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-300 font-bold mb-4">
          {tca.esta_muy_tecnico && "⚠ Muy técnico — bajo alcance potencial"}
          {tca.esta_muy_mainstream && "⚠ Demasiado mainstream — baja conversión esperada"}
        </div>
      )}

      {/* Mapa de adaptación */}
      {mapa && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">
            Mapa de Expansión → {nicho || 'Tu Nicho'}
          </p>
          <div className="space-y-2">
            <div className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase">Nivel TCA recomendado</p>
              <p className="text-xs font-black text-green-400 mt-0.5">{mapa.nivel_tca_recomendado}</p>
            </div>
            <div className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
              <p className="text-[9px] text-gray-600 uppercase">Nuevo hook sectorial</p>
              <p className="text-xs font-bold text-white mt-0.5 italic">"{mapa.nuevo_hook_sectorial}"</p>
            </div>
            {[
              { label: "Versión técnica (N0-N1)", val: mapa.version_tecnica },
              { label: "Versión equilibrio ideal (N2-N3)", val: mapa.version_equilibrio_ideal },
              { label: "Versión sector masivo (N3)", val: mapa.version_sector_masivo },
            ].map(v => (
              <div key={v.label} className="bg-[#080808] rounded-lg px-3 py-2 border border-white/5">
                <p className="text-[9px] text-gray-600 uppercase">{v.label}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{v.val || '—'}</p>
              </div>
            ))}
            {mapa.advertencia_micronicho && (
              <div className="px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] text-orange-300">
                ⚠ {mapa.advertencia_micronicho}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 📊 COMPONENTES PRO: 15 MOTORES VISUALES
// ==================================================================================

const IRProScoreCard = ({ score }: { score: any }) => (
  <div className="bg-[#0f1115] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
    <h3 className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
      <Zap size={12} fill="currentColor" /> Score Viral Estructural
    </h3>
    <div className="flex items-baseline gap-2 mb-6">
      <span className="text-5xl font-black text-white">{score.viralidad_estructural_global || 0}</span>
      <span className="text-gray-500 font-bold">/100</span>
    </div>
    <div className="space-y-4">
      {[
        { label: "Retención", val: score.retencion_estructural, color: "bg-blue-500" },
        { label: "Emoción", val: score.intensidad_emocional, color: "bg-pink-500" },
        { label: "Polarización", val: score.polarizacion, color: "bg-orange-500" },
        { label: "Atención", val: score.manipulacion_atencion, color: "bg-purple-500" },
        { label: "Valor", val: score.densidad_valor, color: "bg-green-500" },
      ].map(item => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white">{item.val}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${item.val}%` }} 
              className={`h-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-1000`} 
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MotoresActivosCard = ({ output }: { output: any }) => {
  const motores = [
    { num: "01", nombre: "Estructura", dato: output.adn_estructura?.patron_narrativo_detectado },
    { num: "02", nombre: "Emoción", dato: output.curva_emocional?.emocion_dominante },
    { num: "03", nombre: "Loops", dato: `${output.micro_loops?.total_loops || 0} loops` },
    { num: "04", nombre: "Polarización", dato: output.polarizacion?.posicionamiento_vs },
    { num: "05", nombre: "Voz", dato: output.identidad_verbal?.ritmo_sintactico },
    { num: "07", nombre: "Valor", dato: output.densidad_valor?.tipo_valor_dominante },
    { num: "09", nombre: "Guardado", dato: `${output.activadores_guardado?.length || 0} triggers` },
    { num: "12", nombre: "Ritmo", dato: output.ritmo_narrativo?.velocidad_progresion },
    { num: "15", nombre: "Blueprint", dato: output.blueprint_replicable?.nombre_patron },
    { num: "16", nombre: "TCA", dato: output.analisis_tca?.nivel_tca_detectado ? `${output.analisis_tca.nivel_tca_detectado} — ${output.analisis_tca.sector_detectado || ''}` : null },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {motores.map(m => (
        <div key={m.num} className="bg-[#080808] border border-white/5 p-3 rounded-xl hover:border-green-500/20 transition-colors group">
          <div className="text-[9px] font-black text-gray-600 group-hover:text-green-500/50 mb-1 transition-colors">{m.num} {m.nombre}</div>
          <div className="text-[11px] text-gray-300 font-bold truncate uppercase tracking-tight">{m.dato || 'Analizando...'}</div>
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// 🚀 COMPONENTE PRINCIPAL: TITAN VIRAL
// ==================================================================================

export const TitanViral = () => {
  const { userProfile, refreshProfile } = useAuth();

  // ─── Estado principal ───
  const [uploadMode, setUploadMode] = useState<UploadMode>('url');
  const [urls, setUrls] = useState<string[]>(['']); // Array multi-URL
  const [topicInput, setTopicInput] = useState('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // --- PEGAR AQUÍ (Corregido) ---
  const [irProState, setIrProState] = useState<IRProState>({
    etapa: "idle",
    iteracion: 0,
    scoreActual: 0,
    output: null,
    guionGenerado: null,
    veredictoJuez: null, // 👈 AGREGA ESTA LÍNEA AQUÍ
    error: null,
  });

  // ✅ NUEVOS ESTADOS PARA AUDITORÍA
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // ✅ LÓGICA DE CONEXIÓN CON JUEZ VIRAL
  const handleRunAudit = async () => {
    if (!result?.guion_generado || !userProfile) return;
    
    // Validar créditos (Auditoría cuesta 2)
    if ((userProfile.credits || 0) < 2) {
      alert("Necesitas 2 créditos para auditar.");
      return;
    }

    setIsAuditing(true);
    
    // Extraemos el texto plano del guion generado para enviarlo al juez
    const scriptText = 
      result.guion_generado.guion_tecnico_completo || 
      result.guion_generado.guion_completo_adaptado || 
      result.guion_generado.guion_completo;

    try {
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: {
          selectedMode: 'juez_viral', // <--- Llamamos al modo Juez
          text: scriptText,           // <--- Le pasamos el guion clonado
          expertId: selectedExpertId || undefined,
          avatarId: selectedAvatarId || undefined,
          estimatedCost: 2
        }
      });

      if (error) throw error;
      if (!data.success && !data.generatedData) throw new Error(data.error || 'Error al auditar');

      setAuditResult(data.generatedData || data);
      
      // Actualizamos créditos
      if (refreshProfile) refreshProfile();

    } catch (e: any) {
      console.error("Error auditando:", e);
      alert("Error al conectar con el Juez Viral: " + e.message);
    } finally {
      setIsAuditing(false);
    }
  };

  // ─── Tipo de contenido y plataforma ───
  const [contentType, setContentType] = useState<ContentType>('reel');
  const [targetPlatform, setTargetPlatform] = useState('TikTok');

  // ─── Contexto ───
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedExpertId, setSelectedExpertId] = useState<string>('');
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>('');
  const [avatars, setAvatars] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);

  // ─── Computed ───
  const validUrls = urls.filter((u) => u.trim());
  const urlCount  = uploadMode === 'file' ? 1 : Math.max(validUrls.length, 1);
  const cost      = computeCost(contentType, urlCount);

  // ─── Cargar datos ───
  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    try {
      const [{ data: avatarsData }, { data: expertsData }, { data: kbData }] = await Promise.all([
        supabase.from('avatars').select('id, name').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
        supabase.from('expert_profiles').select('id, name, niche').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
        supabase.from('documents').select('id, title').eq('user_id', userProfile?.id).order('created_at', { ascending: false }),
      ]);
      if (avatarsData) setAvatars(avatarsData);
      if (expertsData) setExperts(expertsData);
      if (kbData)      setKnowledgeBases(kbData);
      if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
    } catch (err) { console.error('Error cargando datos:', err); }
  };

  // ─── Manejo multi-URL ───
  const handleUrlChange = (idx: number, val: string) => {
    setUrls((prev) => { const next = [...prev]; next[idx] = val; return next; });
  };

  const addUrl = () => {
    if (urls.length >= 5) return;
    setUrls((prev) => [...prev, '']);
  };

  const removeUrl = (idx: number) => {
    if (urls.length === 1) { setUrls(['']); return; }
    setUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Subida de video ───
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) { setErrorMsg('Tipo no soportado. Usa MP4, MOV, WEBM o AVI.'); return; }
    if (file.size > 100 * 1024 * 1024) { setErrorMsg('El archivo es demasiado grande. Máximo 100MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setUploadedVideoFile(reader.result as string); setUploadedFileName(file.name); };
    reader.readAsDataURL(file);
  };

  const handleClearUpload = () => { setUploadedVideoFile(null); setUploadedFileName(''); };

  // ─── Envío principal ───
  const handleClone = async () => {
    // 1. Validaciones de Seguridad
    if (uploadMode === 'url' && validUrls.length === 0) return setErrorMsg('Necesito al menos una URL.');
    if (uploadMode === 'file' && !uploadedVideoFile) return setErrorMsg('Sube un video primero.');
    if (!topicInput.trim()) return setErrorMsg('Dime sobre qué TEMA quieres adaptar el guion.');
    if ((userProfile?.credits || 0) < cost) return setErrorMsg(`Créditos insuficientes. Requieres ${cost} créditos.`);

    // 2. Preparar Interfaz para el análisis
    setAuditResult(null);
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    // Activar el estado de "Analizando" para los motores
    setIrProState(prev => ({ ...prev, etapa: "analizando", error: null }));

    try {
      const payload: any = {
        selectedMode: 'recreate', // <--- Mantiene el modo PRO
        estimatedCost: cost,
        text: topicInput,
        expertId: selectedExpertId || undefined,
        avatarId: selectedAvatarId || undefined,
        knowledgeBaseId: selectedKnowledgeBaseId || undefined,
        settings: {
          platform: targetPlatform,
          contentType,
          urlCount,
        },
      };

      if (uploadMode === 'url') {
        payload.urls = validUrls;
        payload.url  = validUrls[0]; 
      } else {
        payload.uploadedVideo = uploadedVideoFile;
        payload.uploadedFileName = uploadedFileName;
      }

      // 3. Invocación al Cerebro (Edge Function)
      const { data, error } = await supabase.functions.invoke('process-url', { body: payload });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Error desconocido.');

      // 4. CAPTURA DE ADN (La parte clave)
      const resPro = data.generatedData; // Aquí vienen los 15 motores

      // 2. Actualiza el estado cuidando cada nombre
      setIrProState({
        etapa: "completo",
        iteracion: resPro.iteracion_loop || 0, // 👈 Cambia loop_info por iteracion_loop
        scoreActual: resPro.score_final_obtenido || 0, // 👈 Usa el nombre exacto de la interfaz
        output: resPro,
        guionGenerado: resPro.guion_adaptado_al_nicho,
        veredictoJuez: null, // 👈 ¡ESTO ES LO QUE SEGURAMENTE FALTA!
        error: null,
      });

      // Mantenemos el resultado general para compatibilidad
      setResult(resPro);

      if (refreshProfile) refreshProfile();

    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con Titan Brain.');
      setIrProState(prev => ({ ...prev, etapa: "idle", error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // ==================================================================================
  // 🎨 RENDER
  // ==================================================================================

  return (
    <div className="max-w-7xl mx-auto pb-32 px-4 sm:px-6 pt-12 animate-in fade-in duration-700">

      {/* ─── HERO ─── */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0f1115] border border-green-500/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest mb-6 shadow-lg cursor-default">
            <Flame size={12} fill="currentColor" /> Titan Engine Omega v3.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            CLONACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">VIRAL</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Extrae la arquitectura matemática de 1 a 5 videos virales y replícala en tu nicho con fidelidad quirúrgica.
          </p>
        </div>
      </div>

      {/* ─── PANEL DE CONTROL ─── */}
      <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-2 shadow-2xl relative z-20">
        <div className="bg-[#0f1115] rounded-[1.5rem] p-6 md:p-8 space-y-6 border border-white/5">

          {/* TIPO DE CONTENIDO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
              1. Tipo de Contenido
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(CONTENT_CONFIGS) as [ContentType, CreditConfig][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setContentType(key)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 border ${
                    contentType === key
                      ? 'bg-green-500/15 text-green-400 border-green-500/40 shadow-inner'
                      : 'bg-[#080808] text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">{cfg.icon}</span>
                  <span className="uppercase tracking-wider">{cfg.label}</span>
                  <span className={`text-[10px] ${contentType === key ? 'text-green-300' : 'text-gray-600'}`}>
                    desde {cfg.costs.single} cr
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PLATAFORMA DESTINO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
              2. Plataforma Destino
            </label>
            <div className="flex gap-2 flex-wrap">
              {['TikTok', 'Reels', 'YouTube', 'LinkedIn', 'Facebook'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTargetPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    targetPlatform === p
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : 'bg-[#080808] text-gray-500 border-white/5 hover:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* MODO URL / FILE */}
          <div className="space-y-3">
            <div className="flex gap-2 p-1 bg-[#080808] rounded-lg border border-white/5">
              <button
                onClick={() => setUploadMode('url')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  uploadMode === 'url' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                <LinkIcon size={14} className="inline mr-2" /> URL(s) del Video
              </button>
              <button
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  uploadMode === 'file' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                <Upload size={14} className="inline mr-2" /> Subir Archivo
              </button>
            </div>

            {/* MULTI-URL INPUTS */}
            {uploadMode === 'url' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 flex justify-between items-center">
                  <span>3. Video(s) Viral(es) — máx 5</span>
                  <span className="text-green-500 text-[9px]">TIKTOK / REELS / YOUTUBE</span>
                </label>

                {urls.map((u, idx) => (
                  <div key={idx} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={u}
                        onChange={(e) => handleUrlChange(idx, e.target.value)}
                        placeholder={`https://... (URL ${idx + 1})`}
                        className="w-full bg-[#080808] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all font-mono shadow-inner"
                      />
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    {urls.length > 1 && (
                      <button
                        onClick={() => removeUrl(idx)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}

                {urls.length < 5 && (
                  <button
                    onClick={addUrl}
                    className="w-full py-2.5 border border-dashed border-white/10 rounded-xl text-xs text-gray-500 hover:text-green-400 hover:border-green-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Agregar otra URL (análisis híbrido)
                  </button>
                )}

                {/* Indicador multi-URL */}
                {validUrls.length > 1 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg text-[11px] text-blue-300">
                    <Layers size={12} />
                    <span className="font-bold">Modo Híbrido:</span>
                    <span>Se construirá arquitectura combinada de {validUrls.length} videos</span>
                  </div>
                )}
              </div>
            )}

            {/* UPLOAD FILE */}
            {uploadMode === 'file' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
                  3. Subir Video
                </label>
                {!uploadedVideoFile ? (
                  <label className="block w-full bg-[#080808] border-2 border-dashed border-white/10 rounded-xl py-8 cursor-pointer hover:border-green-500/30 transition-all group">
                    <input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo" onChange={handleVideoUpload} className="hidden" />
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-600 group-hover:text-green-500 transition-colors mb-3" />
                      <p className="text-sm text-gray-400 font-medium">Arrastra tu video o haz clic para seleccionar</p>
                      <p className="text-xs text-gray-600 mt-1">MP4, MOV, WEBM, AVI (Max 100MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="bg-[#080808] border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg"><Film size={20} className="text-green-500" /></div>
                      <div>
                        <p className="text-white text-sm font-medium truncate max-w-[200px]">{uploadedFileName}</p>
                        <p className="text-gray-500 text-xs">Video listo para análisis</p>
                      </div>
                    </div>
                    <button onClick={handleClearUpload} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FLECHA */}
          <div className="flex justify-center -my-2 opacity-30">
            <MoveRight className="rotate-90 md:rotate-0" size={24} />
          </div>

          {/* TEMA DESTINO */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
              {uploadMode === 'url' ? '4' : '3'}. Tu Nicho / Tema (Destino)
            </label>
            <div className="relative transition-transform group-focus-within:scale-[1.01] duration-200">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Ej: Lanzamientos digitales, Marketing para dentistas..."
                className="w-full bg-[#080808] border border-green-500/20 rounded-xl py-4 pl-12 pr-4 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all shadow-inner"
              />
              <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            </div>
          </div>

          {/* CONTEXTO AVANZADO */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {uploadMode === 'url' ? '5' : '4'}. Contexto Avanzado (Opcional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Avatar', value: selectedAvatarId, setter: setSelectedAvatarId, items: avatars, nameKey: 'name' },
                { label: 'Perfil Experto', value: selectedExpertId, setter: setSelectedExpertId, items: experts, nameKey: 'name' },
                { label: 'Base Conocimiento', value: selectedKnowledgeBaseId, setter: setSelectedKnowledgeBaseId, items: knowledgeBases, nameKey: 'title' },
              ].map(({ label, value, setter, items, nameKey }) => (
                <div key={label}>
                  <label className="text-[9px] text-gray-600 uppercase tracking-wide block mb-1 pl-1">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:border-green-500 outline-none"
                  >
                    <option value="">Ninguno</option>
                    {items.map((item: any) => (
                      <option key={item.id} value={item.id}>{item[nameKey]}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* RESUMEN DE COSTO */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#080808] rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">Costo estimado:</span>
            </div>
            <CreditBadge contentType={contentType} urlCount={urlCount} />
          </div>

          {/* BOTÓN PRINCIPAL */}
          <button
            onClick={handleClone}
            disabled={loading}
            className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-lg mt-2 relative overflow-hidden group
              ${loading
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100 text-black shadow-white/5 hover:shadow-white/20 transform hover:-translate-y-0.5'
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin text-green-600" />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                  EXTRAYENDO ADN VIRAL...
                </span>
              </>
            ) : (
              <>
                <Zap size={20} className="group-hover:scale-110 transition-transform" />
                <span>EJECUTAR CLONACIÓN ({cost} CR)</span>
              </>
            )}
          </button>

          {/* ERROR */}
          {errorMsg && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 text-xs font-medium animate-in slide-in-from-top-2">
              <AlertTriangle size={16} className="shrink-0 text-red-500" />
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* ─── ZONA DE RESULTADOS ─── */}
      {result && result.guion_generado && (
        <div className="mt-20 space-y-10 animate-in slide-in-from-bottom-10 duration-1000">

          {/* Badge modo */}
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40" />
            <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} />
              {result.modo === 'ingenieria_inversa_hibrida' ? 'ARQUITECTURA HÍBRIDA GENERADA' : 'CLONACIÓN EXITOSA'}
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent w-40" />
          </div>

          {/* --- SECCIÓN FORENSE DE 15 MOTORES --- */}
<div className="max-w-6xl mx-auto mb-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Izquierdo: Score Forense */}
        <div className="lg:col-span-4">
            <IRProScoreCard score={result.guion_generado.score_viral_estructural} />
        </div>
        
        {/* Lado Derecho: Actividad de Motores */}
        <div className="lg:col-span-8 bg-[#0f1115] border border-white/5 rounded-2xl p-6 relative">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Brain className="text-green-500" size={18} />
                <h3 className="text-white font-black text-sm uppercase tracking-tighter italic">Motores de Ingeniería Inversa Activos</h3>
            </div>
            <MotoresActivosCard output={result.guion_generado} />
        </div>
    </div>
</div>

          {/* Metadata multi-URL */}
          {(result.metadata_video?.urls_analizadas || 0) > 1 && (
            <div className="max-w-3xl mx-auto p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center gap-3">
              <Layers size={16} />
              <span>
                Arquitectura híbrida construida a partir de <strong>{result.metadata_video.urls_analizadas} videos</strong> analizados.
              </span>
            </div>
          )}

          {/* Componentes */}
          <div className="space-y-8">
            
           {/* 1. ESTRATEGIA */}
<OmegaStrategy analysis={result.guion_generado.analisis_estrategico} />

{/* 2. GUION */}
<OmegaScriptView scriptData={result.guion_generado} />

{/* 3. MÉTRICAS AVANZADAS — SECCIÓN COMPLETA */}
<div className="pt-8 border-t border-white/5">
  <div className="flex items-center gap-3 mb-6">
    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1" />
    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
      Análisis Estructural Profundo
    </span>
    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1" />
  </div>

{/* Fila 0 — TCA OLIMPO (ancho completo) */}
  {result.guion_generado.analisis_tca && (
    <div className="mb-6">
      <TcaCard
        tca={result.guion_generado.analisis_tca}
        mapa={result.guion_generado.mapa_de_adaptacion}
        nicho={result.metadata_video?.nicho_usuario || ''}
      />
    </div>
  )}

  {/* Validación OLIMPO */}
  {result.guion_generado._validacion_olimpo && (
    <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center gap-3 ${
      result.guion_generado._validacion_olimpo.score_validacion >= 5
        ? "bg-green-500/5 border-green-500/20"
        : "bg-orange-500/5 border-orange-500/20"
    }`}>
      <Sparkles size={14} className={result.guion_generado._validacion_olimpo.score_validacion >= 5 ? "text-green-400" : "text-orange-400"} />
      <div>
        <p className={`text-xs font-black uppercase tracking-wide ${
          result.guion_generado._validacion_olimpo.score_validacion >= 5 ? "text-green-400" : "text-orange-400"
        }`}>
          Validación OLIMPO: {result.guion_generado._validacion_olimpo.score_validacion}/7 checks pasados
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {result.guion_generado._validacion_olimpo.score_validacion >= 5
            ? "Análisis completo — ADN viral íntegro"
            : "Análisis incompleto — revisar motores faltantes"}
        </p>
      </div>
    </div>
  )}

  {/* Fila 1 — Fidelidad + Micro-Loops */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <FidelidadCard data={result.guion_generado.indice_fidelidad} />
    <MicroLoopsCard data={result.guion_generado.metricas_micro_loops} />
  </div>

  {/* Fila 2 — Polarización + Identidad Verbal */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <PolarizacionCard data={result.guion_generado.polarizacion} />
    <IdentidadVerbalCard data={result.guion_generado.identidad_verbal} />
  </div>

  {/* Fila 3 — Status + Densidad de Valor */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <StatusCard data={result.guion_generado.status_y_posicionamiento} />
    <DensidadValorCard data={result.guion_generado.densidad_valor} />
  </div>

  {/* Fila 4 — Activadores de Guardado (ancho completo) */}
  <div className="mb-6">
    <ActivadoresCard data={result.guion_generado.activadores_guardado} />
  </div>

  {/* Indicador de completitud */}
  {result.guion_generado._motores_faltantes?.length > 0 && (
    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
      <AlertCircle size={14} className="text-orange-400 shrink-0" />
      <div>
        <p className="text-xs font-black text-orange-400 uppercase tracking-wide">
          {result.guion_generado._motores_completos}/17 motores completados
          ({result.guion_generado._completitud_pct}%)
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          Motores incompletos: {result.guion_generado._motores_faltantes.join(", ")}
        </p>
      </div>
    </div>
  )}
</div>

{/* 4. AUDITORÍA CON JUEZ VIRAL */}
<div className="pt-8 border-t border-white/5">
  <div className="flex items-center gap-3 mb-6">
    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
    <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">
      Auditoría de Calidad
    </span>
    <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent flex-1" />
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <PaqueteJuezCard
      data={result.guion_generado.paquete_juez_viral}
      onAudit={handleRunAudit}
      isAuditing={isAuditing}
    />
    <OmegaAuditCard
      auditData={auditResult}
      onAudit={handleRunAudit}
      isAuditing={isAuditing}
    />
  </div>
</div>
            
          </div>
        </div>
      )}
    </div>
  );
};