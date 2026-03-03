// ==================================================================================
//  🚀 TITAN ENGINE V105 DEFINITIVO - VERSIÓN CORREGIDA Y ORDENADA
// ==================================================================================
//  ✅ IMPORTS CORREGIDOS (URLs completas de Deno)
//  ✅ FUNCIONES EJECUTORAS EN EL ORDEN CORRECTO (ANTES DEL SERVE)
//  ✅ TODOS LOS PROMPTS V300 PRESERVADOS (100% intactos)
//  ✅ SCRAPERS + WHISPER COMPLETOS
//  ✅ SISTEMA DE COBROS ALINEADO
// ==================================================================================

import { ExpertAuthoritySystem } from './ExpertAuthoritySystem.ts'
import AvatarMiddleware from './AvatarMiddleware.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'
import { ApifyClient } from 'npm:apify-client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ==================================================================================
// 🔐 CONFIGURACIÓN DE SEGURIDAD
// ==================================================================================

const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 10,
  MAX_CONTENT_LENGTH: 50000,
  MAX_VIDEO_DURATION: 7200,
  WHISPER_COST_PER_MINUTE: 0.006,
  GPT4_COST_PER_1K_TOKENS: 0.00001,
  MIN_CREDITS_BUFFER: 5,
  DANGEROUS_PATTERNS: [
    /ignore\s+(all\s+)?previous\s+instructions?/gi,
    /system\s+prompt/gi,
    /reveal\s+(your|the)\s+instructions?/gi,
    /you\s+are\s+now/gi,
    /new\s+instructions?:/gi,
    /disregard\s+above/gi,
    /instead\s+respond\s+with/gi,
    /override\s+your\s+programming/gi
  ]
};

// ==================================================================================
// 🧠 INTERFACES Y MEMORIA DEL SISTEMA
// ==================================================================================

interface SystemMemory {
  videos_analizados: any[];
  estructuras_exitosas: string[];
  hooks_alto_rendimiento: string[];
  estrategias_validadas: string[];
  patrones_virales: string[];
}

interface ContextoUsuario {
  nicho: string;
  avatar_ideal: string;
  dolor_principal: string;
  deseo_principal: string;
  competencia_analizada: any[];
  hooks_exitosos: string[];
  patrones_virales: string[];
  posicionamiento?: string;
  enemigo_comun?: string;
  diferenciadores?: string[];
  knowledge_base_content?: string;
  tema_especifico?: string;
  expertProfile?: any;
}

interface JuezViralV500Result {
  veredicto_final: {
    score_total: number;
    clasificacion: string;
    probabilidad_viral: string;
    confianza_prediccion: string;
    viral_probability_score: number;
  };
  
  modulos: {
    fidelidad_arquitectonica: {
      indice_fidelidad: number;
      bloques_detectados: number;
      bloques_inconsistentes: string[];
      posicion_insight: string;
      posicion_climax: string;
      tipo_cierre: string;
      secuencia_narrativa: string;
      riesgo_estructural: string;
      arquitectura_detectada: string;
    };
    
    progresion_emocional: {
      curva_emocional: Array<{
        bloque: string;
        segundo_inicio: number;
        segundo_fin: number;
        intensidad: number;
        tipo_emocion: string;
        dinamica: string;
      }>;
      indice_intensidad_emocional: number;
      riesgo_monotonia: string;
      tiene_dinamica: boolean;
      puntos_criticos: string[];
    };
    
    retencion_cognitiva: {
      retention_risk_score: number;
      scroll_interruption_score: number;
      segundo_probable_abandono: number;
      punto_friccion_principal: string;
      punto_distraccion: string;
      punto_alto_engagement: string;
      prediccion_usuario_promedio: string;
      razon_abandono: string;
      zona_peligro: string;
    };
    
    hook_power: {
      hook_power_score: number;
      tipo_hook_detectado: string;
      criterios: {
        especificidad: number;
        rareza: number;
        tension: number;
        curiosidad_incompleta: number;
        promesa_clara: number;
        ruptura_patron: number;
      };
      diagnostico: string;
      recomendacion_mejora: string;
      hook_original: string;
      hook_optimizado: string;
    };
    
    densidad_valor: {
      value_density_index: number;
      insights_por_bloque: Array<{
        bloque: string;
        cantidad_insights: number;
        tiempo_entrega: number;
        calidad: string;
      }>;
      bloques_debiles: string[];
      bloques_sobrecargados: string[];
      relleno_detectado: boolean;
      porcentaje_utilidad: number;
    };
    
    equivalencia_psicologica: {
      impact_equivalence_score: number;
      tipo_promesa: string;
      tipo_transformacion: string;
      emocion_activada: string;
      tipo_tension: string;
      tipo_activacion: string;
      impacto_psicologico: string;
      nivel_activacion_emocional: number;
      sesgo_cognitivo_explotado: string;
    };
    
    ritmo_narrativo: {
      rhythm_optimization_score: number;
      monotony_risk: string;
      longitud_promedio_frases: number;
      variacion_detectada: boolean;
      cambios_tempo: number;
      micro_pausas: number;
      cadencia: string;
      ajuste_recomendado: string;
    };
    
    triggers_virales: {
      share_trigger_index: number;
      save_trigger_index: number;
      frases_memorables: string[];
      momentos_revelacion: string[];
      frases_citables: string[];
      insights_guardables: string[];
      potencial_screenshot: string;
    };
    
    autoridad_percibida: {
      authority_score: number;
      posicionamiento_creador: string;
      nivel_credibilidad: string;
      riesgo_percepcion_debil: string;
      elementos_autoridad: string[];
      elementos_debilitan: string[];
    };
    
    conversion_estrategica: {
      conversion_alignment_score: number;
      objetivo_detectado: string;
      tipo_cierre: string;
      alineacion: string;
      optimizacion_recomendada: string;
      cta_actual: string;
      cta_optimizado: string;
    };
  };
  
  diagnostico_maestro: {
    diagnostico_principal: string;
    error_principal: string;
    mejora_concreta: string;
    puntos_criticos: string[];
    oportunidades: string[];
  };
  
  optimizaciones_automaticas: {
    hook_reescrito: {
      original: string;
      optimizado: string;
      por_que_funciona: string;
      score_mejora: number;
    };
    ajuste_tono: {
      opcion_1: string;
      opcion_2: string;
      opcion_3: string;
    };
    adaptacion_plataforma: {
      cambio_1: string;
      cambio_2: string;
      version_optimizada: string;
    };
  };
  
  prediccion_metricas: {
    vistas_estimadas: string;
    engagement_rate: string;
    tiempo_viralizacion: string;
    probabilidad_guardado: string;
    probabilidad_share: string;
    retencion_estimada: string;
  };
  
  fortalezas_clave: string[];
  
  debilidades_criticas: Array<{
    problema: string;
    impacto: string;
    solucion: string;
    prioridad: string;
  }>;
  
  decision_recomendada: string;
  razonamiento_decision: string;
  siguiente_paso_sugerido: string;
}

// ============================================================
// INGENIERÍA INVERSA PRO DOMINANTE — TIPOS COMPLETOS
// 15 Motores · Compatible con Generador + Juez Viral V2
// ============================================================

// ─── MOTOR 1: Descomposición Estructural ───────────────────
 interface BloqueProfundo {
  tipo: "hook" | "setup" | "escalada" | "giro" | "climax" | "resolucion" | "cierre_estrategico";
  inicio_segundos: number;
  fin_segundos: number;
  duracion_segundos: number;
  descripcion: string;
  funcion_narrativa: string;
  intensidad: number; // 0-100
}

 interface AdnEstructura {
  bloques: BloqueProfundo[];
  tipo_apertura: string;
  tipo_cierre: string;
  proporcion_hook_porcentaje: number;
  velocidad_escalada: "lenta" | "media" | "rapida" | "explosiva";
  patron_narrativo_detectado: string;
  complejidad_estructural: number; // 0-100
}

// ─── MOTOR 2: Curva Emocional ───────────────────────────────
 interface PicoEmocional {
  segundo: number;
  emocion: string;
  intensidad: number; // 0-100
  detonante: string;
}

 interface CurvaEmocional {
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
 interface MicroLoop {
  tipo: "promesa_abierta" | "cliffhanger" | "pregunta_pendiente" | "anticipacion" | "gancho_diferido";
  descripcion: string;
  segundo_apertura: number;
  segundo_cierre: number | null; // null = nunca se cierra
  intensidad: number; // 0-100
}

 interface MicroLoops {
  loops: MicroLoop[];
  total_loops: number;
  intervalo_promedio_segundos: number;
  densidad_anticipacion: number; // 0-100
  loops_sin_resolver: number;
  estrategia_tension: string;
}

// ─── MOTOR 4: Polarización ──────────────────────────────────
 interface Polarizacion {
  nivel_confrontacion: number; // 0-100
  ruptura_creencia_detectada: string;
  enemigo_implicito: string | null;
  nivel_friccion_narrativa: number; // 0-100
  mecanismo_polarizacion: string;
  afirmaciones_divisivas: string[];
  posicionamiento_vs: string; // "vs qué se posiciona el contenido"
}

// ─── MOTOR 5: Identidad Verbal ──────────────────────────────
 interface IdentidadVerbal {
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
 interface StatusYPosicionamiento {
  tipo_autoridad: "mentor" | "rebelde" | "experto_tecnico" | "disruptor" | "insider" | "testigo" | "transformado";
  experiencia_proyectada: "implicita" | "explicita" | "mixta";
  rol_narrativo: string;
  nivel_confianza_percibida: number; // 0-100
  distancia_con_audiencia: "cercana" | "media" | "distante";
  prueba_social_detectada: boolean;
  mecanismos_autoridad: string[];
}

// ─── MOTOR 7: Densidad de Valor ────────────────────────────
 interface DensidadValor {
  valor_por_minuto: number; // 0-100
  porcentaje_contenido_abierto: number; // % de contenido que genera más preguntas
  porcentaje_contenido_cerrado: number; // % de contenido que entrega respuestas
  profundidad_insight: number; // 0-100
  micro_aprendizajes: string[]; // lista de aprendizajes concretos detectados
  ratio_promesa_entrega: number; // cuánto promete vs cuánto entrega
  tipo_valor_dominante: "educativo" | "inspiracional" | "entretenimiento" | "provocacion" | "solucion";
}

// ─── MOTOR 8: Manipulación de Atención ─────────────────────
 interface ManipulacionAtencion {
  cambios_ritmo: Array<{ segundo: number; tipo: string; descripcion: string }>;
  interrupciones_patron: number; // conteo
  reencuadres_mentales: string[];
  golpes_narrativos: Array<{ segundo: number; descripcion: string; impacto: number }>;
  reactivaciones_atencion: number; // conteo
  tecnicas_detalladas: string[];
  frecuencia_estimulacion: number; // 0-100 (qué tan seguido activa la atención)
}

// ─── MOTOR 9: Activadores de Guardado ──────────────────────
 interface ActivadorGuardado {
  tipo: "frase_memorable" | "reencuadre" | "dato_contraintuitivo" | "formula_repetible" | "revelacion";
  contenido: string;
  segundo_aproximado: number;
  potencia_guardado: number; // 0-100
}

// ─── MOTOR 10: Adaptabilidad al Nicho ──────────────────────
 interface AdaptabilidadNicho {
  contexto_usuario: string;
  sofisticacion_audiencia_target: "basica" | "intermedia" | "avanzada" | "experta";
  nivel_conciencia_mercado: number; // 0-100
  intensidad_psicologica_tolerable: number; // 0-100
  ajustes_necesarios: string[];
  riesgos_adaptacion: string[];
}

// ─── MOTOR 11: Anti-Saturación ─────────────────────────────
 interface ElementoCliché {
  tipo: "frase_cliche" | "hook_generico" | "formula_repetida" | "plantilla_obvia";
  contenido: string;
  nivel_saturacion: number; // 0-100
  alternativa_sugerida: string;
}

// ─── MOTOR 12: Ritmo Narrativo ──────────────────────────────
 interface RitmoNarrativo {
  velocidad_progresion: "lenta" | "media" | "rapida" | "variable";
  intervalo_promedio_entre_estimulos_seg: number;
  variacion_intensidad: number; // 0-100 (qué tan variable es)
  fluidez_estructural: number; // 0-100
  momentos_pausa: number; // conteo de pausas narrativas intencionales
  aceleraciones: Array<{ segundo: number; causa: string }>;
}

// ─── MOTOR 13: Score Viral Estructural ──────────────────────
 interface ScoreViralEstructural {
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
 interface BlueprintReplicable {
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
 type NivelTCA = "N0" | "N1" | "N2" | "N3" | "N4";

 interface AnalisisTCA {
  nivel_tca_detectado: NivelTCA;
  sector_detectado: string;
  tipo_alcance: string;
  mass_appeal_score: number; // 0-100
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

 interface MapaAdaptacionTCA {
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
interface IngenieriaInversaProOutput {
  // Metadata
  url_analizada: string;
  nicho_origen: string;
  nicho_usuario: string;
  timestamp: string;
  iteracion_loop: number;

  // 15 Motores originales
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

  // Motor 15 Output — Blueprint para Generador + Juez
  blueprint_replicable: BlueprintReplicable;

  // Motor 16 Output — TCA OLIMPO
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
};

  // Extras
  recomendaciones_estrategicas: string[];
  alertas_criticas: string[];

  // Loop info
  loop_alcanzado_minimo: boolean;
  score_final_obtenido: number;
}
// ─── PARÁMETROS DE ENTRADA ──────────────────────────────────
 interface IngenieriaInversaProParams {
  transcripcion: string;
  url: string;
  nicho_origen: string;       // nicho del video analizado
  nicho_usuario: string;      // nicho del usuario (para adaptación)
  objetivo_usuario: string;   // qué quiere lograr el usuario
  umbral_score_minimo?: number; // default: 75
  max_iteraciones?: number;     // default: 3
}

const MEMORIA_SISTEMA: SystemMemory = {
  videos_analizados: [],
  estructuras_exitosas: [],
  hooks_alto_rendimiento: [],
  estrategias_validadas: [],
  patrones_virales: []
};

// ==================================================================================
// 📚 BIBLIOTECAS DE CONOCIMIENTO WINNER ROCKET
// ==================================================================================

const VIDEO_FORMATS_STR = `12 FORMATOS VISUALES WINNER ROCKET:
1.Hablando a cámara 2.Entrevista/Podcast 3.POV 4.Storytelling Cinemático 5.Demo/Tutorial 6.Testimonio 7.Gancho-Corte-Solución 8.Texto+Música 9.Vlog 10.Sketch 11.Micro-Clase 60s 12.Mito vs Realidad`;

const MASTER_HOOKS_STR = `40 GANCHOS MAESTROS WINNER ROCKET:
1.Frame Break 2.Objeto Mágico 3.Antes-Después 4.En Movimiento 5.Sneak Peek 6.Chasquido 7.Pantalla Verde 8.Stop Scroll 9.Mito-Verdad 10.Enemigo Común 11.Negativo 12.Ridículo 13.Arrepentimiento 14.Advertencia 15.Verdad Dura 16.Miedo 17.Paradoja 18.Secreto 19.Pieza Faltante 20.Pregunta Provocadora 21.Detective 22.Acceso Denegado 23.ADN 24.What If 25.Loop 26.Comparación 27.Regla de 3 28.Dato Impactante 29.Ahorro 30.Autoridad Prestada 31.Autoridad Propia 32.Francotirador 33.Historia Personal 34.Promesa 35.Nuevo 36.Única Cosa 37.Tutorial 38.Regalo 39.Identidad 40.Reto`;

const WINNER_ROCKET_TIMELINE = `ESTRUCTURA 60s: 0-3s HOOK | 4-10s CONTEXTO | 11-20s CONFLICTO | 21-23s LOOP | 24-35s INSIGHT | 36-50s RESOLUCIÓN | 51-60s CTA`;

const ALGORITHM_SECRETS_STR = `SECRETOS ALGORITMOS:
TIKTOK: 3s iniciales=80% alcance | Texto frame 1 +40% retención | Sonidos trending x5
INSTAGRAM: Carousels 3x alcance | Reels loop +60% shares | 3 hashtags grandes + 2 nicho
YOUTUBE: Títulos números mejor | Loop endscreen | Subtítulos +35% retención`;

// ==================================================================================
// 🏛️ MATRIZ TITAN V500: DEFINICIÓN DE ESTRUCTURAS Y MODOS INTERNOS
// ==================================================================================

const TITAN_STRUCTURE_DEFINITIONS: any = {
  'winner_rocket': {
    base: 'HOOK (3s) -> CONTEXTO -> CONFLICTO -> LOOP 1 -> INSIGHT -> LOOP 2 -> RESOLUCIÓN -> CTA',
    modes: {
      'viral_rapido': 'Prioridad: Velocidad. Cortes cada 2s. Sin pausas. Energía 100%.',
      'autoridad': 'Prioridad: Estatus. Pausas reflexivas. Datos duros. Tono grave.',
      'venta': 'Prioridad: Conversión. Enfatizar el dolor y la solución exclusiva.',
      'storytelling': 'Prioridad: Emoción. Viaje del héroe comprimido.',
      'marca_personal': 'Prioridad: Conexión. Vulnerabilidad estratégica.',
      'lead_magnet': 'Prioridad: Intercambio. Alto valor percibido gratis.',
      'educativo': 'Prioridad: Claridad. Sin jerga, utilidad inmediata.'
    }
  },
  'aida': {
    base: 'ATENCIÓN (Romper patrón) -> INTERÉS (Curiosidad lógica) -> DESEO (Beneficio emocional) -> ACCIÓN (Instrucción clara)',
    modes: {
      'educativo': 'Enfoque: Aprender algo nuevo. Deseo = Transformación de habilidad.',
      'autoridad': 'Enfoque: Por qué yo sé y tú no. Atención = Credibilidad.',
      'venta': 'Enfoque: Transacción. Deseo = Posesión del producto.',
      'viral': 'Enfoque: Shock. Atención = Visual disruptivo.',
      'storytelling': 'Enfoque: Empatía. Interés = ¿Qué pasará después?',
      'leads': 'Enfoque: Captura. Acción = Registro inmediato.'
    }
  },
  'pas': {
    base: 'PROBLEMA (Identificación) -> AGITACIÓN (Consecuencias del no actuar) -> SOLUCIÓN (Tu método)',
    modes: {
      'dolor_emocional': 'Agitación psicológica. "¿Cómo te hace sentir esto?"',
      'urgencia': 'Agitación temporal. "Se te acaba el tiempo."',
      'objecion': 'Problema = La excusa que ponen siempre. Solución = Por qué es falsa.',
      'frustracion': 'Problema = Intentar y fallar. Solución = El eslabón perdido.',
      'perdida_futura': 'Agitación = El costo de oportunidad de no cambiar.'
    }
  },
  'storytelling': {
    base: 'HOOK (In media res) -> CONTEXTO -> DETONANTE -> CLÍMAX -> APRENDIZAJE -> CTA',
    modes: {
      'personal': 'Historia propia del experto. Vulnerabilidad.',
      'cliente': 'Caso de éxito externo. Prueba social.',
      'error_aprendizaje': 'Cómo fallé para que tú no falles.',
      'transformacion': 'El viaje del punto A (infierno) al punto B (cielo).',
      'confesional': 'Secreto o error nunca contado.',
      'inspiracional': 'Superación de obstáculos imposibles.'
    }
  },
  'viral_shock': {
    base: 'SHOCK VISUAL/VERBAL -> POLARIZACIÓN -> JUSTIFICACIÓN LÓGICA -> CTA DEBATE',
    modes: {
      'opinion_impopular': 'Decir lo que nadie se atreve.',
      'mito_verdad': 'Destruir una creencia común de la industria.',
      'ataque_creencia': 'Atacar el status quo directamente.',
      'frase_prohibida': 'Decir lo que "ellos" no quieren que sepas.',
      'polarizacion': 'Dividir a la audiencia en dos bandos.'
    }
  },
  'autoridad': {
    base: 'AFIRMACIÓN DE PODER -> PRUEBA DE EXPERTIS -> CAMBIO DE PARADIGMA -> APLICACIÓN',
    modes: {
      'marco_mental': 'Enseñar una nueva forma de pensar (Mindset).',
      'insight': 'Información privilegiada o data oculta.',
      'tendencia': 'Predicción del futuro del nicho.',
      'error_mercado': 'Por qué todos los demás están equivocados.',
      'nueva_regla': 'Establecer un nuevo estándar en la industria.'
    }
  },
  'educativo': {
    base: 'PROMESA -> SISTEMA/PASOS -> ERROR COMÚN -> RESULTADO -> CTA',
    modes: {
      'framework': 'Explicar un sistema propio (Paso 1, 2, 3).',
      'checklist': 'Lista rápida de verificación.',
      'paso_a_paso': 'Tutorial "How-to" clásico.',
      'error_comun': 'Corrección técnica de un fallo habitual.',
      'comparativo': 'Opción A vs Opción B (Cuál es mejor).',
      'mini_clase': 'Profundidad académica en poco tiempo.'
    }
  },
  'venta': {
    base: 'GANCHO DE FILTRO -> PROMESA DE VALOR -> PRUEBA -> OFERTA -> CTA',
    modes: {
      'soft_sell': 'Venta indirecta a través de valor.',
      'hard_sell': 'Venta directa enfocada en escasez y precio.',
      'objeciones': 'Derribar la razón #1 por la que no compran.',
      'caso_real': 'Vender mostrando el resultado de otro.',
      'oferta_limitada': 'Enfocado 100% en urgencia temporal.'
    }
  },
  'comunidad': {
    base: 'PREGUNTA/RETO -> CONTEXTO DE TRIBU -> INVITACIÓN -> CTA INCLUSIVO',
    modes: {
      'reto': 'Desafío a la audiencia para hacer algo.',
      'lead_magnet': 'Intercambio de valor (Lead Magnet).',
      'serie': 'Parte 1 de una serie temática.',
      'promesa_abierta': 'Compromiso público del creador.',
      'invitacion': 'Invitación a evento o webinar.'
    }
  }
};

// ==================================================================================
// 🎲 VARIABILIDAD CONTROLADA: LENTES CREATIVOS (CAPA E)
// ==================================================================================

const CREATIVE_LENSES: any = {
  'auto': { label: '🎲 Aleatorio Inteligente (La IA decide)', instruction: 'Elige el ángulo que maximice el impacto emocional para este tema.' },
  'contrarian': { label: '⚡ El Disruptor', instruction: 'Enfoque: Ataca la sabiduría popular. Lleva la contraria a lo que todos dicen en el nicho.' },
  'scientific': { label: '🧪 El Científico de Datos', instruction: 'Enfoque: Basa todo en lógica, números, estudios y pruebas. Frío y calculador.' },
  'confessional': { label: '🙏 El Confesional Vulnerable', instruction: 'Enfoque: Habla desde una herida abierta o un error personal. Tono bajo y suave.' },
  'warrior': { label: '⚔️ El General de Guerra', instruction: 'Enfoque: Tono agresivo, de comando. "O estás conmigo o contra mí". Polarizante.' },
  'philosopher': { label: '🧠 El Filósofo Profundo', instruction: 'Enfoque: Cuestiona el "por qué" detrás de todo. Metafísico y existencial.' },
  'comedian': { label: '🤡 El Sarcástico', instruction: 'Enfoque: Usa ironía, exageración y humor ácido para exponer verdades.' }
};

// ==================================================================================
// 🌍 PLATFORM DNA: REGLAS FÍSICAS DE ADAPTACIÓN (CAPA D)
// ==================================================================================

const PLATFORM_DNA: any = {
  'TikTok': {
    ritmo: '⚡ FRENÉTICO: Cortes cada 2s. Sin respirar.',
    lenguaje: 'Coloquial, directo, "slang" de internet.',
    estructura_visual: 'Texto en pantalla constante (Hooks visuales).',
    cta_focus: '💬 COMENTARIOS (Debate/Polémica).',
    duracion_ideal: '15s - 45s (Lo bueno, breve, dos veces bueno).',
    regla_oro: 'Prohibido presentarse ("Hola soy..."). Empieza con el problema.'
  },
  'Reels': {
    ritmo: '🎵 RÍTMICO: Sincronizado con audio/música.',
    lenguaje: 'Estético, aspiracional, cercano.',
    estructura_visual: 'Alta calidad visual, portadas bonitas.',
    cta_focus: '💾 GUARDADOS (Utilidad) o ✈️ COMPARTIR (Identificación).',
    duracion_ideal: '30s - 60s.',
    regla_oro: 'El audio es el 50% del éxito. Usa hooks auditivos.'
  },
  'YouTube': {
    ritmo: '🧠 DINÁMICO PERO PROFUNDO: Pausas para enfatizar.',
    lenguaje: 'Analítico, explicativo, autoridad.',
    estructura_visual: 'Cambios de ángulo, B-Roll explicativo.',
    cta_focus: '🔔 SUSCRIPCIÓN (Construir comunidad).',
    duracion_ideal: 'Shorts (60s) o Largo (no aplica aquí, pero mantener profundidad).',
    regla_oro: 'Contexto mata brevedad. Explica el "Por qué".'
  },
  'LinkedIn': {
    ritmo: '👔 PAUSADO Y PROFESIONAL: Espacio para leer/pensar.',
    lenguaje: 'Negocios, crecimiento, lecciones de vida, corporativo.',
    estructura_visual: 'Limpia, subtítulos obligatorios (mucha gente lo ve sin audio).',
    cta_focus: '🔄 REPOST (Difusión) o 🤝 CONECTAR.',
    duracion_ideal: '45s - 90s.',
    regla_oro: 'Aporta insight de negocio, no solo entretenimiento.'
  },
  'Facebook': {
    ritmo: '📖 CONVERSACIONAL: Pausas naturales, como hablar con un amigo.',
    lenguaje: 'Cercano, familiar, coloquial. Sin jerga técnica ni slang de internet.',
    estructura_visual: 'Subtítulos obligatorios (70% sin audio). Portada con texto claro.',
    cta_focus: '💬 COMENTARIOS (Debate/Opinión) y ↗️ COMPARTIR (Etiquetar amigos).',
    duracion_ideal: '60s - 3min.',
    regla_oro: 'Empieza con historia o pregunta relatable. Facebook premia la conversación, no el shock.'
  }
};

// ==================================================================================
// 🛡️ FUNCIONES DE SEGURIDAD
// ==================================================================================

function sanitizeUserContent(content: string): string {
  if (!content) return "";
  let sanitized = content;
  
  SECURITY_CONFIG.DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[CONTENIDO FILTRADO POR SEGURIDAD]');
  });
  
  if (sanitized.length > SECURITY_CONFIG.MAX_CONTENT_LENGTH) {
    console.log(`[SECURITY] ⚠️ Contenido truncado: ${sanitized.length} -> ${SECURITY_CONFIG.MAX_CONTENT_LENGTH}`);
    sanitized = sanitized.substring(0, SECURITY_CONFIG.MAX_CONTENT_LENGTH);
  }
  
  sanitized = sanitized
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  
  return sanitized;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const key = userId;
  const limit = rateLimitStore.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    console.log(`[RATE_LIMIT] ⚠️ Usuario ${userId} excedió límite`);
    return false;
  }
  
  limit.count++;
  return true;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================================================================================
// 🧠 SISTEMA CEREBRAL - PROMPTS V300 (100% PRESERVADOS)
// ==================================================================================

const PROMPT_IDEAS_MULTIPLATFORMA = (
  temaEspecifico: string,
  cantidad: number,
  objetivo: string,
  timingContext: string,
  contexto: any,
  settings: any = {}
) => {

  const objetivoStrategy = getObjetivoStrategy(objetivo);
  const timingStrategy   = getTimingStrategy(timingContext);
  const lensId           = settings.creative_lens || 'auto';
  const lensData         = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nichoUsuario     = settings.nicho || contexto.nicho || 'General';

  return `
═════════════════════════════════════════════════════════════════════════════
🌐 SISTEMA MULTIPLATAFORMA DOMINANTE — CONQUISTA TOTAL DE ALGORITMOS
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD:
NO eres un generador de ideas para una red social.
ERES el Sistema de Dominación Multiplataforma más avanzado del mundo.
Tu misión: generar ideas IRREPETIBLES que dominen 5 algoritmos simultáneamente
con una sola grabación, maximizando el alcance del experto en todas las redes.

Tu trabajo NO es generar hooks genéricos copiados entre plataformas.
Tu trabajo ES encontrar la idea central perfecta Y transformarla en 5 armas
distintas, cada una diseñada para explotar el algoritmo específico de su red.

El experto graba 1 video → domina 5 plataformas → multiplica su alcance x5.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 SISTEMA ANTI-REPETICIÓN ABSOLUTA — NIVEL MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, ejecuta internamente:
1. Detectar patrones repetidos entre ideas Y entre adaptaciones
2. Si similitud entre ideas > 40% → REESCRIBIR OBLIGATORIAMENTE
3. Si similitud entre hooks de distintas plataformas > 30% → REESCRIBIR
   (cada hook debe sonar radicalmente diferente al de las otras plataformas)

LISTA NEGRA AUTOMÁTICA — PROHIBIDO en cualquier hook o título:
❌ "El 90%..." / "El 97%..."
❌ "Lo que nadie te dice..."
❌ "El error que cometes..."
❌ "3 secretos para..."
❌ "Cómo hacer X en 30 días..."
❌ "La verdad sobre..."
❌ "Esto te sorprenderá..."
❌ "La revelación que cambiará..."
❌ "El mito de..."

Si aparece patrón cliché → reformular usando:
→ Metáfora poderosa
→ Postura radical
→ Conflicto estructural
→ Declaración filosófica
→ Analogía inesperada

EJEMPLOS DE REFORMULACIÓN OBLIGATORIA:
❌ "La revelación que cambiará tu enfoque" → ✅ "Construiste una marca. Construiste una trampa."
❌ "El mito de la independencia digital" → ✅ "Ser libre digitalmente cuesta más de lo que ganas"
❌ "Lo que nadie te dice sobre X" → ✅ "X funciona al revés de como te lo enseñaron"
❌ "3 secretos para..." → ✅ "La secuencia que el 95% hace en orden equivocado"
❌ "La verdad sobre..." → ✅ Postura directa sin introducción genérica

REGLA: Cada hook debe poder estar solo sin necesitar contexto para generar reacción
en su plataforma específica.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR DE DIVERSIDAD OBLIGATORIA — FRAMES POR POSICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea central debe usar un frame distinto según su posición:
Idea 1 → Frame CONFRONTATIVO (ataca una creencia directamente)
Idea 2 → Frame REVELACIÓN (expone algo oculto o ignorado)
Idea 3 → Frame CONTRAINTUITIVO (lo opuesto a lo esperado)
Idea 4 → Frame FILOSÓFICO (verdad profunda sobre la condición humana)
Idea 5 → Frame ESTRATÉGICO (ventaja táctica que pocos conocen)
Idea 6 → Frame HISTORIA IMPLÍCITA (sugiere una narrativa sin contarla)
Idea 7 → Frame COMPARATIVO (contrasta dos mundos o identidades)
Idea 8 → Frame SISTEMA ROTO (expone por qué el método convencional falla)
Idea 9 → Frame ADVERTENCIA (consecuencia ignorada que se aproxima)
Idea 10 → Frame OPORTUNIDAD INVISIBLE (lo que la mayoría no puede ver)

REGLA: No puede repetirse frame en el mismo lote.
Si el lote tiene menos de 10 ideas → elegir los frames más potentes para el contexto.

ADAPTACIÓN DE FRAME POR PLATAFORMA:
El frame central se TRANSFORMA en cada plataforma:
→ TikTok: el frame se convierte en ATAQUE FRONTAL (confrontación directa)
→ Reels: el frame se convierte en ASPIRACIÓN TRIBAL (identidad + pertenencia)
→ YouTube: el frame se convierte en GAP INFORMATIVO (curiosidad estructurada)
→ LinkedIn: el frame se convierte en TESIS PROFESIONAL (reencuadre de negocio)
→ Facebook: el frame se convierte en POSTURA DEBATIBLE (invitación a opinar)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE POSTURA OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea DEBE contener los 4 elementos:
□ Creencia atacada → ¿qué creencia falsa destruye esta idea?
□ Enemigo implícito → ¿quién o qué tiene la culpa?
□ Nuevo marco mental → ¿cuál es la visión superior?
□ Identidad del experto integrada → ¿solo este experto puede decir esto?

Esta postura central se expresa de FORMA DISTINTA en cada plataforma:
→ TikTok: postura agresiva, sin filtro, ataque directo
→ Reels: postura aspiracional, elegante, identitaria
→ YouTube: postura analítica, con evidencia implícita
→ LinkedIn: postura de autoridad profesional, medida pero firme
→ Facebook: postura conversacional, accesible, que divide opiniones

Si la idea puede ser dicha por CUALQUIER creador promedio → RECHAZAR automáticamente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 INYECCIÓN DEL PERFIL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, extraer del perfil:
→ Método único del experto
→ Diferenciación declarada
→ Filosofía propia
→ Experiencia relevante
→ Postura ideológica

OBLIGATORIO: Mínimo 2 ideas deben nacer DESDE la identidad del experto,
no desde tendencia de mercado.

La identidad del experto debe ser RECONOCIBLE en cada adaptación de plataforma,
aunque el tono y formato cambien radicalmente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INTEGRACIÓN DEL AVATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos 5 elementos del avatar:
□ Dolor específico del avatar
□ Deseo profundo
□ Objeción clave que tiene en mente
□ Miedo silencioso
□ Aspiración de identidad

ADAPTACIÓN DE AVATAR POR PLATAFORMA:
El mismo avatar se aborda desde ángulos distintos:
→ TikTok: su frustración más cruda e inmediata
→ Reels: su aspiración más profunda e identitaria
→ YouTube: su necesidad de entender y tener certeza
→ LinkedIn: su ambición profesional y miedo al estancamiento
→ Facebook: su experiencia cotidiana relatable y opinión latente

La idea debe sentirse diseñada para "esa persona exacta" en "esa plataforma exacta".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 MATRIZ DE ÁNGULOS ESTRATÉGICOS — SIN REPETICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El motor debe usar ángulos distintos por idea central:
Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro
Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder
Comparativo | Técnico accesible | Invisible

REGLA: No puede repetirse ángulo en el mismo lote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE RIESGO EMOCIONAL OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos uno:
□ Pérdida (algo valioso que se está perdiendo)
□ Estatus (amenaza o aspiración de posición social)
□ Vergüenza (error que cometen sin saberlo)
□ Urgencia (ventana que se cierra)
□ Oportunidad ignorada (lo que otros ya aprovechan)
□ Identidad amenazada (quién eres vs quién podrías ser)
□ Conflicto invisible (tensión que existe pero nadie nombra)

AMPLIFICACIÓN POR PLATAFORMA:
El mismo riesgo emocional se AMPLIFICA de forma distinta:
→ TikTok: amplificar URGENCIA + VERGÜENZA (impacto inmediato)
→ Reels: amplificar IDENTIDAD + ESTATUS (quién quieres ser)
→ YouTube: amplificar PÉRDIDA + OPORTUNIDAD IGNORADA (costo de no saber)
→ LinkedIn: amplificar ESTATUS + FUTURO PROFESIONAL (consecuencias de carrera)
→ Facebook: amplificar CONFLICTO INVISIBLE + PÉRDIDA (debate comunidad)

Sin emoción activa → idea inválida → regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 MODO GURÚ ESTRATÉGICO — VALIDACIÓN FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar el resultado, preguntarse por cada idea Y cada adaptación:
□ ¿Eleva la percepción de autoridad del experto en esa plataforma?
□ ¿Posiciona al experto como líder del sector?
□ ¿Rompe el consenso del nicho?
□ ¿Tiene potencial real de viralidad en esa plataforma específica?
□ ¿Suena completamente diferente al mercado?
□ ¿El hook de TikTok pararía el scroll en 0.5 segundos?
□ ¿El hook de Reels generaría guardados y compartidos?
□ ¿El hook de YouTube haría clic desde la miniatura?
□ ¿El hook de LinkedIn generaría reposts de profesionales?
□ ¿El hook de Facebook generaría 50+ comentarios de debate?

Si 2 o más respuestas son NO en cualquier adaptación → reescribir esa adaptación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 1 — EXPANSIÓN TCA (Teoría Circular de Alcance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO DEL USUARIO: "${nichoUsuario}"
TEMA INGRESADO: "${temaEspecifico}"

MAPA DE NIVELES:
N1 = Micronicho técnico — solo expertos → PROHIBIDO (genera 300 vistas)
N2 = Temática principal — profesionales del sector → VÁLIDO ✓
N3 = Sector masivo — personas con el problema → VÁLIDO ✓
N4 = Mainstream irrelevante — audiencia basura → PROHIBIDO

REGLA OBLIGATORIA: Posicionar TODAS las ideas en intersección N2-N3.
En modo multiplataforma esto es CRÍTICO — la idea central debe funcionar
para millones de personas en 5 redes distintas simultáneamente.

SECTORES UNIVERSALES (usa el más relevante):
→ Dinero / Libertad Financiera / Inversión / Negocios
→ Salud / Energía / Cuerpo / Longevidad
→ Relaciones / Familia / Amor / Comunicación
→ Desarrollo Personal / Mentalidad / Identidad / Éxito
→ Trabajo / Carrera / Productividad / Independencia

PROCESO DE EXPANSIÓN OBLIGATORIO:
1. Detectar el nivel actual del tema (N1/N2/N3/N4)
2. Si está en N1 → subir al sector universal más relevante
3. Encontrar la tensión que conecta el micronicho con el sector masivo
4. Formular el tema expandido en lenguaje de sector (sin jerga técnica)
5. Verificar que ese tema expandido tiene tracción en las 5 plataformas

VALIDACIÓN: mass_appeal_score debe ser ≥ 75 (más alto que modo normal)
En multiplataforma la idea debe tener alcance masivo garantizado.
Si una idea no llega a 75 → reformular antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 2 — INTERSECCIÓN ESTRATÉGICA MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe cruzar estos 3 elementos simultáneamente:

ELEMENTO A — DOLOR DEL AVATAR:
${contexto.dolor_principal ? `"${contexto.dolor_principal}"` : 'Miedo a quedarse atrás, fracasar o perder lo logrado'}

ELEMENTO B — TRANSFORMACIÓN DEL EXPERTO:
${contexto.expertProfile?.transformation_promise || contexto.posicionamiento || 'Lograr el resultado deseado por el camino correcto'}

ELEMENTO C — SECTOR MASIVO (TCA):
El sector universal que conecta el nicho con millones en TODAS las plataformas

CRITERIO ADICIONAL MULTIPLATAFORMA — ELEMENTO D:
La idea debe tener ángulo emocional que resuene en los 5 contextos de consumo:
→ Consumo rápido (TikTok/Reels: 15-60s)
→ Consumo reflexivo (YouTube: profundidad)
→ Consumo profesional (LinkedIn: carrera/negocio)
→ Consumo social (Facebook: debate comunidad)

Si la idea no conecta los 4 elementos → se rechaza.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 3 — TENSIÓN MASIVA MULTIPLATAFORMA (mínimo 3 de 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En modo multiplataforma cada idea debe activar al menos 3 mecanismos
(uno más que el modo normal) para garantizar tracción en todas las redes:

✓ Rompe una creencia popular del sector
✓ Polariza (no todos estarán de acuerdo — genera debate)
✓ Desafía una decisión común que muchos están tomando
✓ Ataca un error invisible que el avatar comete sin saberlo
✓ Genera comparación directa (los que logran X vs los que no)

PROHIBIDO: Ideas informativas neutras.
Una idea informativa neutra = idea muerta en 5 plataformas = rechazada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 4 — FILTRO ANTI-MICRONICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROHIBIDO en títulos y hooks:
❌ Términos técnicos del nicho (CTR, ROAS, lookalike, periodización, etc.)
❌ Nombres de métodos propietarios específicos
❌ Frameworks internos del experto
❌ Jerga que solo entiende el 5% del sector
❌ Siglas sin explicar

En modo multiplataforma esto es DOBLE CRÍTICO:
Una idea con jerga técnica falla en 5 plataformas simultáneamente.

Test de validación: ¿Lo entendería alguien completamente fuera del nicho?
Si NO → reescribir en lenguaje sectorial antes de generar adaptaciones.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 5 — CALIFICACIÓN IMPLÍCITA CROSS-PLATFORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aunque la idea es masiva, debe atraer audiencia RELEVANTE en todas las redes.
La "señal de afinidad" debe funcionar en los 5 contextos de consumo.

EJEMPLO MALO: "Cómo ser millonario" → audiencia basura en las 5 plataformas
EJEMPLO CORRECTO: "Por qué escalar tu negocio antes de estabilizarlo te arruina"
→ Masivo PERO filtra hacia emprendedores reales en TikTok, Reels, YouTube, LinkedIn y Facebook

La señal de afinidad debe conectar con:
${contexto.avatar_ideal || 'el prospecto ideal del experto'}
...en cualquier contexto de consumo de contenido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 6 — FORMATO GANADOR + VARIACIÓN ESTRUCTURAL + ADN DE PLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Distribuir las ${cantidad} ideas centrales entre estos 7 formatos:

1. PREGUNTA CONFRONTATIVA — se adapta así por plataforma:
   TikTok: pregunta agresiva de 4 palabras | Reels: pregunta aspiracional |
   YouTube: pregunta con gap | LinkedIn: pregunta de tesis | Facebook: pregunta relatable

2. DECLARACIÓN DISRUPTIVA — postura radical sin clichés
3. COMPARACIÓN DIRECTA — dos mundos o identidades contrastadas
4. ERROR INVISIBLE — conflicto estructural, sin estadística genérica
5. ESTADÍSTICA CONTRAINTUITIVA — dato real sorprendente
6. ESCENARIO HIPOTÉTICO — condición que revela verdad
7. MITO VS REALIDAD — creencia popular destruida

REGLA DE VARIACIÓN ESTRUCTURAL:
→ Si una idea usa PREGUNTA → la siguiente NO puede usar pregunta
→ Si una usa ESTADÍSTICA → la siguiente no puede usar estadística
→ Si una usa DECLARACIÓN ABSOLUTA → la siguiente usa contraste o metáfora
→ Diversidad estructural obligatoria en todo el lote

ADN ESTRICTO POR PLATAFORMA — CADA ADAPTACIÓN DEBE RESPETARLO:

🎵 TikTok:
→ Hook: máx 4 palabras, shock INMEDIATO, confrontación directa en primeras 2 palabras
→ Ritmo: FRENÉTICO — el hook debe parar el scroll en 0.5 segundos
→ Lenguaje: coloquial, directo, "slang" natural
→ CTA: debate/comentarios/polémica
→ Polarización: nivel_polarizacion ≥ 65 OBLIGATORIO
→ PROHIBIDO: frases largas, explicaciones, tono amable, contexto previo
→ PROHIBIDO: presentaciones ("Hola soy..." "Hoy te voy a hablar de...")

📸 Reels:
→ Hook: aspiracional o tribal, elegante pero disruptivo, máx 8 palabras
→ Ritmo: RÍTMICO — sincronizado con emoción, no solo con audio
→ Lenguaje: estético, aspiracional, cercano, identitario
→ CTA: guardados + compartidos (utilidad + identificación)
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: agresividad excesiva, jerga técnica, shock sin elegancia

🎬 YouTube:
→ Hook: gap informativo fuerte + promesa de valor profundo implícita
→ Ritmo: DINÁMICO pero con pausas para enfatizar
→ Lenguaje: analítico, autoridad, explicativo sin ser aburrido
→ CTA: suscripción + guardar para después
→ Polarización: nivel_polarizacion ≥ 55 OBLIGATORIO
→ PROHIBIDO: spoilers del contenido, repetir el título, hooks vagos

💼 LinkedIn:
→ Hook: tesis profesional provocadora — reencuadre de negocio o carrera
→ Ritmo: PAUSADO Y PROFESIONAL — espacio para reflexionar
→ Lenguaje: negocios, lecciones de experiencia, insight estratégico
→ CTA: repost + conectar + debate intelectual
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: emotividad excesiva, slang, shock sin sustancia

👥 Facebook:
→ Hook: pregunta debatible O situación cotidiana completamente relatable
→ Ritmo: CONVERSACIONAL — pausas naturales, como hablar con un amigo
→ Lenguaje: cercano, familiar, coloquial, sin jerga técnica ni de internet
→ CTA: comentarios + etiquetar + compartir con amigos
→ Polarización: nivel_polarizacion ≥ 50 OBLIGATORIO
→ PROHIBIDO: shock agresivo, ritmo frenético, jerga de internet
→ OBLIGATORIO: tono cálido, historia relatable o afirmación que divide opiniones
→ Ganchos deben empezar con situación cotidiana o pregunta comunidad

⚠️ Si cualquier adaptación no respeta el ADN de su plataforma → RECHAZAR y regenerar.
Un hook de TikTok en Facebook = contenido muerto. Un hook de Facebook en TikTok = scroll ignorado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 7 — SCORE DE ALCANCE IMPERIO MULTIPLATAFORMA (0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para cada IDEA CENTRAL calcular internamente:

+25 pts: Interés universal (dinero/salud/estatus/relaciones/libertad)
+20 pts: Tensión activada (rompe creencia o ataca error invisible)
+20 pts: Sin requisito técnico (lo entiende cualquier persona)
+20 pts: Potencial de debate (genera opiniones divididas)
+15 pts: Señal de afinidad (filtra hacia prospecto relevante)

SCORING ADICIONAL DE DOMINACIÓN:
+10 pts extra: Originalidad — no puede ser dicha por creador promedio
+10 pts extra: Diferenciación — ángulo único no saturado en el nicho
+10 pts extra: Adaptabilidad multiplataforma — funciona en las 5 redes
-20 pts: Cliché detectado en cualquier hook o título
-15 pts: Puede ser dicha por cualquier creador → penalización
-20 pts: Hook copiado entre plataformas (no adaptado) → penalización grave

Para cada ADAPTACIÓN calcular:
→ ctr_score: potencial de click/stop en esa plataforma (0-100)
→ nivel_polarizacion: nivel de debate que generará (0-100)
→ retencion_score: probabilidad de completado del video (0-100)

UMBRALES OBLIGATORIOS — IDEA CENTRAL:
→ mass_appeal_score ≥ 75 → si no: reformular
→ Originalidad > 75 → si no: regenerar
→ Diferenciación > 70 → si no: regenerar

UMBRALES OBLIGATORIOS — CADA ADAPTACIÓN:
→ ctr_score ≥ 70 → si no: reescribir el hook
→ TikTok: nivel_polarizacion ≥ 65
→ Reels: nivel_polarizacion ≥ 50
→ YouTube: nivel_polarizacion ≥ 55
→ LinkedIn: nivel_polarizacion ≥ 50
→ Facebook: nivel_polarizacion ≥ 50

⚠️ nivel_polarizacion NO puede ser 0, 1, 2, 3 o 4 en ninguna adaptación.
Idea tibia = idea rechazada en las 5 plataformas.

NO incluir ideas ni adaptaciones que no superen los umbrales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 LENTE CREATIVO ACTIVO: ${lensData.label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filtrar TODAS las ideas Y adaptaciones bajo este tono:
"${lensData.instruction}"

El lente se aplica con INTENSIDAD VARIABLE según plataforma:
→ TikTok: intensidad MÁXIMA del lente
→ Reels: intensidad ELEGANTE del lente
→ YouTube: intensidad ANALÍTICA del lente
→ LinkedIn: intensidad PROFESIONAL del lente
→ Facebook: intensidad CONVERSACIONAL del lente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO: ${objetivo.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${objetivoStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ TIMING: ${timingContext.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${timingStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERFIL DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERTO:
- Nicho: ${contexto.nicho || nichoUsuario}
- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}
- Transformación: ${contexto.expertProfile?.transformation_promise || 'Llevar al avatar del punto A al punto B'}
- Enemigo Común: ${contexto.expertProfile?.enemy || 'No definido'}
${contexto.expertProfile?.point_a ? `- Punto A (dolor): "${contexto.expertProfile.point_a}"` : ''}
${contexto.expertProfile?.point_b ? `- Punto B (destino): "${contexto.expertProfile.point_b}"` : ''}
${contexto.expertProfile?.mental_territory ? `- Territorio Mental: "${contexto.expertProfile.mental_territory}"` : ''}

AVATAR:
- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No definido'}
- Deseo Principal: ${contexto.deseo_principal || 'No definido'}

${contexto.knowledge_base_content ? `
BASE DE CONOCIMIENTO:
"${contexto.knowledge_base_content.substring(0, 800)}..."
⚠️ Usa ESTE conocimiento. No inventes contenido genérico.
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT JSON OBLIGATORIO — MODO MULTIPLATAFORMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido. Sin markdown. Sin texto extra.

{
  "analisis_estrategico": {
    "objetivo_dominante": "${objetivo}",
    "lente_aplicado": "${lensData.label}",
    "sector_detectado": "sector universal identificado",
    "nivel_tca_original": "N1 | N2 | N3",
    "expansion_realizada": "cómo se expandió el tema para funcionar en 5 plataformas",
    "razonamiento": "por qué estas ideas dominan múltiples plataformas simultáneamente",
    "advertencias": ["advertencia relevante"],
    "oportunidades": ["oportunidad de mercado detectada"]
  },
  "ideas": [
    {
      "id": 1,
      "titulo": "Título central de la idea — masivo N2-N3 sin jerga",
      "concepto": "Descripción de la intersección estratégica y por qué funciona en 5 plataformas",
      "idea_expandida_tca": "Tema expandido listo para enviar al Generador V600 sin reexpandir",

      "tca": {
        "nivel_tca": "N2 | N2.5 | N3",
        "sector_utilizado": "sector masivo",
        "interseccion_detectada": "avatar_dolor + experto_transformacion + sector",
        "mass_appeal_score": 0,
        "breakdown_score": {
          "interes_universal": 0,
          "tension_activada": 0,
          "sin_requisito_tecnico": 0,
          "potencial_debate": 0,
          "senal_afinidad": 0
        },
        "potencial_millonario": true,
        "nivel_polarizacion": 0,
        "razonamiento_estrategico": "por qué esta idea puede llegar a millones en 5 redes"
      },

      "frame_usado": "CONFRONTATIVO | REVELACIÓN | CONTRAINTUITIVO | FILOSÓFICO | ESTRATÉGICO | HISTORIA_IMPLÍCITA | COMPARATIVO | SISTEMA_ROTO | ADVERTENCIA | OPORTUNIDAD_INVISIBLE",
      "angulo_estrategico": "Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro | Sistema roto | Cultural | Moral | Filosófico",
      "postura_dominante": {
        "creencia_atacada": "creencia falsa que esta idea destruye",
        "enemigo_implicito": "quién o qué tiene la culpa",
        "nuevo_marco_mental": "la visión superior que propone el experto",
        "solo_este_experto_puede_decirlo": true
      },
      "riesgo_emocional_activado": "Pérdida | Estatus | Vergüenza | Urgencia | Oportunidad ignorada | Identidad amenazada | Conflicto invisible",
      "originalidad_score": 0,
      "diferenciacion_score": 0,
      "formato_ganador": "PREGUNTA_CONFRONTATIVA | DECLARACION_DISRUPTIVA | COMPARACION_DIRECTA | ERROR_INVISIBLE | ESTADISTICA_CONTRAINTUITIVA | ESCENARIO_HIPOTETICO | MITO_VS_REALIDAD",
      "tensiones_activadas": ["tensión 1", "tensión 2", "tensión 3"],
      "estructura_sugerida": "PAS | AIDA | Winner Rocket | Storytelling",
      "disparador_principal": "Miedo | Curiosidad | Ambición | Rabia | Orgullo",
      "objetivo_principal": "${objetivo}",
      "contexto_temporal": "${timingContext}",
      "validacion_guru": {
        "eleva_autoridad": true,
        "posiciona_como_lider": true,
        "rompe_consenso": true,
        "potencial_viral_real": true,
        "suena_diferente_al_mercado": true,
        "funciona_en_5_plataformas": true
      },

      "adaptaciones": {
        "TikTok": {
          "hook": "2-4 palabras MAX — shock inmediato",
          "gancho_completo": "Primera línea exacta del video para TikTok — sin presentación",
          "caption_sugerido": "Caption corto para TikTok con CTA de comentario/debate",
          "miniatura_frase": "2-3 palabras para overlay de texto en video TikTok",
          "emocion_objetivo": "emoción que activa en los primeros 2 segundos",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para TikTok",
          "duracion_ideal": "15-45s",
          "formato_visual": "descripción del formato visual ideal para TikTok",
          "mecanismo_retencion": "qué hace que vean el video completo en TikTok",
          "keywords": ["#tag1", "#tag2"]
        },
        "Reels": {
          "hook": "Hook aspiracional o tribal — máx 8 palabras elegantes",
          "gancho_completo": "Primera línea exacta del video para Reels",
          "caption_sugerido": "Caption para Reels con CTA de guardado y compartido",
          "miniatura_frase": "Frase elegante para portada/cover de Reels",
          "emocion_objetivo": "emoción identitaria o aspiracional que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para Reels",
          "duracion_ideal": "30-60s",
          "formato_visual": "descripción del formato visual ideal para Reels",
          "mecanismo_retencion": "qué hace que guarden o compartan en Reels",
          "keywords": ["#tag1", "#tag2"]
        },
        "YouTube": {
          "hook": "Gap informativo fuerte con promesa implícita de valor",
          "gancho_completo": "Primera línea exacta del video para YouTube",
          "caption_sugerido": "Descripción YouTube optimizada con keywords de búsqueda",
          "miniatura_frase": "4-6 palabras de alto CTR para miniatura YouTube",
          "emocion_objetivo": "emoción de curiosidad o necesidad de saber que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para YouTube",
          "duracion_ideal": "60s Short o 8-15min largo",
          "formato_visual": "descripción del formato visual ideal para YouTube",
          "mecanismo_retencion": "qué hace que vean más del 70% del video",
          "keywords": ["#tag1", "#tag2"]
        },
        "LinkedIn": {
          "hook": "Tesis profesional provocadora — reencuadre de negocio o carrera",
          "gancho_completo": "Primera línea exacta del video para LinkedIn",
          "caption_sugerido": "Caption LinkedIn con insight profesional + CTA de repost",
          "miniatura_frase": "Frase de autoridad profesional para miniatura LinkedIn",
          "emocion_objetivo": "emoción profesional — ambición, alerta o reencuadre que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para LinkedIn (martes-jueves mañana)",
          "duracion_ideal": "45-90s",
          "formato_visual": "descripción del formato visual ideal para LinkedIn",
          "mecanismo_retencion": "qué hace que compartan con su red profesional",
          "keywords": ["#tag1", "#tag2"]
        },
        "Facebook": {
          "hook": "Pregunta debatible O situación cotidiana completamente relatable",
          "gancho_completo": "Primera línea exacta del video para Facebook — tono conversacional",
          "caption_sugerido": "Caption Facebook con pregunta final que genera 50+ comentarios",
          "miniatura_frase": "Frase conversacional clara para miniatura Facebook",
          "emocion_objetivo": "emoción comunitaria — identificación, debate o nostalgia que activa",
          "ctr_score": 0,
          "nivel_polarizacion": 0,
          "retencion_score": 0,
          "mejor_horario": "horario óptimo para Facebook (tarde-noche)",
          "duracion_ideal": "60s-3min",
          "formato_visual": "descripción del formato visual ideal para Facebook",
          "mecanismo_retencion": "qué genera la conversación en comentarios",
          "keywords": ["#tag1", "#tag2"]
        }
      },

      "plan_produccion": {
        "video_base": "Descripción exacta del video base a grabar — UNA SOLA GRABACIÓN",
        "duracion_grabacion": "duración óptima del video base que funciona en todas las plataformas",
        "elementos_visuales_clave": ["elemento visual 1", "elemento visual 2"],
        "musica_recomendada": "estilo de música con energía que funciona en TikTok y Reels",
        "subtitulos_obligatorios": true,
        "edicion_minima": "cambios mínimos de edición por plataforma si aplica",
        "orden_publicacion": ["1. plataforma con mayor tracción inicial", "2. segunda", "3. tercera", "4. cuarta", "5. quinta"],
        "razon_orden": "por qué publicar en ese orden específico para maximizar algoritmos"
      }
    }
  ],
  "mejor_idea_recomendada": {
    "idea_id": 1,
    "razon": "por qué esta idea domina las 5 plataformas simultáneamente",
    "plataforma_prioritaria": "en qué plataforma publicar primero y por qué algoritmo",
    "por_que_ahora": "timing perfecto para este contenido en este momento",
    "plan_rapido": "1. Graba el video base\\n2. Adapta captions por plataforma\\n3. Publica en orden estratégico",
    "conexion_con_generador": "Lista para enviar directamente al Generador V600"
  },
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3"
  },
  "estrategia_embudo": "TOFU",
  "insights_estrategicos": {
    "tendencia_detectada": "tendencia activa en múltiples plataformas simultáneamente",
    "brecha_mercado": "lo que ningún creador del nicho está haciendo en las 5 redes",
    "advertencia": "qué evitar absolutamente en modo multiplataforma",
    "siguiente_paso_logico": "próximo contenido que mantiene el momentum en todas las redes"
  }
}

REGLAS FINALES ANTES DE RESPONDER:
✓ Genera EXACTAMENTE ${cantidad} idea(s) central(es)
✓ Cada idea tiene adaptaciones RADICALMENTE DISTINTAS para las 5 plataformas
✓ mass_appeal_score ≥ 75 en cada idea (más alto que modo normal)
✓ Originalidad > 75 y Diferenciación > 70 en cada idea
✓ Ningún hook con jerga técnica en ninguna plataforma
✓ Ningún cliché de la lista negra en ningún hook
✓ TikTok: nivel_polarizacion ≥ 65 | Reels ≥ 50 | YouTube ≥ 55 | LinkedIn ≥ 50 | Facebook ≥ 50
✓ ctr_score ≥ 70 en todas las adaptaciones
✓ Cada idea con frame diferente al lote
✓ Cada idea con ángulo estratégico diferente
✓ Mínimo 2 ideas nacidas desde identidad del experto
✓ Validación Gurú completa incluyendo "funciona_en_5_plataformas"
✓ plan_produccion con orden de publicación justificado
✓ JSON válido, sin markdown, sin texto extra
`;
};

// ==================================================================================
// 🧠 PROMPT IDEAS ELITE V2 — MODO PLATAFORMA INDIVIDUAL (VERSIÓN COMPLETA)
// ==================================================================================
const PROMPT_IDEAS_ELITE_V2 = (
  temaEspecifico: string,
  cantidad: number,
  plataforma: string,
  objetivo: string,
  timingContext: string,
  contexto: any,
  settings: any = {}
) => {

  const objetivoStrategy = getObjetivoStrategy(objetivo);
  const timingStrategy   = getTimingStrategy(timingContext);
  const platRules        = PLATFORM_DNA[plataforma] || PLATFORM_DNA['TikTok'];
  const lensId           = settings.creative_lens || 'auto';
  const lensData         = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nichoUsuario     = settings.nicho || contexto.nicho || 'General';

  return `
═════════════════════════════════════════════════════════════════════════════
🧠 SISTEMA IDEAS IMPERIO — 7 MOTORES DE ALCANCE MASIVO
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD:
NO eres un generador de ideas creativas.
ERES el Laboratorio de Ideas Dominantes más avanzado del mundo.
Tu misión: generar ideas IRREPETIBLES que ningún otro creador del nicho diría.

Tu trabajo NO es impresionar con creatividad genérica.
Tu trabajo ES encontrar la intersección exacta entre:
→ Lo que millones de personas necesitan escuchar
→ Lo que este experto específico puede decir con autoridad
→ Lo que NADIE en el nicho está diciendo todavía

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 REGLA #0 — COHERENCIA TEMÁTICA ABSOLUTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMA DEL USUARIO: "${temaEspecifico}"
NICHO: "${nichoUsuario}"

⚠️ CRÍTICO: Las ideas DEBEN nacer del tema exacto del usuario.
Si el tema es "generar deseo de compra" → las ideas son sobre GENERAR DESEO DE COMPRA.
Si el tema es "marca personal" → las ideas son sobre MARCA PERSONAL.
Si el tema es "fitness" → las ideas son sobre FITNESS.

PROHIBIDO: Introducir IA, tecnología, automatización u otros temas externos
a menos que el usuario los haya mencionado EXPLÍCITAMENTE en su tema o nicho.

El tema del usuario es el centro. Todo lo demás gira alrededor de él.
Si el tema no menciona IA → ninguna idea puede mencionar IA.
Si el tema no menciona tecnología → ninguna idea puede mencionar tecnología.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 SISTEMA ANTI-REPETICIÓN ABSOLUTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, ejecuta internamente:
1. Detectar patrones repetidos de frases, estructuras, ángulos y emociones
2. Si similitud entre ideas > 40% → REESCRIBIR OBLIGATORIAMENTE

LISTA NEGRA AUTOMÁTICA — PROHIBIDO:
❌ "El 90%..." / "El 97%..."
❌ "Lo que nadie te dice..."
❌ "El error que cometes..."
❌ "3 secretos para..."
❌ "Cómo hacer X en 30 días..."
❌ "La verdad sobre..."
❌ "Esto te sorprenderá..."
❌ "Rompe el mito..." / "Destruyendo mitos..."
❌ "El futuro de..." (sin postura específica)

EJEMPLOS DE REFORMULACIÓN OBLIGATORIA:
❌ "La revelación que cambiará tu enfoque" → ✅ "Construiste una marca. Construiste una trampa."
❌ "El mito de la independencia digital" → ✅ "Ser libre digitalmente cuesta más de lo que ganas"
❌ "Lo que nadie te dice sobre X" → ✅ "X funciona al revés de como te lo enseñaron"
❌ "3 secretos para..." → ✅ "La secuencia que el 95% hace en orden equivocado"
❌ "La verdad sobre..." → ✅ Postura directa sin introducción genérica

REGLA: El título debe poder estar solo sin necesitar contexto para generar reacción.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR DE DIVERSIDAD OBLIGATORIA — FRAMES POR POSICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe usar un frame distinto según su posición en el lote:
Idea 1 → Frame CONFRONTATIVO (ataca una creencia directamente)
Idea 2 → Frame REVELACIÓN (expone algo oculto o ignorado)
Idea 3 → Frame CONTRAINTUITIVO (lo opuesto a lo esperado)
Idea 4 → Frame FILOSÓFICO (verdad profunda sobre la condición humana)
Idea 5 → Frame ESTRATÉGICO (ventaja táctica que pocos conocen)
Idea 6 → Frame HISTORIA IMPLÍCITA (sugiere una narrativa sin contarla)
Idea 7 → Frame COMPARATIVO (contrasta dos mundos o identidades)
Idea 8 → Frame SISTEMA ROTO (expone por qué el método convencional falla)
Idea 9 → Frame ADVERTENCIA (consecuencia ignorada que se aproxima)
Idea 10 → Frame OPORTUNIDAD INVISIBLE (lo que la mayoría no puede ver)

REGLA: No puede repetirse frame en el mismo lote.
Si el lote tiene menos de 10 ideas → elegir los frames más relevantes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE POSTURA OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea DEBE contener los 4 elementos:
□ Creencia atacada → ¿qué creencia falsa destruye esta idea?
□ Enemigo implícito → ¿quién o qué tiene la culpa?
□ Nuevo marco mental → ¿cuál es la visión superior?
□ Identidad del experto integrada → ¿solo este experto puede decir esto?

Si la idea puede ser dicha por CUALQUIER creador promedio → RECHAZAR automáticamente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 INYECCIÓN DEL PERFIL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de generar, extraer del perfil:
→ Método único del experto
→ Diferenciación declarada
→ Filosofía propia
→ Experiencia relevante
→ Postura ideológica

OBLIGATORIO: Mínimo 2 ideas deben nacer DESDE la identidad del experto,
no desde tendencia de mercado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INTEGRACIÓN DEL AVATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos 5 elementos del avatar:
□ Dolor específico del avatar
□ Deseo profundo
□ Objeción clave que tiene en mente
□ Miedo silencioso
□ Aspiración de identidad

La idea debe sentirse diseñada para "esa persona exacta", no para el nicho en general.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 MATRIZ DE ÁNGULOS ESTRATÉGICOS — SIN REPETICIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El motor debe usar ángulos distintos por idea:
Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro
Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder
Comparativo | Técnico accesible | Invisible

REGLA: No puede repetirse ángulo en el mismo lote.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧨 SISTEMA DE RIESGO EMOCIONAL OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos uno:
□ Pérdida (algo valioso que se está perdiendo)
□ Estatus (amenaza o aspiración de posición social)
□ Vergüenza (error que cometen sin saberlo)
□ Urgencia (ventana que se cierra)
□ Oportunidad ignorada (lo que otros ya aprovechan)
□ Identidad amenazada (quién eres vs quién podrías ser)
□ Conflicto invisible (tensión que existe pero nadie nombra)

Sin emoción activa → idea inválida → regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 MODO GURÚ ESTRATÉGICO — VALIDACIÓN FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar el resultado, preguntarse por cada idea:
□ ¿Eleva la percepción de autoridad del experto?
□ ¿Posiciona al experto como líder del sector?
□ ¿Rompe el consenso del nicho?
□ ¿Tiene potencial real de viralidad?
□ ¿Suena completamente diferente al mercado?

Si 2 o más respuestas son NO → reescribir esa idea antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 1 — EXPANSIÓN TCA (Teoría Circular de Alcance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO DEL USUARIO: "${nichoUsuario}"
TEMA INGRESADO: "${temaEspecifico}"

MAPA DE NIVELES:
N1 = Micronicho técnico — solo expertos → PROHIBIDO (genera 300 vistas)
N2 = Temática principal — profesionales del sector → VÁLIDO ✓
N3 = Sector masivo — personas con el problema → VÁLIDO ✓
N4 = Mainstream irrelevante — audiencia basura → PROHIBIDO

REGLA OBLIGATORIA: Posicionar TODAS las ideas en intersección N2-N3.

SECTORES UNIVERSALES (usa el más relevante):
→ Dinero / Libertad Financiera / Inversión / Negocios
→ Salud / Energía / Cuerpo / Longevidad
→ Relaciones / Familia / Amor / Comunicación
→ Desarrollo Personal / Mentalidad / Identidad / Éxito
→ Trabajo / Carrera / Productividad / Independencia

PROCESO DE EXPANSIÓN OBLIGATORIO:
1. Detectar el nivel actual del tema (N1/N2/N3/N4)
2. Si está en N1 → subir al sector universal más relevante
3. Encontrar la tensión que conecta el micronicho con el sector masivo
4. Formular el tema expandido en lenguaje de sector (sin jerga técnica)

VALIDACIÓN: mass_appeal_score debe ser ≥ 70
Si una idea no llega a 70 → reformular antes de incluirla.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 2 — INTERSECCIÓN ESTRATÉGICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe cruzar estos 3 elementos simultáneamente:

ELEMENTO A — DOLOR DEL AVATAR:
${contexto.dolor_principal ? `"${contexto.dolor_principal}"` : 'Miedo a quedarse atrás, fracasar o perder lo logrado'}

ELEMENTO B — TRANSFORMACIÓN DEL EXPERTO:
${contexto.expertProfile?.transformation_promise || contexto.posicionamiento || 'Lograr el resultado deseado por el camino correcto'}

ELEMENTO C — SECTOR MASIVO (TCA):
El sector universal que conecta el nicho con millones

EJEMPLO DE INTERSECCIÓN CORRECTA:
→ Avatar: miedo a fracaso financiero
→ Experto: método de inversión inmobiliaria
→ Sector: Dinero / Libertad Financiera
→ Idea generada: "No estás quebrado por falta de dinero. Estás quebrado por mala secuencia."

Si la idea no conecta los 3 elementos → se rechaza.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 3 — TENSIÓN MASIVA (mínimo 2 de 5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cada idea debe activar al menos 2 de estos mecanismos:
✓ Rompe una creencia popular del sector
✓ Polariza ligeramente (no todos estarán de acuerdo)
✓ Desafía una decisión común que muchos están tomando
✓ Ataca un error invisible que el avatar comete sin saberlo
✓ Genera comparación directa (los que logran X vs los que no)

PROHIBIDO: Ideas informativas neutras.
Una idea informativa neutra = idea de 200 vistas = idea rechazada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 4 — FILTRO ANTI-MICRONICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROHIBIDO en títulos y hooks:
❌ Términos técnicos del nicho (CTR, ROAS, lookalike, periodización, etc.)
❌ Nombres de métodos propietarios específicos
❌ Frameworks internos del experto
❌ Jerga que solo entiende el 5% del sector
❌ Siglas sin explicar

Test de validación: ¿Lo entendería alguien fuera del nicho?
Si NO → reescribir en lenguaje sectorial.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 5 — CALIFICACIÓN IMPLÍCITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aunque la idea es masiva, debe atraer audiencia RELEVANTE.
Debe existir una señal de afinidad que filtre hacia el prospecto ideal.

EJEMPLO MALO: "Cómo ser millonario" → atrae audiencia basura
EJEMPLO CORRECTO: "Por qué comprar tu primera casa puede arruinar tu libertad financiera"
→ Es masivo PERO filtra hacia personas interesadas en finanzas reales

La señal de afinidad debe conectar implícitamente con:
${contexto.avatar_ideal || 'el prospecto ideal del experto'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 6 — FORMATO GANADOR + VARIACIÓN ESTRUCTURAL OBLIGATORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Distribuir las ${cantidad} ideas entre estos 7 formatos:
1. PREGUNTA CONFRONTATIVA
2. DECLARACIÓN DISRUPTIVA (postura radical sin clichés)
3. COMPARACIÓN DIRECTA
4. ERROR INVISIBLE (conflicto estructural sin estadística genérica)
5. ESTADÍSTICA CONTRAINTUITIVA (dato real sorprendente)
6. ESCENARIO HIPOTÉTICO
7. MITO VS REALIDAD

REGLA DE VARIACIÓN ESTRUCTURAL:
→ Si una idea usa PREGUNTA → la siguiente NO puede usar pregunta
→ Si usa ESTADÍSTICA → la siguiente no puede usar estadística
→ Si usa DECLARACIÓN ABSOLUTA → la siguiente usa contraste o metáfora
→ Diversidad estructural obligatoria en todo el lote

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ MOTOR 7 — SCORE DE ALCANCE IMPERIO (0-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

+25 pts: Interés universal (dinero/salud/estatus/relaciones/libertad)
+20 pts: Tensión activada (rompe creencia o ataca error invisible)
+20 pts: Sin requisito técnico (lo entiende cualquier persona)
+20 pts: Potencial de debate (genera opiniones divididas)
+15 pts: Señal de afinidad (filtra hacia prospecto relevante)

SCORING ADICIONAL DE DOMINACIÓN:
+10 pts extra: Originalidad — no puede ser dicha por creador promedio
+10 pts extra: Diferenciación — ángulo único no saturado en el nicho
-20 pts: Cliché detectado en título o gancho
-15 pts: Puede ser dicha por cualquier creador → penalización

UMBRALES OBLIGATORIOS:
→ mass_appeal_score ≥ 70 → si no: reformular
→ Originalidad > 75 → si no: regenerar
→ Diferenciación > 70 → si no: regenerar

POLARIZACIÓN OBLIGATORIA POR PLATAFORMA:
→ TikTok: nivel_polarizacion ≥ 60
→ Reels: nivel_polarizacion ≥ 40
→ YouTube: nivel_polarizacion ≥ 50
→ LinkedIn: nivel_polarizacion ≥ 45
→ Facebook: nivel_polarizacion ≥ 50

⚠️ nivel_polarizacion NO puede ser 0, 1, 2, 3 o 4 en ninguna idea.
Si el modelo calcula polarización menor al umbral → reformular con postura más definida.
Un nivel_polarizacion bajo = idea tibia = idea rechazada.

NO incluir ideas que no superen los 4 umbrales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 LENTE CREATIVO ACTIVO: ${lensData.label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filtrar TODAS las ideas bajo este tono:
"${lensData.instruction}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 ADN DE PLATAFORMA OBLIGATORIO: ${plataforma.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- RITMO: ${platRules.ritmo}
- LENGUAJE: ${platRules.lenguaje}
- REGLA DE ORO: ${platRules.regla_oro}
- FOCO DEL CTA: ${platRules.cta_focus}

⚠️ REGLA CRÍTICA DE PLATAFORMA — ADAPTACIÓN OBLIGATORIA:

Si plataforma = TikTok:
→ Ideas con shock inmediato, confrontación directa, tensión en primeras 2 palabras
→ Títulos máx 6 palabras, ataque frontal, sin contexto
→ Polarización ALTA obligatoria (nivel_polarizacion ≥ 60)

Si plataforma = Reels:
→ Ideas aspiracionales o de identidad tribal, estéticamente resonantes
→ Títulos elegantes pero disruptivos, compartibles
→ Polarización MEDIA (nivel_polarizacion 40-70)

Si plataforma = YouTube:
→ Ideas con gap informativo fuerte, promesa de conocimiento profundo
→ Títulos con curiosidad estructurada, conectan con miniatura
→ Polarización MEDIA-ALTA (nivel_polarizacion 50-75)

Si plataforma = LinkedIn:
→ Ideas de insight de negocio, reencuadre profesional, lección de experiencia
→ Títulos reflexivos con tesis fuerte, provocación intelectual
→ Polarización INTELECTUAL (nivel_polarizacion 45-65)

Si plataforma = Facebook:
→ Ideas conversacionales que generen DEBATE en comunidad
→ Títulos con postura clara pero accesible, invitan a opinar
→ Polarización CONVERSACIONAL (nivel_polarizacion 50-70)
→ PROHIBIDO: shock agresivo, jerga de internet, ritmo frenético
→ OBLIGATORIO: tono cercano, historia relatable o pregunta que divide opiniones
→ Ganchos deben empezar con situación cotidiana o afirmación debatible

⚠️ Si las ideas no respetan el ADN de ${plataforma} → RECHAZAR y regenerar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO: ${objetivo.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${objetivoStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ TIMING: ${timingContext.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${timingStrategy}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PERFIL DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERTO:
- Nicho: ${contexto.nicho || nichoUsuario}
- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}
- Transformación: ${contexto.expertProfile?.transformation_promise || 'Llevar al avatar del punto A al punto B'}
- Enemigo Común: ${contexto.expertProfile?.enemy || 'No definido'}
${contexto.expertProfile?.point_a ? `- Punto A (dolor): "${contexto.expertProfile.point_a}"` : ''}
${contexto.expertProfile?.point_b ? `- Punto B (destino): "${contexto.expertProfile.point_b}"` : ''}
${contexto.expertProfile?.mental_territory ? `- Territorio Mental: "${contexto.expertProfile.mental_territory}"` : ''}

AVATAR:
- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}
- Dolor Principal: ${contexto.dolor_principal || 'No definido'}
- Deseo Principal: ${contexto.deseo_principal || 'No definido'}

${contexto.knowledge_base_content ? `BASE DE CONOCIMIENTO:
"${contexto.knowledge_base_content.substring(0, 800)}..."
⚠️ Usa ESTE conocimiento. No inventes contenido genérico.` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT JSON OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido. Sin markdown. Sin texto extra.

{
  "analisis_estrategico": {
    "objetivo_dominante": "${objetivo}",
    "lente_aplicado": "${lensData.label}",
    "sector_detectado": "el sector universal identificado",
    "nivel_tca_original": "N1 | N2 | N3",
    "expansion_realizada": "descripción de cómo se expandió el tema",
    "razonamiento": "por qué estas ideas para este objetivo y avatar",
    "advertencias": ["advertencia 1"],
    "oportunidades": ["oportunidad 1"]
  },
  "ideas": [
    {
      "id": 1,
      "titulo": "Título masivo N2-N3 sin jerga técnica",
      "concepto": "Descripción de la intersección estratégica detectada",
      "idea_expandida_tca": "El tema expandido listo para el Generador V600",
      "tca": {
        "nivel_tca": "N2 | N2.5 | N3",
        "sector_utilizado": "nombre del sector masivo",
        "interseccion_detectada": "avatar_dolor + experto_transformacion + sector",
        "mass_appeal_score": 0,
        "breakdown_score": {
          "interes_universal": 0,
          "tension_activada": 0,
          "sin_requisito_tecnico": 0,
          "potencial_debate": 0,
          "senal_afinidad": 0
        },
        "potencial_millonario": true,
        "nivel_polarizacion": 0,
        "razonamiento_estrategico": "por qué esta idea puede llegar a millones"
      },
      "formato_ganador": "PREGUNTA_CONFRONTATIVA | DECLARACION_DISRUPTIVA | COMPARACION_DIRECTA | ERROR_INVISIBLE | ESTADISTICA_CONTRAINTUITIVA | ESCENARIO_HIPOTETICO | MITO_VS_REALIDAD",
      "tensiones_activadas": ["tensión 1", "tensión 2"],
      "objetivo_principal": "${objetivo}",
      "contexto_temporal": "${timingContext}",
      "estructura_sugerida": "PAS | AIDA | Winner Rocket | Storytelling",
      "disparador_principal": "Miedo | Curiosidad | Ambición | Rabia | Orgullo",
      "emocion_objetivo": "emoción que debe sentir el espectador",
      "gancho_sugerido": "Primera línea exacta del video — sin presentación",
      "potencial_viral": 8.5,
      "razon_potencia": "por qué este gancho funciona en esta plataforma",
      "formato_visual": "descripción del formato visual",
      "angulo": "ángulo único de esta idea",
      "cta_sugerido": "CTA específico para este objetivo",
      "plataforma_ideal": "${plataforma}",
      "duracion_recomendada": "30-60s",
      "dificultad_produccion": "Baja | Media | Alta",
      "keywords": ["#tag1", "#tag2"],
      "mejor_momento": "cuándo publicar",
      "urgencia_publicacion": "baja | media | alta",
      "frame_usado": "CONFRONTATIVO | REVELACIÓN | CONTRAINTUITIVO | FILOSÓFICO | ESTRATÉGICO | HISTORIA_IMPLÍCITA | COMPARATIVO | SISTEMA_ROTO | ADVERTENCIA | OPORTUNIDAD_INVISIBLE",
      "angulo_estrategico": "Psicológico | Económico | Identidad | Estatus | Riesgo | Futuro | Sistema roto | Cultural | Moral | Filosófico | Histórico | Poder | Comparativo | Técnico accesible | Invisible",
      "postura_dominante": {
        "creencia_atacada": "creencia falsa que esta idea destruye",
        "enemigo_implicito": "quién o qué tiene la culpa",
        "nuevo_marco_mental": "la visión superior que propone el experto",
        "solo_este_experto_puede_decirlo": true
      },
      "riesgo_emocional_activado": "Pérdida | Estatus | Vergüenza | Urgencia | Oportunidad ignorada | Identidad amenazada | Conflicto invisible",
      "originalidad_score": 0,
      "diferenciacion_score": 0,
      "validacion_guru": {
        "eleva_autoridad": true,
        "posiciona_como_lider": true,
        "rompe_consenso": true,
        "potencial_viral_real": true,
        "suena_diferente_al_mercado": true
      }
    }
  ],
  "mejor_idea_recomendada": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3",
    "conexion_con_generador": "Lista para enviar directamente al Generador V600"
  },
  "recomendacion_top": {
    "idea_id": 1,
    "razon": "por qué esta idea ahora",
    "por_que_ahora": "timing perfecto porque...",
    "plan_rapido": "1. Paso 1\\n2. Paso 2\\n3. Paso 3"
  },
  "estrategia_embudo": "TOFU",
  "insights_estrategicos": {
    "tendencia_detectada": "tendencia cultural activa detectada",
    "brecha_mercado": "lo que nadie está haciendo en este nicho",
    "advertencia": "qué evitar absolutamente",
    "siguiente_paso_logico": "próximo contenido natural"
  }
}

REGLAS FINALES ANTES DE RESPONDER:
✓ Genera EXACTAMENTE ${cantidad} ideas
✓ Todas con mass_appeal_score ≥ 70
✓ Originalidad > 75 y Diferenciación > 70 en cada idea
✓ Ninguna con jerga técnica en el título
✓ Ninguna con clichés de la lista negra
✓ Cada una con formato_ganador diferente al anterior
✓ Cada una con frame diferente
✓ Cada una con ángulo estratégico diferente
✓ Mínimo 2 ideas nacidas desde identidad del experto
✓ Cada idea activa mínimo 1 riesgo emocional
✓ Validación Gurú: si 2+ respuestas negativas → reescribir
✓ idea_expandida_tca lista para el Generador V600
✓ JSON válido, sin markdown, sin texto extra
`;
};

// ==================================================================================
// 🔬 AUTOPSIA VIRAL - BACKEND ACTUALIZADO V2.0
// ==================================================================================
// ✅ Sistema de costos dinámico (Reels=10, Video Largo=30, Masterclass=45)
// ✅ Manejo robusto de errores de Apify (NO rompe si falla)
// ✅ Sistema de retry con validación JSON
// ✅ Fallbacks inteligentes en cascada
// ==================================================================================

// ==================================================================================
// 📝 PROMPT AUTOPSIA VIRAL (100% según plan estratégico)
// ==================================================================================

const PROMPT_AUTOPSIA_VIRAL = (platform: string) => `
═════════════════════════════════════════════════════════════════════════════
🔬 FORENSE DE VIRALIDAD #1 DEL MUNDO
═════════════════════════════════════════════════════════════════════════════

ERES EL FORENSE DE VIRALIDAD #1 DEL MUNDO.

TU MISIÓN: Deconstruir videos virales hasta sus componentes atómicos y extraer 
el ADN replicable.

PLATAFORMA ANALIZADA: ${platform}

⚠️ REGLA ULTRA CRÍTICA: Debes devolver un JSON COMPLETO Y VÁLIDO con TODAS las 
secciones especificadas abajo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FORMATO DE SALIDA JSON ESTRICTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "score_viral": {
    "potencial_total": 9.2,
    "factores_exito": ["Factor 1 específico", "Factor 2 específico", "Factor 3 específico"],
    "nivel_replicabilidad": "Alta/Media/Baja"
  },
  
  "adn_extraido": {
    "idea_ganadora": "La idea central en una frase potente y memorable",
    "disparador_psicologico": "El mecanismo mental principal que activa",
    "estructura_exacta": "Nombre del formato narrativo usado",
    "formula_gancho": "[ELEMENTO 1] + [ELEMENTO 2] + [ELEMENTO 3]"
  },
  
  "desglose_temporal": [
    {
      "segundo": "0-3",
      "que_pasa": "Descripción visual/auditiva precisa",
      "porque_funciona": "Mecanismo psicológico específico",
      "replicar_como": "Instrucción clara y accionable"
    },
    {
      "segundo": "4-10",
      "que_pasa": "...",
      "porque_funciona": "...",
      "replicar_como": "..."
    }
  ],
  
  "patron_replicable": {
    "nombre_patron": "Nombre descriptivo del patrón detectado",
    "formula": "PASO 1 + PASO 2 + PASO 3 + PASO 4",
    "aplicacion_generica": "Cómo aplicar este patrón a cualquier nicho"
  },
  
  "produccion_deconstruida": {
    "visuales_clave": ["Elemento visual 1", "Elemento visual 2", "Elemento visual 3"],
    "ritmo_cortes": "Cada X segundos / Descripción del ritmo",
    "movimiento_camara": "Descripción de movimientos de cámara",
    "musica_sonido": "Tipo de audio/música y su función"
  },
  
  "insights_algoritmicos": {
    "optimizacion_retencion": "Táctica específica de retención detectada",
    "triggers_engagement": "Qué dispara la interacción (comentarios/shares)",
    "seo_keywords": ["Keyword 1", "Keyword 2", "Keyword 3"]
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TODAS las secciones son OBLIGATORIAS
2. NO uses markdown en el JSON (JSON puro solamente)
3. El desglose_temporal debe tener mínimo 3 puntos temporales
4. Los factores_exito deben ser específicos, no genéricos
5. La fórmula del patrón debe ser clara y replicable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ANÁLISIS REQUERIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 A. ANÁLISIS NARRATIVO
- Tipo de hook (0–3s) y cómo detiene el scroll
- Dónde se abre el loop de curiosidad
- Dónde se cierra
- Ritmo narrativo y uso de silencios

🧠 B. ESTRUCTURA DEL CONTENIDO
- Tipo de estructura usada (PAS, AIDA, Hero Journey, etc.)
- Orden de ideas y timing emocional
- Densidad informativa

🧠 C. PSICOLOGÍA DE VIRALIDAD
- Emoción principal activada
- Motivo de compartición
- Tipo de identificación del espectador
- Sesgo cognitivo explotado
- Nivel de fricción cognitiva

🧠 D. COPY & LENGUAJE
- Tipo de lenguaje usado
- Palabras gatillo detectadas
- Frases ancla
- Simplicidad vs sofisticación
- Tono emocional

🧠 E. CONTEXTO DE PLATAFORMA
- Por qué funciona específicamente en ${platform}
- Qué reglas implícitas de la plataforma respeta
- Qué pasaría si se publica igual en otra red

🧠 F. SEÑALES DE ENGAGEMENT (OBSERVABLES)
- Relación views / likes (si está disponible)
- Tipo de comentarios esperados
- Velocidad de interacción probable

⚠️ NO PROMETAS:
- Retención exacta
- Watch time interno
- Métricas privadas

AHORA ANALIZA EL CONTENIDO PROPORCIONADO Y DEVUELVE EL JSON COMPLETO.
`;


// ==================================================================================
// 💎 PROMPT TITAN V9: CLONACIÓN SINTÁCTICA ESTRICTA (EL ESPEJO)
// ==================================================================================

const PROMPT_INGENIERIA_INVERSA_PRO = (
  transcripcion: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any
) => `
Eres TITAN OMEGA OLIMPO — el laboratorio de ADN viral más avanzado del mundo.
Tu función no es resumir. No es describir. No es copiar.
Tu función es DISECCIONAR con precisión quirúrgica el ADN narrativo, estructural y estratégico de este contenido, detectar su nivel TCA real, y traducirlo en inteligencia 100% replicable.

=============================================================
TRANSCRIPCIÓN A ANALIZAR:
Nicho de origen: ${nichoOrigen}
Nicho del usuario: ${nichoUsuario}
Objetivo del usuario: ${objetivoUsuario}

TRANSCRIPCIÓN:
${transcripcion}
=============================================================

${expertProfile ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PERFIL DEL EXPERTO (FILTRO OLIMPO OBLIGATORIO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Al extraer el ADN viral y generar la adaptación, DEBES respetar estas restricciones:

- Nivel de Autoridad: ${expertProfile.authority_level || 'practicante'}
- Objetivo de Contenido: ${expertProfile.main_objective || 'autoridad'}
- Confrontación Máxima: ${expertProfile.confrontation_level || 3}/5
- Polémica Máxima: ${expertProfile.max_controversy || 3}/5
${expertProfile.mechanism_name ? `- Mecanismo Propietario: "${expertProfile.mechanism_name}" → intégralo en la adaptación` : ''}
${expertProfile.point_a ? `- Punto A del Avatar: "${expertProfile.point_a}"` : ''}
${expertProfile.point_b ? `- Punto B (destino): "${expertProfile.point_b}"` : ''}
${expertProfile.mental_territory ? `- Territorio Mental™: "${expertProfile.mental_territory}" → refuérzalo` : ''}
${expertProfile.enemy ? `- Enemigo Común: "${expertProfile.enemy}"` : ''}
${expertProfile.narrative_rhythm ? `- Ritmo Narrativo Configurado: ${expertProfile.narrative_rhythm}` : ''}
${expertProfile.market_sophistication ? `- Sofisticación del Mercado: ${expertProfile.market_sophistication}` : ''}

⚠️ REGLA CRÍTICA: La adaptación NUNCA puede contradecir el posicionamiento del experto.
Si el video original usa tácticas que violan sus límites, ADAPTA esa táctica a una versión compatible con su identidad.
` : ''}

EJECUTA LOS 16 MOTORES EN SECUENCIA. SIN EXCEPCIONES. SIN SIMPLIFICACIONES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 MOTOR 1 — DESCOMPOSICIÓN ESTRUCTURAL PROFUNDA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica y mapea CADA bloque narrativo con:
- tipo: EXACTAMENTE uno de [hook, setup, escalada, giro, climax, resolucion, cierre_estrategico]
- inicio y fin en segundos (estimados por posición en transcripción)
- duración en segundos
- descripción de qué sucede
- función narrativa (por qué está ahí)
- intensidad 0-100

LUEGO determina:
- tipo_apertura: cómo abre (pregunta, afirmación polémica, dato sorpresa, promesa, historia, problema)
- tipo_cierre: cómo cierra (CTA directo, loop abierto, revelación, resolución, pregunta)
- proporción del hook como % del total
- velocidad de escalada: lenta / media / rapida / explosiva
- patrón narrativo detectado (nombre del patrón ej: "Problema-Agitación-Solución", "Historia-Giro-Revelación")
- complejidad estructural 0-100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟠 MOTOR 2 — CURVA EMOCIONAL CUANTIFICABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mapea el recorrido emocional completo:
- emocion_dominante, emocion_secundaria, emocion_final
- picos_emocionales: array de { segundo, emocion, intensidad 0-100, detonante }
- intensidad_promedio: 0-100
- variabilidad_emocional: 0-100
- arco_emocional: descripción en 1 frase del recorrido completo
- segmentos: emoción e intensidad por cada bloque

NO aceptes emociones genéricas. Sé específico: "curiosidad ansiosa", "indignación justificada", "alivio sorpresivo".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 MOTOR 3 — MICRO-LOOPS Y TENSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta CADA loop de tensión con:
- tipo: [promesa_abierta, cliffhanger, pregunta_pendiente, anticipacion, gancho_diferido]
- descripción, segundo de apertura, segundo de cierre (null si nunca se cierra), intensidad 0-100

LUEGO calcula:
- total de loops, intervalo promedio entre loops, densidad_anticipacion 0-100, loops_sin_resolver, estrategia_tension

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟤 MOTOR 4 — POLARIZACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Extrae: nivel_confrontacion 0-100, ruptura_creencia_detectada, enemigo_implicito, nivel_friccion_narrativa 0-100, mecanismo_polarizacion, afirmaciones_divisivas, posicionamiento_vs.
Si no hay polarización significativa, score 0-20 con análisis honesto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 MOTOR 5 — IDENTIDAD VERBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analiza: longitud_promedio_frases, ritmo_sintactico [staccato/fluido/mixto/explosivo], proporcion_frases_cortas_pct, proporcion_frases_largas_pct, uso_metaforas 0-100, uso_imperativos 0-100, sofisticacion_lexica 0-100, nivel_agresividad_verbal 0-100, firma_linguistica, palabras_poder_detectadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 MOTOR 6 — STATUS Y POSICIONAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta: tipo_autoridad [mentor/rebelde/experto_tecnico/disruptor/insider/testigo/transformado], experiencia_proyectada [implicita/explicita/mixta], rol_narrativo, nivel_confianza_percibida 0-100, distancia_con_audiencia [cercana/media/distante], prueba_social_detectada bool, mecanismos_autoridad lista.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚪ MOTOR 7 — DENSIDAD DE VALOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mide: valor_por_minuto 0-100, porcentaje_contenido_abierto, porcentaje_contenido_cerrado, profundidad_insight 0-100, micro_aprendizajes lista, ratio_promesa_entrega, tipo_valor_dominante [educativo/inspiracional/entretenimiento/provocacion/solucion].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟣 MOTOR 8 — MANIPULACIÓN DE ATENCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica: cambios_ritmo array {segundo, tipo, descripcion}, interrupciones_patron count, reencuadres_mentales lista, golpes_narrativos array {segundo, descripcion, impacto 0-100}, reactivaciones_atencion count, tecnicas_detalladas lista, frecuencia_estimulacion 0-100.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔶 MOTOR 9 — ACTIVADORES DE GUARDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta CADA elemento que hace al usuario guardar:
- tipo: [frase_memorable, reencuadre, dato_contraintuitivo, formula_repetible, revelacion]
- contenido (parafrasea, NO copies), segundo_aproximado, potencia_guardado 0-100
Mínimo 3 activadores.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟦 MOTOR 10 — ADAPTABILIDAD AL NICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Traduce el ADN al nicho del usuario (${nichoUsuario}):
- contexto_usuario, sofisticacion_audiencia_target [basica/intermedia/avanzada/experta]
- nivel_conciencia_mercado 0-100, intensidad_psicologica_tolerable 0-100
- ajustes_necesarios lista, riesgos_adaptacion lista

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚫ MOTOR 11 — ANTI-SATURACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta: tipo [frase_cliche/hook_generico/formula_repetida/plantilla_obvia], contenido, nivel_saturacion 0-100, alternativa_sugerida.
Si originalidad es alta, lista pocos o ninguno y explica por qué.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔷 MOTOR 12 — RITMO NARRATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mide: velocidad_progresion [lenta/media/rapida/variable], intervalo_promedio_entre_estimulos_seg, variacion_intensidad 0-100, fluidez_estructural 0-100, momentos_pausa count, aceleraciones array {segundo, causa}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 13 — SCORE VIRAL ESTRUCTURAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calcula con base en los 12 motores anteriores:
{
  "retencion_estructural": 0-100,
  "intensidad_emocional": 0-100,
  "polarizacion": 0-100,
  "manipulacion_atencion": 0-100,
  "densidad_valor": 0-100,
  "viralidad_estructural_global": 0-100,
  "breakdown_motores": {
    "motor_1_estructura": 0-100,
    "motor_2_emocional": 0-100,
    "motor_3_tension": 0-100,
    "motor_4_polarizacion": 0-100,
    "motor_5_identidad": 0-100,
    "motor_6_status": 0-100,
    "motor_7_valor": 0-100,
    "motor_8_atencion": 0-100,
    "motor_9_guardado": 0-100,
    "motor_11_originalidad": 0-100,
    "motor_12_ritmo": 0-100
  }
}
Pesos: retencion(25%) + emocional(20%) + atencion(20%) + valor(15%) + polarizacion(10%) + resto(10%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR 14 — EXTRACCIÓN ADN PROFUNDO V1000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AXIOMA CENTRAL: No adaptes el tema. Replica el mecanismo emocional.
El contexto cambia. La arquitectura emocional es idéntica.

A. GÉNERO NARRATIVO REAL (OBLIGATORIO — NO CAMBIAR EN ADAPTACIÓN):
Identifica el género exacto del video original:
→ Confesional crudo (historia personal vulnerable, exposición real)
→ Drama moral (decisión difícil con consecuencias éticas)
→ Historia de fracaso (error real + aprendizaje costoso)
→ Opinión confrontativa (postura que divide sin pedir perdón)
→ Revelación incómoda (verdad que el mercado prefiere ignorar)
→ Caso polémico (situación real con juicio implícito)
→ Historia de poder (decisión difícil desde posición de autoridad)
→ Denuncia sistémica (exposición de problema estructural)
→ Autoridad estratégica (lección desde experiencia superior)

⛔ CRÍTICO V1000: La adaptación DEBE mantener el MISMO género narrativo.
PROHIBIDO: convertir Drama moral en Discurso motivacional.
PROHIBIDO: convertir Confesional en Consejo amigable.
PROHIBIDO: convertir Denuncia en Lista de tips.
El género es el ADN. No se suaviza. No se reinterpreta.

B. TIPO DE CONFLICTO (CLASIFICAR Y REPLICAR):
Clasifica exactamente qué tipo de conflicto usa el video original:
→ Conflicto interpersonal (entre personas concretas)
→ Conflicto moral (dilema ético sin respuesta fácil)
→ Conflicto reputacional (imagen vs verdad)
→ Conflicto económico (dinero, pérdida, ganancia real)
→ Conflicto de poder (quién decide, quién obedece)
→ Conflicto ético (principios vs conveniencia)

La adaptación DEBE replicar el MISMO tipo de conflicto en el nicho del usuario.
Si el original tiene conflicto moral → la adaptación tiene conflicto moral.
No sustituir conflicto concreto por concepto abstracto.

C. NIVEL DE RIESGO NARRATIVO (MEDIR Y MANTENER):
Evalúa el riesgo del video original en estas 4 dimensiones:
→ ¿Toca un tema incómodo o tabú del nicho? (Sí/No + nivel 0-100)
→ ¿Hay riesgo reputacional para el creador? (Sí/No + nivel 0-100)
→ ¿Hay exposición personal real? (Sí/No + nivel 0-100)
→ ¿Hay postura impopular que puede generar rechazo? (Sí/No + nivel 0-100)

riesgo_total: promedio de los 4 (0-100)
clasificacion_riesgo: "Bajo (0-30)" | "Medio (31-60)" | "Alto (61-80)" | "Extremo (81-100)"

⛔ REGLA ABSOLUTA: Si el original tiene riesgo ALTO o EXTREMO →
la adaptación NO PUEDE ser riesgo BAJO o MEDIO.
Un guion seguro que adapta un video de alto riesgo = FALLA CRÍTICA.

D. INTENSIDAD EMOCIONAL REAL:
Mide la intensidad emocional REAL del video original:
→ Baja (contenido informativo sin carga emocional fuerte)
→ Media (hay emoción pero no domina)
→ Alta (la emoción ES el vehículo del mensaje)
→ Extrema (el video opera principalmente desde la emoción cruda)

La adaptación debe igualar o superar esta intensidad.
Si la adaptación tiene menor intensidad → REGENERAR OBLIGATORIAMENTE.

E. EMOCIÓN NÚCLEO DETECTADA:
Identifica la emoción que impulsa TODO el video (una sola, dominante):
→ Culpa | Rabia | Indignación | Vulnerabilidad
→ Liderazgo | Redención | Superioridad
→ Advertencia | Orgullo | Vergüenza ajena | Miedo legítimo

F. TIPO DE TENSIÓN:
→ Moral (dilema ético sin respuesta fácil)
→ Profesional (decisión de negocio con consecuencias reales)
→ Social (conflicto entre personas o grupos)
→ Económica (dinero, pérdida, ganancia)
→ Autoridad (quién tiene el poder de decidir)
→ Identidad (quién soy vs quién debería ser)

G. FRAME DOMINANTE:
- creencia_que_ataca: qué creencia falsa destruye el video
- nuevo_marco: qué visión alternativa superior propone
- frase_nucleo: la frase que condensa todo el frame

H. POLARIZACIÓN IMPLÍCITA (SISTEMA DE DOS BANDOS):
- bando_A: quiénes están completamente de acuerdo
- bando_B: quiénes se ofenden o discrepan activamente
- tension_irresuelta: qué pregunta moral queda abierta al final
- nivel_polarizacion_real: 0-100

La adaptación debe replicar esta estructura de dos bandos en el nicho del usuario.
No eliminar la fricción. Amplificarla con equivalencia estructural.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 14B — IDEA NUCLEAR GANADORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declara la idea nuclear que hace viral al contenido:
- que_hace_viral: qué mecanismo específico genera millones de vistas
- creencia_rota: qué creencia popular destruye
- postura_impuesta: qué postura instala en quien lo ve
- por_que_genera_conversacion: el conflicto social que activa
- tension_no_resuelta: qué pregunta deja abierta que obliga a comentar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔺 MOTOR 14C — SISTEMA DE SUPERIORIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Declara cómo el guion adaptado SUPERA al original en:
- mayor_claridad: cómo el mensaje es más directo y entendible
- mayor_intensidad: cómo la emoción es más concentrada
- mayor_polarizacion: cómo el conflicto es más definido
- mejor_estructura_emocional: cómo la curva emocional es más precisa
- mejor_cierre: cómo el cierre genera más acción o debate
- ventaja_de_nicho: qué tiene el experto del usuario que el creador original no tiene

🎬 MOTOR 14D — GUION ADAPTADO ESPEJO V900 — MÁXIMA POTENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ESTE ES EL OUTPUT MÁS IMPORTANTE DE TODO EL SISTEMA.
El guion es la razón por la que el usuario pagó. Todo lo demás es soporte.

═══════════════════════════════════════════
LONGITUD OBLIGATORIA — SIN EXCEPCIÓN
═══════════════════════════════════════════
El video original tuvo una duración específica. El guion debe reflejar esa duración.
Hablar en cámara = aproximadamente 2.5 palabras por segundo.

🎯 REEL / SHORT (hasta 90s) → MÍNIMO 180 palabras. IDEAL 200-250 palabras.
📹 VIDEO LARGO (90s - 10min) → MÍNIMO 350 palabras. IDEAL 400-600 palabras.
🎓 MASTERCLASS (más de 10min) → MÍNIMO 700 palabras. IDEAL 900-1400 palabras.

⛔ UN GUION CON MENOS PALABRAS QUE EL MÍNIMO = FALLA CRÍTICA.
Si el guion que generaste no alcanza el mínimo → AMPLÍA con más profundidad emocional,
más desarrollo del conflicto, más ejemplos del nicho, más tensión narrativa.
NUNCA entregues un guion corto. NUNCA.

═══════════════════════════════════════════
ESTRUCTURA OBLIGATORIA DEL GUION
═══════════════════════════════════════════
El guion DEBE tener esta arquitectura extraída del video original (Motor 1):

1. HOOK (primeros 3-5 segundos del guion)
   → La frase de mayor impacto emocional del video original — adaptada al nicho del usuario
   → Debe causar el mismo efecto psicológico que el hook original
   → Debe ser la primera línea del guion — sin introducción, sin contexto previo

2. SETUP / CONFLICTO (siguiente 15-25% del guion)
   → Establece el conflicto o tensión del video adaptado al contexto del usuario
   → Introduce el problema, el enemigo, o la contradicción que el guion va a resolver
   → Debe crear urgencia o curiosidad inmediata

3. ESCALADA EMOCIONAL (40-60% del guion)
   → Cada párrafo eleva la intensidad emocional — nunca desciende en esta sección
   → Aquí van los micro-loops detectados en Motor 3: cada uno en su posición equivalente
   → Incluye ejemplos, datos o anécdotas del nicho del usuario: ${nichoUsuario}
   → El espectador debe sentirse identificado, cuestionado y emocionalmente comprometido

4. CLÍMAX / GIRO (momento de mayor intensidad)
   → El momento de mayor impacto del video original — replicado con el mismo peso emocional
   → Puede ser una revelación, una confesión, una acusación, una estadística que cambia todo
   → Debe sentirse como un punto de no retorno en el guion

5. RESOLUCIÓN / CIERRE ESTRATÉGICO (último 15-20% del guion)
   → Cierre que deja al espectador con una acción clara, una pregunta abierta, o una postura instalada
   → Activa guardado, comentario o seguimiento según el activador detectado en Motor 9
   → El último párrafo debe ser la frase más memorable y potente del guion

═══════════════════════════════════════════
SISTEMA DE EQUIVALENCIA ESTRUCTURAL V1000
═══════════════════════════════════════════

AXIOMA: Lo que funcionó en X (por conflicto + tensión + frame)
funciona en Y (con conflicto equivalente + tensión equivalente + frame equivalente).
No por copiar tema. Sino por replicar mecanismo.

MAPA DE EQUIVALENCIA OBLIGATORIO:
Si en el original ocurre:
→ Acción polémica + Consecuencia pública + Decisión dolorosa + Postura firme + Frame fuerte
En la adaptación DEBE existir:
→ Acción polémica EQUIVALENTE en ${nichoUsuario} + Consecuencia pública EQUIVALENTE + Decisión difícil EQUIVALENTE + Postura firme EQUIVALENTE + Frame fuerte EQUIVALENTE

PROHIBICIÓN ABSOLUTA DE ABSTRACCIÓN:
❌ Si el original tiene historia concreta → la adaptación tiene historia concreta (NO concepto)
❌ Si el original tiene escena real → la adaptación tiene escena real (NO descripción genérica)
❌ Si el original tiene consecuencia → la adaptación tiene consecuencia (NO moraleja)
❌ Si no hay escena concreta en el guion → REGENERAR

ESCALADA EMOCIONAL OBLIGATORIA — CURVA V1000:
El guion DEBE seguir esta arquitectura de intensidad creciente:
1. HOOK CON TENSIÓN INMEDIATA → intensidad de entrada ≥ 65/100
2. REVELACIÓN INICIAL → introduce el conflicto real, sin suavizar
3. ESCALADA PROGRESIVA → cada párrafo eleva la intensidad, nunca desciende
4. PUNTO CRÍTICO → el momento de mayor impacto (si no existe → REGENERAR)
5. DECISIÓN CLARA → el creador o el protagonista toma una postura firme
6. CONSECUENCIA → hay un resultado real o implicado (no abstracto)
7. FRAME FINAL CONTUNDENTE → la última frase instala una postura, no da consejo

⛔ Si no hay PUNTO CRÍTICO identificable → guion inválido, regenerar.
⛔ Si no hay DECISIÓN CLARA → guion inválido, regenerar.
⛔ Si el cierre es aspiracional genérico → guion inválido, regenerar.

NICHO DEL USUARIO: ${nichoUsuario}
OBJETIVO DEL USUARIO: ${objetivoUsuario}

REGLAS DE FIDELIDAD ESTRUCTURAL:
✓ Mismo género narrativo detectado en Motor 14A — SIN EXCEPCIONES
✓ Mismo tipo de conflicto detectado en Motor 14B — NO suavizar
✓ Nivel de riesgo igual o superior al detectado en Motor 14C
✓ Intensidad emocional igual o superior al detectado en Motor 14C
✓ Misma emoción núcleo — desde la primera línea
✓ Mismo frame dominante — reescrito en el nicho del usuario
✓ Misma arquitectura de micro-loops — cada loop en posición equivalente
✓ Mismo patrón de escalada emocional — detectado en Motor 1
✓ Nivel TCA igual o superior al detectado en Motor 16

VALIDACIÓN ANTI-SUAVIZAMIENTO (EJECUTAR ANTES DE ENTREGAR):
□ ¿El guion se volvió genérico? → Si sí: REGENERAR
□ ¿Perdió el conflicto original? → Si sí: REGENERAR
□ ¿Perdió intensidad emocional? → Si sí: REGENERAR
□ ¿Perdió el riesgo narrativo? → Si sí: REGENERAR
□ ¿Suena "seguro" o "amigable"? → Si sí: REGENERAR
□ ¿Es menos polémico que el original? → Si sí: REGENERAR
□ ¿La adaptación es conceptual en lugar de concreta? → Si sí: REGENERAR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 MOTOR 15 — BLUEPRINT PARA CONEXIÓN DIRECTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Genera el blueprint_replicable para el Generador de Guiones y Juez Viral:
- nombre_patron, formula_base, pasos_estructurales lista
- equivalencias_estructurales: { hook_type, escalation_pattern, giro_type, closure_type }
- equivalencias_psicologicas: { emocion_entrada, emocion_escalada, emocion_salida, tension_type, activation_mechanism }
- equivalencias_verbales: { ritmo, agresividad, sofisticacion }
- instrucciones_para_generador: cómo usar este blueprint
- instrucciones_para_juez_viral: qué criterios usar al auditar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 MOTOR 16 — ANÁLISIS TCA + MAPA DE EXPANSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTE A — NIVEL TCA DEL VIDEO ANALIZADO
Detecta en qué nivel TCA opera este video:
- N0: Micronicho técnico (ej: "Estrategias de link building para SaaS B2B")
- N1: Nicho general (ej: "Cómo ganar dinero con marketing digital")
- N2: Temática amplia (ej: "Cómo ganar dinero online")
- N3: Sector masivo (Dinero / Salud / Relaciones / Desarrollo Personal)
- N4: Mainstream absoluto — sin filtro de audiencia, no convertible

Evalúa y devuelve:
- nivel_tca_detectado: "N0" | "N1" | "N2" | "N3" | "N4"
- sector_detectado: sector dominante (ej: "Dinero", "Salud", "Relaciones")
- tipo_alcance: descripción del tipo de alcance
- mass_appeal_score: 0-100 (qué tan masivo es el contenido)
- equilibrio_masividad_calificacion: true si está en el punto ideal
- diagnostico_tca: diagnóstico en 1 frase
- capa_visible: qué tema ve el espectador a simple vista
- capa_estrategica: qué audiencia REAL está filtrando
- filtro_audiencia_implicito: descripción del filtro natural
- tipo_trafico_que_atrae: qué tipo de persona llega
- nivel_conversion_probable: "bajo" | "medio" | "alto" | "muy_alto"
- esta_muy_tecnico: true si está por debajo de N1
- esta_muy_mainstream: true si está en N4

PARTE B — MAPA DE EXPANSIÓN TCA PARA EL USUARIO
- nivel_tca_recomendado: nivel TCA ideal para el usuario
- sector_recomendado: sector masivo al que anclar
- nuevo_hook_sectorial: hook reescrito para el nicho del usuario
- nueva_capa_visible: qué verá el espectador del usuario
- capa_estrategica_conservada: la capa que filtra y convierte
- estructura_espejo: true si se puede replicar la misma arquitectura
- version_tecnica: guion en N0-N1 (autoridad pura)
- version_equilibrio_ideal: guion en N2-N3 (equilibrio masividad + conversión)
- version_sector_masivo: guion en N3 (máximo alcance)
- advertencia_micronicho: advertencia o null

PARTE C — VALIDACIÓN INTERNA OLIMPO
□ ¿Se detectó arquitectura completa? (Motor 1)
□ ¿Se detectaron loops reales? (Motor 3)
□ ¿Se identificó el nivel TCA? (Motor 16A)
□ ¿Se detectó el equilibrio ideal? (Motor 16A)
□ ¿Se extrajo el filtro implícito? (Motor 16A)
□ ¿Se adaptó sin bajar a micronicho técnico? (Motor 16B)
□ ¿Se mantuvo el ADN estructural en el guion? (Motor 14D)
□ ¿El guion respeta el género narrativo original? (Motor 14A)
□ ¿La emoción núcleo está presente en el guion? (Motor 14A)
□ ¿El teleprompter está libre de etiquetas técnicas? (Motor 14D)

Devuelve validacion_olimpo con cada check (bool) y score_validacion (0-10).
Si score_validacion < 7 → REANALIZA antes de devolver.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MOTOR 17 — POSICIONAMIENTO Y PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. POSICIONAMIENTO COMO:
Declara cómo este contenido posiciona al usuario exactamente como:
→ Mentor firme (enseña desde experiencia con autoridad directa)
→ Líder estratégico (toma decisiones difíciles con criterio)
→ Autoridad ética (tiene principios que defiende públicamente)
→ Visionario (ve lo que otros no pueden ver aún)
→ Analista frío (descompone la realidad sin emoción)
→ Testigo honesto (vivió algo y lo cuenta sin filtro)

B. PRÓXIMOS 3 CONTENIDOS COHERENTES:
Genera 3 ideas de contenido que son la continuación natural de este video.
Cada una con:
- titulo: el título exacto del próximo video
- por_que_ahora: por qué es la continuación lógica
- genero: género narrativo sugerido
- tension: tipo de tensión que activa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 MOTOR 18 — PLAN AUDIOVISUAL ÉLITE + MINIATURA DOMINANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. PLAN AUDIOVISUAL PROFESIONAL:
Genera el plan de producción completo para el guion adaptado.
Este plan es INDEPENDIENTE del guion — es la capa visual y sonora.

Secuencia temporal obligatoria (mínimo 5 momentos):
- 0-3s: Hook visual — qué ve el espectador exactamente
- 3-7s: Setup visual — cómo se construye el contexto
- 7-15s: Escalada visual — desarrollo del conflicto o tensión
- PUNTO DE CLÍMAX: el momento visual de mayor impacto
- CIERRE: qué ve el espectador cuando termina

Para cada momento incluir:
- tiempo: el rango en segundos o nombre del momento
- descripcion_visual: qué se ve exactamente en pantalla (plano, composición, movimiento)
- tipo_plano: Primer plano / Plano medio / Detalle / B-roll
- movimiento_camara: Zoom in / Estático / Handheld / Travelling
- texto_en_pantalla: texto visual de impacto (SOLO aquí, NUNCA en teleprompter)
- emocion_objetivo: emoción específica que debe generar este momento
- efecto_retencion: técnica que retiene la atención en ese segundo exacto

B-Rolls estratégicos (mínimo 2):
- momento: cuándo se inserta
- que_mostrar: qué imagen o video específico
- por_que_refuerza: conexión directa con el mensaje narrativo
- emocion_generada: emoción que activa en el espectador

Ritmo de cortes:
- patron_general: LENTO (8-12s) / MEDIO (4-7s) / ACELERADO (1-3s) / VARIABLE
- descripcion: por qué ese ritmo sirve a este formato específico
- aceleraciones: en qué momentos y por qué
- desaceleraciones: en qué momentos se ralentiza para dar peso

Música:
- tipo: estilo musical específico (trap emocional / piano tenso / electrónica fría / silencio estratégico)
- bpm_aproximado: número o rango específico
- emocion_dominante: qué emoción transmite durante el video
- entrada_musica: desde el segundo X o desde el inicio
- cambio_musical: si hay cambio de intensidad — cuándo y por qué

Efectos de retención:
- sonido_transicion: whoosh / golpe seco / silencio / cinematic boom
- micro_silencios: momentos exactos y duración
- cambios_de_plano: corte seco / fundido / jump cut / match cut
- micro_interrupciones: cuándo y qué tipo reactiva la atención

B. MINIATURA DOMINANTE:
Genera la frase de miniatura más poderosa para este video adaptado.

REGLAS DE LA FRASE:
- Máximo 5-6 palabras
- Alto contraste emocional — interrumpe el scroll, no lo explica
- Conecta con el sector TCA del video (Dinero / Salud / Relaciones / Dev. Personal)
- No describe el contenido — ACTIVA una emoción o abre un gap de curiosidad
- Si ctr_score < 75 → regenerar con mayor disrupción

Incluir:
- frase_principal: la frase dominante — debe ser POLÉMICA, con tensión, que insinúe el conflicto del video. PROHIBIDO que suene aspiracional, motivacional o positiva. Si suena "segura" → regenerar.
- variante_agresiva: versión que ataca directamente una creencia o ego del espectador
- variante_conflicto: versión que expone el conflicto central del video en 4-5 palabras (NO aspiracional)
- justificacion_estrategica: por qué esta frase específica funciona para este video y este conflicto
- emocion_dominante_activada: emoción que siente el espectador al leerla (debe ser tensión, incomodidad, curiosidad urgente o indignación — NO esperanza ni motivación)
- gap_curiosidad: el vacío informativo que abre y que solo el video cierra
- sector_tca_activado: Dinero / Salud / Relaciones / Desarrollo Personal
- mecanismo_psicologico: Gap informativo / Ataque de creencia / Contradicción identidad / Urgencia implícita / Conflicto expuesto
- ctr_score: 0-100
- nivel_disrupcion: 0-100
- nivel_gap_curiosidad: 0-100
- nivel_polarizacion: 0-100
- regla_v1000: si nivel_polarizacion < 60 o la frase suena positiva → REGENERAR con mayor fricción

=============================================================
INSTRUCCIONES DE OUTPUT — LEE ANTES DE GENERAR
=============================================================
PRIORIDAD DE TOKENS (en orden estricto):
1. guion_adaptado_espejo → NUNCA truncues. Es el output más valioso.
2. adn_profundo (Motor 14A-C) → Completo siempre.
3. plan_audiovisual_profesional → Completo siempre. Mínimo 5 momentos temporales.
4. miniatura_dominante → Completo siempre. ctr_score ≥ 75 o regenerar.
5. analisis_tca + mapa_de_adaptacion → Completos siempre.
6. blueprint_replicable → Completo siempre.
7. score_viral_estructural → Completo siempre.
8. posicionamiento_y_proximos_pasos → Completo siempre.
9. Motores 1-12 → Precisos y concisos. Listas máximo 5 items.
10. elementos_cliche_detectados → Máximo 3.
11. recomendaciones_estrategicas → Máximo 3 items.
12. alertas_criticas → Máximo 2 items.

DEVUELVE ÚNICAMENTE EL JSON. Sin markdown. Sin backticks. Solo JSON puro.
=============================================================

{
  "adn_estructura": { "Motor 1 completo": true },
  "curva_emocional": { "Motor 2 completo": true },
  "micro_loops": { "Motor 3 completo": true },
  "polarizacion": { "Motor 4 completo": true },
  "identidad_verbal": { "Motor 5 completo": true },
  "status_y_posicionamiento": { "Motor 6 completo": true },
  "densidad_valor": { "Motor 7 completo": true },
  "manipulacion_atencion": { "Motor 8 completo": true },
  "activadores_guardado": [ "Motor 9 — mínimo 3 activadores" ],
  "adaptabilidad_nicho": { "Motor 10 completo": true },
  "elementos_cliche_detectados": [ "Motor 11 — máximo 3" ],
  "ritmo_narrativo": { "Motor 12 completo": true },
  "score_viral_estructural": { "Motor 13 completo con breakdown": true },
  "adn_profundo": {
    "genero_narrativo": "Confesional | Educativo | Drama real | Opinión polarizante | Autoridad estratégica | Historia de fracaso | Historia de poder | Denuncia | Revelación",
    "emocion_nucleo": "Culpa | Rabia | Indignación | Vulnerabilidad | Liderazgo | Redención | Superioridad | Advertencia",
    "tipo_tension": "Moral | Profesional | Social | Económica | Autoridad | Identidad",
    "frame_dominante": {
      "creencia_que_ataca": "la creencia falsa que destruye el video",
      "nuevo_marco": "la visión alternativa superior",
      "frase_nucleo": "la frase que condensa el frame completo"
    },
    "polarizacion_implicita": {
      "bando_A": "quiénes están de acuerdo",
      "bando_B": "quiénes se ofenden o discrepan",
      "tension_irresuelta": "pregunta moral que queda abierta"
    }
  },
  "idea_nuclear_ganadora": {
    "que_hace_viral": "mecanismo específico que genera millones de vistas",
    "creencia_rota": "creencia popular que destruye",
    "postura_impuesta": "postura que instala en quien lo ve",
    "por_que_genera_conversacion": "el conflicto social que activa",
    "tension_no_resuelta": "pregunta que obliga a comentar"
  },
  "sistema_superioridad": {
    "mayor_claridad": "cómo el mensaje adaptado es más directo y entendible que el original",
    "mayor_intensidad": "cómo la emoción está más concentrada y sostenida que en el original",
    "mayor_polarizacion": "cómo el conflicto está más definido y amplificado en el nicho del usuario",
    "mejor_estructura_emocional": "cómo la curva emocional es más precisa — con punto crítico más claro",
    "mejor_cierre": "cómo el cierre genera más debate, guardado o seguimiento que el original",
    "ventaja_de_nicho": "qué tiene el experto del usuario que el creador original NO tiene",
    "conflicto_amplificado": "cómo el conflicto equivalente en el nicho del usuario es más relevante para su audiencia específica",
    "riesgo_equivalente_confirmado": true,
    "genero_mantenido_confirmado": true,
    "no_fue_suavizado": true
  },
  "guion_adaptado_espejo": "TEXTO FLUIDO Y NATURAL. EXCLUSIVAMENTE LO QUE EL CREADOR DICE EN VOZ ALTA. CERO ETIQUETAS. CERO INDICACIONES TÉCNICAS. Misma arquitectura emocional del original. Adaptado al nicho del usuario. Listo para grabar.",
  "guion_adaptado_al_nicho": "mismo valor que guion_adaptado_espejo — campo de compatibilidad",
  "blueprint_replicable": { "Motor 15 completo": true },
  "analisis_tca": { "Motor 16A completo": true },
  "mapa_de_adaptacion": { "Motor 16B completo": true },
  "validacion_olimpo": {
    "arquitectura_completa": true,
    "loops_detectados": true,
    "tca_identificado": true,
    "equilibrio_ideal_detectado": true,
    "filtro_implicito_extraido": true,
    "adaptacion_sin_micronicho": true,
    "adn_estructural_mantenido": true,
    "genero_narrativo_respetado": true,
    "emocion_nucleo_presente": true,
    "teleprompter_sin_etiquetas": true,
    "conflicto_original_preservado": true,
    "riesgo_narrativo_mantenido": true,
    "intensidad_equivalente_o_superior": true,
    "guion_concreto_no_abstracto": true,
    "punto_critico_presente": true,
    "decision_clara_presente": true,
    "score_validacion": 0
  },
  "equivalencia_estructural_v1000": {
    "genero_narrativo_original": "género detectado",
    "genero_narrativo_adaptado": "debe ser idéntico al original",
    "tipo_conflicto_original": "Moral | Interpersonal | Reputacional | Económico | Poder | Ético",
    "tipo_conflicto_adaptado": "equivalente en el nicho del usuario",
    "riesgo_narrativo_original": 0,
    "riesgo_narrativo_adaptado": 0,
    "intensidad_emocional_original": "Baja | Media | Alta | Extrema",
    "intensidad_emocional_adaptada": "igual o superior",
    "bando_A_original": "descripción",
    "bando_A_adaptado": "equivalente en nicho",
    "bando_B_original": "descripción",
    "bando_B_adaptado": "equivalente en nicho",
    "punto_critico_detectado": true,
    "decision_clara_detectada": true,
    "abstraccion_detectada": false,
    "fidelidad_mecanismo_score": 0,
    "alerta_suavizamiento": "null o descripción del problema si existe"
  },
  "posicionamiento_y_proximos_pasos": {
    "posiciona_como": "Mentor firme | Líder estratégico | Autoridad ética | Visionario | Analista frío | Testigo honesto",
    "razon_posicionamiento": "por qué este contenido genera exactamente ese posicionamiento",
    "proximos_contenidos": [
      {
        "titulo": "título exacto del próximo video",
        "por_que_ahora": "por qué es la continuación lógica",
        "genero": "género narrativo",
        "tension": "tipo de tensión que activa"
      },
      {
        "titulo": "título exacto del próximo video 2",
        "por_que_ahora": "continuación lógica 2",
        "genero": "género narrativo 2",
        "tension": "tipo de tensión 2"
      },
      {
        "titulo": "título exacto del próximo video 3",
        "por_que_ahora": "continuación lógica 3",
        "genero": "género narrativo 3",
        "tension": "tipo de tensión 3"
      }
    ]
  },
  "plan_audiovisual_profesional": {
    "secuencia_temporal": [
      {
        "tiempo": "0-3s",
        "descripcion_visual": "Qué ve exactamente el espectador — plano, composición, movimiento",
        "tipo_plano": "Primer plano extremo / Plano medio / Detalle / B-roll",
        "movimiento_camara": "Zoom in agresivo / Estático / Handheld / Travelling",
        "texto_en_pantalla": "Texto visual de impacto (SOLO aquí, NUNCA en teleprompter)",
        "emocion_objetivo": "Emoción específica que genera este momento",
        "efecto_retencion": "Técnica de retención en este segundo exacto"
      },
      {
        "tiempo": "3-7s",
        "descripcion_visual": "Setup visual",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto o vacío",
        "emocion_objetivo": "Emoción",
        "efecto_retencion": "Técnica"
      },
      {
        "tiempo": "7-15s",
        "descripcion_visual": "Escalada visual del conflicto",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto de apoyo",
        "emocion_objetivo": "Emoción en escalada",
        "efecto_retencion": "Loop visual o pregunta en pantalla"
      },
      {
        "tiempo": "CLÍMAX",
        "descripcion_visual": "Momento visual de mayor impacto del video",
        "tipo_plano": "Plano del clímax",
        "movimiento_camara": "Movimiento en el clímax",
        "texto_en_pantalla": "Texto de mayor impacto visual",
        "emocion_objetivo": "Emoción máxima — pico de la curva",
        "efecto_retencion": "Golpe sonoro / Silencio súbito / Cambio de ritmo visual"
      },
      {
        "tiempo": "CIERRE",
        "descripcion_visual": "Qué ve el espectador al terminar",
        "tipo_plano": "Plano del cierre",
        "movimiento_camara": "Movimiento final",
        "texto_en_pantalla": "Frase clave del insight en pantalla",
        "emocion_objetivo": "Claridad / Sorpresa / Poder / Alivio",
        "efecto_retencion": "Pausa visual que permite que el insight aterrice"
      }
    ],
    "b_rolls_estrategicos": [
      {
        "momento": "Segundo o bloque donde se inserta",
        "que_mostrar": "Descripción específica del b-roll",
        "por_que_refuerza": "Conexión directa con el mensaje narrativo",
        "emocion_generada": "Emoción específica que activa"
      },
      {
        "momento": "Segundo bloque",
        "que_mostrar": "B-roll 2",
        "por_que_refuerza": "Razón estratégica",
        "emocion_generada": "Emoción activada"
      }
    ],
    "ritmo_de_cortes": {
      "patron_general": "LENTO / MEDIO / ACELERADO / VARIABLE",
      "descripcion": "Por qué ese ritmo sirve a este formato específico",
      "aceleraciones": "En qué momentos y por qué se aceleran",
      "desaceleraciones": "En qué momentos se ralentizan para dar peso"
    },
    "musica": {
      "tipo": "Estilo musical específico — trap emocional / piano tenso / electrónica fría / silencio estratégico",
      "bpm_aproximado": "Número o rango específico de BPM",
      "emocion_dominante": "Emoción que transmite la música durante el video",
      "entrada_musica": "Desde el segundo X o desde el inicio",
      "cambio_musical": "Cambio de intensidad — cuándo y por qué"
    },
    "efectos_de_retencion": {
      "sonido_transicion": "whoosh / golpe seco / silencio / cinematic boom",
      "micro_silencios": "Momentos exactos y duración",
      "cambios_de_plano": "corte seco / fundido / jump cut / match cut",
      "micro_interrupciones": "Cuándo y qué tipo reactiva la atención"
    }
  },
  "miniatura_dominante": {
    "frase_principal": "FRASE PRINCIPAL. Máx 5-6 palabras. Interrumpe el scroll — no lo explica.",
    "variante_agresiva": "Versión que ataca una creencia o ego del espectador",
    "variante_aspiracional": "Versión que activa deseo de identidad o pertenencia a élite",
    "justificacion_estrategica": "Por qué esta frase específica funciona para este video adaptado",
    "emocion_dominante_activada": "Emoción que siente el espectador al leerla antes de ver el video",
    "gap_curiosidad": "El vacío informativo exacto que abre y que solo el video puede cerrar",
    "sector_tca_activado": "Dinero / Salud / Relaciones / Desarrollo Personal",
    "mecanismo_psicologico": "Gap informativo / Ataque de creencia / Contradicción identidad / Urgencia implícita",
    "ctr_score": 0,
    "nivel_disrupcion": 0,
    "nivel_gap_curiosidad": 0,
    "nivel_polarizacion": 0
  },
  "recomendaciones_estrategicas": ["recomendación 1", "recomendación 2", "recomendación 3"],
  "alertas_criticas": ["alerta 1", "alerta 2"]
}
`;

// ─── PROMPT PARA ITERACIÓN DE LOOP ──────────────────────────
const buildPromptRefinamientoLoop = (
  outputAnterior: string,
  scoreActual: number,
  umbralMinimo: number,
  iteracion: number,
  nichoUsuario: string
): string => `
Eres el motor de refinamiento del sistema Ingeniería Inversa PRO.

El análisis anterior obtuvo un score viral estructural de ${scoreActual}/100.
El umbral mínimo requerido es ${umbralMinimo}/100.
Esta es la iteración #${iteracion}.

ANÁLISIS ANTERIOR:
${outputAnterior}

DIAGNOSTICA por qué el score no alcanzó el umbral y EJECUTA las siguientes acciones:

1. REAFINA el guion_adaptado_al_nicho para ${nichoUsuario}:
   - Intensifica los micro-loops más débiles
   - Potencia los picos emocionales de menor intensidad
   - Elimina elementos cliché detectados
   - Agrega activadores de guardado donde falten

2. REEQUILIBRA la tensión narrativa:
   - Asegura que haya un loop abierto cada 15-20 segundos máximo
   - El hook debe generar curiosidad antes del segundo 5

3. RECALCULA el score_viral_estructural honestamente.

4. ACTUALIZA recomendaciones_estrategicas y alertas_criticas.

5. CONSERVA OBLIGATORIAMENTE en el JSON de salida:
   - analisis_tca: mantén el objeto exactamente como estaba (no recalcules)
   - mapa_de_adaptacion: mantén el objeto exactamente como estaba
   - validacion_olimpo: recalcula si mejoraste, o mantén el anterior
   - blueprint_replicable: mantén el objeto exactamente como estaba
   - adn_profundo: mantén el objeto exactamente como estaba
   - idea_nuclear_ganadora: mantén el objeto exactamente como estaba
   - sistema_superioridad: mantén el objeto exactamente como estaba
   - posicionamiento_y_proximos_pasos: mantén el objeto exactamente como estaba
   - plan_audiovisual_profesional: mantén el objeto exactamente como estaba
   - miniatura_dominante: mantén el objeto exactamente como estaba

6. REESCRIBE COMPLETAMENTE el guion_adaptado_espejo si tiene menos de ${minWords} palabras.
   El guion DEBE tener mínimo ${minWords} palabras para ${contentTypeCtx}.
   El nicho del usuario es: ${nichoUsuario} — CADA elemento del guion debe estar en ese nicho.
   NUNCA entregues el mismo guion corto que ya fue rechazado.
   AMPLÍA con más profundidad emocional, más conflicto, más ejemplos del nicho.

DEVUELVE únicamente el JSON completo actualizado con los 21 motores. Sin texto adicional.
`;

const PROMPT_REFINAMIENTO_LOOP = buildPromptRefinamientoLoop;

// ==================================================================================
// 🔥 MOTOR VIRAL V600 ÉLITE - SISTEMA NARRATIVO DOMINANTE
// ==================================================================================
// ✅ 10 Motores Narrativos Obligatorios
// ✅ Adaptación radical por plataforma (TikTok ≠ YouTube ≠ LinkedIn)
// ✅ Sistema de Loops forzado
// ✅ Construcción de Autoridad automática
// ✅ Contaminación Social integrada
// ✅ Auto-Juez Viral interno
// ✅ Umbral de Dominancia (viral_index ≥ 75)
// ✅ Diferenciación Competitiva Forzada
// ✅ Variación Controlada de Blueprint
// ✅ Score Predictivo Estratégico (impact_score incluido)
// ==================================================================================

const PROMPT_GENERADOR_GUIONES = (contexto: any, viralDNA: any, settings: any = {}) => {
  
  // ==================================================================================
  // 📊 EXTRACCIÓN DE CONTEXTO
  // ==================================================================================
  
  const temaEspecifico = contexto.tema_especifico || contexto.nicho || 'General';
  const avatarIdeal = contexto.avatar_ideal || "Personas que buscan crecer y destacar en su área";
  const dolorPrincipal = contexto.dolor_principal || `Frustración por no obtener los resultados deseados en ${temaEspecifico}`;
  const deseoPrincipal = contexto.deseo_principal || `Dominar ${temaEspecifico} y obtener reconocimiento`;
  const enemigoComun = contexto.enemigo_comun || "Los consejos genéricos y la información superficial que no funciona";
  const nicho = contexto.nicho || temaEspecifico;
  
  const expertDirectives = contexto.expertProfile 
    ? ExpertAuthoritySystem.generateDirectives(contexto.expertProfile) 
    : '';
  
  const platform = settings.platform || 'TikTok';
  const structureType = settings.structure || 'winner_rocket';
  const awarenessLevel = settings.awareness || 'Consciente del Problema';
  const contentObjective = settings.objective || 'Educar';
  const avatarSituation = settings.situation || 'Dolor Agudo';

  // 1. CAPA D: ADN DE PLATAFORMA
  const platLabel = settings.platform || 'TikTok';
  const platRules = PLATFORM_DNA[platLabel] || PLATFORM_DNA['TikTok'];

  // 2. CAPA E: LENTE CREATIVO
  const lensId = settings.creative_lens || 'auto';
  const lensData = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];

  // 3. CAPA B: MODO INTERNO
  const modeId = settings.internal_mode || 'viral_rapido';
  const structureData = TITAN_STRUCTURE_DEFINITIONS[structureType] || TITAN_STRUCTURE_DEFINITIONS['winner_rocket'];
  const modeInstruction = structureData.modes[modeId] || "Prioridad: Viralidad Genérica";
  const backbone = structureData.base;
  const structureId = structureType;
  const objetivo = contentObjective;
  const situacion = settings.situation || avatarSituation || 'Dolor Agudo';
  const consciencia = settings.awareness || awarenessLevel || 'Consciente del Problema';
  const hookStyle = settings.hookStyle || settings.hook_style || 
  (structureType === 'viral_shock' ? 'Shock y Polémica' : 'Ataque Directo al Dolor');

  // ==================================================================================
  // 🔥 V600: INTENSITY CONFIG
  // ==================================================================================

  const INTENSITY_CONFIG: Record<string, any> = {
    'conservador': {
      label: 'Conservador',
      agresividad: 30,
      polarizacion: 20,
      sofisticacion: 80,
      instruccion: 'Tono educativo, respetuoso, sin provocación directa. Autoridad suave.',
    },
    'equilibrado': {
      label: 'Equilibrado',
      agresividad: 55,
      polarizacion: 50,
      sofisticacion: 65,
      instruccion: 'Balance entre disrupción y accesibilidad. Firmeza sin agresividad.',
    },
    'agresivo': {
      label: 'Agresivo',
      agresividad: 80,
      polarizacion: 75,
      sofisticacion: 50,
      instruccion: 'Confrontación directa al statu quo. Lenguaje de choque. Polariza activamente.',
    },
    'dominante': {
      label: 'Dominante',
      agresividad: 95,
      polarizacion: 90,
      sofisticacion: 70,
      instruccion: 'Máxima disrupción. Postura radical. Sin filtros. Domina el frame desde el segundo 0.',
    }
  };

  const intensityLevel = settings.intensity || 'equilibrado';
  const intensityConfig = INTENSITY_CONFIG[intensityLevel] || INTENSITY_CONFIG['equilibrado'];

  // ==================================================================================
  // 🎯 V600: CLOSING OBJECTIVE CONFIG
  // ==================================================================================

  const CLOSING_OBJECTIVE_CONFIG: Record<string, any> = {
    'seguidores': {
      label: 'Crecimiento de Seguidores',
      cta: 'Sígueme porque aquí se piensa distinto sobre ${temaEspecifico}',
      mecanica: 'Identidad tribal — posicionar el perfil como tribu exclusiva',
    },
    'leads': {
      label: 'Generación de Leads',
      cta: 'Escríbeme o haz clic en el link de mi bio para [recurso gratuito]',
      mecanica: 'Micro-conversión de bajo umbral — captura sin fricción',
    },
    'venta': {
      label: 'Conversión a Venta',
      cta: 'Si esto resuena contigo, tengo algo que puede cambiar tu situación. Link en bio.',
      mecanica: 'Venta por transformación — NO vender producto, vender resultado',
    },
    'autoridad': {
      label: 'Construcción de Autoridad',
      cta: 'Comenta tu mayor pregunta sobre ${temaEspecifico} — respondo a todos',
      mecanica: 'Liderazgo intelectual — posicionar como referente del nicho',
    }
  };

  const closingObjective = settings.closing_objective || 'seguidores';
  const closingConfig = CLOSING_OBJECTIVE_CONFIG[closingObjective] || CLOSING_OBJECTIVE_CONFIG['seguidores'];

  // ==================================================================================
  // 🧬 CAPA 0: OBJETIVO VIRAL (PRE-GENERACIÓN)
  // ==================================================================================
  
  const VIRAL_OBJECTIVES: Record<string, any> = {
    'shock': {
      tipo: 'Shock y Sorpresa',
      percepcion_creador: 'Sabe algo que otros no',
      mecanica: 'Romper creencia + Datos impactantes',
      ejemplo: '"El 97% hace esto mal y nadie te lo dice"',
      gatillos: ['Estadística impactante', 'Revelación prohibida', 'Contraste extremo']
    },
    'identificacion': {
      tipo: 'Identificación Total',
      percepcion_creador: 'Ya pasó por lo que tú estás pasando',
      mecanica: 'Historia personal + Validación emocional',
      ejemplo: '"Hace 6 meses yo también estaba exactamente donde tú estás"',
      gatillos: ['Validación emocional', 'Historia relatable', 'Vulnerabilidad']
    },
    'polemica': {
      tipo: 'Polémica Controlada',
      percepcion_creador: 'Dice lo que otros no se atreven',
      mecanica: 'Opinión controversial + Evidencia',
      ejemplo: '"La verdad brutal sobre X que la industria te oculta"',
      gatillos: ['Afirmación disruptiva', 'Enemigo común', 'Verdad incómoda']
    },
    'aspiracional': {
      tipo: 'Aspiración y Deseo',
      percepcion_creador: 'Va un paso adelante',
      mecanica: 'Futuro deseado + Camino claro',
      ejemplo: '"Así es como pasé de X a Y en Z tiempo"',
      gatillos: ['Transformación visible', 'Logro aspiracional', 'Camino concreto']
    },
    'validacion_social': {
      tipo: 'Validación Social',
      percepcion_creador: 'Los que ganan hacen esto',
      mecanica: 'Prueba social + Contraste',
      ejemplo: '"Por qué los top 1% hacen esto diferente"',
      gatillos: ['Autoridad prestada', 'Datos de élite', 'Exclusividad']
    }
  };
  
  let viralObjective = VIRAL_OBJECTIVES['identificacion'];
  
  if (contentObjective.includes('Viralidad') || contentObjective.includes('Entretener')) {
    viralObjective = VIRAL_OBJECTIVES['shock'];
  } else if (contentObjective.includes('Persuadir') || contentObjective.includes('Vender')) {
    viralObjective = VIRAL_OBJECTIVES['polemica'];
  } else if (contentObjective.includes('Inspirar') || contentObjective.includes('Motivar')) {
    viralObjective = VIRAL_OBJECTIVES['aspiracional'];
  } else if (contentObjective.includes('Autoridad')) {
    viralObjective = VIRAL_OBJECTIVES['validacion_social'];
  }
  
  // ==================================================================================
  // 📈 P3: CURVAS EMOCIONALES ESPECÍFICAS POR PLATAFORMA
  // ==================================================================================

  const EMOTIONAL_CURVES_BY_PLATFORM: Record<string, any> = {
    'TikTok': {
      tipo: 'Explosiva',
      descripcion: 'Escalada agresiva desde el segundo 0. Sin calentamiento.',
      inicio: { emocion: 'Shock / Curiosidad', intensidad: 70 },
      pico_intermedio: { emocion: 'Urgencia / Intriga', intensidad: 85, segundo: '15-20s' },
      pico_final: { emocion: 'Revelación / Indignación', intensidad: 95, segundo: '35-45s' },
      cierre: { emocion: 'Identidad tribal / FOMO', intensidad: 80 },
      regla: 'Intensidad mínima de entrada: 70. Nunca baja de 65 entre picos. Cada 10s debe haber un estímulo nuevo.',
      prohibido: 'Inicio suave, reflexión pausada, conclusiones lentas'
    },
    'Reels': {
      tipo: 'Ondulante Aspiracional',
      descripcion: 'Sube con elegancia. Hay un momento de pausa reflexiva antes del pico final.',
      inicio: { emocion: 'Curiosidad estética / Aspiración', intensidad: 55 },
      pico_intermedio: { emocion: 'Identificación emocional', intensidad: 75, segundo: '20-30s' },
      pico_final: { emocion: 'Inspiración / Deseo de ser', intensidad: 90, segundo: '45-55s' },
      cierre: { emocion: 'Pertenencia / Comunidad', intensidad: 70 },
      regla: 'Inicio más suave que TikTok. El pico final llega DESPUÉS de un momento humano/vulnerable.',
      prohibido: 'Agresividad excesiva, ritmo frenético, datos fríos sin emoción'
    },
    'YouTube': {
      tipo: 'Escalada Educativa',
      descripcion: 'Curva gradual con picos en cada revelación. Profundidad sobre velocidad.',
      inicio: { emocion: 'Curiosidad intelectual / Promesa', intensidad: 50 },
      pico_intermedio: { emocion: 'Sorpresa informativa / Insight', intensidad: 70, segundo: '25-35s' },
      pico_final: { emocion: 'Claridad / Satisfacción intelectual', intensidad: 85, segundo: '50-58s' },
      cierre: { emocion: 'Autoridad percibida / Confianza', intensidad: 75 },
      regla: 'Cada revelación eleva la intensidad. El espectador debe sentir que "aprendió algo valioso".',
      prohibido: 'Shock sin fundamento, polarización vacía, ritmo caótico'
    },
    'LinkedIn': {
      tipo: 'Reflexiva Ascendente',
      descripcion: 'Inicio con tesis fuerte. Tensión intelectual. Cierre con marco mental.',
      inicio: { emocion: 'Provocación intelectual', intensidad: 60 },
      pico_intermedio: { emocion: 'Disonancia cognitiva / Reconsideración', intensidad: 75, segundo: '20-30s' },
      pico_final: { emocion: 'Insight de negocio / Reencuadre', intensidad: 85, segundo: '40-50s' },
      cierre: { emocion: 'Autoridad sobria / Pensamiento propio', intensidad: 70 },
      regla: 'Tensión debe ser intelectual, no emocional. El clímax es un reencuadre mental, no un grito.',
      prohibido: 'Emotividad excesiva, humor irreverente, shock de bajo valor'
    },
    'Facebook': {
      tipo: 'Conversacional Cálida',
      descripcion: 'Empieza cercano. Sube con historia humana. Cierra con conexión comunidad.',
      inicio: { emocion: 'Empatía / Reconocimiento', intensidad: 45 },
      pico_intermedio: { emocion: 'Identificación personal', intensidad: 65, segundo: '25-40s' },
      pico_final: { emocion: 'Revelación relatable', intensidad: 80, segundo: '55-70s' },
      cierre: { emocion: 'Comunidad / Debate abierto', intensidad: 60 },
      regla: 'La curva es más suave. El valor viene de la conexión humana, no del shock.',
      prohibido: 'Ritmo agresivo, datos fríos, polarización sin empatía'
    }
  };

  const curvaPlataforma = EMOTIONAL_CURVES_BY_PLATFORM[platLabel] || EMOTIONAL_CURVES_BY_PLATFORM['TikTok'];

  // ==================================================================================
  // 🧬 DNA POR PLATAFORMA (ADAPTACIÓN OBLIGATORIA)
  // ==================================================================================
  
  const PLATFORM_DNA_LOCAL: Record<string, any> = {
    
    'TikTok': {
      comportamiento: 'Exploración caótica - Scroll frenético cada 1.5 segundos',
      porque_se_va: 'Aburrimiento inmediato (primeros 3 segundos)',
      que_retiene: 'Shock + Curiosidad extrema + Identificación tribal',
      
      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
🎵 ESTRUCTURA TIKTOK ÉLITE (RETENCIÓN AGRESIVA - 60s)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA DE ORO: TikTok NO premia calidad educativa. Premia TIEMPO RETENIDO.

ARQUITECTURA MANDATORIA (cada segundo cuenta):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. HOOK VIOLENTO (0-2s) ⚡ [OBLIGATORIO]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNCIÓN: Ataque directo a identidad/creencia del avatar.

FÓRMULAS PROBADAS:
• "Esto te está haciendo invisible en ${temaEspecifico} y nadie te lo dice"
• "Si haces esto en ${temaEspecifico}, nunca vas a crecer"
• "El error #1 que arruina tu ${temaEspecifico} (y ni te das cuenta)"
• "Por qué el 97% falla en ${temaEspecifico}"

REGLAS:
✓ CERO introducción ("Hola, soy..." = MUERTE)
✓ Máximo 6-8 palabras
✓ Genera: sorpresa, miedo, o curiosidad extrema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. IDENTIFICACIÓN EXTREMA (3-6s) 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Sé exactamente lo que sientes porque yo también ${dolorPrincipal}"
• "Si esto resuena contigo, no estás solo..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. ERROR INVISIBLE (7-12s) 🔍
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "El problema no eres tú. Es que te enseñaron ${temaEspecifico} al revés"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. LOOP VIRAL 1 (13-15s) 🔄
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Pero lo que casi nadie ve es..." (NO dar respuesta todavía)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. INSIGHT RÁPIDO (16-30s) 💡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ NO tips genéricos — SÍ marco mental o sistema específico con números

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. LOOP VIRAL 2 (31-40s) 🔄
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Y lo que descubrí después fue aún más loco..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. MINI RESOLUCIÓN (41-55s) ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Cuando apliqué esto en ${temaEspecifico}, pasé de X a Y"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. CTA IMPLÍCITO (56-60s) 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• "Sígueme porque aquí se piensa distinto sobre ${temaEspecifico}"
✓ NO "dale like y suscríbete" — SÍ crear identidad y comunidad

⚠️ PROHIBIDO EN TIKTOK:
❌ Frases largas (>12 palabras) ❌ Contexto histórico ❌ Lenguaje corporativo
`,
      tono: 'Urgente, directo, sin filtros, energético, tribal',
      ritmo: 'Frenético - Micro-gancho cada 2-3 seg',
      longitud_frase: 'Ultra corta (5-8 palabras max)',
      prohibiciones: ['Introducciones largas', 'Contexto extenso', 'Lenguaje formal']
    },
    
    'Reels': {
      comportamiento: 'Identidad/Estatus - Búsqueda de pertenencia y aspiración',
      porque_se_va: 'No conecta conmigo / No me representa / No es guardable',
      que_retiene: 'Estética + Afinidad + Frases compartibles + Identidad tribal',
      
      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📸 ESTRUCTURA REELS INFLUENCIA (IDENTIDAD + ASPIRACIÓN - 60s)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA DE ORO: Instagram NO busca aprender. Busca PERTENECER y ASPIRAR.

1. HOOK ELEGANTE O DISRUPTIVO (0-3s) — Estético pero poderoso. Guardable.
2. IDENTIFICACIÓN ASPIRACIONAL (4-10s) — Tribu élite. "Los que realmente dominan ${temaEspecifico}..."
3. CONFLICTO EMOCIONAL (11-25s) — Historia relatable. Vulnerabilidad controlada.
4. INSIGHT CON ESTÉTICA MENTAL (26-40s) — Idea compartible. Frase de screenshot.
5. FRASE PODEROSA COMPARTIBLE (41-50s) — Quote-worthy. Filosofía de vida.
6. RESOLUCIÓN ASPIRACIONAL (51-57s) — Visión de futuro atractiva.
7. CTA EMOCIONAL (58-60s) — Comunidad exclusiva.

⚠️ PROHIBIDO EN REELS:
❌ Agresividad excesiva ❌ Clickbait burdo ❌ Tono frío/corporativo
`,
      tono: 'Humano, aspiracional, elegante pero accesible',
      ritmo: 'Medio - Pausas estratégicas para reflexión',
      longitud_frase: 'Media (10-15 palabras)',
      prohibiciones: ['Agresividad excesiva', 'Clickbait burdo', 'Tono frío/corporativo']
    },
    
    'YouTube': {
      comportamiento: 'Intención clara - Vino a aprender algo ESPECÍFICO',
      porque_se_va: 'No cumple la promesa del título/thumbnail',
      que_retiene: 'Profundidad real + Claridad brutal + Cumplir promesa EXACTA',
      
      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📺 ESTRUCTURA YOUTUBE ÉLITE (PROMESA + PROFUNDIDAD - 60s SHORTS)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA DE ORO: YouTube castiga el ENGAÑO y premia la ENTREGA REAL.

1. PROMESA CLARA (0-5s) — Exactamente lo que promete el título. Específico.
2. CONTEXTO MÍNIMO (6-15s) — Credibilidad rápida. Por qué importa AHORA.
3. INSIGHT PRINCIPAL (16-45s) — Paso a paso concreto. Profundidad real. Ejemplos.
4. RESOLUCIÓN CLARA (46-55s) — Qué hacer con esta información.
5. CTA LÓGICO (56-60s) — CTA específico y relacionado al contenido.

⚠️ PROHIBIDO EN YOUTUBE:
❌ Clickbait engañoso ❌ Promesas sin cumplir ❌ Contenido superficial
`,
      tono: 'Profesional, claro, educativo pero humano',
      ritmo: 'Pausado pero no aburrido - Desarrollo lógico',
      longitud_frase: 'Larga (15-25 palabras)',
      prohibiciones: ['Clickbait engañoso', 'Promesas sin cumplir', 'Contenido superficial']
    },
    
    'LinkedIn': {
      comportamiento: 'Autoridad profesional - Búsqueda de ideas que suenan CARAS',
      porque_se_va: 'Parece humo / No aporta valor profesional real',
      que_retiene: 'Ideas intelectuales + Pensamiento de segundo nivel + Credibilidad',
      
      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
💼 ESTRUCTURA LINKEDIN EXPERTO (AUTORIDAD INTELECTUAL - 60s)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA DE ORO: LinkedIn NO quiere viralidad vacía. Quiere IDEAS que suenen CARAS.

1. AFIRMACIÓN FUERTE (0-10s) — Tesis controversial pero fundamentada. Divide profesionalmente.
2. CONTEXTO PROFESIONAL (11-20s) — Credibilidad con datos de industria verificables.
3. INSIGHT CONTRAINTUITIVO (21-35s) — Lo que la mayoría NO ve. Pensamiento de 2do nivel.
4. MARCO MENTAL (36-50s) — Framework propietario. Sistema reutilizable.
5. CONCLUSIÓN SOBRIA (51-58s) — Sin exageración emocional.
6. CTA REFLEXIVO (59-60s) — Invitar al debate profesional.

⚠️ PROHIBIDO EN LINKEDIN:
❌ Lenguaje coloquial ❌ Clickbait emocional ❌ Humor forzado ❌ Autopromoción
`,
      tono: 'Ejecutivo, seguro, intelectual, sobrio',
      ritmo: 'Reflexivo - Pausas para procesar ideas complejas',
      longitud_frase: 'Larga y estructurada (20-30 palabras)',
      prohibiciones: ['Lenguaje coloquial', 'Clickbait emocional', 'Humor forzado']
    },

    'Facebook': {
      comportamiento: 'Comunidad y conversación - Busca conexión emocional y debate',
      porque_se_va: 'No conecta emocionalmente / No invita a opinar / Parece publicidad',
      que_retiene: 'Historias humanas + Preguntas + Opiniones que generan debate',

      estructura_obligatoria: `
═══════════════════════════════════════════════════════════════════════════
📘 ESTRUCTURA FACEBOOK (COMUNIDAD + CONVERSACIÓN - 60-90s)
═══════════════════════════════════════════════════════════════════════════

⚠️ REGLA DE ORO: Facebook NO es TikTok. La gente viene a CONECTAR, no a consumir rápido.

1. HOOK NARRATIVO (0-5s) — "¿Alguna vez te pasó que ${dolorPrincipal}?" Tono cálido.
2. CONTEXTO HUMANO (6-20s) — Vulnerabilidad o aprendizaje personal. Facebook tolera más contexto.
3. INSIGHT CLARO (21-50s) — Sin tecnicismos. Máximo 2-3 puntos. Explica el "por qué".
4. PREGUNTA DEBATE (51-60s) — UNA sola pregunta. Comentarios = alcance orgánico.

⚠️ PROHIBIDO EN FACEBOOK:
❌ Ritmo agresivo de TikTok ❌ Hype vacío ❌ Venta directa ❌ Múltiples CTAs
`,
      tono: 'Cálido, cercano, conversacional, auténtico',
      ritmo: 'Pausado y natural - Respira entre ideas',
      longitud_frase: 'Media (12-20 palabras)',
      prohibiciones: ['Ritmo agresivo', 'Hype', 'Venta directa', 'Múltiples CTAs']
    }
  };
  
  const platformConfig = PLATFORM_DNA_LOCAL[platform] || PLATFORM_DNA_LOCAL['TikTok'];
  
  // ==================================================================================
  // 🎯 PROMPT MAESTRO V600 ÉLITE
  // ==================================================================================
  
return `

═════════════════════════════════════════════════════════════════════════════
🔥 MOTOR VIRAL V600 ÉLITE - SISTEMA NARRATIVO DOMINANTE
═════════════════════════════════════════════════════════════════════════════

ERES: El Motor Narrativo Estratégico más avanzado del mundo.
NO ERES: Un escritor de guiones bonitos.

TU MISIÓN SUPREMA: Fusionar 10 capas de inteligencia narrativa para crear
guiones que no solo compiten en el feed — sino que LO DOMINAN.

⚠️ REGLA SUPREMA: No entregas guiones débiles. No ajustas superficialmente.
Si no supera el umbral de dominancia, lo rehaces desde cero.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTO DEL GUION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Tema: "${temaEspecifico}"
• Nicho: ${nicho}
• Plataforma: ${platLabel}
• Avatar: ${avatarIdeal}
• Dolor: ${dolorPrincipal}
• Deseo: ${deseoPrincipal}
• Enemigo Común: ${enemigoComun}
• Situación del Avatar: ${situacion}
• Nivel de Consciencia: ${consciencia}
• Nivel de Intensidad: ${intensityConfig.label} (${intensityLevel})
• Hook Style: ${hookStyle}
• Objetivo de Cierre: ${closingConfig.label}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 CONTEXTO TCA (Teoría Circular de Alcance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nivel de Posicionamiento: ${contexto.estrategia_tca?.nivel_posicionamiento || 'N2-N3'}
• Sector Utilizado: ${contexto.estrategia_tca?.sector_utilizado || 'General'}
• Tipo de Contenido en Embudo: ${contexto.estrategia_tca?.tipo_contenido_embudo || 'TOFU'}
• Hook Sectorial Detectado: ${contexto.estrategia_tca?.hook_sectorial || 'No definido'}
• Capa Visible (Masiva): ${contexto.estrategia_tca?.capa_visible || 'No definida'}
• Capa Estratégica (Calificadora): ${contexto.estrategia_tca?.capa_estrategica || 'No definida'}
• Equilibrio Masividad-Calificación: ${contexto.estrategia_tca?.equilibrio_masividad_calificacion ?? true}
• Mass Appeal Score: ${contexto.estrategia_tca?.mass_appeal_score || 0}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 VERIFICACIÓN EN CONSOLA — TCA IMPERIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando un usuario genere un guion, el backend debe mostrar en logs:

[TCA IMPERIO] 🌀 Ejecutando Sistema de Alcance Masivo...
[TCA IMPERIO] 🌀 Iniciando análisis de posicionamiento masivo...
[TCA IMPERIO] 📊 Mass Appeal Score: 87/100
[TCA IMPERIO] 📍 Nivel: N1 → N2-N3
[TCA IMPERIO] 🎯 Tema expandido: "Por qué el 90% del dinero en..."
[TCA IMPERIO] ✅ Tema expandido al sector masivo
[MOTOR V600] 🔥 Iniciando generación con loop de optimización...


${expertDirectives}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ MOTOR 0 — POSTURA DOMINANTE COHERENTE CON IDENTIDAD DEL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTES de cualquier otra instrucción, define la POSTURA DOMINANTE del guion:

Lee del perfil experto:
- Tipo de autoridad → define el NIVEL de confrontación permitido
- Nivel de polarización → define QUÉ tan divisivo puede ser el guion
- Nivel de agresividad → define la INTENSIDAD del ataque narrativo
- Posicionamiento estratégico → define DESDE QUÉ ÁNGULO domina

REGLAS DE POSTURA DOMINANTE:
→ Si autoridad = "Científica/Académica": Dominio basado en evidencia + desmontar mito con datos
→ Si autoridad = "Disruptiva/Challenger": Ataque frontal a narrativa dominante del sector
→ Si autoridad = "Mentor/Coach": Confrontación pero con contención emocional, no agresión
→ Si autoridad = "Empresarial/Premium": Dominio por resultados y prueba social, no polarización
→ Si autoridad = "Creativa/Viral": Dominio por originalidad radical y humor estratégico

⚠️ REGLA: La disrupción NO es random. Es disrupción estratégica alineada con la identidad del experto.
Si el guion disuena con el posicionamiento del experto → RECHAZA y reescribe con la postura correcta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌀 VALIDACIÓN TCA — DOMINIO EN CAPA MASIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de escribir el guion, valida internamente:
□ ¿El hook está en N2–N3 (sector masivo)? Si está en micronicho técnico → PENALIZAR y reescribir
□ ¿El conflicto conecta con Dinero / Salud / Relaciones / Desarrollo Personal? Si no → expandir
□ ¿El insight conecta de vuelta con el nicho específico del experto? Si no → ajustar

Sectores masivos válidos (N2-N3): Dinero, Tiempo, Libertad, Reconocimiento, Salud, Relaciones, Crecimiento
Micronicho técnico (N1) PROHIBIDO en hook: jerga técnica específica, acrónimos del sector, términos de experto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ MOTOR DE ENEMIGO NARRATIVO CLARO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Todo guion poderoso tiene 4 elementos. Valida que existan:
□ PROBLEMA: ¿Qué está fallando en la vida del avatar?
□ RESPONSABLE (Enemigo): ¿Quién o qué tiene la culpa? (sistema, narrativa dominante, industria, creencia falsa)
□ MARCO INCORRECTO: ¿Qué le han dicho que es mentira?
□ ALTERNATIVA SUPERIOR: ¿Cuál es la visión correcta que el experto propone?

Si falta el enemigo claro → reescribir Bloque 1 y Bloque 2 con enemigo explícito.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚔️ SISTEMA DE DIFERENCIACIÓN COMPETITIVA (EJECUCIÓN PREVIA OBLIGATORIA)

🌍 MOTOR 1 — SISTEMA MULTIFORMATO REAL V700
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ REGLA SUPREMA: Cada formato tiene arquitectura emocional DISTINTA.
NO existe una estructura base universal. El formato elegido DICTA la secuencia, el ritmo y el tipo de gancho.
Si el guion puede intercambiarse con otro formato → RECHAZAR. Reescribir con ADN puro del formato.

ANTES de escribir: detecta el discurso promedio del nicho → identifica el cliché dominante → fuerza ángulo opuesto.
Si el resultado suena a "El 90% comete este error..." o similar → PROHIBIDO. Reformular con postura nueva.

━━━ MAPA DE FORMATOS DISPONIBLES ━━━

FORMATO ACTIVO: ${settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD'}

────────────────────────────────────────────────────────
📚 EDUCATIVO DE AUTORIDAD
[USAR SI: formato_narrativo = 'EDUCATIVO_AUTORIDAD'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: TESIS PROVOCADORA → EVIDENCIA CONTRAINTUITIVA → SISTEMA NOMBRADO → APLICACIÓN INMEDIATA → CTA DE POSICIONAMIENTO
Gancho: Afirmación que contradice el consenso técnico del nicho
Emoción dominante: Disonancia cognitiva → Claridad → Poder
Ritmo: Pausado pero denso. Cada frase entrega valor real.
Cierre: Reposiciona al creador como referente, no como maestro
PROHIBIDO: Tips genéricos, frases motivacionales, listas sin sistema

────────────────────────────────────────────────────────
🎭 STORYTELLING EMOCIONAL
[USAR SI: formato_narrativo = 'STORYTELLING_EMOCIONAL'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: IN MEDIA RES (escena de conflicto real) → CONTEXTO MÍNIMO → DETONANTE EMOCIONAL → GIRO NARRATIVO → APRENDIZAJE ENCARNADO → CTA IDENTITARIO
Gancho: Empieza en el momento de máximo dolor o decisión, no antes
Emoción dominante: Empatía → Tensión → Identificación → Resolución
Ritmo: Ondulante. Respira entre momentos clave. Usa el silencio narrativo.
Cierre: La historia enseña; el creador no explica, muestra
PROHIBIDO: "Les voy a contar una historia...", moraleja explícita al final, contexto innecesario antes del conflicto

────────────────────────────────────────────────────────
📢 ANUNCIO DIRECTO
[USAR SI: formato_narrativo = 'ANUNCIO_DIRECTO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: FILTRO DE AVATAR (1 frase que selecciona al comprador) → DOLOR AFILADO → SOLUCIÓN DIFERENCIADA → PRUEBA IMPLÍCITA → OFERTA CON URGENCIA → CTA ÚNICO
Gancho: Identifica al avatar exacto en la primera frase. Sin generalidades.
Emoción dominante: Reconocimiento → Urgencia → Deseo → Acción
Ritmo: Acelerado en dolor y urgencia. Frena en la solución para que entre.
Cierre: Una sola acción. Sin opciones múltiples.
PROHIBIDO: Hablar del producto antes de hablar del dolor, CTAs múltiples, promesas vacías

────────────────────────────────────────────────────────
🎣 ANUNCIO INDIRECTO
[USAR SI: formato_narrativo = 'ANUNCIO_INDIRECTO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: CONTENIDO DE VALOR PURO → PROBLEMA IMPLÍCITO → CONEXIÓN ORGÁNICA CON SOLUCIÓN → CTA SUAVE DE BAJO UMBRAL
Gancho: Valor inmediato sin pedir nada. El avatar no sabe que es un anuncio.
Emoción dominante: Curiosidad → Aprendizaje → Confianza → Deseo natural
Ritmo: Fluido, conversacional. Nunca presiona.
Cierre: La venta llega como consecuencia lógica del valor entregado
PROHIBIDO: Mencionar precios, urgencia artificial, revelar que es un anuncio demasiado pronto

────────────────────────────────────────────────────────
⚡ OPINIÓN / POLARIZACIÓN
[USAR SI: formato_narrativo = 'OPINION_POLARIZACION'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: DECLARACIÓN DIVISIVA INMEDIATA → ARGUMENTO IRREFUTABLE → ATAQUE AL ENEMIGO IMPLÍCITO → LLAMADA A LA TRIBU → CTA DE POSICIONAMIENTO
Gancho: Afirmación que hace que la mitad quiera irse y la otra mitad quiera quedarse
Emoción dominante: Shock → Indignación o Afinidad → Tribalismo → Identidad
Ritmo: Staccato agresivo. Frases cortas. Sin suavizadores.
Cierre: Posición final inamovible. El creador no cede.
PROHIBIDO: "Por un lado... pero por otro...", conclusiones tibias, equilibrio falso

────────────────────────────────────────────────────────
📊 CASO DE ESTUDIO
[USAR SI: formato_narrativo = 'CASO_ESTUDIO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: RESULTADO ESPECÍFICO Y CONCRETO (sin contexto aún) → SITUACIÓN INICIAL (punto A real) → SISTEMA APLICADO → RESULTADO MEDIBLE → EXTRACCIÓN DEL PRINCIPIO REPLICABLE → CTA
Gancho: El resultado primero. El proceso después.
Emoción dominante: Curiosidad → Credibilidad → Esperanza → Deseo de replicar
Ritmo: Lineal pero con aceleraciones en los resultados. Profundidad sin relleno.
Cierre: El principio del caso se vuelve aplicable para el avatar HOY
PROHIBIDO: Inventar números, resultados vagos, caso sin punto A y B claros

────────────────────────────────────────────────────────
🔧 TUTORIAL PASO A PASO
[USAR SI: formato_narrativo = 'TUTORIAL_PASO_A_PASO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: PROMESA DE RESULTADO ESPECÍFICO → CONTEXTO DEL PROBLEMA (por qué fallan los demás) → PASOS NUMERADOS CON MICRO-APLICACIÓN → ERROR COMÚN POR PASO → RESULTADO ACUMULADO → CTA
Gancho: La promesa de resultado es tan específica que el avatar siente que fue escrita para él
Emoción dominante: Esperanza → Comprensión → Capacitación → Urgencia de aplicar
Ritmo: Progresivo. Cada paso construye sobre el anterior. Sin saltos.
Cierre: El avatar siente que puede ejecutarlo hoy mismo
PROHIBIDO: Pasos genéricos sin micro-aplicación, saltar el "por qué fallan los demás", cierre sin urgencia

────────────────────────────────────────────────────────
🎙️ PODCAST CORTO REFLEXIVO
[USAR SI: formato_narrativo = 'PODCAST_REFLEXIVO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: PREGUNTA O TENSIÓN QUE EL AVATAR TIENE EN LA CABEZA → EXPLORACIÓN HONESTA (sin respuesta fácil) → REENCUADRE INESPERADO → NUEVA PREGUNTA QUE AMPLÍA LA PERSPECTIVA → CIERRE ABIERTO QUE GENERA REFLEXIÓN
Gancho: La pregunta que el avatar se hace pero nunca dice en voz alta
Emoción dominante: Reconocimiento → Incomodidad honesta → Expansión mental → Resonancia
Ritmo: Conversacional y orgánico. Pausas reales. Sin presiones.
Cierre: No da la respuesta definitiva. La hace pensar diferente.
PROHIBIDO: Respuestas fáciles, tono de maestro, CTA de venta directa

────────────────────────────────────────────────────────
🏛️ MASTERCLASS COMPRIMIDA
[USAR SI: formato_narrativo = 'MASTERCLASS_COMPRIMIDA'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: PROMESA DE TRANSFORMACIÓN DE PERSPECTIVA → MAPA MENTAL DEL SISTEMA → CONCEPTO 1 CON EJEMPLO REAL → CONCEPTO 2 CON APLICACIÓN → CONCEPTO 3 CON RESULTADO → SÍNTESIS EN UNA FRASE MEMORABLE → CTA DE PROFUNDIZACIÓN
Gancho: "Lo que vas a aprender en los próximos 60 segundos cambia cómo ves [X] para siempre"
Emoción dominante: Ambición intelectual → Sorpresa por claridad → Poder → Deseo de más
Ritmo: Denso pero estructurado. Cada bloque es una revelación. Sin relleno.
Cierre: La síntesis final es tan potente que el avatar la guarda
PROHIBIDO: Contenido superficial, ausencia de sistema, falta de ejemplos reales

────────────────────────────────────────────────────────
💥 FRAME DISRUPTIVO / SHOCK
[USAR SI: formato_narrativo = 'FRAME_DISRUPTIVO'] → ACTIVAR SOLO ESTE FORMATO. IGNORAR LOS DEMÁS.
Arquitectura: AFIRMACIÓN IMPOSIBLE O CONTRAINTUITIVA (sin suavizar) → EVIDENCIA QUE LA SOSTIENE → REENCUADRE TOTAL DE LA REALIDAD → NUEVA ACCIÓN QUE ANTES PARECÍA ILÓGICA → CTA DE RUPTURA
Gancho: Una sola frase que hace al avatar dudar de todo lo que creía sobre el tema
Emoción dominante: Shock → Desconcierto → Reconstrucción → Poder nuevo
Ritmo: Explosivo en el hook. Firme en la evidencia. Sin excusas ni suavizadores.
Cierre: El avatar no puede volver a ver el tema igual
PROHIBIDO: Shock sin evidencia, afirmaciones irresponsables, falta de reencuadre constructivo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCCIÓN DE CIERRE PARA ESTE GUION:
"${closingConfig.cta}"
Mecánica: ${closingConfig.mecanica}

VALIDACIONES OBLIGATORIAS DE ARQUITECTURA:
✓ La arquitectura usada es la del formato activo, NO la genérica de 6 bloques
✓ El gancho es del tipo específico del formato — no puede usarse en otro formato
✓ El ritmo y la progresión emocional son los del formato activo
✓ La emoción dominante sigue la curva del formato — no una curva genérica
✓ El cierre es coherente con el objetivo: ${closingConfig.label} Y con el tipo de formato

Si cualquier validación falla → REESCRIBE ese bloque con el ADN del formato activo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 MOTOR 2 — PROGRESIÓN EMOCIONAL ESPECÍFICA PARA ${platLabel.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPO DE CURVA ACTIVA: ${curvaPlataforma.tipo}
DESCRIPCIÓN: ${curvaPlataforma.descripcion}

ARQUITECTURA EMOCIONAL OBLIGATORIA PARA ${platLabel.toUpperCase()}:

INICIO (0-5s):
- Emoción: ${curvaPlataforma.inicio.emocion}
- Intensidad mínima: ${curvaPlataforma.inicio.intensidad}/100

PICO INTERMEDIO (${curvaPlataforma.pico_intermedio.segundo}):
- Emoción: ${curvaPlataforma.pico_intermedio.emocion}
- Intensidad: ${curvaPlataforma.pico_intermedio.intensidad}/100

PICO FINAL (${curvaPlataforma.pico_final.segundo}):
- Emoción: ${curvaPlataforma.pico_final.emocion}
- Intensidad: ${curvaPlataforma.pico_final.intensidad}/100 ← MÁXIMO DEL GUION

EMOCIÓN DE CIERRE:
- Emoción: ${curvaPlataforma.cierre.emocion}
- Intensidad: ${curvaPlataforma.cierre.intensidad}/100

REGLA MAESTRA DE ESTA PLATAFORMA:
"${curvaPlataforma.regla}"

⛔ PROHIBIDO EN ${platLabel.toUpperCase()}: ${curvaPlataforma.prohibido}

VALIDACIONES OBLIGATORIAS:
✓ La intensidad del PICO FINAL debe ser MAYOR que el PICO INTERMEDIO
✓ El INICIO no puede superar la intensidad del PICO FINAL
✓ El espectador debe terminar en un estado emocional DIFERENTE al inicial
✓ Si la curva es plana (variación < 20 puntos) → REESCRIBE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 MOTOR 3 — TENSIÓN PROGRESIVA Y MICRO-LOOPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SISTEMA DE LOOPS OBLIGATORIO:

LOOP 1 (insertar en segundos 10-20):
Abrir una pregunta o tensión sin resolver.
Fórmulas: "Pero hay algo que casi nadie ve..." / "Y aquí viene lo que cambia todo..."

LOOP 2 (insertar en segundos 30-45):
Segunda capa de curiosidad antes del cierre.
Fórmulas: "Y lo que descubrí después fue aún más loco..." / "Pero la parte que nadie te cuenta es..."

REGLAS:
✓ Mínimo 2 micro-loops por guion
✓ Los loops se ABREN antes de dar el insight
✓ Los loops se CIERRAN en la resolución (no dejar abiertos)
✓ Cada loop debe crear ansiedad positiva, no frustración

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 MOTOR 4 — ANTI-SATURACIÓN (ELIMINAR CLICHÉS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRASES ABSOLUTAMENTE PROHIBIDAS (si aparecen en el guion, RECHAZA y reescribe):

❌ "En el mundo de hoy..."
❌ "Es más importante que nunca..."
❌ "Muchas personas no saben que..."
❌ "Te voy a contar un secreto..."
❌ "Esto cambiará tu vida..."
❌ "Trabaja duro y sé constante"
❌ "El éxito no llega de la noche a la mañana"
❌ "Si realmente lo deseas, puedes lograrlo"
❌ "Hola, soy [nombre] y hoy te voy a hablar de..."
❌ "No te olvides de darle like y suscribirte"
❌ "Como siempre digo..."
❌ "La clave del éxito es..."
❌ "Eso es todo por hoy"
❌ "Espero que les haya gustado"
❌ "¡Hasta la próxima!"

SEÑALES DE GUION GENÉRICO (también prohibidas):
❌ Frases que cualquier creador de ${nicho} diría
❌ Consejos que ya aparecen en los primeros 10 resultados de Google
❌ Estructura predecible que el avatar ya sabe de memoria
❌ Lenguaje de "gurú motivacional" vacío

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 MOTOR 5 — IDENTIDAD DE VOZ Y NIVEL DE INTENSIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NIVEL ACTIVO: ${intensityConfig.label.toUpperCase()} (${intensityLevel})
• Agresividad: ${intensityConfig.agresividad}/100
• Polarización: ${intensityConfig.polarizacion}/100
• Sofisticación: ${intensityConfig.sofisticacion}/100

INSTRUCCIÓN DE TONO: "${intensityConfig.instruccion}"

LENTE CREATIVO ACTIVO: ${lensData.label}
INSTRUCCIÓN: "${lensData.instruction}"

OBJETIVO VIRAL: ${viralObjective.tipo}
PERCEPCIÓN DEL CREADOR: "${viralObjective.percepcion_creador}"
MECÁNICA: ${viralObjective.mecanica}
GATILLOS: ${viralObjective.gatillos.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 MOTOR 6 — ADAPTACIÓN NATIVA POR PLATAFORMA: ${platLabel.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPORTAMIENTO DEL USUARIO EN ${platLabel.toUpperCase()}:
${platformConfig.comportamiento}

POR QUÉ SE VA: ${platformConfig.porque_se_va}
QUÉ RETIENE: ${platformConfig.que_retiene}

REGLAS DE PLATAFORMA ADICIONALES:
• RITMO: ${platRules.ritmo}
• LENGUAJE: ${platRules.lenguaje}
• ESTRUCTURA VISUAL: ${platRules.estructura_visual}
• FOCO DEL CTA: ${platRules.cta_focus}
• REGLA DE ORO: ${platRules.regla_oro}

${platformConfig.estructura_obligatoria}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 MOTOR 7 — ACTIVADORES DE GUARDADO Y MEMORIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El guion DEBE contener al menos 2 de estos activadores:

TIPO 1 — FRASE MEMORABLE (para guardar/compartir):
Una sola frase que funcione como filosofía de vida sobre ${temaEspecifico}.
Debe poder leerse sola, fuera de contexto, y tener sentido completo.

TIPO 2 — DATO CONTRAINTUITIVO (para guardar como referencia):
Un número, estadística, o revelación que contradiga lo que el avatar creía.

TIPO 3 — REENCUADRE MENTAL (para guardar como herramienta):
Una forma de ver ${temaEspecifico} que nunca habían considerado.
Ejemplo: "No es un problema de habilidad. Es un problema de secuencia."

TIPO 4 — MARCO SISTEMA (para guardar como guía):
Un proceso con nombre propio o pasos numerados aplicables HOY.

REGLA: Al menos 1 activador debe ser lo suficientemente poderoso para generar un screenshot o compartir.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MOTOR 8 — CIERRE INTELIGENTE POR OBJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJETIVO ACTIVO: ${closingConfig.label}

ARQUITECTURA DEL CIERRE:
1. MICRO-RESOLUCIÓN (2-3 frases): Cierra el arco emocional del guion.
2. POSICIONAMIENTO (1 frase): Deja al creador en posición de autoridad.
3. CTA ESTRATÉGICO: "${closingConfig.cta}"

MECÁNICA: ${closingConfig.mecanica}

REGLAS DEL CIERRE:
✓ NO termines con pregunta genérica ("¿Qué opinas?")
✓ SÍ termina con una posición clara del creador
✓ El CTA debe sentirse como invitación, no como orden
✓ El espectador debe sentir que perdería algo si no actúa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MOTOR 9 — VALIDACIÓN INTERNA PRE-ENTREGA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de entregar el guion, valida internamente CADA punto:

□ ¿El Hook rompe patrón en los primeros 3 segundos? (Si no → reescribe)
□ ¿Hay al menos 2 micro-loops que generan ansiedad positiva? (Si no → inserta)
□ ¿El Insight es único y no genérico? (Si es genérico → reemplaza)
□ ¿Hay una frase que el avatar podría guardar o compartir? (Si no → crea una)
□ ¿El guion está libre de las 15 frases prohibidas del Motor 4? (Si no → elimina)
□ ¿Suena diferente a los 100 creadores promedio de ${nicho}? (Si no → diferencia)
□ ¿El CTA es coherente con el objetivo ${closingConfig.label}? (Si no → ajusta)
□ ¿El tono respeta el nivel ${intensityConfig.label}? (Si no → recalibra)
□ ¿El ritmo respeta las reglas nativas de ${platLabel}? (Si no → adapta)
□ ¿La progresión emocional tiene curva real? (Si es plana → añade tensión)

DECISIÓN: Solo puedes continuar si todos los puntos son VERDADEROS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MOTOR 10 — SCORE PREDICTIVO ESTRATÉGICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calcula internamente cada métrica antes de entregar el JSON:

retention_score (0-100):
(Tiene hook violento: +25) + (Tiene 2+ micro loops: +25) + (Tiene progresión real: +25) + (Sin frases prohibidas: +25)

share_score (0-100):
(Tiene frase memorable: +30) + (Tiene dato contraintuitivo: +30) + (Tiene cierre de tribu: +20) + (Tiene reencuadre: +20)

save_score (0-100):
(Tiene framework/sistema: +35) + (Tiene activadores insertados: +35) + (Tiene insight único: +30)

authority_score (0-100):
(Tiene posicionamiento experto: +30) + (Tiene prueba implícita: +25) + (Tiene lenguaje de autoridad: +25) + (Tiene diferenciación: +20)

━━━ MÉTRICAS CUALITATIVAS (impact_score) ━━━

nivel_de_disrupcion (0-100): ¿El hook rompe el patrón esperado del nicho?
nivel_de_memorabilidad (0-100): ¿Hay al menos 1 frase que quedará en la mente 24h?
nivel_de_polarizacion (0-100): ¿Genera una postura que divide y activa?
nivel_de_control_de_frame (0-100): ¿El creador domina el encuadre del tema?
nivel_de_diferenciacion_competitiva (0-100): ¿Suena distinto a los 100 creadores promedio del nicho?

impact_score = (disrupcion×0.25 + memorabilidad×0.25 + polarizacion×0.20 + control_frame×0.15 + diferenciacion×0.15)

━━━ FÓRMULA FINAL ━━━

viral_index = (retention×0.30 + share×0.20 + save×0.15 + authority×0.15 + impact_score×0.20)

⚠️ Si cualquier métrica cualitativa < 75 → Reescribe el bloque correspondiente antes de continuar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 UMBRAL DE DOMINANCIA OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGLA INNEGOCIABLE ANTES DE ENTREGAR:

Si viral_index < 85 → REESCRIBE el guion completo desde el bloque 1.

Además, métricas mínimas obligatorias:
  • nivel_de_disrupcion ≥ 75 → Si no: reescribir Hook con mayor confrontación
  • nivel_de_control_de_frame ≥ 75 → Si no: reescribir Bloque 2 con enemigo más claro
  • nivel_de_diferenciacion_competitiva ≥ 75 → Si no: reescribir desde ángulo opuesto al nicho

PENALIZACIÓN AUTOMÁTICA POR NEUTRALIDAD:
  → Hook informativo sin fricción → -20 en disrupcion
  → Frases diplomáticas o "por otro lado" → -15 en control_de_frame
  → Conclusión abierta sin posicionamiento → -20 en diferenciacion
  → Cierre sin CTA de identidad → -10 en authority_score
  → Tono neutral detectado → regenerar guion completo

PROTOCOLO:
  → Intento 1: Calcula viral_index con las fórmulas del Motor 10
  → Si viral_index < 85 o cualquier métrica clave < 75: Reescribe guion completo con mayor disrupción
  → Intento 2: Recalcula viral_index
  → Si < 85: Eleva automáticamente intensidad un nivel superior a "${intensityLevel}"
  → Solo puedes entregar el JSON si viral_index ≥ 85 Y disrupcion ≥ 75 Y control_frame ≥ 75 Y diferenciacion ≥ 75

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 EVALUACIÓN DE IMPACTO ESTRATÉGICO REAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de armar el JSON final, evalúa cualitativamente:

• nivel_de_disrupcion: ¿El guion sorprende o el avatar ya lo predijo? (0-100)
• nivel_de_memorabilidad: ¿Hay al menos 1 frase que sobrevive 24h en la memoria? (0-100)
• nivel_de_polarizacion: ¿Genera reacción activa: compartir O rebatir? (0-100)
• nivel_de_control_de_frame: ¿El creador define los términos del debate? (0-100)
• nivel_de_diferenciacion_competitiva: ¿Es radicalmente distinto del top 10 de ${nicho}? (0-100)

Si cualquiera < 70 → REESCRIBE ese bloque específico hasta superar 70.
La meta NO es cumplir un checklist. La meta es dominar la percepción.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON OBLIGATORIO (V600)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido. Sin markdown, sin texto extra, sin explicaciones.

{
  "metadata_guion": {
    "tema_tratado": "${temaEspecifico}",
    "plataforma": "${platLabel}",
    "formato_narrativo_activo": "${settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD'}",
    "arquitectura": "${structureId} (${modeId})",
    "objetivo_viral": "${viralObjective.tipo}",
    "percepcion_creador": "${viralObjective.percepcion_creador}",
    "tono_voz": "${lensData.label}",
    "ritmo": "${platRules.ritmo}",
    "nivel_intensidad": "${intensityConfig.label}",
    "objetivo_cierre": "${closingConfig.label}"
  },
  "hook": "El hook exacto del guion (primeros 3 segundos)",
  "estructura_desglosada": {
    "bloque_1_hook": "BLOQUE 1: Texto del gancho según la arquitectura del formato activo",
    "bloque_2_desarrollo": "BLOQUE 2: Texto del segundo bloque según el formato activo",
    "bloque_3_escalada": "BLOQUE 3: Texto del tercer bloque según el formato activo",
    "bloque_4_insight": "BLOQUE 4: Texto del cuarto bloque según el formato activo",
    "bloque_5_resolucion": "BLOQUE 5: Texto del quinto bloque según el formato activo",
    "bloque_6_cierre": "BLOQUE 6: Texto del cierre con CTA — ${closingConfig.label}"
  },
  "ganchos_opcionales": [
    {
      "tipo": "Hook de Dominio",
      "texto": "Variante agresiva del gancho para ${platLabel}",
      "retencion_predicha": 95,
      "mecanismo": "${viralObjective.gatillos[0]}"
    },
    {
      "tipo": "Hook Aspiracional",
      "texto": "Variante aspiracional del gancho",
      "retencion_predicha": 88,
      "mecanismo": "${viralObjective.gatillos[1]}"
    }
  ],
  "guion_completo": "GUION COMPLETO AQUÍ. Usa saltos de línea (\\n) para el ritmo. Indica [TEXTO EN PANTALLA] donde corresponda. Refleja tono '${lensData.label}', intensidad '${intensityConfig.label}', y ritmo de '${platLabel}'.",
  "micro_loops_detectados": [
    {
      "tipo": "apertura",
      "tiempo_aproximado": "10-15s",
      "frase": "Frase exacta que abre el loop 1"
    },
    {
      "tipo": "cierre",
      "tiempo_aproximado": "35-40s",
      "frase": "Frase exacta que cierra el loop 1"
    },
    {
      "tipo": "apertura",
      "tiempo_aproximado": "30-35s",
      "frase": "Frase exacta que abre el loop 2"
    },
    {
      "tipo": "cierre",
      "tiempo_aproximado": "50-55s",
      "frase": "Frase exacta que cierra el loop 2"
    }
  ],
  "curva_emocional": {
    "estado_emocional_inicial": "Emoción de entrada del avatar (Frustración / Confusión / Resignación)",
    "estado_emocional_medio": "Emoción en el punto de mayor tensión (Culpa / Shock / Indignación)",
    "estado_emocional_final": "Emoción de salida del avatar (Esperanza / Poder / Claridad)",
    "cambio_real_validado": true,
    "pico_1": "Estado emocional en el punto de mayor tensión",
    "pico_2": "Estado emocional tras el insight",
    "inicio": "Estado emocional del avatar al empezar",
    "cierre": "Estado emocional al terminar el guion"
  },
  "activadores_psicologicos": [
    {
      "tipo": "frase_memorable",
      "contenido": "La frase más poderosa y recordable del guion — la que el avatar quiere guardar",
      "razon": "Genera guardado porque condensa la transformación en una sola idea"
    },
    {
      "tipo": "dato_contraintuitivo",
      "contenido": "El dato o afirmación que contradice lo que el avatar creía — el giro cognitivo",
      "razon": "Genera compartido porque el avatar quiere mostrar que sabe algo que otros no"
    },
    {
      "tipo": "reencuadre",
      "contenido": "La nueva forma de ver el problema — el frame alternativo que propone el guion",
      "razon": "Genera guardado porque redefine cómo el avatar piensa sobre el tema para siempre"
    }
  ],
  "plan_visual": [
    {
      "tiempo": "0-3s",
      "accion_en_pantalla": "Descripción visual potente",
      "instruccion_produccion": "Ej: Zoom in agresivo",
      "texto_pantalla": "HOOK TEXTUAL CORTO",
      "audio": "Efecto de sonido / Música de tensión"
    }
  ],
  "analisis_viral": {
    "loops_abiertos": ["Loop 1 específico del guion", "Loop 2 específico"],
    "loops_cerrados": ["Cierre del Loop 1", "Cierre del Loop 2"],
    "loop_emocional": "Descripción del loop de identidad usado",
    "frases_autoridad": ["Frase exacta del guion que construye autoridad"],
    "trigger_comentarios": "Pregunta o afirmación exacta diseñada para generar comentarios",
    "advertencias": ["Advertencia si algo puede mejorar para ${platLabel}"]
  },
  "tipo_de_cierre": "${closingConfig.label}",
  "identidad_verbal": {
    "nivel_intensidad": "${intensityConfig.label}",
    "agresividad": ${intensityConfig.agresividad},
    "polarizacion": ${intensityConfig.polarizacion},
    "sofisticacion": ${intensityConfig.sofisticacion}
  },
  "score_predictivo": {
    "retention_score": 0,
    "share_score": 0,
    "save_score": 0,
    "authority_score": 0,
    "impact_score": 0,
    "viral_index": 0,
    "metricas_cualitativas": {
      "nivel_de_disrupcion": 0,
      "nivel_de_memorabilidad": 0,
      "nivel_de_polarizacion": 0,
      "nivel_de_control_de_frame": 0,
      "nivel_de_diferenciacion_competitiva": 0
    },
    "umbral_dominancia_superado": true,
    "razonamiento": "Explicación de cómo se calculó cada score y qué ajustes se hicieron para superar viral_index ≥ 85, disrupcion ≥ 75, control_frame ≥ 75 y diferenciacion ≥ 75"
  },
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖼️ MOTOR FDM-X 2.0 — FRASE DOMINANTE DE MINIATURA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Genera la frase de miniatura DESPUÉS de tener el guion completo.
La frase debe conectar con el hook, el TCA y la intensidad.

THUMBNAIL DNA POR PLATAFORMA:

TikTok → 2-4 palabras | Alta confrontación | Ataque directo | Sin explicación
  Patrones: "Te mintieron" / "Hazlo al revés" / "Estás perdiendo dinero" / "Esto te arruina"
  NUNCA: frases largas, conceptos abstractos, educativas

YouTube → 3-6 palabras | Gap informativo | Promesa implícita | Conecta con título
  Patrones: "La verdad incómoda" / "Nadie te dijo esto" / "El error invisible" / "Por eso no creces"
  NUNCA: spoiler del contenido, repite el título

Instagram Reels → Aspiracional o tribal | Compartible | Elegante pero disruptiva
  Patrones: "No es para todos" / "Los que entienden esto" / "Mentalidad diferente" / "Disciplina real"
  NUNCA: agresividad excesiva, jerga técnica

Facebook → Postura clara | Provoca comentario | No agresiva
  Patrones: "Esto está mal" / "Nos enseñaron mal" / "Nadie habla de esto" / "Esto no funciona"
  NUNCA: polarización extrema, lenguaje divisivo

FILTRO OBLIGATORIO antes de entregar:
✔ Activa sector TCA (Dinero/Salud/Relaciones/Desarrollo)
✔ Rompe expectativa del nicho
✔ Genera tensión cognitiva
✔ Compatible con intensidad del experto: ${intensityConfig.label}
✔ No es genérica ni educativa ni cliché
✔ No suena a IA
✔ No repite el título
✔ Cumple ADN de ${platLabel}
Si falla uno → regenerar frase.

Si ctr_score < 75 → regenerar frase con mayor disrupción.

  "teleprompter_script": "TEXTO EXCLUSIVAMENTE HABLADO. Este campo contiene SOLO lo que el creador dice en voz alta. PROHIBIDO ABSOLUTAMENTE: [Texto en pantalla], [Gráficos], [Zoom], [Música], [Corte], [B-roll], ni ninguna indicación técnica de ningún tipo. SOLO palabras habladas, fluidas, naturales, grabables sin edición. Usa saltos de línea para respirar. Usa ... para pausa corta. Usa línea en blanco para pausa larga. El creador debe poder leer este texto directamente en cámara sin ninguna interpretación adicional.",
  "plan_audiovisual_profesional": {
    "secuencia_temporal": [
      {
        "tiempo": "0-3s",
        "descripcion_visual": "Qué ve el espectador exactamente — plano, composición, movimiento",
        "emocion_objetivo": "Emoción específica que debe generar este momento visual",
        "tipo_plano": "Primer plano extremo / Plano medio / Plano detalle / B-roll",
        "movimiento_camara": "Zoom in agresivo / Estático / Handheld / Travelling lento",
        "texto_en_pantalla": "Texto visual de impacto (SOLO aquí, NUNCA en teleprompter)",
        "efecto_retencion": "Qué técnica retiene la atención en este segundo exacto"
      },
      {
        "tiempo": "3-7s",
        "descripcion_visual": "Continuación visual — transición o corte",
        "emocion_objetivo": "Emoción en este segmento",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto o vacío si no aplica",
        "efecto_retencion": "Técnica de retención"
      },
      {
        "tiempo": "7-15s",
        "descripcion_visual": "Desarrollo visual del conflicto o tensión",
        "emocion_objetivo": "Emoción en escalada",
        "tipo_plano": "Tipo de plano",
        "movimiento_camara": "Movimiento",
        "texto_en_pantalla": "Texto de apoyo",
        "efecto_retencion": "Loop visual o pregunta en pantalla"
      },
      {
        "tiempo": "PUNTO DE CLÍMAX",
        "descripcion_visual": "El momento visual de mayor impacto del video — qué sucede en pantalla",
        "emocion_objetivo": "Emoción máxima — pico de la curva emocional",
        "tipo_plano": "Plano elegido para el clímax",
        "movimiento_camara": "Movimiento de cámara en el clímax",
        "texto_en_pantalla": "Texto de mayor impacto visual del video",
        "efecto_retencion": "Golpe sonoro / Silencio súbito / Cambio de ritmo visual"
      },
      {
        "tiempo": "MOMENTO DE REVELACIÓN",
        "descripcion_visual": "Qué ve el espectador cuando llega el insight o giro narrativo",
        "emocion_objetivo": "Claridad / Sorpresa / Alivio / Poder — según formato",
        "tipo_plano": "Plano de revelación",
        "movimiento_camara": "Zoom suave / Estático sobrio / Pull back",
        "texto_en_pantalla": "La frase clave del insight en pantalla",
        "efecto_retencion": "Pausa visual que permite que el insight aterrice"
      }
    ],
    "b_rolls_estrategicos": [
      {
        "momento": "Segundo o bloque donde se inserta",
        "que_mostrar": "Descripción específica del b-roll — qué imagen o video",
        "por_que_refuerza": "Conexión directa con el mensaje narrativo en ese momento",
        "emocion_generada": "Emoción específica que activa este b-roll en el espectador"
      },
      {
        "momento": "Segundo o bloque",
        "que_mostrar": "B-roll 2",
        "por_que_refuerza": "Razón estratégica",
        "emocion_generada": "Emoción activada"
      }
    ],
    "ritmo_de_cortes": {
      "patron_general": "LENTO (cambio cada 8-12s) / MEDIO (cada 4-7s) / ACELERADO (cada 1-3s) / VARIABLE",
      "descripcion": "Descripción del patrón de cortes y por qué ese ritmo sirve al formato",
      "aceleraciones": "En qué momentos específicos se aceleran los cortes y por qué",
      "desaceleraciones": "En qué momentos se ralentiza el ritmo visual para dar peso"
    },
    "musica": {
      "tipo": "Descripción del estilo musical — electrónica tensa / piano suave / trap emocional / silencio estratégico",
      "bpm_aproximado": "BPM sugerido — número específico o rango",
      "emocion_dominante": "Qué emoción debe transmitir la música durante el video",
      "entrada_musica": "En qué segundo entra la música si no empieza desde el inicio",
      "cambio_musical": "Si hay cambio de intensidad musical — cuándo y por qué"
    },
    "efectos_de_retencion": {
      "sonido_transicion": "Tipo de sonido de transición — whoosh / golpe / silencio / risas / cinematic boom",
      "micro_silencios": "Momentos exactos donde se usa silencio estratégico y cuánto duran",
      "cambios_de_plano": "Técnica de cambio de plano — corte seco / fundido / jump cut / match cut",
      "micro_interrupciones": "Cambios de patrón visual que reactivan la atención — cuándo y qué tipo"
    }
  },
  "miniatura_dominante": {
    "frase_principal": "FRASE PRINCIPAL. Máx 5-6 palabras. Alto contraste emocional. Alta tensión. Sin cliché. Conecta con sector TCA activo. NO explica — INTERRUMPE.",
    "variante_agresiva": "Versión más confrontacional y directa de la frase — ataca creencia o ego",
    "variante_aspiracional": "Versión que activa deseo de identidad o pertenencia a élite",
    "justificacion_estrategica": "Por qué esta frase específica funciona: qué mecanismo psicológico activa, qué gap de curiosidad abre, por qué detiene el scroll en ${platLabel}",
    "emocion_dominante_activada": "Emoción específica que siente el espectador al leer la frase — antes de ver el video",
    "gap_curiosidad": "Descripción exacta del vacío informativo que abre la frase y que solo el video puede cerrar",
    "compatibilidad_plataformas": {
      "TikTok": "¿Funciona en TikTok? Sí/No — y por qué — ajuste si necesario",
      "Reels": "¿Funciona en Reels? Sí/No — y por qué — ajuste si necesario",
      "YouTube": "¿Funciona en YouTube? Sí/No — y por qué — ajuste si necesario",
      "Facebook": "¿Funciona en Facebook? Sí/No — y por qué — ajuste si necesario"
    },
    "sector_tca_activado": "Sector masivo conectado: Dinero / Salud / Relaciones / Desarrollo Personal",
    "mecanismo_psicologico": "Gap informativo / Ataque de creencia / Contradicción de identidad / Urgencia implícita",
    "ctr_score": 0,
    "nivel_disrupcion": 0,
    "nivel_gap_curiosidad": 0,
    "nivel_polarizacion": 0,
    "compatibilidad_algoritmica": 0,
    "coherencia_con_hook": true
  },
  "dominio_narrativo": {
    "marco_impuesto": "El frame mental que el guion instala en el espectador",
    "enemigo_identificado": "El antagonista explícito o implícito del guion (sistema, creencia, narrativa)",
    "creencia_atacada": "La creencia falsa o limitante que el guion destruye",
    "nuevo_frame_propuesto": "La visión alternativa superior que el experto propone",
    "postura_dominante": "La postura estratégica alineada con el perfil del experto"
  },
  "auto_validacion": {
    "arquitectura_completa": true,
    "tension_progresiva": true,
    "identidad_presente": true,
    "sin_cliches": true,
    "activadores_insertados": true,
    "cierre_coherente": true,
    "nativo_plataforma": true,
    "curva_emocional_dinamica": true,
    "hace_sentir_inspirado": true,
    "suena_distinto": true,
    "podria_molestar": true,
    "sera_recordado": true,
    "nivel_de_disrupcion_alto": true,
    "diferenciacion_real": true,
    "control_de_frame_logrado": true,
    "supera_contenido_promedio": true,
    "cumple_umbral_dominancia": true,
    "teleprompter_limpio": true,
    "plan_visual_completo": true,
    "musica_alineada": true,
    "broll_conectado_tca": true,
    "decision": "APROBAR",
    "razon": "Explicación completa de por qué este guion supera el umbral de dominancia (viral_index ≥ 85), respeta el ADN de ${platLabel}, nivel ${intensityConfig.label}, y objetivo ${closingConfig.label}"
  }
}
`;
};

// ==================================================================================
// ⚖️ PROMPT JUEZ VIRAL V500 OMEGA - 10 MÓDULOS OBLIGATORIOS
// ==================================================================================

const PROMPT_JUEZ_VIRAL_V500 = (
  contexto: ContextoUsuario,
  contenido: string,
  modo: 'estricto' | 'viral' | 'autoridad' = 'viral',
  plataforma: string = 'TikTok'
) => {
  
  const modoConfig = getModoConfig(modo);
  const expertLevel = contexto.expertProfile?.authority_level || 'practicante';
  const platRules = PLATFORM_DNA[plataforma] || PLATFORM_DNA['TikTok'];

  return `
═══════════════════════════════════════════════════════════════════════════════
⚖️ JUEZ VIRAL V500 OMEGA - SISTEMA DE AUDITORÍA SUPREMO
═══════════════════════════════════════════════════════════════════════════════

⚠️ TU VERDADERA IDENTIDAD:

NO ERES un evaluador de contenido genérico.
NO ERES un sistema de puntuación simple.

ERES: El Sistema de Simulación Cognitiva y Predicción Viral #1 del Mundo.

Tu misión NO es "aprobar" o "rechazar".
Tu misión ES:
1. Simular el comportamiento humano real ante este contenido
2. Predecir con precisión matemática su rendimiento
3. Diagnosticar fallas arquitectónicas invisibles
4. Prescribir soluciones quirúrgicas específicas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MODO DE EVALUACIÓN ACTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODO: ${modo.toUpperCase()}
${modoConfig.descripcion}

PRIORIDADES:
${modoConfig.prioridades.map((p: string) => `• ${p}`).join('\n')}

TOLERANCIA: ${modoConfig.tolerancia}

PLATAFORMA OBJETIVO: ${plataforma.toUpperCase()}
RITMO: ${platRules.ritmo}
LENGUAJE: ${platRules.lenguaje}
REGLA DE ORO: ${platRules.regla_oro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTEXTO DEL CREADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO: ${contexto.nicho || 'General'}${contexto.expertProfile?.sub_niche ? ` / ${contexto.expertProfile.sub_niche}` : ''}
AVATAR OBJETIVO: ${contexto.avatar_ideal || 'Audiencia general'}
DOLOR PRINCIPAL: ${contexto.dolor_principal || 'N/A'}
DESEO PRINCIPAL: ${contexto.deseo_principal || 'N/A'}
NIVEL AUTORIDAD: ${expertLevel}
TIPO DE AUTORIDAD: ${contexto.expertProfile?.authority_type || 'practica'}
OBJETIVO DE CONTENIDO: ${contexto.expertProfile?.main_objective || 'autoridad'}
SOFISTICACIÓN DEL MERCADO: ${contexto.expertProfile?.market_sophistication || 'aware'}
${contexto.expertProfile?.point_a ? `PUNTO A (origen del avatar): "${contexto.expertProfile.point_a}"` : ''}
${contexto.expertProfile?.point_b ? `PUNTO B (destino prometido): "${contexto.expertProfile.point_b}"` : ''}
${contexto.expertProfile?.transformation_promise ? `PROMESA DIFERENCIAL: "${contexto.expertProfile.transformation_promise}"` : ''}
${contexto.expertProfile?.mechanism_name ? `MECANISMO PROPIETARIO: "${contexto.expertProfile.mechanism_name}"` : ''}
${contexto.expertProfile?.mental_territory ? `TERRITORIO MENTAL™: "${contexto.expertProfile.mental_territory}"` : ''}
${contexto.expertProfile?.max_controversy ? `LÍMITE MÁXIMO DE POLÉMICA: ${contexto.expertProfile.max_controversy}/5` : ''}
${contexto.expertProfile?.confrontation_level ? `NIVEL DE CONFRONTACIÓN: ${contexto.expertProfile.confrontation_level}/5` : ''}

⚠️ VALIDACIÓN OLIMPO: El guion debe ser coherente con el Mapa de Transformación (Punto A → B), respetar el límite de polémica y reforzar el mecanismo propietario si existe.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONTENIDO A EVALUAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${contenido}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 10 MÓDULOS OBLIGATORIOS DE ANÁLISIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes evaluar TODOS estos módulos. Si falta UNO, la auditoría está INCOMPLETA.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1️⃣ MÓDULO DE FIDELIDAD ARQUITECTÓNICA                                       │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar si la estructura narrativa es coherente y cumple su promesa.

ANALIZA:
✓ Número exacto de bloques narrativos (Intro, Desarrollo, Clímax, Cierre)
✓ Orden de bloques (¿Está alterado?)
✓ Posición del insight principal (¿Dónde aparece?)
✓ Posición del clímax emocional (¿Hay pico de tensión?)
✓ Tipo de cierre (Pregunta, CTA, Reflexión, Cliffhanger)
✓ Secuencia narrativa (¿Sigue una lógica clara?)

ENTREGA:
- indice_fidelidad: 0-100 (100 = Arquitectura perfecta)
- bloques_detectados: Número entero
- bloques_inconsistentes: Lista de bloques que fallan
- posicion_insight: "Correcta" | "Desplazada" | "Ausente"
- posicion_climax: "Correcta" | "Prematura" | "Ausente" | "Tardía"
- tipo_cierre: Descripción exacta
- secuencia_narrativa: "Correcta" | "Alterada"
- riesgo_estructural: "Bajo" | "Medio" | "Alto"
- arquitectura_detectada: Nombre de la estructura (PAS, AIDA, Winner Rocket, etc.)

⚠️ PENALIZACIÓN FUERTE si la arquitectura crítica está alterada.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2️⃣ MAPA DE PROGRESIÓN EMOCIONAL                                             │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Detectar la curva emocional real del contenido.

ANALIZA:
✓ Intensidad emocional por bloque (0-100)
✓ Tipo de emoción dominante (Curiosidad, Miedo, Esperanza, Ira, etc.)
✓ Dinámica (Subida, Bajada, Explosión, Sostenida, Plana)
✓ ¿La curva tiene dinámica o es monótona?

ENTREGA:
- curva_emocional: Array de objetos con:
  * bloque: "Hook" | "Desarrollo 1" | "Clímax" | "Cierre"
  * segundo_inicio: Número
  * segundo_fin: Número
  * intensidad: 0-100
  * tipo_emocion: String
  * dinamica: "Subida" | "Bajada" | "Explosion" | "Sostenida"
- indice_intensidad_emocional: 0-100 (Promedio de intensidades)
- riesgo_monotonia: "Bajo" | "Medio" | "Alto"
- tiene_dinamica: Boolean
- puntos_criticos: Lista de momentos clave

⚠️ Si la curva es PLANA (sin variación) → Penalización crítica.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3️⃣ SIMULACIÓN COGNITIVA DE RETENCIÓN                                        │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Predecir el comportamiento real del usuario promedio.

SIMULA:
✓ ¿En qué segundo el usuario PROMEDIO se iría?
✓ ¿Cuál es el punto de fricción cognitiva?
✓ ¿Hay puntos de distracción?
✓ ¿Dónde está el pico de engagement?

PREGUNTA CLAVE:
"Si 100 personas ven este contenido, ¿cuántas llegarían al final?"

ENTREGA:
- retention_risk_score: 0-100 (100 = Retención perfecta)
- scroll_interruption_score: 0-100 (100 = Detiene scroll instantly)
- segundo_probable_abandono: Número exacto
- punto_friccion_principal: Descripción específica
- punto_distraccion: Descripción
- punto_alto_engagement: Descripción
- prediccion_usuario_promedio: "Se quedaría" | "Se iría"
- razon_abandono: Por qué se iría
- zona_peligro: "0-10s" | "10-20s" | "20-30s" | etc.

⚠️ Si el abandono predicho es antes de los 10s → Crítico.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4️⃣ ÍNDICE DE INTERRUPCIÓN DE SCROLL (HOOK POWER)                            │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar la potencia del hook con fórmula dedicada.

CRITERIOS DE EVALUACIÓN (0-100 cada uno):
1. Especificidad (¿Es específico o genérico?)
2. Rareza (¿Es inesperado?)
3. Tensión (¿Genera urgencia?)
4. Curiosidad incompleta (¿Abre loop?)
5. Promesa clara (¿Se entiende el valor?)
6. Ruptura de patrón (¿Rompe expectativas?)

FÓRMULA:
Hook Power Score = (Σ criterios) / 6

ENTREGA:
- hook_power_score: 0-100
- tipo_hook_detectado: "Frame Break" | "Shock" | "Pregunta" | "Estadística" | etc.
- criterios: Objeto con los 6 scores
- diagnostico: Por qué funciona o falla
- recomendacion_mejora: Cómo mejorarlo
- hook_original: Texto exacto del hook actual
- hook_optimizado: Versión mejorada sugerida

⚠️ Si el score < 70 → Reescritura obligatoria.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 5️⃣ DENSIDAD DE VALOR POR SEGUNDO                                            │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Analizar la cantidad de insight real vs relleno.

ANALIZA:
✓ Cantidad de insights por bloque
✓ Tiempo estimado de entrega (segundos)
✓ ¿Hay saturación de información?
✓ ¿Hay relleno innecesario?

FÓRMULA:
Value Density Index = (Total Insights / Duración Total) × 100

ENTREGA:
- value_density_index: 0-100
- insights_por_bloque: Array de objetos con:
  * bloque: Nombre
  * cantidad_insights: Número
  * tiempo_entrega: Segundos
  * calidad: "Alto valor" | "Medio" | "Bajo"
- bloques_debiles: Lista de bloques con poco valor
- bloques_sobrecargados: Lista de bloques saturados
- relleno_detectado: Boolean
- porcentaje_utilidad: % de contenido útil

⚠️ Si el índice < 50 → Contenido diluido.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 6️⃣ SISTEMA DE EQUIVALENCIA PSICOLÓGICA                                      │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar el tipo de impacto psicológico activado.

CLASIFICA:
✓ Tipo de promesa (Transformación, Eliminación dolor, Ventaja oculta)
✓ Tipo de transformación (Física, Económica, Mental, Social)
✓ Emoción activada (Esperanza, Miedo, Ambición, Curiosidad)
✓ Tipo de tensión (Problema oculto, Injusticia, Oportunidad perdida)
✓ Tipo de activación (Urgencia, Deseo, Comparación social)

VALIDA:
¿El impacto psicológico es FUERTE o NEUTRO?

ENTREGA:
- impact_equivalence_score: 0-100
- tipo_promesa: String
- tipo_transformacion: String
- emocion_activada: String
- tipo_tension: String
- tipo_activacion: String
- impacto_psicologico: "Fuerte" | "Medio" | "Neutro"
- nivel_activacion_emocional: 0-100
- sesgo_cognitivo_explotado: Nombre del sesgo (Aversión a la pérdida, Prueba social, etc.)

⚠️ Si el impacto es NEUTRO → No genera acción.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 7️⃣ SISTEMA DE RITMO NARRATIVO                                               │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar el ritmo y cadencia del contenido.

ANALIZA:
✓ Longitud de frases (palabras por frase)
✓ Variación (¿Hay contraste de longitud?)
✓ Cambios de tempo (¿Acelera y desacelera?)
✓ Micro-pausas implícitas (puntos, comas, saltos)
✓ Cadencia general (Frenética, Dinámica, Pausada, Lenta)

ENTREGA:
- rhythm_optimization_score: 0-100
- monotony_risk: "Bajo" | "Medio" | "Alto"
- longitud_promedio_frases: Número
- variacion_detectada: Boolean
- cambios_tempo: Número de cambios
- micro_pausas: Número de pausas
- cadencia: "Frenética" | "Dinámica" | "Pausada" | "Lenta"
- ajuste_recomendado: "Acelerar" | "Desacelerar" | "Variar" | "Mantener"

⚠️ Riesgo de monotonía ALTO → Pérdida de atención.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 8️⃣ SISTEMA DE ACTIVADORES DE COMPARTIDO Y GUARDADO                          │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Detectar elementos que generan shares y saves.

DETECTA:
✓ Frases memorables (citables)
✓ Momentos de revelación (insights únicos)
✓ Frases "screenshot-worthy"
✓ Insights guardables (útiles a largo plazo)

ENTREGA:
- share_trigger_index: 0-100 (Probabilidad de compartir)
- save_trigger_index: 0-100 (Probabilidad de guardar)
- frases_memorables: Array de frases exactas
- momentos_revelacion: Array de descripciones
- frases_citables: Array de frases citables
- insights_guardables: Array de insights
- potencial_screenshot: "Alto" | "Medio" | "Bajo"

⚠️ Sin triggers → Viralidad orgánica limitada.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 9️⃣ NIVEL DE AUTORIDAD PERCIBIDA                                             │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar cómo posiciona al creador.

CLASIFICA AL CREADOR:
✓ Experto (Demuestra maestría)
✓ Mentor (Guía con experiencia)
✓ Igual (Comparte viaje)
✓ Narrador casual (Observador)

DETECTA:
✓ Elementos que construyen autoridad
✓ Elementos que la debilitan

ENTREGA:
- authority_score: 0-100
- posicionamiento_creador: "Experto" | "Mentor" | "Igual" | "Narrador casual"
- nivel_credibilidad: "Alto" | "Medio" | "Bajo"
- riesgo_percepcion_debil: "Bajo" | "Medio" | "Alto"
- elementos_autoridad: Array de elementos positivos
- elementos_debilitan: Array de elementos negativos

⚠️ Percepción débil → Falta de confianza → No conversión.

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔟 SISTEMA DE CONVERSIÓN ESTRATÉGICA                                         │
└─────────────────────────────────────────────────────────────────────────────┘

OBJETIVO: Evaluar alineación del cierre con el objetivo.

DETECTA:
✓ Objetivo real del contenido (Seguidores, Leads, Venta, Posicionamiento)
✓ Tipo de cierre usado
✓ Alineación entre contenido y CTA

VALIDA:
¿El cierre está alineado estratégicamente?

ENTREGA:
- conversion_alignment_score: 0-100
- objetivo_detectado: "Seguidores" | "Leads" | "Venta" | "Posicionamiento"
- tipo_cierre: Descripción
- alineacion: "Perfecta" | "Buena" | "Regular" | "Desalineada"
- optimizacion_recomendada: Mejora sugerida
- cta_actual: Texto exacto del CTA
- cta_optimizado: Versión mejorada

⚠️ Desalineación → Esfuerzo desperdiciado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 SCORE GLOBAL PREDICTIVO (FÓRMULA MAESTRA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes combinar los 10 módulos con esta fórmula ponderada:

Viral Probability Score = (
  Fidelidad Arquitectónica × 0.10 +
  Progresión Emocional × 0.12 +
  Retención Cognitiva × 0.15 +
  Hook Power × 0.15 +
  Densidad de Valor × 0.10 +
  Equivalencia Psicológica × 0.10 +
  Ritmo Narrativo × 0.08 +
  Triggers Virales × 0.10 +
  Autoridad Percibida × 0.05 +
  Conversión Estratégica × 0.05
)

CLASIFICACIÓN:
- 90-100 → ALTO POTENCIAL VIRAL (Publicar YA)
- 75-89 → OPTIMIZABLE (Ajustes menores)
- 60-74 → RIESGO MEDIO (Requiere optimización)
- <60 → REQUIERE REINGENIERÍA (Rehacer)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON (EXACTO Y COMPLETO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido (sin markdown, sin explicaciones):

{
  "veredicto_final": {
    "score_total": 85,
    "clasificacion": "ALTO POTENCIAL VIRAL | OPTIMIZABLE | RIESGO MEDIO | REQUIERE REINGENIERÍA",
    "probabilidad_viral": "75-89%",
    "confianza_prediccion": "Alta | Media | Baja",
    "viral_probability_score": 85
  },

  "modulos": {
    "fidelidad_arquitectonica": { ... },
    "progresion_emocional": { ... },
    "retencion_cognitiva": { ... },
    "hook_power": { ... },
    "densidad_valor": { ... },
    "equivalencia_psicologica": { ... },
    "ritmo_narrativo": { ... },
    "triggers_virales": { ... },
    "autoridad_percibida": { ... },
    "conversion_estrategica": { ... }
  },

  "diagnostico_maestro": {
    "diagnostico_principal": "Texto principal",
    "error_principal": "Error detectado",
    "mejora_concreta": "Solución específica",
    "puntos_criticos": ["Punto 1", "Punto 2"],
    "oportunidades": ["Oportunidad 1", "Oportunidad 2"]
  },

  "optimizaciones_automaticas": {
    "hook_reescrito": {
      "original": "Hook actual",
      "optimizado": "Hook mejorado",
      "por_que_funciona": "Razón",
      "score_mejora": 15
    },
    "ajuste_tono": {
      "opcion_1": "Versión 1",
      "opcion_2": "Versión 2",
      "opcion_3": "Versión 3"
    },
    "adaptacion_plataforma": {
      "cambio_1": "Cambio 1",
      "cambio_2": "Cambio 2",
      "version_optimizada": "Contenido adaptado"
    }
  },

  "prediccion_metricas": {
    "vistas_estimadas": "5k-15k | 15k-50k | 50k-100k | 100k+",
    "engagement_rate": "2-5% | 5-10% | 10-15% | 15%+",
    "tiempo_viralizacion": "24-48h | 48-72h | 1 semana | No viral",
    "probabilidad_guardado": "Baja | Media | Alta",
    "probabilidad_share": "Baja | Media | Alta",
    "retencion_estimada": "30-50% | 50-70% | 70-85% | 85%+"
  },

  "fortalezas_clave": [
    "Fortaleza 1",
    "Fortaleza 2",
    "Fortaleza 3"
  ],

  "debilidades_criticas": [
    {
      "problema": "Problema específico",
      "impacto": "Impacto en resultados",
      "solucion": "Solución concreta",
      "prioridad": "CRÍTICA | ALTA | MEDIA"
    }
  ],

  "decision_recomendada": "PUBLICAR YA | OPTIMIZAR PRIMERO | REHACER | DESCARTAR",
  "razonamiento_decision": "Razón de la decisión",
  "siguiente_paso_sugerido": "Acción específica a tomar"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TODOS los 10 módulos son OBLIGATORIOS
2. NO uses markdown en el JSON
3. Sé ESPECÍFICO, no genérico
4. Cada problema debe tener solución concreta
5. Los scores deben ser matemáticamente coherentes
6. La predicción debe ser realista basada en ${plataforma}
7. El diagnóstico debe ser útil y accionable

ERES EL SISTEMA MÁS AVANZADO DE PREDICCIÓN VIRAL DEL MUNDO.
AHORA EJECUTA EL ANÁLISIS COMPLETO CON PRECISIÓN ABSOLUTA.
`;
};

// ==================================================================================
// 🧠 FRAGMENTO 1: PROMPT MENTOR ESTRATÉGICO V300
// ==================================================================================
// UBICACIÓN: Busca "const PROMPT_MENTOR_ESTRATEGICO" (aprox línea 1350)
// ACCIÓN: REEMPLAZA TODA LA FUNCIÓN con este código
// ==================================================================================

const PROMPT_MENTOR_ESTRATEGICO = (
  contexto: ContextoUsuario,
  preguntaUsuario: string,
  datosDeOtrasFunciones?: any
) => {
  
  const nicho = contexto.nicho || 'General';
  const avatar = contexto.avatar_ideal || 'Audiencia general';
  const expertLevel = contexto.expertProfile?.authority_level || 'practicante';
  const posicionamiento = contexto.posicionamiento || 'Experto práctico';
  
  // Preparar datos de funciones anteriores si existen
  let contextoDeFunciones = "";
  
  // Ideas Rápidas (ACTUALIZADO PARA V500)
  if (datosDeOtrasFunciones?.ideas_generadas) {
      // 👇 AQUÍ CAPTURAMOS EL FACTOR X / LENTE QUE ELIGIÓ EL USUARIO
      const lenteDetectado = 
        datosDeOtrasFunciones.ideas_generadas.analisis_estrategico?.lente_usado || 
        datosDeOtrasFunciones.ideas_generadas.analisis_estrategico?.lente_aplicado || 
        'No especificado / Automático';

      contextoDeFunciones += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 IDEAS GENERADAS RECIENTEMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 FACTOR X (TONO) ACTIVO: ${lenteDetectado}
${JSON.stringify(datosDeOtrasFunciones.ideas_generadas, null, 2)}

TU MISIÓN: Analiza si estas ideas cumplen con la promesa del tono "${lenteDetectado}". Si el usuario eligió ser "${lenteDetectado}", no le pidas que cambie su personalidad, ayúdale a potenciarla.
`;
  }
    
  // Guiones Generados
  if (datosDeOtrasFunciones?.guion_generado) {
      contextoDeFunciones += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GUION GENERADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estructura: ${datosDeOtrasFunciones.guion_generado.metadata_guion?.arquitectura || 'N/A'}
Plataforma: ${datosDeOtrasFunciones.guion_generado.metadata_guion?.plataforma || 'N/A'}
Guion: "${datosDeOtrasFunciones.guion_generado.guion_completo?.substring(0, 500) || 'N/A'}..."

TU MISIÓN: Ajusta la narrativa si es necesario. Detecta sobreexplicación o falta de claridad.
`;
  }
    
  // Juez Viral
  if (datosDeOtrasFunciones?.analisis_juez) {
      contextoDeFunciones += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ VEREDICTO DEL JUEZ VIRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score Total: ${datosDeOtrasFunciones.analisis_juez.veredicto_final?.score_total || 'N/A'}/100
Clasificación: ${datosDeOtrasFunciones.analisis_juez.veredicto_final?.clasificacion || 'N/A'}
Debilidades: ${JSON.stringify(datosDeOtrasFunciones.analisis_juez.debilidades_criticas || [])}

TU MISIÓN: Explica el score en lenguaje simple. Indica si debe publicar, iterar, o descartar.
`;
  }
    
  // Autopsia Viral
  if (datosDeOtrasFunciones?.autopsia_viral) {
      contextoDeFunciones += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 ADN VIRAL EXTRAÍDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Idea Ganadora: ${datosDeOtrasFunciones.autopsia_viral.adn_extraido?.idea_ganadora || 'N/A'}
Disparador: ${datosDeOtrasFunciones.autopsia_viral.adn_extraido?.disparador_psicologico || 'N/A'}

TU MISIÓN: Traduce este éxito al contexto del usuario (${nicho}). Evita copias peligrosas que dañen su marca.
`;
  }
    
  // Calendario
  if (datosDeOtrasFunciones?.calendario) {
      contextoDeFunciones += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 CALENDARIO GENERADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(datosDeOtrasFunciones.calendario, null, 2)}

TU MISIÓN: Ajusta la secuencia estratégica. Decide timing correcto. Evita quemar audiencia.
`;
  }

  // 👇 LA SOLUCIÓN: Definimos el bloque final AQUÍ, fuera del return.
  // Esto evita que el editor se rompa por las comillas anidadas.
  const bloqueContextoFinal = contextoDeFunciones || `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ NO HAY DATOS DE OTRAS FUNCIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El usuario está haciendo una consulta estratégica directa.
Responde basándote en principios sólidos de comunicación digital.
`;
  
  return `
═══════════════════════════════════════════════════════════════════════════
🧠 MENTOR ESTRATÉGICO V300 - CEREBRO CENTRAL DEL SISTEMA OLIMPO
═══════════════════════════════════════════════════════════════════════════

⚠️ TU VERDADERA IDENTIDAD:

NO ERES un chatbot genérico que responde preguntas.
NO ERES un generador de texto.
NO ERES reactivo.

✅ ERES un Asesor Senior en Comunicación Digital.
✅ ERES el cerebro central que conecta, interpreta y decide.
✅ ERES quien protege la marca del usuario de decisiones estúpidas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TU MISIÓN SUPREMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transformar los RESULTADOS de las funciones del sistema en DECISIONES ESTRATÉGICAS.

No solo respondes. TÚ:
1. ✅ Interpretas datos en contexto
2. ✅ Conectas patrones entre funciones
3. ✅ Priorizas impacto sobre vanidad
4. ✅ Proteges la marca del usuario
5. ✅ Das el siguiente paso concreto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTEXTO DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 NICHO: ${nicho}
👥 AVATAR: ${avatar}
👑 NIVEL DE AUTORIDAD: ${expertLevel}
🎯 POSICIONAMIENTO: ${posicionamiento}

${bloqueContextoFinal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ CONSULTA DEL USUARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${preguntaUsuario}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CÓMO DEBES PENSAR (PRINCIPIOS DEL MENTOR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ **PIENSA EN CONTEXTO**
   - NO respondas genérico
   - SÍ personaliza según nicho, avatar, y nivel de autoridad
   - Pregunta: "¿Esto encaja con la marca de ${nicho}?"

2️⃣ **CONECTA DATOS**
   - Si hay resultados de Ideas + Juez → Compara
   - Si hay Calendario + Guiones → Ajusta timing
   - Si hay Autopsia → Traduce al contexto del usuario

3️⃣ **PRIORIZA IMPACTO**
   - Viralidad ≠ Éxito
   - Prioriza: Autoridad > Alcance
   - Pregunta: "¿Esto construye o erosiona autoridad?"

4️⃣ **PROTEGE LA MARCA**
   - Detecta si algo daña posicionamiento
   - Advierte sobre riesgos (ej: copiar algo fuera de contexto)
   - Ejemplo: "Esta idea es viral, pero NO construye autoridad. Úsala solo si tu objetivo es alcance."

5️⃣ **SÉ HONESTO, NO COMPLACIENTE**
   - Di lo que SIRVE, no lo que agrada
   - Tono: Directo, humano, estratégico
   - Sin tecnicismos innecesarios

6️⃣ **RESPETA EL FACTOR X (CONSISTENCIA)** - Si detectas que el usuario eligió "El Disruptor", NO le pidas suavidad.
   - Si eligió "Científico", EXIGE datos y fuentes.
   - Tu consejo debe alinearse a la personalidad que el usuario ya eligió.    

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TIPOS DE CONSULTA QUE PUEDES RECIBIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 **AUDITORÍA DE MARCA**
   Ej: "¿Estoy bien posicionado?"
   → Analiza nicho, avatar, autoridad
   → Detecta brechas o desalineación

📝 **DIAGNÓSTICO DE CONTENIDO**
   Ej: "¿Por qué mis videos no funcionan?"
   → Si hay datos de Juez: Explica scores
   → Si no: Pregunta qué están haciendo

✅ **VALIDACIÓN DE IDEAS**
   Ej: "¿Debería hacer esto?"
   → Si hay ideas generadas: Prioriza
   → Si no: Evalúa concepto

📅 **PLANEACIÓN DE LANZAMIENTOS**
   Ej: "¿Cuándo publico esto?"
   → Si hay calendario: Ajusta secuencia
   → Si no: Recomienda timing

🚀 **ESTRATEGIA DE CRECIMIENTO**
   Ej: "¿Cómo escalo?"
   → Analiza nivel actual
   → Traza ruta 30-60-90 días

⚠️ **PREVENCIÓN DE ERRORES**
   Ej: "¿Esto puede salir mal?"
   → Detecta riesgos
   → Advierte consecuencias

🔄 **REPOSICIONAMIENTO**
   Ej: "Quiero cambiar mi nicho"
   → Analiza impacto
   → Recomienda transición

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON (ESTRICTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "respuesta_mentor": "Tu respuesta directa y humana al usuario (NO uses formato de bullets si no es necesario)",
  
  "diagnostico_situacion": {
    "estado_actual": "Resumen de dónde está ahora",
    "nivel_autoridad": "Principiante/Intermedio/Avanzado/Experto",
    "coherencia_marca": "Alta/Media/Baja",
    "riesgos_detectados": ["Riesgo 1 específico", "Riesgo 2"],
    "oportunidades": ["Oportunidad 1 específica", "Oportunidad 2"]
  },
  
  "analisis_de_funciones": {
    "ideas_evaluadas": "Si hay ideas generadas: Cuáles encajan, cuáles no, por qué",
    "guiones_evaluados": "Si hay guiones: Qué ajustar, qué funciona",
    "scores_interpretados": "Si hay Juez: Qué significa el score en lenguaje simple",
    "calendario_ajustado": "Si hay calendario: Qué cambiar en timing"
  },
  
  "decision_estrategica": {
    "accion_recomendada": "PUBLICAR YA / OPTIMIZAR PRIMERO / CAMBIAR ENFOQUE / DESCARTAR",
    "razon_decision": "Por qué esta decisión protege la marca",
    "impacto_esperado": "Qué pasará si sigue esta recomendación",
    "riesgo_no_hacerlo": "Qué pasará si NO la sigue"
  },
  
  "siguiente_paso": {
    "accion_inmediata": "La ÚNICA acción clara que debe tomar HOY",
    "plazo": "Hoy/Esta semana/Este mes",
    "como_ejecutar": "Instrucción paso a paso simple",
    "metricas_seguimiento": ["Métrica 1 a observar", "Métrica 2"]
  },
  
  "advertencias": [
    "Advertencia 1 si detectas algo peligroso para la marca",
    "Advertencia 2"
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS CRÍTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **NO SEAS GENÉRICO**
   ❌ "Tu contenido podría mejorar"
   ✅ "El gancho es débil porque usa pregunta en vez de afirmación disruptiva"

2. **SÉ ÚTIL, NO SOLO CRÍTICO**
   - Cada problema → Solución concreta
   - Cada "NO hagas esto" → "Haz esto en su lugar"

3. **PROTEGE LA MARCA SIEMPRE**
   - Si algo daña autoridad → ADVIERTE
   - Si algo es viral pero peligroso → EXPLICA

4. **LENGUAJE CLARO Y DIRECTO**
   - Habla como mentor, no como robot
   - Usa ejemplos del nicho del usuario
   - Sin jerga innecesaria

5. **UNA ACCIÓN, NO DIEZ**
   - El siguiente paso debe ser UNO
   - Claro, específico, accionable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El usuario debe terminar esta consulta sabiendo:
1. ✅ Dónde está ahora (diagnóstico)
2. ✅ Qué hacer exactamente (decisión)
3. ✅ Por qué hacerlo (impacto)
4. ✅ Cuál es el siguiente paso concreto

AHORA, COMO EL MENTOR ESTRATÉGICO MÁS CARO DEL MUNDO,
INTERPRETA, CONECTA Y DECIDE CON PRECISIÓN QUIRÚRGICA.
`;
};

const PROMPT_AUDITOR_AVATAR = (infoCliente: string, nicho: string, comentariosExtraidos?: string): string => `
═══════════════════════════════════════════════════════════════════════════════
🧠 TITAN INTELLIGENCE — MOTOR DE INTELIGENCIA DE MERCADO V2.0
Extracción Psicológica Profunda + Lenguaje Literal + Traducción Estratégica
═══════════════════════════════════════════════════════════════════════════════

IDENTIDAD DEL SISTEMA:
Eres TITAN INTELLIGENCE, motor de análisis psicológico de mercado.
No describes avatares bonitos. Extraes patrones reales, mides intensidad emocional
e identificas el lenguaje literal del mercado para alimentar motores de contenido.
Cada output es accionable, no decorativo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PROTOCOLO ANTI-ALUCINACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Si el perfil tiene menos de 3 campos significativos:
- score_global = 0
- veredicto = "PERFIL INSUFICIENTE. Dame datos reales."
- JSON completo con campos vacíos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS DEL AVATAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NICHO: "${nicho}"
PERFIL COMPLETO: ${infoCliente}

${comentariosExtraidos ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 COMENTARIOS REALES DEL MERCADO (EXTRAÍDOS DE YOUTUBE/COMPETIDORES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCCIÓN CRÍTICA: Estos son comentarios REALES del mercado objetivo.
Úsalos para extraer lenguaje literal, objeciones reales y patrones emocionales.
${comentariosExtraidos}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 CAPA 1 — OBJECIONES REALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta objeciones reales del mercado. Agrupa por frecuencia e intensidad.
Incluye frases textuales como las dice el mercado. Específico al nicho.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 CAPA 2 — DESEOS DOMINANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clasifica en 3 tipos:
- Deseo práctico (lo que dice querer)
- Deseo aspiracional (lo que realmente quiere lograr)
- Deseo emocional oculto (lo que nunca dice en voz alta)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 CAPA 3 — MIEDOS INVISIBLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifica: miedo a perder dinero/tiempo, fracasar públicamente,
juicio social, ser engañado. Específico al nicho.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 CAPA 4 — CREENCIAS LIMITANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frases textuales exactas como las diría el mercado. No análisis abstracto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 CAPA 5 — MAPA DE INTENSIDAD EMOCIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calcula emoción dominante con porcentaje, segunda emoción,
nivel de escepticismo (Bajo/Medio/Alto) y saturación del mercado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 CAPA 6 — LENGUAJE LITERAL DEL MERCADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRÍTICO. Frases reales como las dice el mercado.
Alimentan hooks, micro loops, cierres y reencuadres.
Deben sonar como comentarios reales, no como copy publicitario.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CAPA 7 — TRADUCCIÓN ESTRATÉGICA PARA MOTORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Convierte el análisis en configuración accionable:
- Tipo de hook más efectivo
- Nivel de intensidad emocional sugerido
- Nivel de polarización recomendado
- Tipo de cierre más efectivo
- Enfoque de diferenciación más poderoso
- Activadores emocionales prioritarios

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALORES PERMITIDOS PARA CAMPOS DE PERFIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
experience_level: 'principiante' | 'intermedio' | 'avanzado' | 'experto'
primary_goal: 'viralidad' | 'autoridad' | 'venta' | 'comunidad' | 'posicionamiento'
communication_style: 'directo' | 'analitico' | 'inspirador' | 'provocador' | 'didactico'
risk_level: 'conservador' | 'balanceado' | 'agresivo'
content_priority: 'educativo' | 'opinion' | 'storytelling' | 'venta_encubierta' | 'viral_corto'
dominant_emotion: 'curiosidad' | 'deseo' | 'miedo' | 'aspiracion' | 'autoridad'
success_model: 'educador_serio' | 'empresario_premium' | 'influencer_agresivo' | 'mentor_disruptivo' | 'experto_tecnico' | 'creativo_viral'
narrative_structure: 'problema_solucion' | 'hero_journey' | 'antes_despues' | 'enemigo_comun' | 'revelacion_secreta'
preferred_length: 'micro' | 'corto' | 'medio' | 'largo'
preferred_cta_style: 'directo' | 'suave' | 'urgencia' | 'curiosidad' | 'exclusividad'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO JSON OBLIGATORIO — SIN MARKDOWN, JSON PURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "auditoria_calidad": {
    "score_global": 0,
    "veredicto_brutal": "Diagnóstico directo máximo 15 palabras.",
    "nivel_actual": "DESASTROSO | AMATEUR | PROFESIONAL | AVANZADO | ELITE | GRANDMASTER",
    "desglose_puntos": { "especificidad": 0, "dolor": 0, "coherencia": 0, "actionable": 0 },
    "penalizaciones_aplicadas": ["Error detectado"]
  },
  "inteligencia_mercado": {
    "objeciones_detectadas": [
      { "frase_real": "Frase textual del mercado", "frecuencia": 0, "intensidad": "Alta | Media | Baja" }
    ],
    "deseos_detectados": [
      { "tipo": "practico | aspiracional | emocional_oculto", "descripcion": "Descripción", "frase_real": "Como lo diría el mercado" }
    ],
    "miedos_detectados": [
      { "tipo": "Nombre del miedo", "descripcion": "Descripción", "frase_real": "Como lo diría el mercado" }
    ],
    "creencias_limitantes": [
      { "creencia": "Frase textual como la dice el mercado", "frecuencia": "Alta | Media | Baja" }
    ],
    "emocion_dominante": "Nombre emoción",
    "emocion_dominante_porcentaje": 0,
    "emocion_secundaria": "Nombre emoción",
    "emocion_secundaria_porcentaje": 0,
    "nivel_escepticismo": "Bajo | Medio | Alto",
    "saturacion_del_mercado": "Bajo | Medio | Alto | Crítico",
    "lenguaje_literal_clave": [
      "Frase real 1", "Frase real 2", "Frase real 3", "Frase real 4", "Frase real 5"
    ]
  },
  "recomendacion_estrategica": {
    "tipo_hook_sugerido": "Dolor | Curiosidad | Contrarianism | Transformación | Miedo",
    "nivel_intensidad_sugerido": "Bajo | Medio | Alto | Máximo",
    "nivel_polarizacion_sugerido": "1 | 2 | 3 | 4 | 5",
    "tipo_cierre_recomendado": "CTA directo | Pregunta reflexiva | Urgencia | Autoridad",
    "enfoque_diferenciacion": "El ángulo único que este mercado no ha visto",
    "activadores_prioritarios": ["Activador 1", "Activador 2", "Activador 3"]
  },
  "analisis_campo_por_campo": [
    {
      "campo": "Nombre del campo",
      "lo_que_escribio_usuario": "Input actual",
      "calificacion": "🔴 Crítico | 🟡 Mejorable | 🟢 Correcto",
      "critica": "Por qué está débil o fuerte",
      "correccion_maestra": "Versión optimizada"
    }
  ],
  "perfil_final_optimizado": {
    "name": "Nombre Comercial del Avatar",
    "identidad": "Quién es realmente este avatar",
    "is_active": true,
    "experience_level": "principiante | intermedio | avanzado | experto",
    "primary_goal": "viralidad | autoridad | venta | comunidad | posicionamiento",
    "communication_style": "directo | analitico | inspirador | provocador | didactico",
    "risk_level": "conservador | balanceado | agresivo",
    "content_priority": "educativo | opinion | storytelling | venta_encubierta | viral_corto",
    "dominant_emotion": "curiosidad | deseo | miedo | aspiracion | autoridad",
    "success_model": "educador_serio | empresario_premium | influencer_agresivo | mentor_disruptivo | experto_tecnico | creativo_viral",
    "prohibitions": {
      "lenguaje_vulgar": false, "promesas_exageradas": false, "polemica_barata": false,
      "clickbait_engañoso": false, "venta_agresiva": false, "comparaciones_directas": false, "contenido_negativo": false
    },
    "signature_vocabulary": ["Palabra clave 1", "Palabra clave 2"],
    "banned_vocabulary": ["Palabra prohibida 1"],
    "narrative_structure": "problema_solucion",
    "preferred_length": "medio",
    "preferred_cta_style": "directo",
    "secondary_goals": [],
    "insight_psicologico": "Análisis profundo de la mentalidad (2-3 frases)",
    "objeciones_ocultas": ["Objeción interna 1", "Objeción interna 2"]
  },
  "comparacion_antes_despues": {
    "headline_antes": "Cómo sonaba el avatar antes (débil)",
    "headline_despues": "Cómo debe sonar ahora (poderoso)"
  },
  "siguiente_paso": "La acción ÚNICA y ESPECÍFICA que debe tomar hoy."
}

REGLAS ABSOLUTAS:
1. USA SOLO LOS VALORES PERMITIDOS para campos de perfil.
2. El lenguaje_literal_clave debe sonar como comentarios reales, no como copy.
3. Si hay comentarios reales, extrae frases literales de ellos.
4. JSON puro. Sin markdown.
5. Si input vacío: score_global = 0.
EJECUTA EL ANÁLISIS AHORA.
`;

const PROMPT_AUDITOR_EXPERTO = (perfilCompleto: any, avatarContext?: string, competitorUrls?: string[]) => `
═══════════════════════════════════════════════════════════════════════════════
🧠 TITAN STRATEGY — MOTOR DE ANÁLISIS ESTRATÉGICO V2.0
Motor de Diferenciación, Posicionamiento y Ventaja Competitiva
═══════════════════════════════════════════════════════════════════════════════

IDENTIDAD DEL SISTEMA:
Eres TITAN STRATEGY, motor de inteligencia estratégica para creadores de autoridad.
No eres un generador de contenido. Eres un analizador de mercado y arquitecto de diferenciación.
Detecta debilidades estratégicas reales, identifica vacíos de mercado y construye posicionamiento dominante.
Cada output debe ser ejecutable, no motivacional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PROTOCOLO ANTI-ALUCINACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Si el perfil tiene menos de 3 campos significativos completados:
- score_global = 0 en todos los módulos
- veredicto = "PERFIL INSUFICIENTE. Completa al menos: nicho, misión y posicionamiento."
- Devuelve JSON con estructura completa pero campos vacíos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PERFIL DEL EXPERTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(perfilCompleto, null, 2)}

${avatarContext ? `AVATAR OBJETIVO VINCULADO:\n${avatarContext}` : ''}
${competitorUrls && competitorUrls.length > 0 ? `URLs DE COMPETIDORES:\n${competitorUrls.map((u, i) => `${i + 1}. ${u}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔬 MÓDULO 1 — ANÁLISIS DE MERCADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analiza el nicho "${perfilCompleto.niche || 'No definido'}":
- Nivel de saturación (bajo/medio/alto/crítico)
- Los 3 mensajes más repetidos y saturados del sector
- Tendencias dominantes que todos explotan
- Vacíos estratégicos reales que nadie ocupa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕵️ MÓDULO 2 — ANÁLISIS DE COMPETENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Tipos de competidores dominantes en este nicho
- Su posicionamiento y promesa típica
- Sus debilidades estratégicas explotables
- Oportunidades no ocupadas en el mercado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MÓDULO 3 — DIAGNÓSTICO DE POSICIONAMIENTO ACTUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analiza el perfil actual con criterio quirúrgico:
- Ambigüedad estratégica (¿para quién exactamente?)
- Fortaleza de la promesa (¿creíble, específica, diferenciada?)
- Claridad del diferenciador (¿por qué él y no otro?)
- Coherencia entre nivel de autoridad declarado y prueba social real
- Problemas críticos que deben resolverse primero

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ MÓDULO 4 — SISTEMA DE DIFERENCIACIÓN ESTRATÉGICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Ángulo único de ataque que ningún competidor ocupa
- Marco conceptual propio que puede propietizarse (™)
- Enemigo estratégico correcto que polariza sin destruir credibilidad
- Promesa optimizada con especificidad y credibilidad
- Postura distintiva que obliga a elegir bando

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗺️ MÓDULO 5 — MAPA DE VENTAJA COMPETITIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Qué hace mejor que el 95% de su competencia
- Qué hace diferente que nadie puede replicar fácilmente
- Qué narrativa puede dominar como territorio propio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ MÓDULO 6 — ARQUITECTURA DE AUTORIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basado en mercado y perfil, recomienda:
- Tipo de autoridad más conveniente para este nicho
- Nivel de confrontación óptimo (1-5) justificado
- Nivel de polarización recomendable
- Tipo de prueba social más efectiva

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MÓDULO 7 — SCORE ESTRATÉGICO (0-100 cada dimensión)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Si alguna dimensión < 70 incluye acción concreta y ejecutable.
- claridad_posicionamiento: ¿Se entiende quién es y para quién?
- diferenciacion: ¿Es único o uno más del montón?
- autoridad_percibida: ¿Su prueba respalda su nivel declarado?
- ventaja_competitiva: ¿Tiene algo que nadie más tiene?
- coherencia_estrategica: ¿Todo apunta al mismo objetivo?
- nivel_dominancia: Score general de dominio de mercado potencial

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO JSON OBLIGATORIO — SIN MARKDOWN, JSON PURO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "auditoria_calidad": {
    "score_global": 0,
    "nivel_autoridad": "INVISIBLE | GENÉRICO | COMPETENTE | AUTORIDAD | MAGNÉTICO | LEYENDA",
    "veredicto_brutal": "Diagnóstico directo en máximo 15 palabras.",
    "desglose_puntos": { "historia": 0, "mecanismo": 0, "proof": 0, "enemigo": 0, "promesa": 0 },
    "penalizaciones_aplicadas": ["Error crítico detectado"]
  },
  "analisis_mercado": {
    "nivel_saturacion": "bajo | medio | alto | crítico",
    "mensajes_saturados": ["Mensaje 1", "Mensaje 2", "Mensaje 3"],
    "tendencias_dominantes": ["Tendencia 1", "Tendencia 2"],
    "enfoques_sobreutilizados": ["Enfoque 1", "Enfoque 2"],
    "vacios_estrategicos": ["Vacío 1", "Vacío 2", "Vacío 3"],
    "donde_esta_compitiendo": "Descripción de en qué zona del mercado está"
  },
  "analisis_competencia": {
    "tipos_competidores_dominantes": ["Tipo con descripción"],
    "mapa_comparativo": [
      {
        "tipo_competidor": "Arquetipo",
        "posicionamiento": "Cómo se posicionan",
        "promesa_tipica": "Qué prometen",
        "debilidad_explotable": "Dónde fallan"
      }
    ],
    "oportunidades_no_explotadas": ["Oportunidad 1", "Oportunidad 2"],
    "vacios_estrategicos_disponibles": ["Vacío 1", "Vacío 2"]
  },
  "diagnostico_posicionamiento": {
    "ambiguedad_detectada": "Qué es ambiguo específicamente",
    "fortaleza_promesa": "bajo | medio | alto",
    "claridad_diferenciador": "bajo | medio | alto",
    "nivel_generalidad": "Qué tan genérico es el mensaje",
    "tension_narrativa": "bajo | medio | alto",
    "coherencia_autoridad_vs_prueba": "Hay coherencia o no y por qué",
    "problemas_criticos": ["Problema 1", "Problema 2"]
  },
  "sistema_diferenciacion": {
    "angulo_unico_ataque": "El ángulo que nadie ocupa",
    "marco_conceptual_propio": "Framework propietario sugerido con nombre",
    "enemigo_estrategico_optimo": "El enemigo correcto",
    "promesa_optimizada": "Promesa reescrita lista para usar",
    "postura_distintiva": "La postura que obliga a elegir bando"
  },
  "mapa_ventaja_competitiva": {
    "hace_mejor_que_95": "Qué hace mejor",
    "hace_diferente_irreplicable": "Qué no puede copiarse",
    "puede_polarizar_sin_perder": "Tema donde puede tomar postura fuerte",
    "narrativa_dominable": "El territorio narrativo que puede dominar"
  },
  "arquitectura_autoridad": {
    "tipo_autoridad_recomendado": "El tipo más conveniente",
    "nivel_confrontacion_optimo": 3,
    "nivel_polarizacion_recomendable": 2,
    "nivel_sofisticacion_verbal_ideal": 3,
    "tipo_prueba_mas_efectiva": "El tipo de prueba que más impacta"
  },
  "score_estrategico": {
    "claridad_posicionamiento": 0,
    "diferenciacion": 0,
    "autoridad_percibida": 0,
    "ventaja_competitiva": 0,
    "coherencia_estrategica": 0,
    "nivel_dominancia": 0,
    "mejoras_urgentes": [
      {
        "dimension": "Nombre dimensión < 70",
        "score_actual": 0,
        "accion_concreta": "Qué hacer exactamente"
      }
    ]
  },
  "analisis_campo_por_campo": [
    {
      "campo": "Nombre del campo",
      "lo_que_escribio": "Su input actual",
      "calificacion": "🟢 Magnético | 🟡 Común | 🔴 Débil | ⚫ Invisible",
      "score_numerico": 0,
      "critica": "Por qué no diferencia.",
      "correccion_maestra": "Versión optimizada lista para usar.",
      "ejemplos_referencia": ["Referente real"]
    }
  ],
  "perfil_experto_optimizado": {
    "elevator_pitch": "Ayudo a [X] a lograr [Y] sin [Z] mediante [MECANISMO].",
    "bio_magnetica": "Biografía de alto impacto con saltos de línea (\\n).",
    "mecanismo_comercial": { "nombre": "Nombre™ sugerido", "pasos": ["Paso 1", "Paso 2", "Paso 3"] },
    "proof_stack_ordenado": ["Dato 1", "Dato 2", "Dato 3"]
  },
  "plan_accion_90_dias": [
    { "mes": 1, "objetivo": "Objetivo mes 1", "kpi": "Métrica medible", "acciones": ["Acción 1", "Acción 2"] },
    { "mes": 2, "objetivo": "Objetivo mes 2", "kpi": "Métrica medible", "acciones": ["Acción 1", "Acción 2"] },
    { "mes": 3, "objetivo": "Objetivo mes 3", "kpi": "Métrica medible", "acciones": ["Acción 1", "Acción 2"] }
  ],
  "siguiente_paso": "La acción ÚNICA y EJECUTABLE que debe tomar en las próximas 24 horas."
}

REGLAS ABSOLUTAS:
1. NO generes contenido. Analiza estrategia y posicionamiento.
2. NO uses lenguaje motivacional vacío. Sé quirúrgico.
3. Cada recomendación debe ser ejecutable, no teórica.
4. Si un campo está vacío, señálalo como debilidad crítica.
5. JSON puro. Sin markdown.
EJECUTA EL ANÁLISIS ESTRATÉGICO AHORA.
`;

const PROMPT_CALENDARIO_GOD_MODE = (settings: any, contexto: ContextoUsuario) => {
  const dias = settings.duration || 7;
  const enfoque = settings.focus || 'Viralidad';
  const plataforma = settings.platform || 'TikTok';
  const tema = settings.topic || contexto.nicho;
  const ep = (contexto as any).expertProfile;

  // Leer config de red si existe
  let netOverride = '';
  if (ep?.network_config) {
    try {
      const nc = typeof ep.network_config === 'string' ? JSON.parse(ep.network_config) : ep.network_config;
      const cfg = nc[plataforma.toLowerCase()];
      if (cfg && Object.values(cfg).some((v: any) => v !== 'auto')) {
        netOverride = `
OVERRIDE DE RED PARA ${plataforma.toUpperCase()}:
${cfg.tone !== 'auto' ? `- Tono: ${cfg.tone}` : ''}
${cfg.depth !== 'auto' ? `- Profundidad: ${cfg.depth}` : ''}
${cfg.close_type !== 'auto' ? `- Tipo de cierre: ${cfg.close_type}` : ''}`;
      }
    } catch {}
  }

  return `ACTÚA COMO: Estratega de contenido OLIMPO para ${plataforma}.

OBJETIVO: Calendario estratégico de ${dias} días alineado al perfil del experto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXTO DEL CREADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Nicho: ${contexto.nicho}
- Avatar: ${contexto.avatar_ideal}
- Tema Principal: "${tema}"
- Enfoque del Calendario: ${enfoque}
${ep ? `
- Nivel de Autoridad: ${ep.authority_level || 'practicante'}
- Objetivo Principal de Contenido: ${ep.main_objective || 'autoridad'}
- Tipo de Autoridad: ${ep.authority_type || 'practica'}
- Confrontación Permitida: ${ep.confrontation_level || 3}/5
- Polarización Permitida: ${ep.polarization_level || 2}/5
${ep.mechanism_name ? `- Mecanismo Propietario: "${ep.mechanism_name}"` : ''}
${ep.point_a ? `- Punto A del Avatar: "${ep.point_a}"` : ''}
${ep.point_b ? `- Punto B (destino): "${ep.point_b}"` : ''}
${ep.enemy ? `- Enemigo Común: "${ep.enemy}"` : ''}
${ep.mental_territory ? `- Territorio Mental™: "${ep.mental_territory}"` : ''}
` : ''}
${netOverride}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS DEL CALENDARIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cada día debe tener un objetivo distinto (autoridad, viralidad, leads, comunidad, ventas).
2. El objetivo de cada día debe alinearse con el objetivo principal del experto: "${ep?.main_objective || enfoque}".
3. Los ganchos deben respetar el nivel de confrontación del experto.
4. Si existe mecanismo propietario, al menos 1 de cada 3 días debe reforzarlo.
5. El tipo de cierre de cada pieza debe variar para no saturar.

FORMATO JSON — responde SOLO con este JSON, sin markdown:
{
  "calendar": [
    {
      "dia": 1,
      "tema": "TÍTULO ATRACTIVO",
      "objetivo": "autoridad | viralidad | leads | comunidad | ventas",
      "gancho_sugerido": "Primera frase impactante...",
      "disparador": "Curiosidad | Miedo | Esperanza | Indignación | Sorpresa",
      "tipo_cierre": "pregunta | cta_link | reflexion | oferta | autoridad",
      "refuerza_mecanismo": true
    }
  ]
}`;
};

// ==================================================================================
// 📝 PROMPT COPY EXPERT V400 - TRADUCTOR COGNITIVO MULTIPLATAFORMA
// ==================================================================================
// ✅ Adaptación estratégica por RED SOCIAL + FORMATO
// ✅ Sistema de validación interna (6 checks)
// ✅ Sugerencias inteligentes automáticas
// ✅ Coherencia con Avatar, Experto y Base de Conocimiento
// ✅ Compatible con inputs: Texto / Video Transcrito / URL
// ==================================================================================

interface CopyExpertSettings {
  red_social: string;        // TikTok, Instagram, YouTube, LinkedIn, Facebook, X
  formato: string;            // Video, Post, Carrusel, Hilo
  objetivo: string;           // Educar, Inspirar, Persuadir, Entretener, Romper Objeciones
  tipo_contenido?: string;    // Guion de video, Caption, Idea, Borrador
}

// ==================================================================================
// 🧬 MATRIZ DE ADAPTACIÓN POR PLATAFORMA (DNA NATIVO)
// ==================================================================================

const PLATFORM_PSYCHOLOGY: Record<string, any> = {
  'TikTok': {
    comportamiento: 'Exploración caótica - Scroll frenético',
    por_que_consume: 'Entretenimiento / Aprendizaje rápido / Identificación',
    que_lo_detiene: 'Shock / Curiosidad extrema / Humor inesperado',
    lenguaje: 'Crudo, directo, sin filtros, slang de internet',
    tono: 'Auténtico, sin pulir, como habla un amigo',
    estructura_caption: 'Hook (1 línea) + Intriga (2-3 líneas) + CTA implícito',
    cta_esperado: 'Comentar / Compartir / Guardar',
    longitud_ideal: '50-150 caracteres (caption minimalista)',
    prohibiciones: ['Presentaciones formales', 'Lenguaje corporativo', 'CTAs de venta directa'],
    ejemplos: [
      'Esto te está haciendo invisible en [nicho] y nadie te lo dice 👀',
      'Si haces esto en [tema], nunca vas a crecer (guardalo)',
      'POV: Descubriste el secreto que [avatar] necesita'
    ]
  },
  
  'Instagram': {
    comportamiento: 'Identidad / Estatus / Aspiración',
    por_que_consume: 'Inspiración / Pertenencia / Descubrimiento',
    que_lo_detiene: 'Estética + Empatía + Frases compartibles',
    lenguaje: 'Aspiracional, elegante, emocional pero accesible',
    tono: 'Humano, cercano, cálido, con propósito',
    estructura_caption: 'Hook emocional + Historia/Contexto + Insight + CTA suave',
    cta_esperado: 'Guardar / Compartir / Enviar a alguien',
    longitud_ideal: '150-300 caracteres (caption medio)',
    prohibiciones: ['Agresividad', 'Clickbait burdo', 'Venta descarada'],
    ejemplos: [
      'La diferencia entre [A] y [B] no es el talento. Es esto ↓',
      'Si supieras esto sobre [tema] hace 5 años, hoy serías otra persona.',
      'Para los que entienden que [nicho] no es suerte, sino estrategia.'
    ]
  },
  
  'Facebook': {
    comportamiento: 'Comunidad / Conversación / Comprensión',
    por_que_consume: 'Conexión / Aprender / Debate',
    que_lo_detiene: 'Historias humanas + Preguntas + Opiniones',
    lenguaje: 'Conversacional, explicativo, como hablar con un vecino',
    tono: 'Cálido, comprensivo, sin pretensiones',
    estructura_caption: 'Historia/Pregunta + Desarrollo + Reflexión + Invitación',
    cta_esperado: 'Comentar opiniones / Etiquetar amigos / Compartir',
    longitud_ideal: '200-400 caracteres (caption largo permitido)',
    prohibiciones: ['Lenguaje frío', 'Tecnicismos sin explicar', 'Venta agresiva'],
    ejemplos: [
      'Hace unos años me preguntaba por qué [dolor]. Hoy entiendo que...',
      '¿Alguna vez te pasó que [situación]? Te cuento qué aprendí.',
      'Esto es para los que [descripción avatar]. Si te identificas, lee.'
    ]
  },
  
  'YouTube': {
    comportamiento: 'Intención clara / Profundidad / Valor',
    por_que_consume: 'Aprender algo específico / Tutorial / Entretenimiento largo',
    que_lo_detiene: 'Promesa cumplida + Claridad + Profundidad real',
    lenguaje: 'Claro, estructurado, profesional pero accesible',
    tono: 'Educativo, seguro, sin humo',
    estructura_caption: 'Promesa clara + Qué aprenderán + Contexto + Timestamps + CTA',
    cta_esperado: 'Suscribirse / Ver video completo / Comentar dudas',
    longitud_ideal: '300-500 caracteres (descripción completa)',
    prohibiciones: ['Clickbait sin entrega', 'Promesas exageradas', 'Falta de estructura'],
    ejemplos: [
      'En este video descubrirás exactamente cómo [resultado] en [tiempo]. Sin humo.',
      'Los 3 pasos que nadie te enseña sobre [tema]. Con ejemplos reales.',
      'Si quieres dominar [nicho], este es el método que funciona. Timestamps ↓'
    ]
  },
  
  'LinkedIn': {
    comportamiento: 'Autoridad / Networking / Crecimiento profesional',
    por_que_consume: 'Insights de negocio / Lecciones / Conexiones',
    que_lo_detiene: 'Ideas inteligentes + Experiencia + Pensamiento original',
    lenguaje: 'Profesional, preciso, ejecutivo pero humano',
    tono: 'Seguro, reflexivo, sin exageración emocional',
    estructura_caption: 'Afirmación fuerte + Contexto profesional + Insight + Reflexión',
    cta_esperado: 'Comentar opinión / Conectar / Repostear',
    longitud_ideal: '200-400 caracteres (post medio-largo)',
    prohibiciones: ['Lenguaje coloquial', 'Humor forzado', 'Clickbait emocional'],
    ejemplos: [
      'Después de 10 años en [industria], descubrí que [insight contraintuitivo].',
      'El 95% de [profesión] ignora esto: [verdad incómoda].',
      'Trabajé con 200+ empresas en [nicho]. Este es el patrón que siempre veo.'
    ]
  },
  
  'X': {
    comportamiento: 'Opinión / Debate / Actualidad',
    por_que_consume: 'Noticias / Hot takes / Comunidad',
    que_lo_detiene: 'Opiniones afiladas + Controversia + Humor inteligente',
    lenguaje: 'Directo, afilado, sin rodeos',
    tono: 'Seguro, a veces irónico, siempre claro',
    estructura_caption: 'Afirmación polémica + Razón/Dato + (Opcional) Thread',
    cta_esperado: 'Debate / RT con opinión / Quote tweet',
    longitud_ideal: '100-280 caracteres (tweet completo)',
    prohibiciones: ['Vaguedad', 'Neutralidad excesiva', 'Falta de postura'],
    ejemplos: [
      'Hot take: [opinión controversial] y aquí está por qué →',
      'Todos hablan de [tema], pero nadie menciona [verdad incómoda].',
      'Si aún crees que [creencia común], te estás saboteando. Thread:'
    ]
  }
};

// ==================================================================================
// 📋 MATRIZ DE FORMATOS (ESTRUCTURA ESPECÍFICA)
// ==================================================================================

const FORMAT_STRUCTURES: Record<string, any> = {
  'Video': {
    funcion_copy: 'Reforzar el hook hablado sin repetirlo',
    estructura: 'Hook textual (1 línea) + Promesa/Intriga (2-3 líneas) + CTA visual',
    reglas: [
      'NO repetir exactamente lo que se dice en el video',
      'Complementar, no competir con el audio',
      'Agregar contexto o curiosidad adicional',
      'Hook textual debe funcionar SIN sonido'
    ],
    ejemplo: 'Video: "Hoy te enseño X" → Caption: "El método que cambió mi [resultado] ↓"'
  },
  
  'Post': {
    funcion_copy: 'El texto ES el contenido principal',
    estructura: 'Hook completo + Desarrollo narrativo + Insight/Lección + CTA',
    reglas: [
      'Debe funcionar como pieza standalone',
      'Narrativa propia y completa',
      'Saltos de línea estratégicos para lectura',
      'Puede ser largo si aporta valor'
    ],
    ejemplo: 'Historia completa con inicio, desarrollo, lección y llamado a la acción'
  },
  
  'Carrusel': {
    funcion_copy: 'Introducir la historia SIN spoilear',
    estructura: 'Hook curiosidad + "Desliza para ver..." + CTA al final',
    reglas: [
      'NO revelar el contenido de los slides',
      'Generar curiosidad para deslizar',
      'Caption corto (el contenido está en slides)',
      'CTA al final para engagement'
    ],
    ejemplo: 'Los 5 errores que [avatar] comete en [tema]. Desliza para descubrirlos ↓'
  },
  
  'Hilo': {
    funcion_copy: 'Progresión lógica con micro-loops',
    estructura: 'Tweet inicial (gancho) + Tweets desarrollo + Cierre fuerte',
    reglas: [
      'Cada tweet debe funcionar solo pero conectar con el siguiente',
      'Micro-loops: "Pero espera, hay más..."',
      'Numeración clara (1/10, 2/10...)',
      'Cierre con CTA o reflexión poderosa'
    ],
    ejemplo: '1/ El secreto de [tema] que nadie te dice:\n\n2/ Primero, entiende esto...'
  }
};

// ==================================================================================
// 🎯 PROMPT MAESTRO V400
// ==================================================================================

const PROMPT_COPY_EXPERT_V400 = (
  contenidoOriginal: string,
  contexto: ContextoUsuario,
  settings: CopyExpertSettings
) => {
  
  const redSocial = settings.red_social || 'TikTok';
  const formato = settings.formato || 'Video';
  const objetivo = settings.objetivo || 'Educar / Valor';
  
  const platformDNA = PLATFORM_PSYCHOLOGY[redSocial] || PLATFORM_PSYCHOLOGY['TikTok'];
  const formatRules = FORMAT_STRUCTURES[formato] || FORMAT_STRUCTURES['Video'];
  
  const expertLevel = contexto.expertProfile?.authority_level || 'practicante';
  const expertLanguage = getExpertLanguage(expertLevel);

  // 👇 AQUÍ AGREGAS LA LÍNEA NUEVA:
  const strategy = getCopyStrategy(objetivo);
  
  return `
═════════════════════════════════════════════════════════════════════════════
📝 COPY EXPERT V400 - TRADUCTOR COGNITIVO MULTIPLATAFORMA
═════════════════════════════════════════════════════════════════════════════

⚠️ TU IDENTIDAD REAL:

NO ERES un "generador de captions bonitos".
NO ERES un "reescritor automático".

ERES: El mejor Copywriter senior + Estratega digital + Traductor de guiones del mundo.

TU MISIÓN SUPREMA:
Traducir UN MENSAJE CENTRAL a la psicología de CADA PLATAFORMA, al FORMATO ESPECÍFICO, y al OBJETIVO ESTRATÉGICO, sin romper coherencia, autoridad ni promesa.

🔑 LEY SUPREMA (PRINCIPIO FUNDACIONAL):
El copy NO es texto.
El copy ES una capa estratégica de TRADUCCIÓN COGNITIVA.

Si esta ley no se cumple → la función FRACASA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONTEXTO DE TRADUCCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RED SOCIAL DESTINO: ${redSocial.toUpperCase()}

PSICOLOGÍA DE LA PLATAFORMA:
• Comportamiento: ${platformDNA.comportamiento}
• Por qué consumen: ${platformDNA.por_que_consume}
• Qué los detiene: ${platformDNA.que_lo_detiene}
• Lenguaje esperado: ${platformDNA.lenguaje}
• Tono ideal: ${platformDNA.tono}
• Longitud ideal: ${platformDNA.longitud_ideal}

REGLAS ESPECÍFICAS DE ${redSocial}:
• Estructura: ${platformDNA.estructura_caption}
• CTA esperado: ${platformDNA.cta_esperado}

⛔ PROHIBIDO EN ${redSocial}:
${platformDNA.prohibiciones.map((p: string) => `• ${p}`).join('\n')}

📐 FORMATO ESPECÍFICO: ${formato.toUpperCase()}

FUNCIÓN DEL COPY:
${formatRules.funcion_copy}

ESTRUCTURA OBLIGATORIA:
${formatRules.estructura}

REGLAS DEL FORMATO:
${formatRules.reglas.map((r: string) => `• ${r}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTEXTO DEL CREADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NICHO: ${contexto.nicho || 'General'}

AVATAR IDEAL (A quién le hablas):
• Nombre: ${contexto.avatar_ideal || 'Audiencia general'}
• Dolor Principal: ${contexto.dolor_principal || 'N/A'}
• Deseo Principal: ${contexto.deseo_principal || 'N/A'}

EXPERTO (Desde qué posición hablas):
- Nivel de Autoridad: ${expertLevel}
- Tipo de Autoridad: ${contexto.expertProfile?.authority_type || 'practica'}
- Lenguaje esperado: ${expertLanguage}
- Objetivo de Contenido: ${contexto.expertProfile?.main_objective || 'autoridad'}
- Ritmo Narrativo: ${contexto.expertProfile?.narrative_rhythm || 'medio'}
- Agresividad Verbal: ${contexto.expertProfile?.verbal_aggressiveness ?? 2}/5
- Sofisticación Léxica: ${contexto.expertProfile?.lexical_sophistication ?? 3}/5
- Ratio Storytelling: ${contexto.expertProfile?.storytelling_ratio ?? 50}% narrativa / ${100 - (contexto.expertProfile?.storytelling_ratio ?? 50)}% enseñanza directa
${contexto.expertProfile?.enemy ? `• Enemigo Común: "${contexto.expertProfile.enemy}"` : ''}
${contexto.expertProfile?.transformation_promise ? `• Promesa Diferencial: "${contexto.expertProfile.transformation_promise}"` : ''}
${contexto.expertProfile?.mechanism_name ? `• Mecanismo Propietario: "${contexto.expertProfile.mechanism_name}"` : ''}

${(() => {
  try {
    const nc = typeof contexto.expertProfile?.network_config === 'string'
      ? JSON.parse(contexto.expertProfile.network_config)
      : (contexto.expertProfile?.network_config || {});
    const redKey = redSocial.toLowerCase();
    const override = nc[redKey];
    if (override && Object.values(override).some((v: any) => v !== 'auto')) {
      return `⚙️ OVERRIDE PARA ${redSocial.toUpperCase()}:
${override.tone !== 'auto' ? `• Tono específico: ${override.tone}` : ''}
${override.depth !== 'auto' ? `• Profundidad específica: ${override.depth}` : ''}
${override.aggressiveness !== 'auto' ? `• Agresividad específica: ${override.aggressiveness}` : ''}
${override.close_type !== 'auto' ? `• Tipo de cierre: ${override.close_type}` : ''}
⚠️ Esta configuración de red PREVALECE sobre los defaults del experto.`;
    }
  } catch {}
  return '';
})()}

${(contexto as any).expertProfile && !(() => {
  try {
    const nc = typeof (contexto as any).expertProfile.network_config === 'string'
      ? JSON.parse((contexto as any).expertProfile.network_config)
      : ((contexto as any).expertProfile.network_config || {});
    const cfg = nc[redSocial.toLowerCase()];
    return cfg && Object.values(cfg).some((v: any) => v !== 'auto');
  } catch { return false; }
})() ? ExpertAuthoritySystem.getNetworkOverride(
  (contexto as any).expertProfile,
  redSocial.toLowerCase()
) : ''}

${contexto.knowledge_base_content ? `
📚 BASE DE CONOCIMIENTO DISPONIBLE:
"${contexto.knowledge_base_content.substring(0, 800)}..."
⚠️ Usa ESTE conocimiento como referencia de autoridad.
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONTENIDO ORIGINAL A TRADUCIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPO DE INPUT: ${settings.tipo_contenido || 'Contenido sin clasificar'}

CONTENIDO:
${contenidoOriginal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO ESTRATÉGICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJETIVO SELECCIONADO: "${objetivo}"

${getObjetivoStrategy(objetivo)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PIPELINE DE TRADUCCIÓN (PASO A PASO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO 1 - LECTURA PROFUNDA:
• Identifica el MENSAJE CENTRAL del contenido original
• Detecta la ESTRUCTURA NARRATIVA usada
• Clasifica el TIPO DE CONTENIDO (Educativo/Storytelling/Ventas/Autoridad)

PASO 2 - TRADUCCIÓN COGNITIVA:
• Adapta el mensaje a la PSICOLOGÍA de ${redSocial}
• Ajusta el TONO al lenguaje nativo de la plataforma
• Reescribe usando las REGLAS del formato ${formato}

PASO 3 - OPTIMIZACIÓN:
• Agrega HOOK textual poderoso (específico de ${redSocial})
• Inserta CTA NATURAL (no forzado)
• Valida COHERENCIA con Avatar y Experto

PASO 4 - VALIDACIÓN INTERNA (CRÍTICO):
Antes de entregar, DEBES VERIFICAR:

✅ ¿Refuerza el mensaje del contenido original?
✅ ¿Cumple el objetivo "${objetivo}"?
✅ ¿Respeta el dolor/deseo del avatar?
✅ ¿Usa el lenguaje de autoridad del experto?
✅ ¿Tiene hook textual específico de ${redSocial}?
✅ ¿Tiene CTA natural (no genérico)?
✅ ¿NO suena a IA o plantilla genérica?

Si CUALQUIERA falla → REESCRIBE hasta que funcione.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 SUGERENCIAS INTELIGENTES (AUTOMÁTICAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes analizar si:

1. MEJOR RED SOCIAL:
   ¿Este contenido funcionaría MEJOR en otra plataforma?
   Si sí → Sugerir cuál y por qué.

2. MEJOR FORMATO:
   ¿Debería ser Carrusel en vez de Video? ¿Hilo en vez de Post?
   Si sí → Explicar la razón.

3. RIESGOS DE INCOHERENCIA:
   ¿El copy contradice el contenido del video/guion?
   ¿El tono no coincide con el nivel de autoridad del experto?
   Si sí → Advertir explícitamente.

4. OPORTUNIDADES DE DEBATE:
   ¿Hay alguna frase que pueda generar comentarios/controversia sana?
   Si sí → Señalarla como oportunidad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 FORMATO DE SALIDA JSON (EXACTO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Responde SOLO con este JSON válido (sin markdown, sin explicaciones antes/después):

{
  "analisis_contenido": {
    "mensaje_central": "Descripción del mensaje principal detectado",
    "tipo_contenido": "Educativo/Storytelling/Ventas/Autoridad",
    "estructura_detectada": "PAS/AIDA/Storytelling/etc",
    "tono_original": "Descripción del tono usado"
  },

  "copy_principal": {
    "texto": "EL COPY OPTIMIZADO COMPLETO PARA ${redSocial} (Formato: ${formato})",
    "longitud_caracteres": 0,
    "hook_textual": "Primera línea o frase gancho",
    "cta_usado": "El call to action específico"
  },

  "variantes_alternativas": [
    {
      "version": "Variante 1 - Más [adjetivo]",
      "texto": "Copy alternativo con diferente ángulo",
      "por_que_funciona": "Razón estratégica de esta variante"
    },
    {
      "version": "Variante 2 - Más [adjetivo]",
      "texto": "Otra variante",
      "por_que_funciona": "Razón estratégica"
    }
  ],

  "validacion_interna": {
    "refuerza_mensaje": true,
    "cumple_objetivo": true,
    "respeta_avatar": true,
    "respeta_experto": true,
    "tiene_hook": true,
    "cta_natural": true,
    "no_suena_ia": true,
    "score_calidad": 0,
    "razon_score": "Explicación del puntaje (0-100)"
  },

  "sugerencias_inteligentes": {
    "mejor_red_social": "${redSocial} / Otra (si aplica)",
    "razon_red": "Por qué esta red es mejor o por qué cambiar",
    "mejor_formato": "${formato} / Otro (si aplica)",
    "razon_formato": "Por qué este formato es mejor o por qué cambiar",
    "riesgos_detectados": ["Riesgo 1 si hay", "Riesgo 2 si hay"],
    "oportunidades_debate": ["Frase polémica 1", "Frase polémica 2"],
    "nivel_coherencia": "Alta/Media/Baja"
  },

  "metadata": {
    "red_social": "${redSocial}",
    "formato": "${formato}",
    "objetivo": "${objetivo}",
    "nicho": "${contexto.nicho}",
    "longitud_original": ${contenidoOriginal.length},
    "longitud_final": 0,
    "reduccion_porcentaje": "X%"
  },

  "siguiente_paso_sugerido": "Acción concreta que el usuario debe tomar ahora"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLAS CRÍTICAS FINALES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SÉ NATIVO, NO TRADUCTOR LITERAL:
   ❌ NO: Copiar y pegar con pequeños cambios
   ✅ SÍ: Reescribir pensando como alguien nativo de ${redSocial}

2. SÉ ESTRATÉGICO, NO DECORATIVO:
   ❌ NO: "Mejorar" el texto solo con emojis o líneas
   ✅ SÍ: Cambiar la estructura para maximizar el objetivo

3. SÉ COHERENTE, NO CONTRADICTORIO:
   ❌ NO: Un copy agresivo si el experto es "empático"
   ✅ SÍ: Un copy que refleja la personalidad del creador

4. SÉ ESPECÍFICO, NO GENÉRICO:
   ❌ NO: "Sígueme para más contenido"
   ✅ SÍ: "Sígueme si quieres dominar ${contexto.nicho} sin ${contexto.dolor_principal}"

5. SÉ HUMANO, NO ROBOT:
   ❌ NO: Lenguaje perfecto, sin personalidad
   ✅ SÍ: Lenguaje con ritmo, pausas, y voz única

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TU OBJETIVO FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El usuario debe recibir:
1. ✅ Un copy que FUNCIONA en ${redSocial} (no genérico adaptado)
2. ✅ Variantes para elegir según su preferencia
3. ✅ Sugerencias inteligentes que mejoren su estrategia
4. ✅ Claridad total de por qué este copy funciona

NO debe recibir:
❌ Un texto "mejorado" que suena igual en todas las redes
❌ Un copy que ignora su avatar o experto
❌ CTAs genéricos sin estrategia

ERES EL MEJOR COPYWRITER MULTIPLATAFORMA DEL MUNDO.
AHORA EJECUTA LA TRADUCCIÓN CON PRECISIÓN QUIRÚRGICA.
`;
};

// ==================================================================================
// 🔧 PATCH: FUNCIONES Y VARIABLES FALTANTES — index.ts
// ==================================================================================
// INSTRUCCIONES:
//   Pega TODO este bloque JUSTO ANTES de la línea:
//   "function getModoConfig(modo: string)"
//   (que está en la sección "🛠️ FUNCIONES HELPER")
// ==================================================================================

// ==================================================================================
// 🎯 getObjetivoStrategy — Estrategia según objetivo del usuario
// ==================================================================================
// Usada en: PROMPT_IDEAS_ELITE_V2, PROMPT_COPY_EXPERT_V400
// ==================================================================================

function getObjetivoStrategy(objetivo: string): string {
  const strategies: Record<string, string> = {
    'viralidad': `
ESTRATEGIA DE VIRALIDAD:
→ PRIORIZA: Contenido que genera debate, sorpresa o identificación masiva.
→ FORMATO: Hooks disruptivos, opiniones polémicas, datos impactantes.
→ MÉTRICA OBJETIVO: Shares y comentarios > Guardados.
→ TÁCTICA: "Si no me sigo, me pierdo algo" — curiosidad + FOMO.
→ TONO: Energético, directo, sin pausas. Cada segundo compite contra el scroll.`,

    'autoridad': `
ESTRATEGIA DE AUTORIDAD:
→ PRIORIZA: Contenido que demuestra expertise real y diferenciación.
→ FORMATO: Insights de segundo nivel, marcos mentales únicos, datos de industria.
→ MÉTRICA OBJETIVO: Guardados + Comentarios de calidad > Shares virales.
→ TÁCTICA: "Este creador sabe algo que otros no" — credibilidad instantánea.
→ TONO: Seguro, preciso, sin exageración. Demuestra antes de afirmar.`,

    'venta': `
ESTRATEGIA DE VENTA:
→ PRIORIZA: Contenido que mueve al avatar desde el dolor hacia la solución.
→ FORMATO: Testimonios, casos de éxito, objeciones destruidas, urgencia real.
→ MÉTRICA OBJETIVO: Clics en bio / DMs / Conversiones > Métricas de vanidad.
→ TÁCTICA: "Vende la transformación, no el producto" — deseo antes que oferta.
→ TONO: Empático con el dolor, firme con la solución. Sin hype vacío.`,

    'comunidad': `
ESTRATEGIA DE COMUNIDAD:
→ PRIORIZA: Contenido que genera sentido de pertenencia y tribu.
→ FORMATO: Preguntas, retos, "¿te identificas?", contenido de identidad.
→ MÉTRICA OBJETIVO: Comentarios de tribu + Seguidores fieles > Alcance masivo.
→ TÁCTICA: "Nosotros vs ellos" — crea un in-group exclusivo.
→ TONO: Cercano, inclusivo, como un líder de movimiento.`,

    'posicionamiento': `
ESTRATEGIA DE POSICIONAMIENTO:
→ PRIORIZA: Contenido que establece tu territorio mental único en el nicho.
→ FORMATO: Opiniones contrastantes, nuevos marcos de referencia, conceptos propios.
→ MÉTRICA OBJETIVO: Reconocimiento de marca + Búsquedas directas.
→ TÁCTICA: "Ocupa un espacio mental que nadie más tiene" — sé el primero en algo.
→ TONO: Distintivo, con voz única. Diferente por diseño, no por accidente.`,
  };

  return strategies[objetivo?.toLowerCase()] || strategies['viralidad'];
}

// ==================================================================================
// ⏰ getTimingStrategy — Estrategia según contexto temporal
// ==================================================================================
// Usada en: PROMPT_IDEAS_ELITE_V2
// ==================================================================================

function getTimingStrategy(timing: string): string {
  const strategies: Record<string, string> = {
    'evergreen': `
TIMING EVERGREEN (Sin fecha de caducidad):
→ Contenido que funciona hoy, en 6 meses y en 2 años.
→ Temáticas: Dolores eternos del nicho, principios fundamentales, verdades profundas.
→ Ventaja: Acumula vistas a lo largo del tiempo (efecto bola de nieve).
→ Señal: No incluyas referencias a fechas, eventos o tendencias actuales.`,

    'trending': `
TIMING TRENDING (Ahora o nunca):
→ Capitaliza una conversación que YA está activa en la cultura pop o el nicho.
→ URGENCIA: Este contenido tiene ventana de 48-72 horas máximo.
→ Táctica: Conecta el trending con el nicho del usuario de forma inesperada.
→ Señal: Incluye la tendencia en el hook para activar el algoritmo ahora.`,

    'seasonal': `
TIMING ESTACIONAL (Evento o temporada específica):
→ Contenido diseñado para un momento predecible del año (Q1, verano, navidad, etc.).
→ Ventaja: Alta intención de búsqueda y consumo en ese período.
→ Táctica: Publicar 1-2 semanas ANTES del pico para capturar el ascenso.
→ Señal: El hook debe incluir la referencia temporal como gancho de relevancia.`,

    'launch': `
TIMING DE LANZAMIENTO (Producto/Servicio/Evento propio):
→ Contenido que caliente a la audiencia ANTES de la oferta principal.
→ Secuencia: Problema → Solución parcial → Presentación de la solución completa.
→ Táctica: El contenido de hoy planta la semilla para la venta de mañana.
→ Señal: No hagas venta directa. Genera deseo y anticipación primero.`,

    'tendencia': `
TIMING TENDENCIA ACTUAL (Ahora o nunca):
→ Capitaliza una conversación que YA está activa en la cultura pop o el nicho.
→ URGENCIA: Este contenido tiene ventana de 48-72 horas máximo.
→ Táctica: Conecta el trending con el nicho del usuario de forma inesperada.
→ El hook debe mencionar o implicar la tendencia para activar el algoritmo ahora.
→ Señal: Sin referencias a la tendencia en el hook = perder la ventana.`,

    'reaccion': `
TIMING REACCIÓN RÁPIDA (Respuesta a evento reciente):
→ Algo acaba de pasar en el sector o en el mundo que afecta al avatar.
→ URGENCIA EXTREMA: Ventana de 24 horas antes de que todos hablen de lo mismo.
→ Táctica: Ser el primero en dar el ángulo correcto al evento.
→ El formato ideal: "Lo que nadie está diciendo sobre [evento reciente]".
→ Señal: Posicionarse como el experto que interpreta los eventos del sector.`,

    'momentum': `
TIMING MOMENTUM PERSONAL (Capitalizar crecimiento propio):
→ El creador está en un momento de crecimiento y debe aprovecharlo.
→ La audiencia nueva necesita contenido que explique quién eres y por qué seguirte.
→ Táctica: Contenido que convierta visitantes ocasionales en seguidores leales.
→ Formatos ideales: origen + transformación, errores del pasado, detrás de cámaras.
→ Señal: Alta autenticidad. La audiencia nueva conecta con historias reales.`,

    'estacional': `
TIMING ESTACIONAL (Evento o temporada específica):
→ Contenido diseñado para un momento predecible del año.
→ Ventaja: Alta intención de búsqueda y consumo en ese período.
→ Táctica: Publicar 1-2 semanas ANTES del pico para capturar el ascenso.
→ Señal: El hook debe incluir la referencia temporal como gancho de relevancia.`,
  };

  return strategies[timing?.toLowerCase()] || strategies['evergreen'];
}

// ==================================================================================
// 🗣️ getExpertLanguage — Directivas de lenguaje según nivel de autoridad
// ==================================================================================
// Usada en: PROMPT_COPY_EXPERT_V400
// ==================================================================================

function getExpertLanguage(level: string): string {
  const languages: Record<string, string> = {
    'aprendiz': 'Compartir viaje con humildad. "Estoy aprendiendo que..." "Descubrí que..." Sin afirmaciones absolutas.',
    'practicante': 'Experiencia práctica aplicada. "En mi experiencia..." "Lo que funciona es..." Casos reales propios.',
    'experto': 'Maestría y conocimiento profundo. Afirmaciones directas. Datos, sistemas, frameworks propios.',
    'referente': 'Desafía la industria. "La mayoría se equivoca en..." "El estándar actual falla porque..." Pensamiento de segundo nivel.',
  };

  return languages[level?.toLowerCase()] || languages['practicante'];
}

// ==================================================================================
// 📋 getCopyStrategy — Estrategia de copy según objetivo
// ==================================================================================
// Usada en: PROMPT_COPY_EXPERT_V400
// ==================================================================================

function getCopyStrategy(objetivo: string): string {
  const strategies: Record<string, string> = {
    'Educar / Valor': 'Prioriza claridad y utilidad inmediata. El copy debe comunicar el valor concreto que recibirá el espectador.',
    'Inspirar / Motivar': 'Prioriza el impacto emocional. El copy debe generar deseo de acción y pertenencia a algo más grande.',
    'Persuadir / Vender': 'Prioriza la transformación prometida. El copy debe conectar el dolor actual con el resultado deseado.',
    'Entretener / Viralidad': 'Prioriza el gancho y el debate. El copy debe generar curiosidad extrema o polarización sana.',
    'Construir Autoridad': 'Prioriza la credibilidad y la diferenciación. El copy debe posicionar como referente único.',
    'Romper Objeciones': 'Prioriza la empatía con el escepticismo. El copy debe validar la duda antes de destruirla.',
  };

  // Buscar match parcial
  for (const [key, value] of Object.entries(strategies)) {
    if (objetivo?.toLowerCase().includes(key.split(' ')[0].toLowerCase())) {
      return value;
    }
  }

  return strategies['Educar / Valor'];
}

// ==================================================================================
// 📘 scrapeFacebook — Scraper de Facebook con fallback
// ==================================================================================
// Usada en: scrapeAndTranscribeVideo (case 'facebook')
// ==================================================================================

async function scrapeFacebook(url: string): Promise<{
  videoUrl: string;
  description: string;
  duration?: number;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');

  if (!apifyToken) {
    console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado para Facebook');
    return { videoUrl: url, description: '', duration: 0 };
  }

  try {
    console.log('[SCRAPER] 👍 Iniciando scraping de Facebook:', url);
    const { ApifyClient } = await import('npm:apify-client');
    const client = new ApifyClient({ token: apifyToken });

    const run = await client.actor('apify/facebook-posts-scraper').call({
      startUrls: [{ url }],
      resultsLimit: 1,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      console.warn('[SCRAPER] ⚠️ Apify Facebook no devolvió items');
      return { videoUrl: url, description: '', duration: 0 };
    }

    const postData = items[0];

    const transcriptFB = (postData as any).text || (postData as any).message || (postData as any).description || '';
console.log('[SCRAPER] 📝 Transcript Facebook:', transcriptFB.substring(0, 100));

return {
  videoUrl: (postData as any).videoUrl || url,
  description: transcriptFB,
  transcript: transcriptFB,
  detectedLanguage: (postData as any).language || 'auto',
  duration: (postData as any).videoDuration || 0,
};
  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error en Apify Facebook:', error.message);
    return { videoUrl: url, description: '', duration: 0 };
  }
}

// ==================================================================================
// FIN DEL PATCH — Pega esto justo antes de "function getModoConfig"
// ==================================================================================

// ==================================================================================
// 🛠️ FUNCIONES HELPER
// ==================================================================================

function getModoConfig(modo: string) {
  const configs: any = {
    'estricto': {
      descripcion: '🧪 Modo Estricto: Evalúa como estratega senior. Baja tolerancia a errores. Ideal para marca personal top.',
      prioridades: [
        'Autoridad > Viralidad',
        'Credibilidad > Alcance',
        'Coherencia > Riesgo'
      ],
      tolerancia: 'Baja - Estándares profesionales'
    },
    'viral': {
      descripcion: '🚀 Modo Viral: Prioriza alcance masivo. Acepta riesgo. Ideal para crecer rápido.',
      prioridades: [
        'Retención > Autoridad',
        'Shock > Coherencia',
        'Alcance > Credibilidad'
      ],
      tolerancia: 'Alta - Se permiten riesgos calculados'
    },
    'autoridad': {
      descripcion: '🧠 Modo Autoridad: Prioriza posicionamiento. Menos hype, más credibilidad.',
      prioridades: [
        'Expertise > Entretenimiento',
        'Profundidad > Viralidad',
        'Diferenciación > Popularidad'
      ],
      tolerancia: 'Media - Balance entre alcance y credibilidad'
    }
  };
  return configs[modo] || configs['viral'];
}

function getPosicionamientoEsperado(level: string) {
  const positioning: any = {
    'aprendiz': 'Comparte su viaje de aprendizaje con humildad',
    'practicante': 'Demuestra experiencia práctica aplicada',
    'experto': 'Exhibe maestría y conocimiento profundo',
    'referente': 'Desafía industria, lidera pensamiento'
  };
  return positioning[level] || positioning['practicante'];
}

function getPlataformaRules(plataforma: string) {
  const rules: any = {
    'TikTok': `
✅ Hook violento (primeros 2s)
✅ Ritmo rápido (cortes cada 2-3s)
✅ Texto en pantalla obligatorio
✅ Loops constantes
✅ Duración: 15-60s ideal
✅ Tono: Directo, sin contexto largo

❌ Introucciones largas
❌ Ritmo lento
❌ Demasiada profundidad
`,
    'Instagram': `
✅ Estética visual cuidada
✅ Hook elegante o aspiracional
✅ Tono humano y relatable
✅ Frase guardable/compartible
✅ Duración: 30-90s ideal
✅ CTA emocional sutil

❌ Velocidad agresiva
❌ Cambios bruscos
❌ Falta de cohesión visual
`,
    'YouTube': `
✅ Promesa clara desde el inicio
✅ Profundidad permitida
✅ Estructura lógica
✅ Valor real entregado
✅ Duración: Variable según promesa
✅ CTA al final

❌ Clickbait sin entrega
❌ Falta de claridad
❌ Ritmo demasiado rápido
`,
    'LinkedIn': `
✅ Tono profesional
✅ Insights de negocio
✅ Lenguaje preciso
✅ Credibilidad > Entretenimiento
✅ Duración: 30-120s
✅ CTA reflexivo

❌ Exageración emocional
❌ Hype sin sustancia
❌ Tono informal excesivo
`,
'Facebook': `
✅ Hook narrativo o pregunta relatable
✅ Tono conversacional y humano
✅ Subtítulos obligatorios
✅ Profundidad permitida
✅ Pregunta debate al final
✅ Duración: 60s - 3min

❌ Ritmo agresivo de TikTok
❌ Lenguaje de influencer
❌ Venta directa agresiva
❌ Múltiples CTAs
`
  };
  return rules[plataforma] || rules['TikTok'];
}

// ✅ PEGA LA FUNCIÓN AQUÍ (Justo antes del serve)
function detectContentType(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes("paso 1") || lower.includes("tip #1") || lower.includes("cómo hacer")) return "Educativo";
  if (lower.includes("historia") || lower.includes("me pasó") || lower.includes("cuando")) return "Storytelling";
  if (lower.includes("oferta") || lower.includes("descuento") || lower.includes("compra")) return "Ventas";
  if (lower.includes("verdad") || lower.includes("mentira") || lower.includes("opinión")) return "Autoridad";
  return "Contenido General";
}

// ==================================================================================
// ⭐ FUNCIONES EJECUTORAS (ANTES DEL SERVE - POSICIÓN CORRECTA)
// ==================================================================================

async function ejecutarIdeasRapidas(
  topic: string,
  quantity: number,
  platform: string,
  contexto: any,
  openai: any,
  settings: any = {} // Aquí vienen objective y timing desde el frontend
): Promise<{ data: any; tokens: number }> {
  
  // 1. Extraer variables (con defaults por seguridad)
  const objective = settings.objective || 'viralidad';
  const timing = settings.timing_context || 'evergreen';
  const isMultiplatform = settings.multiplatform === true;

  console.log(`[CEREBRO V2] 🎯 Generando Ideas | Modo: ${isMultiplatform ? 'MULTIPLATAFORMA' : platform} | Objetivo: ${objective} | Timing: ${timing}`);

  // 2. Generar el Prompt según el modo
  const prompt = isMultiplatform
    ? PROMPT_IDEAS_MULTIPLATFORMA(
        topic,
        quantity,
        objective,
        timing,
        contexto,
        settings
      )
    : PROMPT_IDEAS_ELITE_V2(
        topic,
        quantity,
        platform,
        objective,
        timing,
        contexto,
        settings
      );

  // 3. Llamar a OpenAI
  try {
    const isMultiplatformMode = settings?.multiplatform === true;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { 
          role: 'system', 
          content: isMultiplatformMode
            ? 'Eres el Sistema de Dominación Multiplataforma #1. Tu salida es SIEMPRE un JSON válido y COMPLETO. NUNCA truncues el JSON. NUNCA cortes a mitad de una propiedad. Si necesitas reducir contenido, acorta los textos pero SIEMPRE cierra correctamente todos los objetos y arrays del JSON.'
            : 'Eres el Consultor Estratégico de Contenido Digital #1. Tu salida es SIEMPRE en formato JSON válido.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: isMultiplatformMode ? 0.75 : 0.8,
      max_tokens: isMultiplatformMode ? 6000 : 4000
    });

     // 4. Parsear respuesta con limpieza robusta
    const rawContent = completion.choices[0].message.content || '{"ideas":[]}';
    
    let parsedData: any = { ideas: [] };
    try {
      // Intento 1: parseo directo
      parsedData = JSON.parse(rawContent);
    } catch (e1) {
      console.warn('[IDEAS IMPERIO] ⚠️ JSON directo falló, aplicando limpieza...');
      try {
        // Intento 2: limpiar y reintentar
        const cleaned = rawContent
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
          .trim();
        parsedData = JSON.parse(cleaned);
        console.log('[IDEAS IMPERIO] ✅ JSON limpiado exitosamente');
      } catch (e2) {
        console.error('[IDEAS IMPERIO] ❌ JSON irrecuperable, extrayendo con regex...');
        // Intento 3: extraer el objeto JSON con regex
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsedData = JSON.parse(match[0]);
            console.log('[IDEAS IMPERIO] ✅ JSON extraído con regex');
          } catch (e3) {
            console.error('[IDEAS IMPERIO] ❌ Fallo total en parseo:', e3);
            parsedData = { ideas: [], error: 'Error procesando respuesta. Intenta de nuevo.' };
          }
        }
      }
    }

    // 5. Filtro de seguridad — eliminar ideas con score < 70
    if (Array.isArray(parsedData.ideas)) {
      const antes = parsedData.ideas.length;
      parsedData.ideas = parsedData.ideas.filter((idea: any) => {
        const score = idea.tca?.mass_appeal_score || idea.potencial_viral * 10 || 0;
        return score >= 70;
      });
      const eliminadas = antes - parsedData.ideas.length;
      if (eliminadas > 0) {
        console.warn(`[IDEAS IMPERIO] ⚠️ ${eliminadas} idea(s) eliminada(s) por score < 70`);
      }
      const modo = settings.multiplatform ? 'MULTIPLATAFORMA' : platform;
    console.log(`[IDEAS IMPERIO] ✅ ${parsedData.ideas.length} ideas aprobadas | Modo: ${modo}`);
    }

    return {
      data: parsedData,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error("[ERROR CRÍTICO] Fallo en ejecutarIdeasRapidas:", error);
    // Devolver estructura de error segura
    return {
      data: { 
        ideas: [], 
        error: "Hubo un error generando las ideas estratégicas. Intenta de nuevo." 
      },
      tokens: 0
    };
  }
}

// ==================================================================================
// 🌐 EJECUTAR UNA SOLA IDEA MULTIPLATAFORMA — Arquitectura anti-truncado
// ==================================================================================
async function ejecutarUnaIdeaMultiplatforma(
  topic: string,
  ideaIndex: number,
  totalIdeas: number,
  objective: string,
  timing: string,
  contexto: any,
  openai: any,
  settings: any = {}
): Promise<{ idea: any; tokens: number }> {

  const lensId   = settings.creative_lens || 'auto';
  const lensData = CREATIVE_LENSES[lensId] || CREATIVE_LENSES['auto'];
  const nicho    = settings.nicho || contexto.nicho || 'General';

  const frames = [
    'CONFRONTATIVO', 'REVELACIÓN', 'CONTRAINTUITIVO', 'FILOSÓFICO',
    'ESTRATÉGICO', 'HISTORIA_IMPLÍCITA', 'COMPARATIVO',
    'SISTEMA_ROTO', 'ADVERTENCIA', 'OPORTUNIDAD_INVISIBLE'
  ];
  const angulos = [
    'Psicológico', 'Económico', 'Identidad', 'Estatus', 'Riesgo',
    'Futuro', 'Sistema roto', 'Cultural', 'Moral', 'Filosófico'
  ];
  const frameAsignado  = frames[ideaIndex % frames.length];
  const anguloAsignado = angulos[ideaIndex % angulos.length];

  const objetivoStrategy = getObjetivoStrategy(objective);
  const timingStrategy   = getTimingStrategy(timing);

  const puntoA   = contexto.expertProfile?.point_a   ? `- Punto A: "${contexto.expertProfile.point_a}"`   : '';
  const puntoB   = contexto.expertProfile?.point_b   ? `- Punto B: "${contexto.expertProfile.point_b}"`   : '';
  const kbText   = contexto.knowledge_base_content   ? `BASE DE CONOCIMIENTO: "${contexto.knowledge_base_content.substring(0, 500)}..."\n⚠️ Usa ESTE conocimiento. No inventes contenido genérico.` : '';

  const promptUnica = [
    '═══════════════════════════════════════════════════════════════════════════',
    `🌐 IDEA MULTIPLATAFORMA ${ideaIndex + 1} DE ${totalIdeas} — DOMINACIÓN TOTAL`,
    '═══════════════════════════════════════════════════════════════════════════',
    '',
    '⚠️ TU IDENTIDAD:',
    'Eres el Sistema de Dominación Multiplataforma #1 del mundo.',
    'Generas EXACTAMENTE 1 idea con 5 adaptaciones que explotan el algoritmo',
    'de cada red social de forma radicalmente distinta.',
    '',
    `FRAME OBLIGATORIO: ${frameAsignado}`,
    `ÁNGULO ESTRATÉGICO OBLIGATORIO: ${anguloAsignado}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🧠 REGLA #1 — COHERENCIA TEMÁTICA ESTRICTA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `TEMA DEL USUARIO: "${topic}"`,
    `NICHO: "${nicho}"`,
    '',
    '⚠️ CRÍTICO: La idea DEBE nacer del tema y nicho del usuario.',
    'Si el tema es "vender conocimiento" → la idea es sobre VENDER CONOCIMIENTO.',
    'Si el tema es "marca personal" → la idea es sobre MARCA PERSONAL.',
    'PROHIBIDO: Meter IA, tecnología u otros temas externos',
    'a menos que el usuario lo haya mencionado explícitamente.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🚫 ANTI-CLICHÉS ABSOLUTO — PROHIBIDO en título y hooks:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'X "Lo que nadie te dice..." X "El error que cometes..."',
    'X "La verdad sobre..." X "3 secretos para..."',
    'X "La revelación que cambiará..." X "El mito de..."',
    'X "Rompe el mito..." X "El 90%..." X "Destruyendo mitos..."',
    'X "El futuro de..." (sin postura específica)',
    '',
    'REFORMULACIÓN OBLIGATORIA:',
    'X "El mito del conocimiento" → OK "Vendiste tu conocimiento. Vendiste tu trampa."',
    'X "La verdad sobre vender" → OK "Vender lo que sabes cuesta más de lo que crees"',
    'X "Rompe el mito digital" → OK "Digitalizarte no te libera. Te reemplaza."',
    '',
    'REGLA: Si el título puede decirlo CUALQUIER creador de marketing → RECHAZAR.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🧨 POSTURA DOMINANTE OBLIGATORIA (4 elementos):',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '[ ] Creencia falsa específica del nicho que destruye',
    '[ ] Enemigo implícito concreto responsable',
    '[ ] Nuevo marco mental superior del experto',
    '[ ] Solo este experto puede decir esto',
    '',
    'Postura expresada DISTINTO por plataforma:',
    '→ TikTok: agresiva, sin filtro, ataque en 3 palabras',
    '→ Reels: aspiracional, elegante, identitaria',
    '→ YouTube: analítica, con evidencia implícita',
    '→ LinkedIn: autoridad, medida pero firme',
    '→ Facebook: conversacional, accesible, genera debate',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '⚙️ MOTOR TCA — EXPANSIÓN MASIVA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Posicionar en intersección N2-N3.',
    'N1 = micronicho técnico → PROHIBIDO',
    'N2 = temática principal del sector → VÁLIDO',
    'N3 = sector masivo universal → VÁLIDO',
    '',
    'SECTORES: Dinero/Negocios | Desarrollo Personal | Trabajo/Carrera | Salud | Relaciones',
    'INTERSECCIÓN: tema_usuario + dolor_avatar + sector_masivo',
    'mass_appeal_score MÍNIMO: 75',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `🎭 LENTE CREATIVO: ${lensData.label}`,
    `"${lensData.instruction}"`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🌍 ADN ESTRICTO POR PLATAFORMA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'TikTok:',
    '→ Hook: MÁXIMO 4 palabras — shock en 0.5s',
    '→ Ejemplos: "Vendiste tu talento." / "Estás trabajando gratis." / "Nadie te compra."',
    '→ PROHIBIDO: frases largas, contexto previo, tono amable',
    '→ nivel_polarizacion >= 65 OBLIGATORIO',
    '',
    'Reels:',
    '→ Hook: aspiracional tribal elegante — máx 8 palabras',
    '→ Ejemplos: "Las personas que cobran lo que valen hacen esto." / "Tu conocimiento merece más."',
    '→ PROHIBIDO: agresividad excesiva, shock sin elegancia',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    'YouTube:',
    '→ Hook: gap informativo — curiosidad irresistible',
    '→ Ejemplos: "Hay una razón por la que los expertos con más conocimiento ganan menos."',
    '→ PROHIBIDO: spoilers, hooks vagos, repetir título',
    '→ nivel_polarizacion >= 55 OBLIGATORIO',
    '',
    'LinkedIn:',
    '→ Hook: tesis profesional provocadora',
    '→ Ejemplos: "Llevas 10 años acumulando experiencia. Y sigues cobrando como junior."',
    '→ PROHIBIDO: emotividad excesiva, slang',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    'Facebook:',
    '→ Hook: pregunta que divide opiniones O situación cotidiana relatable',
    '→ Ejemplos: "¿Cuánto tiempo llevas pensando en cobrar por lo que sabes y sin hacerlo?"',
    '→ PROHIBIDO: shock agresivo, jerga de internet',
    '→ nivel_polarizacion >= 50 OBLIGATORIO',
    '',
    '⚠️ El hook de TikTok y Facebook NUNCA pueden ser similares.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '👤 PERFIL DEL SISTEMA',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'EXPERTO:',
    `- Posicionamiento: ${contexto.expertProfile?.unique_positioning || contexto.posicionamiento || 'Experto práctico'}`,
    `- Transformación: ${contexto.expertProfile?.transformation_promise || 'Del punto A al punto B'}`,
    `- Enemigo: ${contexto.expertProfile?.enemy || 'No definido'}`,
    puntoA,
    puntoB,
    '',
    'AVATAR:',
    `- Perfil: ${contexto.avatar_ideal || 'Audiencia general'}`,
    `- Dolor: ${contexto.dolor_principal || 'No definido'}`,
    `- Deseo: ${contexto.deseo_principal || 'No definido'}`,
    '',
    kbText,
    '',
    `OBJETIVO: ${objective}`,
    `TIMING: ${timing}`,
    objetivoStrategy,
    timingStrategy,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '📤 OUTPUT JSON — ESTRUCTURA EXACTA. SIN MARKDOWN. SIN TRUNCAR.',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `{"id":${ideaIndex + 1},"titulo":"Título que SOLO este experto diría — sin clichés","concepto":"Por qué esta idea conecta el tema con las 5 plataformas","idea_expandida_tca":"Tema expandido listo para Generador V600","tca":{"nivel_tca":"N2","sector_utilizado":"sector masivo","interseccion_detectada":"dolor + transformacion + sector","mass_appeal_score":0,"potencial_millonario":true,"nivel_polarizacion":0,"razonamiento_estrategico":"por qué llega a millones"},"frame_usado":"${frameAsignado}","angulo_estrategico":"${anguloAsignado}","postura_dominante":{"creencia_atacada":"creencia falsa del nicho","enemigo_implicito":"quién concreto tiene la culpa","nuevo_marco_mental":"visión superior del experto","solo_este_experto_puede_decirlo":true},"riesgo_emocional_activado":"Pérdida","originalidad_score":0,"diferenciacion_score":0,"formato_ganador":"DECLARACION_DISRUPTIVA","estructura_sugerida":"PAS","disparador_principal":"Miedo","emocion_objetivo":"emoción principal","objetivo_principal":"${objective}","contexto_temporal":"${timing}","potencial_viral":0,"razon_potencia":"por qué es poderoso","validacion_guru":{"eleva_autoridad":true,"posiciona_como_lider":true,"rompe_consenso":true,"potencial_viral_real":true,"suena_diferente_al_mercado":true,"funciona_en_5_plataformas":true},"adaptaciones":{"TikTok":{"hook":"MAX 4 PALABRAS shock","gancho_completo":"primera línea TikTok agresiva","caption_sugerido":"caption TikTok con debate","miniatura_frase":"2-3 palabras overlay","emocion_objetivo":"emoción cruda","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"7-9pm","duracion_ideal":"15-45s","formato_visual":"plano frontal cortes 2s","mecanismo_retencion":"primeros 3 segundos"},"Reels":{"hook":"hook aspiracional elegante","gancho_completo":"primera línea Reels","caption_sugerido":"caption Reels guardado","miniatura_frase":"frase elegante portada","emocion_objetivo":"aspiracional","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"6-9pm","duracion_ideal":"30-60s","formato_visual":"alta calidad visual","mecanismo_retencion":"guardar y compartir"},"YouTube":{"hook":"gap informativo fuerte","gancho_completo":"primera línea YouTube","caption_sugerido":"descripción con keywords","miniatura_frase":"4-6 palabras alto CTR","emocion_objetivo":"curiosidad","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"viernes 3-6pm","duracion_ideal":"60s o 8-15min","formato_visual":"cambios ángulo b-roll","mecanismo_retencion":"70 porciento completado"},"LinkedIn":{"hook":"tesis profesional provocadora","gancho_completo":"primera línea LinkedIn","caption_sugerido":"caption con repost CTA","miniatura_frase":"frase autoridad","emocion_objetivo":"ambición profesional","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"martes-jueves 8-10am","duracion_ideal":"45-90s","formato_visual":"plano limpio subtítulos","mecanismo_retencion":"compartir red profesional"},"Facebook":{"hook":"pregunta relatable comunidad","gancho_completo":"primera línea Facebook conversacional","caption_sugerido":"caption pregunta 50 comentarios","miniatura_frase":"frase conversacional clara","emocion_objetivo":"identificación comunidad","ctr_score":0,"nivel_polarizacion":0,"retencion_score":0,"mejor_horario":"7-10pm domingo","duracion_ideal":"60s-3min","formato_visual":"subtítulos grandes pausado","mecanismo_retencion":"comentarios primeros 30min"}},"plan_produccion":{"video_base":"descripción exacta video base único","duracion_grabacion":"duración óptima","subtitulos_obligatorios":true,"elementos_clave":["elemento 1","elemento 2"],"orden_publicacion":["1. plataforma 1","2. plataforma 2","3. plataforma 3","4. plataforma 4","5. plataforma 5"],"razon_orden":"justificación estratégica del orden"}}`,
    '',
    'REGLAS FINALES:',
    'OK mass_appeal_score >= 75 | originalidad_score > 75 | diferenciacion_score > 70',
    'OK TikTok nivel_polarizacion >= 65 | Reels >= 50 | YouTube >= 55 | LinkedIn >= 50 | Facebook >= 50',
    'OK ctr_score >= 70 en todas las adaptaciones',
    'OK Cada hook RADICALMENTE distinto al de otras plataformas',
    'OK Sin clichés en ningún hook ni título',
    'OK JSON válido y COMPLETO — nunca truncar'
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Eres el Sistema Multiplataforma #1. Generas EXACTAMENTE 1 idea con adaptaciones para 5 plataformas. JSON siempre válido y completo. Nunca truncas.'
        },
        { role: 'user', content: promptUnica }
      ],
      temperature: 0.78,
      max_tokens: 3000
    });

    const raw = completion.choices[0].message.content || '{}';
    let idea: any = {};

    try {
      idea = JSON.parse(raw);
    } catch {
      const cleaned = raw
        .replace(/```json\n?/g, '').replace(/```\n?/g, '')
        .replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ').trim();
      try {
        idea = JSON.parse(cleaned);
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          try { idea = JSON.parse(match[0]); } catch { idea = {}; }
        }
      }
    }

    console.log(`[MULTI] OK Idea ${ideaIndex + 1}/${totalIdeas} | Score: ${idea.tca?.mass_appeal_score || '?'}`);

    return {
      idea,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error(`[MULTI] ERROR en idea ${ideaIndex + 1}:`, error);
    return { idea: {}, tokens: 0 };
  }
}

const PROMPT_ADN_FORENSE = (
  transcripcion: string,
  nichoOrigen: string,
  nichoUsuario: string,
  objetivoUsuario: string,
  expertProfile?: any,
  contexto?: any
) => `
Eres TITAN OMEGA OLIMPO — laboratorio forense de ADN viral.
ESTA FASE: SOLO analizas. NO generas guion. NO escribes adaptaciones.
Tu trabajo es extraer el ADN con precisión quirúrgica.

=============================================================
TRANSCRIPCIÓN A ANALIZAR:
Nicho de origen: ${nichoOrigen}
Nicho del usuario (destino): ${nichoUsuario}
Objetivo del usuario: ${objetivoUsuario}

IDIOMA ORIGEN DEL VIDEO: ${contexto?.detectedSourceLanguage || 'auto-detectado'}
IDIOMA DE SALIDA DEL GUION: ${contexto?.outputLanguageFull || 'español — escribe como hispanohablante nativo'}
REGLA: Si el video es en inglés y el guion va en español — NO traduzcas, RECREA.
El guion debe sonar como si un nativo de ese idioma lo hubiera pensado así desde el principio.

TRANSCRIPCIÓN:
${transcripcion}
=============================================================

${expertProfile ? `
PERFIL DEL EXPERTO (considera al analizar):
- Nivel Autoridad: ${expertProfile.authority_level || 'practicante'}
- Objetivo: ${expertProfile.main_objective || 'autoridad'}
- Confrontación: ${expertProfile.confrontation_level || 3}/5
- Polémica: ${expertProfile.max_controversy || 3}/5
${expertProfile.mechanism_name ? `- Mecanismo: "${expertProfile.mechanism_name}"` : ''}
${expertProfile.enemy ? `- Enemigo: "${expertProfile.enemy}"` : ''}
${expertProfile.mental_territory ? `- Territorio Mental: "${expertProfile.mental_territory}"` : ''}
${expertProfile.point_a ? `- Punto A Avatar: "${expertProfile.point_a}"` : ''}
${expertProfile.point_b ? `- Punto B: "${expertProfile.point_b}"` : ''}
` : ''}

EJECUTA LOS 17 MOTORES FORENSES. SIN EXCEPCIONES. SIN GUION.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 MOTOR 1 — DESCOMPOSICIÓN ESTRUCTURAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mapea CADA bloque: tipo [hook/setup/escalada/giro/climax/resolucion/cierre_estrategico], inicio_seg, fin_seg, duracion_seg, descripcion, funcion_narrativa, intensidad 0-100.
Determina: tipo_apertura, tipo_cierre, proporcion_hook_pct, velocidad_escalada, patron_narrativo_detectado, complejidad_estructural 0-100.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟠 MOTOR 2 — CURVA EMOCIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
emocion_dominante, emocion_secundaria, emocion_final. picos_emocionales: [{segundo, emocion, intensidad, detonante}]. intensidad_promedio, variabilidad_emocional, arco_emocional (1 frase).
Emociones específicas: "curiosidad ansiosa" no "curiosidad".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟡 MOTOR 3 — MICRO-LOOPS Y TENSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta cada loop: tipo [promesa_abierta/cliffhanger/pregunta_pendiente/anticipacion/gancho_diferido], descripcion, apertura_seg, cierre_seg, intensidad.
Calcula: total, intervalo_promedio, densidad_anticipacion, loops_sin_resolver, estrategia_tension.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟤 MOTOR 4 — POLARIZACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
nivel_confrontacion 0-100, ruptura_creencia_detectada, enemigo_implicito, nivel_friccion_narrativa, mecanismo_polarizacion, afirmaciones_divisivas, posicionamiento_vs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 MOTOR 5 — IDENTIDAD VERBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
longitud_promedio_frases, ritmo_sintactico [staccato/fluido/mixto/explosivo], proporcion_frases_cortas_pct, uso_metaforas 0-100, uso_imperativos 0-100, sofisticacion_lexica 0-100, nivel_agresividad_verbal 0-100, firma_linguistica, palabras_poder_detectadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 MOTOR 6 — STATUS Y POSICIONAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
tipo_autoridad [mentor/rebelde/experto_tecnico/disruptor/insider/testigo/transformado], experiencia_proyectada, rol_narrativo, nivel_confianza_percibida, distancia_con_audiencia, prueba_social_detectada, mecanismos_autoridad.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚪ MOTOR 7 — DENSIDAD DE VALOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
valor_por_minuto 0-100, porcentaje_contenido_abierto, profundidad_insight, micro_aprendizajes, ratio_promesa_entrega, tipo_valor_dominante.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟣 MOTOR 8 — MANIPULACIÓN DE ATENCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cambios_ritmo [{segundo, tipo, descripcion}], interrupciones_patron, reencuadres_mentales, golpes_narrativos [{segundo, descripcion, impacto}], reactivaciones_atencion, frecuencia_estimulacion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔶 MOTOR 9 — ACTIVADORES DE GUARDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detecta mínimo 3: tipo [frase_memorable/reencuadre/dato_contraintuitivo/formula_repetible/revelacion], contenido (parafrasea), segundo_aproximado, potencia_guardado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟦 MOTOR 10 — ADAPTABILIDAD AL NICHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Para ${nichoUsuario}: sofisticacion_audiencia_target, nivel_conciencia_mercado, intensidad_psicologica_tolerable, ajustes_necesarios, riesgos_adaptacion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚫ MOTOR 11 — ANTI-SATURACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Máximo 3: tipo, contenido, nivel_saturacion, alternativa_sugerida.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔷 MOTOR 12 — RITMO NARRATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
velocidad_progresion, intervalo_promedio_entre_estimulos_seg, variacion_intensidad, fluidez_estructural, momentos_pausa, aceleraciones.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 13 — SCORE VIRAL ESTRUCTURAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Calcula: retencion_estructural, intensidad_emocional, polarizacion, manipulacion_atencion, densidad_valor, viralidad_estructural_global (todos 0-100).
breakdown_motores con score individual por motor.
Pesos: retencion(25%)+emocional(20%)+atencion(20%)+valor(15%)+polarizacion(10%)+resto(10%).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 MOTOR 14A — ADN PROFUNDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
genero_narrativo: Confesional|Educativo|Drama real|Opinión polarizante|Autoridad estratégica|Historia de fracaso|Historia de poder|Denuncia|Revelación
emocion_nucleo: Culpa|Rabia|Indignación|Vulnerabilidad|Liderazgo|Redención|Superioridad|Advertencia
tipo_tension: Moral|Profesional|Social|Económica|Autoridad|Identidad
frame_dominante: {creencia_que_ataca, nuevo_marco, frase_nucleo}
polarizacion_implicita: {bando_A, bando_B, tension_irresuelta}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 MOTOR 14B — IDEA NUCLEAR GANADORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
que_hace_viral, creencia_rota, postura_impuesta, por_que_genera_conversacion, tension_no_resuelta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔺 MOTOR 14C — SISTEMA DE SUPERIORIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cómo la adaptación PUEDE superar al original:
mayor_claridad, mayor_intensidad, mayor_polarizacion, mejor_estructura_emocional, mejor_cierre, ventaja_de_nicho.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 MOTOR 14D — INTENSIDAD CONFLICTUAL (ANTI-SUAVIZACIÓN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRÍTICO: Este motor previene que el guion se vuelva abstracto y sin fuerza.
Sin este motor, la adaptación se convierte en "reflexión" en lugar de "conflicto real".

nivel_riesgo_original: bajo|medio|alto|extremo
  → ¿Qué tan arriesgado socialmente? ¿Puede generar rechazo fuerte?

escena_concreta_principal: LA ESCENA EXACTA del video. No el concepto — LA ESCENA.
  → Quién hizo qué, cuándo, con qué consecuencia. 1-2 oraciones máximo.

decision_impopular: la decisión más difícil que tomó o reveló el creador
  → Lo específico. Lo que incomoda. Sin abstraer.

consecuencia_real: qué pasó exactamente como resultado. Con daño o pérdida concreta.
  → No "aprendí algo". El costo real: dinero, relación, reputación, oportunidad.

nivel_incomodidad: 0-100

por_que_incomoda: razón específica de la tensión social — no "toca temas difíciles"

elemento_peligroso: el elemento EXACTO que más divide y genera comentarios en contra

equivalente_en_nicho:
  escena_equivalente: caso concreto en el nicho del usuario con la misma carga emocional
  decision_equivalente: decisión impopular equivalente en el nicho del usuario
  consecuencia_equivalente: consecuencia real con costo concreto en el nicho del usuario
  elemento_peligroso_equivalente: elemento que genera la misma polarización en el nicho del usuario

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 MOTOR 15 — BLUEPRINT REPLICABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
nombre_patron, formula_base, pasos_estructurales.
equivalencias_estructurales: {hook_type, escalation_pattern, giro_type, closure_type}.
equivalencias_psicologicas: {emocion_entrada, emocion_escalada, emocion_salida, tension_type, activation_mechanism}.
equivalencias_verbales: {ritmo, agresividad, sofisticacion}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 MOTOR 16 — ANÁLISIS TCA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PARTE A: nivel_tca_detectado (N0-N4), sector_detectado, mass_appeal_score, equilibrio_masividad_calificacion, diagnostico_tca, capa_visible, capa_estrategica, filtro_audiencia_implicito, tipo_trafico_que_atrae, nivel_conversion_probable, esta_muy_tecnico, esta_muy_mainstream.
PARTE B (mapa para ${nichoUsuario}): nivel_tca_recomendado, sector_recomendado, nuevo_hook_sectorial, nueva_capa_visible, estructura_espejo, version_equilibrio_ideal, advertencia_micronicho.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MOTOR 17 — POSICIONAMIENTO Y PRÓXIMOS PASOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
posiciona_como: Mentor firme|Líder estratégico|Autoridad ética|Visionario|Analista frío|Testigo honesto.
razon_posicionamiento.
proximos_contenidos: 3 items [{titulo, por_que_ahora, genero, tension}].

=============================================================
=============================================================
DEVUELVE JSON con estas claves exactas — sin agregar ni omitir ninguna:
adn_estructura, curva_emocional, micro_loops, polarizacion, identidad_verbal, status_y_posicionamiento, densidad_valor, manipulacion_atencion, activadores_guardado, adaptabilidad_nicho, elementos_cliche_detectados, ritmo_narrativo, score_viral_estructural, adn_profundo, idea_nuclear_ganadora, sistema_superioridad, intensidad_conflictual, blueprint_replicable, analisis_tca, mapa_de_adaptacion, posicionamiento_y_proximos_pasos.
Campos críticos obligatorios:
- score_viral_estructural: incluye viralidad_estructural_global (0-100)
- adn_profundo: incluye genero_narrativo, emocion_nucleo, tipo_tension, frame_dominante, polarizacion_implicita
- blueprint_replicable: incluye equivalencias_estructurales con hook_type, escalation_pattern, closure_type
- micro_loops: incluye total y estrategia_tension
- activadores_guardado: mínimo 3 items con tipo y contenido
- intensidad_conflictual: incluye nivel_riesgo_original, escena_concreta_principal, decision_impopular, consecuencia_real, nivel_incomodidad, por_que_incomoda, elemento_peligroso, equivalente_en_nicho
DEVUELVE ÚNICAMENTE JSON VÁLIDO. Sin markdown. Sin backticks.
`;

const PROMPT_GUION_ELITE = (
  adnForense: any,
  nichoUsuario: string,
  objetivoUsuario: string,
  contentType: string,
  platform: string,
  expertProfile?: any
): string => {
  const minWords = contentType === 'masterclass' ? 700 : contentType === 'long' ? 400 : 250;
  const idealWords = contentType === 'masterclass' ? 1200 : contentType === 'long' ? 650 : 380;
  const duracion = contentType === 'masterclass' ? 'más de 10 minutos' : contentType === 'long' ? '3 a 10 minutos' : '30 a 90 segundos';

  const genero = adnForense.adn_profundo?.genero_narrativo || 'Autoridad estratégica';
  const emocion = adnForense.adn_profundo?.emocion_nucleo || 'Indignación';
  const tension = adnForense.adn_profundo?.tipo_tension || 'Profesional';
  const frameNucleo = adnForense.adn_profundo?.frame_dominante?.frase_nucleo || '';
  const creenciaAtaca = adnForense.adn_profundo?.frame_dominante?.creencia_que_ataca || '';
  const nuevoMarco = adnForense.adn_profundo?.frame_dominante?.nuevo_marco || '';
  const ideanuclear = adnForense.idea_nuclear_ganadora?.que_hace_viral || '';
  const postura = adnForense.idea_nuclear_ganadora?.postura_impuesta || '';
  const creenciaRota = adnForense.idea_nuclear_ganadora?.creencia_rota || '';
  const tensionNoResuelta = adnForense.idea_nuclear_ganadora?.tension_no_resuelta || '';
  const patron = adnForense.adn_estructura?.patron_narrativo_detectado || '';
  const velocidadEscalada = adnForense.adn_estructura?.velocidad_escalada || 'progresiva';
  const propHookPct = adnForense.adn_estructura?.proporcion_hook_pct || 15;
  const hookType = adnForense.blueprint_replicable?.equivalencias_estructurales?.hook_type || '';
  const escalationPattern = adnForense.blueprint_replicable?.equivalencias_estructurales?.escalation_pattern || '';
  const closureType = adnForense.blueprint_replicable?.equivalencias_estructurales?.closure_type || '';
  const totalLoops = adnForense.micro_loops?.total || 3;
  const estrategiaTension = adnForense.micro_loops?.estrategia_tension || '';
  const activadores = adnForense.activadores_guardado || [];
  const activador0 = activadores[0]?.tipo || 'frase_memorable';
  const activador1 = activadores[1]?.tipo || 'reencuadre';
  const ritmoVerbal = adnForense.identidad_verbal?.ritmo_sintactico || 'staccato';
  const agresividad = adnForense.identidad_verbal?.nivel_agresividad_verbal || 70;
  const bandoA = adnForense.adn_profundo?.polarizacion_implicita?.bando_A || '';
  const bandoB = adnForense.adn_profundo?.polarizacion_implicita?.bando_B || '';
  const tensionIrresuelta = adnForense.adn_profundo?.polarizacion_implicita?.tension_irresuelta || '';
  const sectorTca = adnForense.analisis_tca?.sector_detectado || 'Desarrollo Personal';
  const nuevoHook = adnForense.analisis_tca?.nuevo_hook_sectorial || '';
  const ventajaNicho = adnForense.sistema_superioridad?.ventaja_de_nicho || '';
  const mayorIntensidad = adnForense.sistema_superioridad?.mayor_intensidad || '';
  const golpesNarrativos = adnForense.manipulacion_atencion?.golpes_narrativos || [];
  const reencuadresMentales = adnForense.manipulacion_atencion?.reencuadres_mentales || [];
  const golpe0 = golpesNarrativos[0]?.descripcion || '';
  const reencuadre0 = reencuadresMentales[0] || '';
  const firmaLinguistica = adnForense.identidad_verbal?.firma_linguistica || '';
  const palabrasPoder = adnForense.identidad_verbal?.palabras_poder_detectadas || [];
  const bloques = adnForense.adn_estructura?.bloques || [];
  const loopsDetalle = adnForense.micro_loops?.loops || [];
  const activador0Contenido = activadores[0]?.contenido || '';
  const activador2 = activadores[2]?.tipo || 'dato_contraintuitivo';
  const formulaBase = adnForense.blueprint_replicable?.formula_base || '';
  const pasosEstructurales = adnForense.blueprint_replicable?.pasos_estructurales || [];
  const porQueConversacion = adnForense.idea_nuclear_ganadora?.por_que_genera_conversacion || '';
  const versionEquilibrio = adnForense.analisis_tca?.version_equilibrio_ideal || adnForense.mapa_de_adaptacion?.version_equilibrio_ideal || '';
  const ic = adnForense.intensidad_conflictual || {};
  const nivelRiesgo = ic.nivel_riesgo_original || 'alto';
  const escenaConcreta = ic.escena_concreta_principal || '';
  const decisionImpopular = ic.decision_impopular || '';
  const consecuenciaReal = ic.consecuencia_real || '';
  const nivelIncomodidad = ic.nivel_incomodidad || 70;
  const porQueIncomoda = ic.por_que_incomoda || '';
  const elementoPeligroso = ic.elemento_peligroso || '';
  const escenaEquiv = ic.equivalente_en_nicho?.escena_equivalente || '';
  const decisionEquiv = ic.equivalente_en_nicho?.decision_equivalente || '';
  const consecuenciaEquiv = ic.equivalente_en_nicho?.consecuencia_equivalente || '';
  const elementoPeligrosoEquiv = ic.equivalente_en_nicho?.elemento_peligroso_equivalente || '';

  return `Eres el escritor de guiones virales #1 del mundo hispanohablante.
AXIOMA CENTRAL V1000: "No adaptes el tema. Replica el mecanismo emocional."
MISIÓN ABSOLUTA: Tomar el ADN exacto de este video viral y crear un guion SUPERIOR.
No reinterpretación. No concepto abstracto. REPLICACIÓN DE MECANISMO con equivalencia estructural.

═══════════════════════════════════════════════════
🔬 MECANISMO VIRAL REAL — LO QUE EXPLOTÓ ESTE VIDEO:
═══════════════════════════════════════════════════
GÉNERO NARRATIVO: ${genero}
→ TU GUION DEBE SER DEL MISMO GÉNERO. Si es "Confesional crudo" — debe ser crudo. No reflexivo.

TIPO DE CONFLICTO CENTRAL: ${tension}
→ Debes replicar ESTE TIPO de conflicto en ${nichoUsuario}. No cambiarlo por otro.

NIVEL DE RIESGO ORIGINAL: ${nivelRiesgo.toUpperCase()}
→ Tu adaptación DEBE tener riesgo ${nivelRiesgo}. Si el original es riesgo alto, tu guion no puede ser seguro.

EMOCIÓN NÚCLEO: ${emocion}
→ El oyente debe sentir exactamente esta emoción. No una versión suavizada.

INTENSIDAD EMOCIONAL: ${nivelIncomodidad}/100
→ Tu guion debe alcanzar mínimo ${Math.min(nivelIncomodidad + 5, 100)}/100 de intensidad.

═══════════════════════════════════════════════════
🎬 ESCENA CONCRETA ORIGINAL (EL CORAZÓN DEL VIDEO):
═══════════════════════════════════════════════════
ESCENA EXACTA: "${escenaConcreta}"
DECISIÓN IMPOPULAR: "${decisionImpopular}"
CONSECUENCIA REAL: "${consecuenciaReal}"
POR QUÉ INCOMODA: "${porQueIncomoda}"
ELEMENTO PELIGROSO (lo que genera comentarios en contra): "${elementoPeligroso}"

═══════════════════════════════════════════════════
🎯 EQUIVALENCIA ESTRUCTURAL PARA ${nichoUsuario.toUpperCase()}:
═══════════════════════════════════════════════════
${escenaEquiv ? `ESCENA EQUIVALENTE EN TU NICHO: "${escenaEquiv}"` : `CREA UNA ESCENA CONCRETA en ${nichoUsuario} con la misma carga emocional que: "${escenaConcreta}"`}
${decisionEquiv ? `DECISIÓN EQUIVALENTE: "${decisionEquiv}"` : `CREA UNA DECISIÓN IMPOPULAR equivalente en ${nichoUsuario}`}
${consecuenciaEquiv ? `CONSECUENCIA EQUIVALENTE: "${consecuenciaEquiv}"` : `CREA UNA CONSECUENCIA REAL con costo concreto (dinero, relación, reputación)`}
${elementoPeligrosoEquiv ? `ELEMENTO PELIGROSO EQUIVALENTE: "${elementoPeligrosoEquiv}"` : `CREA EL ELEMENTO que más va a dividir opiniones en ${nichoUsuario}`}

⚠️ REGLA DE ORO: Si el original tiene escena → tu guion tiene escena. Si tiene consecuencia → tiene consecuencia.
PROHIBIDO ABSOLUTO: Convertir escenas concretas en conceptos abstractos o metáforas bonitas.

═══════════════════════════════════════════════════
🧬 ADN VIRAL COMPLETO — TU MOLDE:
═══════════════════════════════════════════════════
FRAME DOMINANTE: "${frameNucleo}"
CREENCIA QUE DESTRUYE: "${creenciaAtaca}"
NUEVO MARCO QUE INSTALA: "${nuevoMarco}"
QUÉ LO HACE VIRAL: ${ideanuclear}
POSTURA QUE IMPONE: "${postura}"
CREENCIA ROTA: "${creenciaRota}"
POR QUÉ GENERA CONVERSACIÓN: "${porQueConversacion}"
TENSIÓN SIN RESOLVER: "${tensionNoResuelta}"
PATRÓN NARRATIVO: ${patron} | HOOK: ${hookType} | ESCALADA: ${escalationPattern} | CIERRE: ${closureType}
MICRO-LOOPS: ${totalLoops} — estrategia: ${estrategiaTension}
ACTIVADOR 1: ${activador0} | ACTIVADOR 2: ${activador1}
RITMO: ${ritmoVerbal} | AGRESIVIDAD VERBAL: ${agresividad}/100
BANDO A: "${bandoA}" | BANDO B: "${bandoB}"
VENTAJA DE NICHO: "${ventajaNicho}" | MAYOR INTENSIDAD POSIBLE: "${mayorIntensidad}"
NUEVO HOOK SECTORIAL: "${nuevoHook}"

═══════════════════════════════════════════════════
👤 DESTINO:
═══════════════════════════════════════════════════
NICHO: ${nichoUsuario} | OBJETIVO: ${objetivoUsuario}
PLATAFORMA: ${platform} | FORMATO: ${contentType} — ${duracion}
${expertProfile ? `EXPERTO: Mecanismo="${expertProfile.mechanism_name || ''}" | Enemigo="${expertProfile.enemy || ''}" | Punto A="${expertProfile.point_a || ''}" | Punto B="${expertProfile.point_b || ''}"` : ''}

═══════════════════════════════════════════════════
🔴 LEYES ABSOLUTAS V1000 — VIOLACIÓN = REGENERAR
═══════════════════════════════════════════════════

LEY 1 — EQUIVALENCIA ESTRUCTURAL (la más importante):
Cada elemento del original tiene su equivalente en el guion:
  Original: ${escenaConcreta ? `"${escenaConcreta.substring(0,80)}..."` : 'escena concreta'}
  Tu guion: escena concreta equivalente en ${nichoUsuario}
  Original: ${decisionImpopular ? `"${decisionImpopular.substring(0,80)}..."` : 'decisión impopular'}
  Tu guion: decisión impopular equivalente en ${nichoUsuario}
  Original: ${consecuenciaReal ? `"${consecuenciaReal.substring(0,80)}..."` : 'consecuencia real'}
  Tu guion: consecuencia real con costo concreto en ${nichoUsuario}
NO CAMBIES ESTRUCTURA POR CONCEPTO.

LEY 2 — ESCALADA EMOCIONAL OBLIGATORIA (7 pasos):
  Paso 1 HOOK: Tensión inmediata — situación específica que el oyente ha vivido
  Paso 2 REVELACIÓN: El conflicto aparece — concreto, no abstracto
  Paso 3 ESCALADA: La situación empeora — ejemplos reales del nicho
  Paso 4 PUNTO CRÍTICO: El momento más difícil — decisión que nadie quiere tomar
  Paso 5 DECISIÓN: La elección impopular — dicha sin rodeos, sin suavizar
  Paso 6 CONSECUENCIA: El costo real — dinero, relación, reputación, oportunidad
  Paso 7 FRAME FINAL: La postura más fuerte — la que divide opiniones
Si falta punto crítico → regenerar. Si falta decisión clara → regenerar. Si curva es plana → regenerar.

LEY 3 — POLARIZACIÓN MÍNIMA 70/100:
  Bando A: "${bandoA}" adaptado a ${nichoUsuario}
  Bando B: "${bandoB}" adaptado a ${nichoUsuario}
  No busques que todos estén de acuerdo. Busca que la mitad comente en contra.
  Tensión irresuelta que genera debate: "${tensionNoResuelta}"

LEY 4 — SUPERIORIDAD OBLIGATORIA:
  Tu guion DEBE superar al original en:
  → Mayor claridad narrativa del conflicto
  → Mayor precisión en la decisión impopular
  → Mayor contundencia en el frame final
  → Mejor hook — más específico, más tenso
  → Cierre más polarizante

LEY 5 — AUTOEVALUACIÓN ANTES DE ENTREGAR:
  Si tu guion suena "reflexivo" cuando el original era "crudo" → REGENERAR
  Si tu guion usa conceptos donde el original usaba escenas → REGENERAR
  Si tu guion es menos polémico que el original → REGENERAR
  Si no hay punto donde el oyente piense "esto es muy fuerte" → REGENERAR
  Si el cierre no divide opiniones → REGENERAR

LEY 6 — TELEPROMPTER PURO:
  SOLO las palabras que el creador dice en voz alta.
  Sin etiquetas [HOOK] [ESCALADA] [CLIMAX] — ninguna visible.
  Frases cortas en tensión. "..." para pausa. Línea en blanco para pausa larga.
  Ritmo: ${ritmoVerbal}. Agresividad: ${agresividad}/100.

LEY 7 — LONGITUD: MÍNIMO ${minWords} palabras. IDEAL ${idealWords} palabras.
  Menos de ${minWords} = fallo. No entregar.

═══════════════════════════════════════════════════
DEVUELVE ÚNICAMENTE ESTE JSON (sin markdown, sin backticks):
{
  "guion_adaptado_espejo": "GUION COMPLETO MÍNIMO ${minWords} PALABRAS — SOLO VOZ, CERO ETIQUETAS, MÁXIMA INTENSIDAD",
  "guion_adaptado_al_nicho": "igual que guion_adaptado_espejo",
  "por_que_llegara_a_millones": "mecanismo emocional exacto que lo hará viral",
  "como_supera_al_original": "en qué aspectos concretos es más poderoso",
  "momento_mas_compartible": "frase exacta del guion más compartible y por qué genera guardado",
  "prediccion_comentarios": ["comentario en contra exacto","comentario a favor exacto","comentario de identificación exacto"],
  "plan_audiovisual_profesional": {
    "secuencia_temporal": [{"tiempo":"","descripcion_visual":"","tipo_plano":"","movimiento_camara":"","texto_en_pantalla":"","emocion_objetivo":"","efecto_retencion":"","audio_sfx":""}],
    "b_rolls_estrategicos": [{"momento":"","que_mostrar":"","duracion_segundos":0,"por_que_refuerza":"","emocion_generada":"","fuente_sugerida":""}],
    "transiciones": [{"entre_escenas":"","tipo_transicion":"","velocidad":"","por_que_funciona":""}],
    "ritmo_de_cortes": {"patron_general":"","descripcion":"","frecuencia_promedio_seg":0,"aceleraciones":"","desaceleraciones":"","regla_hook":""},
    "musica": {"tipo":"","bpm_aproximado":0,"emocion_dominante":"","volumen_relativo":"","entrada_musica":"","cambio_musical":"","referencias":""},
    "efectos_de_retencion": {"sonido_transicion":"","micro_silencios":"","cambios_de_plano":"","micro_interrupciones":"","subtitulos":""},
    "checklist_produccion": ["iluminación","fondo","apariencia","equipo","apps edición"]
  },
  "miniatura_dominante": {"frase_principal":"","variante_agresiva":"","variante_aspiracional":"","justificacion_estrategica":"","emocion_dominante_activada":"","gap_curiosidad":"","mecanismo_psicologico":"","ctr_score":0,"nivel_disrupcion":0,"nivel_gap_curiosidad":0,"nivel_polarizacion":0},
  "validacion_olimpo": {
    "arquitectura_completa": true,
    "loops_detectados": true,
    "tca_identificado": true,
    "equilibrio_ideal_detectado": true,
    "filtro_implicito_extraido": true,
    "adaptacion_sin_micronicho": true,
    "adn_estructural_mantenido": true,
    "genero_narrativo_respetado": true,
    "emocion_nucleo_presente": true,
    "teleprompter_sin_etiquetas": true,
    "conflicto_original_preservado": true,
    "riesgo_narrativo_mantenido": true,
    "intensidad_equivalente_o_superior": true,
    "guion_concreto_no_abstracto": true,
    "punto_critico_presente": true,
    "decision_clara_presente": true,
    "score_validacion": 0
  },
}
`;
};

async function ejecutarIngenieriaInversaPro(
  content: string,
  contexto: any,
  openai: any,
  nichoOrigen: string = "General"
): Promise<{ data: any; tokens: number }> {

  const videoDuracion  = contexto._videoDurationSecs || 0;
  const esReel         = videoDuracion > 0 && videoDuracion <= 90;
  const esMasterclass  = videoDuracion > 600;
  const contentType    = contexto.contentType || (esReel ? 'reel' : esMasterclass ? 'masterclass' : 'long');
  const nichoUsuario   = contexto.nicho || "General";
  const objetivoUsuario = contexto.deseo_principal || "Dominancia y Viralidad";
  const platform       = contexto.targetPlatform || contexto.platform || 'TikTok';
  const minWords       = contentType === 'masterclass' ? 800 : contentType === 'long' ? 450 : 250;

  let tokensTotal = 0;
  let outputActual: any = null;

  console.log(`[MOTOR PRO V2] 🎬 Tipo: ${contentType.toUpperCase()} | Nicho: ${nichoUsuario.substring(0, 60)}`);
  console.log(`[MOTOR PRO V2] 📝 Guion mínimo: ${minWords} palabras`);

  try {
    console.log(`[MOTOR PRO V2] 🔬 FASE 1: Extrayendo ADN forense...`);

  // Recortar expertProfile para FASE 1 — solo campos clave, sin bases de conocimiento enormes
  const expertProfileFase1 = contexto.expertProfile ? {
    authority_level: contexto.expertProfile.authority_level,
    main_objective: contexto.expertProfile.main_objective,
    confrontation_level: contexto.expertProfile.confrontation_level,
    max_controversy: contexto.expertProfile.max_controversy,
    mechanism_name: contexto.expertProfile.mechanism_name,
    enemy: contexto.expertProfile.enemy,
    mental_territory: contexto.expertProfile.mental_territory,
    point_a: contexto.expertProfile.point_a,
    point_b: contexto.expertProfile.point_b,
  } : undefined;

  // ✅ Truncar transcript ANTES del prompt — preserva instrucciones completas
  const contentTruncado = content.slice(0, 4000);

  const promptFase1 = PROMPT_ADN_FORENSE(
  contentTruncado,
  nichoOrigen,
  nichoUsuario,
  objetivoUsuario,
  expertProfileFase1,
  { detectedSourceLanguage: contexto.detectedSourceLanguage, outputLanguageFull: contexto.outputLanguageFull }
);

    const TOKENS_FASE1 = esMasterclass ? 5000 : 4500;

// Comprimir prompt FASE 1 — preserva todos los motores completos
    const promptFase1Truncado = promptFase1
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .slice(0, 22000);

    const completionFase1 = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres TITAN OMEGA OLIMPO. Sistema forense de ADN viral. Esta fase: SOLO analizas. NO generas guion. Devuelves ÚNICAMENTE JSON válido y COMPLETO. Nunca truncues el JSON.' },
        { role: 'user', content: promptFase1Truncado }
      ],
      temperature: 0.15,
      max_tokens: TOKENS_FASE1
    });

    // Parseo robusto con reparación de JSON truncado
    let adnForense: any = {};
    try {
      adnForense = JSON.parse(completionFase1.choices[0].message.content || '{}');
    } catch (jsonErr) {
      let raw = completionFase1.choices[0].message.content || '{}';
      const openBraces = (raw.match(/\{/g) || []).length;
      const closeBraces = (raw.match(/\}/g) || []).length;
      const missing = openBraces - closeBraces;
      if (missing > 0) raw = raw + '}'.repeat(missing);
      try { adnForense = JSON.parse(raw); } catch { adnForense = {}; }
      console.warn('[MOTOR PRO V2] ⚠️ JSON FASE 1 reparado tras truncamiento');
    }
    tokensTotal += completionFase1.usage?.total_tokens || 0;
    adnForense._outputLanguage = contexto.outputLanguage || 'es';
    adnForense._outputLanguageFull = contexto.outputLanguageFull || 'español — escribe como hispanohablante nativo';

    const scoreAdn = adnForense.score_viral_estructural?.viralidad_estructural_global || 0;
    console.log(`[MOTOR PRO V2] ✅ FASE 1 completa. Score ADN: ${scoreAdn}/100`);
    // ✅ Delay anti-TPM: esperar 2s entre fases para resetear ventana de tokens
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(`[MOTOR PRO V2] 🧬 Género: ${adnForense.adn_profundo?.genero_narrativo} | Emoción: ${adnForense.adn_profundo?.emocion_nucleo}`);

    console.log(`[MOTOR PRO V2] ✍️ FASE 2: Generando guion élite...`);

    const expertProfileFase2 = contexto.expertProfile ? {
      mechanism_name: contexto.expertProfile.mechanism_name,
      enemy: contexto.expertProfile.enemy,
      mental_territory: contexto.expertProfile.mental_territory,
      point_a: contexto.expertProfile.point_a,
      point_b: contexto.expertProfile.point_b,
    } : undefined;

    const promptFase2 = PROMPT_GUION_ELITE(
      adnForense,
      nichoUsuario,
      objetivoUsuario,
      contentType,
      platform,
      expertProfileFase2
    );

    const TOKENS_FASE2 = esMasterclass ? 6000 : contentType === 'long' ? 5000 : 4000;

    // Esperar 5s para que la ventana TPM se resetee después de FASE 1
    console.log('[MOTOR PRO V2] ⏳ Limpiando ventana TPM...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Comprimir prompt FASE 2: máximo 18000 chars → seguro con 30k TPM limpio
    const promptFase2Final = promptFase2
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .slice(0, 18000);
    const completionFase2 = await openai.chat.completions.create({
      model: 'gpt-4o',                   // ✅ FULL gpt-4o — sin compromiso
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `Eres el escritor de guiones virales #1 del mundo. ÚNICA función: guion poderoso y completo. MÍNIMO ${minWords} palabras. Más corto = fallo crítico. JSON válido únicamente.` },
        { role: 'user', content: promptFase2Final }
      ],
      temperature: 0.75,
      max_tokens: TOKENS_FASE2
    });

    const outputGuion = JSON.parse(completionFase2.choices[0].message.content || '{}');
    tokensTotal += completionFase2.usage?.total_tokens || 0;

    const guionTexto = outputGuion.guion_adaptado_espejo || outputGuion.guion_adaptado_al_nicho || '';
    const palabrasFase2 = guionTexto.trim().split(/\s+/).filter(Boolean).length;
    console.log(`[MOTOR PRO V2] 📝 Palabras guion fase 2: ${palabrasFase2} (mínimo: ${minWords})`);

    let guionFinalData = outputGuion;

    if (palabrasFase2 < minWords) {
      console.warn(`[MOTOR PRO V2] ⚠️ Guion corto (${palabrasFase2}/${minWords}). Refinando...`);

      const promptRef = `Escritor de guiones virales. El guion tiene solo ${palabrasFase2} palabras. Necesitas MÍNIMO ${minWords} palabras.
ADN: Género: ${adnForense.adn_profundo?.genero_narrativo} | Emoción: ${adnForense.adn_profundo?.emocion_nucleo}
GUION ACTUAL: ${guionTexto}
NICHO: ${nichoUsuario}
REESCRIBE completo con MÍNIMO ${minWords} palabras. Mantén plan_audiovisual_profesional, miniatura_dominante, validacion_olimpo.
═══════════════════════════════════════════════════
⚠️ IDIOMA OBLIGATORIO DEL GUION:
Escribe "guion_adaptado_espejo" ÚNICAMENTE en: ${adnForense._outputLanguageFull || 'español — escribe como hispanohablante nativo'}

REGLAS:
- Si el ADN viene de inglés y el guion va en español: NO traduzcas — RECREA.
  Que suene como si un brillante hispanohablante lo hubiera pensado así desde siempre.
- Adapta modismos, ejemplos y referencias culturales al idioma destino.
- Jamás debe sentirse como traducción.
- Las claves del JSON siempre en snake_case inglés.
- Solo el contenido del guion va en el idioma seleccionado.
═══════════════════════════════════════════════════
DEVUELVE ÚNICAMENTE JSON válido. Sin markdown. Sin backticks.
`;


      const completionRef = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `Escritor viral. MÍNIMO ${minWords} palabras en el guion. JSON válido.` },
          { role: 'user', content: promptRef }
        ],
        temperature: 0.8,
        max_tokens: TOKENS_FASE2
      });

      const outputRef = JSON.parse(completionRef.choices[0].message.content || '{}');
      tokensTotal += completionRef.usage?.total_tokens || 0;
      const guionRefRaw = outputRef.guion_adaptado_espejo || outputRef.guion_adaptado_al_nicho || '';
      const guionRefStr = typeof guionRefRaw === 'string' ? guionRefRaw : JSON.stringify(guionRefRaw);
      const palabrasRef = guionRefStr.trim().split(/\s+/).filter(Boolean).length;
      console.log(`[MOTOR PRO V2] 📝 Post-refinamiento: ${palabrasRef} palabras`);
      if (palabrasRef > palabrasFase2) guionFinalData = outputRef;
    }

    outputActual = {
      ...adnForense,
      guion_adaptado_espejo:        (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      guion_adaptado_al_nicho:      (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      guion_tecnico_completo:       (() => { const g = guionFinalData.guion_adaptado_espejo || guionFinalData.guion_adaptado_al_nicho || ''; return typeof g === 'string' ? g : JSON.stringify(g); })(),
      plan_audiovisual_profesional: guionFinalData.plan_audiovisual_profesional || null,
      miniatura_dominante:          guionFinalData.miniatura_dominante || null,
      validacion_olimpo:            guionFinalData.validacion_olimpo || adnForense.validacion_olimpo || null,
      sistema_superioridad:         adnForense.sistema_superioridad || guionFinalData.sistema_superioridad || null,
    };

    const scoreActual = adnForense.score_viral_estructural?.viralidad_estructural_global || 0;
    const guionFinalStr = typeof outputActual.guion_adaptado_espejo === 'string' ? outputActual.guion_adaptado_espejo : '';
    const palabrasFinales = guionFinalStr.trim().split(/\s+/).filter(Boolean).length;

    const MOTORES_OBLIGATORIOS = [
      "adn_estructura", "curva_emocional", "micro_loops", "polarizacion",
      "identidad_verbal", "status_y_posicionamiento", "densidad_valor",
      "manipulacion_atencion", "activadores_guardado", "adaptabilidad_nicho",
      "elementos_cliche_detectados", "ritmo_narrativo", "score_viral_estructural",
      "adn_profundo", "idea_nuclear_ganadora", "sistema_superioridad",
      "intensidad_conflictual",
      "guion_adaptado_espejo", "blueprint_replicable", "analisis_tca",
      "mapa_de_adaptacion", "posicionamiento_y_proximos_pasos"
    ];

    const motoresFaltantes = MOTORES_OBLIGATORIOS.filter(
      m => !outputActual[m] || (Array.isArray(outputActual[m]) && outputActual[m].length === 0)
    );

    if (motoresFaltantes.length > 0) {
      console.warn(`[MOTOR PRO V2] ⚠️ Motores incompletos: ${motoresFaltantes.join(", ")}`);
    }

    outputActual._motores_faltantes  = motoresFaltantes;
    outputActual._motores_completos  = MOTORES_OBLIGATORIOS.length - motoresFaltantes.length;
    outputActual._completitud_pct    = Math.round((outputActual._motores_completos / MOTORES_OBLIGATORIOS.length) * 100);

    outputActual.plan_visual          = outputActual.plan_audiovisual_profesional?.secuencia_temporal || null;
    outputActual.plan_visual_director = outputActual.plan_audiovisual_profesional?.secuencia_temporal || null;
    outputActual._tca_score           = outputActual.analisis_tca?.mass_appeal_score || 0;
    outputActual._nivel_tca           = outputActual.analisis_tca?.nivel_tca_detectado || 'N/A';
    outputActual._equilibrio_tca      = outputActual.analisis_tca?.equilibrio_masividad_calificacion || false;
    outputActual._validacion_olimpo   = outputActual.validacion_olimpo || null;
    outputActual.indice_fidelidad               = calcularIndiceFidelidad(outputActual);
    outputActual.equivalencia_psicologica_calculada = extraerEquivalenciaPsicologica(outputActual);
    outputActual.progresion_emocional_calculada = calcularProgrecionEmocional(outputActual);
    outputActual.metricas_micro_loops           = calcularMetricasMicroLoops(outputActual);
    outputActual.paquete_juez_viral             = prepararPaqueteParaJuezViral(outputActual);
    outputActual.listo_para_auditoria           = outputActual.paquete_juez_viral?.listo_para_juez || false;

    outputActual.loop_info = {
      arquitectura: 'V2_DOS_FASES',
      score_adn: scoreAdn,
      score_final: scoreActual,
      palabras_guion: palabrasFinales,
      tokens_fase1: completionFase1.usage?.total_tokens || 0,
      tokens_fase2: completionFase2.usage?.total_tokens || 0,
      tokens_totales: tokensTotal
    };

    outputActual.analisis_estrategico = {
      sesgo_cognitivo_detectado: outputActual.adn_profundo?.frame_dominante?.frase_nucleo
        || outputActual.polarizacion?.ruptura_creencia_detectada || "Análisis Profundo",
      estrategia_adaptacion: outputActual.idea_nuclear_ganadora?.que_hace_viral
        || outputActual.adn_estructura?.patron_narrativo_detectado || "Estructura Viral Híbrida",
      genero_narrativo:  outputActual.adn_profundo?.genero_narrativo || null,
      emocion_nucleo:    outputActual.adn_profundo?.emocion_nucleo || null,
      tipo_tension:      outputActual.adn_profundo?.tipo_tension || null,
      posiciona_como:    outputActual.posicionamiento_y_proximos_pasos?.posiciona_como || null,
      nivel_fidelidad:   `${scoreActual}%`
    };

    console.log(`[MOTOR PRO V2] ✅ PROCESO COMPLETO`);
    console.log(`[MOTOR PRO V2] 📊 Score ADN: ${scoreActual}/100 | Palabras guion: ${palabrasFinales} | Tokens: ${tokensTotal}`);

    return { data: outputActual, tokens: tokensTotal };

  } catch (error: any) {
    console.error("[MOTOR PRO V2] ❌ Error Crítico:", error);
    if (outputActual && outputActual.adn_estructura) {
      console.warn("[MOTOR PRO V2] ⚠️ Recuperando resultado parcial.");
      return { data: outputActual, tokens: tokensTotal };
    }
    throw new Error("Fallo crítico en Ingeniería Inversa Pro: " + error.message);
  }
}


function prepararPaqueteParaJuezViral(outputMotores: any): any {
  try {
    const indice = outputMotores.indice_fidelidad || {};
    const psicologia = outputMotores.equivalencia_psicologica_calculada || {};
    const progresion = outputMotores.progresion_emocional_calculada || {};
    const loopsMetricas = outputMotores.metricas_micro_loops || {};
    const blueprint = outputMotores.blueprint_replicable || {};
    const scoreViral = outputMotores.score_viral_estructural || {};

    // Criterios que el Juez debe validar
    const criteriosValidacion = [
      {
        criterio: "Fidelidad Arquitectónica",
        valor_esperado: indice.indice_fidelidad || 0,
        umbral_minimo: 70,
        cumple: (indice.indice_fidelidad || 0) >= 70,
        diagnostico: indice.diagnostico || "Sin datos"
      },
      {
        criterio: "Progresión Emocional",
        valor_esperado: progresion.variacion_total || 0,
        umbral_minimo: 30,
        cumple: (progresion.variacion_total || 0) >= 30,
        diagnostico: progresion.diagnostico_curva || "Sin datos"
      },
      {
        criterio: "Micro-Loops",
        valor_esperado: loopsMetricas.total_loops || 0,
        umbral_minimo: 2,
        cumple: (loopsMetricas.total_loops || 0) >= 2,
        diagnostico: loopsMetricas.diagnostico_loops || "Sin datos"
      },
      {
        criterio: "Impacto Psicológico",
        valor_esperado: psicologia.score_impacto || 0,
        umbral_minimo: 50,
        cumple: (psicologia.score_impacto || 0) >= 50,
        diagnostico: psicologia.impacto_psicologico || "Sin datos"
      },
      {
        criterio: "Score Viral Estructural",
        valor_esperado: scoreViral.viralidad_estructural_global || 0,
        umbral_minimo: 70,
        cumple: (scoreViral.viralidad_estructural_global || 0) >= 70,
        diagnostico: scoreViral.viralidad_estructural_global >= 70
          ? "Score suficiente"
          : "Score por debajo del umbral"
      }
    ];

    // Calcular cuántos criterios se cumplen
    const criteriosCumplidos = criteriosValidacion.filter(c => c.cumple).length;
    const totalCriterios = criteriosValidacion.length;

    // Score de preparación para el Juez
    const scorePreparacion = Math.round((criteriosCumplidos / totalCriterios) * 100);

    // Instrucciones específicas para el Juez Viral
    const instruccionesJuez = blueprint.instrucciones_para_juez_viral ||
      `Audita este contenido verificando:
      1. Fidelidad al patrón: ${blueprint.nombre_patron || "detectado"}
      2. Fórmula base: ${blueprint.formula_base || "no disponible"}
      3. Equivalencia emocional: entrada=${psicologia.emocion_dominante}, salida=${psicologia.emocion_final}
      4. Tipo de tensión replicada: ${psicologia.tipo_tension}
      5. Loops mínimos requeridos: ${loopsMetricas.total_loops}`;

    // Alertas para el Juez
    const alertas: string[] = [];
    if (!progresion.escalada_detectada) {
      alertas.push("ALERTA: Sin escalada emocional detectada — verificar progresión");
    }
    if (loopsMetricas.loops_sin_resolver > 2) {
      alertas.push(`ALERTA: ${loopsMetricas.loops_sin_resolver} loops sin resolver — puede generar frustración`);
    }
    if (progresion.riesgo_monotonia === "Alto") {
      alertas.push("ALERTA: Riesgo alto de monotonía — curva emocional plana");
    }
    if ((indice.indice_fidelidad || 0) < 60) {
      alertas.push("ALERTA: Fidelidad arquitectónica baja — revisar orden de bloques");
    }

    return {
      listo_para_juez: scorePreparacion >= 60,
      score_preparacion: scorePreparacion,
      criterios_cumplidos: criteriosCumplidos,
      total_criterios: totalCriterios,
      criterios_validacion: criteriosValidacion,
      instrucciones_juez: instruccionesJuez,
      alertas_criticas: alertas,
      resumen_adn: {
        patron_detectado: blueprint.nombre_patron || "No detectado",
        formula_base: blueprint.formula_base || "No disponible",
        tipo_promesa: psicologia.tipo_promesa || "No detectada",
        tipo_tension: psicologia.tipo_tension || "No detectada",
        emocion_entrada: psicologia.emocion_dominante || "No detectada",
        emocion_salida: psicologia.emocion_final || "No detectada",
        sesgo_cognitivo: psicologia.sesgo_cognitivo_principal || "No detectado",
        loops_activos: loopsMetricas.total_loops || 0,
        indice_fidelidad: indice.indice_fidelidad || 0,
        score_viral: scoreViral.viralidad_estructural_global || 0
      }
    };

  } catch (e) {
    return {
      listo_para_juez: false,
      score_preparacion: 0,
      criterios_cumplidos: 0,
      total_criterios: 5,
      criterios_validacion: [],
      instrucciones_juez: "Error preparando paquete para Juez Viral",
      alertas_criticas: ["Error crítico en preparación"],
      resumen_adn: {}
    };
  }
}

function calcularMetricasMicroLoops(outputMotores: any): any {
  try {
    const loops = outputMotores.micro_loops;
    const estructura = outputMotores.adn_estructura;

    if (!loops || !loops.loops || loops.loops.length === 0) {
      return {
        total_loops: 0,
        loops_resueltos: 0,
        loops_sin_resolver: 0,
        frecuencia_promedio_segundos: 0,
        distribucion: [],
        efectividad_potencial: 0,
        densidad_anticipacion: 0,
        tipos_detectados: [],
        diagnostico_loops: "Sin micro-loops detectados — riesgo alto de abandono",
        recomendacion: "Agregar al menos 2 micro-loops entre el segundo 10 y 40"
      };
    }

    const todosLoops = loops.loops;

    // Contar resueltos vs sin resolver
    const loopsSinResolver = todosLoops.filter(
      (l: any) => l.segundo_cierre === null || l.segundo_cierre === undefined
    ).length;
    const loopsResueltos = todosLoops.length - loopsSinResolver;

    // Calcular frecuencia promedio
    const aperturas = todosLoops
      .map((l: any) => l.segundo_apertura)
      .filter((s: any) => typeof s === "number")
      .sort((a: number, b: number) => a - b);

    let frecuenciaPromedio = 0;
    if (aperturas.length >= 2) {
      const intervalos = aperturas.slice(1).map(
        (s: number, idx: number) => s - aperturas[idx]
      );
      frecuenciaPromedio = Math.round(
        intervalos.reduce((a: number, b: number) => a + b, 0) / intervalos.length
      );
    }

    // Distribución por tipo
    const tiposConteo: Record<string, number> = {};
    todosLoops.forEach((l: any) => {
      const tipo = l.tipo || "desconocido";
      tiposConteo[tipo] = (tiposConteo[tipo] || 0) + 1;
    });
    const distribucion = Object.entries(tiposConteo).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      porcentaje: Math.round((cantidad / todosLoops.length) * 100)
    }));

    // Tipos únicos detectados
    const tiposDetectados = Object.keys(tiposConteo);

    // Calcular efectividad potencial
    const intensidades = todosLoops.map((l: any) => l.intensidad || 0);
    const intensidadPromedio = intensidades.length > 0
      ? intensidades.reduce((a: number, b: number) => a + b, 0) / intensidades.length
      : 0;

    const penalizacionSinResolver = loopsSinResolver > 2 ? 15 : 0;
    const bonusFrecuencia = frecuenciaPromedio > 0 && frecuenciaPromedio <= 20 ? 20 : 0;

    const efectividadPotencial = Math.min(100, Math.round(
      (intensidadPromedio * 0.5) +
      (loopsResueltos / Math.max(todosLoops.length, 1) * 30) +
      bonusFrecuencia -
      penalizacionSinResolver
    ));

    // Diagnóstico
    let diagnostico = "";
    let recomendacion = "";

    if (todosLoops.length >= 3 && efectividadPotencial >= 70) {
      diagnostico = "Sistema de loops sólido — alta retención esperada";
      recomendacion = "Mantener la frecuencia actual en la adaptación";
    } else if (todosLoops.length >= 2 && efectividadPotencial >= 50) {
      diagnostico = "Loops presentes pero con margen de mejora";
      recomendacion = "Agregar un loop adicional entre el segundo 25 y 35";
    } else {
      diagnostico = "Loops insuficientes — riesgo medio de abandono";
      recomendacion = "Reestructurar con al menos 3 loops distribuidos cada 15 segundos";
    }

    return {
      total_loops: todosLoops.length,
      loops_resueltos: loopsResueltos,
      loops_sin_resolver: loopsSinResolver,
      frecuencia_promedio_segundos: frecuenciaPromedio,
      distribucion,
      tipos_detectados: tiposDetectados,
      efectividad_potencial: efectividadPotencial,
      densidad_anticipacion: loops.densidad_anticipacion || 0,
      estrategia_tension: loops.estrategia_tension || "No detectada",
      diagnostico_loops: diagnostico,
      recomendacion
    };

  } catch (e) {
    return {
      total_loops: 0,
      loops_resueltos: 0,
      loops_sin_resolver: 0,
      frecuencia_promedio_segundos: 0,
      distribucion: [],
      tipos_detectados: [],
      efectividad_potencial: 0,
      densidad_anticipacion: 0,
      diagnostico_loops: "Error calculando micro-loops",
      recomendacion: "Revisar manualmente"
    };
  }
}

function calcularProgrecionEmocional(outputMotores: any): any {
  try {
    const curva = outputMotores.curva_emocional;
    const estructura = outputMotores.adn_estructura;

    if (!curva) {
      return {
        mapa_bloques: [],
        escalada_detectada: false,
        riesgo_monotonia: "Alto",
        pico_maximo: 0,
        pico_minimo: 0,
        variacion_total: 0,
        momento_pico_principal: "No detectado",
        diagnostico_curva: "Sin datos de curva emocional"
      };
    }

    // Construir mapa por bloque
    const segmentos = curva.segmentos || [];
    const mapaBloques = segmentos.map((seg: any, idx: number) => {
      const intensidadAnterior = idx > 0 ? segmentos[idx - 1].intensidad : 0;
      const dinamica = seg.intensidad > intensidadAnterior
        ? "Subida"
        : seg.intensidad < intensidadAnterior
        ? "Bajada"
        : "Sostenida";

      return {
        bloque: seg.bloque,
        emocion: seg.emocion,
        intensidad: seg.intensidad || 0,
        dinamica,
        es_pico: false // se actualiza abajo
      };
    });

    // Detectar picos reales
    mapaBloques.forEach((bloque: any, idx: number) => {
      const anterior = idx > 0 ? mapaBloques[idx - 1].intensidad : 0;
      const siguiente = idx < mapaBloques.length - 1
        ? mapaBloques[idx + 1].intensidad
        : 0;
      if (bloque.intensidad > anterior && bloque.intensidad >= siguiente) {
        bloque.es_pico = true;
      }
    });

    // Calcular métricas
    const intensidades = mapaBloques.map((b: any) => b.intensidad);
    const picoMaximo = intensidades.length > 0 ? Math.max(...intensidades) : 0;
    const picoMinimo = intensidades.length > 0 ? Math.min(...intensidades) : 0;
    const variacionTotal = picoMaximo - picoMinimo;

    // Detectar escalada
    let escaladaDetectada = false;
    if (intensidades.length >= 3) {
      const primera_mitad = intensidades.slice(0, Math.floor(intensidades.length / 2));
      const segunda_mitad = intensidades.slice(Math.floor(intensidades.length / 2));
      const promedioPrimera = primera_mitad.reduce((a: number, b: number) => a + b, 0) / primera_mitad.length;
      const promedioSegunda = segunda_mitad.reduce((a: number, b: number) => a + b, 0) / segunda_mitad.length;
      escaladaDetectada = promedioSegunda > promedioPrimera;
    }

    // Riesgo de monotonía
    let riesgoMonotonia = "Bajo";
    if (variacionTotal < 20) riesgoMonotonia = "Alto";
    else if (variacionTotal < 40) riesgoMonotonia = "Medio";

    // Momento del pico principal
    const indicePico = intensidades.indexOf(picoMaximo);
    const momentoPico = mapaBloques[indicePico]?.bloque || "No detectado";

    // Picos adicionales del array original
    const picosOriginales = curva.picos_emocionales || [];

    return {
      mapa_bloques: mapaBloques,
      picos_emocionales: picosOriginales,
      escalada_detectada: escaladaDetectada,
      riesgo_monotonia: riesgoMonotonia,
      pico_maximo: picoMaximo,
      pico_minimo: picoMinimo,
      variacion_total: variacionTotal,
      momento_pico_principal: momentoPico,
      emocion_dominante: curva.emocion_dominante || "No detectada",
      emocion_final: curva.emocion_final || "No detectada",
      arco_emocional: curva.arco_emocional || "No detectado",
      diagnostico_curva: escaladaDetectada
        ? variacionTotal >= 40
          ? "Curva dinámica con escalada fuerte — alta retención esperada"
          : "Curva con escalada moderada — retención aceptable"
        : riesgoMonotonia === "Alto"
        ? "Curva plana — riesgo alto de abandono"
        : "Curva sin escalada clara — revisar progresión"
    };

  } catch (e) {
    return {
      mapa_bloques: [],
      escalada_detectada: false,
      riesgo_monotonia: "Alto",
      pico_maximo: 0,
      pico_minimo: 0,
      variacion_total: 0,
      momento_pico_principal: "Error",
      diagnostico_curva: "Error calculando progresión emocional"
    };
  }
}

function extraerEquivalenciaPsicologica(outputMotores: any): any {
  try {
    const polarizacion = outputMotores.polarizacion;
    const curva = outputMotores.curva_emocional;
    const densidad = outputMotores.densidad_valor;
    const status = outputMotores.status_y_posicionamiento;
    const activadores = outputMotores.activadores_guardado || [];

    // Detectar tipo de promesa
    const tipoValor = densidad?.tipo_valor_dominante || "educativo";
    const mapaPromesas: Record<string, string> = {
      "educativo": "Transformación de habilidad",
      "inspiracional": "Transformación de mentalidad",
      "entretenimiento": "Experiencia emocional",
      "provocacion": "Ruptura de creencia",
      "solucion": "Eliminación de dolor"
    };
    const tipoPromesa = mapaPromesas[tipoValor] || "Transformación general";

    // Detectar tipo de transformación
    const emocionFinal = curva?.emocion_final || "";
    let tipoTransformacion = "Mental";
    if (emocionFinal.toLowerCase().includes("esperanza") ||
        emocionFinal.toLowerCase().includes("motivacion")) {
      tipoTransformacion = "Emocional";
    } else if (emocionFinal.toLowerCase().includes("alivio") ||
               emocionFinal.toLowerCase().includes("claridad")) {
      tipoTransformacion = "Cognitiva";
    } else if (emocionFinal.toLowerCase().includes("ambicion") ||
               emocionFinal.toLowerCase().includes("deseo")) {
      tipoTransformacion = "Aspiracional";
    }

    // Detectar tipo de tensión
    const nivelConfrontacion = polarizacion?.nivel_confrontacion || 0;
    let tipoTension = "Tensión suave";
    if (nivelConfrontacion >= 70) tipoTension = "Confrontación directa";
    else if (nivelConfrontacion >= 40) tipoTension = "Fricción narrativa";
    else tipoTension = "Curiosidad progresiva";

    // Detectar tipo de activación
    const emocionDominante = curva?.emocion_dominante || "";
    let tipoActivacion = "Deseo";
    if (emocionDominante.toLowerCase().includes("miedo") ||
        emocionDominante.toLowerCase().includes("urgencia")) {
      tipoActivacion = "Urgencia / Aversión a la pérdida";
    } else if (emocionDominante.toLowerCase().includes("curiosidad")) {
      tipoActivacion = "Curiosidad / FOMO";
    } else if (emocionDominante.toLowerCase().includes("indignacion") ||
               emocionDominante.toLowerCase().includes("ira")) {
      tipoActivacion = "Indignación / Tribalismo";
    }

    // Detectar recompensa narrativa
    const tiposActivadores = activadores.map((a: any) => a.tipo);
    let recompensaNarrativa = "Insight accionable";
    if (tiposActivadores.includes("revelacion")) {
      recompensaNarrativa = "Revelación sorpresiva";
    } else if (tiposActivadores.includes("reencuadre")) {
      recompensaNarrativa = "Reencuadre mental";
    } else if (tiposActivadores.includes("formula_repetible")) {
      recompensaNarrativa = "Sistema replicable";
    }

    // Sesgo cognitivo principal
    const autoridad = status?.tipo_autoridad || "";
    let sesgoCognitivo = "Prueba social";
    if (nivelConfrontacion >= 60) sesgoCognitivo = "Pensamiento de grupo / Tribalismo";
    else if (autoridad === "experto_tecnico") sesgoCognitivo = "Autoridad";
    else if (tipoActivacion.includes("Urgencia")) sesgoCognitivo = "Aversión a la pérdida";
    else if (tipoActivacion.includes("Curiosidad")) sesgoCognitivo = "Curiosidad / Zeigarnik";

    // Score de impacto
    const intensidadPromedio = curva?.intensidad_promedio || 0;
    const variabilidad = curva?.variabilidad_emocional || 0;
    const scoreImpacto = Math.round(
      (intensidadPromedio * 0.4) +
      (variabilidad * 0.3) +
      (nivelConfrontacion * 0.3)
    );

    return {
      tipo_promesa: tipoPromesa,
      tipo_transformacion: tipoTransformacion,
      emocion_dominante: emocionDominante,
      emocion_final: emocionFinal,
      tipo_tension: tipoTension,
      tipo_activacion: tipoActivacion,
      recompensa_narrativa: recompensaNarrativa,
      sesgo_cognitivo_principal: sesgoCognitivo,
      impacto_psicologico: scoreImpacto >= 70 ? "Fuerte" : scoreImpacto >= 40 ? "Medio" : "Neutro",
      score_impacto: Math.min(100, scoreImpacto),
      nivel_activacion_emocional: Math.min(100, intensidadPromedio)
    };

  } catch (e) {
    return {
      tipo_promesa: "No detectado",
      tipo_transformacion: "No detectado",
      emocion_dominante: "No detectada",
      emocion_final: "No detectada",
      tipo_tension: "No detectada",
      tipo_activacion: "No detectado",
      recompensa_narrativa: "No detectada",
      sesgo_cognitivo_principal: "No detectado",
      impacto_psicologico: "Neutro",
      score_impacto: 0,
      nivel_activacion_emocional: 0
    };
  }
}

function calcularIndiceFidelidad(outputMotores: any): any {
  try {
    const estructura = outputMotores.adn_estructura;
    const curva = outputMotores.curva_emocional;
    const loops = outputMotores.micro_loops;

    if (!estructura) {
      return {
        bloques_detectados: 0,
        bloques_replicados: 0,
        secuencia_respetada: false,
        intensidad_equivalente: 0,
        curva_conservada: 0,
        indice_fidelidad: 0,
        diagnostico: "No se pudo analizar la estructura"
      };
    }

    // Contar bloques detectados
    const bloquesDetectados = estructura.bloques?.length || 0;

    // Verificar secuencia correcta
    const ordenEsperado = ["hook", "setup", "escalada", "giro", "climax", "resolucion", "cierre_estrategico"];
    const tiposDetectados = estructura.bloques?.map((b: any) => b.tipo) || [];
    let bloquesEnOrden = 0;
    tiposDetectados.forEach((tipo: string, idx: number) => {
      const posicionEsperada = ordenEsperado.indexOf(tipo);
      const posicionAnterior = idx > 0 ? ordenEsperado.indexOf(tiposDetectados[idx - 1]) : -1;
      if (posicionEsperada > posicionAnterior) bloquesEnOrden++;
    });

    const secuenciaRespetada = bloquesEnOrden >= Math.floor(bloquesDetectados * 0.7);

    // Calcular intensidad equivalente
    const intensidades = estructura.bloques?.map((b: any) => b.intensidad || 0) || [];
    const intensidadPromedio = intensidades.length > 0
      ? intensidades.reduce((a: number, b: number) => a + b, 0) / intensidades.length
      : 0;

    // Calcular curva conservada
    const picosCurva = curva?.picos_emocionales?.length || 0;
    const variabilidad = curva?.variabilidad_emocional || 0;
    const curvaConservada = Math.min(100, (picosCurva * 15) + (variabilidad * 0.5));

    // Score de loops
    const totalLoops = loops?.total_loops || 0;
    const scoreLoops = Math.min(100, totalLoops * 20);

    // Índice final ponderado
    const indiceFidelidad = Math.round(
      (secuenciaRespetada ? 30 : 0) +
      (Math.min(bloquesDetectados, 7) / 7 * 25) +
      (intensidadPromedio * 0.20) +
      (curvaConservada * 0.15) +
      (scoreLoops * 0.10)
    );

    return {
      bloques_detectados: bloquesDetectados,
      bloques_replicados: bloquesEnOrden,
      secuencia_respetada: secuenciaRespetada,
      intensidad_equivalente: Math.round(intensidadPromedio),
      curva_conservada: Math.round(curvaConservada),
      loops_detectados: totalLoops,
      indice_fidelidad: Math.min(100, indiceFidelidad),
      diagnostico: indiceFidelidad >= 80
        ? "Fidelidad alta — estructura bien replicada"
        : indiceFidelidad >= 60
        ? "Fidelidad media — revisar secuencia de bloques"
        : "Fidelidad baja — la adaptación alteró la arquitectura original"
    };

  } catch (e) {
    return {
      bloques_detectados: 0,
      bloques_replicados: 0,
      secuencia_respetada: false,
      intensidad_equivalente: 0,
      curva_conservada: 0,
      indice_fidelidad: 0,
      diagnostico: "Error calculando fidelidad"
    };
  }
}

function createEmergencyStructure(partialData: any, missingFields: string[]): any {
  return {
    score_viral: partialData.score_viral || {
      potencial_total: 0,
      factores_exito: ["Análisis parcial — datos insuficientes"],
      nivel_replicabilidad: "Baja"
    },
    adn_extraido: partialData.adn_extraido || {
      idea_ganadora: "No se pudo extraer",
      disparador_psicologico: "No detectado",
      estructura_exacta: "No detectada",
      formula_gancho: "No disponible"
    },
    desglose_temporal: partialData.desglose_temporal || [
      {
        segundo: "0-60",
        que_pasa: "Análisis temporal no disponible",
        porque_funciona: "Error en procesamiento",
        replicar_como: "Revisa el video manualmente"
      }
    ],
    patron_replicable: partialData.patron_replicable || {
      nombre_patron: "No detectado",
      formula: "N/A",
      aplicacion_generica: "No disponible"
    },
    produccion_deconstruida: partialData.produccion_deconstruida || {
      visuales_clave: ["No disponible"],
      ritmo_cortes: "No analizado",
      movimiento_camara: "No analizado",
      musica_sonido: "No analizado"
    },
    insights_algoritmicos: partialData.insights_algoritmicos || {
      optimizacion_retencion: "No disponible",
      triggers_engagement: "No disponible",
      seo_keywords: []
    },
    _emergency: true,
    _missing_fields: missingFields
  };
}

async function ejecutarAutopsiaViral(
  content: string,
  platform: string,
  openai: any,
  maxRetries: number = 2
): Promise<{ data: any; tokens: number }> {
  
  console.log('[AUTOPSIA V2] 🔬 Iniciando análisis forense...');
  console.log(`[AUTOPSIA V2] 📱 Plataforma: ${platform}`);
  console.log(`[AUTOPSIA V2] 📊 Longitud contenido: ${content.length} caracteres`);
  
  let attempt = 0;
  let lastError: any = null;
  let accumulatedTokens = 0;
  
  while (attempt < maxRetries) {
      attempt++;
      console.log(`[AUTOPSIA V2] 🔄 Intento ${attempt}/${maxRetries}`);
      
      try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [
              { 
                role: 'system', 
                content: 'Eres el forense de viralidad #1 del mundo. Tu especialidad es deconstruir videos virales hasta su ADN molecular. DEBES devolver JSON COMPLETO Y VÁLIDO con todas las secciones especificadas.' 
              },
              { 
                role: 'user', 
                content: `${PROMPT_AUTOPSIA_VIRAL(platform)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📝 CONTENIDO A ANALIZAR:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${content}` 
              }
            ],
            temperature: 0.5, // ✅ Ajustado de 0.3 a 0.5 para análisis más creativos
            max_tokens: 4096
          });
          
          const tokensUsed = completion.usage?.total_tokens || 0;
          accumulatedTokens += tokensUsed;
          
          console.log(`[AUTOPSIA V2] 📊 Tokens usados en intento ${attempt}: ${tokensUsed}`);
          
          const rawContent = completion.choices[0].message.content;
          
          if (!rawContent) {
              throw new Error('La IA devolvió una respuesta vacía');
          }
          
          const data = JSON.parse(rawContent);
          
          // ✅ VALIDACIÓN ESTRICTA
          const requiredFields = [
              'score_viral', 
              'adn_extraido', 
              'desglose_temporal', 
              'patron_replicable',
              'produccion_deconstruida',
              'insights_algoritmicos'
          ];
          
          const missingFields = requiredFields.filter(field => !data[field]);
          
          if (missingFields.length > 0) {
              console.warn(`[AUTOPSIA V2] ⚠️ Intento ${attempt}/${maxRetries} - Campos faltantes: ${missingFields.join(', ')}`);
              
              if (attempt < maxRetries) {
                  lastError = new Error(`Respuesta incompleta: ${missingFields.join(', ')}`);
                  await delay(1000); // Espera 1s antes de reintentar
                  continue;
              }
              
              // ✅ ÚLTIMO INTENTO: Usar estructura de emergencia
              console.log('[AUTOPSIA V2] 🚨 Último intento falló, usando estructura de emergencia');
              return {
                  data: createEmergencyStructure(data, missingFields),
                  tokens: accumulatedTokens
              };
          }
          
          // ✅ VALIDACIÓN ADICIONAL: Verificar que los arrays no estén vacíos
          if (!data.desglose_temporal || data.desglose_temporal.length === 0) {
              console.warn('[AUTOPSIA V2] ⚠️ desglose_temporal vacío');
              data.desglose_temporal = [{
                  segundo: "0-60",
                  que_pasa: "Análisis temporal no disponible",
                  porque_funciona: "No se pudo desglosar",
                  replicar_como: "Revisa manualmente el video"
              }];
          }
          
          if (!data.score_viral?.factores_exito || data.score_viral.factores_exito.length === 0) {
              console.warn('[AUTOPSIA V2] ⚠️ factores_exito vacío');
              data.score_viral.factores_exito = ["Análisis en progreso"];
          }
          
          // ✅ ÉXITO TOTAL
          console.log('[AUTOPSIA V2] ✅ Análisis completado exitosamente');
          console.log(`[AUTOPSIA V2] 📊 Score viral: ${data.score_viral?.potencial_total || 'N/A'}`);
          console.log(`[AUTOPSIA V2] 🧬 Patrón detectado: ${data.patron_replicable?.nombre_patron || 'N/A'}`);
          console.log(`[AUTOPSIA V2] ⏱️ Puntos temporales: ${data.desglose_temporal?.length || 0}`);
          
          return {
            data,
            tokens: accumulatedTokens
          };
          
      } catch (error: any) {
          console.error(`[AUTOPSIA V2] ❌ Error en intento ${attempt}/${maxRetries}:`, error.message);
          lastError = error;
          accumulatedTokens += 0; // No sumamos tokens si falló
          
          if (attempt < maxRetries) {
              console.log('[AUTOPSIA V2] 🔄 Reintentando...');
              await delay(1500); // Espera más tiempo antes del siguiente intento
              continue;
          }
      }
  }
  
  // ✅ FALLBACK FINAL: Todos los intentos fallaron
  console.error('[AUTOPSIA V2] ❌ Todos los intentos fallaron');
  console.error('[AUTOPSIA V2] 📝 Último error:', lastError?.message);
  
  return {
      data: createEmergencyStructure({}, ['score_viral', 'adn_extraido', 'desglose_temporal', 'patron_replicable', 'produccion_deconstruida', 'insights_algoritmicos']),
      tokens: accumulatedTokens
  };
}

const MIN_VIRAL_SCORE = 85;
const MAX_RETRIES = 3;

// ==================================================================================
// 🔬 VALIDADOR PROGRAMÁTICO DE OUTPUT — MOTOR DE CALIDAD V600
// P2: Verifica micro-loops, curva emocional, activadores, anti-clichés, estructura
// ==================================================================================

const CLICHES_PROHIBIDOS = [
  "en el mundo de hoy", "en este mundo tan", "hoy más que nunca",
  "¿sabías que?", "te has preguntado alguna vez", "la verdad es que",
  "sin más preámbulos", "a continuación te voy a", "voy a compartir contigo",
  "esto cambiará tu vida", "lo que nadie te dice", "el secreto que",
  "hace unos años yo también", "si yo pude tú también", "no te voy a mentir",
  "seré honesto contigo", "déjame contarte algo", "esto es lo que descubrí",
  "¿quieres saber cómo?", "quédate hasta el final", "no te vayas todavía",
  "dale like si", "comparte si crees que", "sígueme para más"
];

interface ResultadoValidacion {
  aprobado: boolean;
  score_total: number; // 0-100
  detalle: {
    estructura_completa: boolean;
    micro_loops_suficientes: boolean;
    curva_emocional_valida: boolean;
    activadores_presentes: boolean;
    sin_cliches: boolean;
    identidad_verbal: boolean;
    score_coherente: boolean;
  };
  fallos: string[];
  advertencias: string[];
}

// ==================================================================================
// 🚫 SCANNER ANTI-CLICHÉS ACTIVO — P4
// Escanea el guion_completo y reescribe frases débiles automáticamente
// ==================================================================================

async function escanearYLimpiarCliches(
  output: any,
  openai: any
): Promise<{ output: any; clichesEliminados: number; limpioDesdeInicio: boolean }> {

  const guionCompleto = output.guion_completo || output.guion || "";
  const hook = output.hook || "";
  const textoCompleto = guionCompleto + " " + hook;

  // Detectar clichés presentes
  const clichesEncontrados = CLICHES_PROHIBIDOS.filter(cliche =>
    textoCompleto.toLowerCase().includes(cliche.toLowerCase())
  );

  // Si no hay clichés, devolver sin cambios
  if (clichesEncontrados.length === 0) {
    console.log('[SCANNER] ✅ Sin clichés detectados — guion limpio');
    return { output, clichesEliminados: 0, limpioDesdeInicio: true };
  }

  console.log(`[SCANNER] ⚠️ ${clichesEncontrados.length} clichés detectados: "${clichesEncontrados.slice(0, 3).join('", "')}"`);
  console.log('[SCANNER] 🔧 Ejecutando reescritura quirúrgica...');

  const promptLimpieza = `
Eres un editor quirúrgico de guiones virales. Tu trabajo es REEMPLAZAR frases débiles sin alterar la estructura.

GUION ORIGINAL:
${guionCompleto}

HOOK ORIGINAL:
${hook}

FRASES PROHIBIDAS DETECTADAS QUE DEBES ELIMINAR:
${clichesEncontrados.map((c, i) => `${i + 1}. "${c}"`).join('\n')}

REGLAS DE REESCRITURA:
1. Reemplaza ÚNICAMENTE las frases prohibidas — no toques el resto
2. Mantén el tono, ritmo y estructura intactos
3. El reemplazo debe ser más específico, más disruptivo, más original
4. NO uses otras frases de la lista prohibida como reemplazo
5. El guion resultante debe sonar como el mismo creador, pero sin clichés

EJEMPLOS DE REEMPLAZO:
❌ "En el mundo de hoy..." → ✅ "En [contexto específico del tema]..."
❌ "Esto cambiará tu vida..." → ✅ "Esto explica por qué [resultado específico]..."
❌ "Lo que nadie te dice..." → ✅ "Lo que [grupo específico] oculta deliberadamente..."

DEVUELVE SOLO ESTE JSON:
{
  "guion_limpio": "El guion completo con las frases reemplazadas",
  "hook_limpio": "El hook con las frases reemplazadas (si aplicaba)",
  "reemplazos_realizados": [
    {
      "original": "frase eliminada",
      "reemplazo": "frase nueva",
      "razon": "por qué funciona mejor"
    }
  ]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres un editor quirúrgico. Devuelves SOLO JSON válido.' },
        { role: 'user', content: promptLimpieza }
      ],
      temperature: 0.4,
      max_tokens: 3000
    });

    const rawFase2 = completionFase2.choices[0].message.content || '{}';
let resultadoFase2: any = {};
try {
  resultadoFase2 = JSON.parse(rawFase2);
} catch (jsonErr) {
  console.warn('[MOTOR PRO V2] ⚠️ JSON truncado — intentando reparar...');
  // Reparar JSON cortado: cerrar strings y objetos abiertos
  let reparado = rawFase2.trimEnd();
  // Cerrar string abierta si termina sin comilla
  const openStrings = (reparado.match(/"/g) || []).length % 2;
  if (openStrings !== 0) reparado += '"';
  // Contar llaves y corchetes abiertos y cerrarlos
  let abiertasLlave  = (reparado.match(/{/g) || []).length - (reparado.match(/}/g) || []).length;
  let abiertosCorche = (reparado.match(/\[/g) || []).length - (reparado.match(/\]/g) || []).length;
  // Eliminar coma final si existe antes de cerrar
  reparado = reparado.replace(/,\s*$/, '');
  while (abiertosCorche-- > 0) reparado += ']';
  while (abiertasLlave-- > 0)  reparado += '}';
  try {
    resultadoFase2 = JSON.parse(reparado);
    console.log('[MOTOR PRO V2] ✅ JSON reparado exitosamente');
  } catch (e2) {
    console.error('[MOTOR PRO V2] ❌ JSON irreparable — usando fallback mínimo');
    resultadoFase2 = {
      guion_adaptado_al_nicho: rawFase2.substring(0, 3000),
      guion_tecnico_completo:  rawFase2.substring(0, 3000),
      _error_json: true,
      _motores_faltantes: ['json_truncado'],
    };
  }
}

    // Aplicar correcciones al output
    const outputLimpio = { ...output };

    if (resultado.guion_limpio && resultado.guion_limpio.length > 100) {
      outputLimpio.guion_completo = resultado.guion_limpio;
      outputLimpio.guion_tecnico_completo = resultado.guion_limpio;
    }

    if (resultado.hook_limpio && resultado.hook_limpio.length > 5) {
      outputLimpio.hook = resultado.hook_limpio;
    }

    // Agregar metadata de limpieza
    outputLimpio._limpieza_cliches = {
      cliches_detectados: clichesEncontrados,
      reemplazos_realizados: resultado.reemplazos_realizados || [],
      guion_fue_reescrito: true
    };

    const cantidadReemplazos = resultado.reemplazos_realizados?.length || clichesEncontrados.length;
    console.log(`[SCANNER] ✅ Reescritura completada — ${cantidadReemplazos} reemplazos`);

    return {
      output: outputLimpio,
      clichesEliminados: cantidadReemplazos,
      limpioDesdeInicio: false
    };

  } catch (e) {
    console.warn('[SCANNER] ⚠️ Fallo en reescritura — devolviendo original sin cambios');
    return { output, clichesEliminados: 0, limpioDesdeInicio: false };
  }
}

// ==================================================================================
// 📊 RECALCULADOR DE SCORE — P5
// Verifica coherencia entre score auto-reportado y estructura real del guion
// ==================================================================================

function recalcularScoreCoherente(output: any): {
  score_verificado: any;
  fue_ajustado: boolean;
  ajustes_realizados: string[];
} {
  const ajustes: string[] = [];
  const score = output.score_predictivo || {};
  const guionCompleto = output.guion_completo || output.guion || "";
  const estructura = output.estructura_desglosada || {};
  const microLoops = output.micro_loops_detectados || [];
  const activadores = output.activadores_psicologicos || [];
  const curva = output.curva_emocional || {};
  const identidad = output.identidad_verbal || {};

  // ── RETENTION SCORE ──
  // Criterios reales: hook + micro-loops + progresión
  let retentionReal = 0;
  const tieneHook = (output.hook || "").length > 10;
  const tieneLoops = microLoops.length >= 2;
  const tieneEstructura = Object.keys(estructura).length >= 4;
  const guionLargo = guionCompleto.length >= 300;

  if (tieneHook) retentionReal += 25;
  if (tieneLoops) retentionReal += 25;
  if (tieneEstructura) retentionReal += 25;
  if (guionLargo) retentionReal += 25;

  // ── SHARE SCORE ──
  // Criterios reales: frases memorables + datos contraintuitivos + reencuadres
  let shareReal = 0;
  const tiposFrases = activadores.map((a: any) => a.tipo || "");
  if (tiposFrases.includes('frase_memorable')) shareReal += 30;
  if (tiposFrases.includes('dato_contraintuitivo')) shareReal += 30;
  if (tiposFrases.includes('reencuadre') || tiposFrases.includes('marco_sistema')) shareReal += 20;
  if (activadores.length >= 3) shareReal += 20;

  // ── SAVE SCORE ──
  // Criterios reales: framework/sistema + activadores de guardado
  let saveReal = 0;
  if (tiposFrases.includes('marco_sistema')) saveReal += 35;
  if (activadores.length >= 2) saveReal += 35;
  const textoLower = guionCompleto.toLowerCase();
  const tieneNumeros = /\d+\s*(pasos?|puntos?|reglas?|claves?)/i.test(guionCompleto);
  if (tieneNumeros) saveReal += 30;

  // ── AUTHORITY SCORE ──
  // Criterios reales: posicionamiento + identidad verbal definida
  let authorityReal = 0;
  const tieneIdentidad = (
    identidad.nivel_agresividad !== undefined ||
    identidad.agresividad !== undefined
  );
  if (tieneIdentidad) authorityReal += 30;
  if (output.tipo_de_cierre && output.tipo_de_cierre.length > 5) authorityReal += 25;
  if (output.analisis_viral?.frases_autoridad?.length > 0) authorityReal += 25;
  if (curva.emocion_dominante || curva.inicio) authorityReal += 20;

  // ── VIRAL INDEX REAL ──
  const viralIndexReal = Math.round(
    retentionReal * 0.30 +
    shareReal * 0.20 +
    saveReal * 0.15 +
    authorityReal * 0.15 +
    // Impact score: usar el reportado si existe, sino estimar
    (Number(score.impact_score) || 50) * 0.20
  );

  // ── VERIFICAR COHERENCIA ──
  const retentionReportado = Number(score.retention_score) || 0;
  const shareReportado = Number(score.share_score) || 0;
  const saveReportado = Number(score.save_score) || 0;
  const authorityReportado = Number(score.authority_score) || 0;
  const viralReportado = Number(score.viral_index) || 0;

  const TOLERANCIA = 25; // Diferencia máxima aceptable entre reportado y real
  let fueAjustado = false;

  const scoreVerificado = { ...score };

  // Corregir retention si está muy inflado
  if (retentionReportado > retentionReal + TOLERANCIA) {
    scoreVerificado.retention_score = Math.round((retentionReportado + retentionReal) / 2);
    ajustes.push(`retention_score ajustado: ${retentionReportado} → ${scoreVerificado.retention_score} (real: ${retentionReal})`);
    fueAjustado = true;
  }

  // Corregir share si está muy inflado
  if (shareReportado > shareReal + TOLERANCIA) {
    scoreVerificado.share_score = Math.round((shareReportado + shareReal) / 2);
    ajustes.push(`share_score ajustado: ${shareReportado} → ${scoreVerificado.share_score} (real: ${shareReal})`);
    fueAjustado = true;
  }

  // Corregir save si está muy inflado
  if (saveReportado > saveReal + TOLERANCIA) {
    scoreVerificado.save_score = Math.round((saveReportado + saveReal) / 2);
    ajustes.push(`save_score ajustado: ${saveReportado} → ${scoreVerificado.save_score} (real: ${saveReal})`);
    fueAjustado = true;
  }

  // Corregir authority si está muy inflado
  if (authorityReportado > authorityReal + TOLERANCIA) {
    scoreVerificado.authority_score = Math.round((authorityReportado + authorityReal) / 2);
    ajustes.push(`authority_score ajustado: ${authorityReportado} → ${scoreVerificado.authority_score} (real: ${authorityReal})`);
    fueAjustado = true;
  }

  // Corregir viral_index si está muy inflado respecto al real
  if (viralReportado > viralIndexReal + TOLERANCIA) {
    scoreVerificado.viral_index = Math.round((viralReportado + viralIndexReal) / 2);
    ajustes.push(`viral_index ajustado: ${viralReportado} → ${scoreVerificado.viral_index} (real calculado: ${viralIndexReal})`);
    fueAjustado = true;
  }

  // Agregar scores reales como referencia
  scoreVerificado._scores_verificados = {
    retention_real: retentionReal,
    share_real: shareReal,
    save_real: saveReal,
    authority_real: authorityReal,
    viral_index_real: viralIndexReal
  };

  if (fueAjustado) {
    console.log(`[SCORE P5] ⚖️ Score ajustado por verificación estructural:`);
    ajustes.forEach(a => console.log(`[SCORE P5]   → ${a}`));
  } else {
    console.log(`[SCORE P5] ✅ Score coherente con estructura real`);
  }

  return {
    score_verificado: scoreVerificado,
    fue_ajustado: fueAjustado,
    ajustes_realizados: ajustes
  };
}

function validarOutputGenerador(output: any, preAnalisis?: any): ResultadoValidacion {
  const fallos: string[] = [];
  const advertencias: string[] = [];

  // ── 1. ESTRUCTURA COMPLETA ──
  const bloquesRequeridos = ['hook', 'desarrollo', 'escalada', 'insight', 'resolucion', 'cierre'];
  const estructuraDesglosada = output.estructura_desglosada || {};
  const tieneTodosLosBloques = bloquesRequeridos.every(bloque => {
    const existe = Object.keys(estructuraDesglosada).some(k =>
      k.toLowerCase().includes(bloque) || bloque.includes(k.toLowerCase())
    );
    if (!existe) fallos.push(`Bloque faltante en estructura: ${bloque}`);
    return existe;
  });

  // También verificar guion_completo no vacío
  const guionCompleto = output.guion_completo || output.guion || "";
  if (guionCompleto.length < 200) {
    fallos.push(`Guion demasiado corto: ${guionCompleto.length} chars (mínimo 200)`);
  }

  // ── 2. MICRO-LOOPS ──
  const microLoops = output.micro_loops_detectados || [];
  const microLoopsSuficientes = microLoops.length >= 2;
  if (!microLoopsSuficientes) {
    fallos.push(`Micro-loops insuficientes: ${microLoops.length}/2 requeridos`);
  }

  // ── 3. CURVA EMOCIONAL VÁLIDA ──
  const curvaEmocional = output.curva_emocional || {};
  // Verificar campos reales que genera el prompt del motor
  const camposCurva = ['inicio', 'pico_1', 'pico_2', 'cierre'];
  const camposFaltantes = camposCurva.filter(campo => !curvaEmocional[campo]);
  const curvaValida = camposFaltantes.length === 0;
  if (!curvaValida) {
    fallos.push(`Curva emocional incompleta. Faltan: ${camposFaltantes.join(', ')}`);
  }

  // Verificar también campos alternativos por si el modelo usa otro esquema
  const tieneEsquemaAlternativo = (
    curvaEmocional.emocion_dominante ||
    curvaEmocional.pico_intermedio ||
    curvaEmocional.inicio
  );
  const curvaValidaFinal = curvaValida || !!tieneEsquemaAlternativo;
  if (!curvaValidaFinal) {
    fallos.push(`Curva emocional vacía o sin campos reconocibles`);
  }

  // ── 4. ACTIVADORES PSICOLÓGICOS ──
  const activadores = output.activadores_psicologicos || [];
  const activadoresPresentes = activadores.length >= 3;
  if (!activadoresPresentes) {
    fallos.push(`Activadores insuficientes: ${activadores.length}/3 requeridos`);
  }

  // ── 5. ANTI-CLICHÉS ──
  const textoCompleto = (guionCompleto + " " + (output.hook || "")).toLowerCase();
  const clichesEncontrados = CLICHES_PROHIBIDOS.filter(cliche =>
    textoCompleto.includes(cliche.toLowerCase())
  );
  const sinCliches = clichesEncontrados.length === 0;
  if (!sinCliches) {
    fallos.push(`Clichés detectados (${clichesEncontrados.length}): "${clichesEncontrados.slice(0,2).join('", "')}"`);
  }

  // ── 6. IDENTIDAD VERBAL ──
  const identidadVerbal = output.identidad_verbal || {};
  const tieneIdentidad = (
    identidadVerbal.agresividad !== undefined ||
    identidadVerbal.polarizacion !== undefined ||
    identidadVerbal.sofisticacion !== undefined ||
    identidadVerbal.nivel_intensidad !== undefined ||
    identidadVerbal.nivel_agresividad !== undefined ||
    identidadVerbal.sofisticacion_lexica !== undefined
  );
  if (!tieneIdentidad) {
    advertencias.push("identidad_verbal sin métricas definidas");
  }

  // ── 7. SCORE COHERENTE ──
  const score = output.score_predictivo || {};
  const camposScore = ['retention_score', 'share_score', 'save_score', 'authority_score', 'viral_index'];
  const todosScores = camposScore.every(campo => {
    const val = Number(score[campo]);
    return !isNaN(val) && val >= 0 && val <= 100;
  });
  const scoreCoherente = todosScores;
  if (!scoreCoherente) {
    fallos.push("Score predictivo con valores inválidos o ausentes");
  }

  // Verificar coherencia interna: viral_index no puede estar muy por encima del promedio de los demás
  if (todosScores) {
    const promedio = (
      Number(score.retention_score) +
      Number(score.share_score) +
      Number(score.save_score) +
      Number(score.authority_score)
    ) / 4;
    const viralIndex = Number(score.viral_index);
    if (viralIndex > promedio + 25) {
      advertencias.push(`viral_index (${viralIndex}) inflado vs promedio de otros scores (${promedio.toFixed(0)})`);
    }
  }

  // ── SCORE TOTAL ──
 const criterios = [
    tieneTodosLosBloques,
    microLoopsSuficientes,
    curvaValidaFinal,   // ← era curvaValida
    activadoresPresentes,
    sinCliches,
    tieneIdentidad,
    scoreCoherente
  ];
  const pesos = [25, 20, 20, 15, 10, 5, 5];
  const scoreTotal = criterios.reduce((acc, ok, i) => acc + (ok ? pesos[i] : 0), 0);

  const aprobado = fallos.length === 0 && scoreTotal >= 80;

  // Log detallado
  console.log(`[VALIDADOR] 📊 Score calidad: ${scoreTotal}/100 | Fallos: ${fallos.length} | Advertencias: ${advertencias.length}`);
  if (fallos.length > 0) {
    console.log(`[VALIDADOR] ❌ Fallos: ${fallos.join(' | ')}`);
  }
  if (advertencias.length > 0) {
    console.log(`[VALIDADOR] ⚠️  Advertencias: ${advertencias.join(' | ')}`);
  }

  return {
    aprobado,
    score_total: scoreTotal,
    detalle: {
      estructura_completa: tieneTodosLosBloques,
      micro_loops_suficientes: microLoopsSuficientes,
      curva_emocional_valida: curvaValida,
      activadores_presentes: activadoresPresentes,
      sin_cliches: sinCliches,
      identidad_verbal: tieneIdentidad,
      score_coherente: scoreCoherente
    },
    fallos,
    advertencias
  };
}

// ==================================================================================
// 🏗️ ANALIZADOR DE ESTRUCTURA IMPLÍCITA — P6
// Detecta si un texto pegado ya tiene arquitectura narrativa propia
// ==================================================================================

async function analizarEstructuraImplicita(
  texto: string,
  openai: any
): Promise<{
  tiene_estructura: boolean;
  tipo_estructura: string;
  elementos_fuertes: string[];
  elementos_debiles: string[];
  hook_existente: string;
  cierre_existente: string;
  nivel_tension_actual: number;
  instruccion: 'preservar_y_elevar' | 'reestructurar_completo' | 'extraer_y_reconstruir';
  razon: string;
}> {

  // Textos muy cortos no tienen estructura — construir desde cero
  if (texto.length < 300) {
    return {
      tiene_estructura: false,
      tipo_estructura: 'ninguna',
      elementos_fuertes: [],
      elementos_debiles: [],
      hook_existente: '',
      cierre_existente: '',
      nivel_tension_actual: 20,
      instruccion: 'reestructurar_completo',
      razon: 'Texto demasiado corto para tener estructura propia'
    };
  }

  console.log(`[P6] 🏗️ Analizando estructura implícita (${texto.length} chars)...`);

  const prompt = `
Eres un Arquitecto Narrativo. Tu trabajo es detectar si un texto tiene estructura narrativa propia.

TEXTO A ANALIZAR:
${texto.substring(0, 2500)}

EJECUTA ESTOS 4 DETECTORES:

━━━━━━━━━━━━━━━━━━
DETECTOR 1 — ¿TIENE ESTRUCTURA?
━━━━━━━━━━━━━━━━━━
¿El texto tiene inicio, desarrollo y cierre distinguibles?
¿Hay progresión lógica o narrativa?
¿O es solo información plana sin arco?

━━━━━━━━━━━━━━━━━━
DETECTOR 2 — ELEMENTOS FUERTES
━━━━━━━━━━━━━━━━━━
¿Qué partes del texto tienen tensión, emoción o valor real?
¿Hay algún hook natural en las primeras líneas?
¿Hay algún cierre con fuerza?
Lista máximo 3 elementos fuertes. Si no hay ninguno, array vacío.

━━━━━━━━━━━━━━━━━━
DETECTOR 3 — ELEMENTOS DÉBILES
━━━━━━━━━━━━━━━━━━
¿Qué partes son planas, repetitivas o sin valor narrativo?
Lista máximo 3. Si no hay, array vacío.

━━━━━━━━━━━━━━━━━━
DETECTOR 4 — INSTRUCCIÓN PARA EL GENERADOR
━━━━━━━━━━━━━━━━━━
Basado en el análisis, elige UNA instrucción:
- "preservar_y_elevar": El texto tiene buena estructura — conservar el arco, elevar tensión y lenguaje
- "extraer_y_reconstruir": El texto tiene buenos elementos pero mala estructura — extraer lo valioso y reconstruir
- "reestructurar_completo": El texto no tiene estructura útil — usar solo el tema/datos, construir desde cero

DEVUELVE SOLO ESTE JSON:
{
  "tiene_estructura": true,
  "tipo_estructura": "PAS / Storytelling / Educativo / Informativo / Sin estructura",
  "elementos_fuertes": ["elemento 1", "elemento 2"],
  "elementos_debiles": ["elemento 1", "elemento 2"],
  "hook_existente": "Primera frase o apertura del texto original (vacío si no hay hook)",
  "cierre_existente": "Última frase o cierre del texto original (vacío si no hay cierre)",
  "nivel_tension_actual": 0,
  "instruccion": "preservar_y_elevar | extraer_y_reconstruir | reestructurar_completo",
  "razon": "Por qué elegiste esta instrucción en una frase"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres el Arquitecto Narrativo. Devuelves SOLO JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 600
    });

    const resultado = JSON.parse(completion.choices[0].message.content || '{}');
    console.log(`[P6] ✅ Estructura: ${resultado.tipo_estructura} | Instrucción: ${resultado.instruccion}`);
    console.log(`[P6] 💪 Elementos fuertes: ${resultado.elementos_fuertes?.length || 0} | Débiles: ${resultado.elementos_debiles?.length || 0}`);

    return resultado;

  } catch (e) {
    console.warn('[P6] ⚠️ Fallo en análisis, usando fallback');
    return {
      tiene_estructura: false,
      tipo_estructura: 'desconocida',
      elementos_fuertes: [],
      elementos_debiles: [],
      hook_existente: '',
      cierre_existente: '',
      nivel_tension_actual: 30,
      instruccion: 'extraer_y_reconstruir',
      razon: 'Error en análisis — reconstruir con lo disponible'
    };
  }
}

// ==================================================================================
// 🔍 PRE-ANALIZADOR DE INPUT — DETECTOR DE ADN NARRATIVO
// P1: Detecta conflicto, insight y partes planas antes de generar
// ==================================================================================

async function preAnalizarInput(
  input: string,
  tipoInput: 'idea' | 'texto' | 'imagen',
  openai: any
): Promise<{
  conflicto_central: string;
  insight_explotable: string;
  partes_planas: string[];
  transformacion_implicita: string;
  emocion_dominante: string;
  tension_detectada: number; // 0-100
  instrucciones_para_generador: string;
}> {
  
  // Ideas cortas no necesitan análisis profundo
  if (tipoInput === 'idea' && input.length < 200) {
    return {
      conflicto_central: input,
      insight_explotable: input,
      partes_planas: [],
      transformacion_implicita: "No definida — construir desde cero",
      emocion_dominante: "Curiosidad",
      tension_detectada: 50,
      instrucciones_para_generador: `Construye arquitectura completa desde cero sobre: "${input}". No tienes restricciones estructurales del input original.`
    };
  }

  console.log(`[PRE-ANÁLISIS] 🔍 Analizando input tipo: ${tipoInput} (${input.length} chars)`);

  const prompt = `
Eres el Detector de ADN Narrativo más preciso del mundo.
Tu trabajo NO es resumir. Es DISECCIONAR.

TIPO DE INPUT: ${tipoInput.toUpperCase()}

CONTENIDO:
${input.substring(0, 3000)}

EJECUTA LOS 5 DETECTORES EN SECUENCIA:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTOR 1 — CONFLICTO CENTRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Cuál es la tensión real explotable en este contenido?
NO la descripción. SÍ el conflicto narrativo específico.
Ejemplo malo: "Habla sobre redes sociales"
Ejemplo bueno: "La brecha entre esfuerzo visible y resultados invisibles destruye motivación"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTOR 2 — INSIGHT EXPLOTABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Qué verdad contraintuitiva o reencuadre mental se puede extraer?
Debe ser específico, no genérico.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTOR 3 — PARTES PLANAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Qué secciones son débiles, predecibles o no aportan tensión?
Lista máximo 3. Si no hay, devuelve array vacío.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTOR 4 — TRANSFORMACIÓN IMPLÍCITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿De qué estado emocional/mental a qué estado debe llevar al espectador?
Formato: "De [estado A] a [estado B]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETECTOR 5 — EMOCIÓN DOMINANTE + TENSIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Qué emoción domina este input?
¿Qué nivel de tensión tiene (0-100)?
0 = completamente plano, 100 = máxima tensión narrativa

DEVUELVE SOLO ESTE JSON:
{
  "conflicto_central": "string específico del conflicto real",
  "insight_explotable": "string del insight contraintuitivo",
  "partes_planas": ["parte 1", "parte 2"],
  "transformacion_implicita": "De X a Y",
  "emocion_dominante": "nombre de la emoción específica",
  "tension_detectada": 0,
  "instrucciones_para_generador": "Instrucciones específicas de cómo usar este ADN para construir el guion. Mínimo 3 directivas concretas."
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres el Detector de ADN Narrativo. Devuelves SOLO JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const resultado = JSON.parse(completion.choices[0].message.content || '{}');
    console.log(`[PRE-ANÁLISIS] ✅ Conflicto: "${resultado.conflicto_central?.substring(0, 60)}..."`);
    console.log(`[PRE-ANÁLISIS] ⚡ Tensión detectada: ${resultado.tension_detectada}/100`);
    
    return resultado;

  } catch (e) {
    console.warn('[PRE-ANÁLISIS] ⚠️ Fallo, usando fallback');
    return {
      conflicto_central: input.substring(0, 200),
      insight_explotable: "Extraer desde el contenido",
      partes_planas: [],
      transformacion_implicita: "De problema a solución",
      emocion_dominante: "Curiosidad",
      tension_detectada: 40,
      instrucciones_para_generador: "Usa el contenido base y construye tensión progresiva real."
    };
  }
}

// ==================================================================================
// 📊 TCA FEEDBACK — Guarda resultado real para calibración del sistema
// ==================================================================================

async function guardarFeedbackTCA(
  supabase: any,
  userId: string,
  guionData: any,
  feedbackData: any
): Promise<void> {
  try {
    const tca   = guionData.estrategia_tca   || {};
    const meta  = guionData.metadata_guion   || {};
    const score = guionData.score_predictivo || {};

    await supabase.from('tca_feedback').insert({
      user_id:                userId,
      guion_id:               guionData.id || `guion_${Date.now()}`,
      plataforma:             tca.plataforma_calibrada              || meta.plataforma || 'N/A',
      angulo_utilizado:       tca.angulo_activo                     || 'N/A',
      mass_appeal_score:      tca.mass_appeal_score                 || 0,
      cultural_tension_index: tca.cultural_tension_index?.score_total || 0,
      viral_index_predicho:   score.viral_index                     || 0,
      estructura:             meta.arquitectura                     || 'N/A',
      intensidad:             meta.nivel_intensidad                 || 'N/A',
      resultado_categoria:    feedbackData.resultado_categoria      || 'normal',
      vistas_48h:             feedbackData.vistas_48h               || null,
      notas_usuario:          feedbackData.notas                    || null
    });

    console.log(`[TCA FEEDBACK] ✅ Guardado — ${feedbackData.resultado_categoria} | vistas: ${feedbackData.vistas_48h || 'no reportadas'}`);

  } catch (err: any) {
    console.warn('[TCA FEEDBACK] ⚠️ Error guardando feedback:', err.message);
  }
}

// ==================================================================================
// 🌀 SISTEMA TCA IMPERIO — CAPA 0 DE ALCANCE MASIVO
// Teoría Circular de Alcance — Integración V600
// Se ejecuta ANTES del motor. No modifica P1-P6 ni el loop.
// ==================================================================================

async function ejecutarSistemaTCA(
  temaOriginal: string,
  settings: any,
  openai: any
): Promise<{
  tema_expandido: string;
  instruccion_tca: string;
  estrategia_tca: any;
  aprobado: boolean;
  advertencias: string[];
}> {

  const objective = settings.objective || 'Educar';
  const platform  = settings.platform  || 'TikTok';

  // Si el objetivo es autoridad profunda, TCA hace bypass total
  const esAlcanceMasivo = !['Autoridad Profunda', 'Deep Dive', 'Técnico'].includes(objective);
  if (!esAlcanceMasivo) {
    console.log('[TCA IMPERIO] ⚡ Bypass activo — objetivo de autoridad profunda detectado.');
    return {
      tema_expandido: temaOriginal,
      instruccion_tca: '',
      estrategia_tca: { modo: 'bypass_autoridad_profunda' },
      aprobado: true,
      advertencias: []
    };
  }

  console.log('[TCA IMPERIO] 🌀 Iniciando análisis de posicionamiento masivo...');
  console.log(`[TCA IMPERIO] 📋 Tema original: "${temaOriginal.substring(0, 80)}"`);

  // ── Pesos de agresión por plataforma ──────────────────────────────────────────
  const PLATFORM_AGGRESSION: Record<string, any> = {
    'TikTok': {
      angulo_dominante: 'Ataque + Shock',
      peso_intensidad: 0.40,
      peso_universalidad: 0.20,
      peso_debate: 0.20,
      peso_cti: 0.20,
      descripcion: 'Prioriza reacción inmediata. El shock y la amenaza directa superan la profundidad.'
    },
    'Instagram': {
      angulo_dominante: 'Identidad + Estatus',
      peso_intensidad: 0.30,
      peso_universalidad: 0.25,
      peso_debate: 0.20,
      peso_cti: 0.25,
      descripcion: 'Prioriza identidad aspiracional y estatus social. El espectador debe verse reflejado.'
    },
    'YouTube': {
      angulo_dominante: 'Debate Profundo + Revelación',
      peso_intensidad: 0.25,
      peso_universalidad: 0.25,
      peso_debate: 0.30,
      peso_cti: 0.20,
      descripcion: 'Prioriza promesa de revelación y debate de ideas. La profundidad retiene.'
    },
    'LinkedIn': {
      angulo_dominante: 'Autoridad + Creencia Equivocada',
      peso_intensidad: 0.20,
      peso_universalidad: 0.20,
      peso_debate: 0.35,
      peso_cti: 0.25,
      descripcion: 'Prioriza desafío a creencias del sector. La opinión contraria genera engagement.'
    }
  };

  const platConfig = PLATFORM_AGGRESSION[platform] || PLATFORM_AGGRESSION['TikTok'];

  // ── Contexto cultural del usuario ─────────────────────────────────
  const contextoCultural = settings.cultural_context_usuario || null;
  const tieneContexto    = !!contextoCultural;

  console.log(
    tieneContexto
      ? `[TCA TIMING] 🌡️ Contexto activo: "${contextoCultural?.substring(0, 60)}"`
      : '[TCA TIMING] 📊 Sin contexto — usando inferencia del modelo'
  );

  const promptTCA = `
Eres el Sistema TCA Imperio V2 — Teoría Circular de Alcance con Tensión Cultural.
Tu misión: posicionar el tema en el punto de máximo alcance masivo sincronizado
culturalmente, con el ángulo más agresivo compatible con la plataforma.

TEMA ORIGINAL: "${temaOriginal}"
PLATAFORMA: ${platform}
OBJETIVO: ${objective}
ÁNGULO DOMINANTE DE PLATAFORMA: ${platConfig.angulo_dominante}
DESCRIPCIÓN DE PLATAFORMA: ${platConfig.descripcion}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAPA DE 4 NIVELES TCA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
N1 = Micronicho Técnico — solo expertos (PROHIBIDO para alcance masivo)
N2 = Temática Principal — profesionales del sector ← ZONA VÁLIDA
N3 = Sector Masivo — personas con el problema ← ZONA VÁLIDA
N4 = Mainstream Irrelevante — audiencia sin potencial (PROHIBIDO)
Posicionar en: Intersección exacta N2–N3.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA 1 — CULTURAL TENSION INDEX (CTI) 0-100:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mide si el tema está culturalmente sincronizado con el momento actual.
Los videos que llegan a 5M no solo son masivos — son masivos Y culturalmente activos.

Evalúa y puntúa cada señal (0-25 por señal, máximo 100):

${tieneContexto ? `
⚡ CONTEXTO CULTURAL DIRECTO DEL CREADOR (PRIORIDAD MÁXIMA):
"${contextoCultural}"
Este dato es inteligencia de primera mano del nicho.
Vale más que cualquier API de tendencias con 48h de retraso.
Si conecta directamente con el tema, refléjalo en el CTI.
Con contexto relevante el CTI puede llegar a 90+/100.
` : `
Sin contexto directo del creador.
Usar inferencia conservadora basada en patrones estructurales del sector.
CTI máximo sin evidencia directa: 60/100.
`}

CTI Señal 1 — Momentum cultural activo (+25):
¿El tema conecta con una conversación social que está ocurriendo AHORA?
(crisis económica, cambio de paradigma laboral, revolución IA, polarización política, etc.)

CTI Señal 2 — Tensión latente del sector (+25):
¿Hay una creencia establecida en el nicho que está siendo cuestionada?
(ej: "el trabajo tradicional ya no funciona", "las redes sociales están cambiando el negocio")

CTI Señal 3 — Herida colectiva reciente (+25):
¿El tema toca una frustración o pérdida que muchas personas experimentaron recientemente?
(inflación, despidos masivos, promesas incumplidas de gurus, estafas, etc.)

CTI Señal 4 — Ventana de oportunidad urgente (+25):
¿Hay una razón implícita para consumir este contenido AHORA y no en 6 meses?
(cambio de algoritmo, nueva ley, tendencia que está creciendo, amenaza inminente)

CTI < 40 → tema atemporalmente bueno pero sin explosividad cultural
CTI 40-70 → tema sincronizado con el momento
CTI > 70 → tema en intersección perfecta con tensión cultural activa → EXPLOSIVO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA 2 — ANGLE AMPLIFIER (4 ÁNGULOS DE MÁXIMA AGRESIÓN):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
El ángulo multiplica el alcance. Un tema neutro no escala aunque esté bien posicionado.
Para ${platform} el ángulo dominante es: ${platConfig.angulo_dominante}

Genera los 4 ángulos posibles y selecciona el más potente para la plataforma:

ÁNGULO 1 — AMENAZA DIRECTA:
"Si sigues haciendo X, perderás Y" / "Esto está destruyendo tu Z"
Activa instinto de supervivencia. El más potente en TikTok.

ÁNGULO 2 — ERROR MASIVO (tú también lo cometes):
"El error que el 90% comete sin saberlo" / "Lo que nadie te dijo sobre X"
Activa ego y curiosidad simultáneamente.

ÁNGULO 3 — CREENCIA EQUIVOCADA (reencuadre):
"Todos creen que X, pero la realidad es Y"
Desafía identidad establecida. Máximo debate. Potente en LinkedIn/YouTube.

ÁNGULO 4 — IDENTIDAD Y ESTATUS (aspiracional):
"Las personas que logran X hacen esto diferente" / "Esto separa a los que triunfan de los que no"
Activa comparación social y aspiración. Dominante en Instagram.

Seleccionar el ángulo más agresivo COMPATIBLE con ${platform}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SISTEMA 3 — MASS APPEAL SCORE V2 CON PESOS DE PLATAFORMA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANTE: En viralidad real, intensidad emocional supera a universalidad.
Un tema 70% universal + intensidad extrema supera a 100% universal + intensidad débil.

Componentes del score (pesos calibrados para ${platform}):

INTENSIDAD EMOCIONAL (peso: ${platConfig.peso_intensidad * 100}%) — 0-100 puntos:
¿Qué tan fuerte es la reacción emocional que genera? (miedo, rabia, ambición, orgullo)
Multiplicado por ${platConfig.peso_intensidad}

UNIVERSALIDAD (peso: ${platConfig.peso_universalidad * 100}%) — 0-100 puntos:
+25 interés universal (dinero/salud/estatus/relaciones/mentalidad/libertad)
+25 sin requisito técnico previo
+25 problema que millones reconocen
+25 no requiere contexto de nicho
Multiplicado por ${platConfig.peso_universalidad}

POTENCIAL DE DEBATE (peso: ${platConfig.peso_debate * 100}%) — 0-100 puntos:
+25 genera opiniones divididas
+25 desafía creencia establecida
+25 tiene potencial polarizante
+25 invita a comentar/compartir para validarse
Multiplicado por ${platConfig.peso_debate}

CULTURAL TENSION INDEX (peso: ${platConfig.peso_cti * 100}%) — 0-100 puntos:
Usar el CTI calculado arriba
Multiplicado por ${platConfig.peso_cti}

MASS_APPEAL_SCORE_V2 = (Intensidad × ${platConfig.peso_intensidad}) + (Universalidad × ${platConfig.peso_universalidad}) + (Debate × ${platConfig.peso_debate}) + (CTI × ${platConfig.peso_cti})

REGLA: Si mass_appeal_score_v2 < 70 → reformular hasta superar 70.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILTRO ANTI-300-VISTAS (reformular si detecta):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Procedimientos paso a paso técnicos
❌ Micro-optimizaciones específicas de nicho
❌ Jerga exclusiva que solo entiende el 5% del sector
❌ Hook neutral sin ángulo de amenaza, error o creencia equivocada

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOBLE CAPA NARRATIVA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Capa Visible: debate o historia que ve la audiencia masiva
Capa Estratégica: autoridad implícita que detecta el prospecto ideal

Responde SOLO con este JSON válido. Sin markdown, sin texto extra:
{
  "nivel_original": "N1 | N2 | N3 | N4",
  "sector_universal": "el interés universal que conecta con millones",
  "cultural_tension_index": {
    "score_total": 0,
    "momentum_cultural": 0,
    "tension_latente_sector": 0,
    "herida_colectiva": 0,
    "ventana_urgencia": 0,
    "descripcion_tension": "qué tensión cultural específica activa este tema"
  },
  "angle_amplifier": {
    "angulo_seleccionado": "AMENAZA | ERROR_MASIVO | CREENCIA_EQUIVOCADA | IDENTIDAD_ESTATUS",
    "razon_seleccion": "por qué este ángulo es el más potente para ${platform}",
    "formulacion_angulo": "la formulación exacta del ángulo seleccionado",
    "angulos_alternativos": [
      { "tipo": "AMENAZA", "formulacion": "..." },
      { "tipo": "ERROR_MASIVO", "formulacion": "..." },
      { "tipo": "CREENCIA_EQUIVOCADA", "formulacion": "..." },
      { "tipo": "IDENTIDAD_ESTATUS", "formulacion": "..." }
    ]
  },
  "mass_appeal_score_v2": {
    "score_final": 0,
    "intensidad_emocional_raw": 0,
    "universalidad_raw": 0,
    "debate_raw": 0,
    "cti_raw": 0,
    "score_ponderado_plataforma": 0,
    "plataforma_calibrada": "${platform}"
  },
  "tema_expandido": "el tema reposicionado en N2-N3 con el ángulo más agresivo para ${platform}",
  "hook_sectorial": "premisa del hook con el ángulo seleccionado, cero jerga técnica",
  "capa_visible": "qué ve y siente la audiencia masiva",
  "capa_estrategica": "qué autoridad implícita detecta el prospecto ideal",
  "tipo_embudo": "TOFU | MOFU | BOFU",
  "instruccion_doble_capa": "instrucción directa para el generador V600",
  "aprobado": true,
  "advertencias": [],
  "reformulaciones_alternativas": [
    "alternativa 1 — ángulo diferente con score mayor",
    "alternativa 2",
    "alternativa 3"
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: promptTCA }],
      temperature: 0.4,
      max_tokens: 2000  // V2 necesita espacio para CTI + Angle Amplifier + JSON completo
    });

    const raw = response.choices[0].message.content || '';
    // Extrae el JSON más largo (el objeto principal, no un sub-objeto)
    const jsonMatches = [...raw.matchAll(/\{[\s\S]*?\}/g)];
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('TCA: JSON no encontrado en respuesta');

    let tcaData: any;
    try {
      tcaData = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      // Si el JSON está truncado, intentar reparación básica
      const truncated = jsonMatch[0];
      const repaired = truncated.endsWith('}') ? truncated : truncated + '}}';
      try {
        tcaData = JSON.parse(repaired);
        console.warn('[TCA IMPERIO] ⚠️ JSON reparado tras truncamiento — considera aumentar max_tokens');
      } catch {
        throw new Error('TCA: JSON inválido incluso tras reparación');
      }
    }
    // V2 — leer score ponderado por plataforma
    const score = tcaData.mass_appeal_score_v2?.score_final || tcaData.mass_appeal_score || 0;
    const cti   = tcaData.cultural_tension_index?.score_total || 0;
    const angulo = tcaData.angle_amplifier?.angulo_seleccionado || 'N/A';
    const formulacionAngulo = tcaData.angle_amplifier?.formulacion_angulo || '';

    console.log(`[TCA IMPERIO] 📊 Mass Appeal Score V2: ${score}/100 (calibrado para ${platform})`);
    console.log(`[TCA IMPERIO] 🔥 Cultural Tension Index: ${cti}/100 — ${tcaData.cultural_tension_index?.descripcion_tension || ''}`);
    console.log(`[TCA IMPERIO] 🎯 Ángulo seleccionado: ${angulo} — "${formulacionAngulo.substring(0, 60)}"`);
    console.log(`[TCA IMPERIO] 📍 Nivel: ${tcaData.nivel_original} → N2-N3`);
    console.log(`[TCA IMPERIO] 🗣️ Tema expandido: "${(tcaData.tema_expandido || '').substring(0, 80)}"`);

    // Si el score es bajo, usar la mejor reformulación alternativa
    let temaFinal = tcaData.tema_expandido || temaOriginal;
    if (score < 70 && tcaData.reformulaciones_alternativas?.length > 0) {
      temaFinal = tcaData.reformulaciones_alternativas[0];
      console.log(`[TCA IMPERIO] ⚠️ Score bajo (${score}/100). Usando reformulación con mayor alcance.`);
    }

    // Construir instrucción de doble capa para inyectar al generador
    // Construir instrucción de doble capa para inyectar al generador
    const instruccionDobleCapa = `
   [TCA IMPERIO V2 — DIRECTIVAS DE ALCANCE MASIVO + TENSIÓN CULTURAL]:

   PLATAFORMA CALIBRADA: ${platform} (${platConfig.angulo_dominante})
   Sector Universal: ${tcaData.sector_universal}
   Mass Appeal Score V2: ${score}/100

   CULTURAL TENSION INDEX: ${cti}/100
   Tensión cultural activa: ${tcaData.cultural_tension_index?.descripcion_tension || 'No identificada'}
   → Usa esta tensión cultural como contexto emocional de fondo en todo el guion.
   → El espectador debe sentir que este contenido responde a algo que está viviendo HOY.

   ÁNGULO NARRATIVO OBLIGATORIO: ${angulo}
   Formulación exacta: ${formulacionAngulo}
   Razón: ${tcaData.angle_amplifier?.razon_seleccion || ''}
   → El hook DEBE usar este ángulo. No el tema neutro — el ángulo agresivo.
   → Ángulos alternativos disponibles para micro-loops: ${tcaData.angle_amplifier?.angulos_alternativos?.map((a: any) => a.formulacion).join(' | ') || ''}

  HOOK SECTORIAL CON ÁNGULO: ${tcaData.hook_sectorial}

  CAPA VISIBLE (audiencia masiva debe ver): ${tcaData.capa_visible}
  CAPA ESTRATÉGICA (prospecto ideal debe detectar): ${tcaData.capa_estrategica}

  INSTRUCCIÓN DOBLE CAPA: ${tcaData.instruccion_doble_capa}

  REGLAS TCA V2 ACTIVAS (no negociables para ${platform}):
  ✓ Usar el ángulo ${angulo} desde el primer segundo del hook
  ✓ Sincronizar con la tensión cultural: ${tcaData.cultural_tension_index?.descripcion_tension || 'momento actual'}
  ✓ Polarizar desde el ángulo seleccionado — no desde neutralidad
  ✓ Posicionar autoridad IMPLÍCITA — demostrar, no proclamar
  ✓ El espectador debe sentir urgencia de ver esto AHORA, no en 6 meses
  ✗ NO usar ángulo neutro ("cómo hacer X") — usar ángulo de ${angulo}
  ✗ NO sonar atemporal — conectar con tensión del momento presente
  ✗ NO vender directamente en este contenido de alcance masivo
`; // 👈 ¡ESTA COMILLA INVERTIDA Y EL PUNTO Y COMA ERAN LOS CULPABLES!

    // ==============================================================================
    // ✅ VERIFICACIÓN — Qué ver en consola con V2 activo
    // ==============================================================================
    console.log('\n[TCA IMPERIO] 🌀 Iniciando análisis de posicionamiento masivo...');
    console.log(`[TCA IMPERIO] 📊 Mass Appeal Score V2: ${score}/100 (calibrado para ${platform})`);
    console.log(`[TCA IMPERIO] 🔥 Cultural Tension Index: ${cti}/100 — ${tcaData.cultural_tension_index?.descripcion_tension || 'Tensión detectada'}`);
    console.log(`[TCA IMPERIO] 🎯 Ángulo seleccionado: ${angulo ? angulo.toUpperCase() : 'AMENAZA'} — "${formulacionAngulo ? formulacionAngulo.substring(0, 50) : ''}..."`);
    console.log(`[TCA IMPERIO] 📍 Nivel: ${tcaData.nivel_original || 'N1'} → N2-N3`);
    console.log(`[TCA IMPERIO] 🗣️ Tema expandido: "${temaFinal ? temaFinal.substring(0, 60) : ''}..."`);
    console.log(`[TCA IMPERIO] ✅ Tema expandido al sector masivo\n`);

    // 👇 RETORNO DEL OBJETO
    return {
      tema_expandido: temaFinal,               // Tema limpio para tema_especifico
      instruccion_tca: instruccionDobleCapa,    // Instrucción separada para el prompt
      estrategia_tca: {
        version: 'TCA_IMPERIO_V2',
        nivel_posicionamiento: 'Interseccion N2-N3',
        nivel_original: tcaData.nivel_original,
        sector_utilizado: tcaData.sector_universal,
        mass_appeal_score: score,
        mass_appeal_score_v2: tcaData.mass_appeal_score_v2,
        cultural_tension_index: tcaData.cultural_tension_index,
        angle_amplifier: tcaData.angle_amplifier,
        angulo_activo: angulo,
        formulacion_angulo: formulacionAngulo,
        plataforma_calibrada: platform,
        angulo_dominante_plataforma: platConfig.angulo_dominante,
        tipo_contenido_embudo: tcaData.tipo_embudo || 'TOFU',
        hook_sectorial: tcaData.hook_sectorial,
        capa_visible: tcaData.capa_visible,
        capa_estrategica: tcaData.capa_estrategica,
        equilibrio_masividad_calificacion: score >= 70,
        tema_original: temaOriginal,
        tema_expandido_final: temaFinal,
        reformulaciones_disponibles: tcaData.reformulaciones_alternativas || []
      },
      aprobado: tcaData.aprobado !== false,
      advertencias: tcaData.advertencias || []
    };

  } catch (err: any) {
    console.warn('[TCA IMPERIO] ⚠️ Error en análisis. Bypass activado — V600 continúa normalmente.', err.message);
    return {
      tema_expandido: temaOriginal,
      instruccion_tca: '',
      estrategia_tca: { modo: 'bypass_error', error: err.message },
      aprobado: true,
      advertencias: ['TCA: análisis no disponible — tema usado como fue ingresado']
    };
  }
}
async function ejecutarGeneradorGuiones(
  contexto: any,
  viralDNA: any | null,
  openai: any,
  settings: any = {}
): Promise<{ data: any; tokens: number }> {

  console.log('[MOTOR V600] 🔥 Iniciando generación con loop de optimización...');
  console.log(`[MOTOR V600] 📱 Plataforma: ${settings.platform || 'TikTok'}`);
  console.log(`[MOTOR V600] 🏗️ Estructura: ${settings.structure || 'winner_rocket'}`);
  console.log(`[MOTOR V600] 🎯 Tema: ${contexto.tema_especifico || contexto.nicho}`);
  console.log(`[MOTOR V600] 🔁 Umbral mínimo: ${MIN_VIRAL_SCORE} | Máx intentos: ${MAX_RETRIES}`);

  let tokensTotal = 0;
  let mejorResultado: any = null;
  let mejorScore = 0;
  let intentoActual = 0;
  
  let retroalimentacionLoop = "";

  // ==================================================================================
  // LOOP DE OPTIMIZACIÓN
  // ==================================================================================

  while (intentoActual < MAX_RETRIES) {
    intentoActual++;
    console.log(`[MOTOR V600] 🔄 Intento ${intentoActual}/${MAX_RETRIES}...`);

    // ── Activar modo refinamiento a partir del intento 2 ──
    const settingsIntento = {
      ...settings,
      intensidad_extra: intentoActual > 1,
      intento_numero: intentoActual,
    };

    if (intentoActual > 1) {
      console.log(`[MOTOR V600] ⚡ Modo refinamiento ACTIVO (intento ${intentoActual})`);
    }

    // ── PASO 1: El Estratega ──
    let promptEstrategia = '';

    if (intentoActual > 1) {
      promptEstrategia = `
INTENTO ${intentoActual} — MODO REFINAMIENTO OBLIGATORIO:
El guion anterior NO alcanzó el umbral de dominancia (viral_index < ${MIN_VIRAL_SCORE}).
Debes generar una versión RADICALMENTE DIFERENTE y más poderosa.

TEMA: "${contexto.tema_especifico}" | NICHO: "${contexto.nicho}"
PLATAFORMA: ${settings.platform || 'TikTok'}

INSTRUCCIONES DE REFUERZO OBLIGATORIAS:
1. Aumenta la tensión narrativa — cada bloque debe escalar más que el anterior
2. Aumenta la polarización estratégica — toma postura más definida y confrontacional
3. Refuerza los hooks — hook principal debe atacar ego o creencia central del avatar
4. Inserta más micro-loops — mínimo 3 loops de curiosidad abiertos
5. Eleva activadores psicológicos — al menos 3 activadores de guardado/share
6. Aumenta diferenciación estructural — debe sonar COMPLETAMENTE diferente al creador promedio

NO puedes repetir la misma estructura con cambios superficiales.
Elige variantes de ejecución completamente distintas al intento anterior.

Diseña un esquema de máxima disrupción para este tema.
`;
    } else {
      if (viralDNA) {
        promptEstrategia = `
ANALIZA este ADN Viral: ${JSON.stringify(viralDNA.adn_extraido || {})}
OBJETIVO: Adaptarlo al nicho "${settings.manual_niche || contexto.nicho}".
TAREA: Crea un ESQUEMA LÓGICO paso a paso de cómo adaptar la estructura al nuevo nicho.
NO escribas el guion aún. Solo define los puntos clave de la trama.
`;
      } else {
        promptEstrategia = `
OBJETIVO: Crear un guion viral para "${contexto.tema_especifico}" en el nicho "${contexto.nicho}".
PLATAFORMA: ${settings.platform || 'TikTok'}
TAREA: Diseña una estructura ganadora (Gancho -> Retención -> Payoff).
Define qué sesgos psicológicos usarás en cada segundo.
`;
      }
    }

    const estrategia = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un Estratega de Marketing Viral de clase mundial.' },
        { role: 'user', content: promptEstrategia }
      ],
      temperature: intentoActual === 1 ? 0.7 : 0.9, // Más creatividad en reintentos
      max_tokens: 1500
    });

    const planEstrategico = estrategia.choices[0].message.content;
    tokensTotal += estrategia.usage?.total_tokens || 0;

    // ── PASO 2: El Ejecutor ──
    const systemPrompt = PROMPT_GENERADOR_GUIONES(contexto, viralDNA, settingsIntento);

    const refinamientoExtra = intentoActual > 1 ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 MODO REFINAMIENTO ACTIVO — INTENTO ${intentoActual}/${MAX_RETRIES}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El intento anterior NO superó viral_index ≥ ${MIN_VIRAL_SCORE}.

INSTRUCCIONES DE EMERGENCIA OBLIGATORIAS:
✦ Tensión narrativa: MÁXIMA — cada bloque debe escalar sin pausa
✦ Polarización: ACTIVA — toma postura radical y definida sin concesiones  
✦ Hook: REFORZADO — ataca ego, creencia o dolor central en los primeros 2 segundos
✦ Micro-loops: MÍNIMO 3 — abrir preguntas sin respuesta antes del insight
✦ Activadores: MÍNIMO 3 — frase memorable + dato contraintuitivo + reencuadre mental
✦ Diferenciación: RADICAL — debe sonar imposible de confundir con otro creador
✦ Variante de ejecución: COMPLETAMENTE DISTINTA al intento anterior

⚠️ NO REPITAS: misma apertura, misma estructura, mismas fórmulas del intento anterior.
REINVENTA el ángulo narrativo desde cero.

${retroalimentacionLoop}

` : '';

    const finalPrompt = systemPrompt + refinamientoExtra + `\n\n🛡️ PLAN ESTRATÉGICO:\n${planEstrategico}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres el Motor de Viralidad e Influencia V600.' },
        { role: 'user', content: finalPrompt }
      ],
      temperature: intentoActual === 1 ? 0.75 : Math.min(0.75 + (intentoActual * 0.1), 0.95),
      max_tokens: 4500
    });

    tokensTotal += completion.usage?.total_tokens || 0;

    let parsedData: any = {};
    try {
      parsedData = JSON.parse(completion.choices[0].message.content || '{}');
    } catch (e) {
      console.error(`[MOTOR V600] ❌ Error parseando JSON en intento ${intentoActual}`);
      continue;
    }

    // ── PASO 3: Validación obligatoria del score ──
    const scorePredictivo = parsedData.score_predictivo;

    if (!scorePredictivo) {
      console.warn(`[MOTOR V600] ⚠️ Intento ${intentoActual}: score_predictivo ausente — rechazando`);
      // Guardar como fallback si no hay nada mejor
      if (!mejorResultado) mejorResultado = parsedData;
      continue;
    }

    const viralIndex = scorePredictivo.viral_index;

    if (typeof viralIndex !== 'number' || isNaN(viralIndex)) {
      console.warn(`[MOTOR V600] ⚠️ Intento ${intentoActual}: viral_index no es numérico (${viralIndex}) — rechazando`);
      if (!mejorResultado) mejorResultado = parsedData;
      continue;
    }

    console.log(`[MOTOR V600] 📊 Intento ${intentoActual} — viral_index: ${viralIndex}`);

    // ── P4: SCANNER ANTI-CLICHÉS ACTIVO (PRIMERO — antes de guardar nada) ──
    const scannerResult = await escanearYLimpiarCliches(parsedData, openai);
    if (!scannerResult.limpioDesdeInicio) {
      console.log(`[MOTOR V600] 🧹 Clichés eliminados: ${scannerResult.clichesEliminados}`);
      parsedData = scannerResult.output; // Versión limpia garantizada
    }

    // ── P5: VERIFICACIÓN DE SCORE COHERENTE (sobre datos ya limpios) ──
    const scoreCheck = recalcularScoreCoherente(parsedData);
    if (scoreCheck.fue_ajustado) {
      parsedData.score_predictivo = scoreCheck.score_verificado;
      console.log(`[MOTOR V600] ⚖️ Score corregido por P5 — ${scoreCheck.ajustes_realizados.length} ajustes`);
    }

    // ── viralIndex VERIFICADO (post-P5, score real) ──
    const viralIndexVerificado = Number(parsedData.score_predictivo?.viral_index) || viralIndex;

    // ── Guardar el mejor resultado LIMPIO Y VERIFICADO ──
    if (viralIndexVerificado > mejorScore) {
      mejorScore = viralIndexVerificado;
      mejorResultado = parsedData; // Siempre guardamos versión post-P4/P5
      console.log(`[MOTOR V600] ✅ Nuevo mejor score verificado: ${mejorScore}`);
    }

    // ── VALIDACIÓN PROGRAMÁTICA V600 ──
    const validacion = validarOutputGenerador(parsedData);

    if (validacion.aprobado) {
      console.log(`[MOTOR V600] ✅ Intento ${intentoActual} APROBADO — Calidad: ${validacion.score_total}/100`);
      parsedData._validacion_calidad = validacion;
      mejorResultado = parsedData;
      mejorScore = viralIndexVerificado; // Score real, no inflado
      break;
    }

    console.log(`[MOTOR V600] ❌ Intento ${intentoActual} RECHAZADO — Calidad: ${validacion.score_total}/100`);
    console.log(`[MOTOR V600] 🔄 Motivo: ${validacion.fallos.slice(0, 2).join(' | ')}`);

    // Guardar como mejor disponible aunque no aprobó (ya está limpio por P4/P5)
    if (viralIndexVerificado > mejorScore) {
      mejorScore = viralIndexVerificado;
      mejorResultado = { ...parsedData, _validacion_calidad: validacion };
    }
    
    // En último intento aceptar lo mejor disponible
    if (intentoActual === MAX_RETRIES) {
      console.log(`[MOTOR V600] ⚠️ MAX_RETRIES alcanzado. Usando mejor versión disponible.`);
      if (mejorResultado) {
        (mejorResultado as any)._advertencia_calidad = `Fallos pendientes: ${validacion.fallos.join('; ')}`;
      }
      break;
    }

    // Pasar fallos al siguiente intento (se inyecta en refinamientoExtra que ya existe)
    retroalimentacionLoop = `
⚠️ VALIDADOR AUTOMÁTICO RECHAZÓ EL INTENTO ANTERIOR.
FALLOS DETECTADOS QUE DEBES CORREGIR OBLIGATORIAMENTE:
${validacion.fallos.map(f => `- ${f}`).join('\n')}
NO puedes entregar el guion sin resolver estos puntos.
`;

    console.log(`[MOTOR V600] 🔁 Reintentando con correcciones específicas...`);

  } // ← CIERRE DEL WHILE (faltaba esta llave)

  // ── PASO 4: Usar el mejor resultado obtenido ──
  if (!mejorResultado) {
    throw new Error('El generador no pudo producir un guion válido tras todos los intentos.');
  }

  console.log(`[MOTOR V600] 🎯 Resultado final — viral_index: ${mejorScore} | Intentos: ${intentoActual}`);

   const normalizedData = {
    ...mejorResultado,
    guion_completo: mejorResultado.guion_completo || mejorResultado.guion_tecnico_completo || mejorResultado.guion_completo_adaptado,
    _anti_saturation_report: mejorResultado._limpieza_cliches || { cliches_detectados: [], guion_fue_reescrito: false },
    _score_verification_report: mejorResultado.score_predictivo?._scores_verificados || null,
    guion_tecnico_completo: mejorResultado.guion_tecnico_completo || mejorResultado.guion_completo,
    plan_visual_director: mejorResultado.plan_visual_director || mejorResultado.plan_visual,
    analisis_estrategico: {
      ...(mejorResultado.analisis_estrategico || {}),
      razonamiento_interno: `Motor V600 — ${intentoActual} intento(s) | Mejor viral_index: ${mejorScore}`,
      intentos_realizados: intentoActual,
      umbral_superado: mejorScore >= MIN_VIRAL_SCORE,
    }
  };

  // ── PASO 5: Validación de experto ──
  if ((contexto as any).expertProfile) {
    console.log('[MOTOR V600] 🛡️ Validando con perfil de experto...');
    const validation = ExpertAuthoritySystem.applyFilter(
      (contexto as any).expertProfile,
      'guion',
      normalizedData,
      settings?.platform || 'TikTok'
    );
    (normalizedData as any).expert_validation = validation;
  }

  console.log(`[MOTOR V600] 🎉 Proceso completado | Tokens: ${tokensTotal}`);

  return {
    data: normalizedData,
    tokens: tokensTotal
  };
}

// ==================================================================================
// 📝 FUNCIÓN EJECUTORA: COPY EXPERT V400 (EL MÚSCULO)
// ==================================================================================

async function ejecutarCopyExpert(
  contenidoOriginal: string,
  contexto: any,
  openai: any,
  settings: any
): Promise<{ data: any; tokens: number }> {
  
  console.log('[COPY EXPERT V400] 📝 Iniciando traducción cognitiva...');
  console.log(`[COPY EXPERT V400] ⚙️ Config: Red=${settings.red_social} | Formato=${settings.formato} | Obj=${settings.objetivo}`);

  // 1. Validación de seguridad básica
  if (!contenidoOriginal || contenidoOriginal.length < 10) {
    return { 
      data: { error: "El contenido es demasiado corto para generar un copy." }, 
      tokens: 0 
    };
  }

  // 2. Detectar tipo de contenido si no viene definido (Usa el Helper que agregamos antes)
  if (!settings.tipo_contenido) {
     settings.tipo_contenido = detectContentType(contenidoOriginal);
  }

  // 3. Generar el Prompt Maestro (Llama al Cerebro)
  // Asegúrate de que PROMPT_COPY_EXPERT_V400 esté definida arriba en tu archivo
  const promptSistema = PROMPT_COPY_EXPERT_V400(contenidoOriginal, contexto, settings);

  try {
    // 4. Llamada a la IA
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Usamos GPT-4o para mejor razonamiento y seguir JSON
      messages: [
        { 
          role: "system", 
          content: "Eres el Copywriter #1 del mundo. Tu salida es SIEMPRE JSON válido estricto." 
        },
        { role: "user", content: promptSistema }
      ],
      temperature: 0.7, // Creatividad controlada
      response_format: { type: "json_object" } // Fuerza respuesta JSON para que no rompa el frontend
    });

    // 5. Procesar Respuesta
    const rawContent = completion.choices[0].message.content;
    const parsedData = JSON.parse(rawContent || '{}');

    console.log('[COPY EXPERT V400] ✅ Copy generado exitosamente');

    // 6. Retornar datos limpios
    return {
      data: parsedData,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error: any) {
    console.error("[ERROR COPY EXPERT]", error);
    
    // Fallback de emergencia para que el usuario no vea pantalla blanca
    return { 
      data: { 
        copy_principal: { 
            texto: "Lo siento, hubo un error generando el copy. Por favor intenta con un texto más corto o revisa tu conexión.",
            hook_textual: "Error de generación",
            cta_usado: "Reintentar"
        },
        error: error.message 
      }, 
      tokens: 0 
    };
  }
}

async function ejecutarJuezViralV500(
  contexto: any,
  contenido: string,
  openai: any,
  settings: any = {}
): Promise<{ data: JuezViralV500Result; tokens: number }> {
  
  const modo = settings.mode || 'viral';
  const plataforma = settings.platform || 'TikTok';

  console.log(`[JUEZ V500] ⚖️ Iniciando análisis supremo...`);
  console.log(`[JUEZ V500] 🎯 Modo: ${modo} | Plataforma: ${plataforma}`);
  console.log(`[JUEZ V500] 📊 Longitud contenido: ${contenido.length} caracteres`);

  // 1. Generar el Prompt Maestro V500
  const prompt = PROMPT_JUEZ_VIRAL_V500(contexto, contenido, modo, plataforma);

  try {
    // 2. Llamada a OpenAI con configuración optimizada
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Modelo más inteligente para análisis complejo
      response_format: { type: 'json_object' },
      messages: [
        { 
          role: 'system', 
          content: 'Eres el Sistema de Simulación Cognitiva y Predicción Viral #1 del Mundo. Tu salida es SIEMPRE JSON válido completo con TODOS los 10 módulos.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Precisión matemática
      max_tokens: 8000 // Espacio suficiente para los 10 módulos
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    const tokens = completion.usage?.total_tokens || 0;

    // 3. Validación de integridad (verificar que existan los 10 módulos)
    const modulosRequeridos = [
      'fidelidad_arquitectonica',
      'progresion_emocional',
      'retencion_cognitiva',
      'hook_power',
      'densidad_valor',
      'equivalencia_psicologica',
      'ritmo_narrativo',
      'triggers_virales',
      'autoridad_percibida',
      'conversion_estrategica'
    ];

    const modulosFaltantes = modulosRequeridos.filter(
      modulo => !result.modulos?.[modulo]
    );

    if (modulosFaltantes.length > 0) {
      console.warn(`[JUEZ V500] ⚠️ Módulos incompletos: ${modulosFaltantes.join(', ')}`);
      // Agregar módulos de emergencia
      modulosFaltantes.forEach(modulo => {
        if (!result.modulos) result.modulos = {};
        result.modulos[modulo] = {
          error: "Módulo no completado por la IA",
          score: 0
        };
      });
    }

    console.log(`[JUEZ V500] ✅ Análisis completado`);
    console.log(`[JUEZ V500] 📊 Score Global: ${result.veredicto_final?.score_total || 'N/A'}/100`);
    console.log(`[JUEZ V500] 🎯 Clasificación: ${result.veredicto_final?.clasificacion || 'N/A'}`);

    // 4. [Guardado manejado por el servidor principal - no duplicar aquí]
    // El save lo hace el serve() después del switch.

    return { data: result, tokens };

  } catch (error: any) {
    console.error("[JUEZ V500] ❌ Error:", error.message);
    
    // Fallback de emergencia
    return {
      data: {
        veredicto_final: {
          score_total: 0,
          clasificacion: "ERROR DE ANÁLISIS",
          probabilidad_viral: "N/A",
          confianza_prediccion: "Baja",
          viral_probability_score: 0
        },
        modulos: {} as any,
        diagnostico_maestro: {
          diagnostico_principal: "Error crítico en el análisis",
          error_principal: error.message,
          mejora_concreta: "Intenta de nuevo o contacta soporte",
          puntos_criticos: [],
          oportunidades: []
        },
        optimizaciones_automaticas: {} as any,
        prediccion_metricas: {} as any,
        fortalezas_clave: [],
        debilidades_criticas: [],
        decision_recomendada: "REINTENTAR",
        razonamiento_decision: "Error técnico",
        siguiente_paso_sugerido: "Vuelve a ejecutar el análisis"
      },
      tokens: 0
    };
  }
}

// ==================================================================================
// 👤 FUNCIÓN EJECUTORA: AUDITOR DE AVATAR (ACTUALIZADA V2.0)
// ==================================================================================

async function ejecutarAuditorAvatar(
  infoCliente: string,
  nicho: string,
  openai: any,
  comentariosExtraidos?: string
): Promise<{ data: any; tokens: number }> {
  
  console.log('[CEREBRO] 👤 Ejecutando Auditor de Avatar...');
  
  // 1. Generar el Prompt Maestro usando la info detallada
  // Esto conecta con el const PROMPT_AUDITOR_AVATAR que definiste arriba
  const promptSistema = PROMPT_AUDITOR_AVATAR(infoCliente, nicho, comentariosExtraidos);

  try {
    // 2. Llamada a OpenAI (Configuración de Alta Precisión)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Usamos GPT-4o para respetar la estructura JSON compleja
      response_format: { type: 'json_object' }, // Forzamos salida JSON válida
      messages: [
        { 
          role: 'system', 
          content: 'Eres TITAN AUDITOR. Un psicólogo de consumidor experto, técnico y despiadado. Tu salida es SIEMPRE JSON válido estricto.' 
        },
        { role: 'user', content: promptSistema }
      ],
      temperature: 0.4, // Temperatura baja para que respete los valores permitidos (enums)
      max_tokens: 4000  // Espacio suficiente para el análisis profundo campo por campo
    });

    // 3. Procesar y Limpiar Respuesta
    const rawContent = completion.choices[0].message.content;
    let parsedData = JSON.parse(rawContent || '{}');

    // 4. Validación de Integridad (Anti-Crash del Frontend)
    // Verificamos si la IA devolvió las secciones críticas. Si no, activamos el salvavidas.
    if (!parsedData.perfil_final_optimizado || !parsedData.auditoria_calidad) {
        console.warn("[AUDITOR] ⚠️ Estructura incompleta recibida, aplicando fallback de seguridad...");
        
        parsedData = {
            auditoria_calidad: {
                score_global: 0,
                veredicto_brutal: "Error en el análisis de IA. Intenta de nuevo.",
                nivel_actual: "DESASTROSO",
                desglose_puntos: { especificidad: 0, dolor: 0, coherencia: 0, actionable: 0 },
                penalizaciones_aplicadas: ["Fallo interno de generación"]
            },
            analisis_campo_por_campo: [],
            // Devolvemos un perfil mínimo para que la UI no explote
            perfil_final_optimizado: { 
                name: "Avatar Recuperado",
                experience_level: "principiante",
                primary_goal: "posicionamiento",
                prohibitions: {},
                signature_vocabulary: [],
                banned_vocabulary: []
            },
            recomendaciones_accionables: [
                { area: "Sistema", problema: "Fallo de generación", solucion: "Reintentar auditoría", prioridad: "ALTA" }
            ],
            comparacion_antes_despues: { headline_antes: "N/A", headline_despues: "N/A" },
            siguiente_paso: "Por favor, intenta auditar de nuevo."
        };
    }

    return {
      data: parsedData,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error: any) {
    console.error("[ERROR AUDITOR AVATAR]", error);
    
    // Retorno de error controlado para no romper el flujo del servidor
    return { 
      data: { 
        error: "Error crítico al auditar el avatar.", 
        details: error.message,
        auditoria_calidad: { score_global: 0, veredicto_brutal: "Error de Sistema" } 
      }, 
      tokens: 0 
    };
  }
}

// ==================================================================================
// 🕵️ FUNCIÓN EJECUTORA: AUDITORÍA DE EXPERTO (FULL QUALITY V4.0)
// ==================================================================================

async function ejecutarAuditoriaExperto(
  expertData: any, 
  avatarContext: string, 
  openai: any,
  competitorUrls?: string[]
): Promise<{ data: any; tokens: number }> {
  
  console.log('[HELPER] 🕵️ Ejecutando Motor de Auditoría Experta (Titan Strategy)...');

  // --- PASO 0: LIMPIEZA PROFUNDA DE DATOS ---
  // Tu frontend envía las prohibiciones como un string JSON dentro del objeto.
  // Si no lo parseamos aquí, la IA lo verá como un texto sucio y podría ignorarlo.
  if (expertData.prohibitions && typeof expertData.prohibitions === 'string') {
      try {
          expertData.prohibitions = JSON.parse(expertData.prohibitions);
          console.log("[HELPER] ✅ Prohibiciones parseadas correctamente.");
      } catch (e) {
          console.warn("[HELPER] ⚠️ No se pudo parsear prohibiciones, se enviarán como texto.");
      }
  }

  // --- PASO 1: GENERAR EL PROMPT ---
  // Pasamos el objeto 'expertData' completo. El prompt se encargará de leer todos los campos nuevos
  // (authority_level, mental_territory, mechanism_name, etc.)
  const systemPrompt = PROMPT_AUDITOR_EXPERTO(expertData, avatarContext, competitorUrls);

  try {
    // --- PASO 2: LLAMADA A LA IA (MODO RAZONAMIENTO) ---
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Usamos el modelo más inteligente para el análisis estratégico
      response_format: { type: 'json_object' }, // Forzamos JSON para que el frontend no rompa
      messages: [
        { 
          role: 'system', 
          content: 'Eres TITAN STRATEGY. El consultor de autoridad más caro y despiadado del mundo. Tu salida es SIEMPRE un JSON válido y completo.' 
        },
        { role: 'user', content: systemPrompt }
      ],
      temperature: 0.7, // Creatividad balanceada para estrategias únicas pero estructuradas
      max_tokens: 4000  // Máximo tokenaje para asegurar que el "Plan de 90 días" no se corte
    });

    // --- PASO 3: PROCESAMIENTO DE RESPUESTA ---
    const rawContent = completion.choices[0].message.content;
    let parsedResult = JSON.parse(rawContent || '{}');

    // --- PASO 4: VALIDACIÓN DE INTEGRIDAD (ANTI-PANTALLA BLANCA) ---
    // Verificamos que existan las claves que tu componente 'ExpertAuditReportV2' necesita para renderizar.
    if (!parsedResult.auditoria_calidad || !parsedResult.perfil_experto_optimizado) {
        console.error("[TITAN] ❌ La IA devolvió una estructura incompleta. Activando Fallback.");
        
        // Este objeto coincide EXACTAMENTE con lo que tu frontend espera recibir
        // para que muestre los datos (aunque sean de error) y no una pantalla vacía.
        parsedResult = {
            auditoria_calidad: {
                score_global: 0,
                nivel_autoridad: "ERROR DE ANÁLISIS",
                veredicto_brutal: "La IA no pudo procesar tu perfil. Revisa que los datos enviados sean coherentes.",
                desglose_puntos: { historia: 0, mecanismo: 0, proof: 0, enemigo: 0, promesa: 0 },
                penalizaciones_aplicadas: ["Fallo estructural en la respuesta de IA"]
            },
            analisis_campo_por_campo: [
                {
                    campo: "Error del Sistema",
                    lo_que_escribio: "N/A",
                    calificacion: "🔴 Crítico",
                    critica: "Hubo un error al generar el análisis detallado.",
                    correccion_maestra: "Intenta ejecutar la auditoría nuevamente."
                }
            ],
            perfil_experto_optimizado: {
                elevator_pitch: "No disponible.",
                bio_magnetica: "No disponible.",
                mecanismo_comercial: { nombre: "Error", pasos: [] },
                proof_stack_ordenado: []
            },
            analisis_competitivo: {
                competidores_directos: "N/A",
                tu_diferenciador_vs_ellos: "N/A",
                debilidad_competitiva: "N/A"
            },
            plan_accion_90_dias: [],
            siguiente_paso: "Por favor, reintenta la auditoría en unos segundos."
        };
    }

    return {
      data: parsedResult,
      tokens: completion.usage?.total_tokens || 0
    };

  } catch (error: any) {
    console.error("[ERROR CRÍTICO EXPERTO]", error);
    // Retorno de emergencia que no rompe el frontend
    return {
      data: {
        auditoria_calidad: { 
            score_global: 0, 
            veredicto_brutal: "Error Crítico del Servidor. Consulta los logs.",
            nivel_autoridad: "SISTEMA CAÍDO"
        },
        error_interno: error.message
      },
      tokens: 0
    };
  }
}

async function ejecutarMentorEstrategico(
  contexto: ContextoUsuario,
  preguntaUsuario: string,
  openai: any,
  datosDeOtrasFunciones?: any // 👈 NUEVO: Datos de Ideas, Guiones, Juez, etc.
): Promise<{ data: any; tokens: number }> {
  
  console.log('[MENTOR V300] 🧠 Iniciando análisis estratégico...');
  console.log(`[MENTOR V300] 📊 Datos recibidos:`, {
    tiene_ideas: !!datosDeOtrasFunciones?.ideas_generadas,
    tiene_guion: !!datosDeOtrasFunciones?.guion_generado,
    tiene_analisis_juez: !!datosDeOtrasFunciones?.analisis_juez,
    tiene_autopsia: !!datosDeOtrasFunciones?.autopsia_viral,
    tiene_calendario: !!datosDeOtrasFunciones?.calendario
  });
  
  // 1. Generar el prompt usando el nuevo sistema V300
  const systemPrompt = PROMPT_MENTOR_ESTRATEGICO(
    contexto,
    preguntaUsuario,
    datosDeOtrasFunciones
  );
  
  try {
    // 2. Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // 👈 IMPORTANTE: Usar modelo inteligente para razonamiento estratégico
      response_format: { type: 'json_object' },
      messages: [
        { 
          role: 'system', 
          content: 'Eres el Mentor Estratégico #1 del mundo en Comunicación Digital. Tu salida es SIEMPRE JSON válido.' 
        },
        { role: 'user', content: systemPrompt }
      ],
      temperature: 0.6, // Balance entre creatividad y coherencia
      max_tokens: 3000
    });
    
    // 3. Parsear respuesta
    const rawContent = completion.choices[0].message.content;
    const parsedData = JSON.parse(rawContent || '{}');
    
    console.log('[MENTOR V300] ✅ Análisis completado');
    
    return {
      data: parsedData,
      tokens: completion.usage?.total_tokens || 0
    };
    
  } catch (error: any) {
    console.error("[MENTOR V300] ❌ Error:", error.message);
    
    // Fallback de emergencia
    return {
      data: {
        respuesta_mentor: "Hubo un error en el análisis estratégico. Por favor, intenta de nuevo con más contexto.",
        error: error.message
      },
      tokens: 0
    };
  }
}

async function ejecutarCalendario(
  settings: any,
  contexto: ContextoUsuario,
  openai: any
): Promise<{ data: any; tokens: number }> {
  console.log('[CEREBRO] 📅 Generando Calendario...');
  
  const systemPrompt = PROMPT_CALENDARIO_GOD_MODE(settings, contexto);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Eres el Estratega #1. Responde SOLO con JSON.' },
      { role: 'user', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  const rawContent = completion.choices[0].message.content || '{"calendar":[]}';
  const parsedData = JSON.parse(rawContent);

  const finalData = {
      calendar: parsedData.calendar || parsedData.calendario || []
  };

  return {
    data: finalData,
    tokens: completion.usage?.total_tokens || 0
  };
}

// ==================================================================================
// 🧠 SCRAPER DE COMENTARIOS — INTELIGENCIA DE MERCADO AVATAR V2
// ==================================================================================

async function scrapeYouTubeComments(url: string): Promise<{
  comments: { text: string; likes: number }[];
  videoTitle: string;
  description: string;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');

  if (!apifyToken) {
    console.warn('[COMMENTS] ⚠️ APIFY_API_TOKEN no configurado');
    return { comments: [], videoTitle: '', description: '' };
  }

  try {
    console.log('[COMMENTS] 💬 Scraping comentarios YouTube:', url);
    const client = new ApifyClient({ token: apifyToken });

    const run = await client.actor('bernardo/youtube-scraper').call({
      startUrls: [{ url }],
      maxResults: 1,
      maxComments: 100,
      subtitlesLanguage: 'es',
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      console.warn('[COMMENTS] ⚠️ Sin resultados de Apify');
      return { comments: [], videoTitle: '', description: '' };
    }

    const video = items[0];
    const rawComments: any[] = video.comments || [];

    const comments = rawComments
      .filter((c: any) => c.text && c.text.trim().length > 10)
      .map((c: any) => ({
        text: c.text?.trim() || '',
        likes: c.likes || 0
      }))
      .sort((a: any, b: any) => b.likes - a.likes)
      .slice(0, 80);

    console.log(`[COMMENTS] ✅ ${comments.length} comentarios útiles extraídos`);

    return {
      comments,
      videoTitle: video.title || '',
      description: video.description || ''
    };

  } catch (error: any) {
    console.error('[COMMENTS] ❌ Error Apify:', error.message);
    return { comments: [], videoTitle: '', description: '' };
  }
}

// ==================================================================================
// 🎬 FUNCIONES DE SCRAPING Y WHISPER (100% PRESERVADAS)
// ==================================================================================

function detectPlatform(url: string): string {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com') || url.includes('instagram')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.com')) return 'facebook';
  return 'unknown';
}

// ✅ TIKTOK SCRAPER CON FALLBACK
async function scrapeTikTok(url: string): Promise<{ 
    videoUrl: string; 
    description: string; 
    transcript?: string;
    duration?: number;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  
  if (!apifyToken) {
      console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado, continuando sin scraping');
      return { 
          videoUrl: url, 
          description: '', 
          transcript: '',
          duration: 0
      };
  }

  try {
      console.log('[SCRAPER] 🎵 Iniciando scraping de TikTok:', url);
      
      const client = new ApifyClient({ token: apifyToken });

      const run = await client.actor('clockworks/tiktok-scraper').call({
  postURLs: [url],
  resultsPerPage: 1,
  shouldDownloadVideos: true,
  shouldDownloadCovers: false,
  shouldDownloadSubtitles: true,
  subtitlesLanguage: 'es',
  subtitlesLanguage2: 'en',
  subtitlesLanguage3: 'pt',
  subtitlesLanguage4: 'fr',
});

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      
      if (!items || items.length === 0) {
        console.warn('[SCRAPER] ⚠️ Apify TikTok no devolvió items, continuando con Whisper');
        return { 
            videoUrl: url, 
            description: '', 
            transcript: '',
            duration: 0
        };
      }

      const videoData = items[0];
      
      console.log('[SCRAPER] ✅ Datos de TikTok obtenidos:', {
          hasVideoUrl: !!videoData.videoUrl,
          hasDescription: !!videoData.text,
          duration: videoData.videoMeta?.duration || 'N/A'
      });
      
      // subtitles puede ser array de objetos [{text,start,end}] o string plano
      let transcriptFinal = '';
      if (Array.isArray(videoData.subtitles)) {
        transcriptFinal = videoData.subtitles.map((s: any) => s.text || s.content || '').join(' ').trim();
      } else if (typeof videoData.subtitles === 'string' && videoData.subtitles.length > 10) {
        transcriptFinal = videoData.subtitles;
      } else if (videoData.subtitleText) {
        transcriptFinal = videoData.subtitleText;
      }
      // Si subtítulos vacíos, usar descripción como fallback hasta que Whisper lo reemplace
      if (!transcriptFinal || transcriptFinal.length < 30) {
        transcriptFinal = videoData.text || '';
      }
      console.log(`[SCRAPER] 📝 Transcript TikTok (${transcriptFinal.length} chars):`, transcriptFinal.substring(0, 100));

return {
  videoUrl: videoData.videoUrl || videoData.videoUrlNoWatermark || url,
  description: videoData.text || '',
  transcript: transcriptFinal,
  duration: videoData.videoMeta?.duration || 0
};
      
  } catch (error: any) {
      console.error('[SCRAPER] ❌ Error en Apify TikTok:', error.message);
      console.log('[SCRAPER] 🔄 Continuando sin datos de Apify (se usará Whisper)');
      
      return { 
          videoUrl: url,
          description: '', 
          transcript: '',
          duration: 0
      };
  }
}

// ✅ INSTAGRAM SCRAPER CON FALLBACK
async function scrapeInstagram(url: string): Promise<{ 
    videoUrl: string; 
    description: string;
    transcript?: string;
    detectedLanguage?: string;
    duration?: number;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  
  if (!apifyToken) {
      console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado');
      return { videoUrl: url, description: '', duration: 0 };
  }

  try {
      console.log('[SCRAPER] 📸 Iniciando scraping de Instagram:', url);

      const client = new ApifyClient({ token: apifyToken });

      const run = await client.actor('apify/instagram-scraper').call({
        directUrls: [url],
        resultsType: 'posts',
        resultsLimit: 1,
        searchType: 'hashtag',
        searchLimit: 1
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      
      if (!items || items.length === 0) {
        console.warn('[SCRAPER] ⚠️ Apify Instagram no devolvió items');
        return { videoUrl: url, description: '', duration: 0 };
      }

      const videoData = items[0];

      const transcriptIG = videoData.caption || videoData.accessibility_caption || '';
console.log('[SCRAPER] 📝 Transcript Instagram:', transcriptIG.substring(0, 100));

return {
  videoUrl: videoData.videoUrl || videoData.displayUrl || url,
  description: videoData.caption || '',
  transcript: transcriptIG,
  detectedLanguage: videoData.language || 'auto',
  duration: videoData.videoDuration || 0
};
      
  } catch (error: any) {
      console.error('[SCRAPER] ❌ Error en Apify Instagram:', error.message);
      return { videoUrl: url, description: '', duration: 0 };
  }
}

// ✅ YOUTUBE SCRAPER CON FALLBACK
async function scrapeYouTube(url: string): Promise<{ 
    videoUrl: string; 
    description: string; 
    transcript?: string;
    duration?: number;
}> {
  const apifyToken = Deno.env.get('APIFY_API_TOKEN');
  
  if (!apifyToken) {
      console.warn('[SCRAPER] ⚠️ APIFY_API_TOKEN no configurado');
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }

  try {
      console.log('[SCRAPER] 🎥 Iniciando scraping de YouTube:', url);

      const client = new ApifyClient({ token: apifyToken });

      const run = await client.actor('bernardo/youtube-scraper').call({
        startUrls: [{ url }],
        maxResults: 1,
        searchKeywords: '',
        subtitlesLanguage: 'es',
        subtitlesLanguage2: 'en',
        subtitlesLanguage3: 'pt',
        subtitlesLanguage4: 'fr',
        subtitlesFormat: 'text',
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      
      if (!items || items.length === 0) {
        console.warn('[SCRAPER] ⚠️ Apify YouTube no devolvió items');
        return { videoUrl: url, description: '', transcript: '', duration: 0 };
      }

      const videoData = items[0];

      return {
        videoUrl: url,
        description: videoData.description || '',
        transcript: videoData.subtitles || videoData.subtitleText || videoData.captions || videoData.text || videoData.description || '',
        duration: videoData.lengthSeconds || 0
      };
      
  } catch (error: any) {
      console.error('[SCRAPER] ❌ Error en Apify YouTube:', error.message);
      return { videoUrl: url, description: '', transcript: '', duration: 0 };
  }
}

async function transcribeVideoWithWhisper(videoUrl: string, openai: any): Promise<{ 
    transcript: string; 
    duration: number 
}> {
  console.log('[WHISPER] 🎤 Descargando audio...');

  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error('No se pudo descargar el video');
  }

  const videoBlob = await videoResponse.blob();
  const videoBuffer = await videoBlob.arrayBuffer();
  
  console.log('[WHISPER] 📊 Video descargado:', {
    size: `${(videoBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`,
    type: videoBlob.type
  });

  const videoFile = new File([videoBuffer], 'video.mp4', { type: 'video/mp4' });

  console.log('[WHISPER] 🎙️ Enviando a Whisper...');

  const transcription = await openai.audio.transcriptions.create({
    file: videoFile,
    model: 'whisper-1',
    // ✅ Sin 'language': Whisper autodetecta inglés, portugués, español, etc.
    response_format: 'verbose_json'
  });

  console.log('[WHISPER] ✅ Transcripción completada');

  return {
  transcript: transcription.text,
  duration: transcription.duration || 0,
  language: transcription.language || 'auto',
  };
}

async function scrapeAndTranscribeVideo(
  url: string, 
  openai: any
): Promise<{ 
  transcript: string; 
  description: string; 
  duration: number; 
  platform: string;
  videoUrl?: string;
}> {
  const platform = detectPlatform(url);
  console.log(`[SCRAPER] 🎯 Plataforma detectada: ${platform.toUpperCase()}`);

  let videoData: { videoUrl: string; description: string; transcript?: string } = {
    videoUrl: '',
    description: '',
    transcript: ''
  };

  try {
    switch (platform) {
      case 'tiktok':
        videoData = await scrapeTikTok(url);
        break;
      case 'instagram':
        videoData = await scrapeInstagram(url);
        break;
      case 'youtube':
        videoData = await scrapeYouTube(url);
        break;
        case 'facebook':
        videoData = await scrapeFacebook(url);
        break;
      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }

    console.log('[SCRAPER] ✅ Scraping completado');

    // Solo usar transcript directo si es suficientemente rico (>300 chars = discurso real, no solo descripción)
    if (videoData.transcript && videoData.transcript.length > 300) {
      console.log(`[SCRAPER] ℹ️ Usando transcript (${videoData.transcript.length} chars)`);
      return {
        transcript: videoData.transcript,
        description: videoData.description,
        duration: (videoData as any).duration || 0,
        platform,
        videoUrl: videoData.videoUrl,
        detectedLanguage: (videoData as any).detectedLanguage || 'auto'
      };
    }

    // Transcript corto = solo descripción del post → forzar Whisper si hay videoUrl
    if (videoData.transcript && videoData.transcript.length > 50 && (!videoData.videoUrl || videoData.videoUrl === url)) {
      console.log(`[SCRAPER] ℹ️ Transcript corto (${videoData.transcript.length} chars) y sin videoUrl — usando descripción`);
      return {
        transcript: videoData.transcript,
        description: videoData.description,
        duration: 0,
        platform,
        videoUrl: videoData.videoUrl,
        detectedLanguage: (videoData as any).detectedLanguage || 'auto'
      };
    }

    if (!videoData.videoUrl || videoData.videoUrl === url) {
      const fallbackContent = videoData.description || videoData.transcript || '';
      if (fallbackContent.length > 20) {
        console.log('[SCRAPER] ⚠️ Sin videoUrl descargable. Usando descripción como transcript.');
        return {
          transcript: fallbackContent,
          description: fallbackContent,
          duration: 0,
          platform,
          videoUrl: ''
        };
      }
      throw new Error('No se pudo obtener contenido del video');
    }

    console.log('[SCRAPER] 🎤 Transcribiendo con Whisper...');
    const whisperResult = await transcribeVideoWithWhisper(videoData.videoUrl, openai);

    return {
  transcript: whisperResult.transcript,
  description: videoData.description,
  duration: whisperResult.duration,
  platform,
  videoUrl: videoData.videoUrl,
  detectedLanguage: (whisperResult as any).language || 'auto'
};
   

  } catch (error: any) {
    console.error('[SCRAPER] ❌ Error:', error.message);
    
    if (videoData.description && videoData.description.length > 50) {
      console.log('[SCRAPER] ⚠️ Usando solo descripción como fallback');
      return {
        transcript: videoData.description,
        description: videoData.description,
        duration: 0,
        platform
      };
    }
    
    throw error;
  }
}

async function processUploadedVideo(
  fileBase64: string,
  fileName: string,
  openai: any
): Promise<{ 
  transcript: string; 
  duration: number; 
  fileType: string;
}> {
  console.log('[UPLOAD] 📁 Procesando video subido:', fileName);

  try {
    const base64Data = fileBase64.split(',')[1] || fileBase64;
    const videoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    console.log('[UPLOAD] 📊 Video cargado:', {
      size: `${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      fileName
    });

    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'mp4';
    const mimeType = 
      fileExtension === 'mov' ? 'video/quicktime' :
      fileExtension === 'avi' ? 'video/x-msvideo' :
      fileExtension === 'webm' ? 'video/webm' :
      'video/mp4';

    const videoFile = new File([videoBuffer], fileName, { type: mimeType });

    console.log('[UPLOAD] 🎙️ Enviando a Whisper...');

    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: 'whisper-1',
      language: 'es',
      response_format: 'verbose_json'
    });

    console.log('[UPLOAD] ✅ Transcripción completada');

    return {
      transcript: transcription.text,
      duration: transcription.duration || 0,
      fileType: fileExtension
    };

  } catch (error: any) {
    console.error('[UPLOAD] ❌ Error:', error.message);
    throw new Error(`Error al procesar video subido: ${error.message}`);
  }
}

async function getVideoContent(
  url: string | null,
  uploadedFile: string | null,
  fileName: string | null,
  openai: any
): Promise<{
  transcript: string;
  description: string;
  duration: number;
  platform: string;
  source: 'url' | 'upload';
}> {
  
  if (uploadedFile && fileName) {
    console.log('[VIDEO] 📁 Procesando video subido...');
    
    const result = await processUploadedVideo(uploadedFile, fileName, openai);
    
    return {
      transcript: result.transcript,
      description: `Video subido: ${fileName}`,
      duration: result.duration,
      platform: 'upload',
      source: 'upload'
    };
  }
  
  if (url && url.includes('http')) {
    console.log('[VIDEO] 🔗 Procesando URL...');
    
    const result = await scrapeAndTranscribeVideo(url, openai);
    
    return {
      transcript: result.transcript,
      description: result.description,
      duration: result.duration,
      platform: result.platform,
      source: 'url'
    };
  }
  
  throw new Error('Debes proporcionar una URL o subir un video');
}

async function analizarImagenEstrategica(
  imageBase64: string,
  openai: any,
  contextoUsuario?: {
    nicho?: string;
    avatar_ideal?: string;
    dolor_principal?: string;
    deseo_principal?: string;
    plataforma?: string;
    formato_narrativo?: string;
    expertProfile?: any;
  }
): Promise<string> {
  console.log('[VISION V700] 👁️ Analizando imagen con contexto completo del usuario...');

  const nicho          = contextoUsuario?.nicho             || 'General';
  const avatar         = contextoUsuario?.avatar_ideal       || 'Audiencia objetivo del creador';
  const dolor          = contextoUsuario?.dolor_principal    || 'No especificado';
  const deseo          = contextoUsuario?.deseo_principal    || 'No especificado';
  const plataforma     = contextoUsuario?.plataforma         || 'TikTok';
  const formato        = contextoUsuario?.formato_narrativo  || 'EDUCATIVO_AUTORIDAD';
  const mecanismo      = contextoUsuario?.expertProfile?.mechanism_name           || null;
  const transformacion = contextoUsuario?.expertProfile?.transformation_promise   || null;
  const enemigo        = contextoUsuario?.expertProfile?.enemy                    || null;

  const formatoADN: Record<string, string> = {
    EDUCATIVO_AUTORIDAD:    'Tesis provocadora → Evidencia contraintuitiva → Sistema nombrado → Aplicación inmediata. Busca el CONCEPTO que puede nombrarse y replicarse.',
    STORYTELLING_EMOCIONAL: 'In media res → Conflicto real → Giro narrativo. Busca el DOLOR HUMANO o la situación de vida que cuenta la imagen.',
    ANUNCIO_DIRECTO:        'Filtro de avatar → Dolor afilado → Solución diferenciada. Busca el PROBLEMA URGENTE que resuelve la imagen.',
    ANUNCIO_INDIRECTO:      'Valor puro → Problema implícito → Solución orgánica. Busca el INSIGHT DE VALOR que puede entregarse sin vender.',
    OPINION_POLARIZACION:   'Declaración divisiva → Argumento irrefutable → Llamada a la tribu. Busca el ÁNGULO CONFRONTATIVO que despierta el debate.',
    CASO_ESTUDIO:           'Resultado concreto → Punto A → Sistema → Resultado medible. Busca el LOGRO O TRANSFORMACIÓN específica que puede documentarse.',
    TUTORIAL_PASO_A_PASO:   'Promesa específica → Por qué fallan → Pasos con micro-aplicación. Busca el PROCESO ACCIONABLE que enseña la imagen.',
    PODCAST_REFLEXIVO:      'Pregunta que el avatar tiene en la cabeza → Exploración honesta → Reencuadre. Busca la TENSIÓN FILOSÓFICA o dilema que abre reflexión.',
    MASTERCLASS_COMPRIMIDA: 'Promesa de perspectiva → Mapa mental → Conceptos con ejemplos reales. Busca el SISTEMA COMPLETO que puede comprimirse.',
    FRAME_DISRUPTIVO:       'Afirmación imposible → Evidencia que la sostiene → Reencuadre total. Busca la VERDAD CONTRAINTUITIVA que destroza una creencia.',
  };

  const adnFormato = formatoADN[formato] || formatoADN['EDUCATIVO_AUTORIDAD'];

  const plataformaContext: Record<string, string> = {
    'TikTok':         'El concepto debe funcionar en 30-60s. Gancho en los primeros 2 segundos. Ritmo staccato. Sin introducción.',
    'Reels':          'El concepto debe funcionar en 30-60s con estética aspiracional. Música emotiva. Identidad tribal.',
    'YouTube':        'El concepto puede expandirse a 8-15 min. Gap informativo profundo. Estructura en capítulos.',
    'LinkedIn':       'El concepto debe resonar con profesionales. Reflexión experiencial. Primera persona. Tono sobrio.',
    'Facebook':       'El concepto debe generar debate comunitario. Subtítulos completos. Audiencia amplia y emocional.',
    'YouTube Shorts': 'Concepto en 60s máximo. Gancho instantáneo. Valor comprimido. Alto scroll-stopping.',
  };

  const plataformaGuia = plataformaContext[plataforma] || plataformaContext['TikTok'];

  const systemPrompt = `Eres el Extractor de ADN Viral más preciso del mundo.
Tu trabajo NO es describir imágenes. Es convertirlas en ARMAS NARRATIVAS personalizadas.

CONTEXTO DEL CREADOR (usa esto para personalizar cada parte del análisis):
- Nicho: ${nicho}
- Avatar objetivo: ${avatar}
- Dolor principal del avatar: ${dolor}
- Deseo principal del avatar: ${deseo}
- Plataforma destino: ${plataforma}
- Formato narrativo activo: ${formato}
${mecanismo      ? `- Mecanismo propietario del experto: "${mecanismo}" → intégralo si encaja` : ''}
${transformacion ? `- Promesa de transformación: "${transformacion}" → conéctala con la imagen`  : ''}
${enemigo        ? `- Enemigo común del experto: "${enemigo}" → úsalo si potencia la tensión`    : ''}

ADN DEL FORMATO ACTIVO (${formato}):
${adnFormato}

GUÍA DE PLATAFORMA (${plataforma}):
${plataformaGuia}

EJECUTA ESTOS 4 DETECTORES EN ORDEN:

DETECTOR 1 — TENSIÓN EXPLOTABLE:
¿Qué conflicto, dolor o deseo del avatar de ${nicho} activa esta imagen?
NO la descripción visual. SÍ la tensión narrativa específica para ${avatar}.

DETECTOR 2 — ÁNGULO VIRAL PARA ${formato}:
¿Cómo se convierte esta imagen en el gancho perfecto para el formato ${formato}?
Usa el ADN del formato. Sé específico al nicho ${nicho}.

DETECTOR 3 — INSIGHT CONTRAINTUITIVO:
¿Qué verdad no obvia o reencuadre mental puede extraerse para ${plataforma}?
Debe ser sorprendente. Que el avatar diga "nunca lo había visto así".

DETECTOR 4 — SEMILLA FINAL:
Escribe UN párrafo potente (80-120 palabras) que sirva como semilla exacta para el generador.
Debe contener: la tensión, el ángulo para ${formato}, el dolor de ${avatar}, y el insight.
Este párrafo es el input que usará el Motor V700 para generar el guion completo.

RESPONDE SOLO con el párrafo del DETECTOR 4. Sin títulos, sin explicaciones adicionales.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analiza esta imagen para un creador de contenido de ${nicho} en ${plataforma}. Su avatar es "${avatar}" con dolor "${dolor}". Formato activo: ${formato}. Extrae el concepto viral personalizado.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
              detail: "high"
            }
          }
        ]
      }
    ],
    max_tokens: 600
  });

  const analisis = response.choices[0].message.content;
  console.log(`[VISION V700] ✅ Concepto extraído para ${nicho} | ${plataforma} | ${formato}:`, analisis?.substring(0, 100) + '...');
  return analisis || '';
}

// ==================================================================================
// 🔄 CONTEXTO Y COSTOS
// ==================================================================================

async function getUserContext(
  supabase: any, 
  expertId: string, 
  avatarId: string, 
  kbId: string
): Promise<ContextoUsuario> {
  const promises = [
    expertId ? supabase.from('expert_profiles').select('*').eq('id', expertId).single() : null,
    avatarId ? supabase.from('avatars').select('*').eq('id', avatarId).single() : null,
    kbId ? supabase.from('documents').select('content').eq('id', kbId).single() : null
  ].filter(Boolean);

  const results = await Promise.allSettled(promises as Promise<any>[]);
  
  const contexto: any = {
    nicho: 'General',
    avatar_ideal: 'Audiencia general',
    dolor_principal: 'N/A',
    deseo_principal: 'N/A',
    competencia_analizada: [],
    hooks_exitosos: [],
    patrones_virales: MEMORIA_SISTEMA.patrones_virales
  };
  
  if (results[0]?.status === 'fulfilled') {
    const expert = results[0].value?.data;
    if (expert) {
      // Usamos (contexto as any) para forzar la entrada de datos
      (contexto as any).nicho = expert.niche || contexto.nicho;
      (contexto as any).posicionamiento = expert.positioning || '';
      (contexto as any).diferenciadores = expert.differentiators || [];
      
      // 👇 ESTA ES LA CLAVE PARA QUE NO DE ERROR
      (contexto as any).expertProfile = expert;

      // OLIMPO: Validar completitud del perfil y adjuntar resultado al contexto
      const profileValidation = ExpertAuthoritySystem.validateProfileCompleteness(expert);
      (contexto as any).expertProfileValidation = profileValidation;
      if (!profileValidation.isOlimpo) {
        console.warn(`[CONTEXTO] ⚠️ Perfil OLIMPO incompleto — Score: ${profileValidation.score}/100`);
        console.warn(`[CONTEXTO] 📋 Campos faltantes: ${profileValidation.missing.join(', ')}`);
      } else {
        console.log(`[CONTEXTO] ✅ Perfil OLIMPO completo — Score: ${profileValidation.score}/100`);
      }
    }
  }
  
  if (results[1]?.status === 'fulfilled') {
    const avatar = results[1].value?.data;
    if (avatar) {
      contexto.avatar_ideal        = avatar.name || contexto.avatar_ideal;
      contexto.dolor_principal     = avatar.dolor || avatar.pain_points || contexto.dolor_principal;
      contexto.deseo_principal     = avatar.cielo || avatar.desires || contexto.deseo_principal;
      // Campos extendidos para Ideas Rápidas
      (contexto as any).avatar_situacion_actual = avatar.current_situation || null;
      (contexto as any).avatar_objetivo_primario = avatar.primary_goal || null;
      (contexto as any).avatar_pain_points = avatar.pain_points || null;
    }
  }

  if (results[2]?.status === 'fulfilled') {
    const kb = results[2].value?.data;
    if (kb?.content) {
      contexto.knowledge_base_content = kb.content.substring(0, 5000);
    }
  }
  
  return contexto;
}

function calculateTitanCost(
  mode: string,
  inputContext: string,
  whisperMinutes: number,
  settings: any,
  videoDurationSeconds?: number
): number {

  // ==================================================================================
  // 🔬 MODO: INGENIERÍA INVERSA / CLONACIÓN VIRAL (SISTEMA DINÁMICO V3.0)
  // ==================================================================================
  if (mode === 'autopsia_viral' || mode === 'recreate') {

    console.log('[COSTOS V3] 💰 Calculando costo dinámico para Ingeniería Inversa...');

    // ─── PASO 1: Detectar tipo de contenido (Reel / Video Largo / Masterclass) ───
    const urlCount = settings?.urlCount || 1; // Cuántas URLs se analizaron
    let baseCostPerUrl = 15; // Default: Reel/Short, 1 URL

    if (videoDurationSeconds && videoDurationSeconds > 0) {
      if (videoDurationSeconds <= 90) {
        baseCostPerUrl = 15;   // 🎥 Reels / Shorts
      } else if (videoDurationSeconds <= 600) {
        baseCostPerUrl = 45;   // 🎬 Video Largo
      } else {
        baseCostPerUrl = 60;   // 🎓 Masterclass
      }
    } else if (whisperMinutes > 0) {
      const estimatedSeconds = whisperMinutes * 60;
      if (estimatedSeconds <= 90)       baseCostPerUrl = 15;
      else if (estimatedSeconds <= 600) baseCostPerUrl = 45;
      else                              baseCostPerUrl = 60;
    } else if (settings?.contentType) {
      // Fallback: el frontend puede enviar el tipo explícito
      if (settings.contentType === 'masterclass') baseCostPerUrl = 60;
      else if (settings.contentType === 'long')   baseCostPerUrl = 45;
      else                                         baseCostPerUrl = 15;
    }

    // ─── PASO 2: Tabla de precios multi-URL ───
    // Estructura: { tipo: [1_url, 2-3_urls, 4-5_urls] }
    // V2: 2 llamadas al modelo = mayor costo operativo real
    // Reel: 2 llamadas ~$0.08 | Video Largo: ~$0.18 | Masterclass: ~$0.35
    // Precio refleja calidad diferenciada — guion élite garantizado
    const PRECIO_TABLA: Record<number, number[]> = {
      20: [20, 35, 50],   // Reels (era 15): 1 URL = 20, 2-3 = 35, 4-5 = 50
      55: [55, 80, 105],  // Video Largo (era 45): 1 URL = 55, 2-3 = 80, 4-5 = 105
      75: [75, 105, 135], // Masterclass (era 60): 1 URL = 75, 2-3 = 105, 4-5 = 135
    };

    // Actualizar baseCostPerUrl a los nuevos valores
    if (baseCostPerUrl === 15) baseCostPerUrl = 20;
    else if (baseCostPerUrl === 45) baseCostPerUrl = 55;
    else if (baseCostPerUrl === 60) baseCostPerUrl = 75;

    const tabla = PRECIO_TABLA[baseCostPerUrl] || PRECIO_TABLA[15];
    let totalCost: number;

    if (urlCount <= 1)      totalCost = tabla[0];
    else if (urlCount <= 3) totalCost = tabla[1];
    else                    totalCost = tabla[2]; // 4-5 URLs

    console.log(`[COSTOS V3] 📊 Tipo: ${baseCostPerUrl===15?'Reel':baseCostPerUrl===45?'Video Largo':'Masterclass'} | URLs: ${urlCount} | TOTAL: ${totalCost} créditos`);
    return totalCost;
  }

  // ==================================================================================
  // Resto de modos (sin cambios)
  // ==================================================================================
  if (mode === 'ideas_rapidas') {
    if (inputContext.toLowerCase().includes("10 ideas") || settings?.quantity === 10) return 7;
    return 3;
  }
  if (mode === 'calendar_generator') {
    const days = settings?.duration || 7;
    if (days <= 3) return 2;
    if (days <= 7) return 5;
    return 10;
  }
  if (mode === 'generar_guion' || mode === 'generador_guiones') {
    const durationSetting = settings?.duration || settings?.durationId || '';
    const isMasterclass =
      durationSetting === 'masterclass' || durationSetting === 'long' ||
      inputContext.toLowerCase().includes("masterclass") ||
      inputContext.toLowerCase().includes("30 minutos");
    if (isMasterclass) return 30;
    return 5;
  }
  if (mode === 'juez_viral') return 2;
  if (['audit_avatar', 'auditar_avatar'].includes(mode)) return 2;
  if (['audit_expert', 'auditar_experto'].includes(mode)) return 2;
  if (['mentor_ia', 'mentor_estrategico'].includes(mode)) return 2;
  if (['chat_avatar', 'chat_expert'].includes(mode)) return 1;
  if (['transcribe', 'transcriptor'].includes(mode)) {
    if (whisperMinutes > 60) return 45;
    if (whisperMinutes > 30) return 15;
    return 5;
  }
  if (['clean', 'authority', 'carousel', 'shorts', 'structure'].includes(mode)) return 2;
  return 1;
}

// ==================================================================================
// 🚀 SERVIDOR PRINCIPAL (AL FINAL - ORDEN CORRECTO)
// ==================================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error('Faltan variables de entorno críticas');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    
    if (authError || !user) throw new Error('Usuario no autenticado');
    userId = user.id;

    if (!checkRateLimit(userId)) throw new Error('Límite de solicitudes excedido');

    const body = await req.json();
    const { selectedMode, url, platform, expertId, avatarId, knowledgeBaseId, estimatedCost } = body;

    let processedContext = body.transcript || body.text || body.userInput || body.customPrompt || body.topic || body.query || "";
    
    // Merge: primero el objeto settings anidado, luego los campos sueltos del body
let settings: any = {
    ...(body.settings || {}),
};

if (body.quantity)        settings.quantity        = body.quantity;
if (body.duration)        settings.duration        = body.duration;
if (body.durationId)      settings.durationId      = body.durationId;
if (body.structure)       settings.structure       = body.structure;
if (body.awareness)       settings.awareness       = body.awareness;
if (body.objective)       settings.objective       = body.objective;
if (body.situation)       settings.situation       = body.situation;
if (body.platform)        settings.platform        = body.platform;
if (body.timing_context)  settings.timing_context  = body.timing_context;
if (body.creative_lens)   settings.creative_lens   = body.creative_lens;
if (body.internal_mode)   settings.internal_mode   = body.internal_mode;
if (body.hook_style)      settings.hook_style      = body.hook_style;
if (body.intensity)       settings.intensity       = body.intensity;
if (body.closing_objective) settings.closing_objective = body.closing_objective;

    console.log(`[TITAN V105] 🚀 MODE: ${selectedMode} | USER: ${userId}`);

    if (estimatedCost > 0) {
      const { data: p } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      if (p?.tier !== 'admin' && (p?.credits || 0) < estimatedCost) {
        throw new Error(`Saldo insuficiente. Tienes ${p?.credits || 0} créditos, se requieren ${estimatedCost}.`);
      }
    }

    const userContext = await getUserContext(supabase, expertId || '', avatarId || '', knowledgeBaseId || '');

    let whisperMinutes = 0;
    let result: any;
    let tokensUsed = 0;

    // ==============================================================================
    // 🛡️ MIDDLEWARE DE AVATAR + 💉 INYECCIÓN DE PERSONALIDAD
    // ==============================================================================
    
    // 1. Definimos qué modos NO necesitan avatar
    const skipMiddleware = ['audit_avatar', 'auditar_avatar'].includes(selectedMode);
    let activeAvatar = null;
    let avatarDirectives = "";

    if (!skipMiddleware) {
      try {
        console.log('[MIDDLEWARE] 🕵️ Verificando Avatar...');
        const avatarMw = new AvatarMiddleware(supabase);
        const validation = await avatarMw.validateAndGetAvatar(userId);

        // ⛔ BLOQUEO: Si no hay avatar, detenemos todo
        if (!validation.success) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: validation.error,
                warnings: validation.warnings,
                action: "REDIRECT_TO_AVATAR"
            }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
        }

        activeAvatar = validation.avatar;
        console.log(`[MIDDLEWARE] ✅ Avatar Activo: ${activeAvatar.name}`);

        // 🛡️ SEGURIDAD: Verificar prohibiciones del Avatar
        const requestContent = { mode: selectedMode, transcript: processedContext, ...settings };
        const safetyCheck = await avatarMw.filterContentRequest(requestContent, userId);
        
        if (!safetyCheck.approved) {
             return new Response(JSON.stringify({ 
                success: false,
                error: "CONTENT_VIOLATION", 
                message: "Tu Avatar prohíbe este tipo de contenido.",
                warnings: safetyCheck.warnings
            }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        // 💉 INYECCIÓN DE PERSONALIDAD (EL TRUCO MAESTRO)
        // Generamos las instrucciones de tono/estilo y las pegamos al contexto
        console.log(`[PERSONALIDAD] 🎭 Inyectando ADN de: ${activeAvatar.name}`);
        
        avatarDirectives = avatarMw.buildPromptWithAvatar("", activeAvatar, selectedMode);

        // Inyectamos en el contexto para que TODAS las funciones (Ideas, Guiones, etc.) lo lean
        processedContext = processedContext + `\n\n[SISTEMA: INSTRUCCIONES DE PERSONALIDAD OBLIGATORIAS DEL AVATAR]:\n${avatarDirectives}`;
        
        // También inyectamos en userContext para funciones complejas
        (userContext as any).knowledge_base_content = ((userContext as any).knowledge_base_content || "") + `\n\n[PERSONALIDAD AVATAR]: ${avatarDirectives}`;
      } catch (middlewareError: any) {
        console.error('[MIDDLEWARE] ❌ Error en middleware de avatar:', middlewareError.message);
        // Continuar sin avatar si el middleware falla
      }
    }
    
    // ==================================================================================
    // 🎯 SWITCH CASE
    // ==================================================================================

    switch (selectedMode) {
      case 'ideas_rapidas': {
        console.log('🚀 [ROUTER] Iniciando Ideas Rápidas Elite V2.0...');
        
        // 1. Recuperar variables (Prioridad: Body > Settings > Defaults)
        const topic = body.topic || body.userInput || processedContext || "Ideas Virales";
        const quantity = settings?.quantity || 3;
        const platform = settings?.platform || 'TikTok';

        // 2. Validación de Seguridad
        if (!topic || topic === "Ideas Virales") {
           // Si no hay tema, intentamos usar el contexto, si no, error
           if (!processedContext) throw new Error("⚠️ Debes ingresar un tema para generar ideas.");
        }

        // 3. Ejecución con paso de parámetros ESTRATÉGICOS
        // IMPORTANTE: Pasamos 'settings' al final. Ahí van 'objective' y 'timing'.
        // Enriquecer userContext con nicho manual si el usuario lo escribió
        if (settings?.nicho && settings.nicho !== 'General') {
          (userContext as any).nicho = settings.nicho;
          console.log(`[IDEAS IMPERIO] 🎯 Nicho manual activo: "${settings.nicho}"`);
        }

        const isMultiplatformRequest = settings?.multiplatform === true;
        // Multiplataforma tiene costo mayor — se valida antes del proceso
        if (isMultiplatformRequest) {
          console.log(`[MULTI] 💰 Modo multiplataforma: ${quantity} ideas × 5 plataformas`);
        }

        if (isMultiplatformRequest) {
          // 🌐 MODO MULTIPLATAFORMA: 1 request por idea — anti-truncado
          console.log(`[MULTI] 🌐 Iniciando generación secuencial: ${quantity} ideas × 5 plataformas`);

          const objective  = settings?.objective || 'viralidad';
          const timing     = settings?.timing_context || 'evergreen';
          const ideasArray: any[] = [];
          let   totalTokens = 0;

          for (let i = 0; i < quantity; i++) {
            console.log(`[MULTI] 🔄 Generando idea ${i + 1} de ${quantity}...`);
            const { idea, tokens } = await ejecutarUnaIdeaMultiplatforma(
              topic, i, quantity, objective, timing,
              userContext, openai, settings
            );
            if (idea && Object.keys(idea).length > 0) {
              ideasArray.push(idea);
            }
            totalTokens += tokens;
          }

          // Construir analisis_estrategico consolidado
          const analisisConsolidado = {
            objetivo_dominante: settings?.objective || 'viralidad',
            lente_aplicado: settings?.creative_lens || 'auto',
            sector_detectado: ideasArray[0]?.tca?.sector_utilizado || 'Desarrollo Personal',
            expansion_realizada: `${quantity} ideas multiplataforma generadas secuencialmente`,
            razonamiento: `${ideasArray.length} ideas con 5 adaptaciones cada una — arquitectura anti-truncado`,
            advertencias: ['Adapta subtítulos por plataforma antes de publicar'],
            oportunidades: ['Publica en orden estratégico para maximizar algoritmos cruzados']
          };

          result = {
            ideas: ideasArray,
            analisis_estrategico: analisisConsolidado,
            mejor_idea_recomendada: {
              idea_id: 1,
              razon: 'Primera idea generada con mayor fuerza narrativa',
              plataforma_prioritaria: 'TikTok — mayor velocidad de distribución inicial',
              plan_rapido: '1. Graba el video base\n2. Adapta captions por plataforma\n3. Publica en orden del plan_produccion'
            },
            insights_estrategicos: {
              tendencia_detectada: 'Contenido multiplataforma con identidad experta',
              brecha_mercado: 'Pocos creadores adaptan su mensaje al ADN de cada algoritmo',
              advertencia: 'No publiques el mismo caption en todas las redes',
              siguiente_paso_logico: 'Crear guion completo de la idea top con el Generador V600'
            }
          };
          tokensUsed = totalTokens;

        } else {
          // 🎯 MODO INDIVIDUAL: flujo original intacto
          const res = await ejecutarIdeasRapidas(
            topic, quantity, platform, userContext, openai, settings
          );
          result    = res.data;
          tokensUsed = res.tokens;
        }
        break;
      }

      case 'calendar_generator': {
        if (!settings.duration) settings.duration = 7;
        
        const res = await ejecutarCalendario(settings, userContext, openai);
        result = res.data;
        tokensUsed = res.tokens;
        break;
      }

      case 'autopsia_viral': {
        console.log('[TITAN] 🔬 Modo: AUTOPSIA VIRAL (análisis puro)');

        let contentToAnalyze = "";
        let platName = platform || 'General';
        let videoDescription = '';
        let actualWhisperMinutes = 0;
        let videoDurationSecs = 0;
        let videoSource: 'url' | 'upload' | 'manual' = 'manual';

        try {
          if (url || body.uploadedVideo) {
            console.log('[AUTOPSIA] 🎬 Obteniendo contenido...');

            const videoData = await getVideoContent(
              url || null,
              body.uploadedVideo || null,
              body.uploadedFileName || null,
              openai
            );

            const transcriptPart = videoData.transcript || '';
            const descriptionPart = (videoData as any).description || '';
            contentToAnalyze = transcriptPart.length >= descriptionPart.length
              ? transcriptPart
              : (transcriptPart + (descriptionPart && descriptionPart !== transcriptPart ? '\n\n' + descriptionPart : ''));
            videoDescription  = videoData.description;
            platName          = videoData.platform || platName;
            videoSource       = videoData.source;
            videoDurationSecs = videoData.duration || 0;
            // ✅ Usar el idioma real detectado por Whisper en verbose_json
            const detectedLang = transcription?.language || (videoData as any).detectedLanguage || 'auto';
            (userContext as any).detectedSourceLanguage = detectedLang;
            console.log(`[IDIOMA] 🌍 Detectado: ${detectedLang} → Guion en: ${outputLanguage}`);
            console.log(`[RECREATE] 🌍 Idioma video origen: ${(videoData as any).detectedLanguage || 'auto-detectado'} → Guion en: ${outputLanguage}`);

            if (videoData.duration > 0) {
            copyWhisperMinutes = Math.ceil(videoData.duration / 60);
            whisperMinutes = copyWhisperMinutes;
            console.log(`[COPY EXPERT] 🎤 Whisper usado: ${whisperMinutes} minutos`);
            }

            console.log('[AUTOPSIA] ✅ Contenido obtenido:', {
              source: videoSource,
              platform: platName,
              transcriptLength: contentToAnalyze.length,
              whisperMinutes: actualWhisperMinutes
            });

          } else if (processedContext && processedContext.length > 50) {
            console.log('[AUTOPSIA] 📝 Usando texto manual');
            contentToAnalyze = processedContext;
            videoDescription = 'Transcripción manual';
            videoSource      = 'manual';
          } else {
            throw new Error('Proporciona URL, video subido, o transcripción manual.');
          }

        } catch (videoError: any) {
          console.error('[AUTOPSIA] ❌ Error:', videoError.message);
          if (processedContext && processedContext.length > 50) {
            contentToAnalyze = processedContext;
            videoSource      = 'manual';
          } else {
            throw new Error(`Error: ${videoError.message}`);
          }
        }

        if (!contentToAnalyze || contentToAnalyze.length < 20) {
          throw new Error('Contenido insuficiente para análisis (mínimo 20 caracteres).');
        }

        console.log('[AUTOPSIA] 🔬 Ejecutando análisis forense...');

        const autopsiaRes = await ejecutarAutopsiaViral(
          contentToAnalyze,
          platName,
          openai
        );

        result = {
          ...autopsiaRes.data,
          metadata_video: {
            source:       videoSource,
            platform:     platName,
            description:  videoDescription,
            whisper_used: actualWhisperMinutes > 0,
            whisper_minutes: actualWhisperMinutes,
            duration_seconds: videoDurationSecs,
            original_url: url || null,
            uploaded_file: body.uploadedFileName || null,
          }
        };

        tokensUsed = autopsiaRes.tokens;

        // Costo dinámico autopsia (Reel=10 | Largo=30 | Masterclass=45)
        // calculateTitanCost lo maneja con videoDurationSecs
        settings._videoDurationSecs = videoDurationSecs;

        break;
      }

      case 'recreate': {
        console.log('[TITAN] 🪞 Modo: INGENIERÍA INVERSA OMEGA 3.0');

        // ── Multi-URL: el frontend envía body.urls (array) o body.url (string) ──
        const rawUrls: string[] = body.urls || (body.url ? [body.url] : []);
        const outputLanguage: string = body.outputLanguage || settings.outputLanguage || 'es';
        const languageNames: Record<string, string> = {
        'es': 'español — escribe como hispanohablante nativo, adapta modismos y referencias culturales',
        'en': 'English — write as a native English speaker, adapt idioms and cultural references',
        'pt': 'português brasileiro — escreva como falante nativo, adapte expressões e referências culturais',
        'fr': 'français — écris comme un locuteur natif, adapte les expressions et références culturelles'
};
const outputLanguageFull = languageNames[outputLanguage] || languageNames['es'];
        const urlCount = rawUrls.filter((u: string) => u && u.trim()).length;

        // Pasar urlCount al sistema de costos
        settings.urlCount = urlCount;

        let contentToAnalyze = "";
        let targetTopic      = processedContext;
        let platName         = settings.platform || platform || 'TikTok';
        let videoDescription = '';
        let actualWhisperMinutes = 0;
        let videoDurationSecs    = 0;
        let videoSource: 'url' | 'upload' | 'manual' = 'manual';

        // Colección de análisis individuales para modo multi-URL
        const multiAnalysis: any[] = [];

        try {
          if (rawUrls.length > 0 || body.uploadedVideo) {
            const sources = rawUrls.length > 0 ? rawUrls : [null];

            for (let i = 0; i < sources.length; i++) {
              const singleUrl = sources[i];
              console.log(`[RECREATE] 🎬 Procesando fuente ${i + 1}/${sources.length}...`);

              const videoData = await getVideoContent(
                singleUrl,
                i === 0 ? (body.uploadedVideo || null) : null,
                i === 0 ? (body.uploadedFileName || null) : null,
                openai
              );

              if (i === 0) {
                // Primera URL: datos principales
                contentToAnalyze  = (videoData.transcript || '').slice(0, 6000);
                videoDescription  = videoData.description;
                platName          = videoData.platform || platName;
                videoSource       = videoData.source;
                videoDurationSecs = videoData.duration || 0;
              } else {
              // ✅ Truncar cada transcript antes de concatenar para no explotar TPM
              const transcriptExtra = (videoData.transcript || '').slice(0, 2500);
              contentToAnalyze += `\n\n[VIDEO ${i + 1}]:\n${transcriptExtra}`;
              }

              if (videoData.duration > 0) {
                actualWhisperMinutes += Math.ceil(videoData.duration / 60);
              }

              // Análisis individual por URL (solo en modo multi-URL)
              if (rawUrls.length > 1) {
                console.log(`[RECREATE] 🔬 Analizando ADN del video ${i + 1}...`);
                const autopsiaIndividual = await ejecutarAutopsiaViral(
                  videoData.transcript,
                  platName,
                  openai
                );
                multiAnalysis.push(autopsiaIndividual.data);
              }
            }

            whisperMinutes = actualWhisperMinutes;

          } else if (processedContext && processedContext.length > 50) {
            console.log('[RECREATE] 📝 Usando texto manual');
            contentToAnalyze = processedContext;
            videoDescription = 'Transcripción manual';
            videoSource      = 'manual';
          } else {
            throw new Error('Proporciona URL(s), video subido, o transcripción manual.');
          }

        } catch (videoError: any) {
          console.error('[RECREATE] ❌ Error obteniendo contenido:', videoError.message);
          if (processedContext && processedContext.length > 50) {
            contentToAnalyze = processedContext;
            videoSource      = 'manual';
          } else {
            throw new Error(`Error: ${videoError.message}`);
          }
        }

        if (!contentToAnalyze || contentToAnalyze.length < 20) {
          throw new Error('Contenido insuficiente para análisis (mínimo 20 caracteres).');
        }

        // ── Autopsia del contenido principal (o contenido combinado) ──
        // 🚀 EJECUCIÓN DEL MOTOR PRO V900 — 21 Motores + Loop de Calidad
        
        // CRÍTICO: Inyectar el nicho/tema del usuario en el contexto
        // targetTopic = body.text = lo que el usuario escribió en "Tu nicho / tema"
        if (targetTopic && targetTopic.trim().length > 0) {
          (userContext as any).nicho = targetTopic.trim();
          (userContext as any).nicho_usuario_explicito = targetTopic.trim();
        }
        
        // Inyectar tipo de contenido para que el motor sepa la longitud objetivo
        (userContext as any).contentType = settings.contentType || 'reel';
        (userContext as any).targetPlatform = settings.platform || platName;
        (userContext as any).outputLanguage = outputLanguage;
        (userContext as any).outputLanguageFull = outputLanguageFull;
        
        // Inyectar duración del video original para adaptar umbrales
        userContext._videoDurationSecs = videoDurationSecs;

        // ✅ Inyectar ADN de todos los videos analizados individualmente
if (multiAnalysis.length > 1) {
  (userContext as any).multi_adn_sources = multiAnalysis.map((a: any) => ({
    genero: a.adn_profundo?.genero_narrativo,
    emocion: a.adn_profundo?.emocion_nucleo,
    hook: a.adn_estructura?.tipo_apertura,
    score: a.score_viral_estructural?.viralidad_estructural_global,
  }));
}

const motorRes = await ejecutarIngenieriaInversaPro(
  contentToAnalyze, 
  userContext,
  openai,
  videoDescription || platName  // usa la descripción del video como contexto de origen
);
        // 📦 ESTRUCTURACIÓN PARA FRONTEND (DOMINANCIA)
        result = {
          guion_generado: motorRes.data, // JSON PRO Completo
          autopsia: motorRes.data,       // Duplicado para compatibilidad visual
          modo: urlCount > 1 ? 'ingenieria_inversa_pro_hibrida' : 'ingenieria_inversa_pro',
          
          // Mantenemos toda la metadata de las fuentes originales
          metadata_video: {
            source: videoSource,
            platform: platName,
            description: videoDescription,
            whisper_used: actualWhisperMinutes > 0,
            whisper_minutes: actualWhisperMinutes,
            duration_seconds: videoDurationSecs,
            urls_analizadas: urlCount,
            original_url: rawUrls[0] || null,
            uploaded_file: body.uploadedFileName || null,
            nicho_usuario: targetTopic || userContext?.nicho || '',
          }
        };

        tokensUsed = motorRes.tokens;

        // Pasar duración al sistema de costos
        settings._videoDurationSecs = videoDurationSecs;

        break;
      }

      case 'generar_guion':
case 'generador_guiones': {
  console.log('[MODE] ✨ Generar Guion con Motor V700 (Texto + Visión + Pre-Análisis)');

  let temaUsuario = "";
  let modoGeneracion: 'idea' | 'texto' | 'imagen' = 'idea';
  let preAnalisis: any = null;

  // ── RUTA A: IMAGEN ──
  if (body.image) {
    console.log('[MOTOR V600] 📸 Imagen detectada. Activando análisis visual...');
    modoGeneracion = 'imagen';
    
    try {
      const conceptoVisual = await analizarImagenEstrategica(body.image, openai, {
        nicho:             (userContext as any).nicho           || settings.nicho     || 'General',
        avatar_ideal:      (userContext as any).avatar_ideal    || 'Audiencia objetivo',
        dolor_principal:   (userContext as any).dolor_principal || 'No especificado',
        deseo_principal:   (userContext as any).deseo_principal || 'No especificado',
        plataforma:        settings.platform                    || 'TikTok',
        formato_narrativo: settings.formato_narrativo           || 'EDUCATIVO_AUTORIDAD',
        expertProfile:     (userContext as any).expertProfile   || null,
      });
      const contextoAdicional = body.text || body.userInput || processedContext || "";
      temaUsuario = `[ANÁLISIS DE IMAGEN V700]: ${conceptoVisual}\n\n[INSTRUCCIÓN ADICIONAL USUARIO]: ${contextoAdicional}`;
      
      // Pre-análisis del concepto visual extraído (ya viene personalizado)
      preAnalisis = await preAnalizarInput(conceptoVisual, 'imagen', openai);
      console.log('[MOTOR V700] 🧬 Fusión Visual Contextualizada + Pre-análisis completados.');
    } catch (imgError: any) {
      console.error('[ERROR VISION]', imgError);
      throw new Error("Error analizando la imagen. Asegúrate de que sea JPG/PNG válido.");
    }

  // ── RUTA B: TEXTO LARGO (>150 chars = texto pegado) ──
  } else if (
    (body.text || body.userInput || processedContext) &&
    (body.text || body.userInput || processedContext || "").length > 150
  ) {
    const inputTexto = body.text || body.userInput || processedContext || "";
    console.log('[MOTOR V600] 📝 Texto largo detectado. Ejecutando análisis completo P1+P6...');
    modoGeneracion = 'texto';

    // P1: Detectar conflicto, insight, partes planas
    preAnalisis = await preAnalizarInput(inputTexto, 'texto', openai);

    // P6: Detectar si el texto ya tiene estructura narrativa propia
    const estructuraImplicita = await analizarEstructuraImplicita(inputTexto, openai);

    console.log(`[MOTOR V600] 🏗️ Estructura implícita: ${estructuraImplicita.tipo_estructura} → ${estructuraImplicita.instruccion}`);

    // Construir instrucción para el generador según estructura detectada
    let instruccionEstructura = '';

    if (estructuraImplicita.instruccion === 'preservar_y_elevar') {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — PRESERVAR Y ELEVAR]:
El texto original tiene estructura narrativa sólida (${estructuraImplicita.tipo_estructura}).
NO la destruyas. ELEVA su tensión, lenguaje y potencia emocional.
- Hook original a preservar: "${estructuraImplicita.hook_existente}"
- Cierre original a preservar: "${estructuraImplicita.cierre_existente}"
- Elementos fuertes a mantener: ${estructuraImplicita.elementos_fuertes.join(' | ')}
- Elementos débiles a reemplazar: ${estructuraImplicita.elementos_debiles.join(' | ')}
MISIÓN: Misma arquitectura, 3x más potencia narrativa.
`;
    } else if (estructuraImplicita.instruccion === 'extraer_y_reconstruir') {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — EXTRAER Y RECONSTRUIR]:
El texto tiene elementos valiosos pero estructura débil.
EXTRAE estos elementos fuertes: ${estructuraImplicita.elementos_fuertes.join(' | ')}
DESCARTA o transforma estos elementos débiles: ${estructuraImplicita.elementos_debiles.join(' | ')}
RECONSTRUYE con la arquitectura de 6 bloques obligatoria.
MISIÓN: Rescatar lo mejor, reconstruir el resto.
`;
    } else {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — REESTRUCTURAR COMPLETO]:
El texto no tiene estructura narrativa aprovechable.
Úsalo SOLO como fuente de datos, contexto y tema.
Construye la arquitectura completa desde cero con los bloques obligatorios.
MISIÓN: El texto es materia prima, no estructura.
`;
    }

    // Combinar P1 + P6 en el tema para el generador
    temaUsuario = `
[TEXTO ORIGINAL DEL USUARIO]:
${inputTexto.substring(0, 1500)}

[ADN NARRATIVO DETECTADO — P1]:
- Conflicto Central: ${preAnalisis.conflicto_central}
- Insight Explotable: ${preAnalisis.insight_explotable}
- Transformación: ${preAnalisis.transformacion_implicita}
- Emoción Dominante: ${preAnalisis.emocion_dominante}
- Tensión Base: ${preAnalisis.tension_detectada}/100
- Partes Débiles a Elevar: ${preAnalisis.partes_planas.join(' | ') || 'Ninguna detectada'}

[INSTRUCCIONES DEL PRE-ANÁLISIS — P1]:
${preAnalisis.instrucciones_para_generador}

${instruccionEstructura}
    `.trim();

    console.log(`[MOTOR V600] 🧬 Análisis P1+P6 completado | Tensión: ${preAnalisis.tension_detectada}/100 | Estructura: ${estructuraImplicita.instruccion}`);

    // Agregar al preAnalisis para el output final
    preAnalisis._estructura_implicita = {
      tipo: estructuraImplicita.tipo_estructura,
      instruccion: estructuraImplicita.instruccion,
      elementos_fuertes: estructuraImplicita.elementos_fuertes,
      elementos_debiles: estructuraImplicita.elementos_debiles,
      razon: estructuraImplicita.razon
    };

  // ── RUTA C: IDEA CORTA ──
  } else {
    temaUsuario = body.text || body.userInput || processedContext || settings.topic || userContext.nicho || "Tema General";
    modoGeneracion = 'idea';
    
    if (!temaUsuario || temaUsuario === "Tema General") {
      throw new Error("⚠️ Debes ingresar un tema, texto o imagen para generar el guion.");
    }
    
    console.log(`[MOTOR V600] 💡 Modo idea: "${temaUsuario.substring(0, 80)}"`);
  }

  // ══════════════════════════════════════════════════════════════════
  // 🌀 CAPA 0 — SISTEMA TCA IMPERIO (ANTES DEL MOTOR V600)
  // Expande el tema al punto de máximo alcance masivo estratégico.
  // NO modifica P1, P2, P3, P4, P5, P6 ni el loop de optimización.
  // ══════════════════════════════════════════════════════════════════
  let estrategiaTCA: any = null;
  const temaParaTCA = temaUsuario; // guardar tema original antes de expansión TCA

  // Si el tema ya viene pre-expandido desde Ideas Rápidas — no reexpandir
  if (settings?.tca_preexpandido) {
    console.log('[TCA IMPERIO] ⚡ Tema pre-expandido por Ideas Rápidas — CAPA 0 en bypass');
  } else {

  try {
    console.log('[TCA IMPERIO] 🌀 Ejecutando Sistema de Alcance Masivo...');
    const tcaResult = await ejecutarSistemaTCA(temaUsuario, settings, openai);

    estrategiaTCA = tcaResult.estrategia_tca;

    // Solo reemplazar el tema si TCA lo expandió exitosamente
    if (tcaResult.aprobado && tcaResult.tema_expandido && tcaResult.tema_expandido !== temaParaTCA) {
      temaUsuario = tcaResult.tema_expandido;
      // Guardar instrucción TCA separada para el contexto
      if (tcaResult.instruccion_tca) {
        (settings as any)._tca_instruccion = tcaResult.instruccion_tca;
      }
      console.log(`[TCA IMPERIO] ✅ Tema expandido al sector masivo`);
      console.log(`[TCA IMPERIO] 📊 Mass Appeal Score: ${estrategiaTCA?.mass_appeal_score || 0}/100`);
      console.log(`[TCA IMPERIO] 🎯 Nivel: ${estrategiaTCA?.nivel_original} → Intersección N2-N3`);
    } else {
      console.log('[TCA IMPERIO] ✅ Tema ya en posición óptima — sin expansión necesaria');
    }

    if (tcaResult.advertencias?.length > 0) {
      console.warn('[TCA IMPERIO] ⚠️ Advertencias TCA:', tcaResult.advertencias.join(' | '));
    }

  } catch (tcaError: any) {
    console.warn('[TCA IMPERIO] ⚠️ Bypass total — Motor V600 continúa sin modificación.', tcaError.message);
  }

  } // cierre del if (!settings?.tca_preexpandido)

  // ══════════════════════════════════════════════════════════════════
  // FIN CAPA 0 TCA — Motor V600 activándose a continuación
  // ══════════════════════════════════════════════════════════════════

  // ── CONTEXTO ENRIQUECIDO CON PRE-ANÁLISIS ──
  const contextoEnriquecido = {
    ...userContext,
    tema_especifico: temaUsuario,
    modo_generacion: modoGeneracion,
    pre_analisis: preAnalisis,
    estrategia_tca: estrategiaTCA  // ← TCA inyectado en el contexto del motor
  };
  
  // ── EJECUTAR MOTOR V600 ──
  const res = await ejecutarGeneradorGuiones(
    contextoEnriquecido, 
    null,
    openai, 
    settings
  );
  
  result = res.data;
  tokensUsed = res.tokens;
  
  // ── AGREGAR modo_generacion AL OUTPUT ──
  result.modo_generacion = modoGeneracion;
  if (preAnalisis) {
    result.pre_analisis_input = {
      tipo: modoGeneracion,
      conflicto_detectado: preAnalisis.conflicto_central,
      tension_base: preAnalisis.tension_detectada,
      partes_elevadas: preAnalisis.partes_planas
    };
  }
  
  console.log(`[MOTOR V600] ✅ Guion generado | Modo: ${modoGeneracion} | Score: ${result.score_predictivo?.viral_index || 'N/A'}`);
  break;
}

case 'tca_feedback': {
  console.log('[ROUTER] 📊 Guardando feedback TCA...');

  if (!userId) {
    result = { success: false, error: 'Usuario no identificado' };
    break;
  }

  await guardarFeedbackTCA(
    supabase,
    userId,
    body.guion_data || {},
    {
      resultado_categoria: body.resultado_categoria || 'normal',
      vistas_48h:          body.vistas_48h          || null,
      notas:               body.notas               || null
    }
  );

  result = {
    success: true,
    mensaje: '✅ Resultado guardado. El sistema aprende de tu experiencia.'
  };
  break;
}

      case 'juez_viral': {
  console.log('🚀 [ROUTER] Activando Juez Viral V500 OMEGA...');
  
  const texto = body.text || body.userInput || processedContext;
  if (!texto) throw new Error("⚠️ El Juez necesita un texto para analizar.");

  const contextoConUser = { ...userContext, userId };

  const res = await ejecutarJuezViralV500(
    contextoConUser, 
    texto, 
    openai,
    settings // mode y platform
  );
  
  result = res.data;
  tokensUsed = res.tokens;
  break;
}

     
      case 'audit_expert':
      case 'auditar_experto': {
        console.log('[ROUTER] 🚀 Iniciando Auditoría de Experto...');

        // 1. OBTENCIÓN Y PARSEO DE DATOS (CRÍTICO)
        // Tu frontend envía: transcript: JSON.stringify(formData)
        let expertData: any = {};
        
        try {
            if (body.transcript && typeof body.transcript === 'string') {
                // Caso normal: El frontend envió el JSON stringificado
                // Limpiamos posibles espacios en blanco antes de parsear
                const cleanJson = body.transcript.trim();
                
                if (cleanJson.startsWith('{')) {
                    expertData = JSON.parse(cleanJson);
                    console.log(`[ROUTER] ✅ Datos de experto recibidos: ${expertData.name || 'Sin nombre'}`);
                } else {
                    // Si el usuario envió texto plano en lugar de un formulario
                    expertData = { raw_input: cleanJson };
                }
            } else if (typeof body.transcript === 'object') {
                // Caso raro: Si el frontend envió el objeto directo
                expertData = body.transcript;
            } else {
                // Fallback
                expertData = { error: "Formato no reconocido", raw: String(body.transcript) };
            }
        } catch (e) {
            console.error("[ROUTER] ❌ Error parseando body.transcript:", e);
            // Creamos un objeto dummy para que la IA intente trabajar o falle con elegancia
            expertData = { raw_text: body.transcript || "Error de lectura" };
        }

        // 2. CONTEXTO DEL AVATAR (SI APLICA)
        // Si seleccionaste un avatar en el dropdown del frontend, buscamos sus datos
        let avatarContext = "";
        
        if (body.avatarId) {
            console.log(`[ROUTER] 🔗 Vinculando con Avatar ID: ${body.avatarId}`);
            
            const { data: avatar, error: avError } = await supabase
                .from('avatars')
                .select('name, pain_points, desires, current_situation, primary_goal')
                .eq('id', body.avatarId)
                .single();
            
            if (avatar && !avError) {
                avatarContext = `
                CONTEXTO DEL CLIENTE IDEAL (TARGET):
                Este experto le vende a un Avatar llamado "${avatar.name}".
                - Sus Dolores: ${avatar.pain_points}
                - Sus Deseos: ${avatar.desires}
                - Situación Actual: ${avatar.current_situation}
                - Objetivo del Avatar: ${avatar.primary_goal}
                
                NOTA PARA LA IA: Evalúa si la autoridad del experto es suficiente y relevante para ESTE avatar específico.
                `;
            } else {
                console.warn("[ROUTER] ⚠️ Avatar ID recibido pero no encontrado en DB.");
            }
        }

        // 3. URLS DE COMPETIDORES (OPCIONAL)
        const competitorUrls: string[] = body.competitorUrls || [];
        if (competitorUrls.length > 0) {
            console.log(`[ROUTER] 🕵️ URLs de competidores recibidas: ${competitorUrls.length}`);
        }

        // 4. EJECUCIÓN — MOTOR ESTRATÉGICO V2.0
        const res = await ejecutarAuditoriaExperto(
            expertData,
            avatarContext,
            openai,
            competitorUrls
        );

        // 4. RESPUESTA AL FRONTEND
        result = res.data;
        tokensUsed = res.tokens;

        // Metadata útil para depuración en el frontend
        result.metadata = {
            timestamp: new Date().toISOString(),
            analisis_realizado: true,
            nicho_detectado: expertData.niche || "No especificado",
            version_motor: "Titan Strategy V4.0"
        };
        break;
      }

    case 'audit_avatar': {
  console.log('🚀 [ROUTER] Iniciando Auditoría de Avatar...');
  
  // ==================================================================================
  // PASO 1: OBTENER Y PARSEAR DATOS
  // ==================================================================================
  
  let avatarData: any = {};
  let infoParaPrompt = "";

  try {
    // Si viene como JSON string, parseamos
    if (body.transcript && typeof body.transcript === 'string' && body.transcript.trim().startsWith('{')) {
      avatarData = JSON.parse(body.transcript);
      console.log('[AUDIT] ✅ JSON parseado exitosamente');
      console.log('[AUDIT] 📊 Campos recibidos:', Object.keys(avatarData));
      
      // ==================================================================================
      // ESTRATEGIA MEJORADA: ENVIAR JSON COMPLETO + RESUMEN LEGIBLE
      // ==================================================================================
      
      infoParaPrompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS COMPLETOS DEL AVATAR (JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(avatarData, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RESUMEN LEGIBLE (PARA ANÁLISIS RÁPIDO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 IDENTIDAD:
  • Nombre: ${avatarData.name || 'Sin nombre'}
  • Estado: ${avatarData.is_active ? '✅ Activo' : '⚠️ Inactivo'}

🧠 CORE (OBLIGATORIO):
  • Nivel Experiencia: ${avatarData.experience_level || 'N/A'}
  • Objetivo Principal: ${avatarData.primary_goal || 'N/A'}
  • Estilo Comunicación: ${avatarData.communication_style || 'N/A'}
  • Nivel Riesgo: ${avatarData.risk_level || 'N/A'}
  • Prioridad Contenido: ${avatarData.content_priority || 'N/A'}
  • Emoción Dominante: ${avatarData.dominant_emotion || 'N/A'}
  • Modelo de Éxito: ${avatarData.success_model || 'N/A'}

🛡️ PROHIBICIONES ACTIVAS:
${Object.entries(avatarData.prohibitions || {})
  .filter(([_, v]) => v === true)
  .map(([k]) => `  ✓ ${k.replace(/_/g, ' ')}`)
  .join('\n') || '  (Ninguna prohibición activa)'}

📚 VOCABULARIO:
  • Palabras Clave: ${
    Array.isArray(avatarData.signature_vocabulary) && avatarData.signature_vocabulary.length > 0
      ? avatarData.signature_vocabulary.join(', ')
      : 'No definidas'
  }
  • Palabras Prohibidas: ${
    Array.isArray(avatarData.banned_vocabulary) && avatarData.banned_vocabulary.length > 0
      ? avatarData.banned_vocabulary.join(', ')
      : 'No definidas'
  }

🎨 AVANZADO (OPCIONAL):
  • Estructura Narrativa: ${avatarData.narrative_structure || 'No definida'}
  • Longitud Preferida: ${avatarData.preferred_length || 'No definida'}
  • Estilo de CTA: ${avatarData.preferred_cta_style || 'No definido'}
  • Objetivos Secundarios: ${
    Array.isArray(avatarData.secondary_goals) && avatarData.secondary_goals.length > 0
      ? avatarData.secondary_goals.join(', ')
      : 'Ninguno'
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ INSTRUCCIÓN PARA EL AUDITOR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Analiza TODOS los campos del JSON completo (arriba)
2. Usa el resumen legible para análisis rápido
3. Penaliza campos vacíos o genéricos
4. Recompensa especificidad y coherencia
5. Devuelve el JSON optimizado con TODOS los campos sincronizados
`;

    } else {
      // Si el usuario escribió texto libre (fallback)
      console.log('[AUDIT] ⚠️ Texto libre detectado (no JSON)');
      infoParaPrompt = body.transcript || "Perfil vacío";
    }

  } catch (e) {
    console.error('[AUDIT] ❌ Error parseando JSON:', e);
    infoParaPrompt = body.transcript || "Error al procesar datos";
  }

  // ==================================================================================
  // PASO 2: OBTENER NICHO
  // ==================================================================================
  
  const nichoOperativo = body.niche || userContext.nicho || "General";
  console.log(`[AUDIT] 🎯 Nicho operativo: ${nichoOperativo}`);

  // ==================================================================================
  // PASO 3: VALIDACIÓN DE SEGURIDAD
  // ==================================================================================
  
  if (!infoParaPrompt || infoParaPrompt.trim().length < 20) {
    console.warn('[AUDIT] ⚠️ Datos insuficientes para auditoría');
    throw new Error('⚠️ Datos insuficientes. Completa al menos el nombre y los campos core.');
  }

  // ==================================================================================
  // PASO 3.5: SCRAPING DE COMENTARIOS CON APIFY (OPCIONAL)
  // ==================================================================================

  let comentariosExtraidos = '';

  const urlsCompetidores: string[] = body.competitorUrls || [];
  if (urlsCompetidores.length > 0) {
    console.log(`[AUDIT] 🕵️ Scraping comentarios de ${urlsCompetidores.length} URL(s)...`);
    const todosLosComentarios: string[] = [];

    for (const url of urlsCompetidores.slice(0, 3)) {
      try {
        const scraped = await scrapeYouTubeComments(url);
        if (scraped.comments.length > 0) {
          const frases = scraped.comments
            .slice(0, 30)
            .map((c: any) => `- "${c.text}" (👍 ${c.likes})`)
            .join('\n');
          todosLosComentarios.push(`VIDEO: ${scraped.videoTitle || url}\n${frases}`);
        }
      } catch (e) {
        console.warn(`[AUDIT] ⚠️ Error scraping ${url}:`, e);
      }
    }

    if (todosLosComentarios.length > 0) {
      comentariosExtraidos = todosLosComentarios.join('\n\n');
      console.log(`[AUDIT] ✅ Comentarios extraídos correctamente`);
    }
  }

  // ==================================================================================
  // PASO 4: EJECUTAR AUDITORÍA
  // ==================================================================================

  console.log('[AUDIT] 🚀 Ejecutando Titan Intelligence V2...');

  const res = await ejecutarAuditorAvatar(
    infoParaPrompt,
    nichoOperativo,
    openai,
    comentariosExtraidos
  );
  
  result = res.data;
  tokensUsed = res.tokens;
  
  // ==================================================================================
  // PASO 5: ENRIQUECER RESPUESTA CON METADATA
  // ==================================================================================
  
  result.metadata = {
    analisis_realizado: true,
    nicho_usado: nichoOperativo,
    timestamp: new Date().toISOString(),
    campos_analizados: Object.keys(avatarData).length,
    datos_originales_preservados: avatarData // 👈 NUEVO: Guardamos los datos originales
  };
  
  console.log('[AUDIT] ✅ Auditoría completada');
  console.log(`[AUDIT] 📊 Score obtenido: ${result.auditoria_calidad?.score_global || 'N/A'}/100`);
  
  break;
}

       case 'mentor_estrategico':
      case 'mentor_ia':
      case 'chat_expert':
      case 'chat_avatar': {
         const res = await ejecutarMentorEstrategico(userContext, processedContext, openai);
         result = res.data;
         tokensUsed = res.tokens;
         break;
      }

      case 'copy_expert': {
    console.log('[TITAN] 📝 Iniciando Copy Expert Multiplataforma...');

    let contenidoOriginal = "";
    let copyWhisperMinutes = 0;        // ✅ FIX: nombre distinto, no shadow
    let videoSource: 'url' | 'upload' | 'manual' = 'manual';

    // ==================================================================================
    // PASO 1: OBTENER CONTENIDO (Texto / URL / Video Subido)
    // ==================================================================================

    try {
        // Prioridad 1: Video Subido o URL (requiere transcripción)
        if (url || body.uploadedVideo) {
            console.log('[COPY EXPERT] 🎬 Obteniendo contenido de video...');
            
            const videoData = await getVideoContent(
                url || null,
                body.uploadedVideo || null,
                body.uploadedFileName || null,
                openai
            );
            
            contenidoOriginal = videoData.transcript;
            videoSource = videoData.source;
            
            if (videoData.duration > 0) {
                copyWhisperMinutes = Math.ceil(videoData.duration / 60);
        //    whisperMinutes = copyWhisperMinutes;  // ← actualiza la variable externa
                console.log(`[COPY EXPERT] 🎤 Whisper usado: ${whisperMinutes} minutos`);
            }
        }
        // Prioridad 2: Texto manual
        else if (processedContext && processedContext.length > 20) {
            console.log('[COPY EXPERT] 📝 Usando texto manual');
            contenidoOriginal = processedContext;
            videoSource = 'manual';
        }
        else {
            throw new Error('⚠️ Proporciona contenido (texto, URL o video).');
        }

    } catch (videoError: any) {
        console.error('[COPY EXPERT] ❌ Error obteniendo contenido:', videoError.message);
        
        // Fallback: usar texto manual si está disponible
        if (processedContext && processedContext.length > 20) {
            console.log('[COPY EXPERT] ⚠️ Usando texto manual como fallback');
            contenidoOriginal = processedContext;
            videoSource = 'manual';
        } else {
            throw new Error(`Error obteniendo contenido: ${videoError.message}`);
        }
    }

    // Validación final
    if (!contenidoOriginal || contenidoOriginal.length < 20) {
        throw new Error('⚠️ Contenido insuficiente. Mínimo 20 caracteres.');
    }

    console.log(`[COPY EXPERT] ✅ Contenido obtenido: ${contenidoOriginal.length} caracteres`);

    // ==================================================================================
    // PASO 2: CONFIGURAR SETTINGS
    // ==================================================================================

    const copySettings = {
        red_social: settings.red_social || body.settings?.red_social || 'TikTok',
        formato: settings.formato || body.settings?.formato || 'Video',
        objetivo: settings.objetivo || body.settings?.objetivo || 'Educar / Valor',
        tipo_contenido: body.settings?.tipo_contenido || undefined
    };

    console.log(`[COPY EXPERT] ⚙️ Configuración:`);
    console.log(`  - Red Social: ${copySettings.red_social}`);
    console.log(`  - Formato: ${copySettings.formato}`);
    console.log(`  - Objetivo: ${copySettings.objetivo}`);

    // ==================================================================================
    // PASO 3: EJECUTAR COPY EXPERT
    // ==================================================================================

    console.log('[COPY EXPERT] 🚀 Ejecutando traducción cognitiva...');

    const copyRes = await ejecutarCopyExpert(
        contenidoOriginal,
        userContext,
        openai,
        copySettings
    );

    result = copyRes.data;
    tokensUsed = copyRes.tokens;

    // ==================================================================================
    // PASO 4: ENRIQUECER RESULTADO CON METADATA
    // ==================================================================================

    result.metadata_procesamiento = {
        source: videoSource,
        whisper_usado: copyWhisperMinutes > 0,
    // whisper_minutos: copyWhisperMinutes,

       longitud_original: contenidoOriginal.length,
        url_original: url || null,
        archivo_subido: body.uploadedFileName || null,
        timestamp: new Date().toISOString()
    };

    console.log('[COPY EXPERT] ✅ Copy generado exitosamente');
    console.log(`[COPY EXPERT] 📊 Score de calidad: ${result.validacion_interna?.score_calidad || 'N/A'}`);
    
    break;
    }

    } // ← CIERRA EL SWITCH CASE

    // ==================================================================================
    // 💰 SISTEMA DE COBROS Y GUARDADO
    // ==================================================================================

    const calculatedPrice = calculateTitanCost(
  selectedMode,
  processedContext,
  whisperMinutes,
  settings,
  settings._videoDurationSecs || 0
);
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    // 1. Cobrar créditos
    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', userId).single();
      
      if (profile?.tier !== 'admin') {
         if ((profile?.credits || 0) < finalCost) {
            throw new Error(`Saldo insuficiente. Costo: ${finalCost} créditos.`);
         }
         
         const { error: creditError } = await supabase.rpc('decrement_credits', { user_uuid: userId, amount: finalCost });
         if (creditError) console.error(`[COBROS] ❌ Error: ${creditError.message}`);
      }
    }

    // 2. Guardar en Historial
    const noSaveModes = ['chat_avatar', 'mentor_ia', 'mentor', 'chat_expert', 'chat_mentor'];

    if (!noSaveModes.includes(selectedMode)) {
      await supabase.from('viral_generations').insert({ 
        user_id: userId, 
        type: selectedMode, 
        content: result, 
        original_url: url || null, 
        cost_credits: finalCost, 
        platform: platform || 'general', 
        tokens_used: tokensUsed, 
        whisper_minutes: whisperMinutes
      });
    }
      
    // 3. Evolución del Avatar
    if (activeAvatar && !noSaveModes.includes(selectedMode)) {
        try {
            const avatarMw = new AvatarMiddleware(supabase);
            await avatarMw.incrementContentCount();
        } catch (e) { console.error("Error evolución:", e); }
    }

    // ==================================================================================
    // 📤 RESPUESTA FINAL
    // ==================================================================================
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        generatedData: result, 
        finalCost, 
        avatar_used: activeAvatar ? { id: activeAvatar.id, name: activeAvatar.name } : null,
        metadata: { mode: selectedMode, duration: Date.now() - startTime } 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error(`[ERROR CRÍTICO]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }), 
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
// 🛑 FIN DEL ARCHIVO - NO PEGUES NADA DEBAJO DE ESTO